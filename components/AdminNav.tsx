"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
              active ? "bg-brand text-white" : "text-ink hover:bg-neutral-200"
            }`}
          >
            {i.label}
          </Link>
        );
      })}
      <Link
        href="/content"
        className="mt-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-brand hover:bg-neutral-200 md:mt-3 md:border-t md:border-neutral-200 md:pt-3"
      >
        Content Manager ↗
      </Link>
    </nav>
  );
}
