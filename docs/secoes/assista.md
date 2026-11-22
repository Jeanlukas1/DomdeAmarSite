# Assista — brief (cultos gravados com Facebook ou YouTube)

Status: aprovado (issue #6; spec 001, R18 e R19)

- **Objetivo:** quem perdeu o culto, ou quer ouvir de novo, assiste ao culto gravado mais recente com um toque. O YouTube toca no próprio site, e o Facebook abre a página do vídeo numa aba nova. É um refinamento: o mundo visual, a faixa noite, o pôster e a animação de entrada continuam como estão.
- **Destaque (o vídeo grande):** é o culto gravado mais recente que não seja provisório e tenha vídeo válido (`escolherDestaque`, em `src/lib/cultosGravados.ts`). Não tem cadastro próprio.
  - Mostra o título do culto em Fraunces e, abaixo, uma linha com a data, o texto bíblico e o pregador. A linha omite o que estiver vazio.
  - O pôster é a foto da seção (`assista.poster`, a mesma de hoje), e não uma miniatura do YouTube. Assim não há requisição a terceiros antes do clique, e a foto da igreja continua dando o tom.
  - **YouTube:** a mesma pílula vermelha "Assistir" de hoje. O clique troca o pôster pelo player (youtube-nocookie, autoplay) e leva o foco para ele.
  - **Facebook:** a pílula creme com o ícone do Facebook ("Assistir no Facebook"). Ela leva ao endereço do vídeo numa aba nova e avisa o leitor de tela que abre em nova aba.
- **Sem destaque (estado "em breve"):** igual a hoje, com o título em `assista.emBreveTitulo` (hoje "Culto da Plenitude do Amor"), o texto `emBreve` e a pílula creme que leva à página da igreja no Facebook.
- **Lista (abaixo do destaque):** mostra os 3 cultos gravados mais recentes, sem repetir o do destaque. Os provisórios aparecem, como hoje. A linha (data · título · texto bíblico e pregador · ícone) não muda. O que muda é o ícone e a ação:
  - **YouTube:** ícone ▶. Com JavaScript, o clique toca esse vídeo no player grande, no lugar do destaque. A página rola até o player, sem animação com menos movimento, e o foco vai para ele. Há um player só na página. Sem JavaScript, o link abre o vídeo no YouTube.
  - **Facebook:** ícone ↗ (sai do site). Abre o endereço do vídeo numa aba nova, com o aviso para o leitor de tela.
  - **Sem vídeo válido** (os provisórios de hoje): ícone ↗. Abre a página da igreja no Facebook numa aba nova, como hoje.
- **Link "Assistir no Facebook" sob a lista:** aparece quando há destaque, como alternativa. Sem destaque, a pílula do "em breve" já leva ao Facebook.
- **Movimento:** sem novidade: o "aproximar" do vídeo no scroll e o reveal em grupo da lista continuam. A troca para o player é instantânea. Com menos movimento, tudo funciona igual, sem rolagem suave.
- **Layout:** 375, 768 e 1440 px iguais aos de hoje. O ícone da linha mantém o alvo de 44 px.
- **Conteúdo:**
  - Em `assista.json`, o bloco `video` (título, descrição, id do YouTube, provisório) sai, e o pôster sobe para `poster`.
  - Entram os textos `emBreveTitulo` e `rotuloNovaAba` (o aviso para o leitor de tela).
  - `mensagensTitulo` vira `listaTitulo`, com o mesmo texto ("Mensagens recentes").
  - O painel acompanha essas mudanças.
- **Fora de escopo:** a transmissão ao vivo no site (R23), as miniaturas por vídeo e mais de 3 itens na lista.
