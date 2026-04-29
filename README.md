# AdmitPlan — AI-Powered College Admissions Planner

College admissions planner with school discovery, deadline management, AI coaching, and user accounts with persistent data storage.

## Tech Stack
- **Frontend:** React 18 (CDN, no build step)
- **AI Coach:** Google Gemini 2.5 Flash Lite (free)
- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase Auth
- **Hosting:** Vercel (serverless)

## Setup (10 minutes)

### 1. Firebase (database + auth)

1. Go to the [Firebase Console](https://console.firebase.google.com/) → **Add project**
2. Enable **Authentication** → **Get started** → Select **Email/Password** → Enable it
3. Enable **Firestore Database** → **Create database** → Select **Start in test mode** (or production mode and apply rules)
4. Go to **Project Settings** (gear icon) → **General**
5. Scroll down to **Your apps** → Click the `</>` icon (Web) → Register app
6. Copy the `firebaseConfig` object from the setup code
7. Open `index.html` and replace the placeholder `firebaseConfig` near the top:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_FIREBASE_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
8. (Optional) Apply security rules from `firebase-rules.json` in the Firestore **Rules** tab.

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
├── index.html               ← Full frontend app with Firebase auth & Firestore
├── firebase-rules.json      ← Security rules for Firestore
├── vercel.json
├── package.json
└── .gitignore
```

## How It Works

- **Auth:** Firebase Auth handles email/password signup and login. Session state is managed automatically via `onAuthStateChanged`.
- **Data:** When users add schools, check off tasks, or bookmark schools, changes auto-save to Firestore (debounced 1s). Data loads automatically on login.
- **AI Coach:** Chat messages go to `/api/chat` → Vercel serverless function → Google Gemini API. The API key stays server-side.
- **Security:** Firestore Security Rules ensure users can only read/write their own data based on their `uid`.
