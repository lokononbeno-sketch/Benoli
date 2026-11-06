/* BENOLI LITTÉRAIRE — Progression, points et trophées */
(function(){
"use strict";
if(window.__benoliGamification)return;
window.__benoliGamification=true;
if(typeof PAGES==="undefined"||typeof ROMANS==="undefined")return;
const KEY="benoli-gamification-v1";
const today=()=>new Date().toISOString().slice(0,10);
const fresh=()=>({points:0,days:[],books:[],quizDays:[],badges:[],lastVisit:""});
let data=fresh();
try{const saved=JSON.parse(localStorage.getItem(KEY)||"{}");if(saved&&typeof saved==="object")data=Object.assign(fresh(),saved)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const badgeList=[
{id:"premier-pas",name:"Premier pas",icon:"🌱",desc:"Découvrir ton premier roman",test:()=>data.books.length>=1},
{id:"lecteur-curieux",name:"Lecteur curieux",icon:"🔎",desc:"Découvrir 3 romans",test:()=>data.books.length>=3},
{id:"bibliophile",name:"Bibliophile",icon:"📚",desc:"Découvrir 5 romans",test:()=>data.books.length>=5},
{id:"jour-apres-jour",name:"Rendez-vous fidèle",icon:"🔥",desc:"Revenir 3 jours différents",test:()=>data.days.length>=3},
{id:"assidu",name:"Passion lecture",icon:"🏅",desc:"Revenir 7 jours différents",test:()=>data.days.length>=7},
{id:"esprit-vif",name:"Esprit vif",icon:"🧠",desc:"Terminer un quiz",test:()=>data.quizDays.length>=1},
{id:"grand-lecteur",name:"Grand lecteur",icon:"👑",desc:"Gagner 200 points",test:()=>data.points>=200}
];
function award(id){if(data.badges.includes(id))return;data.badges.push(id);const b=badgeList.find(x=>x.id===id);if(b)notify("Nouveau trophée débloqué !",b.icon+" "+b.name)}
function checkBadges(){badgeList.forEach(b=>{if(b.test())award(b.id)})}
function notify(title,message){
 try{window.dispatchEvent(new CustomEvent("benoli:notification",{detail:{title,message,type:"reward"}}))}catch(e){}
 let box=document.getElementById("benoli-gm-toast");if(!box){box=document.createElement("div");box.id="benoli-gm-toast";document.body.appendChild(box)}
 box.innerHTML="<strong>"+esc(title)+"</strong><span>"+esc(message)+"</span>";box.classList.add("visible");
 clearTimeout(window.__benoliGmToastTimer);window.__benoliGmToastTimer=setTimeout(()=>box.classList.remove("visible"),3600);
}
function addPoints(n,reason){data.points+=n;save();checkBadges();save();notify("+"+n+" points Benoli",reason);refresh()}
const date=today();
if(!data.days.includes(date)){data.days.push(date);if(data.days.length>365)data.days=data.days.slice(-365);data.points+=5;data.lastVisit=date;save();checkBadges();save()}
const level=()=>{const p=data.points;if(p>=500)return {n:5,t:"Légende littéraire",next:500};if(p>=250)return {n:4,t:"Maître des pages",next:500};if(p>=100)return {n:3,t:"Lecteur passionné",next:250};if(p>=30)return {n:2,t:"Explorateur",next:100};return {n:1,t:"Novice",next:30}};
const progress=()=>{const l=level();const floor=[0,0,30,100,250,500][l.n];return Math.max(0,Math.min(100,Math.round((data.points-floor)/(l.next-floor)*100)))};
function page(){
 const l=level(),earned=badgeList.filter(b=>data.badges.includes(b.id));
 return `<section class="gm-page"><header class="gm-head"><span>✦ TON PARCOURS BENOLI</span><h2 class="serif">Mes récompenses</h2><p>Chaque découverte fait grandir ton univers de lecteur.</p></header>
 <div class="gm-score"><div class="gm-score-top"><div><small>TES POINTS</small><strong>${data.points}</strong><span>points Benoli</span></div><div class="gm-level"><span>NIVEAU ${l.n}</span><b>${l.t}</b>🏆</div></div><div class="gm-progress"><i style="width:${progress()}%"></i></div><small class="gm-next">${data.points>=500?"Tu as atteint le niveau maximum !":(l.next-data.points)+" points pour le prochain niveau"}</small></div>
 <div class="gm-stats"><article><b>${data.books.length}</b><span>Romans découverts</span></article><article><b>${data.days.length}</b><span>Jours actifs</span></article><article><b>${earned.length}/${badgeList.length}</b><span>Trophées obtenus</span></article></div>
 <h3 class="serif">🎖️ Collection de trophées</h3><p class="gm-muted">Débloque ces distinctions en explorant Benoli Littéraire.</p><div class="gm-badges">${badgeList.map(b=>{const ok=data.badges.includes(b.id);return `<article class="gm-badge ${ok?"unlocked":"locked"}"><span>${b.icon}</span><div><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div><i>${ok?"✓":"🔒"}</i></article>`}).join("")}</div>
 <h3 class="serif">Comment gagner des points ?</h3><div class="gm-rules"><p>📅 Première visite du jour <b>+5 pts</b></p><p>📖 Découvrir un nouveau roman après 1 minute <b>+20 pts</b></p><p>🧠 Terminer un quiz (une fois par jour) <b>+10 pts</b></p></div><p class="gm-foot">Ta progression est enregistrée sur cet appareil. Elle n'est pas encore synchronisée entre plusieurs téléphones.</p></section>`;
}
PAGES.recompenses=page;
const style=document.createElement("style");style.id="benoli-gamification-style";style.textContent=`
.gm-page{padding:4px 0 30px}.gm-head{text-align:center;margin:4px 0 18px}.gm-head>span{font-size:.65rem;letter-spacing:.16em;color:var(--vert);font-weight:800}.gm-head h2{font-size:1.8rem;margin:8px 0}.gm-head p,.gm-muted{color:var(--doux);font-size:.85rem}.gm-score{padding:19px;border-radius:20px;background:linear-gradient(135deg,#173f32,#0b5d3b 65%,#b08a45);color:#fff;margin-bottom:14px;box-shadow:0 12px 30px #0b5d3b2a}.gm-score-top{display:flex;justify-content:space-between;align-items:center;gap:12px}.gm-score-top>div:first-child{display:flex;flex-direction:column}.gm-score-top small,.gm-level span{font-size:.65rem;letter-spacing:.13em;color:#ffffffbd}.gm-score-top strong{font:700 2.6rem Georgia,serif}.gm-score-top>div:first-child span{font-size:.75rem;color:#ffffffc9}.gm-level{text-align:right;display:flex;flex-direction:column;gap:5px}.gm-level b{font:700 1rem Georgia,serif}.gm-progress{height:8px;border-radius:99px;background:#ffffff38;margin-top:18px;overflow:hidden}.gm-progress i{display:block;height:100%;border-radius:99px;background:#f5cf7d}.gm-next{display:block;text-align:right;margin-top:7px;color:#ffffffc9;font-size:.68rem}.gm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0 24px}.gm-stats article{padding:13px 7px;border:1px solid var(--trait);border-radius:14px;background:var(--carte);display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px}.gm-stats b{font:700 1.4rem Georgia,serif;color:var(--vert)}.gm-stats span{font-size:.66rem;color:var(--doux)}.gm-page h3{margin:18px 0 7px}.gm-badges{display:grid;gap:9px;margin:12px 0 22px}.gm-badge{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--trait);border-radius:14px;background:var(--carte)}.gm-badge>span{font-size:1.7rem}.gm-badge div{display:flex;flex:1;min-width:0;flex-direction:column;gap:3px}.gm-badge b{font-size:.86rem;color:var(--encre)}.gm-badge small{font-size:.72rem;color:var(--doux)}.gm-badge>i{font-style:normal}.gm-badge.locked{opacity:.55;filter:grayscale(.65)}.gm-rules{padding:5px 13px;border:1px solid var(--trait);border-radius:14px;background:var(--carte)}.gm-rules p{display:flex;justify-content:space-between;gap:10px;font-size:.77rem;color:var(--encre);padding:9px 0;border-bottom:1px solid var(--trait)}.gm-rules p:last-child{border:0}.gm-rules b{white-space:nowrap;color:var(--vert)}.gm-foot{font-size:.7rem;color:var(--doux);line-height:1.5;margin-top:15px}#benoli-gm-toast{position:fixed;z-index:99999;left:50%;bottom:22px;transform:translate(-50%,20px);opacity:0;pointer-events:none;width:min(90vw,360px);padding:13px 16px;border-radius:15px;background:#173f32;color:#fff;box-shadow:0 12px 35px #0004;display:flex;flex-direction:column;gap:4px;transition:.25s}#benoli-gm-toast.visible{opacity:1;transform:translate(-50%,0)}#benoli-gm-toast strong{font-size:.85rem}#benoli-gm-toast span{font-size:.76rem;color:#ffffffd6}
`;document.head.appendChild(style);
function refresh(){const el=document.querySelector("#ficheContenu .gm-page");if(el)el.outerHTML=page()}
const nav=document.getElementById("navBas");if(nav&&!nav.querySelector('[data-n="recompenses"]'))nav.insertAdjacentHTML("beforeend",'<a href="#/recompenses" data-n="recompenses"><span>🏆</span>Récompenses</a>');
const bookById=new Map(ROMANS.map(r=>[String(r.id),r]));
let activeBook="",timer=null,visitedSession="";
function stopBook(){if(timer){clearTimeout(timer);timer=null}activeBook=""}
function startBook(){
 stopBook();const hash=location.hash.replace(/^#\//,"").split(/[?&]/)[0];const r=bookById.get(decodeURIComponent(hash));if(!r)return;
 activeBook=String(r.id);
 if(data.books.includes(activeBook)||visitedSession===activeBook)return;
 timer=setTimeout(()=>{
  if(document.visibilityState!=="visible"||!activeBook||activeBook!==String(r.id))return;
  visitedSession=activeBook;data.books.push(activeBook);addPoints(20,"Roman découvert : "+r.titre);
 },60000);
}
window.addEventListener("hashchange",()=>{startBook();if(location.hash==="#/recompenses")refresh()});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState!=="visible")stopBook();else startBook()});
startBook();
let quizAwarded=false;
const quizObs=new MutationObserver(()=>{
 const zone=document.getElementById("quizZone");
 if(zone&&zone.querySelector(".score")&&!quizAwarded&&!data.quizDays.includes(today())){
  quizAwarded=true;data.quizDays.push(today());addPoints(10,"Quiz terminé : bravo pour ta participation !");
 }
});
quizObs.observe(document.body,{childList:true,subtree:true});
checkBadges();save();
})();
