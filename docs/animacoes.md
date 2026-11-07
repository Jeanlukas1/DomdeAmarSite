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
- O texto do hero entra por **CSS** (`.hero-in`), sem esperar JS, para proteger o LCP (h1).
- Se trocar o logo pelo original do designer: manter os ids e reajustar `PINCEL` e o raio do arco.

## Nossa história (`src/lib/animations/historia.ts`)

- **Desktop + movimento:** a seção é fixada (pin) e a trilha corre na horizontal (scrub). A pincelada vermelha se desenha com o progresso, e as fotos impressas caem girando (`containerAnimation`).
- **Celular:** a linha vertical vermelha desce com o scroll, e as fotos caem ao entrar.
- **Reduced-motion / sem JS:** layout empilhado, estático (a classe `is-horizontal` só é aplicada pelo JS).
- Depois de criar o pin: `ScrollTrigger.sort()` + `refresh()`, para os gatilhos das seções seguintes considerarem o espaço do pin.

## Helpers novos

- `data-reveal="circle"`: abre num círculo a partir do centro (a forma do selo).
- `data-brush`: a pincelada (`ui/Pincelada.astro`) se desenha ao entrar na tela.
