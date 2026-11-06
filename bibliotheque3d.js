/* BENOLI LITTÉRAIRE — Bibliothèque virtuelle 3D */
(function(){
"use strict";
const accueil=document.querySelector(".accueil-bienvenue"),catalogue=document.getElementById("catalogue");
if(!accueil||!catalogue||document.getElementById("bibliotheque3d")||typeof ROMANS==="undefined")return;
const romans=ROMANS,esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const genres=[...new Set(romans.map(r=>(r.genre||"Romans").trim()).filter(Boolean))];
const section=document.createElement("section");
section.id="bibliotheque3d";section.className="bibliotheque-3d wrap";
section.innerHTML=[
'<header class="biblio-entete"><span>✦ LE GRAND ESPACE DE LECTURE</span><h2>La bibliothèque <em>Benoli</em></h2><p>Prends le temps de parcourir les rayons. Chaque livre cache un univers à découvrir.</p><div class="biblio-compteur">✧ <strong>'+romans.length+'</strong> œuvres dans la collection</div></header>',
'<div class="biblio-commandes"><label class="biblio-recherche"><span>⌕</span><input type="search" id="biblioRecherche" placeholder="Rechercher un roman, un genre…" aria-label="Rechercher dans la bibliothèque"></label><div class="biblio-filtres" id="biblioFiltres"><button type="button" class="actif" data-genre="Tous">Tous les livres</button></div></div>',
'<div class="biblio-intro-rayon"><div><span>COLLECTION PERMANENTE</span><h3>Les rayons de Benoli</h3></div><span class="biblio-rayon-compte">'+romans.length+' livres</span></div>',
'<div class="biblio-rayonnage" id="biblioRayonnage"></div><div class="biblio-vide" id="biblioVide" hidden>Aucun livre ne correspond à ta recherche. Essaie un autre titre.</div>',
'<div class="biblio-bas">✦ Chaque livre est une porte vers un autre monde ✦</div>'
].join("");
catalogue.parentNode.insertBefore(section,catalogue);
const filtres=section.querySelector("#biblioFiltres"),recherche=section.querySelector("#biblioRecherche"),rayonnage=section.querySelector("#biblioRayonnage"),compteur=section.querySelector(".biblio-rayon-compte"),vide=section.querySelector("#biblioVide");
genres.forEach(g=>{const b=document.createElement("button");b.type="button";b.dataset.genre=g;b.textContent=g;filtres.appendChild(b)});
let genreActif="Tous";
function carte(r,index){
 const titre=esc(r.titre),image=r.couverture?'<img src="'+esc(r.couverture)+'" alt="Couverture de '+titre+'" loading="lazy">':'<span class="biblio-sans-couverture">'+titre+'</span>';
 return '<a class="biblio-livre" href="#/'+encodeURIComponent(r.id)+'" aria-label="Découvrir '+titre+'"><span class="biblio-livre-face"><span class="biblio-couverture" style="--livre-index:'+index%6+'">'+image+'<i></i></span><span class="biblio-tranche"></span></span><span class="biblio-livre-titre">'+titre+'</span><span class="biblio-livre-genre">'+esc(r.genre||"Roman")+'</span></a>';
}
function afficher(){
 const q=recherche.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const liste=romans.filter(r=>{
  const ok=genreActif==="Tous"||(r.genre||"Romans").trim()===genreActif;
  const texte=[r.titre,r.sousTitre,r.genre,r.resume].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  return ok&&texte.includes(q);
 });
 rayonnage.innerHTML="";
 for(let i=0;i<liste.length;i+=4){
  const row=document.createElement("div");row.className="biblio-rangee";
  row.innerHTML='<div class="biblio-livres">'+liste.slice(i,i+4).map((r,j)=>carte(r,i+j)).join("")+'</div><div class="biblio-planche"><i></i></div>';
  rayonnage.appendChild(row);
 }
 compteur.textContent=liste.length+' livre'+(liste.length>1?'s':'');vide.hidden=liste.length!==0;
}
filtres.addEventListener("click",e=>{const b=e.target.closest("button[data-genre]");if(!b)return;genreActif=b.dataset.genre;filtres.querySelectorAll("button").forEach(x=>x.classList.toggle("actif",x===b));afficher()});
recherche.addEventListener("input",afficher);afficher();
const css=[
'.bibliotheque-3d{position:relative;overflow:hidden;margin-top:32px;margin-bottom:38px;padding:27px 16px 24px;border-radius:26px;color:#f8f0df;background:radial-gradient(ellipse at 50% 0%,#4b3a2d,#251d1a 48%,#17151a);box-shadow:0 18px 42px #15100c25}',
'.bibliotheque-3d:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.35;background:repeating-linear-gradient(90deg,transparent 0 48px,#d8a75c08 49px 50px),radial-gradient(ellipse at 50% 40%,#e5b96b20,transparent 68%)}',
'.biblio-entete,.biblio-commandes,.biblio-intro-rayon,.biblio-rayonnage,.biblio-vide,.biblio-bas{position:relative;z-index:1}.biblio-entete{text-align:center;max-width:540px;margin:0 auto 22px}',
'.biblio-entete>span,.biblio-intro-rayon>div>span{font-size:.64rem;letter-spacing:.17em;font-weight:850;color:#e7c17c}.biblio-entete h2{font:700 clamp(1.8rem,7vw,2.5rem)/1.1 Georgia,serif;margin:9px 0;color:#fff4dc}.biblio-entete h2 em{color:#eac47c}.biblio-entete p{font-size:.86rem;line-height:1.55;color:#e4d5bd}',
'.biblio-compteur{display:inline-flex;align-items:center;gap:8px;margin-top:10px;padding:7px 13px;border:1px solid #dcb66a55;border-radius:99px;background:#fff8e90b;color:#f4e5c9;font-size:.75rem}.biblio-compteur strong{font:700 1rem Georgia,serif;color:#f5d38e}',
'.biblio-commandes{display:grid;gap:12px;margin:0 auto 25px;max-width:600px}.biblio-recherche{display:flex;align-items:center;gap:9px;padding:0 14px;height:44px;border:1px solid #d9bc8955;border-radius:13px;background:#fffaf00e;color:#f5d38e}.biblio-recherche span{font-size:1.5rem}.biblio-recherche input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#fff5e5;font:inherit;font-size:.85rem}.biblio-recherche input::placeholder{color:#e8d9c0a0}',
'.biblio-filtres{display:flex;gap:7px;overflow-x:auto;padding:2px 1px 7px;scrollbar-width:thin}.biblio-filtres button{flex:0 0 auto;border:1px solid #d9bc8950;border-radius:99px;padding:7px 12px;background:#fff8e909;color:#e9dbc5;font-size:.72rem}.biblio-filtres button.actif{background:#e5bd73;color:#302318;border-color:#e5bd73;font-weight:800}',
'.biblio-intro-rayon{display:flex;align-items:end;justify-content:space-between;gap:10px;margin:0 2px 13px}.biblio-intro-rayon h3{font:700 1.25rem Georgia,serif;margin-top:4px;color:#fff1d7}.biblio-rayon-compte{font-size:.7rem;color:#d8c6a8;white-space:nowrap}',
'.biblio-rayonnage{padding:7px 0 3px;perspective:1000px}.biblio-rangee{position:relative;margin:0 0 24px;padding:4px 8px 13px;background:linear-gradient(180deg,#69452e22,#281b16aa 85%);border-radius:12px 12px 4px 4px;box-shadow:inset 0 10px 20px #0a080733}',
'.biblio-livres{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(8px,3vw,18px);align-items:end;padding:7px 2px 0}.biblio-livre{display:flex;min-width:0;flex-direction:column;align-items:center;text-decoration:none;color:#fff2d9;perspective:500px;transition:transform .25s ease}',
'.biblio-livre:active{transform:translateY(-5px) scale(1.025)}.biblio-livre-face{position:relative;display:block;width:100%;max-width:112px;aspect-ratio:.69;transform:rotateY(-7deg) rotateX(2deg);transform-style:preserve-3d;filter:drop-shadow(5px 8px 5px #09060599);transition:transform .3s ease}.biblio-livre:hover .biblio-livre-face{transform:rotateY(0) translateY(-8px) scale(1.035)}',
'.biblio-couverture{position:absolute;inset:0;overflow:hidden;border:1px solid #e6c99199;border-left:5px solid #d9b77b88;border-radius:3px 5px 5px 3px;background:linear-gradient(145deg,hsl(calc(var(--livre-index)*47 + 20) 35% 35%),#17151b);box-shadow:inset 5px 0 9px #0004}.biblio-couverture img{display:block;width:100%;height:100%;object-fit:cover}.biblio-couverture i{position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,#ffffff20,transparent 28%,transparent 72%,#0002)}',
'.biblio-tranche{position:absolute;top:4px;right:-7px;width:7px;height:calc(100% - 8px);transform:rotateY(45deg);transform-origin:left;background:linear-gradient(90deg,#b99763,#e2d0a9,#8e714b)}.biblio-sans-couverture{display:flex;height:100%;align-items:center;justify-content:center;padding:7px;text-align:center;font:700 .7rem Georgia,serif;color:#fff0d1}',
'.biblio-livre-titre{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;width:100%;margin-top:9px;text-align:center;font:700 .72rem/1.25 Georgia,serif;color:#fff1d8}.biblio-livre-genre{margin-top:4px;font-size:.59rem;color:#d9c29d;text-align:center}',
'.biblio-planche{height:11px;margin:10px -7px 0;border-radius:2px;background:linear-gradient(180deg,#c28c51,#754629 38%,#3d251b);box-shadow:0 7px 9px #09060588,0 1px 0 #e7bd7b inset}.biblio-planche i{display:block;height:2px;background:#f0ca8a66}.biblio-vide{padding:22px;text-align:center;color:#e9d8bd;font-size:.85rem}.biblio-bas{display:flex;justify-content:center;margin-top:8px;text-align:center;font:italic .78rem Georgia,serif;color:#d9c39f}',
'@media(min-width:600px){.bibliotheque-3d{padding:35px 26px}.biblio-livres{gap:24px;padding-left:7%;padding-right:7%}.biblio-livre-face{max-width:130px}.biblio-livre-titre{font-size:.82rem}}@media(prefers-reduced-motion:reduce){.bibliotheque-3d *{transition:none!important}}'
].join("");
const style=document.createElement("style");style.id="benoli-bibliotheque-3d-style";style.textContent=css;document.head.appendChild(style);
const actions=document.querySelector("#benoli-univers-3d .b3d-buttons");
if(actions&&!actions.querySelector('[href="#bibliotheque3d"]')){const a=document.createElement("a");a.href="#bibliotheque3d";a.className="b3d-secondaire";a.textContent="Entrer dans la bibliothèque";actions.appendChild(a)}
})();