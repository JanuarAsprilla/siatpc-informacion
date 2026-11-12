// Carrusel de imágenes y botones de compartir de la página de una noticia.
const carrusel = document.querySelector('[data-carrusel]');
if (carrusel) {
  const pista = carrusel.querySelector('.carrusel__pista');
  const cuenta = carrusel.querySelector('[data-cuenta]');
  const total = pista.children.length;
  const actual = () => Math.round(pista.scrollLeft / pista.clientWidth);
  const ir = (i) => pista.scrollTo({ left: Math.max(0, Math.min(total - 1, i)) * pista.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  carrusel.querySelector('[data-prev]')?.addEventListener('click', () => ir(actual() - 1));
  carrusel.querySelector('[data-next]')?.addEventListener('click', () => ir(actual() + 1));
  const minis = [...document.querySelectorAll('.miniaturas [data-ir]')];
  for (const b of minis) b.addEventListener('click', () => ir(Number(b.dataset.ir)));
  pista.addEventListener('scroll', () => {
    const i = actual();
    if (cuenta) cuenta.textContent = `${i + 1} / ${total}`;
    minis.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
  }, { passive: true });
}

const REDES = {
  facebook: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  x: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
  whatsapp: (u, t) => `https://wa.me/?text=${t}%20${u}`,
  linkedin: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
};
const zona = document.querySelector('[data-compartir]');
if (zona) {
  const titulo = encodeURIComponent(zona.dataset.titulo ?? document.title);
  const aviso = zona.querySelector('[data-aviso]');
  for (const b of zona.querySelectorAll('[data-red]')) {
    b.addEventListener('click', () => window.open(REDES[b.dataset.red](encodeURIComponent(location.href), titulo), '_blank', 'noopener,noreferrer'));
  }
  zona.querySelector('[data-copiar]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      aviso.textContent = 'Enlace copiado';
    } catch {
      aviso.textContent = 'No se pudo copiar. Copie la dirección desde la barra del navegador.';
    }
    setTimeout(() => { aviso.textContent = ''; }, 3500);
  });
}
