# Prompt: Impeccable como parceiro de design (a partir da F3)

> Cole no Claude do terminal (modo planejamento para o passo 1; depois modo normal).

---

A partir de agora, **todo trabalho visual deste site passa pela skill `impeccable`**, junto com as nossas skills `/nova-secao` e `/registrar-sessao`. O objetivo é o melhor design possível: um site que chame atenção e emocione quem chega, sem perder velocidade (Lighthouse mobile ≥ 95) nem acessibilidade.

## Contexto que já existe (não refazer)

- `PRODUCT.md` e `DESIGN.md` ("O Selo da Graça") + `.impeccable/design.json` já definem produto, paleta, tipografia e regras (ex.: The One Glow Rule). São a **fonte de verdade do design**: siga-os; se uma decisão nova mudar o sistema, atualize-os.
- F1 e F2 prontas (tokens, logo em camadas, Header, Hero). Próxima: **F3 — Seções** (ver `docs/plano.md`).
- Convenções do `CLAUDE.md` continuam valendo (conteúdo só em `src/content/`, mocks com `mock: true`, helpers `data-reveal`/`data-parallax`/`data-split`, só `transform`/`opacity`, `prefers-reduced-motion`, commit por passo, build + lint antes de dar pronto).

## 1. Torne isso permanente

Adicione ao `CLAUDE.md` uma seção curta **"Design com Impeccable"** com o fluxo abaixo (em poucas linhas, apontando para este arquivo em vez de repetir tudo). Assim toda sessão futura segue o mesmo processo sem eu precisar pedir.

## 2. Fluxo por seção (repetir para cada seção da F3)

1. **`/impeccable shape <seção>`**: antes de codar, defina objetivo da seção, modo (a home é _Persuade_), hierarquia, layout em mobile e desktop, qual foto real usar e qual momento de animação ela terá. Mostre em poucas linhas e siga se não houver bloqueio.
2. **`/nova-secao`**: implemente seguindo o padrão (componente + conteúdo + animação + doc), respeitando o `DESIGN.md` e o _craft floor_ do Impeccable.
3. **`/impeccable animate <seção>`** quando a seção tiver movimento: animações com propósito, ligadas ao scroll, coerentes com o hero (o selo/coração como fio condutor).
4. **Verifique olhando**: rode o site e veja a seção renderizada em **375px, 768px e 1440px** (e com reduced-motion). Corrija o que viu numa leva só.
5. **`/impeccable critique <seção>`**: aplique as correções relevantes (prioridade: hierarquia, legibilidade, ritmo, contraste).
6. `npm run build` + `npm run lint`, commit.

## 3. Ao fechar a F3 (página inteira)

- **`/impeccable critique`** da home completa: ritmo entre seções, repetição de layouts, variedade de fundos (claro/escuro/vinho), transições entre seções, se a página conta uma história (boas-vindas → quem somos → história/novo templo → cultos → assista → participe → visite).
- **`/impeccable audit`**: acessibilidade, performance, responsividade. Corrija o que for material.
- **`/impeccable polish`**: passada final de detalhes (espaçamentos, estados de hover/focus, micro-interações, alinhamentos, imagens com recorte certo).
- Se algo ficou sem graça, use **`bolder`**; se ficou carregado, **`quieter`**. Decida pela crítica, não por gosto.
- Atualize `DESIGN.md` (`/impeccable document`) se o sistema evoluiu, e `docs/design-system.md` / `docs/animacoes.md`.

## 4. Regras de qualidade

- Nada de visual genérico de template: cada seção deve ter uma ideia visual própria, mas todas dentro do mesmo mundo do Selo da Graça.
- Fotos reais são o coração da página: recortes pensados (muitas são verticais), tratamento consistente, nunca distorcidas.
- Animação nunca atrasa a leitura nem o LCP; o conteúdo é legível sem JS.
- Não troque textos factuais nem invente fatos; conteúdo faltante continua como mock listado em `docs/conteudo-pendente.md`.
- Se o Impeccable sugerir algo que conflite com `CLAUDE.md` ou com a performance, me diga e proponha o meio-termo.

## 5. Entregável deste pedido

1. Seção "Design com Impeccable" no `CLAUDE.md` (commit).
2. Plano curto da F3: ordem das seções e, para cada uma, o resultado do `shape` (1–3 linhas).
3. Depois que eu aprovar, execute seção por seção no fluxo acima e, ao final, rode `/registrar-sessao`.
