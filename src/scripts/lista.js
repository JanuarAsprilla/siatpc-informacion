// Filtros, columnas y paginación para las listas del módulo. El estado vive en la URL (?q=&entidad=&p=&cols=).
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Páginas visibles: todas si son pocas; si no, primera, última y vecinas de la actual con «…» en los saltos. */
export function numerosVisibles(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const cerca = [...new Set([1, total, actual - 1, actual, actual + 1].filter((n) => n >= 1 && n <= total))].sort((a, b) => a - b);
  return cerca.flatMap((n, i) => (i > 0 && n - cerca[i - 1] > 1 ? ['…', n] : [n]));
}

function crearPaginacion(nav, actual, total, alCambiar) {
  nav.replaceChildren();
  if (total <= 1) return;
  const ul = document.createElement('ul');
  const boton = (html, etiqueta, pagina, extra = {}) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = html;
    b.setAttribute('aria-label', etiqueta);
    if (extra.actual) b.setAttribute('aria-current', 'page');
    if (extra.off) b.disabled = true;
    else b.addEventListener('click', () => alCambiar(pagina));
    li.append(b);
    ul.append(li);
  };
  boton('<i class="bi bi-chevron-left" aria-hidden="true"></i>', 'Página anterior', actual - 1, { off: actual === 1 });
  for (const n of numerosVisibles(actual, total)) {
    if (n === '…') {
      const li = document.createElement('li');
      li.innerHTML = '<span class="puntos" aria-hidden="true">…</span>';
      ul.append(li);
    } else boton(String(n), `Página ${n}`, n, { actual: n === actual });
  }
  boton('<i class="bi bi-chevron-right" aria-hidden="true"></i>', 'Página siguiente', actual + 1, { off: actual === total });
  nav.append(ul);
}

function iniciar(raiz) {
  const tam = Number(raiz.dataset.pagina) || 12;
  const sustantivo = raiz.dataset.sustantivo || 'resultados';
  const colsPorDefecto = Number(raiz.dataset.cols) || 3;
  const items = [...raiz.querySelectorAll('[data-item]')];
  const controles = [...raiz.querySelectorAll('[data-control]')];
  const botonesCols = [...raiz.querySelectorAll('[data-cols-btn]')];
  const chipsFiltro = [...raiz.querySelectorAll('[data-chip]')];
  const grid = raiz.querySelector('[data-grid]');
  const estadoEl = raiz.querySelector('[data-estado]');
  const vacioEl = raiz.querySelector('[data-vacio]');
  const navPaginas = raiz.querySelector('[data-paginas]');
  const inicioLista = raiz.querySelector('[data-inicio]') ?? grid;

  const url = new URLSearchParams(location.search);
  const colsUrl = Number(url.get('cols'));
  const estado = { p: Math.max(1, parseInt(url.get('p'), 10) || 1), cols: [1, 2, 3].includes(colsUrl) ? colsUrl : colsPorDefecto };
  for (const c of controles) {
    c.value = url.get(c.dataset.control) ?? '';
    if (c.value !== (url.get(c.dataset.control) ?? '')) c.value = '';
  }

  const valores = () => Object.fromEntries(controles.map((c) => [c.dataset.control, c.dataset.control === 'q' ? norm(c.value.trim()) : c.value]));
  const coincide = (item, v) => Object.entries(v).every(([k, val]) => {
    if (!val) return true;
    if (k === 'q') return (item.dataset.q ?? '').includes(val);
    return (item.dataset[k] ?? '').split('|').includes(val);
  });

  function escribirUrl(v) {
    const params = new URLSearchParams();
    for (const c of controles) if (c.value) params.set(c.dataset.control, c.value);
    if (estado.cols !== colsPorDefecto) params.set('cols', String(estado.cols));
    if (estado.p > 1) params.set('p', String(estado.p));
    const q = params.toString();
    history.replaceState(null, '', `${location.pathname}${q ? `?${q}` : ''}`);
  }

  function pintar() {
    const v = valores();
    const hayFiltro = Object.values(v).some(Boolean);
    const visibles = items.filter((i) => coincide(i, v));
    const lista = visibles.filter((i) => hayFiltro || !i.hasAttribute('data-destacada'));
    const total = Math.max(1, Math.ceil(lista.length / tam));
    estado.p = Math.min(estado.p, total);
    const pagina = new Set(lista.slice((estado.p - 1) * tam, estado.p * tam));
    for (const i of items) i.hidden = !pagina.has(i);

    for (const b of chipsFiltro) {
      const c = controles.find((x) => x.dataset.control === b.dataset.chip);
      if (c) b.setAttribute('aria-pressed', String(c.value === b.dataset.valor));
    }
    if (grid) grid.dataset.cols = String(estado.cols);
    for (const b of botonesCols) b.setAttribute('aria-pressed', String(Number(b.dataset.colsBtn) === estado.cols));

    if (estadoEl) {
      const textos = controles.filter((c) => c.dataset.control !== 'q' && c.value).map((c) => c.selectedOptions[0].textContent.replace(/\s*\(\d+\)$/, ''));
      const partes = [`${visibles.length} de ${items.length} ${sustantivo}`];
      if (textos.length) partes.push(`en «${textos.join('» y «')}»`);
      estadoEl.querySelector('[data-resumen]').textContent = partes.join(' ');
      const limpiar = estadoEl.querySelector('[data-limpiar]');
      if (limpiar) limpiar.hidden = !hayFiltro;
    }
    if (vacioEl) vacioEl.hidden = lista.length > 0;
    if (navPaginas) crearPaginacion(navPaginas, estado.p, total, (n) => { estado.p = n; pintar(); irAlInicio(); });
    escribirUrl(v);
  }

  function irAlInicio() {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    inicioLista.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
  }

  for (const c of controles) c.addEventListener(c.dataset.control === 'q' ? 'input' : 'change', () => { estado.p = 1; pintar(); });
  for (const b of chipsFiltro) b.addEventListener('click', () => {
    const c = controles.find((x) => x.dataset.control === b.dataset.chip);
    if (!c) return;
    c.value = b.dataset.valor;
    estado.p = 1;
    pintar();
  });
  for (const b of botonesCols) b.addEventListener('click', () => { estado.cols = Number(b.dataset.colsBtn); pintar(); });
  for (const b of raiz.querySelectorAll('[data-limpiar]')) b.addEventListener('click', () => { for (const c of controles) c.value = ''; estado.p = 1; pintar(); });
  raiz.querySelector('form')?.addEventListener('submit', (e) => e.preventDefault());
  pintar();
}

for (const raiz of document.querySelectorAll('[data-lista]')) iniciar(raiz);
