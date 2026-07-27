import { invitationConfig as config } from './config.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const state = {
  guestName: config.personalization.defaultGuest,
  seats: null,
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

  $('[data-current-year]').textContent = new Date().getFullYear();
}

function applyPersonalization() {
  const query = new URLSearchParams(window.location.search);
  const guest = query.get(config.personalization.guestQueryParam)?.trim();
  const seatsValue = Number.parseInt(query.get(config.personalization.seatsQueryParam) ?? '', 10);

  if (guest) state.guestName = guest.slice(0, 80);
  if (Number.isInteger(seatsValue) && seatsValue > 0 && seatsValue <= 20) {
    state.seats = seatsValue;
  }

  $('[data-guest-name]').textContent = state.guestName;

  const seatsLabel = $('[data-guest-seats]');
  if (state.seats) {
    seatsLabel.hidden = false;
    seatsLabel.textContent = `${state.seats} ${state.seats === 1 ? 'cupo reservado' : 'cupos reservados'}`;
  }

  const rsvpGuest = $('#rsvp-guest');
  if (guest || state.seats) {
    rsvpGuest.hidden = false;
    rsvpGuest.textContent = state.seats
      ? `${state.guestName} · ${state.seats} ${state.seats === 1 ? 'cupo' : 'cupos'}`
      : state.guestName;
  }
}

function buildRsvpLink() {
  const guestLine = state.guestName !== config.personalization.defaultGuest
    ? ` Invitación a nombre de ${state.guestName}.`
    : '';
  const seatsLine = state.seats
    ? ` Confirmo ${state.seats} ${state.seats === 1 ? 'persona' : 'personas'}.`
    : '';
  const message = `${config.rsvp.message}${guestLine}${seatsLine}`;
  $('#rsvp-link').href = `https://wa.me/${config.rsvp.phone}?text=${encodeURIComponent(message)}`;
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
    document.body.classList.remove('intro-visible');
    document.body.classList.add('invitation-open');
    intro.setAttribute('aria-hidden', 'true');

    await playMusic();

    window.setTimeout(() => {
      intro.hidden = true;
      window.scrollTo({ top: 0, behavior: 'instant' });
      initRevealAnimations();
    }, 850);
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
applyPersonalization();
buildRsvpLink();
setupIntro();
setupCountdown();
setupSmoothAnchors();
