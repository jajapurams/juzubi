import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries — Juzubi Admin" };

type Enquiry = {
  id: string;
  product_name: string | null;
  product_slug: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default async function Enquiries() {
  await requireAdmin();
  let rows: Enquiry[] = [];
  let err = "";
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) err = error.message;
    else rows = (data ?? []) as Enquiry[];
  } catch {
    err = "Could not connect.";
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Enquiries</h1>
      <p className="mt-1 text-sm text-neutral-500">Every &ldquo;Order on WhatsApp&rdquo; click is logged here.</p>

      {err ? (
        <div className="mt-6 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Couldn&apos;t load enquiries — this view needs a valid <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel. ({err})
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">No enquiries yet.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {new Date(r.created_at).toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{r.product_name ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-600">{r.message ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-700">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
