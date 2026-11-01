// Lógica pura del conversor. TODO: implementa cada función.
//
// Convención interna (importante, evita muchos errores):
//   - Tiempos siempre en SEGUNDOS.
//   - Distancias siempre en KILÓMETROS.
//   - Ritmos siempre en SEGUNDOS POR KILÓMETRO.
// Solo conviertes de/hacia millas o a minutos:segundos en los bordes
// (entrada y salida). Dentro, todo en estas unidades.
//
// Cuando una función recibe datos no válidos, lanza un error:
//   throw new Error("mensaje que entienda una persona");
// La interfaz muestra ese mensaje tal cual.

export const KM_POR_MILLA = 1.609344;

function pendiente(nombre) {
  throw new Error(`Pendiente de implementar: ${nombre}`);
}

/**
 * Convierte horas, minutos y segundos a segundos totales.
 * Válido: enteros >= 0, con minutos < 60 y segundos < 60.
 * Lanza Error si algún valor no es válido (negativo, decimal, NaN, >= 60...).
 * Pista: Number.isInteger(x) comprueba que es un entero.
 */
export function partesASegundos(h, m, s) {
  pendiente("partesASegundos");
}

/**
 * Convierte segundos a { h, m, s } redondeando al segundo más cercano.
 * Cuidado con el redondeo: 59.6 segundos son { h: 0, m: 1, s: 0 }, no s: 60.
 */
export function segundosAPartes(segundos) {
  pendiente("segundosAPartes");
}

/** Ritmo en segundos por km. Lanza Error si la distancia o el tiempo <= 0. */
export function calcularRitmo(distanciaKm, tiempoSeg) {
  pendiente("calcularRitmo");
}

/** Tiempo total en segundos. Lanza Error si algún valor <= 0. */
export function calcularTiempo(distanciaKm, ritmoSegKm) {
  pendiente("calcularTiempo");
}

/** Distancia en km. Lanza Error si algún valor <= 0. */
export function calcularDistancia(tiempoSeg, ritmoSegKm) {
  pendiente("calcularDistancia");
}

/** Convierte un ritmo (seg/km) a velocidad en km/h. */
export function ritmoAVelocidad(ritmoSegKm) {
  pendiente("ritmoAVelocidad");
}

export function kmAMillas(km) {
  pendiente("kmAMillas");
}

export function millasAKm(millas) {
  pendiente("millasAKm");
}

/** Ritmo de seg/km a seg/milla. */
export function ritmoKmAMilla(ritmoSegKm) {
  pendiente("ritmoKmAMilla");
}

/** Ritmo de seg/milla a seg/km. */
export function ritmoMillaAKm(ritmoSegMilla) {
  pendiente("ritmoMillaAKm");
}

// ---------- Extras (cuando todo lo anterior pase) ----------

/**
 * Parciales cada kilómetro: [{ km: 1, seg: 300 }, { km: 2, seg: 600 }, ...]
 * Si la distancia no es un número entero de km, el último punto es la
 * distancia final. Ejemplo: tablaParciales(2.5, 300) devuelve
 * [{km:1, seg:300}, {km:2, seg:600}, {km:2.5, seg:750}]
 */
export function tablaParciales(distanciaKm, ritmoSegKm) {
  pendiente("tablaParciales");
}

/** Fórmula de Riegel: T2 = T1 * (D2 / D1) ** 1.06 */
export function predecirTiempoRiegel(tiempo1Seg, dist1Km, dist2Km) {
  pendiente("predecirTiempoRiegel");
}
