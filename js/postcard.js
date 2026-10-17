const SNAIL='data:image/png;base64,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';
const K={b:'#7CA2E0',o:'#6C2C25',c:'#F2EDBD',t:'#EB5E3A'};
const D=[{bg:K.t,fg:K.c,t:['greetings from','somewhere slow']},{bg:K.b,fg:K.o,t:['wish you','were here']},{bg:K.c,fg:K.o,t:['thinking','of you']},{bg:K.o,fg:K.c,t:['a note from','me to you']}];
let editing=null;const st={d:0,to:'',txt:''};
const W=1360,H=920,cv=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c},cf=cv(),cb=cv(),img=new Image();
function snail(x,col,px,py,w){const t=document.createElement('canvas');t.width=w;t.height=w/1.75;const g=t.getContext('2d');g.drawImage(img,0,0,t.width,t.height);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,t.width,t.height);x.drawImage(t,px,py)}
function front(){const x=cf.getContext('2d'),d=D[st.d];x.fillStyle=d.bg;x.fillRect(0,0,W,H);x.strokeStyle=d.fg;x.globalAlpha=.45;x.setLineDash([16,13]);x.lineWidth=5;x.strokeRect(46,46,W-92,H-92);x.globalAlpha=1;x.setLineDash([]);
 x.fillStyle=d.fg;x.font='600 132px Fraunces,Georgia,serif';x.textBaseline='top';d.t.forEach((l,i)=>x.fillText(l,110,120+i*150));snail(x,d.fg,W-540,H-390,400);tf.needsUpdate=true}
function back(){const x=cb.getContext('2d');x.fillStyle='#fffdf0';x.fillRect(0,0,W,H);x.strokeStyle='#6C2C2545';x.lineWidth=3;x.setLineDash([]);
 const L=84,top=150,mw=760;for(let y=top;y<H-90;y+=L){x.beginPath();x.moveTo(90,y+L-14);x.lineTo(90+mw,y+L-14);x.stroke()}
 x.beginPath();x.moveTo(930,90);x.lineTo(930,H-90);x.stroke();
 x.fillStyle='#6C2C25';x.font='500 58px Caveat,cursive';x.textBaseline='alphabetic';let y=top+L-22,cx=90,cy=y;
 if(!st.txt){x.globalAlpha=.35;x.fillText('dear you,',90,y);x.globalAlpha=1}for(const para of st.txt.split('\n')){let line='';for(const w of para.split(' ')){const t=line?line+' '+w:w;if(x.measureText(t).width>mw&&line){x.fillText(line,90,y);y+=L;line=w}else line=t}x.fillText(line,90,y);cx=90+x.measureText(line).width;cy=y;y+=L}
 if(ed.dataset.k=='txt'&&document.activeElement===ed&&blink){x.fillStyle='#EB5E3A';x.fillRect(cx+5,cy-46,4,60)}x.setLineDash([12,10]);x.lineWidth=4;x.strokeStyle='#6C2C2599';x.strokeRect(1130,90,150,180);x.setLineDash([]);snail(x,'#6C2C25',1152,140,106);
 {x.fillStyle='#6C2C25';x.font='500 58px Caveat,cursive';if(!st.to)x.globalAlpha=.35;(st.to||'to:').split('\n').slice(0,3).forEach((l,i)=>x.fillText(l,985,458+i*96));x.globalAlpha=1;if(ed.dataset.k=='to'&&document.activeElement===ed&&blink){const ls=st.to.split('\n').slice(0,3);x.fillStyle='#EB5E3A';x.fillRect(985+(st.to?x.measureText(ls[ls.length-1]).width:0)+5,458+(ls.length-1)*96-46,4,60)}}
 x.strokeStyle='#6C2C2555';x.lineWidth=3;for(let i=0;i<3;i++){x.beginPath();x.moveTo(980,470+i*96);x.lineTo(1280,470+i*96);x.stroke()}
 tb.needsUpdate=true}
