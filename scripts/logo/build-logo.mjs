// Gera src/assets/logo/logo.svg em camadas a partir do trace automático (logo-trace.svg).
// Provisório até chegar o arquivo original do designer — ver docs/design-system.md.
//
//   node scripts/logo/build-logo.mjs            -> gera logo.svg
//   node scripts/logo/build-logo.mjs --debug X  -> também gera PNG com camadas coloridas em X
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('../../', import.meta.url);
const SRC = new URL('src/assets/logo/logo-trace.svg', ROOT);
const OUT = new URL('src/assets/logo/logo.svg', ROOT);

const C = { x: 617, y: 616 }; // centro do selo

// ---------- leitura ----------
const svg = readFileSync(SRC, 'utf8');
const shapes = [];
for (const [, fill, d] of svg.matchAll(/<path fill="(#[0-9a-f]+)"[^>]*d="([^"]+)"/g)) {
  for (const sp of d.split(/(?=M )/)) {
    const n = sp.match(/-?\d+(\.\d+)?/g).map(Number);
    const pts = [];
    for (let i = 0; i < n.length; i += 2) pts.push([n[i], n[i + 1]]);
    let a = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % pts.length];
      a += x1 * y2 - x2 * y1;
    }
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const b = {
      x0: Math.min(...xs),
      y0: Math.min(...ys),
      x1: Math.max(...xs),
      y1: Math.max(...ys),
    };
    shapes.push({
      fill,
      pts,
      area: a / 2,
      ...b,
      cx: (b.x0 + b.x1) / 2,
      cy: (b.y0 + b.y1) / 2,
      w: b.x1 - b.x0,
      h: b.y1 - b.y0,
    });
  }
}

// ---------- classificação ----------
const RULES = JSON.parse(readFileSync(new URL('./layers.json', import.meta.url), 'utf8'));
const inBox = (s, [x0, y0, x1, y1]) => s.cx >= x0 && s.cx <= x1 && s.cy >= y0 && s.cy <= y1;
const dist = (s) => Math.hypot(s.cx - C.x, s.cy - C.y);

function classify(s) {
  if (Math.abs(s.area) > 1e6) return 'borda';
  for (const o of RULES.overrides) {
    if (Math.abs(s.x0 - o.x0) <= 2 && Math.abs(s.y0 - o.y0) <= 2 && s.fill === o.fill)
      return o.layer;
  }
  if (s.cy > 1095) return 'mini-coracao';
  if (s.cy > 925)
    return s.fill === '#6f0101' && s.cy < 1035
      ? 'slogan-serif'
      : s.fill === '#6f0101' && s.x1 < 440
        ? 'slogan-serif'
        : 'slogan-script';
  if (dist(s) > 480 && s.cy < 420) return 'arco-texto';
  for (const r of RULES.boxes) {
    if ((!r.fill || r.fill.includes(s.fill)) && inBox(s, r.box)) return r.layer;
  }
  return s.cx < 617 ? 'fita-esq' : 'fita-dir';
}
for (const s of shapes) s.layer = classify(s);
// ruído do trace: pontinhos e furos minúsculos
const MIN_AREA = 40;
const NOISY = new Set(['fita-esq', 'fita-dir', 'amar']);
const clean = shapes.filter((s) => !NOISY.has(s.layer) || Math.abs(s.area) >= MIN_AREA);

