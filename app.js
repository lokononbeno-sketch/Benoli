/* =====================================================================
   1. RÉGLAGES — modifie ici
   ===================================================================== */
const CONFIG = {
  auteur: "Benoli",
  whatsapp: "2290149293939"   // numéro sans + ni espaces
};

/* Textes de l'ASSISTANT — modifie-les comme tu veux.
   (Les résumés qu'il donne viennent du champ "resume" de chaque roman.) */
const ASSISTANT = {
  nom: "SALOMÉ",
  achat: "Ouvre la fiche du roman, puis touche « Acheter ». Tu arrives sur la page de paiement : suis les instructions affichées.",
  lecture: "Chaque fiche contient un extrait gratuit. Lis-le avant d'acheter pour savoir si l'histoire te plaît.",
  regles: [
    "Le roman acheté est pour toi seul : ne le partage pas et ne le revends pas.",
    "Ne copie pas le texte pour le publier ailleurs.",
    "Garde bien le lien ou le fichier reçu après ton achat.",
    "En cas de problème de paiement ou d'accès, écris à Benoli sur WhatsApp."
  ]
};

/* =====================================================================
   3. PROGRAMME — pas besoin d'y toucher
   ===================================================================== */
const $ = s => document.querySelector(s);
const norm = s => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/œ/g, "oe");
const esc = s => (s || "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const prix = n => n.toLocaleString("fr-FR") + " FCFA";

function couverture(r, i) {
  const img = r.couverture ? `<img src="${esc(r.couverture)}" alt="Couverture de ${esc(r.titre)}" loading="lazy" decoding="async">` : "";
  return `<div class="cv" style="--h:${(i * 47 + 150) % 360}">${r.couverture ? img : `<span>${esc(r.titre)}</span>`}</div>`;
}

const ROMANS_VEDettes = ["elle-m-appelait-checo", "cobi", "la-maison-d-en-face"];
function romansEnVedette() {
  const selection = ROMANS_VEDettes.map(id => ROMANS.find(r => r.id === id)).filter(Boolean);
  return selection.length ? selection : ROMANS.slice(0, 3);
}

function afficherListe() {
  const q = norm($("#q").value.trim());
  const liste = ROMANS.map((r, i) => ({ r, i })).filter(({ r }) =>
    norm([r.titre, r.sousTitre, r.genre, r.resume].join(" ")).includes(q));
  $("#nb").textContent = q ? `${liste.length} résultat(s)` : "";
  $("#grille").innerHTML = liste.length ? liste.map(({ r, i }) => `
    <a class="livre" href="#/${r.id}">
      ${couverture(r, i)}
      <h3 class="serif">${esc(r.titre)}</h3>
      <p>${prix(r.prix)}</p>
    </a>`).join("") : q
      ? `<p class="vide">Aucun roman ne correspond à ta recherche. Essaie un autre mot.</p>`
      : `<p class="vide">Le catalogue sera bientôt disponible.</p>`;
}

function afficherCarrousel() {
  const track = document.getElementById("benoli-book-track");
  const count = document.getElementById("benoli-count");
  if (!track || !Array.isArray(ROMANS)) return;
  if (count) count.textContent = `${ROMANS.length} ${ROMANS.length > 1 ? "œuvres" : "œuvre"}`;
  track.innerHTML = romansEnVedette().map(r => `
    <a class="benoli-book-card" href="#/${r.id}">
      <img src="${esc(r.couverture || "")}" alt="Couverture de ${esc(r.titre)}" loading="lazy" decoding="async">
      <strong>${esc(r.titre)}</strong><small>Lokonon B. Tiziano</small>
    </a>
  `).join("");
}

function afficherFiche(id) {
  const i = ROMANS.findIndex(r => r.id === id);
  if (i < 0) return fermerFiche();
  const r = ROMANS[i];
  const wa = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Bonjour, je suis intéressé(e) par « " + r.titre + " ».")}`;
  const paragraphes = t => t.split("\n").filter(Boolean).map(p => `<p>${esc(p)}</p>`).join("");
  $("#ficheContenu").innerHTML = `
    <a class="retour" href="#">← Catalogue</a>
    <div class="haut">
      ${couverture(r, i)}
      <div>
        <h2>${esc(r.titre)}</h2>
        ${r.sousTitre ? `<p class="ss">${esc(r.sousTitre)}</p>` : ""}
        <span class="etiq">${esc(r.genre)} • ${prix(r.prix)}</span>
      </div>
    </div>
    <div class="bloc"><h3>Résumé</h3>${r.resume ? paragraphes(r.resume) : `<p class="attente">Le résumé arrive bientôt.</p>`}</div>
    <div class="bloc"><h3>Extrait gratuit</h3>
      <div class="extrait">${r.extrait ? paragraphes(r.extrait) + `<p class="attente">La suite est dans la version complète…</p>` : `<p class="attente">L'extrait gratuit arrive bientôt.</p>`}</div>
    </div>
    <div class="actions">
      ${r.lienAchat
        ? `<a class="btn" href="${esc(r.lienAchat)}" target="_blank" rel="noopener">Acheter le roman • ${prix(r.prix)}</a>`
        : `<span class="btn off">Achat bientôt disponible</span>`}
      <a class="btn sec" href="${wa}" target="_blank" rel="noopener">Poser une question sur WhatsApp</a>
    </div>
    ${r.lienAchat ? `<p class="securite-achat">Le paiement s\u2019effectue sur la page d\u2019achat indiqu\u00e9e. Ne communique jamais ton code PIN Mobile Money, ton mot de passe ni un code de validation.</p>` : ""}
    <div class="partage">${partageHtml(lienApp() + "#/" + r.id, "Je te conseille « " + r.titre + " » de Benoli : lis l'extrait gratuit.", "Partager ce roman")}</div>`;
  $("#fiche").classList.add("ouverte");
  $("#fiche").scrollTop = 0;
  document.body.classList.add("fige");
  document.title = r.titre + " • Benoli Littéraire";
}

function fermerFiche() {
  $("#fiche").classList.remove("ouverte");
  document.body.classList.remove("fige");
  document.title = "Benoli Littéraire";
}


function route() {
  const m = location.hash.match(/^#\/(.+)$/);

  if (!m) {
    fermerFiche();
    return;
  }

  const id = decodeURIComponent(m[1].split("?")[0]);

  if (id === "communaute") { fermerFiche(); document.body.classList.remove("fige"); return; }

  if (id === "romans") {
    fermerFiche();
    document.body.classList.remove("fige");
    document.title = "Mes romans • Benoli Littéraire";

    const catalogue = document.querySelector("#catalogue");
    if (catalogue) {
      catalogue.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  if (Object.prototype.hasOwnProperty.call(PAGES, id)) {
    afficherPage(id);
  } else {
    afficherFiche(id);
  }
}

$("#nomAuteur").textContent = CONFIG.auteur;
$("#annee").textContent = new Date().getFullYear();
/* Accueil : compteur des rubriques calculé sur les cartes réellement affichées. */
(function actualiserCompteurRubriques(){
  const grille = document.querySelector(".accueil-grille");
  const compteur = document.querySelector(".accueil-numero");
  if (!grille || !compteur) return;
  const total = grille.querySelectorAll(".accueil-rubrique").length;
  compteur.textContent = total + (total > 1 ? " espaces à explorer" : " espace à explorer");
})();
$("#q").addEventListener("input", afficherListe);
window.addEventListener("hashchange", route);

/* ---------- Auteur, pages légales et partage ---------- */
const AUTEUR = {
  nom: "Benoli Lokonon",
  plume: "Lokonon B. Tiziano",
  photo: "auteur.jpg",
  bio: `Benoli Olivier Tiziano Houégnon Lokonon, connu sous le nom de plume Lokonon B. Tiziano, est un jeune auteur béninois passionné par la création d'histoires et l'exploration des émotions humaines.
Depuis son enfance, il possède une imagination débordante et nourrit dans son esprit de nombreuses idées, des histoires et des univers qu'il ne savait pas encore comment exprimer. C'est en découvrant les possibilités qu'offrait l'écriture qu'il a trouvé un moyen de donner vie à cet imaginaire et de le partager avec les autres. Il se consacre à l'écriture de romans depuis environ un an.
Ses formations en informatique et en graphisme lui ont également permis de développer des compétences utiles à la réalisation de ses œuvres, notamment dans la conception et la création de leurs couvertures.
À travers ses romans numériques, Lokonon B. Tiziano explore principalement l'amour, les relations humaines, les secrets de famille, les rivalités, les révélations inattendues et certaines réalités de la société. Ses histoires s'intéressent aux événements, aux blessures et aux choix qui peuvent transformer une personne : comment un homme autrefois doux, gentil et attentionné peut devenir renfermé et distant, comment une femme peut changer, ou encore comment les relations avec les proches peuvent être bouleversées par les épreuves de la vie.
Au-delà du divertissement et des émotions qu'il souhaite faire ressentir à ses lecteurs — la joie, la peur, la tristesse, la surprise ou l'angoisse —, l'auteur porte également une ambition de sensibilisation. Il souhaite interpeller particulièrement la jeune génération sur les comportements, les choix et les décisions qui peuvent influencer son avenir. À travers ses personnages et les situations qu'ils traversent, il invite chacun à réfléchir aux conséquences de ses actes, car certaines décisions prises aujourd'hui peuvent profondément marquer une vie demain.
Son premier roman, Elle m'appelait Chéco, occupe une place particulière dans son parcours. C'est une œuvre dans laquelle il a investi beaucoup d'émotions, au point de se sentir lui-même plongé dans les situations vécues par ses personnages. Il souhaite que ses lecteurs puissent, eux aussi, ressentir cette proximité avec les histoires, s'attacher aux personnages et vivre chaque événement comme s'ils y étaient.
Benoli Littéraire est né de cette volonté de partager son univers. Plus qu'un simple espace de présentation de romans, c'est une plateforme destinée à permettre aux lecteurs de découvrir ses œuvres, de lire, d'échanger et d'explorer progressivement un univers littéraire riche en émotions, en réflexions et en surprises.
Pour Lokonon B. Tiziano, chaque histoire est une occasion de faire rêver, de toucher les cœurs et, surtout, de laisser une réflexion dans l'esprit de ceux qui la découvrent.`,
  whatsapp: [
    { numero: "2290149293939", affiche: "+229 01 49 29 39 39" },
    { numero: "2290144699601", affiche: "+229 01 44 69 96 01" },
    { numero: "2290152865120", affiche: "+229 01 52 86 51 20" }
  ],
  facebook: [
    { nom: "Benoli Lokonon", url: "" },   // https://www.facebook.com/share/1cLghmL6nP/
    { nom: "Bé No", url: "" }             // https://www.facebook.com/share/1A5qKWPULN/
  ]
};
const TEXTE_PARTAGE = "Découvre les romans de Benoli : extraits gratuits, à lire sur ton téléphone.";
const lienApp = () => location.origin + location.pathname;
const lienWa = n => "https://wa.me/" + n;
const lienFb = f => f.url || "https://www.facebook.com/search/top?q=" + encodeURIComponent(f.nom);
const para = t => t.split("\n").filter(Boolean).map(p => `<p>${esc(p)}</p>`).join("");
const sections = l => l.map(([t, x]) => `<div class="bloc"><h3 class="serif">${esc(t)}</h3>${para(x)}</div>`).join("");

function partageHtml(lien, texte, titre) {
  const l = encodeURIComponent(lien), t = encodeURIComponent(texte + " " + lien);
  const gen = navigator.share ? `<button class="pbtn" type="button" data-act="partager" data-lien="${esc(lien)}" data-texte="${esc(texte)}">Partager…</button>` : "";
  return `<h3 class="serif">${esc(titre)}</h3><p>Envoie-le à tes amis en un clic.</p><div class="pbtns">${gen}<a class="pbtn" href="https://wa.me/?text=${t}" target="_blank" rel="noopener">WhatsApp</a><a class="pbtn" href="https://www.facebook.com/sharer/sharer.php?u=${l}" target="_blank" rel="noopener">Facebook</a><button class="pbtn" type="button" data-act="copier" data-lien="${esc(lien)}">Copier le lien</button></div>`;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  if (b.dataset.act === "partager") navigator.share({ title: "Benoli Littéraire", text: b.dataset.texte, url: b.dataset.lien }).catch(() => {});
  if (b.dataset.act === "copier") {
    (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.lien).then(() => { b.textContent = "Lien copié ✓"; }) : Promise.reject())
      .catch(() => window.prompt("Copie le lien :", b.dataset.lien));
  }
});

