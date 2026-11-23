// O conteúdo publicado para o app em /api/v1, montado a partir das coleções do site pela camada
// de tradução de src/lib/contrato. As seções do site leem daqui o que precisa bater com o app
// (as alterações já validadas, R10): assim o site e o app aplicam exatamente as mesmas.
import { montarApiV1, type ApiV1 } from '@/lib/contrato/apiV1';
import {
  getAlteracoes,
  getCultosGravados,
  getEventos,
  getIgreja,
  getOrdenados,
  getPrincipal,
} from '@/lib/igreja';

async function montar() {
  const [
    igreja,
    encontros,
    eventos,
    alteracoes,
    cultosGravados,
    cultosSecao,
    contribua,
    faleConosco,
  ] = await Promise.all([
    getIgreja(),
    getOrdenados('cultos'),
    getEventos(),
    getAlteracoes(),
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
    alteracoes,
    cultosGravados,
    contribuicao: contribua,
    assuntos: faleConosco.assuntos,
  });
}

let api: Promise<ApiV1> | undefined;

/**
 * Monta os arquivos uma vez por build: assim cada alerta aparece uma vez só. No dev, monta a cada
 * chamada, para refletir o que o painel acabou de gravar.
 */
export function getApiV1() {
  if (!import.meta.env.PROD || !api) api = montar();
  return api;
}
