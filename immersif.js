/* Nettoyage de l'ancien bloc de bienvenue en doublon.
   L'arbre principal et les livres en orbite sont conservés dans index.html. */
(function(){
  document.getElementById("benoli-univers-3d")?.remove();
  document.getElementById("benoli-univers-3d-style")?.remove();
})();

/* Arbre réaliste animé : chargé à part pour ne pas alourdir index.html.
   En cas d'échec, l'ancien arbre SVG reste affiché. */
(function(){
  if(document.querySelector('script[src^="arbre-realiste.js"]'))return;
  var s=document.createElement("script");
  s.src="arbre-realiste.js";s.defer=true;
  (document.body||document.documentElement).appendChild(s);
})();
