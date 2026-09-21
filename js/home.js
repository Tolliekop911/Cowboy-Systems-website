document.documentElement.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Nav: solid once scrolled, tucks away on the way down, back on the way up */
const nav=document.getElementById('nav');
let lastY=scrollY;
const navScroll=()=>{
  const y=scrollY; nav.classList.toggle('solid',y>40);
  const busy=nav.classList.contains('open')||nav.querySelector('.dd.open');
  if(busy||y<140){nav.classList.remove('nav-hide');document.body.classList.remove('nav-up');lastY=y;return;}
  if(y>lastY+6){nav.classList.add('nav-hide');document.body.classList.add('nav-up');lastY=y;}
  else if(y<lastY-6){nav.classList.remove('nav-hide');document.body.classList.remove('nav-up');lastY=y;}
};
navScroll(); addEventListener('scroll',navScroll,{passive:true});

/* Magnetic buttons */
if(!reduce) document.querySelectorAll('.mag').forEach(el=>{
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();
    el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;});
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

/* Card tilt + spotlight */
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    card.style.setProperty('--mx',px*100+'%');card.style.setProperty('--my',py*100+'%');
    if(!reduce) card.style.transform=`perspective(950px) rotateX(${(py-.5)*-4}deg) rotateY(${(px-.5)*5}deg)`;});
  card.addEventListener('pointerleave',()=>card.style.transform='');
});

/* Lenis */
if(window.Lenis && !reduce){const lenis=window.lenis=new Lenis({lerp:.09});
  (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})();
  if(window.ScrollTrigger) lenis.on('scroll',ScrollTrigger.update);}

/* Natural page position of a stacking card (sticky cards report where they are stuck) */
window.stackY=el=>{const stack=el.parentElement;let y=stack.getBoundingClientRect().top+scrollY;const gap=parseFloat(getComputedStyle(stack).rowGap)||0;
  for(const c of stack.children){if(c===el)break;y+=c.offsetHeight+gap;}return y;};

/* Clean URLs: scroll to sections without a #hash in the address bar */
const toSection=(id,smooth)=>{
  if(!id||id==='top'){window.lenis&&smooth?window.lenis.scrollTo(0):scrollTo({top:0,behavior:smooth&&!reduce?'smooth':'auto'});return true;}
  const el=document.getElementById(id); if(!el) return false;
  if(el.classList.contains('stack-card')){
    const sticky=getComputedStyle(el).position==='sticky', i=[...el.parentElement.children].indexOf(el);
    const y=Math.max(0,window.stackY(el)-(sticky?146+i*12:140));
    if(window.lenis&&smooth) window.lenis.scrollTo(y); else scrollTo({top:y,behavior:smooth&&!reduce?'smooth':'auto'});
    return true;
  }
  if(window.lenis&&smooth) window.lenis.scrollTo(el,{offset:-90}); else el.scrollIntoView({behavior:smooth&&!reduce?'smooth':'auto'});
  return true;
};
const samePath=p=>(p.replace(/\.html$/,'').replace(/\/index$/,'/')||'/');
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]'); if(!a||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank') return;
  const h=a.getAttribute('href'); if(h==='#') return;
  let u; try{u=new URL(h,location.href);}catch{return;}
  if(u.origin!==location.origin||samePath(u.pathname)!==samePath(location.pathname)) return;
  if(toSection(u.hash.slice(1),true)) e.preventDefault();
});
const stripHash=()=>{const id=decodeURIComponent(location.hash.slice(1));
  history.replaceState(null,'',location.pathname+location.search); return id;};
if(location.hash){const id=stripHash(); addEventListener('load',()=>setTimeout(()=>toSection(id,false),50));}
addEventListener('hashchange',()=>{if(location.hash) toSection(stripHash(),true);});

