/* The Philosopher King v3 - lifelike procedural character, three.js r128.
   Units: metres. Origin at the feet, faces +Z, his left = +X. A skinned body and clothes on a named bone rig (PKSkin), a sculpted head with
   his photographed face projected onto it (PKFace), the paper crown, hats and held items, and the animation clips. */
// R186: ported to three.js r186 for Creekfolk 2 (see creekfolk2/docs/R186-PORT.md); every change is marked R186.
// R186: the props here are MeshStandardMaterial: with r186's physical light units they want PI times WTWB's light intensities, like the
// toon materials. The lifelike king (create) still needs PKBody3, PKFace and PKWear, which are not part of creekfolk2/src/look.
(function (global) {
  'use strict';
  var THREE = global.THREE, K = global.PKSkin, B3 = global.PKBody3, F = global.PKFace, C = global.PKCore, Wr = global.PKWear;
  var D = K.D, L1 = D.L1, L2 = D.L2, HIPS_Y = D.HIPS_Y, HIP_OFF = D.ANK - D.THIGH_Y;   // straight legs: hips at L1 + L2 + HIP_OFF
  // the clips are built for one set of proportions at a time (setDims); the realistic model uses K.D
  function setDims(d) { d = d || K.D; L1 = d.L1; L2 = d.L2; HIPS_Y = d.HIPS_Y; HIP_OFF = d.ANK - d.THIGH_Y; JUMP.H = 0.36 * (d.L1 + d.L2) / (K.D.L1 + K.D.L2); jumpPose = makeJumpPose(); }
  var HEAD_SCALE = 1.03;

  // ------------------------------------------------------------------ palette for the props (sRGB)
  var PAL = { skin: '#d3ae9a', hair: '#f3f1ed', steel: '#26282c', wood: '#935a30', glass: '#d3e7ea' };

  function col(hex) { return C.col(hex); }   // R186: was Color(hex).convertSRGBToLinear(), which converts twice under r186's colour management (see PKCore.col)
  function M(hex, extra) {
    var o = { color: col(hex), roughness: 0.85, metalness: 0 };
    for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // ------------------------------------------------------------------ geometry helpers (props only)
  function ell(rx, ry, rz, mat, name, seg) {
    var s = seg || 20;
    var g = new THREE.SphereGeometry(1, s, Math.max(8, Math.round(s * 0.7)));
    g.scale(rx, ry, rz);
    var m = new THREE.Mesh(g, mat); m.name = name || 'part'; return m;
  }
  function limbGeo(rTop, rBot, len, seg) {
    var pts = [], n = 7, i, a;
    for (i = 0; i <= n; i++) { a = i / n * Math.PI / 2; pts.push(new THREE.Vector2(rBot * Math.sin(a), -len - rBot * Math.cos(a))); }
    for (i = 0; i <= n; i++) { a = (1 - i / n) * Math.PI / 2; pts.push(new THREE.Vector2(rTop * Math.sin(a), rTop * Math.cos(a))); }
    return new THREE.LatheGeometry(pts, seg || 16);
  }
  function limb(rTop, rBot, len, mat, name, seg) { var m = new THREE.Mesh(limbGeo(rTop, rBot, len, seg), mat); m.name = name || 'limb'; return m; }
  function at(o, x, y, z) { o.position.set(x, y, z); return o; }
  function rot(o, x, y, z) { o.rotation.set(x, y, z); return o; }
  function grp(name, x, y, z) { var g = new THREE.Group(); g.name = name; g.position.set(x || 0, y || 0, z || 0); return g; }
  function between(a, b, r) { // thin cylinder from a to b
    var d = new THREE.Vector3().subVectors(b, a), len = d.length();
    var g = new THREE.CylinderGeometry(r, r, len, 6); g.translate(0, len / 2, 0);
    g.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())));
    g.translate(a.x, a.y, a.z); return g;
  }
  function lathe(pts, mat, name, seg) {
    var m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(function (q) { return new THREE.Vector2(q[0], q[1]); }), seg || 28), mat);
    m.name = name; return m;
  }

  // ------------------------------------------------------------------ hats and held items
  // geodesic dome: an icosahedron frame (upper cap only) over a faint glass shell
  function buildGeodesic() {
    var g = new THREE.Group(); g.name = 'GeodesicHat';
    var R = 0.085, ico = new THREE.IcosahedronGeometry(R, 0), p = ico.attributes.position;
    var seen = {}, geos = [], i, j;
    function key(v) { return v.x.toFixed(4) + ',' + v.y.toFixed(4) + ',' + v.z.toFixed(4); }
    var tri = [];
    for (i = 0; i < p.count; i += 3) {
      tri = [0, 1, 2].map(function (k) { return new THREE.Vector3(p.getX(i + k), p.getY(i + k), p.getZ(i + k)); });
      for (j = 0; j < 3; j++) {
        var a = tri[j], b = tri[(j + 1) % 3], k1 = key(a), k2 = key(b), kk = k1 < k2 ? k1 + '|' + k2 : k2 + '|' + k1;
        if (seen[kk]) continue; seen[kk] = 1;
        if (a.y < -0.30 * R && b.y < -0.30 * R) continue;            // only the cap that sits on the head
        geos.push(between(a, b, 0.0034));
      }
    }
    // R186: BufferGeometryUtils.mergeBufferGeometries became mergeGeometries (r151); Creekfolk 2's three.js build exports it as THREE.mergeGeometries
    var frame = new THREE.Mesh(THREE.mergeGeometries(geos), M(PAL.steel, { roughness: 0.4, metalness: 0.6 }));
    frame.name = 'GeodesicFrame'; g.add(frame);
    var glass = new THREE.Mesh(new THREE.IcosahedronGeometry(R - 0.0005, 0),
      M(PAL.glass, { roughness: 0.05, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
    glass.name = 'GeodesicGlass'; g.add(glass);
    return g;
  }
  function buildBowl() {
    var g = new THREE.Group(); g.name = 'WoodBowl';
    var wood = M(PAL.wood, { roughness: 0.6, side: THREE.DoubleSide });
    g.add(lathe([[0, 0], [0.03, 0], [0.058, 0.010], [0.080, 0.036], [0.090, 0.074], [0.082, 0.077], [0.073, 0.046], [0.052, 0.019], [0, 0.014]], wood, 'Bowl'));
    return g;
  }
  function buildBottle() {
    var g = new THREE.Group(); g.name = 'BottleWithKing';
    var glass = M(PAL.glass, { roughness: 0.05, transparent: true, opacity: 0.30, side: THREE.DoubleSide, depthWrite: false });
    g.add(lathe([[0, 0], [0.030, 0], [0.034, 0.008], [0.034, 0.078], [0.026, 0.092], [0.0135, 0.098], [0.0135, 0.118], [0.0175, 0.121], [0.0175, 0.127], [0.0115, 0.127], [0.0115, 0.117], [0.0115, 0.100], [0.022, 0.090], [0.030, 0.076], [0.030, 0.012], [0, 0.008]], glass, 'Bottle', 24));
    var skin = M(PAL.skin, { roughness: 0.8 }), hair = M(PAL.hair, { roughness: 0.9 });
    var k = new THREE.Group(); k.name = 'TinyKing'; k.position.set(0, 0.012, 0);
    k.add(at(ell(0.016, 0.022, 0.012, skin, 'TinyTorso'), 0, 0.030, 0));
    k.add(at(ell(0.0105, 0.0125, 0.010, skin, 'TinyHead'), 0.002, 0.060, 0.004));
    k.add(at(ell(0.011, 0.004, 0.010, hair, 'TinyHair'), 0.002, 0.071, 0.002));
    var l1 = limb(0.007, 0.0055, 0.030, skin, 'TinyThigh', 8); rot(l1, -1.2, 0, 0.1); at(l1, 0.008, 0.016, 0.004); k.add(l1);
    var l2 = limb(0.007, 0.0055, 0.030, skin, 'TinyThigh2', 8); rot(l2, -1.2, 0, -0.1); at(l2, -0.008, 0.016, 0.004); k.add(l2);
    var a1 = limb(0.0045, 0.004, 0.026, skin, 'TinyArm', 8); rot(a1, 0, 0, 2.5); at(a1, 0.014, 0.040, 0.0); k.add(a1);
    var a2 = limb(0.0045, 0.004, 0.026, skin, 'TinyArm2', 8); rot(a2, 0, 0, -2.5); at(a2, -0.014, 0.040, 0.0); k.add(a2);
    g.add(k);
    return g;
  }
  function buildIcosa() {
    var g = new THREE.Group(); g.name = 'WoodIcosahedron';
    var geo = new THREE.IcosahedronGeometry(0.115, 0);
    var cols = ['#d9d3b8', '#7fb3a2', '#a8693a', '#e6e2cf', '#b88a58'], rnd = mulberry32(5), arr = [];
    for (var i = 0; i < geo.attributes.position.count / 3; i++) {
      var c = col(cols[Math.floor(rnd() * cols.length)]);
      for (var v = 0; v < 3; v++) arr.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(arr, 3));
    var m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, flatShading: true }));
    m.name = 'Icosahedron'; m.position.y = 0.105; g.add(m);
    return g;
  }


  // ------------------------------------------------------------------ the paper crown: gold card, zigzag points, printed coloured stars
  function crownTexture() {
    var W = 2048, H = 512, cv = C.canvas(W, H), g = cv.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#f1dc95'); gr.addColorStop(0.55, '#e8cf7d'); gr.addColorStop(1, '#d9bb62');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // paper fibres and a little foil sparkle
    var R = C.rng(12), i;
    for (i = 0; i < 9000; i++) { var x = R() * W, y = R() * H, l = 2 + R() * 7; g.strokeStyle = R() < 0.5 ? 'rgba(255,246,210,0.10)' : 'rgba(150,110,40,0.08)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (R() - 0.5) * 2); g.stroke(); }
    // printed border line along the bottom of the band
    g.fillStyle = 'rgba(184,140,52,0.85)'; g.fillRect(0, H - 34, W, 5); g.fillRect(0, H - 22, W, 2);
    // stars: one on each point, at the band (u = point centre)
    var cols = ['#d23a2e', '#2f5fb8', '#3a9a4c', '#7a3fa0', '#e08a1e', '#2f5fb8', '#d23a2e', '#3a9a4c'];
    function star(cx, cy, r, c) {
      g.beginPath();
      for (var k = 0; k < 10; k++) { var a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.42 : r; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      g.closePath(); g.fillStyle = c; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(60,30,10,0.35)'; g.stroke();
    }
    for (i = 0; i < CROWN.NP; i++) { var u = (i + 0.5) / CROWN.NP; star(u * W, H * 0.60, 62, cols[i % cols.length]); star(u * W, H * 0.80, 0, cols[i]); }
    return C.tex(cv, { png: false });
  }
  var CROWN = { NP: 8, band: 0.040, point: 0.064 };
  function buildPaperCrown() {
    // fitted to the head's dome a little above the brow; front lower than the back
    var NP = CROWN.NP, cols = NP * 24, rows = 10, P = [], UV = [], i, j;
    var yb = 0.086, rr = F.ringAt(yb), RX = rr.W + 0.010, RZ = rr.Dz + 0.010, ZC = rr.zc, Hmax = CROWN.band + CROWN.point;
    for (i = 0; i <= rows; i++) for (j = 0; j <= cols; j++) {
      var u = j / cols, th = u * 2 * Math.PI + Math.PI / NP;          // a point at the very front
      var tri = 1 - Math.abs(((u * NP) % 1) * 2 - 1), top = CROWN.band + CROWN.point * tri;
      var h = top * i / rows, fl = 1 + 0.10 * (h / Hmax);             // flares out as it rises
      var x = Math.sin(th) * RX * fl, z = ZC + Math.cos(th) * RZ * fl;
      P.push(x, F.warpY(yb) + h, z); UV.push(u, h / Hmax);
    }
    var idx = [];
    for (i = 0; i < rows; i++) for (j = 0; j < cols; j++) { var a = i * (cols + 1) + j, b = a + 1, c = a + cols + 2, d = a + cols + 1; idx.push(a, c, b, a, d, c); }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    var mat = new THREE.MeshStandardMaterial({ map: crownTexture(), roughness: 0.55, metalness: 0.18, side: THREE.DoubleSide, name: 'PaperCrown' });
    var m = new THREE.Mesh(geo, mat); m.name = 'PaperCrownBand';
    var g = new THREE.Group(); g.name = 'Crown'; g.add(m);
    g.rotation.x = -0.10; g.position.set(0, 0.002, 0.004);     // tipped back a little
    return g;
  }

  // ------------------------------------------------------------------ the figure
  var OUTFITS = Wr ? Wr.OUTFITS : {};   // R186: (for Creekfolk 2) the rig and clips load without PKWear, which only the lifelike king needs
  var TROUSERS = { cardigan: true };
  function makeKing(opts) {
    opts = opts || {};
    var rig = K.makeRig(), J = rig.J, root = rig.root;
    var mats = B3.materials();
    var body = {
      legs: B3.buildLegs(rig, mats), neck: B3.buildNeck(rig, mats), wrists: B3.buildWrists(rig, mats), hands: B3.buildHands(rig, mats),
      socks: B3.buildSocks(rig), shoes: B3.buildShoes(rig)
    };
    var H = F.buildHead({});
    var hs = new THREE.Group(); hs.name = 'HeadScaled'; hs.scale.setScalar(HEAD_SCALE); hs.add(H.group); J.Slot_Head.add(hs);
    if (H.crown) H.crown.visible = false;
    var king = { root: root, rig: rig, joints: J, props: {}, slots: { head: J.Slot_Head, handR: J.Slot_Hand_R, handL: J.Slot_Hand_L }, head: H, body: body, mats: mats, outfits: {}, built: {} };
    // --- outfits (built lazily, then just toggled)
    var OUT = {};
    Object.keys(OUTFITS).forEach(function (id) { OUT[id] = { label: OUTFITS[id] }; });
    king.outfits = OUT;
    function vis(list, on) { list.forEach(function (m) { m.visible = on; }); }
    king.setOutfit = function (id) {
      if (!OUT[id]) id = 'everyday';
      if (!king.built[id]) king.built[id] = Wr.build(id, rig, mats);
      Object.keys(king.built).forEach(function (k) { vis(king.built[k].meshes, k === id); });
      body.legs.L.visible = body.legs.R.visible = !TROUSERS[id];
      king.outfit = id;
    };
    king.prebuild = function (id) {
      if (!OUT[id] || king.built[id]) return false;
      king.built[id] = Wr.build(id, rig, mats); vis(king.built[id].meshes, id === king.outfit);
      return true;
    };
    // --- hats
    king.props.crown = buildPaperCrown(); hs.add(king.props.crown);
    var zc = F.ringAt(0.06).zc;
    king.props.geodesic = buildGeodesic(); king.props.geodesic.position.set(0, F.warpY(0.060), zc); king.props.geodesic.scale.set(1.42, 1.08, 1.70); hs.add(king.props.geodesic);
    king.props.geodesic.visible = false;
    king.setHat = function (id) { king.props.crown.visible = id === 'crown'; king.props.geodesic.visible = id === 'geodesic'; king.hat = id; };
    // --- held items on the right hand
    king.props.bowl = buildBowl(); king.props.bottle = buildBottle(); king.props.icosa = buildIcosa();
    var held = [king.props.bowl, king.props.bottle, king.props.icosa];
    held.forEach(function (p) { p.visible = false; J.Slot_Hand_R.add(p); });
    king.itemMode = 'cradle';
    function placeItem() {
      held.forEach(function (p) { p.rotation.set(0, 0, 0); });
      if (!king.item) return;
      var p = king.props[king.item];
      if (king.itemMode === 'cradle') { p.position.set(CRADLE[0], CRADLE[1], CRADLE[2]); p.rotation.set(0, 0, -Math.PI / 2); }
      else { p.position.set(-0.070, -0.070, 0.0); p.rotation.set(0, 0, 0); }
    }
    king.setItem = function (id) { king.item = id || null; held.forEach(function (p) { p.visible = false; }); if (id) king.props[id].visible = true; placeItem(); };
    king.setItemMode = function (m) { king.itemMode = m; placeItem(); };
    king.setOutfit(opts.outfit || 'everyday'); king.setHat('crown'); king.setItem(null);
    return king;
  }
  var CRADLE = [0.036, 0.0, -0.064];

  // ------------------------------------------------------------------ poses and clips
  var JN = K.JOINTS;
  // Stooped, head carried forward, knees a little bent and apart, feet turned out (the T-pose sheet and the photos)
  var RS = { spine: 0.12, neck: 0.50, head: -0.52, thigh: -0.08, knee: 0.16, thighZ: 0.10, shinZ: -0.125, toe: 0.30, armX: 0.04, armZ: 0.40, fore: -0.18, fing: 0.25 };
  function restPose() {
    return {
      Hips: [0, 0, 0], Spine: [RS.spine, 0, 0], Neck: [RS.neck, 0, 0], Head: [RS.head, 0, 0],
      UpperArm_L: [RS.armX, 0, RS.armZ], Forearm_L: [RS.fore, 0, 0.02], Hand_L: [0, 0, 0], Fingers_L: [0, 0, -RS.fing],
      UpperArm_R: [RS.armX, 0, -RS.armZ], Forearm_R: [RS.fore, 0, -0.02], Hand_R: [0, 0, 0], Fingers_R: [0, 0, RS.fing],
      Thigh_L: [RS.thigh, 0, RS.thighZ], Shin_L: [RS.knee, 0, RS.shinZ], Foot_L: [-(RS.thigh + RS.knee), RS.toe, 0],
      Thigh_R: [RS.thigh, 0, -RS.thighZ], Shin_R: [RS.knee, 0, -RS.shinZ], Foot_R: [-(RS.thigh + RS.knee), -RS.toe, 0],
      _pos: [0, 0, 0]
    };
  }
  function P(over) { var p = restPose(); for (var k in over) p[k] = over[k].slice(); return p; }
  function both(p, base, v) { p[base + '_L'] = v.slice(); p[base + '_R'] = [v[0], -v[1], -v[2]]; }
  function lerpP(a, b, u) { var o = {}, k, i; for (k in a) { o[k] = []; for (i = 0; i < a[k].length; i++) o[k][i] = a[k][i] + (b[k][i] - a[k][i]) * u; } return o; }
  function ease(u) { return u * u * (3 - 2 * u); }
  function keyed(keys) {
    return function (t) {
      var i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
      var a = keys[i], b = keys[i + 1], u = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
      return lerpP(a[1], b[1], ease(u));
    };
  }
  // both feet flat on the ground for a hip/knee bend; hips dropped to match (the small sideways angles are ignored in the height)
  function plant(p, thigh, knee, toe) {
    var a = thigh, b = thigh + knee, tw = toe === undefined ? RS.toe : toe;
    var drop = L1 * Math.cos(a) + L2 * Math.cos(b), dz = -L1 * Math.sin(a) - L2 * Math.sin(b);
    p._pos = [0, drop + HIP_OFF - HIPS_Y - 0.004, -dz];
    ['L', 'R'].forEach(function (S) { var sg = S === 'L' ? 1 : -1; p['Thigh_' + S] = [a, 0, sg * RS.thighZ]; p['Shin_' + S] = [knee, 0, sg * RS.shinZ]; p['Foot_' + S] = [-b, sg * tw, 0]; });
    return p;
  }
  function eulerToQuat(e) { return new THREE.Quaternion().setFromEuler(new THREE.Euler(e[0], e[1], e[2], 'XYZ')); }
  function applyPose(J, p) { JN.forEach(function (j) { J[j].quaternion.copy(eulerToQuat(p[j])); }); J.Hips.position.set(p._pos[0], HIPS_Y + p._pos[1], p._pos[2]); }

  // ---- numeric IK for the arms (coordinate descent on Euler angles), used to place the hands for the idle pose
  function solveArm(rig, pose, S, target, fdir, o) {
    o = o || {};
    var J = rig.J, s = S === 'L' ? 1 : -1, v = (o.init || [0.4, 0.3 * s, 0.25 * s, -1.0, 0.0, 0.0, 0.0]).slice();
    var keys = ['UpperArm_' + S, 'Forearm_' + S, 'Hand_' + S], tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
    function set(v) {
      pose[keys[0]] = [v[0], v[1], v[2]]; pose[keys[1]] = [v[3], v[4], 0]; pose[keys[2]] = [v[5], 0, v[6]];
      applyPose(J, pose); rig.root.updateMatrixWorld(true);
    }
    function cost(v) {
      set(v);
      var e = J['Slot_Hand_' + S].getWorldPosition(tmp), c = e.distanceToSquared(target) * 400;
      if (fdir) { var hpos = J['Hand_' + S].getWorldPosition(new THREE.Vector3()), fp = J['Fingers_' + S].getWorldPosition(tmp2); var d = fp.sub(hpos).normalize(); c += (1 - d.dot(fdir)) * 0.6; }
      var el = J['Forearm_' + S].getWorldPosition(new THREE.Vector3()), hp = J.Hips.getWorldPosition(new THREE.Vector3());
      var lat = (el.x - hp.x) * s, latMin = 0.21 * (rig.D.SH_X / 0.182); if (lat < latMin) c += (latMin - lat) * (latMin - lat) * 300;      // keep the elbow outside the body
      for (var i = 0; i < v.length; i++) c += v[i] * v[i] * 0.0015;
      return c;
    }
    var step = 0.25, best = cost(v), it, i;
    for (it = 0; it < 260 && step > 0.002; it++) {
      var improved = false;
      for (i = 0; i < v.length; i++) {
        for (var sg = -1; sg <= 1; sg += 2) { var w = v.slice(); w[i] += sg * step; var c2 = cost(w); if (c2 < best) { best = c2; v = w; improved = true; } }
      }
      if (!improved) step *= 0.5;
    }
    set(v);
    return v;
  }
  // the signature stance: hands clasped behind his back (photos, sheet 02/06)
  var BEHIND = null;
  function behindPose(rig) {
    if (rig._behind) { BEHIND = rig._behind; return BEHIND; }
    var p = plant(P({}), RS.thigh, RS.knee);
    applyPose(rig.J, p); rig.root.updateMatrixWorld(true);
    var hm = rig.J.Hips.matrixWorld;
    var bd = rig.D.behind || { L: [0.020, 0.030, -0.205], R: [-0.022, 0.050, -0.215] };
    var tL = new THREE.Vector3().fromArray(bd.L).applyMatrix4(hm), tR = new THREE.Vector3().fromArray(bd.R).applyMatrix4(hm);
    var vL = solveArm(rig, p, 'L', tL, new THREE.Vector3(-1, -0.3, -0.2).normalize());
    var vR = solveArm(rig, p, 'R', tR, new THREE.Vector3(1, -0.2, -0.3).normalize(), { init: [0.4, -0.3, -0.25, -1.0, 0, 0, 0] });
    BEHIND = { L: vL, R: vR }; rig._behind = BEHIND;
    return BEHIND;
  }

  var CLIPS, RIG_FOR_IK = null;
  function idleFn(t) {
    var f = 2 * Math.PI * t, p = plant(P({}), RS.thigh, RS.knee), b = BEHIND;
    p.Spine = [RS.spine + 0.012 * Math.sin(f), 0.04 * Math.sin(f), 0.012 * Math.sin(f)];
    p.Neck = [RS.neck - 0.008 * Math.sin(f), -0.07 * Math.sin(f), 0];
    p.Head = [RS.head + 0.03 * Math.sin(2 * f), 0.30 * Math.sin(f) + 0.07 * Math.sin(2 * f + 1), 0.03 * Math.sin(f + 0.6)];
    if (b && b.sides) {   // arms down, swaying a little (for looks drawn with the arms down)
      var fz = RS.foreZ === undefined ? 0.02 : RS.foreZ;
      p.UpperArm_L = [RS.armX + 0.03 * Math.sin(f + 0.5), 0, RS.armZ - 0.012 * Math.sin(f)]; p.Forearm_L = [RS.fore - 0.02 * Math.sin(f + 0.9), 0, fz];
      p.UpperArm_R = [RS.armX - 0.03 * Math.sin(f + 0.5), 0, -RS.armZ + 0.012 * Math.sin(f)]; p.Forearm_R = [RS.fore + 0.02 * Math.sin(f + 0.9), 0, -fz];
    } else if (b) {
      p.UpperArm_L = [b.L[0], b.L[1], b.L[2]]; p.Forearm_L = [b.L[3], b.L[4], 0]; p.Hand_L = [b.L[5], 0, b.L[6]];
      p.UpperArm_R = [b.R[0], b.R[1], b.R[2]]; p.Forearm_R = [b.R[3], b.R[4], 0]; p.Hand_R = [b.R[5], 0, b.R[6]];
      p.Fingers_L = [0, 0, -0.55]; p.Fingers_R = [0, 0, 0.65];
    }
    p.Hips = [0, 0.015 * Math.sin(f), 0.010 * Math.sin(f)];
    p._pos[0] = 0.006 * Math.sin(f);
    return p;
  }
  function gait(t, c) {
    var f = 2 * Math.PI * t, p = P({}), hs = [];
    ['L', 'R'].forEach(function (S) {
      var sg = S === 'L' ? 1 : -1, psi = f + (S === 'R' ? Math.PI : 0), th = -c.A * Math.sin(psi);
      var kn = c.k0 + c.k1 * Math.pow(Math.max(0, Math.cos(psi)), c.kp), stance = Math.max(0, -Math.cos(psi));
      var ft = -(th + kn) * (0.78 + 0.22 * stance);
      p['Thigh_' + S] = [th, 0, sg * 0.05]; p['Shin_' + S] = [kn, 0, -sg * 0.04]; p['Foot_' + S] = [ft, sg * c.toe, 0];
      hs.push(L1 * Math.cos(th) + L2 * Math.cos(th + kn) + HIP_OFF - HIPS_Y - 0.004);
    });
    var lift = c.lift * (0.5 - 0.5 * Math.cos(2 * f));
    p._pos = [-c.sway * Math.sin(f), Math.max(hs[0], hs[1]) + lift, 0];
    p.Hips = [0.02 * Math.cos(2 * f), -c.tw * Math.sin(f), 0.03 * Math.sin(f)];
    p.Spine = [RS.spine + c.lean + 0.02 * Math.cos(2 * f), c.tw * 1.3 * Math.sin(f), -0.02 * Math.sin(f)];
    p.Neck = [RS.neck - c.lean * 0.5, -c.tw * 0.5 * Math.sin(f), 0];
    p.Head = [RS.head - c.lean * 0.4, -c.tw * 0.5 * Math.sin(f), 0];
    p.UpperArm_L = [c.ax + c.arm * Math.sin(f), 0, c.az]; p.UpperArm_R = [c.ax - c.arm * Math.sin(f), 0, -c.az];
    p.Forearm_L = [-(c.e0 + c.e1 * Math.max(0, -Math.sin(f))), 0, 0]; p.Forearm_R = [-(c.e0 + c.e1 * Math.max(0, Math.sin(f))), 0, 0];
    p.Fingers_L = [0, 0, -c.fist]; p.Fingers_R = [0, 0, c.fist];
    return p;
  }
  function walkFn(t) { return gait(t, { A: 0.34, k0: 0.14, k1: 0.70, kp: 1.3, lift: 0.0, sway: 0.012, tw: 0.06, lean: 0.06, ax: 0.05, arm: 0.30, az: 0.16, e0: 0.32, e1: 0.26, fist: 0.45, toe: 0.24 }); }
  function runFn(t) { return gait(t, { A: 0.72, k0: 0.45, k1: 1.60, kp: 1.1, lift: 0.13, sway: 0.01, tw: 0.13, lean: 0.24, ax: 0.0, arm: 0.92, az: 0.14, e0: 1.25, e1: 0.25, fist: 1.0, toe: 0.10 }); }
  // jump: crouch, launch, tuck, extend, land. Hip height in the air follows a parabola (airborne 0.40-0.95 s, apex 0.36 m).
  var JUMP = { t0: 0.32, t1: 0.76, H: 0.36 };
  var jumpPose = null;
  function makeJumpPose() {
    var stand = plant(P({}), RS.thigh, RS.knee);
    var crouch = plant(P({ Spine: [0.55, 0, 0], Neck: [0.20, 0, 0], Head: [-0.40, 0, 0], Fingers_L: [0, 0, -0.8], Fingers_R: [0, 0, 0.8] }), -1.1, 1.85, 0.25);
    both(crouch, 'UpperArm', [1.0, 0, 0.22]); both(crouch, 'Forearm', [-0.35, 0, 0]);
    var launch = plant(P({ Spine: [0.0, 0, 0], Neck: [0.24, 0, 0], Head: [-0.30, 0, 0] }), 0.0, 0.04, 0.25);
    both(launch, 'UpperArm', [-2.45, 0, 0.32]); both(launch, 'Forearm', [-0.25, 0, 0]);
    var tuck = P({ Spine: [0.12, 0, 0], Neck: [0.28, 0, 0], Head: [-0.34, 0, 0], Fingers_L: [0, 0, -0.3], Fingers_R: [0, 0, 0.3] });
    both(tuck, 'Thigh', [-1.05, 0, 0.10]); both(tuck, 'Shin', [1.50, 0, 0]); both(tuck, 'Foot', [0.45, 0.20, 0]);
    both(tuck, 'UpperArm', [-2.35, 0, 0.60]); both(tuck, 'Forearm', [-0.45, 0, 0]);
    var extend = P({ Spine: [0.06, 0, 0], Neck: [0.30, 0, 0], Head: [-0.32, 0, 0], Fingers_L: [0, 0, -0.3], Fingers_R: [0, 0, 0.3] });
    both(extend, 'Thigh', [-0.35, 0, 0.08]); both(extend, 'Shin', [0.55, 0, 0]); both(extend, 'Foot', [0.0, 0.25, 0]);
    both(extend, 'UpperArm', [-1.50, 0, 0.72]); both(extend, 'Forearm', [-0.35, 0, 0]);
    var touch = plant(P({ Spine: [0.14, 0, 0], Neck: [0.34, 0, 0], Head: [-0.34, 0, 0] }), -0.18, 0.30, 0.25);
    both(touch, 'UpperArm', [-0.95, 0, 0.48]); both(touch, 'Forearm', [-0.40, 0, 0]);
    var land = plant(P({ Spine: [0.46, 0, 0], Neck: [0.20, 0, 0], Head: [-0.38, 0, 0] }), -1.0, 1.7, 0.30);
    both(land, 'UpperArm', [-0.70, 0, 0.38]); both(land, 'Forearm', [-0.55, 0, 0]);
    return keyed([[0, stand], [0.17, crouch], [JUMP.t0, launch], [0.46, tuck], [0.60, tuck], [0.70, extend], [JUMP.t1, touch], [0.84, land], [1, stand]]);
  }
  jumpPose = makeJumpPose();
  function jumpFn(t) {
    var p = jumpPose(t);
    if (t > JUMP.t0 && t < JUMP.t1) p._pos[1] += 4 * JUMP.H * (t - JUMP.t0) * (JUMP.t1 - t) / Math.pow(JUMP.t1 - JUMP.t0, 2);
    return p;
  }
  // holding a find in both palms, head bent over it. The palm-up roll is shared by the forearm and the hand (less wrist twist).
  function holdFn(t) {
    var f = 2 * Math.PI * t, p = plant(P({}), RS.thigh, RS.knee);
    p.Spine = [0.14 + 0.012 * Math.sin(f), 0, 0]; p.Neck = [0.46 + 0.04 * Math.sin(2 * f), 0, 0]; p.Head = [-0.16 + 0.03 * Math.sin(2 * f + 1), 0.10 * Math.sin(f), 0.04 * Math.sin(f)];
    p.Hips = [0, 0.03 * Math.sin(f), 0]; p._pos[0] = 0.006 * Math.sin(f);
    p.UpperArm_L = [-0.58, 0, -0.10]; p.UpperArm_R = [-0.58, 0, 0.10];
    p.Forearm_L = [-1.28 + 0.03 * Math.sin(2 * f), 0.85, 0]; p.Forearm_R = [-1.28 + 0.03 * Math.sin(2 * f), -0.85, 0];
    p.Hand_L = [0, 0.60, 0]; p.Hand_R = [0, -0.60, 0];
    p.Fingers_L = [0, 0, -0.70]; p.Fingers_R = [0, 0, 0.70];
    return p;
  }
  function holdUpFn(t) {
    var f = 2 * Math.PI * t, p = plant(P({ Spine: [-0.04, 0, 0], Neck: [0.18, 0, 0], Head: [-0.46 + 0.03 * Math.sin(f), 0, 0] }), -0.02, 0.05);
    p._pos[1] += 0.014 * (0.5 - 0.5 * Math.cos(2 * f));
    p.UpperArm_L = [-2.70 + 0.04 * Math.sin(f), 0, 0.04]; p.UpperArm_R = [-2.70 + 0.04 * Math.sin(f), 0, -0.04];
    p.Forearm_L = [-0.30, 0, 0]; p.Forearm_R = [-0.30, 0, 0];
    p.Hand_L = [0, 0, 0]; p.Hand_R = [0, 0, 0];
    p.Fingers_L = [0, 0, -0.75]; p.Fingers_R = [0, 0, 0.75];
    p.Hips = [0, 0, 0.02 * Math.sin(f)];
    return p;
  }
  // sitting on a bench: thighs forward, shins down, hands on his knees, a slow breath and a look about
  function sitFn(t) {
    var f = 2 * Math.PI * t, p = plant(P({}), -1.42, 1.42, 0.18);
    p.Spine = [0.22 + 0.01 * Math.sin(f), 0.02 * Math.sin(f), 0]; p.Neck = [0.36, 0, 0]; p.Head = [-0.30 + 0.02 * Math.sin(2 * f), 0.22 * Math.sin(f), 0];
    p.UpperArm_L = [-0.18, 0, 0.12]; p.UpperArm_R = [-0.18, 0, -0.12]; p.Forearm_L = [-1.05, 0.15, 0]; p.Forearm_R = [-1.05, -0.15, 0];
    p.Fingers_L = [0, 0, -0.5]; p.Fingers_R = [0, 0, 0.5];
    return p;
  }
  CLIPS = {
    'idle':      { fn: idleFn,   dur: 4.0,  loop: true,  mode: 'carry',  info: 'Hands clasped behind his back, breathing, a slow look round' },
    'sit':       { fn: sitFn,    dur: 5.0,  loop: true,  mode: 'carry',  info: 'Sitting on a bench, hands on his knees' },
    'walk':      { fn: walkFn,   dur: 1.1,  loop: true,  mode: 'carry',  info: 'One full cycle, about 1.1 m/s' },
    'run':       { fn: runFn,    dur: 0.62, loop: true,  mode: 'carry',  info: 'One full cycle, about 3.4 m/s (comic)' },
    'jump':      { fn: jumpFn,   dur: 1.25, loop: false, mode: 'carry',  info: 'Crouch, launch, tuck, land. Airborne from 0.40 s to 0.95 s' },
    'hold-item': { fn: holdFn,   dur: 3.0,  loop: true,  mode: 'cradle', info: 'Inspecting a find in both palms' },
    'hold-up':   { fn: holdUpFn, dur: 2.0,  loop: true,  mode: 'cradle', info: 'Lifting a find overhead' },
  };
  function buildClip(name, fps) {
    var c = CLIPS[name], n = Math.round(c.dur * fps), times = [], k, tr = {}, pos = [], prev = {};
    JN.forEach(function (j) { tr[j] = []; });
    for (k = 0; k <= n; k++) {
      var u = k / n, p = c.fn(c.loop && k === n ? 0 : u);
      times.push(u * c.dur);
      JN.forEach(function (j) {
        var q = eulerToQuat(p[j]);
        if (prev[j] && prev[j].dot(q) < 0) { q.x *= -1; q.y *= -1; q.z *= -1; q.w *= -1; }
        prev[j] = q; tr[j].push(q.x, q.y, q.z, q.w);
      });
      pos.push(p._pos[0], HIPS_Y + p._pos[1], p._pos[2]);
    }
    var tracks = [new THREE.VectorKeyframeTrack('Hips.position', times, pos)];
    JN.forEach(function (j) { tracks.push(new THREE.QuaternionKeyframeTrack(j + '.quaternion', times, tr[j])); });
    var clip = new THREE.AnimationClip(name, c.dur, tracks);
    clip.userData = { loop: c.loop, itemMode: c.mode, info: c.info };
    return clip;
  }

  // mixer, actions, play / seek for anything built on a PKSkin rig
  function animate(king, fps) {
    setDims(king.rig.D);
    behindPose(king.rig);
    king.clips = {}; king.clipNames = Object.keys(CLIPS);
    king.clipNames.forEach(function (n) { king.clips[n] = buildClip(n, fps || 24); });
    king.clipInfo = CLIPS;
    king.mixer = new THREE.AnimationMixer(king.root);
    king.actions = {}; king.current = null;
    king.clipNames.forEach(function (n) {
      var a = king.mixer.clipAction(king.clips[n]);
      if (!CLIPS[n].loop) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
      king.actions[n] = a;
    });
    king.play = function (name, fade) {
      var a = king.actions[name]; if (!a) return;
      var prev = king.current && king.actions[king.current];
      king.current = name; king.setItemMode(CLIPS[name].mode);
      a.reset().play();
      if (prev && prev !== a) a.crossFadeFrom(prev, fade === undefined ? 0.25 : fade, false);
    };
    king.seek = function (name, time) {
      king.mixer.stopAllAction();
      var a = king.actions[name]; king.current = name; king.setItemMode(CLIPS[name].mode);
      a.reset(); a.play(); a.paused = false; king.mixer.update(0); a.time = time; a.paused = true; king.mixer.update(0);
    };
    king.setRestPose = function () { withRest(king.rig._rest, function () { setDims(king.rig.D); BEHIND = king.rig._behind; applyPose(king.joints, idleFn(0)); }); };
    king.setRestPose();
    setDims(K.D);
    return king;
  }
  function createKing(opts) { opts = opts || {}; return animate(makeKing(opts), opts.fps); }
  // the bare skeleton with the six moves and the held props: other looks (paper doll, toon king) hang their own pieces on it
  // a rig with its own rest posture (e.g. a drawing that is already stooped): RS is swapped while its clips are built
  function withRest(rest, fn) {
    if (!rest) return fn();
    var saved = Object.assign({}, RS); Object.assign(RS, rest);
    try { return fn(); } finally { Object.keys(RS).forEach(function (k) { if (!(k in saved)) delete RS[k]; }); Object.assign(RS, saved); }
  }
  function createRig(opts) {
    opts = opts || {};
    if (opts.rest) { var o2 = Object.assign({}, opts); delete o2.rest; return withRest(opts.rest, function () { var k = createRig(o2); k.rig._rest = opts.rest; return k; }); }
    var rig = K.makeRig(opts.dims), J = rig.J;
    var king = { root: rig.root, rig: rig, joints: J, props: {}, slots: { head: J.Slot_Head, handR: J.Slot_Hand_R, handL: J.Slot_Hand_L } };
    var held = [];
    if (opts.props !== false) {
      king.props.bowl = buildBowl(); king.props.bottle = buildBottle(); king.props.icosa = buildIcosa();
      held = [king.props.bowl, king.props.bottle, king.props.icosa];
      held.forEach(function (p) { p.visible = false; J.Slot_Hand_R.add(p); });
    }
    king.itemMode = 'cradle';
    king.cradle = CRADLE.slice(); king.carry = [-0.070, -0.070, 0.0];
    function placeItem() {
      held.forEach(function (p) { p.rotation.set(0, 0, 0); });
      if (!king.item || !king.props[king.item]) return;
      var p = king.props[king.item];
      if (king.itemMode === 'cradle') { p.position.fromArray(king.cradle); p.rotation.set(0, 0, -Math.PI / 2); }
      else { p.position.fromArray(king.carry); p.rotation.set(0, 0, 0); }
    }
    king.setItem = function (id) { king.item = id || null; held.forEach(function (p) { p.visible = false; }); if (id && king.props[id]) king.props[id].visible = true; placeItem(); };
    king.setItemMode = function (m) { king.itemMode = m; placeItem(); };
    king.addHeld = function (id, obj) { obj.visible = false; J.Slot_Hand_R.add(obj); king.props[id] = obj; held.push(obj); };
    king.setHat = function () {};
    if (opts.handsAtSides) rig._behind = { sides: true };
    return animate(king, opts.fps);
  }
  // assets (the photo texture) decode asynchronously: call ready() first, then create()
  function ready() { return F.loadAssets ? F.loadAssets() : Promise.resolve(); }

  global.PhilosopherKing = { create: createKing, createRig: createRig, ready: ready, PAL: PAL, CLIPS: CLIPS, JOINTS: JN, OUTFITS: OUTFITS, REST: RS };
})(typeof window !== 'undefined' ? window : globalThis);

;