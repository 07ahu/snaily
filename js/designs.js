/* ---------- card art registries ----------
   INKS: the colours you can pick for the card's paper and ink.
   D: the card fronts (see below).
   STAMPS: transparent PNGs, any shape: {name, img:'images/x.png'}. */
const INKS=[{name:'cream',c:'#F6F3D2'},{name:'brown',c:'#8E3A30'},{name:'orange',c:'#F27C4C'},{name:'blue',c:'#A6BFEA'},{name:'butter',c:'#F2CC6B'},{name:'sage',c:'#A7C29B'},{name:'kraft',c:'#C9A27C'}];
const inkBy=name=>INKS.find(n=>n.name===name),inkName=c=>(INKS.find(n=>n.c===c)||{}).name;
/* the card fronts: hand-drawn art in four colours. pal lists the exact shades in each image in role order
   (paper, ink, then the accents) with the ink family each belongs to, so the art can be recoloured. */
const D=[
 {name:'slow snail',src:'images/cards/snail.jpg',tilt:-4,pal:[['blue','#a6bfea'],['orange','#f27c4c'],['cream','#f6f3d2'],['brown','#8e3a30']]},
 {name:'little bird',src:'images/cards/bird.jpg',tilt:3,pal:[['orange','#f27c4c'],['brown','#8f3a30'],['blue','#a6bfea'],['cream','#f7f3d2']]},
 {name:'leaf nibblers',src:'images/cards/leaves.jpg',tilt:-3,pal:[['cream','#f9f5dc'],['blue','#b9cdee'],['orange','#f58a54'],['brown','#a03f35']]},
 {name:'tulip',src:'images/cards/tulip.jpg',tilt:4,pal:[['cream','#fbf8e6'],['orange','#f9995d'],['blue','#ccdcf3'],['brown','#b5483c']]},
 {name:'butterflies',src:'images/cards/butterflies.jpg',tilt:-2,pal:[['cream','#fbf8e6'],['orange','#f9995d'],['brown','#b4483c'],['blue','#ccdbf3']]},
 {name:'mushrooms',src:'images/cards/mushrooms.jpg',tilt:3,pal:[['cream','#f8f5d7'],['brown','#983d34'],['orange','#f48452'],['blue','#afc6ec']]}];
D.forEach(d=>{d.bg=inkBy(d.pal[0][0]).c;d.fg=inkBy(d.pal[1][0]).c});
/* the shade each role becomes for a chosen paper + ink. Accents keep their colour unless
   the paper or ink took it, then they borrow one the paper/ink gave up, so all four stay distinct. */
function remap(d,paper,inkC){const pf=inkName(paper),kf=inkName(inkC),used=new Set([pf,kf]);
 const freed=[d.pal[0][0],d.pal[1][0]].filter(f=>!used.has(f)),spare=INKS.map(n=>n.name).filter(f=>!used.has(f)&&!d.pal.some(q=>q[0]===f));
 return d.pal.map(([f,c],k)=>{let t=k==0?pf:k==1?kf:f;if(k>1){if(used.has(f))t=freed.shift()||spare.shift();used.add(t)}return t===f?c:inkBy(t).c})}
/* moves every pixel from the art's palette to the new one. Each pixel is placed on the closest blend between two
   palette colours (so anti-aliased edges between any pair stay clean), and what's left over (the paper grain) is kept. */
function recolor(src,from,to){const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),P=from.map(hx),M=to.map(hx),s=src.data,out=new ImageData(src.width,src.height),o=out.data,S=[];
 for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const A=P[i],B=P[j],e=[B[0]-A[0],B[1]-A[1],B[2]-A[2]];S.push({A,e,L:e[0]*e[0]+e[1]*e[1]+e[2]*e[2],X:M[i],Y:M[j]})}
 for(let p=0;p<s.length;p+=4){const r=s[p],g=s[p+1],b=s[p+2];let best=1e9,q=S[0],tq=0;
  for(const z of S){const dr=r-z.A[0],dg=g-z.A[1],db=b-z.A[2];let t=(dr*z.e[0]+dg*z.e[1]+db*z.e[2])/z.L;t=t<0?0:t>1?1:t;
   const fr=dr-t*z.e[0],fg=dg-t*z.e[1],fb=db-t*z.e[2],d=fr*fr+fg*fg+fb*fb;if(d<best){best=d;q=z;tq=t}}
  const{A,e,X,Y}=q,t=tq;
  o[p]=X[0]+t*(Y[0]-X[0])+r-A[0]-t*e[0];o[p+1]=X[1]+t*(Y[1]-X[1])+g-A[1]-t*e[1];o[p+2]=X[2]+t*(Y[2]-X[2])+b-A[2]-t*e[2];o[p+3]=255}
 return out}
/* stamps: the first two show in the tray, the rest sit behind the + */
const STAMPS=[
 {name:'snail',img:'images/stamp.png'},
 {name:'flower',img:'images/stamp-flower.png'},
 {name:'swallows',img:'images/stamp-birds.png'},
 {name:'blue sky',img:'images/stamp-sky.png'},
 {name:'postmark',img:'images/stamp-postmark.png'}];
/* loads image stamps; afterwards stampArt(i,w,h) hands back a canvas and STAMPS[i].thumb a data URL for the tray */
const loadImg=(o,src)=>new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>r();i.src=src;o.image=i});
const designsReady=Promise.all([...STAMPS.filter(s=>s.img).map(s=>loadImg(s,s.img)),...D.map(d=>loadImg(d,d.src))])
 
 .then(()=>STAMPS.forEach((s,i)=>s.thumb=stampArt(i,160,160).toDataURL()));
function stampArt(i,w,h){const s=STAMPS[i]||STAMPS[0];const c=document.createElement('canvas');c.width=w;c.height=h;
 const im=s.image;if(im&&im.naturalWidth){const k=Math.min(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*k,ih=im.naturalHeight*k;c.getContext('2d').drawImage(im,(w-iw)/2,(h-ih)/2,iw,ih)}return c}
