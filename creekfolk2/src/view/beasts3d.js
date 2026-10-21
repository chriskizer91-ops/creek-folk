// ==========================================================================
// The simulation's own animals in the 3D view (Creekfolk 1's 3C, at this valley's size):
//   - the beavers (world.beavers): swimming between the lodge and the dams they tend, out of
//     sight inside the lodge; positions between the simulation's minute steps are filled in
//     the way 3C's view does it
//   - the glowing fish run (world.returning.active): on midwinter night, once the creek has
//     healed, a run of softly glowing fish swims up the creek, on toward the old valley
// The lodge itself and the beavers' little side dams are drawn with the ground (valley3d.js).
// Reads the page's copy of the valley; never changes it.
//
//   CF2Beasts.create(view) -> { update(t, dt) }
// ==========================================================================

var CF2Beasts = (function () {
  var P = CF2Valley.PAINT;
  P.beaver = ["#4a3220", "#6a4a30", "#8a6a48"];
  P.beaverK = ["#241a12", "#2e2420", "#3a2a1c"];
  P.fishGlow = ["#6ad0ea", "#aaf6ff", "#e8ffff"];
  P.fishHalo = ["#3a9ac8", "#5ad8ff", "#9ae8ff"];

  function hash01(i) {
    var h = Math.imul(i * 374761393 + 1013904223, 668265263) >>> 0;
    return ((h ^ (h >>> 13)) % 10000) / 10000;
  }
  function create(view) {
    var vw = view.vw,
      V = view.valley,
      grp = new THREE.Group();
    grp.name = "Beasts";
    view.scene.add(grp);
    var beavers = new Map();
    // a beaver: a round body, a head with small dark eyes, the flat tail (a kit is smaller)
    function beaverMesh(b) {
      var s = b.age === "kit" ? 0.6 : 1,
        g = new THREE.Group(),
        body = new THREE.Group(),
        fur = V.paint("beaver"),
        dark = V.paint("beaverK", { flat: true }),
        add = (geo, m, x, y, z, sx, sy, sz) => {
          var o = new THREE.Mesh(geo, m);
          o.position.set(x * s, y * s, z * s);
          o.scale.set(sx || 1, sy || 1, sz || 1);
          o.castShadow = true;
          body.add(o);
          return o;
        };
      add(new THREE.SphereGeometry(0.17 * s, 9, 6), fur, 0, 0, 0, 1.55, 0.85, 1);
      add(new THREE.SphereGeometry(0.11 * s, 8, 6), fur, 0.25, 0.04, 0);
      add(new THREE.SphereGeometry(0.03 * s, 5, 4), dark, 0.35, 0.05, 0);
      add(new THREE.BoxGeometry(0.26 * s, 0.035 * s, 0.15 * s), dark, -0.36, -0.03, 0);
      add(new THREE.SphereGeometry(0.022 * s, 5, 4), dark, 0.29, 0.1, 0.06);
      add(new THREE.SphereGeometry(0.022 * s, 5, 4), dark, 0.29, 0.1, -0.06);
      add(new THREE.SphereGeometry(0.03 * s, 5, 4), fur, 0.21, 0.13, 0.07);
      add(new THREE.SphereGeometry(0.03 * s, 5, 4), fur, 0.21, 0.13, -0.07);
      g.add(body);
      grp.add(g);
      return { obj: g, body, age: b.age };
    }
    function waterY(x, z) {
      var w = V.water(x, z);
      return w == null ? V.height(x, z) : w;
    }
    // the fish run: instanced glowing fish and a faint halo under each
    var NF = 90,
      fishGeo = new THREE.BoxGeometry(0.42, 0.06, 0.15),
      haloGeo = new THREE.SphereGeometry(0.5, 10, 3).scale(1.1, 0.04, 0.55),
      fish = new THREE.InstancedMesh(fishGeo, V.paint("fishGlow", { glow: true }), NF),
      halo = new THREE.InstancedMesh(haloGeo, V.paint("fishHalo", { soft: true }), NF),
      o3 = new THREE.Object3D();
    fish.frustumCulled = halo.frustumCulled = false;
    fish.visible = halo.visible = false;
    grp.add(fish, halo);
    function fishRun(t, clock) {
      var A = vw.fishRun,
        D = VALLEY_DAY,
        k = A && t >= A.dusk - 0.02 * D ? clamp((t - (A.dusk - 0.02 * D)) / (0.04 * D), 0, 1) * clamp((A.end - t) / (0.05 * D), 0, 1) : 0;
      fish.visible = halo.visible = k > 0.01 && !!vw.nodes;
      if (!fish.visible) return;
      var ns = vw.nodes,
        zTop = -12,
        zBot = VL + 2,
        L = zBot - zTop,
        n = Math.max(1, Math.round(NF * k));
      for (var j = 0; j < n; j++) {
        var p = (clock * 0.012 + j / NF + hash01(j) * 0.02) % 1,
          z = zBot - p * L,
          i = clamp(creekNodeIndex(z), 0, ns.length - 1),
          x = view.vw.T.creekX(z) + (hash01(j * 3) - 0.5) * Math.min(1.2, ns[i].wb * 0.6) + Math.sin(clock * 2 + j) * 0.08,
          y = Math.max(ns[i].wl, V.height(x, z)) + 0.04,
          ry = Math.PI / 2 + Math.sin(clock * 3 + j) * 0.15;
        o3.position.set(x, y, z);
        o3.rotation.set(0, ry, 0);
        o3.scale.setScalar(0.9 + 0.3 * hash01(j + 5));
        o3.updateMatrix();
        fish.setMatrixAt(j, o3.matrix);
        o3.position.y = y - 0.02;
        o3.scale.setScalar(1);
        o3.updateMatrix();
        halo.setMatrixAt(j, o3.matrix);
      }
      fish.count = halo.count = n;
      fish.instanceMatrix.needsUpdate = halo.instanceMatrix.needsUpdate = true;
    }
    var clock = 0;
    function update(t, dt) {
      clock += dt;
      fishRun(t, clock);
      var B = vw.beavers;
      // beavers are small: only drawn close in
      if (!B || view.view.hv > 60) {
        for (var v0 of beavers.values()) v0.obj.visible = false;
        return;
      }
      var seen = new Set();
      for (var b of B.list || []) {
        seen.add(b.id);
        var v = beavers.get(b.id);
        if (v && v.age !== b.age) grp.remove(v.obj), (v = null);
        if (!v) beavers.set(b.id, (v = beaverMesh(b)));
        var inLodge = b.task === "home" && t >= b.at;
        v.obj.visible = !inLodge;
        if (inLodge) continue;
        var k = b.at > b.pt ? clamp((t - b.pt) / (b.at - b.pt), 0, 1) : 1,
          x = b.px + (b.x - b.px) * k,
          z = b.pz + (b.z - b.pz) * k;
        // a little drift while they work or play
        if (k >= 1 && b.task !== "swim") (x += Math.sin(clock * 0.7 + b.id) * 0.25), (z += Math.cos(clock * 0.5 + b.id * 2) * 0.35);
        var y = waterY(x, z),
          swimming = V.water(x, z) != null;
        v.obj.position.set(x, y - (swimming ? 0.08 : -0.02), z);
        var dx = b.x - b.px,
          dz = b.z - b.pz;
        if (k < 1 && Math.hypot(dx, dz) > 0.05) v.obj.rotation.y = Math.atan2(-dz, dx);
        v.body.position.y = swimming ? Math.sin(clock * 3 + b.id) * 0.015 : 0;
        v.body.rotation.z = b.task === "work" ? -0.15 + Math.sin(clock * 5 + b.id) * 0.1 : 0;
      }
      for (var [id, v2] of beavers) if (!seen.has(id)) grp.remove(v2.obj), beavers.delete(id);
    }
    return { update, group: grp };
  }
  return { create };
})();
