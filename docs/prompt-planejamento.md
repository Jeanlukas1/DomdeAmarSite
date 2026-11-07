# Projeto: Site da Igreja Evangélica Dom de Amar

> Você está em **modo planejamento**. NÃO escreva código ainda. Leia tudo, faça as perguntas que bloqueiam decisões e entregue um plano em fases para eu aprovar.

## 0. Estado do repositório

Repo git `DomdeAmarSite` já existe, com: `README.md`, `.gitignore` (template Next.js), um `CLAUDE.md` provisório (substituir pelo novo), `.claude/`, a pasta `fotos/` e este arquivo. Se a stack final não for Next.js, ajustar o `.gitignore` (ex.: `dist/`, `.astro/`). Depois de usado, este prompt pode ir para `docs/`.

## 1. Contexto

Quero criar o site oficial da minha igreja. No futuro haverá um **app** (transmissões ao vivo, etc.), então a arquitetura do site deve facilitar reaproveitar conteúdo e design depois. Vou anexar a logo junto com este prompt (descrição abaixo para referência).

**Dados reais da igreja (do Facebook oficial):**

- Nome: **Igreja Evangélica Dom de Amar**
- Bio: "Uma igreja segundo a eleição da Graça de Deus."
- Slogan: "Transformando vidas pelo Poder da Graça"
- Endereço: Rua 94, Lote 21, Quadra 2203 – Jaconé, Saquarema/RJ – CEP 28990-000
- Cultos:
  - Terça | 19h – Culto de Oração
  - Domingo | 9h – Estudo da Palavra
  - Domingo | 18h – Culto da Plenitude do Amor
- Facebook: https://www.facebook.com/profile.php?id=61591387636497 (tem Reels e fotos que podem virar conteúdo)

**Logo (anexada por mim, imagem raster):**

