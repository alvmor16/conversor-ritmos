// Pegamento entre la interfaz y la lógica: decide qué campo falta,
// convierte las unidades de entrada y devuelve el resultado listo para mostrar.

import * as c from "./conversor.js";

const YARDAS_POR_MILLA = 1760;
const GRUPOS = ["dist", "tiempo", "ritmo"];

function hayAlgo(textos) {
  return textos.some((t) => t.trim() !== "");
}

// Texto -> número >= 0. Un campo vacío cuenta como 0 (dentro de un grupo relleno).
function numero(texto, nombre) {
  const t = texto.trim().replace(",", ".");
  if (t === "") return 0;
  if (!/^\d+(\.\d+)?$/.test(t)) {
    throw new Error(`Valor no válido en ${nombre}: "${texto}"`);
  }
  return Number(t);
}

/** Distancia (km) -> { a, b } en la unidad pedida: km + metros, o millas + yardas. */
export function distanciaAPartes(km, unidad) {
  const total = unidad === "km" ? km : c.kmAMillas(km);
  const sub = unidad === "km" ? 1000 : YARDAS_POR_MILLA;
  let a = Math.floor(total);
  let b = Math.round((total - a) * sub * 10) / 10; // un decimal
  if (b >= sub) {
    a += 1;
    b = 0;
  }
  return { a, b };
}

/**
 * entrada: { dist: [a, b], tiempo: [h, m, s], ritmo: [m, s] }  (textos)
 * unidad: "km" | "mi"
 * Exactamente dos grupos deben tener algo escrito; se calcula el tercero.
 * Devuelve { campo, valores, km, seg, ritmoKm }.
 */
export function resolver(entrada, unidad = "km") {
  const rellenos = GRUPOS.filter((g) => hayAlgo(entrada[g]));
  if (rellenos.length !== 2) {
    throw new Error("Rellena exactamente dos de los tres campos.");
  }
  const falta = GRUPOS.find((g) => !rellenos.includes(g));

  let km, seg, ritmoKm;

  if (rellenos.includes("dist")) {
    const a = numero(entrada.dist[0], "distancia");
    const b = numero(entrada.dist[1], "distancia");
    km =
      unidad === "km" ? a + b / 1000 : c.millasAKm(a + b / YARDAS_POR_MILLA);
  }
  if (rellenos.includes("tiempo")) {
    const [h, m, s] = entrada.tiempo.map((t) => numero(t, "tiempo"));
    seg = c.partesASegundos(h, m, s);
  }
  if (rellenos.includes("ritmo")) {
    const m = numero(entrada.ritmo[0], "ritmo");
    const s = numero(entrada.ritmo[1], "ritmo");
    const porUnidad = c.partesASegundos(0, m, s);
    ritmoKm = unidad === "km" ? porUnidad : c.ritmoMillaAKm(porUnidad);
  }

  if (falta === "ritmo") ritmoKm = c.calcularRitmo(km, seg);
  if (falta === "tiempo") seg = c.calcularTiempo(km, ritmoKm);
  if (falta === "dist") km = c.calcularDistancia(seg, ritmoKm);

  let valores;
  if (falta === "dist") {
    valores = distanciaAPartes(km, unidad);
  } else if (falta === "tiempo") {
    valores = c.segundosAPartes(seg);
  } else {
    const porUnidad = unidad === "km" ? ritmoKm : c.ritmoKmAMilla(ritmoKm);
    const p = c.segundosAPartes(porUnidad);
    valores = { m: p.h * 60 + p.m, s: p.s };
  }

  return { campo: falta, valores, km, seg, ritmoKm };
}