const tex=c=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t},tf=tex(cf),tb=tex(cb);
const stage=document.getElementById('stage'),canvas=document.getElementById('gl');
const r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});r.outputEncoding=THREE.sRGBEncoding;r.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,50);
scene.add(new THREE.AmbientLight(0xffffff,.78));const sun=new THREE.DirectionalLight(0xfff4dd,.7);sun.position.set(-3,4,6);scene.add(sun);
const edge=new THREE.MeshStandardMaterial({color:0xe9e1b0,roughness:.9}),face=m=>new THREE.MeshStandardMaterial({map:m,roughness:.85});
const card=new THREE.Mesh(new THREE.BoxGeometry(3.4,2.3,.05),[edge,edge,edge,edge,face(tf),face(tb)]),grp=new THREE.Group();grp.add(card);scene.add(grp);
const sc=document.createElement('canvas');sc.width=sc.height=128;{const g=sc.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(60,20,15,.5)');gr.addColorStop(1,'rgba(60,20,15,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)}
const sh=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=-1.85;scene.add(sh);
function size(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.position.z=Math.max(cam.aspect<1.25?5:7,3.4*(cam.aspect<1.25?1.12:1.35)/(2*Math.tan(17.5*Math.PI/180)*cam.aspect));cam.updateProjectionMatrix()}
addEventListener('resize',size);
if(window.visualViewport){const vv=()=>{size();if(editing)place(editing)};visualViewport.addEventListener('resize',vv);visualViewport.addEventListener('scroll',vv)}
let ry=0,rx=0,vy=0,vx=0,drag=false,px=0,py=0,hx=0,hy=0,thx=0,thy=0,t0=0;const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
canvas.addEventListener('pointerdown',e=>{e.preventDefault();vy=vx=0;drag=true;px=dx0=e.clientX;py=dy0=e.clientY;tt=performance.now();canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{const b=canvas.getBoundingClientRect();if(!drag)canvas.style.cursor=hit(e.clientX,e.clientY)?'text':'';thx=((e.clientX-b.left)/b.width-.5);thy=((e.clientY-b.top)/b.height-.5);
 if(!drag)return;vy=(e.clientX-px)*.011;vx=(e.clientY-py)*.007;ry+=vy;rx=Math.max(-.7,Math.min(.7,rx+vx));px=e.clientX;py=e.clientY});
const up=()=>drag=false;canvas.addEventListener('pointerup',e=>{up();if(Math.hypot(e.clientX-dx0,e.clientY-dy0)<6&&performance.now()-tt<500)tap(e.clientX,e.clientY)});canvas.addEventListener('pointercancel',up);canvas.addEventListener('pointerleave',()=>{thx=thy=0});
document.getElementById('flip').onclick=()=>{vy=.34;vx=0};
function tick(t){if(!writeOn){running=false;return}requestAnimationFrame(tick);
 const sb=settled()&&onBack();if(sb&&!editing&&!auto){auto=true;edit('txt')}if(!sb)auto=false;if(settled()&&!onBack()&&document.activeElement===ed)ed.blur();const bl=((t/530|0)&1)==0;if(document.activeElement===ed&&bl!==blink){blink=bl;back()}
 if(!drag){ry+=vy;vy*=.93;if(Math.abs(vy)<.012){const tg=Math.round(ry/Math.PI)*Math.PI;ry+=(tg-ry)*.09}rx+=(0-rx)*.07}
 hx+=(thx-hx)*.1;hy+=(thy-hy)*.1;const bob=0;
 grp.rotation.set(rx+hy*.22,ry+hx*.3,0);lift+=((drag?1:0)-lift)*.15;grp.position.y=bob+lift*.06;grp.scale.setScalar(1+lift*.04);
 sh.material.opacity=.7-Math.abs(bob)*2;r.render(scene,cam)}
const dots=document.getElementById('dots');
D.forEach((d,i)=>{const b=document.createElement('button');b.className='dot'+(i?'':' on');b.style.setProperty('--c',d.bg);b.setAttribute('aria-label','design '+(i+1));
 b.onclick=()=>{st.d=i;[...dots.children].forEach((x,j)=>x.classList.toggle('on',j==i));front()};dots.append(b)});
let dx0=0,dy0=0,tt=0,auto=false,blink=true,lift=0;
const ed=document.getElementById('ed'),R={txt:{x:90,y:152,w:760,h:H-240,lh:84},to:{x:985,y:392,w:300,h:290,lh:96}},v3=new THREE.Vector3();
const scr=(u,v)=>{v3.set((.5-u/W)*3.4,(.5-v/H)*2.3,-.026);card.localToWorld(v3);v3.project(cam);return[(v3.x+1)/2*stage.clientWidth,(1-v3.y)/2*stage.clientHeight]};
const settled=()=>!drag&&Math.abs(vy)<.012&&Math.abs(rx)<.03&&Math.abs(ry-Math.round(ry/Math.PI)*Math.PI)<.04;
const onBack=()=>Math.abs(Math.round(ry/Math.PI))%2==1;
const hit=(cx,cy)=>{if(!settled()||!onBack())return;const bb=canvas.getBoundingClientRect(),X=cx-bb.left,Y=cy-bb.top;for(const k in R){const g=R[k],[a,b2]=scr(g.x,g.y),[c,d]=scr(g.x+g.w,g.y+g.h);if(X>=a&&X<=c&&Y>=b2&&Y<=d)return k}};
function place(k){const g=R[k],[x0,y0]=scr(g.x,g.y),[x1,y1]=scr(g.x+g.w,g.y+g.h),s=(x1-x0)/g.w;
 Object.assign(ed.style,{display:'block',left:x0+'px',top:y0+'px',width:(x1-x0)+'px',height:(y1-y0)+'px',fontSize:Math.max(16,58*s)+'px',lineHeight:g.lh*s+'px'})}
function edit(k){editing=k;ed.dataset.k=k;place(k);
 ed.value=st[k];ed.placeholder=k=='txt'?'dear you,':'to:';ed.maxLength=k=='txt'?260:60;
 ed.oninput=()=>{if(k=='to')ed.value=ed.value.split('\n').slice(0,3).join('\n');st[k]=ed.value;blink=true;back()};
 ed.focus();ed.setSelectionRange(ed.value.length,ed.value.length);blink=true;back()}
ed.onblur=()=>{ed.style.display='none';editing=null;back()};ed.onkeydown=e=>{if(/^(Arrow|Home|End|Page)/.test(e.key))e.preventDefault()};
function tap(cx,cy){if(!settled())return;if(!onBack()){vy=.34;return}
 const bb=canvas.getBoundingClientRect(),X=cx-bb.left,Y=cy-bb.top;
 for(const k in R){const g=R[k],[a,b2]=scr(g.x,g.y),[c,d]=scr(g.x+g.w,g.y+g.h);if(X>=a&&X<=c&&Y>=b2&&Y<=d)return edit(k)}}
let running=false,writeOn=false,ready=false;
function run(){if(!ready||!writeOn)return;size();if(!running){running=true;requestAnimationFrame(tick)}}
function setWrite(v){writeOn=v;if(v)run();else if(document.activeElement===ed)ed.blur()}
function start(){ready=true;front();back();run()}
img.onload=()=>Promise.all([document.fonts.load('600 40px Fraunces'),document.fonts.load('500 40px Caveat')]).catch(()=>{}).then(start);img.src=SNAIL;
