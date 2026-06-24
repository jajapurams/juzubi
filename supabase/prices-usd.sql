-- Convert juzubi product prices to USD (run in Supabase SQL Editor).
-- Juzubi is US-based, so prices are in dollars.
update public.products set price = 59,  mrp = 89   where slug = 'banarasi-silk-saree';
update public.products set price = 119, mrp = 159  where slug = 'kanjivaram-pure-silk-saree';
update public.products set price = 34,  mrp = null where slug = 'organza-floral-saree';
update public.products set price = 18,  mrp = 24   where slug = 'cotton-handloom-saree';
update public.products set price = 329, mrp = 429  where slug = 'bridal-velvet-lehenga';
update public.products set price = 109, mrp = 149  where slug = 'sequin-party-lehenga';
update public.products set price = 74,  mrp = null where slug = 'festive-georgette-lehenga';
update public.products set price = 42,  mrp = 55   where slug = 'anarkali-kurta-set';
update public.products set price = 22,  mrp = null where slug = 'chikankari-cotton-kurta';
update public.products set price = 14,  mrp = 19   where slug = 'printed-straight-kurta';
update public.products set price = 48,  mrp = 62   where slug = 'silk-kurta-palazzo';
update public.products set price = 29,  mrp = 44   where slug = 'kundan-choker-set';
update public.products set price = 9,   mrp = null where slug = 'oxidised-jhumkas';
update public.products set price = 39,  mrp = 49   where slug = 'temple-jewellery-set';
update public.products set price = 14,  mrp = 18   where slug = 'embroidered-potli-bag';
