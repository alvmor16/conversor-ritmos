import { test } from "node:test";
import assert from "node:assert/strict";

// Debe lanzar un error de verdad (no el aviso de "Pendiente de implementar").
const falla = (fn) => assert.throws(fn, (e) => !/Pendiente/.test(e.message));
import * as c from "../src/conversor.js";

const casi = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) <= tol, `${a} no es ≈ ${b}`);

// --- partesASegundos ---
test("partesASegundos: casos válidos", () => {
  assert.equal(c.partesASegundos(0, 50, 0), 3000);
  assert.equal(c.partesASegundos(0, 4, 30), 270);
  assert.equal(c.partesASegundos(1, 5, 30), 3930);
});

test("partesASegundos: casos no válidos", () => {
  falla(() => c.partesASegundos(0, 75, 0));
  falla(() => c.partesASegundos(0, 0, 60));
  falla(() => c.partesASegundos(-1, 0, 0));
  falla(() => c.partesASegundos(0, 1.5, 0));
  falla(() => c.partesASegundos(0, NaN, 0));
});

// --- segundosAPartes ---
test("segundosAPartes", () => {
  assert.deepEqual(c.segundosAPartes(3000), { h: 0, m: 50, s: 0 });
  assert.deepEqual(c.segundosAPartes(3930), { h: 1, m: 5, s: 30 });
  assert.deepEqual(c.segundosAPartes(270), { h: 0, m: 4, s: 30 });
});

test("segundosAPartes: redondeo con arrastre", () => {
  assert.deepEqual(c.segundosAPartes(299.6), { h: 0, m: 5, s: 0 });
  assert.deepEqual(c.segundosAPartes(59.6), { h: 0, m: 1, s: 0 });
  assert.deepEqual(c.segundosAPartes(3599.6), { h: 1, m: 0, s: 0 });
});

// --- conversiones principales ---
test("calcularRitmo / calcularTiempo / calcularDistancia", () => {
  assert.equal(c.calcularRitmo(10, 3000), 300);
  assert.equal(c.calcularTiempo(10, 300), 3000);
  assert.equal(c.calcularDistancia(3000, 300), 10);
});

test("valores no válidos lanzan error", () => {
  falla(() => c.calcularRitmo(0, 3000));
  falla(() => c.calcularRitmo(-1, 3000));
  falla(() => c.calcularRitmo(10, 0));
  falla(() => c.calcularTiempo(10, 0));
  falla(() => c.calcularTiempo(0, 300));
  falla(() => c.calcularDistancia(3000, 0));
  falla(() => c.calcularDistancia(0, 300));
});

test("ritmoAVelocidad", () => {
  casi(c.ritmoAVelocidad(300), 12);
  casi(c.ritmoAVelocidad(360), 10);
});

// --- millas ---
test("km <-> millas", () => {
  casi(c.kmAMillas(10), 6.2137119, 1e-6);
  casi(c.millasAKm(1), 1.609344);
  casi(c.millasAKm(c.kmAMillas(42.195)), 42.195, 1e-9);
});

test("ritmo km <-> milla", () => {
  casi(c.ritmoKmAMilla(300), 482.8032, 1e-6);
  casi(c.ritmoMillaAKm(482.8032), 300, 1e-6);
});

// --- extras ---
test("tablaParciales", () => {
  assert.deepEqual(c.tablaParciales(3, 300), [
    { km: 1, seg: 300 },
    { km: 2, seg: 600 },
    { km: 3, seg: 900 },
  ]);
  assert.deepEqual(c.tablaParciales(2.5, 300), [
    { km: 1, seg: 300 },
    { km: 2, seg: 600 },
    { km: 2.5, seg: 750 },
  ]);
});

test("predecirTiempoRiegel", () => {
  casi(c.predecirTiempoRiegel(1200, 5, 10), 1200 * 2 ** 1.06, 1e-6);
});

test("velocidadARitmo", () => {
  casi(c.velocidadARitmo(12), 300);
  casi(c.velocidadARitmo(10), 360);
  falla(() => c.velocidadARitmo(0));
  falla(() => c.velocidadARitmo(-5));
});