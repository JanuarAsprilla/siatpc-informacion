/** Matemática de la vista del mapa: un zoom `z` y un desplazamiento (tx, ty) en píxeles del recuadro. Funciones puras. */
export const Z_MAX = 6;
export const VISTA_COMPLETA = Object.freeze({ z: 1, tx: 0, ty: 0 });

const entre = (n, min, max) => Math.min(max, Math.max(min, n));

/** Mantiene el zoom dentro de [1, Z_MAX] y evita que el borde del mapa entre al recuadro. */
export function limitarVista(v, ancho, alto) {
  const z = entre(v.z, 1, Z_MAX);
  return { z, tx: entre(v.tx, ancho - ancho * z, 0), ty: entre(v.ty, alto - alto * z, 0) };
}

/** Cambia el zoom por `factor` dejando fijo el punto (cx, cy) del recuadro. */
export function acercarVista(v, factor, cx, cy, ancho, alto) {
  const z = entre(v.z * factor, 1, Z_MAX);
  const k = z / v.z;
  return limitarVista({ z, tx: cx - (cx - v.tx) * k, ty: cy - (cy - v.ty) * k }, ancho, alto);
}

/** Vista que encuadra una caja [x0, y0, x1, y1] dada en fracciones (0 a 1) del mapa, con un margen alrededor. */
export function vistaDeCaja(caja, ancho, alto, margen = 1.15) {
  const [x0, y0, x1, y1] = caja;
  const z = entre(Math.min(ancho / ((x1 - x0) * ancho * margen), alto / ((y1 - y0) * alto * margen)), 1, Z_MAX);
  return limitarVista({ z, tx: ancho / 2 - ((x0 + x1) / 2) * ancho * z, ty: alto / 2 - ((y0 + y1) / 2) * alto * z }, ancho, alto);
}
