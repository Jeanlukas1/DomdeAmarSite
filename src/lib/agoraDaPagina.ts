// "Agora" para os cálculos de encontros no navegador. Só no `npm run dev`, `?agora=2026-12-05T22:00`
// (horário de São Paulo) simula outra data para conferir os casos de borda; no build de produção
// o ramo DEV é removido e vale sempre o relógio do visitante.
export function agoraDaPagina() {
  if (import.meta.env.DEV) {
    const simulada = new URLSearchParams(location.search).get('agora');
    const d = simulada ? new Date(`${simulada}:00-03:00`) : undefined;
    if (d && !Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}
