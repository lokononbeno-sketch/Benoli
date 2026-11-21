/* BENOLI — Ajustements de l'interface (fichier indépendant)
   - barre du bas simplifiée : Accueil, Romans, Quiz, Pensées, Menu ;
   - bouton Assistant réduit en pastille ronde, pour ne plus cacher le texte ;
   - menu latéral : ajout de « Mes récompenses » et correction du lien du groupe WhatsApp. */
(function () {
  "use strict";
  if (window.__benoliAjustements) return;
  window.__benoliAjustements = true;

  const css = document.createElement("style");
  css.id = "benoli-ajustements";
  css.textContent =
    "#navBas a:not([data-n=accueil]):not([data-n=romans]):not([data-n=quiz]):not([data-n=sagesse]){display:none!important}" +
    "#navBas button{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;padding:8px 2px 7px;border:1px solid transparent;border-radius:21px;background:transparent;font:inherit;font-size:clamp(.64rem,2.8vw,.76rem);line-height:1.12;font-weight:650;color:#d1c9df;cursor:pointer}" +
    "#navBas button span{display:block;font-size:1.42rem;line-height:1.05}" +
    "#navBas button:active{transform:scale(.96)}" +
    "#navBas button:focus-visible{outline:2px solid #ff9b60;outline-offset:-3px}" +
    "#aBtn{right:14px!important;left:auto!important;bottom:calc(86px + env(safe-area-inset-bottom))!important;width:50px;height:50px;padding:0!important;border-radius:50%!important;font-size:0!important;line-height:0}" +
    "#aBtn:before{content:'💬';display:block;font-size:1.45rem;line-height:50px;text-align:center}";
  document.head.appendChild(css);

  const cleActive = () => {
    const h = location.hash;
    if (!h || h === "#") return "accueil";
    const id = h.replace(/^#\//, "").split(/[?&]/)[0];
    return ["romans", "quiz", "sagesse"].indexOf(id) >= 0 ? id : "";
  };

  function barre() {
    const nav = document.getElementById("navBas");
    if (!nav) return;
    if (!nav.querySelector('[data-n="accueil"]'))
      nav.insertAdjacentHTML("afterbegin", '<a href="#" data-n="accueil"><span>🏠</span>Accueil</a>');
    if (!nav.querySelector('[data-n="menu"]')) {
      nav.insertAdjacentHTML("beforeend", '<button type="button" data-n="menu" aria-label="Ouvrir le menu"><span>☰</span>Menu</button>');
      nav.addEventListener("click", e => {
        if (!e.target.closest('button[data-n="menu"]')) return;
        const b = document.getElementById("benoliMenuBtn");
        if (b) b.click();
      });
    }
    const k = cleActive();
    nav.querySelectorAll("a").forEach(a => a.classList.toggle("actif", a.dataset.n === k));
  }

  function menu() {
    const m = document.getElementById("benoliMenu");
    if (!m) return;
    if (!m.querySelector('a[href="#/recompenses"]')) {
      const quiz = m.querySelector('a[href="#/quiz"]');
      const lien = '<a class="bm-lien" href="#/recompenses"><span class="bm-emoji">🏆</span> Mes récompenses</a>';
      if (quiz) quiz.insertAdjacentHTML("afterend", lien);
    }
    m.querySelectorAll('a[href="https://chat.whatsapp.com/GVNCwcmL0P57pGiBn7AQn"]').forEach(a => {
      a.setAttribute("href", "https://chat.whatsapp.com/GVNCwcmL0P57pGiBn7AQnN");
    });
  }

  function assistant() {
    const b = document.getElementById("aBtn");
    if (b) b.setAttribute("aria-label", "Ouvrir l'assistant Benoli");
  }

  const tout = () => { barre(); menu(); assistant(); };
  tout();
  window.addEventListener("hashchange", barre);
  window.addEventListener("load", () => { tout(); setTimeout(tout, 600); });
})();
