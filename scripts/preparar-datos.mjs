// Genera src/data/*.json y copia las imágenes desde el rediseño del IIAP.
// Uso: node scripts/preparar-datos.mjs [ruta-al-rediseno]
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ORIGEN = process.argv[2] ?? '/Users/januar/iiap-rediseno/.claude/worktrees/rediseno';
const DATOS = join(ORIGEN, 'src/data/sitio');
const leer = (f) => JSON.parse(readFileSync(join(DATOS, f), 'utf8'));
const escribir = (f, v) => writeFileSync(join('src/data', f), JSON.stringify(v, null, 1) + '\n');

mkdirSync('src/data', { recursive: true });
mkdirSync('public/img/entidades', { recursive: true });

// Entidades: nombre y tipo curados a mano; «acerca» y datos de contacto vienen del sitio del IIAP.
const CURADAS = [
  { slug: 'iiap', nombre: 'Instituto de Investigaciones Ambientales del Pacífico', sigla: 'IIAP', tipo: 'Instituto de investigación', logo: 'iiap.webp', desde: 'public/img/logo-horizontal.webp', ciudad: 'Quibdó - Colombia', web: 'https://iiap.org.co/' },
  { slug: 'minambiente', nombre: 'Ministerio de Ambiente y Desarrollo Sostenible', sigla: 'MADS', tipo: 'Ministerio', logo: 'minambiente.webp', desde: 'public/img/aliados/minambiente.webp', json: 'MINISTERIO DE AMBIENTE' },
  { slug: 'ideam', nombre: 'Instituto de Hidrología, Meteorología y Estudios Ambientales', sigla: 'IDEAM', tipo: 'Instituto de investigación', logo: 'ideam.webp', desde: 'public/img/aliados/ideam.webp', json: 'INSTITUTO DE HIDROLOGIA' },
  { slug: 'humboldt', nombre: 'Instituto de Investigación de Recursos Biológicos Alexander von Humboldt', sigla: 'Humboldt', tipo: 'Instituto de investigación', logo: 'humboldt.svg', desde: 'public/img/aliados/humboldt.svg', ciudad: 'Bogotá - Colombia', web: 'https://www.humboldt.org.co/' },
  { slug: 'invemar', nombre: 'Instituto de Investigaciones Marinas y Costeras', sigla: 'Invemar', tipo: 'Instituto de investigación', logo: 'invemar.webp', desde: 'public/img/aliados/invemar.webp', ciudad: 'Santa Marta - Colombia', web: 'https://www.invemar.org.co/' },
  { slug: 'sinchi', nombre: 'Instituto Amazónico de Investigaciones Científicas', sigla: 'Sinchi', tipo: 'Instituto de investigación', logo: 'sinchi.webp', desde: 'public/img/aliados/sinchi.webp', json: 'INSTITUTO AMAZÓNICO' },
  { slug: 'anla', nombre: 'Autoridad Nacional de Licencias Ambientales', sigla: 'ANLA', tipo: 'Autoridad ambiental', json: 'AUTORIDAD NACIONAL' },
  { slug: 'codechoco', nombre: 'Corporación Autónoma Regional para el Desarrollo Sostenible del Chocó', sigla: 'Codechocó', tipo: 'Corporación autónoma regional', json: 'CORPORACIÓN AUTÓNOMA REGIONAL PARA EL DESARROLLO SOSTENIBLE DEL CHOCÓ' },
  { slug: 'cvc', nombre: 'Corporación Autónoma Regional del Valle del Cauca', sigla: 'CVC', tipo: 'Corporación autónoma regional', json: 'CORPORACIÓN AUTÓNOMA REGIONAL DEL VALLE' },
  { slug: 'carder', nombre: 'Corporación Autónoma Regional de Risaralda', sigla: 'CARDER', tipo: 'Corporación autónoma regional', json: 'CORPORACIÓN AUTÓNOMA REGIONAL DE RISARALDA' },
  { slug: 'crc', nombre: 'Corporación Autónoma Regional del Cauca', sigla: 'CRC', tipo: 'Corporación autónoma regional', json: 'CORPORACIÓN AUTÓNOMA REGIONAL DEL CAUCA' },
  { slug: 'corponarino', nombre: 'Corporación Autónoma Regional de Nariño', sigla: 'Corponariño', tipo: 'Corporación autónoma regional', json: 'CORPORACIÓN AUTÓNOMA REGIONAL DE NARIÑO' },
];

const fuente = leer('entidades.json');
const nosotros = leer('nosotros.json');
const acercaIiap = nosotros[0]?.bloques?.find((b) => b.p)?.p ?? '';

const entidades = CURADAS.map((c) => {
  const f = c.json ? fuente.find((e) => e.nombre.startsWith(c.json)) : null;
  if (c.json && !f) throw new Error(`Sin datos para ${c.slug}`);
  const datos = f ? f.datos : [
    c.ciudad && { k: 'Ciudad', v: c.ciudad, href: null },
    c.web && { k: 'Página WEB', v: c.web, href: c.web },
  ].filter(Boolean);
  return {
    slug: c.slug, nombre: c.nombre, sigla: c.sigla, tipo: c.tipo,
    logo: c.logo ? `/img/entidades/${c.logo}` : null,
    acerca: f ? f.acerca : c.slug === 'iiap' ? acercaIiap : '',
    datos,
  };
});
for (const c of CURADAS) if (c.desde) cpSync(join(ORIGEN, c.desde), join('public/img/entidades', c.logo));
escribir('entidades.json', entidades);

// Documentos: hoy solo existen los publicados por el IIAP.
const ETIQUETA = { normatividad: 'Normatividad', politicas: 'Políticas', manuales: 'Manuales', planes: 'Planes', programas: 'Programas', proyectos: 'Proyectos', presupuestos: 'Presupuestos', informes: 'Informes', tablas: 'Tablas de retención' };
const docs = leer('documentos.json');
const documentos = Object.entries(docs).flatMap(([cat, lista]) =>
  lista.map((d) => ({ id: d.id, entidad: 'iiap', categoria: ETIQUETA[cat], titulo: d.titulo, desc: d.desc ?? '', fecha: d.fecha ?? null, archivos: d.archivos.map(({ nombre, url, tipo, bytes }) => ({ nombre, url, tipo, bytes: bytes ?? null })) })),
).sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
escribir('documentos.json', documentos);

// Noticias y temáticas, tal como están en el rediseño.
const tem = leer('categorias-noticias.json');
escribir('noticias.json', leer('noticias.json').map((n) => ({ ...n, entidad: 'iiap', tematicas: tem.porNoticia[n.id] ?? [] })));
escribir('tematicas.json', tem.categorias);
cpSync(join(ORIGEN, 'public/img/noticias'), 'public/img/noticias', { recursive: true });
console.log(`${entidades.length} entidades, ${documentos.length} documentos`);
