"use client";

import { useEffect, useRef, useState } from "react";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // drop invalid characters
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-") // collapse repeats
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

// Name + auto-generated Slug. New products: the slug fills from the name as you
// type. Editing an existing product: the slug is left as-is (so its URL is stable).
export default function SlugFields({
  initialName = "",
  initialSlug = "",
  inputCls,
}: {
  initialName?: string;
  initialSlug?: string;
  inputCls: string;
}) {
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug);
  const [edited, setEdited] = useState(Boolean(initialSlug));

  // Suggest a name from the uploaded photo's filename — but ONLY when the Name
  // field is still empty, so we never overwrite something you've typed.
  const nameRef = useRef(name);
  nameRef.current = name;
  useEffect(() => {
    function onFill(e: Event) {
      const n = (e as CustomEvent<{ name?: string }>).detail?.name;
      if (typeof n === "string" && n && !nameRef.current.trim()) {
        setName(n);
        if (!edited) setSlug(slugify(n));
      }
    }
    window.addEventListener("juzubi:suggest-name", onFill);
    return () => window.removeEventListener("juzubi:suggest-name", onFill);
  }, [edited]);

  return (
    <>
      <label className="text-sm font-medium text-ink">
        Name
        <input
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!edited) setSlug(slugify(e.target.value));
          }}
          className={inputCls}
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Slug (web address — auto-filled)
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setEdited(true);
          }}
          placeholder="fills automatically from the name"
          className={inputCls}
        />
        <span className="mt-0.5 block text-[11px] font-normal text-neutral-400">
          Generated from the name — you can usually leave this as-is.
        </span>
      </label>
    </>
  );
}
