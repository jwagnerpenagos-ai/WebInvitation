import { $ } from './dom.js';

const MILLISECONDS = Object.freeze({
  day: 86_400_000,
  hour: 3_600_000,
  minute: 60_000,
  second: 1_000,
});

export function setupCountdown(eventDate) {
  const targetTime = new Date(eventDate).getTime();
  const countdown = $('#countdown');
  const completedMessage = $('#countdown-done');
  const fields = {
    days: $('[data-countdown="days"]'),
    hours: $('[data-countdown="hours"]'),
    minutes: $('[data-countdown="minutes"]'),
    seconds: $('[data-countdown="seconds"]'),
  };

  if (!Number.isFinite(targetTime) || !countdown || !completedMessage || Object.values(fields).some((field) => !field)) {
    return;
  }

  const pad = (value) => String(value).padStart(2, '0');

  const render = () => {
    const remaining = targetTime - Date.now();

    if (remaining <= 0) {
      countdown.hidden = true;
      completedMessage.hidden = false;
      return false;
    }

    fields.days.textContent = pad(Math.floor(remaining / MILLISECONDS.day));
    fields.hours.textContent = pad(Math.floor((remaining / MILLISECONDS.hour) % 24));
    fields.minutes.textContent = pad(Math.floor((remaining / MILLISECONDS.minute) % 60));
    fields.seconds.textContent = pad(Math.floor((remaining / MILLISECONDS.second) % 60));
    return true;
  };

  render();
  const timer = window.setInterval(() => {
    if (!render()) window.clearInterval(timer);
  }, MILLISECONDS.second);
}
