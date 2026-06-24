import Link from "next/link";
import { CATEGORIES } from "@/lib/site";

export default function CategoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 text-center">
        <h2 className="font-display text-3xl font-bold text-ink">Shop by category</h2>
        <p className="mt-1 text-sm text-neutral-500">Find your next favourite, by occasion or style.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group relative overflow-hidden rounded-xl bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image}
              alt={c.name}
              className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="font-display text-lg font-semibold">{c.name}</h3>
              <p className="text-xs text-white/85">{c.blurb}</p>
              <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-white underline-offset-4 group-hover:underline">
                Shop now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
