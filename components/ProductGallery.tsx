"use client";

import { useState } from "react";
import SmartImage from "./SmartImage";

// Product gallery: a vertical column of thumbnails on the left and a large main
// image on the right (hover or tap a thumbnail to switch). Falls back to just the
// main image when there's only one photo.
export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const imgs = Array.from(new Set(images.filter(Boolean)));
  const [sel, setSel] = useState(0);
  const main = imgs[sel] ?? imgs[0];

  return (
    <div className="flex gap-3">
      {imgs.length > 1 && (
        <div className="no-scrollbar flex max-h-[34rem] w-16 shrink-0 flex-col gap-2 overflow-y-auto sm:w-20">
          {imgs.map((u, i) => (
            <button
              key={u}
              type="button"
              onClick={() => setSel(i)}
              onMouseEnter={() => setSel(i)}
              className={`shrink-0 overflow-hidden rounded-md border-2 transition ${
                i === sel ? "border-brand" : "border-neutral-200 hover:border-neutral-400"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <SmartImage src={u} alt="" className="aspect-[4/5] w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden rounded-xl bg-cream">
        <SmartImage src={main} alt={alt} className="aspect-[4/5] w-full object-cover" />
      </div>
    </div>
  );
}
