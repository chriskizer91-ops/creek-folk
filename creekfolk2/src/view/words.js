// ==========================================================================
// Plain words about creekfolk: what they're doing, their temperament, what they love,
// what they've learned, their bonds. Carried over from Creekfolk 1's interface
// (src/view/view.js and patches.js there), with readable names; they read a full world
// (a copy from the worker), never the page's drawing copy.
// ==========================================================================

function nameOf(w, id) {
  let c = w.byId[id] || (w.lineage && w.lineage[id]);
  return c ? c.name : "someone";
}
function structName(w, s) {
  if (!s) return "something";
  let who = s.owner && w.byId[s.owner] ? w.byId[s.owner].name + "'s " : "the ",
    label = s.building ? levelDef(s, s.building.level).label : structureLabel(s);
  return who + label;
}
function agoText(sec) {
  if (sec < 45) return "just now";
  if (sec < 3600) return Math.round(sec / 60) + " min ago";
  if (sec < 86400) return Math.round((sec / 3600) * 10) / 10 + " h ago";
  let d = Math.round((sec / 86400) * 10) / 10;
  return d + (d === 1 ? " day ago" : " days ago");
}

var DAM_WORK_TEXT = {
  posts: "Pounding willow posts into the creek bed",
  weave: "Weaving branches between the posts",
  "stone sill": "Setting stones along the foot of the dam",
  "mud face": "Packing mud against the dam",
  cuttings: "Planting willow cuttings along the pond",
  "reed beds": "Planting reeds in the shallows",
};
function jointNames(c, w, a) {
  let j = w.joints[a.joint];
  return (j && nameList(w, j.members.filter((s) => s !== c.id))) || "a friend";
}

