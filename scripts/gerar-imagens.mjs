// Gera public/og-image.jpg (1200×630, prévia de link no WhatsApp/Facebook) e
// public/apple-touch-icon.png (180×180) a partir do selo e do conteúdo real.
// Uso: npm run imagens   (precisa do Chrome instalado; CHROME_PATH sobrescreve o caminho)
// Rode de novo quando mudar nome, slogan, endereço ou horários dos cultos.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const raiz = resolve(import.meta.dirname, '..');
const ler = (p) => JSON.parse(readFileSync(join(raiz, p), 'utf8'));
const igreja = ler('src/content/igreja.json').principal;
const cultos = ler('src/content/cultos.json').itens.sort((a, b) => a.ordem - b.ordem);
const tokens = ler('src/design/tokens.json');
const logo = readFileSync(join(raiz, 'src/assets/logo/logo.svg'), 'utf8');
const fonte = (pkg, arq) =>
  pathToFileURL(join(raiz, 'node_modules/@fontsource-variable', pkg, 'files', arq)).href;

const cor = (nome) => tokens.color[nome];

const hora = (h) => h.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
// "Terça 19h · Domingo 9h e 18h"
const porDia = new Map();
for (const c of cultos) porDia.set(c.dia, [...(porDia.get(c.dia) ?? []), hora(c.hora)]);
const horarios = [...porDia].map(([dia, hs]) => `${dia} ${hs.join(' e ')}`).join(' · ');
const { bairro, cidade, uf } = igreja.endereco;
const [linha1, linha2] = [
  igreja.nome.replace(/\s*Dom de Amar$/, ''),
  igreja.nome.match(/Dom de Amar$/)?.[0] ?? igreja.nome,
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fraunces;src:url(${fonte('fraunces', 'fraunces-latin-opsz-normal.woff2')})}
@font-face{font-family:Manrope;src:url(${fonte('manrope', 'manrope-latin-wght-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:Manrope;color:#fff8f3;
  background:radial-gradient(ellipse 70% 90% at 28% 50%,${cor('wine-900')} 0%,${cor('wine-950')} 55%,${cor('night')} 100%);
  display:flex;align-items:center;gap:64px;padding:0 80px}
.selo{width:430px;height:430px;flex:none;border-radius:50%;box-shadow:0 30px 80px -20px rgba(20,7,8,.8)}
.selo svg{width:100%;height:100%}
.l1{font-size:22px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#f7e3e1}
h1{font-family:Fraunces;font-weight:500;font-size:96px;line-height:1;letter-spacing:-.02em;margin-top:10px;font-variation-settings:'opsz' 144}
.slogan{font-size:26px;color:#f7e3e1;margin-top:22px;max-width:560px;line-height:1.35}
.info{margin-top:34px;font-size:24px;font-weight:600;display:flex;flex-direction:column;gap:8px}
.info span{color:#f7e3e1;font-weight:400}
</style></head><body>
<div class="selo">${logo}</div>
<div><p class="l1">${linha1}</p><h1>${linha2}</h1><p class="slogan">${igreja.slogan}</p>
<p class="info">${horarios}<span>${bairro}, ${cidade} – ${uf}</span></p></div>
</body></html>`;

const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const pagina = join(tmp, 'og.html');
const png = join(tmp, 'og.png');
writeFileSync(pagina, html);
const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
execFileSync(chrome, [
  '--headless=new',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--virtual-time-budget=3000',
  `--screenshot=${png}`,
  pathToFileURL(pagina).href,
]);
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(join(raiz, 'public/og-image.jpg'));

// ícone do iPhone: o selo sobre fundo branco (iOS não aceita SVG nem transparência bem)
await sharp(Buffer.from(logo), { density: 300 })
  .resize(160, 160)
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(join(raiz, 'public/apple-touch-icon.png'));

console.log('public/og-image.jpg e public/apple-touch-icon.png gerados');
