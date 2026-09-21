/* Shared nav for the inner pages: dropdowns (click for touch, hover for mouse),
   the mobile menu, and the solid background once the page scrolls. */
(function(){
  const nav=document.getElementById('nav'); if(!nav) return;
  const dds=[...nav.querySelectorAll('.dd')], burger=nav.querySelector('.nav-burger');
  const closeAll=except=>dds.forEach(d=>{if(d!==except){d.classList.remove('open');const b=d.querySelector('.dd-btn');
    b.setAttribute('aria-expanded','false');if(b===document.activeElement)b.blur();}});
  dds.forEach(d=>{const btn=d.querySelector('.dd-btn');
    btn.addEventListener('click',e=>{e.stopPropagation();const o=!d.classList.contains('open');closeAll(d);
      d.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));if(!o)btn.blur();});
    d.addEventListener('focusout',e=>{if(!d.contains(e.relatedTarget)){d.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.dd'))closeAll();});
  if(burger) burger.addEventListener('click',e=>{e.stopPropagation();const o=!nav.classList.contains('open');nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',String(o));});
  nav.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');if(burger)burger.setAttribute('aria-expanded','false');closeAll();}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAll();nav.classList.remove('open');if(burger)burger.setAttribute('aria-expanded','false');}});
  let lastY=scrollY;
  const onScroll=()=>{
    const y=scrollY; nav.classList.toggle('solid',y>40);
    if(Math.abs(y-lastY)>4) closeAll();
    const busy=nav.classList.contains('open')||nav.querySelector('.dd.open');
    if(busy||y<140){nav.classList.remove('nav-hide');lastY=y;return;}
    if(y>lastY+6){nav.classList.add('nav-hide');lastY=y;}
    else if(y<lastY-6){nav.classList.remove('nav-hide');lastY=y;}
  };
  onScroll(); addEventListener('scroll',onScroll,{passive:true});
})();
