// ==========================================================================
// Long catch-ups in a Web Worker.
//
// When the page opens after a long gap (or the developer menu jumps ahead),
// the valley is saved, handed to a worker built from the simulation's own
// source (embedded in the page as #creek-sim-src), replayed there in full, and
// loaded back. Short gaps still run on the page, a slice per frame.
// ==========================================================================
var CATCHUP_WORKER_MIN = 30 * 60; // gaps longer than 30 minutes go to the worker

var CatchupWorker = {
  url: null,
  failed: false,
  available() {
    if (this.failed || typeof Worker === "undefined") return false;
    if (!this.url) {
      let src = document.getElementById("creek-sim-src");
      if (!src) return (this.failed = true), false;
      try {
        this.url = URL.createObjectURL(new Blob([src.textContent], { type: "text/javascript" }));
      } catch (e) {
        return (this.failed = true), false;
      }
    }
    return true;
  },
  // Resolves with { save, events, t }; calls onProgress({ t }) as it goes.
  run(save, to, onProgress) {
    return new Promise((resolve, reject) => {
      let w;
      try {
        w = new Worker(this.url);
      } catch (e) {
        this.failed = true;
        reject(e);
        return;
      }
      w.onmessage = (ev) => {
        let m = ev.data;
        if (m.type === "progress") onProgress && onProgress(m);
        else if (m.type === "done") w.terminate(), resolve(m);
        else if (m.type === "error") w.terminate(), reject(new Error(m.message));
      };
      w.onerror = (e) => {
        w.terminate();
        this.failed = true;
        reject(e);
      };
      w.postMessage({ type: "run", save, to });
    });
  },
};
