// Calcula o próximo culto no fuso de Jaconé (America/Sao_Paulo), independente do fuso do visitante.
// Puro e sem DOM: reaproveitável no app futuro.

export interface CultoHorario {
  id: string;
  /** 0 = domingo … 6 = sábado */
  diaSemana: number;
  /** "HH:MM" */
  hora: string;
}

export type Quando = 'agora' | 'hoje' | 'amanha' | 'semana';

const FUSO = 'America/Sao_Paulo';
/** por quanto tempo um culto que já começou ainda conta como "acontecendo agora" */
const DURACAO_MIN = 120;
const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 } as const;

function agoraEmSaoPaulo(agora: Date) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(agora);
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? '0';
  return {
    dia: DIAS[get('weekday') as keyof typeof DIAS],
    minutos: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export function proximoCulto<T extends CultoHorario>(cultos: T[], agora = new Date()) {
  const { dia, minutos } = agoraEmSaoPaulo(agora);
  let melhor: { culto: T; faltam: number } | undefined;

  for (const culto of cultos) {
    const [h, m] = culto.hora.split(':').map(Number);
    const inicio = h * 60 + m;
    let dias = (culto.diaSemana - dia + 7) % 7;
    // hoje, mas já terminou: só na semana que vem
    if (dias === 0 && minutos > inicio + DURACAO_MIN) dias = 7;
    const faltam = dias * 1440 + inicio - minutos; // minutos até começar (negativo = em andamento)
    if (!melhor || faltam < melhor.faltam) melhor = { culto, faltam };
  }
  if (!melhor) return undefined;

  const diasAte = Math.floor((melhor.faltam + minutos) / 1440);
  const quando: Quando =
    melhor.faltam <= 0 ? 'agora' : diasAte === 0 ? 'hoje' : diasAte === 1 ? 'amanha' : 'semana';
  return { ...melhor, quando };
}
