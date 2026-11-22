// Contrato /api/v1 (docs/DATA-MODEL.md, ADR 0001): o formato próprio que o app lê.
// Uma camada de tradução lê as coleções do site e monta cada arquivo, validado pelo esquema
// abaixo. Um arquivo fora do contrato faz o build falhar, em vez de ser publicado.
import { z } from 'astro/zod';

// ── Esquema do contrato ────────────────────────────────────────────────────────

/** Texto obrigatório: nunca vazio. */
const texto = z.string().min(1);
/** Texto opcional: ausente é null, nunca "". */
const textoOuNull = texto.nullable();
/** HH:MM, horário de Brasília. */
const hora = z.string().regex(/^\d{2}:\d{2}$/);
/** AAAA-MM-DD, horário de Brasília. */
const data = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const esquemaApiV1 = {
  igreja: z.strictObject({
    nome: texto,
    endereco: z.strictObject({
      rua: texto,
      bairro: texto,
      cidade: texto,
      uf: texto,
      cep: texto,
      referencia: textoOuNull,
    }),
    whatsapp: z.string().regex(/^\d+$/).nullable(),
    redes: z.strictObject({ facebook: z.url().nullable(), youtube: z.url().nullable() }),
  }),
  encontros: z.array(
    z.strictObject({
      id: texto,
      nome: texto,
      nomeCurto: textoOuNull,
      descricao: texto,
      diaSemana: z.number().int().min(0).max(6),
      hora,
      ocorrencia: z.enum(['semanal', '1', '2', '3', '4', 'ultima']),
      substituiODia: z.boolean(),
      duracaoMin: z.number().int().positive(),
      recebeTema: z.boolean(),
      provisorio: z.boolean(),
    }),
  ),
  eventos: z.array(
    z.strictObject({
      id: texto,
      titulo: texto,
      descricao: texto,
      local: texto,
      data,
      hora,
      provisorio: z.boolean(),
    }),
  ),
  'tema-da-semana': z.strictObject({
    data,
    tema: texto,
    textoBiblico: textoOuNull,
    pregador: texto,
    provisorio: z.boolean(),
  }),
  contribuicao: z.strictObject({
    pix: z.strictObject({ chave: texto, tipo: texto, titular: texto }).nullable(),
    transferencia: z.strictObject({ banco: texto, agencia: texto, conta: texto }).nullable(),
  }),
  'assuntos-de-contato': z.array(
    z.strictObject({ id: texto, titulo: texto, rotulo: texto, mensagem: texto }),
  ),
};

export type ApiV1 = { [C in keyof typeof esquemaApiV1]: z.infer<(typeof esquemaApiV1)[C]> };

// ── Fontes: o formato interno do site (as coleções de src/content) ─────────────

export interface FontesApiV1 {
  igreja: {
    nome: string;
    endereco: {
      rua: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
      referencia?: string;
    };
    contato: { whatsapp: string; mock: boolean };
    redes: { facebook: string | null; instagram: string | null; youtube: string | null };
  };
  /** cultos.json, já na ordem do site */
  encontros: Array<{
    id: string;
    nome: string;
    nomeCurto?: string;
    descricao: string;
    diaSemana: number;
    hora: string;
    ocorrencia: 'semanal' | '1' | '2' | '3' | '4' | 'ultima';
    substituiODia: boolean;
    duracaoMin: number;
    recebeTema: boolean;
    mock: boolean;
  }>;
  /** eventos.json, já em ordem cronológica */
  eventos: Array<{
    id: string;
    titulo: string;
    descricao: string;
    local: string;
    data: string;
    hora: string;
    mock: boolean;
  }>;
  /** cultos-secao.json → semana */
  tema: { data: string; tema: string; referencia?: string; pregador: string; mock: boolean };
  /** contribua.json */
  contribuicao: {
    pix: { chave: string | null; tipo: string; titular: string; mock: boolean };
    transferencia?: { banco: string; agencia: string; conta: string };
  };
  /** fale-conosco.json → assuntos */
  assuntos: Array<{ id: string; titulo: string; texto: string; rotulo: string; mensagem: string }>;
}

// ── Tradução ───────────────────────────────────────────────────────────────────

