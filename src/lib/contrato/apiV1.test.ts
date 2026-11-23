// Ponto de teste P1 (spec 001): o conteúdo publicado em /api/v1.
// Monta os arquivos a partir de conteúdo de teste (nunca o conteúdo real do site) e confere
// cada um contra o esquema do contrato (docs/DATA-MODEL.md).
import { describe, expect, it, vi } from 'vitest';
import { esquemaApiV1, montarApiV1, type FontesApiV1 } from './apiV1';

function fontes(): FontesApiV1 {
  return {
    igreja: {
      nome: 'Igreja de Teste',
      endereco: {
        rua: 'Rua 1, Lote 2',
        bairro: 'Centro',
        cidade: 'Cidade',
        uf: 'RJ',
        cep: '28990-000',
        referencia: 'Em frente à praça',
      },
      contato: { whatsapp: '+55 (21) 90000-0000', mock: false },
      redes: {
        facebook: 'https://www.facebook.com/teste',
        instagram: 'https://www.instagram.com/teste',
        youtube: null,
      },
    },
    encontros: [
      {
        id: 'terca',
        nome: 'Culto de Oração',
        descricao: 'Noite de oração.',
        diaSemana: 2,
        hora: '19:00',
        ocorrencia: 'semanal',
        substituiODia: false,
        duracaoMin: 120,
        recebeTema: false,
        mock: false,
      },
      {
        id: 'ceia',
        nome: 'Culto de Santa Ceia',
        nomeCurto: 'Santa Ceia',
        descricao: 'Ceia no segundo domingo.',
        diaSemana: 0,
        hora: '10:00',
        ocorrencia: '2',
        substituiODia: true,
        duracaoMin: 240,
        recebeTema: true,
        mock: true,
      },
    ],
    eventos: [
      {
        id: 'festa',
        titulo: 'Festa',
        descricao: 'Uma festa.',
        local: 'Templo',
        data: '2026-12-24',
        hora: '20:00',
        mock: false,
      },
    ],
    tema: {
      data: '2026-11-15',
      tema: 'Tapando as brechas',
      referencia: 'Juízes 13.1-5',
      pregador: 'Pr. Fulano',
      mock: false,
    },
    contribuicao: {
      pix: { chave: '00000000000000', tipo: 'CNPJ', titular: 'Igreja de Teste', mock: false },
      transferencia: { banco: 'Banco X', agencia: '0001', conta: '123-4' },
    },
    cultosGravados: [
      {
        id: 'antigo',
        titulo: 'A nova aliança',
        referencia: 'Hebreus 8.10-12',
        data: '2026-10-25',
        pregador: 'Pr. Fulano',
        video: {
          plataforma: 'facebook',
          endereco: 'https://www.facebook.com/teste/videos/123456789',
        },
        mock: false,
      },
      {
        id: 'recente',
        titulo: 'Graça que alcança',
        referencia: '',
        data: '2026-11-01',
        pregador: '',
        video: { plataforma: 'youtube', endereco: 'https://www.youtube.com/watch?v=abcDEF12345' },
        mock: true,
      },
    ],
    alteracoes: [
      {
        id: 'alt-terca',
        alvo: 'terca',
        data: '2026-11-24',
        situacao: 'cancelado',
        novaHora: '',
        novoLocal: '',
        mensagem: 'Culto cancelado por causa da chuva.',
        avisar: true,
      },
      {
        id: 'alt-festa',
        alvo: 'festa',
        data: '2026-12-24',
        situacao: 'alterado',
        novaHora: '19:00',
        novoLocal: '',
        mensagem: 'A festa começa mais cedo.',
        avisar: false,
      },
    ],
    assuntos: [
      {
        id: 'oracao',
        titulo: 'Pedido de oração',
        texto: 'Texto que só o site mostra.',
        rotulo: 'Pedir oração',
        mensagem: 'Graça e Paz! Gostaria de pedir oração por:',
      },
    ],
  };
}

/** Monta e confere cada arquivo contra o esquema do contrato. */
function publicar(f: FontesApiV1) {
  const api = montarApiV1(f);
  for (const [colecao, esquema] of Object.entries(esquemaApiV1)) {
    esquema.parse(api[colecao as keyof typeof api]);
  }
  return api;
}

describe('igreja', () => {
  it('publica nome, endereço, WhatsApp em dígitos e só Facebook e YouTube', () => {
    expect(publicar(fontes()).igreja).toEqual({
      nome: 'Igreja de Teste',
      endereco: {
        rua: 'Rua 1, Lote 2',
        bairro: 'Centro',
        cidade: 'Cidade',
        uf: 'RJ',
        cep: '28990-000',
        referencia: 'Em frente à praça',
      },
      whatsapp: '5521900000000',
      redes: { facebook: 'https://www.facebook.com/teste', youtube: null },
    });
  });
});

