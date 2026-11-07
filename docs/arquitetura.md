# Arquitetura

**Astro estático.** Toda página é HTML gerado no build, e só as _ilhas_ (`src/components/islands/`) mandam JS ao navegador. Animações GSAP são importadas em `<script>` por seção, então o Vite as divide em chunks e cada página carrega só o que usa.

## Fluxo de dados

```
src/content/*.json|md ──(content.config.ts, Zod)──> getCollection/getEntry ──> components/sections/*
src/design/tokens.json ──(scripts/build-tokens.mjs)──> src/styles/tokens.css (@theme do Tailwind)
```

- Componentes **não** contêm texto/dado de conteúdo; recebem props ou leem coleções.
- `src/lib/` concentra a lógica pura (próximo culto, PIX, SEO) para ser testável e reaproveitável no app.

## Pensando no app

- `tokens.json` pode ser consumido direto pelo app (React Native/Flutter) ou convertido.
- Na F4, as coleções serão expostas como endpoints estáticos `/api/*.json` gerados no build. O app lê os mesmos dados sem backend.
- Lives/transmissões entram depois como ilha + fonte de dados própria, sem mudar a base.

## Edição de conteúdo

Até a F4, a edição é feita direto nos arquivos de `src/content/`. Na F4 entra o **Keystatic** (painel `/keystatic`, commits no GitHub), que exige o adapter da Vercel só para essa rota.
