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
