# One-time edits to the recovered view (src/view/view.js) for Phase 1.
# Kept for the record; running it twice fails on purpose (every edit must match exactly once).
import sys

p = 'src/view/view.js'
s = open(p).read()


def rep(old, new):
    global s
    n = s.count(old)
    assert n == 1, (old[:100], n)
    s = s.replace(old, new)


def replace_method(cls_marker, start, end_marker, new):
    """Replace the method starting with `start` (inside the class that begins at
    `cls_marker`) up to the next `end_marker`, both searched after the class start."""
    global s
    c = s.index(cls_marker)
    i = s.index(start, c)
    j = s.index(end_marker, i + len(start))
    s = s[:i] + new + s[j:]


APP = '  var App = class {'

# ---- memorial trees in the grove
rep('''          case "sprout":{
              let a = xm(0);''', '''          case "grove":{ // LIFE: a memorial tree; it grows from a sapling over the months
              let a = xm(groveStage(this.world, t)),
                l = new Et(a.trunk, he()),
                c = new Et(a.crown, he());
              l.castShadow = c.castShadow = !0, e.rotation.y = r, e.add(l, c);
              e.add(new Et(mergeParts([part(on(0.09), PALETTE.stone2, { x: 0.32, y: 0.05, z: 0.18 })]), he()));
              break;
            }
          case "sprout":{
              let a = xm(0);''')
rep('''        return t.kind === "orchard" ?
        "o" + t.stage + (t.guard ? "g" : "") :''', '''        return t.kind === "orchard" ?
        "o" + t.stage + (t.guard ? "g" : "") :
        t.kind === "grove" ? "g" + groveStage(this.world, t) :''')

# ---- clock, settings, welcome, creature panel
rep('''    return `Day ${dayNumber(i.t)} \\xB7 ${timeOfDayName(i.t)}`;''',
    '''    return `${dateText(i)} \\xB7 ${seasonAt(i).name} \\xB7 ${timeOfDayName(i.t)}`; // LIFE: the real calendar''')
rep('''      ${e("realClock", "Day and night follow my clock", "off: a full day passes every 2 hours")}
''', '')
rep('''      <details class="testing"><summary>Testing tools</summary>
      <p class="muted">Skipping ahead runs the full simulation for that stretch, exactly as if it had passed. The valley stays that far ahead of the clock.</p>
      <div class="btnrow"><button class="pill" data-act="skip" data-h="1">+1 hour</button><button class="pill" data-act="skip" data-h="6">+6 hours</button><button class="pill" data-act="skip" data-h="24">+1 day</button></div>
      </details>
''', '')
rep('''<p class="muted small">Creekfolk (working title) \\xB7 everything runs on this device; nothing is sent anywhere.</p>''',
    '''<p class="muted small">Creekfolk \\xB7 everything runs on this device; nothing is sent anywhere.</p>''')
rep('''      <p>Six small creatures have just woken up in a meadow beside a creek. They have their own temperaments, needs, and curiosities, and they will figure out the valley \\u2014 and each other \\u2014 on their own.</p>
      <p>Everything happens in real time. Small things take seconds; a mud hut takes hours; the biggest projects take days. When you close the game, the valley keeps its clock, and the full simulation catches up when you return.</p>''',
    '''      <p>Five small creatures have just woken up in a meadow beside a creek. They have their own temperaments, needs, and curiosities, and they will figure out the valley \\u2014 and each other \\u2014 on their own.</p>
      <p>Everything happens in real time, and there is no way to hurry it. A day in the valley lasts an hour; the seasons follow your own calendar. A creekfolk lives about a month: a child, then a grown-up, then a wise elder. Their children will carry on what they started.</p>
      <p>When you close the game, the valley keeps its clock, and every moment is simulated when you return.</p>''')
rep('''<div class="sh-sub">${escapeHtml(moodWord(n))}${r.length ? " \\xB7 known for " + r.join(" and ") : ""}</div>''',
    '''<div class="sh-sub">${escapeHtml(lifeLine(e, n))}</div><div class="sh-sub">${escapeHtml(moodWord(n))}${r.length ? " \\xB7 known for " + r.join(" and ") : ""}</div>''')
rep('''      creatureHTML(t) {
        let e = this.w,
          n = e.byId[t];
        if (!n) return this.header("Gone");''', '''      creatureHTML(t) {
        let e = this.w,
          n = e.byId[t];
        if (!n) return goneHTML(this, e, t); // LIFE: passed on or gone downstream''')

# ---- the app: IndexedDB, the calendar, the developer clock, the worker catch-up
rep('''      this.wakeStatus = "",
      this.loadOrCreate(),
      this.resize(),''', '''      this.wakeStatus = "",
      this.store = new ValleyStore(), // LIFE: saves live in IndexedDB (src/view/store.js)
      this.dev = new DevMenu(this), // LIFE: hidden developer menu (src/view/dev.js)''')
rep('''      this.last = performance.now(),
      this.lastFrame = 0,
      requestAnimationFrame((t) => this.frame(t)),
      window.__creek = this;''', '''      this.last = performance.now(),
      this.lastFrame = 0,
      this.loadOrCreate().then(() => {
        this.resize(), requestAnimationFrame((t) => this.frame(t));
      }),
      window.__creek = this;''')

