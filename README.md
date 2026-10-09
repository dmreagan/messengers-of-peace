# Messengers of Peace — Museum Kiosk

A museum kiosk web page that embeds an [ArcGIS StoryMap](https://storymaps.arcgis.com/) using advanced (script-tag) embedding, with custom fonts and an automatic welcome overlay that appears after 10 minutes of inactivity.

## Features

- **Custom font injection** — Alwyn New Rounded for headings, Museo Sans Rounded for body text, loaded via Adobe Fonts and applied through the StoryMap embed config
- **Idle welcome overlay** — after 10 minutes of no interaction, a full-screen image overlay appears with a "Touch to begin" prompt to attract visitors
- **Progressive enhancement** — the StoryMap is visible even if JavaScript fails; the overlay is hidden by CSS default and only shown by `kiosk.js`
- **No build step** — plain HTML, CSS, and JS. No bundler, no npm dependencies, no framework
- **Content Security Policy** — restricts all resource origins to trusted CDNs (Esri, Adobe Fonts, Google Fonts)

## File Structure

```
index.html       Host page: CSP, Adobe Fonts link, overlay markup, embed scripts
config.js        StoryMap embed config: story ID, root selector, font families
style.css        Overlay styling, idle screen image scaling
kiosk.js         Idle detection (10-min timer), overlay toggle, onIdle/onActivity hooks
DEPLOYMENT.md    Full deployment guide: Adobe Fonts, Esri builder, web server, kiosk browser
README.md        This file
LICENSE          BSD-3-Clause license
```

## Quick Start

1. Serve the project directory with a local web server:

   ```bash
   python -m http.server 8000
   ```

2. Open `http://localhost:8000` in a browser.

3. The StoryMap loads with custom fonts. After 10 minutes of inactivity, the welcome overlay appears. Touch or click anywhere to dismiss it.

For testing the idle overlay without waiting 10 minutes, add this line to `config.js` before the embed config:

```js
window.KIOSK_IDLE_TIMEOUT_MS = 5000; // 5 seconds for testing
```

Remove it before deploying to the kiosk.

## How It Works

### Custom Fonts

ArcGIS StoryMaps advanced (script-tag) embedding renders the story directly into the host page rather than in an iframe. This gives us access to the `font` config property, which tells the embed engine which font families to use for titles and body text. The fonts themselves are loaded via an Adobe Fonts `<link>` tag in `index.html`.

Font-family names must match the `@font-face` declarations in the Adobe Fonts CSS:

| Display name             | CSS font-family name      | Used for   | Weights used    |
| ------------------------ | ------------------------- | ---------- | --------------- |
| Alwyn New Rounded        | `alwyn-new-rounded-web`   | Titles     | 400 (normal), 700 (bold) |
| Museo Sans Rounded       | `museo-sans-rounded`      | Body text  | 500 (normal), 700 (bold) |

### Idle Overlay

`kiosk.js` monitors pointer, touch, keyboard, and scroll events on `document`. Every 1 second it checks whether 10 minutes (600,000 ms) have passed since the last activity. If so, it adds the `.is-visible` class to `#idleOverlay`, which switches it from `display: none` to `display: block`. The overlay displays a full-viewport image (`images/idle.webp`) scaled with `object-fit: contain` to fill the screen without stretching; the semi-transparent dark background fills any letterboxed space. Any user interaction removes the class and resets the timer.

The `onIdle()` and `onActivity()` functions are empty stubs reserved for a future autoplay-iframe enhancement (not currently implemented).

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions covering:

- Adobe Fonts web project setup
- ArcGIS StoryMap builder configuration (advanced embedding, allowed domains)
- Local web server setup and auto-start on boot
- Windows kiosk browser configuration (Chrome/Edge `--kiosk` mode)
- Testing the kiosk
- Troubleshooting

## Requirements

- An ArcGIS Online account with a published StoryMap (advanced embedding enabled, `localhost` in allowed domains)
- An Adobe Fonts subscription (or Creative Cloud) with access to Alwyn New Rounded and Museo Sans Rounded
- A Windows 10/11 PC for the kiosk
- Google Chrome or Microsoft Edge
- Python 3.x or Node.js (for the local web server)

## License

Licensed under the [BSD-3-Clause License](LICENSE).
