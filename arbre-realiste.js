/* BENOLI LITTÉRAIRE — L'arbre réaliste de l'accueil
   Remplace l'arbre SVG par un arbre dessiné par le code (canvas) :
   tronc et branches avec écorce, racines, feuillage en couches, vent,
   lumière du couchant, feuilles qui tombent, lucioles, herbe.
   Les livres tournent désormais en vraie orbite : ils passent derrière
   puis devant l'arbre, toujours à l'endroit.
   Si le canvas n'est pas disponible, l'ancien arbre SVG reste affiché. */
(function(){
"use strict";
const hero=document.getElementById("benoli-arbre-accueil");
const scene=hero&&hero.querySelector(".benoli-arbre-scene");
if(!scene||scene.querySelector(".benoli-arbre-canvas"))return;
const ancienSvg=scene.querySelector(".benoli-arbre-svg");
const cv=document.createElement("canvas");
const ctx=cv.getContext&&cv.getContext("2d");
if(!ctx)return;

const reduit=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);
const PI2=Math.PI*2,DW=570,DH=390,CX=285,GY=352;   // repère de dessin
const LX=.72,LY=-.69;                              // direction de la lumière : soleil bas, à droite
const HAUT=-Math.PI/2;

/* ---------- outils ---------- */
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const hsl=(h,s,l,a)=>"hsla("+Math.round(h)+","+Math.round(s)+"%,"+Math.round(l)+"%,"+(a==null?1:a)+")";
const mk=(w,h)=>{const c=document.createElement("canvas");c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c};

/* ---------- styles ---------- */
const style=document.createElement("style");style.id="benoli-arbre-realiste-style";
style.textContent=[
".benoli-arbre-scene{width:100%}",
(hero.querySelector(".benoli-arbre-texte")?"":"@media(min-width:620px){.benoli-arbre-hero{grid-template-columns:1fr}}"),
".benoli-arbre-canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;z-index:2;opacity:0;transition:opacity 1.1s ease;touch-action:pan-y}",
".benoli-arbre-canvas.pret{opacity:1}",
".benoli-arbre-hero::before{content:\"\";position:absolute;inset:0;z-index:-1;pointer-events:none;background:",
"radial-gradient(ellipse 34% 30% at 76% 30%,rgba(255,186,112,.26),rgba(255,150,96,.08) 55%,transparent 75%),",
"radial-gradient(ellipse 52% 36% at 50% 52%,rgba(120,150,96,.16),transparent 72%),",
"radial-gradient(ellipse 70% 22% at 50% 96%,rgba(86,128,92,.28),transparent 74%),",
"radial-gradient(circle at 12% 16%,rgba(255,244,222,.85) 0 1px,transparent 2px),radial-gradient(circle at 23% 9%,rgba(255,244,222,.6) 0 1px,transparent 2px),radial-gradient(circle at 88% 12%,rgba(255,244,222,.7) 0 1px,transparent 2px),radial-gradient(circle at 94% 33%,rgba(255,244,222,.5) 0 1px,transparent 2px),radial-gradient(circle at 6% 42%,rgba(255,244,222,.55) 0 1px,transparent 2px),radial-gradient(circle at 40% 6%,rgba(255,244,222,.5) 0 1px,transparent 2px);animation:benoli-lueur 10s ease-in-out infinite alternate}",
"@keyframes benoli-lueur{from{opacity:.82}to{opacity:1}}",
".benoli-arbre-scene::after{content:\"\";position:absolute;left:-12%;right:-12%;bottom:0;height:30%;z-index:3;pointer-events:none;background:radial-gradient(ellipse 46% 60% at 28% 100%,rgba(160,186,170,.2),transparent 72%),radial-gradient(ellipse 42% 52% at 74% 100%,rgba(160,172,196,.15),transparent 72%);-webkit-mask-image:linear-gradient(90deg,transparent 14%,#000 38%,#000 62%,transparent 86%);mask-image:linear-gradient(90deg,transparent 14%,#000 38%,#000 62%,transparent 86%);animation:benoli-brume 16s ease-in-out infinite alternate}",
"@keyframes benoli-brume{from{transform:translateX(-3%)}to{transform:translateX(3%)}}",
".benoli-arbre-vent{display:none}",
"@media(prefers-reduced-motion:reduce){.benoli-arbre-hero::before,.benoli-arbre-scene::after{animation:none}}"
].join("");
document.head.appendChild(style);
cv.className="benoli-arbre-canvas";cv.setAttribute("aria-hidden","true");
(ancienSvg?ancienSvg.insertAdjacentElement("afterend",cv):scene.appendChild(cv));

/* ---------- géométrie de l'arbre ---------- */
function fabBranche(pts,prof){
  const b={pts,prof,cum:[0],w0:pts[0].w,w1:pts[pts.length-1].w};
  for(let i=1;i<pts.length;i++)b.cum.push(b.cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));
  b.long=b.cum[b.cum.length-1]||1;return b;
}
function echant(b,u){
  const L=b.long*clamp(u,0,1);let i=1;
  while(i<b.cum.length-1&&b.cum[i]<L)i++;
  const s=(L-b.cum[i-1])/Math.max(1e-6,b.cum[i]-b.cum[i-1]),p=b.pts[i-1],q=b.pts[i];
  return{x:lerp(p.x,q.x,s),y:lerp(p.y,q.y,s),w:lerp(p.w,q.w,s),a:Math.atan2(q.y-p.y,q.x-p.x)};
}
function construireArbre(R){
  const branches=[];
  const vers=(a,c,k)=>{let d=c-a;d=((d+Math.PI)%PI2+PI2)%PI2-Math.PI;return a+d*k};
  function pousser(x,y,ang,long,w0,w1,prof,o){
    o=o||{};const n=Math.max(6,Math.round(long/6)),pas=long/n,ph=R()*6.28,pts=[{x,y,w:w0}];let a=ang;
    for(let i=1;i<=n;i++){
      const t=i/n;
      a+=(R()-.5)*(o.courbe||.2)+Math.sin(t*3.1+ph)*(o.ondule||0);
      if(o.vers!=null)a=vers(a,o.vers,o.k||.02);
      x+=Math.cos(a)*pas;y+=Math.sin(a)*pas;
      pts.push({x,y,w:lerp(w0,w1,Math.pow(t,o.aff||1))});
    }
    const b=fabBranche(pts,prof);branches.push(b);return b;
  }
  const tronc=pousser(CX,GY+3,HAUT+.03,142,31,16,0,{courbe:.1,ondule:.04,vers:HAUT,k:.03,aff:.8});
  const grandes=[];
  const sortie=(parent,u,dAng,long,w,fin)=>{
    const p=echant(parent,u);
    return pousser(p.x,p.y,p.a+dAng,long,w,fin,1,{courbe:.26,vers:HAUT,k:.011,aff:.9});
  };
  grandes.push(sortie(tronc,1,-.52,108,15,5.2));
  grandes.push(sortie(tronc,1,.48,104,14.5,5));
  grandes.push(sortie(tronc,1,-.04,92,12.5,4.6));
  grandes.push(sortie(tronc,.56,-.96,86,10,4));
  grandes.push(sortie(tronc,.66,.92,88,10,4));
  const moyennes=[],fines=[];
  grandes.forEach(g=>{
    [.34,.54,.74].forEach((u,i)=>{
      const p=echant(g,u),cote=(i+(R()<.5?0:1))%2?1:-1;
      moyennes.push(pousser(p.x,p.y,p.a+cote*(.5+R()*.38),(44+R()*18)*(1.1-u*.35),p.w*.62,1.7,2,{courbe:.34,vers:HAUT,k:.01}));
    });
    const e=echant(g,1);
    [-1,1].forEach(c=>moyennes.push(pousser(e.x,e.y,e.a+c*(.38+R()*.12),44+R()*12,Math.max(3,e.w*.9),1.5,2,{courbe:.3,vers:HAUT,k:.012})));
  });
  moyennes.forEach(m=>{
    [.42,.72].forEach(u=>{
      const p=echant(m,u),c=R()<.5?1:-1;
      fines.push(pousser(p.x,p.y,p.a+c*(.55+R()*.45),24+R()*10,Math.max(1.2,p.w*.62),.5,3,{courbe:.4,vers:HAUT,k:.008}));
    });
    const e=echant(m,1);
    [-1,1].forEach(c=>fines.push(pousser(e.x,e.y,e.a+c*(.42+R()*.2),22+R()*9,Math.max(1.1,e.w),.5,3,{courbe:.4,vers:HAUT,k:.008})));
  });
  /* racines */
  const racines=[];
  [[-1,6,22,44,14],[-1,3,12,26,10],[1,6,24,48,14],[1,3,14,30,10],[-1,9,34,64,8],[1,9,36,70,8]].forEach(r=>{
    const d=r[0],pts=[];
    for(let i=0;i<=10;i++){
      const t=i/10,P0=[CX+d*r[1],GY-30],P1=[CX+d*r[2],GY+3],P2=[CX+d*r[3],GY+7+R()*2];
      pts.push({x:(1-t)*(1-t)*P0[0]+2*(1-t)*t*P1[0]+t*t*P2[0],y:(1-t)*(1-t)*P0[1]+2*(1-t)*t*P1[1]+t*t*P2[1],w:lerp(r[4],1.6,Math.pow(t,.8))});
    }
    racines.push(fabBranche(pts,-1));
  });
  return{tronc,grandes,moyennes,fines,racines,toutes:racines.concat([tronc],grandes,moyennes,fines)};
}

