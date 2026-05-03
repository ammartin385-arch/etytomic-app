# Etytomic Alignment

Vite React prototype for the Etytomic Alignment assessment.

## Setup

Add your Supabase values to `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Then open the local URL Vite prints in the terminal, usually `http://localhost:5173`.

## Supabase

The app initializes Supabase in `src/supabaseClient.js` using:

```js
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
```

Vite automatically exposes environment variables prefixed with `VITE_` to the client app.
