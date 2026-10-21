// Phase 3C: the sky stones, the procession path and the Returning: the sunrise through the
// crown and the gold water on its steps; the glowing fish swimming up the creek to the
// spring; lanterns along the channels; fireflies; the lanterns on the pyramid, one for each
// creekfolk who passed; the one who believes in you looking up. Also the Temple tab's 3C
// lines ("the next Returning is in 3 days"). Reads the world, never changes it.

// ---- the sky stones (local +z faces their midwinter sunrise) ----
function buildSkycalView(r, s, level, b, prog) {
  let f = greatPartsFn(level, b, prog),
    P = (g, c, o) => r.push(part(g, c, o)),
    R = 2.2;
  if (f(0, 0)) P(lt(0.45, 0.55 * f(0, 0), 0.4), PALETTE.stone2, { y: 0.27 * f(0, 0) });
  // markers on an arc toward the sunrise: midwinter (tallest), the equinoxes, midsummer
  let mk = [
    [1, 0, 1.25],
    [2, 0.5, 0.85],
    [3, 1.1, 0.95],
    [4, 0.62, 0.85],
  ];
  for (let [k, a, hgt] of mk) {
    let p = f(0, k);
    if (!p) continue;
    P(lt(0.24, hgt * p, 0.2), k === 1 ? PALETTE.stone : PALETTE.stone2, { x: Math.sin(a) * R, y: (hgt * p) / 2, z: Math.cos(a) * R, ry: a });
  }
  if (f(0, 5)) for (let i = 0; i < Math.round(14 * f(0, 5)); i++) P(on(0.09), i % 2 ? PALETTE.stone : PALETTE.stone2, { x: Math.cos(i * 0.449) * 2.9, y: 0.04, z: Math.sin(i * 0.449) * 2.9, sy: 0.6 });
}
STRUCTURE_BUILDERS.skycal = buildSkycalView;

// ---- the procession path's stone yard (the path itself is drawn by ReturningView) ----
function buildPathYardView(r, s, level, b) {
  if (level >= 1) return;
  let P = (g, c, o) => r.push(part(g, c, o));
  for (let i = 0; i < 6; i++) P(on(0.18), i % 2 ? PALETTE.stone : PALETTE.stone2, { x: (i % 3) * 0.35 - 0.35, y: 0.12 + (i > 2 ? 0.2 : 0), z: i > 2 ? 0.1 : -0.1, sy: 0.55 });
  P(yt(0.04, 0.05, 1.1, 4), PALETTE.plank2, { x: 0.7, y: 0.4, rz: 1.2 });
}
STRUCTURE_BUILDERS.path = buildPathYardView;

// Local (temple) coordinates to the world.
function templeToWorld(t, lx, lz) {
  let r = t.rot || 0;
  return { x: t.x + lx * Math.cos(r) + lz * Math.sin(r), z: t.z - lx * Math.sin(r) + lz * Math.cos(r) };
}

var RETURN_LANTERNS_SHOWN = 320;

