# Contexto do projeto

O que este produto é e para quem. Documento curto (até uma página) e vivo: atualize-o no mesmo PR que mudar o que ele descreve. Requisitos detalhados ficam nas especificações em `docs/specs/`.

## Produto

Site oficial da Igreja Evangélica Dom de Amar (Jaconé, Saquarema/RJ). É estático, mobile-first e animado. O conteúdo e os tokens de design ficam em JSON/MD para serem reaproveitados num app futuro (lives). O plano e as fases estão em `docs/README.md`.

## Usuários

- **Visitantes e frequentadores:** leem o site.
- **Administrador:** o voluntário que mantém o site. É o único que usa o painel (Keystatic).
- **App da igreja (DomdeAmarApp):** lê o conteúdo que o site publica em `/api/v1` e marca a transmissão pela entrada do site. O filmmaker marca "ao vivo" por uma tela do app, sem conta no painel.

O vocabulário segue o `GLOSSARY.md` do repositório do app.

## Objetivos

- Lighthouse mobile ≥ 95.
- Ser a fonte única do conteúdo do app: nada é cadastrado duas vezes.
- Exigir o mínimo de pessoas não técnicas: o que puder ser automático é automático.

## Fora de escopo

A preencher na primeira descoberta.

## Restrições

- Idioma do site, dos textos e dos docs: pt-BR.
- Nenhum texto ou dado fixo em componentes: todo o conteúdo vem de `src/content/`.
- O peso de JS importa: nenhuma dependência é instalada sem justificativa.
- Deploy na Vercel.
