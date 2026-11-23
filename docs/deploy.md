# Deploy

Previsto para a F6.

- **Vercel**, ligada ao repositório GitHub: preview por branch e produção na `main`.
- Build: `npm run build`. Na Vercel (`VERCEL=1`) o build usa o adapter `@astrojs/vercel` por causa do painel `/keystatic`; o resto continua pré-renderizado.
- **Site no ar:** https://domdeamar.vercel.app (projeto `domdeamar` no time "Jean Lukas de Marins Costa's projects"). Publicar à mão: `npx vercel deploy --prod`.
- **Deploy automático:** o repositório `Jeanlukas1/DomdeAmarSite` está ligado ao projeto. Cada push na `main` publica em produção; outras branches geram uma prévia.
- **Keystatic em produção (GitHub App, uma vez só):**
  1. No PowerShell, na pasta do projeto: `$env:PUBLIC_KEYSTATIC_GITHUB='1'; npm run dev` e abra `http://localhost:4321/keystatic`.
  2. Siga o assistente "Create GitHub App" (nome sugerido: `domdeamar-keystatic`). Ele grava no `.env` local `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` e `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (o `.env` não vai para o Git).
  3. No GitHub, em _Settings → Developer settings → GitHub Apps → (o app) → Callback URL_, adicione `https://domdeamar.vercel.app/api/keystatic/github/oauth/callback` e instale o app no repositório.
  4. Copie as 4 variáveis para a Vercel (_Project → Settings → Environment Variables_, ambiente Production) e republique **sem cache**: `npx vercel deploy --prod --force` (um build reaproveitado do cache continua sem enxergar as variáveis e o login dá erro 500). **Feito em 07/11.** Atenção: no `.env` gerado, a linha `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` termina com um comentário (`# https://...`); na Vercel, use só o nome do app (`jeanlukas1-keystatic`).
  5. Teste: `https://domdeamar.vercel.app/keystatic` → login com GitHub → edite um culto → "Save" vira um commit e a Vercel publica.
- Sem Web3Forms: os contatos usam WhatsApp (decisão da F4). Quando o número real entrar em `igreja.json` (`contato.mock: false`), os botões passam a abrir o WhatsApp.
- Imagem de compartilhamento e ícone do iPhone: `npm run imagens` gera `public/og-image.jpg` e `public/apple-touch-icon.png` a partir do selo e do conteúdo (precisa do Chrome local). Rode de novo se mudar nome, slogan, endereço ou horários e faça o commit.
- Domínio próprio: configurar depois em _Project → Domains_ e atualizar `SITE` em `astro.config.mjs` e `public/robots.txt`.
- SEO local (ação da igreja): criar ou validar o **Perfil da Empresa no Google** com o mesmo nome, endereço e horários do site.

## Entrada da transmissão (`POST /api/v1/transmissao`)

A entrada que marca a transmissão ao vivo (ADR 0002, formato em `docs/DATA-MODEL.md`) só existe no build da Vercel. Ela precisa de duas variáveis no ambiente **Production** da Vercel (_Project → Settings → Environment Variables_). Nenhuma das duas vai para o repositório, para o `.env` versionado ou para o código: são lidas só na hora do pedido. Sem elas, a entrada recusa tudo (sem segredo, 401) ou não grava (sem token, 502).

| Variável                   | O que é                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `TRANSMISSAO_SEGREDO`      | o segredo da entrada; o servidor do app manda `Authorization: Bearer <segredo>`              |
| `TRANSMISSAO_GITHUB_TOKEN` | o token refinado do GitHub com que a entrada grava a transmissão e o culto gravado na `main` |

### Criar o segredo da entrada

1. Gere um texto aleatório longo. Na pasta do projeto: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` (gerador criptográfico; não use `Get-Random`).
2. Na Vercel, crie `TRANSMISSAO_SEGREDO` com esse valor, marcado como **Sensitive**, só em Production.
3. Entregue o mesmo valor ao servidor do app pelo cofre de segredos dele (nunca por mensagem ou e-mail em texto aberto).
4. Republique: `npx vercel deploy --prod --force` (sem cache, para o build enxergar a variável nova).

### Criar o token do GitHub

1. No GitHub, na conta do administrador: _Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token_.
2. Nome: `domdeamar-transmissao`. **Expiration: No expiration** (escolha consciente: um token vencido pararia a live num domingo sem ninguém perceber).
3. **Repository access: Only select repositories** → `Jeanlukas1/DomdeAmarSite`.
4. **Permissions → Repository permissions → Contents: Read and write**. Nenhuma outra permissão (a _Metadata: Read-only_ entra sozinha).
5. Gere e copie o token (ele só aparece uma vez). Na Vercel, crie `TRANSMISSAO_GITHUB_TOKEN` com ele, marcado como **Sensitive**, só em Production, e republique como acima.

### Conferir

Com o segredo, uma marcação de teste: `curl -X POST https://domdeamar.vercel.app/api/v1/transmissao -H "Authorization: Bearer <segredo>" -H "Content-Type: application/json" -d "{}"`. A resposta deve ser `200` e aparecer um commit `content: mark transmissao live on AAAA-MM-DD` na `main`. Depois, desligue o "Ao vivo" no painel (_Assista → Transmissão ao vivo_). Sem o segredo, a resposta deve ser `401`.

### Trocar o segredo ou o token

Troque quando houver suspeita de vazamento, quando alguém que tinha acesso sair, ou quando o servidor do app trocar de cofre.

- **Segredo:** gere um novo (passo 1 acima), atualize `TRANSMISSAO_SEGREDO` na Vercel e o segredo no servidor do app, e republique. Entre a troca na Vercel e a troca no app, as marcações recebem `401`: faça a troca fora do horário dos cultos.
- **Token:** gere um novo token com as mesmas opções, atualize `TRANSMISSAO_GITHUB_TOKEN` na Vercel e republique. Depois, no GitHub, apague o token antigo (_Fine-grained tokens → (o token) → Delete_). Confira com a marcação de teste.
