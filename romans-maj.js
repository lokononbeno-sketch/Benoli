/* BENOLI — Mises à jour du catalogue.
   Ajouter ou modifier un roman SANS toucher à index.html.

   AJOUTER un roman : enlève les /* et */ autour du modèle dans AJOUTS, puis change les textes.
   MODIFIER un roman : ajoute une ligne dans MODIFS avec l'id du roman et seulement les champs à changer.

   Règles : chaque texte court est entre guillemets "...", sans guillemet droit " à l'intérieur (utilise « comme ça »).
   Les textes longs (resume, extrait) sont entre accents graves, sans accent grave à l'intérieur. */
(function () {
  "use strict";
  if (typeof ROMANS === "undefined" || !Array.isArray(ROMANS)) return;

  const AJOUTS = [
    /* {
      id: "mon-nouveau-roman",
      titre: "Titre du roman",
      sousTitre: "Une phrase d'accroche.",
      genre: "Roman",
      prix: 1000,
      couverture: "Mon-roman.webp",
      lienAchat: "https://qlfzgouk.mychariow.shop/prd_xxxxxxxx",
      resume: `Le résumé du roman.`,
      extrait: `Un extrait du roman.`
    } */
  ];

  const MODIFS = {
    /* "cobi": { prix: 1500 } */
  };

  let change = false;
  AJOUTS.forEach(r => {
    if (r && r.id && !ROMANS.some(x => x.id === r.id)) { ROMANS.push(r); change = true; }
  });
  Object.keys(MODIFS).forEach(id => {
    const r = ROMANS.find(x => x.id === id);
    if (r) { Object.assign(r, MODIFS[id]); change = true; }
  });
  if (!change) return;

  try { if (typeof afficherListe === "function") afficherListe(); } catch (_) {}
  try { if (typeof afficherCarrousel === "function") afficherCarrousel(); } catch (_) {}
})();
