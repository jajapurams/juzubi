import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/products";

type Row = {
  id: string; slug: string; name: string; brand: string; category: string;
  price: number; mrp: number | null; rating: number | string; reviews: number;
  badge: string | null; description: string; image: string; images: string[] | null; sizes: string[] | null;
  subcategories: string[] | null;
};

// Temporary themed placeholders: any product image that is still a generic
// placeholder (or empty) is swapped for an India-fashion-boutique image.
// As soon as a real photo is uploaded in the content manager, that image wins.
const TAG_BY_CATEGORY: Record<string, string> = {
  sarees: "saree",
  lehengas: "lehenga",
  kurtas: "indian,fashion",
  jewellery: "indian,jewellery",
  men: "indian,man,fashion",
};

function slugLock(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 100000;
  return h || 1;
}

function isPlaceholder(img: string | null | undefined): boolean {
  return !img || img.includes("picsum.photos");
}

function themedImage(category: string, slug: string): string {
  const tag = TAG_BY_CATEGORY[category] ?? "indian,fashion,boutique";
  return `https://loremflickr.com/700/875/${tag}?lock=${slugLock(slug)}`;
}

function mapRow(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    price: r.price,
    mrp: r.mrp ?? undefined,
    rating: Number(r.rating),
    reviews: r.reviews,
    badge: r.badge ?? undefined,
    description: r.description,
    image: isPlaceholder(r.image) ? themedImage(r.category, r.slug) : r.image,
    images: Array.isArray(r.images) ? r.images.filter(Boolean) : [],
    sizes: Array.isArray(r.sizes) ? r.sizes.filter(Boolean) : [],
    subcategories: Array.isArray(r.subcategories) ? r.subcategories.filter(Boolean) : [],
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as Row[]).map(mapRow);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await getAllProducts();
  if (slug === "sale") return all.filter((p) => p.mrp && p.mrp > p.price);
  if (slug === "new") return all.filter((p) => !!p.badge); // new & trending = badged items
  if (slug === "women") return all; // current catalog is women's ethnic wear
  return all.filter((p) => p.category === slug); // sarees/lehengas/kurtas/jewellery/men
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  return data ? mapRow(data as Row) : null;
}

export async function searchProductsDb(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await getAllProducts();
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
