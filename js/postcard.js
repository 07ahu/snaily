const SNAIL='data:image/png;base64,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';
const N=D.length;
let editing=null;const st={d:0,to:'',txt:'',paper:null,ink:null,stamp:0,spot:0};
/* portrait card: texture size in px, world size, corner radius, thickness */
const W=920,H=1360,CW=2.3,CH=3.4,CR=.17,T=.05;
const cv=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c},cfs=D.map(cv),cb=cv(),img=new Image();
const R={txt:{x:80,y:302,w:760,h:588,lh:84},to:{x:80,y:1020,w:760,h:252,lh:84}};
function rrect(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
/* the chosen stamp, slightly crooked with a little drop shadow; the art is cached per stamp */
/* where a stamp can sit on the front: centre, size of the box it fits in, and its little tilt */
const SPOTS=[{x:W-178,y:190,deg:4},{x:178,y:190,deg:-5},{x:W-178,y:H-200,deg:-3}],SB=230;
/* the stamp's drawn size inside a max×max box, keeping its shape */
function stampSize(i,max){const im=STAMPS[i].image,w=im&&im.naturalWidth||4,h=im&&im.naturalHeight||3,k=max/Math.max(w,h);return[w*k,h*k]}
let art=null;
function stamp(x,cx,cy,max,deg){if(!art||art.i!==st.stamp)art={i:st.stamp,c:stampArt(st.stamp,460,460)};const[w,h]=stampSize(st.stamp,max);x.save();x.translate(cx,cy);x.rotate(deg*Math.PI/180);
 x.shadowColor='rgba(43,16,12,.3)';x.shadowBlur=12;x.shadowOffsetY=5;x.drawImage(art.c,-max/2,-max/2,max,max);x.restore();return[w,h]}
/* while a stamp is being dragged in, the middle card shows where it can land (G.hi is the one under your finger) */
let G=null;
function guides(x){SPOTS.forEach((p,k)=>{x.save();x.translate(p.x,p.y);x.rotate(p.deg*Math.PI/180);x.lineWidth=k===G.hi?7:4;x.setLineDash([16,12]);
 x.strokeStyle=k===G.hi?'rgba(255,253,240,.95)':'rgba(255,253,240,.6)';x.fillStyle=k===G.hi?'rgba(255,253,240,.35)':'rgba(255,253,240,.12)';
 x.shadowColor='rgba(43,16,12,.35)';x.shadowBlur=8;rrect(x,-SB/2,-SB/2,SB,SB,22);x.fill();x.stroke();x.restore()})}
/* until you pick colours, each design keeps its own */
const look=i=>({bg:st.paper||D[i].bg,fg:st.ink||D[i].fg});
/* the art, recoloured when you've picked colours; the untouched pixels are kept so recolouring never compounds */
function front(i){const x=cfs[i].getContext('2d'),d=D[i],p=SPOTS[st.spot]||SPOTS[0];
 if(!d.data){const im=d.image,k=Math.max(W/im.naturalWidth,H/im.naturalHeight)||1,iw=im.naturalWidth*k,ih=im.naturalHeight*k;x.drawImage(im,(W-iw)/2,(H-ih)/2,iw,ih);d.data=x.getImageData(0,0,W,H)}
 const from=d.pal.map(q=>q[1]),to=st.paper?remap(d,st.paper,st.ink):from;
 // recolouring takes a few ms per card, so keep the last result
 const key=to.join();if(!d.cache||d.cache.key!==key)d.cache={key,img:to.some((c,k)=>c!==from[k])?recolor(d.data,from,to):d.data};
 x.putImageData(d.cache.img,0,0);if(G&&i===st.d)guides(x);
 stamp(x,p.x,p.y,G&&i===st.d?SB*.92:SB,p.deg);tfs[i].needsUpdate=true}
function back(){const x=cb.getContext('2d'),L=84,A=R.txt,B=R.to,ink='#6C2C25',on=k=>ed.dataset.k==k&&document.activeElement===ed&&blink;
 x.fillStyle='#fffdf0';x.fillRect(0,0,W,H);
 x.fillStyle=ink;x.globalAlpha=.5;x.font='56px "Instrument Serif",Georgia,serif';x.textBaseline='alphabetic';x.fillText('postcard',A.x,170);x.globalAlpha=1;
 const rule=y=>{x.beginPath();x.moveTo(A.x,y);x.lineTo(A.x+A.w,y);x.stroke()};
 x.strokeStyle='#6C2C2545';x.lineWidth=3;x.setLineDash([]);for(let k=0;k<A.h/L;k++)rule(A.y+k*L+L-14);for(let k=0;k<3;k++)rule(B.y+k*L+L-14);
 x.strokeStyle='#6C2C2599';x.lineWidth=4;x.setLineDash([12,10]);rule(955);x.setLineDash([]);stamp(x,752,150,180,-3);
 x.fillStyle=ink;x.font='500 58px Caveat,cursive';const max=A.h/L;let y=A.y+L-22,cx=A.x,cy=y,n=0;
 if(!st.txt){x.globalAlpha=.35;x.fillText('dear you,',A.x,y);x.globalAlpha=1}
 for(const para of st.txt.split('\n')){let line='';for(const w of para.split(' ')){const t=line?line+' '+w:w;if(x.measureText(t).width>A.w&&line){if(n<max)x.fillText(line,A.x,y);y+=L;n++;line=w}else line=t}if(n<max)x.fillText(line,A.x,y);cx=A.x+x.measureText(line).width;cy=y;y+=L;n++}
 if(on('txt')){x.fillStyle='#EB5E3A';x.fillRect(cx+5,cy-46,4,60)}
 x.fillStyle=ink;if(!st.to)x.globalAlpha=.35;(st.to||'to:').split('\n').slice(0,3).forEach((l,i)=>x.fillText(l,B.x,B.y+L-22+i*L));x.globalAlpha=1;
 if(on('to')){const ls=st.to.split('\n').slice(0,3);x.fillStyle='#EB5E3A';x.fillRect(B.x+(st.to?x.measureText(ls[ls.length-1]).width:0)+5,B.y+L-22+(ls.length-1)*L-46,4,60)}
 tb.needsUpdate=true}
const tex=c=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t},tfs=cfs.map(tex),tb=tex(cb);
const stage=document.getElementById('stage'),canvas=document.getElementById('gl');
const r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});r.outputEncoding=THREE.sRGBEncoding;r.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,50),TAN=Math.tan(17.5*Math.PI/180);
scene.add(new THREE.AmbientLight(0xffffff,.78));const sun=new THREE.DirectionalLight(0xfff4dd,.7);sun.position.set(-3,4,6);scene.add(sun);
/* rounded card: two flat faces with 0–1 UVs, plus the extruded rim for the paper edge */
const shape=new THREE.Shape();{const w=CW/2,h=CH/2,c=CR,P=Math.PI;shape.moveTo(-w+c,-h);shape.lineTo(w-c,-h);shape.absarc(w-c,-h+c,c,-P/2,0,false);shape.lineTo(w,h-c);shape.absarc(w-c,h-c,c,0,P/2,false);shape.lineTo(-w+c,h);shape.absarc(-w+c,h-c,c,P/2,P,false);shape.lineTo(-w,-h+c);shape.absarc(-w+c,-h+c,c,P,P*1.5,false)}
const faceGeo=new THREE.ShapeGeometry(shape,10);{const p=faceGeo.attributes.position,uv=faceGeo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,p.getX(i)/CW+.5,p.getY(i)/CH+.5)}
const edgeGeo=new THREE.ExtrudeGeometry(shape,{depth:T,bevelEnabled:false,curveSegments:10});edgeGeo.translate(0,0,-T/2);
const edge=new THREE.MeshStandardMaterial({color:0xe9e1b0,roughness:.9}),none=new THREE.MeshBasicMaterial({visible:false}),face=m=>new THREE.MeshStandardMaterial({map:m,roughness:.7});
/* a soft rounded shadow floating behind each card */
const sc=document.createElement('canvas');sc.width=256;sc.height=352;{const g=sc.getContext('2d');g.shadowColor='rgba(43,16,12,.5)';g.shadowBlur=34;g.shadowOffsetX=1000;g.fillStyle='#000';rrect(g,48-1000,48,160,256,14);g.fill()}
const shGeo=new THREE.PlaneGeometry(CW*256/160,CH*352/256),shMat=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,depthWrite:false});
const cards=D.map((d,i)=>{const o=new THREE.Group(),f=new THREE.Group(),fm=face(tfs[i]),bm=face(tb),fr=new THREE.Mesh(faceGeo,fm),bk=new THREE.Mesh(faceGeo,bm),s=new THREE.Mesh(shGeo,shMat);
 fr.position.z=T/2+.001;bk.rotation.y=Math.PI;bk.position.z=-T/2-.001;f.add(fr,bk,new THREE.Mesh(edgeGeo,[none,edge]));s.position.set(.1,-.18,-.4);o.add(s,f);scene.add(o);return{o,f,s,fm,bm}});
