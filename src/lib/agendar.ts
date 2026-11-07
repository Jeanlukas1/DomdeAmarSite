// Agendadores sem dependências: as ilhas importam daqui e só puxam o GSAP/Lenis (via import()
// dinâmico) depois da primeira pintura — assim nada pesado é baixado nem executado antes do LCP.

/** true quando o usuário pediu menos movimento — nesse caso nada anima. */
export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Roda `fn` logo depois do primeiro frame pintado. Numa conexão rápida a página inteira termina
 * de carregar antes da primeira pintura, e sem isto o GSAP/ScrollTrigger rodaria antes do h1
 * aparecer (o Lighthouse conta esse trabalho como atraso do LCP).
 */
export function depoisDaPintura(fn: () => void) {
  requestAnimationFrame(() => setTimeout(fn, 0));
}

/**
 * Roda `fn` depois da primeira pintura, quando o navegador estiver ocioso (ou em no máximo
 * `limite` ms). Use para tudo que fica abaixo da dobra.
 */
export function quandoOcioso(fn: () => void, limite = 1500) {
  depoisDaPintura(() => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: limite });
    else setTimeout(fn, 200);
  });
}
