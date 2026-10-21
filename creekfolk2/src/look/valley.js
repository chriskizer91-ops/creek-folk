/* PKValley: the creek valley of "What the Water Brings", drawn for the pixel renderer (PKPixel3D).
   A North Texas creek valley about 220 x 150 m:
     King's Creek      the main creek, always flowing west to east; low, normal, high and flood levels
     Dry Fork          a white limestone bed coming down from the bluff over the Dry Falls; dry most days, a torrent in a storm
     Teal Branch       spring-fed, clear and cold, out of a grotto under the south hill; runs even in a drought
     the stock pond    still water behind an earth dam, with a windmill and a stock tank
     the bluff         a limestone escarpment along the north side, with a shallow cave and a lookout reached by a switchback
     the county road   a gravel road with a low-water crossing (it floods); the old railroad on an embankment with a trestle
     the studio        a board shed with his truck at the trailhead, at the west end
   The ground is one height function; the area round him is built in 32 m tiles at the chosen detail (streamed as he walks),
   and the whole valley is always there as a light far version, so a low view still sees the land to the horizon.

     const W = PKValley.create({ detail: 4 });   scene.add(W.group);
     W.ensure(x, z)        build the tiles round a spot now (start, teleport)
     W.stream(x, z, ms)    build / drop tiles as he walks (call each frame with a time budget)
     W.height(x, z, feet)  ground (or deck / stone / log) under a point;  W.water(x, z) water surface or null;  W.wading(x, z, feet)
     W.fast(x, z)          true where the water is running too hard to wade (a flood, or the Dry Fork in a storm)
     W.collide(p, r)       pushes a {x, z} point out of trunks, rocks, posts, rails and walls
     W.setFlow(id, state)  'main': low | normal | high | flood;  'dry': dry | pools | running;  'teal' / 'pond': normal | high
     W.update(t, dt, focus) ripples, rings, levels, the windmill and the swing
   Units are metres; x runs east, z runs south. */
