# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Site oficial da **Igreja Evangélica Dom de Amar** (Jaconé, Saquarema/RJ). Estático, mobile-first, muito animado (GSAP) e com meta de Lighthouse mobile ≥ 95. Conteúdo e tokens de design ficam em JSON/MD para serem reaproveitados num app futuro (lives). Plano aprovado e fases: `docs/README.md`. Idioma do site, dos textos e dos docs: **pt-BR**.

## Stack

Astro 7 (output estático, ilhas só onde precisa) · TypeScript strict · Tailwind CSS v4 (`@tailwindcss/vite`) · GSAP + ScrollTrigger + Lenis · `astro:assets` · Content Collections (Zod 4: use `z.url()`, não `z.string().url()`) · Fraunces + Manrope self-hosted (@fontsource-variable) · Deploy na Vercel.

## Comandos

```
npm run dev       # gera tokens.css e sobe o dev server
npm run build     # tokens + astro check + astro build  (rodar antes de dar tarefa como pronta)
npm run preview   # serve o dist/
npm run lint      # eslint + prettier --check
npm run format    # prettier --write
npm run tokens    # src/design/tokens.json -> src/styles/tokens.css
npm run imagens   # gera public/og-image.jpg e apple-touch-icon.png (Chrome local)
```

Não há testes automatizados. A verificação é feita com build, lint e Lighthouse/inspeção no navegador.

## Onde fica cada coisa

- `src/design/tokens.json`: **fonte única** de cores, fontes, raios, easing e durações. `src/styles/tokens.css` é gerado e está no gitignore, então nunca edite à mão.
- `src/styles/global.css`: base, utilitários (`eyebrow` só para metadados, `container-site`), reduced-motion.
- `src/content/` + `src/content.config.ts`: todo o conteúdo (igreja, cultos, eventos, mensagens…). Para ler a config da igreja, use `getIgreja()` de `src/lib/igreja.ts`.
- `src/components/ui/` (primitivos) · `sections/` (uma seção da página por arquivo) · `islands/` (únicos com JS de cliente).
- `src/lib/animations/`: helpers de animação (padrão `data-reveal` etc.); ver `docs/animacoes.md`.
- `src/assets/fotos/<categoria>/`: fotos reais; `src/assets/logo/`: logo SVG em camadas.
- `docs/`: arquitetura, design system, animações, conteúdo, deploy, pendências e log de sessões.

## Convenções

- **Nenhum texto ou dado fixo em componentes**: tudo vem de `src/content/`. Dado provisório leva `mock: true` e entra em `docs/conteudo-pendente.md`. Contatos falsos devem ser inofensivos (`(22) 00000-0000`, `contato@exemplo.com`) e o PIX mostra "chave em breve".
- Seção nova: use a skill `/nova-secao` (componente + conteúdo + animação + doc).
- Animação: use os helpers por atributo (`data-reveal`, `data-parallax`, `data-split`) antes de escrever GSAP avulso. Anime só `transform` e `opacity`. Tudo deve funcionar e ficar legível com `prefers-reduced-motion`.
- Imagens sempre via `<Image>`/`<Picture>` de `astro:assets`, com `alt`. Não identificar pessoas por nome nas legendas.
- Embeds (YouTube, mapa, Facebook) carregam só com clique (click-to-load).
- Classificação das fotos de templo (confirmada): `templo-antigo/` = templo antigo, `templo-novo/` = espaço atual, `participacoes/` = visita a outra igreja (não apresentar como nosso espaço).

## Design com Impeccable

Todo trabalho visual passa pela skill `impeccable`. `PRODUCT.md` e `DESIGN.md` ("O Selo da Graça") são a fonte de verdade. Fluxo por seção: `/impeccable shape` → `/nova-secao` → `/impeccable animate` → olhar em 375, 768 e 1440px e com reduced-motion → `/impeccable critique` → build + lint + commit. Ao fechar uma página: critique da página inteira → audit → polish. Detalhes e regras de qualidade em `docs/design-com-impeccable.md`.

## Regras para o Claude

- **Commit ao fim de cada passo concluído** (um commit por passo lógico, mensagem clara).
- Não reler arquivos já vistos sem necessidade; edite com diffs pequenos.
- Reutilize componentes e helpers existentes antes de criar novos.
- Não instale dependências sem justificar (peso de JS importa).
- Rode `npm run build` (e `npm run lint`) antes de declarar uma tarefa pronta.
- Ao fim de cada sessão, rode `/registrar-sessao`.
- Detalhes ficam em `docs/`: aponte para lá em vez de repetir aqui.
