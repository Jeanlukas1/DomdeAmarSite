import { gsap } from './motion';

// data-parallax="0.2" -> desloca 20% da própria altura ao atravessar a tela.
export function initParallax(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax || 0.15);
    gsap.fromTo(
      el,
      { yPercent: speed * 50 },
      {
        yPercent: speed * -50,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}
