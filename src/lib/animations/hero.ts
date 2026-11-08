// Animação do hero: o selo "se pinta" (borda, texto em arco, fitas do coração, "Dom de Amar",
// slogan e mini-coração), bate como um coração e, no scroll, voa até o logo do header.
// Depende dos ids de camada do logo.svg — ver docs/animacoes.md.
import { gsap, ScrollTrigger, finePointer, reduceMotion } from './motion';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

const NS = 'http://www.w3.org/2000/svg';
const CENTRO = { x: 617, y: 616 };

// Linhas-guia do "pincel" (coordenadas do logo.svg) — cobrem cada fita com um traço largo.
const PINCEL = {
  'fita-esq':
    'M 636 334 C 560 240 470 200 400 222 C 290 250 200 340 206 450 C 212 580 320 680 420 770 C 470 815 500 870 508 935',
  'fita-dir':
    'M 641 327 C 720 240 820 205 920 235 C 1020 270 1065 360 1045 450 C 1030 520 990 575 945 616',
};

function arco(r: number, deg0: number, deg1: number) {
  const p = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(CENTRO.x + r * Math.cos(a)).toFixed(1)} ${(CENTRO.y + r * Math.sin(a)).toFixed(1)}`;
  };
  return `M ${p(deg0)} A ${r} ${r} 0 0 1 ${p(deg1)}`;
}

function svgEl(tag: string, attrs: Record<string, string | number>) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}

/** Máscara com um traço largo; animar o traço (DrawSVG) "pinta" o alvo. */
function pincel(defs: Element, alvo: SVGGElement, d: string, largura: number) {
  const id = `hm-${alvo.id}`;
  const mask = svgEl('mask', {
    id,
    maskUnits: 'userSpaceOnUse',
    x: -100,
    y: -100,
    width: 1450,
    height: 1450,
  });
  const traco = svgEl('path', {
    d,
    fill: 'none',
    stroke: '#fff',
    'stroke-width': largura,
    'stroke-linecap': 'round',
  });
  mask.append(traco);
  defs.append(mask);
  alvo.setAttribute('mask', `url(#${id})`);
  return traco;
}

/** Clip retangular que cresce da esquerda para a direita ("escrita"). */
function escrita(defs: Element, alvo: SVGGElement) {
  const b = alvo.getBBox();
  const pad = 24;
  const id = `hc-${alvo.id}`;
  const clip = svgEl('clipPath', { id, clipPathUnits: 'userSpaceOnUse' });
  const rect = svgEl('rect', {
    x: b.x - pad,
    y: b.y - pad,
    width: 0,
    height: b.height + pad * 2,
  });
  clip.append(rect);
  defs.append(clip);
  alvo.setAttribute('clip-path', `url(#${id})`);
  return { rect, largura: b.width + pad * 2 };
}