var ReturningView = class {
  constructor(world, scene, group) {
    this.world = world;
    this.group = new Pe();
    group.add(this.group);
    let inst = (geom, n, mat) => {
      let m = new Ts(geom, mat, n);
      m.count = 0;
      m.frustumCulled = false;
      this.group.add(m);
      return m;
    };
    this.m4 = new se();
    this.q = new mn();
    this.eu = new bn();
    this.v = new z();
    this.sc = new z(1, 1, 1);
    this.col = new wt();
    this.stones = inst(mergeParts([part(on(0.22), 0xffffff, { sy: 0.28 })]), 100, new Qe({ vertexColors: true }));
    this.posts = inst(mergeParts([part(yt(0.035, 0.045, 0.9, 4), PALETTE.plank2, { y: 0.45 }), part(lt(0.14, 0.16, 0.14), PALETTE.dark, { y: 0.95 })]), 30, he());
    this.postGlowMat = new je({ color: 0xffd48a, transparent: true, opacity: 0 });
    this.postGlow = inst(mergeParts([part(Bn(0.075, 5, 4), 0xffffff, { y: 0.95 })]), 30, this.postGlowMat);
    // lanterns on the pyramid
    this.pyrMat = new je({ color: 0x8a6a3a });
    this.pyr = inst(mergeParts([part(lt(0.1, 0.13, 0.1), 0xffffff)]), RETURN_LANTERNS_SHOWN, this.pyrMat);
    // gold water and the sun's road through the crown
    this.goldMat = new je({ color: 0xffc23a, transparent: true, opacity: 0, depthWrite: false });
    this.gold = inst(mergeParts([part(lt(0.34, 0.03, 0.64), 0xffffff)]), 6, this.goldMat);
    this.shaftMat = new je({ color: 0xffc040, transparent: true, opacity: 0, depthWrite: false, blending: 2 });
    this.shaft = new Et(mergeParts([part(lt(1.1, 1.3, 40), 0xffffff, { z: 20 }), part(lt(0.5, 0.6, 40), 0xffffff, { z: 20 })]), this.shaftMat);
    this.shaft.visible = false;
    this.group.add(this.shaft);
    this.sunLight = new Cs(0xffb040, 0, 14, 1.4);
    this.group.add(this.sunLight);
    // glowing fish
    this.fishMat = new je({ color: 0xaaf6ff, transparent: true, opacity: 0, depthWrite: false, blending: 2 });
    this.fish = inst(mergeParts([part(lt(0.42, 0.06, 0.15), 0xffffff), part(ze(0.08, 0.14, 3), 0xffffff, { x: -0.27, rz: Math.PI / 2 })]), 90, this.fishMat);
    this.fishHaloMat = new je({ color: 0x5ad8ff, transparent: true, opacity: 0, depthWrite: false, blending: 2 });
    this.fishHalo = inst(mergeParts([part(Bn(0.5, 10, 3), 0xffffff, { sx: 1.1, sy: 0.04, sz: 0.55 })]), 90, this.fishHaloMat);
    // lanterns along the channels, and fireflies
    // little lanterns set along the banks: a lantern, its light, and a warm pool on the ground
    this.bankLamp = inst(mergeParts([part(lt(0.12, 0.16, 0.12), PALETTE.dark, { y: 0.08 }), part(lt(0.14, 0.03, 0.14), PALETTE.plank2, { y: 0.17 })]), 400, he());
    this.bankMat = new je({ color: 0xffd080, transparent: true, opacity: 0 });
    this.banks = inst(mergeParts([part(Bn(0.075, 6, 4), 0xffffff, { y: 0.1 })]), 400, this.bankMat);
    // a soft pool of light: three thin discs, each fainter and wider (additive)
    this.bankHaloMat = new je({ color: 0xffa838, transparent: true, opacity: 0, depthWrite: false, blending: 2 });
    this.bankHalo = inst(mergeParts([part(Bn(0.22, 10, 3), 0xffffff, { sy: 0.02, y: 0.012 }), part(Bn(0.42, 10, 3), 0xffffff, { sy: 0.02, y: 0.008 }), part(Bn(0.65, 12, 3), 0xffffff, { sy: 0.02 })]), 400, this.bankHaloMat);
    this.flyMat = [0, 1].map(() => new Er({ color: 0xd8ff7a, size: 3, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
    this.flies = this.flyMat.map((m) => {
      let p = new Co(new ye(), m);
      p.frustumCulled = false;
      this.group.add(p);
      return p;
    });
    this.flyKey = "";
    this.bankKey = "";
    this.pathKey = "";
    this.pyrKey = "";
    this.wavedFor = null;
  }
  dispose() {
    this.group.traverse((o) => o.geometry && o.geometry.dispose());
    this.group.parent && this.group.parent.remove(this.group);
  }
  h(x, z) {
    return this.world.terrain.heightAt(clamp(x, 0, VW - 0.01), clamp(z, 0, VL - 0.01));
  }
  // the ground, or the water standing on it (the marsh)
  surf(x, z) {
    let g = this.h(x, z),
      wl = creekWaterAt(this.world, x, z);
    return wl != null && wl > g ? wl : g;
  }
  setI(mesh, i, x, y, z, ry, s, col) {
    this.eu.set(0, ry, 0);
    this.q.setFromEuler(this.eu);
    this.v.set(x, y, z);
    this.sc.set(s, s, s);
    this.m4.compose(this.v, this.q, this.sc);
    mesh.setMatrixAt(i, this.m4);
    if (col !== undefined) mesh.setColorAt(i, this.col.set(col));
  }
  waterY(i) {
    let cr = this.world.creek,
      n = cr.nodes[i];
    return Math.max(cr._pondNow ? cr._pondNow[i] : -1e9, n.wl);
  }
  update(clock, night, rain, dl, camera, focus) {
    let w = this.world,
      R = w.returning,
      t = w.temple && w.byId[w.temple.sid],
      A = R && R.active;
    // a word when the page opens near a Returning, and when one begins
    let hud = window.__creek && !window.__creek.catching && window.__creek.hud;
    if (hud && !this.greeted && w.creatures.length) {
      this.greeted = true;
      let next = R && R.pathDone && !A ? returningNext(w) : null;
      if (next != null && next < 2 * 86400) setTimeout(() => hud.toast(`The next Returning is ${returningWhenText(next)}.`), 2500);
    }
    if (hud && A && !A.fishOnly && this.toastFor !== A.start) {
      this.toastFor = A.start;
      if (w.t < A.dawn + 0.1 * getDayLength()) hud.toast("The Returning has begun. They are on the temple steps, waiting for the sun.");
    }
    this.updatePath(w, R, A, night);
    this.updatePyramid(w, R, t, night);
    // the festival
    let dawnK = 0,
      nightK = 0;
    if (A) {
      let VD = getDayLength();
      if (!A.fishOnly) dawnK = clamp((w.t - (A.dawn - 0.06 * VD)) / (0.04 * VD), 0, 1) * clamp((A.dawn + 0.2 * VD - w.t) / (0.06 * VD), 0, 1);
      nightK = w.t >= A.dusk - 0.02 * VD ? clamp((w.t - (A.dusk - 0.02 * VD)) / (0.04 * VD), 0, 1) * clamp((A.end - w.t) / (0.05 * VD), 0, 1) : 0;
      // the one who believes in you looks up, once each Returning night
      if (nightK > 0.5 && this.wavedFor !== A.start && !A.fishOnly) {
        this.wavedFor = A.start;
        WAVE.pending = true;
      }
    }
    this.updateGold(w, t, dawnK, clock);
    this.updateFish(w, nightK, clock);
    this.updateBanks(w, A && !A.fishOnly ? nightK : 0, clock);
    this.updateFlies(w, nightK > 0 ? nightK : 0.6 * night * (seasonAt(w).name === "summer" && w.creek && w.creek.wetNow > 0.4 ? 1 : 0), clock, focus);
  }
  updatePath(w, R, A, night) {
    let pts = (R && R.path) || [],
      n = pts.length ? Math.round((pts.length * (R.parts || 0)) / RETURNING.pathParts) : 0,
      key = n + ":" + pts.length;
    if (key !== this.pathKey) {
      this.pathKey = key;
      let k = 0,
        p = 0;
      for (let i = 0; i < n && k < 100; i++) {
        let q = pts[i];
        this.setI(this.stones, k++, q.x, this.surf(q.x, q.z) + 0.02, q.z, hash01(i) * 6.28, 0.8 + 0.4 * hash01(i + 7), i % 3 ? PALETTE.stone : PALETTE.stone2);
        if (i % 5 === 2 && p < 30) {
          let ox = q.x + 0.7,
            oz = q.z + 0.3;
          this.setI(this.posts, p, ox, this.surf(ox, oz), oz, 0, 1);
          this.setI(this.postGlow, p, ox, this.surf(ox, oz), oz, 0, 1);
          p++;
        }
      }
      this.stones.count = k;
      this.posts.count = this.postGlow.count = p;
      for (let m of [this.stones, this.posts, this.postGlow]) {
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
      }
    }
    // the posts are lit on the night of the Returning
    this.postGlowMat.opacity = A && !A.fishOnly && w.t >= A.dusk - 0.03 * getDayLength() ? 0.95 : 0;
    this.postGlow.visible = this.postGlowMat.opacity > 0;
  }
  updatePyramid(w, R, t, night) {
    let n = Math.min(RETURN_LANTERNS_SHOWN, (R && R.lanterns) || 0);
    this.pyr.visible = !!(t && n);
    this.pyrMat.color.set(night > 0.3 ? 0xffd27a : 0x9a7a4a);
    if (!t || !n) return;
    let key = n + ":" + t.x + ":" + t.z;
    if (key === this.pyrKey) return;
    this.pyrKey = key;
    let base = this.h(t.x, t.z),
      k = 0;
    // round the edges of the terraces, the lowest first, leaving the water course clear
    for (let j = 0; j < n; j++) {
      let tier = j % 5,
        half = (6 - tier * 1.05) / 2 - 0.12,
        u = hash01(j * 13 + 3) * 4,
        side = Math.floor(u),
        f = (u - side) * 2 - 1,
        lx = side === 0 ? f * half : side === 1 ? half : side === 2 ? -f * half : -half,
        lz = side === 0 ? -half : side === 1 ? f * half : side === 2 ? half : -f * half;
      if (side === 0 && Math.abs(lx) < 0.4) lx += lx < 0 ? -0.5 : 0.5;
      let p = templeToWorld(t, lx, 5.6 + lz);
      this.setI(this.pyr, k++, p.x, base + 0.5 * (tier + 1) + 0.07, p.z, 0, 1);
    }
    this.pyr.count = k;
    this.pyr.instanceMatrix.needsUpdate = true;
  }
  updateGold(w, t, k, clock) {
    let on = !!(t && k > 0.01 && w.temple && w.temple.state === "done");
    this.gold.visible = this.shaft.visible = on;
    this.sunLight.intensity = on ? 3.5 * k : 0;
    if (!on) return;
    let base = this.h(t.x, t.z),
      cz = 5.6;
    for (let i = 0; i < 5; i++) {
      let p = templeToWorld(t, 0, cz - 3 + i * 0.52 + 0.3);
      this.setI(this.gold, i, p.x, base + 0.5 * (i + 1) + 0.1, p.z, t.rot || 0, 1.5);
    }
    let pool = templeToWorld(t, 0, cz);
    this.setI(this.gold, 5, pool.x, base + 3.25, pool.z, t.rot || 0, 1.3);
    this.gold.count = 6;
    this.gold.instanceMatrix.needsUpdate = true;
    this.goldMat.opacity = 0.85 * k * (0.9 + 0.1 * Math.sin(clock * 2.3));
    // the sun's road, from the gate out toward the sunrise
    let g = templeToWorld(t, 0, cz + 0.4);
    this.shaft.position.set(g.x, base + 3.4, g.z);
    this.shaft.rotation.set(0, t.rot || 0, 0);
    this.shaftMat.opacity = 0.3 * k * (0.9 + 0.1 * Math.sin(clock * 1.3));
    this.sunLight.position.set(pool.x, base + 3.8, pool.z);
  }
  // Glowing fish swimming up the creek, from the bottom of the valley to the spring.
  updateFish(w, k, clock) {
    this.fish.visible = this.fishHalo.visible = k > 0.01;
    if (!this.fish.visible) return;
    let cr = w.creek,
      ns = cr.nodes,
      N = 90,
      zTop = -12,
      zBot = VL + 2,
      L = zBot - zTop;
    for (let j = 0; j < N; j++) {
      let p = (clock * 0.012 + j / N + hash01(j) * 0.02) % 1,
        z = zBot - p * L,
        i = clamp(creekNodeIndex(z), 0, ns.length - 1),
        x = ns[i].x + (hash01(j * 3) - 0.5) * Math.min(1.2, ns[i].wb * 0.6) + Math.sin(clock * 2 + j) * 0.08,
        y = Math.max(this.waterY(i), this.h(x, z)) + 0.04,
        ry = Math.PI / 2 + Math.sin(clock * 3 + j) * 0.15;
      this.setI(this.fish, j, x, y, z, ry, 0.9 + 0.3 * hash01(j + 5));
      this.setI(this.fishHalo, j, x, y - 0.02, z, ry, 1);
    }
    this.fish.count = this.fishHalo.count = N;
    this.fish.instanceMatrix.needsUpdate = this.fishHalo.instanceMatrix.needsUpdate = true;
    this.fishMat.opacity = 0.95 * k;
    this.fishHaloMat.opacity = 0.35 * k;
  }
  // Lanterns set along both banks of the creek, and on the little channels across the floor.
  updateBanks(w, k, clock) {
    let on = k > 0.01;
    this.banks.visible = this.bankHalo.visible = this.bankLamp.visible = on;
    if (!on) return;
    let cr = w.creek,
      key = cr.nodes.length + ":" + (w.terrain.version || 0);
    if (key !== this.bankKey) {
      this.bankKey = key;
      let pts = [];
      for (let i = 0; i < cr.nodes.length; i += 2) {
        let n = cr.nodes[i];
        if (n.z < 1 || n.z > VL - 1) continue;
        for (let sd of [-1, 1]) {
          let x = n.x + sd * (n.wb / 2 + 0.7 + hash01(i * 2 + sd) * 0.6);
          if (x < 0.5 || x > VW - 0.5) continue;
          pts.push([x, n.z]);
        }
      }
      if (cr.chan)
        for (let v = 0, W1 = VW + 1; v < cr.chan.length && pts.length < 400; v += 7) {
          if (!(cr.chan[v] >= 0.22) || hash01(v) > 0.35) continue;
          let x = v % W1,
            z = Math.floor(v / W1);
          if (z < 1 || z > VL - 1) continue;
          pts.push([x, z]);
        }
      let n = 0;
      for (let [x, z] of pts.slice(0, 400)) {
        let y = this.surf(x, z) + 0.02;
        this.setI(this.bankLamp, n, x, y, z, hash01(n) * 3, 1);
        this.setI(this.banks, n, x, y, z, 0, 1);
        this.setI(this.bankHalo, n, x, y + 0.02, z, 0, 1);
        n++;
      }
      for (let m of [this.bankLamp, this.banks, this.bankHalo]) (m.count = n), (m.instanceMatrix.needsUpdate = true);
    }
    this.bankMat.opacity = k;
    this.bankHaloMat.opacity = k * (0.1 + 0.02 * Math.sin(clock * 5));
  }
  // Fireflies over the wet ground near where you're looking.
  updateFlies(w, k, clock, focus) {
    let on = k > 0.01 && focus;
    for (let p of this.flies) p.visible = !!on;
    if (!on) return;
    let fx = Math.round(focus.x / 8) * 8,
      fz = Math.round(focus.z / 8) * 8,
      key = fx + ":" + fz;
    if (key !== this.flyKey) {
      this.flyKey = key;
      this.flies.forEach((p, g) => {
        let pts = [];
        for (let i = 0; i < 80; i++) {
          let x = clamp(fx + (hash01(i * 5 + g * 999) - 0.5) * 50, 0.5, VW - 0.5),
            z = clamp(fz + (hash01(i * 5 + 1 + g * 999) - 0.5) * 50, 0.5, VL - 0.5);
          pts.push(x, this.h(x, z) + 0.4 + hash01(i * 5 + 2 + g * 999) * 1.2, z);
        }
        p.geometry.dispose();
        let geo = new ye();
        geo.setAttribute("position", new Zt(pts, 3));
        p.geometry = geo;
      });
    }
    this.flyMat[0].opacity = k * clamp(0.5 + Math.sin(clock * 2.1), 0, 1);
    this.flyMat[1].opacity = k * clamp(0.5 + Math.sin(clock * 1.7 + 2), 0, 1);
    for (let p of this.flies) p.position.y = Math.sin(clock * 0.8) * 0.15;
  }
};
VIEW_EXTRAS.push(ReturningView);

// ---- words for the Temple tab ----
function returningWhenText(secs) {
  if (secs == null) return "";
  let days = secs / 86400,
    when = new Date(devNow() + secs * 1000),
    day = when.toLocaleDateString([], { weekday: "long" }),
    hr = when.toLocaleTimeString([], { hour: "numeric" });
  if (secs < 3600) return "within the hour";
  if (days < 1) return `in about ${Math.round(secs / 3600)} hours, around ${hr}`;
  let n = Math.floor(days);
  return `in ${n === 1 ? "a day" : n + " days"}, on ${day} around ${hr}`;
}

function returningTabHTML(w) {
  let out = "",
    R = w.returning,
    A = R && R.active;
  if (R && (R.pathSid || R.count)) {
    out += `<h4>The Returning</h4>`;
    if (A && !A.fishOnly) out += `<p><b>The Returning is happening now.</b> ${w.t < A.dawn + 0.12 * getDayLength() ? "They are on the temple steps, waiting for the sun." : w.t < A.dusk ? "The procession is on the path to the Spring." : "The glowing fish are swimming up the creek, and the channels are lined with lanterns."}</p>`;
    else if (R.pathDone) {
      let next = returningNext(w);
      out += `<p>${R.count ? `They have held the Returning ${R.count === 1 ? "once" : R.count === 2 ? "twice" : numberWord(R.count) + " times"}. ` : ""}The next Returning is ${returningWhenText(next)}.</p>`;
    } else out += `<p class="muted">They are laying a path for a procession from the temple to the Spring: ${R.parts || 0} of ${RETURNING.pathParts} stretches, one each season. When it's done, the first Returning comes at midwinter.</p>`;
    if (R.lanterns) out += `<p class="muted">${R.lanterns === 1 ? "A lantern hangs" : `${R.lanterns} lanterns hang`} on the pyramid, one for each creekfolk who passed since the first Returning.</p>`;
    if (R.verses && R.verses.length) out += `<p class="muted">Their song for the Returning${R.verseCount > R.verses.length ? ` has ${R.verseCount} verses; the newest` : ""}: ${R.verses.slice(-4).map((v) => escapeHtml(v.text)).join(" ")}</p>`;
  } else if (R && R.fishRuns) {
    out += `<h4>The glowing fish</h4><p class="muted">On midwinter night, glowing fish swim up the creek to the spring. ${R.fishRuns === 1 ? "They've seen it once." : `They've seen it ${numberWord(R.fishRuns)} times.`}</p>`;
  }
  let K = w.skycal;
  if (K && K.done) {
    let d = daysToMidwinter(w),
      secs = d * getDayLength();
    out += `<h4>The sky stones</h4><p class="muted">From the sky stones they can tell when midwinter is coming: ${d < 1 || d > YEAR_DAYS - 1 ? "it's midwinter now" : `next ${returningWhenText(secs)}`}.</p>`;
  } else if (K) out += `<h4>The sky stones</h4><p class="muted">They are setting up stones to mark where the sun comes up through the year; each marker goes in on the morning the sun rises behind it.</p>`;
  let B = w.beavers;
  if (B) out += `<h4>The beavers</h4><p class="muted">${B.list.length === 1 ? "A beaver lives" : `${numberWord(B.list.length)[0].toUpperCase() + numberWord(B.list.length).slice(1)} beavers live`} in the lodge. They mend the dams${B.raised ? " and build them higher than the creekfolk did" : ""}, mostly at dusk and in the night.${B.raised && w.temple && w.temple.state === "done" ? " The water running down the temple steps comes from the high ponds they keep." : ""}</p>`;
  return out;
}

(function () {
  let base = villageTempleHTML;
  villageTempleHTML = function (w) {
    return base(w) + returningTabHTML(w);
  };
})();
