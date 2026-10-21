// ==========================================================================
// The developer menu.
//
// In creekfolk.html it is hidden: Ctrl+Shift+D (Cmd+Shift+D on a Mac), or add
// #dev to the address. In creekfolk-dev.html (DEV_BUILD) a Dev button is always
// on screen and works on a phone; that build keeps its own saves, so nothing done
// here can touch a real valley.
//
// It moves the clock forward (an hour, a day, a week, 1, 3, 6 or 12 months, or to a
// chosen date). Every jump is replayed in full through the same catch-up as a real
// absence, so it doubles as a test of catch-up, and the menu shows how fast the last
// jump ran (read it on a phone to measure the phone). The dev build saves a snapshot
// before every jump and can restore any of the last ten. It can also give a gift now,
// make things happen (a storm, a big flood, a birth, a passing, a visitor), pause the
// valley's clock, draw overlays on the ground, and read any mind.
//
// The clock offset is a per-browser setting (localStorage), never part of the
// valley's save.
// ==========================================================================
var DEV_KEY = "creekfolk.dev." + BUILD_VERSION + (DEV_BUILD ? "-dev" : ""); // CREEK: each build keeps its own clock offset
var DEV_OFFSET = 0;
try {
  DEV_OFFSET = +JSON.parse(localStorage.getItem(DEV_KEY) || "{}").offset || 0;
} catch (e) {}

var DEV_PAUSED = null; // real time when the dev menu paused the valley's clock

// "Now", as the valley sees it: real time plus the developer offset (frozen while paused).
function devNow() {
  return (DEV_PAUSED ?? Date.now()) + DEV_OFFSET;
}