/* Textes légaux : modèle à relire et à adapter (surtout la section Livraison et remboursement) */
const MENTIONS = [
  ["Éditeur", `LOKONON Bénoli, auteur indépendant (nom de plume : Lokonon B. Tiziano), Bénin.
Contact : WhatsApp +229 01 49 29 39 39 ou +229 01 44 69 96 01 ou +229 01 52 86 51 20.`],
  ["Hébergement", `L'application est hébergée gratuitement par GitHub Pages (GitHub, Inc., San Francisco, États-Unis).`],
  ["Propriété intellectuelle", `Les romans, résumés, extraits, couvertures, textes et logos de Benoli Littéraire sont protégés par le droit d'auteur. © 2026 LOKONON Bénoli. Tous droits réservés.
Toute reproduction, diffusion ou utilisation, même partielle, sans l'autorisation écrite préalable de l'auteur est interdite.`],
  ["Œuvres de fiction", `Les romans sont des œuvres de fiction. Toute ressemblance avec des personnes réelles, vivantes ou décédées, des événements ou des lieux réels serait purement fortuite.`],
  ["Données personnelles", `Le profil local et les préférences de lecture sont enregistrés sur l'appareil et peuvent être perdus si les données du navigateur sont effacées. Pour utiliser la Communauté, un compte avec adresse e-mail et mot de passe est nécessaire. Le pseudonyme, les histoires envoyées, les réactions, les demandes d’amitié, la liste d’amis et les messages privés (y compris les messages vocaux) sont stockés sur le service Supabase de Benoli Littéraire afin d'assurer leur fonctionnement entre appareils. Les messages vocaux sont conservés dans un espace privé accessible uniquement aux membres de la conversation. L'adresse e-mail sert à l'authentification et n'est pas affichée aux autres lecteurs. Les histoires ne sont visibles publiquement qu'après validation. Évite de partager des informations sensibles dans les messages ou les histoires. Les liens externes (WhatsApp, Facebook, pages d'achat) obéissent aux règles des sites concernés.`]
];
const CONDITIONS = [
  ["Extraits gratuits", `Les extraits sont offerts pour une lecture personnelle et gratuite. Il est interdit de les copier ou de les republier.`],
  ["Achat", `Les romans sont vendus en version numérique, au prix indiqué en FCFA sur chaque fiche. Le paiement se fait sur la plateforme indiquée par le bouton « Acheter » (par exemple par Mobile Money). Les conditions de cette plateforme s'appliquent aussi.`],
  ["Usage personnel", `Ton achat te donne le droit de lire le roman pour toi seul, sur tes propres appareils.
Il est interdit de partager le fichier, de le revendre, de le publier en ligne ou d'en copier le texte.`],
  ["Livraison et remboursement", `Le roman est un produit numérique livré après le paiement. Par nature, il n'est en principe ni repris ni remboursé.
Si le fichier est illisible, incomplet ou ne t'a pas été livré, écris à l'auteur sur WhatsApp dans les 7 jours : le problème sera corrigé ou le montant remboursé.`],
  ["Disponibilité", `L'auteur fait de son mieux pour garder l'application accessible, mais ne peut pas garantir un accès permanent.`],
  ["Droit applicable et modifications", `Ces conditions sont régies par les lois en vigueur au Bénin. Elles peuvent évoluer : la version affichée dans l'application fait foi.`]
];
const PAGES = {
  "a-propos": () => `
    <img class="portrait" src="${esc(AUTEUR.photo)}" alt="Portrait de ${esc(AUTEUR.nom)}" loading="lazy" decoding="async" onerror="this.remove()">
    <h2 class="serif">${esc(AUTEUR.nom)}</h2>
    <p class="attente">Nom de plume : ${esc(AUTEUR.plume)}</p>
    <div class="bloc">${para(AUTEUR.bio)}</div>
    <div class="bloc"><h3 class="serif">Me contacter</h3><div class="actions">
      ${AUTEUR.whatsapp.map((w, i) => `<a class="btn${i ? " sec" : ""}" href="${lienWa(w.numero)}" target="_blank" rel="noopener">WhatsApp ${esc(w.affiche)}</a>`).join("")}
      ${AUTEUR.facebook.map(f => `<a class="btn sec" href="${esc(lienFb(f))}" target="_blank" rel="noopener">Facebook : ${esc(f.nom)}</a>`).join("")}
    </div></div>
    <div class="partage">${partageHtml(lienApp(), TEXTE_PARTAGE, "Partager l'application")}</div>`,
  "lyrics": () => `
    <section class="lyrics-entete">
      <span class="lyrics-note">♫</span>
      <div><p class="lyrics-surtitre">L'univers musical de Benoli</p><h2 class="serif">Lyrics & musiques</h2>
      <p>Les histoires se lisent… et se vivent aussi en musique.</p></div>
    </section>
    <div class="lyrics-intro"><strong>Une chanson, un roman, une émotion.</strong><br>Retrouve ici les créations audio associées aux romans de Benoli Littéraire.</div>
    <div class="lyrics-liste">
      <article class="lyrics-carte">
        <img class="lyrics-couverture" src="Chéco.png" alt="Couverture de Elle m'appelait Chéco" loading="lazy">
        <div class="lyrics-infos"><span class="lyrics-tag">Chanson du roman</span><h3>Elle m'appelait Chéco</h3><p>Associée au roman <strong>Elle m'appelait Chéco</strong></p>
        <audio controls preload="metadata"><source src="audio/Screenrecorder-2026-10-26-19-49-56-813_20261026_195322.mp3" type="audio/mpeg">Ton navigateur ne prend pas en charge la lecture audio.</audio><small class="lyrics-duree">Durée : calcul en cours…</small></div>
      </article>
      <article class="lyrics-carte">
        <img class="lyrics-couverture" src="La-maison-d'en-face.png" alt="Couverture de La Maison d'en face" loading="lazy">
        <div class="lyrics-infos"><span class="lyrics-tag">Chanson du roman</span><h3>La Maison d'en face — Tome 1</h3><p>Associée au premier tome de <strong>La Maison d'en face</strong></p>
        <audio controls preload="metadata"><source src="audio/Screenrecorder-2026-10-26-19-29-27-868_20261026_193345.mp3" type="audio/mpeg">Ton navigateur ne prend pas en charge la lecture audio.</audio><small class="lyrics-duree">Durée : calcul en cours…</small></div>
      </article>
      <article class="lyrics-carte">
        <img class="lyrics-couverture" src="Je-ne-suis-pas-ce-qu'ils-ont-fait-de-moi.png" alt="Couverture de Je ne suis pas ce qu'ils ont fait de moi" loading="lazy">
        <div class="lyrics-infos"><span class="lyrics-tag">Chanson du roman</span><h3>Je ne suis pas ce qu'ils ont fait de moi</h3><p>Associée au roman du même titre</p>
        <audio controls preload="metadata"><source src="audio/Screenrecorder-2026-10-26-20-02-25-196_20261026_200549.mp3" type="audio/mpeg">Ton navigateur ne prend pas en charge la lecture audio.</audio><small class="lyrics-duree">Durée : calcul en cours…</small></div>
      </article>
      <article class="lyrics-carte">
        <img class="lyrics-couverture" src="La-maison-d'en-face.png" alt="Couverture de La Maison d'en face" loading="lazy">
        <div class="lyrics-infos"><span class="lyrics-tag">Chanson du roman</span><h3>La Maison d'en face — Tome 2</h3><p>Associée au deuxième tome de <strong>La Maison d'en face</strong></p>
        <audio controls preload="metadata"><source src="audio/Screenrecorder-2026-10-26-20-07-55-169_20261026_201002.mp3" type="audio/mpeg">Ton navigateur ne prend pas en charge la lecture audio.</audio><small class="lyrics-duree">Durée : calcul en cours…</small></div>
      </article>
      <article class="lyrics-carte">
        <img class="lyrics-couverture" src="La-maison-d'en-face.png" alt="Couverture de La Maison d'en face" loading="lazy">
        <div class="lyrics-infos"><span class="lyrics-tag">Chanson du roman</span><h3>La Maison d'en face — Tome 3</h3><p>Associée au troisième tome de <strong>La Maison d'en face</strong></p>
        <audio controls preload="metadata"><source src="audio/Screenrecorder-2026-10-26-20-20-27-633_20261026_202339.mp3" type="audio/mpeg">Ton navigateur ne prend pas en charge la lecture audio.</audio><small class="lyrics-duree">Durée : calcul en cours…</small></div>
      </article>
    </div>
    <p class="lyrics-bas">🎧 Installe-toi confortablement et laisse la musique prolonger la lecture.</p>
  `,
  "mentions": () => `<h2 class="serif">Mentions légales</h2>` + sections(MENTIONS),
  "conditions": () => `<h2 class="serif">Conditions d'utilisation et d'achat</h2>` + sections(CONDITIONS)
};
function afficherPage(id) {
  $("#ficheContenu").innerHTML = `<a class="retour" href="#">← Catalogue</a><div class="page">${PAGES[id]()}</div><div style="height:40px"></div>`;
  $("#ficheContenu").querySelectorAll(".lyrics-carte").forEach(carte => {
    const audio = carte.querySelector("audio"), label = carte.querySelector(".lyrics-duree");
    const afficherDuree = () => {
      if (!Number.isFinite(audio.duration)) return;
      const total = Math.floor(audio.duration), minutes = Math.floor(total / 60), secondes = total % 60;
      label.textContent = "Durée : " + minutes + ":" + String(secondes).padStart(2, "0");
    };
    audio.addEventListener("loadedmetadata", afficherDuree);
    audio.addEventListener("durationchange", afficherDuree);
    if (audio.readyState >= 1) afficherDuree();
  });
  $("#fiche").classList.add("ouverte");
  $("#fiche").scrollTop = 0;
  document.body.classList.add("fige");
  document.title = "Benoli Littéraire";
}
const ph = $("#photoAuteur");
ph.addEventListener("error", () => ph.remove());
ph.src = AUTEUR.photo;
$("#partageAccueil").innerHTML = partageHtml(lienApp(), TEXTE_PARTAGE, "Partager l'application");
const waAction = document.getElementById("benoli-wa-action");
if (waAction) waAction.href = `https://wa.me/${CONFIG.whatsapp}`;
(function initBenoliAppearance(){
  const root = document.documentElement, button = document.getElementById("benoli-theme-toggle");
  let saved = "light";
  try { saved = localStorage.getItem("benoli-appearance") || "light"; } catch (_) {}
  const apply = mode => {
    const dark = mode === "dark"; root.dataset.benoliAppearance = dark ? "dark" : "light";
    if (button) { button.setAttribute("aria-pressed", String(dark)); button.setAttribute("aria-label", dark ? "Activer le mode clair" : "Activer le mode sombre");
      button.innerHTML = dark ? '<span class="theme-icon" aria-hidden="true">☀</span><span class="theme-label">Mode jour</span>' : '<span class="theme-icon" aria-hidden="true">☾</span><span class="theme-label">Mode nuit</span>'; }
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = dark ? "#111713" : "#FBF6EC";
  };
  apply(saved === "dark" ? "dark" : "light");
  if (button) button.addEventListener("click", () => { const next = root.dataset.benoliAppearance === "dark" ? "light" : "dark"; try { localStorage.setItem("benoli-appearance", next); } catch (_) {} apply(next); });
})();

