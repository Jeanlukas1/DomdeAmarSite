// Vídeo de um culto gravado ou da transmissão (docs/DATA-MODEL.md): plataforma e endereço andam
// sempre juntos, e o endereço precisa ser daquela plataforma. Usado pelo contrato /api/v1 e pelo
// site, para que os dois aceitem e recusem exatamente os mesmos vídeos.

export type Plataforma = 'facebook' | 'youtube';
export interface Video {
  plataforma: Plataforma;
  endereco: string;
}

/** Domínios de cada plataforma (o próprio domínio e os subdomínios contam). */
const DOMINIOS: Record<Plataforma, string[]> = {
  facebook: ['facebook.com', 'fb.watch'],
  youtube: ['youtube.com', 'youtu.be'],
};

function lerEndereco(endereco: string): URL | null {
  try {
    const url = new URL(endereco);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

function eDaPlataforma(url: URL, plataforma: Plataforma) {
  const host = url.hostname.toLowerCase();
  return DOMINIOS[plataforma].some((d) => host === d || host.endsWith(`.${d}`));
}

/**
 * O id de 11 caracteres de um vídeo do YouTube, nos formatos de endereço comuns
 * (watch?v=, youtu.be/, /live/, /shorts/, /embed/). null se o endereço não tem um.
 */
export function idDoYoutube(endereco: string): string | null {
  const url = lerEndereco(endereco);
  if (!url || !eDaPlataforma(url, 'youtube')) return null;
  const id = url.hostname.toLowerCase().endsWith('youtu.be')
    ? url.pathname.slice(1)
    : (url.searchParams.get('v') ??
      url.pathname.match(/^\/(?:live|shorts|embed)\/([^/]+)/)?.[1] ??
      '');
  return /^[\w-]{11}$/.test(id) ? id : null;
}

/**
 * Confere um vídeo como o painel o grava ("" = vazio). Devolve o vídeo válido, ou o motivo
 * da recusa, em pt-BR, para o alerta do build.
 */
export function conferirVideo(v: {
  plataforma: string;
  endereco: string;
}): { video: Video } | { motivo: string } {
  const { plataforma, endereco } = v;
  if (plataforma !== 'facebook' && plataforma !== 'youtube') {
    return {
      motivo: plataforma
        ? `a plataforma "${plataforma}" não é conhecida (use facebook ou youtube)`
        : 'o vídeo não tem plataforma (facebook ou youtube)',
    };
  }
  const url = lerEndereco(endereco);
  if (!url || !eDaPlataforma(url, plataforma)) {
    return { motivo: `o endereço "${endereco}" não é de um vídeo do ${plataforma}` };
  }
  if (plataforma === 'youtube' && !idDoYoutube(endereco)) {
    return { motivo: `o endereço "${endereco}" não aponta para um vídeo do youtube` };
  }
  return { video: { plataforma, endereco } };
}
