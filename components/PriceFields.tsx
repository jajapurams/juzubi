"use client";

import { useState } from "react";

// Selling price + original (MRP) price, with a live warning if they look swapped
// (MRP should be higher than the selling price to show a discount).
export default function PriceFields({
  initialPrice,
  initialMrp,
  inputCls,
}: {
  initialPrice?: number;
  initialMrp?: number | null;
  inputCls: string;
}) {
  const [price, setPrice] = useState(initialPrice != null ? String(initialPrice) : "");
  const [mrp, setMrp] = useState(initialMrp != null ? String(initialMrp) : "");

  const p = parseFloat(price);
  const m = parseFloat(mrp);
  const inverted = !isNaN(p) && !isNaN(m) && m > 0 && m <= p;

  return (
    <>
      <label className="text-sm font-medium text-ink">
        Selling price ($)
        <span className="block text-[11px] font-normal text-neutral-400">what the customer pays</span>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputCls}
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Original price / MRP ($)
        <span className="block text-[11px] font-normal text-neutral-400">higher than selling price; strikes through. Blank if not on sale</span>
        <input
          name="mrp"
          type="number"
          min="0"
          step="0.01"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
          className={inputCls}
        />
        {inverted && (
          <span className="mt-1 block text-[11px] font-normal text-amber-600">
            ⚠ MRP should be higher than the selling price — these look swapped.
          </span>
        )}
      </label>
    </>
  );
}
