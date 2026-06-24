"use client";

import { useEffect } from "react";

// Token-free prefill: remembers the category & brand you used last time and
// pre-selects them for the next new product. Saves the values on submit.
export default function PrefillFromLast() {
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;
    const cat = form.querySelector('select[name="category"]') as HTMLSelectElement | null;
    const brand = form.querySelector('input[name="brand"]') as HTMLInputElement | null;

    try {
      const lastCat = localStorage.getItem("juzubi:lastCategory");
      const lastBrand = localStorage.getItem("juzubi:lastBrand");
      if (cat && lastCat) cat.value = lastCat;
      if (brand && lastBrand && !brand.value.trim()) brand.value = lastBrand;
    } catch {
      // localStorage unavailable — ignore
    }

    function save() {
      try {
        if (cat) localStorage.setItem("juzubi:lastCategory", cat.value);
        if (brand) localStorage.setItem("juzubi:lastBrand", brand.value);
      } catch {
        // ignore
      }
    }
    form.addEventListener("submit", save);
    return () => form.removeEventListener("submit", save);
  }, []);

  return null;
}
