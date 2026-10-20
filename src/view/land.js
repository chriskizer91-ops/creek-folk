// ==========================================================================
// The land and its water, drawn from the creek model (Phase 3A).
//
// Replaces the original GroundView and WaterView. The ground's heights come from
// world.terrain (rebuilt from the creek model after every flood); its colours from
// what each cell is (creek bed, cut bank, valley floor, terrace, hills) crossed with
// how green it is (world.green), how marshy (world.wet) and how worn (world.wear).
// The creek is a ribbon whose width and height come from each node's water level, so
// it shrinks, stops and dries in the dry season; ponds are flat water at their level;
// water on the valley floor is one mesh over the cells where the water table stands
// above the ground, so its edges follow the floor's hollows and side channels.
// ==========================================================================

var LAND_SNOW = new wt(0.93, 0.95, 0.98);
var LAND = {
  straw: new wt(0xb8a466),
  dust: new wt(0x9a8058),
  cut: new wt(0x80603f),
  cut2: new wt(0x6a4d33),
  bedWet: new wt(0x5a5044),
  bedDry: new wt(0xa39276),
  marsh1: new wt(6465610),
  marsh2a: new wt(7314766),
  marsh2b: new wt(8362576),
  marsh3a: new wt(6261338),
  marsh3b: new wt(7241548),
  path: new wt(PALETTE.dirt),
  path2: new wt(PALETTE.dirt2),
  pathWet: new wt(7232060),
};
var LAND_KIND = { bed: 1, cut: 2, floor: 3, terrace: 4, hill: 5, rock: 6, out: 7 };

