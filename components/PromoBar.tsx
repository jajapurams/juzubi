import { SITE, usd } from "@/lib/site";

export default function PromoBar() {
  return (
    <div className="bg-brand text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-center text-xs font-medium tracking-wide sm:text-[13px]">
        Free shipping on orders over {usd(SITE.freeShipOver)} &nbsp;·&nbsp; New arrivals every week &nbsp;·&nbsp; Order on WhatsApp
      </div>
    </div>
  );
}
