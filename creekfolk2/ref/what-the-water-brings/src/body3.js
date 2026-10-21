/* PKBody3: the visible body of the v3 Philosopher King, as skinned meshes on the PKSkin rig.
   Thin bare legs with bony knees, the neck, wrists and big veined hands, black crew socks and chunky striped trainers.
   Built in a joint's local frame, then moved into bind space and weighted (see skin.js). Left side built, right side mirrored. */
(function (global) {
  'use strict';
  var THREE = global.THREE, C = global.PKCore, Fab = global.PKFabric, K = global.PKSkin;
  var B3 = {};
  global.PKBody3 = B3;
  var D = K.D, PI = Math.PI, smooth = C.smooth, mix = C.mix, clamp = C.clamp;
  function g(x, c, w) { var t = (x - c) / w; return Math.exp(-t * t); }
  function mirrorX(geo) {
    var p = geo.attributes.position, n = geo.attributes.normal, i;
    for (i = 0; i < p.count; i++) p.setX(i, -p.getX(i));
    if (n) for (i = 0; i < n.count; i++) n.setX(i, -n.getX(i));
    if (geo.index) { var a = geo.index.array, t; for (i = 0; i < a.length; i += 3) { t = a[i + 1]; a[i + 1] = a[i + 2]; a[i + 2] = t; } }
    else { var pa = p.array, na = n ? n.array : null, ua = geo.attributes.uv ? geo.attributes.uv.array : null; for (i = 0; i < p.count; i += 3) { swap(pa, i + 1, i + 2, 3); if (na) swap(na, i + 1, i + 2, 3); if (ua) swap(ua, i + 1, i + 2, 2); } }
    return geo;
  }
  function swap(a, i, j, k) { for (var q = 0; q < k; q++) { var t = a[i * k + q]; a[i * k + q] = a[j * k + q]; a[j * k + q] = t; } }
  B3.mirrorX = mirrorX; B3.g = g;
  function mesh(geo, mat, name) { var m = new THREE.Mesh(geo, mat); m.name = name; return m; }
  function skinMat(t, o) {
    o = o || {};
    var m = new THREE.MeshStandardMaterial({ map: t.map, normalMap: t.normal, normalScale: new THREE.Vector2(o.ns || 1, o.ns || 1), roughness: o.rough || 0.62, metalness: 0 });
    m.name = o.name || 'Skin'; return m;
  }
  B3.skinMat = skinMat;

  // ------------------------------------------------------------------ materials
  B3.SKIN = '#e2ae94';     // pale, pink-peach (the photos)
  B3.materials = function () {
    var hand = Fab.skin({
      kind: 'hand', seed: 14, h: 512, w: 512, color: '#d29a80', pale: '#e2b39c', red: '#c87561', spot: '#a86e50',
      veins: (function () {
        var v = [[[0.76, 0.02], [0.72, 0.25], [0.79, 0.50], [0.74, 0.78], [0.79, 1.0]], [[0.70, 0.04], [0.67, 0.30], [0.72, 0.55], [0.69, 0.9]], [[0.83, 0.08], [0.86, 0.35], [0.82, 0.65], [0.85, 0.95]], [[0.62, 0.05], [0.60, 0.25], [0.64, 0.5]]];
        v[0].w = 0.016; v[1].w = 0.011; v[2].w = 0.010; v[3].w = 0.008; return v;
      })()
    });
    var neck = Fab.skin({ kind: 'neck', seed: 15, h: 512, w: 512, color: '#d6a48d', red: '#c98470', spot: '#b08068', strength: 2.0 });
    var leg = Fab.skin({ kind: 'leg', seed: 16, w: 512, h: 1024, color: '#d9a68d', pale: '#e5bba5', red: '#cf8169', spot: '#b4805f', vein: '#8a93ab', knee: LEG_KNEE_V, kneeH: 0.040, med: -1 });
    var mats = {
      hand: skinMat(hand, { name: 'Skin_Hands', rough: 0.58 }), neck: skinMat(neck, { name: 'Skin_Neck', rough: 0.64, ns: 0.45 }), leg: skinMat(leg, { name: 'Skin_Legs', rough: 0.55, ns: 0.8 }),
      fingers: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.58, metalness: 0, name: 'Skin_Fingers' }),
      nail: new THREE.MeshStandardMaterial({ color: C.col('#e3c3b2'), roughness: 0.35, metalness: 0, name: 'Nails' }),
      tex: { hand: hand, neck: neck, leg: leg }
    };
    return mats;
  };

  // ------------------------------------------------------------------ legs (Thigh-local, left leg)
  // rows: y, rx, rz, cx (+ = lateral), cz (+ = forward), n
  var LEG = [
    [-0.808, 0.030, 0.034, 0.000, 0.000, 2.0], [-0.790, 0.034, 0.037, 0.000, 0.000, 2.0], [-0.760, 0.031, 0.034, 0.000, -0.002, 2.0], [-0.720, 0.032, 0.036, 0.000, -0.003, 2.0],
    [-0.680, 0.036, 0.041, 0.000, -0.005, 2.0], [-0.640, 0.040, 0.047, 0.000, -0.007, 2.0], [-0.600, 0.045, 0.053, 0.000, -0.009, 2.0], [-0.560, 0.0545, 0.0565, 0.001, -0.010, 2.0],
    [-0.520, 0.0555, 0.0555, 0.001, -0.007, 2.05], [-0.485, 0.0535, 0.0520, 0.000, -0.001, 2.1], [-0.462, 0.0550, 0.0500, 0.000, 0.005, 2.15], [-0.440, 0.0590, 0.0510, 0.000, 0.010, 2.2],
    [-0.420, 0.0600, 0.0530, 0.000, 0.012, 2.2], [-0.400, 0.0580, 0.0550, -0.002, 0.010, 2.15], [-0.375, 0.0585, 0.0575, -0.003, 0.008, 2.1], [-0.340, 0.0605, 0.0605, -0.002, 0.007, 2.05],
    [-0.280, 0.0645, 0.0655, 0.000, 0.006, 2.0], [-0.200, 0.0695, 0.0715, 0.000, 0.005, 2.0], [-0.120, 0.0750, 0.0780, 0.000, 0.004, 2.0], [-0.040, 0.0800, 0.0840, -0.002, 0.002, 2.0],
    [0.030, 0.0820, 0.0880, -0.004, 0.000, 2.0]];
  var LEG_LEN = LEG[LEG.length - 1][0] - LEG[0][0];
  var LEG_KNEE_V = (-0.412 - LEG[0][0]) / LEG_LEN;
  B3.LEG = LEG;
  B3.legStations = function (off) {
    off = off || 0;
    return LEG.map(function (r) { var o = typeof off === 'function' ? off(r[0]) : off; return { y: r[0], rx: r[1] + o, rz: r[2] + o, cx: r[3], cz: r[4], n: r[5] }; });
  };
  // anatomy relief for the left leg (a: angle from the front toward +X, which is lateral for the left leg)
  function legDisp(x, y, z, u, i, a) {
    var am = -a, aa = Math.abs(a), d = 0;
    d += 0.0058 * g(a, 0, 0.46) * g(y, -0.410, 0.021);                        // kneecap
    d -= 0.0030 * g(aa, 0.82, 0.22) * g(y, -0.418, 0.024);                    // hollows beside it
    d += 0.0042 * g(am, 0.72, 0.40) * g(y, -0.370, 0.030);                    // vastus medialis above-inside
    d += 0.0016 * g(-am, 0.85, 0.40) * g(y, -0.360, 0.040);                   // vastus lateralis
    d += 0.0022 * g(aa, 1.55, 0.36) * g(y, -0.430, 0.022);                    // condyles
    d += 0.0016 * g(a, 0, 0.22) * g(y, -0.452, 0.012);                        // patellar tendon
    d += 0.0022 * g(a, 0, 0.30) * g(y, -0.481, 0.012);                        // tibial tuberosity
    d -= 0.0036 * g(aa, PI, 0.45) * g(y, -0.425, 0.024);                      // back of the knee
    d += 0.0024 * g(aa, 2.45, 0.22) * g(y, -0.405, 0.040);                    // hamstring tendons
    d += 0.0013 * g(am, 0.30, 0.16) * smooth(-0.50, -0.54, y) * smooth(-0.76, -0.70, y);   // shin bone crest
    d += 0.0038 * g(am, 2.25, 0.50) * g(y, -0.565, 0.055);                    // calf, inner head (larger, lower)
    d += 0.0024 * g(-am, 2.35, 0.45) * g(y, -0.535, 0.045);                   // calf, outer head
    d -= 0.0032 * g(aa, PI, 0.50) * g(y, -0.765, 0.030);                      // Achilles
    d += 0.0030 * g(aa, 1.60, 0.40) * g(y, -0.793, 0.012);                    // ankle bones
    d += 0.0008 * (C.noise(y * 40 + a * 3, a * 4, 3) - 0.5);                  // a little unevenness
    return d;
  }
  B3.legDisp = legDisp;
  B3.buildLegs = function (rig, mats) {
    var out = {};
    ['L', 'R'].forEach(function (S) {
      var geo = C.loft(B3.legStations(0), { seg: 48, vTile: LEG_LEN, uTiles: 1, disp: legDisp });
      if (S === 'R') mirrorX(geo);
      out[S] = K.skinned(rig, geo, 'Thigh_' + S, mats.leg, 'LegSkin_' + S, K.W.leg(rig, S));
    });
    return out;
  };

  // ------------------------------------------------------------------ neck (Neck-local; flares into the chest under the collar)
  // [y, rx, rz, cz] Neck-local. The upper front swells forward into the soft throat under his jaw (the head is carried forward).
  B3.NECK = [
    [-0.120, 0.110, 0.090, 0.010], [-0.080, 0.095, 0.082, 0.008], [-0.045, 0.078, 0.071, 0.004], [-0.015, 0.064, 0.063, 0.002], [0.020, 0.057, 0.060, 0.004],
    [0.050, 0.054, 0.066, 0.012], [0.075, 0.056, 0.0725, 0.0195], [0.100, 0.060, 0.082, 0.028], [0.125, 0.064, 0.088, 0.034], [0.150, 0.060, 0.076, 0.026], [0.168, 0.056, 0.062, 0.012]]
  B3.buildNeck = function (rig, mats) {
    var st = B3.NECK.map(function (r) { return { y: r[0], rx: r[1], rz: r[2], cz: r[3] }; });  // eslint-disable-line
    var geo = C.loft(st, {
      seg: 44, vTile: 0.22, capB: { h: 0.012, steps: 2 },
      disp: function (x, y, z, u, i, a) {
        var d = 0, aa = Math.abs(a);
        var ac = mix(0.45, 1.80, smooth(-0.04, 0.14, y));                                       // sternocleidomastoid: throat -> behind the ear
        d += 0.0042 * g(aa, ac, 0.36) * smooth(-0.05, 0.03, y) * smooth(0.16, 0.10, y);
        d += 0.0040 * g(y, 0.050, 0.014) * g(a, 0, 0.13);                                      // Adam's apple
        d -= 0.0030 * g(y, 0.005, 0.014) * g(a, 0, 0.12);                                      // notch above the breastbone
        d -= 0.0030 * g(aa, 1.05, 0.25) * g(y, -0.010, 0.020);                                 // hollows above the collarbones
        d += 0.0030 * g(y, 0.095, 0.020) * g(a, 0, 0.55) * 0.8;                                // loose skin under the chin
        d += 0.0012 * Math.sin(y * 160 + a * 2) * smooth(0.0, 0.07, y) * g(a, 0, 0.9);       // crepey folds
        d += 0.0030 * g(y, -0.060, 0.030) * g(aa, 0.0, 0.5) * 0.6;                             // breastbone head
        return d;
      }
    });
    return K.skinned(rig, geo, 'Neck', mats.neck, 'Neck_Skin', K.W.neck(rig));
  };

  // ------------------------------------------------------------------ wrists (Forearm-local; only the part a cuff may uncover)
  B3.buildWrists = function (rig, mats) {
    var out = {};
    ['L', 'R'].forEach(function (S) {
      var geo = C.loft([
        { y: -0.262, rx: 0.0205, rz: 0.0290 }, { y: -0.240, rx: 0.0215, rz: 0.0298 }, { y: -0.215, rx: 0.0232, rz: 0.0305 }, { y: -0.17, rx: 0.0262, rz: 0.0322 }, { y: -0.12, rx: 0.0290, rz: 0.0335 }],
        {
          seg: 28, vTile: 0.16,
          disp: function (x, y, z, u, i, a) {
            var d = 0;
            d += 0.0016 * g(a, 1.3, 0.35) * smooth(-0.26, -0.20, y);       // tendons on the back of the wrist
            d += 0.0018 * g(a, 1.75, 0.25) * g(y, -0.250, 0.010);          // wrist bone (ulna head)
            return d;
          }
        });
      if (S === 'R') mirrorX(geo);
      out[S] = K.skinned(rig, geo, 'Forearm_' + S, mats.hand, 'WristSkin_' + S, K.W.arm(rig, S));
    });
    return out;
  };

  // ------------------------------------------------------------------ hands (Hand-local, left hand; mirrored for the right)
  var FINGERS = [
    { z: 0.0290, L: 0.083, r: 0.0093, name: 'Index', sp: 0.03, th: [0.10, 0.36, 0.56] },
    { z: 0.0098, L: 0.093, r: 0.0095, name: 'Middle', sp: 0.0, th: [0.12, 0.40, 0.62] },
    { z: -0.0098, L: 0.086, r: 0.0090, name: 'Ring', sp: -0.02, th: [0.14, 0.44, 0.66] },
    { z: -0.0290, L: 0.069, r: 0.0081, name: 'Little', sp: -0.05, th: [0.18, 0.48, 0.70] }];
  B3.FINGERS = FINGERS;
  function hash2(ix, iy, s) { var h = Math.imul(ix | 0, 374761393) ^ Math.imul(iy | 0, 668265263) ^ Math.imul(s | 0, 1442695041); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  var SKIN_RGB = C.hex2rgb('#d29a80').map(function (v) { return v / 255; });
  function skinLin(k) { var c = new THREE.Color(); c.setRGB(SKIN_RGB[0] * k[0], SKIN_RGB[1] * k[1], SKIN_RGB[2] * k[2]); c.convertSRGBToLinear(); return [c.r, c.g, c.b]; }
  function palmGeo() {
    var st = [
      { y: -0.098, rx: 0.0118, rz: 0.0420 }, { y: -0.086, rx: 0.0126, rz: 0.0430 }, { y: -0.066, rx: 0.0144, rz: 0.0424 }, { y: -0.046, rx: 0.0164, rz: 0.0398, cz: 0.001 },
      { y: -0.026, rx: 0.0184, rz: 0.0352 }, { y: -0.008, rx: 0.0200, rz: 0.0316 }, { y: 0.010, rx: 0.0204, rz: 0.0300 }, { y: 0.028, rx: 0.0206, rz: 0.0294 }];
    return C.loft(st, {
      seg: 40, vTile: 0.126, capA: { h: 0.010, steps: 3 },
      disp: function (x, y, z, u, i, a, S) {
        var nx = (x - S.cx) / S.rx, dors = smooth(0.15, 0.95, nx), palm = smooth(-0.15, -0.95, nx), d = 0;
        FINGERS.forEach(function (f) {
          var zt = f.z * mix(1.0, 0.42, smooth(-0.098, 0.015, y));
          d += 0.0017 * dors * g(z, zt, 0.0040) * smooth(-0.092, -0.070, y) * smooth(0.020, -0.002, y);   // tendons
          d += 0.0034 * dors * g(z, f.z, 0.0070) * g(y, -0.092, 0.0075);                                    // knuckles
        });
        d += 0.0045 * palm * g(z, 0.026, 0.017) * g(y, -0.030, 0.020);
        d += 0.0030 * palm * g(z, -0.028, 0.012) * g(y, -0.040, 0.025);
        d -= 0.0022 * palm * g(z, 0.003, 0.016) * g(y, -0.046, 0.016);
        d += 0.0020 * dors * g(z, 0.03, 0.016) * g(y, -0.012, 0.014);
        return d;
      }
    });
  }
  function fingerTube(acc, f) {
    var th = f.th, ls = [0.46, 0.30, 0.24], pts = [], x = 0, y = 0, z = f.z, k;
    pts.push(new THREE.Vector3(0.001, 0.004, z));
    for (k = 0; k < 3; k++) { x += -Math.sin(th[k]) * f.L * ls[k]; y += -Math.cos(th[k]) * f.L * ls[k]; z += f.sp * f.L * ls[k]; pts.push(new THREE.Vector3(x, y - 0.002, z)); }
    var r0 = f.r;
    function rFn(t) { return r0 * (1.0 - 0.32 * t) * (1 + 0.12 * g(t, 0.47, 0.06) + 0.10 * g(t, 0.77, 0.055) + 0.06 * g(t, 0.0, 0.08)); }
    function cFn(t) {
      var kn = g(t, 0.47, 0.07) + g(t, 0.77, 0.06) + g(t, 0.04, 0.08), k2 = 1 + 0.02 * (hash2(Math.floor(t * 20), Math.round(f.z * 1000), 3) - 0.5);
      return skinLin([k2 * (1 + 0.03 * kn), k2 * (1 - 0.09 * kn), k2 * (1 - 0.10 * kn)]);
    }
    acc.tube(pts, 20, 10, rFn, cFn, 0.86);
    var tip = pts[3], dir = tip.clone().sub(pts[2]).normalize(), dors = new THREE.Vector3(Math.cos(th[2]), -Math.sin(th[2]), 0).normalize();
    return { tip: tip, dir: dir, dors: dors, rad: rFn(0.92) };
  }
  B3.buildHands = function (rig, mats) {
    var out = {}, HS = D.HAND_SCALE;
    ['L', 'R'].forEach(function (S) {
      var s = S === 'L' ? 1 : -1;
      var palm = palmGeo();
      var ta = new C.Acc();
      var tp = [new THREE.Vector3(-0.002, -0.018, 0.027), new THREE.Vector3(0.000, -0.037, 0.044), new THREE.Vector3(-0.004, -0.056, 0.054), new THREE.Vector3(-0.012, -0.071, 0.056), new THREE.Vector3(-0.021, -0.082, 0.052)];
      ta.tube(tp, 18, 10, function (t) { return 0.0128 * (1 - 0.30 * t) * (1 + 0.08 * g(t, 0.55, 0.12)); }, function () { return skinLin([1, 1, 1]); }, 0.90);
      var thumb = ta.geometry();
      var fa = new C.Acc(), tips = FINGERS.map(function (f) { return fingerTube(fa, f); });
      var fg = fa.geometry();
      // fingers are drawn from the knuckle line: move them there (Hand-local, unscaled)
      fg.translate(0, -D.PALM, 0);
      [palm, thumb, fg].forEach(function (q) { q.scale(HS, HS, HS); if (s < 0) mirrorX(q); });
      // nails stay rigid on the Fingers bone
      var nails = new THREE.Group(); nails.name = 'Nails_' + S;
      tips.forEach(function (t, i) {
        var ng = new THREE.SphereGeometry(1, 10, 7); ng.scale(0.0058, 0.0072, 0.0020);
        var nm = new THREE.Mesh(ng, mats.nail); nm.name = 'Nail_' + FINGERS[i].name + '_' + S;
        var p = t.tip.clone().addScaledVector(t.dir, -0.0068).addScaledVector(t.dors, t.rad * 0.80);
        var m4 = new THREE.Matrix4(), yv = t.dir.clone().multiplyScalar(-1), zv = t.dors.clone(), xv = new THREE.Vector3().crossVectors(yv, zv).normalize();
        zv.crossVectors(xv, yv).normalize(); m4.makeBasis(xv, yv, zv); nm.quaternion.setFromRotationMatrix(m4); nm.position.copy(p);
        if (s < 0) { nm.position.x *= -1; nm.quaternion.set(nm.quaternion.x, -nm.quaternion.y, -nm.quaternion.z, nm.quaternion.w); }
        nm.position.multiplyScalar(HS); nm.scale.setScalar(HS);
        nails.add(nm);
      });
      rig.J['Fingers_' + S].add(nails);
      var w = K.W.hand(rig, S);
      out[S] = {
        palm: K.skinned(rig, palm, 'Hand_' + S, mats.hand, 'Palm_' + S, w),
        thumb: K.skinned(rig, thumb, 'Hand_' + S, mats.fingers, 'Thumb_' + S, function () { return K.one('Hand_' + S); }),
        fingers: K.skinned(rig, fg, 'Hand_' + S, mats.fingers, 'Fingers_' + S, w), nails: nails
      };
    });
    return out;
  };

  // ------------------------------------------------------------------ socks (Thigh-local, over the leg; black rib crew socks)
  B3.buildSocks = function (rig, o) {
    o = o || {};
    var fab = Fab.sockRib({ color: o.color || '#1f1f23', seed: 52, nr: 44, tile: 0.07 });
    var mat = new THREE.MeshStandardMaterial({ map: fab.map, normalMap: fab.normal, roughness: 0.95, metalness: 0, name: 'Socks' });
    var top = o.top === undefined ? -0.672 : o.top, out = { mat: mat };
    ['L', 'R'].forEach(function (S) {
      var st = B3.legStations(function (y) { return 0.0022 + 0.0016 * smooth(top - 0.035, top - 0.004, y); }).filter(function (q) { return q.y < top - 0.001; });
      var tq = B3.legStations(0.0); var t0 = C.surface(tq);
      // finish with a turned top edge at `top`
      var ring = Object.assign({}, st[st.length - 1]); ring.y = top; st.push(ring);
      var r2 = Object.assign({}, ring); r2.y = top - 0.003; r2.rx -= 0.0028; r2.rz -= 0.0028; st.push(r2);
      var geo = C.loft(st, {
        seg: 48, vTile: fab.tile, uTiles: Math.round(2 * PI * 0.04 / fab.tile * 4) / 4 * 4,
        disp: function (x, y, z, u, i, a) { var d = legDisp(x, y, z, u, i, a) * 0.55; d += 0.0012 * (C.noise(a * 5, y * 60, 9) - 0.5) * smooth(top - 0.10, top - 0.02, y); return d; }
      });
      if (S === 'R') mirrorX(geo);
      out[S] = K.skinned(rig, geo, 'Thigh_' + S, mat, 'Sock_' + S, K.W.leg(rig, S));
    });
    return out;
  };

  // ------------------------------------------------------------------ trainers (Foot-local: origin at the ankle, ground at y = -ANK). Generic chunky runner.
  function shoeTextures() {
    // upper: u around (0.5 = toe), v = height. Tan suede-mesh with silver bands and thin orange lines.
    var W = 1024, H = 256, cv = C.canvas(W, H), ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), dd = img.data;
    var hv = C.canvas(W, H), hctx = hv.getContext('2d'), himg = hctx.createImageData(W, H), hd = himg.data;
    var tan = [196, 130, 72], tanD = [160, 102, 56], silver = [170, 170, 168], silverD = [130, 132, 134], orange = [236, 98, 30], cream = [214, 208, 198];
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var u = x / W, v = 1 - y / H, k = (y * W + x) * 4;
      var side = Math.cos(2 * PI * (u - 0.5));               // +1 toe, -1 heel
      var wav = 0.025 * Math.sin(2 * PI * u * 3 + 0.6) + 0.012 * Math.sin(2 * PI * u * 7);
      var vv = v + wav + 0.10 * smooth(0.2, 0.95, side) * (v - 0.2);       // bands sweep up over the toe
      var r = tan[0], gg = tan[1], b = tan[2], h = 0.5;
      var bands = [[0.22, 0.040], [0.42, 0.034], [0.60, 0.028]], bi;
      for (bi = 0; bi < bands.length; bi++) {
        var c0 = bands[bi][0], hw = bands[bi][1], dv = Math.abs(vv - c0);
        var inb = smooth(hw, hw - 0.010, dv), edge = smooth(0.006, 0.0, Math.abs(dv - hw));
        r += (silver[0] - r) * inb; gg += (silver[1] - gg) * inb; b += (silver[2] - b) * inb;
        var ol = smooth(0.0045, 0.0015, Math.abs(dv - hw - 0.006));
        r += (orange[0] - r) * ol; gg += (orange[1] - gg) * ol; b += (orange[2] - b) * ol;
        h += inb * 0.12 - edge * 0.25 + ol * 0.1;
      }
      var fine = C.noiseP(x / W * 512, y / H * 128, 512, 128, 61), mid = C.fbmP(u * 12, v * 3, 12, 3, 62, 3);
      var sh = 0.90 + 0.10 * fine + (mid - 0.5) * 0.10;
      // mesh dots on the tan parts
      var dots = (Math.sin(x * 0.9) * Math.sin(y * 0.9 * 4) > 0.6 ? 1 : 0) * 0.06;
      // grime toward the bottom edge
      var grime = smooth(0.12, 0.0, v) * 0.25;
      r = r * (sh - dots - grime); gg = gg * (sh - dots - grime); b = b * (sh - dots - grime);
      dd[k] = clamp(r, 0, 255); dd[k + 1] = clamp(gg, 0, 255); dd[k + 2] = clamp(b, 0, 255); dd[k + 3] = 255;
      var hh = clamp((h + 0.15 * fine - dots) * 255, 0, 255); hd[k] = hd[k + 1] = hd[k + 2] = hh; hd[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0); hctx.putImageData(himg, 0, 0);
    var upper = { map: C.tex(cv, { repeat: false }), normal: C.tex(C.normalFromHeight(hv, 2.0), { linear: true, png: true }) };
    // midsole: v = height; cream foam, orange-red stripe near the top, dark rubber at the bottom
    var MW = 512, MH = 128, mv = C.canvas(MW, MH), mctx = mv.getContext('2d'), mimg = mctx.createImageData(MW, MH), md = mimg.data;
    for (y = 0; y < MH; y++) for (x = 0; x < MW; x++) {
      v = 1 - y / MH; u = x / MW; k = (y * MW + x) * 4;
      var col = cream.slice();
      var st = smooth(0.66, 0.69, v) * smooth(0.88, 0.85, v); col = [mix(col[0], 214, st), mix(col[1], 70, st), mix(col[2], 40, st)];
      var st2 = smooth(0.60, 0.62, v) * smooth(0.66, 0.64, v); col = [mix(col[0], 72, st2), mix(col[1], 76, st2), mix(col[2], 84, st2)];
      var rub = smooth(0.24, 0.20, v); col = [mix(col[0], 40, rub), mix(col[1], 36, rub), mix(col[2], 38, rub)];
      var dirt = (C.fbmP(u * 10, v * 3, 10, 3, 71, 3) - 0.4) * 0.25 * (1 - rub);
      md[k] = clamp(col[0] * (1 - dirt), 0, 255); md[k + 1] = clamp(col[1] * (1 - dirt * 1.1), 0, 255); md[k + 2] = clamp(col[2] * (1 - dirt * 1.3), 0, 255); md[k + 3] = 255;
    }
    mctx.putImageData(mimg, 0, 0);
    return { upper: upper, sole: { map: C.tex(mv, { repeat: false }) } };
  }
  B3.buildShoes = function (rig) {
    var T = shoeTextures();
    var mats = {
      upper: new THREE.MeshStandardMaterial({ map: T.upper.map, normalMap: T.upper.normal, roughness: 0.62, metalness: 0.05, name: 'Shoe_Upper' }),
      sole: new THREE.MeshStandardMaterial({ map: T.sole.map, roughness: 0.75, metalness: 0, name: 'Shoe_Sole' }),
      lace: new THREE.MeshStandardMaterial({ color: C.col('#d4d3ce'), roughness: 0.85, metalness: 0, name: 'Shoe_Laces' }),
      lining: new THREE.MeshStandardMaterial({ color: C.col('#3b3532'), roughness: 0.9, metalness: 0, side: THREE.DoubleSide, name: 'Shoe_Lining' }),
      tex: T
    };
    var A = D.ANK, y0 = -A, HEEL = -0.072, TOE = 0.218, LEN = TOE - HEEL, CZ = (TOE + HEEL) / 2, out = { mats: mats };
    function spring(z) { return 0.011 * Math.pow(smooth(0.09, TOE + 0.005, z), 1.6); }
    // planform relief (built as the left shoe: the inner side is -X): narrower heel, arch waist
    function plan(a, k) { var c = Math.cos(a); return -0.006 * k * smooth(-0.2, -0.95, c) * smooth(0.0, 0.5, Math.abs(Math.sin(a))) - 0.008 * k * g(a, -1.30, 0.35) - 0.003 * k * g(a, 1.35, 0.4); }
    // ---- sole (left), shared
    var ms = [
      { y: y0, rx: 0.0480, rz: LEN / 2 - 0.004, cz: CZ, n: 2.4 }, { y: y0 + 0.004, rx: 0.0510, rz: LEN / 2, cz: CZ, n: 2.45 }, { y: y0 + 0.012, rx: 0.0528, rz: LEN / 2 + 0.002, cz: CZ, n: 2.5 },
      { y: y0 + 0.024, rx: 0.0530, rz: LEN / 2 + 0.003, cz: CZ, n: 2.5 }, { y: y0 + 0.034, rx: 0.0520, rz: LEN / 2 + 0.001, cz: CZ, n: 2.45 }];
    function soleGeo() {
      var mg = C.loft(ms, {
        seg: 80, capA: { h: 0.002, steps: 2 }, capB: { h: 0.002, steps: 2 }, uTiles: 1, vTile: 0.038,
        disp: function (x, y, z, u, i, a) { return plan(a, 1); },
        dy: function (x, y, z, u, i, a) { return i >= 4 ? -0.011 * smooth(0.02, 0.17, z) : (i === 3 ? -0.006 * smooth(0.02, 0.17, z) : 0); }
      });
      var p = mg.attributes.position; for (var j = 0; j < p.count; j++) p.setY(j, p.getY(j) + spring(p.getZ(j)));
      mg.computeVertexNormals(); return mg;
    }
    // ---- upper (left): horizontal sections; the toe box stays full, then the vamp rises to the throat
    var ys = [0.020, 0.032, 0.045, 0.058, 0.071, 0.084, 0.096, 0.107, 0.117, 0.126], us = [], q;
    for (q = 0; q < ys.length; q++) {
      var t = q / (ys.length - 1), front = mix(TOE - 0.001, 0.050, Math.pow(t, 1.7)), back = mix(HEEL - 0.0015, HEEL + 0.010, t);
      us.push({ y: y0 + ys[q], rx: mix(0.0515, 0.0415, Math.pow(t, 1.3)), rz: (front - back) / 2, cz: (front + back) / 2, n: mix(2.5, 2.05, t) });
    }
    function upperDy(i, a, z) {
      var t = i / (ys.length - 1), c = Math.cos(a);
      return t * t * (0.003 * (-c) - 0.009 * g(Math.abs(a), 1.45, 0.45) - 0.016 * smooth(0.25, 0.9, c)) + spring(z);
    }
    function upperGeo() {
      return C.loft(us, {
        seg: 88, uTiles: 1, vTile: ys[ys.length - 1] - ys[0] + 0.02,
        disp: function (x, y, z, u, i, a) {
          var d = plan(a, 1 - i / 11), c = Math.cos(a);
          d += 0.0026 * g(i, ys.length - 1, 1.2) * smooth(-0.3, -0.9, c);         // padded heel collar
          d += 0.0010 * Math.sin(a * 22) * g(i, 1, 0.8) * 0.5;                    // mudguard ripple
          d -= 0.0030 * g(i, 4.5, 1.2) * g(a, 0, 0.5);                            // toe crease
          return d;
        },
        dy: function (x, y, z, u, i, a) { return upperDy(i, a, z); }
      });
    }
    // height field of the upper for laces: highest upper point near (x, z)
    var rc = new THREE.Raycaster(), tmpM = null;
    function topAt(geo, x, z) {
      if (!tmpM || tmpM.geometry !== geo) { tmpM = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); tmpM.updateMatrixWorld(true); }
      rc.set(new THREE.Vector3(x, 0.5, z), new THREE.Vector3(0, -1, 0));
      var hit = rc.intersectObject(tmpM, false); return hit.length ? hit[0].point.y : y0 + 0.08;
    }
    var sole = soleGeo(), upper = upperGeo();
    // laces: rungs across the throat, crossing, plus a bow with loose ends
    var lg = [], rungs = [0.060, 0.073, 0.086, 0.098, 0.108];
    rungs.forEach(function (z0, ri) {
      var hw = mix(0.020, 0.024, ri / 4), zz = 0.165 - z0 * 1.05;
      var pa = new THREE.Vector3(-hw, topAt(upper, -hw, zz) + 0.0025, zz), pb = new THREE.Vector3(hw, topAt(upper, hw, zz - 0.010) + 0.0025, zz - 0.010), pm = new THREE.Vector3(0, Math.max(pa.y, pb.y) + 0.002, zz - 0.005);
      var acc = new C.Acc(); acc.tube([pa, pm, pb], 8, 6, function () { return 0.0023; }, function () { return [1, 1, 1]; }); lg.push(acc.geometry());
    });
    var tz = 0.165 - 0.115 * 1.05, ty = topAt(upper, 0, tz) + 0.004, bow = new C.Acc();
    bow.tube([new THREE.Vector3(0.003, ty, tz), new THREE.Vector3(0.026, ty - 0.006, tz + 0.016), new THREE.Vector3(0.044, ty - 0.034, tz + 0.010), new THREE.Vector3(0.050, ty - 0.062, tz + 0.002)], 14, 6, function () { return 0.0022; }, function () { return [1, 1, 1]; });
    bow.tube([new THREE.Vector3(-0.003, ty, tz), new THREE.Vector3(-0.022, ty - 0.004, tz + 0.020), new THREE.Vector3(-0.034, ty - 0.030, tz + 0.024), new THREE.Vector3(-0.038, ty - 0.054, tz + 0.020)], 14, 6, function () { return 0.0022; }, function () { return [1, 1, 1]; });
    bow.tube([new THREE.Vector3(0.001, ty, tz), new THREE.Vector3(0.016, ty + 0.012, tz + 0.012), new THREE.Vector3(0.024, ty + 0.004, tz + 0.020), new THREE.Vector3(0.010, ty, tz + 0.018)], 12, 6, function () { return 0.0022; }, function () { return [1, 1, 1]; });
    bow.tube([new THREE.Vector3(-0.001, ty, tz), new THREE.Vector3(-0.016, ty + 0.012, tz + 0.010), new THREE.Vector3(-0.022, ty + 0.004, tz + 0.018), new THREE.Vector3(-0.009, ty, tz + 0.016)], 12, 6, function () { return 0.0022; }, function () { return [1, 1, 1]; });
    lg.push(bow.geometry());
    var laces = THREE.BufferGeometryUtils.mergeBufferGeometries(lg); laces.deleteAttribute('color');
    // tongue: padded flap from under the laces up out of the throat
    var tongue = C.loft([{ y: -0.010, rx: 0.025, rz: 0.008, cz: 0.0 }, { y: 0.020, rx: 0.026, rz: 0.009, cz: 0.0 }, { y: 0.042, rx: 0.025, rz: 0.009, cz: 0.0 }, { y: 0.052, rx: 0.021, rz: 0.008, cz: 0.0 }], { seg: 24, capB: { h: 0.004, steps: 2 } });
    tongue.rotateX(-0.55); tongue.translate(0, topAt(upper, 0, 0.060) - 0.016, 0.060);
    var lining = C.loft([{ y: y0 + 0.030, rx: 0.044, rz: 0.12, cz: 0.07 }, { y: y0 + 0.118, rx: 0.039, rz: 0.058, cz: 0.000 }], { seg: 40 });
    var tab = C.loft([{ y: 0, rx: 0.012, rz: 0.004 }, { y: 0.020, rx: 0.011, rz: 0.004 }], { seg: 12, capB: { h: 0.004, steps: 2 } });
    tab.rotateX(0.22); tab.translate(0, y0 + 0.124, HEEL + 0.006);
    var parts = [['ShoeSole', sole, mats.sole], ['ShoeUpper', upper, mats.upper], ['ShoeLaces', laces, mats.lace], ['ShoeTongue', tongue, mats.upper], ['ShoeLining', lining, mats.lining], ['ShoeHeelTab', tab, mats.upper]];
    ['L', 'R'].forEach(function (S) {
      var grp = new THREE.Group(); grp.name = 'Shoe_' + S;
      parts.forEach(function (pp) { var gg = S === 'R' ? mirrorX(pp[1].clone()) : pp[1]; grp.add(mesh(gg, pp[2], pp[0] + '_' + S)); });
      rig.J['Foot_' + S].add(grp); out[S] = grp;
    });
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);

;