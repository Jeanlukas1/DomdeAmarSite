// Entrada da transmissão (spec 001, R24 a R30; ADR 0002; formato em docs/DATA-MODEL.md).
// O servidor do app chama POST /api/v1/transmissao quando o filmmaker marca "ao vivo". Esta
// função recebe o pedido e o instante atual e grava a transmissão de hoje (e, com vídeo, o culto
// gravado do dia) num commit só na `main`, pela API REST do GitHub. Sem framework: a rota em
// src/rotas/transmissao.ts só lê o ambiente e chama esta função.
import { createHash, timingSafeEqual } from 'node:crypto';
import { dataEmSaoPaulo } from '@/lib/encontros';
import { conferirVideo, type Video } from '@/lib/video';
import { cultoDoDia, type ConteudoDoDia, type CultoGravadoDoPainel } from './cultoDoDia';
import { clienteGithub, FalhaDoGithub, type ClienteGithub } from './github';

const ARQ = {
  transmissao: 'src/content/transmissao.json',
  cultosGravados: 'src/content/cultos-gravados.json',
  cultosSecao: 'src/content/cultos-secao.json',
  encontros: 'src/content/cultos.json',
  eventos: 'src/content/eventos.json',
  alteracoes: 'src/content/alteracoes.json',
  assista: 'src/content/assista.json',
} as const;

/** Tamanho máximo do corpo do pedido, em bytes. */
const LIMITE_DO_CORPO = 4096;

/** Quantas vezes a gravação é refeita quando a `main` andou no meio (R29). */
const REFAZER_ATE = 3;

/** O conteúdo de um arquivo do repositório não serve para a marcação. */
export class ConteudoInvalido extends Error {}

/** Vídeo como o painel grava: "" quando vazio. */
type VideoDoPainel = { plataforma: string; endereco: string };

interface TransmissaoDoPainel {
  aoVivo: boolean;
  data?: string;
  video: VideoDoPainel;
}

const SEM_VIDEO: VideoDoPainel = { plataforma: '', endereco: '' };

/** Como o painel grava o JSON: duas casas de recuo e quebra de linha no fim. */
const emJson = (v: unknown) => `${JSON.stringify(v, null, 2)}\n`;

/** O vídeo do painel, se for válido (um vídeo inválido conta como sem vídeo). */
const videoValido = (v: VideoDoPainel | undefined): Video | null => {
  if (!v) return null;
  const conferido = conferirVideo(v);
  return 'video' in conferido ? conferido.video : null;
};

/** O corpo do pedido: `{}` ou `{ "video": { plataforma, endereco } }`. Outras chaves são ignoradas. */
async function lerPedido(pedido: Request): Promise<{ video: Video | null } | { erro: string }> {
  // o corpo esperado tem poucas centenas de bytes: um corpo grande é recusado antes de ser lido
  if (Number(pedido.headers.get('content-length') ?? 0) > LIMITE_DO_CORPO) {
    return { erro: 'o corpo é grande demais' };
  }
  const texto = await pedido.text();
  if (texto.length > LIMITE_DO_CORPO) return { erro: 'o corpo é grande demais' };
  let corpo: unknown;
  try {
    corpo = texto.trim() ? JSON.parse(texto) : {};
  } catch {
    return { erro: 'o corpo não é JSON' };
  }
  if (typeof corpo !== 'object' || corpo === null || Array.isArray(corpo)) {
    return { erro: 'o corpo precisa ser um objeto JSON' };
  }
  const { video } = corpo as { video?: unknown };
  if (video === undefined || video === null) return { video: null };
  const { plataforma, endereco } = (typeof video === 'object' ? video : {}) as Record<
    string,
    unknown
  >;
  if (typeof plataforma !== 'string' || typeof endereco !== 'string') {
    return { erro: 'o vídeo precisa ter plataforma e endereço' };
  }
  const conferido = conferirVideo({ plataforma, endereco });
  return 'motivo' in conferido ? { erro: `vídeo inválido: ${conferido.motivo}` } : conferido;
}

/**
 * A transmissão de hoje depois da marcação. Um vídeo que a transmissão de hoje já tem não é
 * trocado (a correção é pelo painel); o de outro dia não vale mais.
 */
function marcar(atual: TransmissaoDoPainel, hoje: string, video: Video | null) {
  const videoDeHoje = atual.data === hoje ? videoValido(atual.video) : null;
  return {
    ...atual,
    aoVivo: true,
    data: hoje,
    video: videoDeHoje ?? video ?? (atual.data === hoje ? atual.video : SEM_VIDEO),
  };
}

const mesmo = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Lê e interpreta um arquivo JSON do painel naquele commit. */
async function lerJson<T>(github: ClienteGithub, commit: string, caminho: string): Promise<T> {
  const texto = await github.ler(commit, caminho);
  if (texto === undefined) throw new ConteudoInvalido(`${caminho} não existe na main`);
  try {
    return JSON.parse(texto) as T;
  } catch {
    throw new ConteudoInvalido(`${caminho} não é JSON`);
  }
}