GroundView = class {
  constructor(t, e) {
    this.world = t;
    this.scene = e;
    this.group = new Pe();
    e.add(this.group);
    this.PAD = 18;
    this.GW = VW + 2 * this.PAD;
    this.GL = VL + 2 * this.PAD;
    this.ver = -1;
    this.lastPaint = -99;
    this.buildGround();
    this.buildDecor();
  }
  dispose() {
    this.group.traverse((t) => {
      t.geometry && t.geometry.dispose();
    });
    this.scene.remove(this.group);
  }
  // height of a vertex in the padded grid (vx, vz in valley coordinates). Inside the
  // creek's trench the grid is pushed well down: the trench is drawn by its own smooth
  // mesh (syncChannel), and the grid's coarse triangles must stay under it.
  vh(vx, vz) {
    let T = this.world.terrain;
    if (vx >= 0 && vz >= 0 && vx <= VW && vz <= VL) {
      let k = vz * (VW + 1) + vx;
      return T.h[k] - (T.cut[k] > 0.02 ? 0.6 : 0);
    }
    let h = T.heightRaw(vx, vz);
    return T.uncarvedAt(vx, vz) - h > 0.02 ? h - 0.6 : h;
  }
  buildGround() {
    let n = this.GW * this.GL;
    this.pos = new Float32Array(n * 18);
    this.col = new Float32Array(n * 18);
    this.kind = new Uint8Array(n);
    this.base = new Float32Array(n * 3);
    let g = new ye();
    g.setAttribute("position", new Le(this.pos, 3));
    g.setAttribute("color", new Le(this.col, 3));
    this.groundGeo = g;
    this.fillPositions();
    let m = new Et(g, new Qe({ vertexColors: !0, flatShading: !0 }));
    m.receiveShadow = !0;
    this.ground = m;
    this.group.add(m);
    this.paint(0, true);
    this.syncChannel();
  }
  // heights for every vertex, then the triangles (the same split as the original)
  fillPositions() {
    let P = this.PAD,
      VWp = this.GW + 1,
      VLp = this.GL + 1,
      H = this.vhs || (this.vhs = new Float32Array(VWp * VLp)),
      p = this.pos,
      l = 0;
    for (let vz = 0; vz < VLp; vz++) for (let vx = 0; vx < VWp; vx++) H[vz * VWp + vx] = this.vh(vx - P, vz - P);
    for (let d = 0; d < this.GL; d++)
      for (let u = 0; u < this.GW; u++) {
        let f = u - P,
          q = d - P,
          a = H[d * VWp + u],
          b = H[d * VWp + u + 1],
          c = H[(d + 1) * VWp + u],
          e = H[(d + 1) * VWp + u + 1];
        p[l++] = f, p[l++] = a, p[l++] = q;
        p[l++] = f, p[l++] = c, p[l++] = q + 1;
        p[l++] = f + 1, p[l++] = b, p[l++] = q;
        p[l++] = f + 1, p[l++] = b, p[l++] = q;
        p[l++] = f, p[l++] = c, p[l++] = q + 1;
        p[l++] = f + 1, p[l++] = e, p[l++] = q + 1;
      }
    this.groundGeo.attributes.position.needsUpdate = !0;
    this.groundGeo.computeVertexNormals();
    this.groundGeo.computeBoundingSphere();
    this.classify();
    this.ver = this.world.terrain.version;
  }
  // what each cell is, and its base colour
  classify() {
    let w = this.world,
      T = w.terrain,
      cr = w.creek,
      P = this.PAD,
      VWp = this.GW + 1,
      H = this.vhs,
      tmp = new wt();
    for (let d = 0; d < this.GL; d++)
      for (let u = 0; u < this.GW; u++) {
        let k = d * this.GW + u,
          x = u - P + 0.5,
          z = d - P + 0.5,
          a = H[d * VWp + u],
          b = H[d * VWp + u + 1],
          c = H[(d + 1) * VWp + u],
          e = H[(d + 1) * VWp + u + 1],
          lo = Math.min(a, b, c, e),
          hi = Math.max(a, b, c, e),
          slope = hi - lo,
          h01 = hash01(u * 131 + d * 17),
          nz = T.noise.get(x * 0.35, z * 0.35),
          kind,
          o = Math.abs(x - T.creekX(z)),
          node = cr ? cr.nodes[creekNodeIndex(z)] : null,
          half = node ? 0.5 * creekTopWidth(node) : 1.2,
          r = T.valleyR(x, z);
        if (o < half && z > CREEK.z0 && z < CREEK.z1) kind = node && o < node.wb / 2 + 0.25 ? LAND_KIND.bed : creekTrench(node) > 0.35 ? LAND_KIND.cut : LAND_KIND.floor;
        else if (x < 0 || z < 0 || x > VW || z > VL) kind = r > 0.92 && slope > 1.6 ? LAND_KIND.rock : LAND_KIND.out;
        else if (r > 0.88 && slope > 1.3) kind = LAND_KIND.rock;
        else if (r > 0.9) kind = LAND_KIND.hill;
        else if (T.floorWeight(x, z) > 0.5) kind = LAND_KIND.floor;
        else kind = LAND_KIND.terrace;
        this.kind[k] = kind;
        switch (kind) {
          case LAND_KIND.bed:
            tmp.copy(LAND.bedDry);
            break;
          case LAND_KIND.cut:
            tmp.copy(h01 > 0.5 ? LAND.cut : LAND.cut2).multiplyScalar(0.92 + nz * 0.15);
            break;
          case LAND_KIND.rock:
            tmp.copy(Be(h01 > 0.5 ? PALETTE.rock : PALETTE.rock2)).multiplyScalar(0.9 + nz * 0.2);
            break;
          case LAND_KIND.hill:
          case LAND_KIND.out:
            tmp.copy(Be(nz > 0.5 ? PALETTE.hill : PALETTE.hill2)).multiplyScalar(0.92 + h01 * 0.12);
            break;
          default: {
            let f = T.noise.fbm(x * 0.06 + 20, z * 0.06, 2);
            tmp.copy(Be(PALETTE.grass2)).lerp(Be(PALETTE.meadow), clamp((f - 0.3) * 2.2, 0, 1)).multiplyScalar(0.97 + h01 * 0.04);
            if (kind === LAND_KIND.floor) tmp.lerp(Be(PALETTE.grass3), 0.25);
          }
        }
        this.base[k * 3] = tmp.r;
        this.base[k * 3 + 1] = tmp.g;
        this.base[k * 3 + 2] = tmp.b;
      }
  }
  // per-vertex green, marsh and wear (averaged over the cells around each vertex)
  cornerFields() {
    let w = this.world,
      n = (VW + 1) * (VL + 1),
      cg = this.cg || (this.cg = new Float32Array(n)),
      cq = this.cq || (this.cq = new Float32Array(n)),
      cw = this.cw || (this.cw = new Float32Array(n)),
      G = w.green,
      Q = w.wet,
      Wr = w.wear;
    for (let vz = 0; vz <= VL; vz++)
      for (let vx = 0; vx <= VW; vx++) {
        let sg = 0,
          sq = 0,
          sw = 0,
          c = 0;
        for (let dz = -1; dz <= 0; dz++)
          for (let dx = -1; dx <= 0; dx++) {
            let x = vx + dx,
              z = vz + dz;
            if (x < 0 || z < 0 || x >= VW || z >= VL) continue;
            let k = z * VW + x;
            sg += G ? G[k] : 1;
            sq += Q ? Q[k] : 0;
            sw += Wr ? Wr[k] : 0;
            c++;
          }
        let v = vz * (VW + 1) + vx;
        cg[v] = c ? sg / c : 1;
        cq[v] = c ? sq / c : 0;
        let o = c ? sw / c : 0,
          a = clamp((o - 6) / 30, 0, 1);
        cw[v] = a * a * (3 - 2 * a) * 0.92;
      }
  }
  paint(t, force) {
    let w = this.world,
      cr = w.creek,
      soil = cr ? cr.soil : 1,
      P = this.PAD,
      col = this.col,
      g = new wt(),
      cg = null,
      cq = null,
      cw = null,
      wt0 = w.wt,
      cells = cr ? creekCells(w) : null,
      cutA = w.terrain.cut;
    this.cornerFields();
    cg = this.cg;
    cq = this.cq;
    cw = this.cw;
    let ss = (a, b, x) => {
      let y = clamp((x - a) / (b - a), 0, 1);
      return y * y * (3 - 2 * y);
    };
    let corners = [[0, 0], [0, 1], [1, 0], [1, 0], [0, 1], [1, 1]],
      snow = snowLevel(w); // BELIEF: a snow day (belief-view.js)
    for (let d = 0; d < this.GL; d++)
      for (let u = 0; u < this.GW; u++) {
        let k = d * this.GW + u,
          kind = this.kind[k],
          x0 = u - P,
          z0 = d - P,
          inside = x0 >= 0 && z0 >= 0 && x0 < VW && z0 < VL,
          br = this.base[k * 3],
          bg = this.base[k * 3 + 1],
          bb = this.base[k * 3 + 2],
          ck = inside ? z0 * VW + x0 : -1,
          wetBed = kind === LAND_KIND.bed && inside && wt0 && cells && wt0[ck] > cells.h[ck] - 0.12;
        for (let M = 0; M < 6; M++) {
          let [ox, oz] = corners[M],
            vx = x0 + ox,
            vz = z0 + oz,
            vin = vx >= 0 && vz >= 0 && vx <= VW && vz <= VL,
            v = vin ? vz * (VW + 1) + vx : -1,
            G = vin ? cg[v] : kind === LAND_KIND.out || kind === LAND_KIND.hill ? 0.35 + 0.65 * soil : soil,
            R = vin ? cq[v] : 0,
            E = vin ? cw[v] : 0,
            cut = vin ? cutA[v] : 0;
          g.setRGB(br, bg, bb);
          if (kind !== LAND_KIND.rock) {
            // dry season: green fades to straw, then to dusty brown
            let dry = 1 - G;
            if (dry > 0.02) g.lerp(LAND.straw, ss(0.05, 0.9, dry) * 0.85);
            if (dry > 0.6) g.lerp(LAND.dust, (dry - 0.6) * 0.75);
          }
          if (cut > 0.06) {
            // the creek's trench: bare cut banks, and its bed at the bottom
            let deep = vin && cr ? creekAt(cr, vz, "fp") - creekAt(cr, vz, "bed") : 1,
              atBed = ss(deep - 0.12, deep - 0.02, cut);
            g.lerp(hash01(k) < 0.5 ? LAND.cut : LAND.cut2, ss(0.06, 0.3, cut) * (1 - 0.55 * G * ss(0.5, 0.2, deep)));
            if (atBed > 0) g.lerp(wetBed || R > 0.3 ? LAND.bedWet : LAND.bedDry, atBed);
          }
          if (R > 0.1) {
            let B = hash01(k * 7 + 3) < 0.5;
            g.lerp(LAND.marsh1, ss(0.1, 0.4, R) * 0.7);
            R > 0.4 && g.lerp(B ? LAND.marsh2a : LAND.marsh2b, ss(0.4, 0.7, R) * 0.8);
            R > 0.7 && g.lerp(B ? LAND.marsh3a : LAND.marsh3b, ss(0.7, 1, R) * 0.6);
          }
          if (E > 0) g.lerp(R > 0.45 ? LAND.pathWet : E > 0.6 ? LAND.path2 : LAND.path, E);
          if (snow > 0 && !(R > 0.6) && !(cut > 0.06 && kind === LAND_KIND.bed)) g.lerp(LAND_SNOW, snow * (0.78 + 0.18 * hash01(k * 3 + M)));
          if (this.overlay && vin) this.overlayColor(g, this.overlay, vx, vz, G, R, E);
          let s = M < 3 ? 1 : 0.97,
            N = (k * 6 + M) * 3;
          col[N] = g.r * s;
          col[N + 1] = g.g * s;
          col[N + 2] = g.b * s;
        }
      }
    this.groundGeo.attributes.color.needsUpdate = !0;
    // the grass tufts dry with the land
    if (this.tuftMat) {
      let dry = 1 - (cr ? 0.5 * cr.greenNow + 0.5 * soil : 1);
      this.tuftMat.color.setRGB(1 + 0.45 * dry + 1.2 * snow, 1 + 0.12 * dry + 1.4 * snow, 1 - 0.45 * dry + 1.7 * snow);
    }
  }
  buildDecor() {
    let t = this.world.terrain,
      e = [],
      tufts = [],
      n = [PALETTE.flower1, PALETTE.flower2, PALETTE.flower3, PALETTE.flower4],
      s = 1;
    for (let a = 0; a < 2700; a++) {
      let l = hash01(s++) * VW,
        c = hash01(s++) * VL;
      if (!t.walkable(l, c) || t.edgeDist(l, c) < 0.8) continue;
      let h = t.heightAt(l, c),
        d = hash01(s++);
      d < 0.75 ?
      tufts.push(
        part(ze(0.06, 0.22, 3), d < 0.4 ? PALETTE.grass3 : PALETTE.grass2, {
          x: l,
          y: h + 0.09,
          z: c,
          ry: d * 6
        })
      ) :
      e.push(
        part(qt(0.05, 0), n[Math.floor(hash01(s++) * 4)], {
          x: l,
          y: h + 0.06,
          z: c
        })
      );
    }
    // trees on the hills around the valley
    for (let a = 0; a < 2600; a++) {
      let l = hash01(s++) * (VW + 36) - 18,
        c = hash01(s++) * (VL + 36) - 18,
        h = t.valleyR(l, c);
      if (h < 0.93 || h > 1.6 || Math.abs(l - t.creekX(c)) < 4) continue;
      let d = l < 0 || c < 0 || l > VW || c > VL ? t.heightRaw(l, c) : t.heightAt(l, c),
        u = 0.8 + hash01(s++) * 0.7,
        f = hash01(s++);
      f < 0.7 ?
      (e.push(part(yt(0.08, 0.1, 0.5, 4), PALETTE.trunk, { x: l, y: d + 0.25 * u, z: c, sx: u, sy: u, sz: u })),
      e.push(part(ze(0.55, 1.3, 5), f < 0.35 ? PALETTE.pine : PALETTE.leaf3, { x: l, y: d + 1.15 * u, z: c, sx: u, sy: u, sz: u, ry: f * 9 }))) :
      (e.push(part(yt(0.08, 0.1, 0.6, 4), PALETTE.trunk, { x: l, y: d + 0.3 * u, z: c, sx: u, sy: u, sz: u })),
      e.push(part(qt(0.6, 0), f < 0.85 ? PALETTE.leaf : PALETTE.hill, { x: l, y: d + 0.95 * u, z: c, sx: u, sy: u * 0.9, sz: u })));
    }
    this.decorVer = t.version;
    let r = mergeParts(e);
    if (r) {
      let o = new Et(r, he());
      o.receiveShadow = !0;
      this.decor = o;
      this.group.add(o);
    }
    let tg = mergeParts(tufts);
    if (tg) {
      this.tuftMat = this.tuftMat || new Qe({ vertexColors: !0, flatShading: !0 });
      let o = new Et(tg, this.tuftMat);
      o.receiveShadow = !0;
      this.tufts = o;
      this.group.add(o);
    }
  }
  // the developer menu's overlays: wetness, worn paths, the creek's stage, land capacity
  overlayColor(g, kind, vx, vz, G, R, E) {
    let grey = 0.3 * g.r + 0.5 * g.g + 0.2 * g.b,
      c = LAND.ovTmp || (LAND.ovTmp = new wt()),
      a = 0.8;
    if (kind === "wet") c.setRGB(0.15, 0.25 + 0.35 * R, 0.3 + 0.7 * R);
    else if (kind === "wear") c.setRGB(0.25 + 0.75 * clamp(E * 1.3, 0, 1), 0.2, 0.2);
    else if (kind === "stage") {
      if (this.world.terrain.floorWeight(vx, vz) < 0.3 && Math.abs(vx - this.world.terrain.creekX(vz)) > 4) return;
      let st = creekStageAt(this.world, vz);
      c.set({ 0: 0x2d6cdf, I: 0x2bb3a8, II: 0xd9453b, III: 0xf08a24, IV: 0xe8c33a, V: 0x4fae4a }[st] || 0x888888);
      a = 0.65;
    } else if (kind === "feed") {
      let f = clamp(0.55 * G + 0.45 * R, 0, 1);
      c.setRGB(0.55 - 0.4 * f, 0.3 + 0.55 * f, 0.15);
    } else return;
    g.setRGB(grey, grey, grey).lerp(c, a);
  }
  // the creek has changed shape: new heights; the small decor is set down on them again
  refreshDecor() {
    for (let m of [this.decor, this.tufts]) if (m) this.group.remove(m), m.geometry.dispose();
    this.decor = this.tufts = null;
    this.buildDecor();
  }
  // The creek's trench as its own mesh along the centre line, so its banks are smooth
  // curves instead of the ground grid's steps. Its outer lip lies just over the ground.
  syncChannel() {
    let w = this.world,
      T = w.terrain,
      cr = w.creek;
    if (!cr) return;
    let ns = cr.nodes,
      pos = [],
      col = [],
      idx = [],
      tmp = new wt(),
      tmp2 = new wt(),
      P = this.PAD,
      prev = -1,
      cols = 0,
      ground = (x, z) => {
        // the ground's own colour at the nearest grid corner
        let u = clamp(Math.round(x) + P, 0, this.GW - 1),
          d = clamp(Math.round(z) + P, 0, this.GL - 1),
          N = (d * this.GW + u) * 18;
        return tmp.setRGB(this.col[N], this.col[N + 1], this.col[N + 2]);
      };
    for (let z = -16; z <= VL + 16; z += 0.5) {
      let f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
        i = Math.floor(f),
        n = f - i < 0.5 ? ns[i] : ns[i + 1],
        cx = T.creekX(z),
        hw = n.wb / 2,
        Ht = Math.max(n.fp - n.bed, 0.05),
        Hz = n.bw > 0.05 ? clamp(n.bz - n.bed, 0, Ht - 0.03) : 0,
        x1 = hw + n.m * Hz,
        x3 = x1 + (Hz > 0 ? n.bw / 2 : 0),
        edge = x3 + n.m * (Ht - Hz),
        offs = Hz > 0 ? [0, hw, x1, x3, edge, edge + 0.6, edge + 1.5] : [0, hw, edge, edge + 0.6, edge + 1.5],
        wetBed = n.wl > n.bed + 0.005,
        row = [];
      for (let side of [-1, 1])
        for (let k = side < 0 ? offs.length - 1 : 1; side < 0 ? k >= 0 : k < offs.length; k += side < 0 ? -1 : 1) row.push([side * offs[k], k, offs.length]);
      cols = row.length;
      let base = pos.length / 3;
      for (let [o, k, L] of row) {
        let x = cx + o,
          up = T.uncarvedAt(x, z),
          lip = k >= L - 2,
          y = lip ? up + 0.03 : Math.min(T.section(z, Math.abs(o)), up + 0.01);
        pos.push(x, y, z);
        if (lip) ground(x, z);
        else {
          // a trench that has filled up looks like the floor around it, not a bed
          let deep = clamp((Ht - 0.25) / 0.35, 0, 1),
            c2 = tmp2.copy(ground(x + Math.sign(o || 1) * (edge - Math.abs(o) + 0.8), z));
          if (Math.abs(o) <= hw + 0.01) tmp.copy(wetBed ? LAND.bedWet : LAND.bedDry);
          else if (k === L - 3) tmp.copy(c2).lerp(LAND.cut, 0.35);
          else tmp.copy(hash01(i * 7 + k) < 0.5 ? LAND.cut : LAND.cut2);
          tmp.lerp(c2.multiplyScalar(0.92), 1 - deep);
        }
        col.push(tmp.r, tmp.g, tmp.b);
      }
      if (prev >= 0)
        for (let k = 0; k < cols - 1; k++) {
          let a = prev + k,
            b = base + k;
          idx.push(a, b, a + 1, a + 1, b, b + 1);
        }
      prev = base;
    }
    if (this.channel) this.group.remove(this.channel), this.channel.geometry.dispose();
    let g = new ye();
    g.setAttribute("position", new Zt(pos, 3));
    g.setAttribute("color", new Zt(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    let m = new Et(g.toNonIndexed(), this.chanMat || (this.chanMat = new Qe({ vertexColors: !0, flatShading: !0 })));
    g.dispose();
    m.geometry.computeVertexNormals();
    m.receiveShadow = !0;
    this.channel = m;
    this.group.add(m);
  }
  update() {}
  updateWear(t) {
    let T = this.world.terrain,
      changed = T.version !== this.ver;
    if (changed) this.fillPositions();
    if (changed && t - (this.lastDecor || -99) > 20) (this.lastDecor = t), this.refreshDecor();
    if (!changed && t - this.lastPaint < 2) return;
    this.lastPaint = t;
    this.paint(t);
    // the trench's colours follow the season slowly; its shape follows the creek
    if (changed || t - (this.lastChannel || -99) > 12) (this.lastChannel = t), this.syncChannel();
  }
};

// ---- water ----------------------------------------------------------------

var LAND_WATER_VS = `
attribute float calm; attribute float dep;
varying vec2 vUv; varying vec3 vW; varying float vCalm; varying float vDep;
void main(){ vUv = uv; vCalm = calm; vDep = dep; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`;
var LAND_WATER_FS = `
uniform float uTime, uLight, uRain; uniform vec3 uDeep, uShallow, uFoam, uTint, uPond, uMarsh;
varying vec2 vUv; varying vec3 vW; varying float vCalm; varying float vDep;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
void main(){
  float edge = clamp(min(vUv.x, 1.0 - vUv.x), 0.0, 0.5);
  vec3 run = mix(uShallow, uDeep, smoothstep(0.05, 0.35, edge) * smoothstep(0.03, 0.25, vDep));
  vec3 still = mix(uMarsh, uPond, smoothstep(0.15, 0.85, vDep)); // a hand of water over the floor reads as marsh, not lake
  vec3 c = mix(run, still, vCalm);
  vec2 cell = floor(vec2(vW.x*7.0, vW.z*3.5 - uTime*2.4*(1.0 - 0.9*vCalm)));
  float g = h(cell);
  float glint = step(0.965 - uRain*0.03 + vCalm*0.02, g) * step(0.1, edge + vCalm);
  c = mix(c, uFoam, glint*0.6*(1.0 - 0.5*vCalm));
  c = mix(c, uFoam, (1.0 - smoothstep(0.0, 0.07, edge))*0.45*(1.0 - vCalm));
  vec2 rc = floor(vec2(vW.x*4.0, vW.z*4.0));
  float rr = step(0.985, h(rc + floor(uTime*3.0))) * uRain;
  c = mix(c, uFoam, rr*0.8);
  gl_FragColor = vec4(c * uTint * (0.25 + 0.75*uLight), 1.0);
  #include <colorspace_fragment>
}`;

WaterView = class {
  constructor(t, e) {
    this.world = t;
    this.scene = e;
    this.group = new Pe();
    e.add(this.group);
    this.mat = new Ke({
      uniforms: {
        uTime: { value: 0 },
        uLight: { value: 1 },
        uRain: { value: 0 },
        uDeep: { value: Br(3112872) },
        uShallow: { value: Br(5813460) },
        uFoam: { value: Br(14218495) },
        uTint: { value: Br(16777215) },
        uPond: { value: Br(2911878) },
        uMarsh: { value: Br(0x5b8a68) },
      },
      vertexShader: LAND_WATER_VS,
      fragmentShader: LAND_WATER_FS,
    });
    this.ribbon = null;
    this.sheet = null;
    this.decor = null;
    this.ribbonSig = "";
    this.sheetSig = "";
    this.decorSig = "";
    this.lastCheck = -99;
    this.cells = [];
    this.edgeCells = [];
    this.flyCenters = [];
    let n = (s, r, o) => {
      let a = new Ts(s, r, o);
      return (a.count = 0), (a.frustumCulled = !1), this.group.add(a), a;
    };
    this.frogs = n(yM(), he(), 12);
    this.flies = n(vM(), new je({ vertexColors: !0 }), 8);
    this.bugMat = new je({ color: 15269770 });
    this.bugs = n(new ks(0.075, 4, 3), this.bugMat, 20);
    this.m4 = new se();
    this.q = new mn();
    this.e = new bn();
    this.v = new z();
    this.s = new z();
  }
  dispose() {
    for (let m of [this.ribbon, this.sheet, this.decor]) m && (this.group.remove(m), m.geometry.dispose());
    for (let t of [this.frogs, this.flies, this.bugs]) t.geometry.dispose(), t.dispose();
    this.mat.dispose();
    this.scene.remove(this.group);
  }
  mesh(pos, uv, calm, dep, idx) {
    let b = new ye();
    b.setAttribute("position", new Zt(pos, 3));
    b.setAttribute("uv", new Zt(uv, 2));
    b.setAttribute("calm", new Zt(calm, 1));
    b.setAttribute("dep", new Zt(dep, 1));
    b.setIndex(idx);
    let m = new Et(b, this.mat);
    m.frustumCulled = !1;
    return m;
  }
  // the creek: a ribbon along its centre line, as wide and as high as its water
  syncRibbon() {
    let w = this.world,
      cr = w.creek,
      T = w.terrain,
      ns = cr.nodes,
      own = cr._pondOwner,
      sig = T.version + ":";
    for (let n of ns) sig += Math.round(n.wl * 100) + ",";
    if (sig === this.ribbonSig) return;
    this.ribbonSig = sig;
    if (this.ribbon) this.group.remove(this.ribbon), this.ribbon.geometry.dispose(), (this.ribbon = null);
    let pos = [],
      uv = [],
      calm = [],
      dep = [],
      idx = [],
      A = 4,
      prev = -1;
    for (let z = -18; z <= VL + 18; z += 0.5) {
      let f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
        i = Math.floor(f),
        t = f - i,
        a = ns[i],
        b = ns[i + 1],
        step = Math.abs(a.wl - b.wl) > 0.05, // over a dam the water steps down, it doesn't slope
        wl = step ? (t < 0.5 ? a.wl : b.wl) : a.wl + (b.wl - a.wl) * t,
        bed = a.bed + (b.bed - a.bed) * t,
        y = wl - bed,
        nn = t < 0.5 ? a : b;
      if (y < 0.004) {
        prev = -1;
        continue;
      }
      if (prev >= 0 && Math.abs(wl - this.prevWl) > 0.06) prev = -1; // the water steps down over a dam
      this.prevWl = wl;
      let half = Math.min(0.5 * creekWidthAt(nn, y), 0.5 * creekTopWidth(nn) + 0.1) * 0.94,
        cx = T.creekX(z),
        still = own && own[t < 0.5 ? i : i + 1] >= 0 && cr._pondNow[t < 0.5 ? i : i + 1] > bed ? 1 : 0,
        base = pos.length / 3;
      for (let k = 0; k <= A; k++) {
        let u = k / A;
        pos.push(cx - half + 2 * half * u, wl + 0.003, z);
        uv.push(u, z);
        calm.push(still);
        dep.push(Math.min(1, y / 0.35));
      }
      if (prev >= 0)
        for (let k = 0; k < A; k++) {
          let p = prev + k,
            q = base + k;
          idx.push(p, q, p + 1, p + 1, q, q + 1);
        }
      prev = base;
    }
    if (idx.length) (this.ribbon = this.mesh(pos, uv, calm, dep, idx)), this.group.add(this.ribbon);
  }
  // water standing on the valley floor (ponds over their banks, side channels, marsh pools)
  syncSheet() {
    let w = this.world,
      T = w.terrain,
      W = w.wt,
      c = creekCells(w);
    if (!W) return;
    let draw = this.sheetDraw || (this.sheetDraw = new Uint8Array(CELLS)),
      n = 0,
      hsh = T.version;
    for (let k = 0; k < CELLS; k++) {
      // standing water at least a couple of centimetres deep somewhere in the cell (a wet
      // surface alone is marsh); the ground cuts the water's edge to its own shape
      let on = c.d[k] > 0.15 && W[k] > c.h[k] - 0.05;
      if (on) {
        let x = k % VW,
          z = (k / VW) | 0,
          H = T.h,
          lo = Math.min(H[z * (VW + 1) + x], H[z * (VW + 1) + x + 1], H[(z + 1) * (VW + 1) + x], H[(z + 1) * (VW + 1) + x + 1]);
        on = W[k] > lo + 0.025;
      }
      draw[k] = on ? 1 : 0;
      if (on) (n++), (hsh = (hsh * 31 + k * 7 + Math.round(W[k] * 50)) % 1000003);
    }
    let sig = n + ":" + hsh;
    if (sig === this.sheetSig) return;
    this.sheetSig = sig;
    if (this.sheet) this.group.remove(this.sheet), this.sheet.geometry.dispose(), (this.sheet = null);
    if (!n) return;
    // a vertex takes the mean water level of the drawn cells around it
    let V = (VW + 1) * (VL + 1),
      vs = this.vSum || (this.vSum = new Float32Array(V)),
      vc = this.vCnt || (this.vCnt = new Uint8Array(V)),
      vi = this.vIdx || (this.vIdx = new Int32Array(V));
    vs.fill(0);
    vc.fill(0);
    vi.fill(-1);
    for (let k = 0; k < CELLS; k++) {
      if (!draw[k]) continue;
      let x = k % VW,
        z = (k / VW) | 0;
      for (let dz = 0; dz <= 1; dz++)
        for (let dx = 0; dx <= 1; dx++) {
          let v = (z + dz) * (VW + 1) + x + dx;
          vs[v] += W[k];
          vc[v]++;
        }
    }
    let pos = [],
      uv = [],
      calm = [],
      dep = [],
      idx = [];
    for (let k = 0; k < CELLS; k++) {
      if (!draw[k]) continue;
      let x = k % VW,
        z = (k / VW) | 0,
        ids = [];
      for (let [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
        let v = (z + dz) * (VW + 1) + x + dx;
        if (vi[v] < 0) {
          let y = vs[v] / vc[v];
          vi[v] = pos.length / 3;
          pos.push(x + dx, y + 0.004, z + dz);
          uv.push(0.5, z + dz);
          calm.push(1);
          dep.push(clamp((y - T.h[v]) / 0.3, 0, 1));
        }
        ids.push(vi[v]);
      }
      idx.push(ids[0], ids[2], ids[1], ids[1], ids[2], ids[3]);
    }
    this.sheet = this.mesh(pos, uv, calm, dep, idx);
    this.group.add(this.sheet);
  }
  // reeds, cattails, lily pads and flowers where the ground is marsh
  syncDecor() {
    let t = this.world,
      e = t.terrain,
      n = t.wet,
      c0 = creekCells(t),
      s = 0,
      r = 0;
    for (let c = 0; c < n.length; c++) {
      let h = Math.floor(n[c] * 4);
      h && ((s = (s * 31 + c * 7 + h) % 1000003), r++);
    }
    let o = r + ":" + s + ":" + e.version;
    if (o === this.decorSig) return;
    this.decorSig = o;
    this.decor && (this.group.remove(this.decor), this.decor.geometry.dispose(), (this.decor = null));
    let a = [];
    this.cells = [];
    this.edgeCells = [];
    for (let c = 0; c < n.length; c++) {
      let h = n[c];
      if (h < 0.35 || c0.d[c] <= 0.1) continue;
      let d = c % VW,
        u = Math.floor(c / VW),
        f = c * 13,
        p = d + 0.5,
        x = u + 0.5;
      if (!e.walkable(p, x)) continue;
      let m = e.heightAt(p, x),
        open = t.wt && t.wt[c] > c0.h[c] + 0.02;
      h > 0.5 && (this.cells.push({ x: p, z: x, w: h, y: m }), c0.d[c] < 3 && this.edgeCells.push({ x: p, z: x, y: m }));
      let b = open ? 1 : h > 0.7 ? 3 : h > 0.5 ? 2 : 1;
      for (let T = 0; T < b; T++) {
        let y = d + hash01(f + T),
          S = u + hash01(f + T + 5),
          M = e.heightAt(y, S);
        a.push(part(ze(0.06, 0.26 + hash01(f + T + 2) * 0.12, 3), T % 2 ? 4156978 : 5933630, { x: y, y: M + 0.12, z: S, rz: (hash01(f + T + 9) - 0.5) * 0.4 }));
      }
      if (h > 0.62 && hash01(f + 40) < 0.5) {
        let T = d + hash01(f + 41),
          y = u + hash01(f + 42),
          S = e.heightAt(T, y);
        for (let M = 0; M < 2; M++)
          a.push(part(yt(0.015, 0.02, 0.62, 3), PALETTE.reed, { x: T + M * 0.09, y: S + 0.31, z: y })),
          a.push(part(yt(0.035, 0.035, 0.15, 4), PALETTE.cattail, { x: T + M * 0.09, y: S + 0.6 + M * 0.04, z: y }));
      }
      if (open && hash01(f + 60) < 0.3) {
        let T = d + 0.2 + hash01(f + 61) * 0.6,
          y = u + 0.2 + hash01(f + 62) * 0.6,
          S = t.wt[c] + 0.012,
          M = hash01(f + 63) * 3;
        a.push(part(lt(0.34, 0.012, 0.22), 6131608, { x: T, y: S, z: y, ry: M }));
        a.push(part(lt(0.2, 0.012, 0.3), 6131608, { x: T + 0.08, y: S, z: y + 0.05, ry: M + 0.6 }));
        hash01(f + 64) < 0.35 && a.push(part(qt(0.05, 0), hash01(f + 65) < 0.5 ? 16228804 : 16775404, { x: T + 0.03, y: S + 0.04, z: y }));
      }
      if (!open && h > 0.5 && h < 0.8 && hash01(f + 80) < 0.12) {
        let T = d + hash01(f + 81),
          y = u + hash01(f + 82);
        a.push(part(qt(0.05, 0), hash01(f + 83) < 0.5 ? 14272767 : 16774048, { x: T, y: e.heightAt(T, y) + 0.2, z: y }));
      }
    }
    let l = mergeParts(a);
    l && ((this.decor = new Et(l, he())), (this.decor.receiveShadow = !0), this.group.add(this.decor));
    // dragonflies hunt over the ponds
    this.flyCenters = [];
    let cr = t.creek;
    for (let id in cr.dams) {
      let d = cr.dams[id],
        nd = cr.nodes[d.i];
      if (d.pl > nd.bed + 0.12) this.flyCenters.push({ x: e.creekX(nd.z - 4), z: nd.z - 4, y: d.pl, r: 2.5 });
    }
  }
  setInst(t, e, n, s, r, o, a, l = 0) {
    this.e.set(l, o, 0);
    this.q.setFromEuler(this.e);
    this.v.set(n, s, r);
    this.s.set(a, a, a);
    this.m4.compose(this.v, this.q, this.s);
    t.setMatrixAt(e, this.m4);
  }
  update(t, e, n, s, r) {
    let o = this.mat.uniforms;
    o.uTime.value = t;
    o.uLight.value = e;
    o.uRain.value = n;
    o.uTint.value.copy(s);
    if (t - this.lastCheck > 1) {
      this.lastCheck = t;
      this.syncRibbon();
      this.syncSheet();
      if (!this.lastDecor || t - this.lastDecor > 4) (this.lastDecor = t), this.syncDecor();
    }
    let a = this.world.hydro || {},
      l = a.frogs ? Math.min(12, Math.floor((a.marsh || 0) / 7), this.edgeCells.length) : 0;
    for (let u = 0; u < l; u++) {
      let f = this.edgeCells[Math.floor(hash01(u * 97 + 5) * this.edgeCells.length)],
        p = (t * (0.06 + hash01(u) * 0.05) + hash01(u + 3)) % 1,
        x = p < 0.05 ? Math.sin((p / 0.05) * Math.PI) : 0,
        g = hash01(u * 7) * 6.28 + Math.floor(t * 0.06 + hash01(u + 3)) * 1.7,
        m = Math.cos(g) * 0.3 * (hash01(u + 11) - 0.5),
        b = Math.sin(g) * 0.3 * (hash01(u + 13) - 0.5);
      this.setInst(this.frogs, u, f.x + m + (hash01(u + 1) - 0.5) * 0.6, f.y + 0.01 + x * 0.22, f.z + b + (hash01(u + 2) - 0.5) * 0.6, g, 1);
    }
    this.frogs.count = l;
    this.frogs.instanceMatrix.needsUpdate = !0;
    let c = 1 - r,
      h = a.flies && c > 0.5 && n < 0.5 && this.flyCenters.length ? Math.min(8, 2 + Math.floor((a.marsh || 0) / 12)) : 0;
    for (let u = 0; u < h; u++) {
      let f = this.flyCenters[u % this.flyCenters.length],
        p = t * (0.5 + hash01(u + 20) * 0.4) + hash01(u + 21) * 20,
        x = Math.sin(p * 2.7) > 0.6 ? 1.6 : 1,
        g = f.x + Math.sin(p * 1.3 * x) * f.r * 0.6 + Math.sin(p * 3.1) * 0.25,
        m = f.z + Math.cos(p * 0.9 * x) * f.r + Math.cos(p * 2.3) * 0.2,
        b = f.y + 0.45 + Math.sin(p * 1.7) * 0.18,
        T = Math.cos(p * 1.3 * x),
        y = -Math.sin(p * 0.9 * x);
      this.setInst(this.flies, u, g, b, m, Math.atan2(T, y), 1.1);
    }
    this.flies.count = h;
    this.flies.instanceMatrix.needsUpdate = !0;
    let d = r > 0.55 && n < 0.3 && this.cells.length ? Math.min(20, Math.floor(this.cells.length / 5)) : 0;
    for (let u = 0; u < d; u++) {
      let f = this.cells[Math.floor(hash01(u * 53 + 1) * this.cells.length)],
        p = t * 0.35 + hash01(u + 40) * 30,
        x = 0.5 + 0.5 * Math.sin(t * (1.5 + hash01(u + 41) * 2) + hash01(u + 42) * 6);
      this.setInst(this.bugs, u, f.x + Math.sin(p) * 0.8, f.y + 0.4 + Math.sin(p * 1.7) * 0.25 + hash01(u) * 0.4, f.z + Math.cos(p * 0.8) * 0.8, 0, 0.5 + x * 0.8);
    }
    this.bugs.count = d;
    this.bugs.instanceMatrix.needsUpdate = !0;
    this.bugMat.color.setRGB(1, 1, 0.5);
  }
};

// Water helpers for the creatures and structures views.
function creekWaterLevelAt(w, z) {
  let cr = w.creek;
  return cr ? creekAt(cr, z, "wl") : WATER_LEVEL;
}
function creekBedAt(w, z) {
  let cr = w.creek;
  return cr ? creekAt(cr, z, "bed") : WATER_LEVEL - 0.3;
}
function creekFloorAt(w, z) {
  let cr = w.creek;
  return cr ? creekAt(cr, z, "fp") : WATER_LEVEL + 0.65;
}
function creekDamCrest(w, s) {
  let d = w.creek && w.creek.dams[s.id];
  return d ? d.crest : creekBedAt(w, s.z) + 0.3;
}

// ---- the village panel's Land tab ------------------------------------------

function villageLandHTML(w) {
  let cr = w.creek,
    s = seasonAt(w),
    parts = capacityParts(w),
    pop = w.creatures.filter((c) => !c.visitor).length,
    dr = cr.driest.slice(-6),
    inV = cr.nodes.filter((n) => n.z >= 0 && n.z <= VL),
    st = {};
  for (let n of inV) st[n.stage] = (st[n.stage] || 0) + 1;
  let healed = ((st["0"] || 0) + (st.V || 0) + (st.I || 0)) / inV.length,
    filling = (st.IV || 0) / inV.length,
    dams = w.structures.filter((x) => x.kind === "dam" && x.level > 0),
    held = dams.filter((x) => !x.leaks).length,
    flowing = cr.flowLen,
    h = "";
  h += `<h4>What the land can feed</h4><p>The valley can feed about <b>${parts.feed}</b> creekfolk${parts.shelter < parts.feed ? `, though there is only shelter for ${parts.shelter}` : ""}. ${pop} live here now.</p>`;
  h += `<p class="muted">A cut-down creek that dries out every summer feeds about twenty. As it heals, and stays wet through the dry season, it can feed more.</p>`;
  h += `<h4>At the driest time of year</h4>`;
  if (dr.length) {
    let last = dr[dr.length - 1];
    h += `<p>At the driest point of last year, <b>${escapeHtml(creekShareOfFloor(last.wet))}</b> stayed wet.</p>`;
    if (dr.length > 1) h += `<p class="muted">The last few years at their driest: ${dr.map((d) => escapeHtml(creekShareWords(d.wet))).join(" → ")}.</p>`;
  } else h += `<p>The valley hasn’t come through a dry season yet.</p>`;
  h += `<h4>The creek now</h4><p>${escapeHtml(dateText(w))}: ${s.wetSeason ? "the wet season, when storms come and the creek runs" : "the dry season"}. `;
  h += flowing >= VL - 4 ? "The creek is running the whole length of the valley." : flowing > 8 ? `The creek runs for ${flowing > VL / 2 ? "most" : "part"} of the valley, then sinks into its bed.` : "The creek has stopped flowing; only pools hold water.";
  let now = creekShareOfFloor(cr.wetNow);
  h += ` Right now ${escapeHtml(now)} ${now.startsWith("only") ? "hold" : "is"} water or marsh.</p>`;
  h += `<p>${healed > 0.8 ? "Almost the whole creek has healed: it has filled its old trench and spread back over its floor." : healed > 0.3 ? "In long stretches the creek has filled its old trench and reaches its floor again." : filling > 0.3 ? "Behind the dams the creek is filling its trench back up with gravel and mud." : "The creek is cut down into a trench below its old floor, so floods can’t spread out and the floor dries."}</p>`;
  if (dams.length) h += `<p class="muted">${dams.length} dam${dams.length > 1 ? "s" : ""} across the creek${held < dams.length ? `, ${dams.length - held === 1 ? "one" : dams.length - held} of them not holding (the water below is too far down)` : ""}. ${w.stats.raises ? ` As ponds silted up, dams have been built up ${w.stats.raises === 1 ? "once" : w.stats.raises + " times"}.` : ""}</p>`;
  return h;
}
