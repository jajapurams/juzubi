import Link from "next/link";

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const BANNERS = [
  {
    img: px(28405815),
    eyebrow: "The Wedding Store",
    title: "Bridal Lehengas",
    sub: "Hand-embroidered, made for the big day.",
    href: "/category/lehengas",
    cta: "Shop Lehengas",
  },
  {
    img: px(27719401),
    eyebrow: "New Drapes",
    title: "Designer Sarees",
    sub: "Silk, organza & handloom classics.",
    href: "/category/sarees",
    cta: "Shop Sarees",
  },
];

export default function PromoGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 md:grid-cols-2">
        {BANNERS.map((b) => (
          <Link key={b.title} href={b.href} className="group relative overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.img}
              alt={b.title}
              className="h-[44vw] max-h-[340px] min-h-[220px] w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-7 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">{b.eyebrow}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">{b.title}</h3>
              <p className="mt-1 max-w-xs text-sm text-white/90">{b.sub}</p>
              <span className="mt-4 w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink transition group-hover:bg-cream">
                {b.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
