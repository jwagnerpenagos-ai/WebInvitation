# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static, single-page invitation website (Spanish) for a "XV años" (quinceañera) celebration for María Fernanda. No framework, no build step, no package.json — plain HTML/CSS/JS served as-is, deployed to Vercel.

## Commands

Run locally from the project root:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`. There is no build, lint, or test tooling in this repo.

Deploy with `vercel --prod` from this folder (Framework Preset: Other, empty build command/output directory).

## Architecture

The invitation is an "enchanted rose" themed envelope: a closed envelope overlay opens on click, revealing a full-bleed card (`.invitation-shell`) that pages through six scenes (`section[data-scene]`) — legend, identity, date/countdown, location, info, RSVP — via arrow buttons, a quick-nav dock, swipe, wheel, or arrow keys.

- `index.html` — single page: `#envelope-intro` (closed envelope + seal button) sits over `#invitation-stage` (hidden until opened), which contains `#invitation-shell` with the ornamental frame, header, the six `.scene` sections inside `#scene-viewport`, prev/next arrows, and the `.quick-navigation` dock. The `#rsvp-dialog` (native `<dialog>`) and the two `<audio>` elements live alongside. Data-bound elements use `data-*` attributes (`data-event-weekday/day/month/year/short-date`, `data-event-ceremony-time`, `data-event-reception-time`, `data-venue-name/city`, `data-map-link`, `data-map-embed`, `data-countdown`, `data-rsvp-deadline`) that `src/modules/content.js` populates at runtime — the HTML has no hardcoded event data beyond fallback text. Loads eight stylesheets from `src/styles/` individually (no bundler) plus `src/main.js` as a module.
- `src/config.js` — the single source of truth for editable content: celebrant name, `eventDate` (ISO) + `eventTimeZone` (IANA, e.g. `America/Bogota`), a `schedule` object (`ceremony`/`reception` time labels), RSVP deadline, `venue` (name, city, `mapsUrl`, `mapsEmbedUrl`), and `rsvp` (WhatsApp `phone`, `maxGuests`). Exports one frozen `invitationConfig` object (nested objects are frozen too). **This is the file to edit when customizing the invitation for a new event/recipient** — do not hardcode event data into HTML or JS elsewhere. All human-readable date parts are derived from `eventDate`/`eventTimeZone` via `Intl.DateTimeFormat` in `content.js`.
- `src/main.js` — thin orchestrator: imports and calls each `src/modules/*.js` init function, no logic of its own. Modules:
  - `dom.js` — tiny `$`/`$$` query helpers and `prefersReducedMotion()` shared by the other modules.
  - `content.js` — `bindInvitationContent(config)`: binds all `data-*` text/href/src content and derives the date parts (see above).
  - `audio.js` — `setupAudio()`: wires the mute/unmute `#music-control` button and returns `{ playMusic, playSpark }` (autoplay failures are caught silently); consumed by `envelope.js`.
  - `envelope.js` — `setupEnvelope({ onOpened, playMusic, playSpark })`: handles the seal-button click, reveals `#invitation-stage`, generates the particle "magic burst", and calls `onOpened` (wired to `setupSceneSlider`) once the stage is visible.
  - `slider.js` — `setupSceneSlider()`: the scene navigator — tracks `currentIndex`, wires prev/next buttons, the quick-nav dock, swipe (touch), wheel, and keyboard (arrows/Home/End), and toggles `is-active`/`is-before`/`inert`/`aria-hidden` on each scene.
  - `countdown.js` — `setupCountdown(eventDate)`: computed client-side, updates every second, swaps to a "today" message when it elapses.
  - `rsvp.js` — `setupRsvp(config)`: opens `#rsvp-dialog` (from `#open-rsvp`) with a form (name, attending yes/no, guest count generated from `config.rsvp.maxGuests`, optional note). On submit it builds a message client-side and opens it as a `wa.me` deep link (`window.open`); no server or database involved.
- `src/styles/` — split by concern, all linked individually in `index.html` (no bundler): `tokens.css` (CSS custom properties: palette, fonts, easing, shared sizes), `base.css` (reset + shared components like `.scene-cta`/`.scene-kicker`), `envelope.css` (closed-envelope overlay), `stage.css` (shell frame, header, scene-viewport, arrows, quick-nav), `scenes.css` (per-scene layout, one block per `.scene--*`), `dialog.css` (RSVP `<dialog>`/form), `responsive.css` (breakpoints — `1100px`, `820px` for phone/tablet, plus `min-height`/`max-height` refinements for very tall or very short viewports at that width), `motion.css` (`@keyframes`, reveal-on-active timing, `prefers-reduced-motion`). A new component's styles go in whichever file matches its concern; a new breakpoint override belongs in `responsive.css` rather than inline in the component file.
- `assets/` — only the images/audio actually referenced by the page (pruned periodically — don't assume every file that was ever added is still used). Reference new assets the same way (webp, relative path from repo root).
- `vercel.json` — sets immutable long-lived caching for `/assets/*` and baseline security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) for all routes. `cleanUrls: true`, no trailing slash.

## Customizing for a new event/recipient

Edit only `src/config.js`. Do not put event-specific data (names, dates, phone numbers, venue) directly into `index.html` or the `src/modules/*.js` files — `content.js` reads from `config.js` exclusively, and hardcoding elsewhere will drift out of sync with the RSVP/date logic.

The WhatsApp `phone` in `config.js` is a placeholder (`573000000000`, country code + number, no `+`/spaces/dashes) — check whether it has been set to a real number before treating the RSVP flow as production-ready.
