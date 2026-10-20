"use strict";
var BUILD_VERSION = "3a", DEV_BUILD = false;
// ==== src/sim/core.js ====
  function hashSeed(i) {
    let t = String(i),
      e = 1779033703,
      n = 3144134277,
      s = 1013904242,
      r = 2773480762;
    for (let o = 0; o < t.length; o++) {
      let a = t.charCodeAt(o);
      e = n ^ Math.imul(e ^ a, 597399067),
      n = s ^ Math.imul(n ^ a, 2869860233),
      s = r ^ Math.imul(s ^ a, 951274213),
      r = e ^ Math.imul(r ^ a, 2716044179);
    }
    return (
      e = Math.imul(s ^ e >>> 18, 597399067),
      n = Math.imul(r ^ n >>> 22, 2869860233),
      s = Math.imul(e ^ s >>> 17, 951274213),
      r = Math.imul(n ^ r >>> 19, 2716044179),
      [(e ^ n ^ s ^ r) >>> 0, (n ^ e) >>> 0, (s ^ e) >>> 0, (r ^ e) >>> 0]);

  }
  var Rng = class {
    constructor(t = 1) {
      this.s = hashSeed(t);
      for (let e = 0; e < 12; e++) this.next();
    }
    next() {
      let [t, e, n, s] = this.s;
      t >>>= 0, e >>>= 0, n >>>= 0, s >>>= 0;
      let r = (t + e | 0) + s | 0;
      return (
        s = s + 1 | 0,
        t = e ^ e >>> 9,
        e = n + (n << 3) | 0,
        n = n << 21 | n >>> 11,
        n = n + r | 0,
        this.s[0] = t,
        this.s[1] = e,
        this.s[2] = n,
        this.s[3] = s,
        (r >>> 0) / 4294967296);

    }
    range(t, e) {
      return t + (e - t) * this.next();
    }
    int(t, e) {
      return t + Math.floor(this.next() * (e - t + 1));
    }
    chance(t) {
      return this.next() < t;
    }
    pick(t) {
      return t[Math.floor(this.next() * t.length)];
    }
    weighted(t, e) {
      let n = 0;
      for (let r of t) n += Math.max(0, e(r));
      if (n <= 0) return null;
      let s = this.next() * n;
      for (let r of t) if (s -= Math.max(0, e(r)), s <= 0) return r;
      return t[t.length - 1];
    }
    normal() {
      let t = 0,
        e = 0;
      for (; t === 0;) t = this.next();
      return (
        e = this.next(),
        Math.sqrt(-2 * Math.log(t)) * Math.cos(2 * Math.PI * e));

    }
    getState() {
      return this.s.slice();
    }
    setState(t) {
      this.s = t.slice();
    }
  };
  var EventHeap = class {
    constructor(t = []) {
      this.a = t.slice();
      for (let e = (this.a.length >> 1) - 1; e >= 0; e--) this._down(e);
    }
    get size() {
      return this.a.length;
    }
    peek() {
      return this.a[0];
    }
    _less(t, e) {
      return t.t < e.t || t.t === e.t && t.s < e.s;
    }
    push(t) {
      let e = this.a;
      e.push(t);
      let n = e.length - 1;
      for (; n > 0;) {
        let s = n - 1 >> 1;
        if (this._less(e[n], e[s])) [e[n], e[s]] = [e[s], e[n]], n = s;else
        break;
      }
    }
    pop() {
      let t = this.a;
      if (!t.length) return;
      let e = t[0],
        n = t.pop();
      return t.length && (t[0] = n, this._down(0)), e;
    }
    _down(t) {
      let e = this.a,
        n = e.length;
      for (;;) {
        let s = 2 * t + 1,
          r = s + 1,
          o = t;
        if (
        s < n && this._less(e[s], e[o]) && (o = s),
        r < n && this._less(e[r], e[o]) && (o = r),
        o === t)

        break;
        [e[t], e[o]] = [e[o], e[t]], t = o;
      }
    }
    toJSON() {
      return this.a;
    }
  };
  var MATERIAL_LABELS = {
      branch: "branches",
      reeds: "reeds",
      stone: "stones",
      mud: "mud",
      clay: "clay",
      seeds: "seeds",
      glowcap: "glowcaps",
      tile: "clay tiles"
    },
    HEAVY_MATERIALS = { stone: !0, clay: !0, tile: !0 },
    FOODS = {
      berry: { label: "berries", nutrition: 0.13, bite: 5 },
      bluberry: { label: "blue berries", nutrition: 0.17, bite: 5 },
      seeds: { label: "pod seeds", nutrition: 0.22, bite: 6 },
      root: { label: "reed roots", nutrition: 0.16, bite: 7 },
      greens: { label: "garden greens", nutrition: 0.2, bite: 6 },
      fruit: { label: "orchard fruit", nutrition: 0.24, bite: 6 }
    },
    BASE_CONCEPTS = [
    "help",
    "pod",
    "berry",
    "come",
    "creek",
    "rain",
    "yes",
    "no",
    "friend",
    "stone",
    "play",
    "sleep"],

    GESTURES = ["spin", "clap", "tap", "ears", "hop"],
    GESTURE_DESC = {
      spin: "spins in a circle",
      clap: "claps twice",
      tap: "taps the ground twice",
      ears: "flicks both ears",
      hop: "does a little hop"
    },
    GESTURE_FIRST = {
      spin: "spin in a circle",
      clap: "clap twice",
      tap: "tap the ground twice",
      ears: "flick my ears",
      hop: "do a little hop"
    },
    GESTURE_ING = {
      spin: "spinning",
      clap: "clapping",
      tap: "tapping the ground",
      ears: "ear-flicking",
      hop: "hopping"
    },
    RITUAL_TASKS = {
      lift: "lifting pods",
      heavy: "heavy building",
      wade: "wading the creek",
      plant: "planting"
    },
    dayLength = 7200,
    dayOffset = 0.27;
  function setDayCycle(i) {
    dayLength = i && i.len ? i.len : 7200,
    dayOffset = i && i.off !== void 0 ? i.off : 0.27;
  }
  function getDayLength() {
    return dayLength;
  }
  function dayPhase(i) {
    return ((i / dayLength + dayOffset) % 1 + 1) % 1;
  }
  function dayNumber(i) {
    return Math.floor(i / 86400) + 1;
  }
  function isNight(i) {
    let t = dayPhase(i);
    return t < 0.2 || t > 0.82;
  }
  function daylight(i) {
    let t = dayPhase(i),
      e = 0.05;
    return t < 0.2 - e || t > 0.82 + e ?
    0 :
    t < 0.2 + e ?
    (t - (0.2 - e)) / (2 * e) :
    t > 0.82 - e ?
    1 - (t - (0.82 - e)) / (2 * e) :
    1;
  }
  function timeOfDayName(i) {
    let t = dayPhase(i);
    return t < 0.2 - 0.03 ?
    "night" :
    t < 0.2 + 0.06 ?
    "dawn" :
    t < 0.42 ?
    "morning" :
    t < 0.58 ?
    "midday" :
    t < 0.82 - 0.06 ?
    "afternoon" :
    t < 0.82 + 0.03 ?
    "dusk" :
    "night";
  }
  var clamp = (i, t, e) => i < t ? t : i > e ? e : i;
  var dist2d = (i, t, e, n) => Math.hypot(i - e, t - n);
  var WATER_LEVEL = 0.4;
  function smoothstep(i, t, e) {
    let n = clamp((e - i) / (t - i), 0, 1);
    return n * n * (3 - 2 * n);
  }
  var ValueNoise = class {
      constructor(t) {
        this.p = new Float32Array(256);
        for (let n = 0; n < 256; n++) this.p[n] = t.next();
        this.perm = new Uint8Array(512);
        let e = [...Array(256).keys()];
        for (let n = 255; n > 0; n--) {
          let s = Math.floor(t.next() * (n + 1));
          [e[n], e[s]] = [e[s], e[n]];
        }
        for (let n = 0; n < 512; n++) this.perm[n] = e[n & 255];
      }
      v(t, e) {
        return this.p[this.perm[(t & 255) + this.perm[e & 255]]];
      }
      get(t, e) {
        let n = Math.floor(t),
          s = Math.floor(e),
          r = t - n,
          o = e - s,
          a = r * r * (3 - 2 * r),
          l = o * o * (3 - 2 * o),
          c = this.v(n, s),
          h = this.v(n + 1, s),
          d = this.v(n, s + 1),
          u = this.v(n + 1, s + 1);
        return (c + (h - c) * a) * (1 - l) + (d + (u - d) * a) * l;
      }
      fbm(t, e, n = 3) {
        let s = 0,
          r = 0.5,
          o = 1,
          a = 0;
        for (let l = 0; l < n; l++)
        s += r * this.get(t * o, e * o), a += r, r *= 0.5, o *= 2.03;
        return s / a;
      }
    },
    // CREEK: the valley for Phase 3A. Longer (VL) and wider (VW), shaped like a real
    // valley in cross-section: the creek's trench, the valley floor (bottomland) it
    // has cut down below, a rise to the terraces where the village lives, and hills at
    // the rim. The creek's centre line is fixed by the seed; its trench, its floor and
    // the side channels worn across the floor come from the creek model
    // (src/sim/creek.js), and setCreek() rebuilds the heights when they change.
    Terrain = class {
      constructor(t) {
        let e = new Rng(t + ":terrain");
        this.noise = new ValueNoise(e);
        this.ax0 = VW / 2 + e.range(-1.5, 1.5);
        this.aa = e.range(1.5, 3.2);
        this.af = (2 * Math.PI) / e.range(110, 170);
        this.ap = e.range(0, 6.28);
        this.fw0 = e.range(11.5, 13.2);
        this.fwa = e.range(1.0, 2.0);
        this.fwf = (2 * Math.PI) / e.range(60, 100);
        this.fwp = e.range(0, 6.28);
        this.cOff = e.range(2.5, 4); // the creek runs a little to one side, leaving more room on side 0
        this.ma1 = e.range(1.6, 2.5);
        this.mf1 = (2 * Math.PI) / e.range(36, 52);
        this.mp1 = e.range(0, 6.28);
        this.ma2 = e.range(0.35, 0.7);
        this.mf2 = (2 * Math.PI) / e.range(13, 19);
        this.mp2 = e.range(0, 6.28);
        this.zKnee = e.range(44, 58); // the steeper upper stretch ends here
        this.rimSeed = e.range(0, 100);
        this.radiusNoiseSeed = this.rimSeed;
        this.version = 0;
        // look-up tables along z, from 40 m above the valley to 40 m below it
        this.lz0 = -40;
        this.lutN = Math.round((VL + 80) * 8);
        this.lut = new Float64Array((this.lutN + 1) * 4); // creekX, creekHW, axisX, floorHW
        this.rimLut = new Float64Array(this.lutN + 1); // 1 / the rim's half-width, and dz^4, by z
        this.dzLut = new Float64Array(this.lutN + 1);
        for (let n = 0; n <= this.lutN; n++) {
          let z = this.lz0 + n / 8,
            dz = (z - VL / 2) / (VL / 2 - 1);
          this.lut[n * 4] = this.creekXRaw(z);
          this.lut[n * 4 + 1] = 1.2;
          this.lut[n * 4 + 2] = this.axisXRaw(z);
          this.lut[n * 4 + 3] = this.floorHWRaw(z);
          this.rimLut[n] = 1 / (35.2 + 1.3 * Math.sin(z * 0.07 + this.rimSeed) + 0.8 * Math.sin(z * 0.19 + this.rimSeed * 2));
          this.dzLut[n] = dz * dz * dz * dz;
        }
        // the parts of the height field that never change
        let N = (VW + 1) * (VL + 1);
        this.N = VW + 1;
        this.h = new Float32Array(N);
        this.micro = new Float32Array(N);
        this.terr = new Float32Array(N);
        this.wF = new Float32Array(N);
        this.hill = new Float32Array(N);
        for (let z = 0; z <= VL; z++)
        for (let x = 0; x <= VW; x++) {
          let k = z * (VW + 1) + x,
            b = this.baseAt(x, z);
          this.micro[k] = b.micro;
          this.terr[k] = b.terr;
          this.wF[k] = b.wF;
          this.hill[k] = b.hill;
        }
        this.initNodes = creekBuildNodes(this, t);
        this.setCreek({ nodes: this.initNodes, chan: null });
      }
      axisXRaw(z) {
        return this.ax0 + this.aa * Math.sin(z * this.af + this.ap);
      }
      floorHWRaw(z) {
        return this.fw0 + this.fwa * Math.sin(z * this.fwf + this.fwp);
      }
      creekXRaw(z) {
        // fairly straight: gentle bends about a line a little off the valley's axis
        return this.axisXRaw(z) + this.cOff + this.ma1 * Math.sin(z * this.mf1 + this.mp1) + this.ma2 * Math.sin(z * this.mf2 + this.mp2);
      }
      lookup(z, k) {
        let n = (z - this.lz0) * 8;
        if (n <= 0) n = 0;
        if (n >= this.lutN) n = this.lutN - 1e-6;
        let s = Math.floor(n),
          r = n - s,
          o = this.lut[s * 4 + k],
          a = this.lut[s * 4 + 4 + k];
        return o + (a - o) * r;
      }
      creekX(z) {
        return this.lookup(z, 0);
      }
      creekHW(z) {
        return this.lookup(z, 1);
      }
      axisX(z) {
        return this.lookup(z, 2);
      }
      floorHW(z) {
        return this.lookup(z, 3);
      }
      // the old valley floor's level along the valley: steeper above the knee
      fp0(z) {
        let k = this.zKnee,
          below = 0.9 + 0.0072 * (VL - Math.max(z, k)),
          above = 0.0135 * Math.max(0, k - z);
        return below + above;
      }
      edgeDist(t, e) {
        return Math.abs(t - this.creekX(e)) - this.creekHW(e);
      }
      side(t, e) {
        return t < this.creekX(e) ? 0 : 1;
      }
      isWater(t, e) {
        return this.edgeDist(t, e) < 0;
      }
      // 0 in the middle of the valley, 1 at the rim (a rounded rectangle, so the old
      // thresholds keep their meaning: walkable below 0.9, hills rising above 0.82)
      valleyR(t, e) {
        let n = (e - this.lz0) * 8;
        n = n <= 0 ? 0 : n >= this.lutN ? this.lutN : Math.round(n);
        let dx = (t - this.lut[n * 4 + 2]) * this.rimLut[n],
          d2 = dx * dx;
        return Math.sqrt(Math.sqrt(d2 * d2 + this.dzLut[n]));
      }
      // the fixed parts of the ground at (x, z): floor micro-relief, terraces, hills
      baseAt(x, z) {
        let n = this.noise,
          d = Math.abs(x - this.axisX(z)),
          fhw = this.floorHW(z),
          // the floor's relief: long shallow swales down the valley (old channel scars),
          // smaller hummocks, and a little roughness; about +-0.17 m, so a pond held a
          // hand above the floor spreads along the hollows instead of straight across
          micro =
            0.02 +
            0.38 * (2 * n.fbm(x * 0.11 + 7, z * 0.035 + 3, 3) - 1) +
            0.07 * (2 * n.fbm(x * 0.25 + 1, z * 0.25 + 5, 2) - 1) +
            0.025 * (2 * n.get(x * 0.7, z * 0.7 + 11) - 1),
          rise = 0.75 * smoothstep(fhw - 1, fhw + 4, d) + 0.014 * Math.max(0, d - fhw - 4) + 0.5 * (n.fbm(x * 0.06 + 20, z * 0.06, 3) - 0.5) * smoothstep(fhw, fhw + 6, d),
          terr = this.fp0(z) + rise,
          wF = 1 - smoothstep(fhw - 1.5, fhw + 2.5, d),
          hill = 0,
          r = this.valleyR(x, z);
        if (r > 0.82) {
          let lg = smoothstep(1.5, 8, Math.abs(x - this.creekXRaw(z)) - 2);
          hill = Math.pow(r - 0.82, 1.6) * 34 * (0.65 + 0.7 * n.fbm(x * 0.11 + 9, z * 0.11 + 3)) * lg;
        }
        return { micro, terr, wF, hill };
      }
      // the creek's cross-section at z, offset o from its centre line
      section(z, o) {
        let ns = this._nodes,
          f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
          i = Math.floor(f),
          t = f - i,
          a = this.secOf(ns[i], o),
          b = this.secOf(ns[i + 1], o);
        return a + (b - a) * t;
      }
      secOf(n, o) {
        let hw = n.wb / 2;
        if (o <= hw) return n.bed;
        let Ht = Math.max(n.fp - n.bed, 0.05),
          m = n.m,
          Hz = n.bw > 0.05 ? clamp(n.bz - n.bed, 0, Ht - 0.03) : 0;
        if (Hz > 0) {
          let x1 = hw + m * Hz;
          if (o <= x1) return n.bed + (o - hw) / m;
          let x3 = x1 + n.bw / 2;
          if (o <= x3) return n.bed + Hz;
          let edge = x3 + m * (Ht - Hz);
          return o <= edge ? n.bed + Hz + (o - x3) / m : n.fp + (o - edge) * 1.5;
        }
        let edge = hw + m * Ht;
        return o <= edge ? n.bed + (o - hw) / m : n.fp + (o - edge) * 1.5;
      }
      fpAt(z) {
        let ns = this._nodes,
          f = clamp((z - CREEK.z0) / CREEK.ds, 0, ns.length - 1.0001),
          i = Math.floor(f),
          t = f - i;
        return ns[i].fp + (ns[i + 1].fp - ns[i].fp) * t;
      }
      // the creek has changed: rebuild the heights, the creek's half-width and the version
      setCreek(cr) {
        this._nodes = cr.nodes;
        let chan = cr.chan;
        for (let n = 0; n <= this.lutN; n++) {
          let z = this.lz0 + n / 8,
            f = clamp((z - CREEK.z0) / CREEK.ds, 0, cr.nodes.length - 1.0001),
            i = Math.floor(f),
            t = f - i,
            hwA = this.hwOf(cr.nodes[i]),
            hwB = this.hwOf(cr.nodes[i + 1]);
          this.lut[n * 4 + 1] = hwA + (hwB - hwA) * t;
        }
          this.cut || (this.cut = new Float32Array(this.h.length));
        for (let z = 0; z <= VL; z++) {
          let fp = this.fpAt(z),
            cx = this.creekX(z);
          for (let x = 0; x <= VW; x++) {
            let k = z * (VW + 1) + x,
              floor = fp + this.micro[k] - (chan ? chan[k] : 0),
              w = this.wF[k],
              h = w * floor + (1 - w) * Math.max(this.terr[k], floor) + this.hill[k],
              s = this.section(z, Math.abs(x - cx));
            this.h[k] = s < h ? s : h;
            this.cut[k] = s < h ? h - s : 0; // how deep the creek has cut here (for drawing)
          }
        }
        this.version++;
      }
      hwOf(n) {
        let Ht = Math.max(n.fp - n.bed, 0.05),
          y = Math.min(Ht, 0.6),
          Hz = n.bw > 0.05 ? clamp(n.bz - n.bed, 0, Ht - 0.03) : 0,
          w = n.wb + 2 * n.m * y + (n.bw > 0.05 && y > Hz ? n.bw : 0);
        return clamp(w / 2, 0.6, 2.6);
      }
      // heights outside the grid (the hills and the creek's gorges around the valley)
      heightRaw(t, e) {
        let b = this.baseAt(t, e),
          fp = this._nodes ? this.fpAt(e) : this.fp0(e),
          floor = fp + b.micro,
          h = b.wF * floor + (1 - b.wF) * Math.max(b.terr, floor) + b.hill;
        if (this._nodes) {
          let s = this.section(e, Math.abs(t - this.creekX(e)));
          if (s < h) h = s;
        }
        return h;
      }
      heightAt(t, e) {
        let n = this.N,
          s = clamp(t, 0, VW - 0.001),
          r = clamp(e, 0, VL - 0.001),
          o = Math.floor(s),
          a = Math.floor(r),
          l = s - o,
          c = r - a,
          h = this.h[a * n + o],
          d = this.h[a * n + o + 1],
          u = this.h[(a + 1) * n + o],
          f = this.h[(a + 1) * n + o + 1];
        return (h + (d - h) * l) * (1 - c) + (u + (f - u) * l) * c;
      }
      // the ground at (x, z) as if the creek's trench were not there (for drawing the
      // trench as its own smooth mesh): bilinear over the grid like the ground itself
      uncarvedAt(t, e) {
        if (t < 0 || e < 0 || t >= VW || e >= VL || !this.cut) {
          let b = this.baseAt(t, e),
            fp = this._nodes ? this.fpAt(e) : this.fp0(e),
            floor = fp + b.micro;
          return b.wF * floor + (1 - b.wF) * Math.max(b.terr, floor) + b.hill;
        }
        let n = this.N,
          o = Math.floor(t),
          a = Math.floor(e),
          l = t - o,
          c = e - a,
          H = this.h,
          C = this.cut,
          v = (k) => H[k] + C[k],
          h = v(a * n + o),
          d = v(a * n + o + 1),
          u = v((a + 1) * n + o),
          f = v((a + 1) * n + o + 1);
        return (h + (d - h) * l) * (1 - c) + (u + (f - u) * l) * c;
      }
      // on the valley floor (the bottomland that can turn to wetland): 0..1
      floorWeight(t, e) {
        let d = Math.abs(t - this.axisX(e)),
          f = this.floorHW(e);
        return 1 - smoothstep(f - 1, f + 2, d);
      }
      walkable(t, e) {
        return (
          t > 1 &&
          e > 1 &&
          t < VW - 1 &&
          e < VL - 1 &&
          this.valleyR(t, e) < 0.9 &&
          this.edgeDist(t, e) > 0.2);

      }
      bankPoint(t, e, n = 0.55) {
        e = clamp(e, 4, VL - 4);
        let s = this.creekX(e),
          r = this.creekHW(e);
        return { x: t === 0 ? s - r - n : s + r + n, z: e };
      }
      randomPoint(t, e = {}) {
        for (let n = 0; n < 400; n++) {
          let s = t.range(3, VW - 3),
            r = t.range(3, VL - 3);
          if (
          !this.walkable(s, r) ||
          e.side !== void 0 && this.side(s, r) !== e.side)

          continue;
          let o = this.edgeDist(s, r);
          if (
          !(e.minEdge !== void 0 && o < e.minEdge) &&
          !(e.maxEdge !== void 0 && o > e.maxEdge) &&
          !(e.maxR !== void 0 && this.valleyR(s, r) > e.maxR) &&
          !(e.minR !== void 0 && this.valleyR(s, r) < e.minR) &&
          !(e.zMin !== void 0 && r < e.zMin) &&
          !(e.zMax !== void 0 && r > e.zMax) &&
          !(e.offFloor && this.floorWeight(s, r) > 0.2) &&
          !(e.onFloor && this.floorWeight(s, r) < 0.8) &&
          !(e.near && Math.hypot(s - e.near.x, r - e.near.z) > e.near.r) &&
          !(
          e.avoid &&
          e.avoid.some((a) => Math.hypot(s - a.x, r - a.z) < (a.r ?? 2))))


          return { x: s, z: r };
        }
        return null;
      }
      waterSpan(t, e, n, s) {
        let r = Math.max(8, Math.ceil(Math.hypot(n - t, s - e) * 2)),
          o = -1,
          a = -1;
        for (let l = 0; l <= r; l++) {
          let c = l / r;
          this.isWater(t + (n - t) * c, e + (s - e) * c) && (
          o < 0 && (o = c), a = c);
        }
        return o < 0 ?
        null :
        [Math.max(0, o - 0.5 / r), Math.min(1, a + 0.5 / r)];
      }
    };
  var ONSETS = [
    "b",
    "d",
    "f",
    "g",
    "h",
    "k",
    "l",
    "m",
    "n",
    "p",
    "r",
    "s",
    "t",
    "v",
    "w",
    "z",
    "br",
    "tr",
    "pl",
    "sk",
    "mw",
    "th",
    "ch"],

    VOWELS = ["a", "e", "i", "o", "u", "oo", "ee", "ai", "ou"],
    CODAS = ["", "", "", "", "n", "m", "k", "sh", "l", "p"];
  function makeAccent(i) {
    let t = (e, n) => {
      let s = e.slice();
      for (let r = s.length - 1; r > 0; r--) {
        let o = Math.floor(i.next() * (r + 1));
        [s[r], s[o]] = [s[o], s[r]];
      }
      return s.slice(0, n);
    };
    return {
      on: t(ONSETS, 7),
      vo: t(VOWELS, 4),
      co: t(CODAS, 4),
      pitch: i.range(0.85, 1.25)
    };
  }
  function inventWord(i, t) {
    let e = () => t.pick(i.on) + t.pick(i.vo),
      n = t.chance(0.75) ? 2 : t.chance(0.5) ? 1 : 3,
      s = "";
    for (let r = 0; r < n; r++) s += e();
    return (
      s += t.pick(i.co), s.length < 3 && (s += t.pick(i.vo)), s.slice(0, 9));

  }
  function favoriteWord(i, t) {
    let e = i.lex[t];
    if (!e) return null;
    let n = null,
      s = -1;
    for (let r in e) e[r] > s && (s = e[r], n = r);
    return n;
  }
  function wordFor(i, t, e) {
    let n = favoriteWord(t, e);
    return (
      n || (
      n = inventWord(t.accent, i.rng),
      t.lex[e] = { [n]: 1 },
      i.stats.wordsInvented = (i.stats.wordsInvented || 0) + 1),
      n);

  }
  function hearWord(i, t, e, n, s) {
    let r = t.lex[n] || (t.lex[n] = {}),
      o = e.lex[n] || (e.lex[n] = {});
    if (o[s] !== void 0) {
      for (let l of [r, o]) {
        l[s] = Math.min(4, (l[s] || 0) + 0.45);
        for (let c in l) c !== s && (l[c] -= 0.2, l[c] <= 0 && delete l[c]);
      }
      return !0;
    }
    let a = 0.3 + 0.3 * e.temp.curiosity;
    return (
      i.rng.chance(0.45) && (o[s] = a),
      r[s] !== void 0 && (r[s] = Math.max(0.1, r[s] - 0.15)),
      !1);

  }
  function vocabularySummary(i) {
    let t = new Set();
    for (let n of i.creatures) for (let s in n.lex) t.add(s);
    let e = [];
    for (let n of t) {
      let s = {},
        r = 0;
      for (let l of i.creatures) {
        let c = favoriteWord(l, n);
        c && (s[c] = (s[c] || 0) + 1, r++);
      }
      let o = null,
        a = 0;
      for (let l in s) s[l] > a && (a = s[l], o = l);
      o &&
      e.push({
        concept: n,
        word: o,
        users: a,
        speakers: r,
        variants: Object.keys(s).length,
        all: s
      });
    }
    return (
      e.sort((n, s) => s.users - n.users || n.concept.localeCompare(s.concept)),
      e);

  }
  var CONCEPT_LABELS = {
    giver: "the one who sends gifts", // MINDS
    spring: "spring",
    summer: "summer",
    autumn: "autumn",
    winter: "winter",
    help: "help",
    pod: "seed pod",
    berry: "berries",
    come: "come here",
    creek: "the creek",
    rain: "rain",
    yes: "yes",
    no: "no",
    friend: "friend",
    stone: "stone",
    play: "play",
    sleep: "sleep",
    home: "home",
    nest: "nest",
    hut: "hut",
    store: "storehouse",
    garden: "garden",
    crossing: "crossing",
    workshop: "workshop",
    meeting: "meeting place",
    chimes: "rain chimes",
    lookout: "lookout",
    mud: "mud",
    clay: "clay",
    sprout: "sprout",
    glowcap: "glowcap",
    tool: "tool",
    heavy: "heavy",
    tree: "tree",
    dam: "dam",
    pond: "pond",
    frog: "frog"
  };
  var FOLK_NAMES = [
    "Pip",
    "Moss",
    "Bram",
    "Wren",
    "Tansy",
    "Quill",
    "Fennel",
    "Ollo",
    "Juniper",
    "Bix",
    "Sorrel",
    "Nim",
    "Tuck",
    "Mirri",
    "Puddle",
    "Hob",
    "Clover",
    "Ash",
    "Bramble",
    "Sedge",
    "Tamsin",
    "Ludo",
    "Kestrel",
    "Pebble"],

    INTERESTS = [
    "water",
    "building",
    "growing",
    "collecting",
    "sound",
    "exploring",
    "social"],

    INTEREST_LABELS = {
      water: "the creek",
      building: "making things",
      growing: "growing things",
      collecting: "collecting",
      sound: "sounds",
      exploring: "exploring",
      social: "company"
    };
  function makeFolk(i, t, e, n) {
    let s = i.rng,
      r = () => clamp(0.5 + s.normal() * 0.22, 0.08, 0.95),
      o = {
        curiosity: r(),
        caution: r(),
        sociability: r(),
        patience: r(),
        persistence: r(),
        activity: r(),
        generosity: r()
      },
      a = {};
    for (let u of INTERESTS) a[u] = s.range(0.12, 0.45);
    let l = s.pick(INTERESTS);
    if (a[l] = s.range(0.7, 0.9), s.chance(0.5)) {
      let u = s.pick(INTERESTS);
      u !== l && (a[u] = s.range(0.55, 0.75));
    }
    let c = {};
    for (let u in FOODS) c[u] = clamp(s.normal() * 0.28 + 0.1, -0.45, 0.6);
    let h = s.next();
    return {
      id: i.nextId++,
      name: t,
      sig: l,
      temp: o,
      interests: a,
      tastes: c,
      strength: s.range(0.42, 0.72),
      look: {
        hue: h,
        sat: s.range(0.25, 0.55),
        light: s.range(0.45, 0.68),
        size: s.range(0.88, 1.14),
        ear: s.range(0.6, 1.4),
        earW: s.range(0.7, 1.3),
        hands: s.range(0.9, 1.35),
        belly: s.range(0.55, 0.9),
        eye: s.range(0.85, 1.25),
        tail: s.int(0, 2),
        spots: s.chance(0.35)
      },
      accent: makeAccent(s),
      x: e,
      z: n,
      face: s.range(0, Math.PI * 2),
      needs: {
        food: s.range(0.62, 0.85),
        energy: s.range(0.75, 0.95),
        comfort: 0.8,
        social: s.range(0.45, 0.75),
        fun: s.range(0.45, 0.75)
      },
      needsT: 0,
      wet: 0,
      mood: 0.1,
      fearWater: clamp(0.2 + o.caution * 0.5 + s.range(-0.1, 0.15), 0.05, 0.9),
      emo: null,
      asleep: !1,
      act: null,
      tok: 0,
      plan: null,
      resume: null,
      carry: null,
      tools: {},
      home: null,
      sleepSpot: null,
      know: {},
      seen: {},
      Q: {},
      rel: {},
      rituals: {},
      lex: {},
      desire: {
        home: 0.45,
        store: 0,
        crossing: 0,
        garden: 0,
        workshop: 0,
        meeting: 0,
        chimes: 0,
        lookout: 0,
        dam: 0
      },
      habit: {},
      habitT: 0,
      mem: [],
      places: {},
      counts: {
        wades: 0,
        slips: 0,
        helps: 0,
        helped: 0,
        pods: 0,
        labor: 0,
        chats: 0,
        plants: 0,
        built: 0,
        wetSleeps: 0,
        gifts: 0,
        explore: 0,
        delivered: 0,
        crafted: 0
      },
      workFatigue: 0,
      lastDecision: "",
      attend: null,
      emote: null
    };
  }
  function relation(i, t) {
    if (t == null) return { fam: 0, warmth: 0.1, annoy: 0, asked: 0, helped: 0, inv: 0, acc: 0, gotShare: 0, gotLittle: 0, told: 0, toldTrue: 0, lastT: -1e9 }; // LIFE: an empty home has no owner
    let e = typeof t == "number" ? t : t.id,
      n = i.rel[e];
    return (
      n || (
      n = i.rel[e] =
      {
        fam: 0,
        warmth: 0.1,
        annoy: 0,
        asked: 0,
        helped: 0,
        inv: 0,
        acc: 0,
        gotShare: 0,
        gotLittle: 0,
        told: 0,
        toldTrue: 0,
        lastT: -1e9
      }),
      n);

  }
  function affinity(i, t) {
    let e = i.temp,
      n = t.temp,
      s =
      1 -
      (Math.abs(e.curiosity - n.curiosity) +
      Math.abs(e.sociability - n.sociability) +
      Math.abs(e.caution - n.caution) +
      Math.abs(e.activity - n.activity)) /
      4,
      r = Math.min(i.id, t.id),
      o = Math.max(i.id, t.id),
      a = Math.sin(r * 12.9898 + o * 78.233) * 43758.5453,
      l = a - Math.floor(a);
    return clamp(
      -0.2 +
      0.75 * s +
      0.9 * (l - 0.4) +
      0.2 * (e.sociability + n.sociability) / 2,
      -0.35,
      0.95
    );
  }
  function warmTo(i, t, e) {
    let n = relation(i, t);
    if (e > 0) {
      let r =
      affinity(i, typeof t == "number" ? { id: t, temp: i.temp } : t) - n.warmth;
      n.warmth = clamp(n.warmth + e * (r > 0 ? Math.max(0.08, r) : 0.05), -1, 1);
    } else n.warmth = clamp(n.warmth + e, -1, 1);
    return n;
  }
  var helpRate = (i) => (i.helped + 1) / (i.asked + 2),
    acceptRate = (i) => (i.acc + 1.2) / (i.inv + 2),
    shareRate = (i) => (i.gotShare + 1) / (i.gotShare + i.gotLittle + 2),
    honestyRate = (i) => (i.toldTrue + 1.5) / (i.told + 2);
  function emote(i, t, e, n = 3) {
    i.emote = { i: e, t: t.t, d: n };
  }
  function feel(i, t, e, n) {
    i.emo = { k: e, t: t.t, v: n };
    let s =
    {
      joy: 0.35,
      pride: 0.4,
      warmth: 0.3,
      curious: 0.12,
      fright: -0.45,
      frustration: -0.3,
      sad: -0.3,
      annoyed: -0.2
    }[e] || 0;
    i.mood = clamp(i.mood + s * n, -1, 1);
  }
  function remember(i, t, e, n, s = 0.5, r = {}) {
    for (let o = t.mem.length - 1; o >= 0 && o >= t.mem.length - 12; o--) {
      let a = t.mem[o];
      if (a.text === n && i.t - a.t < 86400) {
        a.t = i.t,
        a.sal = Math.min(1, Math.max(a.sal, s) + 0.05),
        a.n = (a.n || 1) + 1,
        t.mem.splice(o, 1),
        t.mem.push(a),
        r.x !== void 0 && markPlace(t, r.x, r.z, r.pv || 0);
        return;
      }
    }
    if (
    t.mem.push({ t: i.t, k: e, text: n, sal: s, ...r }), t.mem.length > 48)
    {
      let o = -1,
        a = 1e9;
      for (let l = 0; l < t.mem.length - 6; l++) {
        let c = t.mem[l],
          h = c.sal - (i.t - c.t) / 86400 * 0.5;
        h < a && (a = h, o = l);
      }
      o >= 0 && t.mem.splice(o, 1);
    }
    r.x !== void 0 && markPlace(t, r.x, r.z, r.pv || 0);
  }
  function placeKey(i, t) {
    return Math.floor(i / 6) + "," + Math.floor(t / 6);
  }
  function markPlace(i, t, e, n) {
    if (!n) return;
    let s = placeKey(t, e);
    i.places[s] = clamp((i.places[s] || 0) * 0.85 + n, -1, 1);
  }
  function placeFeeling(i, t, e) {
    return i.places[placeKey(t, e)] || 0;
  }
  function positionAt(i, t) {
    let e = i.act;
    if (!e || !e.path) return { x: i.x, z: i.z };
    let n = e.path;
    if (t <= n[0].t) return { x: n[0].x, z: n[0].z };
    for (let r = 1; r < n.length; r++)
    if (t <= n[r].t) {
      let o = n[r - 1],
        a = n[r],
        l = (t - o.t) / Math.max(1e-6, a.t - o.t);
      return { x: o.x + (a.x - o.x) * l, z: o.z + (a.z - o.z) * l };
    }
    let s = n[n.length - 1];
    return { x: s.x, z: s.z };
  }
  function habitStrength(i, t, e) {
    let n = t.t - i.habitT;
    if (n > 0) {
      let s = Math.pow(0.5, n / 5400);
      for (let r in i.habit)
      i.habit[r] *= s, i.habit[r] < 0.02 && delete i.habit[r];
      i.habitT = t.t;
    }
    return i.habit[e] || 0;
  }
  function addHabit(i, t, e) {
    habitStrength(i, t, e), i.habit[e] = (i.habit[e] || 0) + 1;
  }
  function moodWord(i) {
    let t = i.emo;
    if (i.asleep) return "asleep";
    if (t && t.v > 0.3)
    return (
      {
        joy: "delighted",
        pride: "proud",
        warmth: "content",
        curious: "curious",
        fright: "shaken",
        frustration: "frustrated",
        sad: "downcast",
        annoyed: "irritable"
      }[t.k] || "calm");

    let e = i.needs;
    return e.food < 0.25 ?
    "hungry" :
    e.energy < 0.2 ?
    "exhausted" :
    i.wet > 0.5 && e.comfort < 0.4 ?
    "soggy" :
    e.comfort < 0.3 ?
    "uncomfortable" :
    e.social < 0.25 ?
    "lonely" :
    e.fun < 0.2 ?
    "restless" :
    i.mood > 0.45 ?
    "cheerful" :
    i.mood < -0.35 ?
    "glum" :
    "calm";
  }
  function logEvent(i, t, e, n = [], s = null, r = "misc") {
    let o = { t: i.t, imp: t, text: e, who: n, kind: r };
    return (
      s && (o.x = +s.x.toFixed(2), o.z = +s.z.toFixed(2)),
      i.log.push(o),
      i.logSeq = (i.logSeq || 0) + 1,
      i.log.length > 500 && i.log.splice(0, i.log.length - 500),
      t >= 3 && (
      i.hist.push(o),
      i.hist.length > 400 && i.hist.splice(0, i.hist.length - 400)),
      i.onLog && i.onLog(o),
      o);

  }
  function nameList(i, t) {
    let e = t.map((n) => i.byId[n] ? i.byId[n].name : "?");
    return e.length <= 1 ?
    e.join("") :
    e.slice(0, -1).join(", ") + " and " + e[e.length - 1];
  }
  var Q_DEFAULTS = {
    "pod|solo": 0.6,
    "pod|duo": 0.65,
    "help|pod": 0.5,
    "help|heavy": 0.5,
    wade: 0.5,
    "heavy|solo": 0.55,
    ask: 0.5
  };
  function qValue(i, t) {
    let e = i.Q[t];
    return e ? e.v : Q_DEFAULTS[t] ?? 0.5;
  }
  function qCount(i, t) {
    let e = i.Q[t];
    return e ? e.n : 0;
  }
  function learnQ(i, t, e, n, s = "self", r = 1) {
    let o = t.Q[e];
    o || (o = t.Q[e] = { v: Q_DEFAULTS[e] ?? 0.5, n: 0, src: s, t: i.t });
    let a = clamp(r / (o.n + 1.4), 0.08 * r, 0.75);
    return o.v = clamp(o.v + a * (n - o.v), 0, 1), o.n += r, o.t = i.t, o;
  }
  function beSeen(i, t, e) {
    let n = [];
    for (let s of i.creatures) {
      if (s === t || s.asleep || e.exclude && e.exclude.includes(s.id))
      continue;
      let r = positionAt(s, i.t),
        o = dist2d(r.x, r.z, e.x, e.z);
      if (o > (e.radius || 11)) continue;
      let a = relation(s, t),
        l =
        0.3 +
        0.35 * s.temp.curiosity +
        0.25 * clamp(a.warmth, 0, 1) + (
        e.loud ? 0.25 : 0) -
        o / 35;
      if (i.rng.chance(clamp(l, 0.05, 0.95))) {
        if (
        s.attend = { x: e.x, z: e.z, id: t.id, t: i.t, d: 3.5 },
        a.fam = Math.min(1, a.fam + 0.01),
        e.key &&
        learnQ(i, s, e.key, e.r, "obs:" + t.id, 0.4 + 0.2 * s.temp.curiosity),
        e.task && e.gesture && e.r >= 0.5)
        {
          let c = e.gesture + "|" + e.task,
            h = s.rituals[c] || 0;
          s.rituals[c] = clamp(
            h + 0.12 * (0.6 + a.warmth) * (0.7 + 0.6 * (1 - s.temp.curiosity)),
            0,
            1
          ),
          s.ritualFrom = s.ritualFrom || {},
          s.ritualFrom[c] || (s.ritualFrom[c] = t.id);
        }
        e.onSee && e.onSee(s, a),
        e.text &&
        e.sal &&
        remember(i, s, "saw", e.text, e.sal * 0.6, { who: t.id, x: e.x, z: e.z }),
        n.push(s);
      }
    }
    return n;
  }
  function chooseGesture(i, t, e) {
    let n = null,
      s = 0.12;
    for (let o of GESTURES) {
      let a = t.rituals[o + "|" + e] || 0;
      a > s && (s = a, n = o);
    }
    if (n && i.rng.chance(Math.min(0.95, s * 1.6))) return n;
    let r =
    0.07 +
    0.1 * t.temp.caution + (
    t.emo && t.emo.k === "frustration" ? 0.08 : 0);
    return i.rng.chance(r) ? i.rng.pick(GESTURES) : null;
  }
  function updateRituals(i, t, e, n, s) {
    for (let r of GESTURES) {
      let o = r + "|" + e,
        a = t.rituals[o] || 0,
        l = a;
      if (
      r === n ?
      l += s ? 0.17 : -0.3 :
      a > 0 && s && !n && (l -= 0.045 * (0.4 + t.temp.curiosity)),
      l = clamp(l, 0, 1),
      l < 0.02 ? delete t.rituals[o] : t.rituals[o] = l,
      a < 0.5 && l >= 0.5)
      {
        t.ritualSeen = t.ritualSeen || {};
        let c = t.ritualSeen[o];
        if (t.ritualSeen[o] = !0, c) continue;
        let h = t.ritualFrom && t.ritualFrom[o],
          d =
          h && i.byId[h] ? `, a habit picked up from ${i.byId[h].name}` : "";
        logEvent(
          i,
          2,
          `${t.name} now ${GESTURE_DESC[r]} before ${RITUAL_TASKS[e]}${d}.`,
          [t.id],
          t,
          "ritual"
        ),
        remember(
          i,
          t,
          "ritual",
          `I ${GESTURE_FIRST[r]} before ${RITUAL_TASKS[e]}. It seems to help.`,
          0.5
        ),
        i.stats.rituals = (i.stats.rituals || 0) + 1;
      } else
      a >= 0.5 &&
      l < 0.35 &&
      !(t.ritualDropped && t.ritualDropped[o]) && (
      t.ritualDropped = t.ritualDropped || {},
      t.ritualDropped[o] = !0,
      logEvent(
        i,
        2,
        `${t.name} has given up ${GESTURE_ING[r]} before ${RITUAL_TASKS[e]}. It didn't seem to make a difference.`,
        [t.id],
        t,
        "ritual"
      ));
    }
  }
  function ritualList(i) {
    let t = [];
    for (let e in i.rituals) {
      if (i.rituals[e] < 0.5) continue;
      let [n, s] = e.split("|");
      t.push({
        g: n,
        task: s,
        s: i.rituals[e],
        from: i.ritualFrom && i.ritualFrom[e]
      });
    }
    return t;
  }
  var BUILD_SCALE = { mat: 1.3, labor: 1.7, cure: 1, tier: [1, 1.5, 2.4, 3, 3.4, 3.8] },
    tierFactor = (i) =>
    BUILD_SCALE.tier[
    Math.min(BUILD_SCALE.tier.length - 1, i && i.building ? i.building.level : 0)],

    stageDef = (i, t, e, n = {}) => ({ name: i, mats: t, labor: e, ...n }),
    STRUCTURES = {
      home: {
        label: "home",
        personal: !0,
        concept: "home",
        radius: 1.6,
        levels: [
        {
          name: "nest",
          label: "sleeping nest",
          stages: [stageDef("nest", { branch: 3, reeds: 3 }, 90)],
          rest: 0.25,
          shelter: 0.15
        },
        {
          name: "canopy",
          label: "rain canopy",
          stages: [
          stageDef("poles", { branch: 5 }, 200),
          stageDef("thatch", { reeds: 9 }, 260)],

          rest: 0.35,
          shelter: 0.8
        },
        {
          name: "hut",
          label: "mud hut",
          know: "mud",
          concept: "hut",
          stages: [
          stageDef("foundation", { stone: 7 }, 420),
          stageDef("walls", { mud: 18, branch: 8 }, 1300, {
            cure: 2400,
            dry: !0
          }),
          stageDef("roof", { reeds: 16, branch: 10 }, 900, { heavy: !0 })],

          rest: 0.55,
          shelter: 1
        },
        {
          name: "tileroof",
          label: "clay-tile roof",
          needsTiles: !0,
          stages: [
          stageDef("battens", { branch: 12 }, 900),
          stageDef("tiles", { tile: 9 }, 2200)],

          rest: 0.65,
          shelter: 1,
          warm: !0
        },
        {
          name: "floor",
          label: "raised floor",
          stages: [
          stageDef("piers", { stone: 12 }, 1400, { heavy: !0 }),
          stageDef("boards", { branch: 22, reeds: 10 }, 2600)],

          rest: 0.75,
          shelter: 1,
          warm: !0
        },
        {
          name: "room",
          label: "extra room",
          know: "mud",
          stages: [
          stageDef("walls", { mud: 28, branch: 14, stone: 8 }, 3600, {
            cure: 4800,
            dry: !0
          }),
          stageDef("roof", { tile: 10, branch: 12 }, 3e3, { heavy: !0 })],

          rest: 0.85,
          shelter: 1,
          warm: !0
        }]

      },
      store: {
        label: "storehouse",
        concept: "store",
        radius: 1.8,
        levels: [
        {
          name: "clearing",
          label: "stockpile clearing",
          stages: [stageDef("clear", {}, 240)]
        },
        {
          name: "bins",
          label: "woven bins",
          stages: [
          stageDef("frames", { branch: 8 }, 500),
          stageDef("weave", { reeds: 14 }, 900)]

        },
        {
          name: "covered",
          label: "covered store",
          know: "mud",
          stages: [
          stageDef("posts", { branch: 14, stone: 6 }, 1500, { heavy: !0 }),
          stageDef("walls", { mud: 20 }, 1800, { cure: 3e3, dry: !0 }),
          stageDef("roof", { reeds: 20, branch: 8 }, 1500)],

          shelter: 1
        },
        {
          name: "granary",
          label: "granary",
          needsTiles: !0,
          stages: [
          stageDef("plinth", { stone: 24 }, 3600, { heavy: !0 }),
          stageDef("walls", { mud: 36, branch: 20 }, 5400, {
            cure: 6e3,
            dry: !0
          }),
          stageDef("roof", { tile: 14, branch: 16 }, 4800, { heavy: !0 })],

          shelter: 1
        }]

      },
      crossing: {
        label: "creek crossing",
        concept: "crossing",
        radius: 2.2,
        inWater: !0,
        levels: [
        {
          name: "stones",
          label: "stepping stones",
          stages: [stageDef("stones", { stone: 10 }, 900, { wet: !0 })]
        },
        {
          name: "bridge",
          label: "footbridge",
          stages: [
          stageDef("piles", { branch: 12, stone: 8 }, 2400, {
            heavy: !0,
            wet: !0
          }),
          stageDef("deck", { branch: 20, reeds: 12 }, 3600, { heavy: !0 })]

        },
        {
          name: "rails",
          label: "railings and planted banks",
          know: "planting",
          stages: [
          stageDef("rails", { branch: 14, reeds: 10 }, 2400),
          stageDef("planting", { seeds: 6 }, 1500)]

        }]

      },
      garden: {
        label: "garden",
        concept: "garden",
        radius: 2.4,
        know: "planting",
        levels: [
        {
          name: "plot",
          label: "small garden plot",
          beds: 4,
          stages: [
          stageDef("clear", { stone: 2 }, 600),
          stageDef("sow", { seeds: 4 }, 300)]

        },
        {
          name: "bed2",
          label: "second bed",
          beds: 8,
          stages: [
          stageDef("dig", { branch: 6 }, 1200),
          stageDef("sow", { seeds: 4 }, 300)]

        },
        {
          name: "compost",
          label: "compost heap",
          beds: 8,
          growth: 1.35,
          stages: [stageDef("heap", { reeds: 12, branch: 6 }, 1500)]
        },
        {
          name: "channel",
          label: "watering channel",
          beds: 8,
          growth: 1.35,
          autoWater: !0,
          know: "mud",
          stages: [
          stageDef("dig", { stone: 14 }, 5400, { heavy: !0 }),
          stageDef("line", { mud: 30, clay: 10 }, 5400, { cure: 4e3, dry: !0 })]

        },
        {
          name: "nursery",
          label: "seed nursery",
          beds: 8,
          growth: 1.35,
          autoWater: !0,
          nursery: !0,
          stages: [
          stageDef("frames", { branch: 16, reeds: 10 }, 2700),
          stageDef("sow", { seeds: 8 }, 900)]

        },
        {
          name: "bed3",
          label: "third bed",
          beds: 12,
          growth: 1.35,
          autoWater: !0,
          nursery: !0,
          stages: [
          stageDef("dig", { branch: 8, stone: 6 }, 2400),
          stageDef("sow", { seeds: 6 }, 400)]

        }]

      },
      workshop: {
        label: "workshop",
        concept: "workshop",
        radius: 1.9,
        levels: [
        {
          name: "bench",
          label: "work surface",
          stages: [stageDef("bench", { stone: 4, branch: 4 }, 500, { heavy: !0 })]
        },
        {
          name: "rack",
          label: "tool rack",
          tools: !0,
          stages: [stageDef("rack", { branch: 12, reeds: 6 }, 1500)]
        },
        {
          name: "covered",
          label: "covered workspace",
          tools: !0,
          know: "mud",
          stages: [
          stageDef("walls", { mud: 18, branch: 10 }, 2400, {
            cure: 2400,
            dry: !0
          }),
          stageDef("roof", { reeds: 18, branch: 10 }, 1800, { heavy: !0 })],

          shelter: 1
        },
        {
          name: "tiles",
          label: "tile drying racks",
          tools: !0,
          tiles: !0,
          know: "clay",
          stages: [
          stageDef("racks", { branch: 18, reeds: 8 }, 2400),
          stageDef("first tiles", { clay: 8 }, 1500)],

          shelter: 1
        }]

      },
      meeting: {
        label: "meeting place",
        concept: "meeting",
        radius: 2.4,
        levels: [
        {
          name: "stone",
          label: "meeting stone",
          stages: [stageDef("roll", {}, 300, { heavy: !0 })]
        },
        {
          name: "seats",
          label: "log seats",
          stages: [stageDef("logs", { branch: 16 }, 1500, { heavy: !0 })]
        },
        {
          name: "lanterns",
          label: "lantern ring",
          know: "glowcap",
          stages: [
          stageDef("posts", { branch: 10 }, 900),
          stageDef("lights", { glowcap: 10 }, 900)]

        },
        {
          name: "hall",
          label: "gathering hall",
          needsTiles: !0,
          stages: [
          stageDef("footings", { stone: 30 }, 5400, { heavy: !0 }),
          stageDef("frame", { branch: 40 }, 7200, { heavy: !0 }),
          stageDef("walls", { mud: 40, reeds: 20 }, 7200, { cure: 6e3, dry: !0 }),
          stageDef("roof", { tile: 18, branch: 16 }, 6600, { heavy: !0 })],

          shelter: 1
        }]

      },
      chimes: {
        label: "rain chimes",
        concept: "chimes",
        personal: !0,
        radius: 1.3,
        interest: "sound",
        levels: [
        {
          name: "frame",
          label: "chime frame",
          stages: [stageDef("frame", { branch: 6 }, 400)]
        },
        {
          name: "plates",
          label: "stone plates",
          stages: [stageDef("plates", { stone: 6 }, 800)]
        },
        {
          name: "pipes",
          label: "reed pipes",
          stages: [stageDef("pipes", { reeds: 12 }, 1200)]
        },
        {
          name: "bells",
          label: "clay bells",
          know: "clay",
          stages: [stageDef("bells", { clay: 8 }, 1800, { cure: 2400, dry: !0 })]
        }]

      },
      lookout: {
        label: "lookout",
        concept: "lookout",
        personal: !0,
        radius: 1.6,
        interest: "exploring",
        levels: [
        {
          name: "cairn",
          label: "stone cairn",
          stages: [stageDef("cairn", { stone: 14 }, 900, { heavy: !0 })]
        },
        {
          name: "platform",
          label: "lookout platform",
          stages: [
          stageDef("legs", { branch: 14 }, 1800, { heavy: !0 }),
          stageDef("deck", { branch: 10, reeds: 8 }, 1800)]

        }]

      },
      dam: {
        label: "creek dam",
        concept: "dam",
        radius: 2.2,
        inWater: !0,
        multi: 14, // CREEK: a valley's worth of dams (was 3)
        likes: "water",
        know: "dams",
        levels: [
        {
          name: "weir",
          label: "post-and-weave weir",
          stages: [
          stageDef("posts", { branch: 10 }, 1400, { heavy: !0, wet: !0 }),
          stageDef("weave", { branch: 14, reeds: 10 }, 2e3, { wet: !0 })]

        },
        {
          name: "dam",
          label: "mud-packed dam",
          know: "mud",
          concept: "pond",
          stages: [
          stageDef("stone sill", { stone: 12 }, 2e3, { heavy: !0, wet: !0 }),
          stageDef("mud face", { mud: 20 }, 2600, { wet: !0 })]

        },
        {
          name: "banks",
          label: "willow-planted banks",
          know: "planting",
          stages: [
          stageDef("cuttings", { branch: 8 }, 1500),
          stageDef("reed beds", { reeds: 10 }, 1200)]

        }]

      }
    },
    STRUCTURE_KINDS = [
    "home",
    "store",
    "crossing",
    "garden",
    "workshop",
    "meeting",
    "chimes",
    "lookout",
    "dam"];

  function isPluralLabel(i) {
    return /(stones|bins|seats|banks|racks|plates|pipes|bells)$/.test(i);
  }
  function withArticle(i) {
    return isPluralLabel(i) ? i : (/^[aeiou]/.test(i) ? "an " : "a ") + i;
  }
  function isAre(i) {
    return isPluralLabel(i) ? "are" : "is";
  }
  function levelDef(i, t) {
    return STRUCTURES[i.kind].levels[t];
  }
  function builtLevelDef(i) {
    return i.level > 0 ? STRUCTURES[i.kind].levels[i.level - 1] : null;
  }
  function levelCount(i) {
    return STRUCTURES[i].levels.length;
  }
  function currentStage(i) {
    return i.building ?
    STRUCTURES[i.kind].levels[i.building.level].stages[i.building.stage] :
    null;
  }
  function stageMats(i, t = 1) {
    let e = {};
    for (let n in i.mats)
    e[n] = Math.max(1, Math.round(i.mats[n] * BUILD_SCALE.mat * t));
    return e;
  }
  function stageLabor(i, t = 1) {
    return i.labor * BUILD_SCALE.labor * t;
  }
  function stageNeeds(i) {
    return stageMats(currentStage(i), tierFactor(i));
  }
  function stageLaborNeeded(i) {
    return stageLabor(currentStage(i), tierFactor(i));
  }
  function tierScale(i) {
    return BUILD_SCALE.tier[Math.min(BUILD_SCALE.tier.length - 1, i)];
  }
  function structureLabel(i) {
    return (
    builtLevelDef(i) || (i.building ? levelDef(i, i.building.level) : STRUCTURES[i.kind].levels[0])).
    label;
  }
  function missingMats(i, t, e = null) {
    if (!currentStage(t) || t.building.cureUntil) return {};
    let s = stageNeeds(t),
      r = {};
    for (let o in s) {
      let a = 0;
      for (let c of i.creatures) {
        if (c === e) continue;
        let h = c.plan;
        h &&
        h.goal === "work" &&
        h.sid === t.id &&
        h.mat === o &&
        !h.delivered && (
        a += h.n || 1);
      }
      let l = s[o] - (t.building.delivered[o] || 0) - a;
      l > 0 && (r[o] = l);
    }
    return r;
  }
  function matsComplete(i) {
    if (!currentStage(i)) return !1;
    let e = stageNeeds(i);
    for (let n in e) if ((i.building.delivered[n] || 0) < e[n]) return !1;
    return !0;
  }
  function projectProgress(i) {
    if (!i.building) return 1;
    let t = levelDef(i, i.building.level),
      e = tierScale(i.building.level),
      n = 0,
      s = 0;
    return (
      t.stages.forEach((r, o) => {
        let a = stageMats(r, e),
          l = 0;
        for (let u in a) l += a[u];
        let c = stageLabor(r, e),
          h = (r.cure || 0) * BUILD_SCALE.cure,
          d = l * 40 + c + h * 0.3;
        if (n += d, o < i.building.stage) s += d;else
        if (o === i.building.stage) {
          let u = 0;
          for (let p in a) u += Math.min(a[p], i.building.delivered[p] || 0);
          let f = 0;
          i.building.cureUntil && (
          f =
          h *
          0.3 * (
          1 - Math.max(0, i.building.cureLeft || 0) / Math.max(1, h))),
          s += u * 40 + Math.min(c, i.building.labor) + f;
        }
      }),
      n > 0 ? clamp(s / n, 0, 1) : 0);

  }
  function stageProgress(i) {
    if (!currentStage(i)) return 1;
    let e = stageNeeds(i),
      n = 0,
      s = 0;
    for (let l in e)
    n += e[l], s += Math.min(e[l], i.building.delivered[l] || 0);
    let r = stageLaborNeeded(i),
      o = n > 0 ? s / n : 1,
      a = r > 0 ? clamp(i.building.labor / r, 0, 1) : 1;
    return clamp(o * 0.4 + a * 0.6, 0, 1);
  }
  function shelterAt(i, t, e) {
    let n = 0;
    for (let s of i.structures) {
      let r = builtLevelDef(s);
      if (!r || !r.shelter) continue;
      let o = STRUCTURES[s.kind].radius;
      (t - s.x) ** 2 + (e - s.z) ** 2 < o * o && (n = Math.max(n, r.shelter));
    }
    if (n < 0.5)
    for (let s of i.res) {
      if (
      s.kind !== "tree" && s.kind !== "podtree" && s.kind !== "orchard" ||
      s.kind === "orchard" && s.stage < 3)

      continue;
      let r = s.canopy || 1.8;
      (t - s.x) ** 2 + (e - s.z) ** 2 < r * r && (n = Math.max(n, 0.55));
    }
    return n;
  }
  function homeOf(i, t) {
    return t.home == null ? null : i.byId[t.home] || null;
  }
  function restBonusAt(i, t, e, n) {
    let s = homeOf(i, t);
    if (s && s.level > 0 && (e - s.x) ** 2 + (n - s.z) ** 2 < 4)
    return builtLevelDef(s).rest || 0.2;
    for (let r of i.structures)
    if (
    !(r.kind !== "home" || r.level === 0) &&
    (e - r.x) ** 2 + (n - r.z) ** 2 < 4)

    return (builtLevelDef(r).rest || 0.2) * 0.85;
    return 0;
  }
  function crossingsList(i) {
    let t = [];
    for (let e of i.structures)
    e.kind === "crossing" && e.level > 0 ?
    t.push({ s: e, speed: e.level >= 2 ? 1.05 : 0.75, dry: !0 }) :
    e.kind === "dam" &&
    e.level >= 2 &&
    e.ends &&
    t.push({ s: e, speed: 0.6, dry: !0 });
    return t;
  }
  function walkToStructure(i, t, e, n, s) {
    if (t.ends) {
      let r = t.ends[i.terrain.side(e, n)];
      return { do: "walk", x: r.x, z: r.z, near: 0.15 };
    }
    return { do: "walk", x: t.x, z: t.z, near: s };
  }
  function kindComplete(i, t, e = null) {
    let n = STRUCTURES[t];
    if (n.multi) {
      let r = i.structures.filter((o) => o.kind === t);
      return r.length >= n.multi && r.every((o) => o.level >= n.levels.length);
    }
    let s = n.personal ?
    i.structures.find((r) => r.kind === t && r.owner === e) :
    i.structures.find((r) => r.kind === t);
    return !!s && s.level >= n.levels.length;
  }
  function findStructure(i, t, e = null) {
    for (let n of i.structures) if (n.kind === t && (!e || e(n))) return n;
    return null;
  }
  function workshopLevel(i) {
    let t = findStructure(i, "workshop");
    return t ? t.level : 0;
  }
  function repairMaterial(i) {
    return (
      {
        home: i.level >= 5 ? "branch" : "reeds",
        store: "reeds",
        workshop: "reeds",
        meeting: "branch",
        crossing: "branch",
        chimes: "reeds",
        lookout: "branch",
        dam: "branch"
      }[i.kind] || "branch");

  }
  function canBuildLevel(i, t, e, n) {
    let s = STRUCTURES[t.kind].levels[e];
    return !(
    !s ||
    s.know && n && !n.know[s.know] ||
    s.needsTiles && workshopLevel(i) < 4);

  }
  function waitingFor(i, t, e, n) {
    let s = [];
    for (let r of i.creatures)
    r === n ||
    !r.act ||
    r.act.type !== "wait" ||
    !r.act.obj ||
    r.act.obj.t === t && r.act.obj.id === e && s.push(r);
    return s;
  }
  function busyness(i, t) {
    if (!t.act) return 0;
    if (UNINTERRUPTIBLE.has(t.act.type)) return 9;
    let e = t.plan ? t.plan.goal : "";
    return (
      {
        eat: 0.45,
        sleep: 9,
        nap: 0.6,
        shelter: 0.35,
        work: 0.12,
        pod: 0.3,
        help: 0.5,
        social: 0.2,
        found: 0.25,
        craft: 0.2
      }[e] || 0.05);

  }
  function pickHelper(i, t, e, n) {
    let s = null,
      r = 0.02;
    for (let o of i.creatures) {
      if (o === t || o.asleep || n.includes(o.id) || busyness(i, o) > 1) continue;
      let a = positionAt(o, i.t),
        l = dist2d(t.x, t.z, a.x, a.z);
      if (l > 26) continue;
      let c = relation(t, o),
        h =
        (0.3 + helpRate(c)) * (
        0.65 + clamp(c.warmth, -0.5, 1)) * (
        1 - l / 38) * (
        1 - 0.5 * c.annoy) *
        i.rng.range(0.85, 1.15);
      h > r && (r = h, s = o);
    }
    return s;
  }
  function respondToAsk(i, t, e, n, s) {
    if (e.asleep) return !1;
    let r = busyness(i, e);
    if (r > 1) return emote(e, i, "busy", 2), !1;
    let o = 0;
    (s.concepts || []).forEach((x, g) => {
      hearWord(i, t, e, x, s.words[g]) && o++;
    });
    let a = s.concepts && s.concepts.length ? o / s.concepts.length : 1;
    e.attend = { id: t.id, x: t.x, z: t.z, t: i.t, d: 3 };
    let l = relation(e, t),
      c = e.needs,
      h = e.temp,
      d;
    if (n === "help-pod" || n === "help-heavy") {
      if (
      d =
      0.12 +
      0.28 * h.generosity +
      0.2 * h.sociability +
      0.45 * clamp(l.warmth, -1, 1) -
      0.35 * l.annoy,
      n === "help-pod")

      d +=
      0.4 * (shareRate(l) - 0.5) +
      0.5 * (qValue(e, "help|pod") - 0.5) +
      0.25 * (1 - c.food) +
      0.12 * (e.tastes.seeds || 0);else
      {
        let x = i.byId[s.obj.id];
        d +=
        0.4 * (qValue(e, "help|heavy") - 0.5) +
        0.15 * e.interests.building + (
        x ? 0.15 * (e.desire[x.kind] || 0) : 0),
        x && x.owner === e.id && (d += 0.4);
      }
      (c.energy < 0.2 || c.food < 0.15) && (d -= 0.35);
    } else
    d =
    0.1 +
    0.6 * (
    n === "chat" ?
    1 - c.social :
    n === "play2" ?
    1 - c.fun :
    (1 - c.social) * 0.6 + (1 - c.comfort) * 0.4) +
    0.3 * h.sociability +
    0.45 * clamp(l.warmth, -1, 1) -
    0.4 * l.annoy,
    n === "groom" && l.warmth < 0.3 && (d -= 0.3);
    d -= r, a < 1 && (d *= 0.6 + 0.4 * a), d = clamp(d, 0.03, 0.95);
    let u = i.rng.chance(d),
      f = wordFor(i, e, u ? "yes" : "no");
    hearWord(i, e, t, u ? "yes" : "no", f),
    e.reply = { word: f, yes: u, t: i.t, to: t.id },
    emote(e, i, a === 0 ? "?" : u ? "ok" : "no", 2.5);
    let p = relation(t, e);
    if (
    n === "help-pod" || n === "help-heavy" ? (
    p.asked++, u && p.helped++, learnQ(i, t, "ask", u ? 0.8 : 0.2)) : (
    p.inv++, u && p.acc++),
    !u)

    return (
      p.warmth = clamp(p.warmth - 0.015, -1, 1),
      p.asked + p.inv > 3 &&
      p.helped + p.acc === 0 &&
      i.rng.chance(0.3) &&
      remember(
        i,
        t,
        "refused",
        `${e.name} never seems to want to help me.`,
        0.45,
        { who: e.id }
      ),
      !1);

    if (n === "help-pod" || n === "help-heavy") {
      let x = s.obj,
        g = (x.t === "pod", i.byId[x.id]);
      if (!g) return !1;
      let b = {
        goal: "help",
        steps: [
        g.ends ?
        { ...walkToStructure(i, g, e.x, e.z, 1.3), why: "help", run: !0 } :
        {
          do: "walk",
          x: g.x,
          z: g.z,
          near: x.t === "pod" ? 0.9 : 1.3,
          why: "help",
          run: !0
        },
        { do: "join", obj: x }],

        i: 0,
        helping: t.id
      };
      e.act &&
      isResumable(e.plan) && (
      e.plan.i = Math.max(0, e.plan.i - 1), e.resume = e.plan),
      setPlan(i, e, b),
      n === "help-pod" &&
      p.asked === 1 &&
      logEvent(
        i,
        1,
        `${t.name} called out and ${e.name} came over to help.`,
        [t.id, e.id],
        t,
        "help"
      );
    }
    return !0;
  }
  var JOINT_DURATIONS = {
    lift: [5, 6],
    heavyj: [80, 120],
    chat: [24, 42],
    play2: [24, 40],
    groom: [28, 42]
  };
  function startJoint(i, t, e, n, s) {
    let r = i.rng,
      [o, a] = JOINT_DURATIONS[e],
      l = r.range(o, a),
      c = i.nextId++,
      h = {
        id: c,
        kind: e,
        members: t.map((p) => p.id),
        lead: s.id,
        obj: n,
        t0: i.t,
        t1: i.t + l,
        done: !1
      };
    e === "chat" && (h.lines = chatLines(i, t, l)), i.joints[c] = h;
    let d = t[t.length - 1],
      u = null,
      f = { x: 0, z: 0 };
    for (let p of t) {
      let x = positionAt(p, i.t);
      f.x += x.x / t.length, f.z += x.z / t.length;
    }
    for (let p of t) {
      let x = t.find((m) => m !== p),
        g = {
          type: e,
          t0: i.t,
          t1: i.t + l,
          x: p.x,
          z: p.z,
          joint: c,
          obj: n,
          lookId: x ? x.id : 0,
          cx: f.x,
          cz: f.z
        };
      if (n && n.t === "pod") {
        let m = i.byId[n.id];
        m && (g.lookX = m.x, g.lookZ = m.z, g.lookId = 0);
      }
      if (n && n.t === "heavy") {
        let m = i.byId[n.id];
        m && (g.lookX = m.x, g.lookZ = m.z, g.lookId = 0);
      }
      if (p === d) {
        u = g;
        continue;
      }
      setPlan(i, p, p.plan, !1), beginAct(i, p, g);
    }
    return u;
  }
  function chatLines(i, t, e) {
    let [n, s] = t,
      r = [],
      o = [];
    for (let h of [n, s]) {
      let d = h.mem.slice(-4).map((u) => u.k);
      (d.includes("fright") || d.includes("wade")) && o.push("creek"),
      (d.includes("built") || d.includes("project")) &&
      o.push(h.home ? "home" : "help"),
      (d.includes("taste") || d.includes("gift")) && o.push("berry"),
      i.weather.rain > 0 && o.push("rain");
    }
    for (let h in n.lex) i.rng.chance(0.25) && o.push(h);
    for (let h in s.lex) i.rng.chance(0.25) && o.push(h);
    for (; o.length < 4;) o.push(i.rng.pick(BASE_CONCEPTS));
    let a = Math.max(2, Math.min(6, Math.floor(e / 6))),
      l = n,
      c = s;
    for (let h = 0; h < a; h++) {
      let d = i.rng.pick(o),
        u = wordFor(i, l, d),
        f = hearWord(i, l, c, d, u);
      r.push({
        dt: +(h * e / a + 0.5).toFixed(1),
        who: l.id,
        word: u,
        ok: f,
        concept: d
      }),
      [l, c] = [c, l];
    }
    return r;
  }
  function endJoint(i, t, e) {
    let n = i.joints[e.joint];
    if (!n) return !1;
    if (n.done)
    return (
      n.ended = (n.ended || 0) + 1,
      n.ended >= n.members.length && delete i.joints[n.id],
      !1);

    n.done = !0, n.ended = 1;
    let s = n.members.map((o) => i.byId[o]).filter(Boolean),
      r = !1;
    switch (n.kind) {
      case "lift":
        finishLift(i, n, s);
        break;
      case "heavyj":
        r = finishHeavy(i, n, s);
        break;
      case "chat":
        finishChat(i, n, s);
        break;
      case "play2":
        finishPlay(i, n, s);
        break;
      case "groom":
        finishGroom(i, n, s);
        break;
    }
    return (n.ended >= n.members.length || r) && delete i.joints[n.id], r;
  }
  function recentGesture(i, t, e) {
    return t.lastGesture &&
    i.t - t.lastGesture.t < 120 &&
    t.lastGesture.task === e ?
    t.lastGesture.g :
    null;
  }
  function finishPlans(i) {
    for (let t of i) t.plan && (t.plan.i = t.plan.steps.length);
  }
  function finishLift(i, t, e) {
    let n = i.byId[t.obj.id],
      s = i.byId[t.lead] || e[0];
    if (finishPlans(e), !n) return;
    let o = e.reduce((f, p) => f + p.strength, 0) >= n.weight,
      a = e.length;
    for (let f of e) updateRituals(i, f, "lift", recentGesture(i, f, "lift"), o);
    if (!o) {
      for (let f of e)
      learnQ(i, f, a >= 3 ? "pod|trio" : "pod|duo", 0.25),
      feel(f, i, "frustration", 0.35),
      emote(f, i, "sweat", 2.5);
      if (
      n.need = Math.max(n.need || 2, a + 1),
      i.stats.podFails = (i.stats.podFails || 0) + 1,
      n.failLogged ||
      logEvent(
        i,
        i.stats.podFails === 1 ? 3 : 1,
        `${nameList(
          i,
          e.map((f) => f.id)
        )} strained at a pod together, but it was too heavy even for ${a === 2 ? "two" : "all of them"}.`,
        e.map((f) => f.id),
        n,
        "pod"
      ),
      n.failLogged = !0,
      beSeen(i, s, {
        x: n.x,
        z: n.z,
        key: "pod|duo",
        r: 0.3,
        exclude: e.map((f) => f.id)
      }),
      a < 4 && s.temp.persistence > 0.35)
      {
        s.plan = {
          goal: "pod",
          pid: n.id,
          i: 0,
          steps: [
          {
            do: "seek",
            obj: { t: "pod", id: n.id },
            excl: e.map((f) => f.id)
          }]

        };
        for (let f of e)
        f !== s && (
        f.plan = {
          goal: "help",
          i: 0,
          steps: [{ do: "wait", obj: { t: "pod", id: n.id }, dur: 55 }]
        });
      }
      return;
    }
    removeThing(i, n, i.pods);
    let l = 5 + Math.round(n.weight * 4),
      c = l / a,
      h = l,
      d = {};
    for (let f of e) {
      if (f === s) continue;
      let p = relation(s, f).warmth,
        x = clamp(
          Math.round(c * (0.45 + 0.75 * s.temp.generosity + 0.25 * p)),
          1,
          Math.ceil(c * 1.4)
        );
      d[f.id] = x, h -= x;
    }
    d[s.id] = Math.max(1, h);
    for (let f of e) {
      let p = d[f.id],
        x = pouchAdd(f, "seeds", p);
      if (
      p - x > 0 &&
      dropItem(
        i,
        "seeds",
        n.x + i.rng.range(-0.6, 0.6),
        n.z + i.rng.range(-0.6, 0.6),
        p - x
      ),
      f.counts.pods++,
      learnQ(i, f, a >= 3 ? "pod|trio" : "pod|duo", 0.92),
      learnQ(i, f, "pod|solo", 0.15, "self", 0.6),
      feel(f, i, "joy", 0.5),
      emote(f, i, "happy", 3),
      f !== s)
      {
        let g = relation(f, s),
          m = p >= c * 0.8;
        m ? (
        g.gotShare++, warmTo(f, s, 0.06)) : (
        g.gotLittle++,
        g.warmth = clamp(g.warmth - 0.05, -1, 1),
        g.annoy = clamp(g.annoy + 0.12, 0, 1),
        emote(f, i, "grumble", 3)),
        learnQ(i, f, "help|pod", clamp(0.25 + 0.7 * p / c, 0, 1)),
        f.counts.helps++;
        let b = relation(s, f);
        warmTo(s, f, 0.05),
        b.fam = Math.min(1, b.fam + 0.05),
        g.fam = Math.min(1, g.fam + 0.05),
        remember(
          i,
          f,
          "help",
          m ?
          `I helped ${s.name} lift a pod and got a fair share of seeds.` :
          `I helped ${s.name} lift a pod, but ${s.name} kept most of the seeds.`,
          m ? 0.4 : 0.6,
          { who: s.id, x: n.x, z: n.z }
        ),
        m ||
        logEvent(
          i,
          2,
          `${s.name} kept most of the seeds. ${f.name} didn't look pleased.`,
          [s.id, f.id],
          n,
          "share"
        );
      }
    }
    s.counts.helped = (s.counts.helped || 0) + a - 1,
    remember(
      i,
      s,
      "pod",
      `${nameList(
        i,
        e.filter((f) => f !== s).map((f) => f.id)
      )} helped me open a seed pod.`,
      0.5,
      { x: n.x, z: n.z, pv: 0.25 }
    ),
    i.stats.pods = (i.stats.pods || 0) + 1;
    let u = i.stats.pods === 1;
    logEvent(
      i,
      u ? 3 : 1,
      u ?
      `${nameList(
        i,
        e.map((f) => f.id)
      )} lifted a seed pod together and cracked it open. ${l} seeds!` :
      `${nameList(
        i,
        e.map((f) => f.id)
      )} opened a seed pod together.`,
      e.map((f) => f.id),
      n,
      "pod"
    ),
    beSeen(i, s, {
      x: n.x,
      z: n.z,
      key: a >= 3 ? "pod|trio" : "pod|duo",
      r: 0.9,
      task: "lift",
      gesture: recentGesture(i, s, "lift"),
      loud: !0,
      exclude: e.map((f) => f.id),
      text: `I saw ${nameList(
        i,
        e.map((f) => f.id)
      )} open a pod together.`,
      sal: 0.4,
      onSee: (f) => {
        qValue(f, "pod|solo") > 0.4 && (
        f.Q["pod|solo"] = f.Q["pod|solo"] || {
          v: 0.6,
          n: 0,
          src: "obs:" + s.id,
          t: i.t
        },
        f.Q["pod|solo"].v = Math.min(f.Q["pod|solo"].v, 0.42));
      }
    });
  }
  function finishHeavy(i, t, e) {
    let n = i.byId[t.obj.id];
    if (finishPlans(e), !n || !n.building) return !1;
    let s = t.t1 - t.t0;
    for (let h of e) {
      let d = workSpeed(h);
      n.building.labor += s * d,
      n.contrib[h.id] = (n.contrib[h.id] || 0) + s,
      h.counts.labor += s,
      h.counts.heavy = (h.counts.heavy || 0) + 1,
      h.needs.social = clamp(h.needs.social + 0.05, 0, 1),
      learnQ(i, h, "heavy|duo", 0.85),
      updateRituals(i, h, "heavy", recentGesture(i, h, "heavy"), !0);
      for (let u of e)
      if (u !== h) {
        let f = warmTo(h, u, 0.025);
        f.fam = Math.min(1, f.fam + 0.03);
      }
      h.id !== n.owner && n.owner ?
      learnQ(i, h, "help|heavy", 0.6 + 0.2 * clamp(relation(h, n.owner).warmth, 0, 1)) :
      learnQ(i, h, "help|heavy", 0.7);
    }
    if (
    i.stats.heavy = (i.stats.heavy || 0) + 1,
    i.stats.heavy === 1 &&
    logEvent(
      i,
      3,
      `${nameList(
        i,
        e.map((h) => h.id)
      )} worked out that heavy building goes better together.`,
      e.map((h) => h.id),
      n,
      "heavy"
    ),
    currentStage(n) && n.building.labor >= stageLaborNeeded(n))

    return stageDone(i, n), !1;
    if (
    !e.every(
      (h) =>
      h.needs.energy > 0.2 &&
      h.needs.food > 0.2 &&
      h.workFatigue < 0.85 &&
      !h.asleep &&
      i.rng.chance(0.45 + 0.4 * h.temp.persistence - 0.4 * h.workFatigue)
    ) ||
    i.weather.rain > 1)

    return !1;
    let a = i.byId[t.lead] || e[0],
      l = e[e.length - 1],
      c = startJoint(i, e, "heavyj", t.obj, a);
    return beginAct(i, l, c), !0;
  }
  function finishChat(i, t, e) {
    finishPlans(e);
    let [n, s] = e;
    if (!n || !s) return;
    for (let [o, a] of [
    [n, s],
    [s, n]])
    {
      o.needs.social = clamp(o.needs.social + 0.28, 0, 1),
      o.needs.fun = clamp(o.needs.fun + 0.05, 0, 1),
      o.counts.chats++;
      let l = relation(o, a),
        c =
        1 -
        (Math.abs(o.temp.curiosity - a.temp.curiosity) +
        Math.abs(o.temp.sociability - a.temp.sociability) +
        Math.abs(o.temp.caution - a.temp.caution)) /
        3;
      warmTo(o, a, 0.015 + 0.03 * c - 0.03 * l.annoy),
      l.fam = Math.min(1, l.fam + 0.06),
      l.annoy = Math.max(0, l.annoy - 0.05),
      l.lastT = i.t,
      o.desire.meeting += 0.02 * o.temp.sociability,
      shareNews(i, o, a),
      tellStory(i, o, a), // MINDS: stories, retold (src/sim/minds.js)
      giftChat(i, o, a); // MINDS: beliefs about the gift (src/sim/gift.js)
    }
    (t.lines || []).filter((o) => !o.ok).length >= 3 &&
    i.rng.chance(0.3) &&
    logEvent(
      i,
      1,
      `${n.name} and ${s.name} had a long chat, though they didn't understand half of each other's words.`,
      [n.id, s.id],
      n,
      "chat"
    );
  }
  function shareNews(i, t, e) {
    let n = null,
      s = 2;
    for (let r in t.seen) {
      let o = i.byId[r];
      if (!o || o.kind !== "bush" && o.kind !== "orchard") continue;
      let a = t.seen[r];
      a.a > s && !e.seen[r] && !a.src && (s = a.a, n = o);
    }
    n &&
    i.rng.chance(0.5) && (
    e.seen[n.id] = { a: t.seen[n.id].a, t: i.t, src: t.id },
    i.rng.chance(0.3) &&
    remember(
      i,
      e,
      "rumor",
      `${t.name} told me about ${n.food === "bluberry" ? "blue berries" : "berries"} ${n.side === 1 ? "across the creek" : "nearby"}.`,
      0.3,
      { who: t.id }
    ));
    for (let r of ["mud", "planting", "clay", "glowcap", "tools", "downstream"]) // CREEK: and how to build dams from the bottom up
    if (
    t.know[r] &&
    !e.know[r] &&
    i.rng.chance((0.12 + 0.2 * e.temp.curiosity) * teachFactor(t, e))) // LIFE: elders teach
    {
      let o = {
        mud: `${t.name} explained to ${e.name} how mud dries hard.`,
        planting: `${t.name} told ${e.name} that seeds grow into plants.`,
        clay: `${t.name} told ${e.name} about the clay across the creek.`,
        glowcap: `${t.name} told ${e.name} about the mushrooms that glow at night.`,
        tools: `${t.name} showed ${e.name} how to use tools.`,
        downstream: `${t.name} explained to ${e.name} why dams have to be built from the bottom of the creek up.`
      }[r];
      discover(i, e, r, o, 1);
      break;
    }
  }
  function finishPlay(i, t, e) {
    finishPlans(e);
    for (let n of e) {
      n.needs.fun = clamp(n.needs.fun + 0.3, 0, 1),
      n.needs.social = clamp(n.needs.social + 0.15, 0, 1),
      n.needs.energy = clamp(n.needs.energy - 0.03, 0, 1);
      for (let s of e)
      if (s !== n) {
        let r = warmTo(n, s, 0.04);
        r.fam = Math.min(1, r.fam + 0.05);
      }
      feel(n, i, "joy", 0.5);
    }
    i.rng.chance(0.15) &&
    logEvent(
      i,
      1,
      `${nameList(
        i,
        e.map((n) => n.id)
      )} chased each other around in circles.`,
      e.map((n) => n.id),
      e[0],
      "play"
    );
  }
  function finishGroom(i, t, e) {
    finishPlans(e);
    for (let n of e) {
      n.needs.comfort = clamp(n.needs.comfort + 0.15, 0, 1),
      n.needs.social = clamp(n.needs.social + 0.22, 0, 1);
      for (let s of e)
      if (s !== n) {
        let r = warmTo(n, s, 0.05);
        r.fam = Math.min(1, r.fam + 0.06);
      }
      feel(n, i, "warmth", 0.5);
    }
  }
  var POND_SHAPE = {
      len: [0, 4.5, 7.5, 8.5],
      rise: [0, 0.13, 0.3, 0.32],
      spread: [0, 2.6, 4.6, 6.8],
      tol: [0, 0.35, 0.45, 0.55]
    },
    HYDRO_EVERY = 10,
    HYDRO_DT = HYDRO_EVERY * 60;
  // CREEK: ponds, marsh and drying now come from the creek model (src/sim/creek.js).
  // What is left here reads its results: marsh per cell, the milestones the valley
  // notices, and what the creekfolk can see of each dam.
  function wetAt(i, t, e) {
    let n = Math.floor(t),
      s = Math.floor(e);
    return n < 0 || s < 0 || n >= VW || s >= VL || !i.wet ?
    0 :
    i.wet[s * VW + n];
  }
  function wetNear(i, t, e, n = 1.5) {
    let s = 0;
    for (let r = -n; r <= n; r += 1)
    for (let o = -n; o <= n; o += 1) s = Math.max(s, wetAt(i, t + o, e + r));
    return s;
  }
  // Ground that is wet now, or valley floor that will turn to wetland as the creek heals.
  function wetPotential(i, t, e) {
    return Math.max(wetAt(i, t, e), 0.8 * i.terrain.floorWeight(t, e));
  }
  // How well the ground here is fed by water from below (0 dry .. 1 wet): gardens
  // near a pond or a healed creek stay damp through the dry season.
  function seepAt(i, t, e) {
    if (!i.wt) return 0;
    let n = clamp(Math.floor(t), 0, VW - 1),
      s = clamp(Math.floor(e), 0, VL - 1),
      dw = i.terrain.heightAt(t, e) - i.wt[s * VW + n];
    return clamp(1 - (dw - 0.25) / 0.7, 0, 1);
  }
  function placeSnag(i) {
    let t = i.terrain,
      e = new Rng(i.seed + ":snag");
    for (let n = 0; n < 80; n++) {
      let s = e.range(24, VL - 24),
        r = t.creekX(s);
      if (
      t.valleyR(r, s) > 0.72 ||
      i.structures.some(
        (l) =>
        (l.kind === "crossing" || l.kind === "dam") &&
        Math.abs(l.z - s) < 5
      ))

      continue;
      let o = e.range(-0.35, 0.35),
        a = {
          id: i.nextId++,
          kind: "snag",
          x: +(r + o).toFixed(2),
          z: +s.toFixed(2),
          side: t.side(r + o, s),
          rot: +e.range(-0.5, 0.5).toFixed(2)
        };
      return i.byId[a.id] = a, i.res.push(a), a;
    }
    return null;
  }
  function updateHydro(i) {
    let t = i.hydro || (i.hydro = newHydro());
    if (i.tick % HYDRO_EVERY !== 3 || !i.creek) return;
    creekHydro(i);
    damPonds(i);
    spreadWetland(i, t);
  }
  function newHydro() {
    return {
      marsh: 0,
      damp: 0,
      best: 0,
      cx: 0,
      cz: 0,
      frogs: !1,
      flies: !1,
      reeds: 0,
      notes: {}
    };
  }
  // What each dam's pond looks like to the creekfolk, and what they can notice.
  function damPonds(i) {
    let cr = i.creek;
    creekSyncDams(i);
    for (let n of i.structures) {
      if (n.kind !== "dam" || !(n.level > 0)) continue;
      let d = cr.dams[n.id];
      if (!d) {
        creekSyncDams(i);
        d = cr.dams[n.id];
        if (!d) continue;
      }
      let node = cr.nodes[d.i],
        depth = d.pl - node.bed;
      n.pond = +clamp(depth / 0.35, 0, 1).toFixed(3);
      n.leaks = d.hold ? 0 : 1;
      if (n.pond > (n.level === 1 ? 0.6 : 0.85) && (n.pondLv || 0) < n.level && n.level <= 2) {
        n.pondLv = n.level;
        n.level === 1 ?
        logEvent(i, 2, "Water has backed up behind the weir into a quiet little pool.", [], n, "wetland") :
        logEvent(i, 2, "The pond behind the dam has filled, wide and still.", [], n, "wetland");
      }
      // silted up: the bed behind it has risen almost to the crest
      let behind = cr.nodes[Math.max(0, d.i - 1)];
      n.silted = behind.bed >= d.crest - CREEK.siltGap && d.crest < node.fp + CREEK.raiseAbove ? 1 : 0;
      // a silted dam that can't go higher until the water below it rises asks the dam
      // below to be built up too, so a series climbs from the bottom up
      if (n.silted && !creekSafeToRaise(i, n, CREEK.raiseStep)) {
        let below = null;
        for (let k = d.i + 1; k <= Math.min(cr.nodes.length - 1, d.i + 8) && !below; k++) below = cr._damAt[k];
        let bs = below && i.byId[below.id];
        if (bs && below.crest < cr.nodes[below.i].fp + CREEK.raiseAbove) bs.needUp = 1;
      }
      if ((n.silted || n.needUp) && !n.building && !n.raise && (n.cond ?? 1) > 0.55 && i.t - (n.raiseAskT || 0) > 2 * VALLEY_DAY) {
        n.needUp = 0;
        n.cond = 0.55;
        n.raise = 1;
        n.raiseAskT = Math.round(i.t);
        if (!n.siltNoted && n.silted) {
          n.siltNoted = 1;
          logEvent(i, 1, `The pond behind the ${builtLevelDef(n).label} has filled with silt; it needs building up.`, [], n, "wetland");
        }
      }
      damLeakNotice(i, n, d);
    }
  }
  // A dam that can't hold its pond because the water below is too far down: someone
  // nearby notices, and an elder who knows dams may work out why.
  function damLeakNotice(i, n, d) {
    if (d.hold || n.building) return;
    // looked at once a valley day, by whoever is close by
    let day = Math.floor(i.t / VALLEY_DAY);
    if (n.leakDay === day) return;
    for (let t of i.creatures) {
      if (t.asleep || t.visitor) continue;
      if ((t.x - n.x) ** 2 + (t.z - n.z) ** 2 > 64) continue;
      n.leakDay = day;
      if (!n.leakSeen) {
        n.leakSeen = 1;
        logEvent(i, 2, `${t.name} noticed that the pond behind the ${builtLevelDef(n).label} won't fill: the water slips out underneath it.`, [t.id], n, "wetland");
        remember(i, t, "nature", "The pond behind the high dam won't fill. The water slips out underneath.", 0.6);
        i.stats.leakSeen = (i.stats.leakSeen || 0) + 1;
      }
      t.counts.leakSeen = (t.counts.leakSeen || 0) + 1;
      if (
      !t.know.downstream &&
      t.know.dams &&
      t.counts.leakSeen > 2 &&
      stageOf(i, t) !== "child" &&
      i.rng.chance((stageOf(i, t) === "elder" ? 0.08 : 0.006) * (0.5 + t.temp.curiosity)))
      {
        discover(i, t, "downstream", `${t.name} worked out why the high dam won't hold: the water falls too far on its low side and digs under it. A dam lower down, holding water against its foot, would let it fill.`, 3);
      }
    }
  }
  // Marsh across the valley floor, and the milestones the valley notices as it grows.
  function spreadWetland(i, t) {
    let n = i.terrain,
      s = i.wet,
      c0 = creekCells(i),
      l = 0,
      c = 0,
      h = 0,
      d = 0,
      u = [];
    for (let x = 0; x < s.length; x++) {
      if (!c0.floor[x] && c0.d[x] > 6 || c0.d[x] <= 0) continue; // the floor beside the creek, not the creek itself
      let b = s[x];
      b > 0.5 ? (
      l++,
      h += x % VW,
      d += Math.floor(x / VW),
      b > 0.62 && u.push(x)) :
      b > 0.25 && c++;
    }
    t.marsh = l,
    t.damp = c,
    l && (
    t.cx = +(h / l + 0.5).toFixed(2),
    t.cz = +(d / l + 0.5).toFixed(2));
    let f = { x: t.cx, z: t.cz },
      p = t.notes;
    if (
    c + l >= 5 &&
    !p.damp &&
    i.structures.some((x) => x.kind === "dam" && x.level > 0))
    {
      p.damp = 1;
      let x = i.structures.find((g) => g.kind === "dam" && g.level > 0);
      logEvent(
        i,
        2,
        "The ground beside the new pond has turned soft and damp.",
        [],
        x,
        "wetland"
      );
    }
    if (
    l >= 12 &&
    !p.marsh && (
    p.marsh = 1,
    logEvent(
      i,
      3,
      "A little marsh is forming by the pond: sedges, puddles and soft black mud.",
      [],
      f,
      "wetland"
    )),
    l >= 10 &&
    !t.flies && (
    t.flies = !0,
    logEvent(
      i,
      1,
      "Dragonflies have started hunting over the pond.",
      [],
      f,
      "wetland"
    )),
    l >= 18 && !t.frogs)
    {
      t.frogs = !0,
      logEvent(
        i,
        2,
        "Frogs have found the new marsh. The evenings are full of croaking.",
        [],
        f,
        "wetland"
      );
      storyFrogs(i, f); // MINDS
      let x = null,
        g = 1e9;
      for (let m of i.creatures) {
        if (m.asleep) continue;
        let b = (m.x - f.x) ** 2 + (m.z - f.z) ** 2;
        b < g && (g = b, x = m);
      }
      x && !x.lex.frog && (x.lex.frog = { [frogWord(i)]: 1 });
    }
    if (
    l >= 60 &&
    !p.wide && (
    p.wide = 1,
    logEvent(
      i,
      2,
      "The marsh keeps spreading along the creek. Rushes and reeds are moving in.",
      [],
      f,
      "wetland"
    )),
    l >= 240 &&
    !p.wetland && (
    p.wetland = 1,
    logEvent(
      i,
      3,
      "The low ground along the creek has become a real wetland.",
      [],
      f,
      "wetland"
    )),
    l >= 0.5 * c0.nFloor &&
    !p.floor && (
    p.floor = 1,
    logEvent(
      i,
      3,
      "Half the valley floor is marsh now: channels, ponds and reeds from one side to the other.",
      [],
      f,
      "wetland"
    )),
    t.best = Math.max(t.best || 0, l),
    u.length >= 8 && t.reeds < 6 + Math.floor(l / 60) && i.rng.chance(1 / 18))
    {
      let x = u[i.rng.int(0, u.length - 1)],
        g = x % VW + 0.5,
        m = Math.floor(x / VW) + 0.5;
      if (
      n.walkable(g, m) &&
      !i.res.some(
        (T) =>
        (T.x - g) ** 2 + (T.z - m) ** 2 <
        (T.kind === "reeds" ? 2.4 : 1.2) ** 2
      ) &&
      !i.structures.some(
        (T) =>
        T.kind !== "dam" &&
        (T.x - g) ** 2 + (T.z - m) ** 2 < (STRUCTURES[T.kind].radius + 0.6) ** 2
      ))
      {
        let T = {
          id: i.nextId++,
          kind: "reeds",
          x: g,
          z: m,
          side: n.side(g, m),
          amt: 2,
          max: 7,
          marsh: !0
        };
        i.byId[T.id] = T,
        i.res.push(T),
        t.reeds++,
        t.reeds === 1 &&
        logEvent(
          i,
          2,
          "Reeds have started spreading into the marsh.",
          [],
          T,
          "wetland"
        );
      }
    }
  }
  function frogWord(i) {
    let t = ["kr", "gr", "br", "r", "kw"],
      e = ["oo", "ee", "i", "o", "ai"];
    return (
      i.rng.pick(t) +
      i.rng.pick(e) +
      i.rng.pick(["k", "p", "b", "mp", ""]) +
      i.rng.pick(e.slice(1, 3)));

  }
  function damDescription(i, t) {
    let e = [],
      n = t.pond || 0,
      d = i.creek && i.creek.dams[t.id];
    if (
    t.level > 0 ?
    t.leaks ?
    e.push("Water slips out underneath it, so the pond barely fills. The water below it is too far down.") :
    n < 0.15 ?
    e.push(t.silted ? "Silt has filled the pond behind it almost to the top." : "Hardly any water stands behind it now.") :
    n < 0.6 ?
    e.push(
      t.level >= 2 ?
      "The pond behind it is low." :
      "A small pool sits behind it."
    ) :
    e.push(
      t.level >= 2 ?
      "A wide, still pond sits behind it." :
      "A quiet pool sits behind it."
    ) :
    e.push("Once it’s built, water will back up behind it."),
    t.level > 0 &&
    (t.cond ?? 1) < 0.5 &&
    e.push(t.raise ? "It needs building up a hand higher." : "It’s leaking — it needs mending."),
    t.level > 0 && d)
    {
      let s = 0,
        r = 0,
        c0 = creekCells(i);
      for (let k = 0; k < CELLS; k++) {
        if (Math.abs(c0.node[k] - d.i) > 10 || c0.node[k] > d.i + 1) continue;
        let c = i.wet[k];
        c > 0.5 ? s++ : c > 0.25 && r++;
      }
      s >= 30 ?
      e.push(
        "A marsh full of reeds, frogs and dragonflies has grown up around it."
      ) :
      s >= 8 ?
      e.push("The ground around it has turned marshy.") :
      s + r >= 4 ?
      e.push("The banks are turning damp and green.") :
      e.push(
        "The ground nearby is still dry; it takes days to soak in."
      );
    }
    return e.join(" ");
  }
  var WEATHER = { storm: 0.2 }; // CREEK: chance a heavy rain turns to a storm, times the season's wetness squared
  function greenFactor(i, t, e) {
    if (!i.green) return 1;
    let n = clamp(Math.floor(t), 0, VW - 1),
      s = clamp(Math.floor(e), 0, VL - 1);
    return 0.45 + 0.55 * i.green[s * VW + n];
  }
  var WALK_SPEED = 1.15,
    WORK_ACTS = new Set([
    "pick",
    "dig",
    "labor",
    "heavyj",
    "deposit",
    "shape",
    "craft",
    "tend",
    "sow",
    "harvest",
    "plant",
    "take",
    "stash"]
    ),
    UNINTERRUPTIBLE = new Set([
    "lift",
    "heavyj",
    "chat",
    "play2",
    "groom",
    "sleep",
    "mark",
    "crack"]
    );
  function walkSpeed(i) {
    let t = WALK_SPEED * (0.85 + 0.3 * i.temp.activity) * stageSpeed(i); // LIFE: pace by stage
    return (
      i.carry && HEAVY_MATERIALS[i.carry.k] && (t *= 0.82),
      i.needs.energy < 0.2 && (t *= 0.82),
      t);

  }
  var makeAct = (i, t, e, n, s = {}) => ({
    type: e,
    t0: i.t,
    t1: i.t + Math.max(0.25, n),
    x: t.x,
    z: t.z,
    ...s
  });
  function pathWear(i, t, e, n, s) {
    let r = dist2d(t, e, n, s);
    if (r < 0.5) return 0;
    let o = Math.ceil(r),
      a = 0;
    for (let l = 0; l <= o; l++) {
      let c = Math.floor(t + (n - t) * l / o),
        h = Math.floor(e + (s - e) * l / o);
      a += i.wear[clamp(h, 0, VL - 1) * VW + clamp(c, 0, VW - 1)];
    }
    return a / (o + 1);
  }
  function wearPath(i, t, e, n, s) {
    let r = dist2d(t, e, n, s),
      o = Math.ceil(r);
    for (let a = 0; a <= o; a++) {
      let l = Math.floor(t + (n - t) * a / o),
        c = Math.floor(e + (s - e) * a / o);
      if (i.terrain.isWater(l + 0.5, c + 0.5)) continue;
      let h = clamp(c, 0, VL - 1) * VW + clamp(l, 0, VW - 1);
      i.wear[h] = Math.min(60, i.wear[h] + 0.3);
    }
  }
  function wadeCost(i, t) {
    let e = qValue(t, "wade");
    return (
      10 +
      90 * t.fearWater * (0.5 + t.temp.caution) +
      (1 - e) * 25 + (
      i.weather.rain > 0 ? 15 * i.weather.rain : 0) + (
      t.carry && HEAVY_MATERIALS[t.carry.k] ? 10 : 0));

  }
  function travelCost(i, t, e, n, s, r) {
    let o = i.terrain,
      a = dist2d(e, n, s, r) / (WALK_SPEED * (0.85 + 0.3 * t.temp.activity) * stageSpeed(t)); // LIFE
    if (o.side(e, n) !== o.side(s, r)) {
      let l = wadeCost(i, t) + 6;
      for (let c of crossingsList(i)) {
        let h = c.s,
          d = dist2d(e, n, h.x, h.z) + dist2d(h.x, h.z, s, r) - dist2d(e, n, s, r);
        l = Math.min(l, d / WALK_SPEED);
      }
      a += l;
    }
    return a;
  }
  function obstacles(i) {
    let t = [];
    for (let e of i.structures) {
      if (e.kind === "crossing" || e.kind === "garden" || e.kind === "dam")
      continue;
      (e.kind === "home" ?
      e.level >= 3 ||
      e.building && e.building.level === 2 && e.building.stage >= 1 :
      e.kind === "store" || e.kind === "workshop" ?
      e.level >= 3 :
      e.kind === "meeting" ?
      e.level >= 4 :
      e.kind === "lookout" && e.level >= 1) &&
      t.push({
        x: e.x,
        z: e.z,
        r:
        e.kind === "home" ?
        1.05 :
        e.kind === "meeting" ?
        2.7 :
        STRUCTURES[e.kind].radius * 0.75,
        s: e
      });
    }
    for (let e of i.res)
    e.kind === "tree" || e.kind === "podtree" ?
    t.push({ x: e.x, z: e.z, r: 0.4 }) :
    e.kind === "boulder" ?
    t.push({ x: e.x, z: e.z, r: 0.75 * (e.size || 1) }) :
    e.kind === "log" && t.push({ x: e.x, z: e.z, r: 0.55 });
    return t;
  }
  function detour(i, t, e, n, s, r) {
    if (r > 3) return [];
    let o = n - t,
      a = s - e,
      l = o * o + a * a;
    if (l < 0.01) return [];
    let c = null,
      h = 2;
    for (let m of i.__obs || obstacles(i)) {
      let b = m.r + 0.15;
      if (
      (t - m.x) ** 2 + (e - m.z) ** 2 < b * b ||
      (n - m.x) ** 2 + (s - m.z) ** 2 < b * b)

      continue;
      let T = clamp(((m.x - t) * o + (m.z - e) * a) / l, 0, 1),
        y = t + o * T,
        S = e + a * T;
      (y - m.x) ** 2 + (S - m.z) ** 2 < m.r * m.r &&
      T < h && (
      h = T, c = { ob: m, px: y, pz: S });
    }
    if (!c) return [];
    let d = c.px - c.ob.x,
      u = c.pz - c.ob.z,
      f = Math.hypot(d, u);
    f < 0.001 && (d = -a, u = o, f = Math.hypot(d, u));
    let p = c.ob.r + 0.45,
      x = c.ob.x + d / f * p,
      g = c.ob.z + u / f * p;
    return i.terrain.walkable(x, g) ?
    [...detour(i, t, e, x, g, r + 1), [x, g, 0], ...detour(i, x, g, n, s, r + 1)] :
    [];
  }
  function doorPoint(i, t, e) {
    for (let n of i.structures)
    if (
    !(n.kind !== "home" || n.level < 3) &&
    (t - n.x) ** 2 + (e - n.z) ** 2 < 1)
    {
      let s = n.rot || 0;
      return [n.x + Math.sin(s) * 1.35, n.z + Math.cos(s) * 1.35];
    }
    return null;
  }
  function routeAround(i, t) {
    i.__obs = obstacles(i);
    let e = [t[0]];
    for (let n = 1; n < t.length; n++) {
      let s = e[e.length - 1],
        r = t[n];
      if (s[2] === 0 || s[2] === void 0)
      for (let o of detour(i, s[0], s[1], r[0], r[1], 0)) e.push(o);
      e.push(r);
    }
    return i.__obs = null, e;
  }
  function planRoute(i, t, e, n, s, r) {
    let o = i.terrain,
      a = walkSpeed(t),
      l = (R, P, N, B) => a * (1 + 0.18 * Math.min(1, pathWear(i, R, P, N, B) / 6)),
      c = (R, P = 1) => {
        let N = [{ x: R[0][0], z: R[0][1], t: i.t }],
          B = i.t,
          D = null,
          I = null;
        for (let H = 1; H < R.length; H++) {
          let [X, nt, Y] = R[H - 1],
            [K, et] = R[H],
            Dt = dist2d(X, nt, K, et),
            Lt = Y === 1 ? a * 0.42 : Y === 2 ? a * P : l(X, nt, K, et);
          Y === 1 && (D = [X, nt], I = [K, et]),
          B += Dt / Math.max(0.1, Lt),
          N.push({ x: K, z: et, t: B });
        }
        return {
          path: N,
          time: B - i.t,
          wadeMid: D ? { x: (D[0] + I[0]) / 2, z: (D[1] + I[1]) / 2 } : null
        };
      },
      h = [[e, n, 0]],
      d = [],
      u = doorPoint(i, e, n),
      f = doorPoint(i, s, r);
    u && h.push([u[0], u[1], 0]),
    f && d.push([f[0], f[1], 0]),
    d.push([s, r, 0]);
    let p = h[h.length - 1][0],
      x = h[h.length - 1][1],
      g = d[0][0],
      m = d[0][1],
      b = o.waterSpan(p, x, g, m);
    if (!b) return { ...c(routeAround(i, [...h, ...d])), wade: !1, cross: null };
    let T = p + (g - p) * b[0],
      y = x + (m - x) * b[0],
      S = p + (g - p) * b[1],
      M = x + (m - x) * b[1],
      A = [...routeAround(i, [...h, [T, y, 1]]), ...routeAround(i, [[S, M, 0], ...d])],
      v = { ...c(A), wade: !0, cross: null };
    v.score = v.time + wadeCost(i, t);
    let E = o.side(p, x);
    for (let R of crossingsList(i)) {
      let P = R.s;
      if (o.side(g, m) === E) continue;
      let N = P.ends[E],
        B = P.ends[1 - E],
        D = [...routeAround(i, [...h, [N.x, N.z, 2]]), ...routeAround(i, [[B.x, B.z, 0], ...d])],
        I = c(D, R.speed);
      I.time < v.score && (v = { ...I, wade: !1, cross: P.id, score: I.time });
    }
    return v;
  }
  function arrive(i, t, e) {
    let n = e.path,
      s = n[n.length - 1];
    t.x = s.x, t.z = s.z;
    for (let r = 1; r < n.length; r++)
    wearPath(i, n[r - 1].x, n[r - 1].z, n[r].x, n[r].z);
    if (n.length >= 2) {
      let r = n[n.length - 2];
      dist2d(r.x, r.z, s.x, s.z) > 0.05 && (
      t.face = Math.atan2(s.x - r.x, s.z - r.z));
    }
    if (e.cross) {
      let r = i.byId[e.cross];
      r && (
      r.uses = (r.uses || 0) + 1,
      t.counts.crossings = (t.counts.crossings || 0) + 1,
      t.fearWater > 0.4 &&
      t.counts.crossings % 6 === 0 && (
      t.fearWater = Math.max(0.1, t.fearWater - 0.03)),
      r.uses === 1 && (
      r.kind === "dam" ?
      logEvent(
        i,
        2,
        `${t.name} was the first to tiptoe across the creek along the top of the dam.`,
        [t.id],
        r,
        "cross"
      ) :
      logEvent(
        i,
        2,
        `${t.name} was the first to cross by the new ${r.level >= 2 ? "footbridge" : "stepping stones"}.`,
        [t.id],
        r,
        "cross"
      )));
    }
    e.wade && wadeCreek(i, t, e);
  }
  function wadeCreek(i, t, e) {
    let n = i.rng,
      s = e.path,
      r = e.wadeMid || { x: (s[1].x + s[2].x) / 2, z: (s[1].z + s[2].z) / 2 };
    t.counts.wades++,
    i.stats.wades = (i.stats.wades || 0) + 1,
    i.wades.push({ x: +r.x.toFixed(2), z: +r.z.toFixed(2), t: i.t }),
    i.wades.length > 40 && i.wades.shift(),
    t.wet = 1,
    t.needs.comfort = Math.max(0, t.needs.comfort - 0.12);
    let o = t.carry && HEAVY_MATERIALS[t.carry.k],
      a =
      0.035 + 0.07 * i.weather.rain + (o ? 0.06 : 0) - 0.02 * t.temp.activity;
    if (t.desire.crossing += 0.07 * (0.6 + t.fearWater), n.chance(a)) {
      t.counts.slips++,
      i.stats.slips = (i.stats.slips || 0) + 1,
      t.fearWater = clamp(t.fearWater + 0.18, 0, 1),
      t.fearPeak = Math.max(t.fearPeak || 0, t.fearWater),
      t.needs.comfort = Math.max(0, t.needs.comfort - 0.15),
      t.desire.crossing += 0.35,
      feel(t, i, "fright", 0.9),
      emote(t, i, "splash", 4);
      let l = "";
      t.carry && (
      l = ` and lost the ${MATERIAL_LABELS[t.carry.k] || t.carry.k} downstream`,
      t.carry = null),
      learnQ(i, t, "wade", 0.05),
      remember(
        i,
        t,
        "fright",
        "I slipped in the creek and went under for a moment.",
        0.85,
        { x: r.x, z: r.z, pv: -0.5 }
      ),
      logEvent(
        i,
        2,
        `${t.name} slipped while wading the creek${l}, and scrambled out soaked.`,
        [t.id],
        r,
        "slip"
      ),
      beSeen(i, t, {
        x: r.x,
        z: r.z,
        key: "wade",
        r: 0.15,
        loud: !0,
        radius: 14,
        text: `I saw ${t.name} slip in the creek.`,
        sal: 0.5,
        onSee: (c) => {
          c.fearWater = clamp(c.fearWater + 0.05, 0, 1),
          c.desire.crossing += 0.08,
          emote(c, i, "!", 2);
        }
      });
    } else
    t.fearWater = Math.max(0.03, t.fearWater - 0.02),
    learnQ(i, t, "wade", 0.6),
    t.counts.wades === 1 && (
    logEvent(
      i,
      2,
      `${t.name} waded across the creek for the first time.`,
      [t.id],
      r,
      "wade"
    ),
    remember(
      i,
      t,
      "wade",
      "I waded the creek. The water pulled at my feet.",
      0.6,
      { x: r.x, z: r.z, pv: 0.1 }
    ));
  }
  function spendTime(i, t, e, n) {
    let s = n - e.t0;
    if (s <= 0) return;
    let r = t.needs,
      o = e.type === "sleep" || e.type === "nap",
      a = WORK_ACTS.has(e.step || e.type) || e.type === "heavyj",
      l = positionAt(t, n);
    if (r.food -= s / 15e3 * (o ? 0.45 : a ? 1.2 : 1), o) {
      let g = restBonusAt(i, t, l.x, l.z);
      r.energy += s * 62e-5 * (1 + g * 0.7) * (isNight(n) ? 1.15 : 0.85),
      r.comfort += s / 3e3 * (0.3 + g);
    } else
    r.energy -=
    s / 6600 * (
    a ? 1.25 : e.type === "walk" ? 1.08 : e.type === "sit" ? 0.35 : 0.92);
    r.social -= s / 9e3 * (0.55 + 0.9 * t.temp.sociability) * (o ? 0.3 : 1);
    let c = 1.3 - 0.9 * t.interests.building;
    r.fun -= s / 6200 * (o ? 0.15 : a ? c : 1);
    let h = rainTotal(i, n) - (e.rc0 ?? rainTotal(i, e.t0)),
      d = shelterAt(i, l.x, l.z),
      u = h * (1 - d),
      f = t.interests.water > 0.6 && t.temp.caution < 0.45;
    u > 1 ? (
    t.wet = Math.min(1, t.wet + u / 240),
    r.comfort -= u / 1400 * (f ? 0.35 : 0.6 + 0.8 * t.temp.caution),
    o && d < 0.5 && (t._wetSleep = !0)) : (
    t.wet = Math.max(0, t.wet - s / (d > 0.5 ? 400 : 700)),
    t.wet < 0.3 && (r.comfort += s / 3600 * (d > 0.5 ? 1.5 : 0.8))),
    a ?
    t.workFatigue = Math.min(
      1,
      t.workFatigue + s / (1500 + 1500 * t.temp.persistence)
    ) :
    t.workFatigue = Math.max(0, t.workFatigue - s / 900);
    for (let g in r) r[g] = clamp(r[g], 0, 1);
    let x =
    ((r.food + r.energy + r.comfort + r.social + r.fun) / 5 - 0.5) * 1.4;
    t.mood = clamp(t.mood + (x - t.mood) * Math.min(1, s / 1800), -1, 1),
    t.emo && i.t - t.emo.t > 1200 && (t.emo = null);
  }
  function lookAround(i, t, e = 10) {
    let n = e * e,
      s = isNight(i.t);
    for (let r of i.res) {
      let o = (r.x - t.x) ** 2 + (r.z - t.z) ** 2,
        a = s && r.kind === "glowcap" && r.amt > 0;
      if (o > n * (a ? 2.2 : s ? 0.45 : 1)) continue;
      let l = t.seen[r.id];
      if (l && l.src && r.amt !== void 0) {
        let c = i.byId[l.src];
        if (c) {
          let h = relation(t, c);
          h.told++,
          r.amt >= Math.min(2, l.a) ?
          h.toldTrue++ :
          h.told - h.toldTrue >= 2 &&
          i.rng.chance(0.4) &&
          remember(
            i,
            t,
            "rumor",
            `${c.name} told me about ${r.kind === "bush" ? "berries" : "something"} here, but there was nothing.`,
            0.35,
            { who: c.id }
          );
        }
      }
      t.seen[r.id] = { a: r.amt ?? 1, t: i.t }, noticeThing(i, t, r, o);
    }
    for (let r of i.pods)
    (r.x - t.x) ** 2 + (r.z - t.z) ** 2 < n && (
    t.seen[r.id] = { a: 1, t: i.t });
    if (!s && !t.know.dams) {
      for (let r of i.structures)
      if (
      !(
      r.kind !== "dam" ||
      !(r.level > 0) ||
      (r.x - t.x) ** 2 + (r.z - t.z) ** 2 > 64))

      {
        i.rng.chance(0.03 + 0.06 * t.temp.curiosity) &&
        discover(
          i,
          t,
          "dams",
          `${t.name} watched the water pooling behind the dam and understood what it was for.`
        );
        break;
      }
    }
    if (!s && i.rng.chance(0.25))
    for (let r of i.structures) {
      if (
      r.level === 0 ||
      r.kind !== "home" ||
      r.owner === t.id ||
      (r.x - t.x) ** 2 + (r.z - t.z) ** 2 > 49)

      continue;
      let a = t.home != null && i.byId[t.home] ? i.byId[t.home].level : 0;
      r.level > a && (
      t.desire.home = Math.min(2, t.desire.home + 0.03 * (r.level - a))),
      r.level >= 3 &&
      !t.know.mud &&
      i.rng.chance(0.06 + 0.1 * t.temp.curiosity) &&
      discover(
        i,
        t,
        "mud",
        `${t.name} studied the walls of ${i.byId[r.owner] ? i.byId[r.owner].name + "'s" : "a"} hut and worked out how mud dries hard.`
      );
    }
  }
  function discover(i, t, e, n, s = 2) {
    return t.know[e] ?
    !1 : (
    t.know[e] = i.t,
    i.stats["know_" + e] = (i.stats["know_" + e] || 0) + 1,
    n &&
    logEvent(
      i,
      i.stats["know_" + e] === 1 ? 3 : Math.min(s, 1),
      n,
      [t.id],
      t,
      "discovery"
    ),
    feel(t, i, "curious", 0.7),
    emote(t, i, "idea", 3.5),
    remember(
      i,
      t,
      "learn",
      {
        mud: "Wet mud dries hard in the sun. I could build with it.",
        planting: "Seeds that fall on the ground grow into new plants.",
        clay: "There is sticky clay across the creek. It holds its shape.",
        glowcap: "Some mushrooms across the creek glow in the dark.",
        tools: "A stick, a basket or a mallet can make work easier.",
        dams: "Branches across the creek slow the water down. The ground behind them stays wet and green.",
        downstream: "A dam only holds its pond if water already stands against its foot. Build the lowest one first."
      }[e] || "I learned about " + e,
      0.8,
      { x: t.x, z: t.z, pv: 0.2 }
    ),
    e === "planting" && (t.desire.garden += 0.6),
    e === "clay" && (t.desire.workshop += 0.1),
    e === "dams" && (t.desire.dam = (t.desire.dam || 0) + 0.5),
    storyDiscovery(i, t, e), // MINDS: first discoveries become stories
    !0);
  }
  function damIdeaReady(i) {
    return (i.stats.levels || 0) >= 28 && i.t > 1.2 * 86400;
  }
  function noticeThing(i, t, e, n) {
    let s = i.rng;
    e.kind === "sprout" && !t.know.planting && n < 30 ?
    s.chance(0.08 + 0.2 * t.temp.curiosity + 0.2 * t.interests.growing) &&
    discover(
      i,
      t,
      "planting",
      `${t.name} noticed a sprout where old pod seeds had spilled, and worked out that seeds grow.`
    ) :
    e.kind === "clay" &&
    t.know.mud &&
    !t.know.clay &&
    n < 16 &&
    i.t - t.know.mud > 21600 ?
    s.chance(0.04 + 0.1 * t.interests.building) &&
    discover(
      i,
      t,
      "clay",
      `${t.name} found sticky clay on the far bank and realized it could be shaped.`
    ) :
    e.kind === "glowcap" &&
    !t.know.glowcap &&
    isNight(i.t) &&
    e.amt > 0 &&
    n < 200 ?
    discover(
      i,
      t,
      "glowcap",
      `${t.name} found mushrooms glowing softly in the dark across the creek.`
    ) :
    e.kind === "snag" &&
    !t.know.dams &&
    n < 36 &&
    damIdeaReady(i) &&
    !isNight(i.t) &&
    s.chance(
      0.002 + 0.004 * t.temp.curiosity + 0.004 * t.interests.water
    ) &&
    discover(
      i,
      t,
      "dams",
      `${t.name} noticed how the creek slows and pools behind a tangle of fallen branches, and how green the bank is there. Maybe they could build one.`
    );
  }
  function carryCapacity(i, t) {
    return HEAVY_MATERIALS[t] ? 1 : i.tools.basket > 0 ? 2 : 1;
  }
  var POUCH_SIZE = 4;
  function pouchCount(i) {
    let t = 0;
    for (let e in i.pouch || {}) t += i.pouch[e];
    return t;
  }
  function pouchAdd(i, t, e) {
    i.pouch = i.pouch || {};
    let n = POUCH_SIZE - pouchCount(i),
      s = Math.min(n, e);
    return s > 0 && (i.pouch[t] = (i.pouch[t] || 0) + s), s;
  }
  function pouchTake(i, t) {
    return !i.pouch || !i.pouch[t] ?
    !1 : (
    i.pouch[t]--, i.pouch[t] || delete i.pouch[t], !0);
  }
  function favoriteSnack(i) {
    if (!i.pouch) return null;
    let t = null,
      e = -9;
    for (let n in i.pouch)
    if (FOODS[n] && i.pouch[n] > 0) {
      let s = tasteValue(i, n);
      s > e && (e = s, t = n);
    }
    return t;
  }
  function tasteValue(i, t) {
    let e = i.Q["eat|" + t];
    return e ? e.v : 0.55;
  }
  function useTool(i, t, e) {
    return t.tools[e] ? (
    t.tools[e]--,
    t.tools[e] <= 0 && delete t.tools[e],
    e === "mallet" ? 1.45 : e === "stick" ? 1.6 : 1) :
    1;
  }
  var GATHER_MATERIAL = {
      tree: "branch",
      reeds: "reeds",
      stones: "stone",
      clay: "clay",
      glowcap: "glowcap"
    },
    GATHER_TIME = { tree: 5, reeds: 6, stones: 6.5, clay: 13, glowcap: 5, bush: 4.5 };
  function eatFood(i, t, e) {
    let n = FOODS[e];
    t.needs.food = clamp(t.needs.food + n.nutrition, 0, 1);
    let s = t.tastes[e] ?? 0,
      r = !t.Q["eat|" + e],
      o = clamp(0.5 + s + i.rng.range(-0.08, 0.08), 0, 1);
    if (
    learnQ(i, t, "eat|" + e, o),
    s > 0.2 && (t.needs.fun = clamp(t.needs.fun + 0.03, 0, 1)),
    r)
    {
      let a =
      s > 0.3 ?
      "delicious" :
      s > 0.05 ?
      "good" :
      s > -0.2 ?
      "all right" :
      "unpleasant";
      remember(
        i,
        t,
        "taste",
        `The first time I ate ${n.label}, they were ${a}.`,
        0.45
      ),
      s > 0.35 && feel(t, i, "joy", 0.5),
      s < -0.25 && (feel(t, i, "annoyed", 0.3), emote(t, i, "yuck", 2.5));
    }
    t.counts.eaten = (t.counts.eaten || 0) + 1;
  }
  var ACTIONS = {
    walk: {
      start(i, t, e) {
        let n = e.x,
          s = e.z,
          r = dist2d(t.x, t.z, n, s),
          o = e.near ?? 0.25;
        if (r <= o + 0.05) return "skip";
        if (o > 0) {
          let l = (r - o) / r;
          n = t.x + (n - t.x) * l, s = t.z + (s - t.z) * l;
        }
        !i.terrain.walkable(n, s) &&
        !i.terrain.isWater(n, s) && (
        n += (32 - n) * 0.08, s += (32 - s) * 0.08);
        let a = planRoute(i, t, t.x, t.z, n, s);
        return {
          type: "walk",
          t0: i.t,
          t1: i.t + a.time,
          path: a.path,
          wade: a.wade,
          wadeMid: a.wadeMid,
          cross: a.cross,
          x: t.x,
          z: t.z,
          why: e.why || "",
          run: !!e.run
        };
      },
      end(i, t, e) {
        return arrive(i, t, e), !0;
      }
    },
    approach: {
      start(i, t, e) {
        let n = i.byId[e.id];
        if (!n || n.asleep) return null;
        let s = positionAt(n, i.t);
        if (n.act && n.act.path && n.act.t1 - i.t < 25) {
          let l = n.act.path[n.act.path.length - 1];
          s = { x: l.x, z: l.z };
        }
        let r = dist2d(t.x, t.z, s.x, s.z);
        if (r < 1.8) return "skip";
        let o = (r - 1.3) / r,
          a = planRoute(i, t, t.x, t.z, t.x + (s.x - t.x) * o, t.z + (s.z - t.z) * o);
        return {
          type: "walk",
          t0: i.t,
          t1: i.t + a.time,
          path: a.path,
          wade: a.wade,
          wadeMid: a.wadeMid,
          cross: a.cross,
          x: t.x,
          z: t.z,
          why: "approach",
          target: n.id
        };
      },
      end(i, t, e, n) {
        arrive(i, t, e);
        let s = i.byId[n.id];
        if (!s) return !1;
        let r = positionAt(s, i.t);
        return dist2d(t.x, t.z, r.x, r.z) > 3 ? (
        n.tries = (n.tries || 0) + 1, n.tries < 2 ? "again" : !1) :
        !0;
      }
    },
    look: {
      start(i, t, e) {
        let n = e.id ? positionAt(i.byId[e.id] || t, i.t) : { x: e.x, z: e.z };
        return makeAct(i, t, "look", e.dur || 1.3, {
          lookX: n.x,
          lookZ: n.z,
          lookId: e.id || 0,
          icon: e.icon || null
        });
      },
      end() {
        return !0;
      }
    },
    gesture: {
      start(i, t, e) {
        return e.g ? makeAct(i, t, "gesture", 2.2, { g: e.g }) : "skip";
      },
      end(i, t, e, n) {
        return t.lastGesture = { g: e.g, task: n.task, t: i.t }, !0;
      }
    },
    pick: {
      start(i, t, e) {
        let n = i.byId[e.rid];
        if (!n || !(n.amt > 0))
        return n && (t.seen[n.id] = { a: 0, t: i.t }), null;
        if (n.kind === "glowcap" && !isNight(i.t) || dist2d(t.x, t.z, n.x, n.z) > 3.2)
        return null;
        let s = GATHER_TIME[n.kind] || 5;
        return (
          n.kind === "clay" && t.tools.stick && (s /= 1.6),
          makeAct(i, t, "pick", s, {
            rid: n.id,
            lookX: n.x,
            lookZ: n.z,
            what: n.kind
          }));

      },
      end(i, t, e, n) {
        let s = i.byId[e.rid];
        if (!s || !(s.amt > 0))
        return s && (t.seen[s.id] = { a: 0, t: i.t }), emote(t, i, "?", 2), !1;
        if (
        s.amt--,
        t.seen[s.id] = { a: s.amt, t: i.t },
        s.kind === "clay" && t.tools.stick && useTool(i, t, "stick"),
        s.kind === "bush")

        pouchAdd(t, s.food, 1);else
        {
          let r = GATHER_MATERIAL[s.kind];
          t.carry && t.carry.k === r ? t.carry.n++ : t.carry = { k: r, n: 1 };
        }
        return !0;
      }
    },
    dig: {
      start(i, t, e) {
        if (!t.know.mud || i.terrain.edgeDist(t.x, t.z) > 1.8) return null;
        let n = t.tools.stick ? 6 : 10,
          s = i.terrain.creekX(t.z);
        return makeAct(i, t, "dig", n, { lookX: s, lookZ: t.z });
      },
      end(i, t) {
        return (
          t.tools.stick && useTool(i, t, "stick"),
          t.carry && t.carry.k === "mud" ?
          t.carry.n++ :
          t.carry = { k: "mud", n: 1 },
          t.wet = Math.max(t.wet, 0.3),
          !0);

      }
    },
    take: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n || !n.stock || !(n.stock[e.k] > 0) ?
        null :
        makeAct(i, t, "take", 2.5, { lookX: n.x, lookZ: n.z });
      },
      end(i, t, e, n) {
        let s = i.byId[n.sid];
        return !s || !(s.stock[n.k] > 0) ?
        !1 : (
        s.stock[n.k]--,
        FOODS[n.k] ?
        pouchAdd(t, n.k, 1) :
        t.carry && t.carry.k === n.k ?
        t.carry.n++ :
        t.carry = { k: n.k, n: 1 },
        !0);
      }
    },
    stash: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n || n.level < 1 ?
        null :
        !t.carry && !(e.food && pouchCount(t) > 0) ?
        "skip" :
        makeAct(i, t, "stash", 2.5, { lookX: n.x, lookZ: n.z });
      },
      end(i, t, e, n) {
        let s = i.byId[n.sid];
        if (!s) return !1;
        s.stock = s.stock || {};
        let r = 0;
        if (
        t.carry && (
        s.stock[t.carry.k] = (s.stock[t.carry.k] || 0) + t.carry.n,
        r += t.carry.n,
        t.carry = null),
        n.food && t.pouch)

        for (let o in t.pouch) {
          if (!FOODS[o]) continue;
          let a = n.keep || 0,
            l = Math.max(0, t.pouch[o] - a);
          l > 0 && (
          s.stock[o] = (s.stock[o] || 0) + l,
          t.pouch[o] -= l,
          r += l,
          t.pouch[o] || delete t.pouch[o]);
        }
        return (
          t.counts.stocked = (t.counts.stocked || 0) + r,
          r > 0 && t.temp.generosity > 0.5 && feel(t, i, "warmth", 0.2),
          !0);

      }
    },
    deposit: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n || !t.carry ?
        null :
        makeAct(i, t, "deposit", 2.4, { lookX: n.x, lookZ: n.z });
      },
      end(i, t, e, n) {
        let s = i.byId[n.sid];
        if (!s || !t.carry) return !1;
        let r = t.carry.k,
          o = t.carry.n;
        if (
        t.carry = null,
        t.plan && (t.plan.delivered = !0),
        t.counts.delivered += o,
        s.building)
        {
          s.contrib[t.id] = (s.contrib[t.id] || 0) + o * 40;
          let a = currentStage(s),
            l = a && !s.building.cureLeft ? stageNeeds(s) : {},
            c = s.building.delivered[r] || 0,
            h = Math.max(0, Math.min(o, (l[r] || 0) - c));
          h > 0 && (s.building.delivered[r] = c + h),
          o - h > 0 && (s.spare[r] = (s.spare[r] || 0) + (o - h)),
          a && matsComplete(s) && stageLaborNeeded(s) <= 0 && !s.building.cureLeft && stageDone(i, s);
        } else s.spare[r] = (s.spare[r] || 0) + o;
        return !0;
      }
    },
    labor: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        if (!n || !n.building || n.building.cureLeft > 0) return null;
        let s = currentStage(n);
        if (!matsComplete(n)) return null;
        let r = stageLaborNeeded(n) - n.building.labor;
        if (r <= 0) return stageDone(i, n), "skip";
        let o = workSpeed(t),
          a = Math.min(40 + 30 * t.temp.patience, r / o);
        return makeAct(i, t, "labor", a, {
          sid: n.id,
          speed: o,
          lookX: n.x,
          lookZ: n.z,
          what: s.name
        });
      },
      end(i, t, e) {
        return addLabor(i, t, e, e.t1 - e.t0);
      },
      abort(i, t, e) {
        addLabor(i, t, e, i.t - e.t0);
      }
    },
    heavy: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        if (!n || !n.building || n.building.cureLeft > 0 || !matsComplete(n)) return null;
        let s = waitingFor(i, "heavy", n.id, t);
        return s.length ?
        startJoint(i, [...s, t], "heavyj", { t: "heavy", id: n.id }, t) :
        e.solo === !1 ?
        "skip" :
        makeAct(i, t, "strain", 6, { sid: n.id, lookX: n.x, lookZ: n.z });
      },
      end(i, t, e, n) {
        return (
          e.type === "strain" && (
          feel(t, i, "frustration", 0.4),
          emote(t, i, "anger", 2.5),
          learnQ(i, t, "heavy|solo", 0.05),
          beSeen(i, t, { x: t.x, z: t.z, key: "heavy|solo", r: 0.1, text: null }),
          t.counts.strains ||
          logEvent(
            i,
            1,
            `${t.name} heaved at the ${currentStage(i.byId[e.sid])?.name || "work"} alone, but it was too heavy.`,
            [t.id],
            t,
            "strain"
          ),
          t.counts.strains = (t.counts.strains || 0) + 1),
          !0);

      }
    },
    seek: {
      start(i, t, e) {
        if (e.phase = e.phase || 0, e.phase === 0) {
          let n = pickHelper(i, t, e.obj, e.excl || []);
          return n ? (
          e.helper = n.id,
          makeAct(i, t, "look", 1.4, {
            lookId: n.id,
            lookX: n.x,
            lookZ: n.z,
            icon: "think"
          })) : (
          e.noHelper = !0, null);
        }
        if (e.phase === 1) {
          let n = i.byId[e.helper];
          if (!n || n.asleep) return null;
          let s = [
            "help",
            e.obj.t === "pod" ?
            "pod" :
            STRUCTURES[i.byId[e.obj.id]?.kind]?.concept || "heavy"],

            r = s.map((o) => wordFor(i, t, o));
          return makeAct(i, t, "call", 2.2, {
            to: n.id,
            words: r,
            concepts: s,
            lookId: n.id
          });
        }
        return makeAct(i, t, "wait", 55, { obj: e.obj, lookId: e.helper });
      },
      end(i, t, e, n) {
        if (n.phase === 0) return n.phase = 1, "again";
        if (n.phase === 1) {
          let r = i.byId[n.helper];
          return r &&
          respondToAsk(i, t, r, n.obj.t === "pod" ? "help-pod" : "help-heavy", {
            obj: n.obj,
            words: e.words,
            concepts: e.concepts
          }) ? (
          n.phase = 2, "again") : (
          n.excl = (n.excl || []).concat(n.helper),
          n.asks = (n.asks || 0) + 1,
          n.asks < 3 && i.rng.chance(0.35 + 0.5 * t.temp.persistence) ? (
          n.phase = 0, "again") : (
          feel(t, i, "sad", 0.4), !1));
        }
        let s = i.byId[n.helper];
        if (s) {
          let r = relation(t, s);
          r.annoy = Math.min(1, r.annoy + 0.15);
        }
        return emote(t, i, "sigh", 2), !1;
      }
    },
    join: {
      start(i, t, e) {
        let n = waitingFor(i, e.obj.t, e.obj.id, t);
        if (!n.length) return emote(t, i, "?", 2), null;
        if (e.obj.t === "pod") {
          let s = i.byId[e.obj.id],
            r = s && s.need || 2;
          if (n.length + 1 < r) {
            let o = n.find((l) => l.plan && l.plan.goal === "pod") || n[0],
              a = [...n, t].map((l) => l.id);
            return (
              setPlan(i, o, {
                goal: "pod",
                pid: e.obj.id,
                i: 0,
                steps: [{ do: "seek", obj: e.obj, excl: a }]
              }),
              makeAct(i, t, "wait", 70, { obj: e.obj }));

          }
        }
        return startJoint(
          i,
          [...n, t],
          e.obj.t === "pod" ? "lift" : "heavyj",
          e.obj,
          n[0]
        );
      },
      end() {
        return !0;
      }
    },
    wait: {
      start(i, t, e) {
        return makeAct(i, t, "wait", e.dur || 40, { obj: e.obj });
      },
      end() {
        return !1;
      }
    },
    lift: {
      start(i, t, e) {
        let n = i.byId[e.pid];
        if (!n || n.kind !== "pod") return null;
        let s = waitingFor(i, "pod", n.id, t);
        return s.length && s.length + 1 >= (n.need || 2) ?
        startJoint(i, [...s, t], "lift", { t: "pod", id: n.id }, t) :
        s.length || e.solo === !1 ?
        "skip" :
        makeAct(i, t, "strain", 5.5, {
          pid: n.id,
          lookX: n.x,
          lookZ: n.z,
          solo: !0
        });
      },
      end(i, t, e, n) {
        let s = i.byId[n.pid];
        if (!s) return !1;
        let r =
        t.lastGesture &&
        i.t - t.lastGesture.t < 8 &&
        t.lastGesture.task === "lift" ?
        t.lastGesture.g :
        null;
        return (
          updateRituals(i, t, "lift", r, !1),
          learnQ(i, t, "pod|solo", 0.05),
          feel(t, i, "frustration", 0.5),
          emote(t, i, "anger", 2.5),
          t.counts.soloFails = (t.counts.soloFails || 0) + 1,
          t.counts.soloFails === 1 &&
          logEvent(
            i,
            1,
            `${t.name} tried to lift a seed pod alone and couldn't budge it.`,
            [t.id],
            s,
            "pod"
          ),
          beSeen(i, t, { x: s.x, z: s.z, key: "pod|solo", r: 0.1, text: null }),
          !0);

      }
    },
    eat: {
      start(i, t, e) {
        let n = e.food || favoriteSnack(t);
        return !n || !t.pouch || !t.pouch[n] ?
        null : (
        e.food = n, makeAct(i, t, "eat", FOODS[n].bite, { food: n }));
      },
      end(i, t, e, n) {
        return pouchTake(t, e.food) ? (eatFood(i, t, e.food), !0) : !1;
      }
    },
    graze: {
      start(i, t, e) {
        let n = i.byId[e.rid];
        if (!n || !(n.amt > 0))
        return n && (t.seen[n.id] = { a: 0, t: i.t }), null;
        if (dist2d(t.x, t.z, n.x, n.z) > 3.2) return null;
        let s =
        n.kind === "orchard" ? "fruit" : n.kind === "reeds" ? "root" : n.food;
        return FOODS[s] ?
        makeAct(i, t, "eat", FOODS[s].bite + 1, {
          food: s,
          rid: n.id,
          lookX: n.x,
          lookZ: n.z
        }) :
        null;
      },
      end(i, t, e) {
        let n = i.byId[e.rid];
        return !n || !(n.amt > 0) ? (
        emote(t, i, "?", 2), !1) : (
        n.amt--,
        t.seen[n.id] = { a: n.amt, t: i.t },
        eatFood(i, t, e.food),
        !0);
      }
    },
    sleep: {
      start(i, t, e) {
        let n = dayPhase(i.t),
          s = getDayLength(),
          r = (0.2 + 0.02 + (1 - t.temp.activity) * 0.03 - n + 1) % 1 * s;
        isNight(i.t) || (r = 0);
        let o = (1 - t.needs.energy) / 7e-4,
          a = clamp(Math.max(r, o), 300, Math.max(3300, s * 0.42));
        return t.asleep = !0, makeAct(i, t, "sleep", a, {});
      },
      end(i, t) {
        return wakeUp(i, t), !0;
      }
    },
    nap: {
      start(i, t, e) {
        return t.asleep = !0, makeAct(i, t, "nap", i.rng.range(150, 320), {});
      },
      end(i, t) {
        return wakeUp(i, t), !0;
      }
    },
    huddle: {
      start(i, t, e) {
        return i.weather.rain <= 0 ?
        "skip" :
        makeAct(i, t, "huddle", i.rng.range(90, 200), {});
      },
      end(i, t) {
        return (
          i.structures.find(
            (n) =>
            n.kind === "chimes" &&
            n.level > 0 &&
            Math.hypot(n.x - t.x, n.z - t.z) < 7
          ) &&
          i.weather.rain > 0 && (
          t.needs.fun = clamp(
            t.needs.fun + 0.08 * (0.5 + t.interests.sound),
            0,
            1
          ),
          addHabit(t, i, "listen")),
          t.interests.sound > 0.55 &&
          i.weather.rain > 0 && (
          t.desire.chimes += 0.04 * t.interests.sound),
          !0);

      }
    },
    watch: {
      start(i, t, e) {
        let n = i.terrain.creekX(t.z),
          s =
          e.pond && i.byId[e.pond] && i.byId[e.pond].kind === "dam" ?
          e.pond :
          0;
        return makeAct(i, t, "watch", i.rng.range(35, 75) * (s ? 1.3 : 1), {
          lookX: n,
          lookZ: s ? t.z : t.z + 2,
          pond: s
        });
      },
      end(i, t, e) {
        let n = t.fearWater;
        t.fearWater = Math.max(0.03, n - 0.035);
        let s = 1 / (1 + 0.5 * (t.habit.watch || 0)),
          r = e.pond ? Math.min(1, (i.hydro && i.hydro.marsh || 0) / 30) : 0;
        if (
        t.needs.fun = clamp(
          t.needs.fun + 0.22 * (0.4 + t.interests.water + 0.3 * r) * s,
          0,
          1
        ),
        t.interests.water = clamp(t.interests.water + 0.01, 0, 1),
        addHabit(t, i, "watch"),
        markPlace(t, t.x, t.z, e.pond ? 0.14 : 0.08),
        e.pond)
        {
          t.know.dams && (
          t.desire.dam =
          (t.desire.dam || 0) + 0.03 + 0.04 * t.interests.growing);
          let o = i.hydro || {},
            a = isNight(i.t),
            l =
            o.frogs && (a || dayPhase(i.t) > 0.82 - 0.08) ?
            "The frogs in the marsh were singing as it got dark." :
            o.flies ?
            "Dragonflies were zipping over the pond we made." :
            "I sat by the pond we made. The water is so still there.";
          remember(i, t, "pond", l, 0.4, { x: t.x, z: t.z, pv: 0.25 }),
          (t.interests.growing > 0.5 || t.interests.water > 0.6) && (
          t.interests.growing = clamp(t.interests.growing + 0.006, 0, 1));
        } else
        !t.know.dams &&
        damIdeaReady(i) &&
        i.res.find(
          (a) =>
          a.kind === "snag" && (a.x - t.x) ** 2 + (a.z - t.z) ** 2 < 49
        ) &&
        i.rng.chance(
          0.03 + 0.05 * t.temp.curiosity + 0.05 * t.interests.water
        ) &&
        discover(
          i,
          t,
          "dams",
          `${t.name} sat watching the creek pool up behind a tangle of fallen branches, and had an idea: they could build something like it.`
        );
        return (
          t.fearPeak = Math.max(t.fearPeak || 0, n),
          t.fearPeak > 0.65 &&
          n > 0.45 &&
          t.fearWater <= 0.45 &&
          !t.overcameFear && (
          t.overcameFear = !0,
          logEvent(
            i,
            2,
            `${t.name} has been watching leaves drift down the creek and doesn't seem so afraid of the water anymore.`,
            [t.id],
            t,
            "growth"
          ),
          remember(
            i,
            t,
            "growth",
            "The creek is not so frightening. The leaves always come out the other side.",
            0.7,
            { x: t.x, z: t.z, pv: 0.3 }
          )),
          !0);

      }
    },
    play: {
      start(i, t, e) {
        let n =
        {
          stack: 45,
          mudpie: 40,
          drum: 30,
          collect: 20,
          perch: 60,
          dance: 35,
          chaseleaf: 30,
          admire: 25
        }[e.kind] || 30;
        return e.kind === "mudpie" && i.terrain.edgeDist(t.x, t.z) > 2.2 ?
        null :
        makeAct(i, t, "play", n * i.rng.range(0.8, 1.3), {
          kind: e.kind,
          lookX: e.lx ?? t.x,
          lookZ: e.lz ?? t.z
        });
      },
      end(i, t, e, n) {
        let s = {
            stack: "building",
            mudpie: "building",
            drum: "sound",
            collect: "collecting",
            perch: "exploring",
            dance: "water",
            chaseleaf: "water",
            admire: "growing"
          }[e.kind],
          r = 1 / (1 + 0.45 * (t.habit[e.kind] || 0));
        t.needs.fun = clamp(
          t.needs.fun + 0.24 * (0.35 + t.interests[s]) * r,
          0,
          1
        ),
        t.interests[s] = clamp(t.interests[s] + 0.008 * r, 0, 1),
        addHabit(t, i, e.kind);
        let o = t.x + Math.sin(t.face) * 0.6,
          a = t.z + Math.cos(t.face) * 0.6,
          l = i.structures.some(
            (d) =>
            (d.x - o) ** 2 + (d.z - a) ** 2 < (STRUCTURES[d.kind].radius + 0.6) ** 2
          ),
          c = i.items.filter((d) => d.kind === "cairn").length,
          h = i.items.some(
            (d) => d.kind === "cairn" && (d.x - o) ** 2 + (d.z - a) ** 2 < 0.64
          );
        if (
        e.kind === "stack" &&
        !l &&
        i.terrain.walkable(o, a) && (
        c < 24 || h))
        {
          let d = dropItem(i, "cairn", o, a, 1);
          d.by = t.id,
          d.n === 4 &&
          logEvent(
            i,
            1,
            `${t.name} has been stacking stones into a little tower.`,
            [t.id],
            d,
            "play"
          ),
          d.n = Math.min(d.n, 7);
        }
        return (
          e.kind === "mudpie" &&
          !t.know.mud &&
          i.weather.rain <= 0 && (
          t.mudpies = (t.mudpies || 0) + 1,
          i.rng.chance(0.02 + 0.025 * t.mudpies + 0.05 * t.temp.curiosity) &&
          discover(
            i,
            t,
            "mud",
            `${t.name} left a mud pie in the sun and found it had dried hard. Mud could be used for building!`
          )),
          e.kind === "collect" && (
          t.trinkets = Math.min(9, (t.trinkets || 0) + 1),
          t.trinkets === 3 &&
          remember(
            i,
            t,
            "collect",
            "I have been gathering pretty pebbles and feathers.",
            0.3
          )),
          e.kind === "perch" && (
          lookAround(i, t, 18), t.desire.lookout += 0.04 * t.interests.exploring),
          e.kind === "drum" && (t.desire.chimes += 0.02 * t.interests.sound),
          e.kind === "admire" && (
          t.desire.garden += 0.02 * t.interests.growing),
          !0);

      }
    },
    survey: {
      start(i, t) {
        return makeAct(i, t, "look", 3.5, {
          lookX: t.x + Math.sin(t.face) * 4,
          lookZ: t.z + Math.cos(t.face) * 4,
          icon: "eye"
        });
      },
      end(i, t) {
        lookAround(i, t, 15), t.explored = t.explored || {};
        let e = Math.floor(t.x / 8) + "," + Math.floor(t.z / 8);
        t.explored[e] = (t.explored[e] || 0) + 1, t.counts.explore++;
        let n = 1 / (1 + 0.35 * (t.habit.explore || 0));
        return (
          t.needs.fun = clamp(
            t.needs.fun + 0.18 * (0.4 + t.interests.exploring) * n,
            0,
            1
          ),
          addHabit(t, i, "explore"),
          t.desire.lookout += 0.012 * t.interests.exploring,
          !0);

      }
    },
    mark: {
      start(i, t, e) {
        return makeAct(i, t, "mark", 7, { lookX: e.x, lookZ: e.z });
      },
      end(i, t, e, n) {
        return markProject(i, t, n);
      }
    },
    plant: {
      start(i, t, e) {
        return !t.pouch || !t.pouch.seeds ? null : makeAct(i, t, "plant", 9, {});
      },
      end(i, t, e, n) {
        if (
        !pouchTake(t, "seeds") ||
        i.res.some(
          (a) =>
          (a.kind === "orchard" ||
          a.kind === "tree" ||
          a.kind === "podtree") &&
          Math.hypot(a.x - t.x, a.z - t.z) < 2.5
        ) ||
        !i.terrain.walkable(t.x, t.z))

        return !1;
        let r = register(i, {
          id: i.nextId++,
          kind: "orchard",
          x: +t.x.toFixed(2),
          z: +t.z.toFixed(2),
          side: i.terrain.side(t.x, t.z),
          stage: 0,
          grow: 0,
          amt: 0,
          max: 6,
          canopy: 0.4,
          planter: t.id,
          plantedT: i.t
        });
        i.res.push(r),
        t.counts.plants++,
        t.lastPlant = i.t,
        i.stats.planted = (i.stats.planted || 0) + 1;
        let o =
        t.lastGesture &&
        i.t - t.lastGesture.t < 8 &&
        t.lastGesture.task === "plant" ?
        t.lastGesture.g :
        null;
        return (
          updateRituals(i, t, "plant", o, !0),
          logEvent(
            i,
            t.counts.plants === 1 ? 3 : 1,
            t.counts.plants === 1 ?
            `${t.name} planted a tree seed in the ground.` :
            `${t.name} planted another tree.`,
            [t.id],
            r,
            "plant"
          ),
          remember(
            i,
            t,
            "plant",
            "I planted a seed. It will be a tree someday.",
            0.6,
            { x: t.x, z: t.z, pv: 0.3 }
          ),
          feel(t, i, "pride", 0.4),
          beSeen(i, t, {
            x: t.x,
            z: t.z,
            task: "plant",
            gesture: o,
            r: 1,
            onSee: (a) => {
              !a.know.planting &&
              i.rng.chance(0.3) &&
              discover(
                i,
                a,
                "planting",
                `${a.name} watched ${t.name} plant a seed and understood.`
              );
            }
          }),
          !0);

      }
    },
    guard: {
      start(i, t, e) {
        let n = i.byId[e.rid];
        return !n || n.guard || !t.carry || t.carry.k !== "stone" ?
        null :
        makeAct(i, t, "labor", 20, { lookX: n.x, lookZ: n.z, what: "guard" });
      },
      end(i, t, e, n) {
        let s = i.byId[n.rid];
        return s ? (
        s.guardN = (s.guardN || 0) + t.carry.n,
        t.carry = null,
        s.guardN >= 3 && (
        s.guard = !0,
        logEvent(
          i,
          1,
          `${t.name} ringed a young tree with stones to protect it.`,
          [t.id],
          s,
          "plant"
        )),
        !0) :
        !1;
      }
    },
    tend: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n || !n.beds ?
        null :
        makeAct(i, t, "tend", 24, { sid: n.id, lookX: n.x, lookZ: n.z });
      },
      end(i, t, e) {
        let n = i.byId[e.sid];
        if (!n) return !1;
        for (let s of n.beds) s.state === "growing" && (s.water = 1);
        return (
          t.needs.fun = clamp(t.needs.fun + 0.06 * t.interests.growing, 0, 1),
          t.interests.growing = clamp(t.interests.growing + 0.005, 0, 1),
          !0);

      }
    },
    harvest: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n || !n.beds || !n.beds.some((s) => s.state === "ready") ?
        null :
        makeAct(i, t, "harvest", 9, { sid: n.id, lookX: n.x, lookZ: n.z });
      },
      end(i, t, e) {
        let n = i.byId[e.sid],
          s = n && n.beds.find((o) => o.state === "ready");
        if (!s) return !1;
        s.state = "empty", s.grow = 0;
        let r = pouchAdd(t, "greens", 3);
        if (r < 3) {
          let o = findStructure(i, "store", (a) => a.level > 0);
          o && (
          o.stock = o.stock || {},
          o.stock.greens = (o.stock.greens || 0) + (3 - r));
        }
        return (
          i.stats.harvests = (i.stats.harvests || 0) + 1,
          i.stats.harvests === 1 &&
          logEvent(
            i,
            3,
            `${t.name} brought in the first harvest from the garden.`,
            [t.id],
            n,
            "garden"
          ),
          t.desire.garden = Math.max(0, t.desire.garden - 0.05),
          !0);

      }
    },
    sow: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n ||
        !n.beds ||
        !n.beds.some((s) => s.state === "empty") ||
        !t.pouch ||
        !t.pouch.seeds ?
        null :
        makeAct(i, t, "sow", 10, { sid: n.id, lookX: n.x, lookZ: n.z });
      },
      end(i, t, e) {
        let n = i.byId[e.sid],
          s = n && n.beds.find((r) => r.state === "empty");
        return !s || !pouchTake(t, "seeds") ?
        !1 : (
        s.state = "growing",
        s.grow = 0,
        s.water = Math.max(s.water, 0.6),
        !0);
      }
    },
    shape: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n || !t.carry || t.carry.k !== "clay" || n.level < 4 ?
        null :
        makeAct(i, t, "labor", 50, {
          sid: n.id,
          lookX: n.x,
          lookZ: n.z,
          what: "tiles"
        });
      },
      end(i, t, e) {
        let n = i.byId[e.sid];
        if (!n || !t.carry) return !1;
        n.drying = n.drying || [];
        for (let s = 0; s < t.carry.n * 3; s++)
        n.drying.push(i.t + 2400 * BUILD_SCALE.cure);
        return (
          t.carry = null, t.counts.tiles = (t.counts.tiles || 0) + 1, !0);

      }
    },
    craft: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        if (!n || n.level < 2) return null;
        let s = {
          stick: { branch: 1 },
          basket: { reeds: 1 },
          mallet: { stone: 1 }
        }[e.tool];
        n.spare = n.spare || {};
        let r = findStructure(i, "store", (o) => o.level > 0);
        for (let o in s)
        if (
        (n.spare[o] || 0) + (
        t.carry && t.carry.k === o ? t.carry.n : 0) + (
        r && r.stock && r.stock[o] || 0) <
        s[o])

        return null;
        return (
          e.need = s,
          makeAct(i, t, "craft", e.tool === "basket" ? 110 : 80, {
            sid: n.id,
            tool: e.tool,
            lookX: n.x,
            lookZ: n.z
          }));

      },
      end(i, t, e, n) {
        let s = i.byId[e.sid],
          r = findStructure(i, "store", (a) => a.level > 0);
        for (let a in n.need) {
          let l = n.need[a];
          if (t.carry && t.carry.k === a) {
            let h = Math.min(l, t.carry.n);
            t.carry.n -= h, l -= h, t.carry.n || (t.carry = null);
          }
          let c = Math.min(l, s.spare[a] || 0);
          s.spare[a] = (s.spare[a] || 0) - c,
          l -= c,
          l > 0 &&
          r &&
          r.stock && (
          r.stock[a] = Math.max(0, (r.stock[a] || 0) - l));
        }
        t.tools[e.tool] = { stick: 70, basket: 90, mallet: 60 }[e.tool],
        t.counts.crafted++,
        i.stats.tools = (i.stats.tools || 0) + 1;
        let o = {
          stick: "a digging stick",
          basket: "a reed basket",
          mallet: "a stone mallet"
        }[e.tool];
        return (
          i.stats["made_" + e.tool] = (i.stats["made_" + e.tool] || 0) + 1,
          i.stats["made_" + e.tool] === 1 &&
          logEvent(
            i,
            i.stats.tools === 1 ? 3 : 2,
            `${t.name} made the first ${o.replace(/^an? /, "")} at the workshop.`,
            [t.id],
            s,
            "tool"
          ),
          feel(t, i, "pride", 0.4),
          beSeen(i, t, {
            x: s.x,
            z: s.z,
            onSee: (a) => {
              a.know.tools || discover(i, a, "tools", null);
            }
          }),
          !0);

      }
    },
    repair: {
      start(i, t, e) {
        let n = i.byId[e.sid];
        return !n || n.building || !(n.level > 0) || (n.cond ?? 1) > 0.95 ?
        null :
        makeAct(i, t, "labor", 60 + 30 * t.temp.patience, {
          sid: n.id,
          lookX: n.x,
          lookZ: n.z,
          what: "repair",
          speed: workSpeed(t)
        });
      },
      end(i, t, e) {
        let n = i.byId[e.sid];
        if (!n) return !1;
        let s = 0.16;
        if (
        t.carry &&
        t.carry.k === repairMaterial(n) && (
        s += 0.18, t.carry.n--, t.carry.n <= 0 && (t.carry = null)),
        n.cond = Math.min(1, (n.cond ?? 1) + s),
        n.contribAll = n.contribAll || {},
        n.contribAll[t.id] = (n.contribAll[t.id] || 0) + (e.t1 - e.t0),
        t.counts.repairs = (t.counts.repairs || 0) + 1,
        n.cond >= 0.95)
        {
          if (n.raise && n.kind === "dam" && creekRaiseDam(i, n, t)) return !0; // CREEK: built up a hand higher
          n.wornNoted = !1, i.stats.repairs = (i.stats.repairs || 0) + 1;
          let r =
          n.owner && i.byId[n.owner] ?
          n.owner === t.id ?
          "their own " :
          i.byId[n.owner].name + "'s " :
          "the ";
          logEvent(
            i,
            i.stats.repairs === 1 ? 2 : 1,
            `${t.name} patched up ${r}${builtLevelDef(n).label}.`,
            [t.id],
            n,
            "repair"
          ),
          feel(t, i, "pride", 0.3),
          n.owner &&
          n.owner !== t.id &&
          i.byId[n.owner] &&
          warmTo(i.byId[n.owner], t, 0.05);
        }
        return !0;
      }
    },
    give: {
      start(i, t, e) {
        let n = i.byId[e.id],
          s = favoriteSnack(t);
        if (!n || !s) return null;
        let r = positionAt(n, i.t);
        return dist2d(t.x, t.z, r.x, r.z) > 3.5 ?
        null :
        makeAct(i, t, "give", 3, { to: n.id, food: s, lookId: n.id });
      },
      end(i, t, e) {
        let n = i.byId[e.to];
        if (!n || !pouchTake(t, e.food)) return !1;
        if (n.asleep) return pouchAdd(t, e.food, 1), !1;
        pouchAdd(n, e.food, 1), t.counts.gifts++;
        let s = relation(n, t);
        return (
          warmTo(n, t, 0.08),
          s.gotShare++,
          warmTo(t, n, 0.03),
          emote(n, i, "heart", 3),
          feel(t, i, "warmth", 0.4),
          logEvent(
            i,
            1,
            `${t.name} shared some ${FOODS[e.food].label} with ${n.name}.`,
            [t.id, n.id],
            t,
            "share"
          ),
          remember(
            i,
            n,
            "gift",
            `${t.name} gave me ${FOODS[e.food].label} when I was hungry.`,
            0.55,
            { who: t.id }
          ),
          n.needs.food < 0.5 &&
          n.act &&
          !UNINTERRUPTIBLE.has(n.act.type) && (
          n._eatNow = !0),
          !0);

      }
    },
    idle: {
      start(i, t, e) {
        return makeAct(i, t, e.kind || "idle", e.dur || i.rng.range(4, 10), {
          lookX: e.lx,
          lookZ: e.lz
        });
      },
      end(i, t, e) {
        if (e.type === "sit") {
          addHabit(t, i, "rest"), t.needs.fun = clamp(t.needs.fun + 0.03, 0, 1);
          for (let n of i.creatures)
          n !== t &&
          !n.asleep &&
          dist2d(n.x, n.z, t.x, t.z) < 4 && (
          t.needs.social = clamp(t.needs.social + 0.03, 0, 1),
          relation(t, n).fam = Math.min(1, relation(t, n).fam + 0.01));
        }
        return !0;
      }
    }
  };
  ACTIONS.drop = {
    start(i, t) {
      return t.carry ?
      { type: "deposit", t0: i.t, t1: i.t + 1.5, x: t.x, z: t.z } :
      "skip";
    },
    end(i, t) {
      let e = homeOf(i, t),
        n = e && Math.hypot(e.x - t.x, e.z - t.z) < 4 ? e : null;
      return (
        n && (n.spare[t.carry.k] = (n.spare[t.carry.k] || 0) + t.carry.n),
        t.carry = null,
        t.desire.store += 0.08,
        !0);

    }
  };
  ACTIONS.unpouch = {
    start(i, t, e) {
      return !t.pouch || !t.pouch[e.k] ?
      null :
      { type: "idle", t0: i.t, t1: i.t + 1, x: t.x, z: t.z };
    },
    end(i, t, e, n) {
      let s = t.pouch[n.k] || 0;
      return s ? (delete t.pouch[n.k], t.carry = { k: n.k, n: s }, !0) : !1;
    }
  };
  ACTIONS.invite = {
    start(i, t, e) {
      let n = i.byId[e.id];
      if (!n || n.asleep) return null;
      if (e.phase = e.phase || 0, e.phase === 0) {
        let s =
          e.kind === "play2" ?
          "play" :
          e.kind === "groom" ?
          "friend" :
          "come",
          r = wordFor(i, t, s);
        return {
          type: "call",
          t0: i.t,
          t1: i.t + 2,
          x: t.x,
          z: t.z,
          to: n.id,
          words: [r],
          concepts: [s],
          lookId: n.id
        };
      }
      return startJoint(i, [n, t], e.kind, null, t);
    },
    end(i, t, e, n) {
      if (n.phase === 0) {
        let s = i.byId[n.id];
        if (!s) return !1;
        let r = positionAt(s, i.t);
        return dist2d(t.x, t.z, r.x, r.z) > 3.5 ?
        !1 :
        respondToAsk(i, t, s, n.kind, { words: e.words, concepts: e.concepts }) ? (
        n.phase = 1, "again") : (
        feel(t, i, "sad", 0.25), !1);
      }
      return !0;
    }
  };
  function workSpeed(i) {
    return (
      (0.8 + 0.4 * i.temp.persistence) * (
      i.tools.mallet ? 1.45 : 1) * (
      i.needs.energy < 0.25 ? 0.8 : 1));

  }
  function addLabor(i, t, e, n) {
    let s = i.byId[e.sid];
    if (!s || !s.building || n <= 0) return !1;
    let r = n * e.speed;
    return (
      s.building.labor += r,
      s.contrib[t.id] = (s.contrib[t.id] || 0) + n,
      t.counts.labor += n,
      t.tools.mallet && useTool(i, t, "mallet"),
      t.desire.workshop += 12e-5 * n * (0.4 + t.interests.building),
      currentStage(s) && s.building.labor >= stageLaborNeeded(s) && stageDone(i, s),
      !0);

  }
  function wakeUp(i, t) {
    t.asleep = !1,
    t._wetSleep ? (
    t._wetSleep = !1,
    t.counts.wetSleeps++,
    t.desire.home += 0.3 + 0.2 * t.temp.caution,
    feel(t, i, "sad", 0.35),
    remember(i, t, "wet", "I woke up wet from the rain.", 0.5, {
      x: t.x,
      z: t.z,
      pv: -0.2
    }),
    (t.counts.wetSleeps === 1 || t.counts.wetSleeps % 4 === 0) &&
    logEvent(
      i,
      1,
      `${t.name} woke up soaked from the rain.`,
      [t.id],
      t,
      "wet"
    )) :
    t.needs.comfort > 0.7 && markPlace(t, t.x, t.z, 0.05);
  }
  function stageDone(i, t, e = !1) {
    let n = t.building;
    if (!n) return;
    let s = levelDef(t, n.level),
      r = s.stages[n.stage];
    if (r.cure && !e && !n.cured) {
      n.cured = !0,
      n.cureLeft = r.cure * BUILD_SCALE.cure * (0.6 + 0.4 * tierScale(n.level)),
      n.cureUntil = !0,
      (n.stage === 0 || r.cure >= 2400) &&
      logEvent(
        i,
        1,
        `The ${r.name} of the ${s.label} ${r.name.endsWith("s") ? "are" : "is"} built and drying.`,
        [],
        t,
        "build"
      );
      return;
    }
    if (
    n.stage++,
    n.labor = 0,
    n.delivered = {},
    n.cured = !1,
    n.cureLeft = 0,
    n.cureUntil = null,
    n.stage >= s.stages.length)
    {
      levelDone(i, t);
      return;
    }
    let o = stageMats(s.stages[n.stage], tierScale(n.level));
    for (let a in o) {
      let l = Math.min(o[a], t.spare[a] || 0);
      l > 0 && (n.delivered[a] = l, t.spare[a] -= l);
    }
    (s.stages.length > 2 || stageLabor(r, tierScale(n.level)) > 1500) &&
    logEvent(
      i,
      1,
      `The ${s.label}: ${r.name} done, ${s.stages[n.stage].name} next.`,
      [],
      t,
      "build"
    );
  }
  function levelDone(i, t) {
    let e = t.building,
      n = levelDef(t, e.level);
    t.level = e.level + 1,
    t.built = t.built || [],
    t.built.push({
      lv: t.level,
      t: Math.round(i.t),
      took: Math.round(i.t - e.started)
    }),
    t.building = null,
    i.stats.levels = (i.stats.levels || 0) + 1;
    let r = Object.entries(t.contrib).
    filter(([u, f]) => f > 30 && i.byId[u]).
    sort((u, f) => f[1] - u[1]).
    map((u) => +u[0]);
    t.contribAll = t.contribAll || {};
    for (let [u, f] of Object.entries(t.contrib))
    t.contribAll[u] = (t.contribAll[u] || 0) + f;
    t.contrib = {};
    let o = t.owner && i.byId[t.owner],
      a = STRUCTURES[t.kind],
      l,
      c = durationText(i.t - e.started);
    if (o) {
      let u = r.filter((f) => f !== o.id);
      l =
      `${o.name}'s ${n.label} ${isAre(n.label)} finished` + (
      u.length ? `, with help from ${nameList(i, u)}` : "") +
      ` (${c}).`;
    } else {
      let u =
      r.length > 4 ?
      r.
      slice(0, 4).
      map((f) => i.byId[f].name).
      join(", ") + " and others" :
      nameList(i, r);
      l =
      `The ${n.label} ${isAre(n.label)} finished` + (
      r.length ? `, built by ${u}` : "") +
      ` (${c}).`;
    }
    logEvent(i, 3, l, r.length ? r : o ? [o.id] : [], t, "built");
    for (let u of r) {
      let f = i.byId[u];
      feel(f, i, "pride", 0.7),
      emote(f, i, "star", 4),
      f.counts.built++,
      f.desire[t.kind] =
      t.owner === f.id ?
      0 :
      Math.max(0, f.desire[t.kind] - (a.personal ? 0.1 : 0.7)),
      learnQ(i, f, "work|" + t.kind, 0.85),
      remember(i, f, "built", `We finished the ${n.label}.`, 0.75, {
        x: t.x,
        z: t.z,
        pv: 0.4
      }),
      f.interests.building = clamp(f.interests.building + 0.02, 0, 1);
      for (let p of r)
      if (p !== u) {
        let x = warmTo(f, i.byId[p], 0.04);
        x.fam = Math.min(1, x.fam + 0.05);
      }
    }
    let h = n.concept || a.concept,
      d = o || (r.length ? i.byId[r[0]] : null);
    if (d && h && !d.lex[h] && wordFor(i, d, h), t.kind === "garden") {
      for (t.beds = t.beds || []; t.beds.length < (n.beds || 4);)
      t.beds.push({ state: "empty", grow: 0, water: 0.5 });
      if (n.name === "plot" || n.name === "bed2" || n.name === "bed3") {
        let u = t.sowNext || 4,
          f = 0;
        for (let p of t.beds)
        p.state === "empty" &&
        f < u && (
        p.state = "growing", p.grow = 0, p.water = 0.8, f++);
      }
    }
    if (
    t.kind === "store" && (t.stock = t.stock || {}),
    t.kind === "workshop" && n.tools)

    for (let u of r) discover(i, i.byId[u], "tools", null);
    if (t.kind === "workshop" && n.tiles) {
      t.drying = t.drying || [];
      for (let u = 0; u < 6; u++) t.drying.push(i.t + 2400 * BUILD_SCALE.cure);
    }
    if (
    t.kind === "meeting" && n.name === "lanterns" && (t.lit = !0),
    t.kind === "dam")
    {
      for (let f of r) discover(i, i.byId[f], "dams", null);
      creekSyncDams(i), // CREEK: the dam goes into the creek model
      n.name === "banks" && plantDamBanks(i, t);
    }
    o && t.kind === "home" && (o.sleepSpot = { x: t.x, z: t.z });
    storyBuilt(i, t, n.label, r); // MINDS: the first of each thing built becomes a story
  }
  function durationText(i) {
    if (i < 90) return Math.round(i) + " seconds";
    if (i < 5400) return Math.round(i / 60) + " minutes";
    if (i < 86400 * 1.5) {
      let e = i / 3600;
      return (
        (e < 10 ? e.toFixed(1).replace(".0", "") : Math.round(e)) + " hours");

    }
    return (i / 86400).toFixed(1).replace(".0", "") + " days";
  }
  function markProject(i, t, e) {
    let n = e.kind,
      s = STRUCTURES[n];
    if (e.upgrade) {
      let d = i.byId[e.upgrade];
      if (!d || d.building || d.level >= s.levels.length) return !1;
      d.building = {
        level: d.level,
        stage: 0,
        delivered: {},
        labor: 0,
        cureLeft: 0,
        cureUntil: null,
        started: i.t,
        by: t.id
      },
      d.contrib = d.contrib || {},
      applySpare(d);
      let u = s.levels[d.level],
        f = d.owner ?
        d.owner === t.id ?
        "their" :
        `${i.byId[d.owner]?.name}'s` :
        "the";
      return (
        logEvent(
          i,
          2,
          `${t.name} has started work on ${withArticle(u.label)} for ${f === "their" ? "their own" : f} ${s.label}.`,
          [t.id],
          d,
          "project"
        ),
        t.desire[n] = Math.max(0, t.desire[n] - 0.25),
        emote(t, i, "idea", 3),
        !0);

    }
    let r = i.terrain;
    if (s.multi) {
      let d = i.structures.filter((u) => u.kind === n);
      if (d.length >= s.multi || d.some((u) => u.building)) return !1;
    } else if (!s.personal && i.structures.some((d) => d.kind === n)) return !1;
    if (
    s.personal &&
    i.structures.some((d) => d.kind === n && d.owner === t.id) ||
    s.interest && i.structures.some((d) => d.kind === n))

    return !1;
    let o = e.rot ?? i.rng.range(0, 6.28);
    if (n === "home" || n === "store" || n === "workshop") {
      let d = i.structures.filter((p) => p.kind === "home"),
        u = d.length ? d.reduce((p, x) => p + x.x, 0) / d.length : i.meadow.x,
        f = d.length ? d.reduce((p, x) => p + x.z, 0) / d.length : i.meadow.z;
      Math.hypot(u - e.x, f - e.z) > 1 && (
      o = Math.atan2(u - e.x, f - e.z) + i.rng.range(-0.4, 0.4));
    }
    let a = register(i, {
      id: i.nextId++,
      kind: n,
      x: +e.x.toFixed(2),
      z: +e.z.toFixed(2),
      rot: +o.toFixed(2),
      owner: s.personal ? t.id : null,
      founder: t.id,
      level: 0,
      t: Math.round(i.t),
      building: {
        level: 0,
        stage: 0,
        delivered: {},
        labor: 0,
        cureLeft: 0,
        cureUntil: null,
        started: i.t,
        by: t.id
      },
      contrib: {},
      spare: {}
    });
    if (n === "crossing" || n === "dam") {
      let d = a.z;
      a.x = +r.creekX(d).toFixed(2);
      let u = r.bankPoint(0, d, 0.4),
        f = r.bankPoint(1, d, 0.4);
      a.ends = [
      { x: +u.x.toFixed(2), z: +u.z.toFixed(2) },
      { x: +f.x.toFixed(2), z: +f.z.toFixed(2) }],

      a.rot = 0,
      n === "dam" && (a.pond = 0);
    }
    i.structures.push(a);
    let l = s.radius + 0.6;
    for (let d of i.res.slice())
    (d.kind === "sprout" || d.kind === "orchard" && d.stage <= 1) &&
    (d.x - a.x) ** 2 + (d.z - a.z) ** 2 < l * l &&
    removeThing(i, d, i.res);
    n === "home" && (t.home = a.id, t.sleepSpot = { x: a.x, z: a.z }),
    n === "store" && (a.stock = {}),
    t.desire[n] = Math.max(0, t.desire[n] - 0.3);
    let c = e.why ? " " + e.why : "",
      h = s.levels[0];
    return (
      logEvent(
        i,
        n === "home" ? 2 : 3,
        `${t.name} marked out a spot for ${withArticle(h.label)}${c}.`,
        [t.id],
        a,
        "project"
      ),
      remember(i, t, "project", `I decided to build a ${h.label}.`, 0.6, {
        x: a.x,
        z: a.z,
        pv: 0.2
      }),
      emote(t, i, "idea", 3),
      wordFor(i, t, s.concept),
      i._proposal = { yes: [], no: [] }, // MINDS: the others react to a proposal
      beSeen(i, t, {
        x: a.x,
        z: a.z,
        onSee: (d) => {
          d.desire[n] = (d.desire[n] || 0) + 0.05;
          s.personal || proposalReaction(i, t, n, d, i._proposal);
        }
      }),
      proposalLog(i, t, h.label, n, a, i._proposal),
      i._proposal = null,
      !0);

  }
  function plantDamBanks(i, t) {
    let e = i.terrain,
      n = i.rng,
      s = POND_SHAPE.len[3],
      r = 0,
      o = 0;
    for (let a = 0; a < 24 && (r < 3 || o < 2); a++) {
      let l = t.z - 1.2 - n.range(0, s - 1.5),
        c = a % 2,
        h = r < 3 && (a % 3 !== 2 || o >= 2),
        d = e.bankPoint(c, l, h ? n.range(1, 2) : n.range(0.3, 0.7));
      if (
      !e.walkable(d.x, d.z) ||
      i.res.some(
        (f) => (f.x - d.x) ** 2 + (f.z - d.z) ** 2 < (h ? 2.4 : 1.6) ** 2
      ) ||
      i.structures.some(
        (f) =>
        f !== t &&
        (f.x - d.x) ** 2 + (f.z - d.z) ** 2 <
        (STRUCTURES[f.kind].radius + 0.8) ** 2
      ))

      continue;
      let u = {
        id: i.nextId++,
        x: +d.x.toFixed(2),
        z: +d.z.toFixed(2),
        side: e.side(d.x, d.z)
      };
      h ? (
      register(i, {
        ...u,
        kind: "tree",
        variant: "willow",
        grow: 0.12,
        amt: 0,
        max: 2,
        canopy: 0.68,
        planted: t.id
      }),
      r++) : (
      register(i, { ...u, kind: "reeds", amt: 4, max: 8, marsh: !0 }), o++),
      i.res.push(i.byId[u.id]);
    }
  }
  function applySpare(i) {
    let t = STRUCTURES[i.kind].levels[i.building.level],
      e = stageMats(t.stages[0], tierScale(i.building.level));
    for (let n in e) {
      let s = Math.min(e[n], i.spare[n] || 0);
      s > 0 && (i.building.delivered[n] = s, i.spare[n] -= s);
    }
  }
  function beginAct(i, t, e) {
    e.tok = ++t.tok,
    e.rc0 = rainTotal(i, e.t0),
    t.act = e,
    e.type !== "walk" &&
    e.lookX !== void 0 &&
    Math.abs(e.lookX - t.x) + Math.abs(e.lookZ - t.z) > 0.1 && (
    t.face = Math.atan2(e.lookX - t.x, e.lookZ - t.z)),
    schedule(i, e.t1, "A", t.id, t.tok);
  }
  function setPlan(i, t, e, n = !0) {
    let s = t.act;
    if (s) {
      if (!s.final) {
        let r = positionAt(t, i.t);
        t.x = r.x, t.z = r.z, spendTime(i, t, s, i.t);
        let o = ACTIONS[s.step];
        o && o.abort && o.abort(i, t, s), t.asleep && wakeUp(i, t);
      }
      t.act = null, t.tok++;
    }
    t.plan = e, n && nextStep(i, t);
  }
  function isResumable(i) {
    return (
      !!i &&
      ["work", "forage", "garden", "plant", "craft", "explore"].includes(i.goal));

  }
  function onActEnd(i, t) {
    let e = t.act;
    if (!e) {
      nextStep(i, t);
      return;
    }
    e.path || (t.x = e.x, t.z = e.z), spendTime(i, t, e, e.t1), e.final = !0;
    let n = !0;
    if (e.joint) {
      if (endJoint(i, t, e) || t.act !== e) return;
    } else {
      let s = t.plan && t.plan.steps[t.plan.i - 1],
        r = ACTIONS[e.step];
      r && r.end && (n = r.end(i, t, e, s || {}));
    }
    t.act === e && (
    t.asleep || lookAround(i, t, e.type === "walk" ? 10 : 7),
    t.act = null,
    n === "again" && t.plan ? t.plan.i-- : n || (noteFailure(i, t), t.plan = null),
    t.plan &&
    shouldInterrupt(i, t) && (
    isResumable(t.plan) && !t.resume && (t.resume = t.plan), t.plan = null),
    nextStep(i, t));
  }
  function shouldInterrupt(i, t) {
    let e = t.plan.goal;
    if (e === "help" || e === "sleep" || e === "eat") return !1;
    if (t._eatNow) return t._eatNow = !1, !0;
    let n = t.needs;
    return !!(
    n.food < 0.12 && e !== "pod" ||
    i.weather.rain > 0 &&
    e !== "shelter" &&
    n.comfort < 0.25 &&
    shelterAt(i, t.x, t.z) < 0.5 &&
    !(t.interests.water > 0.6 && t.temp.caution < 0.45) ||
    isNight(i.t) && n.energy < 0.2 && e !== "sleep");

  }
  function nextStep(i, t) {
    for (let n = 0; n < 10; n++) {
      (!t.plan || t.plan.i >= t.plan.steps.length) && (
      t.resume && canResume(i, t, t.resume) && !urgentNeed(i, t) ? (
      t.plan = t.resume, t.resume = null) : (
      t.resume = null, t.plan = decide(i, t)));
      let s = t.plan.steps[t.plan.i++],
        r = ACTIONS[s.do],
        o = r ? r.start(i, t, s) : null;
      if (o !== "skip") {
        if (o) {
          o.step = s.do, beginAct(i, t, o);
          return;
        }
        noteFailure(i, t), t.plan = null;
      }
    }
    let e = ACTIONS.idle.start(i, t, { dur: 6 });
    e.step = "idle",
    t.plan = { goal: "idle", steps: [], i: 0 },
    beginAct(i, t, e);
  }
  function noteFailure(i, t) {
    if (!t.plan || !t.plan.goal) return;
    t.fails = t.fails || {};
    let e = t.fails[t.plan.goal] || (t.fails[t.plan.goal] = { t: 0, n: 0 });
    e.n = i.t - e.t < 900 ? e.n + 1 : 1, e.t = i.t;
  }
  function failurePenalty(i, t, e) {
    let n = t.fails && t.fails[e];
    return !n || i.t - n.t > 900 ? 1 : 1 / (1 + n.n);
  }
  function urgentNeed(i, t) {
    return (
      t.needs.food < 0.2 ||
      isNight(i.t) && t.needs.energy < 0.3 ||
      i.weather.rain > 0 && t.needs.comfort < 0.3);

  }
  function canResume(i, t, e) {
    if (e.sid) {
      let n = i.byId[e.sid];
      if (!n || !n.building) return !1;
    }
    return e.i < e.steps.length;
  }
  var isNightOwl = (i) => i.temp.activity > 0.68 && i.temp.curiosity > 0.5;
  function decide(i, t) {
    let e = t.needs,
      n = t.temp,
      s = i.rng,
      r = isNight(i.t),
      o = dayPhase(i.t),
      a = r && o > 0.82 && o < 0.82 + 0.08,
      l = i.weather.rain,
      c = shelterAt(i, t.x, t.z),
      h = t.interests.water > 0.6 && n.caution < 0.45,
      d = [],
      u = (x, g, m) => {
        g *= failurePenalty(i, t, x) * lifeGoalFactor(i, t, x), // LIFE: goals by stage
        g > 0.02 &&
        d.push({
          goal: x,
          score: g * (1 + s.range(-0.13, 0.13) * (0.6 + n.curiosity)),
          arg: m
        });
      };
    if (
    t.carry && u("deliver", 1.3),
    e.food < 0.74 &&
    u(
      "eat",
      0.2 +
      2.9 * Math.pow((0.74 - e.food) / 0.74, 1.25) + (
      pouchCount(t) > 0 ? 0.15 : 0)
    ),
    r)
    {
      let x = isNightOwl(t) && a && e.energy > 0.45;
      u("sleep", 1.5 + 1.4 * (1 - e.energy) - (x ? 1.1 : 0));
    } else
    e.energy < 0.3 && u("nap", 0.5 + 2.3 * (0.3 - e.energy) / 0.3),
    o > 0.82 - 0.04 && e.energy < 0.55 && u("sleep", 0.9 + (1 - e.energy));
    l > 0 &&
    c < 0.5 &&
    u(
      "shelter",
      0.35 +
      1.25 * (1 - e.comfort) +
      0.45 * n.caution +
      0.35 * l +
      0.3 * t.wet - (
      h ? 0.85 : 0)
    );
    let f = r ? 0.22 : 1;
    if (!r || a) {
      let x = clamp((0.72 - e.social) / 0.72, 0, 1),
        g = o > 0.62 ? 1.35 : 1;
      u(
        "social",
        (0.12 * n.sociability +
        1.7 * Math.pow(x, 1.2) * (0.45 + n.sociability)) *
        f *
        g
      );
    }
    let p = clamp((0.74 - e.fun) / 0.74, 0, 1);
    if (
    u(
      "play",
      (0.12 + 1.55 * Math.pow(p, 1.2) * (0.6 + 0.6 * n.curiosity)) * f
    ),
    u(
      "explore",
      ((0.05 +
      0.5 * n.curiosity * t.interests.exploring * (e.fun < 0.8 ? 1 : 0.5)) / (
      1 + 0.4 * habitStrength(t, i, "explore")) + (
      e.food < 0.6 && knownFood(i, t) < 1 ? 0.6 : 0)) * (
      r ? 0.05 : 1)
    ),
    u(
      "rest",
      (0.1 +
      0.3 * (1 - n.activity) * (e.energy < 0.7 ? 1 : 0.5) + (
      t.mood > 0.4 ? 0.05 : 0)) / (
      1 + 0.5 * habitStrength(t, i, "rest")) *
      f
    ),
    r)
    {
      if (isNightOwl(t) || e.energy > 0.7) {
        let x = bestWork(i, t, !0);
        x && u("work", x.value * 0.8 * (1 - t.workFatigue), x),
        isNightOwl(t) &&
        e.energy > 0.45 &&
        u("explore", 0.35 + 0.6 * n.curiosity * (t.know.glowcap ? 0.4 : 1));
      }
    } else {
      let x = bestWork(i, t);
      if (x) {
        let v = Math.min(
            1,
            e.food * 2.2,
            e.energy * 2.8,
            l > 0 && !x.dry ? 0.5 + 0.5 * (h ? 1 : c) : 1
          ),
          E = o < 0.45 ? 1.15 : o > 0.62 ? 0.72 : 1;
        u(
          "work",
          x.value * (
          0.5 + 0.6 * n.persistence) *
          Math.pow(1 - t.workFatigue, 1.3) *
          v *
          E,
          x
        );
      }
      let g = 0;
      for (let v in t.desire) t.desire[v] > g && (g = t.desire[v]);
      let m = g >= 0.35 ? foundOption(i, t) : null;
      m && u("found", m.score, m);
      let b = podOption(i, t);
      b && u("pod", b.score, b);
      let T = gardenOption(i, t);
      T && u("garden", T.score, T);
      let y = plantOption(i, t);
      y && u("plant", y.score, y);
      let S = craftOption(i, t);
      S && u("craft", S.score, S);
      let M = forageOption(i, t);
      M && u("forage", M.score, M);
      let A = shareOption(i, t);
      A && u("share", A.score, A);
    }
    u("wander", 0.1), d.sort((x, g) => g.score - x.score);
    for (let x of d) {
      let g = planFor(i, t, x.goal, x.arg);
      if (g)
      return (
        g.goal = g.goal || x.goal,
        g.i = 0,
        g.score = +x.score.toFixed(2),
        t.lastDecision = x.goal,
        g);

    }
    return { goal: "idle", i: 0, steps: [{ do: "idle", dur: 5 }] };
  }
  function planFor(i, t, e, n) {
    switch (e) {
      case "deliver":
        return planDeliver(i, t);
      case "eat":
        return planEat(i, t);
      case "sleep":
        return planSleep(i, t, !1);
      case "nap":
        return planSleep(i, t, !0);
      case "shelter":
        return planShelter(i, t);
      case "social":
        return planSocial(i, t);
      case "play":
        return planPlay(i, t);
      case "explore":
        return planExplore(i, t);
      case "work":
        return planWork(i, t, n);
      case "found":
        return planFound(i, t, n);
      case "pod":
        return planPod(i, t, n);
      case "garden":
        return n.plan;
      case "plant":
        return n.plan;
      case "craft":
        return n.plan;
      case "forage":
        return n.plan;
      case "share":
        return n.plan;
      case "wander":
        return planWander(i, t);
      case "rest":
        return planRest(i, t);
    }
    return null;
  }
  var REGROW_RATES = {
    tree: 1 / 34,
    bush: 1 / 7,
    reeds: 1 / 6,
    stones: 1 / 24,
    clay: 1 / 4,
    glowcap: 1 / 5,
    orchard: 1 / 12
  };
  function expectedAmount(i, t, e) {
    let n = t.seen[e.id];
    if (!n) return -1;
    let s = n.a + (i.t - n.t) / 60 * (REGROW_RATES[e.kind] || 0) * 0.7;
    if (e.max && (s = Math.min(e.max, s)), n.src) {
      let r = i.byId[n.src];
      r && (s *= (relation(t, r).toldTrue + 1.5) / (relation(t, r).told + 2));
    }
    return s;
  }
  var seenCache = new WeakMap();
  function seenByKind(i, t) {
    let e = seenCache.get(t);
    if (e && e.t === i.t) return e.by;
    let n = {};
    for (let s in t.seen) {
      let r = i.byId[s];
      r && (n[r.kind] || (n[r.kind] = [])).push(r);
    }
    return seenCache.set(t, { t: i.t, by: n }), n;
  }
  function knownFood(i, t) {
    let e = 0,
      n = seenByKind(i, t);
    for (let s of n.bush || []) expectedAmount(i, t, s) >= 1 && e++;
    for (let s of n.orchard || []) s.stage >= 3 && expectedAmount(i, t, s) >= 1 && e++;
    return e;
  }
  var SOURCE_KIND = {
    branch: "tree",
    reeds: "reeds",
    stone: "stones",
    clay: "clay",
    glowcap: "glowcap"
  };
  function fetchPlan(i, t, e, n, s = 1) {
    let r = isNight(i.t);
    if (
    e === "mud" && !t.know.mud ||
    e === "clay" && !t.know.clay ||
    e === "glowcap" && (!t.know.glowcap || !r) ||
    e === "glowcap" && !r)

    return null;
    if (e === "tile") {
      let h = findStructure(i, "workshop", (u) => u.level >= 4);
      if (!h || !(h.stock && h.stock.tile > 0)) return null;
      let d = Math.min(h.stock.tile, s, 1);
      return {
        cost: travelCost(i, t, t.x, t.z, h.x, h.z) + travelCost(i, t, h.x, h.z, n.x, n.z),
        steps: [
        { do: "walk", x: h.x, z: h.z, near: 1.4 },
        { do: "take", sid: h.id, k: "tile" }],

        n: d
      };
    }
    if (e === "seeds" && t.pouch && t.pouch.seeds)
    return {
      cost: travelCost(i, t, t.x, t.z, n.x, n.z),
      steps: [{ do: "unpouch", k: "seeds" }],
      n: Math.min(s, t.pouch.seeds)
    };
    let o = null,
      a = Math.min(carryCapacity(t, e), s),
      l = findStructure(i, "store", (h) => h.level > 0 && h.stock && h.stock[e] > 0);
    if (l && l !== n) {
      let h = travelCost(i, t, t.x, t.z, l.x, l.z) + travelCost(i, t, l.x, l.z, n.x, n.z) + 4,
        d = Math.min(a, l.stock[e]);
      o = {
        cost: h / d,
        steps: [
        { do: "walk", x: l.x, z: l.z, near: 1.5 },
        ...Array(d).
        fill(0).
        map(() => ({ do: "take", sid: l.id, k: e }))],

        n: d
      };
    }
    if (e === "mud") {
      let h = n.ends ? i.terrain.side(t.x, t.z) : i.terrain.side(n.x, n.z),
        d = i.terrain.bankPoint(h, n.ends ? n.z - 1.2 : n.z, 0.5),
        f = {
          cost:
          (travelCost(i, t, t.x, t.z, d.x, d.z) +
          travelCost(i, t, d.x, d.z, n.x, n.z) +
          (t.tools.stick ? 6 : 10) * a) /
          a,
          steps: [
          { do: "walk", x: d.x, z: d.z, near: 0 },
          ...Array(a).
          fill(0).
          map(() => ({ do: "dig" }))],

          n: a
        };
      return (!o || f.cost < o.cost) && (o = f), o;
    }
    let c = SOURCE_KIND[e];
    if (!c) return o;
    for (let h of seenByKind(i, t)[c] || []) {
      let d = expectedAmount(i, t, h);
      if (d < 1) continue;
      let u = Math.min(a, Math.floor(d)),
        f =
        (travelCost(i, t, t.x, t.z, h.x, h.z) +
        travelCost(i, t, h.x, h.z, n.x, n.z) +
        6 * u) /
        u + (
        d < 2 ? 15 : 0);
      (!o || f < o.cost) && (
      o = {
        cost: f,
        steps: [
        { do: "walk", x: h.x, z: h.z, near: 1 },
        ...Array(u).
        fill(0).
        map(() => ({ do: "pick", rid: h.id }))],

        n: u
      });
    }
    return o;
  }
  function planDeliver(i, t) {
    let e = t.carry.k,
      n = null,
      s = 1e9;
    for (let o of i.structures) {
      if (
      !o.building ||
      o.building.cureLeft > 0 ||
      o.owner && o.owner !== t.id && relation(t, o.owner).warmth < 0.45 ||
      !missingMats(i, o, t)[e])

      continue;
      let l = travelCost(i, t, t.x, t.z, o.x, o.z);
      l < s && (s = l, n = o);
    }
    if (n) {
      let o = STRUCTURES[n.kind].radius;
      return {
        goal: "work",
        sid: n.id,
        mat: e,
        n: t.carry.n,
        steps: [walkToStructure(i, n, t.x, t.z, o + 0.3), { do: "deposit", sid: n.id }]
      };
    }
    if (e === "clay") {
      let o = findStructure(i, "workshop", (a) => a.level >= 4);
      if (o)
      return {
        goal: "work",
        steps: [
        { do: "walk", x: o.x, z: o.z, near: 1.5 },
        { do: "shape", sid: o.id }]

      };
    }
    let r = findStructure(i, "store", (o) => o.level > 0);
    return r ?
    {
      goal: "forage",
      steps: [
      { do: "walk", x: r.x, z: r.z, near: 1.5 },
      { do: "stash", sid: r.id }]

    } :
    { goal: "deliver", steps: [{ do: "drop" }] };
  }
  function planEat(i, t) {
    let e = favoriteSnack(t);
    if (e && (t.needs.food < 0.45 || tasteValue(t, e) > 0.5)) {
      let c = Math.max(
        1,
        Math.min(t.pouch[e], Math.ceil((0.9 - t.needs.food) / FOODS[e].nutrition))
      );
      return {
        goal: "eat",
        steps: Array(c).
        fill(0).
        map(() => ({ do: "eat", food: e }))
      };
    }
    let n = null,
      s = 0,
      r = (c, h, d) => {
        let u = c / (1 + h / 50);
        u > s && (s = u, n = d);
      },
      o = findStructure(i, "store", (c) => c.level > 0 && c.stock);
    if (o)
    for (let c of ["greens", "fruit", "bluberry", "berry", "seeds"]) {
      let h = o.stock[c] || 0;
      if (h <= 0) continue;
      let d = Math.min(h, 3);
      r(tasteValue(t, c) * FOODS[c].nutrition * d * 1.1, travelCost(i, t, t.x, t.z, o.x, o.z), [
      { do: "walk", x: o.x, z: o.z, near: 1.5 },
      ...Array(d).
      fill(0).
      map(() => ({ do: "take", sid: o.id, k: c })),
      ...Array(d).
      fill(0).
      map(() => ({ do: "eat", food: c }))]
      );
    }
    let a = seenByKind(i, t);
    for (let c of [
    ...(a.bush || []),
    ...(a.orchard || []),
    ...(a.reeds || [])].
    sort((h, d) => h.id - d.id)) {
      let h = null;
      if (
      c.kind === "bush" ?
      h = c.food :
      c.kind === "orchard" && c.stage >= 3 ?
      h = "fruit" :
      c.kind === "reeds" && t.needs.food < 0.35 && (h = "root"),
      !h)

      continue;
      let d = expectedAmount(i, t, c);
      if (d < 1) continue;
      let u = Math.max(
          1,
          Math.min(
            Math.floor(d),
            Math.ceil((0.92 - t.needs.food) / FOODS[h].nutrition),
            4
          )
        ),
        f = travelCost(i, t, t.x, t.z, c.x, c.z),
        p = placeFeeling(t, c.x, c.z),
        x = [
        { do: "walk", x: c.x, z: c.z, near: 1 },
        ...Array(u).
        fill(0).
        map(() => ({ do: "graze", rid: c.id }))];

      d > u + 1 &&
      pouchCount(t) === 0 &&
      i.rng.chance(0.25 + 0.3 * t.temp.caution) &&
      x.push({ do: "pick", rid: c.id }),
      r(tasteValue(t, h) * FOODS[h].nutrition * u * (1 + 0.3 * p), f, x);
    }
    let l = findStructure(
      i,
      "garden",
      (c) => c.beds && c.beds.some((h) => h.state === "ready")
    );
    return (
      l &&
      r(tasteValue(t, "greens") * 0.2 * 3, travelCost(i, t, t.x, t.z, l.x, l.z), [
      { do: "walk", x: l.x, z: l.z, near: 1.8 },
      { do: "harvest", sid: l.id },
      { do: "eat", food: "greens" },
      { do: "eat", food: "greens" }]
      ),
      e && r(tasteValue(t, e) * FOODS[e].nutrition * 1.6, 0, [{ do: "eat", food: e }]),
      n ? { goal: "eat", steps: n } : null);

  }
  function sleepSpot(i, t) {
    let e = homeOf(i, t);
    if (e && e.level > 0) return { x: e.x, z: e.z, home: !0 };
    let n = null,
      s = 0.45;
    for (let c of i.structures) {
      if (c.kind !== "home" || c.level < 2 || !c.owner || c.owner === t.id)
      continue;
      let h = relation(t, c.owner);
      h.warmth > s && (s = h.warmth, n = c);
    }
    if (n) return { x: n.x + 0.6, z: n.z + 0.4, friend: n.owner };
    if (t.sleepSpot) return t.sleepSpot;
    let r = i.meadow.x,
      o = i.meadow.z,
      a = null,
      l = -1e9;
    for (let c of i.res) {
      if (c.kind !== "tree" && c.kind !== "podtree" || c.side !== 0) continue;
      let d =
      -dist2d(c.x, c.z, r, o) * 0.4 +
      placeFeeling(t, c.x, c.z) * 3 +
      i.rng.range(0, 3) -
      i.creatures.filter(
        (u) =>
        u.sleepSpot && dist2d(u.sleepSpot.x, u.sleepSpot.z, c.x, c.z) < 1.2
      ).length *
      1.5;
      d > l && (l = d, a = c);
    }
    if (a) {
      let c = i.rng.range(0, 6.28);
      return (
        t.sleepSpot = {
          x: +(a.x + Math.cos(c) * 1).toFixed(2),
          z: +(a.z + Math.sin(c) * 1).toFixed(2)
        },
        t.sleepSpot);

    }
    return { x: t.x, z: t.z };
  }
  function planSleep(i, t, e) {
    let n = sleepSpot(i, t),
      s = dist2d(t.x, t.z, n.x, n.z);
    return e && s > 14 ?
    { goal: "nap", steps: [{ do: "nap" }] } :
    {
      goal: e ? "nap" : "sleep",
      steps: [
      { do: "walk", x: n.x, z: n.z, near: 0.3, why: "sleep" },
      { do: e ? "nap" : "sleep" }]

    };
  }
  function planShelter(i, t) {
    let e = null,
      n = -1e9;
    for (let o of i.structures) {
      let a = builtLevelDef(o);
      if (
      !a ||
      !a.shelter ||
      a.shelter < 0.7 ||
      o.kind === "home" && o.owner !== t.id && relation(t, o.owner).warmth < 0.25)

      continue;
      let l = travelCost(i, t, t.x, t.z, o.x, o.z),
        c = a.shelter * 30 - l + (o.owner === t.id ? 15 : 0);
      c > n && (n = c, e = { x: o.x, z: o.z, r: 0.5 });
    }
    for (let o of i.res) {
      if (
      o.kind !== "tree" &&
      o.kind !== "podtree" &&
      !(o.kind === "orchard" && o.stage >= 3))

      continue;
      let a = travelCost(i, t, t.x, t.z, o.x, o.z),
        l = 0.55 * 30 - a + qValue(t, "shelter|tree") * 5;
      l > n && (n = l, e = { x: o.x + 0.5, z: o.z + 0.4, r: 0.2 });
    }
    if (!e) return null;
    let s = [
      { do: "walk", x: e.x, z: e.z, near: e.r, run: !0, why: "shelter" }],

      r = i.structures.find((o) => o.kind === "chimes" && o.level > 0);
    return (
      r &&
      t.interests.sound > 0.5 &&
      dist2d(t.x, t.z, r.x, r.z) < 18 && (
      s[0] = {
        do: "walk",
        x: r.x + 1.2,
        z: r.z + 0.8,
        near: 0.3,
        why: "listen"
      }),
      s.push({ do: "huddle" }),
      { goal: "shelter", steps: s });

  }
  function planSocial(i, t) {
    let e = null,
      n = 0;
    for (let o of i.creatures) {
      if (o === t || o.asleep || o.act && UNINTERRUPTIBLE.has(o.act.type)) continue;
      let a = positionAt(o, i.t),
        l = dist2d(t.x, t.z, a.x, a.z);
      if (l > 24) continue;
      let c = relation(t, o),
        h =
        (c.warmth + 0.45) * (
        c.fam + 0.35) *
        acceptRate(c) * (
        1 - l / 32) * (
        1 - 0.6 * c.annoy) *
        i.rng.range(0.7, 1.3) + (
        o.needs.social < 0.4 ? 0.1 : 0);
      h > n && (n = h, e = o);
    }
    if (!e) return null;
    let s = relation(t, e),
      r = "chat";
    return (
      t.needs.fun < 0.5 && t.temp.activity > 0.45 && i.rng.chance(0.5) ?
      r = "play2" :
      s.warmth > 0.35 && (
      t.needs.comfort < 0.6 || i.rng.chance(0.25)) && (
      r = "groom"),
      {
        goal: "social",
        with: e.id,
        steps: [
        { do: "approach", id: e.id },
        { do: "invite", id: e.id, kind: r }]

      });

  }
  function planPlay(i, t) {
    let e = i.terrain,
      n = i.rng,
      s = t.interests,
      r = [],
      o = (x) => 1 / (1 + 0.45 * habitStrength(t, i, x)),
      a = i.weather.rain > 0;
    if (t.fearWater < 0.92) {
      let x = clamp(t.z + n.range(-6, 6), 6, 58),
        g = t.know.dams ?
        null :
        i.res.find((y) => y.kind === "snag" && t.seen[y.id]);
      g &&
      dist2d(t.x, t.z, g.x, g.z) < 26 &&
      n.chance(0.08 + 0.2 * s.water) && (
      x = g.z - n.range(0.6, 2.2));
      let m = e.side(t.x, t.z),
        b = t.fearWater > 0.6 ? 2.6 : t.fearWater > 0.35 ? 1.3 : 0.5,
        T = e.bankPoint(m, x, b);
      if (
      e.walkable(T.x, T.z) &&
      r.push({
        w: s.water * o("watch") * (1 - 0.5 * t.fearWater),
        steps: [{ do: "walk", x: T.x, z: T.z, near: 0.2 }, { do: "watch" }]
      }),
      !t.know.mud || n.chance(0.2))
      {
        let y = e.bankPoint(m, x, 0.6);
        e.walkable(y.x, y.z) &&
        r.push({
          w:
          (0.25 + s.building * 0.7) *
          o("mudpie") * (
          a ? 0.3 : 1) * (
          1 - 0.6 * t.fearWater),
          steps: [
          { do: "walk", x: y.x, z: y.z, near: 0 },
          { do: "play", kind: "mudpie", lx: e.creekX(y.z), lz: y.z }]

        });
      }
    }
    a &&
    s.water > 0.55 &&
    r.push({
      w: s.water * o("dance"),
      steps: [{ do: "play", kind: "dance" }]
    });
    let l = nearestDam(i, t, 28);
    if (l && t.fearWater < 0.9) {
      let x = POND_SHAPE.len[l.level],
        g = l.z - n.range(1, Math.max(1.5, x - 1.5)),
        m = e.side(t.x, t.z),
        b = e.bankPoint(m, g, 0.9 + n.range(0, 0.9)),
        T = Math.min(1, (i.hydro && i.hydro.marsh || 0) / 40);
      e.walkable(b.x, b.z) &&
      r.push({
        w:
        (0.25 + s.water + 0.5 * s.growing) * (
        0.6 + 0.4 * l.pond + 0.5 * T) *
        o("pond") * (
        a ? 0.4 : 1),
        steps: [
        { do: "walk", x: b.x, z: b.z, near: 0.2 },
        { do: "watch", pond: l.id }]

      });
    }
    let c = randomSpotNear(i, t, 3, 7);
    c &&
    r.push({
      w: s.building * 0.8 * o("stack"),
      steps: [
      { do: "walk", x: c.x, z: c.z, near: 0 },
      { do: "play", kind: "stack" }]

    });
    let h = randomSpotNear(i, t, 5, 12);
    h &&
    r.push({
      w: s.collecting * o("collect"),
      steps: [
      { do: "walk", x: h.x, z: h.z, near: 0 },
      { do: "play", kind: "collect" }]

    });
    let d = frontierSpot(i, t, "log", 26);
    d &&
    r.push({
      w: s.sound * o("drum"),
      steps: [
      { do: "walk", x: d.x, z: d.z, near: 0.9 },
      { do: "play", kind: "drum", lx: d.x, lz: d.z }]

    });
    let u = frontierSpot(i, t, "boulder", 24);
    u &&
    r.push({
      w: (0.2 + s.exploring * 0.6) * o("perch"),
      steps: [
      { do: "walk", x: u.x, z: u.z, near: 0.1 },
      { do: "play", kind: "perch" }]

    });
    let f = i.res.find(
      (x) =>
      (x.kind === "sprout" || x.kind === "orchard") &&
      dist2d(x.x, x.z, t.x, t.z) < 20
    );
    f &&
    r.push({
      w: s.growing * o("admire"),
      steps: [
      { do: "walk", x: f.x, z: f.z, near: 0.8 },
      { do: "play", kind: "admire", lx: f.x, lz: f.z }]

    });
    let p = n.weighted(r, (x) => x.w);
    return p ? { goal: "play", steps: p.steps } : null;
  }
  function nearestDam(i, t, e) {
    let n = null,
      s = e;
    for (let r of i.structures) {
      if (r.kind !== "dam" || !(r.level > 0) || !(r.pond > 0.3)) continue;
      let o = dist2d(r.x, r.z, t.x, t.z);
      o < s && (s = o, n = r);
    }
    return n;
  }
  function randomSpotNear(i, t, e, n) {
    for (let s = 0; s < 12; s++) {
      let r = i.rng.range(0, 6.28),
        o = i.rng.range(e, n),
        a = t.x + Math.cos(r) * o,
        l = t.z + Math.sin(r) * o;
      if (
      i.terrain.walkable(a, l) &&
      i.terrain.side(a, l) === i.terrain.side(t.x, t.z))

      return { x: a, z: l };
    }
    return null;
  }
  function frontierSpot(i, t, e, n) {
    let s = null,
      r = n;
    for (let o of i.res) {
      if (o.kind !== e) continue;
      let a = dist2d(o.x, o.z, t.x, t.z);
      a < r &&
      i.terrain.side(o.x, o.z) === i.terrain.side(t.x, t.z) && (
      r = a, s = o);
    }
    return s;
  }
  function planExplore(i, t) {
    let e = i.terrain,
      n = i.rng;
    t.explored = t.explored || {};
    let s = null,
      r = -1e9;
    for (let o = 0; o < 14; o++) {
      let a = e.randomPoint(n, { maxR: 0.88 });
      if (!a) continue;
      let l = Math.floor(a.x / 8) + "," + Math.floor(a.z / 8),
        c = t.explored[l] || 0,
        h = travelCost(i, t, t.x, t.z, a.x, a.z),
        d =
        -c * 25 -
        h * (0.6 - 0.35 * t.temp.curiosity) +
        placeFeeling(t, a.x, a.z) * 10 +
        n.range(0, 10);
      d > r && (r = d, s = a);
    }
    return s ?
    {
      goal: "explore",
      steps: [
      { do: "walk", x: s.x, z: s.z, near: 0, why: "explore" },
      { do: "survey" }]

    } :
    null;
  }
  function planRest(i, t) {
    let e = null,
      n = 0.05;
    for (let r = 0; r < 6; r++) {
      let o = randomSpotNear(i, t, 1, 8);
      if (!o) continue;
      let a = placeFeeling(t, o.x, o.z) + (shelterAt(i, o.x, o.z) > 0.4 ? 0.05 : 0);
      a > n && (n = a, e = o);
    }
    let s = e ? [{ do: "walk", x: e.x, z: e.z, near: 0 }] : [];
    return (
      s.push({ do: "idle", kind: "sit", dur: i.rng.range(30, 80) }),
      { goal: "rest", steps: s });

  }
  function planWander(i, t) {
    let e = randomSpotNear(i, t, 1.5, 5);
    return e ?
    {
      goal: "wander",
      steps: [
      { do: "walk", x: e.x, z: e.z, near: 0 },
      { do: "idle", dur: i.rng.range(3, 9), kind: "sit" }]

    } :
    { goal: "wander", steps: [{ do: "idle", dur: 6 }] };
  }
  function mayHelpBuild(i, t, e) {
    return !e.owner || e.owner === t.id ? !0 : relation(t, e.owner).warmth > 0.45;
  }
  function workStepFor(i, t, e, n = !1) {
    if (!e.building || e.building.cureLeft > 0) return null;
    let s = currentStage(e);
    if (!s || s.wet && i.weather.rain > 1) return null;
    if (matsComplete(e))
    return n ?
    null :
    {
      type: s.heavy ? "heavy" : "labor",
      cost: travelCost(i, t, t.x, t.z, e.x, e.z),
      dry: !!builtLevelDef(e)?.shelter
    };
    let r = missingMats(i, e, t),
      o = null;
    for (let a in r) {
      if (n && a !== "glowcap") continue;
      let l = fetchPlan(i, t, a, e, r[a]);
      l && (
      !o || l.cost < o.cost) && (
      o = { type: "gather", mat: a, src: l, cost: l.cost });
    }
    if (!o) {
      if (r.tile) {
        let a = findStructure(i, "workshop", (l) => l.level >= 4);
        if (a && t.know.clay && !n) {
          let l = fetchPlan(i, t, "clay", a, 1);
          if (l) return { type: "tiles", ws: a, src: l, cost: l.cost + 60 };
        }
      }
      return null;
    }
    return o;
  }
  function bestWork(i, t, e = !1) {
    let n = null;
    for (let s of i.structures) {
      if (!s.building || !mayHelpBuild(i, t, s)) continue;
      let r = workStepFor(i, t, s, e);
      if (!r) continue;
      let o = STRUCTURES[s.kind],
        a;
      s.owner === t.id ?
      a = 0.75 + 0.3 * Math.min(1.5, t.desire[s.kind]) :
      s.owner ?
      a =
      0.15 +
      0.35 * clamp(relation(t, s.owner).warmth, 0, 1) +
      0.15 * t.interests.building : (
      a =
      0.38 +
      0.4 * Math.min(1.4, t.desire[s.kind] || 0) +
      0.22 * t.interests.building +
      0.2 * clamp(relation(t, s.founder).warmth, 0, 1) +
      0.25 * (qValue(t, "work|" + s.kind) - 0.5),
      o.interest && (a += 0.3 * (t.interests[o.interest] || 0)),
      o.likes && (a += 0.25 * (t.interests[o.likes] || 0))),
      r.type === "heavy" && (
      a *= 0.65 + 0.7 * Math.max(qValue(t, "heavy|duo"), qValue(t, "heavy|solo"))),
      a *= 1 / (1 + r.cost / 140),
      t.plan && t.plan.sid === s.id && (a *= 1.15),
      (!n || a > n.value) && (n = { value: a, s, task: r, dry: r.dry });
    }
    if (!e)
    for (let s of i.structures) {
      if (
      s.building ||
      !(s.level > 0) ||
      (s.cond ?? 1) >= 0.6 ||
      s.owner && s.owner !== t.id && relation(t, s.owner).warmth < 0.45 ||
      i.creatures.some(
        (h) =>
        h !== t &&
        h.plan &&
        h.plan.goal === "work" &&
        h.plan.repair === s.id
      ))

      continue;
      let r = 0.6 - s.cond,
        o =
        (s.owner === t.id ?
        0.65 :
        0.32 + 0.2 * t.interests.building + 0.15 * t.temp.generosity) +
        r,
        a = repairMaterial(s),
        l = a ? fetchPlan(i, t, a, s, 1) : null,
        c = l ? l.cost : travelCost(i, t, t.x, t.z, s.x, s.z);
      o *= 1 / (1 + c / 140),
      (!n || o > n.value) && (
      n = {
        value: o,
        s,
        task: { type: "repair", mat: a, src: l, cost: c },
        dry: !1
      });
    }
    return n;
  }
  function planWork(i, t, e) {
    let n = e.s,
      s = e.task,
      r = STRUCTURES[n.kind].radius,
      o =
      s.src && s.src.steps[0] && s.src.steps[0].do === "walk" ?
      s.src.steps[0] :
      t,
      a = walkToStructure(i, n, o.x, o.z, r + 0.3);
    if (s.type === "gather")
    return {
      goal: "work",
      sid: n.id,
      mat: s.mat,
      n: s.src.n,
      steps: [
      ...s.src.steps.map((c) => ({ ...c })),
      a,
      { do: "deposit", sid: n.id }]

    };
    if (s.type === "tiles")
    return {
      goal: "work",
      sid: s.ws.id,
      steps: [
      ...s.src.steps.map((c) => ({ ...c })),
      { do: "walk", x: s.ws.x, z: s.ws.z, near: 1.5 },
      { do: "shape", sid: s.ws.id }]

    };
    if (s.type === "repair") {
      let c = s.src ? s.src.steps.slice(0, 2).map((h) => ({ ...h })) : [];
      return {
        goal: "work",
        repair: n.id,
        steps: [
        ...c,
        walkToStructure(i, n, o.x, o.z, r * 0.6 + 0.4),
        { do: "repair", sid: n.id }]

      };
    }
    let l = [walkToStructure(i, n, t.x, t.z, r * 0.6 + 0.4)];
    if (s.type === "heavy") {
      let c = chooseGesture(i, t, "heavy");
      c && l.push({ do: "gesture", g: c, task: "heavy" });
      let h = qValue(t, "heavy|solo") < 0.35 && qCount(t, "heavy|solo") > 0.3;
      return (
        l.push({ do: "heavy", sid: n.id, solo: !h }),
        l.push({ do: "seek", obj: { t: "heavy", id: n.id } }),
        { goal: "work", sid: n.id, steps: l });

    }
    return (
      l.push({ do: "labor", sid: n.id }), { goal: "work", sid: n.id, steps: l });

  }
  function planPod(i, t, e) {
    let n = e.pod,
      s = [
      { do: "walk", x: n.x, z: n.z, near: 0.9, why: "pod" },
      { do: "look", x: n.x, z: n.z, dur: 1.2, icon: "think" }],

      r = chooseGesture(i, t, "lift");
    return (
      r && s.push({ do: "gesture", g: r, task: "lift" }),
      qValue(t, "pod|solo") < 0.35 || s.push({ do: "lift", pid: n.id }),
      s.push({ do: "seek", obj: { t: "pod", id: n.id } }),
      { goal: "pod", pid: n.id, steps: s });

  }
  function podOption(i, t) {
    let e = null,
      n = 0;
    for (let s of i.pods) {
      if (
      !t.seen[s.id] ||
      podClaimed(i, s.id) ||
      (s.need || 2) > 3 && t.temp.persistence < 0.6)

      continue;
      let r = travelCost(i, t, t.x, t.z, s.x, s.z),
        o = 1 - t.needs.food,
        a = qValue(t, "pod|solo"),
        l = Math.max(qValue(t, "pod|duo"), qValue(t, "pod|trio")),
        c = Math.max(a, l * (0.6 + 0.4 * qValue(t, "ask"))),
        h = t.counts.pods === 0 ? 0.25 * t.temp.curiosity : 0,
        d =
        (0.3 +
        0.9 * o * (0.7 + tasteValue(t, "seeds")) +
        h +
        0.35 * t.interests.growing * (t.know.planting ? 1 : 0) +
        0.15 * t.temp.curiosity) *
        c / (
        1 + r / 90);
      d > n && (n = d, e = { pod: s, score: d });
    }
    return e;
  }
  function podClaimed(i, t) {
    for (let e of i.creatures)
    if (
    e.plan && e.plan.goal === "pod" && e.plan.pid === t ||
    e.act && e.act.obj && e.act.obj.t === "pod" && e.act.obj.id === t)

    return !0;
    return !1;
  }
  function openProjects(i) {
    return i.structures.filter((t) => t.building && !t.owner).length;
  }
  function foundOption(i, t) {
    let e = null,
      n = i.structures.filter((a) => a.kind === "home" && a.level > 0).length,
      s = i.structures.reduce((a, l) => a + l.level, 0),
      r = 2 + (s > 14 ? 1 : 0),
      o = 0.55 + 0.35 * t.temp.persistence + 0.25 * t.temp.curiosity;
    for (let a of STRUCTURE_KINDS) {
      let l = STRUCTURES[a],
        c = t.desire[a] || 0,
        h,
        d = null,
        u = null;
      if (l.multi) {
        let p = projectReason(i, t, a, s, r);
        if (!p) continue;
        h = p.thr, d = p.target || null, u = p.upgrade || null;
      } else if (l.personal) {
        if (
        l.interest && t.sig !== l.interest ||
        l.interest &&
        i.structures.some((x) => x.kind === a && x.owner !== t.id))

        continue;
        let p = i.structures.find((x) => x.kind === a && x.owner === t.id);
        if (!p) h = a === "home" ? 0.35 : 0.9, d = "new";else
        if (
        !p.building &&
        p.level < l.levels.length &&
        canBuildLevel(i, p, p.level, t))

        h =
        (0.55 + 0.25 * p.level) * (
        1.25 - 0.5 * t.interests.building + 0.2 * t.temp.patience),
        u = p,
        l.interest && (h = 1.1 + 0.3 * p.level),
        a === "home" && p.level >= 2 && n < 3 && (h += 0.3);else
        continue;
        if (
        a !== "home" &&
        !i.structures.some(
          (x) => x.kind === "home" && x.owner === t.id && x.level > 0
        ))

        continue;
      } else {
        let p = findStructure(i, a);
        if (p) {
          if (
          !p.building &&
          p.level < l.levels.length &&
          canBuildLevel(i, p, p.level, t))
          {
            if (openProjects(i) >= r) continue;
            h = 0.8 + 0.22 * p.level, u = p;
          } else continue;} else
        {
          if (
          openProjects(i) >= r ||
          l.know && !t.know[l.know] ||
          a === "crossing" && i.wades.length < 3 ||
          a === "workshop" && s < 5 ||
          a === "meeting" && n < 3 ||
          a === "store" && n < 2)

          continue;
          h = 0.75, d = "new";
        }
      }
      if (c < h) continue;
      let f = 0.35 + (c - h) * 1.2 * o;
      (!e || f > e.score) && (e = { kind: a, score: f, upgrade: u, target: d });
    }
    return e;
  }
  function projectReason(i, t, e, n, s) {
    let r = STRUCTURES[e];
    if (r.know && !t.know[r.know] || e === "dam" && n < 28 || openProjects(i) >= s)
    return null;
    let o = i.structures.filter((h) => h.kind === e);
    if (o.some((h) => h.building)) return null;
    let a = (h, d) =>
      !h.built ||
      !h.built.length ||
      i.t - h.built[h.built.length - 1].t > d * 3600,
      l = o.
      filter(
        (h) => h.level < r.levels.length && canBuildLevel(i, h, h.level, t) && a(h, 16)
      ).
      sort((h, d) => h.level - d.level || h.id - d.id)[0],
      c =
      o.length < r.multi &&
      o.every((h) => h.level >= 2 && a(h, 36)) &&
      !(t.noSite && t.noSite[e] && i.t - t.noSite[e] < 6 * 3600);
    if (e === "dam") {
      // CREEK: a valley's worth of dams. Someone who knows dams must be built from the
      // bottom up won't heighten a weir that has no water standing below it; they build
      // a new one lower down instead.
      let safe = (h) => !t.know.downstream || h.level !== 1 || creekSafeToRaise(i, h, 0.25);
      l = o.
      filter(
        (h) => h.level < r.levels.length && canBuildLevel(i, h, h.level, t) && a(h, 16) && safe(h)
      ).
      sort((h, d) => h.level - d.level || d.z - h.z)[0];
      c =
      o.length < r.multi &&
      o.every((h) => (h.level >= 2 || !safe(h)) && a(h, 30)) &&
      !(t.noSite && t.noSite[e] && i.t - t.noSite[e] < 6 * 3600);
      return l && (l.level < 2 || !c) ?
      { thr: 0.8 + 0.22 * l.level, upgrade: l } :
      c ?
      { thr: 0.8 + 0.08 * o.length, target: "new" } :
      null;
    }
    return l && (l.level < 2 || !c) ?
    { thr: 0.8 + 0.22 * l.level, upgrade: l } :
    c ?
    { thr: 0.8 + 0.35 * o.length, target: "new" } :
    null;
  }
  function planFound(i, t, e) {
    if (e.upgrade) {
      let r = e.upgrade;
      return {
        goal: "found",
        steps: [
        walkToStructure(i, r, t.x, t.z, STRUCTURES[r.kind].radius + 0.4),
        { do: "mark", kind: r.kind, upgrade: r.id, x: r.x, z: r.z }]

      };
    }
    let n = chooseSite(i, t, e.kind);
    return n ?
    {
      goal: "found",
      steps: [
      n.wx !== void 0 ?
      { do: "walk", x: n.wx, z: n.wz, near: 0.15 } :
      { do: "walk", x: n.x, z: n.z, near: 0.6 },
      { do: "mark", kind: e.kind, x: n.x, z: n.z, why: n.why || "" }]

    } : (
    t.desire[e.kind] *= 0.9,
    STRUCTURES[e.kind].multi && (
    t.noSite = t.noSite || {}, t.noSite[e.kind] = i.t),
    null);
  }
  function siteFor(i, t, e, n, s) {
    let r = i.terrain;
    if (s !== "crossing" && s !== "dam") {
      if (!r.walkable(t, e)) return !1;
      for (let o = 0; o < 6.28; o += 1.05)
      if (!r.walkable(t + Math.cos(o) * n, e + Math.sin(o) * n)) return !1;
      if (
      r.edgeDist(t, e) < n + 0.8 ||
      wetPotential(i, t, e) > (s === "garden" ? 0.7 : 0.35))

      return !1;
    }
    for (let o of i.structures) {
      let a = STRUCTURES[o.kind].radius + n + 1.4;
      if ((o.x - t) ** 2 + (o.z - e) ** 2 < a * a) return !1;
    }
    for (let o of i.res) {
      if (o.kind === "sprout" || o.kind === "orchard" && o.stage <= 1)
      continue;
      let a =
      n + (
      o.kind === "tree" ||
      o.kind === "podtree" ||
      o.kind === "orchard" && o.stage >= 3 ?
      1.2 :
      0.7);
      if ((o.x - t) ** 2 + (o.z - e) ** 2 < a * a) return !1;
    }
    return !0;
  }
  function countKind(i, t, e) {
    let n = i.structures.filter((s) => s.kind === t && (!e || e(s)));
    return n.length ?
    {
      x: n.reduce((s, r) => s + r.x, 0) / n.length,
      z: n.reduce((s, r) => s + r.z, 0) / n.length
    } :
    null;
  }
  function chooseSite(i, t, e) {
    let n = i.terrain,
      s = i.rng,
      r = STRUCTURES[e].radius,
      o = countKind(i, "home") || i.meadow;
    if (e === "crossing") {
      let d = i.wades.slice(-20);
      if (!d.length) return null;
      let u = d.map((g) => g.z).sort((g, m) => g - m),
        f = u[Math.floor(u.length / 2)],
        p = f,
        x = 99;
      for (let g = -4; g <= 4; g += 0.5) {
        let m = clamp(f + g, 8, 56),
          b = n.bankPoint(0, m, 0.4),
          T = n.bankPoint(1, m, 0.4);
        if (
        !n.walkable(b.x, b.z) ||
        !n.walkable(T.x, T.z) ||
        i.structures.some(
          (S) => S.kind === "crossing" && Math.abs(S.z - m) < 6
        ) ||
        i.structures.some(
          (S) => S.kind === "dam" && m > S.z - POND_SHAPE.len[3] - 1 && m < S.z + 3
        ) ||
        i.res.some((S) => S.kind === "snag" && Math.abs(S.z - m) < 2.5))

        continue;
        let y = n.creekHW(m) + Math.abs(g) * 0.08;
        y < x && (x = y, p = m);
      }
      return x === 99 ?
      null :
      {
        x: n.creekX(p),
        z: p,
        why: `where ${t.counts.wades > 2 ? "they keep" : "everyone keeps"} wading across`
      };
    }
    if (e === "dam") return damSite(i, t, o);
    let a = o,
      l = 0,
      c = 6,
      h = "";
    if (e === "home") {
      let d = Object.entries(t.rel).
      filter(([u, f]) => f.warmth > 0.3 && i.byId[u] && i.byId[u].home).
      sort((u, f) => f[1].warmth - u[1].warmth)[0];
      if (d) {
        let u = i.byId[i.byId[d[0]].home];
        a = { x: u.x, z: u.z },
        l = 3.6,
        c = 6.5,
        h = `near ${i.byId[d[0]].name}'s`;
      } else
      t.sleepSpot ? (
      a = t.sleepSpot,
      l = 0,
      c = 3.5,
      h = "where it likes to sleep") : (
      l = 2, c = 8);
    } else if (e === "store") l = 3, c = 6, h = "between the homes";else
    if (e === "workshop") {
      let d = findStructure(i, "store");
      d && (a = d), l = 4, c = 7;
    } else if (e === "meeting")
    l = 4, c = 8, h = "where everyone passes by";else
    if (e === "garden") {
      // CREEK: at the edge of the valley floor near home, where the low ground begins:
      // damp from below once the creek heals, but above the floor that turns to marsh
      let sg = o.x < n.axisX(o.z) ? -1 : 1;
      for (let d = 0; d < 48; d++) {
        let z = clamp(o.z + s.range(-12, 12) * (1 + d / 16), 8, VL - 8),
          x = n.axisX(z) + sg * (n.floorHW(z) + s.range(0.4, 2.6) + d * 0.04);
        if (n.walkable(x, z) && siteFor(i, x, z, r, e))
        return { x, z, why: "where the low ground begins, for water" };
      }
      return null;
    } else if (e === "chimes")
    a = homeOf(i, t) || o,
    l = 3.5,
    c = 7,
    h = "where the rain can reach it";else
    if (e === "lookout") {
      let d = null,
        u = -1;
      for (let f = 0; f < 60; f++) {
        let p = n.randomPoint(s, { minR: 0.6, maxR: 0.86, minEdge: 3 });
        if (!p || !siteFor(i, p.x, p.z, r, e)) continue;
        let x = n.heightAt(p.x, p.z) - dist2d(p.x, p.z, o.x, o.z) * 0.02;
        x > u && (u = x, d = p);
      }
      return d ? { ...d, why: "up on the high ground" } : null;
    }
    for (let d = 0; d < 7; d++)
    for (let u = 0; u < 36; u++) {
      let f = s.range(0, 6.28),
        p = s.range(l, c + d * 3),
        x = a.x + Math.cos(f) * p,
        g = a.z + Math.sin(f) * p;
      if (n.side(x, g) === n.side(a.x, a.z) && siteFor(i, x, g, r, e))
      return { x, z: g, why: d < 2 ? h : "" };
    }
    return null;
  }
  // CREEK: where to put a dam. Along the creek inside the valley, away from other dams
  // and crossings. Without the "downstream" knowledge they choose by what they can see:
  // near home, where the valley floor is low beside the creek, below the garden, just
  // under the snag. With it, they look for a spot where the pond below already holds
  // water against the new dam's foot, or start a new series lower down the creek.
  function damSite(i, t, e) {
    let n = i.terrain,
      s = i.rng,
      cr = i.creek,
      r = i.structures.filter((h) => h.kind === "dam"),
      o = i.res.find((h) => h.kind === "snag"),
      a = findStructure(i, "garden"),
      knows = !!(t.know && t.know.downstream),
      full = creekPondLevels(cr),
      lowest = r.length ? Math.max(...r.map((h) => h.z)) : -1,
      l = null,
      c = -1e9;
    for (let h = 14; h <= VL - 14; h += 1) {
      let d = n.creekX(h);
      if (n.valleyR(d, h) > 0.8) continue;
      let u = n.bankPoint(0, h, 0.4),
        f = n.bankPoint(1, h, 0.4);
      if (
      !n.walkable(u.x, u.z) ||
      !n.walkable(f.x, f.z) ||
      r.some((y) => Math.abs(y.z - h) < 7) ||
      i.structures.some(
        (y) =>
        y.kind === "crossing" && y.z > h - POND_SHAPE.len[3] - 1 && y.z < h + 3
      ) ||
      o && Math.abs(o.z - h) < 1.6)

      continue;
      let j = creekNodeIndex(h),
        below = Math.min(cr.nodes.length - 1, j + 1),
        standing = full[below] - cr.nodes[below].bed,
        g = !!(a && a.z < h - 1 && a.z > h - 14),
        b = o && o.z < h - 1.5 && o.z > h - 7 ? 4 : 0,
        low = 3 * (n.floorWeight(u.x - 2, h) + n.floorWeight(f.x + 2, h)),
        T = low + (g ? 10 : 0) + b - dist2d(d, h, e.x, e.z) * (knows ? 0.08 : 0.16) + s.range(0, 4),
        why =
        g && a ?
        "downstream of the garden, so its soil will stay damp" :
        b ?
        "just below the tangle of branches where the water already pools" :
        "where the low ground beside the creek could hold water";
      if (knows) {
        if (standing > 0.15) (T += 14), (why = "where the pond below already holds water against its foot");
        else if (h > lowest + 6) (T += 6), (why = "below the others, so the water can stand from the bottom up");
        else T -= 8;
      }
      if (T > c) {
        c = T;
        let y = n.side(t.x, t.z),
          S = n.bankPoint(y, h, 0.5);
        l = { x: d, z: h, wx: S.x, wz: S.z, why };
      }
    }
    return l;
  }
  function gardenOption(i, t) {
    let e = findStructure(i, "garden", (a) => a.level > 0 && a.beds);
    if (!e || !t.know.planting) return null;
    let n = t.interests.growing,
      s = STRUCTURES.garden.radius,
      r = { do: "walk", x: e.x, z: e.z, near: s * 0.6 };
    if (e.beds.some((a) => a.state === "ready")) {
      let a = findStructure(i, "store", (c) => c.level > 0),
        l = [r, { do: "harvest", sid: e.id }];
      return (
        a &&
        l.push(
          { do: "walk", x: a.x, z: a.z, near: 1.5 },
          { do: "stash", sid: a.id, food: !0, keep: 1 }
        ),
        {
          score: 0.45 + 0.6 * n + 0.2 * t.temp.generosity,
          plan: { goal: "garden", sid: e.id, steps: l }
        });

    }
    if (
    i.weather.rain <= 0 &&
    e.beds.some((a) => a.state === "growing" && a.water < 0.3))

    return {
      score: 0.3 + 0.7 * n,
      plan: {
        goal: "garden",
        sid: e.id,
        steps: [r, { do: "tend", sid: e.id }]
      }
    };
    if (e.beds.filter((a) => a.state === "empty").length > 0) {
      let a = [];
      if (!(t.pouch && t.pouch.seeds)) {
        let l = findStructure(
          i,
          "store",
          (c) => c.level > 0 && c.stock && c.stock.seeds > 0
        );
        if (!l) return null;
        a.push(
          { do: "walk", x: l.x, z: l.z, near: 1.5 },
          { do: "take", sid: l.id, k: "seeds" },
          { do: "take", sid: l.id, k: "seeds" }
        );
      }
      return (
        a.push(r, { do: "sow", sid: e.id }, { do: "sow", sid: e.id }),
        { score: 0.25 + 0.6 * n, plan: { goal: "garden", sid: e.id, steps: a } });

    }
    return null;
  }
  function plantOption(i, t) {
    if (
    !t.know.planting ||
    !(t.pouch && t.pouch.seeds) ||
    t.lastPlant && i.t - t.lastPlant < 3 * 3600)

    return null;
    let e = findStructure(i, "garden", (a) => a.level >= 5);
    if (i.res.filter((a) => a.kind === "orchard" && !a.wild).length >= 14)
    return null;
    let s =
      (0.08 + 0.5 * t.interests.growing) * (
      e ? 1.4 : 1) * (
      t.needs.food > 0.5 ? 1 : 0.3),
      o = homeOf(i, t) || countKind(i, "home") || i.meadow;
    for (let a = 0; a < 20; a++) {
      let l = i.rng.range(0, 6.28),
        c = i.rng.range(3.5, 8),
        h = o.x + Math.cos(l) * c,
        d = o.z + Math.sin(l) * c;
      if (
      !i.terrain.walkable(h, d) ||
      i.terrain.edgeDist(h, d) < 1.5 ||
      i.res.some(
        (p) =>
        (p.kind === "orchard" ||
        p.kind === "tree" ||
        p.kind === "podtree") &&
        dist2d(p.x, p.z, h, d) < 2.6
      ) ||
      i.structures.some((p) => dist2d(p.x, p.z, h, d) < STRUCTURES[p.kind].radius + 1))

      continue;
      let u = [{ do: "walk", x: h, z: d, near: 0 }],
        f = chooseGesture(i, t, "plant");
      return (
        f && u.push({ do: "gesture", g: f, task: "plant" }),
        u.push({ do: "plant" }),
        { score: s, plan: { goal: "plant", steps: u } });

    }
    return null;
  }
  function craftOption(i, t) {
    let e = findStructure(i, "workshop", (a) => a.level >= 2);
    if (!e || !t.know.tools) return null;
    let n = null,
      s = 0;
    if (
    !t.tools.stick &&
    t.know.mud &&
    t.counts.delivered > 10 && (
    n = "stick", s = 0.55),
    !t.tools.basket &&
    t.counts.delivered > 20 &&
    s < 0.6 && (
    n = "basket", s = 0.6),
    !t.tools.mallet &&
    t.counts.labor > 1800 &&
    s < 0.65 && (
    n = "mallet", s = 0.65),
    !n)

    return null;
    let r = { stick: "branch", basket: "reeds", mallet: "stone" }[n],
      o = fetchPlan(i, t, r, e, 1);
    return o ?
    {
      score: s * (0.6 + 0.6 * t.interests.building),
      plan: {
        goal: "craft",
        steps: [
        ...o.steps.slice(0, 2).map((a) => ({ ...a })),
        { do: "walk", x: e.x, z: e.z, near: 1.5 },
        { do: "craft", sid: e.id, tool: n }]

      }
    } :
    null;
  }
  function forageOption(i, t) {
    let e = findStructure(i, "store", (l) => l.level > 0);
    if (!e) return null;
    let n = e.stock || {},
      s =
      (n.berry || 0) + (
      n.bluberry || 0) + (
      n.greens || 0) + (
      n.fruit || 0) + (
      n.seeds || 0),
      r = 0.15 + 0.5 * t.temp.generosity + 0.2 * t.temp.persistence;
    if (s < 8 && t.needs.food > 0.5) {
      let l = null,
        c = 1e9;
      for (let h of seenByKind(i, t).bush || []) {
        if (expectedAmount(i, t, h) < 3) continue;
        let d = travelCost(i, t, t.x, t.z, h.x, h.z) + travelCost(i, t, h.x, h.z, e.x, e.z);
        d < c && (c = d, l = h);
      }
      if (l) {
        let h = Math.min(3, 4 - pouchCount(t));
        if (h > 0)
        return {
          score: r * (1 - s / 8) * (1 - t.workFatigue),
          plan: {
            goal: "forage",
            steps: [
            { do: "walk", x: l.x, z: l.z, near: 1 },
            ...Array(h).
            fill(0).
            map(() => ({ do: "pick", rid: l.id })),
            { do: "walk", x: e.x, z: e.z, near: 1.5 },
            { do: "stash", sid: e.id, food: !0 }]

          }
        };
      }
    }
    let a = ["branch", "reeds", "stone"].filter((l) => (n[l] || 0) < 6);
    if (a.length && e.level >= 1) {
      let l = i.rng.pick(a),
        c = fetchPlan(i, t, l, e, 2);
      if (c && c.steps[0].x !== e.x)
      return {
        score:
        r *
        0.55 * (
        1 - t.workFatigue) * (
        0.5 + t.interests.collecting * 0.5),
        plan: {
          goal: "forage",
          steps: [
          ...c.steps.map((h) => ({ ...h })),
          { do: "walk", x: e.x, z: e.z, near: 1.5 },
          { do: "stash", sid: e.id }]

        }
      };
    }
    return null;
  }
  function shareOption(i, t) {
    if (!t.pouch || pouchCount(t) === 0 || t.needs.food < 0.45) return null;
    let e = null,
      n = 0;
    for (let s of i.creatures) {
      if (s === t || s.asleep || s.needs.food > 0.35) continue;
      let r = positionAt(s, i.t),
        o = dist2d(t.x, t.z, r.x, r.z);
      if (o > 16) continue;
      let a = relation(t, s),
        l =
        (0.2 + 0.9 * t.temp.generosity) * (
        0.4 + clamp(a.warmth, 0, 1)) * (
        1 - s.needs.food) * (
        1 - o / 24);
      l > n && (n = l, e = s);
    }
    return e ?
    {
      score: n * 1.2,
      plan: {
        goal: "share",
        steps: [
        { do: "approach", id: e.id },
        { do: "give", id: e.id }]

      }
    } :
    null;
  }
  function schedule(i, t, e, n = 0, s = 0) {
    i.heap.push({ t, s: i.seq++, k: e, id: n, tok: s });
  }
  function register(i, t) {
    return i.byId[t.id] = t, t;
  }
  function removeThing(i, t, e) {
    delete i.byId[t.id];
    for (let s of i.creatures) s.seen[t.id] && delete s.seen[t.id];
    let n = e.indexOf(t);
    n >= 0 && e.splice(n, 1);
  }
  function emptyWorld(i) {
    return {
      seed: String(i),
      t: 0,
      seq: 0,
      nextId: 1,
      rng: new Rng(i),
      terrain: new Terrain(String(i)),
      heap: new EventHeap(),
      creatures: [],
      res: [],
      pods: [],
      items: [],
      structures: [],
      byId: {},
      weather: { state: "clear", rain: 0, since: 0, until: 0, cum: 0, cumT: 0 },
      wear: new Float32Array(CELLS), // CREEK: the bigger valley
      wet: new Float32Array(CELLS),
      hydro: newHydro(),
      log: [],
      hist: [],
      stats: {},
      wades: [],
      timeline: [],
      joints: {},
      tick: 0,
      onLog: null,
      version: 2,
      build: BUILD_VERSION
    };
  }
  function createWorld(i, t = 6) {
    setDayCycle(null);
    let e = emptyWorld(i),
      n = e.terrain,
      s = e.rng,
      r = [],
      o = (u, f, p = {}) => {
        if (!f) return null;
        let x = register(e, {
          id: e.nextId++,
          kind: u,
          x: +f.x.toFixed(2),
          z: +f.z.toFixed(2),
          side: n.side(f.x, f.z),
          ...p
        });
        return e.res.push(x), r.push({ x: f.x, z: f.z, r: p.space ?? 2.2 }), x;
      },
      a = (u) => n.randomPoint(s, { avoid: r, ...u }),
      // CREEK: the village starts at the upstream end, up on the terrace away from the water
      l = n.randomPoint(s, { side: 0, offFloor: !0, minEdge: 9, zMin: 18, zMax: 36, maxR: 0.8 }) ||
      n.randomPoint(s, { side: 0, offFloor: !0, zMin: 12, zMax: 50 }) || { x: n.axisX(26) - n.floorHW(26) - 6, z: 26 };
    e.meadow = { x: +l.x.toFixed(2), z: +l.z.toFixed(2) },
    r.push({ x: l.x, z: l.z, r: 4.5 });
    let c = ["oak", "oak", "birch", "pine"];
    // CREEK: about two and a half times as much of everything, for a longer valley
    for (let u = 0; u < 26; u++)
    o("tree", a({ side: 0, minEdge: 2.5, maxR: 0.86 }), {
      variant: s.pick(c),
      amt: s.int(1, 3),
      max: 3,
      canopy: s.range(1.6, 2.2),
      space: 2.6
    });
    for (let u = 0; u < 18; u++)
    o("tree", a({ side: 1, minEdge: 2.5, maxR: 0.86 }), {
      variant: s.pick(c),
      amt: s.int(1, 3),
      max: 3,
      canopy: s.range(1.6, 2.2),
      space: 2.6
    });
    for (let u = 0; u < 12; u++)
    o("tree", a({ side: u % 2, minEdge: 0.8, maxEdge: 2.2, maxR: 0.82 }), {
      variant: "willow",
      amt: s.int(0, 2),
      max: 2,
      canopy: 2,
      space: 3
    });
    for (let u = 0; u < 3; u++)
    o(
      "podtree",
      a({
        side: 0,
        minEdge: 3,
        maxR: 0.8,
        near: { x: l.x, z: l.z, r: 18 }
      }) || a({ side: 0, minEdge: 3 }),
      { canopy: 2.2, nextPod: s.range(400, 1600), space: 3.5 }
    );
    for (let u = 0; u < 3; u++)
    o("podtree", a({ side: 1, minEdge: 3, maxR: 0.84 }), {
      canopy: 2.2,
      nextPod: s.range(1200, 5e3),
      space: 3.5
    });
    for (let u = 0; u < 11; u++)
    o(
      "bush",
      (u < 5 ? a({
        side: 0,
        minEdge: 2,
        maxR: 0.84,
        near: { x: l.x, z: l.z, r: 18 }
      }) : null) || a({ side: 0, minEdge: 2, maxR: 0.86 }),
      { food: "berry", amt: s.int(4, 7), max: 7, space: 2 }
    );
    for (let k = 0; k < 2; k++) {
      let h = a({ side: 1, minEdge: 3, maxR: 0.8, zMin: k ? VL / 2 : 12, zMax: k ? VL - 12 : VL / 2 }) || { x: n.creekX(50 + k * 60) + 8, z: 50 + k * 60 };
      for (let u = 0; u < 5; u++)
      o(
        "bush",
        a({ side: 1, minEdge: 1.5, near: { x: h.x, z: h.z, r: 6 } }) ||
        a({ side: 1, minEdge: 1.5 }),
        { food: "bluberry", amt: s.int(7, 11), max: 11, space: 1.8 }
      );
    }
    for (let u = 0; u < 20; u++) {
      let f = u < 10 ? 0 : 1,
        p = null;
      for (let x = 0; x < 30 && !p; x++) {
        let g = s.range(10, VL - 10),
          m = n.bankPoint(f, g, 0.35);
        n.valleyR(m.x, m.z) < 0.86 &&
        !r.some((b) => Math.hypot(b.x - m.x, b.z - m.z) < 3) && (
        p = m);
      }
      o("reeds", p, { amt: s.int(5, 9), max: 10, space: 3 });
    }
    o("stones", a({ side: 0, minEdge: 4, minR: 0.5, maxR: 0.86, near: { x: l.x, z: l.z, r: 30 } }) || a({ side: 0, minEdge: 4 }), {
      amt: 12,
      max: 14,
      space: 3
    }),
    o("stones", a({ side: 0, minEdge: 1, maxEdge: 3, maxR: 0.85, zMax: 70 }), {
      amt: 9,
      max: 10,
      space: 3
    }),
    o("stones", a({ side: 1, minEdge: 2, maxR: 0.85 }), {
      amt: 16,
      max: 18,
      space: 3
    }),
    o("stones", a({ side: 1, minEdge: 3, minR: 0.55, maxR: 0.86 }), {
      amt: 14,
      max: 16,
      space: 3
    });
    for (let u = 0; u < 3; u++)
    o("stones", a({ side: u % 2, minEdge: 2, maxR: 0.86, zMin: VL / 2 }), {
      amt: 12,
      max: 14,
      space: 3
    });
    for (let u = 0; u < 4; u++) {
      let f = null;
      for (let p = 0; p < 40 && !f; p++) {
        let x = n.bankPoint(u === 3 ? 0 : 1, s.range(14, VL - 14), 0.9);
        n.valleyR(x.x, x.z) < 0.82 &&
        !r.some((g) => Math.hypot(g.x - x.x, g.z - x.z) < 3) && (
        f = x);
      }
      o("clay", f, { amt: 16, max: 20, space: 3 });
    }
    for (let u = 0; u < 3; u++)
    o("glowcap", a({ side: u ? s.int(0, 1) : 1, minEdge: 3, minR: 0.6, maxR: 0.87 }), {
      amt: 4,
      max: 8,
      space: 2.5
    });
    for (let u = 0; u < 5; u++)
    o("log", a({ side: u === 0 ? 0 : s.int(0, 1), minEdge: 2, maxR: 0.84 }), {
      rot: s.range(0, 3.14),
      space: 2.4
    });
    for (let u = 0; u < 10; u++)
    o("boulder", a({ minEdge: 2, maxR: 0.87 }), {
      size: s.range(0.7, 1.3),
      rot: s.range(0, 6.28),
      space: 2.4
    });
    placeSnag(e), creekInit(e);
    let d = new Set();
    for (let u = 0; u < t; u++) {
      let f;
      do f = s.pick(FOLK_NAMES); while (
      d.has(f));
      d.add(f);
      let p =
        n.randomPoint(s, { near: { x: l.x, z: l.z, r: 4 }, side: 0 }) || l,
        x = register(e, makeFolk(e, f, p.x, p.z));
      e.creatures.push(x);
    }
    for (let u of e.creatures)
    for (let f of e.res)
    Math.hypot(f.x - u.x, f.z - u.z) < 15 && (
    u.seen[f.id] = { a: f.amt ?? 0, t: 0 });
    return (
      e.weather = {
        state: "clear",
        rain: 0,
        since: 0,
        until: s.range(1800, 4200),
        cum: 0,
        cumT: 0
      },
      schedule(e, e.weather.until, "R"),
      schedule(e, 60, "W"),
      e.creatures.forEach((u, f) => {
        let p = +(5 + f * 3.5 + s.range(0, 3)).toFixed(2);
        u.asleep = !0,
        u.act = {
          type: "nap",
          step: "nap",
          t0: 0,
          t1: p,
          x: u.x,
          z: u.z,
          tok: u.tok,
          rc0: 0
        },
        schedule(e, p, "A", u.id, u.tok);
      }),
      logEvent(
        e,
        3,
        `${e.creatures.length} small creatures woke up in a meadow beside a creek.`,
        e.creatures.map((u) => u.id),
        e.meadow,
        "start"
      ),
      e);

  }
  function rainTotal(i, t) {
    return i.weather.cum + i.weather.rain * Math.max(0, t - i.weather.cumT);
  }
  function runUntil(i, t, e = 1 / 0, n = null) {
    let s = 0,
      r = i.heap;
    for (; r.size && r.peek().t <= t;) {
      let o = r.pop();
      if (i.t = o.t, safeEvent(i, o), ++s % 200 === 0 && n && n() > e) return !1;
    }
    return t > i.t && (i.t = t), !0;
  }
  function safeEvent(i, t) {
    try {
      handleEvent(i, t);
    } catch (e) {
      if (
      i.stats.errors = (i.stats.errors || 0) + 1,
      typeof console < "u" && console.error("sim event failed", t.k, e),
      t.k === "A")
      {
        let n = i.byId[t.id];
        n && (
        n.plan = null,
        n.resume = null,
        n.act = null,
        n.asleep = !1,
        n.tok++,
        schedule(i, i.t + 2, "A", n.id, n.tok));
      } else
      t.k === "W" ?
      schedule(i, i.t + 60, "W") :
      t.k === "R" && (
      i.weather.until = i.t + 1800, schedule(i, i.weather.until, "R"));
    }
  }
  function handleEvent(i, t) {
    switch (t.k) {
      case "A":{
          let e = i.byId[t.id];
          e && e.tok === t.tok && onActEnd(i, e);
          break;
        }
      case "W":
        worldTick(i), schedule(i, i.t + 60, "W");
        break;
      case "R": // MINDS: a gift can change the weather, so stale weather events are skipped
        (t.tok || 0) === (i.weather.tok || 0) && changeWeather(i);
        break;
      case "L": // LIFE: ages, births, passings, leaving (src/sim/life.js)
        lifeTick(i);
        break;
    }
  }
  function changeWeather(i) {
    let t = i.rng,
      e = i.weather;
    e.cum = rainTotal(i, i.t), e.cumT = i.t;
    let n = e.state,
      s = n,
      r,
      o = t.next(),
      sw = seasonAt(i).wet; // CREEK: rain and storms in the wet season, little in the dry
    n === "clear" ?
    s = o < 0.22 + 0.5 * sw ? "cloudy" : "clear" :
    n === "cloudy" ?
    s = o < 0.06 + 0.5 * sw ? "rain" : "clear" :
    n === "rain" ?
    s = o < WEATHER.storm * sw * sw ? "storm" : o < 0.75 ? "cloudy" : "rain" :
    s = "rain",
    r = {
      clear: t.range(2400, 6600) * (1.7 - 0.9 * sw),
      cloudy: t.range(900, 2700),
      rain: t.range(700, 2400) * (0.6 + 0.6 * sw),
      storm: t.range(480, 1200)
    }[s],
    e.state = s,
    e.rain = s === "rain" ? 1 : s === "storm" ? 1.6 : 0,
    e.since = i.t,
    e.until = i.t + r,
    schedule(i, e.until, "R", 0, e.tok || 0),
    s === "storm" && n !== "storm" && (storyStorm(i), creekStorm(i)), // MINDS, CREEK: every storm is a flood
    e.rain > 0 && !(n === "rain" || n === "storm") ? (
    i.stats.rains = (i.stats.rains || 0) + 1,
    logEvent(
      i,
      1,
      s === "storm" ?
      "A storm rolled in over the valley." :
      "It started to rain.",
      [],
      null,
      "weather"
    )) :
    s === "storm" ?
    logEvent(i, 2, "The rain turned into a storm.", [], null, "weather") :
    e.rain === 0 && (
    n === "rain" || n === "storm") &&
    logEvent(i, 1, "The rain stopped.", [], null, "weather");
  }
  function worldTick(i) {
    let t = i.rng,
      e = i.t;
    i.tick++;
    let n = isNight(e),
      s = i.weather.rain;
    for (let a of i.res)
    switch (a.kind) {
      case "tree":
        a.grow !== void 0 && a.grow < 1 && growWillow(i, a),
        a.amt < a.max && (
        a.grow === void 0 || a.grow > 0.6) &&
        t.chance(1 / 34) &&
        a.amt++;
        break;
      case "bush":
        a.amt < a.max &&
        t.chance(
          (a.food === "bluberry" ? 1 / 5.5 : 1 / 7.5) * (
          wetAt(i, a.x, a.z) > 0.25 ? 1.4 : 1) * greenFactor(i, a.x, a.z) // CREEK: less in a brown, dry valley
        ) &&
        a.amt++;
        break;
      case "reeds":
        a.amt < a.max &&
        t.chance(wetAt(i, a.x, a.z) > 0.3 ? 1 / 4 : 1 / 6) &&
        a.amt++;
        break;
      case "stones":
        a.amt < a.max && t.chance(1 / 24) && a.amt++;
        break;
      case "clay":
        a.amt < a.max && t.chance(1 / 4) && a.amt++;
        break;
      case "glowcap":
        n && a.amt < a.max && t.chance(1 / 4) && a.amt++;
        break;
      case "podtree":
        e >= a.nextPod && (
        a.nextPod = e + t.range(16e3, 34e3),
        i.pods.filter((c) => Math.hypot(c.x - a.x, c.z - a.z) < 5).length <
        2 && dropPod(i, a));
        break;
      case "orchard":
        growOrchard(i, a, s);
        break;
      case "sprout":
        e - a.born > 36e3 && (
        i.res.filter((c) => c.kind === "orchard" && c.wild).length < 7 &&
        i.terrain.walkable(a.x, a.z) ? (
        a.kind = "orchard",
        a.stage = 1,
        a.grow = 0,
        a.wild = !0,
        a.amt = 0,
        a.max = 5,
        a.canopy = 1.2,
        logEvent(
          i,
          1,
          "A wild seedling has grown into a sapling.",
          [],
          a,
          "nature"
        )) :
        removeThing(i, a, i.res));
        break;
    }
    for (let a = i.pods.length - 1; a >= 0; a--) {
      let l = i.pods[a];
      !l.held &&
      e - l.born > 15e3 && (
      removeThing(i, l, i.pods), dropItem(i, "seeds", l.x, l.z, 3));
    }
    for (let a = i.items.length - 1; a >= 0; a--) {
      let l = i.items[a];
      if (l.kind === "seeds") {
        if (e - l.t > 36e3) {
          removeThing(i, l, i.items);
          continue;
        }
        if (!s && t.chance(1 / 120) || s && t.chance(1 / 50)) {
          if (
          i.res.filter((h) => h.kind === "sprout").length < 6 &&
          i.terrain.walkable(l.x, l.z) &&
          !nearStructure(i, l.x, l.z, 1.5))
          {
            let h = register(i, {
              id: i.nextId++,
              kind: "sprout",
              x: l.x,
              z: l.z,
              side: i.terrain.side(l.x, l.z),
              born: e
            });
            i.res.push(h), i.stats.sprouts = (i.stats.sprouts || 0) + 1;
          }
          l.n--, l.n <= 0 && removeThing(i, l, i.items);
        }
      } else
      l.kind === "cairn" &&
      e - l.t > 2 * 86400 &&
      t.chance(1 / 900) && (
      l.n--, l.n <= 0 && removeThing(i, l, i.items));
    }
    for (let a of i.structures) {
      let l = a.building;
      if (
      l &&
      l.cureLeft > 0 && (
      currentStage(a).dry && s > 0 || (l.cureLeft -= 60),
      l.cureLeft <= 0 && (
      l.cureLeft = 0, l.cureUntil = null, stageDone(i, a, !0))),
      a.kind === "garden" && tendGarden(i, a, s),
      a.level > 0 && a.kind !== "garden")
      {
        a.cond === void 0 && (a.cond = 1);
        let c =
        a.kind === "home" && a.level >= 4 ||
        a.kind === "meeting" && a.level >= 4 ||
        a.kind === "store" && a.level >= 4 ?
        0.55 :
        a.kind === "dam" ?
        a.level >= 3 ?
        0.8 :
        1.15 :
        1;
        if (
        a.cond = Math.max(
          0,
          a.cond - 60 / (6 * 86400) * c * (s > 1 ? 4 : s > 0 ? 1.6 : 1)
        ),
        a.cond < 0.55 && !a.wornNoted)
        {
          a.wornNoted = !0;
          let h =
          a.owner && i.byId[a.owner] ? i.byId[a.owner].name + "'s " : "the ";
          a.kind === "dam" ?
          logEvent(
            i,
            1,
            `High water has loosened sticks in the ${builtLevelDef(a).label}, and it has started to leak.`,
            [],
            a,
            "wear"
          ) :
          logEvent(
            i,
            1,
            `Wind and rain have worn ${h}${builtLevelDef(a).label} ragged.`,
            a.owner ? [a.owner] : [],
            a,
            "wear"
          );
        }
      }
      if (a.kind === "workshop" && a.drying && a.drying.length) {
        let c = a.drying.filter((h) => h <= e).length;
        c && (
        a.drying = a.drying.filter((h) => h > e),
        a.stock = a.stock || {},
        a.stock.tile = (a.stock.tile || 0) + c);
      }
      if (a.kind === "store" && a.stock) {
        let c = a.level >= 2;
        for (let h of ["berry", "bluberry", "greens", "fruit"]) {
          let d = a.stock[h] || 0;
          d > 0 &&
          !c &&
          t.chance(Math.min(0.5, d * 0.006)) && (
          a.stock[h] = d - 1);
        }
      }
    }
    if (updateHydro(i), i.tick % 10 === 0) {
      let a = i.wear;
      for (let l = 0; l < a.length; l++)
      a[l] > 0 && (a[l] *= 0.991, a[l] < 0.05 && (a[l] = 0));
    }
    let r = i.structures.filter((a) => a.kind === "home" && a.level > 0).length,
      o = i.structures.reduce((a, l) => a + l.level, 0);
    for (let a of i.creatures) {
      for (let l in a.desire) a.desire[l] = Math.min(2, a.desire[l] * 0.99965);
      growDesires(i, a, r, o), a.workFatigue = Math.max(0, a.workFatigue - 0.002);
    }
    if (i.tick % 10 === 5 && socialTick(i), i.tick % 1440 === 7)
    for (let a of i.creatures)
    for (let l in a.seen) i.byId[l] || delete a.seen[l];
    i.tick % 60 === 0 && (
    i.timeline.push({
      t: Math.round(e),
      lv: i.structures.reduce((a, l) => a + l.level, 0),
      mood: +(
      i.creatures.reduce((a, l) => a + l.mood, 0) /
      Math.max(1, i.creatures.length)).
      toFixed(2)
    }),
    i.timeline.length > 1440 &&
    i.timeline.splice(0, i.timeline.length - 1440));
  }
  function socialTick(i) {
    let t = i.mile || (i.mile = { pairs: {}, words: {} }),
      e = i.creatures;
    for (let n of e)
    for (let s in n.rel) {
      let r = i.byId[s],
        o = n.rel[s];
      if (!r) continue;
      let a = affinity(n, r) * 0.7;
      o.warmth += (a - o.warmth) * 0.004, o.annoy *= 0.97;
    }
    for (let n = 0; n < e.length; n++)
    for (let s = n + 1; s < e.length; s++) {
      let r = e[n],
        o = e[s],
        a = r.rel[o.id],
        l = o.rel[r.id];
      if (!a || !l) continue;
      let c = r.id + "-" + o.id,
        h = (a.warmth + l.warmth) / 2,
        d = t.pairs[c] || 0;
      h > 0.62 && d < 2 ? (
      t.pairs[c] = 2,
      logEvent(
        i,
        2,
        `${r.name} and ${o.name} have become close friends.`,
        [r.id, o.id],
        r,
        "bond"
      )) :
      h < -0.15 && d > -1 ? (
      t.pairs[c] = -1,
      logEvent(
        i,
        2,
        `${r.name} and ${o.name} have been getting on each other's nerves.`,
        [r.id, o.id],
        r,
        "bond"
      )) :
      d === -1 &&
      h > 0.2 && (
      t.pairs[c] = 1,
      logEvent(
        i,
        2,
        `${r.name} and ${o.name} seem to have patched things up.`,
        [r.id, o.id],
        r,
        "bond"
      ));
    }
    for (let n of vocabularySummary(i)) {
      if (n.users < e.length || t.words[n.concept] === n.word) continue;
      let s = t.words[n.concept];
      t.words[n.concept] = n.word,
      n.concept === "home" ?
      logEvent(
        i,
        3,
        s ?
        `The creatures now call their home \u201C${n.word}\u201D.` :
        `The creatures have settled on a name for their home: \u201C${n.word}\u201D.`,
        [],
        i.meadow,
        "word"
      ) :
      logEvent(
        i,
        s ? 1 : 2,
        `Everyone now says \u201C${n.word}\u201D for ${CONCEPT_LABELS[n.concept] || n.concept}.`,
        [],
        null,
        "word"
      );
    }
  }
  function growDesires(i, t, e, n) {
    let s = t.desire,
      r = t.interests,
      o = t.temp;
    for (let c in s) STRUCTURES[c] && kindComplete(i, c, t.id) && (s[c] = Math.min(s[c], 0.2));
    let a = t.home != null ? i.byId[t.home] : null,
      l = a ? a.level : 0;
    s.home +=
    (l < 3 ? 8e-4 * (0.3 + r.building) : 35e-5 * (0.2 + r.building)) * (
    1 + 0.5 * o.caution),
    e >= 2 && (s.store += 6e-4 * (0.4 + o.generosity + 0.5 * r.collecting)),
    t.counts.wades > 0 && (s.crossing += 4e-4 * (0.2 + t.fearWater)),
    t.know.planting && (s.garden += 6e-4 * (0.45 + r.growing)),
    n >= 8 && (s.workshop += 5e-4 * (0.3 + r.building)),
    e >= 3 && (s.meeting += 6e-4 * (0.35 + o.sociability)),
    t.sig === "sound" && (s.chimes += 5e-4 * r.sound),
    t.sig === "exploring" && (s.lookout += 4e-4 * r.exploring),
    t.know.dams && (
    s.dam = (s.dam || 0) + 5e-4 * (0.3 + r.water + 0.4 * r.growing));
  }
  function nearStructure(i, t, e, n) {
    for (let s of i.structures) {
      let r = STRUCTURES[s.kind].radius + n;
      if ((s.x - t) ** 2 + (s.z - e) ** 2 < r * r) return !0;
    }
    return !1;
  }
  function dropPod(i, t) {
    let e = i.rng,
      n = i.terrain;
    for (let s = 0; s < 10; s++) {
      let r = e.range(0, 6.28),
        o = e.range(1.2, 2.4),
        a = t.x + Math.cos(r) * o,
        l = t.z + Math.sin(r) * o;
      if (!n.walkable(a, l)) continue;
      let c = register(i, {
        id: i.nextId++,
        kind: "pod",
        x: +a.toFixed(2),
        z: +l.toFixed(2),
        side: n.side(a, l),
        weight: +e.range(0.85, 1.28).toFixed(2),
        born: i.t,
        tree: t.id,
        rot: e.range(0, 6.28)
      });
      return (
        i.pods.push(c),
        logEvent(
          i,
          1,
          "A heavy seed pod thudded down from a pod tree.",
          [],
          c,
          "nature"
        ),
        c);

    }
    return null;
  }
  function dropItem(i, t, e, n, s = 1) {
    for (let o of i.items)
    if (o.kind === t && Math.hypot(o.x - e, o.z - n) < 0.8)
    return o.n += s, t !== "cairn" && (o.t = i.t), o;
    let r = register(i, {
      id: i.nextId++,
      kind: t,
      x: +e.toFixed(2),
      z: +n.toFixed(2),
      n: s,
      t: i.t
    });
    return i.items.push(r), r;
  }
  function tendGarden(i, t, e) {
    let n = builtLevelDef(t);
    if (!t.beds) return;
    let s = n && n.growth || 1,
      r = i.tick % 10 === 4 ? Math.max(wetNear(i, t.x, t.z, 1.5), seepAt(i, t.x, t.z)) : t.dampSoil || 0; // CREEK: seepage
    i.tick % 10 === 4 && (
    t.dampSoil = +r.toFixed(3),
    r >= 0.3 &&
    !t.dampNoted &&
    t.level > 0 && (
    t.dampNoted = !0,
    logEvent(
      i,
      2,
      "The garden soil stays damp now, fed by water seeping up from the creek.",
      [],
      t,
      "wetland"
    )));
    let o = n && n.autoWater || r >= 0.3 ? 0.7 : 0;
    for (let a of t.beds)
    if (
    e > 0 ? a.water = 1 : a.water = Math.max(o, a.water - 60 / 10800),
    a.state === "growing")
    {
      let l = a.water > 0.25 ? 1 : 0.3;
      a.grow += 60 / 10800 * s * l,
      a.grow >= 1 && (a.grow = 1, a.state = "ready");
    }
  }
  function growOrchard(i, t, e) {
    if (t.stage >= 3) {
      t.amt < t.max && i.rng.chance(1 / 12) && t.amt++;
      return;
    }
    let n = wetAt(i, t.x, t.z),
      s =
      (t.guard ? 1.4 : 1) * (
      e > 0 ? 1.3 : 1) * (
      n > 0.2 && n < 0.8 ? 1.25 : 1);
    if (
    t.grow = (t.grow || 0) + 60 / (t.wild ? 14e4 : 9e4) * s,
    t.grow >= 1 && (
    t.grow = 0,
    t.stage++,
    t.canopy = [0.4, 0.8, 1.4, 2][t.stage],
    t.stage === 3))
    {
      t.max = 6, t.amt = 1;
      let r = t.planter && i.byId[t.planter] ? i.byId[t.planter].name : null;
      logEvent(
        i,
        3,
        r ?
        `The tree ${r} planted has grown up and is bearing fruit.` :
        "A young tree in the valley has started bearing fruit.",
        t.planter ? [t.planter] : [],
        t,
        "nature"
      );
    }
  }
  function growWillow(i, t) {
    t.grow = Math.min(
      1,
      t.grow + 60 / (3 * 86400) * (wetAt(i, t.x, t.z) > 0.3 ? 1.3 : 1)
    ),
    t.grow = +t.grow.toFixed(5),
    t.canopy = +(0.5 + 1.5 * t.grow).toFixed(2),
    t.grow >= 1 && (
    delete t.grow,
    i.hydro.notes.willows || (
    i.hydro.notes.willows = 1,
    logEvent(
      i,
      2,
      "The willow cuttings by the pond have grown into young trees.",
      [],
      t,
      "wetland"
    )));
  }
  function floatsToB64(i) {
    let t = new Uint8Array(
        i.buffer.slice(i.byteOffset, i.byteOffset + i.byteLength)
      ),
      e = "";
    for (let n = 0; n < t.length; n += 8192)
    e += String.fromCharCode.apply(null, t.subarray(n, n + 8192));
    return typeof btoa == "function" ?
    btoa(e) :
    Buffer.from(e, "binary").toString("base64");
  }
  function b64ToFloats(i, t) {
    let e =
      typeof atob == "function" ?
      atob(i) :
      Buffer.from(i, "base64").toString("binary"),
      n = new Uint8Array(e.length);
    for (let r = 0; r < e.length; r++) n[r] = e.charCodeAt(r);
    let s = new Float32Array(t);
    return s.set(new Float32Array(n.buffer, 0, Math.min(t, n.length >> 2))), s;
  }
  function sparseToB64(i) {
    let t = 0;
    for (let r = 0; r < i.length; r++) i[r] !== 0 && t++;
    let e = new Uint32Array(t * 2),
      n = new Uint32Array(i.buffer, i.byteOffset, i.length),
      s = 0;
    for (let r = 0; r < i.length; r++)
    i[r] !== 0 && (e[s++] = r, e[s++] = n[r]);
    return floatsToB64(new Float32Array(e.buffer));
  }
  function b64ToSparse(i, t) {
    let e = b64ToFloats(i, Math.ceil(i.length * 3 / 16) + 2),
      n = new Uint32Array(e.buffer),
      s = new Float32Array(t),
      r = new Uint32Array(s.buffer),
      o = Math.floor(
        (i.length * 3 / 4 - (
        i.endsWith("==") ? 2 : i.endsWith("=") ? 1 : 0)) /
        8
      );
    for (let a = 0; a < o; a++) {
      let l = n[a * 2];
      l < t && (r[l] = n[a * 2 + 1]);
    }
    return s;
  }
  var UNSAVED_KEYS = new Set([
  "rng",
  "terrain",
  "heap",
  "byId",
  "wear",
  "wet",
  "wt", // CREEK: derived from the creek, rebuilt on load
  "green",
  "creek",
  "onLog",
  "__obs",
  "_obs",
  "_obsT"]
  );
  function saveWorld(i, t = {}) {
    let e = {};
    for (let n in i) UNSAVED_KEYS.has(n) || (e[n] = i[n]);
    return (
      e.rngState = i.rng.getState(),
      e.events = i.heap.a,
      e.wearS = sparseToB64(i.wear),
      e.wetS = sparseToB64(i.wet),
      e.creek = creekSave(i.creek), // CREEK
      e.build = BUILD_VERSION,
      e.version = 2,
      Object.assign(e, t),
      JSON.stringify(e));

  }
  function loadWorld(i) {
    let t = typeof i == "string" ? JSON.parse(i) : i;
    if (!t || t.version !== 2 || t.build !== BUILD_VERSION) throw new Error(OTHER_BUILD_TEXT); // CREEK: every build keeps its own saves
    let e = emptyWorld(t.seed);
    for (let n in t)
    n === "rngState" ||
    n === "events" ||
    n === "wearS" ||
    n === "creek" ||
    n === "wetS" || (
    e[n] = t[n]);
    e.rng.setState(t.rngState),
    e.heap = new EventHeap(t.events),
    e.wear = b64ToSparse(t.wearS, CELLS),
    e.byId = {};
    for (let n of [e.creatures, e.res, e.pods, e.items, e.structures])
    for (let s of n) e.byId[s.id] = s;
    e.wet = b64ToSparse(t.wetS, CELLS),
    creekLoad(e, t.creek); // CREEK: the creek's shape, ponds and water table
    for (let n of e.creatures) n.desire.dam === void 0 && (n.desire.dam = 0);
    return upgradeWorld(e); // LIFE: day cycle, ages and the calendar (src/sim/hooks.js)
  }

// ==== src/sim/calendar.js ====
// ==========================================================================
// The valley's own calendar (Phase 3A).
//
// One valley day is one real hour. A valley year is 192 valley days, about
// eight real days, so a season lasts two real days: not exactly a week, so the
// seasons drift across weekdays and a weekend player still sees all four. A
// creekfolk lives about four valley years; a real year holds about 45.
//
// Winter and spring are the wet season (storms, a running creek); summer and
// autumn are the dry season. A new valley begins on the first morning of spring.
// Valley dates no longer follow the real calendar; world.calStart is kept only
// to say when, in real life, the valley began.
// ==========================================================================

var VALLEY_DAY = 3600; // seconds of real time in one valley day
var REAL_DAY = 86400;
var YEAR_DAYS = 192; // valley days in a valley year
var SEASON_DAYS = YEAR_DAYS / 4;
var SEASON_NAMES = ["spring", "summer", "autumn", "winter"];
var MIDWINTER_DOY = 168; // the middle of winter: their midwinter
var MIDSUMMER_DOY = 72;
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Valley days since the first midnight before the valley began (fractional).
// The day cycle's offset puts t = 0 at mid-morning of the first day.
function valleyDays(w, t = w.t) {
  let off = (w && w.cycle && w.cycle.off) ?? 0.27;
  return t / VALLEY_DAY + off;
}

// The real date (UTC-based Date whose UTC fields read as the player's local time).
function valleyDate(w, t = w.t) {
  return new Date((w.calStart || 0) + t * 1000 - (w.tzMin || 0) * 60000);
}

// How wet the season is at day-of-year doy, 0 (the heart of the dry season) .. 1
// (the heart of the wet season). Wettest where winter turns to spring, driest
// where summer turns to autumn; above 0.5 all through winter and spring.
function seasonWetness(doy) {
  let c = Math.cos((2 * Math.PI * doy) / YEAR_DAYS); // 1 wettest .. -1 driest
  return clamp(0.5 + 0.6 * c, 0, 1);
}

// Season at time t:
//   name, idx (0 spring .. 3 winter), progress (0..1 through the season),
//   doy (0..192, fractional), day (1-based day of the season), year (1-based),
//   warmth (0 midwinter .. 1 midsummer), wet (0..1, see seasonWetness),
//   wetSeason (winter or spring)
function seasonAt(w, t = w.t) {
  let days = valleyDays(w, t),
    year = Math.floor(days / YEAR_DAYS),
    doy = days - year * YEAR_DAYS,
    idx = Math.min(3, Math.floor(doy / SEASON_DAYS)),
    into = doy - idx * SEASON_DAYS;
  return {
    name: SEASON_NAMES[idx],
    idx,
    progress: into / SEASON_DAYS,
    doy,
    day: Math.floor(into) + 1,
    year: year + 1,
    warmth: +(0.5 - 0.5 * Math.cos((2 * Math.PI * (doy - MIDWINTER_DOY)) / YEAR_DAYS)).toFixed(3),
    wet: +seasonWetness(doy).toFixed(3),
    wetSeason: idx === 0 || idx === 3,
  };
}

// "Day 12 of spring, year 3"
function dateText(w, t = w.t) {
  let s = seasonAt(w, t);
  return `Day ${s.day} of ${s.name}, year ${s.year}`;
}

// The real-world date the valley began, for the settings panel.
function realStartText(w) {
  let d = valleyDate(w, 0);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// Valley days until the next midwinter morning (their midwinter).
function daysToMidwinter(w, t = w.t) {
  let doy = seasonAt(w, t).doy,
    d = MIDWINTER_DOY + 0.22 - doy;
  return d < 0 ? d + YEAR_DAYS : d;
}

// How long the valley has existed, in real days.
function valleyAgeDays(w, t = w.t) {
  return t / REAL_DAY;
}

// ==== src/sim/creek.js ====
// ==========================================================================
// The creek (Phase 3A).
//
// Creek Care's river model (ref/creek-care-river-core.js), ported and rescaled
// for a small stream, plus what Creekfolk needs on top of it:
//
//   SHAPE      The creek is a chain of nodes 2 m apart along the valley (z). Each
//              node has a bed, an old valley floor it has cut down below (fp), a
//              trench (bottom width wb, side slope m), maybe an inset bench (bw, bz),
//              plants (veg) and a water table under the floor beside it (g).
//   FLOODS     Each storm is one flood. Flow from the drained area (Q = k(T) A^0.8),
//              depth from Manning's equation in the compound channel. Behind a dam
//              the water is deeper than the flow needs, so the energy slope (and the
//              force on the bed) drops: that is how ponds trap gravel and mud.
//   ONLY BUILDS  The author's settled rule: floods reshape the creek only in ways that
//              build. Gravel and mud settle; nothing is scoured; banks don't retreat;
//              dams never wash out. The bed stays a little below the floor.
//   STAGE 0    Where floods go over the bank, the water is routed across the valley
//              floor and wears shallow side channels that reinforce themselves, so a
//              healed valley floor becomes many channels, ponds and marsh.
//   WATER      Every 10 minutes: the spring and the hills feed the creek; the creek and
//              the floor's water table trade water; a deep trench drains the floor;
//              ponds fill, spill, evaporate and seep; plants draw the water table down
//              in the dry season. From the water table each cell of the valley gets
//              its depth to water, which makes it open water, marsh, green or brown.
//   DAMS       A dam is a crest on one node. It can hold water at most CREEK.dropMax
//              above the water just below it; higher than that the water digs under
//              and the pond barely holds. That is where "build downstream first" comes
//              from: nothing scripted, just the drop.
//
// Units: metres, seconds, m3/s, Pa. x across the valley, z along it (downstream is +z).
// Everything random comes from the creek's own seeded generator (saved with the world).
// ==========================================================================

var VW = 80, // valley grid: cells across
  VL = 160, // cells along the creek
  CELLS = VW * VL,
  VERTS = (VW + 1) * (VL + 1);

var CREEK = {
  ds: 2, // metres between nodes
  z0: -24, // the model runs a little beyond both ends of the valley
  z1: VL + 24,
  A0: 0.05, // km2 drained at the upstream end (the spring and the hills above it)
  lam: 0.1, // km2 more per km of valley
  D50: 0.016, // gravel size (m)
  // sediment brought by a valley year of floods, per km2 drained (m3 of solid)
  gravelYield: 30,
  fineYield: 800,
  stormsPerYear: 8, // expected storms (floods) in one valley year
  pondTrap: 0.03, // share of the passing mud that settles in each node of a pond
  // dams
  crest: [0, 0.3, 0.55, 0.55], // crest above the bed by dam level (weir, mud dam, planted banks)
  dropMax: 0.42, // the most a dam holds above the water just below it
  pipeHold: 0.18, // what a dam with too big a drop still holds above the water below
  raiseStep: 0.12, // a silted-up dam is raised this much at a time
  raiseAbove: 0.1, // ... up to this far above the valley floor
  siltGap: 0.12, // a pond counts as silted up when the bed behind is this close to the crest
  // hydrology (rates per valley day unless named otherwise)
  springQ: 0.0004, // m3/s the spring gives in the dry season (more in the wet season)
  upFill: 0.55, // upstream storage gained per valley day of rain (relative units)
  upTau: 2.2, // valley days for the upstream storage to drain
  upQ: 0.05, // m3/s per unit of upstream storage
  latRun: 0.00003, // m3/s per metre of valley while it rains (runoff from the sides)
  soilWet: 1.2, // topsoil moisture gained per valley day of rain
  soilDry: 0.018, // lost per valley day at full warmth
  rech: 0.05, // m of water-table rise per valley day of rain
  et: 0.004, // m of water-table fall per valley day at full warmth with roots in reach
  root: 1.3, // m: how deep roots reach
  tauDeep: 2.5, // valley days for a deep, cut-down trench to drain the floor
  tauShallow: 40, // ... and a creek near the top of its floor
  bedLoss: 1.6e-5, // m/s of water lost into a bed sitting above the water table
  deep: 0.016, // m/valley day the water table sinks into the gravel below a bare bed
  evap: 0.0011, // m/valley day off open water at full warmth
  pondSeep: 0.0004, // m/valley day a pond loses into drier ground around it
  lambda: 3, // m: how far the creek's water level reaches into the floor's water table
  hillFill: 0.03, // m of water-table rise the hills store per valley day of rain ...
  hillTau: 70, // ... and give back to the floor slowly, over this many valley days
  floodTau: 0.12, // valley days for a flood to drain away
};

var CREEK_PHYS = { g: 9.81, rho: 1000, srel: 1.65, por: 0.35 };

// Saves from another build are refused with the author's wording.
var OTHER_BUILD_TEXT = "This valley was made in an earlier version of Creekfolk and can't be opened here";

var CREEK_STAGES = {
  0: { name: "Stage 0: valley-floor wetland", text: "The creek has filled its trench and spread across the valley floor in many small channels, ponds and marsh." },
  I: { name: "Stage I: steady", text: "The creek reaches its floor, so floods spread out and lose their punch." },
  II: { name: "Stage II: cut down", text: "The creek sits in a trench below its old floor. Floods can't spread out, and the floor beside it dries." },
  III: { name: "Stage III: banks falling in", text: "The banks are too tall to stand." },
  IV: { name: "Stage IV: refilling", text: "Gravel and mud are piling up and the bed is rising; a new floor is growing inside the old trench." },
  V: { name: "Stage V: healed", text: "A new floor has built up inside the trench and plants hold it. Floods can spread out again." },
};

// ---- Creek Care's hydraulics, unchanged in substance ----------------------

// Peak flow per km2^0.8 for a flood of return period T (years).
function creekKofT(T) {
  if (T <= 1) return 5.4 * Math.max(T, 0.05);
  let lt = Math.log10(T);
  return lt <= 1 ? 5.4 + 10.4 * lt : 15.8 + 14.2 * (lt - 1);
}
function creekDurH(T) {
  return T < 1 ? 12 : T < 2 ? 10 : T < 10 ? 8 : 6;
}
// The natural bankfull channel for a drained area: width and depth (m).
function creekNatural(A) {
  let Q = creekKofT(1.5) * Math.pow(Math.max(A, 0.005), 0.8);
  return { Q, w: 2.7 * Math.sqrt(Q), d: 0.3 * Math.cbrt(Q) };
}
var creekTrench = (n) => Math.max(n.fp - n.bed, 0.05);
var creekBenchDepth = (n) => (n.bw > 0.05 ? clamp(n.bz - n.bed, 0, creekTrench(n) - 0.03) : 0);
var creekTopWidth = (n) => n.wb + 2 * n.m * creekTrench(n) + n.bw;
function creekWidthAt(n, y) {
  let Ht = creekTrench(n),
    Hz = creekBenchDepth(n),
    yy = Math.min(y, Ht),
    w = n.wb + 2 * n.m * yy;
  if (n.bw > 0.05 && yy > Hz) w += n.bw;
  if (y > Ht) w = Math.max(n.Wv || 20, creekTopWidth(n));
  return w;
}
function creekConveyance(n, y, S, o) {
  let Ht = creekTrench(n),
    Hz = creekBenchDepth(n),
    m = n.m,
    sq = Math.sqrt(1 + m * m),
    sS = Math.sqrt(S),
    y1 = Math.min(y, Ht),
    A,
    P,
    Qb = 0,
    Qf = 0;
  if (Hz > 0) {
    let wch = n.wb + 2 * m * Hz,
      yb = Math.min(y1, Hz);
    A = n.wb * yb + m * yb * yb + (y1 > Hz ? wch * (y1 - Hz) : 0);
    P = n.wb + 2 * yb * sq;
    if (y1 > Hz) {
      let Ab = n.bw * (y1 - Hz),
        Pb = n.bw + (y1 - Hz);
      Qb = (Ab * Math.pow(Ab / Pb, 2 / 3) * sS) / n.nB;
    }
  } else {
    A = n.wb * y1 + m * y1 * y1;
    P = n.wb + 2 * y1 * sq;
  }
  if (y > Ht) {
    let yo = y - Ht,
      wt = creekTopWidth(n);
    A += wt * yo;
    let Wf = Math.max((n.Wv || 20) - wt, 4);
    Qf = (Math.pow(yo, 5 / 3) * Wf * sS) / n.nF;
  }
  let Qc = ((A * Math.cbrt(A * A)) / Math.cbrt(P * P) * sS) / n.nC;
  if (o) (o.A = A), (o.P = P), (o.Qc = Qc), (o.Qb = Qb), (o.Qf = Qf);
  return Qc + Qb + Qf;
}
function creekSolveDepth(n, Q, S) {
  let lo = 0.001,
    hi = 0,
    y = clamp(Math.pow((Q * n.nC) / (Math.max(n.wb, 0.3) * Math.sqrt(S)), 0.6), 0.005, 20);
  for (let it = 0; it < 40; it++) {
    let f = creekConveyance(n, y, S) - Q;
    f < 0 ? (lo = y) : (hi = y);
    if (Math.abs(f) < 1e-4 * Q) return y;
    let dy = Math.max(1e-3 * y, 1e-5),
      d = (creekConveyance(n, y + dy, S) - Q - f) / dy,
      yn = d > 1e-12 ? y - f / d : hi ? 0.5 * (lo + hi) : y * 1.6;
    if (yn <= lo || (hi && yn >= hi) || !(yn > 0)) yn = hi ? 0.5 * (lo + hi) : Math.max(y * 1.6, lo * 2);
    if (Math.abs(yn - y) < 1e-6) return yn;
    y = yn;
  }
  return y;
}
function creekHydraulics(n, Q, S) {
  let o = {},
    y = creekSolveDepth(n, Q, S);
  creekConveyance(n, y, S, o);
  let R = o.A / Math.max(o.P, 0.05),
    share = o.Qf / Math.max(o.Qc + o.Qb + o.Qf, 1e-12),
    tau = CREEK_PHYS.rho * CREEK_PHYS.g * Math.min(R, y) * S * Math.sqrt(Math.max(1 - 0.8 * share, 0.2));
  return { y, yo: Math.max(y - creekTrench(n), 0), tau, R, share, Qf: o.Qf };
}
function creekRough(n) {
  n.nC = 0.03 * Math.pow(n.D50 / 0.03, 1 / 6) + 0.012 * n.veg;
  n.nB = 0.045 + 0.05 * n.veg;
  n.nF = 0.06 + 0.07 * n.veg;
  return n;
}
// Depth of a small flow in the bottom of the channel (wide-rectangle Manning).
function creekLowDepth(n, q, S) {
  if (q <= 1e-6) return 0;
  return Math.pow((q * n.nC) / (Math.max(n.wb, 0.3) * Math.sqrt(Math.max(S, 2e-4))), 0.6);
}

// ---- building the creek for a new valley ---------------------------------

// The creek on day one, from the terrain's fixed shape and the seed. Incised:
// the bed sits about a metre below the old valley floor in a narrow trench.
function creekBuildNodes(terrain, seed) {
  let rng = new Rng(seed + ":creek-build"),
    p1 = rng.range(0, 6.28),
    p2 = rng.range(0, 6.28),
    nodes = [];
  for (let z = CREEK.z0; z <= CREEK.z1 + 1e-6; z += CREEK.ds) {
    let A = CREEK.A0 + (CREEK.lam * (z - CREEK.z0)) / 1000,
      nat = creekNatural(A),
      fp = terrain.fp0(z),
      // how far it has cut down: deeper in the middle reaches, a little more on the steep upper stretch
      D = 0.98 + 0.22 * (0.5 + 0.5 * Math.sin(z * 0.031 + p1)) + 0.1 * Math.sin(z * 0.083 + p2) + (z < terrain.zKnee ? 0.12 : 0),
      n = {
        z: +z.toFixed(2),
        x: +terrain.creekX(z).toFixed(3),
        A: +A.toFixed(5),
        aLat: +(z === CREEK.z0 ? CREEK.A0 : (CREEK.lam * CREEK.ds) / 1000).toFixed(6),
        len: CREEK.ds,
        fp,
        bed: fp - D,
        wb: +(0.78 * nat.w).toFixed(3),
        m: 0.62,
        bw: 0,
        bz: -1e9,
        D50: CREEK.D50,
        veg: 0.28,
        vegT: 0.28,
        g: 0,
        wl: 0,
        q: 0,
        emaBed: 0,
        yBed: 0,
        stage: "II",
        spread: 0,
      };
    nodes.push(n);
  }
  // the bed always falls downstream
  for (let i = nodes.length - 2; i >= 0; i--) {
    let a = nodes[i],
      b = nodes[i + 1];
    if (a.bed < b.bed + 0.003 * CREEK.ds) a.bed = b.bed + 0.003 * CREEK.ds;
  }
  for (let n of nodes) {
    n.bed = +n.bed.toFixed(4);
    n.g = +(n.bed + 0.1).toFixed(4);
    n.wl = n.bed;
    n.yBed = n.bed;
    n.bedMin = n.bed;
  }
  return nodes;
}

// A new valley's creek state (world.creek).
function creekInit(w) {
  let T = w.terrain,
    nodes = T.initNodes.map((n) => ({ ...n }));
  let cr = {
    v: 1,
    rng: new Rng(w.seed + ":creek").getState(),
    nodes,
    dams: {},
    soil: 0.9,
    up: 1.2,
    hill: 0.6,
    flood: null,
    floods: 0,
    sIdx: -1,
    yearNo: 1,
    minWet: 1,
    minGreen: 1,
    driest: [],
    wetNow: 0,
    greenNow: 0,
    flowLen: 0,
    notes: {},
    chan: new Float32Array(VERTS),
    init: nodes.map((n) => [n.bed, n.fp, n.wb]),
  };
  w.creek = cr;
  creekDerive(w);
  creekHydro(w, true);
  return cr;
}

// ---- derived values (rebuilt after a load and after the shape changes) ----

// Per-node slope, roughness and floor width; per-cell lookups for the water table.
function creekDerive(w) {
  let cr = w.creek,
    ns = cr.nodes,
    T = w.terrain;
  for (let n of ns) {
    n.Wv = 2 * T.floorHW(n.z);
    creekRough(n);
  }
  creekSlopes(cr);
  T.setCreek(cr);
  creekCellIndex(w);
}

// Bed slope at each node from the effective bed (a dam's crest counts as bed).
function creekSlopes(cr) {
  let ns = cr.nodes,
    N = ns.length,
    eb = ns.map((n, i) => creekEffBed(cr, i)),
    raw = ns.map((n, i) => (i < N - 1 ? (eb[i] - eb[i + 1]) / CREEK.ds : (eb[i - 1] - eb[i]) / CREEK.ds));
  for (let i = 0; i < N; i++) {
    let s = 0,
      c = 0,
      a = Math.max(0, i - 2),
      b = Math.min(N - 1, i + 2);
    for (let j = a; j <= b; j++) (s += raw[j]), c++;
    // the reach's slope, but never much less than the valley floor's own (smooth)
    // slope: a bumpy bed must not make its own humps look flat, or they keep growing
    let fpS = (ns[a].fp - ns[b].fp) / ((b - a) * CREEK.ds),
      wide = Math.max(s / c, 0.5 * fpS, 3e-4);
    ns[i]._S = clamp(raw[i], 0.3 * wide, 2.5 * wide);
    ns[i]._Sw = wide;
  }
}

function creekDamAt(cr, i) {
  for (let id in cr.dams) if (cr.dams[id].i === i) return cr.dams[id];
  return null;
}
function creekEffBed(cr, i) {
  let n = cr.nodes[i],
    d = cr._damAt ? cr._damAt[i] : creekDamAt(cr, i);
  return d ? Math.max(n.bed, d.crest) : n.bed;
}
function creekNodeIndex(z) {
  return clamp(Math.round((z - CREEK.z0) / CREEK.ds), 0, Math.round((CREEK.z1 - CREEK.z0) / CREEK.ds));
}
// Interpolated node values at z (for drawing and lookups).
function creekAt(cr, z, key) {
  let f = clamp((z - CREEK.z0) / CREEK.ds, 0, cr.nodes.length - 1.0001),
    i = Math.floor(f),
    t = f - i,
    a = cr.nodes[i],
    b = cr.nodes[i + 1];
  return a[key] + (b[key] - a[key]) * t;
}

// Static per-cell lookups: which node, distance from the trench edge, floor weight.
var creekCellCache = new WeakMap();
function creekCellIndex(w) {
  let T = w.terrain,
    cr = w.creek,
    c = creekCellCache.get(cr);
  if (!c) {
    c = {
      node: new Int16Array(CELLS),
      d: new Float32Array(CELLS),
      floor: new Uint8Array(CELLS),
      h: new Float32Array(CELLS),
      nFloor: 0,
    };
    creekCellCache.set(cr, c);
  }
  let nf = 0;
  for (let cz = 0; cz < VL; cz++) {
    let z = cz + 0.5,
      i = creekNodeIndex(z),
      n = cr.nodes[i],
      cx = T.creekX(z),
      half = 0.5 * creekTopWidth(n),
      fhw = T.floorHW(z),
      ax = T.axisX(z);
    for (let cxI = 0; cxI < VW; cxI++) {
      let k = cz * VW + cxI,
        x = cxI + 0.5;
      c.node[k] = i;
      c.d[k] = Math.max(0, Math.abs(x - cx) - half);
      // the valley floor: the bottomland, with the creek in it
      let fl = (Math.abs(x - ax) < fhw - 0.5 || Math.abs(x - cx) <= half) && T.valleyR(x, z) < 0.9 && z > 0 && z < VL ? 1 : 0;
      c.floor[k] = fl;
      nf += fl;
      c.h[k] = 0.25 * (T.h[cz * (VW + 1) + cxI] + T.h[cz * (VW + 1) + cxI + 1] + T.h[(cz + 1) * (VW + 1) + cxI] + T.h[(cz + 1) * (VW + 1) + cxI + 1]);
    }
  }
  c.nFloor = nf;
  return c;
}
function creekCells(w) {
  return creekCellCache.get(w.creek) || creekCellIndex(w);
}

// ---- dams ----------------------------------------------------------------

// Bring the model's dams in line with the dam structures (call when one is built,
// raised or removed, and after a load).
function creekSyncDams(w) {
  let cr = w.creek,
    seen = {};
  for (let s of w.structures) {
    if (s.kind !== "dam" || !(s.level > 0)) continue;
    seen[s.id] = 1;
    let d = cr.dams[s.id];
    if (!d) {
      let i = creekNodeIndex(s.z);
      d = cr.dams[s.id] = { id: s.id, i, crest: cr.nodes[i].bed + CREEK.crest[s.level], lv: s.level, pl: cr.nodes[i].bed, plMax: cr.nodes[i].bed, hold: 1, raised: 0 };
    }
    if (s.level > d.lv) {
      // a new level: mud-packing the weir makes it taller
      if (CREEK.crest[s.level] > CREEK.crest[d.lv]) d.crest = Math.max(d.crest + CREEK.crest[s.level] - CREEK.crest[d.lv], cr.nodes[d.i].bed + CREEK.crest[s.level]);
      d.lv = s.level;
    }
    d.cond = s.cond ?? 1;
    // willow-planted banks: plants take hold along the pond
    if (s.level >= 3 && !d.planted) {
      d.planted = 1;
      for (let i = Math.max(0, d.i - 6); i <= Math.min(cr.nodes.length - 1, d.i + 2); i++) cr.nodes[i].vegT = Math.max(cr.nodes[i].vegT, 0.85);
    }
  }
  for (let id in cr.dams) if (!seen[id]) delete cr.dams[id];
  creekRefresh(w);
}

// Everything derived from the creek's saved state, brought up to date. Called after
// every change to the creek (and after a load), so a reloaded valley is exactly the
// valley that was saved.
function creekRefresh(w) {
  let cr = w.creek;
  creekDamIndex(cr);
  creekSlopes(cr); // a dam's crest counts as bed for the slope
  creekPondLevels(cr);
  creekPondNow(cr);
  creekCellWater(w, 0, seasonAt(w));
}

// Would this dam still hold its pond if it were built `add` higher? (What someone who
// knows "downstream" can judge by eye: is there water standing at its foot?)
function creekSafeToRaise(w, s, add) {
  let cr = w.creek,
    d = cr && cr.dams[s.id];
  if (!d) return true;
  if (d.tail === undefined) creekPondLevels(cr);
  return d.crest + add - d.tail <= CREEK.dropMax;
}

// A silted-up dam built up a hand higher (the tending chore). Returns true if it rose.
function creekRaiseDam(w, s, who) {
  let cr = w.creek,
    d = cr && cr.dams[s.id];
  s.raise = 0;
  s.siltNoted = 0;
  if (!d) return false;
  let n = cr.nodes[d.i],
    top = n.fp + CREEK.raiseAbove;
  if (d.crest >= top - 0.01) return false;
  // someone who knows the water must stand at its foot won't build it up into a leak.
  // If no dam below holds water against it, they lay a stone apron below it first, so
  // the water below stands higher: the series climbs from the bottom up.
  let apron = false;
  if (who && who.know && who.know.downstream && !creekSafeToRaise(w, s, CREEK.raiseStep)) {
    let N = cr.nodes.length,
      below = false;
    for (let j = d.i + 1; j <= Math.min(N - 1, d.i + 4); j++) if (cr._damAt && cr._damAt[j]) below = true;
    if (below) return false;
    let target = d.crest + CREEK.raiseStep - CREEK.dropMax + 0.02;
    for (let j = d.i + 1; j < N; j++) {
      let n2 = cr.nodes[j],
        want = target - 0.14 * (j - d.i - 1);
      if (want <= n2.bed + 0.005) break;
      want = Math.min(want, n2.fp - 0.1);
      n2.bed = n2.bedMin = +want.toFixed(5);
    }
    apron = true;
  }
  d.crest = +Math.min(top, d.crest + CREEK.raiseStep).toFixed(4);
  d.apron = (d.apron || 0) + (apron ? 1 : 0);
  d.raised = (d.raised || 0) + 1;
  s.raised = d.raised;
  s.cond = 1;
  w.stats.raises = (w.stats.raises || 0) + 1;
  logEvent(
    w,
    w.stats.raises === 1 ? 2 : 1,
    d.crest > n.fp ?
    `${who.name} built the ${builtLevelDef(s).label} up above the valley floor. Its pond will spread out over the floor now.` :
    apron ?
    `${who.name} laid a stone apron below the ${builtLevelDef(s).label} and built it up a hand higher, over the silt.` :
    s.silted ?
    `${who.name} built the ${builtLevelDef(s).label} up a hand higher, over the silt.` :
    `${who.name} built the ${builtLevelDef(s).label} up a hand higher, so the pond above it can rise too.`,
    [who.id],
    s,
    "wetland"
  );
  if (apron) creekDerive(w);
  creekRefresh(w);
  return true;
}
function creekDamIndex(cr) {
  let at = new Array(cr.nodes.length).fill(null);
  for (let id in cr.dams) at[cr.dams[id].i] = cr.dams[id];
  cr._damAt = at;
  cr._damIds = Object.keys(cr.dams).sort((a, b) => cr.dams[b].i - cr.dams[a].i); // downstream first
}

// Full-pond levels: what each dam can hold, judged from the water standing below it.
// Fills cr._pond (the full-pond level over each node, or -1e9), cr._pondOwner (the dam
// whose basin a node lies in, or -1) and each dam's plMax, tail and hold.
function creekPondLevels(cr) {
  let ns = cr.nodes,
    N = ns.length,
    full = cr._pondFull && cr._pondFull.length === N ? cr._pondFull : (cr._pondFull = new Float64Array(N)),
    owner = cr._pondOwner && cr._pondOwner.length === N ? cr._pondOwner : (cr._pondOwner = new Int32Array(N));
  full.fill(-1e9);
  owner.fill(-1);
  if (!cr._damIds) creekDamIndex(cr);
  for (let id of cr._damIds) {
    let d = cr.dams[id],
      j = d.i,
      below = Math.min(N - 1, j + 1),
      tail = Math.max(ns[below].bed + 0.05, full[below]),
      leak = 0.3 * Math.pow(1 - clamp(d.cond ?? 1, 0, 1), 1.5),
      top = d.crest - leak,
      max = top - tail <= CREEK.dropMax ? top : Math.min(top, tail + CREEK.pipeHold);
    d.plMax = +max.toFixed(5);
    d.tail = +tail.toFixed(5);
    d.hold = top - tail <= CREEK.dropMax ? 1 : 0; // 0: the water digs under it
    d.drowned = 0;
    for (let i = j; i >= 0; i--) {
      if (i < j && cr._damAt[i] && cr._damAt[i].crest >= max) break;
      if (ns[i].bed >= max) break;
      if (max > full[i]) {
        if (i < j && cr._damAt[i]) cr._damAt[i].drowned = 1;
        full[i] = max;
        owner[i] = +id;
      }
    }
  }
  return full;
}

// The water standing in each pond now (ponds shrink in the dry season): cr._pondNow[i]
// is the owning pond's level where it is above the bed, or -1e9.
function creekPondNow(cr) {
  let ns = cr.nodes,
    N = ns.length,
    now = cr._pondNow && cr._pondNow.length === N ? cr._pondNow : (cr._pondNow = new Float64Array(N)),
    owner = cr._pondOwner;
  if (!owner) creekPondLevels(cr), (owner = cr._pondOwner);
  for (let i = 0; i < N; i++) {
    let o = owner[i],
      d = o >= 0 ? cr.dams[o] : null;
    now[i] = d && d.pl > ns[i].bed ? d.pl : -1e9;
  }
  return now;
}

// ---- floods --------------------------------------------------------------

// Expected sum of k^1.5 * duration over a valley year's storms, so each flood can
// carry its fair share of the year's sediment.
var creekYearWork = (() => {
  let s = 0,
    n = 4000;
  for (let k = 0; k < n; k++) {
    let u = (k + 0.5) / n,
      T = Math.min(200, 1 / (CREEK.stormsPerYear * u));
    s += Math.pow(creekKofT(T), 1.5) * creekDurH(T);
  }
  return (s / n) * CREEK.stormsPerYear;
})();

// A storm has begun: one flood. Returns the flood's return period.
function creekStorm(w, Tforce) {
  let cr = w.creek;
  if (!cr) return 0;
  let rng = new Rng(1);
  rng.setState(cr.rng);
  let T = Tforce || Math.min(200, Math.max(0.15, 1 / (CREEK.stormsPerYear * Math.max(rng.next(), 1e-4))));
  let seed = rng.next();
  cr.rng = rng.getState();
  creekFloodWork(w, T, seed);
  cr.floods++;
  cr.flood = { t0: w.t, k: creekKofT(T), T: +T.toFixed(2) };
  return T;
}

function creekFloodWork(w, T, seed) {
  let cr = w.creek,
    ns = cr.nodes,
    N = ns.length,
    P = CREEK_PHYS,
    k = creekKofT(T),
    durS = creekDurH(T) * 3600,
    share = (Math.pow(k, 1.5) * creekDurH(T)) / creekYearWork,
    full = creekPondLevels(cr),
    spills = [];
  creekSlopes(cr);
  // A. flow, depth and the force on the bed. Water can't stand lower than the water just
  // below it, so a pool behind a hump of gravel (or a dam's pond) is slack water: pools
  // fill and humps don't, which keeps the bed from growing into a sawtooth.
  let hyd = new Array(N),
    surf = new Float64Array(N);
  for (let i = N - 1; i >= 0; i--) {
    let n = ns[i],
      Q = k * Math.pow(n.A, 0.8),
      S = Math.max(n._S, 1e-4),
      h = creekHydraulics(n, Q, S);
    hyd[i] = h;
    surf[i] = Math.max(n.bed + h.y, full[i], i < N - 1 && !(cr._damAt && cr._damAt[i]) ? surf[i + 1] : -1e9);
  }
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      Q = k * Math.pow(n.A, 0.8),
      S = Math.max(n._S, 1e-4),
      h = hyd[i],
      y = h.y,
      tau = h.tau,
      ws = n.bed + y;
    if (surf[i] > n.bed + y + 1e-4) {
      // the water is deeper than the flow needs: slack water
      let yp = surf[i] - n.bed,
        Se = S * Math.pow(y / yp, 10 / 3);
      tau = P.rho * P.g * Math.min(h.R * (yp / y), yp) * Se;
      ws = surf[i];
    }
    n._tau = tau;
    n._ws = ws;
    n._y = ws - n.bed;
    n._ob = ws > n.fp ? h.Qf + (full[i] > n.fp ? 0.3 * Q : 0) : 0;
    n.ob = +(ws > n.fp ? Math.min(1, (ws - n.fp) / 0.2) : 0).toFixed(3);
    if (n._ob > 0 && n.z > 0 && n.z < VL) spills.push(i);
  }
  // B. gravel: moves where the force is enough, settles where it is not. A flood can
  // carry on gravel that an earlier, smaller flood dropped loose on the bed, but it
  // never digs below what has settled for good (bedMin): the creek only builds.
  let qgUp = 0,
    deposit = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      qgIn = qgUp + (CREEK.gravelYield * n.aLat * share) / durS,
      th = n._tau / (P.srel * P.rho * P.g * n.D50),
      qb = th > 0.045 ? 8 * Math.pow(th - 0.045, 1.5) * Math.sqrt(P.srel * P.g * Math.pow(n.D50, 3)) : 0,
      cap = qb * Math.max(n.wb, 0.5),
      f = 1 - Math.exp(-n.len / Math.max(8, 8 * n.wb)),
      qgOut = cap * f + qgIn * (1 - f),
      area = (1 - P.por) * Math.max(n.wb, 0.5) * n.len;
    if (qgOut > qgIn) {
      let loose = Math.max(0, n.bed - (n.bedMin ?? n.bed)) * area;
      qgOut = qgIn + Math.min(qgOut - qgIn, loose / durS);
    }
    deposit[i] += (qgIn - qgOut) * durS;
    qgUp = Math.max(0, qgOut);
  }
  // C. mud: settles in ponds, among plants, and on the floor when the water goes over the bank
  let qfUp = 0,
    floorDep = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      qfIn = qfUp + (CREEK.fineYield * n.aLat * share) / durS,
      pondy = full[i] > n.bed ? clamp((full[i] - n.bed) / 0.5, 0, 1) : 0,
      slow = clamp(1 - n._tau / 15, 0, 1),
      trap = clamp(CREEK.pondTrap * pondy + slow * (0.03 * Math.max(0, n.veg - 0.3) + (n.bw > 0.05 ? 0.015 : 0)), 0, 0.4),
      dep = trap * qfIn;
    deposit[i] += dep * durS;
    let over = n.ob > 0 ? clamp(0.18 * n.ob, 0, 0.25) : 0,
      fdep = over * (qfIn - dep);
    floorDep[i] = fdep * durS;
    qfUp = Math.max(0, qfIn - dep - fdep);
  }
  // A flood lays gravel and mud down as a sheet over a stretch of creek, not on one
  // node: left on one node, a deposit starves the node above it of slope, that node
  // fills too, and since deposits never wash out again the bed grows into a sawtooth.
  // So each node's deposit is shared with its neighbours (never across a dam), and the
  // mud left on the floor spreads further, along the valley.
  creekShareDeposit(cr, deposit, 3, true);
  creekShareDeposit(cr, floorDep, 6, false);
  // D. the bed and the floor rise
  let rose = 0;
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      wWet = deposit[i] < 0 ? Math.max(n.wb, 0.5) : Math.max(n.wb + n.m * Math.min(creekTrench(n), Math.max(n._y, 0.1)), 0.5),
      dz = deposit[i] / ((1 - P.por) * wWet * n.len),
      cap = Math.min(n.fp - 0.05, Math.max(full[i], n.bed + 0.3)),
      floor0 = n.bedMin ?? n.bed;
    dz = clamp(dz, floor0 - n.bed, Math.max(0, cap - n.bed));
    dz = Math.min(dz, 0.12);
    n.bed = +(n.bed + dz).toFixed(5);
    rose += dz;
    // loose deposits settle for good: quickly in still water or among plants
    let k = full[i] > n.bed + 0.05 ? 0.5 : n.veg > 0.55 ? 0.2 : 0.03;
    n.bedMin = +(floor0 + Math.max(0, n.bed - floor0) * k).toFixed(5);
    let fw = Math.max(n.Wv - creekTopWidth(n), 6),
      dfp = floorDep[i] / ((1 - P.por) * fw * n.len);
    if (dfp > 0) n.fp = +(n.fp + Math.min(dfp, 0.02)).toFixed(5);
    // a bench buried by the rising bed is gone
    if (n.bw > 0.05 && n.bz <= n.bed + 0.05) (n.bw = 0), (n.bz = -1e9);
    // a bench rises with the mud that floods leave on it
    if (n.bw > 0.05 && n._ws > n.bz) {
      let nat = creekNatural(n.A);
      n.bz = Math.min(n.fp - 0.05, n.bz + clamp(0.004 + 0.01 * n.veg, 0, 0.02) * Math.min(1, (n._ws - n.bz) / 0.2) * (n.bz - n.bed < nat.d ? 1.5 : 1));
    }
  }
  // E. water over the floor wears side channels
  if (spills.length) creekSpread(w, spills, seed);
  cr.lastRise = +rose.toFixed(4);
  creekDerive(w);
  creekRefresh(w);
  creekNotes(w);
}

// Share each node's positive deposit (m3) with its neighbours within R nodes, weighted
// by closeness (a triangle). With byDam, a deposit never crosses a dam: the break is
// between a dam's node and the node below it. Volume is kept; scour (negative) stays put.
function creekShareDeposit(cr, dep, R, byDam) {
  let N = dep.length,
    at = cr._damAt,
    seg = new Int32Array(N),
    out = new Float64Array(N);
  for (let i = 1; i < N; i++) seg[i] = seg[i - 1] + (byDam && at && at[i - 1] ? 1 : 0);
  for (let i = 0; i < N; i++) {
    let v = dep[i];
    if (v <= 0) {
      out[i] += v;
      continue;
    }
    let lo = Math.max(0, i - R),
      hi = Math.min(N - 1, i + R),
      sw = 0;
    for (let j = lo; j <= hi; j++) if (seg[j] === seg[i]) sw += R + 1 - Math.abs(j - i);
    for (let j = lo; j <= hi; j++) if (seg[j] === seg[i]) out[j] += (v * (R + 1 - Math.abs(j - i))) / sw;
  }
  dep.set(out);
}

// How bumpy the creek is from node to node inside the valley: the mean size of the
// second difference of the bed (leaving out the steps at dams) and of the floor (m).
// A healthy creek has pools, riffles and steps at dams, but no sawtooth.
function creekBumpiness(w) {
  let cr = w.creek,
    ns = cr.nodes,
    at = cr._damAt || [],
    rb = 0,
    cb = 0,
    rf = 0,
    cf = 0;
  for (let i = 1; i < ns.length - 1; i++) {
    if (ns[i - 1].z < 0 || ns[i + 1].z > VL) continue;
    rf += Math.abs(ns[i + 1].fp - 2 * ns[i].fp + ns[i - 1].fp);
    cf++;
    if (at[i] || at[i - 1]) continue;
    rb += Math.abs(ns[i + 1].bed - 2 * ns[i].bed + ns[i - 1].bed);
    cb++;
  }
  return { bed: +(rb / Math.max(1, cb)).toFixed(3), floor: +(rf / Math.max(1, cf)).toFixed(3) };
}

// ---- Stage 0: water spreading over the valley floor ------------------------

// Route each spill across the floor and wear the ground it crosses a little deeper.
// Each thread of water starts at the bank, heads out across the floor and then down
// the valley, turning a little at each step toward lower ground (the floor's hollows,
// and the channels earlier floods wore), so its course curves the way water does.
// Paths that carry water get deeper and draw the next flood's water into them, so side
// channels form, branch, join and persist.
function creekSpread(w, spills, seed) {
  let cr = w.creek,
    T = w.terrain,
    ns = cr.nodes,
    chan = cr.chan,
    W1 = VW + 1,
    flow = creekSpread.flow || (creekSpread.flow = new Float32Array(VERTS)),
    s = Math.floor(seed * 1e6) | 0,
    rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  flow.fill(0);
  let onFloor = (x, z) => x >= 1 && z >= 1 && x < VW - 1 && z < VL - 1 && Math.abs(x - T.axisX(z)) < T.floorHW(z) + 0.8 && T.valleyR(x, z) < 0.9,
    inCreek = (x, z) => Math.abs(x - T.creekX(z)) < 0.5 * creekTopWidth(ns[creekNodeIndex(z)]) + 0.2,
    hAt = (x, z) => T.heightAt(x, z);
  for (let i of spills) {
    let n = ns[i],
      cx = T.creekX(n.z),
      half = 0.5 * creekTopWidth(n);
    for (let side = -1; side <= 1; side += 2)
      for (let lane = 0; lane < 3; lane++) {
        let x = cx + side * (half + 0.7 + lane * 0.9),
          z = n.z + (rnd() - 0.5) * 1.5,
          // heading, measured from straight down the valley (+z) toward +x
          th = side * (0.7 + 0.5 * rnd()),
          q = n._ob / 6,
          last = -1;
        for (let step = 0; step < 140 && onFloor(x, z); step++) {
          let v = Math.round(z) * W1 + Math.round(x);
          if (v !== last) (flow[v] += q), (last = v);
          let best = null,
            bs = 1e9;
          for (let dt of [-0.55, -0.28, 0, 0.28, 0.55]) {
            let t2 = clamp(th + dt, -1.35, 1.35), // never back up the valley
              nx = x + 0.8 * Math.sin(t2),
              nz = z + 0.8 * Math.cos(t2);
            if (!onFloor(nx, nz)) continue;
            if (inCreek(nx, nz)) {
              if (step < 5) continue;
              best = null; // back into the creek: this thread rejoins it
              bs = -1e9;
              break;
            }
            let sc = hAt(nx, nz) + 0.012 * Math.abs(dt) + 0.02 * rnd();
            if (sc < bs) (bs = sc), (best = [nx, nz, t2]);
          }
          if (!best) break;
          if (best[0] !== undefined && bs - hAt(x, z) > 0.04) {
            // a hollow it can't climb out of: the water ponds here and deepens it a little
            let k = Math.round(z) * W1 + Math.round(x);
            chan[k] = Math.min(0.3, chan[k] + 0.008);
            break;
          }
          [x, z, th] = best;
          // drift back toward straight down the valley, slowly
          th *= 0.97;
        }
      }
  }
  let carved = 0;
  for (let v = 0; v < VERTS; v++) {
    let f = flow[v];
    if (f <= 0) continue;
    let add = Math.min(0.03, 0.004 + 0.06 * Math.sqrt(f));
    let was = chan[v];
    chan[v] = Math.min(0.3, was + add);
    // the edges of a thread are worn a little too
    for (let o of [-1, 1, -W1, W1]) {
      let u = v + o;
      if (u >= 0 && u < VERTS && chan[u] < chan[v] * 0.4) chan[u] = Math.min(0.3, chan[u] + add * 0.25);
    }
    carved += chan[v] - was;
  }
  cr.carved = (cr.carved || 0) + carved;
}

// ---- water through the year ---------------------------------------------

var CREEK_HYDRO_DT = 600; // seconds between hydrology steps

// One hydrology step. With init true, settle levels without advancing anything.
function creekHydro(w, init = false) {
  let cr = w.creek;
  if (!cr) return;
  let ns = cr.nodes,
    N = ns.length,
    s = seasonAt(w),
    dtS = init ? 0 : CREEK_HYDRO_DT,
    dtD = dtS / VALLEY_DAY,
    rain = w.weather ? w.weather.rain || 0 : 0,
    warm = 0.25 + 0.75 * s.warmth,
    cloudy = w.weather && (w.weather.state === "cloudy" || rain > 0) ? 0.55 : 1,
    sy = 0.2;
  if (!cr._damIds) creekDamIndex(cr);
  // the topsoil, the same everywhere: rain wets it, warmth dries it
  cr.soil = clamp(cr.soil + rain * CREEK.soilWet * dtD - CREEK.soilDry * warm * cloudy * dtD * (0.4 + 0.6 * cr.soil), 0, 1);
  // what comes down from the spring and the hills above the valley
  cr.up += rain * CREEK.upFill * dtD;
  let rel = cr.up * (1 - Math.exp(-dtD / CREEK.upTau));
  cr.up -= rel;
  let Qin = CREEK.springQ * (0.3 + 1.7 * s.wet) + CREEK.upQ * (cr.up / CREEK.upTau);
  // the hills soak up the wet season's rain and give it back to the floor slowly, all
  // through the dry season. A cut-down creek drains it straight away; a healed floor
  // holds it, which is why a healed valley stays wet (and its creek keeps running)
  cr.hill = (cr.hill ?? 0.6) + rain * CREEK.hillFill * dtD;
  let hillOut = cr.hill * (1 - Math.exp(-dtD / CREEK.hillTau));
  cr.hill -= hillOut;
  // a flood drains away over a few valley hours
  let fk = 0;
  if (cr.flood) {
    let age = (w.t - cr.flood.t0) / VALLEY_DAY;
    fk = cr.flood.k * Math.exp(-age / CREEK.floodTau);
    if (fk < 0.02) (cr.flood = null), (fk = 0);
  }
  // ponds: what each dam can hold now, and which basin each node drains into
  creekPondLevels(cr);
  let owner = cr._pondOwner;
  for (let id in cr.dams) cr.dams[id]._in = 0;
  let q = Qin,
    flowLen = 0;
  for (let i = 0; i < N; i++) {
    let n = ns[i],
      S = Math.max(n._S || 0.005, 2e-4),
      d = owner[i] >= 0 ? cr.dams[owner[i]] : null,
      wetPond = !!d && d.pl > n.bed;
    q += rain * CREEK.latRun * n.len;
    let level = wetPond ? d.pl : n.bed + creekLowDepth(n, q, S),
      fw = Math.max(n.Wv - creekTopWidth(n), 6) * n.len; // floor area beside this node
    if (!init) {
      // the floor's water table and the creek trade water: a deep trench drains the
      // floor quickly, a creek near the top of its floor slowly
      let tau = CREEK.tauDeep + (CREEK.tauShallow - CREEK.tauDeep) * Math.pow(1 - clamp((n.fp - level) / 1.1, 0, 1), 2),
        dg = 0;
      if (n.g > level) {
        let out = (n.g - level) * (1 - Math.exp(-dtD / tau)), // m of water table
          gain = (out * sy * fw) / dtS;
        dg -= out;
        if (wetPond) d._in += gain;
        else q += gain;
      } else if (wetPond) {
        // a pond seeps slowly into the ground around it (mud seals its bottom)
        let seep = (CREEK.pondSeep * clamp((level - n.g) / 0.5, 0, 1) * Math.max(creekWidthAt(n, level - n.bed), 0.5) * n.len) / VALLEY_DAY;
        d._in -= seep;
        dg += (seep * dtS) / (sy * fw);
      } else if (q > 0) {
        // a flowing creek loses water into a bed that sits above the water table
        let lost = Math.min(q, CREEK.bedLoss * Math.max(n.wb, 0.5) * n.len * clamp((level - n.g) / 0.3, 0, 1) * (n.g < n.bed ? 1 : 0.35));
        q -= lost;
        dg += (lost * dtS) / (sy * fw);
      }
      // rain soaks in; roots draw water up in the warm months; a bare gravel bed lets
      // water sink away below it
      dg += rain * CREEK.rech * dtD + hillOut;
      let depth = n.fp - n.g;
      if (depth < CREEK.root) dg -= CREEK.et * warm * cloudy * (1 - depth / CREEK.root) * dtD;
      let fill = clamp((n.bed - (cr.init[i] ? cr.init[i][0] : n.bed)) / 0.6, 0, 1); // mud in the bed seals it
      if (n.g > n.bed - 1) dg -= CREEK.deep * (1 - 0.85 * fill) * (1 - 0.7 * n.veg * fill) * dtD;
      n.g = clamp(n.g + dg, n.bed - 1.6, n.fp);
    }
    // the water surface for drawing: the pond, the flood, or the flow
    let wl = wetPond ? d.pl : q > 2e-5 ? n.bed + creekLowDepth(n, q, S) : Math.min(n.bed - 0.05, n.g);
    if (fk > 0) {
      let fh = creekHydraulics(n, fk * Math.pow(n.A, 0.8) + q, S);
      wl = Math.max(wl, n.bed + fh.y);
    }
    if (q > 2e-5 && n.z >= 0 && n.z <= VL) flowLen += CREEK.ds;
    // water reaching a pond's basin goes into the pond
    if (d) (d._in += q), (q = 0);
    let D = cr._damAt[i];
    if (D && !D.drowned) {
      // the dam: a reservoir; it spills over the crest once it is full
      let area = creekPondArea(w, D);
      if (!init) D.pl += ((D._in - (CREEK.evap * warm * cloudy * area) / VALLEY_DAY) * dtS) / area;
      if (D.pl >= D.plMax) {
        if (!init) q += Math.max(0, ((D.pl - D.plMax) * area) / dtS);
        D.pl = D.plMax;
      }
      D.pl = +Math.max(D.pl, n.bed).toFixed(5);
      if (D.pl > n.bed) wl = Math.max(wl, D.pl);
    }
    n.q = +q.toFixed(6);
    n.wl = +wl.toFixed(4);
  }
  creekPondNow(cr);
  cr.flowLen = flowLen;
  cr.Qin = +Qin.toFixed(6);
  creekCellWater(w, init ? 0 : dtD, s);
  if (!init) creekSeason(w, s);
}

// Surface area of a dam's pond at its present level (m2).
function creekPondArea(w, d) {
  let cr = w.creek,
    ns = cr.nodes,
    owner = cr._pondOwner,
    id = d.id,
    a = 0;
  for (let i = d.i; i >= 0; i--) {
    if (owner[i] !== id) break;
    let n = ns[i];
    if (n.bed >= d.pl) continue;
    let y = d.pl - n.bed;
    a += (y > creekTrench(n) ? creekTopWidth(n) + (n.Wv - creekTopWidth(n)) * clamp((d.pl - n.fp + 0.12) / 0.24, 0, 1) : creekWidthAt(n, y)) * n.len;
  }
  return Math.max(a, 0.5);
}

// Each cell of the valley: water table, depth to water, marsh and green.
//   world.wt[k]     water table (m)
//   world.green[k]  0 brown .. 1 green
//   world.wet[k]    marsh (lagged: soaks in over a day, dries over a few)
function creekCellWater(w, dtD, s) {
  let cr = w.creek,
    c = creekCells(w),
    ns = cr.nodes,
    T = w.terrain;
  if (!w.wt || w.wt.length !== CELLS) w.wt = new Float32Array(CELLS);
  if (!w.green || w.green.length !== CELLS) w.green = new Float32Array(CELLS);
  if (!w.wet || w.wet.length !== CELLS) w.wet = new Float32Array(CELLS);
  let wt = w.wt,
    green = w.green,
    wet = w.wet,
    soil = cr.soil,
    pondNow = cr._pondNow,
    lam = CREEK.lambda,
    up = dtD > 0 ? 1 - Math.exp(-dtD / 0.8) : 1,
    down = dtD > 0 ? 1 - Math.exp(-dtD / 3) : 1,
    nWet = 0,
    nGreen = 0,
    nf = 0;
  let pf = creekPondFloor(w, c);
  let decay = new Float32Array(32);
  for (let j = 0; j < 32; j++) decay[j] = 1 - Math.exp(-j / 2 / lam); // d in half-metre steps
  // the creek's level and the water table are blended between the two nodes either
  // side of each row of cells, so the floor's water changes smoothly down the valley
  let rowLv = 0,
    rowG = 0;
  for (let k = 0; k < CELLS; k++) {
    if (k % VW === 0) {
      let fz = ((k / VW) + 0.5 - CREEK.z0) / CREEK.ds,
        i0 = Math.min(ns.length - 2, Math.floor(fz)),
        tz = fz - i0,
        a = ns[i0],
        b = ns[i0 + 1],
        la = pondNow[i0] > a.wl ? pondNow[i0] : a.wl,
        lb = pondNow[i0 + 1] > b.wl ? pondNow[i0 + 1] : b.wl;
      rowLv = la + (lb - la) * tz;
      rowG = a.g + (b.g - a.g) * tz;
    }
    let d = c.d[k],
      lv = rowLv,
      g = rowG,
      f = d >= 15.5 ? 1 : decay[Math.floor(d * 2)],
      table = lv + (g - lv) * f;
    if (pf[k] > table) table = pf[k];
    wt[k] = table;
    let dw = c.h[k] - table,
      gr = Math.max(soil, dw < 0.55 ? 1 : dw < CREEK.root ? 1 - (dw - 0.55) / (CREEK.root - 0.55) : 0),
      target = dw < 0.02 ? 1 : dw < 0.32 ? 1 - (dw - 0.02) / 0.3 : 0;
    // well away from the floor there is no water table to speak of
    if (!c.floor[k] && d > 8) (gr = soil), (target = 0);
    green[k] = gr;
    if (dtD <= 0) continue;
    let cur = wet[k];
    wet[k] = target > cur ? cur + (target - cur) * up : cur - (cur - target) * down;
    if (wet[k] < 0.01) wet[k] = 0;
    if (c.floor[k]) {
      nf++;
      if (wet[k] > 0.35) nWet++;
      if (gr > 0.5) nGreen++;
    }
  }
  if (dtD > 0) {
    cr.wetNow = +(nWet / Math.max(1, nf)).toFixed(4);
    cr.greenNow = +(nGreen / Math.max(1, nf)).toFixed(4);
  }
}

// Where a pond stands higher than the valley floor, its water spreads out over every
// cell it can reach that lies lower than its surface: across hollows and into side
// channels, so its shape follows the ground (and a pond can branch like a wetland).
// Returns the pond level reaching each cell, or -1e9.
function creekPondFloor(w, c) {
  let cr = w.creek,
    ns = cr.nodes,
    T = w.terrain,
    pf = creekPondFloor.a && creekPondFloor.a.length === CELLS ? creekPondFloor.a : (creekPondFloor.a = new Float32Array(CELLS)),
    seen = creekPondFloor.s || (creekPondFloor.s = new Int32Array(CELLS)),
    queue = creekPondFloor.q || (creekPondFloor.q = new Int32Array(CELLS)),
    owner = cr._pondOwner;
  pf.fill(-1e9);
  if (!owner) return pf;
  let mark = (creekPondFloor.m || 0) + 1;
  for (let id in cr.dams) {
    let D = cr.dams[id];
    if (D.drowned) continue;
    // the pond's nodes that stand under water higher than the floor beside them
    let qn = 0,
      zLo = 1e9,
      zHi = -1e9;
    mark++;
    for (let i = D.i; i >= 0 && owner[i] === D.id; i--) {
      let n = ns[i];
      if (D.pl <= n.bed) continue;
      zLo = Math.min(zLo, n.z - 1);
      zHi = Math.max(zHi, n.z + 1);
      if (D.pl < n.fp - 0.15) continue;
      let cz = Math.floor(n.z),
        cx = Math.floor(T.creekX(n.z));
      if (cz < 0 || cz >= VL || cx < 0 || cx >= VW) continue;
      let k = cz * VW + cx;
      if (seen[k] !== mark) (seen[k] = mark), (queue[qn++] = k);
    }
    if (!qn) continue;
    // spread over connected cells lower than the pond's surface (a little way past its ends)
    for (let h = 0; h < qn; h++) {
      let k = queue[h];
      if (D.pl > pf[k]) pf[k] = D.pl;
      let x = k % VW,
        z = (k / VW) | 0;
      for (let j = 0; j < 4; j++) {
        let nx = j === 0 ? x + 1 : j === 1 ? x - 1 : x,
          nz = j === 2 ? z + 1 : j === 3 ? z - 1 : z;
        if (nx < 0 || nz < 0 || nx >= VW || nz >= VL || nz < zLo - 4 || nz > zHi + 1) continue;
        let m = nz * VW + nx;
        if (seen[m] === mark || !c.floor[m] || c.h[m] >= D.pl) continue;
        seen[m] = mark;
        queue[qn++] = m;
      }
    }
  }
  creekPondFloor.m = mark;
  return pf;
}

// Seasonal bookkeeping: the driest point of each valley year, plants, stages.
function creekSeason(w, s) {
  let cr = w.creek;
  if (!s.wetSeason) {
    cr.minWet = Math.min(cr.minWet, cr.wetNow);
    cr.minGreen = Math.min(cr.minGreen, cr.greenNow);
  }
  if (cr.sIdx === s.idx) return;
  let was = cr.sIdx;
  cr.sIdx = s.idx;
  if (was < 0) return;
  // the first winter rains: the dry season is over; record its driest point
  if (s.idx === 3) {
    cr.driest.push({ year: s.year, wet: +cr.minWet.toFixed(4), green: +cr.minGreen.toFixed(4), t: Math.round(w.t) });
    if (cr.driest.length > 60) cr.driest.splice(0, cr.driest.length - 60);
    cr.minWet = 1;
    cr.minGreen = 1;
  }
  // plants grow through spring and summer (benches change the creek's shape)
  if (s.idx === 1 || s.idx === 2) creekPlants(w), creekDerive(w), creekRefresh(w);
  // a new valley year: stages from the year's change
  if (s.idx === 0) {
    for (let n of cr.nodes) {
      let dz = n.bed - n.yBed;
      n.emaBed = +(0.6 * n.emaBed + 0.4 * dz).toFixed(5);
      n.yBed = n.bed;
    }
    cr.yearNo = s.year;
  }
  creekClassify(w);
}

// Plants: reeds and willows creep into a wet, quiet channel; a dry trench stays grassy.
// Plants only ever increase (the creek only gets better), toward a target set by water.
function creekPlants(w) {
  let cr = w.creek,
    pondNow = cr._pondNow || [];
  for (let i = 0; i < cr.nodes.length; i++) {
    let n = cr.nodes[i],
      wetish = n.q > 2e-5 || pondNow[i] > n.bed || n.g > n.bed + 0.1,
      target = Math.max(n.vegT, wetish ? 0.72 : 0.32);
    n.veg = +Math.min(1, n.veg + Math.max(0, target - n.veg) * 0.12).toFixed(3);
    // a quiet, planted trench traps mud along its edges and starts a bench
    let nat = creekNatural(n.A),
      Ht = creekTrench(n);
    if (Ht > Math.max(1.2 * nat.d, nat.d + 0.3) && n.veg > 0.45 && Ht > 0.6) {
      if (n.bw < 0.05) (n.bz = n.bed + clamp(0.3 * Ht, 0.2, 0.45)), (n.bw = 0.3);
      else n.bw = +Math.min(n.bw + 0.12 * (n.veg - 0.3), 1.6 * Math.max(n.wb, 1)).toFixed(3);
    }
    creekRough(n);
  }
}

// Channel evolution stages per node (Creek Care's rules, with Stage 0 added).
function creekClassify(w) {
  let cr = w.creek,
    c = creekCells(w);
  // how much of the floor beside each node carries water
  let wetBy = new Float32Array(cr.nodes.length),
    nBy = new Float32Array(cr.nodes.length);
  for (let k = 0; k < CELLS; k++) {
    if (!c.floor[k]) continue;
    nBy[c.node[k]]++;
    if (w.wet[k] > 0.5) wetBy[c.node[k]]++;
  }
  for (let i = 0; i < cr.nodes.length; i++) {
    let n = cr.nodes[i],
      nat = creekNatural(n.A),
      Ht = creekTrench(n),
      Hz = creekBenchDepth(n),
      spread = nBy[i] ? wetBy[i] / nBy[i] : 0,
      incised = Ht > Math.max(1.5 * nat.d, nat.d + 0.35);
    n.spread = +spread.toFixed(3);
    let st;
    if (!incised) st = spread > 0.3 ? "0" : "I";
    else if (n.bw > 0.6 * n.wb && Hz > 0.5 * nat.d && Math.abs(n.emaBed) < 0.01 && n.veg > 0.45) st = "V";
    else if (n.emaBed > 0.004 || n.bw > 0.3 * n.wb) st = "IV";
    else st = "II";
    n.stage = st;
  }
}

// ---- what the rest of the game asks ---------------------------------------

// Water surface at a point, or null where it's dry.
function creekWaterAt(w, x, z) {
  if (!w.creek || !w.wt) return null;
  let cx = Math.floor(x),
    cz = Math.floor(z);
  if (cx < 0 || cz < 0 || cx >= VW || cz >= VL) return null;
  let k = cz * VW + cx,
    h = w.terrain.heightAt(x, z);
  return w.wt[k] > h ? w.wt[k] : null;
}

// What the land can feed: about 20 in a cut-down valley, up to 36 when it's healed.
function creekFeed(w) {
  let cr = w.creek;
  if (!cr) return LIFE.maxCapacity;
  let d = cr.driest.length ? cr.driest[cr.driest.length - 1].wet : 0,
    healed = 0,
    L = 0;
  for (let n of cr.nodes) {
    if (n.z < 0 || n.z > VL) continue;
    L++;
    if (n.stage === "V" || n.stage === "0" || n.stage === "I") healed++;
    else if (n.stage === "IV") healed += 0.35;
  }
  let ponds = 0;
  for (let id in cr.dams) if (cr.dams[id].pl > cr.nodes[cr.dams[id].i].bed + 0.15) ponds++;
  let health = clamp(0.55 * Math.min(1, d / 0.6) + 0.25 * (healed / Math.max(1, L)) + 0.2 * Math.min(1, ponds / 6), 0, 1);
  cr.health = +health.toFixed(3);
  return Math.round(20 + 16 * health);
}

// Share of the valley floor that stayed wet at the driest point of the last valley year.
function creekDriest(w) {
  let cr = w.creek;
  return cr && cr.driest.length ? cr.driest[cr.driest.length - 1] : null;
}

// Plain words for a share of the floor: a short word ("a quarter"), or how much of
// the floor (subject of a sentence: "About a quarter of the valley floor").
function creekShareWords(f) {
  return f <= 0.004 ? "none" : f < 0.04 ? "a pool or two" : f < 0.15 ? "a little" : f < 0.3 ? "a quarter" : f < 0.42 ? "a third" : f < 0.6 ? "half" : f < 0.7 ? "two thirds" : f < 0.8 ? "three quarters" : f < 0.9 ? "most" : f < 0.97 ? "nearly all" : "all";
}
function creekShareOfFloor(f) {
  return f <= 0.004 ? "none of the valley floor" : f < 0.04 ? "only a pool or two" : f < 0.15 ? "a little of the valley floor" : f < 0.3 ? "about a quarter of the valley floor" : f < 0.42 ? "about a third of the valley floor" : f < 0.6 ? "about half the valley floor" : f < 0.7 ? "about two thirds of the valley floor" : f < 0.8 ? "about three quarters of the valley floor" : f < 0.9 ? "most of the valley floor" : f < 0.97 ? "nearly all the valley floor" : "all of the valley floor";
}

// Stage of the creek at z (for the dev overlay and the panel).
function creekStageAt(w, z) {
  return w.creek ? w.creek.nodes[creekNodeIndex(z)].stage : "II";
}

// Milestones worth a line in the valley's history.
function creekNotes(w) {
  let cr = w.creek,
    nt = cr.notes,
    inValley = cr.nodes.filter((n) => n.z > 4 && n.z < VL - 4);
  if (!nt.over && inValley.some((n) => n.ob > 0.2)) {
    nt.over = 1;
    logEvent(w, 3, "For the first time anyone can remember, the flood spilled over the banks and spread across the valley floor.", [], null, "wetland");
  }
  if (!nt.chan && (cr.carved || 0) > 2) {
    nt.chan = 1;
    logEvent(w, 2, "The floods have worn little side channels across the valley floor.", [], null, "wetland");
  }
  let filled = inValley.filter((n) => creekTrench(n) < 0.5).length / Math.max(1, inValley.length);
  if (!nt.fill1 && filled > 0.15) {
    nt.fill1 = 1;
    logEvent(w, 3, "Behind the dams the creek has filled its old trench almost to the top.", [], null, "wetland");
  }
  if (!nt.fill2 && filled > 0.6) {
    nt.fill2 = 1;
    logEvent(w, 3, "Most of the creek has climbed back up to its valley floor.", [], null, "wetland");
  }
}

// ---- saving -------------------------------------------------------------

function creekSave(cr) {
  let o = {};
  for (let k in cr) if (k[0] !== "_" && k !== "chan" && k !== "nodes" && k !== "dams") o[k] = cr[k];
  o.nodes = cr.nodes.map((n) => {
    let m = {};
    for (let k in n) if (k[0] !== "_" && k !== "Wv" && k !== "nC" && k !== "nB" && k !== "nF") m[k] = n[k];
    return m;
  });
  o.dams = {};
  for (let id in cr.dams) {
    let d = {};
    for (let k in cr.dams[id]) if (k[0] !== "_") d[k] = cr.dams[id][k];
    o.dams[id] = d;
  }
  o.chanS = sparseToB64(cr.chan);
  return o;
}
function creekLoad(w, o) {
  let cr = { ...o };
  delete cr.chanS;
  cr.chan = o.chanS !== void 0 ? b64ToSparse(o.chanS, VERTS) : new Float32Array(VERTS);
  w.creek = cr;
  creekDamIndex(cr);
  creekDerive(w);
  creekRefresh(w);
  return cr;
}

// ==== src/sim/life.js ====
// ==========================================================================
// Lives: ages, stages, births, passings and leaving downstream.
//
// Every creekfolk lives about a real month. Children (first week) are small and
// learn by watching; adults (to day 24) build, pair up and raise children; wise
// elders (last week or so) slow down, rest and teach. Passing is peaceful and
// expected: the creekfolk goes to a place it loved, family and friends come to
// sit with it, and a tree is planted for it in the memorial grove.
//
// When the valley is full, young adults choose to go downstream. They leave the
// simulation, but the village remembers where they went (world.downstream).
//
// Everything here runs inside the event heap (event kind "L"), using the
// world's seeded random numbers, so a replayed stretch of time ends exactly
// where a live one would.
// ==========================================================================

var LIFE = {
  tick: 600,              // seconds between life checks (10 real minutes)
  childDays: 7,           // real days as a child
  elderDays: 24,          // age when a creekfolk becomes a wise elder
  lifespanDays: 30,       // average length of a life
  lifespanSpread: 0.8,    // standard deviation, days (clamped to +/- 1.6)
  pairBirthDays: 6.0,     // a pair with room has a child about this often (tuned by tools/year.cjs)
  pairWarmth: 0.4,        // mutual warmth needed to pair up
  settleDays: 2,          // after this many days grown, a good friend is enough
  friendWarmth: 0.15,     // ...meaning this much mutual warmth
  floorAdults: 4,
  roomFill: 0.75,         // below this share of capacity, births come a little faster ...
  roomBoost: 1.35,        // ... by this much (Phase 3A: capacity now grows as the creek heals)         // below this many adults, births speed up (the valley never empties)
  maxCapacity: 36,        // upper limit, set from the catch-up benchmark
  restlessDays: 3,        // when the valley is nearly full, someone chooses to leave about this often
  founders: 5,
  founderAges: [8, 9.5, 11, 12.5, 14],
};

var DAY_S = 86400;

function ageDays(w, c, t = w.t) {
  return (t - (c.born ?? 0)) / DAY_S;
}

function stageOf(w, c, t = w.t) {
  let a = ageDays(w, c, t);
  return a < LIFE.childDays ? "child" : a < LIFE.elderDays ? "adult" : "elder";
}

// Size of the body relative to a grown adult: children grow through their first week.
function bodyScale(w, c, t = w.t) {
  let a = ageDays(w, c, t);
  if (a >= LIFE.childDays) return 1;
  return 0.55 + 0.45 * smoothstep(0, LIFE.childDays, a);
}

// Names: the old founders' names first, then gentle made-up ones in the same spirit.
var NAME_START = ["Ash", "Bri", "Cal", "Dew", "Ell", "Fen", "Gil", "Hal", "Ivy", "Jun", "Kip", "Lin", "Mab", "Nell", "Oak", "Pim", "Quin", "Rill", "Sol", "Tam", "Umb", "Vel", "Wil", "Yar", "Zin", "Bram", "Cob", "Dill", "Fern", "Hap", "Lark", "Mo", "Nib", "Pell", "Rue", "Sky", "Tib", "Wick"];
var NAME_END = ["", "", "a", "o", "y", "ie", "et", "in", "en", "el", "ly", "wyn", "ble", "kin", "ra", "lo", "mo", "sy", "ter", "ow", "ley", "rin"];

function newName(w, parents = []) {
  let rng = w.rng,
    living = new Set(w.creatures.map((c) => c.name));
  // Sometimes a child is named for someone the parents loved who has passed.
  if (parents.length && rng.chance(0.18)) {
    let honored = [];
    for (let p of parents)
      for (let id in p.rel) {
        let gone = w.lineage && w.lineage[id];
        if (gone && gone.died && p.rel[id].warmth > 0.4 && !living.has(gone.name)) honored.push(gone);
      }
    if (honored.length) {
      let g = rng.pick(honored);
      return { name: g.name, honors: g.id };
    }
  }
  for (let k = 0; k < 40; k++) {
    let n = rng.pick(NAME_START) + rng.pick(NAME_END);
    n = n.slice(0, 8);
    if (!living.has(n) && !(w.usedNames || {})[n]) return { name: n };
  }
  for (let k = 0; ; k++) {
    let n = rng.pick(NAME_START) + rng.pick(NAME_END);
    if (!living.has(n)) return { name: n };
  }
}

// A permanent, compact record of everyone who has lived in the valley.
function lineageRecord(w, c) {
  w.lineage = w.lineage || {};
  let r = w.lineage[c.id];
  if (!r)
    r = w.lineage[c.id] = {
      id: c.id,
      name: c.name,
      born: Math.round(c.born ?? 0),
      parents: (c.parents || []).slice(),
      gen: c.gen || 0,
      sig: c.sig,
    };
  return r;
}

// Give a creature its life fields. Used for founders, births and old saves.
function initLife(w, c, born, opts = {}) {
  c.born = born;
  let spread = clamp(w.rng.normal() * LIFE.lifespanSpread, -1.6, 1.6);
  c.lifespan = Math.round((LIFE.lifespanDays + spread) * DAY_S);
  c.parents = opts.parents || [];
  c.children = [];
  c.partner = null;
  c.gen = opts.gen || 0;
  c.adultStrength = c.adultStrength || c.strength;
  c.stage = stageOf(w, c);
  lineageRecord(w, c);
  (w.usedNames = w.usedNames || {})[c.name] = 1;
}

// ---------------------------------------------------------------------------
// The life check: runs every LIFE.tick seconds as heap event "L".
// ---------------------------------------------------------------------------
function lifeTick(w) {
  let t = w.t;
  schedule(w, t + LIFE.tick, "L");
  noteSeason(w);
  for (let c of w.creatures.slice()) growUp(w, c);
  keepOnTheirWay(w);
  pairUp(w);
  travelers(w);
  births(w);
  farewells(w);
  leaving(w);
  housing(w);
  mindsTick(w); // stories, myths, visitors (minds.js)
  giftTick(w); // gifts that stopped, found objects (gift.js)
  w.popLog = w.popLog || [];
  if (!w.popLog.length || t - w.popLog[w.popLog.length - 1].t >= DAY_S / 4) {
    let s = stageCounts(w);
    w.popLog.push({ t: Math.round(t), n: w.creatures.length, c: s.child, a: s.adult, e: s.elder, cap: valleyCapacity(w) });
    if (w.popLog.length > 1600) w.popLog.splice(0, w.popLog.length - 1600);
  }
}

function stageCounts(w) {
  let s = { child: 0, adult: 0, elder: 0 };
  for (let c of w.creatures) if (!c.visitor) s[stageOf(w, c)]++;
  return s;
}

function noteSeason(w) {
  let s = seasonAt(w);
  if (w.season !== s.name) {
    let first = !w.season;
    w.season = s.name;
    if (!first) w.gatherPending = { season: s.name, t: Math.round(w.t) }; // MINDS: they gather when the season turns
    if (!first)
      logEvent(w, 3, {
        spring: "Spring has come to the valley.",
        summer: "Summer has come to the valley.",
        autumn: "Autumn has come to the valley.",
        winter: "Winter has come to the valley.",
      }[s.name], [], null, "season");
  }
}

function growUp(w, c) {
  let st = stageOf(w, c);
  if (st === "child") {
    // Strength grows with the body.
    c.strength = +(c.adultStrength * (0.35 + 0.65 * smoothstep(0, LIFE.childDays, ageDays(w, c)))).toFixed(3);
  }
  if (st === c.stage) return;
  let was = c.stage;
  c.stage = st;
  if (st === "adult" && was === "child") {
    c.strength = c.adultStrength;
    logEvent(w, 2, `${c.name} is all grown up.`, [c.id], c, "life");
    remember(w, c, "life", "I am grown now. I can build and carry like the others.", 0.6);
  } else if (st === "elder") {
    // Elders slow down and grow patient.
    c.temp.activity = +(c.temp.activity * 0.72).toFixed(3);
    c.temp.patience = +clamp(c.temp.patience + 0.2, 0, 1).toFixed(3);
    c.strength = +(c.adultStrength * 0.75).toFixed(3);
    logEvent(w, 2, `${c.name} has become one of the valley's wise elders.`, [c.id], c, "life");
    remember(w, c, "life", "My steps are slower now. There is more time for watching, and for telling.", 0.6);
  }
}

function isRelated(a, b) {
  if ((a.parents || []).includes(b.id) || (b.parents || []).includes(a.id)) return true;
  return (a.parents || []).some((p) => (b.parents || []).includes(p));
}

function pairUp(w) {
  let adults = w.creatures.filter((c) => stageOf(w, c) === "adult" && !c.partner && !c.leaving && !c.farewell && !c.visitor);
  if (adults.length < 2) return;
  let few = adults.length + w.creatures.filter((c) => c.partner).length < LIFE.floorAdults;
  for (let a of adults) {
    if (a.partner) continue;
    // Falling for someone takes real warmth; after a couple of days grown, a good friend will do.
    let settled = ageDays(w, a) > LIFE.childDays + LIFE.settleDays;
    let best = null,
      bestW = few ? 0.15 : settled ? LIFE.friendWarmth : LIFE.pairWarmth;
    for (let b of adults) {
      if (b === a || b.partner || isRelated(a, b)) continue;
      let ra = a.rel[b.id],
        rb = b.rel[a.id];
      if (!ra || !rb) continue;
      let m = Math.min(ra.warmth, rb.warmth);
      if (m > bestW) (bestW = m), (best = b);
    }
    if (best) {
      a.partner = best.id;
      best.partner = a.id;
      logEvent(w, 3, `${a.name} and ${best.name} have paired up.`, [a.id, best.id], a, "life");
      remember(w, a, "life", `${best.name} and I belong together now.`, 0.8, { who: best.id });
      remember(w, best, "life", `${a.name} and I belong together now.`, 0.8, { who: a.id });
      warmTo(a, best, 0.1);
      warmTo(best, a, 0.1);
    }
  }
}

// How many creekfolk the valley can hold right now: homes, food and room.
function valleyCapacity(w) {
  let homes = 0,
    food = 0;
  for (let s of w.structures) {
    if (s.kind === "home" && s.level > 0) homes++;
    if (s.kind === "store" && s.level > 0) food += Math.min(3, s.level);
    if (s.kind === "garden" && s.level > 0) food += Math.min(4, s.level);
  }
  let shelter = clamp(8 + 4 * homes + 2 * food, 8, LIFE.maxCapacity);
  // CREEK: and no more than the land can feed, which grows as the creek heals
  return Math.min(shelter, creekFeed(w));
}

// The two ceilings, for the village panel and the dev menu.
function capacityParts(w) {
  let homes = 0,
    food = 0;
  for (let s of w.structures) {
    if (s.kind === "home" && s.level > 0) homes++;
    if (s.kind === "store" && s.level > 0) food += Math.min(3, s.level);
    if (s.kind === "garden" && s.level > 0) food += Math.min(4, s.level);
  }
  return { shelter: clamp(8 + 4 * homes + 2 * food, 8, LIFE.maxCapacity), feed: creekFeed(w) };
}

function births(w) {
  let pairs = [];
  for (let c of w.creatures) {
    let p = c.partner && w.byId[c.partner];
    if (p && c.id < p.id && !c.visitor && stageOf(w, c) === "adult" && stageOf(w, p) === "adult" && !c.leaving && !p.leaving && !c.farewell && !p.farewell) pairs.push([c, p]);
  }
  let adults = w.creatures.filter((c) => !c.visitor && stageOf(w, c) === "adult").length,
    boost = adults < LIFE.floorAdults ? 2.5 : 1;
  // Births go on when the valley is full (young adults leave to make room), but pause
  // if it is badly overcrowded.
  let pop = w.creatures.filter((c) => !c.visitor).length;
  if (pop >= valleyCapacity(w) + 6) return;
  // Fewer births once the valley is nearly full: pairs have children about every
  // pairBirthDays until it is 85% full, then up to two and a half times less often.
  let fill = pop / valleyCapacity(w),
    crowd = 1 + 1.5 * clamp((fill - 0.85) / 0.15, 0, 1);
  // CREEK: room to grow (the land can feed more than live here): a few more children
  let room = fill < LIFE.roomFill ? LIFE.roomBoost : 1;
  let p = (LIFE.tick / (LIFE.pairBirthDays * crowd * DAY_S)) * boost * room;
  for (let [a, b] of pairs) if (w.rng.chance(p)) bear(w, a, b);
}

function mixTemp(w, a, b) {
  let out = {};
  for (let k in a.temp) out[k] = +clamp((a.temp[k] + b.temp[k]) / 2 + w.rng.normal() * 0.15, 0.08, 0.95).toFixed(3);
  return out;
}

function bear(w, a, b) {
  let home = homeOf(w, a) || homeOf(w, b),
    at = home ? { x: home.x + w.rng.range(-0.8, 0.8), z: home.z + w.rng.range(-0.8, 0.8) } : { x: a.x, z: a.z };
  if (!w.terrain.walkable(at.x, at.z)) at = { x: a.x, z: a.z };
  let nm = newName(w, [a, b]);
  let c = register(w, makeFolk(w, nm.name, at.x, at.z));
  // Inherit: temperament mixes both parents; accent comes from one of them; looks blend.
  c.temp = mixTemp(w, a, b);
  let src = w.rng.chance(0.5) ? a : b;
  c.accent = JSON.parse(JSON.stringify(src.accent));
  c.accent.pitch = +(c.accent.pitch * 1.18).toFixed(3); // small voices
  let la = a.look,
    lb = b.look;
  for (let k of ["sat", "light", "size", "ear", "earW", "hands", "belly", "eye"])
    c.look[k] = +clamp((la[k] + lb[k]) / 2 + w.rng.normal() * 0.05, 0.2, 1.5).toFixed(3);
  let dh = ((lb.hue - la.hue + 1.5) % 1) - 0.5;
  c.look.hue = +(((la.hue + dh * w.rng.range(0.3, 0.7) + w.rng.normal() * 0.03) % 1 + 1) % 1).toFixed(3);
  c.look.tail = w.rng.chance(0.5) ? la.tail : lb.tail;
  c.look.spots = w.rng.chance(0.5) ? la.spots : lb.spots;
  for (let k in c.interests) c.interests[k] = +clamp((a.interests[k] + b.interests[k]) / 2 + w.rng.normal() * 0.12, 0.05, 0.95).toFixed(3);
  c.fearWater = +clamp(0.35 + c.temp.caution * 0.4, 0.05, 0.9).toFixed(3);
  initLife(w, c, w.t, { parents: [a.id, b.id], gen: Math.max(a.gen || 0, b.gen || 0) + 1 });
  if (nm.honors) c.honors = nm.honors;
  c.home = null;
  c.sleepSpot = home ? { x: home.x, z: home.z } : null;
  // Family warmth from the start.
  for (let p of [a, b]) {
    let r = relation(c, p);
    r.warmth = 0.75;
    r.fam = 0.6;
    let q = relation(p, c);
    q.warmth = 0.85;
    q.fam = 0.6;
    p.children = p.children || [];
    p.children.push(c.id);
    remember(w, p, "life", `Our little one, ${c.name}, was born.`, 0.9, { who: c.id, x: at.x, z: at.z, pv: 0.4 });
  }
  for (let sid of new Set([...(a.children || []), ...(b.children || [])])) {
    let s = w.byId[sid];
    if (!s || s === c) continue;
    relation(c, s).warmth = 0.45;
    relation(s, c).warmth = Math.max(relation(s, c).warmth, 0.45);
    relation(c, s).fam = relation(s, c).fam = 0.3;
  }
  w.creatures.push(c);
  w.stats.births = (w.stats.births || 0) + 1;
  let honor = nm.honors && w.lineage[nm.honors] ? `, named for ${w.lineage[nm.honors].name}` : "";
  logEvent(w, 3, `A little one was born to ${a.name} and ${b.name}: ${c.name}${honor}.`, [c.id, a.id, b.id], at, "birth");
  // Wake up a minute later, like the founders did.
  c.asleep = true;
  c.act = { type: "nap", step: "nap", t0: w.t, t1: w.t + 60, x: c.x, z: c.z, tok: c.tok, rc0: rainTotal(w, w.t) };
  schedule(w, w.t + 60, "A", c.id, c.tok);
  return c;
}

// ---------------------------------------------------------------------------
// Passing.
// ---------------------------------------------------------------------------

// The place a creekfolk loved most: its warmest remembered spot, else home, else the creek.
function lovedPlace(w, c) {
  let best = null,
    v = 0.15;
  for (let k in c.places) {
    if (c.places[k] > v) {
      let [gx, gz] = k.split(",").map(Number);
      let p = { x: gx * 6 + 3, z: gz * 6 + 3 };
      if (w.terrain.walkable(p.x, p.z)) (v = c.places[k]), (best = p);
    }
  }
  if (best) return best;
  let h = homeOf(w, c);
  if (h && h.level > 0) return { x: h.x + 0.8, z: h.z + 0.6 };
  return w.terrain.bankPoint(w.terrain.side(c.x, c.z), clamp(c.z, 8, VL - 8), 1.4);
}

function canBeInterrupted(c) {
  return !c.act || !UNINTERRUPTIBLE.has(c.act.type) || c.act.type === "sleep";
}

function farewells(w) {
  for (let c of w.creatures) {
    if (c.farewell || c.leaving || c.visitor) continue;
    if (w.t - (c.born ?? 0) < c.lifespan) continue;
    if (c.asleep || !canBeInterrupted(c)) continue; // wait until it wakes, or finishes what it's doing
    let spot = lovedPlace(w, c);
    c.farewell = { t: w.t, x: +spot.x.toFixed(2), z: +spot.z.toFixed(2) };
    setPlan(w, c, {
      goal: "farewell",
      steps: [
        { do: "walk", x: spot.x, z: spot.z, near: 0.2, why: "farewell" },
        { do: "farewell" },
      ],
      i: 0,
    });
    // Family and close friends come to sit with them.
    for (let o of w.creatures) {
      if (o === c || o.farewell || o.leaving || o.visitor || o.asleep || !canBeInterrupted(o)) continue;
      let r = o.rel[c.id];
      let family = (c.children || []).includes(o.id) || (c.parents || []).includes(o.id) || c.partner === o.id;
      if (!family && !(r && r.warmth > 0.35)) continue;
      let a = w.rng.range(0, 6.28),
        d = w.rng.range(0.9, 1.6);
      let sx = spot.x + Math.cos(a) * d,
        sz = spot.z + Math.sin(a) * d;
      if (!w.terrain.walkable(sx, sz)) (sx = spot.x), (sz = spot.z);
      setPlan(w, o, {
        goal: "vigil",
        with: c.id,
        steps: [
          { do: "walk", x: sx, z: sz, near: 0.2, why: "vigil" },
          { do: "vigil", id: c.id },
        ],
        i: 0,
      });
    }
  }
}

function passOn(w, c) {
  let age = ageDays(w, c),
    near = w.creatures.filter((o) => o !== c && o.act && o.plan && o.plan.goal === "vigil" && o.plan.with === c.id);
  let rec = lineageRecord(w, c);
  rec.died = Math.round(w.t);
  rec.age = +age.toFixed(1);
  rec.children = (c.children || []).slice();
  rec.partner = c.partner;
  rec.how = "passed";
  // The tree in the memorial grove.
  let tree = groveTree(w, c);
  if (tree) rec.tree = tree.id;
  // Memories for everyone who loved them.
  for (let o of w.creatures) {
    if (o === c) continue;
    let r = o.rel[c.id];
    let family = (c.children || []).includes(o.id) || (c.parents || []).includes(o.id) || c.partner === o.id;
    if (!family && !(r && r.warmth > 0.3)) continue;
    let sat = near.includes(o);
    let who = (c.parents || []).includes(o.id) ? `our child ${c.name}` : (c.children || []).includes(o.id) ? `my parent ${c.name}` : c.partner === o.id ? c.name : c.name;
    remember(
      w,
      o,
      "passing",
      sat ? `I sat with ${who} at the end. It was quiet, and it was all right.` : `${c.name[0].toUpperCase() + c.name.slice(1)} has passed on. I will miss them.`,
      family ? 0.95 : 0.7,
      { who: c.id, x: c.farewell ? c.farewell.x : c.x, z: c.farewell ? c.farewell.z : c.z, pv: 0.35 },
    );
    feel(o, w, "sad", family ? 0.4 : 0.25);
    if (o.partner === c.id) o.partner = null;
  }
  let words = near.length
    ? `, with ${nameList(w, near.map((o) => o.id))} beside them`
    : "";
  storyPassing(w, c, near); // MINDS
  let offer = passingOfferings(w, c, near); // MINDS: customs at a passing
  let kids = (c.children || []).length;
  logEvent(
    w,
    3,
    `${c.name} passed on peacefully${words}. They lived ${Math.round(age)} days${kids ? ` and leave ${kids} ${kids === 1 ? "child" : "children"}` : ""}. A young tree was planted for them in the grove.${offer}`,
    [c.id, ...near.map((o) => o.id)],
    c.farewell || c,
    "passing",
  );
  w.stats.passings = (w.stats.passings || 0) + 1;
  for (let o of near) if (o.plan && o.plan.goal === "vigil") o.plan.i = o.plan.steps.length;
  retire(w, c);
}

// Where the grove is: a gentle slope away from the village, chosen once.
function grovePlace(w) {
  if (w.grove) return w.grove;
  let T = w.terrain,
    best = null,
    bestS = -1e9,
    rng = new Rng(w.seed + ":grove");
  for (let k = 0; k < 200; k++) {
    let x = rng.range(6, VW - 6),
      z = rng.range(6, VL - 6);
    if (!T.walkable(x, z)) continue;
    let r = T.valleyR(x, z),
      e = T.edgeDist(x, z);
    // CREEK: on the terrace slopes, off the valley floor (which turns to wetland)
    if (r < 0.45 || r > 0.8 || e < 5 || T.floorWeight(x, z) > 0.05) continue;
    let crowd = 0;
    for (let s of w.structures) crowd += Math.max(0, 9 - Math.hypot(s.x - x, s.z - z));
    let s = -crowd - Math.abs(r - 0.68) * 20 - Math.hypot(x - w.meadow.x, z - w.meadow.z) * 0.12 + rng.range(0, 2);
    if (s > bestS) (bestS = s), (best = { x: +x.toFixed(2), z: +z.toFixed(2), n: 0 });
  }
  w.grove = best || { x: w.meadow.x + 8, z: w.meadow.z + 8, n: 0 };
  return w.grove;
}

function groveTree(w, c) {
  let g = grovePlace(w);
  // Trees spiral out from the center, a little apart, family near family.
  for (let k = 0; k < 60; k++) {
    let n = g.n++,
      a = n * 2.39996,
      r = 0.7 * Math.sqrt(n + 0.5);
    let x = g.x + Math.cos(a) * r,
      z = g.z + Math.sin(a) * r;
    if (!w.terrain.walkable(x, z)) continue;
    let tree = register(w, {
      id: w.nextId++,
      kind: "grove",
      x: +x.toFixed(2),
      z: +z.toFixed(2),
      side: w.terrain.side(x, z),
      who: c.id,
      name: c.name,
      planted: Math.round(w.t),
      hue: c.look.hue,
    });
    w.res.push(tree);
    return tree;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Leaving downstream.
// ---------------------------------------------------------------------------
function leaving(w) {
  let cap = valleyCapacity(w),
    n = w.creatures.filter((c) => !c.leaving && !c.farewell && !c.visitor).length,
    over = n - cap;
  // Over capacity, someone must go. Nearly full, a restless young one may choose to,
  // about once every few days.
  if (over <= 0 && !(n >= cap * 0.85 && w.rng.chance(LIFE.tick / (LIFE.restlessDays * DAY_S)))) return;
  if (w.creatures.some((c) => c.leaving)) return; // one at a time
  let young = w.creatures.filter((c) => {
    let a = ageDays(w, c);
    return a >= LIFE.childDays && a < LIFE.childDays + 7 && !c.farewell && !c.visitor && !c.asleep && canBeInterrupted(c) && !(c.children || []).some((k) => w.byId[k] && stageOf(w, w.byId[k]) === "child");
  });
  if (!young.length && over > 2)
    young = w.creatures.filter((c) => stageOf(w, c) === "adult" && !c.visitor && !c.farewell && !c.asleep && canBeInterrupted(c) && !(c.children || []).some((k) => w.byId[k] && stageOf(w, w.byId[k]) === "child"));
  if (!young.length) return;
  let c = w.rng.weighted(young, (y) => 0.2 + y.temp.curiosity + y.interests.exploring + (y.partner ? -0.3 : 0.3));
  if (!c) return;
  let mate = c.partner && w.byId[c.partner];
  let edge = downstreamEdge(w, c);
  c.leaving = { t: w.t, x: edge.x, z: edge.z, with: mate && !mate.leaving && stageOf(w, mate) === "adult" && canBeInterrupted(mate) && !mate.asleep ? mate.id : null };
  let goers = [c];
  if (c.leaving.with) {
    mate.leaving = { t: w.t, x: edge.x + 0.6, z: edge.z, with: c.id };
    goers.push(mate);
  }
  for (let g of goers)
    setPlan(w, g, {
      goal: "leave",
      steps: [
        { do: "walk", x: g.leaving.x, z: g.leaving.z, near: 0.3, why: "leave" },
        { do: "depart" },
      ],
      i: 0,
    });
  // Family and friends walk with them to the edge of the valley.
  for (let o of w.creatures) {
    if (goers.includes(o) || o.farewell || o.leaving || o.asleep || !canBeInterrupted(o)) continue;
    let close = goers.some((g) => (o.rel[g.id] && o.rel[g.id].warmth > 0.45) || (g.parents || []).includes(o.id));
    if (!close) continue;
    let a = w.rng.range(0, 6.28);
    setPlan(w, o, {
      goal: "vigil",
      with: c.id,
      steps: [
        { do: "walk", x: edge.x + Math.cos(a) * 1.6, z: edge.z - 1.5 + Math.sin(a) * 0.8, near: 0.3, why: "sendoff" },
        { do: "vigil", id: c.id, dur: 40 },
      ],
      i: 0,
    });
  }
  logEvent(
    w,
    3,
    goers.length > 1
      ? `${c.name} and ${mate.name} have decided to follow the creek downstream, to see where it goes.`
      : `${c.name} has decided to follow the creek downstream, to see where it goes.`,
    goers.map((g) => g.id),
    c,
    "leaving",
  );
}

function downstreamEdge(w, c) {
  let T = w.terrain,
    side = T.side(c.x, c.z);
  for (let z = VL - 3; z > VL - 24; z -= 0.5) {
    let p = T.bankPoint(side, z, 1.2);
    if (T.walkable(p.x, p.z)) return { x: +p.x.toFixed(2), z: +p.z.toFixed(2) };
  }
  return { x: c.x, z: c.z };
}

function depart(w, c) {
  let near = w.creatures.filter((o) => o !== c && o.plan && o.plan.goal === "vigil" && (o.plan.with === c.id || (c.leaving && o.plan.with === c.leaving.with)));
  let rec = lineageRecord(w, c);
  rec.left = Math.round(w.t);
  rec.age = +ageDays(w, c).toFixed(1);
  rec.children = (c.children || []).slice();
  rec.partner = c.partner;
  rec.how = "downstream";
  w.downstream = w.downstream || [];
  w.downstream.push({ id: c.id, name: c.name, t: Math.round(w.t), with: c.leaving && c.leaving.with, snap: snapshotForVisits(w, c) });
  newStory(w, "leaving", { who: c.name }, c, 1, witnessesNear(w, c, 8, near)); // MINDS
  if (!(w.placeNames || []).some((p) => p.kind === "leaving")) namePlace(w, "the Leaving Bank", c, "leaving", 4, near[0] || null);
  if (w.downstream.length > 400) w.downstream.splice(0, w.downstream.length - 400);
  for (let o of w.creatures) {
    if (o === c) continue;
    let r = o.rel[c.id];
    if (!r || r.warmth < 0.3) continue;
    remember(w, o, "leaving", `${c.name} went downstream. I wonder what they will find.`, 0.75, { who: c.id, pv: 0.1 });
  }
  if (!c.leaving.logged) {
    let mate = c.leaving.with && w.byId[c.leaving.with];
    if (mate && mate.leaving) mate.leaving.logged = true;
    logEvent(
      w,
      3,
      `${mate ? c.name + " and " + mate.name : c.name} waved goodbye at the edge of the valley and went on downstream${near.length ? `. ${nameList(w, near.map((o) => o.id))} saw them off` : ""}.`,
      [c.id, ...(mate ? [mate.id] : []), ...near.map((o) => o.id)],
      c,
      "leaving",
    );
  }
  w.stats.departed = (w.stats.departed || 0) + 1;
  retire(w, c);
}

// ---------------------------------------------------------------------------
// Taking a creekfolk out of the simulation (passed on or gone downstream).
// ---------------------------------------------------------------------------
function retire(w, c) {
  checkLostSkills(w, c); // MINDS: was this the last one who knew how?
  // Hand on what they owned: to their partner, else a grown child, else an adult without a home.
  for (let s of w.structures) {
    if (s.owner !== c.id) continue;
    let heir = [c.partner, ...(c.children || [])].map((id) => w.byId[id]).find((h) => h && h !== c && !h.leaving && !h.farewell && !w.structures.some((x) => x.kind === s.kind && x.owner === h.id));
    if (!heir) heir = w.creatures.find((h) => h !== c && !h.leaving && !h.farewell && stageOf(w, h) !== "child" && !w.structures.some((x) => x.kind === s.kind && x.owner === h.id));
    if (heir && heir.visitor) heir = null;
    if (heir) {
      s.owner = heir.id;
      if (s.kind === "home") {
        heir.home = s.id;
        heir.sleepSpot = { x: s.x, z: s.z };
      }
    } else s.owner = null;
  }
  for (let o of w.creatures) {
    if (o === c) continue;
    if (o.partner === c.id) o.partner = null;
    if (o.attend && o.attend.id === c.id) o.attend = null;
    if (o.reply && o.reply.to === c.id) o.reply = null;
  }
  c.act = null;
  c.plan = null;
  c.tok++;
  let i = w.creatures.indexOf(c);
  if (i >= 0) w.creatures.splice(i, 1);
  delete w.byId[c.id];
}

// Homeless grown-ups move into an empty home if there is one.
function housing(w) {
  for (let s of w.structures) {
    if (s.kind !== "home" || s.owner || s.level < 1 || s.building) continue;
    let h = w.creatures.find((c) => stageOf(w, c) !== "child" && !c.visitor && !c.leaving && !c.farewell && (c.home == null || !w.byId[c.home]));
    if (!h) continue;
    s.owner = h.id;
    h.home = s.id;
    h.sleepSpot = { x: s.x, z: s.z };
    logEvent(w, 2, `${h.name} has moved into the empty home by the ${w.terrain.edgeDist(s.x, s.z) < 4 ? "creek" : "meadow"}.`, [h.id], s, "life");
  }
}

// ---------------------------------------------------------------------------
// New actions used above.
// ---------------------------------------------------------------------------
ACTIONS.farewell = {
  start(w, c) {
    return makeAct(w, c, "sit", 240, { lookX: c.x + Math.sin(c.face), lookZ: c.z + Math.cos(c.face), last: true });
  },
  end(w, c) {
    passOn(w, c);
    return false;
  },
};
ACTIONS.vigil = {
  start(w, c, step) {
    let o = w.byId[step.id];
    if (!o) return "skip";
    let p = positionAt(o, w.t);
    return makeAct(w, c, "sit", step.dur || 260, { lookX: p.x, lookZ: p.z, lookId: o.id });
  },
  end(w, c) {
    return true;
  },
};
ACTIONS.depart = {
  start(w, c) {
    return makeAct(w, c, "look", 6, { lookX: c.x, lookZ: c.z + 4, icon: "eye" });
  },
  end(w, c) {
    depart(w, c);
    return false;
  },
};

// ---------------------------------------------------------------------------
// Goals by stage: children play and learn rather than build; elders rest and teach.
// Called from decide() for every candidate goal.
// ---------------------------------------------------------------------------
var STAGE_GOALS = {
  child: { work: 0, found: 0, pod: 0.2, craft: 0, garden: 0.3, plant: 0.3, forage: 0.4, share: 0.3, deliver: 1, play: 1.5, social: 1.3, explore: 0.6, rest: 0.8 },
  adult: {},
  elder: { work: 0.55, found: 0.4, pod: 0.4, explore: 0.5, rest: 1.6, social: 1.35, play: 0.7, plant: 1.3, garden: 1.2 },
};
function lifeGoalFactor(w, c, goal) {
  let f = STAGE_GOALS[c.stage || "adult"][goal];
  return f === undefined ? 1 : f;
}

// Elders teach more readily; children learn more readily.
function teachFactor(teller, listener) {
  return (teller.stage === "elder" ? 2 : 1) * (listener.stage === "child" ? 1.6 : 1);
}

// Walking pace by stage.
function stageSpeed(c) {
  return c.stage === "child" ? 0.85 : c.stage === "elder" ? 0.8 : 1;
}

// How grown a memorial tree is: a sapling, a young tree, then a full tree after about six weeks.
function groveStage(w, tree) {
  let d = (w.t - (tree.planted || 0)) / DAY_S;
  return d < 6 ? 1 : d < 40 ? 2 : 3;
}

// A creekfolk on its last walk, or leaving, can be distracted (hunger, a friend asking
// for help). Put it back on its way; after two valley days of distraction, it goes anyway.
function keepOnTheirWay(w) {
  for (let c of w.creatures.slice()) {
    if (c.visitor) continue;
    let goal = c.farewell ? "farewell" : c.leaving ? "leave" : null;
    if (!goal || (c.plan && c.plan.goal === goal)) continue;
    let since = (c.farewell || c.leaving).t;
    if (w.t - since > VALLEY_DAY * 2) {
      if (c.farewell) passOn(w, c);
      else depart(w, c);
      continue;
    }
    if (c.asleep || !canBeInterrupted(c)) continue;
    let spot = c.farewell || c.leaving;
    setPlan(w, c, {
      goal,
      steps: [
        { do: "walk", x: spot.x, z: spot.z, near: 0.3, why: goal },
        { do: goal === "farewell" ? "farewell" : "depart" },
      ],
      i: 0,
    });
  }
}

// ---------------------------------------------------------------------------
// Travelers: the valley never empties. When there are too few grown-ups, or none
// who could pair (everyone left is family), a traveler comes up the creek from
// somewhere downstream and stays. They bring their own way of speaking.
// ---------------------------------------------------------------------------
function travelers(w) {
  let adults = w.creatures.filter((c) => stageOf(w, c) === "adult" && !c.leaving && !c.farewell && !c.visitor);
  let free = adults.filter((c) => !c.partner);
  let canPair = free.some((a) => free.some((b) => a !== b && !isRelated(a, b)));
  let paired = adults.some((c) => c.partner && w.byId[c.partner]);
  // Someone grown and unpaired, with nobody they could pair with (everyone left is family),
  // while the valley still has plenty of room.
  let stuck = free.length >= 1 && !canPair && w.creatures.length < valleyCapacity(w) * 0.6;
  let lonely = adults.length < LIFE.floorAdults || (!paired && !canPair) || stuck;
  if (!lonely) {
    w.lonelySince = null;
    return;
  }
  w.lonelySince = w.lonelySince ?? w.t;
  let wait = adults.length < 2 ? DAY_S * 0.25 : stuck && paired ? DAY_S * 1.5 : DAY_S;
  let spacing = adults.length < LIFE.floorAdults || !paired ? DAY_S * 1.5 : DAY_S * 4;
  if (w.t - w.lonelySince < wait || w.t - (w.lastTraveler || -1e9) < spacing) return;
  arriveTraveler(w);
  w.lastTraveler = w.t;
  w.lonelySince = null;
}

function arriveTraveler(w) {
  let T = w.terrain,
    side = w.rng.chance(0.5) ? 0 : 1,
    at = null;
  for (let z = VL - 4; z > VL - 24 && !at; z -= 0.5) {
    let p = T.bankPoint(side, z, 1.5);
    if (T.walkable(p.x, p.z)) at = p;
  }
  at = at || { x: w.meadow.x, z: w.meadow.z };
  let nm = newName(w, []);
  let c = register(w, makeFolk(w, nm.name, at.x, at.z));
  initLife(w, c, Math.round(w.t - w.rng.range(7.5, 10) * DAY_S), { gen: 0 });
  c.traveler = true;
  c.home = null;
  w.creatures.push(c);
  w.stats.travelers = (w.stats.travelers || 0) + 1;
  logEvent(w, 3, `A traveler came up the creek from somewhere downstream: ${c.name}. They looked around for a long while, and stayed.`, [c.id], at, "arrival");
  remember(w, c, "life", "I followed the creek upstream and found this valley. I think I will stay.", 0.9, { x: at.x, z: at.z, pv: 0.3 });
  newStory(w, "arrival", { who: c.name }, at, 2, witnessesNear(w, at, 14, [c])); // MINDS
  c.asleep = false;
  c.act = { type: "look", step: "look", t0: w.t, t1: w.t + 8, x: c.x, z: c.z, tok: c.tok, rc0: rainTotal(w, w.t), lookX: w.meadow.x, lookZ: w.meadow.z };
  schedule(w, w.t + 8, "A", c.id, c.tok);
  return c;
}

// ==== src/sim/minds.js ====
// ==========================================================================
// Minds of the village: stories, myths, named places, customs, lost skills,
// proposals and visitors from downstream.
//
// STORIES. Notable events become stories (world.stories). Each creekfolk holds
// its own version of the stories it knows (creature.lore), with how sure it is.
// Those who were there know the truth. Everyone else heard it from someone, and
// each retelling can shift a detail: numbers grow, deeds move to more famous
// names (or to a teller's own ancestors), places get named, causes get added
// ("the creek wanted it", "the one who sends gifts"). Elders who were there
// correct the young, until they give up. When most of the living believe a
// version that isn't what happened, a myth has formed, and the log says so.
//
// Everything here uses the world's seeded random numbers.
// ==========================================================================

var MINDS = {
  loreMax: 24,          // stories one creekfolk can hold
  tellChance: 0.45,     // chance a chat includes a story (elders: much more)
  driftBase: 0.045,     // chance a retelling changes a detail
  mythEvery: 6 * 3600,  // how often the valley's beliefs are compared with the truth
  visitEveryDays: 6,    // a departed creekfolk comes back to visit about this often
};

var SKILL_TEXT = {
  mud: "mud dries hard enough to build with",
  planting: "seeds grow into plants",
  clay: "to find and shape the sticky clay",
  glowcap: "to find the mushrooms that glow",
  tools: "to make and use tools",
  dams: "to dam the creek",
  downstream: "to build dams from the bottom of the creek up",
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------
function newStory(w, kind, truth, at, weight, witnesses = []) {
  w.stories = w.stories || {};
  w.storySeq = (w.storySeq || 0) + 1;
  let s = {
    id: w.storySeq,
    kind,
    t: Math.round(w.t),
    truth: { big: 0, why: null, ...truth },
    x: at ? +(+at.x).toFixed(1) : null,
    z: at ? +(+at.z).toFixed(1) : null,
    weight,
  };
  w.stories[s.id] = s;
  for (let c of witnesses) learnStory(w, c, s, { ...s.truth }, 1, null, true);
  return s;
}

// Everyone awake within sight (plus any listed) witnesses it.
function witnessesNear(w, at, radius = 12, extra = []) {
  let out = new Set(extra.filter(Boolean));
  if (at)
    for (let c of w.creatures) if (!c.asleep && dist2d(c.x, c.z, at.x, at.z) < radius) out.add(c);
  return [...out];
}

function learnStory(w, c, s, v, conf, from, first) {
  c.lore = c.lore || {};
  let had = c.lore[s.id];
  c.lore[s.id] = { v, conf: +conf.toFixed(3), first: !!first, from: from ? from.id : null, heard: Math.round(w.t), told: had ? had.told : 0 };
  let keys = Object.keys(c.lore);
  if (keys.length > MINDS.loreMax) {
    // Forget the story that matters least to them now.
    let worst = null,
      ws = 1e9;
    for (let k of keys) {
      let st = w.stories[k],
        l = c.lore[k],
        score = (st ? st.weight : 0) * 2 + l.told * 0.3 + (l.first ? 1.5 : 0) - (w.t - l.heard) / 86400 / 10;
      if (+k !== s.id && score < ws) (ws = score), (worst = k);
    }
    if (worst) delete c.lore[worst];
  }
}

// Two versions that read the same are the same story, as far as anyone can tell.
function sameTold(w, s, a, b) {
  return storyText(w, s, a) === storyText(w, s, b);
}

function sameVersion(a, b) {
  return a.who === b.who && a.n === b.n && a.where === b.where && a.why === b.why && (a.big || 0) === (b.big || 0);
}

// Render a version of a story as a sentence.
function storyText(w, s, v) {
  let where = v.where ? ` at ${v.where}` : "",
    big = v.big || 0,
    sent = ["founding", "storm", "gift", "frogs"].includes(s.kind),
    why = v.why === "giver" ? (sent ? `, sent by ${giverName(w)}` : `, with the blessing of ${giverName(w)}`) : v.why === "creek" ? ", because the creek wished it" : v.why === "elders" ? ", as the elders had said it would" : "";
  switch (s.kind) {
    case "founding":
      return `The first ${numberWord(v.n)} woke in the meadow beside the creek${why}${big ? ", on the brightest morning there ever was" : ""}.`;
    case "discovery":
      return `${v.who} was the first to learn ${SKILL_TEXT[v.what] || v.what}${where}${why}${big >= 2 ? ", all in a single afternoon" : ""}.`;
    case "built":
      return `${v.who} built the first ${v.what}${where}${why}${big ? (big >= 2 ? ", with their own two paws and no help at all" : ", and it took no time at all") : ""}.`;
    case "passing":
      return `${v.who} passed on${where}${v.n ? ` after ${daysWord(v.n)}` : ""}${why}${big ? (big >= 2 ? "; they say the whole valley went quiet" : ", the oldest anyone could remember") : ""}.`;
    case "storm":
      return `${big >= 2 ? "The great storm" : big ? "A terrible storm" : "A storm"} came over the valley${v.n > 1 ? ` and the rain fell for ${numberWord(v.n)} nights` : ""}${why}.`;
    case "arrival":
      return `${v.who} came up the creek from somewhere downstream${why}${big ? ", carrying nothing at all" : ""}, and stayed.`;
    case "leaving":
      return `${v.who} went downstream to see where the creek goes${big ? (big >= 2 ? ", and found a lake as wide as the sky" : ", and never looked back") : ""}${why}.`;
    case "news":
      return `${v.who} came back from downstream and told us ${v.what}${big ? (big >= 2 ? ", and many more wonders besides" : ", bigger than anything here") : ""}.`;
    case "gift":
      return `${giftText(v.what)} came${v.needed ? " when the valley needed it" : ""}${where}${why}${big ? (big >= 2 ? ", and everyone who saw it was changed" : ", glowing") : ""}.`;
    case "frogs":
      return `The frogs came back to the marsh${where}${why}${big ? ", singing all at once on the same night" : ""}.`;
    case "lost":
      return `Once, long ago, the creekfolk knew ${SKILL_TEXT[v.what] || v.what}${v.who ? `; ${v.who} was the last who did` : ""}.`;
  }
  return "Something happened, long ago.";
}

function numberWord(n) {
  return ["no one", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"][n] || (n > 40 ? "a great many" : String(n));
}
function daysWord(n) {
  return n >= 90 ? "a hundred days" : `${numberWord(Math.round(n))} days`;
}

// How well known a name is: how many living creekfolk hold stories about them.
function fameOf(w, name) {
  let f = 0;
  for (let c of w.creatures) for (let k in c.lore || {}) if (c.lore[k].v.who === name) f++;
  return f;
}

// A teller may change one detail. Returns a new version (or the same one).
function retell(w, teller, listener, s, v) {
  let rng = w.rng,
    l = teller.lore[s.id],
    age = (w.t - s.t) / 86400,
    p = MINDS.driftBase * (l.first ? 0.5 : 1) * (1 + Math.min(1.5, age / 20)) * (listener.stage === "child" ? 1.4 : 1) * (teller.stage === "elder" ? 0.8 : 1) * (0.7 + 0.6 * teller.temp.curiosity);
  if (!rng.chance(p)) return v;
  let nv = { ...v },
    ops = [];
  if (nv.n != null) ops.push("n");
  if (nv.who != null && s.kind !== "founding") ops.push("who", "who");
  if (["founding", "storm", "gift", "frogs", "discovery", "built"].includes(s.kind)) ops.push("why");
  ops.push("big", "big");
  if (s.x != null) ops.push("where");
  let op = rng.pick(ops);
  if (op === "n") {
    if (s.kind === "founding") nv.n = rng.pick([3, 7, 12, 1]);
    else if (s.kind === "passing") nv.n = nv.n + rng.int(2, 6); // an old one grows older in the telling
    else nv.n = Math.max(nv.n + 1, Math.round(nv.n * rng.range(1.3, 2)));
  } else if (op === "who") {
    // Deeds drift to famous names, or to the teller's own family.
    let anc = ancestors(w, teller).filter((r) => r.name !== nv.who),
      famous = null,
      best = 2,
      fame = {};
    for (let c of w.creatures) for (let k in c.lore || {}) { let n = c.lore[k].v.who; if (n) fame[n] = (fame[n] || 0) + 1; }
    for (let n in fame) if (n !== nv.who && n !== "one of the first five" && fame[n] > best) (best = fame[n]), (famous = n);
    if (anc.length && rng.chance(0.5)) nv.who = rng.pick(anc).name;
    else if (famous) nv.who = famous;
    else if (s.t < 3 * 86400 && rng.chance(0.5)) nv.who = "one of the first five";
    else return v;
  } else if (op === "why") {
    let g = (teller.beliefs && teller.beliefs.giver) || 0;
    nv.why = g > 0.45 ? "giver" : teller.stage === "elder" && rng.chance(0.3) ? "elders" : "creek";
  } else if (op === "big") {
    nv.big = Math.min(3, (nv.big || 0) + 1);
  } else if (op === "where") {
    let pl = placeNear(w, s.x, s.z, 10) || (w.placeNames && w.placeNames.length ? rng.pick(w.placeNames) : null);
    if (!pl || pl.name === nv.where) return v;
    nv.where = pl.name;
  }
  return nv;
}

function ancestors(w, c) {
  let out = [],
    seen = new Set(),
    q = (c.parents || []).slice();
  while (q.length && out.length < 8) {
    let id = q.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    let r = (w.lineage || {})[id];
    if (!r) continue;
    out.push(r);
    for (let p of r.parents || []) q.push(p);
  }
  return out;
}

// Called after every chat: the teller may tell the listener a story.
function tellStory(w, teller, listener) {
  if (!teller.lore) return;
  let rng = w.rng,
    eager = (teller.stage === "elder" ? 2.2 : 1) * (listener.stage === "child" ? 1.5 : 1) * (0.6 + 0.6 * teller.temp.sociability);
  if (!rng.chance(Math.min(0.95, MINDS.tellChance * eager))) return;
  let keys = Object.keys(teller.lore).filter((k) => w.stories[k]);
  if (!keys.length) return;
  let k = +rng.weighted(keys, (k) => {
    let s = w.stories[k],
      known = listener.lore && listener.lore[k];
    return s.weight * (known ? (sameVersion(known.v, teller.lore[k].v) ? 0.15 : 0.8) : 1.6) * (1 + teller.lore[k].told * 0.1);
  });
  let s = w.stories[k],
    mine = teller.lore[k];
  mine.told++;
  let v = retell(w, teller, listener, s, mine.v);
  let theirs = listener.lore && listener.lore[k];
  if (!theirs) {
    learnStory(w, listener, s, v, Math.max(0.2, mine.conf * 0.88), teller, false);
    return;
  }
  if (sameVersion(theirs.v, v)) {
    theirs.conf = +Math.min(1, theirs.conf + 0.05).toFixed(3);
    return;
  }
  // They know it differently. Those who were there, or are sure, push back.
  let rel = relation(listener, teller),
    trust = honestyRate(rel) * (0.5 + clamp(rel.warmth, 0, 1)),
    tellerWeight = mine.conf * (teller.stage === "elder" ? 1.4 : 1) * trust,
    mineWeight = theirs.conf * (theirs.first ? 1.6 : 1) * (listener.stage === "elder" ? 1.3 : 1);
  if (theirs.first && listener.stage !== "child" && mineWeight > tellerWeight) {
    correct(w, listener, teller, s, theirs, mine);
  } else if (rng.chance(clamp(tellerWeight / (tellerWeight + mineWeight), 0.05, 0.95))) {
    listener.lore[k] = { ...theirs, v, conf: +Math.max(0.2, mine.conf * 0.85).toFixed(3), from: teller.id, first: false, heard: Math.round(w.t) };
  }
}

// Someone who was there corrects a retelling. The young often aren't convinced.
function correct(w, elder, teller, s, theirs, mine) {
  let rng = w.rng;
  elder.corrections = elder.corrections || {};
  let n = (elder.corrections[s.id] = (elder.corrections[s.id] || 0) + 1);
  if (n === 6) {
    logEvent(w, 2, `${elder.name} has given up correcting the young ones about ${shortAbout(w, s)}. "Let them tell it their way," they said.`, [elder.id], elder, "story");
    remember(w, elder, "story", `Nobody tells it the way it really happened anymore. Maybe that's all right.`, 0.6);
    return;
  }
  if (n > 6) return;
  let convinced = rng.chance(teller.stage === "child" ? 0.3 : 0.55);
  if (convinced) {
    teller.lore[s.id] = { ...mine, v: { ...theirs.v }, conf: +Math.max(mine.conf, 0.7).toFixed(3), from: elder.id };
  } else mine.conf = +Math.max(0.2, mine.conf - 0.1).toFixed(3);
  if (n === 1 || rng.chance(0.25))
    logEvent(
      w,
      1,
      `${teller.name} was telling how ${lower(storyText(w, s, mine.v)).replace(/\.$/, "")}. ${elder.name}, who was there, said it wasn't like that${convinced ? ", and " + teller.name + " listened." : `. ${teller.name} didn't seem convinced.`}`,
      [elder.id, teller.id],
      elder,
      "story",
    );
}

function shortAbout(w, s) {
  let v = s.truth;
  return {
    founding: "how the valley began",
    discovery: `who first learned ${SKILL_TEXT[v.what] || v.what}`,
    built: `who built the first ${v.what}`,
    passing: `${v.who}'s passing`,
    storm: "the storm",
    arrival: `how ${v.who} came`,
    leaving: `${v.who} going downstream`,
    news: "the news from downstream",
    gift: "the gift",
    frogs: "the frogs coming back",
    lost: "what was forgotten",
  }[s.kind] || "the old days";
}

// Every few hours: has a myth formed? Has a story been forgotten?
function checkMyths(w) {
  w.myths = w.myths || {};
  let holders = {};
  for (let c of w.creatures) {
    if (c.visitor) continue;
    for (let k in c.lore || {}) (holders[k] = holders[k] || []).push(c.lore[k]);
  }
  for (let k in w.stories) {
    let s = w.stories[k],
      hs = holders[k];
    if (!hs || !hs.length) {
      if (s.weight >= 2 && !s.forgotten && w.t - s.t > 86400) {
        s.forgotten = Math.round(w.t);
        logEvent(w, 2, `No one in the valley remembers anymore that ${lower(storyText(w, s, s.truth))}`, [], s.x != null ? s : null, "forgotten");
      }
      if (w.t - s.t > 86400 * 3) delete w.stories[k];
      continue;
    }
    if (hs.length < 3) continue;
    // The most common version among the living.
    let counts = new Map();
    for (let h of hs) {
      let key = JSON.stringify([h.v.who, h.v.n, h.v.where, h.v.why, h.v.big || 0]);
      let e = counts.get(key) || { n: 0, v: h.v, first: 0 };
      e.n++;
      if (h.first) e.first++;
      counts.set(key, e);
    }
    let top = [...counts.values()].sort((a, b) => b.n - a.n)[0];
    if (top.n < hs.length * 0.5) continue;
    let key = JSON.stringify([top.v.who, top.v.n, top.v.where, top.v.why, top.v.big || 0]);
    if (sameTold(w, s, top.v, s.truth) || w.myths[k] === key) continue;
    if (!(k in w.myths)) w.stats.mythStories = (w.stats.mythStories || 0) + 1;
    w.myths[k] = key;
    w.stats.myths = (w.stats.myths || 0) + 1;
    // Every myth shows in the village's stories; the important ones, at most one a day, in the history.
    if (s.weight < 2 || s.mythLogged || w.t - (w.lastMythLog || -1e9) < 3 * 86400) continue;
    s.mythLogged = true;
    w.lastMythLog = w.t;
    logEvent(w, 3, `Most of the valley now believes that ${lower(storyText(w, s, top.v))} It wasn't quite like that: ${lower(storyText(w, s, s.truth))}`, [], s.x != null ? s : null, "myth");
  }
}

// Lower-case a sentence's first word, unless it's a name.
function lower(t) {
  return /^(The|A|An|Once|Something|Seeds|No)\b/.test(t) ? t[0].toLowerCase() + t.slice(1) : t;
}

// ---------------------------------------------------------------------------
// Named places
// ---------------------------------------------------------------------------
function placeNear(w, x, z, r = 4) {
  if (x == null) return null;
  let best = null,
    bd = r;
  for (let p of w.placeNames || []) {
    let d = dist2d(p.x, p.z, x, z);
    if (d < Math.max(bd, p.r)) (bd = d), (best = p);
  }
  return best;
}

function namePlace(w, name, at, kind, r = 3, by = null, silent = false) {
  w.placeNames = w.placeNames || [];
  let near = placeNear(w, at.x, at.z, r);
  if (near) return near;
  let p = { id: (w.placeSeq = (w.placeSeq || 0) + 1), name, x: +at.x.toFixed(1), z: +at.z.toFixed(1), r, kind, t: Math.round(w.t) };
  w.placeNames.push(p);
  // The namer coins a word for it in their own speech; it spreads like any other word.
  if (by) wordFor(w, by, "place:" + p.id);
  if (!silent) logEvent(w, 2, `The creekfolk have started calling ${kind === "rest" ? "the place where " + name.replace(/'s Rest$/, "") + " passed" : "it"} ${name}.`, by ? [by.id] : [], at, "place");
  return p;
}

// What a concept means, for the words list (places have ids).
function conceptLabel(w, concept) {
  if (concept.startsWith("place:")) {
    let p = (w.placeNames || []).find((p) => "place:" + p.id === concept);
    return p ? p.name : "a place";
  }
  return CONCEPT_LABELS[concept] || concept;
}

// ---------------------------------------------------------------------------
// Hooks called from the core and from life.js
// ---------------------------------------------------------------------------
function storyFounding(w) {
  newStory(w, "founding", { n: w.creatures.length }, w.meadow, 3, w.creatures);
  namePlace(w, "the Waking Meadow", w.meadow, "meadow", 5, null, true);
}

function storyDiscovery(w, c, skill) {
  if (w.lost && w.lost[skill]) {
    let days = Math.round((w.t - w.lost[skill]) / 86400);
    delete w.lost[skill];
    logEvent(w, 3, `${c.name} has learned again how ${SKILL_TEXT[skill] || skill}, ${days} days after the valley forgot.`, [c.id], c, "discovery");
    newStory(w, "discovery", { who: c.name, what: skill }, c, 2, witnessesNear(w, c, 10, [c]));
    return;
  }
  if ((w.stats["know_" + skill] || 0) !== 1) return;
  newStory(w, "discovery", { who: c.name, what: skill }, c, 2, witnessesNear(w, c, 10, [c]));
}

function storyBuilt(w, s, label, builders) {
  w.firstBuilt = w.firstBuilt || {};
  let key = s.kind + ":" + s.level;
  if (s.owner || w.firstBuilt[key]) return;
  w.firstBuilt[key] = Math.round(w.t);
  let lead = builders[0] && w.byId[builders[0]];
  if (!lead) return;
  newStory(w, "built", { who: lead.name, what: label }, s, s.level === 1 ? 2 : 1, witnessesNear(w, s, 12, builders.map((id) => w.byId[id])));
  if (s.kind === "dam" && s.level === 1 && !(w.placeNames || []).some((p) => p.kind === "pool")) namePlace(w, `${lead.name}'s Pool`, s, "pool", 4, lead);
  if (s.kind === "crossing" && s.level === 1) namePlace(w, s.level >= 2 ? "the Footbridge" : "the Stepping Stones", s, "crossing", 3, lead);
  if (s.kind === "meeting" && s.level === 1) namePlace(w, "the Meeting Stone", s, "meeting", 3, lead);
}

function storyPassing(w, c, near) {
  let notable = c.founder || c.traveler || (c.children || []).length >= 4 || !(w.stats.passings > 0);
  let at = c.farewell || c;
  let place = placeNear(w, at.x, at.z, 3);
  if (!place && notable) place = namePlace(w, `${c.name}'s Rest`, at, "rest", 2.5, near[0] || null);
  newStory(w, "passing", { who: c.name, n: Math.round(ageDays(w, c)), where: place ? place.name : null }, at, c.founder || c.traveler || !(w.stats.passings > 0) ? 2 : 1, witnessesNear(w, at, 8, near));
}

function storyStorm(w) {
  if (w.lastStormStory && w.t - w.lastStormStory < 3 * 86400) return;
  w.lastStormStory = w.t;
  newStory(w, "storm", { n: 1 }, null, 1, w.creatures.filter((c) => !c.visitor));
}

function storyFrogs(w, at) {
  newStory(w, "frogs", {}, at, 1, witnessesNear(w, at, 14));
}

// When the last creekfolk who knew a skill is gone.
function checkLostSkills(w, gone) {
  w.lost = w.lost || {};
  for (let k in SKILL_TEXT) {
    if (!gone.know || !gone.know[k] || w.lost[k]) continue;
    if (w.creatures.some((c) => c !== gone && c.know[k])) continue;
    w.lost[k] = Math.round(w.t);
    w.stats.skillsLost = (w.stats.skillsLost || 0) + 1;
    logEvent(w, 3, `No one left in the valley knows how ${SKILL_TEXT[k]}. ${gone.name} was the last.`, [], gone, "lost");
    newStory(w, "lost", { what: k, who: gone.name }, null, 2, w.creatures.filter((c) => c !== gone && !c.visitor && c.rel[gone.id]));
  }
}

// ---------------------------------------------------------------------------
// Customs: offerings at a passing, gatherings when the season turns
// ---------------------------------------------------------------------------
var OFFERINGS = {
  sound: ["hummed a low song", "hum a low song"],
  collecting: ["left a pretty pebble", "leave a pretty pebble"],
  growing: ["laid a flower", "lay a flower"],
  water: ["brought water from the creek", "bring water from the creek"],
  building: ["set a small stone", "set a small stone"],
  social: ["held paws in a circle", "hold paws in a circle"],
  exploring: ["told of far-off places", "tell of far-off places"],
};

function passingOfferings(w, c, near) {
  w.customs = w.customs || {};
  let cu = (w.customs.passing = w.customs.passing || { counts: {}, custom: null, since: null });
  let done = [];
  for (let o of near) {
    let pick = cu.custom && w.rng.chance(0.75) ? cu.custom : o.sig;
    cu.counts[pick] = (cu.counts[pick] || 0) + 1;
    done.push(pick);
  }
  let total = Object.values(cu.counts).reduce((a, b) => a + b, 0);
  if (!cu.custom) {
    for (let k in cu.counts)
      if (cu.counts[k] >= 4 && cu.counts[k] >= total * 0.4) {
        cu.custom = k;
        cu.since = Math.round(w.t);
        logEvent(w, 3, `It has become the custom, when someone passes, to ${OFFERINGS[k][1]} for them.`, [], c.farewell || c, "custom");
        break;
      }
  }
  if (!done.length) return "";
  let k = cu.custom && done.filter((d) => d === cu.custom).length >= done.length / 2 ? cu.custom : done[0];
  return ` They ${OFFERINGS[k][0]} for them.`;
}

function seasonGathering(w, season) {
  let meet = findStructure(w, "meeting", (s) => s.level > 0),
    at = meet ? { x: meet.x, z: meet.z } : w.meadow;
  let goers = w.creatures.filter((c) => !c.asleep && !c.farewell && !c.leaving && canBeInterrupted(c) && dist2d(c.x, c.z, at.x, at.z) < 30);
  if (goers.length < 3) return false;
  w.customs = w.customs || {};
  let g = (w.customs.seasons = w.customs.seasons || { n: 0 });
  g.n++;
  for (let c of goers) {
    let a = w.rng.range(0, 6.28),
      d = w.rng.range(1.2, 2.8);
    setPlan(w, c, { goal: "gather", steps: [{ do: "walk", x: at.x + Math.cos(a) * d, z: at.z + Math.sin(a) * d, near: 0.3, why: "gather" }, { do: "gather", x: at.x, z: at.z }], i: 0 });
  }
  let word = favoriteWord(goers[0], season) || null;
  let place = placeNear(w, at.x, at.z, 5);
  logEvent(
    w,
    3,
    g.n === 1
      ? `The creekfolk gathered at ${place ? place.name : "the meeting place"} to mark the coming of ${season}.`
      : g.n === 2
        ? `For the second time, the creekfolk gathered at ${place ? place.name : "the meeting place"} as the season turned. It is becoming a custom.`
        : `The creekfolk gathered at ${place ? place.name : "the meeting place"} for the turning of the season, as they always do${word ? `; they call it "${word}"` : ""}.`,
    goers.map((c) => c.id),
    at,
    "custom",
  );
  for (let c of goers) wordFor(w, c, season);
  return true;
}

// ---------------------------------------------------------------------------
// Proposals: when someone marks out a shared project, the others react.
// ---------------------------------------------------------------------------
function proposalReaction(w, by, kind, observer, out) {
  let r = relation(observer, by),
    agree = (observer.desire[kind] || 0) + 0.4 * clamp(r.warmth, -1, 1) - 0.3 * r.annoy + w.rng.range(-0.15, 0.15);
  if (agree > 0.25) {
    observer.desire[kind] = (observer.desire[kind] || 0) + 0.15;
    warmTo(observer, by, 0.02);
    out.yes.push(observer.id);
  } else if (agree < -0.05) {
    r.annoy = Math.min(1, r.annoy + 0.04);
    out.no.push(observer.id);
  }
}

function proposalLog(w, by, label, kind, at, out) {
  if (STRUCTURES[kind].personal || (!out.yes.length && !out.no.length)) return;
  let yes = out.yes.length ? `${nameList(w, out.yes)} liked the idea` : "",
    no = out.no.length ? `${nameList(w, out.no)} ${out.no.length > 1 ? "weren't" : "wasn't"} sure` : "";
  logEvent(w, 2, `${by.name} proposed ${withArticle(label)}. ${[yes, no].filter(Boolean).join("; ")}.`, [by.id, ...out.yes, ...out.no], at, "proposal");
}

// ---------------------------------------------------------------------------
// Visitors: someone who went downstream comes back for a little while, with news.
// ---------------------------------------------------------------------------
var DOWNSTREAM_NEWS = [
  "the creek joins a river so wide you can't see the other side",
  "there is a still lake where the creek ends, full of sky",
  "other creekfolk live downstream, and they build their homes on stilts",
  "a fallen tree far below made a pool bigger than ours",
  "the hills open out into a meadow that goes on forever",
  "there are fish downstream as long as your arm",
  "far below, the creek runs under the ground and comes out singing",
  "the folk downstream have a different word for everything",
  "there are reeds downstream taller than our roofs",
  "at night, downstream, the whole marsh glows",
];

function snapshotForVisits(w, c) {
  let rels = Object.entries(c.rel)
    .sort((a, b) => b[1].warmth - a[1].warmth)
    .slice(0, 8);
  return {
    look: c.look,
    temp: c.temp,
    interests: c.interests,
    accent: c.accent,
    lex: Object.fromEntries(Object.entries(c.lex).slice(0, 30)),
    sig: c.sig,
    born: c.born,
    lifespan: c.lifespan,
    gen: c.gen,
    parents: c.parents,
    children: c.children,
    rel: Object.fromEntries(rels),
    strength: c.adultStrength,
  };
}

function visits(w, force = false) {
  if (w.creatures.some((c) => c.visitor)) return false;
  let cands = (w.downstream || []).filter((d) => d.snap && (force || (w.t - d.t > 2 * 86400 && w.t - (d.visited || 0) > 12 * 86400)) && d.snap.born + d.snap.lifespan - w.t > 2 * 86400);
  if (!cands.length || (!force && !w.rng.chance(LIFE.tick / (MINDS.visitEveryDays * 86400)))) return false;
  let d = w.rng.pick(cands);
  d.visited = Math.round(w.t);
  let edge = downstreamEdge(w, { x: w.terrain.creekX(VL - 6) + 2, z: VL - 6 });
  let c = makeFolk(w, d.name, edge.x, edge.z);
  let sn = d.snap;
  Object.assign(c, { id: d.id, look: sn.look, temp: sn.temp, interests: sn.interests, accent: sn.accent, lex: sn.lex, sig: sn.sig, rel: sn.rel, strength: sn.strength, adultStrength: sn.strength });
  Object.assign(c, { born: sn.born, lifespan: sn.lifespan, gen: sn.gen, parents: sn.parents || [], children: sn.children || [], partner: null });
  c.stage = stageOf(w, c);
  c.visitor = { until: Math.round(w.t + VALLEY_DAY * 2), x: edge.x, z: edge.z };
  register(w, c);
  w.creatures.push(c);
  w.stats.visits = (w.stats.visits || 0) + 1;
  let news = w.rng.pick(DOWNSTREAM_NEWS);
  logEvent(w, 3, `${c.name} came back up the creek to visit! They say ${news}.`, [c.id], edge, "visit");
  newStory(w, "news", { who: c.name, what: news }, edge, 2, [c]);
  for (let o of w.creatures) {
    let r = o.rel[c.id];
    if (o !== c && r && r.warmth > 0.3) remember(w, o, "visit", `${c.name} came back to visit. They say ${news}.`, 0.8, { who: c.id });
  }
  c.asleep = false;
  c.act = { type: "look", step: "look", t0: w.t, t1: w.t + 6, x: c.x, z: c.z, tok: c.tok, rc0: rainTotal(w, w.t), lookX: w.meadow.x, lookZ: w.meadow.z };
  schedule(w, w.t + 6, "A", c.id, c.tok);
}

function endVisits(w) {
  for (let c of w.creatures.slice()) {
    if (!c.visitor) continue;
    if (w.t > c.visitor.until + VALLEY_DAY * 2) {
      leaveAgain(w, c);
      continue;
    }
    if (w.t > c.visitor.until && (!c.plan || c.plan.goal !== "goback") && !c.asleep && canBeInterrupted(c))
      setPlan(w, c, { goal: "goback", steps: [{ do: "walk", x: c.visitor.x, z: c.visitor.z, near: 0.4, why: "leave" }, { do: "goback" }], i: 0 });
  }
}

function leaveAgain(w, c) {
  logEvent(w, 2, `${c.name} went back downstream, home to wherever that is now.`, [c.id], c, "visit");
  for (let s of w.structures) if (s.owner === c.id) s.owner = null;
  for (let o of w.creatures) {
    if (o.partner === c.id) o.partner = null;
    if (o.attend && o.attend.id === c.id) o.attend = null;
  }
  c.act = null;
  c.plan = null;
  c.tok++;
  let i = w.creatures.indexOf(c);
  if (i >= 0) w.creatures.splice(i, 1);
  delete w.byId[c.id];
}

ACTIONS.gather = {
  start(w, c, step) {
    return makeAct(w, c, "sit", 150, { lookX: step.x, lookZ: step.z });
  },
  end(w, c) {
    c.needs.social = clamp(c.needs.social + 0.2, 0, 1);
    feel(c, w, "warmth", 0.3);
    return true;
  },
};

ACTIONS.goback = {
  start(w, c) {
    return makeAct(w, c, "look", 5, { lookX: w.meadow.x, lookZ: w.meadow.z });
  },
  end(w, c) {
    leaveAgain(w, c);
    return false;
  },
};

// Runs inside the life tick.
function mindsTick(w) {
  // Gather for the turning of the season once it's daytime (within a real day).
  let g = w.gatherPending;
  if (g && (w.t - g.t > 86400 || (!isNight(w.t) && seasonGathering(w, g.season)))) w.gatherPending = null;
  endVisits(w);
  visits(w);
  if (!w.lastMyth || w.t - w.lastMyth >= MINDS.mythEvery) {
    w.lastMyth = w.t;
    checkMyths(w);
  }
}

// ==== src/sim/gift.js ====
// ==========================================================================
// The player's gift, and what the creekfolk come to believe about it.
//
// Once every 12 real hours the player may give the valley one gift: a gentle
// rain, a scatter of seeds, a warm day, or a found object. Gifts help things
// grow; they never decide whether anyone survives.
//
// The creekfolk notice. Each one explains a gift its own way (luck, the creek,
// or someone watching), and repeated gifts that arrive when they're needed make
// "someone" more likely. Believers coin a word for the giver (it spreads like
// any other word), thank it with a gesture that can become a village custom,
// notice when gifts come regularly, argue with doubters, and wonder what they
// did wrong when the gifts stop.
// ==========================================================================

var GIFT = {
  every: 12 * 3600, // seconds between gifts
  stopDays: 3,      // after this long without a gift (once there have been a few), it feels like they stopped
};

var FOUND_THINGS = [
  "a smooth blue stone",
  "a long white feather",
  "a tiny bell",
  "a carved wooden bead",
  "a spiral shell",
  "a piece of green glass",
  "a ring of braided grass",
  "a little copper key",
];

function giftText(what) {
  let t = { rain: "a gentle rain", seeds: "a scatter of seeds", warm: "a warm day" }[what] || what;
  return t[0].toUpperCase() + t.slice(1);
}

function giverName(w) {
  let believers = w.creatures.filter((c) => c.beliefs && c.beliefs.giver > 0.5).length;
  let v = vocabularySummary(w).find((e) => e.concept === "giver");
  return v && believers >= 2 && v.users >= Math.ceil(believers / 2) ? `"${v.word}"` : "the one who sends gifts";
}

function giftReady(w) {
  return w.t - (w.giftLast ?? -1e9) >= GIFT.every;
}

function giftWaitSeconds(w) {
  return Math.max(0, (w.giftLast ?? -1e9) + GIFT.every - w.t);
}

function beliefsOf(c) {
  return (c.beliefs = c.beliefs || { giver: 0, seen: 0, lastSeen: null, pattern: false, thanks: null });
}

// How much the valley needed this gift right now (0..1).
function giftNeed(w, kind) {
  let alive = w.creatures.filter((c) => !c.visitor);
  if (kind === "rain") {
    let dryFor = w.weather.rain > 0 ? 0 : w.t - (w.weather.since || 0);
    let thirsty = w.structures.some((s) => s.kind === "garden" && s.beds && s.beds.some((b) => b.state === "growing" && b.water < 0.35));
    return clamp(dryFor / (3 * VALLEY_DAY), 0, 1) * 0.6 + (thirsty ? 0.4 : 0);
  }
  if (kind === "seeds") {
    let food = alive.reduce((a, c) => a + c.needs.food, 0) / Math.max(1, alive.length);
    return clamp((0.6 - food) * 2.5, 0, 1);
  }
  if (kind === "warm") {
    let s = seasonAt(w),
      wet = alive.filter((c) => c.wet > 0.4).length / Math.max(1, alive.length);
    return clamp((1 - s.warmth) * 0.7 + wet * 0.6 + (w.weather.rain > 0 ? 0.2 : 0), 0, 1);
  }
  return 0.5;
}

// The gift arrives. Returns a short description for the player.
function giveGift(w, kind) {
  if (!giftReady(w)) return null;
  let need = giftNeed(w, kind),
    T = w.terrain,
    spot = null,
    alive = w.creatures.filter((c) => !c.visitor),
    what = kind;
  w.giftLast = w.t;
  w.gifts = w.gifts || [];
  if (kind === "rain") {
    let e = w.weather;
    e.cum = rainTotal(w, w.t);
    e.cumT = w.t;
    e.state = "rain";
    e.rain = 1;
    e.since = w.t;
    e.until = w.t + 0.4 * VALLEY_DAY;
    e.tok = (e.tok || 0) + 1;
    schedule(w, e.until, "R", 0, e.tok);
    logEvent(w, 2, "A gentle rain began to fall out of a clear sky.", [], null, "gift");
  } else if (kind === "seeds") {
    let g = findStructure(w, "garden", (s) => s.level > 0);
    let c = g ? { x: g.x, z: g.z } : w.meadow;
    spot = T.randomPoint(w.rng, { near: { x: c.x, z: c.z, r: 4 }, minEdge: 1 }) || { x: w.meadow.x, z: w.meadow.z };
    dropItem(w, "seeds", spot.x, spot.z, 10);
    for (let r of w.res) if (r.kind === "bush" && r.amt < r.max) r.amt = Math.min(r.max, r.amt + 2);
    logEvent(w, 2, "Seeds were found scattered in the grass, where there had been none.", [], spot, "gift");
  } else if (kind === "warm") {
    let e = w.weather;
    if (e.rain > 0) {
      e.cum = rainTotal(w, w.t);
      e.cumT = w.t;
      e.state = "clear";
      e.rain = 0;
      e.since = w.t;
      e.until = w.t + VALLEY_DAY;
      e.tok = (e.tok || 0) + 1;
      schedule(w, e.until, "R", 0, e.tok);
    }
    for (let c of w.creatures) (c.wet = 0), (c.needs.comfort = clamp(c.needs.comfort + 0.3, 0, 1)), (c.needs.fun = clamp(c.needs.fun + 0.1, 0, 1));
    for (let s of w.structures) if (s.kind === "garden" && s.beds) for (let b of s.beds) if (b.state === "growing") b.grow = Math.min(1, b.grow + 0.25);
    for (let r of w.res) if (r.kind === "orchard" && r.stage < 3) r.grow = Math.min(0.99, (r.grow || 0) + 0.15);
    logEvent(w, 2, `A warm, golden day settled over the valley${seasonAt(w).warmth < 0.4 ? ", though it was the cold time of year" : ""}.`, [], null, "gift");
  } else if (kind === "found") {
    what = w.rng.pick(FOUND_THINGS);
    spot = T.randomPoint(w.rng, { near: { x: w.meadow.x, z: w.meadow.z, r: 14 }, minEdge: 1.5 }) || { x: w.meadow.x, z: w.meadow.z };
    let it = dropItem(w, "gift", spot.x, spot.z, 1);
    it.thing = what;
    logEvent(w, 2, `Something glinted in the grass that hadn't been there before.`, [], spot, "gift");
  } else return null;

  w.gifts.push({ t: Math.round(w.t), kind, what, need: +need.toFixed(2) });
  if (w.gifts.length > 200) w.gifts.splice(0, w.gifts.length - 200);
  w.stats.gifts = (w.stats.gifts || 0) + 1;
  if (w.giftsStopped) {
    w.giftsStopped = null;
    logEvent(w, 3, "The gifts have come back! Even the doubters looked up.", [], null, "gift");
    for (let c of alive) if (beliefsOf(c).giver > 0.3) feel(c, w, "joy", 0.6), remember(w, c, "gift", "The gifts came back. We weren't forgotten after all.", 0.8);
  }

  // Who noticed, and what they made of it.
  let observers = kind === "rain" || kind === "warm" ? alive.filter((c) => !c.asleep) : witnessesNear(w, spot, 16).filter((c) => !c.visitor);
  for (let c of observers) noticeGift(w, c, kind, what, need);
  if (w.gifts.length === 1 || need > 0.55 || kind === "found")
    newStory(w, "gift", { what, needed: need > 0.5, where: spot && placeNear(w, spot.x, spot.z, 4) ? placeNear(w, spot.x, spot.z, 4).name : null }, spot, w.gifts.length === 1 ? 2 : 1, observers);
  noticePattern(w);
  thanksCustom(w);
  return { kind, what, need };
}

function noticeGift(w, c, kind, what, need) {
  let b = beliefsOf(c),
    t = c.temp,
    before = b.giver,
    // The curious look for reasons; the cautious and incurious shrug.
    openness = 0.5 + t.curiosity * 0.8 - t.caution * 0.35 + (c.stage === "child" ? 0.3 : 0),
    gain = (0.05 + 0.13 * need) * clamp(openness, 0.15, 1.5) * (1 + 0.15 * Math.min(4, b.seen));
  b.giver = +clamp(b.giver + gain * (1 - b.giver), 0, 1).toFixed(3);
  b.seen++;
  b.lastSeen = Math.round(w.t);
  let label = kind === "found" ? what : giftText(kind).toLowerCase();
  if (before < 0.5 && b.giver >= 0.5) {
    wordFor(w, c, "giver");
    remember(w, c, "belief", `${label[0].toUpperCase() + label.slice(1)}, just when we needed it. I think someone is watching over the valley.`, 0.85);
    emote(c, w, "idea", 3);
    w.stats.believers = (w.stats.believers || 0) + 1;
    if (!w.firstBeliever) {
      w.firstBeliever = c.id;
      logEvent(w, 3, `${c.name} has begun to wonder whether someone is watching over the valley, sending gifts.`, [c.id], c, "belief");
    }
  } else if (b.seen === 1) {
    remember(w, c, "gift", b.giver > 0.3 ? `${label[0].toUpperCase() + label.slice(1)} came out of nowhere. The creek must have wanted it.` : `${label[0].toUpperCase() + label.slice(1)} came. Lucky.`, 0.55);
  }
  // Believers say thank you.
  if (b.giver >= 0.6 && !c.asleep && canBeInterrupted(c) && !c.farewell && !c.leaving) {
    if (!b.thanks) {
      let others = w.creatures.map((o) => o.beliefs && o.beliefs.thanks).filter(Boolean),
        counts = {};
      for (let g of others) counts[g] = (counts[g] || 0) + 1;
      let common = Object.entries(counts).sort((a, x) => x[1] - a[1])[0];
      b.thanks = common && w.rng.chance(0.7) ? common[0] : w.rng.pick(GESTURES);
    }
    setPlan(w, c, { goal: "thanks", steps: [{ do: "gesture", g: b.thanks, task: "thanks" }], i: 0 });
  }
}

function noticePattern(w) {
  let g = w.gifts;
  if (g.length < 4 || w.giftPatternNoticed) return;
  let last = g.slice(-4),
    regular = last.every((x, i) => i === 0 || (x.t - last[i - 1].t > 10 * 3600 && x.t - last[i - 1].t < 16 * 3600));
  if (!regular) return;
  let c = w.creatures.filter((c) => !c.visitor && c.stage !== "child" && beliefsOf(c).giver > 0.5).sort((a, b) => b.temp.curiosity - a.temp.curiosity)[0];
  if (!c) return;
  w.giftPatternNoticed = Math.round(w.t);
  beliefsOf(c).pattern = true;
  logEvent(w, 3, `${c.name} has noticed that the gifts come about twice a day, as steady as breathing.`, [c.id], c, "belief");
  remember(w, c, "belief", "The gifts come twice a day. Whoever sends them keeps a rhythm.", 0.85);
}

function thanksCustom(w) {
  if (w.customs && w.customs.thanks) return;
  let bs = w.creatures.map((c) => c.beliefs && c.beliefs.giver >= 0.6 && c.beliefs.thanks).filter(Boolean);
  if (bs.length < 4) return;
  let counts = {};
  for (let g of bs) counts[g] = (counts[g] || 0) + 1;
  let [g, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (n < bs.length * 0.6) return;
  w.customs = w.customs || {};
  w.customs.thanks = { g, since: Math.round(w.t) };
  logEvent(w, 3, `It has become the custom to ${GESTURE_FIRST[g].replace(/my /, "your ")} when a gift arrives, to say thank you.`, [], null, "custom");
}

// The found object: someone wanders over and picks it up.
function claimFoundGifts(w) {
  for (let it of w.items) {
    if (it.kind !== "gift" || it.claimer) continue;
    let best = null,
      bd = 30;
    for (let c of w.creatures) {
      if (c.asleep || c.visitor || c.farewell || c.leaving || !canBeInterrupted(c)) continue;
      let d = dist2d(c.x, c.z, it.x, it.z);
      if (d < bd) (bd = d), (best = c);
    }
    if (!best) continue;
    it.claimer = best.id;
    setPlan(w, best, { goal: "treasure", steps: [{ do: "walk", x: it.x, z: it.z, near: 0.4, why: "treasure" }, { do: "pickgift", id: it.id }], i: 0 });
  }
}

ACTIONS.pickgift = {
  start(w, c, step) {
    let it = w.byId[step.id];
    if (!it) return null;
    return makeAct(w, c, "look", 4, { lookX: it.x, lookZ: it.z, icon: "eye" });
  },
  end(w, c, a, step) {
    let it = w.byId[step.id];
    if (!it) return false;
    c.treasure = it.thing;
    removeThing(w, it, w.items);
    logEvent(w, 3, `${c.name} found ${it.thing} in the grass. Nobody knows where it came from. ${c.name} is keeping it safe.`, [c.id], c, "gift");
    remember(w, c, "treasure", `I found ${it.thing}. Nobody knows where it came from. I'm keeping it.`, 0.9, { x: c.x, z: c.z, pv: 0.4 });
    noticeGift(w, c, "found", it.thing, 0.6);
    feel(c, w, "joy", 0.7);
    emote(c, w, "star", 3);
    beSeen(w, c, { x: c.x, z: c.z, onSee: (o) => noticeGift(w, o, "found", it.thing, 0.4) });
    return true;
  },
};

// Belief passes between friends, and believers and doubters sometimes argue.
function giftChat(w, a, b) {
  let ba = beliefsOf(a),
    bb = beliefsOf(b),
    diff = ba.giver - bb.giver;
  if (Math.abs(diff) < 0.05) return;
  let r = relation(b, a),
    trust = honestyRate(r) * (0.5 + clamp(r.warmth, 0, 1));
  bb.giver = +clamp(bb.giver + diff * 0.06 * trust * (b.stage === "child" ? 2 : 1), 0, 1).toFixed(3);
  if (ba.giver > 0.5 && bb.giver > 0.3) wordFor(w, b, "giver");
  if (Math.abs(diff) > 0.55 && a.stage !== "child" && b.stage !== "child" && w.rng.chance(0.12) && w.t - (w.lastArgument || -1e9) > 86400) {
    w.lastArgument = w.t;
    let believer = diff > 0 ? a : b,
      doubter = diff > 0 ? b : a;
    relation(a, b).annoy = Math.min(1, relation(a, b).annoy + 0.06);
    relation(b, a).annoy = Math.min(1, relation(b, a).annoy + 0.06);
    logEvent(w, 2, `${believer.name} and ${doubter.name} argued about whether anyone really sends the gifts. ${doubter.name} says it's only luck.`, [a.id, b.id], a, "belief");
  }
}

// Runs inside the life tick: missing gifts, and found objects waiting to be found.
function giftTick(w) {
  claimFoundGifts(w);
  let g = w.gifts || [];
  if (g.length >= 3 && !w.giftsStopped && w.t - w.giftLast > GIFT.stopDays * 86400) {
    w.giftsStopped = Math.round(w.t);
    let doubter = w.creatures.filter((c) => !c.visitor && c.stage !== "child").sort((a, b) => beliefsOf(a).giver - beliefsOf(b).giver)[0];
    logEvent(
      w,
      3,
      `The gifts have stopped coming. Some of the creekfolk wonder what they did wrong${doubter && beliefsOf(doubter).giver < 0.3 ? `; ${doubter.name} says there was never anyone at all` : ""}.`,
      [],
      null,
      "belief",
    );
    for (let c of w.creatures) if (beliefsOf(c).giver > 0.5) remember(w, c, "belief", "The gifts have stopped. I wonder if we did something wrong.", 0.8);
  }
  if (w.giftsStopped) for (let c of w.creatures) if (c.beliefs && c.beliefs.giver > 0.1) c.beliefs.giver = +Math.max(0.1, c.beliefs.giver - 0.00015 * (c.beliefs.seen > 10 ? 0.5 : 1)).toFixed(4);
}

// ==== src/sim/hooks.js ====
// ==========================================================================
// Connecting the calendar and lives to the original world.
// ==========================================================================

// A new valley: five founders, young adults of different ages, on the real calendar.
//   opts.calStart  epoch ms when the valley begins (the real "now")
//   opts.tzMin     the player's time-zone offset in minutes (Date#getTimezoneOffset)
function newValley(seed, opts = {}) {
  let w = createWorld(seed, LIFE.founders);
  w.calStart = opts.calStart ?? 0;
  w.tzMin = opts.tzMin ?? 0;
  w.cycle = { len: VALLEY_DAY, off: 0.27 };
  setDayCycle(w.cycle);
  LIFE.founderAges.forEach((age, k) => {
    let c = w.creatures[k];
    if (!c) return;
    initLife(w, c, -Math.round(age * DAY_S), { gen: 0 });
    c.founder = true;
  });
  w.lifeV = 1;
  w.season = seasonAt(w).name;
  schedule(w, LIFE.tick, "L");
  storyFounding(w); // MINDS: everyone remembers waking up
  return w;
}

// Bring any saved world up to date (also used for valleys saved by the first Creekfolk).
function upgradeWorld(w) {
  if (!w.lifeV) {
    // An old valley: its creatures become founders of different adult ages.
    w.calStart = w.calStart ?? (w.realStart != null ? w.realStart : 0);
    w.tzMin = w.tzMin ?? 0;
    w.creatures.forEach((c, k) => {
      let age = LIFE.founderAges[k % LIFE.founderAges.length];
      initLife(w, c, Math.round(w.t - age * DAY_S), { gen: 0 });
      c.founder = true;
    });
    w.lifeV = 1;
    w.season = seasonAt(w).name;
    schedule(w, w.t + LIFE.tick, "L");
  }
  w.cycle = { len: VALLEY_DAY, off: (w.cycle && w.cycle.off) ?? 0.27 };
  setDayCycle(w.cycle);
  for (let c of w.creatures) c.stage = stageOf(w, c);
  if (!w.stories) storyFounding(w); // MINDS: a valley from before stories
  return w;
}

// ---- developer triggers (the dev build's "make it happen now" buttons) -----
// These change the valley outside its own course of events, so they are only
// offered by the developer menu.
function devTrigger(w, what) {
  let alive = w.creatures.filter((c) => !c.visitor);
  if (what === "storm") {
    let e = w.weather;
    e.cum = rainTotal(w, w.t);
    e.cumT = w.t;
    e.tok = (e.tok || 0) + 1;
    let was = e.state;
    e.state = "storm";
    e.rain = 1.6;
    e.since = w.t;
    e.until = w.t + 900;
    schedule(w, e.until, "R", 0, e.tok);
    if (was !== "storm") storyStorm(w);
    logEvent(w, 2, "A storm rolled in over the valley.", [], null, "weather");
    let T = creekStorm(w);
    return `storm (a ${T.toFixed(1)}-year flood)`;
  }
  if (what === "flood") {
    let T = creekStorm(w, 25);
    return `a ${T}-year flood`;
  }
  if (what === "birth") {
    let adults = alive.filter((c) => stageOf(w, c) === "adult"),
      pair = adults.map((c) => [c, c.partner && w.byId[c.partner]]).find(([c, p]) => p && stageOf(w, p) === "adult");
    if (!pair && adults.length >= 2) pair = [adults[0], adults.find((c) => c !== adults[0] && !(adults[0].parents || []).includes(c.id))];
    if (!pair || !pair[1]) return "no two grown-ups to be parents";
    bear(w, pair[0], pair[1]);
    return `a child for ${pair[0].name} and ${pair[1].name}`;
  }
  if (what === "passing") {
    let c = alive.filter((c) => !c.farewell).sort((a, b) => a.born - b.born)[0];
    if (!c) return "nobody";
    c.lifespan = Math.max(0, Math.round(w.t - c.born));
    return `${c.name}'s time has come`;
  }
  if (what === "visitor") return visits(w, true) === false ? "nobody has gone downstream yet" : "a visitor is coming up the creek";
  return "unknown";
}

// ==== src/sim/api.js ====
// The simulation's public surface, used by the app, the worker and the Node tests.
var CreekSim = {
  newValley,
  runUntil,
  saveWorld,
  loadWorld,
  stageCounts,
  stageOf,
  ageDays,
  valleyCapacity,
  seasonAt,
  dateText,
  LIFE,
  MINDS,
  giveGift,
  giftReady,
  giftWaitSeconds,
  storyText,
  giftNeed,
  giverName,
  // Phase 3A: the creek
  CREEK,
  VW,
  VL,
  YEAR_DAYS,
  creekStorm,
  creekHydro,
  creekFeed,
  creekDriest,
  creekSyncDams,
  creekShareWords,
  creekStageAt,
  creekTrench,
  creekNatural,
  capacityParts,
  WEATHER,
  BUILD_VERSION,
  creekRaiseDam,
  creekPondLevels,
  creekCells,
  creekBumpiness,
  devTrigger,
};

module.exports = CreekSim;
