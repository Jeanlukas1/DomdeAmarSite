// Contrato do app: /api/v1/<coleção>.json (docs/DATA-MODEL.md, ADR 0001).
// Gerados no build a partir das coleções do site, pela camada de tradução de src/lib/contrato.
// Um arquivo fora do contrato ou um identificador repetido faz o build falhar.
import type { APIRoute, GetStaticPaths } from 'astro';
import { esquemaApiV1, montarApiV1, type ApiV1 } from '@/lib/contrato/apiV1';
import { getEventos, getIgreja, getOrdenados, getPrincipal } from '@/lib/igreja';

type Colecao = keyof ApiV1;

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(esquemaApiV1).map((colecao) => ({ params: { colecao } }));

export const GET: APIRoute = async ({ params }) => {
  const [igreja, encontros, eventos, cultosSecao, contribua, faleConosco] = await Promise.all([
    getIgreja(),
    getOrdenados('cultos'),
    getEventos(),
    getPrincipal('cultosSecao'),
    getPrincipal('contribua'),
    getPrincipal('faleConosco'),
  ]);
  const api = montarApiV1({
    igreja,
    encontros,
    eventos,
    tema: cultosSecao.semana,
    contribuicao: contribua,
    assuntos: faleConosco.assuntos,
  });
  return new Response(JSON.stringify(api[params.colecao as Colecao]), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
