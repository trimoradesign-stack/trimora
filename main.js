// ---- CONFIG.JSON yükle ve sayfayı doldur ----
async function loadConfig() {
  try {
    const res = await fetch('config.json?v=' + Date.now());
    if (!res.ok) return;
    const cfg = await res.json();

    // Slogan
    if (cfg.site?.slogan) {
      const h1 = document.querySelector('.hero-content h1');
      if (h1) h1.textContent = cfg.site.slogan;
    }

    // İletişim bilgileri
    if (cfg.contact) {
      const c = cfg.contact;
      const emailEls = document.querySelectorAll('[data-cfg="email"]');
      const phoneEls = document.querySelectorAll('[data-cfg="phone"]');
      const addressEls = document.querySelectorAll('[data-cfg="address"]');

      emailEls.forEach(el => {
        el.textContent = c.email || el.textContent;
        if (el.tagName === 'A') el.href = 'mailto:' + c.email;
      });
      phoneEls.forEach(el => {
        el.textContent = c.phone || el.textContent;
        if (el.tagName === 'A') el.href = 'tel:' + (c.phone || '').replace(/\s/g, '');
      });
      addressEls.forEach(el => {
        el.textContent = c.address || el.textContent;
      });

      // WhatsApp linki
      if (c.whatsapp) {
        const waBtn = document.querySelector('a[href*="wa.me"]');
        if (waBtn) waBtn.href = `https://wa.me/${c.whatsapp}?text=Merhaba%2C%20teklif%20almak%20istiyorum.`;
      }
    }

    // Galeri
    if (cfg.gallery && cfg.gallery.length > 0) {
      const grid = document.getElementById('galleryGrid');
      if (grid) {
        grid.innerHTML = '';
        cfg.gallery.forEach((item, i) => {
          const div = document.createElement('div');
          div.className = 'gallery-item' + (i === cfg.gallery.length - 1 ? ' gallery-item-tall' : '');
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = item.alt || '';
          img.loading = 'lazy';
          div.appendChild(img);
          grid.appendChild(div);
        });
      }
    }
  } catch (e) {
    // config yüklenemezse mevcut HTML içeriği kullanılır
  }
}

loadConfig();

// ---- NAV aktif link ----
const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta)');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.style.color = '');
    link.style.color = 'var(--gold)';
  });
});

// ---- SERVICES SLIDER ----
const track = document.getElementById('servicesTrack');
const dotsContainer = document.getElementById('sliderDots');
const cards = track.querySelectorAll('.service-card');

let current = 0;
const visibleCount = () => window.innerWidth >= 600 ? 4 : 2;
const maxIndex = () => Math.max(0, cards.length - visibleCount());

function buildDots() {
  const count = maxIndex() + 1;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === current ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function goTo(idx) {
  const max = maxIndex();
  current = Math.max(0, Math.min(idx, max));
  const gap = 10;
  const cardW = cards[0].offsetWidth + gap;
  track.style.transform = `translateX(-${current * cardW}px)`;
  dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}

buildDots();
document.querySelector('.slider-prev').addEventListener('click', () => goTo(current - 1));
document.querySelector('.slider-next').addEventListener('click', () => goTo(current + 1));

window.addEventListener('resize', () => { buildDots(); goTo(current); });

// ---- SLIDER SWIPE (dokunmatik + mouse sürükle) ----
let dragStart = null;
let dragging = false;

track.addEventListener('mousedown', e => { dragStart = e.clientX; dragging = false; });
track.addEventListener('mousemove', e => { if (dragStart !== null) dragging = true; });
track.addEventListener('mouseup', e => {
  if (dragStart === null) return;
  const diff = dragStart - e.clientX;
  if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  dragStart = null;
});
track.addEventListener('mouseleave', () => { dragStart = null; });

track.addEventListener('touchstart', e => { dragStart = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  if (dragStart === null) return;
  const diff = dragStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  dragStart = null;
});

// ---- CONTACT FORM (Formspree) ----
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');

  btn.textContent = 'GÖNDERİLİYOR...';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      btn.textContent = 'GÖNDERİLDİ ✓';
      form.reset();
    } else {
      btn.textContent = 'HATA — TEKRAR DENEYİN';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = 'HATA — TEKRAR DENEYİN';
    btn.disabled = false;
  }
});

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
