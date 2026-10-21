// Phase 3C: drawing grove trees, nurse logs, goats' kids, butterflies, herons, mist.
// Owner: helper "grove".
//
// Everything here reads the world and never changes it. It is hooked in by wrapping:
//   ResourceView no longer draws memorial trees one by one (makeView/sig skip "grove");
//   BeliefView.update also updates a LifeView (created on first use), and BeliefView's
//   goats are drawn small while they are kids;
//   the panel for someone who has passed says which tree grows for them, or that it fell.
// The grove is drawn with a few instanced meshes (a trunk and a crown per kind of tree),
// so hundreds of trees cost a handful of draw calls.
// ==========================================================================

// Leaf colours through the year (crowns are drawn in greys and tinted per tree).
var GROVE_LEAF = {
  oak: { spring: 0x84b84c, summer: 0x467f34, autumn: 0xc8622a, winter: 0x7d6a4e },
  birch: { spring: 0xa8d060, summer: 0x9cc852, autumn: 0xeab830, winter: 0x9a8c6c },
  willow: { spring: 0xb4d064, summer: 0xa8bc66, autumn: 0xa8b448, winter: 0x8e9a60 },
  pine: { spring: 0x3c7c4c, summer: 0x2f6b46, autumn: 0x2f6846, winter: 0x2b5c44 },
};
var GROVE_BARK = { oak: 0x6b4a2b, pine: 0x5e4430, willow: 0x6e5a3a, birch: 0xe6e2d6 };
var BUTTERFLY_COLOR = [0xfffcf0, 0xffd820, 0xff8a1c, 0x58a8ff, 0xfff4a0, 0xff6a3a];

// One kind of memorial tree: the trunk in its own colours, the crown in greys (tinted per
// tree). Scale 1 is a full young tree, about as tall as the valley's other trees.
function groveKindGeometry(kind) {
  let G = 0xffffff,
    g2 = 0xdcdcdc,
    g3 = 0xc4c4c4,
    trunk,
    crown;
  if (kind === "pine") {
    trunk = mergeParts([part(yt(0.08, 0.15, 1.1, 5), GROVE_BARK.pine, { y: 0.55 })]);
    crown = mergeParts([
      part(ze(0.85, 1.1, 7), g2, { y: 1.05 }),
      part(ze(0.66, 0.95, 7), G, { y: 1.6, ry: 0.4 }),
      part(ze(0.46, 0.8, 7), g2, { y: 2.12 }),
      part(ze(0.24, 0.55, 6), G, { y: 2.55, ry: 0.3 }),
    ]);
  } else if (kind === "willow") {
    trunk = mergeParts([part(yt(0.12, 0.2, 1.4, 6), GROVE_BARK.willow, { y: 0.7, rz: 0.06 }), part(yt(0.05, 0.07, 0.7, 4), GROVE_BARK.willow, { x: 0.25, y: 1.3, rz: -0.7 })]);
    let a = [part(qt(0.85, 0), G, { y: 1.8, sy: 0.6 }), part(qt(0.55, 0), g2, { x: 0.35, y: 2.05, z: -0.2, sy: 0.6 })];
    for (let l = 0; l < 9; l++) {
      let c = (l / 9) * 6.28;
      a.push(part(ze(0.26, 1.35, 4), l % 2 ? g2 : g3, { x: Math.cos(c) * 0.78, y: 1.2, z: Math.sin(c) * 0.78, rx: Math.PI }));
    }
    crown = mergeParts(a);
  } else if (kind === "birch") {
    trunk = mergeParts([
      part(yt(0.07, 0.1, 2.0, 6), GROVE_BARK.birch, { y: 1.0 }),
      part(lt(0.1, 0.04, 0.11), 0x2a2622, { y: 0.55 }),
      part(lt(0.1, 0.04, 0.11), 0x2a2622, { y: 1.05, ry: 1.1 }),
      part(lt(0.09, 0.035, 0.1), 0x2a2622, { y: 1.5, ry: 2 }),
    ]);
    crown = mergeParts([part(qt(0.55, 0), G, { y: 2.05, sy: 1.45 }), part(qt(0.4, 0), g2, { x: 0.28, y: 1.75, z: 0.15, sy: 1.2 }), part(qt(0.36, 0), g3, { x: -0.22, y: 2.35, z: -0.12, sy: 1.2 })]);
  } else {
    trunk = mergeParts([part(yt(0.13, 0.19, 1.35, 6), GROVE_BARK.oak, { y: 0.67 }), part(yt(0.05, 0.08, 0.7, 4), GROVE_BARK.oak, { x: -0.25, y: 1.25, rz: 0.75 })]);
    crown = mergeParts([
      part(qt(0.9, 0), G, { y: 1.8, sy: 0.85 }),
      part(qt(0.6, 0), g2, { x: 0.58, y: 1.55, z: 0.2 }),
      part(qt(0.55, 0), g3, { x: -0.5, y: 1.65, z: -0.25 }),
      part(qt(0.5, 0), g2, { x: 0.05, y: 2.25, z: -0.35 }),
    ]);
  }
  return { trunk, crown };
}

