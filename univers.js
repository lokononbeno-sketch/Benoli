/* Univers Benoli : personnages et jeux complémentaires */
(function(){
  if(typeof PAGES==="undefined" || typeof ROMANS==="undefined") return;
  const personnages = [
    {n:"Benoli",r:"Elle m'appelait Chéco",id:"elle-m-appelait-checo",role:"Ami proche de Lénis depuis le collège. Leur relation évolue à l'université.",traits:"Attaché à ses habitudes et progressivement confronté à des sentiments qu'il ne comprend pas tout de suite.",spoiler:false},
    {n:"Lénis",r:"Elle m'appelait Chéco",id:"elle-m-appelait-checo",role:"Amie inséparable de Benoli depuis le collège.",traits:"Taquine, proche de Benoli, et habituée à l'appeler « Chéco »."},
    {n:"Bienvenue",r:"Cobi",id:"cobi",role:"Rival de Belvida depuis le lycée ; ils sont amenés à travailler ensemble à l'université.",traits:"Brillant et habitué à la compétition."},
    {n:"Belvida",r:"Cobi",id:"cobi",role:"Rivale de Bienvenue depuis le lycée.",traits:"Exigeante et déterminée ; le surnom « Cobi » est associé à une attitude froide."},
    {n:"Ermine",r:"Je ne suis pas ce qu'ils ont fait de moi",id:"je-ne-suis-pas-ce-qu-ils-ont-fait-de-moi",role:"Fille de ministre.",traits:"Habituée à ce que son entourage cède à ses volontés."},
    {n:"Kévin",r:"Ce que tu m'as coûté",id:"ce-que-tu-m-as-coute",role:"Adolescent de quinze ans qui rêve de devenir footballeur.",traits:"Souriant, sensible et très attaché à ses rêves et à ses proches."},
    {n:"Mélissa",r:"Ce que tu m'as coûté",id:"ce-que-tu-m-as-coute",role:"Jeune fille dont Kévin tombe amoureux.",traits:"Sa relation avec Kévin bouleverse les priorités et les rêves du garçon."},
    {n:"Jade",r:"Elle choisit mal, mais c'est ta faute",id:"elle-choisit-mal",role:"Jeune femme qui sait précisément ce qu'elle attend d'un partenaire.",traits:"Organisée dans ses attentes, mais tiraillée par ses choix amoureux."},
    {n:"Nathan",r:"Elle choisit mal, mais c'est ta faute",id:"elle-choisit-mal",role:"Le garçon responsable et sincère que Jade dit rechercher.",traits:"Attentionné et fiable ; il finit par remettre en question sa manière d'aimer."},
    {n:"Darel",r:"Elle choisit mal, mais c'est ta faute",id:"elle-choisit-mal",role:"L'homme qui attire Jade malgré ses propres critères.",traits:"Charismatique et imprévisible."},
    {n:"Élodie",r:"La Maison d'en face",id:"la-maison-d-en-face",role:"Épouse de Richard Dossou, puis épouse de Gabriel Ahouansou.",traits:"Ébranlée par un deuil, elle tente de reconstruire sa vie et de comprendre les secrets qui l'entourent."},
    {n:"Richard Dossou",r:"La Maison d'en face",id:"la-maison-d-en-face",role:"Époux d'Élodie ; sa mort mystérieuse déclenche l'intrigue.",traits:"Un homme entouré de secrets et de questions."},
    {n:"Gabriel Ahouansou",r:"La Maison d'en face",id:"la-maison-d-en-face",role:"Second époux d'Élodie.",traits:"Attentionné et énigmatique ; son passé est trouble."},
    {n:"Fridaous",r:"Le Cœur de Fridaous",id:"le-coeur-de-fridaous",role:"Jeune femme qui vit à Cotonou avec sa famille et suit une formation.",traits:"Douce, discrète et réservée, mais déterminée à se construire et à gagner sa vie."},
    {n:"Sessi",r:"Sessi, mon étoile",id:"sessi-mon-etoile",role:"Jeune femme qui rencontre Bénoli lors d'un voyage d'affaires.",traits:"Lumineuse et forte ; elle soutient les autres même lorsqu'elle est fatiguée."},
    {n:"Maman Adjo",r:"Sessi, mon étoile",id:"sessi-mon-etoile",role:"Mère de Sessi.",traits:"Aimante, forte et stricte ; elle prend soin de sa famille."},
    {n:"Bénoli",r:"Sessi, mon étoile",id:"sessi-mon-etoile",role:"Homme rencontré par Sessi lors d'un voyage d'affaires.",traits:"En pleine tempête intérieure au moment de leur rencontre."}
  ];
  const imageRoman = id => {const r=ROMANS.find(x=>x.id===id);return r&&r.couverture?r.couverture:"";};
  const e = s => esc(String(s||""));
  const styles=document.createElement("style");
  styles.textContent=`
  .pers-intro{color:var(--doux);margin:8px 0 18px}
  .pers-grille{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .pers-carte{overflow:hidden;border:1px solid var(--trait);border-radius:16px;background:var(--carte)}
  .pers-img{width:100%;height:128px;object-fit:cover;display:block;filter:saturate(.82)}
  .pers-corps{padding:12px}
  .pers-corps h3{font:700 1.08rem Georgia,serif;margin-bottom:4px}
  .pers-roman{color:var(--or);font-size:.75rem;font-weight:750;line-height:1.35;margin-bottom:8px}
  .pers-corps p{font-size:.84rem;line-height:1.45;margin:6px 0;color:var(--doux)}
  .pers-corps .pbtn{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;max-width:100%;font-size:.76rem;line-height:1.1;padding:9px 10px;margin-top:4px;}
  .pers-corps b{color:var(--encre)}
  .pers-note{font-size:.78rem;color:var(--doux);margin:14px 0 26px}
  .jeu-menu{display:grid;gap:10px;margin:16px 0}
  .jeu-bouton{display:block;width:100%;text-align:left;padding:15px;border-radius:14px;border:1px solid var(--trait);background:var(--carte);color:var(--encre);font:inherit}
  .jeu-bouton b{display:block;font:700 1.05rem Georgia,serif;margin-bottom:4px}
  .jeu-bouton small{color:var(--doux)}
  .jeu-zone{margin:16px 0;padding:16px;border:1px solid var(--trait);border-radius:16px;background:var(--carte)}
  .jeu-rep{display:grid;gap:9px;margin-top:14px}
  .jeu-rep button{font:inherit;text-align:left;padding:12px;border-radius:11px;border:1px solid var(--trait);background:var(--papier);color:var(--encre)}
  .jeu-score{font:700 2.5rem Georgia,serif;color:var(--or)}
  @media(min-width:560px){.pers-grille{grid-template-columns:repeat(3,minmax(0,1fr))}}
  `;
  document.head.appendChild(styles);
  PAGES.personnages=()=>`<h2 class="serif">Les personnages de Benoli</h2>
    <p class="pers-intro">Découvre celles et ceux qui font vivre les histoires : leur rôle, leur tempérament et le roman dans lequel ils apparaissent.</p>
    <div class="pers-grille">${personnages.map(p=>`<article class="pers-carte">${imageRoman(p.id)?`<img class="pers-img" src="${e(imageRoman(p.id))}" alt="Couverture de référence du roman ${e(p.r)}" loading="lazy">`:`<div class="pers-img"></div>`}<div class="pers-corps"><h3>${e(p.n)}</h3><div class="pers-roman">${e(p.r)}</div><p><b>Son rôle :</b> ${e(p.role)}</p><p><b>À retenir :</b> ${e(p.traits)}</p><a class="pbtn" href="#/${e(p.id)}">Voir le roman</a></div></article>`).join("")}</div>
    <p class="pers-note">Les visuels affichés sont les couvertures des romans associés, pas des portraits officiels des personnages. Les descriptions sont limitées aux informations présentes dans les résumés et extraits disponibles.</p>`;
  const nav=document.getElementById("navBas");
  if(nav && !nav.querySelector('[data-n="personnages"]')) nav.insertAdjacentHTML("beforeend",'<a href="#/personnages" data-n="personnages"><span>🎭</span>Personnages</a>');
  const ancienQuiz=PAGES.quiz;
  const banque={
    "Romans de Benoli":[
      ["Qui appelle Benoli « Chéco » ?",["Lénis","Belvida","Jade","Sessi"],0,"Lénis utilise ce surnom depuis leur amitié au collège."],
      ["Quel rêve nourrit Kévin ?",["Devenir footballeur","Devenir médecin","Devenir chanteur","Devenir pilote"],0,"Le football est le rêve de Kévin."],
      ["Quel personnage est la fille d'un ministre ?",["Ermine","Fridaous","Élodie","Mélissa"],0,"Ermine est présentée comme une fille de ministre."],
      ["Qui est l'épouse de Richard Dossou ?",["Élodie","Jade","Belvida","Sessi"],0,"Élodie est l'épouse de Richard."],
      ["Quelle formation Fridaous entreprend-elle d'abord ?",["Informatique","Droit","Cuisine","Comptabilité"],0,"Elle commence par une formation en informatique, puis en sérigraphie."],
      ["Qui rencontre Bénoli lors d'un voyage d'affaires ?",["Sessi","Lénis","Jade","Fridaous"],0,"La rencontre de Sessi et Bénoli a lieu pendant un voyage d'affaires."]
    ],
    "Littérature":[
      ["Comment appelle-t-on la personne qui raconte une histoire ?",["Le narrateur","L'éditeur","Le lecteur","Le correcteur"],0,"Le narrateur est la voix qui raconte le récit."],
      ["Quelle figure de style compare deux éléments avec « comme » ?",["La comparaison","La métaphore","L'hyperbole","L'ironie"],0,"La comparaison établit un rapprochement explicite, souvent avec « comme »."],
      ["Comment appelle-t-on une histoire courte qui se termine souvent par une morale ?",["Une fable","Une saga","Une autobiographie","Un essai"],0,"La fable est un récit bref qui porte souvent une morale."],
      ["Quel est le contraire d'un prologue ?",["Un épilogue","Un dialogue","Un chapitre","Un résumé"],0,"L'épilogue se situe à la fin d'une œuvre."],
      ["Comment nomme-t-on le personnage qui s'oppose au héros ?",["L'antagoniste","Le narrateur","Le figurant","Le lecteur"],0,"L'antagoniste s'oppose au personnage principal."]
    ],
    "Culture générale":[
      ["Quelle est la capitale officielle du Bénin ?",["Porto-Novo","Cotonou","Parakou","Abomey"],0,"Porto-Novo est la capitale officielle du Bénin."],
      ["Combien de côtés possède un hexagone ?",["Six","Cinq","Sept","Huit"],0,"Le préfixe « hexa- » signifie six."],
      ["Quelle planète est surnommée la planète rouge ?",["Mars","Vénus","Jupiter","Mercure"],0,"La couleur rouge de Mars vient notamment de l'oxyde de fer à sa surface."],
      ["Quel océan borde le sud du Bénin ?",["L'océan Atlantique","L'océan Indien","L'océan Arctique","L'océan Pacifique"],0,"Le littoral béninois donne sur le golfe de Guinée, dans l'Atlantique."],
      ["Combien de jours compte une année bissextile ?",["366","365","364","360"],0,"Une année bissextile compte 366 jours."]
    ],
    "Vrai ou faux":[
      ["Un roman est toujours écrit en vers.",["Vrai","Faux"],1,"Faux : un roman est généralement écrit en prose."],
      ["Porto-Novo est la capitale officielle du Bénin.",["Vrai","Faux"],0,"Vrai."],
      ["Une métaphore utilise obligatoirement le mot « comme ».",["Vrai","Faux"],1,"Faux : c'est plutôt un marqueur fréquent de la comparaison."],
      ["Mars est surnommée la planète rouge.",["Vrai","Faux"],0,"Vrai."],
      ["L'épilogue se trouve généralement à la fin d'un récit.",["Vrai","Faux"],0,"Vrai."]
    ],
    "Devine le personnage":[
      ["Je suis l'amie de Benoli depuis le collège et je l'appelle « Chéco ». Qui suis-je ?",["Lénis","Belvida","Jade","Mélissa"],0,"Il s'agit de Lénis."],
      ["Je rêve de devenir footballeur et j'ai quinze ans. Qui suis-je ?",["Kévin","Nathan","Bienvenue","Bénoli"],0,"Il s'agit de Kévin."],
      ["Je suis discrète, douce et je me forme en informatique puis en sérigraphie. Qui suis-je ?",["Fridaous","Sessi","Élodie","Ermine"],0,"Il s'agit de Fridaous."],
      ["Je suis la mère de Sessi. Qui suis-je ?",["Maman Adjo","Lénis","Priscille","Belvida"],0,"Il s'agit de Maman Adjo."],
      ["Je suis l'homme attentionné mais énigmatique qu'épouse Élodie. Qui suis-je ?",["Gabriel Ahouansou","Richard Dossou","Darel","Nathan"],0,"Il s'agit de Gabriel Ahouansou."]
    ],
    "Mot mystère":[
      ["Quel mot désigne la personne qui écrit un roman ?",["Romancier","Lecteur","Libraire","Imprimeur"],0,"Un romancier ou une romancière écrit des romans."],
      ["Quel mot désigne le lieu où se déroule une histoire ?",["Cadre","Morale","Titre","Préface"],0,"Le cadre désigne notamment le lieu et l'époque du récit."],
      ["Quel mot désigne la liste des personnages d'une pièce ?",["Distribution","Bibliographie","Dédicace","Sommaire"],0,"La distribution présente les rôles et les interprètes, notamment au théâtre."],
      ["Quel mot désigne un récit de la vie d'une personne écrit par elle-même ?",["Autobiographie","Biographie","Nouvelle","Fable"],0,"Une autobiographie est le récit de sa propre vie."]
    ]
  };
  const modes=Object.keys(banque);
  PAGES.quiz=()=>ancienQuiz()+`<section class="bloc"><h3 class="serif">D'autres défis à relever</h3><p class="attente">Choisis ton terrain de jeu : romans de Benoli, littérature, culture générale et jeux de réflexion.</p><div class="jeu-menu">${modes.map((m,i)=>`<button class="jeu-bouton" type="button" data-jeu="${i}"><b>${["📚 ","✍️ ","🌍 ","⚖️ ","🕵️ ","🔎 "][i]||"🎯 "}${e(m)}</b><small>${m==="Romans de Benoli"?"Teste ta mémoire des histoires et des héros.":m==="Littérature"?"Explore les mots, les récits et les figures de style.":m==="Culture générale"?"Des questions sur le monde et le Bénin.":m==="Vrai ou faux"?"Décide si l'affirmation est vraie ou fausse.":m==="Devine le personnage"?"Retrouve un personnage grâce aux indices.":"Trouve le bon mot grâce à sa définition."}</small></button>`).join("")}</div><div id="jeuZone"></div></section>`;
  let partie=null;
  document.addEventListener("click",ev=>{
    const b=ev.target.closest("[data-jeu]"); if(!b)return;
    const cat=modes[+b.dataset.jeu],liste=banque[cat].slice().sort(()=>Math.random()-.5).slice(0,5);
    partie={cat,liste,i:0,score:0,termine:false};
    afficherQuestion();
  });
  function afficherQuestion(){
    const z=document.getElementById("jeuZone");if(!z||!partie)return;
    if(partie.i>=partie.liste.length){z.innerHTML=`<div class="jeu-zone"><p class="qmeta">Résultat · ${e(partie.cat)}</p><div class="jeu-score">${partie.score}/${partie.liste.length}</div><p>${partie.score===partie.liste.length?"Excellent ! Sans faute.":partie.score>=3?"Bravo, belle performance !":"Continue à jouer pour progresser !"}</p><button class="btn sec" type="button" data-jeu="${modes.indexOf(partie.cat)}">Rejouer</button></div>`;return;}
    const q=partie.liste[partie.i];partie.termine=false;
    z.innerHTML=`<div class="jeu-zone"><p class="qmeta">${e(partie.cat)} · Question ${partie.i+1}/${partie.liste.length}</p><div class="qbar"><i style="width:${partie.i/partie.liste.length*100}%"></i></div><h3 class="serif qtitre">${e(q[0])}</h3><div class="jeu-rep">${q[1].map((x,k)=>`<button type="button" data-reponse="${k}">${e(x)}</button>`).join("")}</div><div id="jeuFeedback"></div></div>`;
  }
  document.addEventListener("click",ev=>{
    const b=ev.target.closest("[data-reponse]");if(!b||!partie||partie.termine)return;
    partie.termine=true;const q=partie.liste[partie.i],k=+b.dataset.reponse;
    if(k===q[2])partie.score++;
    document.querySelectorAll("#jeuZone [data-reponse]").forEach((x,i)=>{x.disabled=true;if(i===q[2])x.classList.add("ok");else if(i===k)x.classList.add("non");});
    const fb=document.getElementById("jeuFeedback");
    fb.innerHTML=`<div class="qfb"><b>${k===q[2]?"Bonne réponse ✓":"Pas tout à fait"}</b><br>${e(q[3])}</div><button class="btn" type="button" data-suite-jeu>Question suivante</button>`;
  });
  document.addEventListener("click",ev=>{
    if(!ev.target.closest("[data-suite-jeu]")||!partie)return;
    partie.i++;afficherQuestion();
  });
  if(nav)window.addEventListener("hashchange",()=>{if(location.hash==="#/personnages"||location.hash==="#/quiz")nav.querySelectorAll("a").forEach(a=>a.classList.toggle("actif",a.dataset.n===(location.hash==="#/quiz"?"quiz":location.hash==="#/personnages"?"personnages":"")));});
  if(typeof aRepondre==="function"){
    const prev=aRepondre;aRepondre=function(t){const q=norm(t);if(q.includes("personnage"))return '<p>Découvre <a href="#/personnages">les personnages des romans de Benoli</a>.</p>';return prev(t);};
  }
})();