var DevMenu = class {
  constructor(app) {
    this.app = app;
    this.el = null;
    this.timer = null;
    this.inspect = null;
    this.lastCatchup = null;
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        this.toggle();
      }
    });
    if (location.hash === "#dev") setTimeout(() => this.toggle(true), 800);
    this.snaps = [];
    this.note = "";
    if (DEV_BUILD) {
      // a Dev button that is always there, for phones too
      let b = document.createElement("button");
      b.id = "devbtn";
      b.textContent = "Dev";
      b.style.cssText = "position:fixed;left:12px;top:58px;z-index:49;font:600 13px/1 system-ui,sans-serif;padding:7px 12px;border-radius:999px;border:1px solid #574d68;background:rgba(20,18,26,.85);color:#e9e4f0;cursor:pointer";
      b.onclick = () => this.toggle();
      document.body.appendChild(b);
      this.listSnaps();
    }
  }
  async listSnaps() {
    if (!DEV_BUILD) return;
    let ks = (await this.app.store.keys("snapshots")).map(String).sort();
    this.snaps = ks.reverse();
  }
  // before a jump: keep the valley as it is now, with the clock offset that goes with it
  async snapshot(why) {
    if (!DEV_BUILD || !this.app.world) return;
    let w = this.app.world,
      key = `${new Date().toISOString().slice(0, 19).replace("T", " ")} · ${dateText(w)} · ${why}`;
    try {
      await this.app.store.put(key, JSON.stringify({ offset: DEV_OFFSET, save: saveWorld(w) }), "snapshots");
      let ks = (await this.app.store.keys("snapshots")).map(String).sort();
      for (let k of ks.slice(0, Math.max(0, ks.length - 10))) await this.app.store.del(k, "snapshots");
      await this.listSnaps();
    } catch (e) {
      console.warn("snapshot failed", e);
    }
  }
  async restore(key) {
    let raw = await this.app.store.get(key, "snapshots");
    if (!raw) return;
    let o = JSON.parse(raw),
      w = loadWorld(o.save);
    if (this.app.catching) return;
    this.setOffset(o.offset || 0);
    DEV_PAUSED = null;
    this.app.setWorld(w);
    this.app.save();
    this.note = "Restored: " + key;
    this.render(true);
  }
  setOffset(ms) {
    DEV_OFFSET = Math.round(ms);
    try {
      localStorage.setItem(DEV_KEY, JSON.stringify({ offset: DEV_OFFSET }));
    } catch (e) {}
  }
  async jump(ms) {
    if (this.app.catching || this.jumping) return;
    this.jumping = true;
    await this.snapshot("before +" + durationText(ms / 1000));
    this.jumping = false;
    this.jumpStarted = { at: performance.now(), from: this.app.world.t };
    this.setOffset(DEV_OFFSET + ms);
    this.render();
  }
  pause(on) {
    if (on && DEV_PAUSED == null) DEV_PAUSED = Date.now();
    if (!on && DEV_PAUSED != null) {
      // the valley's clock picks up where it stopped
      this.setOffset(DEV_OFFSET - (Date.now() - DEV_PAUSED));
      DEV_PAUSED = null;
    }
    this.render(true);
  }
  jumpMonths(n) {
    let d = new Date(devNow());
    d.setMonth(d.getMonth() + n);
    this.jump(d.getTime() - devNow());
  }
  toggle(force) {
    let open = force ?? !this.el;
    if (!open) {
      this.el && this.el.remove();
      this.el = null;
      clearInterval(this.timer);
      return;
    }
    if (this.el) return;
    this.el = document.createElement("div");
    this.el.id = "devmenu";
    this.el.innerHTML = `<style>
#devmenu{position:fixed;left:12px;top:60px;bottom:12px;width:420px;max-width:calc(100vw - 24px);z-index:50;background:rgba(20,18,26,.94);color:#e9e4f0;
 font:12.5px/1.45 ui-monospace,Menlo,Consolas,monospace;border:1px solid #574d68;border-radius:10px;display:flex;flex-direction:column;user-select:text;-webkit-user-select:text}
#devmenu header{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid #3a3346;font-weight:700;letter-spacing:.04em}
#devmenu .body{overflow:auto;padding:8px 10px 14px}
#devmenu h5{margin:12px 0 4px;color:#b9a8ff;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
#devmenu button,#devmenu select,#devmenu input{font:inherit;color:#e9e4f0;background:#2c2638;border:1px solid #574d68;border-radius:6px;padding:3px 7px;margin:2px 2px 2px 0;cursor:pointer}
#devmenu button:hover{background:#3b3350}
#devmenu .row{display:flex;flex-wrap:wrap;gap:2px;align-items:center}
#devmenu .muted{color:#9c93ab}
#devmenu table{border-collapse:collapse;width:100%}
#devmenu td{padding:1px 4px 1px 0;vertical-align:top}
#devmenu .devwarn{color:#ffb38a}
#devmenu pre{white-space:pre-wrap;margin:0}
</style>
<header><span>CREEKFOLK · DEV</span><button data-x>close</button></header><div class="body"></div>`;
    document.body.appendChild(this.el);
    this.el.querySelector("[data-x]").onclick = () => this.toggle(false);
    this.el.addEventListener("click", (e) => this.click(e));
    this.el.addEventListener("change", (e) => this.change(e));
    this.render();
    this.timer = setInterval(() => this.render(), 1000);
  }
  click(e) {
    let b = e.target.closest("button");
    if (!b) return;
    let H = 3600e3, D = 86400e3;
    if (b.dataset.j) this.jump(+b.dataset.j * H);
    if (b.dataset.m) this.jumpMonths(+b.dataset.m);
    if (b.dataset.go) {
      let v = this.el.querySelector("#dev-date").value;
      let t = v ? new Date(v).getTime() : NaN;
      if (isFinite(t) && t > devNow()) this.jump(t - devNow());
    }
    if (b.dataset.reset != null) {
      this.setOffset(0);
      this.render();
    }
    if (b.dataset.follow) {
      this.app.select(+b.dataset.follow);
    }
    let w = this.app.world;
    if (b.dataset.gift && w && !this.app.catching) {
      w.giftLast = -1e9; // no waiting in the developer menu
      let r = giveGift(w, b.dataset.gift);
      this.note = r ? `Gave: ${b.dataset.gift}` : "That gift couldn't be given.";
    }
    if (b.dataset.trigger && w && !this.app.catching) (this.note = "Made it happen: " + devTrigger(w, b.dataset.trigger)), b.dataset.trigger === "beyond" && (WAVE.pending = !0); // BELIEF: wave right away
    if (b.dataset.overlay != null) {
      let g = this.app.renderer.views && this.app.renderer.views.terrain;
      if (g) (g.overlay = b.dataset.overlay || null), (g.lastPaint = -99);
    }
    if (b.dataset.pause != null) this.pause(b.dataset.pause === "1");
    if (b.dataset.restore) this.restore(b.dataset.restore);
    this.render(true);
  }
  change(e) {
    if (e.target.id === "dev-who") {
      this.inspect = +e.target.value || null;
      this.render(true);
    }
  }
  render(force) {
    if (!this.el) return;
    let a = this.app,
      w = a.world;
    if (!w) return;
    // Don't redraw while someone is typing a date.
    let ae = document.activeElement;
    if (!force && ae && this.el.contains(ae) && ae.tagName === "INPUT") return;
    let D = 86400,
      sc = stageCounts(w),
      cap = valleyCapacity(w),
      off = DEV_OFFSET / 864e5,
      catching = a.catching,
      body = this.el.querySelector(".body");
    if (catching && catching.worker) this.wasWorker = true;
    if (!catching && this.jumpStarted && w.t > this.jumpStarted.from) {
      let secs = (performance.now() - this.jumpStarted.at) / 1000,
        sim = w.t - this.jumpStarted.from;
      this.lastCatchup = { sim, secs, rate: sim / Math.max(0.001, secs), worker: !!this.wasWorker, pop: w.creatures.length };
      this.jumpStarted = null;
      this.wasWorker = false;
    }
    let nextPass = w.creatures
      .map((c) => ({ c, left: (c.born + c.lifespan - w.t) / D }))
      .sort((x, y) => x.left - y.left)[0];
    let pairs = w.creatures.filter((c) => c.partner && c.id < c.partner && w.byId[c.partner]).map((c) => `${c.name}+${w.byId[c.partner].name}`);
    let lc = this.lastCatchup;
    let html = `
<h5>Clock</h5>
<table>
<tr><td class="muted">real now</td><td>${new Date().toLocaleString()}</td></tr>
<tr><td class="muted">valley now</td><td>${new Date(devNow()).toLocaleString()} ${off > 0 ? `<span class="devwarn">(+${off.toFixed(2)} days)</span>` : ""}</td></tr>
<tr><td class="muted">valley date</td><td>${escapeHtml(dateText(w))} (${(seasonAt(w).progress * 100).toFixed(0)}% through ${seasonAt(w).name}), ${timeOfDayName(w.t)} · ${seasonAt(w).wetSeason ? "wet season" : "dry season"}</td></tr>
<tr><td class="muted">valley age</td><td>${(w.t / D).toFixed(2)} real days · began ${escapeHtml(realStartText(w))}</td></tr>
<tr><td class="muted">catch-up</td><td>${catching ? `running ${catching.worker ? "in the worker" : "on the page"}: ${durationText(catching.to - catching.from)}` : "idle"}</td></tr>
${lc ? `<tr><td class="muted">last jump</td><td>${durationText(lc.sim)} in ${lc.secs.toFixed(1)} s = ${Math.round(lc.rate).toLocaleString()}× real time ${lc.worker ? "(worker)" : "(page)"}, ${lc.pop} creekfolk · 30 days would take about ${(30 * 86400 / lc.rate / 60).toFixed(1)} min here</td></tr>` : ""}
</table>
${this.note ? `<div class="devwarn">${escapeHtml(this.note)}</div>` : ""}
<h5>Jump ahead (replayed in full)</h5>
<div class="row"><button data-j="1">+1 hour</button><button data-j="24">+1 day</button><button data-j="168">+1 week</button></div>
<div class="row">${[1, 3, 6, 12].map((m) => `<button data-m="${m}">+${m} month${m > 1 ? "s" : ""}</button>`).join("")}</div>
<div class="row">${DEV_PAUSED != null ? `<button data-pause="0">resume the valley's clock</button><span class="devwarn">paused</span>` : `<button data-pause="1">pause the valley's clock</button>`}</div>
${catching ? `<div class="devwarn">Keep the screen on until the catch-up is done: phones pause pages that are hidden.</div>` : ""}
${DEV_BUILD ? `<h5>Snapshots (taken before every jump)</h5>${this.snaps.length ? this.snaps.map((k) => `<div class="row"><button data-restore="${escapeHtml(k)}">restore</button><span class="muted">${escapeHtml(k)}</span></div>`).join("") : '<div class="muted">None yet.</div>'}` : ""}
<h5>Make it happen</h5>
<div class="row">${Object.keys(GIFT_KINDS).map((k) => `<button data-gift="${k}">gift: ${k}</button>`).join("")}</div>
<div class="row"><button data-trigger="answer">the creek answers now</button><button data-trigger="spring">find the spring</button><button data-trigger="beyond">one believes in you</button><button data-trigger="believe">everyone believes</button></div>
<div class="row"><button data-trigger="storm">storm</button><button data-trigger="flood">big flood</button><button data-trigger="birth">birth</button><button data-trigger="passing">passing</button><button data-trigger="visitor">visitor</button><button data-trigger="beavers">beavers</button><button data-trigger="skycal">sky stones</button><button data-trigger="returning">the Returning</button></div>
<h5>Overlays</h5>
<div class="row">${[["", "none"], ["wet", "wetness"], ["wear", "worn paths"], ["stage", "creek stage"], ["feed", "land capacity"]].map(([k, l]) => `<button data-overlay="${k}">${l}</button>`).join("")}</div>
${devCreekHTML(w)}
<div class="row"><input id="dev-date" type="datetime-local"><button data-go="1">go to date</button>${off > 0 ? `<button data-reset>reset offset</button>` : ""}</div>
${off > 0 ? `<div class="muted">Resetting the offset can't rewind the valley: it keeps running from where it is, so its calendar stays ahead of the real one.</div>` : ""}
<h5>Population</h5>
<table>
<tr><td class="muted">living</td><td>${w.creatures.length} (children ${sc.child}, adults ${sc.adult}, elders ${sc.elder}) · room for ${cap} (shelter ${capacityParts(w).shelter}, the land feeds ${capacityParts(w).feed})</td></tr>
<tr><td class="muted">so far</td><td>born ${w.stats.births || 0} · passed on ${w.stats.passings || 0} · downstream ${w.stats.departed || 0} · grove trees ${w.res.filter((r) => r.kind === "grove").length}</td></tr>
<tr><td class="muted">pairs</td><td>${escapeHtml(pairs.join(", ") || "none")}</td></tr>
<tr><td class="muted">next passing</td><td>${nextPass ? `${escapeHtml(nextPass.c.name)} in ${nextPass.left.toFixed(2)} days` : "-"}</td></tr>
<tr><td class="muted">minds</td><td>stories ${Object.keys(w.stories || {}).length} · myths ${w.stats.myths || 0} · places ${(w.placeNames || []).length} · skills lost ${Object.keys(w.lost || {}).length} · visits ${w.stats.visits || 0} · travelers ${w.stats.travelers || 0}</td></tr>
<tr><td class="muted">gifts</td><td>${(w.gifts || []).length} given · believers ${w.creatures.filter((c) => c.beliefs && c.beliefs.giver > 0.5).length} · ${giftReady(w) ? "ready now" : "next in " + durationText(giftWaitSeconds(w))}</td></tr>
<tr><td class="muted">errors</td><td>${w.stats.errors || 0}</td></tr>
</table>
<h5>Minds</h5>
<div class="row"><select id="dev-who"><option value="">choose a creekfolk…</option>${w.creatures
      .map((c) => `<option value="${c.id}" ${this.inspect === c.id ? "selected" : ""}>${escapeHtml(c.name)} · ${stageOf(w, c)} · ${ageDays(w, c).toFixed(1)}d</option>`)
      .join("")}</select>${this.inspect && w.byId[this.inspect] ? `<button data-follow="${this.inspect}">follow</button>` : ""}</div>
${this.inspect && w.byId[this.inspect] ? mindHTML(w, w.byId[this.inspect]) : `<div class="muted">${a.selected ? "" : "Pick someone to read their mind."}</div>`}`;
    body.innerHTML = html;
  }
};

// The creek, in numbers.
function devCreekHTML(w) {
  let cr = w.creek;
  if (!cr) return "";
  let st = {},
    inV = cr.nodes.filter((n) => n.z >= 0 && n.z <= VL);
  for (let n of inV) st[n.stage] = (st[n.stage] || 0) + 1;
  let Ht = inV.reduce((a, n) => a + n.fp - n.bed, 0) / inV.length,
    dams = w.structures.filter((s) => s.kind === "dam" && s.level > 0).map((s) => {
      let d = cr.dams[s.id],
        nd = d && cr.nodes[d.i];
      return d ? `z${Math.round(s.z)} L${s.level} crest ${(d.crest - nd.bed).toFixed(2)}m pond ${(d.pl - nd.bed).toFixed(2)}m${d.hold ? "" : " LEAKS"}${s.silted ? " silted" : ""}${d.raised ? ` raised ${d.raised}` : ""}${d.apron ? ` apron ${d.apron}` : ""}` : "";
    });
  return `<h5>Creek</h5><table>
<tr><td class="muted">water</td><td>flowing ${cr.flowLen} m of ${VL} · inflow ${(cr.Qin * 1000).toFixed(2)} L/s · topsoil ${cr.soil.toFixed(2)} · ${cr.flood ? `flood (${cr.flood.T}-year)` : "no flood"}</td></tr>
<tr><td class="muted">floor now</td><td>wet ${(cr.wetNow * 100).toFixed(1)}% · green ${(cr.greenNow * 100).toFixed(0)}%</td></tr>
<tr><td class="muted">driest</td><td>${cr.driest.slice(-8).map((d) => `y${d.year} ${(d.wet * 100).toFixed(0)}%`).join(" · ") || "-"}</td></tr>
<tr><td class="muted">trench</td><td>${Ht.toFixed(2)} m deep on average · stages ${Object.entries(st).sort().map(([k, v]) => `${k}:${v}`).join(" ")} · floods ${cr.floods}</td></tr>
<tr><td class="muted">feed</td><td>${creekFeed(w)} (health ${cr.health ?? "-"}) · know "downstream": ${w.creatures.filter((c) => c.know.downstream).length}</td></tr>
<tr><td class="muted">dams</td><td>${dams.join("<br>") || "-"}</td></tr>
</table>`;
}

// Everything we know about one mind, as plain text.
function mindHTML(w, c) {
  let D = 86400,
    n = (id) => (w.byId[id] ? w.byId[id].name : w.lineage && w.lineage[id] ? w.lineage[id].name + "†" : "?"),
    f = (x) => (typeof x === "number" ? x.toFixed(2) : String(x)),
    kv = (o) => Object.entries(o || {}).map(([k, v]) => `${k} ${f(v)}`).join(" · ");
  let rels = Object.entries(c.rel)
    .map(([id, r]) => ({ id, r }))
    .sort((a, b) => b.r.warmth - a.r.warmth)
    .slice(0, 8)
    .map(({ id, r }) => `${n(id)}: warmth ${f(r.warmth)} fam ${f(r.fam)} annoy ${f(r.annoy)} honest ${f(honestyRate(r))}`);
  let words = Object.keys(c.lex)
    .map((k) => `${k}="${favoriteWord(c, k)}"`)
    .slice(0, 30)
    .join(" ");
  let mem = c.mem
    .slice(-14)
    .reverse()
    .map((m) => `[${(m.t / D).toFixed(1)}d ${m.k} ${f(m.sal)}] ${m.text}`);
  let txt = [
    `${c.name} #${c.id} · ${stageOf(w, c)} · ${ageDays(w, c).toFixed(2)} days old · ${((c.born + c.lifespan - w.t) / D).toFixed(2)} days left · generation ${c.gen || 0}${c.founder ? " (founder)" : ""}`,
    `parents: ${(c.parents || []).map(n).join(", ") || "-"} · partner: ${c.partner ? n(c.partner) : "-"} · children: ${(c.children || []).map(n).join(", ") || "-"}`,
    `doing: ${c.plan ? c.plan.goal : "-"} / ${c.act ? c.act.type : "-"} · mood ${f(c.mood)} (${moodWord(c)}) · asleep ${!!c.asleep}`,
    `needs: ${kv(c.needs)}`,
    `temperament: ${kv(c.temp)}`,
    `interests: ${kv(c.interests)} · strength ${f(c.strength)} · fear of water ${f(c.fearWater)}`,
    `knows: ${Object.entries(c.know).map(([k, t]) => `${k} (day ${(t / D).toFixed(1)})`).join(", ") || "nothing yet"}`,
    `rituals: ${ritualList(c).map((r) => `${r.g} before ${r.task} ${f(r.s)}`).join(", ") || "-"}`,
    `desires: ${Object.entries(c.desire).filter(([, v]) => v > 0.05).map(([k, v]) => `${k} ${f(v)}`).join(" · ")}`,
    `words: ${words || "-"}`,
    `closest:\n  ${rels.join("\n  ") || "-"}`,
    `gift belief: ${c.beliefs ? `giver ${f(c.beliefs.giver)} · seen ${c.beliefs.seen} · thanks ${c.beliefs.thanks || "-"}${c.beliefs.pattern ? " · noticed the rhythm" : ""}` : "-"}${c.treasure ? ` · keeps ${c.treasure}` : ""}${c.visitor ? " · VISITING" : ""}`,
    `stories (${Object.keys(c.lore || {}).length}):\n  ${Object.entries(c.lore || {}).filter(([k]) => w.stories[k]).map(([k, l]) => `[${l.first ? "saw" : "heard"} ${f(l.conf)}${sameTold(w, w.stories[k], l.v, w.stories[k].truth) ? "" : " DRIFTED"}] ${storyText(w, w.stories[k], l.v)}`).join("\n  ")}`,
    `memories (newest first):\n  ${mem.join("\n  ")}`,
  ].join("\n");
  return `<pre>${escapeHtml(txt)}</pre>`;
}
