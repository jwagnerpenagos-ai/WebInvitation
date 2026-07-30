export const $ = (selector, parent = document) => parent.querySelector(selector);
export const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
