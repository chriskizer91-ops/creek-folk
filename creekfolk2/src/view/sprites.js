// ==========================================================================
// Creekfolk as small pixel sprites, for the middle of the zoom (between dots in the air and
// full creekfolk close up). Built the way What the Map Forgot builds its characters: each
// frame is a grid of letters, each letter a colour, and one body becomes many creekfolk by
// changing the colours and a few rows. Here the colours come from each creekfolk's looks
// (its fur, its belly, its family's cloth), from fixed palettes so the pixel pass keeps them.
//
//   creekSprites(c) -> { canvas, w, h, frames: { down: [stand, stepA, stepB], up, right, left } }
//   each frame is { x, y } in the canvas (w x h pixels). Left is right, mirrored.
// ==========================================================================

// Fur: Creekfolk 1's 24 inherited fur colours (looks.js, LOOKS_FUR), each as a ramp (shadow, mid,
// light) so the pixel pass keeps them. Markings: a pale (cream) or dark shade of the fur.
function cf2Hsl(h, s, l) {
  let c = new THREE.Color().setHSL(h / 360, clamp(s, 0, 1), clamp(l, 0, 1));
  return "#" + c.getHexString();
}
var CF2_FUR = LOOKS_FUR.map(([h, s, l]) => [cf2Hsl(h, s * 1.04, l * 0.7), cf2Hsl(h, s, l), cf2Hsl(h, s * 0.92, Math.min(0.94, l * 1.14 + 0.05))]);
var CF2_MARK_DARK = LOOKS_FUR.map(([h, s, l]) => [cf2Hsl(h, s, l * 0.36), cf2Hsl(h, s, l * 0.48), cf2Hsl(h, s, l * 0.6)]);
var CF2_MARK_PALE = ["#d8ccb4", "#f4ead8", "#fff8ec"];
// Cloth dyes: Creekfolk 1's eight colours for what they wear (LOOKS_DYES, running in families),
// as ramps, and walnut brown for the second yarn when the first is undyed.
var CF2_DYE = LOOKS_DYES.concat([0x8e6a44]).map((v) => {
  let c = new THREE.Color(v),
    hsl = {};
  c.getHSL(hsl);
  return [cf2Hsl(hsl.h * 360, hsl.s, hsl.l * 0.68), "#" + c.getHexString(), cf2Hsl(hsl.h * 360, hsl.s * 0.9, Math.min(0.95, hsl.l * 1.16 + 0.04))];
});
var CF2_UNDYED = 7,
  CF2_WALNUT = 8;
// What grown-ups wear for what they love (LOOKS_WEAR): lily green, straw, leather, bell gold, flower red
var CF2_WEAR = {
  lily: ["#3f6b3f", "#5f9255", "#8fb86f"],
  straw: ["#a3975a", "#c4b674", "#ddd296"],
  leather: ["#4a3424", "#6a4a2e", "#8e6a44"],
  gold: ["#a8822a", "#d8b040", "#f0d070"],
  bloom: ["#b2361f", "#d2402f", "#ea7a2a"],
  heart: ["#c08f3e", "#efc067", "#fde4a2"],
};
// Cloth patterns (Decision 10): What the Water Brings' families of cloth, redrawn bold for the
// pixel look. Each family line weaves its own pattern, from whoever started it, in the dye the
// creekfolk wears (their own, from the simulation), with undyed yarn through it.
var CF2_PATTERNS = ["stripes", "check", "chevron", "zigzag", "knit", "rib", "tweed"];
function clothOf(c) {
  let line = c.line || [c.id, c.id],
    dye = c.look && c.look.dye != null ? c.look.dye : line[0] % 8,
    dye2 = dye === CF2_UNDYED ? CF2_WALNUT : CF2_UNDYED;
  return { pat: CF2_PATTERNS[(line[0] * 3 + 1) % CF2_PATTERNS.length], dye, dye2, key: `${line[0]}.${dye}` };
}
// a family's colour (dots from the air, the map): the fur its line wears
function familyColour(c) {
  return CF2_FUR[furIndex(c.look || {})][1];
}
// whether a cloth pixel (x, y) of a sprite is in the second colour
function patAt(pat, x, y) {
  switch (pat) {
    case "stripes":
      return y % 2 === 1;
    case "rib":
      return x % 2 === 1;
    case "check":
      return ((x >> 1) + y) % 2 === 1;
    case "chevron":
      return (Math.abs((x % 4) - 1.5) + 0.5 + y) % 3 < 1;
    case "zigzag":
      return (x + (y % 2)) % 3 === 0;
    case "knit":
      return y % 2 ? x % 3 !== 1 : x % 3 === 1;
    case "tweed":
      return ((x * 7 + y * 13) ^ (x * y)) % 5 === 0;
  }
  return false;
}
var CF2_SPRITE_EXTRA = ["#2a2420", "#f4ead8", "#e89a90", "#4a3a34", "#fff8e8", "#8a6a4a", "#5a4632"]; // ink, belly cream, inner ear, nose, glint, stick, stick shadow

