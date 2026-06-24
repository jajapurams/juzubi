import sharp from "sharp";

export interface SplitOptions {
  mode: "grid" | "auto";
  rows?: number;
  cols?: number;
  trim?: boolean;
  bgThreshold?: number; // grayscale value at/above which a pixel counts as background
}

// From a per-line "background fraction" array, return the contiguous ranges that
// contain content (background fraction below contentThreshold). Used to find the
// columns/rows occupied by photos, ignoring the gutters and outer margins.
export function detectSegments(
  bgFraction: number[],
  contentThreshold = 0.9,
  minLen = 1,
): [number, number][] {
  const segs: [number, number][] = [];
  let start = -1;
  for (let i = 0; i < bgFraction.length; i++) {
    const isContent = bgFraction[i] < contentThreshold;
    if (isContent && start === -1) start = i;
    if (!isContent && start !== -1) {
      segs.push([start, i - 1]);
      start = -1;
    }
  }
  if (start !== -1) segs.push([start, bgFraction.length - 1]);
  return segs.filter(([s, e]) => e - s + 1 >= minLen);
}

const MAX_CELLS = 60;

// Split a collage image into individual cell images (webp buffers).
export async function splitCollage(input: Buffer, opts: SplitOptions): Promise<Buffer[]> {
  const meta = await sharp(input).rotate().metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) throw new Error("Could not read image dimensions.");

  let colRanges: [number, number][]; // fractions 0..1
  let rowRanges: [number, number][];

  if (opts.mode === "grid") {
    const cols = Math.max(1, Math.min(12, Math.round(opts.cols ?? 2)));
    const rows = Math.max(1, Math.min(12, Math.round(opts.rows ?? 2)));
    colRanges = Array.from({ length: cols }, (_, i) => [i / cols, (i + 1) / cols] as [number, number]);
    rowRanges = Array.from({ length: rows }, (_, i) => [i / rows, (i + 1) / rows] as [number, number]);
  } else {
    // Auto: detect gutters on a downscaled greyscale copy, then map back to full res.
    const maxDim = 800;
    const scale = Math.min(1, maxDim / Math.max(W, H));
    const dw = Math.max(1, Math.round(W * scale));
    const dh = Math.max(1, Math.round(H * scale));
    const { data } = await sharp(input)
      .rotate()
      .greyscale()
      .resize(dw, dh, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const bg = opts.bgThreshold ?? 235;
    const colBg = new Array(dw).fill(0);
    const rowBg = new Array(dh).fill(0);
    for (let y = 0; y < dh; y++) {
      for (let x = 0; x < dw; x++) {
        if (data[y * dw + x] >= bg) {
          colBg[x]++;
          rowBg[y]++;
        }
      }
    }
    for (let x = 0; x < dw; x++) colBg[x] /= dh;
    for (let y = 0; y < dh; y++) rowBg[y] /= dw;

    const colSegs = detectSegments(colBg, 0.9, Math.max(2, Math.round(dw * 0.03)));
    const rowSegs = detectSegments(rowBg, 0.9, Math.max(2, Math.round(dh * 0.03)));
    colRanges = (colSegs.length ? colSegs : [[0, dw - 1]]).map(([s, e]) => [s / dw, (e + 1) / dw]);
    rowRanges = (rowSegs.length ? rowSegs : [[0, dh - 1]]).map(([s, e]) => [s / dh, (e + 1) / dh]);
  }

  const out: Buffer[] = [];
  for (const [rs, re] of rowRanges) {
    for (const [cs, ce] of colRanges) {
      if (out.length >= MAX_CELLS) break;
      const left = Math.min(W - 1, Math.round(cs * W));
      const top = Math.min(H - 1, Math.round(rs * H));
      const width = Math.max(1, Math.min(W - left, Math.round((ce - cs) * W)));
      const height = Math.max(1, Math.min(H - top, Math.round((re - rs) * H)));

      let buf = await sharp(input).rotate().extract({ left, top, width, height }).webp({ quality: 90 }).toBuffer();
      if (opts.trim) {
        try {
          buf = await sharp(buf).trim().webp({ quality: 90 }).toBuffer();
        } catch {
          // uniform cell — keep untrimmed
        }
      }
      out.push(buf);
    }
  }
  return out;
}
