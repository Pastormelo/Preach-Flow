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

8. Add the same URL to Redirect URLs so magic-link login returns to Preach Flow.

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

Preach Flow creates one Google Doc per sermon and writes a fresh sermon snapshot into it after edits. Edits made directly in Google Docs may be replaced by the next Preach Flow sync.

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
