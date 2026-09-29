# PROJECT KNOWLEDGE BASE

**Generated:** 2026-09-29
**Commit:** 565621e
**Branch:** chore/init-agents-md

## OVERVIEW
Museum kiosk web page embedding an ArcGIS StoryMap (advanced/script-tag embed) with a custom-font injection and a 3-minute idle "Touch to begin" overlay. Plain HTML/CSS/vanilla JS — no build step, no npm deps, no framework.

## STRUCTURE
```
./
├── index.html       Host page: CSP, Adobe Fonts link, overlay markup, ordered <script> tags
├── config.js        window.storyMapsEmbedConfig — story ID, root selector, font family/weights
├── kiosk.js         Idle detection (3-min), overlay toggle, onIdle/onActivity reserved stubs
├── style.css        Overlay/card styling, pulse animation, progressive-enhancement default
├── DEPLOYMENT.md    Authoritative deploy guide (Adobe Fonts, Esri builder, kiosk browser, troubleshooting)
├── README.md        Feature spec + how-it-works
└── LICENSE          BSD-3-Clause, copyright Indiana University
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Change idle timeout | `kiosk.js:14` `IDLE_TIMEOUT_MS` | Test override: `window.KIOSK_IDLE_TIMEOUT_MS` set before this script |
| Swap StoryMap | `config.js:15` `storyId` | Also update allowed domains in Esri builder |
| Change fonts | `config.js:21-41` + `index.html:8` Adobe Fonts link + `style.css` font-family | Names MUST match `@font-face` in Typekit CSS |
| Edit CSP | `index.html:6` meta http-equiv | Add any new origin or it silently blocks |
| Overlay styling | `style.css:13-62` | `.idle-overlay` + `.is-visible` + `.idle-overlay__card` |
| Deploy/troubleshoot | `DEPLOYMENT.md` §4-7 | Web server, kiosk browser flags, silent-embed-fix |

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `storyMapsEmbedConfig` | global obj | `config.js:14` | Embed config read by Esri engine |
| `IDLE_TIMEOUT_MS` | var | `kiosk.js:14` | Idle threshold (180000ms; override via `window.KIOSK_IDLE_TIMEOUT_MS`) |
| `IDLE_CHECK_INTERVAL_MS` | var | `kiosk.js:15` | Poll interval (1000ms) |
| `MOVE_THROTTLE_MS` | var | `kiosk.js:16` | pointermove/mousemove throttle (1000ms) |
| `handleActivity` | fn | `kiosk.js:23` | Resets timer; on wake-from-idle calls `onActivity` + `hideOverlay` |
| `showOverlay` / `hideOverlay` | fn | `kiosk.js:32` / `:37` | Toggle `.is-visible` on `#idleOverlay` + `body.no-scroll` |
| `checkIdle` | fn | `kiosk.js:42` | Polls; on timeout sets `isIdle`, calls `onIdle`, shows overlay |
| `onIdle` / `onActivity` | fn | `kiosk.js:52` / `:56` | Intentionally empty — reserved for future autoplay-iframe (see DEPLOYMENT.md) |
| `handleMove` | fn | `kiosk.js:59` | Throttled wrapper → `handleActivity` |
| `init` | fn | `kiosk.js:77` | Starts interval, hides overlay (belt-and-suspenders) |

## CONVENTIONS
- **ES5 style**: `var` + `function` declarations. Match it — no `const`/`let`/arrows in `kiosk.js`/`config.js`.
- **No build/deps**: do not introduce npm packages, imports, or a bundler.
- **Script load order** (`index.html:24-27`): `config.js` → `kiosk.js` → Esri embed engine. MUST stay in this order.
- **CSP is strict**: any new external origin must be added to the relevant directive in `index.html:6` or it silently fails.
- **CSS**: BEM-ish (`.idle-overlay`, `.idle-overlay__card`, `.idle-overlay__hint`); state via `.is-visible`; `body.no-scroll` locks scroll.
- **Passive listeners**: `pointermove`/`wheel`/`scroll`/`touchstart`/`mousemove` use `{ passive: true }` — preserve.
- **File headers**: C-style block comment with purpose summary; inline `//` for non-obvious decisions.

## ANTI-PATTERNS (THIS PROJECT)
- **Do NOT set `body.weight.normal: 400`** for `museo-sans-rounded` — weight 400 is unavailable; 500 is the intentional substitute (`config.js:32`).
- **Do NOT reorder the `<script>` tags** in `index.html` — config must define `window.storyMapsEmbedConfig` before the Esri engine reads it.
- **Do NOT invert the overlay default** — overlay is `display: none` by CSS, shown only by JS. Inverting breaks progressive enhancement (StoryMap must stay visible if JS fails).
- **Do NOT delete `onIdle()`/`onActivity()`** stubs — reserved for the dual-embed autoplay upgrade path (DEPLOYMENT.md).
- **Do NOT ship `window.KIOSK_IDLE_TIMEOUT_MS`** to production — testing-only override; overlay would fire every few seconds.
- **Do NOT remove `'unsafe-eval'`/`'unsafe-inline'`** from `script-src` — the Esri embed engine requires them.

## UNIQUE STYLES
- Both `rootSelector` AND `rootNode` set to `.storymaps-root` (samples-repo + official-docs compatibility). Keep both.
- `visibilitychange` guard (`kiosk.js:98`) warns + resets timer on tab return (guards against background-tab `setInterval` throttling).
- `init()` calls `hideOverlay()` defensively even though CSS already hides it ("belt-and-suspenders", `kiosk.js:80`).

## COMMANDS
```bash
# Serve locally (no build step)
python -m http.server 8000
# → http://localhost:8000

# Node alternative
npx http-server -p 8000

# LSP: typescript + biome installed (no lint config — no enforcement layer)
```

## NOTES
- StoryMap item ID: `00a24ce226141b6a21e03339b633c96` (hardcoded in `config.js:15`).
- Adobe Fonts project: `https://use.typekit.net/oib6sky.css` (`index.html:8`).
- ArcGIS SDK emits runtime DEPRECATED warnings (geodesicUtils, Home, ScaleBar, MapView.watch) — these originate in the Esri embed engine, not this repo. Tracked in `.omo/evidence/F3-manual-qa/console.txt`.
- Silent embed failure fallback (DEPLOYMENT.md §7): add the PC's hostname or LAN IP to Esri allowed-domains if `localhost` is rejected.
- `python -m http.server` does not auto-restart on crash — for unattended kiosks, wrap in NSSM / scheduled task / watchdog (DEPLOYMENT.md §4).
- No tests exist; verification is manual per DEPLOYMENT.md §6.