let gap=2.6;
function size(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;
 cam.position.z=Math.max(CH*1.14/(2*TAN),CW*1.25/(2*TAN*cam.aspect));cam.updateProjectionMatrix();
 // neighbours peek in from the edges on a phone, and sit a little apart on wider screens
 const hw=TAN*cam.position.z*cam.aspect;gap=Math.min(Math.max(CW*1.08,hw+CW*.24),CW*1.3)}
const pxPer=()=>stage.clientHeight/(2*TAN*cam.position.z);
addEventListener('resize',size);
if(window.visualViewport){const vv=()=>{size();if(editing)place(editing)};visualViewport.addEventListener('resize',vv);visualViewport.addEventListener('scroll',vv)}
/* the carousel: pos glides toward target; st.d is the card in the middle */
let ry=0,rx=0,vy=0,vx=0,drag=false,mode=null,px=0,py=0,hx=0,hy=0,thx=0,thy=0,pos=0,target=0,pos0=0,sv=0,lx=0,lt=0,hidden=false;const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
canvas.addEventListener('pointerdown',e=>{e.preventDefault();vy=vx=0;drag=true;mode=null;px=dx0=lx=e.clientX;py=dy0=e.clientY;tt=lt=performance.now();pos0=pos;sv=0;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{const b=canvas.getBoundingClientRect();if(!drag)canvas.style.cursor=hit(e.clientX,e.clientY)?'text':'';thx=((e.clientX-b.left)/b.width-.5);thy=((e.clientY-b.top)/b.height-.5);
 if(!drag)return;const dx=e.clientX-dx0,dy=e.clientY-dy0;
 // the first few pixels decide: sideways on the front browses cards, anything else spins the card
 if(!mode){if(Math.hypot(dx,dy)<8)return;mode=!onBack()&&Math.abs(dx)>Math.abs(dy)?'swipe':'spin';px=e.clientX;py=e.clientY;if(mode==='swipe'&&document.activeElement===ed)ed.blur()}
 if(mode==='swipe'){pos=pos0-dx/(gap*pxPer());const t=performance.now();sv=(lx-e.clientX)/(gap*pxPer())/Math.max(8,t-lt)*1000;lx=e.clientX;lt=t;return}
 vy=(e.clientX-px)*.011;vx=(e.clientY-py)*.007;ry+=vy;rx=Math.max(-.7,Math.min(.7,rx+vx));px=e.clientX;py=e.clientY});
const up=()=>drag=false;
canvas.addEventListener('pointerup',e=>{up();if(mode==='swipe'){const base=Math.round(pos0),fl=Math.abs(sv)>1.2?Math.sign(sv):0;choose(fl?base+fl:Math.round(pos))}
 else if(!mode&&performance.now()-tt<500)tap(e.clientX,e.clientY);mode=null});
canvas.addEventListener('pointercancel',()=>{up();if(mode==='swipe')choose(Math.round(pos));mode=null});canvas.addEventListener('pointerleave',()=>{thx=thy=0});
function choose(t){target=t;const i=((t%N)+N)%N;if(i===st.d)return;if(document.activeElement===ed)ed.blur();st.d=i;ry=rx=vy=0;Store.save({design:i});label()}
document.getElementById('shuffle').onclick=()=>{const step=1+Math.floor(Math.random()*(N-1));choose(Math.round(target)+step+(calm?0:N))};
addEventListener('keydown',e=>{if(!writeOn||editing||onBack()||/^(INPUT|TEXTAREA)$/.test(e.target.tagName))return;if(e.key==='ArrowLeft')choose(Math.round(target)-1);if(e.key==='ArrowRight')choose(Math.round(target)+1)});
const nameEl=document.getElementById('cname'),hintEl=document.getElementById('hint');let hintTxt='';
function label(){nameEl.textContent=D[st.d].name;dispatchEvent(new Event('snaily:card'))}
let note=null;
/* a short-lived line on the front, e.g. after picking a stamp */
function noteHint(s,ms=3200){note={s,until:performance.now()+ms}}
function hint(){const s=!onBack()?(note&&performance.now()<note.until?note.s:''):document.activeElement===ed?(st.txt?'tap next when you\'re done':'start typing your message…'):'tap the lines to start typing';
 if(s!==hintTxt){hintTxt=s;hintEl.textContent=s;if(!calm)hintEl.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'})}}
function tick(t){if(!writeOn){running=false;return}requestAnimationFrame(tick);
 const sb=settled()&&onBack();if(sb&&!editing&&!auto){auto=true;edit('txt')}if(!sb)auto=false;if(settled()&&!onBack()&&document.activeElement===ed)ed.blur();const bl=((t/530|0)&1)==0;if(document.activeElement===ed&&bl!==blink){blink=bl;back()}
 if(!drag){ry+=vy;vy*=.93;if(Math.abs(vy)<.012){const tg=Math.round(ry/Math.PI)*Math.PI;ry+=(tg-ry)*.09}rx+=(0-rx)*.07}
 if(mode!=='swipe')pos+=(target-pos)*(calm?1:.14);
 hx+=(thx-hx)*.1;hy+=(thy-hy)*.1;lift+=((drag&&mode==='spin'?1:0)-lift)*.15;
 const turn=Math.abs(Math.sin(ry/2));
 cards.forEach((c,i)=>{const d=((i-pos)%N+N*1.5)%N-N/2,a=Math.abs(d),k=Math.min(a,1),fade=a>1.2?Math.max(0,(2-a)/.8):1,mid=i===st.d;
  c.o.visible=fade>0&&!(mid&&hidden);
  // the middle card straightens up when it turns over, so the back reads level
  c.o.position.set(d*gap,mid?lift*.06:0,-k*.6);c.o.rotation.set(0,-d*.2,D[i].tilt*Math.PI/180*(mid?1-turn:1));c.o.scale.setScalar((1-.12*k)*fade*(mid?1+lift*.04:1));
  if(mid)c.f.rotation.set(rx+hy*.22*(1-k),ry+hx*.3*(1-k),0);else c.f.rotation.set(0,0,0);
  c.s.scale.x=Math.max(.12,Math.abs(Math.cos(c.f.rotation.y)));
  const g=1-.3*k;c.fm.color.setScalar(g);c.bm.color.setScalar(g)});
 hint();r.render(scene,cam)}
let dx0=0,dy0=0,tt=0,auto=false,blink=true,lift=0;
const ed=document.getElementById('ed'),v3=new THREE.Vector3();
const scr=(u,v)=>{v3.set((.5-u/W)*CW,(.5-v/H)*CH,-T/2);cards[st.d].f.localToWorld(v3);v3.project(cam);return[(v3.x+1)/2*stage.clientWidth,(1-v3.y)/2*stage.clientHeight]};
const settled=()=>!drag&&Math.abs(pos-target)<.01&&Math.abs(vy)<.012&&Math.abs(rx)<.03&&Math.abs(ry-Math.round(ry/Math.PI)*Math.PI)<.04;
const onBack=()=>Math.abs(Math.round(ry/Math.PI))%2==1;
const hit=(cx,cy)=>{if(!settled()||!onBack())return;const bb=canvas.getBoundingClientRect(),X=cx-bb.left,Y=cy-bb.top;for(const k in R){const g=R[k],[a,b2]=scr(g.x,g.y),[c,d]=scr(g.x+g.w,g.y+g.h);if(X>=a&&X<=c&&Y>=b2&&Y<=d)return k}};
function place(k){const g=R[k],[x0,y0]=scr(g.x,g.y),[x1,y1]=scr(g.x+g.w,g.y+g.h),s=(x1-x0)/g.w;
 Object.assign(ed.style,{display:'block',left:x0+'px',top:y0+'px',width:(x1-x0)+'px',height:(y1-y0)+'px',fontSize:Math.max(16,58*s)+'px',lineHeight:g.lh*s+'px'})}
function edit(k){editing=k;ed.dataset.k=k;place(k);
 ed.value=st[k];ed.placeholder=k=='txt'?'dear you,':'to:';ed.maxLength=k=='txt'?220:60;
 ed.oninput=()=>{if(k=='to')ed.value=ed.value.split('\n').slice(0,3).join('\n');st[k]=ed.value;Store.save(k=='to'?{to:ed.value}:{message:ed.value});blink=true;back()};
 ed.focus();ed.setSelectionRange(ed.value.length,ed.value.length);blink=true;back()}
ed.onblur=()=>{ed.style.display='none';editing=null;back()};ed.onkeydown=e=>{if(/^(Arrow|Home|End|Page)/.test(e.key))e.preventDefault()};
/* a tap on a peeking neighbour brings it to the middle; on the front a tap flips; on the back it picks a field */
function tap(cx,cy){if(!settled())return;const bb=canvas.getBoundingClientRect(),X=cx-bb.left,Y=cy-bb.top;
 if(!onBack()){const k=stampAt(cx,cy);if(k){st.spot=(st.spot+1)%SPOTS.length;Store.save({spot:st.spot});front(st.d);return}
  const xs=[[0,0],[W,0],[0,H],[W,H]].map(([u,v])=>scr(u,v)[0]);if(X<Math.min(...xs))return choose(Math.round(target)-1);if(X>Math.max(...xs))return choose(Math.round(target)+1);vy=.34;return}
 for(const k in R){const g=R[k],[a,b2]=scr(g.x,g.y),[c,d]=scr(g.x+g.w,g.y+g.h);if(X>=a&&X<=c&&Y>=b2&&Y<=d)return edit(k)}}
let running=false,writeOn=false,ready=false;
function run(){if(!ready||!writeOn)return;size();if(!running){running=true;requestAnimationFrame(tick)}}
function setWrite(v){writeOn=v;if(v)run();else if(document.activeElement===ed)ed.blur()}
function start(){Store.load().then(d=>{st.to=d.to||'';st.txt=d.message||'';st.d=D[d.design]?d.design:0;if(inkName(d.paper)&&inkName(d.ink)){st.paper=d.paper;st.ink=d.ink}st.stamp=STAMPS[d.stamp]?d.stamp:0;st.spot=SPOTS[d.spot]?d.spot:0;pos=target=st.d;D.forEach((_,i)=>front(i));label();ready=true;back();run()})}
/* the front face, texture px → screen px inside the stage */
const scrF=(u,v)=>{v3.set((u/W-.5)*CW,(.5-v/H)*CH,T/2);cards[st.d].f.localToWorld(v3);v3.project(cam);return[(v3.x+1)/2*stage.clientWidth,(1-v3.y)/2*stage.clientHeight]};
/* is this screen point on the stamp of the middle card's front? */
function stampAt(cx,cy){if(onBack())return false;const p=SPOTS[st.spot]||SPOTS[0],[w,h]=stampSize(st.stamp,SB),bb=canvas.getBoundingClientRect(),[a,b]=scrF(p.x-w/2-20,p.y-h/2-20),[c,d]=scrF(p.x+w/2+20,p.y+h/2+20);
 const X=cx-bb.left,Y=cy-bb.top;return X>=Math.min(a,c)&&X<=Math.max(a,c)&&Y>=Math.min(b,d)&&Y<=Math.max(b,d)}
/* for dragging a stamp onto the card (js/craft.js): spot centres in page px, the drop guides, and placing it */
function spotCentres(){const bb=canvas.getBoundingClientRect();return SPOTS.map(p=>{const[x,y]=scrF(p.x,p.y);return{x:bb.left+x,y:bb.top+y}})}
function stampGuides(on,hi=-1){if(on&&onBack()){vy=.34;vx=0}const was=G;G=on?{hi}:null;if(on||was)front(st.d)}
function placeStamp(i,spot){st.stamp=i;if(spot!=null)st.spot=spot;G=null;Store.save({stamp:st.stamp,spot:st.spot});D.forEach((_,k)=>front(k));back()}
/* for the send-to-envelope flight (js/send.js) */
function cardIdle(){return settled()}
function settleCard(){vy=0;if(document.activeElement===ed)ed.blur()}
function hideCard(v){hidden=v}
function cardShot(){
 const src=(onBack()?cb:cfs[st.d]).toDataURL('image/jpeg',.9),b=stage.getBoundingClientRect();
 const pts=[[0,0],[W,0],[0,H],[W,H]].map(([u,v])=>scr(u,v)),xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
 return{src,left:b.left+Math.min(...xs),top:b.top+Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)}}
img.onload=()=>Promise.all([document.fonts.load('40px "Instrument Serif"'),document.fonts.load('500 40px Caveat'),designsReady]).catch(()=>{}).then(start);img.src=SNAIL;
