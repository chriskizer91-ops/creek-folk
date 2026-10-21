// ==========================================================================
// Creekfolk 2: the chronicle, and the last founder's passing.
//
// The chronicle (`w.chronicle.days`) is a record of every real day of the valley, so "while
// you were away" can be read: who was born, who passed on, who went downstream or came up the
// creek, the storms, what was built, how wet the creek was and how many lived there at the end
// of the day, and that day's notable lines from the history. The sentences are made by the
// page (`chronicleText`) from these facts. The history lines are kept for the last
// `CHRONICLE.notesDays` days; the facts for `CHRONICLE.keepDays`.
//
// The last of the eight to pass gets one quiet moment: a line in the history, a story, a
// memory for everyone, and `w.lastFounder` for the page. Then the valley simply goes on.
//
// Wraps logEvent (core.js), lifeTick, passOn and depart (life.js) and creekStorm (creek.js);
// see docs/MERGE.md.
// ==========================================================================

var CHRONICLE = {
  keepDays: 400,
  notesDays: 60,
  notesPerDay: 8,
};

function chronicleOf(w) {
  return (w.chronicle = w.chronicle || { days: [], cur: null });
}

function chronicleBuilt(w) {
  let b = {};
  for (let s of w.structures) if (s.level > 0 && s.kind !== "temple" && s.kind !== "ancestors") b[s.kind] = (b[s.kind] || 0) + 1;
  return b;
}

function chronicleClose(w, e) {
  let cr = w.creek,
    alive = w.creatures.filter((c) => !c.visitor);
  e.pop = alive.length;
  e.kids = alive.filter((c) => c.stage === "child").length;
  e.elders = alive.filter((c) => c.stage === "elder").length;
  e.founders = alive.filter((c) => c.founder).length;
  e.wet = cr ? +(cr.wetNow || 0).toFixed(3) : 0;
  e.run = !cr ? 0 : cr.flowLen >= VL - 4 ? 2 : cr.flowLen > 8 ? 1 : 0;
  e.season = seasonAt(w).name;
  e.built = chronicleBuilt(w);
  let C = chronicleOf(w);
  C.days.push(e);
  if (C.days.length > CHRONICLE.keepDays) C.days.splice(0, C.days.length - CHRONICLE.keepDays);
  let old = C.days.length - 1 - CHRONICLE.notesDays;
  if (old >= 0 && C.days[old].notes) delete C.days[old].notes;
}

// Today's entry (closing yesterday's when a new day has begun).
function chronicleDay(w) {
  let C = chronicleOf(w),
    d = Math.floor(w.t / 86400);
  if (C.cur && C.cur.d === d) return C.cur;
  if (C.cur) chronicleClose(w, C.cur);
  return (C.cur = { d, born: [], passed: [], left: [], came: [], storms: 0, big: 0, notes: [] });
}

var cf2ChronicleLog = logEvent;
logEvent = function (w, imp, text, who = [], at = null, kind = "misc") {
  let o = cf2ChronicleLog(w, imp, text, who, at, kind);
  if (!w.creatures || w.t == null) return o;
  let e = chronicleDay(w),
    name = (id) => (w.byId[id] || (w.lineage || {})[id] || {}).name;
  if (kind === "birth" && who[0] != null) e.born.push(name(who[0]));
  else if (kind === "passing" && who[0] != null) {
    let c = w.byId[who[0]];
    e.passed.push([name(who[0]), c && c.founder ? 1 : 0]);
  } else if (kind === "arrival" && who[0] != null) e.came.push(name(who[0]));
  else if (imp >= 3 && e.notes.length < CHRONICLE.notesPerDay) e.notes.push(text);
  return o;
};

// Each one who goes on downstream (their departure, not the day they decided).
var cf2ChronicleDepart = depart;
depart = function (w, c) {
  if (w.creatures && !c.visitor) chronicleDay(w).left.push(c.name);
  return cf2ChronicleDepart(w, c);
};

var cf2ChronicleStorm = creekStorm;
creekStorm = function (w, Tforce) {
  let T = cf2ChronicleStorm(w, Tforce);
  if (w.creatures && w.t != null) {
    let e = chronicleDay(w);
    e.storms++;
    if (T > 8) e.big++;
  }
  return T;
};

var cf2ChronicleLifeTick = lifeTick;
lifeTick = function (w) {
  cf2ChronicleLifeTick(w);
  chronicleDay(w);
};

// ---- the last of the eight -----------------------------------------------------------

var cf2ChroniclePassOn = passOn;
passOn = function (w, c) {
  let founder = c.founder;
  cf2ChroniclePassOn(w, c);
  if (!founder || w.lastFounder) return;
  let left = w.creatures.filter((o) => o.founder && !o.visitor);
  if (left.length) {
    let n = numberWord(left.length);
    if (left.length <= 2) logEvent(w, 2, `${left.length === 1 ? "Only " + left[0].name + " is" : n[0].toUpperCase() + n.slice(1) + " are"} left of the eight who came down the creek.`, left.map((o) => o.id), left[0], "founders");
    return;
  }
  let alive = w.creatures.filter((o) => !o.visitor),
    gens = alive.length ? Math.max(...alive.map((o) => o.gen || 0)) : 0,
    at = c.farewell || c;
  w.lastFounder = { id: c.id, name: c.name, t: Math.round(w.t), x: +at.x.toFixed(1), z: +at.z.toFixed(1) };
  logEvent(
    w,
    3,
    `${c.name} was the last of the eight who came down the creek from the old valley. ${alive.length ? `${numberWord(alive.length).replace(/^./, (x) => x.toUpperCase())} creekfolk live in the valley now${gens >= 2 ? ", children and grandchildren of the eight" + (gens >= 3 ? " and theirs" : "") : ""}, and not one of them has seen the old valley.` : ""} The valley goes on.`,
    [c.id],
    at,
    "founders",
  );
  newStory(w, "lastfounder", { who: c.name }, at, 3, alive.filter((o) => !o.asleep));
  for (let o of alive) remember(w, o, "founders", `${c.name} was the last of the first eight. Now there's only us.`, 0.8, { who: c.id });
};

var cf2ChronicleStoryText = storyText;
storyText = function (w, s, v) {
  if (!s || s.kind !== "lastfounder") return cf2ChronicleStoryText(w, s, v);
  let big = v.big || 0,
    why = v.why === "creek" ? ", because the creek wished it" : v.why === "elders" ? ", as the elders had said it would" : "";
  return `${v.who} was the last of the eight who came down from the old valley${why}${big ? (big >= 2 ? "; that night the creek ran silver from end to end" : ", and the frogs sang until morning") : ""}.`;
};
var cf2ChronicleShortAbout = shortAbout;
shortAbout = function (w, s) {
  return s.kind === "lastfounder" ? "the last of the first eight" : cf2ChronicleShortAbout(w, s);
};
