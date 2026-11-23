/* BENOLI LITTÉRAIRE — modernisation des pages intérieures
   Couche de présentation uniquement : aucune logique métier ou donnée n'est modifiée. */
(function(){
"use strict";
if(window.__benoliPagesModernReady)return;
window.__benoliPagesModernReady=true;
const css=String.raw`
/* Socle des pages */
html body{font-family:Inter,system-ui,sans-serif!important;background:var(--papier);color:var(--encre)}
html body h1,html body h2,html body h3,html body .serif{font-family:Lora,Georgia,serif!important;color:var(--encre)}
html body header.hero h1{color:var(--vert)!important;-webkit-text-fill-color:var(--vert)!important}
html body .benoli-brand span{color:var(--vert)!important;-webkit-text-fill-color:var(--vert)!important}
#fiche{background:var(--papier)!important}
#ficheContenu{max-width:900px;padding-bottom:34px}
#ficheContenu>.retour{display:inline-flex;align-items:center;gap:8px;margin:18px 0 20px;padding:10px 15px;border-radius:999px;background:var(--carte);border:1px solid var(--trait);color:var(--vert);font-weight:700;box-shadow:0 3px 10px rgba(43,29,20,.05)}
#ficheContenu .page{padding:clamp(18px,4vw,34px);border:1px solid var(--trait);border-radius:24px;background:var(--carte);box-shadow:0 12px 35px rgba(43,29,20,.06);overflow:hidden}
#ficheContenu .page>h2{font:700 clamp(1.8rem,6vw,2.5rem)/1.12 Lora,Georgia,serif!important;letter-spacing:-.025em;margin:0 0 12px;color:var(--encre)!important}
#ficheContenu .page>h2:before{content:"BENOLI LITTÉRAIRE";display:block;margin-bottom:10px;color:var(--benoli-terre);font:800 .66rem/1 Inter,system-ui,sans-serif;letter-spacing:.16em}
#ficheContenu .page>p,#ficheContenu .page .attente{color:var(--doux);line-height:1.7}
#ficheContenu .page .bloc{margin:18px 0;padding:clamp(15px,3vw,22px);border:1px solid var(--trait);border-radius:17px;background:var(--benoli-creme)}
#ficheContenu .page .bloc h3{font:700 1.2rem/1.25 Lora,Georgia,serif!important;color:var(--vert)!important;margin-bottom:9px}
#ficheContenu .page .bloc p{color:var(--doux);line-height:1.75}
#ficheContenu .page .portrait{width:min(100%,230px);aspect-ratio:4/5;object-fit:cover;border-radius:20px;border:5px solid var(--carte);box-shadow:0 10px 25px rgba(43,29,20,.16);margin:0 auto 20px}
#ficheContenu .page .actions{gap:10px}
#ficheContenu .page .btn{border-radius:13px;background:var(--benoli-terre);border-color:var(--benoli-terre);color:#fff;box-shadow:0 5px 13px rgba(139,94,60,.13)}
#ficheContenu .page .btn.sec{background:transparent;color:var(--vert);border-color:var(--vert);box-shadow:none}
#ficheContenu .page .partage{background:var(--benoli-creme);border-color:var(--trait);border-radius:17px}
#ficheContenu .page .partage h3{font-family:Lora,Georgia,serif!important}
#ficheContenu .page .pbtn{border-radius:999px;border-color:var(--vert);color:var(--vert);background:var(--carte)}
#ficheContenu .page a:not(.btn):not(.pbtn){color:var(--vert);font-weight:650;text-underline-offset:3px}
#ficheContenu .page input,#ficheContenu .page textarea,#ficheContenu .page select{font:inherit;color:var(--encre);background:var(--carte);border:1px solid var(--trait);border-radius:12px;padding:12px;max-width:100%}
#ficheContenu .page button:focus-visible,#ficheContenu .page a:focus-visible{outline:3px solid var(--or);outline-offset:3px}

/* Profil lecteur — formulaire et espace personnel */
.bp{max-width:650px!important;padding:6px 0 36px!important}
.bp h2{font:700 clamp(1.8rem,6vw,2.3rem)/1.15 Lora,Georgia,serif!important;color:var(--encre)!important;margin-bottom:12px!important}
.bp>p{color:var(--doux)!important;line-height:1.65}
.bp form{gap:15px!important;padding:clamp(16px,4vw,24px);border:1px solid var(--trait);border-radius:20px;background:var(--carte);box-shadow:0 9px 25px rgba(43,29,20,.055)}
.bp form label{color:var(--encre)!important;font-size:.88rem!important;font-weight:700!important}
.bp input,.bp select,.bp textarea{border:1px solid var(--trait)!important;border-radius:12px!important;background:var(--papier)!important;color:var(--encre)!important;min-height:45px}
.bp input:focus,.bp select:focus,.bp textarea:focus{outline:3px solid rgba(201,162,39,.25);border-color:var(--benoli-terre)!important}
.bp button:not(.bp-reset),.bp form button{border-radius:12px!important;background:var(--benoli-terre)!important;color:#fff!important;border:1px solid var(--benoli-terre)!important;font-weight:750!important;padding:12px 16px!important}
.bp-switch{padding:5px;border:1px solid var(--trait);border-radius:999px;background:var(--benoli-creme)}
.bp-switch a{border:0!important;color:var(--doux)!important}
.bp-switch a[aria-current=page]{background:var(--vert)!important;color:#fff!important;box-shadow:0 3px 9px rgba(31,77,58,.18)}
.bp-status{border:1px solid var(--trait);border-radius:12px;background:var(--benoli-creme)!important;color:var(--encre)!important}
.bp-status.error{background:rgba(166,61,47,.1)!important;color:#A63D2F!important;border-color:rgba(166,61,47,.25)}
.bp-status.success{background:rgba(31,77,58,.1)!important;color:var(--vert)!important;border-color:rgba(31,77,58,.25)}
.bp-note{color:var(--doux)!important;line-height:1.6}
.bp-links a,.bp-profile-card{border:1px solid var(--trait)!important;border-radius:15px!important;background:var(--benoli-creme)!important;color:var(--vert)!important}
.bp-profile-card{padding:19px!important;color:var(--encre)!important}
.bp-section-title{color:var(--vert)!important;font-family:Lora,Georgia,serif!important;font-size:1.12rem}
.bp-avatar{border:4px solid var(--or)!important;box-shadow:0 5px 16px rgba(43,29,20,.12)}

/* Communauté — conserver le fonctionnement et éclaircir l'espace */
#bl-communaute{background:var(--papier)!important;color:var(--encre)!important;font-family:Inter,system-ui,sans-serif!important}
#bl-communaute .bl-shell{max-width:820px!important;padding:clamp(14px,3vw,26px)!important}
#bl-communaute .bl-head{border-bottom:1px solid var(--trait)!important;padding:12px 0 20px!important}
#bl-communaute .bl-head small{color:var(--benoli-terre)!important;letter-spacing:.15em}
#bl-communaute h2{font:700 clamp(1.8rem,6vw,2.25rem)/1.15 Lora,Georgia,serif!important;color:var(--encre)!important}
#bl-communaute h3,#bl-communaute .bl-card h4{font-family:Lora,Georgia,serif!important;color:var(--vert)!important}
#bl-communaute .bl-back,#bl-communaute a{color:var(--vert)!important}
#bl-communaute .bl-mark{color:var(--benoli-terre)!important}
#bl-communaute .bl-status{padding:11px 13px;border-radius:12px;background:var(--benoli-creme)!important;color:var(--doux)!important;border:1px solid var(--trait)}
#bl-communaute .bl-panel,#bl-communaute .bl-card{background:var(--carte)!important;border:1px solid var(--trait)!important;border-radius:18px!important;padding:clamp(15px,3vw,21px)!important;box-shadow:0 7px 20px rgba(43,29,20,.045)}
#bl-communaute p{color:var(--doux)!important;line-height:1.65}
#bl-communaute label{color:var(--encre)!important;font-weight:650}
#bl-communaute input,#bl-communaute textarea{background:var(--papier)!important;color:var(--encre)!important;border:1px solid var(--trait)!important;border-radius:12px!important}
#bl-communaute input:focus,#bl-communaute textarea:focus{outline:3px solid rgba(201,162,39,.25);border-color:var(--benoli-terre)!important}
#bl-communaute .bl-primary{background:var(--benoli-terre)!important;color:#fff!important;border:0!important;border-radius:12px!important;box-shadow:0 5px 13px rgba(139,94,60,.16)}
#bl-communaute .bl-tabs,#bl-communaute .bl-nav{gap:7px!important;overflow-x:auto;padding:3px 1px 7px}
#bl-communaute .bl-tabs button,#bl-communaute .bl-nav button{flex:1 0 auto;background:var(--benoli-creme)!important;color:var(--encre)!important;border:1px solid var(--trait)!important;border-radius:11px!important;padding:10px 12px!important}
#bl-communaute button.active{background:var(--vert)!important;color:#fff!important;border-color:var(--vert)!important}
#bl-communaute .bl-note,#bl-communaute .bl-meta{color:var(--doux)!important}
#bl-communaute .bl-who{color:var(--vert)!important}
#bl-communaute .bl-quiet{background:transparent!important;color:var(--vert)!important;border:1px solid var(--vert)!important;border-radius:10px!important}
#bl-communaute .bl-card h4{font-size:1.12rem!important}
#bl-communaute .bl-actions button{background:var(--benoli-creme)!important;color:var(--vert)!important;border:1px solid var(--trait)!important;border-radius:999px!important;padding:8px 12px!important}
#bl-communaute .bl-row{border-color:var(--trait)!important}
#bl-communaute .bl-row button{color:var(--vert)!important}
#bl-communaute .bl-chat{background:var(--papier)!important;border:1px solid var(--trait)!important;border-radius:15px!important}
#bl-communaute .bl-bubble{background:var(--benoli-creme)!important;color:var(--encre)!important;border:1px solid var(--trait);border-radius:15px!important}
#bl-communaute .bl-bubble.mine{background:var(--vert)!important;color:#fff!important;border-color:var(--vert)!important}
#bl-communaute .bl-empty{color:var(--doux)!important}

/* Bibliothèque 3D — conserver les rayons et leurs livres en relief */
.bibliotheque-3d{background:linear-gradient(145deg,#FBF6EC,#F3EAD8)!important;color:#2B1D14!important;border:1px solid #E0D3BE;box-shadow:0 12px 30px rgba(43,29,20,.08)!important;border-radius:24px!important}
.bibliotheque-3d:before{opacity:.45!important;background:radial-gradient(ellipse at 50% 0%,rgba(201,162,39,.12),transparent 65%)!important}
.biblio-entete>span,.biblio-intro-rayon>div>span{color:#8B5E3C!important}
.biblio-entete h2,.biblio-intro-rayon h3{color:#2B1D14!important}
.biblio-entete h2 em{color:#1F4D3A!important}
.biblio-entete p,.biblio-rayon-compte{color:#6B5B4E!important}
.biblio-compteur{background:#fffdf8!important;border-color:#E0D3BE!important;color:#6B5B4E!important}
.biblio-compteur strong{color:#1F4D3A!important}
.biblio-recherche{background:#fffdf8!important;border-color:#E0D3BE!important;color:#8B5E3C!important}
.biblio-recherche input{color:#2B1D14!important}
.biblio-recherche input::placeholder{color:#8B8177!important}
.biblio-filtres button{background:#fffdf8!important;border-color:#E0D3BE!important;color:#6B5B4E!important}
.biblio-filtres button.actif{background:#1F4D3A!important;border-color:#1F4D3A!important;color:#fff!important}
.biblio-rangee{background:linear-gradient(180deg,rgba(139,94,60,.09),rgba(139,94,60,.18))!important;box-shadow:inset 0 8px 16px rgba(43,29,20,.06)!important}
.biblio-livre-titre{color:#2B1D14!important}.biblio-livre-genre{color:#6B5B4E!important}
.biblio-planche{background:linear-gradient(180deg,#C08A61,#8B5E3C 42%,#5A3928)!important;box-shadow:0 6px 9px rgba(43,29,20,.15),0 1px 0 #e7bd7b inset!important}
.biblio-vide,.biblio-bas{color:#6B5B4E!important}
html[data-benoli-appearance="dark"] .bibliotheque-3d{background:linear-gradient(145deg,#1B241E,#202A23)!important;color:#F3EEE4!important;border-color:#394638}
html[data-benoli-appearance="dark"] .biblio-entete h2,html[data-benoli-appearance="dark"] .biblio-intro-rayon h3{color:#F3EEE4!important}
html[data-benoli-appearance="dark"] .biblio-entete p,html[data-benoli-appearance="dark"] .biblio-rayon-compte,html[data-benoli-appearance="dark"] .biblio-vide,html[data-benoli-appearance="dark"] .biblio-bas,html[data-benoli-appearance="dark"] .biblio-livre-titre{color:#B9B0A2!important}
html[data-benoli-appearance="dark"] .biblio-recherche,html[data-benoli-appearance="dark"] .biblio-filtres button{background:#1B241E!important;border-color:#394638!important;color:#B9B0A2!important}
html[data-benoli-appearance="dark"] .biblio-recherche input{color:#F3EEE4!important}
html[data-benoli-appearance="dark"] .biblio-rangee{background:linear-gradient(180deg,rgba(192,138,97,.08),rgba(192,138,97,.2))!important}

#ficheContenu .securite-achat{margin:12px 2px 20px;padding:12px 14px;border:1px solid var(--trait);border-left:4px solid var(--or);border-radius:10px;background:var(--benoli-creme);color:var(--doux);font-size:.82rem;line-height:1.55}

/* Fiches romans, extraits et lecture */
#ficheContenu .haut{align-items:start;gap:clamp(14px,4vw,24px);padding:15px;border:1px solid var(--trait);border-radius:19px;background:var(--carte)}
#ficheContenu .haut .cv{border-radius:9px 13px 13px 9px}
#ficheContenu .haut h2{font:700 clamp(1.3rem,4.8vw,2rem)/1.16 Lora,Georgia,serif!important;color:var(--encre)!important}
#ficheContenu .haut .ss{color:var(--doux)!important;line-height:1.5}
#ficheContenu .etiq{background:var(--benoli-creme)!important;border-color:var(--trait)!important;color:var(--vert)!important}
#ficheContenu .extrait{background:var(--benoli-creme)!important;border:1px solid var(--trait)!important;border-radius:17px!important;padding:clamp(16px,3.5vw,24px)!important;line-height:1.85!important;color:var(--encre)!important}
#ficheContenu .bloc h3{color:var(--vert)!important}
#ficheContenu .actions .btn{min-height:48px;display:flex;align-items:center;justify-content:center}

/* Univers musical */
.lyrics-entete{display:flex;align-items:center;gap:15px;padding:20px;border-radius:19px;background:linear-gradient(130deg,#1F4D3A,#2D6B52);color:#fff;margin-bottom:16px}
.lyrics-entete h2,.lyrics-entete p{color:#fff!important}
.lyrics-note{display:grid;place-items:center;flex:0 0 54px;height:54px;border-radius:16px;background:rgba(255,255,255,.13);font-size:1.8rem}
.lyrics-surtitre{font-size:.72rem!important;letter-spacing:.12em;text-transform:uppercase;opacity:.85}
.lyrics-intro{padding:15px 17px;margin:12px 0 18px;border:1px solid var(--trait);border-radius:15px;background:var(--benoli-creme);color:var(--doux)}
.lyrics-liste{display:grid;gap:13px}
.lyrics-carte{display:grid;grid-template-columns:90px minmax(0,1fr);gap:14px;padding:13px;border:1px solid var(--trait);border-radius:17px;background:var(--carte);box-shadow:0 5px 15px rgba(43,29,20,.04)}
.lyrics-couverture{width:90px;height:130px;object-fit:cover;border-radius:7px;box-shadow:0 5px 12px rgba(43,29,20,.15)}
.lyrics-infos h3{font:700 1rem/1.25 Lora,Georgia,serif!important;color:var(--encre)!important;margin:5px 0}
.lyrics-infos p{font-size:.83rem;line-height:1.45}
.lyrics-tag{display:inline-block;color:var(--benoli-terre);font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.lyrics-infos audio{display:block;width:100%;height:38px;margin-top:9px}
.lyrics-duree{display:block;color:var(--doux);font-size:.72rem;margin-top:4px}
.lyrics-bas{margin-top:18px;padding:14px;border-radius:14px;background:var(--benoli-creme);color:var(--doux);text-align:center}
@media(max-width:430px){#ficheContenu .haut{grid-template-columns:104px minmax(0,1fr)}.lyrics-carte{grid-template-columns:74px minmax(0,1fr);gap:11px}.lyrics-couverture{width:74px;height:108px}}
@media(min-width:760px){.lyrics-liste{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* Quiz, pensées, trophées et notifications : composants transversaux */
.gm-page,.bn-page{color:var(--encre)}
.gm-head,.bn-head{padding:18px 0 20px}
.gm-head>span,.bn-head>span{color:var(--benoli-terre);font-size:.68rem;font-weight:800;letter-spacing:.14em}
.gm-head h2,.bn-head h2{font:700 clamp(1.8rem,6vw,2.3rem)/1.15 Lora,Georgia,serif!important;color:var(--encre)!important;margin:8px 0}
.gm-head p,.bn-head p{color:var(--doux)}
.gm-score,.bn-settings,.bn-item,.bn-options,.gm-badge,.gm-card{border:1px solid var(--trait)!important;border-radius:16px!important;background:var(--carte)!important;color:var(--encre)!important;box-shadow:0 5px 15px rgba(43,29,20,.04)}
.gm-score{padding:20px!important}.gm-score strong{color:var(--vert)!important}
.bn-settings{padding:14px!important;margin:10px 0!important}
.bn-item{display:flex;gap:12px;padding:14px;margin:9px 0;text-decoration:none}
.bn-item p,.bn-item small{color:var(--doux)!important}
.bn-item.read{opacity:.7}
`;
const style=document.createElement("style");style.id="benoli-pages-modernisation";style.textContent=css;document.head.appendChild(style);
})();