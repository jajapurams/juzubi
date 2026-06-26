"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isContent, clearContentCookie } from "@/lib/content-auth";

function fields(fd: FormData) {
  const num = (k: string) => {
    const v = String(fd.get(k) ?? "").trim();
    return v === "" ? null : Number(v);
  };
  return {
    slug: String(fd.get("slug") ?? "").trim(),
    name: String(fd.get("name") ?? "").trim(),
    brand: String(fd.get("brand") ?? "").trim(),
    category: String(fd.get("category") ?? "").trim(),
    price: num("price") ?? 0,
    mrp: num("mrp"),
    rating: num("rating") ?? 4.5,
    reviews: num("reviews") ?? 0,
    badge: String(fd.get("badge") ?? "").trim() || null,
    description: String(fd.get("description") ?? "").trim(),
    image: String(fd.get("image") ?? "").trim(),
    in_stock: fd.get("in_stock") === "on",
    sort_order: num("sort_order") ?? 0,
  };
}

function galleryImages(fd: FormData): string[] {
  return fd.getAll("images").map((v) => String(v)).filter(Boolean);
}

// Fields stored in columns that may not exist until their migration is run
// (saved via a separate, failure-tolerant update so the main save still works).
function extraFields(fd: FormData) {
  return {
    subcategories: fd.getAll("subcategories").map((v) => String(v)).filter(Boolean),
    sizes: fd.getAll("sizes").map((v) => String(v)).filter(Boolean),
  };
}

// weight_oz lives in its own (possibly-not-yet-migrated) column — saved separately
// so a missing column never blocks subcategories/sizes from saving.
function weightVal(fd: FormData): number | null {
  const v = String(fd.get("weight_oz") ?? "").trim();
  return v === "" ? null : Number(v);
}

export async function createProduct(fd: FormData) {
  if (!(await isContent())) redirect("/content/login");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("products").insert(fields(fd)).select("id").single();
  if (error) redirect(`/content/products/new?error=${encodeURIComponent(error.message)}`);
  const imgs = galleryImages(fd);
  if (data?.id) {
    // these columns may not exist until their migration is run — ignore failures
    if (imgs.length) await supabase.from("products").update({ images: imgs }).eq("id", data.id);
    await supabase.from("products").update(extraFields(fd)).eq("id", data.id);
    await supabase.from("products").update({ weight_oz: weightVal(fd) }).eq("id", data.id);
  }
  revalidatePath("/content");
  revalidatePath("/");
  redirect("/content");
}

export async function updateProduct(fd: FormData) {
  if (!(await isContent())) redirect("/content/login");
  const id = String(fd.get("id") ?? "");
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(fields(fd)).eq("id", id);
  if (error) redirect(`/content/products/${id}/edit?error=${encodeURIComponent(error.message)}`);
  // these columns may not exist until their migration is run — ignore failures
  await supabase.from("products").update({ images: galleryImages(fd) }).eq("id", id);
  await supabase.from("products").update(extraFields(fd)).eq("id", id);
  await supabase.from("products").update({ weight_oz: weightVal(fd) }).eq("id", id);
  revalidatePath("/content");
  revalidatePath("/");
  redirect("/content");
}

export async function deleteProduct(fd: FormData) {
  if (!(await isContent())) redirect("/content/login");
  const id = String(fd.get("id") ?? "");
  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/content");
  revalidatePath("/");
  redirect("/content");
}

export async function logoutContent() {
  await clearContentCookie();
  redirect("/content/login");
}
