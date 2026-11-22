// A escolha do destaque da seção Assista (R18): o culto gravado mais recente que não seja
// provisório. Conteúdo de teste, nunca o conteúdo real do site.
import { describe, expect, it } from 'vitest';
import { escolherDestaque } from './cultosGravados';

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
