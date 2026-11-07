// Nossa história: no desktop a seção fica presa e a trilha corre na horizontal, com a pincelada
// se desenhando e as "fotos impressas" caindo no lugar. No celular, a linha vermelha desce com o
// scroll. Com reduced-motion nada disso roda: fica o layout empilhado, estático.
import { gsap, quandoOcioso, ScrollTrigger } from './motion';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

const secao = document.querySelector<HTMLElement>('[data-historia]');

if (secao) quandoOcioso(() => iniciar(secao));

function iniciar(secao: HTMLElement) {
  const trilha = secao.querySelector<HTMLElement>('[data-track]')!;
  const linha = secao.querySelector<SVGPathElement>('[data-historia-linha]')!;
  const vertical = secao.querySelector<HTMLElement>('[data-historia-vertical]')!;
  const prints = [...secao.querySelectorAll<HTMLElement>('[data-print]')];
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    secao.classList.add('is-horizontal');
    const distancia = () => trilha.scrollWidth - window.innerWidth;

    const corrida = gsap.to(trilha, {
      x: () => -distancia(),
      ease: 'none',
      scrollTrigger: {
        trigger: secao,
        pin: true,
        scrub: 0.8,
        end: () => `+=${distancia()}`,
        invalidateOnRefresh: true,
      },
    });

    gsap.fromTo(
      linha,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: secao,
          start: 'top top',
          end: () => `+=${distancia()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );

    // cada foto "cai" girando até o ângulo final quando entra pela direita
    prints.forEach((p) => {
      gsap.from(p, {
        y: 80,
        rotate: 0,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: p,
          containerAnimation: corrida,
          start: 'left 88%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => secao.classList.remove('is-horizontal');
  });

  mm.add('(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(
      vertical,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: trilha, start: 'top 70%', end: 'bottom 80%', scrub: true },
      },
    );
    prints.forEach((p) => {
      gsap.from(p, {
        y: 50,
        rotate: 0,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: p, start: 'top 88%', once: true },
      });
    });
  });
}
