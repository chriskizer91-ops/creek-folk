// ==========================================================================
// The view of minds: the gift button and sheet, stories, places, customs and
// beliefs in the HUD.
// ==========================================================================

qc.gift =
  '<svg viewBox="0 0 24 24"><path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="currentColor"/><rect x="3" y="7" width="18" height="4" rx="1" fill="currentColor"/><path d="M12 7v14" stroke="#fff8ec" stroke-width="1.6"/><path d="M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

function hoursText(sec) {
  let h = Math.floor(sec / 3600),
    m = Math.round((sec % 3600) / 60);
  return h ? `${h} hour${h === 1 ? "" : "s"}${m ? ` ${m} minute${m === 1 ? "" : "s"}` : ""}` : `${Math.max(1, m)} minute${m === 1 ? "" : "s"}`;
}

// BELIEF (Phase 3B): what they make of the gifts. They come to believe the creek gives.
function beliefSummary(w) {
  let alive = w.creatures.filter((c) => !c.visitor),
    bs = believers(w);
  if (!(w.gifts || []).length) return "They haven't had a gift yet.";
  let bits = [];
  let doubt = alive.length - bs.length;
  bits.push(
    bs.length
      ? `${bs.length === alive.length ? "All" : bs.length > alive.length / 2 ? "Most" : bs.length === 1 ? "One" : "Some"} of them believe the creek gives them what they need${giverName(w).startsWith('"') ? `; they call it ${giverName(w)}` : ""}.${doubt > 0 && bs.length > 1 ? ` ${doubt === 1 ? "One still says" : doubt + " still say"} it's only luck.` : ""}`
      : `Most think the gifts are just luck${alive.some((c) => c.beliefs && c.beliefs.giver > 0.3) ? ", though some wonder if the creek has something to do with it" : ""}.`,
  );
  if (w.spring && w.spring.found) bits.push("They say the creek's gifts come from the Spring, where the creek begins.");
  if (w.customs && w.customs.thanks) bits.push(`When the creek gives, it's the custom to ${GESTURE_FIRST[w.customs.thanks.g].replace(/my /, "your ")}.`);
  if (w.giftRhythm) bits.push(`They've noticed that ${rhythmText(w.giftRhythm)}.`);
  if (w.giftsStopped) bits.push(`Lately the gifts haven't come. "The creek is resting," they say, and a lantern burns at the Giving Place.`);
  return bits.join(" ");
}

function requestLine(w) {
  let r = w.request;
  if (!r || w.t >= r.until) return "";
  let c = w.byId[r.by],
    k = GIFT_KINDS[r.kind];
  let ask = { rain: "rain", seeds: "seeds", warm: "a warm day", snow: "snow", stars: "a night of stars", rainbow: "a sign", flowers: "flowers", fruit: "fruit trees", goats: "animals", bees: "bees", fish: "fish", bird: "birdsong", greattree: "timber", clay: "clay", stones: "stones", found: "something to find", dream: "a dream" }[r.kind] || k.label.toLowerCase();
  return `<p class="ask"><b>${escapeHtml(c ? c.name : r.name)} asked the creek for ${escapeHtml(ask)}.</b> <small>"${escapeHtml(r.why[0].toUpperCase() + r.why.slice(1))}," they said.</small></p>`;
}

