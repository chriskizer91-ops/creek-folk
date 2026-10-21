// The changes What the Water Brings' own files need to run on three.js r186, applied by build.mjs when it builds
// out/r186/game.html. Nothing under ref/ is ever edited. Each `find` must occur exactly once in its file, or the build stops.
// The eight reusable modules (core, toon, toon2, skin, king3, pixel3d, valley, life) are not patched here: the build takes them
// from creekfolk2/src/look instead, where the port is marked with R186 comments. See creekfolk2/docs/R186-PORT.md.

export const PATCHES = [
  {
    id: 'colour-management-off',
    file: 'template.html',
    why: 'r128 had no colour management: a hex colour (the lights, the halo, the mist, the sky clear colour) was used as raw numbers. ' +
      'r186 converts hex to linear by default; switching it off gives the game the numbers it was tuned with. (The src/look ' +
      'modules read their hex colours the same way whether this is on or off.)',
    find: '<script>/*@@GAME@@*/</script>',
    replace: '<script>/* R186 (wtwb186 harness): r128 had no colour management */ THREE.ColorManagement.enabled = false;</script>\n<script>/*@@GAME@@*/</script>',
  },
  {
    id: 'output-colour-space',
    file: 'main.js',
    why: 'renderer.outputEncoding became outputColorSpace (r152). sRGB is the default anyway; the post pass writes its numbers as they are.',
    find: 'renderer.outputEncoding = THREE.sRGBEncoding;',
    replace: 'renderer.outputColorSpace = THREE.SRGBColorSpace; /* R186: was outputEncoding = sRGBEncoding */',
  },
  {
    id: 'light-units',
    file: 'main.js',
    why: 'r186 has only physical light units (r155, legacy mode removed in r165): a lit surface gets 1/PI of what r128 gave it, and ' +
      'the palette ramp thresholds (PKToon.TD 0.78, TL 1.12) are in r128 units. Light intensities are multiplied by PI.',
    find: 'var hemi = new THREE.HemisphereLight(0xfffaf2, 0xe4dccb, 0.45); scene.add(hemi);\n  var sun = new THREE.DirectionalLight(0xfff6e8, 0.83);',
    replace: 'var hemi = new THREE.HemisphereLight(0xfffaf2, 0xe4dccb, 0.45 * Math.PI); scene.add(hemi);   /* R186: intensities x PI (physical light units) */\n  var sun = new THREE.DirectionalLight(0xfff6e8, 0.83 * Math.PI);',
  },
  {
    id: 'light-units-day',
    file: 'main.js',
    why: 'The same for the intensities set every frame through the day (x PI).',
    find: 'sun.intensity = (0.35 + 0.48 * day) * (1 - st * 0.4); hemi.intensity = 0.3 + 0.15 * day;',
    replace: 'sun.intensity = (0.35 + 0.48 * day) * (1 - st * 0.4) * Math.PI; hemi.intensity = (0.3 + 0.15 * day) * Math.PI;   /* R186: x PI */',
  },
  {
    id: 'light-units-icons',
    file: 'main.js',
    why: 'The same for the lights of the little scene the find icons are drawn in (x PI).',
    find: 'ICON.scene.add(new THREE.HemisphereLight(0xfffaf2, 0xe4dccb, 0.5)); var dl = new THREE.DirectionalLight(0xfff6e8, 0.85);',
    replace: 'ICON.scene.add(new THREE.HemisphereLight(0xfffaf2, 0xe4dccb, 0.5 * Math.PI)); var dl = new THREE.DirectionalLight(0xfff6e8, 0.85 * Math.PI);   /* R186: x PI */',
  },
  {
    id: 'alpha-halo',
    file: 'main.js',
    why: 'r186 forces alpha 1 on non-transparent built-in materials, so the halo\'s tag (opacity 0.25: shines, no ink) would be lost. ' +
      'PKPixel3D.keepAlpha keeps the opacity in the alpha, as r128 did.',
    find: "HALO_MAT = new THREE.MeshBasicMaterial({ color: '#fff2c8', opacity: 0.25, depthWrite: false, depthFunc: THREE.GreaterDepth });",
    replace: "HALO_MAT = PKPixel3D.keepAlpha(new THREE.MeshBasicMaterial({ color: '#fff2c8', opacity: 0.25, depthWrite: false, depthFunc: THREE.GreaterDepth }));   /* R186: keep the alpha tag */",
  },
  {
    id: 'alpha-mist',
    file: 'main.js',
    why: 'The morning mist\'s tag (opacity 0.5: soft, no ink) would be lost the same way.',
    find: "mm.customProgramCacheKey = function () { return 'pk-mist'; };",
    replace: "mm.customProgramCacheKey = function () { return 'pk-mist'; }; PKPixel3D.keepAlpha(mm);   /* R186: keep the alpha tag */",
  },
  {
    id: 'alpha-cave-shadows',
    file: 'main.js',
    why: 'The shadows on the cave wall in the ending (opacity 0.5: soft, no ink outline) would lose their tag.',
    find: "var m = new THREE.MeshBasicMaterial({ map: SH.tex, opacity: 0.5, alphaTest: 0.3, depthWrite: false });",
    replace: "var m = PKPixel3D.keepAlpha(new THREE.MeshBasicMaterial({ map: SH.tex, opacity: 0.5, alphaTest: 0.3, depthWrite: false }));   /* R186: keep the alpha tag */",
  },
  {
    id: 'alpha-easy-disc',
    file: 'main.js',
    why: 'The Easy to see disc under him (opacity 0.25: shines). This version never shows it (its update is behind if (false)), ' +
      'so this only keeps the tag right should it come back.',
    find: "var dm = new THREE.MeshBasicMaterial({ color: '#fff2c8', opacity: 0.25, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -40 });",
    replace: "var dm = PKPixel3D.keepAlpha(new THREE.MeshBasicMaterial({ color: '#fff2c8', opacity: 0.25, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -40 }));   /* R186: keep the alpha tag */",
  },
];
