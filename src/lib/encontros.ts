// Calendário dos encontros no fuso de Jaconé (America/Sao_Paulo), independente do fuso do
// visitante. Entende encontros semanais e mensais ("1º domingo do mês") e encontros que
// substituem os outros do mesmo dia (a Santa Ceia). Puro e sem DOM: reaproveitável no app futuro
// e rodável no Node (scripts/checar-encontros.ts) — por isso sem imports com "@/".

export type Ocorrencia = 'semanal' | '1' | '2' | '3' | '4' | 'ultima';

export interface Encontro {
  id: string;
  /** 0 = domingo … 6 = sábado */
  diaSemana: number;
  /** "HH:MM" */
  hora: string;
  ocorrencia?: Ocorrencia;
  /** neste dia, os outros encontros não acontecem */
  substituiODia?: boolean;
  /** por quanto tempo conta como "acontecendo agora" */
  duracaoMin?: number;
  /** o tema da semana (cultos-secao → semana) é deste encontro */
  recebeTema?: boolean;
}

/** Uma vez em que o encontro acontece. Minutos contados a partir de hoje 00:00 (São Paulo). */
export interface Vez<T extends Encontro = Encontro> {
  encontro: T;
  /** AAAA-MM-DD */
  data: string;
  diaSemana: number;
  /** 0 = hoje, 1 = amanhã… */
  diasAte: number;
  inicio: number;
  fim: number;
}

export type Quando = 'agora' | 'hoje' | 'amanha' | 'semana';

const FUSO = 'America/Sao_Paulo';
const DURACAO_PADRAO = 120;
/** janela do cálculo: cobre qualquer "1º domingo" seguinte */
const JANELA_DIAS = 42;

const pad = (n: number) => String(n).padStart(2, '0');

/** Data e hora de agora no fuso da igreja. */
export function agoraEmSaoPaulo(agora: Date) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(agora);
  const n = (t: string) => Number(partes.find((p) => p.type === t)?.value ?? 0);
  const ano = n('year');
  const mes = n('month');
  const dia = n('day');
  return {
    ano,
    mes,
    dia,
    diaSemana: new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay(),
    minutos: n('hour') * 60 + n('minute'),
  };
}

const minutosDe = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

/** O encontro cai nesta data? (regra semanal ou n-ésimo dia da semana do mês) */
function cai(e: Encontro, dia: number, diaSemana: number, diasNoMes: number) {
  if (e.diaSemana !== diaSemana) return false;
  const oc = e.ocorrencia ?? 'semanal';
  if (oc === 'semanal') return true;
  if (oc === 'ultima') return dia + 7 > diasNoMes;
  return Math.ceil(dia / 7) === Number(oc);
}

/**
 * Todas as vezes dos próximos `dias` dias (a partir de hoje), já com as substituições aplicadas.
 * `substituidas` guarda as que não acontecem, com quem as substituiu.
 */
export function calendario<T extends Encontro>(
  encontros: T[],
  agora = new Date(),
  dias = JANELA_DIAS,
) {
  const hoje = agoraEmSaoPaulo(agora);
  const vezes: Vez<T>[] = [];
  const substituidas: { vez: Vez<T>; por: Vez<T> }[] = [];

  for (let i = 0; i < dias; i++) {
    const d = new Date(Date.UTC(hoje.ano, hoje.mes - 1, hoje.dia + i));
    const ano = d.getUTCFullYear();
    const mes = d.getUTCMonth() + 1;
    const dia = d.getUTCDate();
    const diaSemana = d.getUTCDay();
    const diasNoMes = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
    const data = `${ano}-${pad(mes)}-${pad(dia)}`;

    const doDia: Vez<T>[] = encontros
      .filter((e) => cai(e, dia, diaSemana, diasNoMes))
      .map((encontro) => {
        const inicio = i * 1440 + minutosDe(encontro.hora);
        return {
          encontro,
          data,
          diaSemana,
          diasAte: i,
          inicio,
          fim: inicio + (encontro.duracaoMin ?? DURACAO_PADRAO),
        };
      });

    const substituto = doDia.find((v) => v.encontro.substituiODia);
    for (const vez of doDia) {
      if (substituto && !vez.encontro.substituiODia) substituidas.push({ vez, por: substituto });
      else vezes.push(vez);
    }
  }
  vezes.sort((a, b) => a.inicio - b.inicio);
  return { hoje, vezes, substituidas };
}

