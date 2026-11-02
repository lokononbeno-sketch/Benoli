/* Apparence — polices, couleurs du drapeau du Bénin, effets allégés.
   Fichier indépendant et réversible : pour revenir en arrière, supprime « design.js »
   (et son nom dans la liste de chargement en tête de langue.js). */
(function () {
  "use strict";
  if (window.__benoliDesignReady) return;
  window.__benoliDesignReady = true;

  /* 1. Polices — l'ancien @import d'index.html était ignoré par le navigateur */
  const lien = document.createElement("link");
  lien.rel = "stylesheet";
  lien.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&family=Playfair+Display:wght@600..700&display=swap";
  document.head.appendChild(lien);

  const SANS = "'DM Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
  const SERIF = "'Playfair Display',Georgia,'Iowan Old Style',Palatino,serif";
  const police = () => {
    try { return JSON.parse(localStorage.getItem("benoli-reglages") || "{}").police || "moderne"; }
    catch (_) { return "moderne"; }
  };
  const stylePolice = document.createElement("style");
  stylePolice.id = "benoli-polices";
  document.head.appendChild(stylePolice);

  /* La police « Moderne » (choix par défaut des Réglages) utilise DM Sans et Playfair Display.
     Les autres choix de police des Réglages restent respectés. */
  const appliquerPolice = () => {
    stylePolice.textContent = police() === "moderne"
      ? "html body,html button,html input,html select,html textarea{font-family:" + SANS + " !important}" +
        "html .serif,html h1,html h2,html h3,html .score{font-family:" + SERIF + " !important}"
      : "";
  };
  appliquerPolice();
  document.addEventListener("click", e => {
    if (e.target.closest("[data-rg]")) setTimeout(appliquerPolice, 0);
  });

  /* 2. Drapeau du Bénin (vert, jaune, rouge) et effets allégés */
  const css = document.createElement("style");
  css.id = "benoli-design";
  css.textContent = [
    ".drapeau i:nth-child(1){background:#008751!important}",
    ".drapeau i:nth-child(2){background:#fcd116!important}",
    ".drapeau i:nth-child(3){background:#e8112d!important}",
    "header.hero .drapeau{width:64px!important;height:4px!important;opacity:1!important}",
    "*{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}",
    "header.hero:after,.accueil-hero:before{display:none!important}",
    "h1,header.hero h1{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#fff3d6!important;-webkit-text-fill-color:#fff3d6!important;text-shadow:none!important}",
    "header.hero .wrap,header.hero .sous,header.hero .auteur{text-shadow:none!important}",
    ".benoli-brand img{filter:none!important}",
    ".benoli-brand span{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#ffe3a3!important;-webkit-text-fill-color:#ffe3a3!important;text-shadow:none!important}",
    ".accueil-hero,.accueil-vedette-premium,.accueil-rubrique,.accueil-pensee,.partage,.aide-benoli{box-shadow:0 6px 16px rgba(0,0,0,.22)!important}",
    "#benoli-covers .cover-card{filter:none!important;box-shadow:0 8px 18px rgba(0,0,0,.4)!important}",
    "#navBas a span,#navBas a.actif span{filter:none!important}"
  ].join("\n");
  document.head.appendChild(css);
})();
