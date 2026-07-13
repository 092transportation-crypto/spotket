# Spotket — Shop Smarter

Premium online store built with **Next.js (App Router) + React + Tailwind CSS**, optimized for Vercel deployment.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Homepage — rotating hero, deals countdown, 8 categories, best sellers, new arrivals, why-shop, testimonials carousel, newsletter |
| `/products` | Product grid with filter sidebar (category, price, rating, brand), search, and sorting |
| `/products/[id]` | Product detail — image gallery, buy now, delivery estimate, reviews with rating breakdown, related products |
| `/cart` | Cart with quantity controls and order summary (free-shipping progress, tax estimate) |
| `/deals` | Daily deals with countdown timer |
| `/best-sellers` | Best-selling products |
| `/new-arrivals` | Newest products |
| `/help` | Help center with FAQs |
| `/shipping` / `/returns` | Shipping info and returns policy |
| `/privacy` / `/terms` | Legal pages |
| `/about` / `/contact` | Story/mission and contact form |

SEO: per-page meta titles/descriptions, Open Graph tags, plus auto-generated `/sitemap.xml` and `/robots.txt`.

## Adding products

The catalog lives in [`lib/products.ts`](lib/products.ts) and is currently empty. Append `Product` objects to the `products` array (an example is in the file's comments) and drop images into `public/products/`. The grid, detail pages, cart, and sitemap all pick them up automatically.

## Configuration

- `NEXT_PUBLIC_SITE_URL` — canonical site URL used in metadata, sitemap, and robots (defaults to `https://spotket.vercel.app`). Set it in Vercel once you attach a custom domain.
- Brand colors are defined in `app/globals.css` (`--color-brand: #0066ff`, navy scale).

## Deploying to Vercel

```bash
vercel          # preview deployment
vercel --prod   # production
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new) — zero configuration needed.
