import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Juzubi — Indian Boutique | Sarees, Lehengas, Kurtas & Jewellery",
  description:
    "Juzubi is a US-based Indian boutique for handpicked sarees, lehengas, kurtas and jewellery. Browse the collection and order on WhatsApp.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
