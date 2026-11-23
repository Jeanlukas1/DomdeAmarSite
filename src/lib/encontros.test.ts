// Casos de borda do calendário dos encontros: virada de mês e de ano, Santa Ceia e limites de duração.
// As datas são horário de São Paulo (−03:00). A grade abaixo é a regra da igreja, não o conteúdo
// editável: assim o teste confere a lógica mesmo que os textos mudem no painel.
import { describe, expect, it } from 'vitest';
import {
  destaqueDaSemana,
  gradeSemanal,
  proximoEncontro,
  situacaoDaSemana,
  type Alteracao,
  type Encontro,
} from './encontros';

const grade: Encontro[] = [
  { id: 'terca-oracao', diaSemana: 2, hora: '19:00' },
  { id: 'domingo-estudo', diaSemana: 0, hora: '09:00' },
  { id: 'domingo-plenitude', diaSemana: 0, hora: '18:00', recebeTema: true },
  {
    id: 'santa-ceia',
    diaSemana: 0,
    hora: '10:00',
    ocorrencia: '2',
    substituiODia: true,
    duracaoMin: 240,
    recebeTema: true,
  },
];

interface Caso {
  descricao: string;
  agora: string;
  proximo: string;
  quando: string;
  /** a Ceia aparece na grade */
  ceia: boolean;
  /** ids com o aviso "neste domingo não há" */
  avisos: string[];
  destaque: string;
}

const SUBSTITUIDOS = ['domingo-estudo', 'domingo-plenitude'];

const casos: Caso[] = [
  {
    descricao: 'dia 1 é domingo: é um domingo comum (a Ceia é no 2º)',
    agora: '2026-11-01T08:00',
    proximo: 'domingo-estudo',
    quando: 'hoje',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-01',
  },
  {
    descricao: 'domingo anterior à Ceia, depois da Plenitude: a Ceia já aparece',
    agora: '2026-11-01T20:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-11-08',
  },
  {
    descricao: 'sábado à noite antes da Ceia',
    agora: '2026-11-07T20:00',
    proximo: 'santa-ceia',
    quando: 'amanha',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-11-08',
  },
  {
    descricao: 'domingo de Ceia às 8h: não há Seminário',
    agora: '2026-11-08T08:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-11-08',
  },
  {
    descricao: 'domingo de Ceia durante a Ceia',
    agora: '2026-11-08T11:30',
    proximo: 'santa-ceia',
    quando: 'agora',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-11-08',
  },
  {
    descricao: 'um minuto antes do fim da Ceia (10h + 240 min = 14h)',
    agora: '2026-11-08T13:59',
    proximo: 'santa-ceia',
    quando: 'agora',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-11-08',
  },
  {
    descricao: 'um minuto depois do fim da Ceia: não há Plenitude às 18h',
    agora: '2026-11-08T14:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-15',
  },
  {
    descricao: 'domingo de Ceia às 18h30: a Plenitude não acontece',
    agora: '2026-11-08T18:30',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-15',
  },
  {
    descricao: 'virada de mês: o próximo domingo (6/12) é o 1º, comum',
    agora: '2026-11-30T10:00',
    proximo: 'terca-oracao',
    quando: 'amanha',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-12-06',
  },
  {
    descricao: 'virada de mês: durante o culto de terça, 1º de dezembro',
    agora: '2026-12-01T19:30',
    proximo: 'terca-oracao',
    quando: 'agora',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-12-06',
  },
  {
    descricao: '1º domingo de dezembro, à noite: a Ceia de 13/12 já aparece',
    agora: '2026-12-06T20:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-12-13',
  },
  {
    descricao: 'terça na semana da Ceia de dezembro',
    agora: '2026-12-08T19:30',
    proximo: 'terca-oracao',
    quando: 'agora',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-12-13',
  },
  {
    descricao: 'sábado à noite antes da Ceia de dezembro',
    agora: '2026-12-12T22:00',
    proximo: 'santa-ceia',
    quando: 'amanha',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-12-13',
  },
  {
    descricao: 'domingo de Ceia de dezembro, antes dela',
    agora: '2026-12-13T09:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2026-12-13',
  },
  {
    descricao: 'virada de ano: 3/1/2027 é o 1º domingo (comum); a Ceia é dia 10',
    agora: '2026-12-31T23:00',
    proximo: 'domingo-estudo',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2027-01-03',
  },
  {
    descricao: 'dia 1 numa segunda: o 1º domingo é dia 7, comum',
    agora: '2027-02-07T08:00',
    proximo: 'domingo-estudo',
    quando: 'hoje',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2027-02-07',
  },
  {
    descricao: 'dia 1 numa segunda: a Ceia é dia 14',
    agora: '2027-02-14T08:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: SUBSTITUIDOS,
    destaque: 'santa-ceia@2027-02-14',
  },
];

const emSaoPaulo = (s: string) => new Date(`${s}:00-03:00`);

describe('calendário dos encontros', () => {
  it.each(casos)('$agora — $descricao', (c) => {
    const agora = emSaoPaulo(c.agora);
    const proximo = proximoEncontro(grade, agora);
    const situacao = situacaoDaSemana(grade, agora);
    const destaque = destaqueDaSemana(grade, undefined, agora);

    expect({
      proximo: proximo?.vez.encontro.id,
      quando: proximo?.quando,
      ceia: situacao.find((s) => s.encontro.id === 'santa-ceia')?.mostrar,
      avisos: situacao.filter((s) => s.substituidoPor).map((s) => s.encontro.id),
      destaque: destaque && `${destaque.vez.encontro.id}@${destaque.vez.data}`,
    }).toEqual({
      proximo: c.proximo,
      quando: c.quando,
      ceia: c.ceia,
      avisos: c.avisos,
      destaque: c.destaque,
    });
  });

  it('o tema da semana só vale na data do encontro a que pertence', () => {
    const agora = emSaoPaulo('2026-11-07T20:00');
    expect(destaqueDaSemana(grade, '2026-11-08', agora)?.temTema).toBe(true);
    expect(destaqueDaSemana(grade, '2026-11-01', agora)?.temTema).toBe(false);
  });

  it('a grade semanal junta os horários de cada dia', () => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    expect(gradeSemanal(grade, dias)).toBe('Terça 19h · Domingo 9h e 18h');
  });
});

// Alterações (R20, R21): cancelamentos e mudanças de horário ou local numa data. A regra é a do
// app (spec 001 do app, R9, R22 e R23): o cancelado nunca é o próximo nem "acontecendo agora",
// e continua aparecendo na data dele, marcado; o alterado vale no horário e no local novos.
const cancelado = (alvo: string, data: string): Alteracao => ({
  alvo,
  data,
  situacao: 'cancelado',
  novaHora: null,
  novoLocal: null,
  mensagem: 'Culto cancelado por causa da chuva.',
});
const alterado = (
  alvo: string,
  data: string,
  novaHora: string | null,
  novoLocal: string | null = null,
): Alteracao => ({
  alvo,
  data,
  situacao: 'alterado',
  novaHora,
  novoLocal,
  mensagem: 'Mudamos o horário nesta semana.',
});

describe('calendário com alterações', () => {
  it('o próximo encontro cancelado dá lugar ao seguinte', () => {
    // sábado à noite: o próximo seria o Seminário de domingo 9h
    const agora = emSaoPaulo('2026-11-14T20:00');
    const r = proximoEncontro(grade, agora, [cancelado('domingo-estudo', '2026-11-15')]);
    expect(r && `${r.vez.encontro.id}@${r.vez.data}`).toBe('domingo-plenitude@2026-11-15');
  });
});
