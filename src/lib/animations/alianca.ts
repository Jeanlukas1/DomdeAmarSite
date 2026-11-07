// Nova aliança — variante "o véu que se rasga" (Mt 27.51). Só transform, opacity e DrawSVG.
//   chegada (antes do pin, scrub): as duas metades do véu se fecham a partir do centro (scaleX)
//   pin de 1 tela, com scrub:
//     0    → 0,04  a noite sai de trás (atrás dela já está o creme com o versículo)
//     0,04 → 0,34  uma linha de luz desce pelo meio, de alto a baixo
//     0,36 → 0,58  o rasgo abre primeiro no alto: cada metade gira a partir do canto de baixo
//     0,52 → 0,92  as metades saem para os lados e revelam o versículo no creme
// Estados iniciais em CSS (.js-anim) — ver Alianca.astro. Com reduced-motion este módulo nem carrega.
import { gsap, ScrollTrigger } from './motion';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

const secao = document.querySelector<HTMLElement>('[data-alianca]');

// o fallback do BaseLayout já desistiu (JS chegou tarde): fica o estado estático
if (secao && document.documentElement.classList.contains('js-anim')) iniciar(secao);

function iniciar(secao: HTMLElement) {
  const noite = secao.querySelector<HTMLElement>('[data-alianca-noite]')!;
  const esq = secao.querySelector<HTMLElement>('[data-alianca-veu="esq"]')!;
  const dir = secao.querySelector<HTMLElement>('[data-alianca-veu="dir"]')!;
  const linha = secao.querySelector<SVGSVGElement>('[data-alianca-linha]')!;
  const tracoLinha = linha.querySelector('path')!;
  const rasgos = secao.querySelectorAll<SVGSVGElement>('.alianca__rasgo');

  // as metades crescem a partir da linha do centro; depois giram pelos cantos de baixo
  gsap.set(esq, { transformOrigin: '100% 100%' });
  gsap.set(dir, { transformOrigin: '0% 100%' });

  // chegada: o véu se fecha a partir do centro enquanto a seção sobe
  gsap.fromTo(
    [esq, dir],
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: secao, start: 'top 80%', end: 'top top', scrub: 0.6 },
    },
  );

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: secao,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    })
    // a noite sai de trás do véu já fechado (atrás dela já está o creme com o versículo)
    .to(noite, { opacity: 0, duration: 0.04 }, 0)
    // a linha de luz marca o meio, de alto a baixo
    .set(linha, { opacity: 1 }, 0.04)
    .fromTo(tracoLinha, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.3 }, 0.04)
    // o rasgo: abre primeiro no alto (giro pelos cantos de baixo) e então as metades saem
    .to(linha, { opacity: 0, duration: 0.06 }, 0.38)
    .to(rasgos, { opacity: 1, duration: 0.04 }, 0.36)
    .to(esq, { rotation: -9, duration: 0.22, ease: 'power2.in' }, 0.36)
    .to(dir, { rotation: 9, duration: 0.22, ease: 'power2.in' }, 0.36)
    .to(esq, { xPercent: -115, rotation: -16, duration: 0.4, ease: 'power2.in' }, 0.52)
    .to(dir, { xPercent: 115, rotation: 16, duration: 0.4, ease: 'power2.in' }, 0.52);

  // o pin pode nascer depois dos gatilhos das seções abaixo: reordena para eles contarem o espaço
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
