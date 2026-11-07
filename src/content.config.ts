import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Toda informação provisória leva `mock: true` — ver docs/conteudo-pendente.md.
// Os arquivos editados pelo painel (keystatic.config.ts) seguem o formato dele: listas ficam em
// { "itens": [...] } e campos vazios chegam como "" — os preprocess abaixo normalizam isso.

/** Lista editável pelo Keystatic: o arquivo guarda { itens: [...] }. */
const lista = (caminho: string) =>
  file(caminho, { parser: (texto) => (JSON.parse(texto) as { itens: unknown[] }).itens as never });

const igreja = defineCollection({
  loader: file('src/content/igreja.json'),
  schema: z.object({
    nome: z.string(),
    bio: z.string(),
    slogan: z.string(),
    fundacao: z.string(),
    endereco: z.object({
      rua: z.string(),
      bairro: z.string(),
      cidade: z.string(),
      uf: z.string(),
      cep: z.string(),
      referencia: z.string().optional(),
    }),
    contato: z.object({
      telefone: z.string(),
      whatsapp: z.string(),
      email: z.string(),
      mock: z.boolean().default(false),
    }),
    redes: z.object({
      facebook: z.url(),
      /** null enquanto a igreja não tiver o perfil: o ícone simplesmente não aparece */
      instagram: z.url().nullable(),
      youtube: z.url().nullable(),
    }),
  }),
});

const link = z.object({ rotulo: z.string(), href: z.string() });

/** Foto real: id = caminho em src/assets/fotos sem .jpg (ver src/lib/fotos.ts). */
const foto = z.object({
  id: z.string(),
  alt: z.string(),
  posicao: z.string().default('50% 50%'),
});

/** Foto opcional: o painel grava { id: "" } quando nenhuma foi escolhida. */
const fotoOpcional = z.preprocess(
  (v) => (v && typeof v === 'object' && 'id' in v && v.id ? v : undefined),
  foto.optional(),
);

const navegacao = defineCollection({
  loader: file('src/content/navegacao.json'),
  schema: z.object({
    ordem: z.number(),
    rotulo: z.string(),
    href: z.string(),
    destaque: z.boolean().default(false),
  }),
});

const hero = defineCollection({
  loader: file('src/content/hero.json'),
  schema: z.object({
    saudacao: z.string(),
    titulo: z.string(),
    texto: z.string(),
    ctaPrimario: link,
    ctaSecundario: link,
    proximo: link,
    rolar: z.string(),
  }),
});

const quemSomos = defineCollection({
  loader: file('src/content/quem-somos.json'),
  schema: z.object({
    mock: z.boolean().default(false),
    titulo: z.string(),
    destaque: z.string().optional(),
    carta: z.array(z.string()).min(1),
    missao: z.object({ titulo: z.string(), texto: z.string() }),
    visao: z.object({ titulo: z.string(), texto: z.string() }),
    fotos: z.array(foto).length(2),
    liderancaTitulo: z.string(),
  }),
});

const pastores = defineCollection({
  loader: lista('src/content/pastores.json'),
  schema: z.object({
    ordem: z.number(),
    nome: z.string(),
    funcao: z.string(),
    foto: fotoOpcional,
    mock: z.boolean().default(false),
  }),
});

const historia = defineCollection({
  loader: file('src/content/historia.json'),
  schema: z.object({
    mock: z.boolean().default(false),
    titulo: z.string(),
    destaque: z.string().optional(),
    intro: z.string(),
    /** só aparece no modo horizontal (desktop) */
    dica: z.string(),
    rotuloCapitulos: z.string(),
    capitulos: z
      .array(
        z.object({
          marco: z.string(),
          titulo: z.string(),
          texto: z.string(),
          fotos: z.array(foto).min(1).max(2),
        }),
      )
      .min(1),
    antesDepois: z.object({
      titulo: z.string(),
      rotulo: z.string(),
      antes: foto,
      depois: foto,
      legendaAntes: z.string(),
      legendaDepois: z.string(),
    }),
    cta: z.object({ titulo: z.string(), texto: z.string(), rotulo: z.string(), href: z.string() }),
  }),
});