/* ---------- Assistant ---------- */
const aPanel = $("#assistant"), aMsgs = $("#aMsgs"), aIn = $("#aIn");
const lien = r => `<a href="#/${r.id}">${esc(r.titre)}</a>`;
const liste = () => "<ul>" + ROMANS.map(r => `<li>${lien(r)}</li>`).join("") + "</ul>";
const mini = Math.min(...ROMANS.map(r => r.prix));
const mots = s => norm(s).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length >= 4 && !["elle", "mais", "pour", "dans", "avec", "quel", "quels", "comment", "veux", "voir", "parle", "moi"].includes(w));

function aDire(html) { const d = document.createElement("div"); d.className = "m bot"; d.innerHTML = html; aMsgs.appendChild(d); aMsgs.scrollTop = aMsgs.scrollHeight; }
function aUser(t) { const d = document.createElement("div"); d.className = "m moi"; d.textContent = t; aMsgs.appendChild(d); aMsgs.scrollTop = aMsgs.scrollHeight; }
function aOuvrir(o) {
  aPanel.classList.toggle("ouvert", o);
  /* Sur mobile, suivre la hauteur visible lorsque le clavier virtuel s'ouvre. */
  if (o && window.visualViewport) {
    const ajuster = () => {
      const vv = window.visualViewport;
      aPanel.style.height = Math.max(220, Math.min(640, vv.height * 0.82)) + "px";
      aPanel.style.bottom = Math.max(0, window.innerHeight - vv.height - vv.offsetTop) + "px";
    };
    ajuster();
    if (!aPanel.__benoliViewportBound) {
      window.visualViewport.addEventListener("resize", ajuster);
      window.visualViewport.addEventListener("scroll", ajuster);
      aPanel.__benoliViewportBound = true;
    }
  } else if (!o) {
    aPanel.style.height = "";
    aPanel.style.bottom = "";
  }
  $("#aBtn").hidden = o;
  if (o && !aMsgs.children.length) aDire(`<p>Bonjour ! Je suis ${esc(ASSISTANT.nom)}. Je peux te présenter les romans, t'expliquer comment acheter et lire, et te rappeler les règles.</p><p>Que veux-tu savoir ?</p>`);
}

