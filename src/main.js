import { invitationConfig as config } from './config.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const state = {
  musicPlaying: false,
};

function bindInvitationData() {
  $$('[data-event-name]').forEach((element) => {
    element.textContent = config.celebrant;
  });

  $$('[data-event-date-label]').forEach((element) => {
    element.textContent = config.eventDateLabel;
  });

  $$('[data-event-time]').forEach((element) => {
    element.textContent = config.eventTimeLabel;
  });

  $$('[data-rsvp-deadline]').forEach((element) => {
    element.textContent = config.rsvpDeadline;
  });

  $$('[data-map-link]').forEach((element) => {
    element.href = config.venue.mapsUrl;
  });

  const currentYear = $('[data-current-year]');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
}

function setupIntro() {
  const intro = $('#intro');
  const site = $('#contenido');
  const openButton = $('#open-invitation');
  const musicControl = $('#music-control');
  const audio = $('#background-music');

  const updateMusicControl = () => {
    musicControl.classList.toggle('is-muted', !state.musicPlaying);
    musicControl.setAttribute('aria-pressed', String(!state.musicPlaying));
    musicControl.setAttribute('aria-label', state.musicPlaying ? 'Pausar música' : 'Reproducir música');
  };

  const playMusic = async () => {
    try {
      await audio.play();
      state.musicPlaying = true;
    } catch {
      state.musicPlaying = false;
    }
    updateMusicControl();
  };

  openButton.addEventListener('click', async () => {
    site.hidden = false;
    musicControl.hidden = false;
    document.body.classList.add('invitation-opening');
    intro.setAttribute('aria-hidden', 'true');

    await playMusic();

    window.setTimeout(() => {
      document.body.classList.remove('intro-visible', 'invitation-opening');
      document.body.classList.add('invitation-open');
      intro.hidden = true;
      window.scrollTo({ top: 0, behavior: 'instant' });
      initRevealAnimations();
    }, 1100);
  });

  musicControl.addEventListener('click', async () => {
    if (audio.paused) {
      await playMusic();
      return;
    }

    audio.pause();
    state.musicPlaying = false;
    updateMusicControl();
  });
}

function setupRsvp() {
  const dialog = $('#rsvp-dialog');
  const openButtons = $$('#open-rsvp, #quick-rsvp');
  const closeButton = $('#close-rsvp');
  const form = $('#rsvp-form');
  const nameInput = $('#rsvp-name');
  const guestCountField = $('#guest-count-field');
  const guestSelect = $('#rsvp-guests');

  if (!dialog || openButtons.length === 0 || !form) return;

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  for (let guests = 1; guests <= config.rsvp.maxGuests; guests += 1) {
    const option = document.createElement('option');
    option.value = String(guests);
    option.textContent = `${guests} ${guests === 1 ? 'persona' : 'personas'}`;
    guestSelect.append(option);
  }

  const syncAttendance = () => {
    const attendance = $('input[name="attendance"]:checked', form)?.value ?? 'yes';
    const attending = attendance === 'yes';
    guestCountField.hidden = !attending;
    guestSelect.disabled = !attending;
  };

  const openDialog = () => {
    dialog.showModal();
    window.setTimeout(() => nameInput.focus(), 80);
  };

  openButtons.forEach((button) => button.addEventListener('click', openDialog));

  closeButton.addEventListener('click', closeDialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  $$('input[name="attendance"]', form).forEach((radio) => {
    radio.addEventListener('change', syncAttendance);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const name = nameInput.value.trim();
    const attendance = $('input[name="attendance"]:checked', form)?.value ?? 'yes';
    const note = $('#rsvp-note').value.trim();

    let message;
    if (attendance === 'yes') {
      const guests = Number.parseInt(guestSelect.value, 10);
      message = `¡Hola! Soy ${name}. Confirmo nuestra asistencia a los XV años de ${config.celebrant}. Asistiremos ${guests} ${guests === 1 ? 'persona' : 'personas'}.`;
    } else {
      message = `¡Hola! Soy ${name}. Muchas gracias por la invitación a los XV años de ${config.celebrant}. Lamentablemente no podré asistir.`;
    }

    if (note) message += ` Mensaje: ${note}`;

    const whatsappUrl = `https://wa.me/${config.rsvp.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    closeDialog();
  });

  syncAttendance();
}

function setupCountdown() {
  const target = new Date(config.eventDate).getTime();
  const fields = {
    days: $('[data-countdown="days"]'),
    hours: $('[data-countdown="hours"]'),
    minutes: $('[data-countdown="minutes"]'),
    seconds: $('[data-countdown="seconds"]'),
  };
  const countdown = $('#countdown');
  const done = $('#countdown-done');

  const pad = (value) => String(value).padStart(2, '0');

  const update = () => {
    const difference = target - Date.now();

    if (difference <= 0) {
      countdown.hidden = true;
      done.hidden = false;
      return false;
    }

    fields.days.textContent = String(Math.floor(difference / 86_400_000)).padStart(2, '0');
    fields.hours.textContent = pad(Math.floor((difference / 3_600_000) % 24));
    fields.minutes.textContent = pad(Math.floor((difference / 60_000) % 60));
    fields.seconds.textContent = pad(Math.floor((difference / 1_000) % 60));
    return true;
  };

  update();
  const timer = window.setInterval(() => {
    if (!update()) window.clearInterval(timer);
  }, 1_000);
}

function initRevealAnimations() {
  const elements = $$('.reveal');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 80}ms`);
    observer.observe(element);
  });
}

function setupQuickNav() {
  const items = $$('[data-nav-section]');
  const confirmItem = $('#quick-rsvp');
  const sections = ['detalles', 'ubicacion', 'confirmacion']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (items.length === 0 || sections.length === 0 || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    items.forEach((item) => item.classList.toggle('is-active', item.dataset.navSection === id));
    if (confirmItem) confirmItem.classList.toggle('is-active', id === 'confirmacion');
  };

  const visible = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const active = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
      if (active && active[1] > 0) setActive(active[0]);
    },
    { rootMargin: '-28% 0px -45% 0px', threshold: [0, 0.15, 0.35, 0.6] },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupSmoothAnchors() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

bindInvitationData();
setupIntro();
setupRsvp();
setupCountdown();
setupSmoothAnchors();
setupQuickNav();
