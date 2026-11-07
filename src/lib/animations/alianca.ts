// Nova aliança — variante "o véu que se rasga" (Mt 27.51). Só transform, opacity e DrawSVG.
//   chegada (top 80% → top, scrub):
//     0    → 0,65  as duas metades do véu se fecham a partir do centro (scaleX)
//     0,55 → 1     uma linha de luz desce pelo meio, de alto a baixo
//   pin de 0,65 tela, com scrub:
//     0    → 0,05  a noite sai de trás (atrás dela já está o creme com o versículo)
//     0,04 → 0,40  o rasgo abre primeiro no alto: cada metade gira a partir do canto de baixo
//     0,30 → 0,85  as metades saem para os lados e revelam o versículo no creme
//     0,85 → 1     o versículo fica sozinho, inteiro, antes de a página seguir
//   Enquanto o véu cobre a tela, o header fica transparente para o rasgo nascer na borda de cima.
// Estados iniciais em CSS (.js-anim) — ver Alianca.astro. Com reduced-motion este módulo nem carrega.
import { gsap, ScrollTrigger } from './motion';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

const secao = document.querySelector<HTMLElement>('[data-alianca]');

// o fallback já desistiu (JS chegou tarde): fica o estado estático
if (
  secao &&
  document.documentElement.classList.contains('js-anim') &&
  !secao.classList.contains('alianca--estatica')
) {
  secao.setAttribute('data-pronto', '');
  iniciar(secao);
}

function iniciar(secao: HTMLElement) {
  const noite = secao.querySelector<HTMLElement>('[data-alianca-noite]')!;
  const esq = secao.querySelector<HTMLElement>('[data-alianca-veu="esq"]')!;
  const dir = secao.querySelector<HTMLElement>('[data-alianca-veu="dir"]')!;
  const linha = secao.querySelector<SVGSVGElement>('[data-alianca-linha]')!;
  const tracoLinha = linha.querySelector('path')!;
  const rasgos = secao.querySelectorAll<SVGSVGElement>('.alianca__rasgo');
  const header = document.querySelector<HTMLElement>('[data-header]');

  // as metades crescem a partir da linha do centro; depois giram pelos cantos de baixo
  gsap.set(esq, { transformOrigin: '100% 100%' });
  gsap.set(dir, { transformOrigin: '0% 100%' });

  // chegada: o véu se fecha enquanto a seção sobe, e a linha de luz já marca onde vai rasgar
  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: secao, start: 'top 80%', end: 'top top', scrub: 0.6 },
    })
    .fromTo([esq, dir], { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }, 0)
    .fromTo(linha, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.55)
    .fromTo(tracoLinha, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.45 }, 0.55);

  const sobreVeu = (sim: boolean) => header?.toggleAttribute('data-sobre-veu', sim);

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: secao,
        start: 'top top',
        end: '+=65%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        // header transparente só enquanto o véu ainda cobre o alto da tela
        onUpdate: (st) => sobreVeu(st.isActive && st.progress < 0.3),
        onToggle: (st) => sobreVeu(st.isActive && st.progress < 0.3),
      },
    })
    // a noite sai de trás do véu já fechado (atrás dela já está o creme com o versículo)
    .to(noite, { opacity: 0, duration: 0.05 }, 0)
    // o rasgo: a borda rasgada acende no lugar da linha de luz e o véu abre primeiro no alto
    .to(rasgos, { opacity: 1, duration: 0.04 }, 0.04)
    .to(linha, { opacity: 0, duration: 0.08 }, 0.06)
    .to(esq, { rotation: -9, duration: 0.36, ease: 'power2.in' }, 0.04)
    .to(dir, { rotation: 9, duration: 0.36, ease: 'power2.in' }, 0.04)
    // as metades saem para os lados e o versículo fica sozinho no creme
    .to(esq, { xPercent: -115, rotation: -16, duration: 0.55, ease: 'power2.in' }, 0.3)
    .to(dir, { xPercent: 115, rotation: 16, duration: 0.55, ease: 'power2.in' }, 0.3)
    .to({}, { duration: 0.15 }, 0.85);

  // o pin pode nascer depois dos gatilhos das seções abaixo: reordena para eles contarem o espaço
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