// What someone is doing, as a short sentence.
function activityText(c, w) {
  let a = c.act,
    p = c.plan || {};
  if (!a) return "Thinking";
  // Creekfolk 1's later goals (lives)
  let g = p.goal,
    other = p.with && (w.byId[p.with] || (w.lineage && w.lineage[p.with]));
  if (g === "farewell") return a.type === "walk" ? "Walking slowly to a place they love" : "Resting quietly at a place they love, at the end of a long life";
  if (g === "vigil" && other) {
    let leaving = w.byId[p.with] && w.byId[p.with].leaving;
    if (a.type === "walk") return leaving ? `Walking with ${other.name} to the edge of the valley` : `Going to sit with ${other.name}`;
    return leaving ? `Seeing ${other.name} off` : `Sitting with ${other.name}`;
  }
  if (g === "leave") return a.type === "walk" ? "Following the creek downstream, to leave the valley" : "Taking a last look back at the valley";
  let s = p.sid ? w.byId[p.sid] : null,
    mat = p.mat ? MATERIAL_LABELS[p.mat] || p.mat : "";
  switch (a.type) {
    case "walk": {
      if (a.why === "help" || g === "help") return `Hurrying to help ${nameOf(w, p.helping)}`;
      switch (g) {
        case "work":
          return c.carry ? `Carrying ${MATERIAL_LABELS[c.carry.k] || c.carry.k} to ${structName(w, s)}` : mat ? `Fetching ${mat} for ${structName(w, s)}` : `Heading to ${structName(w, s)}`;
        case "deliver":
          return `Carrying ${c.carry ? MATERIAL_LABELS[c.carry.k] : "something"}`;
        case "eat":
          return "Off to find something to eat";
        case "sleep":
          return "Heading off to sleep";
        case "nap":
          return "Looking for a spot to nap";
        case "shelter":
          return a.why === "listen" ? "Going to listen to the rain chimes" : "Hurrying out of the rain";
        case "social":
          return `Going over to ${nameOf(w, p.with)}`;
        case "play":
          return "Off to play";
        case "explore":
          return "Exploring";
        case "pod":
          return "Going to look at a seed pod";
        case "found":
          return "Going to mark out a new project";
        case "forage":
          return "Gathering for the storehouse";
        case "garden":
          return "Off to the garden";
        case "plant":
          return "Looking for a spot to plant a seed";
        case "craft":
          return "Getting materials for the workshop";
        case "share":
          return "Bringing food to a hungry friend";
        case "rest":
          return "Finding a nice spot to sit";
        default:
          return "Wandering";
      }
    }
    case "pick":
      return { bush: "Picking berries", tree: "Picking up a fallen branch", reeds: "Cutting reeds", stones: "Choosing stones", clay: "Digging clay", glowcap: "Picking glowing mushrooms" }[a.what] || "Gathering";
    case "dig":
      return "Scooping up mud from the bank";
    case "take":
      return "Taking something from the storehouse";
    case "stash":
      return "Putting things away in the storehouse";
    case "deposit":
      return s ? `Adding to ${structName(w, s)}` : "Setting things down";
    case "labor": {
      let st = s && s.building ? currentStage(s) : null;
      if (s && s.kind === "dam" && st && DAM_WORK_TEXT[st.name]) return DAM_WORK_TEXT[st.name];
      if (a.what === "tiles") return "Shaping clay into roof tiles";
      if (a.what === "guard") return "Ringing a sapling with stones";
      if (a.what === "repair") {
        let r = w.byId[a.sid];
        return r ? `Mending ${structName(w, { ...r, building: null })}` : "Mending something";
      }
      return s ? `Working on ${structName(w, s)}${st ? " (" + st.name + ")" : ""}` : "Working";
    }
    case "strain":
      return "Straining at something far too heavy";
    case "heavyj": {
      let o = jointNames(c, w, a),
        d = a.obj && w.byId[a.obj.id];
      return d && d.kind === "dam" && d.building ? (d.building.level === 0 ? `Pounding posts into the creek bed with ${o}` : `Rolling stones into place along the dam with ${o}`) : `Heaving together with ${o} on ${structName(w, d)}`;
    }
    case "lift":
      return `Lifting a seed pod with ${jointNames(c, w, a)}`;
    case "wait":
      return a.obj && a.obj.t === "pod" ? "Waiting beside the pod for help" : a.obj ? "Waiting for a helper" : "Waiting";
    case "call":
      return `Calling to ${nameOf(w, a.to)}: “${(a.words || []).join(" ")}”`;
    case "look":
      return a.icon === "think" ? "Thinking it over" : "Looking around";
    case "gesture":
      return { spin: "Spinning in a little circle", clap: "Clapping twice", tap: "Tapping the ground twice", ears: "Flicking their ears", hop: "Doing a little hop" }[a.g] || "Fidgeting";
    case "eat":
      return `Eating ${FOODS[a.food] ? FOODS[a.food].label : "something"}`;
    case "sleep":
      return "Asleep";
    case "nap":
      return "Taking a nap";
    case "huddle":
      return "Waiting out the rain";
    case "watch":
      return a.pond ? "Sitting by the pond, watching the still water" : "Watching leaves drift down the creek";
    case "play":
      return { stack: "Stacking stones into a little tower", mudpie: "Making mud pies", drum: "Drumming on a hollow log", collect: "Hunting for pretty pebbles", perch: "Sitting up on a boulder, looking out", dance: "Dancing in the rain", chaseleaf: "Chasing leaves along the bank", admire: "Admiring something growing" }[a.kind] || "Playing";
    case "chat":
      return `Chatting with ${nameOf(w, a.lookId)}`;
    case "play2":
      return `Playing chase with ${nameOf(w, a.lookId)}`;
    case "groom":
      return `Grooming ${nameOf(w, a.lookId)}`;
    case "mark":
      return "Marking out a spot for a new project";
    case "plant":
      return "Planting a seed";
    case "tend":
      return "Watering the garden";
    case "harvest":
      return "Harvesting the garden";
    case "sow":
      return "Sowing seeds";
    case "craft":
      return `Making ${{ stick: "a digging stick", basket: "a basket", mallet: "a mallet" }[a.tool] || "a tool"}`;
    case "give":
      return `Sharing food with ${nameOf(w, a.to)}`;
    case "sit":
      return "Sitting quietly, watching the world";
    case "journey":
      return "Away, up the creek";
    default:
      return "Standing about";
  }
}

