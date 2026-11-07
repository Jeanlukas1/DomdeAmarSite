// Ponto único de entrada das animações globais (carregado pelo BaseLayout).
// Animações específicas (ex.: hero) ficam em módulos próprios importados pela seção.
import { reduceMotion } from './motion';
import { initReveal } from './reveal';
import { initParallax } from './parallax';
import { initSplit } from './split';
import { initSmoothScroll } from './smooth';

declare global {
  interface Window {
    __animReady?: boolean;
  }
}

window.__animReady = true;

if (!reduceMotion()) {
  initSmoothScroll();
  initReveal();
  initParallax();
  initSplit();
}
