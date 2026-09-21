/* Shared nav for the inner pages: dropdowns (click for touch, hover for mouse),
   the mobile menu, and the solid background once the page scrolls. */
(function(){
  const nav=document.getElementById('nav'); if(!nav) return;
  const dds=[...nav.querySelectorAll('.dd')], burger=nav.querySelector('.nav-burger');
  const closeAll=except=>dds.forEach(d=>{if(d!==except){d.classList.remove('open');d.querySelector('.dd-btn').setAttribute('aria-expanded','false');}});
  dds.forEach(d=>d.querySelector('.dd-btn').addEventListener('click',e=>{e.stopPropagation();const o=!d.classList.contains('open');closeAll(d);
    d.classList.toggle('open',o);e.currentTarget.setAttribute('aria-expanded',String(o));}));
  document.addEventListener('click',e=>{if(!e.target.closest('.dd'))closeAll();});
  if(burger) burger.addEventListener('click',e=>{e.stopPropagation();const o=!nav.classList.contains('open');nav.classList.toggle('open',o);burger.setAttribute('aria-expanded',String(o));});
  nav.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');if(burger)burger.setAttribute('aria-expanded','false');closeAll();}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAll();nav.classList.remove('open');}});
  const solid=()=>nav.classList.toggle('solid',scrollY>40); solid();
  addEventListener('scroll',solid,{passive:true});
})();
