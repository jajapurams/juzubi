"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type CartItem = { slug: string; name: string; price: number; image?: string; size?: string };

type Ctx = {
  items: CartItem[];
  add: (i: CartItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  count: number;
  subtotal: number;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "juzubi-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch {
        /* ignore */
      }
    }
  }, [items, loaded]);

  // one-of-a-kind: each product can be in the cart at most once
  const add = useCallback((i: CartItem) => setItems((p) => (p.some((x) => x.slug === i.slug) ? p : [...p, i])), []);
  const remove = useCallback((slug: string) => setItems((p) => p.filter((x) => x.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((slug: string) => items.some((x) => x.slug === slug), [items]);

  const count = items.length;
  const subtotal = items.reduce((s, x) => s + x.price, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, has, count, subtotal }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
