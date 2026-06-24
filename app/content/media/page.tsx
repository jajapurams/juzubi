import Link from "next/link";
import { list } from "@vercel/blob";
import { requireContent } from "@/lib/content-auth";
import { createClient } from "@/lib/supabase/server";
import BulkUploader from "@/components/BulkUploader";
import CopyButton from "@/components/CopyButton";
import ConfirmButton from "@/components/ConfirmButton";
import { deleteBlob, deleteUnused } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Media — Juzubi Content Manager" };

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function MediaPage() {
  await requireContent();

  let blobs: { url: string; pathname: string; size: number }[] = [];
  let err = "";
  try {
    const res = await list({ prefix: "products/" });
    blobs = res.blobs;
  } catch {
    err = "Could not load Blob storage.";
  }

  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("image");
  const used = new Set((products ?? []).map((p) => p.image).filter(Boolean));

  const totalBytes = blobs.reduce((s, b) => s + b.size, 0);
  const unusedCount = blobs.filter((b) => !used.has(b.url)).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Media library</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {blobs.length} images · {fmtSize(totalBytes)} used · {unusedCount} unused
          </p>
        </div>
        <Link href="/content" className="text-sm font-medium text-brand hover:underline">← Back to catalog</Link>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <BulkUploader />
      </div>

      {err && <p className="mt-4 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800">{err}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">All images</h2>
        {unusedCount > 0 && (
          <form action={deleteUnused}>
            <ConfirmButton
              message={`Delete all ${unusedCount} unused image(s) from storage? This cannot be undone.`}
              className="rounded-full border border-sale px-4 py-2 text-sm font-semibold text-sale hover:bg-sale hover:text-white"
            >
              Delete all unused ({unusedCount})
            </ConfirmButton>
          </form>
        )}
      </div>

      {blobs.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">No images uploaded yet. Use the box above to add some.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {blobs.map((b) => {
            const inUse = used.has(b.url);
            return (
              <div key={b.url} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.url} alt="" className="aspect-[4/5] w-full object-cover" />
                  <span
                    className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold ${inUse ? "bg-green-600 text-white" : "bg-neutral-200 text-neutral-600"}`}
                  >
                    {inUse ? "In use" : "Unused"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <CopyButton text={b.url} className="text-xs font-medium text-brand hover:underline" />
                  <form action={deleteBlob}>
                    <input type="hidden" name="url" value={b.url} />
                    <ConfirmButton
                      message={inUse ? "This image is used by a product. Delete it anyway?" : "Delete this image from storage?"}
                      className="text-xs font-medium text-sale hover:underline"
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </div>
                <p className="px-2 pb-1.5 text-[10px] text-neutral-400">{fmtSize(b.size)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
