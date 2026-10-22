// ==========================================================================
// The three records of time, on the page: the mud in the creek's bank (what happened, written
// in the land), the valley's ways and stories laid beside what really happened (what they told,
// what they carved, what they remember), and the chronicle of every day. All read a full copy
// of the world (as the sheets do).
// ==========================================================================

var BANK_PAINT = {
  0: "#9a9284", // gravel, where the water ran fast
  1: "#4f3c2b", // dark wet-season mud
  2: "#ccb689", // pale dry-season silt
  old: "#7b684d",
  oldLine: "#5d4e39",
  water: "rgba(86, 140, 168, 0.55)",
  stake: "#5a4128",
  stone: "#8f8b83",
  ink: "#3b2f22",
  mute: "#7a6a52",
};

function bandDate(w, t10) {
  return dateText(w, t10 * 8640);
}

// The bank at one point: the cross-section at true scale (left) and the layers one by one,
// thickened so each can be seen (right).
function bankSvg(w, b) {
  let W = 640,
    H = 250,
    P = BANK_PAINT,
    crest = Math.max(-1e9, ...b.dams.map((d) => (d.now ? d.now.crest : d.up.length ? d.up[d.up.length - 1][1] : -1e9))),
    lo = b.bed0 - 0.3,
    hi = Math.max(b.fp, b.wl, crest, b.fp0) + 0.3,
    Y = (y) => (H - 18 - ((y - lo) / (hi - lo)) * (H - 36)).toFixed(1),
    x0 = 14,
    xFoot = 150,
    xTop = 250,
    xEnd = 360,
    wallX = (y) => (y <= b.bed0 ? xFoot : y >= b.fp0 ? xTop + (y - b.fp0) * 400 : xFoot + ((y - b.bed0) / Math.max(0.05, b.fp0 - b.bed0)) * (xTop - xFoot)),
    s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="The creek's bank, cut through" style="max-width:${W}px;display:block;margin:6px 0">`;
  // the ground as it was on the first day
  s += `<path d="M${x0} ${H}L${x0} ${Y(b.bed0)}L${xFoot} ${Y(b.bed0)}L${xTop} ${Y(b.fp0)}L${xEnd} ${Y(b.fp0)}L${xEnd} ${H}Z" fill="${P.old}"/>`;
  // the trench fill and the floor mud, band by band, at true scale
  let y = b.bed0;
  for (let [, mm, code] of b.bands) {
    let y2 = y + mm / 1000;
    s += `<path d="M${x0} ${Y(y)}L${Math.min(xEnd, wallX(y)).toFixed(1)} ${Y(y)}L${Math.min(xEnd, wallX(y2)).toFixed(1)} ${Y(y2)}L${x0} ${Y(y2)}Z" fill="${P[code]}"/>`;
    y = y2;
  }
  let yf = b.fp0;
  for (let [, mm, code] of b.floor) {
    let y2 = yf + mm / 1000;
    s += `<rect x="${xTop}" y="${Y(y2)}" width="${xEnd - xTop}" height="${Math.max(0.4, +Y(yf) - +Y(y2)).toFixed(1)}" fill="${P[code]}"/>`;
    yf = y2;
  }
  // water standing in it now
  if (b.wl > b.bed + 0.01) s += `<rect x="${x0}" y="${Y(b.wl)}" width="${(Math.min(xEnd, wallX(b.wl)) - x0).toFixed(1)}" height="${(+Y(b.bed) - +Y(b.wl)).toFixed(1)}" fill="${P.water}"/>`;
  // the dams here: stakes from where they were set, up to the crest
  for (let d of b.dams) {
    let top = d.now ? d.now.crest : d.up.length ? d.up[d.up.length - 1][1] : d.base + 0.3;
    for (let k = 0; k < 4; k++) s += `<rect x="${x0 + 18 + k * 9}" y="${Y(top)}" width="4" height="${(+Y(d.base) - +Y(top)).toFixed(1)}" fill="${P.stake}"/>`;
    s += `<rect x="${x0 + 14}" y="${Y(d.base + 0.08)}" width="40" height="${(+Y(d.base) - +Y(d.base + 0.08)).toFixed(1)}" fill="${P.stone}"/>`;
  }
  // treasures buried in the mud here (cf2-treasure.js): a glint at the height the mud had reached
  for (let [, id, mm] of b.buried || []) {
    let tr = (w.treasures || []).find((t) => t.id === id),
      K = tr && TREASURE_KINDS[tr.k],
      ty = b.bed0 + mm / 1000 + 0.004,
      tx = x0 + 30 + ((id * 37) % 70);
    s += `<circle cx="${tx}" cy="${Y(ty)}" r="4" fill="${K ? K.paint : "#fff"}" stroke="#2a2420" stroke-width="1"><title>${esc(K ? K.label : "a treasure")}</title></circle>`;
  }
  s += `<line x1="${x0}" y1="${Y(b.bed0)}" x2="${xFoot}" y2="${Y(b.bed0)}" stroke="${P.oldLine}" stroke-dasharray="4 3"/>`;
  s += `<text x="${x0}" y="${+Y(b.bed0) + 13}" font-size="11" fill="#f3e9d2">the bed on the first day</text>`;
  s += `<text x="${xTop + 4}" y="${+Y(Math.max(yf, b.fp)) - 5}" font-size="11" fill="${P.ink}">the floor</text>`;
  // the layers one by one: a core pulled from the bank, oldest at the bottom
  let n = b.bands.length,
    cx = 420,
    cw = 60,
    top = 16,
    bot = H - 18,
    total = b.bands.reduce((a, x) => a + x[1], 0) || 1,
    hs = b.bands.map((x) => Math.max(2, (x[1] / total) * (bot - top))),
    scale = Math.min(1, (bot - top) / (hs.reduce((a, h) => a + h, 0) || 1)),
    yy = bot,
    firstDam = b.dams.length ? Math.min(...b.dams.map((d) => d.t)) : null,
    years = new Set();
  s += `<rect x="${cx - 1}" y="${top - 1}" width="${cw + 2}" height="${bot - top + 2}" fill="none" stroke="${P.oldLine}"/>`;
  if (!n) s += `<text x="${cx + cw / 2}" y="${(top + bot) / 2}" font-size="11" text-anchor="middle" fill="${P.mute}">nothing yet</text>`;
  for (let j = 0; j < n; j++) {
    let [t10, , code] = b.bands[j],
      h = hs[j] * scale,
      yr = seasonAt(w, t10 * 8640).year;
    s += `<rect x="${cx}" y="${(yy - h).toFixed(1)}" width="${cw}" height="${h.toFixed(1)}" fill="${P[code]}" stroke="rgba(0,0,0,0.18)" stroke-width="0.5"><title>${esc(bandDate(w, t10))}</title></rect>`;
    if (!years.has(yr) && h > 0) {
      years.add(yr);
      s += `<line x1="${cx + cw}" y1="${yy.toFixed(1)}" x2="${cx + cw + 8}" y2="${yy.toFixed(1)}" stroke="${P.mute}"/><text x="${cx + cw + 11}" y="${(yy + 3).toFixed(1)}" font-size="10" fill="${P.mute}">year ${yr}</text>`;
    }
    if (firstDam != null && t10 >= firstDam && (j === 0 || b.bands[j - 1][0] < firstDam)) s += `<line x1="${cx - 10}" y1="${yy.toFixed(1)}" x2="${cx + cw}" y2="${yy.toFixed(1)}" stroke="${P.stake}" stroke-width="2"/><text x="${cx - 13}" y="${(yy + 3).toFixed(1)}" font-size="10" text-anchor="end" fill="${P.stake}">the dam</text>`;
    yy -= h;
  }
  // the key
  let ky = top + 4;
  for (let [c, label] of [[1, "wet-season mud"], [2, "dry-season silt"], [0, "gravel"]]) {
    s += `<rect x="${cx + cw + 60}" y="${ky}" width="10" height="10" fill="${P[c]}"/><text x="${cx + cw + 74}" y="${ky + 9}" font-size="10.5" fill="${P.ink}">${label}</text>`;
    ky += 15;
  }
  return s + "</svg>";
}

