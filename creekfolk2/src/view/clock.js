// ==========================================================================
// The page's clock, and where each build keeps its valley.
//
// The valley's time comes from the real clock plus two corrections, both kept in this
// browser only (never in the save):
//   - the player's: Settings can set the valley's clock, for a computer whose own clock
//     is wrong and can never be corrected from the internet;
//   - the developer's: the dev menu's jumps move it forward (each build keeps its own).
// devNow() is the clock the whole page uses; never Date.now() for valley time.
// ==========================================================================

var VALLEY_DB = "creekfolk2-" + BUILD_VERSION.replace(/^cf2-/, "") + (DEV_BUILD ? "-dev" : "");
var CLOCK_KEY = "creekfolk2.clock." + BUILD_VERSION + (DEV_BUILD ? "-dev" : "");
var DEVOFF_KEY = "creekfolk2.dev." + BUILD_VERSION + (DEV_BUILD ? "-dev" : "");

function lsGet(k, d) {
  try {
    let v = localStorage.getItem(k);
    return v == null ? d : JSON.parse(v);
  } catch (e) {
    return d;
  }
}
function lsSet(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
}

var Clock = {
  fix: +lsGet(CLOCK_KEY, 0) || 0, // ms: the player's correction
  dev: +lsGet(DEVOFF_KEY, 0) || 0, // ms: the developer's offset
  offset() {
    return this.fix + this.dev;
  },
  setFix(ms) {
    this.fix = Math.round(ms);
    lsSet(CLOCK_KEY, this.fix);
  },
  setDev(ms) {
    this.dev = Math.round(ms);
    lsSet(DEVOFF_KEY, this.dev);
  },
};

function devNow() {
  return Date.now() + Clock.offset();
}

// "3 days", "an hour and a half", "five weeks": a span of real time in plain words.
function spanText(sec) {
  let m = sec / 60,
    h = m / 60,
    d = h / 24;
  if (m < 1.5) return "a moment";
  if (m < 50) return `${Math.round(m)} minutes`;
  if (h < 1.3) return "an hour";
  if (h < 23) return `${Math.round(h)} hours`;
  if (d < 1.5) return "a day";
  if (d < 13) return `${Math.round(d)} days`;
  if (d < 60) return `${Math.round(d / 7)} weeks`;
  if (d < 600) return `${Math.round(d / 30.4)} months`;
  return `${(d / 365).toFixed(1)} years`;
}
