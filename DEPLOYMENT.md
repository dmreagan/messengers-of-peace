# Deployment Guide — Messengers of Peace Museum Kiosk

This guide covers everything needed to deploy the StoryMap kiosk on a Windows PC.

## Section 1: Prerequisites

- ArcGIS Online account with a published StoryMap (story type, not briefing or collection)
- Adobe Fonts subscription (or Creative Cloud) with access to "Alwyn New Rounded" and "Museo Sans Rounded"
- Windows 10/11 PC for the kiosk
- Google Chrome or Microsoft Edge browser installed
- Python 3.x or Node.js installed (for local web server)

## Section 2: Adobe Fonts Setup

The Adobe Fonts web project has already been created. The project URL is `https://use.typekit.net/oib6sky.css` and is already referenced in `index.html`.

The font-family names used in this project are `alwyn-new-rounded-web` (for Alwyn New Rounded) and `museo-sans-rounded` (for Museo Sans Rounded). These names are already set in both `config.js` and `style.css`.

Alwyn New Rounded available weights: 200, 300, 400, 600, 700 (normal). The config uses normal: 400, bold: 700.

Museo Sans Rounded available weights: 100, 300, 500, 700, 800, 900 (normal). Weight 400 is NOT available. The config uses normal: 500 (nearest available), bold: 700.

If you modify the Adobe Fonts web project (add or remove weights), verify the `font-family` names still match by opening the CSS URL in a browser and checking the `@font-face` rules.

## Section 3: ArcGIS StoryMap Builder Configuration

Advanced embedding is already enabled. `localhost` and `127.0.0.1` are already in the allowed domains list.

Verify the story is published and shared with everyone (required for embedding — see Esri docs).

The StoryMap item ID is `00a24cce226141b6a21e03339b633c96` — already set in `config.js`.

## Section 4: Local Web Server Setup

Option A (Python — simplest, no dependencies): Open Command Prompt, `cd` to the project directory, run `python -m http.server 8000`

Option B (Node.js): Run `npx http-server -p 8000`

The kiosk page is served at `http://localhost:8000`

To auto-start the server on boot: create a `.bat` file in `shell:startup` (`%appdata%\Microsoft\Windows\Start Menu\Programs\Startup`) containing `cd /d "C:\path\to\project" && python -m http.server 8000` (quote the path in case it contains spaces).

Note: `python -m http.server` does not auto-restart if the process crashes. For a production kiosk where unattended uptime matters, consider wrapping the server in a process manager or Windows service that restarts on failure. Possible approaches include NSSM (Non-Sucking Service Manager, https://nssm.cc), a Windows Scheduled Task configured to restart on failure, or a simple watchdog script that checks the server and relaunches it. Research the option that best fits your deployment environment and skill level.

## Section 5: Windows Kiosk Browser Configuration

Chrome: Create a desktop shortcut with target: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk http://localhost:8000`

Edge: Create a desktop shortcut with target: `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk http://localhost:8000 --edge-kiosk-type=fullscreen`

Place the shortcut in the Windows Startup folder (`shell:startup`) to auto-launch on boot

Disable screen sleep: Windows Settings → System → Power & sleep → set "Screen" to "Never" when plugged in

Disable screen saver: Windows Settings → Personalization → Lock screen → Screen saver settings → set to "None"

Optional: Disable Edge/Chrome auto-updates and notifications for a stable kiosk experience

## Section 6: Testing the Kiosk

Open `http://localhost:8000` in a browser

Verify the StoryMap loads and displays with custom fonts (compare heading text to verify Alwyn New Rounded is applied)

Verify the welcome overlay is hidden on initial load

Temporarily set `window.KIOSK_IDLE_TIMEOUT_MS = 5000` in config.js (before `kiosk.js` loads) or wait 3 minutes

Verify the welcome overlay appears after the idle timeout

Touch/click the screen — verify the overlay disappears immediately

Verify the story is interactive (scroll, swipe, tap)

Wait again — verify the overlay reappears after the idle timeout

Remove the temporary `KIOSK_IDLE_TIMEOUT_MS` override before production

## Section 7: Troubleshooting

Story doesn't load: Check (1) advanced embedding is enabled in the builder, (2) `localhost` (or hostname/IP) is in allowed domains — if the embed silently fails, try adding the PC's hostname or LAN IP instead, (3) story is shared with everyone, (4) `storyId` and `rootSelector` in config.js are correct, (5) check browser console for CSP violation errors — if the CSP meta tag is blocking required resources, broaden the relevant directive (e.g., add the blocked domain to `script-src` or `connect-src`)

Fonts don't apply: Check (1) Adobe Fonts project URL in index.html is correct, (2) `fontFamily` strings in config.js match the `font-family` names in the Adobe Fonts CSS, (3) the fonts are included in the web project with the correct weights

Overlay doesn't appear: Check browser console (F12) for kiosk.js errors; verify `IDLE_TIMEOUT_MS` value

Overlay stuck on screen: This should not happen (overlay is hidden by CSS default); if it does, check for JS errors preventing `hideOverlay()` from running
