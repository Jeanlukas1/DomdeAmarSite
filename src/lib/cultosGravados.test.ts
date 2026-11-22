// A escolha do destaque da seção Assista (R18): o culto gravado mais recente que não seja
// provisório. Conteúdo de teste, nunca o conteúdo real do site.
import { describe, expect, it } from 'vitest';
import { acaoDoVideo, escolherDestaque, listaSemDestaque } from './cultosGravados';

const facebook = { plataforma: 'facebook', endereco: 'https://www.facebook.com/teste/videos/1' };
const youtube = { plataforma: 'youtube', endereco: 'https://youtu.be/abcDEF12345' };

const culto = (id: string, data: string, mock: boolean, video = facebook) => ({
  id,
  data,
  mock,
  video,
});

describe('escolherDestaque', () => {
  it('escolhe o mais recente que não é provisório, em qualquer ordem de cadastro', () => {
    const itens = [
      culto('antigo', '2026-10-18', false),
      culto('provisorio-recente', '2026-11-08', true),
      culto('recente', '2026-11-01', false, youtube),
    ];
    expect(escolherDestaque(itens)?.id).toBe('recente');
  });

  it('pula o mais recente quando o vídeo dele é inválido', () => {
    const itens = [
      culto('sem-video', '2026-11-08', false, { plataforma: '', endereco: '' }),
      culto('valido', '2026-11-01', false),
    ];
    expect(escolherDestaque(itens)?.id).toBe('valido');
  });

  it('devolve o vídeo conferido do escolhido', () => {
    expect(escolherDestaque([culto('a', '2026-11-01', false, youtube)])?.video).toEqual(youtube);
  });

  it('não escolhe nenhum quando todos são provisórios ou não há culto gravado', () => {
    expect(escolherDestaque([culto('a', '2026-11-01', true)])).toBeNull();
    expect(escolherDestaque([])).toBeNull();
  });
});

describe('listaSemDestaque', () => {
  const itens = [
    culto('d', '2026-10-04', true),
    culto('a', '2026-11-01', false),
    culto('c', '2026-10-11', true),
    culto('b', '2026-10-25', true),
    culto('e', '2026-09-27', true),
  ];

  it('mostra os 3 mais recentes sem repetir o destaque, provisórios incluídos', () => {
    const destaque = escolherDestaque(itens);
    expect(listaSemDestaque(itens, destaque).map((c) => c.id)).toEqual(['b', 'c', 'd']);
  });

  it('sem destaque, mostra os 3 mais recentes', () => {
    expect(listaSemDestaque(itens, null).map((c) => c.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('acaoDoVideo', () => {
  const pagina = 'https://www.facebook.com/igreja';

  it('YouTube toca no site: devolve o id do vídeo e o endereço como alternativa sem JavaScript', () => {
    expect(acaoDoVideo(youtube, pagina)).toEqual({
      href: 'https://youtu.be/abcDEF12345',
      youtube: 'abcDEF12345',
    });
  });

  it('Facebook abre o próprio vídeo fora do site', () => {
    expect(acaoDoVideo(facebook, pagina)).toEqual({ href: facebook.endereco, youtube: null });
  });

  it('sem vídeo válido, abre a página da igreja fora do site', () => {
    expect(acaoDoVideo({ plataforma: '', endereco: '' }, pagina)).toEqual({
      href: pagina,
      youtube: null,
    });
  });
});
