/*
 * Kiosk idle detection and overlay management.
 *
 * Monitors user activity (pointer, touch, keyboard, scroll events).
 * After IDLE_TIMEOUT_MS of inactivity, shows the idle overlay.
 * Any user interaction hides the overlay and resets the timer.
 *
 * onIdle() and onActivity() are named function stubs reserved for a
 * future autoplay-iframe enhancement. See DEPLOYMENT.md for details.
 */

// 3 minutes — adjust as needed for the museum.
// For testing, set window.KIOSK_IDLE_TIMEOUT_MS = 5000 before this script loads.
var IDLE_TIMEOUT_MS = window.KIOSK_IDLE_TIMEOUT_MS || 180000;
var IDLE_CHECK_INTERVAL_MS = 1000;
var MOVE_THROTTLE_MS = 1000;

var lastActivityTime = Date.now();
var isIdle = false;
var idleCheckInterval = null;
var lastMoveResetTime = 0;

function handleActivity() {
  lastActivityTime = Date.now();
  if (isIdle) {
    onActivity();
    hideOverlay();
  }
}

function showOverlay() {
  document.getElementById('idleOverlay').classList.add('is-visible');
  document.body.classList.add('no-scroll');
}

function hideOverlay() {
  document.getElementById('idleOverlay').classList.remove('is-visible');
  document.body.classList.remove('no-scroll');
}

function checkIdle() {
  if (Date.now() - lastActivityTime >= IDLE_TIMEOUT_MS && !isIdle) {
    isIdle = true;
    onIdle();
    showOverlay();
  }
}

// Future enhancement: create autoplay iframe here.
// See DEPLOYMENT.md for the dual-embed upgrade path.
function onIdle() {
}

// Future enhancement: destroy autoplay iframe here.
function onActivity() {
}

// Throttled activity handler for pointermove/mousemove
function handleMove() {
  if (Date.now() - lastMoveResetTime >= MOVE_THROTTLE_MS) {
    lastMoveResetTime = Date.now();
    handleActivity();
  }
}

// Activity event listeners on document
document.addEventListener('pointerdown', handleActivity);
document.addEventListener('pointermove', handleMove, { passive: true });
document.addEventListener('keydown', handleActivity);
document.addEventListener('wheel', handleActivity, { passive: true });
document.addEventListener('scroll', handleActivity, { passive: true });
document.addEventListener('touchstart', handleActivity, { passive: true });
document.addEventListener('mousedown', handleActivity);
document.addEventListener('mousemove', handleMove, { passive: true });

// Overlay click handler — clicking the overlay dismisses it
document.getElementById('idleOverlay').addEventListener('click', hideOverlay);

// Initialization
function init() {
  lastActivityTime = Date.now();
  idleCheckInterval = setInterval(checkIdle, IDLE_CHECK_INTERVAL_MS);
  hideOverlay(); // belt-and-suspenders: overlay is already hidden by CSS
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Cleanup
window.addEventListener('beforeunload', function () {
  if (idleCheckInterval) {
    clearInterval(idleCheckInterval);
  }
});

// Visibility guard — kiosk mode should keep the tab always active,
// but this guards against edge cases where the browser throttles
// setInterval in background tabs.
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    console.warn('[kiosk] Page became hidden — idle timer may be throttled.');
  } else {
    lastActivityTime = Date.now();
  }
});