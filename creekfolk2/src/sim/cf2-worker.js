// ==========================================================================
// Creekfolk 2: the simulation's own thread (a Web Worker).
//
// The worker owns the valley. It runs it live to the clock, replays any gap in full after
// the page has been closed (the same code, so a replay ends exactly where a live run
// would), saves it to IndexedDB, and sends the page what it needs to draw. The page never
// runs the simulation; it draws, and it asks.
//
// The clock (the brief's rules for a machine that never goes online):
//   - valley time is (now - world.calStart) / 1000 seconds, where now is the real clock
//     plus the player's correction (Settings) plus, in the dev build, the dev offset;
//   - if the clock goes back, the valley waits: what happened can't un-happen;
//   - if it jumps more than CLOCK_ASK_DAYS ahead, the worker asks before replaying it;
//     the player can replay it all, or say the clock was wrong, and the valley carries on
//     from where it was (world.calStart moves; the move is kept in world.clockLog).
//
// Messages from the page:   boot, new, clock, visible, pause, saveNow, getWorld, import,
//                            gapAnswer, trigger, snapshot, snapshots, restore
// Messages to the page:     ready, need, state, sync, catchup, caught, gap, waiting,
//                            world, saved, snapshots, refused, error
// ==========================================================================

var CLOCK_ASK_DAYS = 90; // a gap longer than this is asked about before it is replayed
var CATCHUP_MIN = 120; // seconds of valley time behind the clock that count as catching up
var SAVE_EVERY = 20e3; // ms between saves of "main" (and when the page hides)
var BACKUP_EVERY = 10 * 60e3; // ms between saves of "backup"
var SNAPSHOTS_KEEP = 10;

var CW = {
  world: null,
  db: null,
  dbName: null,
  dev: false,
  offset: 0, // ms added to the real clock (the player's correction, plus the dev offset)
  paused: false,
  visible: true,
  gap: null, // a long gap waiting for the player's answer
  catching: null, // { from, to, started } while replaying a gap
  events: [], // important log lines from a catch-up, for "while you were away"
  lastSave: 0,
  lastBackup: 0,
  timer: null,
  sent: { acts: new Map(), slow: new Map(), ent: new Map(), terrain: -1, grids: -1, creekT: -1, weather: "", logN: 0 },
};

function cwNow() {
  return Date.now() + CW.offset;
}
function cwTarget(w) {
  return (cwNow() - (w.calStart || 0)) / 1000;
}
function cwPost(m, transfer) {
  self.postMessage(m, transfer || []);
}

// ---- IndexedDB ----------------------------------------------------------

