# 🐾 Mini Habit Tracker

Track your daily habits with a simple mobile-first tracker that saves your progress in the browser. Fully built with HTML, TailwindCSS, Vanilla JS, and IndexedDB.

## ✨ Features

- 📝 Add and remove custom habits
- 📆 Daily tracker with emoji feedback
- 💾 Saves your data in IndexedDB (offline friendly)
- ✏️ Edit habits at any time
- 📊 Weekly dashboard with 7-day habit history
- 🔔 Designed for future notification support

## 📁 Project Structure

```
habit-tracker/
├── index.html       # Main layout with Tailwind and HTML
├── style.css        # Optional custom styles (can be empty)
├── script.js        # App logic: form handling, IndexedDB, rendering
└── README.md        # This file
```

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/KaterynaHarmash/pet-care-calculator.git
cd pet-care-calculator
```

### 2. Open `index.html`
Just open in your browser — no server required.

> 📦 *If you use modules, run with Live Server or local server (like Python `http.server`).*

---

## 🛠 Technologies Used

- **TailwindCSS CDN** — responsive UI
- **Vanilla JavaScript** — no framework
- **IndexedDB (via idb)** — local browser database

---

## 📊 Weekly Dashboard

Track your habit completion for the past 7 days.

- Responsive table below the tracker
- ✅ for done, ✖️ for missed
- Autoloads and updates on each view

### Example:

| Habit     | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|-----------|-----|-----|-----|-----|-----|-----|-----|
| Water     | ✅  | ✅  | ✖️  | ✅  | ✅  | ✖️  | ✅  |
| Exercise  | ✖️  | ✅  | ✅  | ✅  | ✖️  | ✅  | ✅  |

---

## 🧠 Author
Made with 💜 by [@KaterynaHarmash](https://github.com/KaterynaHarmash)

---

Feel free to fork, remix, or use as inspiration for your own productivity tools!
