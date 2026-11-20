# Integrar el módulo GIC-PA Pesca en el SIAT PC

Guía para la persona que lo integra. El módulo está hecho con la **misma base que siatpc.co**: Astro 5.16.3 y Bootstrap 5.3.6. No usa React, Vue ni Tailwind, y no hace falta cambiar nada de eso.

## Qué trae

| Carpeta | Contenido |
|---|---|
| `src/pages/` | Inicio (con el recorrido del mapa), `entidades/`, `documentos/`, `noticias/` y la página 404 |
| `src/components/` | Tarjetas, filas, riel lateral, cabecera de página y el recorrido del mapa (`storymap/`) |
| `src/data/` | **Todo el contenido**: `entidades.json`, `documentos.json`, `noticias.json`, `tematicas.json`, `territorio.json` |
| `src/scripts/` | JavaScript sin librerías: filtros de listas (`lista.js`), noticia (`noticia.js`), mapa (`storymap.js`) |
| `src/lib/` | Utilidades: `rutas.ts` (rutas), `datos.ts`, `format.ts`, `vista.js` (zoom del mapa) y sus pruebas |
| `src/styles/` | `modulo.css`, `inicio.css`, `storymap.css` (CSS del módulo) y `standalone.css` (solo modo independiente) |
| `public/img/` | Logos de las entidades, fotos de noticias y el mapa (dos tamaños) |

## Dos formas de integrarlo

**A. Copiar al repositorio del SIAT PC** (recomendada)
1. Copiar `src/pages/*`, `src/components/*` (menos `SiatHeader`, `SiatFooter` y `Logo`), `src/data`, `src/scripts`, `src/lib`, `src/styles` (menos `siat.css` y `standalone.css`) y `public/img`.
2. En `src/layouts/Base.astro` quitar la cabecera y el pie copiados y usar los del SIAT PC. Dejar el bloque `<div class="gicpa">…</div>`: es lo que aísla el módulo.
3. Copiar `postcss.config.cjs` e instalar `npm i -D postcss-prefix-selector`. Sin esto el CSS del módulo no queda aislado.
4. Instalar la fuente `npm i @fontsource-variable/newsreader` (la usan los títulos). Si no se quiere, se cambia `--serif` en `modulo.css` por una fuente del SIAT PC.
5. Ubicar las páginas bajo la ruta elegida (por ejemplo `src/pages/informacion/`) o usar `MODULO_BASE` (punto B).

**B. Publicarlo como sitio aparte bajo una subruta**
```bash
MODULO_BASE=/informacion/ npm run build   # genera dist/ con todas las rutas bajo /informacion/
```
Servir el contenido de `dist/` en esa ruta (nginx). Sin la variable, el módulo se publica en la raíz.

## Cómo está resuelto lo que suele dar problemas

- **Rutas:** ningún enlace ni imagen está escrito a mano con `/`. Todo pasa por `ruta()` de `src/lib/rutas.ts`, que respeta `MODULO_BASE`. En código nuevo usar siempre `ruta('/entidades/')`.
- **CSS aislado:** todo el CSS del módulo vive bajo `.gicpa` (lo agrega `postcss.config.cjs` al compilar). No cambia la cabecera, el pie ni otras páginas. Se comprobó que los estilos de las páginas del módulo salen idénticos con y sin el aislamiento.
- **Bootstrap:** el módulo carga Bootstrap 5.3.6 (la misma versión del SIAT PC) desde el CDN en `Base.astro`. Al integrarlo, no cargarlo dos veces: usar el que ya carga el SIAT PC.
- **Iconos:** el módulo pide `bootstrap-icons@1.11.3`; el SIAT PC usa 1.10.0. Todos los iconos usados existen en 1.10.0 **menos `bi-twitter-x`** (botón de compartir en X de las noticias). Opciones: subir los iconos del SIAT PC a 1.11.3 o cambiar ese icono.
- **Versión de Astro:** fijada en `5.16.3`, la misma de siatpc.co.

## Cómo editar el contenido (sin tocar código)

- **Entidades:** `src/data/entidades.json` (nombre, sigla, tipo, `Miembro` o `Relacionada`, logo en `public/img/entidades/`, descripción y datos de contacto). Las asociaciones afiliadas van en `afiliadas`.
- **Documentos:** `documentos.json`. **Noticias:** `noticias.json` (cada una con su fuente y enlace). **Temáticas:** `tematicas.json`.
- **Fotos del collage del inicio:** `inicio.json`. Lista de 3 rutas de imagen, en orden: la 1.ª es la foto grande, la 2.ª la de arriba a la derecha y la 3.ª la redonda. Son independientes de las noticias: las imágenes viven en `public/img/inicio/` y se reemplazan o se reordenan ahí, sin tocar nada más.
- **Recorrido del mapa:** `territorio.json`. Cada zona es una caja `[x0, y0, x1, y1]` en fracciones de 0 a 1 del mapa; los capítulos son el texto de cada parte.
- Nombre y subtítulo del módulo (por ejemplo quitar «prueba»): `src/lib/modulo.ts`.
- Fechas pueden ser parciales: `2016` o `2016-12`.

## Comprobar que todo sigue bien

```bash
npm test          # pruebas automáticas (25)
npm run build     # compila el sitio
MODULO_BASE=/informacion/ npm run build   # compila bajo una subruta
```

## Pendientes de contenido (no de código)

- Logo de los consejos comunitarios (no hay uno oficial verificado).
- Permiso de uso de los logos con cada entidad; vectores oficiales de algunas.
- Fuente y fecha del mapa, y significado de las siglas ZEMP y UAC de su leyenda.
- Fecha de la nota del Consejo de Estado y datos de contacto de FEDEPESCA.
- Lista de miembros posterior a 2016.
