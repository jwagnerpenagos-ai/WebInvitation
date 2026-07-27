(function () {
  'use strict';

  /* ===================== CONFIGURACIÓN ===================== */
  // Fecha y hora del evento (hora local de Colombia, UTC-5)
  var EVENT_DATE = new Date('2026-10-03T18:00:00-05:00');

  /* ===================== PORTADA: ENTRAR A LA INVITACIÓN ===================== */
  var introScreen = document.getElementById('intro-screen');
  var introContinue = document.getElementById('intro-continue');
  var invitation = document.getElementById('invitation');
  var bgMusic = document.getElementById('bg-music');
  var musicToggle = document.getElementById('music-toggle');

  function enterInvitation() {
    introScreen.classList.add('is-hidden');
    invitation.hidden = false;
    document.body.style.overflow = 'auto';
    startEnvelopeRain();
    initScrollReveal();

    if (bgMusic) {
      bgMusic.play().catch(function () {});
      if (musicToggle) musicToggle.hidden = false;
    }
  }

  introContinue.addEventListener('click', enterInvitation);

  document.body.style.overflow = 'hidden';

  /* ===================== MÚSICA DE FONDO ===================== */
  if (musicToggle && bgMusic) {
    musicToggle.addEventListener('click', function () {
      var isMuted = musicToggle.getAttribute('aria-pressed') === 'true';
      if (isMuted) {
        bgMusic.play().catch(function () {});
        musicToggle.setAttribute('aria-pressed', 'false');
        musicToggle.setAttribute('aria-label', 'Silenciar música');
      } else {
        bgMusic.pause();
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'Activar música');
      }
    });
  }

  /* ===================== DESTELLOS MÁGICOS ===================== */
  function scatterSparkles(containerId, count) {
    var container = document.getElementById(containerId);
    if (!container) return;
    for (var i = 0; i < count; i++) {
      var sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDuration = (1.8 + Math.random() * 2.2) + 's';
      sparkle.style.animationDelay = (Math.random() * 3) + 's';
      container.appendChild(sparkle);
    }
  }

  scatterSparkles('sparkles-intro', 14);
  scatterSparkles('sparkles-hero', 12);
  scatterSparkles('sparkles-rsvp', 10);

  /* ===================== SUBTÍTULO MÁQUINA DE ESCRIBIR ===================== */
  var introSubtitle = document.getElementById('intro-subtitle');

  function typeIntroSubtitle() {
    if (!introSubtitle) return;
    var text = introSubtitle.getAttribute('data-text') || '';
    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    introSubtitle.classList.add('is-visible');

    if (reduceMotion) {
      introSubtitle.textContent = text;
      return;
    }

    introSubtitle.classList.add('is-typing');
    var i = 0;
    var timer = setInterval(function () {
      i++;
      introSubtitle.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(timer);
        introSubtitle.classList.remove('is-typing');
      }
    }, 30);
  }

  setTimeout(typeIntroSubtitle, 1900);

  /* ===================== COUNTDOWN ===================== */
  var elDays = document.getElementById('cd-days');

  function updateCountdown() {
    var now = new Date();
    var diff = EVENT_DATE.getTime() - now.getTime();

    if (diff <= 0) {
      document.getElementById('card-countdown').textContent = '¡Hoy es el gran día! 🎉';
      clearInterval(countdownTimer);
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    elDays.textContent = days;
  }

  updateCountdown();
  var countdownTimer = setInterval(updateCountdown, 60000);

  /* ===================== LLUVIA DE SOBRES ===================== */
  var envelopeRainContainer = document.getElementById('envelope-rain');
  var rainStarted = false;

  function startEnvelopeRain() {
    if (rainStarted) return;
    rainStarted = true;

    var count = window.innerWidth < 600 ? 8 : 14;

    for (var i = 0; i < count; i++) {
      var env = document.createElement('span');
      env.textContent = '💌';
      env.style.left = Math.random() * 100 + '%';
      env.style.animationDuration = (6 + Math.random() * 8) + 's';
      env.style.animationDelay = (Math.random() * 10) + 's';
      env.style.fontSize = (1.1 + Math.random() * 0.8) + 'rem';
      envelopeRainContainer.appendChild(env);
    }
  }

  /* ===================== APARICIÓN AL HACER SCROLL ===================== */
  var revealStarted = false;

  function initScrollReveal() {
    if (revealStarted) return;
    revealStarted = true;

    var targets = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    targets.forEach(function (el) { observer.observe(el); });
  }
})();
