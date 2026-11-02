/* Compte lecteur Benoli — authentification et profil privé Supabase */
(function () {
  "use strict";
  if (window.__benoliProfilReady) return;
  window.__benoliProfilReady = true;

  const SUPABASE_URL = "https://vkklycmarmixcxgasyeg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_6qCf1CHlpHhx33l_1QJhwA_w2RSLMbH";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let client = null, loading = null, busy = false, renderSeq = 0;

  const status = (message, kind = "info") => {
    const el = document.getElementById("bp-status");
    if (el) { el.className = "bp-status " + kind; el.textContent = message; }
  };
  const mode = () => {
    try { return new URLSearchParams(location.hash.split("?")[1] || "").get("mode") === "signup" ? "signup" : "login"; }
    catch (_) { return "login"; }
  };
  const loadClient = () => {
    if (client) return Promise.resolve(client);
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const ready = () => {
        try {
          if (!window.supabase?.createClient) throw new Error("La bibliothèque de connexion n'est pas disponible.");
          client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
          });
          resolve(client);
        } catch (e) { reject(e); }
      };
      if (window.supabase?.createClient) return ready();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.min.js";
      script.onload = ready;
      script.onerror = () => reject(new Error("Connexion au service impossible. Vérifie ta connexion Internet."));
      document.head.appendChild(script);
    }).catch(e => { loading = null; throw e; });
    return loading;
  };
  const applyTheme = gender => {
    const g = gender === "masculin" ? "masculin" : gender === "feminin" ? "feminin" : "";
    if (g) {
      document.documentElement.dataset.benoliTheme = g;
      try { localStorage.setItem("benoli-theme", g); } catch (_) {}
    } else {
      delete document.documentElement.dataset.benoliTheme;
      try { localStorage.removeItem("benoli-theme"); } catch (_) {}
    }
  };

  const styles = document.createElement("style");
  styles.textContent = `
    .bp{padding:8px 0 30px;max-width:560px;margin:auto}
    .bp h2{font-size:1.8rem;margin-bottom:10px}
    .bp>p{color:var(--doux);margin:10px 0}
    .bp form{display:grid;gap:13px;margin-top:16px}
    .bp form label{display:grid;gap:6px;font-weight:650;font-size:.93rem}
    .bp input,.bp select,.bp textarea{width:100%;padding:12px;border:1px solid var(--trait);border-radius:10px;background:var(--carte);color:var(--encre);font:inherit}
    .bp input[type=file]{padding:9px;font-size:.84rem}
    .bp-switch{display:flex;gap:8px;margin:18px 0}
    .bp-switch a{flex:1;text-align:center;padding:10px;border:1px solid var(--trait);border-radius:999px;text-decoration:none;font-weight:750}
    .bp-switch a[aria-current=page]{background:linear-gradient(120deg,#ffd56b,#ff941d);color:#21142b;border-color:#ffe1a0}
    .bp-status{padding:12px;margin:14px 0;border-radius:10px;background:rgba(150,150,180,.12);font-size:.9rem}
    .bp-status.error{background:rgba(190,60,60,.12);color:#e58c8c}
    .bp-status.success{background:rgba(40,150,90,.13);color:#24834e}
    .bp-note{font-size:.84rem;color:var(--doux)}
    .bp-reset{margin-top:12px;border:0;background:none;color:var(--vert);text-decoration:underline;font:inherit;cursor:pointer}
    .bp-links{display:grid;gap:10px;margin:18px 0}
    .bp-links a{padding:13px;border:1px solid var(--trait);border-radius:10px;text-decoration:none;color:var(--vert);font-weight:700}
    .bp-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .bp-grid label{min-width:0}
    .bp-avatar{width:92px;height:92px;border-radius:50%;object-fit:cover;border:3px solid var(--or);display:block;margin:8px 0}
    .bp-profile-card{padding:16px;border:1px solid var(--trait);border-radius:14px;background:var(--carte)}
    .bp-profile-card p{margin:7px 0;overflow-wrap:anywhere}
    .bp-section-title{margin:18px 0 4px;font-weight:800;color:var(--vert)}
    @media(max-width:420px){.bp-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(styles);

  const switchHtml = () => '<div class="bp-switch"><a href="#/profil?mode=login" ' +
    (mode() === "login" ? 'aria-current="page"' : '') + '>Connexion</a><a href="#/profil?mode=signup" ' +
    (mode() === "signup" ? 'aria-current="page"' : '') + '>Inscription</a></div>';

  const authHtml = () => {
    const signup = mode() === "signup";
    return '<section class="bp"><h2 class="serif">' + (signup ? "Créer mon compte lecteur" : "Connexion à mon compte") +
      '</h2><p>' + (signup ? "Rejoins la communauté Benoli et crée ton espace personnel." : "Retrouve ton espace lecteur.") +
      '</p>' + switchHtml() + '<form id="bp-form" novalidate>' +
      (signup ? `
        <p class="bp-section-title">Identité du lecteur</p>
        <div class="bp-grid">
          <label>Nom *<input id="bp-last" maxlength="80" autocomplete="family-name" required placeholder="Ton nom"></label>
          <label>Prénom *<input id="bp-first" maxlength="80" autocomplete="given-name" required placeholder="Ton prénom"></label>
        </div>
        <label>Pseudonyme public *<input id="bp-name" maxlength="40" minlength="2" autocomplete="nickname" required placeholder="Le nom affiché dans la communauté"></label>
        <label>Genre de présentation *<select id="bp-gender" required><option value="">Choisir…</option><option value="masculin">Masculin — Style Bleu élégant 💙</option><option value="feminin">Féminin — Style Rose élégance 💗</option></select></label>
        <p class="bp-section-title">Sécurité et contact</p>
        <label>Adresse e-mail *<input id="bp-email" type="email" autocomplete="email" required placeholder="exemple@email.com"></label>
        <label>Mot de passe *<input id="bp-password" type="password" minlength="8" autocomplete="new-password" required placeholder="8 caractères minimum"></label>
        <label>Téléphone / WhatsApp *<input id="bp-phone" type="tel" autocomplete="tel" maxlength="30" required placeholder="+229 …"></label>
        <p class="bp-section-title">Mon profil (facultatif)</p>
        <label>Photo de profil<input id="bp-avatar" type="file" accept="image/jpeg,image/png,image/webp"><small class="bp-note">JPG, PNG ou WebP — 5 Mo maximum. Tu peux choisir une photo que tu es autorisé à utiliser.</small></label>
        <label>Lien de ton compte Facebook<input id="bp-facebook" type="url" maxlength="500" placeholder="https://facebook.com/…"></label>
        <label>Lieu de résidence<input id="bp-residence" maxlength="160" autocomplete="address-level2" placeholder="Ville, quartier, pays"></label>
      ` : `
        <label>Adresse e-mail *<input id="bp-email" type="email" autocomplete="email" required placeholder="exemple@email.com"></label>
        <label>Mot de passe *<input id="bp-password" type="password" autocomplete="current-password" required placeholder="Ton mot de passe"></label>
      `) +
      '<button class="btn" type="submit">' + (signup ? "Créer mon compte" : "Me connecter") +
      '</button></form>' + (!signup ? '<button class="bp-reset" id="bp-reset" type="button">Mot de passe oublié ? Recevoir un lien par e-mail</button>' : '') +
      '<p id="bp-status" class="bp-status" role="status" aria-live="polite">Connexion sécurisée par Benoli.</p>' +
      '<p class="bp-note">Ton mot de passe reste secret. Les informations personnelles de ton profil ne sont pas publiées automatiquement.</p></section>';
  };

  const page = () => '<section class="bp"><p id="bp-status" class="bp-status" role="status" aria-live="polite">Chargement de ton espace lecteur…</p></section>';

  const savePrivateProfile = async (sb, user, values, file) => {
    const row = {
      id: user.id,
      first_name: values.first_name || null,
      last_name: values.last_name || null,
      whatsapp: values.whatsapp || null,
      facebook_url: values.facebook_url || null,
      residence: values.residence || null,
      avatar_path: values.avatar_path || null,
      updated_at: new Date().toISOString()
    };
    if (file) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
        throw new Error("Choisis une image JPG, PNG ou WebP de 5 Mo maximum.");
      }
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = user.id + "/avatar-" + Date.now() + "." + ext;
      const { error: uploadError } = await sb.storage.from("reader-avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      row.avatar_path = path;
    }
    const { error } = await sb.from("reader_private_profiles").upsert(row, { onConflict: "id" });
    if (error) throw error;
  };

  const render = async () => {
    const seq = ++renderSeq;
    const target = document.querySelector("#ficheContenu .page");
    if (!target) return;
    target.innerHTML = '<section class="bp"><p id="bp-status" class="bp-status">Chargement de ton espace lecteur…</p></section>';
    try {
      const sb = await loadClient();
      const { data: { session }, error } = await sb.auth.getSession();
      if (error) throw error;
      if (seq !== renderSeq || !document.querySelector("#ficheContenu .page")) return;
      if (!session) { target.innerHTML = authHtml(); return; }
      const user = session.user;
      const [{ data: pub, error: pubError }, { data: priv, error: privError }] = await Promise.all([
        sb.from("reader_profiles").select("pseudonym,gender").eq("id", user.id).maybeSingle(),
        sb.from("reader_private_profiles").select("first_name,last_name,whatsapp,facebook_url,residence,avatar_path").eq("id", user.id).maybeSingle()
      ]);
      if (pubError) throw pubError;
      if (privError) throw privError;
      if (seq !== renderSeq) return;
      const avatar = priv?.avatar_path ? await sb.storage.from("reader-avatars").createSignedUrl(priv.avatar_path, 3600) : null;
      const avatarUrl = avatar?.data?.signedUrl || "";
      applyTheme(pub?.gender || user.user_metadata?.gender);
      target.innerHTML = '<section class="bp"><h2 class="serif">Bienvenue, ' +
        esc(pub?.pseudonym || user.user_metadata?.pseudonym || "lecteur") + ' !</h2>' +
        '<div class="bp-profile-card">' + (avatarUrl ? '<img class="bp-avatar" src="' + esc(avatarUrl) + '" alt="Photo de profil">' : '') +
        '<p><b>Nom :</b> ' + esc(priv?.last_name || "Non renseigné") + '</p><p><b>Prénom :</b> ' + esc(priv?.first_name || "Non renseigné") +
        '</p><p><b>E-mail :</b> ' + esc(user.email || "—") + '</p><p><b>Téléphone / WhatsApp :</b> ' + esc(priv?.whatsapp || "Non renseigné") +
        '</p><p><b>Facebook :</b> ' + (priv?.facebook_url ? '<a href="' + esc(priv.facebook_url) + '" target="_blank" rel="noopener">Ouvrir le profil</a>' : "Non renseigné") +
        '</p><p><b>Résidence :</b> ' + esc(priv?.residence || "Non renseigné") + '</p></div>' +
        '<div class="bp-links"><a href="#/favoris">❤️ Mes favoris</a><a href="#/carnet">📔 Mon carnet de lecture</a></div>' +
        '<h3 class="bp-section-title">Modifier mon profil</h3><form id="bp-edit-form">' +
        '<div class="bp-grid"><label>Nom<input id="bp-edit-last" maxlength="80" value="' + esc(priv?.last_name || "") + '"></label>' +
        '<label>Prénom<input id="bp-edit-first" maxlength="80" value="' + esc(priv?.first_name || "") + '"></label></div>' +
        '<label>Pseudonyme public<input id="bp-edit-name" maxlength="40" minlength="2" required value="' + esc(pub?.pseudonym || "") + '"></label>' +
        '<label>Téléphone / WhatsApp<input id="bp-edit-phone" maxlength="30" value="' + esc(priv?.whatsapp || "") + '"></label>' +
        '<label>Facebook<input id="bp-edit-facebook" type="url" maxlength="500" value="' + esc(priv?.facebook_url || "") + '" placeholder="https://facebook.com/…"></label>' +
        '<label>Lieu de résidence<input id="bp-edit-residence" maxlength="160" value="' + esc(priv?.residence || "") + '"></label>' +
        '<label>Photo de profil<input id="bp-edit-avatar" type="file" accept="image/jpeg,image/png,image/webp"><small class="bp-note">JPG, PNG ou WebP — 5 Mo maximum.</small></label>' +
        '<button class="btn" type="submit">Enregistrer mes modifications</button></form>' +
        '<p id="bp-edit-status" class="bp-status" role="status" aria-live="polite"></p>' +
        '<button class="btn off" id="bp-logout" type="button">Se déconnecter</button></section>';
    } catch (e) {
      if (seq !== renderSeq) return;
      const el = document.getElementById("bp-status");
      if (el) { el.className = "bp-status error"; el.textContent = "Impossible de charger ton espace : " + (e.message || "erreur inconnue") + ". Réessaie dans un instant."; }
    }
  };

  if (typeof PAGES !== "undefined") PAGES.profil = page;
  try {
    const saved = localStorage.getItem("benoli-theme");
    if (saved === "masculin" || saved === "feminin") applyTheme(saved);
  } catch (_) {}

  const onHashChange = () => { if (/^#\/profil(?:\?|$)/.test(location.hash)) render(); };
  window.addEventListener("hashchange", onHashChange);

  document.addEventListener("submit", async e => {
    if (e.target.id === "bp-edit-form") {
      e.preventDefault();
      if (busy) return;
      busy = true;
      const button = e.target.querySelector('button[type="submit"]');
      if (button) { button.disabled = true; button.textContent = "Enregistrement…"; }
      try {
        const sb = await loadClient();
        const { data: { user }, error: userError } = await sb.auth.getUser();
        if (userError || !user) throw userError || new Error("Reconnecte-toi pour modifier ton profil.");
        const values = {
          first_name: document.getElementById("bp-edit-first").value.trim(),
          last_name: document.getElementById("bp-edit-last").value.trim(),
          pseudonym: document.getElementById("bp-edit-name").value.trim(),
          whatsapp: document.getElementById("bp-edit-phone").value.trim(),
          facebook_url: document.getElementById("bp-edit-facebook").value.trim(),
          residence: document.getElementById("bp-edit-residence").value.trim()
        };
        if (values.pseudonym.length < 2) throw new Error("Le pseudonyme doit contenir au moins 2 caractères.");
        if (values.facebook_url && !/^https?:\/\//i.test(values.facebook_url)) throw new Error("Le lien Facebook doit commencer par https://");
        const file = document.getElementById("bp-edit-avatar").files[0] || null;
        const { data: old } = await sb.from("reader_private_profiles").select("avatar_path").eq("id", user.id).maybeSingle();
        values.avatar_path = old?.avatar_path || null;
        const { data: pub } = await sb.from("reader_profiles").select("gender").eq("id", user.id).maybeSingle();
        const { error: publicError } = await sb.from("reader_profiles").upsert({
          id: user.id, pseudonym: values.pseudonym, phone: values.whatsapp || null, gender: pub?.gender || user.user_metadata?.gender || null
        }, { onConflict: "id" });
        if (publicError) throw publicError;
        await savePrivateProfile(sb, user, values, file);
        status("Profil mis à jour avec succès.", "success");
        await render();
      } catch (err) {
        const el = document.getElementById("bp-edit-status");
        if (el) { el.className = "bp-status error"; el.textContent = err.message || "Enregistrement impossible."; }
      } finally {
        busy = false;
        const b = document.querySelector('#bp-edit-form button[type="submit"]');
        if (b) { b.disabled = false; b.textContent = "Enregistrer mes modifications"; }
      }
      return;
    }
    if (e.target.id !== "bp-form") return;
    e.preventDefault();
    if (busy) return;
    busy = true;
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "Patiente…"; }
    try {
      const sb = await loadClient();
      const email = document.getElementById("bp-email").value.trim();
      const password = document.getElementById("bp-password").value;
      if (mode() === "signup") {
        const values = {
          first_name: document.getElementById("bp-first").value.trim(),
          last_name: document.getElementById("bp-last").value.trim(),
          pseudonym: document.getElementById("bp-name").value.trim(),
          gender: document.getElementById("bp-gender").value,
          whatsapp: document.getElementById("bp-phone").value.trim(),
          facebook_url: document.getElementById("bp-facebook").value.trim(),
          residence: document.getElementById("bp-residence").value.trim()
        };
        const file = document.getElementById("bp-avatar").files[0] || null;
        if (!values.first_name || !values.last_name) throw new Error("Renseigne ton nom et ton prénom.");
        if (values.pseudonym.length < 2) throw new Error("Le pseudonyme doit contenir au moins 2 caractères.");
        if (!["masculin", "feminin"].includes(values.gender)) throw new Error("Choisis ton style de présentation.");
        if (!values.whatsapp) throw new Error("Renseigne ton numéro de téléphone ou WhatsApp.");
        if (values.facebook_url && !/^https?:\/\//i.test(values.facebook_url)) throw new Error("Le lien Facebook doit commencer par https://");
        const { data, error } = await sb.auth.signUp({
          email, password,
          options: { data: {
            pseudonym: values.pseudonym, gender: values.gender, phone: values.whatsapp,
            first_name: values.first_name, last_name: values.last_name,
            whatsapp: values.whatsapp, facebook_url: values.facebook_url, residence: values.residence
          } }
        });
        if (error) throw error;
        if (data.session && data.user) {
          const { error: pubError } = await sb.from("reader_profiles").upsert({
            id: data.user.id, pseudonym: values.pseudonym, phone: values.whatsapp, gender: values.gender
          }, { onConflict: "id" });
          if (pubError) throw pubError;
          await savePrivateProfile(sb, data.user, values, file);
          status("Ton compte et ton profil ont été créés !", "success");
          await render();
        } else {
          status("Compte créé ! Consulte ta boîte e-mail pour confirmer ton adresse. Après confirmation, connecte-toi pour finaliser l'enregistrement de ta photo si tu en as choisi une.", "success");
        }
      } else {
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const meta = data.user.user_metadata || {};
        const pseudonym = meta.pseudonym || data.user.email.split("@")[0];
        const gender = meta.gender || null;
        const { error: pubError } = await sb.from("reader_profiles").upsert({
          id: data.user.id, pseudonym, phone: meta.phone || null, gender
        }, { onConflict: "id" });
        if (pubError) throw pubError;
        const { data: existing } = await sb.from("reader_private_profiles").select("id").eq("id", data.user.id).maybeSingle();
        if (!existing && (meta.first_name || meta.last_name || meta.whatsapp || meta.facebook_url || meta.residence)) {
          await savePrivateProfile(sb, data.user, {
            first_name: meta.first_name, last_name: meta.last_name, whatsapp: meta.whatsapp,
            facebook_url: meta.facebook_url, residence: meta.residence, avatar_path: null
          }, null);
        }
        await render();
      }
    } catch (err) {
      status(err.message || "Une erreur est survenue.", "error");
      if (btn) { btn.disabled = false; btn.textContent = mode() === "signup" ? "Créer mon compte" : "Me connecter"; }
    } finally { busy = false; }
  });

  document.addEventListener("click", async e => {
    if (e.target.closest("#bp-logout")) {
      try { const sb = await loadClient(); const { error } = await sb.auth.signOut(); if (error) throw error; location.hash = "#/profil?mode=login"; }
      catch (err) { status(err.message || "Déconnexion impossible.", "error"); }
    }
    if (e.target.closest("#bp-reset")) {
      const email = document.getElementById("bp-email")?.value.trim();
      if (!email) { status("Saisis d'abord ton adresse e-mail.", "error"); return; }
      try {
        const sb = await loadClient();
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname + "#/profil?mode=login" });
        if (error) throw error;
        status("Si cette adresse correspond à un compte, un e-mail de récupération sera envoyé.", "success");
      } catch (err) { status(err.message || "Envoi impossible.", "error"); }
    }
  });

  const menu = document.getElementById("benoliMenu");
  if (menu && !menu.querySelector('[href="#/profil"]')) {
    const a = document.createElement("a");
    a.className = "bm-lien"; a.href = "#/profil"; a.textContent = "👤 Mon profil lecteur";
    const foot = menu.querySelector(".bm-bas");
    if (foot) menu.insertBefore(a, foot); else menu.appendChild(a);
  }
})();