/* ---------- dessin du bois ---------- */
function dessinerBranche(g,b){
  const pts=b.pts;
  for(let i=0;i<pts.length-1;i++){
    const p=pts[i],q=pts[i+1],dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
    const pre=pts[i-1]||p,suiv=pts[i+2]||q;
    let n0x=-(q.y-pre.y),n0y=q.x-pre.x,m0=Math.hypot(n0x,n0y)||1;n0x/=m0;n0y/=m0;
    let n1x=-(suiv.y-p.y),n1y=suiv.x-p.x,m1=Math.hypot(n1x,n1y)||1;n1x/=m1;n1y/=m1;
    const mx=(p.x+q.x)/2,my=(p.y+q.y)/2,w=(p.w+q.w)/2;
    const nl=nx*LX+ny*LY,cote=nl>=0?1:-1,fo=Math.abs(nl),h=.5+.3*fo;
    const gr=g.createLinearGradient(mx-cote*nx*w/2,my-cote*ny*w/2,mx+cote*nx*w/2,my+cote*ny*w/2);
    gr.addColorStop(0,"#1b1320");gr.addColorStop(h*.5,"#3a2a25");gr.addColorStop(h,hsl(30,40,28+22*fo));
    gr.addColorStop(Math.min(.98,h+.2),"#6e4f36");gr.addColorStop(1,"#3f2e28");
    let al=1;if(b.prof>0)al=clamp(b.cum[i]/(b.w0*1.4+2),.18,1);
    g.globalAlpha=al;g.fillStyle=gr;
    g.beginPath();
    g.moveTo(p.x+n0x*p.w/2,p.y+n0y*p.w/2);
    g.lineTo(q.x+ux*.7+n1x*q.w/2,q.y+uy*.7+n1y*q.w/2);
    g.lineTo(q.x+ux*.7-n1x*q.w/2,q.y+uy*.7-n1y*q.w/2);
    g.lineTo(p.x-n0x*p.w/2,p.y-n0y*p.w/2);
    g.closePath();g.fill();
  }
  g.globalAlpha=1;
}
function ecorce(g,b,R){
  if(b.prof>1&&b.w0<4)return;
  const dens=b.prof<=0?1:b.prof===1?.7:.35,n=Math.round(b.long*b.w0/30*dens);
  g.lineCap="round";
  for(let k=0;k<n;k++){
    const clair=R()<.34,u0=R()*.96,du=(10+R()*34)/b.long,off0=(R()-.5)*.9,p0=echant(b,u0);
    const cote=(-Math.sin(p0.a)*LX+Math.cos(p0.a)*LY)>=0?1:-1;
    g.beginPath();let dep=false;
    for(let j=0;j<=5;j++){
      const u=u0+du*j/5;if(u>1)break;
      const p=echant(b,u),nx=-Math.sin(p.a),ny=Math.cos(p.a);
      const o=(clair?cote*(.12+R()*.2):off0)+Math.sin(j*1.3+k)*.025;
      const px=p.x+nx*o*p.w,py=p.y+ny*o*p.w;
      dep?g.lineTo(px,py):(g.moveTo(px,py),dep=true);
    }
    g.strokeStyle=clair?"rgba(222,176,120,"+(.1+R()*.15)+")":"rgba(10,6,8,"+(.3+R()*.32)+")";
    g.lineWidth=(.45+R()*.95)*Math.min(1.6,b.w0/13);g.stroke();
  }
}
function dessinerBois(g,arbre,R){
  arbre.racines.forEach(b=>dessinerBranche(g,b));
  [arbre.tronc].concat(arbre.grandes,arbre.moyennes,arbre.fines).forEach(b=>dessinerBranche(g,b));
  arbre.racines.forEach(b=>ecorce(g,b,R));
  [arbre.tronc].concat(arbre.grandes,arbre.moyennes).forEach(b=>ecorce(g,b,R));
  /* nœuds du tronc */
  [[.22,1],[.42,-1],[.62,1]].forEach(([u,c])=>{
    const p=echant(arbre.tronc,u),nx=-Math.sin(p.a),ny=Math.cos(p.a),x=p.x+nx*c*p.w*.22,y=p.y+ny*c*p.w*.22;
    g.save();g.translate(x,y);g.rotate(p.a);
    g.fillStyle="rgba(120,86,58,.5)";g.beginPath();g.ellipse(0,0,4.6,2.6,0,0,PI2);g.fill();
    g.fillStyle="rgba(14,8,8,.78)";g.beginPath();g.ellipse(0,.3,3,1.6,0,0,PI2);g.fill();
    g.restore();
  });
  /* mousse sur le côté à l'ombre, à la base du tronc et sur les grosses branches */
  for(let i=0;i<14;i++){
    const b=i<9?arbre.tronc:arbre.grandes[i%arbre.grandes.length],p=echant(b,i<9?R()*.5:.2+R()*.6);
    const nx=-Math.sin(p.a),ny=Math.cos(p.a),cote=(nx*LX+ny*LY)>=0?-1:1,r=3+R()*5;
    const x=p.x+nx*cote*p.w*(.18+R()*.3),y=p.y+ny*cote*p.w*(.18+R()*.3);
    const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,"rgba(98,140,64,.34)");gr.addColorStop(1,"rgba(60,100,50,0)");
    g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,PI2);g.fill();
  }
}

