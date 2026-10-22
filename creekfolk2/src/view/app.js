// ==========================================================================
// The app: starts the simulation's worker, keeps the page's copy of the valley, and runs
// the drawing loop. The renderer and the interface hang off it.
// ==========================================================================

var App = class {
  constructor() {
    this.vw = new VWorld();
    this.worker = null;
    this.renderer = null;
    this.hud = null;
    this.catching = null;
    this.asks = new Map(); // replies the page is waiting for: id -> resolve
    this.askN = 0;
    this.lastFrame = performance.now();
    this.paused = false;
  }
  start() {
    let src = document.getElementById("sim-src");
    this.worker = new Worker(URL.createObjectURL(new Blob([src.textContent], { type: "text/javascript" })));
    this.worker.onmessage = (e) => this.onMessage(e.data);
    this.worker.onerror = (e) => this.hud && this.hud.error("The valley stopped: " + (e.message || "an error in the simulation"));
    this.hud = new Hud(this);
    this.renderer = makeRenderer(this, document.getElementById("view"));
    this.renderer.onCreekTap = (z) => this.hud.openBank(z);
    this.renderer.onPlace = (food, x, z) => this.hud.placeFood(food, x, z);
    document.getElementById("bThen").hidden = !this.renderer.setThen; // then and now needs the 3D view
    this.dev = new DevMenu(this);
    this.post({ type: "boot", db: VALLEY_DB, dev: DEV_BUILD, offset: Clock.offset() });
    document.addEventListener("visibilitychange", () => {
      let on = document.visibilityState === "visible";
      this.post({ type: "visible", on });
      if (on) this.hud.welcomeBack();
    });
    window.addEventListener("pagehide", () => this.post({ type: "saveNow" }));
    let loop = () => {
      requestAnimationFrame(loop);
      let now = performance.now(),
        dt = Math.min(0.1, (now - this.lastFrame) / 1000);
      this.lastFrame = now;
      if (!this.vw.ready) return;
      let t = this.paused ? this.vw.t : this.vw.tNow();
      if (this.renderer) this.renderer.frame(t, dt);
      this.hud.tick(t);
    };
    requestAnimationFrame(loop);
  }
  post(m, transfer) {
    this.worker.postMessage(m, transfer || []);
  }
  // Ask the worker something and wait for its answer (a copy of the valley, the snapshots).
  ask(m, replyType) {
    let id = ++this.askN;
    return new Promise((resolve) => {
      this.asks.set(id, { resolve, type: replyType });
      this.post({ ...m, id });
    });
  }
  // A full copy of the valley, loaded with the simulation's own code (read only: for the
  // mind reader and the village sheet).
  async worldCopy() {
    let r = await this.ask({ type: "getWorld" }, "world");
    return r && r.save ? loadWorld(r.save) : null;
  }
  setClock(jump) {
    this.post({ type: "clock", offset: Clock.offset(), jump: !!jump });
  }
  onMessage(m) {
    if (m.id && this.asks.has(m.id)) {
      let a = this.asks.get(m.id);
      this.asks.delete(m.id);
      a.resolve(m);
      if (m.type === "world") return;
    }
    let H = this.hud;
    switch (m.type) {
      case "need":
        H.showStart();
        break;
      case "ready":
        H.hideStart();
        break;
      case "sync":
        this.vw.sync(m);
        if (this.renderer) this.renderer.onSync();
        if (!this.waved) (this.waved = true), setTimeout(() => H.waveHello(), 3000); // the page has just opened
        H.onLog(m.log || []);
        break;
      case "state":
        if (!this.vw.ready) break;
        this.vw.apply(m);
        H.onLog(m.log || []);
        break;
      case "catchup":
        this.catching = m;
        H.catchup(m);
        break;
      case "caught":
        this.catching = null;
        H.caught(m);
        this.dev.caught(m);
        break;
      case "gap":
        H.gap(m);
        break;
      case "waiting":
        H.waiting(m);
        break;
      case "refused":
        H.refused(m);
        break;
      case "snapshots":
        this.dev.snapshots(m.keys);
        break;
      case "saved":
        H.saved(m);
        break;
      case "error":
        H.error(m.message);
        break;
    }
  }
  newValley() {
    let seed = Array.from(crypto.getRandomValues(new Uint32Array(2)), (x) => x.toString(36)).join("");
    this.post({ type: "new", seed, calStart: devNow(), tzMin: new Date().getTimezoneOffset() });
  }
};
