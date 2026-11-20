/*=====================================================================
   extras.js — Sections QUIZ et PENSÉES POUR LA VIE de Benoli Littéraire.
   Pour modifier une question ou une pensée : cherche-la avec Ctrl+F.
   Chaque texte est entre guillemets "..." : n'écris jamais de guillemet
   droit " à l'intérieur (utilise « comme ça »).
   ===================================================================== */
(function () {
  if (typeof PAGES === "undefined" || typeof ROMANS === "undefined") return;

  /* ---------- 1. QUIZ : connais-tu les romans ? ----------
     q = question, o = 4 réponses, a = numéro de la bonne réponse (0 à 3),
     n = petite explication affichée après la réponse. */
  const QUIZ = [
    { q: "Quel surnom Lénis donne-t-elle à Benoli dans « Elle m'appelait Chéco » ?", o: ["Chéco", "Cobi", "Chef", "Coco"], a: 0, n: "Lénis l'appelle toujours « Chéco », un surnom que personne ne comprend vraiment." },
    { q: "Dans « Cobi », que veut dire le surnom « Cobi » pour Belvida ?", o: ["Court pour « Cobra »", "Le nom de leur association", "Un surnom d'enfance", "Le titre d'un livre"], a: 0, n: "Pour elle, c'est un garçon qui frappe froidement, sans jamais montrer ses émotions." },
    { q: "Pourquoi Bienvenue et Belvida doivent-ils travailler ensemble à l'université ?", o: ["Ils sont élus à la tête d'une même liste pour présider une association étudiante", "Ils sont voisins", "Ils préparent un voyage", "Ils jouent dans la même équipe"], a: 0, n: "Rivaux depuis le lycée, ils sont obligés de collaborer." },
    { q: "Dans « Je ne suis pas ce qu'ils ont fait de moi », qui est Ermine ?", o: ["Une fille de ministre", "La sœur de Lénis", "Une professeure", "Une voisine d'enfance"], a: 0, n: "Ermine est habituée à ce que tout le monde plie devant elle." },
    { q: "Dans quelle ville se passent « Je ne suis pas ce qu'ils ont fait de moi », « Ce que tu m'as coûté » et « Le Cœur de Fridaous » ?", o: ["Cotonou", "Porto-Novo", "Parakou", "Abomey"], a: 0, n: "Cotonou est le décor de plusieurs romans de Benoli." },
    { q: "Quel est le rêve de Kévin dans « Ce que tu m'as coûté » ?", o: ["Devenir footballeur", "Devenir médecin", "Devenir musicien", "Partir à l'étranger"], a: 0, n: "Kévin a quinze ans et un rêve : le football." },
    { q: "Pour qui Kévin est-il prêt à tout donner ?", o: ["Mélissa", "Jade", "Élodie", "Lénis"], a: 0, n: "Pour elle, il donne son temps, ses amis et ses rêves." },
    { q: "Qu'a Jade dans sa tête, dans « Elle choisit mal, mais c'est ta faute » ?", o: ["Une liste de ce qu'elle veut chez un homme", "Un plan pour voyager", "Un secret de famille", "Un projet d'entreprise"], a: 0, n: "Jade a des règles très précises, jusqu'à ce que quelqu'un les lui fasse oublier." },
    { q: "Quel homme charismatique et imprévisible fait oublier ses règles à Jade ?", o: ["Darel", "Nathan", "Gabriel", "Bienvenue"], a: 0, n: "Nathan, lui, est le bon garçon que personne ne choisit." },
    { q: "Dans « La Maison d'en face », comment s'appelle l'épouse de Richard Dossou ?", o: ["Élodie", "Mélissa", "Belvida", "Fridaous"], a: 0, n: "La mort de Richard bouleverse son existence." },
    { q: "Avec quel homme Élodie se remarie-t-elle ?", o: ["Gabriel Ahouansou", "Darel", "Nathan", "Kévin"], a: 0, n: "Un homme aussi attentionné qu'énigmatique." },
    { q: "Quelle formation Fridaous choisit-elle d'abord dans « Le Cœur de Fridaous » ?", o: ["L'informatique", "La couture", "La cuisine", "Le droit"], a: 0, n: "Puis la sérigraphie : elle avance, jour après jour." }
  ];

  /* ---------- 2. TEST : quel roman est fait pour toi ? ----------
     Chaque réponse donne un point aux romans indiqués. */
  const ID = { checo: "elle-m-appelait-checo", cobi: "cobi", jns: "je-ne-suis-pas-ce-qu-ils-ont-fait-de-moi", coute: "ce-que-tu-m-as-coute", choisit: "elle-choisit-mal", maison: "la-maison-d-en-face", fridaous: "le-coeur-de-fridaous" };
  const TEST = [
    { q: "Quel genre d'histoire te donne envie de tourner la page ?", o: [["Une rivalité qui change peu à peu", ["cobi", "checo"]], ["Un mystère où personne n'est ce qu'il paraît", ["maison"]], ["Un amour qui coûte tout", ["coute", "choisit"]], ["Une femme qui se bat pour sa place", ["jns", "fridaous"]]] },
    { q: "Dans une histoire, tu aimes surtout…", o: [["Les disputes qui cachent des sentiments", ["cobi"]], ["Les silences et les regards", ["checo", "coute"]], ["Les secrets de famille", ["maison"]], ["Les choix amoureux qui font débat", ["choisit"]]] },
    { q: "Le personnage que tu préfères :", o: [["Le rival brillant", ["cobi"]], ["Le meilleur ami fidèle", ["checo", "coute"]], ["La femme déterminée", ["jns", "fridaous"]], ["Celui qui cache quelque chose", ["maison", "choisit"]]] },
    { q: "L'ambiance qui te plaît :", o: [["Campus et ambitions", ["cobi", "checo"]], ["Quartiers et familles de Cotonou", ["maison", "fridaous"]], ["Pouvoir, apparences et jeux d'influence", ["jns"]], ["Cœurs brisés et reconstruction", ["coute"]]] },
    { q: "Tu veux finir le livre avec…", o: [["Le sourire", ["fridaous", "cobi"]], ["Un débat avec tes amis", ["choisit"]], ["Un frisson", ["maison", "jns"]], ["Les larmes", ["coute", "checo"]]] }
  ];

  /* ---------- 3. PENSÉES POUR LA VIE ---------- */
  const SAGESSE = {
    "Famille": [
      "Ta famille n'est pas parfaite, mais c'est la seule qui t'a vu grandir. Aime-la avec ses défauts, comme elle t'a aimé avec les tiens.",
      "On construit une maison avec des briques, mais on la tient debout avec le respect.",
      "Le vrai héritage qu'un parent laisse, ce n'est pas l'argent : c'est l'exemple.",
      "Appelle ceux qui t'aiment avant d'avoir besoin d'eux. Les liens se soignent dans les jours calmes.",
      "Ne laisse pas l'orgueil gagner contre un frère, une sœur ou un parent. Tu gagnerais une dispute et tu perdrais une présence."
    ],
    "Responsabilité": [
      "Grandir, ce n'est pas avoir plus de liberté. C'est apprendre à répondre de ses choix.",
      "On ne choisit pas toujours ce qui nous arrive, mais on choisit toujours ce qu'on en fait.",
      "Ce que tu repousses toujours à demain finit par t'écraser aujourd'hui.",
      "La parole donnée est une dette. Paie-la, même quand personne ne te la réclame.",
      "Excuse-toi quand tu te trompes. Ce n'est pas une faiblesse : c'est la preuve que tu grandis."
    ],
    "Paix": [
      "La paix ne se trouve pas là où il n'y a aucun bruit, mais là où tu n'as plus besoin de te battre contre toi-même.",
      "Tout n'a pas besoin de ta réponse. Parfois, le silence est la plus belle victoire.",
      "Pardonner, ce n'est pas dire que ça va. C'est cesser de porter un poids qui t'abîme plus que l'autre.",
      "Éloigne-toi de ce qui te vole ton calme, même si ça porte un joli nom.",
      "Un cœur en paix vaut mieux qu'une dispute gagnée."
    ],
    "Mort": [
      "La mort ne prévient pas. C'est pour ça que les mots tendres ne doivent jamais attendre.",
      "On ne pleure pas seulement ceux qui partent : on pleure tout ce qu'on voulait encore leur dire.",
      "Se rappeler qu'on est de passage rend plus doux avec les autres, et moins dur avec soi-même.",
      "Ceux qui nous ont aimés ne disparaissent pas tout à fait : ils continuent de parler dans nos gestes.",
      "Ne remets pas à plus tard l'appel, la visite, le pardon. Le « plus tard » n'est promis à personne."
    ],
    "Richesse": [
      "L'argent peut acheter un lit, pas le sommeil ; une maison, pas la paix.",
      "Ce n'est pas ce que tu gagnes qui te rend riche, mais ce que tu gardes, ce que tu partages et ce que tu apprends.",
      "Ne méprise pas les petits débuts : un grand arbre a d'abord été une graine que personne ne regardait.",
      "Celui qui compare sa vie à celle des autres ne sera jamais assez riche.",
      "La vraie richesse, c'est de pouvoir dire « j'ai assez » sans trembler."
    ],
    "Joie": [
      "La joie se cache souvent dans les petites choses : un repas partagé, un rire, un message qui arrive au bon moment.",
      "N'attends pas que tout soit parfait pour être heureux. Le bonheur vit déjà dans les jours ordinaires.",
      "Partage ta joie : elle grandit quand elle circule.",
      "Rire, c'est aussi une manière de tenir debout.",
      "Remercie pour ce qui est là aujourd'hui, avant de réclamer ce qui manque."
    ],
    "Tristesse": [
      "Pleurer n'est pas être faible : c'est laisser sortir ce que le cœur ne peut plus contenir.",
      "Une mauvaise période n'est pas toute une vie. C'est une saison : elle passe, même quand elle traîne.",
      "Tu n'as pas à porter seul ce qui te pèse. Parle à quelqu'un en qui tu as confiance.",
      "Ce qui t'a blessé t'a aussi montré où tu étais fragile. Tu pourras te protéger mieux, et aimer plus juste.",
      "Aujourd'hui, avancer d'un tout petit pas, c'est déjà avancer."
    ],
    "Colère": [
      "La colère est une alerte : écoute ce qu'elle dit, mais ne la laisse pas conduire.",
      "Avant de répondre en colère, respire. Les mots envoyés vite sont longs à réparer.",
      "On peut dire non, poser une limite et rester respectueux. La force n'a pas besoin de cris.",
      "Ne mets pas le feu à ta maison pour punir celui qui t'a blessé.",
      "Ce que tu dis dans ta colère raconte ta blessure, pas toujours la vérité."
    ],
    "Amour": [
      "Aimer, ce n'est pas se perdre : c'est se choisir ensemble, chaque jour.",
      "Quand l'amour te fait douter de ta valeur, ce n'est pas de l'amour qu'il te faut, mais du respect.",
      "Les mots doux font plaisir, mais ce sont les actes constants qui rassurent.",
      "Ne confonds pas intensité et sécurité : un cœur qui bat vite n'est pas toujours un cœur qui t'est destiné.",
      "Celui qui t'aime ne te demande pas d'être moins que toi pour se sentir grand."
    ]
  };

  /* =====================================================================
     PROGRAMME — pas besoin d'y toucher
     ===================================================================== */
  const CATS = Object.keys(SAGESSE);
  const PENSEES = [];
  CATS.forEach(c => SAGESSE[c].forEach(t => PENSEES.push({ c, t })));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const zone = () => $("#quizZone");

  /* --- Style --- */
  const st = document.createElement("style");
  st.textContent = `
body{padding-bottom:calc(100px + env(safe-area-inset-bottom))}
#fiche{padding-bottom:calc(100px + env(safe-area-inset-bottom))}
#aBtn{bottom:calc(108px + env(safe-area-inset-bottom))}
#navBas{
  position:fixed;left:9px;right:9px;bottom:calc(8px + env(safe-area-inset-bottom));
  z-index:25;display:flex;align-items:stretch;gap:4px;padding:6px;
  border:1px solid rgba(190,151,255,.62);border-radius:27px;
  background:linear-gradient(145deg,#292044 0%,#17172f 58%,#211735 100%);
  box-shadow:0 7px 24px rgba(0,0,0,.45),0 0 0 1px rgba(255,180,126,.10) inset,0 0 18px rgba(167,123,233,.16);
  padding-bottom:6px
}
#navBas a{
  flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  text-align:center;text-decoration:none;padding:8px 2px 7px;border:1px solid transparent;border-radius:21px;
  font-size:clamp(.64rem,2.8vw,.76rem);line-height:1.12;font-weight:650;color:#d1c9df;
  transition:background .2s ease,color .2s ease,transform .2s ease,box-shadow .2s ease
}
#navBas a span{display:block;font-size:1.42rem;line-height:1.05;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))}
#navBas a.actif{
  color:#fff2e8;border-color:rgba(255,166,107,.85);
  background:linear-gradient(145deg,rgba(255,151,91,.28),rgba(137,93,204,.18));
  box-shadow:0 0 13px rgba(255,151,91,.24),inset 0 1px rgba(255,239,220,.16)
}
#navBas a.actif span{filter:drop-shadow(0 0 7px rgba(255,157,99,.8))}
#navBas a:active{transform:scale(.96)}
#navBas a:focus-visible{outline:2px solid #ff9b60;outline-offset:-3px}
@media(max-width:360px){#navBas{left:5px;right:5px;gap:2px;padding:4px}#navBas a{font-size:.61rem;padding:7px 1px}#navBas a span{font-size:1.25rem}}
.qmeta{color:var(--doux);font-size:.88rem;margin:6px 0}
.qbar{height:6px;background:var(--trait);border-radius:99px;overflow:hidden;margin-bottom:16px}
.qbar i{display:block;height:100%;background:var(--or)}
.qtitre{font-size:1.25rem;line-height:1.3;margin-bottom:14px}
.qopts{display:grid;gap:10px}
.qopt{font:inherit;text-align:left;padding:14px 16px;border-radius:12px;border:1.5px solid var(--trait);background:var(--carte);color:var(--encre);cursor:pointer}
.qopt:focus-visible{outline:3px solid var(--or);outline-offset:2px}
.qopt.ok{border-color:var(--vert);background:color-mix(in srgb,var(--vert) 16%,var(--carte))}
.qopt.non{border-color:var(--rouge);background:color-mix(in srgb,var(--rouge) 14%,var(--carte))}
.qfb{margin:14px 0;padding:12px 14px;border-radius:12px;background:var(--carte);border:1px solid var(--trait);font-size:.95rem}
.qmenu{display:grid;gap:12px;margin:16px 0}
.qcarte{display:block;width:100%;text-align:left;font:inherit;padding:16px;border-radius:14px;border:1.5px solid var(--vert);background:var(--carte);color:var(--encre);cursor:pointer}
.qcarte b{display:block;font-family:Georgia,serif;font-size:1.1rem;margin-bottom:4px}
.qcarte span{color:var(--doux);font-size:.9rem}
.score{font-family:Georgia,serif;font-size:3rem;font-weight:700;color:var(--vert);line-height:1}
.scats{display:flex;gap:8px;overflow-x:auto;padding:4px 0 12px}
.scat{flex:none;font:inherit;font-size:.88rem;font-weight:600;padding:8px 14px;border-radius:99px;border:1.5px solid var(--vert);background:transparent;color:var(--vert);cursor:pointer}
.scat.actif{background:var(--vert);color:var(--sur-vert)}
.pjour{background:var(--vert);color:var(--sur-vert);border-radius:16px;padding:20px;margin:16px 0}
.pjour small{display:block;opacity:.85;margin-bottom:8px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-size:.75rem}
.pjour p{font-family:Georgia,serif;font-size:1.2rem;line-height:1.4}
.pjour .pbtn{border-color:var(--sur-vert);color:var(--sur-vert);margin:14px 8px 0 0}
.pcard{background:var(--carte);border:1px solid var(--trait);border-left:4px solid var(--or);border-radius:0 12px 12px 0;padding:14px 16px;margin:0 0 12px}
.pcard p{font-family:Georgia,serif;font-size:1.05rem;line-height:1.45;margin-bottom:10px}
.pcard footer{border:0;padding:0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;color:var(--doux);font-size:.82rem}
.pcard .pbtn{padding:7px 12px;font-size:.82rem}`;
  document.head.appendChild(st);

  /* --- Barre de navigation en bas --- */
  const nav = document.createElement("nav");
  nav.id = "navBas";
  nav.setAttribute("aria-label", "Sections");
  nav.innerHTML = `<a href="#" data-n="romans"><span>📖</span>Romans</a><a href="#/quiz" data-n="quiz"><span>🏆</span>Quiz</a><a href="#/sagesse" data-n="sagesse"><span>✨</span>Pensées</a>`;
  document.body.appendChild(nav);
  function majNav() {
    const h = location.hash, k = h === "#/quiz" ? "quiz" : h === "#/sagesse" ? "sagesse" : "romans";
    nav.querySelectorAll("a").forEach(a => a.classList.toggle("actif", a.dataset.n === k));
  }
  window.addEventListener("hashchange", majNav);
  majNav();

  /* --- Quiz --- */
  let Q = null, niveauQuiz = "facile";
  const niveauxQuiz = { facile: 5, moyen: 10, difficile: 15 };
  const menuQuiz = () => `<p class="attente">Choisis la difficulté, puis teste tes connaissances sur les romans de Benoli.</p>
  <div class="qmenu">
  <button class="qcarte" type="button" data-qa="difficulty" data-level="facile"><b>🌱 Facile</b><span>5 questions · 5 points par bonne réponse</span></button>
  <button class="qcarte" type="button" data-qa="difficulty" data-level="moyen"><b>📚 Moyen</b><span>10 questions · 10 points par bonne réponse</span></button>
  <button class="qcarte" type="button" data-qa="difficulty" data-level="difficile"><b>🔥 Difficile</b><span>${Math.min(15, QUIZ.length)} questions · 15 points par bonne réponse</span></button>
  <button class="qcarte" type="button" data-qa="start-test"><b>Quel roman est fait pour toi ?</b><span>${TEST.length} questions · ton résultat en 1 minute</span></button>
  </div>`;
  PAGES.quiz = () => { Q = null; return `<h2 class="serif">Quiz</h2><div id="quizZone">${menuQuiz()}</div>`; };
  PAGES.recompenses = () => {
    let r = {};
    try { const v = JSON.parse(localStorage.getItem("benoli-rewards-local-v1") || "{}"); if (v && typeof v === "object" && !Array.isArray(v)) r = v; } catch (_) {}
    const trophies = Array.isArray(r.trophies) ? r.trophies : [];
    const names = {"premier-quiz":"🎯 Premier quiz terminé","sans-faute":"⭐ Sans-faute","expert-benoli":"🏆 Expert Benoli"};
    return `<h2 class="serif">Mes récompenses</h2><p class="attente">Tes points et trophées gagnés dans les quiz, conservés sur cet appareil.</p>
    <div class="qmenu"><div class="qcarte"><b>🏆 ${Math.max(0, Number(r.points)||0)} points Benoli</b><span>Points cumulés grâce aux bonnes réponses</span></div>
    <div class="qcarte"><b>📚 ${Math.max(0, Number(r.quizPlayed)||0)} quiz terminés</b><span>Meilleur score : ${Math.round(Math.max(0, Number(r.bestScore)||0)*100)} %</span></div></div>
    <h3 class="serif" style="margin-top:22px">Mes trophées</h3>
    <div class="qmenu">${Object.keys(names).map(k => `<div class="qcarte"><b>${names[k]}</b><span>${trophies.includes(k) ? "Trophée obtenu ✓" : "À débloquer"}</span></div>`).join("")}</div>
    <a class="btn sec" href="#/quiz">Retour aux quiz</a>`;
  };

  const barre = (i, n) => `<p class="qmeta">Question ${i + 1} / ${n}</p><div class="qbar"><i style="width:${(i / n) * 100}%"></i></div>`;
  function questionHtml() {
    const q = Q.list[Q.i];
    return barre(Q.i, Q.list.length) + `<h3 class="serif qtitre">${esc(q.q)}</h3><div class="qopts">${q.o.map((o, k) => `<button class="qopt" type="button" data-qa="rep" data-k="${k}">${esc(o)}</button>`).join("")}</div><div id="qfb"></div>`;
  }
  function scoreHtml() {
    const n = Q.list.length, s = Q.score, points = Q.pointsEarned || 0;
    const msg = s >= n - 1 ? "Fan numéro 1 ! Tu connais l'univers de Benoli sur le bout des doigts." : s >= Math.ceil(n * 0.65) ? "Bravo, tu connais bien les romans !" : s >= Math.ceil(n * 0.4) ? "Pas mal ! Relis quelques extraits pour faire mieux." : "Tu as tout à découvrir : commence par un extrait gratuit.";
    const texte = `J'ai eu ${s}/${n} au quiz des romans de Benoli. Et toi ? ${lienApp()}#/quiz`;
    let meilleur = "";
    try {
      const h = JSON.parse(localStorage.getItem("benoli-quiz-history-v1") || "[]");
      const valid = Array.isArray(h) ? h.filter(x => x && Number.isFinite(x.score) && Number.isFinite(x.total) && x.total > 0) : [];
      if (valid.length) meilleur = `<p class="qmeta">Meilleur score enregistré : <b>${Math.max(...valid.map(x => Math.round(x.score / x.total * 100)))} %</b> · ${valid.length} partie(s)</p>`;
    } catch (_) {}
    return `<p class="qmeta">Ton résultat · difficulté ${esc(Q.level || "facile")}</p><div class="score">${s}/${n}</div><p class="qmeta">🏆 +${points} points Benoli gagnés</p>${meilleur}<p style="margin:12px 0 18px">${esc(msg)}</p><div class="actions" style="margin:0 0 30px"><a class="btn" href="https://wa.me/?text=${encodeURIComponent(texte)}" target="_blank" rel="noopener">Partager mon score sur WhatsApp</a><button class="btn sec" type="button" data-qa="start-quiz">Rejouer</button><a class="btn sec" href="#">Découvrir les romans</a></div>`;
  }
  function testQ() {
    const q = TEST[Q.i];
    return barre(Q.i, TEST.length) + `<h3 class="serif qtitre">${esc(q.q)}</h3><div class="qopts">${q.o.map((o, k) => `<button class="qopt" type="button" data-qa="tep" data-k="${k}">${esc(o[0])}</button>`).join("")}</div>`;
  }
  function testResult() {
    const ids = Object.keys(ID); let best = ids[0];
    ids.forEach(k => { if ((Q.pts[k] || 0) > (Q.pts[best] || 0)) best = k; });
    const r = ROMANS.find(x => x.id === ID[best]) || ROMANS[0];
    const pitch = (r.resume || "").split("\n")[0];
    const texte = `Mon roman de Benoli : « ${r.titre} ». Fais le test, et toi ? ${lienApp()}#/quiz`;
    return `<p class="qmeta">Le roman fait pour toi</p><h3 class="serif" style="font-size:1.6rem;line-height:1.15">${esc(r.titre)}</h3>${r.sousTitre ? `<p class="attente" style="margin-top:6px">${esc(r.sousTitre)}</p>` : ""}${pitch ? `<p style="margin:14px 0">${esc(pitch)}</p>` : ""}<div class="actions" style="margin:16px 0 30px"><a class="btn" href="#/${r.id}">Lire l'extrait gratuit</a><a class="btn sec" href="https://wa.me/?text=${encodeURIComponent(texte)}" target="_blank" rel="noopener">Partager mon résultat</a><button class="btn sec" type="button" data-qa="start-test">Refaire le test</button></div>`;
  }

  /* --- Pensées --- */
  let CAT = "Tout";
  const jour = () => PENSEES[Math.floor(Date.now() / 86400000) % PENSEES.length];
  const texteP = p => `« ${p.t} »\n— Benoli Littéraire\n${lienApp()}#/sagesse`;
  const lienP = p => "https://wa.me/?text=" + encodeURIComponent(texteP(p));
  const catsHtml = () => ["Tout"].concat(CATS).map(c => `<button class="scat${c === CAT ? " actif" : ""}" type="button" data-qa="cat" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  const carteP = (p, i) => `<blockquote class="pcard"><p>${esc(p.t)}</p><footer><span>${esc(p.c)}</span><a class="pbtn" href="${lienP(p)}" target="_blank" rel="noopener">Partager</a><button class="pbtn" type="button" data-qa="copy" data-i="${i}">Copier</button></footer></blockquote>`;
  const listeP = () => PENSEES.map((p, i) => ({ p, i })).filter(({ p }) => CAT === "Tout" || p.c === CAT).map(({ p, i }) => carteP(p, i)).join("");
  const jourHtml = (p, titre) => `<small>${esc(titre)} · ${esc(p.c)}</small><p>${esc(p.t)}</p><a class="pbtn" href="${lienP(p)}" target="_blank" rel="noopener">Partager</a><button class="pbtn" type="button" data-qa="autre">Une autre pensée</button>`;
  PAGES.sagesse = () => { CAT = "Tout"; return `<h2 class="serif">Pensées pour la vie</h2><p class="attente">Des mots simples sur la famille, la paix, la joie, la tristesse et tout le reste.</p><div class="pjour" id="pjour">${jourHtml(jour(), "Pensée du jour")}</div><div class="scats" id="scats">${catsHtml()}</div><div id="slist">${listeP()}</div>`; };

  /* --- Clics --- */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-qa]"); if (!b) return;
    const a = b.dataset.qa;
    if (a === "difficulty") {
      niveauQuiz = ["facile","moyen","difficile"].includes(b.dataset.level) ? b.dataset.level : "facile";
      zone().querySelectorAll('[data-qa="difficulty"]').forEach(x => x.classList.toggle("actif", x.dataset.level === niveauQuiz));
    } else if (a === "start-quiz") {
      const count = Math.min(niveauxQuiz[niveauQuiz], QUIZ.length);
      Q = { type: "quiz", level: niveauQuiz, i: 0, score: 0, done: false, pointsEarned: 0, list: shuffle(QUIZ).slice(0,count).map(q => { const o = shuffle([0, 1, 2, 3]); return { q: q.q, o: o.map(k => q.o[k]), a: o.indexOf(q.a), n: q.n }; }) };
      zone().innerHTML = questionHtml();
    } else if (a === "rep" && Q && !Q.done) {
      const q = Q.list[Q.i], k = +b.dataset.k; Q.done = true; if (k === q.a) Q.score++;
      zone().querySelectorAll(".qopt").forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add("ok"); else if (j === k) x.classList.add("non"); });
      $("#qfb").innerHTML = `<div class="qfb"><b>${k === q.a ? "Bonne réponse ✓" : "Pas tout à fait"}</b><br>${esc(q.n)}</div><button class="btn" type="button" data-qa="suite">${Q.i + 1 < Q.list.length ? "Question suivante" : "Voir mon score"}</button>`;
    } else if (a === "suite" && Q && Q.type === "quiz") {
      Q.i++;
      Q.done = false;
      if (Q.i >= Q.list.length) {
        const multiplicateur = Q.level === "difficile" ? 15 : Q.level === "moyen" ? 10 : 5;
        Q.pointsEarned = Q.score * multiplicateur;
        try {
          const rewardKey = "benoli-rewards-local-v1";
          const raw = JSON.parse(localStorage.getItem(rewardKey) || "{}");
          const rewards = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
          rewards.points = Math.max(0, Number(rewards.points) || 0) + Q.pointsEarned;
          rewards.quizPlayed = Math.max(0, Number(rewards.quizPlayed) || 0) + 1;
          rewards.bestScore = Math.max(0, Number(rewards.bestScore) || 0, Q.score / Q.list.length);
          rewards.trophies = Array.isArray(rewards.trophies) ? rewards.trophies : [];
          if (!rewards.trophies.includes("premier-quiz")) rewards.trophies.push("premier-quiz");
          if (Q.score === Q.list.length && !rewards.trophies.includes("sans-faute")) rewards.trophies.push("sans-faute");
          if (Q.level === "difficile" && Q.score >= Math.ceil(Q.list.length * .8) && !rewards.trophies.includes("expert-benoli")) rewards.trophies.push("expert-benoli");
          localStorage.setItem(rewardKey, JSON.stringify(rewards));
        } catch (_) {}
        const result = { score: Q.score, total: Q.list.length, level: Q.level, points: Q.pointsEarned, date: new Date().toISOString() };
        try {
          const key = "benoli-quiz-history-v1";
          const history = JSON.parse(localStorage.getItem(key) || "[]");
          const safe = Array.isArray(history) ? history.filter(x => x && Number.isFinite(x.score) && Number.isFinite(x.total)) : [];
          safe.push(result);
          localStorage.setItem(key, JSON.stringify(safe.slice(-30)));
        } catch (_) {}
        zone().innerHTML = scoreHtml();
      } else {
        zone().innerHTML = questionHtml();
      }
    } else if (a === "tep" && Q && Q.type === "test") {
      TEST[Q.i].o[+b.dataset.k][1].forEach(id => { Q.pts[id] = (Q.pts[id] || 0) + 1; });
      Q.i++;
      zone().innerHTML = Q.i >= TEST.length ? testResult() : testQ();
    } else if (a === "cat") {
      CAT = b.dataset.c; $("#scats").innerHTML = catsHtml(); $("#slist").innerHTML = listeP();
    } else if (a === "autre") {
      $("#pjour").innerHTML = jourHtml(PENSEES[Math.floor(Math.random() * PENSEES.length)], "Une pensée pour toi");
    } else if (a === "copy") {
      const p = PENSEES[+b.dataset.i];
      (navigator.clipboard ? navigator.clipboard.writeText(texteP(p)).then(() => { b.textContent = "Copié ✓"; }) : Promise.reject())
        .catch(() => window.prompt("Copie la pensée :", texteP(p)));
    }
  });
/* --- L'assistant connaît les nouvelles sections --- */
  if (typeof aRepondre === "function") {
    const ancienne = aRepondre;
    aRepondre = function (t) {
      const q = norm(t);
      if (q.includes("quiz") || q.includes("jeu ") || q.includes("test")) return `<p>Teste-toi avec <a href="#/quiz">le quiz</a> : connais-tu bien les romans de Benoli, ou quel roman est fait pour toi ?</p>`;
      if (/(citation|pensee|conseil|sagesse)/.test(q)) return `<p>Lis <a href="#/sagesse">les pensées pour la vie</a> : famille, paix, joie, tristesse…</p>`;
      return ancienne(t);
    };
  }
})();
/* ===== Ajouts : groupe WhatsApp et commande par WhatsApp ===== */
(function () {
  if (typeof PAGES === "undefined" || typeof ROMANS === "undefined" || typeof afficherFiche !== "function") return;
  const GROUPE = "https://chat.whatsapp.com/GVNCwcmL0P57pGiBn7AQnN";
  const carte = `<div class="partage"><h3 class="serif">Rejoins le groupe WhatsApp</h3><p>Extraits, nouveautés et discussions entre lecteurs.</p><a class="btn" href="${GROUPE}" target="_blank" rel="noopener">Rejoindre le groupe</a></div>`;

  /* Carte du groupe sur l'accueil et sur la page À propos */
  const acc = $("#partageAccueil");
  if (acc) acc.insertAdjacentHTML("beforebegin", carte);
  const apropos = PAGES["a-propos"];
  PAGES["a-propos"] = () => apropos() + carte;

  /* Bouton « Commander par WhatsApp » sur chaque fiche de roman */
  const ancienne = afficherFiche;
  afficherFiche = function (id) {
    ancienne(id);
    const r = ROMANS.find(x => x.id === id);
    const actions = r && $("#ficheContenu .actions");
    if (!actions || !actions.lastElementChild) return;
    const msg = `Bonjour, je veux commander « ${r.titre} » (${prix(r.prix)}). Comment puis-je payer ?`;
    actions.lastElementChild.insertAdjacentHTML("beforebegin", `<a class="btn sec" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Commander par WhatsApp</a>`);
  };
})();
/* Bouton Assistant : toujours au-dessus de la barre du bas */
(function () {
  const b = document.getElementById("aBtn");
  if (!b) return;
  b.style.bottom = "calc(84px + env(safe-area-inset-bottom))";
  b.style.zIndex = "26";
})();
/* ===== Ajouts : écouter l'extrait et vote pour le prochain roman ===== */
(function () {
  if (typeof PAGES === "undefined" || typeof ROMANS === "undefined" || typeof afficherFiche !== "function") return;
   
  /* ---- ÉCOUTER L'EXTRAIT (voix du téléphone, gratuit) ---- */
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return;
  let enCours = null, jeton = 0;

  const morceaux = t => {
    const out = [];
    t.split("\n").filter(Boolean).forEach(l => {
      if (l.length <= 220) { out.push(l); return; }
      let cur = "";
      l.split(/(?<=[.!?…»])\s+/).forEach(p => {
        if (cur && (cur + " " + p).length > 220) { out.push(cur); cur = p; }
        else cur = cur ? cur + " " + p : p;
      });
      if (cur) out.push(cur);
    });
    return out;
  };
  function majBouton() {
    const b = $("#ficheContenu [data-ec]");
    if (b) b.textContent = enCours ? "⏹ Arrêter la lecture" : "🔊 Écouter l'extrait";
  }
  function arreter() { jeton++; synth.cancel(); enCours = null; majBouton(); }
  function lire(id) {
    const r = ROMANS.find(x => x.id === id);
    if (!r || !r.extrait) return;
    if (enCours) { arreter(); return; }
    const voix = synth.getVoices();
    if (voix.length && !voix.some(v => /^fr/i.test(v.lang))) {
      window.alert("Ton téléphone n'a pas de voix française. Ajoute-la dans Réglages, Synthèse vocale.");
      return;
    }
    synth.cancel();
    const mon = ++jeton; enCours = id; majBouton();
    const parts = morceaux(r.extrait);
    parts.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p);
      u.lang = "fr-FR"; u.rate = 0.95;
      if (i === parts.length - 1) u.onend = u.onerror = () => { if (jeton === mon) { enCours = null; majBouton(); } };
      synth.speak(u);
    });
  }

  const avant = afficherFiche;
  afficherFiche = function (id) {
    arreter();
    avant(id);
    const r = ROMANS.find(x => x.id === id);
    const ex = r && r.extrait && $("#ficheContenu .extrait");
    if (ex) ex.insertAdjacentHTML("beforebegin", `<button class="pbtn" type="button" data-ec="${esc(id)}" style="margin:0 0 10px">🔊 Écouter l'extrait</button>`);
  };
  window.addEventListener("hashchange", arreter);
  document.addEventListener("click", e => { const b = e.target.closest("[data-ec]"); if (b) lire(b.dataset.ec); });
})();
/* ===== Quiz mis à jour : 15 questions et test avec « Sessi, mon étoile » ===== */
(function () {
  if (typeof PAGES === "undefined" || typeof ROMANS === "undefined") return;

  /* q = question, o = 4 réponses, a = numéro de la bonne réponse (0 à 3), n = explication */
  const QUIZ2 = [
    { q: "Quel surnom Lénis donne-t-elle à Benoli dans « Elle m'appelait Chéco » ?", o: ["Chéco", "Cobi", "Chef", "Coco"], a: 0, n: "Lénis l'appelle toujours « Chéco », un surnom que personne ne comprend vraiment." },
    { q: "Dans « Cobi », que veut dire le surnom « Cobi » pour Belvida ?", o: ["Court pour « Cobra »", "Le nom de leur association", "Un surnom d'enfance", "Le titre d'un livre"], a: 0, n: "Pour elle, c'est un garçon qui frappe froidement, sans jamais montrer ses émotions." },
    { q: "Pourquoi Bienvenue et Belvida doivent-ils travailler ensemble à l'université ?", o: ["Ils sont élus à la tête d'une même liste pour présider une association étudiante", "Ils sont voisins", "Ils préparent un voyage", "Ils jouent dans la même équipe"], a: 0, n: "Rivaux depuis le lycée, ils sont obligés de collaborer." },
    { q: "Dans « Je ne suis pas ce qu'ils ont fait de moi », qui est Ermine ?", o: ["Une fille de ministre", "La sœur de Lénis", "Une professeure", "Une voisine d'enfance"], a: 0, n: "Ermine est habituée à ce que tout le monde plie devant elle." },
    { q: "Dans quelle ville se passent « Je ne suis pas ce qu'ils ont fait de moi », « Ce que tu m'as coûté » et « Le Cœur de Fridaous » ?", o: ["Cotonou", "Porto-Novo", "Parakou", "Abomey"], a: 0, n: "Cotonou est le décor de plusieurs romans de Benoli." },
    { q: "Quel est le rêve de Kévin dans « Ce que tu m'as coûté » ?", o: ["Devenir footballeur", "Devenir médecin", "Devenir musicien", "Partir à l'étranger"], a: 0, n: "Kévin a quinze ans et un rêve : le football." },
    { q: "Pour qui Kévin est-il prêt à tout donner ?", o: ["Mélissa", "Jade", "Élodie", "Lénis"], a: 0, n: "Pour elle, il donne son temps, ses amis et ses rêves." },
    { q: "Qu'a Jade dans sa tête, dans « Elle choisit mal, mais c'est ta faute » ?", o: ["Une liste de ce qu'elle veut chez un homme", "Un plan pour voyager", "Un secret de famille", "Un projet d'entreprise"], a: 0, n: "Jade a des règles très précises, jusqu'à ce que quelqu'un les lui fasse oublier." },
    { q: "Quel homme charismatique et imprévisible fait oublier ses règles à Jade ?", o: ["Darel", "Nathan", "Gabriel", "Bienvenue"], a: 0, n: "Nathan, lui, est le bon garçon que personne ne choisit." },
    { q: "Dans « La Maison d'en face », comment s'appelle l'épouse de Richard Dossou ?", o: ["Élodie", "Mélissa", "Belvida", "Fridaous"], a: 0, n: "La mort de Richard bouleverse son existence." },
    { q: "Avec quel homme Élodie se remarie-t-elle ?", o: ["Gabriel Ahouansou", "Darel", "Nathan", "Kévin"], a: 0, n: "Un homme aussi attentionné qu'énigmatique." },
    { q: "Quelle formation Fridaous choisit-elle d'abord dans « Le Cœur de Fridaous » ?", o: ["L'informatique", "La couture", "La cuisine", "Le droit"], a: 0, n: "Puis la sérigraphie : elle avance, jour après jour." },
    { q: "Dans « Sessi, mon étoile », comment s'appelle la mère de Sessi ?", o: ["Maman Adjo", "Tante Esther", "Amina", "Clarisse"], a: 0, n: "Maman Adjo est forte, aimante, mais stricte." },
    { q: "Dans quelles circonstances Sessi rencontre-t-elle Bénoli ?", o: ["Lors d'un voyage d'affaires", "À l'église", "Au marché", "À l'université"], a: 0, n: "Une simple conversation devient une amitié profonde, puis un amour sincère." },
    { q: "Qu'est-ce qui rend l'amour de Sessi et Bénoli si difficile ?", o: ["La famille, les responsabilités, la distance et une rivale", "Une dispute au travail", "Un héritage", "Un secret de naissance"], a: 0, n: "Parfois, aimer ne suffit pas." }
  ];

  const ID2 = { sessi: "sessi-mon-etoile", checo: "elle-m-appelait-checo", cobi: "cobi", jns: "je-ne-suis-pas-ce-qu-ils-ont-fait-de-moi", coute: "ce-que-tu-m-as-coute", choisit: "elle-choisit-mal", maison: "la-maison-d-en-face", fridaous: "le-coeur-de-fridaous" };
  const TEST2 = [
    { q: "Quel genre d'histoire te donne envie de tourner la page ?", o: [["Une rivalité qui change peu à peu", ["cobi", "checo"]], ["Un mystère où personne n'est ce qu'il paraît", ["maison"]], ["Un amour qui coûte tout", ["coute", "choisit", "sessi"]], ["Une femme qui se bat pour sa place", ["jns", "fridaous"]]] },
    { q: "Dans une histoire, tu aimes surtout…", o: [["Les disputes qui cachent des sentiments", ["cobi"]], ["Les silences et les regards", ["checo", "coute"]], ["Les secrets de famille", ["maison", "sessi"]], ["Les choix amoureux qui font débat", ["choisit"]]] },
    { q: "Le personnage que tu préfères :", o: [["Le rival brillant", ["cobi"]], ["Le meilleur ami fidèle", ["checo", "coute"]], ["La femme déterminée", ["jns", "fridaous", "sessi"]], ["Celui qui cache quelque chose", ["maison", "choisit"]]] },
    { q: "L'ambiance qui te plaît :", o: [["Campus et ambitions", ["cobi", "checo"]], ["Quartiers et familles de Cotonou", ["maison", "fridaous"]], ["Pouvoir, apparences et jeux d'influence", ["jns"]], ["Cœurs brisés et reconstruction", ["coute", "sessi"]]] },
    { q: "Tu veux finir le livre avec…", o: [["Le sourire", ["fridaous", "cobi"]], ["Un débat avec tes amis", ["choisit"]], ["Un frisson", ["maison", "jns"]], ["Les larmes", ["coute", "checo", "sessi"]]] }
  ];

  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const zone = () => $("#quizZone");
  let S = null;

  const menu = () => `<p class="attente">Deux façons de jouer, sans compte et sans rien à payer.</p><div class="qmenu"><button class="qcarte" type="button" data-q2="start-quiz"><b>Connais-tu les romans de Benoli ?</b><span>${QUIZ2.length} questions · sans spoiler</span></button><button class="qcarte" type="button" data-q2="start-test"><b>Quel roman est fait pour toi ?</b><span>${TEST2.length} questions · ton résultat en 1 minute</span></button></div>`;
  PAGES.quiz = () => { S = null; return `<h2 class="serif">Quiz</h2><div id="quizZone">${menu()}</div>`; };

  const barre = (i, n) => `<p class="qmeta">Question ${i + 1} / ${n}</p><div class="qbar"><i style="width:${(i / n) * 100}%"></i></div>`;
  const questionHtml = () => {
    const q = S.list[S.i];
    return barre(S.i, S.list.length) + `<h3 class="serif qtitre">${esc(q.q)}</h3><div class="qopts">${q.o.map((o, k) => `<button class="qopt" type="button" data-q2="rep" data-k="${k}">${esc(o)}</button>`).join("")}</div><div id="qfb"></div>`;
  };
  const scoreHtml = () => {
    const n = S.list.length, s = S.score;
    const msg = s >= n - 1 ? "Fan numéro 1 ! Tu connais l'univers de Benoli sur le bout des doigts." : s >= Math.ceil(n * 0.65) ? "Bravo, tu connais bien les romans !" : s >= Math.ceil(n * 0.4) ? "Pas mal ! Relis quelques extraits pour faire mieux." : "Tu as tout à découvrir : commence par un extrait gratuit.";
    const texte = `J'ai eu ${s}/${n} au quiz des romans de Benoli. Et toi ? ${lienApp()}#/quiz`;
    return `<p class="qmeta">Ton résultat</p><div class="score">${s}/${n}</div><p style="margin:12px 0 18px">${esc(msg)}</p><div class="actions" style="margin:0 0 30px"><a class="btn" href="https://wa.me/?text=${encodeURIComponent(texte)}" target="_blank" rel="noopener">Partager mon score sur WhatsApp</a><button class="btn sec" type="button" data-q2="start-quiz">Rejouer</button><a class="btn sec" href="#">Découvrir les romans</a></div>`;
  };
  const testQ = () => {
    const q = TEST2[S.i];
    return barre(S.i, TEST2.length) + `<h3 class="serif qtitre">${esc(q.q)}</h3><div class="qopts">${q.o.map((o, k) => `<button class="qopt" type="button" data-q2="tep" data-k="${k}">${esc(o[0])}</button>`).join("")}</div>`;
  };
  const testResult = () => {
    const ids = Object.keys(ID2); let best = ids[0];
    ids.forEach(k => { if ((S.pts[k] || 0) > (S.pts[best] || 0)) best = k; });
    const r = ROMANS.find(x => x.id === ID2[best]) || ROMANS[0];
    const pitch = (r.resume || "").split("\n")[0];
    const texte = `Mon roman de Benoli : « ${r.titre} ». Fais le test, et toi ? ${lienApp()}#/quiz`;
    return `<p class="qmeta">Le roman fait pour toi</p><h3 class="serif" style="font-size:1.6rem;line-height:1.15">${esc(r.titre)}</h3>${r.sousTitre ? `<p class="attente" style="margin-top:6px">${esc(r.sousTitre)}</p>` : ""}${pitch ? `<p style="margin:14px 0">${esc(pitch)}</p>` : ""}<div class="actions" style="margin:16px 0 30px"><a class="btn" href="#/${r.id}">Lire l'extrait gratuit</a><a class="btn sec" href="https://wa.me/?text=${encodeURIComponent(texte)}" target="_blank" rel="noopener">Partager mon résultat</a><button class="btn sec" type="button" data-q2="start-test">Refaire le test</button></div>`;
  };

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-q2]"); if (!b) return;
    const a = b.dataset.q2;
    if (a === "start-quiz") {
      S = { type: "quiz", i: 0, score: 0, done: false, list: shuffle(QUIZ2).map(q => { const o = shuffle([0, 1, 2, 3]); return { q: q.q, o: o.map(k => q.o[k]), a: o.indexOf(q.a), n: q.n }; }) };
      zone().innerHTML = questionHtml();
    } else if (a === "rep" && S && !S.done) {
      const q = S.list[S.i], k = +b.dataset.k; S.done = true; if (k === q.a) S.score++;
      zone().querySelectorAll(".qopt").forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add("ok"); else if (j === k) x.classList.add("non"); });
      $("#qfb").innerHTML = `<div class="qfb"><b>${k === q.a ? "Bonne réponse ✓" : "Pas tout à fait"}</b><br>${esc(q.n)}</div><button class="btn" type="button" data-q2="suite">${S.i + 1 < S.list.length ? "Question suivante" : "Voir mon score"}</button>`;
    } else if (a === "suite" && S) {
      S.i++; S.done = false;
      zone().innerHTML = S.i >= S.list.length ? scoreHtml() : questionHtml();
    } else if (a === "start-test") {
      S = { type: "test", i: 0, pts: {} };
      zone().innerHTML = testQ();
    } else if (a === "tep" && S && S.type === "test") {
      TEST2[S.i].o[+b.dataset.k][1].forEach(id => { S.pts[id] = (S.pts[id] || 0) + 1; });
      S.i++;
      zone().innerHTML = S.i >= TEST2.length ? testResult() : testQ();
    }
  });
})();
/* ===== Réglages : typographie et présentation ===== */
(function () {
  if (typeof PAGES === "undefined") return;
  const CLE = "benoli-reglages";
  const DEFAUT = { police: "moderne", taille: "normal", forme: "normal" };
  const SANS = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
  const SERIF = "'Iowan Old Style',Palatino,'Palatino Linotype',Georgia,serif";
  const POLICES = {
    moderne: [SANS, SERIF],
    classique: [SERIF, SERIF],
    simple: [SANS, SANS],
    lisible: ["Verdana,Tahoma,sans-serif", "Verdana,Tahoma,sans-serif"]
  };
  const TAILLES = { normal: 100, grand: 112, tres: 125 };

  let RG = Object.assign({}, DEFAUT);
  try {
    const ancien = JSON.parse(localStorage.getItem(CLE) || "{}");
    RG = Object.assign(RG, ancien);
  } catch (e) {}
  const sauver = () => {
    try { localStorage.setItem(CLE, JSON.stringify(RG)); } catch (e) {}
  };

  const st = document.createElement("style");
  st.id = "rg-style";
  st.textContent = ".rg-liste{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 20px}.rg-pt{display:inline-block;width:14px;height:14px;border-radius:50%;margin-right:7px;vertical-align:-2px;border:1px solid rgba(128,128,128,.6)}.scat.actif .rg-pt{border-color:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)}";
  document.head.appendChild(st);
  const dyn = document.createElement("style");
  dyn.id = "rg-dyn";
  document.head.appendChild(dyn);

  function appliquer() {
    const F = POLICES[RG.police] || POLICES.moderne;
    const pct = TAILLES[RG.taille] || 100;
    let css = `html{font-size:${pct}%}body{font-size:1rem !important}body,button,input{font-family:${F[0]} !important}.serif,h1,h2,h3,.score{font-family:${F[1]} !important}`;
    if (RG.forme === "carre") css += "body *:not(img):not(i):not(.drapeau){border-radius:2px !important}.auteur img{border-radius:50% !important}";
    if (RG.forme === "ronde") css += ".btn,.pbtn,.chip,.scat,#aBtn{border-radius:99px !important}.qopt,.qcarte,.partage,.pcard,.m,.qfb,.auteur,.cv{border-radius:24px !important}";
    dyn.textContent = css;
  }
  appliquer();

  const groupe = (titre, cle, options) => `<h3 class="serif">${titre}</h3><div class="rg-liste">${options.map(([v, nom]) => `<button class="scat${RG[cle] === v ? " actif" : ""}" type="button" aria-pressed="${RG[cle] === v}" data-rg="${cle}" data-v="${v}">${nom}</button>`).join("")}</div>`;

  PAGES.reglages = () => `<h2 class="serif">🎨 Personnaliser Benoli</h2>
    <p class="attente" style="margin-bottom:14px">Compose ton univers : choisis tes propres couleurs, puis ajuste la police, la taille du texte et la forme des éléments. Tes choix sont conservés sur ce téléphone.</p>
    ${groupe("Police d'écriture", "police", [["moderne", "Moderne"], ["classique", "Classique"], ["simple", "Simple"], ["lisible", "Très lisible"]])}
    ${groupe("Taille du texte", "taille", [["normal", "Normale"], ["grand", "Grande"], ["tres", "Très grande"]])}
    ${groupe("Forme des éléments", "forme", [["carre", "Carrée"], ["normal", "Normale"], ["ronde", "Arrondie"]])}
    <button class="btn sec" type="button" data-rg="reset" style="margin:6px 0 30px">Réinitialiser police et présentation</button>`;

  const nav = document.getElementById("navBas");
  if (nav && !nav.querySelector('a[data-n="reglages"]')) {
    nav.insertAdjacentHTML("beforeend", '<a href="#/reglages" data-n="reglages"><span>⚙</span>Réglages</a>');
  }
  const majNav = () => {
    if (!nav || location.hash !== "#/reglages") return;
    nav.querySelectorAll("a").forEach(a => a.classList.toggle("actif", a.dataset.n === "reglages"));
  };
  window.addEventListener("hashchange", majNav);
  majNav();

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-rg]");
    if (!b) return;
    if (b.dataset.rg === "reset") RG = Object.assign({}, DEFAUT);
    else if (Object.prototype.hasOwnProperty.call(DEFAUT, b.dataset.rg)) RG[b.dataset.rg] = b.dataset.v;
    else return;
    sauver();
    appliquer();
    const pg = document.querySelector("#ficheContenu .page");
    if (pg) pg.innerHTML = PAGES.reglages();
  });

  if (typeof route === "function" && location.hash) route();
})();