- Selo circular branco com borda vermelha fina.
- Topo: "IGREJA EVANGÉLICA" em caixa alta espaçada, em arco, ladeado por dois pontos vermelhos.
- Centro: **coração em 3D formado por duas fitas/pinceladas vermelhas brilhantes** (gradiente vermelho → vinho nas sombras), aberto embaixo, com a ponta terminando em uma cauda curva.
- Dentro do coração: "Dom" (script preto, grande), "de" (script preto, pequeno, com traço vermelho), "Amar" (script vermelho, grande, com swash sublinhando).
- Base: "Transformando vidas pelo" (serifada preta) + "Poder da Graça" (script vermelho) + pequeno coração vermelho entre dois traços.
- Paleta extraída: vermelho principal (~#D0121B), vinho de sombra (~#8E0A10), preto (#111), branco. Tipografia: script caligráfica + serifada clássica + sans caixa alta espaçada.
- **Ação necessária:** a logo é só raster. Para animar (desenhar o coração, escrever "Dom de Amar"), planeje vetorizar em **SVG** com camadas separadas (borda, texto em arco, fita esquerda, fita direita, "Dom", "de", "Amar", slogan, mini-coração). Sugira como (redesenho manual no Figma/Illustrator, ou trace automático + limpeza) e se devo pedir o arquivo original ao designer.

**Conteúdo que ainda não tenho → usar MOCKUPS (não me perguntar agora):**
telefone/WhatsApp, e-mail, Instagram, YouTube, nomes e fotos dos pastores, chave PIX, história da igreja, missão/visão, ministérios, eventos, mensagens/vídeos, depoimentos.

- Crie textos e dados fictícios **realistas e coerentes com a igreja** (tom acolhedor, tema da Graça), com tamanho próximo ao do texto final, para o layout já ficar fiel.
- Imagens: use as **fotos reais** da pasta `fotos/` (seção abaixo). Placeholder só onde nenhuma foto servir.
- Todo mockup deve morar **só nos arquivos de conteúdo** (Content Collections/JSON), nunca fixo dentro de componentes, e ser marcado com `mock: true` (ou `// MOCK`) para eu achar e substituir fácil.
- Mantenha `docs/conteudo-pendente.md` com a lista de cada mockup: arquivo, campo e o que preciso fornecer.
- Links/contatos falsos devem ser claramente inofensivos (ex.: `(22) 00000-0000`, `contato@exemplo.com`) e o PIX deve mostrar "chave em breve".

**Fotos reais da igreja (pasta `fotos/`, 46 imagens do Facebook, JPG até ~1600px, 4,6 MB):**

| Pasta                     | Qtde | Conteúdo                                                                                  | Uso sugerido                                                                             |
| ------------------------- | ---- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `novo-templo-construcao/` | 7    | obra do novo templo: fundação, betoneira, mutirão de membros                              | seção **Nossa História / Novo Templo** (timeline antigo → novo, CTA "Ajude a construir") |
| `templo-antigo/`          | 7    | salão atual/antigo, púlpito de acrílico, congregação                                      | História, Visite-nos                                                                     |
| `cultos-louvor/`          | 9    | pregação, louvor, banda, piano                                                            | Hero de apoio, Assista Online, Cresça na Fé                                              |
| `oracao/`                 | 3    | momentos de oração e imposição de mãos                                                    | Pedido de oração, Culto de Oração (terça)                                                |
| `comunhao/`               | 9    | grupos, aniversários, irmãos reunidos                                                     | Quem somos, galeria, Seja membro                                                         |
| `casais-evento-amor/`     | 9    | evento de casais com decoração de corações vermelhos                                      | eventos/galeria — combina com a identidade "Dom de Amar"                                 |
| `artes-divulgacao/`       | 2    | arte de horários e convite do **aniversário de 8 anos** (25/jul, 19h, preletor convidado) | referência de conteúdo; a igreja tem 8 anos (usar na História)                           |

Regras para as fotos:

- Mover para `src/assets/fotos/` e otimizar via `astro:assets` (AVIF/WebP, `srcset`, lazy-load, blur placeholder). Muitas são verticais (celular): planejar recortes (`object-position`) para cards horizontais.
- Galeria com lightbox leve e animação de entrada no scroll; seção do novo templo com efeito antes/depois ou timeline animada.
- Não identificar pessoas por nome (sem legenda com nomes) até eu confirmar.
- Confirmar comigo quais fotos são do templo antigo e quais do espaço atual.

## 2. Objetivo do site

- **Rápido** (meta Lighthouse ≥ 95 em mobile, LCP < 2,5s).
- **100% responsivo** (mobile-first, de 320px a telas ultrawide).
- **Animado e interativo**: animações ligadas ao scroll (reveal, parallax, pin, texto que se monta), micro-interações, transições suaves. Tem que chamar atenção, mas respeitar `prefers-reduced-motion`.
- Design **original** — não copiar o site de referência, só usar a lista de seções como inspiração.

## 3. Seções (inspiradas em igrejacristovive.com.br — só a estrutura)

1. **Header/Nav** fixo: Início, Visite, Assista Online, Cresça na Fé, Blog/Mensagens, Contribua + ícones sociais.
2. **Hero** com vídeo/animação da logo (ver seção 4) + "Graça e Paz! Bem-vindo" + CTAs "Quero conhecer a igreja" e "Preciso de oração/ajuda".
3. **Boas-vindas / Quem somos**: missão, visão, pastores.
   3b. **Nossa História + Novo Templo**: timeline animada no scroll (fundação → 8 anos → construção do novo templo) com as fotos reais, e CTA para contribuir com a obra.
   3c. **Galeria**: fotos de comunhão, cultos e eventos (grid/masonry animado + lightbox).
4. **Horários de culto**: cards com os 3 cultos + destaque "próximo culto" calculado pela data atual.
5. **Próximo culto / Destaque da semana**: pregador + tema (editável facilmente).
6. **Assista Online / Mensagens**: últimos vídeos (YouTube/Facebook embed com lazy-load "click to play").
7. **Cresça na Fé**: estudos, células/ministérios, discipulado.
8. **O que está acontecendo**: eventos/agenda e posts (carrossel).
9. **Contribua**: PIX com QR Code e botão copiar chave.
10. **Seja membro / Pedido de oração**: formulário (sem backend próprio — ver stack).
11. **Visite-nos**: mapa (embed leve, carregado sob demanda) + como chegar + WhatsApp.
12. **Footer**: redes sociais, endereço, horários, versículo.

## 4. Hero com vídeo animado da logo

Proponha 2–3 opções com prós/contras e recomende uma. Ideias para avaliar:

- **A)** Logo em **SVG animado** (GSAP DrawSVG/stroke): o coração é "pintado" em pinceladas, o texto "Dom de Amar" se escreve, partículas de luz/batida de coração ao final. Leve, nítido, interativo (reage ao mouse/scroll).
- **B)** **Vídeo curto em loop** (WebM/AV1 + MP4, < 2 MB, com poster) gerado a partir da animação, com overlay de texto.
- **C)** Animação **Rive/Lottie** exportada da logo.
  O hero deve carregar rápido (poster/fallback estático primeiro) e a animação deve continuar no scroll (ex.: coração encolhe e vira o ícone do header).

