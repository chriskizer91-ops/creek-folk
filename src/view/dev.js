// ==========================================================================
// The hidden developer menu.
//
// Open it with Ctrl+Shift+D (Cmd+Shift+D on a Mac), or add #dev to the address.
// Players never see it. It can move the clock forward (by an hour, a day, a
// week, or 1-12 months, or to a chosen date); every jump is replayed in full
// detail through the same catch-up as a real absence, so it doubles as a test
// of catch-up. It also shows the population and lets you read any mind.
//
// The clock offset is a per-browser setting (localStorage), never part of the
// valley's save.
// ==========================================================================
var DEV_KEY = "creekfolk.dev.v1";
var DEV_OFFSET = 0;
try {
  DEV_OFFSET = +JSON.parse(localStorage.getItem(DEV_KEY) || "{}").offset || 0;
} catch (e) {}

// "Now", as the valley sees it: real time plus the developer offset.
function devNow() {
  return Date.now() + DEV_OFFSET;
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
  }
  setOffset(ms) {
    DEV_OFFSET = Math.max(0, Math.round(ms));
    try {
      localStorage.setItem(DEV_KEY, JSON.stringify({ offset: DEV_OFFSET }));
    } catch (e) {}
  }
  jump(ms) {
    if (this.app.catching) return;
    this.jumpStarted = { at: performance.now(), from: this.app.world.t };
    this.setOffset(DEV_OFFSET + ms);
    this.render();
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
<tr><td class="muted">valley date</td><td>${escapeHtml(dateText(w))}, ${seasonAt(w).name} (${(seasonAt(w).progress * 100).toFixed(0)}% through), ${timeOfDayName(w.t)}</td></tr>
<tr><td class="muted">valley age</td><td>${(w.t / D).toFixed(2)} days · began ${escapeHtml(dateText(w, 0))}</td></tr>
<tr><td class="muted">catch-up</td><td>${catching ? `running ${catching.worker ? "in the worker" : "on the page"}: ${durationText(catching.to - catching.from)}` : "idle"}</td></tr>
${lc ? `<tr><td class="muted">last jump</td><td>${durationText(lc.sim)} in ${lc.secs.toFixed(1)} s = ${Math.round(lc.rate).toLocaleString()}× real time ${lc.worker ? "(worker)" : "(page)"}, ${lc.pop} creekfolk</td></tr>` : ""}
</table>
<h5>Jump ahead (replayed in full)</h5>
<div class="row"><button data-j="1">+1 hour</button><button data-j="24">+1 day</button><button data-j="168">+1 week</button></div>
<div class="row">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => `<button data-m="${m}">+${m} mo</button>`).join("")}</div>
<div class="row"><input id="dev-date" type="datetime-local"><button data-go="1">go to date</button>${off > 0 ? `<button data-reset>reset offset</button>` : ""}</div>
${off > 0 ? `<div class="muted">Resetting the offset can't rewind the valley: it keeps running from where it is, so its calendar stays ahead of the real one.</div>` : ""}
<h5>Population</h5>
<table>
<tr><td class="muted">living</td><td>${w.creatures.length} (children ${sc.child}, adults ${sc.adult}, elders ${sc.elder}) · room for ${cap}</td></tr>
<tr><td class="muted">so far</td><td>born ${w.stats.births || 0} · passed on ${w.stats.passings || 0} · downstream ${w.stats.departed || 0} · grove trees ${w.res.filter((r) => r.kind === "grove").length}</td></tr>
<tr><td class="muted">pairs</td><td>${escapeHtml(pairs.join(", ") || "none")}</td></tr>
<tr><td class="muted">next passing</td><td>${nextPass ? `${escapeHtml(nextPass.c.name)} in ${nextPass.left.toFixed(2)} days` : "-"}</td></tr>
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
    `memories (newest first):\n  ${mem.join("\n  ")}`,
  ].join("\n");
  return `<pre>${escapeHtml(txt)}</pre>`;
}
