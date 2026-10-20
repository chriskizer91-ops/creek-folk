  var PALETTE = {
      grass: 8829023,
      grass2: 7776342,
      grass3: 6724172,
      meadow: 9684074,
      dirt: 11048038,
      dirt2: 9600855,
      mud: 8149820,
      sand: 14073994,
      bank: 9399879,
      rock: 9277322,
      rock2: 7764598,
      hill: 6130250,
      hill2: 5143104,
      trunk: 7031339,
      birch: 15261900,
      leaf: 5214014,
      leaf2: 6793548,
      leaf3: 4160058,
      pine: 3107654,
      willow: 8827484,
      stone: 10396584,
      stone2: 8423052,
      clay: 13201221,
      reed: 10470490,
      cattail: 7031339,
      berry: 14239322,
      bluberry: 5992406,
      glow: 9435120,
      pod: 9083452,
      pod2: 7240238,
      mudwall: 10844754,
      mudwall2: 9332292,
      thatch: 14267482,
      thatch2: 12884549,
      tile: 11818814,
      tile2: 9388080,
      plank: 11237954,
      plank2: 9200181,
      rope: 14205066,
      soil: 6965808,
      greens: 6274890,
      fruit: 15764026,
      water: 4891593,
      white: 16775404,
      dark: 2760494,
      flower1: 16044894,
      flower2: 15625293,
      flower3: 16228804,
      flower4: 16777215
    },
    zc = new wt();
  function tintGeometry(i, t, e = {}) {
    i = i.index ? i.toNonIndexed() : i;
    let n = i.attributes.position.count,
      s = new Float32Array(n * 3);
    zc.set(t);
    let r = e.jitter || 0;
    for (let o = 0; o < n; o += 3) {
      let a = zc.r,
        l = zc.g,
        c = zc.b;
      if (r) {
        let h =
        1 + Math.sin(o * 12.9898 + (e.seed || 0)) * 43758.5453 % 1 * r;
        a *= h, l *= h, c *= h;
      }
      for (let h = 0; h < 3 && o + h < n; h++)
      s[(o + h) * 3] = a,
      s[(o + h) * 3 + 1] = l,
      s[(o + h) * 3 + 2] = c;
    }
    return (
      i.setAttribute("color", new Le(s, 3)),
      i.attributes.uv && i.deleteAttribute("uv"),
      i.attributes.normal && i.deleteAttribute("normal"),
      i);

  }
  function part(
  i,
  t,
  {
    x: e = 0,
    y: n = 0,
    z: s = 0,
    rx: r = 0,
    ry: o = 0,
    rz: a = 0,
    sx: l = 1,
    sy: c = 1,
    sz: h = 1,
    jitter: d = 0,
    seed: u = 0
  } = {})
  {
    let f = tintGeometry(i, t, { jitter: d, seed: u }),
      p = new se().compose(
        new z(e, n, s),
        new mn().setFromEuler(new bn(r, o, a)),
        new z(l, c, h)
      );
    return f.applyMatrix4(p), f;
  }
  function mergeParts(i) {
    let t = i.filter(Boolean);
    if (!t.length) return null;
    let e = gm(t, !1);
    for (let n of t) n.dispose();
    return e.computeVertexNormals(), e;
  }
  var lt = (i, t, e) => new Un(i, t, e),
    yt = (i, t, e, n = 6) => new Ar(i, t, e, n),
    ze = (i, t, e = 6) => new Ii(i, t, e),
    qt = (i, t = 0) => new jn(i, t),
    on = (i) => new No(i, 0),
    Bn = (i, t = 6, e = 4) => new ks(i, t, e),
    id = (i, t, e = 4, n = 10) => new zo(i, t, e, n),
    nd = null;
  function he() {
    return nd || (nd = new Qe({ vertexColors: !0, flatShading: !0 })), nd;
  }
  function hash01(i) {
    let t = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  }
  var Be = (i) => new wt(i),
    GroundView = class {
      constructor(t, e) {
        this.world = t,
        this.scene = e,
        this.group = new Pe(),
        e.add(this.group),
        this.buildGround(),
        this.buildWater(),
        this.buildDecor(),
        this.wearBucket = new Uint8Array(4096),
        this.lastWearCheck = 0;
      }
      dispose() {
        this.group.traverse((t) => {
          t.geometry && t.geometry.dispose();
        }),
        this.scene.remove(this.group),
        this.waterMat && this.waterMat.dispose();
      }
      baseCellColor(t, e) {
        let n = this.world.terrain,
          s = t + 0.5,
          r = e + 0.5;
        if (t < 0 || e < 0 || t >= 64 || e >= 64) {
          let p = n.noise.get(s * 0.35 + 50, r * 0.35);
          return n.edgeDist(s, r) < 0 ?
          Be(PALETTE.mud).multiplyScalar(0.55) :
          Be(p > 0.5 ? PALETTE.hill : PALETTE.hill2).multiplyScalar(
            0.9 + hash01(t * 31 + e * 7 + 999) * 0.12
          );
        }
        let o = n.edgeDist(s, r),
          a = n.valleyR(s, r),
          l = n.heightAt(s, r),
          c = n.noise.get(s * 0.35, r * 0.35),
          h = hash01(t * 131 + e * 17);
        if (o < -0.2) return Be(PALETTE.mud).multiplyScalar(0.55);
        if (o < 0.45) return Be(PALETTE.bank).multiplyScalar(0.9 + h * 0.15);
        if (o < 1.1)
        return Be(c > 0.55 ? PALETTE.sand : PALETTE.mud).lerp(Be(PALETTE.grass2), 0.3);
        let d =
        Math.abs(n.heightAt(s + 1, r) - n.heightAt(s - 1, r)) +
        Math.abs(n.heightAt(s, r + 1) - n.heightAt(s, r - 1));
        if (a > 0.88 && d > 2.6)
        return Be(h > 0.5 ? PALETTE.rock : PALETTE.rock2).multiplyScalar(0.9 + c * 0.2);
        if (a > 0.9)
        return Be(c > 0.5 ? PALETTE.hill : PALETTE.hill2).multiplyScalar(0.92 + h * 0.12);
        let u = n.noise.fbm(s * 0.06 + 20, r * 0.06, 2);
        return Be(PALETTE.grass2).
        lerp(Be(PALETTE.meadow), Math.min(1, Math.max(0, (u - 0.3) * 2.2))).
        multiplyScalar(0.97 + h * 0.04 + (l - 1) * 0.02);
      }
      buildGround() {
        let t = this.world.terrain,
          e = 64,
          n = 18;
        this.PAD = n;
        let s = e + n * 2;
        this.G = s;
        let r = (d, u) =>
          d >= 0 && u >= 0 && d <= e && u <= e ?
          t.h[u * (e + 1) + d] :
          t.heightRaw(d, u),
          o = new Float32Array(s * s * 6 * 3),
          a = new Float32Array(s * s * 6 * 3);
        this.cellColor = new Array(s * s);
        let l = 0;
        for (let d = 0; d < s; d++)
        for (let u = 0; u < s; u++) {
          let f = u - n,
            p = d - n,
            x = r(f, p),
            g = r(f + 1, p),
            m = r(f, p + 1),
            b = r(f + 1, p + 1),
            y = !1 ?
            [
            [f, x, p],
            [f, m, p + 1],
            [f + 1, b, p + 1],
            [f, x, p],
            [f + 1, b, p + 1],
            [f + 1, g, p]] :

            [
            [f, x, p],
            [f, m, p + 1],
            [f + 1, g, p],
            [f + 1, g, p],
            [f, m, p + 1],
            [f + 1, b, p + 1]];

          for (let [S, M, A] of y) o[l++] = S, o[l++] = M, o[l++] = A;
          this.cellColor[d * s + u] = this.baseCellColor(f, p);
        }
        let c = new ye();
        c.setAttribute("position", new Le(o, 3)),
        c.setAttribute("color", new Le(a, 3)),
        c.computeVertexNormals(),
        this.groundGeo = c;
        for (let d = 0; d < s * s; d++) this.paintCell(d, 0);
        let h = new Et(c, new Qe({ vertexColors: !0, flatShading: !0 }));
        h.receiveShadow = !0, this.ground = h, this.group.add(h);
      }
      gi(t) {
        let e = t % 64;
        return (Math.floor(t / 64) + this.PAD) * this.G + (e + this.PAD);
      }
      paintCell(t, e) {
        let n = this.groundGeo.attributes.color.array,
          s = this.cellColor[t];
        for (let r = 0; r < 6; r++) {
          let o = (t * 6 + r) * 3,
            a = r < 3 ? 1 : 0.97;
          n[o] = s.r * a, n[o + 1] = s.g * a, n[o + 2] = s.b * a;
        }
      }
      cornerWet(t, e) {
        let n = this.world.wet;
        if (!n) return 0;
        let s = 0,
          r = 0;
        for (let o = -1; o <= 0; o++)
        for (let a = -1; a <= 0; a++) {
          let l = t + a,
            c = e + o;
          l < 0 || c < 0 || l >= 64 || c >= 64 || (s += n[c * 64 + l], r++);
        }
        return r ? s / r : 0;
      }
      cornerWear(t, e) {
        let n = this.world.wear,
          s = 0,
          r = 0;
        for (let l = -1; l <= 0; l++)
        for (let c = -1; c <= 0; c++) {
          let h = t + c,
            d = e + l;
          h < 0 || d < 0 || h >= 64 || d >= 64 || (s += n[d * 64 + h], r++);
        }
        let o = r ? s / r : 0,
          a = Math.min(1, Math.max(0, (o - 6) / 30));
        return a * a * (3 - 2 * a) * 0.92;
      }
      updateWear(t) {
        if (t - this.lastWearCheck < 4) return;
        this.lastWearCheck = t;
        let e = this.groundGeo.attributes.color.array,
          n = Be(PALETTE.dirt),
          s = Be(PALETTE.dirt2),
          r = Be(7232060),
          o = Be(6465610),
          a = Be(7314766),
          l = Be(8362576),
          c = Be(6261338),
          h = Be(7241548),
          d = 65,
          u = this.cw || (this.cw = new Float32Array(d * d)),
          f = this.cq || (this.cq = new Float32Array(d * d)),
          p = !1;
        for (let m = 0; m < d; m++)
        for (let b = 0; b < d; b++) {
          let T = Math.round(this.cornerWear(b, m) * 24) / 24;
          T !== u[m * d + b] && (u[m * d + b] = T, p = !0);
          let y = Math.round(this.cornerWet(b, m) * 20) / 20;
          y !== f[m * d + b] && (f[m * d + b] = y, p = !0);
        }
        if (!p) return;
        let x = (m, b, T) => {
            let y = Math.min(1, Math.max(0, (T - m) / (b - m)));
            return y * y * (3 - 2 * y);
          },
          g = new wt();
        for (let m = 0; m < 64; m++)
        for (let b = 0; b < 64; b++) {
          let T = this.gi(m * 64 + b),
            y = this.cellColor[T],
            S = [
            [b, m],
            [b, m + 1],
            [b + 1, m],
            [b + 1, m],
            [b, m + 1],
            [b + 1, m + 1]];

          for (let M = 0; M < 6; M++) {
            let [A, v] = S[M],
              E = u[v * d + A],
              R = f[v * d + A];
            if (g.copy(y), R > 0.1) {
              let B = hash01(T * 7 + 3) < 0.5;
              g.lerp(o, x(0.1, 0.4, R) * 0.7),
              R > 0.4 && g.lerp(B ? a : l, x(0.4, 0.7, R) * 0.8),
              R > 0.7 && g.lerp(B ? c : h, x(0.7, 1, R) * 0.6);
            }
            g.lerp(R > 0.45 ? r : E > 0.6 ? s : n, E);
            let P = M < 3 ? 1 : 0.97,
              N = (T * 6 + M) * 3;
            e[N] = g.r * P, e[N + 1] = g.g * P, e[N + 2] = g.b * P;
          }
        }
        this.groundGeo.attributes.color.needsUpdate = !0;
      }
      buildWater() {
        let t = this.world.terrain,
          e = [],
          n = [],
          s = 0.5;
        for (let a = -4; a < 68; a += s) {
          let l = a + s,
            c = t.creekX(a) - t.creekHW(a) - 0.35,
            h = t.creekX(a) + t.creekHW(a) + 0.35,
            d = t.creekX(l) - t.creekHW(l) - 0.35,
            u = t.creekX(l) + t.creekHW(l) + 0.35,
            f = WATER_LEVEL;
          e.push(c, f, a, d, f, l, h, f, a, h, f, a, d, f, l, u, f, l),
          n.push(0, a, 0, l, 1, a, 1, a, 0, l, 1, l);
        }
        let r = new ye();
        r.setAttribute("position", new Zt(e, 3)),
        r.setAttribute("uv", new Zt(n, 2)),
        this.waterMat = new Ke({
          uniforms: {
            uTime: { value: 0 },
            uLight: { value: 1 },
            uRain: { value: 0 },
            uDeep: { value: Be(3112872) },
            uShallow: { value: Be(5813460) },
            uFoam: { value: Be(14218495) },
            uTint: { value: Be(16777215) }
          },
          vertexShader:
          "varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vec4 wp=modelMatrix*vec4(position,1.); vW=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }",
          fragmentShader: `
        uniform float uTime, uLight, uRain; uniform vec3 uDeep, uShallow, uFoam, uTint;
        varying vec2 vUv; varying vec3 vW;
        float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
        void main(){
          float edge = min(vUv.x, 1.0-vUv.x);
          vec3 c = mix(uShallow, uDeep, smoothstep(0.05, 0.35, edge));
          // flowing glints
          vec2 cell = floor(vec2(vW.x*7.0, vW.z*3.5 - uTime*2.4));
          float g = h(cell);
          float glint = step(0.965 - uRain*0.03, g) * step(0.12, edge);
          c = mix(c, uFoam, glint*0.65);
          // bank foam
          c = mix(c, uFoam, (1.0 - smoothstep(0.0, 0.07, edge))*0.55);
          // rain ripples
          vec2 rc = floor(vec2(vW.x*4.0, vW.z*4.0));
          float rr = step(0.985, h(rc + floor(uTime*3.0))) * uRain;
          c = mix(c, uFoam, rr*0.8);
          gl_FragColor = vec4(c * uTint * (0.25 + 0.75*uLight), 1.0);
          #include <colorspace_fragment>
        }`
        });
        let o = new Et(r, this.waterMat);
        this.water = o, this.group.add(o);
      }
      buildDecor() {
        let t = this.world.terrain,
          e = [],
          n = [PALETTE.flower1, PALETTE.flower2, PALETTE.flower3, PALETTE.flower4],
          s = 1;
        for (let a = 0; a < 900; a++) {
          let l = hash01(s++) * 64,
            c = hash01(s++) * 64;
          if (!t.walkable(l, c) || t.edgeDist(l, c) < 0.8) continue;
          let h = t.heightAt(l, c),
            d = hash01(s++);
          d < 0.75 ?
          e.push(
            part(ze(0.06, 0.22, 3), d < 0.4 ? PALETTE.grass3 : PALETTE.grass2, {
              x: l,
              y: h + 0.09,
              z: c,
              ry: d * 6
            })
          ) :
          e.push(
            part(qt(0.05, 0), n[Math.floor(hash01(s++) * 4)], {
              x: l,
              y: h + 0.06,
              z: c
            })
          );
        }
        for (let a = 0; a < 260; a++) {
          let l = hash01(s++) * 64,
            c = hash01(s++) < 0.5 ? 0 : 1,
            h = t.bankPoint(c, l, hash01(s++) * 0.6 + 0.1);
          t.valleyR(h.x, h.z) > 0.95 ||
          e.push(
            part(ze(0.04, 0.3, 3), PALETTE.reed, {
              x: h.x,
              y: t.heightAt(h.x, h.z) + 0.12,
              z: h.z,
              rz: (hash01(s++) - 0.5) * 0.4
            })
          );
        }
        for (let a = 0; a < 1100; a++) {
          let l = hash01(s++) * 96 - 16,
            c = hash01(s++) * 96 - 16,
            h = t.valleyR(l, c);
          if (h < 0.93 || h > 1.75 || t.edgeDist(l, c) < 2) continue;
          let d =
            l < 0 || c < 0 || l > 64 || c > 64 ?
            t.heightRaw(l, c) :
            t.heightAt(l, c),
            u = 0.8 + hash01(s++) * 0.7,
            f = hash01(s++);
          f < 0.7 ? (
          e.push(
            part(yt(0.08, 0.1, 0.5, 4), PALETTE.trunk, {
              x: l,
              y: d + 0.25 * u,
              z: c,
              sx: u,
              sy: u,
              sz: u
            })
          ),
          e.push(
            part(ze(0.55, 1.3, 5), f < 0.35 ? PALETTE.pine : PALETTE.leaf3, {
              x: l,
              y: d + (0.5 + 0.65) * u,
              z: c,
              sx: u,
              sy: u,
              sz: u,
              ry: f * 9
            })
          )) : (
          e.push(
            part(yt(0.08, 0.1, 0.6, 4), PALETTE.trunk, {
              x: l,
              y: d + 0.3 * u,
              z: c,
              sx: u,
              sy: u,
              sz: u
            })
          ),
          e.push(
            part(qt(0.6, 0), f < 0.85 ? PALETTE.leaf : PALETTE.hill, {
              x: l,
              y: d + 0.95 * u,
              z: c,
              sx: u,
              sy: u * 0.9,
              sz: u
            })
          ));
        }
        let r = mergeParts(e),
          o = new Et(r, he());
        o.receiveShadow = !0, this.decor = o, this.group.add(o);
      }
      update(t, e, n, s) {
        this.waterMat.uniforms.uTime.value = t,
        this.waterMat.uniforms.uLight.value = e,
        this.waterMat.uniforms.uRain.value = n,
        this.waterMat.uniforms.uTint.value.copy(s);
      }
    };
  var zs = new Map();
  function Zb(i, t) {
    let e = i + ":" + t % 4;
    if (zs.has(e)) return zs.get(e);
    let n = t % 4,
      s,
      r;
    if (i === "pine")
    s = mergeParts([part(yt(0.12, 0.18, 1.2, 5), PALETTE.trunk, { y: 0.6 })]),
    r = mergeParts([
    part(ze(1.1, 1.4, 6), PALETTE.pine, { y: 1.5 }),
    part(ze(0.85, 1.2, 6), PALETTE.pine, { y: 2.2, ry: 0.4 }),
    part(ze(0.55, 1, 6), PALETTE.leaf3, { y: 2.85 })]
    );else
    if (i === "willow") {
      s = mergeParts([part(yt(0.14, 0.22, 1.6, 5), PALETTE.trunk, { y: 0.8, rz: 0.08 })]);
      let a = [part(qt(1, 0), PALETTE.willow, { y: 1.9, sy: 0.6 })];
      for (let l = 0; l < 7; l++) {
        let c = l / 7 * 6.28 + n;
        a.push(
          part(ze(0.32, 1.5, 4), l % 2 ? PALETTE.willow : PALETTE.leaf2, {
            x: Math.cos(c) * 0.85,
            y: 1.2,
            z: Math.sin(c) * 0.85,
            rx: Math.PI
          })
        );
      }
      r = mergeParts(a);
    } else
    i === "podtree" ? (
    s = mergeParts([
    part(yt(0.2, 0.3, 1.7, 6), PALETTE.trunk, { y: 0.85 }),
    part(yt(0.08, 0.1, 0.9, 4), PALETTE.trunk, { x: 0.4, y: 1.6, rz: -0.6 })]
    ),
    r = mergeParts([
    part(qt(1.25, 0), PALETTE.leaf, { y: 2.3, sy: 0.75 }),
    part(qt(0.8, 0), PALETTE.leaf2, { x: 0.7, y: 2, z: 0.3 }),
    part(qt(0.75, 0), PALETTE.leaf3, { x: -0.6, y: 2.1, z: -0.4 }),
    part(Bn(0.18, 5, 4), PALETTE.pod, { x: 0.5, y: 1.55, z: 0.6, sy: 1.5 }),
    part(Bn(0.16, 5, 4), PALETTE.pod2, { x: -0.7, y: 1.6, z: 0.2, sy: 1.5 })]
    )) :
    i === "birch" ? (
    s = mergeParts([
    part(yt(0.1, 0.14, 1.9, 5), PALETTE.birch, { y: 0.95 }),
    part(lt(0.12, 0.05, 0.13), PALETTE.dark, { y: 0.7 }),
    part(lt(0.12, 0.05, 0.13), PALETTE.dark, { y: 1.3, ry: 1 })]
    ),
    r = mergeParts([
    part(qt(0.7, 0), PALETTE.leaf2, { y: 2.1, sy: 1.3 }),
    part(qt(0.5, 0), PALETTE.meadow, { x: 0.35, y: 1.8, z: 0.2 })]
    )) : (
    s = mergeParts([part(yt(0.16, 0.25, 1.4, 6), PALETTE.trunk, { y: 0.7 })]),
    r = mergeParts([
    part(qt(1, 0), n % 2 ? PALETTE.leaf : PALETTE.leaf2, { y: 1.95 }),
    part(qt(0.7, 0), PALETTE.leaf3, { x: 0.6, y: 1.7, z: 0.2 }),
    part(qt(0.65, 0), PALETTE.leaf, { x: -0.5, y: 1.8, z: -0.3 + n * 0.1 })]
    ));
    let o = { trunk: s, crown: r };
    return zs.set(e, o), o;
  }
  function xm(i) {
    let t = "orch" + i;
    if (zs.has(t)) return zs.get(t);
    let e, n;
    i <= 0 ? (
    e = mergeParts([part(yt(0.02, 0.03, 0.2, 3), PALETTE.trunk, { y: 0.1 })]),
    n = mergeParts([
    part(lt(0.12, 0.02, 0.06), PALETTE.greens, { y: 0.22, ry: 0.5 }),
    part(lt(0.12, 0.02, 0.06), PALETTE.greens, { y: 0.24, ry: -0.7 })]
    )) :
    i === 1 ? (
    e = mergeParts([part(yt(0.04, 0.05, 0.6, 4), PALETTE.trunk, { y: 0.3 })]),
    n = mergeParts([part(qt(0.28, 0), PALETTE.leaf2, { y: 0.7 })])) :
    i === 2 ? (
    e = mergeParts([part(yt(0.07, 0.1, 1, 5), PALETTE.trunk, { y: 0.5 })]),
    n = mergeParts([
    part(qt(0.55, 0), PALETTE.leaf2, { y: 1.25 }),
    part(qt(0.35, 0), PALETTE.leaf, { x: 0.3, y: 1.05 })]
    )) : (
    e = mergeParts([part(yt(0.12, 0.17, 1.3, 6), PALETTE.trunk, { y: 0.65 })]),
    n = mergeParts([
    part(qt(0.85, 0), PALETTE.leaf2, { y: 1.75, sy: 0.85 }),
    part(qt(0.55, 0), PALETTE.leaf, { x: 0.5, y: 1.5, z: 0.2 }),
    part(qt(0.5, 0), PALETTE.meadow, { x: -0.45, y: 1.6, z: -0.2 })]
    ));
    let s = { trunk: e, crown: n };
    return zs.set(t, s), s;
  }
  var Jb = {
      branch: () => part(yt(0.035, 0.045, 0.55, 4), PALETTE.trunk, { rz: Math.PI / 2 }),
      berry: () => part(qt(0.07, 0), 16777215),
      reed: () =>
      mergeParts([
      part(yt(0.02, 0.025, 0.9, 3), PALETTE.reed, { y: 0.45 }),
      part(yt(0.04, 0.04, 0.16, 4), PALETTE.cattail, { y: 0.86 })]
      ),
      pebble: () => part(on(0.14), 16777215),
      glowcap: () =>
      mergeParts([
      part(yt(0.025, 0.03, 0.14, 4), 15261900, { y: 0.07 }),
      part(Bn(0.08, 5, 3), 16777215, { y: 0.15, sy: 0.6 })]
      ),
      seed: () => part(lt(0.06, 0.04, 0.08), 14200944),
      cairn: () => part(on(0.11), 16777215),
      fruit: () => part(qt(0.08, 0), PALETTE.fruit)
    },
    ResourceView = class {
      constructor(t, e) {
        this.world = t,
        this.scene = e,
        this.group = new Pe(),
        e.add(this.group),
        this.views = new Map(),
        this.podViews = new Map(),
        this.effects = [],
        this.inst = {};
        let n = (s, r, o) => {
          let a = new Ts(Jb[s](), o, r);
          return (
            a.count = 0,
            a.castShadow = s === "branch" || s === "pebble",
            a.frustumCulled = !1,
            this.inst[s] = a,
            this.group.add(a),
            a);

        };
        this.glowMat = new je({ color: 16777215, vertexColors: !0 }),
        n("branch", 160, he()),
        n("berry", 260, new Qe({ vertexColors: !0 })),
        n("reed", 220, he()),
        n("pebble", 220, new Qe({ vertexColors: !0, flatShading: !0 })),
        n("glowcap", 60, this.glowMat),
        n("seed", 120, he()),
        n("cairn", 240, new Qe({ vertexColors: !0, flatShading: !0 })),
        n("fruit", 120, he()),
        this.lastInst = -1,
        this.m4 = new se(),
        this.q = new mn(),
        this.e = new bn(),
        this.v = new z(),
        this.s = new z(),
        this.col = new wt(),
        this.glowLights = [];
      }
      dispose() {
        this.group.traverse((t) => {
          t.isInstancedMesh && t.dispose();
        }),
        this.scene.remove(this.group);
      }
      h(t, e) {
        return this.world.terrain.heightAt(t, e);
      }
      makeView(t) {
        let e = new Pe(),
          n = this.h(t.x, t.z);
        e.position.set(t.x, n, t.z);
        let s = t.id * 7,
          r = hash01(s) * 6.28,
          o = null;
        switch (t.kind) {
          case "tree":
          case "podtree":{
              let a = t.kind === "podtree" ? "podtree" : t.variant,
                l = Zb(a, t.id),
                c = new Et(l.trunk, he());
              o = new Et(l.crown, he()), c.castShadow = o.castShadow = !0;
              let h =
              (0.85 + hash01(s + 1) * 0.35) * (
              t.grow !== void 0 ? 0.3 + 0.7 * t.grow : 1);
              e.scale.setScalar(h), e.rotation.y = r, e.add(c, o);
              break;
            }
          case "orchard":{
              let a = xm(t.stage),
                l = new Et(a.trunk, he());
              if (
              o = new Et(a.crown, he()),
              l.castShadow = o.castShadow = !0,
              e.rotation.y = r,
              e.add(l, o),
              t.guard)
              {
                let c = [];
                for (let h = 0; h < 6; h++) {
                  let d = h / 6 * 6.28;
                  c.push(
                    part(on(0.1), PALETTE.stone2, {
                      x: Math.cos(d) * 0.4,
                      y: 0.06,
                      z: Math.sin(d) * 0.4
                    })
                  );
                }
                e.add(new Et(mergeParts(c), he()));
              }
              break;
            }
          case "grove":{ // LIFE: a memorial tree; it grows from a sapling over the months
              let a = xm(groveStage(this.world, t)),
                l = new Et(a.trunk, he()),
                c = new Et(a.crown, he());
              l.castShadow = c.castShadow = !0, e.rotation.y = r, e.add(l, c);
              e.add(new Et(mergeParts([part(on(0.09), PALETTE.stone2, { x: 0.32, y: 0.05, z: 0.18 })]), he()));
              break;
            }
          case "sprout":{
              let a = xm(0);
              e.add(new Et(a.trunk, he()), new Et(a.crown, he()));
              break;
            }
          case "bush":{
              let a = mergeParts([
                part(qt(0.45, 0), PALETTE.leaf3, { y: 0.32, sy: 0.75 }),
                part(qt(0.32, 0), PALETTE.leaf, { x: 0.3, y: 0.26, z: 0.1, sy: 0.8 }),
                part(qt(0.3, 0), PALETTE.leaf2, {
                  x: -0.25,
                  y: 0.28,
                  z: -0.15,
                  sy: 0.8
                })]
                ),
                l = new Et(a, he());
              l.castShadow = !0, e.add(l), e.rotation.y = r;
              break;
            }
          case "reeds":{
              let a = mergeParts([part(yt(0.5, 0.6, 0.05, 7), PALETTE.mud, { y: 0 })]);
              e.add(new Et(a, he()));
              break;
            }
          case "stones":{
              let a = mergeParts([
              part(yt(0.9, 1, 0.04, 7), PALETTE.dirt2, { y: 0 }),
              part(on(0.35), PALETTE.stone2, { x: 0.5, y: 0.1, z: -0.3, sy: 0.6 })]
              );
              e.add(new Et(a, he()));
              break;
            }
          case "clay":{
              let a = mergeParts([
              part(yt(0.8, 1, 0.12, 7), PALETTE.clay, { y: 0 }),
              part(on(0.3), PALETTE.clay, { x: -0.3, y: 0.1, sy: 0.5 }),
              part(on(0.25), 11557429, { x: 0.35, y: 0.08, z: 0.3, sy: 0.5 })]
              );
              e.add(new Et(a, he()));
              break;
            }
          case "glowcap":{
              let a = mergeParts([
              part(yt(0.7, 0.8, 0.03, 7), PALETTE.soil, { y: 0 }),
              part(on(0.25), PALETTE.trunk, { x: -0.4, y: 0.1, sy: 0.6 })]
              );
              e.add(new Et(a, he()));
              let l = new Cs(9435120, 0, 5, 1.5);
              l.position.set(0, 0.5, 0),
              e.add(l),
              this.glowLights.push({ light: l, o: t });
              break;
            }
          case "log":{
              let a = mergeParts([
                part(yt(0.28, 0.3, 1.8, 7), PALETTE.trunk, { rz: Math.PI / 2, y: 0.26 }),
                part(yt(0.18, 0.18, 0.05, 7), PALETTE.dark, {
                  rz: Math.PI / 2,
                  x: 0.91,
                  y: 0.26
                }),
                part(yt(0.18, 0.18, 0.05, 7), PALETTE.dark, {
                  rz: Math.PI / 2,
                  x: -0.91,
                  y: 0.26
                }),
                part(qt(0.1, 0), PALETTE.leaf2, { x: 0.3, y: 0.5, z: 0.1 })]
                ),
                l = new Et(a, he());
              l.castShadow = !0, e.add(l), e.rotation.y = t.rot || r;
              break;
            }
          case "snag":{
              let a = [
              part(yt(0.12, 0.15, 2.3, 6), PALETTE.trunk, { rz: Math.PI / 2, y: 0.06 }),
              part(yt(0.11, 0.11, 0.04, 6), PALETTE.dark, {
                rz: Math.PI / 2,
                x: 1.16,
                y: 0.06
              })];

              for (let c = 0; c < 6; c++) {
                let h = -0.9 + c * 0.36,
                  d = (hash01(s + c) - 0.5) * 1.6;
                a.push(
                  part(
                    yt(0.025, 0.035, 0.5 + hash01(s + c + 9) * 0.5, 3),
                    c % 2 ? PALETTE.trunk : 8022602,
                    {
                      x: h,
                      y: 0.2,
                      z: (hash01(s + c + 3) - 0.5) * 0.3,
                      rx: d,
                      rz: (hash01(s + c + 5) - 0.5) * 0.8
                    }
                  )
                );
              }
              for (let c = 0; c < 4; c++)
              a.push(
                part(qt(0.13, 0), c % 2 ? PALETTE.thatch2 : PALETTE.leaf3, {
                  x: -0.7 + c * 0.45,
                  y: 0.12,
                  z: -0.15 + hash01(s + c + 20) * 0.1,
                  sy: 0.6
                })
              );
              for (let c = 0; c < 4; c++)
              a.push(
                part(lt(0.2, 0.012, 0.07), PALETTE.white, {
                  x: -0.7 + c * 0.45,
                  y: 0.03,
                  z: 0.26 + hash01(s + c + 30) * 0.12,
                  ry: (hash01(s + c) - 0.5) * 0.6
                })
              );
              let l = new Et(mergeParts(a), he());
              l.castShadow = !0,
              e.add(l),
              e.position.y = 0.37,
              e.rotation.y = t.rot || 0;
              break;
            }
          case "boulder":{
              let a = t.size || 1,
                l = mergeParts([
                part(on(0.7), PALETTE.rock, { y: 0.35, sy: 0.75 }),
                part(on(0.4), PALETTE.rock2, { x: 0.45, y: 0.2, z: 0.3, sy: 0.7 })]
                ),
                c = new Et(l, he());
              c.castShadow = !0,
              e.add(c),
              e.scale.setScalar(a),
              e.rotation.y = t.rot || r;
              break;
            }
        }
        return this.group.add(e), { obj: e, crown: o, phase: hash01(s + 3) * 6.28 };
      }
      sig(t) {
        return t.kind === "orchard" ?
        "o" + t.stage + (t.guard ? "g" : "") :
        t.kind === "grove" ? "g" + groveStage(this.world, t) :
        t.grow !== void 0 ?
        t.kind + ":" + Math.round(t.grow * 10) :
        t.kind;
      }
      sync(t, e, n) {
        let s = this.world,
          r = new Set();
        this.fadeMat || (
        this.fadeMat = new Qe({
          vertexColors: !0,
          flatShading: !0,
          transparent: !0,
          opacity: 0.28,
          depthWrite: !1
        }));
        for (let a of s.res) {
          r.add(a.id);
          let l = this.sig(a),
            c = this.views.get(a.id);
          if (
          c && c.sig !== l && (this.removeView(a.id), c = null),
          c || (c = this.makeView(a), c.sig = l, this.views.set(a.id, c)),
          c.crown && e && n)
          {
            let h = c.obj.position.x,
              d = c.obj.position.y + 1.8 * c.obj.scale.y,
              u = c.obj.position.z,
              f = n.x - e.x,
              p = n.y - e.y,
              x = n.z - e.z,
              g = f * f + p * p + x * x,
              m = Math.max(
                0,
                Math.min(
                  1,
                  ((h - e.x) * f + (d - e.y) * p + (u - e.z) * x) / g
                )
              ),
              b = e.x + f * m - h,
              T = e.y + p * m - d,
              y = e.z + x * m - u,
              M =
              m > 0.05 &&
              m < 0.98 &&
              b * b + T * T + y * y <
              2.1 * 2.1 * c.obj.scale.x * c.obj.scale.x ?
              this.fadeMat :
              he();
            c.crown.material !== M && (c.crown.material = M);
          }
          if (c.crown) {
            let h = 0.03 + (s.weather.rain > 1 ? 0.05 : 0);
            c.crown.rotation.z = Math.sin(t * 0.9 + c.phase) * h,
            c.crown.rotation.x = Math.cos(t * 0.7 + c.phase) * h * 0.6;
          }
        }
        for (let a of [...this.views.keys()]) r.has(a) || this.removeView(a);
        let o = new Set();
        for (let a of s.pods) {
          o.add(a.id);
          let l = this.podViews.get(a.id);
          if (!l) {
            let u = mergeParts([
              part(Bn(0.42, 7, 5), PALETTE.pod, { y: 0, sx: 0.8, sz: 1.2 }),
              part(lt(0.06, 0.5, 0.95), PALETTE.pod2, { y: 0.12 }),
              part(yt(0.03, 0.05, 0.2, 4), PALETTE.trunk, {
                y: 0,
                z: 0.55,
                rx: Math.PI / 2
              })]
              ),
              f = new Et(u, he());
            f.castShadow = !0,
            f.rotation.y = a.rot || 0,
            this.group.add(f),
            l = { obj: f, x: a.x, z: a.z },
            this.podViews.set(a.id, l);
          }
          let c = 0,
            h = 0;
          for (let u of s.creatures) {
            let f = u.act;
            if (!(!f || !f.obj || f.obj.t !== "pod" || f.obj.id !== a.id)) {
              if (f.type === "lift") {
                let p = Math.min(1, Math.max(0, (s.t - f.t0) / (f.t1 - f.t0)));
                c = Math.max(c, Math.sin(p * Math.PI) * 0.55);
              }
              f.type === "strain" && (h = 1);
            }
          }
          let d = this.h(a.x, a.z) + 0.3 + c;
          l.obj.position.set(a.x + (h ? Math.sin(t * 40) * 0.03 : 0), d, a.z),
          l.obj.rotation.z = c * 0.3;
        }
        for (let [a, l] of this.podViews)
        o.has(a) || (
        this.group.remove(l.obj),
        l.obj.geometry.dispose(),
        this.spawnShells(l.obj.position, t),
        this.podViews.delete(a));
        for (let a = this.effects.length - 1; a >= 0; a--) {
          let l = this.effects[a],
            c = t - l.t;
          if (c > 40) {
            this.group.remove(l.obj),
            l.obj.traverse((h) => h.geometry && h.geometry.dispose()),
            this.effects.splice(a, 1);
            continue;
          }
          l.obj.children.forEach((h, d) => {
            h.position.y = Math.max(
              -0.1,
              h.userData.y0 + Math.max(0, 0.6 - c) * 0.4 * (d ? 1 : 0.6)
            );
          });
        }
        t - this.lastInst > 0.4 && (this.lastInst = t, this.syncInstances());
      }
      spawnShells(t, e) {
        let n = new Pe(),
          s = part(Bn(0.42, 7, 5), PALETTE.pod, { sx: 0.8, sz: 1.2, sy: 0.5 }),
          r = mergeParts([s]),
          o = new Et(r, he());
        o.position.set(-0.45, 0, 0),
        o.rotation.z = 0.5,
        o.userData.y0 = -0.05;
        let a = new Et(r.clone(), he());
        a.position.set(0.45, 0, 0.1),
        a.rotation.z = -0.5,
        a.userData.y0 = -0.05,
        n.add(o, a),
        n.position.copy(t),
        n.position.y -= 0.2,
        this.group.add(n),
        this.effects.push({ obj: n, t: e });
      }
      removeView(t) {
        let e = this.views.get(t);
        if (!e) return;
        this.group.remove(e.obj);
        let n = new Set();
        for (let s of zs.values()) n.add(s.trunk), n.add(s.crown);
        e.obj.traverse((s) => {
          s.isMesh && s.geometry && !n.has(s.geometry) && s.geometry.dispose();
        }),
        this.glowLights = this.glowLights.filter((s) => s.o.id !== t),
        this.views.delete(t);
      }
      setInst(t, e, n, s, r, o, a, l) {
        let c = this.inst[t];
        return e >= c.instanceMatrix.count ?
        !1 : (
        this.e.set(0, o, 0),
        this.q.setFromEuler(this.e),
        this.v.set(n, s, r),
        this.s.set(a, a, a),
        this.m4.compose(this.v, this.q, this.s),
        c.setMatrixAt(e, this.m4),
        l !== void 0 && (this.col.set(l), c.setColorAt(e, this.col)),
        !0);
      }
      syncInstances() {
        let t = this.world,
          e = {
            branch: 0,
            berry: 0,
            reed: 0,
            pebble: 0,
            glowcap: 0,
            seed: 0,
            cairn: 0,
            fruit: 0
          };
        for (let n of t.res) {
          let s = this.h(n.x, n.z),
            r = n.id * 13;
          if (n.kind === "tree")
          for (let o = 0; o < n.amt; o++) {
            let a = hash01(r + o) * 6.28,
              l = 0.9 + hash01(r + o + 9) * 0.7,
              c = n.x + Math.cos(a) * l,
              h = n.z + Math.sin(a) * l;
            this.setInst(
              "branch",
              e.branch++,
              c,
              this.h(c, h) + 0.05,
              h,
              a,
              1
            );
          } else
          if (n.kind === "bush") {
            let o = n.food === "bluberry" ? PALETTE.bluberry : PALETTE.berry;
            for (let a = 0; a < n.amt; a++) {
              let l = hash01(r + a) * 6.28,
                c = 0.25 + hash01(r + a + 5) * 0.25;
              this.setInst(
                "berry",
                e.berry++,
                n.x + Math.cos(l) * c,
                s + 0.25 + hash01(r + a + 2) * 0.3,
                n.z + Math.sin(l) * c,
                0,
                1,
                o
              );
            }
          } else if (n.kind === "reeds")
          for (let o = 0; o < n.amt; o++) {
            let a = hash01(r + o) * 6.28,
              l = hash01(r + o + 4) * 0.55;
            this.setInst(
              "reed",
              e.reed++,
              n.x + Math.cos(a) * l,
              s - 0.05,
              n.z + Math.sin(a) * l,
              a,
              0.8 + hash01(r + o + 1) * 0.5
            );
          } else
          if (n.kind === "stones")
          for (let o = 0; o < n.amt; o++) {
            let a = hash01(r + o) * 6.28,
              l = 0.15 + hash01(r + o + 4) * 0.75,
              c = hash01(r + o + 6) > 0.5 ? PALETTE.stone : PALETTE.stone2;
            this.setInst(
              "pebble",
              e.pebble++,
              n.x + Math.cos(a) * l,
              s + 0.06,
              n.z + Math.sin(a) * l,
              a,
              0.8 + hash01(r + o + 1) * 0.6,
              c
            );
          } else
          if (n.kind === "clay")
          for (let o = 0; o < Math.ceil(n.amt / 3); o++) {
            let a = hash01(r + o) * 6.28,
              l = 0.2 + hash01(r + o + 4) * 0.6;
            this.setInst(
              "pebble",
              e.pebble++,
              n.x + Math.cos(a) * l,
              s + 0.08,
              n.z + Math.sin(a) * l,
              a,
              1.1,
              PALETTE.clay
            );
          } else
          if (n.kind === "glowcap")
          for (let o = 0; o < n.amt; o++) {
            let a = hash01(r + o) * 6.28,
              l = 0.15 + hash01(r + o + 4) * 0.5;
            this.setInst(
              "glowcap",
              e.glowcap++,
              n.x + Math.cos(a) * l,
              s,
              n.z + Math.sin(a) * l,
              a,
              0.9 + hash01(r + o + 1) * 0.5,
              PALETTE.glow
            );
          } else
          if (n.kind === "orchard" && n.stage >= 3)
          for (let o = 0; o < n.amt; o++) {
            let a = hash01(r + o) * 6.28,
              l = 0.4 + hash01(r + o + 4) * 0.4;
            this.setInst(
              "fruit",
              e.fruit++,
              n.x + Math.cos(a) * l,
              s + 1.3 + hash01(r + o + 2) * 0.5,
              n.z + Math.sin(a) * l,
              0,
              1
            );
          }
        }
        for (let n of t.items) {
          let s = this.h(n.x, n.z),
            r = n.id * 17;
          if (n.kind === "seeds")
          for (let o = 0; o < Math.min(n.n, 6); o++) {
            let a = hash01(r + o) * 6.28,
              l = hash01(r + o + 1) * 0.3;
            this.setInst(
              "seed",
              e.seed++,
              n.x + Math.cos(a) * l,
              s + 0.02,
              n.z + Math.sin(a) * l,
              a,
              1
            );
          } else
          if (n.kind === "cairn")
          for (let o = 0; o < n.n; o++) {
            let a = 1.2 - o * 0.12;
            this.setInst(
              "cairn",
              e.cairn++,
              n.x + (hash01(r + o) - 0.5) * 0.05,
              s + 0.07 + o * 0.15,
              n.z + (hash01(r + o + 3) - 0.5) * 0.05,
              hash01(r + o + 5) * 6,
              a,
              hash01(r + o + 7) > 0.5 ? PALETTE.stone : PALETTE.stone2
            );
          }
        }
        for (let n in e) {
          let s = this.inst[n];
          s.count = Math.min(e[n], s.instanceMatrix.count),
          s.instanceMatrix.needsUpdate = !0,
          s.instanceColor && (s.instanceColor.needsUpdate = !0);
        }
      }
      updateLights(t) {
        for (let e of this.glowLights)
        e.light.intensity = t * Math.min(1, e.o.amt / 3) * 1.6;
        this.glowMat.color.setScalar(1 + t * 1.5);
      }
    };
  var jb = {
    branch: PALETTE.trunk,
    reeds: PALETTE.reed,
    stone: PALETTE.stone,
    mud: PALETTE.mud,
    clay: PALETTE.clay,
    seeds: 14200944,
    glowcap: PALETTE.glow,
    tile: PALETTE.tile
  };
  function ta(i, t, e, n, s, r, o = 0) {
    e = Math.min(e, 12);
    for (let a = 0; a < e; a++) {
      let l = hash01(r + a) * 6.28,
        c = hash01(r + a + 1) * 0.28,
        h = n + Math.cos(l) * c,
        d = s + Math.sin(l) * c,
        u = o + 0.05 + Math.floor(a / 4) * 0.09;
      switch (t) {
        case "branch":
          i.push(
            part(yt(0.03, 0.04, 0.6, 4), PALETTE.trunk, {
              x: n + (a % 4 - 1.5) * 0.08,
              y: u,
              z: s,
              rz: Math.PI / 2,
              ry: (hash01(r + a) - 0.5) * 0.3
            })
          );
          break;
        case "reeds":
          i.push(
            part(yt(0.025, 0.025, 0.7, 3), PALETTE.reed, {
              x: n + (a % 4 - 1.5) * 0.06,
              y: u,
              z: s,
              rx: Math.PI / 2
            })
          );
          break;
        case "tile":
          i.push(
            part(lt(0.28, 0.04, 0.18), PALETTE.tile, {
              x: n,
              y: 0.03 + a * 0.045,
              z: s,
              ry: (hash01(r + a) - 0.5) * 0.3
            })
          );
          break;
        case "glowcap":
          i.push(part(Bn(0.07, 4, 3), PALETTE.glow, { x: h, y: 0.07, z: d }));
          break;
        default:
          i.push(
            part(on(t === "stone" ? 0.11 : 0.1), jb[t] || PALETTE.dirt, {
              x: h,
              y: u,
              z: d,
              ry: l
            })
          );
      }
    }
  }
  function Kb(i, t) {
    for (let e = 0; e < 4; e++) {
      let n = e / 4 * 6.28 + 0.78;
      i.push(
        part(yt(0.025, 0.03, 0.45, 3), PALETTE.plank2, {
          x: Math.cos(n) * t,
          y: 0.22,
          z: Math.sin(n) * t
        })
      );
    }
    i.push(part(id(t, 0.012, 3, 8), PALETTE.rope, { y: 0.35, rx: Math.PI / 2 }));
  }
  function Ur(i, t, e) {
    for (let n = 0; n < 4; n++) {
      let s = n / 4 * 6.28 + 0.3;
      i.push(
        part(yt(0.025, 0.03, e, 3), PALETTE.plank, {
          x: Math.cos(s) * t,
          y: e / 2,
          z: Math.sin(s) * t
        })
      );
    }
  }
  function buildHomeView(i, t, e, n, s, r) {
    let o = n ? n.level : -1,
      a = n ? n.stage : 0,
      l = n && n.cureLeft > 0,
      c = (x) => e >= x,
      h = c(5) || o === 4 && a >= 1 ? 0.38 : 0;
    if (c(5) || o === 4) {
      let x = c(5) ? 6 : Math.round(6 * (a >= 1 ? 1 : s));
      for (let g = 0; g < x; g++) {
        let m = g / 6 * 6.28;
        i.push(
          part(yt(0.1, 0.13, 0.4, 5), PALETTE.stone2, {
            x: Math.cos(m) * 1,
            y: 0.2,
            z: Math.sin(m) * 1
          })
        );
      }
      if (c(5) || o === 4 && a >= 1) {
        let g = c(5) ? 1 : s;
        i.push(
          part(yt(1.25, 1.25, 0.08, 10), PALETTE.plank, {
            y: 0.38,
            sx: Math.max(0.2, g),
            sz: Math.max(0.2, g)
          })
        ),
        i.push(
          part(lt(0.4, 0.06, 0.5), PALETTE.plank2, { y: 0.18, z: 1.45, rx: -0.6 })
        );
      }
    }
    let d = !c(3) && !(o === 2 && a >= 1);
    if (c(1) || o === 0) {
      let x = c(1) ? 1 : Math.max(0.15, s);
      d && (
      i.push(
        part(id(0.42, 0.11, 4, 9), PALETTE.trunk, {
          y: 0.08,
          rx: Math.PI / 2,
          sx: x,
          sy: x,
          sz: x,
          jitter: 0.15
        })
      ),
      i.push(part(yt(0.38 * x, 0.38 * x, 0.06, 8), PALETTE.thatch2, { y: 0.05 })));
    }
    if ((c(2) || o === 1) && !c(3) && !(o === 2 && a >= 2)) {
      let x = c(2) || a >= 1 ? 4 : Math.round(4 * s);
      for (let g = 0; g < x; g++) {
        let m = g / 4 * 6.28 + 0.78;
        i.push(
          part(yt(0.035, 0.04, 1.05, 4), PALETTE.trunk, {
            x: Math.cos(m) * 0.7,
            y: 0.52,
            z: Math.sin(m) * 0.7
          })
        );
      }
      if (c(2) || a >= 1) {
        let g = c(2) ? 1 : s;
        i.push(
          part(lt(1.6, 0.08, 1.5 * Math.max(0.1, g)), PALETTE.thatch, {
            y: 1.08,
            rx: 0.12,
            jitter: 0.1
          })
        );
      }
    }
    let u = 0.95;
    if (c(3) || o === 2) {
      if (c(3) || a >= 0) {
        let x = c(3) || a >= 1 ? 10 : Math.round(10 * s);
        for (let g = 0; g < x; g++) {
          let m = g / 10 * 6.28;
          i.push(
            part(on(0.13), PALETTE.stone2, {
              x: Math.cos(m) * 0.95,
              y: 0.06 + h,
              z: Math.sin(m) * 0.95
            })
          );
        }
      }
      if (c(3) || a >= 1) {
        let x = c(3) || a >= 2 ? 1 : Math.max(0.08, s),
          g = l && o === 2 && a === 1 ? PALETTE.mudwall2 : PALETTE.mudwall;
        i.push(
          part(yt(0.88, 0.95, u * x, 10), g, {
            y: h + u * x / 2,
            jitter: 0.06,
            seed: t.id
          })
        ),
        x > 0.7 &&
        i.push(part(lt(0.4, 0.62, 0.12), PALETTE.dark, { y: h + 0.31, z: 0.9 })),
        x > 0.7 &&
        i.push(
          part(lt(0.18, 0.18, 0.1), PALETTE.dark, {
            x: 0.6,
            y: h + 0.6,
            z: 0.66,
            ry: 0.7
          })
        ),
        l && o === 2 && a === 1 && Ur(i, 1.1, 1.1);
      }
      if (c(3) || a >= 2) {
        let x = c(3) ? 1 : Math.max(0.1, s),
          g = c(4) || o === 3 && a >= 1,
          m = g ? PALETTE.tile : PALETTE.thatch;
        i.push(
          part(ze(1.13, 1 * x, 10), m, {
            y: h + u + 0.5 * x,
            jitter: 0.06,
            seed: t.id + 1
          })
        ),
        g ? (
        i.push(
          part(yt(1.14, 1.16, 0.08, 10), PALETTE.tile2, { y: h + u + 0.04 })
        ),
        i.push(
          part(yt(0.08, 0.1, 0.35, 5), PALETTE.mudwall2, {
            x: 0.3,
            y: h + u + 0.85,
            z: -0.2
          })
        )) :
        i.push(
          part(yt(0.06, 0.12, 0.2, 5), PALETTE.thatch2, { y: h + u + 1 * x })
        ),
        c(3) || Ur(i, 1.15, 1.4);
      }
    }
    if (o === 3) {
      if (a === 0)
      for (let x = 0; x < Math.round(8 * s); x++) {
        let g = x / 8 * 6.28;
        i.push(
          part(lt(0.04, 0.04, 1.1), PALETTE.plank2, {
            x: Math.cos(g) * 0.55,
            y: h + u + 0.35,
            z: Math.sin(g) * 0.55,
            ry: -g,
            rx: 0.7
          })
        );
      }
      a === 1 &&
      i.push(
        part(ze(1.15, 1 * Math.max(0.1, s), 10), PALETTE.tile, { y: h + u + 0.5 * s })
      ),
      Ur(i, 1.2, 1.6);
    }
    if (c(6) || o === 5) {
      let x = c(6) || a >= 1 ? 1 : Math.max(0.1, s),
        g = -1.25;
      if (
      i.push(
        part(yt(0.62, 0.66, 0.75 * x, 9), l ? PALETTE.mudwall2 : PALETTE.mudwall, {
          x: g,
          y: h + 0.375 * x,
          z: -0.2
        })
      ),
      c(6) || a >= 1)
      {
        let m = c(6) ? 1 : Math.max(0.1, s);
        i.push(
          part(ze(0.85, 0.7 * m, 9), PALETTE.tile, {
            x: g,
            y: h + 0.75 + 0.35 * m,
            z: -0.2
          })
        ),
        i.push(
          part(lt(0.18, 0.5, 0.18), PALETTE.mudwall2, {
            x: g - 0.2,
            y: h + 1.1,
            z: -0.4
          })
        );
      }
      c(6) || Ur(i, 0.85, 1.2);
    }
    let f = r.world.byId[t.owner],
      p = f ? Math.min(f.trinkets || 0, 9) : 0;
    for (let x = 0; x < p; x++) {
      let g = 2.2 + x * 0.35,
        m = [PALETTE.flower1, PALETTE.white, PALETTE.flower3, PALETTE.stone, PALETTE.bluberry][x % 5];
      i.push(
        part(qt(0.06, 0), m, {
          x: Math.cos(g) * 1.35,
          y: h + 0.05,
          z: Math.sin(g) * 1.35
        })
      );
    }
  }
  function buildStoreView(i, t, e, n, s) {
    let r = n ? n.level : -1,
      o = n ? n.stage : 0,
      a = n && n.cureLeft > 0,
      l = (u) => e >= u;
    if (
    i.push(part(yt(1.6, 1.7, 0.03, 10), PALETTE.dirt, { y: 0 })), l(2) || r === 1)
    {
      let u = l(2) ? 4 : Math.max(1, Math.round(4 * (o + s) / 2));
      for (let f = 0; f < u; f++) {
        let p = f / 4 * 6.28 + 0.4;
        i.push(
          part(yt(0.3, 0.25, 0.42, 7), PALETTE.thatch2, {
            x: Math.cos(p) * 0.9,
            y: 0.21,
            z: Math.sin(p) * 0.9,
            jitter: 0.1
          })
        );
      }
    }
    if (l(3) || r === 2) {
      let u = l(3) || o >= 1 ? 4 : Math.round(4 * s);
      for (let f = 0; f < u; f++) {
        let p = f / 4 * 6.28 + 0.78;
        i.push(
          part(lt(0.12, 1.3, 0.12), PALETTE.plank2, {
            x: Math.cos(p) * 1.25,
            y: 0.65,
            z: Math.sin(p) * 1.25
          })
        );
      }
      if (l(3) || o >= 1) {
        let f = l(3) || o >= 2 ? 1 : Math.max(0.08, s),
          p = a && o === 1 ? PALETTE.mudwall2 : PALETTE.mudwall;
        i.push(part(lt(1.7, 1.1 * f, 0.12), p, { y: 0.55 * f, z: -0.85 })),
        i.push(part(lt(0.12, 1.1 * f, 1.7), p, { x: -0.85, y: 0.55 * f })),
        i.push(part(lt(0.12, 1.1 * f, 1.7), p, { x: 0.85, y: 0.55 * f }));
      }
      if (l(3) || o >= 2) {
        let f = l(3) ? 1 : Math.max(0.1, s);
        i.push(
          part(lt(2.1 * f, 0.1, 2.1), PALETTE.thatch, { y: 1.2, rx: 0.1, jitter: 0.08 })
        ),
        i.push(
          part(lt(2.1 * f, 0.1, 1.1), PALETTE.thatch2, { y: 1.4, z: -0.3, rx: 0.4 })
        );
      }
    }
    if (l(4) || r === 3) {
      let p = l(4) || o >= 1 ? 1 : s;
      if (
      i.push(
        part(yt(1, 1.1, 0.3 * p, 9), PALETTE.stone2, { x: 0, y: 0.15 * p, z: -2.3 })
      ),
      l(4) || o >= 1)
      {
        let x = l(4) || o >= 2 ? 1 : Math.max(0.1, s);
        i.push(
          part(yt(0.8, 0.85, 1.4 * x, 9), a ? PALETTE.mudwall2 : PALETTE.mudwall, {
            x: 0,
            y: 0.3 + 0.7 * x,
            z: -2.3
          })
        );
      }
      if (l(4) || o >= 2) {
        let x = l(4) ? 1 : Math.max(0.1, s);
        i.push(
          part(ze(1.05, 1 * x, 9), PALETTE.tile, { x: 0, y: 1.7 + 0.5 * x, z: -2.3 })
        );
      }
      l(4) || Ur(i, 1.1, 2);
    }
    let c = t.stock || {},
      h = 0;
    for (let u of ["branch", "reeds", "stone", "clay", "mud"])
    if (c[u] > 0) {
      let f = 3.6 + h * 0.7;
      ta(
        i,
        u,
        Math.ceil(c[u] / 2),
        Math.cos(f) * 0.55,
        Math.sin(f) * 0.55,
        t.id * 3 + h
      ),
      h++;
    }
    let d =
    (c.berry || 0) + (
    c.bluberry || 0) + (
    c.greens || 0) + (
    c.fruit || 0) + (
    c.seeds || 0);
    for (let u = 0; u < Math.min(10, Math.ceil(d / 2)); u++) {
      let f = hash01(t.id + u) * 6.28,
        p = hash01(t.id + u + 4) * 0.3,
        x = [PALETTE.berry, PALETTE.bluberry, PALETTE.greens, PALETTE.fruit, 14200944][u % 5];
      i.push(
        part(qt(0.07, 0), x, {
          x: 0.3 + Math.cos(f) * p,
          y: 0.08,
          z: 0.3 + Math.sin(f) * p
        })
      );
    }
  }
  function buildCrossingView(i, t, e, n, s, r) {
    let o = r.world.terrain,
      [a, l] = t.ends,
      c = n ? n.level : -1,
      h = n ? n.stage : 0,
      d = (T) => e >= T,
      u = a.x - t.x,
      f = a.z - t.z,
      p = l.x - t.x,
      x = l.z - t.z,
      g = Math.hypot(p - u, x - f),
      m = Math.atan2(p - u, x - f),
      b = 0.4 - r.baseY;
    if (d(1) || c === 0) {
      let T = d(1) ? 6 : Math.round(6 * s);
      for (let y = 0; y < T; y++) {
        let S = (y + 0.5) / 6;
        i.push(
          part(yt(0.26, 0.3, 0.3, 6), y % 2 ? PALETTE.stone : PALETTE.stone2, {
            x: u + (p - u) * S + (y % 2 ? 0.1 : -0.1),
            y: b + 0.02,
            z: f + (x - f) * S
          })
        );
      }
    }
    if (d(2) || c === 1) {
      let T = d(2) || h >= 1 ? 4 : Math.round(4 * s);
      for (let y = 0; y < T; y++) {
        let S = (y + 0.5) / 4;
        for (let M of [-0.45, 0.45])
        i.push(
          part(yt(0.06, 0.07, 1, 4), PALETTE.plank2, {
            x: u + (p - u) * S + Math.cos(m) * M,
            y: b + 0.2,
            z: f + (x - f) * S - Math.sin(m) * M
          })
        );
      }
      if (d(2) || h >= 1) {
        let y = d(2) ? 1 : Math.max(0.05, s),
          S = Math.round(10 * y);
        for (let M = 0; M < S; M++) {
          let A = (M + 0.5) / 10;
          i.push(
            part(lt(1.05, 0.07, g / 10 * 0.9), M % 2 ? PALETTE.plank : PALETTE.plank2, {
              x: u + (p - u) * A,
              y: b + 0.62 + Math.sin(A * Math.PI) * 0.12,
              z: f + (x - f) * A,
              ry: m
            })
          );
        }
      }
    }
    if (d(3) || c === 2) {
      if (d(3) || h >= 0) {
        let T = d(3) || h >= 1 ? 1 : s;
        for (let y of [-0.5, 0.5]) {
          let S = Math.round(6 * T);
          for (let M = 0; M <= S; M++) {
            let A = M / 6;
            i.push(
              part(yt(0.03, 0.03, 0.45, 3), PALETTE.plank2, {
                x: u + (p - u) * A + Math.cos(m) * y,
                y: b + 0.9 + Math.sin(A * Math.PI) * 0.12,
                z: f + (x - f) * A - Math.sin(m) * y
              })
            );
          }
          T >= 1 &&
          i.push(
            part(lt(0.05, 0.05, g), PALETTE.plank, {
              x: (u + p) / 2 + Math.cos(m) * y,
              y: b + 1.12,
              z: (f + x) / 2 - Math.sin(m) * y,
              ry: m
            })
          );
        }
      }
      if (d(3) || h >= 1) {
        let T = d(3) ? 1 : s;
        for (let y = 0; y < Math.round(10 * T); y++) {
          let S = y % 2 ? a : l,
            M = hash01(t.id + y) * 6.28,
            A = 0.5 + hash01(t.id + y + 2) * 0.9,
            v = S.x + Math.cos(M) * A,
            E = S.z + Math.sin(M) * A;
          o.isWater(v, E) ||
          i.push(
            part(
              qt(0.09, 0),
              [PALETTE.flower1, PALETTE.flower3, PALETTE.flower2, PALETTE.white][y % 4],
              { x: v - t.x, y: o.heightAt(v, E) - r.baseY + 0.1, z: E - t.z }
            )
          );
        }
      }
    }
  }
  function buildGardenView(i, t, e, n, s) {
    let r = n ? n.level : -1,
      o = n ? n.stage : 0,
      a = (u) => e >= u,
      l = t.beds || [],
      c = a(6) ? 3 : a(2) ? 2 : a(1) || r === 0 ? 1 : 0,
      h = [
      [0, 0],
      [0, 1.1],
      [0, -1.1]],

      d = Math.max(c, r === 1 ? 2 : r === 5 ? 3 : 0);
    for (let u = 0; u < d; u++) {
      let [f, p] = h[u],
        x = u < c,
        g = x || o >= 1 ? 1 : Math.max(0.15, s);
      i.push(part(lt(2.6 * g, 0.1, 0.8), PALETTE.soil, { x: f, y: 0.04, z: p }));
      for (let m of [-0.42, 0.42])
      i.push(
        part(lt(2.7 * g, 0.12, 0.06), PALETTE.plank2, { x: f, y: 0.07, z: p + m })
      );
      for (let m = 0; m < 4; m++) {
        let b = l[u * 4 + m];
        if (!b || b.state === "empty" || !x) continue;
        let T = f - 0.95 + m * 0.63,
          y = b.state === "ready" ? 1 : b.grow,
          S = 0.08 + y * 0.35;
        i.push(
          part(ze(0.12 + y * 0.1, S, 5), PALETTE.greens, { x: T, y: 0.1 + S / 2, z: p })
        ),
        b.state === "ready" &&
        i.push(
          part(qt(0.08, 0), PALETTE.fruit, { x: T + 0.06, y: 0.18, z: p + 0.12 })
        ),
        b.water > 0.6 &&
        b.state !== "ready" &&
        i.push(
          part(lt(0.1, 0.01, 0.1), 5930912, {
            x: T + 0.1,
            y: 0.1,
            z: p - 0.15
          })
        );
      }
    }
    if (a(3) || r === 2) {
      let u = a(3) ? 1 : Math.max(0.1, s);
      i.push(part(on(0.5), PALETTE.soil, { x: 1.9, y: 0.2 * u, z: 0.9, sy: 0.6 * u })),
      i.push(part(lt(0.05, 0.4, 1), PALETTE.plank2, { x: 2.4, y: 0.2, z: 0.9 }));
    }
    if (a(4) || r === 3) {
      let u = a(4) || o >= 1 ? 1 : s,
        f = Math.round(8 * u);
      for (let p = 0; p < f; p++)
      i.push(
        part(
          lt(0.5, 0.06, 0.3),
          a(4) || o >= 1 && s > 0.5 ? 4891593 : PALETTE.soil,
          { x: -1.6 - p * 0.48, y: 0.03, z: 0.55 }
        )
      ),
      i.push(
        part(lt(0.5, 0.1, 0.06), o >= 1 || a(4) ? PALETTE.clay : PALETTE.stone2, {
          x: -1.6 - p * 0.48,
          y: 0.06,
          z: 0.37
        })
      ),
      i.push(
        part(lt(0.5, 0.1, 0.06), o >= 1 || a(4) ? PALETTE.clay : PALETTE.stone2, {
          x: -1.6 - p * 0.48,
          y: 0.06,
          z: 0.73
        })
      );
    }
    if (a(5) || r === 4) {
      let u = a(5) ? 1 : Math.max(0.15, (o + s) / 2);
      i.push(part(lt(1, 0.04, 0.8), PALETTE.plank, { x: 2, y: 0.5 * u, z: -1 }));
      for (let [f, p] of [
      [-0.45, -0.35],
      [0.45, -0.35],
      [-0.45, 0.35],
      [0.45, 0.35]])

      i.push(
        part(lt(0.05, 0.5 * u, 0.05), PALETTE.plank2, {
          x: 2 + f,
          y: 0.25 * u,
          z: -1 + p
        })
      );
      if (a(5))
      for (let f = 0; f < 6; f++)
      i.push(
        part(ze(0.05, 0.14, 4), PALETTE.greens, {
          x: 1.7 + f % 3 * 0.3,
          y: 0.58,
          z: -1.2 + Math.floor(f / 3) * 0.4
        })
      );
    }
  }
  function buildWorkshopView(i, t, e, n, s) {
    let r = n ? n.level : -1,
      o = n ? n.stage : 0,
      a = n && n.cureLeft > 0,
      l = (c) => e >= c;
    if (
    i.push(part(yt(1.5, 1.6, 0.03, 9), PALETTE.dirt2, { y: 0 })), l(1) || r === 0)
    {
      let c = l(1) ? 1 : Math.max(0.2, s);
      i.push(part(lt(0.25, 0.45 * c, 0.25), PALETTE.stone2, { x: -0.5, y: 0.22 * c })),
      i.push(part(lt(0.25, 0.45 * c, 0.25), PALETTE.stone2, { x: 0.5, y: 0.22 * c })),
      c > 0.9 && i.push(part(lt(1.4, 0.12, 0.6), PALETTE.stone, { y: 0.5 }));
    }
    if (l(2) || r === 1) {
      let c = l(2) ? 1 : Math.max(0.1, s);
      i.push(
        part(lt(0.08, 1 * c, 0.08), PALETTE.plank2, { x: -0.7, y: 0.5 * c, z: -0.8 })
      ),
      i.push(
        part(lt(0.08, 1 * c, 0.08), PALETTE.plank2, { x: 0.7, y: 0.5 * c, z: -0.8 })
      ),
      l(2) && (
      i.push(part(lt(1.5, 0.06, 0.06), PALETTE.plank, { y: 0.85, z: -0.8 })),
      i.push(
        part(yt(0.02, 0.02, 0.6, 3), PALETTE.trunk, { x: -0.3, y: 0.55, z: -0.75 })
      ),
      i.push(
        part(lt(0.16, 0.1, 0.08), PALETTE.stone2, { x: 0.2, y: 0.7, z: -0.75 })
      ),
      i.push(
        part(yt(0.12, 0.09, 0.15, 5), PALETTE.thatch2, {
          x: 0.45,
          y: 0.65,
          z: -0.75
        })
      ));
    }
    if (l(3) || r === 2) {
      let c = l(3) || o >= 1 ? 1 : Math.max(0.08, s),
        h = a && o === 0 ? PALETTE.mudwall2 : PALETTE.mudwall;
      if (
      i.push(part(lt(2.2, 1.2 * c, 0.14), h, { y: 0.6 * c, z: -1.1 })),
      i.push(part(lt(0.14, 1.2 * c, 1.4), h, { x: -1.1, y: 0.6 * c, z: -0.4 })),
      l(3) || o >= 1)
      {
        let d = l(3) ? 1 : Math.max(0.1, s);
        i.push(
          part(lt(2.5 * d, 0.1, 2), PALETTE.thatch, {
            y: 1.35,
            z: -0.2,
            rx: 0.15,
            jitter: 0.08
          })
        ),
        i.push(part(lt(0.1, 1.3, 0.1), PALETTE.plank2, { x: 1.1, y: 0.65, z: 0.7 })),
        i.push(part(lt(0.1, 1.3, 0.1), PALETTE.plank2, { x: -1.1, y: 0.65, z: 0.7 }));
      }
    }
    if (l(4) || r === 3) {
      let c = l(4) || o >= 1 ? 1 : Math.max(0.1, s);
      for (let d = 0; d < 2; d++)
      i.push(
        part(lt(0.06, 0.9 * c, 0.06), PALETTE.plank2, {
          x: 1.5,
          y: 0.45 * c,
          z: -0.6 + d * 0.9
        })
      ),
      i.push(
        part(lt(0.06, 0.9 * c, 0.06), PALETTE.plank2, {
          x: 2.3,
          y: 0.45 * c,
          z: -0.6 + d * 0.9
        })
      );
      if (c >= 1)
      for (let d = 0; d < 3; d++)
      i.push(
        part(lt(0.9, 0.04, 1), PALETTE.plank, {
          x: 1.9,
          y: 0.25 + d * 0.3,
          z: -0.15
        })
      );
      let h = Math.min(
        12,
        (t.stock && t.stock.tile || 0) + (t.drying && t.drying.length || 0)
      );
      for (let d = 0; d < h; d++)
      i.push(
        part(
          lt(0.22, 0.03, 0.15),
          d < (t.stock && t.stock.tile || 0) ? PALETTE.tile : PALETTE.clay,
          {
            x: 1.6 + d % 3 * 0.28,
            y: 0.28 + Math.floor(d / 3) % 3 * 0.3,
            z: -0.4 + Math.floor(d / 9) * 0.4
          }
        )
      );
    }
  }
  function buildMeetingView(i, t, e, n, s) {
    let r = n ? n.level : -1,
      o = n ? n.stage : 0,
      a = n && n.cureLeft > 0,
      l = (c) => e >= c;
    if (l(1) || r === 0) {
      let c = l(1) ? 1 : Math.max(0.3, s);
      i.push(
        part(yt(0.7, 0.8, 0.35, 8), PALETTE.rock, {
          x: l(1) ? 0 : 1.6 * (1 - s),
          y: 0.17,
          sx: c,
          sz: c
        })
      );
    }
    if (l(2) || r === 1) {
      let c = l(2) ? 5 : Math.round(5 * s);
      for (let h = 0; h < c; h++) {
        let d = h / 5 * 6.28;
        i.push(
          part(yt(0.18, 0.2, 1, 6), PALETTE.trunk, {
            x: Math.cos(d) * 1.7,
            y: 0.18,
            z: Math.sin(d) * 1.7,
            rz: Math.PI / 2,
            ry: -d + Math.PI / 2
          })
        );
      }
    }
    if (l(3) || r === 2) {
      let c = l(3) || o >= 1 ? 5 : Math.round(5 * s);
      for (let h = 0; h < c; h++) {
        let d = h / 5 * 6.28 + 0.63;
        i.push(
          part(yt(0.04, 0.05, 1.2, 4), PALETTE.plank2, {
            x: Math.cos(d) * 2.2,
            y: 0.6,
            z: Math.sin(d) * 2.2
          })
        );
      }
    }
    if (l(4) || r === 3) {
      let c = l(4) || o >= 1 ? 1 : Math.max(0.1, s);
      for (let h = 0; h < Math.round(10 * c); h++) {
        let d = h / 10 * 6.28;
        i.push(
          part(lt(0.4, 0.3, 0.4), PALETTE.stone2, {
            x: Math.cos(d) * 2.6,
            y: 0.15,
            z: Math.sin(d) * 2.6
          })
        );
      }
      if (l(4) || o >= 1) {
        let h = l(4) || o >= 2 ? 1 : Math.max(0.1, s);
        for (let d = 0; d < Math.round(8 * h); d++) {
          let u = d / 8 * 6.28;
          i.push(
            part(lt(0.14, 2, 0.14), PALETTE.plank2, {
              x: Math.cos(u) * 2.6,
              y: 1,
              z: Math.sin(u) * 2.6
            })
          );
        }
      }
      if (l(4) || o >= 2) {
        let h = l(4) || o >= 3 ? 1 : Math.max(0.1, s),
          d = a && o === 2 ? PALETTE.mudwall2 : PALETTE.mudwall;
        for (let u = 0; u < 8; u++) {
          if (u === 2) continue;
          let f = (u + 0.5) / 8 * 6.28;
          i.push(
            part(lt(2, 1.6 * h, 0.15), d, {
              x: Math.cos(f) * 2.55,
              y: 0.3 + 0.8 * h,
              z: Math.sin(f) * 2.55,
              ry: -f + Math.PI / 2
            })
          );
        }
      }
      if (l(4) || o >= 3) {
        let h = l(4) ? 1 : Math.max(0.1, s);
        i.push(part(ze(3.4, 1.6 * h, 8), PALETTE.tile, { y: 2.1 + 0.8 * h, ry: 0.39 })),
        i.push(part(ze(1.4, 0.8, 8), PALETTE.tile2, { y: 3.2, ry: 0.39 }));
      }
      l(4) || Ur(i, 3, 2.6);
    }
  }
  function buildChimesView(i, t, e, n, s) {
    let r = n ? n.level : -1,
      o = (l) => e >= l;
    if (o(1) || r === 0) {
      let l = o(1) ? 1 : Math.max(0.15, s);
      i.push(
        part(lt(0.07, 1.5 * l, 0.07), PALETTE.trunk, { x: -0.7, y: 0.75 * l, rz: 0.12 })
      ),
      i.push(
        part(lt(0.07, 1.5 * l, 0.07), PALETTE.trunk, {
          x: 0.7,
          y: 0.75 * l,
          rz: -0.12
        })
      ),
      l >= 1 &&
      i.push(
        part(yt(0.04, 0.04, 1.6, 4), PALETTE.trunk, { y: 1.45, rz: Math.PI / 2 })
      );
    }
    let a = (l, c, h) => {
      for (let d = 0; d < c; d++) h(-0.5 + (d + l * 0.33) / 3.5 * 1, d);
    };
    (o(2) || r === 1) &&
    a(0, o(2) ? 3 : Math.round(3 * s), (l, c) => {
      i.push(part(lt(0.01, 0.25, 0.01), PALETTE.rope, { x: l, y: 1.3 })),
      i.push(
        part(lt(0.18, 0.22, 0.04), PALETTE.stone, { x: l, y: 1.08 - c * 0.04 })
      );
    }),
    (o(3) || r === 2) &&
    a(1, o(3) ? 3 : Math.round(3 * s), (l, c) => {
      i.push(
        part(yt(0.03, 0.03, 0.5 + c * 0.1, 4), PALETTE.reed, {
          x: l + 0.12,
          y: 1.15 - c * 0.05
        })
      );
    }),
    (o(4) || r === 3) &&
    a(2, o(4) ? 3 : Math.round(3 * s), (l, c) => {
      i.push(part(ze(0.1, 0.16, 6), PALETTE.clay, { x: l + 0.24, y: 1.15 }));
    }),
    o(2) && i.push(part(lt(1.9, 0.05, 0.7), PALETTE.plank, { y: 1.62, rx: 0.15 }));
  }
  function buildLookoutView(i, t, e, n, s) {
    let r = n ? n.level : -1,
      o = n ? n.stage : 0,
      a = (l) => e >= l;
    if (a(1) || r === 0) {
      let l = a(1) ? 1 : Math.max(0.15, s),
        c = Math.round(14 * l);
      for (let h = 0; h < c; h++) {
        let d = Math.floor(h / 5),
          u = h * 1.3,
          f = 0.6 - d * 0.18;
        i.push(
          part(on(0.2 - d * 0.03), h % 2 ? PALETTE.stone : PALETTE.stone2, {
            x: Math.cos(u) * f,
            y: 0.12 + d * 0.26,
            z: Math.sin(u) * f
          })
        );
      }
    }
    if (a(2) || r === 1) {
      let l = a(2) || o >= 1 ? 1 : Math.max(0.1, s);
      for (let [c, h] of [
      [-0.7, -0.7],
      [0.7, -0.7],
      [-0.7, 0.7],
      [0.7, 0.7]])

      i.push(part(lt(0.1, 2.4 * l, 0.1), PALETTE.plank2, { x: c, y: 1.2 * l, z: h }));
      if (a(2) || o >= 1) {
        let c = a(2) ? 1 : Math.max(0.1, s);
        if (i.push(part(lt(1.8 * c, 0.1, 1.8), PALETTE.plank, { y: 2.4 })), a(2)) {
          i.push(part(lt(1.8, 0.35, 0.05), PALETTE.plank2, { y: 2.65, z: -0.9 })),
          i.push(part(lt(0.05, 0.35, 1.8), PALETTE.plank2, { x: 0.9, y: 2.65 }));
          for (let h = 0; h < 6; h++)
          i.push(
            part(lt(0.4, 0.05, 0.12), PALETTE.plank, {
              x: -0.95,
              y: 0.3 + h * 0.38,
              z: -0.6 + h * 0.22,
              rx: 0.4
            })
          );
        }
      }
    }
  }
  function buildDamView(i, t, e, n, s, r) {
    let o = r.world.terrain,
      [a, l] = t.ends,
      c = n ? n.level : -1,
      h = n ? n.stage : 0,
      d = (E) => e >= E,
      u = a.x - t.x,
      f = a.z - t.z,
      p = l.x - t.x,
      x = l.z - t.z,
      g = Math.hypot(p - u, x - f),
      m = Math.atan2(p - u, x - f),
      b = -(x - f) / g,
      T = (p - u) / g,
      y = (E, R = 0) => ({
        x: u + (p - u) * E + b * R,
        z: f + (x - f) * E + T * R
      }),
      S = 0.4 - r.baseY,
      M = (E, R) => o.heightAt(E + t.x, R + t.z) - r.baseY,
      A = 9,
      v = (E) => 0.06 + 0.88 * E / (A - 1);
    if (e === 0 && n && n.level === 0 && n.stage === 0) {
      let E = 0;
      for (let R in n.delivered) E += n.delivered[R];
      if (E === 0 && n.labor < 1) {
        for (let P of [y(0), y(1)])
        i.push(
          part(yt(0.025, 0.03, 0.5, 3), PALETTE.plank2, {
            x: P.x,
            y: M(P.x, P.z) + 0.25,
            z: P.z
          })
        );
        let R = y(0.5);
        i.push(
          part(lt(0.012, 0.012, g), PALETTE.rope, {
            x: R.x,
            y: S + 0.36,
            z: R.z,
            ry: m
          })
        );
      }
    }
    if (d(1) || c === 0) {
      let E = d(1) || h >= 1 ? A : Math.round(A * s);
      for (let R = 0; R < E; R++) {
        let P = y(v(R)),
          N = (hash01(t.id * 7 + R) - 0.5) * 0.14;
        i.push(
          part(yt(0.05, 0.06, 0.95, 5), R % 2 ? PALETTE.trunk : PALETTE.plank2, {
            x: P.x,
            y: S + 0.08,
            z: P.z,
            rx: N,
            rz: N * 0.7
          })
        );
      }
    }
    if (d(1) || c === 0 && h >= 1) {
      let E = [S - 0.06, S + 0.07, S + 0.2, S + 0.32],
        R = (A - 1) * E.length,
        P = d(1) ? R : Math.round(R * s),
        N = g * 0.88 / (A - 1) * 1.15,
        B = 0;
      for (let D = 0; D < E.length; D++)
      for (let I = 0; I < A - 1; I++) {
        if (B++ >= P) continue;
        let H = y((v(I) + v(I + 1)) / 2, (I + D) % 2 ? 0.05 : -0.05);
        i.push(
          part(lt(0.05, 0.05, N), (D + I) % 3 ? PALETTE.trunk : 9073730, {
            x: H.x,
            y: E[D],
            z: H.z,
            ry: m + (hash01(t.id + B) - 0.5) * 0.12
          })
        ),
        hash01(t.id * 3 + B) > 0.72 &&
        i.push(
          part(qt(0.07, 0), PALETTE.willow, { x: H.x, y: E[D] + 0.06, z: H.z })
        );
      }
    }
    if (d(2) || c === 1) {
      let E = d(2) || h >= 1 ? 12 : Math.round(12 * s);
      for (let R = 0; R < E; R++) {
        let P = y(0.04 + 0.92 * R / 11, 0.3 + hash01(t.id + R * 5) * 0.1);
        i.push(
          part(on(0.13 + hash01(t.id + R) * 0.05), R % 2 ? PALETTE.stone : PALETTE.stone2, {
            x: P.x,
            y: S - 0.03,
            z: P.z,
            ry: R
          })
        );
      }
    }
    if (d(2) || c === 1 && h >= 1) {
      let E = d(2) ? 1 : Math.max(0.08, s),
        R = y(0.5, -0.22);
      if (
      i.push(
        part(lt(0.46, 0.6 * E, g * 0.94), PALETTE.mud, {
          x: R.x,
          y: S - 0.2 + 0.3 * E,
          z: R.z,
          ry: m,
          jitter: 0.08,
          seed: t.id
        })
      ),
      d(2))

      for (let P = 0; P < 7; P++) {
        let N = y(0.1 + 0.8 * P / 6, -0.2 + (hash01(t.id + P * 9) - 0.5) * 0.2);
        i.push(
          part(ze(0.05, 0.18, 3), P % 2 ? PALETTE.grass3 : PALETTE.grass2, {
            x: N.x,
            y: S + 0.48,
            z: N.z
          })
        );
      }
    }
    if (d(3) || c === 2) {
      let E = d(3) || h >= 1 ? 8 : Math.round(8 * s);
      for (let R = 0; R < E; R++) {
        let P = o.bankPoint(
            R % 2,
            t.z - 1 - (R >> 1) * 1.7 - hash01(t.id + R) * 0.6,
            0.5 + hash01(t.id * 2 + R) * 0.5
          ),
          N = P.x - t.x,
          B = P.z - t.z,
          D = M(N, B);
        i.push(part(yt(0.02, 0.03, 0.5, 3), PALETTE.trunk, { x: N, y: D + 0.25, z: B })),
        i.push(
          part(qt(0.11, 0), PALETTE.willow, { x: N, y: D + 0.52, z: B, sy: 1.3 })
        );
      }
      if (d(3) || h >= 1) {
        let R = d(3) ? 10 : Math.round(10 * s);
        for (let P = 0; P < R; P++) {
          let N = o.bankPoint(
              P % 2,
              t.z - 0.8 - P * 0.75,
              0.05 + hash01(t.id * 5 + P) * 0.3
            ),
            B = N.x - t.x,
            D = N.z - t.z,
            I = Math.max(S, M(B, D));
          for (let H = 0; H < 3; H++)
          i.push(
            part(ze(0.03, 0.5 + H * 0.1, 3), PALETTE.reed, {
              x: B + (H - 1) * 0.07,
              y: I + 0.25,
              z: D + H % 2 * 0.06
            })
          );
          i.push(
            part(yt(0.035, 0.035, 0.14, 4), PALETTE.cattail, {
              x: B,
              y: I + 0.55,
              z: D
            })
          );
        }
      }
    }
    if (d(1) && (t.pond || 0) > 0.3)
    for (let E = 0; E < 7; E++) {
      let R = y(0.12 + 0.76 * E / 6, 0.42 + hash01(t.id + E * 3) * 0.25);
      i.push(
        part(lt(0.24, 0.02, 0.12), PALETTE.white, {
          x: R.x,
          y: S + 0.012,
          z: R.z,
          ry: hash01(t.id + E) * 3
        })
      );
    }
    if (d(1) && (t.cond ?? 1) < 0.55)
    for (let E = 0; E < 3; E++) {
      let R = y(0.25 + E * 0.25, 1 + E * 0.4);
      i.push(
        part(lt(0.04, 0.04, 0.5), PALETTE.trunk, {
          x: R.x,
          y: S + 0.02,
          z: R.z,
          ry: E * 1.3
        })
      );
    }
  }
  var STRUCTURE_BUILDERS = {
    home: buildHomeView,
    store: buildStoreView,
    crossing: buildCrossingView,
    garden: buildGardenView,
    workshop: buildWorkshopView,
    meeting: buildMeetingView,
    chimes: buildChimesView,
    lookout: buildLookoutView,
    dam: buildDamView
  };
  function cM(i, t) {
    let e = i.ends[t % 2],
      n = e.x - i.x,
      s = e.z - i.z,
      r = Math.hypot(n, s) || 1,
      o = 0.55 + Math.floor(t / 2) * 0.5;
    return { x: n + n / r * o, z: s + s / r * o - 0.6 };
  }
  var StructureView = class {
    constructor(t, e) {
      this.world = t,
      this.scene = e,
      this.group = new Pe(),
      e.add(this.group),
      this.views = new Map(),
      this.glowMat = new je({ color: PALETTE.glow }),
      this.lanterns = [];
    }
    dispose() {
      for (let t of this.views.values()) this.disposeView(t);
      this.scene.remove(this.group);
    }
    disposeView(t) {
      this.group.remove(t.obj),
      t.obj.traverse((e) => {
        e.geometry && e.geometry.dispose();
      });
    }
    sig(t) {
      let e = t.building,
        n = t.level + "|";
      if (e) {
        let r = e.delivered,
          o = 0;
        for (let a in r) o += r[a];
        n +=
        e.level +
        ":" +
        e.stage +
        ":" +
        Math.round(stageProgress(t) * 10) +
        ":" +
        o +
        ":" + (
        e.cureLeft > 0 ? "c" : "");
      }
      if (t.kind === "store" && t.stock) {
        let r = 0;
        for (let o in t.stock) r += Math.ceil(t.stock[o] / 2);
        n += "|" + r;
      }
      if (
      t.kind === "garden" &&
      t.beds && (
      n +=
      "|" +
      t.beds.
      map(
        (r) =>
        r.state[0] +
        Math.round(r.grow * 4) + (
        r.water > 0.6 ? "w" : "")
      ).
      join("")),
      t.kind === "workshop" && (
      n +=
      "|" + (
      t.stock && t.stock.tile || 0) +
      "/" + (
      t.drying && t.drying.length || 0)),
      t.kind === "home")
      {
        let r = this.world.byId[t.owner];
        n += "|" + (r && r.trinkets || 0);
      }
      let s = 0;
      for (let r in t.spare || {}) s += t.spare[r];
      return (
        n += "|" + s + "|" + Math.round((t.cond ?? 1) * 5),
        t.kind === "dam" && (n += "|" + ((t.pond || 0) > 0.3 ? "p" : "")),
        n);

    }
    build(t) {
      let e = this.world,
        n = { world: e, baseY: e.terrain.heightAt(t.x, t.z) };
      (t.kind === "crossing" || t.kind === "dam") && (n.baseY = 0.4);
      let s = e.terrain,
        r = [],
        o = t.building,
        a = o ? stageProgress(t) : 1;
      if (t.level === 0 && o && o.stage === 0 && t.kind !== "dam") {
        let u = 0;
        for (let f in o.delivered) u += o.delivered[f];
        u === 0 && o.labor < 1 && Kb(r, STRUCTURES[t.kind].radius * 0.7);
      }
      STRUCTURE_BUILDERS[t.kind](r, t, t.level, o, a, n);
      let l = (u, f) => {
        let p = cM(t, u);
        return {
          x: p.x,
          z: p.z,
          y0: s.heightAt(p.x + t.x, p.z + t.z) - n.baseY
        };
      };
      if (o && t.kind !== "crossing") {
        let u = stageNeeds(t),
          f = 0,
          p = STRUCTURES[t.kind].radius + 0.35;
        for (let x in u) {
          let g = Math.min(u[x], o.delivered[x] || 0);
          if (g > 0)
          if (t.ends) {
            let m = l(f);
            ta(r, x, g, m.x, m.z, t.id * 11 + f, m.y0);
          } else {
            let m = 0.9 + f * 0.75;
            ta(r, x, g, Math.cos(m) * p, Math.sin(m) * p, t.id * 11 + f);
          }
          f++;
        }
      }
      if (t.spare && t.kind !== "crossing") {
        let u = 0;
        for (let f in t.spare)
        if (t.spare[f] > 0) {
          if (t.ends) {
            let p = l(u + 2);
            ta(r, f, Math.ceil(t.spare[f] / 2), p.x, p.z, t.id * 5 + u, p.y0);
          } else {
            let p = 4.2 + u * 0.6,
              x = STRUCTURES[t.kind].radius + 0.5;
            ta(
              r,
              f,
              Math.ceil(t.spare[f] / 2),
              Math.cos(p) * x,
              Math.sin(p) * x,
              t.id * 5 + u
            );
          }
          u++;
        }
      }
      let c = t.cond ?? 1;
      if (c < 0.6 && t.level > 0 && !t.ends)
      for (let u = 0; u < 4; u++) {
        let f = hash01(t.id * 3 + u) * 6.28,
          p = STRUCTURES[t.kind].radius * (0.8 + hash01(t.id + u) * 0.4);
        r.push(
          part(lt(0.3, 0.03, 0.08), PALETTE.thatch2, {
            x: Math.cos(f) * p,
            y: 0.03,
            z: Math.sin(f) * p,
            ry: f
          })
        );
      }
      let h = mergeParts(r);
      if (h && c < 0.85 && t.level > 0) {
        let u = h.attributes.color.array,
          f = 0.72 + 0.28 * Math.max(0, c) / 0.85;
        for (let p = 0; p < u.length; p++) u[p] *= f;
      }
      let d = new Pe();
      if (h) {
        let u = new Et(h, he());
        u.castShadow = !0, u.receiveShadow = !0, d.add(u);
      }
      if (
      t.kind === "meeting" && (
      t.level >= 3 || o && o.level === 2 && o.stage >= 1))
      {
        let u = t.level >= 3 ? 5 : Math.round(5 * a),
          f = [];
        for (let x = 0; x < u; x++) {
          let g = x / 5 * 6.28 + 0.63;
          f.push(
            part(Bn(0.13, 5, 4), 16777215, {
              x: Math.cos(g) * 2.2,
              y: 1.25,
              z: Math.sin(g) * 2.2
            })
          );
        }
        let p = mergeParts(f);
        if (p) {
          let x = new Et(p, this.glowMat);
          d.add(x);
          let g = new Cs(10483688, 0, 9, 1.2);
          g.position.set(0, 1.3, 0), d.add(g), d.userData.light = g;
        }
      }
      if (d.position.set(t.x, n.baseY, t.z), t.kind === "garden") {
        let u = e.terrain,
          f = u.bankPoint(u.side(t.x, t.z), t.z, 0.3);
        d.rotation.y = Math.atan2(f.z - t.z, -(f.x - t.x));
      } else
      t.kind !== "crossing" &&
      t.kind !== "dam" && (
      d.rotation.y = t.rot || 0);
      return d;
    }
    sync() {
      let t = new Set();
      for (let e of this.world.structures) {
        t.add(e.id);
        let n = this.sig(e),
          s = this.views.get(e.id);
        if (s && s.sig === n) continue;
        s && this.disposeView(s);
        let r = this.build(e);
        this.group.add(r), this.views.set(e.id, { sig: n, obj: r });
      }
      for (let [e, n] of this.views)
      t.has(e) || (this.disposeView(n), this.views.delete(e));
    }
    update(t, e, n) {
      this.glowMat.color.setRGB(0.55 + e * 0.9, 0.95 + e * 0.6, 0.9 + e * 0.6);
      for (let [s, r] of this.views) {
        let o = this.world.byId[s];
        o &&
        o.kind === "chimes" &&
        r.obj.children[0] && (
        r.obj.children[0].rotation.z =
        Math.sin(t * 5) * 0.012 * (n > 0 ? 1 + n : 0.2));
      }
      for (let s of this.views.values()) {
        let r = s.obj.userData.light;
        r && (r.intensity = e * (2.5 + Math.sin(t * 2.3) * 0.2));
      }
    }
  };
  var Bc = Math.PI * 2,
    ti = (i, t, e) => i + (t - i) * e;
  function hM(i, t, e) {
    let n = ((t - i + Math.PI) % Bc + Bc) % Bc - Math.PI;
    return i + n * e;
  }
  var Fr = [
    [32, 0.55, 0.72],
    [24, 0.62, 0.55],
    [12, 0.65, 0.52],
    [22, 0.42, 0.34],
    [218, 0.45, 0.58],
    [272, 0.4, 0.66],
    [342, 0.58, 0.72],
    [40, 0.15, 0.6],
    [46, 0.75, 0.58],
    [192, 0.45, 0.5],
    [30, 0.3, 0.88],
    [0, 0, 0.42]],

    ym = new WeakMap();
  function _m(i, t) {
    let e = ym.get(i);
    if (!e || e.n !== i.creatures.length) {
      e = { n: i.creatures.length, map: new Map() };
      let n = new Set();
      for (let s of i.creatures) {
        let r = Math.floor(s.look.hue * Fr.length) % Fr.length;
        for (; n.has(r) && n.size < Fr.length;) r = (r + 5) % Fr.length;
        n.add(r), e.map.set(s.id, r);
      }
      ym.set(i, e);
    }
    return e.map.get(t.id) ?? 0;
  }
  function sd(i, t) {
    let e = Fr[_m(i, t)];
    return `hsl(${e[0]} ${Math.round(e[1] * 100)}% ${Math.round(e[2] * 100)}%)`;
  }
  var Hc = {};
  function vm(i) {
    if (Hc[i]) return Hc[i];
    let t;
    switch (i) {
      case "branch":
        t = mergeParts([
        part(yt(0.03, 0.04, 0.7, 4), PALETTE.trunk, { rz: Math.PI / 2 }),
        part(yt(0.02, 0.02, 0.2, 3), PALETTE.trunk, { x: 0.2, y: 0.07, rz: 0.6 })]
        );
        break;
      case "reeds":
        t = mergeParts([
        part(yt(0.02, 0.02, 0.8, 3), PALETTE.reed, { rz: Math.PI / 2 - 0.2 }),
        part(yt(0.02, 0.02, 0.8, 3), PALETTE.reed, {
          y: 0.04,
          rz: Math.PI / 2 + 0.15
        }),
        part(yt(0.035, 0.035, 0.14, 4), PALETTE.cattail, {
          x: 0.38,
          y: 0.08,
          rz: Math.PI / 2 - 0.2
        })]
        );
        break;
      case "stone":
        t = mergeParts([part(on(0.13), PALETTE.stone)]);
        break;
      case "mud":
        t = mergeParts([part(qt(0.12, 0), PALETTE.mud)]);
        break;
      case "clay":
        t = mergeParts([part(qt(0.12, 0), PALETTE.clay)]);
        break;
      case "seeds":
        t = mergeParts([part(Bn(0.1, 5, 4), 14200944)]);
        break;
      case "glowcap":
        t = mergeParts([part(Bn(0.09, 5, 3), PALETTE.glow, { sy: 0.6 })]);
        break;
      case "tile":
        t = mergeParts([part(lt(0.28, 0.04, 0.18), PALETTE.tile)]);
        break;
      default:
        t = mergeParts([part(qt(0.09, 0), PALETTE.berry)]);
    }
    return Hc[i] = t, t;
  }
  var CreatureView = class {
    constructor(t, e, n) {
      this.c = t, this.world = n, this.scene = e;
      let s = t.look,
        r = Fr[_m(n, t)],
        o = new wt().setHSL(r[0] / 360, r[1], r[2] * (0.92 + s.light * 0.15)),
        a = o.clone().multiplyScalar(0.72),
        l = new wt().setHSL(
          r[0] / 360,
          r[1] * 0.55,
          Math.min(0.92, r[2] + 0.22)
        );
      this.furColor = o.clone(),
      this.mFur = new Qe({ color: o, flatShading: !0 }),
      this.mDark = new Qe({ color: a, flatShading: !0 }),
      this.mBelly = new Qe({ color: l, flatShading: !0 }),
      this.mEye = new je({ color: PALETTE.dark }),
      this.mInner = new Qe({ color: 15902645, flatShading: !0 });
      let c = s.size,
        h = this.root = new Pe(),
        d = this.pivot = new Pe();
      h.add(d);
      let u = new Et(new jn(0.28, 1), this.mFur);
      u.scale.set(1, 0.92, 0.95),
      u.position.y = 0.3,
      u.castShadow = !0,
      d.add(u),
      this.body = u;
      let f = new Et(new jn(0.2, 1), this.mBelly);
      if (
      f.scale.set(0.9, 0.95 * s.belly + 0.2, 0.5),
      f.position.set(0, 0.26, 0.15),
      d.add(f),
      s.spots)
      {
        let M = mergeParts([
        part(qt(0.06, 0), 16777215, { x: 0.1, y: 0.42, z: -0.16 }),
        part(qt(0.05, 0), 16777215, { x: -0.12, y: 0.34, z: -0.2 }),
        part(qt(0.045, 0), 16777215, { x: 0.02, y: 0.24, z: -0.25 })]
        );
        d.add(new Et(M, this.mDark));
      }
      let p = new Un(0.06 * s.eye, 0.09 * s.eye, 0.03);
      this.eyes = [];
      let x = new Un(0.022 * s.eye, 0.022 * s.eye, 0.01),
        g = new je({ color: 16777215 });
      for (let M of [-1, 1]) {
        let A = new Et(p, this.mEye);
        A.position.set(0.1 * M, 0.38, 0.245);
        let v = new Et(x, g);
        v.position.set(0.012 * s.eye, 0.022 * s.eye, 0.018),
        A.add(v),
        d.add(A),
        this.eyes.push(A);
      }
      let m = new Et(new Un(0.05, 0.035, 0.03), this.mInner);
      m.position.set(0, 0.32, 0.27), d.add(m), this.ears = [];
      let b = new Ii(0.085 * s.earW, 0.26 * s.ear, 4);
      b.translate(0, 0.13 * s.ear, 0);
      let T = new Ii(0.045 * s.earW, 0.16 * s.ear, 4);
      T.translate(0, 0.1 * s.ear, 0.025);
      for (let M of [-1, 1]) {
        let A = new Pe();
        A.position.set(0.14 * M, 0.5, -0.02);
        let v = new Et(b, this.mDark),
          E = new Et(T, this.mInner);
        A.add(v, E), d.add(A), this.ears.push({ g: A, sx: M, rz: 0, rx: 0 });
      }
      this.hands = [];
      let y = new jn(0.075 * s.hands, 0);
      for (let M of [-1, 1]) {
        let A = new Et(y, this.mDark);
        A.position.set(0.28 * M, 0.2, 0.06), d.add(A), this.hands.push(A);
      }
      if (s.tail === 1) {
        let M = new Et(new jn(0.08, 0), this.mBelly);
        M.position.set(0, 0.18, -0.27), d.add(M), this.tail = M;
      }
      if (s.tail === 2) {
        let M = new Ii(0.06, 0.32, 4);
        M.rotateX(-1.1);
        let A = new Et(M, this.mDark);
        A.position.set(0, 0.2, -0.3), d.add(A), this.tail = A;
      }
      this.feet = [];
      let S = new jn(0.07, 0);
      for (let M of [-1, 1]) {
        let A = new Et(S, this.mDark);
        A.scale.set(1, 0.55, 1.3),
        A.position.set(0.12 * M, 0.035, 0.04),
        h.add(A),
        this.feet.push(A);
      }
      this.carry = new Et(
        vm("branch"),
        new Qe({ vertexColors: !0, flatShading: !0 })
      ),
      this.carry.position.set(0, 0.24, 0.33),
      this.carry.visible = !1,
      d.add(this.carry),
      this.carryKind = null,
      this.basket = new Et(
        mergeParts([part(yt(0.12, 0.09, 0.16, 6), PALETTE.thatch2)]),
        new Qe({ vertexColors: !0, flatShading: !0 })
      ),
      this.basket.position.set(0, 0.32, -0.3),
      this.basket.visible = !1,
      d.add(this.basket),
      this.shadow = new Et(
        new Lo(0.3, 10),
        new je({
          color: 1709088,
          transparent: !0,
          opacity: 0.28,
          depthWrite: !1
        })
      ),
      this.shadow.rotation.x = -Math.PI / 2,
      this.shadow.position.y = 0.02,
      h.add(this.shadow),
      this.ripple = new Et(
        new Rs(0.34, 0.42, 12),
        new je({
          color: 15136511,
          transparent: !0,
          opacity: 0.7,
          depthWrite: !1
        })
      ),
      this.ripple.rotation.x = -Math.PI / 2,
      this.ripple.visible = !1,
      h.add(this.ripple),
      h.scale.setScalar(c * 1.25),
      e.add(h),
      this.yaw = t.face || 0,
      this.blinkT = 2 + Math.random() * 3,
      this.twitch = [
      { t: 0, v: 0 },
      { t: 0, v: 0 }],

      this.state = { lean: 0, sit: 0, lie: 0, squash: 1, armL: 0, armR: 0 },
      this.phase = Math.random() * 10,
      this.px = t.x,
      this.pz = t.z,
      this.speed = 0,
      this.visualY = 0;
    }
    dispose() {
      this.scene.remove(this.root),
      this.root.traverse((t) => {
        t.geometry &&
        !Object.values(Hc).includes(t.geometry) &&
        t.geometry.dispose();
      });
      for (let t of [
      this.mFur,
      this.mDark,
      this.mBelly,
      this.mEye,
      this.mInner])

      t.dispose();
    }
    update(t, e, n) {
      let s = this.c,
        r = this.world,
        o = s.act,
        a = r.terrain,
        l = positionAt(s, n),
        c = o ? o.type : "idle",
        h = o ?
        Math.max(0, Math.min(1, (n - o.t0) / Math.max(0.01, o.t1 - o.t0))) :
        0,
        d = o ? n - o.t0 : 0;
      if (c === "play2" && o.cx !== void 0) {
        let I = d * 1.6 + s.id % 2 * Math.PI,
          H = 1.4;
        l = { x: o.cx + Math.cos(I) * H, z: o.cz + Math.sin(I) * H };
      }
      if (c === "groom" || c === "chat") {
        let I = r.byId[o.lookId];
        if (I) {
          let H = positionAt(I, n),
            X = H.x - l.x,
            nt = H.z - l.z,
            Y = Math.hypot(X, nt),
            K = c === "groom" ? 0.65 : 0.95;
          if (Y > K) {
            let et = Math.min(1, d / 2) * (Y - K) * 0.5 / Y;
            l = { x: l.x + X * et, z: l.z + nt * et };
          }
        }
      }
      let u = Math.hypot(l.x - this.px, l.z - this.pz);
      this.speed = ti(this.speed, t > 0 ? u / t : 0, Math.min(1, t * 8)),
      this.px = l.x,
      this.pz = l.z;
      let f = this.yaw;
      if (c === "walk" && o.path) {
        let I = o.path;
        for (let H = 1; H < I.length; H++)
        if (n <= I[H].t || H === I.length - 1) {
          let X = I[H - 1],
            nt = I[H];
          Math.hypot(nt.x - X.x, nt.z - X.z) > 0.01 && (
          f = Math.atan2(nt.x - X.x, nt.z - X.z));
          break;
        }
      } else if (c === "play2") {
        f =
        Math.atan2(
          -Math.sin(d * 1.6 + s.id % 2 * Math.PI),
          Math.cos(d * 1.6 + s.id % 2 * Math.PI)
        ) + (s.id % 2, 0);
        let I = d * 1.6 + s.id % 2 * Math.PI;
        f = Math.atan2(-Math.sin(I), Math.cos(I));
      } else if (o && o.lookId && r.byId[o.lookId]) {
        let I = positionAt(r.byId[o.lookId], n);
        Math.hypot(I.x - l.x, I.z - l.z) > 0.05 && (
        f = Math.atan2(I.x - l.x, I.z - l.z));
      } else
      o &&
      o.lookX !== void 0 &&
      Math.hypot(o.lookX - l.x, o.lookZ - l.z) > 0.05 ?
      f = Math.atan2(o.lookX - l.x, o.lookZ - l.z) :
      s.attend &&
      r.t - s.attend.t < s.attend.d &&
      c !== "sleep" &&
      c !== "nap" ?
      f = Math.atan2(s.attend.x - l.x, s.attend.z - l.z) :
      f = s.face ?? f;
      c === "gesture" && o.g === "spin" && (f += h * Bc),
      this.yaw = hM(
        this.yaw,
        f,
        Math.min(1, t * (c === "gesture" ? 20 : 7))
      );
      let p = {
          lean: 0,
          sit: 0,
          lie: 0,
          squash: 1,
          armL: 0,
          armR: 0,
          handFwd: 0.06,
          handY: 0.2,
          hop: 0,
          shake: 0,
          earDown: 0,
          earPerk: 0,
          eyesClosed: !1
        },
        x = e * (o && o.run ? 13 : 9) + this.phase,
        g = !1;
      switch (c) {
        case "walk":
          g = this.speed > 0.05, p.lean = o.run ? 0.22 : 0.08;
          break;
        case "sleep":
        case "nap":
          p.lie = 1,
          p.eyesClosed = !0,
          p.earDown = 0.8,
          p.squash = 1 + Math.sin(e * 1.4 + this.phase) * 0.03;
          break;
        case "sit":
        case "watch":
        case "huddle":
          p.sit = 1,
          c === "huddle" && (
          p.earDown = 0.9,
          p.squash = 0.9,
          p.handFwd = 0.18,
          p.handY = 0.28),
          c === "watch" && (
          p.earPerk = 0.4,
          p.lean = Math.sin(e * 0.5 + this.phase) * 0.05);
          break;
        case "eat":
          p.sit = 0.6,
          p.handFwd = 0.26,
          p.handY = 0.32 + Math.abs(Math.sin(e * 7)) * 0.04,
          p.squash = 1 + Math.sin(e * 14) * 0.03;
          break;
        case "pick":
        case "dig":
        case "take":
        case "stash":
        case "deposit":
        case "plant":
        case "sow":
        case "harvest":
        case "tend":
          p.lean = 0.45,
          p.handFwd = 0.32,
          p.handY = 0.08 + Math.abs(Math.sin(e * 6)) * 0.08,
          c === "dig" && (
          p.armL = Math.sin(e * 8) * 0.5, p.armR = -p.armL);
          break;
        case "labor":
        case "craft":
          p.lean = 0.25,
          p.handFwd = 0.3,
          p.handY = 0.25 + Math.max(0, Math.sin(e * 7 + this.phase)) * 0.25,
          p.armR = Math.sin(e * 7 + this.phase) * 0.6,
          p.squash =
          1 - Math.max(0, Math.sin(e * 7 + this.phase - 0.5)) * 0.05;
          break;
        case "heavyj":
        case "lift":
          p.lean = 0.3,
          p.handFwd = 0.32,
          p.handY = 0.15 + Math.sin(h * Math.PI) * 0.35,
          p.squash =
          1 - Math.sin(h * Math.PI) * 0.12 + Math.sin(e * 30) * 0.01,
          p.earDown = 0.3;
          break;
        case "strain":
          p.lean = 0.35,
          p.handFwd = 0.33,
          p.handY = 0.15,
          p.squash = 0.86,
          p.shake = 0.025,
          p.earDown = 0.6;
          break;
        case "call":
          p.handFwd = 0.2,
          p.handY = 0.38,
          p.hop = Math.abs(Math.sin(d * 9)) * 0.06,
          p.earPerk = 1;
          break;
        case "chat":
          p.hop = Math.abs(Math.sin(e * 4 + this.phase)) * 0.025,
          p.earPerk = 0.5,
          p.armL = Math.sin(e * 3 + this.phase) * 0.3;
          break;
        case "groom":
          p.sit = 0.6,
          p.handFwd = 0.32,
          p.handY = 0.35 + Math.sin(e * 5) * 0.06,
          p.eyesClosed = s.id % 2 === 0;
          break;
        case "play2":
          g = !0, p.lean = 0.2, p.hop = Math.abs(Math.sin(x)) * 0.06;
          break;
        case "play":{
            let I = o.kind;
            (I === "stack" ||
            I === "mudpie" ||
            I === "collect" ||
            I === "admire") && (
            p.sit = 0.8,
            p.handFwd = 0.3,
            p.handY = 0.15 + Math.abs(Math.sin(e * 4)) * 0.1,
            p.lean = 0.2),
            I === "drum" && (
            p.handFwd = 0.3,
            p.handY = 0.3,
            p.armL = Math.sin(e * 12) * 0.7,
            p.armR = -p.armL),
            I === "perch" && (p.sit = 1, p.earPerk = 0.6),
            I === "dance" && (
            p.hop = Math.abs(Math.sin(e * 6)) * 0.18,
            this.yaw += t * 3,
            p.handY = 0.4),
            I === "chaseleaf" && (
            g = !0, p.hop = Math.abs(Math.sin(e * 8)) * 0.08);
            break;
          }
        case "gesture":{
            let I = o.g;
            I === "spin" && (p.handY = 0.35),
            I === "clap" && (
            p.handFwd = 0.28,
            p.handY = 0.33,
            p.clap = Math.abs(Math.sin(d * 9))),
            I === "tap" && (
            p.lean = 0.5,
            p.handFwd = 0.34,
            p.handY = 0.05 + Math.abs(Math.sin(d * 8)) * 0.1),
            I === "ears" && (p.earFlick = Math.sin(d * 14)),
            I === "hop" && (p.hop = Math.abs(Math.sin(d * 4)) * 0.25);
            break;
          }
        case "wait":
          p.earPerk = 0.5 + Math.sin(e * 2) * 0.3,
          this.yaw += Math.sin(e * 0.8 + this.phase) * t * 0.8;
          break;
        case "look":
          p.earPerk = 0.8, p.lean = -0.05;
          break;
        case "mark":
          p.lean = 0.35,
          p.handFwd = 0.3,
          p.handY = 0.1 + Math.abs(Math.sin(e * 10)) * 0.12;
          break;
        case "give":
          p.handFwd = 0.4, p.handY = 0.3;
          break;
      }
      if (s.emo && r.t - s.emo.t < 120) {
        let I = s.emo.k;
        (I === "fright" || I === "sad" || I === "frustration") && (
        p.earDown = Math.max(p.earDown, 0.7)),
        (I === "joy" || I === "pride" || I === "curious") && (
        p.earPerk = Math.max(p.earPerk, 0.7));
      }
      s.wet > 0.6 && (p.earDown = Math.max(p.earDown, 0.5)),
      s.attend && r.t - s.attend.t < s.attend.d && (p.earPerk = 1);
      let m = this.state,
        b = Math.min(1, t * 7);
      m.lean = ti(m.lean, p.lean, b),
      m.sit = ti(m.sit, p.sit, b),
      m.lie = ti(m.lie, p.lie, Math.min(1, t * 3)),
      m.squash = ti(m.squash, p.squash, Math.min(1, t * 12));
      let T = a.heightAt(l.x, l.z),
        y = waterLevelAt(r, l.x, l.z),
        S = T;
      if (a.isWater(l.x, l.z))
      if (o && o.cross) {
        let I = r.byId[o.cross];
        S =
        I && I.kind === "dam" ?
        0.4 + 0.42 :
        0.4 + (I && I.level >= 2 ? 0.66 : 0.17);
      } else S = Math.max(0.4 - 0.18, y - 0.26);
      if (c === "play" && o.kind === "perch") {
        let I = r.res.find(
          (H) => H.kind === "boulder" && Math.hypot(H.x - l.x, H.z - l.z) < 1.2
        );
        I && (S += 0.6 * (I.size || 1));
      }
      let M = s.home != null ? r.byId[s.home] : null;
      M && M.level >= 5 && Math.hypot(M.x - l.x, M.z - l.z) < 1 && (S += 0.42),
      this.visualY = ti(this.visualY || S, S, Math.min(1, t * 10));
      let A = g ? Math.abs(Math.sin(x)) * 0.05 : 0;
      this.root.position.set(
        l.x + (p.shake ? Math.sin(e * 50) * p.shake : 0),
        this.visualY + A + p.hop,
        l.z
      ),
      this.root.rotation.y = this.yaw;
      let v = m.squash * (g ? 1 + Math.sin(x * 2) * 0.04 : 1);
      this.pivot.scale.set(1 / Math.sqrt(v), v, 1 / Math.sqrt(v)),
      this.pivot.rotation.x = m.lean,
      this.pivot.rotation.z = m.lie * 1.35,
      this.pivot.position.y = -m.sit * 0.07 + m.lie * 0.12,
      this.pivot.position.x = -m.lie * 0.05,
      this.body.scale.y = 0.92 + Math.sin(e * 2.2 + this.phase) * 0.012;
      for (let I = 0; I < 2; I++) {
        let H = this.feet[I],
          X = x + I * Math.PI;
        H.position.z = 0.04 + (g ? Math.sin(X) * 0.09 : 0) + m.sit * 0.12,
        H.position.y = 0.035 + (g ? Math.max(0, Math.cos(X)) * 0.05 : 0),
        H.visible = m.lie < 0.5;
      }
      for (let I = 0; I < 2; I++) {
        let H = this.hands[I],
          X = I ? 1 : -1,
          nt = g && !s.carry ? Math.sin(x + I * Math.PI) * 0.08 : 0,
          Y = 0.28 * X,
          K = p.handFwd + nt,
          et = p.handY,
          Dt = I ? p.armR : p.armL;
        et += Dt * 0.1,
        s.carry &&
        c !== "deposit" &&
        c !== "stash" && (
        K = 0.3, et = 0.24, Y = 0.18 * X),
        p.clap !== void 0 && (Y = X * (0.06 + 0.18 * (1 - p.clap))),
        H.position.x = ti(H.position.x, Y, Math.min(1, t * 14)),
        H.position.y = ti(H.position.y, et, Math.min(1, t * 14)),
        H.position.z = ti(H.position.z, K, Math.min(1, t * 14));
      }
      for (let I = 0; I < 2; I++) {
        let H = this.ears[I],
          X = this.twitch[I];
        e > X.t && (X.t = e + 1.5 + Math.random() * 5, X.v = 1),
        X.v = Math.max(0, X.v - t * 6);
        let nt = p.earFlick !== void 0 ? p.earFlick * 0.6 : 0,
          Y =
          -H.sx * (0.25 + p.earDown * 0.9 - p.earPerk * 0.2) -
          H.sx * X.v * 0.25 -
          H.sx * nt,
          K = -0.1 + p.earDown * 0.5 - p.earPerk * 0.15;
        H.rz = ti(H.rz, Y, Math.min(1, t * 10)),
        H.rx = ti(H.rx, K, Math.min(1, t * 10)),
        H.g.rotation.set(H.rx, 0, H.rz);
      }
      this.blinkT -= t;
      let E = 1;
      this.blinkT < 0 && (
      E = 0.15,
      this.blinkT < -0.12 && (this.blinkT = 2 + Math.random() * 4)),
      p.eyesClosed && (E = 0.15);
      let R =
      s.emo &&
      r.t - s.emo.t < 60 && (
      s.emo.k === "joy" || s.emo.k === "pride");
      for (let I of this.eyes) I.scale.y = R && E > 0.5 ? 0.5 : E;
      this.tail && (
      this.tail.rotation.y = R ?
      Math.sin(e * 12) * 0.4 :
      Math.sin(e * 1.5 + this.phase) * 0.1);
      let P = s.carry ? s.carry.k : null;
      P !== this.carryKind && (
      this.carryKind = P,
      P && (this.carry.geometry = vm(P)),
      this.carry.visible = !!P),
      P && this.carry.scale.setScalar(s.carry.n > 1 ? 1.25 : 1),
      this.basket.visible = !!(s.tools && s.tools.basket);
      let N = s.wet || 0;
      this.mFur.color.copy(this.furColor).multiplyScalar(1 - N * 0.3);
      let B = a.isWater(l.x, l.z) || T < y - 0.035;
      this.shadow.visible = !B;
      let D = B && !(o && o.cross);
      if (this.ripple.visible = D, D) {
        let I = e * 1.3 % 1;
        this.ripple.scale.setScalar(0.8 + I * 0.9),
        this.ripple.material.opacity = 0.75 * (1 - I),
        this.ripple.position.y =
        (y - this.visualY) / this.root.scale.y + 0.02;
      }
      return (
        this.shadow.position.y =
        0.02 - (this.visualY - T) / this.root.scale.y,
        { x: l.x, y: this.visualY + A + p.hop, z: l.z, walking: g });

    }
  };
  var bm = {
    A: ".#.#.#####.##.#",
    B: "##.#.###.#.###.",
    C: ".###..#..#...##",
    D: "##.#.##.##.###.",
    E: "####..##.#..###",
    F: "####..##.#..#..",
    G: ".###..#.##.#.##",
    H: "#.##.#####.##.#",
    I: "###.#..#..#.###",
    J: "..#..#..##.#.#.",
    K: "#.##.###.#.##.#",
    L: "#..#..#..#..###",
    M: "#.########.##.#",
    N: "##.#.##.##.##.#",
    O: ".#.#.##.##.#.#.",
    P: "##.#.###.#..#..",
    Q: ".#.#.##.###..##",
    R: "##.#.###.#.##.#",
    S: ".###...#...###.",
    T: "###.#..#..#..#.",
    U: "#.##.##.##.####",
    V: "#.##.##.##.#.#.",
    W: "#.##.########.#",
    X: "#.##.#.#.#.##.#",
    Y: "#.##.#.#..#..#.",
    Z: "###..#.#.#..###",
    "!": ".#..#..#.....#.",
    "?": "##...#.#.....#.",
    ".": ".............#.",
    ",": "..........#.#..",
    "'": ".#..#..........",
    "-": "......###......",
    ":": "....#.....#....",
    "~": "....#.#.#......",
    0: "####.##.##.####",
    1: ".#.##..#..#.###",
    2: "##...#.#.#..###",
    3: "##...#.#...###.",
    4: "#.##.####..#..#",
    5: "####..##...###.",
    6: ".###..####.####",
    7: "###..#.#..#..#.",
    8: "####.#####.####",
    9: "####.####..###."
  };
  function uM(i) {
    let t = 0;
    for (let e of i.toUpperCase()) t += e === " " ? 2 : 4;
    return Math.max(0, t - 1);
  }
  function dM(i, t, e, n, s) {
    i.fillStyle = s;
    for (let r of t.toUpperCase()) {
      if (r === " ") {
        e += 2;
        continue;
      }
      let o = bm[r] || bm["?"];
      for (let a = 0; a < 15; a++)
      o[a] === "#" && i.fillRect(e + a % 3, n + Math.floor(a / 3), 1, 1);
      e += 4;
    }
  }
  var fM = {
      k: "#2a1f2e",
      w: "#fff8ec",
      r: "#e8505b",
      y: "#ffd166",
      b: "#6cb4ee",
      g: "#7bd389",
      o: "#f4a259",
      p: "#f7a1c4",
      c: "#8ff7f0",
      n: "#a07850",
      s: "#c8d0e0"
    },
    Mm = {
      heart: [
      ".kk...kk.",
      "krrk.krrk",
      "krrrkrrrk",
      "krrrrrrrk",
      ".krrrrrk.",
      "..krrrk..",
      "...krk...",
      "....k....",
      "........."],

      star: [
      "....k....",
      "...kyk...",
      "kkkyyykkk",
      "kyyyyyyyk",
      ".kyyyyyk.",
      ".kyykyyk.",
      "kyyk.kyyk",
      "kkk...kkk",
      "........."],

      "!": [
      "..kkk....",
      "..kwk....",
      "..kwk....",
      "..kwk....",
      "..kwk....",
      "..kkk....",
      "..kwk....",
      "..kkk....",
      "........."],

      "?": [
      ".kkkkk...",
      "kwwwwwk..",
      "kkk.kwk..",
      "...kwwk..",
      "..kwkk...",
      "..kkk....",
      "..kwk....",
      "..kkk....",
      "........."],

      zzz: [
      ".........",
      "kkkkk....",
      "kwwwk....",
      ".kwk.kkkk",
      "kwkkkkwwk",
      "kwwwk.kwk",
      "kkkk.kwkk",
      "....kwwwk",
      "....kkkkk"],

      anger: [
      ".kk...kk.",
      "krrk.krrk",
      ".krrkrrk.",
      "..krrrk..",
      ".krrkrrk.",
      "krrk.krrk",
      ".kk...kk.",
      ".........",
      "........."],

      sweat: [
      "....k....",
      "...kbk...",
      "..kbbbk..",
      ".kbbwbbk.",
      ".kbbbwbk.",
      ".kbbbbbk.",
      "..kbbbk..",
      "...kkk...",
      "........."],

      note: [
      "...kkkkk.",
      "...kyyyk.",
      "...kykkk.",
      "...kyk...",
      ".kkkyk...",
      "kyyyyk...",
      "kyyyyk...",
      ".kkkk....",
      "........."],

      idea: [
      "..kkkkk..",
      ".kyyyyyk.",
      "kyywyyyyk",
      "kyyyyyyyk",
      ".kyyyyyk.",
      "..kyyyk..",
      "..ksssk..",
      "..kkkkk..",
      "........."],

      think: [
      ".........",
      ".........",
      ".........",
      "kkk.kkk.k",
      "kwk.kwk.k",
      "kkk.kkk.k",
      ".........",
      ".........",
      "........."],

      ok: [
      ".........",
      ".......kk",
      "......kgk",
      "kk...kgk.",
      "kgk.kgk..",
      ".kgkgk...",
      "..kgk....",
      "...k.....",
      "........."],

      no: [
      "kk.....kk",
      "krk...krk",
      ".krk.krk.",
      "..krkrk..",
      "...krk...",
      "..krkrk..",
      ".krk.krk.",
      "krk...krk",
      "kk.....kk"],

      splash: [
      "k...k...k",
      "kb.kbk.bk",
      ".kbbbbbk.",
      "kbbwbbbbk",
      "kbbbbwbbk",
      ".kbbbbbk.",
      "..kkkkk..",
      ".........",
      "........."],

      yuck: [
      "..kkkkk..",
      ".kgggggk.",
      "kgkgggkgk",
      "kgggggggk",
      "kggkkkggk",
      "kgkgggkgk",
      ".kgggggk.",
      "..kkkkk..",
      "........."],

      happy: [
      "..kkkkk..",
      ".kyyyyyk.",
      "kykyyykyk",
      "kyyyyyyyk",
      "kykyyykyk",
      "kyykkkyyk",
      ".kyyyyyk.",
      "..kkkkk..",
      "........."],

      grumble: [
      ".........",
      "kkkkkkkkk",
      "ksssssssk",
      "kskskskk.",
      "kssssssk.",
      "kkkkkkk..",
      ".........",
      ".........",
      "........."],

      sigh: [
      ".........",
      "...kk....",
      "..ksk.kk.",
      ".kssksk..",
      "ksssssk..",
      ".kkkkk...",
      ".........",
      ".........",
      "........."],

      busy: [
      "..kkkkk..",
      ".kwwwwwk.",
      "kwwwkwwwk",
      "kwwwkwwwk",
      "kwwwkkkwk",
      "kwwwwwwwk",
      ".kwwwwwk.",
      "..kkkkk..",
      "........."],

      eye: [
      ".........",
      "..kkkkk..",
      ".kwwwwwk.",
      "kwwkkkwwk",
      "kwwkkkwwk",
      ".kwwwwwk.",
      "..kkkkk..",
      ".........",
      "........."],

      food: [
      "....kk...",
      "...kgk...",
      "..kkkkk..",
      ".krrrrrk.",
      "krrwrrrrk",
      "krrrrrrrk",
      ".krrrrrk.",
      "..kkkkk..",
      "........."],

      hammer: [
      "kkkkk....",
      "knnnnk...",
      "kkkknk...",
      "...kssk..",
      "....kssk.",
      ".....kssk",
      "......kkk",
      ".........",
      "........."],

      sad: [
      ".........",
      ".kkkkkkk.",
      "kssssssk.",
      "ksssssssk",
      ".kkkkkkk.",
      "..k.b.k..",
      "...b...b.",
      ".b...b...",
      "........."],

      sparkle: [
      "....k....",
      "...kwk...",
      ".k.kwk.k.",
      "kwkwwwkwk",
      ".k.kwk.k.",
      "...kwk...",
      "....k....",
      ".........",
      "........."]

    },
    rd = Object.keys(Mm),
    Di = null,
    Ni = 9,
    Or = 8;
  function od() {
    if (Di) return Di;
    let i = rd.length,
      t = Math.ceil(i / Or),
      e = document.createElement("canvas");
    e.width = Or * (Ni + 1), e.height = t * (Ni + 1);
    let n = e.getContext("2d");
    return (
      rd.forEach((s, r) => {
        let o = r % Or * (Ni + 1),
          a = Math.floor(r / Or) * (Ni + 1);
        Mm[s].forEach((l, c) => {
          for (let h = 0; h < l.length; h++) {
            let d = l[h];
            d !== "." && (
            n.fillStyle = fM[d] || "#000", n.fillRect(o + h, a + c, 1, 1));
          }
        });
      }),
      Di = new Tr(e),
      Di.magFilter = Ae,
      Di.minFilter = Ae,
      Di.generateMipmaps = !1,
      Di.colorSpace = rn,
      Di.userData = { w: e.width, h: e.height },
      Di);

  }
  function Sm(i) {
    let t = Math.max(0, rd.indexOf(i)),
      e = od(),
      n = e.userData.w,
      s = e.userData.h,
      r = t % Or * (Ni + 1),
      o = Math.floor(t / Or) * (Ni + 1);
    return { u: r / n, v: 1 - (o + Ni) / s, w: Ni / n, h: Ni / s };
  }
  var ls = new Map();
  function ad(i, t = "say") {
    let e = t + ":" + i,
      n = ls.get(e);
    if (n) return ls.delete(e), ls.set(e, n), n;
    let r = uM(i) + 6,
      o = 12,
      a = document.createElement("canvas");
    a.width = r, a.height = o;
    let l = a.getContext("2d"),
      c = t === "name" ? "#2a1f2e" : t === "hear" ? "#fff3c4" : "#fff8ec",
      h = t === "name" ? "#fff8ec" : "#2a1f2e";
    l.fillStyle = "#2a1f2e",
    l.fillRect(1, 0, r - 2, 9),
    l.fillRect(0, 1, r, 7),
    l.fillStyle = c,
    l.fillRect(1, 1, r - 2, 7),
    t !== "name" && (
    l.fillStyle = "#2a1f2e",
    l.fillRect(2, 9, 3, 1),
    l.fillRect(3, 10, 1, 1),
    l.fillStyle = c,
    l.fillRect(3, 8, 1, 1)),
    dM(l, i, 3, 2, h);
    let d = new Tr(a);
    if (
    d.magFilter = Ae,
    d.minFilter = Ae,
    d.generateMipmaps = !1,
    d.colorSpace = rn,
    n = { tex: d, w: r, h: o },
    ls.set(e, n),
    ls.size > 160)
    {
      let u = ls.keys().next().value,
        f = ls.get(u);
      ls.delete(u), f.tex.dispose();
    }
    return n;
  }
  function pM(i) {
    let e = od().clone();
    e.needsUpdate = !0;
    let n = Sm(i);
    return (
      e.offset.set(n.u, n.v),
      e.repeat.set(n.w, n.h),
      new Ki({ map: e, depthTest: !1, transparent: !0 }));

  }
  var wm = new Map();
  function Em(i) {
    let t = wm.get(i);
    return t || (t = pM(i), wm.set(i, t)), t;
  }
  var OverlayView = class {
      constructor(t) {
        this.scene = t,
        this.group = new Pe(),
        t.add(this.group),
        this.per = new Map();
        let e = 700,
          n = new Float32Array(e * 6),
          s = new ye();
        s.setAttribute("position", new Le(n, 3)),
        this.rainGeo = s,
        this.rainSeeds = Array.from({ length: e }, () => [
        Math.random(),
        Math.random(),
        Math.random()]
        ),
        this.rain = new ko(
          s,
          new wr({
            color: 14477815,
            transparent: !0,
            opacity: 0.5,
            depthWrite: !1
          })
        ),
        this.rain.frustumCulled = !1,
        this.group.add(this.rain);
        let r = 60,
          o = new ye();
        o.setAttribute("position", new Le(new Float32Array(r * 3), 3)),
        this.flyGeo = o,
        this.flySeeds = Array.from({ length: r }, () => [
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random()]
        ),
        this.flies = new Co(
          o,
          new Er({
            color: 16773754,
            size: 2,
            sizeAttenuation: !1,
            transparent: !0,
            opacity: 0.9
          })
        ),
        this.flies.frustumCulled = !1,
        this.group.add(this.flies),
        this.ring = new Et(
          new Rs(0.42, 0.52, 14),
          new je({
            color: 16769162,
            transparent: !0,
            opacity: 0.9,
            depthWrite: !1
          })
        ),
        this.ring.rotation.x = -Math.PI / 2,
        this.ring.visible = !1,
        this.group.add(this.ring);
      }
      slot(t) {
        let e = this.per.get(t);
        if (!e) {
          let n = new ws(Em("!"));
          n.renderOrder = 10, n.visible = !1;
          let s = new ws(new Ki({ depthTest: !1, transparent: !0 }));
          s.renderOrder = 11, s.visible = !1, s.center.set(0.15, 0);
          let r = new ws(new Ki({ depthTest: !1, transparent: !0 }));
          r.renderOrder = 9,
          r.visible = !1,
          r.center.set(0.5, 1),
          this.group.add(n, s, r),
          e = {
            icon: n,
            bubble: s,
            name: r,
            iconName: "",
            text: "",
            nameText: ""
          },
          this.per.set(t, e);
        }
        return e;
      }
      removeMissing(t) {
        for (let [e, n] of this.per)
        t.has(e) || (
        this.group.remove(n.icon, n.bubble, n.name), this.per.delete(e));
      }
      updateCreature(t, e, n, s, r, o) {
        let a = this.slot(t.id),
          l = t.act,
          c = e.t,
          h = null,
          d = null,
          u = "say";
        if (
        l &&
        l.type === "call" &&
        l.words && (
        d =
        l.words.join(" ") + (
        l.concepts && l.concepts[0] === "help" ? "!" : "")),
        l &&
        l.type === "chat" &&
        e.joints[l.joint] &&
        e.joints[l.joint].lines)
        {
          let p = e.joints[l.joint],
            x = c - p.t0;
          for (let g of p.lines)
          x >= g.dt &&
          x < g.dt + 2.4 && (
          g.who === t.id ?
          d = g.word :
          x > g.dt + 0.9 && (h = g.ok ? "!" : "?"));
        }
        t.reply &&
        c - t.reply.t < 2.2 && (
        d = t.reply.word + (t.reply.yes ? "!" : "."), u = "hear"),
        !d &&
        t.emote &&
        c - t.emote.t < t.emote.d && (
        h = mM[t.emote.i] || t.emote.i),
        !d &&
        !h &&
        l && (
        l.type === "sleep" || l.type === "nap" ?
        h = "zzz" :
        l.type === "look" && l.icon ?
        h = l.icon :
        l.type === "strain" ?
        h = "sweat" :
        l.type === "wait" && (c - l.t0) % 6 < 2 ?
        h = "think" :
        l.type === "huddle" && t.wet > 0.4 ?
        h = "sad" :
        (l.type === "play" &&
        l.kind === "drum" &&
        s % 1.2 < 0.6 ||
        l.type === "play" && l.kind === "dance") && (
        h = "note")),
        !d &&
        !h &&
        t.needs.food < 0.15 &&
        (s + t.id) % 8 < 1.5 && (
        h = "food");
        let f = n.y + 0.75 * (t.look.size || 1);
        if (h) {
          h !== a.iconName && (a.icon.material = Em(h), a.iconName = h);
          let p = h === "zzz" ? Math.sin(s * 2) * 0.05 : 0;
          a.icon.position.set(n.x, f + 9 * r * 0.6 + p, n.z),
          a.icon.scale.set(9 * r, 9 * r, 1),
          a.icon.visible = !0;
        } else a.icon.visible = !1;
        if (d) {
          if (d !== a.text || u !== a.style) {
            let p = ad(d, u);
            a.bubble.material.map = p.tex,
            a.bubble.material.needsUpdate = !0,
            a.text = d,
            a.style = u,
            a.bw = p.w,
            a.bh = p.h;
          }
          a.bubble.position.set(n.x, f + 2 * r, n.z),
          a.bubble.scale.set(a.bw * r, a.bh * r, 1),
          a.bubble.visible = !0;
        } else a.bubble.visible = !1;
        if (o.showName) {
          if (a.nameText !== t.name) {
            let p = ad(t.name, "name");
            a.name.material.map = p.tex,
            a.name.material.needsUpdate = !0,
            a.nameText = t.name,
            a.nw = p.w,
            a.nh = p.h;
          }
          a.name.position.set(n.x, n.y - 2 * r, n.z + 0.35),
          a.name.scale.set(a.nw * r, a.nh * r, 1),
          a.name.visible = !0;
        } else a.name.visible = !1;
      }
      updateSelection(t, e) {
        if (!t) {
          this.ring.visible = !1;
          return;
        }
        this.ring.visible = !0,
        this.ring.position.set(t.x, t.groundY + 0.03, t.z);
        let n = 1 + Math.sin(e * 4) * 0.06;
        this.ring.scale.set(n, n, n);
      }
      updateWeather(t, e, n, s, r, o) {
        let a = this.rainGeo.attributes.position.array,
          l = this.rainSeeds.length,
          c = Math.floor(l * Math.min(1, n / 1.6)),
          h = 22,
          d = 14;
        for (let f = 0; f < l; f++) {
          let [p, x, g] = this.rainSeeds[f],
            m = f * 6;
          if (f >= c) {
            a[m] = a[m + 3] = 0,
            a[m + 1] = a[m + 4] = -100,
            a[m + 2] = a[m + 5] = 0;
            continue;
          }
          let b = s.x + (p - 0.5) * 2 * h,
            T = s.z + (x - 0.5) * 2 * h,
            y = (g + e * 1.6) % 1,
            S = d * (1 - y);
          a[m] = b,
          a[m + 1] = S,
          a[m + 2] = T,
          a[m + 3] = b + 0.05,
          a[m + 4] = S - 0.35,
          a[m + 5] = T + 0.02;
        }
        this.rainGeo.attributes.position.needsUpdate = !0,
        this.rain.visible = c > 0;
        let u = this.flyGeo.attributes.position.array;
        for (let f = 0; f < this.flySeeds.length; f++) {
          let [p, x, g, m] = this.flySeeds[f],
            b = s.x + (p - 0.5) * 30 + Math.sin(e * 0.3 + m * 9) * 1.5,
            T = s.z + (x - 0.5) * 30 + Math.cos(e * 0.25 + g * 9) * 1.5;
          u[f * 3] = b,
          u[f * 3 + 2] = T,
          u[f * 3 + 1] =
          o.heightAt(
            Math.max(0, Math.min(63, b)),
            Math.max(0, Math.min(63, T))
          ) +
          0.5 +
          Math.sin(e * 0.8 + g * 6) * 0.35 +
          m;
        }
        this.flyGeo.attributes.position.needsUpdate = !0,
        this.flies.visible = r > 0.3 && n < 0.5,
        this.flies.material.opacity =
        0.4 + 0.5 * Math.abs(Math.sin(e * 1.7));
      }
    },
    mM = {
      idea: "idea",
      "!": "!",
      "?": "?",
      heart: "heart",
      star: "star",
      anger: "anger",
      sweat: "sweat",
      ok: "ok",
      no: "no",
      splash: "splash",
      yuck: "yuck",
      happy: "happy",
      grumble: "grumble",
      sigh: "sigh",
      busy: "busy"
    };
  var Br = (i) => new wt(i),
    gM = `
attribute float calm; attribute float dep;
varying vec2 vUv; varying vec3 vW; varying float vCalm; varying float vDep;
void main(){ vUv = uv; vCalm = calm; vDep = dep; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
    xM = `
