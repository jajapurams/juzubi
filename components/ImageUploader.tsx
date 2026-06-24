"use client";

import { useState } from "react";
import CollageSplitModal from "./ai/CollageSplitModal";

// Build a friendly product name from a filename — or "" if it looks like a
// camera / auto-generated name (IMG_1234, DSC0001, screenshots, WhatsApp, etc.).
function nameFromFilename(filename: string): string {
  const base = filename.replace(/\.[a-z0-9]+$/i, "");
  if (/^(img|dsc|dscn|pxl|gopr|photo|image|screenshot|untitled|whatsapp|fb_img|received|signal|video)[-_ ]?\d*$/i.test(base)) return "";
  const cleaned = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (cleaned.replace(/[^a-z]/gi, "").length < 3) return ""; // mostly digits — skip
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Content Manager image field: upload / take a photo (auto-optimized to Blob),
// pick from the already-uploaded library, or paste a URL.
export default function ImageUploader({ name, initial }: { name: string; initial?: string }) {
  const [url, setUrl] = useState(initial ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [removeBg, setRemoveBg] = useState(false);
  const [lib, setLib] = useState<string[] | null>(null);
  const [showLib, setShowLib] = useState(false);
  const [libLoading, setLibLoading] = useState(false);
  const [showSplit, setShowSplit] = useState(false);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr("");
    setNote("");
    const firstName = files[0]?.name ?? "";
    let latest = url;
    let uploaded = false;
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      if (removeBg) fd.append("removeBg", "true");
      try {
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (d.url) {
          latest = d.url;
          uploaded = true;
          if (d.wantRemoveBg && !d.bgRemoved) setNote("Background removal didn't run (remove.bg may be out of free credits) — image uploaded with its background.");
        } else setErr(d.error || "Upload failed.");
      } catch {
        setErr("Upload failed.");
      }
    }
    setUrl(latest);
    // Suggest a product name from the filename (SlugFields only uses it if Name is empty).
    if (uploaded) {
      const suggested = nameFromFilename(firstName);
      if (suggested) window.dispatchEvent(new CustomEvent("juzubi:suggest-name", { detail: { name: suggested } }));
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
      <input type="hidden" name={name} value={url} />

      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Product" className="mb-3 h-40 w-32 rounded-md border border-neutral-200 object-cover" />
      )}

      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-6 text-center text-sm hover:border-brand ${busy ? "opacity-60" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
      >
        <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={(e) => upload(e.target.files)} />
        <span className="font-medium text-ink">{busy ? "Uploading…" : "Upload or take a photo"}</span>
        <span className="text-xs text-neutral-500">Drag &amp; drop, choose files, or use your camera — auto-optimized.</span>
      </label>

      <label className="mt-2 flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} className="h-4 w-4" />
        Remove background <span className="text-xs text-neutral-400">(best for flat product shots, not model photos)</span>
      </label>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={openLibrary}
          className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100"
        >
          Pick from library
        </button>
        <button
          type="button"
          onClick={() => setShowSplit(true)}
          className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-medium text-ink hover:bg-neutral-100"
        >
          ✂️ Split a collage
        </button>
      </div>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste an image URL"
        className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
      />
      {err && <p className="mt-1 text-xs text-sale">{err}</p>}
      {note && <p className="mt-1 text-xs text-amber-600">{note}</p>}

      {showSplit && (
        <CollageSplitModal
          onSelect={(u) => setUrl(u)}
          onClose={() => setShowSplit(false)}
        />
      )}

      {showLib && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLib(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Choose an image</h3>
              <button type="button" onClick={() => setShowLib(false)} className="text-sm text-neutral-500 hover:text-ink">Close ✕</button>
            </div>
            {libLoading ? (
              <p className="py-8 text-center text-sm text-neutral-500">Loading…</p>
            ) : lib && lib.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {lib.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      setUrl(u);
                      setShowLib(false);
                    }}
                    className={`overflow-hidden rounded-lg border-2 ${u === url ? "border-brand" : "border-transparent hover:border-neutral-300"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="aspect-[4/5] w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-neutral-500">
                No uploaded images yet. Upload some here or in the Media library.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
