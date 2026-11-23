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
  const chamar = (caminho: string, init: RequestInit & { accept?: string } = {}) =>
    f(`${base}${caminho}`, {
      ...init,
      headers: {
        Accept: init.accept ?? 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
  const json = async <T>(r: Response, oQue: string): Promise<T> => {
    if (!r.ok) throw new FalhaDoGithub(`${oQue}: o GitHub respondeu ${r.status}`);
    return (await r.json()) as T;
  };
  const enviar = (caminho: string, method: string, corpo: unknown) =>
    chamar(caminho, { method, body: JSON.stringify(corpo) });

  return {
    async ponta() {
      const r = await json<{ object: { sha: string } }>(
        await chamar('/git/ref/heads/main'),
        'ler a ponta da main',
      );
      return r.object.sha;
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
      const commitPai = await json<{ tree: { sha: string } }>(
        await chamar(`/git/commits/${pai}`),
        'ler o commit da ponta',
      );
      const arvore = await json<{ sha: string }>(
        await enviar('/git/trees', 'POST', {
          base_tree: commitPai.tree.sha,
          tree: Object.entries(arquivos).map(([path, content]) => ({
            path,
            mode: '100644',
            type: 'blob',
            content,
          })),
        }),
        'criar a árvore',
      );
      const commit = await json<{ sha: string }>(
        await enviar('/git/commits', 'POST', { message: mensagem, tree: arvore.sha, parents: [pai] }),
        'criar o commit',
      );
      const movida = await enviar('/git/refs/heads/main', 'PATCH', {
        sha: commit.sha,
        force: false,
      });
      // 422: a `main` não está mais no pai (não é avanço rápido). O commit criado fica solto e
      // não entra no histórico.
      if (movida.status === 422) return false;
      await json(movida, 'mover a main');
      return true;
    },
  };
}
