// Phase 3C: drawing looks (patterns, things to wear, ages at a glance). Owner: helper "looks".
//
// Wraps CreatureView (view.js) rather than changing it. On a creature view's first frame
// (looksBuild) the body gets the fur colour from the inherited palette (LOOKS_FUR in
// src/sim/looks.js) and its coat painted on: the body keeps its 80 flat facets, but each
// is split into nine coplanar pieces so stripes, spots, saddles, patches, masks and blazes
// can be coloured piece by piece (vertex colours, no textures; the silhouette and the
// shading are exactly as before). Every frame after the original update (looksFrame):
// children's proportions (big eyes, big ears, a tuft, small paws), elders' grey fur, grey
// muzzle, drooping ears and walking stick, the thing they wear for their passion, and the
// treasure a believer wears on a cord.
//
// For other pieces: looksFurColor(world, c) is a creature's fur colour as an sRGB number
// (for example the colour of their front door).

function looksHSL(w, c) {
  let l = looksOf(w, c),
    f = LOOKS_FUR[l.fur] || LOOKS_FUR[0];
  return [f[0], f[1], clamp(f[2] * (0.92 + (l.light ?? 0.55) * 0.15), 0.08, 0.92)];
}

// A creature's fur colour (not greyed by age), as an sRGB number: new THREE.Color(n) or
// material.color.set(n).
function looksFurColor(w, c) {
  let h = looksHSL(w, c);
  return new wt().setHSL(h[0] / 360, h[1], h[2]).getHex();
}

// The coloured dot beside a name in the panels follows the fur.
sd = function (w, c) {
  let h = looksHSL(w, c);
  return `hsl(${h[0]} ${Math.round(h[1] * 100)}% ${Math.round(h[2] * 100)}%)`;
};

var LOOKS_VIEW = {
  sub: 3, // each body facet is split into sub x sub pieces for painting
  cream: [38, 0.45, 0.88],
  greyFrom: 0.22, // how grey a new elder is ...
  greyTo: 0.45, // ... and the oldest (the family colour still shows)
  stickActs: { walk: 1, sit: 1, watch: 1, chat: 1, look: 1, call: 1, wait: 1, huddle: 1, idle: 1 }, // the stick stays in hand
};

// ---------------------------------------------------------------------------
// The body, split for painting.
// ---------------------------------------------------------------------------
var looksBody = null; // { pos: Float32Array, dir: Float32Array (one direction per piece) }
function looksBodyTemplate() {
  if (looksBody) return looksBody;
  let g = new jn(0.28, 1),
    src = g.index ? g.toNonIndexed().attributes.position.array : g.attributes.position.array,
    n = LOOKS_VIEW.sub,
    tris = src.length / 9,
    pos = new Float32Array(tris * n * n * 9),
    dir = new Float32Array(tris * n * n * 3),
    k = 0,
    q = 0;
  let P = (A, B, C, i, j, out) => {
    for (let d = 0; d < 3; d++) out[d] = A[d] + ((B[d] - A[d]) * i) / n + ((C[d] - A[d]) * j) / n;
    return out;
  };
  let push = (a, b, c) => {
    for (let v of [a, b, c]) for (let d = 0; d < 3; d++) pos[k++] = v[d];
    let x = a[0] + b[0] + c[0],
      y = a[1] + b[1] + c[1],
      z = a[2] + b[2] + c[2],
      m = Math.hypot(x, y, z) || 1;
    dir[q++] = x / m;
    dir[q++] = y / m;
    dir[q++] = z / m;
  };
  for (let t = 0; t < tris; t++) {
    let A = [src[t * 9], src[t * 9 + 1], src[t * 9 + 2]],
      B = [src[t * 9 + 3], src[t * 9 + 4], src[t * 9 + 5]],
      C = [src[t * 9 + 6], src[t * 9 + 7], src[t * 9 + 8]];
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n - i; j++) {
        push(P(A, B, C, i, j, [0, 0, 0]), P(A, B, C, i + 1, j, [0, 0, 0]), P(A, B, C, i, j + 1, [0, 0, 0]));
        if (i + j < n - 1) push(P(A, B, C, i + 1, j, [0, 0, 0]), P(A, B, C, i + 1, j + 1, [0, 0, 0]), P(A, B, C, i, j + 1, [0, 0, 0]));
      }
  }
  g.dispose();
  return (looksBody = { pos, dir, count: q / 3 });
}