function furIndex(look) {
  if (look.fur != null) return clamp(look.fur | 0, 0, CF2_FUR.length - 1);
  return looksFurFromHue(look.hue || 0);
}

// The letters: . clear, k ink, F f L fur (mid, shadow, light), B belly, I inner ear, E eye,
// W glint, N nose, C c P cloth (mid, shadow, pattern), S s walking stick, O feet (fur shadow)
var SPRITE_ADULT = {
  w: 16,
  h: 18,
  down: [
    "...kk......kk...",
    "..kIFk....kFIk..",
    "..kIFFkkkkFFIk..",
    "..kFFLLLLLLFFk..",
    ".kFFLLLLLLLLFFk.",
    ".kFLLLLLLLLLLFk.",
    ".kFLEWLLLLEWLFk.",
    ".kFLEELLLLEELFk.",
    ".kFLLLLNNLLLLFk.",
    ".kfFLLLLLLLLFfk.",
    "..kfFFFFFFFFfk..",
    ".kFkCCPCCPCCkFk.",
    ".kFkCCCCCCCCkFk.",
    ".kFkcBBBBBBckFk.",
    "..kkfBBBBBBfkk..",
    "...kffffffffk...",
    "...kOOk..kOOk...",
    "....kk....kk....",
  ],
  up: [
    "...kk......kk...",
    "..kFFk....kFFk..",
    "..kFFFkkkkFFFk..",
    "..kFFLLLLLLFFk..",
    ".kFFLLLLLLLLFFk.",
    ".kFLLLLLLLLLLFk.",
    ".kFLLLLLLLLLLFk.",
    ".kFFLLLLLLLLFFk.",
    ".kfFFLLLLLLFFfk.",
    ".kffFFFFFFFFffk.",
    "..kfffffffffk...",
    ".kFkCCPCCPCCkFk.",
    ".kFkCCCCCCCCkFk.",
    ".kFkcCCCCCCckFk.",
    "..kkfffkkfffkk..",
    "...kfffkkfffk...",
    "...kOOk..kOOk...",
    "....kk....kk....",
  ],
  right: [
    "....kk..........",
    "...kIFk.........",
    "...kIFFkkkk.....",
    "..kFFLLLLLLk....",
    ".kFFLLLLLLLLk...",
    ".kFLLLLLLLLLLk..",
    ".kFLLLLLLLEWLk..",
    ".kFLLLLLLLEELNk.",
    ".kFLLLLLLLLLLNk.",
    ".kfFLLLLLLLLLk..",
    "..kfFFFFFFFFk...",
    "..kCCPCCPCCCk...",
    "kkkCCCCCCFFCk...",
    "kFkcCCBBBkFck...",
    ".kkfffBBBfkk....",
    "...kfffffffk....",
    "...kOOkkOOk.....",
    "....kk..kk......",
  ],
  // walking: the feet, every other step
  feetDown: [
    ["...kOOk..kOOk...", "....kk....kk...."],
    ["...kOOk..kffk...", "....kk...kOOk..."],
    ["...kffk..kOOk...", "...kOOk...kk...."],
  ],
  feetSide: [
    ["...kOOkkOOk.....", "....kk..kk......"],
    ["..kOOk..kOOk....", "..kk......kk...."],
    ["....kOOkOOk.....", ".....kkkk......."],
  ],
};
// Children: a bigger head on a smaller body (the three ages readable at a glance)
var SPRITE_CHILD = {
  w: 14,
  h: 14,
  down: [
    "..kk......kk..",
    ".kIFk....kFIk.",
    ".kIFFkkkkFFIk.",
    ".kFLLLLLLLLFk.",
    "kFLLLLLLLLLLFk",
    "kFLEWLLLLEWLFk",
    "kFLEELLLLEELFk",
    "kFLLLLNNLLLLFk",
    ".kfFLLLLLLFfk.",
    "..kfCCPCCCfk..",
    ".kFkcBBBBckFk.",
    "..kkfBBBBfkk..",
    "...kOOkkOOk...",
    "....kk..kk....",
  ],
  up: [
    "..kk......kk..",
    ".kFFk....kFFk.",
    ".kFFFkkkkFFFk.",
    ".kFLLLLLLLLFk.",
    "kFLLLLLLLLLLFk",
    "kFLLLLLLLLLLFk",
    "kFFLLLLLLLLFFk",
    "kfFFLLLLLLFFfk",
    ".kfFFFFFFFFfk.",
    "..kfCCPCCCfk..",
    ".kFkcCCCCckFk.",
    "..kkffkkffkk..",
    "...kOOkkOOk...",
    "....kk..kk....",
  ],
  right: [
    "...kk.........",
    "..kIFk........",
    "..kIFFkkkk....",
    ".kFLLLLLLLk...",
    "kFLLLLLLLLLk..",
    "kFLLLLLLLEWLk.",
    "kFLLLLLLLEELNk",
    "kFLLLLLLLLLLNk",
    ".kfFLLLLLLLk..",
    "..kCCPCCCk....",
    ".kFcCBBBFk....",
    "..kkfBBBkk....",
    "...kOOkOOk....",
    "....kk.kk.....",
  ],
  feetDown: [
    ["...kOOkkOOk...", "....kk..kk...."],
    ["...kOOkkffk...", "....kk.kOOk..."],
    ["...kffkkOOk...", "...kOOk.kk...."],
  ],
  feetSide: [
    ["...kOOkOOk....", "....kk.kk....."],
    ["..kOOk.kOOk...", "..kk.....kk..."],
    ["....kOOOOk....", ".....kkkk....."],
  ],
};

