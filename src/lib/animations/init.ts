// Ponto único de entrada das animações globais (carregado pelo BaseLayout).
// Animações específicas (ex.: hero) ficam em módulos próprios importados pela seção.
import { quandoOcioso, reduceMotion } from './motion';
import { initReveal } from './reveal';
import { initParallax } from './parallax';
import { initSplit } from './split';
import { initSmoothScroll } from './smooth';
import { initBrush } from './brush';

declare global {
  interface Window {
    __animReady?: boolean;
    __heroReady?: boolean;
  }
}

window.__animReady = true;

if (!reduceMotion()) {
  initSmoothScroll();
  // revelações ficam abaixo da dobra: esperam o navegador ficar ocioso (protege o LCP)
  quandoOcioso(() => {
    initReveal();
    initParallax();
    initSplit();
    initBrush();
  });
}