/* ---------- sol, herbe, pierres, fleurs ---------- */
function dessinerSol(g,R,gR){
  g.save();g.translate(CX-36,GY+9);g.scale(1,.085);
  let gr=g.createRadialGradient(0,0,6,0,0,gR*.7);gr.addColorStop(0,"rgba(4,6,12,.62)");gr.addColorStop(1,"rgba(4,6,12,0)");
  g.fillStyle=gr;g.beginPath();g.arc(0,0,gR*.7,0,PI2);g.fill();g.restore();
  g.save();g.translate(CX,GY+10);g.scale(1,.11);
  gr=g.createRadialGradient(0,0,10,0,0,gR);gr.addColorStop(0,"rgba(40,62,42,.96)");gr.addColorStop(.55,"rgba(26,44,36,.8)");gr.addColorStop(1,"rgba(14,26,28,0)");
  g.fillStyle=gr;g.beginPath();g.arc(0,0,gR,0,PI2);g.fill();g.restore();
  g.lineCap="round";
  for(let i=0;i<300;i++){
    const gx=(R()+R()+R()-1.5)*gR*.64,x=CX+gx,y=GY+2+R()*16,h=5+R()*11,lean=(R()-.5)*7+gx*.012;
    const lum=19+R()*13+(gx>0?4:0);
    g.strokeStyle=hsl(98+R()*24,30+R()*14,lum);g.lineWidth=.8+R()*.8;
    g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+lean*.4,y-h*.6,x+lean,y-h);g.stroke();
  }
  [[CX+74,GY+13,11,6],[CX-96,GY+11,7,4],[CX+108,GY+10,8,4.4],[CX-30,GY+15,5,3]].forEach(s=>{
    const gp=g.createRadialGradient(s[0]+s[2]*.3,s[1]-s[3]*.5,1,s[0],s[1],s[2]*1.1);
    gp.addColorStop(0,"hsl(250,10%,46%)");gp.addColorStop(1,"hsl(252,14%,14%)");
    g.fillStyle=gp;g.beginPath();g.ellipse(s[0],s[1],s[2],s[3],0,0,PI2);g.fill();
  });
  for(let i=0;i<16;i++){
    const x=CX+(R()-.5)*gR*1.5,y=GY+6+R()*14,h=7+R()*8,col=["#f4e8c8","#f0b8ca","#f4cd6c","#ffffff"][i%4];
    g.strokeStyle="hsl(110,40%,30%)";g.lineWidth=.8;g.beginPath();g.moveTo(x,y);g.lineTo(x+(R()-.5)*3,y-h);g.stroke();
    g.fillStyle=col;g.beginPath();g.arc(x,y-h,1.5+R()*.8,0,PI2);g.fill();
  }
}