/* =========================================================
   BENOLI LITTÉRAIRE — MENU LATÉRAL + COULEURS PERSONNELLES
   Extension indépendante : ne remplace pas les fonctions existantes.
   ========================================================= */
(function () {
  if (window.__benoliMenuPersoV1) return;
  if (typeof PAGES === "undefined") return;
  window.__benoliMenuPersoV1 = true;

  const CLE = "benoli-couleurs-personnelles";
  const VARS = {
    papier: "--papier",
    carte: "--carte",
    encre: "--encre",
    vert: "--vert",
    or: "--or"
  };

  let couleurs = {};
  try {
    couleurs = JSON.parse(localStorage.getItem(CLE) || "{}");
    if (!couleurs || typeof couleurs !== "object" ||
        Array.isArray(couleurs)) couleurs = {};
  } catch (e) {
    couleurs = {};
  }

  function couleurValide(v) {
    return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);
  }

  function enregistrer() {
    try {
      localStorage.setItem(CLE, JSON.stringify(couleurs));
    } catch (e) {}
  }

  const style = document.createElement("style");
  style.id = "benoli-menu-perso-style";
  style.textContent = `
    #benoliMenuBtn {
      position:relative;
      top:auto;
      right:auto;
      z-index:6;
      flex:none;
      border:1px solid rgba(220,190,255,.4);
      border-radius:999px;
      padding:9px 12px;
      margin:0;
      background:rgba(27,28,56,.85);
      color:#fff2c4;
      font:700 .83rem system-ui,sans-serif;
      box-shadow:0 3px 12px rgba(0,0,0,.18);
      cursor:pointer;
      white-space:nowrap;
    }
    @media(max-width:600px){
      #benoliMenuBtn{padding:7px 9px;font-size:.72rem}
    }
    #benoliVoile {
      position:fixed;
      inset:0;
      z-index:49;
      background:rgba(0,0,0,.48);
      opacity:0;
      visibility:hidden;
      transition:opacity .2s,visibility .2s;
    }
    #benoliVoile.ouvert {
      opacity:1;
      visibility:visible;
    }
    #benoliMenu {
      position:fixed;
      z-index:50;
      top:0;
      right:0;
      bottom:0;
      width:min(86vw,340px);
      overflow-y:auto;
      padding:calc(env(safe-area-inset-top) + 20px) 18px
        calc(env(safe-area-inset-bottom) + 24px);
      background:var(--carte);
      color:var(--encre);
      box-shadow:-8px 0 30px rgba(0,0,0,.2);
      transform:translateX(105%);
      visibility:hidden;
      transition:transform .23s ease,visibility .23s;
    }
    #benoliMenu.ouvert {
      transform:translateX(0);
      visibility:visible;
    }
    #benoliMenu .bm-entete {
      padding:12px 0 20px;
      border-bottom:1px solid var(--trait);
      margin-bottom:14px;
    }
    #benoliMenu .bm-entete strong {
      display:block;
      font-family:Georgia,serif;
      font-size:1.45rem;
      line-height:1.2;
    }
    #benoliMenu .bm-entete p {
      color:var(--doux);
      font-size:.9rem;
      margin-top:6px;
    }
    #benoliMenu .bm-lien {
      display:flex;
      align-items:center;
      gap:12px;
      width:100%;
      padding:13px 12px;
      margin:5px 0;
      border:1px solid var(--trait);
      border-radius:12px;
      background:var(--papier);
      color:var(--encre);
      text-decoration:none;
      font:inherit;
      text-align:left;
      cursor:pointer;
    }
    #benoliMenu .bm-emoji {
      width:30px;
      text-align:center;
      font-size:1.25rem;
      flex-shrink:0;
    }
    #benoliMenu .bm-bas {
      color:var(--doux);
      font-size:.8rem;
      margin-top:20px;
      line-height:1.5;
    }
    .bp-couleurs {
      margin:18px 0 24px;
      padding:15px;
      border:1px solid var(--trait);
      border-radius:14px;
      background:var(--carte);
    }
    .bp-couleurs h3 { margin-bottom:6px; }
    .bp-couleurs p {
      color:var(--doux);
      font-size:.9rem;
      margin-bottom:12px;
    }
    .bp-couleur {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:9px 0;
      border-bottom:1px solid var(--trait);
    }
    .bp-couleur:last-of-type { border-bottom:0; }
    .bp-couleur label { font-size:.94rem; }
    .bp-couleur input[type="color"] {
      width:48px;
      height:38px;
      padding:2px;
      border:1px solid var(--trait);
      border-radius:9px;
      background:var(--carte);
      cursor:pointer;
    }
    #benoliMenuBtn:focus-visible,
    #benoliMenu button:focus-visible,
    #benoliMenu a:focus-visible {
      outline:3px solid var(--or);
      outline-offset:3px;
    }
    @media(prefers-reduced-motion:reduce) {
      #benoliVoile,#benoliMenu { transition:none; }
    }
    /* Finition premium du menu — palette Benoli */
    #benoliMenu{
      background:
        radial-gradient(ellipse at 100% 0%,rgba(171,130,255,.18),transparent 42%),
        linear-gradient(155deg,#17152b 0%,#11172a 58%,#17152b 100%);
      color:#f7f1ff;
      border-left:1px solid rgba(204,174,255,.28);
      box-shadow:-18px 0 50px rgba(0,0,0,.42),inset 1px 0 rgba(255,255,255,.04);
      scrollbar-color:rgba(190,154,255,.45) transparent;
    }
    #benoliMenu .bm-entete{
      padding:15px 0 18px;
      border-bottom:1px solid rgba(190,154,255,.25);
      position:relative;
    }
    #benoliMenu .bm-entete strong{
      font-family:'Playfair Display',Georgia,serif;
      font-size:1.55rem;
      letter-spacing:-.025em;
      background:linear-gradient(100deg,#fff5dc,#d9c1ff 62%,#ffd27a);
      -webkit-background-clip:text;background-clip:text;color:transparent;
    }
    #benoliMenu .bm-entete p{color:#c9bfdc;font-size:.88rem}
    #benoliMenu .bm-entete:after{
      content:"";display:block;width:54px;height:3px;margin-top:14px;border-radius:9px;
      background:linear-gradient(90deg,#b99aff,#ffd27a)
    }
    #benoliMenu .bm-lien{
      position:relative;
      padding:12px 13px;
      margin:7px 0;
      min-height:49px;
      border:1px solid rgba(190,158,255,.18);
      border-radius:14px;
      background:linear-gradient(120deg,rgba(255,255,255,.065),rgba(184,154,255,.045));
      color:#f1eaff;
      font-family:'DM Sans',system-ui,sans-serif;
      font-size:.91rem;
      font-weight:650;
      line-height:1.3;
      box-shadow:inset 0 1px rgba(255,255,255,.035);
      transition:transform .18s ease,border-color .18s ease,background .18s ease;
    }
    #benoliMenu .bm-lien:hover,#benoliMenu .bm-lien:focus-visible{
      border-color:rgba(255,210,122,.58);
      background:linear-gradient(110deg,rgba(184,154,255,.17),rgba(255,210,122,.09));
    }
    #benoliMenu .bm-lien:active{transform:scale(.985)}
    #benoliMenu .bm-emoji{
      width:32px;height:32px;display:grid;place-items:center;
      border-radius:10px;
      background:rgba(184,154,255,.13);
      border:1px solid rgba(190,158,255,.15);
      font-size:1.16rem;
    }
    #benoliMenu .bm-entete .bm-lien{
      width:auto;min-height:38px;margin-top:14px;padding:8px 12px;
      background:rgba(255,255,255,.055);color:#e9ddff;border-color:rgba(190,158,255,.2);
    }
    #benoliMenu .bm-entete .bm-lien .bm-emoji{width:26px;height:26px}
    #benoliMenu .bm-bas{
      color:#bfb5d2;border-top:1px solid rgba(190,158,255,.18);
      padding-top:15px;font-size:.78rem
    }
    #benoliMenuBtn{
      background:linear-gradient(120deg,#30234b,#1c2038)!important;
      color:#fff0d0!important;border-color:rgba(255,210,122,.48)!important;
      box-shadow:0 4px 14px rgba(0,0,0,.24),inset 0 1px rgba(255,255,255,.12)!important;
      font-family:'DM Sans',system-ui,sans-serif!important;
    }
    html[data-benoli-theme="masculin"] #benoliMenu{
      background:radial-gradient(ellipse at 100% 0%,rgba(63,173,239,.2),transparent 42%),linear-gradient(155deg,#0b1e35,#0a172a 58%,#10233b);
      border-left-color:rgba(91,183,255,.3)
    }
    html[data-benoli-theme="masculin"] #benoliMenu .bm-entete{border-color:rgba(91,183,255,.25)}
    html[data-benoli-theme="masculin"] #benoliMenu .bm-entete strong{
      background:linear-gradient(100deg,#f3fbff,#8bdcff 65%,#ffd27a);
      -webkit-background-clip:text;background-clip:text;color:transparent
    }
    html[data-benoli-theme="masculin"] #benoliMenu .bm-entete:after{background:linear-gradient(90deg,#45baff,#ffd27a)}
    html[data-benoli-theme="masculin"] #benoliMenu .bm-lien{
      background:linear-gradient(120deg,rgba(91,183,255,.11),rgba(255,255,255,.035));
      border-color:rgba(91,183,255,.2);color:#e9f6ff
    }
    html[data-benoli-theme="masculin"] #benoliMenu .bm-emoji{background:rgba(65,170,235,.14);border-color:rgba(91,183,255,.2)}
    html[data-benoli-theme="masculin"] #benoliMenuBtn{
      background:linear-gradient(120deg,#164a72,#10233d)!important;color:#eaf8ff!important;border-color:rgba(91,183,255,.55)!important
    }
    html[data-benoli-theme="feminin"] #benoliMenu{
      background:radial-gradient(ellipse at 100% 0%,rgba(255,116,193,.2),transparent 42%),linear-gradient(155deg,#32152f,#211126 58%,#351a3b);
      border-left-color:rgba(255,139,207,.3)
    }
    html[data-benoli-theme="feminin"] #benoliMenu .bm-entete{border-color:rgba(255,139,207,.25)}
    html[data-benoli-theme="feminin"] #benoliMenu .bm-entete strong{
      background:linear-gradient(100deg,#fff4fa,#ffb0d9 65%,#ffe0a8);
      -webkit-background-clip:text;background-clip:text;color:transparent
    }
    html[data-benoli-theme="feminin"] #benoliMenu .bm-entete:after{background:linear-gradient(90deg,#ff83c4,#ffe0a8)}
    html[data-benoli-theme="feminin"] #benoliMenu .bm-lien{
      background:linear-gradient(120deg,rgba(255,139,207,.11),rgba(255,255,255,.035));
      border-color:rgba(255,139,207,.2);color:#fff0f8
    }
    html[data-benoli-theme="feminin"] #benoliMenu .bm-emoji{background:rgba(255,111,187,.14);border-color:rgba(255,139,207,.2)}
    html[data-benoli-theme="feminin"] #benoliMenuBtn{
      background:linear-gradient(120deg,#742653,#351a3b)!important;color:#fff0f8!important;border-color:rgba(255,139,207,.55)!important
    }
    @media(max-width:380px){
      #benoliMenu{width:min(90vw,340px);padding-left:14px;padding-right:14px}
      #benoliMenu .bm-lien{font-size:.86rem;padding:11px 10px}
    }

  `;
  document.head.appendChild(style);

  /* Appliquer uniquement les couleurs choisies personnellement */
  function appliquerCouleurs() {
    Object.keys(VARS).forEach(k => {
      const variable = VARS[k];
      if (couleurValide(couleurs[k])) {
        document.documentElement.style.setProperty(
          variable, couleurs[k]
        );
      } else {
        document.documentElement.style.removeProperty(variable);
      }
    });

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = getComputedStyle(document.documentElement)
        .getPropertyValue("--vert").trim() || "#0b5d3b";
    }
  }

  appliquerCouleurs();

  /* Ajouter les couleurs à la page de réglages existante */
  const anciennePageReglages = PAGES.reglages;

  function blocCouleurs() {
    const noms = {
      papier: "Fond de l'application",
      carte: "Fond des cartes",
      encre: "Couleur du texte",
      vert: "Couleur principale",
      or: "Couleur des détails"
    };

    const variablesDefaut = {
      papier: "#f3f5f0",
      carte: "#ffffff",
      encre: "#12201a",
      vert: "#0b5d3b",
      or: "#f2b01e"
    };

    const actuel = getComputedStyle(document.documentElement);

    return `
      <section class="bp-couleurs">
        <h3 class="serif">🎨 Mes couleurs personnelles</h3>
        <p>Choisis les couleurs qui correspondent à ton univers.
        Tes choix sont conservés sur ce téléphone.</p>
        ${Object.keys(VARS).map(k => {
          const valeur = couleurValide(couleurs[k])
            ? couleurs[k]
            : (actuel.getPropertyValue(VARS[k]).trim()
               || variablesDefaut[k]);

          return `
            <div class="bp-couleur">
              <label for="bp-${k}">${noms[k]}</label>
              <input type="color" id="bp-${k}"
                data-bp-couleur="${k}"
                value="${couleurValide(valeur) ? valeur : variablesDefaut[k]}"
                aria-label="${noms[k]}">
            </div>`;
        }).join("")}
        <button class="btn sec" type="button"
          data-bp-reset-couleurs
          style="margin-top:14px;width:100%">
          Restaurer les couleurs d'origine
        </button>
      </section>`;
  }

  PAGES.reglages = function () {
    const base = typeof anciennePageReglages === "function"
      ? anciennePageReglages()
      : '<h2 class="serif">Réglages</h2>';

    return base + blocCouleurs();
  };

  /* Choix de couleur et restauration */
  document.addEventListener("input", function (e) {
    const input = e.target.closest("[data-bp-couleur]");
    if (!input) return;

    const cle = input.dataset.bpCouleur;
    if (!Object.prototype.hasOwnProperty.call(VARS, cle)) return;

    couleurs[cle] = input.value;
    enregistrer();
    appliquerCouleurs();
  });

  document.addEventListener("click", function (e) {
    const reset = e.target.closest("[data-bp-reset-couleurs]");
    if (reset) {
      couleurs = {};
      enregistrer();
      appliquerCouleurs();

      const page = document.querySelector("#ficheContenu .page");
      if (page) page.innerHTML = PAGES.reglages();
    }
  });

  /* Construire le menu latéral une seule fois */
  const bouton = document.createElement("button");
  bouton.id = "benoliMenuBtn";
  bouton.type = "button";
  bouton.textContent = "☰ Menu";
  bouton.setAttribute("aria-label", "Ouvrir le menu");
  bouton.setAttribute("aria-controls", "benoliMenu");
  bouton.setAttribute("aria-expanded", "false");

  const voile = document.createElement("div");
  voile.id = "benoliVoile";

  const menu = document.createElement("nav");
  menu.id = "benoliMenu";
  menu.setAttribute("aria-label", "Menu principal");
  menu.setAttribute("aria-hidden", "true");

  menu.innerHTML = `
    <div class="bm-entete">
      <strong>Benoli Littéraire</strong>
      <p>Entre dans mon univers littéraire 📚</p>
      <button type="button" class="bm-lien" data-bm-fermer>
        <span class="bm-emoji">✕</span> Fermer le menu
      </button>
    </div>

    <a class="bm-lien" href="#">
      <span class="bm-emoji">🏠</span> Accueil et romans
    </a>
    <a class="bm-lien" href="#/communaute">
      <span class="bm-emoji">✉️</span> Communauté — messages, histoires et amis
    </a>
    <a class="bm-lien" href="#/nouveautes">
      <span class="bm-emoji">🆕</span> Nouveautés
    </a>
    <a class="bm-lien" href="#/notifications" data-n="notifications">
      <span class="bm-emoji">🔔</span> Actus
    </a>
    <a class="bm-lien" href="#/favoris">
      <span class="bm-emoji">❤️</span> Mes favoris
    </a>
    <a class="bm-lien" href="#/carnet">
      <span class="bm-emoji">📔</span> Mon carnet de lecture
    </a>
    <button class="bm-lien" type="button" id="benoliInstaller">
      <span class="bm-emoji">📲</span> Installer Benoli Littéraire
    </button>
    <a class="bm-lien" href="#/quiz">
      <span class="bm-emoji">🎯</span> Quiz et test littéraire
    </a>
    <a class="bm-lien" href="#/reglages">
      <span class="bm-emoji">🎨</span> Personnaliser l'application
    </a>
    <a class="bm-lien" href="#/a-propos">
      <span class="bm-emoji">✍️</span> Découvrir l'auteur
    </a>
    <a class="bm-lien" href="#/mentions">
      <span class="bm-emoji">📄</span> Mentions légales
    </a>
    <a class="bm-lien" href="#/conditions">
      <span class="bm-emoji">📖</span> Conditions d'achat
    </a>
    <a class="bm-lien" href="https://chat.whatsapp.com/GVNCwcmL0P57pGiBn7AQn"
       target="_blank" rel="noopener">
      <span class="bm-emoji">💬</span> Groupe WhatsApp
    </a>

    <div class="bm-bas">
      Lokonon B. Tiziano<br>
      Des histoires, des émotions, un univers.
    </div>
  `;

  document.body.appendChild(voile);
  document.body.appendChild(menu);
  const actionsTop = document.querySelector(".benoli-actions");
  const langueTop = actionsTop && actionsTop.querySelector(".benoli-lang");
  if (actionsTop) actionsTop.insertBefore(bouton, langueTop || null);
  else document.body.appendChild(bouton);

  /* Installation PWA depuis le menu */
  let invitationInstallation = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    invitationInstallation = e;
  });
  const boutonInstaller = menu.querySelector("#benoliInstaller");
  boutonInstaller.addEventListener("click", async function () {
    if (invitationInstallation) {
      invitationInstallation.prompt();
      await invitationInstallation.userChoice;
      invitationInstallation = null;
      return;
    }
    alert("Pour installer Benoli Littéraire : ouvre le menu de ton navigateur (⋮), puis choisis « Installer l'application » ou « Ajouter à l'écran d'accueil ». Si cette option n'apparaît pas, le navigateur ne propose pas encore l'installation sur cet appareil.");
  });

  function ouvrirMenu(ouvrir) {
    menu.classList.toggle("ouvert", ouvrir);
    voile.classList.toggle("ouvert", ouvrir);
    bouton.setAttribute("aria-expanded", String(ouvrir));
    menu.setAttribute("aria-hidden", String(!ouvrir));
    bouton.textContent = ouvrir ? "✕ Fermer" : "☰ Menu";
  }

  bouton.addEventListener("click", function () {
    ouvrirMenu(!menu.classList.contains("ouvert"));
  });

  voile.addEventListener("click", function () {
    ouvrirMenu(false);
  });

  menu.addEventListener("click", function (e) {
    if (e.target.closest("[data-bm-fermer]")) {
      ouvrirMenu(false);
      return;
    }

    if (e.target.closest("a")) ouvrirMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") ouvrirMenu(false);
  });

  /* Appliquer à nouveau les couleurs après les réglages existants */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-rg]")) {
      setTimeout(appliquerCouleurs, 0);
    }
  });

  /* Corriger l'affichage lors d'une navigation directe */
  if (typeof route === "function" && location.hash) route();

})();
  
