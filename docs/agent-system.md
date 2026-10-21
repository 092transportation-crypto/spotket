# Spotket agent system

An admin dashboard at `/admin` plus 4 automated agents. Two things from the
original spec were deliberately scoped differently — see **Scoped down**
below before assuming anything matches the request verbatim.

## What's live today vs. what needs your setup

Everything in this repo is already committed and deployable — the whole
system runs in a safe "not configured yet" mode (chat gives a polite
fallback reply, cron jobs log "skipped," nothing crashes) until you add the
real credentials below as Vercel env vars (Production **and** Preview).

### 1. Supabase (a project already exists — this is not a fresh setup)

Live-tested 2026-10-20: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
were already set in Vercel (100+ days old — left over from the original
Spotket dropshipping store, before the pivot to Spotket Digital). `lib/supabase.ts`
reads `SUPABASE_URL` with a fallback to `NEXT_PUBLIC_SUPABASE_URL`, so this
project connects today with no new env vars needed. **But the schema has
never been run against it** — confirmed live: `insertLead` fails with
`Could not find the table 'public.leads'`. You still need to open this
EXISTING project's SQL editor (supabase.com → the project you set those keys
from) and run the entire contents of `supabase-schema.sql` once.

One real collision already found and fixed: the old dropshipping store had
its own `activity_log` table with different columns, which silently broke
every `logActivity` call (`Could not find the 'agent_name' column`). Renamed
to `agent_activity_log` to avoid guessing at that legacy table's shape —
if you hit a similar "table/column not found" error on `leads`,
`blog_posts`, `landing_pages`, or `agent_settings` after running the schema,
it's the same class of collision and the fix is the same: rename the new
table.

### 2. Anthropic (Claude API)

- `ANTHROPIC_API_KEY` — set for Production; **not yet set for Preview**
  (confirmed via `vercel env ls`), so the chat widget replies with the
  "live chat isn't available" fallback on preview deployments until it's
  added there too.
- `ANTHROPIC_CHAT_MODEL` (optional, defaults to `claude-haiku-5-5`) — used
  by the Blog Agent and Landing Page Agent. `claude-sonnet-4-6`, named in
  an early request, isn't a real Anthropic model ID; corrected here.
- `ANTHROPIC_SALES_CHAT_MODEL` (optional, defaults to `claude-sonnet-5-5`)
  — the chat widget (**Spotket AI**, bottom-right on every public page)
  uses this instead of `ANTHROPIC_CHAT_MODEL`, so it can run a better
  (pricier) model than the blog/landing-page cron agents without
  upgrading those too. `claude-sonnet-4-6`, named in the request for this
  widget, isn't real either — same correction.

### 3. Lead alert email (replaces Twilio/SMS — removed 2026-10-20)

- `ALERT_EMAIL` — every captured lead (contact form, lead/exit-intent
  popups, the Spotket AI chat widget) sends an email here instead of a
  text message. Set to `spotketllc@gmail.com` for both Production and
  Preview via Vercel CLI (not committed anywhere in this repo — same
  not-a-secret-but-not-public treatment as the other env vars here). No
  SMS, no Twilio dependency anywhere in this repo anymore. No-ops (logs
  and skips) if unset, same resilience pattern as everything else here.

### 4. SMTP (follow-up + confirmation emails)

Live-tested 2026-10-20: `SMTP_USER`/`SMTP_PASSWORD` were already set (same
100-day-old leftover as Supabase above), but `SMTP_HOST` defaulted to
`smtp.zoho.com` and the mail server rejected the login. Set `SMTP_HOST` to
`smtp.gmail.com` and `SMTP_PORT` to `587` — once that host was corrected,
Google's own error response confirmed these genuinely are Gmail
credentials, but the password itself is now invalid/expired:
`535-5.7.8 Username and Password not accepted` (Google's bad-credentials
error, not a wrong-host error). **You need to generate a fresh Gmail App
Password** (the Google account `SMTP_USER` is set to → Security → 2-Step
Verification → App Passwords) and update `SMTP_PASSWORD` in Vercel — the
host/port are already fixed and don't need touching again. If you'd rather
actually use Zoho as originally planned, set `SMTP_HOST=smtp.zoho.com`,
`SMTP_PORT=465`, and swap in real Zoho mailbox credentials instead.

