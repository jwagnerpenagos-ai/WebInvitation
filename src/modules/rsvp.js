import { $, $$ } from './dom.js';

export function setupRsvp(config) {
  const dialog = $('#rsvp-dialog');
  const openButton = $('#open-rsvp');
  const closeButton = $('#close-rsvp');
  const form = $('#rsvp-form');
  const nameInput = $('#rsvp-name');
  const guestCountField = $('#guest-count-field');
  const guestSelect = $('#rsvp-guests');

  if (!dialog || !openButton || !closeButton || !form || !nameInput || !guestCountField || !guestSelect) return;

  populateGuestOptions(guestSelect, config.rsvp.maxGuests);

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  const syncAttendance = () => {
    const attending = getAttendance(form) === 'yes';
    guestCountField.hidden = !attending;
    guestSelect.disabled = !attending;
  };

  openButton.addEventListener('click', () => {
    dialog.showModal();
    window.setTimeout(() => nameInput.focus(), 80);
  });

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  $$('input[name="attendance"]', form).forEach((radio) => radio.addEventListener('change', syncAttendance));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const attendance = getAttendance(form);
    const guests = Number.parseInt(guestSelect.value, 10);
    const note = $('#rsvp-note')?.value.trim() ?? '';
    const message = buildWhatsappMessage({
      name: nameInput.value.trim(),
      attendance,
      guests,
      note,
      celebrant: config.celebrant,
    });

    const url = `https://wa.me/${config.rsvp.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    closeDialog();
  });

  syncAttendance();
}

function populateGuestOptions(select, maxGuests) {
  const safeMaximum = Math.max(1, Number.parseInt(maxGuests, 10) || 1);
  for (let guests = 1; guests <= safeMaximum; guests += 1) {
    const option = document.createElement('option');
    option.value = String(guests);
    option.textContent = `${guests} ${guests === 1 ? 'persona' : 'personas'}`;
    select.append(option);
  }
}

function getAttendance(form) {
  return $('input[name="attendance"]:checked', form)?.value ?? 'yes';
}

function buildWhatsappMessage({ name, attendance, guests, note, celebrant }) {
  const base = attendance === 'yes'
    ? `¡Hola! Soy ${name}. Confirmo nuestra asistencia a los XV años de ${celebrant}. Asistiremos ${guests} ${guests === 1 ? 'persona' : 'personas'}.`
    : `¡Hola! Soy ${name}. Muchas gracias por la invitación a los XV años de ${celebrant}. Lamentablemente no podré asistir.`;

  return note ? `${base} Mensaje: ${note}` : base;
}
