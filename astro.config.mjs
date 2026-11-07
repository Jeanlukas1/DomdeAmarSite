// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO(deploy): trocar pelo domínio definitivo.
const SITE = 'https://domdeamar.vercel.app';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  // sem estilos responsivos do Astro: são CSS fora de camada e venceriam os utilitários do Tailwind
  image: { responsiveStyles: false },
  build: { inlineStylesheets: 'always' },
});
