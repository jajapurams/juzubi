import Link from "next/link";
import { notFound } from "next/navigation";
import { requireContent } from "@/lib/content-auth";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "../../../actions";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit product — Juzubi Content Manager" };

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireContent();
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!product) notFound();

  return (
    <div className="max-w-5xl">
      <Link href="/content" className="text-sm text-brand hover:underline">← Back to catalog</Link>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Edit product</h1>
      <p className="mt-1 text-sm text-neutral-500">{product.name}</p>
      <div className="mt-6">
        <ProductForm action={updateProduct} product={product} submitLabel="Save changes" error={error} />
      </div>
    </div>
  );
}
