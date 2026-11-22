# Spec 001: Extensão do site para o app

- **Data:** 2026-11-22
- **Nível de risco:** Crítico
- **Motivo do nível:** cria um contrato público lido por outro sistema (o conteúdo em `/api/v1`), cria uma entrada com autenticação que grava em produção, guarda segredos (o segredo da entrada e o token do GitHub) e traz uma dependência nova (Vitest).
- **Altera:** nenhuma

O vocabulário segue o `GLOSSARY.md` do repositório do app (DomdeAmarApp). Esta spec é a "Extensão do site" de que depende a spec 001 do app.

## Problema

O app da igreja lê do site tudo o que mostra, mas o site ainda não cadastra nem publica boa parte do que o app precisa: o vídeo de cada culto gravado, a transmissão ao vivo, os cancelamentos e as mudanças de horário, e não avisa ninguém quando o conteúdo muda. O endereço de onde o app lê o conteúdo também não está fixado em nenhum documento: o app usa hoje um endereço provisório, num formato interno do site que pode mudar sem aviso.

Do lado do próprio site, um culto cancelado não tem como ser registrado: o site continuaria anunciando como "próximo culto" um encontro que não vai acontecer.

Só o administrador entra no painel. O filmmaker, que é quem sabe a hora em que a live começa, não tem conta e não deve precisar de uma.

## Solução

O site passa a publicar, num endereço fixo e versionado, todo o conteúdo do app num formato documentado. No painel, o administrador cadastra os cultos gravados com o vídeo de qualquer plataforma (Facebook ou YouTube), as alterações (com a opção de avisar, que vem desligada) e a transmissão.

O filmmaker marca "ao vivo" por uma tela no app. O servidor do app repassa essa marcação a uma entrada protegida do site, que grava a transmissão do dia e, quando vem o endereço do vídeo, já cria o culto gravado daquele dia. Toda gravação de conteúdo chama o servidor do app, que decide quais avisos enviar.

O site também passa a respeitar as alterações: um culto cancelado aparece como cancelado, e um culto com horário alterado aparece no horário novo. O vídeo em destaque do site passa a ser sempre o culto gravado mais recente.

## Requisitos

### Conteúdo publicado para o app

- **R1** — O endereço oficial do conteúdo do app é `https://domdeamar.vercel.app/api/v1/`. Cada coleção é um arquivo JSON nesse endereço: `igreja`, `encontros`, `eventos`, `tema-da-semana`, `alteracoes`, `transmissao`, `cultos-gravados`, `contribuicao` e `assuntos-de-contato` (por exemplo, `https://domdeamar.vercel.app/api/v1/encontros.json`).
- **R2** — Cada arquivo publicado segue exatamente o formato descrito no `docs/DATA-MODEL.md` do site: os nomes das chaves, os tipos e os valores permitidos. Um dado ausente é publicado como `null`, nunca como texto vazio.
- **R3** — Os itens provisórios são publicados com `provisorio: true`, e não retirados da publicação.
- **R4** — Os arquivos publicados podem ser lidos de qualquer origem pelo navegador e são revalidados a cada leitura.
- **R5** — Uma gravação de conteúdo (pelo painel ou pela entrada da transmissão) aparece no endereço publicado em até 2 minutos.
- **R6** — Em `igreja`, o WhatsApp é publicado só com dígitos, com o código do país, e é `null` enquanto o contato estiver marcado como provisório. As redes publicadas são só o Facebook e o YouTube.
- **R7** — Os cultos gravados são publicados do mais recente para o mais antigo.
- **R8** — Quando o site passar a usar o domínio próprio da igreja, `https://domdeamar.vercel.app/api/v1/` continua respondendo com o mesmo conteúdo.
- **R9** — Os endereços antigos (`/api/igreja.json`, `/api/cultos.json`, `/api/eventos.json`, `/api/mensagens.json`, `/api/ministerios.json` e `/api/pastores.json`) só deixam de existir depois que o app passar a ler `/api/v1`.

### Validação do conteúdo

- **R10** — Uma alteração que não cumpre as regras do contrato é retirada da publicação, e o build registra um alerta que diz qual alteração e por quê. As regras são:
  - o alvo existe entre os encontros e eventos;
  - a data cai numa ocorrência do alvo;
  - há no máximo uma alteração por alvo e data;
  - "alterado" tem nova hora, novo local ou os dois.

  O restante do conteúdo é publicado normalmente.

