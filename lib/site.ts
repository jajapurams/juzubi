// Online purchasing (cart + Stripe checkout). Set to `false` to temporarily
// turn off cart & checkout (store stays browsable; WhatsApp ordering works).
export const PURCHASING_ENABLED = true;

export const SITE = {
  name: "JUZUBI",
  tagline: "Handpicked Indian boutique wear",
  // WhatsApp number — country code first, digits only, no "+" or spaces.
  whatsapp: "13025611092",
  email: "contact@juzubi.com",
  phoneDisplay: "+1 302 561 1092",
  freeShipOver: 75,
  city: "United States",
  instagram: "https://www.instagram.com/juzubi_fashions/",
  facebook: "https://www.facebook.com/Juzubifashions/",
  youtube: "https://www.youtube.com/@Juzubi",
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "sarees",
    name: "Sarees",
    blurb: "Silk, cotton & designer drapes",
    image: "https://images.pexels.com/photos/7920055/pexels-photo-7920055.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "lehengas",
    name: "Lehengas",
    blurb: "Festive & celebration couture",
    image: "https://images.pexels.com/photos/12791932/pexels-photo-12791932.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "kurtas",
    name: "Salwar Kameez",
    blurb: "Anarkali, straight & A-line suits",
    image: "https://images.pexels.com/photos/17154861/pexels-photo-17154861.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "jewellery",
    name: "Jewellery & Accessories",
    blurb: "Jewellery, bags & dupattas",
    image: "https://images.pexels.com/photos/33154729/pexels-photo-33154729.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

// Subcategories per category — shown as a dependent dropdown when adding a
// product. Sourced from the nav mega-menus (components/CategoryNav.tsx).
export const SUBCATEGORIES: Record<string, string[]> = {
  sarees: [
    "Banarasi", "Kanchipuram Silk", "Paithani", "Patola", "Bengali", "Ikat", "Bandhani",
    "Chiffon", "Georgette", "Cotton", "Pure Silk", "Satin", "Linen", "Net", "Organza", "Tissue", "Art Silk",
    "Party Wear", "Wedding", "Festive", "Casual", "Cocktail",
    "Embroidered", "Printed", "Handloom", "Chikankari", "Kalamkari", "Plain", "Sequins",
  ],
  lehengas: [
    "Bridal Wear", "Festival Wear", "Party Wear", "Wedding Wear",
    "Circular Style", "A-Line", "Indowestern",
    "Art Silk", "Net", "Georgette", "Velvet", "Silk",
  ],
  kurtas: [
    "Festive Wear", "Party Wear", "Wedding Wear", "Casual Wear", "Bollywood Wear",
    "Anarkali", "Straight", "Abaya", "A-Line", "Pakistani", "Punjabi",
    "Chanderi", "Georgette", "Cotton", "Net", "Art Silk",
  ],
  jewellery: ["Necklace Sets", "Necklaces", "Bangles & Bracelets", "Earrings", "Anklets", "Pendants", "Silk Thread"],
  men: ["Kurta Pajama", "Sherwani", "Nehru Jacket", "Shirts", "Accessories"],
  kids: ["Girls Lehenga", "Girls Frock", "Girls Kurta", "Boys Kurta", "Boys Sherwani"],
};

// Size options by category. Adult sizes for lehengas/salwar-kameez; age-based
// sizes for kids; nothing for sarees/jewellery/etc.
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const KIDS_SIZES = [
  "3 to 4 years", "4 to 5 years", "5 to 6 years", "6 to 7 years", "7 to 8 years", "8 to 9 years",
  "9 to 10 years", "10 to 11 years", "11 to 12 years", "12 to 13 years", "13 to 14 years", "14 to 15 years",
];

export function sizeKind(category: string): "adult" | "kids" | null {
  if (category === "kids") return "kids";
  if (category === "lehengas" || category === "kurtas") return "adult";
  return null;
}

export function sizesFor(category: string): string[] {
  const k = sizeKind(category);
  return k === "kids" ? KIDS_SIZES : k === "adult" ? ADULT_SIZES : [];
}

const SPECIAL_NAMES: Record<string, string> = {
  sale: "Sale & Clearance",
  new: "New & Trending",
  women: "Women",
  men: "Men",
  kids: "Kids",
};

export function categoryName(slug: string): string {
  return SPECIAL_NAMES[slug] ?? CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function usd(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function waLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
