/* Nettoyage de l'ancien bloc de bienvenue en doublon.
   L'arbre principal et les livres en orbite sont conservés dans index.html. */
(function(){
  document.getElementById("benoli-univers-3d")?.remove();
  document.getElementById("benoli-univers-3d-style")?.remove();
})();

/* Chargement des modules indépendants : ajustements de l'interface (ajustements.js),
   petit bonhomme de la maison (mascotte.js), carte de profil lecteur (profil-carte.js),
   mise en page « discussions » de la communauté (communaute-style.js)
   et bannière de mise à jour (update-banner.js).
   Chaque fichier est indépendant : s'il échoue, le reste de l'application continue de fonctionner. */
(function(){
  try {
    if (window.__benoliAjustementsLoader) return;
    window.__benoliAjustementsLoader = true;
    ["ajustements.js", "mascotte.js", "profil-carte.js", "communaute-style.js", "update-banner.js"].forEach(function (nom) {
      const s = document.createElement("script");
      s.src = nom;
      document.body.appendChild(s);
    });
  } catch (_) {}
})();
