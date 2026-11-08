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
    ocorrencia: '2',
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
  // dia 1 é domingo: é um domingo comum (a Ceia é no 2º)
  {
    agora: '2026-11-01T08:00',
    proximo: 'domingo-estudo',
    quando: 'hoje',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-01',
  },
  // domingo anterior à Ceia, depois da Plenitude: a Ceia já aparece
  {
    agora: '2026-11-01T20:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-11-08',
  },
  // sábado à noite antes da Ceia
  {
    agora: '2026-11-07T20:00',
    proximo: 'santa-ceia',
    quando: 'amanha',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-11-08',
  },
  // domingo de Ceia às 8h: não há Seminário
  {
    agora: '2026-11-08T08:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-11-08',
  },
  {
    agora: '2026-11-08T11:30',
    proximo: 'santa-ceia',
    quando: 'agora',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-11-08',
  },
  // limites da duração (10h + 240 min = 14h); depois, não há Plenitude às 18h
  {
    agora: '2026-11-08T13:59',
    proximo: 'santa-ceia',
    quando: 'agora',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-11-08',
  },
  {
    agora: '2026-11-08T14:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-15',
  },
  {
    agora: '2026-11-08T18:30',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-11-15',
  },
  // virada de mês: o próximo domingo (6/12) é o 1º, comum
  {
    agora: '2026-11-30T10:00',
    proximo: 'terca-oracao',
    quando: 'amanha',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-12-06',
  },
  {
    agora: '2026-12-01T19:30',
    proximo: 'terca-oracao',
    quando: 'agora',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2026-12-06',
  },
  // 1º domingo de dezembro, à noite: a Ceia de 13/12 já aparece
  {
    agora: '2026-12-06T20:01',
    proximo: 'terca-oracao',
    quando: 'semana',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-13',
  },
  {
    agora: '2026-12-08T19:30',
    proximo: 'terca-oracao',
    quando: 'agora',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-13',
  },
  {
    agora: '2026-12-12T22:00',
    proximo: 'santa-ceia',
    quando: 'amanha',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-13',
  },
  {
    agora: '2026-12-13T09:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2026-12-13',
  },
  // virada de ano: 3/1/2027 é o 1º domingo (comum); a Ceia é dia 10
  {
    agora: '2026-12-31T23:00',
    proximo: 'domingo-estudo',
    quando: 'semana',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2027-01-03',
  },
  // dia 1 numa segunda: o 1º domingo é dia 7 e a Ceia, dia 14
  {
    agora: '2027-02-07T08:00',
    proximo: 'domingo-estudo',
    quando: 'hoje',
    ceia: false,
    avisos: [],
    destaque: 'domingo-plenitude@2027-02-07',
  },
  {
    agora: '2027-02-14T08:00',
    proximo: 'santa-ceia',
    quando: 'hoje',
    ceia: true,
    avisos: ['domingo-estudo', 'domingo-plenitude'],
    destaque: 'santa-ceia@2027-02-14',
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
const comTema = destaqueDaSemana(grade, '2026-11-08', data('2026-11-07T20:00'));
const semTema = destaqueDaSemana(grade, '2026-11-01', data('2026-11-07T20:00'));
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
