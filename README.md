# Conversor de ritmos

App web para runners: rellena dos de los tres datos (distancia, tiempo, ritmo)
y calcula el tercero. Admite kilómetros y millas, atajos de distancia
(5K, 10K, media maratón, maratón) y estimaciones de tiempo en otras distancias.
Se instala en el iPhone y funciona sin conexión.

## Estructura
- `src/conversor.js`: la lógica pura (lo que tienes que escribir).
- `src/resolver.js`: decide qué campo falta y convierte unidades. Ya hecho.
- `src/app.js`, `index.html`, `style.css`: la interfaz. Ya hecho.
- `sw.js`, `manifest.webmanifest`, `icons/`: lo que permite instalarla en el móvil.
- `tests/`: las pruebas, que definen qué debe hacer cada función.

## Ejecutar los tests (necesitas Node.js 20 o superior)
```
node --test
```
Al principio fallarán casi todos. Ve implementando funciones en
`src/conversor.js` hasta que pasen todos.

## Ver la app en tu ordenador
Los módulos de JavaScript no funcionan abriendo el archivo directamente:
hace falta un servidor local. Desde la carpeta del proyecto:
```
python3 -m http.server 8000
```
y abre http://localhost:8000

## Publicarla y ponerla en el iPhone
1. Sube el proyecto a un repositorio de GitHub.
2. En el repositorio: Settings -> Pages -> despliega desde la rama `main`, carpeta raíz.
3. En unos minutos tendrás una URL con https.
4. Abre esa URL en **Safari** en el iPhone -> botón Compartir -> **Añadir a pantalla de inicio**.
5. Cuando publiques cambios, sube el número de versión de `CACHE` en `sw.js`.

## Chuleta de JavaScript (si vienes de C++ o Java)
- No hay tipos: `let x = 5;` y `const y = 3;` (const no se reasigna).
- Compara siempre con `===` y `!==`, no con `==`.
- Un error se lanza con `throw new Error("mensaje")`.
- `Math.floor`, `Math.round`, `Number.isInteger(x)`, `Number.isFinite(x)`.
- `a ** b` es "a elevado a b".
- Objetos: `{ h: 1, m: 5, s: 30 }`; se leen con `obj.h`.
- Una función se exporta con `export function nombre(...) { ... }`.

## Qué he aprendido / decisiones
(Rellena esto al terminar: qué te costó, qué decidiste y por qué.)
