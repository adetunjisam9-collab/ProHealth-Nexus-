# 🩺 MedTest — Online Medical Test Registration App

A fully functional React web application for registering and managing medical diagnostic tests.

---

## 📁 Project Structure

```
medtest/
├── public/
│   └── index.html          ← Main HTML entry point
├── src/
│   ├── components/
│   │   ├── Header.jsx       ← Navigation bar
│   │   ├── HomePage.jsx     ← Landing page with hero + categories
│   │   ├── TestsPage.jsx    ← Browse & search all tests
│   │   ├── TrackPage.jsx    ← Track report by reference number
│   │   ├── BookingsPage.jsx ← View & manage all bookings
│   │   └── BookingModal.jsx ← 3-step booking form modal
│   ├── App.jsx              ← Root component + database logic
│   ├── index.jsx            ← React entry point
│   ├── index.css            ← All global styles
│   └── data.js              ← Test catalogue + category data
├── package.json             ← Dependencies & scripts
├── vite.config.js           ← Vite build config
└── README.md                ← This file
```

---

## 🚀 Getting Started in VS Code

### 1. Open the project folder
```bash
cd medtest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in browser
Visit: **http://localhost:5173**

---

## 🗄️ Database

Bookings are stored in **localStorage** (browser database) — no server needed.
Data persists across page refreshes and browser sessions on the same device.

Each booking is saved with the key: `medtest_booking_MT-XXXX-XXXXX`

---

## ✅ Features

| Feature               | Status |
|-----------------------|--------|
| Home page with hero   | ✅     |
| Category filtering    | ✅     |
| All tests + search    | ✅     |
| 3-step booking form   | ✅     |
| Track by ref number   | ✅     |
| My Bookings table     | ✅     |
| Cancel bookings       | ✅     |
| Persistent database   | ✅     |
| Toast notifications   | ✅     |
| Responsive design     | ✅     |

---

## 🛠️ Built With

- **React 18** — UI framework
- **Vite** — Build tool & dev server
- **CSS Variables** — Theming
- **localStorage** — Client-side database
- **DM Serif Display + DM Sans** — Typography (Google Fonts)
