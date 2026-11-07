import { gsap } from './motion';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// data-split="words|chars" -> o texto sobe palavra a palavra (ou letra a letra) ao entrar na tela.
export function initSplit(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const type = el.dataset.split === 'chars' ? 'chars' : 'words';
    SplitText.create(el, {
      type: type === 'chars' ? 'words,chars' : 'words',
      mask: type,
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { opacity: 1 });
        return gsap.from(type === 'chars' ? self.chars : self.words, {
          yPercent: 110,
          duration: 0.9,
          stagger: type === 'chars' ? 0.02 : 0.06,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
}
