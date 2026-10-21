// ==========================================================================
// The 3D view: What the Water Brings' pixel renderer (PKPixel3D, PKToon) looking at the
// valley drawn from the simulation (CF2Valley), with the creekfolk on it.
//
// The zoom runs from the whole valley seen from the air down to a creekfolk's face; it
// changes only what is drawn. Far out each creekfolk is a dot in its family's colour; nearer,
// a small pixel sprite (sprites.js); close up, a full creekfolk (folk3d.js, where it exists).
// The light follows the valley's own hour (What the Water Brings' grade, tint, sky and colour
// tables), and the weather. Drag to move, wheel or pinch to zoom, right-drag or two fingers to
// turn and tilt; tap a creekfolk to follow it.
// ==========================================================================

var VIEW_ZMIN = 1.6, // metres of view, top to bottom, at the closest ...
  VIEW_ZMAX = 300; // ... and the farthest

var View3D = class {
  constructor(app, canvas) {
    this.app = app;
    this.vw = app.vw;
    this.cv = canvas;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    let r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
    cf2PrepareRenderer(r);
    r.setPixelRatio(this.dpr);
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.BasicShadowMap;
    this.r = r;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#a8d0de");
    this.hemi = new THREE.HemisphereLight(0xfffaf2, 0xe4dccb, 0.45 * CF2_LIGHT);
    this.sun = new THREE.DirectionalLight(0xfff6e8, 0.83 * CF2_LIGHT);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.002;
    this.scene.add(this.hemi, this.sun, this.sun.target);
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 900);
    this.view = { x: VW / 2, z: VL * 0.3, az: 0.6, el: 0.95, hv: 120, goal: { x: VW / 2, z: VL * 0.3, az: 0.6, el: 0.95, hv: 120 }, k: 1, w: 1, h: 1 };
    this.followed = null;
    this.ambient = false;
    this.overlay = null;
    this.folk = new Map(); // id -> { sprite, model, dot index }
    this.time = 0;
    this.ready = false;
    this.input();
    window.addEventListener("resize", () => this.resize());
  }
  // The first full description of the valley has arrived: build it.
  onSync() {
    if (!this.valley || this.valley.seed !== this.vw.seed) {
      if (this.valley) this.scene.remove(this.valley.group);
      this.valley = CF2Valley.create(this.vw, { detail: this.app.quality === "low" ? 2 : 3 });
      this.valley.seed = this.vw.seed;
      this.scene.add(this.valley.group);
      let pal = [PKToon.P.ink].concat(CF2Valley.palette(), spritePalette(), folkPalette(), ["#a8d0de", "#fff2c8"]),
        seen = {};
      pal = pal.filter((c) => ((c = c.toLowerCase()), seen[c] ? false : (seen[c] = 1)));
      this.px = PKPixel3D.create(this.r, { palette: pal, snapLow: true, softInk: true, lut: true });
      this.beasts = CF2Beasts.create(this);
      this.dots = new FolkDots(this);
      this.scene.add(this.dots.points);
      let m = this.vw.meadow || { x: VW / 2, z: 40 };
      Object.assign(this.view, { x: m.x, z: m.z + 10 });
      Object.assign(this.view.goal, { x: m.x, z: m.z + 10, hv: 70 });
      this.resize();
      this.valley.stream(this.view.x, this.view.z, 999, 1e9);
      this.ready = true;
    }
    for (let f of this.folk.values()) this.dropFolk(f);
    this.folk.clear();
  }
  resize() {
    let w = Math.max(1, innerWidth),
      h = Math.max(1, innerHeight);
    this.r.setSize(w, h, false);
    let cw = Math.round(w * this.dpr),
      ch = Math.round(h * this.dpr);
    // one art pixel per device pixel on a laptop; two on a phone (lighter, and still crisp)
    this.view.k = this.app.quality === "low" ? 2 : 1;
    if (this.px) this.px.setSize(cw, ch, this.view.k, this.cam), (this.view.w = this.px.w), (this.view.h = this.px.h);
  }
  follow(id) {
    this.followed = id;
    $("follow").hidden = !id;
    if (id) {
      let c = this.vw.creature(id);
      $("followName").textContent = c ? c.name : "";
      if (this.view.goal.hv > 18) this.view.goal.hv = 12;
    }
  }
  setAmbient(on) {
    this.ambient = on;
  }
  setOverlay(o) {
    this.overlay = o;
    if (this.valley) this.valley.setOverlay(o);
  }
  welcomeBack() {}
  // ---- input -----------------------------------------------------------------------
  input() {
    let cv = this.cv,
      pts = new Map(),
      drag = null;
    cv.addEventListener("contextmenu", (e) => e.preventDefault());
    cv.addEventListener("pointerdown", (e) => {
      cv.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      drag = { x: e.clientX, y: e.clientY, moved: 0, turn: e.button === 2 || e.shiftKey };
    });
    cv.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      let prev = pts.get(e.pointerId),
        cur = { x: e.clientX, y: e.clientY };
      pts.set(e.pointerId, cur);
      let G = this.view.goal;
      if (pts.size === 2) {
        let o = [...pts.entries()].find(([k]) => k !== e.pointerId)[1],
          d0 = Math.hypot(prev.x - o.x, prev.y - o.y),
          d1 = Math.hypot(cur.x - o.x, cur.y - o.y),
          a0 = Math.atan2(prev.y - o.y, prev.x - o.x),
          a1 = Math.atan2(cur.y - o.y, cur.x - o.x);
        if (d0 > 0) G.hv = clamp(G.hv * (d0 / d1), VIEW_ZMIN, VIEW_ZMAX);
        G.az -= a1 - a0;
        G.el = clamp(G.el + ((cur.y - prev.y) / innerHeight) * 0.6, 0.12, 1.5);
        if (drag) drag.moved = 99;
        return;
      }
      if (!drag) return;
      let dx = cur.x - prev.x,
        dy = cur.y - prev.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.turn) {
        G.az -= dx * 0.006;
        G.el = clamp(G.el + dy * 0.004, 0.12, 1.5);
        return;
      }
      // pan along the ground, in the camera's frame
      let m = G.hv / innerHeight,
        ca = Math.cos(this.view.az),
        sa = Math.sin(this.view.az),
        se = Math.max(0.3, Math.sin(this.view.el));
      G.x -= (dx * ca - (dy / se) * sa) * m;
      G.z -= (-dx * sa - (dy / se) * ca) * m;
      if (drag.moved > 8 && this.followed) this.follow(null);
    });
    let up = (e) => {
      pts.delete(e.pointerId);
      if (drag && drag.moved < 6 && pts.size === 0) this.pick(e.clientX, e.clientY);
      drag = null;
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", (e) => (e.preventDefault(), (this.view.goal.hv = clamp(this.view.goal.hv * Math.exp(e.deltaY * 0.0012), VIEW_ZMIN, VIEW_ZMAX))), { passive: false });
    window.addEventListener("keydown", (e) => {
      if (e.target && e.target.tagName === "INPUT") return;
      let G = this.view.goal;
      if (e.key === "z" || e.key === "Z") G.az += Math.PI / 4;
      if (e.key === "x" || e.key === "X") G.az -= Math.PI / 4;
      if (e.key === "r" || e.key === "R") G.el = clamp(G.el + 0.15, 0.12, 1.5);
      if (e.key === "f" || e.key === "F") G.el = clamp(G.el - 0.15, 0.12, 1.5);
      if (e.key === "+" || e.key === "=") G.hv = clamp(G.hv / 1.4, VIEW_ZMIN, VIEW_ZMAX);
      if (e.key === "-") G.hv = clamp(G.hv * 1.4, VIEW_ZMIN, VIEW_ZMAX);
    });
  }
  pick(sx, sy) {
    let t = this.vw.tNow(),
      best = null,
      bd = 34,
      v = new THREE.Vector3();
    for (let c of this.vw.cs.values()) {
      if (c.away || !c.look) continue;
      let p = this.vw.posOf(c, t);
      v.set(p.x, this.valley.height(p.x, p.z) + 0.7, p.z).project(this.cam);
      let px = ((v.x + 1) / 2) * innerWidth,
        py = ((1 - v.y) / 2) * innerHeight,
        d = Math.hypot(px - sx, py - sy);
      if (d < bd) (bd = d), (best = c);
    }
    this.follow(best ? best.id : null);
  }
  // ---- the camera --------------------------------------------------------------------
  placeCamera(dt) {
    let V = this.view,
      G = V.goal,
      k = 1 - Math.exp(-dt * 4);
    if (this.followed) {
      let c = this.vw.creature(this.followed);
      if (c) {
        let p = this.vw.posOf(c, this.t);
        G.x = p.x;
        G.z = p.z;
      } else this.follow(null);
    } else if (this.ambient) {
      // drifting slowly over the valley, turning a little
      let s = this.time * 0.02;
      G.x = VW / 2 + Math.sin(s * 0.7) * VW * 0.22;
      G.z = VL / 2 + Math.sin(s * 0.43) * VL * 0.32;
      G.az += dt * 0.012;
      if (G.hv < 25) G.hv = 40;
    }
    G.x = clamp(G.x, -20, VW + 20);
    G.z = clamp(G.z, -20, VL + 20);
    for (let q of ["x", "z", "az", "el"]) V[q] += (G[q] - V[q]) * k;
    V.hv = Math.exp(Math.log(V.hv) + (Math.log(G.hv) - Math.log(V.hv)) * k);
    let ty = this.valley.height(V.x, V.z),
      D = Math.max(60, V.hv * 2.2),
      ce = Math.cos(V.el),
      cam = this.cam,
      a = innerWidth / innerHeight;
    cam.position.set(V.x + Math.sin(V.az) * ce * D, ty + Math.sin(V.el) * D, V.z + Math.cos(V.az) * ce * D);
    cam.lookAt(V.x, ty, V.z);
    cam.top = V.hv / 2;
    cam.bottom = -V.hv / 2;
    cam.left = -cam.top * a;
    cam.right = cam.top * a;
    // close in, only what lies a little in front of the target is drawn, so the ground opens
    // like a diorama and a low view is never blocked; from the air, everything
    let front = V.hv < 40 ? Math.max(this.followed && V.hv < 12 ? 1.6 : 3, V.hv * (this.followed ? 0.9 : 1.6)) : D;
    cam.near = Math.max(0.5, D - front);
    cam.far = D + Math.max(400, V.hv * 3);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    if (this.px) this.px.uniforms.edge.value = 0.12 / (cam.far - cam.near);
    if (this.px) this.px.uniforms.crease.value = 0.035 / (cam.far - cam.near);
    return ty;
  }
  // ---- the light -------------------------------------------------------------------
  light(t, ty) {
    let hour = cf2Hour(t),
      wx = this.vw.weather || {},
      st = wx.state === "storm" ? 1 : wx.state === "rain" ? 0.55 : wx.state === "cloudy" ? 0.25 : 0;
    this.st = (this.st ?? st) + (st - (this.st ?? st)) * 0.02;
    st = this.st;
    let L = cf2Look(hour, st),
      px = this.px,
      V = this.view;
    px.setGrade2(L.shade, L.light, L.lift);
    this.sun.intensity = L.sun * CF2_LIGHT;
    this.hemi.intensity = L.hemi * CF2_LIGHT;
    this.sun.color.setRGB(1, L.sunG, L.sunB);
    // the sun's direction with the hours; its shadow box follows the view (none from the air)
    let sa = L.sunAz,
      sel = L.sunEl,
      sr = 60 * Math.cos(sel);
    this.sun.position.set(V.x + Math.sin(sa) * sr, ty + 60 * Math.sin(sel), V.z + Math.cos(sa) * sr);
    this.sun.target.position.set(V.x, ty, V.z);
    this.sun.target.updateMatrixWorld();
    let sc = this.sun.shadow.camera,
      box = clamp(V.hv * 0.9, 10, 60);
    sc.left = sc.bottom = -box;
    sc.right = sc.top = box;
    sc.near = 1;
    sc.far = 160;
    sc.updateProjectionMatrix();
    this.sun.castShadow = V.hv < 70;
    let FX = PKToon.FX,
      ppm = px.h / Math.max(1e-3, V.hv);
    FX.uTime.value = this.time;
    FX.uWind.value.set(0.05 * (1 + st), 0.014 * (1 + st), 0.5, st);
    FX.uCloud.value.set(-this.time * 0.08, -this.time * 0.012, 0.032, 0.26 * (1 - L.night) * (1 - st));
    FX.uDay.value.set(1 - L.night, st);
    FX.uDith.value.set(0.035, Math.max(2, Math.round(ppm / 60)));
    px.setFX({
      ao: V.hv < 50 ? [1.0, 0.32] : [0, 0.3],
      selOut: 1,
      spill: Math.max(0, L.night - 0.25) * 1.3,
      sat: L.sat * (1 - 0.35 * st),
      dcell: Math.max(2, Math.round(ppm / 60)),
      skyTop: L.skyTop,
      skyHor: L.skyHor,
      skyI: [L.stars, 0.45 + 0.4 * st, this.time, 1 - L.night],
      sun: [0, 0, 0, 0],
      haze: [L.skyHor[0], L.skyHor[1], L.skyHor[2], V.hv > 60 ? 0.25 : 0.5 + 0.25 * st],
      hazeZ: [this.cam.position.distanceTo(this.sun.target.position), V.hv * 0.6, V.hv * 4],
      pool: [0, 0, 1, 0],
    });
  }
  // ---- the creekfolk --------------------------------------------------------------
  dropFolk(f) {
    if (f.sprite) this.scene.remove(f.sprite), f.sprite.material.map.dispose(), f.sprite.material.dispose();
    if (f.model) this.scene.remove(f.model.root);
  }
  drawFolk(t, dt) {
    let vw = this.vw,
      V = this.view,
      mode = V.hv > 70 ? "dot" : V.hv > 16 ? "sprite" : "near",
      seen = new Set(),
      camDir = new THREE.Vector3();
    this.cam.getWorldDirection(camDir);
    let camYaw = Math.atan2(camDir.x, camDir.z);
    this.dots.begin();
    for (let c of vw.cs.values()) {
      if (c.away || !c.look) continue;
      seen.add(c.id);
      let p = vw.posOf(c, t),
        y = this.valley.height(p.x, p.z),
        f = this.folk.get(c.id);
      if (!f) this.folk.set(c.id, (f = { id: c.id, last: { x: p.x, z: p.z }, face: c.act ? c.act.face || 0 : 0, walk: 0 }));
      // which way they face and how far through a step they are, from how they move
      let mx = p.x - f.last.x,
        mz = p.z - f.last.z,
        moved = Math.hypot(mx, mz);
      if (moved > 0.002) f.face = Math.atan2(mx, mz);
      f.walk = moved > 0.002 ? f.walk + moved : 0;
      f.last = { x: p.x, z: p.z };
      if (mode === "dot") {
        if (f.sprite) f.sprite.visible = false;
        if (f.model) f.model.root.visible = false;
        this.dots.add(p.x, y + 0.8, p.z, folkDotColour(vw, c), c.id === this.followed);
        continue;
      }
      if (mode === "near" && typeof Folk3D !== "undefined" && Folk3D.ok) {
        if (!f.model || f.modelKey !== Folk3D.key(c)) {
          if (f.model) this.scene.remove(f.model.root);
          f.model = Folk3D.build(c, vw);
          f.modelKey = Folk3D.key(c);
          this.scene.add(f.model.root);
        }
        if (f.sprite) f.sprite.visible = false;
        f.model.root.visible = true;
        Folk3D.pose(f.model, c, { x: p.x, y, z: p.z, face: f.face, walking: moved > 0.002, dt, t });
        continue;
      }
      if (f.model) f.model.root.visible = false;
      // the sprite: its frame from the camera's side of it and its step
      let sh = creekSprites(c);
      if (!f.sprite || f.sheet !== sh) {
        if (f.sprite) this.scene.remove(f.sprite), f.sprite.material.map.dispose(), f.sprite.material.dispose();
        let tex = new THREE.CanvasTexture(sh.canvas);
        cf2PrepareTexture(tex);
        tex.magFilter = tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false;
        tex.repeat.set(1 / 3, 1 / 4);
        let mat = new THREE.SpriteMaterial({ map: tex, alphaTest: 0.5, transparent: false });
        f.sprite = new THREE.Sprite(mat);
        f.sprite.center.set(0.5, 0);
        f.sheet = sh;
        this.scene.add(f.sprite);
      }
      let rel = f.face - camYaw,
        dirI = Math.round(((((rel / (Math.PI / 2)) % 4) + 4) % 4)) % 4,
        dir = ["up", "right", "down", "left"][dirI],
        fr = moved > 0.002 ? 1 + (Math.floor(f.walk / 0.35) % 2) : 0,
        frame = sh.frames[dir][fr],
        tall = c.stage === "child" ? 1.0 : 1.45;
      f.sprite.material.map.offset.set(frame.x / sh.canvas.width, 1 - (frame.y + sh.h) / sh.canvas.height);
      f.sprite.scale.set((tall * sh.w) / sh.h, tall, 1);
      f.sprite.position.set(p.x, y, p.z);
      f.sprite.visible = true;
    }
    this.dots.end();
    for (let [id, f] of this.folk) if (!seen.has(id)) this.dropFolk(f), this.folk.delete(id);
  }
  // Close in on someone, canopies and roofs between them and the camera open a round hole.
  cutAround() {
    let CUT = this.valley.CUT,
      V = this.view,
      c = this.followed && this.vw.creature(this.followed);
    if (!c || V.hv > 30) return (CUT.r.value = 0);
    let p = this.vw.posOf(c, this.t),
      v = new THREE.Vector3(p.x, this.valley.height(p.x, p.z) + 0.7, p.z).project(this.cam);
    CUT.p.value.set(v.x, v.y);
    CUT.z.value = v.z * 0.5 + 0.5;
    CUT.r.value = clamp(2.6 / V.hv, 0.08, 0.7);
    CUT.res.value.set(this.px.w, this.px.h);
    CUT.a.value = this.px.w / this.px.h;
  }
  // ---- every frame -----------------------------------------------------------------
  frame(t, dt) {
    if (!this.ready || !this.px) return;
    this.t = t;
    this.time += dt;
    let ty = this.placeCamera(dt);
    this.valley.stream(this.view.x, this.view.z, this.view.hv < 60 ? Math.max(40, this.view.hv * 1.2) : 999, 6);
    this.light(t, ty);
    this.drawFolk(t, dt);
    this.beasts.update(t, dt);
    this.cutAround();
    this.px.render(this.scene, this.cam);
  }
};

