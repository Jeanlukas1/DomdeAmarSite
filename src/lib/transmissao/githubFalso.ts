// Dublê do GitHub para os testes da entrada da transmissão (ponto P3, spec 001). Responde, em
// memória, às chamadas da API REST que a entrada faz: ler a ponta da `main`, ler um arquivo num
// commit, criar árvore, criar commit e mover a `main` (só para a frente, como o GitHub).
// Só é usado nos testes.

type Arquivos = Map<string, string>;

export interface GithubFalso {
  fetch: typeof fetch;
  /** o JSON de um arquivo na ponta da `main` */
  ler(caminho: string): unknown;
  /** quantos commits a `main` ganhou desde o início */
  commitsNovos(): number;
  /** a mensagem do último commit da `main` */
  ultimaMensagem(): string;
  /** grava direto na `main`, como o painel faria (um texto é gravado como está) */
  gravarComoPainel(caminho: string, conteudo: unknown): void;
  /** antes de cada pedido para mover a `main`, roda isto (para simular o painel no meio) */
  antesDeMover?: () => void;
  /** a próxima chamada que bater com este prefixo ("POST /git/commits") responde 500 */
  falharEm?: string;
  /** a próxima chamada que bater com este prefixo responde 200 com um corpo que não serve */
  corpoInvalidoEm?: string;
  /** os cabeçalhos de autorização recebidos */
  autorizacoes: string[];
}

export function criarGithubFalso(
  inicial: Record<string, unknown>,
  { owner = 'dono', repo = 'site' } = {},
): GithubFalso {
  let seq = 0;
  const novoSha = (tipo: string) => `${tipo}${++seq}`;
  const arvores = new Map<string, Arquivos>();
  const commits = new Map<string, { arvore: string; pai?: string; mensagem: string }>();

  const json = (v: unknown) => `${JSON.stringify(v, null, 2)}\n`;
  const arvoreInicial = novoSha('tree');
  arvores.set(
    arvoreInicial,
    new Map(Object.entries(inicial).map(([caminho, conteudo]) => [caminho, json(conteudo)])),
  );
  const primeiro = novoSha('commit');
  commits.set(primeiro, { arvore: arvoreInicial, mensagem: 'inicial' });
  let main = primeiro;

  const arquivosDe = (commit: string) => arvores.get(commits.get(commit)!.arvore)!;
  const contar = () => {
    let n = 0;
    for (let c: string | undefined = main; c && c !== primeiro; c = commits.get(c)!.pai) n++;
    return n;
  };

  const resposta = (status: number, corpo?: unknown) =>
    new Response(corpo === undefined ? null : JSON.stringify(corpo), { status });

  const falso: GithubFalso = {
    autorizacoes: [],
    ler: (caminho) => JSON.parse(arquivosDe(main).get(caminho)!),
    commitsNovos: contar,
    ultimaMensagem: () => commits.get(main)!.mensagem,
    gravarComoPainel(caminho, conteudo) {
      const arvore = novoSha('tree');
      const texto = typeof conteudo === 'string' ? conteudo : json(conteudo);
      arvores.set(arvore, new Map(arquivosDe(main)).set(caminho, texto));
      const sha = novoSha('commit');
      commits.set(sha, { arvore, pai: main, mensagem: `Update ${caminho}` });
      main = sha;
    },
    fetch: async (entrada, init) => {
      const url = new URL(String(entrada));
      const metodo = init?.method ?? 'GET';
      falso.autorizacoes.push(new Headers(init?.headers).get('authorization') ?? '');
      const base = `/repos/${owner}/${repo}`;
      if (!url.pathname.startsWith(base)) return resposta(404, { message: 'Not Found' });
      const caminho = url.pathname.slice(base.length);
      const chave = `${metodo} ${caminho}`;
      if (falso.falharEm && chave.startsWith(falso.falharEm)) {
        falso.falharEm = undefined;
        return resposta(500, { message: 'Server Error' });
      }
      if (falso.corpoInvalidoEm && chave.startsWith(falso.corpoInvalidoEm)) {
        const formato = chave.startsWith('GET') ? '{}' : '<html>erro</html>';
        falso.corpoInvalidoEm = undefined;
        return new Response(formato, { status: 200 });
      }
      const corpo = init?.body ? JSON.parse(String(init.body)) : undefined;

      if (chave === 'GET /git/ref/heads/main') return resposta(200, { object: { sha: main } });
      if (metodo === 'GET' && caminho.startsWith('/git/commits/')) {
        const commit = commits.get(caminho.slice('/git/commits/'.length));
        return commit ? resposta(200, { tree: { sha: commit.arvore } }) : resposta(404);
      }
      if (metodo === 'GET' && caminho.startsWith('/contents/')) {
        const ref = url.searchParams.get('ref');
        if (!ref || !commits.has(ref)) return resposta(404);
        const texto = arquivosDe(ref).get(decodeURIComponent(caminho.slice('/contents/'.length)));
        return texto === undefined ? resposta(404) : new Response(texto, { status: 200 });
      }
      if (chave === 'POST /git/trees') {
        const arquivos = new Map(arvores.get(corpo.base_tree));
        for (const item of corpo.tree) arquivos.set(item.path, item.content);
        const sha = novoSha('tree');
        arvores.set(sha, arquivos);
        return resposta(201, { sha });
      }
      if (chave === 'POST /git/commits') {
        const sha = novoSha('commit');
        commits.set(sha, { arvore: corpo.tree, pai: corpo.parents[0], mensagem: corpo.message });
        return resposta(201, { sha });
      }
      if (chave === 'PATCH /git/refs/heads/main') {
        falso.antesDeMover?.();
        const novo = commits.get(corpo.sha);
        if (!novo || (novo.pai !== main && !corpo.force)) {
          return resposta(422, { message: 'Update is not a fast forward' });
        }
        main = corpo.sha;
        return resposta(200, { object: { sha: main } });
      }
      return resposta(404, { message: 'Not Found' });
    },
  };
  return falso;
}
