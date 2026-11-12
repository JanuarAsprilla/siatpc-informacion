import entidadesJson from '../data/entidades.json';
import documentosJson from '../data/documentos.json';
import noticiasJson from '../data/noticias.json';
import tematicasJson from '../data/tematicas.json';

export type Dato = { k: string; v: string; href: string | null };
export type Entidad = { slug: string; nombre: string; sigla: string; tipo: string; relacion: 'Miembro' | 'Relacionada'; logo: string | null; fondoLogo?: 'oscuro'; acerca: string; datos: Dato[] };
export type Archivo = { nombre: string; url: string; tipo: string; bytes: number | null };
export type Documento = { id: string; entidad: string; categoria: string; titulo: string; desc: string; fecha: string | null; archivos: Archivo[] };
export type Bloque = { t: 'p'; x: string } | { t: 'h'; x: string } | { t: 'img'; src: string } | { t: 'ul'; items: string[] };
export type Noticia = { id: string; entidad: string; titulo: string; autor: string; fecha: string | null; portada: string | null; bloques: Bloque[]; tematicas: string[]; fuente?: { nombre: string; url: string } };

export const entidades = entidadesJson as Entidad[];
export const documentos = documentosJson as Documento[];
export const TEMATICAS = tematicasJson as string[];
/** Noticias de la más nueva a la más antigua. */
export const noticias = [...(noticiasJson as Noticia[])].sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));

/** Color de cada tipo de documento, tomado de la paleta del logo del SIAT PC. */
const COLOR_CATEGORIA: Record<string, string> = {
  Publicaciones: '#0b8fd6', 'Casos de estudio': '#04a549', Fallos: '#7e3123', Normatividad: '#cb291c',
  Informes: '#084898', Planes: '#bad156', Presupuestos: '#f7ac1d', 'Políticas': '#ed6e0c', Manuales: '#6b5b58',
};
export const colorCategoria = (categoria: string): string => COLOR_CATEGORIA[categoria] ?? '#6b5b58';

export const entidadPorSlug = (slug: string) => entidades.find((e) => e.slug === slug);
export const documentosDe = (slug: string) => documentos.filter((d) => d.entidad === slug);
export const noticiaPorId = (id: string) => noticias.find((n) => n.id === id);
export const cuenta = <T,>(lista: T[], pred: (x: T) => boolean) => lista.filter(pred).length;
