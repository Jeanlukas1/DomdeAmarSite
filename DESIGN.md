---
name: Igreja Evangélica Dom de Amar
description: Site oficial — o selo do coração como assinatura visual de uma igreja centrada na Graça.
colors:
  graca-red: '#de0101'
  graca-red-bright: '#f0141a'
  graca-red-deep: '#a90504'
  wine-ember: '#8a0303'
  wine: '#6f0101'
  wine-night: '#2a0505'
  night: '#140708'
  blush: '#d08383'
  blush-mist: '#f7e3e1'
  ink: '#111111'
  ink-soft: '#3d3536'
  muted: '#6e6264'
  cream: '#fff8f3'
  sand: '#f4ebe4'
  white: '#ffffff'
typography:
  display:
    fontFamily: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif"
    fontSize: 'clamp(2.4rem, 6.4vw, 5.4rem)'
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: '-0.02em'
    fontVariation: "'opsz' 144"
  headline:
    fontFamily: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif"
    fontSize: '2.25rem'
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "'Fraunces Variable', 'Iowan Old Style', Georgia, serif"
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "'Manrope Variable', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Manrope Variable', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: '0.75rem'
    fontWeight: 700
    letterSpacing: '0.22em'
rounded:
  sm: '0.375rem'
  md: '0.75rem'
  lg: '1.25rem'
  xl: '2rem'
  pill: '9999px'
spacing:
  gutter: 'clamp(1rem, 4vw, 2.5rem)'
  container: '80rem'
  header: '4.5rem'
components:
  button-primary:
    backgroundColor: '{colors.graca-red}'
    textColor: '{colors.white}'
    rounded: '{rounded.pill}'
    padding: '12px 24px'
    height: '48px'
  button-primary-hover:
    backgroundColor: '{colors.graca-red-bright}'
    textColor: '{colors.white}'
  button-ghost:
    textColor: '{colors.cream}'
    rounded: '{rounded.pill}'
    padding: '12px 24px'
    height: '48px'
  button-light:
    backgroundColor: '{colors.cream}'
    textColor: '{colors.wine}'
    rounded: '{rounded.pill}'
    padding: '12px 24px'
    height: '48px'
  nav-cta:
    backgroundColor: '{colors.graca-red}'
    textColor: '{colors.white}'
    rounded: '{rounded.pill}'
    padding: '0 20px'
    height: '40px'
  header-solid:
    backgroundColor: '{colors.cream}'
    textColor: '{colors.ink}'
    height: '{spacing.header}'
---

# Design System: Igreja Evangélica Dom de Amar

## Overview

**Creative North Star: "O Selo da Graça"**

Tudo gira em torno do selo: o círculo branco com borda vermelha, o coração pintado em duas pinceladas e "Dom de Amar" escrito à mão. O site se comporta como um convite impresso e uma carta de amor, não como um portal corporativo. As formas recorrentes vêm do próprio selo: o **círculo**, a **pincelada** vermelha e o **mini-coração entre dois traços**. Elas funcionam como assinatura e pontuação, nunca como enfeite solto.

O ritmo alterna **faixas escuras e quentes** (vinho → quase preto), onde o selo brilha como uma brasa, com **páginas creme serenas**, onde se lê com calma. O vermelho da Graça é usado com intenção: chamadas para agir, a pincelada e o coração. A tipografia une uma serifada calorosa e expressiva (Fraunces) a uma sans limpa e legível (Manrope). A caixa alta espaçada ecoa o "IGREJA EVANGÉLICA" em arco.

O movimento é parte da identidade: o selo se pinta, escreve o nome e bate como um coração. Fora do hero, o movimento é discreto: revelar e assentar, nunca distrair. Tudo funciona estático com `prefers-reduced-motion`.

**Key Characteristics:**

- Selo do coração como assinatura e elemento de transição (hero → ícone do header).
- Alternância entre faixas escuras vinho e superfícies creme.
- Vermelho da Graça reservado para ação e emoção.
- Serifada display calorosa + sans legível; títulos falam sozinhos, sem rótulo acima.
- Formas macias: pílulas, cartões arredondados, sombras quentes e difusas.
- Fotos reais da comunidade. Nenhuma imagem genérica.

## Colors

Uma paleta de um único matiz, vermelho, extraída da logo, sobre neutros quentes cor de papel.

### Primary

