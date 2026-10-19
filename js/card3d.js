/* ---------- a postcard you can hold: the 3D card shared by the review step and the link page ----------
   Same build as the craft card (rounded faces, paper edge, floating shadow): drag to turn it,
   momentum coasts and it settles on the nearer side, a tap flips it. Faces come from two canvases;
   call front()/back() after drawing on them. Setting `flat` lays it level and stops the spinning
   (the review's arrange mode), and `hooks` ({down,move,up}) then gets the pointer instead. */
function Card3D(stage,canvas,fc,bc){
 const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const CW=2.3,CH=3.4,CR=.17,T=.05,TAN=Math.tan(17.5*Math.PI/180),TILT=-2*Math.PI/180,TURN=2*Math.PI;
 const r=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});r.outputEncoding=THREE.sRGBEncoding;r.setPixelRatio(Math.min(devicePixelRatio,2));
 const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,50);
 scene.add(new THREE.AmbientLight(0xffffff,.78));const sun=new THREE.DirectionalLight(0xfff4dd,.7);sun.position.set(-3,4,6);scene.add(sun);
 const tex=c=>{const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t},tf=tex(fc),tb=tex(bc);
 const shape=new THREE.Shape();{const w=CW/2,h=CH/2,c=CR,P=Math.PI;shape.moveTo(-w+c,-h);shape.lineTo(w-c,-h);shape.absarc(w-c,-h+c,c,-P/2,0,false);shape.lineTo(w,h-c);shape.absarc(w-c,h-c,c,0,P/2,false);shape.lineTo(-w+c,h);shape.absarc(-w+c,h-c,c,P/2,P,false);shape.lineTo(-w,-h+c);shape.absarc(-w+c,-h+c,c,P,P*1.5,false)}
 const faceGeo=new THREE.ShapeGeometry(shape,10);{const p=faceGeo.attributes.position,uv=faceGeo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,p.getX(i)/CW+.5,p.getY(i)/CH+.5)}
 const edgeGeo=new THREE.ExtrudeGeometry(shape,{depth:T,bevelEnabled:false,curveSegments:10});edgeGeo.translate(0,0,-T/2);
 const face=m=>new THREE.MeshStandardMaterial({map:m,roughness:.7});
 const sc=document.createElement('canvas');sc.width=256;sc.height=352;{const g=sc.getContext('2d');g.shadowColor='rgba(43,16,12,.5)';g.shadowBlur=34;g.shadowOffsetX=1000;g.fillStyle='#000';rrect(g,48-1000,48,160,256,14);g.fill()}
 const sh=new THREE.Mesh(new THREE.PlaneGeometry(CW*256/160,CH*352/256),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true,depthWrite:false}));
 const o=new THREE.Group(),f=new THREE.Group(),fr=new THREE.Mesh(faceGeo,face(tf)),bk=new THREE.Mesh(faceGeo,face(tb));
 fr.position.z=T/2+.001;bk.rotation.y=Math.PI;bk.position.z=-T/2-.001;
 f.add(fr,bk,new THREE.Mesh(edgeGeo,[new THREE.MeshBasicMaterial({visible:false}),new THREE.MeshStandardMaterial({color:0xe9e1b0,roughness:.9})]));
 sh.position.set(.1,-.18,-.4);o.add(sh,f);scene.add(o);

 function size(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;
  cam.position.z=Math.max(CH*1.14/(2*TAN),CW*1.25/(2*TAN*cam.aspect));cam.updateProjectionMatrix()}
 addEventListener('resize',()=>{if(on)size()});

 /* screen point → face-texture pixels (w×h), through the plane of the front (so a drag can run off the card) */
 const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),plane=new THREE.Plane(),v=new THREE.Vector3(),nrm=new THREE.Vector3();
 function toCard(cx,cy,w,h){const b=canvas.getBoundingClientRect();ndc.set((cx-b.left)/b.width*2-1,-(cy-b.top)/b.height*2+1);ray.setFromCamera(ndc,cam);
  o.updateMatrixWorld(true);nrm.set(0,0,1).transformDirection(fr.matrixWorld);v.setFromMatrixPosition(fr.matrixWorld);plane.setFromNormalAndCoplanarPoint(nrm,v);
  if(!ray.ray.intersectPlane(plane,v))return null;fr.worldToLocal(v);return[(v.x/CW+.5)*w,(.5-v.y/CH)*h]}

 let ry=0,rx=0,vy=0,vx=0,drag=false,moved=false,px=0,py=0,sx=0,sy=0,t0=0,hx=0,hy=0,thx=0,thy=0,lift=0,zoom=0,on=false,running=false,side=null;
 const api={flat:false,hooks:null,onSide:null,beforeRender:null,pop:0,size,toCard,
  onBack:()=>Math.abs(Math.round(ry/Math.PI))%2==1,
  /* momentum decays by .93 a frame, so it coasts vy/.07 in all: aim that at exactly the next half turn */
  flip(){const tg=(Math.round(ry/Math.PI)+1)*Math.PI;if(calm){ry=tg;vy=0}else vy=(tg-ry)*.07;vx=0},
  front(){tf.needsUpdate=true},back(){tb.needsUpdate=true},
  show(v){const was=on;on=v;if(!on||was)return;ry=rx=vy=0;thx=thy=0;size();if(!running){running=true;requestAnimationFrame(tick)}}};

 canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture(e.pointerId);if(api.hooks)return api.hooks.down(e);
  drag=true;moved=false;vy=vx=0;px=sx=e.clientX;py=sy=e.clientY;t0=performance.now()});
 canvas.addEventListener('pointermove',e=>{if(api.hooks)return api.hooks.move(e);
  const b=canvas.getBoundingClientRect();thx=(e.clientX-b.left)/b.width-.5;thy=(e.clientY-b.top)/b.height-.5;
  if(!drag)return;if(!moved){if(Math.hypot(e.clientX-sx,e.clientY-sy)<8)return;moved=true;px=e.clientX;py=e.clientY}
  vy=(e.clientX-px)*.011;vx=(e.clientY-py)*.007;ry+=vy;rx=Math.max(-.7,Math.min(.7,rx+vx));px=e.clientX;py=e.clientY;if(calm)vy=0});
 canvas.addEventListener('pointerup',e=>{if(api.hooks)return api.hooks.up(e);drag=false;if(!moved&&performance.now()-t0<500)api.flip()});
 canvas.addEventListener('pointercancel',e=>{if(api.hooks)return api.hooks.up(e);drag=false});
 canvas.addEventListener('pointerleave',()=>{thx=thy=0});

 function tick(){if(!on){running=false;return}requestAnimationFrame(tick);
  const k=calm?1:.15;
  if(api.flat){vy=vx=0;thx=thy=0;ry+=(Math.round(ry/TURN)*TURN-ry)*k;rx+=(0-rx)*k}
  else if(!drag){ry+=vy;vy*=.93;if(Math.abs(vy)<.012){const tg=Math.round(ry/Math.PI)*Math.PI;ry+=(tg-ry)*(calm?1:.09)}rx+=(0-rx)*(calm?1:.07)}
  hx+=(thx-hx)*.1;hy+=(thy-hy)*.1;lift+=((drag&&moved?1:0)-lift)*.15;api.pop*=.86;zoom+=((api.flat?1:0)-zoom)*k;
  // a slight lean that straightens out while it turns (and while flat), so things read level
  const turn=Math.abs(Math.sin(ry/2)),pop=api.pop;
  o.position.y=lift*.06-pop*.5;o.rotation.z=TILT*(1-turn)*(1-zoom);o.scale.setScalar(1+lift*.04-pop*.06+zoom*.06);
  f.rotation.set(rx+hy*.22*(1-zoom),ry+hx*.3*(1-zoom),pop*.05);sh.scale.x=Math.max(.12,Math.abs(Math.cos(f.rotation.y)));
  const s=api.onBack();if(s!==side){side=s;if(api.onSide)api.onSide(s)}
  if(api.beforeRender)api.beforeRender();
  r.render(scene,cam)}
 return api}
