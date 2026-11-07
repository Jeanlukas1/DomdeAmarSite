# Design system

Fonte: `src/design/tokens.json` → `npm run tokens` → `src/styles/tokens.css` (`@theme`). Os nomes viram classes Tailwind (`bg-wine-900`, `text-red-600`, `font-display`, `ease-out`, `duration-reveal`).

## Paleta (extraída da logo)

| Token                             | Hex                         | Uso                                              |
| --------------------------------- | --------------------------- | ------------------------------------------------ |
| `red-600`                         | #de0101                     | cor da marca, CTAs, destaques                    |
| `red-700`                         | #a90504                     | texto vermelho em tamanho pequeno (contraste AA) |
| `wine-900` / `wine-950` / `night` | #6f0101 / #2a0505 / #140708 | hero e faixas escuras (Novo Templo, Contribua)   |
| `blush` / `blush-100`             | #d08383 / #f7e3e1           | brilhos, texto suave sobre escuro                |
| `ink` / `ink-soft` / `muted`      | #111 / #3d3536 / #6e6264    | textos                                           |
| `cream` / `sand` / `white`        | #fff8f3 / #f4ebe4 / #fff    | fundos das seções                                |

Regra de contraste: `red-600` sobre claro só em texto ≥ 18px ou bold; abaixo disso use `red-700`.

## Tipografia

- **Fraunces Variable** (`font-display`): títulos, com eixo `opsz`. Itálico leve para frases de efeito.
- **Manrope Variable** (`font-sans`): texto e UI.
- `eyebrow`: caixa alta, 0.75rem, tracking 0.22em, que ecoa o texto em arco da logo.
- A letra cursiva ("Dom de Amar") aparece só dentro do SVG da logo.

## Motivos

- Pincelada vermelha (path SVG) como sublinhado/divisor.
- Mini-coração entre dois traços como separador (vem do rodapé da logo).

## Logo

O SVG atual (`logo_dom_de_amar.svg`) é um trace automático, sem camadas. Na F2 ele é redesenhado em camadas com IDs fixos (`borda`, `arco-texto`, `fita-esq`, `fita-dir`, `dom`, `de`, `amar`, `slogan`, `mini-coracao`). Quando o designer enviar o original, basta trocar o arquivo mantendo os IDs.
