import type { ImageMetadata } from 'astro';

// Todas as fotos reais da igreja, indexadas por "pasta/arquivo" (sem .jpg).
// Ex.: foto('comunhao/comunhao-16'). O conteúdo (src/content) referencia as fotos por esse id.
const arquivos = import.meta.glob<{ default: ImageMetadata }>('/src/assets/fotos/**/*.jpg', {
  eager: true,
});

export function foto(id: string): ImageMetadata {
  const m = arquivos[`/src/assets/fotos/${id}.jpg`];
  if (!m) throw new Error(`Foto não encontrada em src/assets/fotos: "${id}"`);
  return m.default;
}