describe('igreja: dados ausentes e provisórios', () => {
  it('publica o WhatsApp como null enquanto o contato é provisório', () => {
    const f = fontes();
    f.igreja.contato.mock = true;
    expect(publicar(f).igreja.whatsapp).toBeNull();
  });

  it('publica referência e WhatsApp vazios como null, nunca como ""', () => {
    const f = fontes();
    f.igreja.endereco.referencia = '';
    f.igreja.contato.whatsapp = '';
    const { igreja } = publicar(f);
    expect(igreja.endereco.referencia).toBeNull();
    expect(igreja.whatsapp).toBeNull();
  });
});

describe('encontros', () => {
  it('publica cada encontro na ordem do site, com mock virando provisorio', () => {
    expect(publicar(fontes()).encontros).toEqual([
      {
        id: 'terca',
        nome: 'Culto de Oração',
        nomeCurto: null,
        descricao: 'Noite de oração.',
        diaSemana: 2,
        hora: '19:00',
        ocorrencia: 'semanal',
        substituiODia: false,
        duracaoMin: 120,
        recebeTema: false,
        provisorio: false,
      },
      {
        id: 'ceia',
        nome: 'Culto de Santa Ceia',
        nomeCurto: 'Santa Ceia',
        descricao: 'Ceia no segundo domingo.',
        diaSemana: 0,
        hora: '10:00',
        ocorrencia: '2',
        substituiODia: true,
        duracaoMin: 240,
        recebeTema: true,
        provisorio: true,
      },
    ]);
  });
});

describe('eventos', () => {
  it('publica cada evento sem a foto, com mock virando provisorio', () => {
    const f = fontes();
    f.eventos.push({ ...f.eventos[0], id: 'mutirao', titulo: 'Mutirão', mock: true });
    expect(publicar(f).eventos).toEqual([
      {
        id: 'festa',
        titulo: 'Festa',
        descricao: 'Uma festa.',
        local: 'Templo',
        data: '2026-12-24',
        hora: '20:00',
        provisorio: false,
      },
      {
        id: 'mutirao',
        titulo: 'Mutirão',
        descricao: 'Uma festa.',
        local: 'Templo',
        data: '2026-12-24',
        hora: '20:00',
        provisorio: true,
      },
    ]);
  });
});

describe('tema-da-semana', () => {
  it('publica o tema cadastrado hoje, com a referência como textoBiblico', () => {
    expect(publicar(fontes())['tema-da-semana']).toEqual({
      data: '2026-11-15',
      tema: 'Tapando as brechas',
      textoBiblico: 'Juízes 13.1-5',
      pregador: 'Pr. Fulano',
      provisorio: false,
    });
  });

  it('publica texto bíblico vazio como null e mantém o tema provisório', () => {
    const f = fontes();
    f.tema.referencia = '';
    f.tema.mock = true;
    const tema = publicar(f)['tema-da-semana'];
    expect(tema.textoBiblico).toBeNull();
    expect(tema.provisorio).toBe(true);
  });
});

describe('contribuicao', () => {
  it('publica o PIX e a transferência sem os rótulos da página', () => {
    expect(publicar(fontes()).contribuicao).toEqual({
      pix: { chave: '00000000000000', tipo: 'CNPJ', titular: 'Igreja de Teste' },
      transferencia: { banco: 'Banco X', agencia: '0001', conta: '123-4' },
    });
  });

  it('publica o PIX como null sem chave ou com a chave provisória', () => {
    const semChave = fontes();
    semChave.contribuicao.pix.chave = null;
    expect(publicar(semChave).contribuicao.pix).toBeNull();

    const provisoria = fontes();
    provisoria.contribuicao.pix.mock = true;
    expect(publicar(provisoria).contribuicao.pix).toBeNull();
  });

  it('publica a transferência como null quando não há banco cadastrado', () => {
    const semBloco = fontes();
    delete semBloco.contribuicao.transferencia;
    expect(publicar(semBloco).contribuicao.transferencia).toBeNull();

    const bancoVazio = fontes();
    bancoVazio.contribuicao.transferencia = { banco: '', agencia: '', conta: '' };
    expect(publicar(bancoVazio).contribuicao.transferencia).toBeNull();
  });
});

describe('assuntos-de-contato', () => {
  it('publica id, título, rótulo e mensagem de cada assunto', () => {
    expect(publicar(fontes())['assuntos-de-contato']).toEqual([
      {
        id: 'oracao',
        titulo: 'Pedido de oração',
        rotulo: 'Pedir oração',
        mensagem: 'Graça e Paz! Gostaria de pedir oração por:',
      },
    ]);
  });
});

