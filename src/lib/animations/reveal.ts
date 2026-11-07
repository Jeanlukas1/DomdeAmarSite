import { gsap, ScrollTrigger } from './motion';

// data-reveal="up|left|right|scale|clip"  data-reveal-delay="0.2"
// data-reveal-group (+ data-stagger="0.08") anima os filhos [data-reveal] em sequência.
const FROM: Record<string, gsap.TweenVars> = {
  up: { y: 40 },
  left: { x: -48 },
  right: { x: 48 },
  scale: { scale: 0.92 },
  clip: { clipPath: 'inset(0 0 100% 0)' },
};
const TO: Record<string, gsap.TweenVars> = {
  up: { y: 0 },
  left: { x: 0 },
  right: { x: 0 },
  scale: { scale: 1 },
  clip: { clipPath: 'inset(0 0 0% 0)', clearProps: 'clipPath' },
};

function tween(el: HTMLElement, trigger: Element, delay: number, start: string) {
  const kind = el.dataset.reveal && FROM[el.dataset.reveal] ? el.dataset.reveal : 'up';
  gsap.fromTo(
    el,
    { opacity: 0, ...FROM[kind] },
    {
      opacity: 1,
      ...TO[kind],
      delay: delay + Number(el.dataset.revealDelay ?? 0),
      scrollTrigger: { trigger, start, once: true },
    },
  );
}

export function initReveal(root: ParentNode = document) {
  const grouped = new Set<Element>();

  root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const stagger = Number(group.dataset.stagger ?? 0.08);
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
      grouped.add(el);
      tween(el, group, i * stagger, 'top 85%');
    });
  });

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (!grouped.has(el)) tween(el, el, 0, 'top 88%');
  });

  ScrollTrigger.refresh();
}
