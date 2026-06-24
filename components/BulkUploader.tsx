"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

export default function BulkUploader() {
  const [urls, setUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [err, setErr] = useState("");

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr("");
    const arr = Array.from(files);
    const done: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      setProgress(`Uploading ${i + 1} of ${arr.length}…`);
      const fd = new FormData();
      fd.append("file", arr[i]);
      try {
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (d.url) done.push(d.url);
        else setErr(d.error || "An image failed to upload.");
      } catch {
        setErr("An image failed to upload.");
      }
    }
    setUrls((u) => [...done, ...u]);
    setBusy(false);
    setProgress("");
  }

  return (
    <div>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-8 text-center hover:border-brand ${busy ? "opacity-60" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
      >
        <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={(e) => upload(e.target.files)} />
        <span className="text-sm font-semibold text-ink">{busy ? progress : "Upload images in bulk"}</span>
        <span className="text-xs text-neutral-500">Drag &amp; drop many at once, choose files, or take photos — all auto-optimized.</span>
      </label>
      {err && <p className="mt-2 text-xs text-sale">{err}</p>}

      {urls.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-ink">Just uploaded ({urls.length}) — copy a URL into any product:</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {urls.map((u) => (
              <div key={u} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" className="aspect-[4/5] w-full object-cover" />
                <CopyButton text={u} className="block w-full py-1.5 text-center text-xs font-medium text-brand hover:bg-neutral-50" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
