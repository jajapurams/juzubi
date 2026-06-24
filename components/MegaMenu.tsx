"use client";

import { useState } from "react";
import Link from "next/link";

export type MegaCol = { title?: string; items: string[]; all?: string };

export default function MegaMenu({
  label,
  href,
  cols,
  align = "left",
}: {
  label: string;
  href: string;
  cols: MegaCol[];
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link href={href} className="hover:text-brand">
        {label}
      </Link>
      {open && (
        <div
          className={`absolute top-full z-40 hidden gap-6 rounded-md border border-neutral-200 bg-white p-6 shadow-xl md:grid ${align === "right" ? "right-0" : "left-0"}`}
          style={{ width: `${cols.length * 185}px`, maxWidth: "92vw", gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}
        >
          {cols.map((col, ci) => (
            <div key={ci}>
              {col.title && <h3 className="border-b border-neutral-200 pb-2 text-base font-bold text-ink">{col.title}</h3>}
              <ul className={`space-y-2 ${col.title ? "mt-3" : ""}`}>
                {col.items.map((it) => (
                  <li key={it}>
                    <Link href={href} className="text-sm font-normal text-neutral-600 hover:text-brand">
                      {it}
                    </Link>
                  </li>
                ))}
                {col.all && (
                  <li>
                    <Link href={href} className="text-sm font-medium text-brand hover:underline">
                      {col.all}…
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
