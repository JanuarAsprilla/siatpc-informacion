import { VISTA_COMPLETA, acercarVista, limitarVista, vistaDeCaja } from '../lib/vista.js';

const PASO_BOTON = 1.6;
const PASO_RUEDA = 1.25;
const PASO_DOBLE_CLIC = 2;
const PASO_TECLA_PX = 48;
const ESCRITORIO = '(min-width: 992px)';
/** Franja de la ventana en la que un capítulo se considera «el que se lee». En celular queda bajo el mapa fijo. */
const FRANJA = { escritorio: '-45% 0px -45% 0px', movil: '-70% 0px -16% 0px' };

const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) || 1;

function iniciar(raiz) {
  const cajas = JSON.parse(raiz.dataset.cajas);
  const q = (sel) => raiz.querySelector(sel);
  const escenario = q('[data-stage]');
  const camara = q('[data-camara]');
  const foco = q('[data-foco]');
  const mini = q('[data-mini]');
  const miniVista = q('[data-mini-vista]');
  const pie = q('[data-pie]');
  const fijo = q('[data-sticky]');
  const capitulos = [...raiz.querySelectorAll('[data-i]')];
  const grupos = [...raiz.querySelectorAll('[data-grupo]')];
  const botonesIndice = [...raiz.querySelectorAll('[data-ir]')];
  const chips = [...raiz.querySelectorAll('[data-area]')];
  const botonPantalla = q('[data-accion="pantalla"]');
  const etiquetas = botonesIndice.map((b) => b.textContent.trim());

  let estado = { actual: 0, foco: null, vista: VISTA_COMPLETA, ancho: 0, alto: 0 };
  const punteros = new Map();
  let gesto = null;

  const vistaDe = (id, ancho, alto) => (id ? vistaDeCaja(cajas[id], ancho, alto) : VISTA_COMPLETA);

  function cambiar(parcial) {
    estado = { ...estado, ...parcial };
    pintar();
  }

  // La imagen de alta resolución se baja la primera vez que se acerca el mapa y reemplaza a la base sin parpadeo.
  let hdCargada = false;
  function cargarHd() {
    hdCargada = true;
    const img = camara.querySelector('img');
    const hd = new Image();
    hd.onload = () => { img.src = hd.src; };
    hd.src = img.dataset.hd;
  }

  function pintar() {
    const { vista, ancho } = estado;
    camara.style.transform = vista.z === 1 ? '' : `translate(${vista.tx}px, ${vista.ty}px) scale(${vista.z})`;
    camara.style.setProperty('--z', vista.z);
    escenario.toggleAttribute('data-zoom', vista.z > 1);
    escenario.style.touchAction = vista.z > 1 ? 'none' : 'pan-y';

    if (estado.foco) {
      const [x0, y0, x1, y1] = cajas[estado.foco];
      Object.assign(foco.style, { left: `${x0 * 100}%`, top: `${y0 * 100}%`, width: `${(x1 - x0) * 100}%`, height: `${(y1 - y0) * 100}%` });
    }
    foco.toggleAttribute('data-on', Boolean(estado.foco));

    mini.hidden = vista.z <= 1.02 || !ancho;
    if (!mini.hidden) {
      Object.assign(miniVista.style, {
        left: `${(-vista.tx / (estado.ancho * vista.z)) * 100}%`,
        top: `${(-vista.ty / (estado.alto * vista.z)) * 100}%`,
        width: `${100 / vista.z}%`,
        height: `${100 / vista.z}%`,
      });
    }

    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.area === estado.foco)));
    grupos.forEach((g, i) => g.toggleAttribute('data-activo', i === estado.actual));
    capitulos.forEach((c, i) => c.toggleAttribute('data-activo', i === estado.actual));
    botonesIndice.forEach((b, i) => (i === estado.actual ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
    if (vista.z > 1 && !hdCargada) cargarHd();
    pie.textContent = `Mapa ${estado.actual + 1} de ${capitulos.length}: ${etiquetas[estado.actual]}.`;
  }

  function mostrarCapitulo(i) {
    if (i === estado.actual) return;
    const id = capitulos[i].dataset.foco || null;
    cambiar({ actual: i, foco: id, vista: vistaDe(id, estado.ancho, estado.alto) });
  }

  function alternarFoco(id) {
    const nuevo = estado.foco === id ? null : id;
    cambiar({ foco: nuevo, vista: vistaDe(nuevo, estado.ancho, estado.alto) });
  }

  function acercar(factor, cx = estado.ancho / 2, cy = estado.alto / 2) {
    cambiar({ vista: acercarVista(estado.vista, factor, cx, cy, estado.ancho, estado.alto) });
  }

  function mover(dx, dy) {
    if (estado.vista.z <= 1) return;
    const { vista, ancho, alto } = estado;
    cambiar({ vista: limitarVista({ ...vista, tx: vista.tx + dx, ty: vista.ty + dy }, ancho, alto) });
  }

  const posicion = (e) => {
    const r = escenario.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const esControl = (e) => e.target.closest('[data-ctl], [data-mini]') !== null;

  // --- medida del recuadro
  new ResizeObserver(() => {
    const ancho = escenario.clientWidth;
    const alto = escenario.clientHeight;
    if (!ancho) return;
    cambiar({ ancho, alto, vista: estado.foco ? vistaDe(estado.foco, ancho, alto) : limitarVista(estado.vista, ancho, alto) });
  }).observe(escenario);

  // --- capítulo que se lee
  const consulta = window.matchMedia(ESCRITORIO);
  let observador;
  const armar = () => {
    observador?.disconnect();
    observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && mostrarCapitulo(Number(e.target.dataset.i))),
      { rootMargin: consulta.matches ? FRANJA.escritorio : FRANJA.movil },
    );
    capitulos.forEach((c) => observador.observe(c));
  };
  armar();
  consulta.addEventListener('change', armar);

  const ir = (i) => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    capitulos[i].scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth', block: consulta.matches ? 'center' : 'start' });
  };
  q('[data-iniciar]').addEventListener('click', () => ir(0));
  botonesIndice.forEach((b) => b.addEventListener('click', () => ir(Number(b.dataset.ir))));
  chips.forEach((c) => c.addEventListener('click', () => alternarFoco(c.dataset.area)));

  // --- controles
  const acciones = {
    acercar: () => acercar(PASO_BOTON),
    alejar: () => acercar(1 / PASO_BOTON),
    completa: () => cambiar({ foco: null, vista: VISTA_COMPLETA }),
    pantalla: () => (document.fullscreenElement ? document.exitFullscreen() : fijo.requestFullscreen()),
  };
  raiz.querySelectorAll('[data-accion]').forEach((b) => b.addEventListener('click', () => acciones[b.dataset.accion]()));

  if (document.fullscreenEnabled) {
    botonPantalla.hidden = false;
    document.addEventListener('fullscreenchange', () => {
      const activa = document.fullscreenElement === fijo;
      botonPantalla.setAttribute('aria-label', activa ? 'Salir de pantalla completa' : 'Pantalla completa');
      botonPantalla.title = botonPantalla.getAttribute('aria-label');
      botonPantalla.firstElementChild.className = activa ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen';
    });
  }

  // Ctrl + rueda (o pellizco en el panel táctil): se registra sin pasividad para frenar el zoom del navegador.
  escenario.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const p = posicion(e);
    acercar(e.deltaY < 0 ? PASO_RUEDA : 1 / PASO_RUEDA, p.x, p.y);
  }, { passive: false });

  escenario.addEventListener('pointerdown', (e) => {
    if (esControl(e)) return;
    punteros.set(e.pointerId, posicion(e));
    escenario.setPointerCapture(e.pointerId);
    if (punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      gesto = { tipo: 'pellizco', d: distancia(a, b), vista: estado.vista };
    } else if (estado.vista.z > 1) {
      gesto = { tipo: 'arrastre', x: e.clientX, y: e.clientY, vista: estado.vista };
      escenario.setAttribute('data-arrastre', '');
    }
  });

  escenario.addEventListener('pointermove', (e) => {
    if (!punteros.has(e.pointerId) || !gesto) return;
    punteros.set(e.pointerId, posicion(e));
    const { ancho, alto } = estado;
    if (gesto.tipo === 'pellizco') {
      if (punteros.size < 2) return;
      const [a, b] = [...punteros.values()];
      cambiar({ vista: acercarVista(gesto.vista, distancia(a, b) / gesto.d, (a.x + b.x) / 2, (a.y + b.y) / 2, ancho, alto) });
    } else {
      cambiar({ vista: limitarVista({ ...gesto.vista, tx: gesto.vista.tx + e.clientX - gesto.x, ty: gesto.vista.ty + e.clientY - gesto.y }, ancho, alto) });
    }
  });

  const soltar = (e) => {
    punteros.delete(e.pointerId);
    gesto = null;
    escenario.removeAttribute('data-arrastre');
  };
  escenario.addEventListener('pointerup', soltar);
  escenario.addEventListener('pointercancel', soltar);

  escenario.addEventListener('dblclick', (e) => {
    if (esControl(e)) return;
    const p = posicion(e);
    acercar(PASO_DOBLE_CLIC, p.x, p.y);
  });

  escenario.addEventListener('keydown', (e) => {
    const mapa = {
      '+': () => acercar(PASO_BOTON), '=': () => acercar(PASO_BOTON),
      '-': () => acercar(1 / PASO_BOTON), _: () => acercar(1 / PASO_BOTON),
      0: acciones.completa,
      ArrowLeft: () => mover(PASO_TECLA_PX, 0), ArrowRight: () => mover(-PASO_TECLA_PX, 0),
      ArrowUp: () => mover(0, PASO_TECLA_PX), ArrowDown: () => mover(0, -PASO_TECLA_PX),
    };
    const accion = mapa[e.key];
    if (!accion) return;
    // Con el mapa completo las flechas siguen desplazando la página.
    if (e.key.startsWith('Arrow') && estado.vista.z === 1) return;
    e.preventDefault();
    accion();
  });

  // La miniatura mueve la vista al punto tocado.
  mini.addEventListener('click', (e) => {
    const r = mini.getBoundingClientRect();
    const { vista, ancho, alto } = estado;
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    cambiar({ vista: limitarVista({ ...vista, tx: ancho / 2 - fx * ancho * vista.z, ty: alto / 2 - fy * alto * vista.z }, ancho, alto) });
  });
}

document.querySelectorAll('[data-storymap]').forEach(iniciar);
