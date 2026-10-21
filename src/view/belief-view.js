// ==========================================================================
// The view of belief and the temple (Phase 3B): the temple and the Hall of the
// Ancestors as they rise part by part; the living gifts (flowers, goats, bees,
// fish, birds); offerings and the lantern at the Giving Place; the starry
// night, the rainbow and snow; the one who believes in you waving; and the
// village panel's Temple tab.
//
// Everything here reads the world and never changes it.
// ==========================================================================

var FLOWER_COLOR = { bluebell: 0x6f86e0, poppy: 0xe0483a, marigold: 0xf0a020, lupin: 0xb070d8, daisy: 0xf6f3e8, iris: 0x7b5bd0 };
var FISH_COLOR = { minnow: 0xb8c4b0, trout: 0x9a8a6a, sunfish: 0xe0a040, loach: 0x6a5a40 };
var BIRD_COLOR = { wren: 0x8a6a4a, swallow: 0x2a3550, kingfisher: 0x2a8ac0, finch: 0xd0a030, lark: 0xa08060, owl: 0x9a8a78 };
var GOAT_COAT = [0xf0e8d8, 0x8a6a4a, 0x3a3430, 0xd8c8a0];
var OFFERING_COLOR = { bead: 0xb08050, flower: 0xe07090, pebble: 0x9aa4b0, ring: 0xc8b060, feather: 0xf4f0e8, shell: 0xe8d8c8, whistle: 0xc0b070, figure: 0xc87850, water: 0x7ab8e0 };

// ---- weather from gifts (also used by land.js) ----
function snowLevel(w) {
  let s = w.snow;
  if (!s || w.t >= s.until || w.t < s.t0) return 0;
  let p = (w.t - s.t0) / (s.until - s.t0);
  return clamp(p / 0.08, 0, 1) * clamp((1 - p) / 0.3, 0, 1);
}
function starryLevel(w) {
  let s = w.starry;
  if (!s || w.t < s.from || w.t >= s.until) return 0;
  return clamp((w.t - s.from) / 120, 0, 1) * clamp((s.until - w.t) / 120, 0, 1);
}
function rainbowLevel(w) {
  let r = w.rainbow;
  if (!r || w.t < r.from || w.t >= r.until) return 0;
  return clamp((w.t - r.from) / 60, 0, 1) * clamp((r.until - w.t) / 90, 0, 1);
}

// ---------------------------------------------------------------------------
// The temple: shrine in front, hall in the middle, crown (a stepped pyramid) at
// the back, its sun gate facing their midwinter sunrise (local +z).
// ---------------------------------------------------------------------------
function greatPartsFn(level, b, prog) {
  return (L, k) => (L < level || (b && b.level === L && k < b.stage) ? 1 : b && b.level === L && k === b.stage && !b.locked && prog > 0 ? Math.max(0.15, prog) : 0);
}

function templeBits(r, f) {
  return {
    f,
    stone: PALETTE.stone,
    stone2: PALETTE.stone2,
    P: (g, c, o) => r.push(part(g, c, o)),
  };
}

function drawShrine(r, f) {
  let { stone, stone2, P } = templeBits(r, f);
  // ---- the shrine (z = -3.4)
  let sz = -3.4;
  if (f(0, 0)) P(lt(0.75, 0.35 * f(0, 0), 0.6), stone2, { y: 0.17 * f(0, 0), z: sz });
  if (f(0, 1)) for (let i = 0; i < Math.round(5 * f(0, 1)); i++) P(on(0.24), i % 2 ? stone : stone2, { x: Math.cos(i * 1.26) * 0.55, y: 0.2, z: sz + Math.sin(i * 1.26) * 0.55, sy: 0.75 });
  if (f(0, 2)) for (let i = 0; i < Math.round(4 * f(0, 2)); i++) P(on(0.21), i % 2 ? stone2 : stone, { x: Math.cos(i * 1.57 + 0.4) * 0.42, y: 0.5, z: sz + Math.sin(i * 1.57 + 0.4) * 0.42, sy: 0.75 });
  if (f(0, 3)) P(lt(1.2 * f(0, 3), 0.1, 0.42), stone, { y: 0.36, z: sz - 0.7 });
  if (f(0, 4)) P(yt(0.18, 0.12, 0.12, 8), PALETTE.clay, { x: -0.3, y: 0.47, z: sz - 0.72 }), f(0, 4) >= 1 && P(yt(0.13, 0.13, 0.02, 8), PALETTE.water, { x: -0.3, y: 0.53, z: sz - 0.72 });
  if (f(0, 6)) for (let i = 0; i < Math.round(3 * f(0, 6)); i++) P(on(0.19), stone2, { x: Math.cos(i * 2.1) * 0.3, y: 0.8, z: sz + Math.sin(i * 2.1) * 0.3, sy: 0.8 });
  if (f(0, 7)) P(lt(0.32, 0.26, 0.2), PALETTE.dark, { y: 0.95, z: sz - 0.32 }), P(Bn(0.07, 5, 4), PALETTE.glow, { y: 0.95, z: sz - 0.36 });
  if (f(0, 8)) for (let i = 0; i < Math.round(6 * f(0, 8)); i++) P(lt(0.5, 0.06, 0.38), i % 2 ? stone : stone2, { x: Math.sin(i * 0.7) * 0.25, y: 0.03, z: sz - 1.3 - i * 0.62, ry: i * 0.4 });
  if (f(0, 9)) for (let sg of [-1, 1]) P(lt(0.32, 1.7 * f(0, 9), 0.28), stone2, { x: sg * 1.35, y: 0.85 * f(0, 9), z: sz - 0.4, ry: sg * 0.15 });
  if (f(0, 10)) P(lt(0.16, 1.15 * f(0, 10), 0.16), PALETTE.plank2, { x: 0.95, y: 0.57 * f(0, 10), z: sz - 1.1 }), f(0, 10) >= 1 && P(lt(0.2, 0.3, 0.05), PALETTE.plank, { x: 0.95, y: 0.9, z: sz - 1.19 });
  if (f(0, 11)) P(on(0.22), 0xd8d0b8, { y: 1.08, z: sz, sy: 0.7 });
}

