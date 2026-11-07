import { getEntry } from 'astro:content';

/** Dados institucionais da igreja (src/content/igreja.json). */
export async function getIgreja() {
  const entry = await getEntry('igreja', 'principal');
  if (!entry) throw new Error('src/content/igreja.json: entrada "principal" ausente');
  return entry.data;
}
