"use client";

import { useState } from "react";
import CollageSplitModal from "./ai/CollageSplitModal";

// Manages a product's extra gallery images (multiple angles). Upload several,
// pick from the library, or remove. Submits each URL as a hidden `images` input.
export default function GalleryUploader({ name, initial }: { name: string; initial?: string[] }) {
  const [urls, setUrls] = useState<string[]>(initial ?? []);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [removeBg, setRemoveBg] = useState(false);
  const [lib, setLib] = useState<string[] | null>(null);
  const [showLib, setShowLib] = useState(false);
  const [libLoading, setLibLoading] = useState(false);
  const [showSplit, setShowSplit] = useState(false);

  const add = (u: string) => setUrls((p) => (p.includes(u) ? p : [...p, u]));
  const remove = (u: string) => setUrls((p) => p.filter((x) => x !== u));

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr("");
    setNote("");
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      if (removeBg) fd.append("removeBg", "true");
      try {
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (d.url) {
          add(d.url);
          if (d.wantRemoveBg && !d.bgRemoved) setNote("Background removal didn't run (remove.bg may be out of free credits) — image uploaded with its background.");
        } else setErr(d.error || "Upload failed.");
      } catch {
        setErr("Upload failed.");
      }
    }
    setBusy(false);
  }

  async function openLibrary() {
    setShowLib(true);
    if (lib === null) {
      setLibLoading(true);
      try {
        const r = await fetch("/api/uploads");
        const d = await r.json();
        setLib(Array.isArray(d.images) ? d.images : []);
      } catch {
        setLib([]);
      }
      setLibLoading(false);
    }
  }

  return (
    <div>
      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}

      {urls.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {urls.map((u) => (
            <div key={u} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-20 w-16 rounded border border-neutral-200 object-cover" />
              <button
                type="button"
                onClick={() => remove(u)}
                className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-sale text-xs leading-none text-white"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className={`cursor-pointer rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100 ${busy ? "opacity-60" : ""}`}>
          <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={(e) => upload(e.target.files)} />
          {busy ? "Uploading…" : "+ Add images"}
        </label>
        <button type="button" onClick={openLibrary} className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100">
          Pick from library
        </button>
        <button type="button" onClick={() => setShowSplit(true)} className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100">
          ✂️ Split a collage
        </button>
      </div>
      <label className="mt-2 flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} className="h-4 w-4" />
        Remove background <span className="text-xs text-neutral-400">(best for flat product shots)</span>
      </label>
      {err && <p className="mt-1 text-xs text-sale">{err}</p>}
      {note && <p className="mt-1 text-xs text-amber-600">{note}</p>}

      {showSplit && (
        <CollageSplitModal multi onSelect={(u) => add(u)} onClose={() => setShowSplit(false)} />
      )}

      {showLib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLib(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Add images from library</h3>
              <button type="button" onClick={() => setShowLib(false)} className="text-sm text-neutral-500 hover:text-ink">Close ✕</button>
            </div>
            {libLoading ? (
              <p className="py-8 text-center text-sm text-neutral-500">Loading…</p>
            ) : lib && lib.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {lib.map((u) => {
                  const chosen = urls.includes(u);
                  return (
                    <button
                      key={u}
                      type="button"
                      onClick={() => (chosen ? remove(u) : add(u))}
                      className={`overflow-hidden rounded-lg border-2 ${chosen ? "border-brand" : "border-transparent hover:border-neutral-300"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" className="aspect-[4/5] w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-neutral-500">No uploaded images yet.</p>
            )}
            <div className="mt-4 text-right">
              <button type="button" onClick={() => setShowLib(false)} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