/* ===== Navigation dédiée : Accueil et Romans ===== */
(function () {
  const catalogue = document.getElementById("catalogue");
  const hero = document.querySelector("header.hero");
  const accueil = document.getElementById("accueilPersonnalise");

  if (!catalogue) return;

  /* Corriger les liens vers le catalogue */
  document.querySelectorAll('a[href="#catalogue"]').forEach(function (lien) {
    lien.setAttribute("href", "#/romans");
  });

  /* Le bouton Romans de la barre du bas ouvre le catalogue */
  const navRomans = document.querySelector('#navBas a[data-n="romans"]');
  if (navRomans) navRomans.setAttribute("href", "#/romans");

  function actualiserNavigation() {
    const pageRomans = location.hash === "#/romans";

    /* Le catalogue apparaît uniquement dans la rubrique Romans */
    catalogue.style.display = pageRomans ? "" : "none";

    /* Masquer les éléments d'accueil dans la rubrique Romans */
    if (hero) hero.style.display = pageRomans ? "none" : "";
    if (accueil) accueil.style.display = pageRomans ? "none" : "";

    /* Revenir en haut à chaque changement de rubrique */
    if (pageRomans) {
      document.getElementById("fiche").classList.remove("ouverte");
      document.body.classList.remove("fige");
      window.scrollTo(0, 0);
    }

    /* Mettre à jour le bouton actif en bas */
    document.querySelectorAll("#navBas a").forEach(function (lien) {
      lien.classList.toggle(
        "actif",
        pageRomans
          ? lien.dataset.n === "romans"
          : location.hash === "#/quiz"
            ? lien.dataset.n === "quiz"
            : location.hash === "#/sagesse"
              ? lien.dataset.n === "sagesse"
              : !location.hash && lien.dataset.n === "romans"
      );
    });
  }

  window.addEventListener("hashchange", actualiserNavigation);
  actualiserNavigation();
})();

