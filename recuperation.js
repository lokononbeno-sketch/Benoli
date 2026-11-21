/* BENOLI — Récupération du mot de passe.
   Affiche le formulaire « nouveau mot de passe » quand le lecteur arrive depuis le lien reçu par e-mail
   (ou un message clair si le lien a expiré). Ne fait rien dans les autres cas. */
(function () {
  "use strict";
  if (window.__benoliRecuperation) return;
  window.__benoliRecuperation = true;

  const hash = location.hash || "";
  const recuperation = /(?:^#|&)type=recovery(?:&|$)/.test(hash) && /access_token=/.test(hash);
  const expire = !recuperation && /(?:^#|&)error=/.test(hash) && /(?:^#|&)error_code=/.test(hash);
  if (!recuperation && !expire) return;

  const SUPABASE_URL = "https://fjeqhqlmjagrknupgvyu.supabase.co";
  const SUPABASE_KEY = "sb_publishable_gisDyt1z22eLMUwmK2Dvxg_azkS7Pte";

  const style = document.createElement("style");
  style.textContent =
    "#br-voile{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.65)}" +
    "#br-carte{width:min(100%,420px);max-height:90vh;overflow:auto;padding:22px;border-radius:18px;background:var(--carte,#111a2b);color:var(--encre,#f4f0e8);border:1px solid var(--trait,rgba(190,158,255,.3));box-shadow:0 18px 50px rgba(0,0,0,.5)}" +
    "#br-carte h3{font-size:1.25rem;margin:0 0 10px}" +
    "#br-carte p{margin:8px 0;line-height:1.5;color:var(--doux,#c3bfd3)}" +
    "#br-carte form{display:grid;gap:12px;margin-top:12px}" +
    "#br-carte label{display:grid;gap:6px;font-weight:650;font-size:.93rem}" +
    "#br-carte input{width:100%;padding:12px;border:1px solid var(--trait,#48516a);border-radius:10px;background:var(--papier,#0b1222);color:var(--encre,#fff);font:inherit}" +
    "#br-carte button{padding:13px;border:0;border-radius:11px;background:var(--vert,#b89aff);color:var(--sur-vert,#171126);font:inherit;font-weight:800;cursor:pointer}" +
    "#br-carte button:disabled{opacity:.6}" +
    "#br-msg{min-height:1.3em;font-size:.9rem}";
  document.head.appendChild(style);

  const voile = document.createElement("div");
  voile.id = "br-voile";
  const carte = document.createElement("div");
  carte.id = "br-carte";
  carte.setAttribute("role", "dialog");
  carte.setAttribute("aria-modal", "true");
  carte.setAttribute("aria-labelledby", "br-titre");
  voile.appendChild(carte);
  document.body.appendChild(voile);

  const afficher = html => { carte.innerHTML = html; };
  const fermer = () => { voile.remove(); };
  const nettoyerAdresse = () => {
    try { history.replaceState(null, "", location.pathname + location.search); } catch (_) {}
  };
  const traduire = m => {
    const t = String(m || "");
    if (/different from the old password/i.test(t)) return "Choisis un mot de passe différent de l'ancien.";
    if (/at least/i.test(t) || /weak/i.test(t)) return "Mot de passe trop faible : choisis-en un plus long ou plus varié.";
    return t || "Enregistrement impossible. Réessaie.";
  };

  const lienExpire = () => {
    nettoyerAdresse();
    afficher('<h3 id="br-titre">Lien expiré</h3>' +
      "<p>Ce lien de récupération n'est plus valable : il ne fonctionne qu'une seule fois et pendant peu de temps.</p>" +
      "<p>Demande-en un nouveau : page Connexion, puis « Mot de passe oublié ».</p>" +
      '<form><button type="button" id="br-fermer">Fermer</button></form>');
    document.getElementById("br-fermer").addEventListener("click", () => { fermer(); location.hash = "#/profil?mode=login"; });
  };

  if (expire) { lienExpire(); return; }

  const charger = () => new Promise((resolve, reject) => {
    if (window.supabase && window.supabase.createClient) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.min.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Connexion au service impossible. Vérifie ta connexion Internet."));
    document.head.appendChild(s);
  });

  const formulaire = client => {
    afficher('<h3 id="br-titre">Nouveau mot de passe</h3>' +
      "<p>Choisis ton nouveau mot de passe (8 caractères minimum).</p>" +
      '<form id="br-form" novalidate>' +
      '<label>Nouveau mot de passe<input id="br-p1" type="password" autocomplete="new-password" minlength="8" required></label>' +
      '<label>Confirme-le<input id="br-p2" type="password" autocomplete="new-password" minlength="8" required></label>' +
      '<p id="br-msg" role="status" aria-live="polite"></p>' +
      '<button type="submit" id="br-ok">Enregistrer</button></form>');
    document.getElementById("br-form").addEventListener("submit", async e => {
      e.preventDefault();
      const p1 = document.getElementById("br-p1").value;
      const p2 = document.getElementById("br-p2").value;
      const msg = document.getElementById("br-msg");
      const ok = document.getElementById("br-ok");
      if (p1.length < 8) { msg.textContent = "Le mot de passe doit contenir au moins 8 caractères."; return; }
      if (p1 !== p2) { msg.textContent = "Les deux mots de passe ne sont pas identiques."; return; }
      ok.disabled = true;
      msg.textContent = "Enregistrement…";
      try {
        const { error } = await client.auth.updateUser({ password: p1 });
        if (error) throw error;
        msg.textContent = "Mot de passe modifié ✓";
        setTimeout(() => { fermer(); location.hash = "#/profil"; }, 1200);
      } catch (err) {
        msg.textContent = traduire(err && err.message);
        ok.disabled = false;
      }
    });
  };

  (async () => {
    afficher('<h3 id="br-titre">Vérification du lien…</h3>');
    try {
      await charger();
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      const { data, error } = await client.auth.getSession();
      if (error || !data || !data.session) throw new Error("Lien non valable");
      nettoyerAdresse();
      formulaire(client);
    } catch (e) {
      lienExpire();
    }
  })();
})();
