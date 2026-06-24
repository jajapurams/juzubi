"use client";

import { useState } from "react";

// Renders a product image with a consistent crop, and falls back to a clean
// branded placeholder when the image is missing, disabled, or fails to load —
// so the site never shows a broken image and every tile looks uniform.
export default function SmartImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const usable = src && !failed;

  if (!usable) {
    return (
      <div className={`flex items-center justify-center bg-cream text-brand/40 ${className ?? ""}`} role="img" aria-label={`${alt} — image coming soon`}>
        <svg viewBox="0 0 24 24" className="h-1/3 max-h-12 min-h-4 w-1/3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
  );
}
