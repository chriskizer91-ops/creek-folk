// ==========================================================================
// Phase 3C: the valley sounds as healthy as it is. Owner: helper "sound".
//
// Three layers of wild sound, synthesised with WebAudio (no audio files):
//   frogs     evening and night; louder in the wet season, after light rain and near
//             wet ground
//   birds     a dawn chorus, then the morning; more species as the valley greens and
//             the wetland grows, plus a song for every kind of bird given as a gift
//   insects   crickets on warm evenings, a buzz at midday in high summer, the hum and
//             fly-bys of insects on warm days (more near the hives)
// How full each layer is follows the creek's health (soundHealth): on day one, with the
// creek cut down and nothing wet, a lone frog, a lone bird at dawn, a lone cricket; a
// healed valley (from about month six) has a frog chorus, a dawn chorus and a field of
// insects. So the valley's health can be heard with the screen off.
//
// Cheap: each call is one or two oscillators scheduled ahead on the audio clock, a few
// continuous "beds" (distant choruses) are native nodes modulated by slow oscillators,
// and nothing runs per sample in JavaScript. A timer schedules a second or two ahead,
// so it keeps going in a hidden tab. It plays only once the player has turned sound on
// (the layers hang off Sound's master gain, so the volume and sound off apply), and it
// replaces the old fixed night crickets and pond frogs.
//
// Everything here reads the world and never changes it.
// ==========================================================================

var SOUNDSCAPE = {
  tickMs: 250, // how often the timer schedules more sound
  look: 1.4, // seconds scheduled ahead while the page is visible
  lookHidden: 3.2, // ... and while hidden (timers there may slow to once a second)
  stateEvery: 1, // seconds between re-reading the valley
  poll: 0.5, // seconds between a quiet voice's chances to start
  call: { frog: 0.09, bird: 0.05, cricket: 0.04, buzz: 0.1, fly: 0.035 }, // loudness of one close call
  bed: { frogs: 0.09, crickets: 0.006, hum: 0.09 }, // loudness of the distant choruses at their fullest
  gain: { frogs: 1, birds: 1, insects: 1 }, // layer balance
  echo: { time: 0.31, feedback: 0.3, send: 0.5 }, // a little valley echo for far voices
  frogsMax: 10,
  cricketsMax: 6,
};

