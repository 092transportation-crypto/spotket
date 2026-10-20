# Spotket agent system

An admin dashboard at `/admin` plus 4 automated agents. Two things from the
original spec were deliberately scoped differently — see **Scoped down**
below before assuming anything matches the request verbatim.

## What's live today vs. what needs your setup

Everything in this repo is already committed and deployable — the whole
system runs in a safe "not configured yet" mode (chat gives a polite
fallback reply, cron jobs log "skipped," nothing crashes) until you add the
real credentials below as Vercel env vars (Production **and** Preview).

### 1. Supabase (new project)

Create a project at supabase.com, open its SQL editor, and run the entire
contents of `supabase-schema.sql` in this repo once. Then from Project
Settings → API, set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (the **service_role** key, not the anon key —
  this server-side code needs to bypass RLS to read/write `leads`,
  `activity_log`, `blog_posts`, `landing_pages`, `agent_settings`)

### 2. Anthropic (Claude API)

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_CHAT_MODEL` (optional, defaults to `claude-haiku-5-5` — the
  model name in the original request, `claude-sonnet-4-6`, isn't a real
  Anthropic model ID, so this was corrected; set this var to
  `claude-sonnet-5-5` if you want higher-quality, slower, pricier replies)

### 3. Twilio (SMS alerts)

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (your Twilio number)
- `ALERT_PHONE_NUMBER` (the phone that gets a text on every captured lead)

### 4. SMTP (follow-up emails — Zoho suggested)

- `SMTP_HOST` (e.g. `smtp.zoho.com`)
- `SMTP_PORT` (`465`)
- `SMTP_USER` / `SMTP_PASSWORD` (your Zoho mailbox + its app-specific
  password, if 2FA is on)

Code is provider-agnostic — any standard SMTP account works, Zoho is just
the suggested default per the original request.

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
| Lead Follow-Up Agent | Hourly cron (`/api/cron/lead-follow-up-agent`) | Emails leads 24h+ old with no response, marks them followed-up |

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

## Honesty notes in the code

- The Lead Follow-Up Agent's "no response after 24 hours" check is really
  "lead isn't marked `contacted` after 24 hours" — there's no real inbound
  reply tracking. `contacted` would need to be set by whoever answers a
  lead (e.g. a future admin-dashboard button), so it is currently always
  `false` until something sets it, meaning every lead gets exactly one
  follow-up 24h after capture unless disabled.
