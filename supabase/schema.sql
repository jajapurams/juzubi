-- ============================================================
-- Juzubi — database schema  (run this in Supabase SQL Editor)
-- Project: juzubi (separate from TallyMigo)
-- Covers: products, enquiries/orders, newsletter, customer profiles, wishlists
-- ============================================================

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  brand       text not null,
  category    text not null,              -- sarees | lehengas | kurtas | jewellery
  price       integer not null check (price >= 0),
  mrp         integer check (mrp >= 0),   -- null = not on sale
  rating      numeric(2,1) not null default 4.5,
  reviews     integer not null default 0,
  badge       text,
  description text not null default '',
  image       text not null default '',
  in_stock    boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (true);
-- writes (insert/update/delete) are intentionally NOT granted to anon/authenticated;
-- product admin happens server-side with the secret (service_role) key, which bypasses RLS.

-- ---------- ENQUIRIES / ORDERS ----------
create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete set null,
  product_slug   text,
  product_name   text,
  customer_name  text,
  customer_phone text,
  message        text,
  status         text not null default 'new',   -- new | contacted | closed
  created_at     timestamptz not null default now()
);
alter table public.enquiries enable row level security;
drop policy if exists "enquiries anyone insert" on public.enquiries;
create policy "enquiries anyone insert" on public.enquiries for insert with check (true);
drop policy if exists "enquiries read own" on public.enquiries;
create policy "enquiries read own" on public.enquiries for select using (auth.uid() = user_id);
-- staff read all via the service_role key (bypasses RLS).

-- ---------- NEWSLETTER ----------
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "newsletter anyone insert" on public.newsletter_subscribers;
create policy "newsletter anyone insert" on public.newsletter_subscribers for insert with check (true);

-- ---------- CUSTOMER PROFILES ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  phone      text not null default '',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);

-- auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', ''),
          coalesce(new.raw_user_meta_data->>'phone', ''))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- WISHLISTS (customer accounts) ----------
create table if not exists public.wishlists (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_slug text not null,
  created_at   timestamptz not null default now(),
  unique (user_id, product_slug)
);
alter table public.wishlists enable row level security;
drop policy if exists "wishlists manage own" on public.wishlists;
create policy "wishlists manage own" on public.wishlists for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- SEED: 16 starter products (safe to re-run; upserts by slug)
-- ============================================================
insert into public.products (slug, name, brand, category, price, mrp, rating, reviews, badge, description, image, sort_order) values
('banarasi-silk-saree','Banarasi Silk Saree with Zari Border','Juzubi Signature','sarees',4499,6999,4.7,128,'Bestseller','Handwoven Banarasi silk with intricate gold zari work and a contrast pallu. Comes with an unstitched blouse piece.','https://picsum.photos/seed/juzubi-saree-1/700/875',1),
('kanjivaram-pure-silk-saree','Kanjivaram Pure Silk Saree','Riwaaz','sarees',8999,11999,4.9,76,'Premium','Temple-border Kanjivaram in pure mulberry silk. A timeless drape for weddings and festivals.','https://picsum.photos/seed/juzubi-saree-2/700/875',2),
('organza-floral-saree','Organza Floral Print Saree','Anaya','sarees',2499,null,4.4,53,null,'Lightweight organza with delicate floral prints and a satin border. Easy, elegant and perfect for day events.','https://picsum.photos/seed/juzubi-saree-3/700/875',3),
('cotton-handloom-saree','Cotton Handloom Saree','Mulmul','sarees',1299,1799,4.3,211,'New','Breathable handloom cotton with a woven temple border. Your everyday-ethnic staple.','https://picsum.photos/seed/juzubi-saree-4/700/875',4),
('bridal-velvet-lehenga','Bridal Velvet Lehenga Set','Juzubi Couture','lehengas',24999,32999,4.8,41,'Bridal','Hand-embroidered velvet lehenga with zardozi work, matching blouse and net dupatta. Made to make the day unforgettable.','https://picsum.photos/seed/juzubi-lehenga-1/700/875',5),
('sequin-party-lehenga','Sequin Party Lehenga','Anaya','lehengas',7999,10999,4.6,64,null,'All-over sequin lehenga with a flared silhouette. The showstopper for sangeet and receptions.','https://picsum.photos/seed/juzubi-lehenga-2/700/875',6),
('festive-georgette-lehenga','Festive Georgette Lehenga','Riwaaz','lehengas',5499,null,4.5,88,'Bestseller','Flowy georgette lehenga with thread embroidery — festive-ready without the weight.','https://picsum.photos/seed/juzubi-lehenga-3/700/875',7),
('anarkali-kurta-set','Anarkali Kurta Set with Dupatta','Mulmul','kurtas',2999,3999,4.6,174,'Bestseller','Floor-length Anarkali with intricate yoke embroidery, churidar and a chiffon dupatta.','https://picsum.photos/seed/juzubi-kurta-1/700/875',8),
('chikankari-cotton-kurta','Chikankari Cotton Kurta','Anaya','kurtas',1499,null,4.5,309,'New','Authentic Lucknowi chikankari hand-embroidery on soft cotton. Cool, classic, everyday luxe.','https://picsum.photos/seed/juzubi-kurta-2/700/875',9),
('printed-straight-kurta','Printed Straight Kurta','Juzubi Everyday','kurtas',899,1299,4.2,421,null,'Easy straight-cut kurta in a contemporary print. A wardrobe workhorse at a friendly price.','https://picsum.photos/seed/juzubi-kurta-3/700/875',10),
('silk-kurta-palazzo','Silk Kurta with Palazzo Set','Riwaaz','kurtas',3499,4499,4.7,96,null,'Art-silk kurta paired with flowing palazzos and a dupatta — graceful for festive occasions.','https://picsum.photos/seed/juzubi-kurta-4/700/875',11),
('kundan-choker-set','Kundan Choker Necklace Set','Juzubi Jewels','jewellery',1999,2999,4.6,142,'Bestseller','Statement kundan choker with matching earrings and maang tikka. Bridal-grade sparkle.','https://picsum.photos/seed/juzubi-jewel-1/700/875',12),
('oxidised-jhumkas','Oxidised Silver Jhumkas','Anaya','jewellery',499,null,4.4,528,'New','Lightweight oxidised jhumkas with ghungroo drops — pair them with kurtas and sarees alike.','https://picsum.photos/seed/juzubi-jewel-2/700/875',13),
('temple-jewellery-set','Temple Jewellery Necklace Set','Riwaaz','jewellery',2799,3499,4.8,67,null,'South-Indian temple-style necklace and jhumkas in antique gold finish.','https://picsum.photos/seed/juzubi-jewel-3/700/875',14),
('embroidered-potli-bag','Embroidered Potli Bag','Juzubi Jewels','jewellery',799,1099,4.3,113,null,'Hand-embroidered potli with bead and zari detailing — the finishing touch for festive looks.','https://picsum.photos/seed/juzubi-jewel-4/700/875',15)
on conflict (slug) do update set
  name = excluded.name, brand = excluded.brand, category = excluded.category,
  price = excluded.price, mrp = excluded.mrp, rating = excluded.rating,
  reviews = excluded.reviews, badge = excluded.badge, description = excluded.description,
  image = excluded.image, sort_order = excluded.sort_order;