// Which pieces of the body are marked: 1 for the coat pattern, 2 for the face marking.
// The muzzle (greys first in elders) is flagged separately. Front is +z, up is +y.
function looksCoat(c, l) {
  let B = looksBodyTemplate(),
    r = new Rng("looks-coat:" + c.id),
    mark = new Uint8Array(B.count),
    muzzle = new Uint8Array(B.count),
    centres = [];
  let randDir = (minY, maxZ) => {
    for (;;) {
      let x = r.range(-1, 1),
        y = r.range(-1, 1),
        z = r.range(-1, 1),
        m = Math.hypot(x, y, z);
      if (m < 0.2 || m > 1) continue;
      (x /= m), (y /= m), (z /= m);
      if (y >= minY && z <= maxZ) return [x, y, z];
    }
  };
  if (l.pat === "spots") for (let k = 0; k < 7; k++) centres.push([...randDir(-0.15, 0.45), Math.cos(r.range(0.17, 0.27))]);
  if (l.pat === "patches") for (let k = 0; k < 3; k++) centres.push([...randDir(-0.4, 0.3), Math.cos(r.range(0.5, 0.75))]);
  let phase = r.range(0, Math.PI * 2),
    bands = r.range(6, 7.5);
  for (let p = 0; p < B.count; p++) {
    let x = B.dir[p * 3],
      y = B.dir[p * 3 + 1],
      z = B.dir[p * 3 + 2],
      m = 0;
    if (l.pat === "spots" || l.pat === "patches") {
      for (let s of centres) if (x * s[0] + y * s[1] + z * s[2] > s[3]) m = 1;
    } else if (l.pat === "stripes") {
      // bands across the back, from the crown to the tail, fading out down the sides
      let phi = Math.atan2(-z, y);
      if (phi > -0.95 && phi < 2.7 && y > -0.5 && Math.abs(x) < 0.94 - Math.max(0, -y) * 0.5 && Math.sin(phi * bands + phase) > 0.3) m = 1;
    } else if (l.pat === "saddle") {
      if (y * 0.55 - z * 0.85 > 0.3 && Math.abs(x) < 0.8) m = 1;
    }
    if (l.face === "mask" && z > 0.42 && y > 0.1 && y < 0.5) m = 2;
    if (l.face === "blaze" && Math.abs(x) < 0.17 && ((z > 0.4 && y > -0.05) || (y > 0.75 && z > -0.2))) m = 2;
    mark[p] = m;
    muzzle[p] = z > 0.8 && y < 0.24 && y > -0.3 ? 1 : 0;
  }
  return { mark, muzzle };
}

// Colours for one creature, greyed by `grey` (0 young .. ~0.6 the oldest elders).
function looksPalette(w, c, grey) {
  let l = looksOf(w, c),
    h = looksHSL(w, c),
    C = (hh, s, li) => new wt().setHSL(hh / 360, clamp(s, 0, 1), clamp(li, 0, 0.96)),
    fur = C(h[0], h[1], h[2]),
    cream = C(LOOKS_VIEW.cream[0], LOOKS_VIEW.cream[1], LOOKS_VIEW.cream[2]).lerp(fur, 0.12),
    dark = C(h[0], h[1] * 0.9, h[2] * 0.55),
    pale = l.pale ? 1 : 0;
  if (pale && h[2] > 0.78) pale = 0; // pale markings on pale fur wouldn't show
  if (!pale && h[2] < 0.36) pale = 1; // nor dark ones on dark fur
  let mark = pale ? cream.clone() : dark,
    face = l.face === "mask" ? (h[2] > 0.5 ? C(h[0], h[1] * 0.6, h[2] * 0.42) : cream.clone()) : cream.clone(),
    belly = C(h[0], h[1] * 0.55, Math.min(0.92, h[2] + 0.22)),
    sock = cream.clone(),
    muzzle = null;
  if (grey > 0) {
    let g = C(h[0], 0.06, clamp(h[2] * 0.75 + 0.22, 0.45, 0.85)); // grey, a little lighter than the fur
    for (let col of [fur, belly, sock]) col.lerp(g, grey);
    for (let col of [mark, face]) col.lerp(g, grey * 0.4); // markings stay to the end
    muzzle = fur.clone().lerp(new wt(0.86, 0.85, 0.83), clamp(0.45 + grey, 0, 0.9));
  }
  return { fur, mark, face, belly, sock, muzzle, dark: fur.clone().multiplyScalar(0.72) };
}

