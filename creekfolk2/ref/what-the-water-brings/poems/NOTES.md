# Poem texts: verification notes

All texts are in `texts.json`, next to this file. Each entry has its source edition, the URLs it was checked against, a `verified_two_sources` flag and per-text notes. In `lines`, `""` marks a stanza break. `excerpt` is `[first, last]` as 0-based indices into `lines`, inclusive.

## How the texts were checked
- The shell cannot reach Gutenberg, Wikisource or sacred-texts, so every text came through WebFetch. WebFetch answers through a small model that will quote at most about 125 characters at a time, so each poem was pulled one numbered line per row. Where a site refused even that (it treats Boethius's verse as "song lyrics"), my transcription was checked word by word and comma by comma against the page instead.
- WebFetch reads only about the first 100–115k characters of a page. Long single-file books (Gutenberg Boethius, Conington, Burnet, Mackail, Giles's Chuang Tzŭ, Thoreau's *Week*) cut off before the passage needed, so per-chapter copies were used instead (Wikisource, Perseus, Monadnock, spbu.ru PDFs, sacred-texts, Fordham).
- Apostrophes and quotation marks are written as curly ’ ‘ “ ” throughout, to match printed books. Some web copies use straight quotes.

## Solid (two independent copies agree, or differences resolved)
| stop | text | edition used |
|---|---|---|
| bench | Thoreau, "Low-anchored cloud" | *A Week*, 1849 ("Tuesday"). The 1895 *Poems of Nature* text, which gives it the title "Mist", differs slightly (see notes). |
| rock | Hopkins, "Inversnaid" | Bridges ed., 1918, no. 33. Check one word ("fáwn") against a scan. |
| spring | Horace III.13, Conington | 1863 translation; Wikisource and Perseus (Bell 1882) |
| lookout | T’ao Ch’ien, "I built my hut…" | Waley, *170 Chinese Poems*, 1918, no. 7 |
| oak | Whitman, "I Saw in Louisiana…" | 1891-92 text (= 1881). The 1867 text is included as an alternate. |
| pond | Bryant, "To a Waterfowl" | 1854 Authorized Edition. The 1880 Household variants are listed. |
| bridge | Heraclitus, 9 fragments | Burnet, 2nd ed. 1908 (Bywater numbers) |
| crossing | Gilgamish XI, the Flood | R. Campbell Thompson, 1928. Every line matched in two copies. |
| trestle | Boethius III m.9 | H. R. James, 1897 (Song IX, "Invocation"). |
| ending | Shelley, "To Stella" (From the Greek of Plato) | *Poetical Works*, 1839 |
| card-pine | Plato (attrib.), Anth. XVI.13 | Paton, Loeb 1916-18 (prose) |
| line-a, line-b | Laozi ch. 8, ch. 78 | Legge, SBE 39, 1891 |
| line-c | Zhuangzi XVII opening | Legge, SBE 39, 1891 |
| line-g | Gilgamish and the serpent | Thompson, 1928 |

## Doubts and corrections
1. **Boethius, first line.** The opening the brief gives, "O Thou who dost by everlasting reason rule", is not in H. R. James's 1897 translation. James's Song IX opens "Maker of earth and sky, from age to age / Who rul’st the world by reason…". Use James's line. One source also shows a stanza break after line 11, which is probably a page-break artefact.
2. **Shelley and the "stars" epigram.** I could not confirm that Shelley translated "You gaze at the stars, my Star…". Hutchinson's edition has only four Plato-derived epigrams (To Stella, Kissing Helena, Spirit of Plato, Circumstance). Wikiquote credits a five-line "Aster" ("Thou gazest on the stars: / Would I might be, / O star of mine, the skies / With myriad eyes / To gaze on thee.") to Shelley's 1839 *Poetical Works*, but I found no primary copy. Don't print it as Shelley's without checking a facsimile. The card therefore uses **Rennell Rodd, "Starworship" (1916)**. That text comes from one source only, since the second copy is probably built from the same Gutenberg file. The Mackail (1890) and Paton (1917) prose versions are recorded in the notes, but neither was fetched from a primary copy.
3. **Mackail, Plato XVI.13.** I could not verify Mackail's wording: Gutenberg #2378 runs out within the Introduction before the epigrams. Paton's version is used instead.
4. **Legge's metrical "Chien Chia" (1876).** The only copy is sacred-texts plus its mirror, so it is not two independent sources. The wording is clean and internally consistent.
5. **Hopkins, "fáwn-fróth".** Two copies show "fáawn" (an encoding artefact), and one shows "fáwn". I used "fáwn".
6. **Bryant.** Bryant revised this poem: "darkly painted on" (1854) became "darkly seen against" (1880), and "hath sunk" became "has sunk". I chose 1854. Change it if you would rather use the poet's final text.
7. **Gilgamish brackets.** Thompson marks restorations with half-brackets ⌜ ⌝, kept here. sacred-texts' OCR mangles them. One line of the passage is Thompson's editorial note "(Four lines mutilated…)", shown as a stanza break. **Skin-shedding:** the 1928 text does **not** mention the serpent sloughing its skin, so the game shouldn't put that in Thompson's mouth.
8. **Heraclitus fr. 20 (ever-living fire)** is left out because the editions differ ("with measures kindling" in 1908 against "with measures of it kindling" in the spbu copy, probably 1920). Both readings are in the notes.
9. **Xenophanes** (line-f): Burnet §59, from a single source (spbu PDF; Burnet writes "Malta" and "seaweed"). MacMahon (Ante-Nicene Fathers) and Fairbanks (1898) versions are given as alternates.
10. **Empedocles** (line-e): the two copies disagree on one comma ("Aidoneus, and Nestis" in 1908). I kept the comma.
11. **Zhuangzi and the fish** (line-d): Legge's version from one source. A Lionel Giles (1906) version is given in the notes. Herbert Giles 1889 could not be reached.
12. **Thoreau.** "Mist" is the 1895 editors' title. In the *Week* the poem has no title, and its punctuation differs slightly: "dream drapery" / "rivers," / "fields!".
13. **Not attempted or not found:** Chamberlain's 1902 Bashō haiku (I found no page quoting his renderings); Jennings 1891 and Allen 1891 Shijing versions; Li Bai alternate (not needed); Burnet's 1892 1st edition.

## Pages the fetch tool blocked or could not open
- `en.wikisource.org` pages for *A Week* (Tuesday), the Hopkins poem and the James Boethius "Prayer" page returned not-found.
- `en.m.wikisource.org/.../Tuesday`, `gutenberg.org/ebooks/4232.txt.utf-8` and the `rachel.worldpossible.org` Wikisource mirror pages were refused, because the permission prompt timed out.
- `neonvagabond.xyz/.../bop132.htm` was refused once and later loaded.
- `ctext.org` blocks automated fetching.
- `standardebooks.org` blocks robots.
