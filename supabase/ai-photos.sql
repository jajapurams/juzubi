-- "Generate Product Photos" — AI image generation feature
-- Run this in the Supabase SQL Editor (project juzubi). Safe to re-run.

create extension if not exists pgcrypto;

-- The uploaded source product image + the attributes extracted from it.
create table if not exists public.ai_source_products (
  id uuid primary key default gen_random_uuid(),
  user_id text,                                   -- content user label (single-tenant: 'content')
  image_url text not null,                        -- source image (Vercel Blob)
  product_type text,
  metadata jsonb not null default '{}'::jsonb,    -- colors, fabric, embroidery, neck, sleeves, ...
  created_at timestamptz not null default now()
);

-- One generation run (a batch of requested outputs).
create table if not exists public.ai_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.ai_source_products(id) on delete cascade,
  status text not null default 'pending',         -- pending | processing | completed | partial | failed
  provider text not null,
  progress int not null default 0,                -- 0..100
  total int not null default 0,                   -- images requested
  completed int not null default 0,               -- images attempted (done or failed)
  options jsonb not null default '{}'::jsonb,
  cost_cents int not null default 0,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One generated (or to-be-generated) output image.
create table if not exists public.ai_generated_images (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.ai_source_products(id) on delete cascade,
  job_id uuid not null references public.ai_generation_jobs(id) on delete cascade,
  type text not null,                             -- catalog | model | lifestyle
  subtype text not null,                          -- front | back | model:indian-adult-female | lifestyle:wedding ...
  label text not null,
  prompt text not null,
  image_url text,                                 -- null until generated
  status text not null default 'pending',         -- pending | done | failed
  provider text not null,
  cost_cents int not null default 0,
  favorite boolean not null default false,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists ai_images_source_idx on public.ai_generated_images(source_id);
create index if not exists ai_images_job_idx on public.ai_generated_images(job_id);
create index if not exists ai_jobs_source_idx on public.ai_generation_jobs(source_id);

-- Server-only access: enable RLS with no anon policies. The service-role key
-- (used by the API routes) bypasses RLS; the public/anon key gets nothing.
alter table public.ai_source_products enable row level security;
alter table public.ai_generation_jobs enable row level security;
alter table public.ai_generated_images enable row level security;