describe('cultos-gravados', () => {
  it('publica do mais recente para o mais antigo, com vazios como null e mock virando provisorio', () => {
    expect(publicar(fontes())['cultos-gravados']).toEqual([
      {
        id: 'recente',
        titulo: 'Graça que alcança',
        textoBiblico: null,
        pregador: null,
        data: '2026-11-01',
        video: { plataforma: 'youtube', endereco: 'https://www.youtube.com/watch?v=abcDEF12345' },
        provisorio: true,
      },
      {
        id: 'antigo',
        titulo: 'A nova aliança',
        textoBiblico: 'Hebreus 8.10-12',
        pregador: 'Pr. Fulano',
        data: '2026-10-25',
        video: {
          plataforma: 'facebook',
          endereco: 'https://www.facebook.com/teste/videos/123456789',
        },
        provisorio: false,
      },
    ]);
  });
});

describe('cultos-gravados: vídeo inválido', () => {
  const casos = [
    {
      caso: 'plataforma desconhecida',
      video: { plataforma: 'vimeo', endereco: 'https://vimeo.com/123456' },
      motivo: /plataforma/i,
    },
    {
      caso: 'endereço de outra plataforma',
      video: { plataforma: 'youtube', endereco: 'https://www.facebook.com/teste/videos/1' },
      motivo: /youtube/i,
    },
    {
      caso: 'endereço sem plataforma',
      video: { plataforma: '', endereco: 'https://www.youtube.com/watch?v=abcDEF12345' },
      motivo: /plataforma/i,
    },
    {
      caso: 'sem vídeo nenhum',
      video: { plataforma: '', endereco: '' },
      motivo: /plataforma/i,
    },
    {
      caso: 'endereço do YouTube que não é de um vídeo',
      video: { plataforma: 'youtube', endereco: 'https://www.youtube.com/@igreja' },
      motivo: /youtube/i,
    },
    {
      caso: 'endereço que não é um endereço',
      video: { plataforma: 'facebook', endereco: 'facebook.com/teste' },
      motivo: /facebook/i,
    },
  ];

  for (const { caso, video, motivo } of casos) {
    it(`retira o culto gravado com ${caso}, alerta qual e por quê, e publica os outros`, () => {
      const f = fontes();
      f.cultosGravados[0].video = video;
      const alertar = vi.fn();
      const api = montarApiV1(f, { alertar });
      expect(api['cultos-gravados'].map((c) => c.id)).toEqual(['recente']);
      expect(alertar).toHaveBeenCalledTimes(1);
      const [mensagem] = alertar.mock.calls[0] as [string];
      expect(mensagem).toContain('"antigo"');
      expect(mensagem).toMatch(motivo);
    });
  }

  it('não alerta quando todos os vídeos são válidos', () => {
    const alertar = vi.fn();
    montarApiV1(fontes(), { alertar });
    expect(alertar).not.toHaveBeenCalled();
  });
});

describe('alteracoes', () => {
  it('publica cada alteração com as chaves do contrato e os vazios como null', () => {
    expect(publicar(fontes()).alteracoes).toEqual([
      {
        id: 'alt-terca',
        alvo: 'terca',
        data: '2026-11-24',
        situacao: 'cancelado',
        novaHora: null,
        novoLocal: null,
        mensagem: 'Culto cancelado por causa da chuva.',
        avisar: true,
      },
      {
        id: 'alt-festa',
        alvo: 'festa',
        data: '2026-12-24',
        situacao: 'alterado',
        novaHora: '19:00',
        novoLocal: null,
        mensagem: 'A festa começa mais cedo.',
        avisar: false,
      },
    ]);
  });

  it('publica uma lista vazia quando não há alterações', () => {
    const f = fontes();
    f.alteracoes = [];
    expect(publicar(f).alteracoes).toEqual([]);
  });

  it('não alerta quando todas as alterações cumprem as regras', () => {
    const alertar = vi.fn();
    montarApiV1(fontes(), { alertar });
    expect(alertar).not.toHaveBeenCalled();
  });
});

