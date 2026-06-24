"use client";

import { useState } from "react";
import { CATEGORIES, SUBCATEGORIES, sizesFor } from "@/lib/site";

// Category options = the live store categories + Men/Kids ribbon sections.
const CATS: [string, string][] = [
  ...CATEGORIES.map((c) => [c.slug, c.name] as [string, string]),
  ["men", "Men"],
  ["kids", "Kids"],
];

const chipCls = (on: boolean) =>
  `cursor-pointer rounded-md border px-3 py-1.5 text-sm ${on ? "border-brand bg-brand text-white" : "border-neutral-300 text-ink hover:border-ink"}`;
const smallInput = "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand";

// Category + multi-select Subcategories (with free-text add) + available Sizes.
export default function CategorySelect({
  initialCategory = "sarees",
  initialSubcategories = [],
  initialSizes = [],
  inputCls,
}: {
  initialCategory?: string;
  initialSubcategories?: string[];
  initialSizes?: string[];
  inputCls: string;
}) {
  const [cat, setCat] = useState(initialCategory || "sarees");
  const [subs, setSubs] = useState<string[]>(initialSubcategories ?? []);
  const [custom, setCustom] = useState("");
  const [sizes, setSizes] = useState<string[]>(initialSizes ?? []);

  const predefined = SUBCATEGORIES[cat] ?? [];
  const sizeOptions = sizesFor(cat);
  const customSelected = subs.filter((s) => !predefined.includes(s));

  const toggleSub = (s: string) => setSubs((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const removeSub = (s: string) => setSubs((p) => p.filter((x) => x !== s));
  const addCustom = () => {
    const v = custom.trim();
    if (v && !subs.includes(v)) setSubs((p) => [...p, v]);
    setCustom("");
  };
  const toggleSize = (s: string) => setSizes((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <>
      <label className="text-sm font-medium text-ink">
        Category
        <select
          name="category"
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setSubs([]); // subcategories differ per category
            setSizes([]);
          }}
          className={inputCls}
        >
          {CATS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </label>
      {/* keeps the 2-col grid aligned (subcategories span full width below) */}
      <div className="hidden sm:block" aria-hidden />

      <div className="sm:col-span-2">
        <p className="text-sm font-medium text-ink">
          Subcategories <span className="text-xs font-normal text-neutral-400">— pick any that apply, or add your own</span>
        </p>

        {predefined.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {predefined.map((s) => (
              <button key={s} type="button" onClick={() => toggleSub(s)} className={chipCls(subs.includes(s))}>
                {s}
              </button>
            ))}
          </div>
        )}

        {customSelected.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {customSelected.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-md border border-brand bg-brand px-3 py-1.5 text-sm text-white">
                {s}
                <button type="button" onClick={() => removeSub(s)} aria-label={`Remove ${s}`} className="text-white/80 hover:text-white">✕</button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="Add a new subcategory (e.g. Cutwork, Mirror Work)"
            className={smallInput}
          />
          <button type="button" onClick={addCustom} className="shrink-0 rounded-md border border-neutral-300 px-4 text-sm font-medium text-ink hover:bg-neutral-100">
            Add
          </button>
        </div>

        {/* submitted values */}
        {subs.map((s) => (
          <input key={s} type="hidden" name="subcategories" value={s} />
        ))}
      </div>

      {sizeOptions.length > 0 && (
        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-ink">Available sizes</p>
          <p className="text-xs text-neutral-500">
            Tick the sizes in stock. Un-ticked sizes show greyed-out (sold) on the product page. Leave all unticked to offer every size.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizeOptions.map((s) => {
              const on = sizes.includes(s);
              return (
                <label key={s} className={chipCls(on)}>
                  <input type="checkbox" name="sizes" value={s} checked={on} onChange={() => toggleSize(s)} className="hidden" />
                  {s}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
