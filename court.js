'use strict';
(() => {
 const canvas=document.getElementById('court'), ctx=canvas.getContext('2d');
 const needle=document.getElementById('needle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let points=0, position=0, launched=0, shooting=false, audioContext;
 function line(x1,y1,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
 function ball(x,y,r,rotation){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.shadowColor='#0009';ctx.shadowBlur=15;ctx.shadowOffsetY=8;ctx.fillStyle='#ff842c';ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.save();ctx.clip();line(-r,0,r,0,'#632900',3);line(0,-r,0,r,'#632900',3);ctx.strokeStyle='#632900';ctx.lineWidth=3;for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*r*.9,0,r*.65,r*1.1,0,0,Math.PI*2);ctx.stroke()}ctx.restore();ctx.restore()}
 function draw(now){
  ctx.clearRect(0,0,900,850);
  const glow=ctx.createRadialGradient(450,170,20,450,230,540);glow.addColorStop(0,'#324358');glow.addColorStop(1,'#121a24');ctx.fillStyle=glow;ctx.fillRect(0,0,900,850);
  // Court markings are game geometry, drawn in perspective.
  ctx.fillStyle='#26303b';ctx.beginPath();ctx.moveTo(235,350);ctx.lineTo(665,350);ctx.lineTo(960,850);ctx.lineTo(-60,850);ctx.closePath();ctx.fill();
  for(let y=380;y<850;y+=54)line(0,y,900,y,'#ffffff05');
  line(235,350,-60,850,'#e3cdb238',3);line(665,350,960,850,'#e3cdb238',3);
  line(340,350,230,675,'#e3cdb24a',3);line(560,350,670,675,'#e3cdb24a',3);line(230,675,670,675,'#e3cdb24a',3);
  ctx.strokeStyle='#e3cdb24a';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(450,675,220,70,0,0,Math.PI*2);ctx.stroke();
  line(450,20,450,110,'#79818d',10);
  ctx.fillStyle='#b9d3eb19';ctx.fillRect(295,80,310,190);ctx.strokeStyle='#d7e3ef';ctx.lineWidth=7;ctx.strokeRect(295,80,310,190);ctx.lineWidth=5;ctx.strokeRect(395,161,110,85);
  // Net contracts when a shot goes through.
  const t=shooting?Math.min((now-launched)/1100,1):0;
  const sway=shooting&&t>.68?Math.sin((t-.68)*25)*12:0;
  for(let i=0;i<9;i++){const x=369+i*20;line(x,277,405+i*11+sway,370,'#d2dbe1aa',2);if(i<8)line(x,277,405+(i+1)*11+sway,370,'#d2dbe177',2)}
  line(389,323,512,323,'#d2dbe177',2);line(405+sway,369,493+sway,369,'#d2dbe177',2);
  let bx=450,by=720,br=61;
  if(shooting){bx=450;by=720*(1-t)*(1-t)+2*(-130)*t*(1-t)+360*t*t;br=61-30*t;if(t>=1)shooting=false;}
  ball(bx,by,br,shooting?t*7:0);
  ctx.strokeStyle='#ff7930';ctx.lineWidth=9;ctx.beginPath();ctx.ellipse(450,277,82,15,0,0,Math.PI*2);ctx.stroke();
  if(state==='shoot'){position=reduced?.5:(Math.sin(now/320)+1)/2;needle.style.left=`${position*98}%`;}
  requestAnimationFrame(draw);
 }
 window.takeBasketballShot=()=>{
  const bonus=position>=.42&&position<=.58;points+=bonus?3:2;
  document.getElementById('points').textContent=String(points).padStart(2,'0');document.getElementById('burst').textContent=bonus?'PERFECT! +3':'SWISH! +2';launched=performance.now();shooting=true;
  try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.frequency.setValueAtTime(520,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(bonus?1040:780,audioContext.currentTime+.14);g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.22);o.start();o.stop(audioContext.currentTime+.23)}catch{}
 };
 window.resetCourt=()=>{points=0;shooting=false;document.getElementById('points').textContent='00';};
 requestAnimationFrame(draw);
})();
