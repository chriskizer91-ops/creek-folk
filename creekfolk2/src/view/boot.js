// Starts the app, once the page's markup (after the scripts, in page-tail.html) is there.
var app = new App();
window.__cf2 = app; // for the browser tests
app.Clock = Clock;
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => app.start());
else app.start();
