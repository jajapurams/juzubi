"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { BagIcon } from "./icons";

export default function CartIcon() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-ink hover:text-brand">
      <span className="relative">
        <BagIcon className="h-6 w-6" />
        {count > 0 && (
          <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
            {count}
          </span>
        )}
      </span>
      Cart
    </Link>
  );
}
