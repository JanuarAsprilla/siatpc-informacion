import { defineConfig } from 'astro/config';

// MODULO_BASE: subruta donde se publica el módulo dentro del SIAT PC (p. ej. /informacion/). En la raíz, no definirla.
const base = process.env.MODULO_BASE ?? '/';

export default defineConfig({
  output: 'static',
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
