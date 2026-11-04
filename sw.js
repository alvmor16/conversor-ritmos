// Service worker: permite usar la app sin conexión una vez cargada.
// Sube el número de versión cada vez que publiques cambios.
const CACHE = "ritmos-v1";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.webmanifest",
  "./src/app.js",
  "./src/conversor.js",
  "./src/resolver.js",
  "./icons/icon-180-v3.png",
  "./icons/icon-192-v3.png",
  "./icons/icon-512-v3.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Primero red (así ves los cambios), y si no hay conexión, caché.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })),
  );
});
