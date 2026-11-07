import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Toda informação provisória leva `mock: true` — ver docs/conteudo-pendente.md.

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
      instagram: z.url(),
      youtube: z.url(),
      mockInstagramYoutube: z.boolean().default(false),
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
  loader: file('src/content/pastores.json'),
  schema: z.object({
    ordem: z.number(),
    nome: z.string(),
    funcao: z.string(),
    foto: foto.optional(),
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
  loader: file('src/content/cultos.json'),
  schema: z.object({
    ordem: z.number(),
    dia: z.string(),
    /** 0 = domingo … 6 = sábado */
    diaSemana: z.number().int().min(0).max(6),
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

export const collections = {
  igreja,
  navegacao,
  hero,
  quemSomos,
  pastores,
  historia,
  cultos,
  cultosSecao,
};