var soundSS = (a, b, x) => {
  let y = clamp((x - a) / (b - a), 0, 1);
  return y * y * (3 - 2 * y);
};
// a soft bump around c on the day's circle (p and c in 0..1)
function soundBump(p, c, w) {
  let d = Math.abs(p - c);
  d = Math.min(d, 1 - d) / w;
  return Math.exp(-d * d);
}
// a small seeded random source, so a measured render is the same every time
function soundRng(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// How healthy the valley is, for its sounds (each 0..1).
//   wetland   the creek's wet floor now and at last year's driest (0 cut down .. 1 healed)
//   dGreen    how green the floor stayed at last year's driest
//   marsh     how much marsh there is
//   woods     trees beyond the first ones: the grove, orchards, planted timber
//   flowers   flowers given as gifts
function soundHealth(w) {
  let cr = w.creek,
    dr = cr ? creekDriest(w) : null,
    wet = cr ? cr.wetNow || 0 : 0,
    dWet = dr ? dr.wet : wet, // the first year: what is wet now
    dGreen = dr ? dr.green : Math.min(1, wet * 1.2),
    f = (x, full) => clamp(x / full, 0, 1),
    trees = 0;
  for (let r of w.res || []) if (r.kind === "tree" || r.kind === "podtree" || r.kind === "grove" || r.kind === "orchard" || r.kind === "timbertree") trees++;
  let fa = w.fauna,
    flowers = fa && fa.flowers ? fa.flowers.reduce((a, fl) => a + (fl.patches ? fl.patches.length : 0), 0) : 0;
  return {
    wet,
    dWet,
    dGreen,
    wetland: 0.55 * f(dWet, 0.7) + 0.45 * f(wet, 0.75),
    marsh: f((w.hydro && w.hydro.marsh) || 0, 1500),
    woods: f(trees - 62, 160),
    flowers: f(flowers, 40),
    birds: fa && fa.birds ? fa.birds.slice() : [],
    hives: fa && fa.hives ? fa.hives : [],
  };
}

// How wet the land is around (x, z): 0..1, from the marsh field.
function soundLocalWet(w, x, z) {
  let W = w.wet;
  if (!W || !(x >= -20) || !(z >= -20)) return 0;
  let s = 0,
    n = 0;
  for (let dz = -10; dz <= 10; dz += 2)
    for (let dx = -10; dx <= 10; dx += 2) {
      let cx = Math.floor(x + dx),
        cz = Math.floor(z + dz);
      if (cx < 0 || cz < 0 || cx >= VW || cz >= VL) continue;
      s += W[cz * VW + cx];
      n++;
    }
  return n ? s / n : 0;
}

// The birds that can sing, in the order they come back as the valley heals
// (name, health needed, needs a wetland). A gift of a bird adds its own song.
var SOUND_BIRDS = [
  ["robin", 0],
  ["feebee", 0.12],
  ["sparrow", 0.25],
  ["dove", 0.4],
  ["blackbird", 0.45, true],
  ["warbler", 0.6],
  ["wren", 0.78],
];

// What the valley sounds like at time t (default now): for each layer, how many
// voices, how busy, and how loud its distant chorus is.
//   o.t, o.x, o.z, o.dist   time and what the camera looks at
//   o.rain, o.snow          weather overrides (for measuring)
function soundscapeState(w, o = {}) {
  let t = o.t ?? w.t,
    H = o.H || soundHealth(w), // o.H: a made-up health, for measuring
    s = seasonAt(w, t),
    p = dayPhase(t),
    rain = o.rain ?? (w.weather ? w.weather.rain || 0 : 0),
    snow = o.snow ?? (w.t === t && typeof snowLevel === "function" ? snowLevel(w) : 0),
    warm = s.warmth,
    x = o.x ?? VW / 2,
    z = o.z ?? 30,
    local = o.local ?? soundLocalWet(w, x, z),
    zoom = clamp(1.2 - (o.dist ?? 40) / 100, 0.55, 1),
    dayish = soundSS(0.19, 0.25, p) * (1 - soundSS(0.77, 0.83, p)),
    night = 1 - dayish;
  // frogs: dusk until dawn, a few calls by day in the wet season
  let hF = clamp(0.8 * H.wetland + 0.2 * H.marsh, 0, 1),
    tF = Math.max(p >= 0.5 ? soundSS(0.75, 0.86, p) : 1 - soundSS(0.15, 0.25, p), 0.06 * s.wet),
    sF = (0.3 + 0.7 * s.wet) * (0.4 + 0.6 * soundSS(0, 0.3, warm)),
    rF = rain > 1.2 ? 0.3 : rain > 0.05 ? 1.2 : 1,
    aF = tF * sF * rF * (1 - snow);
  // birds: the dawn chorus, the morning, a little through the day and at dusk
  let hB = clamp(0.45 * H.wetland + 0.3 * soundSS(0.3, 0.95, H.dGreen) + 0.25 * H.woods, 0, 1),
    tB = Math.max(soundBump(p, 0.215, 0.035), 0.5 * soundSS(0.19, 0.24, p) * (1 - soundSS(0.38, 0.5, p)), 0.16 * dayish, 0.3 * soundBump(p, 0.79, 0.025)),
    sB = 0.4 + 0.6 * (0.5 + 0.5 * Math.cos((2 * Math.PI * (s.doy - 30)) / YEAR_DAYS)),
    rB = rain > 1.2 ? 0 : rain > 0.2 ? 0.15 : 1,
    aB = tB * sB * rB * (1 - 0.7 * snow),
    sing = {}; // how many of each kind sing: a second and a third come as the valley heals further
  for (let [name, need, wetland] of SOUND_BIRDS) if (hB >= need && (!wetland || H.wetland >= 0.45)) sing[name] = 1 + (hB >= need + 0.22) + (hB >= need + 0.44);
  for (let b of H.birds) if (b !== "owl" && !sing[b]) sing[b] = 1 + (hB >= 0.4) + (hB >= 0.75);
  let owl = H.birds.includes("owl") ? 1 : soundSS(0.75, 0.95, hB);
  // insects: crickets on warm evenings, a midday buzz in high summer, a warm-day hum
  let hI = clamp(0.5 * soundSS(0.25, 0.95, H.dGreen) + 0.35 * H.wetland + 0.15 * H.flowers, 0, 1),
    rI = rain > 0.1 ? 0.08 : 1,
    aC = Math.max(soundBump(p, 0.86, 0.09), 0.5 * soundBump(p, 0.02, 0.12), 0.12 * dayish) * soundSS(0.4, 0.85, warm) * rI * (1 - snow),
    aZ = soundBump(p, 0.5, 0.1) * dayish * soundSS(0.8, 0.98, warm) * rI * (1 - snow),
    aH = dayish * (0.6 + 0.4 * soundBump(p, 0.5, 0.15)) * soundSS(0.3, 0.8, warm) * rI * (1 - snow),
    hiveNear = 0;
  for (let hv of H.hives) hiveNear = Math.max(hiveNear, 1 - clamp((Math.hypot(hv.x - x, hv.z - z) - 6) / 20, 0, 1));
  return {
    t,
    phase: p,
    season: s.name,
    health: { frogs: +hF.toFixed(3), birds: +hB.toFixed(3), insects: +hI.toFixed(3) },
    zoom,
    frogs: {
      n: Math.round(1 + (SOUNDSCAPE.frogsMax - 1) * hF),
      busy: aF * (0.35 + 0.65 * hF), // how keen each one is to call (1 = in full chorus)
      amp: 0.55 + 0.45 * soundSS(0, 0.35, local),
      bed: aF * soundSS(0.3, 1, hF),
      peep: hF > 0.3 && s.wet > 0.45,
      deep: hF > 0.6,
      pause: 3 + 7 * (1 - hF), // seconds of quiet between bouts, when keen
    },
    birds: {
      sing,
      busy: aB * (0.07 + 0.16 * hB), // songs a second, for each bird
      owl: (owl * soundSS(0.5, 1, night) * (rain > 0.2 ? 0 : 1) * (1 - snow)) / 22, // hoots a second, at night
    },
    insects: {
      n: Math.round(1 + (SOUNDSCAPE.cricketsMax - 1) * hI),
      busy: aC,
      period: 1.15 - 0.6 * warm, // crickets chirp faster when it's warm
      pause: 4 + 40 * (1 - hI),
      bed: aC * soundSS(0.3, 1, hI),
      buzz: aZ * (hI > 0.2 ? 0.3 + 0.7 * hI : 0),
      hum: aH * (0.12 + 0.88 * hI) * (1 + 0.6 * hiveNear),
      fly: aH * (0.015 + 0.1 * hI + 0.15 * hiveNear), // fly-bys a second
    },
  };
}

// ---------------------------------------------------------------------------
// The engine: voices on one audio context, sending into one destination node.
// The page's engine sends into Sound's master gain; the measuring tool makes one on an
// OfflineAudioContext.
// ---------------------------------------------------------------------------
var SoundscapeEngine = class {
  constructor(ctx, dest, seed = 1, solo = null) {
    this.ctx = ctx;
    this.rnd = soundRng(seed);
    this.solo = solo;
    this.st = null;
    this.count = { frogs: 0, birds: 0, insects: 0 };
    this.out = ctx.createGain();
    this.out.connect(dest);
    // the valley's echo: a delay fed back through a soft filter
    let E = SOUNDSCAPE.echo,
      d = ctx.createDelay(1),
      fb = ctx.createGain(),
      lp = ctx.createBiquadFilter();
    d.delayTime.value = E.time;
    fb.gain.value = E.feedback;
    lp.type = "lowpass";
    lp.frequency.value = 2400;
    this.echo = ctx.createGain();
    this.echo.gain.value = E.send;
    this.echo.connect(d);
    d.connect(lp);
    lp.connect(fb);
    fb.connect(d);
    lp.connect(this.out);
    this.layer = {};
    for (let k of ["frogs", "birds", "insects"]) {
      let g = ctx.createGain();
      g.gain.value = solo && solo !== k ? 0 : SOUNDSCAPE.gain[k];
      g.connect(this.out);
      this.layer[k] = g;
    }
    this.noise = this.noiseBuffer(2);
    this.agents = [];
    this.makeBeds();
  }
  on(k) {
    return !this.solo || this.solo === k;
  }
  noiseBuffer(sec) {
    let c = this.ctx,
      n = Math.floor(c.sampleRate * sec),
      b = c.createBuffer(1, n, c.sampleRate),
      a = b.getChannelData(0);
    for (let i = 0; i < n; i++) a[i] = this.rnd() * 2 - 1;
    return b;
  }
  // a voice's place: a panner (left/right) and how far it is (quieter, more echo)
  place(layer, pan, far) {
    let c = this.ctx,
      p = c.createStereoPanner ? c.createStereoPanner() : c.createGain(),
      send = c.createGain();
    if (p.pan) p.pan.value = pan;
    send.gain.value = 0.15 + 0.6 * far;
    p.connect(this.layer[layer]);
    p.connect(send);
    send.connect(this.echo);
    return p;
  }
  // a gain whose value swings between lo and hi at rate Hz (an LFO), for the beds
  swing(param, rate, lo, hi, type = "sine") {
    let c = this.ctx,
      l = c.createOscillator(),
      g = c.createGain();
    l.type = type;
    l.frequency.value = rate;
    g.gain.value = (hi - lo) / 2;
    param.value = (hi + lo) / 2;
    l.connect(g);
    g.connect(param);
    l.start();
    return l;
  }
  // The distant choruses: always running, silent until the valley is healthy enough.
  makeBeds() {
    let c = this.ctx;
    // frogs far off: buzzy pulses through a nasal band, swelling and fading
    let fb = c.createGain(),
      fbp = c.createBiquadFilter(),
      flp = c.createBiquadFilter();
    fb.gain.value = 0;
    fbp.type = "bandpass";
    fbp.frequency.value = 1350;
    fbp.Q.value = 3;
    flp.type = "lowpass";
    flp.frequency.value = 1900;
    fbp.connect(flp);
    flp.connect(fb);
    fb.connect(this.layer.frogs);
    fb.connect(this.echo);
    [
      [97, 1.7, 0.31],
      [111, 2.3, 0.19],
      [124, 1.3, 0.43],
    ].forEach(([f, r, slow]) => {
      let o = c.createOscillator(),
        g1 = c.createGain(),
        g2 = c.createGain();
      o.type = "sawtooth";
      o.frequency.value = f;
      this.swing(g1.gain, r, 0, 1);
      this.swing(g2.gain, slow, 0.1, 1);
      o.connect(g1);
      g1.connect(g2);
      g2.connect(fbp);
      o.start();
    });
    this.frogBed = fb;
    // crickets far off: high trills, slowly swelling
    let cb = c.createGain();
    cb.gain.value = 0;
    cb.connect(this.layer.insects);
    [
      [4620, 27, 0.37, -0.4],
      [4910, 31, 0.23, 0.45],
    ].forEach(([f, r, slow, pan]) => {
      let o = c.createOscillator(),
        g1 = c.createGain(),
        g2 = c.createGain(),
        pn = c.createStereoPanner ? c.createStereoPanner() : c.createGain();
      if (pn.pan) pn.pan.value = pan;
      o.frequency.value = f;
      this.swing(g1.gain, r, 0, 1);
      this.swing(g2.gain, slow, 0.15, 1);
      o.connect(g1);
      g1.connect(g2);
      g2.connect(pn);
      pn.connect(cb);
      o.start();
    });
    this.cricketBed = cb;
    // the warm-day hum: a low band of noise that swells, like a meadow full of insects
    let hs = c.createBufferSource(),
      hbp = c.createBiquadFilter(),
      hg = c.createGain(),
      hb = c.createGain();
    hs.buffer = this.noise;
    hs.loop = true;
    hbp.type = "bandpass";
    hbp.frequency.value = 240;
    hbp.Q.value = 2.5;
    this.swing(hg.gain, 0.13, 0.35, 1);
    hb.gain.value = 0;
    hs.connect(hbp);
    hbp.connect(hg);
    hg.connect(hb);
    hb.connect(this.layer.insects);
    hs.start();
    this.humBed = hb;
  }
  // Take in a new state (from soundscapeState). The beds glide to their new levels over
  // a few seconds (tau), quickly for the then-and-now switch, at once (0) when measuring.
  apply(st, now, tau = 2.5) {
    this.st = st;
    let z = st.zoom,
      set = (g, v) => (tau > 0 ? g.gain.setTargetAtTime(v, now, tau) : g.gain.setValueAtTime(v, now));
    if (this.on("frogs")) set(this.frogBed, SOUNDSCAPE.bed.frogs * st.frogs.bed * st.frogs.amp * z);
    if (this.on("insects")) {
      set(this.cricketBed, SOUNDSCAPE.bed.crickets * st.insects.bed * z);
      set(this.humBed, SOUNDSCAPE.bed.hum * st.insects.hum * z);
    }
  }
  // Fade the beds out (sound turned off) and forget what was scheduled.
  silence(now) {
    for (let b of [this.frogBed, this.cricketBed, this.humBed]) b.gain.setTargetAtTime(0, now, 0.2);
    for (let a of this.agents) (a.next = 0), (a.bout = 0);
  }
  // Schedule every call that starts before `until`.
  run(now, until) {
    let st = this.st;
    if (!st) return;
    this.ensureAgents(st);
    for (let a of this.agents) {
      if (a.next < now - 0.05) a.next = now + this.rnd() * SOUNDSCAPE.poll; // after a gap: carry on from now, no burst
      while (a.next < until) a.next = a.step(a, a.next, st);
    }
  }
  // The voices: one per frog, per bird, per cricket, and a few for the rest.
  ensureAgents(st) {
    let want = [];
    if (this.on("frogs")) for (let i = 0; i < SOUNDSCAPE.frogsMax; i++) want.push("frog:" + i);
    if (this.on("birds")) {
      for (let sp in st.birds.sing) for (let i = 0; i < 3; i++) want.push("bird:" + sp + ":" + i);
      want.push("bird:owl:0");
    }
    if (this.on("insects")) {
      for (let i = 0; i < SOUNDSCAPE.cricketsMax; i++) want.push("cricket:" + i);
      want.push("buzz:0", "buzz:1", "fly:0", "fly:1");
    }
    this.have = this.have || new Set();
    for (let id of want) if (!this.have.has(id)) this.have.add(id), this.agents.push(this.makeAgent(id));
  }
  makeAgent(id) {
    let R = this.rnd,
      [kind, a, b] = id.split(":"),
      far = R(),
      ag = { id, kind, next: 0, bout: 0, far, amp: 1 - 0.55 * far, pitch: 0.92 + 0.16 * R(), tempo: 0.9 + 0.2 * R() };
    if (kind === "frog") {
      ag.layer = "frogs";
      ag.i = +a;
      ag.gap = 0.75 + 0.9 * R(); // its own rhythm while calling
      ag.type = ag.i % 4 === 3 ? "deep" : ag.i % 4 === 2 ? "peep" : "ribbit";
      ag.out = this.place("frogs", (R() - 0.5) * 1.6, far);
      ag.step = (g, t, st) => this.frogStep(g, t, st);
    } else if (kind === "bird") {
      ag.layer = "birds";
      ag.sp = a;
      ag.i = +b;
      ag.out = this.place("birds", (R() - 0.5) * 1.8, far);
      ag.motif = Array.from({ length: 4 }, () => this.robinPhrase());
      ag.step = (g, t, st) => this.birdStep(g, t, st);
    } else if (kind === "cricket") {
      ag.layer = "insects";
      ag.i = +a;
      let c = this.ctx,
        o = c.createOscillator(),
        g = c.createGain();
      o.frequency.value = 4300 + 900 * R();
      g.gain.value = 0;
      ag.out = this.place("insects", (R() - 0.5) * 1.6, far);
      o.connect(g);
      g.connect(ag.out);
      o.start();
      ag.gain = g;
      ag.pulses = 3 + Math.floor(R() * 2);
      ag.step = (g2, t, st) => this.cricketStep(g2, t, st);
    } else {
      ag.layer = "insects";
      ag.out = this.place("insects", (R() - 0.5) * 1.4, far);
      ag.step = kind === "buzz" ? (g, t, st) => this.buzzStep(g, t, st) : (g, t, st) => this.flyStep(g, t, st);
    }
    return ag;
  }
  // A quiet voice starts about `rate` times a second; it is asked every POLL seconds,
  // so it answers at once when the valley's state changes (dusk falls, dawn breaks).
  starts(rate) {
    return rate > 0 && this.rnd() < 1 - Math.exp(-rate * SOUNDSCAPE.poll);
  }
  // ---- frogs ----
  frogStep(g, t, st) {
    let F = st.frogs,
      R = this.rnd,
      P = SOUNDSCAPE.poll;
    if (g.i >= F.n || F.busy < 0.004 || (g.type === "peep" && !F.peep) || (g.type === "deep" && !F.deep)) return (g.bout = 0), t + P;
    if (g.bout <= 0) {
      // between bouts: quiet for a while (longer when few are calling)
      if (!this.starts(F.busy / F.pause)) return t + P;
      g.bout = 3 + Math.floor(R() * 10);
      t += R() * P;
    }
    g.bout--;
    let a = SOUNDSCAPE.call.frog * g.amp * F.amp * st.zoom;
    if (g.type === "deep") this.frogDeep(t, a * 1.6, g);
    else if (g.type === "peep") this.frogPeep(t, a * 0.5, g);
    else this.frogRibbit(t, a, g);
    this.count.frogs++;
    return t + (g.type === "deep" ? 2.5 : 1) * g.gap * (0.85 + 0.3 * R());
  }
  // "rib-bit": buzzy pulses through a nasal band, two (sometimes three) syllables
  frogRibbit(t, a, g) {
    let c = this.ctx,
      R = this.rnd,
      o = c.createOscillator(),
      bp = c.createBiquadFilter(),
      v = c.createGain(),
      f = 1250 * g.pitch,
      n = R() < 0.25 ? 3 : 2,
      end = t;
    o.type = "sawtooth";
    o.frequency.setValueAtTime(95 * g.pitch, t);
    bp.type = "bandpass";
    bp.Q.value = 6;
    v.gain.setValueAtTime(0, t);
    for (let k = 0; k < n; k++) {
      let s = t + k * 0.14 * g.tempo,
        d = 0.075 + 0.02 * R();
      bp.frequency.setValueAtTime(f * (k ? 1.1 : 0.9), s);
      bp.frequency.linearRampToValueAtTime(f * (k ? 1.02 : 1.06), s + d);
      v.gain.setValueAtTime(0, s);
      v.gain.linearRampToValueAtTime(a * 3.2, s + 0.012);
      v.gain.linearRampToValueAtTime(a * 2.4, s + d - 0.015);
      v.gain.linearRampToValueAtTime(0, s + d);
      end = s + d;
    }
    o.connect(bp);
    bp.connect(v);
    v.connect(g.out);
    o.start(t);
    o.stop(end + 0.03);
  }
  // a big frog in the pond: a low "gunk"
  frogDeep(t, a, g) {
    let c = this.ctx,
      o = c.createOscillator(),
      lp = c.createBiquadFilter(),
      v = c.createGain(),
      f = 82 * g.pitch;
    o.type = "sawtooth";
    o.frequency.setValueAtTime(f * 1.15, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.25);
    lp.type = "lowpass";
    lp.frequency.value = 420;
    lp.Q.value = 2.5;
    v.gain.setValueAtTime(0, t);
    v.gain.linearRampToValueAtTime(a, t + 0.03);
    v.gain.linearRampToValueAtTime(a * 0.7, t + 0.2);
    v.gain.exponentialRampToValueAtTime(1e-4, t + 0.42);
    o.connect(lp);
    lp.connect(v);
    v.connect(g.out);
    o.start(t);
    o.stop(t + 0.45);
  }
  // a little frog of the wet season: a high, rising "peep"
  frogPeep(t, a, g) {
    let c = this.ctx,
      o = c.createOscillator(),
      v = c.createGain(),
      f = 2500 * g.pitch;
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 1.17, t + 0.12);
    v.gain.setValueAtTime(0, t);
    v.gain.linearRampToValueAtTime(a, t + 0.02);
    v.gain.linearRampToValueAtTime(0, t + 0.13);
    o.connect(v);
    v.connect(g.out);
    o.start(t);
    o.stop(t + 0.16);
  }
  // ---- birds ----
  birdStep(g, t, st) {
    let B = st.birds,
      R = this.rnd,
      P = SOUNDSCAPE.poll,
      owl = g.sp === "owl";
    if (owl ? !this.starts(B.owl) : !(g.i < (B.sing[g.sp] || 0)) || !this.starts(B.busy)) return t + P;
    t += R() * P;
    let notes = this.song(g.sp, g),
      len = notes.length ? notes[notes.length - 1].t + notes[notes.length - 1].d : 1;
    this.playNotes(t, notes, g.out, g.sp === "blackbird" ? { rate: 32, depth: 380, from: notes[2] ? notes[2].t : 0 } : null);
    this.count.birds++;
    return t + len + (owl ? 4 : 0.8) + R();
  }
  robinPhrase() {
    let R = this.rnd,
      f = 1900 + 1100 * R(),
      n = 2 + Math.floor(R() * 2);
    return Array.from({ length: n }, (_, k) => ({ f0: f * (1 + (R() - 0.5) * 0.25 + k * 0.04), f1: f * (1 + (R() - 0.5) * 0.4), d: 0.09 + 0.08 * R() }));
  }
  // A song as notes {t, d, f0, f1, a} (seconds from its start, Hz, loudness).
  song(sp, g) {
    let R = this.rnd,
      P = g.pitch,
      T = g.tempo,
      A = SOUNDSCAPE.call.bird * g.amp,
      out = [],
      at = 0,
      note = (d, f0, f1, a = 1, gap = 0.04) => {
        out.push({ t: at, d: d * T, f0: f0 * P, f1: f1 * P, a: a * A });
        at += (d + gap) * T;
      };
    switch (sp) {
      case "robin": // caroling phrases, each sung twice or so
        for (let k = 0, n = 3 + Math.floor(R() * 4); k < n; k++) {
          let ph = g.motif[Math.floor(R() * g.motif.length)];
          for (let q of ph) note(q.d, q.f0, q.f1, 0.8 + 0.2 * R(), 0.035);
          at += 0.12 + 0.15 * R();
        }
        break;
      case "feebee": // two clear whistles, the second lower
        note(0.32, 3950, 3850, 0.7, 0.07);
        if (R() < 0.3) note(0.12, 3330, 3300, 0.6, 0.03), note(0.16, 3300, 3250, 0.6);
        else note(0.3, 3350, 3280, 0.65);
        break;
      case "sparrow": // a few notes, a trill, a buzz down
        for (let k = 0; k < 3; k++) note(0.06, 3000 + 400 * k, 3100 + 400 * k, 0.8, 0.11);
        for (let k = 0, n = 8 + Math.floor(R() * 7); k < n; k++) note(0.028, 4300, 3700, 0.7, 0.026);
        note(0.18, 3600, 2500, 0.6, 0.05);
        note(0.1, 2900, 2700, 0.5);
        break;
      case "dove": // soft and low: coo-OO, oo, oo
        note(0.28, 500, 590, 0.8, 0.08);
        note(0.45, 640, 540, 1, 0.25);
        note(0.32, 520, 490, 0.75, 0.12);
        note(0.32, 510, 470, 0.7);
        break;
      case "blackbird": // of the marsh: "conk-la-reeee"
        note(0.07, 1700, 2300, 0.8, 0.03);
        note(0.08, 2700, 2400, 0.8, 0.03);
        note(0.75, 3100, 2900, 0.55);
        break;
      case "warbler": // rising, buzzy
        for (let k = 0, n = 5 + Math.floor(R() * 3); k < n; k++) note(0.085, 3800 + 320 * k, 4000 + 330 * k, 0.6, 0.035);
        break;
      case "wren": // a long, bubbling jumble
        for (let k = 0, n = 18 + Math.floor(R() * 12); k < n; k++) note(0.035, 3000 + 3200 * R(), 3000 + 3200 * R(), 0.75, 0.014);
        break;
      case "swallow": // a twitter
        for (let k = 0, n = 6 + Math.floor(R() * 6); k < n; k++) note(0.04, 3600 + 1500 * R(), 3000 + 1200 * R(), 0.6, 0.04 + 0.1 * R());
        break;
      case "kingfisher": // a dry rattle
        for (let k = 0, n = 12 + Math.floor(R() * 8); k < n; k++) note(0.022, 2600, 2300, 0.8, 0.03);
        break;
      case "finch": // a falling run of warbles
        for (let k = 0, n = 8 + Math.floor(R() * 5); k < n; k++) note(0.055, 4600 - 180 * k, 4300 - 180 * k, 0.65, 0.025);
        break;
      case "lark": // high, long and breathless
        for (let k = 0, n = 30 + Math.floor(R() * 20); k < n; k++) note(0.05, 2600 + 2600 * R(), 2600 + 2600 * R(), 0.45, 0.012);
        break;
      case "owl": // hoo ... hoo-hoo, hoooo
        note(0.38, 400, 370, 0.9, 0.35);
        note(0.17, 390, 380, 0.7, 0.07);
        note(0.17, 390, 380, 0.7, 0.3);
        note(0.6, 395, 350, 0.9);
        break;
    }
    return out;
  }
  // One oscillator for a whole song; fm adds a fast trill from note index `from`.
  playNotes(t0, notes, dest, fm = null) {
    if (!notes.length) return;
    let c = this.ctx,
      o = c.createOscillator(),
      v = c.createGain(),
      end = t0;
    v.gain.setValueAtTime(0, t0);
    for (let n of notes) {
      let a = t0 + n.t,
        b = a + n.d,
        att = Math.min(0.012, n.d * 0.3);
      o.frequency.setValueAtTime(n.f0, a);
      o.frequency.exponentialRampToValueAtTime(n.f1, b);
      v.gain.setValueAtTime(0, a);
      v.gain.linearRampToValueAtTime(n.a, a + att);
      v.gain.linearRampToValueAtTime(n.a * 0.7, b - att);
      v.gain.linearRampToValueAtTime(0, b);
      end = b;
    }
    if (fm) {
      let l = c.createOscillator(),
        lg = c.createGain();
      l.frequency.value = fm.rate;
      lg.gain.setValueAtTime(0, t0);
      lg.gain.setValueAtTime(fm.depth, t0 + fm.from);
      l.connect(lg);
      lg.connect(o.frequency);
      l.start(t0);
      l.stop(end + 0.05);
    }
    o.connect(v);
    v.connect(dest);
    o.start(t0);
    o.stop(end + 0.05);
  }
  // ---- insects ----
  cricketStep(g, t, st) {
    let I = st.insects,
      R = this.rnd;
    if (g.i >= I.n || I.busy < 0.01) return (g.bout = 0), t + SOUNDSCAPE.poll;
    if (g.bout <= 0) {
      if (!this.starts(I.busy / I.pause)) return t + SOUNDSCAPE.poll;
      g.bout = 12 + Math.floor(R() * 40);
      t += R() * SOUNDSCAPE.poll;
    }
    g.bout--;
    // one chirp: a few quick pulses of one high note, on the cricket's own oscillator
    let a = SOUNDSCAPE.call.cricket * g.amp * Math.min(1, 0.3 + I.busy) * st.zoom,
      p = g.gain.gain;
    for (let k = 0; k < g.pulses; k++) {
      let s = t + k * 0.034;
      p.setValueAtTime(0, s);
      p.linearRampToValueAtTime(a, s + 0.005);
      p.linearRampToValueAtTime(a * 0.8, s + 0.016);
      p.linearRampToValueAtTime(0, s + 0.021);
    }
    this.count.insects++;
    return t + I.period * g.tempo * (0.96 + 0.08 * R());
  }
  // high summer at midday: a long rising and falling buzz
  buzzStep(g, t, st) {
    let I = st.insects,
      R = this.rnd;
    if (!(I.buzz > 0.02) || !this.starts(I.buzz / 8)) return t + SOUNDSCAPE.poll;
    t += R() * SOUNDSCAPE.poll;
    let c = this.ctx,
      s = c.createBufferSource(),
      bp = c.createBiquadFilter(),
      am = c.createGain(),
      v = c.createGain(),
      d = 3 + 4 * R(),
      a = SOUNDSCAPE.call.buzz * g.amp * I.buzz * st.zoom;
    s.buffer = this.noise;
    s.loop = true;
    bp.type = "bandpass";
    bp.frequency.value = 5200 * g.pitch;
    bp.Q.value = 2.5;
    let l = c.createOscillator(),
      lg = c.createGain();
    l.frequency.value = 85 * g.pitch;
    lg.gain.value = 0.5;
    am.gain.value = 0.5;
    l.connect(lg);
    lg.connect(am.gain);
    v.gain.setValueAtTime(0, t);
    v.gain.linearRampToValueAtTime(a, t + d * 0.35);
    v.gain.setValueAtTime(a, t + d * 0.7);
    v.gain.linearRampToValueAtTime(0, t + d);
    s.connect(bp);
    bp.connect(am);
    am.connect(v);
    v.connect(g.out);
    s.start(t, this.rnd());
    l.start(t);
    s.stop(t + d + 0.05);
    l.stop(t + d + 0.05);
    this.count.insects++;
    return t + d + 1 + 3 * R();
  }
  // a bee or a fly passing by: a buzz that swells and sinks in pitch as it goes
  flyStep(g, t, st) {
    let I = st.insects,
      R = this.rnd;
    if (!this.starts(I.fly)) return t + SOUNDSCAPE.poll;
    t += R() * SOUNDSCAPE.poll;
    let c = this.ctx,
      o = c.createOscillator(),
      lp = c.createBiquadFilter(),
      v = c.createGain(),
      pn = c.createStereoPanner ? c.createStereoPanner() : null,
      d = 1 + 1.5 * R(),
      f = (R() < 0.5 ? 210 : 330) * g.pitch,
      a = SOUNDSCAPE.call.fly * st.zoom,
      dir = R() < 0.5 ? -1 : 1;
    o.type = "sawtooth";
    o.frequency.setValueAtTime(f * 1.06, t);
    o.frequency.linearRampToValueAtTime(f * 0.94, t + d);
    lp.type = "lowpass";
    lp.frequency.value = 900;
    v.gain.setValueAtTime(0, t);
    v.gain.linearRampToValueAtTime(a, t + d * 0.5);
    v.gain.linearRampToValueAtTime(0, t + d);
    o.connect(lp);
    lp.connect(v);
    if (pn) {
      pn.pan.setValueAtTime(-0.8 * dir, t);
      pn.pan.linearRampToValueAtTime(0.8 * dir, t + d);
      v.connect(pn);
      pn.connect(this.layer.insects);
    } else v.connect(g.out);
    o.start(t);
    o.stop(t + d + 0.05);
    this.count.insects++;
    return t + d + 0.5;
  }
};

