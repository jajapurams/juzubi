import Link from "next/link";
import { type Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  title,
  subtitle,
  viewAllHref,
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {title && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="shrink-0 text-sm font-semibold text-brand hover:underline">
              View all →
            </Link>
          )}
        </div>
      )}
      {products.length === 0 ? (
        <p className="py-10 text-center text-neutral-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
