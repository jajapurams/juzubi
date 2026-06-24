import { SITE, usd } from "@/lib/site";
import { TruckIcon, SwapIcon, WhatsAppIcon, ShieldIcon } from "./icons";

const items = [
  { Icon: TruckIcon, title: "Free shipping", text: `On orders over ${usd(SITE.freeShipOver)}` },
  { Icon: SwapIcon, title: "Easy exchange", text: "7-day hassle-free exchange" },
  { Icon: WhatsAppIcon, title: "WhatsApp support", text: "Real humans, quick replies" },
  { Icon: ShieldIcon, title: "Secure & trusted", text: "Quality-checked, authentic" },
];

export default function ValueProps() {
  return (
    <section className="border-y border-neutral-200 bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="h-7 w-7 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-neutral-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
