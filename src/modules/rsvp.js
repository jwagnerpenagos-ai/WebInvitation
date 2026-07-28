import { $, $$ } from './dom.js';

export function setupRsvp(config) {
  const dialog = $('#rsvp-dialog');
  const openButtons = $$('#open-rsvp, #quick-rsvp');
  const closeButton = $('#close-rsvp');
  const form = $('#rsvp-form');
  const nameInput = $('#rsvp-name');
  const guestCountField = $('#guest-count-field');
  const guestSelect = $('#rsvp-guests');

  if (!dialog || !closeButton || !form || !nameInput || !guestCountField || !guestSelect || openButtons.length === 0) {
    return;
  }

  populateGuestOptions(guestSelect, config.rsvp.maxGuests);

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  const syncAttendance = () => {
    const attending = getAttendance(form) === 'yes';
    guestCountField.hidden = !attending;
    guestSelect.disabled = !attending;
  };

  const openDialog = () => {
    dialog.showModal();
    window.setTimeout(() => nameInput.focus(), 80);
  };

  openButtons.forEach((button) => button.addEventListener('click', openDialog));
  closeButton.addEventListener('click', closeDialog);

  // El clic directo sobre el backdrop cierra el modal; los clics en el formulario no.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  $$('input[name="attendance"]', form).forEach((radio) => {
    radio.addEventListener('change', syncAttendance);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const message = buildWhatsappMessage({
      name: nameInput.value.trim(),
      attendance: getAttendance(form),
      guests: Number.parseInt(guestSelect.value, 10),
      note: $('#rsvp-note')?.value.trim() ?? '',
      celebrant: config.celebrant,
    });

    const whatsappUrl = `https://wa.me/${config.rsvp.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
  let message;

  if (attendance === 'yes') {
    const guestLabel = guests === 1 ? 'persona' : 'personas';
    message = `¡Hola! Soy ${name}. Confirmo nuestra asistencia a los XV años de ${celebrant}. Asistiremos ${guests} ${guestLabel}.`;
  } else {
    message = `¡Hola! Soy ${name}. Muchas gracias por la invitación a los XV años de ${celebrant}. Lamentablemente no podré asistir.`;
  }

  return note ? `${message} Mensaje: ${note}` : message;
}
