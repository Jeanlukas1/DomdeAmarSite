// Contrato do app: /api/v1/<coleção>.json (docs/DATA-MODEL.md, ADR 0001).
// Gerados no build a partir das coleções do site, pela camada de tradução de src/lib/contrato
// (montada em src/lib/publicacao.ts, que o site também lê). Um arquivo fora do contrato ou um
// identificador repetido faz o build falhar.
import type { APIRoute, GetStaticPaths } from 'astro';
import { esquemaApiV1, type ApiV1 } from '@/lib/contrato/apiV1';
import { getApiV1 } from '@/lib/publicacao';

type Colecao = keyof ApiV1;

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(esquemaApiV1).map((colecao) => ({ params: { colecao } }));

export const GET: APIRoute = async ({ params }) =>
  new Response(JSON.stringify((await getApiV1())[params.colecao as Colecao]), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