function drawHall(r, f, b) {
  let { stone, stone2, P } = templeBits(r, f);
  // ---- the hall (z = 0.4, 5 wide, 3.6 deep)
  let hz = 0.4,
    HW = 2.5,
    HD = 1.8,
    wallH = 2.2; // up to the beams
  if (f(1, 0)) for (let i = 0; i < Math.round(8 * f(1, 0)); i++) {
    let corner = [[-HW, -HD], [HW, -HD], [HW, HD], [-HW, HD], [0, -HD], [HW, 0], [0, HD], [-HW, 0]][i];
    P(lt(0.5, 0.25, 0.5), stone2, { x: corner[0], y: 0.12, z: hz + corner[1] });
  }
  if (f(1, 1)) P(lt(2 * HW * f(1, 1), 0.12, 2 * HD), stone, { y: 0.06, z: hz });
  let postH = 2.2;
  if (f(1, 2)) for (let i = 0; i < Math.round(4 * f(1, 2)); i++) {
    let c = [[-HW, -HD], [HW, -HD], [HW, HD], [-HW, HD]][i];
    P(lt(0.2, postH, 0.2), PALETTE.plank2, { x: c[0], y: postH / 2, z: hz + c[1] });
  }
  if (f(1, 3)) {
    P(lt(2 * HW + 0.3, 0.18, 0.2), PALETTE.plank2, { y: postH, z: hz - HD });
    if (f(1, 3) > 0.5) P(lt(2 * HW + 0.3, 0.18, 0.2), PALETTE.plank2, { y: postH, z: hz + HD });
    if (f(1, 3) >= 1) for (let sg of [-1, 1]) P(lt(0.2, 0.18, 2 * HD + 0.3), PALETTE.plank2, { x: sg * HW, y: postH, z: hz });
  }
  let wallCol = b && b.cureLeft > 0 && b.level === 1 ? PALETTE.mudwall2 : PALETTE.mudwall;
  if (f(1, 4)) P(lt(2 * HW, wallH * f(1, 4), 0.18), wallCol, { y: (wallH * f(1, 4)) / 2, z: hz + HD });
  if (f(1, 5)) for (let sg of [-1, 1]) P(lt(0.18, wallH * f(1, 5), 2 * HD), wallCol, { x: sg * HW, y: (wallH * f(1, 5)) / 2, z: hz });
  // the front wall, with a door in the middle, comes with the north wall
  if (f(1, 4) >= 1) for (let sg of [-1, 1]) P(lt(HW - 0.55, wallH, 0.18), wallCol, { x: sg * (HW / 2 + 0.28), y: wallH / 2, z: hz - HD });
  // the gable ends, stepped clay up under the roof, come with the end walls
  if (f(1, 4) >= 1)
    for (let k = 0; k < 6; k++) {
      let top = postH + 0.2 * (k + 1),
        half = (postH + 1.18 - top) / 0.446;
      if (half > 0.1) for (let sz of [-1, 1]) P(lt(2 * half, 0.2, 0.16), wallCol, { y: top - 0.1, z: hz + sz * HD });
    }
  let panel = (k, x, z, ry) => f(1, k) && (P(lt(1.1, 0.8 * f(1, k), 0.06), PALETTE.clay, { x, y: 1.05, z, ry }), f(1, k) >= 1 && P(lt(0.7, 0.4, 0.07), 0x9a5a38, { x, y: 1.05, z: z + (ry ? 0 : -0.01), ry }));
  panel(6, -HW - 0.1, hz - 0.6, Math.PI / 2);
  panel(7, HW + 0.1, hz - 0.6, Math.PI / 2);
  panel(10, -HW - 0.1, hz + 0.7, Math.PI / 2);
  if (f(1, 8)) for (let i = 0; i < Math.round(6 * f(1, 8)); i++) for (let sg of [-1, 1]) P(lt(0.08, 0.06, 2 * HD + 0.6), PALETTE.plank, { x: sg * (0.4 + i * 0.4), y: postH + 1.0 - (0.4 + i * 0.4) * 0.45, z: hz, rz: -sg * 0.42 });
  if (f(1, 9)) for (let sg of [-1, 1]) P(lt(HW * 1.25, 0.1, (2 * HD + 0.7) * Math.max(0.2, f(1, 9))), sg < 0 ? PALETTE.tile : PALETTE.tile2, { x: sg * HW * 0.55, y: postH + 0.62, z: hz, rz: -sg * 0.42 });
  if (f(1, 11)) P(lt(0.9, 1.4, 0.08), PALETTE.plank, { y: 0.7, z: hz - HD - 0.06 }), f(1, 11) >= 1 && [-0.7, 0.7].forEach((x) => P(Bn(0.09, 5, 4), PALETTE.glow, { x, y: 1.55, z: hz - HD - 0.2 }));
}

