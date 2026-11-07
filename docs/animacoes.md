# Animações

> Implementação: `src/lib/animations/` (`motion.ts` registra GSAP/ScrollTrigger; `smooth.ts` = Lenis). Bundle global ≈ 52 KB gzip (GSAP + ScrollTrigger + SplitText + Lenis).

## Atributos

| Atributo            | Efeito                                         | Opções                |
| ------------------- | ---------------------------------------------- | --------------------- |
| `data-reveal`       | entra ao rolar (fade + slide)                  | `="up                 | left    | right | clip | scale"`, `data-reveal-delay="0.2"` |
| `data-reveal-group` | aplica stagger aos filhos `data-reveal`        | `data-stagger="0.08"` |
| `data-parallax`     | desloca no scroll                              | `="0.2"` (velocidade) |
| `data-split`        | texto se monta palavra a palavra/letra a letra | `="words              | chars"` |

O init vive em `src/lib/animations/init.ts`, carregado uma vez pelo layout. Com `prefers-reduced-motion`, nada se move: os elementos já começam no estado final.

## Regras

- Anime só `transform`/`opacity` (e `clip-path` com moderação).
- Reveals com `once: true`. Partículas e canvas pausam fora da tela.
- Nunca esconda conteúdo sem JS: o estado inicial "escondido" só é aplicado depois que o JS roda (classe `js` no `<html>`).
- Durações de 0.6–0.9s, ease `power3.out` (CSS: `--ease-out`).
- Teste em CPU 4× slowdown antes de commitar animação pesada.

## Carregamento (protege o LCP)

- Nada de GSAP, ScrollTrigger ou Lenis é baixado nem executado antes da primeira pintura. As entradas importam só `src/lib/agendar.ts` (sem dependências) e carregam o resto com `import()`:
  - `depoisDaPintura(fn)`: um frame depois de pintar (hero, init global, História);
  - `quandoOcioso(fn)`: depois da pintura e com o navegador ocioso (tudo abaixo da dobra).
- Menu e lightbox pausam o smooth scroll por `src/lib/rolagem.ts` (`pausarRolagem`/`retomarRolagem`), sem importar o Lenis.
- No celular, o **parágrafo** do hero é o maior elemento do topo (o LCP): ele e o h1 aparecem sem fade. Só os botões e a linha do próximo culto entram com `.hero-in`.

## Hero (`src/lib/animations/hero.ts`)

Timeline de ~4,5s sobre o SVG inline (`Hero.astro`), usando os ids de camada do `logo.svg`:

| t (s)     | Camada                  | Técnica                                                                                  |
| --------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| 0         | `fundo`                 | scale + fade                                                                             |
| 0.1       | `borda`                 | DrawSVG (abre do topo e fecha embaixo)                                                   |
| 0.35      | `arco-texto`            | máscara com traço em arco (DrawSVG), letra a letra                                       |
| 0.7 / 0.9 | `fita-esq` / `fita-dir` | máscara com traço de pincel (`PINCEL` no código)                                         |
| 1.6 → 2.5 | `dom`, `de`, `amar`     | clip retangular crescendo (escrita)                                                      |
| 3.0       | `slogan`                | clip retangular                                                                          |
| 3.5       | `mini-coracao`          | pop (back.out)                                                                           |
| 3.9       | —                       | batida dupla + brilho + explosão de faíscas; depois brasas em loop (pausam fora da tela) |

- Ao terminar, máscaras e clips são removidos: o SVG final fica "limpo".
- **Scroll:** o selo encolhe (power3.out) e voa até `[data-header-logo]`. O logo do header só aparece no fim (`data-aguarda-hero`).
- **Mouse** (só com ponteiro fino): inclinação 3D leve + brilho segue o cursor.
- **Sem JS / reduced-motion:** o selo aparece completo e o logo do header fica sempre visível.
- Título e parágrafo do hero aparecem prontos (são o LCP); botões e próximo culto entram por **CSS** (`.hero-in`), sem esperar JS.
- Se trocar o logo pelo original do designer: manter os ids e reajustar `PINCEL` e o raio do arco.

## A nova aliança (`src/lib/animations/alianca.ts`)

Transição entre o hero e o Quem somos, variante "o véu que se rasga" (Mt 27.51); o versículo é Mt 26.28 (`alianca.json`).

- **Chegada (scrub, top 80% → top):** o véu vinho se fecha a partir do centro (duas metades com `scaleX`) e a linha de luz já se desenha pelo meio.
- **Pin de 0,65 tela (scrub):** a noite sai de trás → a borda rasgada acende no lugar da linha e o véu abre primeiro no alto (giro pelos cantos de baixo) → as metades saem para os lados → o versículo fica sozinho no creme.
- **Borda rasgada:** fica dentro da borda interna de cada metade: faixa vermelha + creme além dos dentes (`fio` e `vao` no frontmatter), então as duas bordas aparecem mesmo com as metades sobrepostas.
- **Header:** recebe `data-sobre-veu` (transparente) no início do pin, para o rasgo nascer na borda de cima.
- **Reduced-motion / sem JS:** o HTML já é o estado final (véu assentado, versículo legível, onda creme). O módulo nem carrega com reduced-motion.
- **Fallback:** se o `import()` falhar ou não marcar `data-pronto` em 6 s, a seção ganha `.alianca--estatica` e volta ao estado estático (nunca fica uma tela escura vazia).
- A linha de luz não usa `vector-effect: non-scaling-stroke`: com ele o tracejado do DrawSVG é medido em pixels de tela e a linha sai com falhas.
- Carrega com `depoisDaPintura`. Depois do pin: `ScrollTrigger.sort()` + `refresh()`.

## Nossa história (`src/lib/animations/historia.ts`)

- **Desktop + movimento:** a seção é fixada (pin) e a trilha corre na horizontal (scrub). A pincelada vermelha se desenha com o progresso, e as fotos impressas caem girando (`containerAnimation`).
- **Celular:** a linha vertical vermelha desce com o scroll, e as fotos caem ao entrar.
- **Reduced-motion / sem JS:** layout empilhado, estático (a classe `is-horizontal` só é aplicada pelo JS).
- Depois de criar o pin: `ScrollTrigger.sort()` + `refresh()`, para os gatilhos das seções seguintes considerarem o espaço do pin.

## Helpers novos

- `data-reveal="circle"`: abre num círculo a partir do centro (a forma do selo).
- `data-brush`: a pincelada (`ui/Pincelada.astro`) se desenha ao entrar na tela.