function trouverRoman(t) {
  const mq = mots(t); let best = null, sc = 0;
  ROMANS.forEach(r => {
    const mt = mots(r.titre), n = mt.filter(w => mq.includes(w)).length, s = mt.length ? n / mt.length : 0;
    if (n > 0 && s > sc) { sc = s; best = r; }
  });
  return sc >= .5 ? best : null;
}

function aRepondre(t) {
  const q = norm(t).replace(/[^a-z0-9 ]/g, " ").replace(/\\s+/g, " ").trim();
  const a = (...m) => m.some(x => q.includes(norm(x)));
  const wa = `https://wa.me/${CONFIG.whatsapp}`;
  const r = trouverRoman(t);

  // Salutations et échanges simples
  if (a("bonjour", "salut", "bonsoir", "hello", "coucou", "bjr", "bsr", "bon matin", "bonne soiree")) {
    return "<p>Bonjour et bienvenue sur Benoli Littéraire ! 😊</p><p>Je suis Salomé, ton assistante. Comment puis-je t'aider aujourd'hui ?</p><p>On peut découvrir les romans, chercher une lecture, parler des achats ou explorer les rubriques du site.</p>";
  }
  if (a("comment vas tu", "comment tu vas", "ca va", "tu vas bien", "comment allez vous")) {
    return "<p>Je vais très bien, merci ! 😊 Je suis heureuse de t'accueillir sur Benoli Littéraire.</p><p>Et toi, comment vas-tu ? Tu veux qu'on parle lecture ou que je t'aide à utiliser le site ?</p>";
  }
  if (a("merci", "je te remercie", "thanks", "c est gentil")) {
    return "<p>Avec grand plaisir ! 💚 C'est toujours un plaisir de t'aider.</p><p>Si tu as une autre question, je suis là.</p>";
  }
  if (a("au revoir", "a bientot", "bonne nuit", "a plus", "a la prochaine")) {
    return "<p>À très bientôt sur Benoli Littéraire ! 📚 Merci pour ta visite et bonne continuation à toi.</p>";
  }
  if (a("qui es tu", "tu es qui", "ton nom", "presente toi", "qui etes vous")) {
    return "<p>Je m'appelle Salomé. 😊 Je suis l'assistante virtuelle de Benoli Littéraire.</p><p>Je suis là pour te guider dans le catalogue, te présenter les romans de Benoli, t'expliquer les achats et t'aider à découvrir les différentes rubriques du site.</p>";
  }
  if (a("que peux tu faire", "comment peux tu m aider", "tes fonctionnalites", "aide moi", "aide")) {
    return "<p>Bien sûr ! Voici ce que je peux faire avec toi :</p><ul><li>Présenter les romans et leurs résumés.</li><li>Te conseiller une lecture selon tes goûts.</li><li>T'expliquer comment lire un extrait ou acheter un roman.</li><li>Te guider vers tes favoris et ton carnet de lecture.</li><li>Te faire découvrir les quiz et les pensées pour la vie.</li><li>Te donner les moyens de contacter Benoli.</li></ul><p>Dis-moi simplement ce que tu recherches.</p>";
  }

  if (r) {
    const res = r.resume ? esc(r.resume).replace(/\\n/g, "<br>") : "Le résumé détaillé arrive bientôt.";
    return `<p><b>${esc(r.titre)}</b>${r.sousTitre ? "<br><i>" + esc(r.sousTitre) + "</i>" : ""}</p><p>${res}</p><p>${prix(r.prix)} • <a href="#/${r.id}">Voir la fiche et l'extrait gratuit</a></p><p>Je ne dévoile jamais la fin. 😊</p>`;
  }
  if (a("spoil", "la fin", "denouement")) return "<p>Je préfère préserver le plaisir de la découverte ! Je ne dévoile pas la fin d'un roman. Donne-moi son titre et je te présenterai son résumé sans spoiler.</p>";
  if (a("favori", "favoris")) return `<p>Tu peux retrouver tes romans préférés dans <a href="#/favoris">Mes favoris ❤️</a>. Depuis la fiche d'un roman, touche « Ajouter aux favoris » pour l’enregistrer sur cet appareil.</p>`;
  if (a("carnet", "mes notes", "note de lecture")) return '<p>Ton <a href="#/carnet">carnet de lecture 📔</a> te permet de noter les livres lus et tes impressions. Les notes restent enregistrées dans le navigateur de cet appareil.</p>';
  if (a("nouveaute", "nouveautes", "nouveau roman", "derniere parution")) return '<p>Retrouve la rubrique <a href="#/nouveautes">Nouveautés</a> pour consulter les annonces et les prochaines parutions de Benoli.</p>';
  if (a("quiz", "jeu", "defi", "test quel roman")) return '<p>Tu peux jouer aux <a href="#/quiz">quiz et tests littéraires</a> pour voir ce que tu connais des romans ou découvrir celui qui pourrait te plaire. 🎯</p>';
  if (a("pensee", "sagesse", "citation", "pensee du jour")) return '<p>La rubrique <a href="#/sagesse">Pensées pour la vie</a> rassemble des pensées autour de plusieurs thèmes. 💡</p>';
  if (a("mention", "condition", "remboursement", "legal")) return '<p>Tu peux consulter les <a href="#/conditions">conditions d’achat</a> et les <a href="#/mentions">mentions légales</a>.</p>';
  if (a("partag", "inviter", "faire connaitre")) return `<div class="partage" style="margin:0">${partageHtml(lienApp(), TEXTE_PARTAGE, "Partager l'application")}</div>`;
  if (a("regle", "interdit", "restriction", "partage", "pdf", "copier", "pirat", "droit", "procedure")) return "<p>Voici les règles à respecter :</p><ul>" + ASSISTANT.regles.map(x => `<li>${esc(x)}</li>`).join("") + "</ul>";
  if (a("acheter", "achat", "payer", "paiement", "prix", "combien", "mobile money", "momo", "cout")) return `<p>${mini === Math.max(...ROMANS.map(x => x.prix)) ? "Chaque roman coûte" : "Les romans coûtent à partir de"} ${prix(mini)}.</p><p>${esc(ASSISTANT.achat)}</p><p>Tu peux aussi ouvrir la fiche du roman qui t'intéresse pour voir son prix exact.</p>`;
  if (a("lire", "extrait", "gratuit", "lecture")) return `<p>${esc(ASSISTANT.lecture)}</p><p>Choisis un roman dans le catalogue :</p>${liste()}`;
  if (a("contact", "whatsapp", "probleme", "bug", "auteur", "benoli", "parler a quelqu un")) return `<p>Pour joindre Benoli, tu peux lui écrire directement sur <a href="${wa}" target="_blank" rel="noopener">WhatsApp</a>.</p><p>Tu peux aussi consulter la page <a href="#/a-propos">À propos de l'auteur</a>.</p>`;
  if (a("recommande", "conseille", "suggere", "que lire", "quoi lire", "genre", "theme", "amour", "histoire")) {
    const mq = mots(t).filter(w => w.length >= 5);
    const t1 = ROMANS.filter(x => mq.some(w => norm(x.resume + " " + x.genre).includes(w)));
    if (t1.length) return "<p>Voici quelques romans qui pourraient t'intéresser :</p><ul>" + t1.map(x => `<li>${lien(x)}</li>`).join("") + "</ul><p>Ouvre leur fiche pour lire les résumés et les extraits gratuits.</p>";
    return `<p>Avec plaisir ! Voici le catalogue de Benoli. Tu peux ouvrir chaque titre pour découvrir son histoire :</p>${liste()}`;
  }
  if (a("liste", "catalogue", "romans", "quels", "titres", "disponible")) return `<p>Voici les romans disponibles dans le catalogue de Benoli :</p>${liste()}`;
  if (a("site", "application", "rubrique", "menu", "naviguer")) return '<p>Tu peux explorer le catalogue, les <a href="#/nouveautes">Nouveautés</a>, tes <a href="#/favoris">Favoris</a>, ton <a href="#/carnet">Carnet de lecture</a>, les <a href="#/quiz">Quiz</a> et les <a href="#/sagesse">Pensées pour la vie</a>.</p>';
  return "<p>Je veux bien t'aider, mais je n'ai pas encore compris précisément ta demande. 😊</p><p>Tu peux me poser une question avec tes propres mots, par exemple : « Comment vas-tu ? », « Présente-moi un roman », « Comment acheter ? », « Où trouver mes favoris ? » ou « Conseille-moi une histoire d'amour ».</p><p>Si ta question concerne un problème personnel d'achat ou de paiement, je peux aussi t'orienter vers <a href=\"" + wa + "\" target=\"_blank\" rel=\"noopener\">Benoli sur WhatsApp</a>.</p>";
}

