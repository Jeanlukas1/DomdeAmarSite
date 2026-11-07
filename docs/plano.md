# Plano — Site da Igreja Evangélica Dom de Amar

## Contexto

Site oficial da igreja (Jaconé, Saquarema/RJ), rápido, animado e mobile-first, com conteúdo e design reaproveitáveis em um app futuro (lives). Repo hoje: README, .gitignore (Next.js), CLAUDE.md provisório, `.claude/` (skill impeccable + hooks), `fotos/` (46 JPGs: 24 horizontais, 21 verticais, 1 quadrada) e `PROMPT-PLANEJAMENTO.md`. A logo veio em `C:\Users\lukas\Downloads\logo_dom_de_amar.svg`. Esse arquivo é um trace automático: 4 paths por cor (#de0101, #a90504, #6f0101, #d08383), em degraus de pixel, sem camadas e sem preto. **Decidido:** pedir o original ao designer (.ai/.pdf vetorial/.svg com camadas); enquanto isso, eu redesenho um SVG limpo em camadas usando esse trace como gabarito.

Regra de trabalho: **um commit ao final de cada passo concluído.**

## Decisões assumidas (aprovar ou trocar)

| Tema               | Decisão                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Identidade         | **Selo do coração** é a marca oficial. A chama da arte de horários não entra no site.                                            |
| Hero               | **Conceito A** (SVG + GSAP), detalhado abaixo                                                                                    |
| Edição de conteúdo | **Keystatic** (painel `/keystatic`, salva no GitHub). Entra na F4; até lá, edição por JSON/MD.                                   |
| Formulários        | **Web3Forms** (grátis, sem backend, e-mail para a igreja). Honeypot + hCaptcha opcional.                                         |
| Deploy             | **Vercel** (adapter Astro; tudo pré-renderizado, só a rota do Keystatic é on-demand)                                             |
| Clima visual       | Hero escuro (vinho→quase preto) com o selo branco "brilhando"; seções em creme/branco; faixas vinho para Novo Templo e Contribua |

## Stack final

- **Astro 7 + TypeScript 6 (strict)**: HTML estático, zero JS por padrão, ilhas só onde precisa. Melhor opção para a meta Lighthouse ≥ 95.
- **Tailwind CSS v4** (`@tailwindcss/vite`), com os tokens em `@theme` dentro de `src/styles/tokens.css`, gerados de `src/design/tokens.json` (fonte única, reaproveitável no app).
- **GSAP 3 + ScrollTrigger + DrawSVG/SplitText** (todos gratuitos desde a 3.13) + **Lenis** (smooth scroll, desligado em reduced-motion). Carregados só nas páginas/ilhas que animam.
- **astro:assets** (AVIF/WebP, srcset, lazy, placeholder blur via LQIP pequeno inline).
- **Fontes self-hosted** via @fontsource-variable: **Fraunces** (títulos serifados, eco do slogan), **Manrope** (texto/UI e caixa alta espaçada). Fonte script usada só como acento (ex.: "Graça"), subset mínimo.
- **Content Collections** (JSON/MD com schemas Zod) para cultos, eventos, mensagens, pastores, ministérios, depoimentos, galeria e config da igreja.
- Ferramentas: ESLint + Prettier (com plugins astro/tailwind) e `astro check`. Sem framework de testes no início; a verificação é feita por build + Lighthouse CI local.
- Futuro app: `tokens.json` + coleções expostas como **endpoints JSON estáticos** (`/api/cultos.json`, etc.) gerados no build.

## Hero — conceitos

- **A) SVG animado com GSAP (recomendado):** primeiro aparece o poster (SVG estático inline, que é o elemento de LCP). Depois: a borda do selo se desenha → o texto em arco entra letra a letra → as fitas esquerda e direita do coração "pintam" (DrawSVG + máscara de pincelada) → "Dom", "de" e "Amar" se escrevem → pulso de luz/batida, com poucas partículas em canvas. No scroll (pin curto), o selo encolhe e voa até o ícone do header (Flip). Paralaxe leve no mouse (desktop). Pesa ~30–40 KB de JS gzip, é nítido em ultrawide e, em reduced-motion, mostra o estado final.
- B) Vídeo em loop: 1–2 MB, prejudica LCP/dados móveis, não é interativo. Descartado.
- C) Rive/Lottie: exige produzir o arquivo à parte + runtime de 50–150 KB. Descartado.

