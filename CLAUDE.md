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

- `index.html` — single page, semantic sections in order: intro/cover overlay (`#intro`) → main content (`#contenido`, hidden until intro is dismissed) with hero, date/countdown, location/map, details, RSVP, footer. Data-bound elements use `data-*` attributes (e.g. `data-event-name`, `data-event-date-label`, `data-event-weekday/day/month/year`, `data-event-short-date`, `data-event-compact-date`, `data-countdown`) that `src/modules/content.js` populates at runtime — the HTML itself has no hardcoded event data beyond fallback text. Loads five stylesheets from `src/styles/` individually (no bundler) plus `src/main.js` as a module.
- `src/config.js` — the single source of truth for editable content: celebrant name, `eventDate` (ISO) + `eventTimeZone` (IANA, e.g. `America/Bogota`) + `eventTimeLabel`, RSVP deadline, venue + Google Maps URL, WhatsApp number, and `maxGuests` (populates the guest-count `<select>` in the RSVP form). Exports one frozen `invitationConfig` object. **This is the file to edit when customizing the invitation for a new event/recipient** — do not hardcode event data into HTML or JS elsewhere. All human-readable date parts (weekday, day, month, year, formatted label) are derived from `eventDate`/`eventTimeZone` via `Intl.DateTimeFormat` in `content.js` — there is no separate date-label string to keep in sync.
- `src/main.js` — thin orchestrator: imports and calls each `src/modules/*.js` init function, no logic of its own. Modules:
  - `dom.js` — tiny `$`/`$$` query helpers shared by the other modules.
  - `content.js` — `bindInvitationContent(config)`: binds all `data-*` text/href content and derives the date parts (see above).
  - `intro.js` — `setupIntro({ onOpened })`: the page loads with `body.intro-visible` and `#contenido` hidden; clicking `#open-invitation` reveals the main content, starts background music (best-effort — autoplay failures are caught silently), then calls the `onOpened` callback (wired to `initRevealAnimations`) after a timeout.
  - `reveal.js` — `initRevealAnimations()`: wires an `IntersectionObserver` to fade in `.reveal` elements as they scroll into view (skipped/instant if `prefers-reduced-motion` is set).
  - `rsvp.js` — `setupRsvp(config)`: opens a native `<dialog>` (`#rsvp-dialog`) — triggered from both `#open-rsvp` and the quick-nav's `#quick-rsvp` — with a form (name, attending yes/no, guest count generated from `config.rsvp.maxGuests`, optional note). On submit it builds a message client-side and opens it as a `wa.me` deep link (`window.open`); no server or database involved.
  - `navigation.js` — `setupSmoothAnchors()` for in-page anchor scrolling, and `setupQuickNavigation()` for the floating quick-nav dock (`#quick-nav`): tracks the active section via `IntersectionObserver` scroll-spy and toggles `.is-active` on `[data-nav-section]` items.
  - `countdown.js` — `setupCountdown(eventDate)`: computed client-side, updates every second, swaps to a "today" message when it elapses.
- `src/styles/` — split by concern instead of one file: `base.css` (variables/reset/shared components), `intro.css` (closed cover), `sections.css` (main page sections), `responsive.css` (tablet/mobile breakpoints), `motion.css` (animations + reduced-motion). All five are linked individually in `index.html`; there's no build step concatenating them, so a new component's styles go in whichever file matches its concern, and any new breakpoint override belongs in `responsive.css` rather than inline in the component file.
- `assets/` — only the images/audio actually referenced by the page (pruned periodically — don't assume every file that was ever added is still used). Reference new assets the same way (webp, relative path from repo root).
- `vercel.json` — sets immutable long-lived caching for `/assets/*` and baseline security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) for all routes. `cleanUrls: true`, no trailing slash.

## Customizing for a new event/recipient

Edit only `src/config.js`. Do not put event-specific data (names, dates, phone numbers, venue) directly into `index.html` or the `src/modules/*.js` files — `content.js` reads from `config.js` exclusively, and hardcoding elsewhere will drift out of sync with the RSVP/date logic.

The WhatsApp `phone` in `config.js` is a placeholder (`573000000000`, country code + number, no `+`/spaces/dashes) — check whether it has been set to a real number before treating the RSVP flow as production-ready.
