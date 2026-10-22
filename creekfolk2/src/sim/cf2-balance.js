// ==========================================================================
// Creekfolk 2: the living balance keeps its size.
//
// After the founders' month the valley runs forever, so everything it keeps has to stop
// growing (the brief: "the equilibrium running indefinitely with bounded memory and save
// size"). Most of Creekfolk 1's records are already capped: memories (48 a creekfolk), the
// stories they hold (24), the log (500), the history (400), the timeline (1440 hours), the
// population log (1600), the chronicle (400 days), carvings (90), legends (24), the grove (240
// standing trees, 24 logs), the mud in the bank (48 bands a point), the driest points (60
// years), the beavers (6) and their side dams. What grew with every creekfolk who ever lived,
// and is let go here, keeping what it means:
//   - the lineage (`w.lineage`, about one record a day). A record stays while anything still
//     needs it: the one it belongs to is alive or visiting; they were one of the eight; they
//     passed or left in the last `goneDays`; a living creekfolk descends from them within three
//     generations (the stories' "their great-grandmother"), is their child or partner, was named
//     for them, remembers them, still feels for them, or heard a story from them; their tree
//     stands in the grove or lies there as a log (its kind follows the family); they are still
//     alive downstream and may visit; the history names them. Before anything is let go, each
//     record keeps the family line it belongs to (`line`: the first-parent line back to a
//     founder or a traveler), which the page dresses families by (cwLine in cf2-worker.js).
//     A record kept long after its creekfolk has gone is folded to what is still read of it
//     (name, birth, parents, generation, line, when they passed or left, their tree): their
//     children, partner, age and how they left are in the other records or follow from these.
//   - ties to those long gone (`c.rel`). A creekfolk keeps a tie to someone who passed or left
//     for `relDays`, a weak one (warmth not above `relWarm`) for `relWeakDays`; ties to someone
//     still alive downstream are kept while they may visit.
//   - who did the work on each structure (`s.contribAll`): the shares of those gone for
//     `goneDays` are folded into one number (`s.contribPast`).
//   - close friendships and feuds already noted (`w.mile.pairs`): a pair is let go once one of
//     the two can no longer come back.
//   - the departed (`w.downstream`): once someone downstream has lived out their span they can
//     no longer visit, and their entry goes (Creekfolk 1 kept 400, each with a mind's snapshot).
//   - myths (`w.myths`) of stories nobody holds any more.
//   - places named for a passing ("Bix's Rest"). A rest is let go once no one living was alive
//     when it was named, no story anyone holds or any standing carving tells of it, and it was
//     not one of the eight's: its name falls out of use (the word leaves everyone's speech).
//     Without this the names (and the words for them, talked about in every chat) grow by a
//     few a month for good.
//   - what each creekfolk has seen (`c.seen`) leaves out the grove's trees (an edit in place in
//     core.js's lookAround, marked CF2). Creekfolk 1 notes every resource in sight there, grove
//     trees too, but only food, materials and the like are ever looked up again; the grove grows
//     to about 240 trees over months, which would add as many entries to every mind and make
//     every look around (a fifth of the simulation's time) slower as the valley ages.
//   - a visitor's mind is its own copy of the record of how it left (a wrapper of visits, near
//     the end of this file; a determinism fix more than a size one).
//   - Creekfolk 1's two graphs, which nothing in Creekfolk 2 reads or draws (`w.timeline`,
//     hourly; `w.popLog`, every six hours), keep `timelineDays` and `popLogDays` (Creekfolk 1:
//     60 and 400 days, so they filled up only after the founders' month).
// Still growing after the founders' month, bounded where they are (nothing here changes them):
// the bands in the creek's bank (48 a point; the floor's bands fill up over months), the
// chronicle (a page a day, 400 days; the Chronicle tab shows the last 60), the grove (trees
// stand 180 to 240 days, so it fills up over about eight months, and with it the lineage
// records of those who rest there) and the Telling Stones (up to 90 carvings).
// Runs from a wrapper of lifeTick (life.js) every `every` seconds of valley time; no random
// numbers, so a replay and a live run let go of exactly the same things. `w.balance` counts
// what was let go. See docs/MERGE.md.
// ==========================================================================

var BALANCE = {
  every: 6 * 3600, // seconds between passes
  goneDays: 30, // records and work shares of the gone are kept at least this many days
  relDays: 40, // a tie to someone gone this long is let go ...
  relWeakDays: 6, // ... a weak one sooner
  relWarm: 0.4, // a tie at or below this warmth is weak (Creekfolk 1 names a child for a loved one above 0.4)
  timelineDays: 30, // Creekfolk 1's hourly timeline, kept this many days (Creekfolk 1: 60)
  popLogDays: 30, // Creekfolk 1's population log, kept this many days (Creekfolk 1: 400)
};

