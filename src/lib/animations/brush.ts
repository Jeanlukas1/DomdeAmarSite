import { gsap } from './motion';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

// [data-brush]: a pincelada se desenha da esquerda para a direita ao entrar na tela.
export function initBrush(root: ParentNode = document) {
  root.querySelectorAll<SVGSVGElement>('[data-brush]').forEach((svg) => {
    const paths = svg.querySelectorAll('path');
    gsap.set(svg, { opacity: 1 });
    gsap.fromTo(
      paths,
      { drawSVG: '0%' },
      {
        drawSVG: '100%',
        duration: 0.9,
        ease: 'power2.inOut',
        stagger: 0.15,
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
      },
    );
  });
}
