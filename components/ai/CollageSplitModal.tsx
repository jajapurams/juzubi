"use client";

import { useState } from "react";

// Upload a collage, split it into separate images, and pick which result(s) to
// use. Designed to drop into the product image uploaders. In `multi` mode the
// user can add several (for the gallery); otherwise the first pick closes it.
export default function CollageSplitModal({
  multi = false,
  onSelect,
  onClose,
}: {
  multi?: boolean;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [mode, setMode] = useState<"auto" | "grid">("auto");
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [trim, setTrim] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);

  function pick(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    setFile(f);
    setImages([]);
    setPicked([]);
    setErr("");
    setPreview(URL.createObjectURL(f));
  }

  async function split() {
    if (!file) return;
    setBusy(true);
    setErr("");
    setImages([]);
    setPicked([]);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mode", mode);
      fd.append("rows", String(rows));
      fd.append("cols", String(cols));
      fd.append("trim", String(trim));
      const r = await fetch("/api/ai/split", { method: "POST", body: fd });
      const d = await r.json();
      if (!d.images) throw new Error(d.error || "Split failed.");
      setImages(d.images);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Split failed.");
    }
    setBusy(false);
  }

  function choose(url: string) {
    if (multi) {
      onSelect(url);
      setPicked((p) => (p.includes(url) ? p : [...p, url]));
    } else {
      onSelect(url);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">✂️ Split a collage into product images</h3>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-ink">Close ✕</button>
        </div>

        {err && <p className="mb-3 rounded-md bg-sale/10 px-3 py-2 text-sm text-sale">{err}</p>}

        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-6 text-center text-sm hover:border-brand">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files)} />
          <span className="font-medium text-ink">{file ? "Choose a different collage" : "Upload or take a photo of the collage"}</span>
          <span className="text-xs text-neutral-500">One image containing several products</span>
        </label>

        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Collage" className="mx-auto mt-3 max-h-48 rounded-lg border border-neutral-200" />
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setMode("auto")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "auto" ? "bg-brand text-white" : "border border-neutral-300 text-ink hover:bg-neutral-100"}`}>
            Auto-detect gaps
          </button>
          <button type="button" onClick={() => setMode("grid")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "grid" ? "bg-brand text-white" : "border border-neutral-300 text-ink hover:bg-neutral-100"}`}>
            Manual grid
          </button>
        </div>

        {mode === "grid" && (
          <div className="mt-3 flex flex-wrap items-end gap-4">
            <label className="text-sm font-medium text-ink">
              Rows
              <input type="number" min={1} max={12} value={rows} onChange={(e) => setRows(Number(e.target.value))} className="mt-1 w-20 rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-ink">
              Columns
              <input type="number" min={1} max={12} value={cols} onChange={(e) => setCols(Number(e.target.value))} className="mt-1 w-20 rounded-md border border-neutral-300 px-3 py-2 text-sm" />
            </label>
            <span className="text-sm text-neutral-500">= {rows * cols} images</span>
          </div>
        )}

        <label className="mt-3 flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} className="h-4 w-4" />
          Trim extra whitespace around each image
        </label>

        <button type="button" onClick={split} disabled={!file || busy} className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:bg-neutral-300">
          {busy ? "Splitting…" : "Split"}
        </button>

        {images.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-ink">
              {multi ? "Tap images to add them" : "Tap the image you want to use"}
              <span className="ml-1 text-xs font-normal text-neutral-500">· also saved to your library</span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((u, i) => {
                const chosen = picked.includes(u);
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => choose(u)}
                    className={`overflow-hidden rounded-lg border-2 ${chosen ? "border-brand" : "border-transparent hover:border-neutral-300"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt={`Part ${i + 1}`} className="aspect-[4/5] w-full bg-neutral-100 object-contain" />
                  </button>
                );
              })}
            </div>
            {multi && (
              <div className="mt-4 text-right">
                <button type="button" onClick={onClose} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
                  Done {picked.length > 0 ? `(${picked.length} added)` : ""}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