function offeringsLine(w) {
  let of = w.offerings;
  if (!of || !of.total) return "";
  let names = { bead: ["carved bead", "carved beads"], flower: ["flower", "flowers"], pebble: ["pretty pebble", "pretty pebbles"], ring: ["woven ring", "woven rings"], feather: ["feather", "feathers"], shell: ["creek shell", "creek shells"], whistle: ["reed whistle", "reed whistles"], figure: ["little clay figure", "little clay figures"], water: ["cup of spring water", "cups of spring water"] };
  let parts = Object.entries(of.n)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${n === 1 ? "a" : n} ${(names[k] || [k, k + "s"])[n === 1 ? 0 : 1]}`);
  return `<p class="muted">Left for you at the Giving Place: ${escapeHtml(parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts.at(-1) : parts[0])}.</p>`;
}

Hud.prototype.giftHTML = function () {
  let w = this.w,
    ready = giftReady(w),
    last = (w.gifts || [])[w.gifts ? w.gifts.length - 1 : 0],
    body = requestLine(w);
  if (ready) {
    body += `<p class="muted">Once every twelve hours you can send the valley one gift. It will help things grow, and the creekfolk will make of it what they will.</p>`;
    for (let [g, gl] of GIFT_GROUPS)
      body += `<h4>${gl}</h4><ul class="list gifts">${Object.entries(GIFT_KINDS)
        .filter(([, k]) => k.group === g)
        .map(([id, k]) => `<li><button class="pill${w.request && w.request.kind === id && w.t < w.request.until ? " on" : ""}" data-act="gift" data-kind="${id}">${k.label}</button><small>${k.hint}</small></li>`)
        .join("")}</ul>`;
  } else body += `<p>Your next gift can be sent in ${hoursText(giftWaitSeconds(w))}.</p>${last ? `<p class="muted">Last time: ${escapeHtml(giftText(last.what).toLowerCase())}, ${agoText(w.t - last.t)}.</p>` : ""}`;
  body += `<h4>What they make of it</h4><p class="muted">${escapeHtml(beliefSummary(w))}</p>` + offeringsLine(w);
  return this.header("A gift for the valley", "once every twelve hours") + `<div class="sh-body">${body}</div>`;
};

(function () {
  let action = App.prototype.action;
  App.prototype.action = function (t, e, n) {
    if (t === "gift") {
      if (this.catching) return this.hud.toast("The valley is still catching up.");
      let r = giveGift(this.world, e.kind);
      if (!r) return this.hud.toast(giftReady(this.world) ? "That gift can't be given just now." : "Not yet. Gifts come once every twelve hours.");
      this.hud.close();
      let k = GIFT_KINDS[r.kind],
        say = { found: "You left something in the grass for them to find.", seeds: "You scattered seeds in the grass.", dream: "You sent one of them a dream." }[r.kind] || `You sent ${(k.phrase || r.what || k.label).replace(/^A /, "a ")}.`;
      this.hud.toast(say + (r.asked ? ` ${this.world.byId[r.asked] ? this.world.byId[r.asked].name : "They"} had asked the creek for it.` : ""));
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
    !b.seen && !(b.giver > 0.35)
      ? "Hasn't seen a gift yet."
      : b.giver > 0.6
        ? `Believes the creek gives them what they need${favoriteWord(c, "giver") ? `, and calls it "${favoriteWord(c, "giver")}"` : ""}.`
        : b.giver > 0.35
          ? "Wonders whether the creek has something to do with the gifts."
          : "Thinks the gifts are just luck.";
  if (b.beyond) belief += " But they're sure the gifts themselves come from someone beyond the valley, someone who looks in on them. They wave at the sky.";
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
  if (cu.thanks) out.push(`When the creek gives, they ${GESTURE_FIRST[cu.thanks.g].replace(/my /, "their ")} to say thank you.`);
  if (w.givingPlace && (w.stats.gifts || 0) > 0) out.push(`They mark every giving day with a notch on the Giving Stone: ${w.stats.gifts} so far.`);
  let lost = Object.keys(w.lost || {});
  let html = out.length ? `<h4>Village customs</h4><ul class="list">${out.map((t) => `<li><span>${escapeHtml(t)}</span></li>`).join("")}</ul>` : "";
  html += `<h4>The gifts</h4><p class="muted">${escapeHtml(beliefSummary(w))}</p>`;
  if (lost.length) html += `<h4>Forgotten</h4><p class="muted">No one remembers anymore how ${escapeHtml(lost.map((k) => SKILL_TEXT[k]).join(", or how "))}.</p>`;
  return html + "<h4>Little habits</h4>";
}
