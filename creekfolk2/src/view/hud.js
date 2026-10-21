// ==========================================================================
// The interface: the clock chip, the line of what's happening, catching up, the clock's
// questions, settings (the valley's clock, a backup file), and the parchment sheets.
// Plain language everywhere the player reads; creekfolk are "they".
// ==========================================================================

var $ = (id) => document.getElementById(id);

var Hud = class {
  constructor(app) {
    this.app = app;
    this.lastLine = null;
    this.toastT = 0;
    this.ambient = false;
    $("bBegin").onclick = () => {
      $("bBegin").disabled = true;
      this.app.newValley();
    };
    $("bSettings").onclick = () => this.openSettings();
    $("xSettings").onclick = () => ($("vSettings").hidden = true);
    $("xAway").onclick = () => ($("vAway").hidden = true);
    $("bVillage").onclick = () => this.openVillage();
    $("bAmbient").onclick = () => this.setAmbient(!this.ambient);
    $("bGapAll").onclick = () => this.answerGap("all");
    $("bGapWrong").onclick = () => this.answerGap("wrong");
    $("bClockSet").onclick = () => this.setClockFromInput();
    $("bClockReset").onclick = () => {
      Clock.setFix(0);
      this.app.setClock();
      this.openSettings();
    };
    $("bExport").onclick = () => this.exportFile();
    $("importFile").onchange = (e) => this.importFile(e.target.files[0]);
    $("line").onclick = () => this.openVillage("log");
    $("bUnfollow").onclick = () => this.app.renderer && this.app.renderer.follow(null);
    $("bMind").onclick = () => this.app.renderer && this.app.renderer.followed && this.openMind(this.app.renderer.followed);
    $("vSheet").onclick = (e) => e.target === $("vSheet") && ($("vSheet").hidden = true);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") for (let v of ["vSheet", "vSettings", "vAway", "vDev"]) $(v).hidden = true;
    });
  }
  // ---- every frame -------------------------------------------------------
  tick(t) {
    let vw = this.app.vw;
    if (!vw.cycle) return;
    let w = { cycle: vw.cycle, calStart: vw.calStart, tzMin: vw.tzMin, t },
      txt = `${dateText(w, t)} · ${timeOfDayName(t)}`;
    if (txt !== this._clock) $("clock").textContent = this._clock = txt;
    if (this.toastT && performance.now() > this.toastT) $("toast").classList.remove("on"), (this.toastT = 0), this.lastLine && this.showLine(this.lastLine);
    if (this.lastLine && performance.now() - (this._agoAt || 0) > 15000) this.showLine(this.lastLine), (this._agoAt = performance.now());
  }
  // ---- what's happening --------------------------------------------------
  onLog(entries) {
    for (let e of entries) {
      if (e.imp >= 2) this.lastLine = e;
      if (e.imp >= 3 && !this.app.catching) this.toast(e.text);
    }
    if (entries.length && this.lastLine) this.showLine(this.lastLine);
  }
  showLine(e) {
    let ago = (this.app.vw.tNow() - e.t) / 60,
      el = $("line");
    // the same news is already being shown big: the line waits until it has gone
    if (this.toastT && $("toast").textContent === e.text) return void (el.hidden = true);
    el.hidden = false;
    el.innerHTML = "";
    el.append(document.createTextNode(e.text));
    if (ago > 1.5) {
      let s = document.createElement("span");
      s.className = "ago";
      s.textContent = spanText(ago * 60) + " ago";
      el.append(s);
    }
  }
  toast(text, sec = 6) {
    let el = $("toast");
    el.textContent = text;
    el.classList.add("on");
    this.toastT = performance.now() + sec * 1000;
  }
  error(msg) {
    console.error(msg);
    this.toast(String(msg).split("\n")[0], 10);
  }
  saved() {}
  setAmbient(on) {
    this.ambient = on;
    document.body.classList.toggle("ambient", on);
    $("bAmbient").setAttribute("aria-pressed", String(on));
    if (this.app.renderer) this.app.renderer.setAmbient(on);
  }
  welcomeBack() {
    if (this.app.renderer && this.app.renderer.welcomeBack) this.app.renderer.welcomeBack();
  }
  // ---- the first moment --------------------------------------------------
  showStart(note) {
    $("vStart").hidden = false;
    $("bBegin").disabled = false;
    $("startNote").hidden = !note;
    if (note) $("startNote").textContent = note;
  }
  hideStart() {
    $("vStart").hidden = true;
  }
  refused(m) {
    if (m.where === "saved") return this.showStart(m.message + " A new valley will start here.");
    $("setNote").textContent = m.message;
    this.toast(m.message, 8);
  }
  // ---- catching up -------------------------------------------------------
  catchup(m) {
    let v = $("vCatch");
    if (v.hidden) {
      v.hidden = false;
      $("catchTitle").textContent = `Catching up on ${spanText(m.to - m.from)}`;
      $("catchKeep").hidden = m.to - m.from < 6 * 3600;
    }
    let f = clamp((m.t - m.from) / Math.max(1, m.to - m.from), 0, 1);
    $("catchBar").style.width = (f * 100).toFixed(1) + "%";
    if (m.ms > 1500 && f > 0.01) {
      let rate = (m.t - m.from) / (m.ms / 1000),
        left = (m.to - m.t) / Math.max(1, rate);
      $("catchNote").textContent = `Every moment is being replayed: ${spanText(m.t - m.from)} of ${spanText(m.to - m.from)} so far, about ${spanText(left)} to go.`;
    } else $("catchNote").textContent = "Every moment is being replayed.";
  }
  caught(m) {
    $("vCatch").hidden = true;
    let ev = (m.events || []).filter((e) => e.imp >= 3);
    if (m.to - m.from > 3 * 3600 && ev.length) {
      $("awayTitle").textContent = `${spanText(m.to - m.from)} in the valley`;
      let L = $("awayList");
      L.innerHTML = "";
      let w = { cycle: this.app.vw.cycle, calStart: this.app.vw.calStart, tzMin: this.app.vw.tzMin };
      for (let e of ev.slice(-40)) {
        let p = document.createElement("p");
        p.innerHTML = `<span class="note">${dateText(w, e.t)}</span><br>`;
        p.append(document.createTextNode(e.text));
        L.append(p);
      }
      $("vAway").hidden = false;
    }
  }
  // ---- the clock -------------------------------------------------------
  gap(m) {
    $("gapTitle").textContent = `It looks like ${spanText(m.to - m.from)} have passed`;
    $("gapText").textContent = `The last time the valley was open, this computer's clock read ${new Date(this.app.vw.calStart + m.from * 1000).toLocaleString()}. Now it reads ${new Date(devNow()).toLocaleString()}. If that's right, every moment of it will be replayed, which takes a while. If the clock is wrong, the valley can carry on from where it was.`;
    $("vGap").hidden = false;
  }
  answerGap(choice) {
    $("vGap").hidden = true;
    this.app.post({ type: "gapAnswer", choice });
  }
  waiting(m) {
    let s = $("sub");
    if (m.behind > 0) {
      s.hidden = false;
      s.textContent = `The clock reads earlier than the valley's last moment, so the valley is waiting for it (${spanText(m.behind)}).`;
    } else s.hidden = true;
  }
  openSettings() {
    let vw = this.app.vw,
      now = new Date(devNow());
    $("clockText").textContent =
      `The valley keeps time by this computer's clock${Clock.fix ? ", corrected" : ""}. It reads ${now.toLocaleString()} now. If that's wrong, set the right time here; the valley will keep it from now on.` +
      (vw.calStart ? ` This valley began on ${new Date(vw.calStart).toLocaleDateString()}.` : "");
    let pad = (n) => String(n).padStart(2, "0");
    $("clockInput").value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    $("setNote").textContent = "";
    $("vSettings").hidden = false;
  }
  setClockFromInput() {
    let v = $("clockInput").value,
      ms = v ? new Date(v).getTime() : NaN;
    if (!isFinite(ms)) return ($("setNote").textContent = "That isn't a time the valley can read.");
    Clock.setFix(ms - (Date.now() + Clock.dev));
    this.app.setClock();
    this.openSettings();
    $("setNote").textContent = "The valley's clock is set.";
  }
  async exportFile() {
    let r = await this.app.ask({ type: "getWorld" }, "world");
    if (!r || !r.save) return ($("setNote").textContent = "There's no valley to save yet.");
    let a = document.createElement("a"),
      d = new Date(devNow());
    a.href = URL.createObjectURL(new Blob([r.save], { type: "application/json" }));
    a.download = `creekfolk2-valley-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    $("setNote").textContent = "Saved. Keep the file somewhere safe.";
  }
  importFile(f) {
    if (!f) return;
    let r = new FileReader();
    r.onload = () => {
      $("setNote").textContent = "Opening…";
      this.app.post({ type: "import", text: String(r.result) });
    };
    r.readAsText(f);
    $("importFile").value = "";
  }
  // ---- sheets ------------------------------------------------------------
  sheet(html) {
    $("sheet").innerHTML = `<button class="x" aria-label="Close">&times;</button>` + html;
    $("sheet").querySelector(".x").onclick = () => ($("vSheet").hidden = true);
    $("vSheet").hidden = false;
    for (let el of $("sheet").querySelectorAll("[data-who]")) el.onclick = () => this.openMind(+el.dataset.who);
    return $("sheet");
  }
  async openVillage(tab = "land") {
    let w = await this.app.worldCopy();
    if (!w) return;
    this.village = w;
    this.renderVillage(tab);
  }
  renderVillage(tab) {
    let w = this.village,
      tabs = [
        ["land", "Land"],
        ["people", "People"],
        ["log", "What happened"],
      ],
      body = tab === "people" ? villagePeople(w) : tab === "log" ? villageLog(w) : villageLand(w),
      el = this.sheet(
        `<h2>The valley</h2><p class="k">${esc(dateText(w))}, the valley's ${ordinal(Math.floor(w.t / 86400) + 1)} day</p>` +
          `<div class="tabs">${tabs.map(([k, l]) => `<button data-tab="${k}" aria-pressed="${k === tab}">${l}</button>`).join("")}</div>` +
          body,
      );
    for (let b of el.querySelectorAll("[data-tab]")) b.onclick = () => this.renderVillage(b.dataset.tab);
  }
  async openMind(id) {
    let w = (this.village && this.village.t >= this.app.vw.t - 5 && this.village) || (await this.app.worldCopy());
    if (!w) return;
    this.village = w;
    let c = w.byId[id];
    if (!c) return;
    this.sheet(mindSheet(w, c));
  }
};

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}
function ordinal(n) {
  let s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
