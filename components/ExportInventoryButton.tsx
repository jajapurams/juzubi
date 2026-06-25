"use client";

// Generic CSV download button. Builds a CSV from headers + rows and downloads it
// (no server round-trip). Includes a UTF-8 BOM so Excel opens it correctly.
export default function ExportInventoryButton({
  headers,
  rows,
  filename,
  label = "⬇ Export CSV",
}: {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  label?: string;
}) {
  function exportCsv() {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <button onClick={exportCsv} className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-neutral-100">
      {label}
    </button>
  );
}