Code is provider-agnostic — any standard SMTP account works, Zoho is just
the suggested default per the original request.

### 5. Stripe (payment links, Payment Tracker, Client Workspace)

- `STRIPE_SECRET_KEY` — without it, "Send Payment Link" (Payments tab,
  Client Workspace, lead-profile convert flow) returns a clear 502 instead
  of silently failing; no payment link is ever faked.
- `STRIPE_WEBHOOK_SECRET` (optional) — only needed if you add a Stripe
  webhook endpoint pointed at `/api/stripe/webhook` (Dashboard → Developers
  → Webhooks → listen for `checkout.session.completed`). Without it,
  payments created here still track as "pending" until you mark them paid
  by hand in the Payments tab — the webhook is what makes that automatic.

### 6. Lead Finder Agent source (RapidAPI Local Business Data)

Third revision of this agent's data source — see "Lead Finder Agent"
below for the full history (direct scraping was requested and rejected;
Google Places + Yelp came next; this RapidAPI product replaced both).

- `RAPIDAPI_KEY` — your RapidAPI account's key, subscribed to the "Local
  Business Data" API.
- `RAPIDAPI_HOST` — `local-business-data.p.rapidapi.com` (defaults to this
  if unset, but set it explicitly to match the product you're subscribed
  to).

Without `RAPIDAPI_KEY` set, the Lead Finder Agent cron logs "skipped" and
inserts nothing — no fake leads are ever generated.

`GOOGLE_PLACES_API_KEY` / `YELP_API_KEY`, if you set either while this
agent used those sources, are simply unused now — safe to leave set or
remove, nothing in this repo reads them anymore.

### Already set (done for you, not something you need to do)

- `ADMIN_DASHBOARD_PASSWORD` — set via Vercel CLI, value is the password
  given in the request. **Not committed anywhere in this repo.**
- `CRON_SECRET` — random value, set via Vercel CLI. Vercel automatically
  sends it as a Bearer token on every cron-triggered request; the 3 cron
  routes reject anything else with a 401.
- `SESSION_SECRET` — random value, set via Vercel CLI. Signs the admin
  login cookie (HMAC-SHA256) so it can't be forged.

## Agents

| Agent | Trigger | What it does |
|---|---|---|
| Sales Agent | **Spotket AI** chat widget, bottom-right on every public page (`/api/chat`) | Introduces itself as Spotket AI, asks about the visitor's business and what they need, qualifies them against a real pricing tier from `lib/site.ts`, collects name/business/phone/email, emails + saves + logs the lead |
| Blog Agent | Daily cron, 6am (`/api/cron/blog-agent`) | Generates 1 SEO blog post from the 5 given topics, publishes to `/blog/<slug>`, added to sitemap |
| Landing Page Agent | Weekly cron, Monday 6am (`/api/cron/landing-page-agent`) | Generates 3 pages (AI automation / chatbot / SEO, per business type) at `/lp/<slug>`, added to sitemap |
| Lead Follow-Up Agent | Daily cron, noon (`/api/cron/lead-follow-up-agent`) | Emails leads 24h+ old with no response, marks them followed-up |
| Email Campaign Agent | Daily cron, 1pm (`/api/cron/email-campaign-agent`) | Sends up to 100 AI-personalized campaign emails/day across every "sending" campaign, then 3-day no-reply follow-ups with whatever allowance is left |
| Lead Finder Agent | Daily cron, 7am (`/api/cron/lead-finder-agent`) | Searches RapidAPI's Local Business Data API across 10 service categories within 50mi of Laurel, MD 20723 for small/underserved businesses, inserts up to 20 new leads/day tagged **Auto-Found** |

Every agent checks `agent_settings` in Supabase before running — toggle any
of them off from `/admin` and it logs "skipped" instead of running, on its
very next scheduled trigger (toggling doesn't cancel the Vercel Cron
schedule itself, which isn't possible at runtime — it gates what the
handler actually does).

## Scoped down from the original request (read before assuming parity)

1. **Blog Agent / Landing Page Agent publish fully autonomously, no review
   step** — this was an explicit choice after being told the risk: an
   unattended daily cron publishing AI-written content straight to a live
   business site with nobody reading it first. If posts start drifting in
   quality, the fix is adding a `published` boolean and an approve button
   in `/admin` — not rebuilt here since autonomous was the chosen option.
