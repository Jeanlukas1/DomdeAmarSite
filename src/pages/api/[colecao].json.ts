// Endpoints JSON estáticos para o futuro app (lives): /api/cultos.json, /api/eventos.json…
// Gerados no build a partir das mesmas coleções do site — uma fonte só.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getEventos, getIgreja, getMensagens, getOrdenados } from '@/lib/igreja';

const fontes = {
  igreja: () => getIgreja(),
  cultos: () => getOrdenados('cultos'),
  eventos: () => getEventos(),
  mensagens: () => getMensagens(Infinity),
  ministerios: () => getOrdenados('ministerios'),
  pastores: () => getOrdenados('pastores'),
} as const;

type Colecao = keyof typeof fontes;

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(fontes).map((colecao) => ({ params: { colecao } }));

export const GET: APIRoute = async ({ params }) => {
  const dados = await fontes[params.colecao as Colecao]();
  return new Response(JSON.stringify(dados), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
