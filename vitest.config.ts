/// <reference types="vitest/config" />
// Testes com Vitest, usando a mesma configuração de Vite do Astro (atalhos como `@/lib`).
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
