/* Compte lecteur Benoli — authentification Supabase */
(function(){
 "use strict";
 if(window.__benoliProfilReady)return;window.__benoliProfilReady=true;
 const SUPABASE_URL="https://vkklycmarmixcxgasyeg.supabase.co";
 const SUPABASE_KEY="sb_publishable_6qCf1CHlpHhx33l_1QJhwA_w2RSLMbH";
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 let client=null, loading=null, busy=false;
 const status=(s,kind="info")=>{const el=document.getElementById("bp-status");if(el){el.className="bp-status "+kind;el.textContent=s}};
 const mode=()=>{try{return new URLSearchParams(location.hash.split("?")[1]||"").get("mode")==="signup"?"signup":"login"}catch(_){return "login"}};
 const loadClient=()=>{
  if(client)return Promise.resolve(client);
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
   const ready=()=>{try{if(!window.supabase?.createClient)throw new Error("La bibliothèque de connexion n'est pas disponible.");client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});resolve(client)}catch(e){reject(e)}};
   if(window.supabase?.createClient)return ready();
   const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.min.js";s.onload=ready;s.onerror=()=>reject(new Error("Connexion au service impossible. Vérifie ta connexion Internet."));document.head.appendChild(s);
  }).catch(e=>{loading=null;throw e});
  return loading;
 };
 const profileHtml=(u,p)=>'<section class="bp"><h2 class="serif">Bienvenue, '+esc(p?.pseudonym||u.user_metadata?.pseudonym||u.email?.split("@")[0]||"lecteur")+' !</h2><p>Ton compte lecteur Benoli est connecté.</p><p><b>Adresse e-mail :</b> '+esc(u.email||"—")+'</p><p><b>Pseudonyme :</b> '+esc(p?.pseudonym||u.user_metadata?.pseudonym||"—")+'</p><p><b>Téléphone :</b> '+esc(p?.phone||"Non renseigné")+'</p><div class="bp-links"><a href="#/favoris">❤️ Mes favoris</a><a href="#/carnet">📔 Mon carnet de lecture</a></div><p class="bp-note">Ton compte est lié à ton adresse e-mail. Tu peux te connecter depuis un autre appareil avec les mêmes identifiants.</p><button class="btn off" id="bp-logout" type="button">Se déconnecter</button></section>';
 const authHtml=()=>'<section class="bp"><h2 class="serif">'+(mode()==="signup"?"Créer mon compte lecteur":"Connexion à mon compte")+'</h2><p>'+(mode()==="signup"?"Rejoins la communauté Benoli et retrouve ton profil sur tes appareils.":"Retrouve ton espace lecteur avec ton adresse e-mail et ton mot de passe.")+'</p><div class="bp-switch"><a href="#/profil?mode=login" '+(mode()==="login"?'aria-current="page"':'')+'>Connexion</a><a href="#/profil?mode=signup" '+(mode()==="signup"?'aria-current="page"':'')+'>Inscription</a></div><form id="bp-form">'+(mode()==="signup"?'<label>Pseudonyme *<input id="bp-name" maxlength="30" minlength="2" autocomplete="nickname" required placeholder="Ton pseudonyme"></label>':'')+'<label>Adresse e-mail *<input id="bp-email" type="email" autocomplete="email" required placeholder="exemple@email.com"></label><label>Mot de passe *<input id="bp-password" type="password" minlength="8" autocomplete="'+(mode()==="signup"?"new-password":"current-password")+'" required placeholder="8 caractères minimum"></label>'+(mode()==="signup"?'<label>Téléphone (facultatif)<input id="bp-phone" type="tel" autocomplete="tel" placeholder="+229 …"></label>':'')+'<button class="btn" type="submit">'+(mode()==="signup"?"Créer mon compte":"Me connecter")+'</button></form>'+(mode()==="login"?'<button class="bp-reset" id="bp-reset" type="button">Mot de passe oublié ?</button>':'')+'<p id="bp-status" class="bp-status" role="status" aria-live="polite">Connexion sécurisée par Supabase.</p><p class="bp-note">Ne partage jamais ton mot de passe ni les codes reçus par e-mail ou SMS.</p></section>';
 const page=()=>{
  queueMicrotask(render);
  const root='<section class="bp"><p id="bp-status" class="bp-status" role="status" aria-live="polite">Vérification de ton compte…</p></section>';
  return root;
 };
 const render=async()=>{
  const target=document.querySelector("#ficheContenu .page");if(!target)return;
  target.innerHTML=page();
  try{
   const sb=await loadClient();const {data:{session},error}=await sb.auth.getSession();if(error)throw error;
   if(session){
    const u=session.user;let {data:p,error:pe}=await sb.from("reader_profiles").select("pseudonym,phone").eq("id",u.id).maybeSingle();
    if(pe)throw pe;
    if(!p){const pseudo=u.user_metadata?.pseudonym||u.email?.split("@")[0]||"Lecteur";const ins=await sb.from("reader_profiles").upsert({id:u.id,pseudonym:pseudo,phone:u.user_metadata?.phone||null},{onConflict:"id"}).select("pseudonym,phone").single();if(ins.error)throw ins.error;p=ins.data}
    target.innerHTML=profileHtml(u,p);
   }else target.innerHTML=authHtml();
  }catch(e){const el=document.getElementById("bp-status");if(el){el.className="bp-status error";el.textContent="Impossible de charger ton espace : "+(e.message||"erreur inconnue")+". Réessaie dans un instant."}}
 };
 const st=document.createElement("style");st.textContent='.bp{padding:8px 0 30px;max-width:560px;margin:auto}.bp h2{font-size:1.8rem;margin-bottom:10px}.bp>p{color:var(--doux);margin:10px 0}.bp form{display:grid;gap:14px;margin-top:16px}.bp form label{display:grid;gap:6px;font-weight:650}.bp input{width:100%;padding:12px;border:1px solid var(--trait);border-radius:10px;background:var(--carte);color:var(--encre);font:inherit}.bp-switch{display:flex;gap:8px;margin:18px 0}.bp-switch a{flex:1;text-align:center;padding:10px;border:1px solid var(--trait);border-radius:999px;text-decoration:none;font-weight:750}.bp-switch a[aria-current=page]{background:linear-gradient(120deg,#ffd56b,#ff941d);color:#21142b;border-color:#ffe1a0}.bp-status{padding:12px;margin:14px 0;border-radius:10px;background:rgba(150,150,180,.12);font-size:.9rem}.bp-status.error{background:rgba(190,60,60,.12);color:#e58c8c}.bp-status.success{background:rgba(40,150,90,.13);color:#72d49a}.bp-note{font-size:.85rem;color:var(--doux)}.bp-reset{margin-top:12px;border:0;background:none;color:var(--vert);text-decoration:underline;font:inherit;cursor:pointer}.bp-links{display:grid;gap:10px;margin:18px 0}.bp-links a{padding:13px;border:1px solid var(--trait);border-radius:10px;text-decoration:none;color:var(--vert);font-weight:700}';document.head.appendChild(st);
 if(typeof PAGES!=="undefined")PAGES.profil=page;
 window.addEventListener("hashchange",()=>{if(/^#\/profil(?:\?|$)/.test(location.hash))render()});
 document.addEventListener("submit",async e=>{
  if(e.target.id!=="bp-form")return;e.preventDefault();if(busy)return;busy=true;
  const btn=e.target.querySelector('button[type="submit"]');if(btn){btn.disabled=true;btn.textContent="Patiente…"}
  try{
   const sb=await loadClient(),email=document.getElementById("bp-email").value.trim(),password=document.getElementById("bp-password").value;
   if(mode()==="signup"){
    const pseudonym=document.getElementById("bp-name").value.trim(),phone=document.getElementById("bp-phone").value.trim();
    if(pseudonym.length<2)throw new Error("Le pseudonyme doit contenir au moins 2 caractères.");
    const {data,error}=await sb.auth.signUp({email,password,options:{data:{pseudonym,phone}}});if(error)throw error;
    if(data.session){const saved=await sb.from("reader_profiles").upsert({id:data.user.id,pseudonym,phone:phone||null},{onConflict:"id"});if(saved.error)throw saved.error;await render()}
    else{const target=document.querySelector("#ficheContenu .page");if(target){target.innerHTML=authHtml();status("Compte créé ! Consulte ta boîte e-mail et clique sur le lien de confirmation avant de te connecter.","success")}}
   }else{
    const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;
    const meta=data.user.user_metadata||{},pseudo=meta.pseudonym||data.user.email.split("@")[0],phone=meta.phone||null;
    const saved=await sb.from("reader_profiles").upsert({id:data.user.id,pseudonym:pseudo,phone},{onConflict:"id"});if(saved.error)throw saved.error;
    await render();
   }
  }catch(err){status(err.message||"Une erreur est survenue.","error")}
  finally{busy=false;const b=document.querySelector('#bp-form button[type="submit"]');if(b)b.disabled=false}
 });
 document.addEventListener("click",async e=>{
  if(e.target.closest("#bp-logout")){try{const sb=await loadClient();const {error}=await sb.auth.signOut();if(error)throw error;location.hash="#/profil?mode=login"}catch(err){alert(err.message||"Déconnexion impossible.")}}
  if(e.target.closest("#bp-reset")){const email=document.getElementById("bp-email")?.value.trim();if(!email){status("Saisis d'abord ton adresse e-mail.","error");return}try{const sb=await loadClient();const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname+"#/profil?mode=login"});if(error)throw error;status("Si cette adresse correspond à un compte, un e-mail de réinitialisation sera envoyé.","success")}catch(err){status(err.message||"Envoi impossible.","error")}}
 });
 const menu=document.getElementById("benoliMenu");if(menu&&!menu.querySelector('[href="#/profil"]')){const a=document.createElement("a");a.className="bm-lien";a.href="#/profil";a.textContent="👤 Mon profil lecteur";const foot=menu.querySelector(".bm-bas");if(foot)menu.insertBefore(a,foot);else menu.appendChild(a)}
})();