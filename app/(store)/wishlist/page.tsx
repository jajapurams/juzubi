import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllProducts } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "My List — Juzubi" };

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows } = await supabase.from("wishlists").select("product_slug").eq("user_id", user.id);
  const savedSlugs = new Set((rows ?? []).map((r) => r.product_slug as string));
  const products = (await getAllProducts()).filter((p) => savedSlugs.has(p.slug));

  return (
    <div>
      <div className="border-b border-neutral-200 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <nav className="mb-2 text-xs text-neutral-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">My List</span>
          </nav>
          <h1 className="font-display text-4xl font-extrabold text-ink">My List</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {products.length} saved {products.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-neutral-600">Your list is empty. Tap the heart on any product to save it here.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Start shopping
          </Link>
        </div>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} wishlistSaved />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
