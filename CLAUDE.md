# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page HTML/CSS/JS invitation site (no frameworks, no build step) for María Fernanda's XV años. Romantic floral style in lilac/pink/wine/gold tones. Flow: intro screen (animated floral frame + gold "Mis 15 años" sign, no video) → tap-to-continue arrow (also starts background music) → continuous-scroll content (hero, location/map, dress code, "lluvia de sobres" gift note, RSVP via WhatsApp, footer).

The site is in Spanish and built for a real client; content and copy changes should preserve the client's wording and tone unless asked to change it.

## Commands

No build, lint, or test tooling — this is plain HTML/CSS/JS. To preview locally:

```sh
npx serve .
```

or just open `index.html` directly in a browser.

Deployed on Vercel (config in `vercel.json` — security headers only, no build command needed since this is static). `netlify.toml` is left over from a previous Netlify deploy and is unused/ignored by Vercel; safe to delete once Vercel is confirmed working.

## Structure

- `index.html` — all markup: intro screen, then `<main id="invitation" hidden>` with sections in scroll order (hero → `#ubicacion` → dress code → envelopes → RSVP → footer).
- `css/style.css` — single stylesheet. Color palette and fonts are CSS custom properties at the top of `:root` (`--wine`, `--gold`, `--lilac-dark`, `--pink`, etc.) — change colors there, not by hunting for hardcoded hex values elsewhere.
- `js/main.js` — vanilla JS IIFE, no modules/bundler. Handles: intro→invitation transition, background music start/mute, sparkle particle scattering, countdown to `EVENT_DATE`, envelope-rain animation, scroll-reveal via `IntersectionObserver`.
- `assets/` — all images (`.webp`) and audio (`musica-fondo.mp3`). Deployed as-is.

## Key architecture notes

- **Everything is hand-wired by element ID/class**, not componentized — `main.js` grabs elements by `getElementById`/`querySelector` and wires listeners directly. When adding a new interactive section, follow this same pattern rather than introducing a framework or module system.
- **Intro screen and invitation are mutually exclusive**: `#intro-screen` is visible first with `body.style.overflow = 'hidden'`; `#invitation` starts `hidden`. `enterInvitation()` in `main.js` flips both, restores scroll, and kicks off `startEnvelopeRain()` + `initScrollReveal()`. Both of those are idempotent (guarded by `rainStarted`/`revealStarted`) since they must only run once.
- **Background music autoplay**: browsers block audio-with-sound before a user gesture, so `bgMusic.play()` is only called inside the same click handler as the intro-continue button. The mute toggle button (`#music-toggle`) stays `hidden` until that point.
- **Scroll-reveal animation**: any element with class `.reveal` fades in via `IntersectionObserver` (threshold 0.2) the first time it enters the viewport, adding `.is-visible`. New sections/content that should animate in on scroll must get the `.reveal` class; the corresponding visible state is styled in `style.css`.
- **Butterfly recoloring trick**: only two butterfly source images exist (`butterfly-a.webp`, `butterfly-b.webp`); different color variants are produced purely via CSS `filter: hue-rotate(...)` through the `.hue-pink` / `.hue-lilac` / `.hue-gold` classes in `style.css`. Prefer adding a new `.hue-*` class over adding new image assets.
- **Responsive approach**: mobile is edge-to-edge (primary case — links opened from WhatsApp); tablet/desktop keep each section at full viewport width (including backgrounds/corner decorations), only the text block is constrained to a readable max-width. Don't shrink sections to a narrow mobile-width card centered with empty space on larger screens.
- **RSVP section is intentionally the odd one out**: it uses a red/wine contrast background instead of the pastel tones used elsewhere, per client request — this is a deliberate design choice, not an inconsistency to "fix".

## Known pending items (see README.md for full detail)

- The RSVP WhatsApp button (`#rsvp-button` in `index.html`) currently uses a placeholder number (`573000000000`) — needs the real number before launch.
- `EVENT_DATE` in `js/main.js` and the map/location details in the `#ubicacion` section are the source of truth for event date/venue — update both together if either changes.