function cwOpenDb(name) {
  return new Promise((resolve) => {
    let req;
    try {
      req = indexedDB.open(name, 1);
    } catch (e) {
      return resolve(null);
    }
    req.onupgradeneeded = () => {
      req.result.createObjectStore("saves");
      req.result.createObjectStore("snapshots");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });
}
function cwDb(op, store, key, value) {
  let db = CW.db;
  if (!db) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    let tx = db.transaction(store, op === "get" || op === "keys" ? "readonly" : "readwrite"),
      os = tx.objectStore(store),
      r = op === "get" ? os.get(key) : op === "keys" ? os.getAllKeys() : op === "del" ? os.delete(key) : os.put(value, key);
    if (op === "get" || op === "keys") r.onsuccess = () => resolve(r.result ?? null);
    tx.oncomplete = () => op === "put" || op === "del" ? resolve(true) : null;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function cwSave(force) {
  let w = CW.world;
  if (!w || !CW.db) return;
  let now = Date.now();
  if (!force && now - CW.lastSave < SAVE_EVERY) return;
  CW.lastSave = now;
  let s = saveWorld(w);
  try {
    await cwDb("put", "saves", "main", s);
    if (now - CW.lastBackup > BACKUP_EVERY) {
      CW.lastBackup = now;
      await cwDb("put", "saves", "backup", s);
    }
    cwPost({ type: "saved", t: w.t, kb: Math.round(s.length / 1024) });
  } catch (e) {
    cwPost({ type: "error", message: "The valley couldn't be saved: " + String(e && e.message) });
  }
}

// A save from another build, or from Creekfolk 1, is refused in plain words.
function cwRefusal(o) {
  let b = o && o.build;
  if (typeof b === "string" && b.startsWith("cf2-")) return "This valley was made in an earlier version of Creekfolk 2 and can't be opened here.";
  return "This valley was made in Creekfolk 1, and Creekfolk 2 can't open it. It still opens in the Creekfolk 1 file it came from.";
}
function cwParse(text) {
  let o;
  try {
    o = typeof text === "string" ? JSON.parse(text) : text;
  } catch (e) {
    return { error: "That file isn't a Creekfolk valley." };
  }
  if (!o || o.version !== 2 || o.build !== BUILD_VERSION) return { error: cwRefusal(o) };
  try {
    return { world: loadWorld(o) };
  } catch (e) {
    return { error: "That valley couldn't be opened: " + String(e && e.message) };
  }
}

// ---- what the page draws --------------------------------------------------

// A creekfolk as the page needs it: who it is and how it looks change rarely ("slow");
// what it's doing (its action, with the path it walks) changes every few seconds.
function cwSlow(w, c) {
  return {
    id: c.id,
    name: c.name,
    look: c.look ? looksOf(w, c) : c.look, // 3C's looks, filled in (they are only ever filled from the seed and the id)
    wear: c.look ? looksWorn(w, c) : null, // what they wear for what they love (grown-ups)
    born: c.born,
    lifespan: c.lifespan,
    stage: c.stage,
    gen: c.gen,
    parents: c.parents,
    partner: c.partner,
    founder: !!c.founder,
    visitor: !!c.visitor,
    away: !!c.away,
    home: c.home,
    carry: c.carry ? { k: c.carry.k, n: c.carry.n } : null,
    asleep: !!c.asleep,
    emote: c.emote || null,
    beyond: !!(c.beliefs && c.beliefs.beyond),
    line: cwLine(w, c),
  };
}
// The two family lines a creekfolk comes from: the first parent's first parent's ... back to
// a founder or a traveler, and the same up the second parent's side (from the lineage, so
// lines outlive the ones who started them; a record keeps its line in `line` before older
// records are let go, cf2-balance.js). The page dresses families by them.
var CW_LINES = new Map();
// The valley as it was on its first morning, made again from its seed (newValley is
// deterministic), for "then and now". Only the land, the creek and what grew there: none of
// the eight, who are shown where they are now.
function cwThenWorld(w) {
  let v = newValley(w.seed, { calStart: w.calStart, tzMin: w.tzMin });
  runUntil(v, 1200);
  let same = JSON.stringify(v.creek.init) === JSON.stringify(w.creek.init);
  v.creatures = [];
  v.byId = {};
  for (let s of v.structures) v.byId[s.id] = s;
  return same ? v : null;
}

// The chronicle's days since a catch-up began (and the day before, for what changed).
function cwChronicle(w, from) {
  let C = w.chronicle;
  if (!C) return null;
  let d0 = Math.floor(from / 86400),
    days = C.days.filter((e) => e.d >= d0 - 1).slice(-41);
  if (C.cur) days.push({ ...C.cur, today: true });
  return days;
}

function cwLine(w, c) {
  let got = CW_LINES.get(c.id);
  if (got) return got;
  let L = w.lineage || {},
    root = (id) => {
      for (let n = 0; n < 400; n++) {
        let r = L[id],
          p = r && r.parents && r.parents[0];
        if (r && r.line != null) return r.line;
        if (p == null || !L[p]) return id;
        id = p;
      }
      return id;
    },
    ps = c.parents || [],
    a = ps.length ? root(ps[0]) : c.id,
    b = ps.length > 1 ? root(ps[1]) : a,
    out = [a, b];
  if (ps.length === 0 || L[ps[0]]) CW_LINES.set(c.id, out);
  return out;
}
function cwAct(c) {
  let a = c.act;
  if (!a) return { x: c.x, z: c.z, face: c.face };
  let o = { type: a.type, step: a.step, t0: a.t0, t1: a.t1, x: a.x, z: a.z, face: c.face };
  if (a.path) o.path = a.path;
  if (a.with != null) o.with = a.with;
  if (a.target != null) o.target = a.target;
  if (a.sid != null) o.sid = a.sid;
  if (a.wade) o.wade = a.wade;
  return o;
}
var CW_ENT_KEYS = ["structures", "res", "items", "pods"];

// Send what changed since the last message. full: everything (a new page, a catch-up);
// heavy: also look over the structures, plants, materials and slow-changing creekfolk
// details (twice a second; actions and the creek go every time).
// alt: describe another world (the valley as it was on day one) into a message of type
// alt.type, with its own record of what was sent, and return it instead of posting.
function cwSendState(full, heavy = true, alt = null) {
  let w = alt ? alt.world : CW.world,
    S = alt ? alt.sent : CW.sent;
  if (!w) return;
  let m = { type: full ? "sync" : "state", t: w.t, now: cwNow(), weather: null, acts: [], slow: [], gone: [], ent: {}, entGone: {} };
  if (full) {
    S.acts.clear();
    S.slow.clear();
    S.ent.clear();
    S.terrain = -1;
    S.grids = -1;
    S.creekT = -1;
    S.weather = "";
    S.fauna = "";
    S.beavers = S.groveLogs = S.skycal = S.fishRun = S.carvings = "";
    m.seed = w.seed;
    m.calStart = w.calStart;
    m.tzMin = w.tzMin;
    m.cycle = w.cycle;
    m.meadow = w.meadow;
  }
  let alive = new Set();
  for (let c of w.creatures) {
    alive.add(c.id);
    if (S.acts.get(c.id) !== c.act || full) S.acts.set(c.id, c.act), m.acts.push([c.id, cwAct(c)]);
    if (!heavy && S.slow.has(c.id)) continue;
    let s = JSON.stringify(cwSlow(w, c));
    if (S.slow.get(c.id) !== s) S.slow.set(c.id, s), m.slow.push(s);
  }
  for (let id of [...S.slow.keys()]) if (!alive.has(id)) S.slow.delete(id), S.acts.delete(id), m.gone.push(id);
  for (let k of heavy ? CW_ENT_KEYS : []) {
    let seen = S.ent.get(k) || new Map(),
      now = new Set(),
      ch = [];
    for (let e of w[k] || []) {
      now.add(e.id);
      let s = JSON.stringify(e);
      if (seen.get(e.id) !== s) seen.set(e.id, s), ch.push(s);
    }
    let gone = [];
    for (let id of [...seen.keys()]) if (!now.has(id)) seen.delete(id), gone.push(id);
    S.ent.set(k, seen);
    if (ch.length) m.ent[k] = ch;
    if (gone.length) m.entGone[k] = gone;
  }
  let wx = JSON.stringify(w.weather);
  if (wx !== S.weather) (S.weather = wx), (m.weather = w.weather);
  if (heavy && w.fauna) {
    let f = JSON.stringify(w.fauna);
    if (f !== S.fauna) (S.fauna = f), (m.fauna = w.fauna);
  }
  // 3C's: the beavers (their lodge, where they swim, their little side dams), the grove's
  // fallen trees, the sky stones, the glowing fish run
  if (heavy) {
    let x = {
      beavers: w.beavers || null,
      groveLogs: (w.grove && w.grove.logs) || null,
      skycal: w.skycal || null,
      fishRun: (w.returning && w.returning.active) || null,
      // carvings in sand, clay and stone: where, what in, how worn, how far cut
      carvings: (w.carvings || []).filter((k) => !k.gone).map((k) => [k.id, k.mat, k.x, k.z, Math.round(k.wear * 10) / 10, Math.round(k.done * 10) / 10]),
    };
    for (let k in x) {
      let j = JSON.stringify(x[k]);
      if (j !== S[k]) (S[k] = j), (m[k] = x[k]);
    }
  }
  // the ground and the creek's shape: after a flood, a dam, or plants changing the banks
  let cr = w.creek,
    transfer = [];
  if (w.terrain.version !== S.terrain) {
    S.terrain = w.terrain.version;
    m.creek = { nodes: cr.nodes, chan: cr.chan.slice(), dams: cr.dams };
    transfer.push(m.creek.chan.buffer);
  }
  // water: the creek's levels and the cells' water table, green and marsh (every ten minutes)
  let hk = Math.floor(w.t / CREEK_HYDRO_DT);
  if (hk !== S.grids) {
    S.grids = hk;
    m.water = {
      levels: cr.nodes.map((n) => [n.wl, n.q, n.g]),
      ponds: cr._pondNow ? Array.from(cr._pondNow) : null,
      br: cr.br,
      dams: cr.dams,
      soil: cr.soil,
      wetNow: cr.wetNow,
      wt: w.wt.slice(),
      green: w.green.slice(),
      wet: w.wet.slice(),
      wear: w.wear.slice(),
      flood: cr.flood,
    };
    transfer.push(m.water.wt.buffer, m.water.green.buffer, m.water.wet.buffer, m.water.wear.buffer);
  }
  if (alt) return (m.type = alt.type), m;
  if (w.log.length && w.log[w.log.length - 1] !== S.lastLog) {
    let i = w.log.length - 1;
    while (i >= 0 && w.log[i] !== S.lastLog) i--;
    m.log = w.log.slice(i + 1).slice(-30);
    S.lastLog = w.log[w.log.length - 1];
  }
  cwPost(m, transfer);
}

// ---- running ------------------------------------------------------------

function cwLoop() {
  clearTimeout(CW.timer);
  let w = CW.world,
    wait = 50;
  try {
    if (w && !CW.paused && !CW.gap) {
      let to = cwTarget(w);
      if (to < w.t - 1) {
        // the clock has gone back: the valley waits for it
        if (!CW.waiting) cwPost({ type: "waiting", t: w.t, behind: w.t - to }), (CW.waiting = true);
        wait = 1000;
      } else {
        if (CW.waiting) (CW.waiting = false), cwPost({ type: "waiting", t: w.t, behind: 0 });
        let behind = to - w.t;
        if (!CW.catching && behind > CLOCK_ASK_DAYS * 86400 && !CW.jumping) {
          CW.gap = { from: w.t, to, days: behind / 86400 };
          cwPost({ type: "gap", ...CW.gap });
          return;
        }
        if (!CW.catching && behind > CATCHUP_MIN) {
          CW.catching = { from: w.t, to, started: Date.now(), lastSave: Date.now() };
          CW.events = [];
          w.onLog = (e) => {
            if (e.imp < 2) return;
            CW.events.push(e);
            if (CW.events.length > 400) CW.events.splice(CW.events.findIndex((x) => x.imp < 3) >>> 0, 1);
          };
          cwPost({ type: "catchup", from: w.t, to, t: w.t });
        }
        if (CW.catching) {
          // replay in slices of about a quarter of a second, so the page hears how it's going
          let now = () => performance.now(),
            done = runUntil(w, to, now() + 250, now);
          CW.catching.to = to;
          cwPost({ type: "catchup", from: CW.catching.from, to, t: w.t, ms: Date.now() - CW.catching.started });
          if (Date.now() - CW.catching.lastSave > 60e3) (CW.catching.lastSave = Date.now()), cwSave(true);
          if (done || cwTarget(w) - w.t < 1) {
            let c = CW.catching;
            CW.catching = null;
            CW.jumping = false;
            w.onLog = null;
            cwPost({ type: "caught", from: c.from, to: w.t, ms: Date.now() - c.started, events: CW.events.splice(0), chron: cwChronicle(w, c.from) });
            cwSave(true);
            cwSendState(true);
          }
          wait = 0;
        } else {
          runUntil(w, to);
          let heavy = Date.now() - (CW.lastHeavy || 0) > 500;
          if (heavy) CW.lastHeavy = Date.now();
          if (CW.visible) cwSendState(false, heavy);
          cwSave(false);
        }
      }
    }
  } catch (e) {
    cwPost({ type: "error", message: String((e && e.stack) || e) });
    wait = 2000;
  }
  CW.timer = setTimeout(cwLoop, wait);
}

function cwStart(w) {
  CW.world = w;
  CW_LINES.clear();
  w.onLog = null;
  CW.gap = null;
  CW.catching = null;
  cwPost({ type: "ready", seed: w.seed, t: w.t, calStart: w.calStart, build: BUILD_VERSION });
  cwSendState(true);
  cwLoop();
}

// ---- messages -------------------------------------------------------------

self.onmessage = async (ev) => {
  let m = ev.data || {},
    w = CW.world;
  try {
    if (m.type === "boot") {
      CW.dev = !!m.dev;
      CW.offset = m.offset || 0;
      CW.dbName = m.db;
      CW.db = await cwOpenDb(m.db);
      if (!CW.db) cwPost({ type: "error", message: "This browser won't keep the valley (IndexedDB isn't available), so it will start again each time." });
      let text = (await cwDb("get", "saves", "main")) || (await cwDb("get", "saves", "backup"));
      if (text) {
        let r = cwParse(text);
        if (r.world) return cwStart(r.world);
        cwPost({ type: "refused", message: r.error, where: "saved" });
      }
      cwPost({ type: "need" }); // no valley yet: the page makes one
    } else if (m.type === "then" && w) {
      let tw = cwThenWorld(w),
        msg = tw ? cwSendState(true, true, { world: tw, type: "then", sent: { acts: new Map(), slow: new Map(), ent: new Map(), terrain: -1, grids: -1, creekT: -1, weather: "", logN: 0 } }) : { type: "then", none: true };
      msg.id = m.id;
      cwPost(msg);
    } else if (m.type === "new") {
      let v = newValley(m.seed, { calStart: m.calStart, tzMin: m.tzMin });
      CW.lastSave = 0;
      cwStart(v);
      cwSave(true);
    } else if (m.type === "clock") {
      // a new correction to the clock; jump: a dev jump, replayed without asking
      CW.offset = m.offset || 0;
      if (m.jump) CW.jumping = true;
      cwLoop();
    } else if (m.type === "visible") {
      CW.visible = !!m.on;
      if (CW.visible && w && !CW.catching) cwSendState(true);
      if (!CW.visible) cwSave(true);
      cwLoop();
    } else if (m.type === "pause") {
      // the dev build's pause: the valley's clock stops. The page takes the time spent
      // paused off its dev offset when it unpauses, so none of it is replayed.
      CW.paused = !!m.on;
      if (m.offset != null) CW.offset = m.offset;
      cwLoop();
    } else if (m.type === "saveNow") {
      await cwSave(true);
    } else if (m.type === "getWorld") {
      cwPost({ type: "world", id: m.id, save: w ? saveWorld(w) : null });
    } else if (m.type === "import") {
      let r = cwParse(m.text);
      if (!r.world) return cwPost({ type: "refused", message: r.error, where: "import" });
      cwStart(r.world);
      await cwSave(true);
    } else if (m.type === "gapAnswer" && w && CW.gap) {
      let g = CW.gap;
      if (m.choice === "wrong") {
        // the clock was wrong: the valley carries on from where it was
        let shift = Math.round((g.to - g.from) * 1000);
        w.calStart = (w.calStart || 0) + shift;
        (w.clockLog = w.clockLog || []).push({ t: Math.round(w.t), shiftMs: shift, at: cwNow() });
        if (w.clockLog.length > 50) w.clockLog.shift();
      }
      CW.gap = null;
      cwSendState(true);
      cwLoop();
    } else if (m.type === "trigger" && w && CW.dev) {
      devTrigger(w, m.what);
      cwSendState(false);
    } else if (m.type === "snapshot" && w && CW.dev) {
      let key = `${Date.now()}|${m.label || ""}`;
      await cwDb("put", "snapshots", key, saveWorld(w));
      let keys = ((await cwDb("keys", "snapshots")) || []).sort();
      while (keys.length > SNAPSHOTS_KEEP) await cwDb("del", "snapshots", keys.shift());
      cwPost({ type: "snapshots", keys, id: m.id });
    } else if (m.type === "snapshots") {
      cwPost({ type: "snapshots", keys: ((await cwDb("keys", "snapshots")) || []).sort(), id: m.id });
    } else if (m.type === "restore" && CW.dev) {
      let text = await cwDb("get", "snapshots", m.key),
        r = text ? cwParse(text) : { error: "That snapshot is gone." };
      if (!r.world) return cwPost({ type: "refused", message: r.error, where: "restore" });
      cwStart(r.world);
      await cwSave(true);
    }
  } catch (e) {
    cwPost({ type: "error", message: String((e && e.stack) || e) });
  }
};
