import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fechaCorta, fechaLarga, lenguajeClaro, limpiarDescripcion, normalizar, peso, repiteTitulo, resumir } from './format.ts';

test('fechaLarga escribe la fecha en español', () => assert.equal(fechaLarga('2026-09-26'), '26 de septiembre de 2026'));
test('fechaLarga devuelve vacío sin fecha', () => assert.equal(fechaLarga(null), ''));
test('peso usa KB bajo un millón de bytes', () => assert.equal(peso(533593), '534 KB'));
test('peso pasa a MB con coma decimal', () => assert.equal(peso(2_500_000), '2,5 MB'));
test('normalizar quita tildes y pasa a minúsculas', () => assert.equal(normalizar('Chocó Ñandú'), 'choco nandu'));
test('resumir corta en palabra completa', () => assert.equal(resumir('uno dos tres cuatro', 10), 'uno dos…'));
test('resumir no toca textos cortos', () => assert.equal(resumir('hola', 10), 'hola'));
test('lenguajeClaro conserva siglas y propios', () => assert.equal(lenguajeClaro('PROYECTO DEL IIAP EN QUIBDO'), 'Proyecto del IIAP en Quibdó'));
test('lenguajeClaro no cambia texto ya normal', () => assert.equal(lenguajeClaro('Texto Normal'), 'Texto Normal'));
test('fechaLarga acepta solo año', () => assert.equal(fechaLarga('2016'), '2016'));
test('fechaLarga acepta año y mes', () => assert.equal(fechaLarga('2016-12'), 'diciembre de 2016'));
test('fechaCorta acepta fechas parciales', () => { assert.equal(fechaCorta('2016'), '2016'); assert.equal(fechaCorta('2016-12'), 'dic 2016'); });
test('fechaCorta abrevia el mes', () => assert.equal(fechaCorta('2026-07-16'), '16 jul 2026'));
test('lenguajeClaro pasa a Nombre Propio un tramo corto en mayúsculas', () =>
  assert.equal(lenguajeClaro('El IIAP y STOCKHOLM ENVIRONMENT INSTITUTE - SEI, fortalecen alianza'), 'El IIAP y Stockholm Environment Institute - SEI, fortalecen alianza'));
test('lenguajeClaro pasa a oración un tramo largo en mayúsculas', () =>
  assert.equal(lenguajeClaro('023 DE 2025, UN PROYECTO QUE CIERRA CAPACIDADES Y UN COMPROMISO TERRITORIAL'), '023 de 2025, un proyecto que cierra capacidades y un compromiso territorial'));
test('lenguajeClaro conserva POA', () => assert.equal(lenguajeClaro('PLAN OPERATIVO ANUAL (POA) DEL INSTITUTO'), 'Plan operativo anual (POA) del instituto'));
test('limpiarDescripcion quita el arranque repetido', () =>
  assert.equal(limpiarDescripcion('Documento que contiene el primer informe de control interno'), 'El primer informe de control interno'));
test('limpiarDescripcion baja las mayúsculas sostenidas', () =>
  assert.equal(limpiarDescripcion('RESUMEN DE LA EJECUCIÓN PRESUPUESTAL DEL IIAP'), 'Resumen de la ejecución presupuestal del IIAP'));
test('repiteTitulo detecta una descripción que solo repite el título', () => assert.equal(repiteTitulo('Informe de gestión 2025', 'Informe de gestión 2025.'), true));
test('repiteTitulo deja pasar una descripción con contenido', () => assert.equal(repiteTitulo('Informe de gestión 2025', 'Da cuenta de las actividades de investigación realizadas durante el año por el Instituto.'), false));
