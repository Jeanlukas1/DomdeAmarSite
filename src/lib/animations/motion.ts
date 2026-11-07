import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export { gsap, ScrollTrigger };

/** true quando o usuário pediu menos movimento — nesse caso nada anima. */
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** true em dispositivos com mouse (para efeitos de hover/parallax de ponteiro). */
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