function drawCrown(r, f) {
  let { stone, stone2, P } = templeBits(r, f);
  // ---- the crown (z = 5.6): a stepped pyramid
  let cz = 5.6,
    base = 6;
  for (let i = 0; i < 5; i++) {
    let a = f(2, i);
    if (!a) continue;
    let w0 = base - i * 1.05;
    P(lt(w0, 0.5 * a, w0), i % 2 ? stone2 : stone, { y: 0.5 * i + 0.25 * a, z: cz });
  }
  let topY = 2.5;
  if (f(2, 5)) P(lt(1.2, 0.4 * f(2, 5), 1.2), 0xc8c0a8, { y: topY + 0.2 * f(2, 5), z: cz });
  // the water course down the front steps
  if (f(2, 6)) for (let i = 0; i < Math.round(5 * f(2, 6)); i++) P(lt(0.5, 0.06, 0.6), PALETTE.clay, { y: 0.5 * (i + 1) + 0.02, z: cz - base / 2 + i * 0.52 + 0.3 });
  if (f(2, 7)) P(yt(0.42, 0.38, 0.32, 8), PALETTE.clay, { y: topY + 0.55, z: cz }), f(2, 7) >= 1 && P(yt(0.33, 0.33, 0.03, 8), PALETTE.water, { y: topY + 0.72, z: cz });
  if (f(2, 8) >= 1) for (let i = 0; i < 5; i++) P(lt(0.32, 0.05, 0.62), 0x8ad0f0, { y: 0.5 * (i + 1) + 0.07, z: cz - base / 2 + i * 0.52 + 0.3 });
  if (f(2, 9)) for (let sg of [-1, 1]) P(lt(0.16, 1.4 * f(2, 9), 0.16), PALETTE.plank2, { x: sg * 0.55, y: topY + 0.4 + 0.7 * f(2, 9), z: cz + 0.4 });
  if (f(2, 10)) P(lt(1.4 * f(2, 10), 0.18, 0.2), PALETTE.plank2, { y: topY + 1.85, z: cz + 0.4 });
  if (f(2, 11)) P(on(0.26), 0xf0e0a0, { y: topY + 2.15, z: cz + 0.4, sy: 0.8 });
}

function buildTempleView(r, s, level, b, prog) {
  let f = greatPartsFn(level, b, prog);
  drawShrine(r, f);
  drawHall(r, f, b);
  drawCrown(r, f);
}

function buildAncestorsView(r, s, level, b, prog) {
  let f = greatPartsFn(level, b, prog),
    P = (g, c, o) => r.push(part(g, c, o));
  // the ring of ancestor stones (front)
  let stones = [0, 2, 3, 5, 8, 11],
    rz = -2.6;
  stones.forEach((k, i) => {
    let a = f(0, k);
    if (!a) return;
    let ang = (i / stones.length) * Math.PI * 2;
    P(lt(0.4, 1.3 * a, 0.3), i % 2 ? PALETTE.stone : PALETTE.stone2, { x: Math.cos(ang) * 1.6, y: 0.65 * a, z: rz + Math.sin(ang) * 1.6, ry: -ang });
  });
  if (f(0, 6)) for (let i = 0; i < Math.round(12 * f(0, 6)); i++) P(on(0.15), PALETTE.stone2, { x: Math.cos(i * 0.52) * 2.2, y: 0.08, z: rz + Math.sin(i * 0.52) * 2.2, sy: 0.6 });
  if (f(0, 9)) for (let i = 0; i < 3; i++) P(Bn(0.08, 5, 4), PALETTE.glow, { x: Math.cos(i * 2.1) * 1.1, y: 0.25, z: rz + Math.sin(i * 2.1) * 1.1 });
  // the hall, as in the temple
  drawHall(r, f, b);
  // the lantern tower (back)
  let tz = 4.2;
  for (let i = 0; i < 4; i++) {
    let k = [0, 1, 2, 3][i],
      a = f(2, k);
    if (a) P(yt(1.3 - i * 0.12, 1.4 - i * 0.12, 0.8 * a, 10), i % 2 ? PALETTE.stone : PALETTE.stone2, { y: 0.4 + i * 0.8 - 0.4 * (1 - a), z: tz });
  }
  if (f(2, 5)) P(yt(0.85, 0.95, 0.8 * f(2, 5), 10), PALETTE.stone2, { y: 3.6, z: tz });
  if (f(2, 7)) P(yt(0.7, 0.7, 0.8 * f(2, 7), 10), PALETTE.mudwall, { y: 4.4, z: tz });
  if (f(2, 8) >= 1) P(Bn(0.3, 6, 5), PALETTE.glow, { y: 4.5, z: tz });
  if (f(2, 10)) P(ze(1, 0.9 * f(2, 10), 10), PALETTE.tile, { y: 5.2, z: tz });
  if (f(2, 11)) P(on(0.2), 0xf0e0a0, { y: 5.8, z: tz });
}

