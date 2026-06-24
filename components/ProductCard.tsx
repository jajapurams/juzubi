import Link from "next/link";
import { type Product, discountPct } from "@/lib/products";
import { usd } from "@/lib/site";
import Stars from "./Stars";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";
import SmartImage from "./SmartImage";

export default function ProductCard({ product, wishlistSaved }: { product: Product; wishlistSaved?: boolean }) {
  const off = discountPct(product);

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden rounded-lg bg-cream">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <SmartImage
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-2 top-2 rounded bg-ink/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
        {off && (
          <span className="absolute right-2 top-2 rounded bg-sale px-2 py-1 text-[10px] font-bold text-white">
            {off}% OFF
          </span>
        )}
        <WishlistButton
          slug={product.slug}
          initialSaved={wishlistSaved}
          className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink shadow-sm hover:text-brand"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        {product.brand && <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">{product.brand}</p>}
        <Link href={`/product/${product.slug}`} className="mt-0.5 line-clamp-2 text-sm font-medium text-ink hover:text-brand">
          {product.name}
        </Link>
        <div className="mt-1.5">
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-sale">{usd(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-neutral-400 line-through">{usd(product.mrp)}</span>
          )}
        </div>
        <AddToCartButton
          item={{ slug: product.slug, name: product.name, price: product.price, image: product.image }}
          className="mt-3 rounded-full bg-brand py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:bg-neutral-300"
        />
      </div>
    </div>
  );
}
