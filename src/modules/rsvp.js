import { $, $$ } from './dom.js';

export function setupRsvp(config) {
  const dialog = $('#rsvp-dialog');
  const openButton = $('#open-rsvp');
  const closeButton = $('#close-rsvp');
  const form = $('#rsvp-form');
  const nameInput = $('#rsvp-name');
  const guestCountField = $('#guest-count-field');
  const adultSelect = $('#rsvp-adults');
  const childrenSelect = $('#rsvp-children');

  if (
    !dialog ||
    !openButton ||
    !closeButton ||
    !form ||
    !nameInput ||
    !guestCountField ||
    !adultSelect ||
    !childrenSelect
  ) return;

  populateNumberOptions(adultSelect, config.rsvp.maxAdults, 'adulto', 'adultos');
  populateNumberOptions(childrenSelect, config.rsvp.maxChildren, 'niño', 'niños');

  // Una confirmación suele incluir al menos a quien está diligenciando el formulario.
  adultSelect.value = '1';
  childrenSelect.value = '0';

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  const syncAttendance = () => {
    const attending = getAttendance(form) === 'yes';
    guestCountField.hidden = !attending;
    adultSelect.disabled = !attending;
    childrenSelect.disabled = !attending;
    clearGuestValidation(adultSelect);
  };

  const validateGuestBreakdown = () => {
    const adults = parseCount(adultSelect.value);
    const children = parseCount(childrenSelect.value);
    const hasAttendees = adults + children > 0;

    adultSelect.setCustomValidity(
      hasAttendees ? '' : 'Indica al menos una persona entre adultos y niños.',
    );

    return hasAttendees;
  };

  openButton.addEventListener('click', () => {
    dialog.showModal();
    window.setTimeout(() => nameInput.focus(), 80);
  });

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  $$('input[name="attendance"]', form).forEach((radio) => {
    radio.addEventListener('change', syncAttendance);
  });

  [adultSelect, childrenSelect].forEach((select) => {
    select.addEventListener('change', () => validateGuestBreakdown());
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const attendance = getAttendance(form);
    if (attendance === 'yes' && !validateGuestBreakdown()) {
      adultSelect.reportValidity();
      return;
    }

    if (!form.reportValidity()) return;

    const adults = parseCount(adultSelect.value);
    const children = parseCount(childrenSelect.value);
    const note = $('#rsvp-note')?.value.trim() ?? '';
    const message = buildWhatsappMessage({
      name: nameInput.value.trim(),
      attendance,
      adults,
      children,
      note,
      celebrant: config.celebrant,
    });

    const url = `https://wa.me/${config.rsvp.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    closeDialog();
  });

  syncAttendance();
}

function populateNumberOptions(select, maximum, singular, plural) {
  const safeMaximum = Math.max(1, Number.parseInt(maximum, 10) || 1);

  for (let count = 0; count <= safeMaximum; count += 1) {
    const option = document.createElement('option');
    option.value = String(count);
    option.textContent = `${count} ${count === 1 ? singular : plural}`;
    select.append(option);
  }
}

function parseCount(value) {
  return Math.max(0, Number.parseInt(value, 10) || 0);
}

function clearGuestValidation(select) {
  select.setCustomValidity('');
}

function getAttendance(form) {
  return $('input[name="attendance"]:checked', form)?.value ?? 'yes';
}

function buildWhatsappMessage({ name, attendance, adults, children, note, celebrant }) {
  const heading = '🌹 *CONFIRMACIÓN DE ASISTENCIA* 🌹';
  const greeting = `¡Hola! Soy *${name}*.`;
  const optionalNote = note ? `\n\n📝 *Mensaje:* ${note}` : '';

  if (attendance === 'no') {
    return [
      heading,
      '',
      greeting,
      '',
      `Muchas gracias por la invitación a los *XV años de ${celebrant}* ✨`,
      '',
      'En esta ocasión no podré acompañarte, pero te deseo una celebración maravillosa. 💛',
    ].join('\n') + optionalNote;
  }

  const total = adults + children;

  return [
    heading,
    '',
    greeting,
    '',
    `Confirmo la asistencia a los *XV años de ${celebrant}* ✨`,
    '',
    `👤 *Adultos:* ${adults}`,
    `🧒 *Niños:* ${children}`,
    `👥 *Total de asistentes:* ${total}`,
    '',
    '¡Será un gusto acompañarte en este día tan especial! 💛',
  ].join('\n') + optionalNote;
}
