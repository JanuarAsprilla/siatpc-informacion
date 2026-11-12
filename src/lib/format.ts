const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Fecha en palabras. Acepta fechas completas (AAAA-MM-DD) y parciales (AAAA-MM o AAAA) cuando la fuente no da el día. */
export function fechaLarga(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!m) return String(y);
  if (!d) return `${MESES[m - 1]} de ${y}`;
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

export function peso(bytes?: number | null): string {
  if (!bytes) return '';
  const mb = bytes / 1_000_000;
  return mb >= 1 ? `${mb.toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

/** Texto sin tildes y en minúsculas, para buscar sin que importen los acentos. */
export const normalizar = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Corta en una palabra completa y añade «…» si el texto es más largo que `max`. */
export function resumir(texto: string, max: number): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (limpio.length <= max) return limpio;
  return `${limpio.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

const SIGLAS = new Set(['IIAP', 'SINA', 'SIAT', 'PC', 'IDEAM', 'SIAC', 'PNN', 'ONG', 'TRD', 'PTEP', 'PAAC', 'SECOP', 'MIPG', 'DAFP', 'SGC', 'SIG', 'II', 'III', 'IV', 'NIT', 'SIGEP', 'PETI', 'PINAR', 'SST', 'TIC', 'TI', 'SGSST', 'MECI', 'PQR', 'PQRSD', 'CINDA', 'UTCH', 'GEF', 'REDD', 'FAO', 'CAR', 'ISO', 'PIGD', 'COP', 'FCP', 'FVB', 'IKI', 'POA', 'SEI', 'PTEP', 'MADS', 'ANLA', 'CVC', 'CRC', 'CARDER']);
const PROPIOS: Record<string, string> = {
  choco: 'Chocó', quibdo: 'Quibdó', pacifico: 'Pacífico', colombia: 'Colombia', atrato: 'Atrato', baudo: 'Baudó', buenaventura: 'Buenaventura', tumaco: 'Tumaco', guapi: 'Guapi', bogota: 'Bogotá', cauca: 'Cauca', valle: 'Valle', narino: 'Nariño', antioquia: 'Antioquia', murindo: 'Murindó', riosucio: 'Riosucio', darien: 'Darién', nuqui: 'Nuquí', tribuga: 'Tribugá', cupica: 'Cupica', utria: 'Utría', amazonia: 'Amazonía', jhon: 'John', john: 'John', von: 'Von', neumann: 'Neumann',
};

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function fechaCorta(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!m) return String(y);
  if (!d) return `${MESES_CORTOS[m - 1]} ${y}`;
  return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
}

const CONECTORES = new Set(['de', 'del', 'la', 'el', 'y', 'en', 'con', 'un', 'una', 'los', 'las', 'por', 'para', 'al']);
const SOLO_LETRAS = /[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g;
const suave = (texto: string) => texto.toLowerCase().replace(/[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9]+/g, (w) => (SIGLAS.has(w.toUpperCase()) ? w.toUpperCase() : PROPIOS[normalizar(w)] || w));
const mayuscula = (w: string) => w.replace(/^[A-Za-zÁÉÍÓÚÑÜáéíóúñü]/, (c) => c.toUpperCase());
const esMayus = (w: string) => w.replace(SOLO_LETRAS, '').length >= 2 && w === w.toUpperCase() && /[A-ZÁÉÍÓÚÑÜ]/.test(w);
const esLarga = (w: string) => { const l = w.replace(SOLO_LETRAS, ''); return l.length >= 5 && !SIGLAS.has(l.toUpperCase()); };

/** Baja los tramos en mayúsculas dentro de un texto mixto: los largos a oración, los cortos (nombres) a «Nombre Propio». */
function bajarTramos(s: string): string {
  const t = s.split(' ');
  let i = 0;
  while (i < t.length) {
    if (!esMayus(t[i])) { i++; continue; }
    let j = i;
    while (j < t.length && (esMayus(t[j]) || /^([-–]|[\d.,]+)$/.test(t[j]))) j++;
    const tramo = t.slice(i, j);
    if (tramo.filter(esLarga).length >= 2) {
      const largo = tramo.filter(esMayus).length >= 5;
      for (let k = i; k < j; k++) {
        const b = suave(t[k]);
        t[k] = largo || CONECTORES.has(b.replace(SOLO_LETRAS, '')) ? b : mayuscula(b);
      }
    }
    i = j;
  }
  return t.join(' ');
}

/** Pasa un texto en mayúsculas sostenidas a oración normal, conservando siglas y nombres propios. */
export function lenguajeClaro(s: string): string {
  const letras = s.replace(SOLO_LETRAS, '');
  if (letras.length >= 6 && letras === letras.toUpperCase()) return mayuscula(suave(s));
  return bajarTramos(s);
}

/** Resumen de un documento sin el arranque «Este documento contiene…» y sin gritar en mayúsculas. */
export function limpiarDescripcion(desc: string): string {
  const d = lenguajeClaro(desc.replace(/\s+/g, ' ').trim())
    .replace(/^(este|el presente) (documento|informe) (contiene|presenta|da cuenta de)\s+/i, '')
    .replace(/^documento que (contiene|presenta)\s+/i, '');
  return d.charAt(0).toUpperCase() + d.slice(1);
}

/** Verdadero si la descripción solo repite el título y no aporta nada. */
export function repiteTitulo(titulo: string, desc: string): boolean {
  const limpia = (x: string) => normalizar(x).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const t = limpia(titulo);
  const d = limpia(desc);
  return d.length === 0 || t === d || (d.length < t.length * 1.4 && (t.includes(d) || d.includes(t)));
}
