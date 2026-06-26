import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { computeShippingCents, itemWeightOz } from "@/lib/shipping";

// Recalculates shipping for a destination ZIP and updates the open PaymentIntent.
export async function POST(req: Request) {
  let slugs: string[];
  let destZip: string;
  let paymentIntentId: string;
  try {
    const body = await req.json();
    slugs = Array.isArray(body?.slugs) ? body.slugs : [];
    destZip = String(body?.destZip ?? "");
    paymentIntentId = String(body?.paymentIntentId ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (slugs.length === 0 || !paymentIntentId) {
    return NextResponse.json({ error: "Missing cart or payment session." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").in("slug", slugs);
  const items = (data ?? []).filter((p) => p.in_stock !== false);
  if (items.length === 0) return NextResponse.json({ error: "Items unavailable." }, { status: 400 });

  const subtotal = items.reduce((s, p) => s + Math.round(Number(p.price) * 100), 0);
  const totalWeightOz = items.reduce((w, p) => w + itemWeightOz(p), 0);
  const { shipping, method } = await computeShippingCents({ subtotalCents: subtotal, totalWeightOz, destZip });
  const amount = subtotal + shipping;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 500 });
  }

  try {
    await getStripe().paymentIntents.update(paymentIntentId, { amount });
    return NextResponse.json({ subtotal, shipping, shippingMethod: method, amount });
  } catch {
    return NextResponse.json({ error: "Could not update shipping." }, { status: 500 });
  }
}