function cf2SpriteColours(c, cloth) {
  let look = c.look || {},
    fi = furIndex(look),
    fur = CF2_FUR[fi].slice(),
    elder = c.stage === "elder",
    mark = look.pale ? CF2_MARK_PALE : CF2_MARK_DARK[fi];
  if (elder) {
    // elders go grey at the muzzle and over the head: their fur's light tone turns pale
    fur = [fur[0], fur[1], "#dcd8d0"];
  }
  let dye = CF2_DYE[cloth.dye];
  return {
    k: CF2_SPRITE_EXTRA[0],
    f: fur[0],
    F: fur[1],
    L: fur[2],
    O: look.socks ? CF2_MARK_PALE[1] : fur[0],
    B: look.belly > 0.7 ? CF2_SPRITE_EXTRA[1] : fur[2],
    I: CF2_SPRITE_EXTRA[2],
    E: CF2_SPRITE_EXTRA[0],
    W: CF2_SPRITE_EXTRA[4],
    N: CF2_SPRITE_EXTRA[3],
    c: dye[0],
    C: dye[1],
    P: dye[2],
    S: CF2_SPRITE_EXTRA[5],
    s: CF2_SPRITE_EXTRA[6],
    // markings and the face
    M: mark[1],
    m: mark[0],
    D: CF2_MARK_DARK[fi][0], // a mask is always dark
    V: CF2_MARK_PALE[1], // a blaze is always pale
    // what they wear
    g: CF2_WEAR.lily[0],
    G: CF2_WEAR.lily[1],
    y: CF2_WEAR.straw[0],
    Y: CF2_WEAR.straw[1],
    a: CF2_WEAR.leather[0],
    A: CF2_WEAR.leather[1],
    b: CF2_WEAR.gold[1],
    r: CF2_WEAR.bloom[1],
    h: CF2_WEAR.heart[1],
  };
}