function iniciar() {
  const secao = document.querySelector<HTMLElement>('[data-hero]');
  const selo = secao?.querySelector<HTMLElement>('[data-hero-seal]');
  const svg = selo?.querySelector('svg');
  if (!secao || !selo || !svg) return;
  // o fallback do BaseLayout já desistiu (JS chegou tarde): o selo está visível, não reanima
  if (!document.documentElement.classList.contains('js-anim')) return;

  const tilt = selo.querySelector<HTMLElement>('[data-hero-tilt]')!;
  const brilho = secao.querySelector<HTMLElement>('[data-hero-glow]')!;
  const particulas = [...secao.querySelectorAll<HTMLElement>('[data-particula]')];
  const camada = (id: string) => svg.querySelector<SVGGElement>(`#${id}`)!;

  const defs = svgEl('defs', {});
  svg.prepend(defs);

  const borda = camada('borda');
  borda.setAttribute('transform', `rotate(90 ${CENTRO.x} ${CENTRO.y})`); // começa embaixo, fecha no topo
  const tracoArco = pincel(defs, camada('arco-texto'), arco(525, 205, 335), 150);
  const tracoEsq = pincel(defs, camada('fita-esq'), PINCEL['fita-esq'], 170);
  const tracoDir = pincel(defs, camada('fita-dir'), PINCEL['fita-dir'], 170);
  const dom = escrita(defs, camada('dom'));
  const de = escrita(defs, camada('de'));
  const amar = escrita(defs, camada('amar'));
  const slogan = escrita(defs, camada('slogan'));
  const mini = camada('mini-coracao');

  const limpar = () => {
    defs.remove();
    svg.querySelectorAll('[mask],[clip-path]').forEach((n) => {
      n.removeAttribute('mask');
      n.removeAttribute('clip-path');
    });
  };

  gsap.set(svg.querySelectorAll(':scope > :not(defs)'), { opacity: 1 });
  window.__heroReady = true;
  gsap.set(brilho, { opacity: 0, scale: 0.8 });

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: limpar });
  tl.from(
    camada('fundo'),
    {
      scale: 0.92,
      opacity: 0,
      svgOrigin: `${CENTRO.x} ${CENTRO.y}`,
      duration: 0.7,
      ease: 'power3.out',
    },
    0,
  )
    .fromTo(borda, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.4 }, 0.1)
    .to(brilho, { opacity: 0.7, scale: 1, duration: 2.2, ease: 'power1.out' }, 0.2)
    .fromTo(
      tracoArco,
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 1.1, ease: 'power1.inOut' },
      0.35,
    )
    .fromTo(tracoEsq, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2 }, 0.7)
    .fromTo(tracoDir, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.0 }, 0.9)
    .to(dom.rect, { attr: { width: dom.largura }, duration: 0.75, ease: 'power1.inOut' }, 1.6)
    .to(de.rect, { attr: { width: de.largura }, duration: 0.35, ease: 'power1.inOut' }, 2.25)
    .to(amar.rect, { attr: { width: amar.largura }, duration: 0.85, ease: 'power1.inOut' }, 2.5)
    .to(slogan.rect, { attr: { width: slogan.largura }, duration: 0.8, ease: 'power1.inOut' }, 3.0)
    .from(mini, { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(3)' }, 3.5)
    .addLabel('batida', 3.9)
    // batida dupla do coração
    .to(tilt, { scale: 1.045, duration: 0.14, ease: 'power2.out' }, 'batida')
    .to(tilt, { scale: 1, duration: 0.22, ease: 'power2.in' })
    .to(tilt, { scale: 1.025, duration: 0.12, ease: 'power2.out' })
    .to(tilt, { scale: 1, duration: 0.4, ease: 'power2.inOut' })
    .to(
      brilho,
      { opacity: 1, scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' },
      'batida',
    )
    .to(
      mini,
      { scale: 1.35, transformOrigin: '50% 50%', duration: 0.14, yoyo: true, repeat: 1 },
      'batida',
    );

  // carregou já com o hero fora da tela (recarga no meio, âncora): não pinta 4,5 s fora de vista
  if (secao.getBoundingClientRect().bottom <= 0) {
    tl.progress(1, true);
    limpar();
  }

  // faíscas: explosão na batida e depois brasas subindo devagar
  const brasas = gsap.timeline({ paused: true, repeat: -1 });
  particulas.forEach((p) => {
    brasas.fromTo(
      p,
      {
        x: () => gsap.utils.random(-120, 120),
        y: () => gsap.utils.random(-20, 80),
        opacity: 0,
        scale: 1,
      },
      {
        keyframes: [
          { opacity: () => gsap.utils.random(0.4, 0.9), duration: 0.6 },
          { opacity: 0, duration: 1.4 },
        ],
        y: '-=160',
        x: () => `+=${gsap.utils.random(-30, 30)}`,
        ease: 'none',
        duration: 2,
      },
      gsap.utils.random(0, 3),
    );
  });

  tl.add(() => {
    particulas.forEach((p) => {
      const ang = gsap.utils.random(0, Math.PI * 2);
      const dist = gsap.utils.random(140, 260);
      gsap.fromTo(
        p,
        { x: 0, y: -20, opacity: 1, scale: gsap.utils.random(0.6, 1.4) },
        {
          x: Math.cos(ang) * dist,
          y: Math.sin(ang) * dist - 20,
          opacity: 0,
          duration: gsap.utils.random(1, 1.6),
          ease: 'power3.out',
        },
      );
    });
    gsap.delayedCall(1.6, () => brasas.play());
  }, 'batida');

  // pausa as brasas quando o hero sai da tela
  ScrollTrigger.create({
    trigger: secao,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive && tl.progress() === 1 ? brasas.play() : brasas.pause()),
  });

  // inclinação seguindo o mouse
  if (finePointer()) {
    gsap.set(tilt, { transformPerspective: 900 });
    const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3' });
    const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3' });
    const gx = gsap.quickTo(brilho, 'x', { duration: 1.2, ease: 'power3' });
    const gy = gsap.quickTo(brilho, 'y', { duration: 1.2, ease: 'power3' });
    secao.addEventListener('pointermove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry(nx * 14);
      rx(-ny * 10);
      gx(nx * 40);
      gy(ny * 40);
    });
    secao.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
      gx(0);
      gy(0);
    });
  }

  // scroll: o selo encolhe e voa até o logo do header
  const logoHeader = document.querySelector<HTMLElement>('[data-header-logo]');
  const base = selo.parentElement!; // não transformado: serve de referência de medida
  if (logoHeader) {
    const percurso = () => secao.offsetHeight * 0.7;
    const delta = () => {
      const r = base.getBoundingClientRect();
      const t = logoHeader.getBoundingClientRect();
      const topoDoc = r.top + window.scrollY;
      return {
        x: t.left + t.width / 2 - (r.left + r.width / 2),
        y: t.top + t.height / 2 - (topoDoc + r.height / 2 - percurso()),
        s: t.width / r.width,
      };
    };
    gsap
      .timeline({
        scrollTrigger: {
          trigger: secao,
          start: 'top top',
          end: () => `+=${percurso()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      // encolhe rápido no início (sai da frente do texto) e desliza até o header
      .to(selo, { scale: () => delta().s, ease: 'power3.out', duration: 1 }, 0)
      .to(selo, { x: () => delta().x, y: () => delta().y, ease: 'power1.in', duration: 1 }, 0)
      .to(brilho, { opacity: 0, duration: 0.5 }, 0)
      .to(selo, { opacity: 0, duration: 0.06 }, 0.94)
      .to(logoHeader, { opacity: 1, duration: 0.06 }, 0.94);
  }
}

if (!reduceMotion()) {
  try {
    iniciar();
  } catch (err) {
    // nunca deixar o selo invisível
    document.documentElement.classList.remove('js-anim');
    console.error(err);
  }
}
