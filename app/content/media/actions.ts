"use server";

import { list, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isContent } from "@/lib/content-auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteBlob(fd: FormData) {
  if (!(await isContent())) redirect("/content/login");
  const url = String(fd.get("url") ?? "");
  if (url) await del(url);
  revalidatePath("/content/media");
}

export async function deleteUnused() {
  if (!(await isContent())) redirect("/content/login");
  const { blobs } = await list({ prefix: "products/" });
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("image");
  const used = new Set((data ?? []).map((p) => p.image).filter(Boolean));
  const orphans = blobs.filter((b) => !used.has(b.url)).map((b) => b.url);
  if (orphans.length) await del(orphans);
  revalidatePath("/content/media");
}
