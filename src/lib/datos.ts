import entidadesJson from '../data/entidades.json';
import documentosJson from '../data/documentos.json';
import noticiasJson from '../data/noticias.json';
import tematicasJson from '../data/tematicas.json';

export type Dato = { k: string; v: string; href: string | null };
export type Entidad = { slug: string; nombre: string; sigla: string; tipo: string; logo: string | null; acerca: string; datos: Dato[] };
export type Archivo = { nombre: string; url: string; tipo: string; bytes: number | null };
export type Documento = { id: string; entidad: string; categoria: string; titulo: string; desc: string; fecha: string | null; archivos: Archivo[] };
export type Bloque = { t: 'p'; x: string } | { t: 'h'; x: string } | { t: 'img'; src: string } | { t: 'ul'; items: string[] };
export type Noticia = { id: string; entidad: string; titulo: string; autor: string; fecha: string | null; portada: string | null; bloques: Bloque[]; tematicas: string[] };

export const entidades = entidadesJson as Entidad[];
export const documentos = documentosJson as Documento[];
export const TEMATICAS = tematicasJson as string[];
/** Noticias de la más nueva a la más antigua. */
export const noticias = [...(noticiasJson as Noticia[])].sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));

export const entidadPorSlug = (slug: string) => entidades.find((e) => e.slug === slug);
export const documentosDe = (slug: string) => documentos.filter((d) => d.entidad === slug);
export const noticiaPorId = (id: string) => noticias.find((n) => n.id === id);
export const cuenta = <T,>(lista: T[], pred: (x: T) => boolean) => lista.filter(pred).length;
