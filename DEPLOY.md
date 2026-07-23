# Deploy Preach Flow

Preach Flow is ready to deploy to Vercel.

## OpenAI Usage

Preach Flow uses a bring-your-own-key model. Do **not** add your personal OpenAI API key to Vercel for a public deployment. Each visitor adds their own OpenAI API key inside the app, and their usage bills to their own OpenAI Platform account.

## Supabase Login and Database

1. Create a Supabase project.
2. Open Supabase -> SQL Editor.
3. Run the SQL from `supabase/schema.sql`.
4. Open Supabase -> Project Settings -> API.
5. Copy the Project URL into Vercel as:

```txt
SUPABASE_URL
```

6. Copy the anon public key into Vercel as:

```txt
SUPABASE_ANON_KEY
```

7. In Supabase -> Authentication -> URL Configuration, set your Vercel site URL as the Site URL, for example:

```txt
https://your-site.vercel.app
```

8. Add the same URL to Redirect URLs so magic-link login returns to Preach Flow. Also add the `/app` path (for example `https://your-site.vercel.app/app`) so password-reset emails can return the user to the set-a-new-password screen.

## Option 1: Vercel Dashboard + GitHub

1. Push this repository to GitHub.
2. Go to `https://vercel.com/new`.
3. Import the GitHub repository.
4. Deploy.
5. Visit `https://your-project.vercel.app/api/status`.
6. Confirm it returns `"requiresUserOpenAIKey": true`.

## Google Docs Sync

Google Docs sync also needs a public Google OAuth Client ID:

```txt
GOOGLE_CLIENT_ID
```

Create it in Google Cloud as an OAuth **Web application** client. Add your deployed Vercel URL as an **Authorized JavaScript origin**, for example:

```txt
https://your-site.vercel.app
```

Then add the Client ID to Vercel under Project Settings -> Environment Variables and redeploy. This is not a secret, but it must match the deployed origin.

The Library's "browse your Google Docs" import and the Pipeline's preaching-calendar import ask users for read-only Drive access (`drive.readonly`) alongside the Docs-sync scopes; the calendar import can read both Google Docs and Google Sheets. To let the calendar import read every tab of a spreadsheet (not just the first), also enable the **Google Sheets API** in the same Google Cloud project. If your Google Cloud OAuth consent screen restricts scopes, add `https://www.googleapis.com/auth/drive.readonly` there. PreachFlow only reads the documents a user explicitly checks.

### Sermon Guide engine (make AI "just work")

Add **one** environment variable in Vercel (Project Settings → Environment Variables) and every signed-in user's Sermon Guide works with zero setup:

```txt
AI_API_KEY = sk-...        # your OpenAI API key (platform.openai.com)
```

Optional overrides:

```txt
AI_PROVIDER = openai       # or: anthropic, gemini, groq
AI_MODEL    = gpt-5.2      # any model your provider offers
```

Notes:

1. **Cost:** a typical Sermon Guide call costs a fraction of a cent; a pastor preparing weekly lands in the low dollars per month. Set a spending limit in your OpenAI dashboard for peace of mind.
2. **Protection:** when Supabase auth is configured, the app-provided engine only answers **signed-in users** — anonymous visitors are asked to sign in, so strangers can't consume your quota.
3. **Overrides:** a user who adds their own OpenAI key in the app always uses their own quota instead.
4. **Switching providers later:** change `AI_PROVIDER` + `AI_API_KEY` (e.g. `gemini` with a free key from aistudio.google.com, or `groq` from console.groq.com) and redeploy — no code changes.

### Share links (Sharing and Delivery Center)

Share links need the updated Supabase schema: run `supabase/schema.sql` in the Supabase SQL editor (it now also creates `preach_flow_shared_views` and the token-gated `preach_flow_get_shared_view` function). Links are unguessable tokens, read-only, revocable, and served by `share.html`.

Google is used two ways, both user-initiated: the Sermon Editor's "Send to Google Docs" button creates a one-time copy of the manuscript as a new Google Doc (no ongoing sync), and the Library's import can read documents the user checks.

Your GitHub repo should include these top-level items:

```txt
api/
src/
assets/
supabase/
index.html
app.html
package.json
vercel.json
```

Vercel runs `npm run build`, which assembles the static site into `dist/` from the root sources (`index.html`, `app.html`, `src/`, `assets/`). There is only one copy of the site code — no directories to keep in sync.

## Option 2: Vercel CLI

If `vercel` is installed and you are logged in, run from the repository root:

```sh
vercel
vercel --prod
```

## After Deploy

The hosted URL no longer depends on your Terminal app. The AI coach runs through Vercel API functions.

Sermons save instantly in the browser and sync to the signed-in user's Supabase row. If Supabase is not configured or the user is signed out, Preach Flow still saves on the current device.
