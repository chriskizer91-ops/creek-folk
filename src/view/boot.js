// Start the app once the page is ready.
window.addEventListener("DOMContentLoaded", () => {
  try {
    new App();
  } catch (i) {
    console.error(i);
    document.body.innerHTML = `<div style="padding:24px;font-family:system-ui;color:#2a1f2e;background:#fff8ec;height:100vh">Sorry — the valley couldn’t start on this device.<br><small>${String(i && i.message || i)}</small></div>`;
  }
});