- **R11** — Um culto gravado ou uma transmissão cujo vídeo não tem plataforma conhecida (Facebook ou YouTube) com um endereço daquela plataforma é tratado do mesmo modo:
  - um culto gravado nessas condições é retirado da publicação, com alerta;
  - numa transmissão, o vídeo é publicado como `null`, com alerta.
- **R12** — Se um identificador se repete entre encontros e eventos, o build falha com uma mensagem que diz qual identificador se repete e onde.

### Painel

- **R13** — Como administrador, quero cadastrar no painel os cultos gravados, cada um com título, texto bíblico, pregador, data, plataforma e endereço do vídeo, e a marcação de provisório. Esse cadastro substitui as "Mensagens", que só aceitavam um vídeo do YouTube.
- **R14** — Como administrador, quero ver e corrigir no painel a transmissão: "ao vivo" (desligado por padrão), a data e o vídeo opcional (plataforma e endereço).
- **R15** — Como administrador, quero cadastrar alterações. Cada alteração tem:
  - o alvo, escolhido numa lista com os encontros e eventos cadastrados;
  - a data;
  - a situação (cancelado ou alterado);
  - a nova hora e o novo local;
  - a mensagem;
  - a opção "avisar", que vem desligada.

  O identificador de uma alteração é criado junto com ela e não muda quando ela é editada.

- **R16** — No painel, os campos de identificador de encontros e eventos explicam que o identificador não deve ser mudado depois de publicado.
- **R17** — O tema da semana, a contribuição e os assuntos de contato continuam sendo cadastrados como hoje, sem campo novo, e passam a ser publicados para o app.

### O que o visitante vê no site

- **R18** — Como visitante, quero ver em destaque, na seção Assista, o culto gravado mais recente que não seja provisório.
  - Um vídeo do YouTube toca no site depois de um clique.
  - Um vídeo do Facebook abre a página daquele vídeo no Facebook, numa aba nova.
  - Sem culto gravado, a seção mostra o estado "em breve" de hoje.
- **R19** — A lista de cultos gravados do site segue a mesma regra de plataforma de R18.
- **R20** — O próximo culto anunciado no site nunca é um encontro ou evento cancelado por uma alteração. Um encontro com horário alterado é anunciado no horário novo, com a indicação de que mudou.
- **R21** — Onde o site mostra um encontro ou evento numa data, uma alteração daquela data aparece junto, com a mensagem:
  - cancelado: "Cancelado";
  - alterado: o horário e o local novos.
- **R22** — As indicações de R20 e R21 ficam legíveis sem JavaScript e com a preferência por menos movimento. A página inicial mantém a nota de desempenho do Lighthouse no celular de pelo menos 95.
- **R23** — O site não mostra a transmissão ao vivo.

### Marcação da transmissão

- **R24** — O site oferece uma entrada para marcar a transmissão: um pedido `POST` a `https://domdeamar.vercel.app/api/v1/transmissao`, com o segredo da entrada no cabeçalho de autorização (`Authorization: Bearer <segredo>`) e, opcionalmente, o vídeo da live (plataforma e endereço).
  - Ela grava a transmissão como ao vivo, com a data de hoje no horário de Brasília.
  - A data nunca vem de quem chama.
- **R25** — Um pedido sem o segredo certo é recusado com o código 401 e não grava nada. Um pedido com vídeo inválido (plataforma desconhecida ou endereço que não é daquela plataforma) é recusado com o código 400 e não grava nada.
- **R26** — A entrada só responde que deu certo depois de a gravação estar na `main` do repositório do site. Se a gravação falhar, ela responde com erro e nada fica gravado pela metade.
- **R27** — Se a transmissão de hoje já está marcada como ao vivo e o pedido não traz nada novo, a entrada responde que deu certo sem gravar nada. Se o pedido traz um vídeo e a transmissão de hoje ainda não tem vídeo, a entrada acrescenta o vídeo. Se a transmissão de hoje já tem outro vídeo, ele não é trocado: a correção é feita pelo painel.
- **R28** — Quando a transmissão de hoje passa a ter vídeo e ainda não existe culto gravado com a data de hoje, a mesma gravação cria esse culto gravado, não provisório, com o vídeo da transmissão. Os campos vêm assim:
  - **Título, texto bíblico e pregador:** vêm do tema da semana, se a data do tema for hoje.
  - **Título sem tema:** é o nome do encontro ou evento de hoje cuja janela de transmissão contém o momento da marcação. Se nenhum contém, é o primeiro de hoje. Se não houver nenhum, é um título padrão cadastrado no painel. Nesses três casos, o texto bíblico e o pregador ficam vazios.
