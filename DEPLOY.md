# Deploy Preach Flow

Preach Flow is ready to deploy to Vercel.

## OpenAI Usage

Preach Flow uses a bring-your-own-key model. Do **not** add your personal OpenAI API key to Vercel for a public deployment. Each visitor adds their own OpenAI API key inside the app, and their usage bills to their own OpenAI Platform account.

## Option 1: Vercel Dashboard + GitHub

1. Create a new private GitHub repository.
2. Upload the contents of `/Users/melosauval/Downloads/pulpitos-web`.
3. Go to `https://vercel.com/new`.
4. Import the GitHub repository.
5. Deploy.

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
6. Visit `https://your-project.vercel.app/api/status`.
7. Confirm it returns `"requiresUserOpenAIKey": true`.

Your GitHub repo should include these top-level items:

```txt
api/
public/
src/
assets/
index.html
package.json
vercel.json
```

Vercel serves the deployed website from `public/`. The root `index.html`, `src/`, and `assets/` are kept for local development.

## Option 2: Vercel CLI

If `vercel` is installed and you are logged in:

```sh
cd /Users/melosauval/Downloads/pulpitos-web
vercel
vercel --prod
```

## After Deploy

The hosted URL no longer depends on your Terminal app. The AI coach runs through Vercel API functions.

Sermons are still stored in the browser's `localStorage`. Add authentication and a database if you want sermons to sync across devices or users.