replace_method(APP, '    loadOrCreate() {', '    newWorld(t) {', '''    async loadOrCreate() {
      let t = null,
        e = null;
      for (let n of ["main", "backup"]) {
        let r = await this.store.get(n);
        if (r)
        try {
          t = loadWorld(r), e = n;
          break;
        } catch (o) {
          console.warn("save unreadable", n, o);
        }
      }
      if (!t && this.ls)
      for (let n of [SAVE_KEY, BACKUP_KEY]) {
        let r = this.ls.getItem(n);
        if (r)
        try {
          t = loadWorld(r), e = "legacy";
          break;
        } catch (o) {
          console.warn("old save unreadable", n, o);
        }
      }
      this.store.available || this.hud.saveWarn.classList.remove("hidden");
      t ?
      (this.setWorld(t),
      e === "backup" && this.hud.toast("Restored from the backup save."),
      e === "legacy" && (this.save(), this.hud.toast("Your valley has moved to the new save storage."))) :
      (t = this.newWorld(), this.setWorld(t), this.save(), setTimeout(() => this.hud.showWelcome(), 300));
    }
''')
rep('''      let e = createWorld(t);
      return e.realStart = Date.now(), e.skip = 0, e;''', '''      let n = devNow(),
        e = newValley(t, { calStart: n, tzMin: new Date(n).getTimezoneOffset() }); // LIFE: five founders on the real calendar
      return e.realStart = n, e.skip = 0, e;''')
replace_method(APP, '    applyClock() {', '    setWorld(t) {', '''    applyClock() {
      setDayCycle(this.world.cycle || null);
    }
''')
rep('''      !!t.cycle != !!this.settings.realClock && (
      this.world = t, this.applyClock()),''', '''      this.applyClock(),''')
rep('''        e = (Date.now() - t.realStart) / 1e3 + (t.skip || 0);''',
    '''        e = (devNow() - t.realStart) / 1e3 + (t.skip || 0); // LIFE: devNow() adds the developer offset''')
rep('''      t.realStart = Date.now() - (t.t - (t.skip || 0)) * 1e3, e = t.t),''',
    '''      t.realStart = devNow() - (t.t - (t.skip || 0)) * 1e3, e = t.t),''')
replace_method(APP, '    save() {', '    saveInfo() {', '''    save() {
      if (!this.world || this.catching) return !1;
      let t;
      try {
        t = saveWorld(this.world);
      } catch (e) {
        return console.warn("save failed", e), !1;
      }
      let e = performance.now() - this.lastBak > 600 * 1e3;
      e && (this.lastBak = performance.now());
      this.store.put("main", t).
      then(() => (e ? this.store.put("backup", t) : !0)).
      then(() => {
        this.lastSaveSize = t.length, this.lastSaveAt = Date.now(), this.hud.saveWarn.classList.add("hidden");
      }).
      catch((n) => {
        console.warn("save failed", n), this.hud.saveWarn.classList.remove("hidden");
      });
      return !0;
    }
''')
rep('''        n = this.ls ?''', '''        n = this.store.available ?''')
rep('''        text: `This valley is ${e} old (seed \\u201C${t.seed}\\u201D). ${n} Export makes a file you can import on another device.`,''',
    '''        text: `This valley began on ${dateText(t, 0)} and is ${e} old (seed \\u201C${t.seed}\\u201D). ${n} A year is a long time to trust a browser, so export a backup file now and then; it can be imported on any device.`,''')
replace_method(APP, '        case "skip":{', '        case "newworld":{', '')
rep('''      t === "realClock" && this.applyClock(),
''', '')
rep('''        n.realStart || (n.realStart = Date.now() - n.t * 1e3, n.skip = 0),''',
    '''        n.realStart || (n.realStart = devNow() - n.t * 1e3, n.skip = 0),''')

rep('''      {
        let h = this.catching;
        h.to = a;
        let d = runUntil(o, a, performance.now() + 40, () => performance.now()),
          u = (o.t - h.from) / Math.max(1, h.to - h.from);''', '''      {
        let h = this.catching;
        h.to = a;
        // LIFE: long gaps are replayed in a Web Worker (src/view/catchup.js), every moment in full,
        // so the page stays responsive. The worker returns the caught-up valley; any time that
        // passed while it worked is then run here as before.
        if (!h.worker && !h.workerDone && h.to - o.t > CATCHUP_WORKER_MIN && CatchupWorker.available()) {
          h.worker = !0, h.workerFrom = o.t;
          CatchupWorker.run(saveWorld(o), h.to, (m) => h.workerT = m.t).
          then((m) => h.result = m).
          catch((m) => (console.warn("catch-up worker failed, catching up here instead", m), h.worker = !1, h.workerDone = !0));
        }
        if (h.worker) {
          if (h.result) {
            let m = h.result;
            h.result = null, h.worker = !1, h.workerDone = !0;
            let x = loadWorld(m.save);
            for (let y of m.events) h.events.push(y);
            this.setWorld(x), o = this.world;
          } else {
            let m = ((h.workerT ?? h.workerFrom) - h.from) / Math.max(1, h.to - h.from);
            t - h.started > 250 && this.hud.showCatchup(!0, m, `Catching up on ${durationText(h.to - h.from)}\\u2026`);
            return;
          }
        }
        let d = runUntil(o, a, performance.now() + 40, () => performance.now()),
          u = (o.t - h.from) / Math.max(1, h.to - h.from);''')

open(p, 'w').write(s)
print('view patched')
