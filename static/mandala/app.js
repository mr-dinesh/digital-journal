const canvas=document.getElementById('board'), ctx=canvas.getContext('2d');
const DPR=Math.min(window.devicePixelRatio||1,2);
let SIZE=0,CX=0,CY=0;
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const chance=p=>Math.random()<p;
const shuffled=a=>[...a].sort(()=>Math.random()-0.5);

/* ================= palettes ================= */
const THEMES=[
 {n:'Temple gold',dark:1,bg:['#2a2229','#161219','#0a080d'],c:['#e0a63c','#f2cd7c','#c96f6f','#e8e0cd','#a8702f','#e8853d','#7d4a2a']},
 {n:'Lapis & saffron',dark:1,bg:['#16203a','#0d1424','#070a13'],c:['#5b8ad6','#a8c9f2','#e6c464','#dfe9f7','#7a63d0','#3fa8a0','#f0a24a']},
 {n:'Vermilion night',dark:1,bg:['#2a1418','#180c10','#0c0608'],c:['#e0523f','#f2916d','#ecc26a','#f4ded0','#a8324a','#d8a0b4','#ff7a52']},
 {n:'Jade & bone',dark:1,bg:['#12211e','#0b1614','#060d0c'],c:['#4fae94','#9fd8c2','#e4dcc4','#c8a25a','#39786c','#efeadb','#2f9d7e']},
 {n:'Amethyst',dark:1,bg:['#221a33','#150f21','#0a0713'],c:['#a07fd8','#d5bff2','#6fc6d0','#f0d78a','#e07fa8','#efe6fa','#7d4fd0']},
 {n:'Ember',dark:1,bg:['#2b1c0c','#180f06','#0b0703'],c:['#f0a02c','#ffd27a','#e2542a','#fce9c6','#8f4a1a','#c9803f','#ff6b2b']},
 {n:'Monsoon',dark:1,bg:['#101c22','#0a1216','#05090b'],c:['#6fbfd8','#bfe6f0','#e8d48a','#7f9a72','#d97f5a','#eef4f6','#4a93b8']},
 {n:'Peacock',dark:1,bg:['#0e2430','#08161e','#040b0f'],c:['#1fa5a0','#4fd6c8','#2b6fb5','#e8c452','#7fe0d0','#0d5f7a','#f2f7f5']},
 {n:'Rangoli',dark:1,bg:['#241026','#160a19','#0a040c'],c:['#ff5f7e','#ffb03a','#4fd6a8','#5b8ad6','#f2e34f','#ff8ec4','#ffffff']},
 {n:'Turmeric & indigo',dark:1,bg:['#151a34','#0d1024','#060814'],c:['#f0c020','#ffe08a','#3f4fa8','#8f9fe0','#e07f3a','#f5f0e0','#2a2f6b']},
 {n:'Copper patina',dark:1,bg:['#14211f','#0d1615','#060c0b'],c:['#c97a3f','#e8a86b','#4fb0a0','#8fd8c8','#e8ddc4','#7a4a25','#2f8f7d']},
 {n:'Midnight rose',dark:1,bg:['#1e1424','#130c17','#08050a'],c:['#e07f9f','#f5b8cc','#8f6fd0','#e8d4a8','#4f5f9f','#fce8f0','#b04a75']},
 {n:'Neon sutra',dark:1,bg:['#0a0a12','#06060c','#020204'],c:['#39ffc8','#ff3fa0','#7a5cff','#f5ff4f','#4fd0ff','#ffffff','#ff8a3d']},
 {n:'Aurora',dark:1,bg:['#0b1a24','#071118','#03080c'],c:['#5cf2b0','#9ff5d8','#7a8ff0','#d08ff0','#f2f7c4','#3fb0c8','#e8f7ff']},
 {n:'Deep sea',dark:1,bg:['#08161f','#050d15','#02060a'],c:['#2f8fb5','#6fd0e0','#c8e8f0','#e0c46a','#1f5f7a','#8fa8b5','#a8e0d0']},
 {n:'Ash & gold',dark:1,bg:['#1a1a1c','#111112','#070708'],c:['#d4b25a','#f0dca8','#8f8f92','#c4c4c8','#5a5a5e','#f5f2e8','#a8853d']},
 {n:'Ink on paper',dark:0,bg:['#f9f5ec','#efe9da','#e2d9c6'],c:['#1d1a17','#4a423a','#8a7b66','#a8321f','#2f5d50','#6b5a3e','#c2b193']},
 {n:'Rice paper rose',dark:0,bg:['#fdf4f1','#f4e3df','#e6d0ca'],c:['#b34a5c','#d98a96','#3c4a6b','#c99a3f','#5a6e52','#2b2426','#e0a8ae']},
 {n:'Fresco',dark:0,bg:['#f4eee2','#e9dcc8','#dac9ad'],c:['#2f5f7a','#c96a3c','#d7b45a','#5d7a4a','#7a3f52','#243038','#a8bcc4']},
 {n:'Sandalwood',dark:0,bg:['#f7efe0','#eddfc6','#dfcda8'],c:['#8f5a2f','#c98f4f','#5f4a2f','#d9b877','#3f5f4a','#2b2118','#e8d2a8']},
 {n:'Mint chalk',dark:0,bg:['#f0f7f2','#dff0e6','#cbe4d6'],c:['#2f7a5f','#5fb08f','#2f4f6b','#d98f5a','#8f6fb0','#1f2b28','#a8d8c0']},
 {n:'Terracotta courtyard',dark:0,bg:['#faefe6','#f0dccb','#e2c6ae'],c:['#b0522f','#d9855a','#3f5f6b','#c9a23f','#5f7a4a','#3b2a22','#e8b894']},
 {n:'Pistachio',dark:0,bg:['#f5f7e8','#e8edd0','#d8e0b5'],c:['#5f7a2f','#8fb04f','#2f5f6b','#c9743f','#7a4f8f','#25301c','#c4d98f']},
 {n:'Blush dusk',dark:0,bg:['#fdf1f4','#f4dfe6','#e6c9d4'],c:['#8f3f5f','#c96f8f','#4f5f8f','#d9a05f','#5f8f7a','#2b1f26','#e8b0c4']}
];

