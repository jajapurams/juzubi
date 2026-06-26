import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { computeShippingCents, itemWeightOz } from "@/lib/shipping";
import { PURCHASING_ENABLED } from "@/lib/site";

export async function POST(req: Request) {
  if (!PURCHASING_ENABLED) {
    return NextResponse.json({ error: "Online checkout is not open yet. Please order on WhatsApp." }, { status: 403 });
  }
  let slugs: string[];
  let destZip: string | undefined;
  try {
    const body = await req.json();
    slugs = Array.isArray(body?.slugs) ? body.slugs : [];
    destZip = typeof body?.destZip === "string" ? body.destZip : undefined;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (slugs.length === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

  // Recompute prices from the database — never trust amounts from the client.
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").in("slug", slugs);
  const items = (data ?? []).filter((p) => p.in_stock !== false);
  if (items.length === 0) {
    return NextResponse.json({ error: "These items are no longer available." }, { status: 400 });
  }

  const subtotal = items.reduce((s, p) => s + Math.round(Number(p.price) * 100), 0);
  const totalWeightOz = items.reduce((w, p) => w + itemWeightOz(p), 0);
  const { shipping, method } = await computeShippingCents({ subtotalCents: subtotal, totalWeightOz, destZip });
  const amount = subtotal + shipping;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 500 });
  }

  try {
    const pi = await getStripe().paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { slugs: items.map((i) => i.slug).join(",") },
    });
    return NextResponse.json({
      clientSecret: pi.client_secret,
      paymentIntentId: pi.id,
      subtotal,
      shipping,
      shippingMethod: method,
      amount,
    });
  } catch {
    return NextResponse.json({ error: "Could not start payment." }, { status: 500 });
  }
}
