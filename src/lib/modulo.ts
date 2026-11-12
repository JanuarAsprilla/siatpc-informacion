/** Nombre del módulo. Cambiarlo aquí lo cambia en el título, el menú, las migas de pan y el inicio. */
export const MODULO = {
  nombre: 'GIC-PA Pesca',
  /** Nombre completo del grupo, tomado de la publicación de MarViva (2016) y de PROCASUR. */
  nombreLargo: 'Grupo Interinstitucional y Comunitario para la Pesca Artesanal del Pacífico norte chocoano',
  /** Se muestra mientras el módulo no esté integrado al SIAT PC; poner '' al integrarlo. */
  sufijo: 'prueba',
} as const;

export const nombreCompleto = (): string => (MODULO.sufijo ? `${MODULO.nombre} (${MODULO.sufijo})` : MODULO.nombre);
