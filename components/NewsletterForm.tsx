"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return;
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: value });
      if (error) {
        if (error.code === "23505") {
          setStatus("done");
          setMsg("You're already on the list — thank you!");
        } else {
          setStatus("error");
          setMsg("Something went wrong. Please try again.");
        }
      } else {
        setStatus("done");
        setMsg("Thanks for subscribing!");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return <p className="w-full max-w-md text-sm font-medium text-white">{msg}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-brand"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && <span className="text-xs text-red-300">{msg}</span>}
    </form>
  );
}
