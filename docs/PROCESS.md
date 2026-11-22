# Processo de engenharia

Valores específicos deste projeto para o processo do plugin `eng`. As regras do processo ficam no plugin; este arquivo guarda só o que muda de projeto para projeto. Atualize-o no mesmo PR que mudar um comando ou um caminho crítico.

## Projeto

- Repositório: `Jeanlukas1/DomdeAmarSite`
- Branch principal: `main`
- Versão do plugin `eng` adotada: `0.2.0` (em 2026-11-22)

## Comandos

| Finalidade           | Comando           |
| -------------------- | ----------------- |
| Testes (todos)       | a definir         |
| Teste de um arquivo  | a definir         |
| Lint                 | `npm run lint`    |
| Verificação de tipos | `npx astro check` |
| Build                | `npm run build`   |

O projeto ainda não tem testes automatizados. Hoje a verificação é feita com build, lint e inspeção no navegador ou com o Lighthouse.

## Caminhos críticos

Uma mudança que toque qualquer caminho abaixo é de nível Crítico, qualquer que seja a etiqueta da issue. Use padrões glob.

| Padrão                  | Motivo                          |
| ----------------------- | ------------------------------- |
| `.github/workflows/**`  | CI e deploy                     |
| `.claude/settings.json` | regras de permissão do processo |

Acrescente aqui, quando existirem: migrações e esquema de banco, autenticação e permissões, manifestos de dependências, configuração de infraestrutura e de produção. A spec que escolher a stack do projeto faz esse acréscimo.

## Regras de permissão pendentes

A instalação de pacotes já pede confirmação. O deploy é feito pela Vercel a cada push na `main`, que também já pede confirmação. Não há banco de dados nem migrações. Se uma spec introduzir um deles, ou um comando de deploy próprio, ela acrescenta a regra `ask` correspondente em `.claude/settings.json`.

O `.claude/settings.json` e o `CLAUDE.md` ficam fora do git por decisão do projeto (ver `.gitignore`). Por isso as regras de permissão e a seção "Engineering process" do `CLAUDE.md` existem só na máquina de quem fez o setup, e precisam ser recriadas em outra máquina (rode `/eng:setup` de novo).
