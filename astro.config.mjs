// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// TODO(deploy): trocar pelo domínio definitivo.
const SITE = 'https://domdeamar.vercel.app';

// O painel /keystatic é a única rota sob demanda (precisa de servidor). Ele só entra no
// `astro dev` (salva nos arquivos locais) e no build da Vercel (salva por commit no GitHub).
// O `npm run build` local continua 100% estático — o preview e o Lighthouse não mudam.
const naVercel = Boolean(process.env.VERCEL);
const comPainel = naVercel || process.argv.includes('dev');

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({ filter: (pagina) => !pagina.includes('/keystatic') }),
    ...(comPainel ? [react(), keystatic()] : []),
  ],
  adapter: naVercel ? vercel() : undefined,
  vite: { plugins: [tailwindcss()] },
  // sem estilos responsivos do Astro: são CSS fora de camada e venceriam os utilitários do Tailwind
  image: { responsiveStyles: false },
  build: { inlineStylesheets: 'always' },
});
