// Casos de borda do calendário dos encontros: virada de mês e de ano, Santa Ceia e limites de duração.
// As datas são horário de São Paulo (−03:00). A grade abaixo é a regra da igreja, não o conteúdo
// editável: assim o teste confere a lógica mesmo que os textos mudem no painel.
import { describe, expect, it } from 'vitest';
import {
  destaqueDaSemana,
  eventoComAlteracao,
  gradeSemanal,
  proximoEncontro,
  situacaoDaSemana,
  type Alteracao,
  type Vez,
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

describe('mudança de horário', () => {
  it('adiada: às 10h o Seminário passado para as 11h ainda não começou', () => {
    const agora = emSaoPaulo('2026-11-15T10:00');
    const r = proximoEncontro(grade, agora, [alterado('domingo-estudo', '2026-11-15', '11:00')]);
    expect({
      proximo: r && `${r.vez.encontro.id}@${r.vez.data}`,
      hora: r?.vez.hora,
      quando: r?.quando,
      mudou: r?.vez.alteracao?.situacao,
    }).toEqual({
      proximo: 'domingo-estudo@2026-11-15',
      hora: '11:00',
      quando: 'hoje',
      mudou: 'alterado',
    });
  });

  it('antecipada: às 17h a Plenitude passada para as 16h já está acontecendo', () => {
    const agora = emSaoPaulo('2026-11-15T17:00');
    const r = proximoEncontro(grade, agora, [alterado('domingo-plenitude', '2026-11-15', '16:00')]);
    expect([r?.vez.encontro.id, r?.vez.hora, r?.quando]).toEqual([
      'domingo-plenitude',
      '16:00',
      'agora',
    ]);
  });

  it('passada para depois de outro encontro do dia, troca a ordem', () => {
    const agora = emSaoPaulo('2026-11-15T08:00');
    const r = proximoEncontro(grade, agora, [alterado('domingo-estudo', '2026-11-15', '19:00')]);
    expect(r?.vez.encontro.id).toBe('domingo-plenitude');
  });

  it('só o local mudou: mantém o horário e leva a alteração junto', () => {
    const agora = emSaoPaulo('2026-11-15T08:00');
    const r = proximoEncontro(grade, agora, [
      alterado('domingo-estudo', '2026-11-15', null, 'Praça de Jaconé'),
    ]);
    expect([r?.vez.hora, r?.vez.alteracao?.novoLocal]).toEqual(['09:00', 'Praça de Jaconé']);
  });

  it('a alteração vale só na data dela: no domingo seguinte, o horário de sempre', () => {
    const agora = emSaoPaulo('2026-11-21T20:00');
    const r = proximoEncontro(grade, agora, [alterado('domingo-estudo', '2026-11-15', '11:00')]);
    expect([r?.vez.data, r?.vez.hora, r?.vez.alteracao]).toEqual([
      '2026-11-22',
      '09:00',
      undefined,
    ]);
  });
});

describe('alterações na grade e no destaque', () => {
  const resumo = (v: Vez) => `${v.data} ${v.alteracao?.situacao} ${v.hora}`;

  it('o cartão do encontro mostra a vez cancelada, e a próxima vez é a da semana seguinte', () => {
    const agora = emSaoPaulo('2026-11-14T20:00');
    const s = situacaoDaSemana(grade, agora, [cancelado('domingo-estudo', '2026-11-15')]).find(
      (x) => x.encontro.id === 'domingo-estudo',
    );
    expect({
      alteradas: s?.alteradas.map(resumo),
      proxima: s?.proxima?.data,
    }).toEqual({ alteradas: ['2026-11-15 cancelado 09:00'], proxima: '2026-11-22' });
  });

  const ceia = (alteracoes: Alteracao[]) => {
    const agora = emSaoPaulo('2026-11-07T20:00');
    const situacao = situacaoDaSemana(grade, agora, alteracoes);
    const s = situacao.find((x) => x.encontro.id === 'santa-ceia');
    const r = proximoEncontro(grade, agora, alteracoes);
    return {
      proximo: r && `${r.vez.encontro.id}@${r.vez.data} ${r.vez.hora}`,
      ceia: s?.mostrar,
      alteradas: s?.alteradas.map(resumo),
      avisos: situacao.filter((x) => x.substituidoPor).map((x) => x.encontro.id),
    };
  };

  it('Santa Ceia em outro horário: continua substituindo o dia, no horário novo', () => {
    expect(ceia([alterado('santa-ceia', '2026-11-08', '15:00')])).toEqual({
      proximo: 'santa-ceia@2026-11-08 15:00',
      ceia: true,
      alteradas: ['2026-11-08 alterado 15:00'],
      avisos: SUBSTITUIDOS,
    });
  });

  it('Santa Ceia cancelada: aparece cancelada, e os encontros do domingo continuam sem acontecer', () => {
    // o cancelamento vale para aquela ocorrência; não devolve ao dia os encontros substituídos
    // (uma alteração neles naquele domingo nem é publicada: eles não acontecem nessa data)
    expect(ceia([cancelado('santa-ceia', '2026-11-08')])).toEqual({
      proximo: 'terca-oracao@2026-11-10 19:00',
      ceia: true,
      alteradas: ['2026-11-08 cancelado 10:00'],
      avisos: SUBSTITUIDOS,
    });
  });

  it('o destaque da semana pula a Plenitude cancelada e acompanha a mudança de horário', () => {
    const agora = emSaoPaulo('2026-11-14T20:00');
    const pulou = destaqueDaSemana(grade, '2026-11-15', agora, [
      cancelado('domingo-plenitude', '2026-11-15'),
    ]);
    const mudou = destaqueDaSemana(grade, '2026-11-15', agora, [
      alterado('domingo-plenitude', '2026-11-15', '19:30'),
    ]);
    expect({
      pulou: pulou && `${pulou.vez.data} ${pulou.temTema}`,
      mudou: mudou && `${mudou.vez.data} ${mudou.vez.hora} ${mudou.vez.alteracao?.situacao}`,
    }).toEqual({ pulou: '2026-11-22 false', mudou: '2026-11-15 19:30 alterado' });
  });
});

describe('alterações de eventos e na virada do mês', () => {
  const evento = {
    id: 'cantata-de-natal',
    titulo: 'Cantata de Natal',
    data: '2026-12-20',
    hora: '19:00',
    local: 'Templo',
  };

  it('evento alterado: vale o horário e o local novos, com a alteração junto', () => {
    const e = eventoComAlteracao(evento, [
      alterado('cantata-de-natal', '2026-12-20', '20:00', 'Praça de Jaconé'),
    ]);
    expect([e.hora, e.local, e.alteracao?.mensagem]).toEqual([
      '20:00',
      'Praça de Jaconé',
      'Mudamos o horário nesta semana.',
    ]);
  });

  it('evento cancelado continua na agenda, marcado; alteração de outro alvo ou data não conta', () => {
    const e = eventoComAlteracao(evento, [
      cancelado('cantata-de-natal', '2026-12-20'),
      alterado('cantata-de-natal', '2026-12-21', '08:00'),
      alterado('outro-evento', '2026-12-20', '08:00'),
    ]);
    expect([e.hora, e.local, e.alteracao?.situacao]).toEqual(['19:00', 'Templo', 'cancelado']);
    expect(eventoComAlteracao(evento, [cancelado('outro-evento', '2026-12-20')])).toEqual(evento);
  });

  it('virada de mês: o cancelamento da terça, 1º de dezembro, vale a partir de 30 de novembro', () => {
    const agora = emSaoPaulo('2026-11-30T10:00');
    const r = proximoEncontro(grade, agora, [cancelado('terca-oracao', '2026-12-01')]);
    expect(r && `${r.vez.encontro.id}@${r.vez.data}`).toBe('domingo-estudo@2026-12-06');
  });
});
