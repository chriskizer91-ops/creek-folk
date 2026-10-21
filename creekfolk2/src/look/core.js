/* Shared tools for the Philosopher King: noise, canvas painting, lofted meshes, tapered tubes.
   Everything is plain three.js r128 data so it exports to GLB. */
// R186: ported to three.js r186 for Creekfolk 2 (see creekfolk2/docs/R186-PORT.md); every change is marked R186.
(function (global) {
  'use strict';
  var THREE = global.THREE;
  var C = {};
  global.PKCore = C;

  // ------------------------------------------------------------------ small math
  C.clamp = function (x, a, b) { return x < a ? a : (x > b ? b : x); };
  C.mix = function (a, b, t) { return a + (b - a) * t; };
  C.smooth = function (e0, e1, x) { var t = C.clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  // R186: r128 had no colour management, so Color(hex) held the raw sRGB numbers and this turned them into linear ones. r186 turns
  // hex into linear itself when ColorManagement is on (its default), which made this convert twice (colours far too dark). Reading
  // the hex as raw numbers first (as LinearSRGBColorSpace, so nothing is converted) gives linear(hex) whether management is on or off.
  C.col = function (hex) { var c = new THREE.Color(); if (typeof hex === 'number') c.setHex(hex, THREE.LinearSRGBColorSpace); else c.setStyle(hex, THREE.LinearSRGBColorSpace); return c.convertSRGBToLinear(); };
  C.rng = function (a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  C.hex2rgb = function (hex) {
    var n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  C.rgb2hex = function (r, g, b) {
    function h(v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }
    return '#' + h(r) + h(g) + h(b);
  };

  // ------------------------------------------------------------------ noise
  function hash(ix, iy, s) {
    var h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(s | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  C.noise = function (x, y, s) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    var a = hash(ix, iy, s), b = hash(ix + 1, iy, s), c = hash(ix, iy + 1, s), d = hash(ix + 1, iy + 1, s);
    var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  };
  C.fbm = function (x, y, s, oct) {
    var v = 0, amp = 0.5, f = 1, norm = 0;
    for (var i = 0; i < (oct || 4); i++) { v += amp * C.noise(x * f, y * f, s + i * 17); norm += amp; f *= 2; amp *= 0.5; }
    return v / norm;
  };
  // periodic (tileable) value noise; px, py are integer periods in noise cells
  function hashP(ix, iy, px, py, s) { return hash(((ix % px) + px) % px, ((iy % py) + py) % py, s); }
  C.noiseP = function (x, y, px, py, s) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    var a = hashP(ix, iy, px, py, s), b = hashP(ix + 1, iy, px, py, s), c = hashP(ix, iy + 1, px, py, s), d = hashP(ix + 1, iy + 1, px, py, s);
    var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  };
  C.fbmP = function (x, y, px, py, s, oct) {
    var v = 0, amp = 0.5, f = 1, norm = 0;
    for (var i = 0; i < (oct || 4); i++) { v += amp * C.noiseP(x * f, y * f, px * f, py * f, s + i * 17); norm += amp; f *= 2; amp *= 0.5; }
    return v / norm;
  };

  // ------------------------------------------------------------------ canvas / textures
  C.canvas = function (w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  C.tex = function (canvas, o) {
    o = o || {};
    var t = new THREE.CanvasTexture(canvas);
    if (!o.linear) t.colorSpace = THREE.SRGBColorSpace;   // R186: .encoding = sRGBEncoding became .colorSpace = SRGBColorSpace (r152)
    t.anisotropy = 4;
    if (o.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    // R186: no RGBFormat here any more: r186 only decodes sRGB textures stored as RGBA (an RGB one is sampled undecoded, with a
    // warning). The canvases painted for these textures are opaque, so RGBA samples the same; o.png only mattered to the exporter.
    // if (!o.png) t.format = THREE.RGBFormat;   // opaque: the glTF exporter then writes JPEG instead of PNG
    return t;
  };
  // grey height canvas -> tangent-space normal map canvas
  C.normalFromHeight = function (hc, strength) {
    var w = hc.width, h = hc.height, src = hc.getContext('2d').getImageData(0, 0, w, h).data;
    var out = C.canvas(w, h), ctx = out.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
    function H(x, y) { x = (x + w) % w; y = (y + h) % h; return src[(y * w + x) * 4] / 255; }
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var dx = (H(x + 1, y) - H(x - 1, y)) * strength, dy = (H(x, y + 1) - H(x, y - 1)) * strength;
      var nx = -dx, ny = dy, nz = 1, l = Math.sqrt(nx * nx + ny * ny + nz * nz);
      var k = (y * w + x) * 4;
      d[k] = (nx / l * 0.5 + 0.5) * 255; d[k + 1] = (ny / l * 0.5 + 0.5) * 255; d[k + 2] = (nz / l * 0.5 + 0.5) * 255; d[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0); return out;
  };

  // ------------------------------------------------------------------ grid meshes
  // P: Float32Array of nR*nC*3 (row-major). Returns {normals, flip}
  C.gridNormals = function (P, nR, nC, wrapC, poleUp) {
    var N = new Float32Array(P.length), a = new THREE.Vector3(), b = new THREE.Vector3(), n = new THREE.Vector3();
    var p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), i, j;
    function get(r, c, out) { var k = (r * nC + c) * 3; return out.set(P[k], P[k + 1], P[k + 2]); }
    for (i = 0; i < nR; i++) for (j = 0; j < nC; j++) {
      var jn = j + 1, jp = j - 1;
      if (wrapC) { if (jn >= nC) jn = 1; if (jp < 0) jp = nC - 2; } else { jn = Math.min(jn, nC - 1); jp = Math.max(jp, 0); }
      a.subVectors(get(i, jn, p1), get(i, jp, p0));
      var rn = Math.min(i + 1, nR - 1), rp = Math.max(i - 1, 0);
      b.subVectors(get(rn, j, p1), get(rp, j, p0));
      n.crossVectors(a, b);
      var l = n.length(), k = (i * nC + j) * 3;
      if (l < 1e-12) { // pole or collapsed ring
        var up = (i < nR / 2) ? -1 : 1; n.set(0, poleUp ? up : 0, 0); if (!poleUp) n.set(0, 1, 0); l = 1;
      }
      N[k] = n.x / l; N[k + 1] = n.y / l; N[k + 2] = n.z / l;
    }
    // decide orientation: normals should point away from the centroid
    var cx = 0, cy = 0, cz = 0, cnt = P.length / 3, s = 0;
    for (i = 0; i < P.length; i += 3) { cx += P[i]; cy += P[i + 1]; cz += P[i + 2]; }
    cx /= cnt; cy /= cnt; cz /= cnt;
    for (i = 0; i < P.length; i += 3) s += N[i] * (P[i] - cx) + N[i + 1] * (P[i + 1] - cy) + N[i + 2] * (P[i + 2] - cz);
    var flip = s < 0;
    if (flip) for (i = 0; i < N.length; i++) N[i] = -N[i];
    return { normals: N, flip: flip };
  };
  C.gridIndices = function (nR, nC, flip) {
    var idx = [];
    for (var i = 0; i < nR - 1; i++) for (var j = 0; j < nC - 1; j++) {
      var a = i * nC + j, b = i * nC + j + 1, c = (i + 1) * nC + j + 1, d = (i + 1) * nC + j;
      if (!flip) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c);
    }
    return idx;
  };
  C.gridGeometry = function (P, UV, nR, nC, wrapC, colors) {
    var gn = C.gridNormals(P, nR, nC, wrapC, true);
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(P, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(gn.normals, 3));
    if (UV) g.setAttribute('uv', new THREE.BufferAttribute(UV, 2));
    if (colors) g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setIndex(C.gridIndices(nR, nC, gn.flip));
    return g;
  };

  // ------------------------------------------------------------------ loft
  // stations: [{y, rx, rz, cx, cz, n (superellipse exponent), rot}]  front is +Z, seam at the back
  function stationPos(s, psi, out) {
    var n = s.n === undefined ? 2 : s.n, e = 2 / n, cs = Math.cos(psi), sn = Math.sin(psi);
    var x = s.rx * Math.sign(sn) * Math.pow(Math.abs(sn), e);
    var z = s.rz * Math.sign(cs) * Math.pow(Math.abs(cs), e);
    var r = s.rot || 0;
    if (r) { var x2 = x * Math.cos(r) + z * Math.sin(r), z2 = -x * Math.sin(r) + z * Math.cos(r); x = x2; z = z2; }
    return out.set(x + (s.cx || 0), s.y, z + (s.cz || 0));
  }
  C.loft = function (st, o) {
    o = o || {};
    var seg = o.seg || 28, S = st.map(function (s) { return Object.assign({ cx: 0, cz: 0, n: 2, rot: 0 }, s); });
    function cap(end) {
      var h = end.h, steps = end.steps || 4, first = end.first;
      var base = first ? S[0] : S[S.length - 1], prev = first ? S[1] : S[S.length - 2];
      var dir = Math.sign(base.y - prev.y) || 1, add = [];
      for (var k = 1; k <= steps; k++) {
        var a = k / steps * Math.PI / 2, f = Math.max(0.015, Math.cos(a));
        add.push(Object.assign({}, base, { y: base.y + dir * h * Math.sin(a), rx: base.rx * f, rz: base.rz * f }));
      }
      if (first) S = add.reverse().concat(S); else S = S.concat(add);
    }
    if (o.capA) cap({ h: o.capA.h || o.capA, steps: o.capA.steps, first: true });
    if (o.capB) cap({ h: o.capB.h || o.capB, steps: o.capB.steps, first: false });
    var nR = S.length, nC = seg + 1, P = new Float32Array(nR * nC * 3), UV = new Float32Array(nR * nC * 2), v3 = new THREE.Vector3();
    var vAcc = [0], i, j;
    for (i = 1; i < nR; i++) vAcc.push(vAcc[i - 1] + Math.hypot(S[i].y - S[i - 1].y, S[i].cx - S[i - 1].cx, S[i].cz - S[i - 1].cz));
    var uT = o.uTiles || 1, vT = o.vTile || 1, gapFn = o.gap === undefined ? null : (typeof o.gap === 'function' ? o.gap : function () { return o.gap; });
    for (i = 0; i < nR; i++) {
      var gp = gapFn ? Math.max(0, gapFn(S[i].y, i)) : 0;
      for (j = 0; j < nC; j++) {
        var psi = gapFn ? gp + (2 * Math.PI - 2 * gp) * j / seg : Math.PI + j / seg * 2 * Math.PI;
        stationPos(S[i], psi, v3);
        var aa = psi > Math.PI ? psi - 2 * Math.PI : psi;   // angle from the front, + toward +X
        if (o.disp) {   // radial displacement: disp(x, y, z, u, rowIndex, a, station)
          var dd = o.disp(v3.x, v3.y, v3.z, j / seg, i, aa, S[i]);
          if (dd) { var qx = v3.x - S[i].cx, qz = v3.z - S[i].cz, ql = Math.hypot(qx, qz) || 1; v3.x += qx / ql * dd; v3.z += qz / ql * dd; }
        }
        if (o.dy) v3.y += o.dy(v3.x, v3.y, v3.z, j / seg, i, aa) || 0;
        var k = (i * nC + j);
        P[k * 3] = v3.x; P[k * 3 + 1] = v3.y; P[k * 3 + 2] = v3.z;
        UV[k * 2] = j / seg * uT; UV[k * 2 + 1] = (vAcc[i] + (o.vOff || 0)) / vT;
      }
    }
    var colors = null;
    if (o.colorFn) {
      colors = new Float32Array(nR * nC * 3);
      for (i = 0; i < nR; i++) for (j = 0; j < nC; j++) {
        var k2 = i * nC + j, c = o.colorFn(i, j / seg, P[k2 * 3], P[k2 * 3 + 1], P[k2 * 3 + 2]);
        colors[k2 * 3] = c[0]; colors[k2 * 3 + 1] = c[1]; colors[k2 * 3 + 2] = c[2];
      }
    }
    var g = C.gridGeometry(P, UV, nR, nC, !gapFn, colors);
    g.userData.stations = S;
    return g;
  };
  // point + normal on a lofted surface at angle psi (0 = front, + toward +X) and height y
  C.surface = function (stations) {
    var S = stations.map(function (s) { return Object.assign({ cx: 0, cz: 0, n: 2, rot: 0 }, s); });
    function at(psi, y, out) {
      var i = 0, n = S.length;
      var asc = S[n - 1].y > S[0].y;
      for (i = 0; i < n - 2; i++) { var a = S[i].y, b = S[i + 1].y; if ((asc && y <= b) || (!asc && y >= b)) break; }
      var s0 = S[i], s1 = S[i + 1], t = (y - s0.y) / (s1.y - s0.y); t = C.clamp(t, 0, 1);
      var m = {};
      ['rx', 'rz', 'cx', 'cz', 'n', 'rot'].forEach(function (k) { m[k] = s0[k] + (s1[k] - s0[k]) * t; });
      m.y = y; return stationPos(m, psi, out);
    }
    function frame(psi, y) {
      var p = at(psi, y, new THREE.Vector3()), e = 0.004;
      var pa = at(psi + 0.02, y, new THREE.Vector3()), pb = at(psi, y + e, new THREE.Vector3());
      var n = new THREE.Vector3().crossVectors(pb.clone().sub(p), pa.clone().sub(p)).normalize();
      // outward check against the axis
      var c = new THREE.Vector3(0, y, 0); if (n.dot(p.clone().sub(c)) < 0) n.negate();
      return { p: p, n: n };
    }
    return { at: function (psi, y) { return at(psi, y, new THREE.Vector3()); }, frame: frame };
  };

  // ------------------------------------------------------------------ accumulating tapered tubes (hair, fingers, cords)
  function Acc() { this.P = []; this.N = []; this.C = []; this.I = []; this.count = 0; }
  C.Acc = Acc;
  // pts: array of Vector3 control points; rFn(t) radius; colorFn(t) -> [r,g,b] linear
  Acc.prototype.tube = function (pts, segs, radial, rFn, colorFn, flat) {
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    var P = curve.getPoints(segs), n = P.length, T = [], i, j;
    for (i = 0; i < n; i++) {
      var a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
      T.push(new THREE.Vector3().subVectors(b, a).normalize());
    }
    var ref = Math.abs(T[0].y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    var N0 = new THREE.Vector3().crossVectors(T[0], ref).normalize(), N = N0.clone(), B = new THREE.Vector3();
    var base = this.count;
    for (i = 0; i < n; i++) {
      N.sub(T[i].clone().multiplyScalar(N.dot(T[i]))).normalize(); B.crossVectors(T[i], N).normalize();
      var t = i / (n - 1), r = rFn(t), col = colorFn ? colorFn(t) : [1, 1, 1];
      for (j = 0; j < radial; j++) {
        var ang = j / radial * Math.PI * 2, ca = Math.cos(ang), sa = Math.sin(ang);
        var nx = N.x * ca + B.x * sa * (flat || 1), ny = N.y * ca + B.y * sa * (flat || 1), nz = N.z * ca + B.z * sa * (flat || 1);
        var rr = r;
        this.P.push(P[i].x + N.x * ca * rr + B.x * sa * rr * (flat || 1), P[i].y + N.y * ca * rr + B.y * sa * rr * (flat || 1), P[i].z + N.z * ca * rr + B.z * sa * rr * (flat || 1));
        var l = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        this.N.push(nx / l, ny / l, nz / l); this.C.push(col[0], col[1], col[2]);
      }
    }
    for (i = 0; i < n - 1; i++) for (j = 0; j < radial; j++) {
      var j2 = (j + 1) % radial;
      var a0 = base + i * radial + j, a1 = base + i * radial + j2, b0 = base + (i + 1) * radial + j, b1 = base + (i + 1) * radial + j2;
      this.I.push(a0, a1, b0, a1, b1, b0);
    }
    this.count += n * radial;
  };
  Acc.prototype.geometry = function () {
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.P, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.N, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.C, 3));
    g.setIndex(this.I);
    return g;
  };
})(typeof window !== 'undefined' ? window : globalThis);

;