function aEnvoyer(t) { t = t.trim(); if (!t) return; aUser(t); aDire(aRepondre(t)); }
$("#aTitre").textContent = ASSISTANT.nom;
$("#aBtn").addEventListener("click", () => aOuvrir(true));
$("#aFermer").addEventListener("click", () => aOuvrir(false));
$("#aForm").addEventListener("submit", e => { e.preventDefault(); aEnvoyer(aIn.value); aIn.value = ""; });
aMsgs.addEventListener("click", e => { if (e.target.closest("a")) aOuvrir(false); });
["Quels romans ?", "Comment acheter ?", "Lire un extrait", "Les règles"].forEach(c => {
  const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = c;
  b.addEventListener("click", () => aEnvoyer(c)); $("#aChips").appendChild(b);
});


/* Défilement décoratif des couvertures des romans */
(function initBenoliCovers(){
  const root = document.getElementById("benoli-covers");
  const track = root && root.querySelector(".covers-track");
  if (!root || !track || !Array.isArray(ROMANS)) return;
  const items = romansEnVedette().filter(r => r.couverture);
  if (!items.length) { root.remove(); return; }
  const makeCard = (roman, duplicate = false) => {
    const card = document.createElement("div");
    card.className = "cover-card";
    const img = document.createElement("img");
    img.src = roman.couverture;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;
    card.appendChild(img);
    if (duplicate) card.setAttribute("aria-hidden", "true");
    return card;
  };
  items.forEach(r => track.appendChild(makeCard(r)));
  items.forEach(r => track.appendChild(makeCard(r, true)));
  track.addEventListener("error", e => {
    if (e.target && e.target.tagName === "IMG") e.target.closest(".cover-card")?.remove();
  }, true);
})();

afficherListe();
afficherCarrousel();
route();
  
/* Préférence de langue — la traduction complète sera activée avec les contenus multilingues */
(function initBenoliLanguage(){
 const select=document.getElementById("benoli-language");
 if(!select)return;
 let saved="fr";
 try{saved=localStorage.getItem("benoli-language")||"fr"}catch(_){}
 if([...select.options].some(o=>o.value===saved))select.value=saved;
 select.addEventListener("change",()=>{
   try{localStorage.setItem("benoli-language",select.value)}catch(_){}
   document.documentElement.lang=select.value;
 });
})();
