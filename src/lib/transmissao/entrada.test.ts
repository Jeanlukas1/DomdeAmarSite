// Ponto de teste P3 (spec 001): a entrada da transmissão (POST /api/v1/transmissao).
// Recebe um pedido e um instante fixo, com o GitHub trocado por um dublê na fronteira (a API
// REST), e confere a resposta e o que ficou gravado na `main`. Conteúdo de teste, nunca o real.
import { describe, expect, it } from 'vitest';
import { marcarTransmissao } from './entrada';
import { criarGithubFalso, type GithubFalso } from './githubFalso';

const SEGREDO = 'segredo-de-teste-123';
const TOKEN = 'github_pat_de_teste';

const FACEBOOK = { plataforma: 'facebook', endereco: 'https://www.facebook.com/igreja/videos/123' };
const YOUTUBE = { plataforma: 'youtube', endereco: 'https://www.youtube.com/watch?v=abcdefghijk' };
const SEM_VIDEO = { plataforma: '', endereco: '' };

/** Domingo, 22/11/2026, às 10h30 em Brasília (13h30 UTC). */
const DOMINGO_10H30 = new Date('2026-11-22T13:30:00Z');

function repositorio(mudancas: Record<string, unknown> = {}) {
  return {
    'src/content/transmissao.json': {
      principal: { aoVivo: false, data: '2026-11-15', video: FACEBOOK },
    },
    'src/content/cultos-gravados.json': {
      itens: [
        {
          id: 'culto-antigo',
          titulo: 'Culto antigo',
          referencia: 'João 3.16',
          data: '2026-11-15',
          pregador: 'Pr. Teste',
          video: FACEBOOK,
          mock: false,
        },
      ],
    },
    'src/content/cultos-secao.json': {
      principal: {
        semana: {
          data: '2026-11-29',
          tema: 'Tema de outro dia',
          referencia: 'Salmos 23',
          pregador: 'Pr. Outro',
          mock: false,
        },
        titulo: 'Encontros',
      },
    },
    'src/content/cultos.json': {
      itens: [
        { id: 'domingo-noite', diaSemana: '0', hora: '18:00', nome: 'Culto da Noite' },
        { id: 'domingo-manha', diaSemana: '0', hora: '09:00', nome: 'Culto da Manhã' },
        { id: 'terca', diaSemana: '2', hora: '19:00', nome: 'Culto de Oração' },
      ],
    },
    'src/content/eventos.json': { itens: [] },
    'src/content/alteracoes.json': { itens: [] },
    'src/content/assista.json': {
      principal: { titulo: 'Assista', tituloCultoGravadoPadrao: 'Culto ao vivo' },
    },
    ...mudancas,
  };
}

function pedido({
  autorizacao = `Bearer ${SEGREDO}`,
  corpo = {} as unknown,
}: { autorizacao?: string | null; corpo?: unknown } = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (autorizacao !== null) headers.set('Authorization', autorizacao);
  return new Request('https://site.test/api/v1/transmissao', {
    method: 'POST',
    headers,
    body: typeof corpo === 'string' ? corpo : JSON.stringify(corpo),
  });
}

async function marcar(github: GithubFalso, req: Request, agora = DOMINGO_10H30) {
  const resposta = await marcarTransmissao(req, agora, {
    segredo: SEGREDO,
    token: TOKEN,
    repo: { owner: 'dono', name: 'site' },
    fetch: github.fetch,
  });
  return { status: resposta.status, corpo: await resposta.text() };
}

const transmissao = (g: GithubFalso) =>
  (g.ler('src/content/transmissao.json') as { principal: unknown }).principal;