/* ---------- feuillage : amas de feuilles pré-dessinés ---------- */
const TS=116;
function feuille(g,x,y,ang,L,Wd,col,hi){
  g.save();g.translate(x,y);g.rotate(ang);
  g.beginPath();g.moveTo(0,0);g.bezierCurveTo(L*.22,-Wd,L*.68,-Wd*.82,L,0);g.bezierCurveTo(L*.68,Wd*.82,L*.22,Wd,0,0);g.closePath();
  g.fillStyle=col;g.fill();
  g.beginPath();g.moveTo(0,0);g.bezierCurveTo(L*.22,-Wd,L*.68,-Wd*.82,L,0);g.closePath();
  g.fillStyle=hi;g.fill();
  g.restore();
}
function sprite(seed,niveau,dens){
  const R=rng(seed),c=mk(TS*dens,TS*dens),g=c.getContext("2d");
  g.scale(dens,dens);g.translate(TS/2,TS/2);
  const mult=niveau==="sombre"?.44:niveau==="moyen"?.74:1;
  const gr=g.createRadialGradient(0,0,2,0,0,34);
  gr.addColorStop(0,hsl(168,36,niveau==="clair"?15:10,.96));gr.addColorStop(.72,hsl(155,32,12,.86));gr.addColorStop(1,hsl(150,30,10,0));
  g.fillStyle=gr;g.beginPath();g.ellipse(0,0,36,30,0,0,PI2);g.fill();
  const F=[],N=niveau==="sombre"?230:270;
  for(let i=0;i<N;i++){
    const r=40*Math.pow(R(),.62),a=R()*PI2,x=Math.cos(a)*r,y=Math.sin(a)*r*.82;
    const dl=(x*LX+y*LY)/40,f=clamp(.46+.4*dl+(R()-.5)*.42-r/40*.08,0,1)*mult;
    F.push({x,y,f,a:Math.atan2(y,x)+(R()-.5)*2.6+(y>0?.25:0)});
  }
  F.sort((p,q)=>p.f-q.f);
  F.forEach(o=>{
    let h=lerp(160,94,Math.min(1,o.f/mult*mult))+(R()-.5)*14,s=lerp(26,47,o.f),l=lerp(9,47,o.f);
    if(niveau!=="sombre"&&o.f>.66&&R()<.15){h=64+R()*14;s=62;l=50+R()*8}
    if(niveau==="sombre"){h+=8;s-=6}
    const L=8+R()*5,Wd=L*(.36+R()*.07);
    feuille(g,o.x,o.y,o.a,L,Wd,hsl(h,s,l),hsl(h+6,s+4,l+10,.55));
  });
  return c;
}
function spriteBrillance(seed,dens){
  const R=rng(seed),c=mk(TS*dens,TS*dens),g=c.getContext("2d");
  g.scale(dens,dens);g.translate(TS/2,TS/2);
  for(let i=0;i<40;i++){
    const r=36*Math.pow(R(),.55),a=-.7+(R()-.5)*3.2,x=Math.cos(a)*r,y=Math.sin(a)*r*.8;
    if(x*LX+y*LY<4)continue;
    feuille(g,x,y,R()*PI2,6+R()*5,2.6+R()*1.2,hsl(66+R()*20,70,66+R()*10,.9),hsl(60,80,80,.8));
  }
  return c;
}
function genererInstances(arbre,R){
  const pts=[];
  arbre.fines.forEach(b=>{
    pts.push(echant(b,1));
    const n=R()<.7?1:2;
    for(let k=0;k<n;k++){const p=echant(b,.55+R()*.35);pts.push({x:p.x+(R()-.5)*14,y:p.y+(R()-.5)*14})}
  });
  arbre.moyennes.forEach(b=>{if(R()<.4){const p=echant(b,.75+R()*.25);pts.push({x:p.x+(R()-.5)*10,y:p.y+(R()-.5)*10})}});
  const inst={arr:[],mil:[],av:[]};
  pts.filter(p=>p.y<GY-118).forEach(p=>{
    const cx=p.x-CX,cy=p.y-170,rn=Math.hypot(cx/150,cy/130),lum=clamp(.5+(cx*LX+cy*LY)/210,0,1);
    let couche=rn<.42?"arr":lum>.5?"av":"mil";
    if(R()<.1)couche=R()<.5?"av":"arr";
    const sc=couche==="arr"?.85+R()*.2:couche==="mil"?.56+R()*.22:.5+R()*.2;
    inst[couche].push({x:p.x,y:p.y,sc,rot:(R()-.5)*.9,ph:R()*6.28,v:Math.floor(R()*3),
      lev:Math.pow(clamp((GY-p.y)/(GY-50),0,1),1.35)*(.55+.45*Math.min(1,Math.abs(p.x-CX)/130)),
      br:R()<.5?1:0});
  });
  return inst;
}

