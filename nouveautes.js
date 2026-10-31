/* Espace Nouveautés — Benoli Littéraire
   Ajoutez ici les identifiants des romans à mettre en avant.
   Exemple : ["elle-m-appelait-checo", "cobi"]
*/
(() => {
  if (typeof PAGES === "undefined" || typeof ROMANS === "undefined") return;

  const NOUVEAUTES_IDS = [];

  PAGES.nouveautes = () => {
    const romans = NOUVEAUTES_IDS
      .map(id => ROMANS.find(r => r.id === id))
      .filter(Boolean);

    if (!romans.length) {
      return `
        <h2 class="serif">Espace Nouveautés</h2>
        <p class="attente">Les prochaines nouveautés de Benoli Littéraire seront annoncées ici.</p>
        <div class="bloc">
          <h3 class="serif">Restez au rendez-vous !</h3>
          <p>De nouveaux romans, extraits et annonces viendront enrichir cet espace.</p>
          <a class="btn" href="#/romans">Découvrir le catalogue</a>
        </div>`;
    }

    return `
      <h2 class="serif">Espace Nouveautés</h2>
      <p class="attente">Les dernières parutions et actualités de Benoli Littéraire.</p>
      <div class="grille nouveautes-grille">${romans.map(r => `
        <article class="carte">
          <img src="${r.couverture}" alt="Couverture de ${r.titre}" loading="lazy">
          <h3>${r.titre}</h3>
          <p>${r.sousTitre || ""}</p>
          <a class="btn" href="#/${encodeURIComponent(r.id)}">Découvrir</a>
        </article>`).join("")}</div>`;
  };
})();
