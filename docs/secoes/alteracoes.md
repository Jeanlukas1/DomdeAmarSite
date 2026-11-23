# Alterações — brief (cancelado e horário ou local alterado)

Status: aprovado (2026-11-22)

Ticket #8. Requisitos R20, R21 e R22 de `docs/specs/001-extensao-para-o-app.md`. Não é uma seção nova: é uma indicação que aparece em quatro lugares que já existem (o próximo culto do Hero, os cartões de Cultos, o destaque da semana e a Agenda).

- **Objetivo:** quem confere o horário pelo site nunca vai a um culto cancelado nem chega no horário antigo. A mudança se lê de relance e a mensagem da igreja vem junto ("Culto cancelado por causa da chuva").
- **Modo:** Operate dentro de uma página Persuade. Precisão e contenção: é um recado da igreja, não um alarme. Nada de vermelho de erro em toda a parte, nada de texto riscado (atrapalha a leitura de quem tem vista cansada).
- **De onde vêm os dados:** só as alterações publicadas para o app (`/api/v1/alteracoes`, já validadas). O site e o app mostram exatamente as mesmas.

## Peça única: a marca da alteração

Um primitivo reutilizado nos quatro lugares (`src/components/ui/`), com duas partes:

1. **Rótulo** em pílula, caixa alta espaçada (é metadado, então a regra do eyebrow permite): "Cancelado" ou "Alterado". Contorno fino em `currentColor` a 40%, texto em negrito, tamanho de rótulo (0,75rem). Herda a cor do lugar: `red-700` no creme e no branco; `cream` no vinho e no escuro. Sem fundo cheio e sem brilho (One Glow Rule).
2. **Linha da data e do que mudou**, ao lado do rótulo (quebra embaixo no celular): "domingo, 15 de novembro" no cancelado; "domingo, 15 de novembro · às 11h · na Praça de Jaconé" no alterado (só as partes que mudaram).
3. **Mensagem** embaixo, em texto corrido (`ink-soft` no claro, `blush-100` no escuro), sem aspas.

Os textos fixos ("Cancelado", "Alterado", "horário alterado", "às", "na/no") ficam no conteúdo (`src/content/ui.json`, grupo `alteracoes`), não no componente.

## Onde aparece

- **Hero (próximo culto):** com JS, o anúncio pula o cancelado e mostra o seguinte. Se o próximo tem horário alterado, a linha mostra o horário novo e termina com "· horário alterado" (sem pílula: a linha é curta e já é um link para Cultos). Se o local mudou, a segunda linha troca o endereço da igreja pelo local novo. A mensagem não entra no Hero: ela está a um toque, nos Cultos. Sem JS, continua a grade semanal de hoje ("Terça 19h · Domingo 9h e 18h"), que é sempre verdadeira.
- **Cartões de Cultos:** a marca entra no lugar do aviso de hoje (abaixo do título), uma por alteração futura daquele encontro, em ordem de data. Quando a próxima vez do encontro está cancelada, a foto recua (opacidade 0,4), como nos encontros que a Santa Ceia substitui. O cartão marcado como próximo, se a vez dele foi alterada, mostra no rótulo "Próximo encontro · Hoje · às 11h" (o horário novo), e a marca explica embaixo. Na semana da Ceia cancelada, o cartão da Ceia aparece com "Cancelado".
- **Destaque da semana:** pula o encontro cancelado e passa para o seguinte (com o tema só se a data bater, como hoje). Se o encontro do destaque foi alterado, a linha da data usa o horário novo e a marca aparece abaixo do título, com a mensagem.
- **Agenda:** cancelado: a marca abaixo da linha de dia e hora, a folhinha recua (opacidade 0,5) e o título continua legível. Alterado: a linha de dia, hora e local já mostra os valores novos, e a marca vem embaixo com a mensagem.

## Sem JavaScript e com menos movimento (R22)

- As marcas saem prontas no HTML do build (o site é refeito a cada gravação do painel). Entram as alterações com data a partir do dia do build; com JS, as que já passaram somem, como os eventos passados da Agenda.
- Sem animação nova. A marca aparece junto com o cartão (o reveal que já existe); com `prefers-reduced-motion`, nada muda além do que já muda hoje.
- Contraste AA nos dois fundos; a marca não depende só de cor (tem a palavra).

## Estados e quantidades

- Normal: nenhuma alteração (nada muda na página).
- Típico: uma alteração por mês. Máximo realista: duas no mesmo cartão (domingos seguidos).
- Mensagem curta (até ~120 caracteres); se maior, quebra em linhas, sem cortar.

## Fora de escopo e riscos

- Avisos, transmissão ao vivo, nenhuma mudança no painel.
- Desempenho: JSON pequeno nos atributos que já existem e alguns elementos a mais; sem fonte, imagem ou biblioteca nova. Conferir o Lighthouse mobile ≥ 95 da home.
- Conferência no navegador em 375, 768 e 1440 px e com menos movimento, simulando datas com `?agora=` no `npm run dev`.

## Nota de implementação

- O local novo aparece sem artigo ("domingo, 15 de novembro · às 11h · Praça de Jaconé"): o site não tem como saber se o nome do lugar pede "na" ou "no". Por isso `ui.json` → `alteracoes` não tem "na/no". (#8)