const HARMONIES=['analogous','triad','complement','split','tetrad','monochrome','pastel','neon','earth'];
const hsl=(h,s,l)=>`hsl(${((h%360)+360)%360} ${Math.round(s)}% ${Math.round(l)}%)`;
function harmonicTheme(kind){
  const base=Math.random()*360;
  const k=kind||pick(HARMONIES);
  const dark=Math.random()<0.68;
  let offs,sat,lig;
  if(k==='monochrome'){offs=[0,4,-4,8,-8,2,6]; sat=()=>rand(20,60); lig=()=>dark?rand(40,85):rand(20,55);}
  else if(k==='pastel'){offs=[0,40,80,-40,-80,20,120]; sat=()=>rand(35,60); lig=()=>dark?rand(65,85):rand(45,65);}
  else if(k==='neon'){offs=[0,60,180,300,120,240,30]; sat=()=>rand(85,100); lig=()=>dark?rand(55,72):rand(38,50);}
  else if(k==='earth'){offs=[0,18,-18,35,-35,10,25]; sat=()=>rand(25,55); lig=()=>dark?rand(45,72):rand(28,48);}
  else{
    offs={analogous:[0,22,-22,44,-44,12,66],triad:[0,120,240,15,135,255,60],
      complement:[0,180,20,200,-20,160,190],split:[0,150,210,30,180,330,105],
      tetrad:[0,90,180,270,45,225,135]}[k];
    sat=()=>rand(45,90); lig=()=>dark?rand(52,80):rand(28,52);
  }
  const c=offs.map(o=>hsl(base+o+rand(-7,7),sat(),lig()));
  const bh=base+rand(-30,30);
  const bg=dark
    ?[hsl(bh,rand(14,34),rand(11,17)),hsl(bh,rand(14,28),rand(7,11)),hsl(bh,rand(10,22),rand(3,6))]
    :[hsl(bh,rand(12,28),rand(93,97)),hsl(bh,rand(14,30),rand(86,92)),hsl(bh,rand(16,32),rand(78,85))];
  return {n:k[0].toUpperCase()+k.slice(1)+' harmony',dark,bg,c};
}

/* ================= colour utils ================= */
const probe=document.createElement('canvas').getContext('2d');
const rgbCache={};
function toRGB(c){
  if(rgbCache[c]) return rgbCache[c];
  probe.fillStyle='#000'; probe.fillStyle=c;
  const s=probe.fillStyle;
  let r,g,b;
  if(s[0]==='#'){ r=parseInt(s.slice(1,3),16); g=parseInt(s.slice(3,5),16); b=parseInt(s.slice(5,7),16); }
  else { const m=s.match(/[\d.]+/g); r=+m[0]; g=+m[1]; b=+m[2]; }
  return rgbCache[c]=[r,g,b];
}
const mix=(a,b,t)=>{
  const A=toRGB(a),B=toRGB(b);
  return `rgb(${Math.round(A[0]+(B[0]-A[0])*t)},${Math.round(A[1]+(B[1]-A[1])*t)},${Math.round(A[2]+(B[2]-A[2])*t)})`;
};
const alpha=(c,a)=>{ const A=toRGB(c); return `rgba(${A[0]},${A[1]},${A[2]},${a})`; };

function radialGrad(r0,r1,cols){
  const g=ctx.createRadialGradient(CX,CY,Math.max(r0,0.1),CX,CY,Math.max(r1,r0+1));
  cols.forEach((c,i)=>g.addColorStop(cols.length===1?0:i/(cols.length-1),c));
  return g;
}
function linearGrad(ang,r,cols){
  const g=ctx.createLinearGradient(CX+Math.cos(ang)*-r,CY+Math.sin(ang)*-r,CX+Math.cos(ang)*r,CY+Math.sin(ang)*r);
  cols.forEach((c,i)=>g.addColorStop(cols.length===1?0:i/(cols.length-1),c));
  return g;
}
function conicGrad(cols,start){
  if(!ctx.createConicGradient) return linearGrad(start||0,SIZE*0.5,cols);
  const g=ctx.createConicGradient(start||0,CX,CY);
  const loop=[...cols,cols[0]];
  loop.forEach((c,i)=>g.addColorStop(i/(loop.length-1),c));
  return g;
}

/* ================= state ================= */
const state={sym:12,brush:4,density:8,color:'#e0a63c',mirror:true,
  ink:{n:'Saffron',kind:'solid',c:'#e0a63c'},nib:'solid',opacity:1,inkAngle:0,
  drawing:false,last:null,history:[],theme:THEMES[0],paletteChoice:'random',colorMode:'auto',seed:null};

