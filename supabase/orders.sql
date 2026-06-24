-- Orders for juzubi online checkout (run in Supabase SQL Editor).
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  stripe_payment_intent text unique,
  amount                integer not null,            -- total in cents
  currency              text not null default 'usd',
  email                 text,
  customer_name         text,
  address               jsonb,
  product_slugs         text[] not null default '{}',
  status                text not null default 'paid',
  created_at            timestamptz not null default now()
);
alter table public.orders enable row level security;
-- No public policies: orders are written and read only with the secret
-- (service_role) key on the server. Browser clients cannot read orders.
