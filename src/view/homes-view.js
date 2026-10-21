// Phase 3C: drawing homes, decorations, cairns at named places, scenery beyond the valley.
// Owner: helper "homes".
//
// - Homes: the door in the owner's colour, the front porch and the stone hearth (with
//   smoke from the chimney on cold days and evenings), and the things by the door that
//   the owner put there (homes.js chooses them; this only draws them).
// - Gardens: the fourth bed.
// - A marker at every named place that has no building of its own: a standing stone with
//   flowers where someone passed, a cairn at the first gift's place and at the spring, a
//   signpost everywhere else.
// - Beyond the valley: hills all round, rising to a far ridge, and downstream, past the
//   valley's mouth, the creek running on into a lake.
//
// Hooked in by wrapping (STRUCTURE_BUILDERS, StructureView.prototype.sig, Renderer's
// setWorld / disposeViews / update). Reads the world and never changes it.

var HV3 = z, // three's Vector3, Matrix4, Quaternion and Euler under their bundled names
  HM4 = se,
  HQ = mn,
  HEu = bn;

// ---- the owner's colour ------------------------------------------------------------------
function homeToColor(v) {
  if (v == null) return null;
  if (v.isColor) return v.clone();
  if (typeof v === "number" || typeof v === "string") return new wt(v);
  if (Array.isArray(v) && v.length >= 3) return v[0] > 1 ? new wt().setHSL(v[0] / 360, v[1], v[2]) : new wt(v[0], v[1], v[2]);
  if (typeof v === "object" && "r" in v) return new wt(v.r, v.g, v.b);
  if (typeof v === "object" && "h" in v) return new wt().setHSL(v.h > 1 ? v.h / 360 : v.h, v.s, v.l);
  return null;
}
// The colour of a creekfolk's fur: from looks.js once it is there, otherwise the way
// CreatureView colours them.
function homeFurColor(w, c) {
  if (!c) return null;
  if (typeof looksFurColor === "function") {
    try {
      let col = homeToColor(looksFurColor(w, c));
      if (col) return col;
    } catch (e) {}
  }
  let r = Fr[_m(w, c)];
  return new wt().setHSL(r[0] / 360, r[1], r[2] * (0.92 + ((c.look && c.look.light) || 0.5) * 0.15));
}
// the same as a number, remembered until the valley's population changes (asked every frame)
var homeHexCache = new Map();
function homeFurHex(w, c) {
  let e = homeHexCache.get(c.id);
  if (e && e.n === w.creatures.length && e.w === w) return e.hex;
  if (homeHexCache.size > 400) homeHexCache.clear();
  let hex = homeFurColor(w, c).getHex();
  homeHexCache.set(c.id, { n: w.creatures.length, w, hex });
  return hex;
}

// ---- things by the door ------------------------------------------------------------------
// Where they stand around a home (local coordinates; the door faces +z). Clear of the
// ramp, the porch posts, the extra room (-x) and the trinkets (front left round to the back).
var HOME_SLOTS = [
  [1.1, 1.02],
  [1.55, -0.14],
  [-0.95, 1.26],
  [1.02, -1.18],
];
var HOME_FLOWERS = [PALETTE.flower1, PALETTE.flower2, PALETTE.flower3, 0xf4efe0, 0x8e74d8, 0xf0b030];

function homeDecorShown(w, s) {
  let d = s.deco;
  if (!d || !d.list) return [];
  let out = d.list.filter((it) => it.at <= w.t);
  if (d.old) out.push(d.old);
  return out.slice(0, HOME_SLOTS.length);
}

