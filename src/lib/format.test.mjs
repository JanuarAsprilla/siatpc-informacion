import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fechaLarga, lenguajeClaro, normalizar, peso, resumir } from './format.ts';

test('fechaLarga escribe la fecha en español', () => assert.equal(fechaLarga('2026-09-26'), '26 de septiembre de 2026'));
test('fechaLarga devuelve vacío sin fecha', () => assert.equal(fechaLarga(null), ''));
test('peso usa KB bajo un millón de bytes', () => assert.equal(peso(533593), '534 KB'));
test('peso pasa a MB con coma decimal', () => assert.equal(peso(2_500_000), '2,5 MB'));
test('normalizar quita tildes y pasa a minúsculas', () => assert.equal(normalizar('Chocó Ñandú'), 'choco nandu'));
test('resumir corta en palabra completa', () => assert.equal(resumir('uno dos tres cuatro', 10), 'uno dos…'));
test('resumir no toca textos cortos', () => assert.equal(resumir('hola', 10), 'hola'));
test('lenguajeClaro conserva siglas y propios', () => assert.equal(lenguajeClaro('PROYECTO DEL IIAP EN QUIBDO'), 'Proyecto del IIAP en Quibdó'));
test('lenguajeClaro no cambia texto ya normal', () => assert.equal(lenguajeClaro('Texto Normal'), 'Texto Normal'));
