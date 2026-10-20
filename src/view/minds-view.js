// ==========================================================================
// The view of minds: the gift button and sheet, stories, places, customs and
// beliefs in the HUD.
// ==========================================================================

qc.gift =
  '<svg viewBox="0 0 24 24"><path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="currentColor"/><rect x="3" y="7" width="18" height="4" rx="1" fill="currentColor"/><path d="M12 7v14" stroke="#fff8ec" stroke-width="1.6"/><path d="M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

var GIFT_CHOICES = [
  ["rain", "A gentle rain", "waters the gardens and fills the ponds"],
  ["seeds", "A scatter of seeds", "something to plant, and something to eat"],
  ["warm", "A warm day", "dries everyone off and helps things grow"],
  ["found", "Something to find", "a small mystery in the grass"],
];

function hoursText(sec) {
  let h = Math.floor(sec / 3600),
    m = Math.round((sec % 3600) / 60);
  return h ? `${h} hour${h === 1 ? "" : "s"}${m ? ` ${m} minute${m === 1 ? "" : "s"}` : ""}` : `${Math.max(1, m)} minute${m === 1 ? "" : "s"}`;
}

function beliefSummary(w) {
  let alive = w.creatures.filter((c) => !c.visitor),
    seen = alive.filter((c) => c.beliefs && c.beliefs.seen > 0),
    believers = alive.filter((c) => c.beliefs && c.beliefs.giver > 0.5);
  if (!(w.gifts || []).length) return "They haven't had a gift yet.";
  let bits = [];
  bits.push(
    believers.length
      ? `${believers.length} of ${alive.length} believe someone watches over the valley and sends the gifts${giverName(w).startsWith('"') ? `; they call the giver ${giverName(w)}` : ""}.`
      : `Most think the gifts are just luck${seen.length ? ", or the creek's doing" : ""}.`,
  );
  if (w.customs && w.customs.thanks) bits.push(`When a gift comes, it's the custom to ${GESTURE_FIRST[w.customs.thanks.g].replace(/my /, "your ")}.`);
  if (w.giftPatternNoticed) bits.push("They've noticed the gifts come about twice a day.");
  if (w.giftsStopped) bits.push("Lately the gifts have stopped, and they wonder why.");
  return bits.join(" ");
}

Hud.prototype.giftHTML = function () {
  let w = this.w,
    ready = giftReady(w),
    last = (w.gifts || [])[w.gifts ? w.gifts.length - 1 : 0];
  let body = ready
    ? `<p class="muted">Once every twelve hours you can send the valley one gift. It will help things grow, and the creekfolk will make of it what they will.</p><ul class="list">${GIFT_CHOICES.map(
        ([k, t, d]) => `<li><button class="pill" data-act="gift" data-kind="${k}">${t}</button><small>${d}</small></li>`,
      ).join("")}</ul>`
    : `<p>Your next gift can be sent in ${hoursText(giftWaitSeconds(w))}.</p>${last ? `<p class="muted">Last time: ${escapeHtml(giftText(last.what).toLowerCase())}, ${agoText(w.t - last.t)}.</p>` : ""}`;
  return this.header("A gift for the valley", "once every twelve hours") + `<div class="sh-body">${body}<h4>What they make of it</h4><p class="muted">${escapeHtml(beliefSummary(w))}</p></div>`;
};

(function () {
  let action = App.prototype.action;
  App.prototype.action = function (t, e, n) {
    if (t === "gift") {
      if (this.catching) return this.hud.toast("The valley is still catching up.");
      let r = giveGift(this.world, e.kind);
      if (!r) return this.hud.toast("Not yet. Gifts come once every twelve hours.");
      this.hud.close();
      this.hud.toast({ rain: "You sent a gentle rain.", seeds: "You scattered seeds in the grass.", warm: "You sent a warm day.", found: "You left something in the grass for them to find." }[r.kind]);
      this.save();
      return;
    }
    return action.call(this, t, e, n);
  };
  let tick = Hud.prototype.tick;
  Hud.prototype.tick = function (t) {
    let r = tick.call(this, t);
    if (this.w && this.giftBtn) this.giftBtn.classList.toggle("on", giftReady(this.w));
    return r;
  };
})();

