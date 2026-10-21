/* PKCard: the character card shared by the 3D page and the pixel king demo.
   Front: the drawing of him, his name, title, stats and a short description.
   Back (turn the card over): a page kept for a poem of his own for the game. While POEM.lines is empty it shows ruled blank lines;
   to put the poem in, fill POEM below (one string per line, '' for a stanza break) and rebuild. */
(function () {
  'use strict';
  // the back of his card: a poem attributed to Plato, to Aster (whose name means star), in Rennell Rodd's rendering (1916).
  // A poem of his own can go here instead (only with permission): title, by, tr ('' for none), lines.
  var POEM = {
    title: 'Starworship',
    by: 'Plato',
    tr: 'Rennell Rodd',
    lines: ["Thou gazest starward, star of mine, whose heaven I fain would be,", "That all my myriad starry eyes might only gaze on thee."]           // one string per line of the poem; '' leaves a blank line between stanzas
  };
  var STATS = [['Wisdom', 10], ['Curiosity', 10], ['Patience', 8], ['Kindness', 9], ['Speed', 2]];
  var $ = function (id) { return document.getElementById(id); };

  function build() {
    var A = window.PKCardAssets;
    $('cardArt').src = A.art; $('cardSprite').src = A.sprite;
    var ul = $('cardStats');
    STATS.forEach(function (s) {
      var li = document.createElement('li'), pips = '';
      for (var i = 0; i < 10; i++) pips += '<i' + (i < s[1] ? ' class="on"' : '') + '></i>';
      li.innerHTML = '<span>' + s[0] + '</span><b aria-label="' + s[1] + ' out of 10">' + pips + '</b><em>' + s[1] + '</em>';
      ul.appendChild(li);
    });
    // the poem page: his poem when there is one, otherwise ruled blank lines kept for it
    var page = $('poemPage'), filled = POEM.lines.length > 0;
    $('poemTitle').textContent = POEM.title || 'A poem for the creek';
    $('poemBy').textContent = 'by ' + POEM.by + (POEM.tr ? ' \u00b7 translated by ' + POEM.tr : '');
    page.classList.toggle('blank', !filled);
    if (filled) {
      POEM.lines.forEach(function (t) { var p = document.createElement('p'); p.className = t ? 'ln' : 'ln gap'; p.textContent = t || ' '; page.appendChild(p); });
    } else {
      for (var k = 0; k < 11; k++) { var r = document.createElement('p'); r.className = 'ln rule'; r.setAttribute('aria-hidden', 'true'); r.textContent = ' '; page.appendChild(r); }
      var note = document.createElement('p'); note.className = 'kept'; note.textContent = 'This page is kept for a poem by ' + POEM.by + '.'; page.appendChild(note);
    }
    // turning the card over
    var wrap = $('cardWrap'), card = wrap.querySelector('.card'), front = $('cardFront'), back = $('cardBack'), busy = false;
    function turn(toBack) {
      if (busy) return; busy = true;
      card.classList.add('turning');
      setTimeout(function () {
        front.hidden = toBack; back.hidden = !toBack; card.scrollTop = 0;
        card.classList.remove('turning');
        (toBack ? $('cardTurnBack') : $('cardTurn')).focus();
        busy = false;
      }, 170);
    }
    $('cardTurn').addEventListener('click', function () { turn(true); });
    $('cardTurnBack').addEventListener('click', function () { turn(false); });
    function open() { front.hidden = false; back.hidden = true; wrap.hidden = false; requestAnimationFrame(function () { wrap.classList.add('on'); }); $('cardClose').focus(); }
    function close() { wrap.classList.remove('on'); setTimeout(function () { wrap.hidden = true; }, 260); $('cardBtn').focus(); }
    $('cardBtn').addEventListener('click', open);
    $('cardClose').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !wrap.hidden) close(); });
    return { open: open, close: close, turn: turn, poem: POEM };
  }
  window.PKCard = { build: build, POEM: POEM };
})();

;