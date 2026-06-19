// ===== MOBILE NAV =====
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileBtn?.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  const spans = mobileBtn.querySelectorAll('span');
  mobileNav.classList.contains('open')
    ? (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
       spans[1].style.opacity = '0',
       spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)')
    : (spans.forEach(s => (s.style.transform = '', s.style.opacity = '')));
});

// Close mobile nav on link click
document.querySelectorAll('#mobileNav a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    mobileBtn.querySelectorAll('span').forEach(s => (s.style.transform = '', s.style.opacity = ''));
  });
});

// ===== DEMO MODAL =====
const modal = document.getElementById('demoModal');
const modalOverlay = document.getElementById('modalOverlay');

function openModal() { modalOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }

document.querySelectorAll('[data-demo]').forEach(el => el.addEventListener('click', openModal));
document.getElementById('closeModal')?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

// ===== DEMO FORM =====
document.getElementById('demoForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Booking...';
  btn.disabled = true;
  setTimeout(() => {
    modal.innerHTML = `
      <button class="modal-close" onclick="closeModal()">×</button>
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:56px;margin-bottom:16px">✅</div>
        <h3 style="margin-bottom:8px">Demo Booked!</h3>
        <p>We'll reach out within 24 hours to confirm your personalized demo.</p>
        <button onclick="closeModal()" class="btn-primary" style="margin:24px auto 0;display:flex;width:fit-content">Done</button>
      </div>`;
  }, 1200);
});

// ===== PRODUCT TOUR TABS =====
document.querySelectorAll('.tour-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.tour-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tour-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .roi-card, .testimonial-card, .pricing-card, .trust-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Add visible class styles
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// Stagger animation for grids
document.querySelectorAll('.features-grid, .roi-grid, .testimonials-grid, .trust-grid').forEach(grid => {
  const children = grid.querySelectorAll(':scope > *');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 60}ms`;
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ===== NAV ACTIVE ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) current = section.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ===== PRICING TOGGLE =====
const annualToggle = document.getElementById('annualToggle');
const monthlyPrices = { starter: 249, growth: 499 };
const annualPrices = { starter: 211, growth: 424 };

annualToggle?.addEventListener('change', () => {
  const prices = annualToggle.checked ? annualPrices : monthlyPrices;
  document.getElementById('starterPrice').textContent = '$' + prices.starter;
  document.getElementById('growthPrice').textContent = '$' + prices.growth;
  document.getElementById('billingLabel').textContent = annualToggle.checked ? 'per provider / month, billed annually' : 'per provider / month';
  document.getElementById('billingLabel2').textContent = annualToggle.checked ? 'per provider / month, billed annually' : 'per provider / month';
});

// ===== WATCH OVERVIEW =====
document.getElementById('watchOverview')?.addEventListener('click', () => {
  alert('Demo video coming soon! Book a live demo to see Cowboy Systems in action.');
});

// Make closeModal global
window.closeModal = closeModal;
