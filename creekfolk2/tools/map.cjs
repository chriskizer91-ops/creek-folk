// A map of a simulated valley from above, as a PNG: shaded ground, green and brown,
// marsh, standing and running water, the branches, structures and creekfolk.
// For checking the simulation without the renderer.
//
//   node tools/map.cjs [seed=cf2-a] [days=0] [out=runs/map.png] [px per m=3]
//   node tools/map.cjs --save runs/x.json [out] [px]     (a saved world)
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const S = require(path.join(__dirname, "../dist/sim.cjs"));

function png(w, h, rgb) {
  const crc = (buf) => {
    let c, t = crc.t || (crc.t = Array.from({ length: 256 }, (_, n) => { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; }));
    let x = 0xffffffff;
    for (const b of buf) x = t[(x ^ b) & 0xff] ^ (x >>> 8);
    return (x ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

function render(w, file, P = 3) {
  const T = w.terrain, VW = S.VW, VL = S.VL, W = VW * P, H = VL * P, img = Buffer.alloc(W * H * 3);
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const put = (x, y, c, a = 1) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const o = (y * W + x) * 3; for (let i = 0; i < 3; i++) img[o + i] = Math.round(img[o + i] * (1 - a) + c[i] * a); };
  const greenC = [96, 140, 74], brown = [168, 140, 92], marsh = [70, 110, 92], water = [70, 130, 170], rock = [196, 190, 176];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const mx = (x + 0.5) / P, mz = (y + 0.5) / P, cx = Math.floor(mx), cz = Math.floor(mz), k = cz * VW + cx;
      const h = T.heightAt(mx, mz), hx = T.heightAt(mx + 0.5, mz) - T.heightAt(mx - 0.5, mz), hz = T.heightAt(mx, mz + 0.5) - T.heightAt(mx, mz - 0.5);
      const shade = Math.max(0.35, Math.min(1.3, 1 - 0.9 * hx - 0.6 * hz)), band = 0.94 + 0.06 * Math.cos(h * Math.PI * 4);
      let c = mix(brown, greenC, w.green ? w.green[k] : 0.6);
      const r = T.rock[Math.round(mz) * (VW + 1) + Math.round(mx)];
      if (r) c = mix(c, rock, 0.75);
      if (w.wet && w.wet[k] > 0.05) c = mix(c, marsh, Math.min(1, w.wet[k]));
      c = c.map((v) => v * shade * band);
      const wt = w.wt ? w.wt[k] : -1e9;
      if (wt > h + 0.005) c = mix(c, water, Math.min(1, 0.45 + (wt - h) * 3));
      put(x, y, c);
    }
  // the creek's water ribbon from the nodes (where it runs or stands)
  for (const n of w.creek.nodes) {
    if (n.z < 0 || n.z > VL) continue;
    const y = Math.round(n.z * P), wet = n.wl > n.bed + 0.01;
    if (!wet) continue;
    const hw = 0.5 * Math.max(0.3, n.wb + 2 * n.m * Math.min(n.wl - n.bed, n.fp - n.bed));
    for (let dy = -P; dy <= P; dy++) for (let x = Math.round((n.x - hw) * P); x <= Math.round((n.x + hw) * P); x++) put(x, y + dy, n.q > 2e-5 ? [60, 120, 190] : [40, 90, 140], 0.9);
  }
  // branches' water
  for (const b of Object.values(T.branches))
    for (let i = 0; i < b.n; i += 1) {
      const ws = S.cf2BranchWater ? S.cf2BranchWater(w, b, i) : null;
      const c = ws == null ? [210, 200, 170] : [70, 150, 200];
      put(Math.round(b.X[i] * P), Math.round(b.Z[i] * P), c, 0.9);
    }
  // dams, structures, creekfolk
  for (const s of w.structures) {
    const R = Math.max(1, (S.STRUCTURES[s.kind] ? S.STRUCTURES[s.kind].radius : 1) * P * 0.7), c = s.kind === "dam" ? [120, 80, 40] : s.kind === "home" ? [200, 90, 60] : s.kind === "garden" ? [150, 200, 90] : [220, 220, 220];
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) if (dx * dx + dy * dy <= R * R) put(Math.round(s.x * P + dx), Math.round(s.z * P + dy), c, s.level > 0 ? 1 : 0.5);
  }
  for (const r of w.res) {
    const c = r.kind === "tree" ? [30, 70, 40] : r.kind === "podtree" ? [60, 90, 30] : r.kind === "bush" ? [80, 120, 60] : r.kind === "reeds" ? [120, 150, 80] : r.kind === "stones" || r.kind === "boulder" ? [130, 130, 130] : r.kind === "clay" ? [170, 110, 70] : r.kind === "grove" ? [20, 50, 20] : [200, 200, 120];
    const R = r.kind === "tree" || r.kind === "grove" ? Math.max(1, (r.canopy || 1.5) * P * 0.6) : P * 0.5;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) if (dx * dx + dy * dy <= R * R) put(Math.round(r.x * P + dx), Math.round(r.z * P + dy), c, 0.85);
  }
  for (const c of w.creatures) {
    if (c.away) continue;
    const R = Math.max(1, P * 0.45);
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) if (dx * dx + dy * dy <= R * R) put(Math.round(c.x * P + dx), Math.round(c.z * P + dy), [255, 240, 60]);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, png(W, H, img));
  return file;
}

if (require.main === module) {
  const a = process.argv.slice(2);
  let w, out, P;
  if (a[0] === "--save") { w = S.loadWorld(fs.readFileSync(a[1], "utf8")); out = a[2] || "runs/map.png"; P = +(a[3] || 3); }
  else {
    const seed = a[0] || "cf2-a", days = +(a[1] || 0);
    out = a[2] || "runs/map.png"; P = +(a[3] || 3);
    w = S.newValley(seed, { calStart: Date.parse("2026-10-20T15:00:00Z"), tzMin: 300 });
    if (days > 0) S.runUntil(w, days * 86400);
  }
  console.log(render(w, out, P), `day ${(w.t / 86400).toFixed(2)}`, `${w.creatures.length} creekfolk`, `wet now ${w.creek.wetNow}`);
}
module.exports = { render };
