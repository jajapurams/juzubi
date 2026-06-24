import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { discountPct } from "@/lib/products";
import { usd, SITE, categoryName } from "@/lib/site";
import Stars from "@/components/Stars";
import ProductGrid from "@/components/ProductGrid";
import ProductGallery from "@/components/ProductGallery";
import BuyBox from "@/components/BuyBox";
import Reviews from "@/components/Reviews";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found — Juzubi" };
  return { title: `${product.name} — Juzubi`, description: product.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const off = discountPct(product);
  const related = (await getProductsByCategory(product.category)).filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <nav className="text-xs text-neutral-500">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/category/${product.category}`} className="hover:text-brand">{categoryName(product.category)}</Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2">
        <ProductGallery images={[product.image, ...(product.images ?? [])]} alt={product.name} />

        <div>
          {product.brand && <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">{product.brand}</p>}
          <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">{product.name}</h1>
          <div className="mt-3"><Stars rating={product.rating} reviews={product.reviews} /></div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-sale">{usd(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="text-lg text-neutral-400 line-through">{usd(product.mrp)}</span>
                {off && <span className="rounded bg-sale/10 px-2 py-0.5 text-sm font-semibold text-sale">{off}% off</span>}
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-500">Inclusive of all taxes</p>

          <p className="mt-6 text-sm leading-relaxed text-neutral-700">{product.description}</p>

          <BuyBox
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={product.image}
            category={product.category}
            availableSizes={product.sizes}
          />

          <ul className="mt-6 space-y-1.5 text-sm text-neutral-600">
            <li>• Free shipping on orders over {usd(SITE.freeShipOver)}</li>
            <li>• 7-day easy exchange</li>
            <li>• Quality-checked & authentic</li>
          </ul>
        </div>
      </div>

      <Reviews slug={product.slug} />

      {related.length > 0 && (
        <ProductGrid title="You may also like" products={related} viewAllHref={`/category/${product.category}`} />
      )}
    </div>
  );
}
