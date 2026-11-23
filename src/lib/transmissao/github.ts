// Gravação no repositório pela API REST do GitHub, com o `fetch` nativo e sem biblioteca
// (spec 001, "Entrada da transmissão"): lê a ponta da `main`, lê os arquivos naquele commit, monta
// a árvore com os arquivos novos, cria o commit e move a `main` só para a frente. Se a `main`
// andou no meio, o GitHub recusa mover e quem chama recomeça da ponta nova.

export interface Repo {
  owner: string;
  name: string;
}

/** O GitHub respondeu fora do esperado. A mensagem nunca leva o token. */
export class FalhaDoGithub extends Error {}

export interface ClienteGithub {
  /** o commit na ponta da `main` */
  ponta(): Promise<string>;
  /** o texto de um arquivo naquele commit, ou undefined se ele não existe */
  ler(commit: string, caminho: string): Promise<string | undefined>;
  /**
   * Cria um commit sobre `pai` com os arquivos dados e move a `main` para ele. Devolve false se a
   * `main` já não está em `pai` (andou no meio): nada muda nesse caso.
   */
  gravar(pai: string, arquivos: Record<string, string>, mensagem: string): Promise<boolean>;
}

export function clienteGithub(repo: Repo, token: string, f: typeof fetch = fetch): ClienteGithub {
  const base = `https://api.github.com/repos/${repo.owner}/${repo.name}`;
  const chamar = async (caminho: string, init: RequestInit & { accept?: string } = {}) => {
    const { accept, ...resto } = init;
    try {
      return await f(`${base}${caminho}`, {
        ...resto,
        headers: {
          Accept: accept ?? 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        },
      });
    } catch {
      // a rede caiu ou o GitHub não respondeu; o erro original não vai para a resposta
      throw new FalhaDoGithub('o GitHub não respondeu');
    }
  };
  /**
   * O sha que a resposta traz, escolhido por `pegar`. Uma resposta de erro, um corpo que não é
   * JSON ou um JSON sem o sha esperado é uma falha do GitHub.
   */
  type Corpo = { sha?: unknown; object?: { sha?: unknown }; tree?: { sha?: unknown } } | null;
  const shaDe = async (r: Response, oQue: string, pegar: (c: Corpo) => unknown) => {
    if (!r.ok) throw new FalhaDoGithub(`${oQue}: o GitHub respondeu ${r.status}`);
    let corpo: Corpo;
    try {
      corpo = (await r.json()) as Corpo;
    } catch {
      throw new FalhaDoGithub(`${oQue}: o GitHub respondeu um corpo que não é JSON`);
    }
    const sha = pegar(corpo);
    if (typeof sha !== 'string' || !sha) {
      throw new FalhaDoGithub(`${oQue}: o GitHub respondeu fora do formato esperado`);
    }
    return sha;
  };
  const enviar = (caminho: string, method: string, corpo: unknown) =>
    chamar(caminho, { method, body: JSON.stringify(corpo) });

  return {
    async ponta() {
      return shaDe(
        await chamar('/git/ref/heads/main'),
        'ler a ponta da main',
        (c) => c?.object?.sha,
      );
    },
    async ler(commit, caminho) {
      const segmentos = caminho.split('/').map(encodeURIComponent).join('/');
      const r = await chamar(`/contents/${segmentos}?ref=${commit}`, {
        accept: 'application/vnd.github.raw+json',
      });
      if (r.status === 404) return undefined;
      if (!r.ok) throw new FalhaDoGithub(`ler ${caminho}: o GitHub respondeu ${r.status}`);
      return r.text();
    },
    async gravar(pai, arquivos, mensagem) {
      const arvoreDoPai = await shaDe(
        await chamar(`/git/commits/${pai}`),
        'ler o commit da ponta',
        (c) => c?.tree?.sha,
      );
      const arvore = await shaDe(
        await enviar('/git/trees', 'POST', {
          base_tree: arvoreDoPai,
          tree: Object.entries(arquivos).map(([path, content]) => ({
            path,
            mode: '100644',
            type: 'blob',
            content,
          })),
        }),
        'criar a árvore',
        (c) => c?.sha,
      );
      const commit = await shaDe(
        await enviar('/git/commits', 'POST', { message: mensagem, tree: arvore, parents: [pai] }),
        'criar o commit',
        (c) => c?.sha,
      );
      const movida = await enviar('/git/refs/heads/main', 'PATCH', {
        sha: commit,
        force: false,
      });
      // 422: a `main` não está mais no pai (não é avanço rápido). O commit criado fica solto e
      // não entra no histórico.
      if (movida.status === 422) return false;
      if (!movida.ok) throw new FalhaDoGithub(`mover a main: o GitHub respondeu ${movida.status}`);
      return true;
    },
  };
}