// Mist: a soft round puff (a canvas texture made once).
var groveMistTex = null;
function groveMistTexture() {
  if (groveMistTex) return groveMistTex;
  let c = document.createElement("canvas");
  c.width = c.height = 64;
  let x = c.getContext("2d"),
    gr = x.createRadialGradient(32, 32, 2, 32, 32, 31);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.45, "rgba(255,255,255,0.55)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = gr;
  x.fillRect(0, 0, 64, 64);
  groveMistTex = new Tr(c);
  return groveMistTex;
}

// How much of a season colour has turned toward the next one.
function groveSeasonColor(kind, s, jitter, col) {
  let order = ["spring", "summer", "autumn", "winter"],
    L = GROVE_LEAF[kind],
    turn = smoothstep(0.55, 1, clamp(s.progress + (jitter - 0.5) * 0.3, 0, 1));
  col.set(L[s.name]);
  if (turn > 0) col.lerp(new wt(L[order[(s.idx + 1) % 4]]), turn);
  return col;
}

var LifeView = class {
  constructor(world, scene) {
    this.world = world;
    this.scene = scene;
    this.group = new Pe();
    scene.add(this.group);
    this.m4 = new se();
    this.q = new mn();
    this.eu = new bn();
    this.v = new z();
    this.sc = new z(1, 1, 1);
    this.col = new wt();
    this.col2 = new wt();
    let inst = (geom, n, mat, shadow = true) => {
      let m = new Ts(geom, mat, n);
      m.count = 0;
      m.frustumCulled = false;
      m.castShadow = shadow;
      this.group.add(m);
      return m;
    };
    this.inst = inst;
    // the grove: a trunk and a crown per kind
    let N = GROVE.maxStanding + GROVE.maxLogs * 2 + 8;
    this.kinds = {};
    for (let k of GROVE.kinds) {
      let g = groveKindGeometry(k);
      this.kinds[k] = { trunk: inst(g.trunk, N, he()), crown: inst(g.crown, N, he()) };
    }
    this.stones = inst(mergeParts([part(on(0.09), 0xffffff, { y: 0.05 })]), GROVE.maxStanding + 8, new Qe({ vertexColors: true, flatShading: true }), false);
    // nurse logs: a log (unit length along +x, unit radius), moss, ferns
    this.logs = inst(
      mergeParts([part(yt(1, 1, 1, 8), 0xffffff, { rz: Math.PI / 2, x: 0.5 }), part(yt(0.86, 0.86, 0.02, 8), 0x9a8a78, { rz: Math.PI / 2, x: 0.002 }), part(yt(0.86, 0.86, 0.02, 8), 0x9a8a78, { rz: Math.PI / 2, x: 0.998 })]),
      GROVE.maxLogs + 2,
      new Qe({ vertexColors: true, flatShading: true }),
    );
    this.moss = inst(mergeParts([part(qt(0.16, 0), 0xffffff, { sy: 0.45 })]), (GROVE.maxLogs + 2) * 10, new Qe({ vertexColors: true, flatShading: true }), false);
    let fr = [];
    for (let i = 0; i < 6; i++) {
      let a = (i / 6) * Math.PI * 2;
      fr.push(part(lt(0.05, 0.012, 0.42), i % 2 ? 0xffffff : 0xd8d8d8, { x: Math.cos(a) * 0.17, y: 0.13, z: Math.sin(a) * 0.17, ry: -a + Math.PI / 2, rx: 0, rz: 0 }));
    }
    // each frond arches out and up from the middle
    fr = fr.map((g, i) => {
      let a = (i / 6) * Math.PI * 2,
        m = new se().compose(new z(0, 0, 0), new mn().setFromEuler(new bn(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5)), new z(1, 1, 1));
      return g.applyMatrix4(m);
    });
    this.ferns = inst(mergeParts(fr), (GROVE.maxLogs + 2) * 5, new Qe({ vertexColors: true, flatShading: true }), false);
    // butterflies: two wings beating about the body
    let wingMat = new je({ vertexColors: true, side: 2 });
    let wing = (sg) => mergeParts([part(lt(0.12, 0.004, 0.13), 0xffffff, { z: sg * 0.07 }), part(lt(0.06, 0.006, 0.05), 0x2a2420, { x: 0.035, z: sg * 0.12 }), sg > 0 ? part(lt(0.11, 0.025, 0.025), 0x2a2420, {}) : null]);
    this.wingL = inst(wing(1), 64, wingMat, false);
    this.wingR = inst(wing(-1), 64, wingMat, false);
    // herons, a few at most
    this.herons = [];
    // mist
    this.mistMat = new je({ map: groveMistTexture(), color: 0xf4f6f8, transparent: true, opacity: 0, depthWrite: false });
    this.mist = inst(new As(1, 1), 160, this.mistMat, false);
    this.mist.renderOrder = 2;
    this.mistSpots = [];
    this.mistKey = "";
    this.flySpots = [];
    this.flyKey = "";
    this.heronKey = "";
    this.heronSpots = [];
    this.treeKey = "";
    this.preview = null;
  }
  dispose() {
    this.group.traverse((o) => {
      o.isInstancedMesh && o.dispose();
      o.geometry && o.geometry.dispose();
    });
    this.scene.remove(this.group);
  }
  h(x, z) {
    return this.world.terrain.heightAt(clamp(x, 0, VW - 0.01), clamp(z, 0, VL - 0.01));
  }
  put(mesh, i, x, y, z, rx, ry, rz, sx, sy, sz, col, order = "XYZ") {
    if (i >= mesh.instanceMatrix.count) return;
    this.eu.set(rx, ry, rz, order);
    this.q.setFromEuler(this.eu);
    this.v.set(x, y, z);
    this.sc.set(sx, sy, sz);
    this.m4.compose(this.v, this.q, this.sc);
    mesh.setMatrixAt(i, this.m4);
    if (col !== undefined) mesh.setColorAt(i, typeof col === "number" ? this.col.set(col) : col);
  }
  done(mesh, n) {
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }
  update(clock, night, rain, dl, camera, focus) {
    let w = this.world;
    this.updateGrove(w, clock, camera, focus);
    this.updateButterflies(w, clock, night, rain);
    this.updateHerons(w, clock, night);
    this.updateMist(w, clock, camera);
  }

  // -------------------------------------------------------------------------
  // The memorial grove and its nurse logs
  // -------------------------------------------------------------------------
  groveTrees(w) {
    let trees = [];
    for (let r of w.res) if (r.kind === "grove") trees.push(r);
    return trees;
  }
  updateGrove(w, clock, camera, focus) {
    let trees = this.groveTrees(w),
      g = w.grove,
      logs = (g && g.logs) || [];
    // what changes slowly (which trees, how big, their colours) is worked out now and then
    let key = trees.length + ":" + (trees.length ? trees[trees.length - 1].id : 0) + ":" + logs.length + ":" + (logs.length ? logs[logs.length - 1].id : 0) + ":" + Math.floor(clock / 4) + ":" + (snowLevel(w) > 0.3 ? 1 : 0);
    if (key !== this.treeKey) {
      this.treeKey = key;
      this.layoutGrove(w, trees, logs);
    }
    // crowns sway; those between you and the creekfolk you follow, or what you've come
    // close to look at, are left out (so you can see the forest floor)
    let rig = window.__creek && window.__creek.rig,
      e = rig && (rig.follow || (rig.cur && rig.cur.dist < 20)) && camera && camera.position,
      fy = focus ? this.h(focus.x, focus.z) + 0.5 : 0,
      n = {};
    for (let k of GROVE.kinds) n[k] = 0;
    for (let t of this.drawn) {
      let K = this.kinds[t.kind],
        faded = false;
      if (e && focus && !t.sapling) {
        let cy = t.y + 1.8 * t.sy,
          dx = focus.x - e.x,
          dy = fy - e.y,
          dz = focus.z - e.z,
          L = dx * dx + dy * dy + dz * dz,
          m = clamp(((t.x - e.x) * dx + (cy - e.y) * dy + (t.z - e.z) * dz) / L, 0, 1),
          bx = e.x + dx * m - t.x,
          by = e.y + dy * m - cy,
          bz = e.z + dz * m - t.z,
          R = 1.5 * t.sx,
          inside = (t.x - e.x) ** 2 + (cy - e.y) ** 2 + (t.z - e.z) ** 2 < R * R;
        faded = inside || (m > 0.02 && m < 0.98 && bx * bx + by * by + bz * bz < R * R);
      }
      let sway = (0.025 / Math.sqrt(t.sy)) * (w.weather.rain > 1 ? 2.2 : 1),
        rz = Math.sin(clock * 0.9 + t.phase) * sway,
        rx = Math.cos(clock * 0.7 + t.phase) * sway * 0.6;
      if (faded) continue;
      this.put(K.crown, n[t.kind]++, t.x, t.y, t.z, rx, t.ry, rz, t.sx * t.cs, t.sy * t.cs, t.sx * t.cs, t.leaf);
    }
    for (let k of GROVE.kinds) this.done(this.kinds[k].crown, n[k]);
  }
  layoutGrove(w, trees, logs) {
    let s = seasonAt(w),
      snow = snowLevel(w),
      deciduous = { oak: 1, birch: 1, willow: 0.5, pine: 0 },
      pv = null;
    if (trees.some((t) => !t.tk)) {
      // a grove from before 3C, until the first life check gives its trees their kinds
      if (!this.preview || this.preview.n !== trees.length) this.preview = { n: trees.length, map: groveKindsPreview(w) };
      pv = this.preview.map;
    }
    this.drawn = [];
    let nt = {},
      ns = 0;
    for (let k of GROVE.kinds) nt[k] = 0;
    let tree = (x, zz, kind, size, id, sapling) => {
      let sx = Math.pow(size, 0.6), // old trees grow tall more than wide
        sy = size,
        jit = hash01(id * 3 + 1),
        leaf = groveSeasonColor(kind, s, jit, new wt()),
        cs = 1;
      leaf.multiplyScalar(0.9 + 0.18 * hash01(id * 5 + 2));
      if (s.name === "winter" && deciduous[kind]) cs = 1 - 0.18 * deciduous[kind];
      if (snow > 0.3) leaf.lerp(this.col2.set(0xf2f2ee), 0.55 * snow * (kind === "pine" ? 1 : 0.7));
      let y = this.h(x, zz) - 0.05,
        ry = hash01(id * 7) * 6.28;
      this.put(this.kinds[kind].trunk, nt[kind]++, x, y, zz, 0, ry, 0, sx, sy, sx, 0xffffff);
      this.drawn.push({ x, y, z: zz, sx, sy, ry, kind, leaf, cs, phase: hash01(id * 7 + 3) * 6.28, sapling });
      return { sx, ry };
    };
    for (let t of trees) {
      let kind = t.tk || (pv && pv.get(t.id)) || "oak",
        size = groveSize(w, t),
        r = tree(t.x, t.z, kind, size, t.id, false);
      if (ns < this.stones.instanceMatrix.count) {
        let a = r.ry + 0.9,
          d = 0.3 + 0.2 * r.sx,
          x = t.x + Math.cos(a) * d,
          zz = t.z + Math.sin(a) * d;
        this.put(this.stones, ns++, x, this.h(x, zz), zz, 0, a, 0, 1, 1, 1, PALETTE.stone2);
      }
    }
    // nurse logs: they sink and soften as they rot, moss spreads, ferns and young trees grow
    let nl = 0,
      nm = 0,
      nf = 0;
    for (let l of logs) {
      let d = groveLogDecay(w, l),
        r = l.r * (1 - 0.35 * d) * (d > 0.85 ? 1 - (d - 0.85) / 0.15 * 0.6 : 1),
        cx = Math.cos(l.rot),
        cz = Math.sin(l.rot),
        h0 = this.h(l.x, l.z),
        h1 = this.h(l.x + cx * l.len, l.z + cz * l.len),
        slope = Math.atan2(h1 - h0, l.len),
        y0 = h0 + r * (0.85 - 0.6 * d),
        bark = this.col.set(GROVE_BARK[l.tk] || GROVE_BARK.oak).lerp(this.col2.set(0x4a5a30), 0.25 + 0.5 * d);
      this.put(this.logs, nl++, l.x, y0, l.z, 0, -l.rot, slope, l.len, r, r, bark);
      let top = (u) => ({ x: l.x + cx * u * l.len, y: y0 + Math.sin(slope) * u * l.len + r * 0.85, z: l.z + cz * u * l.len }),
        mossN = Math.min(10, 3 + Math.floor(d * 8));
      for (let i = 0; i < mossN; i++) {
        let u = 0.08 + 0.84 * hash01(l.id * 11 + i),
          p = top(u);
        this.put(this.moss, nm++, p.x, p.y, p.z, 0, hash01(l.id + i * 3) * 6.28, 0, (0.9 + hash01(l.id * 3 + i)) * Math.max(0.7, r * 2.2), 1, 1 + hash01(l.id * 5 + i), i % 3 ? 0x5e8c3a : 0x7a9a44);
      }
      for (let i = 0; i < Math.min(5, 2 + Math.floor(d * 4)); i++) {
        let u = 0.1 + 0.8 * hash01(l.id * 13 + i),
          side = i % 2 ? 1 : -1,
          off = r + 0.25 + 0.25 * hash01(l.id * 17 + i),
          x = l.x + cx * u * l.len - cz * off * side,
          zz = l.z + cz * u * l.len + cx * off * side;
        this.put(this.ferns, nf++, x, this.h(x, zz), zz, 0, hash01(l.id + i) * 6.28, 0, 0.7 + 0.5 * d + 0.3 * hash01(l.id * 19 + i), 0.7 + 0.6 * d, 0.7 + 0.5 * d + 0.3 * hash01(l.id * 19 + i), i % 2 ? 0x4f8a3c : 0x63973f);
      }
      // a sapling or two growing out of the log itself
      for (let i = 0; i < 1 + (hash01(l.id * 23) < 0.6 ? 1 : 0); i++) {
        let u = 0.3 + 0.45 * hash01(l.id * 29 + i),
          p = top(u),
          kind = hash01(l.id * 31 + i) < 0.6 ? l.tk : GROVE.kinds[Math.floor(hash01(l.id * 37 + i) * 4)];
        tree(p.x, p.z, kind, 0.12 + 0.3 * d + 0.06 * i, l.id * 3 + i, true);
        let last = this.drawn[this.drawn.length - 1];
        last.y = p.y - 0.05;
        // move its trunk up onto the log too
        this.put(this.kinds[kind].trunk, nt[kind] - 1, p.x, last.y, p.z, 0, last.ry, 0, last.sx, last.sy, last.sx, 0xffffff);
      }
    }
    for (let k of GROVE.kinds) this.done(this.kinds[k].trunk, nt[k]);
    this.done(this.stones, ns);
    this.done(this.logs, nl);
    this.done(this.moss, nm);
    this.done(this.ferns, nf);
  }

  // -------------------------------------------------------------------------
  // Butterflies on summer days, over the flowers and the green
  // -------------------------------------------------------------------------
  flyHomes(w) {
    let f = w.fauna,
      key = (f ? f.flowers.reduce((a, fl) => a + fl.patches.length, 0) : 0) + ":" + Math.floor(w.t / 3600);
    if (key === this.flyKey) return this.flySpots;
    this.flyKey = key;
    let spots = [];
    if (f) for (let fl of f.flowers) for (let p of fl.patches) spots.push({ x: p.x, z: p.z, r: p.r + 0.8 });
    // and over green ground at the edge of the wetland
    let c = w.creek && creekCells(w),
      G = w.green;
    if (c && G) {
      let cand = [];
      for (let k = 0; k < CELLS; k += 7) if (G[k] > 0.7 && c.d[k] > 1.5 && c.d[k] < 9 && !(w.wt && w.wt[k] > c.h[k])) cand.push(k);
      // spread along the whole valley
      for (let j = 0, step = Math.max(1, cand.length / 24); j < cand.length; j += step) {
        let k = cand[Math.floor(j)];
        spots.push({ x: (k % VW) + 0.5, z: ((k / VW) | 0) + 0.5, r: 2 });
      }
    }
    this.flySpots = spots;
    return spots;
  }
  updateButterflies(w, clock, night, rain) {
    let s = seasonAt(w),
      act = s.name === "summer" ? 1 : s.name === "spring" ? smoothstep(0.4, 1, s.progress) * 0.7 : s.name === "autumn" ? (1 - smoothstep(0, 0.35, s.progress)) * 0.6 : 0,
      green = w.creek ? w.creek.greenNow || 0 : 0.5,
      k = 0;
    act *= clamp(1 - night * 2.5, 0, 1) * (rain > 0 ? 0 : 1) * (snowLevel(w) > 0 ? 0 : 1);
    if (act > 0.02) {
      let homes = this.flyHomes(w),
        n = Math.min(64, Math.round(64 * act * (0.35 + 0.65 * green)));
      // a few together over each of some of the patches
      for (let i = 0; i < n && homes.length; i++) {
        let hm = homes[Math.floor(hash01(Math.floor(i / 4) * 13 + 5) * homes.length) % homes.length],
          a = 0.35 + 0.3 * hash01(i * 3),
          b = 0.45 + 0.3 * hash01(i * 7),
          ph = hash01(i * 11) * 6.28,
          R = hm.r,
          x = hm.x + Math.sin(clock * a + ph) * R + Math.sin(clock * 2.3 + i) * 0.15,
          zz = hm.z + Math.cos(clock * b + ph * 1.3) * R,
          vx = Math.cos(clock * a + ph) * a,
          vz = -Math.sin(clock * b + ph * 1.3) * b,
          y = this.h(x, zz) + 0.7 + 0.3 * Math.sin(clock * 1.7 + i) + 0.1 * Math.sin(clock * 5.1 + i * 2),
          flap = 0.25 + 0.9 * Math.abs(Math.sin(clock * 16 + i * 1.7)),
          head = Math.atan2(-vz, vx),
          col = BUTTERFLY_COLOR[i % BUTTERFLY_COLOR.length];
        if (i === 0) this.flyAt = hm; // (for tools/grove-shots.mjs)
        this.put(this.wingL, k, x, y, zz, flap, head, 0, 1, 1, 1, col, "YXZ");
        this.put(this.wingR, k, x, y, zz, -flap, head, 0, 1, 1, 1, col, "YXZ");
        k++;
      }
    }
    this.done(this.wingL, k);
    this.done(this.wingR, k);
  }

  // -------------------------------------------------------------------------
  // Herons standing in the shallows, once the wetland has grown
  // -------------------------------------------------------------------------
  heronMesh() {
    let grey = 0x8f9aa8,
      dark = 0x4e5866,
      root = new Pe(),
      body = new Et(
        mergeParts([
          part(yt(0.012, 0.012, 0.5, 3), 0x9a8a60, { x: 0.02, y: 0.25, z: 0.045 }),
          part(yt(0.012, 0.012, 0.5, 3), 0x9a8a60, { x: -0.02, y: 0.25, z: -0.045 }),
          part(Bn(0.15, 6, 5), grey, { y: 0.6, sx: 1.7, sz: 0.85, rz: 0.35 }),
          part(lt(0.3, 0.06, 0.2), dark, { x: -0.12, y: 0.66, rz: 0.4 }),
          part(ze(0.06, 0.2, 4), dark, { x: -0.32, y: 0.56, rz: Math.PI / 2 + 0.3 }),
        ]),
        he(),
      ),
      neck = new Pe(),
      neckMesh = new Et(
        mergeParts([
          part(yt(0.028, 0.035, 0.34, 4), 0xd8dce0, { y: 0.17, rz: -0.25 }),
          part(Bn(0.055, 5, 4), 0xe8ecee, { x: 0.05, y: 0.36 }),
          part(lt(0.08, 0.015, 0.02), 0x202428, { x: -0.02, y: 0.39 }),
          part(ze(0.018, 0.17, 4), 0xd8b040, { x: 0.17, y: 0.35, rz: -Math.PI / 2 }),
        ]),
        he(),
      ),
      wings = new Pe(),
      wingL = new Et(mergeParts([part(lt(0.32, 0.02, 0.55), dark, { z: 0.3 })]), he()),
      wingR = new Et(mergeParts([part(lt(0.32, 0.02, 0.55), dark, { z: -0.3 })]), he());
    wings.position.set(0, 0.64, 0);
    wings.add(wingL, wingR);
    neck.position.set(0.18, 0.66, 0);
    neck.add(neckMesh);
    body.castShadow = neckMesh.castShadow = true;
    wings.visible = false;
    root.add(body, neck, wings);
    this.group.add(root);
    return { root, neck, wings, wingL, wingR, x: null, z: null, from: null, t0: 0 };
  }
  heronPlaces(w) {
    let key = Math.floor(w.t / 1800) + ":" + (w.creek ? Math.round((w.creek.wetNow || 0) * 20) : 0);
    if (key === this.heronKey) return this.heronSpots;
    this.heronKey = key;
    let wet = w.creek ? w.creek.wetNow || 0 : 0,
      n = wet < 0.28 ? 0 : wet < 0.45 ? 1 : wet < 0.6 ? 2 : wet < 0.75 ? 3 : 4,
      out = [];
    if (n && w.wt) {
      let c = creekCells(w),
        cand = [];
      for (let k = 0; k < CELLS; k++) {
        if (!c.floor[k]) continue;
        let d = w.wt[k] - c.h[k];
        if (d > 0.03 && d < 0.3) cand.push(k);
      }
      let seed = Math.floor(w.t / 1800);
      cand.sort((a, b) => hash01(a * 1.31 + seed * 7.7) - hash01(b * 1.31 + seed * 7.7));
      for (let k of cand) {
        let x = (k % VW) + 0.5,
          zz = ((k / VW) | 0) + 0.5;
        if (zz < 6 || zz > VL - 6 || out.some((o) => Math.hypot(o.x - x, o.z - zz) < 14)) continue;
        out.push({ x, z: zz, y: w.wt[k], ry: hash01(k * 3.3) * 6.28 });
        if (out.length >= n) break;
      }
    }
    this.heronSpots = out;
    return out;
  }
  updateHerons(w, clock, night) {
    let spots = night > 0.6 ? [] : this.heronPlaces(w);
    while (this.herons.length < spots.length) this.herons.push(this.heronMesh());
    this.herons.forEach((hv, i) => {
      let sp = spots[i];
      hv.root.visible = !!sp;
      if (!sp) {
        hv.x = null;
        return;
      }
      if (hv.x === null) (hv.x = sp.x), (hv.z = sp.z), (hv.y = sp.y), (hv.from = null);
      // a new spot: fly there
      if (hv.tx !== sp.x || hv.tz !== sp.z) {
        if (hv.tx !== undefined) hv.from = { x: hv.x, z: hv.z, y: hv.y, t0: clock };
        hv.tx = sp.x;
        hv.tz = sp.z;
        hv.ty = sp.y;
      }
      let x = sp.x,
        zz = sp.z,
        y = sp.y - 0.12,
        flying = false,
        ry = sp.ry + 0.4 * Math.sin(clock * 0.07 + i);
      if (hv.from) {
        let k = clamp((clock - hv.from.t0) / 9, 0, 1),
          e = k * k * (3 - 2 * k);
        x = hv.from.x + (sp.x - hv.from.x) * e;
        zz = hv.from.z + (sp.z - hv.from.z) * e;
        y = hv.from.y + (sp.y - hv.from.y) * e + Math.sin(k * Math.PI) * 5;
        ry = Math.atan2(-(sp.z - hv.from.z), sp.x - hv.from.x);
        flying = k < 1;
        if (k >= 1) hv.from = null;
      }
      hv.x = x;
      hv.z = zz;
      hv.y = y;
      hv.root.position.set(x, y, zz);
      hv.root.rotation.y = ry;
      hv.wings.visible = flying;
      if (flying) (hv.wingL.rotation.x = Math.sin(clock * 6 + i) * 0.6), (hv.wingR.rotation.x = -hv.wingL.rotation.x);
      // standing: still as a post, now and then a quick strike at a fish
      let cyc = (clock + i * 3.7) % 11,
        strike = cyc > 9.6 ? Math.sin(((cyc - 9.6) / 1.4) * Math.PI) : 0;
      hv.neck.rotation.z = flying ? -0.9 : -1.3 * strike + 0.05 * Math.sin(clock * 0.5 + i);
    });
  }

  // -------------------------------------------------------------------------
  // Mist over wet ground at dawn: more in the wet season, more as the wetland grows
  // -------------------------------------------------------------------------
  updateMist(w, clock, camera) {
    let p = dayPhase(w.t),
      dawn = smoothstep(0.12, 0.19, p) * (1 - smoothstep(0.27, 0.37, p)),
      s = seasonAt(w),
      wet = w.creek ? w.creek.wetNow || 0 : 0,
      amount = dawn * (0.35 + 0.65 * s.wet) * (0.2 + 0.8 * Math.min(1, wet / 0.6)) * (w.weather.rain > 1 ? 0.4 : 1);
    if (amount < 0.02 || !camera || !w.wet) {
      this.mist.visible = false;
      return;
    }
    this.mist.visible = true;
    let key = Math.floor(w.t / 3600) + ":" + Math.round(wet * 30);
    if (key !== this.mistKey) {
      this.mistKey = key;
      let c = creekCells(w),
        cand = [];
      for (let k = 0; k < CELLS; k++) if (c.floor[k] && (w.wet[k] > 0.35 || (w.wt && w.wt[k] > c.h[k])) && hash01(k * 0.731) < 0.3) cand.push(k);
      // spread along the whole floor: every so many, up to what the mesh holds
      let step = Math.max(1, cand.length / 160),
        spots = [];
      for (let j = 0; j < cand.length && spots.length < 160; j += step) {
        let k = cand[Math.floor(j)];
        spots.push({ x: (k % VW) + hash01(k * 3.1), z: ((k / VW) | 0) + hash01(k * 5.3), y: Math.max(c.h[k], w.wt ? w.wt[k] : 0), s: 0.7 + 0.6 * hash01(k * 1.7), ph: hash01(k * 2.9) * 6.28 });
      }
      this.mistSpots = spots;
    }
    let n = 0,
      q = camera.quaternion;
    for (let m of this.mistSpots) {
      let dx = Math.sin(clock * 0.05 + m.ph) * 1.2;
      this.v.set(m.x + dx, m.y + 0.45 + 0.15 * Math.sin(clock * 0.11 + m.ph), m.z);
      this.sc.set(6.5 * m.s, 2.6 * m.s, 1);
      this.m4.compose(this.v, q, this.sc);
      this.mist.setMatrixAt(n++, this.m4);
    }
    this.done(this.mist, n);
    // in the low sun the mist glows a little warm
    this.mistMat.opacity = 0.42 * amount;
    this.mistMat.color.set(0xf4f6f8).lerp(this.col2.set(0xffe8d0), 0.5 * (1 - smoothstep(0.2, 0.3, p)));
  }
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
(function () {
  // the memorial trees are drawn by LifeView, all together
  let makeView = ResourceView.prototype.makeView,
    sig = ResourceView.prototype.sig;
  ResourceView.prototype.makeView = function (t) {
    if (t.kind === "grove") return { obj: new Pe(), crown: null, phase: 0 };
    return makeView.call(this, t);
  };
  ResourceView.prototype.sig = function (t) {
    return t.kind === "grove" ? "grove" : sig.call(this, t);
  };
  // LifeView comes and goes with BeliefView
  let update = BeliefView.prototype.update,
    dispose = BeliefView.prototype.dispose,
    goats = BeliefView.prototype.updateGoats;
  BeliefView.prototype.update = function (clock, night, rain, dl, camera, focus) {
    update.call(this, clock, night, rain, dl, camera, focus);
    if (!this.life) {
      this.life = new LifeView(this.world, this.scene);
      if (window.__creek) window.__creek.life = this.life; // for tools/grove-shots.mjs
    }
    this.life.update(clock, night, rain, dl, camera, focus);
  };
  BeliefView.prototype.dispose = function () {
    if (this.life) this.life.dispose();
    dispose.call(this);
  };
  // kids are small, and skip about
  BeliefView.prototype.updateGoats = function (w, f, clock) {
    goats.call(this, w, f, clock);
    for (let g of (f && f.goats) || []) {
      let v = this.goats.get(g.id);
      if (!v) continue;
      let age = (w.t - (g.born || 0)) / DAY_S,
        kid = g.mom && age < GOATS.kidDays,
        k = kid ? 0.45 + 0.55 * smoothstep(0, GOATS.kidDays, age) : 1;
      if (Math.abs(v.obj.scale.x - k) > 1e-3) v.obj.scale.setScalar(k);
      if (kid) v.mesh.position.y += Math.max(0, Math.sin(clock * 5 + g.id * 1.7)) * 0.07;
    }
  };
})();

// The panel for someone who has passed: which tree grows for them, or that it fell.
(function () {
  let gone = goneHTML;
  goneHTML = function (hud, w, id) {
    let html = gone(hud, w, id),
      r = w.lineage && w.lineage[id];
    if (!r || r.how === "downstream" || r.tree == null) return html;
    let t = w.byId[r.tree],
      kind = GROVE_WORDS[(t && t.tk) || r.tk || "oak"] || GROVE_WORDS.oak,
      size = t && t.kind === "grove" ? groveSize(w, t) : 0,
      lying = w.grove && (w.grove.logs || []).some((l) => l.id === r.tree),
      line =
        t && t.kind === "grove"
          ? `${size > 3 ? "A great" : size > 1.6 ? "A tall" : size > 0.8 ? "A young" : "A little"} ${kind[0]} grows for them in the grove.`
          : lying
            ? `Their ${kind[0]} in the grove has fallen; moss, ferns and young trees grow on it now.`
            : `Their ${kind[0]} in the grove fell long ago and has gone back to the soil; young trees grow where it stood.`;
    return html.replace("A tree grows for them in the grove.", escapeHtml(line));
  };
})();

// The village panel's Land tab: the grove and the goats, in plain words.
function groveCap(s) {
  return s[0].toUpperCase() + s.slice(1);
}
function groveLandHTML(w) {
  let trees = w.res.filter((r) => r.kind === "grove"),
    g = w.grove,
    h = "";
  if (trees.length) {
    let pv = trees.some((t) => !t.tk) ? groveKindsPreview(w) : null,
      kindOf = (t) => t.tk || (pv && pv.get(t.id)) || "oak",
      count = {};
    for (let t of trees) count[kindOf(t)] = (count[kindOf(t)] || 0) + 1;
    let ks = Object.keys(count).sort((a, b) => count[b] - count[a]),
      share = (k) => count[k] / trees.length,
      words = ks.map((k, i) => (i === 0 && share(k) > 0.45 ? `mostly ${GROVE_WORDS[k][1]}` : share(k) < 0.12 ? `a few ${GROVE_WORDS[k][1]}` : GROVE_WORDS[k][1])),
      list = words.length > 1 ? words.slice(0, -1).join(", ") + " and " + words[words.length - 1] : words[0],
      oldest = trees.reduce((a, t) => (t.planted < a.planted ? t : a), trees[0]),
      first5 = g && (g.founders || []).includes(oldest.who),
      size = groveSize(w, oldest),
      logs = (g && g.logs) || [];
    h += `<h4>The memorial grove</h4><p>${trees.length < 20 ? `${groveCap(numberWords(trees.length))} ${trees.length === 1 ? "tree stands" : "trees stand"}` : `About ${numberWords(Math.round(trees.length / 10) * 10)} trees stand`} in the grove, one for each creekfolk who passed on in the last months: ${escapeHtml(list)}. A tree takes after a parent's tree, or what they loved, and is planted near the family's, so families grow together.</p>`;
    h += `<p class="muted">The oldest is the ${size > 3 ? "great" : size > 1.6 ? "tall" : "young"} ${GROVE_WORDS[kindOf(oldest)][0]} planted for ${escapeHtml(oldest.name)}${first5 ? ", one of the first five" : ""}.`;
    if (logs.length) h += ` ${logs.length === 1 ? "One old tree lies fallen" : `${groveCap(numberWords(logs.length))} old trees lie fallen`} among the others, with moss, ferns and young trees growing on ${logs.length === 1 ? "it" : "them"}.`;
    h += `</p>`;
  }
  let f = w.fauna;
  if (f && f.goats && f.goats.length) {
    let kids = f.goats.filter((k) => k.mom && (w.t - k.born) / DAY_S < GOATS.kidDays),
      homes = Object.keys(f.blankets || {}).length;
    h += `<h4>The goats</h4><p>${f.goats.length === 1 ? "One goat grazes" : `${groveCap(numberWords(f.goats.length))} goats graze`} in the pasture${kids.length ? `, among them ${kids.length === 1 ? `a kid, ${escapeHtml(kids[0].name)}, who follows its mother everywhere` : `${numberWords(kids.length)} kids who follow their mothers everywhere`}` : ""}. The creekfolk brush them for company, and for their wool.</p>`;
    if (homes) h += `<p class="muted">The wool has been spun and woven into warm blankets for ${homes === 1 ? "one home" : numberWords(homes) + " homes"}. Winter nights are easier there.</p>`;
  }
  return h;
}
(function () {
  let land = villageLandHTML;
  villageLandHTML = function (w) {
    return land(w) + groveLandHTML(w);
  };
})();
