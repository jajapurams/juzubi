-- Per-product shipping weight in ounces (used for live USPS rates at checkout).
-- Null = fall back to a per-category default weight. Run once in the SQL Editor.
alter table public.products add column if not exists weight_oz numeric;
