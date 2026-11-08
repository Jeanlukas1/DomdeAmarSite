# Igreja Evangélica Dom de Amar — site

Site oficial da Igreja Evangélica Dom de Amar, em Jaconé (Saquarema/RJ).

**No ar:** https://domdeamar.vercel.app

Site estático, mobile-first e animado, com meta de Lighthouse mobile ≥ 95. Textos, dados e tokens de design ficam em JSON para serem reaproveitados num app futuro (lives).

## Stack

- [Astro 7](https://astro.build) (saída estática, JS de cliente só nas ilhas) + TypeScript strict
- Tailwind CSS v4
- GSAP + ScrollTrigger + Lenis (animações)
- Keystatic (painel de edição de conteúdo em `/keystatic`)
- Fontes Fraunces e Manrope self-hosted
- Deploy na Vercel (automático a cada push na `main`)

## Rodando localmente

Requer Node.js 22+.

```bash
npm install
npm run dev        # gera os tokens e sobe o servidor de desenvolvimento
```

| Comando                    | O que faz                                                           |
| -------------------------- | ------------------------------------------------------------------- |
| `npm run dev`              | Servidor de desenvolvimento                                         |
| `npm run build`            | Tokens + `astro check` + build de produção (rode antes de publicar) |
| `npm run preview`          | Serve o build gerado em `dist/`                                     |
| `npm run lint`             | ESLint + Prettier (checagem)                                        |
| `npm run format`           | Formata o código com Prettier                                       |
| `npm run tokens`           | Gera `src/styles/tokens.css` a partir de `src/design/tokens.json`   |
| `npm run imagens`          | Gera a imagem de compartilhamento e o ícone da Apple                |
| `npm run checar:encontros` | Confere o cálculo do próximo encontro (cultos e Santa Ceia)         |

## Estrutura

```
src/
  content/       textos e dados do site (JSON), editáveis pelo Keystatic
  design/        tokens.json: cores, fontes, raios e animações (fonte única)
  components/    ui/ (primitivos), sections/ (seções da página), islands/ (JS de cliente)
  lib/           utilitários e helpers de animação
  assets/        fotos e logo
docs/            arquitetura, design system, animações, conteúdo, deploy e sessões
```

## Editando o conteúdo

O conteúdo vive em `src/content/`. Pelo painel `/keystatic` (em produção), as edições viram commits na `main` e disparam um novo deploy. Rode `git pull` antes de mexer no código para não conflitar com essas edições.

## Documentação

Tudo começa em [`docs/README.md`](docs/README.md): plano, fases, decisões de design e o registro de cada sessão de trabalho.
