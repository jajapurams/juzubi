import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <PromoBar />
      <Header />
      <CategoryNav />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
