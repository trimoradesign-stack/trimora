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
const dots = document.querySelectorAll('.dot');
const cards = track.querySelectorAll('.service-card');

let current = 0;
const visibleCount = () => window.innerWidth >= 600 ? 4 : 3;
const maxIndex = () => cards.length - visibleCount();

function goTo(idx) {
  const max = maxIndex();
  current = Math.max(0, Math.min(idx, max));
  const cardW = cards[0].offsetWidth + 14; // width + gap
  track.style.transform = `translateX(-${current * cardW}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

document.querySelector('.slider-prev').addEventListener('click', () => goTo(current - 1));
document.querySelector('.slider-next').addEventListener('click', () => goTo(current + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

window.addEventListener('resize', () => goTo(current));

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