describe('segredo da entrada (R25)', () => {
  it('sem segredo, responde 401 e não grava nada', async () => {
    const github = criarGithubFalso(repositorio());
    const r = await marcar(github, pedido({ autorizacao: null }));
    expect(r.status).toBe(401);
    expect(github.commitsNovos()).toBe(0);
  });

  it('com segredo errado, responde 401 e não grava nada', async () => {
    const github = criarGithubFalso(repositorio());
    for (const autorizacao of [`Bearer ${SEGREDO}x`, 'Bearer ', SEGREDO, `Basic ${SEGREDO}`]) {
      const r = await marcar(github, pedido({ autorizacao }));
      expect(r.status).toBe(401);
    }
    expect(github.commitsNovos()).toBe(0);
    expect(transmissao(github)).toEqual({ aoVivo: false, data: '2026-11-15', video: FACEBOOK });
  });
});

describe('data de hoje no horário de Brasília (R24)', () => {
  it('grava a transmissão como ao vivo, com a data de hoje, e responde 200', async () => {
    const github = criarGithubFalso(repositorio());
    const r = await marcar(github, pedido());
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(1);
    expect(transmissao(github)).toEqual({ aoVivo: true, data: '2026-11-22', video: SEM_VIDEO });
  });

  it('às 23h30 de Brasília (já 2h30 do dia seguinte em UTC), a data é a de Brasília', async () => {
    const github = criarGithubFalso(repositorio());
    await marcar(github, pedido(), new Date('2026-11-23T02:30:00Z'));
    expect(transmissao(github)).toMatchObject({ aoVivo: true, data: '2026-11-22' });
  });

  it('às 0h10 de Brasília (ainda 3h10 em UTC), já é o dia novo', async () => {
    const github = criarGithubFalso(repositorio());
    await marcar(github, pedido(), new Date('2026-11-23T03:10:00Z'));
    expect(transmissao(github)).toMatchObject({ aoVivo: true, data: '2026-11-23' });
  });

  it('ignora uma data enviada por quem chama', async () => {
    const github = criarGithubFalso(repositorio());
    const r = await marcar(github, pedido({ corpo: { data: '2030-01-01', aoVivo: false } }));
    expect(r.status).toBe(200);
    expect(transmissao(github)).toEqual({ aoVivo: true, data: '2026-11-22', video: SEM_VIDEO });
  });

  it('grava com o token do GitHub, e a resposta não mostra o token nem o segredo (R30)', async () => {
    const github = criarGithubFalso(repositorio());
    const r = await marcar(github, pedido());
    expect(github.autorizacoes.length).toBeGreaterThan(0);
    expect(github.autorizacoes.every((a) => a === `Bearer ${TOKEN}`)).toBe(true);
    expect(r.corpo).not.toContain(TOKEN);
    expect(r.corpo).not.toContain(SEGREDO);
  });
});

describe('vídeo inválido (R25)', () => {
  const invalidos: Array<[string, unknown]> = [
    [
      'plataforma desconhecida',
      { video: { plataforma: 'vimeo', endereco: 'https://vimeo.com/1' } },
    ],
    ['endereço de outra plataforma', { video: { ...FACEBOOK, plataforma: 'youtube' } }],
    ['endereço que não é endereço', { video: { plataforma: 'facebook', endereco: 'live' } }],
    ['vídeo sem endereço', { video: { plataforma: 'facebook' } }],
    ['vídeo que não é objeto', { video: 'https://www.facebook.com/igreja/videos/123' }],
    ['corpo que não é JSON', '{ao vivo'],
    ['corpo que não é objeto', [FACEBOOK]],
  ];
  for (const [caso, corpo] of invalidos) {
    it(`${caso}: responde 400 e não grava nada`, async () => {
      const github = criarGithubFalso(repositorio());
      const r = await marcar(github, pedido({ corpo }));
      expect(r.status).toBe(400);
      expect(github.commitsNovos()).toBe(0);
    });
  }

  it('o segredo é conferido antes do corpo: segredo errado com vídeo inválido dá 401', async () => {
    const github = criarGithubFalso(repositorio());
    const r = await marcar(github, pedido({ autorizacao: 'Bearer x', corpo: '{ao vivo' }));
    expect(r.status).toBe(401);
  });
});

