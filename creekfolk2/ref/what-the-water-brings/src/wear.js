/* PKWear: the v3 clothes, as skinned meshes on the PKSkin rig.
   everyday : lavender micro-gingham button-down shirt (tucked), khaki cargo shorts   (+ black socks, striped trainers from body3)
   tweed    : the same shirt and shorts under a brown tweed jacket with elbow patches and a dark green waistcoat
   cardigan : the shirt under a mustard cable sweater vest and a burgundy cardigan with gold trim, charcoal trousers with rolled cuffs
   Garments are built in a joint's local frame (Spine-local for the torso: y up from the hip pivot), then moved to bind space and
   weighted with the same region functions as the body under them. */
(function (global) {
  'use strict';
  var THREE = global.THREE, C = global.PKCore, Fab = global.PKFabric, K = global.PKSkin, B3 = global.PKBody3;
  var Wr = {};
  global.PKWear = Wr;
  var D = K.D, PI = Math.PI, smooth = C.smooth, mix = C.mix, clamp = C.clamp, V3 = THREE.Vector3, g = B3.g, mirrorX = B3.mirrorX;

  // ================================================================== kit
  function tilesFor(fab, circ) { return Math.max(1, Math.round(circ / fab.tile)); }
  function psiForX(surf, x, y) {
    var ax = Math.abs(x), lo = 0, hi = PI / 2, sg = x < 0 ? -1 : 1;
    if (surf.at(hi, y).x <= ax) return sg * hi;
    for (var i = 0; i < 16; i++) { var m = (lo + hi) / 2; if (surf.at(m, y).x < ax) lo = m; else hi = m; }
    return sg * (lo + hi) / 2;
  }
  function makeGrid(P, UV, RN, nR, nC) {
    var N = new Float32Array(P.length), a = new V3(), b = new V3(), n = new V3(), p0 = new V3(), p1 = new V3(), i, j, dot = 0;
    function get(r, c, out) { var k = (r * nC + c) * 3; return out.set(P[k], P[k + 1], P[k + 2]); }
    for (i = 0; i < nR; i++) for (j = 0; j < nC; j++) {
      a.subVectors(get(i, Math.min(j + 1, nC - 1), p1), get(i, Math.max(j - 1, 0), p0));
      b.subVectors(get(Math.min(i + 1, nR - 1), j, p1), get(Math.max(i - 1, 0), j, p0));
      n.crossVectors(a, b); var l = n.length(), k = (i * nC + j) * 3;
      if (l < 1e-12) { n.set(RN[k], RN[k + 1], RN[k + 2]); l = 1; }
      N[k] = n.x / l; N[k + 1] = n.y / l; N[k + 2] = n.z / l;
      dot += N[k] * RN[k] + N[k + 1] * RN[k + 1] + N[k + 2] * RN[k + 2];
    }
    var flip = dot < 0;
    if (flip) for (i = 0; i < N.length; i++) N[i] = -N[i];
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(UV, 2));
    geo.setIndex(C.gridIndices(nR, nC, flip));
    return geo;
  }
  // strip on a lofted surface: map(s, t) -> [psi, y]; off(s, t) -> lift along the normal
  function ribbon(surf, map, off, o) {
    var rows = o.rows || 12, cols = o.cols || 6, nR = rows + 1, nC = cols + 1, tile = o.tile || 0.2;
    var P = new Float32Array(nR * nC * 3), UV = new Float32Array(nR * nC * 2), RN = new Float32Array(nR * nC * 3), i, j;
    for (i = 0; i < nR; i++) for (j = 0; j < nC; j++) {
      var s = j / cols, t = i / rows, m = map(s, t), fr = surf.frame(m[0], m[1]), d = off ? off(s, t, m) : 0, k = (i * nC + j) * 3;
      P[k] = fr.p.x + fr.n.x * d; P[k + 1] = fr.p.y + fr.n.y * d; P[k + 2] = fr.p.z + fr.n.z * d;
      RN[k] = fr.n.x; RN[k + 1] = fr.n.y; RN[k + 2] = fr.n.z;
    }
    var du = new Float32Array(nR * nC), dv = new Float32Array(nR * nC);
    for (i = 0; i < nR; i++) for (j = 0; j < nC; j++) {
      var q = i * nC + j, k0 = q * 3;
      if (j) { var kk = (q - 1) * 3; du[q] = du[q - 1] + Math.hypot(P[k0] - P[kk], P[k0 + 1] - P[kk + 1], P[k0 + 2] - P[kk + 2]); }
      if (i) { var kv = (q - nC) * 3; dv[q] = dv[q - nC] + Math.hypot(P[k0] - P[kv], P[k0 + 1] - P[kv + 1], P[k0 + 2] - P[kv + 2]); }
      UV[q * 2] = du[q] / tile; UV[q * 2 + 1] = dv[q] / tile;
    }
    return makeGrid(P, UV, RN, nR, nC);
  }
  function pathPts(surf, f, n, off) {
    var out = [];
    for (var i = 0; i <= n; i++) { var m = f(i / n), fr = surf.frame(m[0], m[1]); out.push(fr.p.clone().addScaledVector(fr.n, typeof off === 'function' ? off(i / n) : (off || 0))); }
    return out;
  }
  function rimPts(surf, map, off, per) {
    var pts = [], i, n = per || 8;
    for (i = 0; i < n; i++) pts.push([i / n, 0]); for (i = 0; i < n; i++) pts.push([1, i / n]); for (i = 0; i < n; i++) pts.push([1 - i / n, 1]); for (i = 0; i < n; i++) pts.push([0, 1 - i / n]);
    return pts.map(function (q) { var m = map(q[0], q[1]), fr = surf.frame(m[0], m[1]); return fr.p.clone().addScaledVector(fr.n, off(q[0], q[1])); });
  }
  function pipe(pts, o) {
    o = o || {};
    var radial = o.radial || 6, closed = !!o.closed, segs = o.segs || Math.max(8, pts.length * 4), tile = o.tile || 0.1;
    var curve = new THREE.CatmullRomCurve3(pts, closed, 'centripetal'), Pp = curve.getPoints(segs), n = Pp.length, T = [], i, j;
    for (i = 0; i < n; i++) T.push(new V3().subVectors(Pp[Math.min(n - 1, i + 1)], Pp[Math.max(0, i - 1)]).normalize());
    var ref = Math.abs(T[0].y) < 0.9 ? new V3(0, 1, 0) : new V3(1, 0, 0), N = new V3().crossVectors(T[0], ref).normalize(), Bv = new V3();
    var W = radial + 1, pos = new Float32Array(n * W * 3), nor = new Float32Array(n * W * 3), uv = new Float32Array(n * W * 2), len = 0;
    var rf = typeof o.r === 'function' ? o.r : function () { return o.r || 0.004; };
    for (i = 0; i < n; i++) {
      if (i) len += Pp[i].distanceTo(Pp[i - 1]);
      N.sub(T[i].clone().multiplyScalar(N.dot(T[i]))).normalize(); Bv.crossVectors(T[i], N).normalize();
      var t = i / (n - 1), r = rf(t) * (closed || o.noTaper ? 1 : Math.pow(Math.min(1, t / 0.03, (1 - t) / 0.03), 0.5));
      for (j = 0; j < W; j++) {
        var a = j / radial * 2 * PI, ca = Math.cos(a), sa = Math.sin(a), k = i * W + j;
        var nx = N.x * ca + Bv.x * sa, ny = N.y * ca + Bv.y * sa, nz = N.z * ca + Bv.z * sa;
        pos[k * 3] = Pp[i].x + nx * r; pos[k * 3 + 1] = Pp[i].y + ny * r; pos[k * 3 + 2] = Pp[i].z + nz * r;
        nor[k * 3] = nx; nor[k * 3 + 1] = ny; nor[k * 3 + 2] = nz; uv[k * 2] = len / tile; uv[k * 2 + 1] = j / radial;
      }
    }
    var idx = [];
    for (i = 0; i < n - 1; i++) for (j = 0; j < radial; j++) { var a0 = i * W + j, a1 = a0 + 1, b0 = a0 + W, b1 = b0 + 1; idx.push(a0, a1, b0, a1, b1, b0); }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx);
    return geo;
  }
  function merge(list) { return list.length === 1 ? list[0] : THREE.BufferGeometryUtils.mergeBufferGeometries(list, false); }
  function paintGeo(geo, rgb) { var n = geo.attributes.position.count, a = new Float32Array(n * 3); for (var i = 0; i < n; i++) { a[i * 3] = rgb[0]; a[i * 3 + 1] = rgb[1]; a[i * 3 + 2] = rgb[2]; } geo.setAttribute('color', new THREE.BufferAttribute(a, 3)); return geo; }
  function buttonGeo(r, h, holes, col, hcol) {
    var pts = [[0, 0], [0.92, 0], [1, 0.35], [1, 0.7], [0.93, 1], [0.64, 0.95], [0.50, 0.68], [0, 0.64]].map(function (q) { return new THREE.Vector2(q[0] * r, q[1] * h); });
    var lg = new THREE.LatheGeometry(pts, 14); lg = lg.index ? lg.toNonIndexed() : lg; paintGeo(lg, col); var geos = [lg];
    var hp = holes === 4 ? [[-1, -1], [1, -1], [-1, 1], [1, 1]] : [[-1, 0], [1, 0]], hr = r * 0.12;
    hp.forEach(function (q) { var c = new THREE.CylinderGeometry(hr, hr, h * 0.10, 6); c = c.toNonIndexed(); c.translate(q[0] * r * 0.26, h * 0.67, q[1] * r * 0.26); paintGeo(c, hcol); geos.push(c); });
    geos.forEach(function (q) { q.deleteAttribute('uv'); });
    return merge(geos);
  }
  // list: [{ p, n, r }]
  function buttons(list, o) {
    var geos = list.map(function (b) {
      var bg = buttonGeo(b.r, (o.h || 0.42) * b.r, o.holes || 2, o.col, o.hcol || [0.03, 0.03, 0.03]);
      var up = b.n.clone().normalize(), xa = new V3(1, 0, 0); if (Math.abs(up.x) > 0.95) xa.set(0, 0, 1);
      var z = new V3().crossVectors(xa, up).normalize(), x = new V3().crossVectors(up, z).normalize();
      var m = new THREE.Matrix4().makeBasis(x, up, z); m.setPosition(b.p); bg.applyMatrix4(m); return bg;
    });
    return merge(geos);
  }
  function btnMat(name, rough) { var m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: rough === undefined ? 0.4 : rough, metalness: 0 }); m.name = name; return m; }
  function lin(hex) { var c = C.col(hex); return [c.r, c.g, c.b]; }
  function rrect(s, t, corner) { var u = 2 * s - 1, v = 2 * t - 1; return [u * mix(1, Math.sqrt(1 - v * v * 0.5), corner), v * mix(1, Math.sqrt(1 - u * u * 0.5), corner)]; }
  function cloth(fab, o) {
    o = o || {};
    var m = new THREE.MeshStandardMaterial({ map: fab.map, normalMap: fab.normal, normalScale: new THREE.Vector2(o.ns || 1, o.ns || 1), roughness: o.rough === undefined ? fab.rough : o.rough, metalness: 0, side: o.side === undefined ? THREE.DoubleSide : o.side });
    if (o.tint) m.color.set(o.tint).convertSRGBToLinear();
    m.name = o.name || 'Cloth'; return m;
  }
  function flat(hex, o) { o = o || {}; var m = new THREE.MeshStandardMaterial({ color: C.col(hex), roughness: o.rough === undefined ? 0.85 : o.rough, metalness: 0, side: o.side === undefined ? THREE.DoubleSide : o.side }); m.name = o.name || hex; return m; }
  // soft cloth wrinkles as a radial displacement
  function wrinkles(seed, amp, fy, fa) {
    fy = fy || 26; fa = fa || 2.2;
    return function (x, y, z, u, i, a) {
      var n1 = C.noise(y * fy + a * fa, a * 3.0 + seed, seed), n2 = C.noise(y * fy * 2.3 - a * 3, a * 5 + seed * 2, seed + 4);
      return amp * ((n1 - 0.5) * 1.6 + (n2 - 0.5) * 0.6);
    };
  }
  Wr.kit = { psiForX: psiForX, ribbon: ribbon, pathPts: pathPts, rimPts: rimPts, pipe: pipe, merge: merge, buttons: buttons, btnMat: btnMat, lin: lin, rrect: rrect, cloth: cloth, flat: flat, wrinkles: wrinkles, tilesFor: tilesFor };

  // ================================================================== the torso and the shirt (Spine-local; y up from the hip pivot)
  // [y, rx, rz, cz, n] of the shirt surface (loose, blousy over a small belly; narrow shoulders)
  var SHIRT = [
    [0.050, 0.168, 0.120, 0.010, 2.2], [0.100, 0.180, 0.148, 0.018, 2.2], [0.150, 0.196, 0.158, 0.020, 2.25], [0.205, 0.202, 0.160, 0.022, 2.25],
    [0.260, 0.201, 0.157, 0.020, 2.3], [0.320, 0.197, 0.148, 0.006, 2.35], [0.375, 0.195, 0.142, -0.006, 2.45], [0.420, 0.194, 0.136, -0.013, 2.6],
    [0.450, 0.194, 0.128, -0.017, 2.55], [0.475, 0.182, 0.116, -0.019, 2.5], [0.492, 0.152, 0.101, -0.019, 2.4], [0.503, 0.114, 0.087, -0.018, 2.2],
    [0.512, 0.084, 0.077, -0.016, 2.1], [0.518, 0.075, 0.072, -0.015, 2.0]];
  Wr.SHIRT = SHIRT;
  function shirtStations(off) {
    return SHIRT.map(function (r) { var o = typeof off === 'function' ? off(r[0]) : (off || 0); if (typeof o === 'number') o = [o, o]; return { y: r[0], rx: r[1] + o[0], rz: r[2] + o[1], cz: r[3], n: r[4] }; });
  }
  Wr.shirtStations = shirtStations;
  // the neckline drops toward the front
  function neckDrop(y, a) { return -0.046 * smooth(0.486, 0.518, y) * Math.pow(Math.max(0, Math.cos(a)), 2.2); }

  // ---------------------------------------------------------------- arms: one loft per sleeve in UpperArm-local space (straight arm: wrist at -(UA + FA))
  var WRIST = -(D.UA + D.FA);
  // [y, rx, rz] of the shirt sleeve (loose, cuffed)
  var SLEEVE = [[WRIST + 0.040, 0.034, 0.039], [WRIST + 0.060, 0.040, 0.044], [WRIST + 0.110, 0.046, 0.049], [-0.40, 0.050, 0.052], [-0.32, 0.052, 0.054], [-0.27, 0.053, 0.056], [-0.18, 0.055, 0.058], [-0.09, 0.057, 0.061], [-0.040, 0.056, 0.061], [-0.014, 0.053, 0.058]];
  Wr.SLEEVE = SLEEVE;

  // ================================================================== everyday shirt
  function buildShirt(rig, o) {
    o = o || {};
    var out = { meshes: [] };
    var ging = Fab.gingham({ color: o.check || '#6f3550', ground: '#f3eef0', n: 12, tile: 0.048, seed: 31 });
    var mat = cloth(ging, { name: 'Shirt_Gingham', rough: 0.78, ns: 0.6 });
    var btn = btnMat('Shirt_Buttons', 0.3);
    out.mat = mat;
    var wT = K.W.torso(rig, { w0: 0.08, w1: 0.26 });
    // ---- body
    var st = shirtStations(0), surf = C.surface(st);
    var body = C.loft(st, {
      seg: 72, uTiles: tilesFor(ging, 2 * PI * 0.18), vTile: ging.tile,
      disp: function (x, y, z, u, i, a) {
        var d = wrinkles(11, 0.0024)(x, y, z, u, i, a);
        d += 0.0045 * smooth(0.12, 0.20, y) * smooth(0.30, 0.20, y) * Math.sin(a * 5 + y * 12 + 1.3 * C.noise(a * 2, y * 8, 4));   // blousing folds
        d -= 0.0040 * g(y, 0.105, 0.012);                                                                                         // pulled in at the waistband
        d += 0.0020 * g(Math.abs(a), 1.65, 0.22) * smooth(0.25, 0.42, y) * smooth(0.46, 0.40, y);                                  // fabric gathering under the arms
        return d;
      },
      dy: function (x, y, z, u, i, a) { return i >= SHIRT.length - 3 ? neckDrop(y, a) : 0; },
      gap: function (y) { return 0.40 * Math.pow(smooth(0.425, 0.512, y), 0.8); }
    });
    out.body = K.skinned(rig, body, 'Spine', mat, 'Shirt_Body', wT);
    // ---- front placket with buttons (shirt's right side over left: buttons on his right, x < 0 is his right)
    var plk = ribbon(surf, function (s, t) { var y = mix(0.11, 0.432, t); return [psiForX(surf, (s - 0.5) * 0.034, y), y + (t > 0.97 ? neckDrop(y, 0) * 0.8 : 0)]; }, function () { return 0.0018; }, { rows: 30, cols: 3, tile: ging.tile });
    K.skinned(rig, plk, 'Spine', mat, 'Shirt_Placket', wT);
    var bl = [0.150, 0.220, 0.290, 0.360, 0.425].map(function (y) { var fr = surf.frame(0, y); return { p: fr.p.clone().addScaledVector(fr.n, 0.0030), n: fr.n, r: 0.0055 }; });
    K.skinned(rig, buttons(bl, { col: lin('#ece8e4'), holes: 4, h: 0.4 }), 'Spine', btn, 'Shirt_Buttons', wT);
    // ---- chest pocket on his left breast
    var px0 = 0.058, px1 = 0.140, py0 = 0.318, py1 = 0.405;
    var pmap = function (s, t) { var q = rrect(s, t * 0.85 + 0.15 * t * t, 0.0), yy = mix(py0, py1, 0.5 + 0.5 * q[1]) - 0.012 * Math.pow(1 - t, 3) * (1 - Math.abs(2 * s - 1)); return [psiForX(surf, mix(px0, px1, 0.5 + 0.5 * q[0]), yy), yy]; };
    K.skinned(rig, ribbon(surf, pmap, function () { return 0.0022; }, { rows: 10, cols: 8, tile: ging.tile }), 'Spine', mat, 'Shirt_Pocket', wT);
    // ---- back yoke seam and centre box pleat as small raised strips
    var yoke = pipe(pathPts(surf, function (t) { return [PI + (t - 0.5) * 2.4, 0.455 - 0.006 * Math.cos((t - 0.5) * PI)]; }, 24, 0.0010), { r: 0.0014, tile: 0.1, radial: 4 });
    K.skinned(rig, yoke, 'Spine', mat, 'Shirt_Yoke', wT);
    // ---- collar: a band round the neck and a button-down fall that rolls over it and lies on the shoulders, open at the throat
    var nk = rig.bindP.Neck.clone().sub(rig.bindP.Spine);            // neck base in Spine-local
    var cr = { rx: 0.0685, rz: 0.0670 }, cz0 = nk.z + 0.004, gap = 0.50, YT = 0.536;
    function front(a) { return Math.pow(Math.max(0, Math.cos(a)), 2); }
    function bandTop(a) { return YT - 0.026 * front(a); }
    var wCol = function (x, y, z) { var yy = y - rig.bindP.Spine.y; return K.lerpW(wT(x, y, z), K.one('Neck'), 0.5 * smooth(nk.y - 0.03, nk.y + 0.03, yy)); };
    // band: from inside the shirt neckline up to the fold
    (function () {
      var rows = 4, nR = rows + 1, nC = 49, P = new Float32Array(nR * nC * 3), UV = new Float32Array(nR * nC * 2), RN = new Float32Array(nR * nC * 3), i, j;
      for (i = 0; i < nR; i++) for (j = 0; j < nC; j++) {
        var t = i / rows, a = gap + (2 * PI - 2 * gap) * j / (nC - 1), sa = Math.sin(a), ca = Math.cos(a), k = (i * nC + j) * 3;
        var y = mix(0.500 - 0.030 * front(a), bandTop(a), t), r = 1 + 0.03 * (1 - t);
        P[k] = sa * cr.rx * r; P[k + 1] = y; P[k + 2] = cz0 + ca * cr.rz * r; RN[k] = sa; RN[k + 1] = 0; RN[k + 2] = ca;
        UV[(i * nC + j) * 2] = j / (nC - 1) * 0.42 / ging.tile; UV[(i * nC + j) * 2 + 1] = t * 0.035 / ging.tile;
      }
      K.skinned(rig, makeGrid(P, UV, RN, nR, nC), 'Spine', mat, 'Shirt_CollarBand', wCol);
    })();
    // fall: fold line at the band top -> down over the band -> onto the shirt -> outer edge (points longer at the front)
    function surfPt(a, y0, lift) { var fr = surf.frame(a, y0), q = fr.p.clone().addScaledVector(fr.n, lift); q.y += neckDrop(y0, a); return q; }
    var fallPts = function (a, t) {
      var sa = Math.sin(a), ca = Math.cos(a), fa = front(a), yt = bandTop(a);
      var P0 = new V3(sa * cr.rx * 1.05, yt + 0.003, cz0 + ca * cr.rz * 1.05);
      var P1 = new V3(sa * cr.rx * 1.20, yt - 0.024, cz0 + ca * cr.rz * 1.20);
      var P2 = surfPt(a, 0.5125, 0.0055), P3 = surfPt(a, mix(0.498, 0.440, fa), 0.0045);
      var pts = [P0, P1, P2, P3], u = t * 3, k = Math.min(2, Math.floor(u)), f = u - k;
      var A = pts[Math.max(0, k - 1)], Bp = pts[k], Cp = pts[k + 1], Dp = pts[Math.min(3, k + 2)];
      // centripetal-ish Catmull-Rom without the tension maths: plain uniform CR
      var f2 = f * f, f3 = f2 * f;
      return new V3().addScaledVector(A, -0.5 * f3 + f2 - 0.5 * f).addScaledVector(Bp, 1.5 * f3 - 2.5 * f2 + 1).addScaledVector(Cp, -1.5 * f3 + 2 * f2 + 0.5 * f).addScaledVector(Dp, 0.5 * f3 - 0.5 * f2);
    };
    (function () {
      var rows = 12, nR = rows + 1, nC = 57, P = new Float32Array(nR * nC * 3), UV = new Float32Array(nR * nC * 2), RN = new Float32Array(nR * nC * 3), i, j;
      var g0 = gap * 0.80;
      for (i = 0; i < nR; i++) for (j = 0; j < nC; j++) {
        var t = i / rows, s0 = j / (nC - 1), a = o.under ? (s0 < 0.5 ? mix(g0, 1.25, s0 * 2) : mix(2 * PI - 1.25, 2 * PI - g0, s0 * 2 - 1)) : g0 + (2 * PI - 2 * g0) * s0, k = (i * nC + j) * 3;
        // the points: near the two ends the outer edge swings toward the front centre
        var endK = Math.max(smooth(0.10, 0.0, s0), smooth(0.90, 1.0, s0)), aa = a;
        if (endK > 0 && t > 0.6) aa = a + (a < PI ? -1 : 1) * 0.0 * endK;
        var q = fallPts(aa, t);
        P[k] = q.x; P[k + 1] = q.y; P[k + 2] = q.z; RN[k] = Math.sin(a); RN[k + 1] = 0.5; RN[k + 2] = Math.cos(a);
        UV[(i * nC + j) * 2] = s0 * 0.50 / ging.tile; UV[(i * nC + j) * 2 + 1] = t * 0.07 / ging.tile;
      }
      var fallGeo = makeGrid(P, UV, RN, nR, nC);
      if (o.under) {   // drop the quads that would span the back between the two front halves
        var ix = fallGeo.index.array, keep = [], mid = (nC - 1) / 2;
        for (var q2 = 0; q2 < ix.length; q2 += 3) { var c0 = ix[q2] % nC, c1 = ix[q2 + 1] % nC, c2 = ix[q2 + 2] % nC, lo = Math.min(c0, c1, c2), hi = Math.max(c0, c1, c2); if (!(lo < mid && hi > mid) && !(lo === Math.floor(mid) && hi === Math.ceil(mid))) keep.push(ix[q2], ix[q2 + 1], ix[q2 + 2]); }
        fallGeo.setIndex(keep);
      }
      K.skinned(rig, fallGeo, 'Spine', mat, 'Shirt_CollarFall', wCol);
      // stitched outer edge (catches light and gives the collar a crisp outline)
      function edgeOf(aa, bb) { var e = []; for (j = 0; j <= 28; j++) { var a3 = mix(aa, bb, j / 28), q3 = fallPts(a3, 0.995), n3 = new V3(Math.sin(a3), 0.7, Math.cos(a3)).normalize(); e.push(q3.addScaledVector(n3, 0.0012)); } return pipe(e, { r: 0.0020, tile: 0.1, radial: 5, noTaper: true }); }
      var eg = o.under ? merge([edgeOf(g0, 1.25), edgeOf(2 * PI - 1.25, 2 * PI - g0)]) : edgeOf(g0, 2 * PI - g0);
      K.skinned(rig, eg, 'Spine', mat, 'Shirt_CollarEdge', wCol);
      // rolled fold along the top
      var roll = []; for (j = 0; j <= 40; j++) { var a2 = g0 + (2 * PI - 2 * g0) * j / 40; roll.push(fallPts(a2, 0.02)); }
      if (o.under) roll = roll.map(function (q4) { return q4.clone().multiplyScalar(1).setY(q4.y - 0.004); });
      K.skinned(rig, pipe(roll, { r: 0.0030, tile: 0.1, radial: 6 }), 'Spine', mat, 'Shirt_CollarRoll', wCol);
      // collar-point buttons
      var cpb = [1, -1].map(function (sg) { var a = sg * (g0 + 0.10), q = fallPts(a, 0.86), n = new V3(Math.sin(a), 0.6, Math.cos(a)).normalize(); return { p: q.addScaledVector(n, 0.0025), n: n, r: 0.0038 }; });
      K.skinned(rig, buttons(cpb, { col: lin('#ece8e4'), holes: 2, h: 0.4 }), 'Spine', btn, 'Shirt_CollarButtons', wCol);
    })();
    // ---- sleeves (UpperArm-local, straight down) with cuffs
    ['L', 'R'].forEach(function (S) {
      var wA = K.W.arm(rig, S, { s0: -0.04, s1: 0.13 });
      var sst = SLEEVE.filter(function (r) { return !o.under || r[0] < WRIST + 0.17; }).map(function (r) { return { y: r[0], rx: r[1] - (o.under ? 0.004 : 0), rz: r[2] - (o.under ? 0.004 : 0) }; });
      var sg = C.loft(sst, {
        seg: 40, capB: o.under ? undefined : { h: 0.014, steps: 4 }, uTiles: tilesFor(ging, 2 * PI * 0.05), vTile: ging.tile,
        disp: function (x, y, z, u, i, a) {
          var d = wrinkles(S === 'L' ? 21 : 27, 0.0022, 30, 2.4)(x, y, z, u, i, a);
          d += 0.0040 * g(y, -0.30, 0.06) * Math.sin(a * 3 + y * 70) * 0.8;            // elbow folds
          d += 0.0035 * smooth(WRIST + 0.13, WRIST + 0.06, y) * Math.sin(a * 4 + y * 90);   // bunching above the cuff
          return d;
        }
      });
      if (S === 'R') mirrorX(sg);
      K.skinned(rig, sg, 'UpperArm_' + S, mat, 'Shirt_Sleeve_' + S, wA);
      // cuff: a band 6 cm deep, snug on the wrist, with a button
      var cst = [{ y: WRIST + 0.0, rx: 0.0300, rz: 0.0350 }, { y: WRIST + 0.003, rx: 0.0322, rz: 0.0372 }, { y: WRIST + 0.058, rx: 0.0336, rz: 0.0386 }, { y: WRIST + 0.062, rx: 0.0322, rz: 0.0372 }];
      var cg = C.loft(cst, { seg: 32, uTiles: tilesFor(ging, 2 * PI * 0.034), vTile: ging.tile });
      if (S === 'R') mirrorX(cg);
      K.skinned(rig, cg, 'UpperArm_' + S, mat, 'Shirt_Cuff_' + S, wA);
      var s = S === 'L' ? 1 : -1, ca = s * 1.9;
      var cb = [{ p: new V3(Math.sin(ca) * 0.0345, WRIST + 0.030, Math.cos(ca) * 0.0398), n: new V3(Math.sin(ca), 0, Math.cos(ca)), r: 0.0048 }];
      K.skinned(rig, buttons(cb, { col: lin('#ece8e4'), holes: 4 }), 'UpperArm_' + S, btn, 'Shirt_CuffButton_' + S, wA);
    });
    return out;
  }
  Wr.buildShirt = buildShirt;

  // ================================================================== cargo shorts: two leg panels that meet at the centre seam (like real trousers),
  // each a loft in its Thigh-local space from the waistband to just above the knee; a waistband ring with loops on top.
  // rows: y (Thigh-local, hip joint = 0), rx, rz, cx, cz.  Waist at about hips-local +0.135 = thigh-local +0.155
  var SHORTS_L = [
    [-0.375, 0.1090, 0.1010, 0.006, 0.004, 2.2], [-0.300, 0.1100, 0.1030, 0.006, 0.004, 2.2], [-0.200, 0.1105, 0.1080, 0.006, 0.004, 2.2], [-0.140, 0.1120, 0.1170, 0.004, 0.003, 2.25],
    [-0.080, 0.1160, 0.1360, -0.004, 0.008, 2.35], [0.000, 0.1210, 0.1500, -0.011, 0.014, 2.5], [0.080, 0.1220, 0.1580, -0.012, 0.020, 2.6], [0.130, 0.1220, 0.1595, -0.012, 0.022, 2.6], [0.158, 0.1210, 0.1590, -0.012, 0.022, 2.6]];
  Wr.SHORTS_L = SHORTS_L;
  function trouserWeights(rig, S) {
    var wl = K.W.leg(rig, S), wt = K.W.torso(rig, { w0: 0.08, w1: 0.26 }), hy = rig.bindP.Hips.y;
    return function (x, y, z) { return K.lerpW(wl(x, y, z), wt(x, y, z), smooth(0.05, 0.13, y - hy)); };
  }
  Wr.trouserWeights = trouserWeights;
  function buildShorts(rig, o) {
    o = o || {};
    var tw = Fab.twill({ color: o.color || '#b8a27b', light: '#cbb893', dark: '#958160', seed: 41, tile: 0.13 });
    var mat = cloth(tw, { name: 'Shorts_Khaki', rough: 0.9 });
    var btn = btnMat('Shorts_Button', 0.35);
    var wT = K.W.torso(rig, { w0: 0.08, w1: 0.26 }), out = { mat: mat };
    var HEM = SHORTS_L[0][0], TOP = SHORTS_L[SHORTS_L.length - 1][0];
    var hipOff = rig.bindP.Thigh_L.y - rig.bindP.Hips.y;     // thigh-local y = hips-local y - hipOff
    ['L', 'R'].forEach(function (S) {
      var s = S === 'L' ? 1 : -1;
      var lst = SHORTS_L.map(function (r) { return { y: r[0], rx: r[1], rz: r[2], cx: r[3], cz: r[4], n: r[5] }; });
      var lsurf = C.surface(lst);
      lst.unshift({ y: HEM + 0.010, rx: 0.101, rz: 0.093, cx: 0.006, cz: 0.004, n: 2.2 });       // turned hem
      var lg = C.loft(lst, {
        seg: 72, uTiles: tilesFor(tw, 2 * PI * 0.12), vTile: tw.tile,
        disp: function (x, y, z, u, i, a) {
          if (i === 0) return 0;
          var d = wrinkles(S === 'L' ? 47 : 53, 0.0034, 16, 1.8)(x, y, z, u, i, a);
          d += 0.0042 * smooth(-0.10, -0.25, y) * Math.sin(a * 3 + y * 25 + 1.5 * C.noise(a, y * 6, 7));                    // long creases down the leg
          d += 0.0030 * g(y, -0.13, 0.04) * Math.sin(a * 5 + 2) * g(a, -1.3, 0.6);                                           // pull lines toward the crotch
          d -= 0.0015 * g(y, 0.150, 0.010);                                                                                   // under the waistband
          return d;
        }
      });
      if (s < 0) mirrorX(lg);
      var wS = trouserWeights(rig, S);
      K.skinned(rig, lg, 'Thigh_' + S, mat, 'Shorts_Leg_' + S, wS);
      var extra = [];
      // front slant pocket opening and back flap pocket (on the panel surface)
      extra.push(pipe(pathPts(lsurf, function (t) { return [mix(0.62, 1.12, t), mix(0.150, 0.030, t)]; }, 12, 0.0012), { r: 0.0017, tile: 0.1, radial: 4 }));
      var bmap = function (sx, t) { return [mix(2.55, 2.95, sx), mix(0.050, 0.105, t)]; };
      extra.push(ribbon(lsurf, bmap, function () { return 0.0028; }, { rows: 4, cols: 6, tile: tw.tile }));
      extra.push(pipe(pathPts(lsurf, function (t) { return [mix(2.55, 2.95, t), 0.048]; }, 8, 0.0035), { r: 0.0020, tile: 0.1, radial: 4 }));
      // cargo pocket: outer thigh, a little forward; patch with bellows + flap
      var a0 = 1.00, a1 = 1.80, y0 = -0.300, y1 = -0.130;
      var cmap = function (sx, t) { var q = rrect(sx, t, 0.18); return [mix(a0, a1, 0.5 + 0.5 * q[0]), mix(y0, y1, 0.5 + 0.5 * q[1])]; };
      var coff = function (sx, t) { return 0.0050 + 0.0065 * Math.sin(PI * sx) * Math.sin(PI * Math.min(1, t * 1.2)) + 0.0010 * C.noise(sx * 4, t * 4, 3); };
      extra.push(ribbon(lsurf, cmap, coff, { rows: 10, cols: 10, tile: tw.tile }));
      var fmap = function (sx, t) { return [mix(a0 - 0.03, a1 + 0.03, sx), mix(y1 - 0.040, y1 + 0.008, t)]; };
      extra.push(ribbon(lsurf, fmap, function (sx, t) { return 0.0125 + 0.0020 * t + 0.0015 * Math.sin(PI * sx); }, { rows: 3, cols: 10, tile: tw.tile }));
      extra.push(pipe(pathPts(lsurf, function (t) { return [mix(a0 - 0.03, a1 + 0.03, t), y1 - 0.040]; }, 10, function (t) { return 0.0125 + 0.0015 * Math.sin(PI * t); }), { r: 0.0022, tile: 0.1, radial: 4 }));
      extra.push(pipe(rimPts(lsurf, cmap, coff, 8), { r: 0.0018, closed: true, tile: 0.1, radial: 4 }));
      // fly (left panel only): a J-shaped seam just off the centre front
      if (s > 0) {
        var xc = -rig.bindP.Thigh_L.x;     // the body centre line in this panel's local x
        extra.push(pipe(pathPts(lsurf, function (t) { var y = mix(0.150, -0.050, t), x = xc + 0.032 - 0.026 * smooth(0.55, 1.0, t); return [psiForX(lsurf, x, y), y]; }, 16, 0.0012), { r: 0.0016, tile: 0.1, radial: 4 }));
      }
      var eg = merge(extra); if (s < 0) mirrorX(eg);
      K.skinned(rig, eg, 'Thigh_' + S, mat, 'Shorts_Details_' + S, wS);
      var bf = lsurf.frame((a0 + a1) / 2, y1 - 0.028);
      var cbt = buttons([{ p: bf.p.clone().addScaledVector(bf.n, 0.0155), n: bf.n, r: 0.0065 }], { col: lin('#7c6c54'), holes: 4 });
      if (s < 0) mirrorX(cbt);
      K.skinned(rig, cbt, 'Thigh_' + S, btn, 'Shorts_CargoButton_' + S, wS);
    });
    // waistband ring (Hips-local) over the top of both panels, with belt loops and the button
    var WB = [{ y: 0.098, rx: 0.1870, rz: 0.1590, cz: 0.024, n: 2.3 }, { y: 0.102, rx: 0.1885, rz: 0.1605, cz: 0.024, n: 2.3 }, { y: 0.136, rx: 0.1885, rz: 0.1605, cz: 0.024, n: 2.3 }, { y: 0.140, rx: 0.1855, rz: 0.1575, cz: 0.024, n: 2.3 }];
    K.skinned(rig, C.loft(WB, { seg: 72, uTiles: tilesFor(tw, 2 * PI * 0.17), vTile: tw.tile }), 'Hips', mat, 'Shorts_Waistband', wT);
    var wbs = C.surface([WB[1], WB[2]]), loops = [];
    [-2.75, -1.75, -0.95, 0.95, 1.75, 2.75, PI].forEach(function (a) {
      loops.push(ribbon(wbs, function (sx, t) { return [a + (sx - 0.5) * 0.065, mix(0.095, 0.142, t)]; }, function (sx, t) { return 0.0030 + 0.0015 * Math.sin(t * PI); }, { rows: 4, cols: 2, tile: tw.tile }));
    });
    K.skinned(rig, merge(loops), 'Hips', mat, 'Shorts_BeltLoops', wT);
    var bfr = wbs.frame(0.06, 0.119);
    K.skinned(rig, buttons([{ p: bfr.p.clone().addScaledVector(bfr.n, 0.003), n: bfr.n, r: 0.0080 }], { col: lin('#7c6c54'), holes: 4, h: 0.45 }), 'Hips', btn, 'Shorts_Button', wT);
    return out;
  }
  Wr.buildShorts = buildShorts;

  // ================================================================== outfits
  Wr.kit.makeGrid = makeGrid; Wr.neckDrop = neckDrop; Wr.WRIST = WRIST;
  Wr.OUTFITS = { everyday: 'Everyday', tweed: 'Tweed Jacket', cardigan: 'Cardigan' };
  Wr.build = function (id, rig, bodyMats) {
    var res = { id: id, meshes: [] }, before = rig.root.children.slice();
    if (id === 'everyday' || !Wr.OUTFITS[id]) { res.shirt = buildShirt(rig); res.shorts = buildShorts(rig); }
    else if (id === 'tweed') { res.shirt = buildShirt(rig, { under: true }); res.shorts = buildShorts(rig); if (Wr.buildTweed) res.extra = Wr.buildTweed(rig); }
    else if (id === 'cardigan') { res.shirt = buildShirt(rig, { under: true }); if (Wr.buildCardigan) res.extra = Wr.buildCardigan(rig); }
    rig.root.children.forEach(function (c) { if (before.indexOf(c) < 0) res.meshes.push(c); });
    return res;
  };
})(typeof window !== 'undefined' ? window : globalThis);

;