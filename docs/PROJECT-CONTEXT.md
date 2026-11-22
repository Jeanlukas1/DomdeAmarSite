# Contexto do projeto

O que este produto é e para quem. Documento curto (até uma página) e vivo: atualize-o no mesmo PR que mudar o que ele descreve. Requisitos detalhados ficam nas especificações em `docs/specs/`.

## Produto

Site oficial da Igreja Evangélica Dom de Amar (Jaconé, Saquarema/RJ). É estático, mobile-first e animado. O conteúdo e os tokens de design ficam em JSON/MD para serem reaproveitados num app futuro (lives). O plano e as fases estão em `docs/README.md`.

## Usuários

A preencher na primeira descoberta.

## Objetivos

- Lighthouse mobile ≥ 95.
- Conteúdo reaproveitável pelo app (lives).

## Fora de escopo

A preencher na primeira descoberta.

## Restrições

- Idioma do site, dos textos e dos docs: pt-BR.
- Nenhum texto ou dado fixo em componentes: todo o conteúdo vem de `src/content/`.
- O peso de JS importa: nenhuma dependência é instalada sem justificativa.
- Deploy na Vercel.
