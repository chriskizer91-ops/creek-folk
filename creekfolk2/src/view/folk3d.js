// ==========================================================================
// Creekfolk close up: built the way What the Water Brings builds its chunky Sheet king
// (PKToon2): simple solids hung on the shared rig (PKSkin, with the clips from king3.js),
// three-tone palette ramps, outlines from the pixel pass. The proportions start from its
// "Little king": a big round head on a short body. Creekfolk are furry, round and plainly not
// human: big ears, a light belly, a short tail, paws. Their fur comes from the fixed ramps in
// sprites.js (so the palette holds them), their clothes from their family's dye.
//
//   Folk3D.build(c, vw)  -> { root, rig }      Folk3D.pose(model, c, { x, y, z, face, walking, dt })
// ==========================================================================

var Folk3D = (function () {
  var ok = typeof PhilosopherKing !== "undefined" && typeof PKToon !== "undefined";
  var mats = {};
  function M(tones, key) {
    if (!mats[key]) (mats[key] = PKToon.rampMat(tones[0], tones[1], tones[2])), (mats[key].name = "Folk_" + key);
    return mats[key];
  }
  var EXTRA = { ink: ["#2a2420", "#2a2420", "#2a2420"], ear: ["#c87a72", "#e89a90", "#f4b8ae"], nose: ["#3a2a26", "#4a3a34", "#6a504a"], glint: ["#fff8e8", "#fff8e8", "#fff8e8"], cream: ["#d8ccb4", "#f4ead8", "#fff8ec"], stick: ["#5a4632", "#8a6a4a", "#a8866a"] };
  // adult dims (metres): about 1.35 m to the top of the head, ears above that
  var DIMS = { HIPS_Y: 0.44, THIGH_X: 0.1, THIGH_Y: 0.0, L1: 0.17, L2: 0.15, ANK: 0.12, NECK_Y: 0.36, NECK_Z: 0.0, HEAD_DY: 0.02, HEAD_DZ: 0.02, EYE_DY: 0.18, EYE_DZ: 0.12, SH_X: 0.17, SH_Y: 0.33, UA: 0.15, FA: 0.14, PALM: 0.07, HAND_SCALE: 1.0, behind: { L: [0.05, 0.09, -0.18], R: [-0.052, 0.105, -0.185] } };
  var REST = { spine: 0.04, neck: 0.12, head: -0.14, thighZ: 0.06, shinZ: -0.06 };
  var REST_ELDER = { spine: 0.2, neck: 0.26, head: -0.26, thighZ: 0.06, shinZ: -0.08 };
  // Cloth in the family's pattern (sprites.js, clothOf): the line's dye, and the other parent's
  // line's dye woven through it in a pattern laid out on the body (so it moves with them).
  var PAT = {
    stripes: "step(0.5, fract(q.y))",
    rib: "step(0.5, fract(u * 1.4))",
    check: "abs(step(0.5, fract(u)) - step(0.5, fract(q.y)))",
    chevron: "step(0.5, fract(q.y + abs(fract(u) - 0.5)))",
    zigzag: "step(0.62, fract(q.y * 1.3 + abs(fract(u * 1.6) - 0.5) * 1.6))",
    knit: "step(0.55, fract(q.y * 1.6 - abs(fract(u * 2.2) - 0.5)))",
    tweed: "step(0.74, pkHash(floor(vec2(u, q.y) * 2.0)))",
  };
  function clothMat(cl) {
    var k = "cloth" + cl.pat + cl.dye + "." + cl.dye2;
    if (mats[k]) return mats[k];
    var A = CF2_DYE[cl.dye],
      Bt = CF2_DYE[cl.dye2],
      m = PKToon.rampMat(A[0], A[1], A[2]),
      base = m.onBeforeCompile,
      c2 = [PKCore.col(Bt[0]), PKCore.col(Bt[1]), PKCore.col(Bt[2])];
    m.onBeforeCompile = function (sh, r) {
      base.call(this, sh, r);
      sh.uniforms.cD2 = { value: c2[0] };
      sh.uniforms.cM2 = { value: c2[1] };
      sh.uniforms.cL2 = { value: c2[2] };
      sh.vertexShader = "varying vec3 vLoc;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n  vLoc = position;");
      sh.fragmentShader =
        "uniform vec3 cD2; uniform vec3 cM2; uniform vec3 cL2; varying vec3 vLoc;\n" +
        sh.fragmentShader.replace(
          "vec3 tone = (Lf + dth) < tD ? cD : ( (Lf + dth) < tL ? cM : cL );",
          "vec3 q = vLoc * 22.0; float u = (q.x + q.z) * 0.8; float pat = " +
            PAT[cl.pat] +
            ";\n  vec3 tone = (Lf + dth) < tD ? mix(cD, cD2, pat) : ( (Lf + dth) < tL ? mix(cM, cM2, pat) : mix(cL, cL2, pat) );",
        );
    };
    m.customProgramCacheKey = function () {
      return "cf2-cloth-" + cl.pat;
    };
    m.name = "Folk_" + k;
    return (mats[k] = m);
  }
  function mesh(geo, mat) {
    var m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
  function ell(rx, ry, rz, s) {
    var g = new THREE.SphereGeometry(1, s || 14, Math.max(7, Math.round((s || 14) * 0.6)));
    g.scale(rx, ry, rz);
    return g;
  }
  function at(o, x, y, z, rx, ry, rz) {
    o.position.set(x, y, z);
    if (rx || ry || rz) o.rotation.set(rx || 0, ry || 0, rz || 0);
    return o;
  }
  function key(c) {
    var l = c.look || {};
    return `${furIndex(l)}|${c.stage}|${l.tail || 0}|${l.ear > 1.15 ? 1 : 0}|${clothOf(c).key}|${l.pat}|${l.pale}|${l.face}|${l.socks}|${c.stage === "child" ? "" : c.wear || l.wear}|${c.tr || ""}`;
  }
  // A marking laid on the surface of a round part (centre C, radii R): at angle th down from the
  // top and ph round from the front, a thin oval a wide (round the part) and b tall, flat to it.
  var _q = new THREE.Quaternion(),
    _m = new THREE.Matrix4();
  function onPart(C, R, th, ph, a, b, mat, tilt) {
    var st = Math.sin(th),
      p = new THREE.Vector3(R[0] * st * Math.sin(ph), R[1] * Math.cos(th), R[2] * st * Math.cos(ph)),
      n = new THREE.Vector3(p.x / (R[0] * R[0]), p.y / (R[1] * R[1]), p.z / (R[2] * R[2])).normalize(),
      t = new THREE.Vector3(R[0] * Math.cos(ph), 0, -R[2] * Math.sin(ph)).normalize(),
      bt = new THREE.Vector3().crossVectors(n, t).normalize();
    if (tilt) t.applyAxisAngle(n, tilt), bt.crossVectors(n, t).normalize();
    var g = ell(a, b, 0.012, 10);
    _m.makeBasis(t, bt, n);
    g.applyMatrix4(_m);
    g.translate(C[0] + p.x + n.x * 0.003, C[1] + p.y + n.y * 0.003, C[2] + p.z + n.z * 0.003);
    return mesh(g, mat);
  }
  // small numbers from a creekfolk's id (where their patches and spots fall)
  function hsh(id, k) {
    var h = Math.imul(id * 73856093 + k * 19349663, 2654435761) >>> 0;
    return ((h ^ (h >>> 15)) % 1000) / 1000;
  }
  function build(c, vw) {
    var look = c.look || {},
      elder = c.stage === "elder",
      child = c.stage === "child",
      furT = CF2_FUR[furIndex(look)].slice();
    if (elder) furT = [furT[0], furT[1], "#dcd8d0"];
    var fi = furIndex(look),
      fur = M(furT, "fur" + fi + (elder ? "e" : "")),
      furS = M([furT[0], furT[0], furT[1]], "furS" + fi + (elder ? "e" : "")),
      markM = look.pale ? M(CF2_MARK_PALE, "markPale") : M(CF2_MARK_DARK[fi], "markDark" + fi),
      maskM = M(CF2_MARK_DARK[fi], "markDark" + fi),
      paleM = M(CF2_MARK_PALE, "markPale"),
      paw = look.socks ? paleM : furS,
      wear = child ? null : c.wear || look.wear || null,
      W3 = (k2) => M(CF2_WEAR[k2], "wear_" + k2),
      belly = M(look.belly > 0.7 ? EXTRA.cream : [furT[1], furT[2], furT[2]], "belly" + (look.belly > 0.7 ? "c" : furIndex(look))),
      cloth = clothMat(clothOf(c)),
      ink = M(EXTRA.ink, "ink"),
      ear = M(EXTRA.ear, "ear"),
      nose = M(EXTRA.nose, "nose"),
      glint = M(EXTRA.glint, "glint");
    var k = PhilosopherKing.createRig({ dims: DIMS, rest: elder ? REST_ELDER : REST, props: false }),
      J = k.joints,
      u = 0.46,
      earK = clamp(look.ear || 1, 0.6, 1.4),
      earW = clamp(look.earW || 1, 0.7, 1.3);
    // the head: a big round skull, a muzzle, ears, eyes and a nose
    var H = new THREE.Group();
    J.Head.add(H);
    H.add(at(mesh(ell(0.5 * u, 0.47 * u, 0.48 * u, 18), fur), 0, 0.5 * u, 0));
    H.add(at(mesh(ell(0.26 * u, 0.2 * u, 0.2 * u, 12), belly), 0, 0.3 * u, 0.36 * u));
    [-1, 1].forEach(function (s) {
      var e = at(mesh(ell(0.15 * u * earW, 0.24 * u * earK, 0.07 * u, 10), fur), s * 0.3 * u, 0.92 * u, -0.02 * u);
      e.rotation.z = -s * 0.35;
      H.add(e);
      var ei = at(mesh(ell(0.09 * u * earW, 0.16 * u * earK, 0.03 * u, 8), ear), s * 0.3 * u, 0.92 * u, 0.04 * u);
      ei.rotation.z = -s * 0.35;
      H.add(ei);
      if (wear === "bells") {
        var eh = 0.23 * u * earK;
        H.add(at(mesh(ell(0.028, 0.03, 0.028, 8), W3("gold")), s * (0.3 * u + eh * Math.sin(0.35)), 0.92 * u + eh * Math.cos(0.35), -0.02 * u));
        H.add(at(mesh(new THREE.BoxGeometry(0.02, 0.08, 0.012), cloth), s * (0.3 * u + eh * Math.sin(0.35)) + s * 0.02, 0.92 * u + eh * Math.cos(0.35) - 0.06, 0.0));
      }
      var ey = (look.eye || 1) * 0.07 * u;
      H.add(at(mesh(ell(ey, ey * 1.15, ey * 0.6, 8), ink), s * 0.17 * u, 0.52 * u, 0.43 * u));
      H.add(at(mesh(new THREE.BoxGeometry(0.03 * u, 0.03 * u, 0.02 * u), glint), s * 0.17 * u + 0.015 * u, 0.55 * u, 0.47 * u));
    });
    H.add(at(mesh(ell(0.06 * u, 0.045 * u, 0.04 * u, 8), nose), 0, 0.37 * u, 0.55 * u));
    // the face and the coat on the head (Creekfolk 1's inherited looks)
    var HC = [0, 0.5 * u, 0],
      HR = [0.5 * u, 0.47 * u, 0.48 * u];
    if (look.face === "mask") [-1, 1].forEach((s) => H.add(onPart(HC, HR, 1.53, s * 0.36, 0.12 * u, 0.085 * u, maskM)));
    if (look.face === "blaze") H.add(onPart(HC, HR, 0.92, 0, 0.055 * u, 0.25 * u, paleM));
    if (look.pat === "stripes") {
      [0.55, 0.85, 1.15].forEach((th) => [-0.5, 0, 0.5].forEach((d) => H.add(onPart(HC, HR, th, Math.PI + d, 0.13 * u, 0.04 * u, markM))));
      [-1, 1].forEach((s) => H.add(onPart(HC, HR, 0.5, s * 0.22, 0.03 * u, 0.09 * u, markM, s * 0.3)));
    }
    if (look.pat === "patches") H.add(onPart(HC, HR, 0.9 + 0.5 * hsh(c.id, 1), (hsh(c.id, 2) < 0.5 ? -1 : 1) * (1.2 + 0.6 * hsh(c.id, 3)), 0.17 * u, 0.13 * u, markM, hsh(c.id, 4)));
    if (look.pat === "spots") for (var sp = 0; sp < 4; sp++) H.add(onPart(HC, HR, 0.35 + 0.8 * hsh(c.id, 10 + sp), Math.PI + (hsh(c.id, 20 + sp) - 0.5) * 2.6, 0.045 * u, 0.045 * u, markM));
    // what they wear on their head, for what they love
    var top = 0.97 * u;
    if (wear === "lilypad") {
      var lp = at(mesh(new THREE.CylinderGeometry(0.36 * u, 0.37 * u, 0.025, 16, 1, false, 0.35, 5.6), W3("lily")), 0, top + 0.004, -0.02 * u);
      lp.rotation.set(-0.18, 0.4, 0.06);
      H.add(lp);
      for (var pe = 0; pe < 4; pe++) H.add(at(mesh(ell(0.03, 0.02, 0.03, 6), W3("bloom")), 0.12 * u + Math.cos(pe * 1.57) * 0.025, top + 0.035, 0.1 * u + Math.sin(pe * 1.57) * 0.025));
      H.add(at(mesh(ell(0.018, 0.018, 0.018, 6), W3("heart")), 0.12 * u, top + 0.05, 0.1 * u));
    } else if (wear === "sunhat") {
      H.add(at(mesh(new THREE.CylinderGeometry(0.5 * u, 0.52 * u, 0.022, 18), W3("straw")), 0, 0.9 * u, 0));
      H.add(at(mesh(new THREE.CylinderGeometry(0.25 * u, 0.29 * u, 0.17 * u, 14), W3("straw")), 0, 0.98 * u, 0));
      H.add(at(mesh(new THREE.CylinderGeometry(0.295 * u, 0.295 * u, 0.04 * u, 14), cloth), 0, 0.93 * u, 0));
      H.add(at(mesh(ell(0.02, 0.05, 0.02, 6), W3("lily")), 0.22 * u, 1.0 * u, 0.12 * u, 0, 0, -0.4));
    } else if (wear === "flower") {
      for (var pf = 0; pf < 5; pf++) H.add(at(mesh(ell(0.032, 0.022, 0.032, 6), W3("bloom")), 0.36 * u + Math.cos(pf * 1.26) * 0.03, 0.76 * u + Math.sin(pf * 1.26) * 0.03, 0.16 * u));
      H.add(at(mesh(ell(0.02, 0.02, 0.02, 6), W3("heart")), 0.36 * u, 0.76 * u, 0.175 * u));
    }
    // the body: round, with a light belly and the family's cloth over the shoulders
    var S = new THREE.Group();
    J.Spine.add(S);
    S.add(at(mesh(ell(0.2, 0.24, 0.17, 16), fur), 0, 0.17, 0));
    S.add(at(mesh(ell(0.14, 0.17, 0.08, 12), belly), 0, 0.14, 0.11));
    // a scarf for everyone; a short cape over the shoulders for grown-ups (a longer shawl for elders)
    S.add(at(mesh(new THREE.TorusGeometry(0.15, 0.05, 6, 14), cloth), 0, 0.33, 0, Math.PI / 2));
    if (!child) {
      var cape = new THREE.CylinderGeometry(0.13, elder ? 0.25 : 0.235, elder ? 0.2 : 0.15, 18, 2, true);
      cape.scale(1, 1, 0.86);
      S.add(at(mesh(cape, cloth), 0, elder ? 0.28 : 0.3, 0));
    }
    var BC = [0, 0.17, 0],
      BR = [0.2, 0.24, 0.17],
      PC = [0, 0, 0],
      PR = [0.18, 0.12, 0.15];
    if (look.pat === "stripes") [0.75, 1.1, 1.45].forEach((th) => [-0.55, 0, 0.55].forEach((d) => S.add(onPart(BC, BR, th, Math.PI + d, 0.075, 0.022, markM))));
    if (look.pat === "saddle") S.add(onPart(BC, BR, 1.05, Math.PI, 0.17, 0.15, markM));
    if (look.pat === "patches")
      for (var pq = 0; pq < 2; pq++) S.add(onPart(BC, BR, 0.9 + 0.6 * hsh(c.id, 30 + pq), (pq ? 1 : -1) * (1.3 + 1.2 * hsh(c.id, 40 + pq)), 0.07 + 0.03 * hsh(c.id, 50 + pq), 0.06, markM, hsh(c.id, 60 + pq)));
    if (look.pat === "spots") for (var ss = 0; ss < 7; ss++) S.add(onPart(BC, BR, 0.6 + 1.1 * hsh(c.id, 70 + ss), Math.PI + (hsh(c.id, 80 + ss) - 0.5) * 3.2, 0.022, 0.022, markM));
    if (wear === "apron") {
      var ap = new THREE.CylinderGeometry(0.2, 0.215, 0.22, 10, 1, true, -0.95, 1.9);
      ap.scale(1, 1, 0.92);
      S.add(at(mesh(ap, W3("leather")), 0, 0.1, 0.012));
      [-1, 1].forEach((s) => S.add(at(mesh(new THREE.BoxGeometry(0.03, 0.2, 0.02), W3("leather")), s * 0.08, 0.26, 0.135, -0.35)));
    } else if (wear === "satchel") {
      var strap = at(mesh(new THREE.TorusGeometry(0.215, 0.012, 4, 22), W3("leather")), 0, 0.2, 0);
      strap.rotation.set(0, 0, 0.75);
      strap.scale.set(1, 1, 0.85);
      S.add(strap);
    } else if (wear === "scarf") {
      S.add(at(mesh(new THREE.BoxGeometry(0.055, 0.18, 0.025), cloth), 0.07, 0.24, 0.16, -0.25, 0, 0.12));
      S.add(at(mesh(new THREE.BoxGeometry(0.05, 0.13, 0.025), cloth), 0.11, 0.26, 0.15, -0.25, 0, 0.35));
    }
    // the treasure the creek brought them, on a cord round the neck (cf2-treasure.js)
    if (c.tr && CF2Valley.PAINT["tr_" + c.tr]) {
      var cord = at(mesh(new THREE.TorusGeometry(0.105, 0.006, 4, 16), M(CF2_WEAR.leather || EXTRA.stick, "cord")), 0, 0.3, 0.03, Math.PI / 2 - 0.35, 0, 0);
      S.add(cord);
      S.add(at(mesh(new THREE.IcosahedronGeometry(0.026, 0), M(CF2Valley.PAINT["tr_" + c.tr], "tr_" + c.tr)), 0, 0.23, 0.165));
    }
    var HP = new THREE.Group();
    J.Hips.add(HP);
    HP.add(at(mesh(ell(0.18, 0.12, 0.15, 12), fur), 0, 0.0, 0));
    if (look.pat === "saddle") HP.add(onPart(PC, PR, 0.9, Math.PI, 0.14, 0.09, markM));
    if (look.pat === "spots") for (var s2 = 0; s2 < 3; s2++) HP.add(onPart(PC, PR, 0.7 + 0.6 * hsh(c.id, 90 + s2), Math.PI + (hsh(c.id, 95 + s2) - 0.5) * 2.4, 0.022, 0.022, markM));
    if (wear === "satchel") HP.add(at(mesh(new THREE.BoxGeometry(0.06, 0.11, 0.12), W3("leather")), 0.2, 0.02, 0.02, 0, 0, -0.1));
    for (var t = 0; t < (look.tail || 0) + 1; t++) HP.add(at(mesh(ell(0.06, 0.06, 0.09 + 0.03 * (look.tail || 0), 8), furS), 0, 0.02 + t * 0.03, -0.17 - t * 0.04));
    // arms and paws
    ["L", "R"].forEach(function (Sd) {
      var UA = new THREE.Group(),
        FA = new THREE.Group(),
        HD = new THREE.Group(),
        TH = new THREE.Group(),
        SH = new THREE.Group(),
        FT = new THREE.Group();
      J["UpperArm_" + Sd].add(UA);
      J["Forearm_" + Sd].add(FA);
      J["Hand_" + Sd].add(HD);
      J["Thigh_" + Sd].add(TH);
      J["Shin_" + Sd].add(SH);
      J["Foot_" + Sd].add(FT);
      UA.add(at(mesh(ell(0.055, 0.1, 0.055, 8), fur), 0, -0.07, 0));
      FA.add(at(mesh(ell(0.05, 0.09, 0.05, 8), fur), 0, -0.06, 0));
      HD.add(at(mesh(ell(0.055 * (look.hands || 1), 0.05, 0.055, 8), paw), 0, -0.03, 0.01));
      TH.add(at(mesh(ell(0.075, 0.11, 0.075, 8), fur), 0, -0.08, 0));
      SH.add(at(mesh(ell(0.06, 0.09, 0.06, 8), fur), 0, -0.07, 0));
      FT.add(at(mesh(ell(0.075, 0.045, 0.11, 8), paw), 0, -0.1, 0.04));
    });
    if (elder) {
      var stick = mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.05, 6), M(EXTRA.stick, "stick"));
      stick.position.set(0, -0.35, 0.03);
      J.Slot_Hand_R.add(stick);
    }
    if (PKToon2 && PKToon2.merge) PKToon2.merge(k, null);
    // eyelids, added after the merge so they can be shown alone: shut while they sleep
    var lids = [-1, 1].map(function (s) {
      var ey = (look.eye || 1) * 0.07 * u,
        l = at(mesh(ell(ey * 1.3, ey * 1.3, ey * 0.75, 8), fur), s * 0.17 * u, 0.52 * u, 0.44 * u);
      l.visible = false;
      H.add(l);
      return l;
    });
    var root = new THREE.Group();
    root.add(k.root);
    var sc = (look.size || 1) * (child ? 0.62 : 1);
    k.root.scale.setScalar(sc);
    if (child) H.scale.setScalar(1.18);
    k.play("idle", 0);
    return { root: root, rig: k, anim: "idle", lids: lids };
  }
  // What they hold while carrying (c.carry.k): sticks, a bundle of reeds, a stone, a lump of
  // mud or clay, seeds or berries in a little basket, a tile.
  function carried(k) {
    var g = new THREE.Group(),
      add = (geo, mat, x, y, z, rx, ry, rz) => g.add(at(mesh(geo, mat), x, y, z, rx, ry, rz));
    if (k === "branch" || k === "log")
      for (var q = 0; q < 3; q++) add(new THREE.CylinderGeometry(0.018, 0.024, 0.62, 5), M(EXTRA.stick, "stick"), (q - 1) * 0.04, 0, 0, Math.PI / 2, 0.3 + q * 0.12, 0);
    else if (k === "reeds") for (var r2 = 0; r2 < 5; r2++) add(new THREE.CylinderGeometry(0.01, 0.012, 0.55, 4), M(CF2_WEAR.lily, "wear_lily"), (r2 - 2) * 0.025, 0.05, 0, 0.2, 0, 1.35);
    else if (k === "stone" || k === "tiles" || k === "tile") add(new THREE.DodecahedronGeometry(0.09, 0), M(["#6a6a64", "#908e86", "#b2b0a6"], "carryStone"), 0, 0, 0);
    else if (k === "mud" || k === "clay") add(ell(0.09, 0.07, 0.08, 8), M(["#5a3e28", "#7a5a3a", "#9a7a52"], "carryMud"), 0, 0, 0);
    else {
      add(new THREE.CylinderGeometry(0.08, 0.06, 0.07, 8), M(CF2_WEAR.straw, "wear_straw"), 0, 0, 0);
      for (var b2 = 0; b2 < 4; b2++) add(ell(0.022, 0.022, 0.022, 5), M(k === "seeds" ? CF2_WEAR.heart : CF2_WEAR.bloom, k === "seeds" ? "wear_heart" : "wear_bloom"), Math.cos(b2 * 1.6) * 0.035, 0.045, Math.sin(b2 * 1.6) * 0.035);
    }
    return g;
  }
  // The clips the rig has (walk, sit, idle) carry most of it; what they are doing is laid over
  // them, joint by joint: sleeping curled on the ground, working bent over with an arm swinging,
  // talking with their hands, playing in hops, eating, grooming, carrying in both arms.
  var _qa = new THREE.Quaternion(),
    _ea = new THREE.Euler();
  function turn(j, x, y, z) {
    if (!j) return;
    _ea.set(x || 0, y || 0, z || 0);
    j.quaternion.multiply(_qa.setFromEuler(_ea));
  }
  var WORK = { labor: 1, craft: 1, dig: 1, sow: 1, harvest: 1, pick: 1, heavyj: 1, mark: 1, repair: 1, gather: 1, deposit: 0.5, stash: 0.5, take: 0.5 };
  function pose(m, c, p) {
    m.root.position.set(p.x, p.y, p.z);
    m.root.rotation.set(0, p.face, 0);
    var a = c.act || {},
      ty = a.type,
      asleep = c.asleep || ty === "sleep" || ty === "nap",
      seated = ty === "sit" || ty === "chat" || ty === "watch" || ty === "huddle" || ty === "groom" || ty === "eat",
      want = p.walking ? "walk" : asleep || seated ? "sit" : "idle";
    if (want !== m.anim) (m.anim = want), m.rig.play(want, 0.25);
    if (m.rig.actions.walk) m.rig.actions.walk.timeScale = 1.6;
    m.rig.mixer.update(p.dt);
    var J = m.rig.joints,
      t = (p.clock || 0) + (c.id % 17) * 0.37,
      carry = c.carry && c.carry.k;
    // the thing they carry
    if (carry !== m.carryK) {
      if (m.carryG) m.root.remove(m.carryG);
      m.carryG = carry ? carried(carry) : null;
      m.carryK = carry;
      if (m.carryG) m.root.add(m.carryG);
    }
    if (m.carryG) {
      var sc = m.rig.root.scale.x;
      m.carryG.position.set(0, 0.8 * sc, 0.24 * sc);
      turn(J.UpperArm_L, -0.9, 0, -0.25);
      turn(J.UpperArm_R, -0.9, 0, 0.25);
      turn(J.Forearm_L, -0.6, 0, 0);
      turn(J.Forearm_R, -0.6, 0, 0);
    }
    if (asleep) {
      // curled up on their side, eyes shut
      m.root.rotation.set(0, p.face, Math.PI / 2 * 0.92);
      m.root.position.y += 0.2 * m.rig.root.scale.x;
      turn(J.Spine, 0.5, 0, 0);
      turn(J.Neck, 0.3, 0, 0);
      turn(J.Thigh_L, -1.0, 0, 0);
      turn(J.Thigh_R, -1.0, 0, 0);
      turn(J.Spine, 0.02 * Math.sin(t * 0.9), 0, 0); // breathing
    } else if (WORK[ty] && !p.walking) {
      // bent to the work, one arm swinging (a stone, a stick, a handful of mud)
      var sw = Math.sin(t * 5.5) * WORK[ty];
      turn(J.Spine, 0.45 * WORK[ty], 0, 0);
      turn(J.Neck, -0.2, 0, 0);
      turn(J.UpperArm_R, -1.1 - 0.5 * sw, 0, 0.1);
      turn(J.Forearm_R, -0.4 + 0.3 * sw, 0, 0);
      turn(J.UpperArm_L, -0.6, 0, -0.1);
    } else if (ty === "chat" || ty === "call") {
      // talking with their hands, a nod now and then
      turn(J.Head, 0.08 * Math.sin(t * 1.7), 0.25 * Math.sin(t * 0.5), 0);
      turn(J.UpperArm_R, -0.5 - 0.35 * Math.max(0, Math.sin(t * 2.3)), 0, 0.2);
      turn(J.Forearm_R, -0.7 - 0.3 * Math.sin(t * 4.1), 0, 0);
      if (ty === "call") turn(J.UpperArm_L, -1.6, 0, -0.3), turn(J.Head, -0.35, 0, 0);
    } else if (ty === "play" && !p.walking) {
      // hopping about, arms up
      var hop = Math.abs(Math.sin(t * 4.2));
      m.root.position.y += 0.22 * hop * m.rig.root.scale.x;
      turn(J.UpperArm_L, -2.2 * hop, 0, -0.3);
      turn(J.UpperArm_R, -2.2 * hop, 0, 0.3);
    } else if (ty === "eat") {
      turn(J.UpperArm_R, -1.3 - 0.2 * Math.sin(t * 3), 0, 0.2);
      turn(J.Forearm_R, -1.2, 0, 0);
      turn(J.Head, 0.06 * Math.sin(t * 6), 0, 0);
    } else if (ty === "groom" || ty === "huddle") {
      turn(J.UpperArm_L, -1.2, 0, -0.5);
      turn(J.Forearm_L, -0.4 + 0.25 * Math.sin(t * 3), 0, 0);
      turn(J.Spine, 0.15, ty === "huddle" ? 0.3 : 0, 0);
    } else if (ty === "watch" || ty === "look") {
      turn(J.Head, -0.25, 0.4 * Math.sin(t * 0.3), 0);
    }
    // the one who suspects someone is looking in: looks up, and waves (cf2-treasure.js)
    if (p.wave && !asleep) {
      turn(J.Head, -0.5, 0, 0);
      turn(J.Neck, -0.15, 0, 0);
      turn(J.UpperArm_R, -2.75, 0, 0.35);
      turn(J.Forearm_R, -0.25 + 0.5 * Math.sin((p.clock || 0) * 9), 0, 0);
    }
    // eyes shut in sleep
    for (var e of m.lids || []) e.visible = !!asleep;
  }
  // every colour a close-up creekfolk can have
  function palette() {
    var out = [];
    for (var k in EXTRA) out.push.apply(out, EXTRA[k]);
    for (var tk in TREASURE_KINDS) out.push.apply(out, CF2Valley.PAINT["tr_" + tk]);
    return out;
  }
  return { ok, build, pose, key, palette };
})();
function folkPalette() {
  return Folk3D.palette();
}
