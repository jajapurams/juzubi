import type { ReactNode } from "react";
import Link from "next/link";
import { isContent } from "@/lib/content-auth";
import { logoutContent } from "./actions";

export const metadata = { title: "Juzubi Content Manager" };

export default async function ContentLayout({ children }: { children: ReactNode }) {
  const authed = await isContent();

  if (!authed) {
    return <div className="min-h-screen bg-neutral-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="flex items-center justify-between border-b border-black/10 bg-ink px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-extrabold uppercase tracking-tight">Juzubi</span>
          <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Content Manager</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-white/80 hover:text-white">
            View store ↗
          </Link>
          <form action={logoutContent}>
            <button className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium hover:bg-white/10">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
    </div>
  );
}
