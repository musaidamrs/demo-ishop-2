'use strict';
const $=s=>document.querySelector(s);
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
(function matrixRain(){
 const canvas=$('#matrix'),ctx=canvas?.getContext('2d');if(!ctx)return;
 let width=0,height=0,columns=[],raf=0,last=0,atlas=[];
 const mobile=matchMedia('(max-width:760px)');
 const symbolFiles=['assets/sf-apple.logo.png','assets/sf-applewatch.png','assets/sf-iphone.png','assets/sf-macbook.png','assets/sf-vision.pro.png','assets/sf-icloud.fill.png','assets/sf-airpods.max.png'];
 let symbols=[];
 const phaseCount=64;
 const mixColor=(a,b,t)=>`rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')})`;
 function sprites(){atlas=[];const dark=document.documentElement.dataset.theme==='dark';for(const img of symbols){const phases=[];for(let k=0;k<phaseCount;k++){const glow=(1-Math.cos(k/phaseCount*Math.PI*2))/2,c=document.createElement('canvas');c.width=80;c.height=80;const g=c.getContext('2d'),scale=68/Math.max(img.naturalWidth,img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;g.drawImage(img,(80-w)/2,(80-h)/2,w,h);g.globalCompositeOperation='source-in';const gradient=g.createLinearGradient(0,0,80,80);gradient.addColorStop(0,dark?'#69212a':mixColor([145,22,42],[222,50,69],glow));gradient.addColorStop(.5,dark?mixColor([160,50,65],[242,173,177],glow):mixColor([178,29,52],[242,85,99],glow));gradient.addColorStop(1,dark?mixColor([119,31,43],[219,126,135],glow):mixColor([133,20,39],[212,54,77],glow));g.fillStyle=gradient;g.fillRect(0,0,80,80);phases.push(c)}atlas.push(phases)}}
 function resize(){const w=innerWidth,h=innerHeight;if(w===width&&Math.abs(h-height)<120)return;width=w;height=h;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);columns=Array.from({length:Math.ceil(w/(mobile.matches?92:110))},(_,i)=>({x:i*(mobile.matches?92:110),offset:i*193,speed:22+i%5*6,seed:i*7}));draw(performance.now())}
 function draw(t){ctx.clearRect(0,0,width,height);const time=motionPreference.matches?0:t/1000,dark=document.documentElement.dataset.theme==='dark';for(const col of columns){const y=(time*col.speed+col.offset)%(height+400)-400;for(let j=0;j<5;j++){const yy=y+j*88;if(yy<0||yy>height)continue;const cycle=(time*.12+col.seed*.137+j*.173)%1,glow=(1-Math.cos(cycle*Math.PI*2))/2;ctx.globalAlpha=dark?.22+j*.03+Math.pow(glow,3)*.35:.38+.62*glow;const phase=Math.round(cycle*phaseCount)%phaseCount;if(atlas.length)ctx.drawImage(atlas[(col.seed+j*3)%atlas.length][phase],col.x,yy,28,28)}}ctx.globalAlpha=1}
 function frame(t){if(t-last> (mobile.matches?32:24)){draw(t);last=t}raf=requestAnimationFrame(frame)}
 function start(){cancelAnimationFrame(raf);if(!document.hidden&&!motionPreference.matches)raf=requestAnimationFrame(frame);else if(motionPreference.matches)draw(0)}
 new MutationObserver(()=>{sprites();draw(performance.now());start()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',start);motionPreference.addEventListener('change',start);Promise.all(symbolFiles.map(src=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src}))).then(images=>{symbols=images.filter(Boolean);sprites();resize();start()});
})();

(function initButtonGlow(){
 const selector='.button:not(.secondary),.quantity.primary';
 const hover=matchMedia('(any-hover: hover) and (any-pointer: fine)');
 let active=null,raf=0,clientX=0,clientY=0,x=0,y=0,last=0;
 function clear(){cancelAnimationFrame(raf);raf=0;last=0;if(active)active.removeAttribute('data-glow-active');active=null;}
 function enabled(){return hover.matches&&!motionPreference.matches&&!document.hidden;}
 function paint(time){
  raf=0;if(!active?.isConnected||!enabled()){clear();return}
  const rect=active.getBoundingClientRect(),tx=clientX-rect.left,ty=clientY-rect.top;
  const step=1-Math.exp(-Math.min(last?time-last:16,64)/55);last=time;
  x+=(tx-x)*step;y+=(ty-y)*step;
  active.style.setProperty('--glow-x',x.toFixed(2)+'px');active.style.setProperty('--glow-y',y.toFixed(2)+'px');
  if(Math.abs(tx-x)+Math.abs(ty-y)>.2)raf=requestAnimationFrame(paint);else last=0;
 }
 function move(e){
  if(e.pointerType!=='mouse'||!enabled()){clear();return}
  const button=e.target.closest?.(selector);
  if(!button||button.matches(':disabled,[aria-disabled="true"]')){clear();return}
  clientX=e.clientX;clientY=e.clientY;
  if(button!==active){clear();active=button;const rect=button.getBoundingClientRect();x=clientX-rect.left;y=clientY-rect.top;button.style.setProperty('--glow-x',x+'px');button.style.setProperty('--glow-y',y+'px');button.setAttribute('data-glow-active','true');}
  if(!raf)raf=requestAnimationFrame(paint);
 }
 document.addEventListener('pointerover',move,{passive:true});
 document.addEventListener('pointermove',move,{passive:true});
 document.addEventListener('pointerout',e=>{if(active&&!active.contains(e.relatedTarget))clear()},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear()});
 document.addEventListener('click',e=>{if(e.target.closest?.('a[href]'))clear()});
 addEventListener('blur',clear);addEventListener('popstate',clear);
 hover.addEventListener('change',clear);motionPreference.addEventListener('change',clear);
})();
