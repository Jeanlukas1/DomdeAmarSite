# Revisão do ticket #8

- **Data:** 2026-11-22
- **Issue:** #8
- **Nível:** Crítico
- **Base:** `18f62d6` (`origin/main`)
- **Head revisado:** `bd9d560`
- **Lentes:** conformidade, qualidade
- **Modelo do revisor:** claude-opus-5-5 (agente `eng:reviewer`)
- Lentes de segurança e arquitetura não executadas nesta versão do processo; essa leitura cabe ao humano.

---

## Veredito

Aprovado com ressalvas — 0 bloqueador(es), 1 importante(s), 2 menor(es).

## Conformidade

### C1 — Critério R22 e a regra de "sem JS" não têm teste, e o Hero sem JS ignora cancelamentos

- **Gravidade:** Importante
- **Local:** src/components/sections/Hero.astro (texto da grade semanal, `gradeSemanal`); src/lib/encontros.test.ts (sem teste de apresentação)
- **Problema:** O critério diz "As indicações ficam legíveis sem JavaScript e com menos movimento" (R22). Nos Cultos e na Agenda as marcas saem no HTML, mas nada no diff verifica isso. No Hero, sem JS, continua a grade fixa "Terça 19h · Domingo 9h e 18h", sem cancelamento nem horário novo. O brief aprovado aceita isso, mas R20 diz "O próximo culto anunciado no site nunca é um encontro ou evento cancelado".
- **Justificativa:** R20 e R22 da spec; critério 4 da issue. A Definição de concluído exige "Cada critério de aceitação tem um teste que o comprova".
- **Consequência:** Uma regressão na marca no HTML (por exemplo, esconder por padrão) passa em todos os testes. O Lighthouse e a conferência em 375, 768 e 1440 px não aparecem no diff, e não há evidência deles.
- **Correção sugerida:** Registrar no PR o resultado do Lighthouse e da conferência manual. Ou deixar explícito, com aprovação do usuário, que a grade sem JS é um desvio aceito de R20. Se possível, cobrir `MarcaAlteracao` com um teste de renderização (container API do Astro).

## Qualidade

### Q1 — Variável local esconde a função `comAlteracao`

- **Gravidade:** Menor
- **Local:** src/lib/encontros.ts, em `situacaoDaSemana` (`const comAlteracao = [...]`)
- **Problema:** O nome já é o da função `comAlteracao(vez, alteracao)` declarada no mesmo módulo. Um editor futuro pode se confundir ou chamar a coisa errada.
- **Justificativa:** Nome enganoso (smell).
- **Consequência:** Baixo risco hoje, mas dificulta a leitura.
- **Correção sugerida:** Renomear a variável para `vezesAlteradas` ou `comMarca`.

### Q2 — Prefixo vazio no rótulo do próximo encontro e `data-alteracao-data` desatualizado

- **Gravidade:** Menor
- **Local:** src/components/sections/Cultos.astro, no script, trecho `box?.dataset.as ?? ''` (cerca da linha 380 do diff); preenchimento da marca do destaque (cerca da linha 416 do diff)
- **Problema:** Se `box` for nulo, o rótulo fica " 11h" sem o "às". No destaque, o JS troca rótulo, linha e mensagem mas não atualiza o atributo `data-alteracao-data` da marca. O atributo guarda a data do build.
- **Justificativa:** Tratamento de borda incompleto; atributo com valor incoerente com o conteúdo.
- **Consequência:** Hoje não quebra nada visível, porque o destaque fica fora de `lista`. Qualquer código futuro que leia esse atributo vai ler a data errada.
- **Correção sugerida:** Ler `data-as` do `lista`, que sempre existe nesse ponto. Atualizar o atributo `data-alteracao-data` junto com o resto da marca.

Também há um desvio pequeno do brief. O brief lista "na/no" entre os textos fixos de `ui.json`, e `linhaDaAlteracao` emite o local cru ("· Praça"). É só uma divergência de texto, sem impacto funcional.

## Não verificado

- Lighthouse mobile ≥ 95, apresentação em 375, 768 e 1440 px e `prefers-reduced-motion`: não há evidência no diff.
- Se `npm test`, `npm run lint` e `npm run build` passam: não consegui executar nada.
- `docs/DATA-MODEL.md` e `GLOSSARY.md` não aparecem no diff. Não abri esses arquivos para confirmar que continuam verdadeiros.
- Não abri `docs/PROCESS.md`, nem `docs/APPROVALS.md` (a spec não é amendada pelo diff, então não era necessário).
