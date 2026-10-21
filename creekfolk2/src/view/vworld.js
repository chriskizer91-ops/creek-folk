// ==========================================================================
// The page's copy of the valley: what the worker has said about it, enough to draw it.
//
// The worker owns the real valley (src/sim/cf2-worker.js). It sends each creekfolk's
// action with the path it is walking (so the page can move it smoothly between messages),
// the structures, plants and materials when they change, the creek's shape after each
// change (the page rebuilds the same ground from the same seed with the same code), and
// the water every ten minutes. Panels that need a whole mind ask for a full copy.
// ==========================================================================

var VWorld = class {
  constructor() {
    this.ready = false;
    this.seed = null;
    this.T = null; // the Terrain, built here from the seed, kept in step with the creek
    this.cs = new Map(); // creekfolk: id -> { ...slow, act }
    this.ent = { structures: new Map(), res: new Map(), items: new Map(), pods: new Map() };
    this.entV = 0; // bumps when any structure, plant or material changes
    this.creekV = 0; // bumps when the creek's shape changes
    this.waterV = 0; // bumps when the water changes
    this.nodes = null;
    this.dams = {};
    this.grids = null; // { wt, green, wet, wear }
    this.br = null;
    this.weather = { state: "clear", rain: 0 };
    this.fauna = null;
    this.log = [];
    this.t = 0; // the worker's valley time at its last message
    this.cycle = null;
    this.calStart = 0;
    this.tzMin = 0;
  }
  // A full description (a new page, a reload, the end of a catch-up).
  sync(m) {
    if (!this.T || this.seed !== m.seed) {
      this.seed = m.seed;
      this.T = new Terrain(String(m.seed));
    }
    this.cs.clear();
    for (let k in this.ent) this.ent[k].clear();
    this.calStart = m.calStart;
    this.tzMin = m.tzMin;
    this.cycle = m.cycle;
    this.meadow = m.meadow;
    setDayCycle(m.cycle);
    this.apply(m);
    this.ready = true;
  }
  apply(m) {
    this.t = m.t;
    for (let s of m.slow) {
      let o = JSON.parse(s),
        c = this.cs.get(o.id);
      this.cs.set(o.id, c ? Object.assign(c, o) : { ...o, act: null });
    }
    for (let [id, a] of m.acts) {
      let c = this.cs.get(id);
      if (!c) this.cs.set(id, (c = { id, act: null }));
      c.act = a;
    }
    for (let id of m.gone) this.cs.delete(id);
    let changed = false;
    for (let k in m.ent) {
      let M = this.ent[k];
      for (let s of m.ent[k]) {
        let o = JSON.parse(s);
        M.set(o.id, o);
      }
      changed = true;
    }
    for (let k in m.entGone) {
      for (let id of m.entGone[k]) this.ent[k].delete(id);
      changed = true;
    }
    if (changed) this.entV++;
    if (m.weather) this.weather = m.weather;
    if (m.fauna) this.fauna = m.fauna;
    for (let k of ["beavers", "groveLogs", "skycal", "fishRun", "carvings"]) if (k in m) (this[k] = m[k]), this.entV++;
    if (m.creek) {
      this.nodes = m.creek.nodes;
      this.dams = m.creek.dams;
      this.chan = m.creek.chan;
      this.T.setCreek({ nodes: this.nodes, chan: this.chan });
      this.creekV++;
    }
    if (m.water) {
      let W = m.water;
      if (this.nodes)
        W.levels.forEach((l, i) => {
          let n = this.nodes[i];
          if (n) (n.wl = l[0]), (n.q = l[1]), (n.g = l[2]);
        });
      this.ponds = W.ponds;
      this.br = W.br;
      if (W.dams) this.dams = W.dams;
      this.soil = W.soil;
      this.wetNow = W.wetNow;
      this.flood = W.flood;
      this.grids = { wt: W.wt, green: W.green, wet: W.wet, wear: W.wear };
      this.waterV++;
    }
    if (m.log) {
      for (let e of m.log) this.log.push(e);
      if (this.log.length > 200) this.log.splice(0, this.log.length - 200);
    }
  }
  // The valley's time to draw: the clock, held close to where the worker has got to.
  tNow() {
    let target = (devNow() - (this.calStart || 0)) / 1000;
    return clamp(target, this.t - 1, this.t + 1);
  }
  // Where a creekfolk is at time t (walking along its path, or standing).
  posOf(c, t) {
    let a = c.act;
    if (!a) return { x: c.x || 0, z: c.z || 0 };
    return positionAt({ act: a, x: a.x, z: a.z }, t);
  }
  creature(id) {
    return this.cs.get(id) || null;
  }
  list(kind) {
    return this.ent[kind];
  }
  // The season now ("spring" .. "winter"), for the drawing.
  get season() {
    return this.cycle ? seasonAt(this.w).name : "spring";
  }
  // What the sim's calendar functions need from a world.
  get w() {
    return { cycle: this.cycle, calStart: this.calStart, tzMin: this.tzMin, t: this.tNow() };
  }
};
