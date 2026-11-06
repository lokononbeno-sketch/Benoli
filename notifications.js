/* BENOLI — Notifications intelligentes locales */
(function(){
"use strict";
if(window.__benoliNotifications)return;window.__benoliNotifications=true;
if(typeof PAGES==="undefined"||typeof ROMANS==="undefined")return;
const KEY="benoli-notifications-v1",SEEN="benoli-notifications-seen-v1",ACT="benoli-last-activity-v1";
const defaults={enabled:true,system:false,news:true,reading:true,rewards:true};
let prefs=Object.assign({},defaults),items=[];
try{prefs=Object.assign(prefs,JSON.parse(localStorage.getItem(KEY)||"{}"));items=JSON.parse(localStorage.getItem(SEEN)||"[]")}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(prefs));localStorage.setItem(SEEN,JSON.stringify(items.slice(-40)))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function push(title,message,type="info",url="#/nouveautes"){
 const id=Date.now()+"-"+Math.random().toString(36).slice(2,7);
 items.push({id,title,message,type,date:new Date().toLocaleString("fr-FR"),url,read:false});save();
 if(prefs.enabled&&prefs.system&&"Notification"in window&&Notification.permission==="granted"&&document.visibilityState!=="visible"){
  try{new Notification(title,{body:message,icon:"icon-192.png",tag:"benoli-"+type})}catch(e){}
 }
 renderDot();
}
function renderDot(){const a=document.querySelector('#navBas a[data-n="notifications"]');if(a){const n=items.filter(x=>!x.read).length;a.querySelector(".bn-dot")?.remove();if(n){const d=document.createElement("i");d.className="bn-dot";d.textContent=n>9?"9+":n;a.appendChild(d)}}}
function page(){
 const unread=items.filter(x=>!x.read).length;
 return `<section class="bn-page"><header class="bn-head"><span>✦ RESTE CONNECTÉ À TON UNIVERS</span><h2 class="serif">Notifications</h2><p>Les nouvelles importantes et les petits rappels de Benoli.</p></header>
 <div class="bn-settings"><div><b>Notifications Benoli</b><small>Alertes et rappels dans l'application</small></div><input type="checkbox" id="bn-enabled" ${prefs.enabled?"checked":""}></div>
 <div class="bn-settings"><div><b>Alertes sur cet appareil</b><small>Notifications du navigateur, si autorisées</small></div><button class="btn sec" id="bn-permission">${prefs.system&&Notification.permission==="granted"?"Activées":"Autoriser"}</button></div>
 <div class="bn-options"><label><input type="checkbox" data-pref="news" ${prefs.news?"checked":""}> Nouveautés et annonces</label><label><input type="checkbox" data-pref="reading" ${prefs.reading?"checked":""}> Rappels de lecture</label><label><input type="checkbox" data-pref="rewards" ${prefs.rewards?"checked":""}> Récompenses et trophées</label></div>
 <div class="bn-list-title"><h3 class="serif">Ton fil d'actualité</h3><button class="btn sec" id="bn-readall">Tout marquer comme lu</button></div>
 <div class="bn-feed">${items.length?items.slice().reverse().map(x=>`<a class="bn-item ${x.read?"read":""}" href="${esc(x.url)}" data-bn-id="${esc(x.id)}"><span>${x.type==="reward"?"🏆":x.type==="reading"?"📖":x.type==="news"?"✨":"🔔"}</span><div><b>${esc(x.title)}</b><p>${esc(x.message)}</p><small>${esc(x.date)}</small></div>${x.read?"":"<i>●</i>"}</a>`).join(""):'<p class="bn-empty">Aucune notification pour le moment. Tes prochaines nouvelles apparaîtront ici.</p>'}</div>
 <p class="bn-note">Les rappels automatiques sont générés lorsque tu ouvres l'application. Pour recevoir des alertes quand elle est fermée, Benoli devra ensuite disposer d'un service serveur de notifications push.</p></section>`;
}
PAGES.notifications=page;
const css=document.createElement("style");css.textContent=`.bn-page{padding:5px 0 30px}.bn-head{text-align:center;margin-bottom:18px}.bn-head>span{font-size:.65rem;letter-spacing:.14em;color:var(--vert);font-weight:800}.bn-head h2{margin:8px 0;font-size:1.8rem}.bn-head p,.bn-note{font-size:.8rem;color:var(--doux)}.bn-settings{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px;margin:9px 0;border:1px solid var(--trait);border-radius:13px;background:var(--carte)}.bn-settings div{display:grid;gap:4px}.bn-settings b{font-size:.86rem;color:var(--encre)}.bn-settings small{font-size:.7rem;color:var(--doux)}.bn-settings input[type=checkbox],.bn-options input{accent-color:var(--vert);width:19px;height:19px}.bn-options{display:grid;gap:10px;padding:13px 4px;color:var(--encre);font-size:.82rem}.bn-options label{display:flex;align-items:center;gap:9px}.bn-list-title{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:22px 0 10px}.bn-list-title h3{margin:0}.bn-list-title .btn,.bn-settings .btn{font-size:.72rem;padding:8px 10px}.bn-feed{display:grid;gap:8px}.bn-item{display:flex;align-items:flex-start;gap:11px;padding:13px;border:1px solid var(--trait);border-radius:13px;background:var(--carte);text-decoration:none;color:var(--encre)}.bn-item>span{font-size:1.35rem}.bn-item div{flex:1;min-width:0}.bn-item b{font-size:.85rem}.bn-item p{font-size:.78rem;margin:4px 0;color:var(--doux)}.bn-item small{font-size:.65rem;color:var(--doux)}.bn-item>i{color:var(--vert);font-size:.7rem}.bn-item.read{opacity:.65}.bn-empty{padding:18px;text-align:center;color:var(--doux);font-size:.82rem;border:1px dashed var(--trait);border-radius:13px}.bn-note{line-height:1.5;margin-top:15px}#navBas a[data-n=notifications]{position:relative}.bn-dot{position:absolute;top:0;right:10%;min-width:16px;padding:1px 4px;border-radius:99px;background:#c43d3d;color:white;font-size:9px;font-style:normal}`;
document.head.appendChild(css);
const nav=document.getElementById("navBas");if(nav&&!nav.querySelector('[data-n="notifications"]'))nav.insertAdjacentHTML("beforeend",'<a href="#/notifications" data-n="notifications"><span>🔔</span>Actus</a>');
function refresh(){const el=document.querySelector("#ficheContenu .bn-page");if(el)el.outerHTML=page();renderDot()}
document.addEventListener("change",e=>{
 if(e.target.id==="bn-enabled"){prefs.enabled=e.target.checked;save();refresh()}
 if(e.target.matches("[data-pref]")){prefs[e.target.dataset.pref]=e.target.checked;save()}
});
document.addEventListener("click",async e=>{
 if(e.target.id==="bn-permission"){
  if(!("Notification"in window)){alert("Les notifications système ne sont pas prises en charge par ce navigateur.");return}
  try{const p=await Notification.requestPermission();prefs.system=p==="granted";save();refresh();if(p==="granted")push("Benoli est prêt !","Tu recevras les alertes lorsque les conditions du navigateur le permettent.","info")}catch(_){alert("Impossible d'activer les notifications sur cet appareil.")}
 }
 if(e.target.id==="bn-readall"){items.forEach(x=>x.read=true);save();refresh()}
});
document.addEventListener("click",e=>{const a=e.target.closest("[data-bn-id]");if(a){const x=items.find(n=>n.id===a.dataset.bnId);if(x){x.read=true;save()}}});
window.addEventListener("hashchange",()=>{if(location.hash==="#/notifications")refresh()});
window.addEventListener("benoli:notification",e=>{const t=e.detail||{};if(t.type==="reward"&&prefs.rewards)push(t.title||"Récompense obtenue",t.message||"Bravo !","reward","#/recompenses")});
const last=Number(localStorage.getItem(ACT)||0),now=Date.now(),days=last?Math.floor((now-last)/86400000):0;
if(prefs.enabled&&prefs.reading&&days>=3)push("Ton univers t'attend 📚","Cela fait quelques jours. Reviens découvrir une histoire !","reading","#catalogue");
else if(prefs.enabled&&prefs.reading&&days>=1)push("Un petit moment lecture ?","Retrouve tes romans et poursuis ton aventure.","reading","#/bibliotheque3d");
try{localStorage.setItem(ACT,String(now))}catch(e){}
const current=ROMANS.map(r=>String(r.id)).join("|"),old=localStorage.getItem("benoli-known-romans-v1");
if(prefs.enabled&&prefs.news&&old&&old!==current){push("Le catalogue a évolué ✨","De nouveaux titres sont disponibles dans la bibliothèque.","news","#/bibliotheque3d")}
try{localStorage.setItem("benoli-known-romans-v1",current)}catch(e){}
renderDot();
})();