// ---------------------------------------------------------------------------
// Things to wear, the treasure, the stick and the child's tuft.
// ---------------------------------------------------------------------------
var LOOKS_TREASURES = {
  "a smooth blue stone": (P) => [part(on(0.034), 0x4d7fd6, { sy: 0.75, sz: 0.55 })],
  "a long white feather": (P) => [part(ze(0.02, 0.13, 5), 0xf6f4ee, { y: -0.05, rx: Math.PI, sz: 0.4 }), part(yt(0.004, 0.004, 0.04, 3), 0xb9b2a4, { y: 0.02 })],
  "a tiny bell": (P) => [part(ze(0.032, 0.05, 7), 0xe9c24a, { y: -0.01 }), part(Bn(0.012, 5, 3), 0xb88a22, { y: -0.04 })],
  "a carved wooden bead": (P) => [part(qt(0.03, 0), 0x9a6a3c, {})],
  "a spiral shell": (P) => [part(ze(0.028, 0.07, 6), 0xf3e2c6, { y: -0.025, rx: Math.PI, rz: 0.4 }), part(Bn(0.022, 6, 4), 0xe8c9a4, { y: 0.008 })],
  "a piece of green glass": (P) => [part(on(0.032), 0x52d69a, { sy: 1.3, sz: 0.5 })],
  "a ring of braided grass": (P) => [part(id(0.028, 0.009, 4, 10), 0xc2c35a, {})],
  "a little copper key": (P) => [part(id(0.017, 0.006, 4, 8), 0xc8763f, { y: 0.01 }), part(lt(0.011, 0.05, 0.007), 0xc8763f, { y: -0.03 }), part(lt(0.016, 0.008, 0.007), 0xc8763f, { x: 0.008, y: -0.048 })],
};

function looksMesh(parts) {
  let g = mergeParts(parts),
    m = new Et(g, he());
  return m;
}

// The colour of what they wear: the family's dye, or another when it would vanish
// against their fur.
function looksDye(w, c) {
  let l = looksOf(w, c),
    h = looksHSL(w, c),
    fur = new wt().setHSL(h[0] / 360, h[1], h[2]);
  for (let k = 0; k < LOOKS_DYES.length; k++) {
    let d = new wt(LOOKS_DYES[(l.dye + k * 3) % LOOKS_DYES.length]);
    if (Math.abs(d.r - fur.r) + Math.abs(d.g - fur.g) + Math.abs(d.b - fur.b) > 0.45) return d.getHex();
  }
  return LOOKS_DYES[l.dye] ?? LOOKS_DYES[0];
}

