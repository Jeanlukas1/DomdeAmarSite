# A marcação da transmissão é gravada por uma entrada do site

Só o administrador usa o painel, e o filmmaker marca "ao vivo" por uma tela no app. A transmissão precisa continuar no repositório do site, porque é dali que vem o conteúdo e é o histórico dele que dispara os avisos. Decidimos que o servidor do app chama uma entrada protegida do site (`POST /api/v1/transmissao`), e é o site que grava no próprio repositório. Assim, cada segredo tem o menor poder possível: o segredo da entrada só permite marcar a transmissão de hoje, e o token que escreve no repositório nunca sai do projeto do site na Vercel.

## Opções consideradas

- **O servidor do app grava direto no repositório do site, pela API do GitHub:** o site não ganharia código nenhum. Mas um token capaz de reescrever qualquer arquivo do site passaria a morar no servidor do app.
- **O filmmaker usa o painel:** exigiria uma conta no GitHub e aprender o painel. Isso foi descartado.
- **Considerar ao vivo pelo horário, sem ninguém marcar:** mostraria "ao vivo" mesmo num culto que não foi transmitido.

## Consequências

- O site passa a ter uma rota sob demanda que grava em produção, como o painel. Ela só existe no build da Vercel.
- A credencial é um token refinado do GitHub, na conta do administrador, com permissão só de conteúdo neste repositório e sem expiração. A escolha é consciente: um token vencido pararia a live num domingo sem ninguém perceber. A troca fica documentada em `docs/deploy.md`.
- Quando a live tem endereço de vídeo, a mesma gravação cria o culto gravado do dia. O administrador não precisa cadastrar nada depois de cada culto.