// One decoration of kind k at (sx, sz), its parts turned to face away from the home.
function homeDecorParts(r, k, sx, sz, h, col) {
  let ps = [],
    P = (g, c, o) => ps.push(part(g, c, o));
  switch (k) {
    case "flowers":
      for (let j = 0; j < 3; j++) {
        let x = (j - 1) * 0.18,
          zz = (j % 2) * 0.09;
        P(yt(0.075, 0.055, 0.11, 6), PALETTE.clay, { x, y: 0.055, z: zz });
        P(yt(0.012, 0.012, 0.2, 3), PALETTE.greens, { x, y: 0.2, z: zz });
        P(qt(0.07, 0), HOME_FLOWERS[(h + j * 2) % HOME_FLOWERS.length], { x, y: 0.32, z: zz });
      }
      break;
    case "stones":
      [
        [0.14, 0.08, PALETTE.stone2],
        [0.11, 0.2, PALETTE.stone],
        [0.085, 0.3, PALETTE.stone2],
        [0.065, 0.38, 0xddd6c6],
      ].forEach(([rr, y, c], j) => P(on(rr), c, { x: (hash01(h + j) - 0.5) * 0.04, y, z: 0, sy: 0.62, ry: j * 0.9 }));
      break;
    case "chimes": {
      P(yt(0.025, 0.032, 0.9, 4), PALETTE.plank2, { y: 0.45 });
      P(lt(0.34, 0.03, 0.03), PALETTE.plank2, { x: 0.15, y: 0.88 });
      let c = h % 2 ? PALETTE.clay : PALETTE.reed;
      [0.24, 0.18, 0.13].forEach((len, j) => P(yt(0.016, 0.016, len, 4), c, { x: 0.08 + j * 0.09, y: 0.86 - len / 2, z: 0 }));
      break;
    }
    case "basin":
      P(yt(0.21, 0.15, 0.16, 8), PALETTE.clay, { y: 0.08 });
      P(yt(0.18, 0.18, 0.02, 8), PALETTE.water, { y: 0.155 });
      for (let j = 0; j < 3; j++) P(yt(0.012, 0.012, 0.42, 3), PALETTE.reed, { x: 0.24 + j * 0.03, y: 0.21, z: -0.05 + j * 0.04, rz: (j - 1) * 0.12 });
      break;
    case "carving":
      P(yt(0.07, 0.08, 0.24, 6), PALETTE.plank2, { y: 0.12 });
      P(qt(0.13, 1), PALETTE.plank, { y: 0.34, sy: 1.15 });
      P(qt(0.095, 1), PALETTE.plank, { y: 0.53 });
      P(ze(0.035, 0.11, 4), PALETTE.plank2, { x: -0.055, y: 0.64 });
      P(ze(0.035, 0.11, 4), PALETTE.plank2, { x: 0.055, y: 0.64 });
      P(lt(0.022, 0.022, 0.02), PALETTE.dark, { x: -0.035, y: 0.55, z: 0.085 });
      P(lt(0.022, 0.022, 0.02), PALETTE.dark, { x: 0.035, y: 0.55, z: 0.085 });
      break;
    case "pennant":
      P(yt(0.02, 0.026, 1.6, 4), PALETTE.trunk, { y: 0.8 });
      P(ze(0.1, 0.46, 3), col || PALETTE.flower2, { x: 0.23, y: 1.48, rz: -Math.PI / 2 });
      P(ze(0.06, 0.3, 3), HOME_FLOWERS[h % HOME_FLOWERS.length], { x: 0.15, y: 1.28, rz: -Math.PI / 2 - 0.2 });
      break;
    case "bench":
      P(yt(0.085, 0.085, 0.72, 6), PALETTE.trunk, { y: 0.22, rz: Math.PI / 2 });
      P(lt(0.6, 0.03, 0.12), PALETTE.plank, { y: 0.31 });
      P(yt(0.07, 0.085, 0.16, 5), PALETTE.plank2, { x: -0.24, y: 0.08 });
      P(yt(0.07, 0.085, 0.16, 5), PALETTE.plank2, { x: 0.24, y: 0.08 });
      break;
  }
  let m = new HM4().compose(new HV3(sx, 0, sz), new HQ().setFromEuler(new HEu(0, Math.atan2(sx, sz), 0)), new HV3(1, 1, 1));
  for (let g of ps) r.push(g.applyMatrix4(m));
}

// ---- the home builder: the door, the porch, the hearth, the things by the door -------------
function homeExtras(r, t, e, n, s, ctx) {
  let w = ctx.world,
    o = n ? n.level : -1,
    a = n ? n.stage : 0,
    h = e >= 5 || (o === 4 && a >= 1) ? 0.38 : 0,
    owner = t.owner != null ? w.byId[t.owner] : null,
    P = (g, c, op) => r.push(part(g, c, op));
  // the door, in the owner's colour (a home with no one in it keeps its plain door)
  if (e >= 3 && owner) {
    let c = homeFurColor(w, owner);
    P(lt(0.46, 0.68, 0.05), PALETTE.plank2, { y: h + 0.33, z: 0.945 });
    P(lt(0.34, 0.56, 0.05), c, { y: h + 0.3, z: 0.97 });
    P(qt(0.028, 0), 0xe8d8a0, { x: 0.11, y: h + 0.3, z: 1.0 });
  }
  // the front porch: a deck before the door, two posts and an open roof of rafters (so
  // the door still shows from above), with a vine climbing one post
  if (e >= 7 || o === 6) {
    let posts = e >= 7 || (o === 6 && a >= 1) ? 1 : s,
      roof = e >= 7 ? 1 : o === 6 && a === 1 ? s : 0,
      H = h + 1.0;
    P(lt(1.16, 0.06, 0.66), PALETTE.plank, { y: h - 0.025, z: 1.31 });
    P(lt(0.5, 0.05, 0.26), PALETTE.plank2, { y: h * 0.45, z: 1.78 });
    if (posts > 0.3) P(yt(0.042, 0.052, H, 5), PALETTE.plank2, { x: 0.52, y: H / 2, z: 1.58 });
    if (posts > 0.65) P(yt(0.042, 0.052, H, 5), PALETTE.plank2, { x: -0.52, y: H / 2, z: 1.58 });
    if (posts >= 1) P(lt(1.16, 0.06, 0.06), PALETTE.plank2, { y: H - 0.02, z: 1.58 });
    let n = Math.round(4 * roof);
    for (let k = 0; k < n; k++) P(lt(0.05, 0.04, 0.74), PALETTE.plank, { x: -0.42 + k * 0.28, y: H + 0.02, z: 1.22, rx: 0.06 });
    if (e >= 7)
      for (let k = 0; k < 6; k++)
        P(qt(0.055 + 0.015 * (k % 2), 0), k % 3 ? PALETTE.greens : PALETTE.leaf2, { x: k < 4 ? -0.52 + (k % 2 ? 0.04 : -0.04) : -0.4 + (k - 4) * 0.2, y: k < 4 ? 0.25 + k * (H - 0.2) / 4 : H + 0.05, z: 1.6 });
    if (o === 6 && e < 7) Ur(r, 1.7, 1.2);
  }
  // the stone hearth: a stone chimney at the back, above the roof
  if (e >= 8 || o === 7) {
    let f = e >= 8 ? 1 : a === 0 ? 0.35 * Math.max(0.15, s) : 0.35 + 0.65 * s,
      top = (h + 1.9) * f;
    P(lt(0.46, 0.18, 0.4), PALETTE.stone2, { x: 0.64, y: 0.09, z: -0.76 });
    P(lt(0.28, top, 0.25), PALETTE.stone, { x: 0.64, y: top / 2, z: -0.76, jitter: 0.08, seed: t.id + 3 });
    if (f >= 1) P(lt(0.35, 0.09, 0.32), PALETTE.stone2, { x: 0.64, y: top + 0.04, z: -0.76 }), P(lt(0.17, 0.04, 0.15), PALETTE.dark, { x: 0.64, y: top + 0.1, z: -0.76 });
  }
  // the things by the door
  if (e >= 1 && owner) {
    let col = homeFurColor(w, owner),
      items = homeDecorShown(w, t);
    items.forEach((it, j) => homeDecorParts(r, it.k, HOME_SLOTS[j][0], HOME_SLOTS[j][1], it.h | 0, col));
  }
}

