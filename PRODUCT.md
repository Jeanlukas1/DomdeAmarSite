# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dois públicos com o mesmo peso:

- **Quem ainda não conhece a igreja:** moradores de Jaconé e Saquarema (RJ) e visitantes da região procurando uma igreja. Precisam confiar, saber horário e endereço e entender como é chegar pela primeira vez.
- **Membros que já frequentam:** querem agenda, mensagens, avisos, pedidos de oração e um jeito simples de contribuir.

Na home, quem chega é recebido primeiro. As seções internas atendem o dia a dia dos membros.

## Product Purpose

Site oficial da Igreja Evangélica Dom de Amar. Ele apresenta a igreja, aproxima novas pessoas e serve à comunidade. Todas estas ações contam como sucesso, com a mesma importância:

- a pessoa **vem a um culto**;
- **pede oração ou ajuda** (contato pastoral);
- **contribui com a obra** do novo templo;
- **assiste online** (mensagens hoje, transmissões ao vivo no futuro).

O conteúdo e os tokens de design devem poder ser reaproveitados num app futuro (lives).

## Positioning

É uma igreja centrada na **eleição da Graça**. O anúncio é o da nova aliança estabelecida por Jesus na cruz, em que a Graça substitui a Lei. A mensagem não é de cobrança nem de regras, e sim de amor recebido sem merecimento ("Dom de Amar"). Uma comunidade pequena, de bairro, que está construindo o próprio templo com as próprias mãos (mutirão).

## Operating Context

- Endereço: Rua 94, Lote 21, Quadra 2203 – Jaconé, Saquarema/RJ – CEP 28990-000 (referência: Rua 94 esquina com Rua 19).
- Cultos: terça às 19h (Culto de Oração); domingo às 9h (Estudo da Palavra) e às 18h (Culto da Plenitude do Amor).
- Comunicação atual pelo Facebook (Reels e fotos). Aniversário de 8 anos em 25/jul, com preletor convidado.
- Novo templo em construção, feito em mutirão pelos membros. A igreja passou por um espaço antigo e hoje usa um salão novo.
- Quem edita o conteúdo não é técnico: a edição precisa ser simples (painel Keystatic previsto).

## Capabilities and Constraints

- Stack existente: Astro 7 estático, Tailwind v4, GSAP/Lenis, Content Collections, deploy na Vercel (ver `docs/plano.md`).
- Sem banco de dados nem backend próprio. Formulários por serviço externo (Web3Forms).
- Meta de Lighthouse mobile ≥ 95 e LCP < 2,5 s, com conexões móveis comuns na região.
- **Em aberto (mockups marcados com `mock: true`, listados em `docs/conteudo-pendente.md`):** telefone/WhatsApp, e-mail, Instagram, YouTube, nomes e fotos dos pastores, chave PIX, história detalhada, missão/visão, ministérios, eventos, mensagens/vídeos, depoimentos e data exata de fundação.

## Brand Commitments

- Nome: **Igreja Evangélica Dom de Amar**.
- Bio: "Uma igreja segundo a eleição da Graça de Deus."
- Slogan: "Transformando vidas pelo Poder da Graça".
- Marca oficial: selo circular com coração vermelho e "Dom de Amar" em letra cursiva (`src/assets/logo/`). A chama branca que aparece na arte de horários **não** é usada no site.
- Saudação usada pela igreja: "Graça e Paz!"
- Voz: acolhedora, com o tema da Graça como fio condutor. A linguagem da nova aliança e da Graça tem prioridade sobre linguagem de lei, cobrança ou culpa.

## Evidence on Hand

- 46 fotos reais em `src/assets/fotos/` (obra do novo templo, templo antigo, templo novo, cultos e louvor, oração, comunhão, evento de casais, artes de divulgação). Classificação dos templos confirmada pela igreja.
- Logo: trace vetorial convertido em SVG com camadas. O arquivo original do designer foi solicitado.
- **Não existem e não devem ser inventados como reais:** depoimentos, números de membros, nomes de pessoas nas fotos, dados de contato e chave PIX. Todo provisório fica marcado como mock e com aparência claramente provisória.

## Product Principles

1. **Acolher antes de informar:** quem nunca veio deve se sentir convidado, não avaliado.
2. **A Graça como fio condutor:** textos e chamadas falam de amor recebido, nunca de obrigação.
3. **Verdade da comunidade:** fotos reais, a obra real e pessoas reais. Nada de imagens genéricas ou números inventados.
4. **Leve e rápido no celular:** a maioria chega pelo celular, muitas vezes com dados móveis.
5. **Fácil de manter:** cultos, eventos e mensagens são editados sem programador.

## Accessibility & Inclusion

- Público de todas as idades, incluindo idosos: texto legível, contraste AA, alvos de toque generosos.
- Respeitar `prefers-reduced-motion`. O site é muito animado, mas nada pode depender de animação.
- Não identificar pessoas por nome nas fotos sem autorização.
