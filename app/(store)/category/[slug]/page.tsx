import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, categoryName } from "@/lib/site";
import { getProductsByCategory } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${categoryName(slug)} — Juzubi` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const SPECIAL = ["sale", "new", "women", "men", "kids"];
  const isKnown = SPECIAL.includes(slug) || CATEGORIES.some((c) => c.slug === slug);
  if (!isKnown) notFound();

  const products = await getProductsByCategory(slug);
  const name = categoryName(slug);
  const SPECIAL_BLURBS: Record<string, string> = {
    sale: "Boutique pieces at limited-time prices.",
    new: "Fresh arrivals and trending styles.",
    women: "Everything in women's ethnic wear.",
    men: "Men's ethnic wear — coming soon.",
    kids: "Kids' ethnic wear — coming soon.",
  };
  const blurb = SPECIAL_BLURBS[slug] ?? CATEGORIES.find((c) => c.slug === slug)?.blurb;

  return <ProductGrid products={products} title={name} subtitle={blurb} />;
}