- **R29** — Uma gravação feita pelo painel ao mesmo tempo que uma marcação não se perde: as duas ficam no repositório.
- **R30** — O segredo da entrada e a credencial que grava no repositório ficam só no cofre de segredos da Vercel. Nenhum dos dois aparece no repositório, no código entregue ao navegador ou nas respostas da entrada.

### Chamada ao servidor do app

- **R31** — A cada push na `main` do repositório do site, o GitHub chama o servidor do app com o evento de push, assinado com um segredo compartilhado (assinatura HMAC SHA-256 do GitHub).
- **R32** — A documentação de deploy do site explica, passo a passo:
  - como configurar essa chamada;
  - como criar e trocar o segredo da entrada da transmissão;
  - como criar e trocar a credencial que grava no repositório.

### Verificação

- **R33** — O site tem testes automatizados que rodam com um comando só e cobrem o formato publicado, o calendário com as alterações e a entrada da transmissão. Um ticket desta spec só é considerado verificado com esses testes, o lint e o build passando.

## Decisões de implementação

As decisões difíceis de reverter estão em `docs/adr/` (0001: contrato versionado; 0002: entrada de escrita da transmissão no site). O modelo de dados está em `docs/DATA-MODEL.md` e a arquitetura em `docs/arquitetura.md`.

**Contrato.**

- O formato publicado é próprio, e não o formato interno do site. Uma camada de tradução lê as coleções do site e monta cada arquivo de `/api/v1`. Por exemplo, `mock` vira `provisorio`, a foto e a ordem ficam de fora, e o WhatsApp sai em dígitos.
- O formato publicado é validado por um esquema Zod do contrato, o mesmo que os testes usam. Um build não publica um arquivo fora do contrato.
- Os arquivos são gerados no build, como os de hoje.

**Arquivos do repositório que o servidor do app lê.** O servidor do app lê o histórico do repositório, e não o site publicado. Por isso o formato destes arquivos também é contrato:

- **Transmissão e alterações:** são arquivos novos e usam as mesmas chaves da publicação, dentro do envelope do painel (`principal` para um cadastro único, `itens` para uma lista).
- **Eventos e encontros:** mantêm o formato atual. O `docs/DATA-MODEL.md` lista as chaves em que o servidor pode confiar.

**Cultos gravados.**

- O cadastro "Mensagens" é renomeado para "Cultos gravados", e o id do YouTube é trocado por plataforma e endereço.
- Os itens atuais são todos provisórios e sem vídeo; a migração os mantém como provisórios.
- O destaque da seção Assista deixa de ter um cadastro próprio.

**Calendário.**

- O módulo de calendário do site passa a aplicar as alterações (cancelado, alterado) sobre as ocorrências, nos mesmos termos do app.
- Os casos de borda do app e os do `checar-encontros` viram testes.
- Encontros e eventos passam pela mesma regra.

**Entrada da transmissão.**

- É uma rota sob demanda, como o painel. Só existe no build da Vercel, e o build local continua 100% estático.
- Ela grava pela API REST do GitHub, com o `fetch` nativo e sem biblioteca: lê a ponta da `main`, monta a árvore com um ou dois arquivos, cria o commit e move a `main`. Se a `main` andou no meio (uma gravação do painel), recomeça a partir da ponta nova, até três vezes.
- A credencial é um token refinado (fine-grained) do GitHub, na conta do administrador, com permissão só de conteúdo e só neste repositório, sem expiração.
- O segredo da entrada é comparado em tempo constante.
- Os textos padrão (o título do culto gravado sem tema) ficam no conteúdo, não no código.

**Painel.**

- A lista de alvos das alterações é montada a partir dos encontros e eventos no momento do build, como a lista de fotos.
- O identificador da alteração é gerado na criação.

**Chamada ao servidor do app.** Um webhook do repositório no GitHub, sem código no site. Ele é ligado quando o servidor do app tiver endereço.

**Ordem de entrega.**

1. Contrato e testes.
2. Painel (cultos gravados, transmissão, alterações).
3. O site respeitando as alterações e o destaque.
4. Entrada da transmissão.
5. Webhook e documentação de deploy.
6. Por último, a remoção dos endereços antigos (R9).

## Decisões de teste

Pontos de teste combinados:

- **P1 — O conteúdo publicado.** Monta os arquivos de `/api/v1` a partir de conteúdo de teste e confere cada um contra o esquema do contrato. Cobre:
  - a tradução dos campos (R2, R6, R7);
  - os provisórios (R3);
  - o descarte com alerta das alterações e dos vídeos inválidos (R10, R11);
  - a falha por identificador repetido (R12).
- **P2 — O calendário com alterações, isolado.** Funções puras com instantes fixos. Cobre o segundo domingo, as viradas de mês e de ano, os limites de duração, a substituição, o cancelamento e a mudança de horário (R20, R21). Os casos de borda do app e do `checar-encontros` são o ponto de partida.
- **P3 — A entrada da transmissão.** Recebe um pedido e o instante atual, com o GitHub substituído por um dublê na fronteira, e confere o que seria gravado. Cobre:
  - recusa sem segredo e com vídeo inválido (R25);
  - data de hoje no fuso da igreja (R24);
  - resposta só depois da gravação e nada pela metade em falha (R26);
  - toque repetido (R27);
  - criação do culto gravado (R28);
  - nova tentativa quando a `main` andou (R29).

Um bom teste aqui descreve o que o app ou o visitante recebe: o que é publicado, o que é gravado, a resposta da entrada. Ele não descreve como o código chega lá. Os testes usam instantes fixos, nunca o relógio real, e conteúdo de teste, nunca o conteúdo real do site. Um teste que só passa numa data ou hora específica do mundo real é um defeito do teste.

Ficam fora da automação e são conferidos à mão, uma vez:

- R4, R5 e R8 no endereço publicado;
- R18, R19 e R22 no navegador, em 375, 768 e 1440 px e com menos movimento;
- a marcação real pela entrada em produção;
- a chegada do webhook ao servidor do app (R31).

Testes semelhantes que já existem: o `checar-encontros`, um script que confere o calendário nos casos de borda sem framework de testes. Ele é o ponto de partida de P2 e é substituído pelos testes novos.

## Fora de escopo

- Mostrar a transmissão ao vivo no site.
- A detecção automática de que a live começou. Volta à pauta quando o canal do YouTube existir.
- A tela do app em que o filmmaker marca a transmissão, e a forma como o app reconhece o filmmaker.
- O Instagram no conteúdo do app.
- O domínio próprio da igreja. Quando ele existir, esta spec recebe uma emenda com o novo endereço oficial, mantendo R8.
- Contas no painel para as missionárias e o filmmaker: só o administrador usa o painel.
- Integração contínua no repositório do site.

## Notas

**Pendências no repositório do app.** Cada uma vai num PR do próprio app.

- `GLOSSARY.md`: "Editor" e "Painel" passam a refletir que só o administrador usa o painel, e que o filmmaker marca a transmissão pelo app.
- Spec do app: ajustar o texto de R13 e R34 ("marcado pelo filmmaker", "depois de o editor salvar"). Uma nova spec cobre a tela de marcação da transmissão e a chamada do servidor do app à entrada do site (R24), com o segredo da entrada.
- `DATA-MODEL.md` do app: o culto gravado aceita texto bíblico e pregador vazios (R28), e o documento aponta para o `docs/DATA-MODEL.md` do site para os nomes das chaves e o formato dos arquivos.
- O app esconde da lista de cultos gravados o culto gravado da transmissão de hoje enquanto ela estiver ao vivo.
- Trocar `VITE_ORIGEM_DO_CONTEUDO` para `https://domdeamar.vercel.app/api/v1`. Isso libera R9.

**Fatos levantados na descoberta.**

- O site publica em cerca de 30 segundos depois de cada push na `main` (medido pelos status do GitHub em novembro de 2026). Uma marcação aparece no app praticamente junto com o aviso.
- As respostas de `/api/*.json` já saem com `Access-Control-Allow-Origin: *` e `Cache-Control: public, max-age=0, must-revalidate`.
- O webhook dispara em todo push na `main`, inclusive de código. Cabe ao servidor do app ignorar o que não muda conteúdo.
- Um token refinado sem expiração é uma escolha consciente: um token vencido pararia a live num domingo sem ninguém perceber. Em troca, a troca do token fica documentada (R32), e ele só pode mexer no conteúdo deste repositório.

## Emendas

Nenhuma. Esta seção só recebe acréscimos no final. Cada emenda registra uma decisão de implementação ou de teste que mudou depois da aprovação, por decisão humana em um portão: a data, a decisão substituída, o que passa a valer e a issue. Requisitos não são emendados; mudam por uma nova spec.