// The valley's hour on What the Water Brings' clock (its tables are keyed by hour): the
// simulation's dawn (day phase 0.2) is 5.6, its dusk (0.82) is 20.2.
function cf2Hour(t) {
  let p = dayPhase(t);
  return p < 0.2 ? (p / 0.2) * 5.6 : p < 0.82 ? 5.6 + ((p - 0.2) / 0.62) * 14.6 : 20.2 + ((p - 0.82) / 0.18) * 3.8;
}

// What the Water Brings' look through the day (its main.js): the grade, shade and light
// tints, the sky, colour strength, the sun's height and direction, and the storm's greying.
var CF2_GRADES = [[0, [0.47, 0.52, 0.74]], [4.8, [0.48, 0.53, 0.75]], [5.9, [0.82, 0.7, 0.78]], [7.0, [0.98, 0.93, 0.9]], [8.5, [1, 1, 1]], [13, [1.03, 1.02, 0.98]], [16.2, [1.04, 0.97, 0.86]], [18.0, [1.02, 0.82, 0.66]], [19.4, [0.78, 0.64, 0.7]], [20.6, [0.52, 0.56, 0.78]], [24, [0.47, 0.52, 0.74]]];
var CF2_TINTS = [[0, [0.94, 0.97, 1.1], [0.96, 0.99, 1.06]], [5.0, [0.94, 0.97, 1.1], [0.96, 0.99, 1.06]], [6.2, [0.86, 0.84, 1.06], [1.12, 0.98, 0.88]], [7.6, [0.9, 0.94, 1.07], [1.07, 1.02, 0.93]], [10, [0.95, 0.98, 1.05], [1.02, 1.01, 0.98]], [13.5, [0.96, 0.99, 1.04], [1.01, 1.01, 0.99]], [16.5, [0.92, 0.94, 1.07], [1.06, 1.01, 0.92]], [18.3, [0.85, 0.83, 1.05], [1.1, 0.98, 0.84]], [19.6, [0.82, 0.78, 1.0], [1.08, 0.9, 0.86]], [20.8, [0.92, 0.94, 1.1], [0.96, 0.98, 1.05]], [24, [0.94, 0.97, 1.1], [0.96, 0.99, 1.06]]];
var CF2_SKYC = [[0, "#0f1733", "#27304f"], [4.8, "#0f1733", "#27304f"], [5.9, "#3b4a78", "#e09a7c"], [7.0, "#6f9cc8", "#f2d2aa"], [8.5, "#69a5d3", "#bfdcea"], [13, "#5d9fd6", "#bbdced"], [16.2, "#69a0cc", "#e2dcc4"], [18.0, "#5a76a8", "#f0b072"], [19.4, "#3a4878", "#de826c"], [20.6, "#1c2448", "#4b4a6c"], [24, "#0f1733", "#27304f"]].map((r) => [r[0], cf2Hex(r[1]), cf2Hex(r[2])]);
var CF2_SATS = [[0, 0.78], [5.2, 0.8], [6.6, 1.12], [8.5, 1.04], [13, 1.0], [16.5, 1.06], [18.4, 1.12], [19.8, 1.06], [21, 0.82], [24, 0.78]];
function cf2Hex(h) {
  let n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function cf2Table(Tb, h, idx) {
  h = ((h % 24) + 24) % 24;
  for (let i = 1; i < Tb.length; i++)
    if (h <= Tb[i][0]) {
      let a = Tb[i - 1],
        b = Tb[i],
        u = (h - a[0]) / (b[0] - a[0]);
      u = u * u * (3 - 2 * u);
      return idx.map((j) => (Array.isArray(a[j]) ? a[j].map((v, q) => v + (b[j][q] - v) * u) : a[j] + (b[j] - a[j]) * u));
    }
  return idx.map((j) => Tb[0][j]);
}
function cf2Look(h, st) {
  let g = cf2Table(CF2_GRADES, h, [1])[0],
    hh = ((h % 24) + 24) % 24,
    n = hh < 5 ? 1 : hh < 7 ? 1 - (hh - 5) / 2 : hh < 18.5 ? 0 : hh < 21 ? (hh - 18.5) / 2.5 : 1;
  g = g.map((v, k) => v * (1 - st * [0.36, 0.33, 0.26][k] * (1 - 0.6 * n)));
  let [tD, tL] = cf2Table(CF2_TINTS, h, [1, 2]),
    sk = 1 - 0.6 * st,
    [top, hor] = cf2Table(CF2_SKYC, h, [1, 2]),
    sat = cf2Table(CF2_SATS, h, [1])[0];
  if (st > 0) {
    let grey = [0.32, 0.35, 0.4],
      day = 1 - n;
    top = top.map((v, q) => v + (grey[q] * (0.4 + 0.6 * day) - v) * st * 0.85);
    hor = hor.map((v, q) => v + (grey[q] * (0.6 + 0.6 * day) - v) * st * 0.85);
  }
  let day = 1 - n,
    low = hh > 15 ? Math.min(1, (hh - 15) / 4) : 0,
    isDay = hh > 5.6 && hh < 20.4,
    f = isDay ? (hh - 5.6) / 14.8 : ((hh + 24 - 20.4) % 24) / 9.2;
  return {
    night: n,
    shade: [0, 1, 2].map((q) => g[q] * (1 + (tD[q] - 1) * sk)),
    light: [0, 1, 2].map((q) => g[q] * (1 + (tL[q] - 1) * sk)),
    lift: [0.02 * n, 0.026 * n, 0.05 * n],
    sun: (0.35 + 0.48 * day) * (1 - st * 0.4),
    hemi: 0.3 + 0.15 * day,
    sunG: 0.96 - low * 0.12 * day,
    sunB: 0.91 - low * 0.25 * day,
    sunAz: Math.PI / 2 - Math.PI * f,
    sunEl: (isDay ? 0.38 : 0.6) + (isDay ? 0.6 : 0.3) * Math.sin(Math.PI * f),
    skyTop: top,
    skyHor: hor,
    sat,
    stars: Math.max(0, n * 1.2 - 0.2) * (1 - st),
  };
}

// ---- dots: every creekfolk, from the air ------------------------------------------
function folkDotColour(vw, c) {
  return familyColour(c);
}
var FolkDots = class {
  constructor(view) {
    this.max = 80;
    let g = new THREE.BufferGeometry();
    this.pos = new Float32Array(this.max * 3);
    this.col = new Float32Array(this.max * 3);
    g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(this.col, 3));
    this.geo = g;
    this.mat = new THREE.PointsMaterial({ size: 5 * view.dpr, sizeAttenuation: false, vertexColors: true });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    this.n = 0;
    this.c = new THREE.Color();
  }
  begin() {
    this.n = 0;
  }
  add(x, y, z, hex, big) {
    if (this.n >= this.max) return;
    let i = this.n++;
    this.pos.set([x, y, z], i * 3);
    cf2SetColor(this.c, hex);
    this.col.set([this.c.r, this.c.g, this.c.b], i * 3);
  }
  end() {
    this.geo.setDrawRange(0, this.n);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
    this.points.visible = this.n > 0;
  }
};

function makeRenderer(app, canvas) {
  try {
    let gl = canvas.getContext("webgl2");
    if (!gl) throw new Error("no WebGL2");
    if (typeof PKPixel3D === "undefined" || typeof PKToon === "undefined") throw new Error("no renderer");
    return new View3D(app, canvas);
  } catch (e) {
    console.warn("The valley is drawn from above instead: " + e.message);
    let c2 = document.createElement("canvas");
    c2.id = "view";
    canvas.replaceWith(c2);
    return new MapView(app, c2);
  }
}
