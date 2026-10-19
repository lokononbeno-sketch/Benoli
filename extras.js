ni/* =====================================================================
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
body{padding-bottom:calc(68px + env(safe-area-inset-bottom))}
#fiche{padding-bottom:calc(68px + env(safe-area-inset-bottom))}
#aBtn{bottom:calc(82px + env(safe-area-inset-bottom))}
#navBas{position:fixed;left:0;right:0;bottom:0;z-index:25;display:flex;background:var(--carte);border-top:1px solid var(--trait);padding-bottom:env(safe-area-inset-bottom)}
#navBas a{flex:1;text-align:center;text-decoration:none;padding:8px 4px 9px;font-size:.78rem;font-weight:600;color:var(--doux)}
#navBas a span{display:block;font-size:1.35rem;line-height:1.1}
#navBas a.actif{color:var(--vert)}
#navBas a:focus-visible{outline:3px solid var(--or);outline-offset:-3px}
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
  nav.innerHTML = `<a href="#" data-n="romans"><span>📚</span>Romans</a><a href="#/quiz" data-n="quiz"><span>❓</span>Quiz</a><a href="#/sagesse" data-n="sagesse"><span>💡</span>Pensées</a>`;
  document.body.appendChild(nav);
  function majNav() {
    const h = location.hash, k = h === "#/quiz" ? "quiz" : h === "#/sagesse" ? "sagesse" : "romans";
    nav.querySelectorAll("a").forEach(a => a.classList.toggle("actif", a.dataset.n === k));
  }
  window.addEventListener("hashchange", majNav);
  majNav();

  /* --- Quiz --- */
  let Q = null;
  const menuQuiz = () => `<p class="attente">Deux façons de jouer, sans compte et sans rien à payer.</p><div class="qmenu"><button class="qcarte" type="button" data-qa="start-quiz"><b>Connais-tu les romans de Benoli ?</b><span>${QUIZ.length} questions · sans spoiler</span></button><button class="qcarte" type="button" data-qa="start-test"><b>Quel roman est fait pour toi ?</b><span>${TEST.length} questions · ton résultat en 1 minute</span></button></div>`;
  PAGES.quiz = () => { Q = null; return `<h2 class="serif">Quiz</h2><div id="quizZone">${menuQuiz()}</div>`; };

  const barre = (i, n) => `<p class="qmeta">Question ${i + 1} / ${n}</p><div class="qbar"><i style="width:${(i / n) * 100}%"></i></div>`;
  function questionHtml() {
    const q = Q.list[Q.i];
    return barre(Q.i, Q.list.length) + `<h3 class="serif qtitre">${esc(q.q)}</h3><div class="qopts">${q.o.map((o, k) => `<button class="qopt" type="button" data-qa="rep" data-k="${k}">${esc(o)}</button>`).join("")}</div><div id="qfb"></div>`;
  }
  function scoreHtml() {
    const n = Q.list.length, s = Q.score;
    const msg = s >= n - 1 ? "Fan numéro 1 ! Tu connais l'univers de Benoli sur le bout des doigts." : s >= Math.ceil(n * 0.65) ? "Bravo, tu connais bien les romans !" : s >= Math.ceil(n * 0.4) ? "Pas mal ! Relis quelques extraits pour faire mieux." : "Tu as tout à découvrir : commence par un extrait gratuit.";
    const texte = `J'ai eu ${s}/${n} au quiz des romans de Benoli. Et toi ? ${lienApp()}#/quiz`;
    return `<p class="qmeta">Ton résultat</p><div class="score">${s}/${n}</div><p style="margin:12px 0 18px">${esc(msg)}</p><div class="actions" style="margin:0 0 30px"><a class="btn" href="https://wa.me/?text=${encodeURIComponent(texte)}" target="_blank" rel="noopener">Partager mon score sur WhatsApp</a><button class="btn sec" type="button" data-qa="start-quiz">Rejouer</button><a class="btn sec" href="#">Découvrir les romans</a></div>`;
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
    if (a === "start-quiz") {
      Q = { type: "quiz", i: 0, score: 0, done: false, list: shuffle(QUIZ).map(q => { const o = shuffle([0, 1, 2, 3]); return { q: q.q, o: o.map(k => q.o[k]), a: o.indexOf(q.a), n: q.n }; }) };
      zone().innerHTML = questionHtml();
    } else if (a === "rep" && Q && !Q.done) {
      const q = Q.list[Q.i], k = +b.dataset.k; Q.done = true; if (k === q.a) Q.score++;
      zone().querySelectorAll(".qopt").forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add("ok"); else if (j === k) x.classList.add("non"); });
      $("#qfb").innerHTML = `<div class="qfb"><b>${k === q.a ? "Bonne réponse ✓" : "Pas tout à fait"}</b><br>${esc(q.n)}</div><button class="btn" type="button" data-qa="suite">${Q.i + 1 < Q.list.length ? "Question suivante" : "Voir mon score"}</button>`;
    } else if (a === "suite" && Q) {
      Q.i++; Q.done = false;
      zone().innerHTML = Q.i >= Q.lis
    } else if (a === "start-test") {
      Q = { type: "test", i: 0, pts: {} };
      zone().innerHTML = testQ();
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