- **Vermelho da Graça** (`graca-red`): o vermelho da borda do selo e das fitas do coração. Botões primários, CTA do menu, pinceladas, foco do teclado, o coração. Em texto, só ≥ 18px ou em negrito.
- **Vermelho Aceso** (`graca-red-bright`): estado de hover do primário. Um passo mais luminoso, como brasa assoprada.
- **Vermelho Profundo** (`graca-red-deep`): a sombra das fitas na logo. Texto vermelho pequeno (metadados, links sobre claro), por contraste AA.

### Secondary

- **Vinho** (`wine`) e **Vinho Brasa** (`wine-ember`): o "Dom" da logo e as sombras do coração. Faixas escuras de destaque (Novo Templo, Contribua), `theme-color` do navegador.
- **Vinho Noturno** (`wine-night`) e **Noite** (`night`): fundo do hero e do menu mobile. É o "escuro" onde o selo brilha.

### Tertiary

- **Rubor** (`blush`) e **Névoa Rosada** (`blush-mist`): o brilho rosado das fitas da logo. Metadados e texto secundário sobre fundo escuro, faíscas e brasas.

### Neutral

- **Tinta** (`ink`): texto principal sobre claro.
- **Tinta Suave** (`ink-soft`) e **Cinza Quente** (`muted`): texto secundário, legendas, metadados.
- **Creme** (`cream`): fundo padrão das páginas e do header sólido. Nunca branco puro como fundo de página.
- **Areia** (`sand`): divisórias, bordas suaves, superfícies alternadas.
- **Branco** (`white`): cartões e o interior do selo.

### Named Rules

**The Ember Rule.** O vermelho da Graça aparece como ponto de calor: CTA, pincelada, coração. Uma seção clara nunca é "pintada" de vermelho. Superfícies fortes usam o vinho, e o vermelho fica para o que pede ação.

**The Warm Paper Rule.** Neutros são sempre quentes (creme, areia, tinta levemente avermelhada). Cinzas frios e azulados não entram.

## Typography

**Display Font:** Fraunces Variable (fallback Iowan Old Style, Georgia, serif)
**Body Font:** Manrope Variable (fallback system-ui, Segoe UI, sans-serif)

**Character:** A Fraunces traz calor e um quê de livro antigo, como o slogan serifado da logo, com eixo óptico (`opsz`) alto nos títulos grandes. A Manrope é clara, moderna e legível para todas as idades. A letra cursiva existe só dentro do selo e nunca vira fonte de interface.

### Hierarchy

- **Display** (500, clamp 2.4–5.4rem, 1.1, tracking −0.02em, opsz 144): h1 do hero e aberturas de página.
- **Headline** (400, ~2.25rem, 1.1): títulos de seção (h2), com `text-wrap: balance`.
- **Title** (600, ~1.125rem, 1.25): títulos de cartão e o nome "Dom de Amar" no header.
- **Body** (400, 1rem–1.2rem, 1.6): texto corrido, máximo de ~65ch.
- **Label** (700, 0.75rem, tracking 0.22em, CAIXA ALTA): metadados dentro do conteúdo (dia e hora de culto, data de evento, rótulo de botão de rolagem). Nunca como linha solta acima de um título.

### Named Rules

**The Heading Speaks Rule.** Nenhum rótulo (eyebrow/kicker) acima de títulos. O título serifado carrega a seção sozinho; se uma palavra importa (ex.: "Graça e Paz!"), ela entra no título ou no texto. A caixa alta espaçada fica para metadados e para o arco do próprio selo.

**The Script Stays Home Rule.** A letra cursiva pertence ao selo. Títulos, botões e navegação nunca usam fonte script.

## Layout

Mobile-first, de 320px a ultrawide. Container central de até `80rem`, com respiro lateral fluido (`clamp(1rem, 4vw, 2.5rem)`). Header fixo de `4.5rem`, transparente sobre o hero e creme translúcido com desfoque depois de 40px de rolagem. O hero ocupa a tela inteira (`100svh`): no celular, selo em cima e texto centralizado; a partir de `lg`, duas colunas (texto à esquerda, selo à direita). As seções alternam faixas escuras e claras para marcar o ritmo, com espaçamento vertical generoso (~6rem). Âncoras descontam o header fixo.

## Elevation & Depth