/* ================= canvas ================= */
function setupCanvas(){
  const r=canvas.getBoundingClientRect();
  SIZE=Math.round(r.width*DPR); canvas.width=SIZE; canvas.height=SIZE;
  CX=SIZE/2; CY=SIZE/2; ctx.lineCap='round'; ctx.lineJoin='round';
  const h=state.history[state.history.length-1];
  if(h&&h.width===SIZE) ctx.putImageData(h,0,0);
}
function snapshot(){ state.history.push(ctx.getImageData(0,0,SIZE,SIZE)); if(state.history.length>18) state.history.shift(); }

/* ================= inks ================= */
const INK_METAL=[
 {n:'Gold leaf',kind:'linear',c:['#7a5320','#f3d572','#c9962f','#fff0b8','#8a6222']},
 {n:'Silver',kind:'linear',c:['#5f666e','#e8edf2','#9aa3ac','#ffffff','#6d757d']},
 {n:'Copper',kind:'linear',c:['#6f3418','#e09a63','#b87333','#f5c69a','#7a3d1c']},
 {n:'Bronze',kind:'linear',c:['#4a3418','#c9a15a','#8a6a2f','#e6cf9a','#503a1c']},
 {n:'Pearl',kind:'conic',c:['#f7f2ea','#e6d8f0','#dceaf5','#f5e8dc','#eef3ea']}
];
const INK_GRADIENT=[
 {n:'Prism',kind:'conic',c:['#ff4d4d','#ffb03a','#f5f24f','#4fd68a','#4fb0f0','#8a5cf0','#ff5fbf']},
 {n:'Sunset',kind:'radial',c:['#ffd06b','#ff8a3d','#e8446b','#7a2f6b']},
 {n:'Ocean',kind:'radial',c:['#8ff0e0','#2f9ec4','#25508f','#101c3a']},
 {n:'Ember glow',kind:'radial',c:['#fff2c4','#ffab2e','#e8442a','#5c1208']},
 {n:'Twilight',kind:'linear',c:['#f5c8e0','#a87fd0','#4f5fb5','#1c2145']},
 {n:'Verdant',kind:'radial',c:['#e8f5b0','#7ec46b','#2f8a5f','#12402f']},
 {n:'Peacock sweep',kind:'conic',c:['#1fa5a0','#2b6fb5','#7a5cf0','#e8c452','#1fa5a0']},
 {n:'Rangoli sweep',kind:'conic',c:['#ff5f7e','#ffb03a','#4fd6a8','#5b8ad6','#ff5f7e']}
];
const INK_CLASSIC=[
 ['Chalk','#ffffff'],['Ivory','#f5efe0'],['Bone','#ded5c2'],['Ash','#9a9aa0'],['Charcoal','#26262b'],['Lampblack','#0a0a0c'],
 ['Vermilion','#e3432b'],['Crimson','#a81f3c'],['Coral','#ff7f5f'],['Rose','#e08fa8'],['Magenta','#e03f9f'],
 ['Saffron','#f2a12c'],['Amber','#ffbf3f'],['Turmeric','#e8c22c'],['Sienna','#8f5a2f'],['Umber','#4a3524'],
 ['Moss','#6b8f4a'],['Jade','#3fae7a'],['Teal','#1f9e94'],['Verdigris','#5fc4b0'],
 ['Sky','#7fc4f0'],['Cobalt','#2f6fd0'],['Indigo','#2f3f8f'],['Ultramarine','#3b2fb0'],
 ['Violet','#7a4fd0'],['Lilac','#c4a8f0'],['Plum','#6b2f5f'],['Neon lime','#c8ff3d']
];

function inkCSS(ink){
  if(ink.kind==='solid') return ink.c;
  if(ink.kind==='conic') return `conic-gradient(${ink.c.join(',')},${ink.c[0]})`;
  if(ink.kind==='radial') return `radial-gradient(circle,${ink.c.join(',')})`;
  return `linear-gradient(135deg,${ink.c.join(',')})`;
}
function inkBase(ink){ return ink.kind==='solid'?ink.c:ink.c[Math.floor(ink.c.length/2)]; }

function inkPaint(){
  const ink=state.ink, nib=state.nib, R=SIZE*0.47;
  if(ink.kind==='solid'){
    if(nib==='fade') return radialGrad(0,R,[ink.c,alpha(ink.c,0.12)]);
    return ink.c;
  }
  if(ink.kind==='conic') return conicGrad(ink.c,state.inkAngle);
  if(ink.kind==='radial') return radialGrad(0,R,ink.c);
  return linearGrad(state.inkAngle,R,ink.c);
}

