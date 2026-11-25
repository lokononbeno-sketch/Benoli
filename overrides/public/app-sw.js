const CACHE = 'benoli-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys()
    .then((k) => Promise.all(k.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
    .then(() => self.clients.claim())
));
// Réseau d'abord (toujours la dernière version), cache en secours hors connexion
self.addEventListener('fetch', (e) => {
  const r = e.request;
  const u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range') || u.pathname.endsWith('.mp3')) return;
  e.respondWith(
    fetch(r)
      .then((res) => {
        if (res.ok) { const c = res.clone(); caches.open(CACHE).then((x) => x.put(r, c)); }
        return res;
      })
      .catch(() => caches.match(r).then((m) => m || caches.match('./index.html')))
  );
});
