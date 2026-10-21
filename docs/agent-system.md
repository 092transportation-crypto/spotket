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

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_CHAT_MODEL` (optional, defaults to `claude-haiku-5-5` — the
  model name in the original request, `claude-sonnet-4-6`, isn't a real
  Anthropic model ID, so this was corrected; set this var to
  `claude-sonnet-5-5` if you want higher-quality, slower, pricier replies)

### 3. Lead alert email (replaces Twilio/SMS — removed 2026-10-20)

- `ALERT_EMAIL` — every captured lead (contact form, lead/exit-intent popups,
  sales chat) sends an email here instead of a text message. No SMS, no
  Twilio dependency anywhere in this repo anymore. No-ops (logs and skips)
  if unset, same resilience pattern as everything else here.

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
| Sales Agent | Chat widget (`/api/chat`) | Qualifies visitors, recommends a real pricing tier from `lib/site.ts`, collects name/business/phone/email, texts + saves + logs the lead |
| Blog Agent | Daily cron, 6am (`/api/cron/blog-agent`) | Generates 1 SEO blog post from the 5 given topics, publishes to `/blog/<slug>`, added to sitemap |
| Landing Page Agent | Weekly cron, Monday 6am (`/api/cron/landing-page-agent`) | Generates 3 pages (AI automation / chatbot / SEO, per business type) at `/lp/<slug>`, added to sitemap |
| Lead Follow-Up Agent | Daily cron, noon (`/api/cron/lead-follow-up-agent`) | Emails leads 24h+ old with no response, marks them followed-up |
| Email Campaign Agent | Daily cron, 1pm (`/api/cron/email-campaign-agent`) | Sends up to 100 AI-personalized campaign emails/day across every "sending" campaign, then 3-day no-reply follow-ups with whatever allowance is left |

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
  extra route), and a **Convert to Client** button on each lead's profile
  (picks a plan, creates the `clients` row, marks the lead `Closed`).
- **Clients** — click a row to open the **Client Workspace**: edit
  plan/payment/client status, send a Stripe payment link, and chat with a
  Claude-powered assistant scoped to that one client. Two chat commands
  actually execute (`send_payment_link`, `send_monthly_report` — real
  Stripe/SMTP calls); everything else ("build their website", "write
  blogs for them") is drafted as text in the reply, not deployed anywhere
  — there's no live website builder or per-client CMS connected here, and
  the assistant is told to say so rather than pretend.
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
