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
