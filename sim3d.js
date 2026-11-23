/* Offline WebGL 3D simulator. Geometry is rendered with real 3D vertices,
   depth-testing, camera orbit and animated road participants. No CDN or model assets.
   1,000 scene configurations are generated from 100 authored case roots.
   These are educational illustrations, NOT driving physics or legal evidence. */
window.V5_3D=(()=>{
'use strict';let running=0,canvas=null,gl=null,soft=null,program=null,buf=null,loc={},scene=null,phase=0,orbit=0.38,elevation=0.53,drag=null,last=0,anim=0;
const rgb=(hex)=>{let s=hex.replace('#','');return [parseInt(s.slice(0,2),16)/255,parseInt(s.slice(2,4),16)/255,parseInt(s.slice(4,6),16)/255]};
const norm=a=>{let d=Math.hypot(...a)||1;return a.map(x=>x/d)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
function compile(type,src){let sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh}
function setup(){let v=compile(gl.VERTEX_SHADER,`attribute vec3 aP;attribute vec3 aC;uniform vec3 eye;uniform vec3 rgt;uniform vec3 cup;uniform vec3 fwd;uniform float aspect;varying vec3 col;void main(){vec3 v=aP-eye;float d=max(0.1,dot(v,fwd));gl_Position=vec4(dot(v,rgt)*1.75/aspect,dot(v,cup)*1.75,1.003*d-0.25,d);col=aC;}`);
let f=compile(gl.FRAGMENT_SHADER,`precision mediump float;varying vec3 col;void main(){gl_FragColor=vec4(col,1.0);}`);
program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);buf=gl.createBuffer();
loc={aP:gl.getAttribLocation(program,'aP'),aC:gl.getAttribLocation(program,'aC'),eye:gl.getUniformLocation(program,'eye'),rgt:gl.getUniformLocation(program,'rgt'),cup:gl.getUniformLocation(program,'cup'),fwd:gl.getUniformLocation(program,'fwd'),aspect:gl.getUniformLocation(program,'aspect')};
gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(loc.aP);gl.enableVertexAttribArray(loc.aC);gl.vertexAttribPointer(loc.aP,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(loc.aC,3,gl.FLOAT,false,24,12);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);}
let verts=[],faceData=[];
function face(q,c,shade=1){const color=rgb(c).map(x=>Math.min(1,x*shade));faceData.push({q,color});for(const j of [0,1,2,0,2,3])verts.push(...q[j],...color)}
function box(x,y,z,sx,sy,sz,color,rot=0){let C=Math.cos(rot),S=Math.sin(rot),q=[];for(let a of [-1,1])for(let b of [-1,1])for(let c of [-1,1]){let X=a*sx/2,Z=c*sz/2;q.push([x+X*C+Z*S,y+b*sy/2,z-X*S+Z*C])}
const ix=(a,b,c)=>(a===1?4:0)+(b===1?2:0)+(c===1?1:0);face([q[ix(-1,1,-1)],q[ix(1,1,-1)],q[ix(1,1,1)],q[ix(-1,1,1)]],color,1.06);
face([q[ix(-1,-1,1)],q[ix(1,-1,1)],q[ix(1,-1,-1)],q[ix(-1,-1,-1)]],color,.80);
face([q[ix(-1,-1,-1)],q[ix(1,-1,-1)],q[ix(1,1,-1)],q[ix(-1,1,-1)]],color,.82);
face([q[ix(1,-1,1)],q[ix(-1,-1,1)],q[ix(-1,1,1)],q[ix(1,1,1)]],color,.93);
face([q[ix(-1,-1,1)],q[ix(-1,-1,-1)],q[ix(-1,1,-1)],q[ix(-1,1,1)]],color,.73);
face([q[ix(1,-1,-1)],q[ix(1,-1,1)],q[ix(1,1,1)],q[ix(1,1,-1)]],color,.90)}
function car(x,z,color,rot=0,size=1){box(x,.57*size,z,1.65*size,.68*size,3.05*size,color,rot);box(x,1.12*size,z-.18*size,1.35*size,.58*size,1.76*size,'#bcd0d8',rot);for(let dx of [-.84,.84])for(let dz of [-.91,.91]){let X=x+dx*Math.cos(rot)+dz*Math.sin(rot),Z=z-dx*Math.sin(rot)+dz*Math.cos(rot);box(X,.40*size,Z,.23*size,.55*size,.52*size,'#303740',rot)}box(x,.79*size,z-1.55*size,1.15*size,.16*size,.12*size,'#f2e9d4',rot)}
function post(x,z,col){box(x,.85,z,.085,1.7,.085,'#707b83');box(x,1.78,z,.72,.72,.12,col)}
function pedestrian(x,z,t=0){box(x,.9,z,.45,.86,.38,'#a86c55');box(x,1.59,z,.31,.32,.33,'#e6bd9a');box(x-.14,.27,z+.07+t,.13,.53,.14,'#434a54');box(x+.14,.27,z-.07-t,.13,.53,.14,'#434a54')}
function cyclist(x,z,t=0){let p=z-t;for(const zz of [-.55,.55]){box(x-.32,.43,p+zz,.08,.7,.08,'#54656f');box(x+.32,.43,p+zz,.08,.7,.08,'#54656f');box(x,.43,p+zz,.72,.07,.07,'#54656f')};box(x,.88,p,.30,.72,.32,'#438e89');box(x,1.35,p,.28,.25,.28,'#deb48c')}
function roadScene(s,st,t){const typ=s.scene3d?.type||s.type,variant=s.scene3d?.variant||0,features=s.scene3d?.features||{};const fog=s.scene3d?.weather, rain=fog==='lluvia';
// 3D town base: junction geometry always visible in genuinely relevant topologies.
box(0,-.16,0,70,.28,65,rain?'#dadde0':'#eef0ef');
const crossing=/intersection|roundabout|crossing|traffic|tram|urban|cycle/.test(typ);
const wide=/highway|motorway|breakdown|rain|snow|jam/.test(typ);
box(0,-.06,0,wide?14:6.9,.12,62,rain?'#89989f':'#aab2b5');
if(crossing)box(0,-.052,-2,58,.12,6.9,rain?'#89989f':'#aab2b5');
if(wide){for(const x of [-2.3,2.3])for(let z=-28;z<29;z+=4.3)box(x,.035,z,.08,.012,2.2,'#f5f5f4');}
if(typ==='roundabout'){for(let j=0;j<24;j++){let a=j*Math.PI/12;box(Math.sin(a)*5,.12,-2+Math.cos(a)*5,1.6,.20,1.6,'#d2dcce',a)}box(0,.19,-2,2.5,.45,2.5,'#bacdb7')}
for(let z=-28;z<29;z+=4.2){if(!crossing||Math.abs(z+2)>4)box(0,.024,z,.10,.012,2.05,'#f9f7f1')}
if(crossing)for(let x=-27;x<=27;x+=4.2){if(Math.abs(x)>4)box(x,.028,-2,2.0,.012,.09,'#f7f5ef')}
if(/crossing/.test(typ)){for(let x=-2.8;x<=2.8;x+=.72)box(x,.038,-3,.36,.015,6.1,'#f7f6f0')}
if(/cycle/.test(typ)&&/señal que autoriza|carril bici|vía ciclista/.test(features.cycleSign||s.question||'')){box(3.9,.001,0,1.25,.02,60,'#9dc5b0');box(3.25,.04,0,.055,.012,60,'#ffffff');for(let z=-26;z<27;z+=6){box(3.9,.03,z,.60,.012,1.45,'#e6f3e9')}}
if(typ==='tram'){for(const x of [-1.2,1.2])box(x,.045,0,.12,.05,60,'#818b91')}
if(typ==='parking'){for(let z=-23;z<24;z+=7)box(7.35,.035,z,.07,.02,5.7,'#faf9f6')}
for(let side of [-1,1])for(let i=0;i<4;i++){let z=-23+i*15+variant*.6;let x=side*(11.7+(variant%3)*1.8);box(x,.82,z,4.8,1.65,7,'#e5e8e9');if(i%2)box(x,1.85,z,4.5,.25,6.6,'#d2d8da')}
if(crossing)for(let side of [-1,1])for(let i=0;i<3;i++){let x=side*(15+i*16);box(x,.69,-13,7.5,1.4,7.5,'#e6e8e6')}
const tMove=Math.min(1,st/2),speed=st===0?0:(.7+tMove*1.7)*t;
car(-1.45,8-speed*.95,'#c49b60',0,1.04);
const actor=s.scene3d?.actor||'coche';let ax=5.8-(variant%3)*1.0,az=-2.2+((variant%4)-1)*1.2;
if(actor==='peaton')pedestrian(/crossing/.test(typ)?-.8:ax,/crossing/.test(typ)?-3:az,t*.27);
else if(actor==='bici')cyclist(/cycle/.test(typ)?-1.43:ax,/cycle/.test(typ)?-4.3:az,t*.65);
else if(actor==='moto'){car(ax,az-t*.8,'#ca8d46',Math.PI/2,.6)}
else if(actor==='bus'){car(ax,az-t*.5,'#c98e5e',Math.PI/2,1.47)}
else if(actor==='camion'){car(ax,az-t*.7,'#ca985f',Math.PI/2,1.57)}
else if(actor==='ambulancia'){car(ax,az-t*.6,'#e3e7e8',Math.PI/2,1.12);box(ax,.83,az-t*.6,.3,.13,.35,'#376d91')}
else if(actor==='agente')pedestrian(ax,az,t*.08);
else if(actor==='tram'){car(ax,az-t*.25,'#d3a36b',Math.PI/2,1.6);box(ax,.2,az-2,.08,.1,28,'#b4a18a')}
else if(actor==='averiado'){car(ax,az,'#c99053',Math.PI/2,1);box(ax,1.60,az,.18,.08,.18,'#f0b252')}
else car(ax,az-t*.8,'#3b5260',Math.PI/2,actor==='furgoneta'?1.25:1.0);
if(variant>=4||/tráfico contrario que impide/.test(features.oncoming||'')){car(1.43,-10+(t*2), '#8b9aaa',0,.94)}
if(variant>=6)pedestrian(-7.8,-7+(t*.18));
let words=(s.name+' '+s.question).toLowerCase();let signal=words.includes('stop')?'stop':words.includes('ceda')?'yield':/semáfor|rojo|ámbar|verde/.test(words)?'lights':null;
if(signal==='stop')post(-3.7,1.3,'#c34236');else if(signal==='yield')post(-3.7,1.3,'#fafafa');else if(signal==='lights'){post(-3.7,-1.3,'#303a3c');let signalColor=/verde/.test(words)?'#559c72':/amarill|ámbar/.test(words)?'#d8ad53':'#c65b56';box(-3.7,1.92,-1.3,.27,.28,.14,signalColor)}
if(st>=1){let c=actor==='peaton'?'#eab16d':'#e0c19a';box(ax,.01,az,actor==='peaton'?1.7:3.8,.024,actor==='peaton'?2:4.7,c)}
if(typ==='breakdown')post(3.8,1.4,'#efb451');
}
function camera(){let a=orbit,e=elevation;let eye=[Math.sin(a)*24,8+e*15,Math.cos(a)*25];let target=[0,0,-2];let fwd=norm(sub(target,eye)),right=norm(cross(fwd,[0,1,0])),up=norm(cross(right,fwd));gl.uniform3fv(loc.eye,eye);gl.uniform3fv(loc.fwd,fwd);gl.uniform3fv(loc.rgt,right);gl.uniform3fv(loc.cup,up)}
function draw(ts){if((!gl&&!soft)||!canvas||!canvas.isConnected){stop();return}if(ts-last<42){running=requestAnimationFrame(draw);return}last=ts;let ratio=Math.min(2,window.devicePixelRatio||1),W=Math.max(200,Math.round(canvas.clientWidth*ratio)),H=Math.max(170,Math.round(canvas.clientHeight*ratio));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;if(gl)gl.viewport(0,0,W,H)}
let bg=scene?.scene3d?.weather==='noche'?[.65,.68,.73]:[.963,.968,.969];
if(gl){gl.clearColor(...bg,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(loc.aspect,canvas.width/canvas.height);camera()}
verts=[];faceData=[];let t=(Math.sin(ts/2100)+1)/2;roadScene(scene,phase,t);
if(gl){gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.DYNAMIC_DRAW);gl.vertexAttribPointer(loc.aP,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(loc.aC,3,gl.FLOAT,false,24,12);gl.drawArrays(gl.TRIANGLES,0,verts.length/6)}
else drawSoftware(bg);
running=requestAnimationFrame(draw)}
function drawSoftware(bg){const c=soft,W=canvas.width,H=canvas.height;
c.fillStyle='rgb('+bg.map(x=>Math.round(x*255)).join(',')+')';c.fillRect(0,0,W,H);
let eye=[Math.sin(orbit)*24,8+elevation*15,Math.cos(orbit)*25],target=[0,0,-2],fw=norm(sub(target,eye)),rg=norm(cross(fw,[0,1,0])),up=norm(cross(rg,fw));
const dp=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];const project=p=>{let v=sub(p,eye),d=Math.max(.1,dp(v,fw));return [W*.5+dp(v,rg)*1.75*H/(2*d),H*.5-dp(v,up)*1.75*H/(2*d),d]};
const faces=faceData.map(f=>({color:f.color,pts:f.q.map(project)}));faces.sort((a,b)=>b.pts.reduce((z,p)=>z+p[2],0)-a.pts.reduce((z,p)=>z+p[2],0));
for(let f of faces){if(f.pts.some(p=>p[2]<=0.3))continue;c.beginPath();c.moveTo(f.pts[0][0],f.pts[0][1]);for(let j=1;j<f.pts.length;j++)c.lineTo(f.pts[j][0],f.pts[j][1]);c.closePath();c.fillStyle='rgb('+f.color.map(x=>Math.round(x*255)).join(',')+')';c.fill()}
}
function mount(s,p){stop();scene=s;phase=p||0;canvas=document.getElementById('v5-3d');if(!canvas)return;gl=canvas.getContext('webgl',{alpha:false,antialias:true,preserveDrawingBuffer:false});soft=null;if(!gl){soft=canvas.getContext('2d',{alpha:false});if(!soft){canvas.style.display='none';document.querySelector('.v5-2d-fallback')?.classList.add('visible');return}}else{try{setup()}catch(e){console.warn('WebGL init unavailable; showing static diagram',e);canvas.style.display='none';document.querySelector('.v5-2d-fallback')?.classList.add('visible');return}}
canvas.style.display='block';orbit=.38;elevation=.53;canvas.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,a:orbit,e:elevation};canvas.setPointerCapture(e.pointerId)};
canvas.onpointermove=e=>{if(!drag)return;orbit=drag.a+(e.clientX-drag.x)/200;elevation=Math.max(.12,Math.min(1.2,drag.e+(e.clientY-drag.y)/400))};canvas.onpointerup=()=>{drag=null};last=0;running=requestAnimationFrame(draw)}
function updatePhase(p){phase=p||0}
function stop(){if(running)cancelAnimationFrame(running);running=0;if(gl){try{gl.getExtension('WEBGL_lose_context')?.loseContext()}catch{}}gl=null;soft=null;canvas=null;scene=null;drag=null}
return {mount,updatePhase,stop};
})();
