/* Nettoyage de l'ancien bloc de bienvenue en doublon.
   L'arbre principal et les livres en orbite sont conservés dans index.html. */
(function(){
  document.getElementById("benoli-univers-3d")?.remove();
  document.getElementById("benoli-univers-3d-style")?.remove();
})();

/* Chargement des ajustements de l'interface (ajustements.js).
   Fichier indépendant : s'il échoue, le reste de l'application continue de fonctionner. */
(function(){
  try {
    if (window.__benoliAjustementsLoader) return;
    window.__benoliAjustementsLoader = true;
    const s = document.createElement("script");
    s.src = "ajustements.js";
    document.body.appendChild(s);
  } catch (_) {}
})();
