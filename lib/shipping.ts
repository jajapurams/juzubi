import { getUspsRateCents, uspsConfigured } from "./usps";

export const FLAT_SHIP_CENTS = 799; // fallback when USPS is unavailable
export const FREE_SHIP_OVER_CENTS = 7500; // free shipping over $75

// Rough per-category weights (ounces) used only when a product has no weight set.
const CATEGORY_WEIGHT_OZ: Record<string, number> = {
  sarees: 16,
  lehengas: 48,
  kurtas: 24,
  jewellery: 6,
  men: 24,
  kids: 16,
};
const DEFAULT_WEIGHT_OZ = 20;

export function itemWeightOz(p: { category?: string | null; weight_oz?: number | null }): number {
  if (p.weight_oz && p.weight_oz > 0) return p.weight_oz;
  return CATEGORY_WEIGHT_OZ[p.category ?? ""] ?? DEFAULT_WEIGHT_OZ;
}

export async function computeShippingCents(opts: {
  subtotalCents: number;
  totalWeightOz: number;
  destZip?: string | null;
}): Promise<{ shipping: number; method: string }> {
  if (opts.subtotalCents >= FREE_SHIP_OVER_CENTS) return { shipping: 0, method: "Free shipping" };

  const zip = (opts.destZip || "").trim();
  if (/^\d{5}/.test(zip) && uspsConfigured()) {
    try {
      const cents = await getUspsRateCents(zip, opts.totalWeightOz);
      return { shipping: cents, method: "USPS Ground Advantage" };
    } catch {
      // fall through to flat rate
    }
  }
  return { shipping: FLAT_SHIP_CENTS, method: "Standard shipping" };
}
