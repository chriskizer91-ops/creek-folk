// ==========================================================================
// The real calendar.
//
// The valley's date is the player's real date. A world remembers the moment it
// began (calStart, epoch ms) and the player's time-zone offset at that moment
// (tzMin), so the same world gives the same dates in the page, the worker and
// the Node tests. Seasons are astronomical, Northern Hemisphere: a temperate
// four-season valley.
//
// One valley day lasts one real hour (see VALLEY_DAY), so a season is roughly
// 2,200 valley days long: an era, as far as any one creekfolk can tell.
// ==========================================================================

var VALLEY_DAY = 3600; // seconds of real time in one valley day
var REAL_DAY = 86400;

// Day-of-year (1-based, non-leap reckoning is close enough) where each season starts.
var SEASON_STARTS = [
  { name: "spring", doy: 79 },  // ~Mar 20
  { name: "summer", doy: 172 }, // ~Jun 21
  { name: "autumn", doy: 265 }, // ~Sep 22
  { name: "winter", doy: 355 }, // ~Dec 21
];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The valley's local date as a UTC-based Date whose UTC fields read as local time.
function valleyDate(w, t = w.t) {
  return new Date((w.calStart || 0) + t * 1000 - (w.tzMin || 0) * 60000);
}

function dayOfYear(d) {
  let start = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.floor((d.getTime() - start) / 864e5) + 1;
}

// Season at time t: { name, progress (0..1 through the season), doy, warmth (0 coldest .. 1 warmest) }
function seasonAt(w, t = w.t) {
  let d = valleyDate(w, t),
    doy = dayOfYear(d) + (d.getUTCHours() + d.getUTCMinutes() / 60) / 24;
  let idx = 3; // winter wraps the year end
  for (let k = 0; k < SEASON_STARTS.length; k++) if (doy >= SEASON_STARTS[k].doy) idx = k;
  let start = SEASON_STARTS[idx].doy,
    next = idx === 3 ? SEASON_STARTS[0].doy + 365 : SEASON_STARTS[idx + 1].doy,
    pos = idx === 3 && doy < start ? doy + 365 : doy;
  // Coldest around Jan 20, warmest around Jul 21.
  let warmth = 0.5 - 0.5 * Math.cos((2 * Math.PI * (doy - 20)) / 365);
  return {
    name: SEASON_STARTS[idx].name,
    progress: clamp((pos - start) / (next - start), 0, 1),
    doy,
    warmth: +warmth.toFixed(3),
  };
}

function dateText(w, t = w.t) {
  let d = valleyDate(w, t);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

// How long the valley has existed, in real days.
function valleyAgeDays(w, t = w.t) {
  return t / REAL_DAY;
}