const quandoDe = (vez: Vez, minutosAgora: number): Quando =>
  vez.inicio <= minutosAgora
    ? 'agora'
    : vez.diasAte === 0
      ? 'hoje'
      : vez.diasAte === 1
        ? 'amanha'
        : 'semana';

/** O próximo encontro que ainda não terminou (pode estar acontecendo agora). */
export function proximoEncontro<T extends Encontro>(encontros: T[], agora = new Date()) {
  const { hoje, vezes } = calendario(encontros, agora);
  const vez = vezes.find((v) => v.fim > hoje.minutos);
  return vez && { vez, quando: quandoDe(vez, hoje.minutos) };
}

export interface SituacaoEncontro<T extends Encontro> {
  encontro: T;
  /** próxima vez que acontece de fato */
  proxima?: Vez<T>;
  /** cancelado pelo substituto do dia (ex.: domingo de Ceia), enquanto ele não termina */
  substituidoPor?: Vez<T>;
  /**
   * Aparece na grade agora? Encontros semanais, sempre. Os não semanais (a Ceia), só quando a
   * próxima vez deles é o próximo encontro naquele dia da semana ("a semana da Ceia").
   */
  mostrar: boolean;
}

/** Situação de cada encontro para a grade da seção Cultos. */
export function situacaoDaSemana<T extends Encontro>(encontros: T[], agora = new Date()) {
  const { hoje, vezes, substituidas } = calendario(encontros, agora);
  const futuras = vezes.filter((v) => v.fim > hoje.minutos);

  const base = encontros.map((encontro) => {
    const proxima = futuras.find((v) => v.encontro === encontro);
    const semanal = (encontro.ocorrencia ?? 'semanal') === 'semanal';
    const mostrar =
      semanal ||
      (!!proxima &&
        !futuras.some(
          (v) =>
            v.encontro !== encontro &&
            v.diaSemana === proxima.diaSemana &&
            v.inicio < proxima.inicio,
        ));
    return { encontro, proxima, mostrar };
  });
  // vezes de substitutos que estão na grade agora (a Ceia na semana dela)
  const visiveis = new Set(base.filter((b) => b.mostrar && b.proxima).map((b) => b.proxima));

  return base.map((b): SituacaoEncontro<T> => ({
    ...b,
    substituidoPor: substituidas.find((s) => s.vez.encontro === b.encontro && visiveis.has(s.por))
      ?.por,
  }));
}

/**
 * O encontro do destaque da semana: o próximo que recebe o tema. Na semana da Ceia, o Culto da
 * Plenitude é substituído e o destaque vira a Ceia sozinho. O tema só vale se a data bater.
 */
export function destaqueDaSemana<T extends Encontro>(
  encontros: T[],
  temaData: string | undefined,
  agora = new Date(),
) {
  const { hoje, vezes } = calendario(encontros, agora);
  const vez = vezes.find((v) => v.encontro.recebeTema && v.fim > hoje.minutos);
  return vez && { vez, quando: quandoDe(vez, hoje.minutos), temTema: vez.data === temaData };
}

/** "09:00" → "9h", "19:30" → "19h30" */
export const horaCurta = (hora: string) =>
  hora.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');

/**
 * Grade semanal em uma linha, sempre verdadeira (fallback sem JS):
 * "Terça 19h · Domingo 9h e 18h". `dias` = nomes de domingo a sábado.
 */
export function gradeSemanal(encontros: Encontro[], dias: string[], e = 'e') {
  const porDia = new Map<number, string[]>();
  for (const enc of [...encontros].sort((a, b) => minutosDe(a.hora) - minutosDe(b.hora))) {
    if ((enc.ocorrencia ?? 'semanal') !== 'semanal') continue;
    porDia.set(enc.diaSemana, [...(porDia.get(enc.diaSemana) ?? []), horaCurta(enc.hora)]);
  }
  // a semana começa na segunda: domingo por último
  return [...porDia.entries()]
    .sort(([a], [b]) => ((a + 6) % 7) - ((b + 6) % 7))
    .map(([d, horas]) => `${dias[d]} ${horas.join(` ${e} `)}`)
    .join(' · ');
}
