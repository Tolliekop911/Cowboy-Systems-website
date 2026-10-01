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
  const tabs=[...document.querySelectorAll('.shots-tabs [role="tab"]')], cap=document.getElementById('shot-cap');
  const live=document.getElementById('shot-live'), imgs=[...document.querySelectorAll('#shot-stack img')];
  const panels=live?[live,...imgs]:imgs;
  if(!tabs.length||tabs.length!==panels.length) return;
  const show=i=>{tabs.forEach((b,j)=>b.setAttribute('aria-selected',String(i===j)));
    panels.forEach((p,j)=>{p.classList.toggle('on',i===j);i===j?p.removeAttribute('aria-hidden'):p.setAttribute('aria-hidden','true');});
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

/* Eval video: poster until clicked, then swap in the real player with controls + sound */
document.querySelectorAll('.eval-video .ev-frame').forEach(frame=>{
  const src=(frame.dataset.video||'').trim(), poster=(frame.dataset.poster||'').trim();
  if(poster){frame.style.backgroundImage=`linear-gradient(140deg,rgba(14,26,43,.28),rgba(26,74,78,.28)),url("${poster}")`;
    frame.style.backgroundSize='cover';frame.style.backgroundPosition='center';}
  const btn=frame.querySelector('.ev-play'); if(!src||!btn) return;
  btn.addEventListener('click',()=>{
    const v=Object.assign(document.createElement('video'),{src,controls:true,autoplay:true,playsInline:true});
    v.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000';
    frame.innerHTML=''; frame.style.backgroundImage='none'; frame.appendChild(v);
    v.play?.().catch(()=>{});
  });
});

/* Nav: dropdowns (click for touch, hover for mouse) and the mobile menu */
(function(){
  const dds=[...document.querySelectorAll('.dd')], burger=document.querySelector('.nav-burger');
  const closeAll=except=>dds.forEach(d=>{if(d!==except){d.classList.remove('open');const b=d.querySelector('.dd-btn');
    b.setAttribute('aria-expanded','false');if(b===document.activeElement)b.blur();}});
  dds.forEach(d=>{const btn=d.querySelector('.dd-btn');
    btn.addEventListener('click',e=>{e.stopPropagation();const o=!d.classList.contains('open');closeAll(d);
      d.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));if(!o)btn.blur();});
    d.addEventListener('focusout',e=>{if(!d.contains(e.relatedTarget)){d.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.dd'))closeAll();});
  burger&&burger.addEventListener('click',e=>{e.stopPropagation();const o=!nav.classList.contains('open');nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',String(o));});
  document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');burger&&burger.setAttribute('aria-expanded','false');closeAll();}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAll();nav.classList.remove('open');burger&&burger.setAttribute('aria-expanded','false');}});
  addEventListener('scroll',()=>{if(nav.querySelector('.dd.open'))closeAll();},{passive:true});
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
  gsap.utils.toArray('.show-stage .float').forEach((f,i)=>{
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

/* People photos: a slow zoom as they scroll through, chips drift in.
   Runs right away, not on load, so nothing waits on the booking calendar. */
(()=>{
  if(reduce||!window.gsap||!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.ph img,.diff-photo img,.ps img,.fam-photo img').forEach(im=>{
    gsap.fromTo(im,{scale:1.16},{scale:1,ease:'none',scrollTrigger:{trigger:im.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
  });
  gsap.utils.toArray('.ph .float,.diff-photo .float').forEach((c,i)=>{
    gsap.from(c,{y:24,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:c.parentElement,start:'top 75%'}});
    gsap.to(c,{y:i%2?-26:-14,ease:'none',scrollTrigger:{trigger:c.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
  });
  gsap.utils.toArray('.diff-items li').forEach(li=>{
    gsap.from(li,{y:26,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:li,start:'top 88%'}});
  });
})();

/* Background clips: a playlist per scene, crossfading between two layers.
   Desktop only, only while the scene is on screen, never on data saver. */
(()=>{
  const holders=[...document.querySelectorAll('.bg-vid[data-playlist], .bg-vid[data-src]')]
    .filter(v=>!v.classList.contains('bg-vid-b'));
  if(!holders.length) return;
  const conn=navigator.connection||{};
  if(reduce||conn.saveData||/2g/.test(conn.effectiveType||'')||!matchMedia('(min-width:901px)').matches) return;

  const rigs=holders.map(a=>{
    const b=a.nextElementSibling&&a.nextElementSibling.classList.contains('bg-vid-b')?a.nextElementSibling:null;
    const list=(a.dataset.playlist||a.dataset.src||'').split(',').filter(Boolean);
    return {a,b,list,i:0,cur:a,armed:false,live:false};
  }).filter(r=>r.list.length);

  const load=(el,src)=>{ if(el.getAttribute('src')!==src){ el.setAttribute('src',src); el.load(); } };

  const advance=r=>{
    if(r.list.length<2||!r.b) return;
    const nxt=r.cur===r.a?r.b:r.a;
    r.i=(r.i+1)%r.list.length;
    load(nxt,r.list[r.i]);
    const go=()=>{
      const p=nxt.play(); if(p&&p.catch)p.catch(()=>{});
      nxt.classList.add('on'); r.cur.classList.remove('on');
      const old=r.cur; r.cur=nxt; r.armed=false;
      setTimeout(()=>{ if(old!==r.cur) old.pause(); },1500);
      arm(r);
    };
    nxt.readyState>=3?go():nxt.addEventListener('canplay',go,{once:true});
  };

  /* Swap a beat before the clip ends, so the cut is never visible */
  const arm=r=>{
    if(r.armed||r.list.length<2||!r.b) return;
    r.armed=true;
    const tick=()=>{
      if(!r.live) return;
      const d=r.cur.duration;
      if(d&&isFinite(d)&&d-r.cur.currentTime<1.6){ advance(r); return; }
      setTimeout(tick,250);
    };
    setTimeout(tick,250);
  };

  const start=r=>{
    r.live=true;
    load(r.cur,r.list[r.i]);
    const p=r.cur.play(); if(p&&p.catch)p.catch(()=>{});
    r.cur.addEventListener('playing',()=>r.cur.classList.add('on'),{once:true});
    if(r.list.length>1&&r.b) r.cur.loop=false, arm(r); else r.cur.loop=true;
  };

  const io=new IntersectionObserver(es=>es.forEach(e=>{
    const r=rigs.find(x=>x.a===e.target); if(!r) return;
    if(e.isIntersecting) start(r);
    else { r.live=false; r.armed=false; [r.a,r.b].forEach(v=>{ if(v&&!v.paused) v.pause(); }); }
  }),{rootMargin:'250px 0px'});

  let queued=false;
  const check=()=>{
    queued=false;
    rigs.forEach(r=>{
      const q=r.a.getBoundingClientRect();
      const near=q.bottom>-250&&q.top<innerHeight+250;
      if(near&&!r.live) start(r);
      else if(!near&&r.live){ r.live=false; r.armed=false; [r.a,r.b].forEach(v=>{ if(v&&!v.paused) v.pause(); }); }
    });
  };
  rigs.forEach(r=>io.observe(r.a));
  addEventListener('scroll',()=>{ if(!queued){ queued=true; setTimeout(check,60); } },{passive:true});
  check();
})();

/* The signature cascade: one click, and the five things the clinic never has to do */
(()=>{
  const btn=document.getElementById('sl-sign'), out=document.getElementById('sl-out'), stamp=document.getElementById('sl-stamp');
  if(!btn||!out) return;
  const steps=['Claim 97162 built and queued','Home exercise program built, 4 exercises','Flow sheet created and linked','Visit marked Completed','Audit log entry written'];
  btn.addEventListener('click',()=>{
    btn.disabled=true; btn.textContent='Signed by the therapist'; out.innerHTML='';
    if(stamp){stamp.textContent='Signed';stamp.classList.add('signed');}
    steps.forEach((t,i)=>{
      const li=document.createElement('li');
      li.innerHTML='<i>&#10003;</i><span></span>'; li.querySelector('span').textContent=t;
      out.appendChild(li);
      setTimeout(()=>li.classList.add('in'), reduce?0:120+i*190);
    });
  });
})();

/* Draw a line from the hub to each partner, and send a pulse down it */
(()=>{
  const net=document.querySelector('.pnet'); if(!net) return;
  const svg=net.querySelector('.pnet-lines'), hub=net.querySelector('.pnet-hub');
  const cards=[...net.querySelectorAll('.pn-row li')];
  if(!svg||!hub||!cards.length) return;
  const draw=()=>{
    if(getComputedStyle(svg).display==='none'){svg.innerHTML='';return;}
    const b=net.getBoundingClientRect(), hb=hub.getBoundingClientRect();
    svg.setAttribute('viewBox','0 0 '+b.width+' '+b.height);
    let out='';
    cards.forEach((li,i)=>{
      const r=li.getBoundingClientRect(), left=i<4;
      const x1=(left?hb.left:hb.right)-b.left, y1=hb.top+hb.height/2-b.top;
      const x2=(left?r.right:r.left)-b.left, y2=r.top+r.height/2-b.top;
      const mx=(x1+x2)/2;
      const d='M'+x1+' '+y1+'C'+mx+' '+y1+','+mx+' '+y2+','+x2+' '+y2;
      const col=li.querySelector('.pn').style.getPropertyValue('--brand').trim()||'#7a5af5';
      out+='<path class="pnet-line" d="'+d+'"/>'
         + '<path class="pnet-pulse" d="'+d+'" stroke="'+col+'" style="animation-delay:'+(-i*0.62)+'s"/>';
    });
    svg.innerHTML=out;
  };
  draw();
  addEventListener('resize',()=>{clearTimeout(window.__pnetT);window.__pnetT=setTimeout(draw,150);});
  addEventListener('load',draw);
})();

/* Pricing: monthly vs 12-month toggle */
(function(){
  var tog=document.querySelector('.bill-toggle'); if(!tog) return;
  var opts=[].slice.call(tog.querySelectorAll('.bt-opt'));
  function apply(term){
    tog.setAttribute('data-on',term);
    opts.forEach(function(o){var on=o.dataset.term===term;o.classList.toggle('is-on',on);o.setAttribute('aria-pressed',String(on));});
    document.querySelectorAll('.price[data-'+term+']').forEach(function(p){
      var val=p.getAttribute('data-'+term); var small=p.querySelector('small');
      p.firstChild.textContent=val+' '; if(small)p.appendChild(small);
    });
    document.querySelectorAll('.pterm[data-'+term+']').forEach(function(t){t.innerHTML=t.getAttribute('data-'+term);});
  }
  opts.forEach(function(o){o.addEventListener('click',function(){apply(o.dataset.term);});});
  apply('m');
})();

/* Rotating eyebrow: cycle the human lines */
(function(){
  var rot=document.querySelector('.rotor'); if(!rot) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var lines=[].slice.call(rot.querySelectorAll('.rot-line')); if(lines.length<2) return;
  var i=0;
  setInterval(function(){
    lines[i].classList.remove('is-on');
    i=(i+1)%lines.length;
    lines[i].classList.add('is-on');
  },3200);
})();
