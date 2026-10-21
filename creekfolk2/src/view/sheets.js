// ==========================================================================
// The parchment sheets: the valley (Land, People, What happened) and a creekfolk's mind.
// Each is built from a full copy of the world the worker sends when it's opened.
// ==========================================================================

function villageLand(w) {
  let cr = w.creek,
    s = seasonAt(w),
    parts = capacityParts(w),
    pop = w.creatures.filter((c) => !c.visitor).length,
    dr = cr.driest.slice(-6),
    inV = cr.nodes.filter((n) => n.z >= 0 && n.z <= VL),
    st = {};
  for (let n of inV) st[n.stage] = (st[n.stage] || 0) + 1;
  let healed = ((st["0"] || 0) + (st.V || 0) + (st.I || 0)) / inV.length,
    filling = (st.IV || 0) / inV.length,
    dams = w.structures.filter((x) => x.kind === "dam" && x.level > 0),
    held = dams.filter((x) => !x.leaks).length,
    B = cr.br,
    h = "";
  h += `<h3>What the land can feed</h3><p>The valley can feed about <b>${parts.feed}</b> creekfolk${parts.shelter < parts.feed ? `, though there is only shelter for ${parts.shelter}` : ""}. ${pop} live here now.</p>`;
  h += `<p class="mute">A cut-down creek that dries out every summer feeds about twenty. As it heals and stays wet through the dry season, it can feed more.</p>`;
  h += `<h3>At the driest time of year</h3>`;
  if (dr.length) {
    let last = dr[dr.length - 1];
    h += `<p>At the driest point of last year, <b>${esc(creekShareOfFloor(last.wet))}</b> stayed wet.</p>`;
    if (dr.length > 1) h += `<p class="mute">The last few years at their driest: ${dr.map((d) => esc(creekShareWords(d.wet))).join(" → ")}.</p>`;
  } else h += `<p>The valley hasn’t come through a dry season yet.</p>`;
  h += `<h3>The creek now</h3><p>${esc(dateText(w))}: ${s.wetSeason ? "the wet season, when storms come and the creek runs" : "the dry season"}. `;
  h += cr.flowLen >= VL - 4 ? "The creek is running the whole length of the valley." : cr.flowLen > 8 ? `The creek runs for ${cr.flowLen > VL / 2 ? "most" : "part"} of the valley, then sinks into its bed.` : "The creek has stopped flowing; only pools hold water.";
  let now = creekShareOfFloor(cr.wetNow);
  h += ` Right now ${esc(now)} ${now.startsWith("only") ? "hold" : "is"} water or marsh.</p>`;
  h += `<p>${healed > 0.8 ? "Almost the whole creek has healed: it has filled its old trench and spread back over its floor." : healed > 0.3 ? "In long stretches the creek has filled its old trench and reaches its floor again." : filling > 0.3 ? "Behind the dams the creek is filling its trench back up with gravel and mud." : "The creek is cut down into a trench below its old floor, so floods can’t spread out and the floor dries."}</p>`;
  if (dams.length) h += `<p class="mute">${dams.length} dam${dams.length > 1 ? "s" : ""} across the creek${held < dams.length ? `, ${dams.length - held === 1 ? "one" : dams.length - held} of them not holding (the water below is too far down)` : ""}.${w.stats.raises ? ` As ponds silted up, dams have been built up ${w.stats.raises === 1 ? "once" : w.stats.raises + " times"}.` : ""}</p>`;
  if (B) {
    let dry = { dry: "The Dry Fork is dry, a bed of pale stones.", pools: "The Dry Fork stands in pools after the rain.", running: "The Dry Fork is running, loud, off the bluff." }[B.dry.state];
    h += `<h3>The branches</h3><p>The spring under the west terrace runs clear and cold, as it always does. ${dry}</p>`;
  }
  return h;
}

function villagePeople(w) {
  let alive = w.creatures.filter((c) => !c.visitor && !c.away),
    sc = stageCounts(w),
    rows = alive
      .slice()
      .sort((a, b) => (a.born ?? 0) - (b.born ?? 0))
      .map((c) => `<tr><td><span class="who" data-who="${c.id}">${esc(c.name)}</span></td><td class="mute">${esc(lifeLine(w, c))}</td></tr>`)
      .join("");
  let away = w.creatures.filter((c) => c.away || c.visitor);
  return (
    `<p>${alive.length} creekfolk live in the valley: ${sc.child} ${sc.child === 1 ? "child" : "children"}, ${sc.adult} grown and ${sc.elder} ${sc.elder === 1 ? "elder" : "elders"}. ${w.stats.births || 0} have been born here, ${w.stats.passings || 0} have passed on, and ${w.stats.departed || 0} have gone on downstream.</p>` +
    `<table>${rows}</table>` +
    (away.length ? `<p class="mute">Away or visiting: ${away.map((c) => esc(c.name)).join(", ")}.</p>` : "")
  );
}

