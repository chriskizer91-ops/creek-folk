// ==========================================================================
// Small view patches for lives: body size, elder fur, panel lines, activity text.
// ==========================================================================

// Children are small and grow through their first week; elders' fur turns pale.
(function () {
  let update = CreatureView.prototype.update,
    grey = new wt(0.86, 0.84, 0.8);
  CreatureView.prototype.update = function (t, e, n) {
    let w = this.world,
      c = this.c,
      k = c.look.size * 1.25 * bodyScale(w, c);
    if (Math.abs(this.root.scale.x - k) > 1e-4) this.root.scale.setScalar(k);
    let elder = c.stage === "elder" ? clamp((ageDays(w, c) - LIFE.elderDays) / 4, 0, 1) * 0.55 : 0;
    if (this._elder !== elder) {
      this._elder = elder;
      this.mFur.color.copy(this.furColor).lerp(grey, elder);
    }
    return update.call(this, t, e, n);
  };
})();

// "a child, 3 days old · child of Moss and Pip"
function lifeLine(w, c) {
  let a = ageDays(w, c),
    st = stageOf(w, c),
    name = (id) => (w.byId[id] ? w.byId[id].name : w.lineage && w.lineage[id] ? w.lineage[id].name : null),
    days = a < 1 ? "born today" : `${Math.floor(a)} ${Math.floor(a) === 1 ? "day" : "days"} old`,
    who = { child: "a child", adult: "grown", elder: "a wise elder" }[st],
    bits = [`${who}, ${days}`];
  let ps = (c.parents || []).map(name).filter(Boolean);
  if (ps.length) bits.push(`child of ${ps.join(" and ")}`);
  else if (c.founder) bits.push("one of the first five");
  if (c.partner && w.byId[c.partner]) bits.push(`with ${w.byId[c.partner].name}`);
  let kids = (c.children || []).length;
  if (kids) bits.push(`${kids} ${kids === 1 ? "child" : "children"}`);
  return bits.join(" · ");
}

// The panel for someone who is no longer in the valley.
function goneHTML(hud, w, id) {
  let r = w.lineage && w.lineage[id];
  if (!r) return hud.header("Gone");
  let D = 86400,
    when = r.died ?? r.left,
    ago = agoText(w.t - when),
    line =
      r.how === "downstream"
        ? `Went downstream ${ago}, aged ${Math.round(r.age)} days.`
        : `Passed on ${ago}, aged ${Math.round(r.age)} days. A tree grows for them in the grove.`;
  return (
    hud.header(r.name) +
    `<div class="sh-body"><p>${escapeHtml(line)}</p>${
      r.children && r.children.length
        ? `<p class="muted">Children: ${escapeHtml(r.children.map((k) => (w.byId[k] ? w.byId[k].name : w.lineage[k] ? w.lineage[k].name : "?")).join(", "))}</p>`
        : ""
    }</div>`
  );
}

// What someone is doing, for the new goals.
(function () {
  let original = activityText;
  activityText = function (c, w) {
    let p = c.plan,
      g = p && p.goal,
      other = p && p.with && (w.byId[p.with] || (w.lineage && w.lineage[p.with]));
    if (g === "farewell") return c.act && c.act.type === "walk" ? "Walking slowly to a place they love" : "Resting quietly at a place they love, at the end of a long life";
    if (g === "vigil" && other) {
      let leaving = w.byId[p.with] && w.byId[p.with].leaving;
      if (c.act && c.act.type === "walk") return leaving ? `Walking with ${other.name} to the edge of the valley` : `Going to sit with ${other.name}`;
      return leaving ? `Seeing ${other.name} off` : `Sitting with ${other.name}`;
    }
    if (g === "leave") return c.act && c.act.type === "walk" ? "Following the creek downstream, to leave the valley" : "Taking a last look back at the valley";
    return original(c, w);
  };
})();

// While the tab is hidden the browser stops drawing frames, so the valley keeps
// living from a slow timer instead (browsers may slow it to once a minute; each
// call simply runs up to the current moment). Long sleeps of the laptop are
// replayed by the normal catch-up when the page is visible again.
setInterval(() => {
  let a = window.__creek;
  if (!a || !a.world || a.catching || document.visibilityState !== "hidden") return;
  let target = a.simTarget();
  if (target - a.world.t > 6 * 3600) return; // leave long gaps to the catch-up
  runUntil(a.world, target, performance.now() + 60, () => performance.now());
  if (!a.lastHiddenSave || performance.now() - a.lastHiddenSave > 60e3) (a.lastHiddenSave = performance.now()), a.save();
}, 1000);
