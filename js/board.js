/* ---------- photo board: today's photos as a tilted collage ----------
   Photos drop into hand-placed slots for their count (1–6). Drag nudges a
   photo; a tap brings it to the front with an editable caption bubble. */
const Board=(()=>{
 const el=$('#board'),file=$('#bFile'),next=$('#bNext'),count=$('#bCount'),toastEl=$('#toast');
 const focusEl=$('#focus'),fPhoto=$('#fPhoto'),fCap=$('#fCap'),fCount=$('#fCount'),fBubble=$('#fBubble'),fBody=focusEl.querySelector('.f-body');
 const calm=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
 /* slot templates: centre x/y (% of board), width (% of the layout unit), tilt */
 const SLOTS=[
  [[50,47,80,-2]],
  [[35,34,58,-5],[65,66,58,4]],
  [[31,28,52,-6],[69,40,50,5],[45,73,54,-2]],
  [[29,26,47,-6],[71,28,46,5],[32,71,46,4],[69,73,47,-4]],
  [[29,22,48,-7],[71,22,48,5],[50,50,50,-2],[28,78,47,5],[72,78,48,-5]],
  [[28,18,46,-6],[72,18,47,6],[30,50,47,4],[71,50,45,-4],[29,82,45,-3],[71,82,47,5]]];
 const TAPES=['#EB5E3A','#7CA2E0','#D9C47A','#C9A36A'];
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
 const jitter=id=>((hash(id)%1000)/1000*2-1)*1.5;
 let layout=[],openIdx=-1,replaceIdx=-1,undo=null,toastT=null,dragEnd=0;

 const photos=()=>Store.draft?Store.draft.photos:[];
 function toast(msg,action,ms=3200){clearTimeout(toastT);toastEl.textContent=msg;
  if(action){const b=document.createElement('button');b.textContent=action.label;b.onclick=()=>{action.run();hideToast()};toastEl.append(' ',b)}
  toastEl.classList.add('on');toastT=setTimeout(hideToast,ms)}
 function hideToast(){toastEl.classList.remove('on');if(undo){undo.commit();undo=null}}

 /* geometry for each photo, in board pixels */
 function frames(){
  const ps=photos(),n=ps.length,W=el.clientWidth,H=el.clientHeight;if(!n||!W)return[];
  const u=Math.min(W,H*.8),slots=SLOTS[n-1];
  return ps.map((p,i)=>{const[sx,sy,sw,r]=slots[i],ar=Math.max(.75,Math.min(1.34,p.w/p.h));
   let w=sw/100*u,h=w/ar;if(h>H*.62){h=H*.62;w=h*ar}
   const x=Math.max(0,Math.min(W-w,sx/100*W-w/2)),y=Math.max(0,Math.min(H-h,sy/100*H-h/2));
   return{x,y,w,h,r:r+jitter(p.id)}})}

 async function render(){
  const ps=photos();layout=frames();el.textContent='';
  count.textContent=ps.length?`${ps.length} of ${Store.MAX_PHOTOS}`:'';
  next.disabled=!ps.length;
  if(!ps.length){const e=document.createElement('div');e.className='board-empty';
   e.innerHTML='<button class="big" id="bAddBig"><b>+</b>add today\'s photos</button><p class="muted">up to six little moments</p>';
   el.append(e);e.querySelector('button').onclick=()=>pick(-1);return}
  const W=el.clientWidth,H=el.clientHeight;
  for(const[i,p]of ps.entries()){const f=layout[i],b=document.createElement('button');
   b.className='ph';b.dataset.i=i;const hv=hash(p.id);b.style.setProperty('--tape',TAPES[hv%TAPES.length]);b.style.setProperty('--tr',((hv>>4)%9-4)+'deg');b.setAttribute('aria-label',`photo ${i+1}: ${p.caption||'no caption yet'}`);
   Object.assign(b.style,{left:f.x+'px',top:f.y+'px',width:f.w+'px',height:f.h+'px',zIndex:p.z||i+1,
    transform:`translate(${(p.nudge?.x||0)*W}px,${(p.nudge?.y||0)*H}px) rotate(${f.r}deg)`});
   const img=document.createElement('img');img.alt='';img.draggable=false;Store.url(p.blobId).then(u=>img.src=u);b.append(img);
   drag(b,i);el.append(b)}
  // caption notes live on their own layer so later photos never cover them
  // try a few spots around the photo and take the first that doesn't hit a note already placed
  const placed=[],hit=(a,b)=>Math.max(0,Math.min(a.r,b.r)-Math.max(a.l,b.l))*Math.max(0,Math.min(a.b,b.b)-Math.max(a.t,b.t));
  for(const[i,p]of ps.entries()){if(!p.caption)continue;
   const f=layout[i],x=f.x+(p.nudge?.x||0)*W,y=f.y+(p.nudge?.y||0)*H,n=document.createElement('span');
   n.dataset.for=i;n.textContent=p.caption;n.setAttribute('aria-hidden','true');n.className='note';
   n.style.maxWidth=Math.max(110,f.w*1.1)+'px';el.append(n);
   const nw=n.offsetWidth,nh=n.offsetHeight,clamp=(l,t)=>({l:Math.max(-8,Math.min(W-nw+8,l)),t:Math.max(-8,Math.min(H-nh+8,t))});
   const spots=[[x-f.w*.1,y+f.h-14,'below'],[x+f.w*1.1-nw,y-nh+14,'above'],[x+f.w*1.1-nw,y+f.h-14,'below'],[x-f.w*.1,y-nh+14,'above'],[x-nw*.6,y+f.h/2-nh/2,'below'],[x+f.w-nw*.4,y+f.h/2-nh/2,'above']]
    .map(([l,t,k])=>{const c=clamp(l,t);return{...c,k,r:c.l+nw,b:c.t+nh}});
   const best=spots.map(c=>({c,o:placed.reduce((s,q)=>s+hit(c,q),0)})).sort((a,b)=>a.o-b.o)[0].c;
   n.classList.add(best.k);n.style.left=best.l+'px';n.style.top=best.t+'px';placed.push(best)}
  if(ps.length<Store.MAX_PHOTOS){const a=document.createElement('button');a.className='add';a.textContent='+';a.setAttribute('aria-label','add photos');a.onclick=()=>pick(-1);el.append(a)}
 }

 /* drag to nudge; a tap opens the photo. Opening happens on click, not pointerup,
    so the tap's own click can't land on the backdrop and close it again. */
 function drag(b,i){
  let sx=0,sy=0,ox=0,oy=0,moved=false,on=false;
  b.addEventListener('pointerdown',e=>{if(e.button)return;on=true;moved=false;sx=e.clientX;sy=e.clientY;const p=photos()[i];ox=(p.nudge?.x||0)*el.clientWidth;oy=(p.nudge?.y||0)*el.clientHeight;b.setPointerCapture(e.pointerId)});
  b.addEventListener('pointermove',e=>{if(!on)return;const dx=e.clientX-sx,dy=e.clientY-sy;
   if(!moved&&Math.hypot(dx,dy)<6)return;
   if(!moved){moved=true;b.classList.add('drag');b.style.zIndex=99;const n=el.querySelector(`.note[data-for="${i}"]`);if(n)n.style.visibility='hidden'}
   const f=layout[i],W=el.clientWidth,H=el.clientHeight,nx=Math.max(-f.x,Math.min(W-f.x-f.w,ox+dx)),ny=Math.max(-f.y,Math.min(H-f.y-f.h,oy+dy));
   b.style.transform=`translate(${nx}px,${ny}px) rotate(${f.r}deg) scale(1.04)`;b._n=[nx/W,ny/H]});
  const end=()=>{if(!on)return;on=false;
   if(!moved)return;
   b.classList.remove('drag');const ps=photos(),top=Math.max(0,...ps.map(p=>p.z||0))+1;
   ps[i].nudge={x:b._n[0],y:b._n[1]};ps[i].z=top;dragEnd=performance.now();Store.save({photos:ps});render()};
  b.addEventListener('pointerup',end);b.addEventListener('pointercancel',()=>{on=false;b.classList.remove('drag');render()});
  b.addEventListener('click',()=>{if(performance.now()-dragEnd>150)open(i)})
 }

 /* adding / replacing photos */
 function pick(idx){replaceIdx=idx;file.value='';file.click()}
 file.onchange=async()=>{
  const files=[...file.files];if(!files.length)return;
  const ps=photos(),room=replaceIdx>=0?1:Store.MAX_PHOTOS-ps.length,use=files.slice(0,room);
  toast(use.length>1?'getting your photos ready…':'getting your photo ready…',null,60000);
  const errs=[];
  for(const f of use){try{const p=await Store.putPhoto(f);
    if(replaceIdx>=0){const old=ps[replaceIdx];p.caption=old.caption;p.nudge=old.nudge;p.z=old.z;ps[replaceIdx]=p;Store.dropBlob(old.blobId)}
    else ps.push(p)}catch(e){errs.push(e.message)}}
  Store.save({photos:ps});await render();
  if(replaceIdx>=0&&openIdx>=0)Store.url(ps[openIdx].blobId).then(u=>fPhoto.src=u);
  if(errs.length)toast(errs[0],null,5000);
  else if(files.length>room)toast(`only ${Store.MAX_PHOTOS} photos fit on a board.`,null,4000);
  else hideToast()};

 /* focus: the photo lifts to the front with its caption bubble */
 function open(i){
  const p=photos()[i],b=el.querySelector(`.ph[data-i="${i}"]`);if(!p||!b)return;
  openIdx=i;Store.url(p.blobId).then(u=>fPhoto.src=u);
  fCap.value=p.caption||'';fCount.textContent=`${fCap.value.length}/120`;
  focusEl.hidden=false;focusEl.classList.remove('typing');
  const from=b.getBoundingClientRect(),f=layout[i];b.style.visibility='hidden';
  const go=()=>{const to=fPhoto.getBoundingClientRect();
   if(calm()){focusEl.animate([{opacity:0},{opacity:1}],{duration:200});return}
   const s=from.width/Math.max(1,to.width);
   fPhoto.animate([{transform:`translate(${from.left+from.width/2-(to.left+to.width/2)}px,${from.top+from.height/2-(to.top+to.height/2)}px) scale(${s}) rotate(${f.r}deg)`},{transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.9,.25,1.05)'});
   $('#fScrim').animate([{opacity:0},{opacity:1}],{duration:260});
   fBubble.animate([{transform:'scale(.4) translateY(-20px)',opacity:0},{transform:'scale(1.04)',opacity:1,offset:.7},{transform:'scale(1)',opacity:1}],{duration:360,delay:160,easing:'cubic-bezier(.3,1.3,.5,1)',fill:'backwards'});
   focusEl.querySelector('.f-actions').animate([{opacity:0},{opacity:1}],{duration:240,delay:260,fill:'backwards'})};
  fPhoto.complete&&fPhoto.naturalWidth?requestAnimationFrame(go):(fPhoto.onload=()=>{fPhoto.onload=null;go()},setTimeout(()=>{if(fPhoto.onload){fPhoto.onload=null;go()}},300));
  if(matchMedia('(hover:hover)').matches)setTimeout(()=>fCap.focus(),200);else $('#fDone').focus({preventScroll:true})}
 async function close(){
  if(openIdx<0)return;const i=openIdx;openIdx=-1;
  const ps=photos();if(ps[i]){ps[i].caption=fCap.value.trim();Store.save({photos:ps})}
  focusEl.classList.remove('typing');fCap.blur();
  await render();
  const b=el.querySelector(`.ph[data-i="${i}"]`);
  if(b&&!calm()){b.style.visibility='hidden';const to=b.getBoundingClientRect(),from=fPhoto.getBoundingClientRect(),f=layout[i];
   fBubble.animate([{opacity:1},{opacity:0}],{duration:120,fill:'forwards'});focusEl.querySelector('.f-actions').animate([{opacity:1},{opacity:0}],{duration:120,fill:'forwards'});
   $('#fScrim').animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'});
   await fPhoto.animate([{transform:'none'},{transform:`translate(${to.left+to.width/2-(from.left+from.width/2)}px,${to.top+to.height/2-(from.top+from.height/2)}px) scale(${to.width/Math.max(1,from.width)}) rotate(${f.r}deg)`}],{duration:320,easing:'cubic-bezier(.3,.1,.2,1)',fill:'forwards'}).finished.catch(()=>{});
   b.style.visibility=''}
  focusEl.hidden=true;focusEl.getAnimations({subtree:true}).forEach(a=>a.cancel());
  if(b)b.focus({preventScroll:true})}
 $('#fScrim').onclick=close;$('#fDone').onclick=close;
 addEventListener('keydown',e=>{if(e.key==='Escape'&&openIdx>=0)close()});
 fCap.oninput=()=>{fCount.textContent=`${fCap.value.length}/120`;const ps=photos();if(ps[openIdx]){ps[openIdx].caption=fCap.value;Store.save({photos:ps})}};
 // the photo shrinks while typing; restore it a beat after blur so a tap on "done" lands before the layout moves
 let typingT=null;
 fCap.onfocus=()=>{clearTimeout(typingT);focusEl.classList.add('typing')};
 fCap.onblur=()=>{clearTimeout(typingT);typingT=setTimeout(()=>focusEl.classList.remove('typing'),300)};
 $('#fReplace').onclick=()=>pick(openIdx);
 $('#fRemove').onclick=async()=>{
  const i=openIdx,ps=photos(),[gone]=ps.splice(i,1);openIdx=-1;focusEl.hidden=true;
  Store.save({photos:ps});await render();
  if(undo)undo.commit();
  undo={commit:()=>Store.dropBlob(gone.blobId)};
  toast('photo removed',{label:'undo',run:()=>{undo=null;const ps=photos();ps.splice(i,0,gone);Store.save({photos:ps});render()}},5000)};
 next.onclick=()=>{Store.flush();location.hash='sent'};

 function show(){
  Store.load().then(d=>{
   $('#bDate').textContent=new Date(d.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric'}).toLowerCase();
   render()})}
 new ResizeObserver(()=>{if($('#v-board').classList.contains('on')&&openIdx<0)render()}).observe(el);
 addEventListener('snaily:view',e=>{if(e.detail==='board')show();else if(openIdx>=0){openIdx=-1;focusEl.hidden=true}});
 if(location.hash==='#board')show();
 return{render};
})();
