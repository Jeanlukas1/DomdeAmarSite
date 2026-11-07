# Deploy

Previsto para a F6.

- **Vercel**, ligada ao repositório GitHub: preview por branch e produção na `main`.
- Build: `npm run build`. Na Vercel (`VERCEL=1`) o build usa o adapter `@astrojs/vercel` por causa do painel `/keystatic`; o resto continua pré-renderizado.
- **Keystatic em produção (GitHub App):** abra `/keystatic` no deploy e siga o assistente para criar o GitHub App do repositório `Jeanlukas1/DomdeAmarSite`. Ele gera as variáveis `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` e `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, que vão para _Project → Settings → Environment Variables_.
- Sem Web3Forms: os contatos usam WhatsApp (decisão da F4). Quando o número real entrar em `igreja.json` (`contato.mock: false`), os botões passam a abrir o WhatsApp.
- Imagem de compartilhamento e ícone do iPhone: `npm run imagens` gera `public/og-image.jpg` e `public/apple-touch-icon.png` a partir do selo e do conteúdo (precisa do Chrome local). Rode de novo se mudar nome, slogan, endereço ou horários e faça o commit.
- Domínio próprio: configurar depois em _Project → Domains_ e atualizar `SITE` em `astro.config.mjs` e `public/robots.txt`.
- SEO local (ação da igreja): criar ou validar o **Perfil da Empresa no Google** com o mesmo nome, endereço e horários do site.
