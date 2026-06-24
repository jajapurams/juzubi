import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subscribers — Juzubi Admin" };

type Sub = { id: string; email: string; created_at: string };

export default async function Subscribers() {
  await requireAdmin();
  let rows: Sub[] = [];
  let err = "";
  try {
    const sb = createAdminClient();
    const { data, error } = await sb
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) err = error.message;
    else rows = (data ?? []) as Sub[];
  } catch {
    err = "Could not connect.";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Subscribers</h1>
          <p className="mt-1 text-sm text-neutral-500">Newsletter signups from the footer.</p>
        </div>
        {!err && rows.length > 0 && (
          <a
            href={`mailto:?bcc=${rows.map((r) => r.email).join(",")}`}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-neutral-100"
          >
            Email all (BCC)
          </a>
        )}
      </div>

      {err ? (
        <div className="mt-6 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Couldn&apos;t load subscribers — this view needs a valid <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel. ({err})
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">No subscribers yet.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{r.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {new Date(r.created_at).toLocaleDateString("en-US")}
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