// The thing they wear, as one mesh (or a group with a moving part) on the body.
function looksItem(cv, kind) {
  let l = cv.c.look,
    dye = looksDye(cv.world, cv.c),
    root = new Pe(),
    add = (parts, at = {}) => {
      let m = looksMesh(parts);
      m.position.set(at.x || 0, at.y || 0, at.z || 0);
      m.rotation.set(at.rx || 0, at.ry || 0, at.rz || 0);
      root.add(m);
      return m;
    };
  if (kind === "lilypad") {
    let cut = Math.PI * 2 - 0.75;
    add(
      [
        part(new Ar(0.19, 0.19, 0.018, 13, 1, !1, 0.4, cut), 0x4f8f3e, {}),
        part(new Ar(0.172, 0.18, 0.012, 13, 1, !1, 0.4, cut), 0x74b257, { y: 0.01 }),
        part(yt(0.012, 0.03, 0.05, 5), 0x4f8f3e, { y: -0.03 }),
        part(qt(0.032, 0), dye === 0xf2efe6 ? 0xf3a7c8 : dye, { x: -0.06, y: 0.035, z: 0.05 }),
      ],
      { y: 0.6, z: -0.01, rx: 0.22, ry: 0.5, rz: 0.08 },
    );
  } else if (kind === "sunhat") {
    add(
      [
        part(yt(0.2, 0.2, 0.014, 12), 0xdcbc68, {}),
        part(yt(0.085, 0.105, 0.09, 9), 0xe3c677, { y: 0.05 }),
        part(yt(0.108, 0.108, 0.026, 9), dye, { y: 0.02 }),
        part(ze(0.02, 0.09, 4), 0x5f9e4a, { x: 0.09, y: 0.06, z: 0.04, rz: -0.5 }),
        part(qt(0.022, 0), 0xf6f0e0, { x: 0.11, y: 0.1, z: 0.05 }),
      ],
      { y: 0.545, rz: 0.1, rx: -0.06 },
    );
  } else if (kind === "apron") {
    add(
      [
        part(lt(0.25, 0.19, 0.016), 0x9a6a3e, {}),
        part(lt(0.09, 0.06, 0.01), dye, { x: 0.055, y: -0.04, z: 0.012 }),
        part(yt(0.008, 0.008, 0.06, 3), 0x6b6b6b, { x: -0.06, y: -0.025, z: 0.014, rz: 0.2 }),
      ],
      { y: 0.155, z: 0.238, rx: 0.36 },
    );
    // the ties around the waist
    add([part(id(0.262, 0.01, 3, 18), 0x7d5530, { rx: Math.PI / 2, sz: 0.97 })], { y: 0.245 });
  } else if (kind === "satchel") {
    // the strap runs under the chin and down to the bag on the hip
    let strap = id(0.272, 0.012, 3, 20);
    strap.rotateX(Math.PI / 2);
    strap.scale(1, 1, 0.97);
    strap.rotateZ(0.3);
    add([part(strap, 0x7d5530, {})], { y: 0.205 });
    add(
      [
        part(lt(0.06, 0.11, 0.13), dye, {}),
        part(lt(0.066, 0.045, 0.136), new wt(dye).multiplyScalar(0.7).getHex(), { y: 0.04, x: -0.003 }),
        part(qt(0.012, 0), 0xe7d27a, { x: -0.035, y: 0.025 }),
      ],
      { x: -0.27, y: 0.12, z: 0.02, rz: 0.12 },
    );
  } else if (kind === "scarf") {
    add([part(id(0.262, 0.034, 4, 16), dye, { rx: Math.PI / 2, sy: 0.96, sz: 0.62 })], { y: 0.235, rx: 0.12 });
    // a knot at the side and the end hanging down in front
    add([part(qt(0.04, 0), dye, { sx: 1, sy: 0.8, sz: 0.7 })], { x: 0.15, y: 0.235, z: 0.215 });
    let tail = add(
      [
        part(lt(0.07, 0.16, 0.02), dye, { y: -0.08 }),
        part(lt(0.075, 0.024, 0.024), new wt(dye).multiplyScalar(0.75).getHex(), { y: -0.15 }),
      ],
      { x: 0.16, y: 0.235, z: 0.225, ry: -0.5, rz: 0.12 },
    );
    root.userData.tail = tail;
  } else if (kind === "flower") {
    let ps = [];
    for (let k = 0; k < 5; k++) {
      let a = (k / 5) * Math.PI * 2;
      ps.push(part(qt(0.03, 0), dye === 0xf2efe6 ? 0xf6f4ee : dye, { x: Math.cos(a) * 0.035, y: Math.sin(a) * 0.035, sz: 0.4 }));
    }
    ps.push(part(qt(0.02, 0), 0xf2cf45, { z: 0.01 }));
    add(ps, { x: 0.15, y: 0.49, z: 0.13, ry: 0.55, rx: -0.2 });
  } else if (kind === "bells") {
    // a ribbon round each ear, and a little bell on one; these ride on the ears
    root.userData.ears = [];
    for (let k = 0; k < 2; k++) {
      let e = cv.ears[k],
        sx = e.sx,
        rr = 0.085 * l.earW * (1 - 0.1 / 0.26) + 0.008,
        parts = [part(yt(rr, rr + 0.004, 0.03, 4), dye, { y: 0.1 * l.ear })];
      if (k === 1) parts.push(part(ze(0.024, 0.04, 6), 0xe9c24a, { x: sx * (rr + 0.012), y: 0.1 * l.ear - 0.035 }), part(Bn(0.009, 4, 3), 0xb88a22, { x: sx * (rr + 0.012), y: 0.1 * l.ear - 0.058 }));
      let m = looksMesh(parts);
      e.g.add(m);
      root.userData.ears.push(m);
    }
  }
  return root;
}

