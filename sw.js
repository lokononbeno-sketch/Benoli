const V = "benoli-v34";
const FICHIERS = [
  "./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./maskable-512.png", "./assets/benoli-logo.svg",
  "./extras.js", "./stories.js", "./nouveautes.js", "./profil.js", "./univers.js", "./communaute.js",
  "./correctifs.js", "./design.js", "./langue.js", "./installer.js"
];

/* Chaque fichier est mis en cache séparément : si l'un manque,
   l'installation de l'appli n'échoue plus pour autant. */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(V).then(c => Promise.all(FICHIERS.map(f => c.add(f).catch(() => {}))))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const croisee = new URL(e.request.url).origin !== location.origin;
  /* Les ressources d'autres sites ne sont gardées que si ce sont des images
     (couvertures hébergées chez Chariow). */
  if (croisee && e.request.destination !== "image") return;

  e.respondWith(
    fetch(e.request).then(r => {
      /* On ne met en cache que les réponses complètes (200) ou opaques (images
         d'autres sites). Les réponses partielles (206) des fichiers audio
         faisaient échouer l'enregistrement. */
      if (r.status === 200 || r.type === "opaque") {
        const c = r.clone();
        caches.open(V).then(x => x.put(e.request, c)).catch(() => {});
      }
      return r;
    }).catch(() => caches.match(e.request).then(r =>
      r || (e.request.mode === "navigate" ? caches.match("./index.html") : Response.error())
    ))
  );
});
