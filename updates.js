/* Vérification des mises à jour Benoli Littéraire */
(() => {
  "use strict";

  // Version intégrée au site web. À incrémenter à chaque publication web.
  const VERSION_WEB = "1.0.1";
  const URL_VERSION = new URL("version.json", document.baseURI).href;
  const STYLE_ID = "benoli-update-style";
  const BANNER_ID = "benoli-update-banner";

  function estApplicationAndroid() {
    try {
      return !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform());
    } catch (_) {
      return false;
    }
  }

  function afficher(message, action, libelle, type) {
    if (document.getElementById(BANNER_ID)) return;
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
        #${BANNER_ID}{position:fixed;z-index:99999;left:12px;right:12px;bottom:calc(14px + env(safe-area-inset-bottom));max-width:560px;margin:auto;padding:15px 16px;border:1px solid rgba(225,190,116,.5);border-radius:16px;background:#111a2b;color:#fff8e9;box-shadow:0 12px 36px rgba(0,0,0,.42);font:14px/1.45 system-ui,sans-serif;display:flex;align-items:center;gap:12px}
        #${BANNER_ID} .bu-texte{flex:1;min-width:0}
        #${BANNER_ID} strong{display:block;color:#f0c875;font-size:15px;margin-bottom:3px}
        #${BANNER_ID} p{margin:0;color:#e5e0d5}
        #${BANNER_ID} button{flex:none;border:0;border-radius:999px;padding:10px 13px;background:#e6bd70;color:#171522;font:700 13px system-ui,sans-serif}
        #${BANNER_ID} .bu-fermer{background:transparent;color:#fff8e9;padding:6px;font-size:18px}
        @media(min-width:700px){#${BANNER_ID}{bottom:24px}}
      `;
      document.head.appendChild(style);
    }

    const banner = document.createElement("aside");
    banner.id = BANNER_ID;
    banner.setAttribute("role", "status");
    banner.innerHTML = '<div class="bu-texte"><strong></strong><p></p></div><button class="bu-action" type="button"></button><button class="bu-fermer" type="button" aria-label="Fermer">×</button>';
    banner.querySelector("strong").textContent = type === "apk" ? "Nouvelle version de Benoli" : "Mise à jour disponible";
    banner.querySelector("p").textContent = message;
    const bouton = banner.querySelector(".bu-action");
    bouton.textContent = libelle;
    bouton.addEventListener("click", action);
    banner.querySelector(".bu-fermer").addEventListener("click", () => banner.remove());
    document.body.appendChild(banner);
  }

  async function verifier() {
    try {
      const reponse = await fetch(URL_VERSION + "?t=" + Date.now(), { cache: "no-store" });
      if (!reponse.ok) return;
      const distant = await reponse.json();
      if (estApplicationAndroid()) {
        let local = VERSION_WEB;
        try {
          const r = await fetch(new URL("apk-version.json", document.baseURI).href + "?t=" + Date.now(), { cache: "no-store" });
          if (r.ok) {
            const donneesLocales = await r.json();
            if (donneesLocales.version) local = String(donneesLocales.version);
          }
        } catch (_) {}
        if (distant.apkVersion && comparer(distant.apkVersion, local) > 0 && distant.apkUrl) {
          afficher("La version " + distant.apkVersion + " est prête. Téléchargez-la puis ouvrez le fichier pour l’installer.", () => {
            window.open(distant.apkUrl, "_system");
          }, "Télécharger", "apk");
        }
      } else if (distant.version && comparer(distant.version, VERSION_WEB) > 0) {
        afficher("Une nouvelle version du site est disponible. Rechargez pour en profiter.", async () => {
          try {
            if ("serviceWorker" in navigator) {
              const registrations = await navigator.serviceWorker.getRegistrations();
              await Promise.all(registrations.map(registration => registration.update()));
            }
          } catch (_) {}
          window.location.reload();
        }, "Recharger", "web");
      }
    } catch (erreur) {
      console.info("Vérification des mises à jour indisponible.", erreur);
    }
  }

  function comparer(a, b) {
    const x = String(a).split(".").map(n => parseInt(n, 10) || 0);
    const y = String(b).split(".").map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
      if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
    }
    return 0;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", verifier, { once: true });
  } else {
    verifier();
  }
  // Une vérification périodique permet de détecter une publication sans fermer l’application.
  window.setInterval(verifier, 6 * 60 * 60 * 1000);
})();
