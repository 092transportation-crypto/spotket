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

create table if not exists activity_log (
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

insert into agent_settings (agent_name, enabled) values
  ('sales_agent', true),
  ('blog_agent', true),
  ('landing_page_agent', true),
  ('lead_follow_up_agent', true)
on conflict (agent_name) do nothing;

create index if not exists leads_follow_up_idx on leads (created_at) where followed_up = false and contacted = false;
create index if not exists activity_log_created_idx on activity_log (created_at desc);
create index if not exists blog_posts_published_idx on blog_posts (published_at desc);
create index if not exists landing_pages_published_idx on landing_pages (published_at desc);
