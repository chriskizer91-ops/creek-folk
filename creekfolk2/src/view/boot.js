// Starts the app, once the page's markup (after the scripts, in page-tail.html) is there.
var app = new App();
window.__cf2 = app; // for the browser tests
app.Clock = Clock;
app.art = { creekSprites, clothOf, spriteLooks, Folk3D, PKPixel3D, PKToon, spritePalette, folkPalette, cf2PrepareRenderer, CF2_LIGHT }; // for tools/sprite-sheet.mjs and folk-sheet.mjs
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => app.start());
else app.start();
