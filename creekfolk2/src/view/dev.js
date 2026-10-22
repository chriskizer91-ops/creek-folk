// ==========================================================================
// The developer menu. In the game it's hidden: Ctrl+Shift+D (Cmd+Shift+D on a Mac), or
// open the page with #dev. In the dev build it's the Dev button, which works on a phone.
//
// Jumps move the dev offset forward and the worker replays every moment of the jump, the
// same way it replays a real absence; the menu shows how fast that ran and what 30 days
// would take on this device. The dev build saves a snapshot before every jump (the last
// ten, each restorable) and keeps its own storage, so a jump never touches a real valley.
// ==========================================================================

var DevMenu = class {
  constructor(app) {
    this.app = app;
    this.snaps = [];
    this.jumping = null;
    this.pausedAt = 0;
    this.overlay = null;
    this.readout = lsGet("creekfolk2.devspeed." + BUILD_VERSION, null);
    if (DEV_BUILD) {
      $("bDev").hidden = false;
      $("bDev").onclick = () => this.open();
    }
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "D" || e.key === "d")) e.preventDefault(), this.open();
    });
    if (location.hash === "#dev") setTimeout(() => this.open(), 500);
    $("vDev").onclick = (e) => e.target === $("vDev") && ($("vDev").hidden = true);
  }
  open() {
    this.render();
    $("vDev").hidden = false;
    this.app.post({ type: "snapshots", id: 0 });
  }
  render() {
    let J = [
        ["+1 hour", 3600],
        ["+1 day", 86400],
        ["+1 week", 7 * 86400],
        ["+1 month", 30 * 86400],
        ["+3 months", 91 * 86400],
        ["+6 months", 182 * 86400],
        ["+12 months", 365 * 86400],
      ],
      T = [
        ["storm", "A storm"],
        ["flood", "A big flood"],
        ["birth", "A birth"],
        ["passing", "A passing"],
        ["visitor", "A visitor"],
        ["beavers", "Beavers"],
        ["skycal", "Sky stones"],
        ["returning", "The fish run"],
        ["treasureready", "A treasure (no wait)"],
      ],
      O = [
        [null, "None"],
        ["wet", "Wetness"],
        ["wear", "Worn paths"],
        ["stage", "Creek stage"],
        ["cap", "Land capacity"],
      ],
      r = this.readout,
      h = `<button class="x" id="xDev" aria-label="Close">&times;</button><p class="eyebrow">Developer</p><h2>The valley's clock</h2>`;
    h += `<p class="note">${this.app.paused ? "Paused. " : ""}Dev offset: ${spanText(Clock.dev / 1000)} ahead${Clock.fix ? ` · clock corrected by ${spanText(Math.abs(Clock.fix) / 1000)}` : ""}.</p>`;
    h += `<div class="seg">${J.map(([l, s]) => `<button data-jump="${s}">${l}</button>`).join("")}</div>`;
    h += `<div class="setrow"><span class="lab">Jump to</span><input type="datetime-local" id="devTo"><button class="btn small" id="devToGo">Go</button></div>`;
    h += `<p class="note">${r ? `Last jump: ${spanText(r.span)} replayed in ${(r.ms / 1000).toFixed(1)} s (${Math.round(r.rate).toLocaleString()}× real time). With ${r.n || "this many"} creekfolk, 30 days would take about ${Math.max(1, Math.round((30 * 86400) / r.rate / 60))} min here; more creekfolk take longer.` : "Jump to measure how fast this device replays the valley."}</p>`;
    h += `<div class="setrow"><button class="btn small" id="devPause">${this.app.paused ? "Let the clock run" : "Pause the valley's clock"}</button></div>`;
    h += `<h2>Make it happen</h2><div class="seg">${T.map(([k, l]) => `<button data-trig="${k}">${l}</button>`).join("")}</div>`;
    h += `<h2>Overlays</h2><div class="seg">${O.map(([k, l]) => `<button data-ov="${k || ""}" aria-pressed="${this.overlay === k}">${l}</button>`).join("")}</div>`;
    h += `<h2>Look inside</h2><div class="seg"><button id="devCreek">The creek in numbers</button><button id="devMinds">Read a mind</button></div><div id="devOut"></div>`;
    if (DEV_BUILD) h += `<h2>Snapshots</h2><p class="note">One is taken before every jump.</p><div class="snaps" id="devSnaps"></div>`;
    h += `<div class="setrow"><button class="btn small" id="devNew">Start a new valley</button></div>`;
    let P = $("devPanel");
    P.innerHTML = h;
    $("xDev").onclick = () => ($("vDev").hidden = true);
    for (let b of P.querySelectorAll("[data-jump]")) b.onclick = () => this.jump(+b.dataset.jump);
    for (let b of P.querySelectorAll("[data-trig]")) b.onclick = () => this.app.post({ type: "trigger", what: b.dataset.trig });
    for (let b of P.querySelectorAll("[data-ov]"))
      b.onclick = () => {
        this.overlay = b.dataset.ov || null;
        if (this.app.renderer) this.app.renderer.setOverlay(this.overlay);
        this.render();
      };
    $("devToGo").onclick = () => {
      let v = $("devTo").value,
        ms = v ? new Date(v).getTime() : NaN;
      if (isFinite(ms) && ms > devNow()) this.jump((ms - devNow()) / 1000);
    };
    $("devPause").onclick = () => this.pause(!this.app.paused);
    $("devCreek").onclick = () => this.creekNumbers();
    $("devMinds").onclick = () => this.minds();
    $("devNew").onclick = () => {
      if (!confirm("Start a new valley? This one will be replaced.")) return;
      $("vDev").hidden = true;
      Clock.setDev(0);
      this.app.setClock();
      this.app.newValley();
    };
    this.snapshots(this.snaps);
  }
  async jump(sec) {
    if (this.app.catching) return;
    if (this.app.paused) this.pause(false);
    if (DEV_BUILD) await this.app.ask({ type: "snapshot", label: `before +${spanText(sec)} at ${dateText(this.app.vw.w)}` }, "snapshots");
    this.jumping = { span: sec, from: this.app.vw.t };
    Clock.setDev(Clock.dev + sec * 1000);
    this.app.setClock(true);
    $("vDev").hidden = true;
  }
  caught(m) {
    if (!this.jumping) return;
    let span = m.to - m.from;
    this.jumping = null;
    if (span < 600 || !m.ms) return;
    this.readout = { span, ms: m.ms, rate: span / (m.ms / 1000), at: Date.now(), n: [...this.app.vw.cs.values()].filter((c) => !c.visitor && !c.away).length };
    lsSet("creekfolk2.devspeed." + BUILD_VERSION, this.readout);
  }
  pause(on) {
    if (on === this.app.paused) return;
    this.app.paused = on;
    if (on) this.pausedAt = Date.now();
    else Clock.setDev(Clock.dev - (Date.now() - this.pausedAt));
    this.app.post({ type: "pause", on, offset: Clock.offset() });
    if (!$("vDev").hidden) this.render();
  }
  snapshots(keys) {
    this.snaps = keys || [];
    let el = $("devSnaps");
    if (!el) return;
    el.innerHTML = this.snaps.length ? "" : `<p class="note">None yet.</p>`;
    for (let k of this.snaps.slice().reverse()) {
      let [ms, label] = k.split("|"),
        b = document.createElement("button");
      b.className = "btn small";
      b.textContent = `${new Date(+ms).toLocaleString()} — ${label || "snapshot"}`;
      b.onclick = () => {
        if (!confirm("Go back to this snapshot? The valley as it is now will be replaced.")) return;
        $("vDev").hidden = true;
        this.app.post({ type: "restore", key: k });
      };
      el.append(b);
    }
  }
  async creekNumbers() {
    let w = await this.app.worldCopy();
    if (!w) return;
    let cr = w.creek,
      rows = cr.nodes
        .filter((n, i) => n.z >= 0 && n.z <= VL && i % 5 === 0)
        .map((n) => `<tr><td>${n.z}</td><td>${n.bed.toFixed(2)}</td><td>${n.fp.toFixed(2)}</td><td>${(n.fp - n.bed).toFixed(2)}</td><td>${(n.wl - n.bed).toFixed(2)}</td><td>${(n.q * 1000).toFixed(2)}</td><td>${n.stage}</td></tr>`)
        .join(""),
      B = cr.br || { spring: {}, dry: {} };
    $("devOut").innerHTML =
      `<p class="note">Wet now ${cr.wetNow} · green ${cr.greenNow} · driest ${(creekDriest(w) || {}).wet ?? "-"} · floods ${cr.floods} · feed ${creekFeed(w)} · bumpiness ${JSON.stringify(creekBumpiness(w))} · spring ${(B.spring.q * 1000).toFixed(2)} L/s · Dry Fork ${B.dry.state} ${(B.dry.q * 1000).toFixed(2)} L/s</p>` +
      `<table class="note"><tr><td>z m</td><td>bed</td><td>floor</td><td>trench</td><td>water</td><td>flow L/s</td><td>stage</td></tr>${rows}</table>`;
  }
  async minds() {
    let w = await this.app.worldCopy();
    if (!w) return;
    let el = $("devOut");
    el.innerHTML = "";
    let seg = document.createElement("div");
    seg.className = "seg";
    for (let c of w.creatures) {
      let b = document.createElement("button");
      b.textContent = c.name + (c.visitor ? " (visiting)" : "");
      b.onclick = () => {
        $("vDev").hidden = true;
        this.app.hud.village = w;
        this.app.hud.openMind(c.id);
      };
      seg.append(b);
    }
    el.append(seg);
  }
};