uniform float uTime, uLight, uRain; uniform vec3 uDeep, uShallow, uFoam, uTint, uPond, uMarsh;
varying vec2 vUv; varying vec3 vW; varying float vCalm; varying float vDep;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
void main(){
  float edge = clamp(min(vUv.x, 1.0 - vUv.x), -1.0, 1.0);
  vec3 c = mix(uShallow, uDeep, smoothstep(0.05, 0.35, edge));
  float land = 1.0 - smoothstep(-0.06, 0.02, vUv.x < 0.5 ? vUv.x : 1.0 - vUv.x);
  vec3 still = mix(mix(uShallow * 0.94, uPond, smoothstep(0.05, 0.4, edge)), uMarsh, land * (1.0 - smoothstep(0.2, 0.8, vDep)));
  c = mix(c, still, vCalm);
  vec2 cell = floor(vec2(vW.x*7.0, vW.z*3.5 - uTime*2.4*(1.0 - 0.88*vCalm)));
  float g = h(cell);
  float glint = step(0.965 - uRain*0.03 + vCalm*0.018, g) * step(0.12, edge + vCalm);
  c = mix(c, uFoam, glint*0.65*(1.0 - 0.45*vCalm));
  c = mix(c, uFoam, (1.0 - smoothstep(0.0, 0.07, edge))*0.55*(1.0 - vCalm));
  vec2 rc = floor(vec2(vW.x*4.0, vW.z*4.0));
  float rr = step(0.985, h(rc + floor(uTime*3.0))) * uRain;
  c = mix(c, uFoam, rr*0.8);
  gl_FragColor = vec4(c * uTint * (0.25 + 0.75*uLight), 1.0);
  #include <colorspace_fragment>
}`;
  function yM() {
    return mergeParts([
    part(lt(0.16, 0.08, 0.2), 7323455, { y: 0.04 }),
    part(lt(0.05, 0.05, 0.05), 10216282, { x: -0.05, y: 0.1, z: 0.06 }),
    part(lt(0.05, 0.05, 0.05), 10216282, { x: 0.05, y: 0.1, z: 0.06 }),
    part(lt(0.05, 0.03, 0.1), 5216815, { x: -0.1, y: 0.02, z: -0.06 }),
    part(lt(0.05, 0.03, 0.1), 5216815, { x: 0.1, y: 0.02, z: -0.06 })]
    );
  }
  function vM() {
    return mergeParts([
    part(lt(0.03, 0.03, 0.24), 3127551, {}),
    part(lt(0.26, 0.01, 0.06), 15268863, { z: 0.04 })]
    );
  }
  var WaterView = class {
    constructor(t, e) {
      this.world = t,
      this.scene = e,
      this.group = new Pe(),
      e.add(this.group),
      this.mat = new Ke({
        uniforms: {
          uTime: { value: 0 },
          uLight: { value: 1 },
          uRain: { value: 0 },
          uDeep: { value: Br(3112872) },
          uShallow: { value: Br(5813460) },
          uFoam: { value: Br(14218495) },
          uTint: { value: Br(16777215) },
          uPond: { value: Br(2911878) },
          uMarsh: { value: Br(5145986) }
        },
        vertexShader: gM,
        fragmentShader: xM
      }),
      this.ponds = new Map(),
      this.decor = null,
      this.decorSig = "",
      this.lastCheck = -99,
      this.cells = [],
      this.edgeCells = [],
      this.flyCenters = [];
      let n = (s, r, o) => {
        let a = new Ts(s, r, o);
        return a.count = 0, a.frustumCulled = !1, this.group.add(a), a;
      };
      this.frogs = n(yM(), he(), 12),
      this.flies = n(vM(), new je({ vertexColors: !0 }), 8),
      this.bugMat = new je({ color: 15269770 }),
      this.bugs = n(new ks(0.075, 4, 3), this.bugMat, 20),
      this.m4 = new se(),
      this.q = new mn(),
      this.e = new bn(),
      this.v = new z(),
      this.s = new z();
    }
    dispose() {
      for (let t of this.ponds.values()) this.dropPond(t);
      this.decor && (
      this.group.remove(this.decor), this.decor.geometry.dispose());
      for (let t of [this.frogs, this.flies, this.bugs])
      t.geometry.dispose(), t.dispose();
      this.mat.dispose(), this.scene.remove(this.group);
    }
    dropPond(t) {
      for (let e of [t.mesh, t.deco])
      e && (this.group.remove(e), e.geometry.dispose());
    }
    buildPond(t) {
      let e = this.world.terrain,
        n = t.rise * t.fill,
        s = 0.012;
      if (n < s + 0.003) return null;
      let r = t.z - t.len,
        o = r + Math.pow(s / n, 2) * t.len,
        a = [];
      for (let S = o; S < t.z; S += 0.25) a.push(S);
      a.push(t.z);
      let c = 2.2 + 3.2 + t.spread * 0.3,
        h = Math.ceil(2 * c / 0.33),
        d = 0.6 + t.spread * 0.18,
        u = [],
        f = [],
        p = [],
        x = [],
        g = [];
      for (let S = 0; S < a.length; S++) {
        let M = a[S],
          A = e.creekX(M),
          v = e.creekHW(M),
          E = Math.min(1, Math.max(0, (M - r) / t.len)),
          R = WATER_LEVEL + n * Math.sqrt(E) + 0.003,
          P = Math.pow(
            Math.min(1, Math.max(0, (M - o) / Math.max(0.01, t.z - o))),
            0.7
          );
        for (let N = 0; N <= h; N++) {
          let B = A - c + 2 * c * N / h,
            D = e.edgeDist(B, M),
            I = e.heightAt(
              Math.min(63.99, Math.max(0, B)),
              Math.min(63.99, Math.max(0, M))
            ),
            H = R;
          D > 0 && (
          H -=
          Math.max(0, D - d) * 0.6 + (
          D > 0.3 ? Math.max(0, M - (t.z - 1)) * 0.35 : 0)),
          t.snag && D > -0.1 && (H = Math.min(H, I - 0.06, WATER_LEVEL + 0.012)),
          u.push(B, H, M),
          f.push((B - (A - v - 0.35)) / (2 * (v + 0.35)), M),
          p.push(D > 0.05 && !t.snag ? 1 : P),
          x.push(Math.min(1, Math.max(0, (R - I) / 0.3)));
        }
      }
      let m = h + 1;
      for (let S = 0; S < a.length - 1; S++)
      for (let M = 0; M < h; M++) {
        let A = S * m + M,
          v = A + 1,
          E = A + m,
          R = E + 1;
        g.push(A, E, v, v, E, R);
      }
      let b = new ye();
      b.setAttribute("position", new Zt(u, 3)),
      b.setAttribute("uv", new Zt(f, 2)),
      b.setAttribute("calm", new Zt(p, 1)),
      b.setAttribute("dep", new Zt(x, 1)),
      b.setIndex(g);
      let T = new Et(b, this.mat);
      T.frustumCulled = !1;
      let y = null;
      if (!t.snag && t.fill > 0.6 && t.len >= 7) {
        let S = [],
          M = 5 + Math.round(4 * t.fill);
        for (let v = 0; v < M; v++) {
          let E = t.z - 0.6 - hash01(t.id * 31 + v) * (t.len - 2),
            R = hash01(t.id * 17 + v) < 0.5 ? -1 : 1,
            P =
            e.creekX(E) +
            R * (e.creekHW(E) * (0.35 + 0.5 * hash01(t.id * 7 + v))),
            N = Math.min(1, Math.max(0, (E - r) / t.len)),
            B = WATER_LEVEL + n * Math.sqrt(N) + 0.012,
            D = 0.11 + hash01(t.id + v * 3) * 0.08;
          S.push(
            part(yt(D, D, 0.012, 7), v % 3 ? 5151290 : 6270532, {
              x: P,
              y: B,
              z: E,
              ry: hash01(v) * 6
            })
          ),
          v % 4 === 1 &&
          S.push(
            part(qt(0.05, 0), v % 8 === 1 ? 16228804 : 16775404, {
              x: P + 0.03,
              y: B + 0.04,
              z: E
            })
          );
        }
        let A = mergeParts(S);
        A && (y = new Et(A, he()));
      }
      return { mesh: T, deco: y };
    }
    syncPonds() {
      let t = new Set();
      this.flyCenters = [];
      for (let e of pondSources(this.world)) {
        t.add(e.id);
        let n = e.len + ":" + Math.round(e.rise * e.fill * 200),
          s = this.ponds.get(e.id);
        if (
        !e.snag &&
        e.fill > 0.5 &&
        this.flyCenters.push({
          x: this.world.terrain.creekX(e.z - e.len / 2),
          z: e.z - e.len / 2,
          y: WATER_LEVEL + e.rise * e.fill,
          r: 1.2 + e.len * 0.25
        }),
        s && s.sig === n)

        continue;
        s && this.dropPond(s);
        let r = this.buildPond(e) || {};
        r.sig = n,
        r.mesh && this.group.add(r.mesh),
        r.deco && this.group.add(r.deco),
        this.ponds.set(e.id, r);
      }
      for (let [e, n] of this.ponds)
      t.has(e) || (this.dropPond(n), this.ponds.delete(e));
    }
    syncDecor() {
      let t = this.world,
        e = t.terrain,
        n = t.wet,
        s = 0,
        r = 0;
      for (let c = 0; c < n.length; c++) {
        let h = Math.floor(n[c] * 4);
        h && (s = (s * 31 + c * 7 + h) % 1000003, r++);
      }
      let o = r + ":" + s;
      if (o === this.decorSig) return;
      this.decorSig = o,
      this.decor && (
      this.group.remove(this.decor),
      this.decor.geometry.dispose(),
      this.decor = null);
      let a = [];
      this.cells = [], this.edgeCells = [];
      for (let c = 0; c < n.length; c++) {
        let h = n[c];
        if (h < 0.35) continue;
        let d = c % 64,
          u = Math.floor(c / 64),
          f = c * 13,
          p = d + 0.5,
          x = u + 0.5,
          g = e.edgeDist(p, x);
        if (g < 0.15 || !e.walkable(p, x)) continue;
        let m = e.heightAt(p, x);
        h > 0.5 && (
        this.cells.push({ x: p, z: x, w: h, y: m }),
        g < 1.6 && this.edgeCells.push({ x: p, z: x, y: m }));
        let b = h > 0.7 ? 3 : h > 0.5 ? 2 : 1;
        for (let T = 0; T < b; T++) {
          let y = d + hash01(f + T),
            S = u + hash01(f + T + 5),
            M = e.heightAt(y, S);
          a.push(
            part(
              ze(0.06, 0.26 + hash01(f + T + 2) * 0.12, 3),
              T % 2 ? 4156978 : 5933630,
              { x: y, y: M + 0.12, z: S, rz: (hash01(f + T + 9) - 0.5) * 0.4 }
            )
          );
        }
        if (h > 0.62 && hash01(f + 40) < 0.55) {
          let T = d + hash01(f + 41),
            y = u + hash01(f + 42),
            S = e.heightAt(T, y);
          for (let M = 0; M < 2; M++)
          a.push(
            part(yt(0.015, 0.02, 0.62, 3), PALETTE.reed, {
              x: T + M * 0.09,
              y: S + 0.31,
              z: y
            })
          ),
          a.push(
            part(yt(0.035, 0.035, 0.15, 4), PALETTE.cattail, {
              x: T + M * 0.09,
              y: S + 0.6 + M * 0.04,
              z: y
            })
          );
        }
        if (h > 0.8 && hash01(f + 60) < 0.35) {
          let T = d + 0.2 + hash01(f + 61) * 0.6,
            y = u + 0.2 + hash01(f + 62) * 0.6,
            S = e.heightAt(T, y) + 0.02,
            M = hash01(f + 63) * 3;
          a.push(
            part(lt(0.34, 0.012, 0.22), 6131608, { x: T, y: S, z: y, ry: M })
          ),
          a.push(
            part(lt(0.2, 0.012, 0.3), 6131608, {
              x: T + 0.08,
              y: S,
              z: y + 0.05,
              ry: M + 0.6
            })
          );
        }
        if (h > 0.5 && h < 0.8 && hash01(f + 80) < 0.12) {
          let T = d + hash01(f + 81),
            y = u + hash01(f + 82);
          a.push(
            part(qt(0.05, 0), hash01(f + 83) < 0.5 ? 14272767 : 16774048, {
              x: T,
              y: e.heightAt(T, y) + 0.2,
              z: y
            })
          );
        }
      }
      let l = mergeParts(a);
      l && (
      this.decor = new Et(l, he()),
      this.decor.receiveShadow = !0,
      this.group.add(this.decor));
    }
    setInst(t, e, n, s, r, o, a, l = 0) {
      this.e.set(l, o, 0),
      this.q.setFromEuler(this.e),
      this.v.set(n, s, r),
      this.s.set(a, a, a),
      this.m4.compose(this.v, this.q, this.s),
      t.setMatrixAt(e, this.m4);
    }
    update(t, e, n, s, r) {
      let o = this.mat.uniforms;
      o.uTime.value = t,
      o.uLight.value = e,
      o.uRain.value = n,
      o.uTint.value.copy(s),
      t - this.lastCheck > 3 && (
      this.lastCheck = t, this.syncPonds(), this.syncDecor());
      let a = this.world.hydro || {},
        l = a.frogs ?
        Math.min(12, Math.floor((a.marsh || 0) / 7), this.edgeCells.length) :
        0;
      for (let u = 0; u < l; u++) {
        let f =
          this.edgeCells[Math.floor(hash01(u * 97 + 5) * this.edgeCells.length)],
          p = (t * (0.06 + hash01(u) * 0.05) + hash01(u + 3)) % 1,
          x = p < 0.05 ? Math.sin(p / 0.05 * Math.PI) : 0,
          g = hash01(u * 7) * 6.28 + Math.floor(t * 0.06 + hash01(u + 3)) * 1.7,
          m = Math.cos(g) * 0.3 * (hash01(u + 11) - 0.5),
          b = Math.sin(g) * 0.3 * (hash01(u + 13) - 0.5);
        this.setInst(
          this.frogs,
          u,
          f.x + m + (hash01(u + 1) - 0.5) * 0.6,
          f.y + 0.01 + x * 0.22,
          f.z + b + (hash01(u + 2) - 0.5) * 0.6,
          g,
          1
        );
      }
      this.frogs.count = l, this.frogs.instanceMatrix.needsUpdate = !0;
      let c = 1 - r,
        h =
        a.flies && c > 0.5 && n < 0.5 && this.flyCenters.length ?
        Math.min(8, 2 + Math.floor((a.marsh || 0) / 12)) :
        0;
      for (let u = 0; u < h; u++) {
        let f = this.flyCenters[u % this.flyCenters.length],
          p = t * (0.5 + hash01(u + 20) * 0.4) + hash01(u + 21) * 20,
          x = Math.sin(p * 2.7) > 0.6 ? 1.6 : 1,
          g =
          f.x + Math.sin(p * 1.3 * x) * f.r * 0.6 + Math.sin(p * 3.1) * 0.25,
          m = f.z + Math.cos(p * 0.9 * x) * f.r + Math.cos(p * 2.3) * 0.2,
          b = f.y + 0.45 + Math.sin(p * 1.7) * 0.18,
          T = Math.cos(p * 1.3 * x),
          y = -Math.sin(p * 0.9 * x);
        this.setInst(this.flies, u, g, b, m, Math.atan2(T, y), 1.1);
      }
      this.flies.count = h, this.flies.instanceMatrix.needsUpdate = !0;
      let d =
      r > 0.55 && n < 0.3 && this.cells.length ?
      Math.min(20, Math.floor(this.cells.length / 5)) :
      0;
      for (let u = 0; u < d; u++) {
        let f = this.cells[Math.floor(hash01(u * 53 + 1) * this.cells.length)],
          p = t * 0.35 + hash01(u + 40) * 30,
          x = 0.5 + 0.5 * Math.sin(t * (1.5 + hash01(u + 41) * 2) + hash01(u + 42) * 6);
        this.setInst(
          this.bugs,
          u,
          f.x + Math.sin(p) * 0.8,
          f.y + 0.4 + Math.sin(p * 1.7) * 0.25 + hash01(u) * 0.4,
          f.z + Math.cos(p * 0.8) * 0.8,
          0,
          0.5 + x * 0.8
        );
      }
      this.bugs.count = d,
      this.bugs.instanceMatrix.needsUpdate = !0,
      this.bugMat.color.setRGB(1, 1, 0.5);
    }
  };
  var _M =
    "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    bM = `
