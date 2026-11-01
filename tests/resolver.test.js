// Pruebas de integración: pasan cuando conversor.js esté completo.
import { test } from "node:test";
import assert from "node:assert/strict";

// Debe lanzar un error de verdad (no el aviso de "Pendiente de implementar").
const falla = (fn) => assert.throws(fn, (e) => !/Pendiente/.test(e.message));
import { resolver, distanciaAPartes } from "../src/resolver.js";

const vacio = { dist: ["", ""], tiempo: ["", "", ""], ritmo: ["", ""] };
const con = (o) => ({ ...vacio, ...o });

test("calcula el ritmo (km)", () => {
  const r = resolver(con({ dist: ["10", ""], tiempo: ["", "50", "00"] }), "km");
  assert.equal(r.campo, "ritmo");
  assert.deepEqual(r.valores, { m: 5, s: 0 });
});

test("calcula el tiempo (km)", () => {
  const r = resolver(con({ dist: ["10", ""], ritmo: ["5", "00"] }), "km");
  assert.equal(r.campo, "tiempo");
  assert.deepEqual(r.valores, { h: 0, m: 50, s: 0 });
});

test("calcula la distancia (km)", () => {
  const r = resolver(con({ tiempo: ["", "50", "00"], ritmo: ["5", "0"] }), "km");
  assert.equal(r.campo, "dist");
  assert.deepEqual(r.valores, { a: 10, b: 0 });
});

test("la distancia admite km y metros", () => {
  const r = resolver(con({ dist: ["21", "97.5"], ritmo: ["5", "00"] }), "km");
  assert.equal(r.campo, "tiempo");
  assert.deepEqual(r.valores, { h: 1, m: 45, s: 29 });
});

test("calcula el ritmo en millas", () => {
  const r = resolver(con({ dist: ["10", ""], tiempo: ["1", "20", "00"] }), "mi");
  assert.equal(r.campo, "ritmo");
  assert.deepEqual(r.valores, { m: 8, s: 0 });
});

test("calcula el tiempo en millas", () => {
  const r = resolver(con({ dist: ["10", ""], ritmo: ["8", "00"] }), "mi");
  assert.equal(r.campo, "tiempo");
  assert.deepEqual(r.valores, { h: 1, m: 20, s: 0 });
});

test("errores de entrada", () => {
  falla(() => resolver(vacio, "km"));
  falla(() => resolver(con({ dist: ["10", ""] }), "km"));
  falla(() =>
    resolver(con({ dist: ["10", ""], tiempo: ["0", "50", "0"], ritmo: ["5", "0"] }), "km"),
  );
  falla(() => resolver(con({ dist: ["abc", ""], tiempo: ["0", "50", "0"] }), "km"));
  falla(() => resolver(con({ dist: ["-5", ""], tiempo: ["0", "50", "0"] }), "km"));
  falla(() => resolver(con({ dist: ["0", ""], tiempo: ["0", "50", "0"] }), "km"));
});

test("distanciaAPartes", () => {
  assert.deepEqual(distanciaAPartes(10, "km"), { a: 10, b: 0 });
  assert.deepEqual(distanciaAPartes(21.0975, "km"), { a: 21, b: 97.5 });
  assert.deepEqual(distanciaAPartes(10.9999999, "km"), { a: 11, b: 0 });
});
