import { $, $$ } from './dom.js';

export function setupSmoothAnchors() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

export function setupQuickNavigation() {
  const items = $$('[data-nav-section]');
  const confirmItem = $('#quick-rsvp');
  const sections = ['detalles', 'ubicacion', 'confirmacion']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (items.length === 0 || sections.length === 0 || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    items.forEach((item) => {
      const active = item.dataset.navSection === id;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });

    const confirmationActive = id === 'confirmacion';
    confirmItem?.classList.toggle('is-active', confirmationActive);
    if (confirmationActive) confirmItem?.setAttribute('aria-current', 'location');
    else confirmItem?.removeAttribute('aria-current');
  };

  const visibility = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const [activeSection, ratio = 0] = [...visibility.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
      if (activeSection && ratio > 0) setActive(activeSection);
    },
    { rootMargin: '-28% 0px -45% 0px', threshold: [0, 0.15, 0.35, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
}
