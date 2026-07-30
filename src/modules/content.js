import { $, $$ } from './dom.js';

export function bindInvitationContent(config) {
  const date = formatEventDate(config.eventDate, config.eventTimeZone);

  setText('[data-rsvp-deadline]', config.rsvpDeadline);
  setText('[data-event-weekday]', date.weekday);
  setText('[data-event-day]', date.day);
  setText('[data-event-month]', date.month);
  setText('[data-event-year]', date.year);
  setText('[data-event-short-date]', `${date.day} · ${date.monthShort} · ${date.year}`);
  setText('[data-event-ceremony-time]', config.schedule.ceremony);
  setText('[data-event-reception-time]', config.schedule.reception);
  setText('[data-venue-name]', config.venue.name);
  setText('[data-venue-city]', config.venue.city);

  $$('[data-map-link]').forEach((link) => {
    link.href = config.venue.mapsUrl;
  });

  $$('[data-map-embed]').forEach((frame) => {
    frame.src = config.venue.mapsEmbedUrl;
  });

  $('.date-hero')?.setAttribute(
    'aria-label',
    `${date.full}. Eucaristía a las ${config.schedule.ceremony}. Recepción a las ${config.schedule.reception}.`,
  );
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
