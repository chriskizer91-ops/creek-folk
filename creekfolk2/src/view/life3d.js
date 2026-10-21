// ==========================================================================
// The valley's creatures, in the 3D view. What the Water Brings' heron, turtles, minnows,
// frogs, dragonflies, butterflies and teal (its life.js), made the same way (chunky solids in
// three-tone paints, small state machines), living where this valley gives them a place:
//   frogs        on wet ground at the water's edge; they hop in with a ring when someone comes
//   minnows      little schools circling in pools and ponds deep enough for them; they scatter
//                when someone wades in
//   the heron    fishes in the shallows where there are fish; it stretches up when someone comes
//                near, then flies to another pool
//   dragonflies  hover and dart over standing water in summer; now and then one follows someone
//   butterflies  drift over green meadow in spring and summer, out of the way of passers-by
//   teal         paddle on ponds and the spring pool in winter and spring; they paddle off from
//                anyone who comes too close
//   turtles      sun on logs by the water and on the dams; they plop in when someone comes close
//                and climb back when they have gone
// A cut-down creek has few places for them, and they are few even there; a healed wetland has
// them wherever you look (how many come follows how much of the floor is wet). They live only
// round the view, and only when it is close enough in to see them. View only: they never touch
// the simulation, and draw their chances from their own generator, seeded from the valley's seed.
//
//   CF2Life.create(view) -> { group, update(t, dt), splash(x, z, size), waterAt(x, z), counts }
// ==========================================================================

