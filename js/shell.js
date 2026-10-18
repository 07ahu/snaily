/* ---------- app shell: routing, nav, settings ---------- */
const VIEWS=['home','write','board','sent','gallery','settings'],PARENT={write:'home',board:'write',sent:'board'},body=document.body;
const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
function route(){const v=VIEWS.includes(location.hash.slice(1))?location.hash.slice(1):'home';
 $$('.view').forEach(el=>el.classList.toggle('on',el.id==='v-'+v));
 $$('.tab').forEach(t=>{const cur=t.dataset.go===(PARENT[v]?'home':v);cur?t.setAttribute('aria-current','page'):t.removeAttribute('aria-current')});
 body.dataset.view=v;setWrite(v==='write');dispatchEvent(new CustomEvent('snaily:view',{detail:v}))}
addEventListener('hashchange',route);
$$('.tab').forEach(t=>t.onclick=()=>{location.hash=t.dataset.go});
// the write view has its own back, down by the colours
const wBack=$('#wBack');if(wBack)wBack.onclick=()=>{location.hash='home'};
const h=new Date().getHours();$('#greet').textContent=h<12?'good morning':h<18?'good afternoon':'good evening';
$$('[data-box]').forEach(b=>b.onclick=()=>{$$('[data-box]').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#emptyMsg').textContent=`no ${b.dataset.box} postcards yet.`});
function setTheme(v,save){const r=document.documentElement;v==='system'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',v);
 $$('[data-theme-set]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.themeSet===v));if(save)try{localStorage.setItem('snaily-theme',v)}catch(e){}}
$$('[data-theme-set]').forEach(b=>b.onclick=()=>setTheme(b.dataset.themeSet,true));
setTheme(document.documentElement.getAttribute('data-theme')||'system');
route();

/* ---------- intro: stamp thump, snail hops into the logo ---------- */
(function intro(){
 const ov=$('#intro'),shake=$('#shake'),wrap=$('#stampWrap'),full=$('.stamp.full'),empty=$('.stamp.empty'),ink=$('.ink'),fly=$('#fly'),logo=$('#logo');
 const [fx,fy,fs,fq,fr]=['.fx','.fy','.fs','.fq','.fr'].map(c=>fly.querySelector(c));
 const SNAIL_BOX=[.1953,.2017,.8375,.792],SNAIL_AR=480/334,TILT=-3;
 const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let done=false;
 const play=(el,kf,o)=>el.animate(kf,{fill:'forwards',...o}).finished.catch(()=>{});
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 function finish(){if(done)return;done=true;removeEventListener('keydown',finish);
  document.getAnimations().forEach(a=>{const t=a.effect&&a.effect.target;if(t&&(ov.contains(t)||fly.contains(t)))a.cancel()});
  ov.remove();fly.remove();logo.style.visibility='';body.classList.remove('intro');body.classList.add('reveal');setTimeout(()=>body.classList.remove('reveal'),900)}
 // a tap that skips the intro must not also click whatever is underneath
 ov.addEventListener('pointerdown',()=>{const t=performance.now(),eat=e=>{if(performance.now()-t<500){e.stopPropagation();e.preventDefault()}removeEventListener('click',eat,true)};addEventListener('click',eat,true);finish()});
 addEventListener('keydown',finish);
 const load=src=>new Promise(r=>{const i=new Image();i.onload=i.onerror=r;i.src=src});
 const bg=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim().replace(/^url\(["']?|["']?\)$/g,'');
 Promise.race([Promise.all(['--stamp','--stamp-empty','--snail'].map(v=>load(bg(v)))),wait(1500)]).then(go);

 async function go(){if(done)return;
  if(calm){await play(wrap,[{opacity:0},{opacity:1}],{duration:300});await wait(500);if(done)return;
   await play(ov,[{opacity:1},{opacity:0}],{duration:400});return finish()}
  // 1. stamp thump
  const thump=play(wrap,[
   {transform:'scale(2.2) rotate(-10deg)',opacity:0,easing:'cubic-bezier(.55,0,.9,.45)'},
   {transform:`scale(1) rotate(${TILT}deg)`,opacity:.85,offset:.72},
   {transform:`scale(1.035,.955) rotate(${TILT}deg)`,opacity:.92,offset:.86},
   {transform:`scale(1) rotate(${TILT}deg)`,opacity:1}],{duration:460});
  await wait(330);if(done)return;
  play(shake,[{transform:'translate(0,0)'},{transform:'translate(-3px,2px)'},{transform:'translate(3px,-1px)'},{transform:'translate(-2px,0)'},{transform:'translate(0,0)'}],{duration:140});
  play(ink,[{transform:'scale(.7)',opacity:.22},{transform:'scale(1.7)',opacity:0}],{duration:650,easing:'cubic-bezier(.2,.7,.3,1)'});
  await thump;await wait(420);if(done)return;
  // 2. the snail leaves the stamp
  const sw=shake.offsetWidth,sh=shake.offsetHeight,sr=shake.getBoundingClientRect();
  const bw=(SNAIL_BOX[2]-SNAIL_BOX[0])*sw*1.06,bh=bw/SNAIL_AR;
  let cx=(SNAIL_BOX[0]+SNAIL_BOX[2])/2*sw-sw/2,cy=SNAIL_BOX[3]*sh-bh*.47-sh/2;
  const a=TILT*Math.PI/180;[cx,cy]=[cx*Math.cos(a)-cy*Math.sin(a),cx*Math.sin(a)+cy*Math.cos(a)];
  const x0=sr.left+sr.width/2+cx-bw/2,y0=sr.top+sr.height/2+cy-bh/2;
  Object.assign(fly.style,{display:'block',left:x0+'px',top:y0+'px',width:bw+'px',height:bh+'px'});
  fr.style.transform=`rotate(${TILT}deg)`;
  play(empty,[{opacity:0},{opacity:1}],{duration:80});play(full,[{opacity:1},{opacity:0}],{duration:80,delay:40});
  // crouch, then pop up toward the viewer
  const P=1.15,px=-(P-1)/2*bw,py=-56-(P-1)/2*bh;
  await play(fq,[{transform:'scale(1,1)'},{transform:'scale(1.08,.8)'}],{duration:130,easing:'ease-out'});if(done)return;
  fr.animate([{transform:`rotate(${TILT}deg)`},{transform:'rotate(0deg)'}],{duration:260,fill:'forwards'});
  play(fq,[{transform:'scale(1.08,.8)'},{transform:'scale(.92,1.12)',offset:.4},{transform:'scale(1,1)'}],{duration:300});
  play(fs,[{transform:'scale(1)',filter:'drop-shadow(0 0 0 rgba(60,20,15,0))'},{transform:`scale(${P})`,filter:'drop-shadow(0 14px 10px rgba(60,20,15,.25))'}],{duration:300,easing:'cubic-bezier(.2,.8,.3,1)'});
  play(fx,[{transform:'translateX(0)'},{transform:`translateX(${px}px)`}],{duration:300,easing:'cubic-bezier(.2,.8,.3,1)'});
  await play(fy,[{transform:'translateY(0)'},{transform:`translateY(${py}px)`}],{duration:300,easing:'cubic-bezier(.2,.8,.3,1)'});
  if(done)return;
  // 3. hop left into the header logo (it only exists on home; elsewhere the snail just fades away)
  if(!logo.getClientRects().length){play(fly,[{opacity:1},{opacity:0}],{duration:250});await play(ov,[{opacity:1},{opacity:0}],{duration:350});return finish()}
  const lr=logo.getBoundingClientRect(),dx=lr.left-x0,dy=lr.top-y0,sT=lr.width/bw;
  const hops=[{f:.62,g:.06,peak:90,d:360},{f:.96,g:.16,peak:60,d:320},{f:1,g:1,peak:46,d:440}];
  let pxs=px,pys=py,ps=P;
  play(wrap,[{transform:`scale(1) rotate(${TILT}deg)`,opacity:1},{transform:`scale(.9) rotate(${TILT}deg)`,opacity:0}],{duration:320,delay:hops[0].d-60,easing:'ease-in'});
  for(const [i,hp] of hops.entries()){if(done)return;
   const nx=px+(dx-px)*hp.f,ny=py+(dy-py)*hp.g,ns=P+(sT-P)*hp.f,top=Math.max(Math.min(pys,ny)-hp.peak,6-y0);
   if(i===2)play(ov,[{backgroundColor:getComputedStyle(ov).backgroundColor},{backgroundColor:'transparent'}],{duration:hp.d+60})
   if(i===2){body.classList.replace('intro','reveal');logo.style.visibility='hidden'}
   play(fx,[{transform:`translateX(${pxs}px)`},{transform:`translateX(${nx}px)`}],{duration:hp.d,easing:'linear'});
   play(fs,[{transform:`scale(${ps})`},{transform:`scale(${ns})`}],{duration:hp.d,easing:'linear'});
   play(fq,[{transform:'scale(.9,1.12)'},{transform:'scale(1,1)',offset:.35},{transform:'scale(1,1)',offset:.85},{transform:'scale(1.14,.84)'}],{duration:hp.d});
   await play(fy,[{transform:`translateY(${pys}px)`,easing:'cubic-bezier(.3,.7,.5,1)'},{transform:`translateY(${top}px)`,offset:.45,easing:'cubic-bezier(.5,0,.75,.35)'},{transform:`translateY(${ny}px)`}],{duration:hp.d});
   pxs=nx;pys=ny;ps=ns}
  if(done)return;
  await play(fq,[{transform:'scale(1.14,.84)'},{transform:'scale(.97,1.04)',offset:.5},{transform:'scale(1,1)'}],{duration:180});
  logo.style.visibility='';finish()}
})();
