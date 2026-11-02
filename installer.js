/* Bouton « Installer Benoli Littéraire » — aide adaptée quand l'installation en un clic n'est pas possible.
   Si le navigateur autorise l'installation, le bouton du menu l'ouvre directement (géré dans extras.js).
   Sinon, ce module remplace l'ancien message générique par une aide adaptée à l'appareil. */
(function () {
  "use strict";
  if (window.__benoliInstallerReady) return;
  window.__benoliInstallerReady = true;

  const ua = navigator.userAgent || "";
  const ios = /iPad|iPhone|iPod/.test(ua);
  const android = /Android/i.test(ua);
  const installee = () =>
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    navigator.standalone === true;

  const lienPage = () => location.origin + location.pathname + location.search;
  const lienChrome = () =>
    "intent://" + location.host + location.pathname + location.search +
    "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
    encodeURIComponent(lienPage()) + ";end";

  const style = document.createElement("style");
  style.textContent =
    "#bi-voile{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.6)}" +
    "#bi-voile.ouvert{display:flex}" +
    "#bi-carte{width:min(100%,420px);max-height:88vh;overflow:auto;padding:20px;border-radius:18px;background:var(--carte,#111a2b);color:var(--encre,#f4f0e8);border:1px solid var(--trait,rgba(190,158,255,.3));box-shadow:0 18px 50px rgba(0,0,0,.5)}" +
    "#bi-carte h3{font-size:1.2rem;margin-bottom:10px}" +
    "#bi-carte p,#bi-carte li{font-size:.93rem;line-height:1.55;margin-bottom:8px;color:var(--encre,#f4f0e8)}" +
    "#bi-carte ol{padding-left:20px;margin:6px 0 10px}" +
    "#bi-carte .bi-btns{display:grid;gap:9px;margin-top:14px}";
  document.head.appendChild(style);

  const voile = document.createElement("div");
  voile.id = "bi-voile";
  const carte = document.createElement("div");
  carte.id = "bi-carte";
  carte.setAttribute("role", "dialog");
  carte.setAttribute("aria-modal", "true");
  carte.setAttribute("aria-labelledby", "bi-titre");
  voile.appendChild(carte);
  document.body.appendChild(voile);

  const fermer = () => voile.classList.remove("ouvert");

  voile.addEventListener("click", e => {
    if (e.target === voile || e.target.closest("[data-bi-fermer]")) { fermer(); return; }
    const copier = e.target.closest("[data-bi-copier]");
    if (copier) {
      const lien = lienPage();
      (navigator.clipboard
        ? navigator.clipboard.writeText(lien).then(() => { copier.textContent = "Lien copié ✓"; })
        : Promise.reject()
      ).catch(() => window.prompt("Copie le lien :", lien));
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") fermer(); });

  const boutonFermer = '<button class="btn sec" type="button" data-bi-fermer>Fermer</button>';

  const contenu = () => {
    if (installee()) {
      return `<h3 id="bi-titre" class="serif">Déjà installée ✓</h3>
        <p>Benoli Littéraire est déjà installée sur cet appareil. Ouvre-la depuis son icône sur ton écran d'accueil.</p>
        <div class="bi-btns">${boutonFermer}</div>`;
    }
    if (ios) {
      return `<h3 id="bi-titre" class="serif">Installer sur iPhone / iPad</h3>
        <ol>
          <li>Ouvre cette page dans <b>Safari</b>.</li>
          <li>Touche le bouton <b>Partager</b> (le carré avec une flèche vers le haut).</li>
          <li>Fais défiler et touche <b>« Sur l'écran d'accueil »</b>, puis <b>Ajouter</b>.</li>
        </ol>
        <div class="bi-btns">
          <button class="btn sec" type="button" data-bi-copier>Copier le lien</button>
          ${boutonFermer}
        </div>`;
    }
    if (android) {
      return `<h3 id="bi-titre" class="serif">Installer Benoli Littéraire</h3>
        <p>L'installation en un clic n'est pas disponible dans ce navigateur. C'est fréquent quand le lien est ouvert depuis WhatsApp, Facebook ou une autre application.</p>
        <ol>
          <li>Touche <b>« Ouvrir dans Chrome »</b> ci-dessous.</li>
          <li>Attends quelques secondes que la page se charge.</li>
          <li>Rouvre le menu et touche de nouveau <b>« Installer Benoli Littéraire »</b> : la fenêtre d'installation de ton téléphone s'ouvre.</li>
        </ol>
        <p>Si rien ne s'affiche, dans Chrome touche <b>⋮</b> puis <b>« Installer l'application »</b>. Si tu l'as déjà installée, ouvre-la depuis ton écran d'accueil.</p>
        <div class="bi-btns">
          <a class="btn" href="${lienChrome()}">Ouvrir dans Chrome</a>
          <button class="btn sec" type="button" data-bi-copier>Copier le lien</button>
          ${boutonFermer}
        </div>`;
    }
    return `<h3 id="bi-titre" class="serif">Installer Benoli Littéraire</h3>
      <p>Dans la barre d'adresse de ton navigateur, clique sur l'icône d'installation, ou ouvre le menu du navigateur et choisis « Installer l'application ».</p>
      <div class="bi-btns">${boutonFermer}</div>`;
  };

  const afficher = () => {
    carte.innerHTML = contenu();
    voile.classList.add("ouvert");
  };

  /* extras.js affiche un message générique quand le navigateur ne propose pas l'installation :
     on le remplace par l'aide ci-dessus. Les autres messages passent normalement. */
  const alerteOrigine = window.alert.bind(window);
  window.alert = function (message) {
    if (typeof message === "string" && message.indexOf("Pour installer Benoli") === 0) {
      afficher();
      return;
    }
    return alerteOrigine(message);
  };
})();
