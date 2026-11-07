// Confere o calendário dos encontros (src/lib/encontros.ts) nos casos de borda — sem framework de
// testes. Rodar: npm run checar:encontros (Node ≥ 23 roda TypeScript direto).
// As datas são horário de São Paulo (−03:00). A grade abaixo é a regra da igreja, não o conteúdo
// editável: assim o teste confere a lógica mesmo que os textos mudem no painel.
import {
  destaqueDaSemana,
  gradeSemanal,
  proximoEncontro,
  situacaoDaSemana,
  type Encontro,
} from '../src/lib/encontros.ts';

const grade: Encontro[] = [
  { id: 'terca-oracao', diaSemana: 2, hora: '19:00' },
  { id: 'domingo-estudo', diaSemana: 0, hora: '09:00' },
  { id: 'domingo-plenitude', diaSemana: 0, hora: '18:00', recebeTema: true },
  {
    id: 'santa-ceia',
    diaSemana: 0,
    hora: '10:00',
    ocorrencia: '1',
    substituiODia: true,
    duracaoMin: 240,
    recebeTema: true,
  },
];

interface Caso {
  agora: string;
  proximo: string;
  quando: string;
  /** a Ceia aparece na grade */
  ceia: boolean;
  /** ids com o aviso "neste domingo não há" */
  avisos: string[];
  destaque: string;
}

const casos: Caso[] = [
  // sábado comum
  {
    agora: '2026-11-07T20:00',
    proximo: 'domingo-estudo',
    quando: 'amanha',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-08',
  },
  // dia 1 é domingo
  {
    agora: '2026-11-01T08:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-11-01',
  },
  {
    agora: '2026-11-01T11:30',
    proximo: 'santa-ceia',
    quando: 'agora',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-11-01',
  },
  // depois da Ceia + almoço: não há Plenitude às 18h
  {
    agora: '2026-11-01T14:30',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-08',
  },
  {
    agora: '2026-11-01T18:30',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-08',
  },
  // domingo anterior à Ceia: a Plenitude ainda vem antes
  {
    agora: '2026-11-29T10:00',
    proximo: 'domingo-estudo',
    quando: 'agora',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-29',
  },
  {
    agora: '2026-11-29T20:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-06',
  },
  // virada de mês
  {
    agora: '2026-11-30T10:00',
    proximo: 'terca-oracao',
    quando: 'amanha',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-06',
  },
  // 1ª terça do mês: a oração não muda
  {
    agora: '2026-12-01T19:30',
    proximo: 'terca-oracao',
    quando: 'agora',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-06',
  },
  {
    agora: '2026-12-01T21:30',
    proximo: 'santa-ceia',
    quando: 'semana',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-06',
  },
  // sábado à noite antes da Ceia
  {
    agora: '2026-12-05T22:00',
    proximo: 'santa-ceia',
    quando: 'amanha',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-06',
  },
  // domingo de Ceia às 9h: não há Seminário
  {
    agora: '2026-12-06T09:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-06',
  },
  // limites da duração (10h + 240 min = 14h)
  {
    agora: '2026-12-06T13:59',
    proximo: 'santa-ceia',
    quando: 'agora',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-06',
  },
  {
    agora: '2026-12-06T14:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-12-13',
  },
  {
    agora: '2026-12-08T19:30',
    proximo: 'terca-oracao',
    quando: 'agora',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-12-13',
  },
  {
    agora: '2026-12-13T08:00',
    proximo: 'domingo-estudo',
    quando: 'hoje',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-12-13',
  },
  // virada de ano: 1º domingo de 2027 é dia 3
  {
    agora: '2026-12-31T23:00',
    proximo: 'santa-ceia',
    quando: 'semana',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2027-01-03',
  },
  // dia 1 numa segunda: o 1º domingo é dia 7
  {
    agora: '2027-02-07T08:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2027-02-07',
  },
];

const data = (s: string) => new Date(`${s}:00-03:00`);
let falhas = 0;

for (const c of casos) {
  const agora = data(c.agora);
  const p = proximoEncontro(grade, agora);
  const sit = situacaoDaSemana(grade, agora);
  const d = destaqueDaSemana(grade, undefined, agora);
  const obtido = {
    proximo: p?.vez.encontro.id,
    quando: p?.quando,
    ceia: sit.find((s) => s.encontro.id === 'santa-ceia')!.mostrar,
    avisos: sit.filter((s) => s.substituidoPor).map((s) => s.encontro.id),
    destaque: d && `${d.vez.encontro.id}@${d.vez.data}`,
  };
  const esperado = {
    proximo: c.proximo,
    quando: c.quando,
    ceia: c.ceia,
    avisos: c.avisos,
    destaque: c.destaque,
  };
  const ok = JSON.stringify(obtido) === JSON.stringify(esperado);
  if (!ok) falhas++;
  console.log(`${ok ? 'ok  ' : 'FALHA'} ${c.agora}`);
  if (!ok) console.log('   esperado', esperado, '\n   obtido  ', obtido);
}

// tema só vale na data certa
const comTema = destaqueDaSemana(grade, '2026-12-06', data('2026-12-05T22:00'));
const semTema = destaqueDaSemana(grade, '2026-11-29', data('2026-12-05T22:00'));
if (!comTema?.temTema || semTema?.temTema) {
  falhas++;
  console.log('FALHA tema com data');
} else console.log('ok   tema com data');

const linha = gradeSemanal(grade, [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]);
if (linha !== 'Terça 19h · Domingo 9h e 18h') {
  falhas++;
  console.log('FALHA grade semanal:', linha);
} else console.log('ok   grade semanal');

if (falhas) {
  console.error(`\n${falhas} caso(s) falharam.`);
  process.exit(1);
}
console.log(`\nTodos os ${casos.length + 2} casos passaram.`);
