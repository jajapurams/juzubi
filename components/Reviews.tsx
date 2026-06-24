"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Review = { id: string; author: string; rating: number; comment: string; created_at: string };

function Stars({ value }: { value: number }) {
  return (
    <span className="text-amber-500" aria-label={`${value} out of 5`}>
      {"★".repeat(Math.round(value))}
      <span className="text-neutral-300">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export default function Reviews({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [show, setShow] = useState(false);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id,author,rating,comment,created_at")
      .eq("product_slug", slug)
      .order("created_at", { ascending: false });
    setReviews((data as Review[]) ?? []);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      setMsg("Please add your name and a comment.");
      return;
    }
    setBusy(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .insert({ product_slug: slug, author: author.trim(), rating, comment: comment.trim() });
    if (error) {
      setMsg(error.message.includes("relation") ? "Reviews aren't set up yet (run reviews.sql)." : error.message);
    } else {
      setAuthor("");
      setComment("");
      setRating(5);
      setShow(false);
      setMsg("Thanks for your review!");
      await load();
    }
    setBusy(false);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Customer Reviews</h2>
          {reviews.length > 0 && (
            <p className="mt-1 text-sm text-neutral-600">
              <Stars value={avg} /> <span className="font-semibold text-ink">{avg.toFixed(1)}</span> · {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>
        <button
          onClick={() => setShow((s) => !s)}
          className="rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ink hover:text-white"
        >
          {show ? "Cancel" : "Write a review"}
        </button>
      </div>

      {show && (
        <form onSubmit={submit} className="mt-5 max-w-xl space-y-3 rounded-xl border border-neutral-200 bg-white p-5">
          <div>
            <span className="text-sm font-medium text-ink">Your rating</span>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-2xl ${n <= rating ? "text-amber-500" : "text-neutral-300"}`}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium text-ink">
            Your name
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={80}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Your review
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={2000}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {busy ? "Posting…" : "Post review"}
          </button>
        </form>
      )}
      {msg && <p className="mt-3 text-sm font-medium text-green-700">{msg}</p>}

      <ul className="mt-6 space-y-5">
        {reviews.map((r) => (
          <li key={r.id} className="border-b border-neutral-100 pb-5 last:border-0">
            <div className="flex items-center gap-2">
              <Stars value={r.rating} />
              <span className="text-sm font-semibold text-ink">{r.author}</span>
              <span className="text-xs text-neutral-400">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700">{r.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
