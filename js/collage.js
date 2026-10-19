/* ---------- collage: the finished postcard ----------
   The card you crafted, exactly as it is (art, colours, stamps), with your photos piled on top
   like a homemade scrapbook page. The back is the craft card's back.

   The recipe (a pile, not a grid):
   1. every photo gets its own cut: a polaroid if it has a caption, otherwise a white-border
      print, a deckled vintage print, a torn-out rip, a rounded snapshot or a bare photo (no cut
      more than twice). About half get tape
   2. one hero at 52–62% of the card's width, the rest 30–46%
   3. each photo tries ~60 random spots, tilted up to ±14° and usually on top but sometimes tucked
      under an earlier one. A spot is out if it covers the middle of any photo (or a polaroid's
      caption), hides more than 30% of a stamp, or leaves more than 18% of the photo (or any of its
      middle) off the card.
      Of the rest, the winner overlaps its neighbours a little (tucked in, not floating) and keeps
      apart from them. Nothing fits: shrink it and try again
   4. the result is saved on the draft (draft.collage = {seed, items}), so arranging by hand sticks
      and only new photos get placed. randomize starts a fresh seed.
   Each photo is drawn once into its own little canvas, so moving one around only re-stacks them. */
const Collage=(()=>{
 const K=1.5,FW=920*K,FH=1360*K,FACE=.275,SW=760,TRIES=60,HANDLE=44,GRAB=100;
 const debug=/[?&]debug=collage/.test(location.search);
 const rngOf=seed=>{let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
 const between=(rng,a,b)=>a+rng()*(b-a);
 const CUTS={polaroid:{m:.055,b:.2},print:{m:.04,b:.04},deckle:{m:.065,b:.065},torn:{m:.035,b:.035},snapshot:{m:.03,b:.03},bare:{m:0,b:0}};
 const LOOSE=['print','deckle','torn','snapshot','bare'];

 /* shapes are {x,y (centre, card px),w,h,r (radians)} */
 function inside(o,x,y){const dx=x-o.x,dy=y-o.y,c=Math.cos(o.r),s=Math.sin(o.r);return Math.abs(dx*c+dy*s)<=o.w/2&&Math.abs(-dx*s+dy*c)<=o.h/2}
 /* n×n points over the part of o from x0..x1, y0..y1 (fractions of its size, -.5 to .5) */
 function grid(o,x0,x1,y0,y1,n=8){const pts=[],c=Math.cos(o.r),s=Math.sin(o.r);
  for(let a=0;a<n;a++)for(let b=0;b<n;b++){const lx=(x0+(a+.5)/n*(x1-x0))*o.w,ly=(y0+(b+.5)/n*(y1-y0))*o.h;pts.push([o.x+lx*c-ly*s,o.y+lx*s+ly*c])}
  return pts}
 /* what must never be covered: the photo's middle, down through the caption on a polaroid */
 const keep=o=>grid(o,-FACE,FACE,-FACE,o.pol?.47:FACE);

 function frameOf(style,p){const c=CUTS[style]||CUTS.print,ar=Math.max(.75,Math.min(1.34,p.w/p.h)),ih=(1-2*c.m)/ar;return{style,pol:style==='polaroid',m:c.m,ih,H:c.m+ih+c.b}}
 const geom=e=>({x:e.it.x*FW,y:e.it.y*FH,w:e.it.s*FW,h:e.it.s*FW*e.f.H,r:e.it.r,pol:e.f.pol});
 /* the crafted card's stamps, which the photos mostly leave alone */
 const stampBoxes=()=>st.stamps.map(s=>{const p=SPOTS[s.spot],[w,h]=stampSize(s.i,SB);return{x:p.x*K,y:p.y*K,w:w*K,h:h*K,r:p.deg*Math.PI/180}});

 /* nobody's middle is covered by anything above it, and every stamp is at least 70% showing */
 function clear(stack,stamps){
  for(let i=0;i<stack.length-1;i++){const above=stack.slice(i+1);if(keep(stack[i]).some(([x,y])=>above.some(q=>inside(q,x,y))))return false}
  return stamps.every(b=>{const pts=grid(b,-.5,.5,-.5,.5,6);return pts.filter(([x,y])=>stack.some(q=>inside(q,x,y))).length<=pts.length*.3})}
 const offCard=o=>{const pts=grid(o,-.5,.5,-.5,.5);return pts.filter(([x,y])=>x<0||x>FW||y<0||y>FH).length/pts.length};

 /* 3. places every item that has no spot yet, keeping the ones that do */
 function placeNew(live,rng){const stamps=stampBoxes(),n=live.length,firstEver=!live.some(e=>e.it.x!=null);
  const todo=live.filter(e=>e.it.x==null).sort(()=>rng()-.5);
  if(firstEver)todo.sort((a,b)=>(b===live[0])-(a===live[0]));
  for(const e of todo){const hero=firstEver&&e===live[0],base=hero?between(rng,.52,.62):between(rng,.3,.46)*(n>4?.85:1);let done=false;
   for(const shrink of [1,.85,.72,.6]){const placed=live.filter(q=>q!==e&&q.it.x!=null).sort((a,b)=>a.it.z-b.it.z),others=placed.map(geom);let best=null,top=-Infinity;
    for(let t=0;t<TRIES;t++){
     const r=(rng()<.15?between(rng,-1.5,1.5):(rng()<.5?-1:1)*between(rng,4,14))*Math.PI/180;
     const it={...e.it,x:between(rng,.1,.9),y:between(rng,.08,.92),s:base*shrink,r},me={...e,it},o=geom(me);
     if(offCard(o)>.18||keep(o).some(([x,y])=>x<0||x>FW||y<0||y>FH))continue;
     const at=placed.length&&rng()<.25?Math.floor(rng()*placed.length):placed.length,order=[...placed.slice(0,at),me,...placed.slice(at)];
     if(!clear(order.map(geom),stamps))continue;
     // tucked in: 10–35% of it overlapping something reads as a pile; far from the others' centres reads as spread out
     const pts=grid(o,-.5,.5,-.5,.5),ov=others.length?pts.filter(([x,y])=>others.some(q=>inside(q,x,y))).length/pts.length:.2;
     const tuck=ov>=.1&&ov<=.35?1:Math.max(0,1-Math.abs(ov-.22)*4);
     const apart=others.length?Math.min(1,Math.min(...others.map(q=>Math.hypot(q.x-o.x,q.y-o.y)))/(FW*.6)):rng();
     const sc=tuck+apart*.6+rng()*.3;if(sc>top){top=sc;best={it,order}}}
    if(best){Object.assign(e.it,best.it);best.order.forEach((q,i)=>{(q.it===best.it?e:q).it.z=i+1});done=true;break}}
   if(!done)Object.assign(e.it,{x:between(rng,.3,.7),y:between(rng,.3,.7),s:base*.6,r:0,z:Math.max(0,...live.map(q=>q.it.z||0))+1})}}

 /* ---------- each photo's cut, drawn once ---------- */
 const poly=(g,pts)=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath()};
 /* an outline that wobbles inward by j(): torn paper (big uneven steps) or a deckled edge (small even scallops) */
 function ragged(w,h,step,j){const pts=[],add=(x,y,nx,ny)=>{const d=j();pts.push([x+nx*d,y+ny*d])};
  for(let x=0;x<w;x+=step)add(x-w/2,-h/2,0,1);for(let y=0;y<h;y+=step)add(w/2,y-h/2,-1,0);
  for(let x=w;x>0;x-=step)add(x-w/2,h/2,0,-1);for(let y=h;y>0;y-=step)add(-w/2,y-h/2,1,0);return pts}
 function tape(g,x,y,len,rot,color){const h=len*.24;g.save();g.translate(x,y);g.rotate(rot);g.globalAlpha=.82;g.fillStyle=color;
  g.beginPath();g.moveTo(-len/2,-h/2);g.lineTo(len/2,-h/2);for(let k=1;k<=4;k++)g.lineTo(len/2-(k%2?h*.17:0),-h/2+h*k/4);
  g.lineTo(-len/2,h/2);for(let k=3;k>=0;k--)g.lineTo(-len/2+(k%2?h*.17:0),-h/2+h*k/4);g.closePath();
  g.shadowColor='rgba(43,16,12,.2)';g.shadowBlur=3;g.shadowOffsetY=1;g.fill();g.restore()}
 const sprites=new Map(),imgs=new Map();
 function sprite(e){const img=imgs.get(e.p.blobId),key=[e.f.style,e.p.caption||'',(e.p.ink||[]).length,e.it.tape,img?1:0].join('|'),old=sprites.get(e.p.id);
  if(old&&old.key===key)return old;
  const w=SW,h=Math.round(SW*e.f.H),pad=Math.round(SW*.14),c=document.createElement('canvas');c.width=w+2*pad;c.height=h+2*pad;
  const g=c.getContext('2d'),rng=rngOf(e.it.tape),f=e.f,m=f.m*w,iw=w-2*m,ih=f.ih*w,ix=-w/2+m,iy=-h/2+m;g.translate(pad+w/2,pad+h/2);
  // the paper it's printed on, with its shadow
  let k=0;const edge=f.style==='torn'?ragged(w,h,14,()=>rng()*11):f.style==='deckle'?ragged(w,h,9,()=>(k++%2?5:0)+rng()*1.5):null;
  const outline=()=>{if(edge)poly(g,edge);else if(f.style==='snapshot')rrect(g,-w/2,-h/2,w,h,w*.045);else{g.beginPath();g.rect(-w/2,-h/2,w,h)}};
  g.save();g.shadowColor='rgba(43,16,12,.32)';g.shadowBlur=w*.035;g.shadowOffsetY=w*.014;outline();
  const gr=g.createLinearGradient(-w/2,-h/2,w/2,h/2);gr.addColorStop(0,'#fffdf4');gr.addColorStop(.55,'#fbf6e6');gr.addColorStop(1,'#f0e7cc');g.fillStyle=f.style==='deckle'?'#f6eedb':gr;g.fill();g.restore();
  // the photo, cropped to fill, with its marker ink; a torn one is ripped again inside its white fringe
  g.save();if(f.style==='torn')poly(g,ragged(iw,ih,14,()=>rng()*9));else if(f.style==='snapshot')rrect(g,ix,iy,iw,ih,w*.03);else{g.beginPath();g.rect(ix,iy,iw,ih)}g.clip();
  if(img&&img.naturalWidth){const s=Math.max(iw/img.naturalWidth,ih/img.naturalHeight),dw=img.naturalWidth*s,dh=img.naturalHeight*s,dx=ix+(iw-dw)/2,dy=iy+(ih-dh)/2;
   g.drawImage(img,dx,dy,dw,dh);
   // old prints have gone a little warm
   if(f.style==='deckle'){g.globalCompositeOperation='multiply';g.fillStyle='rgba(222,196,150,.35)';g.fillRect(ix,iy,iw,ih);g.globalCompositeOperation='source-over'}
   Ink.paint(g,e.p,dx,dy,dw,dh)}
  else{g.fillStyle='#e9e1c4';g.fillRect(ix,iy,iw,ih)}
  g.restore();
  if(f.style!=='bare'&&f.style!=='torn'){outline();g.strokeStyle='rgba(108,44,37,.12)';g.lineWidth=2;g.stroke()}
  if(f.pol){const top=iy+ih,sh=h/2-top,fs=Math.round(sh*.36);let t=e.p.caption.trim();g.font=`500 ${fs}px "EB Garamond",Georgia,serif`;
   while(t.length>1&&g.measureText(t).width>iw*.94)t=t.slice(0,-2)+'…';g.fillStyle='#6C2C25';g.textAlign='center';g.textBaseline='middle';g.fillText(t,0,top+sh*.5)}
  // tape on about half: a strip on an edge or a corner, now and then a second one crossing it
  if(rng()<.5){const hv=Board.hash(e.p.id),T=Board.TAPES,len=w*between(rng,.28,.38),spots=[[0,-h/2,0],[-w/2,-h/2,-45],[w/2,-h/2,45],[0,h/2,0],[-w/2,0,90]],[tx,ty,ta]=spots[Math.floor(rng()*spots.length)];
   const a=(ta+between(rng,-12,12))*Math.PI/180;tape(g,tx+(ta?0:between(rng,-.1,.1)*w),ty,len,a,T[hv%T.length]);
   if(rng()<.3)tape(g,tx,ty,len*.9,a+between(rng,20,35)*Math.PI/180,T[(hv>>3)%T.length])}
  const s={key,c,pad};sprites.set(e.p.id,s);return s}

 /* ---------- state ---------- */
 let d=null,live=[];
 const loadPhoto=p=>Store.url(p.blobId).then(u=>new Promise(r=>{if(!u)return r(null);const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u}));
 /* loads the draft and lays out whatever isn't placed yet (only new photos, unless randomize cleared it) */
 async function prepare(){
  d=await Store.load();await designsReady;while(!ready)await new Promise(r=>setTimeout(r,50));
  const ps=d.photos||[];let c=d.collage;if(!c||!c.items)c=d.collage={seed:0,items:{}};
  for(const id in c.items)if(!ps.some(p=>p.id===id))delete c.items[id];
  const rng=rngOf(Board.hash(d.id+':'+c.seed+':'+Object.keys(c.items).length)),counts={};
  Object.values(c.items).forEach(it=>counts[it.style]=(counts[it.style]||0)+1);
  live=ps.map(p=>{let it=c.items[p.id];
   if(!it){const opts=LOOSE.filter(s=>(counts[s]||0)<2),style=opts[Math.floor(rng()*opts.length)]||'print';counts[style]=(counts[style]||0)+1;it=c.items[p.id]={style,tape:Math.floor(rng()*4294967295)}}
   // a caption added (or cleared) on the board turns it into (or out of) a polaroid
   const cap=!!(p.caption&&p.caption.trim());if(cap)it.style='polaroid';else if(it.style==='polaroid')it.style='print';
   return{p,it,f:frameOf(it.style,p)}});
  if(live.some(e=>e.it.x==null)){placeNew(live,rng);Store.save({collage:c})}
  await Promise.all(ps.filter(p=>!imgs.has(p.blobId)).map(async p=>imgs.set(p.blobId,await loadPhoto(p))))}

 const byId=id=>live.find(e=>e.p.id===id);
 const handleAt=o=>{const c=Math.cos(o.r),s=Math.sin(o.r),hx=o.w/2+18,hy=o.h/2+18;return[o.x+hx*c-hy*s,o.y+hx*s+hy*c]};
 /* the front: the crafted card, then the photos bottom to top; sel gets a dashed outline and a turn/resize handle */
 function draw(cv,sel){const g=cv.getContext('2d');g.drawImage(cfs[st.d],0,0,FW,FH);
  for(const e of [...live].sort((a,b)=>a.it.z-b.it.z)){const s=sprite(e),o=geom(e),k=o.w/SW;
   g.save();g.translate(o.x,o.y);g.rotate(o.r);g.drawImage(s.c,-o.w/2-s.pad*k,-o.h/2-s.pad*k,s.c.width*k,s.c.height*k);
   if(debug){g.setLineDash([12,8]);g.strokeStyle='#EB5E3A';g.lineWidth=3;g.strokeRect(-o.w*FACE,-o.h*FACE,o.w*FACE*2,o.h*(FACE+(o.pol?.47:FACE)))}
   g.restore()}
  if(debug)stampBoxes().forEach(b=>{g.save();g.translate(b.x,b.y);g.rotate(b.r);g.strokeStyle='#7CA2E0';g.lineWidth=3;g.strokeRect(-b.w/2,-b.h/2,b.w,b.h);g.restore()});
  const e=sel&&byId(sel);if(e){const o=geom(e),[hx,hy]=handleAt(o);
   g.save();g.translate(o.x,o.y);g.rotate(o.r);g.setLineDash([18,12]);g.lineWidth=5;g.strokeStyle='rgba(255,253,240,.95)';g.shadowColor='rgba(43,16,12,.45)';g.shadowBlur=6;g.strokeRect(-o.w/2-18,-o.h/2-18,o.w+36,o.h+36);g.restore();
   g.save();g.translate(hx,hy);g.shadowColor='rgba(43,16,12,.35)';g.shadowBlur=10;g.shadowOffsetY=3;g.fillStyle='#fffdf4';g.beginPath();g.arc(0,0,HANDLE,0,7);g.fill();
   g.shadowColor='transparent';g.lineWidth=5;g.strokeStyle='#EB5E3A';g.stroke();
   // two curved arrows: turn and resize
   g.lineWidth=6;g.lineCap='round';g.beginPath();g.arc(0,0,HANDLE*.5,-2.6,-.5);g.stroke();g.beginPath();g.arc(0,0,HANDLE*.5,.55,2.65);g.stroke();g.restore()}}
 /* what's under a card point: the selected one's handle first, then the topmost photo */
 function hit(x,y,sel){const s=sel&&byId(sel);if(s){const[hx,hy]=handleAt(geom(s));if(Math.hypot(x-hx,y-hy)<GRAB)return{id:sel,handle:true}}
  const e=[...live].sort((a,b)=>b.it.z-a.it.z).find(e=>inside(geom(e),x,y));return e?{id:e.p.id}:null}
 function get(id){const e=byId(id);return e&&{...geom(e),s:e.it.s}}
 function move(id,x,y){const e=byId(id);if(e){e.it.x=Math.max(0,Math.min(1,x/FW));e.it.y=Math.max(0,Math.min(1,y/FH))}}
 function turn(id,r,s){const e=byId(id);if(e){e.it.r=r;e.it.s=Math.max(.15,Math.min(.9,s))}}
 function raise(id){const e=byId(id);if(e)e.it.z=Math.max(...live.map(q=>q.it.z||0))+1}
 const save=()=>{if(d)Store.save({collage:d.collage})};
 /* randomize: a fresh seed and nothing placed; hands back the old layout for undo */
 function reshuffle(){const prev=JSON.parse(JSON.stringify(d.collage));d.collage={seed:(prev.seed||0)+1,items:{}};save();return prev}
 function restore(prev){d.collage=prev;save()}
 function back(cv){cv.getContext('2d').drawImage(cb,0,0,cv.width,cv.height)}

 return{W:FW,H:FH,prepare,draw,hit,get,move,turn,raise,save,reshuffle,restore,back};
})();
