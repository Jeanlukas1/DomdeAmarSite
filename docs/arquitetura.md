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
- As coleções são expostas como endpoints estáticos gerados no build (`src/pages/api/[colecao].json.ts`): `/api/igreja.json`, `/api/cultos.json`, `/api/eventos.json`, `/api/mensagens.json`, `/api/ministerios.json` e `/api/pastores.json`. O app lê os mesmos dados sem backend.
- Lives/transmissões entram depois como ilha + fonte de dados própria, sem mudar a base.

## Edição de conteúdo

O **Keystatic** (`keystatic.config.ts`, painel em `/keystatic`) edita os arquivos de `src/content/`. Ele é a única rota sob demanda, por isso React, Keystatic e o adapter da Vercel só entram no `astro dev` e no build da Vercel (`VERCEL=1`). O `npm run build` local continua 100% estático, e o `npm run preview` e o Lighthouse ficam iguais. Ver `docs/conteudo.md`.

Pedidos de oração e "quero fazer parte" **não** usam formulário: abrem o WhatsApp com a mensagem pronta (decisão da F4, sem Web3Forms). Enquanto o número for mock, os botões levam ao Facebook.