// ---------------------------------------------------------------------------
// In the page: the engine hangs off Sound's master gain once sound is turned on.
// ---------------------------------------------------------------------------
(function () {
  let enable = Sound.prototype.enable,
    disable = Sound.prototype.disable,
    cricket = Sound.prototype.cricket,
    frog = Sound.prototype.frog;
  Sound.prototype.enable = function () {
    let ok = enable.apply(this, arguments);
    if (ok && this.ctx && !this.scape)
      try {
        this.scape = new SoundscapeEngine(this.ctx, this.master, (Date.now() % 1e9) + 1);
        this.scapeAt = -9;
      } catch (e) {
        console.warn("soundscape unavailable", e);
      }
    return ok;
  };
  Sound.prototype.disable = function () {
    disable.apply(this, arguments);
    this.scape && this.scape.silence(this.ctx.currentTime);
  };
  // the old night crickets and pond frogs are part of the soundscape now
  Sound.prototype.cricket = function () {
    if (!this.scape) return cricket.apply(this, arguments);
  };
  Sound.prototype.frog = function () {
    if (!this.scape) return frog.apply(this, arguments);
  };
})();

// The valley the soundscape listens to: the valley as it is, or as it was on day one
// while then-and-now is held (thennow.js).
function soundscapeWorld(app) {
  let tn = app.thenNow;
  return tn && tn.held && tn.world ? tn.world : app.world;
}