/* ---------- état ---------- */
let W=0,H=0,dpr=1,S=1,M=1,OX=0,OY=0,sol=null,bois=null,sp=null,glow=null,inst=null,herbe=[],lucioles=[],tombantes=[];
let rafale=0,biais=0,prochaine=1.5,visible=true,actif=false,rafId=0,tDernier=0,tPrec=0,pret=false;
const t0=performance.now();

let derL=0,derH=0;
function construire(){
  const w=scene.clientWidth,h=scene.clientHeight;if(w<40||h<40)return false;
  derL=w;derH=h;
  dpr=Math.min(window.devicePixelRatio||1,(navigator.hardwareConcurrency||4)<=2?1.5:2);
  W=Math.round(w*dpr);H=Math.round(h*dpr);cv.width=W;cv.height=H;
  const R=rng(20261115),arbre=construireArbre(R);
  inst=genererInstances(arbre,rng(4242));
  let x0=1e9,x1=-1e9,y0=1e9;
  ["arr","mil","av"].forEach(k=>inst[k].forEach(o=>{const r=40*o.sc;x0=Math.min(x0,o.x-r);x1=Math.max(x1,o.x+r);y0=Math.min(y0,o.y-r*.85)}));
  const demi=Math.max(CX-x0,x1-CX,110);
  S=Math.min(h*.975/(GY+30-y0),w*.485/demi,1.25);M=S*dpr;
  OX=(w/2-CX*S)*dpr;OY=(h*.985-(GY+30)*S)*dpr;
  orb.rx=clamp((demi+16)*S,90,w/2-36);orb.cy=OY/dpr+(GY-138)*S-h/2;
  const gR=Math.min(228,w/2/S*.97);
  sol=mk(W,H);bois=mk(W,H);
  const gs=sol.getContext("2d"),gb=bois.getContext("2d");
  gs.setTransform(M,0,0,M,OX,OY);gb.setTransform(M,0,0,M,OX,OY);
  dessinerSol(gs,rng(77),gR);dessinerBois(gb,arbre,rng(311));
  const dens=S*dpr*1.15;
  sp={sombre:[0,1,2].map(i=>sprite(500+i*37,"sombre",dens)),moyen:[0,1,2].map(i=>sprite(900+i*41,"moyen",dens)),clair:[0,1,2].map(i=>sprite(1300+i*53,"clair",dens)),brill:[spriteBrillance(1700,dens),spriteBrillance(1790,dens)]};
  glow=mk(48,48);const gg=glow.getContext("2d"),gr=gg.createRadialGradient(24,24,0,24,24,24);
  gr.addColorStop(0,"rgba(230,255,150,1)");gr.addColorStop(.25,"rgba(196,240,110,.5)");gr.addColorStop(1,"rgba(160,220,90,0)");gg.fillStyle=gr;gg.fillRect(0,0,48,48);
  const R2=rng(99);herbe=[];
  for(let i=0;i<90;i++){const gx=(R2()+R2()-1)*gR*.85;herbe.push({x:CX+gx,y:GY+11+R2()*13,h:9+R2()*12,lean:(R2()-.5)*5,ph:R2()*6.28,c:i%3})}
  lucioles=[];for(let i=0;i<13;i++)lucioles.push({cx:CX+(R2()-.5)*demi*2.3,cy:GY-30-R2()*(GY-y0-50),ax:18+R2()*42,ay:10+R2()*26,fx:.1+R2()*.22,fy:.09+R2()*.2,ph:R2()*6.28,fl:.7+R2()*1.3});
  return true;
}

