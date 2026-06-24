import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="relative overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/17001511/pexels-photo-17001511.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="The Bridal Edit"
          className="h-[42vw] max-h-[360px] min-h-[220px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-brand/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 text-white sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Wedding season</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">The Bridal Edit</h2>
            <p className="mt-2 max-w-sm text-sm text-white/90 sm:text-base">
              Lehengas and silks made for the big day. Book a personal styling chat on WhatsApp.
            </p>
            <Link
              href="/category/lehengas"
              className="mt-5 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink hover:bg-cream"
            >
              Explore lehengas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