function bankWords(w, b) {
  let n = b.bands.length,
    fill = b.bed - b.bed0,
    floor = b.fp - b.fp0,
    damT = b.dams.length ? Math.min(...b.dams.map((d) => d.t)) : null,
    out = [];
  if (!n && floor < 0.004) return `<p>Nothing has settled here yet. The creek runs over the same stones it ran over on the first day.</p>`;
  out.push(
    `Since the first day the creek has laid down ${n === 1 ? "one layer" : n + " layers"} here${damT != null ? `, most of them since the dam was built on ${esc(bandDate(w, damT))}` : ""}: ${esc(depthWords(fill))} of ${b.bands.some((x) => x[2]) ? "mud and gravel" : "gravel"} in the bed${floor > 0.004 ? `, and ${esc(depthWords(floor))} of mud over the floor beside it` : ""}.`,
  );
  if (n >= 4) {
    let thick = b.bands.reduce((a, x) => (x[1] > a[1] ? x : a));
    out.push(`The thickest band came on ${esc(bandDate(w, thick[0]))}.`);
    let half = Math.floor(n / 2),
      early = b.bands.slice(0, half).reduce((a, x) => a + x[1], 0) / half,
      late = b.bands.slice(half).reduce((a, x) => a + x[1], 0) / (n - half);
    if (late < early * 0.6) out.push("The newer bands are thinner: there's less room left for mud to settle.");
  }
  for (let [t10, id] of b.buried || []) {
    let tr = (w.treasures || []).find((t) => t.id === id),
      K = tr && TREASURE_KINDS[tr.k];
    if (K) out.push(esc(`Something glints in the mud: ${K.phrase}, buried by a flood on ${bandDate(w, t10)}. No one ever found it.`));
  }
  return `<p>${out.join(" ")}</p><p class="mute">Dark bands are the wet season's mud, pale ones the dry season's silt, grey the gravel the creek carried when it ran fast. The column on the right shows each band thick enough to see; the drawing on the left is true to size.</p>`;
}

