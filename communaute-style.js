/* BENOLI — Mise en page « discussions » de la communauté.
   Habille l'écran existant (communaute.js) sans le réécrire :
   - en-tête prune et or, barre de navigation en bas, bouton « nouvelle discussion » ;
   - liste des discussions avec pastille ronde à l'initiale ;
   - bulles de conversation or (les tiennes) et violettes (celles des autres).
   Palette propre à Benoli : prune nuit, or et lilas. */
(function () {
  "use strict";
  if (window.__benoliCommunauteStyle) return;
  window.__benoliCommunauteStyle = true;

  const style = document.createElement("style");
  style.textContent =
    "#bl-communaute{background:#1a0e2c!important;color:#f4ecff}" +
    "#bl-communaute .bl-shell{max-width:none;padding:0 0 92px}" +
    "#bl-communaute .bl-head{position:sticky;top:0;z-index:5;margin:0;padding:14px 16px;background:linear-gradient(120deg,#3a1b6b,#6a2a86);border:0;border-radius:0;box-shadow:0 4px 14px rgba(0,0,0,.35)}" +
    "#bl-communaute .bl-head small{color:#ffd98a}" +
    "#bl-communaute h2{font-size:21px;color:#fff}" +
    "#bl-communaute .bl-mark{display:none}" +
    "#bl-communaute .bl-status{margin:10px 14px}" +
    "#bl-communaute .bl-view{padding:6px 10px}" +
    "#bl-communaute .bl-card,#bl-communaute .bl-panel{background:#261541;border:1px solid #3d2862;border-radius:14px}" +
    "#bl-communaute .bl-nav{position:fixed;left:0;right:0;bottom:0;z-index:6;margin:0;padding:6px 4px calc(6px + env(safe-area-inset-bottom));background:#20103a;border-top:1px solid #3d2862;display:flex;gap:2px}" +
    "#bl-communaute .bl-nav button{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 2px;border:0;border-radius:14px;background:transparent;color:#bfa9d9;font-size:11px;font-weight:650;line-height:1.1}" +
    "#bl-communaute .bl-nav button .bl-ico{font-size:19px;line-height:1.1}" +
    "#bl-communaute .bl-nav button.active{background:rgba(242,193,92,.16);color:#ffd98a;font-weight:800}" +
    "#bl-communaute .bl-tabs button.active,#bl-communaute button.active{background:linear-gradient(120deg,#f2c15c,#e59a3a);color:#2a1606;border-color:transparent}" +
    "#bl-communaute #bl-new-chat{display:flex;gap:8px;margin:10px 4px 6px}" +
    "#bl-communaute #bl-new-chat input{flex:1;padding:11px 16px;border-radius:999px;border:1px solid #3d2862;background:#261541;color:#f4ecff;font:inherit}" +
    "#bl-communaute #bl-new-chat button{border-radius:999px;padding:10px 14px;border:0;background:#3a2468;color:#ffd98a;font-weight:700}" +
    "#bl-communaute .bl-row{display:flex;align-items:center;gap:12px;padding:11px 8px;border-bottom:1px solid #2e1f4a;border-radius:0}" +
    "#bl-communaute .bl-row>button:first-of-type{flex:1;min-width:0;text-align:left;color:#f4ecff;font-weight:700;font-size:16px;background:none;border:0;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    "#bl-communaute .bl-row .bl-meta{color:#a895c4;font-size:12px;white-space:nowrap}" +
    "#bl-communaute .bl-av{flex:0 0 auto;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font:800 19px Georgia,serif;color:#2a1606;background:linear-gradient(135deg,#ffd98a,#e59a3a);box-shadow:0 0 0 2px #1a0e2c,0 0 0 4px #f2c15c}" +
    "#bl-communaute .bl-chat{background:radial-gradient(circle at 20% 10%,rgba(242,193,92,.06),transparent 40%),#150a24;border-color:#2e1f4a;height:52vh}" +
    "#bl-communaute .bl-bubble{background:#2e2050;color:#f4ecff;border-radius:16px 16px 16px 4px;box-shadow:0 1px 2px rgba(0,0,0,.3)}" +
    "#bl-communaute .bl-bubble.mine{background:linear-gradient(120deg,#f6d27a,#e8a04a);color:#2a1606;border-radius:16px 16px 4px 16px}" +
    "#bl-communaute .bl-bubble.mine .bl-meta{color:#5a3a14}" +
    "#bl-communaute .bl-send input{border-radius:999px;background:#261541;border:1px solid #3d2862;color:#f4ecff}" +
    "#bl-communaute .bl-send button{border-radius:999px;background:linear-gradient(120deg,#f2c15c,#e59a3a);color:#2a1606;border:0;font-weight:800;padding:10px 16px}" +
    "#bl-communaute .bl-fab{display:none;position:fixed;right:18px;bottom:84px;z-index:7;width:58px;height:58px;border-radius:50%;border:0;place-items:center;font-size:24px;color:#2a1606;background:linear-gradient(135deg,#ffd98a,#e59a3a);box-shadow:0 8px 20px rgba(0,0,0,.45);cursor:pointer}" +
    "#bl-communaute[data-tab=messages] .bl-fab{display:grid}" +
    "#bl-communaute .bl-fab:active{transform:scale(.95)}" +
    "@media(prefers-reduced-motion:no-preference){#bl-communaute .bl-bubble{animation:bl-entree .25s ease-out both}}" +
    "@keyframes bl-entree{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}";
  document.head.appendChild(style);

  const ICONES = { stories: "📖", messages: "💬", write: "✍️", friends: "👥", admin: "🛡️" };
  const initiale = t => (String(t || "").trim().charAt(0) || "?").toUpperCase();

  function habiller(root) {
    root.querySelectorAll("[data-tab]").forEach(b => {
      const t = b.dataset.tab;
      if (b.closest(".bl-nav") && !b.querySelector(".bl-ico")) {
        const label = b.textContent.trim();
        b.innerHTML = '<span class="bl-ico">' + (ICONES[t] || "•") + "</span><span>" + label + "</span>";
      }
    });
    if (!root.querySelector(".bl-fab")) {
      const fab = document.createElement("button");
      fab.type = "button";
      fab.className = "bl-fab";
      fab.setAttribute("aria-label", "Nouvelle discussion");
      fab.textContent = "✉";
      fab.addEventListener("click", () => {
        const m = root.querySelector('[data-tab="messages"]');
        if (m && !m.classList.contains("active")) m.click();
        setTimeout(() => { const i = document.getElementById("bl-target"); if (i) i.focus(); }, 80);
      });
      root.appendChild(fab);
    }
    const nav = root.querySelector(".bl-nav");
    if (nav && !nav.dataset.bl) {
      nav.dataset.bl = "1";
      nav.addEventListener("click", e => {
        const b = e.target.closest("[data-tab]");
        if (b) root.dataset.tab = b.dataset.tab;
      });
    }
    const actif = root.querySelector(".bl-nav button.active");
    root.dataset.tab = actif ? actif.dataset.tab : "stories";
    root.querySelectorAll("#bl-chat-list .bl-row, #bl-friend-list .bl-row").forEach(r => {
      if (r.querySelector(".bl-av")) return;
      const nom = r.querySelector("button, span");
      const av = document.createElement("span");
      av.className = "bl-av";
      av.textContent = initiale(nom ? nom.textContent : "");
      r.insertBefore(av, r.firstChild);
    });
  }

  let pret = false;
  const tentative = setInterval(() => {
    const root = document.getElementById("bl-communaute");
    if (!root) return;
    clearInterval(tentative);
    if (pret) return;
    pret = true;
    habiller(root);
    new MutationObserver(() => habiller(root)).observe(root, { childList: true, subtree: true });
  }, 300);
  setTimeout(() => clearInterval(tentative), 30000);
})();
