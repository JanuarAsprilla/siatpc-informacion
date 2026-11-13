import test from 'node:test';
import assert from 'node:assert/strict';
import { acercarVista, limitarVista, vistaDeCaja, VISTA_COMPLETA, Z_MAX } from './vista.js';

const W = 500;
const H = 700;

test('limitarVista no deja entrar el borde del mapa ni pasar del zoom máximo', () => {
  assert.deepEqual(limitarVista({ z: 2, tx: 50, ty: 50 }, W, H), { z: 2, tx: 0, ty: 0 });
  assert.deepEqual(limitarVista({ z: 2, tx: -9999, ty: -9999 }, W, H), { z: 2, tx: -W, ty: -H });
  assert.equal(limitarVista({ z: 99, tx: 0, ty: 0 }, W, H).z, Z_MAX);
  assert.equal(limitarVista({ z: 0.2, tx: 0, ty: 0 }, W, H).z, 1);
});

test('acercarVista mantiene fijo el punto bajo el cursor', () => {
  const v = acercarVista(VISTA_COMPLETA, 2, 250, 350, W, H);
  assert.equal(v.z, 2);
  assert.equal(250 * v.z + v.tx, 250);
  assert.equal(v.tx, -250);
  assert.equal(v.ty, -350);
});

test('acercarVista al alejar vuelve a la vista completa', () => {
  const cerca = acercarVista(VISTA_COMPLETA, 3, 100, 100, W, H);
  assert.deepEqual(acercarVista(cerca, 1 / 3, 100, 100, W, H), VISTA_COMPLETA);
});

test('vistaDeCaja centra la caja y no sale del mapa', () => {
  const v = vistaDeCaja([0.4, 0.4, 0.6, 0.6], W, H);
  assert.ok(v.z > 2);
  const centroX = 0.5 * W * v.z + v.tx;
  assert.ok(Math.abs(centroX - W / 2) < 1e-6);
  const borde = vistaDeCaja([0, 0, 0.1, 0.1], W, H);
  assert.equal(borde.tx, 0);
  assert.equal(borde.ty, 0);
});

test('vistaDeCaja con una caja que ocupa todo el mapa deja la vista completa', () => {
  assert.deepEqual(vistaDeCaja([0, 0, 1, 1], W, H), VISTA_COMPLETA);
});