function villageLog(w) {
  let ev = (w.hist || []).slice(-60).reverse();
  if (!ev.length) return `<p class="mute">Nothing much has happened yet.</p>`;
  return ev.map((e) => `<p><span class="mute">${esc(dateText(w, e.t))}</span><br>${esc(e.text)}</p>`).join("");
}

function mindSheet(w, c) {
  let s = stageOf(w, c),
    known = knownForLines(c),
    h = `<h2>${esc(c.name)}</h2><p class="k">${esc(lifeLine(w, c))}</p>`;
  h += `<p><b>${esc(activityText(c, w))}.</b> ${esc(moodWord(c))}${known.length ? `; known for ${esc(known.join(" and "))}` : ""}.</p>`;
  if (c.carry) h += `<p class="mute">Carrying ${c.carry.n > 1 ? c.carry.n + " " : ""}${esc(MATERIAL_LABELS[c.carry.k] || c.carry.k)}.</p>`;
  let home = c.home != null ? w.byId[c.home] : null;
  h += `<p class="mute">${home ? "Home: " + esc(structName(w, home).replace(c.name + "'s ", "their ")) : "No home yet"} · ${esc(waterWords(c))}</p>`;
  h += `<h3>Temperament</h3><p>${esc(temperamentWords(c).join(", "))}</p>`;
  let loves = lovesWords(c);
  if (loves.length) h += `<h3>Loves</h3><p>${esc(loves.join(", "))}</p>`;
  let k = knowledgeLines(c, w);
  h += `<h3>What they’ve learned</h3>` + (k.length ? `<ul>${k.map((x) => `<li>${esc(x.text)} <span class="mute">${esc(x.how)}</span></li>`).join("")}</ul>` : `<p class="mute">Nothing settled yet.</p>`);
  let wish = Object.entries(c.desire || {})
    .filter((e) => e[1] > 0.5 && STRUCTURES[e[0]] && !kindComplete(w, e[0], c.id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  if (wish.length) h += `<h3>Wishes</h3><p>${esc(wish.map(([u]) => ({ home: "a better home", store: "a storehouse", crossing: "an easier way across the creek", garden: "a garden", workshop: "a workshop", meeting: "a place to gather", chimes: "something to make music in the rain", lookout: "a high place to look out from", dam: "to slow the creek down and make a marsh" })[u]).join(", "))}</p>`;
  let bonds = bondLines(c, w).slice(0, 10);
  if (bonds.length) h += `<h3>Bonds</h3><ul>${bonds.map((b) => `<li><span class="who" data-who="${b.id}">${esc(b.name)}</span>: ${esc(b.label)}${b.notes.length ? ` <span class="mute">(${esc(b.notes.join("; "))})</span>` : ""}</li>`).join("")}</ul>`;
  let mem = c.mem.slice().reverse().slice(0, 12);
  h += `<h3>Memories</h3>` + (mem.length ? `<ul>${mem.map((m) => `<li>${esc(m.text)} <span class="mute">day ${dayNumber(m.t)}</span></li>`).join("")}</ul>` : `<p class="mute">No memories yet.</p>`);
  let lore = Object.entries(c.lore || {})
    .map(([key, l]) => ({ st: w.stories && w.stories[key], l }))
    .filter((x) => x.st)
    .sort((a, b) => b.st.weight - a.st.weight || b.st.t - a.st.t)
    .slice(0, 10);
  if (lore.length)
    h +=
      `<h3>Stories they tell</h3><ul>` +
      lore
        .map(({ st, l }) => {
          let how = l.first ? "was there" : l.from && (w.byId[l.from] || (w.lineage || {})[l.from]) ? `heard it from ${nameOf(w, l.from)}` : "heard it somewhere",
            off = sameTold(w, st, l.v, st.truth) ? "" : " · not quite what happened";
          return `<li>${esc(storyText(w, st, l.v))} <span class="mute">${esc(how + off)}</span></li>`;
        })
        .join("") +
      `</ul>`;
  let words = Object.keys(c.lex || {})
    .map((d) => [d, favoriteWord(c, d)])
    .filter((e) => e[1])
    .slice(0, 14);
  if (words.length) h += `<h3>Words</h3><p>${words.map(([d, wd]) => `${esc(conceptLabel(w, d))}: <i>${esc(wd)}</i>`).join(" · ")}</p>`;
  return h;
}
