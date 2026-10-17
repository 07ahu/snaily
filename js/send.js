/* ---------- next: the postcard flies into the envelope, then the photo board ----------
   The 3D card is swapped for a flat DOM copy of the side that's showing
   (from its 2D texture canvas), which arcs over to the envelope, slips in
   behind its front and the envelope gulps it down. */
(function(){
 const env=$('#env'),view=$('#v-write'),badge=env.querySelector('.env-badge');
 /* the envelope's body in images/envelope.png, as fractions of the image */
 const BODY={l:.03,t:.575,r:.97,b:.975},GROW=2.1,TILT=-4;
 let busy=false;
 const anim=(el,kf,o)=>el.animate(kf,{fill:'forwards',...o});
 const done=a=>a.finished.catch(()=>{});
 const frame=()=>new Promise(r=>requestAnimationFrame(r));
 async function waitIdle(){const t=performance.now();while(!cardIdle()&&performance.now()-t<800)await frame()}

 async function send(){
  if(busy)return;busy=true;
  settleCard();Store.save({design:st.d,to:st.to,message:st.txt});Store.flush();
  await waitIdle();
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){
   await done(anim($('#gl'),[{opacity:1},{opacity:0}],{duration:220}));
   await done(env.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:260}));
   return finish()}
  const shot=cardShot(),vr=view.getBoundingClientRect(),mail=new Image();
  mail.className='mail';mail.alt='';mail.src=shot.src;
  Object.assign(mail.style,{left:shot.left-vr.left+'px',top:shot.top-vr.top+'px',width:shot.width+'px',height:shot.height+'px'});
  view.append(mail);hideCard(true);
  // the envelope wakes up and opens its mouth
  const lift=anim(mail,[{transform:'translate(0,0) scale(1)'},{transform:'translate(0,-12px) scale(1.03)'}],{duration:180,easing:'ease-out'});
  await done(anim(env,[{transform:'scale(1) rotate(0)'},{transform:`scale(${GROW*1.06}) rotate(${TILT-2}deg)`,offset:.7},{transform:`scale(${GROW}) rotate(${TILT}deg)`}],{duration:300,easing:'cubic-bezier(.3,1.2,.5,1)'}));
  await done(lift);
  // aim just above the slot, sized to slip inside
  const er=env.getBoundingClientRect(),bw=(BODY.r-BODY.l)*er.width,bl=er.left+BODY.l*er.width,bt=er.top+BODY.t*er.height,bh=(BODY.b-BODY.t)*er.height;
  const tw=bw*.78,th=tw*shot.height/shot.width,s=tw/shot.width;
  const dx=bl+(bw-tw)/2-shot.left,dy=bt-th+2-shot.top;
  await done(anim(mail,[
   {transform:'translate(0,-12px) scale(1.03) rotate(0deg)'},
   {transform:`translate(${dx*.5}px,${dy*.5-70}px) scale(${(1.03+s)/2}) rotate(-12deg)`,offset:.5},
   {transform:`translate(${dx}px,${dy}px) scale(${s}) rotate(${TILT}deg)`}],{duration:560,easing:'cubic-bezier(.45,.05,.35,1)'}));
  // in it goes, behind the front of the envelope
  const drop=Math.min(th+2,bh-2);
  await done(anim(mail,[{transform:`translate(${dx}px,${dy}px) scale(${s}) rotate(${TILT}deg)`},{transform:`translate(${dx}px,${dy+drop}px) scale(${s}) rotate(${TILT}deg)`}],{duration:240,easing:'cubic-bezier(.6,0,.9,.6)'}));
  mail.remove();
  // gulp, then settle back into the corner
  await done(anim(env,[{transform:`scale(${GROW}) rotate(${TILT}deg)`},{transform:`scale(${GROW*1.12},${GROW*.86}) rotate(${TILT}deg)`,offset:.35},{transform:`scale(${GROW*.94},${GROW*1.08}) rotate(${TILT+2}deg)`,offset:.7},{transform:`scale(${GROW}) rotate(${TILT}deg)`}],{duration:320}));
  badge.hidden=false;
  await done(anim(env,[{transform:`scale(${GROW}) rotate(${TILT}deg)`},{transform:'scale(.92) rotate(3deg)',offset:.75},{transform:'scale(1) rotate(0deg)'}],{duration:340,easing:'cubic-bezier(.4,0,.2,1)'}));
  finish()}

 function finish(){
  location.hash='board';
  setTimeout(()=>{env.getAnimations().forEach(a=>a.cancel());$('#gl').getAnimations().forEach(a=>a.cancel());hideCard(false);busy=false},50)}
 $('#next').onclick=send;env.onclick=send;
 Store.load().then(d=>{if(d.photos&&d.photos.length)badge.hidden=false});
})();