STRUCTURE_BUILDERS.temple = buildTempleView;
STRUCTURE_BUILDERS.ancestors = buildAncestorsView;

// ---------------------------------------------------------------------------
// The one who believes in you waves when you open the valley.
// ---------------------------------------------------------------------------
var WAVE = { pending: true, until: 0, cam: null, hiddenAt: null };
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") WAVE.hiddenAt = performance.now();
  else if (WAVE.hiddenAt && performance.now() - WAVE.hiddenAt > 60000) WAVE.pending = true;
});

// Called from the creature view for every creekfolk, every frame.
function waveFor(cv, p, clock) {
  let c = cv.c,
    away = c.act && c.act.type === "away";
  cv.root.visible = !away;
  if (away || !(clock < WAVE.until) || !c.beliefs || !c.beliefs.beyond || c.asleep || !WAVE.cam) return;
  let r = cv.root.position,
    target = Math.atan2(WAVE.cam.x - r.x, WAVE.cam.z - r.z);
  cv.yaw = hM(cv.yaw, target, 0.25);
  p.armR = 3 + Math.sin(clock * 14) * 0.9;
  p.armL = 0;
  p.handFwd = 0.12;
  p.earPerk = 1;
  p.lean = -0.12;
  p.sit = 0;
  p.lie = 0;
}

// 3C: later view files add drawing here. Each entry is a class: new X(world, scene, group),
// x.update(clock, night, rain, dl, camera, focus), x.dispose().
var VIEW_EXTRAS = [];

