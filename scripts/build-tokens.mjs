// Converte src/design/tokens.json em variáveis do Tailwind v4 (@theme).
import { readFile, writeFile } from 'node:fs/promises';

const src = new URL('../src/design/tokens.json', import.meta.url);
const out = new URL('../src/styles/tokens.css', import.meta.url);
const tokens = JSON.parse(await readFile(src, 'utf8'));

// grupo do JSON -> namespace de variável do Tailwind
const ns = {
  color: 'color',
  font: 'font',
  radius: 'radius',
  ease: 'ease',
  duration: 'duration',
  tracking: 'tracking',
};

const lines = [
  '/* GERADO por scripts/build-tokens.mjs — edite src/design/tokens.json */',
  '@theme {',
];
for (const [group, prefix] of Object.entries(ns)) {
  for (const [name, value] of Object.entries(tokens[group] ?? {})) {
    lines.push(`  --${prefix}-${name}: ${value};`);
  }
}
lines.push('}', '');
await writeFile(out, lines.join('\n'));
console.log('tokens.css gerado');
