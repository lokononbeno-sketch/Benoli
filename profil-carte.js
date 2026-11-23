/* BENOLI — Carte de profil lecteur (style réseau social).
   - image de fond en haut : fichier profil-fond.jpg à la racine du dépôt (si absent, dégradé violet et or) ;
   - photo ronde avec anneau doré qui chevauche le fond (ou initiale si pas de photo) ;
   - pseudo, @identifiant, raccourcis Favoris / Carnet / Messages, puis les infos existantes.
   Ne modifie pas profil.js : il retouche la carte une fois affichée. */
(function () {
  "use strict";
  if (window.__benoliProfilCarte) return;
  window.__benoliProfilCarte = true;

  const style = document.createElement("style");
  style.textContent =
    ".pc-carte{padding:0!important;overflow:hidden;border-radius:18px}" +
    ".pc-couv{height:170px;background:linear-gradient(160deg,rgba(20,8,40,.15),rgba(20,8,40,.55)),linear-gradient(135deg,#2a1450,#5b2a86 55%,#c98a2b) center/cover no-repeat,url('profil-fond.jpg') center/cover no-repeat}" +
    ".pc-tete{display:flex;align-items:flex-end;gap:14px;padding:0 16px;margin-top:-58px}" +
    ".pc-anneau{width:116px;height:116px;border-radius:50%;padding:4px;flex:0 0 auto;background:conic-gradient(#ffd56b,#ff941d,#ff4fa3,#7b5cff,#ffd56b)}" +
    ".pc-photo,.pc-initiale{width:100%;height:100%;border-radius:50%;display:block;border:3px solid var(--carte,#111a2b);object-fit:cover;background:var(--carte,#111a2b)}" +
    ".pc-initiale{display:grid;place-items:center;font:800 44px Georgia,serif;color:#fff;background:linear-gradient(135deg,#7b5cff,#ff941d)}" +
    ".pc-nom{min-width:0;padding-bottom:6px}" +
    ".pc-nom h3{margin:0;font-size:1.35rem;overflow-wrap:anywhere}" +
    ".pc-nom p{margin:2px 0 0;color:var(--doux,#c3bfd3);font-size:.92rem;overflow-wrap:anywhere}" +
    ".pc-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:14px 16px 4px}" +
    ".pc-actions a{text-align:center;padding:10px 4px;border-radius:999px;border:1px solid var(--trait,#48516a);text-decoration:none;font-weight:750;font-size:.9rem;color:var(--encre,#f4f0e8)}" +
    ".pc-actions a.plein{background:linear-gradient(120deg,#ffd56b,#ff941d);color:#21142b;border-color:#ffe1a0}" +
    ".pc-infos{margin-top:10px}" +
    ".pc-infos p{margin:0;padding:11px 16px;border-top:1px solid var(--trait,rgba(190,158,255,.2));font-size:.93rem}" +
    "@media(max-width:380px){.pc-anneau{width:100px;height:100px}.pc-actions{grid-template-columns:1fr}}";
  document.head.appendChild(style);

  const construire = card => {
    if (!card || card.dataset.pc) return;
    card.dataset.pc = "1";
    card.classList.add("pc-carte");

    const section = card.closest(".bp");
    const titre = section ? section.querySelector("h2") : null;
    const pseudo = (titre ? titre.textContent : "")
      .replace(/^\s*Bienvenue,\s*/, "").replace(/\s*!\s*$/, "").trim() || "Lecteur";
    if (titre) titre.style.display = "none";

    const cover = document.createElement("div");
    cover.className = "pc-couv";

    const tete = document.createElement("div");
    tete.className = "pc-tete";
    const anneau = document.createElement("div");
    anneau.className = "pc-anneau";
    const img = card.querySelector("img.bp-avatar");
    if (img) {
      img.className = "pc-photo";
      img.removeAttribute("style");
      anneau.appendChild(img);
    } else {
      const ini = document.createElement("div");
      ini.className = "pc-initiale";
      ini.textContent = pseudo.charAt(0).toUpperCase();
      anneau.appendChild(ini);
    }
    const nom = document.createElement("div");
    nom.className = "pc-nom";
    const h3 = document.createElement("h3");
    h3.textContent = pseudo;
    const at = document.createElement("p");
    at.textContent = "@" + pseudo.toLowerCase().replace(/\s+/g, "_");
    nom.appendChild(h3);
    nom.appendChild(at);
    tete.appendChild(anneau);
    tete.appendChild(nom);

    const actions = document.createElement("div");
    actions.className = "pc-actions";
    actions.innerHTML =
      '<a class="plein" href="#/favoris">❤️ Favoris</a>' +
      '<a href="#/carnet">📔 Carnet</a>' +
      '<a href="#/communaute">✉️ Messages</a>';

    const infos = document.createElement("div");
    infos.className = "pc-infos";
    card.querySelectorAll(":scope > p").forEach(p => infos.appendChild(p));

    card.textContent = "";
    card.appendChild(cover);
    card.appendChild(tete);
    card.appendChild(actions);
    card.appendChild(infos);
  };

  const analyser = () => {
    const card = document.querySelector("#ficheContenu .bp-profile-card");
    if (card && !card.dataset.pc) construire(card);
  };
  new MutationObserver(analyser).observe(document.body, { childList: true, subtree: true });
  analyser();
})();