describe('alteracoes: retiradas da publicação com alerta', () => {
  type Alteracao = FontesApiV1['alteracoes'][number];
  const base: Alteracao = {
    id: 'alt-nova',
    alvo: 'terca',
    data: '2026-11-17',
    situacao: 'cancelado',
    novaHora: '',
    novoLocal: '',
    mensagem: 'Sem culto hoje.',
    avisar: false,
  };
  /** Um encontro semanal de domingo: no segundo domingo, a Santa Ceia o substitui. */
  const domingo: FontesApiV1['encontros'][number] = {
    id: 'domingo',
    nome: 'Culto de Domingo',
    descricao: 'Culto da noite.',
    diaSemana: 0,
    hora: '18:00',
    ocorrencia: 'semanal',
    substituiODia: false,
    duracaoMin: 120,
    recebeTema: true,
    mock: false,
  };

  /** Acrescenta a alteração às de teste e devolve os ids publicados e os alertas. */
  function publicarCom(alteracao: Partial<Alteracao>) {
    const f = fontes();
    f.encontros.push(domingo);
    f.alteracoes.push({ ...base, ...alteracao });
    const alertar = vi.fn();
    const api = montarApiV1(f, { alertar });
    esquemaApiV1.alteracoes.parse(api.alteracoes);
    return {
      ids: api.alteracoes.map((a) => a.id),
      alertas: alertar.mock.calls.map(([m]) => m as string),
    };
  }

  const casos = [
    { caso: 'o alvo não existe', alteracao: { alvo: 'quarta' }, motivo: /"quarta".*não existe/ },
    {
      caso: 'a data não cai no dia da semana do encontro',
      alteracao: { data: '2026-11-18' },
      motivo: /não acontece em 2026-11-18/,
    },
    {
      caso: 'a data não é o segundo domingo, para a Santa Ceia',
      alteracao: { alvo: 'ceia', data: '2026-11-15' },
      motivo: /não acontece em 2026-11-15/,
    },
    {
      caso: 'o dia é substituído pela Santa Ceia',
      alteracao: { alvo: 'domingo', data: '2026-11-08' },
      motivo: /não acontece em 2026-11-08/,
    },
    {
      caso: 'a data não é a do evento',
      alteracao: { alvo: 'festa', data: '2026-12-25' },
      motivo: /não acontece em 2026-12-25/,
    },
    {
      caso: 'já há outra alteração para o mesmo alvo e a mesma data',
      alteracao: { data: '2026-11-24' },
      motivo: /"alt-terca"/,
    },
    {
      caso: '"alterado" vem sem nova hora e sem novo local',
      alteracao: { situacao: 'alterado' as const },
      motivo: /nova hora.*novo local/,
    },
    { caso: 'a mensagem está vazia', alteracao: { mensagem: '' }, motivo: /mensagem/ },
    {
      caso: 'a nova hora não está no formato HH:MM',
      alteracao: { situacao: 'alterado' as const, novaHora: '9h' },
      motivo: /"9h".*HH:MM/,
    },
  ];

  for (const { caso, alteracao, motivo } of casos) {
    it(`retira a alteração quando ${caso}, alerta qual e por quê, e publica as outras`, () => {
      const { ids, alertas } = publicarCom(alteracao);
      expect(ids).toEqual(['alt-terca', 'alt-festa']);
      expect(alertas).toHaveLength(1);
      expect(alertas[0]).toContain('"alt-nova"');
      expect(alertas[0]).toMatch(motivo);
    });
  }

  const validas = [
    { caso: 'a Santa Ceia no segundo domingo', alteracao: { alvo: 'ceia', data: '2026-11-08' } },
    { caso: 'o domingo fora da Santa Ceia', alteracao: { alvo: 'domingo', data: '2026-11-15' } },
    {
      caso: 'um "alterado" só com novo local',
      alteracao: { situacao: 'alterado' as const, novoLocal: 'Na praça' },
    },
  ];

  for (const { caso, alteracao } of validas) {
    it(`publica ${caso}`, () => {
      const { ids, alertas } = publicarCom(alteracao);
      expect(ids).toEqual(['alt-terca', 'alt-festa', 'alt-nova']);
      expect(alertas).toEqual([]);
    });
  }

  it('o restante do conteúdo é publicado normalmente', () => {
    const f = fontes();
    f.alteracoes[0].alvo = 'quarta';
    const api = montarApiV1(f, { alertar: vi.fn() });
    expect(api.encontros).toHaveLength(2);
    expect(api.eventos).toHaveLength(1);
    expect(api.alteracoes.map((a) => a.id)).toEqual(['alt-festa']);
  });
});

describe('identificadores repetidos', () => {
  it('falha dizendo qual identificador se repete entre encontros e eventos, e onde', () => {
    const f = fontes();
    f.eventos[0].id = 'ceia';
    expect(() => montarApiV1(f)).toThrow(
      /"ceia".*encontros \(src\/content\/cultos\.json\).*eventos \(src\/content\/eventos\.json\)/,
    );
  });

  it('falha também quando o identificador se repete dentro dos eventos', () => {
    const f = fontes();
    f.eventos.push({ ...f.eventos[0] });
    expect(() => montarApiV1(f)).toThrow(/"festa".*eventos \(src\/content\/eventos\.json\)/);
  });
});

describe('fora do contrato', () => {
  it('falha em vez de publicar um texto obrigatório vazio', () => {
    const f = fontes();
    f.eventos[0].descricao = '';
    expect(() => montarApiV1(f)).toThrow();
  });
});
