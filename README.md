# Módulo de biodiversidad (prueba) · SIAT PC

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

Todo el contenido sale de fuentes públicas verificadas y cada dato lleva su enlace. Lo que no se pudo confirmar se marca «por confirmar»; nada se inventa.

- **Nombre:** las fuentes formales (MarViva 2016, PROCASUR) escriben **GIC-PA**; AUNAP y la UTCH, **GICPA**. No se encontró ninguna fuente con «GIC-PAC».
- **Entidades** (`src/data/entidades.json`): las que figuran en la lista de socios de la publicación de MarViva de 2016 (parcial: la lista superaba los 80 miembros) más entidades relacionadas (PROCASUR, SIEMBRA, Consejo de Estado, ICA). Los logos son los oficiales de cada entidad y solo se incluyen los que se pudieron descargar y verificar; el resto usa monograma.
- **Documentos** (`documentos.json`) y **noticias** (`noticias.json`): publicaciones, casos de estudio, un fallo y una resolución, y notas de AUNAP, UTCH, ACUA, Panorama y el Consejo de Estado, cada una con enlace a su fuente. Las fechas pueden ser parciales (`2016`, `2016-12`).
- **Imágenes:** `public/img/entidades` (logos) y `public/img/gicpa` (fotos de las noticias, de cada medio).
- **Pendiente por confirmar:** sitio web y contacto de FEDEPESCA (el dominio fedepesca.org pertenece a una federación española de detallistas de pescado, no a la del Chocó; se retiró). El logo que se muestra lo entregó el usuario; su diseño tiene los colores de la bandera de España, así que conviene confirmar con la federación que es el suyo; logo de los consejos comunitarios (no se encontró un logo oficial); la lista de miembros posterior a 2016; derechos de uso de los logos con cada entidad; la fecha de la nota del Consejo de Estado (la página no la indica). Las 28 asociaciones afiliadas a FEDEPESCA ya están en su ficha (lista de diciembre de 2016).

Para agregar contenido, edite esos JSON (el campo `entidad` es el `slug` de una entidad).

## Publicación

`render.yaml` define un sitio estático en Render (rama `main`, `npm ci && npm run build`, carpeta `dist`).

## Créditos de imágenes

- **Logos de entidades:** son marcas de cada entidad, tomadas de sus sitios oficiales. Falta confirmar con cada una el permiso de uso.
- **Escudo de la Armada Nacional:** Wikimedia Commons, autor SajoR, licencia CC BY-SA 2.5 (https://commons.wikimedia.org/wiki/File:Escudo_Armada_Nacional_de_Colombia.svg). Se muestra con su atribución en la ficha de la entidad.
- **Escudo del Litoral del San Juan:** Wikimedia Commons, autor BrCaLeTo, licencias GFDL 1.2+ y CC BY-SA 3.0. Es un dibujo vectorial hecho por un tercero, no un archivo oficial de la alcaldía.
- **Logos ampliados:** Consejo de Estado, Conservación Internacional, WWF y los escudos de Bahía Solano, Nuquí y Bajo Baudó no tienen versión de mayor resolución en sus sitios; se ampliaron con interpolación Lanczos y enfoque suave (mejora los bordes, no agrega detalle). Lo ideal es pedir el archivo vectorial a cada entidad.