function bankSheet(w, z) {
  let b = bankAt(w, z),
    place = placeNear(w, creekAt(w.creek, z, "x"), z, 12),
    dam = b.dams[0];
  return `<h2>The creek's bank</h2><p class="k">${esc(place ? "near " + place.name : dam ? "at a dam" : "a point of the creek")} · ${esc(dateText(w))}</p>` + bankSvg(w, b) + bankWords(w, b);
}

// ---- the valley's ways --------------------------------------------------------------

function villageWays(w) {
  let cu = w.customs || {},
    ov = w.oldValley,
    h = "",
    alive = w.creatures.filter((c) => !c.visitor),
    nowSays = (k) => {
      let counts = {},
        young = {},
        n = 0;
      for (let c of alive) {
        let f = favoriteWord(c, k);
        if (!f) continue;
        counts[f] = (counts[f] || 0) + 1;
        if (c.stage === "child") young[f] = (young[f] || 0) + 1;
        n++;
      }
      let ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]),
        top = ranked[0],
        alt = ranked[1] && ranked[1][1] >= n * 0.2 ? ranked[1] : null;
      return top ? { word: top[0], n: top[1], alt: alt && alt[0], altYoung: alt && (young[alt[0]] || 0) > alt[1] / 2 } : null;
    };
  h += `<h3>Their customs</h3><ul>`;
  let from = (x) => (x && x.old ? ` <span class="mute">(from the old valley)</span>` : "");
  if (cu.passing && cu.passing.custom) h += `<li>When someone passes, they ${esc(OFFERINGS[cu.passing.custom][1])} for them.${from(cu.passing)}</li>`;
  if (cu.seasons && cu.seasons.n) h += `<li>They gather when the season turns.${from(cu.seasons)}</li>`;
  if (cu.thanks) h += `<li>When the rains come back after the dry season, they go down to the water to ${esc(GESTURE_FIRST[cu.thanks.g].replace(/my /, "their "))} and thank the creek.${from(cu.thanks)}${w.culture && w.culture.thanks ? ` <span class="mute">They have done it ${w.culture.thanks === 1 ? "once" : w.culture.thanks === 2 ? "twice" : numberWord(w.culture.thanks) + " times"} here.</span>` : ""}</li>`;
  h += `</ul>`;
  if (ov) {
    let rows = [],
      kept = 0,
      changed = 0;
    for (let k of CULTURE.oldWords) {
      let now = nowSays(k),
        old = ov.words[k];
      if (!now) rows.push([k, old, null]);
      else if (now.word === old) kept++, rows.push([k, old, old, now]);
      else changed++, rows.push([k, old, now.word, now]);
    }
    h += `<h3>Their words</h3><p>Of the old valley's words they brought, ${kept === rows.length ? "every one is still said the old way" : `${numberWord(kept)} ${kept === 1 ? "is" : "are"} still said the old way${changed ? `, ${numberWord(changed)} ${changed === 1 ? "has" : "have"} changed` : ""}`}.</p>`;
    let moving = (r) => r[2] !== r[1] || (r[3] && r[3].alt);
    h += `<table>${rows
      .filter(moving)
      .concat(rows.filter((r) => !moving(r)).slice(0, 6))
      .slice(0, 16)
      .map(([k, old, now, x]) => `<tr><td>${esc(conceptLabel(w, k))}</td><td><i>${esc(old)}</i></td><td class="mute">${now == null ? "no one says it now" : now === old ? "the same" : `now <i>${esc(now)}</i>`}${x && x.alt ? `; ${x.altYoung ? "the young say" : "some say"} <i>${esc(x.alt === old ? old : x.alt)}</i>` : ""}</td></tr>`)
      .join("")}</table>`;
    let fresh = Object.keys(vocabularyByConcept(alive)).filter((k) => !CULTURE.oldWords.includes(k) && !k.startsWith("place:"));
    if (fresh.length) h += `<p class="mute">Words that began here: ${fresh.slice(0, 10).map((k) => `${esc(conceptLabel(w, k))} <i>${esc(nowSays(k).word)}</i>`).join(" · ")}.</p>`;
  }
  h += storyRecords(w, alive);
  return h;
}