precision highp float;
uniform sampler2D tColor; uniform sampler2D tDepth;
uniform vec2 res; uniform float cNear, cFar, outline, dither, levels, dim, flash;
uniform vec3 tint;
varying vec2 vUv;
float lin(float d){ float z = d * 2.0 - 1.0; return (2.0 * cNear * cFar) / (cFar + cNear - z * (cFar - cNear)); }
float bayer4(vec2 p){
  int x = int(mod(p.x, 4.0)), y = int(mod(p.y, 4.0));
  int i = x + y * 4;
  float m[16];
  m[0]=0.;m[1]=8.;m[2]=2.;m[3]=10.;m[4]=12.;m[5]=4.;m[6]=14.;m[7]=6.;m[8]=3.;m[9]=11.;m[10]=1.;m[11]=9.;m[12]=15.;m[13]=7.;m[14]=13.;m[15]=5.;
  for (int k = 0; k < 16; k++) if (k == i) return m[k] / 16.0;
  return 0.0;
}
vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
void main(){
  vec2 px = 1.0 / res;
  vec3 c = texture2D(tColor, vUv).rgb;
  float d = lin(texture2D(tDepth, vUv).r);
  float dl = lin(texture2D(tDepth, vUv - vec2(px.x, 0.0)).r);
  float dr = lin(texture2D(tDepth, vUv + vec2(px.x, 0.0)).r);
  float du = lin(texture2D(tDepth, vUv + vec2(0.0, px.y)).r);
  float dd = lin(texture2D(tDepth, vUv - vec2(0.0, px.y)).r);
  float far = max(max(dl, dr), max(du, dd));
  float edge = step(d * 0.045 + 0.25, far - d) * step(d, cFar * 0.9);
  c = toSRGB(c);
  c = mix(c, c * 0.42 + vec3(0.02, 0.0, 0.03), edge * outline);
  c *= tint;
  c += flash;
  float b = bayer4(gl_FragCoord.xy) - 0.5;
  c = floor(c * levels + b * dither + 0.5) / levels;
  c *= dim;
  gl_FragColor = vec4(c, 1.0);
}`,
    Renderer = class {
      constructor(t, e = {}) {
        this.canvas = t,
        this.renderer = new Lc({
          canvas: t,
          antialias: !1,
          alpha: !1,
          powerPreference: e.lowPower ? "low-power" : "default",
          preserveDrawingBuffer: !!e.preserve
        }),
        this.renderer.setPixelRatio(1),
        this.renderer.outputColorSpace = rn,
        this.renderer.shadowMap.enabled = !!e.shadows,
        this.renderer.shadowMap.type = Is,
        this.scene = new _r(),
        this.camera = new ln(26, 1, 1, 260),
        this.scene.fog = new wo(12575743, 70, 190),
        this.hemi = new Fo(13625599, 5601850, 1.2),
        this.scene.add(this.hemi),
        this.sun = new Ho(16773590, 2.2),
        this.sun.castShadow = !0,
        this.sun.shadow.mapSize.set(
          e.shadowSize || 1024,
          e.shadowSize || 1024
        );
        let n = this.sun.shadow.camera;
        n.left = -36,
        n.right = 36,
        n.top = 36,
        n.bottom = -36,
        n.near = 1,
        n.far = 140,
        this.sun.shadow.bias = -0.0015,
        this.sun.shadow.normalBias = 0.03,
        this.scene.add(this.sun, this.sun.target),
        this.sun.target.position.set(32, 0, 32),
        this.rt = null,
        this.postMat = new Ke({
          vertexShader: _M,
          fragmentShader: bM,
          uniforms: {
            tColor: { value: null },
            tDepth: { value: null },
            res: { value: new Vt(1, 1) },
            cNear: { value: 1 },
            cFar: { value: 220 },
            outline: { value: 1 },
            dither: { value: 0.9 },
            levels: { value: 28 },
            dim: { value: 1 },
            flash: { value: 0 },
            tint: { value: new z(1, 1, 1) }
          },
          depthTest: !1,
          depthWrite: !1
        }),
        this.postScene = new _r(),
        this.postCam = new ns(-1, 1, 1, -1, 0, 1),
        this.postScene.add(new Et(new As(2, 2), this.postMat)),
        this.views = null,
        this.W = 1,
        this.H = 1,
        this.flash = 0,
        this.nextFlash = 0,
        this.tmpV = new z(),
        this.creaturePos = new Map(),
        this.distFactor = 1;
      }
      setShadows(t) {
        this.renderer.shadowMap.enabled = t,
        this.sun.castShadow = t,
        this.scene.traverse((e) => {
          e.material &&
          (Array.isArray(e.material) ? e.material : [e.material]).forEach(
            (s) => s.needsUpdate = !0
          );
        });
      }
      setWorld(t) {
        this.views && this.disposeViews(),
        this.world = t,
        this.views = {
          terrain: new GroundView(t, this.scene),
          props: new ResourceView(t, this.scene),
          structures: new StructureView(t, this.scene),
          wetland: new WaterView(t, this.scene),
          overlay: new OverlayView(this.scene),
          creatures: new Map()
        };
      }
      disposeViews() {
        let t = this.views;
        t.terrain.dispose(),
        t.props.dispose(),
        t.structures.dispose(),
        t.wetland.dispose();
        for (let e of t.creatures.values()) e.dispose();
        this.scene.remove(t.overlay.group), this.views = null;
      }
      resize(t, e, n, s = 240) {
        let r = Math.round(t * n),
          o = Math.round(e * n),
          a = Math.max(1, Math.round(Math.min(r, o) / s)),
          l = Math.max(64, Math.floor(r / a)),
          c = Math.max(64, Math.floor(o / a));
        this.W = l,
        this.H = c,
        this.k = a,
        this.renderer.setSize(l, c, !1),
        this.canvas.style.width = l * a / n + "px",
        this.canvas.style.height = c * a / n + "px",
        this.rt && (this.rt.dispose(), this.rt.depthTexture.dispose());
        let h = new mi(l, c);
        h.type = Ln,
        this.rt = new gn(l, c, {
          minFilter: Ae,
          magFilter: Ae,
          depthTexture: h,
          depthBuffer: !0
        }),
        this.postMat.uniforms.tColor.value = this.rt.texture,
        this.postMat.uniforms.tDepth.value = h,
        this.postMat.uniforms.res.value.set(l, c),
        this.camera.aspect = l / c;
        let d = l / c;
        this.camera.fov = d < 1 ? 32 : 26,
        this.distFactor =
        d < 1.3 ? Math.sqrt(1.5 / d) * (d < 1 ? 0.85 : 1) : 1,
        this.camera.updateProjectionMatrix();
      }
      worldPerPixel(t) {
        return 2 * t * Math.tan(this.camera.fov * Math.PI / 360) / this.H;
      }
      lighting(t, e) {
        let n = this.world,
          s = dayPhase(t),
          r = daylight(t),
          o = n.weather.rain,
          a = n.weather.state === "cloudy" ? 1 : 0,
          l = Math.min(1, o * 0.6 + a * 0.45),
          c = (s - 0.25) / 0.5 * Math.PI,
          h = Math.sin(Math.max(0.12, Math.min(Math.PI - 0.12, c))),
          d = Math.cos(c),
          u = 1 - r,
          f =
          u > 0.5 ?
          new z(-0.4, 0.8, 0.45) :
          new z(d * 0.9, 0.35 + h * 0.9, 0.45);
        this.sun.position.set(32 + f.x * 50, f.y * 50, 32 + f.z * 50);
        let p = 1 - Math.min(1, h * 1.6),
          x = new wt(16773590).
          lerp(new wt(16753515), p * r * 0.8).
          lerp(new wt(10467071), u);
        this.sun.color.copy(x),
        this.sun.intensity = 3.2 * r * (1 - l * 0.65) + 0.7 * u;
        let g = new wt(12575743).
        lerp(new wt(15905674), p * r * 0.6).
        lerp(new wt(2503004), u).
        lerp(new wt(9082536), l * r * 0.7);
        this.hemi.color.copy(g),
        this.hemi.groundColor.copy(new wt(5601850).lerp(new wt(1778230), u)),
        this.hemi.intensity = 0.9 + 1.6 * r,
        this.scene.fog.color.copy(g),
        this.renderer.setClearColor(g);
        let m = new z(1, 1, 1).lerp(new z(0.78, 0.86, 1.18), u * 0.8);
        return (
          this.postMat.uniforms.tint.value.copy(m),
          this.flash = Math.max(0, this.flash - e * 4),
          o > 1.2 &&
          this.clock > this.nextFlash && (
          this.flash = 0.8,
          this.nextFlash = this.clock + 6 + Math.random() * 18),
          this.postMat.uniforms.flash.value = this.flash * 0.35,
          { dl: r, night: u, rain: o, sky: g });

      }
      update(t, e, n) {
        let s = this.world,
          r = this.views;
        this.clock = e;
        let o = s.t,
          a = this.lighting(o, t);
        r.terrain.update(e, 0.22 + 0.78 * a.dl, a.rain, new wt(1, 1, 1)),
        r.wetland.update(
          e,
          0.22 + 0.78 * a.dl,
          a.rain,
          new wt(1, 1, 1),
          a.night
        ),
        r.terrain.updateWear(e);
        let l = n.focus || { x: 32, z: 32 };
        r.props.sync(e, this.camera.position, {
          x: l.x,
          y:
          s.terrain.heightAt(
            Math.max(0, Math.min(63.9, l.x)),
            Math.max(0, Math.min(63.9, l.z))
          ) + 0.5,
          z: l.z
        }),
        r.props.updateLights(a.night),
        r.structures.sync(),
        r.structures.update(e, a.night, a.rain);
        let c = new Set(),
          h = this.worldPerPixel(n.camDistance || 25);
        for (let u of s.creatures) {
          c.add(u.id);
          let f = r.creatures.get(u.id);
          f || (f = new CreatureView(u, this.scene, s), r.creatures.set(u.id, f));
          let p = f.update(t, e, o);
          p.groundY = s.terrain.heightAt(p.x, p.z),
          this.creaturePos.set(u.id, p);
        }
        let d = s.creatures;
        for (let u = 0; u < d.length; u++)
        for (let f = u + 1; f < d.length; f++) {
          let p = d[u],
            x = d[f];
          if (
          p.act && x.act && p.act.joint && p.act.joint === x.act.joint ||
          p.asleep && x.asleep)

          continue;
          let g = this.creaturePos.get(p.id),
            m = this.creaturePos.get(x.id),
            b = m.x - g.x,
            T = m.z - g.z,
            y = Math.hypot(b, T),
            S = 0.62;
          if (y < S) {
            let M = (S - y) / 2,
              A = y > 0.001 ? b / y : 1,
              v = y > 0.001 ? T / y : 0,
              E = r.creatures.get(p.id).root.position,
              R = r.creatures.get(x.id).root.position;
            E.x -= A * M,
            E.z -= v * M,
            R.x += A * M,
            R.z += v * M,
            g.x = E.x,
            g.z = E.z,
            m.x = R.x,
            m.z = R.z;
          }
        }
        for (let [u, f] of r.creatures)
        c.has(u) || (f.dispose(), r.creatures.delete(u));
        for (let u of s.creatures)
        r.overlay.updateCreature(u, s, this.creaturePos.get(u.id), e, h, {
          showName: n.showNames || n.selected === u.id
        });
        return (
          r.overlay.removeMissing(c),
          r.overlay.updateSelection(
            n.selected ? this.creaturePos.get(n.selected) : null,
            e
          ),
          r.overlay.updateWeather(
            t,
            e,
            a.rain,
            n.focus || { x: 32, z: 32 },
            a.night,
            s.terrain
          ),
          this.postMat.uniforms.dim.value = n.dim ?? 1,
          this.postMat.uniforms.outline.value = n.outline ?? 1,
          this.postMat.uniforms.cNear.value = this.camera.near,
          this.postMat.uniforms.cFar.value = this.camera.far,
          a);

      }
      render() {
        let t = this.renderer;
        t.info.autoReset = !1,
        t.info.reset(),
        t.setRenderTarget(this.rt),
        t.render(this.scene, this.camera),
        this.stats = {
          calls: t.info.render.calls,
          tris: t.info.render.triangles
        },
        t.setRenderTarget(null),
        t.render(this.postScene, this.postCam);
      }
      toScreen(t, e, n) {
        let s = this.tmpV.set(t, e, n).project(this.camera),
          r = this.canvas.getBoundingClientRect();
        return {
          x: r.left + (s.x + 1) / 2 * r.width,
          y: r.top + (1 - s.y) / 2 * r.height,
          behind: s.z > 1
        };
      }
      pickCreature(t, e, n = 30) {
        let s = null,
          r = n;
        for (let [o, a] of this.creaturePos) {
          let l = this.toScreen(a.x, a.y + 0.3, a.z),
            c = Math.hypot(l.x - t, l.y - e);
          c < r && (r = c, s = o);
        }
        return s;
      }
      pickStructure(t, e, n = 40) {
        let s = null,
          r = n;
        for (let o of this.world.structures) {
          let a =
            o.kind === "crossing" || o.kind === "dam" ?
            0.6 :
            this.world.terrain.heightAt(o.x, o.z) + 0.6,
            l = this.toScreen(o.x, a, o.z),
            c = Math.hypot(l.x - t, l.y - e);
          c < r && (r = c, s = o.id);
        }
        return s;
      }
      groundAt(t, e, n = 1) {
        let s = this.canvas.getBoundingClientRect(),
          r = (t - s.left) / s.width * 2 - 1,
          o = -(e - s.top) / s.height * 2 + 1,
          a = new Vo();
        a.setFromCamera(new Vt(r, o), this.camera);
        let l = new In(new z(0, 1, 0), -n),
          c = new z();
        return a.ray.intersectPlane(l, c) ? c : null;
      }
    };
  var ld = Math.PI * 2,
    Hr = (i, t, e) => i + (t - i) * e;
  function MM(i, t, e) {
    let n = ((t - i + Math.PI) % ld + ld) % ld - Math.PI;
    return i + n * e;
  }
  var CameraRig = class {
    constructor(t, e, n) {
      this.r = t,
      this.canvas = e,
      this.hooks = n,
      this.goal = { x: 32, z: 32, dist: 18, yaw: 0.6, pitch: 0.8 },
      this.cur = { ...this.goal },
      this.follow = null,
      this.ambient = !1,
      this.subject = null,
      this.hold = 0,
      this.orbitDir = 1,
      this.pointers = new Map(),
      this.gesture = null,
      this.bind();
    }
    setWorld(t) {
      this.world = t;
      let e = t.meadow || { x: 32, z: 32 };
      this.goal.x = this.cur.x = e.x, this.goal.z = this.cur.z = e.z;
    }
    bind() {
      let t = this.canvas;
      t.addEventListener("contextmenu", (e) => e.preventDefault()),
      t.addEventListener("pointerdown", (e) => this.down(e)),
      window.addEventListener("pointermove", (e) => this.move(e)),
      window.addEventListener("pointerup", (e) => this.up(e)),
      window.addEventListener("pointercancel", (e) => this.up(e)),
      t.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault(),
          this.active(),
          this.goal.dist = clamp(
            this.goal.dist * Math.exp(e.deltaY * 0.0012),
            9,
            72
          );
        },
        { passive: !1 }
      ),
      window.addEventListener("keydown", (e) => this.key(e));
    }
    active() {
      this.hooks.onActive && this.hooks.onActive();
    }
    key(t) {
      if (
      t.target && (
      t.target.tagName === "INPUT" || t.target.tagName === "TEXTAREA"))

      return;
      let e = this.goal,
        n = e.dist * 0.08,
        s = Math.sin(e.yaw),
        r = Math.cos(e.yaw),
        o = !0;
      switch (t.key) {
        case "w":
        case "ArrowUp":
          e.x -= s * n, e.z -= r * n, this.follow = null;
          break;
        case "s":
        case "ArrowDown":
          e.x += s * n, e.z += r * n, this.follow = null;
          break;
        case "a":
        case "ArrowLeft":
          e.x -= r * n, e.z += s * n, this.follow = null;
          break;
        case "d":
        case "ArrowRight":
          e.x += r * n, e.z -= s * n, this.follow = null;
          break;
        case "q":
          e.yaw -= 0.15;
          break;
        case "e":
          e.yaw += 0.15;
          break;
        case "+":
        case "=":
          e.dist = clamp(e.dist * 0.88, 9, 72);
          break;
        case "-":
        case "_":
          e.dist = clamp(e.dist * 1.12, 9, 72);
          break;
        default:
          o = !1;
      }
      o && (this.active(), this.clampGoal());
    }
    down(t) {
      this.canvas.setPointerCapture &&
      this.canvas.setPointerCapture(t.pointerId),
      this.pointers.set(t.pointerId, {
        x: t.clientX,
        y: t.clientY,
        sx: t.clientX,
        sy: t.clientY,
        t: performance.now(),
        button: t.button,
        mod: t.ctrlKey || t.altKey || t.shiftKey
      }),
      this.active(),
      this.startGesture();
    }
    startGesture() {
      let t = [...this.pointers.values()];
      if (t.length === 1) {
        let e = t[0],
          n = e.button === 2 || e.mod;
        this.gesture = n ?
        { kind: "rotate", x: e.x, y: e.y } :
        {
          kind: "pan",
          ground: this.r.groundAt(e.x, e.y, this.groundY()),
          x: e.x,
          y: e.y
        };
      } else if (t.length >= 2) {
        let [e, n] = t;
        this.gesture = {
          kind: "pinch",
          d: Math.hypot(e.x - n.x, e.y - n.y),
          ang: Math.atan2(n.y - e.y, n.x - e.x),
          mx: (e.x + n.x) / 2,
          my: (e.y + n.y) / 2
        };
      }
    }
    groundY() {
      return this.world ?
      this.world.terrain.heightAt(
        clamp(this.cur.x, 0, 63),
        clamp(this.cur.z, 0, 63)
      ) :
      1;
    }
    move(t) {
      let e = this.pointers.get(t.pointerId);
      if (!e) return;
      e.x = t.clientX, e.y = t.clientY;
      let n = this.gesture;
      if (
      !(
      !n ||
      !(Math.hypot(e.x - e.sx, e.y - e.sy) > 6) &&
      this.pointers.size === 1))

      {
        if (this.active(), n.kind === "pan") {
          this.follow && (this.follow = null);
          let r = this.r.groundAt(e.x, e.y, this.groundY());
          r &&
          n.ground && (
          this.goal.x += n.ground.x - r.x,
          this.goal.z += n.ground.z - r.z,
          this.cur.x = this.goal.x,
          this.cur.z = this.goal.z,
          this.apply());
        } else if (n.kind === "rotate")
        this.goal.yaw -= (e.x - n.x) * 0.008,
        this.goal.pitch = clamp(
          this.goal.pitch + (e.y - n.y) * 0.005,
          0.5,
          1.35
        ),
        n.x = e.x,
        n.y = e.y;else
        if (n.kind === "pinch") {
          let r = [...this.pointers.values()];
          if (r.length < 2) return;
          let [o, a] = r,
            l = Math.hypot(o.x - a.x, o.y - a.y),
            c = Math.atan2(a.y - o.y, a.x - o.x),
            h = (o.x + a.x) / 2,
            d = (o.y + a.y) / 2;
          this.goal.dist = clamp(
            this.goal.dist * n.d / Math.max(10, l),
            9,
            72
          ),
          this.goal.yaw -= c - n.ang,
          this.goal.pitch = clamp(
            this.goal.pitch + (d - n.my) * 0.004,
            0.5,
            1.35
          ),
          n.d = l,
          n.ang = c,
          n.mx = h,
          n.my = d,
          this.cur.dist = this.goal.dist,
          this.cur.yaw = this.goal.yaw;
        }
        this.clampGoal();
      }
    }
    up(t) {
      let e = this.pointers.get(t.pointerId);
      if (!e) return;
      this.pointers.delete(t.pointerId);
      let n = performance.now() - e.t;
      if (
      this.pointers.size === 0 &&
      Math.hypot(e.x - e.sx, e.y - e.sy) < 8 &&
      n < 400 &&
      this.gesture &&
      this.gesture.kind !== "pinch")
      {
        let s = performance.now();
        if (
        this.lastTap &&
        s - this.lastTap.t < 320 &&
        Math.hypot(this.lastTap.x - e.x, this.lastTap.y - e.y) < 30)
        {
          let r = this.r.groundAt(e.x, e.y, this.groundY());
          r && (this.goal.x = r.x, this.goal.z = r.z),
          this.goal.dist = clamp(this.goal.dist * 0.6, 9, 72),
          this.lastTap = null;
        } else
        this.lastTap = { t: s, x: e.x, y: e.y },
        this.hooks.onTap && this.hooks.onTap(e.x, e.y);
      }
      this.gesture = null, this.pointers.size && this.startGesture();
    }
    clampGoal() {
      let t = this.goal,
        e = t.x - 32,
        n = t.z - 32,
        s = Math.hypot(e, n);
      s > 27 && (t.x = 32 + e / s * 27, t.z = 32 + n / s * 27);
    }
    flyTo(t, e, n) {
      this.goal.x = t,
      this.goal.z = e,
      n && (this.goal.dist = n),
      this.clampGoal();
    }
    setFollow(t) {
      this.follow = t, t && this.goal.dist > 30 && (this.goal.dist = 20);
    }
    setAmbient(t) {
      this.ambient = t,
      this.subject = null,
      this.hold = 0,
      t || (this.follow = this.follow || null);
    }
    interest(t, e) {
      let n = t.act,
        s = 1;
      n && (
      s +=
      {
        lift: 7,
        heavyj: 5,
        chat: 4,
        play2: 5,
        groom: 3,
        call: 5,
        strain: 4,
        gesture: 4,
        labor: 2,
        craft: 2.5,
        plant: 3,
        mark: 4,
        watch: 2,
        play: 2.5,
        eat: 1.2,
        walk: 1,
        sleep: 0.25,
        nap: 0.4,
        wait: 2,
        huddle: 1
      }[n.type] || 1),
      t.emote && e.t - t.emote.t < 6 && (s += 2),
      t.carry && (s += 0.5);
      for (let r = e.log.length - 1; r >= Math.max(0, e.log.length - 30); r--) {
        let o = e.log[r];
        if (e.t - o.t > 240) break;
        o.who && o.who.includes(t.id) && (s += o.imp * 2);
      }
      return s;
    }
    pickSubject(t) {
      let e = isNight(t.t);
      if (Math.random() < (e ? 0.45 : 0.14)) {
        this.subject = { kind: "wide" },
        this.hold = 20 + Math.random() * 15,
        this.goal.dist = 46 + Math.random() * 12,
        this.goal.pitch = 0.75 + Math.random() * 0.2,
        this.orbitDir = Math.random() < 0.5 ? 1 : -1;
        return;
      }
      let s = t.hydro;
      if (
      s &&
      s.marsh > 10 &&
      Math.random() < 0.1 &&
      !(this.subject && this.subject.kind === "place"))
      {
        this.subject = { kind: "place", x: s.cx, z: s.cz },
        this.hold = 18 + Math.random() * 10,
        this.goal.dist = 17 + Math.random() * 6,
        this.goal.pitch = 0.7 + Math.random() * 0.2,
        this.orbitDir = Math.random() < 0.5 ? 1 : -1;
        return;
      }
      let r = null,
        o = 0;
      for (let a of t.creatures) {
        let l = this.interest(a, t) * (0.6 + Math.random() * 0.8);
        this.subject &&
        this.subject.kind === "creature" &&
        this.subject.id === a.id && (
        l *= 0.45),
        l > o && (o = l, r = a);
      }
      r && (
      this.subject = { kind: "creature", id: r.id },
      this.hold = 28 + Math.random() * 35,
      this.goal.dist = 13 + Math.random() * 9,
      this.goal.pitch = 0.78 + Math.random() * 0.3,
      this.orbitDir = Math.random() < 0.5 ? 1 : -1);
    }
    notice(t) {
      if (
      !this.ambient ||
      !this.world ||
      t.imp < 2 ||
      t.x === void 0 ||
      this.subject &&
      this.subject.since !== void 0 &&
      performance.now() / 1e3 - this.subject.since < 8)

      return;
      let e = t.who && t.who[0];
      e && this.world.byId[e] ? (
      this.subject = {
        kind: "creature",
        id: e,
        since: performance.now() / 1e3
      },
      this.hold = 30,
      this.goal.dist = 14) : (
      this.subject = {
        kind: "place",
        x: t.x,
        z: t.z,
        since: performance.now() / 1e3
      },
      this.hold = 18,
      this.goal.dist = 22);
    }
    update(t) {
      let e = this.world;
      if (!e) return;
      let n = this.goal;
      if (this.ambient) {
        this.hold -= t,
        (this.hold <= 0 ||
        !this.subject ||
        this.subject.kind === "creature" && !e.byId[this.subject.id]) && (
        this.pickSubject(e),
        this.subject && (this.subject.since = performance.now() / 1e3));
        let o = this.subject;
        if (o) {
          if (o.kind === "creature") {
            let a = positionAt(e.byId[o.id], e.t);
            n.x = a.x, n.z = a.z;
          } else if (o.kind === "place") n.x = o.x, n.z = o.z;else
          {
            let a = e.structures.filter((h) => h.kind === "home"),
              l = a.length ?
              a.reduce((h, d) => h + d.x, 0) / a.length :
              e.meadow.x,
              c = a.length ?
              a.reduce((h, d) => h + d.z, 0) / a.length :
              e.meadow.z;
            n.x = Hr(l, 32, 0.3), n.z = Hr(c, 32, 0.3);
          }
          n.yaw += t * 0.035 * this.orbitDir;
        }
      } else if (this.follow && e.byId[this.follow]) {
        let o = positionAt(e.byId[this.follow], e.t);
        n.x = o.x, n.z = o.z;
      }
      this.clampGoal();
      let s = this.ambient ?
        1 - Math.exp(-t * 0.9) :
        1 - Math.exp(-t * (this.follow ? 5 : 9)),
        r = this.cur;
      r.x = Hr(r.x, n.x, s),
      r.z = Hr(r.z, n.z, s),
      r.dist = Hr(
        r.dist,
        n.dist,
        this.ambient ? 1 - Math.exp(-t * 0.6) : 1 - Math.exp(-t * 8)
      ),
      r.yaw = MM(
        r.yaw,
        n.yaw,
        this.ambient ? 1 - Math.exp(-t * 1.5) : 1 - Math.exp(-t * 10)
      ),
      r.pitch = Hr(
        r.pitch,
        n.pitch,
        this.ambient ? 1 - Math.exp(-t * 0.6) : 1 - Math.exp(-t * 8)
      ),
      this.apply();
    }
    apply() {
      let t = this.cur,
        e = this.r.camera,
        n = t.dist * (this.r.distFactor || 1),
        s = this.world ?
        this.world.terrain.heightAt(clamp(t.x, 0, 63.9), clamp(t.z, 0, 63.9)) :
        1,
        r = Math.sin(t.pitch) * n,
        o = Math.cos(t.pitch) * n;
      this.lift =
      (this.lift || 0) + ((this.liftGoal || 0) - (this.lift || 0)) * 0.15;
      let a = this.lift * n * 0.22;
      this.side =
      (this.side || 0) + ((this.sideGoal || 0) - (this.side || 0)) * 0.15;
      let l = 2 * n * Math.tan(e.fov * Math.PI / 360) * e.aspect,
        c = this.side * l,
        h = t.x + Math.sin(t.yaw) * a + Math.cos(t.yaw) * c,
        d = t.z + Math.cos(t.yaw) * a - Math.sin(t.yaw) * c;
      e.position.set(h + Math.sin(t.yaw) * o, s + r, d + Math.cos(t.yaw) * o),
      e.lookAt(h, s + 0.4, d);
    }
  };
  function escapeHtml(i) {
    return String(i).replace(
      /[&<>"]/g,
      (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[t]
    );
  }
  function _i(i, t) {
    if (!t) return "something";
    let e = STRUCTURES[t.kind],
      n = t.owner && i.byId[t.owner] ? i.byId[t.owner].name + "'s " : "the ",
      s = t.building ? levelDef(t, t.building.level).label : structureLabel(t);
    return n + s;
  }
  function nameOf(i, t) {
    return i.byId[t] ? i.byId[t].name : "someone";
  }
  function activityText(i, t) {
    let e = i.act,
      n = i.plan || {};
    if (!e) return "Thinking";
    let s = n.sid ? t.byId[n.sid] : null,
      r = n.mat ? MATERIAL_LABELS[n.mat] || n.mat : "";
    switch (e.type) {
      case "walk":{
          if (e.why === "help" || n.goal === "help")
          return `Hurrying to help ${nameOf(t, n.helping)}`;
          switch (n.goal) {
            case "work":
              return i.carry ?
              `Carrying ${MATERIAL_LABELS[i.carry.k] || i.carry.k} to ${_i(t, s)}` :
              r ?
              `Fetching ${r} for ${_i(t, s)}` :
              `Heading to ${_i(t, s)}`;
            case "deliver":
              return `Carrying ${i.carry ? MATERIAL_LABELS[i.carry.k] : "something"}`;
            case "eat":
              return "Off to find something to eat";
            case "sleep":
              return "Heading off to sleep";
            case "nap":
              return "Looking for a spot to nap";
            case "shelter":
              return e.why === "listen" ?
              "Going to listen to the rain chimes" :
              "Hurrying out of the rain";
            case "social":
              return `Going over to ${nameOf(t, n.with)}`;
            case "play":
              return "Off to play";
            case "explore":
              return "Exploring";
            case "pod":
              return "Going to look at a seed pod";
            case "found":
              return "Going to mark out a new project";
            case "forage":
              return "Gathering for the storehouse";
            case "garden":
              return "Off to the garden";
            case "plant":
              return "Looking for a spot to plant a seed";
            case "craft":
              return "Getting materials for the workshop";
            case "share":
              return "Bringing food to a hungry friend";
            case "rest":
              return "Finding a nice spot to sit";
            default:
              return "Wandering";
          }
        }
      case "pick":
        return e.what === "bush" ?
        "Picking berries" :
        e.what === "tree" ?
        "Picking up a fallen branch" :
        e.what === "reeds" ?
        "Cutting reeds" :
        e.what === "stones" ?
        "Choosing stones" :
        e.what === "clay" ?
        "Digging clay" :
        e.what === "glowcap" ?
        "Picking glowing mushrooms" :
        "Gathering";
      case "dig":
        return "Scooping up mud from the bank";
      case "take":
        return "Taking something from the storehouse";
      case "stash":
        return "Putting things away in the storehouse";
      case "deposit":
        return s ? `Adding to ${_i(t, s)}` : "Setting things down";
      case "labor":{
          let o = s && s.building ? currentStage(s) : null;
          if (s && s.kind === "dam" && o && Tm[o.name]) return Tm[o.name];
          if (e.what === "tiles") return "Shaping clay into roof tiles";
          if (e.what === "guard") return "Ringing a sapling with stones";
          if (e.what === "repair") {
            let a = t.byId[e.sid];
            return a ?
            `Mending ${_i(t, { ...a, building: null })}` :
            "Mending something";
          }
          return s ?
          `Working on ${_i(t, s)}${o ? " (" + o.name + ")" : ""}` :
          "Working";
        }
      case "strain":
        return "Straining at something far too heavy";
      case "heavyj":{
          let o = Am(i, t, e),
            a = t.byId[e.obj.id];
          return a && a.kind === "dam" && a.building ?
          a.building.level === 0 ?
          `Pounding posts into the creek bed with ${o}` :
          `Rolling stones into place along the dam with ${o}` :
          `Heaving together with ${o} on ${_i(t, a)}`;
        }
      case "lift":
        return `Lifting a seed pod with ${Am(i, t, e)}`;
      case "wait":
        return e.obj && e.obj.t === "pod" ?
        "Waiting beside the pod for help" :
        e.obj ?
        "Waiting for a helper" :
        "Waiting";
      case "call":
        return `Calling to ${nameOf(t, e.to)}: \u201C${(e.words || []).join(" ")}\u201D`;
      case "look":
        return e.icon === "think" ? "Thinking it over" : "Looking around";
      case "gesture":
        return (
          {
            spin: "Spinning in a little circle",
            clap: "Clapping twice",
            tap: "Tapping the ground twice",
            ears: "Flicking their ears",
            hop: "Doing a little hop"
          }[e.g] || "Fidgeting");

      case "eat":
        return `Eating ${FOODS[e.food] ? FOODS[e.food].label : "something"}`;
      case "sleep":
        return "Asleep";
      case "nap":
        return "Taking a nap";
      case "huddle":
        return "Waiting out the rain";
      case "watch":{
          if (e.pond) {
            let o = t.hydro || {};
            return o.frogs && SM(t) ?
            "Listening to the frogs in the marsh" :
            o.flies ?
            "Watching dragonflies over the pond" :
            "Sitting by the pond, watching the still water";
          }
          return t.res.some(
            (o) => o.kind === "snag" && (o.x - i.x) ** 2 + (o.z - i.z) ** 2 < 25
          ) ?
          "Watching the water pool behind the fallen branches" :
          "Watching leaves drift down the creek";
        }
      case "play":
        return (
          {
            stack: "Stacking stones into a little tower",
            mudpie: "Making mud pies",
            drum: "Drumming on a hollow log",
            collect: "Hunting for pretty pebbles",
            perch: "Sitting up on a boulder, looking out",
            dance: "Dancing in the rain",
            chaseleaf: "Chasing leaves along the bank",
            admire: "Admiring something growing"
          }[e.kind] || "Playing");

      case "chat":
        return `Chatting with ${nameOf(t, e.lookId)}`;
      case "play2":
        return `Playing chase with ${nameOf(t, e.lookId)}`;
      case "groom":
        return `Grooming ${nameOf(t, e.lookId)}`;
      case "mark":
        return "Marking out a spot for a new project";
      case "plant":
        return "Planting a seed";
      case "tend":
        return "Watering the garden";
      case "harvest":
        return "Harvesting the garden";
      case "sow":
        return "Sowing seeds";
      case "craft":
        return `Making ${{ stick: "a digging stick", basket: "a basket", mallet: "a mallet" }[e.tool] || "a tool"}`;
      case "give":
        return `Sharing food with ${nameOf(t, e.to)}`;
      case "sit":
        return "Sitting quietly, watching the world";
      default:
        return "Standing about";
    }
  }
  var Tm = {
    posts: "Pounding willow posts into the creek bed",
    weave: "Weaving branches between the posts",
    "stone sill": "Setting stones along the foot of the dam",
    "mud face": "Packing mud against the dam",
    cuttings: "Planting willow cuttings along the pond",
    "reed beds": "Planting reeds in the shallows"
  };
  function SM(i) {
    return timeOfDayName(i.t) === "night" || timeOfDayName(i.t) === "dusk";
  }
  function Am(i, t, e) {
    let n = t.joints[e.joint];
    return (
      n &&
      nameList(
        t,
        n.members.filter((s) => s !== i.id)
      ) ||
      "a friend");

  }
  var cd = {
    curiosity: ["curious", "not very curious"],
    caution: ["cautious", "bold"],
    sociability: ["sociable", "happy alone"],
    patience: ["patient", "impatient"],
    persistence: ["determined", "easily distracted"],
    activity: ["energetic", "easygoing"],
    generosity: ["generous", "not much of a sharer"]
  };
  function Rm(i) {
    let t = [];
    for (let e in cd) {
      let n = i.temp[e];
      n > 0.66 ? t.push(cd[e][0]) : n < 0.34 && t.push(cd[e][1]);
    }
    return t.length ? t : ["even-tempered"];
  }
  function km(i) {
    return Object.entries(i.interests).
    sort((t, e) => e[1] - t[1]).
    slice(0, 3).
    filter((t) => t[1] > 0.35).
    map((t) => INTEREST_LABELS[t[0]]);
  }
  function wM(i, t) {
    if (!t || !t.src || t.src === "self") return "from experience";
    let e = +String(t.src).split(":")[1];
    return i.byId[e] ?
    `learned by watching ${i.byId[e].name}` :
    "from watching others";
  }
  function knowledgeLines(i, t) {
    let e = [],
      n = i.Q,
      s = (l, c) => e.push({ text: l, how: c ? wM(t, n[c]) : "" });
    qCount(i, "pod|solo") > 0.3 &&
    qValue(i, "pod|solo") < 0.35 &&
    s("Seed pods are too heavy to lift alone.", "pod|solo"),
    qCount(i, "pod|duo") > 0.3 &&
    qValue(i, "pod|duo") > 0.6 &&
    s("Two can lift a seed pod together.", "pod|duo"),
    qCount(i, "pod|duo") > 0.3 &&
    qValue(i, "pod|duo") < 0.4 &&
    s("Some pods are too heavy even for two.", "pod|duo"),
    qCount(i, "pod|trio") > 0.3 &&
    qValue(i, "pod|trio") > 0.6 &&
    s("Three can lift the heaviest pods.", "pod|trio"),
    qCount(i, "heavy|solo") > 0.3 &&
    qValue(i, "heavy|solo") < 0.35 &&
    s("Heavy building needs a partner.", "heavy|solo"),
    qCount(i, "heavy|duo") > 0.5 &&
    qValue(i, "heavy|duo") > 0.6 &&
    s("Heavy work goes well with company.", "heavy|duo"),
    qCount(i, "help|pod") > 0.8 &&
    s(
      qValue(i, "help|pod") > 0.55 ?
      "Helping with pods pays off." :
      "Helping with pods isn\u2019t always worth it.",
      "help|pod"
    ),
    qCount(i, "wade") > 1 &&
    s(
      qValue(i, "wade") < 0.35 ?
      "Wading the creek is dangerous." :
      qValue(i, "wade") > 0.55 ?
      "Wading the creek is fine." :
      "Wading is a bit risky.",
      "wade"
    );
    let r = [],
      o = [];
    for (let l in FOODS) {
      let c = n["eat|" + l];
      c && (
      c.v > 0.68 ? r.push(FOODS[l].label) : c.v < 0.35 && o.push(FOODS[l].label));
    }
    r.length && e.push({ text: `Loves ${r.join(", ")}.`, how: "from tasting" }),
    o.length &&
    e.push({
      text: `Doesn\u2019t care for ${o.join(", ")}.`,
      how: "from tasting"
    });
    let a = {
      mud: "Wet mud dries hard enough to build with.",
      planting: "Seeds in the ground grow into plants.",
      clay: "Clay across the creek can be shaped.",
      glowcap: "Some mushrooms glow at night.",
      tools: "Tools make work easier.",
      dams: "Branches across the creek slow the water and make the ground wet and green."
    };
    for (let l in a)
    i.know[l] &&
    e.push({ text: a[l], how: "discovered on day " + dayNumber(i.know[l]) });
    for (let l of ritualList(i))
    e.push({
      text: `Always ${GESTURE_DESC[l.g].replace("spins", "spins").trim()} before ${RITUAL_TASKS[l.task]} \u2014 it seems to help.`,
      how:
      l.from && t.byId[l.from] ?
      `picked up from ${t.byId[l.from].name}` :
      "a habit of their own"
    });
    return e;
  }
  function Im(i) {
    let t = i.fearWater;
    return t > 0.7 ?
    "Very frightened of the creek" :
    t > 0.45 ?
    "Nervous around the creek" :
    t > 0.2 ?
    "A little wary of the creek" :
    "At ease by the creek";
  }
  function memoryLines(i, t) {
    let e = [];
    for (let n of t.creatures) {
      if (n === i) continue;
      let s = i.rel[n.id];
      if (!s) {
        e.push({
          id: n.id,
          name: n.name,
          label: "barely knows",
          notes: [],
          warmth: 0
        });
        continue;
      }
      let r = [];
      s.asked >= 2 &&
      r.push(
        helpRate(s) > 0.65 ?
        `usually helps when asked (${s.helped}/${s.asked})` :
        helpRate(s) < 0.4 ?
        `rarely helps when asked (${s.helped}/${s.asked})` :
        `sometimes helps (${s.helped}/${s.asked})`
      ),
      s.gotShare + s.gotLittle >= 1 &&
      r.push(shareRate(s) > 0.6 ? "shares fairly" : "keeps the bigger share"),
      s.inv >= 3 &&
      r.push(
        s.acc / s.inv > 0.6 ?
        "usually happy to spend time together" :
        "often turns down invitations"
      ),
      s.told >= 2 &&
      r.push(
        honestyRate(s) > 0.65 ?
        "tells the truth about where food is" :
        "their tips about food don\u2019t pan out"
      ),
      s.annoy > 0.35 && r.push("a bit annoyed with them lately");
      let o = s.warmth,
        a =
        o > 0.65 ?
        "close friend" :
        o > 0.35 ?
        "friend" :
        o > 0.1 ?
        "friendly" :
        o < -0.2 ?
        "wary of" :
        "acquaintance";
      e.push({ id: n.id, name: n.name, label: a, notes: r, warmth: o });
    }
    return e.sort((n, s) => s.warmth - n.warmth), e;
  }
  function countsLines(i) {
    let t = i.counts;
    return [
    ["helping lift pods", t.helps, 4],
    ["opening pods", t.pods, 6],
    ["wading the creek", t.wades, 15],
    ["building", Math.round(t.labor / 600), 5],
    ["chatting", t.chats, 25],
    ["planting trees", t.plants, 2],
    ["sharing food", t.gifts, 2],
    ["stocking the storehouse", Math.round((t.stocked || 0) / 10), 3],
    ["exploring", Math.round(t.explore / 5), 6],
    ["making tools", t.crafted, 2]].

    filter((n) => n[1] >= n[2]).
    sort((n, s) => s[1] / s[2] - n[1] / n[2]).
    slice(0, 2).
    map((n) => n[0]);
  }
  function homeWord(i) {
    let t = vocabularySummary(i).find((e) => e.concept === "home");
    return t && t.users >= Math.ceil(i.creatures.length / 2) ?
    t.word[0].toUpperCase() + t.word.slice(1) :
    null;
  }
  function agoText(i) {
    if (i < 45) return "just now";
    if (i < 3600) return Math.round(i / 60) + " min ago";
    if (i < 86400) return Math.round(i / 3600 * 10) / 10 + " h ago";
    let t = Math.round(i / 86400 * 10) / 10;
    return t + (t === 1 ? " day ago" : " days ago");
  }
  function clockText(i) {
    return `${dateText(i)} \xB7 ${seasonAt(i).name} \xB7 ${timeOfDayName(i.t)}`; // LIFE: the real calendar
  }
  var qc = {
      eye: '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>',
      paw: '<svg viewBox="0 0 24 24"><circle cx="6" cy="9" r="2.3" fill="currentColor"/><circle cx="10" cy="5.5" r="2.3" fill="currentColor"/><circle cx="14.5" cy="5.5" r="2.3" fill="currentColor"/><circle cx="18.5" cy="9" r="2.3" fill="currentColor"/><path d="M12 11c-3.5 0-6 4-6 6.5 0 2 1.6 3 3.2 3 1.2 0 1.9-.7 2.8-.7s1.6.7 2.8.7c1.6 0 3.2-1 3.2-3 0-2.5-2.5-6.5-6-6.5z" fill="currentColor"/></svg>',
      house:
      '<svg viewBox="0 0 24 24"><path d="M3 11.5L12 4l9 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M6 10v9.5h4.5v-5h3v5H18V10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
      scroll:
      '<svg viewBox="0 0 24 24"><path d="M7 4h11v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1h11v1a3 3 0 0 0 3 3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 8h6M9 12h6" stroke="currentColor" stroke-width="2"/></svg>',
      gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
      close:
      '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
      pin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="3" fill="currentColor"/><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
    },
    EM = {
      clear: "\u2600\uFE0E",
      cloudy: "\u2601\uFE0E",
      rain: "\u2602\uFE0E",
      storm: "\u26A1\uFE0E"
    },
    cs = (i, t, e) => {
      let n = document.createElement(i);
      return t && (n.className = t), e !== void 0 && (n.innerHTML = e), n;
    },
    Hud = class {
      constructor(t) {
        this.app = t,
        this.root = document.getElementById("hud"),
        this.panel = null,
        this.tab = {},
        this.lastRefresh = 0,
        this.lastLogLen = -1,
        this.build();
      }
      get w() {
        return this.app.world;
      }
      build() {
        let t = this.root;
        t.innerHTML = "",
        this.top = cs("div", "topbar"),
        this.clock = cs("button", "chip clock"),
        this.clock.addEventListener("click", () => this.open("village")),
        this.btns = cs("div", "btns");
        let e = (n, s, r) => {
          let o = cs("button", "iconbtn", qc[n]);
          return (
            o.title = s,
            o.setAttribute("aria-label", s),
            o.addEventListener("click", r),
            this.btns.appendChild(o),
            o);

        };
        this.ambBtn = e("eye", "Ambient mode", () =>
        this.app.toggleAmbient()
        ),
        e("paw", "Creatures", () => this.open("creatures")),
        e("house", "Village", () => this.open("village")),
        e("scroll", "Happenings", () => this.open("log")),
        e("gear", "Settings", () => this.open("settings")),
        this.top.append(this.clock, this.btns),
        this.ticker = cs("button", "chip ticker"),
        this.ticker.addEventListener("click", () => {
          this.tickerEntry && this.locate(this.tickerEntry);
        }),
        this.sheet = cs("div", "sheet hidden"),
        this.toastEl = cs("div", "toast hidden"),
        this.saveWarn = cs(
          "div",
          "chip warn hidden",
          "Saving isn\u2019t available here \u2014 use Export in Settings to keep progress."
        ),
        t.append(
          this.top,
          this.ticker,
          this.sheet,
          this.toastEl,
          this.saveWarn
        ),
        this.catchup = document.getElementById("catchup"),
        this.summary = document.getElementById("summary");
      }
      toast(t, e = 3200) {
        this.toastEl.textContent = t,
        this.toastEl.classList.remove("hidden"),
        clearTimeout(this.toastT),
        this.toastT = setTimeout(
          () => this.toastEl.classList.add("hidden"),
          e
        );
      }
      setAmbient(t) {
        document.body.classList.toggle("ambient", t),
        this.ambBtn.classList.toggle("on", t);
      }
      open(t, e) {
        if (
        this.panel &&
        this.panel.kind === t &&
        this.panel.arg === e &&
        t !== "creature")
        {
          this.close();
          return;
        }
        this.panel = { kind: t, arg: e },
        this.sheet.classList.remove("hidden"),
        document.body.classList.add("sheet-open"),
        this.sheet.dataset.kind = t,
        this.render(!0),
        this.app.onPanel && this.app.onPanel(t, e);
      }
      close() {
        this.panel = null,
        this.sheet.classList.add("hidden"),
        document.body.classList.remove("sheet-open"),
        this.app.onPanel && this.app.onPanel(null);
      }
      header(t, e = "") {
        return `<div class="sh-head"><div><div class="sh-title">${t}</div>${e ? `<div class="sh-sub">${e}</div>` : ""}</div><button class="iconbtn sm" data-act="close" aria-label="Close">${qc.close}</button></div>`;
      }
      tabs(t, e) {
        let n = this.tab[t] || e[0][0];
        return `<div class="tabs">${e.map(([s, r]) => `<button class="tab ${s === n ? "on" : ""}" data-tab="${t}:${s}">${r}</button>`).join("")}</div>`;
      }
      curTab(t, e) {
        return this.tab[t] || e;
      }
      render(t = !1) {
        if (!this.panel) return;
        let { kind: e, arg: n } = this.panel,
          s = "";
        try {
          if (e === "creature") s = this.creatureHTML(n);else
          if (e === "creatures") s = this.creaturesHTML();else
          if (e === "village") s = this.villageHTML();else
          if (e === "log") s = this.logHTML();else
          if (e === "settings") {
            if (!t) return;
            s = this.settingsHTML();
          } else e === "structure" && (s = this.structureHTML(n));
        } catch (a) {
          console.error(a),
          s = this.header("Oops") + `<p>${escapeHtml(a.message)}</p>`;
        }
        if (s === this.lastHTML && !t) return;
        let r = this.sheet.querySelector(".sh-body")?.scrollTop || 0;
        this.lastHTML = s, this.sheet.innerHTML = s;
        let o = this.sheet.querySelector(".sh-body");
        o && !t && (o.scrollTop = r), this.wire();
      }
      wire() {
        this.sheet.querySelectorAll("[data-act]").forEach((t) =>
        t.addEventListener("click", (e) => {
          let n = t.dataset.act;
          n === "close" ? this.close() : this.app.action(n, t.dataset, t);
        })
        ),
        this.sheet.querySelectorAll("[data-tab]").forEach((t) =>
        t.addEventListener("click", () => {
          let [e, n] = t.dataset.tab.split(":");
          this.tab[e] = n, this.render(!0);
        })
        ),
        this.sheet.
        querySelectorAll("[data-creature]").
        forEach((t) =>
        t.addEventListener("click", () =>
        this.app.select(+t.dataset.creature)
        )
        ),
        this.sheet.
        querySelectorAll("[data-struct]").
        forEach((t) =>
        t.addEventListener("click", () =>
        this.app.selectStructure(+t.dataset.struct)
        )
        ),
        this.sheet.querySelectorAll("[data-loc]").forEach((t) =>
        t.addEventListener("click", () => {
          let [e, n, s] = t.dataset.loc.split(",");
          this.locate({ x: +e, z: +n, who: s ? [+s] : [] });
        })
        ),
        this.sheet.querySelectorAll("[data-setting]").forEach((t) =>
        t.addEventListener("change", () => {
          let e = t.dataset.setting,
            n = t.type === "checkbox" ? t.checked : t.value;
          this.app.setSetting(e, n);
        })
        );
      }
      locate(t) {
        let e =
        t.who &&
        t.who.find(
          (n) => this.w.byId[n] && this.w.creatures.includes(this.w.byId[n])
        );
        e ? this.app.select(e) : t.x !== void 0 && this.app.flyTo(t.x, t.z);
      }
      creatureHTML(t) {
        let e = this.w,
          n = e.byId[t];
        if (!n) return goneHTML(this, e, t); // LIFE: passed on or gone downstream
        let s = sd(e, n),
          r = countsLines(n),
          o = `<div class="sh-head"><div class="who"><span class="dot" style="background:${s}"></span><div><div class="sh-title">${escapeHtml(n.name)}</div><div class="sh-sub">${escapeHtml(lifeLine(e, n))}</div><div class="sh-sub">${escapeHtml(moodWord(n))}${r.length ? " \xB7 known for " + r.join(" and ") : ""}</div></div></div><div class="hbtns"><button class="pill ${this.app.following === n.id ? "on" : ""}" data-act="follow" data-id="${n.id}">${this.app.following === n.id ? "Following" : "Follow"}</button><button class="iconbtn sm" data-act="close" aria-label="Close">${qc.close}</button></div></div>`,
          a = this.curTab("c", "now"),
          l = "";
        if (a === "now") {
          l += `<p class="doing">${escapeHtml(activityText(n, e))}</p>`;
          let c = [];
          n.carry &&
          c.push(
            `carrying ${n.carry.n > 1 ? n.carry.n + " " : ""}${MATERIAL_LABELS[n.carry.k] || n.carry.k}`
          );
          let h = {
            berry: "berry",
            bluberry: "blue berry",
            seeds: "pod seed",
            root: "reed root",
            greens: "handful of greens",
            fruit: "orchard fruit"
          };
          if (n.pouch)
          for (let p in n.pouch)
          n.pouch[p] &&
          c.push(
            `${n.pouch[p]} ${n.pouch[p] === 1 ? h[p] || p : FOODS[p] ? FOODS[p].label : p} saved`
          );
          let d = Object.keys(n.tools || {});
          d.length &&
          c.push(
            "has " +
            d.
            map(
              (p) =>
              ({
                stick: "a digging stick",
                basket: "a basket",
                mallet: "a mallet"
              })[p]
            ).
            join(", ")
          ),
          c.length && (l += `<p class="muted">${escapeHtml(c.join(" \xB7 "))}</p>`);
          let u = n.home != null ? e.byId[n.home] : null;
          l += `<p class="muted">${u ? "Home: " + escapeHtml(_i(e, u).replace(n.name + "'s ", "their ")) : "No home yet"} \xB7 ${escapeHtml(Im(n))}</p>`,
          this.app.settings.meters && (
          l +=
          '<div class="meters">' +
          ["food", "energy", "comfort", "social", "fun"].
          map(
            (p) =>
            `<div class="meter"><span>${p}</span><i style="width:${Math.round(n.needs[p] * 100)}%"></i></div>`
          ).
          join("") +
          "</div>");
          let f = e.log.
          filter((p) => p.who && p.who.includes(n.id)).
          slice(-5).
          reverse();
          f.length && (
          l +=
          '<h4>Lately</h4><ul class="list">' +
          f.
          map(
            (p) =>
            `<li data-loc="${p.x ?? ""},${p.z ?? ""}"><span>${escapeHtml(p.text)}</span><small>${agoText(e.t - p.t)}</small></li>`
          ).
          join("") +
          "</ul>");
        } else if (a === "mind") {
          l += `<h4>Temperament</h4><p>${escapeHtml(Rm(n).join(", "))}</p>`;
          let c = km(n);
          c.length && (l += `<h4>Loves</h4><p>${escapeHtml(c.join(", "))}</p>`);
          let h = knowledgeLines(n, e);
          l +=
          "<h4>What they\u2019ve learned</h4>" + (
          h.length ?
          '<ul class="list">' +
          h.
          map(
            (u) =>
            `<li><span>${escapeHtml(u.text)}</span><small>${escapeHtml(u.how)}</small></li>`
          ).
          join("") +
          "</ul>" :
          '<p class="muted">Nothing settled yet.</p>');
          let d = Object.entries(n.desire).
          filter((u) => u[1] > 0.5 && STRUCTURES[u[0]] && !kindComplete(e, u[0], n.id)).
          sort((u, f) => f[1] - u[1]).
          slice(0, 3);
          d.length && (
          l += `<h4>Wishes</h4><p>${escapeHtml(d.map(([u]) => ({ home: "a better home", store: "a storehouse", crossing: "an easier way across the creek", garden: "a garden", workshop: "a workshop", meeting: "a place to gather", chimes: "something to make music in the rain", lookout: "a high place to look out from", dam: "to slow the creek down and make a marsh" })[u]).join(", "))}</p>`);
        } else if (a === "bonds")
        l +=
        '<ul class="list">' +
        memoryLines(n, e).
        map(
          (c) =>
          `<li data-creature="${c.id}"><span><b>${escapeHtml(c.name)}</b> \u2014 ${escapeHtml(c.label)}${c.notes.length ? "<br><small>" + escapeHtml(c.notes.join("; ")) + "</small>" : ""}</span></li>`
        ).
        join("") +
        "</ul>";else
        if (a === "memories") {
          let c = n.mem.slice().reverse().slice(0, 14);
          l += c.length ?
          '<ul class="list">' +
          c.
          map(
            (h) =>
            `<li><span>${escapeHtml(h.text)}</span><small>day ${dayNumber(h.t)}</small></li>`
          ).
          join("") +
          "</ul>" :
          '<p class="muted">No memories yet.</p>';
        } else if (a === "words") {
          let c = vocabularySummary(e),
            h = Object.keys(n.lex).
            map((d) => {
              let u = favoriteWord(n, d);
              if (!u) return "";
              let f = c.find((x) => x.concept === d),
                p = f && f.word === u;
              return `<tr><td>${escapeHtml(CONCEPT_LABELS[d] || d)}</td><td class="word">${escapeHtml(u)}</td><td>${p ? '<span class="ok">shared</span>' : f ? 'others say <span class="word">' + escapeHtml(f.word) + "</span>" : ""}</td></tr>`;
            }).
            join("");
          l += h ?
          `<table class="words">${h}</table>` :
          '<p class="muted">Hasn\u2019t needed any words yet.</p>';
        }
        return (
          o +
          this.tabs("c", [
          ["now", "Now"],
          ["mind", "Mind"],
          ["bonds", "Bonds"],
          ["memories", "Memories"],
          ["words", "Words"]]
          ) +
          `<div class="sh-body">${l}</div>`);

      }
      creaturesHTML() {
        let t = this.w,
          e = t.creatures.
          map((n) => {
            let s = sd(t, n);
            return `<li data-creature="${n.id}"><span class="dot" style="background:${s}"></span><span><b>${escapeHtml(n.name)}</b> <small>${escapeHtml(moodWord(n))}</small><br><small>${escapeHtml(activityText(n, t))}</small></span></li>`;
          }).
          join("");
        return (
          this.header("Creatures", "tap one to follow it") +
          `<div class="sh-body"><ul class="list creatures">${e}</ul></div>`);

      }
      structureHTML(t) {
        let e = this.w,
          n = e.byId[t];
        if (!n) return this.header("Gone");
        let s = STRUCTURES[n.kind],
          r = "",
          o = (n.built || []).
          map(
            (h) =>
            `<li><span>${escapeHtml(s.levels[h.lv - 1].label)}</span><small>day ${dayNumber(h.t)}${h.took ? " \xB7 took " + durationText(h.took) : ""}</small></li>`
          ).
          join("");
        if (n.building) {
          let h = levelDef(n, n.building.level),
            d = currentStage(n),
            u = stageNeeds(n),
            f = Object.keys(u).
            map(
              (x) =>
              `${Math.min(u[x], n.building.delivered[x] || 0)}/${u[x]} ${MATERIAL_LABELS[x]}`
            ).
            join(", ");
          r += `<h4>Now building: ${escapeHtml(h.label)}</h4><div class="bar"><i style="width:${Math.round(projectProgress(n) * 100)}%"></i></div>`,
          r += `<p class="muted">${escapeHtml(d.name)}${n.building.cureLeft > 0 ? " \xB7 drying (" + durationText(n.building.cureLeft) + " left" + (e.weather.rain > 0 && d.dry ? ", paused while it rains" : "") + ")" : f ? " \xB7 " + escapeHtml(f) : ""}</p>`;
          let p = Object.entries(n.contrib || {}).
          sort((x, g) => g[1] - x[1]).
          map(([x]) => e.byId[x]?.name).
          filter(Boolean);
          p.length && (
          r += `<p class="muted">Working on it: ${escapeHtml(p.join(", "))}</p>`);
        }
        o && (r += `<h4>Built</h4><ul class="list">${o}</ul>`);
        let a = n.level < levelCount(n.kind) && !n.building ? s.levels[n.level] : null;
        if (
        a && (
        r += `<p class="muted">Could someday become: ${escapeHtml(a.label)}</p>`),
        n.kind === "store" && n.stock)
        {
          let h = Object.entries(n.stock).
          filter((d) => d[1] > 0).
          map(([d, u]) => `${u} ${MATERIAL_LABELS[d] || (FOODS[d] ? FOODS[d].label : d)}`);
          r += `<h4>In the store</h4><p>${h.length ? escapeHtml(h.join(", ")) : "empty"}</p>`;
        }
        if (n.kind === "garden" && n.beds) {
          let h = n.beds.filter((u) => u.state === "ready").length,
            d = n.beds.filter((u) => u.state === "growing").length;
          r += `<p class="muted">${d} growing \xB7 ${h} ready to harvest \xB7 ${n.beds.length - h - d} empty${(n.dampSoil || 0) >= 0.3 ? " \xB7 the soil stays damp from the pond" : ""}</p>`;
        }
        n.kind === "dam" && (
        r += `<h4>The creek here</h4><p>${escapeHtml(damDescription(e, n))}</p>`);
        let l = e.byId[n.founder],
          c =
          (n.owner ? `${e.byId[n.owner]?.name}'s ` : "") +
          s.label + (
          l ? ` \xB7 started by ${l.name}, day ${dayNumber(n.t)}` : "");
        return (
          this.header(escapeHtml(builtLevelDef(n) ? builtLevelDef(n).label : levelDef(n, 0).label), escapeHtml(c)) +
          `<div class="sh-body">${r}</div>`);

      }
      villageHTML() {
        let t = this.w,
          e = homeWord(t),
          n = this.curTab("v", "projects"),
          s = "";
        if (n === "projects") {
          let r = t.structures.filter((a) => a.building);
          s += r.length ?
          '<ul class="list">' +
          r.
          map((a) => {
            let l = levelDef(a, a.building.level),
              c = a.building.cureLeft > 0;
            return `<li data-struct="${a.id}"><span><b>${escapeHtml(l.label)}</b>${a.owner ? " <small>for " + escapeHtml(t.byId[a.owner]?.name || "") + "</small>" : ""}<div class="bar"><i style="width:${Math.round(projectProgress(a) * 100)}%"></i></div><small>${escapeHtml(currentStage(a).name)}${c ? " \xB7 drying" : ""}</small></span></li>`;
          }).
          join("") +
          "</ul>" :
          '<p class="muted">Nothing under construction right now.</p>';
          let o = t.structures.filter((a) => a.level > 0);
          o.length && (
          s +=
          '<h4>Standing</h4><ul class="list">' +
          o.
          map(
            (a) =>
            `<li data-struct="${a.id}"><span>${escapeHtml(_i(t, { ...a, building: null }))}</span><small>${a.level}/${levelCount(a.kind)}</small></li>`
          ).
          join("") +
          "</ul>");
        } else if (n === "words") {
          let r = vocabularySummary(t);
          s +=
          '<p class="muted">Each creature started out with their own words. These are the words most of them now use.</p>',
          s +=
          '<table class="words">' +
          r.
          map(
            (o) =>
            `<tr><td>${escapeHtml(CONCEPT_LABELS[o.concept] || o.concept)}</td><td class="word">${escapeHtml(o.word)}</td><td><small>${o.users} of ${t.creatures.length}${o.variants > 1 ? " \xB7 " + (o.variants - 1) + " rival word" + (o.variants > 2 ? "s" : "") : ""}</small></td></tr>`
          ).
          join("") +
          "</table>";
        } else if (n === "customs") {
          let r = [];
          for (let c of t.creatures)
          for (let h of ritualList(c))
          r.push(
            `<li data-creature="${c.id}"><span><b>${escapeHtml(c.name)}</b> ${escapeHtml(GESTURE_DESC[h.g])} before ${escapeHtml(RITUAL_TASKS[h.task])}${h.from && t.byId[h.from] ? " <small>(picked up from " + escapeHtml(t.byId[h.from].name) + ")</small>" : ""}</span></li>`
          );
          s += r.length ?
          '<ul class="list">' + r.join("") + "</ul>" :
          '<p class="muted">No customs have taken hold yet. Habits that seem to bring luck can spread from one creature to another.</p>';
          let o = t.stats,
            a = t.structures.filter(
              (c) => c.kind === "dam" && c.level > 0
            ).length,
            l = t.hydro && t.hydro.marsh || 0;
          s += `<h4>So far</h4><p class="muted">${o.pods || 0} pods opened together \xB7 ${o.heavy || 0} heavy lifts shared \xB7 ${o.wades || 0} creek wadings (${o.slips || 0} slips) \xB7 ${o.planted || 0} trees planted \xB7 ${o.harvests || 0} harvests${a ? ` \xB7 ${a} creek dam${a > 1 ? "s" : ""}` : ""}${l ? ` \xB7 ${l} patches of marsh` : ""}</p>`;
        } else if (n === "history") {
          let r = t.hist.slice().reverse();
          s +=
          '<ul class="list">' +
          r.
          map(
            (o) =>
            `<li data-loc="${o.x ?? ""},${o.z ?? ""},${o.who && o.who[0] || ""}"><span>${escapeHtml(o.text)}</span><small>day ${dayNumber(o.t)}</small></li>`
          ).
          join("") +
          "</ul>";
        }
        return (
          this.header(
            e ? escapeHtml(e) : "The village",
            e ?
            "what the creatures call home" :
            "the creatures haven\u2019t agreed on a name for home yet"
          ) +
          this.tabs("v", [
          ["projects", "Projects"],
          ["words", "Words"],
          ["customs", "Customs"],
          ["history", "History"]]
          ) +
          `<div class="sh-body">${s}</div>`);

      }
      logHTML() {
        let t = this.w,
          e = +this.curTab("l", "1"),
          n = t.log.
          filter((r) => r.imp >= e).
          slice(-150).
          reverse(),
          s = `<div class="tabs">${[
          ["1", "Everything"],
          ["2", "Notable"],
          ["3", "Milestones"]].

          map(
            ([r, o]) =>
            `<button class="tab ${String(e) === r ? "on" : ""}" data-tab="l:${r}">${o}</button>`
          ).
          join("")}</div>`;
        return (
          this.header("Happenings", "tap an entry to see where it happened") +
          s +
          `<div class="sh-body"><ul class="list log">${n.map((r) => `<li class="imp${r.imp}" data-loc="${r.x ?? ""},${r.z ?? ""},${r.who && r.who[0] || ""}"><span>${escapeHtml(r.text)}</span><small>${agoText(t.t - r.t)}</small></li>`).join("")}</ul></div>`);

      }
      settingsHTML() {
        let t = this.app.settings,
          e = (r, o, a = "") =>
          `<label class="row"><span>${o}${a ? `<small>${a}</small>` : ""}</span><input type="checkbox" data-setting="${r}" ${t[r] ? "checked" : ""}></label>`,
          n = (r, o, a) =>
          `<label class="row"><span>${o}</span><select data-setting="${r}">${a.map(([l, c]) => `<option value="${l}" ${String(t[r]) === String(l) ? "selected" : ""}>${c}</option>`).join("")}</select></label>`,
          s = this.app.saveInfo();
        return (
          this.header("Settings") +
          `<div class="sh-body">
      ${e("sound", "Sound", "creek, rain, chirps and chimes")}
      ${e("ambient", "Ambient mode when idle", "menus fade and the camera wanders")}
      ${n("idle", "Go ambient after", [
          [20, "20 seconds"],
          [45, "45 seconds"],
          [90, "90 seconds"],
          [300, "5 minutes"]]
          )}
      ${e("dimNight", "Dim the screen at night", "easier on an always-on display")}
      ${e("wakeLock", "Keep the screen awake", s.wake)}
      ${e("names", "Always show names")}
      ${e("meters", "Show need meters", "diagnostic numbers")}
      ${e("shadows", "Shadows")}
      ${n("pixel", "Pixel size", [
          [180, "Chunky"],
          [240, "Normal"],
          [320, "Fine"]]
          )}
      ${n("fps", "Frame rate", [
          [60, "Smooth (60)"],
          [30, "Balanced (30)"],
          [20, "Battery saver (20)"]]
          )}
      <h4>Your valley</h4>
      <p class="muted">${escapeHtml(s.text)}</p>
      <div class="btnrow"><button class="pill" data-act="export">Export save</button><button class="pill" data-act="import">Import save</button></div>
      <div class="btnrow"><button class="pill danger" data-act="newworld">Start a new valley\u2026</button></div>
      <p class="muted small">Creekfolk \xB7 everything runs on this device; nothing is sent anywhere.</p>
    </div>`);

      }
      tick(t) {
        let e = this.w;
        if (e && t - this.lastRefresh > 0.5) {
          this.lastRefresh = t;
          let n = homeWord(e);
          if (
          this.clock.innerHTML = `<span class="ttl">${n ? escapeHtml(n) : "Creekfolk"}</span><span class="sep">\xB7</span>${escapeHtml(clockText(e))} <span class="wx">${e.weather.state === "clear" && isNight(e.t) ? "\u263E" : EM[e.weather.state] || ""}</span>`,
          this.clock.classList.toggle("named", !!n),
          e.logSeq !== this.lastLogLen)
          {
            this.lastLogLen = e.logSeq;
            let s = e.log[e.log.length - 1] || null;
            for (
            let r = e.log.length - 1;
            r >= 0 && r > e.log.length - 120;
            r--)

            if (e.log[r].kind !== "weather") {
              s = e.log[r];
              break;
            }
            this.tickerEntry = s;
          }
          this.tickerEntry && (
          this.ticker.innerHTML = `${escapeHtml(this.tickerEntry.text)} <small>${agoText(e.t - this.tickerEntry.t)}</small>`),
          this.panel && this.panel.kind !== "settings" && this.render(!1);
        }
      }
      showCatchup(t, e = 0, n = "") {
        this.catchup.classList.toggle("hidden", !t),
        t && (
        this.catchup.querySelector(".bar i").style.width =
        Math.round(e * 100) + "%",
        this.catchup.querySelector(".cu-label").textContent = n);
      }
      showSummary(t, e, n) {
        let s = this.w,
          r = s.creatures.map((d) => d.name),
          o = (d) =>
          r.
          reduce((u, f) => u.split(f).join("*"), d.text).
          replace(/\(.*?\)/g, "").
          replace(/\d+/g, "#"),
          a = new Map();
        for (let d of e) {
          if (d.kind === "weather") continue;
          let u = o(d),
            f = a.get(u);
          f ? (f.n++, d.t > f.e.t && (f.e = d)) : a.set(u, { e: d, n: 1 });
        }
        let l = [...a.values()],
          h = [
          ...l.
          filter((d) => d.e.imp >= 3).
          sort((d, u) => u.e.t - d.e.t).
          slice(0, 9),
          ...l.
          filter((d) => d.e.imp < 3).
          sort((d, u) => u.e.t - d.e.t).
          slice(0, 5)].

          sort((d, u) => u.e.t - d.e.t).
          map(
            ({ e: d, n: u }) =>
            `<li data-loc="${d.x ?? ""},${d.z ?? ""},${d.who && d.who[0] || ""}"><span>${escapeHtml(d.text)}${u > 1 ? ` <small>(and ${u - 1} more like it)</small>` : ""}</span><small>${agoText(s.t - d.t)}</small></li>`
          ).
          join("");
        this.summary.innerHTML = `<div class="card"><div class="sh-head"><div><div class="sh-title">While you were away</div><div class="sh-sub">${escapeHtml(durationText(t))} passed in the valley${n ? ` \xB7 ${n} thing${n > 1 ? "s" : ""} built` : ""}</div></div><button class="iconbtn sm" data-close aria-label="Close">${qc.close}</button></div>
      <div class="sh-body">${h ? `<ul class="list">${h}</ul>` : '<p class="muted">A quiet stretch. The creatures went about their days.</p>'}</div>
      <div class="btnrow center"><button class="pill on" data-close>Back to the valley</button></div></div>`,
        this.summary.classList.remove("hidden"),
        this.summary.
        querySelectorAll("[data-close]").
        forEach((d) =>
        d.addEventListener("click", () =>
        this.summary.classList.add("hidden")
        )
        ),
        this.summary.querySelectorAll("[data-loc]").forEach((d) =>
        d.addEventListener("click", () => {
          let [u, f, p] = d.dataset.loc.split(",");
          this.summary.classList.add("hidden"),
          this.locate({ x: +u, z: +f, who: p ? [+p] : [] });
        })
        );
      }
      dialog(t, e) {
        return new Promise((n) => {
          this.summary.innerHTML = `<div class="card"><div class="sh-body">${t}</div><div class="btnrow center">${e.map((s, r) => `<button class="pill ${s.primary ? "on" : ""} ${s.danger ? "danger" : ""}" data-i="${r}">${escapeHtml(s.label)}</button>`).join("")}</div></div>`,
          this.summary.classList.remove("hidden"),
          this.summary.querySelectorAll("[data-i]").forEach((s) =>
          s.addEventListener("click", () => {
            let r = e[+s.dataset.i];
            if (r.keepOpen) {
              r.onClick && r.onClick(this.summary);
              return;
            }
            this.summary.classList.add("hidden"), n(r.value);
          })
          );
        });
      }
      confirm(t, e, n = "Yes", s = !1) {
        return this.dialog(
          `<div class="sh-title">${escapeHtml(t)}</div><p>${escapeHtml(e)}</p>`,
          [
          { label: "Cancel", value: !1 },
          { label: n, value: !0, primary: !s, danger: s }]

        );
      }
      showWelcome(t) {
        this.summary.innerHTML = `<div class="card welcome"><div class="sh-title big">Creekfolk</div>
      <div class="sh-body">
      <p>Five small creatures have just woken up in a meadow beside a creek. They have their own temperaments, needs, and curiosities, and they will figure out the valley \u2014 and each other \u2014 on their own.</p>
      <p>Everything happens in real time, and there is no way to hurry it. A day in the valley lasts an hour; the seasons follow your own calendar. A creekfolk lives about a month: a child, then a grown-up, then a wise elder. Their children will carry on what they started.</p>
      <p>When you close the game, the valley keeps its clock, and every moment is simulated when you return.</p>
      <p class="muted"><b>Drag</b> to look around \xB7 <b>pinch</b> or <b>scroll</b> to zoom \xB7 <b>two fingers</b> or <b>right-drag</b> to turn \xB7 <b>tap</b> a creature to follow it.</p>
      </div><div class="btnrow center"><button class="pill on" data-go>Watch them</button></div></div>`,
        this.summary.classList.remove("hidden"),
        this.summary.
        querySelector("[data-go]").
        addEventListener("click", () => {
          this.summary.classList.add("hidden"), t && t();
        });
      }
    };
  var Sound = class {
    constructor() {
      this.ctx = null,
      this.on = !1,
      this.vol = 0.6,
      this.lastChirp = new Map();
    }
    enable() {
      if (!this.ctx) {
        let t = window.AudioContext || window.webkitAudioContext;
        if (!t) return !1;
        this.ctx = new t(),
        this.master = this.ctx.createGain(),
        this.master.gain.value = this.vol,
        this.master.connect(this.ctx.destination),
        this.makeAmbience();
      }
      return (
        this.ctx.state === "suspended" && this.ctx.resume(),
        this.on = !0,
        this.master.gain.setTargetAtTime(this.vol, this.ctx.currentTime, 0.3),
        !0);

    }
    disable() {
      this.on = !1,
      this.ctx &&
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    noiseBuffer(t = 2) {
      let e = this.ctx,
        n = e.sampleRate * t,
        s = e.createBuffer(1, n, e.sampleRate),
        r = s.getChannelData(0),
        o = 0;
      for (let a = 0; a < n; a++) {
        let l = Math.random() * 2 - 1;
        o = (o + 0.02 * l) / 1.02, r[a] = o * 3.5;
      }
      return s;
    }
    loop(t, e, n, s) {
      let r = this.ctx,
        o = r.createBufferSource();
      o.buffer = t, o.loop = !0;
      let a = r.createBiquadFilter();
      a.type = e, a.frequency.value = n, a.Q.value = s;
      let l = r.createGain();
      return (
        l.gain.value = 0,
        o.connect(a),
        a.connect(l),
        l.connect(this.master),
        o.start(),
        { src: o, f: a, g: l });

    }
    makeAmbience() {
      let t = this.noiseBuffer(3);
      this.creek = this.loop(t, "bandpass", 900, 0.8),
      this.rain = this.loop(t, "highpass", 2500, 0.5),
      this.wind = this.loop(t, "lowpass", 300, 0.4);
    }
    ambience(t, e, n, s) {
      if (!this.ctx || !this.on) return;
      let r = this.ctx.currentTime,
        o = Math.max(0.25, 1 - s / 80);
      this.creek.g.gain.setTargetAtTime(0.05 + 0.12 * t * o, r, 0.5),
      this.creek.f.frequency.setTargetAtTime(
        700 + Math.sin(r * 0.7) * 200,
        r,
        0.3
      ),
      this.rain.g.gain.setTargetAtTime(0.09 * e, r, 0.8),
      this.wind.g.gain.setTargetAtTime(0.03 + 0.03 * e + 0.02 * n, r, 1),
      n > 0.6 && e < 0.2 && Math.random() < 0.02 && this.cricket();
    }
    blip(t, e, n, s = "triangle", r = 0.07) {
      let o = this.ctx,
        a = o.createOscillator(),
        l = o.createGain();
      a.type = s,
      a.frequency.setValueAtTime(t, e),
      a.frequency.exponentialRampToValueAtTime(t * 1.25, e + n * 0.6),
      l.gain.setValueAtTime(0, e),
      l.gain.linearRampToValueAtTime(r, e + 0.015),
      l.gain.exponentialRampToValueAtTime(1e-4, e + n),
      a.connect(l),
      l.connect(this.master),
      a.start(e),
      a.stop(e + n + 0.05);
    }
    chirp(t, e, n = 1, s = 1) {
      if (!this.ctx || !this.on || s < 0.05) return;
      let r = this.ctx.currentTime;
      if ((this.lastChirp.get(t) || 0) > r - 0.4) return;
      this.lastChirp.set(t, r);
      let o = { a: 520, e: 660, i: 780, o: 440, u: 390 },
        a = r,
        l = 0;
      for (let c of e.toLowerCase())
      if (
      o[c] && (
      this.blip(
        o[c] * n * (1 + l % 2 * 0.06),
        a,
        0.09,
        "triangle",
        0.06 * s
      ),
      a += 0.085,
      l++),
      l > 6)

      break;
    }
    chime(t, e = 1) {
      if (!this.ctx || !this.on) return;
      let n = [523, 587, 659, 784, 880, 1047],
        s = n[Math.floor(Math.random() * Math.min(n.length, 2 + t))];
      this.blip(s, this.ctx.currentTime, 1.6, "sine", 0.05 * e);
    }
    thump(t = 1) {
      !this.ctx ||
      !this.on ||
      this.blip(
        110 + Math.random() * 30,
        this.ctx.currentTime,
        0.18,
        "sine",
        0.12 * t
      );
    }
    frog(t = 1) {
      if (!this.ctx || !this.on) return;
      let e = this.ctx,
        n = e.currentTime,
        s = 140 + Math.random() * 70,
        r = e.createBiquadFilter();
      r.type = "lowpass", r.frequency.value = 700, r.connect(this.master);
      let o = Math.random() < 0.3 ? 3 : 2;
      for (let a = 0; a < o; a++) {
        let l = e.createOscillator(),
          c = e.createGain(),
          h = n + a * 0.13;
        l.type = "square",
        l.frequency.setValueAtTime(s * (a % 2 ? 1.18 : 1), h),
        l.frequency.exponentialRampToValueAtTime(s * 0.72, h + 0.09),
        c.gain.setValueAtTime(0, h),
        c.gain.linearRampToValueAtTime(0.035 * t, h + 0.01),
        c.gain.exponentialRampToValueAtTime(1e-4, h + 0.1),
        l.connect(c),
        c.connect(r),
        l.start(h),
        l.stop(h + 0.12);
      }
    }
    cricket() {
      let t = this.ctx.currentTime;
      for (let e = 0; e < 3; e++)
      this.blip(4200, t + e * 0.06, 0.04, "square", 0.006);
    }
  };
  var SAVE_KEY = "creekfolk.save.v1",
    BACKUP_KEY = "creekfolk.save.v1.bak",
    SETTINGS_KEY = "creekfolk.settings.v1",
    IS_TOUCH =
    typeof matchMedia == "function" &&
    matchMedia("(pointer: coarse)").matches,
    DEFAULT_SETTINGS = {
      sound: !1,
      ambient: !0,
      idle: 45,
      dimNight: !0,
      wakeLock: IS_TOUCH,
      names: !1,
      meters: !1,
      shadows: !IS_TOUCH,
      pixel: 240,
      fps: IS_TOUCH ? 30 : 60
    };
  function openLocalStorage() {
    try {
      let i = "__creek_test";
      return (
        localStorage.setItem(i, "1"), localStorage.removeItem(i), localStorage);

    } catch {
      return null;
    }
  }
  var App = class {
    constructor() {
      this.ls = openLocalStorage(), this.settings = { ...DEFAULT_SETTINGS };
      try {
        Object.assign(
          this.settings,
          JSON.parse(this.ls && this.ls.getItem(SETTINGS_KEY) || "{}")
        );
      } catch {}
      this.canvas = document.getElementById("view"),
      this.renderer = new Renderer(this.canvas, {
        shadows: this.settings.shadows,
        shadowSize: IS_TOUCH ? 1024 : 2048,
        lowPower: IS_TOUCH
      }),
      this.rig = new CameraRig(this.renderer, this.canvas, {
        onTap: (t, e) => this.tap(t, e),
        onActive: () => this.activeInput()
      }),
      this.hud = new Hud(this),
      this.sound = new Sound(),
      this.selected = null,
      this.following = null,
      this.ambient = !1,
      this.lastActive = performance.now(),
      this.catching = null,
      this.lastSave = 0,
      this.lastBak = 0,
      this.heard = new Map(),
      this.wake = null,
      this.wakeStatus = "",
      this.store = new ValleyStore(), // LIFE: saves live in IndexedDB (src/view/store.js)
      this.dev = new DevMenu(this), // LIFE: hidden developer menu (src/view/dev.js)
      window.addEventListener("resize", () => this.resize()),
      this.canvas.addEventListener("webglcontextlost", (t) => {
        t.preventDefault(),
        this.save(),
        clearTimeout(this.ctxTimer),
        this.ctxTimer = setTimeout(() => location.reload(), 6e3);
      }),
      this.canvas.addEventListener("webglcontextrestored", () => {
        clearTimeout(this.ctxTimer), this.resize();
      }),
      document.addEventListener("visibilitychange", () => {
        document.visibilityState === "hidden" ?
        this.save() :
        this.requestWake();
      }),
      window.addEventListener("pagehide", () => this.save()),
      window.addEventListener("beforeunload", () => this.save()),
      this.settings.sound &&
      document.addEventListener("pointerdown", () => this.sound.enable(), {
        once: !0
      }),
      this.requestWake(),
      this.last = performance.now(),
      this.lastFrame = 0,
      this.loadOrCreate().then(() => {
        this.resize(), requestAnimationFrame((t) => this.frame(t));
      }),
      window.__creek = this;
    }
    async loadOrCreate() {
      let t = null,
        e = null;
      for (let n of ["main", "backup"]) {
        let r = await this.store.get(n);
        if (r)
        try {
          t = loadWorld(r), e = n;
          break;
        } catch (o) {
          console.warn("save unreadable", n, o);
        }
      }
      if (!t && this.ls)
      for (let n of [SAVE_KEY, BACKUP_KEY]) {
        let r = this.ls.getItem(n);
        if (r)
        try {
          t = loadWorld(r), e = "legacy";
          break;
        } catch (o) {
          console.warn("old save unreadable", n, o);
        }
      }
      this.store.available || this.hud.saveWarn.classList.remove("hidden");
      t ?
      (this.setWorld(t),
      e === "backup" && this.hud.toast("Restored from the backup save."),
      e === "legacy" && (this.save(), this.hud.toast("Your valley has moved to the new save storage."))) :
      (t = this.newWorld(), this.setWorld(t), this.save(), setTimeout(() => this.hud.showWelcome(), 300));
    }
    newWorld(t) {
      t = t || "valley-" + Math.random().toString(36).slice(2, 8);
      let n = devNow(),
        e = newValley(t, { calStart: n, tzMin: new Date(n).getTimezoneOffset() }); // LIFE: five founders on the real calendar
      return e.realStart = n, e.skip = 0, e;
    }
    applyClock() {
      setDayCycle(this.world.cycle || null);
    }
    setWorld(t) {
      this.world = t,
      this.applyClock(),
      t.onLog = (e) => this.onLog(e),
      this.renderer.setWorld(t),
      this.rig.setWorld(t),
      this.selected = null,
      this.following = null,
      this.hud.close();
    }
    simTarget() {
      let t = this.world,
        e = (devNow() - t.realStart) / 1e3 + (t.skip || 0); // LIFE: devNow() adds the developer offset
      return (
        e < t.t - 120 && (
        t.realStart = devNow() - (t.t - (t.skip || 0)) * 1e3, e = t.t),
        e);

    }
    save() {
      if (!this.world || this.catching) return !1;
      let t;
      try {
        t = saveWorld(this.world);
      } catch (e) {
        return console.warn("save failed", e), !1;
      }
      let e = performance.now() - this.lastBak > 600 * 1e3;
      e && (this.lastBak = performance.now());
      this.store.put("main", t).
      then(() => (e ? this.store.put("backup", t) : !0)).
      then(() => {
        this.lastSaveSize = t.length, this.lastSaveAt = Date.now(), this.hud.saveWarn.classList.add("hidden");
      }).
      catch((n) => {
        console.warn("save failed", n), this.hud.saveWarn.classList.remove("hidden");
      });
      return !0;
    }
    saveInfo() {
      let t = this.world,
        e = durationText(t.t),
        n = this.store.available ?
        `Saved in this browser${this.lastSaveAt ? " (last " + Math.round((Date.now() - this.lastSaveAt) / 1e3) + "s ago)" : ""}.` :
        "This browser won\u2019t let the game save \u2014 use Export to keep a copy.";
      return {
        text: `This valley began on ${dateText(t, 0)} and is ${e} old (seed \u201C${t.seed}\u201D). ${n} A year is a long time to trust a browser, so export a backup file now and then; it can be imported on any device.`,
        wake: this.wakeStatus
      };
    }
    activeInput() {
      this.lastActive = performance.now(),
      this.ambient && (
      this.setAmbient(!1), this.justWoke = performance.now());
    }
    setAmbient(t) {
      this.ambient = t,
      this.rig.setAmbient(t),
      this.hud.setAmbient(t),
      t && (
      this.hud.close(), this.following = null, this.rig.follow = null);
    }
    toggleAmbient() {
      this.ambient ?
      this.setAmbient(!1) : (
      this.setAmbient(!0), this.lastActive = performance.now() - 1e9);
    }
    tap(t, e) {
      if (this.justWoke && performance.now() - this.justWoke < 400) return;
      let n = this.renderer.pickCreature(t, e);
      if (n) {
        this.select(n);
        return;
      }
      let s = this.renderer.pickStructure(t, e, 34);
      if (s) {
        this.selectStructure(s);
        return;
      }
      this.selected = null,
      this.following = null,
      this.rig.setFollow(null),
      this.hud.close();
    }
    select(t) {
      this.ambient && this.setAmbient(!1),
      this.selected = t,
      this.following = t,
      this.rig.setFollow(t),
      this.hud.open("creature", t);
    }
    selectStructure(t) {
      let e = this.world.byId[t];
      e && (
      this.selected = null,
      this.following = null,
      this.rig.setFollow(null),
      this.rig.flyTo(e.x, e.z, Math.min(this.rig.goal.dist, 24)),
      this.hud.open("structure", t));
    }
    flyTo(t, e) {
      this.ambient && this.setAmbient(!1),
      this.following = null,
      this.rig.setFollow(null),
      this.rig.flyTo(t, e, 18);
    }
    onPanel(t) {
      t !== "creature" && (this.selected = null),
      this.rig.liftGoal = t && window.innerWidth < 760 ? 1 : 0,
      this.rig.sideGoal =
      t && window.innerWidth >= 760 ?
      Math.min(0.3, 200 / window.innerWidth) :
      0;
    }
    action(t, e) {
      switch (t) {
        case "follow":{
            let n = +e.id;
            this.following === n ? (
            this.following = null, this.rig.setFollow(null)) : (
            this.following = n, this.rig.setFollow(n)),
            this.hud.render(!0);
            break;
          }
        case "export":
          this.exportSave();
          break;
        case "import":
          this.importSave();
          break;
        case "newworld":{
            this.hud.close(),
            this.hud.
            confirm(
              "Start a new valley?",
              "The current valley will be replaced. Export it first if you want to keep a copy.",
              "Start over",
              !0
            ).
            then((n) => {
              if (!n) return;
              let s = this.newWorld();
              this.setWorld(s), this.save(), this.hud.showWelcome();
            });
            break;
          }
      }
    }
    setSetting(t, e) {
      ["idle", "pixel", "fps"].includes(t) && (e = +e), this.settings[t] = e;
      try {
        this.ls && this.ls.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      } catch {}
      t === "sound" && (e ? this.sound.enable() : this.sound.disable()),
      t === "pixel" && this.resize(),
      t === "shadows" && this.renderer.setShadows(e),
      t === "wakeLock" && this.requestWake(),
      t === "ambient" && !e && this.ambient && this.setAmbient(!1),
      this.hud.render(!0);
    }
    exportSave() {
      let t = saveWorld(this.world, { exportedAt: Date.now() }),
        e = `creekfolk-${this.world.seed}-day${Math.floor(this.world.t / 86400) + 1}.json`,
        n = window.CREEK_MODE === "artifact";
      this.hud.close();
      let s = [];
      n ||
      s.push({
        label: "Download file",
        keepOpen: !0,
        primary: !0,
        onClick: () => {
          let r = new Blob([t], { type: "application/json" }),
            o = document.createElement("a");
          o.href = URL.createObjectURL(r),
          o.download = e,
          document.body.appendChild(o),
          o.click(),
          setTimeout(() => {
            URL.revokeObjectURL(o.href), o.remove();
          }, 1e3);
        }
      }),
      s.push({
        label: "Copy save text",
        keepOpen: !0,
        primary: n,
        onClick: (r) => {
          let o = r.querySelector("textarea"),
            a = () => {
              let l = r.querySelector(".copied");
              l && (l.textContent = "Copied.");
            };
          navigator.clipboard && navigator.clipboard.writeText ?
          navigator.clipboard.writeText(t).then(a, () => {
            o.select();
          }) :
          o.select();
        }
      }),
      s.push({ label: "Done", value: !0 }),
      this.hud.dialog(
        `<div class="sh-title">Export your valley</div><p class="muted">${n ? "Copy the save text and keep it somewhere safe (a note or a file). You can paste it into Import on any device." : "Download a file, or copy the save text. Either one can be imported on another device."} <span class="copied"></span></p><textarea id="exporttext" readonly class="savebox">${t.replace(/</g, "&lt;")}</textarea>`,
        s
      );
    }
    importSave() {
      this.hud.close();
      let t = async (e) => {
        let n;
        try {
          n = loadWorld(e.trim());
        } catch {
          await this.hud.dialog(
            '<div class="sh-title">That didn\u2019t work</div><p>That text or file couldn\u2019t be read as a Creekfolk save.</p>',
            [{ label: "OK", value: !0 }]
          );
          return;
        }
        n.realStart || (n.realStart = devNow() - n.t * 1e3, n.skip = 0),
        (await this.hud.confirm(
          "Replace this valley?",
          "The saved valley will replace the current one. Time that passed since it was exported will be caught up.",
          "Replace",
          !0
        )) && (
        this.setWorld(n), this.save(), this.hud.toast("Save imported."));
      };
      this.hud.dialog(
        '<div class="sh-title">Import a valley</div><p class="muted">Choose a save file, or paste save text below.</p><input type="file" id="importfile" accept=".json,application/json"><textarea id="importtext" class="savebox" placeholder="Paste save text here"></textarea>',
        [
        { label: "Cancel", value: !1 },
        {
          label: "Load",
          primary: !0,
          keepOpen: !0,
          onClick: (e) => {
            let n = e.querySelector("#importfile").files[0],
              s = e.querySelector("#importtext").value;
            if (!n && !s.trim()) {
              let r = e.querySelector("p.muted");
              r && (
              r.textContent =
              "Choose a save file or paste save text first.");
              return;
            }
            e.classList.add("hidden"), n ? n.text().then(t) : s && t(s);
          }
        }]

      );
    }
    async requestWake() {
      if (!this.settings.wakeLock) {
        if (this.wake) {
          try {
            await this.wake.release();
          } catch {}
          this.wake = null;
        }
        this.wakeStatus = "off";
        return;
      }
      if (!("wakeLock" in navigator)) {
        this.wakeStatus = "not supported by this browser";
        return;
      }
      if (!(document.visibilityState !== "visible" || this.wake))
      try {
        this.wake = await navigator.wakeLock.request("screen"),
        this.wakeStatus = "active",
        this.wake.addEventListener("release", () => {
          this.wake = null, this.wakeStatus = "released";
        });
      } catch {
        this.wakeStatus =
        "blocked here (it works when the game is hosted on https)";
      }
    }
    resize() {
      let t = Math.min(window.devicePixelRatio || 1, 3);
      this.renderer.resize(
        window.innerWidth,
        window.innerHeight,
        t,
        this.settings.pixel
      ),
      this.rig.apply && this.rig.world && this.rig.apply();
    }
    onLog(t) {
      if (this.catching) {
        if (t.imp >= 2) {
          let e = this.catching.events;
          if (e.push(t), e.length > 400) {
            let n = e.findIndex((s) => s.imp < 3);
            e.splice(n >= 0 ? n : 0, 1);
          }
        }
        return;
      }
      this.rig.notice(t);
    }
    frame(t) {
      requestAnimationFrame((h) => this.frame(h));
      let e = isNight(this.world.t),
        s =
        1e3 / (
        this.ambient && e ?
        Math.min(20, this.settings.fps || 60) :
        this.settings.fps || 60) -
        2;
      if (t - this.lastFrame < s) return;
      let r = Math.min(0.1, (t - this.last) / 1e3);
      this.last = t, this.lastFrame = t;
      let o = this.world,
        a = this.simTarget();
      if (
      !this.catching &&
      a - o.t > 20 && (
      this.catching = {
        from: o.t,
        to: a,
        events: [],
        levels: o.stats.levels || 0,
        started: t
      }),
      this.catching)
      {
        let h = this.catching;
        h.to = a;
        // LIFE: long gaps are replayed in a Web Worker (src/view/catchup.js), every moment in full,
        // so the page stays responsive. The worker returns the caught-up valley; any time that
        // passed while it worked is then run here as before.
        if (!h.worker && !h.workerDone && h.to - o.t > CATCHUP_WORKER_MIN && CatchupWorker.available()) {
          h.worker = !0, h.workerFrom = o.t;
          CatchupWorker.run(saveWorld(o), h.to, (m) => h.workerT = m.t).
          then((m) => h.result = m).
          catch((m) => (console.warn("catch-up worker failed, catching up here instead", m), h.worker = !1, h.workerDone = !0));
        }
        if (h.worker) {
          if (h.result) {
            let m = h.result;
            h.result = null, h.worker = !1, h.workerDone = !0;
            let x = loadWorld(m.save);
            for (let y of m.events) h.events.push(y);
            this.setWorld(x), o = this.world;
          } else {
            let m = ((h.workerT ?? h.workerFrom) - h.from) / Math.max(1, h.to - h.from);
            t - h.started > 250 && this.hud.showCatchup(!0, m, `Catching up on ${durationText(h.to - h.from)}\u2026`);
            return;
          }
        }
        let d = runUntil(o, a, performance.now() + 40, () => performance.now()),
          u = (o.t - h.from) / Math.max(1, h.to - h.from);
        if (
        t - h.started > 250 &&
        this.hud.showCatchup(
          !0,
          u,
          `Catching up on ${durationText(h.to - h.from)}\u2026`
        ),
        d)
        {
          this.catching = null, this.hud.showCatchup(!1);
          let f = h.to - h.from;
          f > 300 &&
          this.hud.showSummary(f, h.events, (o.stats.levels || 0) - h.levels),
          this.save();
        }
      } else runUntil(o, a);
      this.settings.ambient &&
      !this.ambient &&
      t - this.lastActive > this.settings.idle * 1e3 &&
      !this.catching &&
      this.hud.summary.classList.contains("hidden") &&
      this.setAmbient(!0),
      this.rig.update(r);
      let l = 1 - daylight(o.t);
      if (this.catching && t - (this.lastCatchDraw || 0) < 350) return;
      this.lastCatchDraw = t;
      let c = this.ambient && this.settings.dimNight ? 1 - 0.5 * l : 1;
      this.renderer.update(r, t / 1e3, {
        camDistance: this.rig.cur.dist * (this.renderer.distFactor || 1),
        selected: this.selected,
        showNames: this.settings.names,
        focus: { x: this.rig.cur.x, z: this.rig.cur.z },
        dim: c
      }),
      this.renderer.render(),
      this.hud.tick(t / 1e3),
      this.sounds(t / 1e3, l),
      t - this.lastSave > 2e4 && (this.lastSave = t, this.save());
    }
    sounds(t, e) {
      let n = this.sound;
      if (!n.on) return;
      let s = this.world,
        r = this.rig.cur.x,
        o = this.rig.cur.z,
        a = s.terrain.edgeDist(r, o);
      n.ambience(
        Math.max(0, 1 - Math.max(0, a) / 10),
        s.weather.rain,
        e,
        this.rig.cur.dist
      );
      let l = 10 + this.rig.cur.dist * 0.5;
      for (let h of s.creatures) {
        let d = h.act;
        if (!d) continue;
        let u = positionAt(h, s.t),
          f = dist2d(u.x, u.z, r, o),
          p = Math.max(0, 1 - f / l);
        if (p <= 0) continue;
        let x = h.id;
        if (
        d.type === "call" &&
        this.heard.get(x) !== d.tok && (
        this.heard.set(x, d.tok),
        n.chirp(h.id, (d.words || []).join(""), h.accent.pitch, p)),
        h.reply &&
        s.t - h.reply.t < 0.5 &&
        this.heard.get("r" + x) !== h.reply.t && (
        this.heard.set("r" + x, h.reply.t),
        n.chirp(h.id + 1e3, h.reply.word, h.accent.pitch * 1.05, p)),
        d.type === "chat" && s.joints[d.joint])
        {
          let g = s.joints[d.joint];
          for (let m = 0; m < g.lines.length; m++) {
            let b = g.lines[m],
              T = "j" + g.id + ":" + m;
            b.who === h.id &&
            s.t - g.t0 >= b.dt &&
            s.t - g.t0 < b.dt + 1 &&
            !this.heard.has(T) && (
            this.heard.set(T, 1),
            n.chirp(h.id, b.word, h.accent.pitch, p * 0.8));
          }
        }
        d.type === "play" &&
        d.kind === "drum" &&
        Math.random() < 0.08 &&
        n.thump(p);
      }
      let c = s.hydro;
      if (c && c.frogs && s.weather.rain < 1.2) {
        let h = Math.max(
          0,
          1 - dist2d(c.cx, c.cz, r, o) / (16 + this.rig.cur.dist * 0.5)
        );
        h > 0 &&
        Math.random() <
        (e > 0.25 ? 0.03 : 0.004) * Math.min(1, c.marsh / 30) &&
        n.frog(h);
      }
      if (s.weather.rain > 0)
      for (let h of s.structures) {
        if (h.kind !== "chimes" || h.level === 0) continue;
        let d = Math.max(
          0,
          1 - dist2d(h.x, h.z, r, o) / (12 + this.rig.cur.dist * 0.5)
        );
        d > 0 && Math.random() < 0.04 * h.level && n.chime(h.level, d);
      }
      this.heard.size > 400 && this.heard.clear();
    }
  };
