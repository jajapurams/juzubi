"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import EnquireButton from "./EnquireButton";
import SizeChart from "./SizeChart";
import { WhatsAppIcon } from "./icons";
import { SITE, sizeKind, sizesFor, usd, waLink } from "@/lib/site";

// Purchase area: category-aware size picker + size chart, Add to cart, and
// WhatsApp order/question — all sharing the selected size. Sizes not in
// `availableSizes` are greyed out (sold). An empty list means every size is available.
export default function BuyBox({
  slug,
  name,
  price,
  image,
  category,
  availableSizes = [],
}: {
  slug: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  availableSizes?: string[];
}) {
  const kind = sizeKind(category);
  const sizes = sizesFor(category);
  const available = availableSizes.length ? availableSizes : sizes; // empty = all available
  const [size, setSize] = useState("");
  const [showChart, setShowChart] = useState(false);

  const sizeTxt = size ? ` (Size: ${size})` : "";
  const orderMsg = `Hi ${SITE.name}! I'd like to order "${name}"${sizeTxt} (${usd(price)}). Please share availability and details.`;
  const questionMsg = `Hi ${SITE.name}! I have a question about "${name}"${sizeTxt}.`;

  return (
    <div>
      {kind && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Select Size</p>
            <button type="button" onClick={() => setShowChart(true)} className="text-sm font-medium text-brand hover:underline">
              Size Chart
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const ok = available.includes(s);
              const sel = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!ok}
                  onClick={() => ok && setSize(sel ? "" : s)}
                  title={ok ? undefined : "Sold out"}
                  className={`grid h-11 place-items-center rounded-md border px-3 text-sm font-medium ${
                    !ok
                      ? "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300 line-through"
                      : sel
                        ? "border-brand bg-brand text-white"
                        : "border-neutral-300 text-ink hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-neutral-500">Greyed-out sizes are sold out. Custom sizing available — just ask on WhatsApp.</p>
        </div>
      )}

      <AddToCartButton
        item={{ slug, name, price, image, size: size || undefined }}
        className="mt-8 w-full rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-dark disabled:bg-neutral-300"
      />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <EnquireButton
          productSlug={slug}
          productName={name}
          message={orderMsg}
          waHref={waLink(orderMsg)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-semibold text-white hover:opacity-90"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Order on WhatsApp
        </EnquireButton>
        <a
          href={waLink(questionMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center rounded-full border border-ink px-8 py-3.5 text-base font-semibold text-ink hover:bg-ink hover:text-white"
        >
          Ask a question
        </a>
      </div>

      {showChart && kind && <SizeChart type={kind} onClose={() => setShowChart(false)} />}
    </div>
  );
}
