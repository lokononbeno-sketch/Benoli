/* BENOLI — Arbre vivant de l'accueil.
   - arbre illustré (feuillage, tronc torsadé, racines) avec les romans accrochés aux branches ;
   - plus de couvertures qui défilent derrière le titre ;
   - des lecteurs de style animé marchent vers l'arbre, s'assoient, lisent 15 secondes, repartent. */
(function () {
  "use strict";
  if (window.__benoliArbreVivant) return;
  window.__benoliArbreVivant = true;

  /* 1. Plus de couvertures qui tournent */
  const nettoyer = () => document.querySelectorAll("#benoli-covers,#benoli-lecteur-scene").forEach(e => e.remove());
  nettoyer();
  const hide = document.createElement("style");
  hide.textContent = "#benoli-covers,#benoli-lecteur-scene{display:none!important}";
  document.head.appendChild(hide);

  const ancien = document.querySelector("#benoli-arbre-accueil .benoli-arbre-svg");
  if (!ancien) return;

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shade = (hex, f) => {
    const n = parseInt(hex.slice(1), 16);
    const c = v => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, "0");
    return "#" + c(n >> 16) + c((n >> 8) & 255) + c(n & 255);
  };
  const alea = (graine => () => {
    graine |= 0; graine = graine + 0x6D2B79F5 | 0;
    let t = Math.imul(graine ^ graine >>> 15, 1 | graine);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  })(20261121);

  /* 2. Feuillage : feuilles pointues posées en rayon autour de la couronne */
  const VERTS = [
    ["#1d5a30", "#256a35", "#2c7a3c"],
    ["#3a8f45", "#4aa04f", "#5bb05a"],
    ["#79c46a", "#8fd070", "#a9dc7b"]
  ];
  const feuille = (x, y, a, s, fill) =>
    '<g transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + a.toFixed(0) + ") scale(" + s.toFixed(2) + ')">' +
    '<path d="M0 0C7 -7 8 -19 0 -30C-8 -19 -7 -7 0 0Z" fill="' + fill + '" stroke="#17492a" stroke-width=".7"/>' +
    '<path d="M0 -3L0 -24" stroke="#e9f5c9" stroke-width=".8" opacity=".45"/></g>';

  const points = [];
  for (let essai = 0; essai < 900 && points.length < 230; essai++) {
    const x = 260 + (alea() * 2 - 1) * 224, y = 138 + (alea() * 2 - 1) * 142;
    const dx = (x - 260) / 224, dy = (y - 138) / 142;
    if (dx * dx + dy * dy > 1 || y > 268) continue;
    if (points.some(p => (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y) < 15 * 15)) continue;
    points.push({ x, y });
  }
  let feuillesArriere = "", feuillesAvant = "";
  points.forEach((p, i) => {
    const haut = 1 - Math.min(1, Math.max(0, (p.y - 20) / 250));
    const couche = i % 2 === 0 ? 0 : 1;
    const niveau = Math.min(2, Math.max(0, Math.floor(haut * 2.2 + alea() * 0.9 - 0.2) + couche));
    const palette = VERTS[niveau], fill = palette[Math.floor(alea() * 3)];
    const angle = Math.atan2(p.y - 150, p.x - 260) * 180 / Math.PI + 90 + (alea() * 100 - 50);
    const f = feuille(p.x, p.y, angle, 0.85 + alea() * 0.4, fill);
    if (couche === 0) feuillesArriere += f; else feuillesAvant += f;
  });

  /* 3. Livres du catalogue accrochés aux branches */
  const SPOTS = [
    [166, 83, -3, 1], [98, 166, -14, 1], [268, 151, 4, .82], [354, 79, 9, 1],
    [427, 163, -5, 1.08], [121, 265, -4, 1], [374, 257, 4, 1]
  ];
  const romans = (typeof ROMANS !== "undefined" && Array.isArray(ROMANS) ? ROMANS : []).filter(r => r && r.couverture);
  let livres = "";
  SPOTS.forEach((s, i) => {
    const r = romans[i];
    if (!r) return;
    const corps =
      '<rect x="-22" y="-36" width="56" height="80" rx="3" fill="#b88b5a"/>' +
      '<rect x="-23" y="-37" width="54" height="79" rx="3" fill="#f0e4c8"/>' +
      '<path d="M26 -33V40M29 -33V40" stroke="#c9b387" stroke-width=".8"/>' +
      '<rect x="-27" y="-39" width="54" height="78" rx="3" fill="#2b2140"/>' +
      '<image href="' + esc(r.couverture) + '" x="-27" y="-39" width="54" height="78" preserveAspectRatio="xMidYMid slice" clip-path="url(#bt-clip)"/>' +
      '<rect x="-27" y="-39" width="6" height="78" rx="3" fill="#2a1a10" opacity=".5"/>' +
      '<rect x="-27" y="-39" width="54" height="78" rx="3" fill="none" stroke="#d8b36a" stroke-width="1.3"/>';
    livres +=
      '<g transform="translate(' + s[0] + " " + s[1] + ") rotate(" + s[2] + ") scale(" + s[3] + ')">' +
      '<a href="#/' + encodeURIComponent(r.id) + '" aria-label="Ouvrir ' + esc(r.titre) + '">' +
      '<g class="bt-balance" style="animation-delay:-' + (i * 1.3).toFixed(1) + 's">' + corps + "</g></a></g>";
  });

  /* 4. Le dessin complet de l'arbre */
  const tronc =
    '<g fill="none" stroke="url(#bt-ecorce)" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M262 350C238 316 250 284 262 256C272 232 262 204 262 176" stroke-width="46"/>' +
    '<path d="M262 262C262 230 262 200 264 168" stroke-width="30"/>' +
    '<path d="M250 268C214 258 178 240 140 216C118 202 100 192 84 178" stroke-width="17"/>' +
    '<path d="M254 232C232 208 222 182 214 152C210 132 202 112 188 94" stroke-width="14"/>' +
    '<path d="M264 208C268 184 270 166 272 142" stroke-width="10"/>' +
    '<path d="M268 222C302 202 330 176 344 142C352 124 358 110 368 92" stroke-width="14"/>' +
    '<path d="M272 266C312 256 352 240 392 216C410 205 424 192 432 176" stroke-width="17"/>' +
    '<path d="M250 304C214 298 176 300 138 280C132 276 128 272 126 268" stroke-width="12"/>' +
    '<path d="M274 304C310 298 342 294 372 266" stroke-width="12"/>' +
    '<path d="M242 340C214 350 188 354 158 354M254 348C242 356 226 360 204 362M284 340C310 350 338 354 368 354M272 348C286 356 302 360 322 362" stroke-width="13"/>' +
    "</g>" +
    '<g fill="none" stroke-linecap="round">' +
    '<path d="M256 342C240 308 252 280 263 252C274 226 264 204 262 176" stroke="#e3a15f" stroke-width="3" opacity=".6"/>' +
    '<path d="M270 340C262 312 272 284 266 256C262 232 268 206 264 178" stroke="#e3a15f" stroke-width="2.4" opacity=".5"/>' +
    '<path d="M246 340C230 310 238 284 250 258C256 238 252 214 256 186" stroke="#4a2616" stroke-width="2.6" opacity=".55"/>' +
    '<path d="M280 336C290 310 286 282 276 258" stroke="#4a2616" stroke-width="2.4" opacity=".5"/>' +
    '<path d="M250 268C214 258 178 240 140 216" stroke="#e3a15f" stroke-width="2.2" opacity=".55"/>' +
    '<path d="M272 266C312 256 352 240 392 216" stroke="#e3a15f" stroke-width="2.2" opacity=".55"/>' +
    '<path d="M254 232C232 208 222 182 214 152" stroke="#4a2616" stroke-width="2" opacity=".5"/>' +
    '<path d="M268 222C302 202 330 176 344 142" stroke="#4a2616" stroke-width="2" opacity=".5"/>' +
    "</g>";

  const etincelle = (x, y, d) =>
    '<path class="bt-etincelle" style="animation-delay:' + d + 's" d="M' + x + " " + (y - 6) + "l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8z" + '" fill="#ffdc45"/>';
  const tombantes = [[130, 215, 0], [215, 245, 3.4], [330, 232, 6.1], [400, 205, 8.3]]
    .map(f => '<g class="bt-chute" style="animation-delay:-' + f[2] + 's"><g transform="translate(' + f[0] + " " + f[1] + ') rotate(40) scale(.7)">' +
      '<path d="M0 0C7 -7 8 -19 0 -30C-8 -19 -7 -7 0 0Z" fill="#a9dc7b" stroke="#17492a" stroke-width=".7"/></g></g>').join("");

  const dessin =
    '<defs>' +
    '<linearGradient id="bt-ecorce" x1="0" x2="1"><stop stop-color="#4b2819"/><stop offset=".3" stop-color="#a75d2d"/><stop offset=".56" stop-color="#d18a43"/><stop offset=".8" stop-color="#7a4323"/><stop offset="1" stop-color="#3d2419"/></linearGradient>' +
    '<radialGradient id="bt-halo"><stop stop-color="#2f7a43" stop-opacity=".55"/><stop offset="1" stop-color="#1d5a30" stop-opacity="0"/></radialGradient>' +
    '<clipPath id="bt-clip"><rect x="-27" y="-39" width="54" height="78" rx="3"/></clipPath>' +
    "</defs>" +
    '<ellipse cx="260" cy="150" rx="250" ry="168" fill="url(#bt-halo)"/>' +
    '<ellipse cx="262" cy="356" rx="205" ry="12" fill="#031f17" opacity=".5"/>' +
    '<g class="bt-feuillage">' + feuillesArriere + "</g>" +
    tronc +
    '<g class="bt-feuillage bt-feuillage-avant">' + feuillesAvant + "</g>" +
    livres +
    etincelle(42, 262, 0) + etincelle(480, 120, 1.2) + etincelle(438, 290, 2.1) + etincelle(300, 40, 0.7) +
    tombantes +
    '<g id="bt-perso" style="transform:translate(-80px,352px)"><g id="bt-flip"><g id="bt-corps"></g></g></g>';

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "benoli-arbre-svg");
  svg.setAttribute("viewBox", "0 0 520 380");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Grand arbre aux feuilles vertes, au tronc torsadé, avec les romans de Benoli accrochés aux branches");
  svg.innerHTML = dessin;
  ancien.replaceWith(svg);

  /* 5. Style : vent, feuilles qui tombent, étincelles, gestes des personnages */
  const style = document.createElement("style");
  style.textContent =
    ".bt-feuillage{transform-box:fill-box;transform-origin:50% 100%;animation:bt-vent 6s ease-in-out infinite}" +
    ".bt-feuillage-avant{animation-duration:5s;animation-delay:-1.5s}" +
    "@keyframes bt-vent{0%,100%{transform:rotate(-.7deg)}50%{transform:rotate(.9deg)}}" +
    ".bt-balance{transform-box:fill-box;transform-origin:50% 0;animation:bt-balance 5.2s ease-in-out infinite}" +
    "@keyframes bt-balance{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}" +
    ".bt-etincelle{transform-box:fill-box;transform-origin:50% 50%;animation:bt-brille 3.2s ease-in-out infinite}" +
    "@keyframes bt-brille{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}" +
    ".bt-chute{animation:bt-chute 12s linear infinite;opacity:0}" +
    "@keyframes bt-chute{0%{transform:translate(0,0) rotate(0);opacity:0}8%{opacity:.9}100%{transform:translate(46px,128px) rotate(280deg);opacity:0}}" +
    ".bt-assoit{animation:bt-assoit .55s ease-out both}" +
    "@keyframes bt-assoit{from{transform:translateY(-9px) scale(1.05,.9)}to{transform:none}}" +
    ".bt-leve{animation:bt-leve .4s ease-out both}" +
    "@keyframes bt-leve{from{transform:translateY(7px) scale(.96,1.05)}to{transform:none}}" +
    "#bt-perso{transition-property:transform;transition-timing-function:linear}" +
    "@media(prefers-reduced-motion:reduce){.bt-feuillage,.bt-balance,.bt-etincelle,.bt-chute{animation:none}.bt-chute{display:none}}";
  document.head.appendChild(style);

  /* 6. Les personnages (style animé) */
  const PERSOS = [
    { peau: "#8a5238", cheveux: "#15100d", haut: "#2f8f5b", bas: "#2b3a55", pieds: "#f1efe6", style: "pointes" },
    { peau: "#6f402f", cheveux: "#150f0f", haut: "#e0752f", bas: "#3a2f4a", pieds: "#f0d27a", style: "longs" },
    { peau: "#a56a48", cheveux: "#1a1410", haut: "#3b73b9", bas: "#b99a62", pieds: "#ffffff", style: "pointes" },
    { peau: "#7a4a33", cheveux: "#120d0c", haut: "#f0c23a", bas: "#6a3fa0", pieds: "#e9e3d6", style: "boules" },
    { peau: "#946046", cheveux: "#17110e", haut: "#b8423b", bas: "#2f3d2f", pieds: "#f4f0e4", style: "pointes" }
  ];

  const oeilProfil = (c) =>
    '<g transform="translate(10 -82)"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .08;1 1;1 1" keyTimes="0;.9;.94;.98;1" dur="4.2s" repeatCount="indefinite"/>' +
    '<ellipse rx="4.3" ry="6.2" fill="#2b1a12"/><ellipse cy="2.2" rx="3" ry="3.2" fill="#7a4a2a" opacity=".8"/>' +
    '<circle cx="1.5" cy="-2.4" r="1.9" fill="#fff"/><circle cx="-1.6" cy="2.6" r=".9" fill="#fff"/></g>' +
    '<path d="M-5 -4Q0 -8.6 5.2 -3.4" stroke="#120a07" stroke-width="2" fill="none" stroke-linecap="round"/></g>';

  function marcheur(p) {
    const dkBas = shade(p.bas, .78), dkPeau = shade(p.peau, .82), dkHaut = shade(p.haut, .8);
    let arriere = "", capuche;
    if (p.style === "longs") arriere = '<path d="M-14 -92C-31 -90 -31 -60 -22 -43C-13 -48 -11 -62 -7 -74Z" fill="' + p.cheveux + '"/>';
    if (p.style === "boules") arriere = '<circle cx="-11" cy="-104" r="9.5" fill="' + p.cheveux + '"/><circle cx="8" cy="-107" r="8" fill="' + p.cheveux + '"/>';
    capuche = p.style === "pointes"
      ? "M-18 -78C-22 -100 -2 -106 10 -104C20 -102 22 -92 20 -88L15 -93L12 -87L7 -94L3 -88L-2 -95L-6 -88L-11 -94L-14 -86Z"
      : "M-18 -78C-22 -100 -2 -106 10 -104C20 -102 22 -92 20 -88C14 -94 8 -96 2 -92C-4 -92 -10 -90 -14 -84Z";
    const jambe = (couleur, vals) =>
      '<g><animateTransform attributeName="transform" type="rotate" values="' + vals + '" dur=".7s" repeatCount="indefinite"/>' +
      '<rect x="-5" y="-31" width="10" height="28" rx="5" fill="' + couleur + '"/><ellipse cx="3" cy="-2.5" rx="9" ry="4.5" fill="' + p.pieds + '"/></g>';
    const bras = (manche, vals) =>
      '<g><animateTransform attributeName="transform" type="rotate" values="' + vals + '" dur=".7s" repeatCount="indefinite"/>' +
      '<rect x="-4" y="-58" width="8" height="25" rx="4" fill="' + p.peau + '"/><rect x="-5" y="-59" width="10" height="12" rx="4.5" fill="' + manche + '"/>' +
      '<circle cx="0" cy="-33" r="4.6" fill="' + p.peau + '"/></g>';
    return '<ellipse cx="0" cy=".5" rx="21" ry="4" fill="#000" opacity=".28"/>' +
      jambe(dkBas, "-26 0 -30;26 0 -30;-26 0 -30") +
      bras(dkHaut, "28 0 -58;-28 0 -58;28 0 -58") +
      '<rect x="-12" y="-66" width="24" height="38" rx="10" fill="' + p.haut + '"/><rect x="-12" y="-35" width="24" height="7" rx="3" fill="' + p.bas + '"/>' +
      jambe(p.bas, "26 0 -30;-26 0 -30;26 0 -30") +
      bras(p.haut, "-28 0 -58;28 0 -58;-28 0 -58") +
      '<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -1.6;0 0" dur=".35s" repeatCount="indefinite"/>' +
      arriere + '<rect x="-4" y="-71" width="8" height="9" fill="' + dkPeau + '"/><circle cx="1" cy="-82" r="19" fill="' + p.peau + '"/>' +
      '<ellipse cx="-5" cy="-81" rx="3.6" ry="4.6" fill="' + dkPeau + '"/>' + oeilProfil() +
      '<path d="M5 -91Q10 -93.6 15 -91" stroke="' + p.cheveux + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="9" cy="-73" rx="3.4" ry="2" fill="#ff8a8a" opacity=".35"/>' +
      '<path d="M12 -70.5Q14.5 -68.8 17 -71" stroke="#5a2a22" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M19.4 -79q1.8 1.8 -.4 3.2" stroke="' + dkPeau + '" stroke-width="1.3" fill="none" stroke-linecap="round"/>' +
      '<path d="' + capuche + '" fill="' + p.cheveux + '"/></g>';
  }

  const oeilFace = (x, peau) =>
    '<g transform="translate(' + x + ' -62)"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .08;1 1;1 1" keyTimes="0;.9;.94;.98;1" dur="4.6s" repeatCount="indefinite"/>' +
    '<ellipse rx="4.5" ry="6" fill="#2b1a12"/><ellipse cy="2" rx="3" ry="3" fill="#7a4a2a" opacity=".8"/>' +
    '<circle cx="1.4" cy="-.4" r="1.8" fill="#fff"/><circle cx="-1.5" cy="3.2" r=".9" fill="#fff"/></g>' +
    '<path d="M-5.4 -5Q0 -9.2 5.4 -5L5.4 -1.8Q0 -4.6 -5.4 -1.8Z" fill="' + peau + '"/>' +
    '<path d="M-5.4 -1.8Q0 -4.6 5.4 -1.8" stroke="#120a07" stroke-width="2" fill="none" stroke-linecap="round"/></g>';

  function lecteur(p) {
    const dkBas = shade(p.bas, .78), dkPeau = shade(p.peau, .82);
    let derriere = "", cheveuxAvant;
    if (p.style === "longs") derriere = '<path d="M-19 -66C-27 -50 -24 -32 -17 -26L-10 -40L-12 -62Z" fill="' + p.cheveux + '"/><path d="M19 -66C27 -50 24 -32 17 -26L10 -40L12 -62Z" fill="' + p.cheveux + '"/>';
    if (p.style === "boules") derriere = '<circle cx="-17" cy="-81" r="9.5" fill="' + p.cheveux + '"/><circle cx="17" cy="-81" r="9.5" fill="' + p.cheveux + '"/>';
    cheveuxAvant = p.style === "pointes"
      ? "M-19 -62C-23 -86 -5 -90 0 -88C6 -90 23 -86 19 -62L15 -70L12 -62L7 -72L3 -64L-2 -73L-6 -65L-11 -72L-15 -63Z"
      : "M-19 -62C-23 -86 -5 -90 0 -88C6 -90 23 -86 19 -62C14 -70 8 -74 0 -72C-8 -74 -14 -70 -19 -62Z";
    return '<ellipse cx="0" cy=".5" rx="32" ry="5" fill="#000" opacity=".28"/>' + derriere +
      '<ellipse cx="-15" cy="-8" rx="21" ry="8.5" fill="' + p.bas + '"/><ellipse cx="15" cy="-8" rx="21" ry="8.5" fill="' + dkBas + '"/>' +
      '<ellipse cx="-33" cy="-5" rx="6.5" ry="4.2" fill="' + p.pieds + '"/><ellipse cx="33" cy="-5" rx="6.5" ry="4.2" fill="' + p.pieds + '"/>' +
      '<ellipse cx="0" cy="-10" rx="12" ry="5" fill="' + p.bas + '"/>' +
      '<path d="M-13 -14C-15 -34 -13 -46 -9 -50L9 -50C13 -46 15 -34 13 -14Z" fill="' + p.haut + '"/>' +
      '<g><animateTransform attributeName="transform" type="scale" values=".1 1;1 1" dur=".7s" fill="freeze"/>' +
      '<path d="M-28 -8L0 -4L28 -8L28 -4.5L0 -.5L-28 -4.5Z" fill="#6a432e"/>' +
      '<path d="M0 -6L-27 -9L-29 -26L0 -23Z" fill="#fff8e6" stroke="#cdbb92" stroke-width="1"/>' +
      '<path d="M0 -6L27 -9L29 -26L0 -23Z" fill="#fff8e6" stroke="#cdbb92" stroke-width="1"/>' +
      '<path d="M-24 -21L-5 -19.5M-24 -16L-5 -14.5M-24 -11.5L-5 -10.5M5 -19.5L24 -21M5 -14.5L24 -16M5 -10.5L24 -11.5" stroke="#b9a984" stroke-width="1" opacity=".8"/>' +
      '<path d="M0 -6L27 -9L29 -26L0 -23Z" fill="#fffaf0" stroke="#cdbb92" stroke-width="1"><animateTransform attributeName="transform" type="scale" values="1 1;1 1;.05 1;-1 1;-1 1;1 1" keyTimes="0;.55;.62;.7;.92;1" dur="6s" repeatCount="indefinite"/></path></g>' +
      '<path d="M-11 -47L-18 -33" stroke="' + p.haut + '" stroke-width="9" stroke-linecap="round"/><path d="M-18 -33L-19 -24" stroke="' + p.peau + '" stroke-width="7" stroke-linecap="round"/><circle cx="-19" cy="-22.5" r="4.4" fill="' + p.peau + '"/>' +
      '<path d="M11 -47L18 -33" stroke="' + p.haut + '" stroke-width="9" stroke-linecap="round"/><path d="M18 -33L19 -24" stroke="' + p.peau + '" stroke-width="7" stroke-linecap="round"/><circle cx="19" cy="-22.5" r="4.4" fill="' + p.peau + '"/>' +
      '<rect x="-3.5" y="-53" width="7" height="7" fill="' + dkPeau + '"/>' +
      '<g><animateTransform attributeName="transform" type="rotate" values="3 0 -48;7 0 -48;3 0 -48" dur="5s" repeatCount="indefinite"/>' +
      '<circle cx="0" cy="-64" r="19" fill="' + p.peau + '"/><ellipse cx="-19" cy="-63" rx="3.6" ry="4.6" fill="' + dkPeau + '"/><ellipse cx="19" cy="-63" rx="3.6" ry="4.6" fill="' + dkPeau + '"/>' +
      oeilFace(-7.5, p.peau) + oeilFace(7.5, p.peau) +
      '<path d="M-12 -72.5Q-7.5 -75 -3 -73M3 -73Q7.5 -75 12 -72.5" stroke="' + p.cheveux + '" stroke-width="1.7" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="-12.5" cy="-55.5" rx="3.4" ry="2" fill="#ff8a8a" opacity=".35"/><ellipse cx="12.5" cy="-55.5" rx="3.4" ry="2" fill="#ff8a8a" opacity=".35"/>' +
      '<path d="M-3 -53.6Q0 -51.4 3 -53.6" stroke="#5a2a22" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      '<path d="' + cheveuxAvant + '" fill="' + p.cheveux + '"/></g>';
  }

  /* 7. Le scénario : marche, s'assoit, lit 15 s, se relève, repart — puis un autre arrive */
  const perso = svg.querySelector("#bt-perso"), flip = svg.querySelector("#bt-flip"), corps = svg.querySelector("#bt-corps");
  const calme = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dormir = ms => new Promise(r => setTimeout(r, ms));
  let enVue = true;
  if (window.IntersectionObserver) new IntersectionObserver(es => { enVue = es[0].isIntersecting; }).observe(svg);
  const attendre = async () => { while (document.hidden || !enVue) await dormir(800); };
  const afficher = h => { corps.innerHTML = h; try { svg.setCurrentTime(0); } catch (_) {} };
  const placer = (x, duree) => {
    perso.style.transitionDuration = duree + "ms";
    perso.style.transform = "translate(" + x + "px,352px)";
  };

  async function visite(p, cote) {
    const depart = cote < 0 ? -70 : 590, assis = 262 + cote * 66, marche = calme ? 0 : 4600;
    corps.removeAttribute("class");
    afficher(marcheur(p));
    flip.style.transform = "scaleX(" + (cote < 0 ? 1 : -1) + ")";
    placer(depart, 0);
    void perso.getBoundingClientRect();
    placer(assis, marche);
    await dormir(marche + 100);

    flip.style.transform = "scaleX(1)";
    afficher(lecteur(p));
    corps.setAttribute("class", "bt-assoit");
    await dormir(15000);

    flip.style.transform = "scaleX(" + (cote < 0 ? -1 : 1) + ")";
    afficher(marcheur(p));
    corps.setAttribute("class", "bt-leve");
    await dormir(400);
    placer(depart, marche);
    await dormir(marche + 100);
    corps.innerHTML = "";
  }

  (async function boucle() {
    let i = 0;
    await dormir(1500);
    for (;;) {
      await attendre();
      await visite(PERSOS[i % PERSOS.length], i % 2 === 0 ? -1 : 1);
      i++;
      await dormir(1200);
    }
  })();
})();
