# AdmitPlan — AI-Powered College Admissions Planner

An interactive web app that helps students discover schools, manage application deadlines, and get AI coaching — all in one place.

## Live Setup (5 minutes)

### Step 1: Push this repo to GitHub
If you haven't already, create a new GitHub repo and push all these files to it.

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Select your `admitplan` repo
4. **Before clicking Deploy**, click **"Environment Variables"**
5. Add one variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from [console.anthropic.com](https://console.anthropic.com) (starts with `sk-ant-`)
6. Click **Deploy**

That's it. Your site will be live at `https://admitplan.vercel.app` (or whatever name Vercel assigns). The AI Coach will work immediately — no API key visible to users.

## Project Structure

```
admitplan/
├── api/
│   └── chat.js          ← Serverless proxy (holds your API key securely)
├── public/
│   └── index.html       ← The entire frontend app
├── vercel.json          ← Vercel routing config
├── package.json
├── .gitignore
└── README.md
```

## How It Works

- **Frontend** (`public/index.html`): React app loaded via CDN — no build step needed
- **Backend** (`api/chat.js`): A single serverless function that forwards chat requests to the Anthropic API with your secret key. Users never see the key.
- The AI coach calls `/api/chat` → Vercel runs the function → function calls Anthropic with your key → response sent back to the browser

## Updating Your API Key

If you need to rotate your key:
1. Go to your Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Update `ANTHROPIC_API_KEY` with the new value
3. Redeploy (or it will auto-deploy on next push)