describe('toque repetido e vídeo (R27)', () => {
  const hojeAoVivo = (video = SEM_VIDEO) =>
    repositorio({
      'src/content/transmissao.json': { principal: { aoVivo: true, data: '2026-11-22', video } },
    });

  it('já ao vivo hoje e sem nada novo: responde 200 sem commit', async () => {
    const github = criarGithubFalso(hojeAoVivo());
    const r = await marcar(github, pedido());
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(0);
  });

  it('dois toques seguidos fazem um commit só', async () => {
    const github = criarGithubFalso(repositorio());
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    const r = await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(1);
  });

  it('acrescenta o vídeo quando a transmissão de hoje ainda não tem vídeo', async () => {
    const github = criarGithubFalso(hojeAoVivo());
    const r = await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(r.status).toBe(200);
    expect(transmissao(github)).toEqual({ aoVivo: true, data: '2026-11-22', video: YOUTUBE });
  });

  it('não troca um vídeo que a transmissão de hoje já tem', async () => {
    const github = criarGithubFalso(hojeAoVivo(FACEBOOK));
    const r = await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(0);
    expect(transmissao(github)).toEqual({ aoVivo: true, data: '2026-11-22', video: FACEBOOK });
  });

  it('o vídeo de uma transmissão de outro dia não fica: vale o do pedido', async () => {
    const github = criarGithubFalso(repositorio());
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(transmissao(github)).toEqual({ aoVivo: true, data: '2026-11-22', video: YOUTUBE });
  });

  it('hoje, mas desmarcada no painel: volta a ficar ao vivo e mantém o vídeo de hoje', async () => {
    const github = criarGithubFalso(
      repositorio({
        'src/content/transmissao.json': {
          principal: { aoVivo: false, data: '2026-11-22', video: FACEBOOK },
        },
      }),
    );
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(transmissao(github)).toEqual({ aoVivo: true, data: '2026-11-22', video: FACEBOOK });
  });
});

