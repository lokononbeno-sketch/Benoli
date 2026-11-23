/* BENOLI — Bannière de mise à jour.
   - Site web : le fichier version.json indique la version en cours. Si elle change, un message
     prévient le lecteur des nouveautés (les fichiers du site sont déjà à jour).
   - Application Android (APK) : elle s'installe à part. Si son adresse de départ contient ?apk=1.0.0
     et que version.json annonce une version plus récente, la bannière propose « Installer ».
   Sans connexion, rien ne s'affiche. */
(function () {
  "use strict";
  if (window.__benoliMaj) return;
  window.__benoliMaj = true;

  const CLE = "benoli-version-vue";
  const cmp = (a, b) => {
    const x = String(a || "0").split(".").map(Number), y = String(b || "0").split(".").map(Number);
    for (let i = 0; i < 3; i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; }
    return 0;
  };

  const style = document.createElement("style");
  style.textContent =
    "#bm-maj{position:fixed;left:12px;right:12px;bottom:calc(92px + env(safe-area-inset-bottom));z-index:200;display:none;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;background:#2a1450;color:#f4ecff;border:1px solid #f2c15c;box-shadow:0 10px 26px rgba(0,0,0,.45);font:600 14px/1.35 system-ui,sans-serif}" +
    "#bm-maj.on{display:flex}" +
    "#bm-maj p{margin:0;flex:1}" +
    "#bm-maj button{border:0;border-radius:999px;padding:9px 14px;font:800 13px system-ui,sans-serif;background:linear-gradient(120deg,#f2c15c,#e59a3a);color:#2a1606;cursor:pointer;white-space:nowrap}" +
    "#bm-maj .bm-non{background:transparent;color:#ffd98a;border:1px solid #5a4480}";
  document.head.appendChild(style);

  const banniere = document.createElement("div");
  banniere.id = "bm-maj";
  banniere.setAttribute("role", "status");
  document.body.appendChild(banniere);

  const afficher = (texte, action, lien) => {
    banniere.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = texte;
    banniere.appendChild(p);
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = action;
    b.addEventListener("click", () => {
      if (lien) window.open(lien, "_blank", "noopener");
      banniere.classList.remove("on");
    });
    banniere.appendChild(b);
    if (lien) {
      const non = document.createElement("button");
      non.type = "button";
      non.className = "bm-non";
      non.textContent = "Plus tard";
      non.addEventListener("click", () => banniere.classList.remove("on"));
      banniere.appendChild(non);
    }
    banniere.classList.add("on");
  };

  async function verifier() {
    let v;
    try {
      const r = await fetch("version.json?t=" + Date.now(), { cache: "no-store" });
      if (!r.ok) return;
      v = await r.json();
    } catch (_) { return; }
    if (!v || !v.version) return;

    const apkInstallee = new URLSearchParams(location.search).get("apk");
    if (apkInstallee && v.apkVersion && v.apkUrl && cmp(v.apkVersion, apkInstallee) > 0) {
      afficher("Une nouvelle version de Benoli Littéraire est disponible (v" + v.apkVersion + ").", "Installer", v.apkUrl);
      return;
    }

    let vue = null;
    try { vue = localStorage.getItem(CLE); } catch (_) { return; }
    if (!vue) { try { localStorage.setItem(CLE, v.version); } catch (_) {} return; }
    if (cmp(v.version, vue) > 0) {
      afficher("Benoli Littéraire a été mise à jour (v" + v.version + ") : tu as les nouveautés.", "OK");
      try { localStorage.setItem(CLE, v.version); } catch (_) {}
    }
  }

  setTimeout(verifier, 2500);
})();
