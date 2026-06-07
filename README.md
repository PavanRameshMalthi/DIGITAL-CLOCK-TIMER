# ⏰ Interactive Digital Clock & Timer

A fully responsive web application featuring a **Real-time Digital Clock**, **Stopwatch**, and **Countdown Timer** — built with pure HTML, CSS & JavaScript.

---

## 📸 Preview

> A dark/light themed dashboard with three interactive panels:
> - 🕐 Digital Clock with live date
> - ⏱ Stopwatch with centisecond precision
> - ⏳ Countdown Timer with custom time setter

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🕐 Digital Clock | Live time (12-hour format with AM/PM) + full date display |
| ⏱ Stopwatch | Start, Pause, Reset with HH:MM:SS.cs precision |
| ⏳ Countdown Timer | Set custom hours/minutes/seconds, Start/Stop/Reset |
| 🌙 Dark / Light Mode | Toggle themes with smooth CSS transitions |
| 📱 Responsive Design | Works on desktop, tablet, and mobile |

---

## 📁 Project Structure

```
interactive-clock-timer/
│
├── index.html      → Page structure & layout
├── style.css       → All styles, themes, animations
├── script.js       → JavaScript logic (clock, stopwatch, timer)
└── README.md       → Project documentation
```

---

## 🛠️ Technologies Used

- **HTML5** — Semantic structure, DOM elements
- **CSS3** — CSS Variables, Flexbox, Grid, Keyframe Animations
- **JavaScript (ES6)** — setInterval, DOM Manipulation, Date API

---

## ⚙️ JavaScript Concepts

### `setInterval` Usage

| Module | Interval | Purpose |
|---|---|---|
| Digital Clock | 1000ms | Updates HH:MM:SS every second |
| Stopwatch | 10ms | Updates centiseconds smoothly |
| Countdown Timer | 50ms | Decrements remaining time |

### DOM Manipulation Methods Used

```js
document.getElementById()     // Select elements by ID
element.textContent            // Update displayed text
element.classList.toggle()     // Add/remove CSS classes
element.setAttribute()         // Change HTML attributes
element.style.visibility       // Show/hide elements
```

### Drift-Free Timing

The stopwatch and timer use `Date.now()` with an **absolute end timestamp** instead of simply counting intervals — this prevents time drift over long sessions:

```js
// Store when the timer should end
timerEndAt = Date.now() + timerRemaining;

// On each tick, recalculate from real time
timerRemaining = timerEndAt - Date.now();
```

---

## 🖥️ How to Run

1. **Download** all 4 files into the same folder
2. **Open** `index.html` in any modern browser
3. No installation, no dependencies, no server needed ✅

```
interactive-clock-timer/
  ├── index.html   ← Open this in your browser
  ├── style.css
  ├── script.js
  └── README.md
```

---

## 🎨 Theme System

Themes are controlled via a `data-theme` attribute on the `<html>` tag and CSS custom properties:

```css
:root[data-theme="dark"]  { --bg: #0d0f1a; --clock-color: #c084fc; ... }
:root[data-theme="light"] { --bg: #f0f4ff; --clock-color: #7c3aed; ... }
```

Toggling is done with one line of JavaScript:

```js
document.documentElement.setAttribute('data-theme', 'light');
```

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|---|---|
| Desktop (> 768px) | 3-column grid |
| Mobile (≤ 768px) | Single column stack |

---

## 📌 Function Reference

### Digital Clock
| Function | Description |
|---|---|
| `updateClock()` | Reads `new Date()` and updates clock display |

### Stopwatch
| Function | Description |
|---|---|
| `swStart()` | Starts the stopwatch interval |
| `swPause()` | Clears interval, preserves elapsed time |
| `swReset()` | Clears interval, resets elapsed to 0 |
| `swTick()` | Called every 10ms to update display |

### Countdown Timer
| Function | Description |
|---|---|
| `timerStart()` | Starts countdown from remaining time |
| `timerStop()` | Pauses countdown |
| `timerReset()` | Resets to last spinner values |
| `timerTick()` | Called every 50ms to update display |
| `spinTime(unit, dir)` | Increments/decrements H/M/S spinner |
| `renderTimer()` | Updates `#timerDisplay` DOM element |

### Theme
| Function | Description |
|---|---|
| `toggleTheme()` | Switches between dark and light mode |

---

👨‍💻 Author

Name: MALTHI PAVAN RAMESH

Project: Interactive Digital Clock & Timer

Built with: HTML, CSS & JavaScript

Skills Demonstrated: setInterval, DOM Manipulation, CSS Variables, Responsive Design

---