Profundidade **quente e difusa**: sombras grandes, macias e tingidas (vinho ou vermelho, nunca cinza puro), mais o brilho radial atrás do selo. As superfícies ficam planas em repouso. A sombra aparece para destacar o que é especial (o selo) ou para separar o header do conteúdo.

### Shadow Vocabulary

- **Selo flutuante** (`box-shadow: 0 30px 80px -20px` em Noite a 75%): o selo sobre o fundo escuro.
- **Header sólido** (`box-shadow: 0 1px 0` + `0 8px 30px -12px`, ambas em Vinho Noturno): separação do header ao rolar.
- **Halo do selo** (gradiente radial vermelho → vinho → transparente, com blur): luz atrás do selo que pulsa na batida.

### Named Rules

**The One Glow Rule.** Só o selo brilha. Botões, cartões e textos não ganham halo colorido; a luz é da marca, não da interface.

**The Warm Shadow Rule.** Sombras levam a cor da marca (vinho ou vermelho) em baixa opacidade. Sombra cinza neutra não entra.

## Shapes

Formas macias e acolhedoras. O círculo do selo é a forma-mãe: botões em pílula (`pill`), ícones sociais em círculo, cartões com cantos generosos (`lg` 1.25rem; `xl` 2rem em blocos grandes). Bordas finas e translúcidas (`currentColor` a 30%) em vez de linhas duras. A pincelada vermelha (path SVG orgânico) é a única forma "irregular" e funciona como sublinhado ou divisor.

## Components

### Buttons

Macios e calorosos: pílulas com altura mínima de 48px (alvo de toque confortável).

- **Shape:** pílula (`pill`).
- **Primary:** fundo vermelho da Graça, texto branco, `12px 24px`, sem sombra. Ícone de seta à direita, que desliza 4px no hover.
- **Hover / Focus:** passa a vermelho aceso (320ms, ease-out). `:active` reduz a 98%. Foco: contorno vermelho de 3px com 3px de afastamento.
- **Ghost:** transparente, borda `currentColor` a 30%, que fica sólida no hover. Usado como ação secundária sobre o escuro.
- **Light:** fundo creme, texto vinho. Para CTAs sobre faixas vinho.

### Navigation

- **Desktop (`lg`+):** links em Manrope 0.875rem com sublinhado vermelho que cresce da esquerda no hover. O último item ("Contribua") é uma pílula vermelha. Ícones sociais circulares a partir de `xl`.
- **Estados do header:** transparente com texto creme sobre o hero; creme translúcido com desfoque, texto tinta e sombra quente após rolar.
- **Mobile:** botão de menu circular; o menu abre em tela cheia sobre o vinho noturno, com links em Fraunces 1.875rem que entram em cascata e redes em círculos na base. Fecha com Esc, com o X ou ao tocar num link.

### Selo animado (signature)

O SVG da logo inline, com camadas nomeadas, se pinta na entrada: borda, texto em arco, fitas, nome, slogan e mini-coração. Depois bate duas vezes, solta faíscas e mantém brasas subindo. No scroll, encolhe e voa até virar o ícone do header. Detalhes em `docs/animacoes.md`.

### Abertura de seção

Título serifado (headline) sozinho, seguido de um parágrafo curto de apoio. Sem rótulo acima (The Heading Speaks Rule). A personalidade vem do título, da pincelada vermelha que pode sublinhar uma palavra-chave e da composição de cada seção.

## Do's and Don'ts

### Do:

- **Do** abrir cada seção com o título serifado sozinho; a palavra-chave pode ganhar a pincelada vermelha (The Heading Speaks Rule).
- **Do** usar o selo, o círculo, a pincelada e o mini-coração entre traços como assinatura e pontuação.
- **Do** alternar faixas escuras vinho com superfícies creme para dar ritmo.
- **Do** usar sombras quentes e tingidas e cantos macios (pílulas, `lg`/`xl`).
- **Do** usar fotos reais da igreja, com recorte pensado para fotos verticais de celular.
- **Do** garantir contraste AA: vermelho em texto pequeno usa `graca-red-deep`.

### Don't:

- **Don't** pintar seções claras inteiras de vermelho. Superfície forte é vinho (The Ember Rule).
- **Don't** usar fonte cursiva fora do selo (The Script Stays Home Rule).
- **Don't** usar cinzas frios, sombras cinza puro ou fundo de página branco puro.
- **Don't** usar a chama branca da arte de horários. A marca é o selo do coração.
- **Don't** usar imagens de banco genéricas.
