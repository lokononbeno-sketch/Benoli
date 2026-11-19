const V = "benoli-v52";
const FICHIERS = [
  "./", "./index.html", "./manifest.json", "./J-ai-appris-a-t-aimer-trop-tard.webp",
  "./icon-192.png", "./icon-512.png", "./maskable-512.png", "./assets/benoli-logo.svg", "./assets/benoli-intro.mp4",
  "./langue.js", "./installer.js", "./design.js", "./extras.js", "./gamification.js", "./notifications.js", "./stories.js", "./nouveautes.js", "./profil.js", "./univers.js", "./communaute.js", "./immersif.js", "./bibliotheque3d.js", "./pages-modernisation.js"
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
    fetch(e.request, {cache: "no-store"}).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
