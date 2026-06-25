import Link from "next/link";
import { requireContent } from "@/lib/content-auth";
import { createClient } from "@/lib/supabase/server";
import { categoryName, usd } from "@/lib/site";
import ExportInventoryButton from "@/components/ExportInventoryButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Restock Planner — Juzubi Content Manager" };

type Row = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategories: string[] | null;
  price: number;
  mrp: number | null;
  in_stock: boolean;
  sizes: string[] | null;
};

type Agg = { available: number; sold: number; total: number; value: number };
const LOW = 2; // a category/subcategory at or below this many available = reorder

function bump(a: Agg | undefined, p: Row): Agg {
  const g = a ?? { available: 0, sold: 0, total: 0, value: 0 };
  g.total++;
  if (p.in_stock) {
    g.available++;
    g.value += Number(p.price) || 0;
  } else {
    g.sold++;
  }
  return g;
}

const pct = (g: Agg) => (g.total ? Math.round((g.sold / g.total) * 100) : 0);

export default async function InventoryPage() {
  await requireContent();
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id,name,slug,category,subcategories,price,mrp,in_stock,sizes")
    .order("category", { ascending: true });
  const products = (data ?? []) as Row[];

  const catAgg = new Map<string, Agg>();
  const subAgg = new Map<string, Map<string, Agg>>();
  for (const p of products) {
    catAgg.set(p.category, bump(catAgg.get(p.category), p));
    const subs = p.subcategories && p.subcategories.length ? p.subcategories : ["(unspecified)"];
    const m = subAgg.get(p.category) ?? new Map<string, Agg>();
    for (const s of subs) m.set(s, bump(m.get(s), p));
    subAgg.set(p.category, m);
  }

  const totalItems = products.length;
  const available = products.filter((p) => p.in_stock).length;
  const sold = totalItems - available;
  const value = products.filter((p) => p.in_stock).reduce((s, p) => s + (Number(p.price) || 0), 0);

  // Reorder suggestions: sold-out first, then low stock (ranked by units sold).
  type Sug = { category: string; sub: string; g: Agg; reason: "Sold out" | "Low stock"; urgency: number };
  const sugs: Sug[] = [];
  for (const [cat, m] of subAgg) {
    for (const [sub, g] of m) {
      if (g.available === 0 && g.total > 0) sugs.push({ category: cat, sub, g, reason: "Sold out", urgency: 2 });
      else if (g.available <= LOW) sugs.push({ category: cat, sub, g, reason: "Low stock", urgency: 1 });
    }
  }
  sugs.sort((a, b) => b.urgency - a.urgency || b.g.sold - a.g.sold);

  // CSV: planning sheet (category × subcategory) + full product list.
  const breakdownRows: (string | number)[][] = [];
  for (const [cat, m] of subAgg)
    for (const [sub, g] of m) breakdownRows.push([categoryName(cat), sub, g.available, g.sold, g.total, pct(g)]);
  const productRows = products.map((p) => [
    p.name,
    categoryName(p.category),
    (p.subcategories || []).join("; "),
    p.price,
    p.mrp ?? "",
    p.in_stock ? "Available" : "Sold",
    (p.sizes || []).join("; "),
    p.slug,
  ]);

  const stat = (label: string, v: string | number, tone = "text-ink") => (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tone}`}>{v}</div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Restock Planner</h1>
          <p className="mt-1 text-sm text-neutral-500">What&apos;s selling, what&apos;s low, and what to reorder — by category.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportInventoryButton
            headers={["Category", "Subcategory", "Available", "Sold", "Total", "Sell-through %"]}
            rows={breakdownRows}
            filename={`juzubi-restock-${new Date().toISOString().slice(0, 10)}.csv`}
            label="⬇ Export planning sheet"
          />
          <ExportInventoryButton
            headers={["Name", "Category", "Subcategories", "Price (USD)", "MRP (USD)", "Status", "Available Sizes", "Slug"]}
            rows={productRows}
            filename={`juzubi-products-${new Date().toISOString().slice(0, 10)}.csv`}
            label="⬇ Export product list"
          />
          <Link href="/content" className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-neutral-100">
            ← Catalog
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stat("Total items", totalItems)}
        {stat("Available", available, "text-green-700")}
        {stat("Sold", sold, "text-sale")}
        {stat("In-stock value", usd(value))}
      </div>

      {/* Suggested reorders */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-display text-lg font-bold text-ink">🔴 Suggested reorders</h2>
        {sugs.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">Your stock looks healthy — nothing urgent to reorder.</p>
        ) : (
          <ul className="mt-3 divide-y divide-amber-200/70">
            {sugs.slice(0, 30).map((s, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="font-medium text-ink">
                  {categoryName(s.category)} <span className="text-neutral-400">›</span> {s.sub}
                </span>
                <span className="flex items-center gap-3 text-neutral-600">
                  <span>{s.g.available} left</span>
                  <span>{s.g.sold} sold</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.reason === "Sold out" ? "bg-sale/10 text-sale" : "bg-amber-200/60 text-amber-800"}`}>
                    {s.reason}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Breakdown by category */}
      <div className="mt-6 space-y-6">
        {[...catAgg.entries()].map(([cat, cg]) => {
          const subs = [...(subAgg.get(cat) ?? new Map()).entries()].sort((a, b) => a[1].available - b[1].available);
          return (
            <div key={cat} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
                <h3 className="font-display text-base font-bold text-ink">{categoryName(cat)}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-700">{cg.available} available</span>
                  <span className="text-sale">{cg.sold} sold</span>
                  <span className="text-neutral-500">{pct(cg)}% sell-through</span>
                  {cg.available <= LOW && <span className="rounded-full bg-amber-200/60 px-2 py-0.5 text-xs font-semibold text-amber-800">Reorder</span>}
                </div>
              </div>
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-4 py-2">Subcategory</th>
                    <th className="px-4 py-2 text-right">Available</th>
                    <th className="px-4 py-2 text-right">Sold</th>
                    <th className="px-4 py-2 text-right">Sell-through</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map(([sub, g]) => (
                    <tr key={sub} className="border-t border-neutral-100">
                      <td className="px-4 py-2 text-ink">
                        {sub}
                        {g.available === 0 && g.total > 0 && <span className="ml-2 text-xs font-semibold text-sale">sold out</span>}
                        {g.available > 0 && g.available <= LOW && <span className="ml-2 text-xs font-semibold text-amber-700">low</span>}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-ink">{g.available}</td>
                      <td className="px-4 py-2 text-right text-neutral-600">{g.sold}</td>
                      <td className="px-4 py-2 text-right text-neutral-600">{pct(g)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">No products yet.</p>
        )}
      </div>
    </div>
  );
}