/* ---------- vent ---------- */
function vent(t){
  const lent=Math.sin(t*.55)*.5+Math.sin(t*.23+1.3)*.34,r=Math.max(0,Math.sin(t*.17+Math.sin(t*.05)*2));
  return clamp(lent*(.5+.6*r*r)+.22*r*r+rafale*.9+biais,-1.6,1.6);
}
const balance=(y,w)=>w*3.4*Math.pow(clamp((GY-y)/(GY-40),0,1),1.7);

/* ---------- rendu d'une image ---------- */
function groupe(liste,t,w,niv){
  const D=TS;
  for(let i=0;i<liste.length;i++){
    const o=liste[i],lv=o.lev,bal=balance(o.y,w);
    const dx=bal+w*lv*2.6+Math.sin(t*1.9+o.ph)*.5*lv*(.4+Math.abs(w)),dy=Math.sin(t*1.4+o.ph*1.7)*.55*lv;
    const rot=o.rot+w*lv*.045+Math.sin(t*2.6+o.ph*2.1)*.02*lv*(.5+Math.abs(w)),k=M*o.sc,c=Math.cos(rot)*k,s=Math.sin(rot)*k;
    ctx.setTransform(c,s,-s,c,OX+(o.x+dx)*M,OY+(o.y+dy)*M);
    ctx.drawImage(sp[niv][o.v],-D/2,-D/2,D,D);
    if(niv==="clair"){
      const a=.18+.34*(.5+.5*Math.sin(t*1.25+o.ph*3))*(.6+.4*Math.min(1,Math.abs(w)+.4));
      ctx.globalAlpha=a;ctx.drawImage(sp.brill[o.br],-D/2,-D/2,D,D);ctx.globalAlpha=1;
    }
  }
}
function leafPath(g,L,Wd){
  g.beginPath();g.moveTo(0,0);g.bezierCurveTo(L*.22,-Wd,L*.68,-Wd*.82,L,0);g.bezierCurveTo(L*.68,Wd*.82,L*.22,Wd,0,0);g.closePath();
}
function rendre(t,dt){
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";ctx.clearRect(0,0,W,H);
  const w=vent(t);
  ctx.drawImage(sol,0,0);
  groupe(inst.arr,t,w,"sombre");
  /* le bois, découpé en tranches pour onduler avec le vent */
  ctx.setTransform(1,0,0,1,0,0);
  const pas=10;
  for(let y=0;y<H;y+=pas){
    const hh=Math.min(pas+1,H-y),dy=((y+pas/2)-OY)/M,off=balance(dy,w)*M;
    ctx.drawImage(bois,0,y,W,hh,off,y,W,hh);
  }
  groupe(inst.mil,t,w,"moyen");
  groupe(inst.av,t,w,"clair");
  /* feuilles qui tombent */
  ctx.setTransform(1,0,0,1,0,0);
  for(let i=tombantes.length-1;i>=0;i--){
    const f=tombantes[i];
    f.age+=dt;f.x+=(f.vx+w*14+Math.sin(t*1.6+f.ph)*9)*dt;f.y+=f.vy*dt+Math.sin(t*2+f.ph)*4*dt;f.rot+=f.vr*dt;f.fl+=f.vf*dt;
    if(f.y>GY+16||f.age>f.vie){tombantes.splice(i,1);continue}
    const al=clamp(Math.min(f.age*2,(GY+16-f.y)/22),0,1),sc=M*f.s,cs=Math.cos(f.rot)*sc,sn=Math.sin(f.rot)*sc,fl=Math.cos(f.fl);
    ctx.setTransform(cs,sn,-sn*fl,cs*fl,OX+f.x*M,OY+f.y*M);
    ctx.globalAlpha=al;leafPath(ctx,10,3.8);ctx.fillStyle=f.col;ctx.fill();
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(8.5,0);ctx.strokeStyle="rgba(255,240,180,.35)";ctx.lineWidth=.5;ctx.stroke();
  }
  ctx.globalAlpha=1;
  prochaine-=dt;
  if(prochaine<=0&&tombantes.length<12&&inst.av.length){
    const o=inst.av[Math.floor(Math.random()*inst.av.length)];
    tombantes.push(nouvelleFeuille(o.x+(Math.random()-.5)*20,o.y+(Math.random()-.5)*12));prochaine=1.4+Math.random()*2.6;
  }
  /* herbe qui ondule au premier plan */
  ctx.setTransform(M,0,0,M,OX,OY);ctx.lineCap="round";ctx.lineWidth=1.25;
  const cols=["hsl(106,34%,19%)","hsl(98,40%,26%)","hsl(90,46%,34%)"];
  for(let c=0;c<3;c++){
    ctx.beginPath();
    for(let i=0;i<herbe.length;i++){const b=herbe[i];if(b.c!==c)continue;
      const sw=(w*.8+Math.sin(t*1.7+b.ph)*.35)*b.h*.28;
      ctx.moveTo(b.x,b.y);ctx.quadraticCurveTo(b.x+b.lean*.4+sw*.4,b.y-b.h*.6,b.x+b.lean+sw,b.y-b.h);
    }
    ctx.strokeStyle=cols[c];ctx.stroke();
  }
  /* rayons de lumière à travers les branches, puis lucioles */
  ctx.globalCompositeOperation="lighter";
  for(let i=0;i<4;i++){
    const x0=CX+40+i*44,a=.5+.5*Math.sin(t*.35+i*1.7),gr=ctx.createLinearGradient(x0,-20,x0-150,GY);
    gr.addColorStop(0,"rgba(255,206,140,0)");gr.addColorStop(.22,"rgba(255,206,140,"+(.075*a+.015)+")");gr.addColorStop(1,"rgba(255,206,140,0)");
    ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(x0,-20);ctx.lineTo(x0+30+i*6,-20);ctx.lineTo(x0-120+i*8,GY);ctx.lineTo(x0-190,GY);ctx.closePath();ctx.fill();
  }
  for(let i=0;i<lucioles.length;i++){
    const l=lucioles[i],x=l.cx+l.ax*Math.sin(t*l.fx+l.ph),y=l.cy+l.ay*Math.sin(t*l.fy+l.ph*1.7),a=Math.pow(Math.max(0,Math.sin(t*l.fl+l.ph)),2);
    if(a<.03)continue;ctx.globalAlpha=a*.95;ctx.drawImage(glow,x-8,y-8,16,16);
  }
  ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";
  rafale*=Math.pow(.32,dt);biais*=Math.pow(.2,dt);
}
function nouvelleFeuille(x,y){
  const jaune=Math.random()<.28;
  return{x,y,vx:(Math.random()-.5)*8,vy:15+Math.random()*13,rot:Math.random()*PI2,vr:(Math.random()-.5)*3,fl:Math.random()*PI2,vf:1.5+Math.random()*2.2,s:.7+Math.random()*.6,
    ph:Math.random()*6.28,age:0,vie:11,col:jaune?hsl(46+Math.random()*16,66,52):hsl(88+Math.random()*26,46,36+Math.random()*10)};
}

