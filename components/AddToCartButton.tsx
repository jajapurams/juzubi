"use client";

import { useCart, type CartItem } from "@/lib/cart";
import { PURCHASING_ENABLED } from "@/lib/site";

export default function AddToCartButton({ item, className }: { item: CartItem; className?: string }) {
  const { add, has } = useCart();
  const inCart = has(item.slug);

  // Pre-launch: online purchasing is off — show a disabled "Coming soon" button.
  if (!PURCHASING_ENABLED) {
    return (
      <button type="button" disabled className={className} aria-label="Coming soon">
        Coming soon
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(item)}
      disabled={inCart}
      className={className}
      aria-label={inCart ? "In cart" : "Add to cart"}
    >
      {inCart ? "In cart ✓" : "Add to cart"}
    </button>
  );
}
