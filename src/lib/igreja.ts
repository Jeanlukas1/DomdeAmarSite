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
