const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function fechaLarga(iso: string | null): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
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

const SIGLAS = new Set(['IIAP', 'SINA', 'SIAT', 'PC', 'IDEAM', 'SIAC', 'PNN', 'ONG', 'TRD', 'PTEP', 'PAAC', 'SECOP', 'MIPG', 'DAFP', 'SGC', 'SIG', 'II', 'III', 'IV', 'NIT', 'SIGEP', 'PETI', 'PINAR', 'SST', 'TIC', 'TI', 'SGSST', 'MECI', 'PQR', 'PQRSD', 'CINDA', 'UTCH', 'GEF', 'REDD', 'FAO', 'CAR', 'ISO', 'PIGD', 'COP', 'FCP', 'FVB', 'IKI']);
const PROPIOS: Record<string, string> = {
  choco: 'Chocó', quibdo: 'Quibdó', pacifico: 'Pacífico', colombia: 'Colombia', atrato: 'Atrato', baudo: 'Baudó', buenaventura: 'Buenaventura', tumaco: 'Tumaco', guapi: 'Guapi', bogota: 'Bogotá', cauca: 'Cauca', valle: 'Valle', narino: 'Nariño', antioquia: 'Antioquia', murindo: 'Murindó', riosucio: 'Riosucio', darien: 'Darién', nuqui: 'Nuquí', tribuga: 'Tribugá', cupica: 'Cupica', utria: 'Utría', amazonia: 'Amazonía', jhon: 'John', john: 'John', von: 'Von', neumann: 'Neumann',
};

/** Pasa un texto en mayúsculas sostenidas a oración normal, conservando siglas y nombres propios. */
export function lenguajeClaro(s: string): string {
  const letras = s.replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g, '');
  if (letras.length < 6 || letras !== letras.toUpperCase()) return s;
  const bajo = s.toLowerCase().replace(/[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9]+/g, (w) => (SIGLAS.has(w.toUpperCase()) ? w.toUpperCase() : PROPIOS[normalizar(w)] || w));
  return bajo.charAt(0).toUpperCase() + bajo.slice(1);
}
