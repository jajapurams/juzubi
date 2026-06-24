export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string; // matches a CATEGORIES slug
  price: number;
  mrp?: number; // when present and > price, the item is "on sale"
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  image: string;
  images?: string[];
  sizes?: string[]; // available sizes (empty = all of the category's sizes)
  subcategories?: string[];
};

// NOTE: images use picsum.photos placeholders so nothing is ever broken.
// Drop real product photos into /public/products and swap the `image` paths
// (e.g. "/products/banarasi-silk.jpg") when you have them.
function img(seed: string): string {
  return `https://picsum.photos/seed/${seed}/700/875`;
}

export const PRODUCTS: Product[] = [
  // ---- Sarees ----
  {
    id: "s1", slug: "banarasi-silk-saree", name: "Banarasi Silk Saree with Zari Border",
    brand: "Juzubi Signature", category: "sarees", price: 4499, mrp: 6999,
    rating: 4.7, reviews: 128, badge: "Bestseller",
    description: "Handwoven Banarasi silk with intricate gold zari work and a contrast pallu. Comes with an unstitched blouse piece.",
    image: img("juzubi-saree-1"),
  },
  {
    id: "s2", slug: "kanjivaram-pure-silk-saree", name: "Kanjivaram Pure Silk Saree",
    brand: "Riwaaz", category: "sarees", price: 8999, mrp: 11999,
    rating: 4.9, reviews: 76, badge: "Premium",
    description: "Temple-border Kanjivaram in pure mulberry silk. A timeless drape for weddings and festivals.",
    image: img("juzubi-saree-2"),
  },
  {
    id: "s3", slug: "organza-floral-saree", name: "Organza Floral Print Saree",
    brand: "Anaya", category: "sarees", price: 2499,
    rating: 4.4, reviews: 53,
    description: "Lightweight organza with delicate floral prints and a satin border. Easy, elegant and perfect for day events.",
    image: img("juzubi-saree-3"),
  },
  {
    id: "s4", slug: "cotton-handloom-saree", name: "Cotton Handloom Saree",
    brand: "Mulmul", category: "sarees", price: 1299, mrp: 1799,
    rating: 4.3, reviews: 211, badge: "New",
    description: "Breathable handloom cotton with a woven temple border. Your everyday-ethnic staple.",
    image: img("juzubi-saree-4"),
  },

  // ---- Lehengas & Bridal ----
  {
    id: "l1", slug: "bridal-velvet-lehenga", name: "Bridal Velvet Lehenga Set",
    brand: "Juzubi Couture", category: "lehengas", price: 24999, mrp: 32999,
    rating: 4.8, reviews: 41, badge: "Bridal",
    description: "Hand-embroidered velvet lehenga with zardozi work, matching blouse and net dupatta. Made to make the day unforgettable.",
    image: img("juzubi-lehenga-1"),
  },
  {
    id: "l2", slug: "sequin-party-lehenga", name: "Sequin Party Lehenga",
    brand: "Anaya", category: "lehengas", price: 7999, mrp: 10999,
    rating: 4.6, reviews: 64,
    description: "All-over sequin lehenga with a flared silhouette. The showstopper for sangeet and receptions.",
    image: img("juzubi-lehenga-2"),
  },
  {
    id: "l3", slug: "festive-georgette-lehenga", name: "Festive Georgette Lehenga",
    brand: "Riwaaz", category: "lehengas", price: 5499,
    rating: 4.5, reviews: 88, badge: "Bestseller",
    description: "Flowy georgette lehenga with thread embroidery — festive-ready without the weight.",
    image: img("juzubi-lehenga-3"),
  },

  // ---- Kurtas & Suits ----
  {
    id: "k1", slug: "anarkali-kurta-set", name: "Anarkali Kurta Set with Dupatta",
    brand: "Mulmul", category: "kurtas", price: 2999, mrp: 3999,
    rating: 4.6, reviews: 174, badge: "Bestseller",
    description: "Floor-length Anarkali with intricate yoke embroidery, churidar and a chiffon dupatta.",
    image: img("juzubi-kurta-1"),
  },
  {
    id: "k2", slug: "chikankari-cotton-kurta", name: "Chikankari Cotton Kurta",
    brand: "Anaya", category: "kurtas", price: 1499,
    rating: 4.5, reviews: 309, badge: "New",
    description: "Authentic Lucknowi chikankari hand-embroidery on soft cotton. Cool, classic, everyday luxe.",
    image: img("juzubi-kurta-2"),
  },
  {
    id: "k3", slug: "printed-straight-kurta", name: "Printed Straight Kurta",
    brand: "Juzubi Everyday", category: "kurtas", price: 899, mrp: 1299,
    rating: 4.2, reviews: 421,
    description: "Easy straight-cut kurta in a contemporary print. A wardrobe workhorse at a friendly price.",
    image: img("juzubi-kurta-3"),
  },
  {
    id: "k4", slug: "silk-kurta-palazzo", name: "Silk Kurta with Palazzo Set",
    brand: "Riwaaz", category: "kurtas", price: 3499, mrp: 4499,
    rating: 4.7, reviews: 96,
    description: "Art-silk kurta paired with flowing palazzos and a dupatta — graceful for festive occasions.",
    image: img("juzubi-kurta-4"),
  },

  // ---- Jewellery & Accessories ----
  {
    id: "j1", slug: "kundan-choker-set", name: "Kundan Choker Necklace Set",
    brand: "Juzubi Jewels", category: "jewellery", price: 1999, mrp: 2999,
    rating: 4.6, reviews: 142, badge: "Bestseller",
    description: "Statement kundan choker with matching earrings and maang tikka. Bridal-grade sparkle.",
    image: img("juzubi-jewel-1"),
  },
  {
    id: "j2", slug: "oxidised-jhumkas", name: "Oxidised Silver Jhumkas",
    brand: "Anaya", category: "jewellery", price: 499,
    rating: 4.4, reviews: 528, badge: "New",
    description: "Lightweight oxidised jhumkas with ghungroo drops — pair them with kurtas and sarees alike.",
    image: img("juzubi-jewel-2"),
  },
  {
    id: "j3", slug: "temple-jewellery-set", name: "Temple Jewellery Necklace Set",
    brand: "Riwaaz", category: "jewellery", price: 2799, mrp: 3499,
    rating: 4.8, reviews: 67,
    description: "South-Indian temple-style necklace and jhumkas in antique gold finish.",
    image: img("juzubi-jewel-3"),
  },
  {
    id: "j4", slug: "embroidered-potli-bag", name: "Embroidered Potli Bag",
    brand: "Juzubi Jewels", category: "jewellery", price: 799, mrp: 1099,
    rating: 4.3, reviews: 113,
    description: "Hand-embroidered potli with bead and zari detailing — the finishing touch for festive looks.",
    image: img("juzubi-jewel-4"),
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(slug: string): Product[] {
  if (slug === "sale") return PRODUCTS.filter((p) => p.mrp && p.mrp > p.price);
  return PRODUCTS.filter((p) => p.category === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export function discountPct(p: Product): number | null {
  if (!p.mrp || p.mrp <= p.price) return null;
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}