/* ================= freehand ================= */
function strokeSegment(x1,y1,x2,y2){
  const a1=Math.atan2(y1-CY,x1-CX),r1=Math.hypot(x1-CX,y1-CY);
  const a2=Math.atan2(y2-CY,x2-CX),r2=Math.hypot(x2-CX,y2-CY);
  const style=inkPaint(), nib=state.nib, maxR=SIZE*0.47;
  ctx.save();
  ctx.strokeStyle=style; ctx.fillStyle=style;
  ctx.globalAlpha=state.opacity;
  ctx.setLineDash(nib==='dotted'?[1,state.brush*2.4*DPR]:[]);
  let lw=state.brush*DPR;
  if(nib==='taper') lw=state.brush*DPR*(0.25+0.95*Math.min(1,((r1+r2)/2)/maxR));
  ctx.lineWidth=Math.max(0.6,lw);
  if(nib==='glow'){ ctx.shadowColor=inkBase(state.ink); ctx.shadowBlur=state.brush*2.6*DPR; }
  const n=state.sym;
  for(let i=0;i<n;i++){
    const rot=(Math.PI*2/n)*i;
    seg(a1+rot,r1,a2+rot,r2,nib);
    if(state.mirror) seg(-a1+rot,r1,-a2+rot,r2,nib);
  }
  ctx.restore();
}
function seg(a1,r1,a2,r2,nib){
  if(nib==='spray'){
    const steps=Math.max(2,Math.round(Math.hypot(r2-r1,(a2-a1)*r1)/(2*DPR)));
    for(let i=0;i<=steps;i++){
      const t=i/steps, a=a1+(a2-a1)*t, r=r1+(r2-r1)*t;
      for(let k=0;k<3;k++){
        const j=state.brush*DPR*1.4;
        ctx.beginPath();
        ctx.arc(CX+Math.cos(a)*r+rand(-j,j),CY+Math.sin(a)*r+rand(-j,j),rand(.4,1.3)*DPR,0,Math.PI*2);
        ctx.fill();
      }
    }
    return;
  }
  if(nib==='double'){
    const o=state.brush*DPR*1.5;
    [-o,o].forEach(d=>{
      ctx.beginPath();
      ctx.moveTo(CX+Math.cos(a1)*(r1+d),CY+Math.sin(a1)*(r1+d));
      ctx.lineTo(CX+Math.cos(a2)*(r2+d),CY+Math.sin(a2)*(r2+d));
      ctx.stroke();
    });
    return;
  }
  ctx.beginPath(); ctx.moveTo(CX+Math.cos(a1)*r1,CY+Math.sin(a1)*r1);
  ctx.lineTo(CX+Math.cos(a2)*r2,CY+Math.sin(a2)*r2); ctx.stroke();
}
const pos=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(SIZE/r.width),y:(e.clientY-r.top)*(SIZE/r.height)};};
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);snapshot();state.drawing=true;state.last=pos(e);});
canvas.addEventListener('pointermove',e=>{if(!state.drawing)return;const p=pos(e);strokeSegment(state.last.x,state.last.y,p.x,p.y);state.last=p;});
['pointerup','pointercancel','pointerleave'].forEach(ev=>canvas.addEventListener(ev,()=>state.drawing=false));

/* ================= geometry ================= */
const P=(a,r)=>[CX+Math.cos(a)*r,CY+Math.sin(a)*r];
const moveP=(a,r)=>{const p=P(a,r);ctx.moveTo(p[0],p[1]);};
const lineP=(a,r)=>{const p=P(a,r);ctx.lineTo(p[0],p[1]);};
const quadP=(a1,r1,a2,r2)=>{const c=P(a1,r1),e=P(a2,r2);ctx.quadraticCurveTo(c[0],c[1],e[0],e[1]);};
const paint=(f,s)=>{if(f)ctx.fill();if(s)ctx.stroke();};

