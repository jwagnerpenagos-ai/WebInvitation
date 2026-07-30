import { $, $$ } from './dom.js';

const OPENING_TIMELINE = Object.freeze({
  flap: 420,
  letter: 980,
  reveal: 2050,
  finish: 2850,
});

export function setupEnvelope({ onOpened, playMusic, playSpark }) {
  const intro = $('#envelope-intro');
  const stage = $('#invitation-stage');
  const openButton = $('#open-invitation');
  const burst = $('#magic-burst');

  if (!intro || !stage || !openButton || !burst) return;

  createParticles(burst);

  openButton.addEventListener('click', async () => {
    if (intro.classList.contains('is-unsealing')) return;

    intro.classList.add('is-unsealing');
    burst.classList.add('is-active');
    playSpark();
    await playMusic();

    window.setTimeout(() => intro.classList.add('is-opening'), OPENING_TIMELINE.flap);
    window.setTimeout(() => intro.classList.add('is-letter-rising'), OPENING_TIMELINE.letter);

    window.setTimeout(() => {
      stage.hidden = false;
      stage.classList.add('is-visible');
      stage.setAttribute('data-theme', 'wine');
      onOpened?.();
    }, OPENING_TIMELINE.reveal);

    window.setTimeout(() => {
      intro.classList.add('is-leaving');
      document.body.classList.remove('is-locked');
    }, OPENING_TIMELINE.reveal + 120);

    window.setTimeout(() => {
      intro.hidden = true;
      burst.classList.remove('is-active');
    }, OPENING_TIMELINE.finish);
  }, { once: true });
}

function createParticles(container) {
  const particleCount = 34;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < particleCount; index += 1) {
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.25;
    const distance = 90 + Math.random() * 260;
    const particle = document.createElement('span');

    particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--size', `${3 + Math.random() * 7}px`);
    particle.style.setProperty('--delay', `${Math.random() * 180}ms`);
    particle.style.setProperty('--duration', `${780 + Math.random() * 620}ms`);
    fragment.append(particle);
  }

  container.append(fragment);
}