describe('culto gravado do dia (R28)', () => {
  type Culto = Record<string, unknown> & { data: string };
  const cultos = (g: GithubFalso) =>
    (g.ler('src/content/cultos-gravados.json') as { itens: Culto[] }).itens;
  const doDia = (g: GithubFalso, data = '2026-11-22') => cultos(g).filter((c) => c.data === data);

  const temaDeHoje = {
    'src/content/cultos-secao.json': {
      principal: {
        semana: {
          data: '2026-11-22',
          tema: 'Tapando as brechas',
          referencia: 'Juízes 13.1-5',
          pregador: 'Pr. Marcelo',
          mock: false,
        },
        titulo: 'Encontros',
      },
    },
  };

  it('com tema de hoje: cria o culto gravado no mesmo commit, com os dados do tema', async () => {
    const github = criarGithubFalso(repositorio(temaDeHoje));
    const r = await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(1);
    const [culto] = doDia(github);
    expect(culto).toMatchObject({
      titulo: 'Tapando as brechas',
      referencia: 'Juízes 13.1-5',
      pregador: 'Pr. Marcelo',
      data: '2026-11-22',
      video: YOUTUBE,
      mock: false,
    });
    expect(culto.id).toMatch(/^[a-z0-9-]+$/);
    expect(doDia(github)).toHaveLength(1);
    expect(doDia(github, '2026-11-15')).toHaveLength(1);
  });

  it('sem tema de hoje: o título é o do encontro cuja janela contém a marcação', async () => {
    const github = criarGithubFalso(repositorio());
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(doDia(github)[0]).toMatchObject({
      titulo: 'Culto da Manhã',
      referencia: '',
      pregador: '',
      mock: false,
    });
  });

  it('sem tema e fora de toda janela: o título é o do primeiro encontro de hoje', async () => {
    const github = criarGithubFalso(repositorio());
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }), new Date('2026-11-22T17:00:00Z'));
    expect(doDia(github)[0]).toMatchObject({ titulo: 'Culto da Manhã' });
  });

  it('um encontro cancelado hoje não dá o título', async () => {
    const github = criarGithubFalso(
      repositorio({
        'src/content/alteracoes.json': {
          itens: [
            {
              id: 'alteracao-1',
              alvo: 'domingo-manha',
              data: '2026-11-22',
              situacao: 'cancelado',
              novaHora: '',
              novoLocal: '',
              mensagem: 'Cancelado',
              avisar: false,
            },
          ],
        },
      }),
    );
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(doDia(github)[0]).toMatchObject({ titulo: 'Culto da Noite' });
  });

  it('sem tema: um evento de hoje cuja janela contém a marcação dá o título', async () => {
    const github = criarGithubFalso(
      repositorio({
        'src/content/eventos.json': {
          itens: [
            { id: 'vigilia', titulo: 'Vigília de Sábado', data: '2026-11-21', hora: '20:00' },
          ],
        },
      }),
    );
    // sábado, 21/11, às 21h em Brasília: não há encontro no sábado
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }), new Date('2026-11-22T00:00:00Z'));
    expect(doDia(github, '2026-11-21')[0]).toMatchObject({ titulo: 'Vigília de Sábado' });
  });

  it('sem tema e sem encontro nem evento no dia: o título é o padrão do painel', async () => {
    const github = criarGithubFalso(repositorio());
    // sábado, 21/11, às 10h em Brasília
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }), new Date('2026-11-21T13:00:00Z'));
    expect(doDia(github, '2026-11-21')[0]).toMatchObject({
      titulo: 'Culto ao vivo',
      referencia: '',
      pregador: '',
    });
  });

  it('sem vídeo, não cria culto gravado', async () => {
    const github = criarGithubFalso(repositorio(temaDeHoje));
    await marcar(github, pedido());
    expect(doDia(github)).toHaveLength(0);
  });

  it('quando um toque seguinte traz o vídeo, cria o culto gravado nesse commit', async () => {
    const github = criarGithubFalso(repositorio(temaDeHoje));
    await marcar(github, pedido());
    await marcar(github, pedido({ corpo: { video: FACEBOOK } }));
    expect(github.commitsNovos()).toBe(2);
    expect(doDia(github)).toHaveLength(1);
    expect(doDia(github)[0]).toMatchObject({ video: FACEBOOK });
  });

  it('com um culto gravado de hoje já cadastrado, não cria outro', async () => {
    const existente = {
      id: 'ja-cadastrado',
      titulo: 'Já cadastrado',
      referencia: '',
      data: '2026-11-22',
      pregador: '',
      video: FACEBOOK,
      mock: false,
    };
    const github = criarGithubFalso(
      repositorio({ 'src/content/cultos-gravados.json': { itens: [existente] } }),
    );
    const r = await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(r.status).toBe(200);
    expect(cultos(github)).toEqual([existente]);
    expect(transmissao(github)).toMatchObject({ aoVivo: true, video: YOUTUBE });
  });

  it('o identificador novo não repete o de um culto gravado que já existe', async () => {
    const github = criarGithubFalso(
      repositorio({
        ...temaDeHoje,
        'src/content/cultos-gravados.json': {
          itens: [
            {
              id: 'tapando-as-brechas-2026-11-22',
              titulo: 'Outro',
              referencia: '',
              data: '2026-11-01',
              pregador: '',
              video: FACEBOOK,
              mock: false,
            },
          ],
        },
      }),
    );
    await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    const ids = cultos(github).map((c) => c.id);
    expect(new Set(ids).size).toBe(2);
  });
});