2. **Outreach Agent (cold-email prospecting) was not built at all.** "Finds
   10 businesses with bad websites/low reviews" has no compliant data
   source wired up here (that likely means scraping Google Search/Maps
   results, which is a terms-of-service problem, not just a coding one),
   and fully autonomous, unreviewed cold email at volume risks spam
   complaints that get a sending domain blacklisted — which would also
   break deliverability for the real lead-follow-up emails this system
   sends. If you get a compliant B2B contact list from somewhere, this can
   be built as a draft-and-approve queue in `/admin` as a follow-up.

## CRM: Leads → Clients, Payments, Email Campaigns

`/admin` is a 6-tab CRM: Dashboard, Leads, Clients, Email Campaigns,
Payments, Agents.

- **Leads** — search/filter, per-call notes, CSV export (client-side, no
  extra route), a **Delete** button on each lead's profile, and a
  **Convert to Client** button (picks a plan, creates the `clients` row,
  marks the lead `Closed`) — blocked with a 409 if a client already
  exists with the same phone or email (see **Duplicate guard** below).
- **Clients** — click a row to open the **Client Workspace**: edit
  plan/payment/client status, send a Stripe payment link, **Delete** the
  client, and chat with a Claude-powered assistant scoped to that one
  client. Two chat commands actually execute (`send_payment_link`,
  `send_monthly_report` — real Stripe/SMTP calls); everything else
  ("build their website", "write blogs for them") is drafted as text in
  the reply, not deployed anywhere — there's no live website builder or
  per-client CMS connected here, and the assistant is told to say so
  rather than pretend. Deleting a client cascades its `payments` and
  `client_chat_messages` rows (DB-level `on delete cascade`); the lead it
  was converted from, if any, just loses the link (`lead_id` → null), it
  isn't deleted.
- **Duplicate guard** — both "Convert Lead to Client" and the (currently
  API-only, no UI form yet) "Add Client" endpoint check
  `findClientByPhoneOrEmail` first and return a 409 if a client already
  exists with the same phone or email, instead of silently creating a
  second row for the same business. This only guards client creation —
  nothing stops importing the same business twice as two separate
  *leads* (that's intentionally looser; leads are disposable prospects,
  clients are billing records).
- **Email Campaigns** — CSV import (`business_name, contact_name, email,
  website_url, notes` header row; no quoted-comma support — keep fields
  comma-free), one AI-personalized email per recipient via
  `lib/email-campaign.ts`, a 100/day send cap shared with the cron agent
  above, and a 1x1 tracking pixel (`/api/email/track/[id]`, public route)
  for opens. **"Replies" are never actually detected** — there's no
  inbound-email webhook wired up, so a recipient only becomes `replied` if
  someone manually marks it that way; the 3-day follow-up really means
  "3 days since sent and nobody marked this replied," the same honest
  proxy the Lead Follow-Up Agent already uses for `contacted`. Only ever
  email CSV lists you already own — nothing here scrapes contacts (see
  "Scoped down," point 2 above, which still holds for prospecting).
- **Payments** — every Stripe Payment Link created anywhere in `/admin`
  lands here (`payments` table) with status `pending` until marked `paid`
  (by the Stripe webhook if configured, or by hand). MRR on the Dashboard
  sums `clients.monthly_amount` for `status = 'active'`, independent of
  whether that client's latest payment actually cleared.
- **Chatbot activity / reviews generated this month** (per client) are
  **not tracked** — the Client Workspace says so outright rather than
  showing a fabricated number. The AI chatbot/review automation Spotket
  sells runs on each *client's own* site, not inside this admin's
  database; wiring that up would mean every client deployment reporting
  activity back here, which doesn't exist yet.

## Lead Finder Agent: read before trusting its output

**Data source history, in order:** (1) direct scraping of Google Maps,
Yelp, and Yellow Pages was requested first and rejected — all three
explicitly prohibit automated scraping in their Terms of Service, have
active bot-detection that breaks naive scraping within days, and running
it as a *daily, scheduled, unattended* job is the sustained-automated-
access pattern these platforms actively enforce against, not a one-off
manual pull. (2) Google Places API (New) + Yelp Fusion — each platform's
own sanctioned API — replaced that. (3) **RapidAPI's "Local Business
Data" API, the current source**, replaced both of those at your request.
`lib/rapidapi-local-business.ts` calls that one documented REST endpoint;
nothing in this repo scrapes google.com/yelp.com/yellowpages.com HTML.

