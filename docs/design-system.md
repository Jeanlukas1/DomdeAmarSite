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
- `eyebrow` (utilitário): caixa alta, 0.75rem, tracking 0.22em — **só para metadados** (dia/hora, datas). Nunca acima de títulos (The Heading Speaks Rule, em `DESIGN.md`).
- A letra cursiva ("Dom de Amar") aparece só dentro do SVG da logo.

## Motivos

- Pincelada vermelha (path SVG) como sublinhado/divisor.
- Mini-coração entre dois traços como separador (vem do rodapé da logo).

## Logo

- `src/assets/logo/logo.svg` é **gerado** por `node scripts/logo/build-logo.mjs` a partir de `logo-trace.svg` (o trace automático recebido). O script:
  - classifica cada pedaço por região e cor (`scripts/logo/layers.json`);
  - suaviza os degraus de pixel (RDP + Catmull-Rom);
  - remove ruído no coração e no "Amar";
  - troca a borda por um `<circle>` real.

  Use `--debug <arquivo.png>` para ver as camadas coloridas.

- Ids das camadas (contrato com a animação): `fundo`, `borda`, `coracao` (`fita-esq`, `fita-dir`), `nome` (`dom`, `de`, `amar`), `arco-texto`, `slogan` (`slogan-serif`, `slogan-script`), `mini-coracao`.
- Cores reais da logo: `#de0101`, `#a90504`, `#6f0101` (o "Dom" é vinho, não preto) e `#d08383`.
- **Quando chegar o original do designer:** exporte um SVG com essas camadas e ids e substitua o `logo.svg`. A partir daí o script deixa de ser necessário.