## 5. Stack (avalie e confirme)

Minha sugestão — valide ou proponha algo melhor, justificando:

- **Astro** (site estático, zero JS por padrão, ilhas só onde precisa) + **TypeScript**.
- **Tailwind CSS v4** com tokens de design (cores, fontes, espaçamentos) centralizados.
- **GSAP + ScrollTrigger** para animações de scroll e **Lenis** para smooth scroll.
- Imagens via `astro:assets` (AVIF/WebP, tamanhos responsivos); fontes self-hosted.
- **Conteúdo sem banco de dados**: Content Collections do Astro (Markdown/JSON) para cultos, eventos, mensagens, pastores. Avalie se vale um CMS headless gratuito (ex.: Decap/Keystatic) para leigos editarem sem código.
- Formulários: serviço externo (Formspree/Web3Forms) ou função serverless simples — sem banco.
- Deploy: **Vercel** (ou Netlify/Cloudflare Pages), domínio próprio depois.
- Pensar no futuro app: tokens de design e dados de conteúdo reutilizáveis (JSON), estrutura que permita adicionar API/lives depois.

## 6. CLAUDE.md (criar na raiz)

Bem estruturado e **enxuto, focado em economizar tokens**:

- Resumo do projeto em 3–5 linhas; stack; comandos (`dev`, `build`, `preview`, `lint`).
- Mapa de pastas (curto) e onde fica cada tipo de coisa (conteúdo, componentes, animações, tokens).
- Convenções: nomes, padrão de componente de seção, padrão de animação (um helper reutilizável, ex.: `data-reveal`), acessibilidade, performance.
- Regras para mim (Claude): não reler arquivos sem necessidade, editar com diffs pequenos, reutilizar componentes/helpers existentes antes de criar novos, não instalar dependências sem justificar, rodar `build` antes de dar uma tarefa como concluída.
- Ponteiros para `/docs` em vez de repetir conteúdo.

## 7. Documentação em `/docs`

- `docs/README.md`: índice.
- `docs/sessoes/AAAA-MM-DD-sessao-NN.md`: o que foi feito em cada sessão (objetivo, mudanças, arquivos principais, decisões, pendências).
- `docs/arquitetura.md`, `docs/design-system.md`, `docs/animacoes.md`, `docs/conteudo.md` (como editar cultos/eventos), `docs/deploy.md`.
- Mantenha curto e atualizado; ao final de cada sessão, registre a sessão.

## 8. Skills / automação

Se fizer sentido, crie skills de projeto em `.claude/skills/` para tarefas repetitivas, por exemplo:

- `/registrar-sessao`: gera o arquivo da sessão em `docs/sessoes/` e atualiza o índice.
- `/nova-secao`: cria uma seção nova seguindo o padrão (componente + animação + conteúdo + doc).
  **Me avise sempre que criar uma skill**, dizendo nome e para que serve.

## 9. Entregável deste planejamento

1. Perguntas bloqueantes (máx. 8, objetivas) — só sobre decisões técnicas/visuais; conteúdo faltante vira mockup.
2. Stack final com justificativa curta.
3. 2–3 conceitos para o hero + recomendação.
4. Direção visual (paleta a partir da logo, tipografia, estilo de animação).
5. Estrutura de pastas.
6. Plano em fases (ex.: F1 setup + CLAUDE.md + docs + design tokens; F2 hero; F3 seções; F4 conteúdo/forms; F5 performance/SEO/acessibilidade; F6 deploy), com critério de "pronto" em cada fase.
7. Riscos e como evitá-los (performance com animações, peso do vídeo, SEO local "igreja em Saquarema/Jaconé").