describe('main que andou no meio (R29)', () => {
  const eventoDoPainel = (n: number) => ({
    itens: [{ id: `evento-${n}`, titulo: `Evento ${n}`, data: '2026-12-01', hora: '19:00' }],
  });

  /** O painel grava `vezes` vezes, cada uma logo antes de a entrada tentar mover a `main`. */
  function painelNoMeio(github: GithubFalso, vezes: number) {
    let n = 0;
    github.antesDeMover = () => {
      if (n < vezes) github.gravarComoPainel('src/content/eventos.json', eventoDoPainel(++n));
    };
  }

  it('andou uma vez: refaz sobre a ponta nova e as duas gravações ficam', async () => {
    const github = criarGithubFalso(repositorio());
    painelNoMeio(github, 1);
    const r = await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(2);
    expect(github.ler('src/content/eventos.json')).toEqual(eventoDoPainel(1));
    expect(transmissao(github)).toMatchObject({ aoVivo: true, video: YOUTUBE });
  });

  it('andou três vezes: refaz as três vezes e nada se perde', async () => {
    const github = criarGithubFalso(repositorio());
    painelNoMeio(github, 3);
    const r = await marcar(github, pedido());
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(4);
    expect(github.ler('src/content/eventos.json')).toEqual(eventoDoPainel(3));
    expect(transmissao(github)).toMatchObject({ aoVivo: true, data: '2026-11-22' });
  });

  it('andou quatro vezes: desiste com 502, sem gravar a transmissão', async () => {
    const github = criarGithubFalso(repositorio());
    painelNoMeio(github, 4);
    const r = await marcar(github, pedido());
    expect(r.status).toBe(502);
    expect(github.commitsNovos()).toBe(4);
    expect(transmissao(github)).toMatchObject({ aoVivo: false });
  });

  it('se o painel já marcou a transmissão no meio, responde 200 sem commit novo', async () => {
    const github = criarGithubFalso(repositorio());
    github.antesDeMover = () => {
      github.antesDeMover = undefined;
      github.gravarComoPainel('src/content/transmissao.json', {
        principal: { aoVivo: true, data: '2026-11-22', video: SEM_VIDEO },
      });
    };
    const r = await marcar(github, pedido());
    expect(r.status).toBe(200);
    expect(github.commitsNovos()).toBe(1);
  });
});

describe('falha do GitHub (R26)', () => {
  const etapas = [
    'GET /git/ref/heads/main',
    'GET /contents/src/content/transmissao.json',
    'GET /contents/src/content/cultos-gravados.json',
    'GET /contents/src/content/assista.json',
    'GET /git/commits/',
    'POST /git/trees',
    'POST /git/commits',
    'PATCH /git/refs/heads/main',
  ];
  for (const etapa of etapas) {
    it(`falha em "${etapa}": responde 502 e nada fica gravado`, async () => {
      const github = criarGithubFalso(repositorio());
      github.falharEm = etapa;
      const r = await marcar(github, pedido({ corpo: { video: YOUTUBE } }));
      expect(r.status).toBe(502);
      expect(github.commitsNovos()).toBe(0);
      expect(transmissao(github)).toMatchObject({ aoVivo: false });
      expect(r.corpo).not.toContain(TOKEN);
    });
  }

  it('a rede cai no caminho até o GitHub: responde 502, sem mostrar o token', async () => {
    const resposta = await marcarTransmissao(pedido(), DOMINGO_10H30, {
      segredo: SEGREDO,
      token: TOKEN,
      repo: { owner: 'dono', name: 'site' },
      fetch: () => Promise.reject(new TypeError('fetch failed')),
    });
    expect(resposta.status).toBe(502);
    expect(await resposta.text()).not.toContain(TOKEN);
  });

  it('sem o token configurado: responde 502 e não chama o GitHub', async () => {
    const github = criarGithubFalso(repositorio());
    const resposta = await marcarTransmissao(pedido(), DOMINGO_10H30, {
      segredo: SEGREDO,
      token: undefined,
      repo: { owner: 'dono', name: 'site' },
      fetch: github.fetch,
    });
    expect(resposta.status).toBe(502);
    expect(github.autorizacoes).toHaveLength(0);
  });

  it('sem o segredo configurado, recusa até um pedido com "Bearer " vazio', async () => {
    const github = criarGithubFalso(repositorio());
    const resposta = await marcarTransmissao(pedido({ autorizacao: 'Bearer ' }), DOMINGO_10H30, {
      segredo: '',
      token: TOKEN,
      repo: { owner: 'dono', name: 'site' },
      fetch: github.fetch,
    });
    expect(resposta.status).toBe(401);
    expect(github.commitsNovos()).toBe(0);
  });
});
