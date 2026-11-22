// Endpoints JSON estáticos para o futuro app (lives): /api/cultos.json, /api/eventos.json…
// Gerados no build a partir das mesmas coleções do site — uma fonte só.
import type { APIRoute, GetStaticPaths } from 'astro';
import { videoDe } from '@/lib/cultosGravados';
import { getCultosGravados, getEventos, getIgreja, getOrdenados } from '@/lib/igreja';
import { idDoYoutube } from '@/lib/video';

const fontes = {
  igreja: () => getIgreja(),
  cultos: () => getOrdenados('cultos'),
  eventos: () => getEventos(),
  // endereço antigo (R9): some só depois que o app ler /api/v1. Vem dos cultos gravados, no
  // formato de antes (youtubeId só com vídeo do YouTube; null nos demais).
  mensagens: async () =>
    (await getCultosGravados()).map(({ video, ...c }) => {
      const valido = videoDe({ video });
      const youtubeId = valido?.plataforma === 'youtube' ? idDoYoutube(valido.endereco) : null;
      return {
        id: c.id,
        titulo: c.titulo,
        referencia: c.referencia,
        data: c.data,
        pregador: c.pregador,
        youtubeId,
        mock: c.mock,
      };
    }),
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
