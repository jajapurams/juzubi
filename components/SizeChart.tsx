"use client";

// Adult chart (lehengas / salwar kameez) — all values in inches.
const ADULT_HEAD = ["Size", "Chest/Bust", "Waist", "Hip", "Shoulder", "To Fit Bust", "To Fit Waist", "To Fit Hip", "Length (Straight)", "A-line"];
const ADULT_ROWS: (string | number)[][] = [
  ["XS", 34, 30, 36, 14, 32, 28, 34, 46, 48],
  ["S", 36, 32, 38, 14.5, 34, 30, 36, 46, 48],
  ["M", 38, 34, 40, 15, 36, 32, 38, 46, 48],
  ["L", 40, 36, 42, 15.5, 38, 34, 40, 46, 48],
  ["XL", 42, 38, 44, 16, 40, 36, 42, 46, 48],
  ["XXL", 44, 40, 46, 16.5, 42, 38, 44, 46, 48],
  ["3XL", 46, 42, 48, 17, 44, 40, 46, 46, 48],
  ["4XL", 48, 44, 50, 17.5, 46, 42, 48, 46, 48],
  ["5XL", 50, 46, 52, 18, 48, 44, 50, 46, 48],
  ["6XL", 52, 48, 54, 18.5, 50, 46, 52, 46, 48],
];

// Kids chart — all values in inches.
const KIDS_HEAD = ["Size", "Age", "Chest", "Top Length", "Waist", "Bottom Length"];
const KIDS_ROWS: (string | number)[][] = [
  [16, "2-3 Year", 24, 19, 18, 19],
  [18, "3-4 Year", 24, 20, 20, 20],
  [20, "4-5 Year", 25, 21, 21, 21],
  [22, "5-6 Year", 26, 22, 22, 24],
  [24, "6-7 Year", 27, 23, 23, 25],
  [26, "7-8 Year", 28, 24, 24, 26],
  [28, "8-9 Year", 29, 25, 25, 29],
  [30, "9-10 Year", 30, 26, 26, 30],
  [32, "10-11 Year", 30, 27, 26, 32],
  [34, "11-12 Year", 30, 27, 26, 32],
  [36, "12-13 Year", 31, 28, 28, 33],
  [38, "13-14 Year", 31, 28, 28, 33],
  [40, "14-15 Year", 32, 29, 30, 35],
];

export default function SizeChart({ type, onClose }: { type: "adult" | "kids"; onClose: () => void }) {
  const head = type === "kids" ? KIDS_HEAD : ADULT_HEAD;
  const rows = type === "kids" ? KIDS_ROWS : ADULT_ROWS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Size Chart {type === "kids" ? "· Kids" : ""}</h3>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-ink">Close ✕</button>
        </div>
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-neutral-500">All measurements are in inches</p>

        <div className="overflow-x-auto">
          <table className={`w-full ${type === "kids" ? "min-w-[520px]" : "min-w-[640px]"} border-collapse text-center text-sm`}>
            <thead>
              <tr className="bg-brand/5 text-xs font-semibold text-ink">
                {head.map((h) => (
                  <th key={h} className="border border-neutral-200 px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={String(r[0])} className="odd:bg-white even:bg-neutral-50">
                  {r.map((c, i) => (
                    <td key={i} className={`border border-neutral-200 px-3 py-2 ${i === 0 ? "font-semibold text-ink" : "text-neutral-700"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Tip: measure a garment that fits well and compare. Custom sizing is available — just ask on WhatsApp.
        </p>
      </div>
    </div>
  );
}
