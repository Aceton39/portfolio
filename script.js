// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });
}

// Theme toggle with persistence
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
function setTheme(mode) {
  if (mode === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
}
function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}
setTheme(getPreferredTheme());
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    setTheme(next);
  });
}

// Custom easing scroll helpers
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY || window.pageYOffset;
  const distance = Math.max(0, targetY) - startY;
  const startTime = performance.now();
  const dur = Math.max(0, duration || 700);
  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / dur);
    const eased = easeInOutCubic(t);
    const y = startY + distance * eased;
    window.scrollTo(0, y);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function smoothScrollToTop(duration) { smoothScrollTo(0, duration || 700); }

// Smooth scroll for in-page links (using custom easing)
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target instanceof HTMLAnchorElement && target.getAttribute('href')?.startsWith('#')) {
    const id = target.getAttribute('href');
    const el = id ? document.querySelector(id) : null;
    if (el) {
      e.preventDefault();
      const top = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
      smoothScrollTo(top, prefersReduced ? 0 : 700);
      history.pushState(null, '', id);
    }
  }
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Reveal on scroll
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const toReveal = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  toReveal.forEach((el) => io.observe(el));
} else {
  // If reduced motion or no IO support, show immediately
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
}


