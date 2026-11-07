---
name: nova-secao
description: Implementa uma seção do site a partir de um brief aprovado em docs/secoes/<slug>.md (gerado por /impeccable shape), seguindo o padrão do projeto (componente em src/components/sections, conteúdo em src/content com schema Zod, animação por data-attributes e documentação). Use quando o usuário pedir para construir uma seção/bloco novo de página.
---

# Nova seção

Argumento: nome da seção (ex.: `Horarios`).

Esta skill **executa** um design já decidido. Ela não cria design.

0. **Brief primeiro**: leia `docs/secoes/<slug>.md`. Se o brief não existir ou não estiver marcado como `Status: aprovado`, pare e rode `/impeccable shape <seção>` antes (ver `docs/design-com-impeccable.md`). Siga o brief à risca: layout, hierarquia, foto, fundo e momento de animação. **Não tome decisões visuais fora do brief.** Se faltar alguma coisa ou algo não couber (performance, conteúdo, CLAUDE.md), pergunte em vez de inventar e registre a decisão no próprio brief.
1. **Reutilize primeiro**: veja `src/components/ui/` e as seções existentes. Não crie um primitivo que já existe.
2. **Conteúdo**: crie ou estenda a coleção em `src/content/` e o schema em `src/content.config.ts`. Dados provisórios: realistas, no tom da igreja (acolhedor, tema da Graça), com tamanho próximo ao texto final e com `mock: true`. Registre cada mock em `docs/conteudo-pendente.md`.
3. **Componente** `src/components/sections/<Nome>.astro`:
   - `<section id="<slug>" aria-labelledby="<slug>-titulo">` + `container-site`.
   - Abertura: `h2` em `font-display` sozinho + parágrafo curto. **Sem eyebrow/kicker acima do título** (DESIGN.md: The Heading Speaks Rule).
   - Zero texto fixo: tudo vem de props/coleção.
   - Imagens via `astro:assets` com `alt` e `object-position` definido no conteúdo para fotos verticais.
   - Mobile-first, sem scroll horizontal de 320px a 2560px.
4. **Animação**: implemente o momento descrito no brief, na mesma passada (sem uma rodada separada de `animate` depois). Use `data-reveal`, `data-reveal-group`, `data-parallax` e `data-split` (ver `docs/animacoes.md`). GSAP avulso só se necessário, em `src/lib/animations/<nome>.ts`, respeitando reduced-motion.
5. **Interatividade** com JS de cliente vai para `src/components/islands/` (lazy: `client:visible` ou `<script>` com IntersectionObserver).
6. Inclua a seção na página e **olhe uma vez** em 375, 768 e 1440px e com reduced-motion. Corrija só o que desvia do brief ou está quebrado, numa leva só. Depois rode `npm run build` e `npm run lint`.
7. Atualize `docs/conteudo.md` (tabela de arquivos) e faça o commit: `feat(secao): <nome>`.