function balanceOf(w) {
  return (w.balance = w.balance || { t: 0, runs: 0, lineage: 0, folded: 0, rel: 0, contrib: 0, pairs: 0, downstream: 0, myths: 0, places: 0 });
}

var cf2BalanceLifeTick = lifeTick;
lifeTick = function (w) {
  cf2BalanceLifeTick(w);
  let B = balanceOf(w);
  if (w.t - B.t >= BALANCE.every) {
    B.t = Math.round(w.t);
    B.runs++;
    balanceWorld(w);
  }
};

function balanceWorld(w) {
  let D = 86400,
    L = (w.lineage = w.lineage || {}),
    now = w.t,
    gone = (id) => {
      let r = L[id];
      return r ? (r.died ?? r.left ?? null) : null;
    },
    // still alive downstream (they may come back to visit)
    away = new Set();
  for (let d of w.downstream || []) if (d.snap && d.snap.born + d.snap.lifespan > now) away.add(d.id);
  // someone who could still be met: alive here, visiting, or alive downstream
  let reachable = (id) => !!w.byId[id] || away.has(+id);

  balanceRelations(w, L, now, D, gone, reachable);
  balanceLineage(w, L, now, D, away);
  balanceWork(w, L, now, D, reachable);
  // close friendships and feuds already noted, of pairs who can no longer meet
  let P = w.mile && w.mile.pairs;
  if (P)
    for (let k in P) {
      let [a, b] = k.split("-");
      if (!reachable(a) || !reachable(b)) delete P[k], balanceOf(w).pairs++;
    }
  // the departed who have lived out their span downstream
  if (w.downstream) {
    let n = w.downstream.length;
    w.downstream = w.downstream.filter((d) => (d.snap ? d.snap.born + d.snap.lifespan > now : now - d.t < BALANCE.goneDays * D));
    balanceOf(w).downstream += n - w.downstream.length;
  }
  // myths of stories that are gone
  if (w.myths) for (let k in w.myths) if (!w.stories || !w.stories[k]) delete w.myths[k], balanceOf(w).myths++;
  balancePlaces(w, L, now);
  // Creekfolk 1's graphs, which nothing in Creekfolk 2 draws: the hourly timeline (levels built,
  // mood; Creekfolk 1 keeps 60 days) and the population every six hours (Creekfolk 1: 400 days)
  if (w.timeline && w.timeline.length > BALANCE.timelineDays * 24) w.timeline.splice(0, w.timeline.length - BALANCE.timelineDays * 24);
  if (w.popLog && w.popLog.length > BALANCE.popLogDays * 4) w.popLog.splice(0, w.popLog.length - BALANCE.popLogDays * 4);
}

// Ties to those long gone.
function balanceRelations(w, L, now, D, gone, reachable) {
  let B = balanceOf(w);
  for (let c of w.creatures) {
    if (c.visitor) continue;
    for (let id in c.rel) {
      if (reachable(id)) continue;
      let g = gone(id),
        days = g == null ? 1e9 : (now - g) / D;
      if (days > BALANCE.relDays || (days > BALANCE.relWeakDays && !(c.rel[id].warmth > BALANCE.relWarm))) delete c.rel[id], B.rel++;
    }
  }
}

// The family line a record belongs to: the first parent's first parent ... back to someone with
// no parents in the record (a founder or a traveler). Cached on every record (`line`), so lines
// outlive the records between.
function balanceLine(L, id) {
  let chain = [],
    cur = id,
    root = id;
  for (let n = 0; n < 2000; n++) {
    let r = L[cur];
    if (!r) {
      root = cur;
      break;
    }
    if (r.line != null) {
      root = r.line;
      break;
    }
    chain.push(r);
    let p = r.parents && r.parents[0];
    if (p == null || !L[p]) {
      root = cur;
      break;
    }
    cur = p;
  }
  for (let r of chain) r.line = root;
  return root;
}

