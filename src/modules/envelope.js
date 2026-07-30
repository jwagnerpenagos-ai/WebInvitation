import { $ } from './dom.js';

const OPENING_DURATION = 1580;

export function setupEnvelope({ onOpened, playMusic, playSpark }) {
  const intro = $('#envelope-intro');
  const stage = $('#invitation-stage');
  const shell = $('#invitation-shell');
  const openButton = $('#open-invitation');
  const burst = $('#magic-burst');

  if (!intro || !stage || !shell || !openButton || !burst) return;

  createParticles(burst);

  openButton.addEventListener('click', () => {
    if (intro.classList.contains('is-opening')) return;

    // La primera escena queda lista debajo del sobre antes de separar las dos piezas.
    stage.hidden = false;
    shell.dataset.theme = 'wine';
    onOpened?.();
    requestAnimationFrame(() => stage.classList.add('is-visible'));

    intro.classList.add('is-opening');
    burst.classList.add('is-active');
    playSpark();
    void playMusic();

    window.setTimeout(() => {
      intro.classList.add('is-leaving');
      intro.hidden = true;
      burst.classList.remove('is-active');

      // La leyenda entra cuando el sobre ya no la cubre, para que la animación sea visible.
      requestAnimationFrame(() => stage.classList.add('is-content-ready'));
    }, OPENING_DURATION);
  }, { once: true });
}

function createParticles(container) {
  const fragment = document.createDocumentFragment();
  const particleCount = 38;

  for (let index = 0; index < particleCount; index += 1) {
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.2;
    const distance = 90 + Math.random() * 280;
    const particle = document.createElement('span');

    particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--size', `${3 + Math.random() * 7}px`);
    particle.style.setProperty('--delay', `${Math.random() * 140}ms`);
    particle.style.setProperty('--duration', `${760 + Math.random() * 540}ms`);
    fragment.append(particle);
  }

  container.append(fragment);
}
