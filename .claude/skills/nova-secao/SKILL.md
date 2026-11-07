---
name: nova-secao
description: Cria uma nova seção do site seguindo o padrão do projeto (componente em src/components/sections, conteúdo em src/content com schema Zod, animação por data-attributes e documentação). Use quando o usuário pedir uma seção/bloco novo de página.
---

# Nova seção

Argumento: nome da seção (ex.: `Horarios`) e o que ela mostra.

1. **Reutilize primeiro**: veja `src/components/ui/` e as seções existentes. Não crie um primitivo que já existe.
2. **Conteúdo**: crie ou estenda a coleção em `src/content/` e o schema em `src/content.config.ts`. Dados provisórios: realistas, no tom da igreja (acolhedor, tema da Graça), com tamanho próximo ao texto final e com `mock: true`. Registre cada mock em `docs/conteudo-pendente.md`.
3. **Componente** `src/components/sections/<Nome>.astro`:
   - `<section id="<slug>" aria-labelledby="<slug>-titulo">` + `container-site`.
   - Abertura: `h2` em `font-display` sozinho + parágrafo curto. **Sem eyebrow/kicker acima do título** (DESIGN.md: The Heading Speaks Rule).
   - Zero texto fixo: tudo vem de props/coleção.
   - Imagens via `astro:assets` com `alt` e `object-position` definido no conteúdo para fotos verticais.
   - Mobile-first, sem scroll horizontal de 320px a 2560px.
4. **Animação**: use `data-reveal`, `data-reveal-group`, `data-parallax` e `data-split` (ver `docs/animacoes.md`). GSAP avulso só se necessário, em `src/lib/animations/<nome>.ts`, respeitando reduced-motion.
5. **Interatividade** com JS de cliente vai para `src/components/islands/` (lazy: `client:visible` ou `<script>` com IntersectionObserver).
6. Inclua a seção na página, rode `npm run build` e `npm run lint`.
7. Atualize `docs/conteudo.md` (tabela de arquivos) e faça o commit: `feat(secao): <nome>`.
