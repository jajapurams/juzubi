import Link from "next/link";
import { searchProductsDb } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";

export const metadata = { title: "Search — Juzubi" };
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchProductsDb(query) : [];

  return (
    <div>
      <div className="border-b border-neutral-200 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <nav className="mb-2 text-xs text-neutral-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">Search</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-ink">
            {query ? <>Results for “{query}”</> : "Search"}
          </h1>
          {query && (
            <p className="mt-1 text-sm text-neutral-500">
              {results.length} {results.length === 1 ? "match" : "matches"}
            </p>
          )}
        </div>
      </div>

      {!query ? (
        <p className="mx-auto max-w-7xl px-4 py-16 text-center text-neutral-500">
          Type something in the search bar to find sarees, lehengas, kurtas and jewellery.
        </p>
      ) : results.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <p className="text-neutral-600">No matches for “{query}”.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Back to home
          </Link>
        </div>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  );
}
