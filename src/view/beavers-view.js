// Phase 3C: the beavers, their lodge, and their little stick dams. Reads world.beavers.

var BEAVER_FUR = [0x6a4a30, 0x5a3e28, 0x7a5636];

var BeaverView = class {
  constructor(world, scene, group) {
    this.world = world;
    this.group = new Pe();
    group.add(this.group);
    this.beavers = new Map();
    this.lodge = null;
    this.lodgeKey = "";
    this.small = null;
    this.smallKey = "";
  }
  dispose() {
    this.group.traverse((o) => o.geometry && o.geometry.dispose());
    this.group.parent && this.group.parent.remove(this.group);
  }
  waterY(x, z) {
    let w = this.world,
      cr = w.creek,
      i = clamp(creekNodeIndex(z), 0, cr.nodes.length - 1),
      n = cr.nodes[i],
      lv = Math.max(cr._pondNow ? cr._pondNow[i] : -1e9, n.wl),
      h = w.terrain.heightAt(clamp(x, 0, VW - 0.01), clamp(z, 0, VL - 0.01));
    return lv > h - 0.02 ? lv : h;
  }
  beaverMesh(b) {
    let fur = BEAVER_FUR[b.id % BEAVER_FUR.length],
      s = b.age === "kit" ? 0.6 : 1,
      g = mergeParts([
        part(Bn(0.17 * s, 7, 5), fur, { sx: 1.55, sy: 0.85, sz: 1 }),
        part(Bn(0.11 * s, 6, 5), fur, { x: 0.25 * s, y: 0.04 * s }),
        part(Bn(0.03 * s, 4, 3), 0x2a1a10, { x: 0.35 * s, y: 0.05 * s }),
        part(lt(0.26 * s, 0.035 * s, 0.15 * s), 0x2e2420, { x: -0.36 * s, y: -0.03 * s }),
        part(Bn(0.025 * s, 4, 3), 0x3a2a1c, { x: 0.22 * s, y: 0.13 * s, z: 0.06 * s }),
        part(Bn(0.025 * s, 4, 3), 0x3a2a1c, { x: 0.22 * s, y: 0.13 * s, z: -0.06 * s }),
      ]),
      m = new Et(g, he());
    m.castShadow = true;
    let o = new Pe();
    o.add(m);
    this.group.add(o);
    return { obj: o, mesh: m, age: b.age };
  }
  update(clock, night) {
    let w = this.world,
      B = w.beavers;
    if (!B) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;
    this.updateLodge(B);
    this.updateSmall(B);
    let seen = new Set();
    for (let b of B.list) {
      seen.add(b.id);
      let v = this.beavers.get(b.id);
      if (v && v.age !== b.age) {
        this.group.remove(v.obj);
        v.mesh.geometry.dispose();
        v = null;
      }
      if (!v) this.beavers.set(b.id, (v = this.beaverMesh(b)));
      // in the lodge: out of sight
      let inLodge = b.task === "home" && w.t >= b.at;
      v.obj.visible = !inLodge;
      if (inLodge) continue;
      let k = b.at > b.pt ? clamp((w.t - b.pt) / (b.at - b.pt), 0, 1) : 1,
        x = b.px + (b.x - b.px) * k,
        z = b.pz + (b.z - b.pz) * k;
      // a little drift while they work or play
      if (k >= 1 && b.task !== "swim") (x += Math.sin(clock * 0.7 + b.id) * 0.25), (z += Math.cos(clock * 0.5 + b.id * 2) * 0.35);
      let y = this.waterY(x, z),
        swimming = y > w.terrain.heightAt(clamp(x, 0, VW - 0.01), clamp(z, 0, VL - 0.01)) + 0.01;
      v.obj.position.set(x, y - (swimming ? 0.08 : -0.02), z);
      let dx = b.x - b.px,
        dz = b.z - b.pz;
      if (k < 1 && Math.hypot(dx, dz) > 0.05) v.obj.rotation.y = Math.atan2(-dz, dx);
      else if (k >= 1) v.obj.rotation.y += Math.sin(clock * 0.3 + b.id) * 0.004;
      // swimming: a gentle bob; working at a dam: a nodding head
      v.mesh.position.y = swimming ? Math.sin(clock * 3 + b.id) * 0.015 : 0;
      v.mesh.rotation.z = b.task === "work" ? -0.15 + Math.sin(clock * 5 + b.id) * 0.1 : 0;
    }
    for (let [id, v] of this.beavers)
      if (!seen.has(id)) {
        this.group.remove(v.obj);
        v.mesh.geometry.dispose();
        this.beavers.delete(id);
      }
  }
  // A dome of sticks at the pond's edge, growing as sticks come in.
  updateLodge(B) {
    let L = B.lodge,
      key = L.x + ":" + L.z + ":" + Math.round(L.size * 10);
    if (key === this.lodgeKey) return;
    this.lodgeKey = key;
    if (this.lodge) this.group.remove(this.lodge), this.lodge.geometry.dispose();
    let s = 0.55 + 0.6 * L.size,
      parts = [part(Bn(0.9 * s, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), 0x5e4630, { sy: 0.7 })];
    // sticks woven round the mound, lying along it
    for (let i = 0; i < 20; i++) {
      let a = (i / 20) * Math.PI * 2 * 2.3 + hash01(i) * 0.5,
        el = 0.2 + (i / 20) * 1.0, // from the water's edge up toward the top
        r = 0.92 * s * Math.cos(el),
        y = 0.64 * s * Math.sin(el);
      parts.push(part(lt(0.8 * s * Math.max(0.35, Math.cos(el)), 0.045, 0.045), i % 3 ? 0x6e5236 : 0x8a6a48, { x: Math.cos(a) * r, y: y + 0.02, z: Math.sin(a) * r, ry: -(a + Math.PI / 2) + (hash01(i + 9) - 0.5) * 0.5 }));
    }
    let m = new Et(mergeParts(parts), he());
    m.castShadow = true;
    let w = this.world,
      y = Math.min(this.waterY(L.x, L.z), w.terrain.heightAt(clamp(L.x, 0, VW - 0.01), clamp(L.z, 0, VL - 0.01))) - 0.05;
    m.position.set(L.x, y, L.z);
    this.lodge = m;
    this.group.add(m);
  }
  updateSmall(B) {
    let key = B.small.map((s) => s.x + ":" + s.z).join(",");
    if (key === this.smallKey) return;
    this.smallKey = key;
    if (this.small) this.group.remove(this.small), this.small.geometry.dispose();
    if (!B.small.length) return (this.small = null);
    let w = this.world,
      parts = [];
    B.small.forEach((s, j) => {
      let y = w.terrain.heightAt(clamp(s.x, 0, VW - 0.01), clamp(s.z, 0, VL - 0.01));
      for (let i = 0; i < 7; i++) parts.push(part(yt(0.025, 0.03, 0.9, 3), i % 2 ? 0x6e5236 : 0x5a4028, { x: s.x + (i - 3) * 0.12, y: y + 0.06 + (i % 3) * 0.04, z: s.z + (hash01(j * 9 + i) - 0.5) * 0.2, rz: Math.PI / 2, ry: (hash01(j * 5 + i) - 0.5) * 0.6 }));
    });
    this.small = new Et(mergeParts(parts), he());
    this.group.add(this.small);
  }
};
VIEW_EXTRAS.push(BeaverView);
