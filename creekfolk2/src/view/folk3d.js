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
  function at(o, x, y, z) {
    o.position.set(x, y, z);
    return o;
  }
  function key(c) {
    return `${furIndex(c.look || {})}|${c.stage}|${(c.look || {}).tail || 0}|${(c.look || {}).ear > 1.15 ? 1 : 0}|${clothOf(c).key}`;
  }
  function build(c, vw) {
    var look = c.look || {},
      elder = c.stage === "elder",
      child = c.stage === "child",
      furT = CF2_FUR[furIndex(look)].slice();
    if (elder) furT = [furT[0], furT[1], "#dcd8d0"];
    var fur = M(furT, "fur" + furIndex(look) + (elder ? "e" : "")),
      furS = M([furT[0], furT[0], furT[1]], "furS" + furIndex(look) + (elder ? "e" : "")),
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
      var ey = (look.eye || 1) * 0.07 * u;
      H.add(at(mesh(ell(ey, ey * 1.15, ey * 0.6, 8), ink), s * 0.17 * u, 0.52 * u, 0.43 * u));
      H.add(at(mesh(new THREE.BoxGeometry(0.03 * u, 0.03 * u, 0.02 * u), glint), s * 0.17 * u + 0.015 * u, 0.55 * u, 0.47 * u));
    });
    H.add(at(mesh(ell(0.06 * u, 0.045 * u, 0.04 * u, 8), nose), 0, 0.37 * u, 0.55 * u));
    // the body: round, with a light belly and the family's cloth over the shoulders
    var S = new THREE.Group();
    J.Spine.add(S);
    S.add(at(mesh(ell(0.2, 0.24, 0.17, 16), fur), 0, 0.17, 0));
    S.add(at(mesh(ell(0.14, 0.17, 0.08, 12), belly), 0, 0.14, 0.11));
    // a scarf for everyone; a short cape over the shoulders for grown-ups (a longer shawl for elders)
    S.add(at(mesh(new THREE.TorusGeometry(0.15, 0.05, 6, 14), cloth), 0, 0.33, 0)).rotation.x = Math.PI / 2;
    if (!child) {
      var cape = new THREE.CylinderGeometry(0.13, elder ? 0.25 : 0.235, elder ? 0.2 : 0.15, 18, 2, true);
      cape.scale(1, 1, 0.86);
      S.add(at(mesh(cape, cloth), 0, elder ? 0.28 : 0.3, 0));
    }
    var HP = new THREE.Group();
    J.Hips.add(HP);
    HP.add(at(mesh(ell(0.18, 0.12, 0.15, 12), fur), 0, 0.0, 0));
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
      HD.add(at(mesh(ell(0.055 * (look.hands || 1), 0.05, 0.055, 8), furS), 0, -0.03, 0.01));
      TH.add(at(mesh(ell(0.075, 0.11, 0.075, 8), fur), 0, -0.08, 0));
      SH.add(at(mesh(ell(0.06, 0.09, 0.06, 8), fur), 0, -0.07, 0));
      FT.add(at(mesh(ell(0.075, 0.045, 0.11, 8), furS), 0, -0.1, 0.04));
    });
    if (elder) {
      var stick = mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.05, 6), M(EXTRA.stick, "stick"));
      stick.position.set(0, -0.35, 0.03);
      J.Slot_Hand_R.add(stick);
    }
    if (PKToon2 && PKToon2.merge) PKToon2.merge(k, null);
    var root = new THREE.Group();
    root.add(k.root);
    var sc = (look.size || 1) * (child ? 0.62 : 1);
    k.root.scale.setScalar(sc);
    if (child) H.scale.setScalar(1.18);
    k.play("idle", 0);
    return { root: root, rig: k, anim: "idle" };
  }
  function pose(m, c, p) {
    m.root.position.set(p.x, p.y, p.z);
    m.root.rotation.y = p.face;
    var a = c.act || {},
      want = p.walking ? "walk" : a.type === "sleep" || a.type === "nap" || a.type === "sit" || a.type === "chat" || a.type === "watch" || a.type === "huddle" ? "sit" : "idle";
    if (want !== m.anim) (m.anim = want), m.rig.play(want, 0.25);
    if (m.rig.actions.walk) m.rig.actions.walk.timeScale = 1.6;
    m.rig.mixer.update(p.dt);
  }
  // every colour a close-up creekfolk can have
  function palette() {
    var out = [];
    for (var k in EXTRA) out.push.apply(out, EXTRA[k]);
    return out;
  }
  return { ok, build, pose, key, palette };
})();
function folkPalette() {
  return Folk3D.palette();
}
