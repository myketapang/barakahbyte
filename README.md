# 🌙 BarakahByte — Ramadan Food Rescue Hub

> Zero waste, maximum barakah.  
> A mobile-first PWA to rescue surplus Ramadan bazaar food and redistribute it before closing time.

---

## ✨ Features

- **Live listings** — Vendors post surplus food with photo, quantity, and location
- **Claim & rescue flow** — One-tap claim with contact call to seller
- **Photo proof upload** — Camera capture + Supabase Storage upload
- **Barakah points** — Gamification with streak counter
- **Confetti celebration** — Surprise delight on completion
- **Real-time warnings** — Closing-time toast notifications
- **Category filters** — Food, Drinks, Desserts, Snacks
- **Impact stats** — Meals saved, CO₂ avoided, bazaars active
- **Dark organic UI** — Forest-green + saffron palette, Playfair Display + DM Sans

---

## 🗂 Folder Structure

```
barakahbyte/
├── public/
│   └── favicon.svg
├── src/
│   ├── lib/
│   │   └── supabase.js        # Supabase client + helper functions
│   ├── App.jsx                # Main app (all views)
│   ├── index.css              # Global styles + animations
│   └── main.jsx               # React entry point
├── .env.example               # Environment variable template
├── .gitignore
├── index.html
├── netlify.toml               # Netlify build config
├── package.json
├── postcss.config.js
├── supabase_setup.sql         # Run in Supabase SQL Editor
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Deployment Guide

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/barakahbyte.git
cd barakahbyte
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** → paste contents of `supabase_setup.sql` → Run
3. Go to **Settings → API** and copy:
   - `Project URL`  
   - `anon / public` key

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

### 5. Deploy to Netlify

#### Option A — Netlify UI (recommended)

1. Push repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Select your repo
4. Build settings are auto-detected from `netlify.toml`
5. Go to **Site settings → Environment variables** and add:
   ```
   VITE_SUPABASE_URL     = https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY = YOUR_ANON_KEY
   ```
6. Click **Deploy site** ✅

#### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify deploy --build --prod
```

---

## ⚙️ Without Supabase (Demo Mode)

The app works **fully offline** without Supabase — data is stored in React state for the session. A yellow banner warns vendors that data is local-only. Perfect for demos!

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| UI Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Icons | Lucide React |
| Fonts | Playfair Display + DM Sans |
| Deploy | Netlify |

---

## 📸 Supabase Storage Bucket Structure

```
barakahbyte/
├── listings/     ← vendor food photos
└── proofs/       ← redistribution proof photos
```

---

## 🤝 Contributing

PRs welcome! Ramadan Kareem 🌙