/* ---------- orbite des livres ---------- */
const orb={els:[],dev:[],back:null,front:null,rx:140,cy:0};
function preparerLivres(){
  const back=scene.querySelector(".benoli-orbit-back"),front=scene.querySelector(".benoli-orbit-front");
  if(!back||!front)return false;
  const els=[].slice.call(back.children).concat([].slice.call(front.children)).filter(e=>e.classList&&e.classList.contains("benoli-orbit-book"));
  if(!els.length)return false;
  back.style.animation="none";front.style.animation="none";back.style.transform="none";front.style.transform="none";
  els.forEach(e=>{
    e.style.animation="none";e.style.marginTop="0";e.classList.remove("is-back");e.style.willChange="transform";
    if(!e.querySelector(".benoli-voile")){const v=document.createElement("span");v.className="benoli-voile";v.style.cssText="position:absolute;left:0;top:0;right:0;bottom:0;border-radius:3px 7px 7px 3px;background:#0d0a18;opacity:0;pointer-events:none";e.appendChild(v)}
    e._v=e.querySelector(".benoli-voile");
  });
  orb.els=els;orb.dev=els.map(()=>null);orb.back=back;orb.front=front;return true;
}
function orbiter(t){
  const n=orb.els.length;if(!n||!W)return;
  const Rx=orb.rx,Ry=Rx*.34,cy=orb.cy;
  for(let k=0;k<n;k++){
    const el=orb.els[k],th=t*PI2/54+k*PI2/n,cs=Math.cos(th),sn=Math.sin(th),prof=(sn+1)/2,sc=(.68+.34*prof)*(scene.clientWidth<420?.9:1);
    const bob=Math.sin(t*1.2+k*1.9)*3;
    el.style.transform="translate(-50%,-50%) translate("+(cs*Rx).toFixed(1)+"px,"+(sn*Ry+cy+bob).toFixed(1)+"px) scale("+sc.toFixed(3)+") rotateY("+(-cs*24).toFixed(1)+"deg) rotateZ("+(-cs*4).toFixed(1)+"deg)";
    el.style.zIndex=String(10+Math.round(prof*40));
    if(el._v)el._v.style.opacity=(.56*(1-prof)).toFixed(2);
    const devant=sn>=0;
    if(orb.dev[k]!==devant){(devant?orb.front:orb.back).appendChild(el);orb.dev[k]=devant}
  }
}

