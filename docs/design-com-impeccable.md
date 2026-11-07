# Design com Impeccable

Todo trabalho visual do site passa pela skill **impeccable**, junto com `/nova-secao` e `/registrar-sessao`. O objetivo é o melhor design possível: um site que chame atenção e emocione quem chega, sem perder velocidade (Lighthouse mobile ≥ 95) nem acessibilidade.

**Fonte de verdade:** `PRODUCT.md` (produto e voz), `DESIGN.md` + `.impeccable/design.json` (visual: "O Selo da Graça"). Se uma decisão nova mudar o sistema, atualize-os.

## Princípio: decidir em texto, codar uma vez

O design de uma seção é decidido **inteiro no brief**, antes de qualquer código. O Claude não desenha uma versão para depois refazê-la com o impeccable: corrigir texto custa pouco, e refazer código custa caro. A crítica fica para a página montada, onde o ritmo entre seções aparece de verdade.

## Fluxo por seção

1. **`/impeccable shape <seção>`** → salva o brief em `docs/secoes/<slug>.md` (modelo abaixo), já com o momento de animação. Nada de código nesta etapa.
2. **Você aprova o brief** (ajusta o que quiser e marca `Status: aprovado`). Commit: `docs(secao): brief <nome>`.
3. **`/nova-secao <seção>`** executa o brief: conteúdo, schema, componente e animação numa passada só. Não toma decisões visuais fora do brief; se faltar algo, pergunta e registra no brief.
4. **Olhar uma vez** em 375, 768 e 1440px e com reduced-motion. Corrija só desvios do brief e quebras, numa leva só.
5. `npm run build` + `npm run lint` e commit `feat(secao): <nome>`.

Sem `animate` nem `critique` por seção: a animação já vem decidida no brief, e a crítica acontece na página inteira. Use `/impeccable animate` ou `/impeccable critique` numa seção isolada só quando algo claramente não funcionou.

### Modelo de brief (`docs/secoes/<slug>.md`)

```md
# <Seção> — brief

Status: rascunho | aprovado

- **Objetivo:** o que a pessoa sente/faz ao passar por aqui (1 frase).
- **Lugar na história da página:** o que vem antes e depois, e como a seção se liga a eles.
- **Hierarquia:** título (h2), apoio, elementos na ordem de importância.
- **Layout 375px:** …
- **Layout 1440px:** …
- **Fundo e paleta:** claro / escuro / vinho, com os tokens usados.
- **Foto(s):** arquivo em `src/assets/fotos/…` e recorte (`object-position`).
- **Movimento:** gatilho, o que se move, duração/scrub e a versão reduced-motion.
- **Conteúdo:** campos da coleção em `src/content/` e o que é mock.
- **Fora de escopo / riscos:** performance, embeds, dúvidas.
```

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