// The treasure on a cord (or hung from the scarf).
function looksPendant(cv, thing, onScarf) {
  let root = new Pe(),
    make = LOOKS_TREASURES[thing] || LOOKS_TREASURES["a carved wooden bead"],
    charm = looksMesh(make());
  charm.scale.setScalar(1.35);
  if (!onScarf) {
    let cord = looksMesh([part(id(0.268, 0.006, 3, 22), 0x5a3e28, { rx: Math.PI / 2 + 0.3, sz: 0.97 })]);
    cord.position.y = 0.285;
    root.add(cord);
    charm.position.set(0, 0.17, 0.258);
  } else charm.position.set(0, 0.16, 0.27);
  root.add(charm);
  return root;
}

// A cane: the paw holds it below the crook, its foot on the ground.
function looksStick() {
  return looksMesh([
    part(yt(0.016, 0.019, 0.34, 5), 0x8a5a33, { y: -0.04 }),
    part(yt(0.016, 0.016, 0.08, 5), 0x8a5a33, { y: 0.15, z: 0.03, rx: 0.9 }),
    part(yt(0.016, 0.013, 0.055, 5), 0x8a5a33, { y: 0.155, z: 0.08, rx: 2.3 }),
    part(qt(0.02, 0), 0x6e4526, { y: 0.13 }),
  ]);
}

// An elder's pale, bushy brows.
function looksBrows() {
  let ps = [];
  for (let sx of [-1, 1]) ps.push(part(qt(0.03, 0), 0xffffff, { x: 0.105 * sx, y: 0.455, z: 0.21, sx: 1.6, sy: 0.55, sz: 0.8, rx: -0.6, rz: -0.25 * sx }));
  return mergeParts(ps);
}

// ---------------------------------------------------------------------------
// Building and updating the creature view.
// ---------------------------------------------------------------------------
function looksBuild(cv) {
  let w = cv.world,
    c = cv.c,
    l = looksOf(w, c),
    lk = (cv._lk = { grey: -1, kid: -1, wear: undefined, gem: undefined, mats: [] });
  // The original spots (drawn by view.js when look.spots) give way to the painted coat.
  for (let m of cv.pivot.children.slice())
    if (m !== cv.body && m.material === cv.mDark && m.geometry && m.geometry.attributes.color) {
      cv.pivot.remove(m);
      m.geometry.dispose();
    }
  // The body: the same facets, split for painting, coloured per piece.
  let B = looksBodyTemplate(),
    geo = new ye();
  geo.setAttribute("position", new Le(B.pos.slice(), 3));
  geo.setAttribute("color", new Le(new Float32Array(B.pos.length), 3));
  geo.computeVertexNormals();
  cv.body.geometry.dispose();
  cv.body.geometry = geo;
  lk.mBody = new Qe({ vertexColors: !0, flatShading: !0 });
  cv.body.material = lk.mBody;
  lk.coat = looksCoat(c, l);
  // Pale paws.
  if (l.socks) {
    lk.mSock = new Qe({ flatShading: !0 });
    for (let m of [...cv.hands, ...cv.feet]) m.material = lk.mSock;
  }
  lk.mats.push(lk.mBody, lk.mSock);
  // Eyes sit in their own groups so they can grow without fighting the blink.
  lk.eyeGroups = cv.eyes.map((e) => {
    let g = new Pe();
    g.position.copy(e.position);
    e.position.set(0, 0, 0);
    cv.pivot.remove(e);
    g.add(e);
    cv.pivot.add(g);
    return g;
  });
  lk.eyeY = lk.eyeGroups.map((g) => g.position.y);
  lk.footScale = cv.feet.map((f) => f.scale.clone());
  // A child's tuft of fur on the crown.
  lk.tuft = new Et(
    mergeParts([
      part(ze(0.035, 0.11, 4), 0xffffff, { y: 0.05, rz: 0.25 }),
      part(ze(0.03, 0.09, 4), 0xffffff, { x: 0.035, y: 0.04, rz: -0.35 }),
      part(ze(0.028, 0.08, 4), 0xffffff, { x: -0.03, y: 0.035, z: 0.02, rz: 0.6 }),
    ]),
    cv.mFur,
  );
  lk.tuft.position.set(0, 0.535, 0.02);
  cv.pivot.add(lk.tuft);
  lk.stick = null;
  lk.mBrow = new Qe({ flatShading: !0 });
  lk.mats.push(lk.mBrow);
  lk.brows = new Et(looksBrows(), lk.mBrow);
  lk.brows.visible = !1;
  cv.pivot.add(lk.brows);
  looksColours(cv, 0);
}

