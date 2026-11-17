/** Nombre del módulo. Cambiarlo aquí lo cambia en el título, el menú, las migas de pan y el inicio. */
export const MODULO = {
  nombre: 'Ventana al Conocimiento Pesquero del Pacífico Norte del Chocó',
  /** Versión corta, para migas de pan y títulos de las páginas interiores. */
  nombreCorto: 'Ventana al Conocimiento Pesquero',
  /** Texto de presentación del inicio, entregado por comunicaciones del GIC-PA. */
  presentacion: {
    saludo: '¡Bienvenidos al repositorio del GIC-PA!',
    parrafos: [
      'Este espacio reúne conocimientos, experiencias, investigaciones y saberes relacionados con la pesca artesanal del Chocó.',
      'Aquí se encuentran documentos, publicaciones y aportes de las instituciones, organizaciones y comunidades que integran el Grupo Interinstitucional y Comunitario de Pesca Artesanal (GIC-PA), una alianza que promueve el trabajo articulado y el fortalecimiento del sector pesquero en el territorio.',
    ],
  },
  /** Se muestra mientras el módulo no esté integrado al SIAT PC; poner '' al integrarlo. */
  sufijo: 'prueba',
} as const;

export const nombreCompleto = (): string => (MODULO.sufijo ? `${MODULO.nombre} (${MODULO.sufijo})` : MODULO.nombre);
