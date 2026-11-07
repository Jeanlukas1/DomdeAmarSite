# Como editar o conteúdo

Todo o conteúdo fica em `src/content/`. Depois de editar, rode `npm run build`: o Zod acusa campos errados.

## Painel (Keystatic)

Quem não é técnico edita pelo painel em **`/keystatic`**:

- **Local:** `npm run dev` e abra `http://localhost:4321/keystatic`. O painel grava direto nos arquivos de `src/content/`; depois é só commitar.
- **Produção (a partir da F6):** `https://<site>/keystatic`, com login do GitHub. Cada "Save" vira um commit na `main`, e a Vercel publica sozinha.
- No painel: dados da igreja, liderança, ministérios, horários dos cultos, destaque da semana, agenda, Assista (vídeo do YouTube), mensagens e Contribua (PIX). Os demais textos (hero, história etc.) continuam sendo editados no arquivo.
- As fotos são escolhidas numa lista com as fotos de `src/assets/fotos/`. Foto nova precisa ser adicionada ao repositório antes.
- **Regra para quem programa:** o painel regrava o arquivo inteiro e descarta campos que não conhece. Campo novo num desses arquivos precisa entrar em `src/content.config.ts` **e** em `keystatic.config.ts`.
- Listas editadas pelo painel ficam no formato `{ "itens": [...] }`, e esses arquivos estão no `.prettierignore` (o painel usa a formatação dele).

| Arquivo             | O que é                                                                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `igreja.json`       | nome, slogan, endereço, contatos, redes                                                                                                                                                                  |
| `navegacao.json`    | itens do menu (`ordem`, `rotulo`, `href`, `destaque` = botão vermelho)                                                                                                                                   |
| `ui.json`           | rótulos de interface: marca do header, complemento do título/descrição de SEO e textos só para leitor de tela                                                                                            |
| `hero.json`         | saudação, título, texto e botões do topo da home                                                                                                                                                         |
| `alianca.json`      | transição entre o hero e o Quem somos: título (só leitor de tela) e o versículo (Mt 26.28, ARA)                                                                                                          |
| `quem-somos.json`   | título, carta, missão, visão, fotos (id em `src/assets/fotos` + `alt` + `posicao`)                                                                                                                       |
| `pastores.json`     | liderança: nome, função, ordem (foto opcional)                                                                                                                                                           |
| `historia.json`     | título, capítulos (marco, título, texto, 1–2 fotos), comparador antes/agora, chamada para ajudar a construir                                                                                             |
| `cultos.json`       | cada culto: dia, `diaSemana` (0 = domingo), `hora` (HH:MM), nome, descrição, foto. O site marca sozinho o próximo culto                                                                                  |
| `cultos-secao.json` | título da seção e o **destaque da semana** (tema, texto bíblico, pregador): troque toda semana                                                                                                           |
| `assista.json`      | vídeo em destaque (`youtubeId` = só o id de 11 caracteres; `null` mostra "em breve" + Facebook) e textos da seção                                                                                        |
| `mensagens.json`    | pregações: título, referência, data (AAAA-MM-DD), pregador, `youtubeId`. A home mostra as 3 mais recentes                                                                                                |
| `cresca.json`       | textos da seção Cresça na fé e do Estudo da Palavra                                                                                                                                                      |
| `ministerios.json`  | ministérios: nome, frase, foto vertical, ordem                                                                                                                                                           |
| `agenda.json`       | textos da seção Agenda                                                                                                                                                                                   |
| `eventos.json`      | eventos: título, data (AAAA-MM-DD), hora, local, descrição, foto opcional. **Eventos passados somem sozinhos**                                                                                           |
| `visite.json`       | Visite-nos: título, texto, nomes das duas ruas da esquina (mapinha desenhado), rótulos das rotas e mensagem pronta do WhatsApp. O endereço vem de `igreja.json`                                          |
| `galeria.json`      | fotos da galeria (id + alt). Retrato ocupa 2 linhas, paisagem 1: mantenha as 8 primeiras na ordem paisagem, retrato, paisagem, retrato, retrato, retrato, paisagem, paisagem (fecha a grade sem buracos) |
| `contribua.json`    | Contribua: texto, versículo, foto da obra e o cartão do PIX. `pix.chave` = `null` mostra "Chave em breve"; com a chave preenchida, aparece o botão de copiar                                             |
| `fale-conosco.json` | Fale com a gente: os assuntos (`id` vira a âncora: `#oracao`, `#participe`) e a mensagem pronta de cada um no WhatsApp                                                                                   |
| `rodape.json`       | versículo do rodapé e títulos das colunas (endereço e cultos vêm de `igreja.json` e `cultos.json`)                                                                                                       |

> **Fotos:** use o id `pasta/arquivo` (sem .jpg), um `alt` que descreva a cena sem nomear pessoas, e `posicao` (object-position, ex.: `50% 30%`) para acertar o recorte.

> As próximas coleções (cultos, eventos, mensagens, pastores, ministérios, galeria, depoimentos) entram nas fases F3/F4, e esta tabela é atualizada junto.

**Mockups:** todo dado provisório tem `mock: true`. A lista completa do que trocar está em [conteudo-pendente.md](conteudo-pendente.md).

Na F4 entra o painel **Keystatic** (`/keystatic`) para editar pelo navegador.
