-- Spotket schema — run in the Supabase SQL editor.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE where possible.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  items jsonb not null,
  total numeric not null,
  status text not null default 'paid',
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own orders" on public.orders;
create policy "Users insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  quantity int not null default 1,
  created_at timestamptz not null default now()
);

alter table public.cart enable row level security;

drop policy if exists "Users manage own cart" on public.cart;
create policy "Users manage own cart"
  on public.cart for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);
create index if not exists cart_user_id_idx on public.cart (user_id);

-- Product catalog, managed from /admin. Public read; writes go through the
-- service role (admin API routes), so no anon write policies exist.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric not null,
  compare_at_price numeric,
  description text not null default '',
  features jsonb not null default '[]',
  image text,
  images jsonb not null default '[]',
  variants jsonb,
  rating numeric not null default 0,
  review_count int not null default 0,
  reviews jsonb,
  stock int not null default 10,
  shipping jsonb,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  deal boolean not null default false,
  trending boolean not null default false,
  date_added date default now(),
  created_at timestamptz not null default now()
);

-- Self-heal older/minimal versions of the products table: add any missing
-- columns and make sure the uuid primary key self-generates. Safe to re-run.
alter table public.products alter column id set default gen_random_uuid();
alter table public.products add column if not exists compare_at_price numeric;
alter table public.products add column if not exists description text not null default '';
alter table public.products add column if not exists features jsonb not null default '[]';
alter table public.products add column if not exists image text;
alter table public.products add column if not exists images jsonb not null default '[]';
alter table public.products add column if not exists variants jsonb;
alter table public.products add column if not exists rating numeric not null default 0;
alter table public.products add column if not exists review_count int not null default 0;
alter table public.products add column if not exists reviews jsonb;
alter table public.products add column if not exists stock int not null default 10;
alter table public.products add column if not exists shipping jsonb;
alter table public.products add column if not exists best_seller boolean not null default false;
alter table public.products add column if not exists new_arrival boolean not null default false;
alter table public.products add column if not exists deal boolean not null default false;
alter table public.products add column if not exists trending boolean not null default false;
alter table public.products add column if not exists date_added date default now();
alter table public.products add column if not exists aliexpress_url text;
alter table public.products add column if not exists sold_count int;

alter table public.products enable row level security;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
  on public.products for select
  using (true);

-- Customer reviews. Public read; writes go through the /api/reviews route
-- (service role) so verified-purchase status can't be forged.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  rating int not null check (rating between 1 and 5),
  title text not null default '',
  body text not null,
  name text not null,
  verified_purchase boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
  on public.reviews for select
  using (true);

create index if not exists reviews_product_id_created_at_idx
  on public.reviews (product_id, created_at desc);

-- Newsletter signups (service-role writes via /api/newsletter).
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
