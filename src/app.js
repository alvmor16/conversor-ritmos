import { resolver, distanciaAPartes } from "./resolver.js";
import * as c from "./conversor.js";

const $ = (id) => document.getElementById(id);

const campos = {
  dist: [$("dist-a"), $("dist-b")],
  tiempo: [$("t-h"), $("t-m"), $("t-s")],
  ritmo: [$("r-m"), $("r-s")],
};
const fieldsets = { dist: $("g-dist"), tiempo: $("g-tiempo"), ritmo: $("g-ritmo") };
const radios = document.querySelectorAll('input[name="preset"]');

let unidad = "km"; // "km" | "mi"
let ultimoCalculado = null; // grupo que rellenó la app en el último cálculo

const dospuntos = (n) => String(n).padStart(2, "0");

// ---------- leer y escribir campos ----------

function leer() {
  const entrada = {};
  for (const g of Object.keys(campos)) {
    entrada[g] = campos[g].map((el) => el.value);
  }
  // Si el grupo calculado la última vez no se ha tocado, se trata como vacío:
  // así se puede volver a pulsar Calcular tras cambiar otro dato.
  if (ultimoCalculado) entrada[ultimoCalculado] = campos[ultimoCalculado].map(() => "");
  return entrada;
}

function escribir(grupo, textos) {
  campos[grupo].forEach((el, i) => (el.value = textos[i]));
}

function marcarCalculado(grupo) {
  for (const g of Object.keys(fieldsets)) fieldsets[g].classList.toggle("calculado", g === grupo);
  ultimoCalculado = grupo;
}

function limpiarResultado() {
  $("error").hidden = true;
  $("error").textContent = "";
  $("extras").textContent = "";
}

function borrar() {
  for (const g of Object.keys(campos)) escribir(g, campos[g].map(() => ""));
  radios.forEach((r) => (r.checked = false));
  marcarCalculado(null);
  limpiarResultado();
}

// ---------- unidades ----------

function ponerUnidad(nueva) {
  unidad = nueva;
  $("u-km").classList.toggle("activa", nueva === "km");
  $("u-mi").classList.toggle("activa", nueva === "mi");
  $("u-km").setAttribute("aria-pressed", String(nueva === "km"));
  $("u-mi").setAttribute("aria-pressed", String(nueva === "mi"));
  $("lbl-dist-a").textContent = nueva === "km" ? "Km" : "mi";
  $("lbl-dist-b").textContent = nueva === "km" ? "m" : "yd";
  $("lbl-ritmo-unidad").textContent = nueva === "km" ? "/km" : "/mi";
  borrar(); // los valores escritos no tendrían sentido en la otra unidad
}

// ---------- mostrar resultados ----------

function formatearTiempo(seg) {
  const p = c.segundosAPartes(seg);
  return p.h > 0 ? `${p.h}:${dospuntos(p.m)}:${dospuntos(p.s)}` : `${p.m}:${dospuntos(p.s)}`;
}

function escribirResultado(r) {
  const v = r.valores;
  if (r.campo === "dist") escribir("dist", [String(v.a), String(v.b)]);
  if (r.campo === "tiempo") escribir("tiempo", [String(v.h), dospuntos(v.m), dospuntos(v.s)]);
  if (r.campo === "ritmo") escribir("ritmo", [String(v.m), dospuntos(v.s)]);
  marcarCalculado(r.campo);
}

function añadirP(contenedor, texto) {
  const p = document.createElement("p");
  p.textContent = texto;
  contenedor.appendChild(p);
}

function mostrarExtras(r) {
  const cont = $("extras");
  cont.textContent = "";

  // Velocidad (extra: si falla, la app sigue funcionando)
  try {
    const kmh = c.ritmoAVelocidad(r.ritmoKm);
    añadirP(cont, unidad === "km" ? `Velocidad: ${kmh.toFixed(2)} km/h` : `Velocidad: ${c.kmAMillas(kmh).toFixed(2)} mph`);
  } catch (e) {
    console.warn("Velocidad no disponible:", e.message);
  }

  // Predicción para otras distancias (Riegel)
  try {
    const distancias = [
      ["5K", 5],
      ["10K", 10],
      ["Media maratón", 21.0975],
      ["Maratón", 42.195],
    ];
    const filas = distancias.map(([nombre, d]) => [nombre, formatearTiempo(c.predecirTiempoRiegel(r.seg, r.km, d))]);
    const h2 = document.createElement("h2");
    h2.textContent = "Tiempo estimado en otras distancias";
    const tabla = document.createElement("table");
    for (const [nombre, t] of filas) {
      const tr = document.createElement("tr");
      for (const texto of [nombre, t]) {
        const td = document.createElement("td");
        td.textContent = texto;
        tr.appendChild(td);
      }
      tabla.appendChild(tr);
    }
    const nota = document.createElement("small");
    nota.textContent = "Estimación con la fórmula de Riegel: orientativa, sobre todo en distancias muy distintas a la tuya.";
    cont.append(h2, tabla, nota);
  } catch (e) {
    console.warn("Predicciones no disponibles:", e.message);
  }
}

function calcular() {
  limpiarResultado();
  try {
    const r = resolver(leer(), unidad);
    escribirResultado(r);
    mostrarExtras(r);
  } catch (err) {
    $("error").textContent = err.message;
    $("error").hidden = false;
  }
}

// ---------- eventos ----------

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  calcular();
});
$("borrar").addEventListener("click", borrar);
$("u-km").addEventListener("click", () => unidad !== "km" && ponerUnidad("km"));
$("u-mi").addEventListener("click", () => unidad !== "mi" && ponerUnidad("mi"));

// Si el usuario edita un grupo, deja de ser "calculado"
for (const g of Object.keys(campos)) {
  for (const el of campos[g]) {
    el.addEventListener("input", () => {
      if (ultimoCalculado === g) marcarCalculado(null);
      if (g === "dist") radios.forEach((r) => (r.checked = false));
    });
  }
}

// Atajos de distancia
radios.forEach((radio) =>
  radio.addEventListener("change", () => {
    if (!radio.checked) return;
    try {
      const p = distanciaAPartes(Number(radio.value), unidad);
      escribir("dist", [String(p.a), String(p.b)]);
      if (ultimoCalculado === "dist") marcarCalculado(null);
      limpiarResultado();
    } catch (err) {
      $("error").textContent = err.message;
      $("error").hidden = false;
    }
  }),
);

// Instalable y funciona sin conexión
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch((e) => console.warn("Service worker:", e));
}
