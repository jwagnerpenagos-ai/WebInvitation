import { $, prefersReducedMotion } from './dom.js';

const BASE_DELAY = 19;
const PUNCTUATION_DELAY = 115;

export function setupTypewriter(message) {
  const output = $('[data-typewriter]');
  const accessibleCopy = $('[data-legend-accessible]');
  let started = false;
  let timerId = null;

  if (!output || !message) return { start: () => {} };

  accessibleCopy && (accessibleCopy.textContent = message);

  const finish = () => {
    started = true;
    window.clearTimeout(timerId);
    output.textContent = message;
    output.classList.remove('is-writing');
    output.classList.add('is-complete');
  };

  const start = () => {
    if (started) return;
    started = true;

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    let index = 0;
    output.textContent = '';
    output.classList.add('is-writing');

    const writeNextCharacter = () => {
      index += 1;
      output.textContent = message.slice(0, index);

      if (index >= message.length) {
        output.classList.remove('is-writing');
        output.classList.add('is-complete');
        return;
      }

      const character = message[index - 1];
      const delay = /[.,;:!?]/.test(character) ? PUNCTUATION_DELAY : BASE_DELAY;
      timerId = window.setTimeout(writeNextCharacter, delay);
    };

    writeNextCharacter();
  };

  // Un toque sobre el texto permite completar la animación sin bloquear la navegación.
  output.addEventListener('click', finish);

  return { start, finish };
}