(function () {
  let home = STRUCTURE_BUILDERS.home;
  STRUCTURE_BUILDERS.home = function (r, t, e, n, s, ctx) {
    home(r, t, e, n, s, ctx);
    homeExtras(r, t, e, n, s, ctx);
  };
  // the fourth bed: a fourth row at the back of the garden
  let garden = STRUCTURE_BUILDERS.garden;
  STRUCTURE_BUILDERS.garden = function (r, t, e, n, s, ctx) {
    garden(r, t, e, n, s, ctx);
    let o = n ? n.level : -1,
      a = n ? n.stage : 0;
    if (!(e >= 7 || o === 6)) return;
    let built = e >= 7,
      g = built || a >= 1 ? 1 : Math.max(0.15, s),
      pz = -2.2,
      beds = t.beds || [];
    r.push(part(lt(2.6 * g, 0.1, 0.8), PALETTE.soil, { y: 0.04, z: pz }));
    for (let m of [-0.42, 0.42]) r.push(part(lt(2.7 * g, 0.12, 0.06), PALETTE.plank2, { y: 0.07, z: pz + m }));
    if (!built) return;
    for (let m = 0; m < 4; m++) {
      let b = beds[12 + m];
      if (!b || b.state === "empty") continue;
      let x = -0.95 + m * 0.63,
        y = b.state === "ready" ? 1 : b.grow,
        H = 0.08 + y * 0.35;
      r.push(part(ze(0.12 + y * 0.1, H, 5), PALETTE.greens, { x, y: 0.1 + H / 2, z: pz }));
      b.state === "ready" && r.push(part(qt(0.08, 0), PALETTE.fruit, { x: x + 0.06, y: 0.18, z: pz + 0.12 }));
      b.water > 0.6 && b.state !== "ready" && r.push(part(lt(0.1, 0.01, 0.1), 5930912, { x: x + 0.1, y: 0.1, z: pz - 0.15 }));
    }
  };
  // a home is drawn again when its door colour or the things by its door change
  let sig = StructureView.prototype.sig;
  StructureView.prototype.sig = function (t) {
    let n = sig.call(this, t);
    if (t.kind === "home") {
      let w = this.world,
        o = t.owner != null ? w.byId[t.owner] : null,
        d = t.deco,
        k = d && d.old ? 1 : 0;
      if (d && d.list) for (let it of d.list) it.at <= w.t && k++;
      n += "|" + (o && t.level >= 1 ? homeFurHex(w, o) + ":" + k : "-");
    }
    return n;
  };
})();

// ---- markers at named places -------------------------------------------------------------
// One per named place that has no building of its own: a standing stone with flowers
// where someone passed, a cairn at the place of the first gift and at the spring, a
// signpost everywhere else.
var HOME_CAIRN_KINDS = { firstgift: 1, spring: 1 };