/* Reveals: the hero plays as soon as the page is parsed */
(()=>{
  const hero=document.querySelector('.hero');
  if(reduce||!window.gsap){document.querySelectorAll('.reveal').forEach(e=>e.style.opacity=1);hero&&hero.classList.add('lit');return;}
  gsap.set('.reveal',{opacity:1});
  if(hero){
    const has=q=>!!hero.querySelector(q), tl=gsap.timeline({defaults:{ease:'power4.out'}});
    if(has('h1 .word span')) tl.from(hero.querySelectorAll('h1 .word span'),{yPercent:115,duration:1.05,stagger:.08});
    ['.hero-eyebrow','.hero-sub','.hero-ctas','.hero-meta'].forEach((q,i)=>{if(has(q)) tl.from(hero.querySelector(q),{y:i?20:16,opacity:0,duration:.8},i?'-=.7':.2);});
    tl.add(()=>hero.classList.add('lit'),'-=.5');
  }
  if(window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.card,.band,.rc,.pcard,.sitem,.sec-panel,.addon,.addon-feature,.faq-item,.story-panel').forEach(c=>{
      gsap.from(c,{y:38,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 90%'}});});
    addEventListener('load',()=>ScrollTrigger.refresh());
  }
})();

/* Real product screens: tab switcher (all screens preloaded, instant switch) */
(function(){
  const tabs=[...document.querySelectorAll('.shots-tabs [role="tab"]')], imgs=[...document.querySelectorAll('#shot-stack img')], cap=document.getElementById('shot-cap');
  if(!tabs.length||tabs.length!==imgs.length) return;
  const show=i=>{tabs.forEach((b,j)=>b.setAttribute('aria-selected',String(i===j)));
    imgs.forEach((im,j)=>{im.classList.toggle('on',i===j);i===j?im.removeAttribute('aria-hidden'):im.setAttribute('aria-hidden','true');});
    cap.textContent=tabs[i].dataset.cap;};
  tabs.forEach((t,i)=>{
    t.addEventListener('click',()=>show(i));
    t.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();
      const n=(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();show(n);});
  });
})();

/* Comparison table: show the swipe hint only when the table is wider than its box */
(function(){const s=document.querySelector('.cmp-scroll'),h=document.querySelector('.cmp-hint');if(!s||!h)return;
  const f=()=>h.classList.toggle('on',s.scrollWidth>s.clientWidth+2);f();addEventListener('resize',f,{passive:true});})();

/* Product videos: a slot with data-video set becomes playable; empty slots stay "Coming soon" */
document.querySelectorAll('.vid').forEach(v=>{
  const src=(v.dataset.video||'').trim(), btn=v.querySelector('.vid-play'), frame=v.querySelector('.vid-frame');
  if(!src||!btn) return;
  v.querySelector('.vid-soon')?.remove(); btn.disabled=false;
  btn.addEventListener('click',()=>{
    const el=/\.(mp4|webm)(\?|$)/i.test(src)?Object.assign(document.createElement('video'),{src,controls:true,autoplay:true,playsInline:true})
      :Object.assign(document.createElement('iframe'),{src:src+(src.includes('?')?'&':'?')+'autoplay=1',allow:'autoplay; fullscreen; picture-in-picture',title:v.querySelector('b')?.textContent||'Product video'});
    frame.innerHTML=''; frame.appendChild(el);
  });
});

/* Nav: dropdowns (click for touch, hover for mouse) and the mobile menu */
(function(){
  const dds=[...document.querySelectorAll('.dd')], burger=document.querySelector('.nav-burger');
  const closeAll=except=>dds.forEach(d=>{if(d!==except){d.classList.remove('open');d.querySelector('.dd-btn').setAttribute('aria-expanded','false');}});
  dds.forEach(d=>d.querySelector('.dd-btn').addEventListener('click',e=>{e.stopPropagation();const o=!d.classList.contains('open');closeAll(d);
    d.classList.toggle('open',o);e.currentTarget.setAttribute('aria-expanded',String(o));}));
  document.addEventListener('click',e=>{if(!e.target.closest('.dd'))closeAll();});
  burger&&burger.addEventListener('click',e=>{e.stopPropagation();const o=!nav.classList.contains('open');nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',String(o));});
  document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');burger&&burger.setAttribute('aria-expanded','false');closeAll();}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAll();nav.classList.remove('open');}});
})();

/* Platform tab bar follows the stacking cards. Sticky cards report their stuck
   position, so positions come from the layout: the stack's top plus the cards
   and gaps before each one. */
(function(){
  const links=[...document.querySelectorAll('#stackTabs a')], cards=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if(!cards.length) return;
  let last='';
  const set=id=>{if(id===last)return;last=id;links.forEach(a=>{const on=a.getAttribute('href')==='#'+id;a.setAttribute('aria-current',on?'true':'false');
    if(on&&matchMedia('(max-width:900px)').matches){const bar=a.parentElement;bar.scrollTo({left:a.offsetLeft-(bar.clientWidth-a.offsetWidth)/2,behavior:'smooth'});}});};
  const spy=()=>{const y=scrollY+innerHeight*.45;let cur=cards[0].id;cards.forEach(c=>{if(window.stackY(c)<=y)cur=c.id;});set(cur);};
  addEventListener('scroll',spy,{passive:true}); addEventListener('resize',spy); spy();
})();

/* Numbers count up when they scroll into view */
(function(){
  const els=[...document.querySelectorAll('[data-count]')]; if(!els.length) return;
  const fmt=(el,v)=>{const d=+(el.dataset.dec||0);el.textContent=(el.dataset.pre||'')+v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})+(el.dataset.suf||'');};
  if(reduce) return;
  els.forEach(el=>fmt(el,0));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
    const el=e.target,to=parseFloat(el.dataset.count),t0=performance.now(),dur=1400;
    (function step(t){const p=Math.min(1,(t-t0)/dur),k=1-Math.pow(1-p,3);fmt(el,to*k);if(p<1)requestAnimationFrame(step);else fmt(el,to);})(t0);
    setTimeout(()=>fmt(el,to),dur+200);}),{threshold:.6});
  els.forEach(el=>io.observe(el));
})();

