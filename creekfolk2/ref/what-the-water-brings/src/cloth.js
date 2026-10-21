/* Procedural cloth, leather and skin textures for the Philosopher King.
   Each maker returns { map, normal, tile } : CanvasTextures (map = sRGB colour, normal = linear tangent-space)
   plus the physical size of one repeat in metres.  Everything tiles seamlessly. */
(function (global) {
  'use strict';
  var THREE = global.THREE, C = global.PKCore;
  var Fab = {};
  global.PKFabric = Fab;
  var N = 512;
  var PI = Math.PI;

  function rgb(hex) { return C.hex2rgb(hex); }
  function sat(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function sstep(a, b, x) { var t = sat((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function hash2(ix, iy, s) {
    var h = Math.imul(ix | 0, 374761393) ^ Math.imul(iy | 0, 668265263) ^ Math.imul(s | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296;
  }
  // generic painter: fn(x, y, out) fills out = [r, g, b, height]  (rgb 0-255, height 0-1)
  function paint(w, h, fn) {
    var cv = C.canvas(w, h), ctx = cv.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
    var hv = C.canvas(w, h), hctx = hv.getContext('2d'), himg = hctx.createImageData(w, h), hd = himg.data;
    var o = [0, 0, 0, 0], x, y, k, hh;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      fn(x, y, o); k = (y * w + x) * 4;
      d[k] = o[0] < 0 ? 0 : (o[0] > 255 ? 255 : o[0]); d[k + 1] = o[1] < 0 ? 0 : (o[1] > 255 ? 255 : o[1]); d[k + 2] = o[2] < 0 ? 0 : (o[2] > 255 ? 255 : o[2]); d[k + 3] = 255;
      hh = o[3] * 255; hh = hh < 0 ? 0 : (hh > 255 ? 255 : hh); hd[k] = hd[k + 1] = hd[k + 2] = hh; hd[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0); hctx.putImageData(himg, 0, 0);
    return { color: cv, height: hv };
  }
  function finish(p, strength, tile, rough) {
    var nm = C.normalFromHeight(p.height, strength);
    return {
      map: C.tex(p.color, { repeat: true }), normal: C.tex(nm, { repeat: true, linear: true, png: true }),
      tile: tile, canvases: p, rough: rough
    };
  }

  // ---------------------------------------------------------------- knit (stockinette V stitches)
  // o: color, nx, ny (stitches per tile), heather (0..1), swirl (0..1), seed, depth, ribCols (cardigan-style 2x2 ribbing), tone
  Fab.knit = function (o) {
    var base = rgb(o.color), nx = o.nx || 40, ny = o.ny || 44, cw = N / nx, ch = N / ny, seed = o.seed || 3;
    var heather = o.heather === undefined ? 0.5 : o.heather, swirl = o.swirl || 0, ribCols = !!o.ribCols, depth = o.depth || 1;
    var alt = o.alt ? rgb(o.alt) : [base[0] * 0.7, base[1] * 0.72, base[2] * 0.78];
    var p = paint(N, N, function (x, y, out) {
      var gx = x / cw, gy = y / ch, i = Math.floor(gx), j = Math.floor(gy), fx = gx - i, fy = gy - j;
      var colScale = 1;
      if (ribCols) { var rc = ((i % 4) + 4) % 4; colScale = rc < 2 ? 1 : 0.55; }
      var hmax = 0, k;
      // legs of this row and of the row above (they overlap), left leg slants right going down, right leg the opposite
      for (k = 0; k < 2; k++) {
        var yy = fy + k;            // row above: yy in [1,2)
        if (yy > 1.45) continue;
        var tleg = yy;              // 0 at the top of this stitch, 1 at the bottom
        var cl = 0.14 + 0.36 * tleg, cr = 0.86 - 0.36 * tleg;
        var wl = 0.16, a = (fx - cl) / wl, b = (fx - cr) / wl;
        var env = Math.sin(PI * sat((tleg + 0.18) / 1.36));
        var hl = Math.exp(-a * a) * env, hr = Math.exp(-b * b) * env;
        // yarn twist ridges along the leg
        var tw = 0.92 + 0.08 * Math.sin(2 * PI * (yy * 2.5 + (fx - cl) * 3.0));
        var tw2 = 0.92 + 0.08 * Math.sin(2 * PI * (yy * 2.5 - (fx - cr) * 3.0));
        hmax = Math.max(hmax, hl * tw, hr * tw2);
      }
      hmax *= colScale;
      var st = hash2(i, j, seed), st2 = hash2(i + 7, j + 3, seed + 5);
      var big = C.fbmP(x / N * 5, y / N * 5, 5, 5, seed + 11, 3);
      var fine = C.noiseP(x * 0.5, y * 0.5, N / 2, N / 2, seed + 21);
      var tone = 1 + heather * ((st - 0.5) * 0.30 + (big - 0.5) * 0.45 + (fine - 0.5) * 0.18);
      var mixA = sat(0.5 + (big - 0.5) * 2.4 * heather + (st2 - 0.5) * 0.7 * heather);
      var shade = 0.50 + 0.50 * hmax;
      var r = (base[0] + (alt[0] - base[0]) * mixA * 0.55) * tone * shade;
      var g = (base[1] + (alt[1] - base[1]) * mixA * 0.55) * tone * shade;
      var bl = (base[2] + (alt[2] - base[2]) * mixA * 0.55) * tone * shade;
      if (swirl) {
        var wu = x / N, wv = y / N;
        var w1 = C.fbmP(wu * 3, wv * 3, 3, 3, seed + 31, 3), w2 = C.fbmP(wu * 3 + 5, wv * 3 + 9, 3, 3, seed + 37, 3);
        var c2 = C.fbmP((wu + 0.45 * (w1 - 0.5)) * 6, (wv + 0.45 * (w2 - 0.5)) * 6, 6, 6, seed + 41, 3);
        var line = sstep(0.80, 0.97, Math.abs(Math.sin(c2 * PI * 4)));
        var sw = 1 + swirl * (line * 0.22 - 0.05);
        r *= sw; g *= sw; bl *= sw;
      }
      out[0] = r; out[1] = g; out[2] = bl; out[3] = (0.15 + 0.85 * hmax) * (0.92 + 0.08 * fine) * depth;
    });
    return finish(p, o.strength || 4.2, o.tile || 0.26, 0.95);
  };

  // ---------------------------------------------------------------- rib (vertical knit ribbing)
  Fab.rib = function (o) {
    var base = rgb(o.color), nr = o.nr || 32, pitch = N / nr, seed = o.seed || 4, heather = o.heather === undefined ? 0.35 : o.heather;
    var p = paint(N, N, function (x, y, out) {
      var u = (x / pitch) % 1, c = 0.5 + 0.5 * Math.cos(2 * PI * u);
      var ridge = sstep(0.0, 0.85, c);
      var gy = y / 7, j = Math.floor(gy), fy = gy - j;
      var lines = 0.9 + 0.1 * Math.sin(2 * PI * (fy + (x / pitch) * 0.5));  // twisted yarn hint
      var big = C.fbmP(x / N * 6, y / N * 6, 6, 6, seed + 3, 3);
      var tone = 1 + heather * ((big - 0.5) * 0.5 + (hash2(Math.floor(x / pitch), j, seed) - 0.5) * 0.25);
      var shade = (0.42 + 0.58 * ridge) * lines;
      out[0] = base[0] * tone * shade; out[1] = base[1] * tone * shade; out[2] = base[2] * tone * shade;
      out[3] = (0.1 + 0.9 * ridge) * (0.94 + 0.06 * lines);
    });
    return finish(p, o.strength || 5, o.tile || 0.12, 0.95);
  };

  // ---------------------------------------------------------------- tweed with a paisley swirl
  Fab.tweed = function (o) {
    var base = rgb(o.color), rust = rgb(o.rust || '#b46a2c'), dark = rgb(o.dark || '#2a1b12'), cream = rgb(o.cream || '#d8c3a0');
    var seed = o.seed || 5, swirlAmt = o.swirl === undefined ? 1 : o.swirl, twillP = 4, fq = o.freq || 1;
    var p = paint(N, N, function (x, y, out) {
      var u = x / N, v = y / N;
      var w1 = C.fbmP(u * 4, v * 4, 4, 4, seed + 1, 3), w2 = C.fbmP(u * 4 + 7, v * 4 + 3, 4, 4, seed + 2, 3);
      var uu = u + 0.20 * (w1 - 0.5), vv = v + 0.20 * (w2 - 0.5);
      var F1 = Math.round(10 * fq), F2 = Math.round(19 * fq);
      var c1 = C.fbmP(uu * F1, vv * F1, F1, F1, seed + 3, 3);
      var c2 = C.fbmP(uu * F2 + 3, vv * F2 + 1, F2, F2, seed + 4, 3);
      var band = Math.sin(c1 * PI * 7), band2 = Math.sin(c2 * PI * 5);
      var line = sstep(0.70, 0.96, Math.abs(band));                    // thin contour lines
      var line2 = sstep(0.80, 0.97, Math.abs(band2));
      var fill = 0.5 + 0.5 * band;                                      // smooth swell between the lines
      // weave
      var tw = 0.5 + 0.5 * Math.sin(2 * PI * (x + y) / twillP);
      var yarn = C.noiseP(x / N * 448, y / N * 256, 448, 256, seed + 8);
      var fleck = hash2(Math.floor(x / 2), Math.floor(y / 2), seed + 17);
      var r = base[0], g = base[1], b = base[2];
      var m = sat(fill * swirlAmt) * 0.62 * (o.fillK === undefined ? 1 : o.fillK);
      r += (rust[0] - base[0]) * m; g += (rust[1] - base[1]) * m; b += (rust[2] - base[2]) * m;
      var dk = (line * 0.62 + line2 * 0.30) * swirlAmt * (o.lineK === undefined ? 1 : o.lineK);
      r += (dark[0] - r) * dk; g += (dark[1] - g) * dk; b += (dark[2] - b) * dk;
      var fl = fleck > 0.972 ? 1 : 0, fd = fleck < 0.025 ? 1 : 0;
      r += (cream[0] - r) * fl * 0.40; g += (cream[1] - g) * fl * 0.40; b += (cream[2] - b) * fl * 0.40;
      r *= (1 - fd * 0.5); g *= (1 - fd * 0.5); b *= (1 - fd * 0.5);
      var sh = 0.80 + 0.20 * tw + (yarn - 0.5) * 0.30;
      out[0] = r * sh; out[1] = g * sh; out[2] = b * sh;
      out[3] = 0.35 + 0.35 * tw + 0.2 * yarn + 0.16 * line * swirlAmt + 0.08 * fill;
    });
    return finish(p, o.strength || 3.2, o.tile || 0.34, 0.92);
  };

  // ---------------------------------------------------------------- plain wool / flannel / cotton (twill or plain weave)
  Fab.wool = function (o) {
    var base = rgb(o.color), alt = rgb(o.alt || o.color), seed = o.seed || 6, twill = o.twill === undefined ? 1 : o.twill, mott = o.mottle === undefined ? 0.4 : o.mottle;
    var sc = o.pitch || 4;
    var p = paint(N, N, function (x, y, out) {
      var tw = 0.5 + 0.5 * Math.sin(2 * PI * (x + y) / sc);
      var pl = ((Math.floor(x / (sc / 2)) + Math.floor(y / (sc / 2))) & 1) * 1.0;
      var wv = twill ? tw : pl;
      var big = C.fbmP(x / N * 7, y / N * 7, 7, 7, seed + 1, 4), fine = C.noiseP(x / N * 384, y / N * 384, 384, 384, seed + 2);
      var m = sat(0.5 + (big - 0.5) * 2.2 * mott);
      var tone = 0.9 + 0.2 * fine + (big - 0.5) * 0.3 * mott;
      var sh = 0.84 + 0.16 * wv;
      out[0] = (base[0] + (alt[0] - base[0]) * m) * tone * sh; out[1] = (base[1] + (alt[1] - base[1]) * m) * tone * sh; out[2] = (base[2] + (alt[2] - base[2]) * m) * tone * sh;
      out[3] = 0.4 + 0.35 * wv + 0.25 * fine;
    });
    return finish(p, o.strength || 2.4, o.tile || 0.20, 0.92);
  };

  // ---------------------------------------------------------------- corduroy (wide wale)
  Fab.cord = function (o) {
    var base = rgb(o.color), seed = o.seed || 7, nw = o.nw || 56, pitch = N / nw, mott = o.mottle === undefined ? 0.5 : o.mottle;
    var p = paint(N, N, function (x, y, out) {
      var u = (x / pitch) % 1, c = Math.sin(PI * u), ridge = Math.pow(c, 0.55);
      var big = C.fbmP(x / N * 4, y / N * 6, 4, 6, seed + 1, 4), fine = C.noiseP(x / N * 384, y / N * 128, 384, 128, seed + 2);
      var wear = sat((big - 0.45) * 2.4);
      var tone = 0.78 + 0.5 * big * mott + 0.26 * fine;
      var sh = 0.45 + 0.55 * ridge;
      out[0] = base[0] * tone * sh * (1 + wear * 0.35); out[1] = base[1] * tone * sh * (1 + wear * 0.33); out[2] = base[2] * tone * sh * (1 + wear * 0.30);
      out[3] = ridge * (0.9 - 0.25 * wear) * (0.92 + 0.08 * fine);
    });
    return finish(p, o.strength || 5.5, o.tile || 0.10, 0.9);
  };

  // ---------------------------------------------------------------- denim (twill) with faded patches
  Fab.denim = function (o) {
    var base = rgb(o.color), light = rgb(o.light || '#a2a29f'), seed = o.seed || 8, pr = 4;
    var p = paint(N, N, function (x, y, out) {
      var tw = 0.5 + 0.5 * Math.sin(2 * PI * (x - y) / pr);
      var weft = 0.5 + 0.5 * Math.sin(2 * PI * y / 3);
      var big = C.fbmP(x / N * 3, y / N * 5, 3, 5, seed + 1, 4), mid = C.fbmP(x / N * 14, y / N * 20, 14, 20, seed + 3, 3), fine = C.noiseP(x / N * 448, y / N * 448, 448, 448, seed + 4);
      var fade = sat((big - 0.45) * 1.6) * 0.30 + (mid - 0.5) * 0.22;
      var warp = 1 - 0.35 * tw;
      var r = base[0] + (light[0] - base[0]) * sat(fade), g = base[1] + (light[1] - base[1]) * sat(fade), b = base[2] + (light[2] - base[2]) * sat(fade);
      var sh = (0.78 + 0.22 * tw) * (0.9 + 0.2 * fine) * (0.96 + 0.04 * weft);
      out[0] = r * sh; out[1] = g * sh; out[2] = b * sh; out[3] = 0.35 + 0.4 * tw + 0.15 * fine + 0.1 * weft;
    });
    return finish(p, o.strength || 3, o.tile || 0.16, 0.85);
  };

  // ---------------------------------------------------------------- leather (pebbled grain, mottled)
  Fab.leather = function (o) {
    var base = rgb(o.color || '#5a3720'), light = rgb(o.light || '#8a5a36'), seed = o.seed || 9, cells = o.cells || 70;
    var cs = N / cells;
    var p = paint(N, N, function (x, y, out) {
      // worley distance (tileable)
      var gx = x / cs, gy = y / cs, ix = Math.floor(gx), iy = Math.floor(gy), d1 = 9, d2 = 9, a, b;
      for (a = -1; a <= 1; a++) for (b = -1; b <= 1; b++) {
        var cx = ix + a, cy = iy + b, wx = ((cx % cells) + cells) % cells, wy = ((cy % cells) + cells) % cells;
        var px = cx + hash2(wx, wy, seed), py = cy + hash2(wx, wy, seed + 9), dx = px - gx, dy = py - gy, d = dx * dx + dy * dy;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      var edge = sat((Math.sqrt(d2) - Math.sqrt(d1)) * 2.2);
      var big = C.fbmP(x / N * 5, y / N * 5, 5, 5, seed + 1, 4), mid = C.fbmP(x / N * 18, y / N * 18, 18, 18, seed + 2, 3);
      var scuff = sat((big - 0.5) * 3) * 0.5 + sat((mid - 0.62) * 4) * 0.3;
      var tone = 0.85 + 0.3 * big;
      var r = (base[0] + (light[0] - base[0]) * scuff) * tone, g = (base[1] + (light[1] - base[1]) * scuff) * tone, b = (base[2] + (light[2] - base[2]) * scuff) * tone;
      var sh = 0.72 + 0.28 * edge;
      out[0] = r * sh; out[1] = g * sh; out[2] = b * sh; out[3] = 0.25 + 0.75 * edge * (0.8 + 0.2 * mid);
    });
    return finish(p, o.strength || 2.6, o.tile || 0.20, 0.5);
  };

  // ---------------------------------------------------------------- suede (elbow patches)
  Fab.suede = function (o) {
    var base = rgb(o.color || '#8a5a34'), seed = o.seed || 10;
    var p = paint(N / 2, N / 2, function (x, y, out) {
      var n1 = C.noiseP(x / (N / 2) * 192, y / (N / 2) * 192, 192, 192, seed), n2 = C.fbmP(x / (N / 2) * 6, y / (N / 2) * 6, 6, 6, seed + 1, 3);
      var t = 0.8 + 0.4 * n2 + (n1 - 0.5) * 0.25;
      out[0] = base[0] * t; out[1] = base[1] * t; out[2] = base[2] * t; out[3] = 0.4 + 0.6 * n1;
    });
    var nm = C.normalFromHeight(p.height, 1.6);
    return { map: C.tex(p.color, { repeat: true }), normal: C.tex(nm, { repeat: true, linear: true, png: true }), tile: 0.14, rough: 1, canvases: p };
  };


  // ---------------------------------------------------------------- micro gingham (plain weave cotton): white + one colour, half-tone where single
  // o: color (the check colour), ground, n (checks per tile), tile (metres), seed
  Fab.gingham = function (o) {
    var col = rgb(o.color || '#7c3a5a'), gr = rgb(o.ground || '#f2eef0'), n = o.n || 12, seed = o.seed || 31, cw = N / n;
    var mid = [(col[0] + gr[0]) / 2, (col[1] + gr[1]) / 2, (col[2] + gr[2]) / 2];
    var p = paint(N, N, function (x, y, out) {
      var fx = (x / cw) % 1, fy = (y / cw) % 1, bx = fx < 0.5 ? 1 : 0, by = fy < 0.5 ? 1 : 0;
      // soften the stripe edges a little (woven yarn)
      var ex = sstep(0.02, 0.08, Math.min(Math.abs(fx - 0.5), fx, 1 - fx)), ey = sstep(0.02, 0.08, Math.min(Math.abs(fy - 0.5), fy, 1 - fy));
      var vx = bx * ex + (1 - ex) * 0.5, vy = by * ey + (1 - ey) * 0.5, k = vx * vy, h1 = vx + vy - 2 * k;   // both = colour, one = half tone
      var r = gr[0] + (col[0] - gr[0]) * (k + h1 * 0.5), g = gr[1] + (col[1] - gr[1]) * (k + h1 * 0.5), b = gr[2] + (col[2] - gr[2]) * (k + h1 * 0.5);
      // plain weave texture
      var wv = ((x >> 1) + (y >> 1)) & 1, fine = C.noiseP(x / N * 256, y / N * 256, 256, 256, seed), big = C.fbmP(x / N * 4, y / N * 4, 4, 4, seed + 1, 3);
      var t = 0.93 + 0.05 * wv + 0.06 * (fine - 0.5) + 0.06 * (big - 0.5);
      out[0] = r * t; out[1] = g * t; out[2] = b * t; out[3] = 0.45 + 0.25 * wv + 0.3 * fine;
    });
    return finish(p, o.strength || 1.6, o.tile || 0.05, 0.78);
  };

  // ---------------------------------------------------------------- cotton twill (khaki shorts / chinos): mottled, faded
  Fab.twill = function (o) {
    var base = rgb(o.color || '#c9b48c'), light = rgb(o.light || '#ddcda9'), dark = rgb(o.dark || '#a8946c'), seed = o.seed || 41, pr = o.pitch || 4;
    var p = paint(N, N, function (x, y, out) {
      var tw = 0.5 + 0.5 * Math.sin(2 * PI * (x - y) / pr);
      var big = C.fbmP(x / N * 3, y / N * 4, 3, 4, seed + 1, 4), mid = C.fbmP(x / N * 12, y / N * 12, 12, 12, seed + 2, 3), fine = C.noiseP(x / N * 448, y / N * 448, 448, 448, seed + 3);
      var f = sat((big - 0.42) * 1.8), dk = sat((0.45 - mid) * 2.5) * 0.5;
      var r = base[0] + (light[0] - base[0]) * f - (base[0] - dark[0]) * dk, g = base[1] + (light[1] - base[1]) * f - (base[1] - dark[1]) * dk, b = base[2] + (light[2] - base[2]) * f - (base[2] - dark[2]) * dk;
      var sh = (0.90 + 0.10 * tw) * (0.94 + 0.12 * fine);
      out[0] = r * sh; out[1] = g * sh; out[2] = b * sh; out[3] = 0.4 + 0.35 * tw + 0.25 * fine;
    });
    return finish(p, o.strength || 2.2, o.tile || 0.12, 0.88);
  };

  // ---------------------------------------------------------------- sock / cuff rib: fine vertical ribs, very dark
  Fab.sockRib = function (o) {
    var base = rgb(o.color || '#1e1e22'), seed = o.seed || 51, nr = o.nr || 40, pitch = N / nr;
    var p = paint(N, N, function (x, y, out) {
      var u = (x / pitch) % 1, rib = Math.pow(Math.sin(PI * u), 0.7), st = 0.5 + 0.5 * Math.sin(2 * PI * y / (pitch * 0.8));
      var fine = C.noiseP(x / N * 384, y / N * 384, 384, 384, seed), big = C.fbmP(x / N * 4, y / N * 4, 4, 4, seed + 1, 3);
      var t = (0.62 + 0.38 * rib) * (0.92 + 0.08 * st) * (0.9 + 0.2 * fine) * (0.92 + 0.16 * big);
      out[0] = base[0] * t + 6 * fine; out[1] = base[1] * t + 6 * fine; out[2] = base[2] * t + 7 * fine; out[3] = 0.25 + 0.6 * rib + 0.1 * st;
    });
    return finish(p, o.strength || 3.0, o.tile || 0.06, 0.95);
  };


  // ---------------------------------------------------------------- herringbone tweed: zigzag twill columns, heathered, with coloured flecks
  Fab.herringbone = function (o) {
    var base = rgb(o.color || '#6b4a30'), lite = rgb(o.light || '#9a7350'), dark = rgb(o.dark || '#3a2717'), seed = o.seed || 61, B = o.band || 16, pr = o.pitch || 6;
    var fl = [rgb('#c9b28a'), rgb('#a8452c'), rgb('#3d5a6e'), rgb('#2a1c12')];
    var p = paint(N, N, function (x, y, out) {
      var col = Math.floor(x / B), d = (col & 1) ? 1 : -1, xx = x - col * B;
      var tw = 0.5 + 0.5 * Math.sin(2 * PI * (y + d * xx) / pr);
      var edge = sstep(0.0, 1.5, Math.min(xx, B - xx));
      var big = C.fbmP(x / N * 5, y / N * 5, 5, 5, seed + 1, 3), yarn = C.noiseP(x / N * 384, y / N * 384, 384, 384, seed + 2);
      var mix2 = sat(tw * 0.9 + (yarn - 0.5) * 0.6);
      var r = dark[0] + (lite[0] - dark[0]) * mix2, g = dark[1] + (lite[1] - dark[1]) * mix2, b = dark[2] + (lite[2] - dark[2]) * mix2;
      r = r * 0.55 + base[0] * 0.45; g = g * 0.55 + base[1] * 0.45; b = b * 0.55 + base[2] * 0.45;
      var t = 0.9 + 0.2 * big; r *= t; g *= t; b *= t;
      var f = hash2(Math.floor(x / 2), Math.floor(y / 3), seed + 9);
      if (f > 0.985) { var c = fl[Math.floor(hash2(Math.floor(x / 2), Math.floor(y / 3), seed + 11) * 4)]; r = r * 0.4 + c[0] * 0.6; g = g * 0.4 + c[1] * 0.6; b = b * 0.4 + c[2] * 0.6; }
      var sh = 0.82 + 0.18 * edge;
      out[0] = r * sh; out[1] = g * sh; out[2] = b * sh; out[3] = 0.35 + 0.45 * tw * edge + 0.2 * yarn;
    });
    return finish(p, o.strength || 3.0, o.tile || 0.09, 0.92);
  };

  // ---------------------------------------------------------------- cable knit: rope cables between purl columns
  Fab.cable = function (o) {
    var base = rgb(o.color || '#c4922e'), seed = o.seed || 71, nc = o.nc || 4, CW = N / nc, L = o.L || N / 3;
    var p = paint(N, N, function (x, y, out) {
      var c = Math.floor(x / CW), u = (x - c * CW) / CW, h = 0;
      // cable in the middle 55% of each column: two ropes crossing
      var cu = (u - 0.22) / 0.56, inC = cu > 0 && cu < 1;
      if (inC) {
        var ph = 2 * PI * y / L, c1 = 0.5 + 0.26 * Math.sin(ph), c2 = 0.5 - 0.26 * Math.sin(ph), w = 0.20;
        var front = Math.cos(ph) > 0 ? 1 : 0;
        var h1 = Math.exp(-Math.pow((cu - c1) / w, 2)), h2 = Math.exp(-Math.pow((cu - c2) / w, 2));
        h = Math.max(h1 * (front ? 1 : 0.75), h2 * (front ? 0.75 : 1));
        var st = 0.85 + 0.15 * Math.sin(2 * PI * y / (N / 64) + cu * 9);
        h *= st;
      } else {
        // purl background: small horizontal bumps
        var py = (y / (N / 80)) % 1, px = (x / (N / 60)) % 1;
        h = 0.25 * Math.pow(Math.sin(PI * py), 2) * (0.7 + 0.3 * Math.sin(PI * px));
        var gut = Math.min(Math.abs(cu), Math.abs(cu - 1)); h *= sstep(0.0, 0.15, gut);
      }
      var big = C.fbmP(x / N * 4, y / N * 4, 4, 4, seed, 3), fine = C.noiseP(x / N * 256, y / N * 256, 256, 256, seed + 1);
      var t = (0.55 + 0.5 * h) * (0.92 + 0.12 * big) * (0.94 + 0.08 * fine);
      out[0] = base[0] * t; out[1] = base[1] * t; out[2] = base[2] * t; out[3] = 0.15 + 0.8 * h;
    });
    return finish(p, o.strength || 6, o.tile || 0.16, 0.96);
  };

  // ---------------------------------------------------------------- aged skin for hands / forearms / neck
  // layout: x = around (0.25 = -X side, 0.5 = +Z front, 0.75 = +X side, 0/1 = back); y = v, top of the canvas = high v.
  // kind 'hand' : veins and tendons on the +X side (dorsal side of the left hand); palm creases on the -X side
  // kind 'neck' : horizontal creases, two diagonal tendons, throat
  Fab.skin = function (o) {
    o = o || {};
    var kind = o.kind || 'hand', seed = o.seed || 12, W = o.w || 512, H = o.h || 512;
    var base = rgb(o.color || '#d28d6d'), pale = rgb(o.pale || '#e0a98c'), vein = rgb(o.vein || '#7f8aa0'), spot = rgb(o.spot || '#a8613f'), red = rgb(o.red || '#c46f58');
    // vein polylines in (u, v) units: u 0..1 around, v 0..1 along (v = 1 top)
    var veins = o.veins || [];
    var p = paint(W, H, function (x, y, out) {
      var u = x / W, v = 1 - y / H;
      var big = C.fbmP(u * 4, v * 4, 4, 4, seed + 1, 4), mid = C.fbmP(u * 14, v * 14, 14, 14, seed + 2, 3);
      var fine = C.noiseP(x / W * 384, y / H * 384, 384, 384, seed + 3);
      var r = base[0], g = base[1], b = base[2];
      // pink mottling
      var m = sat((big - 0.5) * 2.2 + 0.5);
      r += (red[0] - base[0]) * m * 0.35; g += (red[1] - base[1]) * m * 0.35; b += (red[2] - base[2]) * m * 0.35;
      // age spots
      var sp = sat((C.fbmP(u * 22 + 3, v * 22, 22, 22, seed + 5, 2) - 0.66) * 7) * sat((C.fbmP(u * 6, v * 6, 6, 6, seed + 6, 2) - 0.45) * 3);
      r += (spot[0] - r) * sp * 0.55; g += (spot[1] - g) * sp * 0.55; b += (spot[2] - b) * sp * 0.55;
      var h = 0.5 + (fine - 0.5) * 0.2;
      // crinkle (thin skin): crossed fine lines
      var cr1 = Math.abs(Math.sin((u * 190 + v * 60 + mid * 3) * PI)), cr2 = Math.abs(Math.sin((u * 60 - v * 150 + mid * 3) * PI));
      var crink = sat((0.18 - Math.min(cr1, cr2)) * 5) * sat((mid - 0.35) * 2);
      var side = Math.cos(2 * PI * (u - 0.75));      // +1 on the +X side, -1 on the -X side
      if (kind === 'hand') {
        var dors = sstep(-0.1, 0.6, side), palm = sstep(0.1, -0.7, side);
        r += (pale[0] - r) * palm * 0.25; g += (pale[1] - g) * palm * 0.25; b += (pale[2] - b) * palm * 0.25;
        // veins
        var vs = 0, vh = 0;
        for (var q = 0; q < veins.length; q++) {
          var pl = veins[q], dmin = 9;
          for (var s = 0; s < pl.length - 1; s++) {
            var ax = pl[s][0], ay = pl[s][1], bx = pl[s + 1][0], by = pl[s + 1][1], dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
            var tt = L2 > 0 ? sat(((u - ax) * dx + (v - ay) * dy) / L2) : 0, ex = u - (ax + dx * tt), ey = v - (ay + dy * tt);
            var wob = 0.004 * Math.sin(v * 60 + q * 2);
            var d = Math.sqrt((ex + wob) * (ex + wob) + ey * ey); if (d < dmin) dmin = d;
          }
          var wv = (pl.w || 0.012);
          vs = Math.max(vs, sstep(wv, wv * 0.25, dmin)); vh = Math.max(vh, sstep(wv * 1.3, 0, dmin));
        }
        vs *= dors; vh *= dors;
        r += (vein[0] - r) * vs * 0.55; g += (vein[1] - g) * vs * 0.55; b += (vein[2] - b) * vs * 0.55;
        h += vh * 0.22;
        // palm creases: a couple of bending lines on the palm side
        var pc = 0;
        pc = Math.max(pc, sstep(0.012, 0.002, Math.abs(v - (0.55 + 0.12 * Math.sin((u - 0.1) * 9)))) * palm);
        pc = Math.max(pc, sstep(0.010, 0.002, Math.abs(v - (0.30 + 0.08 * Math.sin((u + 0.2) * 11)))) * palm);
        r *= 1 - 0.18 * pc; g *= 1 - 0.22 * pc; b *= 1 - 0.22 * pc; h -= pc * 0.22;
        // knuckle region (v small) redder and wrinkled
        var kn = sstep(0.18, 0.0, v);
        r += (red[0] - r) * kn * 0.4; g += (red[1] - g) * kn * 0.3; b += (red[2] - b) * kn * 0.3;
        var kw = Math.abs(Math.sin(v * 95 + u * 4 + mid * 4)); kw = sat((0.25 - kw) * 4) * kn;
        r *= 1 - 0.14 * kw; g *= 1 - 0.18 * kw; b *= 1 - 0.18 * kw; h -= kw * 0.25;
      } else if (kind === 'leg') {
        // o.knee = v of the kneecap centre, o.kneeH = its half-height in v. Front of the leg at u = 0.5; medial side = o.med (+1: +X side)
        var kv = o.knee || 0.55, kh = o.kneeH || 0.05, med = o.med || -1;
        var fr = Math.cos(2 * PI * (u - 0.5)), frontK = sstep(0.0, 0.8, fr), sideM = sstep(0.1, 0.9, Math.cos(2 * PI * (u - (med > 0 ? 0.75 : 0.25))));
        var dk = (v - kv) / kh, du = (u - 0.5) / 0.09, kn = Math.exp(-(dk * dk + du * du) * 0.7);
        // redder, rougher knees; pink shins
        r += (red[0] - r) * kn * 0.45; g += (red[1] - g) * kn * 0.40; b += (red[2] - b) * kn * 0.36;
        var shin = frontK * sstep(kv - 0.05, kv - 0.20, v) * sstep(0.05, 0.25, v);
        r += (red[0] - r) * shin * 0.16; g += (red[1] - g) * shin * 0.14; b += (red[2] - b) * shin * 0.12;
        // concentric creases over the kneecap and folds just above it
        var ring = Math.sqrt(dk * dk * 0.9 + du * du), rc = Math.abs(Math.sin(ring * 7.5 + mid * 2.5));
        var kcre = sat((0.22 - rc) * 4) * sstep(2.2, 0.6, ring) * sat((mid - 0.25) * 2);
        var above = sstep(kv + 0.02, kv + 0.07, v) * sstep(kv + 0.16, kv + 0.09, v) * frontK;
        var fold = sat((0.16 - Math.abs(Math.sin((v * 120 + Math.sin(u * 30) * 0.6) ))) * 5) * above;
        r *= 1 - 0.12 * (kcre + fold); g *= 1 - 0.16 * (kcre + fold); b *= 1 - 0.16 * (kcre + fold); h -= (kcre + fold) * 0.25;
        // a few soft blue veins on the inner calf and behind the knee
        var vz = 0, vu, vq;
        for (vq = 0; vq < 3; vq++) {
          vu = (med > 0 ? 0.70 : 0.30) + (vq - 1) * 0.07 + 0.025 * Math.sin(v * (9 + vq * 3) + vq * 2) + 0.01 * (C.noiseP(v * 14, vq * 3.3, 14, 4, seed + 30 + vq) - 0.5);
          vz = Math.max(vz, sstep(0.010, 0.002, Math.abs(u - vu)) * sstep(0.08, 0.2, v) * sstep(kv + 0.02, kv - 0.12, v) * (0.5 + 0.5 * sat((C.noiseP(v * 6, vq * 7.1, 6, 4, seed + 40 + vq) - 0.3) * 3)));
        }
        r += (vein[0] - r) * vz * 0.30; g += (vein[1] - g) * vz * 0.30; b += (vein[2] - b) * vz * 0.30; h += vz * 0.08;
        // dry, shiny shins: flatter tone on the front
        h += frontK * sstep(kv - 0.08, 0.2, v) * 0.0;
      } else { // neck
        // a few broken, uneven creases across the front (never evenly spaced rings) + fine crepe lines
        var fr = sstep(0.12, 0.5, Math.cos(2 * PI * (u - 0.5)) * 0.5 + 0.5), cre = 0, ci;
        var CV = [0.24, 0.43, 0.61, 0.80];
        for (ci = 0; ci < CV.length; ci++) {
          var vc = CV[ci] + 0.030 * Math.sin(u * 2 * PI * 2 + ci * 1.7) + 0.020 * (C.noiseP(u * 9, ci * 3.1, 9, 4, seed + ci) - 0.5);
          var brk = sat((C.noiseP(u * 7 + ci * 1.3, ci * 5.7, 7, 4, seed + 20 + ci) - 0.30) * 3.2);   // breaks the line up
          cre = Math.max(cre, sstep(0.013, 0.002, Math.abs(v - vc)) * brk);
        }
        cre *= 0.35 + 0.65 * fr;
        r *= 1 - 0.07 * cre; g *= 1 - 0.09 * cre; b *= 1 - 0.09 * cre; h -= cre * 0.12;
        // platysma cords: two soft vertical bands in the front of the throat
        var cord = 0;
        [-1, 1].forEach(function (sg) { cord = Math.max(cord, sstep(0.030, 0.0, Math.abs(u - (0.5 + sg * 0.060 + 0.010 * Math.sin(v * 9 + sg)))) * sstep(0.12, 0.35, v) * sstep(0.95, 0.60, v)); });
        h += cord * 0.14; r *= 1 - 0.04 * cord; g *= 1 - 0.06 * cord; b *= 1 - 0.06 * cord;
        // sternocleidomastoid tendons: diagonal bands from behind the ear to the throat
        var tend = 0;
        [-1, 1].forEach(function (sg) {
          var uc = 0.5 + sg * (0.20 - 0.14 * (1 - v));           // converge toward the throat as v decreases
          var dd = Math.abs(u - uc);
          tend = Math.max(tend, sstep(0.05, 0.0, dd) * sstep(0.0, 0.25, v));
        });
        h += tend * 0.18;
        r *= 1 - 0.05 * tend; g *= 1 - 0.07 * tend;
        // throat hollow
        var th = sstep(0.07, 0.0, Math.abs(u - 0.5)) * sstep(0.7, 0.3, v);
        r *= 1 - 0.10 * th; g *= 1 - 0.14 * th; b *= 1 - 0.14 * th;
      }
      r *= 1 - 0.16 * crink; g *= 1 - 0.20 * crink; b *= 1 - 0.20 * crink; h -= crink * 0.2;
      var tone = 0.94 + 0.12 * mid;
      out[0] = r * tone; out[1] = g * tone; out[2] = b * tone; out[3] = h;
    });
    return finish(p, o.strength || 3.5, o.tile || 1, 0.7);
  };
})(typeof window !== 'undefined' ? window : globalThis);

;