// Re-read the valley now (then-and-now uses this so the sound changes with the picture).
function soundscapeRefresh(app, fast = true) {
  let s = app && app.sound;
  if (!s || !s.scape || !s.on || !app.world) return;
  let w = soundscapeWorld(app),
    r = app.rig && app.rig.cur,
    st = soundscapeState(w, r ? { t: app.world.t, x: r.x, z: r.z, dist: r.dist } : { t: app.world.t });
  s.scape.apply(st, s.ctx.currentTime, fast ? 0.35 : 2.5);
  s.scapeAt = s.ctx.currentTime;
}

setInterval(() => {
  let app = window.__creek,
    s = app && app.sound;
  if (!s || !s.on || !s.scape || !app.world || !s.ctx || s.ctx.state !== "running") return;
  let now = s.ctx.currentTime;
  try {
    if (!(now - s.scapeAt < SOUNDSCAPE.stateEvery)) soundscapeRefresh(app, false);
    s.scape.run(now, now + (document.visibilityState === "hidden" ? SOUNDSCAPE.lookHidden : SOUNDSCAPE.look));
  } catch (e) {
    console.warn("soundscape", e);
    s.scape = null; // fall back to the old sounds rather than fail every tick
  }
}, SOUNDSCAPE.tickMs);

// ---------------------------------------------------------------------------
// For measuring (tools/sound-measure.mjs): render a state offline and report how
// loud and how busy each layer is.
// ---------------------------------------------------------------------------
async function soundscapeRender(st, secs = 20, solo = null, seed = 7, rate = 44100) {
  let C = window.OfflineAudioContext || window.webkitOfflineAudioContext,
    ctx = new C(2, Math.ceil(secs * rate), rate),
    eng = new SoundscapeEngine(ctx, ctx.destination, seed, solo);
  eng.apply(st, 0, 0);
  eng.run(0, secs);
  let n = solo ? eng.count[solo] : eng.count.frogs + eng.count.birds + eng.count.insects;
  return { ...soundStats(await ctx.startRendering()), events: n, perMin: +((n * 60) / secs).toFixed(1) };
}
// The game's own creek-and-wind ambience (Sound), for comparing loudness.
async function soundscapeReference(secs = 10, creek = 0.6, rate = 44100) {
  let C = window.OfflineAudioContext || window.webkitOfflineAudioContext,
    ctx = new C(2, Math.ceil(secs * rate), rate),
    s = new Sound();
  s.ctx = ctx;
  s.master = ctx.createGain();
  s.master.connect(ctx.destination);
  s.makeAmbience();
  s.on = true;
  s.ambience(creek, 0, 0, 40);
  return soundStats(await ctx.startRendering(), 3);
}
// Loudness of a rendered buffer (both channels mixed), skipping the first `skip` seconds.
function soundStats(buf, skip = 0) {
  let L = buf.getChannelData(0),
    R = buf.getChannelData(1),
    win = Math.floor(buf.sampleRate * 0.05),
    sum = 0,
    peak = 0,
    loud = 0,
    frames = 0,
    db = (x) => +(10 * Math.log10(x + 1e-20)).toFixed(1);
  for (let i = Math.floor(skip * buf.sampleRate); i + win <= L.length; i += win) {
    let s = 0;
    for (let j = i; j < i + win; j++) {
      let v = 0.5 * (L[j] + R[j]);
      s += v * v;
      if (Math.abs(v) > peak) peak = Math.abs(v);
    }
    sum += s;
    frames++;
    if (10 * Math.log10(s / win + 1e-20) > -55) loud++;
  }
  return {
    rmsDb: db(sum / Math.max(1, frames * win)),
    peakDb: +(20 * Math.log10(peak + 1e-20)).toFixed(1),
    sounding: +(loud / Math.max(1, frames)).toFixed(3), // share of 50 ms moments louder than -55 dBFS
  };
}
window.__creekSound = { state: soundscapeState, health: soundHealth, render: soundscapeRender, reference: soundscapeReference };
