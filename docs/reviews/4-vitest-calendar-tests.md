# Revisão do ticket #4

- **Data:** 2026-11-22
- **Issue:** #4
- **Nível:** Crítico
- **Base:** `23864f3`
- **Cabeça revisada:** `a19b66c`
- **Lentes:** conformidade, qualidade
- **Revisor:** agente `eng:reviewer` (modelo definido pelo próprio agente)
- Lentes de segurança e arquitetura não executadas nesta versão do processo; essa leitura cabe ao humano.

---

## Veredito

Aprovado — 0 bloqueador(es), 0 importante(s), 0 menor(es).

## Conformidade

Nada a apontar. Conferi cada critério contra o diff.

- **`npm test` roda e termina com sucesso (R33):** o script `test: vitest run` existe em `package.json`, e o `vitest.config.ts` usa `getViteConfig` do Astro com `include: ['src/**/*.test.ts']`. `docs/PROCESS.md` já listava `npm test` e foi atualizado.
- **Todos os casos do script antigo existem como testes:** os casos da tabela `casos` foram mantidos com as mesmas entradas e as mesmas expectativas. Só ganharam `descricao` e passaram a usar a constante `SUBSTITUIDOS`. Os dois testes avulsos (tema com data e grade semanal) foram mantidos em `it` próprios.
- **Script antigo removido sem perder casos:** o arquivo foi renomeado para `src/lib/encontros.test.ts`, e uma busca no repositório não achou mais referências a `checar-encontros` fora da spec e do log de sessões, que são históricos. O `checar:encontros` saiu do `package.json`, do README e de `docs/conteudo.md`.
- **Documentos vivos:** `README.md`, `docs/PROCESS.md`, `docs/conteudo.md` e o comentário de `src/lib/encontros.ts` foram atualizados.

## Qualidade

Nada a apontar. As asserções comparam com valores literais fixos, não recalculam a lógica do código. O diff não mexe em `src/lib/encontros.ts` além do comentário.

## Não verificado

- **Critério 4 (JS entregue e build inalterados):** não consegui comparar a saída do build antes e depois, porque não executo comandos. Pelo diff, nenhum arquivo do site mudou além de um comentário. O `vitest` entra só em `devDependencies`, e o arquivo de teste fica fora das páginas do Astro.
- **Testes, lint e `astro check` passando:** não executei. Os commits recentes (`a19b66c`) indicam que o `astro check` foi ajustado para os tipos do Vitest.
- **Compatibilidade do `vitest` 5.1.1 com o Vite do Astro:** o `vitest` exige `vite` em `^6.4 || ^7 || ^8` e Node `^22.12 || ^24 || >=26`. Não confirmei a versão de Vite que o Astro 7.4.7 traz, nem a versão de Node usada no deploy da Vercel.
- **Reformatação da tabela do README:** o diff reformata a tabela inteira por causa do novo `npm test`, o que parece ser só o Prettier. O diff não permite verificar isso.