// ---------- suavização ----------
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let max = 0;
  let idx = 0;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len;
    if (d > max) [max, idx] = [d, i];
  }
  if (max <= eps) return [a, b];
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
}
function simplifyClosed(pts, eps) {
  if (pts.length < 8) return pts;
  // corta no ponto mais distante do primeiro para fechar bem
  let far = 0;
  let fd = 0;
  pts.forEach((p, i) => {
    const d = Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]);
    if (d > fd) [fd, far] = [d, i];
  });
  const A = rdp(pts.slice(0, far + 1), eps);
  const B = rdp([...pts.slice(far), pts[0]], eps);
  return [...A.slice(0, -1), ...B.slice(0, -1)];
}
const f = (v) => +v.toFixed(1);
function smoothPath(raw) {
  const p = simplifyClosed(raw, 1.1);
  const n = p.length;
  if (n < 3) return '';
  const corner = p.map((cur, i) => {
    const prev = p[(i - 1 + n) % n];
    const next = p[(i + 1) % n];
    const a1 = Math.atan2(cur[1] - prev[1], cur[0] - prev[0]);
    const a2 = Math.atan2(next[1] - cur[1], next[0] - cur[0]);
    let t = Math.abs(a2 - a1);
    if (t > Math.PI) t = 2 * Math.PI - t;
    return t > 1.15; // ~66°
  });
  // comandos relativos (c/l) com números compactos -> ~40% menor
  const num = (v) => {
    const s = String(f(v));
    return s.replace(/^(-?)0\./, '$1.');
  };
  const pair = (x, y) => `${num(x)}${y < 0 ? '' : ' '}${num(y)}`;
  let [cx, cy] = [f(p[0][0]), f(p[0][1])];
  let d = `M${cx} ${cy}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const k = 1 / 6;
    const c1 = corner[i] ? p1 : [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = corner[(i + 1) % n]
      ? p2
      : [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    const [ex, ey] = [f(p2[0]), f(p2[1])];
    if (corner[i] && corner[(i + 1) % n]) d += `l${pair(ex - cx, ey - cy)}`;
    else
      d += `c${pair(c1[0] - cx, c1[1] - cy)} ${pair(c2[0] - cx, c2[1] - cy)} ${pair(ex - cx, ey - cy)}`;
    [cx, cy] = [ex, ey];
  }
  return d + 'z';
}

// ---------- montagem ----------
const ORDER = [
  'fita-esq',
  'fita-dir',
  'dom',
  'de',
  'amar',
  'arco-texto',
  'slogan-serif',
  'slogan-script',
  'mini-coracao',
];
const COLORS = ['#de0101', '#a90504', '#6f0101', '#d08383'];
const DEBUG = {
  'fita-esq': '#e6194b',
  'fita-dir': '#f58231',
  dom: '#3cb44b',
  de: '#4363d8',
  amar: '#911eb4',
  'arco-texto': '#42d4f4',
  'slogan-serif': '#000075',
  'slogan-script': '#f032e6',
  'mini-coracao': '#808000',
};

function build(debug = false) {
  const groups = ORDER.map((id) => {
    const inLayer = clean.filter((s) => s.layer === id);
    const paths = COLORS.map((c) => {
      const d = inLayer
        .filter((s) => s.fill === c)
        .map((s) => smoothPath(s.pts))
        .join('');
      if (!d) return '';
      const fill = debug ? DEBUG[id] : c;
      const op = debug ? ` opacity="${c === '#de0101' ? 1 : 0.6}"` : '';
      return `<path fill="${fill}"${op} fill-rule="evenodd" d="${d}"/>`;
    }).join('');
    return `<g id="${id}">${paths}</g>`;
  });
  // agrupamentos semânticos para animar
  const g = Object.fromEntries(ORDER.map((id, i) => [id, groups[i]]));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 9 1214 1214" role="img" aria-labelledby="logo-titulo">
<title id="logo-titulo">Igreja Evangélica Dom de Amar — Transformando vidas pelo Poder da Graça</title>
<circle id="fundo" cx="${C.x}" cy="${C.y}" r="602" fill="#fff"/>
<circle id="borda" cx="${C.x}" cy="${C.y}" r="595" fill="none" stroke="#de0101" stroke-width="15.5"/>
<g id="coracao">${g['fita-esq']}${g['fita-dir']}</g>
<g id="nome">${g.dom}${g.de}${g.amar}</g>
${g['arco-texto']}
<g id="slogan">${g['slogan-serif']}${g['slogan-script']}</g>
${g['mini-coracao']}
</svg>
`;
}

writeFileSync(OUT, build());
const counts = Object.fromEntries(
  ORDER.map((id) => [id, clean.filter((s) => s.layer === id).length]),
);
console.log('logo.svg gerado', counts);

const dbgIdx = process.argv.indexOf('--debug');
if (dbgIdx > -1) {
  const { default: sharp } = await import('sharp');
  await sharp(Buffer.from(build(true)))
    .resize(1000)
    .png()
    .toFile(process.argv[dbgIdx + 1]);
  await sharp(Buffer.from(build()))
    .resize(1000)
    .png()
    .toFile(process.argv[dbgIdx + 1].replace('.png', '-final.png'));
  console.log('debug ok');
}
