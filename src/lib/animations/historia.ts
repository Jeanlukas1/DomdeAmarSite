// Nossa história: no desktop a seção fica presa e a trilha corre na horizontal, com a pincelada
// se desenhando e as "fotos impressas" caindo no lugar. No celular, a linha vermelha desce com o
// scroll. Com reduced-motion nada disso roda: fica o layout empilhado, estático.
// Trilha e pincelada são navegação (scrub nos dois sentidos); as fotos caem uma vez só.
import { gsap, quandoOcioso, ScrollTrigger } from './motion';
import { semPulo } from './umaVez';
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
    // o pin nasce depois do salto para uma âncora (ex.: /#cultos): sem semPulo, o espaço da trilha
    // empurraria a página e a pessoa cairia no meio da história
    semPulo(() => montarHorizontal(secao, trilha, linha, prints));
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

function montarHorizontal(
  secao: HTMLElement,
  trilha: HTMLElement,
  linha: SVGPathElement,
  prints: HTMLElement[],
) {
  secao.classList.add('is-horizontal');
  const distancia = () => trilha.scrollWidth - window.innerWidth;
  const paineis = [...secao.querySelectorAll<HTMLElement>('[data-capitulo]')];
  const marcas = [...secao.querySelectorAll<HTMLElement>('[data-indicador]')];
  // ativo = último painel cuja borda esquerda já passou do meio da tela
  const marcarCapitulo = (x: number) => {
    let ativo = -1;
    paineis.forEach((p, i) => {
      if (p.offsetLeft - x < window.innerWidth * 0.55) ativo = i;
    });
    marcas.forEach((m, i) => m.toggleAttribute('data-ativo', i === ativo));
  };

  const corrida = gsap.to(trilha, {
    x: () => -distancia(),
    ease: 'none',
    scrollTrigger: {
      trigger: secao,
      pin: true,
      scrub: 0.8,
      end: () => `+=${distancia()}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => marcarCapitulo(self.progress * distancia()),
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
        // uma vez: subir a página não as levanta de novo
        toggleActions: 'play none none none',
      },
    });
  });

  ScrollTrigger.sort();
}
