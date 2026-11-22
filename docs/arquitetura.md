# Arquitetura

**Astro estático.** Toda página é HTML gerado no build, e só as _ilhas_ (`src/components/islands/`) mandam JS ao navegador. Animações GSAP são importadas em `<script>` por seção, então o Vite as divide em chunks e cada página carrega só o que usa.

## Fluxo de dados

```
src/content/*.json|md ──(content.config.ts, Zod)──> getCollection/getEntry ──> components/sections/*
src/design/tokens.json ──(scripts/build-tokens.mjs)──> src/styles/tokens.css (@theme do Tailwind)
```

- Componentes **não** contêm texto/dado de conteúdo; recebem props ou leem coleções.
- `src/lib/` concentra a lógica pura (próximo culto, PIX, SEO) para ser testável e reaproveitável no app.

## O site e o app

O app da igreja (repositório DomdeAmarApp) não tem banco nem painel: o site é a fonte única do conteúdo.

```
administrador ──(painel)──────────────┐
filmmaker ──(app) ──> servidor do app ──POST /api/v1/transmissao──> entrada da transmissão (site)
                                      │                                    │
                                      ▼                                    ▼
                         repositório do site (main) <──── commit pela API do GitHub
                           │                    │
                (build da Vercel, ~30 s)   (webhook assinado a cada push)
                           ▼                    ▼
                  /api/v1/<coleção>.json    servidor do app ──> avisos
                           │
                           ▼
                        app no celular
```

- **Contrato publicado:** endpoints estáticos gerados no build, em `/api/v1/`, num formato próprio do app. Uma camada de tradução lê as coleções do site e monta cada arquivo, validado por um esquema do contrato. Formato em `docs/DATA-MODEL.md`; motivo em `docs/adr/0001-contrato-versionado-em-api-v1.md`.
- **Entrada da transmissão:** a segunda rota sob demanda do site, depois do painel. Ela recebe a marcação do servidor do app (com segredo), grava a transmissão de hoje e, quando há vídeo, o culto gravado do dia, num commit só na `main`. Motivo em `docs/adr/0002-entrada-da-transmissao-no-site.md`.
- **Webhook:** configurado no GitHub, sem código no site. A cada push na `main`, chama o servidor do app, que lê o antes e o depois no histórico do repositório. Por isso alguns arquivos de `src/content/` também são contrato (ver `docs/DATA-MODEL.md`).
- **Calendário:** `src/lib/` calcula as ocorrências dos encontros e aplica as alterações. O app tem uma cópia da mesma lógica, e as duas precisam dar o mesmo resultado.
- `tokens.json` e a logo são copiados para o app.

## Serviços externos

| Serviço | Para quê                                                                           | Segredos                                                                                     |
| ------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Vercel  | hospedagem, build a cada push, rotas sob demanda                                   | variáveis do painel, segredo da entrada da transmissão e token do GitHub, no cofre da Vercel |
| GitHub  | código, conteúdo (commits do painel e da entrada) e webhook para o servidor do app | segredo do webhook, compartilhado com o servidor do app                                      |

## Edição de conteúdo

O **Keystatic** (`keystatic.config.ts`, painel em `/keystatic`) edita os arquivos de `src/content/`. Ele e a entrada da transmissão são as únicas rotas sob demanda, por isso React, Keystatic e o adapter da Vercel só entram no `astro dev` e no build da Vercel (`VERCEL=1`). O `npm run build` local continua 100% estático, e o `npm run preview` e o Lighthouse ficam iguais. Ver `docs/conteudo.md`.

Pedidos de oração e "quero fazer parte" **não** usam formulário: abrem o WhatsApp com a mensagem pronta (decisão da F4, sem Web3Forms). Enquanto o número for mock, os botões levam ao Facebook.
