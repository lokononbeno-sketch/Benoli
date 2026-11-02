/* =====================================================================
   CORRECTIFS + DESIGN 2027 — Benoli Littéraire
   Chargé automatiquement après index.html (voir fin de stories.js).
   Chaque bloc est indépendant : si l'un échoue, les autres continuent.
   ===================================================================== */
(function () {
  "use strict";

  /* 1. Polices Google : le @import placé au milieu du CSS était ignoré
        par les navigateurs. On les charge ici avec des balises <link>. */
  try {
    const pc1 = document.createElement("link");
    pc1.rel = "preconnect"; pc1.href = "https://fonts.googleapis.com";
    const pc2 = document.createElement("link");
    pc2.rel = "preconnect"; pc2.href = "https://fonts.gstatic.com"; pc2.crossOrigin = "";
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Sora:wght@400;600;700;800&display=swap";
    document.head.append(pc1, pc2, css);
  } catch (_) {}

  /* 2. Assistant : « Tome 2 » / « Tome 3 » renvoyaient toujours le Tome 1. */
  try {
    if (typeof ROMANS !== "undefined" && typeof mots === "function" && typeof norm === "function") {
      const tomeDe = r => {
        const t = norm(r.titre);
        const m = t.match(/tome\s*([0-9])/);
        if (m) return m[1];
        return t.includes("maison d'en face") ? "1" : null;
      };
      window.trouverRoman = function (texte) {
        const mq = mots(texte);
        const dem = norm(texte).match(/\b(?:tome|t)\s*([0-9])\b/);
        const num = dem ? dem[1] : null;
        let best = null, sc = 0;
        ROMANS.forEach(r => {
          const mt = mots(r.titre);
          const n = mt.filter(w => mq.includes(w)).length;
          if (n === 0) return;
          let s = mt.length ? n / mt.length : 0;
          const tr = tomeDe(r);
          if (num && tr) s += (tr === num ? 0.5 : -0.5);
          if (s > sc) { sc = s; best = r; }
        });
        return sc >= 0.5 ? best : null;
      };
    }
  } catch (_) {}

  /* 3. Assistant : expressions régulières cassées (\\s et \\n) dans le code
        d'origine. On nettoie la question avant qu'elle soit analysée, et on
        transforme les retours à la ligne des résumés en <br>. */
  try {
    if (typeof aRepondre === "function") {
      const origine = aRepondre;
      window.aRepondre = function (t) {
        const propre = String(t).replace(/[^\p{L}\p{N}]+/gu, " ").trim();
        const sortie = origine(propre);
        return typeof sortie === "string" ? sortie.replace(/\n/g, "<br>") : sortie;
      };
    }
  } catch (_) {}

  /* 4. Couvertures : si une image distante (Chariow) ne charge pas, on
        affiche la couverture « texte » au lieu d'une case vide. */
  try {
    const secours = img => {
      if (!img || img.tagName !== "IMG") return;
      const cv = img.closest(".cv");
      if (!cv || cv.querySelector("span")) return;
      const titre = (img.alt || "").replace(/^Couverture de\s*/i, "");
      img.remove();
      const s = document.createElement("span");
      s.textContent = titre || "Benoli";
      cv.appendChild(s);
    };
    document.addEventListener("error", e => secours(e.target), true);
    document.querySelectorAll(".cv img").forEach(img => {
      img.decoding = "async";
      if (img.complete && img.naturalWidth === 0) secours(img);
    });
  } catch (_) {}

  /* 5. Accueil plus rapide : le carrousel de fond chargeait 10 couvertures
        de 2 Mo chacune (x2 avec les doublons). On en garde 7 par moitié. */
  try {
    const track = document.querySelector("#benoli-covers .covers-track");
    if (track) {
      const total = track.children.length, moitie = total / 2, garde = 7;
      if (Number.isInteger(moitie) && moitie > garde) {
        for (let i = total - 1; i >= 0; i--) {
          if (i % moitie >= garde) track.children[i].remove();
        }
      }
    }
  } catch (_) {}

  /* 6. DESIGN 2027 « Aurora Glass » : feuille de style + barre de navigation
        flottante. Pour revenir à l'ancien design, supprime ce bloc 6. */
  try {
    const lienCss = document.createElement("link");
    lienCss.rel = "stylesheet";
    lienCss.href = "futur-2027.css";
    document.head.appendChild(lienCss);
    document.body.classList.add("futur");

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", "#05060f");

    if (!document.querySelector(".f-dock")) {
      const SVG = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
      const ICONES = {
        home: SVG('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>'),
        romans: SVG('<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/>'),
        lyrics: SVG('<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'),
        communaute: SVG('<path d="M4 5h16v11H9l-5 4z"/>'),
        profil: SVG('<circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-4 4-6 7.5-6s6.7 2 7.5 6"/>')
      };
      const ONGLETS = [
        ["home", "#", "Accueil"],
        ["romans", "#/romans", "Romans"],
        ["lyrics", "#/lyrics", "Lyrics"],
        ["communaute", "#/communaute", "Communauté"],
        ["profil", "#/profil", "Profil"]
      ];
      const nav = document.createElement("nav");
      nav.className = "f-dock";
      nav.setAttribute("aria-label", "Navigation rapide");
      nav.innerHTML = ONGLETS.map(([k, h, t]) =>
        '<a href="' + h + '" data-k="' + k + '">' + ICONES[k] + '<span>' + t + '</span></a>').join("");
      document.body.appendChild(nav);

      const maj = () => {
        const h = location.hash;
        const cle = (!h || h === "#") ? "home"
          : h.startsWith("#/romans") ? "romans"
          : h.startsWith("#/lyrics") ? "lyrics"
          : h.startsWith("#/communaute") ? "communaute"
          : h.startsWith("#/profil") ? "profil" : "";
        nav.querySelectorAll("a").forEach(a => {
          const actif = a.dataset.k === cle;
          a.classList.toggle("on", actif);
          if (actif) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
        });
      };
      window.addEventListener("hashchange", maj);
      maj();

      nav.querySelector('[data-k="home"]').addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      /* La barre se cache quand le clavier est ouvert. */
      const champ = e => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      document.addEventListener("focusin", e => { if (champ(e)) document.body.classList.add("f-typing"); });
      document.addEventListener("focusout", () => document.body.classList.remove("f-typing"));
    }
  } catch (_) {}
})();
