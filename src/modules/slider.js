import { $, $$ } from './dom.js';

const TRANSITION_DURATION = 520;
const SWIPE_THRESHOLD = 46;

export function setupSceneSlider() {
  const stage = $('#invitation-stage');
  const shell = $('#invitation-shell');
  const viewport = $('#scene-viewport');
  const scenes = $$('section[data-scene]');
  const navigationItems = $$('[data-scene-target]');
  const previousButton = $('#previous-scene');
  const nextButton = $('#next-scene');

  if (!stage || !shell || !viewport || scenes.length === 0 || !previousButton || !nextButton) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let wheelLocked = false;

  const syncControls = () => {
    navigationItems.forEach((item) => {
      const active = Number(item.dataset.sceneTarget) === currentIndex;
      item.classList.toggle('is-active', active);
      active ? item.setAttribute('aria-current', 'page') : item.removeAttribute('aria-current');
    });

    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === scenes.length - 1;
    shell.dataset.currentScene = String(currentIndex);
    shell.dataset.theme = scenes[currentIndex].dataset.theme || 'wine';
  };

  const showScene = (requestedIndex) => {
    const nextIndex = Math.max(0, Math.min(requestedIndex, scenes.length - 1));
    if (nextIndex === currentIndex) return;

    currentIndex = nextIndex;

    scenes.forEach((scene, index) => {
      const active = index === currentIndex;
      scene.hidden = false;
      scene.classList.toggle('is-active', active);
      scene.classList.toggle('is-before', index < currentIndex);
      scene.setAttribute('aria-hidden', String(!active));
      scene.inert = !active;

      if (!active) {
        window.setTimeout(() => {
          if (!scene.classList.contains('is-active')) scene.hidden = true;
        }, TRANSITION_DURATION);
      }
    });

    syncControls();
  };

  const step = (direction) => showScene(currentIndex + direction);

  previousButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  navigationItems.forEach((item) => {
    item.addEventListener('click', () => showScene(Number(item.dataset.sceneTarget)));
  });

  document.addEventListener('keydown', (event) => {
    if (stage.hidden || $('#rsvp-dialog')?.open) return;

    if (event.key === 'ArrowLeft' || event.key === 'PageUp') step(-1);
    if (event.key === 'ArrowRight' || event.key === 'PageDown') step(1);
    if (event.key === 'Home') showScene(0);
    if (event.key === 'End') showScene(scenes.length - 1);
  });

  viewport.addEventListener('touchstart', (event) => {
    const [touch] = event.changedTouches;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  viewport.addEventListener('touchend', (event) => {
    const [touch] = event.changedTouches;
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;
    step(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  viewport.addEventListener('wheel', (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 28) return;

    wheelLocked = true;
    step(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => {
      wheelLocked = false;
    }, 620);
  }, { passive: true });

  scenes.forEach((scene, index) => {
    scene.inert = index !== 0;
    scene.setAttribute('aria-hidden', String(index !== 0));
  });

  syncControls();
  return { showScene };
}
