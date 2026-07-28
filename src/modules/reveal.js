import { $$ } from './dom.js';

let initialized = false;

export function initRevealAnimations() {
  if (initialized) return;
  initialized = true;

  const elements = $$('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  elements.forEach((element, index) => {
    // Alterna pequeños retrasos para evitar que todos los elementos aparezcan a la vez.
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 80}ms`);
    observer.observe(element);
  });
}
