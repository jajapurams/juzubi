"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Slide = {
  img: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
};

const SLIDES: Slide[] = [
  {
    img: "https://images.pexels.com/photos/7920188/pexels-photo-7920188.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "The Festive Edit",
    title: "Handpicked Indian boutique wear",
    subtitle: "Sarees, lehengas, kurtas & jewellery — curated, crafted, and just a WhatsApp away.",
    ctaHref: "/category/sarees",
    ctaLabel: "Shop Sarees",
  },
  {
    img: "https://images.pexels.com/photos/28405815/pexels-photo-28405815.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "Wedding Season",
    title: "The Bridal Edit",
    subtitle: "Hand-embroidered lehengas and silks made for the big day.",
    ctaHref: "/category/lehengas",
    ctaLabel: "Explore Lehengas",
  },
  {
    img: "https://images.pexels.com/photos/37628608/pexels-photo-37628608.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "New & Trending",
    title: "Fresh festive styles",
    subtitle: "Anarkalis, kurtas and suits for every occasion.",
    ctaHref: "/category/new",
    ctaLabel: "Shop New Arrivals",
  },
  {
    img: "https://images.pexels.com/photos/6011749/pexels-photo-6011749.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "Finishing Touches",
    title: "Jewellery & accessories",
    subtitle: "Kundan chokers, temple sets, jhumkas and more.",
    ctaHref: "/category/jewellery",
    ctaLabel: "Shop Jewellery",
  },
  {
    img: "https://images.pexels.com/photos/27719401/pexels-photo-27719401.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "Timeless Drapes",
    title: "Silk & designer sarees",
    subtitle: "Banarasi, Kanjivaram and handloom classics.",
    ctaHref: "/category/sarees",
    ctaLabel: "Shop Sarees",
  },
  {
    img: "https://images.pexels.com/photos/17001511/pexels-photo-17001511.jpeg?auto=compress&cs=tinysrgb&w=1920",
    eyebrow: "Celebrate in Style",
    title: "Festive & occasion wear",
    subtitle: "Dress beautifully for every celebration.",
    ctaHref: "/category/women",
    ctaLabel: "Shop Women",
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const go = useCallback((n: number) => setI((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[i];

  return (
    <section className="relative isolate h-[60vw] max-h-[580px] min-h-[380px] overflow-hidden">
      {/* Slides (crossfade) */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
          aria-hidden={idx !== i}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.img} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        </div>
      ))}

      {/* Caption for active slide */}
      <div className="absolute inset-0">
        <div className="mx-auto flex h-full max-w-7xl items-center px-6">
          <div key={i} className="max-w-xl animate-[fadeIn_0.6s_ease] text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{s.eyebrow}</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">{s.title}</h1>
            <p className="mt-4 max-w-md text-base text-white/90 sm:text-lg">{s.subtitle}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={s.ctaHref} className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
                {s.ctaLabel}
              </Link>
              <Link href="/category/sale" className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink hover:bg-cream">
                Shop Sale
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(i - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-2xl leading-none text-white backdrop-blur hover:bg-white/45"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(i + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/25 text-2xl leading-none text-white backdrop-blur hover:bg-white/45"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => go(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
