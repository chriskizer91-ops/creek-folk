// ==========================================================================
// Care, on the page: the Care sheet (leave a little food, put a treasure in the creek, where
// each of your treasures is now), leaving food with a tap on the ground, and the one who
// suspects someone is looking in turning to the camera and waving when the page opens.
// Nothing here is ever needed: the sheet says so, and nothing waits on it.
// ==========================================================================

function careSheet(w) {
  let wait = treasureWait(w),
    K = w.kindness || { piles: [], spots: [], left: [] },
    h = `<h2>Care</h2><p class="k">Freely given, never needed</p>`;
  h += `<h3>Leave a little food</h3><p>Near a home, a burrow or a path. They don't need it, and their lives go on fine without it, but they will notice.</p>`;
  if (K.piles.length >= KIND.piles) h += `<p class="mute">There's food out already. Let them find it first.</p>`;
  else h += `<div class="tabs">${Object.entries(KIND_FOODS).map(([k, f]) => `<button data-food="${k}">${esc(f.label)}</button>`).join("")}</div>`;
  let named = K.spots.filter((s) => s.named),
    eaten = w.stats.foodEaten || 0;
  if (eaten) {
    let left = K.left.length ? ` Some of them leave things there in return: ${[...new Set(K.left.map((l) => (OFFERING_KINDS_PLURAL[l.k] || l.k)))].slice(0, 4).join(", ")}.` : "";
    h += `<p class="mute">${eaten === 1 ? "Someone has found food you left." : "They have found the food you left, again and again."}${named.length ? ` They call the spot ${esc(named.map((s) => s.named).join(" and "))}.` : ""}${esc(left)}</p>`;
  }
  h += `<h3>A treasure for the creek</h3><p>Put it in the water at the head of the valley. It waits there for the rains; the next flood carries it down, and the creek decides where it settles. Someone may find it.</p>`;
  if (wait > 0) h += `<p class="mute">The creek can carry another in ${esc(spanText(wait))}.</p>`;
  else
    for (let [g, label] of TREASURE_GROUPS)
      h += `<p class="mute" style="margin:8px 0 4px">${esc(label)}</p><div class="tabs">${Object.entries(TREASURE_KINDS)
        .filter(([, k]) => k.group === g)
        .map(([id, k]) => `<button data-tr="${id}"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${k.paint};margin-right:6px;vertical-align:-1px;border:1px solid #3b2f22"></span>${esc(k.label)}</button>`)
        .join("")}</div>`;
  let L = (w.treasures || []).slice().reverse();
  if (L.length) {
    h += `<h3>Your treasures</h3>`;
    for (let tr of L.slice(0, 24)) {
      let K2 = TREASURE_KINDS[tr.k],
        here = ["wait", "bar", "pond", "floor", "set", "kept", "planted", "grove", "buried"].includes(tr.st),
        btn = tr.st === "worn" && w.byId[tr.who] ? `<button class="btn small" data-follow="${tr.who}">Find them</button>` : here ? `<button class="btn small" data-show="${tr.x},${tr.z}">Show me</button>` : "";
      h += `<p style="margin:6px 0"><b>${esc(K2.label)}</b> <span class="mute">${esc(dateText(w, tr.t).replace(/^Day/, "day"))}</span><br>${esc(treasureWhere(w, tr))} ${btn}</p>`;
    }
  }
  let bs = w.creatures.filter((c) => !c.visitor),
    believers = bs.filter((c) => c.beliefs && c.beliefs.giver > 0.5).length,
    beyond = bs.find((c) => c.beliefs && c.beliefs.beyond);
  if (w.stats.treasures) {
    h += `<h3>What they make of it</h3><p>${believers === 0 ? "No one is sure yet where the things come from." : believers >= bs.length * 0.8 ? "Almost all of them believe the creek gives." : believers >= bs.length / 2 ? "Most of them believe the creek gives; a few say it's only luck." : "Some of them believe the creek gives; others say it's only luck."}${beyond ? ` ${esc(beyond.name)} is sure the gifts come from someone beyond the valley, and waves at the sky when they think no one is looking.` : ""}</p>`;
  }
  return h;
}
var OFFERING_KINDS_PLURAL = { pebble: "pebbles", flower: "flowers", bead: "carved beads", ring: "rings of grass", feather: "feathers", shell: "shells", whistle: "reed whistles", figure: "clay figures" };

Hud.prototype.openCare = async function () {
  let w = await this.app.worldCopy();
  if (!w) return;
  this.village = w;
  let el = this.sheet(careSheet(w));
  for (let b of el.querySelectorAll("[data-food]"))
    b.onclick = () => {
      $("vSheet").hidden = true;
      this.app.renderer.placing = b.dataset.food;
      this.toast("Tap a spot near a home or a path.", 8);
    };
  for (let b of el.querySelectorAll("[data-tr]"))
    b.onclick = async () => {
      let r = await this.app.ask({ type: "treasure", kind: b.dataset.tr }, "cared");
      if (r && r.ok) this.toast(`You put ${TREASURE_KINDS[b.dataset.tr].label.toLowerCase()} in the water at the head of the valley. It will wait there for the rains.`, 8);
      this.openCare();
    };
  for (let b of el.querySelectorAll("[data-show]"))
    b.onclick = () => {
      let [x, z] = b.dataset.show.split(",").map(Number),
        R = this.app.renderer;
      $("vSheet").hidden = true;
      if (R.follow) R.follow(null);
      Object.assign(R.view.goal, { x, z, hv: 10 });
    };
  for (let b of el.querySelectorAll("[data-follow]"))
    b.onclick = () => {
      $("vSheet").hidden = true;
      this.app.renderer.follow(+b.dataset.follow);
      this.app.renderer.view.goal.hv = 6;
    };
};

// Food goes where the player tapped.
Hud.prototype.placeFood = async function (food, x, z) {
  let r = await this.app.ask({ type: "food", food, x, z }, "cared");
  this.toast(r && r.ok ? `You left ${KIND_FOODS[food].label.toLowerCase()} there.` : r && r.full ? "There's food out already. Let them find it first." : "Somewhere they can walk to, near a home or a path.", 6);
};

// When the page opens (or comes back), the one who suspects looks up and waves.
Hud.prototype.waveHello = function () {
  let R = this.app.renderer,
    c = [...this.app.vw.cs.values()].find((o) => o.beyond && !o.asleep && !o.away && !o.visitor);
  if (!R || !c || !R.valley) return;
  R.waveFor = { id: c.id, until: performance.now() + 9000 };
  this.toast(`${c.name} looked up, toward you, and waved.`, 7);
};
