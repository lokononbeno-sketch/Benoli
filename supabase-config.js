/* BENOLI — Configuration Supabase (une seule source pour toute l'application).
   - Le projet Supabase actuel remplace l'ancien : si un fichier appelle encore l'ancien projet, il est redirigé.
   - Le numéro WhatsApp n'est jamais envoyé dans la table publique reader_profiles (il reste dans reader_private_profiles).
   - La recherche d'un pseudonyme est exacte (les caractères _ et % ne sont plus des jokers).
   - Le lien « mot de passe oublié » mène à la page d'accueil, où recuperation.js affiche le formulaire de nouveau mot de passe.
   Ce fichier est chargé avant les autres : il surveille l'arrivée de la bibliothèque Supabase. */
(function () {
  "use strict";
  if (window.__benoliSupabaseConfig) return;
  window.__benoliSupabaseConfig = true;

  const ANCIEN = "vkklycmarmixcxgasyeg";
  const URL_NOUVEAU = "https://fjeqhqlmjagrknupgvyu.supabase.co";
  const CLE_NOUVELLE = "sb_publishable_gisDyt1z22eLMUwmK2Dvxg_azkS7Pte";

  const sansTelephone = v => {
    const net = o => {
      if (o && typeof o === "object" && !Array.isArray(o) && "phone" in o) {
        const copie = Object.assign({}, o);
        delete copie.phone;
        return copie;
      }
      return o;
    };
    return Array.isArray(v) ? v.map(net) : net(v);
  };
  const motifExact = s => String(s).replace(/[\\%_]/g, "\\$&");

  const durcir = client => {
    try {
      if (!client || client.__benoliCfg) return client;

      const depart = client.from.bind(client);
      client.from = function (table) {
        const q = depart(table);
        if (table === "reader_profiles") {
          ["insert", "upsert", "update"].forEach(m => {
            if (typeof q[m] !== "function") return;
            const f = q[m].bind(q);
            q[m] = function (valeurs, options) { return f(sansTelephone(valeurs), options); };
          });
          if (typeof q.select === "function") {
            const sel = q.select.bind(q);
            q.select = function () {
              const b = sel.apply(null, arguments);
              if (b && typeof b.ilike === "function") {
                const il = b.ilike.bind(b);
                b.ilike = function (colonne, valeur) {
                  const reste = Array.prototype.slice.call(arguments, 2);
                  return il.apply(null, [colonne, colonne === "pseudonym" ? motifExact(valeur) : valeur].concat(reste));
                };
              }
              return b;
            };
          }
        }
        return q;
      };

      if (client.auth && typeof client.auth.resetPasswordForEmail === "function") {
        const reset = client.auth.resetPasswordForEmail.bind(client.auth);
        client.auth.resetPasswordForEmail = function (email, options) {
          return reset(email, Object.assign({}, options, { redirectTo: location.origin + location.pathname }));
        };
      }

      client.__benoliCfg = true;
    } catch (_) {}
    return client;
  };

  const envelopper = lib => {
    try {
      if (!lib || lib.__benoliCfg || typeof lib.createClient !== "function") return lib;
      const original = lib.createClient;
      lib.createClient = function (url, cle, options) {
        const ancien = typeof url === "string" && url.indexOf(ANCIEN) >= 0;
        return durcir(original.call(this, ancien ? URL_NOUVEAU : url, ancien ? CLE_NOUVELLE : cle, options));
      };
      lib.__benoliCfg = true;
    } catch (_) {}
    return lib;
  };

  let lib = window.supabase;
  try {
    Object.defineProperty(window, "supabase", {
      configurable: true,
      enumerable: true,
      get() { return lib; },
      set(v) { lib = envelopper(v); }
    });
    if (lib) lib = envelopper(lib);
  } catch (_) {
    envelopper(window.supabase);
  }

  /* Arrivée depuis le lien « mot de passe oublié » (ou lien expiré) : affichage du formulaire */
  try {
    if (/(?:^#|&)(?:type=recovery|error_code=)/.test(location.hash || "")) {
      const s = document.createElement("script");
      s.src = "recuperation.js";
      (document.head || document.documentElement).appendChild(s);
    }
  } catch (_) {}
})();