function afficherPersonnages() {
  const grille = document.getElementById("grillePersonnages");
  const recherche = document.getElementById("recherchePersonnage");
  const filtre = document.getElementById("filtreRoman");

  if (!grille || !recherche || !filtre) return;

  const romans = [...new Set(personnagesBenoli.map(p => p.roman))];

  romans.forEach(roman => {
    if (![...filtre.options].some(o => o.value === roman)) {
      const option = document.createElement("option");
      option.value = roman;
      option.textContent = roman;
      filtre.appendChild(option);
    }
  });

  function dessiner() {
    const terme = recherche.value.trim().toLowerCase();
    const romanChoisi = filtre.value;

    const resultat = personnagesBenoli.filter(p =>
      p.nom.toLowerCase().includes(terme) &&
      (!romanChoisi || p.roman === romanChoisi)
    );

    grille.replaceChildren();

    if (!resultat.length) {
      const vide = document.createElement("p");
      vide.className = "personnages-vide";
      vide.textContent = "Aucun personnage trouvé.";
      grille.appendChild(vide);
      return;
    }

    resultat.forEach(p => {
      const carte = document.createElement("article");
      carte.className = "personnage-carte";

      const image = document.createElement("img");
      image.src = p.image;
      image.alt = "Image associée à " + p.nom;
      image.loading = "lazy";
      image.onerror = function () {
        this.onerror = null;
        this.src = "covers/default-character.jpg";
      };

      const contenu = document.createElement("div");
      contenu.className = "personnage-contenu";

      const nom = document.createElement("h3");
      nom.textContent = p.nom;

      const titre = document.createElement("span");
      titre.className = "personnage-roman";
      titre.textContent = p.roman;

      const description = document.createElement("p");
      description.textContent = p.description;

      contenu.append(nom, titre, description);
      carte.append(image, contenu);
      grille.appendChild(carte);
    });
  }

  recherche.addEventListener("input", dessiner);
  filtre.addEventListener("change", dessiner);
  dessiner();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afficherPersonnages);
} else {
  afficherPersonnages();
     }

