import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { isContent } from "@/lib/content-auth";

export const runtime = "nodejs";
export const maxDuration = 60; // remove.bg can take a few seconds

// Calls remove.bg to cut out the background. Returns a PNG buffer with a
// transparent background, or null if the service is unavailable / out of credits.
async function removeBackground(input: Buffer, filename: string): Promise<Buffer | null> {
  const key = process.env.REMOVE_BG_API_KEY;
  if (!key) return null;
  try {
    const form = new FormData();
    form.append("image_file", new Blob([new Uint8Array(input)]), filename || "image.jpg");
    form.append("size", "auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": key },
      body: form,
    });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

// Accepts an image file, auto-corrects it (auto-orient, resize, compress, convert
// to webp) for a consistent website look, optionally removes the background, stores
// it on Vercel Blob, returns the URL.
export async function POST(req: Request) {
  if (!(await isContent())) {
    return NextResponse.json({ error: "Not signed in to Content Manager." }, { status: 401 });
  }

  let file: File | null = null;
  let wantRemoveBg = false;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
    wantRemoveBg = String(form.get("removeBg") ?? "") === "true";
  } catch {
    return NextResponse.json({ error: "Bad upload." }, { status: 400 });
  }
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "That file is not an image." }, { status: 400 });

  let optimized: Buffer;
  let bgRemoved = false;
  try {
    const input = Buffer.from(await file.arrayBuffer());

    // Optionally strip the background first (best for flat product shots).
    let working: Buffer<ArrayBufferLike> = input;
    if (wantRemoveBg) {
      const cut = await removeBackground(input, file.name);
      if (cut) {
        working = cut;
        bgRemoved = true;
      }
    }

    const pipeline = sharp(working)
      .rotate() // honour EXIF orientation (phone photos)
      .resize({ width: 1200, height: 1500, fit: "inside", withoutEnlargement: true })
      .modulate({ saturation: 1.08 }) // slightly more vivid colours
      .sharpen(); // crisper detail

    // Preserve transparency when the background was removed; otherwise flatten to webp.
    optimized = await pipeline.webp({ quality: 82, alphaQuality: 100 }).toBuffer();
  } catch {
    return NextResponse.json({ error: "Could not process that image." }, { status: 400 });
  }

  try {
    const key = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const blob = await put(key, optimized, { access: "public", contentType: "image/webp" });
    return NextResponse.json({ url: blob.url, bgRemoved, wantRemoveBg });
  } catch {
    return NextResponse.json({ error: "Upload failed. Is Blob storage connected?" }, { status: 500 });
  }
}
