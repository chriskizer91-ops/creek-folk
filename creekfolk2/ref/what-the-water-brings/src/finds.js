/* PKWaterFinds: everything the water brought, the poem stops, and the little props for them (What the Water Brings).
   Forty-eight finds in eight collections (the shadow boxes), the five solids, and three tools.
   wave 1: lying out the morning after the first storm;  wave 2: brought down by the second storm;  night: only seen by starlight.
   Names, tags and captions are written for the game, for the family to rewrite. The poems are public domain, chosen for their places;
   a poem of his own (only with permission) can replace one. A POEMS entry with no lines shows ruled blank lines kept for a poem. */
(function (global) {
  'use strict';
  var THREE = global.THREE;
  var F = {};
  global.PKWaterFinds = F;

  // the shadow boxes on the studio wall: title, a line of the commonplace book (public domain, for the family to change), the gallery card
  F.COLLS = [
    { id: 'round', title: 'Things the Water Rounded', line: 'There is nothing in the world more soft and weak than water, and yet for attacking things that are firm and strong there is nothing that can take precedence of it.', by: 'Laozi, Tao Te Ching 78 (tr. James Legge)' },
    { id: 'rust', title: 'Rust', line: 'Lay not up for yourselves treasures upon earth, where moth and rust doth corrupt.', by: 'Matthew 6:19' },
    { id: 'bones', title: 'Bones and Feathers', line: '\u201cHope\u201d is the thing with feathers.', by: 'Emily Dickinson' },
    { id: 'sea', title: 'The Old Sea', line: 'Shells are found in midland districts and on hills, and he says that in the quarries at Syracuse has been found the imprint of a fish and of seaweed.', by: 'Xenophanes, as told by Hippolytus (tr. John Burnet)' },
    { id: 'toys', title: 'Lost Toys', line: 'When I was a child, I spake as a child.', by: '1 Corinthians 13:11' },
    { id: 'glass', title: 'Glass and Light', line: 'Tell all the truth but tell it slant.', by: 'Emily Dickinson' },
    { id: 'pages', title: 'Pages', line: 'Books are the treasured wealth of the world and the fit inheritance of generations and nations.', by: 'Henry David Thoreau, Walden' },
    { id: 'wood', title: 'Seeds and Wood', line: 'In Wildness is the preservation of the World.', by: 'Henry David Thoreau, Walking' },
    { id: 'solids', title: 'The Five Solids', line: 'Wonder is the feeling of a philosopher, and philosophy begins in wonder.', by: 'Plato, Theaetetus (Jowett)' }
  ];
  F.collById = {}; F.COLLS.forEach(function (c) { F.collById[c.id] = c; });

  // where: a spot the world resolves (see main.js); hint: for the journal; tag: the label; caption: what the page says when he picks it up
  F.FINDS = [
    // ---- Things the Water Rounded
    { id: 'glassG', coll: 'round', name: 'Green creek glass', wave: 1, where: { bank: 'main', x: -72, z: -9, f: 0.55, side: 1 }, hint: 'on the gravel bar below the trailhead bend', tag: 'Bottle glass, frosted by the creek.', caption: 'Once a bottle, now a pebble with a past. The creek is patient with sharp things.' },
    { id: 'marble', coll: 'round', name: 'Clay marble', wave: 1, where: { bank: 'dry', x: -15, z: -18, f: -0.3 }, hint: 'in the Dry Fork bed, near its mouth', tag: 'Fired clay, rolled by hand, perhaps 1920.', caption: 'Somebody lost at marbles here, a long time ago. The creek kept score.' },
    { id: 'brick', coll: 'round', name: 'Brick, worn round', wave: 2, where: { bank: 'main', x: 64, z: 4, f: 0.7, side: 1 }, hint: 'on the wrack line above the low-water crossing', tag: 'Red brick; the maker’s stamp worn away.', caption: 'A brick that has forgotten it was ever square.' },
    { id: 'quartz', coll: 'round', name: 'White quartz pebble', wave: 1, where: { bank: 'teal', x: 36.4, z: 40, f: 0.25 }, hint: 'in the shallows of Teal Branch', tag: 'Milky quartz.', caption: 'It holds the light the way a breath is held.' },
    { id: 'golf', coll: 'round', name: 'Golf ball', wave: 2, where: { pond: 1.06, a: 2.2 }, hint: 'in the reeds at the edge of the stock pond', tag: 'Rubber core, the dimples nearly gone.', caption: 'No golf course for miles. Somebody hit a very ambitious shot.' },
    { id: 'knob', coll: 'round', name: 'Porcelain doorknob', wave: 1, where: { bank: 'main', x: -88, z: -4, f: 0.6, side: 1 }, hint: 'on the bar below the studio', tag: 'White porcelain; the spindle rusted off.', caption: 'A door to nowhere in particular. He tries it anyway, out of courtesy.' },
    // ---- Rust
    { id: 'key', coll: 'rust', name: 'Skeleton key', wave: 1, where: { near: 'bridge', dx: 1.6, dz: 2.6 }, hint: 'under the footbridge', tag: 'Iron; the bit worn thin.', caption: 'It opens something. That is all a key ever promises.' },
    { id: 'horseshoe', coll: 'rust', name: 'Horseshoe', wave: 1, where: { near: 'windmill', dx: -2.6, dz: 2.4 }, hint: 'at the foot of the windmill', tag: 'Iron, six nail holes.', caption: 'Hung one way it holds luck in. Lying in the mud, it has held a little mud.' },
    { id: 'spike', coll: 'rust', name: 'Railroad spike', wave: 1, where: { near: 'trestle', dx: -3.2, dz: 11.5 }, hint: 'beside the old railroad, south of the trestle', tag: 'Iron, hand forged.', caption: 'Driven in about a century ago, and pried out by nobody in particular.' },
    { id: 'cap', coll: 'rust', name: 'Bottle cap', wave: 2, where: { near: 'road', dx: -2.4, dz: 5.4 }, hint: 'where the county road comes down to the water', tag: 'Tin; the paint long gone.', caption: 'Somebody’s root beer, 1962, give or take.' },
    { id: 'car', coll: 'rust', name: 'Tin toy car', wave: 2, where: { near: 'road', dx: 4.6, dz: -1.4 }, hint: 'at the mouth of the culverts', tag: 'Pressed tin, one wheel left.', caption: 'It has been to the end of the culvert and back, which is further than most cars go.' },
    { id: 'spoon', coll: 'rust', name: 'Rusted spoon', wave: 1, where: { bank: 'main', x: -60, z: -5, f: 0.8, side: 1 }, hint: 'on the bank of the Heron Pool', tag: 'Iron, bent at the neck.', caption: 'For soup, once. Now for nothing at all, which is its own kind of rest.' },
    // ---- Bones and Feathers
    { id: 'feather', coll: 'bones', name: 'Heron feather', wave: 1, where: { bank: 'main', x: -63, z: -6, f: 0.75, side: -1 }, hint: 'on the far bank of the Heron Pool', tag: 'Great blue heron, a covert feather.', caption: 'A long grey feather. The heron has more, and does not seem to miss this one.' },
    { id: 'hawk', coll: 'bones', name: 'Hawk feather', wave: 1, where: { near: 'lookout', dx: 3.6, dz: -1.6 }, hint: 'up at the lookout', tag: 'Red-tailed hawk, a tail feather.', caption: 'From up here the hawk sees everything. It dropped this to prove it.' },
    { id: 'shell', coll: 'bones', name: 'Turtle shell', wave: 1, where: { pond: 1.12, a: -0.4 }, hint: 'on the bank of the stock pond', tag: 'Red-eared slider, long empty.', caption: 'A house, outgrown in the only way a turtle can outgrow one.' },
    { id: 'snakeskin', coll: 'bones', name: 'Snake skin', wave: 2, where: { near: 'cave', dx: -6.5, dz: 1.8 }, hint: 'among the rocks at the foot of the bluff, west of the cave', tag: 'Rat snake, shed whole, inside out.', caption: 'A whole snake’s worth of skin, and no snake. Even snakes start over.' },
    { id: 'vertebra', coll: 'bones', name: 'Deer vertebra', wave: 1, where: { xz: [10, 44] }, hint: 'in the woods at the foot of the south hill', tag: 'White-tailed deer.', caption: 'One bone of a back that carried a deer a long way.' },
    { id: 'skull', coll: 'bones', name: 'Bird skull', wave: 2, where: { xz: [-2, -36.5] }, hint: 'in the cedars on top of the bluff', tag: 'Small; probably a cardinal.', caption: 'As light as a thought, and about the same shape.' },
    // ---- The Old Sea
    { id: 'ammonite', coll: 'sea', name: 'Ammonite', wave: 1, where: { near: 'pool0', dx: 1.6, dz: 0.8 }, hint: 'by the pool under the Dry Falls', tag: 'Cretaceous, about 95 million years.', caption: 'A stone spiral from the days when all of Texas was sea floor. It has kept its shape a long time.' },
    { id: 'tooth', coll: 'sea', name: 'Shark tooth', wave: 2, where: { bank: 'dry', x: -16, z: -27, f: 0.1 }, hint: 'in the gorge of the Dry Fork', tag: 'Cretaceous shark, about 90 million years.', caption: 'Texas was a warm sea then. The shark did not know about Texas.' },
    { id: 'oyster', coll: 'sea', name: 'Fossil oyster', wave: 1, where: { bank: 'dry', x: -14.6, z: -12, f: 0.35 }, hint: 'in the Dry Fork bed, near King’s Creek', tag: 'Texigryphaea, the “devil’s toenail”.', caption: 'The old people called it the devil’s toenail. The devil has never been seen to miss it.' },
    { id: 'urchin', coll: 'sea', name: 'Fossil sea urchin', wave: 1, where: { bank: 'dry', x: -17, z: -34, f: 0.2 }, hint: 'up the Dry Fork gorge', tag: 'A heart urchin, five-petalled.', caption: 'A five-petalled flower in stone, from the bottom of the sea.' },
    { id: 'clam', coll: 'sea', name: 'Fossil clam', wave: 2, where: { bank: 'main', x: -34, z: -6, f: 0.5 }, hint: 'below the little falls on King’s Creek', tag: 'Inoceramus, a piece of a giant clam.', caption: 'A piece of a clam as big as a hubcap. The rest of it is somewhere under the county.' },
    { id: 'fishbone', coll: 'sea', name: 'Fossil fish bone', wave: 1, where: { bank: 'dry', x: -12.8, z: -56, f: 0.3 }, hint: 'in the Dry Fork above the falls', tag: 'A fish vertebra, turned to stone.', caption: 'A fish that swam over this exact spot, when the spot was ninety feet down.' },
    // ---- Lost Toys
    { id: 'soldier', coll: 'toys', name: 'Tin soldier', wave: 1, where: { near: 'stones', dx: 1.4, dz: 2.6 }, hint: 'by the stepping stones', tag: 'Lead, the paint mostly gone.', caption: 'He has held his post through every flood. Nobody told him the war was over.' },
    { id: 'doll', coll: 'toys', name: 'Doll’s hand', wave: 2, where: { bank: 'main', x: 47, z: 7, f: 0.6, side: 1 }, hint: 'on the bar beside the Blue Hole', tag: 'Bisque porcelain.', caption: 'Waving, or reaching. It is hard to say which, and perhaps it does not matter.' },
    { id: 'duck', coll: 'toys', name: 'Rubber duck', wave: 2, where: { near: 'road', dx: 4.4, dz: 2.2 }, hint: 'caught below the low-water crossing', tag: 'Yellow rubber, sun-faded.', caption: 'It has come a long way down a lot of water, and does not look worried.' },
    { id: 'domino', coll: 'toys', name: 'Domino', wave: 1, where: { near: 'bench', dx: 1.3, dz: 0.6 }, hint: 'by the bench at the trailhead', tag: 'Double five, bone and ebony.', caption: 'Double five. He looks for the rest of the set, briefly, and then lets it go.' },
    { id: 'dino', coll: 'toys', name: 'Toy dinosaur', wave: 1, where: { bank: 'teal', x: 38, z: 30, f: 0.6 }, hint: 'by the little fall on Teal Branch', tag: 'Green plastic: a stegosaurus.', caption: 'A stegosaurus in a creek older than stegosauruses. It seems to know.' },
    { id: 'die', coll: 'toys', name: 'Six-sided die', wave: 1, where: { xz: [-44, 30] }, hint: 'in the meadow east of the pond', tag: 'Bone, worn soft at the corners.', caption: 'Six faces. He thinks of the icosahedron, which has twenty, and so has more to say.' },
    // ---- Glass and Light
    { id: 'bottle', coll: 'glass', name: 'Bottle with a tiny king', wave: 1, where: { bank: 'main', x: 53, z: 4, f: 0.5, side: -1 }, hint: 'on the far side of the Blue Hole', tag: 'Clear glass, cork stopper, one small king.', caption: 'A bottle with a very small king inside. He looks content. Perhaps that is the trick.' },
    { id: 'medicine', coll: 'glass', name: 'Blue medicine bottle', wave: 1, where: { near: 'road', dx: -4.6, dz: -2.6 }, hint: 'by the culverts under the county road', tag: 'Cobalt glass, a druggist’s bottle.', caption: 'Cobalt blue, the colour druggists chose so nobody would mistake it for anything else.' },
    { id: 'tealglass', coll: 'glass', name: 'Teal glass', wave: 2, where: { bank: 'teal', x: 37.2, z: 8, f: 0.4 }, hint: 'where Teal Branch meets King’s Creek', tag: 'Old glass, a deep teal. Rare.', caption: 'The colour of the branch, the colour of the duck: a colour with a name in it.' },
    { id: 'insulator', coll: 'glass', name: 'Glass insulator', wave: 1, where: { near: 'trestle', dx: 3.4, dz: -16 }, hint: 'by the railroad, north of the trestle', tag: 'Aqua glass, from the old telegraph line.', caption: 'It carried messages once, without ever reading them. A discreet object.' },
    { id: 'crystal', coll: 'glass', name: 'Chandelier crystal', wave: 2, where: { near: 'lookout', dx: -4.6, dz: -2.6 }, hint: 'on the bluff top by the lookout', tag: 'Cut glass, a teardrop.', caption: 'It throws small rainbows on his sleeve. Nobody asked it to.' },
    { id: 'amber', coll: 'glass', name: 'Amber bottle', wave: 1, where: { pond: 1.05, a: 1.2 }, hint: 'in the reeds of the stock pond', tag: 'Brown glass, the label long gone.', caption: 'A bottle the colour of strong tea, and of the pond at evening.' },
    // ---- Pages
    { id: 'walden', coll: 'pages', name: 'A copy of Walden', wave: 1, where: { near: 'oak', dx: -1.2, dz: 1.3 }, hint: 'under the old oak by the trestle', tag: 'Paperback, swollen with creek water.', caption: 'Somebody came here to read, and forgot to go home.' },
    { id: 'postcard', coll: 'pages', name: 'Postcard', wave: 1, where: { near: 'studio', dx: 3.6, dz: 3.0 }, hint: 'blown against the studio', tag: 'A postcard of the Gulf; the message washed away.', caption: 'Wish you were here, presumably. The water kept the rest.' },
    { id: 'card', coll: 'pages', name: 'Library card', wave: 2, where: { near: 'cave', dx: 1.3, dz: -0.9 }, hint: 'in the cave under the bluff', tag: 'Long overdue.', caption: 'Somewhere a librarian is still waiting, kindly.' },
    { id: 'dictpage', coll: 'pages', name: 'Dictionary page', wave: 2, where: { xz: [79, 36] }, hint: 'caught in the grass by the county road', tag: 'A page from W to Wh, with “wonder” circled.', caption: 'Somebody circled “wonder”. He agrees with the choice.' },
    { id: 'letter', coll: 'pages', name: 'Letter in a bottle', wave: 2, where: { bank: 'main', x: 100, z: 12, f: 0.6, side: 1 }, hint: 'on the bank below the trestle', tag: 'A letter, too faded to read.', caption: 'He does not try to read it. Some letters are for the reading, and some only for the sending.' },
    { id: 'pencil', coll: 'pages', name: 'Pencil stub', wave: 1, where: { near: 'springpoem', dx: 0.8, dz: -0.9 }, hint: 'at the spring, by the poem stop', tag: 'Cedar, chewed at the end.', caption: 'Someone sat here and wrote something down. The pencil stayed for the next one.' },
    // ---- Seeds and Wood
    { id: 'bowl', coll: 'wood', name: 'Wooden bowl', wave: 1, where: { bank: 'main', x: -80, z: -4, f: 0.5, side: 1 }, hint: 'on a gravel bar below the trailhead', tag: 'Turned wood, worn smooth.', caption: 'Just the right size to hold a question.' },
    { id: 'sycball', coll: 'wood', name: 'Sycamore ball', wave: 1, where: { tree: 'syc', x: 14, z: 6 }, hint: 'under a sycamore by the footbridge', tag: 'The seed ball of an American sycamore.', caption: 'A small round world, packed with tomorrows.' },
    { id: 'horseapple', coll: 'wood', name: 'Horse apple', wave: 1, where: { xz: [-20, 34] }, hint: 'out in the south meadow', tag: 'The fruit of the bois d’arc.', caption: 'Nothing eats it, and nothing much can. It is green and lumpy and entirely itself.' },
    { id: 'pecan', coll: 'wood', name: 'Pecan', wave: 1, where: { tree: 'pecan', x: -76, z: 14 }, hint: 'under a pecan near the pond path', tag: 'The state tree’s nut.', caption: 'The state tree of Texas, and the squirrels’ business.' },
    { id: 'acorn', coll: 'wood', name: 'Acorn cap', wave: 2, where: { tree: 'oak', x: 20, z: 52 }, hint: 'under an oak on the south hill', tag: 'A bur oak cap, empty.', caption: 'A little cap without its acorn. The acorn has gone off to be an oak.' },
    { id: 'drift', coll: 'wood', name: 'Driftwood twist', wave: 2, where: { bank: 'main', x: 84, z: 10, f: 0.85, side: -1 }, hint: 'on the wrack line of the lower creek', tag: 'Cedar, turned by water.', caption: 'The water carved it slowly, without a plan. It belongs on the wall.' },
    // ---- The Five Solids
    { id: 'icosa', coll: 'solids', name: 'Icosahedron', element: 'water', wave: 1, deep: true, where: { bank: 'main', x: 50, z: 6, f: -0.35, side: -1 }, hint: 'on a ledge in the Blue Hole (too deep without waders)', tag: 'Twenty faces. Plato’s water.', caption: 'Twenty faces, and not one of them pretends to be round. Plato built water out of these.' },
    { id: 'octa', coll: 'solids', name: 'Octahedron', element: 'air', wave: 1, where: { near: 'lookout', dx: 1.4, dz: 1.2 }, hint: 'up where the wind is, at the lookout', tag: 'Eight faces. Plato’s air.', caption: 'Found where the wind is. Eight faces, and all of them looking up.' },
    { id: 'cube', coll: 'solids', name: 'Pyrite cube', element: 'earth', wave: 2, where: { bank: 'dry', x: -15.4, z: -38.5, f: 0.55, side: 1 }, hint: 'in the black shale of the Dry Fork gorge, once the flood has cut the bank', tag: 'Pyrite grows in cubes. Plato’s earth.', caption: 'Fool’s gold, the miners said. But nobody who found a perfect cube in the mud was a fool.' },
    { id: 'tetra', coll: 'solids', name: 'Tetrahedron', element: 'fire', wave: 2, where: { near: 'lightning', dx: 1.0, dz: 1.2 }, hint: 'where the lightning struck, after the storm', tag: 'Four faces. Plato’s fire.', caption: 'Four faces, warm still from the lightning. Fire is the sharpest of the shapes.' },
    { id: 'dodeca', coll: 'solids', name: 'Dodecahedron', element: 'the heavens', wave: 1, night: true, where: { near: 'trestle', dx: 0, dz: -3.4 }, hint: 'on the trestle, only by starlight', tag: 'Twelve faces. Plato’s heavens.', caption: 'Twelve faces, for the whole sky. It only shows itself when the stars are out.' }
  ];
  // tools: not for the wall, but they open the valley up
  F.TOOLS = [
    { id: 'stick', name: 'A walking stick', where: { near: 'bench', dx: -1.3, dz: 0.4 }, hint: 'leaning by the bench at the trailhead', caption: 'A good straight stick. With it he can lean against water that is running hard.' },
    { id: 'waders', name: 'Old waders', where: { near: 'truck' }, hint: 'in the back of the truck', caption: 'Rubber waders, patched at the knee. Now the deep pools are his too.' },
    { id: 'lantern', name: 'A lantern', where: { near: 'studioIn' }, hint: 'hanging in the studio', caption: 'An old brass lantern. The night will be a little smaller now.' }
  ];
  // the poem stops: public-domain poems (first published before 1929, translations too), each where it belongs in the valley.
  // title, by (the poet), tr (the translator), src (where it comes from, shown under the poem), note (a line about it, above the poem),
  // anon: true for a work with no one author ('from The Book of Songs'); lines (one string per line, '' for a stanza break), audio (a recording, if there is one). Texts checked against the old editions:
  // see claude/handoff-v3-polished.md in the project. A poem of his own can replace any of them, or be added as a stop of its own.
  F.POEMS = [
    { id: "bench", label: "The bench", title: "Sit down by this pine", by: "Plato", tr: "W. R. Paton",
      src: "The Greek Anthology, Book XVI, no. 13. Attributed to Plato. Loeb Classical Library, 1918.",
      note: "A short poem attributed to Plato. A pine tree and a spring speak to whoever comes by.",
      lines: [
        "Sit down by this high-foliaged vocal pine that quivers in the constant western breeze, and beside my plashing stream Pan’s pipe shall bring slumber to thy charmed eyelids."
      ] },
    { id: "heron", label: "The Heron Pool", title: "Mist", by: "Henry David Thoreau", tr: "",
      src: "From A Week on the Concord and Merrimack Rivers, 1849. The title was given in Poems of Nature, 1895.",
      note: "From Thoreau’s book about a boat trip with his brother, where the morning fog lies on the river.",
      lines: [
        "Low-anchored cloud,",
        "Newfoundland air,",
        "Fountain-head and source of rivers,",
        "Dew-cloth, dream drapery,",
        "And napkin spread by fays;",
        "Drifting meadow of the air,",
        "Where bloom the daisied banks and violets,",
        "And in whose fenny labyrinth",
        "The bittern booms and heron wades;",
        "Spirit of lakes and seas and rivers,",
        "Bear only perfumes and the scent",
        "Of healing herbs to just men’s fields!"
      ] },
    { id: "rock", label: "The flat rock", title: "Inversnaid", by: "Gerard Manley Hopkins", tr: "",
      src: "Written in 1881. Poems of Gerard Manley Hopkins, ed. Robert Bridges, 1918. The accents are Hopkins’s stress marks.",
      note: "Written at a waterfall above Loch Lomond in Scotland. A burn is a stream.",
      lines: [
        "This darksome burn, horseback brown,",
        "His rollrock highroad roaring down,",
        "In coop and in comb the fleece of his foam",
        "Flutes and low to the lake falls home.",
        "",
        "A windpuff-bonnet of fáwn-fróth",
        "Turns and twindles over the broth",
        "Of a pool so pitchblack, féll-frówning,",
        "It rounds and rounds Despair to drowning.",
        "",
        "Degged with dew, dappled with dew",
        "Are the groins of the braes that the brook treads through,",
        "Wiry heathpacks, flitches of fern,",
        "And the beadbonny ash that sits over the burn.",
        "",
        "What would the world be, once bereft",
        "Of wet and of wildness? Let them be left,",
        "O let them be left, wildness and wet;",
        "Long live the weeds and the wilderness yet."
      ] },
    { id: "lookout", label: "The lookout", title: "I built my hut", by: "T’ao Ch’ien", tr: "Arthur Waley",
      src: "A Hundred and Seventy Chinese Poems, 1918. The fifth of his poems on drinking wine.",
      note: "T’ao Ch’ien gave up a post in government, about the year 405, to farm and write.",
      lines: [
        "I built my hut in a zone of human habitation,",
        "Yet near me there sounds no noise of horse or coach.",
        "Would you know how that is possible?",
        "A heart that is distant creates a wilderness round it.",
        "I pluck chrysanthemums under the eastern hedge,",
        "Then gaze long at the distant summer hills.",
        "The mountain air is fresh at the dusk of day:",
        "The flying birds two by two return.",
        "In these things there lies a deep meaning;",
        "Yet when we would express it, words suddenly fail us."
      ] },
    { id: "spring", label: "The spring", title: "To the Fountain of Bandusia", by: "Horace", tr: "John Conington",
      src: "Odes, Book III, 13. The Odes and Carmen Saeculare of Horace, 1863.",
      note: "Horace promised the spring on his farm that his poem would make it famous. It did.",
      lines: [
        "Bandusia’s fount, in clearness crystalline,",
        "O worthy of the wine, the flowers we vow!",
        "To-morrow shall be thine",
        "A kid, whose crescent brow",
        "",
        "Is sprouting all for love and victory.",
        "In vain: his warm red blood, so early stirr’d,",
        "Thy gelid stream shall dye,",
        "Child of the wanton herd.",
        "",
        "Thee the fierce Sirian star, to madness fired,",
        "Forbears to touch: sweet cool thy waters yield",
        "To ox with ploughing tired,",
        "And lazy sheep afield.",
        "",
        "Thou too one day shalt win proud eminence",
        "’Mid honour’d founts, while I the ilex sing",
        "Crowning the cavern, whence",
        "Thy babbling wavelets spring."
      ] },
    { id: "oak", label: "The old oak", title: "I Saw in Louisiana a Live-Oak Growing", by: "Walt Whitman", tr: "",
      src: "Leaves of Grass, 1891–92. First printed in 1860.",
      note: "He breaks off a twig and keeps it in his room, a token, the way the studio keeps what the creek brings.",
      lines: [
        "I saw in Louisiana a live-oak growing,",
        "All alone stood it and the moss hung down from the branches,",
        "Without any companion it grew there uttering joyous leaves of dark green,",
        "And its look, rude, unbending, lusty, made me think of myself,",
        "But I wonder’d how it could utter joyous leaves standing alone there without its friend near, for I knew I could not,",
        "And I broke off a twig with a certain number of leaves upon it, and twined around it a little moss,",
        "And brought it away, and I have placed it in sight in my room,",
        "It is not needed to remind me as of my own dear friends,",
        "(For I believe lately I think of little else than of them,)",
        "Yet it remains to me a curious token, it makes me think of manly love;",
        "For all that, and though the live-oak glistens there in Louisiana solitary in a wide flat space,",
        "Uttering joyous leaves all its life without a friend a lover near,",
        "I know very well I could not."
      ] },
    { id: "pond", label: "The stock pond", title: "To a Waterfowl", by: "William Cullen Bryant", tr: "",
      src: "First printed in 1818. Poems, 1854.",
      note: "A single waterfowl crossing the evening sky, and what the young Bryant took from it.",
      lines: [
        "Whither, midst falling dew,",
        "While glow the heavens with the last steps of day,",
        "Far, through their rosy depths, dost thou pursue",
        "Thy solitary way?",
        "",
        "Vainly the fowler’s eye",
        "Might mark thy distant flight to do thee wrong,",
        "As, darkly painted on the crimson sky,",
        "Thy figure floats along.",
        "",
        "Seek’st thou the plashy brink",
        "Of weedy lake, or marge of river wide,",
        "Or where the rocking billows rise and sink",
        "On the chafed ocean side?",
        "",
        "There is a Power whose care",
        "Teaches thy way along that pathless coast,—",
        "The desert and illimitable air,—",
        "Lone wandering, but not lost.",
        "",
        "All day thy wings have fanned,",
        "At that far height, the cold, thin atmosphere,",
        "Yet stoop not, weary, to the welcome land,",
        "Though the dark night is near.",
        "",
        "And soon that toil shall end;",
        "Soon shalt thou find a summer home, and rest,",
        "And scream among thy fellows; reeds shall bend,",
        "Soon, o’er thy sheltered nest.",
        "",
        "Thou’rt gone, the abyss of heaven",
        "Hath swallowed up thy form; yet, on my heart",
        "Deeply hath sunk the lesson thou hast given,",
        "And shall not soon depart.",
        "",
        "He who, from zone to zone,",
        "Guides through the boundless sky thy certain flight,",
        "In the long way that I must tread alone,",
        "Will lead my steps aright."
      ] },
    { id: "bridge", label: "The footbridge", title: "Fragments", by: "Heraclitus", tr: "John Burnet",
      src: "Fragments, in Early Greek Philosophy, 1908. Burnet’s numbers are in brackets.",
      note: "Heraclitus of Ephesus, about 500 BC. Only pieces of his book survive, quoted by later writers.",
      lines: [
        "(41, 42) You cannot step twice into the same rivers; for fresh waters are ever flowing in upon you.",
        "",
        "(81) We step and do not step into the same rivers; we are and are not.",
        "",
        "(32) The sun is new every day.",
        "",
        "(10) Nature loves to hide.",
        "",
        "(69) The way up and the way down is one and the same.",
        "",
        "(22) All things are an exchange for Fire, and Fire for all things, even as wares for gold and gold for wares.",
        "",
        "(25) Fire lives the death of air, and air lives the death of fire; water lives the death of earth, earth that of water.",
        "",
        "(84) Even the posset separates if it is not stirred.",
        "",
        "(79) Time is a child playing draughts, the kingly power is a child’s."
      ] },
    { id: "crossing", label: "The low-water crossing", title: "The Flood", by: "The Epic of Gilgamish", anon: true, tr: "R. Campbell Thompson",
      src: "The Epic of Gilgamish, Tablet XI, 1928. Words in brackets were added by the translator.",
      note: "Utnapishtim tells Gilgamish how the great flood ended, and how he knew the water had gone down.",
      lines: [
        "Six days, a se’nnight the hurricane, deluge, (and) tempest continued",
        "Sweeping the land: when the seventh day came, were quelléd the warfare,",
        "Tempest (and) deluge which like to an army embattail’d were fighting.",
        "Lull’d was the sea, (all) spent was the gale, assuaged was the deluge,",
        "(So) did I look on the day; (lo), sound was (all) still’d; and all human",
        "Back to (its) clay was return’d, and fen was level with roof-tree.",
        "(Then) I open’d a hatchway, and down on my cheek stream’d the sunlight,",
        "Bowing myself, I sat weeping, my tears o’er my cheek(s) overflowing,",
        "Into the distance I gazed, to the furthest bounds of the Ocean,",
        "Land was uprear’d at twelve (points), and the Ark on the Mountain of Nisir",
        "Grounded; the Mountain of Nisir held fast, nor gave lease to her shifting.",
        "One day, (nay,) two, did Nisir hold fast, nor give lease to her shifting.",
        "Three days, (nay), four, did Nisir hold fast, nor give lease to her shifting,",
        "Five days, (nay,) six, did Nisir hold fast, nor give lease to her shifting.",
        "(Then), when the seventh day dawn’d, I put forth a dove, and released (her),",
        "(But) to and fro went the dove, and return’d (for) a resting-place was not.",
        "(Then) I a swallow put forth and released; to and fro went the swallow,",
        "She (too) return’d, (for) a resting-place was not; I put forth a raven,",
        "Her, (too,) releasing; the raven went, too, and th’ abating of waters",
        "Saw; and she ate as she waded (and) splash’d, (unto me) not returning."
      ] },
    { id: "trestle", label: "The trestle", title: "Invocation", by: "Boethius", tr: "H. R. James",
      src: "The Consolation of Philosophy, Book III, Song IX. Translated 1897.",
      note: "Written in prison about the year 524. The prayer sums up Plato’s Timaeus: the world made after a pattern, the elements held in balance, souls sent out to the stars.",
      lines: [
        "Maker of earth and sky, from age to age",
        "Who rul’st the world by reason; at whose word",
        "Time issues from Eternity’s abyss:",
        "To all that moves the source of movement, fixed",
        "Thyself and moveless. Thee no cause impelled",
        "Extrinsic this proportioned frame to shape",
        "From shapeless matter; but, deep-set within",
        "Thy inmost being, the form of perfect good,",
        "From envy free; and Thou didst mould the whole",
        "To that supernal pattern. Beauteous",
        "The world in Thee thus imaged, being Thyself",
        "Most beautiful. So Thou the work didst fashion",
        "In that fair likeness, bidding it put on",
        "Perfection through the exquisite perfectness",
        "Of every part’s contrivance. Thou dost bind",
        "The elements in balanced harmony,",
        "So that the hot and cold, the moist and dry,",
        "Contend not; nor the pure fire leaping up",
        "Escape, or weight of waters whelm the earth.",
        "",
        "Thou joinest and diffusest through the whole,",
        "Linking accordantly its several parts,",
        "A soul of threefold nature, moving all.",
        "This, cleft in twain, and in two circles gathered,",
        "Speeds in a path that on itself returns,",
        "Encompassing mind’s limits, and conforms",
        "The heavens to her true semblance. Lesser souls",
        "And lesser lives by a like ordinance",
        "Thou sendest forth, each to its starry car",
        "Affixing, and dost strew them far and wide",
        "O’er earth and heaven. These by a law benign",
        "Thou biddest turn again, and render back",
        "To thee their fires. Oh, grant, almighty Father,",
        "Grant us on reason’s wing to soar aloft",
        "To heaven’s exalted height; grant us to see",
        "The fount of good; grant us, the true light found,",
        "To fix our steadfast eyes in vision clear",
        "On Thee. Disperse the heavy mists of earth,",
        "And shine in Thine own splendour. For Thou art",
        "The true serenity and perfect rest",
        "Of every pious soul—to see Thy face,",
        "The end and the beginning—One the guide,",
        "The traveller, the pathway, and the goal."
      ] },
    { id: "bluehole", label: "The Blue Hole", title: "Reed and Rush", by: "The Book of Songs", anon: true, tr: "James Legge",
      src: "The She King, Odes of Ch’in, IV. Translated into English verse, 1876.",
      note: "From China’s oldest book of poems. Someone searches up and down a river for a person who is always just out of reach.",
      lines: [
        "Reed and rush are dark and green;",
        "As hoarfrost the white dew is seen.",
        "Him, the man I have in mind,",
        "By this water I should find.",
        "Searching, up the stream I haste,",
        "On a long and toilsome quest.",
        "Downwards then I turn, and see!",
        "In the midstream standeth he.",
        "He is there but far removed;",
        "Vain has all my searching proved.",
        "",
        "Reed and rush luxuriant rise;",
        "Still undried the white dew lies.",
        "Him, the man I have in mind,",
        "On the stream’s edge I should find.",
        "Upwards first my course I keep,",
        "Though the way is rough and steep.",
        "Downwards then, and what to see?",
        "In the midstream standeth he,",
        "On the islet, far removed;—",
        "Vain has all my searching proved.",
        "",
        "Reed and rush grow thick and tall;",
        "Ceases not the dew to fall.",
        "Him, the man I have in mind,",
        "On the stream’s bank I should find.",
        "Upwards first I go along,",
        "But the hard path leads me wrong.",
        "Downwards then my steps I turn,",
        "And in midstream him discern,",
        "On the island, far removed;—",
        "Vain has all my searching proved."
      ] }
  ];
  // a recording of a poem being read can go in its audio field (a file name next to the game, or a data: URL);
  // the Read aloud button then plays it instead of the browser's voice.
  F.POEMS.forEach(function (pm) { if (pm.audio == null) pm.audio = ''; });
  // the last page, at the mouth of the cave once the shadows have been and gone, at dawn: Plato again, his own poem this time
  F.ENDING = { id: 'ending', label: 'At the mouth of the cave', title: 'To Stella', by: 'Plato', tr: 'Percy Bysshe Shelley',
    src: 'From the Greek of Plato. Shelley’s Poetical Works, 1839.',
    note: 'Attributed to Plato, for a young man named Aster, whose name means star. Aster had died.',
    lines: [
      "Thou wert the morning star among the living,",
      "Ere thy fair light had fled;—",
      "Now, having died, thou art as Hesperus, giving",
      "New splendour to the dead."
    ], audio: '' };

  // Ponder: he holds up his wooden icosahedron. What he notices first (game lines, for the family to change), then a line from
  // the commonplace book. Lines of his own can go in OWN_LINES: { line: '...', by: 'the Philosopher King' }; they join the others.
  F.NOTICE = [
    'He holds the icosahedron up to the light. Twenty faces, and every one of them is paying attention.',
    'He turns the icosahedron slowly. The creek goes quiet, the way a room does.',
    'He holds it up. Somewhere downstream, something holds still.',
    'The icosahedron is warm, though the morning isn\u2019t.',
    'He looks through it, as through a window that is mostly frame.',
    'He holds it up to the creek, and the creek, in its way, holds something up to him.'
  ];
  F.PONDER = [
    { line: 'You cannot step twice into the same rivers; for fresh waters are ever flowing in upon you.', by: 'Heraclitus (tr. John Burnet)' },
    { line: 'Time is like a river made up of the events which happen, and a violent stream.', by: 'Marcus Aurelius, Meditations (tr. George Long)' },
    { line: 'Heaven is under our feet as well as over our heads.', by: 'Henry David Thoreau, Walden' },
    { line: 'Time is but the stream I go a-fishing in.', by: 'Henry David Thoreau, Walden' },
    { line: "The highest excellence is like (that of) water. The excellence of water appears in its benefiting all things, and in its occupying, without striving (to the contrary), the low place which all men dislike.", by: 'Laozi, Tao Te Ching 8 (tr. James Legge)' },
    { line: "The time of the autumnal floods was come, and the hundred streams were all discharging themselves into the Ho.", by: 'Zhuangzi, The Floods of Autumn (tr. James Legge)' },
    { line: "Hear first the four roots of all things: shining Zeus, life-bringing Hera, Aidoneus, and Nestis whose tear-drops are a well-spring to mortals.", by: 'Empedocles (tr. John Burnet)' },
    { line: "Kwang-dze and Hui-dze were walking on the dam over the Hâo, when the former said, ‘These thryssas come out, and play about at their ease;—that is the enjoyment of fishes.’ The other said, ‘You are not a fish; how do you know what constitutes the enjoyment of fishes?’ Kwang-dze rejoined, ‘You are not I. How do you know that I do not know what constitutes the enjoyment of fishes?’", by: 'Zhuangzi, on the dam over the H\u00e2o (tr. James Legge)' },
    { line: "Gilgamish spied out a pool of cool water, (and) therein descending / Bathed in the water. (But here was) a serpent who snuff’d the plant’s fragrance, / Darted he up ⌜from the water (?)⌝, and snatch’d the plant, uttering malison / As he drew back. Then Gilgamish sate him, (and) burst into weeping.", by: 'The Epic of Gilgamish, Tablet XI (tr. R. Campbell Thompson)' },
    { line: 'We need the tonic of wildness.', by: 'Henry David Thoreau, Walden' },
    { line: 'The invariable mark of wisdom is to see the miraculous in the common.', by: 'Ralph Waldo Emerson, Nature' },
    { line: 'Beloved Pan, and all ye other gods who haunt this place, give me beauty in the inward soul.', by: 'Plato, Phaedrus (tr. Jowett)' },
    { line: 'There was yet a fifth combination which God used in the delineation of the universe.', by: 'Plato, Timaeus (tr. Jowett)' },
    { line: 'To see a World in a Grain of Sand, and a Heaven in a Wild Flower.', by: 'William Blake, Auguries of Innocence' },
    { line: 'To make a prairie it takes a clover and one bee.', by: 'Emily Dickinson' }
  ];
  F.OWN_LINES = [];
  // the shadows on the cave wall, and the morning after
  F.CAVE_LINE = { line: 'They see only their own shadows, or the shadows of one another, which the fire throws on the opposite wall of the cave.', by: 'Plato, Republic VII (tr. Jowett)' };
  F.DAWN_LINE = { line: 'Last of all he will be able to see the sun, and not mere reflections of him in the water.', by: 'Plato, Republic VII (tr. Jowett)' };
  // the credits at the end (one line each; [heading, line] pairs; for the family to change)
  F.CREDITS = [
    ['', 'What the Water Brings'],
    ['Poems at the stops', 'Plato, Thoreau, Hopkins, T\u2019ao Ch\u2019ien, Horace, Whitman, Bryant, Heraclitus, the Epic of Gilgamish, Boethius, the Book of Songs'],
    ['Translations', 'Percy Bysshe Shelley, W. R. Paton, Arthur Waley, John Conington, John Burnet, R. Campbell Thompson, H. R. James, James Legge, Rennell Rodd'],
    ['Lines in the commonplace book', 'Plato (tr. Benjamin Jowett), Heraclitus, Xenophanes and Empedocles (tr. John Burnet), Laozi and Zhuangzi (tr. James Legge), Marcus Aurelius (tr. George Long), the Epic of Gilgamish (tr. R. Campbell Thompson), Henry David Thoreau, Ralph Waldo Emerson, Emily Dickinson, William Blake, and the King James Bible'],
    ['Made', 'by a friend, with Claude']
  ];
  F.byId = {}; F.FINDS.concat(F.TOOLS).forEach(function (f) { F.byId[f.id] = f; });

  // ------------------------------------------------------------------ the props
  var W = global.PKValley, PAINT = W.PAINT;
  var NEW = {
    feather: ['#7d8a96', '#aab4bc', '#dfe4e6'], featherD: ['#4a5560', '#5d6c7c', '#7d8a96'], hawkF: ['#7a3a1e', '#a85a30', '#d08a50'],
    fossil: ['#9a8466', '#c4ab84', '#e0cca4'], flint: ['#5f5a55', '#8a837a', '#aaa298'], toothK: ['#2a2826', '#4a4440', '#6a625a'],
    book: ['#3a5030', '#4f6a3a', '#6a8a4e'], pages: ['#cdbf9e', '#efe6cc', '#fffaf0'], bowl: ['#7e5a3c', '#a87a50', '#c89a68'],
    glass: ['#86b6c6', '#c8e1e6', '#eef6f6'], cork: ['#8f7650', '#b59a6d', '#cfb889'], tinyskin: ['#d48a6c', '#f2aa86', '#fcc8a7'], tinycrown: ['#c08f3e', '#efc067', '#fde4a2'],
    glassG: ['#3f7a52', '#5fa070', '#8fc89a'], glassB: ['#1f3f8a', '#3a5fc0', '#6f8fe0'], glassT: ['#1f7a7a', '#3aa8a2', '#7ad4cc'], glassA: ['#6a3a10', '#8f5520', '#b87a38'],
    aqua: ['#5f9a9a', '#86c0bc', '#b0e0da'], porcelain: ['#c8c4bc', '#ecebe6', '#fbfaf7'], brick: ['#7a3424', '#a04a32', '#c06a48'], bone: ['#bcae8e', '#ddd2b4', '#f0e8d2'],
    toyR: ['#8a1f1f', '#c0302a', '#e05040'], toyG: ['#2f6a2f', '#4a9a3a', '#70c050'], rubber: ['#c09020', '#f0c030', '#ffe070'], ebony: ['#1e1c1a', '#2a2826', '#3a3634'],
    pecanN: ['#5a3a20', '#7a5030', '#9a6a40'], osage: ['#6a8a2a', '#8aac3a', '#aacc5a'], postcard: ['#c8b890', '#e8dcc0', '#f8f0dc'], gulf: ['#3f6f8a', '#5d93ad', '#86b6c6'],
    pencil: ['#c08f20', '#e8b830', '#f8d860'], pyrite: ['#8a7a3a', '#b8a050', '#e0d080'], snake: ['#8a7a5a', '#b0a07a', '#d0c4a0'], shellT: ['#2f4a30', '#4a6a3e', '#6a8a4e'],
    solid: ['#8a5a30', '#b07a48', '#d4a070'], lampG: ['#8a6a20', '#c09a3a', '#e8c868'], waderG: ['#2a3a2a', '#3a4e3a', '#526a52'],
    flame: ['#d2501c', '#f39030', '#ffd25a'], ember: ['#5a1e10', '#8a2e14', '#c04a1c'], shade: ['#241e1a', '#2e2620', '#3a3028'], beam: ['#f6e6b0', '#fff2c8', '#fffbe8']
  };
  for (var k in NEW) { PAINT[k] = NEW[k]; NEW[k].forEach(W.note); }
  ['ink', 'page', 'glint', 'rust', 'steel', 'wood', 'trunk', 'white'].forEach(function (k) { PAINT[k].forEach(W.note); });
  function mesh(geo, key, flat) { var m = new THREE.Mesh(geo, W.paint(key, { flat: flat !== false })); m.castShadow = true; m.receiveShadow = true; return m; }
  function at(m, x, y, z, rx, ry, rz) { m.position.set(x || 0, y || 0, z || 0); m.rotation.set(rx || 0, ry || 0, rz || 0); return m; }
  function box(w, h, d) { return new THREE.BoxGeometry(w, h, d); }
  function cyl(rt, rb, h, n) { return new THREE.CylinderGeometry(rt, rb, h, n || 10); }
  function ell(rx, ry, rz, n) { var g = new THREE.SphereGeometry(1, n || 10, Math.max(6, Math.round((n || 10) * 0.6))); g.scale(rx, ry, rz); return g; }
  function lathe(pts, n) { return new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), n || 10); }
  function flat(shape, d, bevel) { var g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: !!bevel, bevelThickness: bevel || 0, bevelSize: bevel || 0, bevelSegments: 1 }); g.rotateX(-Math.PI / 2); return g; }
  function shapeOf(pts) { var s = new THREE.Shape(); pts.forEach(function (p, i) { if (i) s.lineTo(p[0], p[1]); else s.moveTo(p[0], p[1]); }); return s; }
  function tube(pts, r, n) { return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); })), n || 20, r, 6, false); }
  function bottleG(r, h, neck) { return lathe([[0, 0], [r, 0], [r * 1.05, h * 0.06], [r * 1.05, h * 0.65], [r * 0.6, h * 0.8], [neck, h * 0.86], [neck, h], [0, h]], 10); }

  // each sits with its base at y = 0, a little larger than life so it reads at pixel size
  var BUILD = {
    glassG: function (g) { g.add(at(mesh(new THREE.DodecahedronGeometry(0.07, 0), 'glassG'), 0, 0.03, 0, 0.3, 0.2, 0)); g.children[0].scale.set(1.4, 0.45, 1); },
    marble: function (g) { g.add(at(mesh(ell(0.045, 0.045, 0.045, 10), 'brick', false), 0, 0.045)); },
    brick: function (g) { var m = mesh(new THREE.BoxGeometry(0.22, 0.07, 0.11, 2, 2, 2), 'brick'); var P = m.geometry.attributes.position; for (var i = 0; i < P.count; i++) { var x = P.getX(i), y = P.getY(i), z = P.getZ(i), l = Math.hypot(x / 0.11, y / 0.035, z / 0.055); P.setXYZ(i, x / Math.max(1, l * 0.82), y / Math.max(1, l * 0.82), z / Math.max(1, l * 0.82)); } m.geometry.computeVertexNormals(); g.add(at(m, 0, 0.035)); },
    quartz: function (g) { g.add(at(mesh(new THREE.DodecahedronGeometry(0.06, 1), 'porcelain'), 0, 0.035, 0, 0.5, 0.3, 0.2)); g.children[0].scale.set(1.2, 0.7, 1); },
    golf: function (g) { g.add(at(mesh(new THREE.IcosahedronGeometry(0.045, 1), 'white'), 0, 0.045)); },
    knob: function (g) { g.add(at(mesh(ell(0.06, 0.05, 0.06, 12), 'porcelain', false), 0, 0.09)); g.add(at(mesh(cyl(0.02, 0.035, 0.06, 8), 'rust'), 0, 0.03)); },
    key: function (g) { g.add(at(mesh(new THREE.TorusGeometry(0.035, 0.012, 5, 10), 'rust'), -0.09, 0.012, 0, Math.PI / 2)); g.add(at(mesh(box(0.15, 0.016, 0.016), 'rust'), 0.01, 0.012)); g.add(at(mesh(box(0.025, 0.016, 0.04), 'rust'), 0.07, 0.012, 0.02)); },
    horseshoe: function (g) { var t = new THREE.TorusGeometry(0.08, 0.018, 5, 12, Math.PI * 1.35); t.rotateZ(-Math.PI * 0.175); g.add(at(mesh(t, 'rust'), 0, 0.012, 0, Math.PI / 2)); },
    spike: function (g) { g.add(at(mesh(box(0.2, 0.022, 0.022), 'rust'), 0, 0.014)); g.add(at(mesh(box(0.025, 0.03, 0.05), 'rust'), -0.1, 0.016)); },
    cap: function (g) { g.add(at(mesh(cyl(0.035, 0.038, 0.014, 12), 'steel'), 0, 0.007)); },
    car: function (g) { g.add(at(mesh(box(0.16, 0.05, 0.08), 'toyR'), 0, 0.04)); g.add(at(mesh(box(0.08, 0.04, 0.07), 'rust'), -0.01, 0.08)); g.add(at(mesh(cyl(0.022, 0.022, 0.015, 8), 'tire'), 0.05, 0.022, 0.045, Math.PI / 2)); },
    spoon: function (g) { g.add(at(mesh(ell(0.03, 0.01, 0.045, 8), 'rust'), 0.07, 0.012)); g.add(at(mesh(box(0.13, 0.012, 0.014), 'rust'), -0.02, 0.014, 0, 0, 0, 0.12)); },
    feather: function (g) { var sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(0.05, 0.12, 0.02, 0.36); sh.quadraticCurveTo(-0.04, 0.14, 0, 0); var fg = flat(sh, 0.012); fg.translate(0, 0.01, 0.15); g.add(mesh(fg, 'feather')); g.add(at(mesh(box(0.012, 0.012, 0.38), 'featherD'), 0.005, 0.02, -0.03)); },
    hawk: function (g) { var sh = new THREE.Shape(); sh.moveTo(0, 0); sh.quadraticCurveTo(0.06, 0.12, 0.03, 0.3); sh.lineTo(-0.02, 0.3); sh.quadraticCurveTo(-0.04, 0.12, 0, 0); var fg = flat(sh, 0.012); fg.translate(0, 0.01, 0.13); g.add(mesh(fg, 'hawkF')); g.add(at(mesh(box(0.05, 0.016, 0.03), 'ebony'), 0.005, 0.02, -0.15)); },
    shell: function (g) { g.add(at(mesh(ell(0.13, 0.06, 0.16, 10), 'shellT'), 0, 0.03)); g.add(at(mesh(ell(0.135, 0.015, 0.165, 10), 'tstripe'), 0, 0.01)); },
    snakeskin: function (g) { var pts = []; for (var i = 0; i <= 12; i++) { var t = i / 12; pts.push([Math.sin(t * 9) * 0.07, 0.015, -0.25 + t * 0.5]); } g.add(mesh(tube(pts, 0.014, 30), 'snake')); },
    vertebra: function (g) { g.add(at(mesh(cyl(0.04, 0.04, 0.05, 8), 'bone'), 0, 0.04, 0, Math.PI / 2)); g.add(at(mesh(box(0.025, 0.09, 0.02), 'bone'), 0, 0.08)); g.add(at(mesh(box(0.16, 0.02, 0.025), 'bone'), 0, 0.045)); },
    skull: function (g) { g.add(at(mesh(ell(0.04, 0.035, 0.05, 10), 'bone', false), 0, 0.035)); g.add(at(mesh(new THREE.ConeGeometry(0.015, 0.06, 5), 'bone'), 0, 0.03, 0.07, Math.PI / 2)); g.add(at(mesh(ell(0.012, 0.012, 0.01, 6), 'ebony'), 0.025, 0.045, 0.02)); },
    ammonite: function (g) { var p = []; for (var i = 0; i <= 40; i++) { var t = i / 40, a = t * Math.PI * 5, r = 0.015 + 0.105 * t; p.push([Math.cos(a) * r, 0, Math.sin(a) * r]); } var tg = tube(p, 0.022, 60); tg.scale(1, 1.4, 1); tg.translate(0, 0.03, 0); g.add(mesh(tg, 'fossil')); g.add(at(mesh(cyl(0.06, 0.07, 0.04, 8), 'fossil'), 0, 0.02)); },
    tooth: function (g) { g.add(at(mesh(flat(shapeOf([[-0.04, 0], [0.04, 0], [0.012, 0.09], [0, 0.1], [-0.012, 0.09]]), 0.018, 0.004), 'toothK'), 0, 0.01, 0.04)); },
    oyster: function (g) { var pts = []; for (var i = 0; i <= 14; i++) { var t = i / 14, a = t * Math.PI * 0.9; pts.push([0, 0.02 + Math.sin(a) * 0.05, -0.06 + Math.cos(a) * -0.06]); } g.add(mesh(tube(pts, 0.035, 16), 'fossil')); },
    urchin: function (g) { g.add(at(mesh(ell(0.07, 0.04, 0.065, 12), 'fossil', false), 0, 0.03)); for (var k = 0; k < 5; k++) { var a = k / 5 * 6.283; g.add(at(mesh(box(0.012, 0.006, 0.05), 'flint'), Math.sin(a) * 0.03, 0.068, Math.cos(a) * 0.03, 0, a, 0)); } },
    clam: function (g) { var m = mesh(new THREE.SphereGeometry(0.11, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), 'fossil'); m.scale.set(1, 0.35, 0.8); g.add(m); },
    fishbone: function (g) { g.add(at(mesh(cyl(0.035, 0.035, 0.03, 10), 'fossil'), 0, 0.035, 0, Math.PI / 2)); g.add(at(mesh(box(0.012, 0.11, 0.012), 'fossil'), 0, 0.06)); },
    soldier: function (g) { g.add(at(mesh(cyl(0.025, 0.025, 0.012, 8), 'steel'), 0, 0.006)); g.add(at(mesh(box(0.035, 0.07, 0.025), 'toyR'), 0, 0.05)); g.add(at(mesh(ell(0.014, 0.014, 0.014, 6), 'tinyskin'), 0, 0.095)); g.add(at(mesh(cyl(0.012, 0.012, 0.03, 6), 'ebony'), 0, 0.12)); g.add(at(mesh(box(0.006, 0.09, 0.006), 'steel'), 0.025, 0.07)); },
    doll: function (g) { g.add(at(mesh(box(0.05, 0.02, 0.06), 'porcelain'), 0, 0.012)); for (var k = 0; k < 4; k++) g.add(at(mesh(box(0.009, 0.012, 0.04), 'porcelain'), -0.018 + k * 0.012, 0.012, 0.05)); g.add(at(mesh(box(0.012, 0.012, 0.03), 'porcelain'), 0.03, 0.012, 0.02, 0, -0.6, 0)); g.add(at(mesh(cyl(0.015, 0.018, 0.06, 6), 'porcelain'), 0, 0.012, -0.06, Math.PI / 2)); },
    duck: function (g) { g.add(at(mesh(ell(0.06, 0.045, 0.075, 10), 'rubber', false), 0, 0.045)); g.add(at(mesh(ell(0.035, 0.035, 0.035, 8), 'rubber', false), 0, 0.105, 0.04)); g.add(at(mesh(box(0.03, 0.01, 0.03), 'beak'), 0, 0.1, 0.08)); },
    domino: function (g) { g.add(at(mesh(box(0.05, 0.016, 0.1), 'ebony'), 0, 0.008)); for (var k = 0; k < 10; k++) { var hf = k < 5 ? -1 : 1, q = k % 5, dx = [-0.012, 0.012, 0, -0.012, 0.012][q], dz = [-0.012, -0.012, 0, 0.012, 0.012][q]; g.add(at(mesh(box(0.008, 0.004, 0.008), 'white'), dx, 0.017, hf * 0.025 + dz)); } },
    dino: function (g) { g.add(at(mesh(ell(0.06, 0.035, 0.03, 8), 'toyG', false), 0, 0.055)); g.add(at(mesh(ell(0.02, 0.016, 0.016, 6), 'toyG', false), 0.07, 0.05)); for (var k = 0; k < 4; k++) g.add(at(mesh(new THREE.ConeGeometry(0.014, 0.03, 4), 'toyR'), -0.04 + k * 0.025, 0.095, 0)); [[-0.035, -0.015], [0.035, -0.015], [-0.035, 0.015], [0.035, 0.015]].forEach(function (q) { g.add(at(mesh(box(0.014, 0.035, 0.014), 'toyG'), q[0], 0.02, q[1])); }); },
    die: function (g) { g.add(at(mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), 'bone'), 0, 0.03, 0, 0, 0.4, 0)); [[0, 0.061, 0], [0.015, 0.061, 0.015], [-0.015, 0.061, -0.015]].forEach(function (q) { var d = mesh(box(0.01, 0.003, 0.01), 'ebony'); d.position.set(q[0], q[1], q[2]); var piv = new THREE.Group(); piv.rotation.y = 0.4; piv.add(d); g.add(piv); }); },
    bottle: function (g) { var gl = mesh(bottleG(0.055, 0.2, 0.022), 'glass'); g.add(gl); g.add(at(mesh(cyl(0.02, 0.02, 0.03, 6), 'cork'), 0, 0.215)); g.add(at(mesh(box(0.035, 0.05, 0.03), 'tinyskin'), 0, 0.05, 0.03)); g.add(at(mesh(box(0.03, 0.015, 0.03), 'tinycrown'), 0, 0.083, 0.03)); g.rotation.z = Math.PI / 2 - 0.15; g.userData.lying = true; },
    medicine: function (g) { g.add(mesh(bottleG(0.045, 0.16, 0.018), 'glassB')); g.rotation.z = Math.PI / 2 - 0.1; g.userData.lying = true; },
    tealglass: function (g) { g.add(at(mesh(flat(shapeOf([[-0.06, -0.02], [0.05, -0.04], [0.07, 0.03], [0.0, 0.06], [-0.05, 0.04]]), 0.014, 0.004), 'glassT'), 0, 0.008)); },
    insulator: function (g) { g.add(mesh(lathe([[0, 0], [0.05, 0], [0.055, 0.02], [0.04, 0.03], [0.045, 0.06], [0.03, 0.08], [0.028, 0.1], [0, 0.11]], 10), 'aqua')); },
    crystal: function (g) { var c = mesh(new THREE.OctahedronGeometry(0.05, 0), 'white'); c.scale.set(0.8, 1.6, 0.8); g.add(at(c, 0, 0.03, 0, Math.PI / 2 - 0.3)); },
    amber: function (g) { g.add(mesh(bottleG(0.05, 0.19, 0.02), 'glassA')); g.rotation.z = Math.PI / 2 - 0.12; g.userData.lying = true; },
    walden: function (g) { g.add(at(mesh(box(0.2, 0.06, 0.28), 'book'), 0, 0.03)); g.add(at(mesh(box(0.19, 0.045, 0.27), 'pages'), 0.008, 0.03)); g.add(at(mesh(box(0.03, 0.065, 0.285), 'book'), -0.095, 0.032)); g.rotation.y = 0.4; },
    postcard: function (g) { g.add(at(mesh(box(0.15, 0.006, 0.1), 'postcard'), 0, 0.004)); g.add(at(mesh(box(0.11, 0.003, 0.05), 'gulf'), -0.01, 0.008, -0.01)); },
    card: function (g) { g.add(at(mesh(box(0.08, 0.005, 0.12), 'postcard'), 0, 0.004)); for (var k = 0; k < 4; k++) g.add(at(mesh(box(0.06, 0.003, 0.006), 'ink'), 0, 0.008, -0.03 + k * 0.02)); },
    dictpage: function (g) { g.add(at(mesh(box(0.14, 0.004, 0.19), 'page'), 0, 0.004, 0, 0, 0.3, 0)); for (var k = 0; k < 6; k++) g.add(at(mesh(box(0.1, 0.002, 0.006), 'ink'), 0, 0.007, -0.06 + k * 0.024, 0, 0.3, 0)); g.add(at(mesh(new THREE.TorusGeometry(0.025, 0.004, 3, 10), 'toyR'), 0.01, 0.008, 0.02, Math.PI / 2)); },
    letter: function (g) { g.add(mesh(bottleG(0.05, 0.18, 0.02), 'glass')); g.add(at(mesh(cyl(0.025, 0.025, 0.1, 6), 'page'), 0, 0.07)); g.add(at(mesh(cyl(0.019, 0.019, 0.025, 6), 'cork'), 0, 0.19)); g.rotation.z = Math.PI / 2 - 0.1; g.userData.lying = true; },
    pencil: function (g) { g.add(at(mesh(cyl(0.012, 0.012, 0.09, 6), 'pencil'), 0, 0.012, 0, Math.PI / 2)); g.add(at(mesh(new THREE.ConeGeometry(0.012, 0.025, 6), 'cork'), 0, 0.012, 0.057, Math.PI / 2)); },
    bowl: function (g) { g.add(mesh(lathe([[0, 0], [0.05, 0], [0.09, 0.015], [0.125, 0.05], [0.135, 0.1], [0.12, 0.102], [0.108, 0.06], [0.08, 0.03], [0, 0.026]], 10), 'bowl')); },
    sycball: function (g) { g.add(at(mesh(new THREE.IcosahedronGeometry(0.045, 1), 'trunk'), 0, 0.045)); g.add(at(mesh(cyl(0.004, 0.004, 0.08, 4), 'trunk'), 0, 0.1)); },
    horseapple: function (g) { var m = mesh(new THREE.IcosahedronGeometry(0.075, 1), 'osage'); var P = m.geometry.attributes.position; for (var i = 0; i < P.count; i++) { var f = 1 + 0.12 * Math.sin(P.getX(i) * 90) * Math.cos(P.getZ(i) * 80); P.setXYZ(i, P.getX(i) * f, P.getY(i) * f, P.getZ(i) * f); } m.geometry.computeVertexNormals(); g.add(at(m, 0, 0.07)); },
    pecan: function (g) { g.add(at(mesh(ell(0.022, 0.022, 0.04, 8), 'pecanN', false), 0, 0.022)); },
    acorn: function (g) { g.add(at(mesh(new THREE.SphereGeometry(0.03, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), 'trunk'), 0, 0.005, 0, Math.PI)); g.children[0].position.y = 0.03; },
    drift: function (g) { g.add(mesh(tube([[-0.18, 0.03, 0], [-0.08, 0.05, 0.04], [0, 0.03, -0.03], [0.1, 0.05, 0.02], [0.18, 0.03, -0.02]], 0.022, 20), 'syc')); },
    icosa: function (g) { g.add(at(mesh(new THREE.IcosahedronGeometry(0.1, 0), 'solid'), 0, 0.09)); },
    octa: function (g) { g.add(at(mesh(new THREE.OctahedronGeometry(0.1, 0), 'solid'), 0, 0.1)); },
    cube: function (g) { g.add(at(mesh(box(0.1, 0.1, 0.1), 'pyrite'), 0, 0.05, 0, 0, 0.5, 0)); g.add(at(mesh(box(0.05, 0.05, 0.05), 'pyrite'), 0.06, 0.03, 0.05, 0, 0.2, 0)); },
    tetra: function (g) { g.add(at(mesh(new THREE.TetrahedronGeometry(0.11, 0), 'solid'), 0, 0.04, 0, -0.62, 0, 0.78)); },
    dodeca: function (g) { g.add(at(mesh(new THREE.DodecahedronGeometry(0.1, 0), 'solid'), 0, 0.09)); },
    stick: function (g) { g.add(at(mesh(cyl(0.022, 0.028, 1.3, 6), 'trunk'), 0, 0.65)); g.add(at(mesh(cyl(0.012, 0.016, 0.16, 5), 'trunk'), 0.05, 1.1, 0, 0, 0, -0.6)); },
    waders: function (g) { [-1, 1].forEach(function (s) { g.add(at(mesh(cyl(0.07, 0.065, 0.55, 8), 'waderG'), s * 0.08, 0.32)); g.add(at(mesh(box(0.12, 0.08, 0.22), 'waderG'), s * 0.08, 0.04, 0.04)); }); g.add(at(mesh(box(0.32, 0.25, 0.14), 'waderG'), 0, 0.72)); },
    lantern: function (g) { g.add(at(mesh(cyl(0.06, 0.07, 0.03, 8), 'lampG'), 0, 0.015)); g.add(at(mesh(cyl(0.05, 0.05, 0.12, 8), 'glass'), 0, 0.09)); g.add(at(mesh(cyl(0.035, 0.06, 0.04, 8), 'lampG'), 0, 0.17)); g.add(at(mesh(new THREE.TorusGeometry(0.04, 0.006, 4, 10), 'lampG'), 0, 0.22, 0)); }
  };
  F.prop = function (id) {
    var g = new THREE.Group(); g.name = 'Find_' + id;
    (BUILD[id] || BUILD.glassG)(g);
    return g;
  };
  // a copy for his hand, centred so it sits in his palms or over his head
  F.heldProp = function (id) {
    var p = F.prop(id), g = new THREE.Group(); g.name = 'Held_' + id;
    p.rotation.set(0, 0, 0);
    var box3 = new THREE.Box3().setFromObject(p), c = box3.getCenter(new THREE.Vector3()), s = box3.getSize(new THREE.Vector3()), big = Math.max(s.x, s.y, s.z);
    p.position.set(-c.x, -c.y, -c.z); g.add(p);
    g.scale.setScalar(big > 0.35 ? 0.3 / big : big < 0.12 ? 1.3 : 0.9);
    return g;
  };
  // the sparkle over a find: two crossed slivers that turn and bob
  F.glint = function () {
    var g = new THREE.Group(); g.name = 'Glint';
    [[0.05, 0.3, 0.05], [0.22, 0.05, 0.05], [0.05, 0.05, 0.22]].forEach(function (q) { g.add(new THREE.Mesh(box(q[0], q[1], q[2]), W.paint('glint', { glow: true }))); });
    return g;
  };
  // the floating page over a poem stop
  F.page = function () {
    var g = new THREE.Group(); g.name = 'PoemPage';
    g.add(new THREE.Mesh(box(0.26, 0.34, 0.015), W.paint('page', { glow: true })));   // it shines a little: at night the page glows, waiting
    for (var i = 0; i < 5; i++) { var l = new THREE.Mesh(box(i === 0 ? 0.12 : 0.17, 0.018, 0.02), W.paint('ink')); l.position.set(i === 0 ? -0.025 : 0, 0.11 - i * 0.05, 0.004); g.add(l); }
    g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
    return g;
  };
})(typeof window !== 'undefined' ? window : globalThis);

;