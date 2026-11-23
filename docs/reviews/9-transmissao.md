# Revisão do ticket #9

- **Data:** 2026-11-22
- **Issue:** #9
- **Nível:** Crítico
- **Base:** `c933fe9` (`origin/main`)
- **Head revisado:** `e6b1728`
- **Lentes:** conformidade, qualidade
- **Modelo do revisor:** sonnet, pela definição do agente `eng:reviewer`
- Lentes de segurança e arquitetura não executadas nesta versão do processo; essa leitura cabe ao humano.

---

## Veredito

Aprovado — 0 bloqueador(es), 0 importante(s), 0 menor(es).

## Conformidade

Nenhum achado. Conferi os quatro critérios do issue e os requisitos R1, R11, R14 e R23.

- **Painel (R14):** o singleton `transmissao` está em `keystatic.config.ts` com "ao vivo" (padrão `false`), data e vídeo opcional. A conferência no painel é manual, como o issue prevê.
- **Contrato (R1):** `transmissao` entrou em `esquemaApiV1`, por isso a rota `src/pages/api/v1/[colecao].json.ts` a publica como `/api/v1/transmissao.json` sem outra alteração. Os testes cobrem sem vídeo, com vídeo válido, data ausente e data vazia.
- **Vídeo inválido (R11):** os quatro casos de vídeo inválido são testados. Cada um publica `video: null`, emite um alerta que cita `src/content/transmissao.json` e o motivo, e mantém o resto da transmissão e das outras coleções.
- **Site (R23):** nenhum componente do site usa a coleção. Só `publicacao.ts` a lê. Não há teste para esse critério, mas o site não tem código que a mostre.
- **Documentos vivos:** `docs/DATA-MODEL.md`, que já tinha a linha de `transmissao.json`, ganhou a nota sobre a data vazia. `docs/conteudo.md` ganhou a linha do arquivo.

## Qualidade

Nenhum achado. A lógica em `src/lib/contrato/apiV1.ts` reutiliza `conferirVideo`. Os testes comparam com valores literais e não recalculam o esperado como o código faz.

## Não verificado

- Não executei testes, lint, build nem o painel.
- Não confirmei o helper `publicar` nos testes, nem o comportamento de `getPrincipal` com a chave `data` ausente. O código novo trata `data` ausente, e o teste "aceita a data ausente" cobre a camada de tradução.
