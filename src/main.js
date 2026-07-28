import { invitationConfig } from './config.js';
import { bindInvitationContent } from './modules/content.js';
import { setupCountdown } from './modules/countdown.js';
import { setupIntro } from './modules/intro.js';
import { setupQuickNavigation, setupSmoothAnchors } from './modules/navigation.js';
import { initRevealAnimations } from './modules/reveal.js';
import { setupRsvp } from './modules/rsvp.js';

function initInvitation() {
  bindInvitationContent(invitationConfig);
  setupCountdown(invitationConfig.eventDate);
  setupRsvp(invitationConfig);
  setupSmoothAnchors();
  setupQuickNavigation();
  setupIntro({ onOpened: initRevealAnimations });
}

initInvitation();
