import { $, $$ } from './dom.js';

export function setupSceneSlider() {
  const stage = $('#invitation-stage');
  const viewport = $('#scene-viewport');
  const scenes = $$('[data-scene]');
  const navigationItems = $$('[data-scene-target]');
  const previousButton = $('#previous-scene');
  const nextButton = $('#next-scene');
  const goToButtons = $$('[data-go-to]');
  const swipeHint = $('#swipe-hint');

  if (!stage || !viewport || scenes.length === 0 || !previousButton || !nextButton) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let wheelLocked = false;

  const showScene = (nextIndex) => {
    const safeIndex = Math.max(0, Math.min(nextIndex, scenes.length - 1));
    if (safeIndex === currentIndex) return;

    currentIndex = safeIndex;

    // Reiniciar la clase permite reproducir el barrido de pétalos en cada cambio.
    stage.classList.remove('is-changing');
    void stage.offsetWidth;
    stage.classList.add('is-changing');
    window.setTimeout(() => stage.classList.remove('is-changing'), 940);

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
        }, 680);
      }
    });

    navigationItems.forEach((item) => {
      const active = Number(item.dataset.sceneTarget) === currentIndex;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });

    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === scenes.length - 1;
    stage.dataset.theme = scenes[currentIndex].dataset.theme || 'wine';
    swipeHint?.toggleAttribute('hidden', currentIndex > 0);
  };

  const step = (direction) => showScene(currentIndex + direction);

  previousButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  navigationItems.forEach((item) => item.addEventListener('click', () => showScene(Number(item.dataset.sceneTarget))));
  goToButtons.forEach((button) => button.addEventListener('click', () => showScene(Number(button.dataset.goTo))));

  document.addEventListener('keydown', (event) => {
    if (stage.hidden || $('#rsvp-dialog')?.open) return;
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight' || event.key === 'PageDown') step(1);
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

    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    step(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  viewport.addEventListener('wheel', (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 34) return;
    const scrollContainer = event.target.closest('.scene__scroll');

    // El contenido puede desplazarse internamente en pantallas bajas. Solo cambia
    // de escena cuando ya llegó al borde correspondiente.
    if (scrollContainer) {
      const atTop = scrollContainer.scrollTop <= 0;
      const atBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 2;
      if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return;
    }

    wheelLocked = true;
    step(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLocked = false; }, 720);
  }, { passive: true });

  scenes.forEach((scene, index) => {
    scene.inert = index !== 0;
    scene.setAttribute('aria-hidden', String(index !== 0));
  });

  return { showScene };
}
