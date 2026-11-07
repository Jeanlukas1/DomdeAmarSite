---
target: seção Aliança (véu rasgado)
total_score: 17
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\lukas\\OneDrive\\Documentos\\GitHub\\DomdeAmarSite-veu\\src\\components\\sections\\Alianca.astro"
target_fingerprint: 'sha256:15f3ef51031b0866945d139b91dd564bdec0fc78d1ac1bc8b392b05610f9560f'
target_path: "C:\\Users\\lukas\\OneDrive\\Documentos\\GitHub\\DomdeAmarSite-veu\\src\\components\\sections\\Alianca.astro"
timestamp: 2026-11-07T17-56-54Z
slug: src-components-sections-alianca-astro
---

# Critique — Aliança (véu que se rasga)

Método: dual-agent (A: revisão de design · B: detector + navegador)

Nota: 17/28 (61%, Aceitável). n/a: 7, 9, 10.

| #   | Heurística             | Nota |
| --- | ---------------------- | ---- |
| 1   | Visibilidade do estado | 2    |
| 2   | Mundo real             | 3    |
| 3   | Controle e liberdade   | 2    |
| 4   | Consistência           | 2    |
| 5   | Prevenção de erros     | 2    |
| 6   | Reconhecimento         | 3    |
| 8   | Estética/minimalismo   | 3    |

Especificidade: conceito autoral (véu rasgado = nova aliança, posicionamento da igreja); execução genérica (curtain reveal com gradiente liso).
Detector: CLI 0 achados; overlay: só falso positivo de contraste no estado estático (véu absoluto ignorado); contraste real ≥ 9,5:1; ornamento 4,86:1.

## Prioridades

- [P1] ~1,3 tela de vinho vazio antes do pico (chegada + 0–0,34 do pin). Fix: pin ~65%, linha de luz durante a chegada, rasgo a partir de 0,2. → animate
- [P1] Se o import de alianca.ts falhar, a seção fica escura e vazia (fallback do BaseLayout só checa __animReady/hero). Fix: .catch/timeout que volta ao estado estático. → harden
- [P2] Só uma borda rasgada aparece (metades 51% sobrepostas, a direita cobre o rasgo da esquerda); picos viram onda no desktop. Fix: z-index nos rasgos ou 50/50; path com picos proporcionais à altura. → polish
- [P2] Linha de luz ~1 px e o alto do rasgo fica sob o header. Fix: non-scaling-stroke 2–3 px; header transparente durante o pin. → animate
- [P3] Versículo pequeno no desktop, creme vazio após o pin, borda vermelha pesada a 375. → typeset + layout

Perguntas: versículo (Mt 26.28 termina em "pecados"; Hb 10.19–20 liga o véu ao acesso livre)? Precisa de pin? Véu como pincelada da marca?
