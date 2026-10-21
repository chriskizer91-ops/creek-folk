// ==========================================================================
// A plain map of the valley from above, drawn on a 2D canvas: the ground's shape and
// green, marsh and water, the creek and its branches, what's built, and each creekfolk as
// a dot in its family's colour. Used until the 3D valley is ready, and where WebGL
// isn't there. Drag to move, wheel or pinch to zoom, tap a dot to follow it.
// ==========================================================================

// A family's colour: the founders' fur hues, carried down (children take a parent's).
function familyHue(vw, c) {
  let seen = new Set(),
    k = c;
  while (k && k.parents && k.parents.length && !seen.has(k.id)) {
    seen.add(k.id);
    let p = vw.creature(k.parents[0]);
    if (!p) break;
    k = p;
  }
  return (k && k.look ? k.look.hue : c.look ? c.look.hue : 0) * 360;
}

var MapView = class {
  constructor(app, canvas) {
    this.app = app;
    this.cv = canvas;
    this.g = canvas.getContext("2d");
    this.ground = document.createElement("canvas");
    this.P = 3; // ground image pixels per metre
    this.keyV = "";
    this.cam = { x: VW / 2, z: VL / 2, s: 0 }; // metres; s: pixels per metre (0: fit)
    this.followed = null;
    this.overlay = null;
    this.ambient = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.input();
  }
  resize() {
    let d = Math.min(2, window.devicePixelRatio || 1);
    this.cv.width = Math.round(innerWidth * d);
    this.cv.height = Math.round(innerHeight * d);
    this.dpr = d;
  }
  fit() {
    return Math.min(this.cv.width / (VW + 8), this.cv.height / (VL + 8));
  }
  onSync() {
    this.keyV = "";
  }
  follow(id) {
    this.followed = id;
    $("follow").hidden = !id;
    if (id) $("followName").textContent = (this.app.vw.creature(id) || {}).name || "";
  }
  setAmbient(on) {
    this.ambient = on;
  }
  setOverlay(o) {
    this.overlay = o;
    this.keyV = "";
  }
  input() {
    let cv = this.cv,
      drag = null,
      pts = new Map();
    cv.addEventListener("pointerdown", (e) => {
      cv.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      drag = { x: e.clientX, y: e.clientY, cx: this.cam.x, cz: this.cam.z, moved: 0 };
    });
    cv.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      let prev = pts.get(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        let [a, b] = [...pts.values()],
          d1 = Math.hypot(a.x - b.x, a.y - b.y),
          o = [...pts.entries()].find(([k]) => k !== e.pointerId)[1],
          d0 = Math.hypot(prev.x - o.x, prev.y - o.y);
        if (d0 > 0) this.zoom(d1 / d0);
        if (drag) drag.moved = 99;
        return;
      }
      if (!drag) return;
      let s = (this.cam.s || this.fit()) / this.dpr;
      drag.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
      this.cam.x = drag.cx - (e.clientX - drag.x) / s;
      this.cam.z = drag.cz - (e.clientY - drag.y) / s;
      if (drag.moved > 6) this.follow(null);
    });
    let up = (e) => {
      pts.delete(e.pointerId);
      if (drag && drag.moved < 6 && pts.size === 0) this.pick(e.clientX * this.dpr, e.clientY * this.dpr);
      drag = null;
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", (e) => (e.preventDefault(), this.zoom(Math.exp(-e.deltaY * 0.0015))), { passive: false });
  }
  zoom(f) {
    let s = (this.cam.s || this.fit()) * f;
    this.cam.s = clamp(s, this.fit() * 0.8, 60 * this.dpr);
  }
  toScreen(x, z) {
    let s = this.cam.s || this.fit();
    return [this.cv.width / 2 + (x - this.cam.x) * s, this.cv.height / 2 + (z - this.cam.z) * s];
  }
  pick(px, py) {
    let vw = this.app.vw,
      t = vw.tNow(),
      best = null,
      bd = 20 * this.dpr;
    for (let c of vw.cs.values()) {
      if (c.away) continue;
      let p = vw.posOf(c, t),
        [sx, sy] = this.toScreen(p.x, p.z),
        d = Math.hypot(sx - px, sy - py);
      if (d < bd) (bd = d), (best = c);
    }
    this.follow(best ? best.id : null);
  }
  paintGround() {
    let vw = this.app.vw,
      T = vw.T,
      G = vw.grids,
      P = this.P,
      W = VW * P,
      H = VL * P,
      cv = this.ground;
    cv.width = W;
    cv.height = H;
    let g = cv.getContext("2d"),
      img = g.createImageData(W, H),
      d = img.data,
      mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
      green = [96, 140, 74],
      straw = [176, 156, 98],
      marsh = [70, 110, 92],
      water = [70, 130, 170],
      rock = [196, 190, 176];
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let mx = (x + 0.5) / P,
          mz = (y + 0.5) / P,
          k = Math.floor(mz) * VW + Math.floor(mx),
          h = T.heightAt(mx, mz),
          hx = T.heightAt(mx + 0.5, mz) - T.heightAt(mx - 0.5, mz),
          hz = T.heightAt(mx, mz + 0.5) - T.heightAt(mx, mz - 0.5),
          shade = clamp(1 - 0.9 * hx - 0.6 * hz, 0.35, 1.3),
          c = mix(straw, green, G ? G.green[k] : 0.6);
        if (T.rock[Math.round(mz) * (VW + 1) + Math.round(mx)]) c = mix(c, rock, 0.75);
        if (G && G.wet[k] > 0.05) c = mix(c, marsh, Math.min(1, G.wet[k]));
        if (this.overlay === "wear" && G) c = mix(c, [230, 200, 120], Math.min(1, G.wear[k] / 8));
        if (this.overlay === "wet" && G) c = mix([120, 90, 60], [40, 120, 220], Math.min(1, G.wet[k]));
        c = c.map((v) => v * shade);
        if (G && G.wt[k] > h + 0.005) c = mix(c, water, Math.min(1, 0.45 + (G.wt[k] - h) * 3));
        let o = (y * W + x) * 4;
        d[o] = c[0];
        d[o + 1] = c[1];
        d[o + 2] = c[2];
        d[o + 3] = 255;
      }
    g.putImageData(img, 0, 0);
    // the creek's water, node by node
    if (vw.nodes)
      for (let n of vw.nodes) {
        if (n.z < 0 || n.z > VL || n.wl <= n.bed + 0.01) continue;
        let hw = 0.5 * Math.max(0.3, n.wb + 2 * n.m * Math.min(n.wl - n.bed, n.fp - n.bed));
        g.fillStyle = this.overlay === "stage" ? { 0: "#2f8f5f", I: "#5f9f3f", II: "#c0503a", III: "#d07030", IV: "#d0b040", V: "#80b050" }[n.stage] || "#888" : n.q > 2e-5 ? "#3c78be" : "#285a8c";
        g.fillRect((n.x - hw) * P, (n.z - 1) * P, 2 * hw * P, 2 * P);
      }
    for (let b of Object.values(T.branches))
      for (let i = 0; i < b.n; i++) {
        let ws = vw.br ? cf2BranchWater({ terrain: T, creek: { br: vw.br, flood: vw.flood }, t: vw.t }, b, i) : null;
        g.fillStyle = ws == null ? "#d2c8aa" : "#4696c8";
        g.fillRect(b.X[i] * P - 1, b.Z[i] * P - 1, 2, 2);
      }
  }
  frame(t) {
    let vw = this.app.vw;
    if (!vw.T) return;
    let key = `${vw.creekV}|${vw.waterV}|${this.overlay}`;
    if (key !== this.keyV) (this.keyV = key), this.paintGround();
    let g = this.g,
      s = this.cam.s || this.fit();
    if (this.followed) {
      let c = vw.creature(this.followed);
      if (c) {
        let p = vw.posOf(c, t);
        this.cam.x += (p.x - this.cam.x) * 0.08;
        this.cam.z += (p.z - this.cam.z) * 0.08;
      } else this.follow(null);
    } else if (this.ambient) {
      this.cam.x = VW / 2 + Math.sin(t / 900) * VW * 0.25;
      this.cam.z = VL / 2 + Math.sin(t / 1400) * VL * 0.3;
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = "#4d6b4a";
    g.fillRect(0, 0, this.cv.width, this.cv.height);
    let [ox, oy] = this.toScreen(0, 0);
    g.imageSmoothingEnabled = false;
    g.drawImage(this.ground, ox, oy, VW * s, VL * s);
    // what's built, plants and materials
    for (let r of vw.list("res").values()) {
      let [x, y] = this.toScreen(r.x, r.z),
        R = r.kind === "tree" || r.kind === "grove" ? Math.max(1.5, (r.canopy || 1.5) * s * 0.55) : Math.max(1, s * 0.35);
      g.fillStyle = { tree: "#2a5a34", podtree: "#4a6a26", bush: "#5a8a44", reeds: "#8aa060", stones: "#9a9a96", boulder: "#8a8a86", clay: "#a8704a", grove: "#1e4424", log: "#6a4a30" }[r.kind] || "#c8c078";
      g.beginPath();
      g.arc(x, y, R, 0, 6.283);
      g.fill();
    }
    for (let st of vw.list("structures").values()) {
      let [x, y] = this.toScreen(st.x, st.z),
        R = Math.max(2, ((STRUCTURES[st.kind] || {}).radius || 1) * s * 0.7);
      g.globalAlpha = st.level > 0 ? 1 : 0.45;
      g.fillStyle = { dam: "#7a5028", home: "#c85a3c", garden: "#96c85a", store: "#c8a050", meeting: "#d8d0b0", crossing: "#8a6a48" }[st.kind] || "#dcdcdc";
      if (st.kind === "dam") g.fillRect(x - R, y - Math.max(1.5, s * 0.4), 2 * R, Math.max(3, s * 0.8));
      else g.beginPath(), g.arc(x, y, R, 0, 6.283), g.fill();
      g.globalAlpha = 1;
    }
    // the creekfolk: dots in their family's colour, bigger for grown-ups
    for (let c of vw.cs.values()) {
      if (c.away || !c.look) continue;
      let p = vw.posOf(c, t),
        [x, y] = this.toScreen(p.x, p.z),
        R = Math.max(2.2 * this.dpr, s * (c.stage === "child" ? 0.35 : 0.5));
      g.fillStyle = `hsl(${familyHue(vw, c)} 60% ${c.stage === "elder" ? 78 : 58}%)`;
      g.strokeStyle = c.id === this.followed ? "#fff6d0" : "#1b1a18";
      g.lineWidth = c.id === this.followed ? 2.5 * this.dpr : 1 * this.dpr;
      g.beginPath();
      g.arc(x, y, R, 0, 6.283);
      g.fill();
      g.stroke();
      if (s > 12 * this.dpr || c.id === this.followed) {
        g.fillStyle = "#f2efe9";
        g.font = `${11 * this.dpr}px ${getComputedStyle(document.body).fontFamily}`;
        g.fillText(c.name, x + R + 3, y + 4);
      }
    }
  }
};

