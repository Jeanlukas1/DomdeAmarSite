import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

/** Coleções de página única (entrada 'principal'). */
type Unica =
  | 'quemSomos'
  | 'historia'
  | 'cultosSecao'
  | 'visite'
  | 'assista'
  | 'cresca'
  | 'agenda'
  | 'galeria'
  | 'contribua'
  | 'faleConosco'
  | 'rodape';
/** Coleções em lista com campo 'ordem'. */
type Ordenada = 'pastores' | 'cultos' | 'ministerios';

/** Dados institucionais da igreja (src/content/igreja.json). */
export async function getIgreja() {
  const entry = await getEntry('igreja', 'principal');
  if (!entry) throw new Error('src/content/igreja.json: entrada "principal" ausente');
  return entry.data;
}

/** Endereço por extenso e links de rota (Google Maps, Waze, mapa embutido). */
export async function getEndereco() {
  const { endereco } = await getIgreja();
  const { rua, bairro, cidade, uf, cep } = endereco;
  const completo = `${rua}, ${bairro}, ${cidade} - ${uf}, ${cep}`;
  const q = encodeURIComponent(completo);
  return {
    ...endereco,
    completo,
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${q}`,
    waze: `https://waze.com/ul?q=${q}&navigate=yes`,
    /** embed sem chave de API — só é carregado no clique (click-to-load) */
    mapaEmbed: `https://www.google.com/maps?q=${q}&output=embed`,
  };
}

/**
 * Link do WhatsApp com a mensagem já escrita. Retorna null enquanto o número for mock:
 * quem chama decide a alternativa (ex.: Facebook), nunca um número falso.
 */
export async function getWhatsapp(mensagem: string) {
  const { contato } = await getIgreja();
  if (contato.mock) return null;
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/** Redes sociais com link real, na ordem de exibição (as que estão null ficam de fora). */
export async function getRedes() {
  const { redes } = await getIgreja();
  const todas = [
    { nome: 'Facebook', href: redes.facebook, icon: 'facebook' },
    { nome: 'Instagram', href: redes.instagram, icon: 'instagram' },
    { nome: 'YouTube', href: redes.youtube, icon: 'youtube' },
  ] as const;
  return todas.filter((r): r is (typeof todas)[number] & { href: string } => Boolean(r.href));
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
export async function getPrincipal<C extends Unica>(
  colecao: C,
): Promise<CollectionEntry<C>['data']> {
  const entry = await getEntry(colecao, 'principal');
  if (!entry) throw new Error(`Coleção "${colecao}": entrada "principal" ausente`);
  return entry.data as CollectionEntry<C>['data'];
}

/** Itens de uma coleção em lista, ordenados pelo campo `ordem`. */
export async function getOrdenados<C extends Ordenada>(
  colecao: C,
): Promise<Array<CollectionEntry<C>['data'] & { id: string }>> {
  const itens = (await getCollection(colecao)) as CollectionEntry<C>[];
  return itens
    .map((i) => ({ id: i.id, ...(i.data as CollectionEntry<C>['data']) }))
    .sort((a, b) => a.ordem - b.ordem);
}

/** Mensagens da mais recente para a mais antiga. */
export async function getMensagens(limite = 3) {
  const itens = await getCollection('mensagens');
  return itens
    .map((i) => ({ id: i.id, ...i.data }))
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, limite);
}

/** Eventos em ordem cronológica (o navegador esconde os que já passaram). */
export async function getEventos() {
  const itens = await getCollection('eventos');
  return itens
    .map((i) => ({ id: i.id, ...i.data }))
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}