// ---------------------------------------------------------------------------
// Animals, flowers, offerings and the sky.
// ---------------------------------------------------------------------------
var BeliefView = class {
  constructor(world, scene) {
    this.world = world;
    this.scene = scene;
    this.group = new Pe();
    scene.add(this.group);
    this.basic = (col, extra = {}) => new je({ color: col, ...extra });
    this.m4 = new se();
    this.q = new mn();
    this.eu = new bn();
    this.v = new z();
    this.sc = new z(1, 1, 1);
    this.col = new wt();
    // instanced pools
    let inst = (geom, n, mat) => {
      let m = new Ts(geom, mat, n);
      m.count = 0;
      m.frustumCulled = false;
      m.castShadow = false;
      this.group.add(m);
      return m;
    };
    this.flowers = inst(mergeParts([part(qt(0.07, 0), 0xffffff, { y: 0.18 }), part(yt(0.012, 0.012, 0.18, 3), 0x5a8a40, { y: 0.09 })]), 1600, new Qe({ vertexColors: true }));
    this.fishI = inst(mergeParts([part(lt(0.22, 0.05, 0.07), 0xffffff), part(ze(0.05, 0.08, 3), 0xffffff, { x: -0.14, rz: Math.PI / 2 })]), 80, new Qe({ vertexColors: true }));
    this.birdsI = inst(mergeParts([part(lt(0.1, 0.05, 0.06), 0xffffff), part(lt(0.06, 0.012, 0.22), 0xffffff, { x: 0.01, y: 0.02 })]), 60, new Qe({ vertexColors: true }));
    this.beesI = inst(mergeParts([part(Bn(0.03, 4, 3), 0xf0c020)]), 60, new je({ color: 0xf0c020 }));
    this.offerI = inst(mergeParts([part(on(0.06), 0xffffff)]), GIFT.offeringsShown + 4, new Qe({ vertexColors: true }));
    this.goats = new Map();
    this.hives = new Map();
    this.flowerSig = "";
    // the lantern at the Giving Place
    this.lantern = new Pe();
    this.lantern.add(new Et(mergeParts([part(yt(0.04, 0.05, 0.8, 4), PALETTE.plank2, { y: 0.4 }), part(lt(0.18, 0.2, 0.18), PALETTE.dark, { y: 0.9 })]), he()));
    this.lanternGlow = new Et(mergeParts([part(Bn(0.08, 5, 4), 0xffffff, { y: 0.9 })]), new je({ color: 0xffd890 }));
    this.lantern.add(this.lanternGlow);
    this.lanternLight = new Cs(0xffc070, 0, 6, 1.5);
    this.lanternLight.position.set(0, 1, 0);
    this.lantern.add(this.lanternLight);
    this.lantern.visible = false;
    this.group.add(this.lantern);
    // stars, rainbow, snowfall
    let sp = [];
    for (let i = 0; i < 700; i++) {
      let u = hash01(i * 3 + 1),
        v = hash01(i * 3 + 2) * 0.95,
        th = u * Math.PI * 2,
        ph = Math.acos(1 - v),
        R = 300;
      sp.push(Math.sin(ph) * Math.cos(th) * R, Math.cos(ph) * R, Math.sin(ph) * Math.sin(th) * R);
    }
    let sg = new ye();
    sg.setAttribute("position", new Zt(sp, 3));
    this.starMat = new Er({ color: 0xfff6e0, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
    this.stars = new Co(sg, this.starMat);
    this.stars.frustumCulled = false;
    this.stars.visible = false;
    this.group.add(this.stars);
    // the same stars, reflected in every pond and pool (what you see from above)
    this.wstarMat = new Er({ color: 0xfff8e8, size: 3, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false });
    this.wstars = new Co(new ye(), this.wstarMat);
    this.wstars.frustumCulled = false;
    this.wstars.visible = false;
    this.group.add(this.wstars);
    let bands = [0xd04040, 0xe08a30, 0xe8d040, 0x50b050, 0x4070d0, 0x7050b0],
      rb = new Pe();
    bands.forEach((c, i) => {
      let m = new Et(new zo(34 - i * 1.15, 0.62, 3, 64, Math.PI), new je({ color: c, transparent: true, opacity: 0, fog: false, depthWrite: false }));
      rb.add(m);
    });
    this.rainbow = rb;
    rb.visible = false;
    this.group.add(rb);
    let fl = [];
    for (let i = 0; i < 900; i++) fl.push((hash01(i * 7) - 0.5) * 60, hash01(i * 7 + 1) * 20, (hash01(i * 7 + 2) - 0.5) * 60);
    let fg = new ye();
    fg.setAttribute("position", new Zt(fl, 3));
    this.flakeMat = new Er({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false });
    this.flakes = new Co(fg, this.flakeMat);
    this.flakes.frustumCulled = false;
    this.flakes.visible = false;
    this.group.add(this.flakes);
    this.extras = VIEW_EXTRAS.map((X) => new X(world, scene, this.group)); // 3C
  }
  dispose() {
    for (let x of this.extras || []) x.dispose && x.dispose();
    this.group.traverse((o) => {
      o.geometry && o.geometry.dispose();
    });
    this.scene.remove(this.group);
  }
  h(x, z) {
    return this.world.terrain.heightAt(clamp(x, 0, VW - 0.01), clamp(z, 0, VL - 0.01));
  }
  setI(mesh, i, x, y, z, ry, s, col, rx = 0, rz = 0) {
    this.eu.set(rx, ry, rz);
    this.q.setFromEuler(this.eu);
    this.v.set(x, y, z);
    this.sc.set(s, s, s);
    this.m4.compose(this.v, this.q, this.sc);
    mesh.setMatrixAt(i, this.m4);
    if (col !== undefined) mesh.setColorAt(i, this.col.set(col));
  }
  update(clock, night, rain, dl, camera, focus) {
    let w = this.world,
      f = w.fauna,
      season = seasonAt(w);
    if (camera) WAVE.cam = { x: camera.position.x, z: camera.position.z };
    if (WAVE.pending && w.creatures.length && window.__creek && !window.__creek.catching) {
      WAVE.pending = false;
      let b = w.creatures.find((c) => c.beliefs && c.beliefs.beyond && !c.asleep && !(c.act && c.act.type === "away"));
      if (b) {
        WAVE.until = clock + 7;
        setTimeout(() => window.__creek && window.__creek.hud && window.__creek.hud.toast(`${b.name} looked up at the sky and waved.`), 900);
      }
    }
    for (let x of this.extras || []) x.update(clock, night, rain, dl, camera, focus); // 3C
    this.updateFlowers(w, f, season);
    this.updateGoats(w, f, clock);
    this.updateBees(w, f, clock, night, season);
    this.updateFish(w, f, clock);
    this.updateBirds(w, f, clock, night);
    this.updateOfferings(w);
    // the lantern burns while the creek rests
    let gp = w.givingPlace;
    this.lantern.visible = !!(gp && w.lantern);
    if (this.lantern.visible) {
      // beside the shrine (or the bare Giving Place, before there is one)
      let t = w.temple && w.byId[w.temple.sid],
        rot = t ? t.rot : 0,
        lx = 1.2,
        lz = t ? -4.2 : -0.6,
        x = gp.x + lx * Math.cos(rot) + lz * Math.sin(rot),
        z = gp.z - lx * Math.sin(rot) + lz * Math.cos(rot);
      this.lantern.position.set(x, this.h(x, z), z);
      this.lanternLight.intensity = (0.4 + 2.2 * night) * (1 + Math.sin(clock * 3.1) * 0.08);
    }
    // stars on a starry night
    let st = starryLevel(w) * clamp(night * 1.4, 0, 1);
    this.stars.visible = st > 0.01;
    if (this.stars.visible && camera) this.stars.position.copy(camera.position), (this.starMat.opacity = st);
    this.wstars.visible = st > 0.01;
    if (this.wstars.visible) {
      if (this.wstarKey !== w.starry.from) (this.wstarKey = w.starry.from), this.waterStars(w);
      this.wstarMat.opacity = st * (0.75 + 0.25 * Math.sin(clock * 2.7));
    }
    // the rainbow, opposite the sun, over the valley
    let rl = rainbowLevel(w) * (1 - 0.7 * night);
    this.rainbow.visible = rl > 0.01 && !!camera;
    if (this.rainbow.visible) {
      // an arc just beyond what you're looking at, facing you, sized to the view
      let look = window.__creek && window.__creek.rig ? window.__creek.rig.cur : focus,
        fx = look ? look.x : VW / 2,
        fz = look ? look.z : VL / 2,
        dist = look && look.dist ? look.dist : 40,
        dx = fx - camera.position.x,
        dz = fz - camera.position.z,
        d = Math.hypot(dx, dz) || 1,
        R = 0.32 * dist;
      dx /= d;
      dz /= d;
      this.rainbow.position.set(fx + dx * 0.12 * dist, this.h(fx, fz) - 0.15 * R, fz + dz * 0.12 * dist);
      this.rainbow.rotation.set(0, Math.atan2(dx, dz), 0);
      this.rainbow.scale.setScalar(R / 34);
      for (let m of this.rainbow.children) m.material.opacity = 0.45 * rl;
    }
    // snow falling for most of a snow day
    let sn = w.snow && w.t >= w.snow.t0 && w.t < w.snow.t0 + 0.6 * (w.snow.until - w.snow.t0) ? 1 : 0;
    this.flakes.visible = sn > 0;
    if (sn && focus) {
      let a = this.flakes.geometry.attributes.position,
        arr = a.array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] -= 0.04;
        arr[i] += Math.sin(clock + i) * 0.004;
        if (arr[i + 1] < 0) arr[i + 1] += 20;
      }
      a.needsUpdate = true;
      this.flakes.position.set(focus.x, this.h(focus.x, focus.z), focus.z);
      this.flakeMat.opacity = 0.85;
    }
  }
  // Points on standing water: pond nodes along the creek, and the floor's pools and marsh.
  waterStars(w) {
    let pts = [],
      T = w.terrain,
      c = creekCells(w),
      W = w.wt;
    if (W)
      for (let k = 0; k < CELLS && pts.length < 1500; k += 1) {
        if (!(W[k] > c.h[k] + 0.03) || hash01(k * 1.37) > 0.22) continue;
        let x = (k % VW) + hash01(k * 3.1),
          z = ((k / VW) | 0) + hash01(k * 5.3);
        pts.push(x, W[k] + 0.03, z);
      }
    let cr = w.creek;
    if (cr)
      for (let i = 0; i < cr.nodes.length; i++) {
        let n = cr.nodes[i],
          lv = Math.max(n.wl, cr._pondNow ? cr._pondNow[i] : -1e9);
        if (n.z < 0 || n.z > VL || lv - n.bed < 0.08) continue;
        for (let j = 0; j < 3; j++) pts.push(T.creekX(n.z) + (hash01(i * 7 + j) - 0.5) * 1.6, lv + 0.03, n.z + hash01(i * 11 + j) * 2);
      }
    this.wstars.geometry.dispose();
    let g = new ye();
    g.setAttribute("position", new Zt(pts, 3));
    this.wstars.geometry = g;
  }
  updateFlowers(w, f, season) {
    let n = f ? f.flowers.reduce((a, fl) => a + fl.patches.length, 0) : 0,
      bloom = season.name === "spring" ? 1 : season.name === "summer" ? 0.9 : season.name === "autumn" ? 0.35 : 0,
      sig = n + ":" + Math.round(bloom * 10) + ":" + (snowLevel(w) > 0.3 ? 1 : 0);
    if (sig === this.flowerSig) return;
    this.flowerSig = sig;
    let k = 0,
      snow = snowLevel(w) > 0.3;
    if (f && !snow)
      for (let fl of f.flowers)
        for (let p of fl.patches) {
          let base = FLOWER_COLOR[fl.kind] || 0xffffff;
          for (let j = 0; j < p.n * 2 && k < this.flowers.count + 1600; j++) {
            if (k >= 1600) break;
            let a = hash01(p.x * 13 + p.z * 7 + j) * 6.28,
              d = Math.sqrt(hash01(p.x * 3 + p.z * 11 + j * 5)) * p.r,
              x = p.x + Math.cos(a) * d,
              z = p.z + Math.sin(a) * d,
              open = hash01(j * 31 + p.x) < bloom;
            this.setI(this.flowers, k++, x, this.h(x, z), z, a, open ? 1 : 0.7, open ? base : 0x6a9a50);
          }
        }
    this.flowers.count = k;
    this.flowers.instanceMatrix.needsUpdate = true;
    if (this.flowers.instanceColor) this.flowers.instanceColor.needsUpdate = true;
  }
  goatMesh(g) {
    let coat = GOAT_COAT[g.coat % GOAT_COAT.length],
      dark = 0x2a2420,
      body = mergeParts([
        part(lt(0.55, 0.32, 0.28), coat, { y: 0.42 }),
        part(lt(0.18, 0.2, 0.16), coat, { x: 0.34, y: 0.58 }),
        part(ze(0.03, 0.14, 3), dark, { x: 0.32, y: 0.74, z: 0.05, rz: -0.4 }),
        part(ze(0.03, 0.14, 3), dark, { x: 0.32, y: 0.74, z: -0.05, rz: -0.4 }),
        part(lt(0.05, 0.08, 0.05), coat, { x: 0.45, y: 0.47 }),
        ...[[-0.2, 0.09], [-0.2, -0.09], [0.18, 0.09], [0.18, -0.09]].map(([x, zz]) => part(lt(0.06, 0.28, 0.06), dark, { x, y: 0.14, z: zz })),
      ]);
    let m = new Et(body, he());
    m.castShadow = true;
    let g0 = new Pe();
    g0.add(m);
    this.group.add(g0);
    return { obj: g0, mesh: m };
  }
  updateGoats(w, f, clock) {
    let seen = new Set();
    for (let g of (f && f.goats) || []) {
      seen.add(g.id);
      let v = this.goats.get(g.id);
      if (!v) this.goats.set(g.id, (v = this.goatMesh(g)));
      // walking from (px,pz) at pt to (x,z), then grazing
      let d = Math.hypot(g.x - g.px, g.z - g.pz),
        arrive = g.pt + d / FAUNA.goatSpeed,
        k = arrive > g.pt ? clamp((w.t - g.pt) / (arrive - g.pt), 0, 1) : 1,
        x = g.px + (g.x - g.px) * k,
        z = g.pz + (g.z - g.pz) * k;
      v.obj.position.set(x, this.h(x, z), z);
      if (d > 0.05) v.obj.rotation.y = Math.atan2(-(g.z - g.pz), g.x - g.px);
      let walking = k < 1;
      v.mesh.rotation.z = walking ? Math.sin(clock * 9 + g.id) * 0.04 : -0.18 - 0.05 * Math.sin(clock * 2 + g.id);
      v.mesh.position.y = walking ? Math.abs(Math.sin(clock * 9 + g.id)) * 0.03 : 0;
    }
    for (let [id, v] of this.goats)
      if (!seen.has(id)) {
        this.group.remove(v.obj);
        v.mesh.geometry.dispose();
        this.goats.delete(id);
      }
  }
  updateBees(w, f, clock, night, season) {
    let seen = new Set(),
      k = 0,
      out = night < 0.5 && season.name !== "winter" && !(w.weather.rain > 0);
    for (let h of (f && f.hives) || []) {
      let key = h.x + ":" + h.z;
      seen.add(key);
      let v = this.hives.get(key);
      if (!v) {
        let m = new Et(mergeParts([part(yt(0.04, 0.05, 0.5, 4), PALETTE.plank2, { y: 0.25 }), part(lt(0.4, 0.22, 0.32), 0xd8b070, { y: 0.6 }), part(lt(0.42, 0.06, 0.34), PALETTE.thatch2, { y: 0.74 }), part(lt(0.36, 0.2, 0.3), 0xc8a060, { y: 0.84 })]), he());
        m.castShadow = true;
        this.group.add(m);
        this.hives.set(key, (v = m));
      }
      v.position.set(h.x, this.h(h.x, h.z), h.z);
      if (out)
        for (let i = 0; i < 8 && k < 60; i++) {
          let a = clock * (1.5 + hash01(i) * 2) + i * 0.8,
            rr = 0.5 + 1.8 * hash01(i + h.x),
            x = h.x + Math.cos(a) * rr,
            z = h.z + Math.sin(a * 1.3) * rr;
          this.setI(this.beesI, k++, x, this.h(h.x, h.z) + 0.5 + Math.sin(a * 2.3) * 0.25, z, 0, 1);
        }
    }
    this.beesI.count = k;
    this.beesI.instanceMatrix.needsUpdate = true;
    for (let [key, v] of this.hives)
      if (!seen.has(key)) {
        this.group.remove(v);
        v.geometry.dispose();
        this.hives.delete(key);
      }
  }
  updateFish(w, f, clock) {
    let kinds = (f && f.fish) || [],
      k = 0;
    if (kinds.length && w.creek && w.creek._pondNow) {
      let ns = w.creek.nodes,
        pn = w.creek._pondNow,
        T = w.terrain;
      // fish where the water stands deep enough: in ponds, and in the creek's pools
      let spots = [];
      for (let i = 0; i < ns.length; i++) {
        let n = ns[i];
        if (n.z < 2 || n.z > VL - 2) continue;
        let lv = Math.max(pn[i], n.wl);
        if (lv - n.bed > 0.18) spots.push({ z: n.z, y: lv - 0.07, x: T.creekX(n.z) });
      }
      let per = Math.min(10, Math.ceil(70 / Math.max(1, kinds.length)));
      for (let s = 0; s < kinds.length; s++)
        for (let j = 0; j < per && spots.length && k < 80; j++) {
          let sp = spots[Math.floor(hash01(s * 97 + j * 13) * spots.length)],
            a = clock * (0.3 + hash01(j + s) * 0.4) + j * 2.1,
            rr = 0.25 + 0.5 * hash01(j * 7 + s);
          this.setI(this.fishI, k++, sp.x + Math.cos(a) * rr, sp.y, sp.z + Math.sin(a) * rr * 1.6, -a - Math.PI / 2, 1, FISH_COLOR[kinds[s]] || 0xc0c0c0);
        }
    }
    this.fishI.count = k;
    this.fishI.instanceMatrix.needsUpdate = true;
    if (this.fishI.instanceColor) this.fishI.instanceColor.needsUpdate = true;
  }
  updateBirds(w, f, clock, night) {
    let kinds = (f && f.birds) || [],
      k = 0,
      c = villageCentre(w);
    for (let s = 0; s < kinds.length; s++) {
      let owl = kinds[s] === "owl";
      if (owl ? night < 0.5 : night > 0.6) continue;
      for (let j = 0; j < 5 && k < 60; j++) {
        let a = clock * (0.25 + hash01(s * 5 + j) * 0.2) * (j % 2 ? 1 : -1) + j * 1.3 + s,
          rr = 8 + 10 * hash01(s * 11 + j),
          x = c.x + Math.cos(a) * rr,
          z = c.z + 6 * s + Math.sin(a) * rr,
          y = this.h(x, z) + 5 + 2 * Math.sin(a * 2 + j),
          flap = Math.sin(clock * 14 + j) * 0.5;
        this.setI(this.birdsI, k++, x, y, z, -a + (j % 2 ? Math.PI : 0), 1.3, BIRD_COLOR[kinds[s]] || 0x806040, flap);
      }
    }
    this.birdsI.count = k;
    this.birdsI.instanceMatrix.needsUpdate = true;
    if (this.birdsI.instanceColor) this.birdsI.instanceColor.needsUpdate = true;
  }
  updateOfferings(w) {
    let of = w.offerings,
      gp = w.givingPlace,
      sig = of && gp ? of.total + ":" + (w.temple ? w.temple.parts : 0) : "";
    if (sig === this.offerSig) return;
    this.offerSig = sig;
    let k = 0;
    if (of && gp) {
      // around the shrine's ledge, or the stone that marks the Giving Place
      let rot = w.temple ? STRUCTURES && w.byId[w.temple.sid] ? w.byId[w.temple.sid].rot : 0 : 0,
        cx = gp.x + Math.sin(rot) * -3.4,
        cz = gp.z + Math.cos(rot) * -3.4;
      if (!w.temple) (cx = gp.x), (cz = gp.z);
      of.recent.forEach((o, i) => {
        let a = hash01(i * 7 + 1) * 6.28,
          d = 0.7 + hash01(i * 7 + 2) * 0.9,
          x = cx + Math.cos(a) * d,
          z = cz + Math.sin(a) * d;
        this.setI(this.offerI, k++, x, this.h(x, z) + 0.04, z, a, o.k === "feather" ? 0.8 : 1, OFFERING_COLOR[o.k] || 0xffffff);
      });
    }
    this.offerI.count = k;
    this.offerI.instanceMatrix.needsUpdate = true;
    if (this.offerI.instanceColor) this.offerI.instanceColor.needsUpdate = true;
  }
};