function homeGroundY(T, x, z) {
  return x >= 0 && z >= 0 && x <= VW && z <= VL ? T.heightAt(x, z) : T.heightRaw(x, z);
}
function homeMarkerSpots(w) {
  let T = w.terrain,
    out = [];
  for (let p of w.placeNames || []) {
    if (p.kind === "giving") continue; // the temple stands there
    if (w.structures.some((s) => s.kind !== "dam" && s.kind !== "home" && dist2d(s.x, s.z, p.x, p.z) < STRUCTURES[s.kind].radius + 0.8)) continue;
    let spot = null,
      a0 = Math.atan2(w.meadow.x - p.x, w.meadow.z - p.z);
    for (let ring of [0, 1.2, 2.2, 3.2, 4.4, 5.6]) {
      for (let k = 0; k < (ring ? 10 : 1) && !spot; k++) {
        let ang = a0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.63,
          x = p.x + Math.sin(ang) * ring,
          zz = p.z + Math.cos(ang) * ring;
        if (T.edgeDist(x, zz) < 0.7) continue;
        if (x > 1 && zz > 1 && x < VW - 1 && zz < VL - 1 && T.valleyR(x, zz) > 0.95) continue;
        if (w.structures.some((s) => dist2d(s.x, s.z, x, zz) < STRUCTURES[s.kind].radius + 0.9)) continue;
        if (ring < 5 && w.res.some((r) => (r.kind === "tree" || r.kind === "podtree" || r.kind === "orchard") && dist2d(r.x, r.z, x, zz) < 1.7)) continue; // not hidden under a tree
        if (out.some((m) => dist2d(m.x, m.z, x, zz) < 1.6)) continue;
        spot = { x, z: zz };
      }
      if (spot) break;
    }
    if (spot) out.push({ x: spot.x, z: spot.z, id: p.id, kind: p.kind, cairn: !!HOME_CAIRN_KINDS[p.kind] });
  }
  return out;
}
function homeMarkerParts(r, m, y) {
  let h = m.id * 7 + 3,
    k = 1.25, // a little larger than life, to read from the usual height
    ps = [],
    P = (g, c, o) => ps.push(part(g, c, o));
  if (m.kind === "rest") {
    // where someone passed: a standing stone, a smaller one at its foot, and flowers
    P(lt(0.3, 0.62, 0.13), PALETTE.stone, { y: 0.29, rz: (hash01(h + 1) - 0.5) * 0.12, jitter: 0.06, seed: h });
    P(lt(0.24, 0.06, 0.1), PALETTE.stone2, { y: 0.62 });
    P(on(0.12), PALETTE.stone2, { x: 0.24, y: 0.06, z: 0.08, sy: 0.6 });
    for (let j = 0; j < 4; j++) {
      let ang = j * 1.6 + hash01(h) * 3;
      P(yt(0.01, 0.01, 0.14, 3), PALETTE.greens, { x: Math.sin(ang) * 0.3, y: 0.07, z: 0.18 + Math.cos(ang) * 0.12 });
      P(qt(0.05, 0), HOME_FLOWERS[(h + j) % HOME_FLOWERS.length], { x: Math.sin(ang) * 0.3, y: 0.15, z: 0.18 + Math.cos(ang) * 0.12 });
    }
  } else if (m.cairn) {
    [
      [0.22, 0.11, PALETTE.stone2],
      [0.18, 0.28, PALETTE.stone],
      [0.145, 0.42, PALETTE.stone2],
      [0.11, 0.54, PALETTE.stone],
      [0.075, 0.64, m.kind === "spring" ? 0x9cc8e8 : 0xe2dccb],
    ].forEach(([rr, yy, c], j) => P(on(rr), c, { x: (hash01(h + j) - 0.5) * 0.06, y: yy, z: (hash01(h + j + 9) - 0.5) * 0.06, sy: 0.66, ry: j * 1.3 }));
  } else {
    P(yt(0.045, 0.055, 1.15, 5), PALETTE.plank2, { y: 0.575 });
    P(lt(0.62, 0.22, 0.05), PALETTE.plank, { x: 0.12, y: 0.96 });
    P(ze(0.13, 0.16, 4), PALETTE.plank, { x: 0.5, y: 0.96, rz: -Math.PI / 2, ry: Math.PI / 4 });
    for (let j = 0; j < 3; j++) {
      P(lt(0.07, 0.04, 0.012), PALETTE.dark, { x: -0.08 + j * 0.14, y: 0.97 + (j % 2) * 0.02, z: 0.03 });
      P(lt(0.07, 0.04, 0.012), PALETTE.dark, { x: -0.08 + j * 0.14, y: 0.97 + (j % 2) * 0.02, z: -0.03 });
    }
    P(on(0.1), PALETTE.stone2, { x: 0.1, y: 0.05, z: 0.05, sy: 0.7 });
    P(on(0.08), PALETTE.stone, { x: -0.09, y: 0.04, z: -0.04, sy: 0.7 });
  }
  let mt = new HM4().compose(new HV3(m.x, y, m.z), new HQ().setFromEuler(new HEu(0, (hash01(h + 5) - 0.5) * 0.8, 0)), new HV3(k, k, k));
  for (let g of ps) r.push(g.applyMatrix4(mt));
}

// ---- beyond the valley -----------------------------------------------------------------
var HOME_FAR = {
  pad: 18, // the ground mesh reaches this far beyond the valley's grid (land.js)
  step: 4, // the far land's grid
  reach: 168, // how far it reaches beyond that
  blend: 34, // over this distance the valley's own edge gives way to the far land
  lakeZ: 242, // the lake's centre, downstream
  lakeRX: 95,
  lakeRZ: 50,
};
var HOME_HAZE = new wt(0x9db0b6),
  HOME_SAND = new wt(0xcfc092);

