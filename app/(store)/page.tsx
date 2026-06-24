import Hero from "@/components/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import PromoGrid from "@/components/PromoGrid";
import ValueProps from "@/components/ValueProps";
import { getAllProducts, getProductsByCategory } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getAllProducts();
  const sale = await getProductsByCategory("sale");
  return (
    <>
      <Hero />
      <CategoryTiles />
      <ProductGrid
        title="New Arrivals"
        subtitle="Fresh off the rack, handpicked for you"
        products={all.slice(0, 8)}
        viewAllHref="/category/sarees"
      />
      <PromoGrid />
      <PromoBanner />
      <ProductGrid
        title="On Sale Now"
        subtitle="Limited-time boutique prices"
        products={sale.slice(0, 8)}
        viewAllHref="/category/sale"
      />
      <ValueProps />
    </>
  );
}
