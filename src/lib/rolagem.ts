// Pausa/retoma o smooth scroll (Lenis) sem importar o Lenis: menu e lightbox usam isto, e o
// Lenis só é carregado depois da primeira pintura (ver lib/agendar.ts).

interface Pausavel {
  stop(): void;
  start(): void;
}

let instancia: Pausavel | undefined;

export const registrarRolagem = (l: Pausavel) => {
  instancia = l;
};
export const pausarRolagem = () => instancia?.stop();
export const retomarRolagem = () => instancia?.start();
