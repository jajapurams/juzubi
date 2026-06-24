import Link from "next/link";
import MegaMenu, { type MegaCol } from "./MegaMenu";

const SAREE_COLS: MegaCol[] = [
  { title: "Roots", items: ["Banarasi", "Kanchipuram Silk", "Paithani", "Patola", "Bengali", "Ikat", "Bandhani"] },
  { title: "Fabric", items: ["Chiffon", "Georgette", "Cotton", "Pure Silk", "Satin", "Linen Sarees", "Net", "Organza Sarees", "Tissue Sarees", "Art Silk"] },
  { title: "Occasion", items: ["Party Wear", "Wedding", "Festive", "Casual", "Cocktail Sarees"] },
  { title: "Work", items: ["Embroidered", "Printed", "Handloom Sarees", "Chikankari", "Kalamkari", "Plain", "Sequins"] },
];

const LEHENGA_COLS: MegaCol[] = [
  { title: "Occasion", items: ["Bridal Wear", "Festival Wear", "Party Wear", "Wedding Wear"], all: "All Occasions" },
  { title: "Style", items: ["Circular Style", "A-Line Lehenga", "Indowestern Lehenga"], all: "All Styles" },
  { title: "Fabric", items: ["Art Silk Lehenga", "Net Lehenga", "Georgette Lehenga", "Velvet Lehenga", "Silk Lehenga"], all: "All Fabrics" },
];

const SALWAR_COLS: MegaCol[] = [
  { title: "Occasion", items: ["Festive Wear", "Party Wear", "Wedding Wear", "Casual Wear", "Bollywood Wear"], all: "All Occasions" },
  { title: "Style", items: ["Anarkali Style", "Straight Style", "Abaya Style", "A-Line Suits", "Pakistani Style", "Punjabi Style"], all: "All Styles" },
  { title: "Fabric", items: ["Chanderi Suits", "Georgette Suits", "Cotton Suits", "Net Suits", "Art Silk Suits"], all: "All Fabrics" },
];

const JEWELLERY_COLS: MegaCol[] = [
  { items: ["Necklace Sets", "Necklaces", "Bangles & Bracelets", "Earrings", "Anklets", "Pendants", "Silk Thread"], all: "All Jewellery" },
];

type Item =
  | { href: string; label: string; accent?: boolean }
  | { mega: { label: string; href: string; cols: MegaCol[]; align?: "left" | "right" } };

const NAV: Item[] = [
  { href: "/category/sale", label: "Sale & Clearance", accent: true },
  { href: "/category/new", label: "New & Trending" },
  { href: "/category/women", label: "Women" },
  { href: "/category/men", label: "Men" },
  { mega: { label: "Sarees", href: "/category/sarees", cols: SAREE_COLS } },
  { mega: { label: "Lehengas", href: "/category/lehengas", cols: LEHENGA_COLS } },
  { mega: { label: "Salwar Kameez", href: "/category/kurtas", cols: SALWAR_COLS } },
  { href: "/category/kids", label: "Kids" },
  { mega: { label: "Jewellery & Accessories", href: "/category/jewellery", cols: JEWELLERY_COLS, align: "right" } },
];

export default function CategoryNav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <ul className="no-scrollbar flex items-center gap-6 overflow-x-auto py-3 text-sm font-bold text-ink md:overflow-visible">
          {NAV.map((i, idx) => (
            <li key={idx} className="whitespace-nowrap">
              {"mega" in i ? (
                <MegaMenu label={i.mega.label} href={i.mega.href} cols={i.mega.cols} align={i.mega.align} />
              ) : (
                <Link href={i.href} className={i.accent ? "text-[#d6006c] hover:opacity-80" : "hover:text-brand"}>
                  {i.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
