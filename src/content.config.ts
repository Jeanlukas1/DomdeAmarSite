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

export const collections = { igreja, navegacao, hero };