// ---------------------------------------------------------------------------
// The village panel's Temple tab.
// ---------------------------------------------------------------------------
function greatProgressText(w, g, s) {
  let def = STRUCTURES[s.kind],
    txt = GREAT_TEXT[s.kind],
    lv = Math.min(s.level, 2),
    b = s.building;
  if (g.state === "done") return `<p><b>Finished</b> ${agoText(w.t - g.done)}, after ${durationText(g.done - g.started)}.</p>`;
  let out = `<p>${g.parts} of 36 parts built.`;
  if (b) {
    let st = def.levels[b.level].stages[b.stage];
    out += ` The ${def.levels[b.level].label}: ${b.stage} of 12.`;
    if (b.locked) out += g.state === "stopped" ? ` Work has stopped: no gift has come for a while. They tend what is built and wait for a sign.` : ` Next is the ${st.name}, when the creek has answered.`;
    else out += ` They're building the ${st.name}${b.cureLeft > 0 ? " (drying)" : st.dryseason && seasonAt(w).wetSeason ? " (great stones wait for the dry season)" : ""}.`;
  }
  return out + "</p>";
}

function villageTempleHTML(w) {
  let out = "";
  out += `<h4>The creek that gives</h4><p class="muted">${escapeHtml(beliefSummary(w))}</p>`;
  out += requestLine(w);
  if (w.givingPlace) out += `<p class="muted">They keep watch at the Giving Place when a gift is due. ${(w.stats.gifts || 0) ? `There are ${w.stats.gifts} notches on the Giving Stone, one for every giving day.` : ""}</p>`;
  out += offeringsLine(w);
  let t = w.temple && w.byId[w.temple.sid];
  if (t) {
    out += `<h4>The temple</h4>` + greatProgressText(w, w.temple, t);
    let pace = templePace(w);
    if (w.temple.state !== "done")
      out += `<p class="muted">${pace <= 0 ? "It waits for the creek to give again." : pace >= 1.35 ? "The creek answers often; the temple rises quickly." : pace >= 1.1 ? "The creek answers readily; the temple rises well." : pace >= 0.9 ? "The creek answers steadily; the temple rises at a good pace." : "The creek answers now and then; the temple rises slowly."}</p>`;
    if (w.temple.carvings.length) out += `<p class="muted">Carved into it: ${w.temple.carvings.slice(-3).map((c) => `"${escapeHtml(c.text)}"`).join(" ")}</p>`;
  } else if (!w.ancestors) {
    out += `<h4>The temple</h4><p class="muted">${w.givingPlace ? "When the creek gives steadily (about every other day) and most of them believe, they will begin a shrine at the Giving Place." : "Nothing is built for the creek yet."}</p>`;
  }
  let a = w.ancestors && w.byId[w.ancestors.sid];
  if (a) out += `<h4>The Hall of the Ancestors</h4>` + greatProgressText(w, w.ancestors, a);
  let sp = w.spring;
  if (sp && (sp.heard || sp.found)) out += `<h4>The Spring</h4><p class="muted">${sp.found ? `${escapeHtml(sp.byName || "Someone")} found the spring where the creek begins, beyond the head of the valley${sp.visits ? `; ${sp.visits === 1 ? "one journey" : sp.visits + " journeys"} there since` : ""}. It is the holiest place they know.` : `They've heard that the creek begins at a spring beyond the head of the valley. No one has been there yet.`}</p>`;
  let by = w.creatures.find((c) => c.beliefs && c.beliefs.beyond);
  if (by) out += `<h4>The one who believes in you</h4><p class="muted">${escapeHtml(by.name)} is sure the gifts come from someone beyond the valley. They still thank the creek, but when you look in, they wave.</p>`;
  return out;
}
