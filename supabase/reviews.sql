-- Customer product reviews. Run once in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  author text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);
create index if not exists reviews_slug_idx on public.reviews(product_slug);

alter table public.reviews enable row level security;

-- Anyone can read reviews.
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select using (true);

-- Anyone can submit a review (with light validation).
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert
  with check (char_length(author) between 1 and 80 and char_length(comment) between 1 and 2000 and rating between 1 and 5);
