import { invitationConfig } from './config.js';
import { setupAudio } from './modules/audio.js';
import { bindInvitationContent } from './modules/content.js';
import { setupCountdown } from './modules/countdown.js';
import { setupEnvelope } from './modules/envelope.js';
import { setupRsvp } from './modules/rsvp.js';
import { setupSceneSlider } from './modules/slider.js';
import { setupTypewriter } from './modules/typewriter.js';

bindInvitationContent(invitationConfig);
setupCountdown(invitationConfig.eventDate);
setupRsvp(invitationConfig);

const typewriter = setupTypewriter(invitationConfig.introMessage);
const audio = setupAudio();

setupEnvelope({
  ...audio,
  onOpened: () => {
    setupSceneSlider();
    typewriter.start();
  },
});
