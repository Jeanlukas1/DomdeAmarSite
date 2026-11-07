---
target: home page inteira
total_score: 20
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\lukas\\OneDrive\\Documentos\\GitHub\\DomdeAmarSite\\src\\pages\\index.astro"
target_fingerprint: 'sha256:443a02d54df7ed40f8dc409389696aedafa81fcbf0b2b2153d4be1c76ee31c82'
target_path: "C:\\Users\\lukas\\OneDrive\\Documentos\\GitHub\\DomdeAmarSite\\src\\pages\\index.astro"
timestamp: 2026-11-07T04-01-40Z
slug: src-pages-index-astro
---

Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score

| #     | Heurística             | Nota  | Achado                                                                                    |
| ----- | ---------------------- | ----- | ----------------------------------------------------------------------------------------- |
| 1     | Visibilidade do status | 3     | "Próximo culto · Amanhã" ótimo; sem seção ativa no menu; trilha da História sem progresso |
| 2     | Mundo real             | 4     | pt-BR caloroso e local                                                                    |
| 3     | Controle               | 3     | pin da História prende ~4.800px no desktop                                                |
| 4     | Consistência           | 2     | menu sem Cultos/Agenda; Estudo duplicado; dois carrosséis iguais                          |
| 5     | Prevenção de erros     | 3     | redes mock levam a domínios vazios                                                        |
| 6     | Reconhecimento         | 2     | horário/endereço longe do topo                                                            |
| 7     | Flexibilidade          | n/a   | Persuade                                                                                  |
| 8     | Estética               | 3     | página longa; pôster do Assista estourado                                                 |
| 9     | Recuperação            | n/a   | quase sem erros possíveis                                                                 |
| 10    | Ajuda                  | n/a   | Persuade                                                                                  |
| Total |                        | 20/28 | Bom (71%)                                                                                 |

## Especificidade

~70% autoral (selo, História com polaroides e antes/depois, Efésios 2.8, próximo culto, pincelada). Segunda metade (Cresça, Agenda, Galeria) genérica e plana.
Detector: fonte 2 avisos (SecaoTitulo 1.0625rem; Faixa radius 1rem). Renderizado D5/M13: blush sobre wine-900 4,3:1 (Cultos.astro:53,68; Cresca.astro:27); "2018" 2,8:1 no mobile (Historia.astro:63); 9 stragglers (falta text-wrap: pretty). Falso positivo: cream-palette (Warm Paper Rule).

## Priority Issues

- [P1] "Quando e onde" fora do topo: linha de próximo culto + endereço sob CTAs do hero; "Cultos" no menu; esquina de referência; "Quero conhecer" → #cultos até a F4. (clarify + layout)
- [P1] Segunda metade genérica/plana: Agenda escura ou lista vertical; trocar cartão duplicado do Estudo; Galeria ~8 fotos sem marca d'água. (layout → colorize)
- [P2] Pin da História: entrada vazia, fotos/legendas desencontradas, glifo cortado, sem progresso, dica "Role" no modo empilhado. (animate + polish)
- [P2] Cultos no mobile alto demais + contraste blush/wine 4,3:1 + foco vermelho invisível no vinho. (adapt + harden)
- [P3] Pôster do Assista estourado; ícones de redes mock. (harden)

## Persona Red Flags

Jordan: CTA sem destino; horário a 4 telas. Casey: 17 telas; vãos de reveal; selo empurra CTAs. Riley: "Mensagens" no meio do Assista; pin em 1024px; slider captura deslize; foco invisível. Dona Graça: texto fino; horários espalhados; setas longe.

## Minor

Header translúcido turvo sobre escuro; scroll-mt 80 vs header 72; monogramas parecem placeholder; nome quebra no rodapé; ornamento do "Nesta semana"; mosaico desalinhado no fim.

## Questions

Hero: boas-vindas ou "Domingo 18h, Rua 94"? Onde a obra merece aparecer? Cresça+Galeria viram uma faixa "A semana"?
