# Spotket (retired)

The Spotket store is shut down. This repo now serves a single landing
page announcing the move to [RIFQA](https://rifqa.shop), plus a
middleware redirect that sends every other path back to `/`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Configuration

- `NEXT_PUBLIC_SITE_URL` — canonical site URL used in metadata, sitemap,
  and robots (defaults to `https://www.spotket.com`).

## Deploying to Vercel

```bash
vercel          # preview deployment
vercel --prod   # production
```

Or push to GitHub — the project auto-deploys from `main`.
