// ---- NAV DRAWER ----
const menuBtn = document.querySelector('.menu-btn');
const navDrawer = document.getElementById('navDrawer');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
  navDrawer.classList.add('open');
  navOverlay.classList.add('open');
}
function closeNav() {
  navDrawer.classList.remove('open');
  navOverlay.classList.remove('open');
}

menuBtn.addEventListener('click', openNav);
navOverlay.addEventListener('click', closeNav);
navDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

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

// ---- CONTACT FORM ----
document.getElementById('submitBtn').addEventListener('click', () => {
  const name  = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const msg   = document.getElementById('fmsg').value.trim();

  if (!name || !email || !msg) {
    alert('Lütfen ad, e-posta ve mesaj alanlarını doldurun.');
    return;
  }
  alert('Teklifiniz alındı! En kısa sürede size dönüş yapacağız.');
  document.getElementById('contactForm').reset();
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