// Paint the body and colour the other parts for the creature's age.
function looksColours(cv, grey) {
  let lk = cv._lk,
    P = looksPalette(cv.world, cv.c, grey),
    col = cv.body.geometry.attributes.color,
    a = col.array,
    coat = lk.coat,
    n = coat.mark.length;
  for (let p = 0; p < n; p++) {
    let m = coat.mark[p],
      k = m === 1 ? P.mark : m === 2 ? P.face : P.muzzle && coat.muzzle[p] ? P.muzzle : P.fur;
    for (let v = 0; v < 3; v++) (a[(p * 3 + v) * 3] = k.r), (a[(p * 3 + v) * 3 + 1] = k.g), (a[(p * 3 + v) * 3 + 2] = k.b);
  }
  col.needsUpdate = !0;
  cv.furColor.copy(P.fur); // view.js keeps mFur (now the child's tuft) at this colour, darker when wet
  cv.mDark.color.copy(P.dark);
  cv.mBelly.color.copy(P.belly);
  if (lk.mSock) lk.mSock.color.copy(P.sock);
  if (P.muzzle) lk.mBrow.color.copy(P.muzzle).lerp(new wt(1, 1, 1), 0.35);
  lk.brows.visible = grey > 0;
  lk.grey = grey;
}

function looksSetItems(cv, wear, gem) {
  let lk = cv._lk,
    drop = (o) => {
      if (!o) return;
      if (o.userData.ears) for (let m of o.userData.ears) m.parent && m.parent.remove(m), m.geometry.dispose();
      o.parent && o.parent.remove(o);
      o.traverse((m) => m.geometry && m.geometry.dispose());
    };
  if (wear !== lk.wear) {
    drop(lk.item);
    lk.item = wear ? looksItem(cv, wear) : null;
    if (lk.item) cv.pivot.add(lk.item);
    lk.wear = wear;
    lk.gem = undefined; // the pendant hangs differently with a scarf
  }
  if (gem !== lk.gem) {
    drop(lk.pendant);
    lk.pendant = gem ? looksPendant(cv, gem, wear === "scarf") : null;
    if (lk.pendant) cv.pivot.add(lk.pendant);
    lk.gem = gem;
  }
}

