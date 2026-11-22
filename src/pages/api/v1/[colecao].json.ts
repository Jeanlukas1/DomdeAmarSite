// Contrato do app: /api/v1/<coleção>.json (docs/DATA-MODEL.md, ADR 0001).
// Gerados no build a partir das coleções do site, pela camada de tradução de src/lib/contrato.
// Um arquivo fora do contrato ou um identificador repetido faz o build falhar.
import type { APIRoute, GetStaticPaths } from 'astro';
import { esquemaApiV1, montarApiV1, type ApiV1 } from '@/lib/contrato/apiV1';
import { getCultosGravados, getEventos, getIgreja, getOrdenados, getPrincipal } from '@/lib/igreja';

type Colecao = keyof ApiV1;

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(esquemaApiV1).map((colecao) => ({ params: { colecao } }));

/**
 * Monta os arquivos uma vez por build: assim cada alerta aparece uma vez só. No dev, monta a cada
 * pedido, para refletir o que o painel acabou de gravar.
 */
async function montar() {
  const [igreja, encontros, eventos, cultosGravados, cultosSecao, contribua, faleConosco] =
    await Promise.all([
      getIgreja(),
      getOrdenados('cultos'),
      getEventos(),
      getCultosGravados(),
      getPrincipal('cultosSecao'),
      getPrincipal('contribua'),
      getPrincipal('faleConosco'),
    ]);
  return montarApiV1({
    igreja,
    encontros,
    eventos,
    tema: cultosSecao.semana,
    cultosGravados,
    contribuicao: contribua,
    assuntos: faleConosco.assuntos,
  });
}

let api: Promise<ApiV1> | undefined;

export const GET: APIRoute = async ({ params }) => {
  if (!import.meta.env.PROD || !api) api = montar();
  return new Response(JSON.stringify((await api)[params.colecao as Colecao]), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
