"use client";

import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

// Logs the enquiry to Supabase (best-effort), then opens WhatsApp.
export default function EnquireButton({
  productSlug,
  productName,
  message,
  waHref,
  className,
  children,
}: {
  productSlug?: string;
  productName?: string;
  message: string;
  waHref: string;
  className?: string;
  children: ReactNode;
}) {
  async function handleClick() {
    try {
      const supabase = createClient();
      await supabase.from("enquiries").insert({
        product_slug: productSlug ?? null,
        product_name: productName ?? null,
        message,
      });
    } catch {
      // Never block the customer from reaching WhatsApp if logging fails.
    }
    window.open(waHref, "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
