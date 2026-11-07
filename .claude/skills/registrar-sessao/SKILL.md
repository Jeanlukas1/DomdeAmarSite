---
name: registrar-sessao
description: Registra a sessão de trabalho atual em docs/sessoes/AAAA-MM-DD-sessao-NN.md e atualiza o índice e o status das fases em docs/README.md. Use ao final de cada sessão ou quando o usuário pedir para registrar a sessão.
---

# Registrar sessão

1. Descubra a data de hoje e o próximo número: `ls docs/sessoes/` → o maior `sessao-NN` + 1 (começa em 01). Nome: `docs/sessoes/AAAA-MM-DD-sessao-NN.md`.
2. Levante o que mudou nesta sessão, sem reler arquivos inteiros: `git log --oneline` desde o último registro (o hash está no fim da sessão anterior) e `git diff --stat <hash>..HEAD`.
3. Escreva o arquivo, curto (≤ 40 linhas), em pt-BR:

```markdown
# Sessão NN — AAAA-MM-DD

**Objetivo:** <1 linha>
**Fase:** F<n>

## Feito
- <bullet por entrega, com o arquivo principal>

## Decisões
- <decisão + motivo em 1 linha>

## Pendências / próximos passos
- <item>

_Último commit: <hash curto>_
```

4. Em `docs/README.md`: adicione `- [AAAA-MM-DD — sessão NN](sessoes/<arquivo>) — <objetivo>` na seção **Sessões** e atualize as caixas de **Status das fases**.
5. Se surgiram mockups novos, confira se estão em `docs/conteudo-pendente.md`.
6. `npx prettier --write docs` e commit: `docs: registra sessão NN`.
