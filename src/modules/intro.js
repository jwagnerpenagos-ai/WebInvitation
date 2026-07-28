import { $ } from './dom.js';

export function setupIntro({ onOpened }) {
  const intro = $('#intro');
  const site = $('#contenido');
  const openButton = $('#open-invitation');
  const musicControl = $('#music-control');
  const audio = $('#background-music');

  if (!intro || !site || !openButton || !musicControl || !audio) return;

  let musicPlaying = false;

  const updateMusicControl = () => {
    musicControl.classList.toggle('is-muted', !musicPlaying);
    musicControl.setAttribute('aria-pressed', String(musicPlaying));
    musicControl.setAttribute('aria-label', musicPlaying ? 'Pausar música' : 'Reproducir música');
  };

  const playMusic = async () => {
    try {
      await audio.play();
      musicPlaying = true;
    } catch {
      // Algunos navegadores todavía pueden bloquear el audio; el control queda disponible.
      musicPlaying = false;
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
      window.scrollTo({ top: 0, behavior: 'auto' });
      onOpened?.();
    }, 1100);
  });

  musicControl.addEventListener('click', async () => {
    if (audio.paused) {
      await playMusic();
      return;
    }

    audio.pause();
    musicPlaying = false;
    updateMusicControl();
  });

  updateMusicControl();
}
