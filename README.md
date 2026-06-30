# Preach Flow Web

Preach Flow is a focused sermon-prep web app converted from `pulpitos.jsx`.

## Hosted Deployment

This project is ready for Vercel. It serves the app as static files and runs the coach/review endpoints as hosted API functions in `/api`.

Required Vercel environment variables:

```txt
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Optional:

```txt
OPENAI_MODEL=gpt-5.2
GOOGLE_CLIENT_ID=
```

Preach Flow uses a bring-your-own-key model for the AI coach. Do not add your personal OpenAI API key to Vercel for a public deployment. Each visitor adds their own OpenAI API key inside the app, and that key is stored in their browser.

## Design

Preach Flow uses the **One Family Church** design system — orange on ink with cool slate grays, an off-white paper background, Montserrat display type and Mulish body type. The UI supports a **light/dark theme toggle** (persisted per browser), a movement "journey" progress path, and a distraction-free writing canvas. All styling lives in `src/styles.css` as CSS custom properties scoped to `[data-theme="light|dark"]`.

## Accounts and Database

Preach Flow uses Supabase Auth and a Supabase Postgres table for account-based saving. Run the SQL in `supabase/schema.sql` inside your Supabase SQL editor, then add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel.

Sign-in supports **email + password**, **Continue with Google**, and a one-time **magic link**. To enable Google sign-in, turn on the Google provider in your Supabase project (Authentication → Providers → Google) and add this site's URL to the allowed redirect URLs. Password sign-up may require email confirmation depending on your Supabase Auth settings.

The app stores one private `app_state` JSON document per user. Row Level Security restricts each user to their own row.

To enable Google Docs sync, create a Google OAuth Web Client ID and add it as `GOOGLE_CLIENT_ID` in Vercel. In Google Cloud, add your Vercel URL as an Authorized JavaScript origin, for example:

```txt
https://your-site.vercel.app
```

The app requests these Google scopes only when you click Connect Google:

```txt
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/documents
```

## Run Locally

```sh
cd /Users/melosauval/Downloads/pulpitos-web
node server.mjs
```

Then open:

```txt
http://127.0.0.1:4173
```

The app still runs and saves sermons locally without a user OpenAI key. Coach and review calls ask each user to add their own key inside the app.

## Features

- Guided sermon workflow from exegesis through delivery.
- Pipeline search and filtering.
- Editable sermon details.
- Per-phase notes.
- Account login and cloud progress sync through Supabase.
- Markdown export.
- Finished-sermon review.
- `.txt`, `.md`, and `.docx` upload support.
- Bring-your-own OpenAI key support so each user pays for and controls their own coach usage.
- Optional Google Docs link per sermon with delayed auto-sync from the app into the linked doc.
