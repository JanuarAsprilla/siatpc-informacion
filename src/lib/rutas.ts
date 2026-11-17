/**
 * Rutas del módulo. Todo enlace o archivo propio pasa por `ruta()`, así el módulo funciona
 * en la raíz del sitio o bajo una subruta del SIAT PC (por ejemplo /informacion/) con solo
 * cambiar la variable MODULO_BASE al compilar. No escribir rutas absolutas a mano.
 */
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Convierte una ruta interna («/entidades/», «img/x.webp») en una ruta que respeta la base. */
export const ruta = (destino: string): string => (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(destino) ? destino : `${base}/${destino.replace(/^\/+/, '')}`);
