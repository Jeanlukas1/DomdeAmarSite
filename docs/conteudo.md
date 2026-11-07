# Como editar o conteúdo

Todo o conteúdo fica em `src/content/`. Depois de editar, rode `npm run build`: o Zod acusa campos errados.

| Arquivo             | O que é                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `igreja.json`       | nome, slogan, endereço, contatos, redes                                                                                 |
| `navegacao.json`    | itens do menu (`ordem`, `rotulo`, `href`, `destaque` = botão vermelho)                                                  |
| `hero.json`         | saudação, título, texto e botões do topo da home                                                                        |
| `quem-somos.json`   | título, carta, missão, visão, fotos (id em `src/assets/fotos` + `alt` + `posicao`)                                      |
| `pastores.json`     | liderança: nome, função, ordem (foto opcional)                                                                          |
| `historia.json`     | título, capítulos (marco, título, texto, 1–2 fotos), comparador antes/agora, chamada para ajudar a construir            |
| `cultos.json`       | cada culto: dia, `diaSemana` (0 = domingo), `hora` (HH:MM), nome, descrição, foto. O site marca sozinho o próximo culto |
| `cultos-secao.json` | título da seção e o **destaque da semana** (tema, texto bíblico, pregador): troque toda semana                          |
| `assista.json`      | vídeo em destaque (`youtubeId` = só o id de 11 caracteres; `null` mostra "em breve" + Facebook) e textos da seção       |
| `mensagens.json`    | pregações: título, referência, data (AAAA-MM-DD), pregador, `youtubeId`. A home mostra as 3 mais recentes               |
| `cresca.json`       | textos da seção Cresça na fé e do Estudo da Palavra                                                                     |
| `ministerios.json`  | ministérios: nome, frase, foto vertical, ordem                                                                          |

> **Fotos:** use o id `pasta/arquivo` (sem .jpg), um `alt` que descreva a cena sem nomear pessoas, e `posicao` (object-position, ex.: `50% 30%`) para acertar o recorte.

> As próximas coleções (cultos, eventos, mensagens, pastores, ministérios, galeria, depoimentos) entram nas fases F3/F4, e esta tabela é atualizada junto.

**Mockups:** todo dado provisório tem `mock: true`. A lista completa do que trocar está em [conteudo-pendente.md](conteudo-pendente.md).

Na F4 entra o painel **Keystatic** (`/keystatic`) para editar pelo navegador.
