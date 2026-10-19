/* ---------- review: the finished postcard, to turn over, check, rearrange and send ----------
   The collage (js/collage.js) on the front and the message on the back, on the 3D card
   (js/card3d.js). arrange lays it flat: drag a photo to move it, drag its round handle (or pinch)
   to turn and resize it, tap it to bring it to the front. randomize piles them up again (with undo).
   next opens the send sheet: who it's from, now or by snail, then it's posted (js/net.js) and
   the share sheet hands the link to Messages, WhatsApp, … */
(function(){
 const view=$('#v-sent'),flipEl=$('#pFlip'),arrBtn=$('#pArrange'),calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const blank=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle='#fbf6e6';g.fillRect(0,0,w,h);return c};
 const fc=blank(Collage.W,Collage.H),bc=blank(920,1360),card=Card3D($('#pStage'),$('#pgl'),fc,bc);
 card.onSide=b=>{flipEl.querySelector('span').textContent=b?'see the front':'see the back'};
 flipEl.onclick=()=>card.flip();

 /* arranging: move, turn + resize (handle or pinch), tap to bring to the front */
 let sel=null,act=null,dirty=false,ready0=false;const pts=new Map();
 const at=e=>card.toCard(e.clientX,e.clientY,Collage.W,Collage.H);
 const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),ang=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0]);
 const hooks={
  down(e){pts.set(e.pointerId,[e.clientX,e.clientY]);
   if(pts.size===2&&sel){const[a,b]=[...pts.values()],it=Collage.get(sel);act={kind:'pinch',d0:dist(a,b),a0:ang(a,b),r0:it.r,s0:it.s};return}
   if(pts.size>1)return;
   const p=at(e),h=p&&Collage.hit(p[0],p[1],sel);
   if(h&&h.handle){const it=Collage.get(sel);act={kind:'turn',a0:Math.atan2(p[1]-it.y,p[0]-it.x),d0:Math.max(1,Math.hypot(p[0]-it.x,p[1]-it.y)),r0:it.r,s0:it.s}}
   else if(h){sel=h.id;const it=Collage.get(sel);act={kind:'move',id:h.id,dx:p[0]-it.x,dy:p[1]-it.y,sx:e.clientX,sy:e.clientY,moved:false}}
   else{sel=null;act=null}
   dirty=true},
  move(e){if(pts.has(e.pointerId))pts.set(e.pointerId,[e.clientX,e.clientY]);if(!act)return;
   if(act.kind==='pinch'){if(pts.size<2)return;const[a,b]=[...pts.values()];Collage.turn(sel,act.r0+ang(a,b)-act.a0,act.s0*dist(a,b)/act.d0)}
   else{const p=at(e);if(!p)return;const it=Collage.get(sel);
    if(act.kind==='turn')Collage.turn(sel,act.r0+Math.atan2(p[1]-it.y,p[0]-it.x)-act.a0,act.s0*Math.hypot(p[0]-it.x,p[1]-it.y)/act.d0);
    else{if(!act.moved&&Math.hypot(e.clientX-act.sx,e.clientY-act.sy)<6)return;act.moved=true;Collage.move(sel,p[0]-act.dx,p[1]-act.dy)}}
   dirty=true},
  up(e){pts.delete(e.pointerId);if(!act)return;if(act.kind==='move'&&!act.moved)Collage.raise(act.id);Collage.save();act=null;dirty=true}};
 function setArrange(v){card.flat=v;card.hooks=v?hooks:null;sel=null;act=null;pts.clear();view.classList.toggle('arranging',v);
  arrBtn.setAttribute('aria-pressed',v);arrBtn.querySelector('span').textContent=v?'done':'arrange';dirty=true}
 arrBtn.onclick=()=>setArrange(!card.flat);
 card.beforeRender=()=>{if(dirty&&ready0){dirty=false;Collage.draw(fc,card.flat?sel:null);card.front()}};

 let job=0;
 async function load(){const n=++job;await Collage.prepare();if(n!==job)return;ready0=true;dirty=true;Collage.back(bc);card.back()}
 addEventListener('snaily:view',e=>{const on=e.detail==='sent';if(!on){if(card.flat)setArrange(false);closeSheet()}card.show(on);if(on)load()});

 $('#pShuffle').onclick=async()=>{if(!ready0)return;const prev=Collage.reshuffle();sel=null;if(card.onBack()&&!card.flat)card.flip();if(!calm)card.pop=.4;await load();
  Board.toast('new layout',{label:'undo',run:()=>{Collage.restore(prev);sel=null;load()}},5000)};
 $('#pBack').onclick=()=>{location.hash='board'};

 /* ---------- the send sheet ---------- */
 const sheet=$('#pSheet'),form=$('#pForm'),from=$('#pFrom'),whenTxt=$('#pWhen'),sendB=$('#pSend'),done=$('#pDone'),shareB=$('#pShare'),copyB=$('#pCopy');
 let when='now',busy=false,posted=null;
 const nextMorning=()=>{const d=new Date();d.setDate(d.getDate()+1);d.setHours(8,0,0,0);return d};
 try{from.value=localStorage.getItem('snaily-name')||''}catch(e){}
 function paintWhen(){sheet.querySelectorAll('[data-when]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.when===when));
  whenTxt.textContent=when==='snail'?'the snail takes it overnight: it arrives tomorrow at 8:00 am':'it arrives as soon as they open the link'}
 sheet.querySelectorAll('[data-when]').forEach(b=>b.onclick=()=>{when=b.dataset.when;paintWhen()});
 function openSheet(){if(card.flat)setArrange(false);posted=null;sheet.classList.remove('posted');sheet.hidden=false;paintWhen();
  if(!calm)sheet.querySelector('.sheet-body').animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.9,.25,1)'});
  if(!from.value)from.focus({preventScroll:true})}
 function closeSheet(){if(busy)return;sheet.hidden=true}
 $('#pNext').onclick=()=>{if(!ready0)return;openSheet()};
 $('#pScrim').onclick=()=>{if(posted)finish();else closeSheet()};
 addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden){if(posted)finish();else closeSheet()}});

 const jpg=c=>new Promise(r=>c.toBlob(r,'image/jpeg',.88));
 form.onsubmit=async e=>{e.preventDefault();if(busy)return;
  if(!Net.on)return Board.toast("sending isn't set up yet.");
  const sender=from.value.trim();if(!sender){from.focus();return}
  try{localStorage.setItem('snaily-name',sender)}catch(e){}
  busy=true;sendB.disabled=true;sendB.textContent='posting…';
  try{const f=document.createElement('canvas');f.width=Collage.W;f.height=Collage.H;Collage.draw(f);
   const b=document.createElement('canvas');b.width=920;b.height=1360;Collage.back(b);
   const deliverAt=when==='snail'?nextMorning():new Date();
   const{id,url}=await Net.send({front:await jpg(f),back:await jpg(b),sender,deliverAt});
   const t=document.createElement('canvas');t.width=230;t.height=340;t.getContext('2d').drawImage(f,0,0,230,340);
   Store.addSent({id,url,sentAt:new Date().toISOString(),deliverAt:deliverAt.toISOString(),thumb:t.toDataURL('image/jpeg',.7)});
   await Store.finish(id);
   posted={url,sender};sheet.classList.add('posted');
   done.querySelector('p').textContent=when==='snail'?'the snail is on its way. it arrives tomorrow at 8:00 am.':'now send them the link.'}
  catch(err){console.warn('send failed',err);Board.toast(/anonymous/i.test(err&&err.message||'')?"sending isn't switched on yet (anonymous sign-ins).":"couldn't post it. check your connection and try again.",null,5000)}
  finally{busy=false;sendB.disabled=false;sendB.textContent='send'}};
 // sharing needs its own tap: browsers only open the share sheet straight from one
 shareB.onclick=async()=>{if(!posted)return;
  if(navigator.share){try{await navigator.share({title:'a postcard for you',text:`${posted.sender} sent you a postcard 🐌`,url:posted.url});return}catch(e){if(e&&e.name==='AbortError')return}}
  copy()};
 copyB.onclick=()=>copy();
 async function copy(){try{await navigator.clipboard.writeText(posted.url);Board.toast('link copied')}catch(e){prompt('copy this link:',posted.url)}}
 $('#pFinish').onclick=()=>finish();
 /* the draft was already swapped for a fresh one; reload so every screen starts clean */
 function finish(){location.replace(location.pathname+'#home');location.reload()}
 if(document.body.dataset.view==='sent'){card.show(true);load()}
})();
