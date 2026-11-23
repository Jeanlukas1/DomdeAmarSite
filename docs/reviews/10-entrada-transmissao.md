# Revisão da issue #10: Entrada que marca a transmissão ao vivo

- **Data:** 2026-11-22
- **Issue:** #10
- **Nível:** Crítico
- **Base:** `a512041` (`origin/main`)
- **Commit revisado:** `0fd7793`
- **Lentes:** conformidade, qualidade
- **Modelo do revisor:** claude-opus-5-5 (agente `eng:reviewer`)
- Lentes de segurança e arquitetura não executadas nesta versão do processo; essa leitura cabe ao humano.

---

## Veredito

Aprovado com ressalvas — 0 bloqueador(es), 2 importante(s), 2 menor(es).

## Conformidade

Os critérios de R24 a R30 e R32 estão implementados e têm teste que falharia se o critério quebrasse. Verifiquei o rastreamento em `entrada.ts`, `github.ts` e `cultoDoDia.ts`. Verifiquei também que `calendario(..., 1)` devolve só as vezes de hoje (`src/lib/encontros.ts:154`). Sobram dois pontos abaixo.

### C1 — Resposta 500 documentada e sem teste

- **Gravidade:** Importante
- **Local:** `src/lib/transmissao/entrada.ts:1068` e `docs/DATA-MODEL.md` (linha do `500`)
- **Problema:** o ramo `ConteudoInvalido` → 500 não tem teste. Nenhum cenário esvazia `assista.json`, remove `tituloCultoGravadoPadrao`, apaga um arquivo nem entrega JSON quebrado.
- **Justificativa:** a Definição de concluído exige "Cada critério de aceitação tem um teste que o comprova". R26 diz "nada fica gravado pela metade". O contrato novo (500, nada gravado) não é provado.
- **Consequência:** uma regressão nesse ramo escaparia. Num conteúdo incompleto, ela poderia gravar a transmissão sem o culto, ou lançar erro sem tratamento, em produção.
- **Correção sugerida:** adicionar teste com `assista.json` sem o título padrão e vídeo no pedido. Esperar 500, `commitsNovos() === 0` e transmissão intacta.

### C2 — Constante duplicada de duração

- **Gravidade:** Menor
- **Local:** `src/lib/transmissao/cultoDoDia.ts:210`
- **Problema:** `DURACAO_DO_EVENTO = 120` repete `DURACAO_PADRAO` (`src/lib/encontros.ts:58`, não exportada). O comentário diz "o mesmo padrão dos encontros".
- **Justificativa:** R28 usa a "janela" do encontro ou evento.
- **Consequência:** se a duração padrão mudar, a janela dos eventos diverge da do site.
- **Correção sugerida:** exportar e reutilizar a constante de `encontros.ts`.

## Qualidade

### Q1 — Corpo inválido do GitHub vira exceção sem tratamento

- **Gravidade:** Importante
- **Local:** `src/lib/transmissao/github.ts:1124-1127` (`json`) e `:1137` (`r.object.sha`), mais `entrada.ts:1071` (`throw erro`)
- **Problema:** um 200 do GitHub com corpo que não é JSON faz `r.json()` lançar `SyntaxError`. Um JSON sem `object.sha` ou `tree.sha` lança `TypeError`. Nenhum dos dois é `FalhaDoGithub`, então `marcarTransmissao` relança e o Astro devolve um 500 genérico.
- **Justificativa:** R26 e `DATA-MODEL.md`: falha do GitHub responde 502 de erro e nada fica gravado. O `fetch` que cai já é tratado, mas este caso não.
- **Consequência:** o contrato (502 com `{erro}`) é quebrado. O app recebe um 500 sem corpo no formato combinado e pode tratá-lo como "conteúdo incompleto".
- **Correção sugerida:** envolver `r.json()` em try/catch e validar o formato mínimo, lançando `FalhaDoGithub`. Acrescentar um caso de teste.

### Q2 — Corpo do pedido lido sem limite

- **Gravidade:** Menor
- **Local:** `src/lib/transmissao/entrada.ts:897` (`pedido.text()`)
- **Problema:** o corpo só é lido depois do segredo conferido, então o risco é baixo. Ainda assim, não há limite de tamanho para um chamador autenticado.
- **Justificativa:** apenas um endurecimento possível, sem padrão documentado violado.
- **Consequência:** um corpo enorme gasta memória e tempo da função.
- **Correção sugerida:** rejeitar com 400 acima de alguns KB, por exemplo pelo `Content-Length`.

## Não verificado

- O ADR 0002, `docs/APPROVALS.md` e a spec não foram abertos. O diff não adiciona emenda à spec, então não há aprovação a conferir.
- Não conferi o registro da rota pelo `injectRoute` nem a leitura de `process.env` no runtime da Vercel. Isso exige o build e fica para a conferência manual em produção prevista no ticket.
- O dublê do GitHub reproduz a API a partir do que o código usa. O 422 de "não é avanço rápido" e o formato da resposta de `contents` com `Accept: raw` não foram confirmados contra o GitHub real.
- `conferirVideo` (`@/lib/video`) não foi lido.
