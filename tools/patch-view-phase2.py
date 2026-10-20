# One-time edits to src/view/view.js for Phase 2 (minds and the gift). Kept for the record.
p = 'src/view/view.js'
s = open(p).read()


def rep(old, new):
    global s
    n = s.count(old)
    assert n == 1, (old[:100], n)
    s = s.replace(old, new)


# The found object glints in the grass.
rep('''          if (n.kind === "cairn")
          for (let o = 0; o < n.n; o++) {
            let a = 1.2 - o * 0.12;
            this.setInst(
              "cairn",
              e.cairn++,
              n.x + (hash01(r + o) - 0.5) * 0.05,
              s + 0.07 + o * 0.15,
              n.z + (hash01(r + o + 3) - 0.5) * 0.05,
              hash01(r + o + 5) * 6,
              a,
              hash01(r + o + 7) > 0.5 ? PALETTE.stone : PALETTE.stone2
            );
          }''', '''          if (n.kind === "cairn")
          for (let o = 0; o < n.n; o++) {
            let a = 1.2 - o * 0.12;
            this.setInst(
              "cairn",
              e.cairn++,
              n.x + (hash01(r + o) - 0.5) * 0.05,
              s + 0.07 + o * 0.15,
              n.z + (hash01(r + o + 3) - 0.5) * 0.05,
              hash01(r + o + 5) * 6,
              a,
              hash01(r + o + 7) > 0.5 ? PALETTE.stone : PALETTE.stone2
            );
          } else
          n.kind === "gift" && this.setInst("glowcap", e.glowcap++, n.x, s + 0.1, n.z, r, 1.5, 16768358); // MINDS: a found gift''')

# The gift button in the top bar, and its sheet.
rep('''        e("house", "Village", () => this.open("village")),''', '''        e("house", "Village", () => this.open("village")),
        this.giftBtn = e("gift", "Send a gift", () => this.open("gift")), // MINDS''')
rep('''          if (e === "log") s = this.logHTML();else''', '''          if (e === "log") s = this.logHTML();else
          if (e === "gift") s = this.giftHTML();else''')

# Words: places and the giver have names too.
rep('''              return `<tr><td>${escapeHtml(CONCEPT_LABELS[d] || d)}</td>''', '''              return `<tr><td>${escapeHtml(conceptLabel(e, d))}</td>''')
rep('''            `<tr><td>${escapeHtml(CONCEPT_LABELS[o.concept] || o.concept)}</td>''', '''            `<tr><td>${escapeHtml(conceptLabel(t, o.concept))}</td>''')

# Creature panel: the stories they tell, and what they believe.
rep('''        } else if (a === "words") {
          let c = vocabularySummary(e),''', '''        } else if (a === "stories") {
          l += storiesTabHTML(e, n); // MINDS (src/view/minds-view.js)
        } else if (a === "words") {
          let c = vocabularySummary(e),''')
rep('''          ["memories", "Memories"],
          ["words", "Words"]]''', '''          ["memories", "Memories"],
          ["stories", "Stories"],
          ["words", "Words"]]''')

# Village: stories, places, and village customs and beliefs.
rep('''        } else if (n === "history") {
          let r = t.hist.slice().reverse();''', '''        } else if (n === "stories") {
          s += villageStoriesHTML(t); // MINDS
        } else if (n === "places") {
          s += villagePlacesHTML(t); // MINDS
        } else if (n === "history") {
          let r = t.hist.slice().reverse();''')
rep('''          ["words", "Words"],
          ["customs", "Customs"],
          ["history", "History"]]''', '''          ["words", "Words"],
          ["customs", "Customs"],
          ["stories", "Stories"],
          ["places", "Places"],
          ["history", "History"]]''')
rep('''          '<p class="muted">No customs have taken hold yet. Habits that seem to bring luck can spread from one creature to another.</p>';''', '''          '<p class="muted">No customs have taken hold yet. Habits that seem to bring luck can spread from one creature to another.</p>';
          s = villageCustomsHTML(t) + s; // MINDS: customs of the whole village, and beliefs''')
open(p, 'w').write(s)
print('view patched for phase 2')
