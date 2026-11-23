// Entrada da transmissão (spec 001, R24 a R30; ADR 0002; formato em docs/DATA-MODEL.md).
// O servidor do app chama POST /api/v1/transmissao quando o filmmaker marca "ao vivo". Esta
// função recebe o pedido e o instante atual e grava a transmissão de hoje (e, com vídeo, o culto
// gravado do dia) num commit só na `main`, pela API REST do GitHub. Sem framework: a rota em
// src/rotas/transmissao.ts só lê o ambiente e chama esta função.
import { createHash, timingSafeEqual } from 'node:crypto';
import { dataEmSaoPaulo } from '@/lib/encontros';
import { conferirVideo, type Video } from '@/lib/video';
import { clienteGithub, FalhaDoGithub, type ClienteGithub } from './github';

const ARQ = {
  transmissao: 'src/content/transmissao.json',
} as const;

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
  const texto = await pedido.text();
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

/**
 * Lê a ponta da `main`, calcula o que muda e grava num commit só. Devolve se gravou (false: nada
 * a mudar).
 */
async function gravarMarcacao(github: ClienteGithub, hoje: string, video: Video | null) {
  const pai = await github.ponta();
  const texto = await github.ler(pai, ARQ.transmissao);
  if (texto === undefined) throw new FalhaDoGithub(`${ARQ.transmissao} não existe na main`);
  const arquivo = JSON.parse(texto) as { principal: TransmissaoDoPainel };
  const nova = marcar(arquivo.principal, hoje, video);
  if (mesmo(nova, arquivo.principal)) return false;
  const arquivos = { [ARQ.transmissao]: emJson({ ...arquivo, principal: nova }) };
  return github.gravar(pai, arquivos, `content: mark transmissao live on ${hoje}`);
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
    const gravou = await gravarMarcacao(github, hoje, lido.video);
    return responder(200, { ok: true, data: hoje, gravou });
  } catch (erro) {
    if (!(erro instanceof FalhaDoGithub)) throw erro;
    return responder(502, { erro: `o GitHub falhou; nada foi gravado (${erro.message})` });
  }
}
