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

- `index.html` — single page, semantic sections in order: intro/cover overlay (`#intro`) → main content (`#contenido`, hidden until intro is dismissed) with hero, date/countdown, location/map, details, RSVP, footer. Data-bound elements use `data-*` attributes (e.g. `data-event-name`, `data-event-date-label`, `data-countdown`, `data-guest-name`) that `src/main.js` populates at runtime — the HTML itself has no hardcoded event data beyond fallback text.
- `src/config.js` — the single source of truth for editable content: celebrant name, event date/time, RSVP deadline, venue + Google Maps URL, WhatsApp number/message template, and personalization query-param names. Exports one frozen `invitationConfig` object. **This is the file to edit when customizing the invitation for a new event/recipient** — do not hardcode event data into HTML or JS elsewhere.
- `src/main.js` — vanilla JS, no dependencies, ES module imported directly via `<script type="module">`. Organized as small init functions called at the bottom of the file (`bindInvitationData`, `applyPersonalization`, `buildRsvpLink`, `setupIntro`, `setupCountdown`, `setupSmoothAnchors`). Key behaviors:
  - **Personalization via URL query params**: `?invitado=<name>&cupos=<n>` (param names configurable in `config.js`) customize the greeted guest name and seat count shown on the page and folded into the generated WhatsApp message. `cupos` is validated as an integer 1–20.
  - **Intro/reveal flow**: the page loads with `body.intro-visible` and `#contenido` hidden; clicking `#open-invitation` reveals the main content, starts background music (best-effort — autoplay failures are caught silently), and after a timeout triggers `initRevealAnimations()` which wires an `IntersectionObserver` to fade in `.reveal` elements as they scroll into view (skipped/instant if `prefers-reduced-motion` is set).
  - **RSVP link**: built dynamically as a `wa.me` deep link with a URL-encoded message assembled from the config template plus guest name/seat count.
  - **Countdown**: computed client-side from `config.eventDate`, updates every second, swaps to a "today" message when it elapses.
- `src/styles.css` — single stylesheet (~1500 lines), organized by section with comment headers (`/* Intro */`, `/* Hero */`, `/* Event */`, `/* Location */`, `/* Details */`, `/* RSVP */`, `/* Motion */`) followed by responsive breakpoints at the bottom (`/* Tablet */`, `/* Mobile */`). No CSS framework or preprocessor.
- `assets/` — pre-optimized `.webp` images and one `.mp3` (background music). Reference new assets the same way (webp, relative path from repo root).
- `vercel.json` — sets immutable long-lived caching for `/assets/*` and baseline security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) for all routes. `cleanUrls: true`, no trailing slash.

## Customizing for a new event/recipient

Edit only `src/config.js`. Do not put event-specific data (names, dates, phone numbers, venue) directly into `index.html` or `main.js` — the binding functions in `main.js` read from `config.js` exclusively, and hardcoding elsewhere will drift out of sync with the personalization/RSVP logic.

The WhatsApp `phone` in `config.js` is a placeholder (`573000000000`, country code + number, no `+`/spaces/dashes) — check whether it has been set to a real number before treating the RSVP flow as production-ready.
