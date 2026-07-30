import { $ } from './dom.js';

export function setupAudio() {
  const music = $('#background-music');
  const spark = $('#spark-sound');
  const control = $('#music-control');

  if (!music || !spark || !control) {
    return { playMusic: async () => {}, playSpark: () => {} };
  }

  let musicPlaying = false;

  const syncControl = () => {
    control.classList.toggle('is-muted', !musicPlaying);
    control.setAttribute('aria-pressed', String(musicPlaying));
    control.setAttribute('aria-label', musicPlaying ? 'Pausar música' : 'Reproducir música');
  };

  const playMusic = async () => {
    try {
      await music.play();
      musicPlaying = true;
    } catch {
      // El control permanece visible cuando el navegador bloquea el autoplay.
      musicPlaying = false;
    }
    syncControl();
  };

  const playSpark = () => {
    spark.currentTime = 0;
    spark.volume = 0.7;
    spark.play().catch(() => {});
  };

  control.addEventListener('click', async () => {
    if (music.paused) {
      await playMusic();
      return;
    }

    music.pause();
    musicPlaying = false;
    syncControl();
  });

  syncControl();
  return { playMusic, playSpark };
}
