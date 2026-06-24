import Link from "next/link";
import { requireContent } from "@/lib/content-auth";
import { createProduct } from "../../actions";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add product — Juzubi Content Manager" };

export default async function NewProduct({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireContent();
  const { error } = await searchParams;
  return (
    <div className="max-w-5xl">
      <Link href="/content" className="text-sm text-brand hover:underline">← Back to catalog</Link>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Add product</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} submitLabel="Create product" error={error} rememberLast />
      </div>
    </div>
  );
}
