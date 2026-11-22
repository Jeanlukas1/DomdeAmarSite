# Revisão do ticket #6: Cultos gravados com vídeo do Facebook ou do YouTube

- **Data:** 2026-11-22
- **Issue:** #6
- **Nível:** Crítico
- **Base:** 19a9607
- **Commit revisado:** ca951fa
- **Lentes:** conformidade, qualidade
- **Modelo do revisor:** claude-opus-5-5 (agente `eng:reviewer`)
- Lentes de segurança e arquitetura não executadas nesta versão do processo; essa leitura cabe ao humano.

---

## Veredito

Aprovado com ressalvas — 0 bloqueador(es), 2 importante(s), 1 menor(es).

Limite da revisão: li o diff até o fim (1282 linhas), mas não abri `docs/PROCESS.md` nem `docs/DATA-MODEL.md`. Também não executei os testes.

## Conformidade

### C1 — O endereço antigo `/api/mensagens.json` mudou de formato

- **Gravidade:** Importante
- **Local:** `src/pages/api/[colecao].json.ts:1218-1219` (hunk do diff em `src/pages/api/[colecao].json.ts`)
- **Problema:** `mensagens` agora devolve `getCultosGravados()`. Cada item perdeu `youtubeId` e ganhou `video: {plataforma, endereco}`.
- **Justificativa:** R9: "Os endereços antigos (`/api/mensagens.json`…) só deixam de existir depois que o app passar a ler `/api/v1`." Até lá, o app ainda lê o endereço antigo.
- **Consequência:** O app atual, que ainda lê o endereço antigo, deixa de achar `youtubeId`. Nenhum teste cobre esse endereço.
- **Correção sugerida:** Manter o formato antigo no endereço legado, derivando `youtubeId` de `idDoYoutube` e deixando `null` nos demais casos. Se a quebra for aceita, registrar isso no PR ou na spec. O que tenho é o comentário no código, que só diz "vem dos cultos gravados".

### C2 — Nenhum teste cobre a regra de destaque no ponto em que ela é aplicada no site

- **Gravidade:** Menor
- **Local:** `src/components/sections/Assista.astro:430-431`
- **Problema:** `escolherDestaque` tem teste. A lista, porém, é montada com `filter((c) => c.id !== destaque?.id).slice(0, 3)` direto no componente, sem teste.
- **Justificativa:** Critério: "O destaque … é o culto gravado mais recente que não seja provisório. Sem nenhum, … 'em breve'."
- **Consequência:** O brief diz que a lista é "sem repetir o do destaque" e limitada a 3 itens, e essa regra só se confere no navegador.
- **Correção sugerida:** Extrair a seleção da lista como função pura, ao lado de `escolherDestaque`, e testá-la.

## Qualidade

### Q1 — Cache em nível de módulo no endpoint v1

- **Gravidade:** Importante
- **Local:** `src/pages/api/v1/[colecao].json.ts:1274-1278`
- **Problema:** `let api; api ??= montar();` guarda a promise para sempre. Se a `montar()` rejeitar (build quebrado pelo contrato), a promise rejeitada fica em cache. No dev, o conteúdo editado no painel Keystatic não reflete até reiniciar o servidor.
- **Justificativa:** Sem padrão documentado violado, mas o risco de estado obsoleto é real. O CLAUDE.md diz que o painel grava direto em `src/content/` durante o dev.
- **Consequência:** Alertas e JSON desatualizados no `npm run dev`. O ganho (alerta uma vez só) é só do build.
- **Correção sugerida:** Limitar o cache ao build com `import.meta.env.PROD`, ou emitir o alerta fora do endpoint.

### Q2 — A regra `acaoDe` duplica a lógica de `VideoDestaque`

- **Gravidade:** Menor
- **Local:** `src/components/sections/Assista.astro:442-448` e `src/components/islands/VideoDestaque.astro:303-304`
- **Problema:** Os dois decidem "YouTube com id, Facebook, ou sem vídeo → página da igreja", cada um por conta própria. `acaoDe` ainda usa `video!`.
- **Consequência:** Uma mudança na regra pode ser feita em um lugar e esquecida no outro.
- **Correção sugerida:** Pôr uma função `acaoDoVideo(video, fallback)` em `src/lib/cultosGravados.ts` e usá-la nos dois.

## Não verificado

- Que as regras de `docs/PROCESS.md` foram seguidas, e se `docs/DATA-MODEL.md` e `docs/ARCHITECTURE.md` precisam de ajuste. O diff não os altera, e eu não os abri.
- A apresentação por plataforma, o foco, a rolagem e o reduced-motion, que o issue manda conferir no navegador.
- Se `npm run build`, os testes e o lint passam.