// The creature panel's "Stories" tab.
function storiesTabHTML(w, c) {
  let b = c.beliefs || {},
    out = "";
  let belief =
    !b.seen
      ? "Hasn't seen a gift yet."
      : b.giver > 0.6
        ? `Believes someone watches over the valley and sends the gifts${favoriteWord(c, "giver") ? `, and calls them "${favoriteWord(c, "giver")}"` : ""}.`
        : b.giver > 0.35
          ? "Wonders whether someone sends the gifts."
          : "Thinks the gifts are just luck.";
  out += `<h4>The gifts</h4><p>${escapeHtml(belief)}${b.thanks && b.giver > 0.6 ? ` <small>Says thank you when one comes: ${escapeHtml(GESTURE_ING[b.thanks])}.</small>` : ""}</p>`;
  if (c.treasure) out += `<p class="muted">Keeps ${escapeHtml(c.treasure)} they found in the grass.</p>`;
  let lore = Object.entries(c.lore || {})
    .map(([k, l]) => ({ s: w.stories[k], l }))
    .filter((x) => x.s)
    .sort((a, b) => b.s.weight - a.s.weight || b.s.t - a.s.t);
  out += "<h4>Stories they tell</h4>";
  out += lore.length
    ? '<ul class="list">' +
      lore
        .map(({ s, l }) => {
          let how = l.first ? "was there" : l.from && (w.byId[l.from] || (w.lineage || {})[l.from]) ? `heard it from ${(w.byId[l.from] || w.lineage[l.from]).name}` : "heard it somewhere";
          let off = sameTold(w, s, l.v, s.truth) ? "" : " · not quite what happened";
          return `<li${s.x != null ? ` data-loc="${s.x},${s.z},"` : ""}><span>${escapeHtml(storyText(w, s, l.v))}</span><small>${escapeHtml(how + off)}</small></li>`;
        })
        .join("") +
      "</ul>"
    : '<p class="muted">No stories yet.</p>';
  return out;
}

// The village's "Stories" tab: what most of them say, and what really happened.
function villageStoriesHTML(w) {
  let tell = {};
  for (let c of w.creatures) for (let k in c.lore || {}) (tell[k] = tell[k] || []).push(c.lore[k]);
  let rows = Object.keys(tell)
    .filter((k) => w.stories[k])
    .map((k) => {
      let s = w.stories[k],
        counts = new Map();
      for (let l of tell[k]) {
        let key = JSON.stringify([l.v.who, l.v.n, l.v.where, l.v.why, l.v.big || 0]);
        let e = counts.get(key) || { n: 0, v: l.v };
        e.n++;
        counts.set(key, e);
      }
      let top = [...counts.values()].sort((a, b) => b.n - a.n)[0];
      return { s, top, n: tell[k].length, versions: counts.size };
    })
    .sort((a, b) => b.s.weight - a.s.weight || b.n - a.n || b.s.t - a.s.t);
  if (!rows.length) return '<p class="muted">No stories yet.</p>';
  let alive = w.creatures.filter((c) => !c.visitor).length;
  return (
    '<p class="muted">What the creekfolk tell each other, in the version most of them believe. Stories change a little with each telling.</p><ul class="list">' +
    rows
      .map(({ s, top, n, versions }) => {
        let myth = !sameTold(w, s, top.v, s.truth);
        return `<li${s.x != null ? ` data-loc="${s.x},${s.z},"` : ""}><span>${escapeHtml(storyText(w, s, top.v))}${myth ? `<br><small>What really happened: ${escapeHtml(storyText(w, s, s.truth))}</small>` : ""}</span><small>told by ${n} of ${alive}${versions > 1 ? ` · ${versions} versions` : ""}</small></li>`;
      })
      .join("") +
    "</ul>"
  );
}

function villagePlacesHTML(w) {
  let ps = w.placeNames || [];
  if (!ps.length) return '<p class="muted">No places have names yet. Places get their names from what happens there.</p>';
  let vocab = vocabularySummary(w);
  return (
    '<ul class="list">' +
    ps
      .map((p) => {
        let v = vocab.find((e) => e.concept === "place:" + p.id);
        return `<li data-loc="${p.x},${p.z},"><span><b>${escapeHtml(p.name)}</b>${v ? ` <small>they say "<span class="word">${escapeHtml(v.word)}</span>"</small>` : ""}</span><small>named ${agoText(w.t - p.t)}</small></li>`;
      })
      .join("") +
    "</ul>"
  );
}

function villageCustomsHTML(w) {
  let out = [],
    cu = w.customs || {};
  if (cu.passing && cu.passing.custom) out.push(`When someone passes, they ${OFFERINGS[cu.passing.custom][1]} for them.`);
  if (cu.seasons && cu.seasons.n >= 2) out.push(`They gather together whenever the season turns.`);
  if (cu.thanks) out.push(`When a gift arrives, they ${GESTURE_FIRST[cu.thanks.g].replace(/my /, "their ")} to say thank you.`);
  let lost = Object.keys(w.lost || {});
  let html = out.length ? `<h4>Village customs</h4><ul class="list">${out.map((t) => `<li><span>${escapeHtml(t)}</span></li>`).join("")}</ul>` : "";
  html += `<h4>The gifts</h4><p class="muted">${escapeHtml(beliefSummary(w))}</p>`;
  if (lost.length) html += `<h4>Forgotten</h4><p class="muted">No one remembers anymore how ${escapeHtml(lost.map((k) => SKILL_TEXT[k]).join(", or how "))}.</p>`;
  return html + "<h4>Little habits</h4>";
}
