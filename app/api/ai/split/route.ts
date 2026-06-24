import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isContent } from "@/lib/content-auth";
import { splitCollage, type SplitOptions } from "@/lib/ai/collage";

export const runtime = "nodejs";
export const maxDuration = 60;

// Split an uploaded collage into individual product images. Deterministic — no AI.
// Outputs are stored under products/ so they appear in the image library + picker.
export async function POST(req: Request) {
  if (!(await isContent())) {
    return NextResponse.json({ error: "Not signed in to Content Manager." }, { status: 401 });
  }

  let file: File | null = null;
  let opts: SplitOptions = { mode: "auto" };
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
    opts = {
      mode: String(form.get("mode") ?? "auto") === "grid" ? "grid" : "auto",
      rows: Number(form.get("rows") ?? 2),
      cols: Number(form.get("cols") ?? 2),
      trim: String(form.get("trim") ?? "") === "true",
    };
  } catch {
    return NextResponse.json({ error: "Bad upload." }, { status: 400 });
  }
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "That file is not an image." }, { status: 400 });

  let parts: Buffer[];
  try {
    const input = Buffer.from(await file.arrayBuffer());
    parts = await splitCollage(input, opts);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not split that image." }, { status: 400 });
  }

  if (parts.length === 0) {
    return NextResponse.json({ error: "No images detected. Try the manual grid mode." }, { status: 400 });
  }

  try {
    const stamp = Date.now();
    const images: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const key = `products/split-${stamp}-${i}-${Math.random().toString(36).slice(2, 6)}.webp`;
      const blob = await put(key, parts[i], { access: "public", contentType: "image/webp" });
      images.push(blob.url);
    }
    return NextResponse.json({ images, count: images.length });
  } catch {
    return NextResponse.json({ error: "Upload failed. Is Blob storage connected?" }, { status: 500 });
  }
}