## Direção visual

- **Paleta** (do SVG): `red-600 #DE0101` (principal), `red-700 #A90504`, `wine-900 #6F0101`, `blush #D08383` (brilho), `ink #111111`, `cream #FFF8F3`, `white`. Tons intermediários gerados em OKLCH. Validar contraste AA (vermelho sobre creme em texto ≥ 18px ou bold; em texto pequeno usar `red-700`).
- **Tipografia:** Fraunces (display, com eixo opsz/SOFT para calor), Manrope (corpo), caixa alta espaçada (tracking 0.2em) para eyebrows, ecoando o arco da logo.
- **Motivos:** pincelada vermelha (path SVG reutilizável) como sublinhado/divisor; mini-coração entre traços (do rodapé da logo) como separador.
- **Animação:** helper único `data-reveal` (fade/slide/clip, com stagger por grupo), `data-parallax`, `data-split` (texto que se monta) e títulos com "pincelada" no scroll. Durações curtas (0.6–0.9s, ease `power3.out`). Tudo desligado ou reduzido sob `prefers-reduced-motion`.
- Rodar a skill **impeccable** (`/impeccable init` e depois critique/polish) para revisar a qualidade visual por seção.

## Estrutura de pastas

```
src/
  assets/fotos/<categoria>/      # movidas de fotos/ (git mv)
  assets/logo/                   # logo.svg em camadas + trace original de referência
  components/ui/                 # Button, Card, Section, Heading, Icon, Brushstroke…
  components/sections/           # Hero, QuemSomos, Historia, Galeria, Horarios, Destaque,
                                 # AssistaOnline, CresçaNaFe, Agenda, Contribua, Formularios, Visite
  components/islands/            # Lightbox, Carrossel, YouTubeLite, MapaSobDemanda, CopiarPix
  content/                       # cultos.json, eventos/, mensagens/, pastores/, ministerios/,
                                 # depoimentos.json, galeria.json, igreja.json (config/contatos)
  content.config.ts              # schemas Zod (campo mock: boolean)
  design/tokens.json             # fonte única dos tokens
  lib/animations/                # reveal.ts, parallax.ts, split.ts, hero.ts, init.ts
  lib/                           # proximoCulto.ts, pix.ts, seo.ts
  layouts/BaseLayout.astro
  pages/index.astro, visite.astro, assista.astro, cresca.astro, mensagens/, contribua.astro, api/*.json.ts
  styles/global.css, tokens.css
public/                          # favicon, og-image, robots.txt
docs/                            # README, arquitetura, design-system, animacoes, conteudo,
                                 # deploy, conteudo-pendente, sessoes/, prompt-planejamento.md
.claude/skills/                  # registrar-sessao/, nova-secao/
```

## Fases

**F1 — Setup + docs + tokens**

- Criar o projeto Astro (TS strict), Tailwind v4, ESLint/Prettier e o alias `@/`. Ajustar o `.gitignore` (`dist/`, `.astro/`, `.vercel/`, remover entradas do Next).
- `git mv fotos/ → src/assets/fotos/` e `PROMPT-PLANEJAMENTO.md → docs/prompt-planejamento.md`.
- `tokens.json` → `tokens.css` (script de build), fontes self-hosted, BaseLayout com SEO base.
- Novo **CLAUDE.md** enxuto (resumo, stack, comandos, mapa de pastas, convenções, regras para o Claude, ponteiros para /docs, commit por passo). Docs iniciais + `docs/conteudo-pendente.md`.
- Skills **/registrar-sessao** e **/nova-secao** (vou avisar ao criar).
- _Pronto quando:_ `npm run build` e `npm run lint` passam, a página de teste mostra tokens e fontes corretos, e a sessão está registrada.

**F2 — Logo + Hero**

- Redesenhar `logo.svg` em camadas com IDs (`borda`, `arco-texto`, `fita-esq`, `fita-dir`, `dom`, `de`, `amar`, `slogan`, `mini-coracao`), cores do trace e preto onde deve ser.
- Header fixo (nav + sociais + menu mobile acessível), Hero A com poster/LCP, timeline GSAP, transição selo → ícone do header, reduced-motion.
- _Pronto quando:_ Lighthouse mobile ≥ 95 na home só com o hero, LCP < 2,5s (throttle 4G), sem CLS, animação fluida em celular médio e estado final estático com reduced-motion.

