import { $, $$ } from './dom.js';

export function bindInvitationContent(config) {
  const date = formatEventDate(config.eventDate, config.eventTimeZone);

  setText('[data-event-name]', config.celebrant);
  setText('[data-event-time]', config.eventTimeLabel);
  setText('[data-rsvp-deadline]', config.rsvpDeadline);
  setText('[data-event-weekday]', date.weekday);
  setText('[data-event-day]', date.day);
  setText('[data-event-month]', date.month);
  setText('[data-event-year]', date.year);
  setText('[data-event-date-label]', date.full);
  setText('[data-event-short-date]', `${date.day} · ${date.monthShort} · ${date.year}`);
  setText('[data-event-compact-date]', `${date.day} ${date.monthShort}`);

  $$('[data-map-link]').forEach((link) => {
    link.href = config.venue.mapsUrl;
  });

  const dateCard = $('[data-date-card]');
  dateCard?.setAttribute('aria-label', `${date.full} a las ${config.eventTimeLabel}`);

  const currentYear = $('[data-current-year]');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
}

function setText(selector, value) {
  $$(selector).forEach((element) => {
    element.textContent = value;
  });
}

function formatEventDate(isoDate, timeZone) {
  const eventDate = new Date(isoDate);
  const format = (options) => new Intl.DateTimeFormat('es-CO', { timeZone, ...options }).format(eventDate);

  const weekday = capitalize(format({ weekday: 'long' }));
  const day = format({ day: '2-digit' });
  const month = capitalize(format({ month: 'long' }));
  const monthShort = format({ month: 'short' }).replace('.', '').toUpperCase();
  const year = format({ year: 'numeric' });

  return {
    weekday,
    day,
    month,
    monthShort,
    year,
    full: `${weekday}, ${Number(day)} de ${month.toLowerCase()} de ${year}`,
  };
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
