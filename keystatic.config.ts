// Painel de edição (Keystatic) em /keystatic — só existe no `npm run dev` (salva nos arquivos
// locais) e no deploy da Vercel (salva por commit no GitHub). Ver docs/conteudo.md.
//
// ATENÇÃO: o Keystatic regrava o arquivo inteiro e DESCARTA campos que não estão aqui. Todo campo
// novo em src/content.config.ts para um destes arquivos precisa entrar também neste schema.
import { config, fields, singleton } from '@keystatic/core';

// ---------- campos reutilizados ----------

/** Fotos reais disponíveis (src/assets/fotos/<categoria>/<nome>.jpg → "categoria/nome"). */
const fotosDisponiveis = Object.keys(import.meta.glob('/src/assets/fotos/**/*.jpg'))
  .map((caminho) => caminho.replace('/src/assets/fotos/', '').replace(/\.jpg$/, ''))
  .sort();

const campoFoto = (rotulo: string, opcional = false) =>
  fields.object(
    {
      id: fields.select({
        label: 'Foto',
        options: [
          ...(opcional ? [{ label: '(sem foto)', value: '' }] : []),
          ...fotosDisponiveis.map((id) => ({ label: id, value: id })),
        ],
        defaultValue: opcional ? '' : fotosDisponiveis[0]!,
      }),
      alt: fields.text({
        label: 'Descrição da foto',
        description: 'O que aparece na foto, para quem não enxerga. Não cite nomes de pessoas.',
      }),
      posicao: fields.text({
        label: 'Enquadramento',
        description:
          'Ponto da foto que fica visível no recorte, ex.: "50% 30%" (horizontal vertical).',
        defaultValue: '50% 50%',
      }),
    },
    { label: rotulo },
  );

const campoMock = fields.checkbox({
  label: 'Provisório (mock)',
  description: 'Marque enquanto o conteúdo ainda não for o definitivo da igreja.',
});

const campoLink = (rotulo: string) =>
  fields.object(
    { rotulo: fields.text({ label: 'Texto' }), href: fields.text({ label: 'Link' }) },
    { label: rotulo },
  );

const campoId = fields.text({
  label: 'Identificador',
  description: 'Sem espaços nem acentos, ex.: "culto-domingo". Não repita entre itens.',
  validation: {
    isRequired: true,
    pattern: { regex: /^[a-z0-9-]+$/, message: 'Use só letras minúsculas, números e hífen.' },
  },
});

const campoHora = fields.text({
  label: 'Horário',
  description: 'Formato HH:MM, ex.: 19:00',
  validation: {
    isRequired: true,
    pattern: { regex: /^\d{2}:\d{2}$/, message: 'Use HH:MM, ex.: 09:00' },
  },
});

const campoYoutube = fields.text({
  label: 'Vídeo do YouTube (id)',
  description:
    'Só o código do vídeo: em youtube.com/watch?v=ABC123xyz00, é "ABC123xyz00". Deixe vazio se não houver.',
});

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const textoLongo = (label: string, description?: string) =>
  fields.text({ label, description, multiline: true });

// ---------- painel ----------

