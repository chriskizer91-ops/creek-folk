/* PKToon2: second go at the pixel Philosopher King, modelled on the 8-view caricature turnaround.
   Two builds share the same parts:
     'A' (Sheet king)  - the sheet's own proportions: tall bald head with wild white hair, big ears, deep-set eyes under heavy
                         white brows, a modest hooked nose, sad mouth; tweed jacket with suede elbow patches, dark green waistcoat
                         with gold buttons, lavender collar, khaki cargo shorts, thin legs with knobby knees, black socks and
                         chunky grey/orange hiking shoes; paper crown with blue, green and red stars.
     'B' (Little king) - the same old man as a compact game sprite: bigger head, stubby limbs, giant shoes.
   Colours are sampled from the sheet. Rendered through PKPixel3D with the palette ramp shading of PKToon. */
(function (global) {
  'use strict';
  var THREE = global.THREE;
  var T2 = {};
  global.PKToon2 = T2;

  var P = T2.P = {
    ink: '#3a2f2a',
    skin_l: '#fcc8a7', skin: '#f2aa86', skin_s: '#d48a6c', skin_d: '#a8604c', cheek: '#e8866a',
    hair_l: '#f4f1eb', hair: '#dcd6cd', hair_s: '#aaa49b',
    tw_l: '#a8836a', tw: '#8d6646', tw_s: '#6a4c34', tw_d: '#4a3424',
    sue_l: '#c87038', sue: '#a55727', sue_s: '#7e3f1c',
    vest_l: '#566656', vest: '#3e4b41', vest_s: '#2a352e',
    btn_l: '#f0c070', btn: '#d2974f', btn_s: '#9c6a30',
    sh_l: '#eee9f1', sh: '#d3cadb', sh_s: '#a99fb5',
    kh_l: '#ead5b2', kh: '#d4b892', kh_s: '#ab9070', kh_d: '#806b51',
    sock: '#3c3e40', sock_s: '#25272a',
    shoe_l: '#cfcac0', shoe: '#a6a198', shoe_s: '#76716a',
    or_l: '#ff9a45', or: '#ea7a2a', or_s: '#b2561c', sole: '#4c4440',
    cr_l: '#fde4a2', cr: '#efc067', cr_s: '#c08f3e', cr_d: '#8f6a2c',
    st_g: '#3f9a5c', st_b: '#3d63b8', st_r: '#d2402f',
    eye: '#231d1a', white: '#fbf8f2'
  };
  T2.extraPalette = Object.keys(P).map(function (k) { return P[k]; });
  var TONES = {
    skin: ['skin_s', 'skin', 'skin_l'], skin_l: ['skin', 'skin_l', 'skin_l'], skin_s: ['skin_d', 'skin_s', 'skin'], cheek: ['skin_s', 'cheek', 'cheek'], skin_d: ['skin_d', 'skin_d', 'skin_s'],
    hair: ['hair_s', 'hair', 'hair_l'], hair_l: ['hair', 'hair_l', 'hair_l'], hair_s: ['hair_s', 'hair_s', 'hair'],
    tw: ['tw_s', 'tw', 'tw_l'], tw_s: ['tw_d', 'tw_s', 'tw'], tw_l: ['tw', 'tw_l', 'tw_l'],
    sue: ['sue_s', 'sue', 'sue_l'], vest: ['vest_s', 'vest', 'vest_l'], btn: ['btn_s', 'btn', 'btn_l'], sh: ['sh_s', 'sh', 'sh_l'],
    kh: ['kh_s', 'kh', 'kh_l'], kh_s: ['kh_d', 'kh_s', 'kh'], sock: ['sock_s', 'sock', 'sock'],
    shoe: ['shoe_s', 'shoe', 'shoe_l'], shoe_s: ['sole', 'shoe_s', 'shoe'], or: ['or_s', 'or', 'or_l'], sole: ['sole', 'sole', 'shoe_s'],
    cr: ['cr_s', 'cr', 'cr_l'], cr_s: ['cr_d', 'cr_s', 'cr'], st_g: ['st_g', 'st_g', 'st_g'], st_b: ['st_b', 'st_b', 'st_b'], st_r: ['st_r', 'st_r', 'st_r'],
    eye: ['eye', 'eye', 'eye'], ink: ['ink', 'ink', 'ink'], white: ['white', 'white', 'white']
  };
  var mats = {};
  function M(key) {
    if (!mats[key]) { var t = TONES[key] || [key, key, key]; mats[key] = global.PKToon.rampMat(P[t[0]], P[t[1]], P[t[2]]); mats[key].name = 'Toon2_' + key; }
    return mats[key];
  }
  // detail: 1 = the original build; 2 to 4 keep the same shapes, smoother, with extra small parts from the sheet;
  // 5 and 6 are smoother again, with rounder hair clumps and fine curling strands
  var DET = 1, SF = 1;
  function mesh(geo, key, name) { var m = new THREE.Mesh(geo, M(key)); m.name = name || key; m.castShadow = true; m.receiveShadow = true; return m; }
  function ell(rx, ry, rz, seg) { var s0 = Math.round((seg || 16) * SF); var g = new THREE.SphereGeometry(1, s0, Math.max(8, Math.round(s0 * 0.6))); g.scale(rx, ry, rz); return g; }
  function cyl(rt, rb, h, seg, zk) { var g = new THREE.CylinderGeometry(rt, rb, h, Math.round((seg || 14) * SF), DET > 1 ? DET : 1); if (zk) g.scale(1, 1, zk); return g; }
  function box(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
  // a box with rounded edges (used for cloth and shoe parts from detail 2 up; a plain box at detail 1)
  function rbox(w, h, d, rf) {
    if (DET < 2) return box(w, h, d);
    var n = [2, 3, 4, 4, 5, 6][DET - 1], g = new THREE.BoxGeometry(1, 1, 1, n, n, n), P = g.attributes.position, r = Math.min(w, h, d) * (rf || 0.35);
    var ix = w / 2 - r, iy = h / 2 - r, iz = d / 2 - r;
    for (var i = 0; i < P.count; i++) {
      var x = P.getX(i) * w, y = P.getY(i) * h, z = P.getZ(i) * d, cx = Math.max(-ix, Math.min(ix, x)), cy = Math.max(-iy, Math.min(iy, y)), cz = Math.max(-iz, Math.min(iz, z));
      var dx = x - cx, dy = y - cy, dz = z - cz, l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1; P.setXYZ(i, cx + dx / l * r, cy + dy / l * r, cz + dz / l * r);
    }
    g.computeVertexNormals(); return g;
  }
  function at(o, x, y, z) { o.position.set(x, y, z); return o; }
  function rot(o, x, y, z) { o.rotation.set(x || 0, y || 0, z || 0); return o; }
  function star(r, d) {
    var s = new THREE.Shape();
    for (var i = 0; i < 10; i++) { var a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; if (i) s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    var g = DET < 2 ? new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }) : new THREE.ExtrudeGeometry(s, { depth: d * 0.6, bevelEnabled: true, bevelThickness: d * 0.25, bevelSize: r * 0.08, bevelSegments: DET - 1 });
    g.translate(0, 0, -d / 2); return g;
  }
  function rnd(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

  // ------------------------------------------------------------------ the two builds
  var V = {
    A: {
      label: 'Sheet king',
      DIMS: { HIPS_Y: 0.695, THIGH_X: 0.105, THIGH_Y: 0.0, L1: 0.279, L2: 0.279, ANK: 0.137,
        NECK_Y: 0.575, NECK_Z: 0.0, HEAD_DY: 0.050, HEAD_DZ: 0.02, EYE_DY: 0.15, EYE_DZ: 0.10,
        SH_X: 0.178, SH_Y: 0.535, UA: 0.262, FA: 0.235, PALM: 0.085, HAND_SCALE: 1.0,
        behind: { L: [0.050, 0.130, -0.175], R: [-0.052, 0.150, -0.180] } },
      REST: { spine: 0.08, neck: 0.34, head: -0.38, thighZ: 0.05, shinZ: -0.05 },
      u: 0.37,             // head height, chin to the top of the skull (a caricature: about a fifth of his height)
      jacket: { top: [0.150, 0.110], hem: [0.180, 0.135], y0: 0.035 },
      arm: 0.040, leg: 0.036, shoe: 1.0, hand: 1.1, hair: 1.0, target: 0.92, zoom: 1.2
    },
    B: {
      label: 'Little king',
      DIMS: { HIPS_Y: 0.420, THIGH_X: 0.092, THIGH_Y: 0.0, L1: 0.160, L2: 0.140, ANK: 0.120,
        NECK_Y: 0.380, NECK_Z: 0.0, HEAD_DY: 0.025, HEAD_DZ: 0.02, EYE_DY: 0.18, EYE_DZ: 0.12,
        SH_X: 0.165, SH_Y: 0.350, UA: 0.165, FA: 0.150, PALM: 0.070, HAND_SCALE: 1.0,
        behind: { L: [0.050, 0.090, -0.180], R: [-0.052, 0.105, -0.185] } },
      REST: { spine: 0.06, neck: 0.18, head: -0.22, thighZ: 0.06, shinZ: -0.06 },
      u: 0.44,
      jacket: { top: [0.150, 0.118], hem: [0.182, 0.140], y0: 0.030 },
      arm: 0.046, leg: 0.042, shoe: 1.18, hand: 1.25, hair: 1.12, target: 0.66, zoom: 1.55
    }
  };
  T2.variant = function (id) { return V[id]; };
  T2.VARIANTS = Object.keys(V);

  // ------------------------------------------------------------------ head (Head bone sits under the jaw at chin height)
  function head(J, v, out) {
    var u = v.u, H = new THREE.Group(); H.name = 'Toon2Head'; J.Head.add(H);
    function E(rx, ry, rz, key, x, y, z, name, seg) { var m = mesh(ell(rx * u, ry * u, rz * u, seg), key, name); at(m, x * u, y * u, z * u); H.add(m); return m; }
    // skull: tall and a little narrow, bald on top
    E(0.37, 0.40, 0.43, 'skin', 0, 0.60, -0.02, 'Skull', 22);
    E(0.29, 0.13, 0.33, 'skin_l', 0, 0.86, 0.0, 'Pate', 18);
    E(0.34, 0.12, 0.30, 'skin_l', 0, 0.68, 0.16, 'Forehead', 16);
    // long face, jowls and chin
    E(0.29, 0.33, 0.30, 'skin', 0, 0.31, 0.14, 'Face', 18);
    // jowls are the same skin as the face (in the darker tone they read as two dark circles)
    E(0.12, 0.12, 0.12, 'skin', 0.19, 0.18, 0.16, 'Jowl'); E(0.12, 0.12, 0.12, 'skin', -0.19, 0.18, 0.16, 'Jowl');
    E(0.12, 0.08, 0.10, 'skin', 0, 0.06, 0.30, 'Chin');
    // features sit on the actual surface of the head shapes (else they vanish inside it)
    var SURF = [[0, 0.60, -0.02, 0.37, 0.40, 0.43], [0, 0.68, 0.16, 0.34, 0.12, 0.30], [0, 0.31, 0.14, 0.29, 0.33, 0.30], [0, 0.565, 0.32, 0.30, 0.07, 0.10]];
    function sz(x, y) { var best = -1; SURF.forEach(function (e) { var q = 1 - Math.pow((x - e[0]) / e[3], 2) - Math.pow((y - e[1]) / e[4], 2); if (q > 0) best = Math.max(best, e[2] + e[5] * Math.sqrt(q)); }); return best; }
    // brow ridge, deep-set eyes, bushy white brows drooping at the ends
    E(0.30, 0.07, 0.10, 'skin', 0, 0.565, 0.32, 'BrowRidge');
    [-1, 1].forEach(function (s) {
      var ex = s * 0.125, ey = 0.50, ez = sz(ex, ey);
      E(0.095, 0.065, 0.03, 'skin_d', ex, ey, ez - 0.012, 'EyeSocket');
      var eye = mesh(box(0.07 * u, 0.065 * u, 0.03 * u), 'eye', 'Eye'); at(eye, ex * u, ey * u, (ez + 0.004) * u); H.add(eye);
      var glint = mesh(box(0.025 * u, 0.025 * u, 0.012 * u), 'white', 'EyeGlint'); at(glint, (ex + s * 0.012) * u, (ey + 0.015) * u, (ez + 0.022) * u); H.add(glint);
      var bx = s * 0.13, by = 0.595;
      var tx = s * 0.235, ty = 0.555;
      if (DET < 2) {
        var brow = mesh(box(0.22 * u, 0.075 * u, 0.09 * u), 'hair_l', 'Brow'); at(brow, bx * u, by * u, (sz(bx, by) + 0.015) * u); rot(brow, 0.15, 0, s * -0.30); H.add(brow);
        var bt = mesh(box(0.08 * u, 0.045 * u, 0.07 * u), 'hair', 'BrowTuft'); at(bt, tx * u, ty * u, (sz(tx, ty) + 0.01) * u); rot(bt, 0, 0, s * -0.7); H.add(bt);
      } else {
        // bushy brows: the same drooping bar, built from overlapping tufts
        var nb = [0, 6, 9, 12, 14, 16][DET - 1];
        for (var q = 0; q < nb; q++) {
          var f = q / (nb - 1), qx = s * (0.04 + 0.2 * f), qy = 0.62 - 0.07 * f * f - 0.01, qr = 0.05 - 0.012 * Math.abs(f - 0.4);
          var bq = mesh(new THREE.IcosahedronGeometry(qr * u, 1), q % 3 === 2 ? 'hair' : 'hair_l', 'BrowTuft'); at(bq, qx * u, qy * u, (sz(qx, qy) + 0.018) * u); bq.scale.set(1.25, 0.75, 0.9); bq.rotation.set(0.3 * q, 0.5 * q, s * -0.3); H.add(bq);
        }
        var bt2 = mesh(new THREE.ConeGeometry(0.03 * u, 0.09 * u, 5), 'hair', 'BrowTuft'); at(bt2, tx * u, (ty - 0.01) * u, (sz(tx, ty) + 0.01) * u); rot(bt2, 0, 0, s * -2.2); H.add(bt2);
        // bags under the deep-set eyes
        var bg = mesh(ell(0.075 * u, 0.03 * u, 0.025 * u, 12), 'skin_s', 'EyeBag'); at(bg, ex * u, (ey - 0.06) * u, (sz(ex, ey - 0.06) - 0.004) * u); H.add(bg);
      }
      // (no rosy cheek patches: the cheeks are the same skin as the rest of the face)
      // big ears that stick out
      var ear = mesh(ell(0.055 * u, 0.17 * u, 0.11 * u), 'skin', 'Ear'); at(ear, s * 0.385 * u, 0.47 * u, -0.03 * u); rot(ear, 0, s * 0.35, s * 0.18); H.add(ear);
      var inner = mesh(ell(0.03 * u, 0.11 * u, 0.06 * u), 'skin_s', 'EarInner'); at(inner, s * 0.41 * u, 0.47 * u, 0.0); rot(inner, 0, s * 0.35, s * 0.18); H.add(inner);
      // sad mouth corners
      var mx = s * 0.085, my = 0.205;
      var mc = mesh(box(0.05 * u, 0.022 * u, 0.02 * u), 'skin_d', 'MouthCorner'); at(mc, mx * u, my * u, sz(mx, my) * u); rot(mc, 0, s * 0.3, s * 0.55); H.add(mc);
    });
    // a long, narrow, slightly hooked nose: it shows in profile but is not a blob from the front (the first try's was far too big)
    var nz = sz(0, 0.47);
    var bridge = mesh(ell(0.040 * u, 0.15 * u, 0.06 * u), 'skin', 'Nose'); at(bridge, 0.0, 0.42 * u, (nz + 0.045) * u); rot(bridge, 0.62, 0, 0); H.add(bridge);
    E(0.045, 0.045, 0.05, 'cheek', 0.0, 0.33, nz + 0.10, 'NoseTip');
    var mz = sz(0, 0.215);
    var mouth = mesh(box(0.12 * u, 0.024 * u, 0.02 * u), 'skin_d', 'Mouth'); at(mouth, 0, 0.215 * u, mz * u); H.add(mouth);
    if (DET >= 2) {
      // nostrils, a nose-to-mouth fold on each side, and the soft wing of each nostril
      [-1, 1].forEach(function (s) {
        var ns = mesh(ell(0.016 * u, 0.012 * u, 0.012 * u, 8), 'skin_d', 'Nostril'); at(ns, s * 0.024 * u, 0.305 * u, (nz + 0.085) * u); H.add(ns);
        var fold = mesh(box(0.016 * u, 0.13 * u, 0.012 * u), 'skin_s', 'Fold'); at(fold, s * 0.12 * u, 0.27 * u, (sz(s * 0.12, 0.27) - 0.002) * u); rot(fold, 0, 0, s * 0.35); H.add(fold);
      });
    }
    if (DET >= 3) {
      // forehead lines and a few age spots on the dome
      for (var fl = 0; fl < 3; fl++) { var fy = 0.66 + fl * 0.045, fw = 0.24 - fl * 0.03; var ln = mesh(box(fw * u, 0.011 * u, 0.012 * u), 'skin_s', 'BrowLine'); at(ln, 0, fy * u, (sz(0, fy) - 0.002) * u); rot(ln, -0.25, 0, 0); H.add(ln); }
      [[0.12, 0.82, 0.18], [-0.08, 0.9, 0.12], [0.03, 0.95, 0.02], [-0.17, 0.78, 0.2]].forEach(function (q) { var sp0 = mesh(ell(0.022 * u, 0.008 * u, 0.018 * u, 8), 'skin_s', 'AgeSpot'); at(sp0, q[0] * u, q[1] * u, q[2] * u); H.add(sp0); });
    }
    // wild white hair: a mass round the back, puffs over the ears, wisps sticking out every way (top stays bald)
    var hs = v.hair;
    E(0.40 * hs, 0.30, 0.25, 'hair', 0, 0.52, -0.26, 'BackHair', 16);
    [-1, 1].forEach(function (s) {
      E(0.13 * hs, 0.16, 0.20, 'hair', s * 0.36, 0.70, -0.14, 'SideHair', 14);
      E(0.11 * hs, 0.12, 0.15, 'hair_l', s * 0.39, 0.80, -0.06, 'SideHairTop', 12);
    });
    var R = rnd(91);
    var NT = [26, 52, 84, 112, 124, 136][DET - 1], tsz = [1, 0.82, 0.72, 0.66, 0.64, 0.62][DET - 1];
    for (var i = 0; i < NT; i++) {
      var a = (R() - 0.5) * Math.PI * 1.45 + Math.PI, y = 0.50 + R() * 0.36, rr = 0.38 + R() * 0.12;
      var x = Math.sin(a) * rr * hs, z = Math.cos(a) * rr - 0.06;
      if (Math.abs(x) < 0.22 && y > 0.70) continue;   // the bald crown stays bald
      var t = mesh(new THREE.IcosahedronGeometry((0.06 + R() * 0.05) * u * tsz, DET >= 5 ? 1 : 0), i % 5 === 4 ? 'hair_s' : i % 7 === 3 && DET > 1 ? 'hair_l' : 'hair', 'Tuft');
      at(t, x * u, y * u, z * u); t.rotation.set(R() * 3, R() * 3, R() * 3); if (DET > 1) t.scale.set(1.35, 0.8, 1.0); H.add(t);
    }
    var NW = [14, 22, 32, 44, 50, 56][DET - 1];
    for (var w = 0; w < NW; w++) {   // stray wisps: thin spikes pointing out and up
      var s2 = w % 2 ? 1 : -1, yy = 0.50 + R() * 0.38, zz = -0.30 + R() * 0.35;
      var sp = mesh(new THREE.ConeGeometry(0.028 * u * (DET > 1 ? 0.8 : 1), (0.16 + R() * 0.12) * u * hs, DET > 4 ? 8 : DET > 1 ? 6 : 4, DET > 4 ? 3 : DET > 1 ? 2 : 1), w % 3 ? 'hair_l' : 'hair', 'Wisp');
      at(sp, s2 * (0.44 + R() * 0.06) * u * hs, yy * u, zz * u); rot(sp, (R() - 0.6) * 0.8, 0, -s2 * (0.9 + R() * 0.7)); H.add(sp);
    }
    if (DET >= 5) {
      // fine white strands curling out of the hair (they show when the view is right in at his face)
      var RC = rnd(97), NC = DET >= 6 ? 30 : 20;
      for (var c = 0; c < NC; c++) {
        var ca = (RC() - 0.5) * Math.PI * 1.4 + Math.PI, cy0 = 0.52 + RC() * 0.32, ox = Math.sin(ca), oz = Math.cos(ca);
        var len = 0.10 + RC() * 0.09, turn = (RC() < 0.5 ? -1 : 1) * (2.2 + RC() * 2.4), lift = 0.02 + RC() * 0.05, pts = [];
        if (Math.abs(ox * 0.4) < 0.22 && cy0 > 0.70) continue;
        for (var q2 = 0; q2 <= 8; q2++) {
          var f2 = q2 / 8, rr2 = 0.38 + len * f2, side = Math.sin(turn * f2) * 0.035 * f2, up = lift * Math.sin(f2 * Math.PI * 0.8) + (Math.cos(turn * f2) - 1) * 0.02 * f2;
          pts.push(new THREE.Vector3((ox * rr2 + oz * side) * hs * u, (cy0 + up) * u, (oz * rr2 - ox * side - 0.06) * u));
        }
        var strand = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.0085 * u, 4, false), c % 4 ? 'hair_l' : 'hair', 'Strand'); H.add(strand);
      }
    }
    // ------------------------------------------------ the paper crown: five points, blue / green / red stars on the front
    var CR = new THREE.Group(); CR.name = 'Crown'; at(CR, 0.0, 0.88 * u, 0.0); rot(CR, -0.16, 0, 0.06); H.add(CR);
    var rx = 0.31 * u, rz = 0.34 * u, bh = 0.14 * u;
    var band = mesh(cyl(rx * 1.02, rx, bh, 24, rz / rx), 'cr', 'CrownBand'); at(band, 0, bh / 2, 0); CR.add(band);
    var rim = mesh(cyl(rx * 0.98, rx * 0.96, bh * 0.25, 24, rz / rx), 'cr_s', 'CrownRim'); at(rim, 0, bh * 0.15, 0); CR.add(rim);
    for (var k = 0; k < 5; k++) {
      var a2 = k / 5 * Math.PI * 2, tall = 0.22 * u;
      var pt = mesh(new THREE.ConeGeometry(0.13 * u, tall, 4, DET), 'cr', 'CrownPoint');
      at(pt, Math.sin(a2) * rx * 1.01, bh + tall / 2 - 0.004, Math.cos(a2) * rz * 1.01); pt.scale.set(1, 1, 0.22); pt.rotation.set(0, a2 + Math.PI / 4, 0); CR.add(pt);
    }
    if (DET >= 2) { var top = mesh(cyl(rx * 1.03, rx * 1.03, bh * 0.12, 24, rz / rx), 'cr_s', 'CrownEdge'); at(top, 0, bh * 0.98, 0); CR.add(top); }
    [['st_b', -0.62], ['st_g', 0.0], ['st_r', 0.62]].forEach(function (g) {
      var gm = mesh(star(0.065 * u, 0.012), g[0], 'Star'); at(gm, Math.sin(g[1]) * rx * 1.04, bh * 0.52, Math.cos(g[1]) * rz * 1.04); gm.rotation.y = g[1]; CR.add(gm);
    });
    out.crown = CR;
    return H;
  }

  // ------------------------------------------------------------------ body
  T2.build = function (king, id, opts) {
    opts = opts || {};
    DET = Math.max(1, Math.min(6, opts.detail | 0 || 1)); SF = [1, 1.36, 1.66, 1.92, 2.1, 2.26][DET - 1];
    var v = V[id] || V.A, J = king.joints, Dm = king.rig.D, out = {}, u = v.u;
    head(J, v, out);
    // thin neck with a stoop (on the Neck bone)
    var NK = new THREE.Group(); NK.name = 'Toon2Neck'; J.Neck.add(NK);
    var neck = mesh(cyl(0.050, 0.058, Dm.HEAD_DY + 0.06, 12, 0.9), 'skin_s', 'Neck'); at(neck, 0, (Dm.HEAD_DY + 0.02) / 2, 0.01); NK.add(neck);
    // torso: tweed jacket open over the green waistcoat (Spine bone at the hips)
    var S = new THREE.Group(); S.name = 'Toon2Torso'; J.Spine.add(S);
    var jk = v.jacket, y0 = jk.y0, y1 = Dm.SH_Y + 0.01, h = y1 - y0;
    var jacket = mesh(cyl(jk.top[0], jk.hem[0], h, 18, jk.top[1] / jk.top[0]), 'tw', 'Jacket'); at(jacket, 0, y0 + h / 2, -0.01); S.add(jacket);
    var hem = mesh(cyl(jk.hem[0] * 1.01, jk.hem[0] * 1.05, 0.05, 18, jk.hem[1] / jk.hem[0]), 'tw_s', 'JacketHem'); at(hem, 0, y0 + 0.02, -0.01); S.add(hem);
    var fz = jk.top[1] * 0.98;    // front surface depth near the chest
    [-1, 1].forEach(function (s) {
      var sh = mesh(ell(0.065, 0.055, 0.09), 'tw', 'Shoulder'); at(sh, s * (Dm.SH_X - 0.02), Dm.SH_Y - 0.015, -0.01); S.add(sh);
      // lapels: a light and a shadowed wedge meeting low on the chest
      var lap = mesh(rbox(0.055, h * 0.48, 0.022), s < 0 ? 'tw_l' : 'tw_s', 'Lapel'); at(lap, s * 0.07, y1 - h * 0.28, fz + 0.012); rot(lap, -0.10, 0, s * 0.26); S.add(lap);
      if (DET >= 4) { var st = mesh(box(0.004, h * 0.44, 0.004), s < 0 ? 'tw' : 'tw_l', 'LapelStitch'); at(st, s * 0.07 + s * 0.022, y1 - h * 0.28, fz + 0.025); rot(st, -0.10, 0, s * 0.26); S.add(st); }
      // jacket fronts curving away below the waistcoat
      var front = mesh(rbox(0.075, h * 0.62, 0.024), 'tw', 'JacketFront'); at(front, s * 0.115, y0 + h * 0.31, jk.hem[1] * 0.93); rot(front, -0.06, s * 0.22, s * -0.08); S.add(front);
      var flap = mesh(rbox(0.085, 0.022, 0.03), 'tw_s', 'PocketFlap'); at(flap, s * 0.125, y0 + h * 0.23, jk.hem[1] * 0.97); rot(flap, 0, s * 0.25, 0); S.add(flap);
      var collar = mesh(new THREE.ConeGeometry(0.035, 0.07, 3), 'sh_l', 'CollarPoint'); at(collar, s * 0.04, y1 + 0.005, fz * 0.75); rot(collar, Math.PI - 0.3, 0, s * 0.5); collar.scale.z = 0.4; S.add(collar);
    });
    var vest = mesh(rbox(0.15, h * 0.62, 0.03, 0.3), 'vest', 'Waistcoat'); at(vest, 0, y0 + h * 0.42, fz + 0.002); S.add(vest);
    var vestPt = mesh(new THREE.ConeGeometry(0.075, 0.06, 3), 'vest_s', 'WaistcoatPoints'); at(vestPt, 0, y0 + h * 0.10, fz + 0.004); rot(vestPt, Math.PI, 0, 0); vestPt.scale.z = 0.35; S.add(vestPt);
    var shirt = mesh(new THREE.ConeGeometry(0.06, h * 0.26, 3), 'sh', 'ShirtV'); at(shirt, 0, y1 - h * 0.12, fz + 0.016); rot(shirt, Math.PI, 0, 0); shirt.scale.z = 0.3; S.add(shirt);
    if (DET < 2) { for (var b = 0; b < 3; b++) { var bt = mesh(box(0.028, 0.026, 0.014), 'btn', 'Button'); at(bt, 0, y0 + h * (0.20 + b * 0.14), fz + 0.022); S.add(bt); } }
    else {
      // five round gold buttons (as on the sheet), a watch chain, a breast-pocket welt and a lapel notch each side
      for (var b2 = 0; b2 < 5; b2++) { var bt2 = mesh(ell(0.015, 0.015, 0.008, 10), 'btn', 'Button'); at(bt2, 0, y0 + h * (0.17 + b2 * 0.085), fz + 0.022); S.add(bt2); }
      var chain = new THREE.CatmullRomCurve3([new THREE.Vector3(0, y0 + h * 0.34, fz + 0.025), new THREE.Vector3(0.03, y0 + h * 0.30, fz + 0.026), new THREE.Vector3(0.055, y0 + h * 0.31, fz + 0.022)]);
      var ch = mesh(new THREE.TubeGeometry(chain, 8 * DET, 0.0035, 5, false), 'btn', 'WatchChain'); S.add(ch);
      var welt = mesh(rbox(0.06, 0.012, 0.012, 0.4), 'tw_s', 'BreastPocket'); at(welt, 0.1, y1 - h * 0.30, fz + 0.012); rot(welt, 0, 0.2, 0); S.add(welt);
      [-1, 1].forEach(function (s) { var notch = mesh(new THREE.ConeGeometry(0.02, 0.035, 3), 'tw_s', 'LapelNotch'); at(notch, s * 0.105, y1 - h * 0.08, fz + 0.012); rot(notch, 0, 0, s * 1.9); notch.scale.z = 0.4; S.add(notch); });
      var vent = mesh(box(0.006, h * 0.35, 0.006), 'tw_s', 'BackVent'); at(vent, 0, y0 + h * 0.17, -jk.hem[1] - 0.004); S.add(vent);
    }
    var jbtn = mesh(box(0.022, 0.022, 0.012), 'tw_s', 'JacketButton'); at(jbtn, -0.105, y0 + h * 0.36, fz + 0.03); S.add(jbtn);
    var collarBand = mesh(cyl(0.07, 0.085, 0.05, 12, 0.9), 'sh', 'Collar'); at(collarBand, 0, y1 + 0.01, 0.0); S.add(collarBand);
    var back = mesh(cyl(0.09, 0.11, 0.06, 12, 0.7), 'tw', 'JacketCollarBack'); at(back, 0, y1 + 0.015, -0.03); S.add(back);
    // shorts: seat and waistband on the hips, a leg on each thigh with a cargo pocket outside
    var HP = new THREE.Group(); HP.name = 'Toon2Hips'; J.Hips.add(HP);
    var seat = mesh(cyl(jk.hem[0] * 0.88, jk.hem[0] * 0.90, 0.13, 16, 0.75), 'kh', 'ShortsSeat'); at(seat, 0, -0.025, 0); HP.add(seat);
    ['L', 'R'].forEach(function (Sd) {
      var s = Sd === 'L' ? 1 : -1;
      var TH = new THREE.Group(); TH.name = 'Toon2Thigh_' + Sd; J['Thigh_' + Sd].add(TH);
      var hemY = -Dm.L1 * 0.70, lr = Dm.THIGH_X * 0.78;
      var leg = mesh(cyl(lr * 0.95, lr * 1.08, -hemY + 0.04, 12, 0.9), 'kh', 'ShortsLeg'); at(leg, s * 0.01, hemY / 2 + 0.02, 0); TH.add(leg);
      var cuff = mesh(cyl(lr * 1.09, lr * 1.10, 0.02, 12, 0.9), 'kh_s', 'ShortsHem'); at(cuff, s * 0.01, hemY + 0.01, 0); TH.add(cuff);
      var pk = mesh(rbox(0.035, -hemY * 0.48, 0.09, 0.3), 'kh', 'CargoPocket'); at(pk, s * (lr + 0.022), hemY * 0.55, 0.0); TH.add(pk);
      var pf = mesh(rbox(0.04, 0.022, 0.095, 0.4), 'kh_s', 'CargoFlap'); at(pf, s * (lr + 0.025), hemY * 0.30, 0.0); TH.add(pf);
      if (DET >= 2) { var pb = mesh(ell(0.008, 0.008, 0.006, 8), 'kh_s', 'FlapButton'); at(pb, s * (lr + 0.047), hemY * 0.34, 0.0); rot(pb, 0, s * Math.PI / 2, 0); TH.add(pb); }
      var lg = v.leg;
      var thigh = mesh(cyl(lg * 1.05, lg, Dm.L1 * 0.4, 10), 'skin', 'Thigh'); at(thigh, 0, -Dm.L1 * 0.8, 0); TH.add(thigh);
      var knee = mesh(ell(lg * 1.45, lg * 1.3, lg * 1.35, 10), 'skin', 'Knee'); at(knee, 0, -Dm.L1 + 0.005, 0.01); TH.add(knee);
      var SH = new THREE.Group(); SH.name = 'Toon2Shin_' + Sd; J['Shin_' + Sd].add(SH);
      var calf = mesh(ell(lg * 1.18, Dm.L2 * 0.30, lg * 1.25, 10), 'skin', 'Calf'); at(calf, 0, -Dm.L2 * 0.32, -0.01); SH.add(calf);
      var shin = mesh(cyl(lg * 0.95, lg * 0.80, Dm.L2 * 0.8, 10), 'skin', 'Shin'); at(shin, 0, -Dm.L2 * 0.55, 0.0); SH.add(shin);
      var sock = mesh(cyl(lg * 0.92, lg * 0.98, Dm.L2 * 0.26, 10), 'sock', 'Sock'); at(sock, 0, -Dm.L2 * 0.92, 0); SH.add(sock);
      if (DET >= 3) for (var rb = 0; rb < DET - 1; rb++) { var rib = mesh(cyl(lg * 1.0, lg * 1.0, 0.008, 10), 'sock_s', 'SockRib'); at(rib, 0, -Dm.L2 * (0.81 + rb * 0.025), 0); SH.add(rib); }
      // chunky hiking shoe (Foot bone at the ankle, sole on the ground, toe along +z)
      var F = new THREE.Group(); F.name = 'Toon2Shoe_' + Sd; J['Foot_' + Sd].add(F);
      var k = v.shoe, A = Dm.ANK, sw = 0.062 * k, sl = 0.30 * k;
      var upper = mesh(rbox(sw * 2, 0.085 * k, sl * 0.82, 0.3), 'shoe', 'ShoeUpper'); at(upper, 0, -A + 0.075 * k, 0.05 * k); F.add(upper);
      var toe = mesh(ell(sw, 0.05 * k, 0.075 * k, 12), 'shoe', 'ShoeToe'); at(toe, 0, -A + 0.06 * k, 0.17 * k); F.add(toe);
      var collarS = mesh(cyl(0.055 * k, 0.065 * k, 0.05 * k, 10), 'shoe_s', 'ShoeCollar'); at(collarS, 0, -A + 0.115 * k, -0.02 * k); F.add(collarS);
      var tongue = mesh(box(sw * 1.3, 0.03 * k, 0.11 * k), 'shoe_l', 'ShoeTongue'); at(tongue, 0, -A + 0.12 * k, 0.06 * k); rot(tongue, -0.25, 0, 0); F.add(tongue);
      var NL = [3, 5, 5, 7, 7, 9][DET - 1];
      for (var l = 0; l < NL; l++) { var lsp = 0.105 / NL; var lace = mesh(rbox(sw * 1.45, 0.012 * k, 0.014 * k, 0.45), 'or', 'Lace'); at(lace, 0, -A + (0.128 - l * 0.036 / NL * 3 * 0.33) * k, (0.03 + l * lsp) * k); F.add(lace); }
      if (DET >= 2) {
        var bow = mesh(ell(0.022 * k, 0.012 * k, 0.016 * k, 8), 'or', 'LaceBow'); at(bow, 0, -A + 0.14 * k, 0.015 * k); F.add(bow);
        var heel = mesh(rbox(sw * 0.8, 0.05 * k, 0.02 * k, 0.4), 'or_s', 'HeelTab'); at(heel, 0, -A + 0.1 * k, -0.105 * k); F.add(heel);
        var NG = [0, 5, 8, 11, 12, 13][DET - 1];
        for (var lg2 = 0; lg2 < NG; lg2++) [-1, 1].forEach(function (q) { var lug = mesh(box(0.016, 0.012 * k, 0.022 * k), 'sole', 'Lug'); at(lug, q * (sw * 1.05), -A + 0.006 * k, (-0.09 + lg2 * 0.27 / (NG - 1)) * k); F.add(lug); });
      }
      [-1, 1].forEach(function (q) {
        var stripe = mesh(box(0.012, 0.022 * k, sl * 0.55), 'or', 'ShoeStripe'); at(stripe, q * (sw + 0.002), -A + 0.07 * k, 0.05 * k); rot(stripe, -0.35, 0, 0); F.add(stripe);
        var stripe2 = mesh(box(0.012, 0.016 * k, sl * 0.4), 'or_s', 'ShoeStripe2'); at(stripe2, q * (sw + 0.002), -A + 0.05 * k, 0.03 * k); rot(stripe2, -0.25, 0, 0); F.add(stripe2);
      });
      var mid = mesh(box(sw * 2.1, 0.03 * k, sl * 0.98), 'or', 'Midsole'); at(mid, 0, -A + 0.03 * k, 0.05 * k); F.add(mid);
      var sole = mesh(box(sw * 2.15, 0.016 * k, sl), 'sole', 'Outsole'); at(sole, 0, -A + 0.008 * k, 0.05 * k); F.add(sole);
      // arm: tweed sleeves, suede elbow patch at the back of the elbow, lavender cuff, big hands
      var aw = v.arm;
      var UA = new THREE.Group(); UA.name = 'Toon2UpperArm_' + Sd; J['UpperArm_' + Sd].add(UA);
      var sl1 = mesh(cyl(aw * 1.15, aw, Dm.UA + 0.03, 12), 'tw', 'Sleeve'); at(sl1, s * 0.004, -Dm.UA / 2 + 0.01, 0); UA.add(sl1);
      var FA = new THREE.Group(); FA.name = 'Toon2Forearm_' + Sd; J['Forearm_' + Sd].add(FA);
      var sl2 = mesh(cyl(aw * 0.98, aw * 0.92, Dm.FA + 0.01, 12), 'tw', 'ForeSleeve'); at(sl2, 0, -Dm.FA / 2, 0); FA.add(sl2);
      var patch = mesh(ell(aw * 0.75, aw * 1.15, aw * 0.4, 10), 'sue', 'ElbowPatch'); at(patch, s * aw * 0.3, -aw * 0.6, -aw * 0.82); rot(patch, 0, s * 0.4, 0); FA.add(patch);
      var cbtn = mesh(box(0.014, 0.014, 0.012), 'sue', 'CuffButton'); at(cbtn, s * aw * 0.7, -Dm.FA * 0.82, -aw * 0.6); FA.add(cbtn);
      var cf = mesh(cyl(aw * 0.80, aw * 0.80, 0.022, 10), 'sh', 'ShirtCuff'); at(cf, 0, -Dm.FA + 0.002, 0); FA.add(cf);
      var hk = v.hand;
      var HD = new THREE.Group(); HD.name = 'Toon2Hand_' + Sd; J['Hand_' + Sd].add(HD);
      var palm = mesh(ell(0.026 * hk, 0.048 * hk, 0.045 * hk, 10), 'skin', 'Palm'); at(palm, 0, -0.042 * hk, 0); HD.add(palm);
      var thumb = mesh(ell(0.015 * hk, 0.032 * hk, 0.016 * hk, 8), 'skin_s', 'Thumb'); at(thumb, -s * 0.008, -0.038 * hk, 0.042 * hk); rot(thumb, 0.4, 0, 0); HD.add(thumb);
      var FG = new THREE.Group(); FG.name = 'Toon2Fingers_' + Sd; J['Fingers_' + Sd].add(FG);
      var fing = mesh(ell(0.024 * hk, 0.036 * hk, 0.040 * hk, 8), 'skin', 'Fingers'); at(fing, 0, -0.02 * hk, 0); FG.add(fing);
      if (DET >= 4) for (var kn = 0; kn < 4; kn++) { var kb = mesh(ell(0.007 * hk, 0.006 * hk, 0.007 * hk, 6), 'skin_l', 'Knuckle'); at(kb, s * 0.017 * hk, -0.006 * hk, (-0.026 + kn * 0.017) * hk); HD.add(kb); }
    });
    // held props sized to his hands
    ['bowl', 'bottle', 'icosa'].forEach(function (n) { if (king.props[n]) king.props[n].scale.setScalar(id === 'B' ? 0.85 : 0.9); });
    king.cradle = [0.026, 0.0, -0.055]; king.carry = [-0.055, -0.055, 0];
    king.setHat = function (h2) { out.crown.visible = h2 === 'crown'; };
    king.setCape = function () {};
    king.toonView = { target: v.target, zoom: v.zoom };
    if (opts.merge) T2.merge(king, out);
    return out;
  };
  // join the rigid pieces hung on each joint into one mesh per colour (far fewer draw calls; the picture is unchanged).
  // The crown (it can be taken off) and anything in the hand slots (held finds) stay separate.
  T2.merge = function (king, out) {
    var J = king.joints, joints = new Set(), skip = new Set();
    Object.keys(J).forEach(function (k) { joints.add(J[k]); if (/^Slot_/.test(k)) skip.add(J[k]); });
    if (out && out.crown) skip.add(out.crown);
    king.root.updateMatrixWorld(true);
    var found = [];
    king.root.traverse(function (o) {
      if (!o.isMesh) return;
      var a = o.parent, bad = false;
      while (a && !joints.has(a)) { if (skip.has(a)) bad = true; a = a.parent; }
      if (!a || bad || skip.has(a)) return;
      found.push([o, a]);
    });
    var bins = new Map(), inv = new THREE.Matrix4(), rel = new THREE.Matrix4();
    found.forEach(function (f) {
      var m = f[0], j = f[1];
      inv.copy(j.matrixWorld).invert(); rel.multiplyMatrices(inv, m.matrixWorld);
      var g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      Object.keys(g.attributes).forEach(function (n) { if (n !== 'position' && n !== 'normal') g.deleteAttribute(n); });
      g.applyMatrix4(rel);
      var key = j.uuid + '|' + m.material.uuid;
      if (!bins.has(key)) bins.set(key, { j: j, mat: m.material, list: [] });
      bins.get(key).list.push(g);
      m.parent.remove(m); m.geometry.dispose();
    });
    bins.forEach(function (b) {
      var n = 0; b.list.forEach(function (g) { n += g.attributes.position.count; });
      var P = new Float32Array(n * 3), N = new Float32Array(n * 3), o = 0;
      b.list.forEach(function (g) { P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; g.dispose(); });
      var geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N, 3)); geo.computeBoundingSphere();
      var mm = new THREE.Mesh(geo, b.mat); mm.name = 'Merged_' + b.j.name + '_' + (b.mat.name || ''); mm.castShadow = true; mm.receiveShadow = true; b.j.add(mm);
    });
    return bins.size;
  };
})(typeof window !== 'undefined' ? window : globalThis);

;