# Design com Impeccable

Todo trabalho visual do site passa pela skill **impeccable**, junto com `/nova-secao` e `/registrar-sessao`. O objetivo é o melhor design possível: um site que chame atenção e emocione quem chega, sem perder velocidade (Lighthouse mobile ≥ 95) nem acessibilidade.

**Fonte de verdade:** `PRODUCT.md` (produto e voz), `DESIGN.md` + `.impeccable/design.json` (visual: "O Selo da Graça"). Se uma decisão nova mudar o sistema, atualize-os.

## Fluxo por seção

1. **`/impeccable shape <seção>`:** antes de codar, defina objetivo, modo (a home é _Persuade_), hierarquia, layout no mobile e no desktop, qual foto real usar e qual momento de animação. Mostre em poucas linhas e siga se não houver bloqueio.
2. **`/nova-secao`:** implemente no padrão (componente + conteúdo + animação + doc), respeitando o `DESIGN.md` e o craft floor do impeccable.
3. **`/impeccable animate <seção>`** quando houver movimento: com propósito, ligado ao scroll, coerente com o hero (o selo e o coração como fio condutor).
4. **Verifique olhando:** em 375, 768 e 1440px, e com reduced-motion. Corrija o que viu numa leva só.
5. **`/impeccable critique <seção>`:** aplique as correções relevantes (prioridade: hierarquia, legibilidade, ritmo, contraste).
6. `npm run build` + `npm run lint` e commit.

## Ao fechar uma fase de páginas

- **`/impeccable critique` da página inteira:** ritmo entre seções, repetição de layouts, variedade de fundos (claro/escuro/vinho), transições e se a página conta uma história (boas-vindas → quem somos → história/novo templo → cultos → assista → participe → visite).
- **`/impeccable audit`:** acessibilidade, performance e responsividade. Corrija o que for material.
- **`/impeccable polish`:** passada final de espaçamentos, hover e foco, micro-interações, alinhamentos e recortes de imagem.
- Ficou sem graça → `bolder`. Ficou carregado → `quieter`. Decida pela crítica, não por gosto.
- Se o sistema evoluiu, atualize o `DESIGN.md` (`/impeccable document`), o `docs/design-system.md` e o `docs/animacoes.md`.

## Regras de qualidade

- Nada de visual genérico de template: cada seção tem uma ideia visual própria, dentro do mundo do Selo da Graça.
- **Fotos reais são o coração da página:** recortes pensados (muitas são verticais), tratamento consistente e nunca distorcidas.
- A animação nunca atrasa a leitura nem o LCP. O conteúdo é legível sem JS.
- Não troque textos factuais nem invente fatos. O que falta continua como mock em `docs/conteudo-pendente.md`.
- Se o impeccable sugerir algo que conflite com o `CLAUDE.md` ou com a performance, avise e proponha um meio-termo.
