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

// Fur: sixteen ramps (shadow, mid, light), chosen from a creekfolk's hue and lightness. A
// founder's fur comes down its family with small changes, so families keep their colours.
var CF2_FUR = [
  ["#8a6e52", "#b8987a", "#dcc4a4"], // fawn
  ["#a47a3c", "#cfa258", "#ecc985"], // honey
  ["#9a4f22", "#c86b30", "#e8935a"], // ginger
  ["#7a3a24", "#a24e30", "#c87452"], // rust
  ["#5a3a26", "#7e5436", "#a47852"], // chestnut
  ["#3e2a22", "#5a4032", "#7a5c48"], // cocoa
  ["#4a4e5a", "#6a7080", "#9098a6"], // slate
  ["#5e5a58", "#85807c", "#aca6a0"], // smoke
  ["#8e8a86", "#b8b4ae", "#dcd8d0"], // silver
  ["#2e2c2c", "#46423e", "#625c56"], // charcoal
  ["#a8946a", "#cdb98e", "#ece0bc"], // sand
  ["#b8ac9c", "#ddd2c0", "#f6eee0"], // cream
  ["#6a5a4a", "#8e7a62", "#b4a084"], // dun
  ["#7a5a6a", "#9e7a8a", "#c4a2b0"], // heather
  ["#46564a", "#62766a", "#869a8c"], // moss-grey
  ["#8a5a3a", "#b07a52", "#d4a07a"], // tawny
];
// Cloth dyes: what their families weave and knit (Phase 2 passes patterns down families).
var CF2_DYE = [
  ["#7a2e2a", "#a8453a", "#c8664e"], // madder
  ["#2e4a6a", "#44688e", "#6a8eb2"], // woad
  ["#4a5e2e", "#667e40", "#8ca25e"], // weld green
  ["#8a6a22", "#b8902e", "#dcb452"], // goldenrod
  ["#5a3a5a", "#7a527a", "#a07aa0"], // elderberry
  ["#6a4a2e", "#8e6a44", "#b28e62"], // walnut
  ["#2e5a5a", "#427a7a", "#66a0a0"], // teal
  ["#8a8478", "#b4aea0", "#dad4c6"], // undyed
];
var CF2_SPRITE_EXTRA = ["#2a2420", "#f4ead8", "#e89a90", "#4a3a34", "#fff8e8", "#8a6a4a", "#5a4632"]; // ink, belly cream, inner ear, nose, glint, stick, stick shadow

function furIndex(look) {
  let h = ((look.hue % 1) + 1) % 1,
    l = look.light ?? 0.55;
  // hue picks a family of ramps; lightness picks within it
  let groups = [
    [5, 4, 3, 2], // reds and browns
    [4, 15, 2, 1], // tawny to honey
    [12, 0, 10, 11], // dun, fawn, sand, cream
    [14, 7, 8, 11], // moss-grey, smoke, silver
    [9, 6, 7, 8], // charcoal to silver, blue-ish
    [13, 13, 0, 11], // heather
  ];
  let g = groups[Math.floor(h * groups.length) % groups.length];
  return g[clamp(Math.floor(((l - 0.45) / 0.23) * 4), 0, 3)];
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

function cf2SpriteColours(c, vwFurHue) {
  let look = c.look || {},
    fur = CF2_FUR[furIndex(look)].slice(),
    elder = c.stage === "elder";
  if (elder) {
    // elders go grey at the muzzle and over the head: their fur's light tone turns pale
    fur = [fur[0], fur[1], "#dcd8d0"];
  }
  let dye = CF2_DYE[Math.floor(((vwFurHue ?? look.hue ?? 0) * 997) % CF2_DYE.length)];
  return {
    k: CF2_SPRITE_EXTRA[0],
    f: fur[0],
    F: fur[1],
    L: fur[2],
    O: fur[0],
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
  };
}

var spriteCache = new Map();
// A creekfolk's sheet: 4 rows (down, up, right, left) x 3 frames (stand, step, step).
function creekSprites(c, familyKey) {
  let child = c.stage === "child",
    T = child ? SPRITE_CHILD : SPRITE_ADULT,
    key = `${c.id}|${c.stage}|${furIndex(c.look || {})}|${familyKey}|${(c.look || {}).belly > 0.7 ? 1 : 0}|${(c.look || {}).spots ? 1 : 0}`;
  if (spriteCache.has(key)) return spriteCache.get(key);
  let col = cf2SpriteColours(c, familyKey),
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
          g.fillStyle = col[ch] || "#ff00ff";
          g.fillRect(ox + x, oy + y, 1, 1);
        }
    };
  ["down", "up", "right", "left"].forEach((dir, r) => {
    let base = T[dir === "left" ? "right" : dir],
      feet = dir === "down" || dir === "up" ? T.feetDown : T.feetSide;
    for (let f = 0; f < 3; f++) {
      let rows = base.slice(0, H - 2).concat(feet[f]);
      // spots: a few light patches on the back and head (from Creekfolk 1's looks)
      if (c.look && c.look.spots && dir !== "down") rows = rows.map((s, y) => (y === 4 || y === 7 ? s.replace(/FL|LF/, "LL") : s));
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
  for (let r of CF2_DYE) out.push(...r);
  out.push(...CF2_SPRITE_EXTRA, "#dcd8d0");
  return out;
}