function balanceLineage(w, L, now, D, away) {
  for (let id in L) if (L[id].line == null) balanceLine(L, +id);
  let keep = new Set(),
    add = (id) => {
      if (id != null && L[id]) keep.add(+id);
    },
    up = (id, depth) => {
      let r = L[id];
      if (!r || depth <= 0) return;
      keep.add(+id);
      for (let p of r.parents || []) up(p, depth - 1);
    };
  for (let c of w.creatures) {
    add(c.id);
    for (let p of c.parents || []) up(p, 3);
    for (let k of c.children || []) add(k);
    add(c.partner);
    add(c.honors);
    for (let id in c.rel || {}) add(id);
    for (let m of c.mem || []) add(m.who);
    for (let k in c.lore || {}) add(c.lore[k].from);
  }
  for (let id in L) {
    let r = L[id],
      g = r.died ?? r.left ?? null;
    if (r.founder || g == null || now - g < BALANCE.goneDays * D) keep.add(+id);
  }
  for (let id of away) add(id);
  for (let t of w.res) if (t.kind === "grove") add(t.who), add(t.kin);
  let G = w.grove;
  if (G) {
    for (let l of G.logs || []) add(l.who);
    for (let id of G.founders || []) add(id);
  }
  for (let list of [w.hist, w.log]) for (let e of list || []) for (let id of e.who || []) add(id);
  if (w.lastFounder) add(w.lastFounder.id);
  let n = 0;
  for (let id in L) {
    if (!keep.has(+id)) {
      delete L[id], n++;
      continue;
    }
    // kept long after they've gone (for the grove, or as someone's ancestor): only what is
    // read of them stays; their children and partner are in the others' records, their age
    // and how they left in when they were born, passed or left
    let r = L[id],
      g = r.died ?? r.left ?? null;
    if (g != null && now - g >= BALANCE.goneDays * D && r.children) {
      delete r.children, delete r.partner, delete r.how, delete r.age;
      balanceOf(w).folded = (balanceOf(w).folded || 0) + 1;
    }
  }
  balanceOf(w).lineage += n;
}

// Who did the work: the shares of those gone for a while, folded into one number.
function balanceWork(w, L, now, D, reachable) {
  let B = balanceOf(w);
  for (let s of w.structures) {
    let A = s.contribAll;
    if (!A) continue;
    for (let id in A) {
      if (reachable(id)) continue;
      let r = L[id],
        g = r ? r.died ?? r.left ?? null : null;
      if (g != null && now - g < BALANCE.goneDays * D) continue;
      s.contribPast = +((s.contribPast || 0) + A[id]).toFixed(1);
      delete A[id];
      B.contrib++;
    }
  }
}

// Places named for a passing whose names have fallen out of use.
function balancePlaces(w, L, now) {
  let P = w.placeNames;
  if (!P || !P.length) return;
  let founders = new Set(),
    oldest = Infinity;
  for (let id in L) if (L[id].founder) founders.add(L[id].name + "'s Rest");
  for (let c of w.creatures) if (!c.visitor) oldest = Math.min(oldest, c.born ?? 0);
  let told = new Set();
  for (let c of w.creatures) for (let k in c.lore || {}) if (c.lore[k].v && c.lore[k].v.where) told.add(c.lore[k].v.where);
  for (let k in w.stories || {}) if (w.stories[k].truth && w.stories[k].truth.where) told.add(w.stories[k].truth.where);
  let carved = (w.carvings || []).filter((k) => !k.gone).map((k) => k.text || "");
  let drop = new Set();
  for (let p of P) {
    if (p.kind !== "rest" || founders.has(p.name)) continue;
    if (oldest <= p.t || told.has(p.name) || carved.some((t) => t.includes(p.name))) continue;
    drop.add(p.id);
  }
  if (!drop.size) return;
  w.placeNames = P.filter((p) => !drop.has(p.id));
  for (let id of drop) {
    let k = "place:" + id;
    for (let c of w.creatures) if (c.lex) delete c.lex[k];
    if (w.mile && w.mile.words) delete w.mile.words[k];
  }
  balanceOf(w).places += drop.size;
}

// A visitor from downstream gets its own copy of the mind it left with. Creekfolk 1's visits
// (minds.js) hands the visitor the very objects kept in `w.downstream` (its words, ties, looks,
// temperament, family), so while the visitor is here everything it learns changes the record of
// how it left; a save and reload separates the two, and the valley then goes on differently
// from one that wasn't reloaded (found by tools/determinism.cjs from a day-22 save). Copying
// them as a reload would makes a live run, a replay and a reloaded run the same again.
var cf2BalanceVisits = visits;
visits = function (w, force = false) {
  let r = cf2BalanceVisits(w, force);
  for (let c of w.creatures) {
    if (!c.visitor) continue;
    let d = (w.downstream || []).find((x) => x.id === c.id),
      sn = d && d.snap;
    if (!sn) continue;
    for (let k of ["look", "temp", "interests", "accent", "lex", "rel", "parents", "children"]) if (c[k] && c[k] === sn[k]) c[k] = JSON.parse(JSON.stringify(c[k]));
  }
  return r;
};
