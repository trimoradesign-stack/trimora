// ---- ADMIN PANELİ + CONFIG.JSON VERİLERİNİ YÜKLE ----
function ls(key) { try { return localStorage.getItem(key); } catch(e) { return null; } }

function applyAdminOverrides() {
  // Hero slogan
  const slogan = ls('trimora_hero_slogan');
  if (slogan) {
    const h1 = document.querySelector('.hero-content h1');
    if (h1) h1.textContent = slogan;
  }

  // Hero görsel
  const heroImg = ls('trimora_hero_image');
  if (heroImg) {
    const img = document.querySelector('.hero-bg img');
    if (img) img.src = heroImg;
  }

  // Site title
  const title = ls('trimora_site_title');
  if (title) document.title = title;

  // Meta description
  const metaDesc = ls('trimora_meta_desc');
  if (metaDesc) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = metaDesc;
  }

  // İletişim bilgileri
  const phone = ls('trimora_contact_phone');
  const email = ls('trimora_contact_email');
  const address = ls('trimora_contact_address');
  const whatsapp = ls('trimora_contact_whatsapp');

  if (phone) {
    document.querySelectorAll('[data-cfg="phone"]').forEach(el => {
      el.textContent = phone;
      if (el.tagName === 'A') el.href = 'tel:' + phone.replace(/\s/g, '');
    });
  }
  if (email) {
    document.querySelectorAll('[data-cfg="email"]').forEach(el => {
      el.textContent = email;
      if (el.tagName === 'A') el.href = 'mailto:' + email;
    });
  }
  if (address) {
    document.querySelectorAll('[data-cfg="address"]').forEach(el => {
      el.textContent = address;
    });
  }
  if (whatsapp) {
    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
      const msg = encodeURIComponent('Merhaba, bir ürün hakkında bilgi almak istiyorum.');
      el.href = 'https://wa.me/' + whatsapp + '?text=' + msg;
    });
  }

  // Sosyal medya linkleri
  const socials = {
    instagram: ls('trimora_social_instagram'),
    facebook: ls('trimora_social_facebook'),
    youtube: ls('trimora_social_youtube'),
    tiktok: ls('trimora_social_tiktok')
  };
  if (socials.instagram) document.querySelectorAll('a[href*="instagram.com"]').forEach(el => el.href = socials.instagram);
  if (socials.facebook) document.querySelectorAll('a[href*="facebook.com"]').forEach(el => el.href = socials.facebook);
  if (socials.youtube) document.querySelectorAll('a[href*="youtube.com"]').forEach(el => el.href = socials.youtube);
  if (socials.tiktok) document.querySelectorAll('a[href*="tiktok.com"]').forEach(el => el.href = socials.tiktok);

  // Menü isimleri
  const navHome = ls('trimora_nav_home');
  const navServices = ls('trimora_nav_services');
  const navGallery = ls('trimora_nav_gallery');
  const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta)');
  if (navHome && navLinks[0]) navLinks[0].textContent = navHome;
  if (navServices && navLinks[1]) navLinks[1].textContent = navServices;
  if (navGallery && navLinks[2]) navLinks[2].textContent = navGallery;

  // Hizmet kartları
  const servicesData = ls('trimora_services');
  if (servicesData) {
    try {
      const services = JSON.parse(servicesData);
      const cards = document.querySelectorAll('.service-card');
      services.forEach((s, i) => {
        if (!cards[i]) return;
        const h3 = cards[i].querySelector('h3');
        const p = cards[i].querySelector('p');
        const img = cards[i].querySelector('.service-img img');
        if (h3 && s.name) h3.textContent = s.name;
        if (p && s.desc) p.textContent = s.desc;
        if (img && s.image) img.src = s.image;
      });
    } catch(e) {}
  }

  // Footer copyright
  const copyright = ls('trimora_footer_copyright');
  if (copyright) {
    const fb = document.querySelector('.footer-bottom p');
    if (fb) fb.textContent = copyright;
  }
}

async function loadConfig() {
  try {
    const res = await fetch('config.json?v=' + Date.now());
    if (!res.ok) return;
    const cfg = await res.json();

    if (cfg.site?.slogan && !ls('trimora_hero_slogan')) {
      const h1 = document.querySelector('.hero-content h1');
      if (h1) h1.textContent = cfg.site.slogan;
    }
    if (cfg.contact) {
      const c = cfg.contact;
      if (!ls('trimora_contact_email')) {
        document.querySelectorAll('[data-cfg="email"]').forEach(el => {
          el.textContent = c.email || el.textContent;
          if (el.tagName === 'A') el.href = 'mailto:' + c.email;
        });
      }
      if (!ls('trimora_contact_phone')) {
        document.querySelectorAll('[data-cfg="phone"]').forEach(el => {
          el.textContent = c.phone || el.textContent;
          if (el.tagName === 'A') el.href = 'tel:' + (c.phone || '').replace(/\s/g, '');
        });
      }
      if (!ls('trimora_contact_address')) {
        document.querySelectorAll('[data-cfg="address"]').forEach(el => {
          el.textContent = c.address || el.textContent;
        });
      }
      if (c.whatsapp && !ls('trimora_contact_whatsapp')) {
        document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
          el.href = 'https://wa.me/' + c.whatsapp + '?text=Merhaba%2C%20bir%20%C3%BCr%C3%BCn%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.';
        });
      }
    }
  } catch (e) {}
}

// Önce config.json, sonra admin override
loadConfig().then(() => applyAdminOverrides());

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
