"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, clearAdminCookie } from "@/lib/admin-auth";

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

export async function createProduct(fd: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").insert(fields(fd));
  if (error) redirect(`/admin/products/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProduct(fd: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(fd.get("id") ?? "");
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(fields(fd)).eq("id", id);
  if (error) redirect(`/admin/products/${id}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProduct(fd: FormData) {
  if (!(await isAdmin())) redirect("/admin/login");
  const id = String(fd.get("id") ?? "");
  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin/login");
}
