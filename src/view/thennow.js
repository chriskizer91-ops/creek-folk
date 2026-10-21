// ==========================================================================
// Phase 3C: then and now. Owner: helper "sound".
//
// Hold the button (or the T key) to see the valley as it was on its first day, from
// the same camera; let go and it is now again. It works like repeat photography in
// stream restoration: the same view, years apart.
//
// The first day is rebuilt from the seed (newValley) once, the first time the button
// is held, and the saved day-one creek (world.creek.init) is laid onto it, so it is
// this valley's own first day. It is drawn by its own ground, water and plant views
// in a scene of its own, which the renderer draws instead of the live scene while the
// button is held. The moment is now's: the same time of day, season, weather, snow and
// topsoil, with the day-one creek cut down in its trench and its low water table.
// Nothing the creekfolk made is there (homes, dams, ponds, marsh, worn paths, gardens,
// the grove, the temple), no animals given as gifts, and none of the creekfolk.
// While the button is held the soundscape listens to the first day too.
//
// Something else that was there on day one (scenery beyond the valley, say) can be
// shown in both pictures: give the object, added straight to the renderer's scene,
// `userData.thenToo = true` and it is lent to the first day's scene while held.
//
// The live world is never changed.
// ==========================================================================

var THENNOW = { key: "t", tapMs: 300, syncEvery: 3 };

qc.thennow =
  '<svg viewBox="0 0 24 24"><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6l-2.5 2.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 4v4.5H8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7.5V12l3.2 2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// The valley on its first day, for a living valley `live` (a separate world; nothing
// of `live` is touched).
function thenNowWorld(live) {
  let w = newValley(live.seed, { calStart: live.calStart, tzMin: live.tzMin }),
    init = live.creek && live.creek.init,
    cr = w.creek;
  // the saved day-one creek wins over the rebuild (they match unless the creek's code changed)
  if (init && cr && init.length === cr.nodes.length && init.some((a, i) => Math.abs(a[0] - cr.nodes[i].bed) + Math.abs(a[1] - cr.nodes[i].fp) + Math.abs(a[2] - cr.nodes[i].wb) > 1e-6)) {
    cr.nodes.forEach((n, i) => {
      [n.bed, n.fp, n.wb] = init[i];
      n.g = +(n.bed + 0.1).toFixed(4);
      n.wl = n.yBed = n.bedMin = n.bed;
    });
    cr.init = init.map((a) => a.slice());
    creekDerive(w);
    creekHydro(w, true);
  }
  w.onLog = null;
  return w;
}

