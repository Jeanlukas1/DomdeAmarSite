// O culto gravado que a marcação da transmissão cria quando ela passa a ter vídeo (spec 001,
// R28). Puro: recebe o conteúdo como está no repositório (o formato do painel) e o instante da
// marcação.
import { calendario, DURACAO_PADRAO, eventoComAlteracao, type Alteracao } from '@/lib/encontros';
import type { Video } from '@/lib/video';

export interface ConteudoDoDia {
  /** cultos-secao.json → principal.semana */
  tema?: { data?: string; tema?: string; referencia?: string; pregador?: string };
  /** cultos.json → itens (o painel grava o dia da semana como texto) */
  encontros: Array<{
    id: string;
    nome: string;
    diaSemana: string | number;
    hora: string;
    ocorrencia?: '' | 'semanal' | '1' | '2' | '3' | '4' | 'ultima';
    substituiODia?: boolean;
    duracaoMin?: string | number;
  }>;
  /** eventos.json → itens */
  eventos: Array<{ id: string; titulo: string; data: string; hora: string; local?: string }>;
  /** alteracoes.json → itens; o painel grava campo vazio como "" */
  alteracoes: Array<{
    alvo: string;
    data: string;
    situacao: 'cancelado' | 'alterado';
    novaHora?: string;
    novoLocal?: string;
    mensagem?: string;
  }>;
  /** assista.json → principal.tituloCultoGravadoPadrao */
  tituloPadrao: string;
  /** os identificadores dos cultos gravados que já existem */
  idsExistentes: string[];
}

/** O culto gravado como o painel grava (cultos-gravados.json → itens). */
export interface CultoGravadoDoPainel {
  id: string;
  titulo: string;
  referencia: string;
  data: string;
  pregador: string;
  video: Video;
  mock: boolean;
}

const minutosDe = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

/**
 * O nome do encontro ou evento de hoje cuja janela de transmissão (do início ao fim da duração)
 * contém o momento da marcação; se nenhum contém, o do primeiro de hoje. Um cancelado por uma
 * alteração não conta, e um alterado vale no horário novo.
 */
function nomeDoEncontroDeHoje(c: ConteudoDoDia, agora: Date, hoje: string) {
  const alteracoes: Alteracao[] = c.alteracoes.map((a) => ({
    alvo: a.alvo,
    data: a.data,
    situacao: a.situacao,
    novaHora: a.novaHora || null,
    novoLocal: a.novoLocal || null,
    mensagem: a.mensagem ?? '',
  }));
  const encontros = c.encontros.map((e) => ({
    ...e,
    diaSemana: Number(e.diaSemana),
    ocorrencia: e.ocorrencia || undefined,
    duracaoMin: e.duracaoMin ? Number(e.duracaoMin) : undefined,
  }));
  const { hoje: agoraLa, vezes } = calendario(encontros, agora, alteracoes, 1);
  const janelas = [
    ...vezes.map((v) => ({ nome: v.encontro.nome, inicio: v.inicio, fim: v.fim })),
    ...c.eventos
      .filter((e) => e.data === hoje)
      .map((e) => eventoComAlteracao({ ...e, local: e.local ?? '' }, alteracoes))
      .filter((e) => e.alteracao?.situacao !== 'cancelado')
      .map((e) => ({
        nome: e.titulo,
        inicio: minutosDe(e.hora),
        fim: minutosDe(e.hora) + DURACAO_PADRAO,
      })),
  ].sort((a, b) => a.inicio - b.inicio);
  const agoraMin = agoraLa.minutos;
  return (janelas.find((j) => j.inicio <= agoraMin && agoraMin < j.fim) ?? janelas[0])?.nome;
}

/** "Tapando as brechas" → "tapando-as-brechas" (o formato dos identificadores do painel). */
const slug = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** O culto gravado de hoje, com o vídeo da transmissão. */
export function cultoDoDia(
  c: ConteudoDoDia,
  agora: Date,
  hoje: string,
  video: Video,
): CultoGravadoDoPainel {
  const tema = c.tema?.data === hoje && c.tema.tema ? c.tema : undefined;
  const titulo = tema?.tema ?? nomeDoEncontroDeHoje(c, agora, hoje) ?? c.tituloPadrao;
  const base = [slug(titulo), hoje].filter(Boolean).join('-');
  let id = base;
  for (let n = 2; c.idsExistentes.includes(id); n++) id = `${base}-${n}`;
  return {
    id,
    titulo,
    referencia: tema?.referencia ?? '',
    data: hoje,
    pregador: tema?.pregador ?? '',
    video,
    mock: false,
  };
}
