import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './motion';
import { registrarRolagem } from '../rolagem';

let lenis: Lenis | undefined;

/**
 * Smooth scroll sincronizado com o ScrollTrigger. Âncoras descontam o header fixo pelo
 * `scroll-margin-top` das seções (`scroll-mt-20`), que o Lenis já respeita: sem `offset` aqui,
 * senão o desconto dobra (a seção parava 160px abaixo do topo).
 */
export function initSmoothScroll() {
  lenis = new Lenis({ autoRaf: false, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  registrarRolagem(lenis);
  return lenis;
}
