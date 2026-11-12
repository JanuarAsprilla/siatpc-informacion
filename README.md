# Centro de información · SIAT PC

Módulo del Sistema de Información Ambiental Territorial del Pacífico (SIAT PC) con cuatro secciones:

| Ruta | Qué muestra |
|------|-------------|
| `/` | Inicio: accesos, últimas noticias, entidades y documentos recientes |
| `/entidades/` | Tarjetas de entidades con búsqueda, filtro por tipo y 1, 2 o 3 columnas |
| `/entidades/<entidad>/` | Descripción, datos de contacto y botón a `/documentos/?entidad=<entidad>` |
| `/documentos/` | Documentos de todas las entidades (título, resumen, archivo), con filtros y 1, 2 o 3 columnas |
| `/noticias/` y `/noticias/<id>/` | Noticias: destacada, búsqueda, temática, paginación, carrusel y compartir |

La cabecera y el pie son los de siatpc.co (mismo marcado y estilos, enlaces apuntando a `https://siatpc.co`), para que el módulo no se sienta aparte. La barra «Centro de información» va debajo de la cabecera.

## Stack

Astro (estático) + Bootstrap 5.3 e iconos de Bootstrap, igual que siatpc.co. JavaScript solo para filtros, paginación, carrusel y compartir. El estado de los filtros vive en la URL (`?entidad=iiap&categoria=Informes&cols=2&p=2`).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321
npm test           # pruebas de src/lib/format.ts
npm run build      # genera dist/
```

## Contenido

`src/data/*.json` se genera con `npm run preparar-datos -- <ruta-al-rediseño-del-IIAP>` desde el rediseño del IIAP. Hoy:

- **Entidades:** 12 (IIAP, Minambiente, IDEAM, Humboldt, Invemar, Sinchi, ANLA y cinco corporaciones autónomas). Las descripciones de Humboldt e Invemar son de una línea y están por validar con cada entidad; las demás vienen del sitio del IIAP.
- **Documentos y noticias:** solo existen los del IIAP. Las demás entidades aparecen con 0 documentos hasta que entreguen los suyos.

Para sumar contenido de otra entidad, agregue su `slug` en `entidad` dentro de `documentos.json` o `noticias.json`.

## Publicación

`render.yaml` define un sitio estático en Render (rama `main`, `npm ci && npm run build`, carpeta `dist`).