// small numbers from a creekfolk's id, the same every time (where their patches and spots fall)
function spriteHash(id, k) {
  let h = Math.imul(id * 73856093 + k * 19349663, 2654435761) >>> 0;
  return (h ^ (h >>> 15)) % 1000;
}
var FURCH = { F: 1, f: 1, L: 1 };
// The coat (stripes, a saddle, patches, spots), the face (a mask, a blaze) and what they wear,
// laid onto one frame's letters. dir: down (facing us), up, right; child: the smaller body.
function spriteLooks(rows, dir, c, child, wear) {
  let g = rows.map((r) => r.split("")),
    H = g.length,
    Wd = g[0].length,
    look = c.look || {},
    get = (x, y) => (y >= 0 && y < H && x >= 0 && x < Wd ? g[y][x] : "."),
    set = (x, y, ch) => {
      if (y >= 0 && y < H && x >= 0 && x < Wd && g[y][x] !== ".") g[y][x] = ch;
    },
    put = (x, y, ch) => {
      if (y >= 0 && y < H && x >= 0 && x < Wd) g[y][x] = ch;
    },
    headB = child ? 8 : 10, // the last row of the head
    bodyA = child ? 9 : 11;
  // where the eyes are in this frame
  let eyes = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < Wd; x++) if (g[y][x] === "E") eyes.push([x, y]);
  let nearEye = (x, y) => eyes.some(([ex, ey]) => Math.abs(ex - x) <= 1 && Math.abs(ey - y) <= 1);
  // the coat
  for (let y = 0; y < H; y++)
    for (let x = 0; x < Wd; x++) {
      if (!FURCH[g[y][x]] || nearEye(x, y)) continue;
      let face = dir === "down" && y > 3 && y <= headB,
        on = false;
      if (look.pat === "stripes") on = y % 3 === 0 && !face && (dir !== "down" || y <= 3 || y >= bodyA) && x > 1 && x < Wd - 2;
      else if (look.pat === "saddle") on = dir !== "down" && y >= headB - 1 && y <= headB + 3 && x > 2 && x < Wd - 3;
      else if (look.pat === "patches") {
        for (let q = 0; q < 2; q++) {
          let cx = 3 + (spriteHash(c.id, q) % (Wd - 6)),
            cy = q ? bodyA + 1 : 3 + (spriteHash(c.id, q + 5) % 3);
          if ((x - cx) * (x - cx) + (y - cy) * (y - cy) * 1.4 < 2.6 && !face) on = true;
        }
      } else if (look.pat === "spots") on = !face && spriteHash(c.id * 31 + x, y) % 7 === 0;
      if (on) g[y][x] = g[y][x] === "f" ? "m" : "M";
    }
  // the face
  if (look.face === "mask") for (let [ex, ey] of eyes) for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) if (FURCH[get(ex + dx, ey + dy - 1)] || get(ex + dx, ey + dy - 1) === "M") set(ex + dx, ey + dy - 1, "D");
  if (look.face === "blaze" && dir !== "up") {
    let cx = dir === "down" ? Wd / 2 - 1 : Wd - 4;
    for (let y = 1; y <= headB - 2; y++)
      for (let dx = 0; dx < (dir === "down" ? 2 : 1); dx++) {
        let ch = get(cx + dx, y);
        if (FURCH[ch] || ch === "M") set(cx + dx, y, "V");
      }
  }
  // what they wear
  let mid = Math.floor(Wd / 2);
  if (wear === "lilypad") {
    for (let x = mid - 4; x <= mid + 3; x++) put(x, 1, x === mid ? "." : "G");
    for (let x = mid - 3; x <= mid + 2; x++) put(x, 0, x === mid - 1 ? "r" : "g");
  } else if (wear === "sunhat") {
    for (let x = 1; x < Wd - 1; x++) if (get(x, 3) !== ".") put(x, 3, "Y");
    put(0, 3, "y");
    put(Wd - 1, 3, "y");
    for (let x = mid - 3; x <= mid + 2; x++) put(x, 2, "Y"), put(x, 1, x === mid + 2 ? "G" : "y");
  } else if (wear === "apron" && dir !== "up") {
    for (let y = bodyA + 1; y < H - 2; y++) for (let x = 0; x < Wd; x++) if (g[y][x] === "B" || (g[y][x] === "c" && dir === "down")) g[y][x] = y === bodyA + 1 ? "a" : "A";
  } else if (wear === "satchel") {
    for (let q = 0; q < 4; q++) set(mid - 2 + q, bodyA + q - 1, "a");
    let sx = dir === "right" ? 2 : Wd - 3;
    for (let y = bodyA + 2; y <= bodyA + 3; y++) for (let x = sx - 1; x <= sx; x++) put(x, y, "A");
  } else if (wear === "bells") {
    for (let x = 0; x < Wd; x++) if (g[1][x] === "I" || (g[0][x] === "k" && dir !== "down")) put(x, 0, "b");
  } else if (wear === "scarf") {
    for (let x = 0; x < Wd; x++) if (g[headB][x] !== "." && g[headB][x] !== "k") g[headB][x] = x % 2 ? "C" : "c";
    put(dir === "right" ? 2 : mid + 2, headB + 1, "C");
    put(dir === "right" ? 2 : mid + 2, headB + 2, "c");
  } else if (wear === "flower") {
    let fx = dir === "right" ? 1 : Wd - 3;
    put(fx, 2, "r");
    put(fx + 1, 2, "r");
    put(fx, 1, "r");
    put(fx + 1, 3, "h");
  }
  return g.map((r) => r.join(""));
}

