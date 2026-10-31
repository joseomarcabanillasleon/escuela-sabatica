// Guarda todos los juegos para que funcionen aunque falle el wifi del aula.
const CACHE = "detectives-v4";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./croacia/", "./croacia/index.html", "./leccion-6/", "./leccion-6/index.html", "./mision-kompas/", "./mision-kompas/index.html"]
  .concat(Array.from({length: 15}, (_, i) => `./croacia/slides/s${String(i + 1).padStart(2, "0")}.jpg`));
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); if (r.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match("./index.html"))));
});
