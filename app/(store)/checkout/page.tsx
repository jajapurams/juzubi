"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, AddressElement, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/lib/cart";
import { usd, PURCHASING_ENABLED, SITE, waLink } from "@/lib/site";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

type Totals = {
  clientSecret: string;
  paymentIntentId: string;
  subtotal: number;
  shipping: number;
  shippingMethod: string;
  amount: number;
};

export default function CheckoutPage() {
  // Pre-launch: online checkout is disabled.
  if (!PURCHASING_ENABLED) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">Checkout opening soon</h1>
        <p className="mt-3 text-neutral-600">
          Online ordering isn’t open just yet. Message us on WhatsApp and we’ll help you order.
        </p>
        <a
          href={waLink(`Hi ${SITE.name}! I'd like to order some items.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Order on WhatsApp
        </a>
        <div>
          <Link href="/" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }
  return <CheckoutInner />;
}

function CheckoutInner() {
  const { items } = useCart();
  const [data, setData] = useState<Totals | null>(null);
  const [err, setErr] = useState("");
  const [calcZip, setCalcZip] = useState(false);
  const lastZip = useRef<string>("");

  const slugs = items.map((i) => i.slug);

  useEffect(() => {
    if (items.length === 0) return;
    setErr("");
    setData(null);
    lastZip.current = "";
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Could not start checkout.");
        return d as Totals;
      })
      .then(setData)
      .catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Recalculate shipping when the customer enters a destination ZIP.
  const onZip = useCallback(
    (zip: string) => {
      if (!data || zip.length < 5 || zip === lastZip.current) return;
      lastZip.current = zip;
      setCalcZip(true);
      fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs, destZip: zip, paymentIntentId: data.paymentIntentId }),
      })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || "Could not update shipping.");
          return d as Omit<Totals, "clientSecret" | "paymentIntentId">;
        })
        .then((d) => setData((prev) => (prev ? { ...prev, ...d } : prev)))
        .catch(() => {})
        .finally(() => setCalcZip(false));
    },
    [data, slugs]
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-neutral-600">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-ink">Checkout</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {err ? (
            <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>
          ) : !data ? (
            <p className="text-sm text-neutral-500">Loading secure checkout…</p>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: data.clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#b8002e" } } }}
            >
              <CheckoutForm onZip={onZip} />
            </Elements>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Order summary</h2>
          {data ? (
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
                <span className="font-semibold text-ink">{usd(data.subtotal / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Shipping
                  {data.shippingMethod && <span className="block text-xs text-neutral-400">{data.shippingMethod}</span>}
                </span>
                <span className={data.shipping === 0 ? "font-semibold text-green-700" : ""}>
                  {calcZip ? "…" : data.shipping === 0 ? "FREE" : usd(data.shipping / 100)}
                </span>
              </div>
              <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-base font-bold text-ink">
                <span>Total</span>
                <span>{usd(data.amount / 100)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-neutral-500">Calculating…</p>
          )}
          <p className="mt-3 text-xs text-neutral-400">
            Shipping is calculated by USPS from your delivery ZIP. Free over $75.
          </p>
        </aside>
      </div>
    </div>
  );
}

function CheckoutForm({ onZip }: { onZip: (zip: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setMsg("");
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    });
    if (error) {
      setMsg(error.message ?? "Payment could not be completed.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Shipping address</h3>
        <AddressElement
          options={{ mode: "shipping" }}
          onChange={(e) => {
            if (e.value.address.country === "US" && /^\d{5}/.test(e.value.address.postal_code)) {
              onZip(e.value.address.postal_code.slice(0, 5));
            }
          }}
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Payment</h3>
        <PaymentElement />
      </div>
      {msg && <p className="text-sm text-sale">{msg}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting ? "Processing…" : "Pay now"}
      </button>
      <p className="text-center text-xs text-neutral-400">
        Test mode — use card 4242 4242 4242 4242, any future expiry, any CVC &amp; ZIP.
      </p>
    </form>
  );
}