var HomesView = class {
  constructor(w, scene) {
    this.world = w;
    this.scene = scene;
    this.group = new Pe();
    scene.add(this.group);
    this.markSig = "";
    this.markers = null;
    this.lastMark = -99;
    this.lastFar = -99;
    this.lastPaint = -99;
    this.paintKey = "";
    this.tailKey = "";
    try {
      this.buildFar();
    } catch (e) {
      console.error(e);
    }
    this.syncMarkers();
    this.buildSmoke();
  }
  dispose() {
    for (let m of [this.markers, this.far, this.trees, this.lake, this.tail]) m && m.geometry.dispose();
    this.smoke && (this.smoke.geometry.dispose(), this.smoke.dispose());
    this.scene.remove(this.group);
  }
  update(clock, R) {
    let w = this.world;
    if (clock - this.lastMark > 3) (this.lastMark = clock), this.syncMarkers();
    if (this.far && w.terrain.version !== this.farVer && clock - this.lastFar > 90) (this.lastFar = clock), this.refreshFar();
    if (this.far && clock - this.lastPaint > 4) (this.lastPaint = clock), this.paintFar(), this.syncTail();
    this.updateSmoke(clock);
  }

  // -- markers
  syncMarkers() {
    let w = this.world,
      sig = (w.placeNames || []).map((p) => p.id).join(",") + "|" + w.structures.length;
    if (sig === this.markSig) return;
    this.markSig = sig;
    if (this.markers) this.group.remove(this.markers), this.markers.geometry.dispose(), (this.markers = null);
    let r = [],
      T = w.terrain;
    for (let m of homeMarkerSpots(w)) homeMarkerParts(r, m, homeGroundY(T, m.x, m.z) - 0.02);
    let g = mergeParts(r);
    if (!g) return;
    let mesh = new Et(g, he());
    mesh.castShadow = mesh.receiveShadow = !0;
    this.markers = mesh;
    this.group.add(mesh);
  }

  // -- the far land: a grid all round the valley's ground mesh, its edge on the mesh's edge
  buildFar() {
    let w = this.world,
      T = w.terrain,
      F = HOME_FAR,
      S = F.step,
      cr = w.creek;
    this.X0 = -F.pad;
    this.X1 = VW + F.pad;
    this.Z0 = -F.pad;
    this.Z1 = VL + F.pad;
    this.fx0 = this.X0 - F.reach;
    this.fz0 = this.Z0 - F.reach;
    this.fnx = Math.round((this.X1 - this.X0 + 2 * F.reach) / S);
    this.fnz = Math.round((this.Z1 - this.Z0 + 2 * F.reach) / S);
    let ns = cr ? cr.nodes : T.initNodes,
      init = T.initNodes || ns,
      endBed = Math.min(init[init.length - 1].bed, ns[ns.length - 1].bed);
    this.lakeX = T.creekX(VL);
    this.lakeY = endBed - 0.6;
    this.tailY0 = cr ? creekAt(cr, this.Z1, "bed") + 0.1 : endBed;
    this.headY = cr ? creekAt(cr, this.Z0, "bed") + 0.2 : init[0].bed;
    let nx = this.fnx,
      nz = this.fnz,
      NV = (nx + 1) * (nz + 1);
    this.fd = new Float32Array(NV);
    this.fg = new Float32Array(NV);
    this.fh = new Float32Array(NV);
    for (let j = 0; j <= nz; j++)
      for (let i = 0; i <= nx; i++) {
        let k = j * (nx + 1) + i,
          x = this.fx0 + i * S,
          zz = this.fz0 + j * S,
          dx = Math.max(this.X0 - x, 0, x - this.X1),
          dz = Math.max(this.Z0 - zz, 0, zz - this.Z1),
          d = Math.hypot(dx, dz);
        this.fd[k] = d;
        this.fg[k] = this.farDesign(x, zz, d);
      }
    // the cells: everything outside the valley's mesh, and one ring inside it as a skirt
    let cells = [];
    for (let j = 0; j < nz; j++)
      for (let i = 0; i < nx; i++) {
        let x = this.fx0 + i * S,
          zz = this.fz0 + j * S,
          inside = x >= this.X0 && x + S <= this.X1 && zz >= this.Z0 && zz + S <= this.Z1,
          ring = x === this.X0 || x + S === this.X1 || zz === this.Z0 || zz + S === this.Z1;
        if (!inside || ring) cells.push(i, j);
      }
    this.cells = cells;
    let n = cells.length / 2;
    this.fpos = new Float32Array(n * 18);
    this.fcol = new Float32Array(n * 18);
    this.fbase = new Float32Array(n * 6); // a colour per triangle
    let g = new ye();
    g.setAttribute("position", new Le(this.fpos, 3));
    g.setAttribute("color", new Le(this.fcol, 3));
    let m = new Et(g, new Qe({ vertexColors: !0, flatShading: !0 }));
    m.receiveShadow = !1;
    m.frustumCulled = !1;
    this.far = m;
    this.group.add(m);
    this.buildLake();
    this.refreshFar();
  }
  // the land beyond: rolling hills rising to a far ridge; a basin with the lake downstream;
  // the creek's way down to it; a ravine above the valley's head where the creek comes from
  farDesign(x, zz, d) {
    let T = this.world.terrain,
      N = T.noise,
      F = HOME_FAR,
      n1 = N.fbm(x * 0.016 + 31.7, zz * 0.016 + 7.3, 3),
      n2 = N.fbm(x * 0.0065 + 5.1, zz * 0.0065 + 13.9, 3),
      rd = 1 - Math.abs(2 * N.fbm(x * 0.028 + 3.3, zz * 0.028 + 41.1, 2) - 1),
      far = smoothstep(25, 150, d),
      g = 2 + 12 * n1 + far * (12 + 36 * n2 + 9 * rd);
    let ex = (x - this.lakeX) / F.lakeRX,
      ez = (zz - F.lakeZ) / F.lakeRZ,
      e = Math.sqrt(ex * ex + ez * ez),
      basin = this.lakeY - 1.6 + (e < 1 ? 1.6 * e * e : 1.6 + (e - 1) * 7 + (e - 1) * (e - 1) * 45);
    if (basin < g) g = basin;
    if (zz > VL) {
      let t = smoothstep(this.Z1, F.lakeZ - F.lakeRZ + 8, zz),
        cx = T.creekX(Math.min(zz, this.Z1)) * (1 - t) + this.lakeX * t,
        q = Math.abs(x - cx),
        wl = this.tailY0 * (1 - t) + this.lakeY * t,
        ch = wl - 0.3 + Math.max(0, q - 1.0) * 0.3 + Math.max(0, q - 7) * 0.55;
      if (ch < g) g = ch;
    }
    if (zz < 0) {
      let q = Math.abs(x - T.creekX(Math.max(zz, -39))),
        ch = this.headY + -zz * 0.22 + q * 0.45 + Math.max(0, q - 5) * 0.8;
      if (ch < g) g = ch;
    }
    return g;
  }
  // the valley's own ground at (x, z), as land.js draws it (outside the grid: its hills)
  seamH(x, zz) {
    let T = this.world.terrain,
      h = T.heightRaw(x, zz);
    return T.uncarvedAt(x, zz) - h > 0.02 ? h - 0.6 : h;
  }
  farHeights() {
    let F = HOME_FAR,
      S = F.step,
      nx = this.fnx,
      nz = this.fnz;
    for (let j = 0; j <= nz; j++)
      for (let i = 0; i <= nx; i++) {
        let k = j * (nx + 1) + i,
          d = this.fd[k],
          x = this.fx0 + i * S,
          zz = this.fz0 + j * S;
        if (d >= F.blend) {
          this.fh[k] = this.fg[k];
          continue;
        }
        let inside = x > this.X0 && x < this.X1 && zz > this.Z0 && zz < this.Z1;
        if (inside) {
          this.fh[k] = this.seamH(x, zz) - 1.5;
          continue;
        }
        let bx = clamp(x, this.X0, this.X1),
          bz = clamp(zz, this.Z0, this.Z1),
          s = smoothstep(0, F.blend, d);
        this.fh[k] = this.seamH(bx, bz) * (1 - s) + this.fg[k] * s;
      }
  }
  farHeightAt(x, zz) {
    let S = HOME_FAR.step,
      fi = clamp((x - this.fx0) / S, 0, this.fnx - 1e-3),
      fj = clamp((zz - this.fz0) / S, 0, this.fnz - 1e-3),
      i = Math.floor(fi),
      j = Math.floor(fj),
      u = fi - i,
      v = fj - j,
      W = this.fnx + 1,
      H = this.fh,
      a = H[j * W + i],
      b = H[j * W + i + 1],
      c = H[(j + 1) * W + i],
      e = H[(j + 1) * W + i + 1];
    return (a + (b - a) * u) * (1 - v) + (c + (e - c) * u) * v;
  }
  refreshFar() {
    let w = this.world,
      F = HOME_FAR,
      S = F.step,
      W = this.fnx + 1,
      H = this.fh,
      p = this.fpos,
      cells = this.cells,
      N = w.terrain.noise,
      tmp = new wt(),
      l = 0,
      tri = 0;
    this.farHeights();
    this.farVer = w.terrain.version;
    let put = (ax, ay, az, bx, by, bz, cx, cy, cz, d) => {
      p[l++] = ax, p[l++] = ay, p[l++] = az;
      p[l++] = bx, p[l++] = by, p[l++] = bz;
      p[l++] = cx, p[l++] = cy, p[l++] = cz;
      // its colour: shore, grass, hillside or rock, hazier with distance
      let y = (ay + by + cy) / 3,
        rel = y - this.lakeY,
        slope = (Math.max(ay, by, cy) - Math.min(ay, by, cy)) / S,
        mx = (ax + bx + cx) / 3,
        mz = (az + bz + cz) / 3,
        nz = N.get(mx * 0.09, mz * 0.09),
        h01 = hash01(tri * 7 + 3);
      if (slope > 1.15) tmp.set(h01 > 0.5 ? PALETTE.rock : PALETTE.rock2).multiplyScalar(0.9 + nz * 0.2);
      else {
        tmp.set(PALETTE.grass2).lerp(Be(nz > 0.5 ? PALETTE.hill : PALETTE.hill2), smoothstep(1.5, 12, rel)).multiplyScalar(0.94 + h01 * 0.1);
        if (rel < 0.9 && mz > VL) tmp.lerp(HOME_SAND, smoothstep(0.9, 0.2, rel));
      }
      tmp.lerp(HOME_HAZE, smoothstep(70, 175, d) * 0.4);
      this.fbase[tri * 3] = tmp.r;
      this.fbase[tri * 3 + 1] = tmp.g;
      this.fbase[tri * 3 + 2] = tmp.b;
      tri++;
    };
    for (let c = 0; c < cells.length; c += 2) {
      let i = cells[c],
        j = cells[c + 1],
        x = this.fx0 + i * S,
        zz = this.fz0 + j * S,
        a = H[j * W + i],
        b = H[j * W + i + 1],
        cc = H[(j + 1) * W + i],
        e = H[(j + 1) * W + i + 1],
        d = this.fd[j * W + i];
      put(x, a, zz, x, cc, zz + S, x + S, b, zz, d);
      put(x + S, b, zz, x, cc, zz + S, x + S, e, zz + S, d);
    }
    let g = this.far.geometry;
    g.attributes.position.needsUpdate = !0;
    g.computeVertexNormals();
    g.computeBoundingSphere();
    this.paintKey = "";
    this.paintFar();
    this.buildTrees();
  }
  // dry seasons and snow days reach the far hills too, as they do the valley's rim
  paintFar() {
    let w = this.world,
      cr = w.creek,
      soil = cr ? cr.soil : 1,
      snow = typeof snowLevel === "function" ? snowLevel(w) : 0,
      key = Math.round(soil * 40) + ":" + Math.round(snow * 20);
    if (key === this.paintKey) return;
    this.paintKey = key;
    let dry = 1 - (0.35 + 0.65 * soil),
      col = this.fcol,
      B = this.fbase,
      g = new wt(),
      ss = (a, b, x) => {
        let y = clamp((x - a) / (b - a), 0, 1);
        return y * y * (3 - 2 * y);
      },
      n = B.length / 3;
    for (let t = 0; t < n; t++) {
      g.setRGB(B[t * 3], B[t * 3 + 1], B[t * 3 + 2]);
      if (dry > 0.02) g.lerp(LAND.straw, ss(0.05, 0.9, dry) * 0.7);
      if (dry > 0.6) g.lerp(LAND.dust, (dry - 0.6) * 0.6);
      if (snow > 0) g.lerp(LAND_SNOW, snow * (0.7 + 0.2 * hash01(t)));
      let s = t % 2 ? 0.97 : 1;
      for (let v = 0; v < 3; v++) (col[t * 9 + v * 3] = g.r * s), (col[t * 9 + v * 3 + 1] = g.g * s), (col[t * 9 + v * 3 + 2] = g.b * s);
    }
    this.far.geometry.attributes.color.needsUpdate = !0;
  }
  // woods on the near slopes beyond the rim, like the trees on the rim itself
  buildTrees() {
    if (this.trees) this.group.remove(this.trees), this.trees.geometry.dispose(), (this.trees = null);
    let T = this.world.terrain,
      e = [],
      s = 9001;
    for (let a = 0; a < 2400 && e.length < 1400; a++) {
      let x = this.fx0 + hash01(s++) * (this.X1 - this.X0 + 2 * HOME_FAR.reach),
        zz = this.fz0 + hash01(s++) * (this.Z1 - this.Z0 + 2 * HOME_FAR.reach),
        dx = Math.max(this.X0 - x, 0, x - this.X1),
        dz = Math.max(this.Z0 - zz, 0, zz - this.Z1),
        d = Math.hypot(dx, dz),
        f = hash01(s++),
        u = 1 + hash01(s++) * 0.9;
      if (d < 2 || d > 95 || hash01(s++) > 1.15 - d / 80) continue;
      if ((zz > VL || zz < 0) && Math.abs(x - (zz > VL ? this.lakeX : T.creekX(-39))) < 9 + (zz > VL ? 0 : 0)) continue;
      let y = this.farHeightAt(x, zz),
        y2 = this.farHeightAt(x + 2, zz + 2);
      if (y < this.lakeY + 1.4 || Math.abs(y2 - y) > 2.6) continue;
      f < 0.7
        ? (e.push(part(yt(0.1, 0.13, 0.6, 4), PALETTE.trunk, { x, y: y + 0.3 * u, z: zz, sx: u, sy: u, sz: u })),
          e.push(part(ze(0.75, 1.8, 5), f < 0.4 ? PALETTE.pine : PALETTE.leaf3, { x, y: y + 1.45 * u, z: zz, sx: u, sy: u, sz: u, ry: f * 9 })))
        : (e.push(part(yt(0.1, 0.13, 0.7, 4), PALETTE.trunk, { x, y: y + 0.35 * u, z: zz, sx: u, sy: u, sz: u })),
          e.push(part(qt(0.8, 0), f < 0.88 ? PALETTE.leaf : PALETTE.hill, { x, y: y + 1.2 * u, z: zz, sx: u, sy: u * 0.9, sz: u })));
    }
    let g = mergeParts(e);
    if (!g) return;
    let m = new Et(g, he());
    m.frustumCulled = !1;
    this.trees = m;
    this.group.add(m);
  }
  // the lake: still water at its level; the land around it decides its shore
  buildLake() {
    // rings of facets, each a shade apart, deeper blue towards the middle
    let F = HOME_FAR,
      pos = [],
      col = [],
      deep = new wt(0x2f6c92),
      shore = new wt(0x4f96b8),
      c = new wt(),
      K = 48,
      R = 6,
      at = (ring, k) => {
        let a = (k / K) * Math.PI * 2 + (ring % 2) * (Math.PI / K),
          f = (ring / R) * 1.08;
        return [this.lakeX + Math.sin(a) * F.lakeRX * f, this.lakeY, Math.max(this.Z1 + 8, F.lakeZ + Math.cos(a) * F.lakeRZ * f)];
      },
      tri = (p, q, r, ring, n) => {
        pos.push(...p, ...q, ...r);
        c.copy(deep).lerp(shore, ring / R).multiplyScalar(0.94 + 0.12 * hash01(n));
        for (let v = 0; v < 3; v++) col.push(c.r, c.g, c.b);
      };
    for (let ring = 0; ring < R; ring++)
      for (let k = 0; k < K; k++) {
        let a = ring ? at(ring, k) : [this.lakeX, this.lakeY, F.lakeZ],
          b = at(ring + 1, k),
          d = at(ring + 1, k + 1),
          e = ring ? at(ring, k + 1) : a;
        tri(a, b, d, ring, ring * 97 + k);
        if (ring) tri(a, d, e, ring, ring * 97 + k + 500);
      }
    let g = new ye();
    g.setAttribute("position", new Zt(pos, 3));
    g.setAttribute("color", new Zt(col, 3));
    g.computeVertexNormals();
    let m = new Et(g, new Qe({ vertexColors: !0, flatShading: !0 }));
    m.frustumCulled = !1;
    this.lake = m;
    this.group.add(m);
  }
  // the creek from the valley's mouth down to the lake, while it is running
  syncTail() {
    let w = this.world,
      cr = w.creek,
      T = w.terrain,
      F = HOME_FAR;
    if (!cr) return;
    let wl0 = creekAt(cr, this.Z1, "wl"),
      bed0 = creekAt(cr, this.Z1, "bed"),
      run = wl0 - bed0 > 0.004,
      key = run ? Math.round(wl0 * 50) + "" : "dry";
    if (key === this.tailKey) return;
    this.tailKey = key;
    if (this.tail) this.group.remove(this.tail), this.tail.geometry.dispose(), (this.tail = null);
    if (!run) return;
    let pos = [],
      idx = [],
      z1 = F.lakeZ - F.lakeRZ + 10,
      prev = -1;
    for (let zz = this.Z1 - 0.5; zz <= z1; zz += 1) {
      let t = smoothstep(this.Z1, F.lakeZ - F.lakeRZ + 8, zz),
        cx = T.creekX(Math.min(zz, this.Z1)) * (1 - t) + this.lakeX * t,
        y = Math.max(wl0 * (1 - t) + this.lakeY * t, this.lakeY) + 0.02,
        half = 0.75 + 0.6 * t,
        b = pos.length / 3;
      pos.push(cx - half, y, zz, cx, y, zz, cx + half, y, zz);
      if (prev >= 0) idx.push(prev, b, prev + 1, prev + 1, b, b + 1, prev + 1, b + 1, prev + 2, prev + 2, b + 1, b + 2);
      prev = b;
    }
    let g = new ye();
    g.setAttribute("position", new Zt(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    let m = new Et(g, this.tailMat || (this.tailMat = new Qe({ color: 0x58a8cc })));
    m.frustumCulled = !1;
    this.tail = m;
    this.group.add(m);
  }

  // -- smoke from the hearths' chimneys on cold days, in the evening and at night
  buildSmoke() {
    let m = new Ts(qt(0.5, 0), new Qe({ color: 0xf2f0ec, flatShading: !0, transparent: !0, opacity: 0.6, depthWrite: !1 }), 3 * 64);
    m.count = 0;
    m.frustumCulled = !1;
    this.smoke = m;
    this.group.add(m);
    this.m4 = new HM4();
    this.q = new HQ();
    this.v = new HV3();
    this.sv = new HV3();
  }
  updateSmoke(clock) {
    let w = this.world,
      T = w.terrain,
      night = 1 - daylight(w.t),
      season = seasonAt(w).name,
      on = season === "winter" || season === "autumn" || night > 0.25 || w.weather.rain > 0.3,
      n = 0;
    if (on)
      for (let s of w.structures) {
        if (s.kind !== "home" || s.level < 8 || n >= 3 * 64) continue;
        let r = s.rot || 0,
          lx = 0.64,
          lz = -0.76,
          x = s.x + lx * Math.cos(r) + lz * Math.sin(r),
          zz = s.z - lx * Math.sin(r) + lz * Math.cos(r),
          top = T.heightAt(s.x, s.z) + 0.38 + 1.9 + 0.2;
        for (let k = 0; k < 3; k++) {
          let age = (clock * 0.22 + k / 3 + hash01(s.id)) % 1,
            sc = (0.12 + age * 0.26) * (age > 0.8 ? (1 - age) * 5 : 1);
          this.v.set(x + age * 0.5, top + age * 1.3, zz + age * 0.2);
          this.sv.set(sc, sc, sc);
          this.m4.compose(this.v, this.q, this.sv);
          this.smoke.setMatrixAt(n++, this.m4);
        }
      }
    this.smoke.count = n;
    this.smoke.instanceMatrix.needsUpdate = !0;
  }
};

// ---- into the renderer ---------------------------------------------------------------------
(function () {
  let setWorld = Renderer.prototype.setWorld,
    disposeViews = Renderer.prototype.disposeViews,
    update = Renderer.prototype.update;
  Renderer.prototype.setWorld = function (t) {
    let r = setWorld.call(this, t);
    try {
      this.views.homes = new HomesView(t, this.scene);
    } catch (e) {
      console.error(e);
    }
    return r;
  };
  Renderer.prototype.disposeViews = function () {
    let h = this.views && this.views.homes;
    h && h.dispose();
    return disposeViews.call(this);
  };
  Renderer.prototype.update = function (t, e, n) {
    let r = update.call(this, t, e, n),
      h = this.views && this.views.homes;
    h && h.update(e, this);
    return r;
  };
})();
