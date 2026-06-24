-- Per-product subcategories (multi) + available sizes. Run once in the Supabase SQL Editor.
alter table public.products add column if not exists subcategories text[] not null default '{}';
alter table public.products add column if not exists sizes text[] not null default '{}';
