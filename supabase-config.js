/* BENOLI — Configuration Supabase (une seule source pour toute l'application).
   - Le nouveau projet Supabase remplace l'ancien : profil.js et communaute.js continuent de fonctionner sans modification.
   - Le numéro WhatsApp n'est jamais envoyé dans la table publique reader_profiles (elle n'a pas de colonne pour ça ;
     le numéro reste dans la table privée reader_private_profiles).
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
        }
        return q;
      };
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
})();
