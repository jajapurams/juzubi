import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Juzubi Admin" };

async function countPublic(table: string): Promise<number | null> {
  try {
    const sb = await createClient();
    const { count, error } = await sb.from(table).select("*", { count: "exact", head: true });
    return error ? null : count ?? 0;
  } catch {
    return null;
  }
}

async function countAdmin(table: string): Promise<number | null> {
  try {
    const sb = createAdminClient();
    const { count, error } = await sb.from(table).select("*", { count: "exact", head: true });
    return error ? null : count ?? 0;
  } catch {
    return null;
  }
}

function Card({ label, value, href, hint }: { label: string; value: string; href: string; hint?: string }) {
  return (
    <Link href={href} className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-brand hover:shadow-sm">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </Link>
  );
}

export default async function Dashboard() {
  await requireAdmin();
  const products = await countPublic("products");
  const enquiries = await countAdmin("enquiries");
  const subscribers = await countAdmin("newsletter_subscribers");

  const needsKey = enquiries === null || subscribers === null;

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">Manage your Juzubi store.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card label="Products" value={products?.toString() ?? "—"} href="/content" hint="Open Content Manager" />
        <Card label="Enquiries" value={enquiries?.toString() ?? "—"} href="/admin/enquiries" hint="WhatsApp orders logged" />
        <Card label="Subscribers" value={subscribers?.toString() ?? "—"} href="/admin/subscribers" hint="Newsletter signups" />
      </div>

      {needsKey && (
        <div className="mt-6 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Enquiries &amp; subscribers need a valid Supabase secret key. Set a fresh{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in the juzubi Vercel project and redeploy to see those numbers.
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/content" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            Open Content Manager
          </Link>
          <Link href="/content/products/new" className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-neutral-100">
            + Add product
          </Link>
        </div>
      </div>
    </div>
  );
}
