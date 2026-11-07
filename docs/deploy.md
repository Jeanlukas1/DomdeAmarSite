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
  4. Copie as 4 variáveis para a Vercel (_Project → Settings → Environment Variables_, ambiente Production) e republique.
  5. Teste: `https://domdeamar.vercel.app/keystatic` → login com GitHub → edite um culto → "Save" vira um commit e a Vercel publica.
- Sem Web3Forms: os contatos usam WhatsApp (decisão da F4). Quando o número real entrar em `igreja.json` (`contato.mock: false`), os botões passam a abrir o WhatsApp.
- Imagem de compartilhamento e ícone do iPhone: `npm run imagens` gera `public/og-image.jpg` e `public/apple-touch-icon.png` a partir do selo e do conteúdo (precisa do Chrome local). Rode de novo se mudar nome, slogan, endereço ou horários e faça o commit.
- Domínio próprio: configurar depois em _Project → Domains_ e atualizar `SITE` em `astro.config.mjs` e `public/robots.txt`.
- SEO local (ação da igreja): criar ou validar o **Perfil da Empresa no Google** com o mesmo nome, endereço e horários do site.
