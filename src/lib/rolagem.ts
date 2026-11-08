// Pausa/retoma o smooth scroll (Lenis) sem importar o Lenis: menu e lightbox usam isto, e o
// Lenis só é carregado depois da primeira pintura (ver lib/agendar.ts).
// Também salta a rolagem sem animação (compensar um pin que some, ver animations/umaVez.ts).

interface Pausavel {
  stop(): void;
  start(): void;
  resize?(): void;
  scrollTo?(alvo: number, opcoes: { immediate?: boolean; force?: boolean }): void;
  isScrolling?: unknown;
}

let instancia: Pausavel | undefined;

export const registrarRolagem = (l: Pausavel) => {
  instancia = l;
};
export const pausarRolagem = () => instancia?.stop();
export const retomarRolagem = () => instancia?.start();

/** Vai para `y` no mesmo frame, sem animação (o Lenis mede a página de novo antes). */
export function pularPara(y: number) {
  if (instancia?.scrollTo) {
    instancia.resize?.();
    instancia.scrollTo(y, { immediate: true, force: true });
  } else window.scrollTo(0, y);
}

/** Chama `fn` quando a rolagem parar (sem inércia do Lenis) por ~150 ms. */
export function quandoParar(fn: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const checar = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (instancia?.isScrolling) return checar();
      window.removeEventListener('scroll', checar);
      fn();
    }, 150);
  };
  window.addEventListener('scroll', checar, { passive: true });
  checar();
}
