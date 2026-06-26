// USPS live shipping rates via the USPS APIs (developer.usps.com, Prices 3.0).
// Requires OAuth client credentials from a registered app on the USPS Developer Portal:
//   USPS_CLIENT_ID, USPS_CLIENT_SECRET  + the ship-from ZIP SHIP_FROM_ZIP.
// All calls fail soft — callers fall back to flat-rate shipping if USPS is
// unconfigured or returns an error.

const USPS_BASE = "https://apis.usps.com";

type Token = { access_token: string; expires_at: number };
let cachedToken: Token | null = null;

export function uspsConfigured(): boolean {
  return Boolean(process.env.USPS_CLIENT_ID && process.env.USPS_CLIENT_SECRET && process.env.SHIP_FROM_ZIP);
}

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now() + 30_000) return cachedToken.access_token;

  const res = await fetch(`${USPS_BASE}/oauth2/v3/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.USPS_CLIENT_ID,
      client_secret: process.env.USPS_CLIENT_SECRET,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`USPS token failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.access_token;
}

function ozToLb(oz: number): number {
  // USPS expects pounds (decimal). Minimum billable weight ~ a few ounces; keep >= 0.1 lb.
  return Math.max(0.1, Math.round((oz / 16) * 100) / 100);
}

/**
 * Returns the cheapest USPS Ground Advantage price (in cents) to ship a package
 * of `weightOz` ounces from SHIP_FROM_ZIP to `destZip`. Throws on any failure.
 */
export async function getUspsRateCents(destZip: string, weightOz: number): Promise<number> {
  const origin = (process.env.SHIP_FROM_ZIP || "").slice(0, 5);
  const dest = (destZip || "").slice(0, 5);
  if (!/^\d{5}$/.test(origin) || !/^\d{5}$/.test(dest)) throw new Error("Invalid ZIP");

  const token = await getToken();
  const today = new Date().toISOString().slice(0, 10);

  const res = await fetch(`${USPS_BASE}/prices/v3/total-rates/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      originZIPCode: origin,
      destinationZIPCode: dest,
      weight: ozToLb(weightOz),
      length: 12,
      width: 9,
      height: 4,
      mailClass: "USPS_GROUND_ADVANTAGE",
      priceType: "RETAIL",
      mailingDate: today,
    }),
  });
  if (!res.ok) throw new Error(`USPS rates failed: ${res.status}`);

  const data = (await res.json()) as {
    rateOptions?: { totalBasePrice?: number; rates?: { price?: number }[] }[];
  };

  const prices: number[] = [];
  for (const opt of data.rateOptions ?? []) {
    if (typeof opt.totalBasePrice === "number") prices.push(opt.totalBasePrice);
    for (const r of opt.rates ?? []) if (typeof r.price === "number") prices.push(r.price);
  }
  const min = prices.filter((p) => p > 0).sort((a, b) => a - b)[0];
  if (!min) throw new Error("No USPS rate returned");
  return Math.round(min * 100);
}
