# Deploy Preach Flow

Preach Flow is ready to deploy to Vercel.

## Required Secret

Create a fresh OpenAI API key and add it to Vercel as an environment variable:

```txt
OPENAI_API_KEY
```

Do not commit the real key to this project.

## Option 1: Vercel Dashboard + GitHub

1. Create a new private GitHub repository.
2. Upload the contents of `/Users/melosauval/Downloads/pulpitos-web`.
3. Go to `https://vercel.com/new`.
4. Import the GitHub repository.
5. In the Vercel project settings, add `OPENAI_API_KEY` for Production and Preview.
6. Deploy.
7. Visit `https://your-project.vercel.app/api/status`.
8. Confirm it returns `"configured": true`.

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
vercel env add OPENAI_API_KEY production preview development
vercel --prod
```

## After Deploy

The hosted URL no longer depends on your Terminal app. The AI coach runs through Vercel API functions.

Sermons are still stored in the browser's `localStorage`. Add authentication and a database if you want sermons to sync across devices or users.
