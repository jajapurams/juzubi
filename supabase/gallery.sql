-- Add a gallery (multiple images / angles) per product. Run in Supabase SQL Editor.
alter table public.products
  add column if not exists images text[] not null default '{}';