/** O conteúdo de que o culto gravado do dia precisa, lido no mesmo commit. */
async function lerConteudoDoDia(
  github: ClienteGithub,
  commit: string,
  cultos: CultoGravadoDoPainel[],
): Promise<ConteudoDoDia> {
  type Itens<K extends keyof ConteudoDoDia> = { itens: ConteudoDoDia[K] };
  const [secao, encontros, eventos, alteracoes, assista] = await Promise.all([
    lerJson<{ principal: { semana?: ConteudoDoDia['tema'] } }>(github, commit, ARQ.cultosSecao),
    lerJson<Itens<'encontros'>>(github, commit, ARQ.encontros),
    lerJson<Itens<'eventos'>>(github, commit, ARQ.eventos),
    lerJson<Itens<'alteracoes'>>(github, commit, ARQ.alteracoes),
    lerJson<{ principal: { tituloCultoGravadoPadrao?: string } }>(github, commit, ARQ.assista),
  ]);
  const tituloPadrao = assista.principal.tituloCultoGravadoPadrao;
  if (!tituloPadrao) {
    throw new ConteudoInvalido(`${ARQ.assista} não tem o título padrão do culto gravado`);
  }
  return {
    tema: secao.principal.semana,
    encontros: encontros.itens,
    eventos: eventos.itens,
    alteracoes: alteracoes.itens,
    tituloPadrao,
    idsExistentes: cultos.map((c) => c.id),
  };
}

/**
 * Lê a ponta da `main`, calcula o que muda e grava num commit só: a transmissão e, quando ela
 * tem vídeo e ainda não há culto gravado de hoje, esse culto gravado. Devolve "gravou", "nada" (nada
 * a mudar) ou "andou" (a `main` andou antes de mover; nada foi gravado).
 */
async function gravarMarcacao(
  github: ClienteGithub,
  agora: Date,
  hoje: string,
  video: Video | null,
) {
  const pai = await github.ponta();
  const arquivo = await lerJson<{ principal: TransmissaoDoPainel }>(github, pai, ARQ.transmissao);
  const nova = marcar(arquivo.principal, hoje, video);
  if (mesmo(nova, arquivo.principal)) return 'nada';
  const arquivos: Record<string, string> = {
    [ARQ.transmissao]: emJson({ ...arquivo, principal: nova }),
  };

  const videoDaLive = videoValido(nova.video);
  if (videoDaLive) {
    const gravados = await lerJson<{ itens: CultoGravadoDoPainel[] }>(
      github,
      pai,
      ARQ.cultosGravados,
    );
    if (!gravados.itens.some((c) => c.data === hoje)) {
      const conteudo = await lerConteudoDoDia(github, pai, gravados.itens);
      const culto = cultoDoDia(conteudo, agora, hoje, videoDaLive);
      arquivos[ARQ.cultosGravados] = emJson({ ...gravados, itens: [culto, ...gravados.itens] });
    }
  }
  const movida = await github.gravar(pai, arquivos, `content: mark transmissao live on ${hoje}`);
  return movida ? 'gravou' : 'andou';
}

export interface AmbienteDaEntrada {
  /** o segredo da entrada (Authorization: Bearer <segredo>); sem ele, tudo é recusado */
  segredo: string | undefined;
  /** o token refinado do GitHub, só de conteúdo e só neste repositório */
  token: string | undefined;
  repo: { owner: string; name: string };
  /** a fronteira com o GitHub (nos testes, um dublê) */
  fetch?: typeof fetch;
}

const responder = (status: number, corpo: Record<string, unknown>) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

/**
 * O segredo confere? Compara em tempo constante: os dois lados viram um resumo SHA-256 do mesmo
 * tamanho antes da comparação, para o tempo não revelar o tamanho nem o começo do segredo.
 */
function segredoConfere(autorizacao: string | null, segredo: string | undefined) {
  if (!segredo || !autorizacao?.startsWith('Bearer ')) return false;
  const resumo = (v: string) => createHash('sha256').update(v).digest();
  return timingSafeEqual(resumo(autorizacao.slice('Bearer '.length)), resumo(segredo));
}

export async function marcarTransmissao(
  pedido: Request,
  agora: Date,
  ambiente: AmbienteDaEntrada,
): Promise<Response> {
  if (!segredoConfere(pedido.headers.get('authorization'), ambiente.segredo)) {
    return responder(401, { erro: 'segredo ausente ou errado' });
  }
  const lido = await lerPedido(pedido);
  if ('erro' in lido) return responder(400, { erro: lido.erro });
  if (!ambiente.token) return responder(502, { erro: 'a gravação no GitHub não está configurada' });
  const hoje = dataEmSaoPaulo(agora);
  const github = clienteGithub(ambiente.repo, ambiente.token, ambiente.fetch);
  try {
    // Se a `main` andou no meio (o painel gravou), recomeça da ponta nova: a outra gravação
    // fica, e a marcação é recalculada sobre ela. Até três vezes além da primeira.
    let resultado = await gravarMarcacao(github, agora, hoje, lido.video);
    for (let refeitas = 0; resultado === 'andou' && refeitas < REFAZER_ATE; refeitas++) {
      resultado = await gravarMarcacao(github, agora, hoje, lido.video);
    }
    if (resultado === 'andou') {
      return responder(502, {
        erro: 'a main mudou várias vezes durante a gravação; nada foi gravado, tente de novo',
      });
    }
    const gravou = resultado === 'gravou';
    return responder(200, { ok: true, data: hoje, gravou });
  } catch (erro) {
    if (erro instanceof FalhaDoGithub) {
      return responder(502, { erro: `o GitHub falhou; nada foi gravado (${erro.message})` });
    }
    if (erro instanceof ConteudoInvalido) {
      return responder(500, { erro: `nada foi gravado: ${erro.message}` });
    }
    throw erro;
  }
}