/* ================= motifs ================= */
const MOTIFS={
 petal(a,r0,r1,w,o){ctx.beginPath();moveP(a,r0);quadP(a-w,(r0+r1)/1.85,a,r1);quadP(a+w,(r0+r1)/1.85,a,r0);paint(o.fill,o.stroke);},
 lotus(a,r0,r1,w,o){ctx.beginPath();moveP(a,r0);quadP(a-w*1.5,r0+(r1-r0)*.45,a-w*.15,r1);quadP(a,r1+(r1-r0)*.12,a+w*.15,r1);quadP(a+w*1.5,r0+(r1-r0)*.45,a,r0);paint(o.fill,o.stroke);},
 teardrop(a,r0,r1,w,o){const m=(r0+r1)/2,rad=(r1-r0)*.32;ctx.beginPath();ctx.arc(...P(a,m-rad*.2),rad,0,Math.PI*2);paint(o.fill,o.stroke);ctx.beginPath();moveP(a,r0);lineP(a,m-rad);ctx.stroke();},
 dot(a,r0,r1,w,o){ctx.beginPath();ctx.arc(...P(a,(r0+r1)/2),(r1-r0)*rand(.14,.3),0,Math.PI*2);ctx.fill();},
 ringOfRings(a,r0,r1,w,o){const m=(r0+r1)/2,rad=(r1-r0)*.38;ctx.beginPath();ctx.arc(...P(a,m),rad,0,Math.PI*2);ctx.stroke();if(chance(.5)){ctx.beginPath();ctx.arc(...P(a,m),rad*.4,0,Math.PI*2);ctx.fill();}},
 spoke(a,r0,r1,w,o){ctx.beginPath();moveP(a,r0);lineP(a,r1);ctx.stroke();},
 diamond(a,r0,r1,w,o){const m=(r0+r1)/2;ctx.beginPath();moveP(a,r0);lineP(a+w,m);lineP(a,r1);lineP(a-w,m);ctx.closePath();paint(o.fill,o.stroke);},
 triangle(a,r0,r1,w,o){ctx.beginPath();moveP(a-w,r0);lineP(a+w,r0);lineP(a,r1);ctx.closePath();paint(o.fill,o.stroke);},
 chevron(a,r0,r1,w,o){ctx.beginPath();moveP(a-w,r0);lineP(a,r1);lineP(a+w,r0);ctx.stroke();if(chance(.5)){const k=(r1-r0)*.35;ctx.beginPath();moveP(a-w,r0+k);lineP(a,r1+k*.9);lineP(a+w,r0+k);ctx.stroke();}},
 arcband(a,r0,r1,w,o){ctx.beginPath();ctx.arc(CX,CY,(r0+r1)/2,a-w,a+w);ctx.stroke();},
 scallop(a,r0,r1,w,o){ctx.beginPath();moveP(a-w,r0);quadP(a,r1*1.02,a+w,r0);ctx.stroke();},
 leaf(a,r0,r1,w,o){ctx.beginPath();moveP(a,r0);quadP(a-w,(r0+r1)/2,a,r1);quadP(a+w,(r0+r1)/2,a,r0);paint(o.fill,o.stroke);ctx.beginPath();moveP(a,r0);lineP(a,r1);ctx.stroke();},
 star(a,r0,r1,w,o){const m=(r0+r1)/2,R=(r1-r0)*.5,pts=Math.floor(rand(5,9)),c=P(a,m);ctx.beginPath();
   for(let i=0;i<pts*2;i++){const ang=(Math.PI/pts)*i-Math.PI/2,rr=i%2?R*.44:R,x=c[0]+Math.cos(ang)*rr,y=c[1]+Math.sin(ang)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
   ctx.closePath();paint(o.fill,o.stroke);},
 lattice(a,r0,r1,w,o){ctx.beginPath();moveP(a-w,r0);lineP(a+w,r1);ctx.stroke();ctx.beginPath();moveP(a+w,r0);lineP(a-w,r1);ctx.stroke();},
 wave(a,r0,r1,w,o){const st=8;ctx.beginPath();for(let i=0;i<=st;i++){const t=i/st,ang=a-w+2*w*t,rr=r0+(r1-r0)*(.5+.42*Math.sin(t*Math.PI*2));i?lineP(ang,rr):moveP(ang,rr);}ctx.stroke();},
 stipple(a,r0,r1,w,o){const k=Math.floor(rand(6,18));for(let i=0;i<k;i++){ctx.beginPath();ctx.arc(...P(a+rand(-w,w),rand(r0,r1)),rand(.6,2.2)*DPR,0,Math.PI*2);ctx.fill();}},
 hatch(a,r0,r1,w,o){const k=Math.floor(rand(3,7));for(let i=0;i<k;i++){const ang=a-w+2*w*(i/(k-1||1));ctx.beginPath();moveP(ang,r0);lineP(ang,r1);ctx.stroke();}},
 curl(a,r0,r1,w,o){ctx.beginPath();moveP(a,r0);quadP(a+w*1.8,r0+(r1-r0)*.55,a+w*.4,r1);ctx.stroke();if(chance(.6)){ctx.beginPath();ctx.arc(...P(a+w*.4,r1),(r1-r0)*.1,0,Math.PI*2);ctx.fill();}},
 trefoil(a,r0,r1,w,o){const m=(r0+r1)/2,rad=(r1-r0)*.26;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.arc(...P(a+k*w*.75,m+(k?-rad*.4:rad*.5)),rad,0,Math.PI*2);paint(o.fill,o.stroke);}}
};
const MOTIF_KEYS=Object.keys(MOTIFS);

