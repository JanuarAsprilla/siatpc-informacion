// Todo el CSS del módulo queda dentro de .gicpa: no afecta a la cabecera, al pie ni a otras páginas del SIAT PC.
const prefijar = require('postcss-prefix-selector');

module.exports = {
  plugins: [
    prefijar({
      prefix: '.gicpa',
      transform(prefijo, selector, prefijado, archivo) {
        if (!/styles[\\/](modulo|inicio|storymap)\.css$/.test(archivo)) return selector;
        // El enlace «Saltar al contenido» queda antes de la cabecera, fuera de .gicpa: se deja sin aislar.
        if (selector.startsWith('.saltar')) return selector;
        return selector === ':root' || selector === 'body' ? prefijo : prefijado;
      },
    }),
  ],
};