const cultos = defineCollection({
  loader: lista('src/content/cultos.json'),
  schema: z.object({
    ordem: z.number(),
    dia: z.string(),
    /** 0 = domingo … 6 = sábado (o painel grava como texto) */
    diaSemana: z.coerce.number().int().min(0).max(6),
    /** HH:MM, horário de Brasília */
    hora: z.string().regex(/^\d{2}:\d{2}$/),
    nome: z.string(),
    descricao: z.string(),
    foto,
    mock: z.boolean().default(false),
  }),
});

const cultosSecao = defineCollection({
  loader: file('src/content/cultos-secao.json'),
  schema: z.object({
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    proximoRotulo: z.string(),
    quando: z.object({ agora: z.string(), hoje: z.string(), amanha: z.string() }),
    comoChegar: link,
    semana: z.object({
      mock: z.boolean().default(false),
      rotulo: z.string(),
      tema: z.string(),
      referencia: z.string().optional(),
      pregador: z.string(),
      culto: z.string(),
    }),
  }),
});

/** id do vídeo no YouTube (só o id, não a URL); null/"" enquanto não houver */
const youtubeId = z.preprocess(
  (v) => (v === '' ? null : v),
  z
    .string()
    .regex(/^[\w-]{11}$/)
    .nullable()
    .default(null),
);

const visite = defineCollection({
  loader: file('src/content/visite.json'),
  schema: z.object({
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    /** nomes das duas ruas da esquina de referência, para o mapinha desenhado */
    ruas: z.object({ principal: z.string(), transversal: z.string() }),
    rotulos: z.object({
      googleMaps: z.string(),
      waze: z.string(),
      whatsapp: z.string(),
      mostrarMapa: z.string(),
      avisoMapa: z.string(),
      tituloMapa: z.string(),
    }),
    whatsappMensagem: z.string(),
  }),
});

const assista = defineCollection({
  loader: file('src/content/assista.json'),
  schema: z.object({
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    video: z.object({
      mock: z.boolean().default(false),
      titulo: z.string(),
      descricao: z.string(),
      youtubeId,
      poster: foto,
    }),
    emBreve: z.string(),
    rotuloAssistir: z.string(),
    rotuloFacebook: z.string(),
    mensagensTitulo: z.string(),
  }),
});

const mensagens = defineCollection({
  loader: lista('src/content/mensagens.json'),
  schema: z.object({
    titulo: z.string(),
    referencia: z.string(),
    /** AAAA-MM-DD */
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    pregador: z.string(),
    youtubeId,
    mock: z.boolean().default(false),
  }),
});

const cresca = defineCollection({
  loader: file('src/content/cresca.json'),
  schema: z.object({
    mock: z.boolean().default(false),
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    primeiroDomingo: z.object({ titulo: z.string(), passos: z.array(z.string()).min(1).max(4) }),
    participar: link,
    rotuloAnterior: z.string(),
    rotuloProximo: z.string(),
    rotuloLista: z.string(),
  }),
});

const ministerios = defineCollection({
  loader: lista('src/content/ministerios.json'),
  schema: z.object({
    ordem: z.number(),
    nome: z.string(),
    frase: z.string(),
    foto,
    mock: z.boolean().default(false),
  }),
});

const agenda = defineCollection({
  loader: file('src/content/agenda.json'),
  schema: z.object({
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    rotuloLista: z.string(),
    rotuloAnterior: z.string(),
    rotuloProximo: z.string(),
    semEventos: z.string(),
  }),
});

const eventos = defineCollection({
  loader: lista('src/content/eventos.json'),
  schema: z.object({
    titulo: z.string(),
    /** AAAA-MM-DD */
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** HH:MM */
    hora: z.string().regex(/^\d{2}:\d{2}$/),
    local: z.string(),
    descricao: z.string(),
    foto: fotoOpcional,
    mock: z.boolean().default(false),
  }),
});