/* 3D showcase flattens, floating cards drift, stacked cards settle back */
addEventListener('load',()=>{
  if(reduce||!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mobile=matchMedia('(max-width:760px)').matches;
  if(document.querySelector('.show-stage')){
  gsap.fromTo('.show-3d',{rotateX:mobile?10:18,scale:mobile?.97:.94},{rotateX:0,scale:1,ease:'none',
    scrollTrigger:{trigger:'.show-stage',start:'top 90%',end:'top 18%',scrub:true}});
  gsap.utils.toArray('.float').forEach((f,i)=>{
    gsap.from(f,{opacity:0,y:30,duration:.8,delay:.9+i*.15,ease:'power3.out'});
    gsap.to(f,{y:i%2?-70:-40,ease:'none',scrollTrigger:{trigger:'.show-stage',start:'top bottom',end:'bottom top',scrub:true}});
  });
  }
  if(matchMedia('(min-width:901px)').matches){
    const cards=gsap.utils.toArray('.stack-card');
    cards.forEach((c,i)=>{const next=cards[i+1];if(!next)return;
      gsap.to(c,{scale:.94,ease:'none',scrollTrigger:{trigger:next,start:'top bottom',end:'top 180px',scrub:true}});});
  }
});

/* SOAP typewriter */
(function(){
  const spans=[...document.querySelectorAll('[data-type]')];let started=false;
  const type=(el,t)=>new Promise(res=>{let i=0;(function s(){el.textContent=t.slice(0,i++);i<=t.length?setTimeout(s,15+Math.random()*22):res();})();});
  async function run(){for(const s of spans){await type(s,s.dataset.type);}
    document.querySelectorAll('[data-code]').forEach((c,i)=>setTimeout(()=>{c.style.transition='.4s';c.style.opacity=1;c.style.transform='translateY(0)';},i*180));}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!started){started=true;run();io.disconnect();}}),{threshold:.35});
  const card=document.querySelector('.c-soap');if(card)io.observe(card);
})();