var ThenNow = class {
  constructor(app) {
    this.app = app;
    this.held = false; // the button (or key) is down
    this.showing = false; // the first day is on screen
    this.world = null;
    this.seed = null;
    this.scene = null;
    this.views = null;
    this.lastSync = -1e9;
    this.white = new wt(1, 1, 1);
  }
  ready() {
    return !!(this.views && this.app.world && this.seed === this.app.world.seed);
  }
  // Build the first day and its views: once per valley, a fraction of a second (most
  // of it the ground's mesh and its grass, flowers and hill trees, as at page load).
  build() {
    if (this.ready()) return true;
    let live = this.app.world;
    if (!live) return false;
    this.dispose();
    let t0 = performance.now(),
      w;
    try {
      w = thenNowWorld(live);
    } finally {
      this.app.applyClock(); // a new valley sets the shared day cycle; put the live one back
    }
    let scene = new _r();
    this.views = { terrain: new GroundView(w, scene), props: new ResourceView(w, scene), water: new WaterView(w, scene) };
    this.world = w;
    this.seed = live.seed;
    this.scene = scene;
    this.buildMs = Math.round(performance.now() - t0);
    return true;
  }
  dispose() {
    let v = this.views;
    if (v) v.terrain.dispose(), v.props.dispose(), v.water.dispose();
    this.views = this.world = this.scene = this.seed = null;
    this.showing = false;
  }
  // The first day at this moment: now's time, weather, snow and topsoil (none of
  // which depends on how healthy the creek is) on the day-one creek.
  sync() {
    let live = this.app.world,
      w = this.world,
      a = live.creek,
      b = w.creek;
    w.t = live.t;
    w.weather = { ...live.weather };
    w.snow = live.snow;
    w.starry = live.starry;
    w.rainbow = live.rainbow;
    if (a && b) (b.soil = a.soil), (b.up = a.up), (b.hill = a.hill), (b.flood = null);
    creekHydro(w, true); // levels and green for this moment; nothing turns to marsh
    this.lastSync = performance.now();
  }
  show() {
    this.sync();
    this.views.terrain.lastPaint = -99; // repaint the ground and the water on the next frame
    this.views.water.lastCheck = -99;
    this.showing = true;
    soundscapeRefresh(this.app);
  }
  hold(on) {
    on = !!on;
    if (on === this.held) return;
    let app = this.app;
    if (on && (!app.world || app.catching)) {
      if (app.catching) app.hud.toast("The valley is still catching up.");
      return;
    }
    this.held = on;
    if (on) app.activeInput(); // looking back counts as being here: no ambient mode while held
    if (this.btn) this.btn.classList.toggle("on", on);
    if (this.cap) {
      this.cap.classList.toggle("hidden", !on);
      let d = app.world && app.world.calStart ? realStartText(app.world) : "";
      if (on) this.cap.innerHTML = `As it was on the first day${d ? `<small>${escapeHtml(d)}</small>` : ""}`;
    }
    if (!on) {
      this.showing = false;
      soundscapeRefresh(app);
      return;
    }
    if (this.ready()) this.show();
    // the first time, let the caption appear before the first day is built
    else
      setTimeout(() => {
        if (!this.held) return;
        try {
          if (this.build() && this.held) this.show();
        } catch (e) {
          console.warn("then and now", e);
          this.hold(false);
        }
      }, 30);
  }
  // A different valley (a new one, or the result of a catch-up) was loaded.
  worldChanged() {
    if (this.world && this.app.world && this.seed !== this.app.world.seed) this.hold(false), this.dispose();
    else if (this.showing) this.sync();
  }
  // Each frame while showing: keep the first day's views up to date (after Renderer.update).
  update(R, dt, clock, n, a) {
    let v = this.views,
      w = this.world;
    w.t = this.app.world.t;
    this.app.lastActive = performance.now();
    if (performance.now() - this.lastSync > THENNOW.syncEvery * 1000) this.sync();
    let light = 0.22 + 0.78 * a.dl,
      f = n.focus || { x: VW / 2, z: 30 };
    v.terrain.update(clock, light, a.rain, this.white);
    v.water.update(clock, light, a.rain, this.white, a.night);
    v.terrain.updateWear(clock);
    v.props.sync(clock, R.camera.position, { x: f.x, y: w.terrain.heightAt(clamp(f.x, 0, VW - 0.1), clamp(f.z, 0, VL - 0.1)) + 0.5, z: f.z });
    v.props.updateLights(a.night);
  }
  // Draw the first day's scene with the live lights, fog and falling rain.
  render(R, draw) {
    let live = R.scene,
      s = this.scene,
      moved = [R.hemi, R.sun, R.sun.target],
      ov = R.views && R.views.overlay;
    if (ov && ov.rain) moved.push(ov.rain);
    for (let o of live.children) if (o.userData && o.userData.thenToo) moved.push(o);
    let parents = moved.map((o) => o.parent);
    s.fog = live.fog;
    for (let o of moved) s.add(o);
    R.scene = s;
    try {
      draw.call(R);
    } finally {
      R.scene = live;
      moved.forEach((o, i) => (parents[i] || live).add(o));
    }
  }
};

