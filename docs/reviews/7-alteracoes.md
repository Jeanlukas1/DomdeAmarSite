# Revisão do ticket #7 — Cadastrar e publicar as alterações

- **Data:** 2026-11-22
- **Issue:** #7
- **Nível:** Crítico
- **Base:** `0ca82a2` (origin/main)
- **Cabeça revisada:** `39f5e76`
- **Lentes:** conformidade, qualidade
- **Modelo do revisor:** agente `eng:reviewer` (claude-opus-5-5)
- Lentes de segurança e arquitetura não executadas nesta versão do processo; essa leitura cabe ao humano.

---

## Veredito

Aprovado com ressalvas — 0 bloqueador(es), 1 importante(s), 1 menor(es).

## Conformidade

### C1 — Alteração com `mensagem` vazia ou `novaHora` malformada derruba o build em vez de ser retirada

- **Gravidade:** Importante
- **Local:** src/lib/contrato/apiV1.ts:257-300 (função `alteracoes`) e :356 (`esquemaApiV1.alteracoes.parse`); src/content.config.ts:250-264
- **Problema:** `alteracoes()` só descarta por quatro motivos: alvo inexistente, data fora da ocorrência, duplicata e "alterado" sem hora e sem local. O esquema do contrato exige `mensagem` com `min(1)` e `novaHora` no formato `^\d{2}:\d{2}$`. A coleção aceita `mensagem` vazia (`default('')`) e `novaHora` livre (`z.string().default('')`). Uma alteração com `mensagem: ""` ou `novaHora: "9:00"` passa pelas regras de descarte e depois faz o `parse` lançar exceção. O painel impede isso (`isRequired` na mensagem, `pattern` na hora), mas edição direta do JSON ou um merge não passa pelo painel.
- **Justificativa:** R10: "Uma alteração que não cumpre as regras do contrato é retirada da publicação, e o build registra um alerta… O restante do conteúdo é publicado normalmente." Critério do issue: "O restante do conteúdo é publicado normalmente." Só os 4 motivos listados têm teste.
- **Consequência:** Uma alteração mal preenchida impede o build inteiro, e o conteúdo do app deixa de ser atualizado. A mesma falha atinge o endpoint em dev. É o tipo de falha que R10 pede para isolar.
- **Correção sugerida:** Acrescentar à cadeia de motivos o caso `mensagem` vazia e o caso `novaHora` não vazia fora de `HH:MM`, com alerta. Acrescentar um teste para cada um, no padrão da lista `casos`.

## Qualidade

### Q1 — Cadeia de ternários aninhados para calcular o motivo

- **Gravidade:** Menor
- **Local:** src/lib/contrato/apiV1.ts:543-552
- **Problema:** Quatro ternários aninhados misturam a busca, o cálculo da regra e a mensagem. Fica difícil acrescentar uma regra, como a de C1.
- **Justificativa:** Julgamento de legibilidade (code smell). Não há padrão documentado que se aplique.
- **Consequência:** Cada regra nova aumenta o aninhamento e o risco de errar a ordem das verificações.
- **Correção sugerida:** Extrair `motivoDeDescarte(a, encontros, eventos, publicadas): string | undefined`, com `if`s em sequência e retorno antecipado.

## Não verificado

- O painel (R15, R16) é conferido à mão, como prevê o issue, e eu não executei nada. Não confirmei que o id read-only (`campoIdGerado`, com `onChange` anulado e `defaultValue` em função) funciona na versão instalada do Keystatic. Também não confirmei que `react` é dependência direta, já que `keystatic.config.ts` agora o importa.
- Não rodei testes, lint, tipos nem build.
- Não há emenda na spec, então não havia nada a conferir em docs/APPROVALS.md.
- Os documentos vivos (docs/DATA-MODEL.md, docs/conteudo.md) foram atualizados no diff. O que li neles é coerente com o código.
