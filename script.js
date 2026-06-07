/* ============================================================
   HELPER FUNCTION
   ============================================================ */

/**
 * Pads a number to 2 digits with leading zero
 * @param {number} n
 * @returns {string}
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/* ============================================================
   1. DIGITAL CLOCK  —  setInterval every 1000ms
   ============================================================ */

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

/**
 * Reads the current time/date and updates DOM elements:
 *   #clockTime  — HH:MM:SS (12-hour)
 *   #clockAmPm  — AM / PM
 *   #clockDate  — Day, DD Month YYYY
 */
function updateClock() {
  const now  = new Date();
  let   hour = now.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hour = hour % 12 || 12;

  // DOM Manipulation — update text content
  document.getElementById('clockTime').textContent =
    `${pad(hour)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  document.getElementById('clockAmPm').textContent = ampm;

  document.getElementById('clockDate').textContent =
    `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

// Run immediately, then every 1 second using setInterval
updateClock();
setInterval(updateClock, 1000);


/* ============================================================
   2. STOPWATCH  —  setInterval every 10ms (centiseconds)
   ============================================================ */

let swRunning  = false;   // is stopwatch active?
let swElapsed  = 0;       // total elapsed milliseconds
let swStartAt  = 0;       // timestamp when last started
let swInterval = null;    // holds the setInterval reference

/**
 * Formats milliseconds into HH:MM:SS.cs parts
 * @param {number} ms - elapsed milliseconds
 * @returns {{ main: string, cs: string }}
 */
function formatStopwatch(ms) {
  const centiseconds = Math.floor(ms / 10) % 100;
  const seconds      = Math.floor(ms / 1000) % 60;
  const minutes      = Math.floor(ms / 60000) % 60;
  const hours        = Math.floor(ms / 3600000);

  return {
    main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    cs:   `.${pad(centiseconds)}`
  };
}

/**
 * Called every 10ms by setInterval — recalculates elapsed time
 * and updates the DOM.
 */
function swTick() {
  swElapsed = Date.now() - swStartAt;
  const formatted = formatStopwatch(swElapsed);

  // DOM Manipulation
  document.getElementById('swTime').textContent = formatted.main;
  document.getElementById('swMs').textContent   = formatted.cs;
}

/** Start the stopwatch */
function swStart() {
  if (swRunning) return;           // prevent double-start
  swRunning = true;
  swStartAt = Date.now() - swElapsed;  // account for any previous elapsed time
  swInterval = setInterval(swTick, 10);
}

/** Pause — stops interval but keeps elapsed time */
function swPause() {
  if (!swRunning) return;
  clearInterval(swInterval);
  swRunning = false;
}

/** Reset — clears everything back to zero */
function swReset() {
  clearInterval(swInterval);
  swRunning = false;
  swElapsed = 0;

  // DOM Manipulation — reset display
  document.getElementById('swTime').textContent = '00:00:00';
  document.getElementById('swMs').textContent   = '.00';
}


/* ============================================================
   3. COUNTDOWN TIMER  —  setInterval every 50ms
   ============================================================ */

// Spinner values (hours, minutes, seconds)
let timerSetH = 0;
let timerSetM = 10;
let timerSetS = 0;

// Runtime state
let timerRemaining = 0;     // milliseconds left
let timerRunning   = false;
let timerInterval  = null;
let timerEndAt     = 0;     // absolute timestamp when timer will finish

/**
 * Renders current remaining time into #timerDisplay
 * Adds 'danger' class when ≤ 10 seconds remain
 */
function renderTimer() {
  const totalSecs = Math.max(0, Math.ceil(timerRemaining / 1000));
  const hh = Math.floor(totalSecs / 3600);
  const mm = Math.floor((totalSecs % 3600) / 60);
  const ss = totalSecs % 60;

  const el = document.getElementById('timerDisplay');

  // DOM Manipulation — update countdown display
  el.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;

  // Add red pulsing class when almost done
  el.classList.toggle('danger', totalSecs <= 10 && totalSecs > 0);
}

/**
 * Spinner control — adjusts hours / minutes / seconds
 * @param {'h'|'m'|'s'} unit - which unit to change
 * @param {1|-1} direction  - increment or decrement
 */
function spinTime(unit, direction) {
  if (unit === 'h') {
    timerSetH = (timerSetH + direction + 24) % 24;
    document.getElementById('setH').textContent = pad(timerSetH);
  } else if (unit === 'm') {
    timerSetM = (timerSetM + direction + 60) % 60;
    document.getElementById('setM').textContent = pad(timerSetM);
  } else {
    timerSetS = (timerSetS + direction + 60) % 60;
    document.getElementById('setS').textContent = pad(timerSetS);
  }

  // If timer is not running, update the display live as user spins
  if (!timerRunning) {
    timerRemaining = (timerSetH * 3600 + timerSetM * 60 + timerSetS) * 1000;
    renderTimer();
  }
}

/**
 * Called every 50ms — recalculates remaining time using absolute end time
 * for accuracy (avoids interval drift).
 */
function timerTick() {
  timerRemaining = timerEndAt - Date.now();

  if (timerRemaining <= 0) {
    // Timer finished
    timerRemaining = 0;
    renderTimer();
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById('timerDisplay').classList.remove('danger');
    timerFinishedAnimation();
  } else {
    renderTimer();
  }
}

/**
 * Flashes the display 3 times when countdown reaches zero
 */
function timerFinishedAnimation() {
  const el = document.getElementById('timerDisplay');
  let count = 0;
  const flashInterval = setInterval(() => {
    el.style.visibility = (count % 2 === 0) ? 'hidden' : 'visible';
    count++;
    if (count > 6) {
      clearInterval(flashInterval);
      el.style.visibility = 'visible';
    }
  }, 300);
}

/** Start the countdown */
function timerStart() {
  if (timerRunning) return;

  // If remaining is 0 or not set, load from spinner values
  if (timerRemaining <= 0) {
    timerRemaining = (timerSetH * 3600 + timerSetM * 60 + timerSetS) * 1000;
  }

  if (timerRemaining <= 0) return;   // nothing to count down

  timerRunning = true;
  timerEndAt   = Date.now() + timerRemaining;
  timerInterval = setInterval(timerTick, 50);
}

/** Stop (pause) the countdown */
function timerStop() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
}

/** Reset countdown to last spinner values */
function timerReset() {
  clearInterval(timerInterval);
  timerRunning   = false;
  timerRemaining = (timerSetH * 3600 + timerSetM * 60 + timerSetS) * 1000;

  // DOM Manipulation — remove danger class, re-render
  document.getElementById('timerDisplay').classList.remove('danger');
  renderTimer();
}

// Initialize display on page load
timerRemaining = (timerSetH * 3600 + timerSetM * 60 + timerSetS) * 1000;
renderTimer();


/* ============================================================
   4. DARK / LIGHT THEME TOGGLE
   ============================================================ */

/**
 * Toggles between dark and light mode by changing the
 * data-theme attribute on <html> and updating button UI.
 */
function toggleTheme() {
  const html    = document.documentElement;
  const isDark  = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';

  // DOM Manipulation — change theme attribute
  html.setAttribute('data-theme', newTheme);

  // Update toggle button icon and label
  document.getElementById('themeIcon').textContent  = isDark ? '☀️' : '🌙';
  document.getElementById('themeLabel').textContent = isDark ? 'Light' : 'Dark';
}