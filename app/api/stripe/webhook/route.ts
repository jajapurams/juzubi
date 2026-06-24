import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Stripe -> our server. On successful payment: mark the purchased products
// sold (in_stock=false) and save the order. Secured by Stripe signature.
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  if (!sig || !whsec) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, whsec);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const slugs = (pi.metadata?.slugs ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    const sb = createAdminClient();

    // mark purchased one-of-a-kind products as sold
    if (slugs.length) {
      await sb.from("products").update({ in_stock: false }).in("slug", slugs);
    }

    // record the order (idempotent on the payment intent id)
    await sb.from("orders").upsert(
      {
        stripe_payment_intent: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        email: pi.receipt_email ?? null,
        customer_name: pi.shipping?.name ?? null,
        address: pi.shipping?.address ?? null,
        product_slugs: slugs,
        status: "paid",
      },
      { onConflict: "stripe_payment_intent" }
    );
  }

  return NextResponse.json({ received: true });
}