/** O painel grava campo vazio como "": no contrato, ausente é null. */
function ouNull(valor: string | null | undefined): string | null {
  return valor ? valor : null;
}

function igreja({ nome, endereco, contato, redes }: FontesApiV1['igreja']): ApiV1['igreja'] {
  const { rua, bairro, cidade, uf, cep, referencia } = endereco;
  return {
    nome,
    endereco: { rua, bairro, cidade, uf, cep, referencia: ouNull(referencia) },
    whatsapp: contato.mock ? null : ouNull(contato.whatsapp.replace(/\D/g, '')),
    redes: { facebook: ouNull(redes.facebook), youtube: ouNull(redes.youtube) },
  };
}

function encontros(itens: FontesApiV1['encontros']): ApiV1['encontros'] {
  return itens.map(({ mock, nomeCurto, ...e }) => ({
    id: e.id,
    nome: e.nome,
    nomeCurto: ouNull(nomeCurto),
    descricao: e.descricao,
    diaSemana: e.diaSemana,
    hora: e.hora,
    ocorrencia: e.ocorrencia,
    substituiODia: e.substituiODia,
    duracaoMin: e.duracaoMin,
    recebeTema: e.recebeTema,
    provisorio: mock,
  }));
}

function eventos(itens: FontesApiV1['eventos']): ApiV1['eventos'] {
  return itens.map((e) => ({
    id: e.id,
    titulo: e.titulo,
    descricao: e.descricao,
    local: e.local,
    data: e.data,
    hora: e.hora,
    provisorio: e.mock,
  }));
}

function temaDaSemana(t: FontesApiV1['tema']): ApiV1['tema-da-semana'] {
  return {
    data: t.data,
    tema: t.tema,
    textoBiblico: ouNull(t.referencia),
    pregador: t.pregador,
    provisorio: t.mock,
  };
}

/** PIX ausente ou provisório sai como null: uma chave falsa poderia desviar uma oferta. */
function contribuicao({ pix, transferencia }: FontesApiV1['contribuicao']): ApiV1['contribuicao'] {
  return {
    pix: pix.chave && !pix.mock ? { chave: pix.chave, tipo: pix.tipo, titular: pix.titular } : null,
    transferencia: transferencia?.banco
      ? { banco: transferencia.banco, agencia: transferencia.agencia, conta: transferencia.conta }
      : null,
  };
}

function assuntos(itens: FontesApiV1['assuntos']): ApiV1['assuntos-de-contato'] {
  return itens.map((a) => ({ id: a.id, titulo: a.titulo, rotulo: a.rotulo, mensagem: a.mensagem }));
}

/**
 * Encontros e eventos dividem o mesmo espaço de identificadores (o alvo de uma alteração é um
 * deles). Um identificador repetido faz o build falhar, dizendo qual e onde.
 */
function checarIdentificadores({ encontros, eventos }: FontesApiV1) {
  const vistos = new Map<string, string>();
  const origens = [
    { onde: 'encontros (src/content/cultos.json)', itens: encontros },
    { onde: 'eventos (src/content/eventos.json)', itens: eventos },
  ];
  for (const { onde, itens } of origens) {
    for (const { id } of itens) {
      const anterior = vistos.get(id);
      if (anterior) {
        throw new Error(
          `/api/v1: o identificador "${id}" se repete em ${anterior} e em ${onde}. ` +
            'Encontros e eventos não podem ter identificadores iguais.',
        );
      }
      vistos.set(id, onde);
    }
  }
}

/** Monta todos os arquivos de /api/v1, cada um validado pelo esquema do contrato. */
export function montarApiV1(fontes: FontesApiV1): ApiV1 {
  checarIdentificadores(fontes);
  return {
    igreja: esquemaApiV1.igreja.parse(igreja(fontes.igreja)),
    encontros: esquemaApiV1.encontros.parse(encontros(fontes.encontros)),
    eventos: esquemaApiV1.eventos.parse(eventos(fontes.eventos)),
    'tema-da-semana': esquemaApiV1['tema-da-semana'].parse(temaDaSemana(fontes.tema)),
    contribuicao: esquemaApiV1.contribuicao.parse(contribuicao(fontes.contribuicao)),
    'assuntos-de-contato': esquemaApiV1['assuntos-de-contato'].parse(assuntos(fontes.assuntos)),
  };
}