// R186: ported to three.js r186 for Creekfolk 2 (see creekfolk2/docs/R186-PORT.md); every change is marked R186.
(function (global) {
  'use strict';
  var THREE = global.THREE;
  var V = {};
  global.PKValley = V;

  // ------------------------------------------------------------------ paints (shadow, mid, light)
  var PAINT = {
    grass: ['#557f48', '#6e9c5b', '#8fb86f'], grassL: ['#6e9c5b', '#8fb86f', '#a3c47e'], grassD: ['#3f6b3f', '#4f7f4a', '#5f9255'],
    path: ['#8f7650', '#b59a6d', '#cfb889'], clay: ['#6b4a33', '#8f6a48', '#a8845c'], gravel: ['#9a8a70', '#bfae8c', '#d9cba8'], bed: ['#3f5a5a', '#4a6a6a', '#5a7a78'],
    lime: ['#9b968a', '#c2bcae', '#dedad0'], limeD: ['#86806f', '#a8a290', '#c4bea8'], limeBed: ['#b4ae9e', '#d4cebe', '#ece8dc'], shale: ['#3e4448', '#565e62', '#727a7a'],
    rock: ['#5f625f', '#8d8f8a', '#b2b3ab'],
    water: ['#3f6f8a', '#5d93ad', '#86b6c6'], waterC: ['#3f8a92', '#62aab2', '#94d0d2'], pond: ['#465f4a', '#5c7c5e', '#7c9c7a'], mud: ['#6a5238', '#8a6c48', '#a8895f'],
    ripple: ['#9ccbd8', '#d4e9ec', '#d4e9ec'], foam: ['#d4e9ec', '#eef6f6', '#eef6f6'],
    trunk: ['#4a3828', '#6b4a33', '#8f7650'], syc: ['#a59f92', '#cfc9bc', '#ece8de'], char: ['#242020', '#342e2a', '#463e36'],
    oak: ['#2f5233', '#3f6b3f', '#4f7f4a'], oak2: ['#3f6b3f', '#4f7f4a', '#5f9255'], elm: ['#47703f', '#5f9255', '#8fb86f'], cedar: ['#24402f', '#2f5a3e', '#3f7050'],
    pecan: ['#3a5a35', '#4f7444', '#6a8e52'], gold: ['#a8642a', '#d08a36', '#e8b050'], vine: ['#3f6b3f', '#5f9255', '#7fae63'],
    reed: ['#47703f', '#6e9c5b', '#8fb86f'], cattail: ['#4a3828', '#6b4a33', '#6b4a33'],
    fblue: ['#3d63b8', '#6f8fd8', '#6f8fd8'], fred: ['#b2361f', '#d2402f', '#ea7a2a'], fyel: ['#c08f3e', '#efc067', '#fde4a2'],
    wood: ['#6a4c34', '#8d6646', '#a8836a'], post: ['#5a5048', '#7d7268', '#9e9488'], wire: ['#4a4744', '#4a4744', '#6a6662'], rope: ['#9a8a70', '#bfae8c', '#d9cba8'],
    page: ['#cdbf9e', '#f3e9d2', '#fffaf0'], ink: ['#3b2f22', '#3b2f22', '#3b2f22'], glint: ['#efc067', '#fff6d0', '#fff6d0'],
    pathE: ['#6e7a4a', '#8f9a5e', '#aab47a'], litter: ['#6e6a3a', '#8c8448', '#a8a05e'], bush: ['#2f5233', '#47703f', '#5f9255'],
    leafR: ['#7e3f1c', '#a55727', '#c87038'], fern: ['#2f5233', '#3f6b3f', '#5f9255'], maiden: ['#3f7a3f', '#5f9a4f', '#8fc06f'], moss: ['#3a5a30', '#4f7a3e', '#6a9a4e'],
    mush: ['#bfae8c', '#d9cba8', '#efe6cc'], stem: ['#cdbf9e', '#efe6cc', '#fffaf0'],
    road: ['#857a66', '#a89c84', '#c6ba9c'], ballast: ['#625e5a', '#85807a', '#a6a09a'], concrete: ['#8a8882', '#acaaa2', '#cac8c0'],
    steel: ['#45403c', '#625a54', '#827870'], rust: ['#6a3a20', '#8f5530', '#b07040'], tie: ['#45362a', '#5a4636', '#725c48'],
    board: ['#6e5a48', '#927a60', '#b29a7a'], tin: ['#727a80', '#969ea4', '#b8bec2'], truck: ['#3a566a', '#55748a', '#7896aa'], tire: ['#262422', '#363230', '#46423e'],
    glassD: ['#3e4e58', '#5e7280', '#8aa2aa'], sign: ['#b8901c', '#e2b830', '#f4d868'], signK: ['#262422', '#262422', '#363230'], red: ['#8a2a20', '#b2361f', '#d2402f'],
    white: ['#cfcbc2', '#eceae4', '#fbf9f4'], earth: ['#3a2c20', '#3a2c20', '#3a2c20'], windm: ['#6e7274', '#94989a', '#bcc0c2'], lamp: ['#ffd27a', '#fff0b0', '#fffbe0'], star: ['#fff6d0', '#fff6d0', '#fff6d0']
  };
  var used = {}, mats = {}, EARTH = null;
  function note(hex) { used[hex] = 1; }
  // o.flat: faceted; o.cut: canopy see-through hole; o.side: double sided; o.soft: no ink outline (alpha 0.5); o.glow: lit at night (alpha 0.25)
  // o.sway: leans in the wind (the geometry carries a 'sway' attribute); o.water: the moving water surface (see PKToon.rampMat)
  var VARY = { grass: 0.12, grassL: 0.11, grassD: 0.11, path: 0.08, pathE: 0.1, litter: 0.12, clay: 0.07, gravel: 0.08, bed: 0.08, lime: 0.05, limeBed: 0.06, moss: 0.1, road: 0.05, shale: 0.05 };
  var FOAM = { water: '#eef6f6', waterC: '#eef6f6', pond: '#b4ccb0', mud: '#d9cba8' };
  var REFL = { water: '#a9ccd8', waterC: '#acdad8', pond: '#a2c2c4', mud: '#9caaa8' };   // the pale streaks on water are the sky in it
  function paint(key, o) {
    var id = key + (o && o.flat ? ':f' : '') + (o && o.cut ? ':c' : '') + (o && o.side ? ':d' : '') + (o && o.soft ? ':s' : '') + (o && o.glow ? ':g' : '') + (o && o.earth ? ':e' : '') + (o && o.sway ? ':w' : '') + (o && o.water ? ':a' : '');
    if (mats[id]) return mats[id];
    var t = PAINT[key]; if (!t) throw new Error('no paint ' + key); t.forEach(note);
    if (!EARTH) { EARTH = global.PKCore.col('#3a2c20'); note('#3a2c20'); }   // R186: was Color(hex).convertSRGBToLinear(), which converts twice under r186's colour management (see PKCore.col)
    var wat = !!(o && o.water);
    if (wat) { note(FOAM[key] || '#eef6f6'); note('#fff6d0'); if (REFL[key]) { t = [t[0], t[1], REFL[key]]; note(REFL[key]); } }
    var m = global.PKToon.rampMat(t[0], t[1], t[2], { flat: o && o.flat, side: o && o.side ? THREE.DoubleSide : undefined, sway: !!(o && o.sway), vary: o && o.earth ? VARY[key] || 0 : 0,
      water: wat, foam: FOAM[key] || '#eef6f6', spark: '#fff6d0' });
    if (o && o.soft) m.opacity = 0.5;      // the pixel pass draws no ink outline round it (alpha marks it; nothing is blended)
    if (o && o.glow) m.opacity = 0.25;     // no outline, and night does not darken it (lit windows, the lantern, stars)
    if (o && o.cut) cutout(m);
    if (o && o.earth) {
      // the ground is cut open near the camera in low and close views: what shows inside is dark earth, like a diorama
      m.side = THREE.DoubleSide; var base0 = m.onBeforeCompile;
      m.onBeforeCompile = function (sh) { base0(sh); sh.uniforms.uEarth = { value: EARTH }; sh.fragmentShader = 'uniform vec3 uEarth;\n' + sh.fragmentShader.replace('gl_FragColor = vec4( tone, diffuseColor.a );', 'gl_FragColor = gl_FrontFacing ? vec4( tone, diffuseColor.a ) : vec4( uEarth, 0.6 );'); };
      m.customProgramCacheKey = function () { return 'valley-earth'; };
    }
    m.name = 'Valley_' + id; mats[id] = m; return m;
  }
  V.paint = paint; V.PAINT = PAINT; V.note = note;
  V.palette = function () { for (var k in PAINT) PAINT[k].forEach(note); return Object.keys(used); };

  // canopies and the cave roof open a round hole round him when they stand between him and the camera (screen space)
  var CUT = { p: { value: new THREE.Vector2(9, 9) }, z: { value: 0 }, r: { value: 0.0 }, res: { value: new THREE.Vector2(1, 1) }, a: { value: 1 } };
  V.CUT = CUT;
  function cutout(m) {
    var base = m.onBeforeCompile;
    m.onBeforeCompile = function (sh) {
      base(sh);
      sh.uniforms.uCutP = CUT.p; sh.uniforms.uCutZ = CUT.z; sh.uniforms.uCutR = CUT.r; sh.uniforms.uCutRes = CUT.res; sh.uniforms.uCutA = CUT.a;
      sh.fragmentShader = 'uniform vec2 uCutP; uniform float uCutZ; uniform float uCutR; uniform vec2 uCutRes; uniform float uCutA;\n' +
        sh.fragmentShader.replace('void main() {', 'void main() {\n  vec2 cutN = gl_FragCoord.xy / uCutRes * 2.0 - 1.0;\n  if (gl_FragCoord.z < uCutZ && length((cutN - uCutP) * vec2(uCutA, 1.0)) < uCutR) discard;');
    };
    var key0 = m.customProgramCacheKey.call(m); m.customProgramCacheKey = function () { return key0 + '|valley-cut'; };
  }

  // ------------------------------------------------------------------ small helpers
  function rnd(seed) { seed = seed >>> 0; return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function sst(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hash2(x, z) { var h = (x * 374761393 + z * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return (h ^ (h >>> 16)) >>> 0; }
  V.rnd = rnd;
  var _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new THREE.Vector3(), _p = new THREE.Vector3();
  function bake(geo, x, y, z, rx, ry, rz, sx, sy, sz) {
    var g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (g.attributes.uv) g.deleteAttribute('uv');
    _e.set(rx || 0, ry || 0, rz || 0); _q.setFromEuler(_e); _s.set(sx == null ? 1 : sx, sy == null ? (sx == null ? 1 : sx) : sy, sz == null ? (sx == null ? 1 : sx) : sz); _p.set(x, y, z);
    _m4.compose(_p, _q, _s); g.applyMatrix4(_m4);
    return g;
  }
  function rbox(w, h, d, rf, n) {
    var g = new THREE.BoxGeometry(1, 1, 1, n || 2, n || 2, n || 2), P = g.attributes.position, r = Math.min(w, h, d) * (rf || 0.3);
    var ix = w / 2 - r, iy = h / 2 - r, iz = d / 2 - r;
    for (var i = 0; i < P.count; i++) {
      var x = P.getX(i) * w, y = P.getY(i) * h, z = P.getZ(i) * d, cx = clamp(x, -ix, ix), cy = clamp(y, -iy, iy), cz2 = clamp(z, -iz, iz);
      var dx = x - cx, dy = y - cy, dz = z - cz2, l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1; P.setXYZ(i, cx + dx / l * r, cy + dy / l * r, cz2 + dz / l * r);
    }
    g.computeVertexNormals(); return g;
  }
  // a rough block of rock: a rounded box with its surface pushed in and out
  function rough(w, h, d, amp, n) {
    var g = rbox(w, h, d, 0.18, n || 5), P = g.attributes.position, N = g.attributes.normal;
    for (var i = 0; i < P.count; i++) {
      var x = P.getX(i), y = P.getY(i), z = P.getZ(i), f = amp * (Math.sin(x * 2.3 + y * 1.7) * Math.cos(z * 2.1 - y * 0.9) + 0.5 * Math.sin(x * 5.1 + z * 4.3 + y * 3.7));
      P.setXYZ(i, x + N.getX(i) * f, y + N.getY(i) * f * 0.5, z + N.getZ(i) * f);
    }
    g.computeVertexNormals(); return g;
  }
  // sway (optional): each piece leans from its own foot: 0 at its lowest point, 1 at its top (s0 at the foot for canopies, which move as a whole)
  function merge(list, sway, s0) {
    var n = 0; list.forEach(function (g) { n += g.attributes.position.count; });
    var pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), sw = sway ? new Float32Array(n) : null, o = 0;
    list.forEach(function (g) {
      var a = g.attributes.position.array, c = g.attributes.position.count;
      pos.set(a, o * 3); if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
      if (sw) { var y0 = 1e9, y1 = -1e9, i; for (i = 0; i < c; i++) { var y = a[i * 3 + 1]; if (y < y0) y0 = y; if (y > y1) y1 = y; } var hh = Math.max(0.01, y1 - y0); for (i = 0; i < c; i++) sw[o + i] = (s0 || 0) + (1 - (s0 || 0)) * (a[i * 3 + 1] - y0) / hh; }
      o += c; g.dispose();
    });
    var out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    if (sw) out.setAttribute('sway', new THREE.BufferAttribute(sw, 1));
    out.computeBoundingSphere(); return out;
  }
  // what leans in the wind: leaves move as a mass (canopies), small plants from the root
  var SWAYK = { oak: 0.45, oak2: 0.3, elm: 0.45, pecan: 0.45, gold: 0.45, cedar: 0.2, bush: 0.3, vine: 0.2 };
  function Batch() { this.parts = {}; }
  Batch.prototype.add = function (key, g) { (this.parts[key] = this.parts[key] || []).push(g); };
  Batch.prototype.buildSome = function (grp, opt, max) {
    var keys = Object.keys(this.parts), n = 0;
    for (var q = 0; q < keys.length && n < max; q++, n++) {
      var key = keys[q], k = key.split('|'), sw = SWAYK[k[0]], m = new THREE.Mesh(merge(this.parts[key], sw != null, sw), paint(k[0], { flat: k[1] === 'f', cut: k[2] === 'c', sway: sw != null }));
      m.castShadow = !(opt && opt.noShadow); m.receiveShadow = true; m.name = 'Batch_' + key; grp.add(m); delete this.parts[key];
    }
    return Object.keys(this.parts).length === 0;
  };
  Batch.prototype.build = function (grp, opt) {
    for (var key in this.parts) {
      var k = key.split('|'), sw = SWAYK[k[0]], m = new THREE.Mesh(merge(this.parts[key], sw != null, sw), paint(k[0], { flat: k[1] === 'f', cut: k[2] === 'c', sway: sw != null }));
      m.castShadow = !(opt && opt.noShadow); m.receiveShadow = true; m.name = 'Batch_' + key; grp.add(m);
    }
    this.parts = {};
  };
  function lumpy(g, amp, RN) {
    var P = g.attributes.position, a = RN() * 6, b = RN() * 6, c = RN() * 6;
    for (var q = 0; q < P.count; q++) {
      var x = P.getX(q), y = P.getY(q), z = P.getZ(q), l = Math.sqrt(x * x + y * y + z * z) || 1, nx = x / l, ny = y / l, nz = z / l;
      var f = 1 + amp * (1.6 * Math.sin(3.1 * nx + a) * Math.sin(2.7 * ny + b) * Math.sin(3.3 * nz + c) + 0.35 * Math.sin(7.3 * nx + 5.1 * nz + a + b));
      P.setXYZ(q, x * f, y * f, z * f);
    }
    g.computeVertexNormals(); return g;
  }
  function segDist(px, pz, ax, az, bx, bz) { var vx = bx - ax, vz = bz - az, L2 = vx * vx + vz * vz || 1, t = clamp(((px - ax) * vx + (pz - az) * vz) / L2, 0, 1), qx = ax + vx * t - px, qz = az + vz * t - pz; return Math.sqrt(qx * qx + qz * qz); }

  // ------------------------------------------------------------------ the map
  var X0 = -112, X1 = 112, Z0 = -80, Z1 = 80, TILE = 32, NTX = 7, NTZ = 5;
  var BOUND = { x0: -107, x1: 107, z0: -75, z1: 75 };
  // the channels, upstream first
  var MAIN = [[-118, -4], [-106, -1], [-95, -6], [-84, -3], [-72, -9], [-60, -5], [-50, -11], [-40, -8], [-30, -3], [-20, -6], [-10, -2], [0, -4], [12, 1], [24, -2], [36, 2], [48, 7], [58, 3], [68, 4], [80, 10], [92, 8], [104, 13], [118, 10]];
  var DRY = [[-12, -84], [-15, -70], [-12, -60], [-15, -52], [-15.5, -46], [-16, -40], [-14, -33], [-16, -25], [-14, -16], [-17, -5.2]];
  var TEAL = [[30.8, 58.7], [35.6, 58.4], [39.6, 54.6], [38.8, 47], [36.4, 40], [38, 31], [35, 22], [37, 13], [37.5, 3.2]];
  // the bluff: the plateau lies north of this face line (the Dry Fork gorge and the cave are notches cut into it)
  var FACE = [[-130, -52], [-100, -50], [-80, -46], [-60, -40], [-42, -34], [-28, -30], [-21, -31], [-19.6, -40], [-18.2, -45.6], [-12.8, -45.6], [-11.4, -40], [-10, -31],
    [0, -27], [8.5, -26.4], [9.6, -29.4], [14.4, -29.4], [15.5, -26.4], [28, -25.6], [40, -28], [52, -30.5], [64, -36], [76, -42], [88, -52], [100, -66], [112, -76], [130, -96]];
  var PLATEAU = FACE.concat([[130, -140], [-130, -140]]);
  // the south hill and the spring grotto under it
  var HILLF = [[-14, 100], [-12, 66], [0, 57], [12, 50], [23, 46.5], [29, 49.5], [31.8, 54.6], [29.6, 56.0], [29.2, 61.4], [31.9, 63.0], [34.6, 66.5], [40, 74], [46, 84], [52, 100]];
  var HILL = HILLF.concat([[52, 140], [-14, 140]]);
  var POND = { x: -62, z: 42, rx: 11, rz: 8, depth: 1.3 };
  var ROADX = 72, RAILX = 96;
  V.MAP = { MAIN: MAIN, DRY: DRY, TEAL: TEAL, FACE: FACE, HILLF: HILLF, POND: POND };

  // ------------------------------------------------------------------ channels: sampled splines with their profiles
  function sampleSpline(pts, step) {
    var curve = new THREE.CatmullRomCurve3(pts.map(function (p) { return new THREE.Vector3(p[0], 0, p[1]); }), false, 'centripetal');
    var L = curve.getLength(), n = Math.max(2, Math.ceil(L / step)), sp = curve.getSpacedPoints(n), c = { X: [], Z: [], S: [], TX: [], TZ: [], K: [], n: n + 1, L: L };
    for (var i = 0; i <= n; i++) { c.X.push(sp[i].x); c.Z.push(sp[i].z); c.S.push(L * i / n); }
    for (i = 0; i <= n; i++) {
      var a = sp[Math.max(0, i - 1)], b = sp[Math.min(n, i + 1)], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1; c.TX.push(dx / l); c.TZ.push(dz / l);
    }
    // signed curvature (smoothed): + bends to the left of the flow
    for (i = 0; i <= n; i++) { var i0 = Math.max(0, i - 6), i1 = Math.min(n, i + 6); var cr = c.TX[i0] * c.TZ[i1] - c.TZ[i0] * c.TX[i1], ds = (i1 - i0) * L / n || 1; c.K.push(cr / ds); }
    return c;
  }
  function gauss(x, s) { return Math.exp(-(x * x) / (s * s)); }
  var CH = [
    // King's Creek: water 0.3-0.45 m deep, deeper pools (the Heron Pool, the Blue Hole), the little falls over a limestone ledge
    { id: 'main', name: "King's Creek", pts: MAIN, water: 'water', bedT: 'bed', bankT: 'clay', barT: 'gravel', ledgeX: -36, ledgeH: 0.32,
      prof: function (s, x) { return {
        hw: 1.55 + 0.3 * Math.sin(0.19 * x + 1.3) + 1.0 * gauss(x + 62, 3.4) + 1.7 * gauss(x - 50, 3.6) + 0.6 * gauss(x - 12, 3) + 0.4 * gauss(x - 84, 4),
        bank: 1.05 + 0.25 * gauss(x - 50, 6), wd: 0.34 + 0.08 * Math.sin(0.31 * x) + 0.32 * gauss(x + 62, 3) + 1.0 * gauss(x - 50, 2.6) + 0.2 * gauss(x - 12, 2.5),
        bw: 1.25 }; } },
    // Dry Fork: a wide pale bed, steep sided in the gorge under the bluff; the plunge pool below the Dry Falls always holds water
    { id: 'dry', name: 'Dry Fork', pts: DRY, water: 'water', bedT: 'limeBed', bankT: 'lime', barT: 'limeBed', join: 'main',
      prof: function (s, x, z) { var gorge = sst(-48, -44, z) * (1 - sst(-31, -27, z)); return { hw: 1.35 + 0.35 * Math.sin(s * 0.21) + 0.9 * gauss(z + 43.6, 2.4), bank: 0.9 + 0.35 * gauss(z + 43.6, 2.2), wd: 0.32 + 0.5 * gauss(z + 43.6, 1.8), bw: lerp(1.1, 0.45, gorge) }; } },
    // Teal Branch: narrow and shallow, clear, a small fall half way, a round pool at the spring
    { id: 'teal', name: 'Teal Branch', pts: TEAL, water: 'waterC', bedT: 'gravel', bankT: 'moss', barT: 'gravel', join: 'main', ledgeZ: 30, ledgeH: 0.38,
      prof: function (s, x, z) { return { hw: 0.62 + 0.12 * Math.sin(s * 0.4) + 1.6 * gauss(s - 0.8, 1.9), bank: 0.55 + 0.25 * gauss(s - 0.8, 2.5), wd: 0.16 + 0.04 * Math.sin(s * 0.5) + 0.35 * gauss(s - 0.8, 1.6), bw: 0.8 }; } }
  ];
  CH.forEach(function (c, ci) { c.index = ci; var sp = sampleSpline(c.pts, 0.5); for (var k in sp) c[k] = sp[k]; });
  var CHI = {}; CH.forEach(function (c) { CHI[c.id] = c; });

  // ------------------------------------------------------------------ fields worked out once: distance to the creek, the bluff and the hill
  function Grid(cs, fn) {
    var nx = Math.round((X1 - X0) / cs) + 1, nz = Math.round((Z1 - Z0) / cs) + 1, a = new Float32Array(nx * nz);
    for (var j = 0; j < nz; j++) for (var i = 0; i < nx; i++) a[j * nx + i] = fn(X0 + i * cs, Z0 + j * cs);
    return { cs: cs, nx: nx, nz: nz, a: a };
  }
  function bil(G, x, z) {
    var fx = clamp((x - X0) / G.cs, 0, G.nx - 1.001), fz = clamp((z - Z0) / G.cs, 0, G.nz - 1.001), i = fx | 0, j = fz | 0, u = fx - i, v = fz - j, a = G.a, n = G.nx, k = j * n + i;
    return (a[k] * (1 - u) + a[k + 1] * u) * (1 - v) + (a[k + n] * (1 - u) + a[k + n + 1] * u) * v;
  }
  var mainPts = []; for (var mi = 0; mi < CH[0].n; mi += 4) mainPts.push(CH[0].X[mi], CH[0].Z[mi]);
  var DM = Grid(2, function (x, z) { var b = 1e9; for (var i = 0; i < mainPts.length; i += 2) { var dx = x - mainPts[i], dz = z - mainPts[i + 1], d = dx * dx + dz * dz; if (d < b) b = d; } return Math.sqrt(b); });
  function inPoly(poly, x, z) { var c = false; for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) { var a = poly[i], b = poly[j]; if ((a[1] > z) !== (b[1] > z) && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
  function lineDist(line, x, z) { var b = 1e9; for (var i = 1; i < line.length; i++) b = Math.min(b, segDist(x, z, line[i - 1][0], line[i - 1][1], line[i][0], line[i][1])); return b; }
  function sdField(poly, line) { return function (x, z) { var d = Math.min(lineDist(line, x, z), 40); return inPoly(poly, x, z) ? d : -d; }; }
  var SB = Grid(0.5, sdField(PLATEAU, FACE)), SH = Grid(0.5, sdField(HILL, HILLF));
  var allPts = []; CH.forEach(function (c) { for (var i = 0; i < c.n; i += 4) allPts.push(c.X[i], c.Z[i]); });
  var DA = Grid(2, function (x, z) { var b = 1e9; for (var i = 0; i < allPts.length; i += 2) { var dx = x - allPts[i], dz = z - allPts[i + 1], d = dx * dx + dz * dz; if (d < b) b = d; } var pq = Math.hypot((x - POND.x) / POND.rx, (z - POND.z) / POND.rz); return Math.min(Math.sqrt(b), Math.max(0, (pq - 1) * 9)); });
  // the cave: a flat-floored alcove cut into the bluff face (its back wall is where the shadows fall)
  var CAVE = { x0: 9.4, x1: 14.6, z0: -30.0, z1: -25.2, cx: 12, cz: -27.4 };
  var GROTTO = { x0: 29.0, x1: 33.4, z0: 55.4, z1: 62.0 };
  var BLUFF_H = 6.6, HILL_H = 4.2;

  function undul(x, z) { return 0.22 * Math.sin(x * 0.13 + 1.1) * Math.cos(z * 0.17) + 0.12 * Math.sin(x * 0.31 + z * 0.21) + 0.05 * Math.sin(x * 0.9 + z * 0.7); }
  // the land before the channels are cut: the valley floor falls gently to the east and rises away from the creek; the bluff and the hill on top
  function base(x, z) {
    var dm = bil(DM, x, z);
    var h = 1.7 - 0.015 * x + 3.0 * (1 - Math.exp(-Math.max(0, dm - 9) / 26)) + undul(x, z) * sst(3, 9, dm);
    var sb = bil(SB, x, z); if (sb > -0.5) h += BLUFF_H * sst(0, 2.6, sb + 0.25 * Math.sin(x * 0.9 + z * 0.4)) + Math.max(0, sb - 3) * 0.025 + 0.4 * Math.sin(x * 0.07) * sst(3, 10, sb);
    var sh = bil(SH, x, z); if (sh > -0.5) h += HILL_H * sst(0, 2.2, sh + 0.2 * Math.sin(x * 1.1 + z * 0.5)) + Math.max(0, sh - 2.2) * 0.04;
    return h;
  }

  // per-sample profiles along each channel: the bed never climbs downstream, so the water never runs uphill
  CH.forEach(function (c) {
    c.HW = []; c.BANK = []; c.WD = []; c.BWL = []; c.BWR = []; c.BED = []; c.WL = []; c.HB = [];
    for (var i = 0; i < c.n; i++) {
      var pr = c.prof(c.S[i], c.X[i], c.Z[i]), hb = base(c.X[i], c.Z[i]), k = clamp(c.K[i] * 9, -1, 1);
      c.HW.push(pr.hw); c.BANK.push(pr.bank); c.WD.push(pr.wd); c.HB.push(hb);
      // inside of a bend: a wide gentle gravel bar; outside: a steep cut bank (left = +k side)
      c.BWL.push(Math.max(0.42, pr.bw * (1 + 0.8 * k))); c.BWR.push(Math.max(0.42, pr.bw * (1 - 0.8 * k)));
      var bed = hb - pr.bank;
      if (c.ledgeX != null) bed -= c.ledgeH * sst(c.ledgeX - 0.2, c.ledgeX + 0.2, c.X[i]);
      if (c.ledgeZ != null) bed -= c.ledgeH * sst(c.ledgeZ + 0.2, c.ledgeZ - 0.2, c.Z[i]);
      c.BED.push(bed);
    }
    for (i = 1; i < c.n; i++) c.BED[i] = Math.min(c.BED[i], c.BED[i - 1]);
    for (i = 0; i < c.n; i++) c.WL.push(c.BED[i] + c.WD[i]);
    for (i = 1; i < c.n; i++) c.WL[i] = Math.min(c.WL[i], c.WL[i - 1]);
  });
  // a tributary's water ends in the main creek's: keep its last stretch at least at the creek's level
  CH.forEach(function (c) {
    if (!c.join) return; var m = CHI[c.join], ex = c.X[c.n - 1], ez = c.Z[c.n - 1], bi = 0, bd = 1e9;
    for (var i = 0; i < m.n; i++) { var d = Math.hypot(m.X[i] - ex, m.Z[i] - ez); if (d < bd) { bd = d; bi = i; } }
    c.joinWL = m.WL[bi]; c.joinI = bi;
  });

  // spatial hash of channel segments (and the pond) for the carve
  var HC = 4, HNX = Math.ceil((X1 - X0) / HC) + 1, HNZ = Math.ceil((Z1 - Z0) / HC) + 1, HASH = new Array(HNX * HNZ);
  function hashAdd(H, x0, z0, x1, z1, item) {
    var i0 = clamp(Math.floor((x0 - X0) / HC), 0, HNX - 1), i1 = clamp(Math.floor((x1 - X0) / HC), 0, HNX - 1), j0 = clamp(Math.floor((z0 - Z0) / HC), 0, HNZ - 1), j1 = clamp(Math.floor((z1 - Z0) / HC), 0, HNZ - 1);
    for (var j = j0; j <= j1; j++) for (var i = i0; i <= i1; i++) { var k = j * HNX + i; (H[k] = H[k] || []).push(item); }
  }
  function hashGet(H, x, z) { var i = Math.floor((x - X0) / HC), j = Math.floor((z - Z0) / HC); if (i < 0 || j < 0 || i >= HNX || j >= HNZ) return null; return H[j * HNX + i]; }
  CH.forEach(function (c, ci) {
    for (var i = 0; i < c.n - 1; i++) {
      var R = Math.max(c.HW[i] + Math.max(c.BWL[i], c.BWR[i]), c.HW[i + 1] + Math.max(c.BWL[i + 1], c.BWR[i + 1])) + 0.6;
      hashAdd(HASH, Math.min(c.X[i], c.X[i + 1]) - R, Math.min(c.Z[i], c.Z[i + 1]) - R, Math.max(c.X[i], c.X[i + 1]) + R, Math.max(c.Z[i], c.Z[i + 1]) + R, ci * 100000 + i);
    }
  });

  // ------------------------------------------------------------------ trails, the road and the railroad (graded ones set the ground to their own level)
  // trail points: [x, z] (follows the ground) or [x, z, y] (graded: the ground is cut or filled to y)
  var TRAILS = [
    // the main trail along the south bank, from the trailhead to the county road
    { id: 'main', w: 0.62, pts: [[-100, 13], [-94, 8.5], [-86, 6], [-78, 5.5], [-70, 3], [-62, 4.5], [-54, 1], [-46, 2.5], [-38, 5], [-30, 6.5], [-22, 4.5], [-14, 5.5], [-6, 6.5], [2, 4.5], [9, 6], [16, 8.5], [24, 7], [30, 9.5], [40, 12.5], [48, 15], [56, 12], [64, 12.5], [70.5, 14]] },
    // the north bank, from the stepping stones past the Dry Fork mouth to the cave and the footbridge
    { id: 'north', w: 0.55, pts: [[-50, -16], [-44, -16.5], [-36, -14.5], [-28, -10], [-22, -11], [-12, -10.5], [-4, -12], [4, -15], [10, -20.5], [12, -24], [18, -18], [22, -12], [16, -7], [12, -4]] },
    // up the Dry Fork gorge to the plunge pool and the flat rock
    { id: 'gorge', w: 0.5, pts: [[-17, -12], [-18.5, -20], [-17.6, -28], [-16, -34], [-17.4, -40]] },
    // the switchback up the bluff to the lookout
    { id: 'bluff', w: 0.6, climb: [0, 0.2, 0.45, 0.66, 0.84, 1, 1, 1], pts: [[19, -19.5, null], [27, -23.2, 0], [33, -25.4, 0], [29.5, -27.6, 0], [24, -29.2, 0], [27, -32, 0], [36, -32.5, 0], [44, -31.5, 0]] },
    // the bluff top, west to the head of the Dry Falls and east to the road
    { id: 'top', w: 0.5, pts: [[44, -31.5], [52, -35], [62, -40], [70, -45]] },
    { id: 'top2', w: 0.5, pts: [[27, -32.4], [18, -33.6], [8, -32.8], [-2, -35], [-7, -41], [-10, -48], [-13, -52]] },
    // down Teal Branch to the spring
    { id: 'teal', w: 0.5, pts: [[30, 9.5], [31, 18], [32.6, 27], [33, 36], [34.4, 44], [35.2, 50], [34.8, 54], [34.2, 56.3]] },
    // to the stock pond
    { id: 'pond', w: 0.55, pts: [[-70, 3], [-72, 12], [-74, 22], [-72, 30.5], [-66, 31], [-56, 31.2], [-50, 33]] },
    // the trailhead lot
    { id: 'lot', w: 0.7, pts: [[-100, 13.4], [-100.6, 18], [-102.2, 22.2], [-104.5, 22.4]] },
    // up the south hill from Teal Branch, to the oaks on top
    { id: 'hill', w: 0.55, climb: [0, 0.35, 0.72, 1, 1], pts: [[30.8, 44, 0], [25, 45.6, 0], [20.4, 48.4, 0], [17.6, 52.6, 0], [15.5, 57, 0]] },
    // the old oak on the lower creek, past the road
    { id: 'lower', w: 0.55, pts: [[71, 18], [78, 20], [86, 21.5], [93, 20]] }
  ];
  // the county road: a graded gravel road with a dip down to the low-water crossing
  var ROAD = { id: 'road', w: 2.4, road: true, pts: [] };
  (function () {
    for (var z = 82; z >= -82; z -= 4) ROAD.pts.push([ROADX + 1.2 * Math.sin(z * 0.05), z, null]);
  })();
  // the old railroad on its embankment (no ground grading over the trestle span)
  var RAIL = { id: 'rail', w: 1.7, rail: true, pts: [] };
  (function () { for (var z = 82; z >= -82; z -= 4) RAIL.pts.push([RAILX, z, null]); })();
  TRAILS.push(ROAD, RAIL);
  var mainAt = function (x) { var c = CH[0], best = 0, bd = 1e9; for (var i = 0; i < c.n; i += 2) { var d = Math.abs(c.X[i] - x); if (d < bd) { bd = d; best = i; } } return best; };
  var ROADI = mainAt(ROADX), RAILI = mainAt(RAILX), SLAB = CH[0].WL[ROADI] + 0.16, RAILTOP = CH[0].HB[RAILI] + 3.6, TRESTLE = { z: CH[0].Z[RAILI], half: 8.5 };
  (function () {   // the road climbs the bluff in a long cut: its level is the ground smoothed over 40 m, then dipped to the slab
    var G = ROAD.pts.map(function (p) { return base(p[0], p[1]); }), S2 = G.map(function (g, k) { var sum = 0, n = 0; for (var q = -5; q <= 5; q++) { var v = G[Math.min(G.length - 1, Math.max(0, k + q))]; sum += v; n++; } return sum / n; });
    ROAD.pts.forEach(function (p, k) { var dz = Math.abs(p[1] - CH[0].Z[ROADI]); p[2] = lerp(SLAB, S2[k] + 0.12, sst(2.6, 13, dz)); });
  })();
  RAIL.pts.forEach(function (p) { p[2] = RAILTOP; });
  TRAILS.forEach(function (t) { if (!t.climb) return; var y0 = base(t.pts[0][0], t.pts[0][1]), y1 = base(t.pts[t.pts.length - 1][0], t.pts[t.pts.length - 1][1]); t.pts.forEach(function (p, k) { p[2] = y0 + (y1 - y0) * t.climb[k]; }); });
  // sample every trail finely, with heights for the graded ones
  TRAILS.forEach(function (t, ti) {
    t.index = ti; var pts = t.pts, X = [], Z = [], Y = [];
    var curve = new THREE.CatmullRomCurve3(pts.map(function (p) { return new THREE.Vector3(p[0], 0, p[1]); }), false, 'centripetal');
    var L = curve.getLength(), n = Math.max(2, Math.ceil(L / 0.5)), sp = curve.getSpacedPoints(n);
    var graded = pts.some(function (p) { return p.length > 2; });
    // heights: interpolate the given y along the polyline by nearest control index
    var cum = [0]; for (var i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    for (i = 0; i <= n; i++) {
      X.push(sp[i].x); Z.push(sp[i].z);
      if (graded) {
        var u = cum[cum.length - 1] * i / n, k = 0; while (k < cum.length - 2 && u > cum[k + 1]) k++;
        var y0 = pts[k][2], y1 = pts[k + 1][2], f = (u - cum[k]) / (cum[k + 1] - cum[k] || 1);
        if (y0 == null) y0 = base(pts[k][0], pts[k][1]); if (y1 == null) y1 = base(pts[k + 1][0], pts[k + 1][1]);
        Y.push(lerp(y0, y1, f));
      } else Y.push(null);
    }
    t.X = X; t.Z = Z; t.Y = Y; t.n = n + 1; t.graded = graded; t.L = L;
  });
  var HT = new Array(HNX * HNZ);
  TRAILS.forEach(function (t, ti) {
    var R = t.w + (t.graded ? (t.rail ? 6 : 3.2) : 0.6);
    for (var i = 0; i < t.n - 1; i++) hashAdd(HT, Math.min(t.X[i], t.X[i + 1]) - R, Math.min(t.Z[i], t.Z[i + 1]) - R, Math.max(t.X[i], t.X[i + 1]) + R, Math.max(t.Z[i], t.Z[i + 1]) + R, ti * 100000 + i);
  });

  // ------------------------------------------------------------------ fords: where a path crosses a creek the banks are worn gentle
  var FORDS = [], FH = new Array(HNX * HNZ);
  function fordBW(x, z) { var l = hashGet(FH, x, z); if (!l) return 0; var b = 0; for (var q = 0; q < l.length; q++) { var f = l[q], d = Math.hypot(x - f.x, z - f.z); if (d < 5) b = Math.max(b, f.w * sst(5, 2.2, d)); } return b; }
  // ------------------------------------------------------------------ the ground
  // probe(x, z): everything the ground, its paint and the water need to know about a point (one reused object)
  var PR = { h: 0, hb: 0, ch: -1, ci: 0, t: 0, d: 0, hw: 0, bw: 0, side: 0, inside: 0, wl: 0, bed: 0, pond: 0, trail: -1, td: 9, ty: null, wet: false };
  function probe(x, z) {
    var hb = base(x, z), h = hb, list = hashGet(HASH, x, z), best = 9e9, fb = -1;
    PR.ch = -1; PR.d = 9; PR.pond = 0; PR.trail = -1; PR.td = 9; PR.hb = hb;
    if (list) for (var q = 0; q < list.length; q++) {
      var code = list[q], ci = (code / 100000) | 0, i = code % 100000, c = CH[ci];
      var ax = c.X[i], az = c.Z[i], bx = c.X[i + 1], bz = c.Z[i + 1], vx = bx - ax, vz = bz - az, L2 = vx * vx + vz * vz || 1;
      var t = clamp(((x - ax) * vx + (z - az) * vz) / L2, 0, 1), qx = ax + vx * t, qz = az + vz * t, dx = x - qx, dz = z - qz, d = Math.sqrt(dx * dx + dz * dz);
      var hw = lerp(c.HW[i], c.HW[i + 1], t), side = (vx * dz - vz * dx) > 0 ? -1 : 1;   // -1: left of the flow
      var bw = side < 0 ? lerp(c.BWL[i], c.BWL[i + 1], t) : lerp(c.BWR[i], c.BWR[i + 1], t); if (fb < 0) fb = FORDS.length ? fordBW(x, z) : 0; if (fb > bw) bw = fb;
      if (d > hw + bw) continue;
      var bed = lerp(c.BED[i], c.BED[i + 1], t), hc;
      if (d < hw) hc = bed - 0.07 * (1 - (d / hw) * (d / hw)) + 0.025 * Math.sin(x * 1.7 + z * 2.3);
      else hc = bed + (hb - bed) * sst(0, 1, (d - hw) / bw);
      if (hc < h) h = hc;
      var score = d - hw;
      if (score < best) { best = score; PR.ch = ci; PR.ci = i; PR.t = t; PR.d = d; PR.hw = hw; PR.bw = bw; PR.side = side; PR.bed = bed; PR.wl = lerp(c.WL[i], c.WL[i + 1], t); var kk = lerp(c.K[i], c.K[i + 1], t); PR.inside = -side * clamp(kk * 9, -1, 1); }
    }
    // the stock pond: a bowl behind an earth dam on its north side
    var px = (x - POND.x) / POND.rx, pz = (z - POND.z) / POND.rz, pq = Math.sqrt(px * px + pz * pz);
    if (pq < 1.6) {
      var pwl = pondWL(), hp;
      if (pq < 1) hp = pwl - POND.depth * (1 - pq * pq) - 0.05; else hp = lerp(pwl - 0.05, hb, sst(1, 1.45, pq));
      if (hp < h) h = hp;
      PR.pond = pq;
      // the dam: a berm along the north side
      var dd = Math.abs(pq - 1.32) * POND.rz, onN = sst(0.25, -0.35, pz);
      if (dd < 2.2 && onN > 0) h = Math.max(h, lerp(h, pwl + 0.95, onN * sst(2.2, 0.7, dd)));
    }
    // the cave and the spring grotto: flat floors cut back into the rock
    if (x > CAVE.x0 - 1 && x < CAVE.x1 + 1 && z > CAVE.z0 - 1 && z < CAVE.z1 + 1) {
      var sdc = Math.max(CAVE.x0 - x, x - CAVE.x1, CAVE.z0 - z, z - CAVE.z1); if (CAVE.y == null) CAVE.y = base(CAVE.cx, CAVE.z1 + 1.6);
      if (sdc < 0.9) h = lerp(h, Math.min(h, CAVE.y), sst(0.9, 0.15, sdc));
    }
    if (x > GROTTO.x0 - 1 && x < GROTTO.x1 + 1 && z > GROTTO.z0 - 1 && z < GROTTO.z1 + 1) {
      var sdg = Math.max(GROTTO.x0 - x, x - GROTTO.x1, GROTTO.z0 - z, z - GROTTO.z1); if (GROTTO.y == null) GROTTO.y = base(34.6, 58.7);
      if (sdg < 0.9) h = lerp(h, Math.min(h, GROTTO.y), sst(0.9, 0.15, sdg));
    }
    // graded trails: the road, the railroad embankment and the bluff switchback cut and fill the ground to their own level
    var tl = hashGet(HT, x, z);
    if (tl) for (q = 0; q < tl.length; q++) {
      var tc = tl[q], ti = (tc / 100000) | 0, j = tc % 100000, T = TRAILS[ti];
      var ax2 = T.X[j], az2 = T.Z[j], bx2 = T.X[j + 1], bz2 = T.Z[j + 1], vx2 = bx2 - ax2, vz2 = bz2 - az2, L22 = vx2 * vx2 + vz2 * vz2 || 1;
      var t2 = clamp(((x - ax2) * vx2 + (z - az2) * vz2) / L22, 0, 1), d2 = Math.hypot(x - ax2 - vx2 * t2, z - az2 - vz2 * t2);
      if (d2 < PR.td) { PR.td = d2; PR.trail = ti; }
      if (!T.graded) continue;
      var yt = lerp(T.Y[j], T.Y[j + 1], t2);
      if (T.rail && Math.abs(z - TRESTLE.z) < TRESTLE.half) continue;
      var side2 = T.rail ? 1.9 * Math.max(0.6, Math.abs(yt - h)) : T.road ? 2.6 : 2.0;
      var wgt = sst(T.w + side2, T.w, d2);
      if (T.rail || T.road) { if (T.rail && yt < h) wgt *= sst(T.w + 1.2, T.w, d2); }
      h = lerp(h, yt, wgt);
    }
    PR.h = h;
    return PR;
  }
  function terrain(x, z) { return probe(x, z).h; }
  V.base = base;
  (function () {   // find the fords once (every path that walks into a creek), and hash them
    TRAILS.forEach(function (t) {
      if (t.graded) return;
      for (var i = 0; i < t.n; i += 2) {
        var p = probe(t.X[i], t.Z[i]); if (p.ch < 0 || p.d > p.hw + 0.2) continue;
        var near = FORDS.some(function (f) { return Math.hypot(f.x - t.X[i], f.z - t.Z[i]) < 4; }); if (near) continue;
        var w = CH[p.ch].id === 'dry' ? 2.8 : 2.4;
        var f = { x: t.X[i], z: t.Z[i], w: w, ch: CH[p.ch].id }; FORDS.push(f); hashAdd(FH, f.x - 5, f.z - 5, f.x + 5, f.z + 5, f);
      }
    });
  })();
  V.FORDS = FORDS;

  // ------------------------------------------------------------------ water levels
  var FLOW = { main: 'normal', dry: 'pools', teal: 'normal', pond: 'normal' };
  var OFFS = { main: { low: -0.12, normal: 0, high: 0.24, flood: 0.52 }, dry: { dry: -9, pools: -9, running: 0.34 }, teal: { normal: 0, high: 0.12 }, pond: { normal: 0, high: 0.18 } };
  var LEVEL = { main: 0, dry: -9, teal: 0, pond: 0 }, LEVELT = { main: 0, dry: -9, teal: 0, pond: 0 };
  var POND_WL0 = null;
  function pondWL() { if (POND_WL0 == null) POND_WL0 = base(POND.x, POND.z - POND.rz) - 0.55; return POND_WL0; }
  function chLevel(c) { return LEVEL[c.id] || 0; }
  // the plunge pool below the Dry Falls and two more pools in the gorge hold water after the creek stops running
  var DRYPOOLS = [];
  (function () { var c = CHI.dry; [[-43.6, 1.9], [-35.5, 1.1], [-21, 1.0]].forEach(function (q) { var bi = 0, bd = 1e9; for (var i = 0; i < c.n; i++) { var d = Math.abs(c.Z[i] - q[0]); if (d < bd) { bd = d; bi = i; } } DRYPOOLS.push({ x: c.X[bi], z: c.Z[bi], r: q[1], y: c.BED[bi] + 0.16 + (q[1] > 1.5 ? 0.3 : 0), i: bi }); }); })();
  // water surface at a point, or null
  function water(x, z) {
    var p = probe(x, z), best = null;
    if (p.ch >= 0) {
      var c = CH[p.ch];
      if (p.d < p.hw + p.bw) {
        var lv = c.id === 'dry' ? LEVEL.dry : chLevel(c), y = (c.id === 'dry' ? p.bed + 0.02 : p.wl) + lv;
        if (c.join && p.ci > c.n - 6) y = Math.max(y, c.joinWL + LEVEL[c.join]);
        if (lv > -5 && y > p.h) best = y;
      }
    }
    if (p.pond > 0 && p.pond < 1.45) { var yp = pondWL() + LEVEL.pond; if (yp > p.h && (best == null || yp > best)) best = yp; }
    for (var k = 0; k < DRYPOOLS.length; k++) { var dp = DRYPOOLS[k]; if (FLOW.dry !== 'dry' && Math.hypot(x - dp.x, z - dp.z) < dp.r + 0.6 && dp.y > p.h) best = best == null ? dp.y : Math.max(best, dp.y); }
    return best;
  }
  function fast(x, z) {
    var p = probe(x, z); if (p.ch < 0 || p.d > p.hw + p.bw) return false;
    var id = CH[p.ch].id; return (id === 'main' && (FLOW.main === 'flood' || FLOW.main === 'high')) || (id === 'dry' && FLOW.dry === 'running');
  }

  // ------------------------------------------------------------------ ground paint
  var TYPES = ['grass', 'grassL', 'grassD', 'path', 'clay', 'gravel', 'bed', 'pathE', 'litter', 'lime', 'limeD', 'limeBed', 'shale', 'road', 'ballast', 'moss', 'concrete'];
  var TI = {}; TYPES.forEach(function (t, i) { TI[t] = i; });
  var SHADE = [];   // places under sycamores and gold trees, filled when the trees are laid out (leaf-litter ground)
  var SHASH = new Array(HNX * HNZ);
  function typeAt(x, z, h, slope) {
    var p = PR;   // probe(x, z) has just been called by the caller
    if (p.trail >= 0) {
      var T = TRAILS[p.trail];
      if (T.road && p.td < T.w + 0.15) return Math.abs(z - CH[0].Z[ROADI]) < 2.6 && h < SLAB + 0.08 ? TI.concrete : TI.road;
      if (T.rail && p.td < T.w + 1.1 && Math.abs(z - TRESTLE.z) > TRESTLE.half - 0.5) return TI.ballast;
    }
    if (p.ch >= 0) {
      var c = CH[p.ch], wl = c.id === 'dry' ? p.bed + 0.05 : p.wl;
      if (h < wl - 0.03 && c.id !== 'dry') return TI.bed;
      if (h < p.hb - 0.1 && p.d < p.hw + p.bw) {
        if (c.id === 'dry') { if (p.d < p.hw + 0.25) return TI.limeBed; return z > -44 && z < -30 && p.side > 0 ? TI.shale : TI.lime; }
        return p.inside > 0.15 ? TI[c.barT] : TI[c.bankT];
      }
    }
    if (p.pond > 0 && p.pond < 1.18) return p.pond < 1.05 ? TI.bed : TI.clay;
    if (slope > 0.8) {
      // steep ground: limestone in layers on the bluff and the hill; grass on the railroad embankment; raw clay in the road cut
      if (bil(SB, x, z) > -3 || bil(SH, x, z) > -3) { if (slope < 1.15) return TI.limeD; var band = Math.floor(h * 1.45 + 0.15 * Math.sin(x * 0.5)); return band % 3 === 1 ? TI.limeD : TI.lime; }
      if (p.trail >= 0 && TRAILS[p.trail].rail) return TI.grassD;
      return TI.clay;
    }
    if (p.trail >= 0) {
      var T2 = TRAILS[p.trail];
      if (!T2.road && !T2.rail) { if (p.td < T2.w) return TI.path; if (p.td < T2.w + 0.33) return TI.pathE; }
    }
    // the spring grotto: moss on the wet ground
    if (Math.hypot(x - 31.6, z - 58.7) < 5.0 && h < base(35, 58.7) + 1.2) return TI.moss;
    if (x > CAVE.x0 && x < CAVE.x1 && z > CAVE.z0 && z < CAVE.z1 - 0.6) return TI.gravel;
    var sl = hashGet(SHASH, x, z);
    if (sl) for (var q = 0; q < sl.length; q++) { var s = sl[q]; if (Math.hypot(s.x - x, s.z - z) < s.r) return TI.litter; }
    var sb = bil(SB, x, z), sh = bil(SH, x, z);
    var n = Math.sin(x * 0.37 + 1.3) * Math.cos(z * 0.41 - 0.6) + 0.6 * Math.sin(x * 0.11 - z * 0.19);
    if (sb > 3 || sh > 3) return n > 0.55 ? TI.grassL : n < -0.2 ? TI.grassD : TI.grass;
    if (Math.abs(x) > 104 || Math.abs(z) > 72) return TI.grassD;
    return n > 0.75 ? TI.grassL : n < -0.85 ? TI.grassD : TI.grass;
  }
  V.TYPES = TYPES;

  // ================================================================== the world
  V.create = function (opts) {
    opts = opts || {};
    var D = clamp(opts.detail | 0 || 2, 1, 6);
    var grp = new THREE.Group(); grp.name = 'Valley';
    var R = rnd(7);
    var circles = [], segs = [], platforms = [];
    var CHASH = new Array(HNX * HNZ);
    function addCircle(x, z, r, tag) { var c = { x: x, z: z, r: r, tag: tag }; circles.push(c); hashAdd(CHASH, x - r, z - r, x + r, z + r, c); return c; }
    function addSeg(ax, az, bx, bz, r) { var s = { ax: ax, az: az, bx: bx, bz: bz, r: r }; segs.push(s); hashAdd(CHASH, Math.min(ax, bx) - r, Math.min(az, bz) - r, Math.max(ax, bx) + r, Math.max(az, bz) + r, s); return s; }
    var spots = { finds: {}, poems: {}, perches: [], pools: [], frogs: [], dragon: [], butterflies: [], ducks: [] };
    var keep = [];   // places to keep clear of trees
    function farFromKeep(x, z, r) { for (var q = 0; q < keep.length; q++) if (Math.hypot(x - keep[q][0], z - keep[q][1]) < keep[q][2] + r) return false; return true; }
    function nearTrail(x, z, r) { probe(x, z); return PR.td < r; }

    var W = {
      group: grp, spots: spots, bounds: BOUND, channels: CH, trails: TRAILS, detail: D, flow: FLOW, map: { MAIN: MAIN, DRY: DRY, TEAL: TEAL, FACE: FACE, HILLF: HILLF, POND: POND, ROADX: ROADX, RAILX: RAILX, TRESTLE: TRESTLE, X0: X0, X1: X1, Z0: Z0, Z1: Z1 },
      terrain: terrain, base: base, probe: probe, palette: V.palette, CUT: CUT, TILE: TILE
    };

    // ================================================================ landmarks (built once, whole; they are light)
    var LM = new THREE.Group(); LM.name = 'Landmarks'; grp.add(LM);
    // solid earth under the whole valley: a view cut open near the camera shows soil, not sky
    (function () { var fl = new THREE.Mesh(new THREE.PlaneGeometry(600, 600).rotateX(-Math.PI / 2), paint('earth', { side: true })); fl.material.opacity = 0.6; fl.position.y = -7; fl.name = 'EarthFloor'; grp.add(fl); })();
    var lmB = new Batch();
    function box(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
    function cylG(rt, rb, h, n) { return new THREE.CylinderGeometry(rt, rb, h, n || 8); }
    function nearestSample(c, x, z) { var bi = 0, bd = 1e9; for (var i = 0; i < c.n; i++) { var d = (c.X[i] - x) * (c.X[i] - x) + (c.Z[i] - z) * (c.Z[i] - z); if (d < bd) { bd = d; bi = i; } } return bi; }
    function across(c, i, side, d) { return [c.X[i] - c.TZ[i] * side * d, c.Z[i] + c.TX[i] * side * d]; }   // side +1: right of the flow
    var M = CH[0];

    // ---------------- the studio and the truck at the trailhead
    (function () {
      var sx = -104.5, sz = 19.2, g = terrain(sx, sz) + 0.05, w = 4.4, d = 3.2, hF = 2.75, hB = 2.3;
      // floor, back and side walls of weathered board with battens; the front is open
      lmB.add('board|f', bake(box(w + 0.2, 0.18, d + 0.2), sx, g + 0.09, sz));
      lmB.add('board|f', bake(box(w, hB, 0.12), sx, g + hB / 2, sz - d / 2));
      [-1, 1].forEach(function (s) {
        var wall = new THREE.BoxGeometry(0.12, 1, d), P = wall.attributes.position;
        for (var q = 0; q < P.count; q++) { var zz = P.getZ(q), top = lerp(hB, hF, (zz + d / 2) / d); P.setY(q, P.getY(q) > 0 ? top : 0); }
        wall.computeVertexNormals(); lmB.add('board|f', bake(wall, sx + s * w / 2, g, sz));
        for (var b = 0; b < 5; b++) lmB.add('wood|f', bake(box(0.05, 2.2, 0.06), sx + s * (w / 2 + 0.05), g + 1.1, sz - d / 2 + 0.35 + b * 0.62));
        lmB.add('wood|f', bake(box(0.16, hF, 0.16), sx + s * (w / 2 - 0.08), g + hF / 2, sz + d / 2 - 0.08));
      });
      for (var b2 = 0; b2 < 9; b2++) lmB.add('wood|f', bake(box(0.06, hB - 0.1, 0.05), sx - w / 2 + 0.25 + b2 * 0.5, g + hB / 2, sz - d / 2 + 0.08));
      // the tin roof, sloping to the back
      var roof = box(w + 0.7, 0.07, d + 0.8); roof.rotateX(Math.atan2(hF - hB, d)); lmB.add('tin|f', bake(roof, sx, g + (hF + hB) / 2 + 0.08, sz));
      for (var r = 0; r < 10; r++) { var rib = box(0.05, 0.06, d + 0.8); rib.rotateX(Math.atan2(hF - hB, d)); lmB.add('tin|f', bake(rib, sx - w / 2 - 0.3 + r * 0.55, g + (hF + hB) / 2 + 0.13, sz)); }
      // the wall of shadow boxes inside, and his workbench
      W.studioBoxes = [];
      for (var row = 0; row < 3; row++) for (var col = 0; col < 3; col++) {
        var bx = sx - 1.3 + col * 1.3, by = g + 0.85 + row * 0.55, bz = sz - d / 2 + 0.16;
        lmB.add('wood|f', bake(box(0.95, 0.46, 0.12), bx, by, bz));
        lmB.add('signK|f', bake(box(0.78, 0.32, 0.04), bx, by, bz + 0.05));
        W.studioBoxes.push({ x: bx, y: by, z: bz + 0.08 });
      }
      lmB.add('wood|f', bake(box(2.2, 0.08, 0.7), sx + 0.6, g + 0.86, sz - 0.6));
      [[-0.45, -0.85], [1.65, -0.85], [-0.45, -0.35], [1.65, -0.35]].forEach(function (q) { lmB.add('wood|f', bake(box(0.07, 0.82, 0.07), sx + q[0], g + 0.41, sz + q[1])); });
      addSeg(sx - w / 2, sz - d / 2, sx + w / 2, sz - d / 2, 0.12); addSeg(sx - w / 2, sz - d / 2, sx - w / 2, sz + d / 2, 0.12); addSeg(sx + w / 2, sz - d / 2, sx + w / 2, sz + d / 2, 0.12);
      addCircle(sx + 0.6, sz - 0.6, 0.6, 'bench');
      spots.studio = { x: sx, z: sz + d / 2 + 0.9, face: Math.PI, label: "The studio" };
      platforms.push({ kind: 'box', x: sx, z: sz, ux: 1, uz: 0, hl: w / 2 + 0.1, hw: d / 2 + 0.1, top: g + 0.18, tag: 'studio' });
      spots.studioIn = { x: sx + 1.55, z: sz + 0.95, y: g + 0.18 };
      // his chair by the workbench, facing out of the open front
      (function () { var cx = sx - 1.35, cz = sz + 0.35, fy = g + 0.18; [[0.42, 0.04, 0.4, 0, 0.45, 0], [0.42, 0.42, 0.04, 0, 0.68, -0.19], [0.04, 0.45, 0.04, -0.18, 0.225, 0.17], [0.04, 0.45, 0.04, 0.18, 0.225, 0.17], [0.04, 0.9, 0.04, -0.18, 0.45, -0.19], [0.04, 0.9, 0.04, 0.18, 0.45, -0.19]].forEach(function (q) { lmB.add('wood|f', bake(box(q[0], q[1], q[2]), cx + q[3], fy + q[4], cz + q[5])); });
        spots.chair = { x: cx, z: cz, y: fy + 0.45, face: 0, label: 'His chair' }; })();
      keep.push([sx, sz, 5.5]);
      // the truck: an old pickup, faded blue
      var tx = -97.6, tz = 20.6, ty = terrain(tx, tz), ang = 0.35, ca = Math.cos(ang), sa = Math.sin(ang);
      function T(geo, key, lx, ly, lz) { lmB.add(key, bake(geo, tx + lx * ca + lz * sa, ty + ly, tz - lx * sa + lz * ca, 0, ang, 0)); }
      T(box(1.75, 0.55, 4.9), 'truck|f', 0, 0.75, 0);
      T(box(1.7, 0.75, 1.55), 'truck|f', 0, 1.38, 0.45);
      T(box(1.6, 0.5, 1.2), 'glassD|f', 0, 1.42, 0.47);
      T(box(1.75, 0.3, 1.5), 'truck|f', 0, 1.1, 1.75);
      T(box(1.8, 0.12, 0.2), 'steel|f', 0, 0.55, 2.5); T(box(1.8, 0.12, 0.2), 'steel|f', 0, 0.55, -2.5);
      [-1, 1].forEach(function (s) { T(box(0.08, 0.45, 2.1), 'truck|f', s * 0.84, 1.24, -1.35); });
      T(box(1.75, 0.45, 0.08), 'truck|f', 0, 1.24, -2.42);
      [[-0.82, 1.5], [0.82, 1.5], [-0.82, -1.55], [0.82, -1.55]].forEach(function (q) { var wh = cylG(0.38, 0.38, 0.28, 10); wh.rotateZ(Math.PI / 2); T(wh, 'tire|f', q[0], 0.38, q[1]); });
      addCircle(tx + 1.6 * sa, tz + 1.6 * ca, 1.05, 'truck'); addCircle(tx, tz, 1.05, 'truck'); addCircle(tx - 1.6 * sa, tz - 1.6 * ca, 1.05, 'truck');
      spots.truck = { x: tx - 2.9 * sa, z: tz - 2.9 * ca, y: ty + 1.0, item: [tx - 1.7 * sa, tz - 1.7 * ca] };
      keep.push([tx, tz, 4]);
    })();

    // ---------------- benches (poem stops and resting places)
    function bench(x, z, faceYaw, key) {
      var h = terrain(x, z), b = new THREE.Group(); b.position.set(x, h, z); b.rotation.y = faceYaw;
      [[1.3, 0.05, 0.36, 0, 0.42, 0], [1.3, 0.24, 0.05, 0, 0.66, -0.18], [0.08, 0.42, 0.08, -0.55, 0.21, 0.12], [0.08, 0.42, 0.08, 0.55, 0.21, 0.12], [0.08, 0.68, 0.08, -0.55, 0.34, -0.17], [0.08, 0.68, 0.08, 0.55, 0.34, -0.17]]
        .forEach(function (q) { var m = new THREE.Mesh(box(q[0], q[1], q[2]), paint('wood', { flat: true })); m.position.set(q[3], q[4], q[5]); m.castShadow = true; m.receiveShadow = true; b.add(m); });
      LM.add(b); addCircle(x, z, 0.55, 'bench'); keep.push([x, z, 2]);
      return { x: x + Math.sin(faceYaw) * 0.75, z: z + Math.cos(faceYaw) * 0.75, face: faceYaw, seat: { x: x, y: h + 0.45, z: z } };
    }
    var benches = [];
    (function () {
      var i = nearestSample(M, -92, 0), p = across(M, i, 1, M.HW[i] + M.BWR[i] + 2.6), yaw = Math.atan2(M.X[i] - p[0], M.Z[i] - p[1]);
      var b = bench(p[0], p[1], yaw); b.label = 'The bench'; spots.poems.bench = b; benches.push(b);
    })();

    // ---------------- the stepping stones, the fallen log and the footbridge across King's Creek
    var crossings = [];
    (function () {
      var i = nearestSample(M, -52, -8), n = 7, a = across(M, i, 1, M.HW[i] + 1.0), b = across(M, i, -1, M.HW[i] + 1.0);
      for (var q = 0; q <= n; q++) {
        var t = q / n, x = lerp(a[0], b[0], t) + (R() - 0.5) * 0.1, z = lerp(a[1], b[1], t) + (R() - 0.5) * 0.1, h = terrain(x, z);
        if (h > M.WL[i] + 0.02) continue;
        var top = M.WL[i] + 0.09, r = 0.3 + R() * 0.05;
        lmB.add('lime|f', bake(cylG(r, r * 1.1, top - h + 0.05, [7, 10, 13, 16, 18, 20][D - 1]), x, (top + h) / 2 - 0.02, z, 0, R() * 3, 0));
        platforms.push({ kind: 'disc', x: x, z: z, r: r, top: top, tag: 'stones' });
      }
      crossings.push({ kind: 'stones', a: a, b: b, x: M.X[i], z: M.Z[i], floods: true });
    })();
    (function () {
      var i = nearestSample(M, -28, -4), half = M.HW[i] + Math.max(M.BWL[i], M.BWR[i]) + 1.4, a = across(M, i, 1, half), b = across(M, i, -1, half);
      var mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uz = (b[1] - a[1]) / len, rr = 0.25;
      var y0 = Math.max(terrain(a[0], a[1]), terrain(b[0], b[1])) - 0.02 + rr * 0.6;
      var g = cylG(rr, rr * 1.1, len, [9, 14, 18, 24, 28, 32][D - 1]); g.rotateX(Math.PI / 2);
      lmB.add('trunk|f', bake(g, mx, y0, mz, 0, Math.atan2(ux, uz), 0));
      var st = cylG(0.05, 0.08, 0.5, 6); lmB.add('trunk|f', bake(st, mx + ux * len * 0.2 + 0.2, y0 + 0.3, mz + uz * len * 0.2, 0.4, 0, 0.8)); lmB.add('trunk|f', bake(st, mx - ux * len * 0.3 - 0.1, y0 + 0.25, mz - uz * len * 0.3, -0.6, 0, -0.5));
      lmB.add('trunk|f', bake(new THREE.DodecahedronGeometry(0.45, 0), b[0] + ux * 0.25, y0, b[1] + uz * 0.25, 0.3, 0.2, 0.1, 1, 0.8, 1));
      platforms.push({ kind: 'box', x: mx, z: mz, ux: ux, uz: uz, hl: len / 2, hw: rr * 0.95, top: y0 + rr * 0.92, tag: 'log' });
      crossings.push({ kind: 'log', a: a, b: b, x: mx, z: mz }); spots.log = { x: mx, z: mz };
    })();
    (function () {
      var i = nearestSample(M, 12, 1), half = M.HW[i] + Math.max(M.BWL[i], M.BWR[i]) + 0.9, A = across(M, i, -1, half), B = across(M, i, 1, half);
      var ax = A[0], az = A[1], bx = B[0], bz = B[1], L = Math.hypot(bx - ax, bz - az), ang = Math.atan2(bx - ax, bz - az), mx = (ax + bx) / 2, mz = (az + bz) / 2;
      var ux = (bx - ax) / L, uz = (bz - az) / L, vx = uz, vz = -ux, top = Math.max(terrain(ax, az), terrain(bx, bz)) + 0.14, hwid = 0.6;
      for (var q = 0; q < L; q += 0.22) lmB.add('wood|f', bake(box(1.25, 0.06, 0.19), ax + ux * (q + 0.1), top - 0.03, az + uz * (q + 0.1), 0, ang, (R() - 0.5) * 0.04));
      [-1, 1].forEach(function (sd) {
        var ex = vx * sd * hwid, ez = vz * sd * hwid;
        lmB.add('wood|f', bake(box(0.08, 0.08, L), mx + ex, top + 0.72, mz + ez, 0, ang, 0)); lmB.add('wood|f', bake(box(0.06, 0.06, L), mx + ex, top + 0.38, mz + ez, 0, ang, 0));
        lmB.add('wood|f', bake(box(0.12, 0.14, L + 0.2), mx + ex * 0.92, top - 0.12, mz + ez * 0.92, 0, ang, 0));
        for (var k = 0; k <= 4; k++) { var t = k / 4, x = ax + ux * L * t + ex, z = az + uz * L * t + ez, bs = Math.min(terrain(x, z), top - 0.2); lmB.add('wood|f', bake(box(0.1, top + 0.78 - bs, 0.1), x, (top + 0.78 + bs) / 2, z, 0, ang, 0)); }
        addSeg(ax + ex * 1.05, az + ez * 1.05, bx + ex * 1.05, bz + ez * 1.05, 0.06);
      });
      platforms.push({ kind: 'box', x: mx, z: mz, ux: ux, uz: uz, hl: L / 2 + 0.15, hw: hwid + 0.02, top: top, tag: 'bridge' });
      crossings.push({ kind: 'bridge', a: A, b: B, x: mx, z: mz }); spots.bridge = { x: mx, z: mz, top: top, ang: ang };
    })();

    // ---------------- the county road: the low-water crossing (concrete slab over culverts), a flood sign and a depth gauge
    (function () {
      var i = ROADI, cz = M.Z[i], bed = M.BED[i], cx = ROADX + 1.2 * Math.sin(cz * 0.05);
      [-1.25, 0, 1.25].forEach(function (o) {
        var p = cylG(0.32, 0.32, 6.2, 12); p.rotateZ(Math.PI / 2); lmB.add('concrete|f', bake(p, cx, bed + 0.32, cz + o));
        [-1, 1].forEach(function (s) { var hole = new THREE.CircleGeometry(0.25, 10); hole.rotateY(s * Math.PI / 2); lmB.add('signK|f', bake(hole, cx + s * 3.11, bed + 0.32, cz + o)); });
      });
      [-1, 1].forEach(function (s) { lmB.add('concrete|f', bake(box(0.3, 0.75, 4.6), cx + s * 3.0, SLAB - 0.32, cz)); });
      // the yellow flood sign on each side and the depth gauge by the slab
      [[cx + 2.6, cz + 9, 0.5], [cx - 2.6, cz - 9, Math.PI + 0.5]].forEach(function (q) {
        var h = terrain(q[0], q[1]); lmB.add('post|f', bake(box(0.08, 2.0, 0.08), q[0], h + 1.0, q[1]));
        var sg = box(0.62, 0.62, 0.04); sg.rotateZ(Math.PI / 4); lmB.add('sign|f', bake(sg, q[0], h + 1.85, q[1] + 0.05, 0, q[2], 0));
        for (var k = 0; k < 3; k++) lmB.add('signK|f', bake(box(0.4 - k * 0.08, 0.04, 0.05), q[0], h + 1.95 - k * 0.12, q[1] + 0.06, 0, q[2], 0));
        addCircle(q[0], q[1], 0.12, 'post');
      });
      var gx = cx - 3.4, gz = cz + 0.9, gh = M.BED[i];
      lmB.add('white|f', bake(box(0.12, 1.9, 0.12), gx, gh + 0.95, gz));
      for (var k2 = 0; k2 < 7; k2++) lmB.add('signK|f', bake(box(0.14, 0.05, 0.14), gx, gh + 0.25 + k2 * 0.25, gz));
      addCircle(gx, gz, 0.12, 'post');
      spots.road = { x: cx, z: cz, slab: SLAB };
      crossings.push({ kind: 'slab', x: cx, z: cz, floods: true });
    })();

    // ---------------- the old railroad: ties and rails on the embankment, and the trestle over the creek
    (function () {
      var y = RAILTOP;
      for (var z = Z0 + 1; z < Z1 - 1; z += 0.62) {
        var onTr = Math.abs(z - TRESTLE.z) < TRESTLE.half;
        lmB.add('tie|f', bake(box(2.3, 0.14, 0.22), RAILX, y + 0.07, z, 0, (R() - 0.5) * 0.06, 0));
        if (onTr && R() < 0.1) continue;
      }
      [-0.72, 0.72].forEach(function (o) { lmB.add('steel|f', bake(box(0.08, 0.13, Z1 - Z0 - 2), RAILX + o, y + 0.2, 0)); lmB.add('rust|f', bake(box(0.14, 0.03, Z1 - Z0 - 2), RAILX + o, y + 0.15, 0)); });
      // trestle bents: posts down to the ground every 2.4 m, with cross bracing and a stringer each side
      for (var z2 = TRESTLE.z - TRESTLE.half; z2 <= TRESTLE.z + TRESTLE.half + 0.01; z2 += 2.4) {
        var gl = terrain(RAILX, z2), hh = y - gl;
        [-1.1, -0.4, 0.4, 1.1].forEach(function (o, k) { var p = box(0.2, hh, 0.2); lmB.add('tie|f', bake(p, RAILX + o + (k === 0 ? -0.15 : k === 3 ? 0.15 : 0), gl + hh / 2, z2, 0, 0, k === 0 ? 0.08 : k === 3 ? -0.08 : 0)); addCircle(RAILX + o, z2, 0.14, 'trestle'); });
        var br = box(0.08, Math.hypot(2.6, hh * 0.6), 0.1); br.rotateZ(Math.atan2(2.6, hh * 0.6)); lmB.add('tie|f', bake(br, RAILX, gl + hh * 0.5, z2 + 0.12));
        lmB.add('tie|f', bake(box(2.8, 0.22, 0.24), RAILX, y - 0.12, z2));
      }
      [-1.05, 1.05].forEach(function (o) { lmB.add('tie|f', bake(box(0.2, 0.3, TRESTLE.half * 2 + 0.6), RAILX + o, y - 0.3, TRESTLE.z)); });
      platforms.push({ kind: 'box', x: RAILX, z: TRESTLE.z, ux: 0, uz: 1, hl: TRESTLE.half + 0.4, hw: 1.2, top: y + 0.14, tag: 'trestle' });
      spots.trestle = { x: RAILX, z: TRESTLE.z, y: y + 0.14 };
      crossings.push({ kind: 'trestle', x: RAILX, z: TRESTLE.z });
    })();

    // ---------------- the stock pond: the windmill and the stock tank on the dam
    W.windmill = null;
    (function () {
      var wx = -48.5, wz = 33.2, h = terrain(wx, wz), top = 7.2, wm = new THREE.Group(); wm.name = 'Windmill';
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) {
        var x0 = q[0] * 1.15, z0 = q[1] * 1.15, x1 = q[0] * 0.22, z1 = q[1] * 0.22, L = Math.hypot(x1 - x0, top, z1 - z0);
        var leg = box(0.08, L, 0.08); leg.rotateZ(-Math.atan2(x1 - x0, top)); leg.rotateX(Math.atan2(z1 - z0, top)); lmB.add('windm|f', bake(leg, wx + (x0 + x1) / 2, h + top / 2, wz + (z0 + z1) / 2));
      });
      for (var k = 1; k < 5; k++) { var f = k / 5, s = lerp(1.15, 0.22, f) * 2; lmB.add('windm|f', bake(box(s, 0.05, 0.05), wx, h + top * f, wz - s / 2)); lmB.add('windm|f', bake(box(s, 0.05, 0.05), wx, h + top * f, wz + s / 2)); lmB.add('windm|f', bake(box(0.05, 0.05, s), wx - s / 2, h + top * f, wz)); lmB.add('windm|f', bake(box(0.05, 0.05, s), wx + s / 2, h + top * f, wz)); }
      lmB.add('windm|f', bake(box(0.7, 0.08, 0.7), wx, h + top, wz));
      var head = new THREE.Group(); head.position.set(wx, h + top + 0.35, wz); head.rotation.y = 0.9; wm.add(head);
      var wheel = new THREE.Group(); wheel.position.z = 0.5; head.add(wheel);
      for (var b = 0; b < 14; b++) { var bl = new THREE.Mesh(box(0.2, 1.15, 0.03), paint('windm', { flat: true })); var a = b / 14 * Math.PI * 2; bl.position.set(Math.sin(a) * 0.78, Math.cos(a) * 0.78, 0); bl.rotation.z = -a; bl.rotation.y = 0.35; bl.castShadow = true; wheel.add(bl); }
      var hub = new THREE.Mesh(cylG(0.12, 0.12, 0.2, 8), paint('steel', { flat: true })); hub.rotation.x = Math.PI / 2; wheel.add(hub);
      var tail = new THREE.Mesh(box(0.04, 0.6, 1.1), paint('windm', { flat: true })); tail.position.set(0, 0.1, -1.0); tail.castShadow = true; head.add(tail);
      var boom = new THREE.Mesh(box(0.05, 0.05, 1.4), paint('steel', { flat: true })); boom.position.set(0, 0, -0.3); head.add(boom);
      LM.add(wm); W.windmill = wheel;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { addCircle(wx + q[0] * 1.15, wz + q[1] * 1.15, 0.12, 'windmill'); });
      // the round stock tank beside it, full to the brim
      var tx = wx + 2.6, tz = wz + 0.4, th = terrain(tx, tz);
      lmB.add('steel|f', bake(new THREE.CylinderGeometry(1.35, 1.35, 0.72, 20, 1, true), tx, th + 0.36, tz));
      lmB.add('pond', bake(new THREE.CircleGeometry(1.32, 20).rotateX(-Math.PI / 2), tx, th + 0.62, tz));
      lmB.add('steel|f', bake(new THREE.TorusGeometry(1.35, 0.04, 4, 20).rotateX(Math.PI / 2), tx, th + 0.72, tz));
      addCircle(tx, tz, 1.4, 'tank'); keep.push([wx + 1.2, wz, 4.5]);
      spots.windmill = { x: wx, z: wz }; spots.tank = { x: tx, z: tz };
    })();

    // ---------------- the cave: a back wall flat enough for shadows, the rock over the mouth, a fire ring and a ledge
    (function () {
      var y = CAVE.y != null ? CAVE.y : (terrain(CAVE.cx, CAVE.cz), CAVE.y), w = CAVE.x1 - CAVE.x0, faceZ = -26.4, top = base(CAVE.cx, CAVE.z0 - 5) + 0.15;
      lmB.add('lime|f', bake(box(w + 0.4, 3.2, 0.5), CAVE.cx, y + 1.5, CAVE.z0 - 0.05));
      [-1, 1].forEach(function (s) { lmB.add('limeD|f', bake(box(0.7, 3.2, faceZ - CAVE.z0 + 0.3), CAVE.cx + s * (w / 2 + 0.2), y + 1.5, (CAVE.z0 + faceZ) / 2)); addSeg(CAVE.cx + s * (w / 2 - 0.1), CAVE.z0, CAVE.cx + s * (w / 2 - 0.1), faceZ, 0.2); });
      addSeg(CAVE.x0, CAVE.z0 + 0.3, CAVE.x1, CAVE.z0 + 0.3, 0.2);
      // the rock over the mouth, up to the top of the bluff (it opens round him like the canopies do)
      var y0 = y + 2.95, hr = top - y0, rock = rough(w + 1.6, hr, faceZ - CAVE.z0 + 1.4, 0.16, 7);
      var rm = new THREE.Mesh(rock, paint('lime', { flat: true, cut: true })); rm.position.set(CAVE.cx, y0 + hr / 2, (CAVE.z0 + faceZ) / 2 - 0.2); rm.castShadow = true; rm.receiveShadow = true; LM.add(rm);
      var band = new THREE.Mesh(rough(w + 1.75, 0.45, faceZ - CAVE.z0 + 1.5, 0.1, 6), paint('limeD', { flat: true, cut: true })); band.position.set(CAVE.cx, y0 + hr * 0.55, (CAVE.z0 + faceZ) / 2 - 0.2); LM.add(band);
      var lip = new THREE.Mesh(rough(w + 2.0, 0.55, 1.1, 0.1, 6), paint('lime', { flat: true, cut: true })); lip.position.set(CAVE.cx, y0 + 0.1, faceZ + 0.25); lip.castShadow = true; LM.add(lip);
      lmB.add('limeD|f', bake(box(w - 0.6, 0.45, 0.6), CAVE.cx, y + 0.22, CAVE.z0 + 0.55));
      for (var k = 0; k < 9; k++) { var a = k / 9 * 6.28; lmB.add('rock|f', bake(new THREE.DodecahedronGeometry(0.13, 0), CAVE.cx + Math.cos(a) * 0.45, y + 0.06, CAVE.cz + 0.9 + Math.sin(a) * 0.38, a, a * 2, 0, 1, 0.6, 1)); }
      lmB.add('char|f', bake(box(0.5, 0.05, 0.08), CAVE.cx, y + 0.06, CAVE.cz + 0.9, 0, 0.5, 0)); lmB.add('char|f', bake(box(0.45, 0.05, 0.08), CAVE.cx, y + 0.08, CAVE.cz + 0.9, 0, -0.6, 0));
      addCircle(CAVE.cx, CAVE.cz + 0.9, 0.5, 'firering');
      spots.cave = { x: CAVE.cx, z: CAVE.cz + 1.9, face: Math.PI, y: y, ledge: { x: CAVE.cx, y: y + 0.45, z: CAVE.z0 + 0.55 }, wall: { z: CAVE.z0 + 0.2 }, fire: { x: CAVE.cx, z: CAVE.cz + 0.9 } };
      keep.push([CAVE.cx, CAVE.cz + 1, 4]);
    })();

    // ---------------- the spring grotto: rock overhanging the pool where Teal Branch begins (it opens to the east)
    (function () {
      var y = GROTTO.y != null ? GROTTO.y : (terrain(31, 58.7), GROTTO.y), faceX = 31.8, top = base(24, 58.7) + 0.15, d = GROTTO.z1 - GROTTO.z0;
      lmB.add('lime|f', bake(box(0.5, 2.4, d + 0.2), GROTTO.x0 - 0.1, y + 0.9, (GROTTO.z0 + GROTTO.z1) / 2));
      [-1, 1].forEach(function (s) { lmB.add('limeD|f', bake(box(faceX - GROTTO.x0 + 0.3, 2.4, 0.7), (GROTTO.x0 + faceX) / 2, y + 0.9, (GROTTO.z0 + GROTTO.z1) / 2 + s * (d / 2 + 0.2))); });
      var y0 = y + 2.1, hr = top - y0, rm = new THREE.Mesh(rough(faceX - GROTTO.x0 + 1.4, hr, d + 1.6, 0.16, 5), paint('lime', { flat: true, cut: true }));
      rm.position.set((GROTTO.x0 + faceX) / 2 - 0.2, y0 + hr / 2, (GROTTO.z0 + GROTTO.z1) / 2); rm.castShadow = true; rm.receiveShadow = true; LM.add(rm);
      var lip = new THREE.Mesh(rough(1.0, 0.5, d + 2.0, 0.08, 6), paint('lime', { flat: true, cut: true })); lip.position.set(faceX + 0.2, y0 + 0.1, (GROTTO.z0 + GROTTO.z1) / 2); lip.castShadow = true; LM.add(lip);
      spots.poems.spring = { x: 34.0, z: 56.4, face: Math.atan2(31.0 - 34.0, 58.7 - 56.4), label: 'The spring' };
      spots.spring = { x: 31.0, z: 58.7 }; keep.push([31.5, 58.7, 4]);
    })();

    // ---------------- the Dry Falls: a lip of limestone over the plunge pool, and the flat rock beside it
    (function () {
      var c = CHI.dry, i = nearestSample(c, -15.5, -45.8), y = c.BED[Math.max(0, i - 4)];
      lmB.add('lime|f', bake(rbox(4.8, 0.5, 1.2, 0.3, 2), c.X[i], y + 0.05, c.Z[i] - 0.6, 0, 0.05, 0));
      var j = nearestSample(c, -15.8, -42), pr = across(c, j, 1, c.HW[j] + 0.35), h = terrain(pr[0], pr[1]), top = Math.max(h + 0.25, c.WL[j] + 0.2);
      lmB.add('lime|f', bake(cylG(0.9, 1.0, top - h + 0.3, [8, 12, 16, 20, 24, 28][D - 1]), pr[0], (top + h) / 2 - 0.15, pr[1], 0, 0.3, 0, 1, 1, 0.8));
      platforms.push({ kind: 'disc', x: pr[0], z: pr[1], r: 0.82, top: top, tag: 'flatrock' });
      spots.poems.rock = { x: pr[0], z: pr[1], face: Math.atan2(c.X[j] - pr[0], c.Z[j] - pr[1]), label: 'The flat rock', y: top };
      spots.falls = { x: c.X[i], z: c.Z[i], top: y }; keep.push([pr[0], pr[1], 2]);
    })();

    // ---------------- the lookout on the bluff, with a rail along the edge
    (function () {
      var t = TRAILS.filter(function (q) { return q.id === 'bluff'; })[0], ex = t.X[t.n - 1], ez = t.Z[t.n - 1], h = terrain(ex, ez);
      for (var k = 0; k < 6; k++) { var x = ex - 4 + k * 1.6, z = ez + 2.6 - Math.abs(k - 2.5) * 0.15, hh = terrain(x, z); lmB.add('post|f', bake(box(0.1, 1.0, 0.1), x, hh + 0.5, z)); addCircle(x, z, 0.1, 'rail'); }
      lmB.add('wood|f', bake(box(8.2, 0.07, 0.07), ex, h + 0.95, ez + 2.4)); addSeg(ex - 4.2, ez + 2.45, ex + 4.2, ez + 2.45, 0.1);
      var b = bench(ex - 2.2, ez + 0.9, Math.PI * 0.95); b.label = 'The lookout'; spots.poems.lookout = b; benches.push(b);
      spots.lookout = { x: ex, z: ez }; keep.push([ex, ez, 3]);
    })();

    // ---------------- the old oak on the lower creek: rope swing and a reading stump (placed after the trees are laid out)

    // ================================================================ trees, bushes and rocks: laid out once for the whole valley
    keep.push([-79, 27.5, 3.5], [50, 6, 4]);   // the lone oak in the pond meadow, the Blue Hole
    var treeList = [], bushList = [], rockList = [], ledgeList = [];
    var TRH = new Array(HNX * HNZ);
    function treeDens(x, z) {
      var p = probe(x, z), h = p.h;
      if (p.trail >= 0) { var T = TRAILS[p.trail]; if (p.td < (T.road ? 4.2 : T.rail ? 5.5 : T.w + 1.4)) return 0; }
      if (p.ch >= 0 && p.d < p.hw + p.bw * 0.5) return 0;
      if (p.pond > 0 && p.pond < 1.25) return 0;
      var hx = terrain(x + 0.6, z) - h, hz = terrain(x, z + 0.6) - h, slope = Math.hypot(hx, hz) / 0.6;
      if (slope > 1.0) return 0.04;
      var da = bil(DA, x, z), sb = bil(SB, x, z), sh = bil(SH, x, z), n = Math.sin(x * 0.09 + 1.7) * Math.cos(z * 0.11 - 0.4) + 0.5 * Math.sin(x * 0.23 + z * 0.17);
      if (Math.abs(x) > 99 || Math.abs(z) > 67) return 0.75;
      if (sb > 3) return n > 0.1 ? 0.55 : 0.18;
      if (sh > 2.5) return 0.45;
      if (Math.hypot(x - POND.x, z - POND.z) < 22) return 0.04;
      if (da < 11) return 0.5;
      return n > 0.55 ? 0.55 : 0.06;
    }
    function treeKind(x, z, RN) {
      var da = bil(DA, x, z), sb = bil(SB, x, z), sh = bil(SH, x, z), r = RN();
      if (sb > 3) return r < 0.66 ? 'cedar' : r < 0.92 ? 'oak' : 'gold';
      if (sh > 2.5) return r < 0.45 ? 'oak' : r < 0.85 ? 'cedar' : 'gold';
      if (da < 6) return r < 0.38 ? 'syc' : r < 0.66 ? 'elm' : r < 0.86 ? 'pecan' : 'gold';
      if (da < 11) return r < 0.3 ? 'elm' : r < 0.55 ? 'pecan' : r < 0.75 ? 'oak' : r < 0.88 ? 'cedar' : 'gold';
      return r < 0.55 ? 'oak' : r < 0.75 ? 'elm' : r < 0.9 ? 'cedar' : 'gold';
    }
    (function () {
      var RT = rnd(1201), cs = 3.3;
      for (var gz = BOUND.z0 - 4; gz < BOUND.z1 + 4; gz += cs) for (var gx = BOUND.x0 - 4; gx < BOUND.x1 + 4; gx += cs) {
        var x = gx + RT() * cs, z = gz + RT() * cs, a = RT(), b = RT();
        if (a > treeDens(x, z) || !farFromKeep(x, z, 1.4)) continue;
        var kind = treeKind(x, z, function () { return b; }), sz = 0.85 + RT() * 0.5;
        if (kind === 'pecan') sz *= 1.25; if (kind === 'syc') sz *= 1.05;
        var cr = kind === 'cedar' ? 0.8 * sz : (1.15 + 0.2) * sz, rr = kind === 'cedar' ? 0.9 : 1.25 * sz, ok = true;
        var near = hashGet(TRH, x, z); if (near) for (var q = 0; q < near.length; q++) { var o = near[q]; if (Math.hypot(o.x - x, o.z - z) < (rr + o.rr) * 0.8) { ok = false; break; } }
        if (!ok) continue;
        var t = { x: x, z: z, kind: kind, sz: sz, seed: (hash2(Math.round(x * 10), Math.round(z * 10)) % 100000) + 17, cr: cr, rr: rr };
        treeList.push(t); hashAdd(TRH, x - 3, z - 3, x + 3, z + 3, t);
        addCircle(x, z, kind === 'cedar' ? 0.22 * sz : 0.26 * sz * 0.8 + 0.08, 'tree');
        if (kind === 'gold' || kind === 'syc') { var sd = { x: x, z: z, r: cr * 0.8 }; SHADE.push(sd); hashAdd(SHASH, x - sd.r, z - sd.r, x + sd.r, z + sd.r, sd); }
      }
    })();
    // the old oak by the lower creek, with a branch over the water, a rope swing and a stump to read on
    W.swing = null;
    (function () {
      var i = nearestSample(M, 88, 9), p = across(M, i, 1, M.HW[i] + M.BWR[i] + 2.2), x = p[0], z = p[1];
      var t = { x: x, z: z, kind: 'bigoak', sz: 1.55, seed: 4242, cr: 1.8, rr: 2 }; treeList.push(t); hashAdd(TRH, x - 3, z - 3, x + 3, z + 3, t);
      addCircle(x, z, 0.45, 'tree'); keep.push([x, z, 3.5]);
      var h = terrain(x, z), th = 2.6, by = h + th * 0.95, c = [M.X[i], M.Z[i]], bx = (x + c[0]) / 2, bz = (z + c[1]) / 2, L = Math.hypot(c[0] - x, c[1] - z), ang = Math.atan2(c[0] - x, c[1] - z);
      lmB.add('trunk|f', bake(box(0.2, 0.2, L + 0.5), bx, by + 0.1, bz, -0.1, ang, 0));
      var sw = new THREE.Group(); sw.position.set(c[0], by, c[1]); sw.rotation.order = 'YXZ'; sw.rotation.y = ang; sw.name = 'RopeSwing';
      var ropeLen = by - M.WL[i] - 0.55;
      [-0.18, 0.18].forEach(function (o) { var r = new THREE.Mesh(box(0.025, ropeLen, 0.025), paint('rope')); r.position.set(o, -ropeLen / 2, 0); r.castShadow = true; sw.add(r); });
      var seat = new THREE.Mesh(box(0.46, 0.05, 0.16), paint('wood', { flat: true })); seat.position.set(0, -ropeLen, 0); seat.castShadow = true; sw.add(seat);
      LM.add(sw); W.swing = sw;
      var sl = M.TX[i], sz2 = M.TZ[i], sp = [x + sl * 1.9 - (c[0] - x) / L * 0.2, z + sz2 * 1.9 - (c[1] - z) / L * 0.2], sh = terrain(sp[0], sp[1]);
      var stump = new THREE.Mesh(cylG(0.32, 0.4, 0.42, 9), paint('trunk', { flat: true })); stump.position.set(sp[0], sh + 0.18, sp[1]); stump.castShadow = true; stump.receiveShadow = true; LM.add(stump);
      var top = new THREE.Mesh(cylG(0.3, 0.3, 0.02, 9), paint('path', { flat: true })); top.position.set(sp[0], sh + 0.4, sp[1]); LM.add(top);
      addCircle(sp[0], sp[1], 0.38, 'stump');
      var fx = (c[0] - sp[0]), fz = (c[1] - sp[1]), fl = Math.hypot(fx, fz);
      spots.poems.oak = { x: sp[0] + fx / fl * 0.7, z: sp[1] + fz / fl * 0.7, face: Math.atan2(fx, fz), label: 'The old oak' };
      // six more poem stops (the polished version): flat dry ground, clear of the paths, above the flood line, each facing what its poem is about
      [['heron', 'The Heron Pool', -60, -1.2, -62, -5.2], ['bridge', 'The footbridge', 10.5, 4.8, 12, 1], ['crossing', 'The low-water crossing', 69.8, 2.5, 72.4, 6.1],
        ['pond', 'The stock pond', -48, 46, -62, 42], ['trestle', 'The trestle', 99, 4, 96, 9.3], ['bluehole', 'The Blue Hole', 52, 10, 49.8, 5.6]].forEach(function (q) { spots.poems[q[0]] = { x: q[2], z: q[3], face: Math.atan2(q[4] - q[2], q[5] - q[3]), label: q[1] }; });
      spots.stumpTop = [sp[0], sh + 0.41, sp[1]]; spots.swing = { x: c[0], z: c[1] };
    })();
    // bushes at the feet of trees and along the bank tops (they block his way, like the trees)
    (function () {
      var BR = rnd(73), made = 0, tries = 0, want = 900;
      while (made < want && tries++ < want * 12) {
        var x, z;
        if (BR() < 0.35) { var ci = BR() < 0.75 ? 0 : (BR() < 0.5 ? 1 : 2), c = CH[ci], i = (BR() * c.n) | 0, sd = BR() < 0.5 ? -1 : 1, p = across(c, i, sd, c.HW[i] + (sd < 0 ? c.BWL[i] : c.BWR[i]) + 0.4 + BR() * 1.6); x = p[0]; z = p[1]; }
        else { var t = treeList[(BR() * treeList.length) | 0], a = BR() * 6.28, r = (t.cr || 1) * (0.6 + BR() * 0.5); x = t.x + Math.cos(a) * r; z = t.z + Math.sin(a) * r; }
        if (x < BOUND.x0 - 3 || x > BOUND.x1 + 3 || z < BOUND.z0 - 3 || z > BOUND.z1 + 3) continue;
        var p2 = probe(x, z); if (p2.trail >= 0 && p2.td < (TRAILS[p2.trail].road || TRAILS[p2.trail].rail ? 4 : 1.4)) continue;
        if (p2.h < p2.hb - 0.1 || (p2.pond > 0 && p2.pond < 1.3) || !farFromKeep(x, z, 0.4)) continue;
        var sz = 0.32 + BR() * 0.28, b = { x: x, z: z, sz: sz, nb: 2 + (BR() * 2 | 0), key: BR() < 0.5 ? 'bush' : 'oak2', seed: (BR() * 1e6) | 0 };
        bushList.push(b); addCircle(x, z, sz * 0.85, 'bush'); made++;
      }
    })();
    // boulders in and beside the creeks, white rocks in the Dry Fork, blocks fallen from the bluff; ledges of limestone on the cut banks and the bluff face
    (function () {
      var RK = rnd(331);
      CH.forEach(function (c) {
        var n = c.id === 'main' ? 120 : c.id === 'dry' ? 90 : 26;
        for (var q = 0; q < n; q++) {
          var i = (RK() * c.n) | 0, sd = RK() * 2 - 1, inBed = RK() < 0.55, d = inBed ? Math.abs(sd) * c.HW[i] * 0.9 : c.HW[i] + RK() * 1.4, p = across(c, i, sd < 0 ? -1 : 1, d);
          var r = c.id === 'teal' ? 0.08 + RK() * 0.12 : inBed ? 0.1 + RK() * 0.16 : 0.2 + RK() * 0.3;
          if (!farFromKeep(p[0], p[1], 0.3) || nearTrail(p[0], p[1], 1.1)) continue;
          var nt = false; crossings.forEach(function (cr) { if (Math.hypot(cr.x - p[0], cr.z - p[1]) < 2.4) nt = true; }); if (nt) continue;
          rockList.push({ x: p[0], z: p[1], r: r, key: c.id === 'dry' ? 'lime' : 'rock', seed: (RK() * 1e6) | 0 });
          if (r > 0.18) addCircle(p[0], p[1], r * 0.9, 'rock');
        }
        // ledges along the outside of bends
        var nl = c.id === 'teal' ? 20 : 110;
        for (q = 0; q < nl; q++) {
          var j = (RK() * c.n) | 0, side = RK() < 0.5 ? -1 : 1, inside = side * clamp(-c.K[j] * 9, -1, 1);
          if (inside > 0 && c.id !== 'dry') continue;
          var bw = side < 0 ? c.BWL[j] : c.BWR[j], pp = across(c, j, side, c.HW[j] + bw * (0.3 + RK() * 0.5)); if (nearTrail(pp[0], pp[1], 1.3) || !farFromKeep(pp[0], pp[1], 0.3)) continue;
          ledgeList.push({ x: pp[0], z: pp[1], w: 0.5 + RK() * 0.7, h: 0.12 + RK() * 0.1, d: 0.3 + RK() * 0.3, yaw: Math.atan2(c.TX[j], c.TZ[j]) + Math.PI / 2 + (RK() - 0.5) * 0.5, rx: (RK() - 0.5) * 0.2, rz: (RK() - 0.5) * 0.25, seed: (RK() * 1e6) | 0 });
        }
      });
      // blocks fallen at the foot of the bluff and slabs of rock standing out of its face
      for (var q2 = 0; q2 < 260; q2++) {
        var k = 1 + (RK() * (FACE.length - 3)) | 0, f = RK(), a = FACE[k], b = FACE[k + 1], x = lerp(a[0], b[0], f), z = lerp(a[1], b[1], f);
        if (x < BOUND.x0 || x > BOUND.x1) continue;
        var nx = (b[1] - a[1]), nz = -(b[0] - a[0]), nl2 = Math.hypot(nx, nz) || 1; nx /= nl2; nz /= nl2;   // points out of the plateau (south)
        if (RK() < 0.45) { var o = 0.8 + RK() * 2.4, bx = x + nx * o, bz = z + nz * o; if (!farFromKeep(bx, bz, 0.3) || nearTrail(bx, bz, 1.1)) continue; var r2 = 0.25 + RK() * 0.45; rockList.push({ x: bx, z: bz, r: r2, key: RK() < 0.6 ? 'lime' : 'limeD', seed: (RK() * 1e6) | 0 }); addCircle(bx, bz, r2 * 0.85, 'rock'); }
        else { var oo = 0.3 + RK() * 1.6; if (nearTrail(x + nx * oo, z + nz * oo, 1.4)) continue; ledgeList.push({ x: x + nx * oo, z: z + nz * oo, w: 0.8 + RK() * 1.4, h: 0.16 + RK() * 0.14, d: 0.5 + RK() * 0.4, yaw: Math.atan2(b[0] - a[0], b[1] - a[1]) + Math.PI / 2, rx: 0, rz: (RK() - 0.5) * 0.1, seed: (RK() * 1e6) | 0, face: true }); }
      }
    })();
    W.trees = treeList; W.bushes = bushList; W.crossings = crossings; W.benches = benches;

    // ================================================================ spots for the creatures and the finds
    (function () {
      function bankPt(c, x, z, side, extra) { var i = nearestSample(c, x, z), p = across(c, i, side, c.HW[i] * (extra == null ? 0.5 : extra)); return p; }
      spots.start = [-99.5, 12.2]; spots.startYaw = Math.PI * 0.62;
      spots.perches = [bankPt(M, -62, -6, 1, 0.55), bankPt(M, 50, 6, -1, 0.6), bankPt(M, 12, 1, 1, 0.45), bankPt(M, 84, 10, -1, 0.4), bankPt(M, -84, -3, -1, 0.35), [POND.x - 6, POND.z + 6.6], [POND.x + 8.6, POND.z + 3]];
      spots.pools = [{ x: CH[0].X[nearestSample(M, -62, -6)], z: CH[0].Z[nearestSample(M, -62, -6)], r: 1.4 }, { x: M.X[nearestSample(M, 50, 6)], z: M.Z[nearestSample(M, 50, 6)], r: 1.9 }, { x: M.X[nearestSample(M, 12, 1)], z: M.Z[nearestSample(M, 12, 1)], r: 1.0 }, { x: 31.0, z: 58.7, r: 1.1, ch: 'teal' }, { x: POND.x, z: POND.z, r: 4.5, ch: 'pond' }];
      spots.frogs = [[POND.x - 9.6, POND.z + 2], [POND.x + 4, POND.z + 7.7], [POND.x + 10.4, POND.z - 2], bankPt(CHI.teal, 36, 40, 1, 1.25), bankPt(CHI.teal, 35, 20, -1, 1.25), bankPt(M, -40, -8, 1, 1.1), bankPt(M, 24, -2, -1, 1.1)];
      spots.dragon = [[-24, M.Z[nearestSample(M, -24, -5)]], [-6, M.Z[nearestSample(M, -6, -3)]], [40, M.Z[nearestSample(M, 40, 3)]], [POND.x, POND.z], [62, M.Z[nearestSample(M, 62, 3)]], [-80, M.Z[nearestSample(M, -80, -4)]]];
      spots.butterflies = [[-86, 20], [-40, 18], [0, 22], [-20, 40], [50, 28], [-60, 18], [20, -40]];
      spots.ducks = [{ x: 31.0, z: 58.7, r: 0.9 }, { x: POND.x + 2, z: POND.z + 1, r: 4 }];
      spots.turtleLog = { x: POND.x + 5.5, z: POND.z - 2.5, y: pondWL() + 0.04, ang: 0.4, len: 2.6 };
      // the turtle log floats at the pond's edge
      var g = cylG(0.17, 0.19, 2.6, [8, 12, 16, 20, 24, 28][D - 1]); g.rotateZ(Math.PI / 2); lmB.add('trunk|f', bake(g, spots.turtleLog.x, spots.turtleLog.y, spots.turtleLog.z, 0, 0.4, 0.03));
    })();
    // ---------------- the lone post oak in the pond meadow that the second storm will strike (two versions, swapped by setStruck)
    W.lightning = null;
    (function () {
      var x = -79, z = 27.5, h = terrain(x, z), TR = rnd(909), whole = new THREE.Group(), struck = new THREE.Group(); whole.name = 'LoneOak'; struck.name = 'StruckOak';
      var B1 = new Batch(); buildTree(B1, { x: x, z: z, kind: 'oak', sz: 1.5, seed: 909 }, Math.max(2, D)); B1.build(whole);
      var B2 = new Batch(), th = 3.4;
      B2.add('char|f', bake(new THREE.CylinderGeometry(0.22, 0.42, th, 8, 2, true), x - 0.12, h + th / 2, z, 0, 0, 0.09));
      B2.add('char|f', bake(new THREE.CylinderGeometry(0.12, 0.26, 2.2, 7, 1, true), x + 0.35, h + 2.0, z + 0.1, 0.2, 0, -0.55));
      B2.add('trunk|f', bake(new THREE.CylinderGeometry(0.05, 0.2, 2.6, 6), x + 1.6, h + 0.25, z + 0.9, Math.PI / 2 - 0.1, 0.4, 0));
      B2.add('oak|f', bake(new THREE.IcosahedronGeometry(0.9, 1), x + 2.6, h + 0.55, z + 1.5, 0.3, 0.2, 0, 1.2, 0.55, 1));
      for (var k = 0; k < 10; k++) { var a = k / 10 * 6.28; B2.add('rock|f', bake(new THREE.DodecahedronGeometry(0.12, 0), x + 1.0 + Math.cos(a) * 0.55, h + 0.05, z + 1.2 + Math.sin(a) * 0.45, a, a, 0, 1, 0.6, 1)); }
      B2.add('char|f', bake(new THREE.CircleGeometry(0.5, 10).rotateX(-Math.PI / 2), x + 1.0, h + 0.03, z + 1.2));
      B2.build(struck); struck.visible = false;
      LM.add(whole); LM.add(struck); addCircle(x, z, 0.45, 'tree'); keep.push([x, z, 3]);
      spots.lightning = { x: x, z: z };
      W.lightning = { whole: whole, struck: struck, x: x, z: z, fire: [x + 1.0, z + 1.2] };
    })();
    W.setStruck = function (on) { if (!W.lightning) return; W.lightning.whole.visible = !on; W.lightning.struck.visible = !!on; };
    // ---------------- the Blue Hole: a dead snag standing in the deep water, reached along a sunken shelf (waders)
    (function () {
      var i = nearestSample(M, 50, 6), c = M, side = -1, edge = across(c, i, side, c.HW[i] + 0.4), tip = across(c, i, side, c.HW[i] * 0.35);
      var len = Math.hypot(tip[0] - edge[0], tip[1] - edge[1]), mx = (tip[0] + edge[0]) / 2, mz = (tip[1] + edge[1]) / 2, ux = (tip[0] - edge[0]) / len, uz = (tip[1] - edge[1]) / len;
      var top = c.WL[i] - 0.74;
      lmB.add('limeD|f', bake(box(1.1, 0.4, len + 0.6), mx, top - 0.2, mz, 0, Math.atan2(ux, uz), 0));
      platforms.push({ kind: 'box', x: mx, z: mz, ux: ux, uz: uz, hl: len / 2 + 0.3, hw: 0.55, top: top, tag: 'shelf' });
      var sx2 = tip[0] + ux * 0.3, sz2 = tip[1] + uz * 0.3, by = top;
      lmB.add('char|f', bake(new THREE.CylinderGeometry(0.06, 0.11, 1.9, 6), sx2, by + 0.95, sz2, 0.12, 0, 0.1));
      lmB.add('char|f', bake(new THREE.CylinderGeometry(0.035, 0.06, 0.8, 5), sx2 + 0.22, by + 1.5, sz2, 0, 0, -0.7));
      lmB.add('char|f', bake(new THREE.CylinderGeometry(0.03, 0.05, 0.6, 5), sx2 - 0.16, by + 1.35, sz2 + 0.05, 0.3, 0, 0.8));
      addCircle(sx2, sz2, 0.14, 'snag');
      spots.snag = { x: tip[0], z: tip[1], y: c.WL[i] + 0.1 };
    })();
    lmB.build(LM);

    // ================================================================ where finds lie: resolve a place description to a spot he can reach
    function okSpot(x, z, deep) {
      var h = terrain(x, z), hx = terrain(x + 0.3, z) - terrain(x - 0.3, z), hz = terrain(x, z + 0.3) - terrain(x, z - 0.3);
      if (Math.hypot(hx, hz) / 0.6 > 0.9) return false;
      var l = hashGet(CHASH, x, z); if (l) for (var q = 0; q < l.length; q++) { var c = l[q]; if (c.ax == null && Math.hypot(c.x - x, c.z - z) < c.r + 0.35) return false; }
      if (!deep) { var wl = water(x, z); if (wl != null && wl - h > 0.16) return false; }
      return true;
    }
    W.nudge = function (x, z, deep) {
      for (var r = 0; r < 5; r += 0.25) { var n = r ? Math.ceil(6.28 * r / 0.3) : 1; for (var k = 0; k < n; k++) { var a = k / n * 6.283, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r; if (okSpot(px, pz, deep)) return [px, pz]; } }
      return [x, z];
    };
    var NEARS = null;
    W.resolve = function (wh, deep) {
      if (!NEARS) {
        var st = crossings.filter(function (c) { return c.kind === 'stones'; })[0];
        NEARS = { bridge: spots.bridge, windmill: spots.windmill, trestle: spots.trestle, road: spots.road, lookout: spots.lookout, cave: spots.cave, pool0: DRYPOOLS[0], stones: { x: st.x, z: st.z },
          bench: spots.poems.bench.seat, oak: { x: spots.stumpTop[0], z: spots.stumpTop[2] }, studio: spots.studio, spring: spots.spring, springpoem: spots.poems.spring, lightning: { x: W.lightning.fire[0] - 1, z: W.lightning.fire[1] - 1.2 },
          truck: { x: spots.truck.item[0], z: spots.truck.item[1], y: spots.truck.y, fixed: true }, studioIn: { x: spots.studioIn.x, z: spots.studioIn.z, y: spots.studioIn.y, fixed: true }, snag: { x: spots.snag.x, z: spots.snag.z, y: spots.snag.y, fixed: true } };
      }
      var x = 0, z = 0, y = null, fixed = false;
      if (wh.xz) { x = wh.xz[0]; z = wh.xz[1]; }
      else if (wh.bank) { var c = CHI[wh.bank], i = nearestSample(c, wh.x, wh.z), side = wh.side != null ? wh.side : (c.K[i] > 0 ? -1 : 1), bw = side < 0 ? c.BWL[i] : c.BWR[i], f = wh.f == null ? 0.5 : wh.f, d = f >= 0 ? c.HW[i] + bw * f : c.HW[i] * (1 + f), p = across(c, i, side, d); x = p[0]; z = p[1]; }
      else if (wh.pond != null) { x = POND.x + Math.cos(wh.a) * POND.rx * wh.pond; z = POND.z + Math.sin(wh.a) * POND.rz * wh.pond; }
      else if (wh.tree) { var best = null, bd = 1e9; treeList.forEach(function (t) { if (t.kind !== wh.tree) return; var dd = Math.hypot(t.x - wh.x, t.z - wh.z); if (dd < bd) { bd = dd; best = t; } }); if (best) { x = best.x + (best.cr || 1) * 0.55; z = best.z + (best.cr || 1) * 0.45; } else { x = wh.x; z = wh.z; } }
      else if (wh.near) { var sp = NEARS[wh.near]; x = sp.x + (wh.dx || 0); z = sp.z + (wh.dz || 0); if (sp.fixed) { fixed = true; y = sp.y; } }
      if (deep) { var sn = NEARS.snag; return [sn.x, sn.z, sn.y]; }
      if (fixed) return [x, z, y];
      var q = W.nudge(x, z, false); return [q[0], q[1], null];
    };

    // ================================================================ tree shapes (the creek game's, from one seed each)
    function trunk(B, key, x, h, z, tw, th, TR, lean, Dd) {
      if (Dd < 2) { B.add(key + '|f', bake(box(tw, th + 0.3, tw), x, h + th / 2 - 0.1, z, 0, TR() * 3, lean)); return; }
      var sides = [0, 6, 9, 12, 14, 16][Dd - 1];
      B.add(key + '|f', bake(new THREE.CylinderGeometry(tw * 0.42, tw * 0.62, th + 0.3, sides, Dd > 4 ? 4 : Dd > 2 ? 3 : 1, true), x, h + th / 2 - 0.1, z, 0, TR() * 3, lean));
      B.add(key + '|f', bake(new THREE.CylinderGeometry(tw * 0.6, tw * 1.0, 0.35, sides, 1, true), x, h + 0.12, z, 0, TR() * 3, 0));
      var nr = [0, 0, 3, 4, 5, 5][Dd - 1];
      for (var q = 0; q < nr; q++) { var a = q / nr * 6.28 + TR(); B.add(key + '|f', bake(new THREE.CylinderGeometry(tw * 0.08, tw * 0.22, tw * 1.4, 5, 1, true), x + Math.cos(a) * tw * 0.55, h + 0.05, z + Math.sin(a) * tw * 0.55, Math.sin(a) * 1.25, 0, -Math.cos(a) * 1.25)); }
    }
    function blob(B, key, r, x, y, z, TR, sy, Dd) {
      if (Dd > 2) {
        var g = lumpy(new THREE.IcosahedronGeometry(r * 0.94, Dd > 5 && r > 1.45 ? 3 : Dd > 4 ? (r > 0.55 ? 2 : 1) : Dd > 3 && r > 0.95 ? 2 : r > 0.45 ? 1 : 0), 0.1, TR);
        B.add(key + '|f|c', bake(g, x, y, z, TR() * 3, TR() * 3, TR() * 3, 1, sy || 0.8, 1)); return;
      }
      B.add(key + '|f|c', bake(new THREE.IcosahedronGeometry(r, Dd > 1 && r > 1.0 ? 1 : 0), x, y, z, TR() * 3, TR() * 3, TR() * 3, 1, sy || 0.8, 1));
      if (Dd > 1) { var a = TR() * 6.28, e = TR() * 1.2, rr = r * (0.28 + TR() * 0.12); B.add(key + '|f|c', bake(new THREE.IcosahedronGeometry(rr, 0), x + Math.cos(a) * Math.cos(e) * r * 0.85, y + Math.sin(e) * r * 0.7, z + Math.sin(a) * Math.cos(e) * r * 0.85, TR() * 3, TR() * 3, TR() * 3, 1)); }
    }
    function buildTree(B, t, Dd) {
      var TR = rnd(t.seed), x = t.x, z = t.z, h = terrain(x, z), sz = t.sz;
      if (t.kind === 'cedar') {
        var th0 = 0.5 * sz; trunk(B, 'trunk', x, h, z, 0.18 * sz, th0, TR, 0, Dd);
        var tiers = Dd < 3 ? 3 : Dd < 5 ? 4 : 5, sides = [7, 9, 11, 14, 16, 18][Dd - 1];
        for (var q = 0; q < tiers; q++) { var f = q / (tiers - 1); B.add('cedar|f|c', bake(new THREE.ConeGeometry((0.95 - f * 0.5) * sz, (1.3 - f * 0.3) * sz, sides, Math.min(Dd, 4)), x, h + th0 + (0.55 + f * 1.5) * sz, z, 0, TR() * 3, 0)); }
        t.top = h + th0 + 2.8 * sz; return;
      }
      if (t.kind === 'syc') {
        var th = (2.2 + TR() * 0.6) * sz, tw = 0.26 * sz; trunk(B, 'syc', x, h, z, tw, th, TR, (TR() - 0.5) * 0.12, Dd);
        var cr = 1.05 * sz; for (var k = 0; k < 3; k++) { var a = k / 3 * 6.28 + TR(), rad = k ? cr * 0.6 : 0; blob(B, 'elm', cr * (k ? 0.7 : 1), x + Math.cos(a) * rad, h + th + cr * 0.5 + (k ? 0.3 : 0.2), z + Math.sin(a) * rad, TR, 0.85, Dd); }
        t.top = h + th + cr * 1.5; return;
      }
      // oak shapes: live oak (dark), elm, pecan (big and spreading), the October gold ones, and the old oak by the swing
      var leaf = t.kind === 'oak' || t.kind === 'bigoak' ? 'oak' : t.kind === 'pecan' ? 'pecan' : t.kind === 'gold' ? 'gold' : 'elm';
      var th2 = (1.5 + TR() * 0.7) * sz * (t.kind === 'pecan' ? 1.15 : 1), tw2 = (0.28 + TR() * 0.1) * sz;
      trunk(B, 'trunk', x, h, z, tw2, th2, TR, (TR() - 0.5) * 0.08, Dd);
      var nbr = [1, 1, 2, 3, 3, 4][Dd - 1];
      for (var b = 0; b < nbr; b++) {
        var br = Dd < 2 ? box(tw2 * 0.5, th2 * 0.6, tw2 * 0.5) : new THREE.CylinderGeometry(tw2 * 0.16, tw2 * 0.28, th2 * 0.6, 6), ba = TR() * 6;
        B.add('trunk|f', bake(br, x + Math.cos(ba) * th2 * 0.18, h + th2 * 0.88, z + Math.sin(ba) * th2 * 0.18, Math.sin(ba) * 0.6, 0, -Math.cos(ba) * 0.6));
      }
      var nb = 3 + (TR() * 3 | 0), cr2 = (1.15 + TR() * 0.45) * sz * (t.kind === 'pecan' ? 1.1 : 1);
      for (var q2 = 0; q2 < nb; q2++) {
        var a2 = q2 / nb * 6.28 + TR(), rad2 = q2 === 0 ? 0 : cr2 * (0.55 + TR() * 0.25), r2 = cr2 * (q2 === 0 ? 1 : 0.62 + TR() * 0.25);
        blob(B, q2 % 2 && leaf === 'oak' ? 'oak2' : leaf, r2, x + Math.cos(a2) * rad2, h + th2 + cr2 * 0.55 + (q2 ? TR() * 0.4 * sz : 0.3 * sz), z + Math.sin(a2) * rad2, TR, null, Dd);
      }
      t.top = h + th2 + cr2 * 1.6; t.cr = cr2;
    }
    function farTree(B, t) {
      var h = terrain(t.x, t.z), sz = t.sz;
      if (t.kind === 'cedar') { B.add('cedar|f', bake(new THREE.ConeGeometry(0.9 * sz, 2.6 * sz, 6), t.x, h + 1.55 * sz, t.z)); return; }
      var leaf = t.kind === 'syc' ? 'elm' : t.kind === 'oak' || t.kind === 'bigoak' ? 'oak' : t.kind === 'pecan' ? 'pecan' : t.kind === 'gold' ? 'gold' : 'elm', th = (t.kind === 'syc' ? 2.4 : 1.8) * sz, cr = (t.kind === 'syc' ? 1.1 : 1.4) * sz;
      B.add('trunk|f', bake(box(0.3 * sz, th, 0.3 * sz), t.x, h + th / 2, t.z));
      B.add(leaf + '|f', bake(new THREE.IcosahedronGeometry(cr, 0), t.x, h + th + cr * 0.6, t.z, 0, (t.seed % 7), 0, 1.15, 0.8, 1.15));
    }

    // ================================================================ tiles: near ones at full detail (streamed), far ones light and always there
    var CSD = [0.5, 0.4, 0.32, 0.25, 0.2, 0.2], TIL = [];
    for (var tj = 0; tj < NTZ; tj++) for (var ti = 0; ti < NTX; ti++) TIL.push({ i: ti, j: tj, x0: X0 + ti * TILE, z0: Z0 + tj * TILE, far: null, near: null, job: null, trees: [], bushes: [], rocks: [], ledges: [] });
    function tileIndex(x, z) { var i = Math.floor((x - X0) / TILE), j = Math.floor((z - Z0) / TILE); if (i < 0 || j < 0 || i >= NTX || j >= NTZ) return -1; return j * NTX + i; }
    treeList.forEach(function (t) { var k = tileIndex(t.x, t.z); if (k >= 0) TIL[k].trees.push(t); });
    bushList.forEach(function (t) { var k = tileIndex(t.x, t.z); if (k >= 0) TIL[k].bushes.push(t); });
    rockList.forEach(function (t) { var k = tileIndex(t.x, t.z); if (k >= 0) TIL[k].rocks.push(t); });
    ledgeList.forEach(function (t) { var k = tileIndex(t.x, t.z); if (k >= 0) TIL[k].ledges.push(t); });
    var FARG = new THREE.Group(); FARG.name = 'Far'; grp.add(FARG);
    var NEARG = new THREE.Group(); NEARG.name = 'Near'; grp.add(NEARG);
    var WATERS = [];   // every water mesh: { m, ch } (levels and colours change with the weather)
    var landMats = TYPES.map(function (t) { return paint(t, { earth: true }); });

    // the ground of one tile: heights on a grid (with a ring round it for the normals), a paint per cell, skirts to hide seams
    function GroundJob(T, cs) { this.T = T; this.cs = cs; this.n = Math.round(TILE / cs); var N = this.n + 3; this.H = new Float32Array(N * N); this.ty = new Uint8Array(this.n * this.n); this.row = 0; this.trow = 0; }
    GroundJob.prototype.heights = function (rows) {
      var N = this.n + 3, cs = this.cs, x0 = this.T.x0 - cs, z0 = this.T.z0 - cs;
      for (var r = 0; r < rows && this.row < N; r++, this.row++) { var z = z0 + this.row * cs; for (var i = 0; i < N; i++) this.H[this.row * N + i] = terrain(x0 + i * cs, z); }
      return this.row >= N;
    };
    GroundJob.prototype.types = function (rows) {
      var n = this.n, N = n + 3, cs = this.cs, H = this.H;
      for (var r = 0; r < rows && this.trow < n; r++, this.trow++) {
        var j = this.trow;
        for (var i = 0; i < n; i++) {
          var a = H[(j + 1) * N + i + 1], b = H[(j + 1) * N + i + 2], c = H[(j + 2) * N + i + 1], d = H[(j + 2) * N + i + 2];
          var h = (a + b + c + d) / 4, slope = Math.hypot((b + d - a - c) / 2, (c + d - a - b) / 2) / cs, x = this.T.x0 + (i + 0.5) * cs, z = this.T.z0 + (j + 0.5) * cs;
          probe(x, z); this.ty[j * n + i] = typeAt(x, z, h, slope);
        }
      }
      return this.trow >= n;
    };
    GroundJob.prototype.mesh = function () {
      var n = this.n, N = n + 3, V1 = n + 1, cs = this.cs, H = this.H, T = this.T, nv = V1 * V1 + 4 * V1;
      var pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), k = 0;
      for (var j = 0; j <= n; j++) for (var i = 0; i <= n; i++, k++) {
        var y = H[(j + 1) * N + i + 1], dx = (H[(j + 1) * N + i + 2] - H[(j + 1) * N + i]) / (2 * cs), dz = (H[(j + 2) * N + i + 1] - H[j * N + i + 1]) / (2 * cs), l = Math.sqrt(dx * dx + 1 + dz * dz);
        pos[k * 3] = T.x0 + i * cs; pos[k * 3 + 1] = y; pos[k * 3 + 2] = T.z0 + j * cs; nor[k * 3] = -dx / l; nor[k * 3 + 1] = 1 / l; nor[k * 3 + 2] = -dz / l;
      }
      // skirt vertices: the four edges again, 0.8 m lower
      var edges = [], e;
      for (e = 0; e < 4; e++) { var list = []; for (var q = 0; q <= n; q++) { var vi = e === 0 ? q : e === 1 ? n * V1 + q : e === 2 ? q * V1 : q * V1 + n; list.push([vi, k]); pos[k * 3] = pos[vi * 3]; pos[k * 3 + 1] = pos[vi * 3 + 1] - 0.8; pos[k * 3 + 2] = pos[vi * 3 + 2]; nor[k * 3] = nor[vi * 3]; nor[k * 3 + 1] = nor[vi * 3 + 1]; nor[k * 3 + 2] = nor[vi * 3 + 2]; k++; } edges.push(list); }
      var tri = TYPES.map(function () { return []; }), cnt = new Int32Array(TYPES.length);
      for (j = 0; j < n * n; j++) cnt[this.ty[j]] += 6;
      for (j = 0; j < TYPES.length; j++) tri[j] = { a: new Uint32Array(cnt[j] + 12 * n), n: 0, push: function () { for (var q = 0; q < arguments.length; q++) this.a[this.n++] = arguments[q]; } };
      for (j = 0; j < n; j++) for (i = 0; i < n; i++) { var a = j * V1 + i, b = a + 1, c = a + V1, d = c + 1, L = tri[this.ty[j * n + i]]; L.a[L.n++] = a; L.a[L.n++] = c; L.a[L.n++] = b; L.a[L.n++] = b; L.a[L.n++] = c; L.a[L.n++] = d; }
      // skirts face outwards (top edge -z, bottom +z, left -x, right +x)
      for (q = 0; q < n; q++) {
        var t0 = edges[0][q], t1 = edges[0][q + 1]; tri[this.ty[q]].push(t0[0], t1[0], t0[1], t1[0], t1[1], t0[1]);
        var b0 = edges[1][q], b1 = edges[1][q + 1]; tri[this.ty[(n - 1) * n + q]].push(b0[0], b0[1], b1[0], b1[0], b0[1], b1[1]);
        var l0 = edges[2][q], l1 = edges[2][q + 1]; tri[this.ty[q * n]].push(l0[0], l0[1], l1[0], l1[0], l0[1], l1[1]);
        var r0 = edges[3][q], r1 = edges[3][q + 1]; tri[this.ty[q * n + n - 1]].push(r0[0], r1[0], r0[1], r1[0], r1[1], r0[1]);
      }
      var total = 0; tri.forEach(function (L) { total += L.n; });
      var idx = nv > 65535 ? new Uint32Array(total) : new Uint16Array(total), off = 0, geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      tri.forEach(function (L, m) { if (L.n) { geo.addGroup(off, L.n, m); idx.set(L.a.subarray(0, L.n), off); } off += L.n; });
      geo.setIndex(new THREE.BufferAttribute(idx, 1)); geo.computeBoundingSphere();
      var m = new THREE.Mesh(geo, landMats); m.receiveShadow = true; m.name = 'Land'; m.userData.tile = T; return m;
    };

    var FLOWSPD = { main: 0.75, teal: 0.6, dry: 1.0 };
    // still water (the pond, the pools): no current; a circle has too few points inside to find its shore, so it gets rings of them
    function stillWater(g, cx, cz, y) {
      var P = g.attributes.position, n = P.count, flo = new Float32Array(n * 2), edg = new Float32Array(n), dep = new Float32Array(n), uvs = new Float32Array(n * 2);
      for (var i = 0; i < n; i++) { var d = clamp(y - terrain(cx + P.getX(i), cz + P.getZ(i)), -0.3, 3); dep[i] = d; edg[i] = clamp(1 - d / 0.16, 0, 1); uvs[i * 2] = cx + P.getX(i); uvs[i * 2 + 1] = cz + P.getZ(i); }
      g.setAttribute('aFlow', new THREE.BufferAttribute(flo, 2)); g.setAttribute('aUV', new THREE.BufferAttribute(uvs, 2)); g.setAttribute('aEdge', new THREE.BufferAttribute(edg, 1)); g.setAttribute('aDeep', new THREE.BufferAttribute(dep, 1));
    }
    // water ribbons of every channel stretch that starts in this tile (adjacent tiles meet exactly; nothing overlaps)
    function waterRibbons(T, into, every, wc) {
      CH.forEach(function (c) {
        var pos = [], idx = [], flo = [], edg = [], dep = [], uvs = [], nsec = 0, open = false, spd = FLOWSPD[c.id] || 0.6;
        function section(k) {
          var hw = c.id === 'dry' ? c.HW[k] + 0.25 + 0.5 * Math.min(c.BWL[k], c.BWR[k]) : c.HW[k] + Math.max(c.BWL[k], c.BWR[k]) * 0.9;
          var y = c.id === 'dry' ? c.BED[k] + 0.06 : c.WL[k];
          if (c.join && k > c.n - 6) y = Math.max(y, c.joinWL - 0.01);
          for (var q = 0; q < wc; q++) {
            var f = q / (wc - 1) * 2 - 1, x = c.X[k] - c.TZ[k] * f * hw, z = c.Z[k] + c.TX[k] * f * hw; pos.push(x, y, z);
            // the current runs fastest mid-stream; depth is measured to the bed under this point (the shoreline is where it reaches 0)
            var d = clamp(y - terrain(x, z), -0.3, 3), sk = spd * (1 - 0.55 * f * f); flo.push(c.TX[k] * sk, c.TZ[k] * sk); dep.push(d); edg.push(clamp(1 - d / 0.16, 0, 1)); uvs.push(c.S[k], f * hw);
          }
          nsec++;
        }
        for (var i = 0; i + every < c.n; i += every) {
          var j = i + every, mx = (c.X[i] + c.X[j]) / 2, mz = (c.Z[i] + c.Z[j]) / 2;
          if (mx < T.x0 || mx >= T.x0 + TILE || mz < T.z0 || mz >= T.z0 + TILE) { open = false; continue; }
          if (!open) { section(i); open = true; }
          section(j);
          var s1 = (nsec - 1) * wc, s0 = s1 - wc;
          for (var q = 0; q < wc - 1; q++) idx.push(s0 + q, s0 + q + 1, s1 + q, s0 + q + 1, s1 + q + 1, s1 + q);
        }
        if (!idx.length) return;
        var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); g.computeBoundingSphere();
        g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flo, 2)); g.setAttribute('aUV', new THREE.Float32BufferAttribute(uvs, 2)); g.setAttribute('aEdge', new THREE.Float32BufferAttribute(edg, 1)); g.setAttribute('aDeep', new THREE.Float32BufferAttribute(dep, 1));
        var m = new THREE.Mesh(g, paint(c.water, { water: true })); m.receiveShadow = true; m.name = 'Water_' + c.id; m.userData.ch = c.id; into.add(m);
        WATERS.push({ m: m, ch: c.id, base: c.water });
      });
    }
    // the pond, the pools in the Dry Fork, and the falls' foam: whole, built once
    (function () {
      var g = new THREE.RingGeometry(0.001, 1, 48, 12); g.rotateX(-Math.PI / 2); g.scale(POND.rx * 1.3, 1, POND.rz * 1.3); stillWater(g, POND.x, POND.z, pondWL());
      var m = new THREE.Mesh(g, paint('pond', { water: true })); m.position.set(POND.x, pondWL(), POND.z); m.receiveShadow = true; m.name = 'Pond'; LM.add(m); WATERS.push({ m: m, ch: 'pond', base: 'pond', y0: pondWL() });
      DRYPOOLS.forEach(function (p, k) { var pg = new THREE.RingGeometry(0.001, p.r + 0.5, 20, 5); pg.rotateX(-Math.PI / 2); stillWater(pg, p.x, p.z, p.y); var pm = new THREE.Mesh(pg, paint('water', { water: true })); pm.position.set(p.x, p.y, p.z); pm.receiveShadow = true; pm.name = 'DryPool' + k; LM.add(pm); WATERS.push({ m: pm, ch: 'drypool', base: 'water', y0: p.y }); });
      var fb = new Batch(), RF = rnd(77), dryFoam = new Batch();
      CH.forEach(function (c) {
        for (var i = 1; i < c.n - 2; i++) {
          var drop = c.WL[i] - c.WL[i + 2]; if (c.id === 'dry') drop = c.BED[i] - c.BED[i + 2];
          if (drop < 0.18) continue;
          var B = c.id === 'dry' ? dryFoam : fb, y = c.id === 'dry' ? c.BED[i + 3] + 0.08 : c.WL[i + 3] + 0.01, hw = c.HW[i + 3], ang = Math.atan2(c.TX[i], c.TZ[i]);
          for (var q = -hw; q <= hw; q += 0.38) { var p = across(c, i + 3, 1, q); B.add('foam', bake(box(0.36, 0.02, 0.16 + RF() * 0.12), p[0] + c.TX[i] * RF() * 0.3, y, p[1] + c.TZ[i] * RF() * 0.3, 0, ang + Math.PI / 2, 0)); }
          i += 3;
        }
      });
      var fg = new THREE.Group(); fg.name = 'Foam'; fb.build(fg, { noShadow: true }); LM.add(fg);
      var dg = new THREE.Group(); dg.name = 'DryFoam'; dryFoam.build(dg, { noShadow: true }); LM.add(dg); W.dryFoam = dg; dg.visible = false;
      // the Dry Falls in a storm: a curtain of white water over the lip, streaks sliding down into the plunge pool
      var c = CHI.dry, i = nearestSample(c, -15.5, -45.8), top = c.BED[Math.max(0, i - 4)] + 0.3, pj = nearestSample(c, -15.5, -43.8), bot = c.WL[pj] + 0.02, hw = 2.0;
      var NS = 19, NK = 3, fm = new THREE.InstancedMesh(box(1, 1, 1), paint('foam', { soft: true }), NS * NK); fm.name = 'DryFalls'; fm.frustumCulled = false; fm.castShadow = false; fm.visible = false; LM.add(fm);
      var ang = Math.atan2(c.TX[i], c.TZ[i]), FR = rnd(31), streaks = [];
      for (var k = 0; k < NS; k++) streaks.push({ q: -hw + (k + 0.5) * (2 * hw / NS) + (FR() - 0.5) * 0.12, ph: FR(), sp: 0.9 + FR() * 0.5, w: 0.2 + FR() * 0.16 });
      W.falls = { m: fm, x: c.X[i], z: c.Z[i], tx: c.TX[i], tz: c.TZ[i], top: top, bot: bot, streaks: streaks, NK: NK, ang: ang };
    })();
    var _fd = new THREE.Object3D();
    function fallsUpdate(t) {
      var F = W.falls, on = LEVEL.dry > 0.08; F.m.visible = on; if (!on) return;
      var drop = F.top - F.bot, n = 0, nx = F.tz, nz = -F.tx;   // across the stream
      F.streaks.forEach(function (s) {
        for (var k = 0; k < F.NK; k++) {
          var u = (t * s.sp * 0.9 + s.ph + k / F.NK) % 1, y = F.top - u * drop, out = 0.12 + u * u * 0.55, len = drop / F.NK * 0.96;
          _fd.position.set(F.x + nx * s.q + F.tx * out, y - len / 2, F.z + nz * s.q + F.tz * out); _fd.rotation.set(0, F.ang, 0); _fd.scale.set(s.w, len, 0.05); _fd.updateMatrix(); F.m.setMatrixAt(n++, _fd.matrix);
        }
      });
      F.m.instanceMatrix.needsUpdate = true;
      if (Math.random() < 0.25) { var sq = (Math.random() * 2 - 1) * 1.8; W.splash(F.x + nx * sq + F.tx * 0.75, F.z + nz * sq + F.tz * 0.75, 0.5); }
    }

    function far(T) {
      var g = new THREE.Group(); g.name = 'Far_' + T.i + '_' + T.j;
      var job = new GroundJob(T, 2); job.heights(1e9); job.types(1e9); var land = job.mesh(); land.receiveShadow = false; g.add(land);
      waterRibbons(T, g, 6, 3);
      var B = new Batch(); T.trees.forEach(function (t) { farTree(B, t); }); B.build(g, { noShadow: true });
      g.traverse(function (o) { if (o.isMesh) o.castShadow = false; });
      return g;
    }
    TIL.forEach(function (T) { T.far = far(T); FARG.add(T.far); });

    // ---------------- plants for a near tile: soft (no outline, no shadow), in clumps and drifts
    var bladeGeo = new THREE.BoxGeometry(0.03, 1, 0.03); bladeGeo.translate(0, 0.5, 0);
    var tuftGeo = (function () {
      var tp = [];
      [[0, 0, 0, 1], [0.025, 0.3, 0.012, 0.8], [-0.022, -0.35, -0.01, 0.9]].forEach(function (q, i) {
        var w = 0.022, top = new THREE.Vector3(0, q[3], 0), b = [0, 1, 2].map(function (k) { var a = k / 3 * 6.283 + i; return new THREE.Vector3(Math.cos(a) * w, 0, Math.sin(a) * w); });
        var m = new THREE.Matrix4().makeRotationY(i * 2.1).multiply(new THREE.Matrix4().makeRotationZ(q[1])), tr = new THREE.Vector3(q[0], 0, q[2]);
        [[0, 1], [1, 2], [2, 0]].forEach(function (e) { [b[e[1]], b[e[0]], top].forEach(function (v) { var u = v.clone().applyMatrix4(m).add(tr); tp.push(u.x, u.y, u.z); }); });
      });
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3)); g.computeVertexNormals(); return g;
    })();
    var fernGeo = (function () {
      var fp = [];
      for (var fr = 0; fr < 6; fr++) {
        var fa = fr / 6 * 6.283 + (fr % 2) * 0.3, ca2 = Math.cos(fa), sa2 = Math.sin(fa), FL = fr % 2 ? 0.42 : 0.5, NS = 5, P = [];
        for (var si = 0; si <= NS; si++) { var tf = si / NS, rr3 = FL * tf, yy3 = 0.24 * Math.sin(tf * Math.PI * 0.8) - 0.04 * tf * tf, wf = 0.075 * Math.pow(Math.sin(Math.min(1, tf * 1.15) * Math.PI), 0.7) * (1 - 0.35 * tf); P.push([rr3, yy3 + 0.018 * (1 - tf), 0], [rr3, yy3, wf], [rr3, yy3, -wf]); }
        var rot = function (p3) { return [p3[0] * ca2 - p3[2] * sa2, p3[1], p3[0] * sa2 + p3[2] * ca2]; };
        for (si = 0; si < NS; si++) { var m0 = P[si * 3], l0 = P[si * 3 + 1], r0 = P[si * 3 + 2], m1 = P[si * 3 + 3], l1 = P[si * 3 + 4], r1 = P[si * 3 + 5]; [[m0, l0, m1], [l0, l1, m1], [m0, m1, r0], [r0, m1, r1]].forEach(function (t3) { t3.forEach(function (v3) { var w3 = rot(v3); fp.push(w3[0], w3[1], w3[2]); }); }); }
      }
      var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); g.computeVertexNormals(); return g;
    })();
    var flowerGeo5 = new THREE.CylinderGeometry(0.045, 0.016, 0.03, 5), flowerBox = box(0.06, 0.05, 0.06), pebGeo = new THREE.OctahedronGeometry(1, 0), leafGeo = box(0.09, 0.008, 0.06);
    var capGeo = new THREE.SphereGeometry(1, 8, 4, 0, 6.29, 0, Math.PI / 2), stemGeo = new THREE.CylinderGeometry(0.012, 0.016, 0.06, 6); stemGeo.translate(0, 0.03, 0);
    var catGeo = box(0.05, 0.13, 0.05);
    // how far each part of a plant leans in the wind: by its height in the shape, times how tall the plant usually stands
    function swayBy(g, k, all) { var P = g.attributes.position, y0 = 1e9, y1 = -1e9, i; for (i = 0; i < P.count; i++) { y0 = Math.min(y0, P.getY(i)); y1 = Math.max(y1, P.getY(i)); } var a = new Float32Array(P.count); for (i = 0; i < P.count; i++) a[i] = all ? k : k * (P.getY(i) - y0) / Math.max(1e-4, y1 - y0); g.setAttribute('sway', new THREE.BufferAttribute(a, 1)); }
    swayBy(tuftGeo, 0.45); swayBy(bladeGeo, 1.0); swayBy(fernGeo, 0.35); swayBy(flowerGeo5, 0.4, true); swayBy(flowerBox, 0.4, true); swayBy(catGeo, 1.0, true);
    function instIn(T, into, geo, key, list, set, shadow) {
      if (!list.length) return;
      var g = geo.clone(); g.boundingSphere = new THREE.Sphere(new THREE.Vector3(T.x0 + TILE / 2, list[0].y || 0, T.z0 + TILE / 2), TILE * 0.75 + 4);
      var im = new THREE.InstancedMesh(g, paint(key, { soft: true, sway: !!g.attributes.sway }), list.length), o = new THREE.Object3D();
      // R186: an InstancedMesh is now culled by its own bounding sphere (computed round every copy, without room for the sway), not its
      // geometry's: give it the tile's sphere, as r128 used
      im.boundingSphere = g.boundingSphere;
      for (var q = 0; q < list.length; q++) { set(o, list[q]); o.updateMatrix(); im.setMatrixAt(q, o.matrix); }
      im.instanceMatrix.needsUpdate = true; im.castShadow = !!shadow; im.receiveShadow = true; im.name = 'Inst_' + key; into.add(im);
    }
    function plantJob(T, into, Dd, part) {
      if (!PLANTS) return;   // the easy-to-see view leaves the small plants, pebbles and leaves out
      var GR = rnd(hash2(T.i * 7 + 3, T.j * 13 + 5) + part * 977), K = [0.45, 0.6, 0.85, 1.0, 1.2, 1.45][Dd - 1];
      function inTile(x, z) { return x >= T.x0 && x < T.x0 + TILE && z >= T.z0 && z < T.z0 + TILE; }
      function treeNear(x, z, r) { var l = hashGet(TRH, x, z); if (l) for (var q = 0; q < l.length; q++) { var t = l[q]; if (Math.hypot(t.x - x, t.z - z) < r + (t.kind === 'cedar' ? 0.3 : 0.4)) return true; } return false; }
      function grassy(x, z) { var p = probe(x, z); if (p.h < p.hb - 0.08) return false; if (p.trail >= 0 && p.td < (TRAILS[p.trail].road ? 2.8 : TRAILS[p.trail].rail ? 3.2 : TRAILS[p.trail].w + 0.15)) return false; if (p.pond > 0 && p.pond < 1.2) return false; return !treeNear(x, z, 0); }
      function clumps(n, per, spread, pick, ok) {
        var out = [], guard = 0;
        while (out.length < n * per && guard++ < n * 10) {
          var c = pick(); if (!c) continue;
          var m = Math.max(2, Math.round(per * (0.6 + GR() * 0.8))), s0 = 0.75 + GR() * 0.5;
          for (var e = 0; e < m; e++) { var a = GR() * 6.28, r = Math.sqrt(GR()) * spread, x = c[0] + Math.cos(a) * r, z = c[1] + Math.sin(a) * r; if (inTile(x, z) && ok(x, z)) out.push({ x: x, z: z, y: terrain(x, z), s: s0 * (0.8 + GR() * 0.4), r1: GR(), r2: GR(), r3: GR() }); }
        }
        return out;
      }
      function anywhere() { return [T.x0 + GR() * TILE, T.z0 + GR() * TILE]; }
      function bankPick(f0, f1) { var tries = 0; while (tries++ < 6) { var ci = GR() < 0.8 ? 0 : (GR() < 0.5 ? 1 : 2), c = CH[ci], i = (GR() * c.n) | 0; if (c.X[i] < T.x0 - 2 || c.X[i] > T.x0 + TILE + 2 || c.Z[i] < T.z0 - 2 || c.Z[i] > T.z0 + TILE + 2) continue; var sd = GR() < 0.5 ? -1 : 1, bw = sd < 0 ? c.BWL[i] : c.BWR[i], p = across(c, i, sd, c.HW[i] + bw * (f0 + GR() * (f1 - f0))); return [p[0], p[1], c]; } return null; }
      // channels near this tile (for reeds and pebbles)
      var nearCh = CH.filter(function (c) { for (var i = 0; i < c.n; i += 6) if (c.X[i] > T.x0 - 3 && c.X[i] < T.x0 + TILE + 3 && c.Z[i] > T.z0 - 3 && c.Z[i] < T.z0 + TILE + 3) return true; return false; });
      var pondNear = POND.x + POND.rx * 1.5 > T.x0 && POND.x - POND.rx * 1.5 < T.x0 + TILE && POND.z + POND.rz * 1.5 > T.z0 && POND.z - POND.rz * 1.5 < T.z0 + TILE;
      if (part === 0) {
        ['grassD', 'grassL'].forEach(function (key) {
          var L = clumps(Math.round(62 * K), 12, 0.7, function () { var p = anywhere(); return grassy(p[0], p[1]) ? p : null; }, grassy);
          instIn(T, into, tuftGeo, key, L, function (o, it) { o.position.set(it.x, it.y - 0.01, it.z); o.rotation.set((it.r1 - 0.5) * 0.35, it.r2 * 6.28, (it.r3 - 0.5) * 0.35); o.scale.set(1.25, 0.1 + 0.1 * it.s, 1.25); });
        });
        ['fblue', 'fred', 'fyel'].forEach(function (key, n) {
          var L = clumps(Math.round((n ? 4 : 6) * K), 16, 0.9, function () { var p = anywhere(); return grassy(p[0], p[1]) && Math.sin(p[0] * 0.07 + n) * Math.cos(p[1] * 0.06 - n) > 0.2 ? p : null; }, grassy);
          instIn(T, into, Dd > 4 ? flowerGeo5 : flowerBox, key, L, function (o, it) { o.position.set(it.x, it.y + 0.1 + it.r1 * 0.05, it.z); o.rotation.set(0, it.r2 * 3, 0); o.scale.setScalar(0.9 + it.r3 * 0.5); });
          if (Dd > 4) instIn(T, into, bladeGeo, 'reed', L, function (o, it) { o.position.set(it.x, it.y - 0.01, it.z); o.rotation.set(0, it.r2 * 3, 0); o.scale.set(0.35, 0.1 + it.r1 * 0.05, 0.35); });
        });
      } else if (part === 1) {
        if (nearCh.length) {
          var reeds = clumps(Math.round(34 * K), 10, 0.45, function () { var b = bankPick(0.1, 0.9); if (!b || b[2].id === 'dry') return null; var p = probe(b[0], b[1]); return p.h < p.wl - 0.02 || (p.trail >= 0 && p.td < 1) ? null : b; }, function (x, z) { var p = probe(x, z); return p.ch >= 0 && CH[p.ch].id !== 'dry' && p.h > p.wl - 0.03 && !(p.trail >= 0 && p.td < 0.8); });
          instIn(T, into, tuftGeo, 'reed', reeds, function (o, it) { o.position.set(it.x, it.y - 0.02, it.z); o.rotation.set((it.r1 - 0.5) * 0.3, it.r2 * 6.28, (it.r3 - 0.5) * 0.3); o.scale.set(1.3, 0.32 + 0.42 * it.s, 1.3); });
          var cats = clumps(Math.round(12 * K), 5, 0.3, function () { var b = bankPick(0.02, 0.2); if (!b || b[2].id !== 'main') return null; var p = probe(b[0], b[1]); return Math.abs(p.h - p.wl) > 0.1 ? null : b; }, function (x, z) { var p = probe(x, z); return p.ch === 0 && Math.abs(p.h - p.wl) < 0.14; });
          var catsW = cats.map(function (c) { var p = probe(c.x, c.z); c.wl = p.wl; return c; });
          instIn(T, into, bladeGeo, 'reed', catsW, function (o, it) { o.position.set(it.x, it.y, it.z); o.rotation.set((it.r1 - 0.5) * 0.15, it.r2 * 6, 0); o.scale.set(0.8, it.wl + 0.55 + it.s * 0.15 - it.y, 0.8); });
          instIn(T, into, catGeo, 'cattail', catsW, function (o, it) { o.position.set(it.x, it.wl + 0.55 + it.s * 0.15, it.z); o.rotation.set(0, it.r2 * 6, 0); o.scale.set(1, 1, 1); });
          ['lime', 'rock'].forEach(function (key, n) {
            var L = clumps(Math.round((n ? 14 : 22) * K), 9, 0.4, function () { var b = bankPick(-0.35, 0.6); if (!b) return null; var p = probe(b[0], b[1]); return p.h < p.wl - 0.05 && b[2].id !== 'dry' ? null : b; }, function (x, z) { var p = probe(x, z); return p.ch >= 0 && (CH[p.ch].id === 'dry' || p.h > p.wl - 0.06) && p.h < p.hb - 0.05; });
            instIn(T, into, pebGeo, key, L, function (o, it) { var r = 0.03 + it.r1 * 0.05; o.position.set(it.x, it.y + r * 0.2, it.z); o.rotation.set(it.r2 * 3, it.r3 * 3, it.r1 * 3); o.scale.set(r * 1.3, r * 0.6, r); });
          });
        }
        if (pondNear) {
          var pc = clumps(Math.round(16 * K), 6, 0.35, function () { var a = GR() * 6.28, q = 0.98 + GR() * 0.12; return [POND.x + Math.cos(a) * POND.rx * q, POND.z + Math.sin(a) * POND.rz * q]; }, function (x, z) { var p = probe(x, z); return p.pond > 0.9 && p.pond < 1.25; });
          var pw = pondWL();
          instIn(T, into, bladeGeo, 'reed', pc, function (o, it) { o.position.set(it.x, Math.min(it.y, pw), it.z); o.rotation.set((it.r1 - 0.5) * 0.15, it.r2 * 6, 0); o.scale.set(0.8, pw + 0.6 + it.s * 0.15 - Math.min(it.y, pw), 0.8); });
          instIn(T, into, catGeo, 'cattail', pc, function (o, it) { o.position.set(it.x, pw + 0.6 + it.s * 0.15, it.z); o.rotation.set(0, it.r2 * 6, 0); o.scale.set(1, 1, 1); });
        }
      } else {
        var shade = [];
        T.trees.forEach(function (t) { if (t.kind === 'gold' || t.kind === 'syc') shade.push(t); });
        ['gold', 'leafR'].forEach(function (key, n) {
          var L = clumps(Math.round(shade.length * (n ? 1.2 : 1.8) * K), 14, 0.8, function () { var t = shade[(GR() * shade.length) | 0]; if (!t) return null; var a = GR() * 6.28, r = GR() * (t.cr || 1) * 0.9; return [t.x + Math.cos(a) * r, t.z + Math.sin(a) * r]; }, function (x, z) { var p = probe(x, z); return p.h > p.hb - 0.12 && !(p.trail >= 0 && p.td < 0.55); });
          instIn(T, into, leafGeo, key, L, function (o, it) { o.position.set(it.x, it.y + 0.01, it.z); o.rotation.set((it.r1 - 0.5) * 0.4, it.r2 * 6.28, (it.r3 - 0.5) * 0.4); o.scale.setScalar(0.85 + it.r1 * 0.5); });
        });
        var roots = T.trees;
        if (roots.length) {
          var mush = clumps(Math.round(4 * K), 4, 0.25, function () { var t = roots[(GR() * roots.length) | 0], a = GR() * 6.28, r = 0.35 + GR() * 0.4; return [t.x + Math.cos(a) * r, t.z + Math.sin(a) * r]; }, function (x, z) { return !nearTrail(x, z, 0.8); });
          instIn(T, into, stemGeo, 'stem', mush, function (o, it) { o.position.set(it.x, it.y, it.z); o.rotation.set(0, 0, 0); o.scale.setScalar(0.8 + it.r1 * 0.6); });
          instIn(T, into, capGeo, 'mush', mush, function (o, it) { var k2 = 0.8 + it.r1 * 0.6; o.position.set(it.x, it.y + 0.058 * k2, it.z); o.rotation.set(0, 0, 0); o.scale.set(0.04 * k2, 0.025 * k2, 0.04 * k2); });
          if (Dd > 3) {
            var ferns = clumps(Math.round(roots.length * 0.22 * K), 5, 0.55, function () { var t = roots[(GR() * roots.length) | 0]; if (t.kind === 'cedar' && GR() < 0.6) return null; var a = GR() * 6.28, r = (t.cr || 1) * (0.25 + GR() * 0.6); return [t.x + Math.cos(a) * r, t.z + Math.sin(a) * r]; }, function (x, z) { var p = probe(x, z); return p.h > p.hb - 0.1 && !(p.trail >= 0 && p.td < 0.9); });
            instIn(T, into, fernGeo, 'fern', ferns, function (o, it) { o.position.set(it.x, it.y - 0.01, it.z); o.rotation.set((it.r1 - 0.5) * 0.2, it.r2 * 6.28, (it.r3 - 0.5) * 0.2); o.scale.setScalar(0.75 + it.s * 0.5); });
          }
        }
        // maidenhair fern on the wet rock round the spring, at every detail
        if (31 > T.x0 - 6 && 31 < T.x0 + TILE + 6 && 58.7 > T.z0 - 6 && 58.7 < T.z0 + TILE + 6) {
          var mh = clumps(18, 6, 0.4, function () { var a = Math.PI * 0.5 + GR() * Math.PI, r = 2.0 + GR() * 1.0; return [31.2 + Math.cos(a) * r * 0.8, 58.7 + Math.sin(a) * r * 1.25]; }, function () { return true; });
          instIn(T, into, fernGeo, 'maiden', mh, function (o, it) { o.position.set(it.x, it.y + it.r1 * 1.2, it.z); o.rotation.set(0.5 + it.r1 * 0.5, it.r2 * 6.28, 0); o.scale.setScalar(0.45 + it.s * 0.25); });
        }
      }
    }

    // ---------------- a near tile, built a step at a time
    function nearJob(T, Dd) {
      var g = new THREE.Group(); g.name = 'Near_' + T.i + '_' + T.j; g.userData.detail = Dd;
      var gj = new GroundJob(T, CSD[Dd - 1]), B = new Batch(), steps = [], names = [], rowsH = Math.max(8, Math.round(2200 / (gj.n + 3))), rowsT = Math.max(8, Math.round(2200 / gj.n));
      function step(name, fn) { steps.push(fn); names.push(name); }
      step('heights', function () { return gj.heights(rowsH); });
      step('types', function () { return gj.types(rowsT); });
      step('ground', function () { g.add(gj.mesh()); return true; });
      step('water', function () { waterRibbons(T, g, 1, [5, 7, 9, 11, 12, 13][Dd - 1]); return true; });
      var tq = 0, per = Dd > 4 ? 3 : Dd > 2 ? 5 : 8;
      step('trees', function () { var end = Math.min(T.trees.length, tq + per); for (; tq < end; tq++) buildTree(B, T.trees[tq], Dd); return tq >= T.trees.length; });
      var bq = 0;
      step('bushes', function () {
        var end = Math.min(T.bushes.length, bq + (Dd > 4 ? 6 : 12));
        for (; bq < end; bq++) { var b = T.bushes[bq], BR = rnd(b.seed), h = terrain(b.x, b.z); for (var q = 0; q < b.nb; q++) { var a2 = BR() * 6.28, rr = q ? b.sz * 0.7 : 0, r2 = b.sz * (q ? 0.75 : 1); B.add(b.key + '|f|c', bake(Dd > 2 ? lumpy(new THREE.IcosahedronGeometry(r2, Dd > 4 || (Dd > 3 && r2 > 0.45) ? 2 : 1), 0.12, BR) : new THREE.IcosahedronGeometry(r2, Dd > 1 ? 1 : 0), b.x + Math.cos(a2) * rr, h + r2 * 0.55, b.z + Math.sin(a2) * rr, BR() * 3, BR() * 3, BR() * 3, 1, 0.75, 1)); } }
        return bq >= T.bushes.length;
      });
      var rq = 0, lq = 0;
      step('rocks', function () {
        var end = Math.min(T.rocks.length, rq + 14);
        for (; rq < end; rq++) { var r = T.rocks[rq], RR = rnd(r.seed), h = terrain(r.x, r.z); B.add(r.key + '|f', bake(new THREE.DodecahedronGeometry(r.r, Dd > 4 ? 2 : Dd > 1 ? 1 : 0), r.x, h + r.r * 0.25, r.z, RR() * 3, RR() * 3, RR() * 3, 1, 0.62, 1)); }
        var end2 = Math.min(T.ledges.length, lq + 14);
        for (; lq < end2; lq++) { var l = T.ledges[lq], hl = terrain(l.x, l.z); B.add((l.face ? 'limeD' : 'lime') + '|f', bake(Dd < 2 ? box(l.w, l.h, l.d) : rbox(l.w, l.h, l.d, 0.3, Math.min(Dd, 4)), l.x, hl + 0.02, l.z, l.rx, l.yaw, l.rz)); }
        return rq >= T.rocks.length && lq >= T.ledges.length;
      });
      [0, 1, 2].forEach(function (part) { step('plants' + part, function () { plantJob(T, g, Dd, part); return true; }); });
      step('merge', function () { return B.buildSome(g, null, 3); });
      return { T: T, g: g, steps: steps, names: names, k: 0, D: Dd };
    }

    // ---------------- streaming: which near tiles to have, built inside a time budget each frame
    var JOBS = [], RN = 34, RDROP = 58, STEPS = {}; W.stepStats = STEPS;
    function tileDist(T, x, z) { var dx = Math.max(T.x0 - x, 0, x - (T.x0 + TILE)), dz = Math.max(T.z0 - z, 0, z - (T.z0 + TILE)); return Math.hypot(dx, dz); }
    function dropNear(T) {
      if (T.near) { NEARG.remove(T.near); T.near.traverse(function (o) { if (o.isMesh) { o.geometry.dispose(); var k = WATERS.findIndex(function (w) { return w.m === o; }); if (k >= 0) WATERS.splice(k, 1); } }); T.near = null; }
      if (T.job) { var k2 = JOBS.indexOf(T.job); if (k2 >= 0) JOBS.splice(k2, 1); T.job.g.traverse(function (o) { if (o.isMesh) { o.geometry.dispose(); var k3 = WATERS.findIndex(function (w) { return w.m === o; }); if (k3 >= 0) WATERS.splice(k3, 1); } }); T.job = null; }
      T.far.visible = true;
    }
    function plan(x, z) {
      TIL.forEach(function (T) {
        var d = tileDist(T, x, z);
        if (d > RDROP && (T.near || T.job)) dropNear(T);
        else if (d < RN && !T.near && !T.job) { T.job = nearJob(T, D); T.job.dist = d; JOBS.push(T.job); }
        if (T.job) T.job.dist = d;
      });
      JOBS.sort(function (a, b) { return a.dist - b.dist; });
    }
    function runJobs(budget) {
      var t0 = performance.now();
      while (JOBS.length && performance.now() - t0 < budget) {
        var J = JOBS[0], ts = performance.now();
        var done = J.steps[J.k]();
        var dts = performance.now() - ts, nm = J.names[J.k]; if (!STEPS[nm] || STEPS[nm] < dts) STEPS[nm] = Math.round(dts * 10) / 10;
        if (done) J.k++;
        if (J.k >= J.steps.length) {
          JOBS.shift(); J.T.job = null; J.T.near = J.g; NEARG.add(J.g); J.T.far.visible = false;
          applyLevels(true);
        }
      }
      return JOBS.length;
    }
    W.stream = function (x, z, budget) { plan(x, z); return runJobs(budget == null ? 6 : budget); };
    W.ensure = function (x, z) { plan(x, z); JOBS.forEach(function (J) { J.dist = J.dist; }); while (JOBS.length) runJobs(1e9); };
    var PLANTS = true;
    W.setPlants = function (on) { on = !!on; if (on === PLANTS) return; PLANTS = on; TIL.forEach(function (T) { if (T.near || T.job) dropNear(T); }); };
    W.setDetail = function (Dd) { Dd = clamp(Dd | 0, 1, 6); if (Dd === D) return; D = Dd; W.detail = D; TIL.forEach(function (T) { if (T.near || T.job) dropNear(T); }); };
    W.busy = function () { return JOBS.length; };
    W.tiles = TIL;

    // ================================================================ water levels, ripples, rings, the windmill and the swing
    W.setFlow = function (id, state) {
      if (!OFFS[id] || OFFS[id][state] == null) return;
      FLOW[id] = state; LEVELT[id] = OFFS[id][state];
      if (id === 'dry' && state === 'running' && LEVEL.dry < -5) LEVEL.dry = 0.02;
    };
    W.setFlowNow = function (id, state) { W.setFlow(id, state); LEVEL[id] = LEVELT[id]; applyLevels(true); };
    var lastMud = null;
    function applyLevels(force) {
      var mud = FLOW.main === 'high' || FLOW.main === 'flood';
      for (var q = 0; q < WATERS.length; q++) {
        var w = WATERS[q], m = w.m;
        if (w.ch === 'pond') { m.position.y = w.y0 + LEVEL.pond; continue; }
        if (w.ch === 'drypool') { m.visible = FLOW.dry !== 'dry'; continue; }
        if (w.ch === 'dry') { m.visible = LEVEL.dry > 0.005; m.position.y = Math.max(0, LEVEL.dry); if (force || lastMud !== mud) m.material = paint(LEVEL.dry > 0.005 ? 'mud' : 'water', { water: true }); continue; }
        m.position.y = LEVEL[w.ch] || 0;
        if (w.ch === 'main' && (force || lastMud !== mud)) m.material = paint(mud ? 'mud' : 'water', { water: true });
      }
      W.dryFoam.visible = LEVEL.dry > 0.1;
      lastMud = mud;
    }
    var RIP = 300, rip = new THREE.InstancedMesh(box(1, 1, 1), paint('ripple', { soft: true }), RIP), ripS = [], dummy = new THREE.Object3D();
    rip.frustumCulled = false; rip.name = 'Ripples'; rip.castShadow = false; grp.add(rip);
    for (var r0 = 0; r0 < RIP; r0++) ripS.push({ c: null, i: 0, f: 0, life: 0, len: 0.18 + R() * 0.4, ph: R() * 6 });
    var RINGS = [], ringGeo = new THREE.RingGeometry(0.86, 1, 20, 1); ringGeo.rotateX(-Math.PI / 2);
    for (var rg0 = 0; rg0 < 18; rg0++) { var rg = new THREE.Mesh(ringGeo, paint('ripple', { soft: true })); rg.visible = false; rg.userData = { t: 9, dur: 1 }; grp.add(rg); RINGS.push(rg); }
    W.splash = function (x, z, size) {
      var r = null; for (var q = 0; q < RINGS.length; q++) if (RINGS[q].userData.t >= RINGS[q].userData.dur) { r = RINGS[q]; break; }
      var y = water(x, z); if (!r || y == null) return; r.position.set(x, y + 0.008, z); r.userData = { t: 0, dur: 0.9 + 0.3 * (size || 1), s: size || 1 }; r.visible = true; r.scale.setScalar(0.05);
    };
    var nearSamples = [], nsFocus = { x: 1e9, z: 1e9 };
    function speedOf(c) { if (c.id === 'main') return FLOW.main === 'flood' ? 1.5 : FLOW.main === 'high' ? 0.9 : FLOW.main === 'low' ? 0.18 : 0.3; if (c.id === 'dry') return 1.2; return 0.24; }
    function respawn(s) {
      if (!nearSamples.length) { s.c = null; return; }
      var pick = nearSamples[(Math.random() * nearSamples.length) | 0]; s.c = pick[0]; s.i = pick[1]; s.f = (Math.random() * 2 - 1) * 0.8; s.life = 2 + Math.random() * 5; s.u = 0;
    }
    W.update = function (t, dt, focus) {
      // water levels ease towards the weather's
      for (var id in LEVEL) {
        if (id === 'dry' && LEVEL.dry < -5) continue;
        var tgt = LEVELT[id] < -5 ? 0 : LEVELT[id], rate = (id === 'main' ? 0.035 : 0.05) * dt;
        LEVEL[id] += clamp(tgt - LEVEL[id], -rate, rate);
        if (id === 'dry' && LEVELT.dry < -5 && LEVEL.dry <= 0.003) LEVEL.dry = -9;
      }
      applyLevels(false); fallsUpdate(t);
      // ripples drift along the water near him
      if (focus && Math.hypot(focus.x - nsFocus.x, focus.z - nsFocus.z) > 4) {
        nsFocus = { x: focus.x, z: focus.z }; nearSamples = [];
        CH.forEach(function (c) { for (var i = 0; i < c.n - 1; i += 2) if (Math.abs(c.X[i] - focus.x) < 24 && Math.abs(c.Z[i] - focus.z) < 18) nearSamples.push([c, i]); });
      }
      for (var q = 0; q < RIP; q++) {
        var s = ripS[q];
        if (!s.c || s.life <= 0) respawn(s);
        if (!s.c) { dummy.scale.set(0.001, 0.001, 0.001); dummy.position.set(0, -50, 0); dummy.updateMatrix(); rip.setMatrixAt(q, dummy.matrix); continue; }
        var c = s.c, lv = c.id === 'dry' ? LEVEL.dry : (LEVEL[c.id] || 0), vis = c.id !== 'dry' || lv > 0.01;
        s.life -= dt; s.u += speedOf(c) * dt / 0.5;
        var ii = Math.min(c.n - 2, s.i + Math.floor(s.u)), fr = s.u - Math.floor(s.u);
        if (ii >= c.n - 2) { s.life = 0; continue; }
        var hw = c.HW[ii] * Math.abs(s.f) * (s.f < 0 ? -1 : 1) * (1 + Math.max(0, lv) * 1.2), p = across(c, ii, 1, hw);
        var y = (c.id === 'dry' ? c.BED[ii] + 0.06 : c.WL[ii]) + Math.max(lv, c.id === 'dry' ? 0 : -1) + 0.006;
        var falls = c.WL[ii] - c.WL[Math.min(c.n - 1, ii + 2)] > 0.12;
        dummy.position.set(p[0] + c.TX[ii] * fr * 0.5, y, p[1] + c.TZ[ii] * fr * 0.5); dummy.rotation.set(0, Math.atan2(c.TX[ii], c.TZ[ii]), 0);
        var L = s.len * (0.7 + 0.3 * Math.sin(t * 2 + q)) * (1 + Math.max(0, lv)), w = vis && !falls ? 0.035 : 0.001;
        dummy.scale.set(w, 0.004, vis && !falls ? L : 0.001); dummy.updateMatrix(); rip.setMatrixAt(q, dummy.matrix);
      }
      rip.instanceMatrix.needsUpdate = true;
      for (q = 0; q < RINGS.length; q++) { var r = RINGS[q], u = r.userData; if (u.t >= u.dur) continue; u.t += dt; var f = u.t / u.dur; r.scale.setScalar((0.08 + 0.55 * f) * u.s); if (u.t >= u.dur) r.visible = false; }
      if (W.windmill) W.windmill.rotation.z = -t * (1.6 + 0.6 * Math.sin(t * 0.2));
      if (W.swing) W.swing.rotation.x = 0.12 * Math.sin(t * 1.3) + 0.04 * Math.sin(t * 2.9);
    };

    // ================================================================ ground under him, water, collisions
    function inPlat(pl, x, z) {
      if (pl.kind === 'disc') return Math.hypot(x - pl.x, z - pl.z) < pl.r;
      var dx = x - pl.x, dz = z - pl.z, al = dx * pl.ux + dz * pl.uz, ac = -dx * pl.uz + dz * pl.ux;
      return Math.abs(al) < pl.hl && Math.abs(ac) < pl.hw;
    }
    W.height = function (x, z, feet) {
      var h = terrain(x, z);
      for (var q = 0; q < platforms.length; q++) { var pl = platforms[q]; if (inPlat(pl, x, z) && (feet == null || pl.top < feet + 0.55)) h = Math.max(h, pl.top); }
      return h;
    };
    W.onPlatform = function (x, z, feet) { for (var q = 0; q < platforms.length; q++) { var pl = platforms[q]; if (inPlat(pl, x, z) && (feet == null || pl.top < feet + 0.55)) return pl; } return null; };
    W.water = water;
    W.wading = function (x, z, feet) { var h = W.height(x, z, feet), wl = water(x, z); return wl != null && h < wl - 0.01 ? wl - h : 0; };
    W.fast = fast;
    W.collide = function (p, r) {
      for (var pass = 0; pass < 2; pass++) {
        var list = hashGet(CHASH, p.x, p.z); if (!list) break;
        for (var q = 0; q < list.length; q++) {
          var c = list[q];
          if (c.r != null && c.ax == null) { var dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), m = c.r + r; if (d < m && d > 1e-6) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; } }
          else { var vx = c.bx - c.ax, vz = c.bz - c.az, L2 = vx * vx + vz * vz, t = clamp(((p.x - c.ax) * vx + (p.z - c.az) * vz) / L2, 0, 1), qx = c.ax + vx * t, qz = c.az + vz * t, ddx = p.x - qx, ddz = p.z - qz, dd = Math.hypot(ddx, ddz), mm = c.r + r; if (dd < mm && dd > 1e-6) { p.x = qx + ddx / dd * mm; p.z = qz + ddz / dd * mm; } }
        }
      }
      p.x = clamp(p.x, BOUND.x0, BOUND.x1); p.z = clamp(p.z, BOUND.z0, BOUND.z1);
      return p;
    };
    W.circles = circles; W.platforms = platforms;
    W.lands = function () { var out = []; TIL.forEach(function (T) { var g = T.near || T.far; if (g) g.children.forEach(function (o) { if (o.name === 'Land') out.push(o); }); }); return out; };
    // how far a point is from the nearest running water's edge (for the sound of the creek)
    W.waterNear = function (x, z) { var p = probe(x, z); var d = p.ch >= 0 ? Math.max(0, p.d - p.hw) : 99; if (p.pond > 0) d = Math.min(d, Math.max(0, (p.pond - 1) * POND.rz)); return d; };
    W.cave = CAVE; W.grotto = GROTTO; W.pond = POND;
    W.levels = LEVEL;
    applyLevels(true);

    return W;
  };
})(typeof window !== 'undefined' ? window : globalThis);

;