/* ================= texture ================= */
function grainOverlay(s){
  const n=180,off=document.createElement('canvas');off.width=off.height=n;
  const o=off.getContext('2d'),img=o.createImageData(n,n);
  for(let i=0;i<img.data.length;i+=4){const v=Math.random()*255;img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=255;}
  o.putImageData(img,0,0);
  ctx.save();ctx.globalCompositeOperation='overlay';ctx.globalAlpha=s;ctx.drawImage(off,0,0,SIZE,SIZE);ctx.restore();
}
function starDust(cols,count){
  ctx.save();
  for(let i=0;i<count;i++){
    ctx.globalAlpha=rand(.12,.5);ctx.fillStyle=pick(cols);
    ctx.beginPath();ctx.arc(...P(Math.random()*Math.PI*2,Math.sqrt(Math.random())*SIZE*.47),rand(.5,1.8)*DPR,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
function colourWash(cols){
  ctx.save();
  ctx.globalCompositeOperation=pick(['overlay','soft-light','color']);
  ctx.globalAlpha=rand(.08,.22);
  ctx.fillStyle=chance(.5)?conicGrad(shuffled(cols).slice(0,4),rand(0,6.28)):linearGrad(rand(0,6.28),SIZE*.5,[pick(cols),pick(cols)]);
  ctx.beginPath();ctx.arc(CX,CY,SIZE*.5,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

/* ================= centre + border ================= */
function centre(cols,R,n){
  const style=pick(['bloom','eye','spiral','seed','rosette','halo']);
  ctx.save();
  if(style==='bloom'){for(let k=3;k>=1;k--){ctx.fillStyle=pick(cols);ctx.globalAlpha=.88;ctx.beginPath();ctx.arc(CX,CY,R*k/3,0,Math.PI*2);ctx.fill();}}
  else if(style==='halo'){ctx.fillStyle=radialGrad(0,R,[pick(cols),alpha(pick(cols),0)]);ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.fill();}
  else if(style==='eye'){ctx.strokeStyle=pick(cols);ctx.lineWidth=1.6*DPR;for(let k=1;k<=4;k++){ctx.beginPath();ctx.arc(CX,CY,R*k/4,0,Math.PI*2);ctx.stroke();}ctx.fillStyle=pick(cols);ctx.beginPath();ctx.arc(CX,CY,R*.3,0,Math.PI*2);ctx.fill();}
  else if(style==='spiral'){ctx.strokeStyle=conicGrad(shuffled(cols).slice(0,3),0);ctx.lineWidth=1.8*DPR;ctx.beginPath();for(let t=0;t<Math.PI*10;t+=.1){const rr=R*t/(Math.PI*10);t?lineP(t,rr):moveP(t,rr);}ctx.stroke();}
  else if(style==='seed'){ctx.strokeStyle=pick(cols);ctx.lineWidth=1.4*DPR;for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(...P((Math.PI/3)*i,R*.5),R*.5,0,Math.PI*2);ctx.stroke();}}
  else{ctx.fillStyle=conicGrad(shuffled(cols).slice(0,3),0);for(let i=0;i<n;i++){const a=(Math.PI*2/n)*i;ctx.beginPath();moveP(a,0);quadP(a-Math.PI/n,R*.7,a,R);quadP(a+Math.PI/n,R*.7,a,0);ctx.fill();}}
  ctx.restore();
}
function border(cols,R,n){
  const style=pick(['none','beads','scallop','rays','double','dashed','gradientRing']);
  ctx.save();ctx.strokeStyle=pick(cols);ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1.6*DPR;
  if(style==='beads'){const k=n*2;for(let i=0;i<k;i++){ctx.beginPath();ctx.arc(...P((Math.PI*2/k)*i,R),SIZE*.008,0,Math.PI*2);ctx.fill();}}
  else if(style==='scallop'){const k=n*2,w=Math.PI/k;for(let i=0;i<k;i++){const a=(Math.PI*2/k)*i;ctx.beginPath();moveP(a-w,R*.97);quadP(a,R*1.03,a+w,R*.97);ctx.stroke();}}
  else if(style==='rays'){for(let i=0;i<n*2;i++){const a=(Math.PI*2/(n*2))*i;ctx.beginPath();moveP(a,R*.96);lineP(a,R*1.02);ctx.stroke();}}
  else if(style==='double'){ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.stroke();ctx.lineWidth=.9*DPR;ctx.beginPath();ctx.arc(CX,CY,R*.955,0,Math.PI*2);ctx.stroke();}
  else if(style==='dashed'){ctx.setLineDash([6*DPR,5*DPR]);ctx.beginPath();ctx.arc(CX,CY,R,0,Math.PI*2);ctx.stroke();}
  else if(style==='gradientRing'){ctx.strokeStyle=conicGrad(shuffled(cols).slice(0,5),rand(0,6.28));ctx.lineWidth=rand(3,9)*DPR;ctx.beginPath();ctx.arc(CX,CY,R*.98,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

/* ================= composition ================= */
function chooseTheme(){
  const p=state.paletteChoice;
  if(p==='random') return chance(.42)?harmonicTheme():pick(THEMES);
  if(p.startsWith('h:')) return harmonicTheme(p.slice(2));
  if(p==='harmony') return harmonicTheme();
  const t=THEMES.find(t=>t.n===p);
  return t||pick(THEMES);
}

function buildPlan(){
  const n=state.sym;
  const rings=Math.max(3,Math.round(state.density*rand(.7,1.35)));
  const plan={n,rings,bandCurve:rand(.75,1.5),rotateOdd:chance(.5),centreR:rand(.05,.11),
    centreSeed:Math.random(),borderSeed:Math.random(),bands:[]};
  for(let i=0;i<rings;i++){
    plan.bands.push({
      motif:pick(MOTIF_KEYS), mult:pick([.5,1,1,1,1,2,2,3]), wf:rand(.4,1.1),
      filled:chance(.42), strokeToo:chance(.6), lw:rand(.8,3.4),
      alphaV:chance(.35)?rand(.35,.8):1, dash:chance(.14)?[rand(3,9),rand(3,8)]:null,
      sep:chance(.5), sepLw:rand(.6,2), sepDash:chance(.25), jitter:rand(.75,1.5), gap:rand(0,.16),
      glow:chance(.3), gradAngle:rand(0,6.28)
    });
  }
  plan.dust=chance(.6)?Math.floor(rand(60,260)):0;
  plan.grain=chance(.7);
  plan.wash=chance(.35);
  return plan;
}

function ringStyle(mode,band,i,rings,r0,r1,cols){
  const t=i/Math.max(1,rings-1);
  switch(mode){
    case 'solid': return cols[i%cols.length];
    case 'radial': return radialGrad(r0,r1,[pick(cols),pick(cols)]);
    case 'sweep': return conicGrad(shuffled(cols).slice(0,Math.max(3,Math.min(6,cols.length))),band.gradAngle);
    case 'ramp': return mix(cols[0],cols[cols.length-1],t);
    case 'duotone': return i%2?cols[0]:cols[1%cols.length];
    case 'prism': return conicGrad([hsl(t*360,80,60),hsl(t*360+90,80,60),hsl(t*360+180,80,60),hsl(t*360+270,80,60)],band.gradAngle);
    default: return null;
  }
}

function render(plan,theme){
  const cols=shuffled(theme.c).slice(0,Math.max(3,Math.floor(rand(3,theme.c.length+1))));
  const mode=state.colorMode==='auto'
    ? pick(['solid','solid','radial','radial','sweep','ramp','duotone','prism'])
    : state.colorMode;
  const n=plan.n, maxR=SIZE*.465, glowOK=theme.dark;

  ctx.clearRect(0,0,SIZE,SIZE); ctx.setLineDash([]);
  centre(cols,maxR*plan.centreR,n);
  let r=maxR*plan.centreR*rand(1.05,1.4);

  plan.bands.forEach((b,i)=>{
    if(r>=maxR) return;
    const t=(i+1)/plan.rings;
    const band=(maxR-r)/(plan.rings-i)*Math.pow(t,plan.bandCurve-1)*b.jitter;
    const r1=Math.min(r+band,maxR);
    if(r1-r<SIZE*.012){ r=r1; return; }
    const k=Math.max(3,Math.round(n*b.mult));
    const style=ringStyle(mode,b,i,plan.bands.length,r,r1,cols);
    ctx.save();
    ctx.strokeStyle=style; ctx.fillStyle=style;
    ctx.globalAlpha=b.alphaV;
    ctx.lineWidth=b.lw*DPR;
    if(b.dash) ctx.setLineDash(b.dash.map(v=>v*DPR));
    if(glowOK&&b.glow&&typeof style==='string'){ ctx.shadowColor=style; ctx.shadowBlur=rand(6,18)*DPR; }
    const phase=plan.rotateOdd&&i%2?Math.PI/k:0;
    const w=(Math.PI/k)*b.wf*(Math.PI/k>0?1:1)*(k/k);
    const opts={fill:b.filled,stroke:!b.filled||b.strokeToo};
    for(let j=0;j<k;j++) MOTIFS[b.motif]((Math.PI*2/k)*j+phase,r,r1,(Math.PI/k)*b.wf,opts);
    ctx.restore();

    if(b.sep){
      ctx.save();
      ctx.strokeStyle=mode==='solid'?cols[(i+1)%cols.length]:(typeof style==='string'?style:pick(cols));
      ctx.lineWidth=b.sepLw*DPR; ctx.globalAlpha=rand(.5,1);
      if(b.sepDash) ctx.setLineDash([2*DPR,4*DPR]);
      ctx.beginPath(); ctx.arc(CX,CY,r1,0,Math.PI*2); ctx.stroke();
      ctx.restore();
    }
    r=r1+band*b.gap;
  });

  border(cols,maxR*rand(.97,1.02),n);
  if(plan.wash) colourWash(cols);
  if(plan.dust) starDust(cols,plan.dust);
  if(plan.grain) grainOverlay(theme.dark?rand(.05,.13):rand(.04,.09));

  document.getElementById('caption').textContent=`${theme.n} · ${mode} · ${n}-fold · ${plan.bands.length} rings`;
}

function generate(){
  snapshot();
  state.theme=chooseTheme(); applyTheme();
  if(!document.getElementById('lockSym').checked){
    state.sym=pick([5,6,6,7,8,8,9,10,12,12,14,16,18,20,24]);
    document.getElementById('sym').value=state.sym;
    document.getElementById('symVal').textContent=state.sym;
    drawGuides();
  }
  state.plan=buildPlan();
  render(state.plan,state.theme);
  buildSwatches();
}
function recolour(){
  if(!state.plan) return generate();
  snapshot();
  state.theme=chooseTheme(); applyTheme();
  render(state.plan,state.theme);
  buildSwatches();
}

/* ================= theme application ================= */
function applyTheme(){
  const b=state.theme.bg, kind=pick(['radial','radial','linear','conic']);
  state.bgSpec={kind,cols:b,angle:rand(0,360)};
  canvas.style.background=bgCSS(state.bgSpec);
  drawGuides();
}
function bgCSS(s){
  if(s.kind==='linear') return `linear-gradient(${s.angle}deg, ${s.cols[0]}, ${s.cols[1]} 55%, ${s.cols[2]})`;
  if(s.kind==='conic') return `conic-gradient(from ${s.angle}deg, ${s.cols[0]}, ${s.cols[1]}, ${s.cols[2]}, ${s.cols[1]}, ${s.cols[0]})`;
  return `radial-gradient(circle at 50% 46%, ${s.cols[0]} 0%, ${s.cols[1]} 62%, ${s.cols[2]} 100%)`;
}
function paintBg(o,size){
  const s=state.bgSpec, c=size/2; let g;
  if(s.kind==='linear'){
    const a=s.angle*Math.PI/180;
    g=o.createLinearGradient(c-Math.cos(a)*c,c-Math.sin(a)*c,c+Math.cos(a)*c,c+Math.sin(a)*c);
    g.addColorStop(0,s.cols[0]);g.addColorStop(.55,s.cols[1]);g.addColorStop(1,s.cols[2]);
  } else if(s.kind==='conic'&&o.createConicGradient){
    g=o.createConicGradient(s.angle*Math.PI/180,c,c);
    [s.cols[0],s.cols[1],s.cols[2],s.cols[1],s.cols[0]].forEach((col,i,arr)=>g.addColorStop(i/(arr.length-1),col));
  } else {
    g=o.createRadialGradient(c,c*.92,0,c,c,size/2);
    g.addColorStop(0,s.cols[0]);g.addColorStop(.62,s.cols[1]);g.addColorStop(1,s.cols[2]);
  }
  o.fillStyle=g;o.fillRect(0,0,size,size);
}

/* ================= guides & swatches ================= */
function drawGuides(){
  const svg=document.getElementById('guides'),n=state.sym;
  const col=state.theme.dark?'rgba(255,255,255,.16)':'rgba(0,0,0,.14)';
  let s='';
  for(let i=0;i<n;i++){const a=(Math.PI*2/n)*i;
    s+=`<line x1="50" y1="50" x2="${50+Math.cos(a)*49}" y2="${50+Math.sin(a)*49}" stroke="${col}" stroke-width="0.25"/>`;}
  svg.innerHTML=s+`<circle cx="50" cy="50" r="49" fill="none" stroke="${col}" stroke-width="0.3"/>`;
}
function setInk(ink,btn){
  state.ink=ink; state.color=inkBase(ink); state.inkAngle=rand(0,6.28);
  document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
  if(btn) btn.classList.add('active');
}
function swatchBtn(ink,label){
  const b=document.createElement('button');
  b.className='swatch'; b.style.background=inkCSS(ink);
  b.title=label; b.setAttribute('aria-label',label);
  b.onclick=()=>setInk(ink,b);
  return b;
}
function group(title,inks,wrap,openWith){
  const g=document.createElement('div'); g.className='inkgroup';
  const h=document.createElement('h4'); h.textContent=title; g.appendChild(h);
  const row=document.createElement('div'); row.className='inkrow';
  inks.forEach((ink,i)=>{
    const b=swatchBtn(ink,ink.n||'Ink');
    if(openWith&&i===0){ setInk(ink,b); }
    row.appendChild(b);
  });
  g.appendChild(row); wrap.appendChild(g);
}
function buildSwatches(){
  const wrap=document.getElementById('swatches'); wrap.innerHTML='';
  const themeInks=state.theme.c.map((c,i)=>({n:'Palette '+(i+1),kind:'solid',c}));
  const tints=state.theme.c.slice(0,4).flatMap((c,i)=>[
    {n:'Tint '+(i+1),kind:'solid',c:mix(c,'#ffffff',0.42)},
    {n:'Shade '+(i+1),kind:'solid',c:mix(c,'#000000',0.42)}
  ]);
  group('This palette',themeInks,wrap,true);
  group('Tints & shades',tints,wrap);
  group('Metallics',INK_METAL,wrap);
  group('Gradient inks',INK_GRADIENT,wrap);
  group('Classic inks',INK_CLASSIC.map(([n,c])=>({n,kind:'solid',c})),wrap);
}

/* ================= controls ================= */
const palSel=document.getElementById('palette');
palSel.innerHTML=`<option value="random">Surprise me</option>`+
  `<option value="harmony">Auto harmony</option>`+
  HARMONIES.map(h=>`<option value="h:${h}">${h[0].toUpperCase()+h.slice(1)} harmony</option>`).join('')+
  THEMES.map(t=>`<option value="${t.n}">${t.n}${t.dark?'':' (light)'}</option>`).join('');
palSel.onchange=e=>{state.paletteChoice=e.target.value; recolour();};
document.getElementById('colormode').onchange=e=>{state.colorMode=e.target.value; recolour();};

const symEl=document.getElementById('sym');
symEl.oninput=()=>{state.sym=+symEl.value;document.getElementById('symVal').textContent=symEl.value;drawGuides();};
const sizeEl=document.getElementById('size');
sizeEl.oninput=()=>{state.brush=+sizeEl.value;document.getElementById('sizeVal').textContent=sizeEl.value;};
const denseEl=document.getElementById('dense');
denseEl.oninput=()=>{state.density=+denseEl.value;document.getElementById('denseVal').textContent=denseEl.value;};
document.getElementById('mirror').onchange=e=>state.mirror=e.target.checked;
document.getElementById('showGuides').onchange=e=>document.getElementById('guides').classList.toggle('hidden',!e.target.checked);
document.getElementById('inkstyle').onchange=e=>state.nib=e.target.value;
const opEl=document.getElementById('opacity');
opEl.oninput=()=>{state.opacity=+opEl.value/100;document.getElementById('opacityVal').textContent=opEl.value;};
document.getElementById('custom').oninput=e=>{
  setInk({n:'Custom',kind:'solid',c:e.target.value});
};
document.getElementById('generate').onclick=generate;
document.getElementById('reColor').onclick=recolour;
document.getElementById('undo').onclick=()=>{const i=state.history.pop();if(i&&i.width===SIZE)ctx.putImageData(i,0,0);else ctx.clearRect(0,0,SIZE,SIZE);};
document.getElementById('clear').onclick=()=>{snapshot();ctx.clearRect(0,0,SIZE,SIZE);document.getElementById('caption').textContent='';};
document.getElementById('download').onclick=()=>{
  const out=document.createElement('canvas');out.width=out.height=SIZE;
  const o=out.getContext('2d');paintBg(o,SIZE);o.drawImage(canvas,0,0);
  const a=document.createElement('a');a.download='mandala.png';a.href=out.toDataURL('image/png');a.click();
};
let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{setupCanvas();},150);});

setupCanvas();applyTheme();drawGuides();buildSwatches();generate();