function looksFrame(cv, dt, clock) {
  let lk = cv._lk,
    w = cv.world,
    c = cv.c,
    l = c.look,
    age = ageDays(w, c),
    st = cv.state;
  // Things to wear and the treasure.
  looksSetItems(cv, looksWorn(w, c), looksWearsTreasure(c) ? c.treasure : null);
  // Elders grey, a little more each day.
  let grey = age >= LIFE.elderDays ? LOOKS_VIEW.greyFrom + (LOOKS_VIEW.greyTo - LOOKS_VIEW.greyFrom) * clamp((age - LIFE.elderDays) / 5, 0, 1) : 0;
  if (Math.abs(grey - lk.grey) > 0.025 || (grey === 0 && lk.grey !== 0)) looksColours(cv, grey);
  lk.mBody.color.setScalar(1 - (c.wet || 0) * 0.3);
  // Children: big eyes and ears, a tuft, small paws; it fades as they grow.
  let kid = age < LIFE.childDays ? 1 - smoothstep(1, LIFE.childDays, age) : 0;
  if (Math.abs(kid - lk.kid) > 0.004) {
    lk.kid = kid;
    let e = 1 + 0.5 * kid;
    lk.eyeGroups.forEach((g, i) => {
      g.scale.set(e, e, 1);
      g.position.y = lk.eyeY[i] - 0.025 * kid;
    });
    for (let ear of cv.ears) ear.g.scale.set(1 + 0.12 * kid, 1 + 0.06 * kid, 1 + 0.12 * kid);
    for (let h of cv.hands) h.scale.setScalar(1 - 0.3 * kid);
    cv.feet.forEach((f, i) => f.scale.copy(lk.footScale[i]).multiplyScalar(1 - 0.25 * kid));
    cv.body.scale.x = 1 + 0.05 * kid;
    cv.body.scale.z = 0.95 * (1 + 0.04 * kid);
    lk.tuft.visible = kid > 0.2;
    lk.tuft.scale.setScalar(0.6 + 0.6 * kid);
  }
  // Elders' ears droop a little, and they stoop when they stand and walk.
  if (grey > 0) {
    for (let ear of cv.ears) ear.g.rotation.x += 0.18;
    cv.pivot.rotation.x += 0.08 * (1 - clamp(st.lie, 0, 1)) * (1 - clamp(st.sit, 0, 1));
  }
  // The scarf's end flaps when they hurry.
  if (lk.item && lk.item.userData.tail) {
    let sp = Math.min(1.5, cv.speed || 0);
    lk.item.userData.tail.rotation.x = -0.25 - sp * 0.45 + Math.sin(clock * 9 + cv.phase) * 0.12 * sp;
  }
  // The elder's walking stick: in the hand while they walk, stand or sit; across the
  // back while their hands are busy, while they carry something or lie down.
  if (c.stage === "elder" || age >= LIFE.elderDays) {
    if (!lk.stick) lk.stick = looksStick();
    let type = c.act ? c.act.type : "idle",
      inHand = LOOKS_VIEW.stickActs[type] && !c.carry && st.lie < 0.5,
      hand = cv.hands[0];
    if (inHand) {
      if (lk.stick.parent !== hand) hand.add(lk.stick), lk.stick.position.set(0, 0, 0);
      let sit = clamp(st.sit, 0, 1),
        walk = c.act && c.act.type === "walk" && cv.speed > 0.05;
      lk.stick.rotation.set(-cv.pivot.rotation.x - 0.1 - sit * 0.5 + (walk ? Math.sin(clock * 9 + cv.phase) * 0.12 : 0), 0, -cv.pivot.rotation.z - sit * 0.3);
    } else if (lk.stick.parent !== cv.pivot) {
      cv.pivot.add(lk.stick);
      lk.stick.position.set(0.1, 0.42, -0.25);
      lk.stick.rotation.set(0.25, 0, 0.95);
    }
  } else if (lk.stick) {
    lk.stick.parent && lk.stick.parent.remove(lk.stick);
    lk.stick.geometry.dispose();
    lk.stick = null;
  }
}

(function () {
  let update = CreatureView.prototype.update,
    dispose = CreatureView.prototype.dispose;
  CreatureView.prototype.update = function (t, e, n) {
    if (!this._lk) looksBuild(this);
    let out = update.call(this, t, e, n);
    looksFrame(this, t, e);
    return out;
  };
  CreatureView.prototype.dispose = function () {
    if (this._lk) {
      if (this._lk.stick && !this._lk.stick.parent) this._lk.stick.geometry.dispose();
      for (let m of this._lk.mats) m && m.dispose();
    }
    return dispose.call(this);
  };
})();