/* ---------- boucle ---------- */
function image(ts){
  rafId=0;
  if(!actif||!visible||!pret)return;
  if(ts-tDernier>=31){
    const t=(performance.now()-t0)/1000,dt=Math.min(.1,Math.max(0,t-tPrec));tPrec=t;tDernier=ts;
    rendre(t,dt);orbiter(t);
  }
  rafId=requestAnimationFrame(image);
}
function demarrer(){if(!rafId&&actif&&visible&&pret){tPrec=(performance.now()-t0)/1000;rafId=requestAnimationFrame(image)}}
function initialiser(){
  if(!construire())return false;
  const aLivres=preparerLivres();
  const t=(performance.now()-t0)/1000;
  rendre(reduit?4.2:t,.016);if(aLivres)orbiter(reduit?4.2:t);
  cv.classList.add("pret");
  if(ancienSvg){ancienSvg.style.transition="opacity 1s ease";ancienSvg.style.opacity="0";setTimeout(()=>{ancienSvg.style.display="none"},1100)}
  pret=true;actif=!reduit;demarrer();return true;
}
let minuterie=0;
function surChangementTaille(){
  clearTimeout(minuterie);
  minuterie=setTimeout(()=>{
    const w=scene.clientWidth,h=scene.clientHeight;
    if(w<40||h<40){visible=false;return}
    visible=true;
    if(!pret){initialiser();return}
    if(w===derL&&h===derH){demarrer();return}
    construire();const t=(performance.now()-t0)/1000;rendre(reduit?4.2:t,.016);demarrer();
  },140);
}
function demarrerTout(){
  if(!initialiser())surChangementTaille();
  if(window.ResizeObserver)new ResizeObserver(surChangementTaille).observe(scene);else addEventListener("resize",surChangementTaille);
  if(window.IntersectionObserver)new IntersectionObserver(es=>{visible=es[0].isIntersecting&&scene.clientWidth>40;if(visible)demarrer()},{threshold:0}).observe(scene);
  document.addEventListener("visibilitychange",()=>{visible=!document.hidden;if(visible)demarrer()});
  cv.addEventListener("pointerdown",()=>{if(reduit)return;rafale=Math.min(1.5,rafale+1);for(let i=0;i<6&&inst&&inst.av.length;i++){const o=inst.av[Math.floor(Math.random()*inst.av.length)];tombantes.push(nouvelleFeuille(o.x,o.y))}});
  cv.addEventListener("pointermove",e=>{if(reduit)return;const r=cv.getBoundingClientRect();biais=clamp((e.clientX-(r.left+r.width/2))/r.width*.5,-.3,.3)});
}
if(document.readyState==="complete")setTimeout(demarrerTout,30);else addEventListener("load",()=>setTimeout(demarrerTout,30));
})();
