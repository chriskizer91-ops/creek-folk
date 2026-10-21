/* PKSkin: the v3 rig. Same joint names as before, but the joints are THREE.Bone and the body and clothes are skinned meshes,
   so knees, elbows, the waist, the neck and the knuckles bend smoothly. Units metres, origin at the feet, faces +Z, his left = +X.
   Bind pose = every joint rotation zero (legs straight, arms hanging straight down). Geometry is built in a joint's local frame
   (as before), moved into bind space, and weighted by region functions of the bind-space position. */
(function (global) {
  'use strict';
  var THREE = global.THREE, C = global.PKCore;
  var K = {};
  global.PKSkin = K;
  var smooth = C.smooth, clamp = C.clamp;

  // ------------------------------------------------------------------ dimensions (bind pose)
  var D = K.D = {
    HIPS_Y: 0.920,                       // Hips node (also the Spine pivot)
    THIGH_X: 0.083, THIGH_Y: -0.020,     // hip joints
    L1: 0.425, L2: 0.380, ANK: 0.095,    // thigh, shin, ankle height above the sole
    NECK_Y: 0.505, NECK_Z: -0.016,       // base of the neck, from the Spine pivot
    HEAD_DY: 0.128, HEAD_DZ: 0.010,      // skull base (atlas) from the neck base
    EYE_DY: 0.062, EYE_DZ: 0.030,        // eye line from the skull base
    SH_X: 0.182, SH_Y: 0.476,            // shoulder joints from the Spine pivot
    UA: 0.300, FA: 0.255, PALM: 0.098,   // upper arm, forearm, palm (the hand mesh is scaled by HAND_SCALE)
    HAND_SCALE: 1.10,
  };
  D.PALM_S = D.PALM * D.HAND_SCALE;

  K.JOINTS = ['Hips', 'Spine', 'Neck', 'Head', 'UpperArm_L', 'Forearm_L', 'Hand_L', 'Fingers_L', 'UpperArm_R', 'Forearm_R', 'Hand_R', 'Fingers_R',
    'Thigh_L', 'Shin_L', 'Foot_L', 'Thigh_R', 'Shin_R', 'Foot_R'];

  // ------------------------------------------------------------------ rig
  K.makeRig = function (dims) {
    var D = Object.assign({}, K.D, dims || {}); D.PALM_S = D.PALM * D.HAND_SCALE;
    var root = new THREE.Group(); root.name = 'PhilosopherKing';
    var J = {}, bones = [];
    function bone(name, parent, x, y, z) { var b = new THREE.Bone(); b.name = name; b.position.set(x, y, z); parent.add(b); J[name] = b; bones.push(b); return b; }
    function slot(name, parent, x, y, z) { var g = new THREE.Group(); g.name = name; g.position.set(x, y, z); parent.add(g); J[name] = g; return g; }
    var hips = bone('Hips', root, 0, D.HIPS_Y, 0);
    var spine = bone('Spine', hips, 0, 0, 0);
    var neck = bone('Neck', spine, 0, D.NECK_Y, D.NECK_Z);
    var head = bone('Head', neck, 0, D.HEAD_DY, D.HEAD_DZ);
    slot('Slot_Head', head, 0, D.EYE_DY, D.EYE_DZ);
    [1, -1].forEach(function (s) {
      var S = s > 0 ? 'L' : 'R';
      var ua = bone('UpperArm_' + S, spine, s * D.SH_X, D.SH_Y, 0);
      var fa = bone('Forearm_' + S, ua, 0, -D.UA, 0);
      var hd = bone('Hand_' + S, fa, 0, -D.FA, 0);
      bone('Fingers_' + S, hd, 0, -D.PALM_S, 0);
      slot('Slot_Hand_' + S, hd, 0, -0.062, 0);
    });
    [1, -1].forEach(function (s) {
      var S = s > 0 ? 'L' : 'R';
      var th = bone('Thigh_' + S, hips, s * D.THIGH_X, D.THIGH_Y, 0);
      var sh = bone('Shin_' + S, th, 0, -D.L1, 0);
      bone('Foot_' + S, sh, 0, -D.L2, 0);
    });
    var rig = { root: root, J: J, bones: bones, index: {}, D: D };
    bones.forEach(function (b, i) { rig.index[b.name] = i; });
    // bind pose: all rotations zero; remember each joint's bind matrix relative to the root
    root.updateMatrixWorld(true);
    rig.bindM = {}; rig.bindP = {};
    Object.keys(J).forEach(function (n) { rig.bindM[n] = J[n].matrixWorld.clone(); rig.bindP[n] = new THREE.Vector3().setFromMatrixPosition(J[n].matrixWorld); });
    rig.skeleton = new THREE.Skeleton(bones);   // inverses from the bind pose
    rig.identity = new THREE.Matrix4();
    return rig;
  };

  // ------------------------------------------------------------------ weights
  // A weight function takes a bind-space point (x, y, z) and returns {boneName: w, ...}; at most 4 non-zero, normalised here.
  function pack(rig, geo, wfn) {
    var p = geo.attributes.position, n = p.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), i;
    for (i = 0; i < n; i++) {
      var w = wfn(p.getX(i), p.getY(i), p.getZ(i), i), list = [];
      for (var k in w) if (w[k] > 1e-4) list.push([k, w[k]]);
      list.sort(function (a, b) { return b[1] - a[1]; }); list = list.slice(0, 4);
      var tot = 0; list.forEach(function (e) { tot += e[1]; });
      if (!list.length) { list = [['Hips', 1]]; tot = 1; }
      for (var j = 0; j < 4; j++) {
        if (j < list.length) { var bi = rig.index[list[j][0]]; if (bi === undefined) throw new Error('no bone ' + list[j][0]); si[i * 4 + j] = bi; sw[i * 4 + j] = list[j][1] / tot; }
      }
    }
    geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
    geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
    return geo;
  }
  K.pack = pack;
  // geometry built in `joint`-local space -> bind space (positions and normals)
  K.toBind = function (rig, geo, joint) { if (joint && joint !== 'root') geo.applyMatrix4(rig.bindM[joint]); return geo; };
  // make a skinned mesh (geometry already in bind space) and hang it on the root
  K.mesh = function (rig, geo, mat, name, wfn) {
    if (!geo.attributes.skinIndex) pack(rig, geo, wfn);
    var m = new THREE.SkinnedMesh(geo, mat); m.name = name; m.frustumCulled = false;
    (Array.isArray(mat) ? mat : [mat]).forEach(function (q) { q.skinning = true; });
    rig.root.add(m); m.bind(rig.skeleton, rig.identity);
    return m;
  };
  // convenience: build in joint space, weight in bind space
  K.skinned = function (rig, geo, joint, mat, name, wfn) { K.toBind(rig, geo, joint); return K.mesh(rig, geo, mat, name, wfn); };

  // ------------------------------------------------------------------ region weight functions (bind space)
  // Each returns a function (x, y, z) -> weights. The same function is used for the skin and for every layer of cloth over it,
  // so the layers move together.
  function lerpW(a, b, t) { var o = {}, k; for (k in a) o[k] = (o[k] || 0) + a[k] * (1 - t); for (k in b) o[k] = (o[k] || 0) + b[k] * t; return o; }
  function one(n) { var o = {}; o[n] = 1; return o; }
  K.lerpW = lerpW; K.one = one;

  var W = K.W = {};
  // torso: Hips below the waist, Spine above; shoulders take some of the upper arm; the collar region some of the neck
  W.torso = function (rig, o) {
    o = o || {};
    var y0 = rig.bindP.Hips.y + (o.w0 === undefined ? 0.035 : o.w0), y1 = rig.bindP.Hips.y + (o.w1 === undefined ? 0.165 : o.w1);
    var sh = rig.bindP.UpperArm_L, nk = rig.bindP.Neck, armK = o.arm === undefined ? 0.45 : o.arm, neckK = o.neck === undefined ? 0.5 : o.neck;
    return function (x, y, z) {
      var t = smooth(y0, y1, y), w = lerpW(one('Hips'), one('Spine'), t);
      // shoulder cap: outside the shoulder joint and near its height, some upper-arm weight
      var ax = Math.abs(x), S = x >= 0 ? 'L' : 'R';
      var a = armK * smooth(sh.x - 0.075, sh.x + 0.010, ax) * smooth(sh.y - 0.16, sh.y - 0.02, y);
      if (a > 0) w = lerpW(w, one('UpperArm_' + S), a);
      var n = neckK * smooth(nk.y - 0.035, nk.y + 0.030, y) * smooth(0.11, 0.05, ax);
      if (n > 0) w = lerpW(w, one('Neck'), n);
      return w;
    };
  };
  // one leg, from inside the pelvis to the ankle. hip blend near the hip joint, knee and ankle blends.
  W.leg = function (rig, S, o) {
    o = o || {};
    var hip = rig.bindP['Thigh_' + S], knee = rig.bindP['Shin_' + S], ank = rig.bindP['Foot_' + S];
    var kb = o.knee === undefined ? 0.050 : o.knee, ab = o.ankle === undefined ? 0.022 : o.ankle;
    var h0 = o.h0 === undefined ? -0.045 : o.h0, h1 = o.h1 === undefined ? 0.085 : o.h1;   // hip blend, measured downward from the hip joint
    return function (x, y, z) {
      var s = hip.y - y;   // distance below the hip joint
      var w = lerpW(one('Hips'), one('Thigh_' + S), smooth(h0, h1, s));
      w = lerpW(w, one('Shin_' + S), smooth(knee.y + kb, knee.y - kb, y));
      w = lerpW(w, one('Foot_' + S), smooth(ank.y + ab, ank.y - ab * 0.6, y));
      return w;
    };
  };
  // both legs + pelvis: choose the side by x (pelvis centre stays on Hips)
  W.legs = function (rig, o) {
    var L = W.leg(rig, 'L', o), R = W.leg(rig, 'R', o);
    return function (x, y, z) { return x >= 0 ? L(x, y, z) : R(x, y, z); };
  };
  // a pelvis/shorts body: Hips + legs by side with a centre blend, Spine above the waist
  W.pelvis = function (rig, o) {
    o = o || {};
    var legs = W.legs(rig, o), tor = W.torso(rig, o), hipY = rig.bindP.Thigh_L.y;
    return function (x, y, z) {
      if (y > hipY + 0.02) return tor(x, y, z);
      var lw = legs(x, y, z), c = smooth(0.0, 0.05, Math.abs(x));      // the crotch line stays with the hips
      return lerpW(lerpW(one('Hips'), lw, c), tor(x, y, z), smooth(hipY - 0.04, hipY + 0.02, y) * 0);
    };
  };
  // one arm hanging in bind pose: shoulder blend with the spine, elbow, wrist
  W.arm = function (rig, S, o) {
    o = o || {};
    var sh = rig.bindP['UpperArm_' + S], el = rig.bindP['Forearm_' + S], wr = rig.bindP['Hand_' + S];
    var eb = o.elbow === undefined ? 0.045 : o.elbow, wb = o.wrist === undefined ? 0.020 : o.wrist;
    var s0 = o.s0 === undefined ? -0.030 : o.s0, s1 = o.s1 === undefined ? 0.060 : o.s1;
    return function (x, y, z) {
      var s = sh.y - y;
      var w = lerpW(one('Spine'), one('UpperArm_' + S), smooth(s0, s1, s));
      w = lerpW(w, one('Forearm_' + S), smooth(el.y + eb, el.y - eb, y));
      w = lerpW(w, one('Hand_' + S), smooth(wr.y + wb, wr.y - wb * 0.5, y));
      return w;
    };
  };
  // neck: spine at the base, head at the top
  W.neck = function (rig, o) {
    o = o || {};
    var nk = rig.bindP.Neck, hd = rig.bindP.Head;
    return function (x, y, z) {
      var w = lerpW(one('Spine'), one('Neck'), smooth(nk.y - 0.030, nk.y + 0.035, y));
      w = lerpW(w, one('Head'), smooth(hd.y - 0.030, hd.y + 0.020, y));
      return w;
    };
  };
  // hand: palm on Hand, fingers blend in past the knuckles
  W.hand = function (rig, S) {
    var fj = rig.bindP['Fingers_' + S];
    return function (x, y, z) { return lerpW(one('Hand_' + S), one('Fingers_' + S), smooth(fj.y + 0.010, fj.y - 0.016, y)); };
  };
})(typeof window !== 'undefined' ? window : globalThis);

;