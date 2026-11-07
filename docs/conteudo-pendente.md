# Conteúdo pendente (mockups)

Cada item abaixo está marcado no arquivo com `mock: true` (ou `// MOCK`). Quando a igreja fornecer o dado: substitua, remova a marcação e risque a linha aqui.

| Arquivo                         | Campo                                     | O que precisamos                                                                                                            |
| ------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/content/igreja.json`       | `contato.email`                           | e-mail oficial (hoje vazio; não aparece no site)                                                                            |
| `src/content/pastores.json`     | `foto`                                    | fotos do Pr. Marcelo Roque e da Pra. Karen Costa (hoje aparecem os monogramas)                                              |
| `src/content/igreja.json`       | `redes.instagram`, `redes.youtube`        | links do Instagram e YouTube, se existirem (hoje `null`: o ícone não aparece até ter o link)                                |
| `src/content/igreja.json`       | `fundacao`                                | data exata de fundação (estimada: 25/07/2018, pelos 8 anos)                                                                 |
| `src/content/quem-somos.json`   | `carta`, `missao`, `visao`                | texto real de apresentação, missão e visão                                                                                  |
| `src/content/historia.json`     | `capitulos[].texto`, `intro`, `cta.texto` | história real (como começou, ano exato, marcos) e confirmar a ordem: fundação → 8 anos no templo novo → obra do novo templo |
| `src/content/cultos.json`       | `descricao`                               | descrição real de cada culto                                                                                                |
| `src/content/cultos-secao.json` | `semana`                                  | tema, texto bíblico e pregador da semana                                                                                    |
| `src/content/assista.json`      | `video`                                   | canal do YouTube e vídeo em destaque (`youtubeId`)                                                                          |
| `src/content/mensagens.json`    | todos                                     | mensagens reais (título, texto bíblico, data, link)                                                                         |
| `src/content/ministerios.json`  | todos                                     | ministérios que realmente existem, com nome e descrição                                                                     |
| `src/content/cresca.json`       | `estudo.texto`, `texto`                   | descrição real do Estudo da Palavra                                                                                         |
| `src/content/eventos.json`      | todos com `mock: true`                    | agenda real de eventos (o aniversário de 8 anos é real)                                                                     |
| `src/assets/logo/`              | —                                         | **arquivo original da logo** (.ai / .pdf vetorial / .svg com camadas)                                                       |

## Resolvidos

| Data       | Arquivo                      | O que entrou                                                                                                              |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-07 | `src/content/igreja.json`    | WhatsApp e telefone **(21) 99403-4141** (`contato.mock: false`): os botões de WhatsApp passam a aparecer                  |
| 2026-11-07 | `src/content/pastores.json`  | **Pr. Marcelo Roque** (pastor líder) e **Pra. Karen Costa** (pastora); o pregador "Pr. Marcelo" virou "Pr. Marcelo Roque" |
| 2026-11-07 | `src/content/contribua.json` | PIX **CNPJ 42.753.605/0001-01** (dígitos verificadores conferidos); o botão copia só os números                           |
| 2026-11-07 | `src/content/contribua.json` | transferência: banco **Cora SCFI**, agência **0001**, conta **1746315-2** (aparece no cartão do PIX)                      |
