/* ---------- craft tray (after Lost Post): colours on the left, stamps on the right ----------
   Paper and ink are two circles; each opens a row of inks above it.
   Stamps show two tiles and a + for the rest. A card holds up to one stamp per spot:
   tap a tile to stick it on (tap again to peel it off), or drag a tile, from the
   row or the + menu, and drop it on one of the spots. Picks redraw the
   cards (js/postcard.js) and are saved with the draft. */
(function(){
 const cP=$('#cPaper'),cI=$('#cInk'),pC=$('#pColors'),pS=$('#pStamps'),row=$('#sRow'),calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 let open=null,opener=null,which='paper',shown=[0,1];
 function close(){if(!open)return;open.hidden=true;[cP,cI,row.querySelector('.plus')].forEach(b=>b&&b.setAttribute('aria-expanded','false'));open=opener=null}
 function show(p,b){const same=open===p&&opener===b;close();if(same)return;p.hidden=false;b.setAttribute('aria-expanded','true');open=p;opener=b}
 // a tap anywhere else (the card included) puts the popover away
 document.addEventListener('pointerdown',e=>{if(open&&!open.contains(e.target)&&!(e.target.closest&&e.target.closest('.swatch,.plus')))close()},true);
 addEventListener('keydown',e=>{if(e.key==='Escape'&&open){const b=opener;close();b.focus()}});
 addEventListener('snaily:view',close);
 const pop=el=>{if(!calm)el.animate([{transform:'scale(1)'},{transform:'scale(1.15)',offset:.4},{transform:'scale(1)'}],{duration:300,easing:'cubic-bezier(.3,1.4,.5,1)'})};
 const redraw=()=>D.forEach((_,i)=>front(i));

 /* colours: one row of inks for whichever circle you tapped; picking the other's colour swaps them */
 function paintInks(){const{bg,fg}=look(st.d),cur=which==='paper'?bg:fg;
  pC.setAttribute('aria-label',which+' color');
  pC.innerHTML=`<span class="pop-k">${which}</span><div class="sws">${INKS.map(n=>`<button class="sw" data-c="${n.c}" style="--c:${n.c}" aria-label="${n.name}" aria-pressed="${n.c===cur}"></button>`).join('')}</div>`+
   (st.paper?'<button class="reset" aria-label="Back to the original colors" title="original colors"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg></button>':'')}
 [cP,cI].forEach(b=>b.onclick=()=>{which=b.dataset.k;paintInks();show(pC,b)});
 pC.onclick=e=>{if(e.target.closest('.reset')){st.paper=st.ink=null;Store.save({paper:null,ink:null});redraw();sync();paintInks();pop(cP);pop(cI);return}
  const b=e.target.closest('.sw');if(!b)return;const c=b.dataset.c,cur=look(st.d);let paper=st.paper||cur.bg,ink=st.ink||cur.fg;
  if(which==='paper'){if(c===ink)ink=paper;paper=c}else{if(c===paper)paper=ink;ink=c}
  st.paper=paper;st.ink=ink;Store.save({paper,ink});redraw();sync();paintInks();pop(which==='paper'?cP:cI)};

 /* stamps: two tiles plus a + that opens the whole set; a tile is pressed while that stamp is on the card */
 const on=i=>st.stamps.some(s=>s.i===i);
 const tile=i=>`<button class="tile" data-i="${i}" aria-label="${STAMPS[i].name} stamp" aria-pressed="${on(i)}"><img src="${STAMPS[i].thumb}" alt="" draggable="false"></button>`;
 function paintRow(){if(!STAMPS[0].thumb)return;const last=st.stamps.length?st.stamps[st.stamps.length-1].i:null;if(last!=null&&!shown.includes(last))shown=[last,shown[0]];
  row.innerHTML=shown.map(tile).join('')+`<button class="tile plus" aria-label="More stamps" aria-haspopup="true" aria-expanded="${open===pS}" aria-controls="pStamps"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>`;
  pS.innerHTML=STAMPS.map((_,i)=>tile(i)).join('')}
 const popTile=i=>{const t=row.querySelector(`.tile[data-i="${i}"]`);if(t)pop(t)};
 function toggle(i){if(on(i))peel(s=>s.i===i);else{placeStamp(i);noteHint('tap a stamp on the card to peel it off')}popTile(i)}
 pS.onclick=e=>{const b=e.target.closest('.tile');if(!b||dragged)return;close();toggle(+b.dataset.i)};
 row.addEventListener('click',e=>{const b=e.target.closest('.tile');if(!b)return;if(b.classList.contains('plus'))return show(pS,b);if(dragged){dragged=false;return}toggle(+b.dataset.i)});

 /* dragging a tile onto the card: a copy follows your finger, the card shows its spots, the nearest one lights up.
    The + menu fades out of the way while you drag from it, and closes once you let go. */
 let drag=null,dragged=false;
 function down(e){const b=e.target.closest('.tile:not(.plus)');if(!b||e.button>0)return;drag={i:+b.dataset.i,x:e.clientX,y:e.clientY,on:false,hi:-1};
  addEventListener('pointermove',move);addEventListener('pointerup',drop);addEventListener('pointercancel',cancel)}
 row.addEventListener('pointerdown',down);pS.addEventListener('pointerdown',down);
 function move(e){if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.on){if(Math.hypot(dx,dy)<8)return;drag.on=true;if(open===pS)pS.classList.add('lifting');else close();
   const g=drag.g=new Image();g.className='drag-ghost';g.src=STAMPS[drag.i].thumb;g.alt='';document.body.append(g);stampGuides(true)}
  drag.g.style.transform=`translate(${e.clientX-36}px,${e.clientY-36}px) rotate(${Math.max(-12,Math.min(12,dx*.05))}deg)`;
  // the nearest spot wins while you're over the card
  let hi=-1,best=150;spotCentres().forEach((c,k)=>{const d=Math.hypot(c.x-e.clientX,c.y-e.clientY);if(d<best){best=d;hi=k}});
  if(hi!==drag.hi){drag.hi=hi;stampGuides(true,hi)}}
 const drop=()=>endDrag(true),cancel=()=>endDrag(false);
 function endDrag(ok){removeEventListener('pointermove',move);removeEventListener('pointerup',drop);removeEventListener('pointercancel',cancel);
  if(!drag)return;const d=drag;drag=null;if(!d.on)return;dragged=true;setTimeout(()=>dragged=false,0);
  if(pS.classList.contains('lifting')){pS.classList.remove('lifting');close()}
  const gone=a=>a?a.finished.then(()=>d.g.remove(),()=>d.g.remove()):d.g.remove();
  if(ok&&d.hi>=0){const c=spotCentres()[d.hi];
   gone(calm?null:d.g.animate([{transform:d.g.style.transform,opacity:1},{transform:`translate(${c.x-36}px,${c.y-36}px) scale(.9)`,opacity:.2}],{duration:180,easing:'ease-in',fill:'forwards'}));placeStamp(d.i,d.hi);popTile(d.i)}
  else{stampGuides(false);gone(calm?null:d.g.animate([{transform:d.g.style.transform,opacity:1},{transform:d.g.style.transform+' scale(.6)',opacity:0}],{duration:160,fill:'forwards'}))}}

 /* the circles always show what the middle card is wearing */
 function sync(){const{bg,fg}=look(st.d);cP.style.setProperty('--c',bg);cI.style.setProperty('--c',fg);
  [...row.querySelectorAll('.tile:not(.plus)'),...pS.querySelectorAll('.tile')].forEach(b=>b.setAttribute('aria-pressed',on(+b.dataset.i)))}
 addEventListener('snaily:card',()=>{paintRow();sync();if(open===pC)paintInks()});
 addEventListener('snaily:stamps',()=>{paintRow();sync()});
 designsReady.then(()=>{paintRow();sync()});
})();
