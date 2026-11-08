// Política de repetição (docs/animacoes.md): movimento que conta uma história acontece uma vez;
// movimento que é navegação (trilha, progresso, selo ↔ header) continua com scrub.
// Helpers para o "uma vez" sem pulo de layout:
//   soParaFrente  — scrub que nunca volta (subir a página não desfaz a animação)
//   semPulo       — cria/destrói pins sem mover o que está na tela (compensa a rolagem)
//   jaPassou      — o elemento já está inteiro acima da tela (entrada por âncora / recarga)
//   concluirAntesDeAncora — clique numa âncora abaixo do elemento conclui a animação antes
import { gsap, ScrollTrigger } from './motion';
import { pularPara } from '../rolagem';

/**
 * Liga `animacao` ao scroll só para frente: guarda o maior progresso já alcançado e anima até ele
 * (com a mesma suavidade de um `scrub`). `concluida` resolve quando a animação chega ao fim.
 */
export function soParaFrente(
  animacao: gsap.core.Animation,
  vars: ScrollTrigger.StaticVars,
  suavidade = 0.6,
) {
  animacao.pause();
  let max = 0;
  let resolver!: () => void;
  const concluida = new Promise<void>((r) => (resolver = r));
  const st = ScrollTrigger.create({
    ...vars,
    onUpdate(self) {
      vars.onUpdate?.(self);
      if (self.progress <= max) return;
      max = self.progress;
      gsap.to(animacao, {
        progress: max,
        duration: suavidade,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => {
          if (max >= 0.999) resolver();
        },
      });
    },
  });
  return { st, concluida };
}

/**
 * A seção no meio da tela (o que a pessoa está olhando): referência para medir o deslocamento.
 * O topo da tela não serve: com a âncora (scroll-margin), o fim da seção anterior fica sob o header.
 */
function ancoraVisivel() {
  const meio = window.innerHeight / 2;
  const secoes = [...document.querySelectorAll<HTMLElement>('section, footer')];
  return (
    secoes.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= meio && r.bottom > meio;
    }) ?? secoes.find((s) => s.getBoundingClientRect().bottom > 0)
  );
}

/**
 * Roda `fn` (que cria ou destrói pins) e devolve a rolagem para que o conteúdo visível fique no
 * mesmo lugar. Ex.: um pin criado depois do salto para /#cultos, ou o véu que colapsa lá em cima.
 */
export function semPulo(fn: () => void) {
  const ancora = ancoraVisivel();
  const antes = ancora?.getBoundingClientRect().top;
  fn();
  ScrollTrigger.refresh();
  if (!ancora || antes === undefined) return;
  const delta = ancora.getBoundingClientRect().top - antes;
  if (Math.abs(delta) > 1) {
    pularPara(window.scrollY + delta);
    ScrollTrigger.update();
  }
}

/** O elemento já está inteiro acima da tela. */
export const jaPassou = (el: Element) => el.getBoundingClientRect().bottom <= 0;

/**
 * Clique numa âncora interna que leva para depois de `el`, estando a pessoa acima de `el`:
 * chama `fn` antes do Lenis calcular o destino (fase de captura). Assim a animação não toca
 * fora de contexto no caminho e o destino já é medido sem o pin.
 */
export function concluirAntesDeAncora(el: HTMLElement, fn: () => void) {
  const ouvir = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
    const alvo = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (!alvo) return;
    const depois = el.compareDocumentPosition(alvo) & Node.DOCUMENT_POSITION_FOLLOWING;
    if (depois && el.getBoundingClientRect().top > 0) {
      document.removeEventListener('click', ouvir, true);
      fn();
    }
  };
  document.addEventListener('click', ouvir, true);
  return () => document.removeEventListener('click', ouvir, true);
}
