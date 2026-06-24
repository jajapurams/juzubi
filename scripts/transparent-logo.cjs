// Make the OUTER background transparent while keeping the face SOLID WHITE.
// Method: treat coloured artwork as walls, morphologically close gaps (dilate by D),
// flood the outside, then keep enclosed white (the face) as solid white and drop
// the rest — eroding back by D so there's no white halo around the artwork.
// Usage: node scripts/transparent-logo.cjs [D]
const Jimp = require("jimp");
const D = parseInt(process.argv[2] || "20", 10);

(async () => {
  const img = await Jimp.read("public/logo.jpg");
  const { width: w, height: h, data } = img.bitmap;
  const N = w * h;
  const isWhite = (i) => data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232;

  const art = new Uint8Array(N);
  for (let p = 0; p < N; p++) if (!isWhite(p * 4)) art[p] = 1;

  // chamfer distance transform from a boolean source set
  function dt(src) {
    const INF = 1e9, d = new Float64Array(N), a = 1, b = Math.SQRT2;
    for (let p = 0; p < N; p++) d[p] = src[p] ? 0 : INF;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const p = y * w + x; let v = d[p];
      if (x > 0) v = Math.min(v, d[p - 1] + a);
      if (y > 0) v = Math.min(v, d[p - w] + a);
      if (x > 0 && y > 0) v = Math.min(v, d[p - w - 1] + b);
      if (x < w - 1 && y > 0) v = Math.min(v, d[p - w + 1] + b);
      d[p] = v;
    }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
      const p = y * w + x; let v = d[p];
      if (x < w - 1) v = Math.min(v, d[p + 1] + a);
      if (y < h - 1) v = Math.min(v, d[p + w] + a);
      if (x < w - 1 && y < h - 1) v = Math.min(v, d[p + w + 1] + b);
      if (x > 0 && y < h - 1) v = Math.min(v, d[p + w - 1] + b);
      d[p] = v;
    }
    return d;
  }

  const distArt = dt(art);
  const maskD = new Uint8Array(N);
  for (let p = 0; p < N; p++) maskD[p] = distArt[p] <= D ? 1 : 0;

  // outside = flood from the border over non-mask pixels
  const outside = new Uint8Array(N), st = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (!outside[p] && !maskD[p]) { outside[p] = 1; st.push(p); }
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (st.length) { const p = st.pop(), x = p % w, y = (p - x) / w; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }

  const distOut = dt(outside);

  let faceKept = 0;
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    if (art[p]) { data[i + 3] = 255; }                 // artwork stays
    else if (!outside[p] && distOut[p] > D) {           // enclosed white = face
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
      faceKept++;
    } else { data[i + 3] = 0; }                         // outer background
  }

  await img.writeAsync("public/logo.png");
  const alpha = (x, y) => data[(y * w + x) * 4 + 3];
  console.log(`D=${D} faceKept=${faceKept} faceCenterAlpha=${alpha(Math.round(w * 0.5), Math.round(h * 0.6))} cornerAlpha=${alpha(2, 2)}`);
})();