var TEMPERAMENT_WORDS = {
  curiosity: ["curious", "not very curious"],
  caution: ["cautious", "bold"],
  sociability: ["sociable", "happy alone"],
  patience: ["patient", "impatient"],
  persistence: ["determined", "easily distracted"],
  activity: ["energetic", "easygoing"],
  generosity: ["generous", "not much of a sharer"],
};
function temperamentWords(c) {
  let out = [];
  for (let k in TEMPERAMENT_WORDS) {
    let v = c.temp[k];
    if (v > 0.66) out.push(TEMPERAMENT_WORDS[k][0]);
    else if (v < 0.34) out.push(TEMPERAMENT_WORDS[k][1]);
  }
  return out.length ? out : ["even-tempered"];
}
function lovesWords(c) {
  return Object.entries(c.interests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .filter((e) => e[1] > 0.35)
    .map((e) => INTEREST_LABELS[e[0]]);
}
function waterWords(c) {
  let f = c.fearWater;
  return f > 0.7 ? "Very frightened of the creek" : f > 0.45 ? "Nervous around the creek" : f > 0.2 ? "A little wary of the creek" : "At ease by the creek";
}
function learnedHow(w, q) {
  if (!q || !q.src || q.src === "self") return "from experience";
  let id = +String(q.src).split(":")[1];
  return w.byId[id] ? `learned by watching ${w.byId[id].name}` : "from watching others";
}
function knowledgeLines(c, w) {
  let out = [],
    Q = c.Q,
    add = (text, k) => out.push({ text, how: k ? learnedHow(w, Q[k]) : "" });
  if (qCount(c, "pod|solo") > 0.3 && qValue(c, "pod|solo") < 0.35) add("Seed pods are too heavy to lift alone.", "pod|solo");
  if (qCount(c, "pod|duo") > 0.3 && qValue(c, "pod|duo") > 0.6) add("Two can lift a seed pod together.", "pod|duo");
  if (qCount(c, "pod|duo") > 0.3 && qValue(c, "pod|duo") < 0.4) add("Some pods are too heavy even for two.", "pod|duo");
  if (qCount(c, "pod|trio") > 0.3 && qValue(c, "pod|trio") > 0.6) add("Three can lift the heaviest pods.", "pod|trio");
  if (qCount(c, "heavy|solo") > 0.3 && qValue(c, "heavy|solo") < 0.35) add("Heavy building needs a partner.", "heavy|solo");
  if (qCount(c, "heavy|duo") > 0.5 && qValue(c, "heavy|duo") > 0.6) add("Heavy work goes well with company.", "heavy|duo");
  if (qCount(c, "help|pod") > 0.8) add(qValue(c, "help|pod") > 0.55 ? "Helping with pods pays off." : "Helping with pods isn’t always worth it.", "help|pod");
  if (qCount(c, "wade") > 1) add(qValue(c, "wade") < 0.35 ? "Wading the creek is dangerous." : qValue(c, "wade") > 0.55 ? "Wading the creek is fine." : "Wading is a bit risky.", "wade");
  let loves = [],
    not = [];
  for (let f in FOODS) {
    let q = Q["eat|" + f];
    if (q) q.v > 0.68 ? loves.push(FOODS[f].label) : q.v < 0.35 && not.push(FOODS[f].label);
  }
  if (loves.length) out.push({ text: `Loves ${loves.join(", ")}.`, how: "from tasting" });
  if (not.length) out.push({ text: `Doesn’t care for ${not.join(", ")}.`, how: "from tasting" });
  let KNOW = {
    mud: "Wet mud dries hard enough to build with.",
    planting: "Seeds in the ground grow into plants.",
    clay: "Clay across the creek can be shaped.",
    glowcap: "Some mushrooms glow at night.",
    tools: "Tools make work easier.",
    dams: "Branches across the creek slow the water and make the ground wet and green.",
    downstream: "Dams are built from the bottom of the creek up: a dam holds its pond only when the water below it stands against its foot.",
  };
  for (let k in KNOW) if (c.know[k]) out.push({ text: KNOW[k], how: "since day " + dayNumber(c.know[k]) });
  for (let r of ritualList(c))
    out.push({
      text: `Always ${GESTURE_DESC[r.g].trim()} before ${RITUAL_TASKS[r.task]} — it seems to help.`,
      how: r.from && w.byId[r.from] ? `picked up from ${w.byId[r.from].name}` : "a habit of their own",
    });
  return out;
}
function bondLines(c, w) {
  let out = [];
  for (let o of w.creatures) {
    if (o === c || o.visitor) continue;
    let r = c.rel[o.id];
    if (!r) {
      out.push({ id: o.id, name: o.name, label: "barely knows", notes: [], warmth: 0 });
      continue;
    }
    let notes = [];
    if (r.asked >= 2) notes.push(helpRate(r) > 0.65 ? `usually helps when asked (${r.helped}/${r.asked})` : helpRate(r) < 0.4 ? `rarely helps when asked (${r.helped}/${r.asked})` : `sometimes helps (${r.helped}/${r.asked})`);
    if (r.gotShare + r.gotLittle >= 1) notes.push(shareRate(r) > 0.6 ? "shares fairly" : "keeps the bigger share");
    if (r.inv >= 3) notes.push(r.acc / r.inv > 0.6 ? "usually happy to spend time together" : "often turns down invitations");
    if (r.told >= 2) notes.push(honestyRate(r) > 0.65 ? "tells the truth about where food is" : "their tips about food don’t pan out");
    if (r.annoy > 0.35) notes.push("a bit annoyed with them lately");
    let x = r.warmth,
      label = x > 0.65 ? "close friend" : x > 0.35 ? "friend" : x > 0.1 ? "friendly" : x < -0.2 ? "wary of" : "acquaintance";
    if (c.partner === o.id) label = "partner";
    else if ((c.parents || []).includes(o.id)) label = "parent";
    else if ((c.children || []).includes(o.id)) label = "child";
    out.push({ id: o.id, name: o.name, label, notes, warmth: x + (label === "partner" ? 2 : label === "parent" || label === "child" ? 1 : 0) });
  }
  return out.sort((a, b) => b.warmth - a.warmth);
}
function knownForLines(c) {
  let k = c.counts;
  return [
    ["helping lift pods", k.helps, 4],
    ["opening pods", k.pods, 6],
    ["wading the creek", k.wades, 15],
    ["building", Math.round(k.labor / 600), 5],
    ["chatting", k.chats, 25],
    ["planting trees", k.plants, 2],
    ["sharing food", k.gifts, 2],
    ["stocking the storehouse", Math.round((k.stocked || 0) / 10), 3],
    ["exploring", Math.round(k.explore / 5), 6],
    ["making tools", k.crafted, 2],
  ]
    .filter((e) => e[1] >= e[2])
    .sort((a, b) => b[1] / b[2] - a[1] / a[2])
    .slice(0, 2)
    .map((e) => e[0]);
}
// "grown, 12 days old · child of Moss and Pip · with Wren · 2 children"
function lifeLine(w, c) {
  let a = ageDays(w, c),
    st = stageOf(w, c),
    days = a < 1 ? "born today" : `${Math.floor(a)} ${Math.floor(a) === 1 ? "day" : "days"} old`,
    who = { child: "a child", adult: "grown", elder: "a wise elder" }[st],
    bits = [`${who}, ${days}`],
    ps = (c.parents || []).map((id) => nameOf(w, id)).filter((n) => n !== "someone");
  if (ps.length) bits.push(`child of ${ps.join(" and ")}`);
  else if (c.founder) bits.push("one of the eight who came down the creek");
  else if (c.traveler) bits.push("came up the creek from downstream");
  if (c.partner && w.byId[c.partner]) bits.push(`with ${w.byId[c.partner].name}`);
  let kids = (c.children || []).length;
  if (kids) bits.push(`${kids} ${kids === 1 ? "child" : "children"}`);
  return bits.join(" · ");
}
