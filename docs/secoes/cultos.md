# Cultos — brief (Santa Ceia e calendário real)

Status: aprovado (plano da sessão 09)

- **Objetivo:** quem chega sabe exatamente quando é o próximo encontro, inclusive no 2º domingo do mês, quando a Santa Ceia substitui os encontros do domingo.
- **Lugar na história da página:** depois da História e antes do Visite. O convite impresso (cards) + o destaque da semana.
- **Hierarquia:** título (h2) → convite com os encontros (o próximo em vinho, com o pulso) → destaque da semana (data · hora · encontro; tema em Fraunces; texto bíblico e pregador).
- **Layout 375px:** linhas de convite (miniatura + dia/hora). Na semana da Ceia, ela vem primeiro.
- **Layout 1440px:** 3 colunas. Na semana da Ceia, 2×2 com a Ceia primeiro e as fotos em 2:1, para a grade não dobrar de altura. Separadores de 1px pelo `gap` (funciona com 3 ou 4 cards).
- **Semana da Ceia:** os cards do Seminário e da Plenitude continuam visíveis, com a foto recuada (opacidade 0,4) e o aviso em `red-700` ("Neste domingo: Santa Ceia às 10h, no lugar deste encontro"). O texto continua com contraste AA.
- **Fundo e paleta:** creme; cards brancos; próximo encontro em `wine-900`.
- **Foto(s):** Ceia com `comunhao/comunhao-11` (provisória, mock).
- **Movimento:** sem novidade (reveal em grupo já existente; pulso do próximo encontro).
- **Conteúdo:** `cultos.json` (regra do calendário) e `cultos-secao.json` (`avisoSubstituido`, `semana.data`). Ver `docs/conteudo.md`.
- **Fora de escopo / riscos:** o título "Três encontros por semana" continua (texto editável); na semana da Ceia, o card dela explica a exceção. A Ceia não vai para a Agenda.
