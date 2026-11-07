# Como editar o conteúdo

Todo o conteúdo fica em `src/content/`. Depois de editar, rode `npm run build`: o Zod acusa campos errados.

| Arquivo           | O que é                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `igreja.json`     | nome, slogan, endereço, contatos, redes                                                                      |
| `navegacao.json`  | itens do menu (`ordem`, `rotulo`, `href`, `destaque` = botão vermelho)                                       |
| `hero.json`       | saudação, título, texto e botões do topo da home                                                             |
| `quem-somos.json` | título, carta, missão, visão, fotos (id em `src/assets/fotos` + `alt` + `posicao`)                           |
| `pastores.json`   | liderança: nome, função, ordem (foto opcional)                                                               |
| `historia.json`   | título, capítulos (marco, título, texto, 1–2 fotos), comparador antes/agora, chamada para ajudar a construir |

> **Fotos:** use o id `pasta/arquivo` (sem .jpg), um `alt` que descreva a cena sem nomear pessoas, e `posicao` (object-position, ex.: `50% 30%`) para acertar o recorte.

> As próximas coleções (cultos, eventos, mensagens, pastores, ministérios, galeria, depoimentos) entram nas fases F3/F4, e esta tabela é atualizada junto.

**Mockups:** todo dado provisório tem `mock: true`. A lista completa do que trocar está em [conteudo-pendente.md](conteudo-pendente.md).

Na F4 entra o painel **Keystatic** (`/keystatic`) para editar pelo navegador.
