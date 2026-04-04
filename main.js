// ---- SLUG → GORSEL MAPPING ----
const SERVICE_IMAGES = {
  'oto-koltuk-doseme': 'service-oto-doseme.webp',
  'recaro-vader-donusum': 'service-recaro-vader.webp',
  'direksiyon-kaplama': 'service-direksiyon.webp',
  'vites-topuzu': 'service-vites.webp',
  'torpido-kaplama': 'service-torpido.webp',
  'kapi-ici-doseme': 'service-kapi.webp',
  'taban-halisi-doseme': 'service-taban.webp',
  'tavan-doseme': 'service-tavan.webp',
  'tirim-kaplama': 'service-tirim.webp'
};

// ---- CONFIG.JSON'DAN VERİLERİ YÜKLE ----
async function loadConfig() {
  try {
    const res = await fetch('config.json?v=' + Date.now());
    if (!res.ok) return;
    const cfg = await res.json();

    // Site title
    if (cfg.site?.title) document.title = cfg.site.title;

    // Meta description
    if (cfg.site?.metaDesc) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = cfg.site.metaDesc;
    }

    // Hero slogan
    if (cfg.site?.slogan) {
      const h1 = document.querySelector('.hero-content h1');
      if (h1) h1.textContent = cfg.site.slogan;
    }

    // Hero background image
    if (cfg.site?.heroImage) {
      const img = document.querySelector('.hero-bg img');
      if (img) img.src = cfg.site.heroImage;
    }

    // İletişim bilgileri
    if (cfg.contact) {
      const c = cfg.contact;
      document.querySelectorAll('[data-cfg="phone"]').forEach(el => {
        el.textContent = c.phone || el.textContent;
        if (el.tagName === 'A') el.href = 'tel:' + (c.phone || '').replace(/\s/g, '');
      });
      document.querySelectorAll('[data-cfg="email"]').forEach(el => {
        el.textContent = c.email || el.textContent;
        if (el.tagName === 'A') el.href = 'mailto:' + c.email;
      });
      document.querySelectorAll('[data-cfg="address"]').forEach(el => {
        el.textContent = c.address || el.textContent;
      });
    }

    // Sosyal medya linkleri
    if (cfg.social) {
      const s = cfg.social;
      if (s.instagram) document.querySelectorAll('a[href*="instagram.com"]').forEach(el => el.href = s.instagram);
      if (s.facebook) document.querySelectorAll('a[href*="facebook.com"]').forEach(el => el.href = s.facebook);
      if (s.youtube) document.querySelectorAll('a[href*="youtube.com"]').forEach(el => el.href = s.youtube);
      if (s.tiktok) document.querySelectorAll('a[href*="tiktok.com"]').forEach(el => el.href = s.tiktok);
    }

    // Menü isimleri
    if (cfg.nav) {
      const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta)');
      if (cfg.nav.home && navLinks[0]) navLinks[0].textContent = cfg.nav.home;
      if (cfg.nav.services && navLinks[1]) navLinks[1].textContent = cfg.nav.services;
      if (cfg.nav.gallery && navLinks[2]) navLinks[2].textContent = cfg.nav.gallery;
    }

    // Hizmet kartlarini dinamik olustur
    if (cfg.services && Array.isArray(cfg.services)) {
      const track = document.getElementById('servicesTrack');
      if (track) {
        track.innerHTML = '';
        cfg.services.forEach(svc => {
          const imgFile = SERVICE_IMAGES[svc.slug] || 'service-default.webp';
          const a = document.createElement('a');
          a.href = svc.slug;
          a.className = 'service-card';
          a.innerHTML = '<div class="service-img"><img src="' + imgFile + '" alt="' + escH(svc.name) + '" loading="lazy" /></div>' +
            '<h3>' + escH(svc.name) + '</h3>' +
            '<p>' + escH(svc.desc) + '</p>';
          track.appendChild(a);
        });
        initSlider();
      }

      // Footer hizmet listesi
      const footerList = document.getElementById('footerServicesList');
      if (footerList) {
        footerList.innerHTML = '';
        cfg.services.forEach(svc => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = svc.slug;
          a.textContent = svc.name.charAt(0).toUpperCase() + svc.name.slice(1).toLowerCase();
          li.appendChild(a);
          footerList.appendChild(li);
        });
      }
    }

    // Marka kartlarini dinamik olustur
    if (cfg.brandGallery) {
      const grid = document.getElementById('brandsGrid');
      if (grid) {
        grid.innerHTML = '';
        Object.keys(cfg.brandGallery).forEach(slug => {
          const label = slug.charAt(0).toUpperCase() + slug.slice(1);
          const a = document.createElement('a');
          a.href = slug;
          a.className = 'brand-card';
          a.innerHTML = '<img src="brand-' + slug + '.webp" alt="' + escH(label) + '" loading="lazy" />' +
            '<span>' + escH(label) + '</span>';
          grid.appendChild(a);
        });
      }
    }

    // Bölüm başlıkları
    if (cfg.site?.sectionTitles) {
      const st = cfg.site.sectionTitles;
      if (st.services) {
        const el = document.querySelector('.services .section-title');
        if (el) el.textContent = st.services;
      }
      if (st.brands) {
        const el = document.querySelector('.brands .section-title');
        if (el) el.textContent = st.brands;
      }
      if (st.location) {
        const el = document.querySelector('.map-section .section-title');
        if (el) el.textContent = st.location;
      }
      if (st.contact) {
        const el = document.querySelector('.contact-title');
        if (el) el.textContent = st.contact;
      }
      if (st.contactDesc) {
        const el = document.querySelector('.contact-desc');
        if (el) el.textContent = st.contactDesc;
      }
    }

    // Çalışma saatleri
    if (cfg.contact?.workingHours) {
      const wh = cfg.contact.workingHours;
      const el = document.getElementById('workingHoursText');
      if (el) {
        const parts = [];
        if (wh.weekdays) parts.push('Hafta içi: ' + wh.weekdays);
        if (wh.saturday) parts.push('Cmt: ' + wh.saturday);
        if (wh.sunday) parts.push('Paz: ' + wh.sunday);
        el.textContent = parts.join(' | ');
      }
    }

    // WhatsApp mesaj şablonu
    if (cfg.contact?.whatsapp) {
      const msg = encodeURIComponent(cfg.contact.whatsappMessage || 'Merhaba, teklif almak istiyorum.');
      document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
        el.href = 'https://wa.me/' + cfg.contact.whatsapp + '?text=' + msg;
      });
    }

    // Harita sorgusu
    if (cfg.contact?.mapQuery) {
      const q = encodeURIComponent(cfg.contact.mapQuery);
      const iframe = document.querySelector('.map-wrapper iframe');
      if (iframe) {
        iframe.src = 'https://maps.google.com/maps?q=' + q + '&t=&z=16&ie=UTF8&iwloc=&output=embed&hl=tr';
      }
      const mapsLink = document.querySelector('.map-btn[href*="google.com/maps/search"]');
      if (mapsLink) mapsLink.href = 'https://www.google.com/maps/search/' + q;
      const dirLink = document.querySelector('.map-btn-primary[href*="google.com/maps/dir"]');
      if (dirLink) dirLink.href = 'https://www.google.com/maps/dir//' + q;
      const mapInfo = document.querySelector('.map-info span');
      if (mapInfo) mapInfo.textContent = cfg.contact.address || cfg.contact.mapQuery;
    }

    // Formspree form ID
    if (cfg.contact?.formspreeId) {
      const form = document.getElementById('contactForm');
      if (form) form.action = 'https://formspree.io/f/' + cfg.contact.formspreeId;
    }

    // Footer copyright
    if (cfg.footer?.copyright) {
      const fb = document.querySelector('.footer-bottom p');
      if (fb) fb.textContent = cfg.footer.copyright;
    }

    // Footer telefon linki
    if (cfg.contact?.phone) {
      const ftPhone = document.querySelector('.footer-col a[href^="tel:"]');
      if (ftPhone) {
        ftPhone.href = 'tel:' + cfg.contact.phone.replace(/\s/g, '');
        ftPhone.textContent = 'Ara: ' + cfg.contact.phone;
      }
    }

    // SEO tags
    if (cfg.seo?.tags && Array.isArray(cfg.seo.tags)) {
      const tagsEl = document.querySelector('.seo-tags');
      if (tagsEl) {
        tagsEl.innerHTML = '';
        cfg.seo.tags.forEach(tag => {
          const span = document.createElement('span');
          span.textContent = tag;
          tagsEl.appendChild(span);
        });
      }
    }

  } catch (e) {
    // Sessizce başarısız — sayfa varsayılan değerlerle gösterilir
  }
}

function escH(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

loadConfig();

// ---- NAV aktif link ----
const navLinksAll = document.querySelectorAll('.main-nav a:not(.nav-cta)');
navLinksAll.forEach(link => {
  link.addEventListener('click', () => {
    navLinksAll.forEach(l => l.style.color = '');
    link.style.color = 'var(--gold)';
  });
});

// ---- SERVICES SLIDER ----
function initSlider() {
  const track = document.getElementById('servicesTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.service-card');
  if (!cards.length) return;

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
    track.style.transform = 'translateX(-' + (current * cardW) + 'px)';
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  buildDots();

  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('resize', () => { buildDots(); goTo(current); });

  // Swipe (dokunmatik + mouse sürükle)
  let dragStart = null;
  track.addEventListener('mousedown', e => { dragStart = e.clientX; });
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
}

// ---- CONTACT FORM (Formspree) ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
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
}

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
