# AdmitPlan — AI-Powered College Admissions Planner

College admissions planner with school discovery, deadline management, AI coaching, and user accounts with persistent data storage.

## Tech Stack
- **Frontend:** React 18 (CDN, no build step)
- **AI Coach:** Google Gemini 2.5 Flash Lite (free)
- **Database:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel (serverless)

## Setup (10 minutes)

### 1. Supabase (database + auth)

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New Project**
2. Pick a name and set a database password → **Create**
3. Wait for it to spin up, then go to **SQL Editor** (left sidebar)
4. Paste the contents of `supabase-schema.sql` and click **Run**
5. Go to **Settings** → **API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
6. Open `index.html` and replace the two placeholder values near the top:
   ```
   const SUPABASE_URL = "https://xxxxx.supabase.co";       // ← your URL
   const SUPABASE_ANON_KEY = "eyJhbGci...your-key-here";   // ← your anon key
   ```
   These are PUBLIC keys — safe to commit. Row Level Security protects user data.

### 2. Gemini API key (free)

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with Google → **Create API key**
3. Copy the key

### 3. Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New Project** → select your repo
3. Add environment variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** paste your Gemini key
4. Click **Deploy**

Your site will be live. Users sign up, their school lists and tasks persist across sessions.

## Project Structure

```
admitplan/
├── api/
│   └── chat.js              ← Serverless proxy for Gemini API
├── index.html               ← Full frontend app with Supabase auth
├── supabase-schema.sql      ← Run this in Supabase SQL Editor
├── vercel.json
├── package.json
└── .gitignore
```

## How It Works

- **Auth:** Supabase handles email/password signup and login. Session tokens are managed automatically.
- **Data:** When users add schools, check off tasks, or bookmark schools, changes auto-save to Supabase (debounced 1s). Data loads automatically on login.
- **AI Coach:** Chat messages go to `/api/chat` → Vercel serverless function → Google Gemini API. The API key stays server-side.
- **Security:** Row Level Security (RLS) on the database ensures users can only read/write their own data. The Supabase anon key is public by design.