export default config({
  // dev = arquivos locais; produção = commits no GitHub. Para criar o GitHub App (uma vez só),
  // rode o dev com PUBLIC_KEYSTATIC_GITHUB=1 e siga o assistente — ver docs/deploy.md.
  storage:
    import.meta.env.DEV && import.meta.env.PUBLIC_KEYSTATIC_GITHUB !== '1'
      ? { kind: 'local' }
      : { kind: 'github', repo: { owner: 'Jeanlukas1', name: 'DomdeAmarSite' } },
  ui: {
    brand: { name: 'Dom de Amar' },
    navigation: {
      'A igreja': ['igreja', 'pastores', 'ministerios'],
      'Cultos e agenda': ['cultos', 'cultosSecao', 'eventos'],
      Assista: ['assista', 'mensagens'],
      Contribua: ['contribua'],
    },
  },
  singletons: {
    igreja: singleton({
      label: 'Dados da igreja',
      path: 'src/content/igreja',
      format: { data: 'json' },
      schema: {
        principal: fields.object(
          {
            nome: fields.text({ label: 'Nome' }),
            bio: fields.text({ label: 'Bio' }),
            slogan: fields.text({ label: 'Slogan' }),
            fundacao: fields.date({ label: 'Data de fundação' }),
            endereco: fields.object(
              {
                rua: fields.text({ label: 'Rua, lote e quadra' }),
                bairro: fields.text({ label: 'Bairro' }),
                cidade: fields.text({ label: 'Cidade' }),
                uf: fields.text({ label: 'UF' }),
                cep: fields.text({ label: 'CEP' }),
                referencia: fields.text({ label: 'Ponto de referência' }),
              },
              { label: 'Endereço' },
            ),
            contato: fields.object(
              {
                telefone: fields.text({ label: 'Telefone' }),
                whatsapp: fields.text({
                  label: 'WhatsApp',
                  description: 'Só números, com 55 e DDD, ex.: 5522999999999',
                }),
                email: fields.text({ label: 'E-mail' }),
                mock: fields.checkbox({
                  label: 'Contato provisório (mock)',
                  description: 'Enquanto marcado, os botões de WhatsApp não aparecem no site.',
                }),
              },
              { label: 'Contato' },
            ),
            redes: fields.object(
              {
                facebook: fields.url({ label: 'Facebook', validation: { isRequired: true } }),
                instagram: fields.url({
                  label: 'Instagram',
                  description: 'Vazio = ícone não aparece.',
                }),
                youtube: fields.url({
                  label: 'YouTube',
                  description: 'Vazio = ícone não aparece.',
                }),
              },
              { label: 'Redes sociais' },
            ),
          },
          { label: 'Dados' },
        ),
      },
    }),

    pastores: singleton({
      label: 'Liderança',
      path: 'src/content/pastores',
      format: { data: 'json' },
      schema: {
        itens: fields.array(
          fields.object({
            id: campoId,
            ordem: fields.integer({ label: 'Ordem', defaultValue: 1 }),
            nome: fields.text({ label: 'Nome' }),
            funcao: fields.text({ label: 'Função' }),
            foto: campoFoto('Foto (opcional)', true),
            mock: campoMock,
          }),
          { label: 'Pessoas', itemLabel: (p) => p.fields.nome.value || 'Nova pessoa' },
        ),
      },
    }),

    ministerios: singleton({
      label: 'Ministérios',
      path: 'src/content/ministerios',
      format: { data: 'json' },
      schema: {
        itens: fields.array(
          fields.object({
            id: campoId,
            ordem: fields.integer({ label: 'Ordem', defaultValue: 1 }),
            nome: fields.text({ label: 'Nome' }),
            frase: fields.text({ label: 'Frase' }),
            foto: campoFoto('Foto'),
            mock: campoMock,
          }),
          { label: 'Ministérios', itemLabel: (p) => p.fields.nome.value || 'Novo ministério' },
        ),
      },
    }),

    cultos: singleton({
      label: 'Horários dos cultos',
      path: 'src/content/cultos',
      format: { data: 'json' },
      schema: {
        itens: fields.array(
          fields.object({
            id: campoId,
            ordem: fields.integer({ label: 'Ordem', defaultValue: 1 }),
            dia: fields.text({ label: 'Dia (como aparece no site)', description: 'Ex.: Domingo' }),
            diaSemana: fields.select({
              label: 'Dia da semana (para calcular o próximo culto)',
              options: DIAS.map((d, i) => ({ label: d, value: String(i) })),
              defaultValue: '0',
            }),
            hora: campoHora,
            nome: fields.text({ label: 'Nome do culto' }),
            descricao: textoLongo('Descrição'),
            ocorrencia: fields.select({
              label: 'Quando acontece',
              description:
                'Ex.: a Santa Ceia é "Só no 2º" (2º domingo do mês). O site calcula as datas sozinho.',
              options: [
                { label: 'Toda semana', value: 'semanal' },
                { label: 'Só no 1º deste dia da semana no mês', value: '1' },
                { label: 'Só no 2º deste dia da semana no mês', value: '2' },
                { label: 'Só no 3º deste dia da semana no mês', value: '3' },
                { label: 'Só no 4º deste dia da semana no mês', value: '4' },
                { label: 'Só no último deste dia da semana no mês', value: 'ultima' },
              ],
              defaultValue: 'semanal',
            }),
            substituiODia: fields.checkbox({
              label: 'Neste dia, substitui os outros encontros',
              description:
                'Marque na Santa Ceia: no domingo dela, o Seminário e o culto da noite não acontecem.',
            }),
            duracaoMin: fields.integer({
              label: 'Duração (minutos)',
              description: 'Tempo em que o site mostra "Acontecendo agora". Ceia + almoço: 240.',
              defaultValue: 120,
              validation: { min: 30 },
            }),
            recebeTema: fields.checkbox({
              label: 'O tema da semana é deste encontro',
              description: 'Marque no Culto da Plenitude e na Santa Ceia.',
            }),
            nomeCurto: fields.text({
              label: 'Nome curto (opcional)',
              description:
                'Aparece no topo do site ao lado do horário, ex.: "Santa Ceia". Deixe vazio nos encontros de toda semana.',
            }),
            foto: campoFoto('Foto'),
            mock: campoMock,
          }),
          {
            label: 'Cultos',
            itemLabel: (p) =>
              `${p.fields.dia.value} ${p.fields.hora.value} · ${p.fields.nome.value}`,
          },
        ),
      },
    }),

    cultosSecao: singleton({
      label: 'Seção Cultos e destaque da semana',
      path: 'src/content/cultos-secao',
      format: { data: 'json' },
      schema: {
        principal: fields.object({
          semana: fields.object(
            {
              data: fields.date({
                label: 'Dia do encontro deste tema',
                description:
                  'O culto, o dia e a hora o site calcula sozinho (na semana da Ceia, vira a Ceia). Depois deste dia, o tema some até você trocar.',
                validation: { isRequired: true },
              }),
              tema: fields.text({ label: 'Tema da mensagem' }),
              referencia: fields.text({
                label: 'Texto bíblico',
                description: 'Ex.: Hebreus 8.10-12',
              }),
              pregador: fields.text({ label: 'Pregador' }),
              mock: campoMock,
            },
            { label: 'Destaque da semana' },
          ),
          titulo: fields.text({ label: 'Título da seção' }),
          destaque: fields.text({
            label: 'Palavra com pincelada',
            description: 'Precisa estar no título.',
          }),
          texto: textoLongo('Texto de apoio'),
          proximoRotulo: fields.text({ label: 'Rótulo do próximo culto' }),
          quando: fields.object(
            {
              agora: fields.text({ label: '"Agora"' }),
              hoje: fields.text({ label: '"Hoje"' }),
              amanha: fields.text({ label: '"Amanhã"' }),
            },
            { label: 'Palavras de tempo' },
          ),
          comoChegar: campoLink('Botão "Como chegar"'),
          avisoSubstituido: fields.text({
            label: 'Aviso nos encontros que não acontecem (domingo de Ceia)',
            description: '{nome} e {hora} são trocados pelo encontro do dia, ex.: Santa Ceia, 10h.',
          }),
        }),
      },
    }),

    eventos: singleton({
      label: 'Agenda (eventos)',
      path: 'src/content/eventos',
      format: { data: 'json' },
      schema: {
        itens: fields.array(
          fields.object({
            id: campoId,
            titulo: fields.text({ label: 'Título' }),
            data: fields.date({ label: 'Data', validation: { isRequired: true } }),
            hora: campoHora,
            local: fields.text({ label: 'Local', defaultValue: 'Templo Dom de Amar' }),
            descricao: textoLongo('Descrição'),
            foto: campoFoto('Foto (opcional)', true),
            mock: campoMock,
          }),
          {
            label: 'Eventos',
            itemLabel: (p) => `${p.fields.data.value ?? ''} · ${p.fields.titulo.value}`,
          },
        ),
      },
    }),

    assista: singleton({
      label: 'Assista online',
      path: 'src/content/assista',
      format: { data: 'json' },
      schema: {
        principal: fields.object({
          video: fields.object(
            {
              titulo: fields.text({ label: 'Título do vídeo' }),
              descricao: fields.text({ label: 'Descrição' }),
              youtubeId: campoYoutube,
              poster: campoFoto('Foto de capa'),
              mock: campoMock,
            },
            { label: 'Vídeo em destaque' },
          ),
          titulo: fields.text({ label: 'Título da seção' }),
          destaque: fields.text({ label: 'Palavra com pincelada' }),
          texto: textoLongo('Texto de apoio'),
          emBreve: textoLongo('Aviso enquanto não há vídeo'),
          rotuloAssistir: fields.text({ label: 'Botão assistir' }),
          rotuloFacebook: fields.text({ label: 'Botão Facebook' }),
          mensagensTitulo: fields.text({ label: 'Título da lista de mensagens' }),
        }),
      },
    }),

    mensagens: singleton({
      label: 'Mensagens recentes',
      path: 'src/content/mensagens',
      format: { data: 'json' },
      schema: {
        itens: fields.array(
          fields.object({
            id: campoId,
            titulo: fields.text({ label: 'Título' }),
            referencia: fields.text({ label: 'Texto bíblico' }),
            data: fields.date({ label: 'Data', validation: { isRequired: true } }),
            pregador: fields.text({ label: 'Pregador' }),
            youtubeId: campoYoutube,
            mock: campoMock,
          }),
          {
            label: 'Mensagens',
            itemLabel: (p) => `${p.fields.data.value ?? ''} · ${p.fields.titulo.value}`,
          },
        ),
      },
    }),

    contribua: singleton({
      label: 'Contribua (PIX)',
      path: 'src/content/contribua',
      format: { data: 'json' },
      schema: {
        principal: fields.object({
          pix: fields.object(
            {
              chave: fields.text({
                label: 'Chave PIX',
                description: 'Vazio = o site mostra "Chave em breve".',
              }),
              tipo: fields.text({
                label: 'Tipo da chave',
                description: 'Ex.: CNPJ, e-mail, telefone',
              }),
              titular: fields.text({ label: 'Titular' }),
              titulo: fields.text({ label: 'Título do cartão' }),
              emBreve: fields.text({ label: 'Texto "em breve"' }),
              emBreveTexto: textoLongo('Explicação enquanto não há chave'),
              copiar: fields.text({ label: 'Botão copiar' }),
              copiada: fields.text({ label: 'Mensagem após copiar' }),
              mock: campoMock,
            },
            { label: 'PIX' },
          ),
          transferencia: fields.object(
            {
              titulo: fields.text({ label: 'Título' }),
              banco: fields.text({
                label: 'Banco',
                description: 'Vazio = o bloco de transferência não aparece.',
              }),
              agencia: fields.text({ label: 'Agência' }),
              conta: fields.text({ label: 'Conta' }),
              rotuloBanco: fields.text({ label: 'Rótulo "Banco"' }),
              rotuloAgencia: fields.text({ label: 'Rótulo "Agência"' }),
              rotuloConta: fields.text({ label: 'Rótulo "Conta"' }),
            },
            { label: 'Transferência bancária' },
          ),
          titulo: fields.text({ label: 'Título da seção' }),
          destaque: fields.text({ label: 'Palavra com pincelada' }),
          texto: textoLongo('Texto de apoio'),
          versiculo: fields.object(
            { texto: textoLongo('Versículo'), referencia: fields.text({ label: 'Referência' }) },
            { label: 'Versículo' },
          ),
          foto: campoFoto('Foto da obra'),
          legenda: fields.text({ label: 'Legenda da foto' }),
          outrasFormas: fields.object(
            {
              titulo: fields.text({ label: 'Título' }),
              itens: fields.array(campoLink('Item'), {
                label: 'Itens',
                itemLabel: (p) => p.fields.rotulo.value,
              }),
            },
            { label: 'Outras formas de ajudar' },
          ),
        }),
      },
    }),
  },
});
