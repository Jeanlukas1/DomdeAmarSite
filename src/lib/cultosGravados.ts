// Cultos gravados no site (R18, R19): o destaque da seção Assista e o vídeo de cada item.
import { conferirVideo, type Video } from '@/lib/video';

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
