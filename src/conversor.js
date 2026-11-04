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

function validarEnteroNoNegativo(valor, nombre) {
  if (!Number.isInteger(valor) || valor < 0) {
    throw new Error(`${nombre} debe ser un número entero igual o mayor que 0`);
  }
}

function validarPositivo(valor, nombre) {
  if (!(valor > 0)) {
    throw new Error(`${nombre} debe ser mayor que 0`);
  }
}

/**
 * Convierte horas, minutos y segundos a segundos totales.
 * Válido: enteros >= 0, con minutos < 60 y segundos < 60.
 * Lanza Error si algún valor no es válido (negativo, decimal, NaN, >= 60...).
 * Pista: Number.isInteger(x) comprueba que es un entero.
 */
export function partesASegundos(h, m, s) {
  validarEnteroNoNegativo(h, "Las horas");
  validarEnteroNoNegativo(m, "Los minutos");
  validarEnteroNoNegativo(s, "Los segundos");
  if (m >= 60) throw new Error("Los minutos deben ser menores que 60");
  if (s >= 60) throw new Error("Los segundos deben ser menores que 60");
  return h * 3600 + m * 60 + s;
}

/**
 * Convierte segundos a { h, m, s } redondeando al segundo más cercano.
 * Cuidado con el redondeo: 59.6 segundos son { h: 0, m: 1, s: 0 }, no s: 60.
 */
export function segundosAPartes(segundos) {
  const total = Math.round(segundos); // primero se redondea, después se reparte
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };

}

/** Ritmo en segundos por km. Lanza Error si la distancia o el tiempo <= 0. */
export function calcularRitmo(distanciaKm, tiempoSeg) {
  validarPositivo(distanciaKm, "La distancia");
  validarPositivo(tiempoSeg, "El tiempo");
  return tiempoSeg / distanciaKm;

}

/** Tiempo total en segundos. Lanza Error si algún valor <= 0. */
export function calcularTiempo(distanciaKm, ritmoSegKm) {
  validarPositivo(distanciaKm, "La distancia");
  validarPositivo(ritmoSegKm, "El ritmo");
  return distanciaKm * ritmoSegKm;
}

/** Distancia en km. Lanza Error si algún valor <= 0. */
export function calcularDistancia(tiempoSeg, ritmoSegKm) {
  validarPositivo(tiempoSeg, "El tiempo");
  validarPositivo(ritmoSegKm, "El ritmo");
  return tiempoSeg / ritmoSegKm;
}

/** Convierte un ritmo (seg/km) a velocidad en km/h. */
export function ritmoAVelocidad(ritmoSegKm) {
  validarPositivo(ritmoSegKm, "El ritmo");
  return 3600 / ritmoSegKm; // km/h
}

export function kmAMillas(km) {
  return km / KM_POR_MILLA;
}

export function millasAKm(millas) {
  return millas * KM_POR_MILLA;
}

/** Ritmo de seg/km a seg/milla. */
export function ritmoKmAMilla(ritmoSegKm) {
  return ritmoSegKm * KM_POR_MILLA; // una milla es más larga, tarda más
}

/** Ritmo de seg/milla a seg/km. */
export function ritmoMillaAKm(ritmoSegMilla) {
  return ritmoSegMilla / KM_POR_MILLA;
}

// ---------- Extras (cuando todo lo anterior pase) ----------

/**
 * Parciales cada kilómetro: [{ km: 1, seg: 300 }, { km: 2, seg: 600 }, ...]
 * Si la distancia no es un número entero de km, el último punto es la
 * distancia final. Ejemplo: tablaParciales(2.5, 300) devuelve
 * [{km:1, seg:300}, {km:2, seg:600}, {km:2.5, seg:750}]
 */
export function tablaParciales(distanciaKm, ritmoSegKm) {
  validarPositivo(distanciaKm, "La distancia");
  validarPositivo(ritmoSegKm, "El ritmo");
  const parciales = [];
  for (let km = 1; km < distanciaKm; km++) {
    parciales.push({ km, seg: km * ritmoSegKm });
  }
  parciales.push({ km: distanciaKm, seg: distanciaKm * ritmoSegKm });
  return parciales;
}

/** Fórmula de Riegel: T2 = T1 * (D2 / D1) ** 1.06 */
export function predecirTiempoRiegel(tiempo1Seg, dist1Km, dist2Km) {
  validarPositivo(tiempo1Seg, "El tiempo");
  validarPositivo(dist1Km, "La distancia de partida");
  validarPositivo(dist2Km, "La distancia objetivo");
  return tiempo1Seg * (dist2Km / dist1Km) ** 1.06;
}

export function velocidadARitmo(velocidadKmh) {
  validarPositivo(velocidadKmh, "La velocidad");
  return 3600 / velocidadKmh; // segundos por km
}