var spriteCache = new Map();
// A creekfolk's sheet: 4 rows (down, up, right, left) x 3 frames (stand, step, step).
function creekSprites(c) {
  let child = c.stage === "child",
    T = child ? SPRITE_CHILD : SPRITE_ADULT,
    cloth = clothOf(c),
    look = c.look || {},
    wear = child ? null : c.wear || look.wear || null,
    key = `${c.id}|${c.stage}|${furIndex(look)}|${cloth.key}|${look.belly > 0.7 ? 1 : 0}|${look.pat}|${look.pale}|${look.face}|${look.socks}|${wear}`;
  if (spriteCache.has(key)) return spriteCache.get(key);
  let col = cf2SpriteColours(c, cloth),
    alt = CF2_DYE[cloth.dye2],
    cv = document.createElement("canvas"),
    W = T.w,
    H = T.h;
  cv.width = W * 3;
  cv.height = H * 4;
  let g = cv.getContext("2d"),
    frames = { down: [], up: [], right: [], left: [] },
    put = (rows, ox, oy, mirror) => {
      for (let y = 0; y < rows.length; y++)
        for (let x = 0; x < rows[y].length; x++) {
          let ch = rows[y][mirror ? rows[y].length - 1 - x : x];
          if (ch === ".") continue;
          // cloth in the family's pattern (pinned to the sprite's own pixels, mirrored or not)
          if ((ch === "C" || ch === "P") && patAt(cloth.pat, mirror ? rows[y].length - 1 - x : x, y)) g.fillStyle = alt[1];
          else if (ch === "P") g.fillStyle = col.C;
          else if (ch === "c" && patAt(cloth.pat, x, y)) g.fillStyle = alt[0];
          else g.fillStyle = col[ch] || "#ff00ff";
          g.fillRect(ox + x, oy + y, 1, 1);
        }
    };
  ["down", "up", "right", "left"].forEach((dir, r) => {
    let base = T[dir === "left" ? "right" : dir],
      feet = dir === "down" || dir === "up" ? T.feetDown : T.feetSide;
    for (let f = 0; f < 3; f++) {
      let rows = spriteLooks(base.slice(0, H - 2).concat(feet[f]), dir === "left" ? "right" : dir, c, child, wear);
      put(rows, f * W, r * H, dir === "left");
      frames[dir].push({ x: f * W, y: r * H });
    }
  });
  // the elder's walking stick, beside them in every frame
  if (c.stage === "elder")
    for (let r = 0; r < 4; r++)
      for (let f = 0; f < 3; f++) {
        let sx = f * W + (r === 2 ? 1 : r === 3 ? W - 2 : W - 1),
          sy = r * H + 8;
        g.fillStyle = col.S;
        g.fillRect(sx, sy, 1, H - 8);
        g.fillStyle = col.k;
        g.fillRect(sx, sy - 1, 1, 1);
      }
  let out = { canvas: cv, w: W, h: H, frames };
  spriteCache.set(key, out);
  if (spriteCache.size > 400) spriteCache.delete(spriteCache.keys().next().value);
  return out;
}

// Every colour a sprite can use (for the pixel pass's palette).
function spritePalette() {
  let out = [];
  for (let r of CF2_FUR) out.push(...r);
  for (let r of CF2_MARK_DARK) out.push(...r);
  for (let r of CF2_DYE) out.push(...r);
  for (let k in CF2_WEAR) out.push(...CF2_WEAR[k]);
  out.push(...CF2_SPRITE_EXTRA, ...CF2_MARK_PALE, "#dcd8d0");
  return out;
}
