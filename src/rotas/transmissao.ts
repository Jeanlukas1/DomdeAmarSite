// POST /api/v1/transmissao: a entrada que marca a transmissão ao vivo (spec 001, R24 a R30;
// ADR 0002). Rota sob demanda, como o painel: só é registrada no build da Vercel (ver
// astro.config.mjs), e o build local continua 100% estático. O segredo da entrada e o token do
// GitHub são lidos do ambiente na hora do pedido, nunca do código: ver docs/deploy.md.
import type { APIRoute } from 'astro';
import { marcarTransmissao } from '@/lib/transmissao/entrada';

export const prerender = false;

/** O repositório do site, o mesmo em que o painel grava (keystatic.config.ts). */
const REPO = { owner: 'Jeanlukas1', name: 'DomdeAmarSite' };

export const POST: APIRoute = ({ request }) =>
  marcarTransmissao(request, new Date(), {
    segredo: process.env.TRANSMISSAO_SEGREDO,
    token: process.env.TRANSMISSAO_GITHUB_TOKEN,
    repo: REPO,
  });