function vocabularyByConcept(cs) {
  let out = {};
  for (let c of cs) for (let k in c.lex || {}) if (favoriteWord(c, k)) out[k] = 1;
  return out;
}

// What really happened, what was carved, what they say now: for each story that matters.
function storyRecords(w, alive) {
  let holders = {};
  for (let c of alive) for (let k in c.lore || {}) (holders[k] = holders[k] || []).push(c.lore[k]);
  let list = Object.values(w.stories || {})
    .filter((s) => (s.weight || 1) >= 2 && (holders[s.id] || s.carved))
    .sort((a, b) => (b.old ? 1 : 0) - (a.old ? 1 : 0) || b.weight - a.weight || a.t - b.t)
    .slice(0, 16);
  if (!list.length) return "";
  let h = `<h3>What they tell</h3><p class="mute">For each story: what really happened, what was carved, and what most of them say now.</p>`;
  for (let s of list) {
    let hs = holders[s.id] || [],
      counts = new Map();
    for (let l of hs) {
      let t = storyText(w, s, l.v);
      counts.set(t, (counts.get(t) || 0) + 1);
    }
    let top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0],
      truth = storyText(w, s, s.truth),
      carve = typeof carvingsOf === "function" ? carvingsOf(w, s.id) : [];
    h += `<div style="border-top:1px solid var(--rule);padding:8px 0 4px">`;
    h += `<p style="margin:0 0 4px"><b>${esc(shortAbout(w, s).replace(/^./, (x) => x.toUpperCase()))}</b></p>`;
    h += `<p style="margin:0 0 2px"><span class="mute">What happened:</span> ${esc(truth)}</p>`;
    for (let k of carve.slice(0, 2)) h += `<p style="margin:0 0 2px"><span class="mute">${esc(carveLabel(w, k))}:</span> ${esc(k.text)}</p>`;
    if (top) h += `<p style="margin:0 0 2px"><span class="mute">What they say now${hs.length > 1 ? ` (${top[1] === hs.length ? "all who tell it" : top[1] > hs.length / 2 ? "most who tell it" : "some"})` : ""}:</span> ${top[0] === truth ? "the same." : esc(top[0])}</p>`;
    else h += `<p style="margin:0 0 2px" class="mute">No one living tells it anymore.</p>`;
    h += `</div>`;
  }
  return h;
}

// ---- the chronicle ----------------------------------------------------------------

var CHRONICLE_BUILT = { home: ["a home", "homes"], dam: ["a dam", "dams"], garden: ["a garden", "gardens"], store: ["a storehouse", "storehouses"], crossing: ["a crossing", "crossings"], workshop: ["a workshop", "workshops"], meeting: ["a meeting place", "meeting places"], chimes: ["rain chimes", "rain chimes"], lookout: ["a lookout", "lookouts"], skycal: ["the sky stones", "the sky stones"] };

function namesText(list) {
  return list.length <= 1 ? list.join("") : list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
}

