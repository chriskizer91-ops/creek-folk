// ==========================================================================
// How Creekfolk 2's view uses What the Water Brings' renderer on three.js r186, following
// the port's rules (docs/R186-PORT.md):
//   - colour management off, as in r128: hex colours are the numbers the look was tuned with
//   - light intensities times PI (r186's physical light units)
//   - colours for materials and vertices from PKCore.col (linear from a hex), and pictures
//     drawn on a canvas marked sRGB, so every colour reaches the pixel pass's palette exactly
// ==========================================================================

var CF2_LIGHT = Math.PI;

function cf2PrepareRenderer(r) {
  THREE.ColorManagement.enabled = false;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NoToneMapping;
}
function cf2PrepareTexture(tex) {
  tex.colorSpace = THREE.SRGBColorSpace;
}
function cf2SetColor(c, hex) {
  return c.copy(PKCore.col(hex));
}
