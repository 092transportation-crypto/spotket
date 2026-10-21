-- Run this once in the Supabase SQL editor for a brand-new project.
-- Powers the Spotket agent system: admin dashboard, sales chat agent,
-- blog agent, landing-page agent, lead follow-up agent.

create extension if not exists pgcrypto;

create table if not exists agent_settings (
  agent_name text primary key,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  business_name text,
  phone text,
  email text,
  recommended_package text,
  source text not null default 'sales_agent',
  contacted boolean not null default false,
  followed_up boolean not null default false,
  created_at timestamptz not null default now()
);

-- Added for the detailed contact/inquiry form (safe to re-run against a
-- leads table created by an earlier version of this schema).
alter table leads add column if not exists business_type text;
alter table leads add column if not exists website_url text;
alter table leads add column if not exists revenue_range text;
alter table leads add column if not exists biggest_challenge text;
alter table leads add column if not exists heard_about_us text;
alter table leads add column if not exists message text;

-- Added for the admin leads dashboard (call status + per-call notes).
alter table leads add column if not exists status text not null default 'New';
alter table leads add column if not exists notes text;

-- Added for the Lead Finder Agent. Nullable + partial unique index — only
-- rows the agent inserts ever set this, and it's the exact dedup key used
-- to skip businesses already in the table on every run. A phone-number
-- index backs a looser secondary dedup check.
--
-- google_place_id/yelp_business_id are leftover from this agent's first
-- two data sources (Google Places, then Yelp Fusion), since replaced by
-- RapidAPI's Local Business Data API — kept here only so any leads
-- already inserted under those sources keep their dedup key; nothing
-- writes to these two columns anymore.
alter table leads add column if not exists google_place_id text;
alter table leads add column if not exists yelp_business_id text;
alter table leads add column if not exists rapidapi_business_id text;
create unique index if not exists leads_google_place_id_idx on leads (google_place_id) where google_place_id is not null;
create unique index if not exists leads_yelp_business_id_idx on leads (yelp_business_id) where yelp_business_id is not null;
create unique index if not exists leads_rapidapi_business_id_idx on leads (rapidapi_business_id) where rapidapi_business_id is not null;
create index if not exists leads_phone_idx on leads (phone) where phone is not null;

create table if not exists agent_activity_log (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  message text not null,
  level text not null default 'info',
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  topic text,
  published_at timestamptz not null default now()
);

create table if not exists landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  business_type text not null,
  page_type text not null,
  title text not null,
  content text not null,
  published_at timestamptz not null default now()
);

-- CRM: clients, payments, email campaigns, per-client AI workspace chat.
-- Added for the full Spotket CRM (dashboard, clients, payment tracker,
-- email campaigns) — see docs/agent-system.md.

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  name text,
  business_name text,
  phone text,
  email text,
  website_url text,
  plan text not null default 'Starter',
  monthly_amount numeric not null default 0,
  payment_status text not null default 'pending', -- paid | pending | overdue
  status text not null default 'active', -- active | paused | cancelled
  start_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  plan text not null,
  amount numeric not null,
  stripe_payment_link_id text,
  stripe_payment_link_url text,
  status text not null default 'pending', -- pending | paid | overdue
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists email_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'draft', -- draft | sending | done
  total_recipients int not null default 0,
  sent_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists email_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references email_campaigns(id) on delete cascade,
  business_name text,
  contact_name text,
  email text not null,
  website_url text,
  notes text,
  subject text,
  body text,
  status text not null default 'queued', -- queued | sent | opened | replied | bounced | failed
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  follow_up_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists client_chat_messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  role text not null, -- user | assistant
  content text not null,
  created_at timestamptz not null default now()
);

insert into agent_settings (agent_name, enabled) values
  ('sales_agent', true),
  ('blog_agent', true),
  ('landing_page_agent', true),
  ('lead_follow_up_agent', true),
  ('email_campaign_agent', true),
  ('lead_finder_agent', true)
on conflict (agent_name) do nothing;

create index if not exists leads_follow_up_idx on leads (created_at) where followed_up = false and contacted = false;
create index if not exists agent_activity_log_created_idx on agent_activity_log (created_at desc);
create index if not exists blog_posts_published_idx on blog_posts (published_at desc);
create index if not exists landing_pages_published_idx on landing_pages (published_at desc);
create index if not exists clients_status_idx on clients (status);
create index if not exists payments_status_idx on payments (status);
create index if not exists payments_created_idx on payments (created_at desc);
create index if not exists email_recipients_campaign_idx on email_recipients (campaign_id);
create index if not exists email_recipients_follow_up_idx on email_recipients (sent_at) where status = 'sent' and follow_up_sent = false;
create index if not exists client_chat_messages_client_idx on client_chat_messages (client_id, created_at);
