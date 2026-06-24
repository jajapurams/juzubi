import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// Flat shipping placeholder (cents) until live USPS rates are wired in.
const SHIP_FLAT = 799;
const FREE_SHIP_OVER = 7500; // $75

export async function POST(req: Request) {
  let slugs: string[];
  try {
    const body = await req.json();
    slugs = Array.isArray(body?.slugs) ? body.slugs : [];
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (slugs.length === 0) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

  // Recompute prices from the database — never trust amounts from the client.
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("slug,name,price,in_stock").in("slug", slugs);
  const items = (data ?? []).filter((p) => p.in_stock !== false);
  if (items.length === 0) {
    return NextResponse.json({ error: "These items are no longer available." }, { status: 400 });
  }

  const subtotal = items.reduce((s, p) => s + Math.round(Number(p.price) * 100), 0);
  const shipping = subtotal >= FREE_SHIP_OVER ? 0 : SHIP_FLAT;
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
    return NextResponse.json({ clientSecret: pi.client_secret, subtotal, shipping, amount });
  } catch {
    return NextResponse.json({ error: "Could not start payment." }, { status: 500 });
  }
}
