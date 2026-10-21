/* PKToon: the fantasy pixel Philosopher King, a chunky cartoon built from simple solids on the shared skeleton.
   Designed after the hand-coded pixel studies: big bald head with white side tufts, long drooping nose, heavy white brows,
   gold paper crown with blue/green/red gems, tweed jacket with elbow patches, green waistcoat with gold buttons, cream shirt,
   khaki cargo shorts, black socks and oversized orange sneakers. Optional royal cape with an ermine mantle.
   Proportions come from the 100-px study (1 study unit = 0.016 m, 1.58 m tall). Rendered through PKPixel3D. */
// R186: ported to three.js r186 for Creekfolk 2 (see creekfolk2/docs/R186-PORT.md); every change is marked R186.
// R186: the light factor Lf below (and TD, TL) is in r128's legacy light units. r186 has only physical units, where a toon or any
// lit material gets 1/PI of the light it got in r128: give the page's lights PI times WTWB's intensities (hemi 0.45 * PI, ...).
(function (global) {
  'use strict';
  var THREE = global.THREE, C = global.PKCore;
  var T = {};
  global.PKToon = T;

  // palette of the studies (+ cape, ermine and props)
  var P = T.P = {
    ink: '#39332e', coat: '#866443', coat_dark: '#624b36', coat_light: '#a58559', patch: '#b08b55', green: '#3b5849', green_dark: '#293e35',
    shirt: '#e5d6bb', gold: '#e7bd55', gold_dark: '#b58b3d', skin: '#e5b18b', skin_light: '#f4cba1', skin_shadow: '#bc8064',
    hair: '#eee9d8', hair_shadow: '#b6b4a5', shorts: '#c4b48a', shorts_dark: '#938567', shoe: '#a59a80', shoe_light: '#d4c9a8',
    orange: '#f28b32', orange_dark: '#b55928', red: '#be5046', blue: '#427c94',
    cape: '#7c2433', cape_dark: '#561722', cape_light: '#a3394a', ermine: '#f3efe3', ermine_dark: '#c9c3b2', eye: '#2b2622',
    shirt_dark: '#c9b99a', skin_deep: '#9b6250', gold_deep: '#8a6a2c', red_dark: '#8e3a33', blue_dark: '#2f5c6e', coat_deep: '#4a3828'
  };
  var U = 0.016;   // one study unit in metres
  T.DIMS = {
    HIPS_Y: 0.532, THIGH_X: 0.112, THIGH_Y: -0.020, L1: 0.208, L2: 0.176, ANK: 0.128,
    NECK_Y: 0.420, NECK_Z: 0.0, HEAD_DY: 0.030, HEAD_DZ: 0.012, EYE_DY: 0.17, EYE_DZ: 0.15,
    SH_X: 0.222, SH_Y: 0.372, UA: 0.176, FA: 0.165, PALM: 0.060, HAND_SCALE: 1.0,
    behind: { L: [0.060, 0.120, -0.170], R: [-0.062, 0.138, -0.176] }
  };

  // Palette-ramp toon shading: each material has three palette colours (shadow, mid, light). The lighting factor at a pixel
  // (ambient + half-Lambert key light x received shadow) picks one of them, so the render only ever contains designed colours.
  var ramp = null;
  function rampTex() {
    if (ramp) return ramp;
    var d = new Uint8Array(256 * 4); for (var i = 0; i < 256; i++) { d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = i; d[i * 4 + 3] = 255; }
    ramp = new THREE.DataTexture(d, 256, 1, THREE.RGBAFormat); ramp.minFilter = ramp.magFilter = THREE.LinearFilter; ramp.needsUpdate = true; return ramp;
  }
  T.TD = 0.78; T.TL = 1.12;
  // Shared by every ramp material (one object, so setting a value reaches them all):
  //   uTime  seconds;  uWind  xy = how far a plant's tip leans (m), z = gustiness, w = strength (0 calm .. 1 storm)
  //   uCloud xy = drift of the cloud shadows (m), z = their scale (1/m), w = how dark they fall (0 none)
  //   uDith  x = width of the dithered band where one tone gives way to the next, y = dither cell (art pixels)
  //   uDay   x = daylight (0 night .. 1 day), y = storm (0 .. 1)
  T.FX = {
    uTime: { value: 0 }, uWind: { value: new THREE.Vector4(0.05, 0.012, 0.5, 0.3) }, uCloud: { value: new THREE.Vector4(0, 0, 0.035, 0.0) },
    uDith: { value: new THREE.Vector2(0.06, 1) }, uDay: { value: new THREE.Vector2(1, 0) }
  };
  var GLSL_NOISE = [
    'float pkHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float pkNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(pkHash(i), pkHash(i + vec2(1.0, 0.0)), f.x), mix(pkHash(i + vec2(0.0, 1.0)), pkHash(i + vec2(1.0, 1.0)), f.x), f.y); }',
    'float pkB2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }',
    'float pkBayer(vec2 a){ return pkB2(0.5 * a) * 0.25 + pkB2(a); }'
  ].join('\n');
  T.GLSL_NOISE = GLSL_NOISE;
  // o.flat faceted; o.side; o.sway: leans in the wind (needs the geometry's 'sway' attribute: 0 at the root, 1 at the tip);
  // o.vary: patches of lighter and darker tone across the ground (amount); o.water: the moving water surface (attributes
  // aFlow = flow direction x speed, aEdge = 0 mid-stream .. 1 at the bank, aDeep = depth in metres), with foam and glints in o.foam / o.spark
  function rampMat(dark, mid, light, o) {
    o = o || {};
    var m = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap: rampTex(), side: o.side || THREE.FrontSide });
    if (o.flat) m.flatShading = true;
    var cD = C.col(dark), cM = C.col(mid), cL = C.col(light), uVar = { value: o.vary || 0 };
    var cF = o.water ? C.col(o.foam || '#eef6f6') : null, cS = o.water ? C.col(o.spark || '#fff6d0') : null;
    m.userData.uVar = uVar;
    m.onBeforeCompile = function (sh) {
      sh.uniforms.cD = { value: cD }; sh.uniforms.cM = { value: cM }; sh.uniforms.cL = { value: cL }; sh.uniforms.tD = { value: T.TD }; sh.uniforms.tL = { value: T.TL };
      for (var k in T.FX) sh.uniforms[k] = T.FX[k];
      sh.uniforms.uVar = uVar;
      if (o.water) { sh.uniforms.cF = { value: cF }; sh.uniforms.cS = { value: cS }; }
      var vHead = 'uniform float uTime; uniform vec4 uWind; varying vec3 vWPos;\n' + (o.sway ? 'attribute float sway;\n' : '') + (o.water ? 'attribute vec2 aFlow; attribute vec2 aUV; attribute float aEdge; attribute float aDeep; varying vec2 vFlow; varying vec2 vUV; varying float vEdge; varying float vDeep;\n' : '');
      // swaying things are placed in the world first, pushed by the wind there (the same way for every copy of an instanced plant), then projected
      // R186: r186's project_vertex (which this replaces) also places a BatchedMesh's copies; the same lines are kept here and below
      var projSway = [
        'vec4 wq = vec4(transformed, 1.0);', '#ifdef USE_BATCHING', 'wq = batchingMatrix * wq;', '#endif', '#ifdef USE_INSTANCING', 'wq = instanceMatrix * wq;', '#endif', 'wq = modelMatrix * wq;',
        '{ float ph = dot(wq.xz, vec2(0.31, 0.19));',
        '  float s = 0.55 + 0.3 * sin(uTime * 1.7 + ph) + 0.15 * sin(uTime * 3.9 + ph * 2.3) + uWind.z * 0.35 * sin(uTime * 0.53 + ph * 0.21);',
        '  wq.xz += uWind.xy * sway * s * (1.0 + 2.2 * uWind.w); wq.y -= 0.25 * length(uWind.xy) * sway * sway * s * (1.0 + 2.2 * uWind.w); }',
        'vWPos = wq.xyz;', 'vec4 mvPosition = viewMatrix * wq;', 'gl_Position = projectionMatrix * mvPosition;'
      ].join('\n');
      var projPlain = '#include <project_vertex>\n  { vec4 wq = vec4(transformed, 1.0);\n  #ifdef USE_BATCHING\n  wq = batchingMatrix * wq;\n  #endif\n  #ifdef USE_INSTANCING\n  wq = instanceMatrix * wq;\n  #endif\n  vWPos = (modelMatrix * wq).xyz; }';
      sh.vertexShader = vHead + sh.vertexShader
        .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + (o.water ? '  vFlow = aFlow; vUV = aUV; vEdge = aEdge; vDeep = aDeep;' : ''))
        .replace('#include <project_vertex>', o.sway ? projSway : projPlain);
      var fHead = 'uniform vec3 cD; uniform vec3 cM; uniform vec3 cL; uniform float tD; uniform float tL;\nuniform float uTime; uniform vec4 uCloud; uniform vec2 uDith; uniform vec2 uDay; uniform float uVar; varying vec3 vWPos;\n' +
        (o.water ? 'uniform vec3 cF; uniform vec3 cS; varying vec2 vFlow; varying vec2 vUV; varying float vEdge; varying float vDeep;\n' : '') + GLSL_NOISE + '\n';
      var body = [
        'float Lf = dot( outgoingLight, vec3( 0.299, 0.587, 0.114 ) );',
        // shadows of passing clouds, drifting over everything
        'if (uCloud.w > 0.0) { vec2 cq = vWPos.xz * uCloud.z + uCloud.xy; float cn = pkNoise(cq) * 0.62 + pkNoise(cq * 2.7 + 3.7) * 0.38; Lf *= 1.0 - uCloud.w * smoothstep(0.52, 0.6, cn); }',
        // the ground in patches: lighter and darker grass, worn and fresh path
        'if (uVar > 0.0) Lf *= 1.0 + uVar * (pkNoise(vWPos.xz * 0.42) - 0.5) + uVar * 0.6 * (pkNoise(vWPos.xz * 1.9 + 11.0) - 0.5);',
        'float dth = (pkBayer(floor(gl_FragCoord.xy / uDith.y)) - 0.5) * uDith.x * (uVar > 0.0 ? 0.45 : 1.0);'
      ];
      if (o.water) body = body.concat([
        // water, in its own coordinates (vUV: metres along the channel and across it; the pond and pools use x and z):
        // mostly the middle tone, darker where it is deep or in shade, paler in the shallows, with sparse pale streaks that run
        // with the current (on still water, slow patches of reflected sky), a line of foam at the shore and glints of sun
        'float sp = length(vFlow) * (1.0 + 0.9 * uDay.y); vec2 wp = vWPos.xz, q = vUV;',
        'float st = pkNoise(vec2(q.x * 0.32 - uTime * sp * 0.55, q.y * 3.6)) * 0.7 + pkNoise(vec2(q.x * 0.9 - uTime * sp * 0.8, q.y * 7.5) + 7.3) * 0.3;',
        'float rf = pkNoise(q * 0.2 + vec2(uTime * 0.03, uTime * 0.012)) * 0.6 + pkNoise(q * 0.7 - vec2(uTime * 0.025, uTime * 0.04) + 4.0) * 0.4;',
        'float hl = mix(rf, st, clamp(sp * 1.8, 0.0, 1.0));',
        'float dp = clamp(vDeep / 1.1, 0.0, 1.0), sun = smoothstep(tD - 0.12, tL, Lf);',
        'float w = 0.5 + 0.2 * sun - 0.32 * dp + 0.3 * smoothstep(0.5, 1.0, vEdge);',
        'vec3 tone = w < 0.3 ? cD : (w < 0.8 ? cM : cL);',
        'if (hl + dth * 0.5 > mix(0.6, 0.685, clamp(sp * 2.0, 0.0, 1.0)) + 0.05 * (1.0 - uDay.x)) tone = cL;',
        // a line of foam along the shore (thicker where it runs fast), and glints where the light catches a ripple
        'float fo = vEdge + 0.08 * (pkNoise(q * vec2(1.4, 2.6) + vec2(-uTime * 0.6 * (0.25 + sp), 0.0)) - 0.5) + 0.04 * sp;',
        'if (fo > 0.9) tone = cF;',
        'vec2 gc = floor(wp * 8.0); float gh = pkHash(gc), tw = fract(gh * 7.13 + uTime * (0.3 + gh * 0.5));',
        'float glt = step(0.985 - 0.01 * sp, gh) * step(tw, 0.3) * (uDay.x > 0.25 ? step(tD, Lf) : step(0.995, gh));',
        'if (glt > 0.5 && fo <= 0.9) tone = cS;'
      ]); else body.push('vec3 tone = (Lf + dth) < tD ? cD : ( (Lf + dth) < tL ? cM : cL );');
      body.push('gl_FragColor = vec4( tone, diffuseColor.a );');
      // R186: the line this used to replace now sits inside the opaque_fragment chunk, so the old replace found nothing and the
      // palette ramp silently stopped working; the whole chunk is replaced instead. That also keeps diffuseColor.a = opacity: the
      // chunk would set it to 1 for every non-transparent material, and the pixel pass reads it as a tag (1 normal, 0.875 the king,
      // 0.5 soft, 0.25 shines). The last line pushed above stays word for word, because PKValley's earth paint replaces it in turn.
      // (The rest of the chunk is transmission, which a toon material never has.)
      if (sh.fragmentShader.indexOf('#include <opaque_fragment>') < 0) console.warn('PKToon.rampMat: no opaque_fragment in this three.js; the palette ramp is off');   // R186: so it can never fail silently again
      sh.fragmentShader = fHead + sh.fragmentShader.replace('#include <opaque_fragment>', body.join('\n'));
    };
    if (o.sway || o.water) { var key = 'ramp' + (o.sway ? '-sway' : '') + (o.water ? '-water' : ''); m.customProgramCacheKey = function () { return key; }; }
    m.userData.tones = [dark, mid, light];
    return m;
  }
  T.rampMat = rampMat;
  // shadow / mid / light per paint
  var TONES = {
    skin: ['skin_shadow', 'skin', 'skin_light'], skin_light: ['skin', 'skin_light', 'skin_light'], skin_shadow: ['skin_deep', 'skin_shadow', 'skin'],
    hair: ['hair_shadow', 'hair', 'hair'], hair_shadow: ['hair_shadow', 'hair_shadow', 'hair'],
    coat: ['coat_dark', 'coat', 'coat_light'], coat_dark: ['coat_deep', 'coat_dark', 'coat'], coat_light: ['coat', 'coat_light', 'patch'], patch: ['coat_light', 'patch', 'patch'],
    green: ['green_dark', 'green', 'green'], green_dark: ['green_dark', 'green_dark', 'green'], shirt: ['shirt_dark', 'shirt', 'shirt'],
    gold: ['gold_dark', 'gold', 'gold'], gold_dark: ['gold_deep', 'gold_dark', 'gold'], shorts: ['shorts_dark', 'shorts', 'shorts'], shorts_dark: ['coat_dark', 'shorts_dark', 'shorts'],
    shoe: ['shorts_dark', 'shoe', 'shoe_light'], shoe_light: ['shoe', 'shoe_light', 'shoe_light'], orange: ['orange_dark', 'orange', 'orange'], orange_dark: ['orange_dark', 'orange_dark', 'orange'],
    ink: ['ink', 'ink', 'ink'], eye: ['ink', 'ink', 'ink'], red: ['red_dark', 'red', 'red'], blue: ['blue_dark', 'blue', 'blue'],
    cape: ['cape_dark', 'cape', 'cape_light'], ermine: ['ermine_dark', 'ermine', 'ermine']
  };
  var mats = {};
  function M(key) {
    if (!mats[key]) { var t = TONES[key] || [key, key, key]; mats[key] = rampMat(P[t[0]], P[t[1]], P[t[2]]); mats[key].name = 'Toon_' + key; }
    return mats[key];
  }
  function mesh(geo, key, name) { var m = new THREE.Mesh(geo, M(key)); m.name = name || key; m.castShadow = true; m.receiveShadow = true; return m; }
  function ell(rx, ry, rz, seg) { var g = new THREE.SphereGeometry(1, seg || 14, Math.max(6, Math.round((seg || 14) * 0.6))); g.scale(rx, ry, rz); return g; }
  function cyl(rt, rb, h, seg, zk) { var g = new THREE.CylinderGeometry(rt, rb, h, seg || 12); if (zk) g.scale(1, 1, zk); return g; }
  function box(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
  function at(o, x, y, z) { o.position.set(x, y, z); return o; }
  function rot(o, x, y, z) { o.rotation.set(x || 0, y || 0, z || 0); return o; }
  // a flat star prism (crown gems)
  function star(r, d) {
    var s = new THREE.Shape();
    for (var i = 0; i < 10; i++) { var a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; if (i) s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    var g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2); return g;
  }

  T.build = function (king) {
    var J = king.joints, Dm = king.rig.D, out = {};
    // ---------------------------------------------------------------- head (Head bone: origin under the chin)
    var H = new THREE.Group(); H.name = 'ToonHead'; J.Head.add(H);
    var skull = mesh(ell(0.165, 0.205, 0.175, 20), 'skin', 'Skull'); at(skull, 0, 0.20, 0.02); H.add(skull);
    var crownTop = mesh(ell(0.150, 0.08, 0.160, 16), 'skin_light', 'Pate'); at(crownTop, 0, 0.33, 0.015); H.add(crownTop);
    var jaw = mesh(ell(0.130, 0.10, 0.140, 16), 'skin', 'Jaw'); at(jaw, 0, 0.085, 0.04); H.add(jaw);
    // long, slightly crooked nose
    var nose = mesh(ell(0.038, 0.090, 0.050, 12), 'skin', 'Nose'); at(nose, 0.012, 0.140, 0.200); rot(nose, 0.42, 0, -0.12); H.add(nose);
    var tip = mesh(ell(0.044, 0.038, 0.040, 12), 'skin_shadow', 'NoseTip'); at(tip, 0.020, 0.080, 0.222); H.add(tip);
    // ears
    [-1, 1].forEach(function (s) {
      var ear = mesh(ell(0.026, 0.060, 0.044, 10), 'skin_shadow', 'Ear'); at(ear, s * 0.168, 0.175, 0.0); rot(ear, 0, 0, s * 0.15); H.add(ear);
      // brows: heavy white wedges
      var brow = mesh(box(0.075, 0.022, 0.03), 'hair', 'Brow'); at(brow, s * 0.064, 0.238, 0.170); rot(brow, 0.1, 0, s * -0.20); H.add(brow);
      var eye = mesh(box(0.024, 0.026, 0.012), 'eye', 'Eye'); at(eye, s * 0.060, 0.205, 0.180); H.add(eye);
      // white tufts sticking out at the sides and back
      // fluffy white tufts: small clusters above and behind the ears
      [[0.150, 0.250, 0.030, 0.034], [0.168, 0.282, -0.010, 0.030], [0.176, 0.240, -0.040, 0.036], [0.160, 0.300, -0.050, 0.026], [0.150, 0.205, -0.075, 0.034], [0.130, 0.260, -0.095, 0.032], [0.188, 0.268, 0.010, 0.022]]
        .forEach(function (q, k) { var tf = mesh(new THREE.IcosahedronGeometry(q[3], 0), k % 3 === 2 ? 'hair_shadow' : 'hair', 'Tuft'); at(tf, s * q[0], q[1], q[2]); tf.rotation.set(k, k * 2, 0); H.add(tf); });
    });
    var backHair = mesh(ell(0.150, 0.075, 0.09, 14), 'hair', 'BackHair'); at(backHair, 0, 0.19, -0.115); H.add(backHair);
    var mouth = mesh(box(0.07, 0.012, 0.01), 'skin_shadow', 'Mouth'); at(mouth, 0.005, 0.072, 0.165); rot(mouth, 0, 0, -0.08); H.add(mouth);
    // ---------------------------------------------------------------- crown with gems
    var CR = new THREE.Group(); CR.name = 'Crown'; at(CR, 0, 0.345, 0.015); rot(CR, -0.10, 0, 0); H.add(CR);
    var band = mesh(cyl(0.158, 0.150, 0.058, 20, 1.04), 'gold_dark', 'CrownBand'); CR.add(band);
    var bandTop = mesh(cyl(0.160, 0.158, 0.016, 20, 1.04), 'gold', 'CrownRim'); at(bandTop, 0, 0.026, 0); CR.add(bandTop);
    var NPT = 6;
    for (var i = 0; i < NPT; i++) {
      var a = i / NPT * Math.PI * 2, tall = i === 0 ? 0.13 : (i === 3 ? 0.10 : 0.085);
      var pt = mesh(new THREE.ConeGeometry(0.055, tall, 4), 'gold', 'CrownPoint');
      at(pt, Math.sin(a) * 0.150, 0.026 + tall / 2, Math.cos(a) * 0.156); pt.scale.set(1, 1, 0.35); pt.rotation.set(0, a, 0); CR.add(pt);
    }
    [['blue', -0.62], ['green', 0], ['red', 0.62]].forEach(function (g) {
      var gm = mesh(star(0.022, 0.012), g[0], 'Gem'); at(gm, Math.sin(g[1]) * 0.160, -0.002, Math.cos(g[1]) * 0.166); gm.rotation.y = g[1]; CR.add(gm);
    });
    king.props.crown = CR;
    // ---------------------------------------------------------------- torso (Spine: origin at the hips)
    var S = new THREE.Group(); S.name = 'ToonTorso'; J.Spine.add(S);
    var jacket = mesh(cyl(0.200, 0.214, 0.345, 16, 0.74), 'coat', 'Jacket'); at(jacket, 0, 0.225, -0.005); S.add(jacket);
    [-1, 1].forEach(function (s) {
      var sh = mesh(ell(0.085, 0.07, 0.11, 12), 'coat', 'Shoulder'); at(sh, s * 0.185, 0.385, -0.01); S.add(sh);
      var lap = mesh(box(0.05, 0.22, 0.02), s < 0 ? 'coat_light' : 'coat_dark', 'Lapel'); at(lap, s * 0.085, 0.29, 0.148); rot(lap, -0.12, 0, s * 0.22); S.add(lap);
      var pocket = mesh(box(0.08, 0.015, 0.015), 'coat_dark', 'PocketFlap'); at(pocket, s * 0.13, 0.14, 0.152); S.add(pocket);
    });
    var hem = mesh(cyl(0.214, 0.222, 0.06, 16, 0.76), 'coat_dark', 'JacketHem'); at(hem, 0, 0.040, -0.005); S.add(hem);
    // waistcoat: a green panel down the front with gold buttons
    var vest = mesh(box(0.15, 0.26, 0.03), 'green', 'Waistcoat'); at(vest, 0, 0.215, 0.140); S.add(vest);
    var vestEdge = mesh(box(0.15, 0.03, 0.032), 'green_dark', 'WaistcoatHem'); at(vestEdge, 0, 0.092, 0.141); S.add(vestEdge);
    [0.27, 0.21, 0.15].forEach(function (y) { var b = mesh(box(0.03, 0.028, 0.012), 'gold', 'Button'); at(b, 0, y, 0.158); S.add(b); });
    var shirtV = mesh(new THREE.ConeGeometry(0.062, 0.10, 3), 'shirt', 'ShirtV'); at(shirtV, 0, 0.36, 0.142); rot(shirtV, Math.PI, 0, 0); shirtV.scale.z = 0.3; S.add(shirtV);
    var collar = mesh(cyl(0.085, 0.10, 0.05, 12, 0.85), 'shirt', 'Collar'); at(collar, 0, 0.415, 0.0); S.add(collar);
    // royal cape + ermine mantle (fantasy option)
    var cape = new THREE.Group(); cape.name = 'Cape'; S.add(cape);
    var capeGeo = cyl(0.235, 0.30, 0.62, 18, 0.80); capeGeo.translate(0, -0.31, 0);
    // keep only the back half of the cylinder
    var cpos = capeGeo.attributes.position;
    for (var q = 0; q < cpos.count; q++) { if (cpos.getZ(q) > 0.02) cpos.setZ(q, 0.02 + (cpos.getZ(q) - 0.02) * 0.05); }
    capeGeo.computeVertexNormals();
    var capeM = new THREE.Mesh(capeGeo, rampMat(P.cape_dark, P.cape, P.cape_light, { side: THREE.DoubleSide })); capeM.name = 'CapeCloth'; capeM.castShadow = true;
    at(capeM, 0, 0.39, -0.04); cape.add(capeM);
    var mantle = mesh(cyl(0.18, 0.245, 0.09, 18, 0.82), 'ermine', 'Ermine'); at(mantle, 0, 0.405, -0.005); cape.add(mantle);
    for (var e = 0; e < 9; e++) { var ea = (e / 9 - 0.5) * Math.PI * 1.6 + Math.PI, sp = mesh(box(0.016, 0.03, 0.01), 'ink', 'ErmineSpot'); at(sp, Math.sin(ea) * 0.226, 0.40 + (e % 2) * 0.02, -0.005 + Math.cos(ea) * 0.186); sp.rotation.y = ea; cape.add(sp); }
    var clasp = mesh(box(0.035, 0.035, 0.02), 'gold', 'Clasp'); at(clasp, 0, 0.40, 0.17); cape.add(clasp);
    out.cape = cape;
    // ---------------------------------------------------------------- shorts (Hips) and legs
    var HP = new THREE.Group(); HP.name = 'ToonHips'; J.Hips.add(HP);
    var seat = mesh(cyl(0.205, 0.210, 0.12, 16, 0.72), 'shorts', 'ShortsTop'); at(seat, 0, -0.02, 0.0); HP.add(seat);
    var belt = mesh(cyl(0.207, 0.207, 0.02, 16, 0.73), 'shorts_dark', 'Waistband'); at(belt, 0, 0.035, 0.0); HP.add(belt);
    ['L', 'R'].forEach(function (Sd) {
      var s = Sd === 'L' ? 1 : -1;
      var th = new THREE.Group(); th.name = 'ToonThigh_' + Sd; J['Thigh_' + Sd].add(th);
      var leg = mesh(cyl(0.105, 0.112, Dm.L1 + 0.03, 12, 0.92), 'shorts', 'ShortsLeg'); at(leg, s * 0.008, -Dm.L1 / 2 + 0.005, 0); th.add(leg);
      var pk = mesh(box(0.035, 0.09, 0.10), 'shorts_dark', 'CargoPocket'); at(pk, s * 0.115, -0.10, 0.0); th.add(pk);
      var pkf = mesh(box(0.038, 0.02, 0.105), 'shorts', 'CargoFlap'); at(pkf, s * 0.116, -0.055, 0.0); th.add(pkf);
      var cuff = mesh(cyl(0.114, 0.116, 0.025, 12, 0.92), 'shorts_dark', 'ShortsHem'); at(cuff, s * 0.008, -Dm.L1 + 0.01, 0); th.add(cuff);
      var sh = new THREE.Group(); sh.name = 'ToonShin_' + Sd; J['Shin_' + Sd].add(sh);
      var shin = mesh(cyl(0.050, 0.045, Dm.L2, 10), 'skin', 'Shin'); at(shin, 0, -Dm.L2 / 2, 0); sh.add(shin);
      var sock = mesh(cyl(0.052, 0.050, 0.07, 10), 'ink', 'Sock'); at(sock, 0, -Dm.L2 + 0.02, 0); sh.add(sock);
      var ft = new THREE.Group(); ft.name = 'ToonShoe_' + Sd; J['Foot_' + Sd].add(ft);
      var A = Dm.ANK;
      var upper = mesh(box(0.125, 0.085, 0.27), 'shoe', 'ShoeUpper'); at(upper, 0, -A + 0.065, 0.055); ft.add(upper);
      var toe = mesh(ell(0.064, 0.045, 0.06, 12), 'shoe', 'ShoeToe'); at(toe, 0, -A + 0.055, 0.19); ft.add(toe);
      var top = mesh(box(0.10, 0.03, 0.12), 'shoe_light', 'ShoeTongue'); at(top, 0, -A + 0.11, 0.02); ft.add(top);
      var sole = mesh(box(0.135, 0.03, 0.30), 'orange', 'Sole'); at(sole, 0, -A + 0.015, 0.06); ft.add(sole);
      var stripe = mesh(box(0.128, 0.018, 0.22), 'orange_dark', 'SoleStripe'); at(stripe, 0, -A + 0.045, 0.07); stripe.scale.x = 1.02; ft.add(stripe);
      var swoosh = mesh(box(0.13, 0.016, 0.14), 'orange', 'SideStripe'); at(swoosh, 0, -A + 0.075, 0.07); rot(swoosh, -0.25, 0, 0); ft.add(swoosh);
      // arms
      var ua = new THREE.Group(); ua.name = 'ToonUpperArm_' + Sd; J['UpperArm_' + Sd].add(ua);
      var sl = mesh(cyl(0.064, 0.058, Dm.UA + 0.03, 10), 'coat', 'Sleeve'); at(sl, s * 0.004, -Dm.UA / 2, 0); ua.add(sl);
      var fa = new THREE.Group(); fa.name = 'ToonForearm_' + Sd; J['Forearm_' + Sd].add(fa);
      var fsl = mesh(cyl(0.058, 0.054, Dm.FA + 0.01, 10), 'coat', 'ForeSleeve'); at(fsl, 0, -Dm.FA / 2, 0); fa.add(fsl);
      var patch = mesh(box(0.06, 0.07, 0.02), 'patch', 'ElbowPatch'); at(patch, 0, -0.035, -0.055); fa.add(patch);
      var cf = mesh(cyl(0.048, 0.048, 0.022, 10), 'shirt', 'ShirtCuff'); at(cf, 0, -Dm.FA + 0.004, 0); fa.add(cf);
      var hd = new THREE.Group(); hd.name = 'ToonHand_' + Sd; J['Hand_' + Sd].add(hd);
      var palm = mesh(ell(0.032, 0.048, 0.045, 10), 'skin', 'Palm'); at(palm, 0, -0.040, 0); hd.add(palm);
      var thumb = mesh(ell(0.016, 0.03, 0.016, 8), 'skin_shadow', 'Thumb'); at(thumb, -s * 0.01, -0.035, 0.042); rot(thumb, 0.4, 0, 0); hd.add(thumb);
      var fg = new THREE.Group(); fg.name = 'ToonFingers_' + Sd; J['Fingers_' + Sd].add(fg);
      var fing = mesh(ell(0.028, 0.032, 0.040, 8), 'skin', 'Fingers'); at(fing, 0, -0.018, 0); fg.add(fing);
    });
    // held props: shrink a little to the toon's hands
    ['bowl', 'bottle', 'icosa'].forEach(function (n) { if (king.props[n]) king.props[n].scale.setScalar(0.8); });
    king.cradle = [0.024, 0.0, -0.050]; king.carry = [-0.05, -0.05, 0];
    king.setHat = function (id) { CR.visible = id === 'crown'; };
    king.setCape = function (on) { cape.visible = !!on; };
    return out;
  };

  // ------------------------------------------------------------------ the creek world as chunky low-poly solids

  // hide the tall scenery standing between the camera and the king (camera can orbit anywhere)
  function clearView(list, cam, target, rad) {
    var cx = cam.position.x, cz = cam.position.z, tx = target.x, tz = target.z, dx = tx - cx, dz = tz - cz, L2 = dx * dx + dz * dz;
    var ortho = !!cam.isOrthographicCamera, dir = ortho ? new THREE.Vector3() : null;
    if (ortho) { cam.getWorldDirection(dir); }
    list.forEach(function (m) {
      var px = m.position.x, pz = m.position.z, hide;
      if (ortho) {   // orthographic: anything in front of the king along the view direction, near the view line
        var rx = px - tx, rz = pz - tz, along = -(rx * dir.x + rz * dir.z) / Math.max(1e-6, Math.hypot(dir.x, dir.z)), ox = rx + dir.x / Math.hypot(dir.x, dir.z) * along, oz = rz + dir.z / Math.hypot(dir.x, dir.z) * along;
        hide = along > 0.3 && Math.hypot(ox, oz) < rad * 1.3;
      } else {
        var t = Math.max(0, Math.min(1, ((px - cx) * dx + (pz - cz) * dz) / L2)), qx = cx + dx * t - px, qz = cz + dz * t - pz;
        hide = t < 0.92 && Math.hypot(qx, qz) < rad;
      }
      m.visible = !hide;
    });
  }
  function rnd(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  T.world = function (o) {
    o = o || {};
    var grp = new THREE.Group(), R = rnd(23), LEN = o.len || 16, movers = []; grp.name = 'PixelCreek';
    var WT = { '#6e9c5b': ['#557f48', '#6e9c5b', '#8fb86f'], '#b59a6d': ['#8f7650', '#b59a6d', '#cfb889'], '#5d93ad': ['#3f6f8a', '#5d93ad', '#86b6c6'], '#9ccbd8': ['#86b6c6', '#9ccbd8', '#d4e9ec'],
      '#8d8f8a': ['#5f625f', '#8d8f8a', '#b2b3ab'], '#8f7650': ['#6b4a33', '#8f7650', '#b59a6d'], '#557f48': ['#47703f', '#557f48', '#6e9c5b'], '#8fb86f': ['#6e9c5b', '#8fb86f', '#a8c8ad'],
      '#6b4a33': ['#4a3828', '#6b4a33', '#8f7650'], '#4f7f4a': ['#2f5233', '#4f7f4a', '#5f9255'], '#3f6b3f': ['#2f5233', '#3f6b3f', '#4f7f4a'], '#5f9255': ['#3f6b3f', '#5f9255', '#8fb86f'], '#8fb59a': ['#6f9579', '#8fb59a', '#a8c8ad'] };
    function W(hex, flat) { var t = WT[hex] || [hex, hex, hex]; return rampMat(t[0], t[1], t[2], { flat: flat }); }
    function add(m, mv) { m.castShadow = true; m.receiveShadow = true; grp.add(m); if (mv) movers.push(m); return m; }
    var grass = new THREE.Mesh(new THREE.PlaneGeometry(LEN, LEN), W('#6e9c5b')); grass.rotation.x = -Math.PI / 2; grass.receiveShadow = true; grp.add(grass);
    var path = new THREE.Mesh(new THREE.PlaneGeometry(1.3, LEN), W('#b59a6d')); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.004, 0); path.receiveShadow = true; grp.add(path);
    var water = new THREE.Mesh(new THREE.PlaneGeometry(1.2, LEN), W('#5d93ad')); water.rotation.x = -Math.PI / 2; water.position.set(-1.35, 0.006, 0); water.receiveShadow = true; grp.add(water);
    // ripples, stones, path pebbles, grass blades, trees: they scroll
    var rip = W('#9ccbd8');
    for (var i = 0; i < 30; i++) { var r = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.004, 0.18 + R() * 0.25), rip); r.position.set(-1.35 + (R() - 0.5) * 1.0, 0.012, -LEN / 2 + R() * LEN); grp.add(r); movers.push(r); }
    var stone = W('#8d8f8a', true);
    for (var s = 0; s < 22; s++) { var st = new THREE.Mesh(new THREE.DodecahedronGeometry(0.07 + R() * 0.08, 0), stone); st.scale.y = 0.5; st.position.set(-1.35 + (R() - 0.5) * 1.1 + (R() < 0.3 ? 0.75 : 0), 0.02, -LEN / 2 + R() * LEN); add(st, true); }
    var peb = W('#8f7650');
    for (var p = 0; p < 40; p++) { var pb = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.012, 0.03), peb); pb.position.set((R() - 0.5) * 1.1, 0.01, -LEN / 2 + R() * LEN); grp.add(pb); movers.push(pb); }
    var blade = [W('#557f48'), W('#8fb86f')];
    for (var b = 0; b < 90; b++) { var bl = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07 + R() * 0.07, 0.02), blade[b % 2]); var bx = R() < 0.5 ? -0.7 - R() * 0.1 : 0.7 + R() * 0.8; bl.position.set(bx, 0.05, -LEN / 2 + R() * LEN); grp.add(bl); movers.push(bl); }
    var trunk = W('#6b4a33', true), leaf = [W('#4f7f4a', true), W('#3f6b3f', true), W('#5f9255', true)];
    for (var t = 0; t < 26; t++) {
      var tg = new THREE.Group(), h = 0.5 + R() * 0.5, rr = 0.32 + R() * 0.22;
      var tk = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 0.12), trunk); tk.position.y = h / 2; tk.castShadow = true; tg.add(tk);
      var cn = new THREE.Mesh(new THREE.IcosahedronGeometry(rr, 0), leaf[t % 3]); cn.position.y = h + rr * 0.7; cn.rotation.set(R(), R(), R()); cn.castShadow = true; tg.add(cn);
      if (R() < 0.6) { var c2 = new THREE.Mesh(new THREE.IcosahedronGeometry(rr * 0.65, 0), leaf[(t + 1) % 3]); c2.position.set(rr * 0.5, h + rr * 1.2, 0); c2.castShadow = true; tg.add(c2); }
      var side = R() < 0.55 ? -1 : 1; tg.position.set(side < 0 ? -2.3 - R() * 2.5 : 1.3 + R() * 2.5, 0, -LEN / 2 + R() * LEN); grp.add(tg); movers.push(tg);
    }
    var tall = movers.filter(function (m) { return m.isGroup; });
    return {
      group: grp,
      scroll: function (dz) { movers.forEach(function (m) { m.position.z -= dz; if (m.position.z < -LEN / 2) m.position.z += LEN; }); },
      clear: function (cam, target) { clearView(tall, cam, target, 1.0); }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);

;