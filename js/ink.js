/* ---------- marker ink: draw on the open photo, show the strokes on the board ----------
   Strokes are stored on the photo as p.ink=[{c,w,pts:[[x,y],…]}]: x and y are fractions of the
   full image and w is a fraction of its width, so a stroke lands on the same spot at any size.
   The board shows them as an SVG with the image's own viewBox and "slice", which crops exactly
   like the photo's object-fit:cover. */
const Ink=(()=>{
 const COLORS=['#6C2C25','#EB5E3A','#7CA2E0','#fffdf4'],SIZES=[3,6,11];
 let canvas=null,ctx=null,photo=null,onChange=null,on=false,color=COLORS[1],size=SIZES[1],cur=null,raf=0;

 // a smooth line through the points: quadratic curves between midpoints
 function trace(g,pts,W,H){
  g.moveTo(pts[0][0]*W,pts[0][1]*H);
  if(pts.length===1){g.lineTo(pts[0][0]*W+.01,pts[0][1]*H);return}
  for(let i=1;i<pts.length-1;i++){const[x,y]=pts[i],[nx,ny]=pts[i+1];g.quadraticCurveTo(x*W,y*H,(x+nx)/2*W,(y+ny)/2*H)}
  const l=pts[pts.length-1];g.lineTo(l[0]*W,l[1]*H)}
 function draw(){raf=0;if(!canvas)return;const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);
  const all=[...(photo?.()?.ink||[]),...(cur?[cur]:[])];
  for(const s of all){ctx.beginPath();trace(ctx,s.pts,W,H);ctx.strokeStyle=s.c;ctx.lineWidth=s.w*W;ctx.lineCap=ctx.lineJoin='round';ctx.stroke()}}
 const redraw=()=>{if(!raf)raf=requestAnimationFrame(draw)};
 function fit(){if(!canvas)return;const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;
  const w=Math.round(r.width*d),h=Math.round(r.height*d);if(w&&h&&(w!==canvas.width||h!==canvas.height)){canvas.width=w;canvas.height=h}draw()}

 function attach(c,getPhoto,changed){
  canvas=c;ctx=c.getContext('2d');photo=getPhoto;onChange=changed;new ResizeObserver(fit).observe(c);
  const at=e=>{const r=c.getBoundingClientRect();return[Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))]};
  c.addEventListener('pointerdown',e=>{if(!on||e.button||!photo())return;e.preventDefault();c.setPointerCapture(e.pointerId);
   cur={c:color,w:size/c.getBoundingClientRect().width,pts:[at(e)]};redraw()});
  c.addEventListener('pointermove',e=>{if(!cur)return;const p=at(e),l=cur.pts[cur.pts.length-1],r=c.getBoundingClientRect();
   if(Math.hypot((p[0]-l[0])*r.width,(p[1]-l[1])*r.height)<1.5)return;
   cur.pts.push(p.map(v=>Math.round(v*1e4)/1e4));redraw()});
  const end=()=>{if(!cur)return;const p=photo();if(p){(p.ink||(p.ink=[])).push(cur);onChange&&onChange()}cur=null;redraw()};
  c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end)}

 /* the same strokes onto a 2D canvas, over the photo's full (uncropped) rect x,y,w,h */
 function paint(g,p,x,y,w,h){if(!p.ink||!p.ink.length)return;g.save();g.translate(x,y);g.lineCap=g.lineJoin='round';
  for(const s of p.ink){g.beginPath();trace(g,s.pts,w,h);g.strokeStyle=s.c;g.lineWidth=s.w*w;g.stroke()}g.restore()}
 function enable(v){on=v;if(canvas)canvas.classList.toggle('on',v)}
 function undo(){const p=photo&&photo();if(!p||!p.ink||!p.ink.length)return false;p.ink.pop();onChange&&onChange();redraw();return true}

 /* the board's copy: same strokes, drawn by the browser at any size */
 function svg(p){
  if(!p.ink||!p.ink.length)return null;const W=p.w,H=p.h,n='http://www.w3.org/2000/svg',s=document.createElementNS(n,'svg');
  s.setAttribute('viewBox',`0 0 ${W} ${H}`);s.setAttribute('preserveAspectRatio','xMidYMid slice');s.setAttribute('class','ph-ink');s.setAttribute('aria-hidden','true');
  for(const k of p.ink){const path=document.createElementNS(n,'path'),d=[];const P=k.pts,f=([x,y])=>`${(x*W).toFixed(1)} ${(y*H).toFixed(1)}`;
   d.push('M'+f(P[0]));if(P.length===1)d.push('l.01 0');
   for(let i=1;i<P.length-1;i++)d.push('Q'+f(P[i])+' '+f([(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2]));
   if(P.length>1)d.push('L'+f(P[P.length-1]));
   path.setAttribute('d',d.join(''));path.setAttribute('fill','none');path.setAttribute('stroke',k.c);path.setAttribute('stroke-width',(k.w*W).toFixed(2));
   path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');s.append(path)}
  return s}

 return{COLORS,SIZES,attach,enable,undo,redraw,svg,paint,
  get color(){return color},set color(v){color=v},get size(){return size},set size(v){size=v}};
})();