**F3 — Seções**

- Quem somos (missão, visão, pastores), História + Novo Templo (timeline com pin: fundação → 8 anos (25/jul) → obra, antes/depois com slider, CTA "Ajude a construir"), Galeria (masonry + lightbox leve + reveal), Horários (3 cards + "próximo culto" calculado no cliente, fuso America/Sao_Paulo), Destaque da semana, Assista Online (YouTube lite click-to-play), Cresça na Fé, Agenda (carrossel), Footer.
- Recortes `object-position` por foto definidos em `galeria.json`. Sem nomes de pessoas nas legendas.
- **Confirmar com você:** em `templo-antigo/` há dois espaços diferentes (piso verde + porta de enrolar, ex.: `-12`; salão branco com TV, ex.: `-48`). Qual é o antigo e qual é o atual?
- _Pronto quando:_ todas as seções renderizam de 320px a 2560px sem scroll horizontal, só com dados vindos de content/, e o build passa.

**F4 — Conteúdo, formulários, Contribua, Keystatic**

- Mockups completos marcados com `mock: true` e listados em `conteudo-pendente.md` (telefone `(22) 00000-0000`, `contato@exemplo.com`, PIX "chave em breve" com QR placeholder; QR real gerado no build quando a chave existir).
- ~~Formulários Seja membro / Pedido de oração (Web3Forms)~~ **Decidido na F4:** Pedido de oração e "Quero fazer parte" abrem o WhatsApp com a mensagem pronta (Facebook enquanto o número for mock). Visite-nos com mapa carregado sob demanda + link do Google Maps/Waze + WhatsApp.
- Keystatic configurado para as coleções. Endpoints `/api/*.json`.
- _Pronto quando:_ formulários enviam em produção de teste, o painel edita um culto e o deploy reflete a mudança, e não sobra texto fixo em componentes (grep).

**F5 — Performance, SEO, acessibilidade**

- SEO local: `title`/`description` com "Igreja evangélica em Jaconé, Saquarema – RJ", JSON-LD `Church` (endereço, `openingHours` dos cultos, geo), sitemap, OG image, robots, canonical.
- A11y: foco visível, skip-link, alt nas fotos, contraste AA, navegação por teclado no lightbox/carrossel.
- Code-split do GSAP por seção; checar o peso de JS por página.
- _Pronto quando:_ Lighthouse ≥ 95 em Performance/A11y/Best Practices/SEO no mobile em todas as páginas e axe sem erros.

**F6 — Deploy**

- Projeto na Vercel ligado ao GitHub, env `WEB3FORMS_KEY`, Keystatic GitHub App, preview por branch, `docs/deploy.md` (inclui domínio próprio depois e Google Business Profile).
- _Pronto quando:_ URL de produção no ar com todos os critérios da F5 e a sessão final registrada.

## Riscos e mitigação

- **Animações pesando:** GSAP só por ilha/seção, animar apenas `transform`/`opacity`, ScrollTrigger com `once` nos reveals, partículas limitadas e pausadas fora da tela, testes em CPU 4× slowdown.
- **LCP no hero:** poster SVG inline (sem esperar JS), fontes com `preload` + `font-display: swap` e métricas ajustadas, nenhuma foto acima da dobra no mobile.
- **Fotos de celular verticais e escuras:** recortes por `object-position`, `aspect-ratio` fixo nos cards e tamanhos máximos de ~1600px já otimizados.
- **Embeds (YouTube, mapa, Facebook):** sempre click-to-load com thumbnail local.
- **SEO local:** JSON-LD + NAP consistente com o Facebook + Google Business Profile (ação sua, documentada).
- **Logo provisória divergir do original:** IDs de camada fixos, para que trocar o arquivo não quebre a animação.
- **Mockups esquecidos no ar:** flag `mock: true` + aviso no build listando mocks restantes.

## Verificação (por fase)

`npm run build` · `npm run lint` · `npx astro check` · `npm run preview` + Lighthouse mobile (Chrome DevTools/claude-in-chrome) · teste em 320/768/1440/2560px · emulação de `prefers-reduced-motion` · axe DevTools · grep por `mock: true` contra `conteudo-pendente.md`. Commit ao fim de cada passo; registrar a sessão em `docs/sessoes/`.