function chronicleText(w, e, prev) {
  let out = [],
    up = (s) => s[0].toUpperCase() + s.slice(1);
  if (e.born.length) out.push(e.born.length === 1 ? `${e.born[0]} was born.` : e.born.length <= 3 ? `${namesText(e.born)} were born.` : `${up(numberWord(e.born.length))} were born: ${namesText(e.born)}.`);
  for (let [name, founder] of e.passed) out.push(`${name} passed on${founder ? ", one of the eight who came down the creek" : ""}.`);
  if (e.left.length) out.push(`${namesText(e.left)} went on downstream.`);
  if (e.came.length) out.push(`${namesText(e.came)} came up the creek and stayed.`);
  if (e.storms) out.push(e.big ? (e.storms === 1 ? "A great storm came, and the creek flooded." : `${up(numberWord(e.storms))} storms came, one of them a great flood.`) : e.storms === 1 ? "A storm came." : `${up(numberWord(e.storms))} storms came.`);
  if (e.built) {
    let made = [];
    for (let k in e.built) {
      let d = e.built[k] - ((prev && prev.built && prev.built[k]) || 0),
        L = CHRONICLE_BUILT[k];
      if (d > 0 && L) made.push(d === 1 ? L[0] : `${numberWord(d)} ${L[1]}`);
    }
    if (made.length) out.push(`They finished ${namesText(made)}.`);
  }
  if (e.run != null && (!prev || prev.run !== e.run)) out.push(e.run === 2 ? "The creek ran the whole length of the valley." : e.run === 1 ? "The creek ran part of the way, then sank into its bed." : "The creek stopped running; only pools held water.");
  if (e.wet != null && (!prev || creekShareWords(prev.wet) !== creekShareWords(e.wet))) out.push(`${up(creekShareOfFloor(e.wet))} ${creekShareOfFloor(e.wet).startsWith("only") ? "held" : "was"} wet.`);
  if (e.pop != null) out.push(`${up(numberWord(e.pop))} creekfolk lived in the valley at the end of the day${e.founders ? `, ${e.founders === 8 ? "all eight of the first" : numberWord(e.founders) + " of the first eight"} among them` : ""}.`);
  return out.join(" ");
}

function chronicleEntries(w) {
  let C = w.chronicle || { days: [] },
    list = C.days.slice();
  if (C.cur) list.push({ ...C.cur, today: true });
  return list;
}

function chronicleHtml(w, entries, prev) {
  let h = "";
  for (let j = entries.length - 1; j >= 0; j--) {
    let e = entries[j],
      p = j > 0 ? entries[j - 1] : prev;
    h += `<div style="border-top:1px solid var(--rule);padding:8px 0 2px"><p style="margin:0 0 3px"><b>The valley's ${ordinal(e.d + 1)} day</b>${e.season ? ` <span class="mute">· ${esc(e.season)}</span>` : ""}${e.today ? ` <span class="mute">· so far</span>` : ""}</p>`;
    let text = chronicleText(w, e, p);
    if (text) h += `<p style="margin:0 0 3px">${esc(text)}</p>`;
    if (e.notes && e.notes.length) h += `<ul style="margin:0 0 4px">${e.notes.map((t) => `<li class="mute" style="font-size:14px">${esc(t)}</li>`).join("")}</ul>`;
    h += `</div>`;
  }
  return h || `<p class="mute">Nothing written yet.</p>`;
}

function villageChronicle(w) {
  let list = chronicleEntries(w);
  return `<p class="mute">A page for every day of the valley.</p>` + chronicleHtml(w, list.slice(-60), list.length > 60 ? list[list.length - 61] : null) + (list.length > 60 ? `<p class="mute">Older days are kept in the valley's save; this shows the last sixty.</p>` : "");
}

// What they're doing, for the new goals: carving, and thanking the creek.
var cf2ActivityText = activityText;
activityText = function (c, w) {
  let a = c.act,
    p = c.plan || {};
  if (a && p.goal === "carve") {
    let st = (p.steps || [])[p.steps.length - 1] || {};
    if (a.type === "walk") return p.mat === "sand" ? "Going down to the creek to draw a story in the sand" : p.mat === "clay" ? "Going to press a story into clay" : "Going to the Telling Stones";
    if (st.fix != null) return p.mat === "clay" ? "Copying a crumbling clay tablet onto a new one" : "Recutting the worn letters on a standing stone";
    return p.mat === "sand" ? "Drawing a story in the sand" : p.mat === "clay" ? "Pressing a story into a clay tablet" : "Cutting a story into stone";
  }
  if (a && p.goal === "thanks") return a.type === "walk" ? "Going down to the water to thank the creek" : "Thanking the creek, the old way";
  return cf2ActivityText(c, w);
};
