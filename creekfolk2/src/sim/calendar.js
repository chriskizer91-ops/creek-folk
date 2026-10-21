// ==========================================================================
// The valley's own calendar (Phase 3A).
//
// One valley day is one real hour. A valley year is 192 valley days, about
// eight real days, so a season lasts two real days: not exactly a week, so the
// seasons drift across weekdays and a weekend player still sees all four. A
// creekfolk lives about four valley years; a real year holds about 45.
//
// Winter and spring are the wet season (storms, a running creek); summer and
// autumn are the dry season. A new valley begins on the first morning of spring.
// Valley dates no longer follow the real calendar; world.calStart is kept only
// to say when, in real life, the valley began.
// ==========================================================================

var VALLEY_DAY = 3600; // seconds of real time in one valley day
var REAL_DAY = 86400;
var YEAR_DAYS = 192; // valley days in a valley year
var SEASON_DAYS = YEAR_DAYS / 4;
var SEASON_NAMES = ["spring", "summer", "autumn", "winter"];
var MIDWINTER_DOY = 168; // the middle of winter: their midwinter
var MIDSUMMER_DOY = 72;
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Valley days since the first midnight before the valley began (fractional).
// The day cycle's offset puts t = 0 at mid-morning of the first day.
function valleyDays(w, t = w.t) {
  let off = (w && w.cycle && w.cycle.off) ?? 0.27;
  return t / VALLEY_DAY + off;
}

// The real date (UTC-based Date whose UTC fields read as the player's local time).
function valleyDate(w, t = w.t) {
  return new Date((w.calStart || 0) + t * 1000 - (w.tzMin || 0) * 60000);
}

// How wet the season is at day-of-year doy, 0 (the heart of the dry season) .. 1
// (the heart of the wet season). Wettest where winter turns to spring, driest
// where summer turns to autumn; above 0.5 all through winter and spring.
function seasonWetness(doy) {
  let c = Math.cos((2 * Math.PI * doy) / YEAR_DAYS); // 1 wettest .. -1 driest
  return clamp(0.5 + 0.6 * c, 0, 1);
}

// Season at time t:
//   name, idx (0 spring .. 3 winter), progress (0..1 through the season),
//   doy (0..192, fractional), day (1-based day of the season), year (1-based),
//   warmth (0 midwinter .. 1 midsummer), wet (0..1, see seasonWetness),
//   wetSeason (winter or spring)
function seasonAt(w, t = w.t) {
  let days = valleyDays(w, t),
    year = Math.floor(days / YEAR_DAYS),
    doy = days - year * YEAR_DAYS,
    idx = Math.min(3, Math.floor(doy / SEASON_DAYS)),
    into = doy - idx * SEASON_DAYS;
  return {
    name: SEASON_NAMES[idx],
    idx,
    progress: into / SEASON_DAYS,
    doy,
    day: Math.floor(into) + 1,
    year: year + 1,
    warmth: +(0.5 - 0.5 * Math.cos((2 * Math.PI * (doy - MIDWINTER_DOY)) / YEAR_DAYS)).toFixed(3),
    wet: +seasonWetness(doy).toFixed(3),
    wetSeason: idx === 0 || idx === 3,
  };
}

// "Day 12 of spring, year 3"
function dateText(w, t = w.t) {
  let s = seasonAt(w, t);
  return `Day ${s.day} of ${s.name}, year ${s.year}`;
}

// The real-world date the valley began, for the settings panel.
function realStartText(w) {
  let d = valleyDate(w, 0);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// Valley days until the next midwinter morning (their midwinter).
function daysToMidwinter(w, t = w.t) {
  let doy = seasonAt(w, t).doy,
    d = MIDWINTER_DOY + 0.22 - doy;
  return d < 0 ? d + YEAR_DAYS : d;
}

// How long the valley has existed, in real days.
function valleyAgeDays(w, t = w.t) {
  return t / REAL_DAY;
}
