// Cultos gravados no site (R18, R19): o destaque da seção Assista e o vídeo de cada item.
import { conferirVideo, idDoYoutube, type Video } from '@/lib/video';

interface CultoGravado {
  data: string;
  mock: boolean;
  video: { plataforma: string; endereco: string };
}

/** O vídeo de um culto gravado, ou null se ele não tem um vídeo válido. */
export function videoDe(culto: Pick<CultoGravado, 'video'>): Video | null {
  const conferido = conferirVideo(culto.video);
  return 'video' in conferido ? conferido.video : null;
}

/**
 * O destaque da seção Assista: o culto gravado mais recente que não seja provisório e tenha
 * vídeo válido, com o vídeo já conferido. null quando não há nenhum (o estado "em breve").
 */
export function escolherDestaque<C extends CultoGravado>(
  itens: readonly C[],
): (C & { video: Video }) | null {
  const candidatos = itens
    .filter((c) => !c.mock)
    .flatMap((c) => {
      const video = videoDe(c);
      return video ? [{ ...c, video }] : [];
    })
    .sort((a, b) => b.data.localeCompare(a.data));
  return candidatos[0] ?? null;
}

/**
 * A lista abaixo do destaque: os `limite` cultos gravados mais recentes, sem repetir o destaque.
 * Os provisórios entram (o site os mostra; o app, não).
 */
export function listaSemDestaque<C extends CultoGravado & { id: string }>(
  itens: readonly C[],
  destaque: { id: string } | null,
  limite = 3,
): C[] {
  return itens
    .filter((c) => c.id !== destaque?.id)
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, limite);
}

/**
 * O que um clique num culto gravado faz (R18, R19). YouTube: toca no site (`youtube` é o id), e
 * `href` é a alternativa sem JavaScript. Facebook: abre o vídeo fora do site. Sem vídeo válido:
 * abre a página da igreja (`paginaDaIgreja`) fora do site.
 */
export function acaoDoVideo(
  video: { plataforma: string; endereco: string } | null,
  paginaDaIgreja: string,
): { href: string; youtube: string | null } {
  const valido = video ? videoDe({ video }) : null;
  if (!valido) return { href: paginaDaIgreja, youtube: null };
  const youtube = valido.plataforma === 'youtube' ? idDoYoutube(valido.endereco) : null;
  return { href: valido.endereco, youtube };
}
