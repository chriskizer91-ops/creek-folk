/* PKPixel3D: renders a whole 3D scene as pixel art. The scene goes into a small render target (one texel = one art pixel),
   then a full-screen pass draws it back at k x k screen pixels per art pixel, snapping every colour to a fixed palette and
   inking a one-pixel outline wherever a nearer surface meets a farther one (depth from an orthographic camera).
   The polished version adds, all in the same pass and all in palette steps:
     coloured outlines   a darker shade of the shape itself (the king keeps the dark ink, so he always reads first)
     contact shading     ambient occlusion from the depth, in two dithered steps, so things sit on the ground
     light and shade     graded separately through the day (cool shade and warm light at the ends of the day)
     haze                the far side of the view fades a step or two towards the sky
     sky                 where nothing is drawn: bands, clouds, the sun or the moon, and stars
     spill               a soft glow round things that shine at night (fireflies, the lantern, windows)
     pool                Easy to see: the ground round the king a few steps darker, the king a little brighter
   Alpha in the scene target marks how a pixel is treated: 1 normal, 0.875 the king, 0.5 soft (no ink), 0.25 shines. */
// R186: ported to three.js r186 for Creekfolk 2 (see creekfolk2/docs/R186-PORT.md); every change is marked R186. In short: the
// palette is a texture (any size), the scene target is an sRGB texture, and PX.keepAlpha(material) keeps a tag on a non-toon material.
(function (global) {
  'use strict';
  var THREE = global.THREE;
  var PX = {};
  global.PKPixel3D = PX;
  function hexRGB(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  var VERT = 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }';
  var FRAG = [
    'precision highp float;',
    // R186: the palette was 'uniform vec3 pal[NP]': WTWB's 371 colours are more than the 224 fragment uniform vectors WebGL 2 promises
    // (some phones hold to that), and Creekfolk 2 will add more. It is now a texture, PW colours to a row, read by palAt(i)
    'uniform sampler2D tColor; uniform sampler2D tDepth; uniform vec2 low; uniform float k; uniform sampler2D tPal; uniform float edge; uniform float crease; uniform vec2 offs;',
    'vec3 palAt(int i){ return texelFetch(tPal, ivec2(i % PW, i / PW), 0).rgb; }',
    // R186: the scene target is now an sRGB texture (see setSize), which the GPU turns back into linear light when it is read; this
    // turns it into the sRGB numbers again, the numbers r128's shaders wrote, so everything below compares the same values as before
    'vec3 toSRGB(vec3 c){ return mix(c * 12.92, pow(c, vec3(1.0 / 2.4)) * 1.055 - vec3(0.055), step(vec3(0.0031308), c)); }',
    // grade: the time of day and the weather tint every snapped colour, shade (gradeD) and light (gradeL) apart;
    // glow: a pool of light round one point (his lantern at night), in steps, like pixel art light
    'uniform vec3 gradeD; uniform vec3 gradeL; uniform vec3 lift; uniform vec4 glow; uniform vec3 glowTint;',
    // thick: also ink the cell just outside each rim, so outlines are two art pixels wide (the easy-to-see view)
    'uniform float thick;',
    'uniform vec2 zrange; uniform float ppm; uniform vec2 ao; uniform vec4 haze; uniform vec3 hazeZ;',
    'uniform vec3 skyTop; uniform vec3 skyHor; uniform vec4 skyI; uniform vec4 sunP; uniform vec3 sunC;',
    'uniform float selOut; uniform float dcell; uniform float spill; uniform vec4 pool; uniform float sat;',
    'float b2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }',
    'float bayer(vec2 c){ vec2 a = floor(c / dcell); return b2(0.5 * a) * 0.25 + b2(a); }',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }',
    'float lin(float d){ return zrange.x + d * (zrange.y - zrange.x); }',
    'bool isGlow(float a){ return a > 0.2 && a < 0.3; }',
    'bool isHero(float a){ return a > 0.82 && a < 0.93; }',
    'bool isSoft(float a){ return a > 0.4 && a < 0.56; }',
    'bool isEarth(float a){ return a > 0.56 && a < 0.66; }',
    'float lapAt(vec2 uv, vec2 t){ float z = texture2D(tDepth, uv).r; return max(texture2D(tDepth, uv - vec2(t.x, 0.0)).r + texture2D(tDepth, uv + vec2(t.x, 0.0)).r - 2.0 * z, texture2D(tDepth, uv - vec2(0.0, t.y)).r + texture2D(tDepth, uv + vec2(0.0, t.y)).r - 2.0 * z); }',
    'bool rimAt(vec2 uv, vec2 t, float z0){ if (texture2D(tDepth, uv).r >= z0 || lapAt(uv, t) <= edge) return false;\n  #ifdef SOFT_INK\n  float a = texture2D(tColor, uv).a; if (isSoft(a) || isGlow(a)) return false;\n  #endif\n  return true; }',
    'float rimKind(vec2 uv2, vec2 t, float z0){ if (!rimAt(uv2, t, z0)) return 0.0; return isHero(texture2D(tColor, uv2).a) ? 2.0 : 1.0; }',
    'vec3 tint(vec3 c){ float L = dot(c, vec3(0.299, 0.587, 0.114)); c = max(vec3(0.0), mix(vec3(L), c, sat)); return c * mix(gradeD, gradeL, smoothstep(0.18, 0.72, L)) + lift; }',
    'vec3 graded(vec3 c, vec2 cell, float a){ if (isGlow(a)) return c; float g = 0.0; if (glow.z > 0.0) { float d = length((cell - glow.xy) / glow.z); g = clamp(1.0 - d, 0.0, 1.0); g = g * g * (3.0 - 2.0 * g); g = floor(g * 5.0 + 0.5) / 5.0 * glow.w; } return mix(tint(c), c * glowTint, g); }',
    'vec3 ycc(vec3 c){ return vec3(dot(c, vec3(0.25, 0.5, 0.25)), dot(c, vec3(0.5, 0.0, -0.5)), dot(c, vec3(-0.25, 0.5, -0.25))); }',
    // CF2: with LUT, the search is looked up instead: a table of the nearest colour for every 64 x 64 x 64 step of red, green
    // and blue, worked out once on the GPU by the same search (makeLut below). One read instead of one per colour (hundreds)
    '#ifdef LUT\nuniform sampler2D tLut;\nvec3 nearest(vec3 c){ ivec3 q = clamp(ivec3(floor(c * 64.0)), ivec3(0), ivec3(63)); return texelFetch(tLut, ivec2(q.r + (q.b % 8) * 64, q.g + (q.b / 8) * 64), 0).rgb; }\n#else',
    'vec3 nearest(vec3 c){ vec3 q = ycc(c); float bd = 1e9; vec3 best = c; for (int i = 1; i < NP; i++){ vec3 p = palAt(i); vec3 d = ycc(p) - q; d *= vec3(1.0, 1.7, 1.7); float e = dot(d, d); if (e < bd){ bd = e; best = p; } } return best; }',   // R186: pal[i] -> palAt(i)
    '#endif',
    // Easy to see: the ground round the king a few dithered steps darker, the king a shade brighter
    'vec3 pooled(vec3 o, vec2 cell, bool hero){ if (pool.w <= 0.0) return o; if (hero) return min(vec3(1.0), o * 1.1 + 0.04); float d = length(cell - pool.xy) / pool.z; float a = 1.0 - smoothstep(0.6, 1.0, d); a = floor(a * 3.0 + bayer(cell) * 0.999) / 3.0; return mix(o, o * 0.38, a * pool.w); }',
    // the sky: bands from the horizon up, the sun or moon with rings of light, two-tone clouds, stars
    'vec3 skyCol(vec2 cell){',
    '  float d = bayer(cell), v = clamp(cell.y / low.y, 0.0, 1.0);',
    '  vec3 c = mix(skyHor, skyTop, floor(pow(v, 0.75) * 6.0 + d) / 6.0);',
    '  if (sunP.w > 0.0) { float r = length(cell - sunP.xy) / sunP.z; if (r < 1.0) return sunP.w > 1.5 && r > 0.7 ? sunC * 0.86 : sunC; float ring = clamp(1.0 - (r - 1.0) / 4.0, 0.0, 1.0); c = mix(c, sunC, floor(ring * 3.0 + d) / 3.0 * 0.3); }',
    '  if (skyI.y > 0.0) { vec2 q = cell / max(ppm, 1.0) * vec2(0.2, 0.55) + vec2(skyI.z * 0.018, 0.0);',
    '    float n = vnoise(q) * 0.55 + vnoise(q * 2.1 + 5.2) * 0.3 + vnoise(q * 4.7 + 1.3) * 0.15, cv = n + skyI.y - 1.0 + (d - 0.5) * 0.05;',
    '    if (cv > 0.0) { float m = vnoise((q + vec2(0.0, 0.22)) ) * 0.55 + vnoise((q + vec2(0.0, 0.22)) * 2.1 + 5.2) * 0.3; vec3 lit = mix(skyHor, vec3(1.0, 0.98, 0.95) * (0.3 + 0.7 * skyI.w), 0.72 * (0.4 + 0.6 * skyI.w)), sh = mix(skyTop, skyHor, 0.55) * (0.6 + 0.32 * skyI.w) + 0.04 * skyI.w; c = (m + skyI.y - 1.0 > 0.03 && cv > 0.05) ? lit : sh; } }',
    '  if (skyI.x > 0.0) { vec2 sc = floor(cell / max(dcell, 1.0)); float h = hash(sc); if (h > 1.0 - 0.005 * skyI.x) { float tw = 0.55 + 0.45 * sin(skyI.z * (1.5 + h * 7.0) + h * 40.0); c = mix(c, vec3(1.0, 0.97, 0.88), tw * skyI.x); } }',
    '  return c; }',
    'void main(){',
    '  vec2 cell = floor((gl_FragCoord.xy - offs) / k);',
    '  vec2 uv = (cell + 0.5) / low, t = 1.0 / low;',
    '  float z = texture2D(tDepth, uv).r;',
    '  if (z >= 0.999999) { gl_FragColor = vec4(skyCol(cell) + lift, 1.0); return; }',
    '  float zl = texture2D(tDepth, uv - vec2(t.x, 0.0)).r, zr = texture2D(tDepth, uv + vec2(t.x, 0.0)).r, zd = texture2D(tDepth, uv - vec2(0.0, t.y)).r, zu = texture2D(tDepth, uv + vec2(0.0, t.y)).r;',
    '  float lap = max(zl + zr - 2.0 * z, zd + zu - 2.0 * z);',                       // > 0 on the rim of a nearer shape, ~0 on any flat surface
    '  vec4 src = texture2D(tColor, uv); src.rgb = toSRGB(src.rgb);',   // R186: back to the sRGB numbers (the alpha tag is stored as it is)
    '  bool hero = isHero(src.a), shine = isGlow(src.a);',
    '  bool inked = lap > edge;',
    '  #ifdef SOFT_INK\n  inked = inked && !isSoft(src.a) && !shine;\n  #endif',
    // the rim belongs to the nearer shape: draw it in a darker shade of that shape (the king, and anything very dark, in ink)
    // R186: pal[0] -> palAt(0) here and in the thick outline below
    '  if (inked) { vec3 ink = palAt(0); if (selOut > 0.5 && !hero) ink = nearest(nearest(src.rgb) * 0.48 + vec3(0.012, 0.014, 0.03)); gl_FragColor = vec4(pooled(graded(ink, cell, 1.0), cell, false), 1.0); return; }',
    // Easy to see: every rim two art pixels wide; round the king, outside his dark outline, a band of pale light two pixels wide
    '  if (thick > 0.5) {',
    '    float k1 = max(max(rimKind(uv - vec2(t.x, 0.0), t, z), rimKind(uv + vec2(t.x, 0.0), t, z)), max(rimKind(uv - vec2(0.0, t.y), t, z), rimKind(uv + vec2(0.0, t.y), t, z)));',
    '    if (k1 > 1.5) { gl_FragColor = vec4(1.0, 0.97, 0.86, 1.0); return; }',
    '    if (k1 > 0.5) { gl_FragColor = vec4(pooled(graded(palAt(0), cell, 1.0), cell, false), 1.0); return; }',
    '    float k2 = max(max(rimKind(uv - vec2(2.0 * t.x, 0.0), t, z), rimKind(uv + vec2(2.0 * t.x, 0.0), t, z)), max(rimKind(uv - vec2(0.0, 2.0 * t.y), t, z), rimKind(uv + vec2(0.0, 2.0 * t.y), t, z)));',
    '    if (k2 > 1.5) { gl_FragColor = vec4(1.0, 0.97, 0.86, 1.0); return; }',
    '  }',
    '  vec3 c = nearest(src.rgb);',
    // contact shading: how much stands out of the surface round this pixel, towards the camera, within ao.y metres
    // (the surface's own slope is taken out first, so open ground stays clear)
    '  bool earth = isEarth(src.a);',
    '  if (ao.x > 0.0 && !shine && !hero && !earth) {',
    '    float z0 = lin(z), gx = lin(zr) - z0, gx2 = z0 - lin(zl), gy = lin(zu) - z0, gy2 = z0 - lin(zd);',
    '    if (abs(gx2) < abs(gx)) gx = gx2; if (abs(gy2) < abs(gy)) gy = gy2;',
    '    float R = ao.y, rp = R * ppm, occ = 0.0, rot = bayer(cell) * 6.2832;',
    '    for (int i = 0; i < 8; i++) { float fi = float(i), a = fi * 2.39996 + rot; vec2 o = vec2(cos(a), sin(a)) * rp * (0.3 + 0.7 * (fi + 0.5) / 8.0);',
    '      float dz = z0 + gx * o.x + gy * o.y - lin(texture2D(tDepth, uv + o * t).r); occ += clamp(dz / R, 0.0, 1.0) * (1.0 - smoothstep(R * 0.9, R * 2.2, dz)); }',
    '    float st = floor(occ / 8.0 * ao.x * 2.3 + bayer(cell + 2.0) * 0.999);',
    '    if (st >= 1.0) c = nearest(c * (st >= 2.0 ? 0.6 : 0.78) + vec3(0.0, 0.006, 0.02));',
    '  }',
    '  vec3 o = graded(c, cell, src.a);',
    // a soft spill of light round things that shine (only at night)
    '  if (spill > 0.0 && !shine) { float sr = max(2.0, 0.3 * ppm), best = 0.0;',
    '    for (int i = 0; i < 8; i++) { float a = float(i) * 0.7854 + bayer(cell) * 0.7854; vec2 o2 = vec2(cos(a), sin(a)) * sr; if (isGlow(texture2D(tColor, uv + o2 * t).a)) best = max(best, 0.45); if (isGlow(texture2D(tColor, uv + o2 * t * 0.55).a)) best = max(best, 0.75); if (isGlow(texture2D(tColor, uv + o2 * t * 0.22).a)) best = 1.0; }',
    '    if (best > 0.0) o = mix(o, o * 1.45 + vec3(0.09, 0.075, 0.03), floor(best * spill * 2.0 + bayer(cell) * 0.999) / 2.0 * 0.6); }',
    // haze: the far side of the view steps towards the sky colour
    '  if (haze.w > 0.0 && !earth) { float zz = lin(z) - hazeZ.x - hazeZ.y; if (zz > 0.0) { float hz = clamp(zz / hazeZ.z, 0.0, 1.0) * haze.w; o = mix(o, haze.rgb, floor(hz * 4.0 + bayer(cell) * 0.999) / 4.0); } }',
    '  gl_FragColor = vec4(shine ? o : pooled(o, cell, hero), 1.0);',
    '}'].join('\n');

  // R186: the palette as a texture: one texel per colour, PW to a row, holding the sRGB numbers as they are (no colour space, so
  // nothing converts them); index 0 is the outline ink. Any number of colours fits (PW x the GPU's texture height).
  var PW = 256;
  function palTex(list) {
    var n = list.length, w = Math.min(n, PW), h = Math.ceil(n / w), d = new Uint8Array(w * h * 4);
    list.forEach(function (hx, i) { var c = hexRGB(hx); d[i * 4] = Math.round(c[0] * 255); d[i * 4 + 1] = Math.round(c[1] * 255); d[i * 4 + 2] = Math.round(c[2] * 255); d[i * 4 + 3] = 255; });
    var t = new THREE.DataTexture(d, w, h, THREE.RGBAFormat, THREE.UnsignedByteType); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
    return t;
  }
  // CF2: the look-up table for o.lut: 512 x 512 texels, eight slices of blue a row, each 64 x 64 of red (across) and green (up),
  // holding the palette colour nearest the middle of that step, found with the pass's own search
  var LUT_FRAG = ['precision highp float;', 'uniform sampler2D tPal;', 'vec3 palAt(int i){ return texelFetch(tPal, ivec2(i % PW, i / PW), 0).rgb; }',
    'vec3 ycc(vec3 c){ return vec3(dot(c, vec3(0.25, 0.5, 0.25)), dot(c, vec3(0.5, 0.0, -0.5)), dot(c, vec3(-0.25, 0.5, -0.25))); }',
    'vec3 nearest(vec3 c){ vec3 q = ycc(c); float bd = 1e9; vec3 best = c; for (int i = 1; i < NP; i++){ vec3 p = palAt(i); vec3 d = ycc(p) - q; d *= vec3(1.0, 1.7, 1.7); float e = dot(d, d); if (e < bd){ bd = e; best = p; } } return best; }',
    'void main(){ ivec2 p = ivec2(gl_FragCoord.xy); vec3 c = (vec3(float(p.x % 64), float(p.y % 64), float(p.x / 64 + (p.y / 64) * 8)) + 0.5) / 64.0; gl_FragColor = vec4(nearest(c), 1.0); }'].join('\n');
  function makeLut(renderer, palT, n, into) {
    var rt = into || new THREE.WebGLRenderTarget(512, 512, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, depthBuffer: false, generateMipmaps: false });
    var m = new THREE.ShaderMaterial({ uniforms: { tPal: { value: palT } }, vertexShader: VERT, fragmentShader: LUT_FRAG, defines: { NP: n, PW: palT.image.width }, depthTest: false, depthWrite: false });
    var sc = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m);
    sc.add(q);
    var old = renderer.getRenderTarget();
    renderer.setRenderTarget(rt); renderer.render(sc, cam); renderer.setRenderTarget(old);
    m.dispose(); q.geometry.dispose();
    return rt;
  }
  PX.create = function (renderer, o) {
    o = o || {};
    var pal = palTex(o.palette);   // R186: was an array of Vector3 for 'uniform vec3 pal[NP]'
    var lut = o.lut ? makeLut(renderer, pal, o.palette.length) : null;   // CF2
    function v3(x, y, z) { return { value: new THREE.Vector3(x, y, z) }; }
    var mat = new THREE.ShaderMaterial({
      uniforms: {
        tColor: { value: null }, tDepth: { value: null }, low: { value: new THREE.Vector2() }, k: { value: 4 }, tPal: { value: pal }, edge: { value: 0.01 }, crease: { value: 0.004 }, offs: { value: new THREE.Vector2() },
        gradeD: v3(1, 1, 1), gradeL: v3(1, 1, 1), lift: v3(0, 0, 0), glow: { value: new THREE.Vector4(0, 0, 0, 0) }, glowTint: v3(1, 1, 1), thick: { value: 0 },
        zrange: { value: new THREE.Vector2(0, 1) }, ppm: { value: 100 }, ao: { value: new THREE.Vector2(0, 0.3) }, haze: { value: new THREE.Vector4(0, 0, 0, 0) }, hazeZ: v3(40, 6, 30),
        skyTop: v3(0.55, 0.75, 0.86), skyHor: v3(0.75, 0.86, 0.9), skyI: { value: new THREE.Vector4(0, 0, 0, 1) }, sunP: { value: new THREE.Vector4(0, 0, 0, 0) }, sunC: v3(1, 0.96, 0.82),
        selOut: { value: 0 }, dcell: { value: 1 }, spill: { value: 0 }, pool: { value: new THREE.Vector4(0, 0, 1, 0) }, sat: { value: 1 },
        tLut: { value: lut ? lut.texture : null }   // CF2
      },
      // R186: NP is still the number of colours; PW is the palette texture's width
      vertexShader: VERT, fragmentShader: FRAG, defines: o.softInk ? { NP: o.palette.length, PW: pal.image.width, SOFT_INK: 1 } : { NP: o.palette.length, PW: pal.image.width }, depthTest: false, depthWrite: false
    });
    if (lut) mat.defines.LUT = 1;   // CF2
    var U = mat.uniforms;
    var post = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    post.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    var rt = null, px = { k: 4, w: 0, h: 0, uniforms: U };
    // canvas size in device pixels, k device pixels per art pixel
    px.setSize = function (cw, ch, k, cam) {
      px.k = k; var w = Math.ceil(cw / k), h = Math.ceil(ch / k); px.w = w; px.h = h;
      if (rt) rt.dispose();
      rt = new THREE.WebGLRenderTarget(w, h, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat });
      // R186: r128 wrote this target in sRGB by encoding in every material's shader (.encoding = sRGBEncoding). r186 shaders always
      // write linear light into a render target, so the target is made an sRGB texture instead: the GPU encodes on writing (the same
      // numbers r128 stored, for every material) and decodes on reading, and the pass turns what it reads back into sRGB (toSRGB)
      rt.texture.colorSpace = THREE.SRGBColorSpace;
      rt.depthTexture = new THREE.DepthTexture(w, h); rt.depthTexture.type = THREE.UnsignedIntType;
      U.tColor.value = rt.texture; U.tDepth.value = rt.depthTexture; U.low.value.set(w, h); U.k.value = k;
      // centre the pixel grid on the canvas
      U.offs.value.set(Math.floor((cw - w * k) / 2), Math.floor((ch - h * k) / 2));
      if (cam) { var a = w / h, hh = (cam.top - cam.bottom) / 2; cam.left = -hh * a; cam.right = hh * a; cam.updateProjectionMatrix(); U.edge.value = 0.12 / (cam.far - cam.near); U.crease.value = 0.035 / (cam.far - cam.near); }
    };
    // o.snapLow: snap colours and ink outlines once per art pixel into a second small target, then only blow that up on screen
    // (the same picture, with the palette search done k*k times less often: much lighter on phones)
    var low = null, blit = null, blitScene = null;
    if (o.snapLow) {
      U.k.value = 1; U.offs.value.set(0, 0);
      blit = new THREE.ShaderMaterial({
        uniforms: { tSnap: { value: null }, low: { value: new THREE.Vector2() }, k: { value: 4 }, offs: { value: new THREE.Vector2() } },
        vertexShader: VERT, fragmentShader: 'precision highp float; uniform sampler2D tSnap; uniform vec2 low; uniform float k; uniform vec2 offs; void main(){ vec2 cell = floor((gl_FragCoord.xy - offs) / k); gl_FragColor = texture2D(tSnap, (cell + 0.5) / low); }',
        depthTest: false, depthWrite: false
      });
      blitScene = new THREE.Scene(); blitScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blit));
      var setSize0 = px.setSize;
      px.setSize = function (cw, ch, k, cam) {
        setSize0(cw, ch, k, cam);
        if (low) low.dispose();
        low = new THREE.WebGLRenderTarget(px.w, px.h, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, depthBuffer: false });
        U.k.value = 1; U.offs.value.set(0, 0);
        blit.uniforms.tSnap.value = low.texture; blit.uniforms.low.value.set(px.w, px.h); blit.uniforms.k.value = k;
        blit.uniforms.offs.value.set(Math.floor((cw - px.w * k) / 2), Math.floor((ch - px.h * k) / 2));
      };
    }
    // tint (time of day, weather): one tint for everything, or (setGrade2) shade and light apart; lift is added after
    px.setGrade = function (r, g, b, lr, lg, lb) { U.gradeD.value.set(r, g, b); U.gradeL.value.set(r, g, b); U.lift.value.set(lr || 0, lg || 0, lb || 0); };
    px.setGrade2 = function (d, l, lift) { U.gradeD.value.set(d[0], d[1], d[2]); U.gradeL.value.set(l[0], l[1], l[2]); if (lift) U.lift.value.set(lift[0], lift[1], lift[2]); };
    px.setThick = function (on) { U.thick.value = on ? 1 : 0; };
    // R186: (new, for Creekfolk 2) change the palette: any length, ink first; a new length rebuilds the pass's shader once
    px.setPalette = function (list) {
      var t = palTex(list), old = U.tPal.value; U.tPal.value = t; if (old) old.dispose();
      if (lut) makeLut(renderer, t, list.length, lut);   // CF2
      if (mat.defines.NP !== list.length || mat.defines.PW !== t.image.width) { mat.defines.NP = list.length; mat.defines.PW = t.image.width; mat.needsUpdate = true; }
    };
    // a pool of light round a point given in art pixels (x, y from the bottom left), radius r, strength a
    px.setGlow = function (x, y, r, a, tr, tg, tb) { U.glow.value.set(x, y, r, a); U.glowTint.value.set(tr == null ? 1 : tr, tg == null ? 1 : tg, tb == null ? 1 : tb); };
    // the rest of the look: { ao: [strength, radius m], selOut, spill, dcell, haze: [r,g,b,a], hazeZ: [focus depth, start, range] (m),
    //   skyTop, skyHor: [r,g,b], skyI: [stars, clouds, time, daylight], sun: [x, y, r (art px), 1 sun | 2 moon | 0], sunC, pool: [x, y, r, amount] }
    px.setFX = function (f) {
      if (f.ao) U.ao.value.set(f.ao[0], f.ao[1]);
      if (f.selOut != null) U.selOut.value = f.selOut;
      if (f.spill != null) U.spill.value = f.spill;
      if (f.dcell != null) U.dcell.value = f.dcell;
      if (f.haze) U.haze.value.set(f.haze[0], f.haze[1], f.haze[2], f.haze[3]);
      if (f.hazeZ) U.hazeZ.value.set(f.hazeZ[0], f.hazeZ[1], f.hazeZ[2]);
      if (f.skyTop) U.skyTop.value.set(f.skyTop[0], f.skyTop[1], f.skyTop[2]);
      if (f.skyHor) U.skyHor.value.set(f.skyHor[0], f.skyHor[1], f.skyHor[2]);
      if (f.skyI) U.skyI.value.set(f.skyI[0], f.skyI[1], f.skyI[2], f.skyI[3]);
      if (f.sun) U.sunP.value.set(f.sun[0], f.sun[1], f.sun[2], f.sun[3]);
      if (f.sunC) U.sunC.value.set(f.sunC[0], f.sunC[1], f.sunC[2]);
      if (f.pool) U.pool.value.set(f.pool[0], f.pool[1], f.pool[2], f.pool[3]);
      if (f.sat != null) U.sat.value = f.sat;
    };
    px.render = function (scene, cam) {
      var oldT = renderer.getRenderTarget();
      if (cam && cam.isOrthographicCamera) { U.zrange.value.set(cam.near, cam.far); U.ppm.value = px.h / Math.max(1e-3, cam.top - cam.bottom); }
      renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene, cam);
      if (low) { renderer.setRenderTarget(low); renderer.render(post, postCam); renderer.setRenderTarget(oldT); renderer.render(blitScene, postCam); }
      else { renderer.setRenderTarget(oldT); renderer.render(post, postCam); }
    };
    return px;
  };
  // R186: r186 sets the alpha of every non-transparent built-in material to 1 (in its opaque_fragment chunk), where r128 wrote the
  // material's opacity, so a tag given as opacity (0.5 soft, 0.25 shines, ...) was lost. PKToon.rampMat keeps it itself; any other
  // material that carries a tag (a MeshBasicMaterial glow, say) goes through this: the chunk's last line is kept without the 1.
  PX.keepAlpha = function (m) {
    var base = m.onBeforeCompile, key0 = m.customProgramCacheKey();
    m.onBeforeCompile = function (sh, r) { base.call(this, sh, r); sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', 'gl_FragColor = vec4( outgoingLight, diffuseColor.a );'); };
    m.customProgramCacheKey = function () { return key0 + '|pk-alpha'; };
    return m;
  };
})(typeof window !== 'undefined' ? window : globalThis);

;
