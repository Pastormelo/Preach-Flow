# Preach Flow Web

Preach Flow is a focused sermon-prep web app converted from `pulpitos.jsx`.

## Hosted Deployment

This project is ready for Vercel. It serves the app as static files and runs the coach/review endpoints as hosted API functions in `/api`.

Required Vercel environment variable:

```txt
OPENAI_API_KEY
```

Optional:

```txt
OPENAI_MODEL=gpt-5.2
```

Set `OPENAI_API_KEY` in the Vercel dashboard under Project Settings -> Environment Variables. Do not commit real keys to this repo.

## Run Locally

```sh
cd /Users/melosauval/Downloads/pulpitos-web
OPENAI_API_KEY='your_key_here' node server.mjs
```

Then open:

```txt
http://127.0.0.1:4173
```

Without `OPENAI_API_KEY`, the app still runs and saves sermons locally. Coach and review calls return setup guidance until the key is configured.

## Features

- Guided sermon workflow from exegesis through delivery.
- Pipeline search and filtering.
- Editable sermon details.
- Per-phase notes.
- Markdown export.
- Finished-sermon review.
- `.txt`, `.md`, and `.docx` upload support.
- Server-side OpenAI calls so the API key is never exposed to the browser.
