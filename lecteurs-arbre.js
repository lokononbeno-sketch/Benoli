/* BENOLI — Lecteurs animés de l'arbre d'accueil. Animation décorative, sans appel réseau. */
(function(){
 "use strict";
 const scene=document.getElementById("benoli-lecteur-scene");
 if(!scene)return;
 const lecteurs=[
  {skin:"#8a5238",hair:"#17120f",shirt:"#176b45",pants:"#c7a46b",shoe:"#e9eee5",hairShape:"M78 49 Q82 17 111 20 Q143 18 146 51 L138 59 Q109 47 83 59Z"},
  {skin:"#6f402f",hair:"#211713",shirt:"#c65c2d",pants:"#34343c",shoe:"#a94b4b",hairShape:"M77 48 Q79 16 111 17 Q144 19 145 50 L136 56 Q108 42 84 57Z"},
  {skin:"#925d42",hair:"#231a15",shirt:"#e8dfc9",pants:"#263d58",shoe:"#9a633b",hairShape:"M80 49 Q84 18 111 19 Q139 18 143 49 L136 56 Q111 48 85 56Z"},
  {skin:"#75452f",hair:"#1a1717",shirt:"#3676b6",pants:"#59683b",shoe:"#e6e9ec",hairShape:"M77 48 Q82 18 111 18 Q142 18 145 48 L138 56 Q111 45 84 57Z"}
 ];
 function svg(p){return '<svg class="benoli-lecteur-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"><ellipse cx="110" cy="204" rx="75" ry="9" fill="#10251c" opacity=".42"/><g class="benoli-lecteur-corps"><path d="M72 143 Q42 151 39 178 Q61 197 105 195 L119 180 104 158Z" fill="'+p.pants+'"/><path d="M116 158 Q145 151 170 169 Q185 183 165 196 L111 196 99 181Z" fill="'+p.pants+'"/><path d="M41 178 Q54 171 72 180 L91 198 Q82 210 60 204 L35 192Z" fill="'+p.shoe+'"/><path d="M146 181 Q165 174 179 186 L184 199 Q171 209 147 202 L128 193Z" fill="'+p.shoe+'"/><path d="M79 92 Q109 79 139 94 L151 153 Q113 174 69 151Z" fill="'+p.shirt+'"/><path d="M88 96 Q72 105 67 129 L83 137 99 111Z M135 98 Q154 107 158 128 L143 139 126 112Z" fill="'+p.skin+'"/><path d="M90 89 Q109 79 130 90 L131 105 Q110 119 89 104Z" fill="'+p.skin+'"/><ellipse cx="110" cy="63" rx="31" ry="37" fill="'+p.skin+'"/><path d="'+p.hairShape+'" fill="'+p.hair+'"/><path d="M91 66 Q98 70 104 66 M116 66 Q123 70 130 66" fill="none" stroke="#241914" stroke-width="3" stroke-linecap="round"/><path d="M104 83 Q111 87 119 82" fill="none" stroke="#542d23" stroke-width="2.5" stroke-linecap="round"/><path d="M82 115 Q109 103 138 116 L146 141 Q112 153 75 139Z" fill="#f0e7d6" stroke="#c5b79f" stroke-width="2"/><path d="M110 109 L110 148" stroke="#b8a78e" stroke-width="2"/><path d="M80 121 Q91 112 101 120 L109 139 98 146 80 134Z M138 121 Q127 112 117 120 L111 139 123 146 141 134Z" fill="'+p.skin+'"/><path d="M83 119 L110 111 138 119 132 151 87 151Z" fill="#6a432e" stroke="#e7d2ad" stroke-width="2"/><path d="M110 113 L110 149" stroke="#d9c39e" stroke-width="2"/><path d="M88 124 L106 120 M114 120 L132 124" stroke="#f1e6d1" stroke-width="1.5"/></g></svg>';}
 let index=0,timer=0;
 function next(){
  if(document.hidden){timer=setTimeout(next,2500);return;}
  scene.className="benoli-lecteur-scene entree";scene.innerHTML=svg(lecteurs[index++%lecteurs.length]);
  timer=setTimeout(()=>{scene.className="benoli-lecteur-scene sortie";timer=setTimeout(()=>{scene.innerHTML="";scene.className="benoli-lecteur-scene";timer=setTimeout(next,900);},1300);},15000);
 }
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!scene.innerHTML)next();});
 timer=setTimeout(next,1200);
})();