/* Espace personnel — Benoli Littéraire
   Favoris et carnet conservés sur cet appareil (localStorage).
*/
(() => {
  if (typeof PAGES === "undefined" || typeof ROMANS === "undefined") return;

  const lire = (cle, defaut) => {
    try { const v = JSON.parse(localStorage.getItem(cle) || "null"); return v ?? defaut; }
    catch (_) { return defaut; }
  };
  const sauver = (cle, valeur) => {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); return true; }
    catch (_) { alert("Le stockage de cet appareil est indisponible ou plein."); return false; }
  };
  const echapper = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const FAVORIS = "benoli_favoris_v1";
  const CARNET = "benoli_carnet_lecture_v1";
  const NOUVEAUTES_IDS = [];

  PAGES.nouveautes = () => {
    const romans = NOUVEAUTES_IDS.map(id => ROMANS.find(r => r.id === id)).filter(Boolean);
    return `<h2 class="serif">Espace Nouveautés</h2>
      <p class="attente">Les dernières parutions et actualités de Benoli Littéraire.</p>
      ${romans.length ? `<div class="grille">${romans.map(r => `<a class="livre" href="#/${encodeURIComponent(r.id)}"><div class="cv"><img src="${echapper(r.couverture)}" alt=""></div><h3>${echapper(r.titre)}</h3><p>${echapper(r.sousTitre || "")}</p></a>`).join("")}</div>` : `<div class="bloc"><h3 class="serif">Restez au rendez-vous !</h3><p>Les prochaines nouveautés seront annoncées ici.</p><a class="btn" href="#/romans">Découvrir le catalogue</a></div>`}`;
  };

  function listeFavoris() { return lire(FAVORIS, []).filter(id => ROMANS.some(r => r.id === id)); }
  PAGES.favoris = () => {
    const ids = listeFavoris();
    if (!ids.length) return `<h2 class="serif">Mes favoris ❤️</h2><p class="attente">Tu n'as pas encore ajouté de roman à tes favoris.</p><a class="btn" href="#/romans">Parcourir les romans</a>`;
    return `<h2 class="serif">Mes favoris ❤️</h2><p class="attente">Tes romans préférés, enregistrés sur cet appareil.</p><div class="grille">${ids.map(id => { const r=ROMANS.find(x=>x.id===id); return `<a class="livre" href="#/${encodeURIComponent(r.id)}"><div class="cv"><img src="${echapper(r.couverture)}" alt=""></div><h3>${echapper(r.titre)}</h3><p>Ouvrir la fiche</p></a>`; }).join("")}</div>`;
  };

  const dateLocale = () => new Date().toISOString().slice(0,10);
  PAGES.carnet = () => {
    const entrees = lire(CARNET, []);
    return `<h2 class="serif">Mon carnet de lecture 📔</h2>
      <p class="attente">Note tes lectures et garde tes impressions privées sur cet appareil.</p>
      <form id="benoliCarnetForm" class="bloc">
        <label for="bcTitre"><b>Roman ou livre lu</b></label>
        <input id="bcTitre" required maxlength="100" placeholder="Titre du livre" style="display:block;width:100%;padding:12px;margin:6px 0 12px;border:1px solid var(--trait);border-radius:10px;background:var(--carte);color:var(--encre)">
        <label for="bcNote"><b>Ma note / mes impressions</b></label>
        <textarea id="bcNote" rows="4" maxlength="3000" placeholder="Ce que j'ai pensé de ma lecture..." style="display:block;width:100%;padding:12px;margin:6px 0 12px;border:1px solid var(--trait);border-radius:10px;background:var(--carte);color:var(--encre)"></textarea>
        <button class="btn" type="submit">Enregistrer dans mon carnet</button>
      </form>
      <h3 class="serif">Mes notes (${entrees.length})</h3>
      <div id="benoliCarnetListe">${entrees.length ? entrees.slice().reverse().map((e,i)=>`<article class="bloc extrait"><b>${echapper(e.titre)}</b><small style="display:block;color:var(--doux)">${echapper(e.date)}</small><p style="white-space:pre-wrap;margin-top:8px">${echapper(e.note)}</p><button type="button" class="btn sec" data-carnet-delete="${entrees.length-1-i}" style="margin-top:10px">Supprimer</button></article>`).join("") : '<p class="attente">Ton carnet est encore vide.</p>'}</div>
      <p class="attente">Tes notes restent dans le navigateur de cet appareil. Elles ne sont pas synchronisées avec d'autres téléphones.</p>`;
  };

  function ajouterBoutonFavori() {
    const haut = document.querySelector("#ficheContenu .haut");
    if (!haut || haut.querySelector("[data-benoli-favori]")) return;
    const titre = haut.querySelector("h2");
    const roman = ROMANS.find(r => r.titre === titre?.textContent);
    if (!roman) return;
    const b = document.createElement("button");
    b.type = "button"; b.dataset.benoliFavori = roman.id;
    b.className = "btn sec"; b.style.marginTop = "12px";
    const maj = () => { b.textContent = listeFavoris().includes(roman.id) ? "❤️ Retirer des favoris" : "♡ Ajouter aux favoris"; };
    maj(); b.addEventListener("click", () => {
      const ids=listeFavoris(); const next=ids.includes(roman.id)?ids.filter(x=>x!==roman.id):[...ids,roman.id];
      if(sauver(FAVORIS,next)) maj();
    });
    (titre?.parentElement || haut).appendChild(b);
  }
  const fiche = document.getElementById("ficheContenu");
  if (fiche && typeof MutationObserver !== "undefined") new MutationObserver(ajouterBoutonFavori).observe(fiche,{childList:true,subtree:true});
  ajouterBoutonFavori();

  document.addEventListener("submit", e => {
    if (e.target.id !== "benoliCarnetForm") return;
    e.preventDefault();
    const titre=document.getElementById("bcTitre").value.trim();
    const note=document.getElementById("bcNote").value.trim();
    if(!titre) return;
    const entries=lire(CARNET,[]);
    entries.push({titre,note,date:dateLocale()});
    if(sauver(CARNET,entries)) { const page=document.querySelector("#ficheContenu .page"); if(page) page.innerHTML=PAGES.carnet(); }
  });
  document.addEventListener("click", e => {
    const del=e.target.closest("[data-carnet-delete]");
    if(del) { const entries=lire(CARNET,[]); entries.splice(Number(del.dataset.carnetDelete),1); if(sauver(CARNET,entries)){const page=document.querySelector("#ficheContenu .page");if(page)page.innerHTML=PAGES.carnet();} }
  });

  /* Le menu principal contient déjà Nouveautés, Favoris, Quiz, Carnet et Installation.
     On ajoute uniquement la rubrique Pensée du jour si elle n'existe pas. */
  const menu = document.getElementById("benoliMenu");
  if (menu && !menu.querySelector('a[href="#/sagesse"]')) {
    const link = document.createElement("a");
    link.className = "bm-lien";
    link.href = "#/sagesse";
    link.innerHTML = '<span class="bm-emoji">💡</span> Pensée du jour';
    const head = menu.querySelector(".bm-entete");
    if (head) head.insertAdjacentElement("afterend", link);
    else menu.prepend(link);
  }
})();
