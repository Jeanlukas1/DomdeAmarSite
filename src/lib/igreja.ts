import { getCollection, getEntry } from 'astro:content';

/** Dados institucionais da igreja (src/content/igreja.json). */
export async function getIgreja() {
  const entry = await getEntry('igreja', 'principal');
  if (!entry) throw new Error('src/content/igreja.json: entrada "principal" ausente');
  return entry.data;
}

/** Itens do menu principal, na ordem definida em src/content/navegacao.json. */
export async function getNavegacao() {
  const itens = await getCollection('navegacao');
  return itens.map((i) => ({ id: i.id, ...i.data })).sort((a, b) => a.ordem - b.ordem);
}

/** Textos do hero (src/content/hero.json). */
export async function getHero() {
  const entry = await getEntry('hero', 'principal');
  if (!entry) throw new Error('src/content/hero.json: entrada "principal" ausente');
  return entry.data;
}

/** Busca a entrada "principal" de uma coleção de página única (quem-somos, historia…). */
export async function getPrincipal<C extends 'quemSomos'>(colecao: C) {
  const entry = await getEntry(colecao, 'principal');
  if (!entry) throw new Error(`Coleção "${colecao}": entrada "principal" ausente`);
  return entry.data;
}

/** Itens de uma coleção em lista, ordenados pelo campo `ordem`. */
export async function getOrdenados<C extends 'pastores'>(colecao: C) {
  const itens = await getCollection(colecao);
  return itens.map((i) => ({ id: i.id, ...i.data })).sort((a, b) => a.ordem - b.ordem);
}
