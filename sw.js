const V = "benoli-v9";
const FICHIERS = [
  "./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./maskable-512.png",
  "./extras.js", "./stories.js", "./nouveautes.js", "./profil.js", "./univers.js"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FICHIERS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