var CF2Life = (function () {
  var PAINT = CF2Valley.PAINT;
  // the heron's grey-blue (the teal's heads too), dark eyes, crests and wingtips, frogs' lime
  // green (the valley's greens are the grass's own, which would hide them), rings on the water.
  // Everything else wears the valley's own paints: minnows stone grey (the creek bed's colour
  // would hide them), turtles pecan and willow, teal wood brown with a patch of water blue,
  // dragonflies blue with foam-white wings, butterflies gold and yellow.
  PAINT.heron = ["#5d6c7c", "#8494a4", "#aab7c4"];
  PAINT.ink = ["#2a2420", "#2a2420", "#3a2f2a"];
  PAINT.frog = ["#4a6a1e", "#7a9a2a", "#a8c040"];
  PAINT.ripple = ["#9ccbd8", "#d4e9ec", "#d4e9ec"];

  var _e = new THREE.Euler(),
    _q = new THREE.Quaternion(),
    _s = new THREE.Vector3(),
    _p = new THREE.Vector3(),
    _m = new THREE.Matrix4(),
    _m2 = new THREE.Matrix4();
  function rnd(seed) {
    seed = seed >>> 0;
    return function () {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }
  function seedOf(s) {
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  function sst(a, b, x) {
    var t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function turnTo(cur, want, k) {
    var d = Math.atan2(Math.sin(want - cur), Math.cos(want - cur));
    return cur + d * Math.min(1, k);
  }
  var box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  function ell(rx, ry, rz, seg) {
    var g = new THREE.SphereGeometry(1, seg || 10, Math.max(6, Math.round((seg || 10) * 0.6)));
    g.scale(rx, ry, rz);
    return g;
  }
  // a solid placed in its creature's own frame (facing +z), ready to fuse with the rest
  function part(geo, x, y, z, rx, ry, rz) {
    var g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.deleteAttribute("uv");
    _e.set(rx || 0, ry || 0, rz || 0);
    _q.setFromEuler(_e);
    g.applyMatrix4(_m.compose(_p.set(x || 0, y || 0, z || 0), _q, _s.set(1, 1, 1)));
    return g;
  }
  function fuse(list) {
    var n = 0,
      o = 0;
    list.forEach((g) => (n += g.attributes.position.array.length));
    var P = new Float32Array(n),
      N = new Float32Array(n),
      out = new THREE.BufferGeometry();
    list.forEach((g) => {
      P.set(g.attributes.position.array, o);
      N.set(g.attributes.normal.array, o);
      o += g.attributes.position.array.length;
      g.dispose();
    });
    out.setAttribute("position", new THREE.BufferAttribute(P, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(N, 3));
    return out;
  }
  // a creature's place in the world: where, which way it heads (about y), its nose up or down
  // (about x, after the heading), a roll (about z), its size
  function pose(out, x, y, z, yaw, pitch, roll, s) {
    _e.set(pitch || 0, yaw || 0, roll || 0, "YXZ");
    _q.setFromEuler(_e);
    return out.compose(_p.set(x, y, z), _q, _s.setScalar(s || 1));
  }
  function joint(out, x, y, z, rx, ry, rz, sx) {
    _e.set(rx || 0, ry || 0, rz || 0);
    _q.setFromEuler(_e);
    return out.compose(_p.set(x, y, z), _q, _s.set(sx == null ? 1 : sx, 1, 1));
  }

  function create(view) {
    var vw = view.vw,
      W = view.valley,
      T = vw.T,
      paint = W.paint,
      SEED = seedOf(vw.seed),
      R = rnd(SEED ^ 0x5bd1e995),
      grp = new THREE.Group(),
      time = 0;
    grp.name = "Life";
    view.scene.add(grp);
    // a fixed chance for each place, so the same frog sits on the same bank every time you look
    function chance(k, salt) {
      var h = Math.imul((k + 0x9e3779b9 * salt) ^ SEED, 0x85ebca6b);
      h ^= h >>> 13;
      h = Math.imul(h, 0xc2b2ae35);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    }

    // ---- many copies of one small creature: each part one instanced mesh, one draw for all --
    function Herd(name, parts, max, shadow) {
      this.n = 0;
      this.max = max;
      this.parts = parts.map(function (p) {
        var m = new THREE.InstancedMesh(p.geo, paint(p.key, p.opt || {}), max);
        m.name = name;
        m.count = 0;
        m.visible = false;
        m.frustumCulled = false;
        m.castShadow = !!shadow;
        m.receiveShadow = false;
        grp.add(m);
        return { m: m, joint: p.joint || null };
      });
    }
    Herd.prototype.put = function (body, joints) {
      if (this.n >= this.max) return;
      var i = this.n++;
      for (var p of this.parts) p.m.setMatrixAt(i, p.joint ? _m2.multiplyMatrices(body, joints[p.joint]) : body);
    };
    Herd.prototype.done = function () {
      for (var p of this.parts) {
        p.m.count = this.n;
        p.m.visible = this.n > 0;
        if (this.n) p.m.instanceMatrix.needsUpdate = true;
      }
      this.n = 0;
    };

    var FROGS = new Herd(
      "Frogs",
      [
        { key: "frog", opt: { flat: true }, geo: fuse([part(ell(0.05, 0.035, 0.06)), part(ell(0.035, 0.025, 0.035), 0, 0.02, 0.045), part(box(0.03, 0.02, 0.07), -0.05, -0.02, -0.03), part(box(0.03, 0.02, 0.07), 0.05, -0.02, -0.03)]) },
        { key: "ink", geo: fuse([part(box(0.018, 0.018, 0.018), -0.022, 0.042, 0.05), part(box(0.018, 0.018, 0.018), 0.022, 0.042, 0.05)]) },
      ],
      28
    );
    var FISH = new Herd("Minnows", [{ key: "stone", geo: fuse([part(box(0.03, 0.012, 0.1)), part(box(0.045, 0.008, 0.03), 0, 0, -0.062)]) }], 96);
    // frogs and minnows are drawn a little bigger than life (a bullfrog's size, a dace's), so
    // they still read as a few pixels from the usual close views
    var FROG_S = 1.5,
      FISH_S = 1.25;
    var DFLY = new Herd(
      "Dragonflies",
      [
        { key: "fblue", geo: box(0.02, 0.02, 0.16) },
        { key: "foam", joint: "w", geo: fuse([part(box(0.22, 0.004, 0.035), 0, 0, 0.02), part(box(0.2, 0.004, 0.03), 0, 0, -0.02)]) },
      ],
      12
    );
    var wingL = part(box(0.09, 0.006, 0.08), -0.048, 0, 0),
      wingR = part(box(0.09, 0.006, 0.08), 0.048, 0, 0),
      edgeL = part(box(0.02, 0.008, 0.08), -0.09, 0, 0),
      edgeR = part(box(0.02, 0.008, 0.08), 0.09, 0, 0),
      bodyB = box(0.014, 0.014, 0.06);
    // two kinds: orange ones (the valley's gold) and yellow ones
    var BFLY = ["gold", "fyel"].map(
      (k) =>
        new Herd(
          "Butterflies",
          [
            { key: k, joint: "L", geo: wingL },
            { key: k, joint: "R", geo: wingR },
            { key: "ink", joint: "L", geo: edgeL },
            { key: "ink", joint: "R", geo: edgeR },
            { key: "ink", geo: bodyB },
          ],
          14
        )
    );
    var TEAL = new Herd(
      "Teal",
      [
        { key: "wood", geo: fuse([part(ell(0.11, 0.065, 0.17), 0, 0.035, 0), part(new THREE.ConeGeometry(0.05, 0.1, 4), 0, 0.06, -0.17, -Math.PI / 2 - 0.4)]) },
        { key: "water", geo: fuse([part(box(0.02, 0.035, 0.08), -0.1, 0.06, -0.02), part(box(0.02, 0.035, 0.08), 0.1, 0.06, -0.02)]) },
        { key: "heron", geo: part(new THREE.CylinderGeometry(0.03, 0.04, 0.08, 6), 0, 0.09, 0.1, 0.3) },
        { key: "heron", joint: "h", geo: part(ell(0.055, 0.055, 0.065)) },
        { key: "foam", joint: "h", geo: part(box(0.075, 0.035, 0.012), 0, 0, 0.06, 0.4) },
        { key: "ink", joint: "h", geo: part(box(0.035, 0.018, 0.06), 0, -0.012, 0.085) },
      ],
      16,
      true
    );
    var TURTLES = new Herd(
      "Turtles",
      [
        { key: "pecan", opt: { flat: true }, geo: part(ell(0.11, 0.055, 0.13)) },
        { key: "fyel", geo: part(ell(0.12, 0.02, 0.14), 0, -0.02, 0) },
        { key: "willow", geo: fuse([[-1, 1], [1, 1], [-1, -1], [1, -1]].map((q) => part(box(0.04, 0.02, 0.05), q[0] * 0.09, -0.025, q[1] * 0.08))) },
        { key: "willow", joint: "h", geo: part(ell(0.035, 0.03, 0.05)) },
      ],
      12,
      true
    );
    var ringG = new THREE.RingGeometry(0.86, 1, 20, 1);
    ringG.rotateX(-Math.PI / 2);
    var RINGS = new Herd("Rings", [{ key: "ripple", opt: { soft: true }, geo: ringG }], 32);
    var J = { w: new THREE.Matrix4(), L: new THREE.Matrix4(), R: new THREE.Matrix4(), h: new THREE.Matrix4() };

    // ---- where the water is round the view: a 1 m grid of the water's depth, a few rows a frame
    var MR = 28,
      MN = 2 * MR,
      map = { x0: -1e6, z0: -1e6, ok: false, wv: -1, cv: -1 },
      building = null;
    function wantMap(x, z) {
      var off = (M) => Math.max(Math.abs(x - (M.x0 + MR)), Math.abs(z - (M.z0 + MR))),
        fresh = (M) => M.wv === vw.waterV && M.cv === vw.creekV;
      if (building) {
        if (off(building) < 10 && fresh(building)) return;
      } else if (map.ok && off(map) < 10 && fresh(map)) return;
      var n = MN * MN;
      building = { x0: Math.round(x) - MR, z0: Math.round(z) - MR, j: 0, wv: vw.waterV, cv: vw.creekV, ok: true, dep: new Float32Array(n), wl: new Float32Array(n), gh: new Float32Array(n) };
    }
    function buildMap(budget) {
      var t0 = performance.now(),
        B = building;
      while (B.j < MN && performance.now() - t0 < budget) {
        var z = B.z0 + B.j + 0.5;
        for (var i = 0; i < MN; i++) {
          var x = B.x0 + i + 0.5,
            h = W.height(x, z),
            w = W.water(x, z),
            k = B.j * MN + i;
          B.gh[k] = h;
          B.wl[k] = w == null ? h : w;
          B.dep[k] = w == null ? -1 : w - h;
        }
        // the creek's own line, so a narrow creek never breaks up between the cells
        var cx = T.creekX(z),
          ci = Math.floor(cx - B.x0);
        if (ci >= 0 && ci < MN && B.dep[B.j * MN + ci] < 0) {
          var wc = W.water(cx, z);
          if (wc != null) (B.wl[B.j * MN + ci] = wc), (B.dep[B.j * MN + ci] = Math.max(0.02, wc - W.height(cx, z)));
        }
        B.j++;
      }
      if (B.j >= MN) (map = B), (building = null), findPlaces();
    }
    function cellOf(x, z) {
      var i = Math.floor(x - map.x0),
        j = Math.floor(z - map.z0);
      return i < 0 || j < 0 || i >= MN || j >= MN ? -1 : j * MN + i;
    }
    function depthAt(x, z) {
      var k = map.ok ? cellOf(x, z) : -1;
      return k < 0 ? -1 : map.dep[k];
    }
    // the water's surface (or the ground, where it is dry)
    function waterAt(x, z) {
      var k = map.ok ? cellOf(x, z) : -1;
      if (k >= 0 && map.dep[k] > 0) return map.wl[k];
      var w = W.water(x, z);
      return w == null ? W.height(x, z) : w;
    }

    // ---- how alive the valley is: the share of the floor that is wet (healed is about 60%)
    function vitality() {
      return clamp((vw.wetNow || 0) / 0.6, 0, 1);
    }
    function seasonal(sz) {
      var p = sz.progress,
        n = sz.name;
      return {
        frogs: n === "winter" ? 0 : n === "autumn" ? 1 - 0.8 * p : n === "spring" ? Math.min(1, 0.3 + 1.5 * p) : 1,
        fish: n === "winter" ? 0.5 : 1,
        dflies: n === "summer" ? 1 : n === "spring" ? sst(0.4, 0.9, p) : n === "autumn" ? 1 - sst(0.1, 0.5, p) : 0,
        bflies: n === "summer" ? 1 : n === "spring" ? sst(0.05, 0.5, p) : n === "autumn" ? 1 - sst(0, 0.3, p) : 0,
        teal: n === "winter" ? 1 : n === "spring" ? 1 - sst(0.55, 1, p) : n === "autumn" ? sst(0.6, 1, p) : 0,
        turtles: n === "summer" ? 1 : n === "spring" ? sst(0.2, 0.6, p) : n === "autumn" ? 1 - sst(0.4, 0.9, p) : 0,
      };
    }

    // ---- their places, read from the grid of water (and the wet and green grids) round the view
    var P = { frogs: [], schools: [], dflies: [], bflies: [], teal: [], basks: [] },
      SEASON = null;
    function spaced(list, gap) {
      // keep each place only if no kept one is within gap metres (in the fixed order of their chances)
      list.sort((a, b) => a.c - b.c);
      var out = [],
        g2 = gap * gap;
      for (var s of list) {
        var ok = true;
        for (var o of out)
          if ((o.x - s.x) * (o.x - s.x) + (o.z - s.z) * (o.z - s.z) < g2) {
            ok = false;
            break;
          }
        if (ok) out.push(s);
      }
      return out;
    }
    function findPlaces() {
      var g = vw.grids,
        D = map.dep,
        n = MN,
        life = vitality(),
        sz = seasonAt(vw.w),
        F = seasonal(sz),
        frogs = [],
        schools = [],
        dflies = [],
        bflies = [],
        teal = [];
      SEASON = { sz, F, life };
      var water = (i, j, d) => i >= 0 && j >= 0 && i < n && j < n && D[j * n + i] > d;
      for (var j = 1; j < n - 1; j++)
        for (var i = 1; i < n - 1; i++) {
          var k = j * n + i,
            gx = map.x0 + i,
            gz = map.z0 + j;
          if (gx < 0 || gz < 0 || gx >= VW || gz >= VL) continue;
          var gk = gz * VW + gx,
            x = gx + 0.5,
            z = gz + 0.5,
            d = D[k];
          if (d > 0) {
            // standing water for dragonflies; pools for minnows; ponds open enough for teal
            if (d > 0.05 && chance(gk, 4) < (0.04 + 0.2 * life) * F.dflies) dflies.push({ k: gk, c: chance(gk, 14), x, z, y: map.wl[k] });
            var inner = water(i - 1, j, 0.08) && water(i + 1, j, 0.08) && water(i, j - 1, 0.08) && water(i, j + 1, 0.08);
            if (d >= 0.15 && inner && chance(gk, 3) < 0.35 + 0.65 * life) {
              var wide = water(i - 2, j, 0.08) && water(i + 2, j, 0.08) && water(i, j - 2, 0.08) && water(i, j + 2, 0.08);
              schools.push({ k: gk, c: chance(gk, 13), x, z, y: map.wl[k], r: wide ? 0.95 : 0.45 });
              if (d >= 0.22 && chance(gk, 5) < (0.25 + 0.75 * life) * F.teal) teal.push({ k: gk, c: chance(gk, 15), x, z, y: map.wl[k], r: wide ? 1.2 : 0.55, n: life > 0.5 && chance(gk, 6) < 0.5 ? 3 : 2 });
            }
            continue;
          }
          // dry ground: a frog's bank beside the water, or meadow for butterflies
          var wx = 0,
            wz = 0,
            nw = 0,
            near = null;
          for (var dj = -1; dj <= 1; dj++)
            for (var di = -1; di <= 1; di++) {
              if ((di || dj) && D[(j + dj) * n + i + di] > 0) {
                wx += di;
                wz += dj;
                nw++;
                if (!near || Math.abs(di) + Math.abs(dj) < near.s) near = { s: Math.abs(di) + Math.abs(dj), k: (j + dj) * n + i + di, di, dj };
              }
            }
          if (nw) {
            if (g.wet[gk] > 0.4 && chance(gk, 1) < (0.1 + 0.5 * life) * F.frogs) {
              var fx = x + (chance(gk, 21) - 0.5) * 0.5,
                fz = z + (chance(gk, 22) - 0.5) * 0.5,
                yaw = Math.atan2(wx, wz),
                hx = map.x0 + i + near.di + 0.5,
                hz = map.z0 + j + near.dj + 0.5;
              frogs.push({ k: gk, c: chance(gk, 11), x: fx, z: fz, y: W.height(fx, fz) + 0.05, yaw, hx, hz, hy: map.wl[near.k] });
            }
          } else if ((i + j) % 2 === 0 && g.green[gk] > 0.68 && g.wear[gk] < 1.5 && chance(gk, 2) < (0.01 + 0.06 * life) * F.bflies) bflies.push({ k: gk, c: chance(gk, 12), x, z }); // meadow the valley draws as grass (above 0.66), not straw
        }
      // the spring's round pool always has a pair of teal in their season
      var sp = T.branches && T.branches.spring && T.branches.spring.head;
      if (sp && F.teal > 0.3 && cellOf(sp.x, sp.z) >= 0 && depthAt(sp.x, sp.z) > 0.12) teal.push({ k: -1, c: -1, x: sp.x, z: sp.z, y: map.wl[cellOf(sp.x, sp.z)], r: 0.8, n: 2 });
      P.frogs = spaced(frogs, 1.4);
      P.schools = spaced(schools, 5);
      P.dflies = spaced(dflies, 3);
      P.bflies = spaced(bflies, 4);
      P.teal = spaced(teal, 5);
      P.basks = basks(life, F);
      chosenAt = null;
    }
    // turtles' places: logs with water beside them, and the tops of the dams with their ponds
    function basks(life, F) {
      var out = [];
      if (F.turtles <= 0) return out;
      var toWater = (x, z) => {
        var best = null;
        for (var r = 0.6; r <= 2.6 && !best; r += 0.5)
          for (var a = 0; a < 8; a++) {
            var dx = Math.sin((a / 8) * 6.283) * r,
              dz = Math.cos((a / 8) * 6.283) * r;
            if (depthAt(x + dx, z + dz) > 0.08) {
              best = { x: dx / r, z: dz / r };
              break;
            }
          }
        return best;
      };
      var count = (id) => Math.min(3, Math.floor(chance(id, 7) * 3.2 * (0.35 + 0.65 * life) * F.turtles + 0.5));
      for (var r of vw.list("res").values()) {
        if (r.kind !== "log" || cellOf(r.x, r.z) < 0) continue;
        var w = toWater(r.x, r.z),
          n = count(r.id);
        if (!w || !n) continue;
        var ax = Math.cos(r.rot || 0),
          az = -Math.sin(r.rot || 0),
          y = W.height(r.x, r.z) + 0.46; // on top of the log (valley3d.js lays it 0.2 m up, 0.23 m round)
        out.push({ key: "log" + r.id, n, x: r.x, z: r.z, ax, az, y, len: 0.72, out: w });
      }
      for (var s of vw.list("structures").values()) {
        var cd = s.kind === "dam" && vw.dams && vw.dams[s.id];
        if (!cd || !s.ends || s.ends.length < 2 || (s.building && !(s.level >= 1)) || cellOf(s.x, s.z) < 0) continue;
        var n2 = count(s.id + 77);
        if (!n2 || depthAt(s.x, s.z - 1.2) < 0.08) continue;
        var e0 = s.ends[0],
          e1 = s.ends[1],
          L = Math.hypot(e1.x - e0.x, e1.z - e0.z) || 1;
        out.push({ key: "dam" + s.id, n: n2, x: s.x, z: s.z, ax: (e1.x - e0.x) / L, az: (e1.z - e0.z) / L, y: cd.crest + 0.05, len: Math.min(0.6, L * 0.25), out: { x: 0, z: -1 } });
      }
      return out;
    }

    // ---- the nearest few of each, round the middle of the view (they are only drawn close in)
    var chosenAt = null,
      live = { frogs: new Map(), schools: new Map(), dflies: new Map(), bflies: new Map(), teal: new Map(), basks: new Map() };
    var CAP = { frogs: 26, schools: 6, dflies: 12, bflies: 14, teal: 6, basks: 4 };
    function choose(cx, cz) {
      if (chosenAt && Math.hypot(cx - chosenAt.x, cz - chosenAt.z) < 3) return;
      chosenAt = { x: cx, z: cz };
      var d2 = (s) => (s.x - cx) * (s.x - cx) + (s.z - cz) * (s.z - cz);
      for (var kind in live) {
        var list = P[kind],
          keep = list.length > CAP[kind] ? list.slice().sort((a, b) => d2(a) - d2(b)).slice(0, CAP[kind]) : list,
          old = live[kind],
          now = new Map();
        for (var s of keep) {
          var key = s.key || s.k + ":" + s.x.toFixed(1);
          now.set(key, old.get(key) || born[kind](s));
        }
        live[kind] = now;
      }
    }
    var born = {
      frogs: (s) => ({ s, state: nearest(s.x, s.z).d < 4 ? "gone" : "sit", t: 0, wait: 3 + R() * 6 }),
      schools: (s) => ({
        s,
        scared: 0,
        fish: Array.from({ length: Math.max(3, Math.round((4 + 8 * SEASON.life) * SEASON.F.fish)) }, () => ({ a: R() * 6.28, r: s.r * (0.3 + R() * 0.7), sp: (0.6 + R() * 0.5) * (R() < 0.5 ? 1 : -1), ph: R() * 6, fx: 0, fz: 0, px: s.x, pz: s.z })),
      }),
      dflies: (s) => ({ s, x: s.x, z: s.z, tx: s.x, tz: s.z, y: 0.5, t: R() * 2, follow: 0, cool: R() * 6, ph: R() * 6, yaw: 0, odd: chance(s.k, 8) < 0.5 }),
      bflies: (s) => ({ s, ph: R() * 6, sp: 0.18 + R() * 0.1, px: s.x, pz: s.z, kind: chance(s.k, 9) < 0.55 ? 0 : 1 }),
      teal: (s) => ({ s, ducks: Array.from({ length: s.n }, (v, q) => ({ a: R() * 6.28, r: s.r * (0.45 + R() * 0.55), sp: (0.14 + R() * 0.08) * (q % 2 ? 1 : -1), flee: 0, ph: R() * 6, px: s.x, pz: s.z, yaw: 0 })) }),
      basks: (s) => ({
        s,
        turtles: Array.from({ length: s.n }, (v, i) => {
          var off = (i - (s.n - 1) / 2) * s.len;
          return { x: s.x + s.ax * off, z: s.z + s.az * off, yaw: Math.atan2(s.out.x, s.out.z) + (R() - 0.5) * 1.2, state: "bask", t: 0, wait: 0, ph: R() * 6 };
        }),
      }),
    };

    // ---- the creekfolk round about (and whether they stand in the water)
    var folk = [],
      NEAR = { d: 1e9, x: 0, z: 0, wading: false };
    function folkNow(t) {
      folk.length = 0;
      for (var c of vw.cs.values()) {
        if (c.away || !c.look) continue;
        var p = vw.posOf(c, t);
        folk.push(p.x, p.z, depthAt(p.x, p.z) > 0.04 ? 1 : 0);
      }
    }
    function nearest(x, z) {
      var bd = 1e18,
        bi = -1;
      for (var i = 0; i < folk.length; i += 3) {
        var d = (folk[i] - x) * (folk[i] - x) + (folk[i + 1] - z) * (folk[i + 1] - z);
        if (d < bd) (bd = d), (bi = i);
      }
      NEAR.d = bi < 0 ? 1e9 : Math.sqrt(bd);
      NEAR.x = bi < 0 ? 0 : folk[bi];
      NEAR.z = bi < 0 ? 0 : folk[bi + 1];
      NEAR.wading = bi >= 0 && folk[bi + 2] === 1;
      return NEAR;
    }

    // ---- rings on the water (a frog hopping in, a turtle, the heron landing, rain)
    var rings = [];
    function splash(x, z, size) {
      if (rings.length >= 32) return;
      var y = depthAt(x, z) > 0 ? map.wl[cellOf(x, z)] : W.water(x, z);
      if (y == null) return;
      rings.push({ x, y: y + 0.008, z, t: 0, dur: 0.9 + 0.3 * (size || 1), s: size || 1 });
    }
    function ringsUpdate(dt, show) {
      for (var i = rings.length - 1; i >= 0; i--) {
        var r = rings[i];
        r.t += dt;
        if (r.t >= r.dur) {
          rings.splice(i, 1);
          continue;
        }
        if (show) RINGS.put(pose(_m, r.x, r.y, r.z, 0, 0, 0, (0.08 + 0.55 * (r.t / r.dur)) * r.s));
      }
      RINGS.done();
    }

    // ---------------- frogs at the water's edge
    function frogsUpdate(dt) {
      for (var f of live.frogs.values()) {
        var s = f.s,
          nf = nearest(s.x, s.z);
        f.t += dt;
        if (f.state === "sit" && nf.d < 2.2) (f.state = "hop"), (f.t = 0);
        if (f.state === "sit") FROGS.put(pose(_m, s.x, s.y + 0.004 * Math.sin(time * 9 + s.x), s.z, s.yaw, 0, 0, FROG_S));
        else if (f.state === "hop") {
          var u = clamp(f.t / 0.5, 0, 1);
          FROGS.put(pose(_m, s.x + (s.hx - s.x) * u, s.y + (s.hy - s.y) * u + 0.45 * Math.sin(Math.PI * u), s.z + (s.hz - s.z) * u, s.yaw, -0.5 + u, 0, FROG_S));
          if (u >= 1) (f.state = "gone"), (f.t = 0), (f.wait = 8 + R() * 8), splash(s.hx, s.hz, 0.5);
        } else if (f.t > f.wait && nf.d > 4) (f.state = "sit"), (f.t = 0);
      }
      FROGS.done();
    }

    // ---------------- minnows circling in the pools
    function minnowsUpdate(dt) {
      for (var sc of live.schools.values()) {
        var s = sc.s,
          nf = nearest(s.x, s.z);
        if (nf.wading && nf.d < s.r + 1.6) sc.scared = 1.6;
        sc.scared -= dt;
        for (var f of sc.fish) {
          f.a += (f.sp * dt * (sc.scared > 0 ? 3.2 : 1)) / Math.max(0.3, f.r);
          var x = s.x + Math.cos(f.a) * f.r,
            z = s.z + Math.sin(f.a) * f.r * 0.7;
          if (sc.scared > 0) {
            var ax = x - nf.x,
              az = z - nf.z,
              L = Math.hypot(ax, az) || 1;
            f.fx += ((ax / L) * 0.5 - f.fx) * dt * 4;
            f.fz += ((az / L) * 0.5 - f.fz) * dt * 4;
          } else (f.fx *= 1 - dt * 1.5), (f.fz *= 1 - dt * 1.5);
          x += f.fx;
          z += f.fz;
          var yaw = Math.hypot(x - f.px, z - f.pz) > 1e-4 ? Math.atan2(x - f.px, z - f.pz) : f.yaw || 0;
          f.px = x;
          f.pz = z;
          f.yaw = yaw;
          FISH.put(pose(_m, x, s.y + 0.012, z, yaw, 0, 0.25 * Math.sin(time * 14 + f.ph), FISH_S));
        }
      }
      FISH.done();
    }

    // ---------------- dragonflies over standing water
    function dfliesUpdate(dt, on) {
      for (var d of live.dflies.values()) {
        var s = d.s;
        if (on < chance(s.k, 10)) continue; // out by day, in the warm; one by one at the ends of it
        var nf = nearest(d.x, d.z);
        d.t -= dt;
        d.cool -= dt;
        if (d.follow <= 0 && d.cool <= 0 && nf.d < 2.2 && d.odd) d.follow = 5 + R() * 3;
        if (d.follow > 0 && (d.follow -= dt) <= 0) d.cool = 12;
        if (d.t <= 0) {
          d.t = 0.4 + R() * 1.3;
          var a = R() * 6.28;
          if (d.follow > 0) (d.tx = nf.x + Math.cos(a) * 0.7), (d.tz = nf.z + Math.sin(a) * 0.7), (d.y = 1.3 + R() * 0.5);
          else {
            var rr = R() * 2.4;
            d.tx = s.x + Math.cos(a) * rr * 1.5;
            d.tz = s.z + Math.sin(a) * rr * 0.8;
            d.y = 0.25 + R() * 0.45;
          }
        }
        var kk = 1 - Math.exp(-dt * 6),
          px = d.x,
          pz = d.z;
        d.x += (d.tx - d.x) * kk;
        d.z += (d.tz - d.z) * kk;
        if (Math.hypot(d.x - px, d.z - pz) > 0.002) d.yaw = Math.atan2(d.x - px, d.z - pz);
        DFLY.put(pose(_m, d.x, waterAt(d.x, d.z) + d.y + 0.03 * Math.sin(time * 5 + d.ph), d.z, d.yaw), { w: joint(J.w, 0, 0, 0, 0, 0, 0, 0.6 + 0.4 * Math.abs(Math.sin(time * 40 + d.ph))) });
      }
      DFLY.done();
    }

    // ---------------- butterflies over the meadow
    function bfliesUpdate(dt, on) {
      for (var b of live.bflies.values()) {
        var s = b.s;
        if (on < chance(s.k, 10)) continue;
        var a = time * b.sp + b.ph,
          x = s.x + Math.cos(a) * 2.6 + Math.sin(a * 2.3) * 0.8,
          z = s.z + Math.sin(a * 1.3) * 1.8,
          nf = nearest(x, z);
        if (nf.d < 1.2) (x += ((x - nf.x) / (nf.d || 1)) * (1.2 - nf.d)), (z += ((z - nf.z) / (nf.d || 1)) * (1.2 - nf.d));
        var y = W.height(x, z) + 0.8 + 0.25 * Math.sin(time * 2.1 + b.ph) + 0.12 * Math.sin(time * 5.3),
          yaw = Math.atan2(x - b.px, z - b.pz),
          f = Math.sin(time * 18 + b.ph * 2);
        b.px = x;
        b.pz = z;
        BFLY[b.kind].put(pose(_m, x, y, z, yaw), { L: joint(J.L, 0, 0, 0, 0, 0, 0.9 * f), R: joint(J.R, 0, 0, 0, 0, 0, -0.9 * f) });
      }
      BFLY[0].done();
      BFLY[1].done();
    }

    // ---------------- blue-winged teal on the ponds
    function tealUpdate(dt) {
      for (var p of live.teal.values()) {
        var s = p.s;
        for (var di = 0; di < p.ducks.length; di++) {
          var d = p.ducks[di],
            nf = nearest(d.px, d.pz);
          if (nf.d < 2.5) d.flee = 2.5;
          d.flee = Math.max(0, d.flee - dt);
          d.a += (d.sp * dt * (d.flee > 0 ? 3 : 1)) / Math.max(0.3, d.r);
          var x = s.x + Math.cos(d.a) * d.r,
            z = s.z + Math.sin(d.a) * d.r * 0.8;
          if (d.flee > 0) {
            var ax = x - nf.x,
              az = z - nf.z,
              L = Math.hypot(ax, az) || 1;
            x += (ax / L) * 0.3;
            z += (az / L) * 0.3;
          }
          if (depthAt(x, z) < 0.05) d.r *= 0.98; // keep to the water
          if (Math.hypot(x - d.px, z - d.pz) > 1e-4) d.yaw = Math.atan2(x - d.px, z - d.pz);
          d.px = x;
          d.pz = z;
          TEAL.put(pose(_m, x, s.y + 0.004 * Math.sin(time * 3 + di), z, d.yaw), { h: joint(J.h, 0, 0.13, 0.12, Math.max(0, Math.sin(time * 0.7 + d.ph) - 0.85) * 4) });
        }
      }
      TEAL.done();
    }

    // ---------------- turtles sunning on logs and dams
    function turtlesUpdate(dt, on) {
      for (var b of live.basks.values()) {
        var s = b.s;
        b.turtles.forEach(function (tu, idx) {
          var d = nearest(tu.x, tu.z).d,
            fw = s.out.x,
            fz = s.out.z;
          tu.t += dt;
          if (tu.state === "bask") {
            TURTLES.put(pose(_m, tu.x, s.y, tu.z, tu.yaw), { h: joint(J.h, 0, 0, 0.15 + 0.02 * Math.sin(time * 0.7 + tu.ph)) });
            if (d < 3 + idx * 0.4 || on < 0.5) (tu.state = "plop"), (tu.t = 0);
          } else if (tu.state === "plop") {
            var u = clamp(tu.t / 0.45, 0, 1);
            TURTLES.put(pose(_m, tu.x + fw * 0.35 * u, s.y - 0.35 * u * u, tu.z + fz * 0.35 * u, tu.yaw, 0.6 * u), { h: joint(J.h, 0, 0, 0.15) });
            if (u >= 1) (tu.state = "under"), (tu.t = 0), (tu.wait = 7 + R() * 6), splash(tu.x + fw * 0.45, tu.z + fz * 0.45, 0.7);
          } else if (tu.state === "under") {
            if (tu.t > tu.wait && d > 5.5 && on >= 0.5) (tu.state = "climb"), (tu.t = 0);
          } else {
            var v = clamp(tu.t / 1.2, 0, 1);
            TURTLES.put(pose(_m, tu.x + fw * 0.35 * (1 - v), s.y - 0.12 * (1 - v), tu.z + fz * 0.35 * (1 - v), tu.yaw), { h: joint(J.h, 0, 0, 0.15) });
            if (d < 3) (tu.state = "plop"), (tu.t = 0.3);
            else if (v >= 1) (tu.state = "bask"), (tu.t = 0);
          }
        });
      }
      TURTLES.done();
    }

    // ---------------- the great blue heron, fishing the pools of the whole valley
    function mesh(geo, key, flat) {
      var m = new THREE.Mesh(geo, paint(key, { flat: flat }));
      m.castShadow = true;
      return m;
    }
    function makeHeron() {
      var g = new THREE.Group();
      g.name = "Heron";
      var body = new THREE.Group();
      body.position.y = 0.62;
      g.add(body);
      body.add(mesh(ell(0.13, 0.11, 0.24), "heron"));
      var tail = mesh(new THREE.ConeGeometry(0.07, 0.18, 5), "heron", true);
      tail.rotation.x = -Math.PI / 2 - 0.3;
      tail.position.set(0, -0.02, -0.26);
      body.add(tail);
      var neck = new THREE.Group();
      neck.position.set(0, 0.05, 0.16);
      body.add(neck);
      var n1 = mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.22, 7), "limeBed");
      n1.position.set(0, 0.1, 0.02);
      n1.rotation.x = 0.35;
      neck.add(n1);
      var n2g = new THREE.Group();
      n2g.position.set(0, 0.2, 0.06);
      neck.add(n2g);
      var n2 = mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.2, 7), "limeBed");
      n2.position.set(0, 0.09, -0.02);
      n2.rotation.x = -0.35;
      n2g.add(n2);
      var head = new THREE.Group();
      head.position.set(0, 0.2, -0.03);
      n2g.add(head);
      head.add(mesh(ell(0.045, 0.045, 0.07), "limeBed"));
      var crest = mesh(box(0.03, 0.02, 0.12), "ink");
      crest.position.set(0, 0.03, -0.06);
      crest.rotation.x = 0.3;
      head.add(crest);
      var beak = mesh(new THREE.ConeGeometry(0.018, 0.16, 5), "gold", true);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, -0.005, 0.12);
      head.add(beak);
      var legs = [-1, 1].map(function (s) {
        var l = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 5), "trunk");
        l.position.set(s * 0.05, 0.31, 0.02);
        g.add(l);
        return l;
      });
      var wings = [-1, 1].map(function (s) {
        var wg = new THREE.Group();
        wg.position.set(s * 0.1, 0.04, 0);
        body.add(wg);
        var w = mesh(box(0.5, 0.02, 0.26), "heron", true);
        w.position.set(s * 0.25, 0, 0);
        wg.add(w);
        var tip = mesh(box(0.16, 0.022, 0.2), "ink", true);
        tip.position.set(s * 0.52, 0, -0.02);
        wg.add(tip);
        wg.visible = false;
        return wg;
      });
      g.visible = false;
      grp.add(g);
      return { g, body, neck, n2g, head, legs, wings, state: "away", t: 0, spot: -1, yaw: R() * 6, from: null, to: null, dur: 3, dip: 3 + R() * 4, rest: 60 + R() * 120 };
    }
    var herons = [makeHeron(), makeHeron()],
      HS = [],
      hsV = -1;
    // where a heron can fish: the edges of the creek's pools, and shallow water standing on the floor
    function heronSpots() {
      HS = [];
      hsV = vw.waterV;
      if (vw.nodes)
        for (var i = 0; i < vw.nodes.length; i += 2) {
          var n = vw.nodes[i],
            d = n.wl - n.bed;
          if (n.z < 2 || n.z > VL - 2 || d < 0.16) continue;
          var hw = 0.5 * creekWidthAt(n, d),
            side = chance(i, 31) < 0.5 ? -1 : 1;
          HS.push({ x: T.creekX(n.z) + side * Math.max(0, hw - 0.45), z: n.z });
        }
      var g = vw.grids;
      if (g)
        for (var z = 2; z < VL - 2; z += 3)
          for (var x = 2; x < VW - 2; x += 3) {
            var k = z * VW + x,
              h = T.h[z * (VW + 1) + x];
            if (g.wt[k] > h + 0.06 && g.wt[k] < h + 0.35 && g.wet[k] > 0.6 && chance(k, 32) < 0.25) HS.push({ x: x + 0.5, z: z + 0.5 });
          }
    }
    function flyTo(h, i, lift) {
      var p = HS[i],
        gp = h.g.position;
      h.from = { x: gp.x, y: gp.y, z: gp.z };
      h.to = { x: p.x, y: W.height(p.x, p.z), z: p.z };
      h.dur = 2.4 + Math.hypot(h.to.x - h.from.x, h.to.z - h.from.z) / 7;
      h.lift = lift || 3.2;
      h.spot = i;
      h.state = "fly";
      h.t = 0;
      h.wings.forEach((w) => (w.visible = true));
    }
    function pickSpot(h, avoid, minD, maxD) {
      var best = -1,
        bd = -1e9,
        gp = h.g.position;
      HS.forEach(function (p, i) {
        if (i === h.spot || herons.some((o) => o !== h && o.spot === i)) return;
        var dk = avoid ? Math.hypot(p.x - avoid.x, p.z - avoid.z) : 99,
          dh = Math.hypot(p.x - gp.x, p.z - gp.z),
          score = Math.min(dk, 18) - Math.abs(dh - (minD + maxD) / 2) * 0.15 + R() * 3;
        if (dk > 9 && dh >= minD && dh <= maxD && score > bd) (bd = score), (best = i);
      });
      return best;
    }
    function heronUpdate(h, dt, want, show) {
      var g = h.g,
        gp = g.position;
      h.t += dt;
      if (h.state === "away") {
        g.visible = false;
        if (!want || !HS.length || h.t < 4) return;
        // comes in over the rim of the valley to a pool
        var i = Math.floor(R() * HS.length);
        gp.set(HS[i].x + 40 * (R() - 0.5), W.height(HS[i].x, HS[i].z) + 14, HS[i].z - 30);
        flyTo(h, i, 2);
      }
      var nf = nearest(gp.x, gp.z);
      if (h.state === "stand") {
        if (!want || !HS.length) {
          // gone for the season, or nowhere left to fish
          gp.y = -50;
          h.state = "away";
          h.t = 0;
          return;
        }
        h.rest -= dt;
        if (show) {
          gp.y = W.height(gp.x, gp.z);
          h.dip -= dt;
          var dipA = 0;
          if (h.dip < 0) {
            var u = -h.dip;
            dipA = Math.sin(Math.min(1, u / 0.9) * Math.PI);
            if (u > 0.9) h.dip = 4 + R() * 5;
          }
          h.neck.rotation.x = 0.6 * dipA;
          h.n2g.rotation.x = 0.9 * dipA;
          h.head.rotation.x = 0.3 * dipA;
          g.rotation.y = turnTo(g.rotation.y, h.yaw, dt * 1.5);
        }
        if (nf.d < 6) (h.state = "alert"), (h.t = 0);
        else if (h.rest < 0) {
          // restless: on to another pool along the valley
          h.rest = 90 + R() * 200;
          var j = pickSpot(h, null, 10, 60);
          if (j >= 0) flyTo(h, j, 2.5);
        }
      } else if (h.state === "alert") {
        h.neck.rotation.x *= 0.85;
        h.n2g.rotation.x = -0.25 * sst(0, 0.4, h.t);
        h.head.rotation.x = 0;
        g.rotation.y = turnTo(g.rotation.y, Math.atan2(nf.x - gp.x, nf.z - gp.z) + Math.PI * 0.4, dt * 3);
        if (nf.d < 4 || h.t > 6) {
          var k = pickSpot(h, nf, 12, 70);
          if (k < 0) k = pickSpot(h, null, 0, 1e9);
          if (k >= 0) flyTo(h, k, 3.2), splash(h.from.x, h.from.z, 1.2);
          else (h.state = "stand"), (h.t = 0);
        } else if (nf.d > 7.5) (h.state = "stand"), (h.t = 0);
      } else if (h.state === "fly") {
        var u2 = clamp(h.t / h.dur, 0, 1),
          e = u2 * u2 * (3 - 2 * u2),
          lift = h.lift * Math.sin(Math.PI * u2) * (u2 < 0.15 ? u2 / 0.15 : 1);
        gp.set(h.from.x + (h.to.x - h.from.x) * e, h.from.y + (h.to.y - h.from.y) * e + lift, h.from.z + (h.to.z - h.from.z) * e);
        g.rotation.y = turnTo(g.rotation.y, Math.atan2(h.to.x - h.from.x, h.to.z - h.from.z), dt * 4);
        var flap = Math.sin(h.t * (u2 < 0.2 ? 13 : 8)) * (u2 > 0.88 ? 0.4 : 1),
          ld = 1 - sst(0.8, 1, u2);
        h.wings[0].rotation.z = 0.9 * flap;
        h.wings[1].rotation.z = -0.9 * flap;
        h.body.rotation.x = -0.15;
        h.n2g.rotation.x = 0.9;
        h.neck.rotation.x = 0.6;
        h.legs.forEach((l) => ((l.rotation.x = -1.2 * ld), (l.position.z = -0.15 * ld + 0.02)));
        if (u2 >= 1) {
          h.state = "stand";
          h.t = 0;
          h.wings.forEach((w) => (w.visible = false));
          h.body.rotation.x = 0;
          h.yaw = R() * 6;
          h.dip = 2 + R() * 3;
          h.legs.forEach((l) => ((l.rotation.x = 0), (l.position.z = 0.02)));
          splash(gp.x, gp.z, 0.8);
        }
      }
      g.visible = show && h.state !== "away";
    }

    // ---- every frame ------------------------------------------------------------------
    var counts = {},
      countT = 0,
      lastSeason = -1;
    function hideAll() {
      for (var H of [FROGS, FISH, DFLY, BFLY[0], BFLY[1], TEAL, TURTLES, RINGS]) H.done();
      herons.forEach((h) => (h.g.visible = false));
    }
    function update(t, dt) {
      time += dt;
      if (!vw.grids || !view.px) return hideAll();
      var V = view.view,
        ppm = view.px.h / Math.max(1e-3, V.hv),
        small = ppm >= 18, // frogs, minnows, dragonflies and butterflies are a few art pixels long
        mid = ppm >= 7, // teal and turtles
        big = ppm >= 3; // the heron
      folkNow(t);
      if (mid) {
        wantMap(V.x, V.z);
        if (building) buildMap(map.ok ? 1.2 : 4);
      }
      counts.settled = !mid || (map.ok && !building);
      // the season moves on slowly: look again for places every valley day or so
      var sDay = Math.floor(valleyDays(vw.w));
      if (map.ok && sDay !== lastSeason) (lastSeason = sDay), findPlaces();
      if (vw.waterV !== hsV) heronSpots();
      var hour = cf2Hour(t),
        wx = vw.weather ? vw.weather.state : "clear",
        wetSky = wx === "rain" || wx === "storm",
        day = sst(7.6, 9, hour) * (1 - sst(18, 19.4, hour)),
        warmDay = wetSky ? 0 : day,
        F = SEASON ? SEASON.F : null,
        life = vitality();
      // herons: one where there are pools to fish, two in a healed wetland; not in deep winter
      var heronOK = HS.length > 0 && (!SEASON || SEASON.sz.name !== "winter" || SEASON.sz.progress > 0.7 || SEASON.sz.progress < 0.15);
      herons.forEach((h, i) => heronUpdate(h, dt, heronOK && (i === 0 || (life > 0.45 && HS.length >= 12)), big && Math.hypot(h.g.position.x - V.x, h.g.position.z - V.z) < Math.max(40, V.hv * 1.6)));
      if (!map.ok || !mid) {
        for (var H of [FROGS, FISH, DFLY, BFLY[0], BFLY[1], TEAL, TURTLES]) H.done();
        ringsUpdate(dt, false);
        return;
      }
      choose(V.x, V.z);
      if (small) {
        frogsUpdate(dt);
        minnowsUpdate(dt);
        dfliesUpdate(dt, warmDay);
        bfliesUpdate(dt, warmDay);
      } else for (var H2 of [FROGS, FISH, DFLY, BFLY[0], BFLY[1]]) H2.done();
      tealUpdate(dt);
      turtlesUpdate(dt, wetSky ? 0 : sst(8, 9, hour) * (1 - sst(17.5, 18.5, hour)));
      ringsUpdate(dt, small);
      // what they are showing, twice a second (for the tests)
      if ((countT -= dt) > 0) return;
      countT = 0.5;
      counts.frogs = live.frogs.size;
      counts.minnows = [...live.schools.values()].reduce((n, s) => n + s.fish.length, 0);
      // how many have just been put to flight by someone coming near
      counts.frogsIn = [...live.frogs.values()].filter((f) => f.state !== "sit").length;
      counts.schoolsScattered = [...live.schools.values()].filter((s) => s.scared > 0).length;
      counts.tealPaddlingOff = [...live.teal.values()].reduce((n, p) => n + p.ducks.filter((d) => d.flee > 0).length, 0);
      counts.turtlesIn = [...live.basks.values()].reduce((n, b) => n + b.turtles.filter((tu) => tu.state !== "bask").length, 0);
      counts.dragonflies = small ? DFLY.parts[0].m.count : 0;
      counts.butterflies = small ? BFLY[0].parts[0].m.count + BFLY[1].parts[0].m.count : 0;
      counts.teal = TEAL.parts[0].m.count;
      counts.turtles = TURTLES.parts[0].m.count;
      counts.herons = herons.filter((h) => h.state !== "away").length;
      counts.heron = [+herons[0].g.position.x.toFixed(1), +herons[0].g.position.z.toFixed(1), herons[0].state];
      // the nearest place of each kind to the middle of the view (for aiming the tests)
      counts.at = {};
      for (var kind in live) {
        var bd = 1e9;
        for (var o of live[kind].values()) {
          var dd = Math.hypot(o.s.x - V.x, o.s.z - V.z);
          if (dd < bd) (bd = dd), (counts.at[kind] = [+o.s.x.toFixed(1), +o.s.z.toFixed(1)]);
        }
      }
      counts.life = +life.toFixed(3);
    }

    return { group: grp, update, splash, waterAt, counts };
  }

  return { create };
})();
