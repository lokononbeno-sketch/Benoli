/* Chargement du module d'aide à l'installation (installer.js).
   Fichier indépendant : s'il échoue, le reste de l'application continue de fonctionner. */
(function () {
  try {
    if (window.__benoliInstallerLoader) return;
    window.__benoliInstallerLoader = true;
    const s = document.createElement("script");
    s.src = "installer.js";
    document.body.appendChild(s);
  } catch (_) {}
})();

/* Langue de l'application — Benoli Littéraire
   Traduit toute l'interface avec Google Traduction (service gratuit).
   Les extraits des romans restent dans leur langue d'origine (français). */
(function () {
  "use strict";
  if (window.__benoliLangueReady) return;
  window.__benoliLangueReady = true;

  const select = document.getElementById("benoli-language");
  if (!select) return;

  /* Codes de Google qui diffèrent de ceux du sélecteur */
  const CODES = { zh: "zh-CN", he: "iw" };
  const code = v => CODES[v] || v;
  const hotes = [location.hostname, "." + location.hostname];

  /* Cacher la barre et les bulles de Google */
  const css = document.createElement("style");
  css.textContent = "body{top:0!important}iframe.skiptranslate,.goog-te-banner-frame,#goog-gt-tt,.goog-tooltip,.goog-te-balloon-frame{display:none!important}.goog-text-highlight{background:none!important;box-shadow:none!important}#google_translate_element{position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden}";
  document.head.appendChild(css);

  const zone = document.createElement("div");
  zone.id = "google_translate_element";
  document.body.appendChild(zone);

  /* Cookie utilisé par Google pour mémoriser la langue */
  const poserCookie = v => { document.cookie = "googtrans=/fr/" + code(v) + ";path=/"; };
  const effacerCookie = () => {
    const vieux = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = vieux;
    hotes.forEach(h => { document.cookie = vieux + ";domain=" + h; });
  };
  const cookieActif = () => /(?:^|;\s*)googtrans=\/[^;\/]+\/[^;]+/.test(document.cookie);

  /* Ne pas traduire le nom de l'application, le sélecteur de langue et les extraits des romans */
  const proteger = () => {
    document.querySelectorAll(".benoli-brand,.benoli-lang,header.hero h1,.extrait,#benoli-covers").forEach(e => {
      if (e.getAttribute("translate") !== "no") {
        e.setAttribute("translate", "no");
        e.classList.add("notranslate");
      }
    });
  };
  proteger();
  const fiche = document.getElementById("ficheContenu");
  if (fiche && window.MutationObserver) {
    let t = null;
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(proteger, 60); })
      .observe(fiche, { childList: true, subtree: true });
  }

  /* Chargement du service de traduction (une seule fois) */
  let chargement = null;
  const charger = () => {
    if (chargement) return chargement;
    chargement = new Promise((resolve, reject) => {
      window.benoliTraductionPrete = () => {
        try {
          new window.google.translate.TranslateElement({ pageLanguage: "fr", autoDisplay: false }, "google_translate_element");
          resolve();
        } catch (e) { reject(e); }
      };
      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=benoliTraductionPrete";
      s.async = true;
      s.onerror = () => reject(new Error("Traduction indisponible"));
      document.head.appendChild(s);
    }).catch(e => { chargement = null; throw e; });
    return chargement;
  };

  const attendreCombo = () => new Promise((resolve, reject) => {
    let essais = 0;
    const tick = () => {
      const c = document.querySelector("select.goog-te-combo");
      if (c && c.options.length > 1) return resolve(c);
      if (++essais > 60) return reject(new Error("Traduction indisponible"));
      setTimeout(tick, 150);
    };
    tick();
  });

  let traduit = cookieActif();

  async function appliquer(lang) {
    if (lang === "fr") {
      effacerCookie();
      if (traduit) location.reload();
      return;
    }
    poserCookie(lang);
    traduit = true;
    try {
      await charger();
      const c = await attendreCombo();
      c.value = code(lang);
      c.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (e) {
      alert("La traduction n'a pas pu être chargée. Vérifie ta connexion Internet puis réessaie.");
    }
  }

  select.addEventListener("change", () => appliquer(select.value));
  if (select.value && select.value !== "fr") appliquer(select.value);
})();
