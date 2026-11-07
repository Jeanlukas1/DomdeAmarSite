import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export { gsap, ScrollTrigger };

/** true em dispositivos com mouse (para efeitos de hover/parallax de ponteiro). */
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export { depoisDaPintura, quandoOcioso, reduceMotion } from '../agendar';
