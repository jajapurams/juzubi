import type { ReactNode } from "react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "./actions";
import AdminNav from "@/components/AdminNav";

export const metadata = { title: "Juzubi Admin" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAdmin();

  if (!authed) {
    // Login page renders bare (no admin shell).
    return <div className="min-h-screen bg-neutral-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="flex items-center justify-between border-b border-black/10 bg-ink px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-extrabold uppercase tracking-tight">Juzubi</span>
          <span className="rounded bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Admin</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-white/80 hover:text-white">
            View store ↗
          </Link>
          <form action={logoutAdmin}>
            <button className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium hover:bg-white/10">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="md:flex md:gap-6">
          <aside className="mb-4 md:mb-0 md:w-52 md:shrink-0">
            <AdminNav />
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
