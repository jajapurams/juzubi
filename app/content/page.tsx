import Link from "next/link";
import { requireContent } from "@/lib/content-auth";
import { createClient } from "@/lib/supabase/server";
import { usd } from "@/lib/site";
import { deleteProduct } from "./actions";
import ConfirmButton from "@/components/ConfirmButton";
import SmartImage from "@/components/SmartImage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Catalog — Juzubi Content Manager" };

type Row = {
  id: string; slug: string; name: string; brand: string; category: string;
  price: number; mrp: number | null; in_stock: boolean; image: string;
};

export default async function ContentCatalog() {
  await requireContent();
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
  const products = (data ?? []) as Row[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Product Catalog</h1>
          <p className="mt-1 text-sm text-neutral-500">{products.length} products · changes go live immediately</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/content/inventory" className="rounded-full border border-brand bg-brand/5 px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand/10">
            📊 Restock planner
          </Link>
          <Link href="/content/media" className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-neutral-100">
            Media library
          </Link>
          <Link href="/content/products/new" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            + Add product
          </Link>
        </div>
      </div>

      <p className="mt-4 rounded-md bg-amber-50 px-4 py-2 text-xs text-amber-800">
        Saving (add / edit / delete) requires a valid <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel. Viewing works without it.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <SmartImage src={p.image} alt={p.name} className="h-12 w-10 shrink-0 rounded object-cover" />
                    <div>
                      <div className="font-medium text-ink">{p.name}</div>
                      <div className="text-xs text-neutral-500">{p.brand} · {p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-neutral-600">{p.category}</td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {usd(p.price)}
                  {p.mrp && p.mrp > p.price ? <span className="ml-1 text-xs text-neutral-400 line-through">{usd(p.mrp)}</span> : null}
                </td>
                <td className="px-4 py-3">
                  {p.in_stock ? <span className="text-green-700">In stock</span> : <span className="text-neutral-400">Hidden</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/content/products/${p.id}/edit`} className="font-medium text-brand hover:underline">Edit</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton message={`Delete "${p.name}"? This cannot be undone.`} className="font-medium text-sale hover:underline">
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
