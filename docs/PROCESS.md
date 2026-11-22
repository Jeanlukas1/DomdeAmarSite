# Processo de engenharia

Valores específicos deste projeto para o processo do plugin `eng`. As regras do processo ficam no plugin; este arquivo guarda só o que muda de projeto para projeto. Atualize-o no mesmo PR que mudar um comando ou um caminho crítico.

## Projeto

- Repositório: `Jeanlukas1/DomdeAmarSite`
- Branch principal: `main`
- Versão do plugin `eng` adotada: `0.2.0` (em 2026-11-22)

## Comandos

| Finalidade           | Comando                    |
| -------------------- | -------------------------- |
| Testes (todos)       | `npm test`                 |
| Teste de um arquivo  | `npx vitest run <arquivo>` |
| Lint                 | `npm run lint`             |
| Verificação de tipos | `npx astro check`          |
| Build                | `npm run build`            |

Os testes automatizados usam o Vitest, só no desenvolvimento, com a mesma configuração de Vite do Astro. O visual continua sendo conferido no navegador e com o Lighthouse.

## Caminhos críticos

Uma mudança que toque qualquer caminho abaixo é de nível Crítico, qualquer que seja a etiqueta da issue. Use padrões glob.

| Padrão                  | Motivo                                                 |
| ----------------------- | ------------------------------------------------------ |
| `.github/workflows/**`  | CI e deploy                                            |
| `.claude/settings.json` | regras de permissão do processo                        |
| `package.json`          | dependências e scripts                                 |
| `package-lock.json`     | versões das dependências                               |
| `astro.config.*`        | build, adapter da Vercel e rotas sob demanda           |
| `vercel.json`           | configuração de produção                               |
| `keystatic.config.ts`   | painel: o que o administrador cadastra                 |
| `src/content.config.ts` | esquema do conteúdo                                    |
| `src/pages/api/**`      | contrato publicado para o app e entrada da transmissão |

Os arquivos de `src/content/` listados em `docs/DATA-MODEL.md` também são contrato com o servidor do app: uma mudança no formato deles é Crítica. Uma gravação de conteúdo pelo painel não passa por este processo.

## Regras de permissão pendentes

A instalação de pacotes, o push na `main` (que publica pela Vercel) e o deploy manual (`npx vercel deploy`, `vercel deploy`) pedem confirmação. Não há banco de dados nem migrações; se uma spec introduzir um deles, ela acrescenta a regra `ask` correspondente em `.claude/settings.json`.

O `.claude/settings.json` e o `CLAUDE.md` ficam fora do git por decisão do projeto (ver `.gitignore`). Por isso as regras de permissão e a seção "Engineering process" do `CLAUDE.md` existem só na máquina de quem fez o setup, e precisam ser recriadas em outra máquina (rode `/eng:setup` de novo).
