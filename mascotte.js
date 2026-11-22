/* BENOLI — « Beno », le petit bonhomme qui habite l'application.
   Il ouvre une porte, sort, la referme, regarde le lecteur, se promène sur le bas de l'écran.
   À chaque nouvelle page, il revient par une nouvelle porte.
   Si le lecteur ne fait rien pendant longtemps, il s'impatiente puis se fâche et fait des grimaces.
   Il se désactive dans le menu (« Petit bonhomme ») et respecte « réduire les animations ». */
(function () {
  "use strict";
  if (window.__benoliMascotte) return;
  window.__benoliMascotte = true;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const CLE = "benoli-mascotte";
  const lireActif = () => { try { return localStorage.getItem(CLE) !== "off"; } catch (_) { return true; } };
  const ecrireActif = v => { try { localStorage.setItem(CLE, v ? "on" : "off"); } catch (_) {} };
  const alea = (a, b) => a + Math.random() * (b - a);
  const choix = t => t[Math.floor(Math.random() * t.length)];
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));

  let gen = 0;
  const dormir = (ms, g) => new Promise(r => setTimeout(() => r(g === undefined || g === gen), ms));

  /* Messages */
  const SALUTS = ["Salut ! Bienvenue chez moi !", "Coucou ! Je t'attendais !", "Hé ! Tu as trouvé ma maison !", "Entre, entre ! Fais comme chez toi."];
  const PAGES = {
    quiz: ["Un quiz ? Je parie que tu vas gagner !"],
    sagesse: ["Une belle pensée pour toi !"],
    romans: ["Choisis bien ton prochain roman !"],
    recompenses: ["Waouh, regarde tes trophées !"],
    personnages: ["Ce sont mes amis. Ils sont sympas !"],
    reglages: ["Change les couleurs, c'est ta maison aussi !"],
    "a-propos": ["Lui, c'est l'auteur. Il écrit tout ça !"],
    lyrics: ["De la musique ! J'adore !"],
    profil: ["Ton espace à toi. Installe-toi !"]
  };
  const IMPATIENT = ["Euh... tu dors ?", "Hého ? Y'a quelqu'un ?", "Je m'ennuie, moi..."];
  const COLERE = ["Fais quelque chose !", "Touche l'écran, vite !", "Un clic ! Un seul !", "Je vais me fâcher !!", "Bouge ! Fais défiler !"];
  const SOULAGE = ["Enfin !", "Ah, tu es là !", "Merci ! J'avais peur..."];
  const CHATOUILLE = ["Hihi !", "Ça chatouille !", "Aïe !", "Oui ?"];

  /* Dessin (vue de face). Les membres pivotent autour de leur articulation. */
  const PEAU = "#8a5238", PEAU_OMBRE = "#6f402f", CHEVEUX = "#15100d";
  const trait = (d, c, w) => '<path d="' + d + '" stroke="' + c + '" stroke-width="' + w + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  const oeil = (x, grand, dx) =>
    '<g transform="translate(' + x + ' 0)"><ellipse rx="' + (grand ? 7.2 : 6) + '" ry="' + (grand ? 9 : 7.6) + '" fill="#fff"/>' +
    '<g class="bm-pup" style="transform:translate(' + (dx || 0) + 'px,0)"><circle cx="0" cy="1" r="' + (grand ? 4 : 3.5) + '" fill="#2a1a12"/><circle cx="1.3" cy="-.5" r="1.3" fill="#fff"/></g></g>';

  function dessin() {
    const jambe = (x, cls, couleur) =>
      '<g transform="translate(' + x + ' -22)"><g class="bm-jambe ' + cls + '"><rect x="-4.5" y="0" width="9" height="17" rx="4.5" fill="' + couleur + '"/>' +
      '<ellipse cx="-1" cy="18" rx="9" ry="4.6" fill="#e8112d"/></g></g>';
    const bras = (x, cls) =>
      '<g transform="translate(' + x + ' -46)"><g class="bm-bras ' + cls + '"><rect x="-4" y="-2" width="8" height="22" rx="4" fill="' + PEAU + '"/>' +
      '<rect x="-5" y="-3" width="10" height="10" rx="4.5" fill="#1fa05a"/><circle cx="0" cy="20" r="4.6" fill="' + PEAU + '"/></g></g>';
    const tete =
      '<g transform="translate(0 -50)"><g class="bm-tete">' +
      '<circle cx="-22" cy="-15" r="5" fill="' + PEAU + '"/><circle cx="22" cy="-15" r="5" fill="' + PEAU + '"/>' +
      '<circle cx="-22" cy="-15" r="2.4" fill="' + PEAU_OMBRE + '"/><circle cx="22" cy="-15" r="2.4" fill="' + PEAU_OMBRE + '"/>' +
      '<circle cx="0" cy="-16" r="22" fill="' + PEAU + '"/>' +
      '<circle class="bm-rouge" cx="0" cy="-16" r="22" fill="#ff2d2d"/>' +
      '<path d="M-22 -20C-24 -42 24 -42 22 -20C14 -28 -14 -28 -22 -20Z" fill="' + CHEVEUX + '"/><path d="M-4 -38Q0 -47 6 -38" fill="' + CHEVEUX + '"/>' +
      '<ellipse cx="-12" cy="-8" rx="4.4" ry="2.6" fill="#ff7a7a" opacity=".3"/><ellipse cx="12" cy="-8" rx="4.4" ry="2.6" fill="#ff7a7a" opacity=".3"/>' +
      '<g transform="translate(0 -17)">' +
        '<g class="ye ye-normal bm-clin">' + oeil(-8) + oeil(8) + '</g>' +
        '<g class="ye ye-large">' + oeil(-8, true) + oeil(8, true) + '</g>' +
        '<g class="ye ye-joie">' + trait("M-13 1Q-8 -6 -3 1M3 1Q8 -6 13 1", "#2a1a12", 2.6) + '</g>' +
        '<g class="ye ye-x">' + trait("M-12 -4L-4 0L-12 4M12 -4L4 0L12 4", "#2a1a12", 2.6) + '</g>' +
        '<g class="ye ye-croises">' + oeil(-8, false, 3) + oeil(8, false, -3) + '</g>' +
        '<g class="ye ye-clin">' + oeil(-8) + trait("M3 1Q8 5 13 1", "#2a1a12", 2.6) + '</g>' +
      '</g>' +
      '<g class="br br-neutre">' + trait("M-13 -28Q-8 -31 -3 -29M3 -29Q8 -31 13 -28", CHEVEUX, 2.2) + '</g>' +
      '<g class="br br-fache">' + trait("M-14 -33L-3 -27M14 -33L3 -27", CHEVEUX, 3) + '</g>' +
      '<g class="br br-haut">' + trait("M-13 -31Q-8 -35 -3 -32M3 -32Q8 -35 13 -31", CHEVEUX, 2.2) + '</g>' +
      '<g class="br br-plat">' + trait("M-13 -28L-3 -28M3 -28L13 -28", CHEVEUX, 2.4) + '</g>' +
      '<g class="bo bo-leger">' + trait("M-3.5 -3Q0 -.8 3.5 -3", "#5a2a22", 1.8) + '</g>' +
      '<g class="bo bo-sourire">' + trait("M-8 -5Q0 4 8 -5", "#5a2a22", 2) + '</g>' +
      '<g class="bo bo-plat">' + trait("M-5 -2L5 -2", "#5a2a22", 2) + '</g>' +
      '<g class="bo bo-cri"><path d="M-9 -6Q0 8 9 -6Z" fill="#5a1a1a"/><path d="M-6 -5L6 -5L5 -2L-5 -2Z" fill="#fff"/></g>' +
      '<g class="bo bo-o"><ellipse cx="0" cy="-2" rx="3.2" ry="4.2" fill="#5a1a1a"/></g>' +
      '<g class="bo bo-langue"><path d="M-7 -5Q0 4 7 -5Z" fill="#5a1a1a"/><ellipse cx="0" cy=".5" rx="3.6" ry="4.6" fill="#ff7a8a"/><path d="M0 -3L0 4" stroke="#d9566a" stroke-width=".9"/></g>' +
      '<g class="bo bo-joues"><circle cx="-14" cy="-6" r="8.5" fill="#a06246" stroke="#6f402f" stroke-width="1"/><circle cx="14" cy="-6" r="8.5" fill="#a06246" stroke="#6f402f" stroke-width="1"/><circle cx="0" cy="-2" r="2.4" fill="#5a1a1a"/></g>' +
      '<g class="bo bo-large"><path d="M-10 -6Q0 8 10 -6Z" fill="#5a1a1a"/><path d="M-8 -5.5L8 -5.5L7 -2L-7 -2Z" fill="#fff"/></g>' +
      '<g class="bm-vapeur"><circle cx="-27" cy="-30" r="4.5" style="animation-delay:0s"/><circle cx="27" cy="-30" r="4.5" style="animation-delay:.35s"/><circle cx="-24" cy="-36" r="3.5" style="animation-delay:.6s"/><circle cx="24" cy="-36" r="3.5" style="animation-delay:.2s"/></g>' +
      '</g></g>';
    return '<svg class="bm-svg" viewBox="-32 -96 64 100" width="64" height="100" aria-hidden="true" focusable="false">' +
      '<ellipse cx="0" cy="1" rx="19" ry="4" fill="#000" opacity=".28"/>' +
      '<g class="bm-corps">' + jambe(-7.5, "bm-jg", "#2f4a8a") + jambe(7.5, "bm-jd", "#2f4a8a") +
      '<rect x="-15" y="-52" width="30" height="33" rx="12" fill="#1fa05a"/><rect x="-15" y="-38" width="30" height="5" fill="#fcd116"/>' +
      bras(-15, "bm-bg") + bras(15, "bm-bd") + tete + '</g></svg>';
  }

  /* Feuille de style */
  const YE = ["normal", "large", "joie", "x", "croises", "clin"], BR = ["neutre", "fache", "haut", "plat"],
    BO = ["leger", "sourire", "plat", "cri", "o", "langue", "joues", "large"];
  const regles = [
    "#bm-couche{position:fixed;left:0;right:0;bottom:calc(86px + env(safe-area-inset-bottom));height:150px;z-index:24;pointer-events:none;-webkit-tap-highlight-color:transparent}",
    ".bm-porte{position:absolute;bottom:0;width:78px;height:116px;opacity:0;transform:scale(.4);transform-origin:50% 100%;transition:transform .45s cubic-bezier(.2,.8,.3,1.2),opacity .35s;perspective:420px}",
    ".bm-porte.on{opacity:1;transform:scale(1)}",
    ".bm-cadre{position:absolute;inset:0;border:6px solid #5a3a22;border-bottom-width:0;border-radius:10px 10px 0 0;background:linear-gradient(#ffe9a8,#f6b24a 60%,#c76b1d);box-shadow:inset 0 0 22px rgba(255,200,100,.7),0 6px 14px rgba(0,0,0,.35)}",
    ".bm-battant{position:absolute;inset:0;transform-origin:left center;transition:transform .7s cubic-bezier(.4,.1,.2,1);background:linear-gradient(90deg,#8a5632,#a8683c 50%,#8a5632);border-radius:3px 3px 0 0;box-shadow:inset 0 0 0 3px #6a4020,inset 0 0 0 9px #96592f}",
    ".bm-battant:after{content:'';position:absolute;left:13px;right:13px;top:13px;bottom:48%;border:2px solid #6a4020;border-radius:3px}",
    ".bm-poignee{position:absolute;right:9px;top:55%;width:9px;height:9px;border-radius:50%;background:#ffd24a;box-shadow:0 1px 2px rgba(0,0,0,.4)}",
    ".bm-porte.ouverte .bm-battant{transform:rotateY(-104deg)}",
    ".bm{position:absolute;bottom:0;left:50%;width:64px;height:100px;margin-left:-32px;pointer-events:auto;cursor:pointer;opacity:0;transform:scale(.55);transform-origin:50% 100%;touch-action:manipulation}",
    ".bm.visible{opacity:1;transform:scale(1)}",
    ".bm-svg{display:block;overflow:visible;filter:drop-shadow(0 4px 3px rgba(0,0,0,.3))}",
    ".bm .ye,.bm .br,.bm .bo,.bm .bm-vapeur{display:none}",
    ".bm .bm-rouge{opacity:0;transition:opacity .4s}.bm[data-rouge='1'] .bm-rouge{opacity:.38}",
    ".bm[data-vapeur='1'] .bm-vapeur{display:inline}",
    ".bm-vapeur circle{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:50% 50%;animation:bm-fume 1s ease-out infinite}",
    ".bm .bm-tete{transition:transform .3s}.bm[data-bras='impatient'] .bm-tete{transform:rotate(-7deg)}",
    ".bm .bm-clin{animation:bm-clin 4.6s infinite}",
    ".bm .bm-corps{animation:bm-respire 3.4s ease-in-out infinite}",
    ".bm[data-mv='marche'] .bm-corps{animation:bm-dandine .5s ease-in-out infinite}",
    ".bm[data-mv='marche'] .bm-jg,.bm[data-mv='marche'] .bm-bd{animation:bm-pas-a .5s ease-in-out infinite alternate}",
    ".bm[data-mv='marche'] .bm-jd,.bm[data-mv='marche'] .bm-bg{animation:bm-pas-b .5s ease-in-out infinite alternate}",
    ".bm[data-bras='salut'] .bm-bd{animation:bm-salut .45s ease-in-out infinite alternate}",
    ".bm[data-bras='colere'] .bm-bg{transform:rotate(150deg)}.bm[data-bras='colere'] .bm-bd{transform:rotate(-150deg)}",
    ".bm[data-bras='colere'] .bm-corps{animation:bm-tremble .12s linear infinite}",
    ".bm[data-bras='impatient'] .bm-bg{transform:rotate(20deg)}.bm[data-bras='impatient'] .bm-bd{transform:rotate(-20deg)}",
    ".bm[data-bras='impatient'] .bm-jd{animation:bm-tape .45s ease-in-out infinite}",
    ".bm[data-bras='ferme-g'] .bm-bg{transform:rotate(100deg)}.bm[data-bras='ferme-d'] .bm-bd{transform:rotate(-100deg)}",
    ".bm[data-saut='1'] .bm-corps{animation:bm-saute .5s ease-out}",
    ".bm-bulle{position:absolute;bottom:108px;max-width:190px;padding:8px 12px;border-radius:14px;background:#fff8e8;color:#2b1d14;font:700 13px/1.3 Inter,system-ui,sans-serif;text-align:center;box-shadow:0 6px 16px rgba(0,0,0,.28);opacity:0;transform:translate(-50%,6px);transition:opacity .25s,transform .25s;pointer-events:none}",
    ".bm-bulle.on{opacity:1;transform:translate(-50%,0)}",
    ".bm-bulle:after{content:'';position:absolute;left:50%;bottom:-6px;width:12px;height:12px;background:#fff8e8;transform:translateX(-50%) rotate(45deg)}",
    "button.bm-lien{width:100%;font:inherit;text-align:left;cursor:pointer}",
    "@keyframes bm-pas-a{from{transform:rotate(-17deg)}to{transform:rotate(17deg)}}",
    "@keyframes bm-pas-b{from{transform:rotate(17deg)}to{transform:rotate(-17deg)}}",
    "@keyframes bm-dandine{0%,100%{transform:translateY(0) rotate(-2.5deg)}50%{transform:translateY(-2.5px) rotate(2.5deg)}}",
    "@keyframes bm-respire{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}",
    "@keyframes bm-tape{0%,100%{transform:rotate(0)}50%{transform:rotate(14deg)}}",
    "@keyframes bm-tremble{0%,100%{transform:translateX(-1.6px)}50%{transform:translateX(1.6px)}}",
    "@keyframes bm-salut{from{transform:rotate(-125deg)}to{transform:rotate(-165deg)}}",
    "@keyframes bm-saute{0%,100%{transform:translateY(0)}40%{transform:translateY(-18px)}}",
    "@keyframes bm-clin{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}}",
    "@keyframes bm-fume{0%{opacity:.85;transform:translateY(0) scale(.6)}100%{opacity:0;transform:translateY(-16px) scale(1.7)}}"
  ];
  YE.forEach(n => regles.push(".bm[data-ye='" + n + "'] .ye-" + n + "{display:inline}"));
  BR.forEach(n => regles.push(".bm[data-br='" + n + "'] .br-" + n + "{display:inline}"));
  BO.forEach(n => regles.push(".bm[data-bo='" + n + "'] .bo-" + n + "{display:inline}"));
  const feuille = document.createElement("style");
  feuille.id = "bm-style";
  feuille.textContent = regles.join("");
  document.head.appendChild(feuille);

  /* Éléments */
  const couche = document.createElement("div");
  couche.id = "bm-couche";
  couche.setAttribute("aria-hidden", "true");
  couche.innerHTML =
    '<div class="bm-porte" id="bm-porte"><div class="bm-cadre"><div class="bm-battant"><i class="bm-poignee"></i></div></div></div>' +
    '<div class="bm" id="bm-perso" data-ye="normal" data-br="neutre" data-bo="leger" data-rouge="0" data-vapeur="0">' + dessin() + "</div>" +
    '<div class="bm-bulle" id="bm-bulle"></div>';
  document.body.appendChild(couche);
  const porte = couche.querySelector("#bm-porte"), perso = couche.querySelector("#bm-perso"), bulle = couche.querySelector("#bm-bulle");

  /* États du visage */
  const ETATS = {
    neutre: { ye: "normal", br: "neutre", bo: "leger" },
    content: { ye: "normal", br: "haut", bo: "sourire" },
    joie: { ye: "joie", br: "haut", bo: "sourire" },
    surpris: { ye: "large", br: "haut", bo: "o" },
    impatient: { ye: "normal", br: "plat", bo: "plat" },
    colere: { ye: "normal", br: "fache", bo: "cri", rouge: 1, vapeur: 1 },
    g1: { ye: "x", br: "fache", bo: "langue", rouge: 1 },
    g2: { ye: "croises", br: "neutre", bo: "joues" },
    g3: { ye: "clin", br: "haut", bo: "large" }
  };
  const visage = nom => {
    const e = ETATS[nom] || ETATS.neutre;
    perso.dataset.ye = e.ye; perso.dataset.br = e.br; perso.dataset.bo = e.bo;
    perso.dataset.rouge = e.rouge ? "1" : "0"; perso.dataset.vapeur = e.vapeur ? "1" : "0";
  };
  const bras = v => { perso.dataset.bras = v || ""; };
  const mouvement = v => { perso.dataset.mv = v || ""; };
  const posX = () => parseFloat(perso.style.left) || 0;

  let idBulle = 0;
  function dire(texte, ms) {
    const id = ++idBulle;
    bulle.textContent = texte;
    bulle.style.left = borne(posX(), 105, Math.max(105, innerWidth - 105)) + "px";
    bulle.classList.add("on");
    setTimeout(() => { if (id === idBulle) bulle.classList.remove("on"); }, ms || 3200);
  }
  function placer(x, ms) {
    perso.style.transition = "left " + ms + "ms linear,opacity .5s ease,transform .7s cubic-bezier(.2,.8,.3,1.2)";
    perso.style.left = x + "px";
  }
  function sauter() {
    perso.dataset.saut = "1";
    setTimeout(() => { perso.dataset.saut = ""; }, 520);
  }

  /* Humeur : calme -> impatient -> en colère */
  let humeur = "calme", present = false, dernierGeste = Date.now(), actif = lireActif(), boucleId = 0;
  const T1 = 45, T2 = 85;

  async function boucleColere() {
    const id = ++boucleId;
    const cycle = ["colere", "g1", "colere", "g2", "colere", "g3"];
    let i = 0;
    while (humeur === "colere" && id === boucleId && actif) {
      visage(cycle[i % cycle.length]);
      bras(cycle[i % cycle.length] === "colere" ? "colere" : "");
      if (i % 2 === 0) dire(choix(COLERE), 2600);
      i++;
      await new Promise(r => setTimeout(r, 2800));
    }
  }
  function impatience() {
    humeur = "impatient";
    visage("impatient"); bras("impatient");
    dire(choix(IMPATIENT), 3200);
  }
  async function apaiser() {
    const avait = humeur;
    humeur = "calme"; boucleId++;
    mouvement(""); bras("");
    visage("surpris"); sauter();
    dire(choix(SOULAGE), 2400);
    const g = gen;
    await dormir(1100, g);
    if (g !== gen) return;
    visage(avait === "colere" ? "joie" : "content");
    await dormir(2000, g);
    if (g !== gen) return;
    visage("neutre");
  }
  function geste() {
    dernierGeste = Date.now();
    if (humeur !== "calme" && present) apaiser();
  }
  setInterval(() => {
    if (!actif || !present || document.hidden) return;
    const t = (Date.now() - dernierGeste) / 1000;
    if (humeur === "calme" && t > T1) impatience();
    else if (humeur === "impatient" && t > T2) { humeur = "colere"; boucleColere(); }
  }, 1000);
  ["pointerdown", "touchstart", "keydown", "wheel"].forEach(n => addEventListener(n, geste, { passive: true }));
  addEventListener("scroll", geste, { passive: true, capture: true });

  /* Le regard suit le doigt ou la souris */
  let cibleX = null, cibleY = null, vuLe = 0, rafOeil = 0;
  const suivre = e => {
    const p = e.touches && e.touches[0] ? e.touches[0] : e;
    cibleX = p.clientX; cibleY = p.clientY; vuLe = Date.now();
    if (!rafOeil) rafOeil = requestAnimationFrame(orienter);
  };
  function orienter() {
    rafOeil = 0;
    if (!present) return;
    let dx = 0, dy = 0;
    if (Date.now() - vuLe < 3000 && cibleX !== null) {
      const r = perso.getBoundingClientRect();
      const vx = cibleX - (r.left + r.width / 2), vy = cibleY - (r.top + 34);
      dx = borne(vx / 60, -1, 1) * 2.4; dy = borne(vy / 60, -1, 1) * 2.2;
    }
    perso.querySelectorAll(".ye-normal .bm-pup,.ye-large .bm-pup").forEach(el => { el.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)"; });
  }
  addEventListener("pointermove", suivre, { passive: true });
  addEventListener("touchmove", suivre, { passive: true });
  addEventListener("touchstart", suivre, { passive: true });
  setInterval(() => { if (present && Date.now() - vuLe >= 3000) orienter(); }, 1500);

  /* On peut toucher Beno */
  let touches = [];
  perso.addEventListener("click", () => {
    if (!present) return;
    const maintenant = Date.now();
    touches = touches.filter(t => maintenant - t < 8000); touches.push(maintenant);
    sauter();
    if (touches.length >= 5) {
      touches = [];
      visage("colere"); bras("colere"); dire("Arrête !! Ça suffit !", 2200);
      const g = gen;
      setTimeout(() => { if (g === gen && humeur === "calme") { bras(""); visage("neutre"); } }, 2200);
    } else {
      visage("joie"); dire(choix(CHATOUILLE), 1800);
      const g = gen;
      setTimeout(() => { if (g === gen && humeur === "calme") visage("neutre"); }, 1800);
    }
  });

  /* Marcher, entrer, sortir */
  async function marcher(x, g) {
    const d = Math.abs(x - posX());
    if (d < 6) return true;
    const ms = Math.round(d / 70 * 1000);
    mouvement("marche");
    placer(x, ms);
    const ok = await dormir(ms + 60, g);
    if (ok) mouvement("");
    return ok;
  }
  function quitter() {
    present = false; humeur = "calme"; boucleId++; idBulle++;
    bulle.classList.remove("on"); perso.classList.remove("visible");
    porte.classList.remove("on", "ouverte");
    mouvement(""); bras("");
  }

  async function entree(g) {
    if (!actif) return;
    present = false;
    const L = innerWidth;
    const x = Math.round(alea(110, Math.max(111, L - 110)));
    const dir = x < L / 2 ? 1 : -1;
    porte.style.transition = "none"; porte.classList.remove("on", "ouverte");
    porte.style.left = (x - 39) + "px";
    perso.style.transition = "none"; perso.classList.remove("visible");
    perso.style.left = x + "px"; visage("neutre"); bras(""); mouvement("");
    void porte.offsetWidth;
    porte.style.transition = "";

    porte.classList.add("on");
    if (!await dormir(550, g)) return;
    porte.classList.add("ouverte");
    if (!await dormir(750, g)) return;

    perso.classList.add("visible");
    mouvement("marche");
    placer(x + dir * 76, 1100);
    if (!await dormir(1250, g)) return;
    mouvement("");

    present = true; dernierGeste = Date.now();
    bras(dir > 0 ? "ferme-g" : "ferme-d");
    if (!await dormir(500, g)) return;
    porte.classList.remove("ouverte");
    if (!await dormir(800, g)) return;
    bras("");
    porte.classList.remove("on");

    visage("content"); bras("salut");
    const cle = pageCle();
    dire(PAGES[cle] && Math.random() < 0.6 ? choix(PAGES[cle]) : choix(SALUTS), 3400);
    if (!await dormir(2200, g)) return;
    bras(""); visage("neutre");
    vivre(g);
  }

  /* Il se promène de temps en temps */
  async function vivre(g) {
    while (g === gen && actif) {
      if (!await dormir(alea(12000, 22000), g)) return;
      if (humeur !== "calme" || document.hidden) continue;
      const x = Math.round(alea(70, Math.max(71, innerWidth - 100)));
      visage("content");
      if (!await marcher(x, g)) return;
      if (humeur === "calme") visage("neutre");
    }
  }

  /* Pages : une nouvelle porte à chaque nouvelle page */
  let pageCourante = "accueil";
  function pageCle() {
    const h = location.hash;
    if (!h || h === "#") return "accueil";
    if (h.indexOf("#/") !== 0) return pageCourante;
    return h.slice(2).split(/[?&]/)[0] || "accueil";
  }
  pageCourante = pageCle();
  addEventListener("hashchange", () => {
    const k = pageCle();
    if (k === pageCourante) return;
    pageCourante = k;
    if (!actif) return;
    const g = ++gen;
    quitter();
    setTimeout(() => { if (g === gen) entree(g); }, 900);
  });

  /* Réglage dans le menu */
  function bascule() {
    const m = document.getElementById("benoliMenu");
    if (!m || m.querySelector("#bm-toggle")) return;
    const b = document.createElement("button");
    b.type = "button"; b.id = "bm-toggle"; b.className = "bm-lien";
    const maj = () => { b.innerHTML = '<span class="bm-emoji">🙂</span> Petit bonhomme : ' + (actif ? "activé" : "désactivé"); };
    maj();
    b.addEventListener("click", () => {
      actif = !actif; ecrireActif(actif); maj();
      if (actif) { couche.style.display = ""; const g = ++gen; quitter(); setTimeout(() => entree(g), 600); }
      else { gen++; quitter(); couche.style.display = "none"; }
    });
    const bas = m.querySelector(".bm-bas");
    if (bas) bas.parentNode.insertBefore(b, bas); else m.appendChild(b);
  }
  bascule();
  addEventListener("load", () => { bascule(); setTimeout(bascule, 800); });

  /* Démarrage, une fois le générique d'ouverture terminé */
  if (!actif) { couche.style.display = "none"; return; }
  let essais = 0;
  const attente = setInterval(() => {
    essais++;
    if (!document.getElementById("benoli-video-intro") || essais > 40) {
      clearInterval(attente);
      const g = ++gen;
      setTimeout(() => entree(g), 1800);
    }
  }, 400);
})();
