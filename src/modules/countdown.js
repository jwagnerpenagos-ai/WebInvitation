import { $ } from './dom.js';

const UNIT = Object.freeze({
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

  const render = () => {
    const remaining = targetTime - Date.now();

    if (remaining <= 0) {
      countdown.hidden = true;
      completedMessage.hidden = false;
      return false;
    }

    fields.days.textContent = String(Math.floor(remaining / UNIT.day)).padStart(2, '0');
    fields.hours.textContent = String(Math.floor((remaining / UNIT.hour) % 24)).padStart(2, '0');
    fields.minutes.textContent = String(Math.floor((remaining / UNIT.minute) % 60)).padStart(2, '0');
    fields.seconds.textContent = String(Math.floor((remaining / UNIT.second) % 60)).padStart(2, '0');
    return true;
  };

  render();
  const timer = window.setInterval(() => {
    if (!render()) window.clearInterval(timer);
  }, UNIT.second);
}
