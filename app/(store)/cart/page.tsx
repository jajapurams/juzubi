"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { usd } from "@/lib/site";
import SmartImage from "@/components/SmartImage";

export default function CartPage() {
  const { items, remove, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-ink">Your Cart</h1>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-neutral-600">Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
              {items.map((it) => (
                <li key={it.slug} className="flex items-center gap-4 p-4">
                  <Link href={`/product/${it.slug}`} className="shrink-0">
                    <SmartImage src={it.image} alt={it.name} className="h-20 w-16 rounded object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${it.slug}`} className="line-clamp-2 text-sm font-medium text-ink hover:text-brand">
                      {it.name}
                    </Link>
                    {it.size && <p className="mt-0.5 text-xs font-medium text-ink">Size: {it.size}</p>}
                    <p className="mt-1 text-xs text-neutral-500">Qty 1 · one-of-a-kind</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">{usd(it.price)}</p>
                    <button onClick={() => remove(it.slug)} className="mt-1 text-xs font-medium text-sale hover:underline">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Order summary</h2>
            <div className="mt-3 flex justify-between text-sm">
              <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
              <span className="font-semibold text-ink">{usd(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-neutral-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <Link
              href="/checkout"
              className="mt-5 block rounded-full bg-brand px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Proceed to checkout
            </Link>
            <Link href="/" className="mt-3 block text-center text-sm font-medium text-brand hover:underline">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
