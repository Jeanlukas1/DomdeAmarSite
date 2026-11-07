import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export { gsap, ScrollTrigger };

/** true quando o usuário pediu menos movimento — nesse caso nada anima. */
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** true em dispositivos com mouse (para efeitos de hover/parallax de ponteiro). */
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Roda `fn` quando o navegador estiver ocioso (ou em no máximo `limite` ms). Use para tudo que
 * fica abaixo da dobra: libera a thread principal para pintar o hero e o h1 (LCP) primeiro.
 */
export function quandoOcioso(fn: () => void, limite = 1500) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: limite });
  else setTimeout(fn, 200);
}
