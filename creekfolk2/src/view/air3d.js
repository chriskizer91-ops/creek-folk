// ==========================================================================
// The air over the valley, in the 3D view: What the Water Brings' air, rain and storm (its
// main.js), on this valley's own weather, seasons and hours:
//   rain       soft streaks falling round the view, heavier in a storm, and rings on the water
//   lightning  flashes in a storm: `flash`, which the view's light() adds to the grade
//   snow       on the cold days of winter (about half the days of deep winter) what falls is
//              snow, and on a cold grey day a few flakes
//   mist       pale sheets lying on the water, seen through by dithering: in the early morning,
//              and all the morning after a storm; thicker as the floor grows wet
//   fireflies  at dusk in summer, over the wet grass (more of them in a healed wetland)
//   leaves     falling round the trees in autumn, and a few torn off in a storm
//   swallows   a few dark chevrons that sweep low over the meadow and the water by day, from
//              spring to early autumn (oftener over a wetland, with its insects)
// Everything is placed round the middle of the view and sized to it, so rain and snow read the
// same close in and from the air. View only, with its own generator seeded from the valley.
//
//   CF2Air.create(view) -> { group, update(t, dt, look), flash }
// ==========================================================================

var CF2Air = (function () {
  var PAINT = CF2Valley.PAINT;
  PAINT.rain = ["#b8d0d8", "#cfe0e6", "#e4f0f2"];
  PAINT.snow = ["#dfe6ea", "#f2f6f8", "#ffffff"];
  PAINT.firefly = ["#d8e070", "#eef6a0", "#fbffd8"];
  // the mist is drawn in the foam's white (#eef6f6), which the palette already holds

  var _o = new THREE.Object3D();
  function rnd(seed) {
    seed = seed >>> 0;
    return function () {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }
  function seedOf(s) {
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  }
  function sst(a, b, x) {
    var t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function create(view) {
    var vw = view.vw,
      W = view.valley,
      T = vw.T,
      SEED = seedOf(vw.seed),
      R = rnd(SEED ^ 0x2545f491),
      grp = new THREE.Group(),
      time = 0;
    grp.name = "Air";
    view.scene.add(grp);
    var api = { group: grp, update, flash: 0, snowy: false, said: {} };
    function inst(geo, mat, n, name, shadow) {
      var m = new THREE.InstancedMesh(geo, mat, n);
      m.count = 0;
      m.visible = false;
      m.frustumCulled = false;
      m.castShadow = !!shadow;
      m.receiveShadow = false;
      m.name = name;
      grp.add(m);
      return m;
    }
    function put(m, i, x, y, z, rx, ry, rz, sx, sy, sz) {
      _o.position.set(x, y, z);
      _o.rotation.set(rx, ry, rz);
      _o.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
      _o.updateMatrix();
      m.setMatrixAt(i, _o.matrix);
    }
    function show(m, n) {
      m.count = n;
      m.visible = n > 0;
      if (n) m.instanceMatrix.needsUpdate = true;
    }
    function marshAt(x, z) {
      var g = vw.grids;
      return !!g && x >= 0 && z >= 0 && x < VW && z < VL && g.wet[Math.floor(z) * VW + Math.floor(x)] > 0.6;
    }
    function dayChance(d) {
      var h = Math.imul((d + 0x6d2b79f5) ^ SEED, 0x85ebca6b);
      h ^= h >>> 13;
      h = Math.imul(h, 0xc2b2ae35);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }

    // ---- rain: soft streaks falling round the view, in a box 22 units across and 11 high (a
    // unit is a metre close in, more from further out: see `s` below)
    var RN = 700,
      rain = inst(new THREE.BoxGeometry(0.012, 0.42, 0.012), W.paint("rain", { soft: true }), RN, "Rain"),
      drops = [];
    for (var i = 0; i < RN; i++) drops.push([(R() - 0.5) * 22, R() * 11 - 1, (R() - 0.5) * 22]);
    // snow: flakes that drift down slowly and wander in the air
    var SN = 600,
      snow = inst(new THREE.BoxGeometry(0.035, 0.035, 0.035), W.paint("snow", { soft: true }), SN, "Snow"),
      flakes = [];
    for (i = 0; i < SN; i++) flakes.push([(R() - 0.5) * 22, R() * 11 - 1, (R() - 0.5) * 22, R() * 6.28]);
    // fireflies: tiny lights that drift and blink (they shine, and the pixel pass spills a glow
    // round them at night)
    var FN = 60,
      ffm = inst(new THREE.BoxGeometry(1, 1, 1), W.paint("firefly", { glow: true }), FN, "Fireflies"),
      flies = [];
    for (i = 0; i < FN; i++) flies.push({ x: 0, z: 0, y: 0.3 + R() * 1.3, ph: R() * 100, per: 2.2 + R() * 3, on: 0.35 + R() * 0.4, dead: true });
    // falling leaves, in the autumn trees' colours
    var LG = new THREE.BoxGeometry(0.075, 0.006, 0.05),
      leaves = ["gold", "leafR", "gold"].map((k) => ({ m: inst(LG, W.paint(k, { soft: true }), 26, "Leaves"), d: Array.from({ length: 26 }, () => ({ x: 0, y: 0, z: 0, ph: R() * 6.28, sp: 0.35 + R() * 0.3, rx: R() * 6, ry: R() * 6, dead: true })) })),
      trees = [],
      treesT = 0;
    // mist: pale sheets a little above the water, see-through by dithering (no blending in the
    // pixel pass), thinning out to nothing at their edges; soft, so no ink outline
    var mistU = { uDens: { value: 0 } },
      mm = new THREE.MeshBasicMaterial({ color: PKCore.col("#eef6f6"), opacity: 0.5, side: THREE.DoubleSide });
    mm.onBeforeCompile = function (sh) {
      sh.uniforms.uDens = mistU.uDens;
      sh.uniforms.uTime = PKToon.FX.uTime;
      sh.uniforms.uDith = PKToon.FX.uDith;
      sh.vertexShader = "varying vec3 vMW; varying vec2 vMO;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n  vMW = (modelMatrix * vec4(transformed, 1.0)).xyz; vMO = position.xz / vec2(1.3, 0.8);");
      sh.fragmentShader =
        "uniform float uDens; uniform float uTime; uniform vec2 uDith; varying vec3 vMW; varying vec2 vMO;\n" +
        PKToon.GLSL_NOISE +
        "\n" +
        sh.fragmentShader.replace(
          "void main() {",
          "void main() {\n  float mn = pkNoise(vMW.xz * 0.45 + vec2(uTime * 0.05, uTime * 0.02)) * 0.65 + pkNoise(vMW.xz * 1.3 - vec2(uTime * 0.04, 0.0)) * 0.35;\n  float edge = 1.0 - smoothstep(0.3, 1.0, length(vMO));\n  if (pkBayer(floor(gl_FragCoord.xy / max(2.0, uDith.y))) > uDens * smoothstep(0.35, 0.75, mn) * 0.45 * edge) discard;"
        );
    };
    mm.customProgramCacheKey = () => "cf2-mist";
    PKPixel3D.keepAlpha(mm);
    var mg = new THREE.PlaneGeometry(2.6, 1.6),
      mist = [];
    mg.rotateX(-Math.PI / 2);
    for (i = 0; i < 12; i++) {
      var m = new THREE.Mesh(mg, mm);
      m.visible = false;
      m.castShadow = false;
      m.receiveShadow = false;
      m.renderOrder = 2;
      m.name = "Mist";
      grp.add(m);
      mist.push({ m, x: 0, y: 0, z: 0, life: 0 });
    }
    // swallows: dark chevrons
    var bg = new THREE.BufferGeometry();
    bg.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0.06, -0.16, 0, -0.04, 0, 0, -0.02, 0, 0, 0.06, 0.16, 0, -0.04, 0, 0, -0.02], 3));
    bg.computeVertexNormals();
    var birds = { m: inst(bg, W.paint("ink", { side: true }), 6, "Swallows", true), n: 6, t: -1, wait: 12, from: null, dir: null, off: [], s: 1 };

    // ---- the weather, eased, and the wind's gusts
    var rainAmt = null,
      snowAmt = null,
      gust = 0,
      gustGoal = 0,
      gustT = 0,
      bolt = 4,
      flick = -1,
      flash = 0,
      c = { x: 0, y: 0, z: 0 },
      // on a phone (the low quality setting) half the rain and snow
      few = view.app && view.app.quality === "low" ? 0.5 : 1;

    function update(t, dt, look) {
      time += dt;
      if (!view.px) return;
      var V = view.view,
        hv = V.hv,
        ppm = view.px.h / Math.max(1e-3, hv),
        hour = cf2Hour(t),
        st = view.st || 0,
        night = look ? look.night : 0,
        wx = (vw.weather && vw.weather.state) || "clear",
        sz = seasonAt(vw.w),
        life = clamp((vw.wetNow || 0) / 0.6, 0, 1),
        // snow falls on the cold days of deep winter (about half of them)
        snowy = sz.name === "winter" && sz.warmth < 0.12 && dayChance(Math.floor(valleyDays(vw.w))) < 0.55,
        k = rainAmt == null ? 1 : Math.min(1, dt * 0.8);
      rainAmt += ((snowy ? 0 : wx === "storm" ? 1 : wx === "rain" ? 0.55 : 0) - (rainAmt || 0)) * k;
      snowAmt += ((!snowy ? 0 : wx === "storm" ? 1 : wx === "rain" ? 0.7 : wx === "cloudy" ? 0.12 : 0) - (snowAmt || 0)) * k;
      api.snowy = snowy;
      c.x = V.x;
      c.y = W.height(V.x, V.z);
      c.z = V.z;
      gustT -= dt;
      if (gustT <= 0) (gustT = 3 + R() * 6), (gustGoal = R());
      gust += (gustGoal - gust) * Math.min(1, dt * 0.6);
      var wind = 0.25 + 0.6 * gust + 2.2 * st,
        // rain and snow are drawn in units of the view: as many streaks on the screen, as long,
        // whether close in or from the air
        s = Math.max(1, hv / 12);

      // ---- rain, and its rings on the water
      var n = Math.round(RN * few * Math.min(1, rainAmt)),
        rw = Math.max(s, 1.1 / (0.012 * ppm)); // a streak about one art pixel wide
      for (i = 0; i < n; i++) {
        var d = drops[i];
        d[1] -= dt * 10;
        d[0] += dt * 1.6;
        if (d[1] < -1) (d[1] += 11), (d[0] = (R() - 0.5) * 22), (d[2] = (R() - 0.5) * 22);
        if (d[0] > 11) d[0] -= 22;
        put(rain, i, c.x + d[0] * s, c.y + (d[1] - 1) * s, c.z + d[2] * s, 0, 0, -0.16, rw, s, rw);
      }
      show(rain, n);
      if (n && hv < 30 && view.life && R() < dt * 14 * rainAmt) {
        var a = R() * 6.28,
          rr = R() * 9;
        view.life.splash(c.x + Math.cos(a) * rr, c.z + Math.sin(a) * rr, 0.35);
      }
      // ---- snow
      n = Math.round(SN * few * Math.min(1, snowAmt));
      var fw2 = Math.max(s, 2 / (0.035 * ppm)); // a flake at least two art pixels across
      for (i = 0; i < n; i++) {
        var f = flakes[i];
        f[1] -= dt * (0.8 + 0.25 * Math.sin(f[3] * 3));
        f[0] += dt * (0.2 + 0.25 * wind + 0.3 * Math.sin(time * 1.1 + f[3]));
        f[2] += dt * 0.3 * Math.cos(time * 0.9 + f[3] * 1.7);
        if (f[1] < -1) (f[1] += 11), (f[0] = (R() - 0.5) * 22), (f[2] = (R() - 0.5) * 22);
        if (f[0] > 11) f[0] -= 22;
        if (Math.abs(f[2]) > 11) f[2] *= -0.98;
        put(snow, i, c.x + f[0] * s, c.y + (f[1] - 1) * s, c.z + f[2] * s, f[3] + time, f[3] * 2, 0, fw2);
      }
      show(snow, n);

      // ---- lightning: a flash every few seconds in a storm, sometimes with a flicker after it
      if (wx === "storm" && !snowy && rainAmt > 0.5) {
        bolt -= dt;
        if (bolt <= 0) (bolt = 6 + R() * 9), (flash = 1.2), (flick = R() < 0.6 ? 0.12 + R() * 0.1 : -1);
      }
      if (flick > 0 && (flick -= dt) <= 0) flash = Math.max(flash, 0.75);
      flash = Math.max(0, flash - dt * 5);
      api.flash = flash;

      // ---- mist: early morning, and all the morning after a storm, lying on the water
      var after = vw.flood && t - vw.flood.t0 < VALLEY_DAY * 1.2 && hour < 12 && wx !== "storm" ? Math.min(1, (12 - hour) / 3) : 0,
        morning = hour > 5 && hour < 9.5 ? Math.min(1, (9.5 - hour) / 2) * Math.min(1, (hour - 5) / 0.8) : 0,
        md = Math.max(morning * (0.6 + 0.4 * life), after) * (1 - st) * (hv < 90 ? 1 : 0),
        sm = clamp(hv / 14, 1, 4);
      mistU.uDens.value = md;
      for (var M of mist) {
        if (md <= 0.02) {
          M.m.visible = false;
          M.life = 0;
          continue;
        }
        M.life -= dt;
        if (M.life <= 0 || Math.abs(M.x - c.x) > 14 * sm || Math.abs(M.z - c.z) > 11 * sm) {
          M.m.visible = false;
          M.life = 1;
          for (var tries = 0; tries < 6; tries++) {
            var x = c.x + (R() - 0.5) * 20 * sm,
              z = c.z + (R() - 0.5) * 14 * sm,
              wl = W.water(x, z);
            if (wl == null && !marshAt(x, z)) continue;
            // along the creek where it is the creek; any way over a pond or the marsh
            var tx = T.creekX(z + 0.5) - T.creekX(z - 0.5),
              along = Math.abs(x - T.creekX(z)) < 2.5,
              rot = along ? Math.atan2(-1, tx) : R() * 3,
              sx = (0.8 + 0.7 * R()) * sm,
              sz2 = (0.8 + 0.4 * R()) * sm,
              ca = Math.cos(rot) * 1.3 * sx,
              sa = -Math.sin(rot) * 1.3 * sx,
              ends = 0;
            // most of the sheet lies over water or marsh, not over the banks
            for (var q = -1; q <= 1; q += 2) if (W.water(x + ca * q, z + sa * q) != null || marshAt(x + ca * q, z + sa * q)) ends++;
            if (ends < 2) continue;
            M.x = x;
            M.z = z;
            M.y = (wl != null ? wl : W.height(x, z)) + 0.15 + R() * 0.2;
            M.life = 8 + R() * 10;
            M.m.visible = true;
            M.m.rotation.y = rot;
            M.m.scale.set(sx, 1, sz2);
            break;
          }
        }
        M.x += dt * 0.12;
        M.m.position.set(M.x, M.y + Math.sin(time * 0.4 + M.life) * 0.05, M.z);
      }

      // ---- fireflies from dusk to late evening in summer, not in rain; over the wet grass
      var ffS = sz.name === "summer" ? 1 : sz.name === "spring" ? sst(0.6, 1, sz.progress) : sz.name === "autumn" ? 1 - sst(0, 0.4, sz.progress) : 0,
        ff = hour > 19.2 && hour < 23.8 && st < 0.2 ? Math.min(1, (hour - 19.2) / 0.8) * Math.min(1, (23.8 - hour) / 0.8) : 0,
        nf = hv < 60 ? Math.round(FN * ff * ffS * (0.3 + 0.7 * life)) : 0,
        sF = clamp(hv / 12, 1, 3),
        fs = Math.max(0.05, 2.2 / ppm),
        fc = 0;
      for (i = 0; i < nf; i++) {
        var fl = flies[i];
        if (fl.dead || Math.abs(fl.x - c.x) > 12 * sF || Math.abs(fl.z - c.z) > 9 * sF) {
          // a new one somewhere round the view, over wet or lush grass where it can
          for (var q = 0; q < 4; q++) {
            (fl.x = c.x + (R() - 0.5) * 22 * sF), (fl.z = c.z + (R() - 0.5) * 16 * sF);
            var gk = Math.floor(fl.z) * VW + Math.floor(fl.x),
              G = vw.grids;
            if (!G || fl.x < 0 || fl.z < 0 || fl.x >= VW || fl.z >= VL || G.wet[gk] > 0.25 || G.green[gk] > 0.8) break;
          }
          fl.dead = false;
        }
        fl.x += Math.sin(time * 0.31 + fl.ph) * dt * 0.35;
        fl.z += Math.cos(time * 0.27 + fl.ph * 1.3) * dt * 0.35;
        var ph = ((time + fl.ph) % fl.per) / fl.per,
          lit = ph < fl.on ? Math.sin((ph / fl.on) * Math.PI) : 0;
        if (lit <= 0.15) continue;
        var fy = W.height(fl.x, fl.z) + fl.y + Math.sin(time * 0.9 + fl.ph) * 0.15,
          fw = W.water(fl.x, fl.z);
        if (fw != null) fy = Math.max(fy, fw + 0.25);
        put(ffm, fc++, fl.x, fy, fl.z, 0, 0, 0, fs);
      }
      show(ffm, fc);

      // ---- leaves: round the trees in autumn, and a few torn off in a storm
      if ((treesT -= dt) <= 0) {
        treesT = 3;
        trees = [];
        for (var r of vw.list("res").values()) if ((r.kind === "tree" || r.kind === "podtree" || r.kind === "orchard" || r.kind === "grove") && Math.abs(r.x - c.x) < 22 && Math.abs(r.z - c.z) < 18) trees.push(r);
      }
      var lS = sz.name === "autumn" ? 0.5 + 0.5 * Math.sin(Math.PI * clamp(sz.progress * 1.2, 0, 1)) : sz.name === "winter" ? 0 : 0.25 * st,
        lN = hv < 45 ? Math.min(1, lS * (0.45 + 0.4 * gust + st)) * (trees.length ? 1 : 0.2) : 0,
        sL = clamp(hv / 12, 1, 2);
      for (var Lf of leaves) {
        var cnt = Math.round(Lf.d.length * lN);
        for (i = 0; i < cnt; i++) {
          var e = Lf.d[i];
          e.y -= dt * e.sp * (1 + st);
          e.x += dt * (wind * 0.9 + Math.sin(time * 1.3 + e.ph) * 0.25);
          e.z += dt * (wind * 0.15 + Math.cos(time * 1.1 + e.ph) * 0.2);
          if (e.dead || e.y < W.height(e.x, e.z) || Math.abs(e.x - c.x) > 16 * sL || Math.abs(e.z - c.z) > 13 * sL) {
            var tr = trees.length ? trees[Math.floor(R() * trees.length)] : null;
            e.x = tr ? tr.x + (R() - 0.5) * 3 : c.x + (R() - 0.7) * 16 * sL;
            e.z = tr ? tr.z + (R() - 0.5) * 3 : c.z + (R() - 0.5) * 13 * sL;
            e.y = W.height(e.x, e.z) + 2.5 + R() * 3;
            e.dead = false;
          }
          put(Lf.m, i, e.x, e.y, e.z, e.rx + time * 2.1 + e.ph, e.ry + time * 0.7, Math.sin(time * 3 + e.ph) * 0.8, sL);
        }
        show(Lf.m, cnt);
      }

      // ---- swallows: every so often by day a little flock sweeps across, low over the meadow
      var B = birds,
        swS = sz.name === "summer" ? 1 : sz.name === "spring" ? sst(0.15, 0.4, sz.progress) : sz.name === "autumn" ? 1 - sst(0.3, 0.6, sz.progress) : 0;
      B.wait -= dt;
      if (B.t < 0 && B.wait <= 0 && night < 0.3 && st < 0.3 && swS > 0.2 && hv < 80) {
        B.wait = (25 + R() * 35) / (0.4 + 0.6 * life) / swS;
        B.t = 0;
        B.s = Math.max(1, 6 / (0.45 * ppm)); // life size, or at least six pixels across from further out
        var ba = R() * 6.28;
        B.dir = [Math.cos(ba), Math.sin(ba)];
        B.from = [c.x - B.dir[0] * 16 * B.s, c.z - B.dir[1] * 16 * B.s];
        B.off = [];
        for (q = 0; q < B.n; q++) B.off.push([(R() - 0.5) * 2.4, (R() - 0.5) * 2.4, 2.2 + R() * 1.6, R() * 6]);
      }
      if (B.t >= 0) {
        B.t += dt;
        var dist = B.t * 7 * B.s;
        for (q = 0; q < B.n; q++) {
          var o = B.off[q],
            sw = Math.sin(B.t * 1.7 + o[3]) * 1.2 * B.s,
            bx = B.from[0] + B.dir[0] * dist + o[0] * B.s - B.dir[1] * sw,
            bz = B.from[1] + B.dir[1] * dist + o[1] * B.s + B.dir[0] * sw,
            flp = 0.5 + 0.5 * Math.abs(Math.sin(B.t * 14 + o[3]));
          put(B.m, q, bx, W.height(bx, bz) + o[2] * Math.max(1, B.s * 0.7), bz, 0, Math.atan2(B.dir[0], B.dir[1]), Math.sin(B.t * 2 + o[3]) * 0.4, flp * 1.4 * B.s, 1.4 * B.s, 1.4 * B.s);
        }
        show(B.m, B.n);
        if (dist > 34 * B.s) (B.t = -1), show(B.m, 0);
      }
      // what it is showing (for the tests)
      var S = api.said;
      S.hour = +hour.toFixed(2);
      S.season = sz.name;
      S.snowy = snowy;
      S.rain = rain.count;
      S.snow = snow.count;
      S.mist = md > 0.02 ? +md.toFixed(2) : 0;
      S.fireflies = ffm.count;
      S.leaves = leaves[0].m.count + leaves[1].m.count + leaves[2].m.count;
      S.swallows = B.t >= 0 ? B.n : 0;
    }
    return api;
  }

  return { create };
})();
