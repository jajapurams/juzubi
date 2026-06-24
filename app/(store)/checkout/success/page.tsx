"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/lib/cart";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

export default function SuccessPage() {
  const { clear } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "processing" | "failed">("loading");

  useEffect(() => {
    const cs = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (!cs) {
      setStatus("failed");
      return;
    }
    stripePromise
      .then((s) => s?.retrievePaymentIntent(cs))
      .then((res) => {
        const st = res?.paymentIntent?.status;
        if (st === "succeeded") {
          setStatus("success");
          clear();
        } else if (st === "processing") {
          setStatus("processing");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      {status === "loading" && <p className="text-neutral-500">Confirming your payment…</p>}

      {status === "success" && (
        <>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">Thank you!</h1>
          <p className="mt-2 text-neutral-600">Your order is confirmed. We&apos;ll email your receipt and shipping details shortly.</p>
          <Link href="/" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Continue shopping
          </Link>
        </>
      )}

      {status === "processing" && (
        <>
          <h1 className="font-display text-2xl font-extrabold text-ink">Payment processing</h1>
          <p className="mt-2 text-neutral-600">Your payment is being processed. We&apos;ll email you once it&apos;s confirmed.</p>
          <Link href="/" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Continue shopping
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="font-display text-2xl font-extrabold text-ink">Payment not completed</h1>
          <p className="mt-2 text-neutral-600">Something went wrong, or the payment was cancelled. Your card was not charged.</p>
          <Link href="/cart" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Back to cart
          </Link>
        </>
      )}
    </div>
  );
}
