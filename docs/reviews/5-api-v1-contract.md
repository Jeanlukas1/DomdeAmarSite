# Revisão do ticket #5: Publicar o conteúdo existente no contrato /api/v1

- **Data:** 2026-11-22
- **Issue:** #5
- **Nível:** Crítico
- **Base:** 8bbe79e
- **Commit revisado:** 7309cc8
- **Lentes:** conformidade, qualidade
- **Modelo do revisor:** claude-opus-5-5 (agente `eng:reviewer`)
- Lentes de segurança e arquitetura não executadas nesta versão do processo; essa leitura cabe ao humano.

---

## Veredito

Aprovado com ressalvas — 0 bloqueador(es), 0 importante(s), 2 menor(es).

## Conformidade

### C1 — Nenhum teste cobre o endpoint publicado

- **Gravidade:** Menor
- **Local:** src/pages/api/v1/[colecao].json.ts:21-35
- **Problema:** os testes (apiV1.test.ts) cobrem só `montarApiV1`. A rota não tem teste: nem a ligação entre as coleções reais e os campos de `FontesApiV1` (`cultosSecao.semana`, `contribua`, `faleConosco.assuntos`), nem o `getStaticPaths`.
- **Justificativa:** DoD: "Cada critério de aceitação tem um teste que o comprova". Critério: "publicadas em `/api/v1/` com exatamente as chaves, os tipos e os valores do DATA-MODEL".
- **Consequência:** se uma coleção do site mudar de forma, quem avisa é o `astro check` ou o build, não um teste. Isso é aceitável porque o build falha pelo esquema, mas o critério depende dessa rede de segurança.
- **Correção sugerida:** manter como está e registrar no PR que o build é a verificação da rota. Se quiser, adicionar um teste de `getStaticPaths` que confira as seis chaves.

## Qualidade

### Q1 — A rota recarrega e revalida tudo a cada coleção

- **Gravidade:** Menor
- **Local:** src/pages/api/v1/[colecao].json.ts:22-34
- **Problema:** cada uma das 6 páginas gera o `GET` completo: lê todas as coleções e monta e valida os seis arquivos, para devolver só um.
- **Justificativa:** duplicação de trabalho, só no build. O efeito colateral é bom, porque qualquer arquivo inválido ou id repetido derruba o build em qualquer rota.
- **Consequência:** custo desprezível hoje. Se o build passar a ter fontes mais pesadas, vai pesar.
- **Correção sugerida:** opcional. Montar uma vez, com um módulo-nível memoizado, e devolver a fatia pedida.

## Não verificado

- O critério manual de R4 e R5 (CORS de qualquer origem, revalidação a cada leitura, e uma gravação do painel aparecendo em até 2 minutos) depende do endereço publicado e do registro no PR. Não há `vercel.json` nem cabeçalhos no repositório. A spec (linha 215) diz que `/api/*.json` já sai com esses cabeçalhos, e a nova rota é estática do mesmo modo. Não consegui confirmar isso pelos arquivos.
- Não rodei testes, lint, `astro check` nem build. Não li o ADR 0001 nem o `docs/PROCESS.md` por inteiro, e não há emenda nem `APPROVALS` no diff que exija conferência.
- Os valores reais (dígitos do WhatsApp, `duracaoMin`, `diaSemana` coagido para número) só foram conferidos pelo esquema do contrato. O esquema aceita `src/content/igreja.json` (whatsapp `5521994034141`), mas não rodei o build com o conteúdo real.
