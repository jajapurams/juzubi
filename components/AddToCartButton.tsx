"use client";

import { useCart, type CartItem } from "@/lib/cart";

export default function AddToCartButton({ item, className }: { item: CartItem; className?: string }) {
  const { add, has } = useCart();
  const inCart = has(item.slug);
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
