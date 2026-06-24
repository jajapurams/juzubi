import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { isContent } from "@/lib/content-auth";

export const runtime = "nodejs";

// Lists uploaded images so the product form can pick one from the library.
export async function GET() {
  if (!(await isContent())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { blobs } = await list({ prefix: "products/" });
    const images = blobs
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
      .map((b) => b.url);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
