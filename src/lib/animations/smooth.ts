import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from './motion';
import { registrarRolagem } from '../rolagem';

let lenis: Lenis | undefined;

/** Smooth scroll sincronizado com o ScrollTrigger. Âncoras descontam o header fixo. */
export function initSmoothScroll() {
  lenis = new Lenis({ autoRaf: false, anchors: { offset: -80 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  registrarRolagem(lenis);
  return lenis;
}