**Worth being clear-eyed about:** RapidAPI's Local Business Data is a
*third-party vendor's* product, not Google's or Yelp's own API. We
haven't audited how that vendor sources the data on their end — that's a
vendor relationship the business already holds (`RAPIDAPI_KEY` was
already configured before this was built), not something assessed here.
Calling a documented, API-key-authenticated endpoint is categorically
different from writing our own scraper against a target site, which is
why this was built without the same objection — but it's a different kind
of trust (in the vendor's own compliance), not zero risk.

**The field mapping was written from documentation/memory, not verified
against a live call** — there's no network access to RapidAPI from where
this was built. `lib/rapidapi-local-business.ts` reads several plausible
field-name variants defensively (e.g. `review_count` or `reviews_count`
or `reviews`) and logs the *full* raw response on anything that doesn't
look like the expected shape, specifically so a mismatch is loud and
debuggable instead of silently returning zero results forever. **After
your first real run** (wait for 7am, or manually `curl` the cron route
with the right `Authorization: Bearer $CRON_SECRET` header), check this
agent's activity log in `/admin` → Agents. If it logs a shape/field
warning, send the actual logged response back so the field names can be
corrected against real data.

- **The 50-mile radius isn't a hard guarantee.** This API takes a map
  `zoom` level, not a radius in miles, as its area hint — zoom 9 here is
  an approximation of a wide viewport, not a precise 50-mile circle. We
  don't trust that approximation either way: every result is re-filtered
  by real haversine distance against the true 50-mile cutoff before it's
  considered, so nothing outside 50mi is ever inserted, but coverage
  toward the edge of that radius depends on how the underlying zoom-based
  search actually behaves, which hasn't been verified live.
- **"No website or basic/outdated website"** — assumed this API returns a
  `website` field the same way Google Places' did; if it doesn't, every
  result would get wrongly treated as "has no website" and the targeting
  would be too loose. Same honesty gap as the Google Places version for
  what "basic" means: a Facebook/Instagram page or known free site-builder
  subdomain (Wix, Weebly, GoDaddy Sites, Square, Linktree) — see
  `BASIC_WEBSITE_HOSTS` in `lib/lead-finder-shared.ts` — not an actual
  design-quality judgment; a real, custom-domain site that looks dated to
  a human won't be flagged.
- **Leads with no phone number are skipped entirely** — the whole Leads
  CRM workflow (call, mark Called/Interested, convert) is phone-first.
- **No email is ever set** on these leads — this API doesn't return one
  either. They're meant to be called, not emailed; `email` stays null
  until/unless someone adds it by hand.
- **Dedup has two layers.** Exact: each inserted lead stores
  `rapidapi_business_id`; the agent skips anything already in `leads` by
  that id. Looser backstop: phone number (normalized to digits) — catches
  the case where this vendor assigns a different id to what's actually
  the same business. The `google_place_id`/`yelp_business_id` columns from
  this agent's earlier two sources are still in the schema (so any leads
  already inserted under those sources keep their original dedup key),
  but nothing writes to them anymore.
- **Categories are free-text queries, not a formal category taxonomy** —
  every category searches as `"<category> near Laurel, MD"` rather than
  a type/category filter, since several of the requested categories
  (HVAC, pressure washing, moving, auto detailing) are unlikely to map
  cleanly onto whatever fixed category list this API has, if it has one
  at all — this wasn't verified either.

## Honesty notes in the code

- The Lead Follow-Up Agent's "no response after 24 hours" check is really
  "lead isn't marked `contacted` after 24 hours" — there's no real inbound
  reply tracking. `contacted` would need to be set by whoever answers a
  lead (e.g. a future admin-dashboard button), so it is currently always
  `false` until something sets it, meaning every lead gets exactly one
  follow-up unless disabled. Also note: this cron runs once daily (noon) —
  Vercel's Hobby plan only allows daily cron schedules, not hourly — so in
  practice the follow-up goes out sometime between 24h and 48h after
  capture, not within an hour of hitting the 24h mark.
