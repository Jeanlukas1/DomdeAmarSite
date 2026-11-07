# Conteúdo pendente (mockups)

Cada item abaixo está marcado no arquivo com `mock: true` (ou `// MOCK`). Quando a igreja fornecer o dado: substitua, remova a marcação e risque a linha aqui.

| Arquivo                         | Campo                                     | O que precisamos                                                                                                            |
| ------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/content/igreja.json`       | `contato.telefone`, `contato.whatsapp`    | telefone/WhatsApp oficial (enquanto `contato.mock` for `true`, o botão "Avisar que estou indo" não aparece)                 |
| `src/content/igreja.json`       | `contato.email`                           | e-mail oficial                                                                                                              |
| `src/content/igreja.json`       | `redes.instagram`, `redes.youtube`        | links do Instagram e YouTube, se existirem (hoje `null`: o ícone não aparece até ter o link)                                |
| `src/content/igreja.json`       | `fundacao`                                | data exata de fundação (estimada: 25/07/2018, pelos 8 anos)                                                                 |
| `src/content/quem-somos.json`   | `carta`, `missao`, `visao`                | texto real de apresentação, missão e visão                                                                                  |
| `src/content/pastores.json`     | todos                                     | nomes completos, funções e fotos da liderança (confirmar "Pr. Marcelo")                                                     |
| `src/content/historia.json`     | `capitulos[].texto`, `intro`, `cta.texto` | história real (como começou, ano exato, marcos) e confirmar a ordem: fundação → 8 anos no templo novo → obra do novo templo |
| `src/content/cultos.json`       | `descricao`                               | descrição real de cada culto                                                                                                |
| `src/content/cultos-secao.json` | `semana`                                  | tema, texto bíblico e pregador da semana                                                                                    |
| `src/content/assista.json`      | `video`                                   | canal do YouTube e vídeo em destaque (`youtubeId`)                                                                          |
| `src/content/mensagens.json`    | todos                                     | mensagens reais (título, texto bíblico, data, link)                                                                         |
| `src/content/ministerios.json`  | todos                                     | ministérios que realmente existem, com nome e descrição                                                                     |
| `src/content/cresca.json`       | `estudo.texto`, `texto`                   | descrição real do Estudo da Palavra                                                                                         |
| `src/content/eventos.json`      | todos com `mock: true`                    | agenda real de eventos (o aniversário de 8 anos é real)                                                                     |
| `src/assets/logo/`              | —                                         | **arquivo original da logo** (.ai / .pdf vetorial / .svg com camadas)                                                       |

> Próximas fases adicionam: pastores (nomes/fotos), história, missão/visão, ministérios, eventos, mensagens/vídeos, depoimentos e chave PIX.
