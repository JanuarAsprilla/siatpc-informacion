/** Nombre del módulo. Cambiarlo aquí lo cambia en el título, el menú, las migas de pan y el inicio. */
export const MODULO = {
  nombre: 'Módulo de biodiversidad',
  /** Se muestra mientras el módulo no esté integrado al SIAT PC; poner '' al integrarlo. */
  sufijo: 'prueba',
} as const;

export const nombreCompleto = (): string => (MODULO.sufijo ? `${MODULO.nombre} (${MODULO.sufijo})` : MODULO.nombre);