(function () {
  let update = Renderer.prototype.update,
    render = Renderer.prototype.render,
    setShadows = Renderer.prototype.setShadows,
    setWorld = App.prototype.setWorld,
    build = Hud.prototype.build;
  Renderer.prototype.update = function (t, e, n) {
    let a = update.call(this, t, e, n),
      tn = this.thenNow;
    if (tn && tn.showing && tn.views) tn.update(this, t, e, n, a);
    return a;
  };
  Renderer.prototype.render = function () {
    let tn = this.thenNow;
    if (tn && tn.showing && tn.scene) tn.render(this, render);
    else render.call(this);
  };
  Renderer.prototype.setShadows = function (on) {
    setShadows.call(this, on);
    let tn = this.thenNow;
    if (tn && tn.scene) tn.scene.traverse((o) => o.material && (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => (m.needsUpdate = true)));
  };
  App.prototype.setWorld = function (w) {
    setWorld.call(this, w);
    this.thenNow && this.thenNow.worldChanged();
  };
  Hud.prototype.build = function () {
    build.apply(this, arguments);
    thenNowUI(this);
  };
})();

// The button (bottom right; above the happenings line on narrow screens) and the
// caption shown while it's held.
function thenNowUI(hud) {
  let app = hud.app,
    tn = app.thenNow || (app.thenNow = new ThenNow(app));
  app.renderer.thenNow = tn;
  if (!document.getElementById("thennow-css")) {
    let st = document.createElement("style");
    st.id = "thennow-css";
    st.textContent =
      ".thennow { position: absolute; right: max(10px, env(safe-area-inset-right)); bottom: calc(max(12px, env(safe-area-inset-bottom)) + 50px); touch-action: none; -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }" +
      "@media (min-width: 700px) { .thennow { bottom: max(12px, env(safe-area-inset-bottom)); } }" +
      "body.sheet-open .thennow { display: none; }" +
      "#hud > .thennow-cap { position: absolute; left: 50%; transform: translateX(-50%); top: calc(max(10px, env(safe-area-inset-top)) + 56px); white-space: nowrap; max-width: calc(100vw - 20px); overflow: hidden; text-overflow: ellipsis; pointer-events: none; font-size: 15px; }" +
      ".thennow-cap small { font-family: system-ui, sans-serif; color: var(--muted); font-size: 13px; margin-left: 8px; }";
    document.head.appendChild(st);
  }
  let label = "Then and now: hold to see the valley as it was on its first day",
    b = cs("button", "iconbtn thennow", qc.thennow),
    cap = cs("div", "chip thennow-cap hidden"),
    down = 0;
  b.title = label;
  b.setAttribute("aria-label", label);
  hud.root.append(b, cap);
  tn.btn = b;
  tn.cap = cap;
  b.addEventListener("pointerdown", (e) => {
    if (e.button > 0) return;
    e.preventDefault();
    try {
      b.setPointerCapture(e.pointerId);
    } catch {}
    down = e.timeStamp;
    tn.hold(true);
  });
  // (event times, not now: the first press may be busy building the first day)
  let up = (e) => {
    if (!tn.held) return;
    tn.hold(false);
    if (down && e.timeStamp - down < THENNOW.tapMs) hud.toast("Hold this to see the valley as it was on its first day.");
  };
  for (let ev of ["pointerup", "pointercancel", "lostpointercapture"]) b.addEventListener(ev, up);
  // a mouse resting on the button: get the first day ready before it's pressed
  b.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse" && !tn.ready() && !app.catching)
      setTimeout(() => {
        try {
          tn.build();
        } catch (er) {
          console.warn("then and now", er);
        }
      }, 60);
  });
  b.addEventListener("contextmenu", (e) => e.preventDefault());
  b.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) e.preventDefault(), (down = 0), tn.hold(true);
  });
  b.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") e.preventDefault(), tn.hold(false);
  });
  if (tn.keys) return;
  tn.keys = true;
  let typing = (e) => e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT");
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() !== THENNOW.key || e.repeat || e.ctrlKey || e.metaKey || e.altKey || typing(e)) return;
    tn.hold(true);
  });
  window.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === THENNOW.key) tn.hold(false);
  });
  window.addEventListener("blur", () => tn.hold(false));
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && tn.hold(false));
}

// For measuring and tests: the first day of the valley that's open.
if (window.__creekSound)
  window.__creekSound.dayOne = () => {
    let app = window.__creek,
      w = thenNowWorld(app.world);
    app.applyClock();
    return w;
  };