const galeria = defineCollection({
  loader: file('src/content/galeria.json'),
  schema: z.object({
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    rotuloAmpliar: z.string(),
    rotuloFechar: z.string(),
    rotuloAnterior: z.string(),
    rotuloProximo: z.string(),
    rotuloDe: z.string(),
    rotuloVerMais: z.string(),
    /** quantas fotos aparecem antes do "ver mais" */
    visiveis: z.number().int().min(1).default(8),
    /** cortarBase: esconde a marca d'água do celular no rodapé da foto */
    fotos: z.array(foto.extend({ cortarBase: z.boolean().default(false) })).min(1),
  }),
});

const contribua = defineCollection({
  loader: file('src/content/contribua.json'),
  schema: z.object({
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    versiculo: z.object({ texto: z.string(), referencia: z.string() }),
    foto,
    legenda: z.string(),
    pix: z.object({
      mock: z.boolean().default(false),
      /** null enquanto a igreja não tiver a chave: o cartão mostra o estado "em breve" */
      chave: z.string().nullable(),
      tipo: z.string(),
      titular: z.string(),
      titulo: z.string(),
      emBreve: z.string(),
      emBreveTexto: z.string(),
      copiar: z.string(),
      copiada: z.string(),
    }),
    /** dados da conta para TED/transferência; banco vazio = bloco não aparece */
    transferencia: z
      .object({
        titulo: z.string(),
        banco: z.string(),
        agencia: z.string(),
        conta: z.string(),
        rotuloBanco: z.string(),
        rotuloAgencia: z.string(),
        rotuloConta: z.string(),
      })
      .optional(),
    outrasFormas: z.object({ titulo: z.string(), itens: z.array(link) }),
  }),
});

const faleConosco = defineCollection({
  loader: file('src/content/fale-conosco.json'),
  schema: z.object({
    titulo: z.string(),
    destaque: z.string().optional(),
    texto: z.string(),
    /** cada assunto vira uma âncora (#oracao, #participe) e uma mensagem pronta no WhatsApp */
    assuntos: z.array(
      z.object({
        id: z.string(),
        titulo: z.string(),
        texto: z.string(),
        rotulo: z.string(),
        mensagem: z.string(),
      }),
    ),
    semWhatsapp: z.object({ aviso: z.string(), rotulo: z.string() }),
  }),
});

/** Rótulos de interface: marca do header, SEO e textos só para leitor de tela. */
const ui = defineCollection({
  loader: file('src/content/ui.json'),
  schema: z.object({
    marca: z.object({ linha1: z.string(), linha2: z.string() }),
    seo: z.object({ igrejaEm: z.string(), tituloIgrejaEm: z.string() }),
    a11y: z.object({
      pularConteudo: z.string(),
      navPrincipal: z.string(),
      navCelular: z.string(),
      navRodape: z.string(),
      redes: z.string(),
      menu: z.string(),
      abrirMenu: z.string(),
      fecharMenu: z.string(),
      textoBiblico: z.string(),
      pregador: z.string(),
      as: z.string(),
    }),
  }),
});

const rodape = defineCollection({
  loader: file('src/content/rodape.json'),
  schema: z.object({
    versiculo: z.object({ texto: z.string(), referencia: z.string() }),
    enderecoTitulo: z.string(),
    mapaRotulo: z.string(),
    cultosTitulo: z.string(),
    navTitulo: z.string(),
    redesTitulo: z.string(),
    direitos: z.string(),
  }),
});

export const collections = {
  igreja,
  navegacao,
  hero,
  quemSomos,
  pastores,
  historia,
  cultos,
  cultosSecao,
  visite,
  assista,
  mensagens,
  cresca,
  ministerios,
  agenda,
  eventos,
  galeria,
  contribua,
  faleConosco,
  ui,
  rodape,
};
