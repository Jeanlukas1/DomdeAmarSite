# O conteúdo do app é um contrato próprio e versionado em /api/v1

O app lê do site todo o seu conteúdo, e versões antigas do app podem continuar abertas em celulares por um tempo. Por isso decidimos publicar um formato próprio para o app, documentado em `docs/DATA-MODEL.md` e servido em `/api/v1/`, em vez de expor o formato interno das coleções do site, que muda junto com o layout. Uma mudança que quebre o formato vira `/api/v2`, servida junto com a `v1` até o app migrar.

## Opções consideradas

- **Expor as coleções do site como estão (os `/api/*.json` que existiam):** não exige nada novo. Mas qualquer ajuste no site (renomear um campo, mudar uma foto de lugar) quebraria o app sem aviso, e campos internos como `mock`, `ordem` e `foto` vazariam para o contrato.
- **Remodelar os endereços antigos, sem versão:** fica mais simples, mas não deixa caminho para uma mudança incompatível no futuro.

## Consequências

- Existe uma camada de tradução entre as coleções do site e o que é publicado, com um esquema próprio do contrato.
- O endereço oficial é `https://domdeamar.vercel.app/api/v1/`. Quando o domínio próprio da igreja existir, o endereço `vercel.app` continua respondendo.
