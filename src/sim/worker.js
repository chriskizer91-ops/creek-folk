// ==========================================================================
// Runs inside a Web Worker: long catch-ups and developer date jumps.
// It receives a saved valley and a target time, replays every moment up to that
// time with exactly the same code the page uses, and sends the valley back.
// ==========================================================================
self.onmessage = (ev) => {
  let m = ev.data;
  if (!m || m.type !== "run") return;
  try {
    let w = loadWorld(m.save),
      events = [],
      now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
    w.onLog = (e) => {
      if (e.imp < 2) return;
      events.push(e);
      if (events.length > 400) {
        let k = events.findIndex((x) => x.imp < 3);
        events.splice(k >= 0 ? k : 0, 1);
      }
    };
    for (;;) {
      let done = runUntil(w, m.to, now() + 250, now);
      self.postMessage({ type: "progress", t: w.t });
      if (done) break;
    }
    w.onLog = null;
    self.postMessage({ type: "done", save: saveWorld(w), events, t: w.t });
  } catch (e) {
    self.postMessage({ type: "error", message: String((e && e.stack) || e) });
  }
};
