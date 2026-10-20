  var Qf = 0,
    hu = 1,
    tp = 2;
  var Is = 1,
    ep = 2,
    kr = 3,
    is = 0,
    Mn = 1,
    gi = 2,
    xi = 0,
    Cr = 1,
    uu = 2,
    du = 3,
    fu = 4,
    np = 5;
  var Ps = 100,
    ip = 101,
    sp = 102,
    rp = 103,
    op = 104,
    ap = 200,
    lp = 201,
    cp = 202,
    hp = 203,
    pu = 204,
    mu = 205,
    up = 206,
    dp = 207,
    fp = 208,
    pp = 209,
    mp = 210,
    gp = 211,
    xp = 212,
    yp = 213,
    vp = 214,
    rl = 0,
    ol = 1,
    al = 2,
    pr = 3,
    ll = 4,
    cl = 5,
    hl = 6,
    ul = 7,
    Ol = 0,
    _p = 1,
    bp = 2,
    Kn = 0,
    gu = 1,
    xu = 2,
    yu = 3,
    vu = 4,
    _u = 5,
    bu = 6,
    Mu = 7;
  var Su = 300,
    ss = 301,
    Ls = 302,
    Bl = 303,
    Hl = 304,
    Go = 306,
    dl = 1e3,
    hi = 1001,
    fl = 1002,
    Ae = 1003,
    Mp = 1004;
  var Wo = 1005;
  var cn = 1006,
    Vl = 1007;
  var rs = 1008;
  var Tn = 1009,
    wu = 1010,
    Eu = 1011,
    Ir = 1012,
    Gl = 1013,
    Ln = 1014,
    Fn = 1015,
    Qn = 1016,
    Wl = 1017,
    Xl = 1018,
    Pr = 1020,
    Tu = 35902,
    Au = 35899,
    Ru = 1021,
    ku = 1022,
    On = 1023,
    ui = 1026,
    os = 1027,
    $l = 1028,
    ql = 1029,
    as = 1030,
    Yl = 1031;
  var Zl = 1033,
    Xo = 33776,
    $o = 33777,
    qo = 33778,
    Yo = 33779,
    Jl = 35840,
    jl = 35841,
    Kl = 35842,
    Ql = 35843,
    tc = 36196,
    ec = 37492,
    nc = 37496,
    ic = 37488,
    sc = 37489,
    Zo = 37490,
    rc = 37491,
    oc = 37808,
    ac = 37809,
    lc = 37810,
    cc = 37811,
    hc = 37812,
    uc = 37813,
    dc = 37814,
    fc = 37815,
    pc = 37816,
    mc = 37817,
    gc = 37818,
    xc = 37819,
    yc = 37820,
    vc = 37821,
    _c = 36492,
    bc = 36494,
    Mc = 36495,
    Sc = 36283,
    wc = 36284,
    Jo = 36285,
    Ec = 36286;
  var yo = 2300,
    pl = 2301,
    il = 2302,
    tu = 2303,
    eu = 2400,
    nu = 2401,
    iu = 2402;
  var Sp = 3200;
  var Tc = 0,
    wp = 1,
    Pi = "",
    rn = "srgb",
    vo = "srgb-linear",
    _o = "linear",
    me = "srgb";
  var sl = 7680;
  var Ep = 519,
    Tp = 512,
    Ap = 513,
    Rp = 514,
    Ac = 515,
    kp = 516,
    Cp = 517,
    Rc = 518,
    Ip = 519,
    Cu = 35044;
  var Iu = "300 es",
    Zn = 2e3,
    mr = 2001;
  function vg(i) {
    for (let t = i.length - 1; t >= 0; --t) if (i[t] >= 65535) return !0;
    return !1;
  }
  function _g(i) {
    return ArrayBuffer.isView(i) && !(i instanceof DataView);
  }
  function bo(i) {
    return document.createElementNS("http://www.w3.org/1999/xhtml", i);
  }
  function Pp() {
    let i = bo("canvas");
    return i.style.display = "block", i;
  }
  var _f = {},
    gr = null;
  function Mo(...i) {
    let t = "THREE." + i.shift();
    gr ? gr("log", t, ...i) : console.log(t, ...i);
  }
  function Lp(i) {
    let t = i[0];
    if (typeof t == "string" && t.startsWith("TSL:")) {
      let e = i[1];
      e && e.isStackTrace ?
      i[0] += " " + e.getLocation() :
      i[1] =
      'Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.';
    }
    return i;
  }
  function Ht(...i) {
    i = Lp(i);
    let t = "THREE." + i.shift();
    if (gr) gr("warn", t, ...i);else
    {
      let e = i[0];
      e && e.isStackTrace ? console.warn(e.getError(t)) : console.warn(t, ...i);
    }
  }
  function Gt(...i) {
    i = Lp(i);
    let t = "THREE." + i.shift();
    if (gr) gr("error", t, ...i);else
    {
      let e = i[0];
      e && e.isStackTrace ?
      console.error(e.getError(t)) :
      console.error(t, ...i);
    }
  }
  function Ss(...i) {
    let t = i.join(" ");
    t in _f || (_f[t] = !0, Ht(...i));
  }
  function Dp(i, t, e) {
    return new Promise(function (n, s) {
      function r() {
        switch (i.clientWaitSync(t, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
          case i.WAIT_FAILED:
            s();
            break;
          case i.TIMEOUT_EXPIRED:
            setTimeout(r, e);
            break;
          default:
            n();
        }
      }
      setTimeout(r, e);
    });
  }
  var Np = {
      [rl]: ol,
      [al]: hl,
      [ll]: ul,
      [pr]: cl,
      [ol]: rl,
      [hl]: al,
      [ul]: ll,
      [cl]: pr
    },
    di = class {
      addEventListener(t, e) {
        this._listeners === void 0 && (this._listeners = {});
        let n = this._listeners;
        n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
      }
      hasEventListener(t, e) {
        let n = this._listeners;
        return n === void 0 ? !1 : n[t] !== void 0 && n[t].indexOf(e) !== -1;
      }
      removeEventListener(t, e) {
        let n = this._listeners;
        if (n === void 0) return;
        let s = n[t];
        if (s !== void 0) {
          let r = s.indexOf(e);
          r !== -1 && s.splice(r, 1);
        }
      }
      dispatchEvent(t) {
        let e = this._listeners;
        if (e === void 0) return;
        let n = e[t.type];
        if (n !== void 0) {
          t.target = this;
          let s = n.slice(0);
          for (let r = 0, o = s.length; r < o; r++) s[r].call(this, t);
          t.target = null;
        }
      }
    },
    fn = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "0a",
    "0b",
    "0c",
    "0d",
    "0e",
    "0f",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "1a",
    "1b",
    "1c",
    "1d",
    "1e",
    "1f",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "2a",
    "2b",
    "2c",
    "2d",
    "2e",
    "2f",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "3a",
    "3b",
    "3c",
    "3d",
    "3e",
    "3f",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "4a",
    "4b",
    "4c",
    "4d",
    "4e",
    "4f",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "5a",
    "5b",
    "5c",
    "5d",
    "5e",
    "5f",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "6a",
    "6b",
    "6c",
    "6d",
    "6e",
    "6f",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "7a",
    "7b",
    "7c",
    "7d",
    "7e",
    "7f",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "8a",
    "8b",
    "8c",
    "8d",
    "8e",
    "8f",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "9a",
    "9b",
    "9c",
    "9d",
    "9e",
    "9f",
    "a0",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
    "b0",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
    "ba",
    "bb",
    "bc",
    "bd",
    "be",
    "bf",
    "c0",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "ca",
    "cb",
    "cc",
    "cd",
    "ce",
    "cf",
    "d0",
    "d1",
    "d2",
    "d3",
    "d4",
    "d5",
    "d6",
    "d7",
    "d8",
    "d9",
    "da",
    "db",
    "dc",
    "dd",
    "de",
    "df",
    "e0",
    "e1",
    "e2",
    "e3",
    "e4",
    "e5",
    "e6",
    "e7",
    "e8",
    "e9",
    "ea",
    "eb",
    "ec",
    "ed",
    "ee",
    "ef",
    "f0",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "fa",
    "fb",
    "fc",
    "fd",
    "fe",
    "ff"];

  var kh = Math.PI / 180,
    ml = 180 / Math.PI;
  function ji() {
    let i = Math.random() * 4294967295 | 0,
      t = Math.random() * 4294967295 | 0,
      e = Math.random() * 4294967295 | 0,
      n = Math.random() * 4294967295 | 0;
    return (
    fn[i & 255] +
    fn[i >> 8 & 255] +
    fn[i >> 16 & 255] +
    fn[i >> 24 & 255] +
    "-" +
    fn[t & 255] +
    fn[t >> 8 & 255] +
    "-" +
    fn[t >> 16 & 15 | 64] +
    fn[t >> 24 & 255] +
    "-" +
    fn[e & 63 | 128] +
    fn[e >> 8 & 255] +
    "-" +
    fn[e >> 16 & 255] +
    fn[e >> 24 & 255] +
    fn[n & 255] +
    fn[n >> 8 & 255] +
    fn[n >> 16 & 255] +
    fn[n >> 24 & 255]).
    toLowerCase();
  }
  function re(i, t, e) {
    return Math.max(t, Math.min(e, i));
  }
  function bg(i, t) {
    return (i % t + t) % t;
  }
  function Ch(i, t, e) {
    return (1 - e) * i + e * t;
  }
  function ci(i, t) {
    switch (t.constructor) {
      case Float32Array:
        return i;
      case Uint32Array:
        return i / 4294967295;
      case Uint16Array:
        return i / 65535;
      case Uint8Array:
      case Uint8ClampedArray:
        return i / 255;
      case Int32Array:
        return Math.max(i / 2147483647, -1);
      case Int16Array:
        return Math.max(i / 32767, -1);
      case Int8Array:
        return Math.max(i / 127, -1);
      default:
        throw new Error("THREE.MathUtils: Invalid component type.");
    }
  }
  function _e(i, t) {
    switch (t.constructor) {
      case Float32Array:
        return i;
      case Uint32Array:
        return Math.round(i * 4294967295);
      case Uint16Array:
        return Math.round(i * 65535);
      case Uint8Array:
      case Uint8ClampedArray:
        return Math.round(i * 255);
      case Int32Array:
        return Math.round(i * 2147483647);
      case Int16Array:
        return Math.round(i * 32767);
      case Int8Array:
        return Math.round(i * 127);
      default:
        throw new Error("THREE.MathUtils: Invalid component type.");
    }
  }
  var zu = class zu {
    constructor(t = 0, e = 0) {
      this.x = t, this.y = e;
    }
    get width() {
      return this.x;
    }
    set width(t) {
      this.x = t;
    }
    get height() {
      return this.y;
    }
    set height(t) {
      this.y = t;
    }
    set(t, e) {
      return this.x = t, this.y = e, this;
    }
    setScalar(t) {
      return this.x = t, this.y = t, this;
    }
    setX(t) {
      return this.x = t, this;
    }
    setY(t) {
      return this.y = t, this;
    }
    setComponent(t, e) {
      switch (t) {
        case 0:
          this.x = e;
          break;
        case 1:
          this.y = e;
          break;
        default:
          throw new Error("THREE.Vector2: index is out of range: " + t);
      }
      return this;
    }
    getComponent(t) {
      switch (t) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("THREE.Vector2: index is out of range: " + t);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(t) {
      return this.x = t.x, this.y = t.y, this;
    }
    add(t) {
      return this.x += t.x, this.y += t.y, this;
    }
    addScalar(t) {
      return this.x += t, this.y += t, this;
    }
    addVectors(t, e) {
      return this.x = t.x + e.x, this.y = t.y + e.y, this;
    }
    addScaledVector(t, e) {
      return this.x += t.x * e, this.y += t.y * e, this;
    }
    sub(t) {
      return this.x -= t.x, this.y -= t.y, this;
    }
    subScalar(t) {
      return this.x -= t, this.y -= t, this;
    }
    subVectors(t, e) {
      return this.x = t.x - e.x, this.y = t.y - e.y, this;
    }
    multiply(t) {
      return this.x *= t.x, this.y *= t.y, this;
    }
    multiplyScalar(t) {
      return this.x *= t, this.y *= t, this;
    }
    divide(t) {
      return this.x /= t.x, this.y /= t.y, this;
    }
    divideScalar(t) {
      return this.multiplyScalar(1 / t);
    }
    applyMatrix3(t) {
      let e = this.x,
        n = this.y,
        s = t.elements;
      return (
        this.x = s[0] * e + s[3] * n + s[6],
        this.y = s[1] * e + s[4] * n + s[7],
        this);

    }
    min(t) {
      return (
        this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this);

    }
    max(t) {
      return (
        this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this);

    }
    clamp(t, e) {
      return (
        this.x = re(this.x, t.x, e.x), this.y = re(this.y, t.y, e.y), this);

    }
    clampScalar(t, e) {
      return this.x = re(this.x, t, e), this.y = re(this.y, t, e), this;
    }
    clampLength(t, e) {
      let n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(re(n, t, e));
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    }
    roundToZero() {
      return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
    }
    negate() {
      return this.x = -this.x, this.y = -this.y, this;
    }
    dot(t) {
      return this.x * t.x + this.y * t.y;
    }
    cross(t) {
      return this.x * t.y - this.y * t.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(t) {
      let e = Math.sqrt(this.lengthSq() * t.lengthSq());
      if (e === 0) return Math.PI / 2;
      let n = this.dot(t) / e;
      return Math.acos(re(n, -1, 1));
    }
    distanceTo(t) {
      return Math.sqrt(this.distanceToSquared(t));
    }
    distanceToSquared(t) {
      let e = this.x - t.x,
        n = this.y - t.y;
      return e * e + n * n;
    }
    manhattanDistanceTo(t) {
      return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
    }
    setLength(t) {
      return this.normalize().multiplyScalar(t);
    }
    lerp(t, e) {
      return (
        this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this);

    }
    lerpVectors(t, e, n) {
      return (
        this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this);

    }
    equals(t) {
      return t.x === this.x && t.y === this.y;
    }
    fromArray(t, e = 0) {
      return this.x = t[e], this.y = t[e + 1], this;
    }
    toArray(t = [], e = 0) {
      return t[e] = this.x, t[e + 1] = this.y, t;
    }
    fromBufferAttribute(t, e) {
      return this.x = t.getX(e), this.y = t.getY(e), this;
    }
    rotateAround(t, e) {
      let n = Math.cos(e),
        s = Math.sin(e),
        r = this.x - t.x,
        o = this.y - t.y;
      return (
        this.x = r * n - o * s + t.x, this.y = r * s + o * n + t.y, this);

    }
    random() {
      return this.x = Math.random(), this.y = Math.random(), this;
    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y;
    }
  };
  zu.prototype.isVector2 = !0;
  var Vt = zu,
    mn = class {
      constructor(t = 0, e = 0, n = 0, s = 1) {
        this.isQuaternion = !0,
        this._x = t,
        this._y = e,
        this._z = n,
        this._w = s;
      }
      static slerpFlat(t, e, n, s, r, o, a) {
        let l = n[s + 0],
          c = n[s + 1],
          h = n[s + 2],
          d = n[s + 3],
          u = r[o + 0],
          f = r[o + 1],
          p = r[o + 2],
          x = r[o + 3];
        if (d !== x || l !== u || c !== f || h !== p) {
          let g = l * u + c * f + h * p + d * x;
          g < 0 && (u = -u, f = -f, p = -p, x = -x, g = -g);
          let m = 1 - a;
          if (g < 0.9995) {
            let b = Math.acos(g),
              T = Math.sin(b);
            m = Math.sin(m * b) / T,
            a = Math.sin(a * b) / T,
            l = l * m + u * a,
            c = c * m + f * a,
            h = h * m + p * a,
            d = d * m + x * a;
          } else {
            l = l * m + u * a,
            c = c * m + f * a,
            h = h * m + p * a,
            d = d * m + x * a;
            let b = 1 / Math.sqrt(l * l + c * c + h * h + d * d);
            l *= b, c *= b, h *= b, d *= b;
          }
        }
        t[e] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = d;
      }
      static multiplyQuaternionsFlat(t, e, n, s, r, o) {
        let a = n[s],
          l = n[s + 1],
          c = n[s + 2],
          h = n[s + 3],
          d = r[o],
          u = r[o + 1],
          f = r[o + 2],
          p = r[o + 3];
        return (
          t[e] = a * p + h * d + l * f - c * u,
          t[e + 1] = l * p + h * u + c * d - a * f,
          t[e + 2] = c * p + h * f + a * u - l * d,
          t[e + 3] = h * p - a * d - l * u - c * f,
          t);

      }
      get x() {
        return this._x;
      }
      set x(t) {
        this._x = t, this._onChangeCallback();
      }
      get y() {
        return this._y;
      }
      set y(t) {
        this._y = t, this._onChangeCallback();
      }
      get z() {
        return this._z;
      }
      set z(t) {
        this._z = t, this._onChangeCallback();
      }
      get w() {
        return this._w;
      }
      set w(t) {
        this._w = t, this._onChangeCallback();
      }
      set(t, e, n, s) {
        return (
          this._x = t,
          this._y = e,
          this._z = n,
          this._w = s,
          this._onChangeCallback(),
          this);

      }
      clone() {
        return new this.constructor(this._x, this._y, this._z, this._w);
      }
      copy(t) {
        return (
          this._x = t.x,
          this._y = t.y,
          this._z = t.z,
          this._w = t.w,
          this._onChangeCallback(),
          this);

      }
      setFromEuler(t, e = !0) {
        let n = t._x,
          s = t._y,
          r = t._z,
          o = t._order,
          a = Math.cos,
          l = Math.sin,
          c = a(n / 2),
          h = a(s / 2),
          d = a(r / 2),
          u = l(n / 2),
          f = l(s / 2),
          p = l(r / 2);
        switch (o) {
          case "XYZ":
            this._x = u * h * d + c * f * p,
            this._y = c * f * d - u * h * p,
            this._z = c * h * p + u * f * d,
            this._w = c * h * d - u * f * p;
            break;
          case "YXZ":
            this._x = u * h * d + c * f * p,
            this._y = c * f * d - u * h * p,
            this._z = c * h * p - u * f * d,
            this._w = c * h * d + u * f * p;
            break;
          case "ZXY":
            this._x = u * h * d - c * f * p,
            this._y = c * f * d + u * h * p,
            this._z = c * h * p + u * f * d,
            this._w = c * h * d - u * f * p;
            break;
          case "ZYX":
            this._x = u * h * d - c * f * p,
            this._y = c * f * d + u * h * p,
            this._z = c * h * p - u * f * d,
            this._w = c * h * d + u * f * p;
            break;
          case "YZX":
            this._x = u * h * d + c * f * p,
            this._y = c * f * d + u * h * p,
            this._z = c * h * p - u * f * d,
            this._w = c * h * d - u * f * p;
            break;
          case "XZY":
            this._x = u * h * d - c * f * p,
            this._y = c * f * d - u * h * p,
            this._z = c * h * p + u * f * d,
            this._w = c * h * d + u * f * p;
            break;
          default:
            Ht(
              "Quaternion: .setFromEuler() encountered an unknown order: " + o
            );
        }
        return e === !0 && this._onChangeCallback(), this;
      }
      setFromAxisAngle(t, e) {
        let n = e / 2,
          s = Math.sin(n);
        return (
          this._x = t.x * s,
          this._y = t.y * s,
          this._z = t.z * s,
          this._w = Math.cos(n),
          this._onChangeCallback(),
          this);

      }
      setFromRotationMatrix(t) {
        let e = t.elements,
          n = e[0],
          s = e[4],
          r = e[8],
          o = e[1],
          a = e[5],
          l = e[9],
          c = e[2],
          h = e[6],
          d = e[10],
          u = n + a + d;
        if (u > 0) {
          let f = 0.5 / Math.sqrt(u + 1);
          this._w = 0.25 / f,
          this._x = (h - l) * f,
          this._y = (r - c) * f,
          this._z = (o - s) * f;
        } else if (n > a && n > d) {
          let f = 2 * Math.sqrt(1 + n - a - d);
          this._w = (h - l) / f,
          this._x = 0.25 * f,
          this._y = (s + o) / f,
          this._z = (r + c) / f;
        } else if (a > d) {
          let f = 2 * Math.sqrt(1 + a - n - d);
          this._w = (r - c) / f,
          this._x = (s + o) / f,
          this._y = 0.25 * f,
          this._z = (l + h) / f;
        } else {
          let f = 2 * Math.sqrt(1 + d - n - a);
          this._w = (o - s) / f,
          this._x = (r + c) / f,
          this._y = (l + h) / f,
          this._z = 0.25 * f;
        }
        return this._onChangeCallback(), this;
      }
      setFromUnitVectors(t, e) {
        let n = t.dot(e) + 1;
        return (
          n < 1e-8 ? (
          n = 0,
          Math.abs(t.x) > Math.abs(t.z) ? (
          this._x = -t.y,
          this._y = t.x,
          this._z = 0,
          this._w = n) : (
          this._x = 0,
          this._y = -t.z,
          this._z = t.y,
          this._w = n)) : (
          this._x = t.y * e.z - t.z * e.y,
          this._y = t.z * e.x - t.x * e.z,
          this._z = t.x * e.y - t.y * e.x,
          this._w = n),
          this.normalize());

      }
      angleTo(t) {
        return 2 * Math.acos(Math.abs(re(this.dot(t), -1, 1)));
      }
      rotateTowards(t, e) {
        let n = this.angleTo(t);
        if (n === 0) return this;
        let s = Math.min(1, e / n);
        return this.slerp(t, s), this;
      }
      identity() {
        return this.set(0, 0, 0, 1);
      }
      invert() {
        return this.conjugate();
      }
      conjugate() {
        return (
          this._x *= -1,
          this._y *= -1,
          this._z *= -1,
          this._onChangeCallback(),
          this);

      }
      dot(t) {
        return (
          this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w);

      }
      lengthSq() {
        return (
          this._x * this._x +
          this._y * this._y +
          this._z * this._z +
          this._w * this._w);

      }
      length() {
        return Math.sqrt(
          this._x * this._x +
          this._y * this._y +
          this._z * this._z +
          this._w * this._w
        );
      }
      normalize() {
        let t = this.length();
        return (
          t === 0 ? (
          this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (
          t = 1 / t,
          this._x = this._x * t,
          this._y = this._y * t,
          this._z = this._z * t,
          this._w = this._w * t),
          this._onChangeCallback(),
          this);

      }
      multiply(t) {
        return this.multiplyQuaternions(this, t);
      }
      premultiply(t) {
        return this.multiplyQuaternions(t, this);
      }
      multiplyQuaternions(t, e) {
        let n = t._x,
          s = t._y,
          r = t._z,
          o = t._w,
          a = e._x,
          l = e._y,
          c = e._z,
          h = e._w;
        return (
          this._x = n * h + o * a + s * c - r * l,
          this._y = s * h + o * l + r * a - n * c,
          this._z = r * h + o * c + n * l - s * a,
          this._w = o * h - n * a - s * l - r * c,
          this._onChangeCallback(),
          this);

      }
      slerp(t, e) {
        let n = t._x,
          s = t._y,
          r = t._z,
          o = t._w,
          a = this.dot(t);
        a < 0 && (n = -n, s = -s, r = -r, o = -o, a = -a);
        let l = 1 - e;
        if (a < 0.9995) {
          let c = Math.acos(a),
            h = Math.sin(c);
          l = Math.sin(l * c) / h,
          e = Math.sin(e * c) / h,
          this._x = this._x * l + n * e,
          this._y = this._y * l + s * e,
          this._z = this._z * l + r * e,
          this._w = this._w * l + o * e,
          this._onChangeCallback();
        } else
        this._x = this._x * l + n * e,
        this._y = this._y * l + s * e,
        this._z = this._z * l + r * e,
        this._w = this._w * l + o * e,
        this.normalize();
        return this;
      }
      slerpQuaternions(t, e, n) {
        return this.copy(t).slerp(e, n);
      }
      random() {
        let t = 2 * Math.PI * Math.random(),
          e = 2 * Math.PI * Math.random(),
          n = Math.random(),
          s = Math.sqrt(1 - n),
          r = Math.sqrt(n);
        return this.set(
          s * Math.sin(t),
          s * Math.cos(t),
          r * Math.sin(e),
          r * Math.cos(e)
        );
      }
      equals(t) {
        return (
          t._x === this._x &&
          t._y === this._y &&
          t._z === this._z &&
          t._w === this._w);

      }
      fromArray(t, e = 0) {
        return (
          this._x = t[e],
          this._y = t[e + 1],
          this._z = t[e + 2],
          this._w = t[e + 3],
          this._onChangeCallback(),
          this);

      }
      toArray(t = [], e = 0) {
        return (
          t[e] = this._x,
          t[e + 1] = this._y,
          t[e + 2] = this._z,
          t[e + 3] = this._w,
          t);

      }
      fromBufferAttribute(t, e) {
        return (
          this._x = t.getX(e),
          this._y = t.getY(e),
          this._z = t.getZ(e),
          this._w = t.getW(e),
          this._onChangeCallback(),
          this);

      }
      toJSON() {
        return this.toArray();
      }
      _onChange(t) {
        return this._onChangeCallback = t, this;
      }
      _onChangeCallback() {}
      *[Symbol.iterator]() {
        yield this._x, yield this._y, yield this._z, yield this._w;
      }
    },
    Uu = class Uu {
      constructor(t = 0, e = 0, n = 0) {
        this.x = t, this.y = e, this.z = n;
      }
      set(t, e, n) {
        return (
          n === void 0 && (n = this.z),
          this.x = t,
          this.y = e,
          this.z = n,
          this);

      }
      setScalar(t) {
        return this.x = t, this.y = t, this.z = t, this;
      }
      setX(t) {
        return this.x = t, this;
      }
      setY(t) {
        return this.y = t, this;
      }
      setZ(t) {
        return this.z = t, this;
      }
      setComponent(t, e) {
        switch (t) {
          case 0:
            this.x = e;
            break;
          case 1:
            this.y = e;
            break;
          case 2:
            this.z = e;
            break;
          default:
            throw new Error("THREE.Vector3: index is out of range: " + t);
        }
        return this;
      }
      getComponent(t) {
        switch (t) {
          case 0:
            return this.x;
          case 1:
            return this.y;
          case 2:
            return this.z;
          default:
            throw new Error("THREE.Vector3: index is out of range: " + t);
        }
      }
      clone() {
        return new this.constructor(this.x, this.y, this.z);
      }
      copy(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this;
      }
      add(t) {
        return this.x += t.x, this.y += t.y, this.z += t.z, this;
      }
      addScalar(t) {
        return this.x += t, this.y += t, this.z += t, this;
      }
      addVectors(t, e) {
        return (
          this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this);

      }
      addScaledVector(t, e) {
        return (
          this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this);

      }
      sub(t) {
        return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
      }
      subScalar(t) {
        return this.x -= t, this.y -= t, this.z -= t, this;
      }
      subVectors(t, e) {
        return (
          this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this);

      }
      multiply(t) {
        return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
      }
      multiplyScalar(t) {
        return this.x *= t, this.y *= t, this.z *= t, this;
      }
      multiplyVectors(t, e) {
        return (
          this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this);

      }
      applyEuler(t) {
        return this.applyQuaternion(bf.setFromEuler(t));
      }
      applyAxisAngle(t, e) {
        return this.applyQuaternion(bf.setFromAxisAngle(t, e));
      }
      applyMatrix3(t) {
        let e = this.x,
          n = this.y,
          s = this.z,
          r = t.elements;
        return (
          this.x = r[0] * e + r[3] * n + r[6] * s,
          this.y = r[1] * e + r[4] * n + r[7] * s,
          this.z = r[2] * e + r[5] * n + r[8] * s,
          this);

      }
      applyNormalMatrix(t) {
        return this.applyMatrix3(t).normalize();
      }
      applyMatrix4(t) {
        let e = this.x,
          n = this.y,
          s = this.z,
          r = t.elements,
          o = 1 / (r[3] * e + r[7] * n + r[11] * s + r[15]);
        return (
          this.x = (r[0] * e + r[4] * n + r[8] * s + r[12]) * o,
          this.y = (r[1] * e + r[5] * n + r[9] * s + r[13]) * o,
          this.z = (r[2] * e + r[6] * n + r[10] * s + r[14]) * o,
          this);

      }
      applyQuaternion(t) {
        let e = this.x,
          n = this.y,
          s = this.z,
          r = t.x,
          o = t.y,
          a = t.z,
          l = t.w,
          c = 2 * (o * s - a * n),
          h = 2 * (a * e - r * s),
          d = 2 * (r * n - o * e);
        return (
          this.x = e + l * c + o * d - a * h,
          this.y = n + l * h + a * c - r * d,
          this.z = s + l * d + r * h - o * c,
          this);

      }
      project(t) {
        return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
          t.projectionMatrix
        );
      }
      unproject(t) {
        return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(
          t.matrixWorld
        );
      }
      transformDirection(t) {
        let e = this.x,
          n = this.y,
          s = this.z,
          r = t.elements;
        return (
          this.x = r[0] * e + r[4] * n + r[8] * s,
          this.y = r[1] * e + r[5] * n + r[9] * s,
          this.z = r[2] * e + r[6] * n + r[10] * s,
          this.normalize());

      }
      divide(t) {
        return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
      }
      divideScalar(t) {
        return this.multiplyScalar(1 / t);
      }
      min(t) {
        return (
          this.x = Math.min(this.x, t.x),
          this.y = Math.min(this.y, t.y),
          this.z = Math.min(this.z, t.z),
          this);

      }
      max(t) {
        return (
          this.x = Math.max(this.x, t.x),
          this.y = Math.max(this.y, t.y),
          this.z = Math.max(this.z, t.z),
          this);

      }
      clamp(t, e) {
        return (
          this.x = re(this.x, t.x, e.x),
          this.y = re(this.y, t.y, e.y),
          this.z = re(this.z, t.z, e.z),
          this);

      }
      clampScalar(t, e) {
        return (
          this.x = re(this.x, t, e),
          this.y = re(this.y, t, e),
          this.z = re(this.z, t, e),
          this);

      }
      clampLength(t, e) {
        let n = this.length();
        return this.divideScalar(n || 1).multiplyScalar(re(n, t, e));
      }
      floor() {
        return (
          this.x = Math.floor(this.x),
          this.y = Math.floor(this.y),
          this.z = Math.floor(this.z),
          this);

      }
      ceil() {
        return (
          this.x = Math.ceil(this.x),
          this.y = Math.ceil(this.y),
          this.z = Math.ceil(this.z),
          this);

      }
      round() {
        return (
          this.x = Math.round(this.x),
          this.y = Math.round(this.y),
          this.z = Math.round(this.z),
          this);

      }
      roundToZero() {
        return (
          this.x = Math.trunc(this.x),
          this.y = Math.trunc(this.y),
          this.z = Math.trunc(this.z),
          this);

      }
      negate() {
        return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
      }
      dot(t) {
        return this.x * t.x + this.y * t.y + this.z * t.z;
      }
      lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      }
      length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }
      manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
      }
      normalize() {
        return this.divideScalar(this.length() || 1);
      }
      setLength(t) {
        return this.normalize().multiplyScalar(t);
      }
      lerp(t, e) {
        return (
          this.x += (t.x - this.x) * e,
          this.y += (t.y - this.y) * e,
          this.z += (t.z - this.z) * e,
          this);

      }
      lerpVectors(t, e, n) {
        return (
          this.x = t.x + (e.x - t.x) * n,
          this.y = t.y + (e.y - t.y) * n,
          this.z = t.z + (e.z - t.z) * n,
          this);

      }
      cross(t) {
        return this.crossVectors(this, t);
      }
      crossVectors(t, e) {
        let n = t.x,
          s = t.y,
          r = t.z,
          o = e.x,
          a = e.y,
          l = e.z;
        return (
          this.x = s * l - r * a,
          this.y = r * o - n * l,
          this.z = n * a - s * o,
          this);

      }
      projectOnVector(t) {
        let e = t.lengthSq();
        if (e === 0) return this.set(0, 0, 0);
        let n = t.dot(this) / e;
        return this.copy(t).multiplyScalar(n);
      }
      projectOnPlane(t) {
        return Ih.copy(this).projectOnVector(t), this.sub(Ih);
      }
      reflect(t) {
        return this.sub(Ih.copy(t).multiplyScalar(2 * this.dot(t)));
      }
      angleTo(t) {
        let e = Math.sqrt(this.lengthSq() * t.lengthSq());
        if (e === 0) return Math.PI / 2;
        let n = this.dot(t) / e;
        return Math.acos(re(n, -1, 1));
      }
      distanceTo(t) {
        return Math.sqrt(this.distanceToSquared(t));
      }
      distanceToSquared(t) {
        let e = this.x - t.x,
          n = this.y - t.y,
          s = this.z - t.z;
        return e * e + n * n + s * s;
      }
      manhattanDistanceTo(t) {
        return (
          Math.abs(this.x - t.x) +
          Math.abs(this.y - t.y) +
          Math.abs(this.z - t.z));

      }
      setFromSpherical(t) {
        return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
      }
      setFromSphericalCoords(t, e, n) {
        let s = Math.sin(e) * t;
        return (
          this.x = s * Math.sin(n),
          this.y = Math.cos(e) * t,
          this.z = s * Math.cos(n),
          this);

      }
      setFromCylindrical(t) {
        return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
      }
      setFromCylindricalCoords(t, e, n) {
        return (
          this.x = t * Math.sin(e),
          this.y = n,
          this.z = t * Math.cos(e),
          this);

      }
      setFromMatrixPosition(t) {
        let e = t.elements;
        return this.x = e[12], this.y = e[13], this.z = e[14], this;
      }
      setFromMatrixScale(t) {
        let e = this.setFromMatrixColumn(t, 0).length(),
          n = this.setFromMatrixColumn(t, 1).length(),
          s = this.setFromMatrixColumn(t, 2).length();
        return this.x = e, this.y = n, this.z = s, this;
      }
      setFromMatrixColumn(t, e) {
        return this.fromArray(t.elements, e * 4);
      }
      setFromMatrix3Column(t, e) {
        return this.fromArray(t.elements, e * 3);
      }
      setFromEuler(t) {
        return this.x = t._x, this.y = t._y, this.z = t._z, this;
      }
      setFromColor(t) {
        return this.x = t.r, this.y = t.g, this.z = t.b, this;
      }
      equals(t) {
        return t.x === this.x && t.y === this.y && t.z === this.z;
      }
      fromArray(t, e = 0) {
        return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
      }
      toArray(t = [], e = 0) {
        return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
      }
      fromBufferAttribute(t, e) {
        return (
          this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this);

      }
      random() {
        return (
          this.x = Math.random(),
          this.y = Math.random(),
          this.z = Math.random(),
          this);

      }
      randomDirection() {
        let t = Math.random() * Math.PI * 2,
          e = Math.random() * 2 - 1,
          n = Math.sqrt(1 - e * e);
        return (
          this.x = n * Math.cos(t),
          this.y = e,
          this.z = n * Math.sin(t),
          this);

      }
      *[Symbol.iterator]() {
        yield this.x, yield this.y, yield this.z;
      }
    };
  Uu.prototype.isVector3 = !0;
  var z = Uu,
    Ih = new z(),
    bf = new mn(),
    Fu = class Fu {
      constructor(t, e, n, s, r, o, a, l, c) {
        this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1],
        t !== void 0 && this.set(t, e, n, s, r, o, a, l, c);
      }
      set(t, e, n, s, r, o, a, l, c) {
        let h = this.elements;
        return (
          h[0] = t,
          h[1] = s,
          h[2] = a,
          h[3] = e,
          h[4] = r,
          h[5] = l,
          h[6] = n,
          h[7] = o,
          h[8] = c,
          this);

      }
      identity() {
        return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
      }
      copy(t) {
        let e = this.elements,
          n = t.elements;
        return (
          e[0] = n[0],
          e[1] = n[1],
          e[2] = n[2],
          e[3] = n[3],
          e[4] = n[4],
          e[5] = n[5],
          e[6] = n[6],
          e[7] = n[7],
          e[8] = n[8],
          this);

      }
      extractBasis(t, e, n) {
        return (
          t.setFromMatrix3Column(this, 0),
          e.setFromMatrix3Column(this, 1),
          n.setFromMatrix3Column(this, 2),
          this);

      }
      setFromMatrix4(t) {
        let e = t.elements;
        return (
          this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]), this);

      }
      multiply(t) {
        return this.multiplyMatrices(this, t);
      }
      premultiply(t) {
        return this.multiplyMatrices(t, this);
      }
      multiplyMatrices(t, e) {
        let n = t.elements,
          s = e.elements,
          r = this.elements,
          o = n[0],
          a = n[3],
          l = n[6],
          c = n[1],
          h = n[4],
          d = n[7],
          u = n[2],
          f = n[5],
          p = n[8],
          x = s[0],
          g = s[3],
          m = s[6],
          b = s[1],
          T = s[4],
          y = s[7],
          S = s[2],
          M = s[5],
          A = s[8];
        return (
          r[0] = o * x + a * b + l * S,
          r[3] = o * g + a * T + l * M,
          r[6] = o * m + a * y + l * A,
          r[1] = c * x + h * b + d * S,
          r[4] = c * g + h * T + d * M,
          r[7] = c * m + h * y + d * A,
          r[2] = u * x + f * b + p * S,
          r[5] = u * g + f * T + p * M,
          r[8] = u * m + f * y + p * A,
          this);

      }
      multiplyScalar(t) {
        let e = this.elements;
        return (
          e[0] *= t,
          e[3] *= t,
          e[6] *= t,
          e[1] *= t,
          e[4] *= t,
          e[7] *= t,
          e[2] *= t,
          e[5] *= t,
          e[8] *= t,
          this);

      }
      determinant() {
        let t = this.elements,
          e = t[0],
          n = t[1],
          s = t[2],
          r = t[3],
          o = t[4],
          a = t[5],
          l = t[6],
          c = t[7],
          h = t[8];
        return (
          e * o * h - e * a * c - n * r * h + n * a * l + s * r * c - s * o * l);

      }
      invert() {
        let t = this.elements,
          e = t[0],
          n = t[1],
          s = t[2],
          r = t[3],
          o = t[4],
          a = t[5],
          l = t[6],
          c = t[7],
          h = t[8],
          d = h * o - a * c,
          u = a * l - h * r,
          f = c * r - o * l,
          p = e * d + n * u + s * f;
        if (p === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        let x = 1 / p;
        return (
          t[0] = d * x,
          t[1] = (s * c - h * n) * x,
          t[2] = (a * n - s * o) * x,
          t[3] = u * x,
          t[4] = (h * e - s * l) * x,
          t[5] = (s * r - a * e) * x,
          t[6] = f * x,
          t[7] = (n * l - c * e) * x,
          t[8] = (o * e - n * r) * x,
          this);

      }
      transpose() {
        let t,
          e = this.elements;
        return (
          t = e[1],
          e[1] = e[3],
          e[3] = t,
          t = e[2],
          e[2] = e[6],
          e[6] = t,
          t = e[5],
          e[5] = e[7],
          e[7] = t,
          this);

      }
      getNormalMatrix(t) {
        return this.setFromMatrix4(t).invert().transpose();
      }
      transposeIntoArray(t) {
        let e = this.elements;
        return (
          t[0] = e[0],
          t[1] = e[3],
          t[2] = e[6],
          t[3] = e[1],
          t[4] = e[4],
          t[5] = e[7],
          t[6] = e[2],
          t[7] = e[5],
          t[8] = e[8],
          this);

      }
      setUvTransform(t, e, n, s, r, o, a) {
        let l = Math.cos(r),
          c = Math.sin(r);
        return (
          this.set(
            n * l,
            n * c,
            -n * (l * o + c * a) + o + t,
            -s * c,
            s * l,
            -s * (-c * o + l * a) + a + e,
            0,
            0,
            1
          ),
          this);

      }
      scale(t, e) {
        return (
          Ss("Matrix3: .scale() is deprecated. Use .makeScale() instead."),
          this.premultiply(Ph.makeScale(t, e)),
          this);

      }
      rotate(t) {
        return (
          Ss("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),
          this.premultiply(Ph.makeRotation(-t)),
          this);

      }
      translate(t, e) {
        return (
          Ss(
            "Matrix3: .translate() is deprecated. Use .makeTranslation() instead."
          ),
          this.premultiply(Ph.makeTranslation(t, e)),
          this);

      }
      makeTranslation(t, e) {
        return (
          t.isVector2 ?
          this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1) :
          this.set(1, 0, t, 0, 1, e, 0, 0, 1),
          this);

      }
      makeRotation(t) {
        let e = Math.cos(t),
          n = Math.sin(t);
        return this.set(e, -n, 0, n, e, 0, 0, 0, 1), this;
      }
      makeScale(t, e) {
        return this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this;
      }
      equals(t) {
        let e = this.elements,
          n = t.elements;
        for (let s = 0; s < 9; s++) if (e[s] !== n[s]) return !1;
        return !0;
      }
      fromArray(t, e = 0) {
        for (let n = 0; n < 9; n++) this.elements[n] = t[n + e];
        return this;
      }
      toArray(t = [], e = 0) {
        let n = this.elements;
        return (
          t[e] = n[0],
          t[e + 1] = n[1],
          t[e + 2] = n[2],
          t[e + 3] = n[3],
          t[e + 4] = n[4],
          t[e + 5] = n[5],
          t[e + 6] = n[6],
          t[e + 7] = n[7],
          t[e + 8] = n[8],
          t);

      }
      clone() {
        return new this.constructor().fromArray(this.elements);
      }
    };
  Fu.prototype.isMatrix3 = !0;
  var Wt = Fu,
    Ph = new Wt(),
    Mf = new Wt().set(
      0.4123908,
      0.3575843,
      0.1804808,
      0.212639,
      0.7151687,
      0.0721923,
      0.0193308,
      0.1191948,
      0.9505322
    ),
    Sf = new Wt().set(
      3.2409699,
      -1.5373832,
      -0.4986108,
      -0.9692436,
      1.8759675,
      0.0415551,
      0.0556301,
      -0.203977,
      1.0569715
    );
  function Mg() {
    let i = {
        enabled: !0,
        workingColorSpace: vo,
        spaces: {},
        convert: function (s, r, o) {
          return (
            this.enabled === !1 ||
            r === o ||
            !r ||
            !o || (
            this.spaces[r].transfer === me && (
            s.r = Ci(s.r), s.g = Ci(s.g), s.b = Ci(s.b)),
            this.spaces[r].primaries !== this.spaces[o].primaries && (
            s.applyMatrix3(this.spaces[r].toXYZ),
            s.applyMatrix3(this.spaces[o].fromXYZ)),
            this.spaces[o].transfer === me && (
            s.r = fr(s.r), s.g = fr(s.g), s.b = fr(s.b))),
            s);

        },
        workingToColorSpace: function (s, r) {
          return this.convert(s, this.workingColorSpace, r);
        },
        colorSpaceToWorking: function (s, r) {
          return this.convert(s, r, this.workingColorSpace);
        },
        getPrimaries: function (s) {
          return this.spaces[s].primaries;
        },
        getTransfer: function (s) {
          return s === Pi ? _o : this.spaces[s].transfer;
        },
        getToneMappingMode: function (s) {
          return (
            this.spaces[s].outputColorSpaceConfig.toneMappingMode || "standard");

        },
        getLuminanceCoefficients: function (s, r = this.workingColorSpace) {
          return s.fromArray(this.spaces[r].luminanceCoefficients);
        },
        define: function (s) {
          Object.assign(this.spaces, s);
        },
        _getMatrix: function (s, r, o) {
          return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ);
        },
        _getDrawingBufferColorSpace: function (s) {
          return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace;
        },
        _getUnpackColorSpace: function (s = this.workingColorSpace) {
          return this.spaces[s].workingColorSpaceConfig.unpackColorSpace;
        },
        fromWorkingColorSpace: function (s, r) {
          return (
            Ss(
              "ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."
            ),
            i.workingToColorSpace(s, r));

        },
        toWorkingColorSpace: function (s, r) {
          return (
            Ss(
              "ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."
            ),
            i.colorSpaceToWorking(s, r));

        }
      },
      t = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
      e = [0.2126, 0.7152, 0.0722],
      n = [0.3127, 0.329];
    return (
      i.define({
        [vo]: {
          primaries: t,
          whitePoint: n,
          transfer: _o,
          toXYZ: Mf,
          fromXYZ: Sf,
          luminanceCoefficients: e,
          workingColorSpaceConfig: { unpackColorSpace: rn },
          outputColorSpaceConfig: { drawingBufferColorSpace: rn }
        },
        [rn]: {
          primaries: t,
          whitePoint: n,
          transfer: me,
          toXYZ: Mf,
          fromXYZ: Sf,
          luminanceCoefficients: e,
          outputColorSpaceConfig: { drawingBufferColorSpace: rn }
        }
      }),
      i);

  }
  var ie = Mg();
  function Ci(i) {
    return i < 0.04045 ?
    i * 0.0773993808 :
    Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
  }
  function fr(i) {
    return i < 0.0031308 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
  }
  var Zs,
    gl = class {
      static getDataURL(t, e = "image/png") {
        if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u")
        return t.src;
        let n;
        if (t instanceof HTMLCanvasElement) n = t;else
        {
          Zs === void 0 && (Zs = bo("canvas")),
          Zs.width = t.width,
          Zs.height = t.height;
          let s = Zs.getContext("2d");
          t instanceof ImageData ?
          s.putImageData(t, 0, 0) :
          s.drawImage(t, 0, 0, t.width, t.height),
          n = Zs;
        }
        return n.toDataURL(e);
      }
      static sRGBToLinear(t) {
        if (
        typeof HTMLImageElement < "u" && t instanceof HTMLImageElement ||
        typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement ||
        typeof ImageBitmap < "u" && t instanceof ImageBitmap)
        {
          let e = bo("canvas");
          e.width = t.width, e.height = t.height;
          let n = e.getContext("2d");
          n.drawImage(t, 0, 0, t.width, t.height);
          let s = n.getImageData(0, 0, t.width, t.height),
            r = s.data;
          for (let o = 0; o < r.length; o++) r[o] = Ci(r[o] / 255) * 255;
          return n.putImageData(s, 0, 0), e;
        } else if (t.data) {
          let e = t.data.slice(0);
          for (let n = 0; n < e.length; n++)
          e instanceof Uint8Array || e instanceof Uint8ClampedArray ?
          e[n] = Math.floor(Ci(e[n] / 255) * 255) :
          e[n] = Ci(e[n]);
          return { data: e, width: t.width, height: t.height };
        } else
        return (
          Ht(
            "ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."
          ),
          t);

      }
    },
    Sg = 0,
    xr = class {
      constructor(t = null) {
        this.isTextureSource = !0,
        Object.defineProperty(this, "id", { value: Sg++ }),
        this.uuid = ji(),
        this.data = t,
        this.dataReady = !0,
        this.version = 0;
      }
      getSize(t) {
        let e = this.data;
        return (
          typeof HTMLVideoElement < "u" && e instanceof HTMLVideoElement ?
          t.set(e.videoWidth, e.videoHeight, 0) :
          typeof VideoFrame < "u" && e instanceof VideoFrame ?
          t.set(e.displayWidth, e.displayHeight, 0) :
          e !== null ?
          t.set(e.width, e.height, e.depth || 0) :
          t.set(0, 0, 0),
          t);

      }
      set needsUpdate(t) {
        t === !0 && this.version++;
      }
      toJSON(t) {
        let e = t === void 0 || typeof t == "string";
        if (!e && t.images[this.uuid] !== void 0) return t.images[this.uuid];
        let n = { uuid: this.uuid, url: "" },
          s = this.data;
        if (s !== null) {
          let r;
          if (Array.isArray(s)) {
            r = [];
            for (let o = 0, a = s.length; o < a; o++)
            s[o].isDataTexture ? r.push(Lh(s[o].image)) : r.push(Lh(s[o]));
          } else r = Lh(s);
          n.url = r;
        }
        return e || (t.images[this.uuid] = n), n;
      }
    };
  function Lh(i) {
    return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement ||
    typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement ||
    typeof ImageBitmap < "u" && i instanceof ImageBitmap ?
    gl.getDataURL(i) :
    i.data ?
    {
      data: Array.from(i.data),
      width: i.width,
      height: i.height,
      type: i.data.constructor.name
    } : (
    Ht("Texture: Unable to serialize Texture."), {});
  }
  var wg = 0,
    Dh = new z(),
    _n = class i extends di {
      constructor(
      t = i.DEFAULT_IMAGE,
      e = i.DEFAULT_MAPPING,
      n = hi,
      s = hi,
      r = cn,
      o = rs,
      a = On,
      l = Tn,
      c = i.DEFAULT_ANISOTROPY,
      h = Pi)
      {
        super(),
        this.isTexture = !0,
        Object.defineProperty(this, "id", { value: wg++ }),
        this.uuid = ji(),
        this.name = "",
        this.source = new xr(t),
        this.mipmaps = [],
        this.mapping = e,
        this.channel = 0,
        this.wrapS = n,
        this.wrapT = s,
        this.magFilter = r,
        this.minFilter = o,
        this.anisotropy = c,
        this.format = a,
        this.internalFormat = null,
        this.type = l,
        this.offset = new Vt(0, 0),
        this.repeat = new Vt(1, 1),
        this.center = new Vt(0, 0),
        this.rotation = 0,
        this.matrixAutoUpdate = !0,
        this.matrix = new Wt(),
        this.generateMipmaps = !0,
        this.premultiplyAlpha = !1,
        this.flipY = !0,
        this.unpackAlignment = 4,
        this.colorSpace = h,
        this.userData = {},
        this.updateRanges = [],
        this.version = 0,
        this.onUpdate = null,
        this.renderTarget = null,
        this.isRenderTargetTexture = !1,
        this.isArrayTexture = !!(t && t.depth && t.depth > 1),
        this.pmremVersion = 0,
        this.normalized = !1;
      }
      get width() {
        return this.source.getSize(Dh).x;
      }
      get height() {
        return this.source.getSize(Dh).y;
      }
      get depth() {
        return this.source.getSize(Dh).z;
      }
      get image() {
        return this.source.data;
      }
      set image(t) {
        this.source.data = t;
      }
      updateMatrix() {
        this.matrix.setUvTransform(
          this.offset.x,
          this.offset.y,
          this.repeat.x,
          this.repeat.y,
          this.rotation,
          this.center.x,
          this.center.y
        );
      }
      addUpdateRange(t, e) {
        this.updateRanges.push({ start: t, count: e });
      }
      clearUpdateRanges() {
        this.updateRanges.length = 0;
      }
      clone() {
        return new this.constructor().copy(this);
      }
      copy(t) {
        return (
          this.name = t.name,
          this.source = t.source,
          this.mipmaps = t.mipmaps.slice(0),
          this.mapping = t.mapping,
          this.channel = t.channel,
          this.wrapS = t.wrapS,
          this.wrapT = t.wrapT,
          this.magFilter = t.magFilter,
          this.minFilter = t.minFilter,
          this.anisotropy = t.anisotropy,
          this.format = t.format,
          this.internalFormat = t.internalFormat,
          this.type = t.type,
          this.normalized = t.normalized,
          this.offset.copy(t.offset),
          this.repeat.copy(t.repeat),
          this.center.copy(t.center),
          this.rotation = t.rotation,
          this.matrixAutoUpdate = t.matrixAutoUpdate,
          this.matrix.copy(t.matrix),
          this.generateMipmaps = t.generateMipmaps,
          this.premultiplyAlpha = t.premultiplyAlpha,
          this.flipY = t.flipY,
          this.unpackAlignment = t.unpackAlignment,
          this.colorSpace = t.colorSpace,
          this.renderTarget = t.renderTarget,
          this.isRenderTargetTexture = t.isRenderTargetTexture,
          this.isArrayTexture = t.isArrayTexture,
          this.userData = JSON.parse(JSON.stringify(t.userData)),
          this.needsUpdate = !0,
          this);

      }
      setValues(t) {
        for (let e in t) {
          let n = t[e];
          if (n === void 0) {
            Ht(`Texture.setValues(): parameter '${e}' has value of undefined.`);
            continue;
          }
          let s = this[e];
          if (s === void 0) {
            Ht(`Texture.setValues(): property '${e}' does not exist.`);
            continue;
          }
          s && n && s.isVector2 && n.isVector2 ||
          s && n && s.isVector3 && n.isVector3 ||
          s && n && s.isMatrix3 && n.isMatrix3 ?
          s.copy(n) :
          this[e] = n;
        }
      }
      toJSON(t) {
        let e = t === void 0 || typeof t == "string";
        if (!e && t.textures[this.uuid] !== void 0)
        return t.textures[this.uuid];
        let n = {
          metadata: {
            version: 4.7,
            type: "Texture",
            generator: "Texture.toJSON"
          },
          uuid: this.uuid,
          name: this.name,
          image: this.source.toJSON(t).uuid,
          mapping: this.mapping,
          channel: this.channel,
          repeat: [this.repeat.x, this.repeat.y],
          offset: [this.offset.x, this.offset.y],
          center: [this.center.x, this.center.y],
          rotation: this.rotation,
          wrap: [this.wrapS, this.wrapT],
          format: this.format,
          internalFormat: this.internalFormat,
          type: this.type,
          normalized: this.normalized,
          colorSpace: this.colorSpace,
          minFilter: this.minFilter,
          magFilter: this.magFilter,
          anisotropy: this.anisotropy,
          flipY: this.flipY,
          generateMipmaps: this.generateMipmaps,
          premultiplyAlpha: this.premultiplyAlpha,
          unpackAlignment: this.unpackAlignment
        };
        return (
          Object.keys(this.userData).length > 0 && (n.userData = this.userData),
          e || (t.textures[this.uuid] = n),
          n);

      }
      dispose() {
        this.dispatchEvent({ type: "dispose" });
      }
      transformUv(t) {
        if (this.mapping !== Su) return t;
        if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1)
        switch (this.wrapS) {
          case dl:
            t.x = t.x - Math.floor(t.x);
            break;
          case hi:
            t.x = t.x < 0 ? 0 : 1;
            break;
          case fl:
            Math.abs(Math.floor(t.x) % 2) === 1 ?
            t.x = Math.ceil(t.x) - t.x :
            t.x = t.x - Math.floor(t.x);
            break;
        }
        if (t.y < 0 || t.y > 1)
        switch (this.wrapT) {
          case dl:
            t.y = t.y - Math.floor(t.y);
            break;
          case hi:
            t.y = t.y < 0 ? 0 : 1;
            break;
          case fl:
            Math.abs(Math.floor(t.y) % 2) === 1 ?
            t.y = Math.ceil(t.y) - t.y :
            t.y = t.y - Math.floor(t.y);
            break;
        }
        return this.flipY && (t.y = 1 - t.y), t;
      }
      set needsUpdate(t) {
        t === !0 && (this.version++, this.source.needsUpdate = !0);
      }
      set needsPMREMUpdate(t) {
        t === !0 && this.pmremVersion++;
      }
    };
  _n.DEFAULT_IMAGE = null;
  _n.DEFAULT_MAPPING = Su;
  _n.DEFAULT_ANISOTROPY = 1;
  var Ou = class Ou {
    constructor(t = 0, e = 0, n = 0, s = 1) {
      this.x = t, this.y = e, this.z = n, this.w = s;
    }
    get width() {
      return this.z;
    }
    set width(t) {
      this.z = t;
    }
    get height() {
      return this.w;
    }
    set height(t) {
      this.w = t;
    }
    set(t, e, n, s) {
      return this.x = t, this.y = e, this.z = n, this.w = s, this;
    }
    setScalar(t) {
      return this.x = t, this.y = t, this.z = t, this.w = t, this;
    }
    setX(t) {
      return this.x = t, this;
    }
    setY(t) {
      return this.y = t, this;
    }
    setZ(t) {
      return this.z = t, this;
    }
    setW(t) {
      return this.w = t, this;
    }
    setComponent(t, e) {
      switch (t) {
        case 0:
          this.x = e;
          break;
        case 1:
          this.y = e;
          break;
        case 2:
          this.z = e;
          break;
        case 3:
          this.w = e;
          break;
        default:
          throw new Error("THREE.Vector4: index is out of range: " + t);
      }
      return this;
    }
    getComponent(t) {
      switch (t) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw new Error("THREE.Vector4: index is out of range: " + t);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(t) {
      return (
        this.x = t.x,
        this.y = t.y,
        this.z = t.z,
        this.w = t.w !== void 0 ? t.w : 1,
        this);

    }
    add(t) {
      return (
        this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this);

    }
    addScalar(t) {
      return this.x += t, this.y += t, this.z += t, this.w += t, this;
    }
    addVectors(t, e) {
      return (
        this.x = t.x + e.x,
        this.y = t.y + e.y,
        this.z = t.z + e.z,
        this.w = t.w + e.w,
        this);

    }
    addScaledVector(t, e) {
      return (
        this.x += t.x * e,
        this.y += t.y * e,
        this.z += t.z * e,
        this.w += t.w * e,
        this);

    }
    sub(t) {
      return (
        this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this);

    }
    subScalar(t) {
      return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
    }
    subVectors(t, e) {
      return (
        this.x = t.x - e.x,
        this.y = t.y - e.y,
        this.z = t.z - e.z,
        this.w = t.w - e.w,
        this);

    }
    multiply(t) {
      return (
        this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this);

    }
    multiplyScalar(t) {
      return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
    }
    applyMatrix4(t) {
      let e = this.x,
        n = this.y,
        s = this.z,
        r = this.w,
        o = t.elements;
      return (
        this.x = o[0] * e + o[4] * n + o[8] * s + o[12] * r,
        this.y = o[1] * e + o[5] * n + o[9] * s + o[13] * r,
        this.z = o[2] * e + o[6] * n + o[10] * s + o[14] * r,
        this.w = o[3] * e + o[7] * n + o[11] * s + o[15] * r,
        this);

    }
    divide(t) {
      return (
        this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w, this);

    }
    divideScalar(t) {
      return this.multiplyScalar(1 / t);
    }
    setAxisAngleFromQuaternion(t) {
      this.w = 2 * Math.acos(t.w);
      let e = Math.sqrt(1 - t.w * t.w);
      return (
        e < 1e-4 ? (
        this.x = 1, this.y = 0, this.z = 0) : (
        this.x = t.x / e, this.y = t.y / e, this.z = t.z / e),
        this);

    }
    setAxisAngleFromRotationMatrix(t) {
      let e,
        n,
        s,
        r,
        l = t.elements,
        c = l[0],
        h = l[4],
        d = l[8],
        u = l[1],
        f = l[5],
        p = l[9],
        x = l[2],
        g = l[6],
        m = l[10];
      if (
      Math.abs(h - u) < 0.01 &&
      Math.abs(d - x) < 0.01 &&
      Math.abs(p - g) < 0.01)
      {
        if (
        Math.abs(h + u) < 0.1 &&
        Math.abs(d + x) < 0.1 &&
        Math.abs(p + g) < 0.1 &&
        Math.abs(c + f + m - 3) < 0.1)

        return this.set(1, 0, 0, 0), this;
        e = Math.PI;
        let T = (c + 1) / 2,
          y = (f + 1) / 2,
          S = (m + 1) / 2,
          M = (h + u) / 4,
          A = (d + x) / 4,
          v = (p + g) / 4;
        return (
          T > y && T > S ?
          T < 0.01 ? (
          n = 0, s = 0.707106781, r = 0.707106781) : (
          n = Math.sqrt(T), s = M / n, r = A / n) :
          y > S ?
          y < 0.01 ? (
          n = 0.707106781, s = 0, r = 0.707106781) : (
          s = Math.sqrt(y), n = M / s, r = v / s) :
          S < 0.01 ? (
          n = 0.707106781, s = 0.707106781, r = 0) : (
          r = Math.sqrt(S), n = A / r, s = v / r),
          this.set(n, s, r, e),
          this);

      }
      let b = Math.sqrt(
        (g - p) * (g - p) + (d - x) * (d - x) + (u - h) * (u - h)
      );
      return (
        Math.abs(b) < 0.001 && (b = 1),
        this.x = (g - p) / b,
        this.y = (d - x) / b,
        this.z = (u - h) / b,
        this.w = Math.acos((c + f + m - 1) / 2),
        this);

    }
    setFromMatrixPosition(t) {
      let e = t.elements;
      return (
        this.x = e[12],
        this.y = e[13],
        this.z = e[14],
        this.w = e[15],
        this);

    }
    min(t) {
      return (
        this.x = Math.min(this.x, t.x),
        this.y = Math.min(this.y, t.y),
        this.z = Math.min(this.z, t.z),
        this.w = Math.min(this.w, t.w),
        this);

    }
    max(t) {
      return (
        this.x = Math.max(this.x, t.x),
        this.y = Math.max(this.y, t.y),
        this.z = Math.max(this.z, t.z),
        this.w = Math.max(this.w, t.w),
        this);

    }
    clamp(t, e) {
      return (
        this.x = re(this.x, t.x, e.x),
        this.y = re(this.y, t.y, e.y),
        this.z = re(this.z, t.z, e.z),
        this.w = re(this.w, t.w, e.w),
        this);

    }
    clampScalar(t, e) {
      return (
        this.x = re(this.x, t, e),
        this.y = re(this.y, t, e),
        this.z = re(this.z, t, e),
        this.w = re(this.w, t, e),
        this);

    }
    clampLength(t, e) {
      let n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(re(n, t, e));
    }
    floor() {
      return (
        this.x = Math.floor(this.x),
        this.y = Math.floor(this.y),
        this.z = Math.floor(this.z),
        this.w = Math.floor(this.w),
        this);

    }
    ceil() {
      return (
        this.x = Math.ceil(this.x),
        this.y = Math.ceil(this.y),
        this.z = Math.ceil(this.z),
        this.w = Math.ceil(this.w),
        this);

    }
    round() {
      return (
        this.x = Math.round(this.x),
        this.y = Math.round(this.y),
        this.z = Math.round(this.z),
        this.w = Math.round(this.w),
        this);

    }
    roundToZero() {
      return (
        this.x = Math.trunc(this.x),
        this.y = Math.trunc(this.y),
        this.z = Math.trunc(this.z),
        this.w = Math.trunc(this.w),
        this);

    }
    negate() {
      return (
        this.x = -this.x,
        this.y = -this.y,
        this.z = -this.z,
        this.w = -this.w,
        this);

    }
    dot(t) {
      return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
    }
    lengthSq() {
      return (
        this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

    }
    length() {
      return Math.sqrt(
        this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
      );
    }
    manhattanLength() {
      return (
        Math.abs(this.x) +
        Math.abs(this.y) +
        Math.abs(this.z) +
        Math.abs(this.w));

    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(t) {
      return this.normalize().multiplyScalar(t);
    }
    lerp(t, e) {
      return (
        this.x += (t.x - this.x) * e,
        this.y += (t.y - this.y) * e,
        this.z += (t.z - this.z) * e,
        this.w += (t.w - this.w) * e,
        this);

    }
    lerpVectors(t, e, n) {
      return (
        this.x = t.x + (e.x - t.x) * n,
        this.y = t.y + (e.y - t.y) * n,
        this.z = t.z + (e.z - t.z) * n,
        this.w = t.w + (e.w - t.w) * n,
        this);

    }
    equals(t) {
      return (
        t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w);

    }
    fromArray(t, e = 0) {
      return (
        this.x = t[e],
        this.y = t[e + 1],
        this.z = t[e + 2],
        this.w = t[e + 3],
        this);

    }
    toArray(t = [], e = 0) {
      return (
        t[e] = this.x,
        t[e + 1] = this.y,
        t[e + 2] = this.z,
        t[e + 3] = this.w,
        t);

    }
    fromBufferAttribute(t, e) {
      return (
        this.x = t.getX(e),
        this.y = t.getY(e),
        this.z = t.getZ(e),
        this.w = t.getW(e),
        this);

    }
    random() {
      return (
        this.x = Math.random(),
        this.y = Math.random(),
        this.z = Math.random(),
        this.w = Math.random(),
        this);

    }
    *[Symbol.iterator]() {
      yield this.x, yield this.y, yield this.z, yield this.w;
    }
  };
  Ou.prototype.isVector4 = !0;
  var De = Ou,
    xl = class extends di {
      constructor(t = 1, e = 1, n = {}) {
        super(),
        n = Object.assign(
          {
            generateMipmaps: !1,
            internalFormat: null,
            minFilter: cn,
            depthBuffer: !0,
            stencilBuffer: !1,
            resolveColorBuffer: !0,
            resolveDepthBuffer: !0,
            resolveStencilBuffer: !0,
            storeMultisampledColorBuffer: !0,
            storeMultisampledDepthBuffer: !0,
            storeMultisampledStencilBuffer: !0,
            depthTexture: null,
            samples: 0,
            count: 1,
            depth: 1,
            multiview: !1,
            useArrayDepthTexture: !1
          },
          n
        ),
        this.isRenderTarget = !0,
        this.width = t,
        this.height = e,
        this.depth = n.depth,
        this.scissor = new De(0, 0, t, e),
        this.scissorTest = !1,
        this.viewport = new De(0, 0, t, e),
        this.textures = [];
        let s = { width: t, height: e, depth: n.depth },
          r = new _n(s),
          o = n.count;
        for (let a = 0; a < o; a++)
        this.textures[a] = r.clone(),
        this.textures[a].isRenderTargetTexture = !0,
        this.textures[a].renderTarget = this;
        this._setTextureOptions(n),
        this.depthBuffer = n.depthBuffer,
        this.stencilBuffer = n.stencilBuffer,
        this.resolveColorBuffer = n.resolveColorBuffer,
        this.resolveDepthBuffer = n.resolveDepthBuffer,
        this.resolveStencilBuffer = n.resolveStencilBuffer,
        this.storeMultisampledColorBuffer = n.storeMultisampledColorBuffer,
        this.storeMultisampledDepthBuffer = n.storeMultisampledDepthBuffer,
        this.storeMultisampledStencilBuffer =
        n.storeMultisampledStencilBuffer,
        this._depthTexture = null,
        this.depthTexture = n.depthTexture,
        this.samples = n.samples,
        this.multiview = n.multiview,
        this.useArrayDepthTexture = n.useArrayDepthTexture;
      }
      _setTextureOptions(t = {}) {
        let e = {
          minFilter: cn,
          generateMipmaps: !1,
          flipY: !1,
          internalFormat: null
        };
        t.mapping !== void 0 && (e.mapping = t.mapping),
        t.wrapS !== void 0 && (e.wrapS = t.wrapS),
        t.wrapT !== void 0 && (e.wrapT = t.wrapT),
        t.wrapR !== void 0 && (e.wrapR = t.wrapR),
        t.magFilter !== void 0 && (e.magFilter = t.magFilter),
        t.minFilter !== void 0 && (e.minFilter = t.minFilter),
        t.format !== void 0 && (e.format = t.format),
        t.type !== void 0 && (e.type = t.type),
        t.anisotropy !== void 0 && (e.anisotropy = t.anisotropy),
        t.colorSpace !== void 0 && (e.colorSpace = t.colorSpace),
        t.flipY !== void 0 && (e.flipY = t.flipY),
        t.generateMipmaps !== void 0 && (
        e.generateMipmaps = t.generateMipmaps),
        t.internalFormat !== void 0 && (e.internalFormat = t.internalFormat);
        for (let n = 0; n < this.textures.length; n++)
        this.textures[n].setValues(e);
      }
      get texture() {
        return this.textures[0];
      }
      set texture(t) {
        this.textures[0] = t;
      }
      set depthTexture(t) {
        this._depthTexture !== null &&
        this._depthTexture.renderTarget === this && (
        this._depthTexture.renderTarget = null),
        t !== null && t.renderTarget === null && (t.renderTarget = this),
        this._depthTexture = t;
      }
      get depthTexture() {
        return this._depthTexture;
      }
      setSize(t, e, n = 1) {
        if (this.width !== t || this.height !== e || this.depth !== n) {
          this.width = t, this.height = e, this.depth = n;
          for (let s = 0, r = this.textures.length; s < r; s++)
          this.textures[s].image.width = t,
          this.textures[s].image.height = e,
          this.textures[s].image.depth = n,
          this.textures[s].isData3DTexture !== !0 && (
          this.textures[s].isArrayTexture =
          this.textures[s].image.depth > 1);
          this.dispose();
        }
        this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
      }
      clone() {
        return new this.constructor().copy(this);
      }
      copy(t) {
        this.width = t.width,
        this.height = t.height,
        this.depth = t.depth,
        this.scissor.copy(t.scissor),
        this.scissorTest = t.scissorTest,
        this.viewport.copy(t.viewport),
        this.textures.length = 0;
        for (let e = 0, n = t.textures.length; e < n; e++) {
          this.textures[e] = t.textures[e].clone(),
          this.textures[e].isRenderTargetTexture = !0,
          this.textures[e].renderTarget = this;
          let s = Object.assign({}, t.textures[e].image);
          this.textures[e].source = new xr(s);
        }
        if (
        this.depthBuffer = t.depthBuffer,
        this.stencilBuffer = t.stencilBuffer,
        this.resolveColorBuffer = t.resolveColorBuffer,
        this.resolveDepthBuffer = t.resolveDepthBuffer,
        this.resolveStencilBuffer = t.resolveStencilBuffer,
        this.storeMultisampledColorBuffer = t.storeMultisampledColorBuffer,
        this.storeMultisampledDepthBuffer = t.storeMultisampledDepthBuffer,
        this.storeMultisampledStencilBuffer =
        t.storeMultisampledStencilBuffer,
        t.depthTexture !== null)

        if (t.depthTexture.renderTarget === t) {
          let e = t.depthTexture.clone();
          e.renderTarget = null, this.depthTexture = e;
        } else this.depthTexture = t.depthTexture;
        return (
          this.samples = t.samples,
          this.multiview = t.multiview,
          this.useArrayDepthTexture = t.useArrayDepthTexture,
          this);

      }
      dispose() {
        this.dispatchEvent({ type: "dispose" });
      }
    },
    gn = class extends xl {
      constructor(t = 1, e = 1, n = {}) {
        super(t, e, n), this.isWebGLRenderTarget = !0;
      }
    },
    So = class extends _n {
      constructor(t = null, e = 1, n = 1, s = 1) {
        super(null),
        this.isDataArrayTexture = !0,
        this.image = { data: t, width: e, height: n, depth: s },
        this.magFilter = Ae,
        this.minFilter = Ae,
        this.wrapR = hi,
        this.generateMipmaps = !1,
        this.flipY = !1,
        this.unpackAlignment = 1,
        this.layerUpdates = new Set();
      }
      copy(t) {
        return super.copy(t), this.wrapR = t.wrapR, this;
      }
      addLayerUpdate(t) {
        this.layerUpdates.add(t);
      }
      clearLayerUpdates() {
        this.layerUpdates.clear();
      }
    };
  var yl = class extends _n {
    constructor(t = null, e = 1, n = 1, s = 1) {
      super(null),
      this.isData3DTexture = !0,
      this.image = { data: t, width: e, height: n, depth: s },
      this.magFilter = Ae,
      this.minFilter = Ae,
      this.wrapR = hi,
      this.generateMipmaps = !1,
      this.flipY = !1,
      this.unpackAlignment = 1;
    }
    copy(t) {
      return super.copy(t), this.wrapR = t.wrapR, this;
    }
  };
  var Fl = class Fl {
    constructor(t, e, n, s, r, o, a, l, c, h, d, u, f, p, x, g) {
      this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      t !== void 0 &&
      this.set(t, e, n, s, r, o, a, l, c, h, d, u, f, p, x, g);
    }
    set(t, e, n, s, r, o, a, l, c, h, d, u, f, p, x, g) {
      let m = this.elements;
      return (
        m[0] = t,
        m[4] = e,
        m[8] = n,
        m[12] = s,
        m[1] = r,
        m[5] = o,
        m[9] = a,
        m[13] = l,
        m[2] = c,
        m[6] = h,
        m[10] = d,
        m[14] = u,
        m[3] = f,
        m[7] = p,
        m[11] = x,
        m[15] = g,
        this);

    }
    identity() {
      return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    clone() {
      return new Fl().fromArray(this.elements);
    }
    copy(t) {
      let e = this.elements,
        n = t.elements;
      return (
        e[0] = n[0],
        e[1] = n[1],
        e[2] = n[2],
        e[3] = n[3],
        e[4] = n[4],
        e[5] = n[5],
        e[6] = n[6],
        e[7] = n[7],
        e[8] = n[8],
        e[9] = n[9],
        e[10] = n[10],
        e[11] = n[11],
        e[12] = n[12],
        e[13] = n[13],
        e[14] = n[14],
        e[15] = n[15],
        this);

    }
    copyPosition(t) {
      let e = this.elements,
        n = t.elements;
      return e[12] = n[12], e[13] = n[13], e[14] = n[14], this;
    }
    setFromMatrix3(t) {
      let e = t.elements;
      return (
        this.set(
          e[0],
          e[3],
          e[6],
          0,
          e[1],
          e[4],
          e[7],
          0,
          e[2],
          e[5],
          e[8],
          0,
          0,
          0,
          0,
          1
        ),
        this);

    }
    extractBasis(t, e, n) {
      return this.determinantAffine() === 0 ? (
      t.set(1, 0, 0), e.set(0, 1, 0), n.set(0, 0, 1), this) : (
      t.setFromMatrixColumn(this, 0),
      e.setFromMatrixColumn(this, 1),
      n.setFromMatrixColumn(this, 2),
      this);
    }
    makeBasis(t, e, n) {
      return (
        this.set(
          t.x,
          e.x,
          n.x,
          0,
          t.y,
          e.y,
          n.y,
          0,
          t.z,
          e.z,
          n.z,
          0,
          0,
          0,
          0,
          1
        ),
        this);

    }
    extractRotation(t) {
      if (t.determinantAffine() === 0) return this.identity();
      let e = this.elements,
        n = t.elements,
        s = 1 / Js.setFromMatrixColumn(t, 0).length(),
        r = 1 / Js.setFromMatrixColumn(t, 1).length(),
        o = 1 / Js.setFromMatrixColumn(t, 2).length();
      return (
        e[0] = n[0] * s,
        e[1] = n[1] * s,
        e[2] = n[2] * s,
        e[3] = 0,
        e[4] = n[4] * r,
        e[5] = n[5] * r,
        e[6] = n[6] * r,
        e[7] = 0,
        e[8] = n[8] * o,
        e[9] = n[9] * o,
        e[10] = n[10] * o,
        e[11] = 0,
        e[12] = 0,
        e[13] = 0,
        e[14] = 0,
        e[15] = 1,
        this);

    }
    makeRotationFromEuler(t) {
      let e = this.elements,
        n = t.x,
        s = t.y,
        r = t.z,
        o = Math.cos(n),
        a = Math.sin(n),
        l = Math.cos(s),
        c = Math.sin(s),
        h = Math.cos(r),
        d = Math.sin(r);
      if (t.order === "XYZ") {
        let u = o * h,
          f = o * d,
          p = a * h,
          x = a * d;
        e[0] = l * h,
        e[4] = -l * d,
        e[8] = c,
        e[1] = f + p * c,
        e[5] = u - x * c,
        e[9] = -a * l,
        e[2] = x - u * c,
        e[6] = p + f * c,
        e[10] = o * l;
      } else if (t.order === "YXZ") {
        let u = l * h,
          f = l * d,
          p = c * h,
          x = c * d;
        e[0] = u + x * a,
        e[4] = p * a - f,
        e[8] = o * c,
        e[1] = o * d,
        e[5] = o * h,
        e[9] = -a,
        e[2] = f * a - p,
        e[6] = x + u * a,
        e[10] = o * l;
      } else if (t.order === "ZXY") {
        let u = l * h,
          f = l * d,
          p = c * h,
          x = c * d;
        e[0] = u - x * a,
        e[4] = -o * d,
        e[8] = p + f * a,
        e[1] = f + p * a,
        e[5] = o * h,
        e[9] = x - u * a,
        e[2] = -o * c,
        e[6] = a,
        e[10] = o * l;
      } else if (t.order === "ZYX") {
        let u = o * h,
          f = o * d,
          p = a * h,
          x = a * d;
        e[0] = l * h,
        e[4] = p * c - f,
        e[8] = u * c + x,
        e[1] = l * d,
        e[5] = x * c + u,
        e[9] = f * c - p,
        e[2] = -c,
        e[6] = a * l,
        e[10] = o * l;
      } else if (t.order === "YZX") {
        let u = o * l,
          f = o * c,
          p = a * l,
          x = a * c;
        e[0] = l * h,
        e[4] = x - u * d,
        e[8] = p * d + f,
        e[1] = d,
        e[5] = o * h,
        e[9] = -a * h,
        e[2] = -c * h,
        e[6] = f * d + p,
        e[10] = u - x * d;
      } else if (t.order === "XZY") {
        let u = o * l,
          f = o * c,
          p = a * l,
          x = a * c;
        e[0] = l * h,
        e[4] = -d,
        e[8] = c * h,
        e[1] = u * d + x,
        e[5] = o * h,
        e[9] = f * d - p,
        e[2] = p * d - f,
        e[6] = a * h,
        e[10] = x * d + u;
      }
      return (
        e[3] = 0,
        e[7] = 0,
        e[11] = 0,
        e[12] = 0,
        e[13] = 0,
        e[14] = 0,
        e[15] = 1,
        this);

    }
    makeRotationFromQuaternion(t) {
      return this.compose(Eg, t, Tg);
    }
    lookAt(t, e, n) {
      let s = this.elements;
      return (
        kn.subVectors(t, e),
        kn.lengthSq() === 0 && (kn.z = 1),
        kn.normalize(),
        $i.crossVectors(n, kn),
        $i.lengthSq() === 0 && (
        Math.abs(n.z) === 1 ? kn.x += 1e-4 : kn.z += 1e-4,
        kn.normalize(),
        $i.crossVectors(n, kn)),
        $i.normalize(),
        Ca.crossVectors(kn, $i),
        s[0] = $i.x,
        s[4] = Ca.x,
        s[8] = kn.x,
        s[1] = $i.y,
        s[5] = Ca.y,
        s[9] = kn.y,
        s[2] = $i.z,
        s[6] = Ca.z,
        s[10] = kn.z,
        this);

    }
    multiply(t) {
      return this.multiplyMatrices(this, t);
    }
    premultiply(t) {
      return this.multiplyMatrices(t, this);
    }
    multiplyMatrices(t, e) {
      let n = t.elements,
        s = e.elements,
        r = this.elements,
        o = n[0],
        a = n[4],
        l = n[8],
        c = n[12],
        h = n[1],
        d = n[5],
        u = n[9],
        f = n[13],
        p = n[2],
        x = n[6],
        g = n[10],
        m = n[14],
        b = n[3],
        T = n[7],
        y = n[11],
        S = n[15],
        M = s[0],
        A = s[4],
        v = s[8],
        E = s[12],
        R = s[1],
        P = s[5],
        N = s[9],
        B = s[13],
        D = s[2],
        I = s[6],
        H = s[10],
        X = s[14],
        nt = s[3],
        Y = s[7],
        K = s[11],
        et = s[15];
      return (
        r[0] = o * M + a * R + l * D + c * nt,
        r[4] = o * A + a * P + l * I + c * Y,
        r[8] = o * v + a * N + l * H + c * K,
        r[12] = o * E + a * B + l * X + c * et,
        r[1] = h * M + d * R + u * D + f * nt,
        r[5] = h * A + d * P + u * I + f * Y,
        r[9] = h * v + d * N + u * H + f * K,
        r[13] = h * E + d * B + u * X + f * et,
        r[2] = p * M + x * R + g * D + m * nt,
        r[6] = p * A + x * P + g * I + m * Y,
        r[10] = p * v + x * N + g * H + m * K,
        r[14] = p * E + x * B + g * X + m * et,
        r[3] = b * M + T * R + y * D + S * nt,
        r[7] = b * A + T * P + y * I + S * Y,
        r[11] = b * v + T * N + y * H + S * K,
        r[15] = b * E + T * B + y * X + S * et,
        this);

    }
    multiplyScalar(t) {
      let e = this.elements;
      return (
        e[0] *= t,
        e[4] *= t,
        e[8] *= t,
        e[12] *= t,
        e[1] *= t,
        e[5] *= t,
        e[9] *= t,
        e[13] *= t,
        e[2] *= t,
        e[6] *= t,
        e[10] *= t,
        e[14] *= t,
        e[3] *= t,
        e[7] *= t,
        e[11] *= t,
        e[15] *= t,
        this);

    }
    determinant() {
      let t = this.elements,
        e = t[0],
        n = t[4],
        s = t[8],
        r = t[12],
        o = t[1],
        a = t[5],
        l = t[9],
        c = t[13],
        h = t[2],
        d = t[6],
        u = t[10],
        f = t[14],
        p = t[3],
        x = t[7],
        g = t[11],
        m = t[15],
        b = l * f - c * u,
        T = a * f - c * d,
        y = a * u - l * d,
        S = o * f - c * h,
        M = o * u - l * h,
        A = o * d - a * h;
      return (
        e * (x * b - g * T + m * y) -
        n * (p * b - g * S + m * M) +
        s * (p * T - x * S + m * A) -
        r * (p * y - x * M + g * A));

    }
    determinantAffine() {
      let t = this.elements,
        e = t[0],
        n = t[4],
        s = t[8],
        r = t[1],
        o = t[5],
        a = t[9],
        l = t[2],
        c = t[6],
        h = t[10];
      return e * (o * h - a * c) - n * (r * h - a * l) + s * (r * c - o * l);
    }
    transpose() {
      let t = this.elements,
        e;
      return (
        e = t[1],
        t[1] = t[4],
        t[4] = e,
        e = t[2],
        t[2] = t[8],
        t[8] = e,
        e = t[6],
        t[6] = t[9],
        t[9] = e,
        e = t[3],
        t[3] = t[12],
        t[12] = e,
        e = t[7],
        t[7] = t[13],
        t[13] = e,
        e = t[11],
        t[11] = t[14],
        t[14] = e,
        this);

    }
    setPosition(t, e, n) {
      let s = this.elements;
      return (
        t.isVector3 ? (
        s[12] = t.x, s[13] = t.y, s[14] = t.z) : (
        s[12] = t, s[13] = e, s[14] = n),
        this);

    }
    invert() {
      let t = this.elements,
        e = t[0],
        n = t[1],
        s = t[2],
        r = t[3],
        o = t[4],
        a = t[5],
        l = t[6],
        c = t[7],
        h = t[8],
        d = t[9],
        u = t[10],
        f = t[11],
        p = t[12],
        x = t[13],
        g = t[14],
        m = t[15],
        b = e * a - n * o,
        T = e * l - s * o,
        y = e * c - r * o,
        S = n * l - s * a,
        M = n * c - r * a,
        A = s * c - r * l,
        v = h * x - d * p,
        E = h * g - u * p,
        R = h * m - f * p,
        P = d * g - u * x,
        N = d * m - f * x,
        B = u * m - f * g,
        D = b * B - T * N + y * P + S * R - M * E + A * v;
      if (D === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      let I = 1 / D;
      return (
        t[0] = (a * B - l * N + c * P) * I,
        t[1] = (s * N - n * B - r * P) * I,
        t[2] = (x * A - g * M + m * S) * I,
        t[3] = (u * M - d * A - f * S) * I,
        t[4] = (l * R - o * B - c * E) * I,
        t[5] = (e * B - s * R + r * E) * I,
        t[6] = (g * y - p * A - m * T) * I,
        t[7] = (h * A - u * y + f * T) * I,
        t[8] = (o * N - a * R + c * v) * I,
        t[9] = (n * R - e * N - r * v) * I,
        t[10] = (p * M - x * y + m * b) * I,
        t[11] = (d * y - h * M - f * b) * I,
        t[12] = (a * E - o * P - l * v) * I,
        t[13] = (e * P - n * E + s * v) * I,
        t[14] = (x * T - p * S - g * b) * I,
        t[15] = (h * S - d * T + u * b) * I,
        this);

    }
    scale(t) {
      let e = this.elements,
        n = t.x,
        s = t.y,
        r = t.z;
      return (
        e[0] *= n,
        e[4] *= s,
        e[8] *= r,
        e[1] *= n,
        e[5] *= s,
        e[9] *= r,
        e[2] *= n,
        e[6] *= s,
        e[10] *= r,
        e[3] *= n,
        e[7] *= s,
        e[11] *= r,
        this);

    }
    getMaxScaleOnAxis() {
      let t = this.elements,
        e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2],
        n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6],
        s = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
      return Math.sqrt(Math.max(e, n, s));
    }
    makeTranslation(t, e, n) {
      return (
        t.isVector3 ?
        this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1) :
        this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1),
        this);

    }
    makeRotationX(t) {
      let e = Math.cos(t),
        n = Math.sin(t);
      return this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this;
    }
    makeRotationY(t) {
      let e = Math.cos(t),
        n = Math.sin(t);
      return this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this;
    }
    makeRotationZ(t) {
      let e = Math.cos(t),
        n = Math.sin(t);
      return this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
    }
    makeRotationAxis(t, e) {
      let n = Math.cos(e),
        s = Math.sin(e),
        r = 1 - n,
        o = t.x,
        a = t.y,
        l = t.z,
        c = r * o,
        h = r * a;
      return (
        this.set(
          c * o + n,
          c * a - s * l,
          c * l + s * a,
          0,
          c * a + s * l,
          h * a + n,
          h * l - s * o,
          0,
          c * l - s * a,
          h * l + s * o,
          r * l * l + n,
          0,
          0,
          0,
          0,
          1
        ),
        this);

    }
    makeScale(t, e, n) {
      return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
    }
    makeShear(t, e, n, s, r, o) {
      return this.set(1, n, r, 0, t, 1, o, 0, e, s, 1, 0, 0, 0, 0, 1), this;
    }
    compose(t, e, n) {
      let s = this.elements,
        r = e._x,
        o = e._y,
        a = e._z,
        l = e._w,
        c = r + r,
        h = o + o,
        d = a + a,
        u = r * c,
        f = r * h,
        p = r * d,
        x = o * h,
        g = o * d,
        m = a * d,
        b = l * c,
        T = l * h,
        y = l * d,
        S = n.x,
        M = n.y,
        A = n.z;
      return (
        s[0] = (1 - (x + m)) * S,
        s[1] = (f + y) * S,
        s[2] = (p - T) * S,
        s[3] = 0,
        s[4] = (f - y) * M,
        s[5] = (1 - (u + m)) * M,
        s[6] = (g + b) * M,
        s[7] = 0,
        s[8] = (p + T) * A,
        s[9] = (g - b) * A,
        s[10] = (1 - (u + x)) * A,
        s[11] = 0,
        s[12] = t.x,
        s[13] = t.y,
        s[14] = t.z,
        s[15] = 1,
        this);

    }
    decompose(t, e, n) {
      let s = this.elements;
      t.x = s[12], t.y = s[13], t.z = s[14];
      let r = this.determinantAffine();
      if (r === 0) return n.set(1, 1, 1), e.identity(), this;
      let o = Js.set(s[0], s[1], s[2]).length(),
        a = Js.set(s[4], s[5], s[6]).length(),
        l = Js.set(s[8], s[9], s[10]).length();
      r < 0 && (o = -o), $n.copy(this);
      let c = 1 / o,
        h = 1 / a,
        d = 1 / l;
      return (
        $n.elements[0] *= c,
        $n.elements[1] *= c,
        $n.elements[2] *= c,
        $n.elements[4] *= h,
        $n.elements[5] *= h,
        $n.elements[6] *= h,
        $n.elements[8] *= d,
        $n.elements[9] *= d,
        $n.elements[10] *= d,
        e.setFromRotationMatrix($n),
        n.x = o,
        n.y = a,
        n.z = l,
        this);

    }
    makePerspective(t, e, n, s, r, o, a = Zn, l = !1) {
      let c = this.elements,
        h = 2 * r / (e - t),
        d = 2 * r / (n - s),
        u = (e + t) / (e - t),
        f = (n + s) / (n - s),
        p,
        x;
      if (l) p = r / (o - r), x = o * r / (o - r);else
      if (a === Zn) p = -(o + r) / (o - r), x = -2 * o * r / (o - r);else
      if (a === mr) p = -o / (o - r), x = -o * r / (o - r);else

      throw new Error(
        "THREE.Matrix4.makePerspective(): Invalid coordinate system: " + a
      );
      return (
        c[0] = h,
        c[4] = 0,
        c[8] = u,
        c[12] = 0,
        c[1] = 0,
        c[5] = d,
        c[9] = f,
        c[13] = 0,
        c[2] = 0,
        c[6] = 0,
        c[10] = p,
        c[14] = x,
        c[3] = 0,
        c[7] = 0,
        c[11] = -1,
        c[15] = 0,
        this);

    }
    makeOrthographic(t, e, n, s, r, o, a = Zn, l = !1) {
      let c = this.elements,
        h = 2 / (e - t),
        d = 2 / (n - s),
        u = -(e + t) / (e - t),
        f = -(n + s) / (n - s),
        p,
        x;
      if (l) p = 1 / (o - r), x = o / (o - r);else
      if (a === Zn) p = -2 / (o - r), x = -(o + r) / (o - r);else
      if (a === mr) p = -1 / (o - r), x = -r / (o - r);else

      throw new Error(
        "THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + a
      );
      return (
        c[0] = h,
        c[4] = 0,
        c[8] = 0,
        c[12] = u,
        c[1] = 0,
        c[5] = d,
        c[9] = 0,
        c[13] = f,
        c[2] = 0,
        c[6] = 0,
        c[10] = p,
        c[14] = x,
        c[3] = 0,
        c[7] = 0,
        c[11] = 0,
        c[15] = 1,
        this);

    }
    equals(t) {
      let e = this.elements,
        n = t.elements;
      for (let s = 0; s < 16; s++) if (e[s] !== n[s]) return !1;
      return !0;
    }
    fromArray(t, e = 0) {
      for (let n = 0; n < 16; n++) this.elements[n] = t[n + e];
      return this;
    }
    toArray(t = [], e = 0) {
      let n = this.elements;
      return (
        t[e] = n[0],
        t[e + 1] = n[1],
        t[e + 2] = n[2],
        t[e + 3] = n[3],
        t[e + 4] = n[4],
        t[e + 5] = n[5],
        t[e + 6] = n[6],
        t[e + 7] = n[7],
        t[e + 8] = n[8],
        t[e + 9] = n[9],
        t[e + 10] = n[10],
        t[e + 11] = n[11],
        t[e + 12] = n[12],
        t[e + 13] = n[13],
        t[e + 14] = n[14],
        t[e + 15] = n[15],
        t);

    }
  };
  Fl.prototype.isMatrix4 = !0;
  var se = Fl,
    Js = new z(),
    $n = new se(),
    Eg = new z(0, 0, 0),
    Tg = new z(1, 1, 1),
    $i = new z(),
    Ca = new z(),
    kn = new z(),
    wf = new se(),
    Ef = new mn(),
    bn = class i {
      constructor(t = 0, e = 0, n = 0, s = i.DEFAULT_ORDER) {
        this.isEuler = !0,
        this._x = t,
        this._y = e,
        this._z = n,
        this._order = s;
      }
      get x() {
        return this._x;
      }
      set x(t) {
        this._x = t, this._onChangeCallback();
      }
      get y() {
        return this._y;
      }
      set y(t) {
        this._y = t, this._onChangeCallback();
      }
      get z() {
        return this._z;
      }
      set z(t) {
        this._z = t, this._onChangeCallback();
      }
      get order() {
        return this._order;
      }
      set order(t) {
        this._order = t, this._onChangeCallback();
      }
      set(t, e, n, s = this._order) {
        return (
          this._x = t,
          this._y = e,
          this._z = n,
          this._order = s,
          this._onChangeCallback(),
          this);

      }
      clone() {
        return new this.constructor(this._x, this._y, this._z, this._order);
      }
      copy(t) {
        return (
          this._x = t._x,
          this._y = t._y,
          this._z = t._z,
          this._order = t._order,
          this._onChangeCallback(),
          this);

      }
      setFromRotationMatrix(t, e = this._order, n = !0) {
        let s = t.elements,
          r = s[0],
          o = s[4],
          a = s[8],
          l = s[1],
          c = s[5],
          h = s[9],
          d = s[2],
          u = s[6],
          f = s[10];
        switch (e) {
          case "XYZ":
            this._y = Math.asin(re(a, -1, 1)),
            Math.abs(a) < 0.9999999 ? (
            this._x = Math.atan2(-h, f), this._z = Math.atan2(-o, r)) : (
            this._x = Math.atan2(u, c), this._z = 0);
            break;
          case "YXZ":
            this._x = Math.asin(-re(h, -1, 1)),
            Math.abs(h) < 0.9999999 ? (
            this._y = Math.atan2(a, f), this._z = Math.atan2(l, c)) : (
            this._y = Math.atan2(-d, r), this._z = 0);
            break;
          case "ZXY":
            this._x = Math.asin(re(u, -1, 1)),
            Math.abs(u) < 0.9999999 ? (
            this._y = Math.atan2(-d, f), this._z = Math.atan2(-o, c)) : (
            this._y = 0, this._z = Math.atan2(l, r));
            break;
          case "ZYX":
            this._y = Math.asin(-re(d, -1, 1)),
            Math.abs(d) < 0.9999999 ? (
            this._x = Math.atan2(u, f), this._z = Math.atan2(l, r)) : (
            this._x = 0, this._z = Math.atan2(-o, c));
            break;
          case "YZX":
            this._z = Math.asin(re(l, -1, 1)),
            Math.abs(l) < 0.9999999 ? (
            this._x = Math.atan2(-h, c), this._y = Math.atan2(-d, r)) : (
            this._x = 0, this._y = Math.atan2(a, f));
            break;
          case "XZY":
            this._z = Math.asin(-re(o, -1, 1)),
            Math.abs(o) < 0.9999999 ? (
            this._x = Math.atan2(u, c), this._y = Math.atan2(a, r)) : (
            this._x = Math.atan2(-h, f), this._y = 0);
            break;
          default:
            Ht(
              "Euler: .setFromRotationMatrix() encountered an unknown order: " +
              e
            );
        }
        return this._order = e, n === !0 && this._onChangeCallback(), this;
      }
      setFromQuaternion(t, e, n) {
        return (
          wf.makeRotationFromQuaternion(t), this.setFromRotationMatrix(wf, e, n));

      }
      setFromVector3(t, e = this._order) {
        return this.set(t.x, t.y, t.z, e);
      }
      reorder(t) {
        return Ef.setFromEuler(this), this.setFromQuaternion(Ef, t);
      }
      equals(t) {
        return (
          t._x === this._x &&
          t._y === this._y &&
          t._z === this._z &&
          t._order === this._order);

      }
      fromArray(t) {
        return (
          this._x = t[0],
          this._y = t[1],
          this._z = t[2],
          t[3] !== void 0 && (this._order = t[3]),
          this._onChangeCallback(),
          this);

      }
      toArray(t = [], e = 0) {
        return (
          t[e] = this._x,
          t[e + 1] = this._y,
          t[e + 2] = this._z,
          t[e + 3] = this._order,
          t);

      }
      _onChange(t) {
        return this._onChangeCallback = t, this;
      }
      _onChangeCallback() {}
      *[Symbol.iterator]() {
        yield this._x, yield this._y, yield this._z, yield this._order;
      }
    };
  bn.DEFAULT_ORDER = "XYZ";
  var yr = class {
      constructor() {
        this.mask = 1;
      }
      set(t) {
        this.mask = (1 << t | 0) >>> 0;
      }
      enable(t) {
        this.mask |= 1 << t | 0;
      }
      enableAll() {
        this.mask = -1;
      }
      toggle(t) {
        this.mask ^= 1 << t | 0;
      }
      disable(t) {
        this.mask &= ~(1 << t | 0);
      }
      disableAll() {
        this.mask = 0;
      }
      test(t) {
        return (this.mask & t.mask) !== 0;
      }
      isEnabled(t) {
        return (this.mask & (1 << t | 0)) !== 0;
      }
    },
    Ag = 0,
    Tf = new z(),
    js = new mn(),
    wi = new se(),
    Ia = new z(),
    ao = new z(),
    Rg = new z(),
    kg = new mn(),
    Af = new z(1, 0, 0),
    Rf = new z(0, 1, 0),
    kf = new z(0, 0, 1),
    Cf = { type: "added" },
    Cg = { type: "removed" },
    Ks = { type: "childadded", child: null },
    Nh = { type: "childremoved", child: null },
    Je = class i extends di {
      constructor() {
        super(),
        this.isObject3D = !0,
        Object.defineProperty(this, "id", { value: Ag++ }),
        this.uuid = ji(),
        this.name = "",
        this.type = "Object3D",
        this.parent = null,
        this.children = [],
        this.up = i.DEFAULT_UP.clone();
        let t = new z(),
          e = new bn(),
          n = new mn(),
          s = new z(1, 1, 1);
        function r() {
          n.setFromEuler(e, !1);
        }
        function o() {
          e.setFromQuaternion(n, void 0, !1);
        }
        e._onChange(r),
        n._onChange(o),
        Object.defineProperties(this, {
          position: { configurable: !0, enumerable: !0, value: t },
          rotation: { configurable: !0, enumerable: !0, value: e },
          quaternion: { configurable: !0, enumerable: !0, value: n },
          scale: { configurable: !0, enumerable: !0, value: s },
          modelViewMatrix: { value: new se() },
          normalMatrix: { value: new Wt() }
        }),
        this.matrix = new se(),
        this.matrixWorld = new se(),
        this.matrixAutoUpdate = i.DEFAULT_MATRIX_AUTO_UPDATE,
        this.matrixWorldAutoUpdate = i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,
        this.matrixWorldNeedsUpdate = !1,
        this.layers = new yr(),
        this.visible = !0,
        this.castShadow = !1,
        this.receiveShadow = !1,
        this.frustumCulled = !0,
        this.renderOrder = 0,
        this.animations = [],
        this.customDepthMaterial = void 0,
        this.customDistanceMaterial = void 0,
        this.static = !1,
        this.userData = {},
        this.pivot = null;
      }
      onBeforeShadow() {}
      onAfterShadow() {}
      onBeforeRender() {}
      onAfterRender() {}
      applyMatrix4(t) {
        this.matrixAutoUpdate && this.updateMatrix(),
        this.matrix.premultiply(t),
        this.matrix.decompose(this.position, this.quaternion, this.scale);
      }
      applyQuaternion(t) {
        return this.quaternion.premultiply(t), this;
      }
      setRotationFromAxisAngle(t, e) {
        this.quaternion.setFromAxisAngle(t, e);
      }
      setRotationFromEuler(t) {
        this.quaternion.setFromEuler(t, !0);
      }
      setRotationFromMatrix(t) {
        this.quaternion.setFromRotationMatrix(t);
      }
      setRotationFromQuaternion(t) {
        this.quaternion.copy(t);
      }
      rotateOnAxis(t, e) {
        return js.setFromAxisAngle(t, e), this.quaternion.multiply(js), this;
      }
      rotateOnWorldAxis(t, e) {
        return js.setFromAxisAngle(t, e), this.quaternion.premultiply(js), this;
      }
      rotateX(t) {
        return this.rotateOnAxis(Af, t);
      }
      rotateY(t) {
        return this.rotateOnAxis(Rf, t);
      }
      rotateZ(t) {
        return this.rotateOnAxis(kf, t);
      }
      translateOnAxis(t, e) {
        return (
          Tf.copy(t).applyQuaternion(this.quaternion),
          this.position.add(Tf.multiplyScalar(e)),
          this);

      }
      translateX(t) {
        return this.translateOnAxis(Af, t);
      }
      translateY(t) {
        return this.translateOnAxis(Rf, t);
      }
      translateZ(t) {
        return this.translateOnAxis(kf, t);
      }
      localToWorld(t) {
        return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
      }
      worldToLocal(t) {
        return (
          this.updateWorldMatrix(!0, !1),
          t.applyMatrix4(wi.copy(this.matrixWorld).invert()));

      }
      lookAt(t, e, n) {
        t.isVector3 ? Ia.copy(t) : Ia.set(t, e, n);
        let s = this.parent;
        this.updateWorldMatrix(!0, !1),
        ao.setFromMatrixPosition(this.matrixWorld),
        this.isCamera || this.isLight ?
        wi.lookAt(ao, Ia, this.up) :
        wi.lookAt(Ia, ao, this.up),
        this.quaternion.setFromRotationMatrix(wi),
        s && (
        wi.extractRotation(s.matrixWorld),
        js.setFromRotationMatrix(wi),
        this.quaternion.premultiply(js.invert()));
      }
      add(t) {
        if (arguments.length > 1) {
          for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
          return this;
        }
        return t === this ? (
        Gt("Object3D.add: object can't be added as a child of itself.", t),
        this) : (
        t && t.isObject3D ? (
        t.removeFromParent(),
        t.parent = this,
        this.children.push(t),
        t.dispatchEvent(Cf),
        Ks.child = t,
        this.dispatchEvent(Ks),
        Ks.child = null) :
        Gt(
          "Object3D.add: object not an instance of THREE.Object3D.",
          t
        ),
        this);
      }
      remove(t) {
        if (arguments.length > 1) {
          for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
          return this;
        }
        let e = this.children.indexOf(t);
        return (
          e !== -1 && (
          t.parent = null,
          this.children.splice(e, 1),
          t.dispatchEvent(Cg),
          Nh.child = t,
          this.dispatchEvent(Nh),
          Nh.child = null),
          this);

      }
      removeFromParent() {
        let t = this.parent;
        return t !== null && t.remove(this), this;
      }
      clear() {
        return this.remove(...this.children);
      }
      attach(t) {
        return (
          this.updateWorldMatrix(!0, !1),
          wi.copy(this.matrixWorld).invert(),
          t.parent !== null && (
          t.parent.updateWorldMatrix(!0, !1),
          wi.multiply(t.parent.matrixWorld)),
          t.applyMatrix4(wi),
          t.removeFromParent(),
          t.parent = this,
          this.children.push(t),
          t.updateWorldMatrix(!1, !0),
          t.dispatchEvent(Cf),
          Ks.child = t,
          this.dispatchEvent(Ks),
          Ks.child = null,
          this);

      }
      getObjectById(t) {
        return this.getObjectByProperty("id", t);
      }
      getObjectByName(t) {
        return this.getObjectByProperty("name", t);
      }
      getObjectByProperty(t, e) {
        if (this[t] === e) return this;
        for (let n = 0, s = this.children.length; n < s; n++) {
          let o = this.children[n].getObjectByProperty(t, e);
          if (o !== void 0) return o;
        }
      }
      getObjectsByProperty(t, e, n = []) {
        this[t] === e && n.push(this);
        let s = this.children;
        for (let r = 0, o = s.length; r < o; r++)
        s[r].getObjectsByProperty(t, e, n);
        return n;
      }
      getWorldPosition(t) {
        return (
          this.updateWorldMatrix(!0, !1),
          t.setFromMatrixPosition(this.matrixWorld));

      }
      getWorldQuaternion(t) {
        return (
          this.updateWorldMatrix(!0, !1),
          this.matrixWorld.decompose(ao, t, Rg),
          t);

      }
      getWorldScale(t) {
        return (
          this.updateWorldMatrix(!0, !1),
          this.matrixWorld.decompose(ao, kg, t),
          t);

      }
      getWorldDirection(t) {
        this.updateWorldMatrix(!0, !1);
        let e = this.matrixWorld.elements;
        return t.set(e[8], e[9], e[10]).normalize();
      }
      raycast() {}
      intersectsFrustum() {}
      traverse(t) {
        t(this);
        let e = this.children;
        for (let n = 0, s = e.length; n < s; n++) e[n].traverse(t);
      }
      traverseVisible(t) {
        if (this.visible === !1) return;
        t(this);
        let e = this.children;
        for (let n = 0, s = e.length; n < s; n++) e[n].traverseVisible(t);
      }
      traverseAncestors(t) {
        let e = this.parent;
        e !== null && (t(e), e.traverseAncestors(t));
      }
      updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        let t = this.pivot;
        if (t !== null) {
          let e = t.x,
            n = t.y,
            s = t.z,
            r = this.matrix.elements;
          r[12] += e - r[0] * e - r[4] * n - r[8] * s,
          r[13] += n - r[1] * e - r[5] * n - r[9] * s,
          r[14] += s - r[2] * e - r[6] * n - r[10] * s;
        }
        this.matrixWorldNeedsUpdate = !0;
      }
      updateMatrixWorld(t) {
        this.matrixAutoUpdate && this.updateMatrix(),
        (this.matrixWorldNeedsUpdate || t) && (
        this.matrixWorldAutoUpdate === !0 && (
        this.parent === null ?
        this.matrixWorld.copy(this.matrix) :
        this.matrixWorld.multiplyMatrices(
          this.parent.matrixWorld,
          this.matrix
        )),
        this.matrixWorldNeedsUpdate = !1,
        t = !0);
        let e = this.children;
        for (let n = 0, s = e.length; n < s; n++) e[n].updateMatrixWorld(t);
      }
      updateWorldMatrix(t, e, n = !1) {
        let s = this.parent;
        if (
        t === !0 && s !== null && s.updateWorldMatrix(!0, !1),
        this.matrixAutoUpdate && this.updateMatrix(),
        (this.matrixWorldNeedsUpdate || n) && (
        this.matrixWorldAutoUpdate === !0 && (
        this.parent === null ?
        this.matrixWorld.copy(this.matrix) :
        this.matrixWorld.multiplyMatrices(
          this.parent.matrixWorld,
          this.matrix
        )),
        this.matrixWorldNeedsUpdate = !1,
        n = !0),
        e === !0)
        {
          let r = this.children;
          for (let o = 0, a = r.length; o < a; o++)
          r[o].updateWorldMatrix(!1, !0, n);
        }
      }
      toJSON(t) {
        let e = t === void 0 || typeof t == "string",
          n = {};
        e && (
        t = {
          geometries: {},
          materials: {},
          textures: {},
          images: {},
          shapes: {},
          skeletons: {},
          animations: {},
          nodes: {}
        },
        n.metadata = {
          version: 4.7,
          type: "Object",
          generator: "Object3D.toJSON"
        });
        let s = {};
        s.uuid = this.uuid,
        s.type = this.type,
        s.name = this.name,
        s.castShadow = this.castShadow,
        s.receiveShadow = this.receiveShadow,
        s.visible = this.visible,
        s.frustumCulled = this.frustumCulled,
        s.renderOrder = this.renderOrder,
        s.static = this.static,
        s.matrixAutoUpdate = this.matrixAutoUpdate,
        Object.keys(this.userData).length > 0 && (s.userData = this.userData),
        s.layers = this.layers.mask,
        s.matrix = this.matrix.toArray(),
        s.up = this.up.toArray(),
        this.pivot !== null && (s.pivot = this.pivot.toArray()),
        this.morphTargetDictionary !== void 0 && (
        s.morphTargetDictionary = Object.assign(
          {},
          this.morphTargetDictionary
        )),
        this.morphTargetInfluences !== void 0 && (
        s.morphTargetInfluences = this.morphTargetInfluences.slice()),
        this.isInstancedMesh && (
        s.type = "InstancedMesh",
        s.count = this.count,
        s.instanceMatrix = this.instanceMatrix.toJSON(),
        this.instanceColor !== null && (
        s.instanceColor = this.instanceColor.toJSON())),
        this.isBatchedMesh && (
        s.type = "BatchedMesh",
        s.perObjectFrustumCulled = this.perObjectFrustumCulled,
        s.sortObjects = this.sortObjects,
        s.drawRanges = this._drawRanges,
        s.reservedRanges = this._reservedRanges,
        s.geometryInfo = this._geometryInfo.map((a) => ({
          ...a,
          boundingBox: a.boundingBox ? a.boundingBox.toJSON() : void 0,
          boundingSphere: a.boundingSphere ?
          a.boundingSphere.toJSON() :
          void 0
        })),
        s.instanceInfo = this._instanceInfo.map((a) => ({ ...a })),
        s.availableInstanceIds = this._availableInstanceIds.slice(),
        s.availableGeometryIds = this._availableGeometryIds.slice(),
        s.nextIndexStart = this._nextIndexStart,
        s.nextVertexStart = this._nextVertexStart,
        s.geometryCount = this._geometryCount,
        s.maxInstanceCount = this._maxInstanceCount,
        s.maxVertexCount = this._maxVertexCount,
        s.maxIndexCount = this._maxIndexCount,
        s.geometryInitialized = this._geometryInitialized,
        s.matricesTexture = this._matricesTexture.toJSON(t),
        s.indirectTexture = this._indirectTexture.toJSON(t),
        this._colorsTexture !== null && (
        s.colorsTexture = this._colorsTexture.toJSON(t)),
        this.boundingSphere !== null && (
        s.boundingSphere = this.boundingSphere.toJSON()),
        this.boundingBox !== null && (
        s.boundingBox = this.boundingBox.toJSON()));
        function r(a, l) {
          return a[l.uuid] === void 0 && (a[l.uuid] = l.toJSON(t)), l.uuid;
        }
        if (this.isScene)
        this.background && (
        this.background.isColor ?
        s.background = this.background.toJSON() :
        this.background.isTexture && (
        s.background = this.background.toJSON(t).uuid)),
        this.environment &&
        this.environment.isTexture &&
        this.environment.isRenderTargetTexture !== !0 && (
        s.environment = this.environment.toJSON(t).uuid);else
        if (this.isMesh || this.isLine || this.isPoints) {
          s.geometry = r(t.geometries, this.geometry);
          let a = this.geometry.parameters;
          if (a !== void 0 && a.shapes !== void 0) {
            let l = a.shapes;
            if (Array.isArray(l))
            for (let c = 0, h = l.length; c < h; c++) {
              let d = l[c];
              r(t.shapes, d);
            } else
            r(t.shapes, l);
          }
        }
        if (
        this.isSkinnedMesh && (
        s.bindMode = this.bindMode,
        s.bindMatrix = this.bindMatrix.toArray(),
        this.skeleton !== void 0 && (
        r(t.skeletons, this.skeleton),
        s.skeleton = this.skeleton.uuid)),
        this.material !== void 0)

        if (Array.isArray(this.material)) {
          let a = [];
          for (let l = 0, c = this.material.length; l < c; l++)
          a.push(r(t.materials, this.material[l]));
          s.material = a;
        } else s.material = r(t.materials, this.material);
        if (this.children.length > 0) {
          s.children = [];
          for (let a = 0; a < this.children.length; a++)
          s.children.push(this.children[a].toJSON(t).object);
        }
        if (this.animations.length > 0) {
          s.animations = [];
          for (let a = 0; a < this.animations.length; a++) {
            let l = this.animations[a];
            s.animations.push(r(t.animations, l));
          }
        }
        if (e) {
          let a = o(t.geometries),
            l = o(t.materials),
            c = o(t.textures),
            h = o(t.images),
            d = o(t.shapes),
            u = o(t.skeletons),
            f = o(t.animations),
            p = o(t.nodes);
          a.length > 0 && (n.geometries = a),
          l.length > 0 && (n.materials = l),
          c.length > 0 && (n.textures = c),
          h.length > 0 && (n.images = h),
          d.length > 0 && (n.shapes = d),
          u.length > 0 && (n.skeletons = u),
          f.length > 0 && (n.animations = f),
          p.length > 0 && (n.nodes = p);
        }
        return n.object = s, n;
        function o(a) {
          let l = [];
          for (let c in a) {
            let h = a[c];
            delete h.metadata, l.push(h);
          }
          return l;
        }
      }
      clone(t) {
        return new this.constructor().copy(this, t);
      }
      copy(t, e = !0) {
        if (
        this.name = t.name,
        this.up.copy(t.up),
        this.position.copy(t.position),
        this.rotation.order = t.rotation.order,
        this.quaternion.copy(t.quaternion),
        this.scale.copy(t.scale),
        this.pivot = t.pivot !== null ? t.pivot.clone() : null,
        this.matrix.copy(t.matrix),
        this.matrixWorld.copy(t.matrixWorld),
        this.matrixAutoUpdate = t.matrixAutoUpdate,
        this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate,
        this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate,
        this.layers.mask = t.layers.mask,
        this.visible = t.visible,
        this.castShadow = t.castShadow,
        this.receiveShadow = t.receiveShadow,
        this.frustumCulled = t.frustumCulled,
        this.renderOrder = t.renderOrder,
        this.static = t.static,
        this.animations = t.animations.slice(),
        this.userData = JSON.parse(JSON.stringify(t.userData)),
        e === !0)

        for (let n = 0; n < t.children.length; n++) {
          let s = t.children[n];
          this.add(s.clone());
        }
        return this;
      }
      dispose() {
        this.dispatchEvent({ type: "dispose" });
      }
    };
  Je.DEFAULT_UP = new z(0, 1, 0);
  Je.DEFAULT_MATRIX_AUTO_UPDATE = !0;
  Je.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
  var Pe = class extends Je {
      constructor() {
        super(), this.isGroup = !0, this.type = "Group";
      }
    },
    Ig = { type: "move" },
    vr = class {
      constructor() {
        this._targetRay = null, this._grip = null, this._hand = null;
      }
      getHandSpace() {
        return (
          this._hand === null && (
          this._hand = new Pe(),
          this._hand.matrixAutoUpdate = !1,
          this._hand.visible = !1,
          this._hand.joints = {},
          this._hand.inputState = { pinching: !1 }),
          this._hand);

      }
      getTargetRaySpace() {
        return (
          this._targetRay === null && (
          this._targetRay = new Pe(),
          this._targetRay.matrixAutoUpdate = !1,
          this._targetRay.visible = !1,
          this._targetRay.hasLinearVelocity = !1,
          this._targetRay.linearVelocity = new z(),
          this._targetRay.hasAngularVelocity = !1,
          this._targetRay.angularVelocity = new z()),
          this._targetRay);

      }
      getGripSpace() {
        return (
          this._grip === null && (
          this._grip = new Pe(),
          this._grip.matrixAutoUpdate = !1,
          this._grip.visible = !1,
          this._grip.hasLinearVelocity = !1,
          this._grip.linearVelocity = new z(),
          this._grip.hasAngularVelocity = !1,
          this._grip.angularVelocity = new z(),
          this._grip.eventsEnabled = !1),
          this._grip);

      }
      dispatchEvent(t) {
        return (
          this._targetRay !== null && this._targetRay.dispatchEvent(t),
          this._grip !== null && this._grip.dispatchEvent(t),
          this._hand !== null && this._hand.dispatchEvent(t),
          this);

      }
      connect(t) {
        if (t && t.hand) {
          let e = this._hand;
          if (e) for (let n of t.hand.values()) this._getHandJoint(e, n);
        }
        return this.dispatchEvent({ type: "connected", data: t }), this;
      }
      disconnect(t) {
        return (
          this.dispatchEvent({ type: "disconnected", data: t }),
          this._targetRay !== null && (this._targetRay.visible = !1),
          this._grip !== null && (this._grip.visible = !1),
          this._hand !== null && (this._hand.visible = !1),
          this);

      }
      update(t, e, n) {
        let s = null,
          r = null,
          o = null,
          a = this._targetRay,
          l = this._grip,
          c = this._hand;
        if (t && e.session.visibilityState !== "visible-blurred") {
          if (c && t.hand) {
            o = !0;
            for (let x of t.hand.values()) {
              let g = e.getJointPose(x, n),
                m = this._getHandJoint(c, x);
              g !== null && (
              m.matrix.fromArray(g.transform.matrix),
              m.matrix.decompose(m.position, m.rotation, m.scale),
              m.matrixWorldNeedsUpdate = !0,
              m.jointRadius = g.radius),
              m.visible = g !== null;
            }
            let h = c.joints["index-finger-tip"],
              d = c.joints["thumb-tip"],
              u = h.position.distanceTo(d.position),
              f = 0.02,
              p = 0.005;
            c.inputState.pinching && u > f + p ? (
            c.inputState.pinching = !1,
            this.dispatchEvent({
              type: "pinchend",
              handedness: t.handedness,
              target: this
            })) :
            !c.inputState.pinching &&
            u <= f - p && (
            c.inputState.pinching = !0,
            this.dispatchEvent({
              type: "pinchstart",
              handedness: t.handedness,
              target: this
            }));
          } else
          l !== null &&
          t.gripSpace && (
          r = e.getPose(t.gripSpace, n),
          r !== null && (
          l.matrix.fromArray(r.transform.matrix),
          l.matrix.decompose(l.position, l.rotation, l.scale),
          l.matrixWorldNeedsUpdate = !0,
          r.linearVelocity ? (
          l.hasLinearVelocity = !0,
          l.linearVelocity.copy(r.linearVelocity)) :
          l.hasLinearVelocity = !1,
          r.angularVelocity ? (
          l.hasAngularVelocity = !0,
          l.angularVelocity.copy(r.angularVelocity)) :
          l.hasAngularVelocity = !1,
          l.eventsEnabled &&
          l.dispatchEvent({
            type: "gripUpdated",
            data: t,
            target: this
          })));
          a !== null && (
          s = e.getPose(t.targetRaySpace, n),
          s === null && r !== null && (s = r),
          s !== null && (
          a.matrix.fromArray(s.transform.matrix),
          a.matrix.decompose(a.position, a.rotation, a.scale),
          a.matrixWorldNeedsUpdate = !0,
          s.linearVelocity ? (
          a.hasLinearVelocity = !0,
          a.linearVelocity.copy(s.linearVelocity)) :
          a.hasLinearVelocity = !1,
          s.angularVelocity ? (
          a.hasAngularVelocity = !0,
          a.angularVelocity.copy(s.angularVelocity)) :
          a.hasAngularVelocity = !1,
          this.dispatchEvent(Ig)));
        }
        return (
          a !== null && (a.visible = s !== null),
          l !== null && (l.visible = r !== null),
          c !== null && (c.visible = o !== null),
          this);

      }
      _getHandJoint(t, e) {
        if (t.joints[e.jointName] === void 0) {
          let n = new Pe();
          n.matrixAutoUpdate = !1,
          n.visible = !1,
          t.joints[e.jointName] = n,
          t.add(n);
        }
        return t.joints[e.jointName];
      }
    },
    zp = {
      aliceblue: 15792383,
      antiquewhite: 16444375,
      aqua: 65535,
      aquamarine: 8388564,
      azure: 15794175,
      beige: 16119260,
      bisque: 16770244,
      black: 0,
      blanchedalmond: 16772045,
      blue: 255,
      blueviolet: 9055202,
      brown: 10824234,
      burlywood: 14596231,
      cadetblue: 6266528,
      chartreuse: 8388352,
      chocolate: 13789470,
      coral: 16744272,
      cornflowerblue: 6591981,
      cornsilk: 16775388,
      crimson: 14423100,
      cyan: 65535,
      darkblue: 139,
      darkcyan: 35723,
      darkgoldenrod: 12092939,
      darkgray: 11119017,
      darkgreen: 25600,
      darkgrey: 11119017,
      darkkhaki: 12433259,
      darkmagenta: 9109643,
      darkolivegreen: 5597999,
      darkorange: 16747520,
      darkorchid: 10040012,
      darkred: 9109504,
      darksalmon: 15308410,
      darkseagreen: 9419919,
      darkslateblue: 4734347,
      darkslategray: 3100495,
      darkslategrey: 3100495,
      darkturquoise: 52945,
      darkviolet: 9699539,
      deeppink: 16716947,
      deepskyblue: 49151,
      dimgray: 6908265,
      dimgrey: 6908265,
      dodgerblue: 2003199,
      firebrick: 11674146,
      floralwhite: 16775920,
      forestgreen: 2263842,
      fuchsia: 16711935,
      gainsboro: 14474460,
      ghostwhite: 16316671,
      gold: 16766720,
      goldenrod: 14329120,
      gray: 8421504,
      green: 32768,
      greenyellow: 11403055,
      grey: 8421504,
      honeydew: 15794160,
      hotpink: 16738740,
      indianred: 13458524,
      indigo: 4915330,
      ivory: 16777200,
      khaki: 15787660,
      lavender: 15132410,
      lavenderblush: 16773365,
      lawngreen: 8190976,
      lemonchiffon: 16775885,
      lightblue: 11393254,
      lightcoral: 15761536,
      lightcyan: 14745599,
      lightgoldenrodyellow: 16448210,
      lightgray: 13882323,
      lightgreen: 9498256,
      lightgrey: 13882323,
      lightpink: 16758465,
      lightsalmon: 16752762,
      lightseagreen: 2142890,
      lightskyblue: 8900346,
      lightslategray: 7833753,
      lightslategrey: 7833753,
      lightsteelblue: 11584734,
      lightyellow: 16777184,
      lime: 65280,
      limegreen: 3329330,
      linen: 16445670,
      magenta: 16711935,
      maroon: 8388608,
      mediumaquamarine: 6737322,
      mediumblue: 205,
      mediumorchid: 12211667,
      mediumpurple: 9662683,
      mediumseagreen: 3978097,
      mediumslateblue: 8087790,
      mediumspringgreen: 64154,
      mediumturquoise: 4772300,
      mediumvioletred: 13047173,
      midnightblue: 1644912,
      mintcream: 16121850,
      mistyrose: 16770273,
      moccasin: 16770229,
      navajowhite: 16768685,
      navy: 128,
      oldlace: 16643558,
      olive: 8421376,
      olivedrab: 7048739,
      orange: 16753920,
      orangered: 16729344,
      orchid: 14315734,
      palegoldenrod: 15657130,
      palegreen: 10025880,
      paleturquoise: 11529966,
      palevioletred: 14381203,
      papayawhip: 16773077,
      peachpuff: 16767673,
      peru: 13468991,
      pink: 16761035,
      plum: 14524637,
      powderblue: 11591910,
      purple: 8388736,
      rebeccapurple: 6697881,
      red: 16711680,
      rosybrown: 12357519,
      royalblue: 4286945,
      saddlebrown: 9127187,
      salmon: 16416882,
      sandybrown: 16032864,
      seagreen: 3050327,
      seashell: 16774638,
      sienna: 10506797,
      silver: 12632256,
      skyblue: 8900331,
      slateblue: 6970061,
      slategray: 7372944,
      slategrey: 7372944,
      snow: 16775930,
      springgreen: 65407,
      steelblue: 4620980,
      tan: 13808780,
      teal: 32896,
      thistle: 14204888,
      tomato: 16737095,
      turquoise: 4251856,
      violet: 15631086,
      wheat: 16113331,
      white: 16777215,
      whitesmoke: 16119285,
      yellow: 16776960,
      yellowgreen: 10145074
    },
    qi = { h: 0, s: 0, l: 0 },
    Pa = { h: 0, s: 0, l: 0 };
  function zh(i, t, e) {
    return (
      e < 0 && (e += 1),
      e > 1 && (e -= 1),
      e < 1 / 6 ?
      i + (t - i) * 6 * e :
      e < 1 / 2 ?
      t :
      e < 2 / 3 ?
      i + (t - i) * 6 * (2 / 3 - e) :
      i);

  }
  var wt = class {
      constructor(t, e, n) {
        return (
          this.isColor = !0,
          this.r = 1,
          this.g = 1,
          this.b = 1,
          this.set(t, e, n));

      }
      set(t, e, n) {
        if (e === void 0 && n === void 0) {
          let s = t;
          s && s.isColor ?
          this.copy(s) :
          typeof s == "number" ?
          this.setHex(s) :
          typeof s == "string" && this.setStyle(s);
        } else this.setRGB(t, e, n);
        return this;
      }
      setScalar(t) {
        return this.r = t, this.g = t, this.b = t, this;
      }
      setHex(t, e = rn) {
        return (
          t = Math.floor(t),
          this.r = (t >> 16 & 255) / 255,
          this.g = (t >> 8 & 255) / 255,
          this.b = (t & 255) / 255,
          ie.colorSpaceToWorking(this, e),
          this);

      }
      setRGB(t, e, n, s = ie.workingColorSpace) {
        return (
          this.r = t,
          this.g = e,
          this.b = n,
          ie.colorSpaceToWorking(this, s),
          this);

      }
      setHSL(t, e, n, s = ie.workingColorSpace) {
        if (t = bg(t, 1), e = re(e, 0, 1), n = re(n, 0, 1), e === 0)
        this.r = this.g = this.b = n;else
        {
          let r = n <= 0.5 ? n * (1 + e) : n + e - n * e,
            o = 2 * n - r;
          this.r = zh(o, r, t + 1 / 3),
          this.g = zh(o, r, t),
          this.b = zh(o, r, t - 1 / 3);
        }
        return ie.colorSpaceToWorking(this, s), this;
      }
      setStyle(t, e = rn) {
        function n(r) {
          r !== void 0 &&
          parseFloat(r) < 1 &&
          Ht("Color: Alpha component of " + t + " will be ignored.");
        }
        let s;
        if (s = /^(\w+)\(([^\)]*)\)/.exec(t)) {
          let r,
            o = s[1],
            a = s[2];
          switch (o) {
            case "rgb":
            case "rgba":
              if (
              r =
              /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                a
              ))

              return (
                n(r[4]),
                this.setRGB(
                  Math.min(255, parseInt(r[1], 10)) / 255,
                  Math.min(255, parseInt(r[2], 10)) / 255,
                  Math.min(255, parseInt(r[3], 10)) / 255,
                  e
                ));

              if (
              r =
              /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                a
              ))

              return (
                n(r[4]),
                this.setRGB(
                  Math.min(100, parseInt(r[1], 10)) / 100,
                  Math.min(100, parseInt(r[2], 10)) / 100,
                  Math.min(100, parseInt(r[3], 10)) / 100,
                  e
                ));

              break;
            case "hsl":
            case "hsla":
              if (
              r =
              /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                a
              ))

              return (
                n(r[4]),
                this.setHSL(
                  parseFloat(r[1]) / 360,
                  parseFloat(r[2]) / 100,
                  parseFloat(r[3]) / 100,
                  e
                ));

              break;
            default:
              Ht("Color: Unknown color model " + t);
          }
        } else if (s = /^\#([A-Fa-f\d]+)$/.exec(t)) {
          let r = s[1],
            o = r.length;
          if (o === 3)
          return this.setRGB(
            parseInt(r.charAt(0), 16) / 15,
            parseInt(r.charAt(1), 16) / 15,
            parseInt(r.charAt(2), 16) / 15,
            e
          );
          if (o === 6) return this.setHex(parseInt(r, 16), e);
          Ht("Color: Invalid hex color " + t);
        } else if (t && t.length > 0) return this.setColorName(t, e);
        return this;
      }
      setColorName(t, e = rn) {
        let n = zp[t.toLowerCase()];
        return (
          n !== void 0 ? this.setHex(n, e) : Ht("Color: Unknown color " + t),
          this);

      }
      clone() {
        return new this.constructor(this.r, this.g, this.b);
      }
      copy(t) {
        return this.r = t.r, this.g = t.g, this.b = t.b, this;
      }
      copySRGBToLinear(t) {
        return this.r = Ci(t.r), this.g = Ci(t.g), this.b = Ci(t.b), this;
      }
      copyLinearToSRGB(t) {
        return this.r = fr(t.r), this.g = fr(t.g), this.b = fr(t.b), this;
      }
      convertSRGBToLinear() {
        return this.copySRGBToLinear(this), this;
      }
      convertLinearToSRGB() {
        return this.copyLinearToSRGB(this), this;
      }
      getHex(t = rn) {
        return (
          ie.workingToColorSpace(pn.copy(this), t),
          Math.round(re(pn.r * 255, 0, 255)) * 65536 +
          Math.round(re(pn.g * 255, 0, 255)) * 256 +
          Math.round(re(pn.b * 255, 0, 255)));

      }
      getHexString(t = rn) {
        return ("000000" + this.getHex(t).toString(16)).slice(-6);
      }
      getHSL(t, e = ie.workingColorSpace) {
        ie.workingToColorSpace(pn.copy(this), e);
        let n = pn.r,
          s = pn.g,
          r = pn.b,
          o = Math.max(n, s, r),
          a = Math.min(n, s, r),
          l,
          c,
          h = (a + o) / 2;
        if (a === o) l = 0, c = 0;else
        {
          let d = o - a;
          switch (c = h <= 0.5 ? d / (o + a) : d / (2 - o - a), o) {
            case n:
              l = (s - r) / d + (s < r ? 6 : 0);
              break;
            case s:
              l = (r - n) / d + 2;
              break;
            case r:
              l = (n - s) / d + 4;
              break;
          }
          l /= 6;
        }
        return t.h = l, t.s = c, t.l = h, t;
      }
      getRGB(t, e = ie.workingColorSpace) {
        return (
          ie.workingToColorSpace(pn.copy(this), e),
          t.r = pn.r,
          t.g = pn.g,
          t.b = pn.b,
          t);

      }
      getStyle(t = rn) {
        ie.workingToColorSpace(pn.copy(this), t);
        let e = pn.r,
          n = pn.g,
          s = pn.b;
        return t !== rn ?
        `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})` :
        `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
      }
      offsetHSL(t, e, n) {
        return this.getHSL(qi), this.setHSL(qi.h + t, qi.s + e, qi.l + n);
      }
      add(t) {
        return this.r += t.r, this.g += t.g, this.b += t.b, this;
      }
      addColors(t, e) {
        return (
          this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this);

      }
      addScalar(t) {
        return this.r += t, this.g += t, this.b += t, this;
      }
      sub(t) {
        return (
          this.r = Math.max(0, this.r - t.r),
          this.g = Math.max(0, this.g - t.g),
          this.b = Math.max(0, this.b - t.b),
          this);

      }
      multiply(t) {
        return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
      }
      multiplyScalar(t) {
        return this.r *= t, this.g *= t, this.b *= t, this;
      }
      lerp(t, e) {
        return (
          this.r += (t.r - this.r) * e,
          this.g += (t.g - this.g) * e,
          this.b += (t.b - this.b) * e,
          this);

      }
      lerpColors(t, e, n) {
        return (
          this.r = t.r + (e.r - t.r) * n,
          this.g = t.g + (e.g - t.g) * n,
          this.b = t.b + (e.b - t.b) * n,
          this);

      }
      lerpHSL(t, e) {
        this.getHSL(qi), t.getHSL(Pa);
        let n = Ch(qi.h, Pa.h, e),
          s = Ch(qi.s, Pa.s, e),
          r = Ch(qi.l, Pa.l, e);
        return this.setHSL(n, s, r), this;
      }
      setFromVector3(t) {
        return this.r = t.x, this.g = t.y, this.b = t.z, this;
      }
      applyMatrix3(t) {
        let e = this.r,
          n = this.g,
          s = this.b,
          r = t.elements;
        return (
          this.r = r[0] * e + r[3] * n + r[6] * s,
          this.g = r[1] * e + r[4] * n + r[7] * s,
          this.b = r[2] * e + r[5] * n + r[8] * s,
          this);

      }
      equals(t) {
        return t.r === this.r && t.g === this.g && t.b === this.b;
      }
      fromArray(t, e = 0) {
        return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
      }
      toArray(t = [], e = 0) {
        return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
      }
      fromBufferAttribute(t, e) {
        return (
          this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this);

      }
      toJSON() {
        return this.getHex();
      }
      *[Symbol.iterator]() {
        yield this.r, yield this.g, yield this.b;
      }
    },
    pn = new wt();
  wt.NAMES = zp;
  var wo = class i {
      constructor(t, e = 1, n = 1e3) {
        this.isFog = !0,
        this.name = "",
        this.color = new wt(t),
        this.near = e,
        this.far = n;
      }
      clone() {
        return new i(this.color, this.near, this.far);
      }
      toJSON() {
        return {
          type: "Fog",
          name: this.name,
          color: this.color.getHex(),
          near: this.near,
          far: this.far
        };
      }
    },
    _r = class extends Je {
      constructor() {
        super(),
        this.isScene = !0,
        this.type = "Scene",
        this.background = null,
        this.environment = null,
        this.fog = null,
        this.backgroundBlurriness = 0,
        this.backgroundIntensity = 1,
        this.backgroundRotation = new bn(),
        this.environmentIntensity = 1,
        this.environmentRotation = new bn(),
        this.overrideMaterial = null,
        typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this })
        );
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          t.background !== null && (this.background = t.background.clone()),
          t.environment !== null && (this.environment = t.environment.clone()),
          t.fog !== null && (this.fog = t.fog.clone()),
          this.backgroundBlurriness = t.backgroundBlurriness,
          this.backgroundIntensity = t.backgroundIntensity,
          this.backgroundRotation.copy(t.backgroundRotation),
          this.environmentIntensity = t.environmentIntensity,
          this.environmentRotation.copy(t.environmentRotation),
          t.overrideMaterial !== null && (
          this.overrideMaterial = t.overrideMaterial.clone()),
          this.matrixAutoUpdate = t.matrixAutoUpdate,
          this);

      }
      toJSON(t) {
        let e = super.toJSON(t);
        return (
          this.fog !== null && (e.object.fog = this.fog.toJSON()),
          e.object.backgroundBlurriness = this.backgroundBlurriness,
          e.object.backgroundIntensity = this.backgroundIntensity,
          e.object.backgroundRotation = this.backgroundRotation.toArray(),
          e.object.environmentIntensity = this.environmentIntensity,
          e.object.environmentRotation = this.environmentRotation.toArray(),
          e);

      }
    },
    qn = new z(),
    Ei = new z(),
    Uh = new z(),
    Ti = new z(),
    Qs = new z(),
    tr = new z(),
    If = new z(),
    Fh = new z(),
    Oh = new z(),
    Bh = new z(),
    Hh = new De(),
    Vh = new De(),
    Gh = new De(),
    ki = class i {
      constructor(t = new z(), e = new z(), n = new z()) {
        this.a = t, this.b = e, this.c = n;
      }
      static getNormal(t, e, n, s) {
        s.subVectors(n, e), qn.subVectors(t, e), s.cross(qn);
        let r = s.lengthSq();
        return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
      }
      static getBarycoord(t, e, n, s, r) {
        qn.subVectors(s, e), Ei.subVectors(n, e), Uh.subVectors(t, e);
        let o = qn.dot(qn),
          a = qn.dot(Ei),
          l = qn.dot(Uh),
          c = Ei.dot(Ei),
          h = Ei.dot(Uh),
          d = o * c - a * a;
        if (d === 0) return r.set(0, 0, 0), null;
        let u = 1 / d,
          f = (c * l - a * h) * u,
          p = (o * h - a * l) * u;
        return r.set(1 - f - p, p, f);
      }
      static containsPoint(t, e, n, s) {
        return this.getBarycoord(t, e, n, s, Ti) === null ?
        !1 :
        Ti.x >= 0 && Ti.y >= 0 && Ti.x + Ti.y <= 1;
      }
      static getInterpolation(t, e, n, s, r, o, a, l) {
        return this.getBarycoord(t, e, n, s, Ti) === null ? (
        l.x = 0,
        l.y = 0,
        "z" in l && (l.z = 0),
        "w" in l && (l.w = 0),
        null) : (
        l.setScalar(0),
        l.addScaledVector(r, Ti.x),
        l.addScaledVector(o, Ti.y),
        l.addScaledVector(a, Ti.z),
        l);
      }
      static getInterpolatedAttribute(t, e, n, s, r, o) {
        return (
          Hh.setScalar(0),
          Vh.setScalar(0),
          Gh.setScalar(0),
          Hh.fromBufferAttribute(t, e),
          Vh.fromBufferAttribute(t, n),
          Gh.fromBufferAttribute(t, s),
          o.setScalar(0),
          o.addScaledVector(Hh, r.x),
          o.addScaledVector(Vh, r.y),
          o.addScaledVector(Gh, r.z),
          o);

      }
      static isFrontFacing(t, e, n, s) {
        return (
          qn.subVectors(n, e), Ei.subVectors(t, e), qn.cross(Ei).dot(s) < 0);

      }
      set(t, e, n) {
        return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
      }
      setFromPointsAndIndices(t, e, n, s) {
        return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[s]), this;
      }
      setFromAttributeAndIndices(t, e, n, s) {
        return (
          this.a.fromBufferAttribute(t, e),
          this.b.fromBufferAttribute(t, n),
          this.c.fromBufferAttribute(t, s),
          this);

      }
      clone() {
        return new this.constructor().copy(this);
      }
      copy(t) {
        return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
      }
      getArea() {
        return (
          qn.subVectors(this.c, this.b),
          Ei.subVectors(this.a, this.b),
          qn.cross(Ei).length() * 0.5);

      }
      getMidpoint(t) {
        return t.
        addVectors(this.a, this.b).
        add(this.c).
        multiplyScalar(1 / 3);
      }
      getNormal(t) {
        return i.getNormal(this.a, this.b, this.c, t);
      }
      getPlane(t) {
        return t.setFromCoplanarPoints(this.a, this.b, this.c);
      }
      getBarycoord(t, e) {
        return i.getBarycoord(t, this.a, this.b, this.c, e);
      }
      getInterpolation(t, e, n, s, r) {
        return i.getInterpolation(t, this.a, this.b, this.c, e, n, s, r);
      }
      containsPoint(t) {
        return i.containsPoint(t, this.a, this.b, this.c);
      }
      isFrontFacing(t) {
        return i.isFrontFacing(this.a, this.b, this.c, t);
      }
      intersectsBox(t) {
        return t.intersectsTriangle(this);
      }
      closestPointToPoint(t, e) {
        let n = this.a,
          s = this.b,
          r = this.c,
          o,
          a;
        Qs.subVectors(s, n), tr.subVectors(r, n), Fh.subVectors(t, n);
        let l = Qs.dot(Fh),
          c = tr.dot(Fh);
        if (l <= 0 && c <= 0) return e.copy(n);
        Oh.subVectors(t, s);
        let h = Qs.dot(Oh),
          d = tr.dot(Oh);
        if (h >= 0 && d <= h) return e.copy(s);
        let u = l * d - h * c;
        if (u <= 0 && l >= 0 && h <= 0)
        return o = l / (l - h), e.copy(n).addScaledVector(Qs, o);
        Bh.subVectors(t, r);
        let f = Qs.dot(Bh),
          p = tr.dot(Bh);
        if (p >= 0 && f <= p) return e.copy(r);
        let x = f * c - l * p;
        if (x <= 0 && c >= 0 && p <= 0)
        return a = c / (c - p), e.copy(n).addScaledVector(tr, a);
        let g = h * p - f * d;
        if (g <= 0 && d - h >= 0 && f - p >= 0)
        return (
          If.subVectors(r, s),
          a = (d - h) / (d - h + (f - p)),
          e.copy(s).addScaledVector(If, a));

        let m = 1 / (g + x + u);
        return (
          o = x * m,
          a = u * m,
          e.copy(n).addScaledVector(Qs, o).addScaledVector(tr, a));

      }
      equals(t) {
        return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
      }
    },
    fi = class {
      constructor(
      t = new z(1 / 0, 1 / 0, 1 / 0),
      e = new z(-1 / 0, -1 / 0, -1 / 0))
      {
        this.isBox3 = !0, this.min = t, this.max = e;
      }
      set(t, e) {
        return this.min.copy(t), this.max.copy(e), this;
      }
      setFromArray(t) {
        this.makeEmpty();
        for (let e = 0, n = t.length; e < n; e += 3)
        this.expandByPoint(Yn.fromArray(t, e));
        return this;
      }
      setFromBufferAttribute(t) {
        this.makeEmpty();
        for (let e = 0, n = t.count; e < n; e++)
        this.expandByPoint(Yn.fromBufferAttribute(t, e));
        return this;
      }
      setFromPoints(t) {
        this.makeEmpty();
        for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
        return this;
      }
      setFromCenterAndSize(t, e) {
        let n = Yn.copy(e).multiplyScalar(0.5);
        return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
      }
      setFromObject(t, e = !1) {
        return this.makeEmpty(), this.expandByObject(t, e);
      }
      clone() {
        return new this.constructor().copy(this);
      }
      copy(t) {
        return this.min.copy(t.min), this.max.copy(t.max), this;
      }
      makeEmpty() {
        return (
          this.min.x = this.min.y = this.min.z = 1 / 0,
          this.max.x = this.max.y = this.max.z = -1 / 0,
          this);

      }
      isEmpty() {
        return (
          this.max.x < this.min.x ||
          this.max.y < this.min.y ||
          this.max.z < this.min.z);

      }
      getCenter(t) {
        return this.isEmpty() ?
        t.set(0, 0, 0) :
        t.addVectors(this.min, this.max).multiplyScalar(0.5);
      }
      getSize(t) {
        return this.isEmpty() ?
        t.set(0, 0, 0) :
        t.subVectors(this.max, this.min);
      }
      expandByPoint(t) {
        return this.min.min(t), this.max.max(t), this;
      }
      expandByVector(t) {
        return this.min.sub(t), this.max.add(t), this;
      }
      expandByScalar(t) {
        return this.min.addScalar(-t), this.max.addScalar(t), this;
      }
      expandByObject(t, e = !1) {
        t.updateWorldMatrix(!1, !1);
        let n = t.geometry;
        if (n !== void 0) {
          let r = n.getAttribute("position");
          if (e === !0 && r !== void 0 && t.isInstancedMesh !== !0)
          for (let o = 0, a = r.count; o < a; o++)
          t.isMesh === !0 ?
          t.getVertexPosition(o, Yn) :
          Yn.fromBufferAttribute(r, o),
          Yn.applyMatrix4(t.matrixWorld),
          this.expandByPoint(Yn);else

          t.boundingBox !== void 0 ? (
          t.boundingBox === null && t.computeBoundingBox(),
          La.copy(t.boundingBox)) : (
          n.boundingBox === null && n.computeBoundingBox(),
          La.copy(n.boundingBox)),
          La.applyMatrix4(t.matrixWorld),
          this.union(La);
        }
        let s = t.children;
        for (let r = 0, o = s.length; r < o; r++) this.expandByObject(s[r], e);
        return this;
      }
      containsPoint(t) {
        return (
          t.x >= this.min.x &&
          t.x <= this.max.x &&
          t.y >= this.min.y &&
          t.y <= this.max.y &&
          t.z >= this.min.z &&
          t.z <= this.max.z);

      }
      containsBox(t) {
        return (
          this.min.x <= t.min.x &&
          t.max.x <= this.max.x &&
          this.min.y <= t.min.y &&
          t.max.y <= this.max.y &&
          this.min.z <= t.min.z &&
          t.max.z <= this.max.z);

      }
      getParameter(t, e) {
        return e.set(
          (t.x - this.min.x) / (this.max.x - this.min.x),
          (t.y - this.min.y) / (this.max.y - this.min.y),
          (t.z - this.min.z) / (this.max.z - this.min.z)
        );
      }
      intersectsBox(t) {
        return (
          t.max.x >= this.min.x &&
          t.min.x <= this.max.x &&
          t.max.y >= this.min.y &&
          t.min.y <= this.max.y &&
          t.max.z >= this.min.z &&
          t.min.z <= this.max.z);

      }
      intersectsSphere(t) {
        return (
          this.clampPoint(t.center, Yn),
          Yn.distanceToSquared(t.center) <= t.radius * t.radius);

      }
      intersectsPlane(t) {
        let e, n;
        return (
          t.normal.x > 0 ? (
          e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (
          e = t.normal.x * this.max.x, n = t.normal.x * this.min.x),
          t.normal.y > 0 ? (
          e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (
          e += t.normal.y * this.max.y, n += t.normal.y * this.min.y),
          t.normal.z > 0 ? (
          e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (
          e += t.normal.z * this.max.z, n += t.normal.z * this.min.z),
          e <= -t.constant && n >= -t.constant);

      }
      intersectsTriangle(t) {
        if (this.isEmpty()) return !1;
        this.getCenter(lo),
        Da.subVectors(this.max, lo),
        er.subVectors(t.a, lo),
        nr.subVectors(t.b, lo),
        ir.subVectors(t.c, lo),
        Yi.subVectors(nr, er),
        Zi.subVectors(ir, nr),
        vs.subVectors(er, ir);
        let e = [
        0,
        -Yi.z,
        Yi.y,
        0,
        -Zi.z,
        Zi.y,
        0,
        -vs.z,
        vs.y,
        Yi.z,
        0,
        -Yi.x,
        Zi.z,
        0,
        -Zi.x,
        vs.z,
        0,
        -vs.x,
        -Yi.y,
        Yi.x,
        0,
        -Zi.y,
        Zi.x,
        0,
        -vs.y,
        vs.x,
        0];

        return !Wh(e, er, nr, ir, Da) || (
        e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Wh(e, er, nr, ir, Da)) ?
        !1 : (
        Na.crossVectors(Yi, Zi),
        e = [Na.x, Na.y, Na.z],
        Wh(e, er, nr, ir, Da));
      }
      clampPoint(t, e) {
        return e.copy(t).clamp(this.min, this.max);
      }
      distanceToPoint(t) {
        return this.clampPoint(t, Yn).distanceTo(t);
      }
      getBoundingSphere(t) {
        return (
          this.isEmpty() ?
          t.makeEmpty() : (
          this.getCenter(t.center),
          t.radius = this.getSize(Yn).length() * 0.5),
          t);

      }
      intersect(t) {
        return (
          this.min.max(t.min),
          this.max.min(t.max),
          this.isEmpty() && this.makeEmpty(),
          this);

      }
      union(t) {
        return this.min.min(t.min), this.max.max(t.max), this;
      }
      applyMatrix4(t) {
        return this.isEmpty() ?
        this : (
        Ai[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t),
        Ai[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t),
        Ai[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t),
        Ai[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t),
        Ai[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t),
        Ai[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t),
        Ai[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t),
        Ai[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t),
        this.setFromPoints(Ai),
        this);
      }
      translate(t) {
        return this.min.add(t), this.max.add(t), this;
      }
      equals(t) {
        return t.min.equals(this.min) && t.max.equals(this.max);
      }
      toJSON() {
        return { min: this.min.toArray(), max: this.max.toArray() };
      }
      fromJSON(t) {
        return this.min.fromArray(t.min), this.max.fromArray(t.max), this;
      }
    },
    Ai = [
    new z(),
    new z(),
    new z(),
    new z(),
    new z(),
    new z(),
    new z(),
    new z()],

    Yn = new z(),
    La = new fi(),
    er = new z(),
    nr = new z(),
    ir = new z(),
    Yi = new z(),
    Zi = new z(),
    vs = new z(),
    lo = new z(),
    Da = new z(),
    Na = new z(),
    _s = new z();
  function Wh(i, t, e, n, s) {
    for (let r = 0, o = i.length - 3; r <= o; r += 3) {
      _s.fromArray(i, r);
      let a =
        s.x * Math.abs(_s.x) + s.y * Math.abs(_s.y) + s.z * Math.abs(_s.z),
        l = t.dot(_s),
        c = e.dot(_s),
        h = n.dot(_s);
      if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > a) return !1;
    }
    return !0;
  }
  var Ye = new z(),
    za = new Vt(),
    Pg = 0,
    Le = class extends di {
      constructor(t, e, n = !1) {
        if (super(), Array.isArray(t))
        throw new TypeError(
          "THREE.BufferAttribute: array should be a Typed Array."
        );
        this.isBufferAttribute = !0,
        Object.defineProperty(this, "id", { value: Pg++ }),
        this.name = "",
        this.array = t,
        this.itemSize = e,
        this.count = t !== void 0 ? t.length / e : 0,
        this.normalized = n,
        this.usage = Cu,
        this.updateRanges = [],
        this.gpuType = Fn,
        this.version = 0;
      }
      onUploadCallback() {}
      set needsUpdate(t) {
        t === !0 && this.version++;
      }
      setUsage(t) {
        return this.usage = t, this;
      }
      addUpdateRange(t, e) {
        this.updateRanges.push({ start: t, count: e });
      }
      clearUpdateRanges() {
        this.updateRanges.length = 0;
      }
      copy(t) {
        return (
          this.name = t.name,
          this.array = new t.array.constructor(t.array),
          this.itemSize = t.itemSize,
          this.count = t.count,
          this.normalized = t.normalized,
          this.usage = t.usage,
          this.gpuType = t.gpuType,
          this);

      }
      copyAt(t, e, n) {
        t *= this.itemSize, n *= e.itemSize;
        for (let s = 0, r = this.itemSize; s < r; s++)
        this.array[t + s] = e.array[n + s];
        return this;
      }
      copyArray(t) {
        return this.array.set(t), this;
      }
      applyMatrix3(t) {
        if (this.itemSize === 2)
        for (let e = 0, n = this.count; e < n; e++)
        za.fromBufferAttribute(this, e),
        za.applyMatrix3(t),
        this.setXY(e, za.x, za.y);else
        if (this.itemSize === 3)
        for (let e = 0, n = this.count; e < n; e++)
        Ye.fromBufferAttribute(this, e),
        Ye.applyMatrix3(t),
        this.setXYZ(e, Ye.x, Ye.y, Ye.z);
        return this;
      }
      applyMatrix4(t) {
        for (let e = 0, n = this.count; e < n; e++)
        Ye.fromBufferAttribute(this, e),
        Ye.applyMatrix4(t),
        this.setXYZ(e, Ye.x, Ye.y, Ye.z);
        return this;
      }
      applyNormalMatrix(t) {
        for (let e = 0, n = this.count; e < n; e++)
        Ye.fromBufferAttribute(this, e),
        Ye.applyNormalMatrix(t),
        this.setXYZ(e, Ye.x, Ye.y, Ye.z);
        return this;
      }
      transformDirection(t) {
        for (let e = 0, n = this.count; e < n; e++)
        Ye.fromBufferAttribute(this, e),
        Ye.transformDirection(t),
        this.setXYZ(e, Ye.x, Ye.y, Ye.z);
        return this;
      }
      set(t, e = 0) {
        return this.array.set(t, e), this;
      }
      getComponent(t, e) {
        let n = this.array[t * this.itemSize + e];
        return this.normalized && (n = ci(n, this.array)), n;
      }
      setComponent(t, e, n) {
        return (
          this.normalized && (n = _e(n, this.array)),
          this.array[t * this.itemSize + e] = n,
          this);

      }
      getX(t) {
        let e = this.array[t * this.itemSize];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      setX(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.array[t * this.itemSize] = e,
          this);

      }
      getY(t) {
        let e = this.array[t * this.itemSize + 1];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      setY(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.array[t * this.itemSize + 1] = e,
          this);

      }
      getZ(t) {
        let e = this.array[t * this.itemSize + 2];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      setZ(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.array[t * this.itemSize + 2] = e,
          this);

      }
      getW(t) {
        let e = this.array[t * this.itemSize + 3];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      setW(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.array[t * this.itemSize + 3] = e,
          this);

      }
      setXY(t, e, n) {
        return (
          t *= this.itemSize,
          this.normalized && (e = _e(e, this.array), n = _e(n, this.array)),
          this.array[t + 0] = e,
          this.array[t + 1] = n,
          this);

      }
      setXYZ(t, e, n, s) {
        return (
          t *= this.itemSize,
          this.normalized && (
          e = _e(e, this.array),
          n = _e(n, this.array),
          s = _e(s, this.array)),
          this.array[t + 0] = e,
          this.array[t + 1] = n,
          this.array[t + 2] = s,
          this);

      }
      setXYZW(t, e, n, s, r) {
        return (
          t *= this.itemSize,
          this.normalized && (
          e = _e(e, this.array),
          n = _e(n, this.array),
          s = _e(s, this.array),
          r = _e(r, this.array)),
          this.array[t + 0] = e,
          this.array[t + 1] = n,
          this.array[t + 2] = s,
          this.array[t + 3] = r,
          this);

      }
      onUpload(t) {
        return this.onUploadCallback = t, this;
      }
      clone() {
        return new this.constructor(this.array, this.itemSize).copy(this);
      }
      toJSON() {
        let t = {
          itemSize: this.itemSize,
          type: this.array.constructor.name,
          array: Array.from(this.array),
          normalized: this.normalized
        };
        return (
          t.name = this.name,
          t.usage = this.usage,
          t.gpuType = this.gpuType,
          t);

      }
      dispose() {
        this.dispatchEvent({ type: "dispose" });
      }
    };
  var Eo = class extends Le {
    constructor(t, e, n) {
      super(new Uint16Array(t), e, n);
    }
  };
  var To = class extends Le {
    constructor(t, e, n) {
      super(new Uint32Array(t), e, n);
    }
  };
  var Zt = class extends Le {
      constructor(t, e, n) {
        super(new Float32Array(t), e, n);
      }
    },
    Lg = new fi(),
    co = new z(),
    Xh = new z(),
    pi = class {
      constructor(t = new z(), e = -1) {
        this.isSphere = !0, this.center = t, this.radius = e;
      }
      set(t, e) {
        return this.center.copy(t), this.radius = e, this;
      }
      setFromPoints(t, e) {
        let n = this.center;
        e !== void 0 ? n.copy(e) : Lg.setFromPoints(t).getCenter(n);
        let s = 0;
        for (let r = 0, o = t.length; r < o; r++)
        s = Math.max(s, n.distanceToSquared(t[r]));
        return this.radius = Math.sqrt(s), this;
      }
      copy(t) {
        return this.center.copy(t.center), this.radius = t.radius, this;
      }
      isEmpty() {
        return this.radius < 0;
      }
      makeEmpty() {
        return this.center.set(0, 0, 0), this.radius = -1, this;
      }
      containsPoint(t) {
        return t.distanceToSquared(this.center) <= this.radius * this.radius;
      }
      distanceToPoint(t) {
        return t.distanceTo(this.center) - this.radius;
      }
      intersectsSphere(t) {
        let e = this.radius + t.radius;
        return t.center.distanceToSquared(this.center) <= e * e;
      }
      intersectsBox(t) {
        return t.intersectsSphere(this);
      }
      intersectsPlane(t) {
        return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
      }
      clampPoint(t, e) {
        let n = this.center.distanceToSquared(t);
        return (
          e.copy(t),
          n > this.radius * this.radius && (
          e.sub(this.center).normalize(),
          e.multiplyScalar(this.radius).add(this.center)),
          e);

      }
      getBoundingBox(t) {
        return this.isEmpty() ? (
        t.makeEmpty(), t) : (
        t.set(this.center, this.center), t.expandByScalar(this.radius), t);
      }
      applyMatrix4(t) {
        return (
          this.center.applyMatrix4(t),
          this.radius = this.radius * t.getMaxScaleOnAxis(),
          this);

      }
      translate(t) {
        return this.center.add(t), this;
      }
      expandByPoint(t) {
        if (this.isEmpty()) return this.center.copy(t), this.radius = 0, this;
        co.subVectors(t, this.center);
        let e = co.lengthSq();
        if (e > this.radius * this.radius) {
          let n = Math.sqrt(e),
            s = (n - this.radius) * 0.5;
          this.center.addScaledVector(co, s / n), this.radius += s;
        }
        return this;
      }
      union(t) {
        return t.isEmpty() ?
        this :
        this.isEmpty() ? (
        this.copy(t), this) : (
        this.center.equals(t.center) === !0 ?
        this.radius = Math.max(this.radius, t.radius) : (
        Xh.subVectors(t.center, this.center).setLength(t.radius),
        this.expandByPoint(co.copy(t.center).add(Xh)),
        this.expandByPoint(co.copy(t.center).sub(Xh))),
        this);
      }
      equals(t) {
        return t.center.equals(this.center) && t.radius === this.radius;
      }
      clone() {
        return new this.constructor().copy(this);
      }
      toJSON() {
        return { radius: this.radius, center: this.center.toArray() };
      }
      fromJSON(t) {
        return this.radius = t.radius, this.center.fromArray(t.center), this;
      }
    },
    Dg = 0,
    zn = new se(),
    $h = new Je(),
    sr = new z(),
    Cn = new fi(),
    ho = new fi(),
    sn = new z(),
    ye = class i extends di {
      constructor() {
        super(),
        this.isBufferGeometry = !0,
        Object.defineProperty(this, "id", { value: Dg++ }),
        this.uuid = ji(),
        this.name = "",
        this.type = "BufferGeometry",
        this.index = null,
        this.indirect = null,
        this.indirectOffset = 0,
        this.attributes = {},
        this.morphAttributes = {},
        this.morphTargetsRelative = !1,
        this.groups = [],
        this.boundingBox = null,
        this.boundingSphere = null,
        this.drawRange = { start: 0, count: 1 / 0 },
        this.userData = {},
        this._transformed = !1;
      }
      getIndex() {
        return this.index;
      }
      setIndex(t) {
        return (
          Array.isArray(t) ?
          this.index = new (vg(t) ? To : Eo)(t, 1) :
          this.index = t,
          this);

      }
      setIndirect(t, e = 0) {
        return this.indirect = t, this.indirectOffset = e, this;
      }
      getIndirect() {
        return this.indirect;
      }
      getAttribute(t) {
        return this.attributes[t];
      }
      setAttribute(t, e) {
        return this.attributes[t] = e, this;
      }
      deleteAttribute(t) {
        return delete this.attributes[t], this;
      }
      hasAttribute(t) {
        return this.attributes[t] !== void 0;
      }
      addGroup(t, e, n = 0) {
        this.groups.push({ start: t, count: e, materialIndex: n });
      }
      clearGroups() {
        this.groups = [];
      }
      setDrawRange(t, e) {
        this.drawRange.start = t, this.drawRange.count = e;
      }
      applyMatrix4(t) {
        let e = this.attributes.position;
        e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = !0);
        let n = this.attributes.normal;
        if (n !== void 0) {
          let r = new Wt().getNormalMatrix(t);
          n.applyNormalMatrix(r), n.needsUpdate = !0;
        }
        let s = this.attributes.tangent;
        return (
          s !== void 0 && (s.transformDirection(t), s.needsUpdate = !0),
          this.boundingBox !== null && this.computeBoundingBox(),
          this.boundingSphere !== null && this.computeBoundingSphere(),
          this._transformed = !0,
          this);

      }
      applyQuaternion(t) {
        return zn.makeRotationFromQuaternion(t), this.applyMatrix4(zn), this;
      }
      rotateX(t) {
        return zn.makeRotationX(t), this.applyMatrix4(zn), this;
      }
      rotateY(t) {
        return zn.makeRotationY(t), this.applyMatrix4(zn), this;
      }
      rotateZ(t) {
        return zn.makeRotationZ(t), this.applyMatrix4(zn), this;
      }
      translate(t, e, n) {
        return zn.makeTranslation(t, e, n), this.applyMatrix4(zn), this;
      }
      scale(t, e, n) {
        return zn.makeScale(t, e, n), this.applyMatrix4(zn), this;
      }
      lookAt(t) {
        return (
          $h.lookAt(t), $h.updateMatrix(), this.applyMatrix4($h.matrix), this);

      }
      center() {
        return (
          this.computeBoundingBox(),
          this.boundingBox.getCenter(sr).negate(),
          this.translate(sr.x, sr.y, sr.z),
          this);

      }
      setFromPoints(t) {
        let e = this.getAttribute("position");
        if (e === void 0) {
          let n = [];
          for (let s = 0, r = t.length; s < r; s++) {
            let o = t[s];
            n.push(o.x, o.y, o.z || 0);
          }
          this.setAttribute("position", new Zt(n, 3));
        } else {
          let n = Math.min(t.length, e.count);
          for (let s = 0; s < n; s++) {
            let r = t[s];
            e.setXYZ(s, r.x, r.y, r.z || 0);
          }
          t.length > e.count &&
          Ht(
            "BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."
          ),
          e.needsUpdate = !0;
        }
        return this;
      }
      computeBoundingBox() {
        this.boundingBox === null && (this.boundingBox = new fi());
        let t = this.attributes.position,
          e = this.morphAttributes.position;
        if (t && t.isGLBufferAttribute) {
          Gt(
            "BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",
            this
          ),
          this.boundingBox.set(
            new z(-1 / 0, -1 / 0, -1 / 0),
            new z(1 / 0, 1 / 0, 1 / 0)
          );
          return;
        }
        if (t !== void 0) {
          if (this.boundingBox.setFromBufferAttribute(t), e)
          for (let n = 0, s = e.length; n < s; n++) {
            let r = e[n];
            Cn.setFromBufferAttribute(r),
            this.morphTargetsRelative ? (
            sn.addVectors(this.boundingBox.min, Cn.min),
            this.boundingBox.expandByPoint(sn),
            sn.addVectors(this.boundingBox.max, Cn.max),
            this.boundingBox.expandByPoint(sn)) : (
            this.boundingBox.expandByPoint(Cn.min),
            this.boundingBox.expandByPoint(Cn.max));
          }
        } else this.boundingBox.makeEmpty();
        (isNaN(this.boundingBox.min.x) ||
        isNaN(this.boundingBox.min.y) ||
        isNaN(this.boundingBox.min.z)) &&
        Gt(
          'BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
          this
        );
      }
      computeBoundingSphere() {
        this.boundingSphere === null && (this.boundingSphere = new pi());
        let t = this.attributes.position,
          e = this.morphAttributes.position;
        if (t && t.isGLBufferAttribute) {
          Gt(
            "BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",
            this
          ),
          this.boundingSphere.set(new z(), 1 / 0);
          return;
        }
        if (t) {
          let n = this.boundingSphere.center;
          if (Cn.setFromBufferAttribute(t), e)
          for (let r = 0, o = e.length; r < o; r++) {
            let a = e[r];
            ho.setFromBufferAttribute(a),
            this.morphTargetsRelative ? (
            sn.addVectors(Cn.min, ho.min),
            Cn.expandByPoint(sn),
            sn.addVectors(Cn.max, ho.max),
            Cn.expandByPoint(sn)) : (
            Cn.expandByPoint(ho.min), Cn.expandByPoint(ho.max));
          }
          Cn.getCenter(n);
          let s = 0;
          for (let r = 0, o = t.count; r < o; r++)
          sn.fromBufferAttribute(t, r),
          s = Math.max(s, n.distanceToSquared(sn));
          if (e)
          for (let r = 0, o = e.length; r < o; r++) {
            let a = e[r],
              l = this.morphTargetsRelative;
            for (let c = 0, h = a.count; c < h; c++)
            sn.fromBufferAttribute(a, c),
            l && (sr.fromBufferAttribute(t, c), sn.add(sr)),
            s = Math.max(s, n.distanceToSquared(sn));
          }
          this.boundingSphere.radius = Math.sqrt(s),
          isNaN(this.boundingSphere.radius) &&
          Gt(
            'BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
            this
          );
        }
      }
      computeTangents() {
        let t = this.index,
          e = this.attributes;
        if (
        t === null ||
        e.position === void 0 ||
        e.normal === void 0 ||
        e.uv === void 0)
        {
          Gt(
            "BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)"
          );
          return;
        }
        let n = e.position,
          s = e.normal,
          r = e.uv,
          o = this.getAttribute("tangent");
        (o === void 0 || o.count !== n.count) && (
        o = new Le(new Float32Array(4 * n.count), 4),
        this.setAttribute("tangent", o));
        let a = [],
          l = [];
        for (let v = 0; v < n.count; v++) a[v] = new z(), l[v] = new z();
        let c = new z(),
          h = new z(),
          d = new z(),
          u = new Vt(),
          f = new Vt(),
          p = new Vt(),
          x = new z(),
          g = new z();
        function m(v, E, R) {
          c.fromBufferAttribute(n, v),
          h.fromBufferAttribute(n, E),
          d.fromBufferAttribute(n, R),
          u.fromBufferAttribute(r, v),
          f.fromBufferAttribute(r, E),
          p.fromBufferAttribute(r, R),
          h.sub(c),
          d.sub(c),
          f.sub(u),
          p.sub(u);
          let P = 1 / (f.x * p.y - p.x * f.y);
          isFinite(P) && (
          x.
          copy(h).
          multiplyScalar(p.y).
          addScaledVector(d, -f.y).
          multiplyScalar(P),
          g.
          copy(d).
          multiplyScalar(f.x).
          addScaledVector(h, -p.x).
          multiplyScalar(P),
          a[v].add(x),
          a[E].add(x),
          a[R].add(x),
          l[v].add(g),
          l[E].add(g),
          l[R].add(g));
        }
        let b = this.groups;
        b.length === 0 && (b = [{ start: 0, count: t.count }]);
        for (let v = 0, E = b.length; v < E; ++v) {
          let R = b[v],
            P = R.start,
            N = R.count;
          for (let B = P, D = P + N; B < D; B += 3)
          m(t.getX(B + 0), t.getX(B + 1), t.getX(B + 2));
        }
        let T = new z(),
          y = new z(),
          S = new z(),
          M = new z();
        function A(v) {
          S.fromBufferAttribute(s, v), M.copy(S);
          let E = a[v];
          T.copy(E),
          T.sub(S.multiplyScalar(S.dot(E))).normalize(),
          y.crossVectors(M, E);
          let P = y.dot(l[v]) < 0 ? -1 : 1;
          o.setXYZW(v, T.x, T.y, T.z, P);
        }
        for (let v = 0, E = b.length; v < E; ++v) {
          let R = b[v],
            P = R.start,
            N = R.count;
          for (let B = P, D = P + N; B < D; B += 3)
          A(t.getX(B + 0)), A(t.getX(B + 1)), A(t.getX(B + 2));
        }
        this._transformed = !0;
      }
      computeVertexNormals() {
        let t = this.index,
          e = this.getAttribute("position");
        if (e !== void 0) {
          let n = this.getAttribute("normal");
          if (n === void 0 || n.count !== e.count)
          n = new Le(new Float32Array(e.count * 3), 3),
          this.setAttribute("normal", n);else
          for (let u = 0, f = n.count; u < f; u++) n.setXYZ(u, 0, 0, 0);
          let s = new z(),
            r = new z(),
            o = new z(),
            a = new z(),
            l = new z(),
            c = new z(),
            h = new z(),
            d = new z();
          if (t)
          for (let u = 0, f = t.count; u < f; u += 3) {
            let p = t.getX(u + 0),
              x = t.getX(u + 1),
              g = t.getX(u + 2);
            s.fromBufferAttribute(e, p),
            r.fromBufferAttribute(e, x),
            o.fromBufferAttribute(e, g),
            h.subVectors(o, r),
            d.subVectors(s, r),
            h.cross(d),
            a.fromBufferAttribute(n, p),
            l.fromBufferAttribute(n, x),
            c.fromBufferAttribute(n, g),
            a.add(h),
            l.add(h),
            c.add(h),
            n.setXYZ(p, a.x, a.y, a.z),
            n.setXYZ(x, l.x, l.y, l.z),
            n.setXYZ(g, c.x, c.y, c.z);
          } else

          for (let u = 0, f = e.count; u < f; u += 3)
          s.fromBufferAttribute(e, u + 0),
          r.fromBufferAttribute(e, u + 1),
          o.fromBufferAttribute(e, u + 2),
          h.subVectors(o, r),
          d.subVectors(s, r),
          h.cross(d),
          n.setXYZ(u + 0, h.x, h.y, h.z),
          n.setXYZ(u + 1, h.x, h.y, h.z),
          n.setXYZ(u + 2, h.x, h.y, h.z);
          this.normalizeNormals(), n.needsUpdate = !0;
        }
      }
      normalizeNormals() {
        let t = this.attributes.normal;
        for (let e = 0, n = t.count; e < n; e++)
        sn.fromBufferAttribute(t, e),
        sn.normalize(),
        t.setXYZ(e, sn.x, sn.y, sn.z);
      }
      toNonIndexed() {
        function t(a, l) {
          let c = a.array,
            h = a.itemSize,
            d = a.normalized,
            u = new c.constructor(l.length * h),
            f = 0,
            p = 0;
          for (let x = 0, g = l.length; x < g; x++) {
            a.isInterleavedBufferAttribute ?
            f = l[x] * a.data.stride + a.offset :
            f = l[x] * h;
            for (let m = 0; m < h; m++) u[p++] = c[f++];
          }
          return new Le(u, h, d);
        }
        if (this.index === null)
        return (
          Ht(
            "BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."
          ),
          this);

        let e = new i(),
          n = this.index.array,
          s = this.attributes;
        for (let a in s) {
          let l = s[a],
            c = t(l, n);
          e.setAttribute(a, c);
        }
        let r = this.morphAttributes;
        for (let a in r) {
          let l = [],
            c = r[a];
          for (let h = 0, d = c.length; h < d; h++) {
            let u = c[h],
              f = t(u, n);
            l.push(f);
          }
          e.morphAttributes[a] = l;
        }
        e.morphTargetsRelative = this.morphTargetsRelative;
        let o = this.groups;
        for (let a = 0, l = o.length; a < l; a++) {
          let c = o[a];
          e.addGroup(c.start, c.count, c.materialIndex);
        }
        return e;
      }
      toJSON() {
        let t = {
          metadata: {
            version: 4.7,
            type: "BufferGeometry",
            generator: "BufferGeometry.toJSON"
          }
        };
        if (
        t.uuid = this.uuid,
        t.type =
        this.parameters !== void 0 && this._transformed === !0 ?
        "BufferGeometry" :
        this.type,
        t.name = this.name,
        Object.keys(this.userData).length > 0 && (t.userData = this.userData),
        this.parameters !== void 0 && this._transformed !== !0)
        {
          let l = this.parameters;
          for (let c in l) l[c] !== void 0 && (t[c] = l[c]);
          return t;
        }
        t.data = { attributes: {} };
        let e = this.index;
        e !== null && (
        t.data.index = {
          type: e.array.constructor.name,
          array: Array.prototype.slice.call(e.array)
        });
        let n = this.attributes;
        for (let l in n) {
          let c = n[l];
          t.data.attributes[l] = c.toJSON(t.data);
        }
        let s = {},
          r = !1;
        for (let l in this.morphAttributes) {
          let c = this.morphAttributes[l],
            h = [];
          for (let d = 0, u = c.length; d < u; d++) {
            let f = c[d];
            h.push(f.toJSON(t.data));
          }
          h.length > 0 && (s[l] = h, r = !0);
        }
        r && (
        t.data.morphAttributes = s,
        t.data.morphTargetsRelative = this.morphTargetsRelative);
        let o = this.groups;
        o.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(o)));
        let a = this.boundingSphere;
        return a !== null && (t.data.boundingSphere = a.toJSON()), t;
      }
      clone() {
        return new this.constructor().copy(this);
      }
      copy(t) {
        this.index = null,
        this.attributes = {},
        this.morphAttributes = {},
        this.groups = [],
        this.boundingBox = null,
        this.boundingSphere = null;
        let e = {};
        this.name = t.name;
        let n = t.index;
        n !== null && this.setIndex(n.clone());
        let s = t.attributes;
        for (let c in s) {
          let h = s[c];
          this.setAttribute(c, h.clone(e));
        }
        let r = t.morphAttributes;
        for (let c in r) {
          let h = [],
            d = r[c];
          for (let u = 0, f = d.length; u < f; u++) h.push(d[u].clone(e));
          this.morphAttributes[c] = h;
        }
        this.morphTargetsRelative = t.morphTargetsRelative;
        let o = t.groups;
        for (let c = 0, h = o.length; c < h; c++) {
          let d = o[c];
          this.addGroup(d.start, d.count, d.materialIndex);
        }
        let a = t.boundingBox;
        a !== null && (this.boundingBox = a.clone());
        let l = t.boundingSphere;
        return (
          l !== null && (this.boundingSphere = l.clone()),
          this.drawRange.start = t.drawRange.start,
          this.drawRange.count = t.drawRange.count,
          this.userData = t.userData,
          this._transformed = t._transformed,
          this);

      }
      dispose() {
        this.dispatchEvent({ type: "dispose" });
      }
    },
    Ao = class {
      constructor(t, e) {
        this.isInterleavedBuffer = !0,
        this.array = t,
        this.stride = e,
        this.count = t !== void 0 ? t.length / e : 0,
        this.usage = Cu,
        this.updateRanges = [],
        this.version = 0,
        this.uuid = ji();
      }
      onUploadCallback() {}
      set needsUpdate(t) {
        t === !0 && this.version++;
      }
      setUsage(t) {
        return this.usage = t, this;
      }
      addUpdateRange(t, e) {
        this.updateRanges.push({ start: t, count: e });
      }
      clearUpdateRanges() {
        this.updateRanges.length = 0;
      }
      copy(t) {
        return (
          this.array = new t.array.constructor(t.array),
          this.count = t.count,
          this.stride = t.stride,
          this.usage = t.usage,
          this);

      }
      copyAt(t, e, n) {
        t *= this.stride, n *= e.stride;
        for (let s = 0, r = this.stride; s < r; s++)
        this.array[t + s] = e.array[n + s];
        return this;
      }
      set(t, e = 0) {
        return this.array.set(t, e), this;
      }
      clone(t) {
        t.arrayBuffers === void 0 && (t.arrayBuffers = {}),
        this.array.buffer._uuid === void 0 && (
        this.array.buffer._uuid = ji()),
        t.arrayBuffers[this.array.buffer._uuid] === void 0 && (
        t.arrayBuffers[this.array.buffer._uuid] =
        this.array.slice(0).buffer);
        let e = new this.array.constructor(
            t.arrayBuffers[this.array.buffer._uuid]
          ),
          n = new this.constructor(e, this.stride);
        return n.setUsage(this.usage), n;
      }
      onUpload(t) {
        return this.onUploadCallback = t, this;
      }
      toJSON(t) {
        t.arrayBuffers === void 0 && (t.arrayBuffers = {}),
        this.array.buffer._uuid === void 0 && (
        this.array.buffer._uuid = ji()),
        t.arrayBuffers[this.array.buffer._uuid] === void 0 && (
        t.arrayBuffers[this.array.buffer._uuid] = Array.from(
          new Uint32Array(this.array.buffer)
        ));
        let e = {
          uuid: this.uuid,
          buffer: this.array.buffer._uuid,
          type: this.array.constructor.name,
          stride: this.stride
        };
        return e.usage = this.usage, e;
      }
    },
    vn = new z(),
    br = class i {
      constructor(t, e, n, s = !1) {
        this.isInterleavedBufferAttribute = !0,
        this.name = "",
        this.data = t,
        this.itemSize = e,
        this.offset = n,
        this.normalized = s;
      }
      get count() {
        return this.data.count;
      }
      get array() {
        return this.data.array;
      }
      set needsUpdate(t) {
        this.data.needsUpdate = t;
      }
      applyMatrix4(t) {
        for (let e = 0, n = this.data.count; e < n; e++)
        vn.fromBufferAttribute(this, e),
        vn.applyMatrix4(t),
        this.setXYZ(e, vn.x, vn.y, vn.z);
        return this;
      }
      applyNormalMatrix(t) {
        for (let e = 0, n = this.count; e < n; e++)
        vn.fromBufferAttribute(this, e),
        vn.applyNormalMatrix(t),
        this.setXYZ(e, vn.x, vn.y, vn.z);
        return this;
      }
      transformDirection(t) {
        for (let e = 0, n = this.count; e < n; e++)
        vn.fromBufferAttribute(this, e),
        vn.transformDirection(t),
        this.setXYZ(e, vn.x, vn.y, vn.z);
        return this;
      }
      getComponent(t, e) {
        let n = this.array[t * this.data.stride + this.offset + e];
        return this.normalized && (n = ci(n, this.array)), n;
      }
      setComponent(t, e, n) {
        return (
          this.normalized && (n = _e(n, this.array)),
          this.data.array[t * this.data.stride + this.offset + e] = n,
          this);

      }
      setX(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.data.array[t * this.data.stride + this.offset] = e,
          this);

      }
      setY(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.data.array[t * this.data.stride + this.offset + 1] = e,
          this);

      }
      setZ(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.data.array[t * this.data.stride + this.offset + 2] = e,
          this);

      }
      setW(t, e) {
        return (
          this.normalized && (e = _e(e, this.array)),
          this.data.array[t * this.data.stride + this.offset + 3] = e,
          this);

      }
      getX(t) {
        let e = this.data.array[t * this.data.stride + this.offset];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      getY(t) {
        let e = this.data.array[t * this.data.stride + this.offset + 1];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      getZ(t) {
        let e = this.data.array[t * this.data.stride + this.offset + 2];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      getW(t) {
        let e = this.data.array[t * this.data.stride + this.offset + 3];
        return this.normalized && (e = ci(e, this.array)), e;
      }
      setXY(t, e, n) {
        return (
          t = t * this.data.stride + this.offset,
          this.normalized && (e = _e(e, this.array), n = _e(n, this.array)),
          this.data.array[t + 0] = e,
          this.data.array[t + 1] = n,
          this);

      }
      setXYZ(t, e, n, s) {
        return (
          t = t * this.data.stride + this.offset,
          this.normalized && (
          e = _e(e, this.array),
          n = _e(n, this.array),
          s = _e(s, this.array)),
          this.data.array[t + 0] = e,
          this.data.array[t + 1] = n,
          this.data.array[t + 2] = s,
          this);

      }
      setXYZW(t, e, n, s, r) {
        return (
          t = t * this.data.stride + this.offset,
          this.normalized && (
          e = _e(e, this.array),
          n = _e(n, this.array),
          s = _e(s, this.array),
          r = _e(r, this.array)),
          this.data.array[t + 0] = e,
          this.data.array[t + 1] = n,
          this.data.array[t + 2] = s,
          this.data.array[t + 3] = r,
          this);

      }
      clone(t) {
        if (t === void 0) {
          Mo(
            "InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data."
          );
          let e = [];
          for (let n = 0; n < this.count; n++) {
            let s = n * this.data.stride + this.offset;
            for (let r = 0; r < this.itemSize; r++)
            e.push(this.data.array[s + r]);
          }
          return new Le(
            new this.array.constructor(e),
            this.itemSize,
            this.normalized
          );
        } else
        return (
          t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}),
          t.interleavedBuffers[this.data.uuid] === void 0 && (
          t.interleavedBuffers[this.data.uuid] = this.data.clone(t)),
          new i(
            t.interleavedBuffers[this.data.uuid],
            this.itemSize,
            this.offset,
            this.normalized
          ));

      }
      toJSON(t) {
        if (t === void 0) {
          Mo(
            "InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data."
          );
          let e = [];
          for (let n = 0; n < this.count; n++) {
            let s = n * this.data.stride + this.offset;
            for (let r = 0; r < this.itemSize; r++)
            e.push(this.data.array[s + r]);
          }
          return {
            itemSize: this.itemSize,
            type: this.array.constructor.name,
            array: e,
            normalized: this.normalized
          };
        } else
        return (
          t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}),
          t.interleavedBuffers[this.data.uuid] === void 0 && (
          t.interleavedBuffers[this.data.uuid] = this.data.toJSON(t)),
          {
            isInterleavedBufferAttribute: !0,
            itemSize: this.itemSize,
            data: this.data.uuid,
            offset: this.offset,
            normalized: this.normalized
          });

      }
    },
    qh = new z(),
    Ng = new z(),
    zg = new Wt(),
    In = class {
      constructor(t = new z(1, 0, 0), e = 0) {
        this.isPlane = !0, this.normal = t, this.constant = e;
      }
      set(t, e) {
        return this.normal.copy(t), this.constant = e, this;
      }
      setComponents(t, e, n, s) {
        return this.normal.set(t, e, n), this.constant = s, this;
      }
      setFromNormalAndCoplanarPoint(t, e) {
        return this.normal.copy(t), this.constant = -e.dot(this.normal), this;
      }
      setFromCoplanarPoints(t, e, n) {
        let s = qh.subVectors(n, e).cross(Ng.subVectors(t, e)).normalize();
        return this.setFromNormalAndCoplanarPoint(s, t), this;
      }
      copy(t) {
        return this.normal.copy(t.normal), this.constant = t.constant, this;
      }
      normalize() {
        let t = 1 / this.normal.length();
        return this.normal.multiplyScalar(t), this.constant *= t, this;
      }
      negate() {
        return this.constant *= -1, this.normal.negate(), this;
      }
      distanceToPoint(t) {
        return this.normal.dot(t) + this.constant;
      }
      distanceToSphere(t) {
        return this.distanceToPoint(t.center) - t.radius;
      }
      projectPoint(t, e) {
        return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
      }
      intersectLine(t, e, n = !0) {
        let s = t.delta(qh),
          r = this.normal.dot(s);
        if (r === 0)
        return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
        let o = -(t.start.dot(this.normal) + this.constant) / r;
        return n === !0 && (o < 0 || o > 1) ?
        null :
        e.copy(t.start).addScaledVector(s, o);
      }
      intersectsLine(t) {
        let e = this.distanceToPoint(t.start),
          n = this.distanceToPoint(t.end);
        return e < 0 && n > 0 || n < 0 && e > 0;
      }
      intersectsBox(t) {
        return t.intersectsPlane(this);
      }
      intersectsSphere(t) {
        return t.intersectsPlane(this);
      }
      coplanarPoint(t) {
        return t.copy(this.normal).multiplyScalar(-this.constant);
      }
      applyMatrix4(t, e) {
        let n = e || zg.getNormalMatrix(t),
          s = this.coplanarPoint(qh).applyMatrix4(t),
          r = this.normal.applyMatrix3(n).normalize();
        return this.constant = -s.dot(r), this;
      }
      translate(t) {
        return this.constant -= t.dot(this.normal), this;
      }
      equals(t) {
        return t.normal.equals(this.normal) && t.constant === this.constant;
      }
      clone() {
        return new this.constructor().copy(this);
      }
      toJSON() {
        return { normal: this.normal.toArray(), constant: this.constant };
      }
      fromJSON(t) {
        return (
          this.normal.fromArray(t.normal), this.constant = t.constant, this);

      }
    },
    Ug = 0,
    Jn = class extends di {
      constructor() {
        super(),
        this.isMaterial = !0,
        Object.defineProperty(this, "id", { value: Ug++ }),
        this.uuid = ji(),
        this.name = "",
        this.type = "Material",
        this.blending = Cr,
        this.side = is,
        this.vertexColors = !1,
        this.opacity = 1,
        this.transparent = !1,
        this.alphaHash = !1,
        this.blendSrc = pu,
        this.blendDst = mu,
        this.blendEquation = Ps,
        this.blendSrcAlpha = null,
        this.blendDstAlpha = null,
        this.blendEquationAlpha = null,
        this.blendColor = new wt(0, 0, 0),
        this.blendAlpha = 0,
        this.depthFunc = pr,
        this.depthTest = !0,
        this.depthWrite = !0,
        this.stencilWriteMask = 255,
        this.stencilFunc = Ep,
        this.stencilRef = 0,
        this.stencilFuncMask = 255,
        this.stencilFail = sl,
        this.stencilZFail = sl,
        this.stencilZPass = sl,
        this.stencilWrite = !1,
        this.clippingPlanes = null,
        this.clipIntersection = !1,
        this.clipShadows = !1,
        this.shadowSide = null,
        this.colorWrite = !0,
        this.precision = null,
        this.polygonOffset = !1,
        this.polygonOffsetFactor = 0,
        this.polygonOffsetUnits = 0,
        this.dithering = !1,
        this.alphaToCoverage = !1,
        this.premultipliedAlpha = !1,
        this.forceSinglePass = !1,
        this.allowOverride = !0,
        this.visible = !0,
        this.toneMapped = !0,
        this.userData = {},
        this.version = 0,
        this._alphaTest = 0;
      }
      get alphaTest() {
        return this._alphaTest;
      }
      set alphaTest(t) {
        this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
      }
      onBeforeRender() {}
      onBeforeCompile() {}
      customProgramCacheKey() {
        return this.onBeforeCompile.toString();
      }
      setValues(t) {
        if (t !== void 0)
        for (let e in t) {
          let n = t[e];
          if (n === void 0) {
            Ht(`Material: parameter '${e}' has value of undefined.`);
            continue;
          }
          let s = this[e];
          if (s === void 0) {
            Ht(`Material: '${e}' is not a property of THREE.${this.type}.`);
            continue;
          }
          s && s.isColor ?
          s.set(n) :
          s && s.isVector2 && n && n.isVector2 ||
          s && s.isEuler && n && n.isEuler ||
          s && s.isVector3 && n && n.isVector3 ?
          s.copy(n) :
          this[e] = n;
        }
      }
      toJSON(t) {
        let e = t === void 0 || typeof t == "string";
        e && (t = { textures: {}, images: {} });
        let n = {
          metadata: {
            version: 4.7,
            type: "Material",
            generator: "Material.toJSON"
          }
        };
        n.uuid = this.uuid,
        n.type = this.type,
        n.blending = this.blending,
        n.side = this.side,
        n.shadowSide = this.shadowSide,
        n.vertexColors = this.vertexColors,
        n.opacity = this.opacity,
        n.transparent = this.transparent,
        n.blendSrc = this.blendSrc,
        n.blendDst = this.blendDst,
        n.blendEquation = this.blendEquation,
        n.blendSrcAlpha = this.blendSrcAlpha,
        n.blendDstAlpha = this.blendDstAlpha,
        n.blendEquationAlpha = this.blendEquationAlpha,
        n.blendColor = this.blendColor.getHex(),
        n.blendAlpha = this.blendAlpha,
        n.depthFunc = this.depthFunc,
        n.depthTest = this.depthTest,
        n.depthWrite = this.depthWrite,
        n.colorWrite = this.colorWrite,
        n.clipIntersection = this.clipIntersection,
        n.clipShadows = this.clipShadows,
        n.stencilWriteMask = this.stencilWriteMask,
        n.stencilFunc = this.stencilFunc,
        n.stencilRef = this.stencilRef,
        n.stencilFuncMask = this.stencilFuncMask,
        n.stencilFail = this.stencilFail,
        n.stencilZFail = this.stencilZFail,
        n.stencilZPass = this.stencilZPass,
        n.stencilWrite = this.stencilWrite,
        n.polygonOffset = this.polygonOffset,
        n.polygonOffsetFactor = this.polygonOffsetFactor,
        n.polygonOffsetUnits = this.polygonOffsetUnits,
        n.dithering = this.dithering,
        n.alphaTest = this.alphaTest,
        n.alphaHash = this.alphaHash,
        n.alphaToCoverage = this.alphaToCoverage,
        n.premultipliedAlpha = this.premultipliedAlpha,
        n.forceSinglePass = this.forceSinglePass,
        n.allowOverride = this.allowOverride,
        n.visible = this.visible,
        n.toneMapped = this.toneMapped,
        n.name = this.name,
        this.color && this.color.isColor && (n.color = this.color.getHex()),
        this.roughness !== void 0 && (n.roughness = this.roughness),
        this.metalness !== void 0 && (n.metalness = this.metalness),
        this.sheen !== void 0 && (n.sheen = this.sheen),
        this.sheenColor &&
        this.sheenColor.isColor && (
        n.sheenColor = this.sheenColor.getHex()),
        this.sheenRoughness !== void 0 && (
        n.sheenRoughness = this.sheenRoughness),
        this.emissive &&
        this.emissive.isColor && (
        n.emissive = this.emissive.getHex()),
        this.emissiveIntensity !== void 0 && (
        n.emissiveIntensity = this.emissiveIntensity),
        this.specular &&
        this.specular.isColor && (
        n.specular = this.specular.getHex()),
        this.specularIntensity !== void 0 && (
        n.specularIntensity = this.specularIntensity),
        this.specularColor &&
        this.specularColor.isColor && (
        n.specularColor = this.specularColor.getHex()),
        this.shininess !== void 0 && (n.shininess = this.shininess),
        this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat),
        this.clearcoatRoughness !== void 0 && (
        n.clearcoatRoughness = this.clearcoatRoughness),
        this.clearcoatMap &&
        this.clearcoatMap.isTexture && (
        n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid),
        this.clearcoatRoughnessMap &&
        this.clearcoatRoughnessMap.isTexture && (
        n.clearcoatRoughnessMap =
        this.clearcoatRoughnessMap.toJSON(t).uuid),
        this.clearcoatNormalMap &&
        this.clearcoatNormalMap.isTexture && (
        n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid,
        n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()),
        this.sheenColorMap &&
        this.sheenColorMap.isTexture && (
        n.sheenColorMap = this.sheenColorMap.toJSON(t).uuid),
        this.sheenRoughnessMap &&
        this.sheenRoughnessMap.isTexture && (
        n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(t).uuid),
        this.dispersion !== void 0 && (n.dispersion = this.dispersion),
        this.retroreflectivity !== void 0 && (
        n.retroreflectivity = this.retroreflectivity),
        this.iridescence !== void 0 && (n.iridescence = this.iridescence),
        this.iridescenceIOR !== void 0 && (
        n.iridescenceIOR = this.iridescenceIOR),
        this.iridescenceThicknessRange !== void 0 && (
        n.iridescenceThicknessRange = this.iridescenceThicknessRange),
        this.iridescenceMap &&
        this.iridescenceMap.isTexture && (
        n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid),
        this.iridescenceThicknessMap &&
        this.iridescenceThicknessMap.isTexture && (
        n.iridescenceThicknessMap =
        this.iridescenceThicknessMap.toJSON(t).uuid),
        this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy),
        this.anisotropyRotation !== void 0 && (
        n.anisotropyRotation = this.anisotropyRotation),
        this.anisotropyMap &&
        this.anisotropyMap.isTexture && (
        n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid),
        this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid),
        this.matcap &&
        this.matcap.isTexture && (
        n.matcap = this.matcap.toJSON(t).uuid),
        this.alphaMap &&
        this.alphaMap.isTexture && (
        n.alphaMap = this.alphaMap.toJSON(t).uuid),
        this.lightMap &&
        this.lightMap.isTexture && (
        n.lightMap = this.lightMap.toJSON(t).uuid,
        n.lightMapIntensity = this.lightMapIntensity),
        this.aoMap &&
        this.aoMap.isTexture && (
        n.aoMap = this.aoMap.toJSON(t).uuid,
        n.aoMapIntensity = this.aoMapIntensity),
        this.bumpMap &&
        this.bumpMap.isTexture && (
        n.bumpMap = this.bumpMap.toJSON(t).uuid,
        n.bumpScale = this.bumpScale),
        this.normalMap &&
        this.normalMap.isTexture && (
        n.normalMap = this.normalMap.toJSON(t).uuid,
        n.normalMapType = this.normalMapType,
        n.normalScale = this.normalScale.toArray()),
        this.displacementMap &&
        this.displacementMap.isTexture && (
        n.displacementMap = this.displacementMap.toJSON(t).uuid,
        n.displacementScale = this.displacementScale,
        n.displacementBias = this.displacementBias),
        this.roughnessMap &&
        this.roughnessMap.isTexture && (
        n.roughnessMap = this.roughnessMap.toJSON(t).uuid),
        this.metalnessMap &&
        this.metalnessMap.isTexture && (
        n.metalnessMap = this.metalnessMap.toJSON(t).uuid),
        this.emissiveMap &&
        this.emissiveMap.isTexture && (
        n.emissiveMap = this.emissiveMap.toJSON(t).uuid),
        this.specularMap &&
        this.specularMap.isTexture && (
        n.specularMap = this.specularMap.toJSON(t).uuid),
        this.specularIntensityMap &&
        this.specularIntensityMap.isTexture && (
        n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid),
        this.specularColorMap &&
        this.specularColorMap.isTexture && (
        n.specularColorMap = this.specularColorMap.toJSON(t).uuid),
        this.envMap &&
        this.envMap.isTexture && (
        n.envMap = this.envMap.toJSON(t).uuid,
        this.combine !== void 0 && (n.combine = this.combine)),
        this.envMapRotation !== void 0 && (
        n.envMapRotation = this.envMapRotation.toArray()),
        this.envMapIntensity !== void 0 && (
        n.envMapIntensity = this.envMapIntensity),
        this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity),
        this.refractionRatio !== void 0 && (
        n.refractionRatio = this.refractionRatio),
        this.gradientMap &&
        this.gradientMap.isTexture && (
        n.gradientMap = this.gradientMap.toJSON(t).uuid),
        this.transmission !== void 0 && (n.transmission = this.transmission),
        this.transmissionMap &&
        this.transmissionMap.isTexture && (
        n.transmissionMap = this.transmissionMap.toJSON(t).uuid),
        this.thickness !== void 0 && (n.thickness = this.thickness),
        this.thicknessMap &&
        this.thicknessMap.isTexture && (
        n.thicknessMap = this.thicknessMap.toJSON(t).uuid),
        this.attenuationDistance !== void 0 && (
        n.attenuationDistance = this.attenuationDistance),
        this.attenuationColor !== void 0 && (
        n.attenuationColor = this.attenuationColor.getHex()),
        this.size !== void 0 && (n.size = this.size),
        this.sizeAttenuation !== void 0 && (
        n.sizeAttenuation = this.sizeAttenuation),
        Array.isArray(this.clippingPlanes) &&
        this.clippingPlanes.length > 0 && (
        n.clippingPlanes = this.clippingPlanes.map((r) => r.toJSON())),
        this.rotation !== void 0 && (n.rotation = this.rotation),
        this.depthPacking !== void 0 && (n.depthPacking = this.depthPacking),
        this.linewidth !== void 0 && (n.linewidth = this.linewidth),
        this.linecap !== void 0 && (n.linecap = this.linecap),
        this.linejoin !== void 0 && (n.linejoin = this.linejoin),
        this.dashSize !== void 0 && (n.dashSize = this.dashSize),
        this.gapSize !== void 0 && (n.gapSize = this.gapSize),
        this.scale !== void 0 && (n.scale = this.scale),
        this.wireframe !== void 0 && (n.wireframe = this.wireframe),
        this.wireframeLinewidth !== void 0 && (
        n.wireframeLinewidth = this.wireframeLinewidth),
        this.wireframeLinecap !== void 0 && (
        n.wireframeLinecap = this.wireframeLinecap),
        this.wireframeLinejoin !== void 0 && (
        n.wireframeLinejoin = this.wireframeLinejoin),
        this.flatShading !== void 0 && (n.flatShading = this.flatShading),
        this.fog !== void 0 && (n.fog = this.fog),
        Object.keys(this.userData).length > 0 && (n.userData = this.userData);
        function s(r) {
          let o = [];
          for (let a in r) {
            let l = r[a];
            delete l.metadata, o.push(l);
          }
          return o;
        }
        if (e) {
          let r = s(t.textures),
            o = s(t.images);
          r.length > 0 && (n.textures = r), o.length > 0 && (n.images = o);
        }
        return n;
      }
      fromJSON(t, e) {
        if (
        t.uuid !== void 0 && (this.uuid = t.uuid),
        t.name !== void 0 && (this.name = t.name),
        t.color !== void 0 &&
        this.color !== void 0 &&
        this.color.setHex(t.color),
        t.roughness !== void 0 && (this.roughness = t.roughness),
        t.metalness !== void 0 && (this.metalness = t.metalness),
        t.sheen !== void 0 && (this.sheen = t.sheen),
        t.sheenColor !== void 0 && (
        this.sheenColor = new wt().setHex(t.sheenColor)),
        t.sheenRoughness !== void 0 && (
        this.sheenRoughness = t.sheenRoughness),
        t.emissive !== void 0 &&
        this.emissive !== void 0 &&
        this.emissive.setHex(t.emissive),
        t.specular !== void 0 &&
        this.specular !== void 0 &&
        this.specular.setHex(t.specular),
        t.specularIntensity !== void 0 && (
        this.specularIntensity = t.specularIntensity),
        t.specularColor !== void 0 &&
        this.specularColor !== void 0 &&
        this.specularColor.setHex(t.specularColor),
        t.shininess !== void 0 && (this.shininess = t.shininess),
        t.clearcoat !== void 0 && (this.clearcoat = t.clearcoat),
        t.clearcoatRoughness !== void 0 && (
        this.clearcoatRoughness = t.clearcoatRoughness),
        t.dispersion !== void 0 && (this.dispersion = t.dispersion),
        t.retroreflectivity !== void 0 && (
        this.retroreflectivity = t.retroreflectivity),
        t.iridescence !== void 0 && (this.iridescence = t.iridescence),
        t.iridescenceIOR !== void 0 && (
        this.iridescenceIOR = t.iridescenceIOR),
        t.iridescenceThicknessRange !== void 0 && (
        this.iridescenceThicknessRange = t.iridescenceThicknessRange),
        t.transmission !== void 0 && (this.transmission = t.transmission),
        t.thickness !== void 0 && (this.thickness = t.thickness),
        t.attenuationDistance !== void 0 && (
        this.attenuationDistance = t.attenuationDistance),
        t.attenuationColor !== void 0 &&
        this.attenuationColor !== void 0 &&
        this.attenuationColor.setHex(t.attenuationColor),
        t.anisotropy !== void 0 && (this.anisotropy = t.anisotropy),
        t.anisotropyRotation !== void 0 && (
        this.anisotropyRotation = t.anisotropyRotation),
        t.fog !== void 0 && (this.fog = t.fog),
        t.flatShading !== void 0 && (this.flatShading = t.flatShading),
        t.blending !== void 0 && (this.blending = t.blending),
        t.combine !== void 0 && (this.combine = t.combine),
        t.side !== void 0 && (this.side = t.side),
        t.shadowSide !== void 0 && (this.shadowSide = t.shadowSide),
        t.opacity !== void 0 && (this.opacity = t.opacity),
        t.transparent !== void 0 && (this.transparent = t.transparent),
        t.alphaTest !== void 0 && (this.alphaTest = t.alphaTest),
        t.alphaHash !== void 0 && (this.alphaHash = t.alphaHash),
        t.depthFunc !== void 0 && (this.depthFunc = t.depthFunc),
        t.depthTest !== void 0 && (this.depthTest = t.depthTest),
        t.depthWrite !== void 0 && (this.depthWrite = t.depthWrite),
        t.colorWrite !== void 0 && (this.colorWrite = t.colorWrite),
        t.clippingPlanes !== void 0 && (
        this.clippingPlanes = t.clippingPlanes.map((n) =>
        new In().fromJSON(n)
        )),
        t.clipIntersection !== void 0 && (
        this.clipIntersection = t.clipIntersection),
        t.clipShadows !== void 0 && (this.clipShadows = t.clipShadows),
        t.depthPacking !== void 0 && (this.depthPacking = t.depthPacking),
        t.blendSrc !== void 0 && (this.blendSrc = t.blendSrc),
        t.blendDst !== void 0 && (this.blendDst = t.blendDst),
        t.blendEquation !== void 0 && (this.blendEquation = t.blendEquation),
        t.blendSrcAlpha !== void 0 && (this.blendSrcAlpha = t.blendSrcAlpha),
        t.blendDstAlpha !== void 0 && (this.blendDstAlpha = t.blendDstAlpha),
        t.blendEquationAlpha !== void 0 && (
        this.blendEquationAlpha = t.blendEquationAlpha),
        t.blendColor !== void 0 &&
        this.blendColor !== void 0 &&
        this.blendColor.setHex(t.blendColor),
        t.blendAlpha !== void 0 && (this.blendAlpha = t.blendAlpha),
        t.stencilWriteMask !== void 0 && (
        this.stencilWriteMask = t.stencilWriteMask),
        t.stencilFunc !== void 0 && (this.stencilFunc = t.stencilFunc),
        t.stencilRef !== void 0 && (this.stencilRef = t.stencilRef),
        t.stencilFuncMask !== void 0 && (
        this.stencilFuncMask = t.stencilFuncMask),
        t.stencilFail !== void 0 && (this.stencilFail = t.stencilFail),
        t.stencilZFail !== void 0 && (this.stencilZFail = t.stencilZFail),
        t.stencilZPass !== void 0 && (this.stencilZPass = t.stencilZPass),
        t.stencilWrite !== void 0 && (this.stencilWrite = t.stencilWrite),
        t.wireframe !== void 0 && (this.wireframe = t.wireframe),
        t.wireframeLinewidth !== void 0 && (
        this.wireframeLinewidth = t.wireframeLinewidth),
        t.wireframeLinecap !== void 0 && (
        this.wireframeLinecap = t.wireframeLinecap),
        t.wireframeLinejoin !== void 0 && (
        this.wireframeLinejoin = t.wireframeLinejoin),
        t.rotation !== void 0 && (this.rotation = t.rotation),
        t.linewidth !== void 0 && (this.linewidth = t.linewidth),
        t.linecap !== void 0 && (this.linecap = t.linecap),
        t.linejoin !== void 0 && (this.linejoin = t.linejoin),
        t.dashSize !== void 0 && (this.dashSize = t.dashSize),
        t.gapSize !== void 0 && (this.gapSize = t.gapSize),
        t.scale !== void 0 && (this.scale = t.scale),
        t.polygonOffset !== void 0 && (this.polygonOffset = t.polygonOffset),
        t.polygonOffsetFactor !== void 0 && (
        this.polygonOffsetFactor = t.polygonOffsetFactor),
        t.polygonOffsetUnits !== void 0 && (
        this.polygonOffsetUnits = t.polygonOffsetUnits),
        t.dithering !== void 0 && (this.dithering = t.dithering),
        t.alphaToCoverage !== void 0 && (
        this.alphaToCoverage = t.alphaToCoverage),
        t.premultipliedAlpha !== void 0 && (
        this.premultipliedAlpha = t.premultipliedAlpha),
        t.forceSinglePass !== void 0 && (
        this.forceSinglePass = t.forceSinglePass),
        t.allowOverride !== void 0 && (this.allowOverride = t.allowOverride),
        t.visible !== void 0 && (this.visible = t.visible),
        t.toneMapped !== void 0 && (this.toneMapped = t.toneMapped),
        t.userData !== void 0 && (this.userData = t.userData),
        t.vertexColors !== void 0 && (
        typeof t.vertexColors == "number" ?
        this.vertexColors = t.vertexColors > 0 :
        this.vertexColors = t.vertexColors),
        t.size !== void 0 && (this.size = t.size),
        t.sizeAttenuation !== void 0 && (
        this.sizeAttenuation = t.sizeAttenuation),
        t.map !== void 0 && (this.map = e[t.map] || null),
        t.matcap !== void 0 && (this.matcap = e[t.matcap] || null),
        t.alphaMap !== void 0 && (this.alphaMap = e[t.alphaMap] || null),
        t.bumpMap !== void 0 && (this.bumpMap = e[t.bumpMap] || null),
        t.bumpScale !== void 0 && (this.bumpScale = t.bumpScale),
        t.normalMap !== void 0 && (this.normalMap = e[t.normalMap] || null),
        t.normalMapType !== void 0 && (this.normalMapType = t.normalMapType),
        t.normalScale !== void 0)
        {
          let n = t.normalScale;
          Array.isArray(n) === !1 && (n = [n, n]),
          this.normalScale = new Vt().fromArray(n);
        }
        return (
          t.displacementMap !== void 0 && (
          this.displacementMap = e[t.displacementMap] || null),
          t.displacementScale !== void 0 && (
          this.displacementScale = t.displacementScale),
          t.displacementBias !== void 0 && (
          this.displacementBias = t.displacementBias),
          t.roughnessMap !== void 0 && (
          this.roughnessMap = e[t.roughnessMap] || null),
          t.metalnessMap !== void 0 && (
          this.metalnessMap = e[t.metalnessMap] || null),
          t.emissiveMap !== void 0 && (
          this.emissiveMap = e[t.emissiveMap] || null),
          t.emissiveIntensity !== void 0 && (
          this.emissiveIntensity = t.emissiveIntensity),
          t.specularMap !== void 0 && (
          this.specularMap = e[t.specularMap] || null),
          t.specularIntensityMap !== void 0 && (
          this.specularIntensityMap = e[t.specularIntensityMap] || null),
          t.specularColorMap !== void 0 && (
          this.specularColorMap = e[t.specularColorMap] || null),
          t.envMap !== void 0 && (this.envMap = e[t.envMap] || null),
          t.envMapRotation !== void 0 &&
          this.envMapRotation.fromArray(t.envMapRotation),
          t.envMapIntensity !== void 0 && (
          this.envMapIntensity = t.envMapIntensity),
          t.reflectivity !== void 0 && (this.reflectivity = t.reflectivity),
          t.refractionRatio !== void 0 && (
          this.refractionRatio = t.refractionRatio),
          t.lightMap !== void 0 && (this.lightMap = e[t.lightMap] || null),
          t.lightMapIntensity !== void 0 && (
          this.lightMapIntensity = t.lightMapIntensity),
          t.aoMap !== void 0 && (this.aoMap = e[t.aoMap] || null),
          t.aoMapIntensity !== void 0 && (
          this.aoMapIntensity = t.aoMapIntensity),
          t.gradientMap !== void 0 && (
          this.gradientMap = e[t.gradientMap] || null),
          t.clearcoatMap !== void 0 && (
          this.clearcoatMap = e[t.clearcoatMap] || null),
          t.clearcoatRoughnessMap !== void 0 && (
          this.clearcoatRoughnessMap = e[t.clearcoatRoughnessMap] || null),
          t.clearcoatNormalMap !== void 0 && (
          this.clearcoatNormalMap = e[t.clearcoatNormalMap] || null),
          t.clearcoatNormalScale !== void 0 && (
          this.clearcoatNormalScale = new Vt().fromArray(
            t.clearcoatNormalScale
          )),
          t.iridescenceMap !== void 0 && (
          this.iridescenceMap = e[t.iridescenceMap] || null),
          t.iridescenceThicknessMap !== void 0 && (
          this.iridescenceThicknessMap =
          e[t.iridescenceThicknessMap] || null),
          t.transmissionMap !== void 0 && (
          this.transmissionMap = e[t.transmissionMap] || null),
          t.thicknessMap !== void 0 && (
          this.thicknessMap = e[t.thicknessMap] || null),
          t.anisotropyMap !== void 0 && (
          this.anisotropyMap = e[t.anisotropyMap] || null),
          t.sheenColorMap !== void 0 && (
          this.sheenColorMap = e[t.sheenColorMap] || null),
          t.sheenRoughnessMap !== void 0 && (
          this.sheenRoughnessMap = e[t.sheenRoughnessMap] || null),
          this);

      }
      clone() {
        return new this.constructor().copy(this);
      }
      copy(t) {
        this.name = t.name,
        this.blending = t.blending,
        this.side = t.side,
        this.vertexColors = t.vertexColors,
        this.opacity = t.opacity,
        this.transparent = t.transparent,
        this.blendSrc = t.blendSrc,
        this.blendDst = t.blendDst,
        this.blendEquation = t.blendEquation,
        this.blendSrcAlpha = t.blendSrcAlpha,
        this.blendDstAlpha = t.blendDstAlpha,
        this.blendEquationAlpha = t.blendEquationAlpha,
        this.blendColor.copy(t.blendColor),
        this.blendAlpha = t.blendAlpha,
        this.depthFunc = t.depthFunc,
        this.depthTest = t.depthTest,
        this.depthWrite = t.depthWrite,
        this.stencilWriteMask = t.stencilWriteMask,
        this.stencilFunc = t.stencilFunc,
        this.stencilRef = t.stencilRef,
        this.stencilFuncMask = t.stencilFuncMask,
        this.stencilFail = t.stencilFail,
        this.stencilZFail = t.stencilZFail,
        this.stencilZPass = t.stencilZPass,
        this.stencilWrite = t.stencilWrite;
        let e = t.clippingPlanes,
          n = null;
        if (e !== null) {
          let s = e.length;
          n = new Array(s);
          for (let r = 0; r !== s; ++r) n[r] = e[r].clone();
        }
        return (
          this.clippingPlanes = n,
          this.clipIntersection = t.clipIntersection,
          this.clipShadows = t.clipShadows,
          this.shadowSide = t.shadowSide,
          this.colorWrite = t.colorWrite,
          this.precision = t.precision,
          this.polygonOffset = t.polygonOffset,
          this.polygonOffsetFactor = t.polygonOffsetFactor,
          this.polygonOffsetUnits = t.polygonOffsetUnits,
          this.dithering = t.dithering,
          this.alphaTest = t.alphaTest,
          this.alphaHash = t.alphaHash,
          this.alphaToCoverage = t.alphaToCoverage,
          this.premultipliedAlpha = t.premultipliedAlpha,
          this.forceSinglePass = t.forceSinglePass,
          this.allowOverride = t.allowOverride,
          this.visible = t.visible,
          this.toneMapped = t.toneMapped,
          this.userData = JSON.parse(JSON.stringify(t.userData)),
          this);

      }
      dispose() {
        this.dispatchEvent({ type: "dispose" });
      }
      set needsUpdate(t) {
        t === !0 && this.version++;
      }
    },
    Ki = class extends Jn {
      constructor(t) {
        super(),
        this.isSpriteMaterial = !0,
        this.type = "SpriteMaterial",
        this.color = new wt(16777215),
        this.map = null,
        this.alphaMap = null,
        this.rotation = 0,
        this.sizeAttenuation = !0,
        this.transparent = !0,
        this.fog = !0,
        this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.color.copy(t.color),
          this.map = t.map,
          this.alphaMap = t.alphaMap,
          this.rotation = t.rotation,
          this.sizeAttenuation = t.sizeAttenuation,
          this.fog = t.fog,
          this);

      }
    },
    rr,
    uo = new z(),
    or = new z(),
    ar = new z(),
    lr = new Vt(),
    fo = new Vt(),
    Up = new se(),
    Ua = new z(),
    po = new z(),
    Fa = new z(),
    Pf = new Vt(),
    Yh = new Vt(),
    Lf = new Vt(),
    ws = class extends Je {
      constructor(t = new Ki()) {
        if (
        super(), this.isSprite = !0, this.type = "Sprite", rr === void 0)
        {
          rr = new ye();
          let e = new Float32Array([
            -0.5, -0.5, 0, 0, 0, 0.5, -0.5, 0, 1, 0, 0.5, 0.5, 0, 1, 1, -0.5,
            0.5, 0, 0, 1]
            ),
            n = new Ao(e, 5);
          rr.setIndex([0, 1, 2, 0, 2, 3]),
          rr.setAttribute("position", new br(n, 3, 0, !1)),
          rr.setAttribute("uv", new br(n, 2, 3, !1));
        }
        this.geometry = rr,
        this.material = t,
        this.center = new Vt(0.5, 0.5),
        this.count = 1;
      }
      intersectsFrustum(t) {
        return t.intersectsSprite(this);
      }
      raycast(t, e) {
        t.camera === null &&
        Gt(
          'Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'
        ),
        or.setFromMatrixScale(this.matrixWorld),
        Up.copy(t.camera.matrixWorld),
        this.modelViewMatrix.multiplyMatrices(
          t.camera.matrixWorldInverse,
          this.matrixWorld
        ),
        ar.setFromMatrixPosition(this.modelViewMatrix),
        t.camera.isPerspectiveCamera &&
        this.material.sizeAttenuation === !1 &&
        or.multiplyScalar(-ar.z);
        let n = this.material.rotation,
          s,
          r;
        n !== 0 && (r = Math.cos(n), s = Math.sin(n));
        let o = this.center;
        Oa(Ua.set(-0.5, -0.5, 0), ar, o, or, s, r),
        Oa(po.set(0.5, -0.5, 0), ar, o, or, s, r),
        Oa(Fa.set(0.5, 0.5, 0), ar, o, or, s, r),
        Pf.set(0, 0),
        Yh.set(1, 0),
        Lf.set(1, 1);
        let a = t.ray.intersectTriangle(Ua, po, Fa, !1, uo);
        if (
        a === null && (
        Oa(po.set(-0.5, 0.5, 0), ar, o, or, s, r),
        Yh.set(0, 1),
        a = t.ray.intersectTriangle(Ua, Fa, po, !1, uo),
        a === null))

        return;
        let l = t.ray.origin.distanceTo(uo);
        l < t.near ||
        l > t.far ||
        e.push({
          distance: l,
          point: uo.clone(),
          uv: ki.getInterpolation(uo, Ua, po, Fa, Pf, Yh, Lf, new Vt()),
          face: null,
          object: this
        });
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          t.center !== void 0 && this.center.copy(t.center),
          this.material = t.material,
          this);

      }
    };
  function Oa(i, t, e, n, s, r) {
    lr.subVectors(i, e).addScalar(0.5).multiply(n),
    s !== void 0 ? (
    fo.x = r * lr.x - s * lr.y, fo.y = s * lr.x + r * lr.y) :
    fo.copy(lr),
    i.copy(t),
    i.x += fo.x,
    i.y += fo.y,
    i.applyMatrix4(Up);
  }
  var Ri = new z(),
    Zh = new z(),
    Ba = new z(),
    Ha = new z(),
    Es = class {
      constructor(t = new z(), e = new z(0, 0, -1)) {
        this.origin = t, this.direction = e;
      }
      set(t, e) {
        return this.origin.copy(t), this.direction.copy(e), this;
      }
      copy(t) {
        return (
          this.origin.copy(t.origin), this.direction.copy(t.direction), this);

      }
      at(t, e) {
        return e.copy(this.origin).addScaledVector(this.direction, t);
      }
      lookAt(t) {
        return this.direction.copy(t).sub(this.origin).normalize(), this;
      }
      recast(t) {
        return this.origin.copy(this.at(t, Ri)), this;
      }
      closestPointToPoint(t, e) {
        e.subVectors(t, this.origin);
        let n = e.dot(this.direction);
        return n < 0 ?
        e.copy(this.origin) :
        e.copy(this.origin).addScaledVector(this.direction, n);
      }
      distanceToPoint(t) {
        return Math.sqrt(this.distanceSqToPoint(t));
      }
      distanceSqToPoint(t) {
        let e = Ri.subVectors(t, this.origin).dot(this.direction);
        return e < 0 ?
        this.origin.distanceToSquared(t) : (
        Ri.copy(this.origin).addScaledVector(this.direction, e),
        Ri.distanceToSquared(t));
      }
      distanceSqToSegment(t, e, n, s) {
        Zh.copy(t).add(e).multiplyScalar(0.5),
        Ba.copy(e).sub(t).normalize(),
        Ha.copy(this.origin).sub(Zh);
        let r = t.distanceTo(e) * 0.5,
          o = -this.direction.dot(Ba),
          a = Ha.dot(this.direction),
          l = -Ha.dot(Ba),
          c = Ha.lengthSq(),
          h = Math.abs(1 - o * o),
          d,
          u,
          f,
          p;
        if (h > 0) {
          if (d = o * l - a, u = o * a - l, p = r * h, d >= 0) {
            if (u >= -p) {
              if (u <= p) {
                let x = 1 / h;
                d *= x,
                u *= x,
                f = d * (d + o * u + 2 * a) + u * (o * d + u + 2 * l) + c;
              } else
              u = r,
              d = Math.max(0, -(o * u + a)),
              f = -d * d + u * (u + 2 * l) + c;} else

            u = -r,
            d = Math.max(0, -(o * u + a)),
            f = -d * d + u * (u + 2 * l) + c;} else

          u <= -p ? (
          d = Math.max(0, -(-o * r + a)),
          u = d > 0 ? -r : Math.min(Math.max(-r, -l), r),
          f = -d * d + u * (u + 2 * l) + c) :
          u <= p ? (
          d = 0,
          u = Math.min(Math.max(-r, -l), r),
          f = u * (u + 2 * l) + c) : (
          d = Math.max(0, -(o * r + a)),
          u = d > 0 ? r : Math.min(Math.max(-r, -l), r),
          f = -d * d + u * (u + 2 * l) + c);} else

        u = o > 0 ? -r : r,
        d = Math.max(0, -(o * u + a)),
        f = -d * d + u * (u + 2 * l) + c;
        return (
          n && n.copy(this.origin).addScaledVector(this.direction, d),
          s && s.copy(Zh).addScaledVector(Ba, u),
          f);

      }
      intersectSphere(t, e) {
        if (t.radius < 0) return null;
        Ri.subVectors(t.center, this.origin);
        let n = Ri.dot(this.direction),
          s = Ri.dot(Ri) - n * n,
          r = t.radius * t.radius;
        if (s > r) return null;
        let o = Math.sqrt(r - s),
          a = n - o,
          l = n + o;
        return l < 0 ? null : a < 0 ? this.at(l, e) : this.at(a, e);
      }
      intersectsSphere(t) {
        return t.radius < 0 ?
        !1 :
        this.distanceSqToPoint(t.center) <= t.radius * t.radius;
      }
      distanceToPlane(t) {
        let e = t.normal.dot(this.direction);
        if (e === 0) return t.distanceToPoint(this.origin) === 0 ? 0 : null;
        let n = -(this.origin.dot(t.normal) + t.constant) / e;
        return n >= 0 ? n : null;
      }
      intersectPlane(t, e) {
        let n = this.distanceToPlane(t);
        return n === null ? null : this.at(n, e);
      }
      intersectsPlane(t) {
        let e = t.distanceToPoint(this.origin);
        return e === 0 || t.normal.dot(this.direction) * e < 0;
      }
      intersectBox(t, e) {
        let n,
          s,
          r,
          o,
          a,
          l,
          c = 1 / this.direction.x,
          h = 1 / this.direction.y,
          d = 1 / this.direction.z,
          u = this.origin;
        return (
          c >= 0 ? (
          n = (t.min.x - u.x) * c, s = (t.max.x - u.x) * c) : (
          n = (t.max.x - u.x) * c, s = (t.min.x - u.x) * c),
          h >= 0 ? (
          r = (t.min.y - u.y) * h, o = (t.max.y - u.y) * h) : (
          r = (t.max.y - u.y) * h, o = (t.min.y - u.y) * h),
          n > o ||
          r > s || (
          (r > n || isNaN(n)) && (n = r),
          (o < s || isNaN(s)) && (s = o),
          d >= 0 ? (
          a = (t.min.z - u.z) * d, l = (t.max.z - u.z) * d) : (
          a = (t.max.z - u.z) * d, l = (t.min.z - u.z) * d),
          n > l || a > s) || (
          (a > n || n !== n) && (n = a), (l < s || s !== s) && (s = l), s < 0) ?
          null :
          this.at(n >= 0 ? n : s, e));

      }
      intersectsBox(t) {
        return this.intersectBox(t, Ri) !== null;
      }
      intersectTriangle(t, e, n, s, r) {
        let o = this.origin,
          a = this.direction,
          l = a.x,
          c = a.y,
          h = a.z,
          d = t.x - o.x,
          u = t.y - o.y,
          f = t.z - o.z,
          p = e.x - o.x,
          x = e.y - o.y,
          g = e.z - o.z,
          m = n.x - o.x,
          b = n.y - o.y,
          T = n.z - o.z,
          y = Math.abs(l),
          S = Math.abs(c),
          M = Math.abs(h),
          A,
          v,
          E,
          R,
          P,
          N,
          B,
          D,
          I,
          H,
          X,
          nt;
        if (
        y >= S && y >= M ? (
        E = l,
        N = d,
        I = p,
        nt = m,
        l >= 0 ? (
        A = c,
        v = h,
        R = u,
        P = f,
        B = x,
        D = g,
        H = b,
        X = T) : (
        A = h,
        v = c,
        R = f,
        P = u,
        B = g,
        D = x,
        H = T,
        X = b)) :
        S >= M ? (
        E = c,
        N = u,
        I = x,
        nt = b,
        c >= 0 ? (
        A = h,
        v = l,
        R = f,
        P = d,
        B = g,
        D = p,
        H = T,
        X = m) : (
        A = l,
        v = h,
        R = d,
        P = f,
        B = p,
        D = g,
        H = m,
        X = T)) : (
        E = h,
        N = f,
        I = g,
        nt = T,
        h >= 0 ? (
        A = l,
        v = c,
        R = d,
        P = u,
        B = p,
        D = x,
        H = m,
        X = b) : (
        A = c,
        v = l,
        R = u,
        P = d,
        B = x,
        D = p,
        H = b,
        X = m)),
        E === 0)

        return null;
        let Y = A / E,
          K = v / E,
          et = 1 / E,
          Dt = R - Y * N,
          Lt = P - K * N,
          Se = B - Y * I,
          oe = D - K * I,
          ue = H - Y * nt,
          J = X - K * nt,
          it = ue * oe - J * Se,
          Tt = Dt * J - Lt * ue,
          Xt = Se * Lt - oe * Dt;
        if (s) {
          if (it < 0 || Tt < 0 || Xt < 0) return null;
        } else if ((it < 0 || Tt < 0 || Xt < 0) && (it > 0 || Tt > 0 || Xt > 0))
        return null;
        let bt = it + Tt + Xt;
        if (bt === 0) return null;
        let Qt = et * (it * N + Tt * I + Xt * nt);
        return (bt > 0 ? Qt < 0 : Qt > 0) ? null : this.at(Qt / bt, r);
      }
      applyMatrix4(t) {
        return (
          this.origin.applyMatrix4(t),
          this.direction.transformDirection(t),
          this);

      }
      equals(t) {
        return (
          t.origin.equals(this.origin) && t.direction.equals(this.direction));

      }
      clone() {
        return new this.constructor().copy(this);
      }
    },
    je = class extends Jn {
      constructor(t) {
        super(),
        this.isMeshBasicMaterial = !0,
        this.type = "MeshBasicMaterial",
        this.color = new wt(16777215),
        this.map = null,
        this.lightMap = null,
        this.lightMapIntensity = 1,
        this.aoMap = null,
        this.aoMapIntensity = 1,
        this.specularMap = null,
        this.alphaMap = null,
        this.envMap = null,
        this.envMapRotation = new bn(),
        this.combine = Ol,
        this.reflectivity = 1,
        this.refractionRatio = 0.98,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.wireframeLinecap = "round",
        this.wireframeLinejoin = "round",
        this.fog = !0,
        this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.color.copy(t.color),
          this.map = t.map,
          this.lightMap = t.lightMap,
          this.lightMapIntensity = t.lightMapIntensity,
          this.aoMap = t.aoMap,
          this.aoMapIntensity = t.aoMapIntensity,
          this.specularMap = t.specularMap,
          this.alphaMap = t.alphaMap,
          this.envMap = t.envMap,
          this.envMapRotation.copy(t.envMapRotation),
          this.combine = t.combine,
          this.reflectivity = t.reflectivity,
          this.refractionRatio = t.refractionRatio,
          this.wireframe = t.wireframe,
          this.wireframeLinewidth = t.wireframeLinewidth,
          this.wireframeLinecap = t.wireframeLinecap,
          this.wireframeLinejoin = t.wireframeLinejoin,
          this.fog = t.fog,
          this);

      }
    },
    Df = new se(),
    bs = new Es(),
    Va = new pi(),
    Nf = new z(),
    Ga = new z(),
    Wa = new z(),
    Xa = new z(),
    Jh = new z(),
    $a = new z(),
    zf = new z(),
    qa = new z(),
    Et = class extends Je {
      constructor(t = new ye(), e = new je()) {
        super(),
        this.isMesh = !0,
        this.type = "Mesh",
        this.geometry = t,
        this.material = e,
        this.morphTargetDictionary = void 0,
        this.morphTargetInfluences = void 0,
        this.count = 1,
        this.updateMorphTargets();
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          t.morphTargetInfluences !== void 0 && (
          this.morphTargetInfluences = t.morphTargetInfluences.slice()),
          t.morphTargetDictionary !== void 0 && (
          this.morphTargetDictionary = Object.assign(
            {},
            t.morphTargetDictionary
          )),
          this.material = Array.isArray(t.material) ?
          t.material.slice() :
          t.material,
          this.geometry = t.geometry,
          this);

      }
      updateMorphTargets() {
        let e = this.geometry.morphAttributes,
          n = Object.keys(e);
        if (n.length > 0) {
          let s = e[n[0]];
          if (s !== void 0) {
            this.morphTargetInfluences = [],
            this.morphTargetDictionary = {};
            for (let r = 0, o = s.length; r < o; r++) {
              let a = s[r].name || String(r);
              this.morphTargetInfluences.push(0),
              this.morphTargetDictionary[a] = r;
            }
          }
        }
      }
      getVertexPosition(t, e) {
        let n = this.geometry,
          s = n.attributes.position,
          r = n.morphAttributes.position,
          o = n.morphTargetsRelative;
        e.fromBufferAttribute(s, t);
        let a = this.morphTargetInfluences;
        if (r && a) {
          $a.set(0, 0, 0);
          for (let l = 0, c = r.length; l < c; l++) {
            let h = a[l],
              d = r[l];
            h !== 0 && (
            Jh.fromBufferAttribute(d, t),
            o ? $a.addScaledVector(Jh, h) : $a.addScaledVector(Jh.sub(e), h));
          }
          e.add($a);
        }
        return e;
      }
      intersectsFrustum(t) {
        return t.intersectsObject(this);
      }
      raycast(t, e) {
        let n = this.geometry,
          s = this.material,
          r = this.matrixWorld;
        s !== void 0 && (
        n.boundingSphere === null && n.computeBoundingSphere(),
        Va.copy(n.boundingSphere),
        Va.applyMatrix4(r),
        bs.copy(t.ray).recast(t.near),
        !(
        Va.containsPoint(bs.origin) === !1 && (
        bs.intersectSphere(Va, Nf) === null ||
        bs.origin.distanceToSquared(Nf) > (t.far - t.near) ** 2)) && (

        Df.copy(r).invert(),
        bs.copy(t.ray).applyMatrix4(Df),
        !(
        n.boundingBox !== null && bs.intersectsBox(n.boundingBox) === !1) &&
        this._computeIntersections(t, e, bs)));
      }
      _computeIntersections(t, e, n) {
        let s,
          r = this.geometry,
          o = this.material,
          a = r.index,
          l = r.attributes.position,
          c = r.attributes.uv,
          h = r.attributes.uv1,
          d = r.attributes.normal,
          u = r.groups,
          f = r.drawRange;
        if (a !== null) {
          if (Array.isArray(o))
          for (let p = 0, x = u.length; p < x; p++) {
            let g = u[p],
              m = o[g.materialIndex],
              b = Math.max(g.start, f.start),
              T = Math.min(
                a.count,
                Math.min(g.start + g.count, f.start + f.count)
              );
            for (let y = b, S = T; y < S; y += 3) {
              let M = a.getX(y),
                A = a.getX(y + 1),
                v = a.getX(y + 2);
              s = Ya(this, m, t, n, c, h, d, M, A, v),
              s && (
              s.faceIndex = Math.floor(y / 3),
              s.face.materialIndex = g.materialIndex,
              e.push(s));
            }
          } else
          {
            let p = Math.max(0, f.start),
              x = Math.min(a.count, f.start + f.count);
            for (let g = p, m = x; g < m; g += 3) {
              let b = a.getX(g),
                T = a.getX(g + 1),
                y = a.getX(g + 2);
              s = Ya(this, o, t, n, c, h, d, b, T, y),
              s && (s.faceIndex = Math.floor(g / 3), e.push(s));
            }
          }} else
        if (l !== void 0)
        if (Array.isArray(o))
        for (let p = 0, x = u.length; p < x; p++) {
          let g = u[p],
            m = o[g.materialIndex],
            b = Math.max(g.start, f.start),
            T = Math.min(
              l.count,
              Math.min(g.start + g.count, f.start + f.count)
            );
          for (let y = b, S = T; y < S; y += 3) {
            let M = y,
              A = y + 1,
              v = y + 2;
            s = Ya(this, m, t, n, c, h, d, M, A, v),
            s && (
            s.faceIndex = Math.floor(y / 3),
            s.face.materialIndex = g.materialIndex,
            e.push(s));
          }
        } else
        {
          let p = Math.max(0, f.start),
            x = Math.min(l.count, f.start + f.count);
          for (let g = p, m = x; g < m; g += 3) {
            let b = g,
              T = g + 1,
              y = g + 2;
            s = Ya(this, o, t, n, c, h, d, b, T, y),
            s && (s.faceIndex = Math.floor(g / 3), e.push(s));
          }
        }
      }
    };
  function Fg(i, t, e, n, s, r, o, a) {
    let l;
    if (
    t.side === Mn ?
    l = n.intersectTriangle(o, r, s, !0, a) :
    l = n.intersectTriangle(s, r, o, t.side === is, a),
    l === null)

    return null;
    qa.copy(a), qa.applyMatrix4(i.matrixWorld);
    let c = e.ray.origin.distanceTo(qa);
    return c < e.near || c > e.far ?
    null :
    { distance: c, point: qa.clone(), object: i };
  }
  function Ya(i, t, e, n, s, r, o, a, l, c) {
    i.getVertexPosition(a, Ga),
    i.getVertexPosition(l, Wa),
    i.getVertexPosition(c, Xa);
    let h = Fg(i, t, e, n, Ga, Wa, Xa, zf);
    if (h) {
      let d = new z();
      ki.getBarycoord(zf, Ga, Wa, Xa, d),
      s && (h.uv = ki.getInterpolatedAttribute(s, a, l, c, d, new Vt())),
      r && (h.uv1 = ki.getInterpolatedAttribute(r, a, l, c, d, new Vt())),
      o && (
      h.normal = ki.getInterpolatedAttribute(o, a, l, c, d, new z()),
      h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
      let u = { a, b: l, c, normal: new z(), materialIndex: 0 };
      ki.getNormal(Ga, Wa, Xa, u.normal), h.face = u, h.barycoord = d;
    }
    return h;
  }
  var Ro = class extends _n {
    constructor(t = null, e = 1, n = 1, s, r, o, a, l, c = Ae, h = Ae, d, u) {
      super(null, o, a, l, c, h, s, r, d, u),
      this.isDataTexture = !0,
      this.image = { data: t, width: e, height: n },
      this.generateMipmaps = !1,
      this.flipY = !1,
      this.unpackAlignment = 1;
    }
  };
  var Mr = class extends Le {
      constructor(t, e, n, s = 1) {
        super(t, e, n),
        this.isInstancedBufferAttribute = !0,
        this.meshPerAttribute = s;
      }
      copy(t) {
        return (
          super.copy(t), this.meshPerAttribute = t.meshPerAttribute, this);

      }
      toJSON() {
        let t = super.toJSON();
        return (
          t.meshPerAttribute = this.meshPerAttribute,
          t.isInstancedBufferAttribute = !0,
          t);

      }
    },
    cr = new se(),
    Uf = new se(),
    Za = [],
    Ff = new fi(),
    Og = new se(),
    mo = new Et(),
    go = new pi(),
    Ts = class extends Et {
      constructor(t, e, n) {
        super(t, e),
        this.isInstancedMesh = !0,
        this.instanceMatrix = new Mr(new Float32Array(n * 16), 16),
        this.instanceColor = null,
        this.morphTexture = null,
        this.count = n,
        this.boundingBox = null,
        this.boundingSphere = null;
        for (let s = 0; s < n; s++) this.setMatrixAt(s, Og);
      }
      computeBoundingBox() {
        let t = this.geometry,
          e = this.count;
        this.boundingBox === null && (this.boundingBox = new fi()),
        t.boundingBox === null && t.computeBoundingBox(),
        this.boundingBox.makeEmpty();
        for (let n = 0; n < e; n++)
        this.getMatrixAt(n, cr),
        Ff.copy(t.boundingBox).applyMatrix4(cr),
        this.boundingBox.union(Ff);
      }
      computeBoundingSphere() {
        let t = this.geometry,
          e = this.count;
        this.boundingSphere === null && (this.boundingSphere = new pi()),
        t.boundingSphere === null && t.computeBoundingSphere(),
        this.boundingSphere.makeEmpty();
        for (let n = 0; n < e; n++)
        this.getMatrixAt(n, cr),
        go.copy(t.boundingSphere).applyMatrix4(cr),
        this.boundingSphere.union(go);
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.instanceMatrix.copy(t.instanceMatrix),
          t.morphTexture !== null && (
          this.morphTexture = t.morphTexture.clone()),
          t.instanceColor !== null && (
          this.instanceColor = t.instanceColor.clone()),
          this.count = t.count,
          t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()),
          t.boundingSphere !== null && (
          this.boundingSphere = t.boundingSphere.clone()),
          this);

      }
      getColorAt(t, e) {
        return this.instanceColor === null ?
        e.setRGB(1, 1, 1) :
        e.fromArray(this.instanceColor.array, t * 3);
      }
      getMatrixAt(t, e) {
        return e.fromArray(this.instanceMatrix.array, t * 16);
      }
      getMorphAt(t, e) {
        let n = e.morphTargetInfluences,
          s = this.morphTexture.source.data.data,
          r = n.length + 1,
          o = t * r + 1;
        for (let a = 0; a < n.length; a++) n[a] = s[o + a];
      }
      raycast(t, e) {
        let n = this.matrixWorld,
          s = this.count;
        if (
        mo.geometry = this.geometry,
        mo.material = this.material,
        mo.material !== void 0 && (
        this.boundingSphere === null && this.computeBoundingSphere(),
        go.copy(this.boundingSphere),
        go.applyMatrix4(n),
        t.ray.intersectsSphere(go) !== !1))

        for (let r = 0; r < s; r++) {
          this.getMatrixAt(r, cr),
          Uf.multiplyMatrices(n, cr),
          mo.matrixWorld = Uf,
          mo.raycast(t, Za);
          for (let o = 0, a = Za.length; o < a; o++) {
            let l = Za[o];
            l.instanceId = r, l.object = this, e.push(l);
          }
          Za.length = 0;
        }
      }
      setColorAt(t, e) {
        return (
          this.instanceColor === null && (
          this.instanceColor = new Mr(
            new Float32Array(this.instanceMatrix.count * 3).fill(1),
            3
          )),
          e.toArray(this.instanceColor.array, t * 3),
          this);

      }
      setMatrixAt(t, e) {
        return e.toArray(this.instanceMatrix.array, t * 16), this;
      }
      setMorphAt(t, e) {
        let n = e.morphTargetInfluences,
          s = n.length + 1;
        this.morphTexture === null && (
        this.morphTexture = new Ro(
          new Float32Array(s * this.count),
          s,
          this.count,
          $l,
          Fn
        ));
        let r = this.morphTexture.source.data.data,
          o = 0;
        for (let c = 0; c < n.length; c++) o += n[c];
        let a = this.geometry.morphTargetsRelative ? 1 : 1 - o,
          l = s * t;
        return r[l] = a, r.set(n, l + 1), this;
      }
      updateMorphTargets() {}
      dispose() {
        super.dispose(),
        this.morphTexture !== null && (
        this.morphTexture.dispose(), this.morphTexture = null);
      }
    },
    Ms = new pi(),
    Bg = new Vt(0.5, 0.5),
    Ja = new z(),
    Sr = class {
      constructor(
      t = new In(),
      e = new In(),
      n = new In(),
      s = new In(),
      r = new In(),
      o = new In())
      {
        this.planes = [t, e, n, s, r, o];
      }
      set(t, e, n, s, r, o) {
        let a = this.planes;
        return (
          a[0].copy(t),
          a[1].copy(e),
          a[2].copy(n),
          a[3].copy(s),
          a[4].copy(r),
          a[5].copy(o),
          this);

      }
      copy(t) {
        let e = this.planes;
        for (let n = 0; n < 6; n++) e[n].copy(t.planes[n]);
        return this;
      }
      setFromProjectionMatrix(t, e = Zn, n = !1) {
        let s = this.planes,
          r = t.elements,
          o = r[0],
          a = r[1],
          l = r[2],
          c = r[3],
          h = r[4],
          d = r[5],
          u = r[6],
          f = r[7],
          p = r[8],
          x = r[9],
          g = r[10],
          m = r[11],
          b = r[12],
          T = r[13],
          y = r[14],
          S = r[15];
        if (
        s[0].setComponents(c - o, f - h, m - p, S - b).normalize(),
        s[1].setComponents(c + o, f + h, m + p, S + b).normalize(),
        s[2].setComponents(c + a, f + d, m + x, S + T).normalize(),
        s[3].setComponents(c - a, f - d, m - x, S - T).normalize(),
        n)

        s[4].setComponents(l, u, g, y).normalize(),
        s[5].setComponents(c - l, f - u, m - g, S - y).normalize();else
        if (
        s[4].setComponents(c - l, f - u, m - g, S - y).normalize(), e === Zn)

        s[5].setComponents(c + l, f + u, m + g, S + y).normalize();else
        if (e === mr) s[5].setComponents(l, u, g, y).normalize();else

        throw new Error(
          "THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " +
          e
        );
        return this;
      }
      intersectsObject(t) {
        if (t.boundingSphere !== void 0)
        t.boundingSphere === null && t.computeBoundingSphere(),
        Ms.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else
        {
          let e = t.geometry;
          e.boundingSphere === null && e.computeBoundingSphere(),
          Ms.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
        }
        return this.intersectsSphere(Ms);
      }
      intersectsSprite(t) {
        Ms.center.set(0, 0, 0);
        let e = Bg.distanceTo(t.center);
        return (
          Ms.radius = 0.7071067811865476 + e,
          Ms.applyMatrix4(t.matrixWorld),
          this.intersectsSphere(Ms));

      }
      intersectsSphere(t) {
        let e = this.planes,
          n = t.center,
          s = -t.radius;
        for (let r = 0; r < 6; r++) if (e[r].distanceToPoint(n) < s) return !1;
        return !0;
      }
      intersectsBox(t) {
        let e = this.planes;
        for (let n = 0; n < 6; n++) {
          let s = e[n];
          if (
          Ja.x = s.normal.x > 0 ? t.max.x : t.min.x,
          Ja.y = s.normal.y > 0 ? t.max.y : t.min.y,
          Ja.z = s.normal.z > 0 ? t.max.z : t.min.z,
          s.distanceToPoint(Ja) < 0)

          return !1;
        }
        return !0;
      }
      containsPoint(t) {
        let e = this.planes;
        for (let n = 0; n < 6; n++) if (e[n].distanceToPoint(t) < 0) return !1;
        return !0;
      }
      clone() {
        return new this.constructor().copy(this);
      }
    };
  var wr = class extends Jn {
      constructor(t) {
        super(),
        this.isLineBasicMaterial = !0,
        this.type = "LineBasicMaterial",
        this.color = new wt(16777215),
        this.map = null,
        this.linewidth = 1,
        this.linecap = "round",
        this.linejoin = "round",
        this.fog = !0,
        this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.color.copy(t.color),
          this.map = t.map,
          this.linewidth = t.linewidth,
          this.linecap = t.linecap,
          this.linejoin = t.linejoin,
          this.fog = t.fog,
          this);

      }
    },
    vl = new z(),
    _l = new z(),
    Of = new se(),
    xo = new Es(),
    ja = new pi(),
    jh = new z(),
    Bf = new z(),
    bl = class extends Je {
      constructor(t = new ye(), e = new wr()) {
        super(),
        this.isLine = !0,
        this.type = "Line",
        this.geometry = t,
        this.material = e,
        this.morphTargetDictionary = void 0,
        this.morphTargetInfluences = void 0,
        this.updateMorphTargets();
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.material = Array.isArray(t.material) ?
          t.material.slice() :
          t.material,
          this.geometry = t.geometry,
          this);

      }
      computeLineDistances() {
        let t = this.geometry;
        if (t.index === null) {
          let e = t.attributes.position,
            n = [0];
          for (let s = 1, r = e.count; s < r; s++)
          vl.fromBufferAttribute(e, s - 1),
          _l.fromBufferAttribute(e, s),
          n[s] = n[s - 1],
          n[s] += vl.distanceTo(_l);
          t.setAttribute("lineDistance", new Zt(n, 1));
        } else
        Ht(
          "Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
        );
        return this;
      }
      intersectsFrustum(t) {
        return t.intersectsObject(this);
      }
      raycast(t, e) {
        let n = this.geometry,
          s = this.matrixWorld,
          r = t.params.Line.threshold,
          o = n.drawRange;
        if (
        n.boundingSphere === null && n.computeBoundingSphere(),
        ja.copy(n.boundingSphere),
        ja.applyMatrix4(s),
        ja.radius += r,
        t.ray.intersectsSphere(ja) === !1)

        return;
        Of.copy(s).invert(), xo.copy(t.ray).applyMatrix4(Of);
        let a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
          l = a * a,
          c = this.isLineSegments ? 2 : 1,
          h = n.index,
          u = n.attributes.position;
        if (h !== null) {
          let f = Math.max(0, o.start),
            p = Math.min(h.count, o.start + o.count);
          for (let x = f, g = p - 1; x < g; x += c) {
            let m = h.getX(x),
              b = h.getX(x + 1),
              T = Ka(this, t, xo, l, m, b, x);
            T && e.push(T);
          }
          if (this.isLineLoop) {
            let x = h.getX(p - 1),
              g = h.getX(f),
              m = Ka(this, t, xo, l, x, g, p - 1);
            m && e.push(m);
          }
        } else {
          let f = Math.max(0, o.start),
            p = Math.min(u.count, o.start + o.count);
          for (let x = f, g = p - 1; x < g; x += c) {
            let m = Ka(this, t, xo, l, x, x + 1, x);
            m && e.push(m);
          }
          if (this.isLineLoop) {
            let x = Ka(this, t, xo, l, p - 1, f, p - 1);
            x && e.push(x);
          }
        }
      }
      updateMorphTargets() {
        let e = this.geometry.morphAttributes,
          n = Object.keys(e);
        if (n.length > 0) {
          let s = e[n[0]];
          if (s !== void 0) {
            this.morphTargetInfluences = [],
            this.morphTargetDictionary = {};
            for (let r = 0, o = s.length; r < o; r++) {
              let a = s[r].name || String(r);
              this.morphTargetInfluences.push(0),
              this.morphTargetDictionary[a] = r;
            }
          }
        }
      }
    };
  function Ka(i, t, e, n, s, r, o) {
    let a = i.geometry.attributes.position;
    if (
    vl.fromBufferAttribute(a, s),
    _l.fromBufferAttribute(a, r),
    e.distanceSqToSegment(vl, _l, jh, Bf) > n)

    return;
    jh.applyMatrix4(i.matrixWorld);
    let c = t.ray.origin.distanceTo(jh);
    if (!(c < t.near || c > t.far))
    return {
      distance: c,
      point: Bf.clone().applyMatrix4(i.matrixWorld),
      index: o,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: i
    };
  }
  var Hf = new z(),
    Vf = new z(),
    ko = class extends bl {
      constructor(t, e) {
        super(t, e), this.isLineSegments = !0, this.type = "LineSegments";
      }
      computeLineDistances() {
        let t = this.geometry;
        if (t.index === null) {
          let e = t.attributes.position,
            n = [];
          for (let s = 0, r = e.count; s < r; s += 2)
          Hf.fromBufferAttribute(e, s),
          Vf.fromBufferAttribute(e, s + 1),
          n[s] = s === 0 ? 0 : n[s - 1],
          n[s + 1] = n[s] + Hf.distanceTo(Vf);
          t.setAttribute("lineDistance", new Zt(n, 1));
        } else
        Ht(
          "LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
        );
        return this;
      }
    };
  var Er = class extends Jn {
      constructor(t) {
        super(),
        this.isPointsMaterial = !0,
        this.type = "PointsMaterial",
        this.color = new wt(16777215),
        this.map = null,
        this.alphaMap = null,
        this.size = 1,
        this.sizeAttenuation = !0,
        this.fog = !0,
        this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.color.copy(t.color),
          this.map = t.map,
          this.alphaMap = t.alphaMap,
          this.size = t.size,
          this.sizeAttenuation = t.sizeAttenuation,
          this.fog = t.fog,
          this);

      }
    },
    Gf = new se(),
    su = new Es(),
    Qa = new pi(),
    tl = new z(),
    Co = class extends Je {
      constructor(t = new ye(), e = new Er()) {
        super(),
        this.isPoints = !0,
        this.type = "Points",
        this.geometry = t,
        this.material = e,
        this.morphTargetDictionary = void 0,
        this.morphTargetInfluences = void 0,
        this.updateMorphTargets();
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.material = Array.isArray(t.material) ?
          t.material.slice() :
          t.material,
          this.geometry = t.geometry,
          this);

      }
      intersectsFrustum(t) {
        return t.intersectsObject(this);
      }
      raycast(t, e) {
        let n = this.geometry,
          s = this.matrixWorld,
          r = t.params.Points.threshold,
          o = n.drawRange;
        if (
        n.boundingSphere === null && n.computeBoundingSphere(),
        Qa.copy(n.boundingSphere),
        Qa.applyMatrix4(s),
        Qa.radius += r,
        t.ray.intersectsSphere(Qa) === !1)

        return;
        Gf.copy(s).invert(), su.copy(t.ray).applyMatrix4(Gf);
        let a = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
          l = a * a,
          c = n.index,
          d = n.attributes.position;
        if (c !== null) {
          let u = Math.max(0, o.start),
            f = Math.min(c.count, o.start + o.count);
          for (let p = u, x = f; p < x; p++) {
            let g = c.getX(p);
            tl.fromBufferAttribute(d, g), Wf(tl, g, l, s, t, e, this);
          }
        } else {
          let u = Math.max(0, o.start),
            f = Math.min(d.count, o.start + o.count);
          for (let p = u, x = f; p < x; p++)
          tl.fromBufferAttribute(d, p), Wf(tl, p, l, s, t, e, this);
        }
      }
      updateMorphTargets() {
        let e = this.geometry.morphAttributes,
          n = Object.keys(e);
        if (n.length > 0) {
          let s = e[n[0]];
          if (s !== void 0) {
            this.morphTargetInfluences = [],
            this.morphTargetDictionary = {};
            for (let r = 0, o = s.length; r < o; r++) {
              let a = s[r].name || String(r);
              this.morphTargetInfluences.push(0),
              this.morphTargetDictionary[a] = r;
            }
          }
        }
      }
    };
  function Wf(i, t, e, n, s, r, o) {
    let a = su.distanceSqToPoint(i);
    if (a < e) {
      let l = new z();
      su.closestPointToPoint(i, l), l.applyMatrix4(n);
      let c = s.ray.origin.distanceTo(l);
      if (c < s.near || c > s.far) return;
      r.push({
        distance: c,
        distanceToRay: Math.sqrt(a),
        point: l,
        index: t,
        face: null,
        faceIndex: null,
        barycoord: null,
        object: o
      });
    }
  }
  var Io = class extends _n {
      constructor(t = [], e = ss, n, s, r, o, a, l, c, h) {
        super(t, e, n, s, r, o, a, l, c, h),
        this.isCubeTexture = !0,
        this.flipY = !1;
      }
      get images() {
        return this.image;
      }
      set images(t) {
        this.image = t;
      }
    },
    Tr = class extends _n {
      constructor(t, e, n, s, r, o, a, l, c) {
        super(t, e, n, s, r, o, a, l, c),
        this.isCanvasTexture = !0,
        this.needsUpdate = !0;
      }
    };
  var mi = class extends _n {
      constructor(t, e, n = Ln, s, r, o, a = Ae, l = Ae, c, h = ui, d = 1) {
        if (h !== ui && h !== os)
        throw new Error(
          "THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat"
        );
        let u = { width: t, height: e, depth: d };
        super(u, s, r, o, a, l, h, n, c),
        this.isDepthTexture = !0,
        this.flipY = !1,
        this.generateMipmaps = !1,
        this.compareFunction = null;
      }
      copy(t) {
        return (
          super.copy(t),
          this.source = new xr(Object.assign({}, t.image)),
          this.compareFunction = t.compareFunction,
          this);

      }
      toJSON(t) {
        let e = super.toJSON(t);
        return e.compareFunction = this.compareFunction, e;
      }
    },
    Ml = class extends mi {
      constructor(t, e = Ln, n = ss, s, r, o = Ae, a = Ae, l, c = ui) {
        let h = { width: t, height: t, depth: 1 },
          d = [h, h, h, h, h, h];
        super(t, t, e, n, s, r, o, a, l, c),
        this.image = d,
        this.isCubeDepthTexture = !0,
        this.isCubeTexture = !0;
      }
      get images() {
        return this.image;
      }
      set images(t) {
        this.image = t;
      }
    },
    Po = class extends _n {
      constructor(t = null) {
        super(), this.sourceTexture = t, this.isExternalTexture = !0;
      }
      copy(t) {
        return super.copy(t), this.sourceTexture = t.sourceTexture, this;
      }
    },
    Un = class i extends ye {
      constructor(t = 1, e = 1, n = 1, s = 1, r = 1, o = 1) {
        super(),
        this.type = "BoxGeometry",
        this.parameters = {
          width: t,
          height: e,
          depth: n,
          widthSegments: s,
          heightSegments: r,
          depthSegments: o
        };
        let a = this;
        s = Math.floor(s), r = Math.floor(r), o = Math.floor(o);
        let l = [],
          c = [],
          h = [],
          d = [],
          u = 0,
          f = 0;
        p("z", "y", "x", -1, -1, n, e, t, o, r, 0),
        p("z", "y", "x", 1, -1, n, e, -t, o, r, 1),
        p("x", "z", "y", 1, 1, t, n, e, s, o, 2),
        p("x", "z", "y", 1, -1, t, n, -e, s, o, 3),
        p("x", "y", "z", 1, -1, t, e, n, s, r, 4),
        p("x", "y", "z", -1, -1, t, e, -n, s, r, 5),
        this.setIndex(l),
        this.setAttribute("position", new Zt(c, 3)),
        this.setAttribute("normal", new Zt(h, 3)),
        this.setAttribute("uv", new Zt(d, 2));
        function p(x, g, m, b, T, y, S, M, A, v, E) {
          let R = y / A,
            P = S / v,
            N = y / 2,
            B = S / 2,
            D = M / 2,
            I = A + 1,
            H = v + 1,
            X = 0,
            nt = 0,
            Y = new z();
          for (let K = 0; K < H; K++) {
            let et = K * P - B;
            for (let Dt = 0; Dt < I; Dt++) {
              let Lt = Dt * R - N;
              Y[x] = Lt * b,
              Y[g] = et * T,
              Y[m] = D,
              c.push(Y.x, Y.y, Y.z),
              Y[x] = 0,
              Y[g] = 0,
              Y[m] = M > 0 ? 1 : -1,
              h.push(Y.x, Y.y, Y.z),
              d.push(Dt / A),
              d.push(1 - K / v),
              X += 1;
            }
          }
          for (let K = 0; K < v; K++)
          for (let et = 0; et < A; et++) {
            let Dt = u + et + I * K,
              Lt = u + et + I * (K + 1),
              Se = u + (et + 1) + I * (K + 1),
              oe = u + (et + 1) + I * K;
            l.push(Dt, Lt, oe), l.push(Lt, Se, oe), nt += 6;
          }
          a.addGroup(f, nt, E), f += nt, u += X;
        }
      }
      copy(t) {
        return (
          super.copy(t),
          this.parameters = Object.assign({}, t.parameters),
          this);

      }
      static fromJSON(t) {
        return new i(
          t.width,
          t.height,
          t.depth,
          t.widthSegments,
          t.heightSegments,
          t.depthSegments
        );
      }
    };
  var Lo = class i extends ye {
      constructor(t = 1, e = 32, n = 0, s = Math.PI * 2) {
        super(),
        this.type = "CircleGeometry",
        this.parameters = {
          radius: t,
          segments: e,
          thetaStart: n,
          thetaLength: s
        },
        e = Math.max(3, e);
        let r = [],
          o = [],
          a = [],
          l = [],
          c = new z(),
          h = new Vt();
        o.push(0, 0, 0), a.push(0, 0, 1), l.push(0.5, 0.5);
        for (let d = 0, u = 3; d <= e; d++, u += 3) {
          let f = n + d / e * s;
          c.x = t * Math.cos(f),
          c.y = t * Math.sin(f),
          o.push(c.x, c.y, c.z),
          a.push(0, 0, 1),
          h.x = (o[u] / t + 1) / 2,
          h.y = (o[u + 1] / t + 1) / 2,
          l.push(h.x, h.y);
        }
        for (let d = 1; d <= e; d++) r.push(d, d + 1, 0);
        this.setIndex(r),
        this.setAttribute("position", new Zt(o, 3)),
        this.setAttribute("normal", new Zt(a, 3)),
        this.setAttribute("uv", new Zt(l, 2));
      }
      copy(t) {
        return (
          super.copy(t),
          this.parameters = Object.assign({}, t.parameters),
          this);

      }
      static fromJSON(t) {
        return new i(t.radius, t.segments, t.thetaStart, t.thetaLength);
      }
    },
    Ar = class i extends ye {
      constructor(
      t = 1,
      e = 1,
      n = 1,
      s = 32,
      r = 1,
      o = !1,
      a = 0,
      l = Math.PI * 2)
      {
        super(),
        this.type = "CylinderGeometry",
        this.parameters = {
          radiusTop: t,
          radiusBottom: e,
          height: n,
          radialSegments: s,
          heightSegments: r,
          openEnded: o,
          thetaStart: a,
          thetaLength: l
        };
        let c = this;
        s = Math.floor(s), r = Math.floor(r);
        let h = [],
          d = [],
          u = [],
          f = [],
          p = 0,
          x = [],
          g = n / 2,
          m = 0;
        b(),
        o === !1 && (t > 0 && T(!0), e > 0 && T(!1)),
        this.setIndex(h),
        this.setAttribute("position", new Zt(d, 3)),
        this.setAttribute("normal", new Zt(u, 3)),
        this.setAttribute("uv", new Zt(f, 2));
        function b() {
          let y = new z(),
            S = new z(),
            M = 0,
            A = (e - t) / n;
          for (let v = 0; v <= r; v++) {
            let E = [],
              R = v / r,
              P = R * (e - t) + t;
            for (let N = 0; N <= s; N++) {
              let B = N / s,
                D = B * l + a,
                I = Math.sin(D),
                H = Math.cos(D);
              S.x = P * I,
              S.y = -R * n + g,
              S.z = P * H,
              d.push(S.x, S.y, S.z),
              y.set(I, A, H).normalize(),
              u.push(y.x, y.y, y.z),
              f.push(B, 1 - R),
              E.push(p++);
            }
            x.push(E);
          }
          for (let v = 0; v < s; v++)
          for (let E = 0; E < r; E++) {
            let R = x[E][v],
              P = x[E + 1][v],
              N = x[E + 1][v + 1],
              B = x[E][v + 1];
            (t > 0 || E !== 0) && (h.push(R, P, B), M += 3),
            (e > 0 || E !== r - 1) && (h.push(P, N, B), M += 3);
          }
          c.addGroup(m, M, 0), m += M;
        }
        function T(y) {
          let S = p,
            M = new Vt(),
            A = new z(),
            v = 0,
            E = y === !0 ? t : e,
            R = y === !0 ? 1 : -1;
          for (let N = 1; N <= s; N++)
          d.push(0, g * R, 0), u.push(0, R, 0), f.push(0.5, 0.5), p++;
          let P = p;
          for (let N = 0; N <= s; N++) {
            let D = N / s * l + a,
              I = Math.cos(D),
              H = Math.sin(D);
            A.x = E * H,
            A.y = g * R,
            A.z = E * I,
            d.push(A.x, A.y, A.z),
            u.push(0, R, 0),
            M.x = I * 0.5 + 0.5,
            M.y = H * 0.5 * R + 0.5,
            f.push(M.x, M.y),
            p++;
          }
          for (let N = 0; N < s; N++) {
            let B = S + N,
              D = P + N;
            y === !0 ? h.push(D, D + 1, B) : h.push(D + 1, D, B), v += 3;
          }
          c.addGroup(m, v, y === !0 ? 1 : 2), m += v;
        }
      }
      copy(t) {
        return (
          super.copy(t),
          this.parameters = Object.assign({}, t.parameters),
          this);

      }
      static fromJSON(t) {
        return new i(
          t.radiusTop,
          t.radiusBottom,
          t.height,
          t.radialSegments,
          t.heightSegments,
          t.openEnded,
          t.thetaStart,
          t.thetaLength
        );
      }
    },
    Ii = class i extends Ar {
      constructor(t = 1, e = 1, n = 32, s = 1, r = !1, o = 0, a = Math.PI * 2) {
        super(0, t, e, n, s, r, o, a),
        this.type = "ConeGeometry",
        this.parameters = {
          radius: t,
          height: e,
          radialSegments: n,
          heightSegments: s,
          openEnded: r,
          thetaStart: o,
          thetaLength: a
        };
      }
      static fromJSON(t) {
        return new i(
          t.radius,
          t.height,
          t.radialSegments,
          t.heightSegments,
          t.openEnded,
          t.thetaStart,
          t.thetaLength
        );
      }
    },
    Do = class i extends ye {
      constructor(t = [], e = [], n = 1, s = 0) {
        super(),
        this.type = "PolyhedronGeometry",
        this.parameters = { vertices: t, indices: e, radius: n, detail: s };
        let r = [],
          o = [];
        a(s),
        c(n),
        h(),
        this.setAttribute("position", new Zt(r, 3)),
        this.setAttribute("normal", new Zt(r.slice(), 3)),
        this.setAttribute("uv", new Zt(o, 2)),
        s === 0 ? this.computeVertexNormals() : this.normalizeNormals();
        function a(b) {
          let T = new z(),
            y = new z(),
            S = new z();
          for (let M = 0; M < e.length; M += 3)
          f(e[M + 0], T), f(e[M + 1], y), f(e[M + 2], S), l(T, y, S, b);
        }
        function l(b, T, y, S) {
          let M = S + 1,
            A = [];
          for (let v = 0; v <= M; v++) {
            A[v] = [];
            let E = b.clone().lerp(y, v / M),
              R = T.clone().lerp(y, v / M),
              P = M - v;
            for (let N = 0; N <= P; N++)
            N === 0 && v === M ?
            A[v][N] = E :
            A[v][N] = E.clone().lerp(R, N / P);
          }
          for (let v = 0; v < M; v++)
          for (let E = 0; E < 2 * (M - v) - 1; E++) {
            let R = Math.floor(E / 2);
            E % 2 === 0 ? (
            u(A[v][R + 1]), u(A[v + 1][R]), u(A[v][R])) : (
            u(A[v][R + 1]), u(A[v + 1][R + 1]), u(A[v + 1][R]));
          }
        }
        function c(b) {
          let T = new z();
          for (let y = 0; y < r.length; y += 3)
          T.x = r[y + 0],
          T.y = r[y + 1],
          T.z = r[y + 2],
          T.normalize().multiplyScalar(b),
          r[y + 0] = T.x,
          r[y + 1] = T.y,
          r[y + 2] = T.z;
        }
        function h() {
          let b = new z();
          for (let T = 0; T < r.length; T += 3) {
            b.x = r[T + 0], b.y = r[T + 1], b.z = r[T + 2];
            let y = g(b) / 2 / Math.PI + 0.5,
              S = m(b) / Math.PI + 0.5;
            o.push(y, 1 - S);
          }
          p(), d();
        }
        function d() {
          for (let b = 0; b < o.length; b += 6) {
            let T = o[b + 0],
              y = o[b + 2],
              S = o[b + 4],
              M = Math.max(T, y, S),
              A = Math.min(T, y, S);
            M > 0.9 &&
            A < 0.1 && (
            T < 0.2 && (o[b + 0] += 1),
            y < 0.2 && (o[b + 2] += 1),
            S < 0.2 && (o[b + 4] += 1));
          }
        }
        function u(b) {
          r.push(b.x, b.y, b.z);
        }
        function f(b, T) {
          let y = b * 3;
          T.x = t[y + 0], T.y = t[y + 1], T.z = t[y + 2];
        }
        function p() {
          let b = new z(),
            T = new z(),
            y = new z(),
            S = new z(),
            M = new Vt(),
            A = new Vt(),
            v = new Vt();
          for (let E = 0, R = 0; E < r.length; E += 9, R += 6) {
            b.set(r[E + 0], r[E + 1], r[E + 2]),
            T.set(r[E + 3], r[E + 4], r[E + 5]),
            y.set(r[E + 6], r[E + 7], r[E + 8]),
            M.set(o[R + 0], o[R + 1]),
            A.set(o[R + 2], o[R + 3]),
            v.set(o[R + 4], o[R + 5]),
            S.copy(b).add(T).add(y).divideScalar(3);
            let P = g(S);
            x(M, R + 0, b, P), x(A, R + 2, T, P), x(v, R + 4, y, P);
          }
        }
        function x(b, T, y, S) {
          S < 0 && b.x === 1 && (o[T] = b.x - 1),
          y.x === 0 && y.z === 0 && (o[T] = S / 2 / Math.PI + 0.5);
        }
        function g(b) {
          return Math.atan2(b.z, -b.x);
        }
        function m(b) {
          return Math.atan2(-b.y, Math.sqrt(b.x * b.x + b.z * b.z));
        }
      }
      copy(t) {
        return (
          super.copy(t),
          this.parameters = Object.assign({}, t.parameters),
          this);

      }
      static fromJSON(t) {
        return new i(t.vertices, t.indices, t.radius, t.detail);
      }
    },
    No = class i extends Do {
      constructor(t = 1, e = 0) {
        let n = (1 + Math.sqrt(5)) / 2,
          s = 1 / n,
          r = [
          -1,
          -1,
          -1,
          -1,
          -1,
          1,
          -1,
          1,
          -1,
          -1,
          1,
          1,
          1,
          -1,
          -1,
          1,
          -1,
          1,
          1,
          1,
          -1,
          1,
          1,
          1,
          0,
          -s,
          -n,
          0,
          -s,
          n,
          0,
          s,
          -n,
          0,
          s,
          n,
          -s,
          -n,
          0,
          -s,
          n,
          0,
          s,
          -n,
          0,
          s,
          n,
          0,
          -n,
          0,
          -s,
          n,
          0,
          -s,
          -n,
          0,
          s,
          n,
          0,
          s],

          o = [
          3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4,
          8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0,
          1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18,
          3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4,
          0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4,
          17, 1, 12, 14, 1, 14, 5, 1, 5, 9];

        super(r, o, t, e),
        this.type = "DodecahedronGeometry",
        this.parameters = { radius: t, detail: e };
      }
      static fromJSON(t) {
        return new i(t.radius, t.detail);
      }
    };
  var jn = class i extends Do {
    constructor(t = 1, e = 0) {
      let n = (1 + Math.sqrt(5)) / 2,
        s = [
        -1,
        n,
        0,
        1,
        n,
        0,
        -1,
        -n,
        0,
        1,
        -n,
        0,
        0,
        -1,
        n,
        0,
        1,
        n,
        0,
        -1,
        -n,
        0,
        1,
        -n,
        n,
        0,
        -1,
        n,
        0,
        1,
        -n,
        0,
        -1,
        -n,
        0,
        1],

        r = [
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4,
        11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3,
        8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];

      super(s, r, t, e),
      this.type = "IcosahedronGeometry",
      this.parameters = { radius: t, detail: e };
    }
    static fromJSON(t) {
      return new i(t.radius, t.detail);
    }
  };
  var As = class i extends ye {
      constructor(t = 1, e = 1, n = 1, s = 1) {
        super(),
        this.type = "PlaneGeometry",
        this.parameters = {
          width: t,
          height: e,
          widthSegments: n,
          heightSegments: s
        };
        let r = t / 2,
          o = e / 2,
          a = Math.floor(n),
          l = Math.floor(s),
          c = a + 1,
          h = l + 1,
          d = t / a,
          u = e / l,
          f = [],
          p = [],
          x = [],
          g = [];
        for (let m = 0; m < h; m++) {
          let b = m * u - o;
          for (let T = 0; T < c; T++) {
            let y = T * d - r;
            p.push(y, -b, 0), x.push(0, 0, 1), g.push(T / a), g.push(1 - m / l);
          }
        }
        for (let m = 0; m < l; m++)
        for (let b = 0; b < a; b++) {
          let T = b + c * m,
            y = b + c * (m + 1),
            S = b + 1 + c * (m + 1),
            M = b + 1 + c * m;
          f.push(T, y, M), f.push(y, S, M);
        }
        this.setIndex(f),
        this.setAttribute("position", new Zt(p, 3)),
        this.setAttribute("normal", new Zt(x, 3)),
        this.setAttribute("uv", new Zt(g, 2));
      }
      copy(t) {
        return (
          super.copy(t),
          this.parameters = Object.assign({}, t.parameters),
          this);

      }
      static fromJSON(t) {
        return new i(t.width, t.height, t.widthSegments, t.heightSegments);
      }
    },
    Rs = class i extends ye {
      constructor(t = 0.5, e = 1, n = 32, s = 1, r = 0, o = Math.PI * 2) {
        super(),
        this.type = "RingGeometry",
        this.parameters = {
          innerRadius: t,
          outerRadius: e,
          thetaSegments: n,
          phiSegments: s,
          thetaStart: r,
          thetaLength: o
        },
        n = Math.max(3, n),
        s = Math.max(1, s);
        let a = [],
          l = [],
          c = [],
          h = [],
          d = t,
          u = (e - t) / s,
          f = new z(),
          p = new Vt();
        for (let x = 0; x <= s; x++) {
          for (let g = 0; g <= n; g++) {
            let m = r + g / n * o;
            f.x = d * Math.cos(m),
            f.y = d * Math.sin(m),
            l.push(f.x, f.y, f.z),
            c.push(0, 0, 1),
            p.x = (f.x / e + 1) / 2,
            p.y = (f.y / e + 1) / 2,
            h.push(p.x, p.y);
          }
          d += u;
        }
        for (let x = 0; x < s; x++) {
          let g = x * (n + 1);
          for (let m = 0; m < n; m++) {
            let b = m + g,
              T = b,
              y = b + n + 1,
              S = b + n + 2,
              M = b + 1;
            a.push(T, y, M), a.push(y, S, M);
          }
        }
        this.setIndex(a),
        this.setAttribute("position", new Zt(l, 3)),
        this.setAttribute("normal", new Zt(c, 3)),
        this.setAttribute("uv", new Zt(h, 2));
      }
      copy(t) {
        return (
          super.copy(t),
          this.parameters = Object.assign({}, t.parameters),
          this);

      }
      static fromJSON(t) {
        return new i(
          t.innerRadius,
          t.outerRadius,
          t.thetaSegments,
          t.phiSegments,
          t.thetaStart,
          t.thetaLength
        );
      }
    };
  var ks = class i extends ye {
    constructor(
    t = 1,
    e = 32,
    n = 16,
    s = 0,
    r = Math.PI * 2,
    o = 0,
    a = Math.PI)
    {
      super(),
      this.type = "SphereGeometry",
      this.parameters = {
        radius: t,
        widthSegments: e,
        heightSegments: n,
        phiStart: s,
        phiLength: r,
        thetaStart: o,
        thetaLength: a
      },
      e = Math.max(3, Math.floor(e)),
      n = Math.max(2, Math.floor(n));
      let l = Math.min(o + a, Math.PI),
        c = 0,
        h = [],
        d = new z(),
        u = new z(),
        f = [],
        p = [],
        x = [],
        g = [];
      for (let m = 0; m <= n; m++) {
        let b = [],
          T = m / n,
          y = o + T * a,
          S = t * Math.cos(y),
          M = Math.sqrt(t * t - S * S),
          A = 0;
        m === 0 && o === 0 ?
        A = 0.5 / e :
        m === n && l === Math.PI && (A = -0.5 / e);
        for (let v = 0; v <= e; v++) {
          let E = v / e,
            R = s + E * r;
          d.x = -M * Math.cos(R),
          d.y = S,
          d.z = M * Math.sin(R),
          p.push(d.x, d.y, d.z),
          u.copy(d).normalize(),
          x.push(u.x, u.y, u.z),
          g.push(E + A, 1 - T),
          b.push(c++);
        }
        h.push(b);
      }
      for (let m = 0; m < n; m++)
      for (let b = 0; b < e; b++) {
        let T = h[m][b + 1],
          y = h[m][b],
          S = h[m + 1][b],
          M = h[m + 1][b + 1];
        (m !== 0 || o > 0) && f.push(T, y, M),
        (m !== n - 1 || l < Math.PI) && f.push(y, S, M);
      }
      this.setIndex(f),
      this.setAttribute("position", new Zt(p, 3)),
      this.setAttribute("normal", new Zt(x, 3)),
      this.setAttribute("uv", new Zt(g, 2));
    }
    copy(t) {
      return (
        super.copy(t), this.parameters = Object.assign({}, t.parameters), this);

    }
    static fromJSON(t) {
      return new i(
        t.radius,
        t.widthSegments,
        t.heightSegments,
        t.phiStart,
        t.phiLength,
        t.thetaStart,
        t.thetaLength
      );
    }
  };
  var zo = class i extends ye {
    constructor(
    t = 1,
    e = 0.4,
    n = 12,
    s = 48,
    r = Math.PI * 2,
    o = 0,
    a = Math.PI * 2)
    {
      super(),
      this.type = "TorusGeometry",
      this.parameters = {
        radius: t,
        tube: e,
        radialSegments: n,
        tubularSegments: s,
        arc: r,
        thetaStart: o,
        thetaLength: a
      },
      n = Math.floor(n),
      s = Math.floor(s);
      let l = [],
        c = [],
        h = [],
        d = [],
        u = new z(),
        f = new z(),
        p = new z();
      for (let x = 0; x <= n; x++) {
        let g = o + x / n * a;
        for (let m = 0; m <= s; m++) {
          let b = m / s * r;
          f.x = (t + e * Math.cos(g)) * Math.cos(b),
          f.y = (t + e * Math.cos(g)) * Math.sin(b),
          f.z = e * Math.sin(g),
          c.push(f.x, f.y, f.z),
          u.x = t * Math.cos(b),
          u.y = t * Math.sin(b),
          p.subVectors(f, u).normalize(),
          h.push(p.x, p.y, p.z),
          d.push(m / s),
          d.push(x / n);
        }
      }
      for (let x = 1; x <= n; x++)
      for (let g = 1; g <= s; g++) {
        let m = (s + 1) * x + g - 1,
          b = (s + 1) * (x - 1) + g - 1,
          T = (s + 1) * (x - 1) + g,
          y = (s + 1) * x + g;
        l.push(m, b, y), l.push(b, T, y);
      }
      this.setIndex(l),
      this.setAttribute("position", new Zt(c, 3)),
      this.setAttribute("normal", new Zt(h, 3)),
      this.setAttribute("uv", new Zt(d, 2));
    }
    copy(t) {
      return (
        super.copy(t), this.parameters = Object.assign({}, t.parameters), this);

    }
    static fromJSON(t) {
      return new i(
        t.radius,
        t.tube,
        t.radialSegments,
        t.tubularSegments,
        t.arc,
        t.thetaStart,
        t.thetaLength
      );
    }
  };
  function Ds(i) {
    let t = {};
    for (let e in i) {
      t[e] = {};
      for (let n in i[e]) {
        let s = i[e][n];
        if (Xf(s))
        s.isRenderTargetTexture ? (
        Ht(
          "UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."
        ),
        t[e][n] = null) :
        t[e][n] = s.clone();else
        if (Array.isArray(s)) {
          if (Xf(s[0])) {
            let r = [];
            for (let o = 0, a = s.length; o < a; o++) r[o] = s[o].clone();
            t[e][n] = r;
          } else t[e][n] = s.slice();} else
        t[e][n] = s;
      }
    }
    return t;
  }
  function xn(i) {
    let t = {};
    for (let e = 0; e < i.length; e++) {
      let n = Ds(i[e]);
      for (let s in n) t[s] = n[s];
    }
    return t;
  }
  function Xf(i) {
    return (
      i && (
      i.isColor ||
      i.isMatrix3 ||
      i.isMatrix4 ||
      i.isVector2 ||
      i.isVector3 ||
      i.isVector4 ||
      i.isTexture ||
      i.isQuaternion));

  }
  function Hg(i) {
    let t = [];
    for (let e = 0; e < i.length; e++) t.push(i[e].clone());
    return t;
  }
  function Pu(i) {
    let t = i.getRenderTarget();
    return t === null ?
    i.outputColorSpace :
    t.isXRRenderTarget === !0 ?
    t.texture.colorSpace :
    ie.workingColorSpace;
  }
  var Fp = { clone: Ds, merge: xn },
    Vg = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
    Gg = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,
    Ke = class extends Jn {
      constructor(t) {
        super(),
        this.isShaderMaterial = !0,
        this.type = "ShaderMaterial",
        this.defines = {},
        this.uniforms = {},
        this.uniformsGroups = [],
        this.vertexShader = Vg,
        this.fragmentShader = Gg,
        this.linewidth = 1,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.fog = !1,
        this.lights = !1,
        this.clipping = !1,
        this.forceSinglePass = !0,
        this.extensions = { clipCullDistance: !1, multiDraw: !1 },
        this.defaultAttributeValues = {
          color: [1, 1, 1],
          uv: [0, 0],
          uv1: [0, 0]
        },
        this.index0AttributeName = void 0,
        this.uniformsNeedUpdate = !1,
        this.glslVersion = null,
        t !== void 0 && this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.fragmentShader = t.fragmentShader,
          this.vertexShader = t.vertexShader,
          this.uniforms = Ds(t.uniforms),
          this.uniformsGroups = Hg(t.uniformsGroups),
          this.defines = Object.assign({}, t.defines),
          this.wireframe = t.wireframe,
          this.wireframeLinewidth = t.wireframeLinewidth,
          this.fog = t.fog,
          this.lights = t.lights,
          this.clipping = t.clipping,
          this.extensions = Object.assign({}, t.extensions),
          this.glslVersion = t.glslVersion,
          this.defaultAttributeValues = Object.assign(
            {},
            t.defaultAttributeValues
          ),
          this.index0AttributeName = t.index0AttributeName,
          this.uniformsNeedUpdate = t.uniformsNeedUpdate,
          this);

      }
      toJSON(t) {
        let e = super.toJSON(t);
        e.glslVersion = this.glslVersion, e.uniforms = {};
        for (let s in this.uniforms) {
          let o = this.uniforms[s].value;
          o && o.isTexture ?
          e.uniforms[s] = { type: "t", value: o.toJSON(t).uuid } :
          o && o.isColor ?
          e.uniforms[s] = { type: "c", value: o.getHex() } :
          o && o.isVector2 ?
          e.uniforms[s] = { type: "v2", value: o.toArray() } :
          o && o.isVector3 ?
          e.uniforms[s] = { type: "v3", value: o.toArray() } :
          o && o.isVector4 ?
          e.uniforms[s] = { type: "v4", value: o.toArray() } :
          o && o.isMatrix3 ?
          e.uniforms[s] = { type: "m3", value: o.toArray() } :
          o && o.isMatrix4 ?
          e.uniforms[s] = { type: "m4", value: o.toArray() } :
          e.uniforms[s] = { value: o };
        }
        Object.keys(this.defines).length > 0 && (e.defines = this.defines),
        e.vertexShader = this.vertexShader,
        e.fragmentShader = this.fragmentShader,
        e.lights = this.lights,
        e.clipping = this.clipping;
        let n = {};
        for (let s in this.extensions) this.extensions[s] === !0 && (n[s] = !0);
        return Object.keys(n).length > 0 && (e.extensions = n), e;
      }
      fromJSON(t, e) {
        if (super.fromJSON(t, e), t.uniforms !== void 0)
        for (let n in t.uniforms) {
          let s = t.uniforms[n];
          switch (this.uniforms[n] = {}, s.type) {
            case "t":
              this.uniforms[n].value = e[s.value] || null;
              break;
            case "c":
              this.uniforms[n].value = new wt().setHex(s.value);
              break;
            case "v2":
              this.uniforms[n].value = new Vt().fromArray(s.value);
              break;
            case "v3":
              this.uniforms[n].value = new z().fromArray(s.value);
              break;
            case "v4":
              this.uniforms[n].value = new De().fromArray(s.value);
              break;
            case "m3":
              this.uniforms[n].value = new Wt().fromArray(s.value);
              break;
            case "m4":
              this.uniforms[n].value = new se().fromArray(s.value);
              break;
            default:
              this.uniforms[n].value = s.value;
          }
        }
        if (
        t.defines !== void 0 && (this.defines = t.defines),
        t.vertexShader !== void 0 && (this.vertexShader = t.vertexShader),
        t.fragmentShader !== void 0 && (
        this.fragmentShader = t.fragmentShader),
        t.glslVersion !== void 0 && (this.glslVersion = t.glslVersion),
        t.extensions !== void 0)

        for (let n in t.extensions) this.extensions[n] = t.extensions[n];
        return (
          t.lights !== void 0 && (this.lights = t.lights),
          t.clipping !== void 0 && (this.clipping = t.clipping),
          this);

      }
    },
    Sl = class extends Ke {
      constructor(t) {
        super(t),
        this.isRawShaderMaterial = !0,
        this.type = "RawShaderMaterial";
      }
    };
  var Qe = class extends Jn {
      constructor(t) {
        super(),
        this.isMeshLambertMaterial = !0,
        this.type = "MeshLambertMaterial",
        this.color = new wt(16777215),
        this.map = null,
        this.lightMap = null,
        this.lightMapIntensity = 1,
        this.aoMap = null,
        this.aoMapIntensity = 1,
        this.emissive = new wt(0),
        this.emissiveIntensity = 1,
        this.emissiveMap = null,
        this.bumpMap = null,
        this.bumpScale = 1,
        this.normalMap = null,
        this.normalMapType = Tc,
        this.normalScale = new Vt(1, 1),
        this.displacementMap = null,
        this.displacementScale = 1,
        this.displacementBias = 0,
        this.specularMap = null,
        this.alphaMap = null,
        this.envMap = null,
        this.envMapRotation = new bn(),
        this.combine = Ol,
        this.reflectivity = 1,
        this.envMapIntensity = 1,
        this.refractionRatio = 0.98,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.wireframeLinecap = "round",
        this.wireframeLinejoin = "round",
        this.flatShading = !1,
        this.fog = !0,
        this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.color.copy(t.color),
          this.map = t.map,
          this.lightMap = t.lightMap,
          this.lightMapIntensity = t.lightMapIntensity,
          this.aoMap = t.aoMap,
          this.aoMapIntensity = t.aoMapIntensity,
          this.emissive.copy(t.emissive),
          this.emissiveMap = t.emissiveMap,
          this.emissiveIntensity = t.emissiveIntensity,
          this.bumpMap = t.bumpMap,
          this.bumpScale = t.bumpScale,
          this.normalMap = t.normalMap,
          this.normalMapType = t.normalMapType,
          this.normalScale.copy(t.normalScale),
          this.displacementMap = t.displacementMap,
          this.displacementScale = t.displacementScale,
          this.displacementBias = t.displacementBias,
          this.specularMap = t.specularMap,
          this.alphaMap = t.alphaMap,
          this.envMap = t.envMap,
          this.envMapRotation.copy(t.envMapRotation),
          this.combine = t.combine,
          this.reflectivity = t.reflectivity,
          this.envMapIntensity = t.envMapIntensity,
          this.refractionRatio = t.refractionRatio,
          this.wireframe = t.wireframe,
          this.wireframeLinewidth = t.wireframeLinewidth,
          this.wireframeLinecap = t.wireframeLinecap,
          this.wireframeLinejoin = t.wireframeLinejoin,
          this.flatShading = t.flatShading,
          this.fog = t.fog,
          this);

      }
    },
    wl = class extends Jn {
      constructor(t) {
        super(),
        this.isMeshDepthMaterial = !0,
        this.type = "MeshDepthMaterial",
        this.depthPacking = Sp,
        this.map = null,
        this.alphaMap = null,
        this.displacementMap = null,
        this.displacementScale = 1,
        this.displacementBias = 0,
        this.wireframe = !1,
        this.wireframeLinewidth = 1,
        this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.depthPacking = t.depthPacking,
          this.map = t.map,
          this.alphaMap = t.alphaMap,
          this.displacementMap = t.displacementMap,
          this.displacementScale = t.displacementScale,
          this.displacementBias = t.displacementBias,
          this.wireframe = t.wireframe,
          this.wireframeLinewidth = t.wireframeLinewidth,
          this);

      }
    },
    El = class extends Jn {
      constructor(t) {
        super(),
        this.isMeshDistanceMaterial = !0,
        this.type = "MeshDistanceMaterial",
        this.map = null,
        this.alphaMap = null,
        this.displacementMap = null,
        this.displacementScale = 1,
        this.displacementBias = 0,
        this.setValues(t);
      }
      copy(t) {
        return (
          super.copy(t),
          this.map = t.map,
          this.alphaMap = t.alphaMap,
          this.displacementMap = t.displacementMap,
          this.displacementScale = t.displacementScale,
          this.displacementBias = t.displacementBias,
          this);

      }
    };
  function hr(i, t) {
    return !i || i.constructor === t ?
    i :
    typeof t.BYTES_PER_ELEMENT == "number" ?
    new t(i) :
    Array.prototype.slice.call(i);
  }
  function Kh(i) {
    return i !== void 0 && i.inTangents !== void 0 && i.outTangents !== void 0;
  }
  var Qi = class {
      constructor(t, e, n, s) {
        this.parameterPositions = t,
        this._cachedIndex = 0,
        this.resultBuffer = s !== void 0 ? s : new e.constructor(n),
        this.sampleValues = e,
        this.valueSize = n,
        this.settings = null,
        this.DefaultSettings_ = {};
      }
      evaluate(t) {
        let e = this.parameterPositions,
          n = this._cachedIndex,
          s = e[n],
          r = e[n - 1];
        n: {
          t: {
            let o;
            e: {
              i: if (!(t < s)) {
                for (let a = n + 2;;) {
                  if (s === void 0) {
                    if (t < r) break i;
                    return (
                      n = e.length,
                      this._cachedIndex = n,
                      this.copySampleValue_(n - 1));

                  }
                  if (n === a) break;
                  if (r = s, s = e[++n], t < s) break t;
                }
                o = e.length;
                break e;
              }
              if (!(t >= r)) {
                let a = e[1];
                t < a && (n = 2, r = a);
                for (let l = n - 2;;) {
                  if (r === void 0)
                  return this._cachedIndex = 0, this.copySampleValue_(0);
                  if (n === l) break;
                  if (s = r, r = e[--n - 1], t >= r) break t;
                }
                o = n, n = 0;
                break e;
              }
              break n;
            }
            for (; n < o;) {
              let a = n + o >>> 1;
              t < e[a] ? o = a : n = a + 1;
            }
            if (s = e[n], r = e[n - 1], r === void 0)
            return this._cachedIndex = 0, this.copySampleValue_(0);
            if (s === void 0)
            return (
              n = e.length,
              this._cachedIndex = n,
              this.copySampleValue_(n - 1));

          }
          this._cachedIndex = n, this.intervalChanged_(n, r, s);
        }
        return this.interpolate_(n, r, t, s);
      }
      getSettings_() {
        return this.settings || this.DefaultSettings_;
      }
      copySampleValue_(t) {
        let e = this.resultBuffer,
          n = this.sampleValues,
          s = this.valueSize,
          r = t * s;
        for (let o = 0; o !== s; ++o) e[o] = n[r + o];
        return e;
      }
      interpolate_() {
        throw new Error("THREE.Interpolant: Call to abstract method.");
      }
      intervalChanged_() {}
    },
    Tl = class extends Qi {
      constructor(t, e, n, s) {
        super(t, e, n, s),
        this._weightPrev = -0,
        this._offsetPrev = -0,
        this._weightNext = -0,
        this._offsetNext = -0,
        this.DefaultSettings_ = { endingStart: eu, endingEnd: eu };
      }
      intervalChanged_(t, e, n) {
        let s = this.parameterPositions,
          r = t - 2,
          o = t + 1,
          a = s[r],
          l = s[o];
        if (a === void 0)
        switch (this.getSettings_().endingStart) {
          case nu:
            r = t, a = 2 * e - n;
            break;
          case iu:
            r = s.length - 2, a = e + s[r] - s[r + 1];
            break;
          default:
            r = t, a = n;
        }
        if (l === void 0)
        switch (this.getSettings_().endingEnd) {
          case nu:
            o = t, l = 2 * n - e;
            break;
          case iu:
            o = 1, l = n + s[1] - s[0];
            break;
          default:
            o = t - 1, l = e;
        }
        let c = (n - e) * 0.5,
          h = this.valueSize;
        this._weightPrev = c / (e - a),
        this._weightNext = c / (l - n),
        this._offsetPrev = r * h,
        this._offsetNext = o * h;
      }
      interpolate_(t, e, n, s) {
        let r = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          l = t * a,
          c = l - a,
          h = this._offsetPrev,
          d = this._offsetNext,
          u = this._weightPrev,
          f = this._weightNext,
          p = (n - e) / (s - e),
          x = p * p,
          g = x * p,
          m = -u * g + 2 * u * x - u * p,
          b = (1 + u) * g + (-1.5 - 2 * u) * x + (-0.5 + u) * p + 1,
          T = (-1 - f) * g + (1.5 + f) * x + 0.5 * p,
          y = f * g - f * x;
        for (let S = 0; S !== a; ++S)
        r[S] = m * o[h + S] + b * o[c + S] + T * o[l + S] + y * o[d + S];
        return r;
      }
    },
    Al = class extends Qi {
      constructor(t, e, n, s) {
        super(t, e, n, s);
      }
      interpolate_(t, e, n, s) {
        let r = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          l = t * a,
          c = l - a,
          h = (n - e) / (s - e),
          d = 1 - h;
        for (let u = 0; u !== a; ++u) r[u] = o[c + u] * d + o[l + u] * h;
        return r;
      }
    },
    Rl = class extends Qi {
      constructor(t, e, n, s) {
        super(t, e, n, s);
      }
      interpolate_(t) {
        return this.copySampleValue_(t - 1);
      }
    },
    kl = class extends Qi {
      interpolate_(t, e, n, s) {
        let r = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          l = t * a,
          c = l - a,
          h = this.inTangents,
          d = this.outTangents;
        if (!h || !d) {
          let p = (n - e) / (s - e),
            x = 1 - p;
          for (let g = 0; g !== a; ++g) r[g] = o[c + g] * x + o[l + g] * p;
          return r;
        }
        let u = a * 2,
          f = t - 1;
        for (let p = 0; p !== a; ++p) {
          let x = o[c + p],
            g = o[l + p],
            m = f * u + p * 2,
            b = d[m],
            T = d[m + 1],
            y = t * u + p * 2,
            S = h[y],
            M = h[y + 1],
            A = Xg(n, e, b, S, s);
          r[p] = Op(A, x, T, M, g);
        }
        return r;
      }
    };
  function Op(i, t, e, n, s) {
    let r = 1 - i;
    return (
      r * r * r * t + 3 * r * r * i * e + 3 * r * i * i * n + i * i * i * s);

  }
  function Wg(i, t, e, n, s) {
    let r = 1 - i;
    return 3 * r * r * (e - t) + 6 * r * i * (n - e) + 3 * i * i * (s - n);
  }
  function Xg(i, t, e, n, s) {
    let r = (i - t) / (s - t);
    for (let o = 0; o < 8; o++) {
      let a = Op(r, t, e, n, s) - i;
      if (Math.abs(a) < 1e-10) break;
      let l = Wg(r, t, e, n, s);
      if (Math.abs(l) < 1e-10) break;
      r = Math.max(0, Math.min(1, r - a / l));
    }
    return r;
  }
  var Pn = class {
    constructor(t, e, n, s) {
      if (t === void 0)
      throw new Error("THREE.KeyframeTrack: track name is undefined");
      if (e === void 0 || e.length === 0)
      throw new Error(
        "THREE.KeyframeTrack: no keyframes in track named " + t
      );
      this.name = t,
      this.times = hr(e, this.TimeBufferType),
      this.values = hr(n, this.ValueBufferType),
      this.setInterpolation(s || this.DefaultInterpolation);
    }
    static toJSON(t) {
      let e = t.constructor,
        n;
      if (e.toJSON !== this.toJSON) n = e.toJSON(t);else
      {
        n = {
          name: t.name,
          times: hr(t.times, Array),
          values: hr(t.values, Array)
        };
        let s = t.getInterpolation();
        s !== t.DefaultInterpolation && (n.interpolation = s),
        Kh(t.settings) && (
        n.settings = {
          inTangents: hr(t.settings.inTangents, Array),
          outTangents: hr(t.settings.outTangents, Array)
        });
      }
      return n.type = t.ValueTypeName, n;
    }
    InterpolantFactoryMethodDiscrete(t) {
      return new Rl(this.times, this.values, this.getValueSize(), t);
    }
    InterpolantFactoryMethodLinear(t) {
      return new Al(this.times, this.values, this.getValueSize(), t);
    }
    InterpolantFactoryMethodSmooth(t) {
      return new Tl(this.times, this.values, this.getValueSize(), t);
    }
    InterpolantFactoryMethodBezier(t) {
      let e = new kl(this.times, this.values, this.getValueSize(), t);
      return (
        this.settings && (
        e.inTangents = this.settings.inTangents,
        e.outTangents = this.settings.outTangents),
        e);

    }
    setInterpolation(t) {
      let e;
      switch (t) {
        case yo:
          e = this.InterpolantFactoryMethodDiscrete;
          break;
        case pl:
          e = this.InterpolantFactoryMethodLinear;
          break;
        case il:
          e = this.InterpolantFactoryMethodSmooth;
          break;
        case tu:
          e = this.InterpolantFactoryMethodBezier;
          break;
      }
      if (e === void 0) {
        let n =
        "unsupported interpolation for " +
        this.ValueTypeName +
        " keyframe track named " +
        this.name;
        if (this.createInterpolant === void 0)
        if (t !== this.DefaultInterpolation)
        this.setInterpolation(this.DefaultInterpolation);else
        throw new Error(n);
        return Ht("KeyframeTrack:", n), this;
      }
      return this.createInterpolant = e, this;
    }
    getInterpolation() {
      switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
          return yo;
        case this.InterpolantFactoryMethodLinear:
          return pl;
        case this.InterpolantFactoryMethodSmooth:
          return il;
        case this.InterpolantFactoryMethodBezier:
          return tu;
      }
    }
    getValueSize() {
      return this.values.length / this.times.length;
    }
    shift(t) {
      if (t !== 0) {
        let e = this.times;
        for (let n = 0, s = e.length; n !== s; ++n) e[n] += t;
      }
      return this;
    }
    scale(t) {
      if (t !== 1) {
        let e = this.times;
        for (let n = 0, s = e.length; n !== s; ++n) e[n] *= t;
        Kh(this.settings) && (
        $f(this.settings.inTangents, t), $f(this.settings.outTangents, t));
      }
      return this;
    }
    trim(t, e) {
      let n = this.times,
        s = n.length,
        r = 0,
        o = s - 1;
      for (; r !== s && n[r] < t;) ++r;
      for (; o !== -1 && n[o] > e;) --o;
      if (++o, r !== 0 || o !== s) {
        r >= o && (o = Math.max(o, 1), r = o - 1);
        let a = this.getValueSize();
        this.times = n.slice(r, o),
        this.values = this.values.slice(r * a, o * a);
      }
      return this;
    }
    validate() {
      let t = !0,
        e = this.getValueSize();
      e - Math.floor(e) !== 0 && (
      Gt("KeyframeTrack: Invalid value size in track.", this), t = !1);
      let n = this.times,
        s = this.values,
        r = n.length;
      r === 0 && (Gt("KeyframeTrack: Track is empty.", this), t = !1);
      let o = null;
      for (let a = 0; a !== r; a++) {
        let l = n[a];
        if (typeof l == "number" && isNaN(l)) {
          Gt("KeyframeTrack: Time is not a valid number.", this, a, l),
          t = !1;
          break;
        }
        if (o !== null && o > l) {
          Gt("KeyframeTrack: Out of order keys.", this, a, l, o), t = !1;
          break;
        }
        o = l;
      }
      if (s !== void 0 && _g(s))
      for (let a = 0, l = s.length; a !== l; ++a) {
        let c = s[a];
        if (isNaN(c)) {
          Gt("KeyframeTrack: Value is not a valid number.", this, a, c),
          t = !1;
          break;
        }
      }
      return t;
    }
    optimize() {
      let t = this.times.slice(),
        e = this.values.slice(),
        n = this.getValueSize(),
        s = this.getInterpolation() === il,
        r = t.length - 1,
        o = 1;
      for (let a = 1; a < r; ++a) {
        let l = !1,
          c = t[a],
          h = t[a + 1];
        if (c !== h && (a !== 1 || c !== t[0]))
        if (s) l = !0;else
        {
          let d = a * n,
            u = d - n,
            f = d + n;
          for (let p = 0; p !== n; ++p) {
            let x = e[d + p];
            if (x !== e[u + p] || x !== e[f + p]) {
              l = !0;
              break;
            }
          }
        }
        if (l) {
          if (a !== o) {
            t[o] = t[a];
            let d = a * n,
              u = o * n;
            for (let f = 0; f !== n; ++f) e[u + f] = e[d + f];
          }
          ++o;
        }
      }
      if (r > 0) {
        t[o] = t[r];
        for (let a = r * n, l = o * n, c = 0; c !== n; ++c) e[l + c] = e[a + c];
        ++o;
      }
      return (
        o !== t.length ? (
        this.times = t.slice(0, o), this.values = e.slice(0, o * n)) : (
        this.times = t, this.values = e),
        this);

    }
    clone() {
      let t = this.times.slice(),
        e = this.values.slice(),
        n = this.constructor,
        s = new n(this.name, t, e);
      return (
        s.createInterpolant = this.createInterpolant,
        Kh(this.settings) && (
        s.settings = {
          inTangents: this.settings.inTangents.slice(),
          outTangents: this.settings.outTangents.slice()
        }),
        s);

    }
  };
  function $f(i, t) {
    for (let e = 0, n = i.length; e !== n; e += 2) i[e] *= t;
  }
  Pn.prototype.ValueTypeName = "";
  Pn.prototype.TimeBufferType = Float32Array;
  Pn.prototype.ValueBufferType = Float32Array;
  Pn.prototype.DefaultInterpolation = pl;
  var ts = class extends Pn {
    constructor(t, e, n) {
      super(t, e, n);
    }
  };
  ts.prototype.ValueTypeName = "bool";
  ts.prototype.ValueBufferType = Array;
  ts.prototype.DefaultInterpolation = yo;
  ts.prototype.InterpolantFactoryMethodLinear = void 0;
  ts.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Cl = class extends Pn {
    constructor(t, e, n, s) {
      super(t, e, n, s);
    }
  };
  Cl.prototype.ValueTypeName = "color";
  var Il = class extends Pn {
    constructor(t, e, n, s) {
      super(t, e, n, s);
    }
  };
  Il.prototype.ValueTypeName = "number";
  var Pl = class extends Qi {
      constructor(t, e, n, s) {
        super(t, e, n, s);
      }
      interpolate_(t, e, n, s) {
        let r = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          l = (n - e) / (s - e),
          c = t * a;
        for (let h = c + a; c !== h; c += 4)
        mn.slerpFlat(r, 0, o, c - a, o, c, l);
        return r;
      }
    },
    Uo = class extends Pn {
      constructor(t, e, n, s) {
        super(t, e, n, s);
      }
      InterpolantFactoryMethodLinear(t) {
        return new Pl(this.times, this.values, this.getValueSize(), t);
      }
    };
  Uo.prototype.ValueTypeName = "quaternion";
  Uo.prototype.InterpolantFactoryMethodSmooth = void 0;
  var es = class extends Pn {
    constructor(t, e, n) {
      super(t, e, n);
    }
  };
  es.prototype.ValueTypeName = "string";
  es.prototype.ValueBufferType = Array;
  es.prototype.DefaultInterpolation = yo;
  es.prototype.InterpolantFactoryMethodLinear = void 0;
  es.prototype.InterpolantFactoryMethodSmooth = void 0;
  var Ll = class extends Pn {
    constructor(t, e, n, s) {
      super(t, e, n, s);
    }
  };
  Ll.prototype.ValueTypeName = "vector";
  var Dl = class {
      constructor(t, e, n) {
        let s = this,
          r = !1,
          o = 0,
          a = 0,
          l,
          c = [];
        this.onStart = void 0,
        this.onLoad = t,
        this.onProgress = e,
        this.onError = n,
        this._abortController = null,
        this.itemStart = function (h) {
          a++,
          r === !1 && s.onStart !== void 0 && s.onStart(h, o, a),
          r = !0;
        },
        this.itemEnd = function (h) {
          o++,
          s.onProgress !== void 0 && s.onProgress(h, o, a),
          o === a && (r = !1, s.onLoad !== void 0 && s.onLoad());
        },
        this.itemError = function (h) {
          s.onError !== void 0 && s.onError(h);
        },
        this.resolveURL = function (h) {
          return h = h.normalize("NFC"), l ? l(h) : h;
        },
        this.setURLModifier = function (h) {
          return l = h, this;
        },
        this.addHandler = function (h, d) {
          return c.push(h, d), this;
        },
        this.removeHandler = function (h) {
          let d = c.indexOf(h);
          return d !== -1 && c.splice(d, 2), this;
        },
        this.getHandler = function (h) {
          for (let d = 0, u = c.length; d < u; d += 2) {
            let f = c[d],
              p = c[d + 1];
            if (f.global && (f.lastIndex = 0), f.test(h)) return p;
          }
          return null;
        },
        this.abort = function () {
          return (
            this.abortController.abort(), this._abortController = null, this);

        };
      }
      get abortController() {
        return (
          this._abortController || (
          this._abortController = new AbortController()),
          this._abortController);

      }
    },
    Bp = new Dl(),
    Nl = class {
      constructor(t) {
        this.manager = t !== void 0 ? t : Bp,
        this.crossOrigin = "anonymous",
        this.withCredentials = !1,
        this.path = "",
        this.resourcePath = "",
        this.requestHeader = {},
        typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this })
        );
      }
      load() {}
      loadAsync(t, e) {
        let n = this;
        return new Promise(function (s, r) {
          n.load(t, s, e, r);
        });
      }
      parse() {}
      setCrossOrigin(t) {
        return this.crossOrigin = t, this;
      }
      setWithCredentials(t) {
        return this.withCredentials = t, this;
      }
      setPath(t) {
        return this.path = t, this;
      }
      setResourcePath(t) {
        return this.resourcePath = t, this;
      }
      setRequestHeader(t) {
        return this.requestHeader = t, this;
      }
      abort() {
        return this;
      }
    };
  Nl.DEFAULT_MATERIAL_NAME = "__DEFAULT";
  var Rr = class extends Je {
      constructor(t, e = 1) {
        super(),
        this.isLight = !0,
        this.type = "Light",
        this.color = new wt(t),
        this.intensity = e;
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.color.copy(t.color),
          this.intensity = t.intensity,
          this);

      }
      toJSON(t) {
        let e = super.toJSON(t);
        return (
          e.object.color = this.color.getHex(),
          e.object.intensity = this.intensity,
          e);

      }
    },
    Fo = class extends Rr {
      constructor(t, e, n) {
        super(t, n),
        this.isHemisphereLight = !0,
        this.type = "HemisphereLight",
        this.position.copy(Je.DEFAULT_UP),
        this.updateMatrix(),
        this.groundColor = new wt(e);
      }
      copy(t, e) {
        return super.copy(t, e), this.groundColor.copy(t.groundColor), this;
      }
      toJSON(t) {
        let e = super.toJSON(t);
        return e.object.groundColor = this.groundColor.getHex(), e;
      }
    },
    Qh = new se(),
    qf = new z(),
    Yf = new z(),
    Oo = class {
      constructor(t) {
        this.camera = t,
        this.intensity = 1,
        this.bias = 0,
        this.biasNode = null,
        this.normalBias = 0,
        this.radius = 1,
        this.blurSamples = 8,
        this.mapSize = new Vt(512, 512),
        this.mapType = Tn,
        this.map = null,
        this.mapPass = null,
        this.matrix = new se(),
        this.autoUpdate = !0,
        this.needsUpdate = !1,
        this._frustum = new Sr(),
        this._frameExtents = new Vt(1, 1),
        this._viewportCount = 1,
        this._viewports = [new De(0, 0, 1, 1)];
      }
      getViewportCount() {
        return this._viewportCount;
      }
      getCamera() {
        return this.camera;
      }
      getFrustum() {
        return this._frustum;
      }
      updateMatrices(t) {
        let e = this.camera;
        qf.setFromMatrixPosition(t.matrixWorld),
        e.position.copy(qf),
        Yf.setFromMatrixPosition(t.target.matrixWorld),
        e.lookAt(Yf),
        e.updateMatrixWorld(),
        this._updateMatrix(e, this.matrix, this._frustum);
      }
      _updateMatrix(t, e, n, s) {
        Qh.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse),
        n.setFromProjectionMatrix(Qh, t.coordinateSystem, t.reversedDepth);
        let r = this._frameExtents,
          o = s ? s.z / r.x : 1,
          a = s ? s.w / r.y : 1,
          l = s ? s.x / r.x : 0,
          c = s ? s.y / r.y : 0;
        t.coordinateSystem === mr || t.reversedDepth ?
        e.set(
          0.5 * o,
          0,
          0,
          0.5 * o + l,
          0,
          0.5 * a,
          0,
          0.5 * a + c,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ) :
        e.set(
          0.5 * o,
          0,
          0,
          0.5 * o + l,
          0,
          0.5 * a,
          0,
          0.5 * a + c,
          0,
          0,
          0.5,
          0.5,
          0,
          0,
          0,
          1
        ),
        e.multiply(Qh);
      }
      getViewport(t) {
        return this._viewports[t];
      }
      getFrameExtents() {
        return this._frameExtents;
      }
      dispose() {
        this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
      }
      copy(t) {
        return (
          this.camera = t.camera.clone(),
          this.intensity = t.intensity,
          this.bias = t.bias,
          this.radius = t.radius,
          this.autoUpdate = t.autoUpdate,
          this.needsUpdate = t.needsUpdate,
          this.normalBias = t.normalBias,
          this.blurSamples = t.blurSamples,
          this.mapSize.copy(t.mapSize),
          this.biasNode = t.biasNode,
          this);

      }
      clone() {
        return new this.constructor().copy(this);
      }
      toJSON() {
        let t = {};
        return (
          t.intensity = this.intensity,
          t.bias = this.bias,
          t.normalBias = this.normalBias,
          t.radius = this.radius,
          t.blurSamples = this.blurSamples,
          t.mapSize = this.mapSize.toArray(),
          t.camera = this.camera.toJSON(!1).object,
          delete t.camera.matrix,
          t);

      }
    },
    el = new z(),
    nl = new mn(),
    li = new z(),
    Bo = class extends Je {
      constructor() {
        super(),
        this.isCamera = !0,
        this.type = "Camera",
        this.matrixWorldInverse = new se(),
        this.projectionMatrix = new se(),
        this.projectionMatrixInverse = new se(),
        this.coordinateSystem = Zn,
        this._reversedDepth = !1;
      }
      get reversedDepth() {
        return this._reversedDepth;
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.matrixWorldInverse.copy(t.matrixWorldInverse),
          this.projectionMatrix.copy(t.projectionMatrix),
          this.projectionMatrixInverse.copy(t.projectionMatrixInverse),
          this.coordinateSystem = t.coordinateSystem,
          this);

      }
      getWorldDirection(t) {
        return super.getWorldDirection(t).negate();
      }
      updateMatrixWorld(t) {
        super.updateMatrixWorld(t),
        this.matrixWorld.decompose(el, nl, li),
        li.x === 1 && li.y === 1 && li.z === 1 ?
        this.matrixWorldInverse.copy(this.matrixWorld).invert() :
        this.matrixWorldInverse.compose(el, nl, li.set(1, 1, 1)).invert();
      }
      updateWorldMatrix(t, e, n = !1) {
        super.updateWorldMatrix(t, e, n),
        this.matrixWorld.decompose(el, nl, li),
        li.x === 1 && li.y === 1 && li.z === 1 ?
        this.matrixWorldInverse.copy(this.matrixWorld).invert() :
        this.matrixWorldInverse.compose(el, nl, li.set(1, 1, 1)).invert();
      }
      clone() {
        return new this.constructor().copy(this);
      }
    },
    Ji = new z(),
    Zf = new Vt(),
    Jf = new Vt(),
    ln = class extends Bo {
      constructor(t = 50, e = 1, n = 0.1, s = 2e3) {
        super(),
        this.isPerspectiveCamera = !0,
        this.type = "PerspectiveCamera",
        this.fov = t,
        this.zoom = 1,
        this.near = n,
        this.far = s,
        this.focus = 10,
        this.aspect = e,
        this.view = null,
        this.filmGauge = 35,
        this.filmOffset = 0,
        this.updateProjectionMatrix();
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.fov = t.fov,
          this.zoom = t.zoom,
          this.near = t.near,
          this.far = t.far,
          this.focus = t.focus,
          this.aspect = t.aspect,
          this.view = t.view === null ? null : Object.assign({}, t.view),
          this.filmGauge = t.filmGauge,
          this.filmOffset = t.filmOffset,
          this);

      }
      setFocalLength(t) {
        let e = 0.5 * this.getFilmHeight() / t;
        this.fov = ml * 2 * Math.atan(e), this.updateProjectionMatrix();
      }
      getFocalLength() {
        let t = Math.tan(kh * 0.5 * this.fov);
        return 0.5 * this.getFilmHeight() / t;
      }
      getEffectiveFOV() {
        return ml * 2 * Math.atan(Math.tan(kh * 0.5 * this.fov) / this.zoom);
      }
      getFilmWidth() {
        return this.filmGauge * Math.min(this.aspect, 1);
      }
      getFilmHeight() {
        return this.filmGauge / Math.max(this.aspect, 1);
      }
      getViewBounds(t, e, n) {
        Ji.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
        e.set(Ji.x, Ji.y).multiplyScalar(-t / Ji.z),
        Ji.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
        n.set(Ji.x, Ji.y).multiplyScalar(-t / Ji.z);
      }
      getViewSize(t, e) {
        return this.getViewBounds(t, Zf, Jf), e.subVectors(Jf, Zf);
      }
      setViewOffset(t, e, n, s, r, o) {
        this.aspect = t / e,
        this.view === null && (
        this.view = {
          enabled: !0,
          fullWidth: 1,
          fullHeight: 1,
          offsetX: 0,
          offsetY: 0,
          width: 1,
          height: 1
        }),
        this.view.enabled = !0,
        this.view.fullWidth = t,
        this.view.fullHeight = e,
        this.view.offsetX = n,
        this.view.offsetY = s,
        this.view.width = r,
        this.view.height = o,
        this.updateProjectionMatrix();
      }
      clearViewOffset() {
        this.view !== null && (this.view.enabled = !1),
        this.updateProjectionMatrix();
      }
      updateProjectionMatrix() {
        let t = this.near,
          e = t * Math.tan(kh * 0.5 * this.fov) / this.zoom,
          n = 2 * e,
          s = this.aspect * n,
          r = -0.5 * s,
          o = this.view;
        if (this.view !== null && this.view.enabled) {
          let l = o.fullWidth,
            c = o.fullHeight;
          r += o.offsetX * s / l,
          e -= o.offsetY * n / c,
          s *= o.width / l,
          n *= o.height / c;
        }
        let a = this.filmOffset;
        a !== 0 && (r += t * a / this.getFilmWidth()),
        this.projectionMatrix.makePerspective(
          r,
          r + s,
          e,
          e - n,
          t,
          this.far,
          this.coordinateSystem,
          this.reversedDepth
        ),
        this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
      }
      toJSON(t) {
        let e = super.toJSON(t);
        return (
          e.object.fov = this.fov,
          e.object.zoom = this.zoom,
          e.object.near = this.near,
          e.object.far = this.far,
          e.object.focus = this.focus,
          e.object.aspect = this.aspect,
          this.view !== null && (e.object.view = Object.assign({}, this.view)),
          e.object.filmGauge = this.filmGauge,
          e.object.filmOffset = this.filmOffset,
          e);

      }
    };
  var ru = class extends Oo {
      constructor() {
        super(new ln(90, 1, 0.5, 500)), this.isPointLightShadow = !0;
      }
    },
    Cs = class extends Rr {
      constructor(t, e, n = 0, s = 2) {
        super(t, e),
        this.isPointLight = !0,
        this.type = "PointLight",
        this.distance = n,
        this.decay = s,
        this.shadow = new ru();
      }
      get power() {
        return this.intensity * 4 * Math.PI;
      }
      set power(t) {
        this.intensity = t / (4 * Math.PI);
      }
      dispose() {
        super.dispose(), this.shadow.dispose();
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.distance = t.distance,
          this.decay = t.decay,
          this.shadow = t.shadow.clone(),
          this);

      }
      toJSON(t) {
        let e = super.toJSON(t);
        return (
          e.object.distance = this.distance,
          e.object.decay = this.decay,
          e.object.shadow = this.shadow.toJSON(),
          e);

      }
    },
    ns = class extends Bo {
      constructor(t = -1, e = 1, n = 1, s = -1, r = 0.1, o = 2e3) {
        super(),
        this.isOrthographicCamera = !0,
        this.type = "OrthographicCamera",
        this.zoom = 1,
        this.view = null,
        this.left = t,
        this.right = e,
        this.top = n,
        this.bottom = s,
        this.near = r,
        this.far = o,
        this.updateProjectionMatrix();
      }
      copy(t, e) {
        return (
          super.copy(t, e),
          this.left = t.left,
          this.right = t.right,
          this.top = t.top,
          this.bottom = t.bottom,
          this.near = t.near,
          this.far = t.far,
          this.zoom = t.zoom,
          this.view = t.view === null ? null : Object.assign({}, t.view),
          this);

      }
      setViewOffset(t, e, n, s, r, o) {
        this.view === null && (
        this.view = {
          enabled: !0,
          fullWidth: 1,
          fullHeight: 1,
          offsetX: 0,
          offsetY: 0,
          width: 1,
          height: 1
        }),
        this.view.enabled = !0,
        this.view.fullWidth = t,
        this.view.fullHeight = e,
        this.view.offsetX = n,
        this.view.offsetY = s,
        this.view.width = r,
        this.view.height = o,
        this.updateProjectionMatrix();
      }
      clearViewOffset() {
        this.view !== null && (this.view.enabled = !1),
        this.updateProjectionMatrix();
      }
      updateProjectionMatrix() {
        let t = (this.right - this.left) / (2 * this.zoom),
          e = (this.top - this.bottom) / (2 * this.zoom),
          n = (this.right + this.left) / 2,
          s = (this.top + this.bottom) / 2,
          r = n - t,
          o = n + t,
          a = s + e,
          l = s - e;
        if (this.view !== null && this.view.enabled) {
          let c = (this.right - this.left) / this.view.fullWidth / this.zoom,
            h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
          r += c * this.view.offsetX,
          o = r + c * this.view.width,
          a -= h * this.view.offsetY,
          l = a - h * this.view.height;
        }
        this.projectionMatrix.makeOrthographic(
          r,
          o,
          a,
          l,
          this.near,
          this.far,
          this.coordinateSystem,
          this.reversedDepth
        ),
        this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
      }
      toJSON(t) {
        let e = super.toJSON(t);
        return (
          e.object.zoom = this.zoom,
          e.object.left = this.left,
          e.object.right = this.right,
          e.object.top = this.top,
          e.object.bottom = this.bottom,
          e.object.near = this.near,
          e.object.far = this.far,
          this.view !== null && (e.object.view = Object.assign({}, this.view)),
          e);

      }
    },
    ou = class extends Oo {
      constructor() {
        super(new ns(-5, 5, 5, -5, 0.5, 500)),
        this.isDirectionalLightShadow = !0;
      }
    },
    Ho = class extends Rr {
      constructor(t, e) {
        super(t, e),
        this.isDirectionalLight = !0,
        this.type = "DirectionalLight",
        this.position.copy(Je.DEFAULT_UP),
        this.updateMatrix(),
        this.target = new Je(),
        this.shadow = new ou();
      }
      dispose() {
        super.dispose(), this.shadow.dispose();
      }
      copy(t) {
        return (
          super.copy(t),
          this.target = t.target.clone(),
          this.shadow = t.shadow.clone(),
          this);

      }
      toJSON(t) {
        let e = super.toJSON(t);
        return (
          e.object.shadow = this.shadow.toJSON(),
          e.object.target = this.target.uuid,
          e);

      }
    };
  var ur = -90,
    dr = 1,
    zl = class extends Je {
      constructor(t, e, n) {
        super(),
        this.type = "CubeCamera",
        this.renderTarget = n,
        this.coordinateSystem = null,
        this.activeMipmapLevel = 0;
        let s = new ln(ur, dr, t, e);
        s.layers = this.layers, this.add(s);
        let r = new ln(ur, dr, t, e);
        r.layers = this.layers, this.add(r);
        let o = new ln(ur, dr, t, e);
        o.layers = this.layers, this.add(o);
        let a = new ln(ur, dr, t, e);
        a.layers = this.layers, this.add(a);
        let l = new ln(ur, dr, t, e);
        l.layers = this.layers, this.add(l);
        let c = new ln(ur, dr, t, e);
        c.layers = this.layers, this.add(c);
      }
      updateCoordinateSystem() {
        let t = this.coordinateSystem,
          e = this.children.concat(),
          [n, s, r, o, a, l] = e;
        for (let c of e) this.remove(c);
        if (t === Zn)
        n.up.set(0, 1, 0),
        n.lookAt(1, 0, 0),
        s.up.set(0, 1, 0),
        s.lookAt(-1, 0, 0),
        r.up.set(0, 0, -1),
        r.lookAt(0, 1, 0),
        o.up.set(0, 0, 1),
        o.lookAt(0, -1, 0),
        a.up.set(0, 1, 0),
        a.lookAt(0, 0, 1),
        l.up.set(0, 1, 0),
        l.lookAt(0, 0, -1);else
        if (t === mr)
        n.up.set(0, -1, 0),
        n.lookAt(-1, 0, 0),
        s.up.set(0, -1, 0),
        s.lookAt(1, 0, 0),
        r.up.set(0, 0, 1),
        r.lookAt(0, 1, 0),
        o.up.set(0, 0, -1),
        o.lookAt(0, -1, 0),
        a.up.set(0, -1, 0),
        a.lookAt(0, 0, 1),
        l.up.set(0, -1, 0),
        l.lookAt(0, 0, -1);else

        throw new Error(
          "THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " +
          t
        );
        for (let c of e) this.add(c), c.updateMatrixWorld();
      }
      update(t, e) {
        this.parent === null && this.updateMatrixWorld();
        let { renderTarget: n, activeMipmapLevel: s } = this;
        this.coordinateSystem !== t.coordinateSystem && (
        this.coordinateSystem = t.coordinateSystem,
        this.updateCoordinateSystem());
        let [r, o, a, l, c, h] = this.children,
          d = t.getRenderTarget(),
          u = t.getActiveCubeFace(),
          f = t.getActiveMipmapLevel(),
          p = t.xr.enabled;
        t.xr.enabled = !1;
        let x = n.texture.generateMipmaps;
        n.texture.generateMipmaps = !1;
        let g = !1;
        t.isWebGLRenderer === !0 ?
        g = t.state.buffers.depth.getReversed() :
        g = t.reversedDepthBuffer,
        t.setRenderTarget(n, 0, s),
        g && t.autoClear === !1 && t.clearDepth(),
        t.render(e, r),
        t.setRenderTarget(n, 1, s),
        g && t.autoClear === !1 && t.clearDepth(),
        t.render(e, o),
        t.setRenderTarget(n, 2, s),
        g && t.autoClear === !1 && t.clearDepth(),
        t.render(e, a),
        t.setRenderTarget(n, 3, s),
        g && t.autoClear === !1 && t.clearDepth(),
        t.render(e, l),
        t.setRenderTarget(n, 4, s),
        g && t.autoClear === !1 && t.clearDepth(),
        t.render(e, c),
        n.texture.generateMipmaps = x,
        t.setRenderTarget(n, 5, s),
        g && t.autoClear === !1 && t.clearDepth(),
        t.render(e, h),
        t.setRenderTarget(d, u, f),
        t.xr.enabled = p,
        n.texture.needsPMREMUpdate = !0;
      }
    },
    Ul = class extends ln {
      constructor(t = []) {
        super(),
        this.isArrayCamera = !0,
        this.isMultiViewCamera = !1,
        this.cameras = t;
      }
    };
  var Lu = "\\[\\]\\.:\\/",
    $g = new RegExp("[" + Lu + "]", "g"),
    Du = "[^" + Lu + "]",
    qg = "[^" + Lu.replace("\\.", "") + "]",
    Yg = /((?:WC+[\/:])*)/.source.replace("WC", Du),
    Zg = /(WCOD+)?/.source.replace("WCOD", qg),
    Jg = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", Du),
    jg = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", Du),
    Kg = new RegExp("^" + Yg + Zg + Jg + jg + "$"),
    Qg = ["material", "materials", "bones", "map"],
    au = class {
      constructor(t, e, n) {
        let s = n || Ce.parseTrackName(e);
        this._targetGroup = t, this._bindings = t.subscribe_(e, s);
      }
      getValue(t, e) {
        this.bind();
        let n = this._targetGroup.nCachedObjects_,
          s = this._bindings[n];
        s !== void 0 && s.getValue(t, e);
      }
      setValue(t, e) {
        let n = this._bindings;
        for (
        let s = this._targetGroup.nCachedObjects_, r = n.length;
        s !== r;
        ++s)

        n[s].setValue(t, e);
      }
      bind() {
        let t = this._bindings;
        for (
        let e = this._targetGroup.nCachedObjects_, n = t.length;
        e !== n;
        ++e)

        t[e].bind();
      }
      unbind() {
        let t = this._bindings;
        for (
        let e = this._targetGroup.nCachedObjects_, n = t.length;
        e !== n;
        ++e)

        t[e].unbind();
      }
    },
    Ce = class i {
      constructor(t, e, n) {
        this.path = e,
        this.parsedPath = n || i.parseTrackName(e),
        this.node = i.findNode(t, this.parsedPath.nodeName),
        this.rootNode = t,
        this.getValue = this._getValue_unbound,
        this.setValue = this._setValue_unbound;
      }
      static create(t, e, n) {
        return t && t.isAnimationObjectGroup ?
        new i.Composite(t, e, n) :
        new i(t, e, n);
      }
      static sanitizeNodeName(t) {
        return t.replace(/\s/g, "_").replace($g, "");
      }
      static parseTrackName(t) {
        let e = Kg.exec(t);
        if (e === null)
        throw new Error(
          "THREE.PropertyBinding: Cannot parse trackName: " + t
        );
        let n = {
            nodeName: e[2],
            objectName: e[3],
            objectIndex: e[4],
            propertyName: e[5],
            propertyIndex: e[6]
          },
          s = n.nodeName && n.nodeName.lastIndexOf(".");
        if (s !== void 0 && s !== -1) {
          let r = n.nodeName.substring(s + 1);
          Qg.indexOf(r) !== -1 && (
          n.nodeName = n.nodeName.substring(0, s), n.objectName = r);
        }
        if (n.propertyName === null || n.propertyName.length === 0)
        throw new Error(
          "THREE.PropertyBinding: can not parse propertyName from trackName: " +
          t
        );
        return n;
      }
      static findNode(t, e) {
        if (
        e === void 0 ||
        e === "" ||
        e === "." ||
        e === -1 ||
        e === t.name ||
        e === t.uuid)

        return t;
        if (t.skeleton) {
          let n = t.skeleton.getBoneByName(e);
          if (n !== void 0) return n;
        }
        if (t.children) {
          let n = function (r) {
              for (let o = 0; o < r.length; o++) {
                let a = r[o];
                if (a.name === e || a.uuid === e) return a;
                let l = n(a.children);
                if (l) return l;
              }
              return null;
            },
            s = n(t.children);
          if (s) return s;
        }
        return null;
      }
      _getValue_unavailable() {}
      _setValue_unavailable() {}
      _getValue_direct(t, e) {
        t[e] = this.targetObject[this.propertyName];
      }
      _getValue_array(t, e) {
        let n = this.resolvedProperty;
        for (let s = 0, r = n.length; s !== r; ++s) t[e++] = n[s];
      }
      _getValue_arrayElement(t, e) {
        t[e] = this.resolvedProperty[this.propertyIndex];
      }
      _getValue_toArray(t, e) {
        this.resolvedProperty.toArray(t, e);
      }
      _setValue_direct(t, e) {
        this.targetObject[this.propertyName] = t[e];
      }
      _setValue_direct_setNeedsUpdate(t, e) {
        this.targetObject[this.propertyName] = t[e],
        this.targetObject.needsUpdate = !0;
      }
      _setValue_direct_setMatrixWorldNeedsUpdate(t, e) {
        this.targetObject[this.propertyName] = t[e],
        this.targetObject.matrixWorldNeedsUpdate = !0;
      }
      _setValue_array(t, e) {
        let n = this.resolvedProperty;
        for (let s = 0, r = n.length; s !== r; ++s) n[s] = t[e++];
      }
      _setValue_array_setNeedsUpdate(t, e) {
        let n = this.resolvedProperty;
        for (let s = 0, r = n.length; s !== r; ++s) n[s] = t[e++];
        this.targetObject.needsUpdate = !0;
      }
      _setValue_array_setMatrixWorldNeedsUpdate(t, e) {
        let n = this.resolvedProperty;
        for (let s = 0, r = n.length; s !== r; ++s) n[s] = t[e++];
        this.targetObject.matrixWorldNeedsUpdate = !0;
      }
      _setValue_arrayElement(t, e) {
        this.resolvedProperty[this.propertyIndex] = t[e];
      }
      _setValue_arrayElement_setNeedsUpdate(t, e) {
        this.resolvedProperty[this.propertyIndex] = t[e],
        this.targetObject.needsUpdate = !0;
      }
      _setValue_arrayElement_setMatrixWorldNeedsUpdate(t, e) {
        this.resolvedProperty[this.propertyIndex] = t[e],
        this.targetObject.matrixWorldNeedsUpdate = !0;
      }
      _setValue_fromArray(t, e) {
        this.resolvedProperty.fromArray(t, e);
      }
      _setValue_fromArray_setNeedsUpdate(t, e) {
        this.resolvedProperty.fromArray(t, e),
        this.targetObject.needsUpdate = !0;
      }
      _setValue_fromArray_setMatrixWorldNeedsUpdate(t, e) {
        this.resolvedProperty.fromArray(t, e),
        this.targetObject.matrixWorldNeedsUpdate = !0;
      }
      _getValue_unbound(t, e) {
        this.bind(), this.getValue(t, e);
      }
      _setValue_unbound(t, e) {
        this.bind(), this.setValue(t, e);
      }
      bind() {
        let t = this.node,
          e = this.parsedPath,
          n = e.objectName,
          s = e.propertyName,
          r = e.propertyIndex;
        if (
        t || (t = i.findNode(this.rootNode, e.nodeName), this.node = t),
        this.getValue = this._getValue_unavailable,
        this.setValue = this._setValue_unavailable,
        !t)
        {
          Ht(
            "PropertyBinding: No target node found for track: " +
            this.path +
            "."
          );
          return;
        }
        if (n) {
          let c = e.objectIndex;
          switch (n) {
            case "materials":
              if (!t.material) {
                Gt(
                  "PropertyBinding: Can not bind to material as node does not have a material.",
                  this
                );
                return;
              }
              if (!t.material.materials) {
                Gt(
                  "PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",
                  this
                );
                return;
              }
              t = t.material.materials;
              break;
            case "bones":
              if (!t.skeleton) {
                Gt(
                  "PropertyBinding: Can not bind to bones as node does not have a skeleton.",
                  this
                );
                return;
              }
              t = t.skeleton.bones;
              for (let h = 0; h < t.length; h++)
              if (t[h].name === c) {
                c = h;
                break;
              }
              break;
            case "map":
              if ("map" in t) {
                t = t.map;
                break;
              }
              if (!t.material) {
                Gt(
                  "PropertyBinding: Can not bind to material as node does not have a material.",
                  this
                );
                return;
              }
              if (!t.material.map) {
                Gt(
                  "PropertyBinding: Can not bind to material.map as node.material does not have a map.",
                  this
                );
                return;
              }
              t = t.material.map;
              break;
            default:
              if (t[n] === void 0) {
                Gt(
                  "PropertyBinding: Can not bind to objectName of node undefined.",
                  this
                );
                return;
              }
              t = t[n];
          }
          if (c !== void 0) {
            if (t[c] === void 0) {
              Gt(
                "PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",
                this,
                t
              );
              return;
            }
            t = t[c];
          }
        }
        let o = t[s];
        if (o === void 0) {
          let c = e.nodeName;
          Gt(
            "PropertyBinding: Trying to update property for track: " +
            c +
            "." +
            s +
            " but it wasn't found.",
            t
          );
          return;
        }
        let a = this.Versioning.None;
        this.targetObject = t,
        t.isMaterial === !0 ?
        a = this.Versioning.NeedsUpdate :
        t.isObject3D === !0 && (
        a = this.Versioning.MatrixWorldNeedsUpdate);
        let l = this.BindingType.Direct;
        if (r !== void 0) {
          if (s === "morphTargetInfluences") {
            if (!t.geometry) {
              Gt(
                "PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",
                this
              );
              return;
            }
            if (!t.geometry.morphAttributes) {
              Gt(
                "PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",
                this
              );
              return;
            }
            t.morphTargetDictionary[r] !== void 0 && (
            r = t.morphTargetDictionary[r]);
          }
          l = this.BindingType.ArrayElement,
          this.resolvedProperty = o,
          this.propertyIndex = r;
        } else
        o.fromArray !== void 0 && o.toArray !== void 0 ? (
        l = this.BindingType.HasFromToArray,
        this.resolvedProperty = o) :
        Array.isArray(o) ? (
        l = this.BindingType.EntireArray,
        this.resolvedProperty = o) :
        this.propertyName = s;
        this.getValue = this.GetterByBindingType[l],
        this.setValue = this.SetterByBindingTypeAndVersioning[l][a];
      }
      unbind() {
        this.node = null,
        this.getValue = this._getValue_unbound,
        this.setValue = this._setValue_unbound;
      }
    };
  Ce.Composite = au;
  Ce.prototype.BindingType = {
    Direct: 0,
    EntireArray: 1,
    ArrayElement: 2,
    HasFromToArray: 3
  };
  Ce.prototype.Versioning = {
    None: 0,
    NeedsUpdate: 1,
    MatrixWorldNeedsUpdate: 2
  };
  Ce.prototype.GetterByBindingType = [
  Ce.prototype._getValue_direct,
  Ce.prototype._getValue_array,
  Ce.prototype._getValue_arrayElement,
  Ce.prototype._getValue_toArray];

  Ce.prototype.SetterByBindingTypeAndVersioning = [
  [
  Ce.prototype._setValue_direct,
  Ce.prototype._setValue_direct_setNeedsUpdate,
  Ce.prototype._setValue_direct_setMatrixWorldNeedsUpdate],

  [
  Ce.prototype._setValue_array,
  Ce.prototype._setValue_array_setNeedsUpdate,
  Ce.prototype._setValue_array_setMatrixWorldNeedsUpdate],

  [
  Ce.prototype._setValue_arrayElement,
  Ce.prototype._setValue_arrayElement_setNeedsUpdate,
  Ce.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],

  [
  Ce.prototype._setValue_fromArray,
  Ce.prototype._setValue_fromArray_setNeedsUpdate,
  Ce.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];


  var eS = new Float32Array(1);
  var jf = new se(),
    Vo = class {
      constructor(t, e, n = 0, s = 1 / 0) {
        this.ray = new Es(t, e),
        this.near = n,
        this.far = s,
        this.camera = null,
        this.layers = new yr(),
        this.params = {
          Mesh: {},
          Line: { threshold: 1 },
          LOD: {},
          Points: { threshold: 1 },
          Sprite: {}
        };
      }
      set(t, e) {
        this.ray.set(t, e);
      }
      setFromCamera(t, e) {
        e.isPerspectiveCamera ? (
        this.ray.origin.setFromMatrixPosition(e.matrixWorld),
        this.ray.direction.
        set(t.x, t.y, 0.5).
        unproject(e).
        sub(this.ray.origin).
        normalize(),
        this.camera = e) :
        e.isOrthographicCamera ? (
        this.ray.origin.
        set(t.x, t.y, e.projectionMatrix.elements[14]).
        unproject(e),
        this.ray.direction.
        set(0, 0, -1).
        transformDirection(e.matrixWorld),
        this.camera = e) :
        Gt("Raycaster: Unsupported camera type: " + e.type);
      }
      setFromXRController(t) {
        return (
          jf.identity().extractRotation(t.matrixWorld),
          this.ray.origin.setFromMatrixPosition(t.matrixWorld),
          this.ray.direction.set(0, 0, -1).applyMatrix4(jf),
          this);

      }
      intersectObject(t, e = !0, n = []) {
        return lu(t, this, n, e), n.sort(Kf), n;
      }
      intersectObjects(t, e = !0, n = []) {
        for (let s = 0, r = t.length; s < r; s++) lu(t[s], this, n, e);
        return n.sort(Kf), n;
      }
    };
  function Kf(i, t) {
    return i.distance - t.distance;
  }
  function lu(i, t, e, n) {
    let s = !0;
    if (
    i.layers.test(t.layers) && i.raycast(t, e) === !1 && (s = !1),
    s === !0 && n === !0)
    {
      let r = i.children;
      for (let o = 0, a = r.length; o < a; o++) lu(r[o], t, e, !0);
    }
  }
  var Bu = class Bu {
    constructor(t, e, n, s) {
      this.elements = [1, 0, 0, 1], t !== void 0 && this.set(t, e, n, s);
    }
    identity() {
      return this.set(1, 0, 0, 1), this;
    }
    fromArray(t, e = 0) {
      for (let n = 0; n < 4; n++) this.elements[n] = t[n + e];
      return this;
    }
    set(t, e, n, s) {
      let r = this.elements;
      return r[0] = t, r[2] = e, r[1] = n, r[3] = s, this;
    }
  };
  Bu.prototype.isMatrix2 = !0;
  var cu = Bu;
  function Nu(i, t, e, n) {
    let s = tx(n);
    switch (e) {
      case Ru:
        return i * t;
      case $l:
        return i * t / s.components * s.byteLength;
      case ql:
        return i * t / s.components * s.byteLength;
      case as:
        return i * t * 2 / s.components * s.byteLength;
      case Yl:
        return i * t * 2 / s.components * s.byteLength;
      case ku:
        return i * t * 3 / s.components * s.byteLength;
      case On:
        return i * t * 4 / s.components * s.byteLength;
      case Zl:
        return i * t * 4 / s.components * s.byteLength;
      case Xo:
      case $o:
        return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
      case qo:
      case Yo:
        return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
      case jl:
      case Ql:
        return Math.max(i, 16) * Math.max(t, 8) / 4;
      case Jl:
      case Kl:
        return Math.max(i, 8) * Math.max(t, 8) / 2;
      case tc:
      case ec:
      case ic:
      case sc:
        return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
      case nc:
      case Zo:
      case rc:
        return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
      case oc:
        return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
      case ac:
        return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16;
      case lc:
        return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16;
      case cc:
        return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16;
      case hc:
        return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16;
      case uc:
        return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16;
      case dc:
        return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16;
      case fc:
        return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16;
      case pc:
        return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16;
      case mc:
        return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16;
      case gc:
        return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16;
      case xc:
        return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16;
      case yc:
        return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16;
      case vc:
        return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16;
      case _c:
      case bc:
      case Mc:
        return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
      case Sc:
      case wc:
        return Math.ceil(i / 4) * Math.ceil(t / 4) * 8;
      case Jo:
      case Ec:
        return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
    }
    throw new Error(`Unable to determine texture byte length for ${e} format.`);
  }
  function tx(i) {
    switch (i) {
      case Tn:
      case wu:
        return { byteLength: 1, components: 1 };
      case Ir:
      case Eu:
      case Qn:
        return { byteLength: 2, components: 1 };
      case Wl:
      case Xl:
        return { byteLength: 2, components: 4 };
      case Ln:
      case Gl:
      case Fn:
        return { byteLength: 4, components: 1 };
      case Tu:
      case Au:
        return { byteLength: 4, components: 3 };
    }
    throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`);
  }
  typeof __THREE_DEVTOOLS__ < "u" &&
  __THREE_DEVTOOLS__.dispatchEvent(
    new CustomEvent("register", { detail: { revision: "186" } })
  );
  typeof window < "u" && (
  window.__THREE__ ?
  Ht("WARNING: Multiple instances of Three.js being imported.") :
  window.__THREE__ = "186");
  function lm() {
    let i = null,
      t = !1,
      e = null,
      n = null;
    function s(r, o) {
      n = i.requestAnimationFrame(s), e(r, o);
    }
    return {
      start: function () {
        t !== !0 &&
        e !== null &&
        i !== null && (
        n = i.requestAnimationFrame(s), t = !0);
      },
      stop: function () {
        i !== null && i.cancelAnimationFrame(n), t = !1;
      },
      setAnimationLoop: function (r) {
        e = r;
      },
      setContext: function (r) {
        i = r;
      }
    };
  }
  function rx(i) {
    let t = new WeakMap();
    function e(a, l) {
      let c = a.array,
        h = a.usage,
        d = c.byteLength,
        u = i.createBuffer();
      i.bindBuffer(l, u), i.bufferData(l, c, h), a.onUploadCallback();
      let f;
      if (c instanceof Float32Array) f = i.FLOAT;else
      if (typeof Float16Array < "u" && c instanceof Float16Array)
      f = i.HALF_FLOAT;else
      if (c instanceof Uint16Array)
      a.isFloat16BufferAttribute ?
      f = i.HALF_FLOAT :
      f = i.UNSIGNED_SHORT;else
      if (c instanceof Int16Array) f = i.SHORT;else
      if (c instanceof Uint32Array) f = i.UNSIGNED_INT;else
      if (c instanceof Int32Array) f = i.INT;else
      if (c instanceof Int8Array) f = i.BYTE;else
      if (c instanceof Uint8Array) f = i.UNSIGNED_BYTE;else
      if (c instanceof Uint8ClampedArray) f = i.UNSIGNED_BYTE;else

      throw new Error(
        "THREE.WebGLAttributes: Unsupported buffer data format: " + c
      );
      return {
        buffer: u,
        type: f,
        bytesPerElement: c.BYTES_PER_ELEMENT,
        version: a.version,
        size: d
      };
    }
    function n(a, l, c) {
      let h = l.array,
        d = l.updateRanges;
      if (i.bindBuffer(c, a), d.length === 0) i.bufferSubData(c, 0, h);else
      {
        d.sort((f, p) => f.start - p.start);
        let u = 0;
        for (let f = 1; f < d.length; f++) {
          let p = d[u],
            x = d[f];
          x.start <= p.start + p.count + 1 ?
          p.count = Math.max(p.count, x.start + x.count - p.start) : (
          ++u, d[u] = x);
        }
        d.length = u + 1;
        for (let f = 0, p = d.length; f < p; f++) {
          let x = d[f];
          i.bufferSubData(
            c,
            x.start * h.BYTES_PER_ELEMENT,
            h,
            x.start,
            x.count
          );
        }
        l.clearUpdateRanges();
      }
      l.onUploadCallback();
    }
    function s(a) {
      return a.isInterleavedBufferAttribute && (a = a.data), t.get(a);
    }
    function r(a) {
      a.isInterleavedBufferAttribute && (a = a.data);
      let l = t.get(a);
      l && (i.deleteBuffer(l.buffer), t.delete(a));
    }
    function o(a, l) {
      if (
      a.isInterleavedBufferAttribute && (a = a.data), a.isGLBufferAttribute)
      {
        let h = t.get(a);
        (!h || h.version < a.version) &&
        t.set(a, {
          buffer: a.buffer,
          type: a.type,
          bytesPerElement: a.elementSize,
          version: a.version
        });
        return;
      }
      let c = t.get(a);
      if (c === void 0) t.set(a, e(a, l));else
      if (c.version < a.version) {
        if (c.size !== a.array.byteLength)
        throw new Error(
          "THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported."
        );
        n(c.buffer, a, l), c.version = a.version;
      }
    }
    return { get: s, remove: r, update: o };
  }
  var ox = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
    ax = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
    lx = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
    cx = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
    hx = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
    ux = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
    dx = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
    fx = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
    px = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,
    mx = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
    gx = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
    xx = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
    yx = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
    vx = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
    _x = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
    bx = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
    Mx = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
    Sx = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
    wx = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
    Ex = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,
    Tx = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,
    Ax = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,
    Rx = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,
    kx = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
    Cx = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
    Ix = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,
    Px = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
    Lx = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
    Dx = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
    Nx = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
    zx = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
    Ux = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
    Fx = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,
    Ox = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,
    Bx = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
    Hx = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
    Vx = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
    Gx = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
    Wx = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
    Xx = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
    $x = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
    qx = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
    Yx = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
    Zx = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
    Jx = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
    jx = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,
    Kx = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,
    Qx = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
    ty = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
    ey = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
    ny = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
    iy = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
    sy = `uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
    ry = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
    oy = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
    ay = `#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
    ly = `#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,
    cy = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
    hy = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
    uy = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
    dy = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
    fy = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
    py = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
    my = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
    gy = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
    xy = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
    yy = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
    vy = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
    _y = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
    by = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
    My = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
    Sy = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
    wy = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
    Ey = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
    Ty = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
    Ay = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
    Ry = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,
    ky = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
    Cy = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
    Iy = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
    Py = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
    Ly = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
    Dy = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
    Ny = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,
    zy = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
    Uy = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
    Fy = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
    Oy = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
    By = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
    Hy = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
    Vy = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,
    Gy = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
    Wy = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
    Xy = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
    $y = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
    qy = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
    Yy = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
    Zy = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
    Jy = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
    jy = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
    Ky = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
    Qy = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
    tv = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
    ev = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
    nv = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
    iv = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
    sv = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
    rv = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,
    ov = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
    av = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
    lv = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
    cv = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
    hv = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
    uv = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
    dv = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
    fv = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
    pv = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
    mv = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,
    gv = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
    xv = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
    yv = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
    vv = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
    _v = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
    bv = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
    Mv = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
    Sv = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
    wv = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
    Ev = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
    Tv = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
    Av = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
    Rv = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
    kv = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
    Cv = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
    Iv = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
    Pv = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
    Lv = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
    Dv = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
    Nv = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
    zv = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
    Uv = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
    Fv = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
    Ov = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
    Kt = {
      alphahash_fragment: ox,
      alphahash_pars_fragment: ax,
      alphamap_fragment: lx,
      alphamap_pars_fragment: cx,
      alphatest_fragment: hx,
      alphatest_pars_fragment: ux,
      aomap_fragment: dx,
      aomap_pars_fragment: fx,
      batching_pars_vertex: px,
      batching_vertex: mx,
      begin_vertex: gx,
      beginnormal_vertex: xx,
      bsdfs: yx,
      iridescence_fragment: vx,
      bumpmap_pars_fragment: _x,
      clipping_planes_fragment: bx,
      clipping_planes_pars_fragment: Mx,
      clipping_planes_pars_vertex: Sx,
      clipping_planes_vertex: wx,
      color_fragment: Ex,
      color_pars_fragment: Tx,
      color_pars_vertex: Ax,
      color_vertex: Rx,
      common: kx,
      cube_uv_reflection_fragment: Cx,
      defaultnormal_vertex: Ix,
      displacementmap_pars_vertex: Px,
      displacementmap_vertex: Lx,
      emissivemap_fragment: Dx,
      emissivemap_pars_fragment: Nx,
      colorspace_fragment: zx,
      colorspace_pars_fragment: Ux,
      envmap_fragment: Fx,
      envmap_common_pars_fragment: Ox,
      envmap_pars_fragment: Bx,
      envmap_pars_vertex: Hx,
      envmap_physical_pars_fragment: Kx,
      envmap_vertex: Vx,
      fog_vertex: Gx,
      fog_pars_vertex: Wx,
      fog_fragment: Xx,
      fog_pars_fragment: $x,
      gradientmap_pars_fragment: qx,
      lightmap_pars_fragment: Yx,
      lights_lambert_fragment: Zx,
      lights_lambert_pars_fragment: Jx,
      lights_pars_begin: jx,
      lights_toon_fragment: Qx,
      lights_toon_pars_fragment: ty,
      lights_phong_fragment: ey,
      lights_phong_pars_fragment: ny,
      lights_physical_fragment: iy,
      lights_physical_pars_fragment: sy,
      lights_fragment_begin: ry,
      lights_fragment_maps: oy,
      lights_fragment_end: ay,
      lightprobes_pars_fragment: ly,
      logdepthbuf_fragment: cy,
      logdepthbuf_pars_fragment: hy,
      logdepthbuf_pars_vertex: uy,
      logdepthbuf_vertex: dy,
      map_fragment: fy,
      map_pars_fragment: py,
      map_particle_fragment: my,
      map_particle_pars_fragment: gy,
      metalnessmap_fragment: xy,
      metalnessmap_pars_fragment: yy,
      morphinstance_vertex: vy,
      morphcolor_vertex: _y,
      morphnormal_vertex: by,
      morphtarget_pars_vertex: My,
      morphtarget_vertex: Sy,
      normal_fragment_begin: wy,
      normal_fragment_maps: Ey,
      normal_pars_fragment: Ty,
      normal_pars_vertex: Ay,
      normal_vertex: Ry,
      normalmap_pars_fragment: ky,
      clearcoat_normal_fragment_begin: Cy,
      clearcoat_normal_fragment_maps: Iy,
      clearcoat_pars_fragment: Py,
      iridescence_pars_fragment: Ly,
      opaque_fragment: Dy,
      packing: Ny,
      premultiplied_alpha_fragment: zy,
      project_vertex: Uy,
      dithering_fragment: Fy,
      dithering_pars_fragment: Oy,
      roughnessmap_fragment: By,
      roughnessmap_pars_fragment: Hy,
      shadowmap_pars_fragment: Vy,
      shadowmap_pars_vertex: Gy,
      shadowmap_vertex: Wy,
      shadowmask_pars_fragment: Xy,
      skinbase_vertex: $y,
      skinning_pars_vertex: qy,
      skinning_vertex: Yy,
      skinnormal_vertex: Zy,
      specularmap_fragment: Jy,
      specularmap_pars_fragment: jy,
      tonemapping_fragment: Ky,
      tonemapping_pars_fragment: Qy,
      transmission_fragment: tv,
      transmission_pars_fragment: ev,
      uv_pars_fragment: nv,
      uv_pars_vertex: iv,
      uv_vertex: sv,
      worldpos_vertex: rv,
      background_vert: ov,
      background_frag: av,
      backgroundCube_vert: lv,
      backgroundCube_frag: cv,
      cube_vert: hv,
      cube_frag: uv,
      depth_vert: dv,
      depth_frag: fv,
      distance_vert: pv,
      distance_frag: mv,
      equirect_vert: gv,
      equirect_frag: xv,
      linedashed_vert: yv,
      linedashed_frag: vv,
      meshbasic_vert: _v,
      meshbasic_frag: bv,
      meshlambert_vert: Mv,
      meshlambert_frag: Sv,
      meshmatcap_vert: wv,
      meshmatcap_frag: Ev,
      meshnormal_vert: Tv,
      meshnormal_frag: Av,
      meshphong_vert: Rv,
      meshphong_frag: kv,
      meshphysical_vert: Cv,
      meshphysical_frag: Iv,
      meshtoon_vert: Pv,
      meshtoon_frag: Lv,
      points_vert: Dv,
      points_frag: Nv,
      shadow_vert: zv,
      shadow_frag: Uv,
      sprite_vert: Fv,
      sprite_frag: Ov
    },
    mt = {
      common: {
        diffuse: { value: new wt(16777215) },
        opacity: { value: 1 },
        map: { value: null },
        mapTransform: { value: new Wt() },
        alphaMap: { value: null },
        alphaMapTransform: { value: new Wt() },
        alphaTest: { value: 0 }
      },
      specularmap: {
        specularMap: { value: null },
        specularMapTransform: { value: new Wt() }
      },
      envmap: {
        envMap: { value: null },
        envMapRotation: { value: new Wt() },
        reflectivity: { value: 1 },
        ior: { value: 1.5 },
        refractionRatio: { value: 0.98 },
        dfgLUT: { value: null }
      },
      aomap: {
        aoMap: { value: null },
        aoMapIntensity: { value: 1 },
        aoMapTransform: { value: new Wt() }
      },
      lightmap: {
        lightMap: { value: null },
        lightMapIntensity: { value: 1 },
        lightMapTransform: { value: new Wt() }
      },
      bumpmap: {
        bumpMap: { value: null },
        bumpMapTransform: { value: new Wt() },
        bumpScale: { value: 1 }
      },
      normalmap: {
        normalMap: { value: null },
        normalMapTransform: { value: new Wt() },
        normalScale: { value: new Vt(1, 1) }
      },
      displacementmap: {
        displacementMap: { value: null },
        displacementMapTransform: { value: new Wt() },
        displacementScale: { value: 1 },
        displacementBias: { value: 0 }
      },
      emissivemap: {
        emissiveMap: { value: null },
        emissiveMapTransform: { value: new Wt() }
      },
      metalnessmap: {
        metalnessMap: { value: null },
        metalnessMapTransform: { value: new Wt() }
      },
      roughnessmap: {
        roughnessMap: { value: null },
        roughnessMapTransform: { value: new Wt() }
      },
      gradientmap: { gradientMap: { value: null } },
      fog: {
        fogDensity: { value: 25e-5 },
        fogNear: { value: 1 },
        fogFar: { value: 2e3 },
        fogColor: { value: new wt(16777215) }
      },
      lights: {
        ambientLightColor: { value: [] },
        lightProbe: { value: [] },
        sunLights: { value: [], properties: { direction: {}, color: {} } },
        sunLightShadows: {
          value: [],
          properties: {
            shadowIntensity: 1,
            shadowBias: {},
            shadowNormalBias: {},
            shadowRadius: {},
            shadowMapSize: {}
          }
        },
        sunShadowMatrix: { value: [] },
        sunShadowCascade: { value: [] },
        directionalLights: {
          value: [],
          properties: { direction: {}, color: {} }
        },
        directionalLightShadows: {
          value: [],
          properties: {
            shadowIntensity: 1,
            shadowBias: {},
            shadowNormalBias: {},
            shadowRadius: {},
            shadowMapSize: {}
          }
        },
        directionalShadowMatrix: { value: [] },
        spotLights: {
          value: [],
          properties: {
            color: {},
            position: {},
            direction: {},
            distance: {},
            coneCos: {},
            penumbraCos: {},
            decay: {}
          }
        },
        spotLightShadows: {
          value: [],
          properties: {
            shadowIntensity: 1,
            shadowBias: {},
            shadowNormalBias: {},
            shadowRadius: {},
            shadowMapSize: {}
          }
        },
        spotLightMap: { value: [] },
        spotLightMatrix: { value: [] },
        pointLights: {
          value: [],
          properties: { color: {}, position: {}, decay: {}, distance: {} }
        },
        pointLightShadows: {
          value: [],
          properties: {
            shadowIntensity: 1,
            shadowBias: {},
            shadowNormalBias: {},
            shadowRadius: {},
            shadowMapSize: {},
            shadowCameraNear: {},
            shadowCameraFar: {}
          }
        },
        pointShadowMatrix: { value: [] },
        hemisphereLights: {
          value: [],
          properties: { direction: {}, skyColor: {}, groundColor: {} }
        },
        rectAreaLights: {
          value: [],
          properties: { color: {}, position: {}, width: {}, height: {} }
        },
        ltc_1: { value: null },
        ltc_2: { value: null },
        probesSH: { value: null },
        probesMin: { value: new z() },
        probesMax: { value: new z() },
        probesResolution: { value: new z() }
      },
      points: {
        diffuse: { value: new wt(16777215) },
        opacity: { value: 1 },
        size: { value: 1 },
        scale: { value: 1 },
        map: { value: null },
        alphaMap: { value: null },
        alphaMapTransform: { value: new Wt() },
        alphaTest: { value: 0 },
        uvTransform: { value: new Wt() }
      },
      sprite: {
        diffuse: { value: new wt(16777215) },
        opacity: { value: 1 },
        center: { value: new Vt(0.5, 0.5) },
        rotation: { value: 0 },
        map: { value: null },
        mapTransform: { value: new Wt() },
        alphaMap: { value: null },
        alphaMapTransform: { value: new Wt() },
        alphaTest: { value: 0 }
      }
    },
    vi = {
      basic: {
        uniforms: xn([
        mt.common,
        mt.specularmap,
        mt.envmap,
        mt.aomap,
        mt.lightmap,
        mt.fog]
        ),
        vertexShader: Kt.meshbasic_vert,
        fragmentShader: Kt.meshbasic_frag
      },
      lambert: {
        uniforms: xn([
        mt.common,
        mt.specularmap,
        mt.envmap,
        mt.aomap,
        mt.lightmap,
        mt.emissivemap,
        mt.bumpmap,
        mt.normalmap,
        mt.displacementmap,
        mt.fog,
        mt.lights,
        { emissive: { value: new wt(0) }, envMapIntensity: { value: 1 } }]
        ),
        vertexShader: Kt.meshlambert_vert,
        fragmentShader: Kt.meshlambert_frag
      },
      phong: {
        uniforms: xn([
        mt.common,
        mt.specularmap,
        mt.envmap,
        mt.aomap,
        mt.lightmap,
        mt.emissivemap,
        mt.bumpmap,
        mt.normalmap,
        mt.displacementmap,
        mt.fog,
        mt.lights,
        {
          emissive: { value: new wt(0) },
          specular: { value: new wt(1118481) },
          shininess: { value: 30 },
          envMapIntensity: { value: 1 }
        }]
        ),
        vertexShader: Kt.meshphong_vert,
        fragmentShader: Kt.meshphong_frag
      },
      standard: {
        uniforms: xn([
        mt.common,
        mt.envmap,
        mt.aomap,
        mt.lightmap,
        mt.emissivemap,
        mt.bumpmap,
        mt.normalmap,
        mt.displacementmap,
        mt.roughnessmap,
        mt.metalnessmap,
        mt.fog,
        mt.lights,
        {
          emissive: { value: new wt(0) },
          roughness: { value: 1 },
          metalness: { value: 0 },
          envMapIntensity: { value: 1 }
        }]
        ),
        vertexShader: Kt.meshphysical_vert,
        fragmentShader: Kt.meshphysical_frag
      },
      toon: {
        uniforms: xn([
        mt.common,
        mt.aomap,
        mt.lightmap,
        mt.emissivemap,
        mt.bumpmap,
        mt.normalmap,
        mt.displacementmap,
        mt.gradientmap,
        mt.fog,
        mt.lights,
        { emissive: { value: new wt(0) } }]
        ),
        vertexShader: Kt.meshtoon_vert,
        fragmentShader: Kt.meshtoon_frag
      },
      matcap: {
        uniforms: xn([
        mt.common,
        mt.bumpmap,
        mt.normalmap,
        mt.displacementmap,
        mt.fog,
        { matcap: { value: null } }]
        ),
        vertexShader: Kt.meshmatcap_vert,
        fragmentShader: Kt.meshmatcap_frag
      },
      points: {
        uniforms: xn([mt.points, mt.fog]),
        vertexShader: Kt.points_vert,
        fragmentShader: Kt.points_frag
      },
      dashed: {
        uniforms: xn([
        mt.common,
        mt.fog,
        {
          scale: { value: 1 },
          dashSize: { value: 1 },
          totalSize: { value: 2 }
        }]
        ),
        vertexShader: Kt.linedashed_vert,
        fragmentShader: Kt.linedashed_frag
      },
      depth: {
        uniforms: xn([mt.common, mt.displacementmap]),
        vertexShader: Kt.depth_vert,
        fragmentShader: Kt.depth_frag
      },
      normal: {
        uniforms: xn([
        mt.common,
        mt.bumpmap,
        mt.normalmap,
        mt.displacementmap,
        { opacity: { value: 1 } }]
        ),
        vertexShader: Kt.meshnormal_vert,
        fragmentShader: Kt.meshnormal_frag
      },
      sprite: {
        uniforms: xn([mt.sprite, mt.fog]),
        vertexShader: Kt.sprite_vert,
        fragmentShader: Kt.sprite_frag
      },
      background: {
        uniforms: {
          uvTransform: { value: new Wt() },
          t2D: { value: null },
          backgroundIntensity: { value: 1 }
        },
        vertexShader: Kt.background_vert,
        fragmentShader: Kt.background_frag
      },
      backgroundCube: {
        uniforms: {
          envMap: { value: null },
          backgroundBlurriness: { value: 0 },
          backgroundIntensity: { value: 1 },
          backgroundRotation: { value: new Wt() }
        },
        vertexShader: Kt.backgroundCube_vert,
        fragmentShader: Kt.backgroundCube_frag
      },
      cube: {
        uniforms: {
          tCube: { value: null },
          tFlip: { value: -1 },
          opacity: { value: 1 }
        },
        vertexShader: Kt.cube_vert,
        fragmentShader: Kt.cube_frag
      },
      equirect: {
        uniforms: { tEquirect: { value: null } },
        vertexShader: Kt.equirect_vert,
        fragmentShader: Kt.equirect_frag
      },
      distance: {
        uniforms: xn([
        mt.common,
        mt.displacementmap,
        {
          referencePosition: { value: new z() },
          nearDistance: { value: 1 },
          farDistance: { value: 1e3 }
        }]
        ),
        vertexShader: Kt.distance_vert,
        fragmentShader: Kt.distance_frag
      },
      shadow: {
        uniforms: xn([
        mt.lights,
        mt.fog,
        { color: { value: new wt(0) }, opacity: { value: 1 } }]
        ),
        vertexShader: Kt.shadow_vert,
        fragmentShader: Kt.shadow_frag
      }
    };
  vi.physical = {
    uniforms: xn([
    vi.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: new Wt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: new Wt() },
      clearcoatNormalScale: { value: new Vt(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: new Wt() },
      dispersion: { value: 0 },
      retroreflectivity: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: new Wt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: new Wt() },
      sheen: { value: 0 },
      sheenColor: { value: new wt(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: new Wt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: new Wt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: new Wt() },
      transmissionSamplerSize: { value: new Vt() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: new Wt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: new wt(0) },
      specularColor: { value: new wt(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: new Wt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: new Wt() },
      anisotropyVector: { value: new Vt() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: new Wt() }
    }]
    ),
    vertexShader: Kt.meshphysical_vert,
    fragmentShader: Kt.meshphysical_frag
  };
  var kc = { r: 0, b: 0, g: 0 },
    Bv = new se(),
    cm = new Wt();
  cm.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
  function Hv(i, t, e, n, s, r) {
    let o = new wt(0),
      a = s === !0 ? 0 : 1,
      l,
      c,
      h = null,
      d = 0,
      u = null;
    function f(b) {
      let T = b.isScene === !0 ? b.background : null;
      if (T && T.isTexture) {
        let y = b.backgroundBlurriness > 0;
        T = t.get(T, y);
      }
      return T;
    }
    function p(b) {
      let T = !1,
        y = f(b);
      y === null ? g(o, a) : y && y.isColor && (g(y, 1), T = !0);
      let S = i.xr.getEnvironmentBlendMode();
      S === "additive" ?
      e.buffers.color.setClear(0, 0, 0, 1, r) :
      S === "alpha-blend" && e.buffers.color.setClear(0, 0, 0, 0, r),
      (i.autoClear || T) && (
      e.buffers.depth.setTest(!0),
      e.buffers.depth.setMask(!0),
      e.buffers.color.setMask(!0),
      i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
    }
    function x(b, T) {
      let y = f(T);
      y && (y.isCubeTexture || y.mapping === Go) ? (
      c === void 0 && (
      c = new Et(
        new Un(1, 1, 1),
        new Ke({
          name: "BackgroundCubeMaterial",
          uniforms: Ds(vi.backgroundCube.uniforms),
          vertexShader: vi.backgroundCube.vertexShader,
          fragmentShader: vi.backgroundCube.fragmentShader,
          side: Mn,
          depthTest: !1,
          depthWrite: !1,
          fog: !1,
          allowOverride: !1
        })
      ),
      c.geometry.deleteAttribute("normal"),
      c.geometry.deleteAttribute("uv"),
      c.onBeforeRender = function (S, M, A) {
        this.matrixWorld.copyPosition(A.matrixWorld);
      },
      Object.defineProperty(c.material, "envMap", {
        get: function () {
          return this.uniforms.envMap.value;
        }
      }),
      n.update(c)),
      c.material.uniforms.envMap.value = y,
      c.material.uniforms.backgroundBlurriness.value =
      T.backgroundBlurriness,
      c.material.uniforms.backgroundIntensity.value =
      T.backgroundIntensity,
      c.material.uniforms.backgroundRotation.value.
      setFromMatrix4(Bv.makeRotationFromEuler(T.backgroundRotation)).
      transpose(),
      y.isCubeTexture &&
      y.isRenderTargetTexture === !1 &&
      c.material.uniforms.backgroundRotation.value.premultiply(cm),
      c.material.toneMapped = ie.getTransfer(y.colorSpace) !== me,
      (h !== y || d !== y.version || u !== i.toneMapping) && (
      c.material.needsUpdate = !0,
      h = y,
      d = y.version,
      u = i.toneMapping),
      c.layers.enableAll(),
      b.unshift(c, c.geometry, c.material, 0, 0, null)) :
      y &&
      y.isTexture && (
      l === void 0 && (
      l = new Et(
        new As(2, 2),
        new Ke({
          name: "BackgroundMaterial",
          uniforms: Ds(vi.background.uniforms),
          vertexShader: vi.background.vertexShader,
          fragmentShader: vi.background.fragmentShader,
          side: is,
          depthTest: !1,
          depthWrite: !1,
          fog: !1,
          allowOverride: !1
        })
      ),
      l.geometry.deleteAttribute("normal"),
      Object.defineProperty(l.material, "map", {
        get: function () {
          return this.uniforms.t2D.value;
        }
      }),
      n.update(l)),
      l.material.uniforms.t2D.value = y,
      l.material.uniforms.backgroundIntensity.value =
      T.backgroundIntensity,
      l.material.toneMapped = ie.getTransfer(y.colorSpace) !== me,
      y.matrixAutoUpdate === !0 && y.updateMatrix(),
      l.material.uniforms.uvTransform.value.copy(y.matrix),
      (h !== y || d !== y.version || u !== i.toneMapping) && (
      l.material.needsUpdate = !0,
      h = y,
      d = y.version,
      u = i.toneMapping),
      l.layers.enableAll(),
      b.unshift(l, l.geometry, l.material, 0, 0, null));
    }
    function g(b, T) {
      b.getRGB(kc, Pu(i)), e.buffers.color.setClear(kc.r, kc.g, kc.b, T, r);
    }
    function m() {
      c !== void 0 && (
      c.geometry.dispose(), c.material.dispose(), c = void 0),
      l !== void 0 && (
      l.geometry.dispose(), l.material.dispose(), l = void 0);
    }
    return {
      getClearColor: function () {
        return o;
      },
      setClearColor: function (b, T = 1) {
        o.set(b), a = T, g(o, a);
      },
      getClearAlpha: function () {
        return a;
      },
      setClearAlpha: function (b) {
        a = b, g(o, a);
      },
      render: p,
      addToRenderList: x,
      dispose: m
    };
  }
  function Vv(i, t) {
    let e = i.getParameter(i.MAX_VERTEX_ATTRIBS),
      n = {},
      s = u(null),
      r = s,
      o = !1;
    function a(P, N, B, D, I) {
      let H = !1,
        X = d(P, D, B, N);
      r !== X && (r = X, c(r.object)),
      H = f(P, D, B, I),
      H && p(P, D, B, I),
      I !== null && t.update(I, i.ELEMENT_ARRAY_BUFFER),
      (H || o) && (
      o = !1,
      y(P, N, B, D),
      I !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get(I).buffer));
    }
    function l() {
      return i.createVertexArray();
    }
    function c(P) {
      return i.bindVertexArray(P);
    }
    function h(P) {
      return i.deleteVertexArray(P);
    }
    function d(P, N, B, D) {
      let I = D.wireframe === !0,
        H = n[N.id];
      H === void 0 && (H = {}, n[N.id] = H);
      let X = P.isInstancedMesh === !0 ? P.id : 0,
        nt = H[X];
      nt === void 0 && (nt = {}, H[X] = nt);
      let Y = nt[B.id];
      Y === void 0 && (Y = {}, nt[B.id] = Y);
      let K = Y[I];
      return K === void 0 && (K = u(l()), Y[I] = K), K;
    }
    function u(P) {
      let N = [],
        B = [],
        D = [];
      for (let I = 0; I < e; I++) N[I] = 0, B[I] = 0, D[I] = 0;
      return {
        geometry: null,
        program: null,
        wireframe: !1,
        newAttributes: N,
        enabledAttributes: B,
        attributeDivisors: D,
        object: P,
        attributes: {},
        index: null
      };
    }
    function f(P, N, B, D) {
      let I = r.attributes,
        H = N.attributes,
        X = 0,
        nt = B.getAttributes();
      for (let Y in nt)
      if (nt[Y].location >= 0) {
        let et = I[Y],
          Dt = H[Y];
        if (
        Dt === void 0 && (
        Y === "instanceMatrix" &&
        P.instanceMatrix && (
        Dt = P.instanceMatrix),
        Y === "instanceColor" &&
        P.instanceColor && (
        Dt = P.instanceColor)),
        et === void 0 || et.attribute !== Dt || Dt && et.data !== Dt.data)

        return !0;
        X++;
      }
      return r.attributesNum !== X || r.index !== D;
    }
    function p(P, N, B, D) {
      let I = {},
        H = N.attributes,
        X = 0,
        nt = B.getAttributes();
      for (let Y in nt)
      if (nt[Y].location >= 0) {
        let et = H[Y];
        et === void 0 && (
        Y === "instanceMatrix" &&
        P.instanceMatrix && (
        et = P.instanceMatrix),
        Y === "instanceColor" && P.instanceColor && (et = P.instanceColor));
        let Dt = {};
        Dt.attribute = et,
        et && et.data && (Dt.data = et.data),
        I[Y] = Dt,
        X++;
      }
      r.attributes = I, r.attributesNum = X, r.index = D;
    }
    function x() {
      let P = r.newAttributes;
      for (let N = 0, B = P.length; N < B; N++) P[N] = 0;
    }
    function g(P) {
      m(P, 0);
    }
    function m(P, N) {
      let B = r.newAttributes,
        D = r.enabledAttributes,
        I = r.attributeDivisors;
      B[P] = 1,
      D[P] === 0 && (i.enableVertexAttribArray(P), D[P] = 1),
      I[P] !== N && (i.vertexAttribDivisor(P, N), I[P] = N);
    }
    function b() {
      let P = r.newAttributes,
        N = r.enabledAttributes;
      for (let B = 0, D = N.length; B < D; B++)
      N[B] !== P[B] && (i.disableVertexAttribArray(B), N[B] = 0);
    }
    function T(P, N, B, D, I, H, X) {
      X === !0 ?
      i.vertexAttribIPointer(P, N, B, I, H) :
      i.vertexAttribPointer(P, N, B, D, I, H);
    }
    function y(P, N, B, D) {
      x();
      let I = D.attributes,
        H = B.getAttributes(),
        X = N.defaultAttributeValues;
      for (let nt in H) {
        let Y = H[nt];
        if (Y.location >= 0) {
          let K = I[nt];
          if (
          K === void 0 && (
          nt === "instanceMatrix" &&
          P.instanceMatrix && (
          K = P.instanceMatrix),
          nt === "instanceColor" &&
          P.instanceColor && (
          K = P.instanceColor)),
          K !== void 0)
          {
            let et = K.normalized,
              Dt = K.itemSize,
              Lt = t.get(K);
            if (Lt === void 0) continue;
            let Se = Lt.buffer,
              oe = Lt.type,
              ue = Lt.bytesPerElement,
              J = oe === i.INT || oe === i.UNSIGNED_INT || K.gpuType === Gl;
            if (K.isInterleavedBufferAttribute) {
              let it = K.data,
                Tt = it.stride,
                Xt = K.offset;
              if (it.isInstancedInterleavedBuffer) {
                for (let bt = 0; bt < Y.locationSize; bt++)
                m(Y.location + bt, it.meshPerAttribute);
                P.isInstancedMesh !== !0 &&
                D._maxInstanceCount === void 0 && (
                D._maxInstanceCount = it.meshPerAttribute * it.count);
              } else
              for (let bt = 0; bt < Y.locationSize; bt++) g(Y.location + bt);
              i.bindBuffer(i.ARRAY_BUFFER, Se);
              for (let bt = 0; bt < Y.locationSize; bt++)
              T(
                Y.location + bt,
                Dt / Y.locationSize,
                oe,
                et,
                Tt * ue,
                (Xt + Dt / Y.locationSize * bt) * ue,
                J
              );
            } else {
              if (K.isInstancedBufferAttribute) {
                for (let it = 0; it < Y.locationSize; it++)
                m(Y.location + it, K.meshPerAttribute);
                P.isInstancedMesh !== !0 &&
                D._maxInstanceCount === void 0 && (
                D._maxInstanceCount = K.meshPerAttribute * K.count);
              } else
              for (let it = 0; it < Y.locationSize; it++) g(Y.location + it);
              i.bindBuffer(i.ARRAY_BUFFER, Se);
              for (let it = 0; it < Y.locationSize; it++)
              T(
                Y.location + it,
                Dt / Y.locationSize,
                oe,
                et,
                Dt * ue,
                Dt / Y.locationSize * it * ue,
                J
              );
            }
          } else if (X !== void 0) {
            let et = X[nt];
            if (et !== void 0)
            switch (et.length) {
              case 2:
                i.vertexAttrib2fv(Y.location, et);
                break;
              case 3:
                i.vertexAttrib3fv(Y.location, et);
                break;
              case 4:
                i.vertexAttrib4fv(Y.location, et);
                break;
              default:
                i.vertexAttrib1fv(Y.location, et);
            }
          }
        }
      }
      b();
    }
    function S() {
      E();
      for (let P in n) {
        let N = n[P];
        for (let B in N) {
          let D = N[B];
          for (let I in D) {
            let H = D[I];
            for (let X in H) h(H[X].object), delete H[X];
            delete D[I];
          }
        }
        delete n[P];
      }
    }
    function M(P) {
      if (n[P.id] === void 0) return;
      let N = n[P.id];
      for (let B in N) {
        let D = N[B];
        for (let I in D) {
          let H = D[I];
          for (let X in H) h(H[X].object), delete H[X];
          delete D[I];
        }
      }
      delete n[P.id];
    }
    function A(P) {
      for (let N in n) {
        let B = n[N];
        for (let D in B) {
          let I = B[D];
          if (I[P.id] === void 0) continue;
          let H = I[P.id];
          for (let X in H) h(H[X].object), delete H[X];
          delete I[P.id];
        }
      }
    }
    function v(P) {
      for (let N in n) {
        let B = n[N],
          D = P.isInstancedMesh === !0 ? P.id : 0,
          I = B[D];
        if (I !== void 0) {
          for (let H in I) {
            let X = I[H];
            for (let nt in X) h(X[nt].object), delete X[nt];
            delete I[H];
          }
          delete B[D], Object.keys(B).length === 0 && delete n[N];
        }
      }
    }
    function E() {
      R(), o = !0, r !== s && (r = s, c(r.object));
    }
    function R() {
      s.geometry = null, s.program = null, s.wireframe = !1;
    }
    return {
      setup: a,
      reset: E,
      resetDefaultState: R,
      dispose: S,
      releaseStatesOfGeometry: M,
      releaseStatesOfObject: v,
      releaseStatesOfProgram: A,
      initAttributes: x,
      enableAttribute: g,
      disableUnusedAttributes: b
    };
  }
  function Gv(i, t, e) {
    let n;
    function s(l) {
      n = l;
    }
    function r(l, c) {
      i.drawArrays(n, l, c), e.update(c, n, 1);
    }
    function o(l, c, h) {
      h !== 0 && (i.drawArraysInstanced(n, l, c, h), e.update(c, n, h));
    }
    function a(l, c, h) {
      if (h === 0) return;
      t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, l, 0, c, 0, h);
      let u = 0;
      for (let f = 0; f < h; f++) u += c[f];
      e.update(u, n, 1);
    }
    this.setMode = s,
    this.render = r,
    this.renderInstances = o,
    this.renderMultiDraw = a;
  }
  function Wv(i, t, e, n) {
    let s;
    function r() {
      if (s !== void 0) return s;
      if (t.has("EXT_texture_filter_anisotropic") === !0) {
        let A = t.get("EXT_texture_filter_anisotropic");
        s = i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      } else s = 0;
      return s;
    }
    function o(A) {
      return !(
      A !== On &&
      n.convert(A) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));

    }
    function a(A) {
      let v =
      A === Qn && (
      t.has("EXT_color_buffer_half_float") ||
      t.has("EXT_color_buffer_float"));
      return !(
      A !== Tn &&
      A !== Fn &&
      !v &&
      n.convert(A) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE));

    }
    function l(A) {
      if (A === "highp") {
        if (
        i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision >
        0 &&
        i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).
        precision > 0)

        return "highp";
        A = "mediump";
      }
      return A === "mediump" &&
      i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision >
      0 &&
      i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).
      precision > 0 ?
      "mediump" :
      "lowp";
    }
    let c = e.precision !== void 0 ? e.precision : "highp",
      h = l(c);
    h !== c && (
    Ht("WebGLRenderer:", c, "not supported, using", h, "instead."), c = h);
    let d = e.logarithmicDepthBuffer === !0,
      u = e.reversedDepthBuffer === !0 && t.has("EXT_clip_control");
    e.reversedDepthBuffer === !0 &&
    u === !1 &&
    Ht(
      "WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."
    );
    let f = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),
      p = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      x = i.getParameter(i.MAX_TEXTURE_SIZE),
      g = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),
      m = i.getParameter(i.MAX_VERTEX_ATTRIBS),
      b = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),
      T = i.getParameter(i.MAX_VARYING_VECTORS),
      y = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),
      S = i.getParameter(i.MAX_SAMPLES),
      M = i.getParameter(i.SAMPLES);
    return {
      isWebGL2: !0,
      getMaxAnisotropy: r,
      getMaxPrecision: l,
      textureFormatReadable: o,
      textureTypeReadable: a,
      precision: c,
      logarithmicDepthBuffer: d,
      reversedDepthBuffer: u,
      maxTextures: f,
      maxVertexTextures: p,
      maxTextureSize: x,
      maxCubemapSize: g,
      maxAttributes: m,
      maxVertexUniforms: b,
      maxVaryings: T,
      maxFragmentUniforms: y,
      maxSamples: S,
      samples: M
    };
  }
  function Xv(i) {
    let t = this,
      e = null,
      n = 0,
      s = !1,
      r = !1,
      o = new In(),
      a = new Wt(),
      l = { value: null, needsUpdate: !1 };
    this.uniform = l,
    this.numPlanes = 0,
    this.numIntersection = 0,
    this.init = function (d, u) {
      let f = d.length !== 0 || u || n !== 0 || s;
      return s = u, n = d.length, f;
    },
    this.beginShadows = function () {
      r = !0, h(null);
    },
    this.endShadows = function () {
      r = !1;
    },
    this.setGlobalState = function (d, u) {
      e = h(d, u, 0);
    },
    this.setState = function (d, u, f) {
      let p = d.clippingPlanes,
        x = d.clipIntersection,
        g = d.clipShadows,
        m = i.get(d);
      if (!s || p === null || p.length === 0 || r && !g) r ? h(null) : c();else
      {
        let b = r ? 0 : n,
          T = b * 4,
          y = m.clippingState || null;
        l.value = y, y = h(p, u, T, f);
        for (let S = 0; S !== T; ++S) y[S] = e[S];
        m.clippingState = y,
        this.numIntersection = x ? this.numPlanes : 0,
        this.numPlanes += b;
      }
    };
    function c() {
      l.value !== e && (l.value = e, l.needsUpdate = n > 0),
      t.numPlanes = n,
      t.numIntersection = 0;
    }
    function h(d, u, f, p) {
      let x = d !== null ? d.length : 0,
        g = null;
      if (x !== 0) {
        if (g = l.value, p !== !0 || g === null) {
          let m = f + x * 4,
            b = u.matrixWorldInverse;
          a.getNormalMatrix(b),
          (g === null || g.length < m) && (g = new Float32Array(m));
          for (let T = 0, y = f; T !== x; ++T, y += 4)
          o.copy(d[T]).applyMatrix4(b, a),
          o.normal.toArray(g, y),
          g[y + 3] = o.constant;
        }
        l.value = g, l.needsUpdate = !0;
      }
      return t.numPlanes = x, t.numIntersection = 0, g;
    }
  }
  var Dr = 4,
    $v = 6,
    qv = 20,
    Yv = 256,
    jo = new ns(),
    Hp = new wt(),
    Hu = null,
    Vu = 0,
    Gu = 0,
    Wu = !1,
    Zv = new z(),
    Ns = new z(),
    Ic = class {
      constructor(t) {
        this._renderer = t,
        this._pingPongRenderTarget = null,
        this._lodMax = 0,
        this._cubeSize = 0,
        this._sizeLods = [],
        this._lodMeshes = [],
        this._backgroundBox = null,
        this._cubemapMaterial = null,
        this._equirectMaterial = null,
        this._blurMaterial = null,
        this._ggxMaterial = null;
      }
      fromScene(t, e = 0, n = 0.1, s = 100, r = {}) {
        let { size: o = 256, position: a = Zv } = r;
        Hu = this._renderer.getRenderTarget(),
        Vu = this._renderer.getActiveCubeFace(),
        Gu = this._renderer.getActiveMipmapLevel(),
        Wu = this._renderer.xr.enabled,
        this._renderer.xr.enabled = !1,
        this._setSize(o);
        let l = this._allocateTargets();
        return (
          l.depthBuffer = !0,
          this._sceneToCubeUV(t, n, s, l, a),
          e > 0 && this._blur(l, 0, 0, e),
          this._applyPMREM(l),
          this._cleanup(l),
          l);

      }
      fromEquirectangular(t, e = null) {
        return this._fromTexture(t, e);
      }
      fromCubemap(t, e = null) {
        return this._fromTexture(t, e);
      }
      compileCubemapShader() {
        this._cubemapMaterial === null && (
        this._cubemapMaterial = Wp(),
        this._compileMaterial(this._cubemapMaterial));
      }
      compileEquirectangularShader() {
        this._equirectMaterial === null && (
        this._equirectMaterial = Gp(),
        this._compileMaterial(this._equirectMaterial));
      }
      dispose() {
        this._dispose(),
        this._cubemapMaterial !== null && this._cubemapMaterial.dispose(),
        this._equirectMaterial !== null && this._equirectMaterial.dispose(),
        this._backgroundBox !== null && (
        this._backgroundBox.geometry.dispose(),
        this._backgroundBox.material.dispose());
      }
      _setSize(t) {
        this._lodMax = Math.floor(Math.log2(t)),
        this._cubeSize = Math.pow(2, this._lodMax);
      }
      _dispose() {
        this._blurMaterial !== null && this._blurMaterial.dispose(),
        this._ggxMaterial !== null && this._ggxMaterial.dispose(),
        this._pingPongRenderTarget !== null &&
        this._pingPongRenderTarget.dispose();
        for (let t = 0; t < this._lodMeshes.length; t++)
        this._lodMeshes[t].geometry.dispose();
      }
      _cleanup(t) {
        this._renderer.setRenderTarget(Hu, Vu, Gu),
        this._renderer.xr.enabled = Wu,
        t.scissorTest = !1,
        Lr(t, 0, 0, t.width, t.height);
      }
      _fromTexture(t, e) {
        t.mapping === ss || t.mapping === Ls ?
        this._setSize(
          t.image.length === 0 ?
          16 :
          t.image[0].width || t.image[0].image.width
        ) :
        this._setSize(t.image.width / 4),
        Hu = this._renderer.getRenderTarget(),
        Vu = this._renderer.getActiveCubeFace(),
        Gu = this._renderer.getActiveMipmapLevel(),
        Wu = this._renderer.xr.enabled,
        this._renderer.xr.enabled = !1;
        let n = e || this._allocateTargets();
        return (
          this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n);

      }
      _allocateTargets() {
        let t = 3 * Math.max(this._cubeSize, 112),
          e = 4 * this._cubeSize,
          n = {
            magFilter: cn,
            minFilter: cn,
            generateMipmaps: !1,
            type: Qn,
            format: On,
            colorSpace: vo,
            depthBuffer: !1
          },
          s = Vp(t, e, n);
        if (
        this._pingPongRenderTarget === null ||
        this._pingPongRenderTarget.width !== t ||
        this._pingPongRenderTarget.height !== e)
        {
          this._pingPongRenderTarget !== null && this._dispose(),
          this._pingPongRenderTarget = Vp(t, e, n);
          let { _lodMax: r } = this;
          ({ lodMeshes: this._lodMeshes, sizeLods: this._sizeLods } = Jv(r)),
          this._blurMaterial = Kv(r, t, e),
          this._ggxMaterial = jv(r, t, e);
        }
        return s;
      }
      _compileMaterial(t) {
        let e = new Et(new ye(), t);
        this._renderer.compile(e, jo);
      }
      _sceneToCubeUV(t, e, n, s, r) {
        let l = new ln(90, 1, e, n),
          c = [1, -1, 1, 1, 1, 1],
          h = [1, 1, 1, -1, -1, -1],
          d = this._renderer,
          u = d.autoClear,
          f = d.toneMapping;
        d.getClearColor(Hp),
        d.toneMapping = Kn,
        d.autoClear = !1,
        d.state.buffers.depth.getReversed() && (
        d.setRenderTarget(s), d.clearDepth(), d.setRenderTarget(null)),
        this._backgroundBox === null && (
        this._backgroundBox = new Et(
          new Un(),
          new je({
            name: "PMREM.Background",
            side: Mn,
            depthWrite: !1,
            depthTest: !1
          })
        ));
        let x = this._backgroundBox,
          g = x.material,
          m = !1,
          b = t.background;
        b ?
        b.isColor && (g.color.copy(b), t.background = null, m = !0) : (
        g.color.copy(Hp), m = !0);
        for (let T = 0; T < 6; T++) {
          let y = T % 3;
          y === 0 ? (
          l.up.set(0, c[T], 0),
          l.position.set(r.x, r.y, r.z),
          l.lookAt(r.x + h[T], r.y, r.z)) :
          y === 1 ? (
          l.up.set(0, 0, c[T]),
          l.position.set(r.x, r.y, r.z),
          l.lookAt(r.x, r.y + h[T], r.z)) : (
          l.up.set(0, c[T], 0),
          l.position.set(r.x, r.y, r.z),
          l.lookAt(r.x, r.y, r.z + h[T]));
          let S = this._cubeSize;
          Lr(s, y * S, T > 2 ? S : 0, S, S),
          d.setRenderTarget(s),
          m && d.render(x, l),
          d.render(t, l);
        }
        d.toneMapping = f, d.autoClear = u, t.background = b;
      }
      _textureToCubeUV(t, e) {
        let n = this._renderer,
          s = t.mapping === ss || t.mapping === Ls;
        s ? (
        this._cubemapMaterial === null && (this._cubemapMaterial = Wp()),
        this._cubemapMaterial.uniforms.flipEnvMap.value =
        t.isRenderTargetTexture === !1 ? -1 : 1) :
        this._equirectMaterial === null && (this._equirectMaterial = Gp());
        let r = s ? this._cubemapMaterial : this._equirectMaterial,
          o = this._lodMeshes[0];
        o.material = r;
        let a = r.uniforms;
        a.envMap.value = t;
        let l = this._cubeSize;
        Lr(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(o, jo);
      }
      _applyPMREM(t) {
        let e = this._renderer,
          n = e.autoClear;
        e.autoClear = !1;
        let s = this._lodMeshes.length;
        for (let r = 1; r < s; r++) this._applyGGXFilter(t, r - 1, r);
        e.autoClear = n;
      }
      _applyGGXFilter(t, e, n) {
        let s = this._renderer,
          r = this._pingPongRenderTarget,
          o = this._ggxMaterial,
          a = this._lodMeshes[n];
        a.material = o;
        let l = o.uniforms,
          c = n / (this._lodMeshes.length - 1),
          h = e / (this._lodMeshes.length - 1),
          d = Math.sqrt(c * c - h * h),
          u = c * 1.25,
          f = d * u,
          { _lodMax: p } = this,
          x = this._sizeLods[n],
          g = 3 * x * (n > p - Dr ? n - p + Dr : 0),
          m = 4 * (this._cubeSize - x);
        l.envMap.value = t.texture,
        l.roughness.value = f,
        l.mipInt.value = p - e,
        Lr(r, g, m, 3 * x, 2 * x),
        s.setRenderTarget(r),
        s.render(a, jo),
        l.envMap.value = r.texture,
        l.roughness.value = 0,
        l.mipInt.value = p - n,
        Lr(t, g, m, 3 * x, 2 * x),
        s.setRenderTarget(t),
        s.render(a, jo);
      }
      _blur(t, e, n, s) {
        let r = this._pingPongRenderTarget,
          o = Math.min(s, Math.PI) / Math.SQRT2;
        this._blurPass(t, r, e, n, o), this._blurPass(r, t, n, n, o);
      }
      _blurPass(t, e, n, s, r) {
        let o = this._renderer,
          a = this._blurMaterial,
          l = this._lodMeshes[s];
        l.material = a;
        let c = a.uniforms;
        c.envMap.value = t.texture,
        c.sigma.value = r,
        c.mipInt.value = this._lodMax - n;
        let h = this._sizeLods[s],
          d = 3 * h * (s > this._lodMax - Dr ? s - this._lodMax + Dr : 0),
          u = 4 * (this._cubeSize - h);
        Lr(e, d, u, 3 * h, 2 * h), o.setRenderTarget(e), o.render(l, jo);
      }
    };
  function Jv(i) {
    let t = [],
      e = [],
      n = i,
      s = i - Dr + 1 + $v;
    for (let r = 0; r < s; r++) {
      let o = Math.pow(2, n);
      t.push(o);
      let a = 1 / (o - 2),
        l = -a,
        c = 1 + a,
        h = [l, l, c, l, c, c, l, l, c, c, l, c],
        d = 6,
        u = 6,
        f = 3,
        p = new Float32Array(f * u * d),
        x = new Float32Array(f * u * d);
      for (let m = 0; m < d; m++) {
        let b = m % 3 * 2 / 3 - 1,
          T = m > 2 ? 0 : -1,
          y = [
          b,
          T,
          0,
          b + 2 / 3,
          T,
          0,
          b + 2 / 3,
          T + 1,
          0,
          b,
          T,
          0,
          b + 2 / 3,
          T + 1,
          0,
          b,
          T + 1,
          0];

        p.set(y, f * u * m);
        for (let S = 0; S < u; S++) {
          let M = h[S * 2] * 2 - 1,
            A = h[S * 2 + 1] * 2 - 1;
          m === 0 ?
          Ns.set(1, A, M) :
          m === 1 ?
          Ns.set(-M, 1, -A) :
          m === 2 ?
          Ns.set(-M, A, 1) :
          m === 3 ?
          Ns.set(-1, A, -M) :
          m === 4 ?
          Ns.set(-M, -1, A) :
          Ns.set(M, A, -1),
          Ns.toArray(x, (m * u + S) * f);
        }
      }
      let g = new ye();
      g.setAttribute("position", new Le(p, f)),
      g.setAttribute("outputDirection", new Le(x, f)),
      e.push(new Et(g, null)),
      n > Dr && n--;
    }
    return { lodMeshes: e, sizeLods: t };
  }
  function Vp(i, t, e) {
    let n = new gn(i, t, e);
    return (
      n.texture.mapping = Go,
      n.texture.name = "PMREM.cubeUv",
      n.scissorTest = !0,
      n);

  }
  function Lr(i, t, e, n, s) {
    i.viewport.set(t, e, n, s), i.scissor.set(t, e, n, s);
  }
  function jv(i, t, e) {
    return new Ke({
      name: "PMREMGGXConvolution",
      defines: {
        GGX_SAMPLES: Yv,
        CUBEUV_TEXEL_WIDTH: 1 / t,
        CUBEUV_TEXEL_HEIGHT: 1 / e,
        CUBEUV_MAX_MIP: `${i}.0`
      },
      uniforms: {
        envMap: { value: null },
        roughness: { value: 0 },
        mipInt: { value: 0 }
      },
      vertexShader: Dc(),
      fragmentShader: `

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,
      blending: xi,
      depthTest: !1,
      depthWrite: !1
    });
  }
  function Kv(i, t, e) {
    return new Ke({
      name: "SphericalGaussianBlur",
      defines: {
        SAMPLES: qv,
        CUBEUV_TEXEL_WIDTH: 1 / t,
        CUBEUV_TEXEL_HEIGHT: 1 / e,
        CUBEUV_MAX_MIP: `${i}.0`
      },
      uniforms: {
        envMap: { value: null },
        sigma: { value: 0 },
        mipInt: { value: 0 }
      },
      vertexShader: Dc(),
      fragmentShader: `

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,
      blending: xi,
      depthTest: !1,
      depthWrite: !1
    });
  }
  function Gp() {
    return new Ke({
      name: "EquirectangularToCubeUV",
      uniforms: { envMap: { value: null } },
      vertexShader: Dc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
      blending: xi,
      depthTest: !1,
      depthWrite: !1
    });
  }
  function Wp() {
    return new Ke({
      name: "CubemapToCubeUV",
      uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } },
      vertexShader: Dc(),
      fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
      blending: xi,
      depthTest: !1,
      depthWrite: !1
    });
  }
  function Dc() {
    return `

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`;
  }
  var Pc = class extends gn {
    constructor(t = 1, e = {}) {
      super(t, t, e), this.isWebGLCubeRenderTarget = !0;
      let n = { width: t, height: t, depth: 1 },
        s = [n, n, n, n, n, n];
      this.texture = new Io(s),
      this._setTextureOptions(e),
      this.texture.isRenderTargetTexture = !0;
    }
    fromEquirectangularTexture(t, e) {
      this.texture.type = e.type,
      this.texture.colorSpace = e.colorSpace,
      this.texture.generateMipmaps = e.generateMipmaps,
      this.texture.minFilter = e.minFilter,
      this.texture.magFilter = e.magFilter;
      let n = {
          uniforms: { tEquirect: { value: null } },
          vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
          fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
        },
        s = new Un(5, 5, 5),
        r = new Ke({
          name: "CubemapFromEquirect",
          uniforms: Ds(n.uniforms),
          vertexShader: n.vertexShader,
          fragmentShader: n.fragmentShader,
          side: Mn,
          blending: xi
        });
      r.uniforms.tEquirect.value = e;
      let o = new Et(s, r),
        a = e.minFilter;
      return (
        e.minFilter === rs && (e.minFilter = cn),
        new zl(1, 10, this).update(t, o),
        e.minFilter = a,
        o.geometry.dispose(),
        o.material.dispose(),
        this);

    }
    clear(t, e = !0, n = !0, s = !0) {
      let r = t.getRenderTarget();
      for (let o = 0; o < 6; o++) t.setRenderTarget(this, o), t.clear(e, n, s);
      t.setRenderTarget(r);
    }
  };
  function Qv(i) {
    let t = new WeakMap(),
      e = new WeakMap(),
      n = null;
    function s(u, f = !1) {
      return u == null ? null : f ? o(u) : r(u);
    }
    function r(u) {
      if (u && u.isTexture) {
        let f = u.mapping;
        if (f === Bl || f === Hl)
        if (t.has(u)) {
          let p = t.get(u).texture;
          return a(p, u.mapping);
        } else {
          let p = u.image;
          if (p && p.height > 0) {
            let x = new Pc(p.height);
            return (
              x.fromEquirectangularTexture(i, u),
              t.set(u, x),
              u.addEventListener("dispose", c),
              a(x.texture, u.mapping));

          } else return null;
        }
      }
      return u;
    }
    function o(u) {
      if (u && u.isTexture) {
        let f = u.mapping,
          p = f === Bl || f === Hl,
          x = f === ss || f === Ls;
        if (p || x) {
          let g = e.get(u),
            m = g !== void 0 ? g.texture.pmremVersion : 0;
          if (u.isRenderTargetTexture && u.pmremVersion !== m)
          return (
            n === null && (n = new Ic(i)),
            g = p ? n.fromEquirectangular(u, g) : n.fromCubemap(u, g),
            g.texture.pmremVersion = u.pmremVersion,
            e.set(u, g),
            g.texture);

          if (g !== void 0) return g.texture;
          {
            let b = u.image;
            return p && b && b.height > 0 || x && b && l(b) ? (
            n === null && (n = new Ic(i)),
            g = p ? n.fromEquirectangular(u) : n.fromCubemap(u),
            g.texture.pmremVersion = u.pmremVersion,
            e.set(u, g),
            u.addEventListener("dispose", h),
            g.texture) :
            null;
          }
        }
      }
      return u;
    }
    function a(u, f) {
      return f === Bl ? u.mapping = ss : f === Hl && (u.mapping = Ls), u;
    }
    function l(u) {
      let f = 0,
        p = 6;
      for (let x = 0; x < p; x++) u[x] !== void 0 && f++;
      return f === p;
    }
    function c(u) {
      let f = u.target;
      f.removeEventListener("dispose", c);
      let p = t.get(f);
      p !== void 0 && (t.delete(f), p.dispose());
    }
    function h(u) {
      let f = u.target;
      f.removeEventListener("dispose", h);
      let p = e.get(f);
      p !== void 0 && (e.delete(f), p.dispose());
    }
    function d() {
      t = new WeakMap(),
      e = new WeakMap(),
      n !== null && (n.dispose(), n = null);
    }
    return { get: s, dispose: d };
  }
  function t_(i) {
    let t = {};
    function e(n) {
      if (t[n] !== void 0) return t[n];
      let s = i.getExtension(n);
      return t[n] = s, s;
    }
    return {
      has: function (n) {
        return e(n) !== null;
      },
      init: function () {
        e("EXT_color_buffer_float"),
        e("WEBGL_clip_cull_distance"),
        e("OES_texture_float_linear"),
        e("EXT_color_buffer_half_float"),
        e("WEBGL_multisampled_render_to_texture"),
        e("WEBGL_render_shared_exponent");
      },
      get: function (n) {
        let s = e(n);
        return (
          s === null && Ss("WebGLRenderer: " + n + " extension not supported."),
          s);

      }
    };
  }
  function e_(i, t, e, n) {
    let s = {},
      r = new WeakMap();
    function o(d) {
      let u = d.target;
      u.index !== null && t.remove(u.index);
      for (let p in u.attributes) t.remove(u.attributes[p]);
      u.removeEventListener("dispose", o), delete s[u.id];
      let f = r.get(u);
      f && (t.remove(f), r.delete(u)),
      n.releaseStatesOfGeometry(u),
      u.isInstancedBufferGeometry === !0 && delete u._maxInstanceCount,
      e.memory.geometries--;
    }
    function a(d, u) {
      return (
        s[u.id] === !0 || (
        u.addEventListener("dispose", o),
        s[u.id] = !0,
        e.memory.geometries++),
        u);

    }
    function l(d) {
      let u = d.attributes;
      for (let f in u) t.update(u[f], i.ARRAY_BUFFER);
    }
    function c(d) {
      let u = [],
        f = d.index,
        p = d.attributes.position,
        x = 0;
      if (p === void 0) return;
      if (f !== null) {
        let b = f.array;
        x = f.version;
        for (let T = 0, y = b.length; T < y; T += 3) {
          let S = b[T + 0],
            M = b[T + 1],
            A = b[T + 2];
          u.push(S, M, M, A, A, S);
        }
      } else {
        let b = p.array;
        x = p.version;
        for (let T = 0, y = b.length / 3 - 1; T < y; T += 3) {
          let S = T + 0,
            M = T + 1,
            A = T + 2;
          u.push(S, M, M, A, A, S);
        }
      }
      let g = new (p.count >= 65535 ? To : Eo)(u, 1);
      g.version = x;
      let m = r.get(d);
      m && t.remove(m), r.set(d, g);
    }
    function h(d) {
      let u = r.get(d);
      if (u) {
        let f = d.index;
        f !== null && u.version < f.version && c(d);
      } else c(d);
      return r.get(d);
    }
    return { get: a, update: l, getWireframeAttribute: h };
  }
  function n_(i, t, e) {
    let n;
    function s(d) {
      n = d;
    }
    let r, o;
    function a(d) {
      r = d.type, o = d.bytesPerElement;
    }
    function l(d, u) {
      i.drawElements(n, u, r, d * o), e.update(u, n, 1);
    }
    function c(d, u, f) {
      f !== 0 && (
      i.drawElementsInstanced(n, u, r, d * o, f), e.update(u, n, f));
    }
    function h(d, u, f) {
      if (f === 0) return;
      t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, u, 0, r, d, 0, f);
      let x = 0;
      for (let g = 0; g < f; g++) x += u[g];
      e.update(x, n, 1);
    }
    this.setMode = s,
    this.setIndex = a,
    this.render = l,
    this.renderInstances = c,
    this.renderMultiDraw = h;
  }
  function i_(i) {
    let t = { geometries: 0, textures: 0 },
      e = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
    function n(r, o, a) {
      switch (e.calls++, o) {
        case i.TRIANGLES:
          e.triangles += a * (r / 3);
          break;
        case i.LINES:
          e.lines += a * (r / 2);
          break;
        case i.LINE_STRIP:
          e.lines += a * (r - 1);
          break;
        case i.LINE_LOOP:
          e.lines += a * r;
          break;
        case i.POINTS:
          e.points += a * r;
          break;
        default:
          Gt("WebGLInfo: Unknown draw mode:", o);
          break;
      }
    }
    function s() {
      e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
    }
    return {
      memory: t,
      render: e,
      programs: null,
      autoReset: !0,
      reset: s,
      update: n
    };
  }
  function s_(i, t, e) {
    let n = new WeakMap(),
      s = new De();
    function r(o, a, l) {
      let c = o.morphTargetInfluences,
        h =
        a.morphAttributes.position ||
        a.morphAttributes.normal ||
        a.morphAttributes.color,
        d = h !== void 0 ? h.length : 0,
        u = n.get(a);
      if (u === void 0 || u.count !== d) {
        let E = function () {
          A.dispose(), n.delete(a), a.removeEventListener("dispose", E);
        };
        u !== void 0 && u.texture.dispose();
        let f = a.morphAttributes.position !== void 0,
          p = a.morphAttributes.normal !== void 0,
          x = a.morphAttributes.color !== void 0,
          g = a.morphAttributes.position || [],
          m = a.morphAttributes.normal || [],
          b = a.morphAttributes.color || [],
          T = 0;
        f === !0 && (T = 1), p === !0 && (T = 2), x === !0 && (T = 3);
        let y = a.attributes.position.count * T,
          S = 1;
        y > t.maxTextureSize && (
        S = Math.ceil(y / t.maxTextureSize), y = t.maxTextureSize);
        let M = new Float32Array(y * S * 4 * d),
          A = new So(M, y, S, d);
        A.type = Fn, A.needsUpdate = !0;
        let v = T * 4;
        for (let R = 0; R < d; R++) {
          let P = g[R],
            N = m[R],
            B = b[R],
            D = y * S * 4 * R;
          for (let I = 0; I < P.count; I++) {
            let H = I * v;
            f === !0 && (
            s.fromBufferAttribute(P, I),
            M[D + H + 0] = s.x,
            M[D + H + 1] = s.y,
            M[D + H + 2] = s.z,
            M[D + H + 3] = 0),
            p === !0 && (
            s.fromBufferAttribute(N, I),
            M[D + H + 4] = s.x,
            M[D + H + 5] = s.y,
            M[D + H + 6] = s.z,
            M[D + H + 7] = 0),
            x === !0 && (
            s.fromBufferAttribute(B, I),
            M[D + H + 8] = s.x,
            M[D + H + 9] = s.y,
            M[D + H + 10] = s.z,
            M[D + H + 11] = B.itemSize === 4 ? s.w : 1);
          }
        }
        u = { count: d, texture: A, size: new Vt(y, S) },
        n.set(a, u),
        a.addEventListener("dispose", E);
      }
      if (o.isInstancedMesh === !0 && o.morphTexture !== null)
      l.getUniforms().setValue(i, "morphTexture", o.morphTexture, e);else
      {
        let f = 0;
        for (let x = 0; x < c.length; x++) f += c[x];
        let p = a.morphTargetsRelative ? 1 : 1 - f;
        l.getUniforms().setValue(i, "morphTargetBaseInfluence", p),
        l.getUniforms().setValue(i, "morphTargetInfluences", c);
      }
      l.getUniforms().setValue(i, "morphTargetsTexture", u.texture, e),
      l.getUniforms().setValue(i, "morphTargetsTextureSize", u.size);
    }
    return { update: r };
  }
  function r_(i, t, e, n, s) {
    let r = new WeakMap();
    function o(c) {
      let h = s.render.frame,
        d = c.geometry,
        u = t.get(c, d);
      if (
      r.get(u) !== h && (t.update(u), r.set(u, h)),
      c.isInstancedMesh && (
      c.hasEventListener("dispose", l) === !1 &&
      c.addEventListener("dispose", l),
      r.get(c) !== h && (
      e.update(c.instanceMatrix, i.ARRAY_BUFFER),
      c.instanceColor !== null &&
      e.update(c.instanceColor, i.ARRAY_BUFFER),
      r.set(c, h))),
      c.isSkinnedMesh)
      {
        let f = c.skeleton;
        r.get(f) !== h && (f.update(), r.set(f, h));
      }
      return u;
    }
    function a() {
      r = new WeakMap();
    }
    function l(c) {
      let h = c.target;
      h.removeEventListener("dispose", l),
      n.releaseStatesOfObject(h),
      e.remove(h.instanceMatrix),
      h.instanceColor !== null && e.remove(h.instanceColor);
    }
    return { update: o, dispose: a };
  }
  var o_ = {
    [gu]: "LINEAR_TONE_MAPPING",
    [xu]: "REINHARD_TONE_MAPPING",
    [yu]: "CINEON_TONE_MAPPING",
    [vu]: "ACES_FILMIC_TONE_MAPPING",
    [bu]: "AGX_TONE_MAPPING",
    [Mu]: "NEUTRAL_TONE_MAPPING",
    [_u]: "CUSTOM_TONE_MAPPING"
  };
  function a_(i, t, e, n, s, r) {
    let o = new gn(t, e, {
        type: i,
        depthBuffer: s,
        stencilBuffer: r,
        samples: n ? 4 : 0,
        storeMultisampledDepthBuffer: !1,
        storeMultisampledStencilBuffer: !1,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1
      }),
      a = null,
      l = null,
      c = new ye();
    c.setAttribute("position", new Zt([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)),
    c.setAttribute("uv", new Zt([0, 2, 0, 0, 2, 0], 2));
    let h = new Sl({
        uniforms: { tDiffuse: { value: null } },
        vertexShader: `
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
        fragmentShader: `
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,
        depthTest: !1,
        depthWrite: !1
      }),
      d = new Et(c, h),
      u = new ns(-1, 1, 1, -1, 0, 1),
      f = null,
      p = null,
      x = !1,
      g,
      m = null,
      b = [],
      T = !1;
    this.setSize = function (y, S) {
      o.setSize(y, S),
      a !== null && a.setSize(y, S),
      l !== null && l.setSize(y, S);
      for (let M = 0; M < b.length; M++) {
        let A = b[M];
        A.setSize && A.setSize(y, S);
      }
    },
    this.setEffects = function (y) {
      b = y, T = b.length > 0 && b[0].isRenderPass === !0;
      let S = o.width,
        M = o.height;
      b.length > 0 &&
      a === null && (
      a = new gn(S, M, { type: Qn, depthBuffer: !1, stencilBuffer: !1 }),
      l = new gn(S, M, { type: Qn, depthBuffer: !1, stencilBuffer: !1 }));
      for (let A = 0; A < b.length; A++) {
        let v = b[A];
        v.setSize && v.setSize(S, M);
      }
    },
    this.begin = function (y, S) {
      if (x || y.toneMapping === Kn && b.length === 0) return !1;
      if (m = S, S !== null) {
        let M = S.width,
          A = S.height;
        (o.width !== M || o.height !== A) && this.setSize(M, A);
      }
      return (
        T === !1 && y.setRenderTarget(o),
        g = y.toneMapping,
        y.toneMapping = Kn,
        !0);

    },
    this.hasRenderPass = function () {
      return T;
    },
    this.end = function (y, S) {
      y.toneMapping = g, x = !0;
      let M = o,
        A = a;
      for (let v = 0; v < b.length; v++) {
        let E = b[v];
        E.enabled !== !1 && (
        E.render(y, A, M, S),
        E.needsSwap !== !1 && (M = A, A = A === a ? l : a));
      }
      if (f !== y.outputColorSpace || p !== y.toneMapping) {
        f = y.outputColorSpace,
        p = y.toneMapping,
        h.defines = {},
        ie.getTransfer(f) === me && (h.defines.SRGB_TRANSFER = "");
        let v = o_[p];
        v && (h.defines[v] = ""), h.needsUpdate = !0;
      }
      h.uniforms.tDiffuse.value = M.texture,
      y.setRenderTarget(m),
      y.render(d, u),
      m = null,
      x = !1;
    },
    this.isCompositing = function () {
      return x;
    },
    this.dispose = function () {
      o.dispose(),
      a !== null && a.dispose(),
      l !== null && l.dispose(),
      c.dispose(),
      h.dispose();
    };
  }
  var hm = new _n(),
    qu = new mi(1, 1),
    um = new So(),
    dm = new yl(),
    fm = new Io(),
    Xp = [],
    $p = [],
    qp = new Float32Array(16),
    Yp = new Float32Array(9),
    Zp = new Float32Array(4);
  function zr(i, t, e) {
    let n = i[0];
    if (n <= 0 || n > 0) return i;
    let s = t * e,
      r = Xp[s];
    if (r === void 0 && (r = new Float32Array(s), Xp[s] = r), t !== 0) {
      n.toArray(r, 0);
      for (let o = 1, a = 0; o !== t; ++o) a += e, i[o].toArray(r, a);
    }
    return r;
  }
  function tn(i, t) {
    if (i.length !== t.length) return !1;
    for (let e = 0, n = i.length; e < n; e++) if (i[e] !== t[e]) return !1;
    return !0;
  }
  function en(i, t) {
    for (let e = 0, n = t.length; e < n; e++) i[e] = t[e];
  }
  function Nc(i, t) {
    let e = $p[t];
    e === void 0 && (e = new Int32Array(t), $p[t] = e);
    for (let n = 0; n !== t; ++n) e[n] = i.allocateTextureUnit();
    return e;
  }
  function l_(i, t) {
    let e = this.cache;
    e[0] !== t && (i.uniform1f(this.addr, t), e[0] = t);
  }
  function c_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (
    i.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);else
    {
      if (tn(e, t)) return;
      i.uniform2fv(this.addr, t), en(e, t);
    }
  }
  function h_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (
    i.uniform3f(this.addr, t.x, t.y, t.z),
    e[0] = t.x,
    e[1] = t.y,
    e[2] = t.z);else
    if (t.r !== void 0)
    (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) && (
    i.uniform3f(this.addr, t.r, t.g, t.b),
    e[0] = t.r,
    e[1] = t.g,
    e[2] = t.b);else
    {
      if (tn(e, t)) return;
      i.uniform3fv(this.addr, t), en(e, t);
    }
  }
  function u_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (
    i.uniform4f(this.addr, t.x, t.y, t.z, t.w),
    e[0] = t.x,
    e[1] = t.y,
    e[2] = t.z,
    e[3] = t.w);else
    {
      if (tn(e, t)) return;
      i.uniform4fv(this.addr, t), en(e, t);
    }
  }
  function d_(i, t) {
    let e = this.cache,
      n = t.elements;
    if (n === void 0) {
      if (tn(e, t)) return;
      i.uniformMatrix2fv(this.addr, !1, t), en(e, t);
    } else {
      if (tn(e, n)) return;
      Zp.set(n), i.uniformMatrix2fv(this.addr, !1, Zp), en(e, n);
    }
  }
  function f_(i, t) {
    let e = this.cache,
      n = t.elements;
    if (n === void 0) {
      if (tn(e, t)) return;
      i.uniformMatrix3fv(this.addr, !1, t), en(e, t);
    } else {
      if (tn(e, n)) return;
      Yp.set(n), i.uniformMatrix3fv(this.addr, !1, Yp), en(e, n);
    }
  }
  function p_(i, t) {
    let e = this.cache,
      n = t.elements;
    if (n === void 0) {
      if (tn(e, t)) return;
      i.uniformMatrix4fv(this.addr, !1, t), en(e, t);
    } else {
      if (tn(e, n)) return;
      qp.set(n), i.uniformMatrix4fv(this.addr, !1, qp), en(e, n);
    }
  }
  function m_(i, t) {
    let e = this.cache;
    e[0] !== t && (i.uniform1i(this.addr, t), e[0] = t);
  }
  function g_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (
    i.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);else
    {
      if (tn(e, t)) return;
      i.uniform2iv(this.addr, t), en(e, t);
    }
  }
  function x_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (
    i.uniform3i(this.addr, t.x, t.y, t.z),
    e[0] = t.x,
    e[1] = t.y,
    e[2] = t.z);else
    {
      if (tn(e, t)) return;
      i.uniform3iv(this.addr, t), en(e, t);
    }
  }
  function y_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (
    i.uniform4i(this.addr, t.x, t.y, t.z, t.w),
    e[0] = t.x,
    e[1] = t.y,
    e[2] = t.z,
    e[3] = t.w);else
    {
      if (tn(e, t)) return;
      i.uniform4iv(this.addr, t), en(e, t);
    }
  }
  function v_(i, t) {
    let e = this.cache;
    e[0] !== t && (i.uniform1ui(this.addr, t), e[0] = t);
  }
  function __(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (
    i.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);else
    {
      if (tn(e, t)) return;
      i.uniform2uiv(this.addr, t), en(e, t);
    }
  }
  function b_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (
    i.uniform3ui(this.addr, t.x, t.y, t.z),
    e[0] = t.x,
    e[1] = t.y,
    e[2] = t.z);else
    {
      if (tn(e, t)) return;
      i.uniform3uiv(this.addr, t), en(e, t);
    }
  }
  function M_(i, t) {
    let e = this.cache;
    if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (
    i.uniform4ui(this.addr, t.x, t.y, t.z, t.w),
    e[0] = t.x,
    e[1] = t.y,
    e[2] = t.z,
    e[3] = t.w);else
    {
      if (tn(e, t)) return;
      i.uniform4uiv(this.addr, t), en(e, t);
    }
  }
  function S_(i, t, e) {
    let n = this.cache,
      s = e.allocateTextureUnit();
    n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s);
    let r;
    this.type === i.SAMPLER_2D_SHADOW ? (
    qu.compareFunction = e.isReversedDepthBuffer() ? Rc : Ac, r = qu) :
    r = hm,
    e.setTexture2D(t || r, s);
  }
  function w_(i, t, e) {
    let n = this.cache,
      s = e.allocateTextureUnit();
    n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s),
    e.setTexture3D(t || dm, s);
  }
  function E_(i, t, e) {
    let n = this.cache,
      s = e.allocateTextureUnit();
    n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s),
    e.setTextureCube(t || fm, s);
  }
  function T_(i, t, e) {
    let n = this.cache,
      s = e.allocateTextureUnit();
    n[0] !== s && (i.uniform1i(this.addr, s), n[0] = s),
    e.setTexture2DArray(t || um, s);
  }
  function A_(i) {
    switch (i) {
      case 5126:
        return l_;
      case 35664:
        return c_;
      case 35665:
        return h_;
      case 35666:
        return u_;
      case 35674:
        return d_;
      case 35675:
        return f_;
      case 35676:
        return p_;
      case 5124:
      case 35670:
        return m_;
      case 35667:
      case 35671:
        return g_;
      case 35668:
      case 35672:
        return x_;
      case 35669:
      case 35673:
        return y_;
      case 5125:
        return v_;
      case 36294:
        return __;
      case 36295:
        return b_;
      case 36296:
        return M_;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return S_;
      case 35679:
      case 36299:
      case 36307:
        return w_;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return E_;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return T_;
    }
  }
  function R_(i, t) {
    i.uniform1fv(this.addr, t);
  }
  function k_(i, t) {
    let e = zr(t, this.size, 2);
    i.uniform2fv(this.addr, e);
  }
  function C_(i, t) {
    let e = zr(t, this.size, 3);
    i.uniform3fv(this.addr, e);
  }
  function I_(i, t) {
    let e = zr(t, this.size, 4);
    i.uniform4fv(this.addr, e);
  }
  function P_(i, t) {
    let e = zr(t, this.size, 4);
    i.uniformMatrix2fv(this.addr, !1, e);
  }
  function L_(i, t) {
    let e = zr(t, this.size, 9);
    i.uniformMatrix3fv(this.addr, !1, e);
  }
  function D_(i, t) {
    let e = zr(t, this.size, 16);
    i.uniformMatrix4fv(this.addr, !1, e);
  }
  function N_(i, t) {
    i.uniform1iv(this.addr, t);
  }
  function z_(i, t) {
    i.uniform2iv(this.addr, t);
  }
  function U_(i, t) {
    i.uniform3iv(this.addr, t);
  }
  function F_(i, t) {
    i.uniform4iv(this.addr, t);
  }
  function O_(i, t) {
    i.uniform1uiv(this.addr, t);
  }
  function B_(i, t) {
    i.uniform2uiv(this.addr, t);
  }
  function H_(i, t) {
    i.uniform3uiv(this.addr, t);
  }
  function V_(i, t) {
    i.uniform4uiv(this.addr, t);
  }
  function G_(i, t, e) {
    let n = this.cache,
      s = t.length,
      r = Nc(e, s);
    tn(n, r) || (i.uniform1iv(this.addr, r), en(n, r));
    let o;
    this.type === i.SAMPLER_2D_SHADOW ? o = qu : o = hm;
    for (let a = 0; a !== s; ++a) e.setTexture2D(t[a] || o, r[a]);
  }
  function W_(i, t, e) {
    let n = this.cache,
      s = t.length,
      r = Nc(e, s);
    tn(n, r) || (i.uniform1iv(this.addr, r), en(n, r));
    for (let o = 0; o !== s; ++o) e.setTexture3D(t[o] || dm, r[o]);
  }
  function X_(i, t, e) {
    let n = this.cache,
      s = t.length,
      r = Nc(e, s);
    tn(n, r) || (i.uniform1iv(this.addr, r), en(n, r));
    for (let o = 0; o !== s; ++o) e.setTextureCube(t[o] || fm, r[o]);
  }
  function $_(i, t, e) {
    let n = this.cache,
      s = t.length,
      r = Nc(e, s);
    tn(n, r) || (i.uniform1iv(this.addr, r), en(n, r));
    for (let o = 0; o !== s; ++o) e.setTexture2DArray(t[o] || um, r[o]);
  }
  function q_(i) {
    switch (i) {
      case 5126:
        return R_;
      case 35664:
        return k_;
      case 35665:
        return C_;
      case 35666:
        return I_;
      case 35674:
        return P_;
      case 35675:
        return L_;
      case 35676:
        return D_;
      case 5124:
      case 35670:
        return N_;
      case 35667:
      case 35671:
        return z_;
      case 35668:
      case 35672:
        return U_;
      case 35669:
      case 35673:
        return F_;
      case 5125:
        return O_;
      case 36294:
        return B_;
      case 36295:
        return H_;
      case 36296:
        return V_;
      case 35678:
      case 36198:
      case 36298:
      case 36306:
      case 35682:
        return G_;
      case 35679:
      case 36299:
      case 36307:
        return W_;
      case 35680:
      case 36300:
      case 36308:
      case 36293:
        return X_;
      case 36289:
      case 36303:
      case 36311:
      case 36292:
        return $_;
    }
  }
  var Yu = class {
      constructor(t, e, n) {
        this.id = t,
        this.addr = n,
        this.cache = [],
        this.type = e.type,
        this.setValue = A_(e.type);
      }
    },
    Zu = class {
      constructor(t, e, n) {
        this.id = t,
        this.addr = n,
        this.cache = [],
        this.type = e.type,
        this.size = e.size,
        this.setValue = q_(e.type);
      }
    },
    Ju = class {
      constructor(t) {
        this.id = t, this.seq = [], this.map = {};
      }
      setValue(t, e, n) {
        let s = this.seq;
        for (let r = 0, o = s.length; r !== o; ++r) {
          let a = s[r];
          a.setValue(t, e[a.id], n);
        }
      }
    },
    Xu = /(\w+)(\])?(\[|\.)?/g;
  function Jp(i, t) {
    i.seq.push(t), i.map[t.id] = t;
  }
  function Y_(i, t, e) {
    let n = i.name,
      s = n.length;
    for (Xu.lastIndex = 0;;) {
      let r = Xu.exec(n),
        o = Xu.lastIndex,
        a = r[1],
        l = r[2] === "]",
        c = r[3];
      if (l && (a = a | 0), c === void 0 || c === "[" && o + 2 === s) {
        Jp(e, c === void 0 ? new Yu(a, i, t) : new Zu(a, i, t));
        break;
      } else {
        let d = e.map[a];
        d === void 0 && (d = new Ju(a), Jp(e, d)), e = d;
      }
    }
  }
  var Nr = class {
    constructor(t, e) {
      this.seq = [], this.map = {};
      let n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
      for (let o = 0; o < n; ++o) {
        let a = t.getActiveUniform(e, o),
          l = t.getUniformLocation(e, a.name);
        Y_(a, l, this);
      }
      let s = [],
        r = [];
      for (let o of this.seq)
      o.type === t.SAMPLER_2D_SHADOW ||
      o.type === t.SAMPLER_CUBE_SHADOW ||
      o.type === t.SAMPLER_2D_ARRAY_SHADOW ?
      s.push(o) :
      r.push(o);
      s.length > 0 && (this.seq = s.concat(r));
    }
    setValue(t, e, n, s) {
      let r = this.map[e];
      r !== void 0 && r.setValue(t, n, s);
    }
    setOptional(t, e, n) {
      let s = e[n];
      s !== void 0 && this.setValue(t, n, s);
    }
    static upload(t, e, n, s) {
      for (let r = 0, o = e.length; r !== o; ++r) {
        let a = e[r],
          l = n[a.id];
        l.needsUpdate !== !1 && a.setValue(t, l.value, s);
      }
    }
    static seqWithValue(t, e) {
      let n = [];
      for (let s = 0, r = t.length; s !== r; ++s) {
        let o = t[s];
        o.id in e && n.push(o);
      }
      return n;
    }
  };
  function jp(i, t, e) {
    let n = i.createShader(t);
    return i.shaderSource(n, e), i.compileShader(n), n;
  }
  var Z_ = 37297,
    J_ = 0;
  function j_(i, t) {
    let e = i.split(`
`),
      n = [],
      s = Math.max(t - 6, 0),
      r = Math.min(t + 6, e.length);
    for (let o = s; o < r; o++) {
      let a = o + 1;
      n.push(`${a === t ? ">" : " "} ${a}: ${e[o]}`);
    }
    return n.join(`
`);
  }
  var Kp = new Wt();
  function K_(i) {
    ie._getMatrix(Kp, ie.workingColorSpace, i);
    let t = `mat3( ${Kp.elements.map((e) => e.toFixed(4))} )`;
    switch (ie.getTransfer(i)) {
      case _o:
        return [t, "LinearTransferOETF"];
      case me:
        return [t, "sRGBTransferOETF"];
      default:
        return (
          Ht("WebGLProgram: Unsupported color space: ", i),
          [t, "LinearTransferOETF"]);

    }
  }
  function Qp(i, t, e) {
    let n = i.getShaderParameter(t, i.COMPILE_STATUS),
      r = (i.getShaderInfoLog(t) || "").trim();
    if (n && r === "") return "";
    let o = /ERROR: 0:(\d+)/.exec(r);
    if (o) {
      let a = parseInt(o[1]);
      return (
        e.toUpperCase() +
        `

` +
        r +
        `

` +
        j_(i.getShaderSource(t), a));

    } else return r;
  }
  function Q_(i, t) {
    let e = K_(t);
    return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
    "}"].
    join(`
`);
  }
  var tb = {
    [gu]: "Linear",
    [xu]: "Reinhard",
    [yu]: "Cineon",
    [vu]: "ACESFilmic",
    [bu]: "AgX",
    [Mu]: "Neutral",
    [_u]: "Custom"
  };
  function eb(i, t) {
    let e = tb[t];
    return e === void 0 ? (
    Ht("WebGLProgram: Unsupported toneMapping:", t),
    "vec3 " + i + "( vec3 color ) { return LinearToneMapping( color ); }") :
    "vec3 " +
    i +
    "( vec3 color ) { return " +
    e +
    "ToneMapping( color ); }";
  }
  var Cc = new z();
  function nb() {
    ie.getLuminanceCoefficients(Cc);
    let i = Cc.x.toFixed(4),
      t = Cc.y.toFixed(4),
      e = Cc.z.toFixed(4);
    return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
    "	return dot( weights, rgb );",
    "}"].
    join(`
`);
  }
  function ib(i) {
    return [
    i.extensionClipCullDistance ?
    "#extension GL_ANGLE_clip_cull_distance : require" :
    "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].
    filter(Qo).join(`
`);
  }
  function sb(i) {
    let t = [];
    for (let e in i) {
      let n = i[e];
      n !== !1 && t.push("#define " + e + " " + n);
    }
    return t.join(`
`);
  }
  function rb(i, t) {
    let e = {},
      n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES);
    for (let s = 0; s < n; s++) {
      let r = i.getActiveAttrib(t, s),
        o = r.name,
        a = 1;
      r.type === i.FLOAT_MAT2 && (a = 2),
      r.type === i.FLOAT_MAT3 && (a = 3),
      r.type === i.FLOAT_MAT4 && (a = 4),
      e[o] = {
        type: r.type,
        location: i.getAttribLocation(t, o),
        locationSize: a
      };
    }
    return e;
  }
  function Qo(i) {
    return i !== "";
  }
  function tm(i, t) {
    let e =
    t.numSpotLightShadows +
    t.numSpotLightMaps -
    t.numSpotLightShadowsWithMaps;
    return i.
    replace(/NUM_SUN_LIGHTS/g, t.numSunLights).
    replace(/NUM_DIR_LIGHTS/g, t.numDirLights).
    replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).
    replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).
    replace(/NUM_SPOT_LIGHT_COORDS/g, e).
    replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).
    replace(/NUM_POINT_LIGHTS/g, t.numPointLights).
    replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).
    replace(/NUM_SUN_LIGHT_SHADOWS/g, t.numSunLightShadows).
    replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).
    replace(
      /NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,
      t.numSpotLightShadowsWithMaps
    ).
    replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).
    replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
  }
  function em(i, t) {
    return i.
    replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).
    replace(
      /UNION_CLIPPING_PLANES/g,
      t.numClippingPlanes - t.numClipIntersection
    );
  }
  var ob = /^[ \t]*#include +<([\w\d./]+)>/gm;
  function ju(i) {
    return i.replace(ob, lb);
  }
  var ab = new Map();
  function lb(i, t) {
    let e = Kt[t];
    if (e === void 0) {
      let n = ab.get(t);
      if (n !== void 0)
      e = Kt[n],
      Ht(
        'WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',
        t,
        n
      );else

      throw new Error(
        "THREE.WebGLProgram: Can not resolve #include <" + t + ">"
      );
    }
    return ju(e);
  }
  var cb =
  /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
  function nm(i) {
    return i.replace(cb, hb);
  }
  function hb(i, t, e, n) {
    let s = "";
    for (let r = parseInt(t); r < parseInt(e); r++)
    s += n.
    replace(/\[\s*i\s*\]/g, "[ " + r + " ]").
    replace(/UNROLLED_LOOP_INDEX/g, r);
    return s;
  }
  function im(i) {
    let t = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
    return (
      i.precision === "highp" ?
      t += `
#define HIGH_PRECISION` :
      i.precision === "mediump" ?
      t += `
#define MEDIUM_PRECISION` :
      i.precision === "lowp" && (
      t += `
#define LOW_PRECISION`),
      t);

  }
  var ub = { [Is]: "SHADOWMAP_TYPE_PCF", [kr]: "SHADOWMAP_TYPE_VSM" };
  function db(i) {
    return ub[i.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
  }
  var fb = {
    [ss]: "ENVMAP_TYPE_CUBE",
    [Ls]: "ENVMAP_TYPE_CUBE",
    [Go]: "ENVMAP_TYPE_CUBE_UV"
  };
  function pb(i) {
    return i.envMap === !1 ?
    "ENVMAP_TYPE_CUBE" :
    fb[i.envMapMode] || "ENVMAP_TYPE_CUBE";
  }
  var mb = { [Ls]: "ENVMAP_MODE_REFRACTION" };
  function gb(i) {
    return i.envMap === !1 ?
    "ENVMAP_MODE_REFLECTION" :
    mb[i.envMapMode] || "ENVMAP_MODE_REFLECTION";
  }
  var xb = {
    [Ol]: "ENVMAP_BLENDING_MULTIPLY",
    [_p]: "ENVMAP_BLENDING_MIX",
    [bp]: "ENVMAP_BLENDING_ADD"
  };
  function yb(i) {
    return i.envMap === !1 ?
    "ENVMAP_BLENDING_NONE" :
    xb[i.combine] || "ENVMAP_BLENDING_NONE";
  }
  function vb(i) {
    let t = i.envMapCubeUVHeight;
    if (t === null) return null;
    let e = Math.log2(t) - 2,
      n = 1 / t;
    return {
      texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 112)),
      texelHeight: n,
      maxMip: e
    };
  }
  function _b(i, t, e, n) {
    let s = i.getContext(),
      r = e.defines,
      o = e.vertexShader,
      a = e.fragmentShader,
      l = db(e),
      c = pb(e),
      h = gb(e),
      d = yb(e),
      u = vb(e),
      f = ib(e),
      p = sb(r),
      x = s.createProgram(),
      g,
      m,
      b = e.glslVersion ?
      "#version " +
      e.glslVersion +
      `
` :
      "";
    e.isRawShaderMaterial ? (
    g = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    p].
    filter(Qo).join(`
`),
    g.length > 0 && (
    g += `
`),
    m = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    p].
    filter(Qo).join(`
`),
    m.length > 0 && (
    m += `
`)) : (
    g = [
    im(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    p,
    e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    e.batching ? "#define USE_BATCHING" : "",
    e.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    e.instancing ? "#define USE_INSTANCING" : "",
    e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.map ? "#define USE_MAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + h : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ?
    "#define USE_IRIDESCENCE_THICKNESSMAP" :
    "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    e.mapUv ? "#define MAP_UV " + e.mapUv : "",
    e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
    e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
    e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
    e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
    e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
    e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
    e.displacementMapUv ?
    "#define DISPLACEMENTMAP_UV " + e.displacementMapUv :
    "",
    e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
    e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
    e.anisotropyMapUv ?
    "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv :
    "",
    e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
    e.clearcoatNormalMapUv ?
    "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv :
    "",
    e.clearcoatRoughnessMapUv ?
    "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv :
    "",
    e.iridescenceMapUv ?
    "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv :
    "",
    e.iridescenceThicknessMapUv ?
    "#define IRIDESCENCE_THICKNESSMAP_UV " +
    e.iridescenceThicknessMapUv :
    "",
    e.sheenColorMapUv ?
    "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv :
    "",
    e.sheenRoughnessMapUv ?
    "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv :
    "",
    e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
    e.specularColorMapUv ?
    "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv :
    "",
    e.specularIntensityMapUv ?
    "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv :
    "",
    e.transmissionMapUv ?
    "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv :
    "",
    e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexNormals ? "#define HAS_NORMAL" : "",
    e.vertexColors ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.skinning ? "#define USE_SKINNING" : "",
    e.morphTargets ? "#define USE_MORPHTARGETS" : "",
    e.morphNormals && e.flatShading === !1 ?
    "#define USE_MORPHNORMALS" :
    "",
    e.morphColors ? "#define USE_MORPHCOLORS" : "",
    e.morphTargetsCount > 0 ?
    "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride :
    "",
    e.morphTargetsCount > 0 ?
    "#define MORPHTARGETS_COUNT " + e.morphTargetsCount :
    "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.logarithmicDepthBuffer ?
    "#define USE_LOGARITHMIC_DEPTH_BUFFER" :
    "",
    e.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`].
    filter(Qo).join(`
`),
    m = [
    im(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    p,
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    e.map ? "#define USE_MAP" : "",
    e.matcap ? "#define USE_MATCAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + c : "",
    e.envMap ? "#define " + h : "",
    e.envMap ? "#define " + d : "",
    u ? "#define CUBEUV_TEXEL_WIDTH " + u.texelWidth : "",
    u ? "#define CUBEUV_TEXEL_HEIGHT " + u.texelHeight : "",
    u ? "#define CUBEUV_MAX_MIP " + u.maxMip + ".0" : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoat ? "#define USE_CLEARCOAT" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.dispersion ? "#define USE_DISPERSION" : "",
    e.retroreflection ? "#define USE_RETROREFLECTION" : "",
    e.iridescence ? "#define USE_IRIDESCENCE" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ?
    "#define USE_IRIDESCENCE_THICKNESSMAP" :
    "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaTest ? "#define USE_ALPHATEST" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.sheen ? "#define USE_SHEEN" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors || e.instancingColor ? "#define USE_COLOR" : "",
    e.vertexAlphas || e.batchingColor ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.gradientMap ? "#define USE_GRADIENTMAP" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
    e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    e.decodeVideoTextureEmissive ?
    "#define DECODE_VIDEO_TEXTURE_EMISSIVE" :
    "",
    e.logarithmicDepthBuffer ?
    "#define USE_LOGARITHMIC_DEPTH_BUFFER" :
    "",
    e.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    e.toneMapping !== Kn ? "#define TONE_MAPPING" : "",
    e.toneMapping !== Kn ? Kt.tonemapping_pars_fragment : "",
    e.toneMapping !== Kn ? eb("toneMapping", e.toneMapping) : "",
    e.dithering ? "#define DITHERING" : "",
    e.opaque ? "#define OPAQUE" : "",
    Kt.colorspace_pars_fragment,
    Q_("linearToOutputTexel", e.outputColorSpace),
    nb(),
    e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
    `
`].
    filter(Qo).join(`
`)),
    o = ju(o),
    o = tm(o, e),
    o = em(o, e),
    a = ju(a),
    a = tm(a, e),
    a = em(a, e),
    o = nm(o),
    a = nm(a),
    e.isRawShaderMaterial !== !0 && (
    b = `#version 300 es
`,
    g =
    [
    f,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"].
    join(`
`) +
    `
` +
    g,
    m =
    [
    "#define varying in",
    e.glslVersion === Iu ?
    "" :
    "layout(location = 0) out highp vec4 pc_fragColor;",
    e.glslVersion === Iu ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"].
    join(`
`) +
    `
` +
    m);
    let T = b + g + o,
      y = b + m + a,
      S = jp(s, s.VERTEX_SHADER, T),
      M = jp(s, s.FRAGMENT_SHADER, y);
    s.attachShader(x, S),
    s.attachShader(x, M),
    e.index0AttributeName !== void 0 ?
    s.bindAttribLocation(x, 0, e.index0AttributeName) :
    e.hasPositionAttribute === !0 &&
    s.bindAttribLocation(x, 0, "position"),
    s.linkProgram(x);
    function A(P) {
      if (i.debug.checkShaderErrors) {
        let N = s.getProgramInfoLog(x) || "",
          B = s.getShaderInfoLog(S) || "",
          D = s.getShaderInfoLog(M) || "",
          I = N.trim(),
          H = B.trim(),
          X = D.trim(),
          nt = !0,
          Y = !0;
        if (s.getProgramParameter(x, s.LINK_STATUS) === !1) {
          if (nt = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(s, x, S, M);else
          {
            let K = Qp(s, S, "vertex"),
              et = Qp(s, M, "fragment");
            Gt(
              "WebGLProgram: Shader Error " +
              s.getError() +
              " - VALIDATE_STATUS " +
              s.getProgramParameter(x, s.VALIDATE_STATUS) +
              `

Material Name: ` +
              P.name +
              `
Material Type: ` +
              P.type +
              `

Program Info Log: ` +
              I +
              `
` +
              K +
              `
` +
              et
            );
          }} else

        I !== "" ?
        Ht("WebGLProgram: Program Info Log:", I) :
        (H === "" || X === "") && (Y = !1);
        Y && (
        P.diagnostics = {
          runnable: nt,
          programLog: I,
          vertexShader: { log: H, prefix: g },
          fragmentShader: { log: X, prefix: m }
        });
      }
      s.deleteShader(S), s.deleteShader(M), v = new Nr(s, x), E = rb(s, x);
    }
    let v;
    this.getUniforms = function () {
      return v === void 0 && A(this), v;
    };
    let E;
    this.getAttributes = function () {
      return E === void 0 && A(this), E;
    };
    let R = e.rendererExtensionParallelShaderCompile === !1;
    return (
      this.isReady = function () {
        return R === !1 && (R = s.getProgramParameter(x, Z_)), R;
      },
      this.destroy = function () {
        n.releaseStatesOfProgram(this),
        s.deleteProgram(x),
        this.program = void 0;
      },
      this.type = e.shaderType,
      this.name = e.shaderName,
      this.id = J_++,
      this.cacheKey = t,
      this.usedTimes = 1,
      this.program = x,
      this.vertexShader = S,
      this.fragmentShader = M,
      this);

  }
  var bb = 0,
    Ku = class {
      constructor() {
        this.shaderCache = new Map(), this.materialCache = new Map();
      }
      update(t, e, n) {
        let s = this._getShaderCacheForMaterial(t);
        return (
          s.has(e) === !1 && (s.add(e), e.usedTimes++),
          s.has(n) === !1 && (s.add(n), n.usedTimes++),
          this);

      }
      remove(t) {
        let e = this.materialCache.get(t);
        for (let n of e)
        n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
        return this.materialCache.delete(t), this;
      }
      getVertexShaderStage(t) {
        return this._getShaderStage(t.vertexShader);
      }
      getFragmentShaderStage(t) {
        return this._getShaderStage(t.fragmentShader);
      }
      dispose() {
        this.shaderCache.clear(), this.materialCache.clear();
      }
      _getShaderCacheForMaterial(t) {
        let e = this.materialCache,
          n = e.get(t);
        return n === void 0 && (n = new Set(), e.set(t, n)), n;
      }
      _getShaderStage(t) {
        let e = this.shaderCache,
          n = e.get(t);
        return n === void 0 && (n = new Qu(t), e.set(t, n)), n;
      }
    },
    Qu = class {
      constructor(t) {
        this.id = bb++, this.code = t, this.usedTimes = 0;
      }
    };
  function Mb(i) {
    return i === as || i === Zo || i === Jo;
  }
  function Sb(i, t, e, n, s, r) {
    let o = new yr(),
      a = new Ku(),
      l = new Set(),
      c = [],
      h = new Map(),
      d = n.logarithmicDepthBuffer,
      u = n.precision,
      f = {
        MeshDepthMaterial: "depth",
        MeshDistanceMaterial: "distance",
        MeshNormalMaterial: "normal",
        MeshBasicMaterial: "basic",
        MeshLambertMaterial: "lambert",
        MeshPhongMaterial: "phong",
        MeshToonMaterial: "toon",
        MeshStandardMaterial: "physical",
        MeshPhysicalMaterial: "physical",
        MeshMatcapMaterial: "matcap",
        LineBasicMaterial: "basic",
        LineDashedMaterial: "dashed",
        PointsMaterial: "points",
        ShadowMaterial: "shadow",
        SpriteMaterial: "sprite"
      };
    function p(v) {
      return l.add(v), v === 0 ? "uv" : `uv${v}`;
    }
    function x(v, E, R, P, N, B) {
      let D = P.fog,
        I = N.geometry,
        H =
        v.isMeshStandardMaterial ||
        v.isMeshLambertMaterial ||
        v.isMeshPhongMaterial ?
        P.environment :
        null,
        X =
        v.isMeshStandardMaterial ||
        v.isMeshLambertMaterial && !v.envMap ||
        v.isMeshPhongMaterial && !v.envMap,
        nt = t.get(v.envMap || H, X),
        Y = nt && nt.mapping === Go ? nt.image.height : null,
        K = f[v.type];
      v.precision !== null && (
      u = n.getMaxPrecision(v.precision),
      u !== v.precision &&
      Ht(
        "WebGLProgram.getParameters:",
        v.precision,
        "not supported, using",
        u,
        "instead."
      ));
      let et =
        I.morphAttributes.position ||
        I.morphAttributes.normal ||
        I.morphAttributes.color,
        Dt = et !== void 0 ? et.length : 0,
        Lt = 0;
      I.morphAttributes.position !== void 0 && (Lt = 1),
      I.morphAttributes.normal !== void 0 && (Lt = 2),
      I.morphAttributes.color !== void 0 && (Lt = 3);
      let Se, oe, ue, J;
      if (K) {
        let Ee = vi[K];
        Se = Ee.vertexShader, oe = Ee.fragmentShader;
      } else {
        Se = v.vertexShader, oe = v.fragmentShader;
        let Ee = a.getVertexShaderStage(v),
          fe = a.getFragmentShaderStage(v);
        a.update(v, Ee, fe), ue = Ee.id, J = fe.id;
      }
      let it = i.getRenderTarget(),
        Tt = i.state.buffers.depth.getReversed(),
        Xt = N.isInstancedMesh === !0,
        bt = N.isBatchedMesh === !0,
        Qt = !!v.map,
        Ze = !!v.matcap,
        te = !!nt,
        ce = !!v.aoMap,
        we = !!v.lightMap,
        ne = !!v.bumpMap && v.wireframe === !1,
        Ie = !!v.normalMap,
        nn = !!v.displacementMap,
        Sn = !!v.emissiveMap,
        Ne = !!v.metalnessMap,
        $e = !!v.roughnessMap,
        O = v.anisotropy > 0,
        hn = v.clearcoat > 0,
        ge = v.dispersion > 0,
        C = v.retroreflectivity > 0,
        _ = v.iridescence > 0,
        V = v.sheen > 0,
        $ = v.transmission > 0,
        Z = O && !!v.anisotropyMap,
        at = hn && !!v.clearcoatMap,
        ct = hn && !!v.clearcoatNormalMap,
        j = hn && !!v.clearcoatRoughnessMap,
        tt = _ && !!v.iridescenceMap,
        ht = _ && !!v.iridescenceThicknessMap,
        Nt = V && !!v.sheenColorMap,
        pt = V && !!v.sheenRoughnessMap,
        ut = !!v.specularMap,
        zt = !!v.specularColorMap,
        Bt = !!v.specularIntensityMap,
        Yt = $ && !!v.transmissionMap,
        F = $ && !!v.thicknessMap,
        dt = !!v.gradientMap,
        Q = !!v.alphaMap,
        ft = v.alphaTest > 0,
        vt = !!v.alphaHash,
        rt = !!v.extensions,
        Ut = Kn;
      v.toneMapped && (
      it === null || it.isXRRenderTarget === !0) && (
      Ut = i.toneMapping);
      let Ct = {
        shaderID: K,
        shaderType: v.type,
        shaderName: v.name,
        vertexShader: Se,
        fragmentShader: oe,
        defines: v.defines,
        customVertexShaderID: ue,
        customFragmentShaderID: J,
        isRawShaderMaterial: v.isRawShaderMaterial === !0,
        glslVersion: v.glslVersion,
        precision: u,
        batching: bt,
        batchingColor: bt && N._colorsTexture !== null,
        instancing: Xt,
        instancingColor: Xt && N.instanceColor !== null,
        instancingMorph: Xt && N.morphTexture !== null,
        outputColorSpace:
        it === null ?
        i.outputColorSpace :
        it.isXRRenderTarget === !0 ?
        it.texture.colorSpace :
        ie.workingColorSpace,
        alphaToCoverage: !!v.alphaToCoverage,
        map: Qt,
        matcap: Ze,
        envMap: te,
        envMapMode: te && nt.mapping,
        envMapCubeUVHeight: Y,
        aoMap: ce,
        lightMap: we,
        bumpMap: ne,
        normalMap: Ie,
        displacementMap: nn,
        emissiveMap: Sn,
        normalMapObjectSpace: Ie && v.normalMapType === wp,
        normalMapTangentSpace: Ie && v.normalMapType === Tc,
        packedNormalMap: Ie && v.normalMapType === Tc && Mb(v.normalMap.format),
        metalnessMap: Ne,
        roughnessMap: $e,
        anisotropy: O,
        anisotropyMap: Z,
        clearcoat: hn,
        clearcoatMap: at,
        clearcoatNormalMap: ct,
        clearcoatRoughnessMap: j,
        dispersion: ge,
        retroreflection: C,
        iridescence: _,
        iridescenceMap: tt,
        iridescenceThicknessMap: ht,
        sheen: V,
        sheenColorMap: Nt,
        sheenRoughnessMap: pt,
        specularMap: ut,
        specularColorMap: zt,
        specularIntensityMap: Bt,
        transmission: $,
        transmissionMap: Yt,
        thicknessMap: F,
        gradientMap: dt,
        opaque:
        v.transparent === !1 && v.blending === Cr && v.alphaToCoverage === !1,
        alphaMap: Q,
        alphaTest: ft,
        alphaHash: vt,
        combine: v.combine,
        mapUv: Qt && p(v.map.channel),
        aoMapUv: ce && p(v.aoMap.channel),
        lightMapUv: we && p(v.lightMap.channel),
        bumpMapUv: ne && p(v.bumpMap.channel),
        normalMapUv: Ie && p(v.normalMap.channel),
        displacementMapUv: nn && p(v.displacementMap.channel),
        emissiveMapUv: Sn && p(v.emissiveMap.channel),
        metalnessMapUv: Ne && p(v.metalnessMap.channel),
        roughnessMapUv: $e && p(v.roughnessMap.channel),
        anisotropyMapUv: Z && p(v.anisotropyMap.channel),
        clearcoatMapUv: at && p(v.clearcoatMap.channel),
        clearcoatNormalMapUv: ct && p(v.clearcoatNormalMap.channel),
        clearcoatRoughnessMapUv: j && p(v.clearcoatRoughnessMap.channel),
        iridescenceMapUv: tt && p(v.iridescenceMap.channel),
        iridescenceThicknessMapUv: ht && p(v.iridescenceThicknessMap.channel),
        sheenColorMapUv: Nt && p(v.sheenColorMap.channel),
        sheenRoughnessMapUv: pt && p(v.sheenRoughnessMap.channel),
        specularMapUv: ut && p(v.specularMap.channel),
        specularColorMapUv: zt && p(v.specularColorMap.channel),
        specularIntensityMapUv: Bt && p(v.specularIntensityMap.channel),
        transmissionMapUv: Yt && p(v.transmissionMap.channel),
        thicknessMapUv: F && p(v.thicknessMap.channel),
        alphaMapUv: Q && p(v.alphaMap.channel),
        vertexTangents: !!I.attributes.tangent && (Ie || O),
        vertexNormals: !!I.attributes.normal,
        vertexColors: v.vertexColors,
        vertexAlphas:
        v.vertexColors === !0 &&
        !!I.attributes.color &&
        I.attributes.color.itemSize === 4,
        pointsUvs: N.isPoints === !0 && !!I.attributes.uv && (Qt || Q),
        fog: !!D,
        useFog: v.fog === !0,
        fogExp2: !!D && D.isFogExp2,
        flatShading:
        v.wireframe === !1 && (
        v.flatShading === !0 ||
        I.attributes.normal === void 0 &&
        Ie === !1 && (
        v.isMeshLambertMaterial ||
        v.isMeshPhongMaterial ||
        v.isMeshStandardMaterial ||
        v.isMeshPhysicalMaterial)),
        sizeAttenuation: v.sizeAttenuation === !0,
        logarithmicDepthBuffer: d,
        reversedDepthBuffer: Tt,
        skinning: N.isSkinnedMesh === !0,
        hasPositionAttribute: I.attributes.position !== void 0,
        morphTargets: I.morphAttributes.position !== void 0,
        morphNormals: I.morphAttributes.normal !== void 0,
        morphColors: I.morphAttributes.color !== void 0,
        morphTargetsCount: Dt,
        morphTextureStride: Lt,
        numSunLights: E.sun.length,
        numDirLights: E.directional.length,
        numPointLights: E.point.length,
        numSpotLights: E.spot.length,
        numSpotLightMaps: E.spotLightMap.length,
        numRectAreaLights: E.rectArea.length,
        numHemiLights: E.hemi.length,
        numSunLightShadows: E.sunShadowMap.length,
        numDirLightShadows: E.directionalShadowMap.length,
        numPointLightShadows: E.pointShadowMap.length,
        numSpotLightShadows: E.spotShadowMap.length,
        numSpotLightShadowsWithMaps: E.numSpotLightShadowsWithMaps,
        numLightProbes: E.numLightProbes,
        numLightProbeGrids: B.length,
        numClippingPlanes: r.numPlanes,
        numClipIntersection: r.numIntersection,
        dithering: v.dithering,
        shadowMapEnabled: i.shadowMap.enabled && R.length > 0,
        shadowMapType: i.shadowMap.type,
        toneMapping: Ut,
        decodeVideoTexture:
        Qt &&
        v.map.isVideoTexture === !0 &&
        ie.getTransfer(v.map.colorSpace) === me,
        decodeVideoTextureEmissive:
        Sn &&
        v.emissiveMap.isVideoTexture === !0 &&
        ie.getTransfer(v.emissiveMap.colorSpace) === me,
        premultipliedAlpha: v.premultipliedAlpha,
        doubleSided: v.side === gi,
        flipSided: v.side === Mn,
        useDepthPacking: v.depthPacking >= 0,
        depthPacking: v.depthPacking || 0,
        index0AttributeName: v.index0AttributeName,
        extensionClipCullDistance:
        rt &&
        v.extensions.clipCullDistance === !0 &&
        e.has("WEBGL_clip_cull_distance"),
        extensionMultiDraw:
        (rt && v.extensions.multiDraw === !0 || bt) &&
        e.has("WEBGL_multi_draw"),
        rendererExtensionParallelShaderCompile: e.has(
          "KHR_parallel_shader_compile"
        ),
        customProgramCacheKey: v.customProgramCacheKey()
      };
      return (
        Ct.vertexUv1s = l.has(1),
        Ct.vertexUv2s = l.has(2),
        Ct.vertexUv3s = l.has(3),
        l.clear(),
        Ct);

    }
    function g(v) {
      let E = [];
      if (
      v.shaderID ?
      E.push(v.shaderID) : (
      E.push(v.customVertexShaderID), E.push(v.customFragmentShaderID)),
      v.defines !== void 0)

      for (let R in v.defines) E.push(R), E.push(v.defines[R]);
      return (
        v.isRawShaderMaterial === !1 && (
        m(E, v), b(E, v), E.push(i.outputColorSpace)),
        E.push(v.customProgramCacheKey),
        E.join());

    }
    function m(v, E) {
      v.push(E.precision),
      v.push(E.outputColorSpace),
      v.push(E.envMapMode),
      v.push(E.envMapCubeUVHeight),
      v.push(E.mapUv),
      v.push(E.alphaMapUv),
      v.push(E.lightMapUv),
      v.push(E.aoMapUv),
      v.push(E.bumpMapUv),
      v.push(E.normalMapUv),
      v.push(E.displacementMapUv),
      v.push(E.emissiveMapUv),
      v.push(E.metalnessMapUv),
      v.push(E.roughnessMapUv),
      v.push(E.anisotropyMapUv),
      v.push(E.clearcoatMapUv),
      v.push(E.clearcoatNormalMapUv),
      v.push(E.clearcoatRoughnessMapUv),
      v.push(E.iridescenceMapUv),
      v.push(E.iridescenceThicknessMapUv),
      v.push(E.sheenColorMapUv),
      v.push(E.sheenRoughnessMapUv),
      v.push(E.specularMapUv),
      v.push(E.specularColorMapUv),
      v.push(E.specularIntensityMapUv),
      v.push(E.transmissionMapUv),
      v.push(E.thicknessMapUv),
      v.push(E.combine),
      v.push(E.fogExp2),
      v.push(E.sizeAttenuation),
      v.push(E.morphTargetsCount),
      v.push(E.morphAttributeCount),
      v.push(E.numSunLights),
      v.push(E.numDirLights),
      v.push(E.numPointLights),
      v.push(E.numSpotLights),
      v.push(E.numSpotLightMaps),
      v.push(E.numHemiLights),
      v.push(E.numRectAreaLights),
      v.push(E.numSunLightShadows),
      v.push(E.numDirLightShadows),
      v.push(E.numPointLightShadows),
      v.push(E.numSpotLightShadows),
      v.push(E.numSpotLightShadowsWithMaps),
      v.push(E.numLightProbes),
      v.push(E.shadowMapType),
      v.push(E.toneMapping),
      v.push(E.numClippingPlanes),
      v.push(E.numClipIntersection),
      v.push(E.depthPacking);
    }
    function b(v, E) {
      o.disableAll(),
      E.instancing && o.enable(0),
      E.instancingColor && o.enable(1),
      E.instancingMorph && o.enable(2),
      E.matcap && o.enable(3),
      E.envMap && o.enable(4),
      E.normalMapObjectSpace && o.enable(5),
      E.normalMapTangentSpace && o.enable(6),
      E.clearcoat && o.enable(7),
      E.iridescence && o.enable(8),
      E.alphaTest && o.enable(9),
      E.vertexColors && o.enable(10),
      E.vertexAlphas && o.enable(11),
      E.vertexUv1s && o.enable(12),
      E.vertexUv2s && o.enable(13),
      E.vertexUv3s && o.enable(14),
      E.vertexTangents && o.enable(15),
      E.anisotropy && o.enable(16),
      E.alphaHash && o.enable(17),
      E.batching && o.enable(18),
      E.dispersion && o.enable(19),
      E.retroreflection && o.enable(24),
      E.batchingColor && o.enable(20),
      E.gradientMap && o.enable(21),
      E.packedNormalMap && o.enable(22),
      E.vertexNormals && o.enable(23),
      v.push(o.mask),
      o.disableAll(),
      E.fog && o.enable(0),
      E.useFog && o.enable(1),
      E.flatShading && o.enable(2),
      E.logarithmicDepthBuffer && o.enable(3),
      E.reversedDepthBuffer && o.enable(4),
      E.skinning && o.enable(5),
      E.morphTargets && o.enable(6),
      E.morphNormals && o.enable(7),
      E.morphColors && o.enable(8),
      E.premultipliedAlpha && o.enable(9),
      E.shadowMapEnabled && o.enable(10),
      E.doubleSided && o.enable(11),
      E.flipSided && o.enable(12),
      E.useDepthPacking && o.enable(13),
      E.dithering && o.enable(14),
      E.transmission && o.enable(15),
      E.sheen && o.enable(16),
      E.opaque && o.enable(17),
      E.pointsUvs && o.enable(18),
      E.decodeVideoTexture && o.enable(19),
      E.decodeVideoTextureEmissive && o.enable(20),
      E.alphaToCoverage && o.enable(21),
      E.numLightProbeGrids > 0 && o.enable(22),
      E.hasPositionAttribute && o.enable(23),
      v.push(o.mask);
    }
    function T(v) {
      let E = f[v.type],
        R;
      if (E) {
        let P = vi[E];
        R = Fp.clone(P.uniforms);
      } else R = v.uniforms;
      return R;
    }
    function y(v, E) {
      let R = h.get(E);
      return (
        R !== void 0 ?
        ++R.usedTimes : (
        R = new _b(i, E, v, s), c.push(R), h.set(E, R)),
        R);

    }
    function S(v) {
      if (--v.usedTimes === 0) {
        let E = c.indexOf(v);
        c[E] = c[c.length - 1], c.pop(), h.delete(v.cacheKey), v.destroy();
      }
    }
    function M(v) {
      a.remove(v);
    }
    function A() {
      a.dispose();
    }
    return {
      getParameters: x,
      getProgramCacheKey: g,
      getUniforms: T,
      acquireProgram: y,
      releaseProgram: S,
      releaseShaderCache: M,
      programs: c,
      dispose: A
    };
  }
  function wb() {
    let i = new WeakMap();
    function t(o) {
      return i.has(o);
    }
    function e(o) {
      let a = i.get(o);
      return a === void 0 && (a = {}, i.set(o, a)), a;
    }
    function n(o) {
      i.delete(o);
    }
    function s(o, a, l) {
      i.get(o)[a] = l;
    }
    function r() {
      i = new WeakMap();
    }
    return { has: t, get: e, remove: n, update: s, dispose: r };
  }
  function Eb(i, t) {
    return i.groupOrder !== t.groupOrder ?
    i.groupOrder - t.groupOrder :
    i.renderOrder !== t.renderOrder ?
    i.renderOrder - t.renderOrder :
    i.material.id !== t.material.id ?
    i.material.id - t.material.id :
    i.materialVariant !== t.materialVariant ?
    i.materialVariant - t.materialVariant :
    i.z !== t.z ?
    i.z - t.z :
    i.id - t.id;
  }
  function sm(i, t) {
    return i.groupOrder !== t.groupOrder ?
    i.groupOrder - t.groupOrder :
    i.renderOrder !== t.renderOrder ?
    i.renderOrder - t.renderOrder :
    i.z !== t.z ?
    t.z - i.z :
    i.id - t.id;
  }
  function rm() {
    let i = [],
      t = 0,
      e = [],
      n = [],
      s = [];
    function r() {
      t = 0, e.length = 0, n.length = 0, s.length = 0;
    }
    function o(u) {
      let f = 0;
      return u.isInstancedMesh && (f += 2), u.isSkinnedMesh && (f += 1), f;
    }
    function a(u, f, p, x, g, m) {
      let b = i[t];
      return (
        b === void 0 ? (
        b = {
          id: u.id,
          object: u,
          geometry: f,
          material: p,
          materialVariant: o(u),
          groupOrder: x,
          renderOrder: u.renderOrder,
          z: g,
          group: m
        },
        i[t] = b) : (
        b.id = u.id,
        b.object = u,
        b.geometry = f,
        b.material = p,
        b.materialVariant = o(u),
        b.groupOrder = x,
        b.renderOrder = u.renderOrder,
        b.z = g,
        b.group = m),
        t++,
        b);

    }
    function l(u, f, p, x, g, m, b) {
      b.reversedDepth === !0 && (g = -g);
      let T = a(u, f, p, x, g, m);
      p.transmission > 0 ?
      n.push(T) :
      p.transparent === !0 ?
      s.push(T) :
      e.push(T);
    }
    function c(u, f, p, x, g, m) {
      let b = a(u, f, p, x, g, m);
      p.transmission > 0 ?
      n.unshift(b) :
      p.transparent === !0 ?
      s.unshift(b) :
      e.unshift(b);
    }
    function h(u, f) {
      e.length > 1 && e.sort(u || Eb),
      n.length > 1 && n.sort(f || sm),
      s.length > 1 && s.sort(f || sm);
    }
    function d() {
      for (let u = t, f = i.length; u < f; u++) {
        let p = i[u];
        if (p.id === null) break;
        p.id = null,
        p.object = null,
        p.geometry = null,
        p.material = null,
        p.group = null;
      }
    }
    return {
      opaque: e,
      transmissive: n,
      transparent: s,
      init: r,
      push: l,
      unshift: c,
      finish: d,
      sort: h
    };
  }
  function Tb() {
    let i = new WeakMap();
    function t(n, s) {
      let r = i.get(n),
        o;
      return (
        r === void 0 ? (
        o = new rm(), i.set(n, [o])) :
        s >= r.length ? (
        o = new rm(), r.push(o)) :
        o = r[s],
        o);

    }
    function e() {
      i = new WeakMap();
    }
    return { get: t, dispose: e };
  }
  function Ab() {
    let i = {};
    return {
      get: function (t) {
        if (i[t.id] !== void 0) return i[t.id];
        let e;
        switch (t.type) {
          case "SunLight":
          case "DirectionalLight":
            e = { direction: new z(), color: new wt() };
            break;
          case "SpotLight":
            e = {
              position: new z(),
              direction: new z(),
              color: new wt(),
              distance: 0,
              coneCos: 0,
              penumbraCos: 0,
              decay: 0
            };
            break;
          case "PointLight":
            e = { position: new z(), color: new wt(), distance: 0, decay: 0 };
            break;
          case "HemisphereLight":
            e = {
              direction: new z(),
              skyColor: new wt(),
              groundColor: new wt()
            };
            break;
          case "RectAreaLight":
            e = {
              color: new wt(),
              position: new z(),
              halfWidth: new z(),
              halfHeight: new z()
            };
            break;
        }
        return i[t.id] = e, e;
      }
    };
  }
  function Rb() {
    let i = {};
    return {
      get: function (t) {
        if (i[t.id] !== void 0) return i[t.id];
        let e;
        switch (t.type) {
          case "SunLight":
          case "DirectionalLight":
            e = {
              shadowIntensity: 1,
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new Vt()
            };
            break;
          case "SpotLight":
            e = {
              shadowIntensity: 1,
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new Vt()
            };
            break;
          case "PointLight":
            e = {
              shadowIntensity: 1,
              shadowBias: 0,
              shadowNormalBias: 0,
              shadowRadius: 1,
              shadowMapSize: new Vt(),
              shadowCameraNear: 1,
              shadowCameraFar: 1e3
            };
            break;
        }
        return i[t.id] = e, e;
      }
    };
  }
  var kb = 0;
  function Cb(i, t) {
    return (
      (t.castShadow ? 2 : 0) - (
      i.castShadow ? 2 : 0) + (
      t.map ? 1 : 0) - (
      i.map ? 1 : 0));

  }
  function Ib(i) {
    let t = new Ab(),
      e = Rb(),
      n = {
        version: 0,
        hash: {
          sunLength: -1,
          directionalLength: -1,
          pointLength: -1,
          spotLength: -1,
          rectAreaLength: -1,
          hemiLength: -1,
          numSunShadows: -1,
          numDirectionalShadows: -1,
          numPointShadows: -1,
          numSpotShadows: -1,
          numSpotMaps: -1,
          numLightProbes: -1
        },
        ambient: [0, 0, 0],
        probe: [],
        sun: [],
        sunShadow: [],
        sunShadowMap: [],
        sunShadowMatrix: [],
        sunShadowCascade: [],
        directional: [],
        directionalShadow: [],
        directionalShadowMap: [],
        directionalShadowMatrix: [],
        spot: [],
        spotLightMap: [],
        spotShadow: [],
        spotShadowMap: [],
        spotLightMatrix: [],
        rectArea: [],
        rectAreaLTC1: null,
        rectAreaLTC2: null,
        point: [],
        pointShadow: [],
        pointShadowMap: [],
        pointShadowMatrix: [],
        hemi: [],
        numSpotLightShadowsWithMaps: 0,
        numLightProbes: 0
      };
    for (let c = 0; c < 9; c++) n.probe.push(new z());
    let s = new z(),
      r = new se(),
      o = new se();
    function a(c) {
      let h = 0,
        d = 0,
        u = 0;
      for (let N = 0; N < 9; N++) n.probe[N].set(0, 0, 0);
      let f = 0,
        p = 0,
        x = 0,
        g = 0,
        m = 0,
        b = 0,
        T = 0,
        y = 0,
        S = 0,
        M = 0,
        A = 0,
        v = 0,
        E = 0,
        R = 0;
      c.sort(Cb);
      for (let N = 0, B = c.length; N < B; N++) {
        let D = c[N],
          I = D.color,
          H = D.intensity,
          X = D.distance,
          nt = null;
        if (
        D.shadow &&
        D.shadow.map && (
        D.shadow.map.texture.format === as ?
        nt = D.shadow.map.texture :
        nt = D.shadow.map.depthTexture || D.shadow.map.texture),
        D.isAmbientLight)

        h += I.r * H, d += I.g * H, u += I.b * H;else
        if (D.isLightProbe) {
          for (let Y = 0; Y < 9; Y++)
          n.probe[Y].addScaledVector(D.sh.coefficients[Y], H);
          R++;
        } else if (D.isSunLight) {
          let Y = t.get(D);
          if (
          Y.color.copy(D.color).multiplyScalar(D.intensity), D.castShadow)
          {
            let K = D.shadow,
              et = e.get(D);
            et.shadowIntensity = K.intensity,
            et.shadowBias = K.bias,
            et.shadowNormalBias = K.normalBias,
            et.shadowRadius = K.radius,
            et.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),
            n.sunShadow[p] = et,
            n.sunShadowMap[p] = nt;
            let Dt = K.getViewportCount();
            for (let Lt = 0; Lt < Dt; Lt++)
            n.sunShadowMatrix[x + Lt] = K.getMatrix(Lt),
            n.sunShadowCascade[x + Lt] = K._cascadeData[Lt];
            x += Dt, p++;
          }
          n.sun[f] = Y, f++;
        } else if (D.isDirectionalLight) {
          let Y = t.get(D);
          if (
          Y.color.copy(D.color).multiplyScalar(D.intensity), D.castShadow)
          {
            let K = D.shadow,
              et = e.get(D);
            et.shadowIntensity = K.intensity,
            et.shadowBias = K.bias,
            et.shadowNormalBias = K.normalBias,
            et.shadowRadius = K.radius,
            et.shadowMapSize = K.mapSize,
            n.directionalShadow[g] = et,
            n.directionalShadowMap[g] = nt,
            n.directionalShadowMatrix[g] = D.shadow.matrix,
            S++;
          }
          n.directional[g] = Y, g++;
        } else if (D.isSpotLight) {
          let Y = t.get(D);
          Y.position.setFromMatrixPosition(D.matrixWorld),
          Y.color.copy(I).multiplyScalar(H),
          Y.distance = X,
          Y.coneCos = Math.cos(D.angle),
          Y.penumbraCos = Math.cos(D.angle * (1 - D.penumbra)),
          Y.decay = D.decay,
          n.spot[b] = Y;
          let K = D.shadow;
          if (
          D.map && (
          n.spotLightMap[v] = D.map,
          v++,
          K.updateMatrices(D),
          D.castShadow && E++),
          n.spotLightMatrix[b] = K.matrix,
          D.castShadow)
          {
            let et = e.get(D);
            et.shadowIntensity = K.intensity,
            et.shadowBias = K.bias,
            et.shadowNormalBias = K.normalBias,
            et.shadowRadius = K.radius,
            et.shadowMapSize = K.mapSize,
            n.spotShadow[b] = et,
            n.spotShadowMap[b] = nt,
            A++;
          }
          b++;
        } else if (D.isRectAreaLight) {
          let Y = t.get(D);
          Y.color.copy(I).multiplyScalar(H),
          Y.halfWidth.set(D.width * 0.5, 0, 0),
          Y.halfHeight.set(0, D.height * 0.5, 0),
          n.rectArea[T] = Y,
          T++;
        } else if (D.isPointLight) {
          let Y = t.get(D);
          if (
          Y.color.copy(D.color).multiplyScalar(D.intensity),
          Y.distance = D.distance,
          Y.decay = D.decay,
          D.castShadow)
          {
            let K = D.shadow,
              et = e.get(D);
            et.shadowIntensity = K.intensity,
            et.shadowBias = K.bias,
            et.shadowNormalBias = K.normalBias,
            et.shadowRadius = K.radius,
            et.shadowMapSize = K.mapSize,
            et.shadowCameraNear = K.camera.near,
            et.shadowCameraFar = K.camera.far,
            n.pointShadow[m] = et,
            n.pointShadowMap[m] = nt,
            n.pointShadowMatrix[m] = D.shadow.matrix,
            M++;
          }
          n.point[m] = Y, m++;
        } else if (D.isHemisphereLight) {
          let Y = t.get(D);
          Y.skyColor.copy(D.color).multiplyScalar(H),
          Y.groundColor.copy(D.groundColor).multiplyScalar(H),
          n.hemi[y] = Y,
          y++;
        }
      }
      T > 0 && (
      i.has("OES_texture_float_linear") === !0 ? (
      n.rectAreaLTC1 = mt.LTC_FLOAT_1,
      n.rectAreaLTC2 = mt.LTC_FLOAT_2) : (
      n.rectAreaLTC1 = mt.LTC_HALF_1,
      n.rectAreaLTC2 = mt.LTC_HALF_2)),
      n.ambient[0] = h,
      n.ambient[1] = d,
      n.ambient[2] = u;
      let P = n.hash;
      (P.sunLength !== f ||
      P.directionalLength !== g ||
      P.pointLength !== m ||
      P.spotLength !== b ||
      P.rectAreaLength !== T ||
      P.hemiLength !== y ||
      P.numSunShadows !== p ||
      P.numDirectionalShadows !== S ||
      P.numPointShadows !== M ||
      P.numSpotShadows !== A ||
      P.numSpotMaps !== v ||
      P.numLightProbes !== R) && (
      n.sun.length = f,
      n.directional.length = g,
      n.spot.length = b,
      n.rectArea.length = T,
      n.point.length = m,
      n.hemi.length = y,
      n.sunShadow.length = p,
      n.sunShadowMap.length = p,
      n.sunShadowMatrix.length = x,
      n.sunShadowCascade.length = x,
      n.directionalShadow.length = S,
      n.directionalShadowMap.length = S,
      n.directionalShadowMatrix.length = S,
      n.pointShadow.length = M,
      n.pointShadowMap.length = M,
      n.pointShadowMatrix.length = M,
      n.spotShadow.length = A,
      n.spotShadowMap.length = A,
      n.spotLightMatrix.length = A + v - E,
      n.spotLightMap.length = v,
      n.numSpotLightShadowsWithMaps = E,
      n.numLightProbes = R,
      P.sunLength = f,
      P.directionalLength = g,
      P.pointLength = m,
      P.spotLength = b,
      P.rectAreaLength = T,
      P.hemiLength = y,
      P.numSunShadows = p,
      P.numDirectionalShadows = S,
      P.numPointShadows = M,
      P.numSpotShadows = A,
      P.numSpotMaps = v,
      P.numLightProbes = R,
      n.version = kb++);
    }
    function l(c, h) {
      let d = 0,
        u = 0,
        f = 0,
        p = 0,
        x = 0,
        g = 0,
        m = h.matrixWorldInverse;
      for (let b = 0, T = c.length; b < T; b++) {
        let y = c[b];
        if (y.isSunLight) {
          let S = n.sun[d];
          S.direction.setFromMatrixPosition(y.matrixWorld),
          S.direction.transformDirection(m),
          d++;
        } else if (y.isDirectionalLight) {
          let S = n.directional[u];
          S.direction.setFromMatrixPosition(y.matrixWorld),
          s.setFromMatrixPosition(y.target.matrixWorld),
          S.direction.sub(s),
          S.direction.transformDirection(m),
          u++;
        } else if (y.isSpotLight) {
          let S = n.spot[p];
          S.position.setFromMatrixPosition(y.matrixWorld),
          S.position.applyMatrix4(m),
          S.direction.setFromMatrixPosition(y.matrixWorld),
          s.setFromMatrixPosition(y.target.matrixWorld),
          S.direction.sub(s),
          S.direction.transformDirection(m),
          p++;
        } else if (y.isRectAreaLight) {
          let S = n.rectArea[x];
          S.position.setFromMatrixPosition(y.matrixWorld),
          S.position.applyMatrix4(m),
          o.identity(),
          r.copy(y.matrixWorld),
          r.premultiply(m),
          o.extractRotation(r),
          S.halfWidth.set(y.width * 0.5, 0, 0),
          S.halfHeight.set(0, y.height * 0.5, 0),
          S.halfWidth.applyMatrix4(o),
          S.halfHeight.applyMatrix4(o),
          x++;
        } else if (y.isPointLight) {
          let S = n.point[f];
          S.position.setFromMatrixPosition(y.matrixWorld),
          S.position.applyMatrix4(m),
          f++;
        } else if (y.isHemisphereLight) {
          let S = n.hemi[g];
          S.direction.setFromMatrixPosition(y.matrixWorld),
          S.direction.transformDirection(m),
          g++;
        }
      }
    }
    return { setup: a, setupView: l, state: n };
  }
  function om(i) {
    let t = new Ib(i),
      e = [],
      n = [],
      s = [];
    function r(u) {
      d.camera = u, e.length = 0, n.length = 0, s.length = 0;
    }
    function o(u) {
      e.push(u);
    }
    function a(u) {
      n.push(u);
    }
    function l(u) {
      s.push(u);
    }
    function c() {
      t.setup(e);
    }
    function h(u) {
      t.setupView(e, u);
    }
    let d = {
      lightsArray: e,
      shadowsArray: n,
      lightProbeGridArray: s,
      camera: null,
      lights: t,
      transmissionRenderTarget: {},
      textureUnits: 0
    };
    return {
      init: r,
      state: d,
      setupLights: c,
      setupLightsView: h,
      pushLight: o,
      pushShadow: a,
      pushLightProbeGrid: l
    };
  }
  function Pb(i) {
    let t = new WeakMap();
    function e(s, r = 0) {
      let o = t.get(s),
        a;
      return (
        o === void 0 ? (
        a = new om(i), t.set(s, [a])) :
        r >= o.length ? (
        a = new om(i), o.push(a)) :
        a = o[r],
        a);

    }
    function n() {
      t = new WeakMap();
    }
    return { get: e, dispose: n };
  }
  var Lb = `void main() {
	gl_Position = vec4( position, 1.0 );
}`,
    Db = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,
    Nb = [
    new z(1, 0, 0),
    new z(-1, 0, 0),
    new z(0, 1, 0),
    new z(0, -1, 0),
    new z(0, 0, 1),
    new z(0, 0, -1)],

    zb = [
    new z(0, -1, 0),
    new z(0, -1, 0),
    new z(0, 0, 1),
    new z(0, 0, -1),
    new z(0, -1, 0),
    new z(0, -1, 0)],

    am = new se(),
    Ko = new z(),
    $u = new z();
  function Ub(i, t, e) {
    let n = new Sr(),
      s = new Vt(),
      r = new Vt(),
      o = new De(),
      a = new wl(),
      l = new El(),
      c = {},
      h = e.maxTextureSize,
      d = { [is]: Mn, [Mn]: is, [gi]: gi },
      u = new Ke({
        defines: { VSM_SAMPLES: 8 },
        uniforms: {
          shadow_pass: { value: null },
          resolution: { value: new Vt() },
          radius: { value: 4 }
        },
        vertexShader: Lb,
        fragmentShader: Db
      }),
      f = u.clone();
    f.defines.HORIZONTAL_PASS = 1;
    let p = new ye();
    p.setAttribute(
      "position",
      new Le(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3)
    );
    let x = new Et(p, u),
      g = this;
    this.enabled = !1,
    this.autoUpdate = !0,
    this.needsUpdate = !1,
    this.type = Is;
    let m = this.type;
    this.render = function (M, A, v) {
      if (
      g.enabled === !1 ||
      g.autoUpdate === !1 && g.needsUpdate === !1 ||
      M.length === 0)

      return;
      this.type === ep && (
      Ht(
        "WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."
      ),
      this.type = Is);
      let E = i.getRenderTarget(),
        R = i.getActiveCubeFace(),
        P = i.getActiveMipmapLevel(),
        N = i.state;
      N.setBlending(xi),
      N.buffers.depth.getReversed() === !0 ?
      N.buffers.color.setClear(0, 0, 0, 0) :
      N.buffers.color.setClear(1, 1, 1, 1),
      N.buffers.depth.setTest(!0),
      N.setScissorTest(!1);
      let B = m !== this.type;
      B &&
      A.traverse(function (D) {
        D.material && (
        Array.isArray(D.material) ?
        D.material.forEach((I) => I.needsUpdate = !0) :
        D.material.needsUpdate = !0);
      });
      for (let D = 0, I = M.length; D < I; D++) {
        let H = M[D],
          X = H.shadow;
        if (X === void 0) {
          Ht("WebGLShadowMap:", H, "has no shadow.");
          continue;
        }
        if (X.autoUpdate === !1 && X.needsUpdate === !1) continue;
        s.copy(X.mapSize);
        let nt = X.getFrameExtents();
        s.multiply(nt),
        r.copy(X.mapSize),
        (s.x > h || s.y > h) && (
        s.x > h && (
        r.x = Math.floor(h / nt.x),
        s.x = r.x * nt.x,
        X.mapSize.x = r.x),
        s.y > h && (
        r.y = Math.floor(h / nt.y),
        s.y = r.y * nt.y,
        X.mapSize.y = r.y));
        let Y = i.state.buffers.depth.getReversed();
        if (X.camera._reversedDepth = Y, X.map === null || B === !0) {
          if (
          X.map !== null && (
          X.map.depthTexture !== null && (
          X.map.depthTexture.dispose(), X.map.depthTexture = null),
          X.map.dispose()),
          this.type === kr)
          {
            if (H.isPointLight) {
              Ht(
                "WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead."
              );
              continue;
            }
            X.map = new gn(s.x, s.y, {
              format: as,
              type: Qn,
              minFilter: cn,
              magFilter: cn,
              generateMipmaps: !1
            }),
            X.map.texture.name = H.name + ".shadowMap",
            X.map.depthTexture = new mi(s.x, s.y, Fn),
            X.map.depthTexture.name = H.name + ".shadowMapDepth",
            X.map.depthTexture.format = ui,
            X.map.depthTexture.compareFunction = null,
            X.map.depthTexture.minFilter = Ae,
            X.map.depthTexture.magFilter = Ae;
          } else
          H.isPointLight ? (
          X.map = new Pc(s.x), X.map.depthTexture = new Ml(s.x, Ln)) : (
          X.map = new gn(s.x, s.y),
          X.map.depthTexture = new mi(s.x, s.y, Ln)),
          X.map.depthTexture.name = H.name + ".shadowMap",
          X.map.depthTexture.format = ui,
          this.type === Is ? (
          X.map.depthTexture.compareFunction = Y ? Rc : Ac,
          X.map.depthTexture.minFilter = cn,
          X.map.depthTexture.magFilter = cn) : (
          X.map.depthTexture.compareFunction = null,
          X.map.depthTexture.minFilter = Ae,
          X.map.depthTexture.magFilter = Ae);
          X.camera.updateProjectionMatrix();
        }
        X.map.isWebGLCubeRenderTarget !== !0 && (
        X.map.width !== s.x || X.map.height !== s.y) &&
        X.map.setSize(s.x, s.y);
        let K = X.map.isWebGLCubeRenderTarget ? 6 : X.getViewportCount();
        H.isPointLight !== !0 && X.updateMatrices(H, v);
        for (let et = 0; et < K; et++) {
          let Dt = X.getCamera(et);
          if (H.isPointLight) {
            let Lt = X.camera,
              Se = X.matrix,
              oe = H.distance || Lt.far;
            oe !== Lt.far && (Lt.far = oe, Lt.updateProjectionMatrix()),
            Ko.setFromMatrixPosition(H.matrixWorld),
            Lt.position.copy(Ko),
            $u.copy(Lt.position),
            $u.add(Nb[et]),
            Lt.up.copy(zb[et]),
            Lt.lookAt($u),
            Lt.updateMatrixWorld(),
            Se.makeTranslation(-Ko.x, -Ko.y, -Ko.z),
            am.multiplyMatrices(Lt.projectionMatrix, Lt.matrixWorldInverse),
            X._frustum.setFromProjectionMatrix(
              am,
              Lt.coordinateSystem,
              Lt.reversedDepth
            );
          }
          if (X.map.isWebGLCubeRenderTarget)
          i.setRenderTarget(X.map, et), i.clear();else
          {
            et === 0 && (i.setRenderTarget(X.map), i.clear());
            let Lt = X.getViewport(et);
            o.set(r.x * Lt.x, r.y * Lt.y, r.x * Lt.z, r.y * Lt.w),
            N.viewport(o);
          }
          n = X.getFrustum(et), y(A, v, Dt, H, this.type);
        }
        X.isPointLightShadow !== !0 && this.type === kr && b(X, v),
        X.needsUpdate = !1;
      }
      m = this.type, g.needsUpdate = !1, i.setRenderTarget(E, R, P);
    };
    function b(M, A) {
      let v = t.update(x);
      u.defines.VSM_SAMPLES !== M.blurSamples && (
      u.defines.VSM_SAMPLES = M.blurSamples,
      f.defines.VSM_SAMPLES = M.blurSamples,
      u.needsUpdate = !0,
      f.needsUpdate = !0),
      M.mapPass === null ?
      M.mapPass = new gn(s.x, s.y, { format: as, type: Qn }) :
      (M.mapPass.width !== M.map.width ||
      M.mapPass.height !== M.map.height) &&
      M.mapPass.setSize(M.map.width, M.map.height),
      u.uniforms.shadow_pass.value = M.map.depthTexture,
      u.uniforms.resolution.value.set(M.map.width, M.map.height),
      u.uniforms.radius.value = M.radius,
      i.setRenderTarget(M.mapPass),
      i.clear(),
      i.renderBufferDirect(A, null, v, u, x, null),
      f.uniforms.shadow_pass.value = M.mapPass.texture,
      f.uniforms.resolution.value.set(M.map.width, M.map.height),
      f.uniforms.radius.value = M.radius,
      i.setRenderTarget(M.map),
      i.clear(),
      i.renderBufferDirect(A, null, v, f, x, null);
    }
    function T(M, A, v, E) {
      let R = null,
        P =
        v.isPointLight === !0 ?
        M.customDistanceMaterial :
        M.customDepthMaterial;
      if (P !== void 0) R = P;else
      if (
      R = v.isPointLight === !0 ? l : a,
      i.localClippingEnabled &&
      A.clipShadows === !0 &&
      Array.isArray(A.clippingPlanes) &&
      A.clippingPlanes.length !== 0 ||
      A.displacementMap && A.displacementScale !== 0 ||
      A.alphaMap && A.alphaTest > 0 ||
      A.map && A.alphaTest > 0 ||
      A.alphaToCoverage === !0)
      {
        let N = R.uuid,
          B = A.uuid,
          D = c[N];
        D === void 0 && (D = {}, c[N] = D);
        let I = D[B];
        I === void 0 && (
        I = R.clone(), D[B] = I, A.addEventListener("dispose", S)),
        R = I;
      }
      if (
      R.visible = A.visible,
      R.wireframe = A.wireframe,
      E === kr ?
      R.side = A.shadowSide !== null ? A.shadowSide : A.side :
      R.side = A.shadowSide !== null ? A.shadowSide : d[A.side],
      R.alphaMap = A.alphaMap,
      R.alphaTest = A.alphaToCoverage === !0 ? 0.5 : A.alphaTest,
      R.map = A.map,
      R.clipShadows = A.clipShadows,
      R.clippingPlanes = A.clippingPlanes,
      R.clipIntersection = A.clipIntersection,
      R.displacementMap = A.displacementMap,
      R.displacementScale = A.displacementScale,
      R.displacementBias = A.displacementBias,
      R.wireframeLinewidth = A.wireframeLinewidth,
      R.linewidth = A.linewidth,
      v.isPointLight === !0 && R.isMeshDistanceMaterial === !0)
      {
        let N = i.properties.get(R);
        N.light = v;
      }
      return R;
    }
    function y(M, A, v, E, R) {
      if (M.visible === !1) return;
      if (
      M.layers.test(A.layers) && (
      M.isMesh || M.isLine || M.isPoints) && (
      M.castShadow || M.receiveShadow && R === kr) && (
      !M.frustumCulled || M.intersectsFrustum(n)))
      {
        M.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse, M.matrixWorld);
        let B = t.update(M),
          D = M.material;
        if (Array.isArray(D)) {
          let I = B.groups;
          for (let H = 0, X = I.length; H < X; H++) {
            let nt = I[H],
              Y = D[nt.materialIndex];
            if (Y && Y.visible) {
              let K = T(M, Y, E, R);
              M.onBeforeShadow(i, M, A, v, B, K, nt),
              i.renderBufferDirect(v, null, B, K, M, nt),
              M.onAfterShadow(i, M, A, v, B, K, nt);
            }
          }
        } else if (D.visible) {
          let I = T(M, D, E, R);
          M.onBeforeShadow(i, M, A, v, B, I, null),
          i.renderBufferDirect(v, null, B, I, M, null),
          M.onAfterShadow(i, M, A, v, B, I, null);
        }
      }
      let N = M.children;
      for (let B = 0, D = N.length; B < D; B++) y(N[B], A, v, E, R);
    }
    function S(M) {
      M.target.removeEventListener("dispose", S);
      for (let v in c) {
        let E = c[v],
          R = M.target.uuid;
        R in E && (E[R].dispose(), delete E[R]);
      }
    }
  }
  function Fb(i, t) {
    function e() {
      let F = !1,
        dt = new De(),
        Q = null,
        ft = new De(0, 0, 0, 0);
      return {
        setMask: function (vt) {
          Q !== vt && !F && (i.colorMask(vt, vt, vt, vt), Q = vt);
        },
        setLocked: function (vt) {
          F = vt;
        },
        setClear: function (vt, rt, Ut, Ct, Ee) {
          Ee === !0 && (vt *= Ct, rt *= Ct, Ut *= Ct),
          dt.set(vt, rt, Ut, Ct),
          ft.equals(dt) === !1 && (i.clearColor(vt, rt, Ut, Ct), ft.copy(dt));
        },
        reset: function () {
          F = !1, Q = null, ft.set(-1, 0, 0, 0);
        }
      };
    }
    function n() {
      let F = !1,
        dt = !1,
        Q = null,
        ft = null,
        vt = null;
      return {
        setReversed: function (rt) {
          if (dt !== rt) {
            let Ut = t.get("EXT_clip_control");
            rt ?
            Ut.clipControlEXT(Ut.LOWER_LEFT_EXT, Ut.ZERO_TO_ONE_EXT) :
            Ut.clipControlEXT(
              Ut.LOWER_LEFT_EXT,
              Ut.NEGATIVE_ONE_TO_ONE_EXT
            ),
            dt = rt;
            let Ct = vt;
            vt = null, this.setClear(Ct);
          }
        },
        getReversed: function () {
          return dt;
        },
        setTest: function (rt) {
          rt ? it(i.DEPTH_TEST) : Tt(i.DEPTH_TEST);
        },
        setMask: function (rt) {
          Q !== rt && !F && (i.depthMask(rt), Q = rt);
        },
        setFunc: function (rt) {
          if (dt && (rt = Np[rt]), ft !== rt) {
            switch (rt) {
              case rl:
                i.depthFunc(i.NEVER);
                break;
              case ol:
                i.depthFunc(i.ALWAYS);
                break;
              case al:
                i.depthFunc(i.LESS);
                break;
              case pr:
                i.depthFunc(i.LEQUAL);
                break;
              case ll:
                i.depthFunc(i.EQUAL);
                break;
              case cl:
                i.depthFunc(i.GEQUAL);
                break;
              case hl:
                i.depthFunc(i.GREATER);
                break;
              case ul:
                i.depthFunc(i.NOTEQUAL);
                break;
              default:
                i.depthFunc(i.LEQUAL);
            }
            ft = rt;
          }
        },
        setLocked: function (rt) {
          F = rt;
        },
        setClear: function (rt) {
          vt !== rt && (vt = rt, dt && (rt = 1 - rt), i.clearDepth(rt));
        },
        reset: function () {
          F = !1, Q = null, ft = null, vt = null, dt = !1;
        }
      };
    }
    function s() {
      let F = !1,
        dt = null,
        Q = null,
        ft = null,
        vt = null,
        rt = null,
        Ut = null,
        Ct = null,
        Ee = null;
      return {
        setTest: function (fe) {
          F || (fe ? it(i.STENCIL_TEST) : Tt(i.STENCIL_TEST));
        },
        setMask: function (fe) {
          dt !== fe && !F && (i.stencilMask(fe), dt = fe);
        },
        setFunc: function (fe, Hn, ei) {
          (Q !== fe || ft !== Hn || vt !== ei) && (
          i.stencilFunc(fe, Hn, ei), Q = fe, ft = Hn, vt = ei);
        },
        setOp: function (fe, Hn, ei) {
          (rt !== fe || Ut !== Hn || Ct !== ei) && (
          i.stencilOp(fe, Hn, ei), rt = fe, Ut = Hn, Ct = ei);
        },
        setLocked: function (fe) {
          F = fe;
        },
        setClear: function (fe) {
          Ee !== fe && (i.clearStencil(fe), Ee = fe);
        },
        reset: function () {
          F = !1,
          dt = null,
          Q = null,
          ft = null,
          vt = null,
          rt = null,
          Ut = null,
          Ct = null,
          Ee = null;
        }
      };
    }
    let r = new e(),
      o = new n(),
      a = new s(),
      l = new WeakMap(),
      c = new WeakMap(),
      h = {},
      d = {},
      u = {},
      f = new WeakMap(),
      p = [],
      x = null,
      g = !1,
      m = null,
      b = null,
      T = null,
      y = null,
      S = null,
      M = null,
      A = null,
      v = new wt(0, 0, 0),
      E = 0,
      R = !1,
      P = null,
      N = null,
      B = null,
      D = null,
      I = null,
      H = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      X = !1,
      nt = 0,
      Y = i.getParameter(i.VERSION);
    Y.indexOf("WebGL") !== -1 ? (
    nt = parseFloat(/^WebGL (\d)/.exec(Y)[1]), X = nt >= 1) :
    Y.indexOf("OpenGL ES") !== -1 && (
    nt = parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]), X = nt >= 2);
    let K = null,
      et = {},
      Dt = i.getParameter(i.SCISSOR_BOX),
      Lt = i.getParameter(i.VIEWPORT),
      Se = new De().fromArray(Dt),
      oe = new De().fromArray(Lt);
    function ue(F, dt, Q, ft) {
      let vt = new Uint8Array(4),
        rt = i.createTexture();
      i.bindTexture(F, rt),
      i.texParameteri(F, i.TEXTURE_MIN_FILTER, i.NEAREST),
      i.texParameteri(F, i.TEXTURE_MAG_FILTER, i.NEAREST);
      for (let Ut = 0; Ut < Q; Ut++)
      F === i.TEXTURE_3D || F === i.TEXTURE_2D_ARRAY ?
      i.texImage3D(
        dt,
        0,
        i.RGBA,
        1,
        1,
        ft,
        0,
        i.RGBA,
        i.UNSIGNED_BYTE,
        vt
      ) :
      i.texImage2D(
        dt + Ut,
        0,
        i.RGBA,
        1,
        1,
        0,
        i.RGBA,
        i.UNSIGNED_BYTE,
        vt
      );
      return rt;
    }
    let J = {};
    J[i.TEXTURE_2D] = ue(i.TEXTURE_2D, i.TEXTURE_2D, 1),
    J[i.TEXTURE_CUBE_MAP] = ue(
      i.TEXTURE_CUBE_MAP,
      i.TEXTURE_CUBE_MAP_POSITIVE_X,
      6
    ),
    J[i.TEXTURE_2D_ARRAY] = ue(
      i.TEXTURE_2D_ARRAY,
      i.TEXTURE_2D_ARRAY,
      1,
      1
    ),
    J[i.TEXTURE_3D] = ue(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1),
    r.setClear(0, 0, 0, 1),
    o.setClear(1),
    a.setClear(0),
    it(i.DEPTH_TEST),
    o.setFunc(pr),
    ne(!1),
    Ie(hu),
    it(i.CULL_FACE),
    ce(xi);
    function it(F) {
      h[F] !== !0 && (i.enable(F), h[F] = !0);
    }
    function Tt(F) {
      h[F] !== !1 && (i.disable(F), h[F] = !1);
    }
    function Xt(F, dt) {
      return u[F] !== dt ? (
      i.bindFramebuffer(F, dt),
      u[F] = dt,
      F === i.DRAW_FRAMEBUFFER && (u[i.FRAMEBUFFER] = dt),
      F === i.FRAMEBUFFER && (u[i.DRAW_FRAMEBUFFER] = dt),
      !0) :
      !1;
    }
    function bt(F, dt) {
      let Q = p,
        ft = !1;
      if (F) {
        Q = f.get(dt), Q === void 0 && (Q = [], f.set(dt, Q));
        let vt = F.textures;
        if (Q.length !== vt.length || Q[0] !== i.COLOR_ATTACHMENT0) {
          for (let rt = 0, Ut = vt.length; rt < Ut; rt++)
          Q[rt] = i.COLOR_ATTACHMENT0 + rt;
          Q.length = vt.length, ft = !0;
        }
      } else Q[0] !== i.BACK && (Q[0] = i.BACK, ft = !0);
      ft && i.drawBuffers(Q);
    }
    function Qt(F) {
      return x !== F ? (i.useProgram(F), x = F, !0) : !1;
    }
    let Ze = {
      [Ps]: i.FUNC_ADD,
      [ip]: i.FUNC_SUBTRACT,
      [sp]: i.FUNC_REVERSE_SUBTRACT
    };
    Ze[rp] = i.MIN, Ze[op] = i.MAX;
    let te = {
      [ap]: i.ZERO,
      [lp]: i.ONE,
      [cp]: i.SRC_COLOR,
      [pu]: i.SRC_ALPHA,
      [mp]: i.SRC_ALPHA_SATURATE,
      [fp]: i.DST_COLOR,
      [up]: i.DST_ALPHA,
      [hp]: i.ONE_MINUS_SRC_COLOR,
      [mu]: i.ONE_MINUS_SRC_ALPHA,
      [pp]: i.ONE_MINUS_DST_COLOR,
      [dp]: i.ONE_MINUS_DST_ALPHA,
      [gp]: i.CONSTANT_COLOR,
      [xp]: i.ONE_MINUS_CONSTANT_COLOR,
      [yp]: i.CONSTANT_ALPHA,
      [vp]: i.ONE_MINUS_CONSTANT_ALPHA
    };
    function ce(F, dt, Q, ft, vt, rt, Ut, Ct, Ee, fe) {
      if (F === xi) {
        g === !0 && (Tt(i.BLEND), g = !1);
        return;
      }
      if (g === !1 && (it(i.BLEND), g = !0), F !== np) {
        if (F !== m || fe !== R) {
          if (
          (b !== Ps || S !== Ps) && (
          i.blendEquation(i.FUNC_ADD), b = Ps, S = Ps),
          fe)

          switch (F) {
            case Cr:
              i.blendFuncSeparate(
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA
              );
              break;
            case uu:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case du:
              i.blendFuncSeparate(
                i.ZERO,
                i.ONE_MINUS_SRC_COLOR,
                i.ZERO,
                i.ONE
              );
              break;
            case fu:
              i.blendFuncSeparate(
                i.DST_COLOR,
                i.ONE_MINUS_SRC_ALPHA,
                i.ZERO,
                i.ONE
              );
              break;
            default:
              Gt("WebGLState: Invalid blending: ", F);
              break;
          } else

          switch (F) {
            case Cr:
              i.blendFuncSeparate(
                i.SRC_ALPHA,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA
              );
              break;
            case uu:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE, i.ONE, i.ONE);
              break;
            case du:
              Gt(
                "WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true"
              );
              break;
            case fu:
              Gt(
                "WebGLState: MultiplyBlending requires material.premultipliedAlpha = true"
              );
              break;
            default:
              Gt("WebGLState: Invalid blending: ", F);
              break;
          }
          T = null,
          y = null,
          M = null,
          A = null,
          v.set(0, 0, 0),
          E = 0,
          m = F,
          R = fe;
        }
        return;
      }
      vt = vt || dt,
      rt = rt || Q,
      Ut = Ut || ft,
      (dt !== b || vt !== S) && (
      i.blendEquationSeparate(Ze[dt], Ze[vt]), b = dt, S = vt),
      (Q !== T || ft !== y || rt !== M || Ut !== A) && (
      i.blendFuncSeparate(te[Q], te[ft], te[rt], te[Ut]),
      T = Q,
      y = ft,
      M = rt,
      A = Ut),
      (Ct.equals(v) === !1 || Ee !== E) && (
      i.blendColor(Ct.r, Ct.g, Ct.b, Ee), v.copy(Ct), E = Ee),
      m = F,
      R = !1;
    }
    function we(F, dt) {
      F.side === gi ? Tt(i.CULL_FACE) : it(i.CULL_FACE);
      let Q = F.side === Mn;
      dt && (Q = !Q),
      ne(Q),
      F.blending === Cr && F.transparent === !1 ?
      ce(xi) :
      ce(
        F.blending,
        F.blendEquation,
        F.blendSrc,
        F.blendDst,
        F.blendEquationAlpha,
        F.blendSrcAlpha,
        F.blendDstAlpha,
        F.blendColor,
        F.blendAlpha,
        F.premultipliedAlpha
      ),
      o.setFunc(F.depthFunc),
      o.setTest(F.depthTest),
      o.setMask(F.depthWrite),
      r.setMask(F.colorWrite);
      let ft = F.stencilWrite;
      a.setTest(ft),
      ft && (
      a.setMask(F.stencilWriteMask),
      a.setFunc(F.stencilFunc, F.stencilRef, F.stencilFuncMask),
      a.setOp(F.stencilFail, F.stencilZFail, F.stencilZPass)),
      Sn(F.polygonOffset, F.polygonOffsetFactor, F.polygonOffsetUnits),
      F.alphaToCoverage === !0 ?
      it(i.SAMPLE_ALPHA_TO_COVERAGE) :
      Tt(i.SAMPLE_ALPHA_TO_COVERAGE);
    }
    function ne(F) {
      P !== F && (F ? i.frontFace(i.CW) : i.frontFace(i.CCW), P = F);
    }
    function Ie(F) {
      F !== Qf ? (
      it(i.CULL_FACE),
      F !== N && (
      F === hu ?
      i.cullFace(i.BACK) :
      F === tp ?
      i.cullFace(i.FRONT) :
      i.cullFace(i.FRONT_AND_BACK))) :
      Tt(i.CULL_FACE),
      N = F;
    }
    function nn(F) {
      F !== B && (X && i.lineWidth(F), B = F);
    }
    function Sn(F, dt, Q) {
      F ? (
      it(i.POLYGON_OFFSET_FILL),
      (D !== dt || I !== Q) && (
      D = dt,
      I = Q,
      o.getReversed() && (dt = -dt),
      i.polygonOffset(dt, Q))) :
      Tt(i.POLYGON_OFFSET_FILL);
    }
    function Ne(F) {
      F ? it(i.SCISSOR_TEST) : Tt(i.SCISSOR_TEST);
    }
    function $e(F) {
      F === void 0 && (F = i.TEXTURE0 + H - 1),
      K !== F && (i.activeTexture(F), K = F);
    }
    function O(F, dt, Q) {
      Q === void 0 && (K === null ? Q = i.TEXTURE0 + H - 1 : Q = K);
      let ft = et[Q];
      ft === void 0 && (ft = { type: void 0, texture: void 0 }, et[Q] = ft),
      (ft.type !== F || ft.texture !== dt) && (
      K !== Q && (i.activeTexture(Q), K = Q),
      i.bindTexture(F, dt || J[F]),
      ft.type = F,
      ft.texture = dt);
    }
    function hn() {
      let F = et[K];
      F !== void 0 &&
      F.type !== void 0 && (
      i.bindTexture(F.type, null), F.type = void 0, F.texture = void 0);
    }
    function ge() {
      try {
        i.compressedTexImage2D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function C() {
      try {
        i.compressedTexImage3D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function _() {
      try {
        i.texSubImage2D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function V() {
      try {
        i.texSubImage3D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function $() {
      try {
        i.compressedTexSubImage2D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function Z() {
      try {
        i.compressedTexSubImage3D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function at() {
      try {
        i.texStorage2D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function ct() {
      try {
        i.texStorage3D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function j() {
      try {
        i.texImage2D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function tt() {
      try {
        i.texImage3D(...arguments);
      } catch (F) {
        Gt("WebGLState:", F);
      }
    }
    function ht(F) {
      return d[F] !== void 0 ? d[F] : i.getParameter(F);
    }
    function Nt(F, dt) {
      d[F] !== dt && (i.pixelStorei(F, dt), d[F] = dt);
    }
    function pt(F) {
      Se.equals(F) === !1 && (i.scissor(F.x, F.y, F.z, F.w), Se.copy(F));
    }
    function ut(F) {
      oe.equals(F) === !1 && (i.viewport(F.x, F.y, F.z, F.w), oe.copy(F));
    }
    function zt(F, dt) {
      let Q = c.get(dt);
      Q === void 0 && (Q = new WeakMap(), c.set(dt, Q));
      let ft = Q.get(F);
      ft === void 0 && (
      ft = i.getUniformBlockIndex(dt, F.name), Q.set(F, ft));
    }
    function Bt(F, dt) {
      let ft = c.get(dt).get(F);
      l.get(dt) !== ft && (
      i.uniformBlockBinding(dt, ft, F.__bindingPointIndex), l.set(dt, ft));
    }
    function Yt() {
      i.disable(i.BLEND),
      i.disable(i.CULL_FACE),
      i.disable(i.DEPTH_TEST),
      i.disable(i.POLYGON_OFFSET_FILL),
      i.disable(i.SCISSOR_TEST),
      i.disable(i.STENCIL_TEST),
      i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),
      i.blendEquation(i.FUNC_ADD),
      i.blendFunc(i.ONE, i.ZERO),
      i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO),
      i.blendColor(0, 0, 0, 0),
      i.colorMask(!0, !0, !0, !0),
      i.clearColor(0, 0, 0, 0),
      i.depthMask(!0),
      i.depthFunc(i.LESS),
      o.setReversed(!1),
      i.clearDepth(1),
      i.stencilMask(4294967295),
      i.stencilFunc(i.ALWAYS, 0, 4294967295),
      i.stencilOp(i.KEEP, i.KEEP, i.KEEP),
      i.clearStencil(0),
      i.cullFace(i.BACK),
      i.frontFace(i.CCW),
      i.polygonOffset(0, 0),
      i.activeTexture(i.TEXTURE0),
      i.bindFramebuffer(i.FRAMEBUFFER, null),
      i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
      i.bindFramebuffer(i.READ_FRAMEBUFFER, null),
      i.useProgram(null),
      i.lineWidth(1),
      i.scissor(0, 0, i.canvas.width, i.canvas.height),
      i.viewport(0, 0, i.canvas.width, i.canvas.height),
      i.pixelStorei(i.PACK_ALIGNMENT, 4),
      i.pixelStorei(i.UNPACK_ALIGNMENT, 4),
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1),
      i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
      i.pixelStorei(
        i.UNPACK_COLORSPACE_CONVERSION_WEBGL,
        i.BROWSER_DEFAULT_WEBGL
      ),
      i.pixelStorei(i.PACK_ROW_LENGTH, 0),
      i.pixelStorei(i.PACK_SKIP_PIXELS, 0),
      i.pixelStorei(i.PACK_SKIP_ROWS, 0),
      i.pixelStorei(i.UNPACK_ROW_LENGTH, 0),
      i.pixelStorei(i.UNPACK_IMAGE_HEIGHT, 0),
      i.pixelStorei(i.UNPACK_SKIP_PIXELS, 0),
      i.pixelStorei(i.UNPACK_SKIP_ROWS, 0),
      i.pixelStorei(i.UNPACK_SKIP_IMAGES, 0),
      h = {},
      d = {},
      K = null,
      et = {},
      u = {},
      f = new WeakMap(),
      p = [],
      x = null,
      g = !1,
      m = null,
      b = null,
      T = null,
      y = null,
      S = null,
      M = null,
      A = null,
      v = new wt(0, 0, 0),
      E = 0,
      R = !1,
      P = null,
      N = null,
      B = null,
      D = null,
      I = null,
      Se.set(0, 0, i.canvas.width, i.canvas.height),
      oe.set(0, 0, i.canvas.width, i.canvas.height),
      r.reset(),
      o.reset(),
      a.reset();
    }
    return {
      buffers: { color: r, depth: o, stencil: a },
      enable: it,
      disable: Tt,
      bindFramebuffer: Xt,
      drawBuffers: bt,
      useProgram: Qt,
      setBlending: ce,
      setMaterial: we,
      setFlipSided: ne,
      setCullFace: Ie,
      setLineWidth: nn,
      setPolygonOffset: Sn,
      setScissorTest: Ne,
      activeTexture: $e,
      bindTexture: O,
      unbindTexture: hn,
      compressedTexImage2D: ge,
      compressedTexImage3D: C,
      texImage2D: j,
      texImage3D: tt,
      pixelStorei: Nt,
      getParameter: ht,
      updateUBOMapping: zt,
      uniformBlockBinding: Bt,
      texStorage2D: at,
      texStorage3D: ct,
      texSubImage2D: _,
      texSubImage3D: V,
      compressedTexSubImage2D: $,
      compressedTexSubImage3D: Z,
      scissor: pt,
      viewport: ut,
      reset: Yt
    };
  }
  function Ob(i, t, e, n, s, r, o) {
    let a = t.has("WEBGL_multisampled_render_to_texture") ?
      t.get("WEBGL_multisampled_render_to_texture") :
      null,
      l =
      typeof navigator > "u" ?
      !1 :
      /OculusBrowser/g.test(navigator.userAgent),
      c = new Vt(),
      h = new WeakMap(),
      d = new Set(),
      u,
      f = new WeakMap(),
      p = !1;
    try {
      p =
      typeof OffscreenCanvas < "u" &&
      new OffscreenCanvas(1, 1).getContext("2d") !== null;
    } catch {}
    function x(C, _) {
      return p ? new OffscreenCanvas(C, _) : bo("canvas");
    }
    function g(C, _, V) {
      let $ = 1,
        Z = ge(C);
      if (
      (Z.width > V || Z.height > V) && ($ = V / Math.max(Z.width, Z.height)),
      $ < 1)

      if (
      typeof HTMLImageElement < "u" && C instanceof HTMLImageElement ||
      typeof HTMLCanvasElement < "u" && C instanceof HTMLCanvasElement ||
      typeof ImageBitmap < "u" && C instanceof ImageBitmap ||
      typeof VideoFrame < "u" && C instanceof VideoFrame)
      {
        let at = Math.floor($ * Z.width),
          ct = Math.floor($ * Z.height);
        u === void 0 && (u = x(at, ct));
        let j = _ ? x(at, ct) : u;
        return (
          j.width = at,
          j.height = ct,
          j.getContext("2d").drawImage(C, 0, 0, at, ct),
          Ht(
            "WebGLRenderer: Texture has been resized from (" +
            Z.width +
            "x" +
            Z.height +
            ") to (" +
            at +
            "x" +
            ct +
            ")."
          ),
          j);

      } else
      return (
        "data" in C &&
        Ht(
          "WebGLRenderer: Image in DataTexture is too big (" +
          Z.width +
          "x" +
          Z.height +
          ")."
        ),
        C);

      return C;
    }
    function m(C) {
      return C.generateMipmaps;
    }
    function b(C) {
      i.generateMipmap(C);
    }
    function T(C) {
      return C.isWebGLCubeRenderTarget ?
      i.TEXTURE_CUBE_MAP :
      C.isWebGL3DRenderTarget ?
      i.TEXTURE_3D :
      C.isWebGLArrayRenderTarget || C.isCompressedArrayTexture ?
      i.TEXTURE_2D_ARRAY :
      i.TEXTURE_2D;
    }
    function y(C, _, V, $, Z, at = !1) {
      if (C !== null) {
        if (i[C] !== void 0) return i[C];
        Ht(
          "WebGLRenderer: Attempt to use non-existing WebGL internal format '" +
          C +
          "'"
        );
      }
      let ct;
      $ && (
      ct = t.get("EXT_texture_norm16"),
      ct ||
      Ht(
        "WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"
      ));
      let j = _;
      if (
      _ === i.RED && (
      V === i.FLOAT && (j = i.R32F),
      V === i.HALF_FLOAT && (j = i.R16F),
      V === i.UNSIGNED_BYTE && (j = i.R8),
      V === i.UNSIGNED_SHORT && ct && (j = ct.R16_EXT),
      V === i.SHORT && ct && (j = ct.R16_SNORM_EXT)),
      _ === i.RED_INTEGER && (
      V === i.UNSIGNED_BYTE && (j = i.R8UI),
      V === i.UNSIGNED_SHORT && (j = i.R16UI),
      V === i.UNSIGNED_INT && (j = i.R32UI),
      V === i.BYTE && (j = i.R8I),
      V === i.SHORT && (j = i.R16I),
      V === i.INT && (j = i.R32I)),
      _ === i.RG && (
      V === i.FLOAT && (j = i.RG32F),
      V === i.HALF_FLOAT && (j = i.RG16F),
      V === i.UNSIGNED_BYTE && (j = i.RG8),
      V === i.UNSIGNED_SHORT && ct && (j = ct.RG16_EXT),
      V === i.SHORT && ct && (j = ct.RG16_SNORM_EXT)),
      _ === i.RG_INTEGER && (
      V === i.UNSIGNED_BYTE && (j = i.RG8UI),
      V === i.UNSIGNED_SHORT && (j = i.RG16UI),
      V === i.UNSIGNED_INT && (j = i.RG32UI),
      V === i.BYTE && (j = i.RG8I),
      V === i.SHORT && (j = i.RG16I),
      V === i.INT && (j = i.RG32I)),
      _ === i.RGB_INTEGER && (
      V === i.UNSIGNED_BYTE && (j = i.RGB8UI),
      V === i.UNSIGNED_SHORT && (j = i.RGB16UI),
      V === i.UNSIGNED_INT && (j = i.RGB32UI),
      V === i.BYTE && (j = i.RGB8I),
      V === i.SHORT && (j = i.RGB16I),
      V === i.INT && (j = i.RGB32I)),
      _ === i.RGBA_INTEGER && (
      V === i.UNSIGNED_BYTE && (j = i.RGBA8UI),
      V === i.UNSIGNED_SHORT && (j = i.RGBA16UI),
      V === i.UNSIGNED_INT && (j = i.RGBA32UI),
      V === i.BYTE && (j = i.RGBA8I),
      V === i.SHORT && (j = i.RGBA16I),
      V === i.INT && (j = i.RGBA32I)),
      _ === i.RGB && (
      V === i.UNSIGNED_SHORT && ct && (j = ct.RGB16_EXT),
      V === i.SHORT && ct && (j = ct.RGB16_SNORM_EXT),
      V === i.UNSIGNED_INT_5_9_9_9_REV && (j = i.RGB9_E5),
      V === i.UNSIGNED_INT_10F_11F_11F_REV && (j = i.R11F_G11F_B10F)),
      _ === i.RGBA)
      {
        let tt = at ? _o : ie.getTransfer(Z);
        V === i.FLOAT && (j = i.RGBA32F),
        V === i.HALF_FLOAT && (j = i.RGBA16F),
        V === i.UNSIGNED_BYTE && (j = tt === me ? i.SRGB8_ALPHA8 : i.RGBA8),
        V === i.UNSIGNED_SHORT && ct && (j = ct.RGBA16_EXT),
        V === i.SHORT && ct && (j = ct.RGBA16_SNORM_EXT),
        V === i.UNSIGNED_SHORT_4_4_4_4 && (j = i.RGBA4),
        V === i.UNSIGNED_SHORT_5_5_5_1 && (j = i.RGB5_A1);
      }
      return (
        (j === i.R16F ||
        j === i.R32F ||
        j === i.RG16F ||
        j === i.RG32F ||
        j === i.RGBA16F ||
        j === i.RGBA32F) &&
        t.get("EXT_color_buffer_float"),
        j);

    }
    function S(C, _) {
      let V;
      return (
        C ?
        _ === null || _ === Ln || _ === Pr ?
        V = i.DEPTH24_STENCIL8 :
        _ === Fn ?
        V = i.DEPTH32F_STENCIL8 :
        _ === Ir && (
        V = i.DEPTH24_STENCIL8,
        Ht(
          "DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment."
        )) :
        _ === null || _ === Ln || _ === Pr ?
        V = i.DEPTH_COMPONENT24 :
        _ === Fn ?
        V = i.DEPTH_COMPONENT32F :
        _ === Ir && (V = i.DEPTH_COMPONENT16),
        V);

    }
    function M(C, _) {
      return m(C) === !0 ||
      C.isFramebufferTexture && C.minFilter !== Ae && C.minFilter !== cn ?
      Math.log2(Math.max(_.width, _.height)) + 1 :
      C.mipmaps !== void 0 && C.mipmaps.length > 0 ?
      C.mipmaps.length :
      C.isCompressedTexture && Array.isArray(C.image) ?
      _.mipmaps.length :
      1;
    }
    function A(C) {
      let _ = C.target;
      _.removeEventListener("dispose", A),
      E(_),
      _.isVideoTexture && h.delete(_),
      _.isHTMLTexture && d.delete(_);
    }
    function v(C) {
      let _ = C.target;
      _.removeEventListener("dispose", v), P(_);
    }
    function E(C) {
      let _ = n.get(C);
      if (_.__webglInit === void 0) return;
      let V = C.source,
        $ = f.get(V);
      if ($) {
        let Z = $[_.__cacheKey];
        Z.usedTimes--,
        Z.usedTimes === 0 && R(C),
        Object.keys($).length === 0 && f.delete(V);
      }
      n.remove(C);
    }
    function R(C) {
      let _ = n.get(C);
      i.deleteTexture(_.__webglTexture);
      let V = C.source,
        $ = f.get(V);
      delete $[_.__cacheKey], o.memory.textures--;
    }
    function P(C) {
      let _ = n.get(C);
      if (
      C.depthTexture && (C.depthTexture.dispose(), n.remove(C.depthTexture)),
      C.isWebGLCubeRenderTarget)

      for (let $ = 0; $ < 6; $++) {
        if (Array.isArray(_.__webglFramebuffer[$]))
        for (let Z = 0; Z < _.__webglFramebuffer[$].length; Z++)
        i.deleteFramebuffer(_.__webglFramebuffer[$][Z]);else
        i.deleteFramebuffer(_.__webglFramebuffer[$]);
        _.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer[$]);
      } else
      {
        if (Array.isArray(_.__webglFramebuffer))
        for (let $ = 0; $ < _.__webglFramebuffer.length; $++)
        i.deleteFramebuffer(_.__webglFramebuffer[$]);else
        i.deleteFramebuffer(_.__webglFramebuffer);
        if (
        _.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer),
        _.__webglMultisampledFramebuffer &&
        i.deleteFramebuffer(_.__webglMultisampledFramebuffer),
        _.__webglColorRenderbuffer)

        for (let $ = 0; $ < _.__webglColorRenderbuffer.length; $++)
        _.__webglColorRenderbuffer[$] &&
        i.deleteRenderbuffer(_.__webglColorRenderbuffer[$]);
        _.__webglDepthRenderbuffer &&
        i.deleteRenderbuffer(_.__webglDepthRenderbuffer);
      }
      let V = C.textures;
      for (let $ = 0, Z = V.length; $ < Z; $++) {
        let at = n.get(V[$]);
        at.__webglTexture && (
        i.deleteTexture(at.__webglTexture), o.memory.textures--),
        n.remove(V[$]);
      }
      n.remove(C);
    }
    let N = 0;
    function B() {
      N = 0;
    }
    function D() {
      return N;
    }
    function I(C) {
      N = C;
    }
    function H() {
      let C = N;
      return (
        C >= s.maxTextures &&
        Ht(
          "WebGLTextures: Trying to use " + (
          C + 1) +
          " texture units while this GPU supports only " +
          s.maxTextures
        ),
        N += 1,
        C);

    }
    function X(C) {
      let _ = [];
      return (
        _.push(C.wrapS),
        _.push(C.wrapT),
        _.push(C.wrapR || 0),
        _.push(C.magFilter),
        _.push(C.minFilter),
        _.push(C.anisotropy),
        _.push(C.internalFormat),
        _.push(C.format),
        _.push(C.type),
        _.push(C.generateMipmaps),
        _.push(C.premultiplyAlpha),
        _.push(C.flipY),
        _.push(C.unpackAlignment),
        _.push(C.colorSpace),
        _.join());

    }
    function nt(C, _) {
      let V = n.get(C);
      if (
      C.isVideoTexture && O(C),
      C.isRenderTargetTexture === !1 &&
      C.isExternalTexture !== !0 &&
      C.version > 0 &&
      V.__version !== C.version)
      {
        let $ = C.image;
        if ($ === null)
        Ht(
          "WebGLRenderer: Texture marked for update but no image data found."
        );else
        if ($.complete === !1)
        Ht(
          "WebGLRenderer: Texture marked for update but image is incomplete"
        );else
        {
          Tt(V, C, _);
          return;
        }
      } else
      C.isExternalTexture && (
      V.__webglTexture = C.sourceTexture ? C.sourceTexture : null);
      e.bindTexture(i.TEXTURE_2D, V.__webglTexture, i.TEXTURE0 + _);
    }
    function Y(C, _) {
      let V = n.get(C);
      if (
      C.isRenderTargetTexture === !1 &&
      C.version > 0 &&
      V.__version !== C.version)
      {
        Tt(V, C, _);
        return;
      } else
      C.isExternalTexture && (
      V.__webglTexture = C.sourceTexture ? C.sourceTexture : null);
      e.bindTexture(i.TEXTURE_2D_ARRAY, V.__webglTexture, i.TEXTURE0 + _);
    }
    function K(C, _) {
      let V = n.get(C);
      if (
      C.isRenderTargetTexture === !1 &&
      C.version > 0 &&
      V.__version !== C.version)
      {
        Tt(V, C, _);
        return;
      }
      e.bindTexture(i.TEXTURE_3D, V.__webglTexture, i.TEXTURE0 + _);
    }
    function et(C, _) {
      let V = n.get(C);
      if (
      C.isCubeDepthTexture !== !0 &&
      C.version > 0 &&
      V.__version !== C.version)
      {
        Xt(V, C, _);
        return;
      }
      e.bindTexture(i.TEXTURE_CUBE_MAP, V.__webglTexture, i.TEXTURE0 + _);
    }
    let Dt = { [dl]: i.REPEAT, [hi]: i.CLAMP_TO_EDGE, [fl]: i.MIRRORED_REPEAT },
      Lt = {
        [Ae]: i.NEAREST,
        [Mp]: i.NEAREST_MIPMAP_NEAREST,
        [Wo]: i.NEAREST_MIPMAP_LINEAR,
        [cn]: i.LINEAR,
        [Vl]: i.LINEAR_MIPMAP_NEAREST,
        [rs]: i.LINEAR_MIPMAP_LINEAR
      },
      Se = {
        [Tp]: i.NEVER,
        [Ip]: i.ALWAYS,
        [Ap]: i.LESS,
        [Ac]: i.LEQUAL,
        [Rp]: i.EQUAL,
        [Rc]: i.GEQUAL,
        [kp]: i.GREATER,
        [Cp]: i.NOTEQUAL
      };
    function oe(C, _) {
      if (
      _.type === Fn &&
      t.has("OES_texture_float_linear") === !1 && (
      _.magFilter === cn ||
      _.magFilter === Vl ||
      _.magFilter === Wo ||
      _.magFilter === rs ||
      _.minFilter === cn ||
      _.minFilter === Vl ||
      _.minFilter === Wo ||
      _.minFilter === rs) &&
      Ht(
        "WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."
      ),
      i.texParameteri(C, i.TEXTURE_WRAP_S, Dt[_.wrapS]),
      i.texParameteri(C, i.TEXTURE_WRAP_T, Dt[_.wrapT]),
      (C === i.TEXTURE_3D || C === i.TEXTURE_2D_ARRAY) &&
      i.texParameteri(C, i.TEXTURE_WRAP_R, Dt[_.wrapR]),
      i.texParameteri(C, i.TEXTURE_MAG_FILTER, Lt[_.magFilter]),
      i.texParameteri(C, i.TEXTURE_MIN_FILTER, Lt[_.minFilter]),
      _.compareFunction && (
      i.texParameteri(C, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE),
      i.texParameteri(C, i.TEXTURE_COMPARE_FUNC, Se[_.compareFunction])),
      t.has("EXT_texture_filter_anisotropic") === !0)
      {
        if (
        _.magFilter === Ae ||
        _.minFilter !== Wo && _.minFilter !== rs ||
        _.type === Fn && t.has("OES_texture_float_linear") === !1)

        return;
        if (_.anisotropy > 1 || n.get(_).__currentAnisotropy) {
          let V = t.get("EXT_texture_filter_anisotropic");
          i.texParameterf(
            C,
            V.TEXTURE_MAX_ANISOTROPY_EXT,
            Math.min(_.anisotropy, s.getMaxAnisotropy())
          ),
          n.get(_).__currentAnisotropy = _.anisotropy;
        }
      }
    }
    function ue(C, _) {
      let V = !1;
      C.__webglInit === void 0 && (
      C.__webglInit = !0, _.addEventListener("dispose", A));
      let $ = _.source,
        Z = f.get($);
      Z === void 0 && (Z = {}, f.set($, Z));
      let at = X(_);
      if (at !== C.__cacheKey) {
        Z[at] === void 0 && (
        Z[at] = { texture: i.createTexture(), usedTimes: 0 },
        o.memory.textures++,
        V = !0),
        Z[at].usedTimes++;
        let ct = Z[C.__cacheKey];
        ct !== void 0 && (
        Z[C.__cacheKey].usedTimes--, ct.usedTimes === 0 && R(_)),
        C.__cacheKey = at,
        C.__webglTexture = Z[at].texture;
      }
      return V;
    }
    function J(C, _, V) {
      return Math.floor(Math.floor(C / V) / _);
    }
    function it(C, _, V, $) {
      let at = C.updateRanges;
      if (at.length === 0)
      e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, _.width, _.height, V, $, _.data);else
      {
        at.sort((Nt, pt) => Nt.start - pt.start);
        let ct = 0;
        for (let Nt = 1; Nt < at.length; Nt++) {
          let pt = at[ct],
            ut = at[Nt],
            zt = pt.start + pt.count,
            Bt = J(ut.start, _.width, 4),
            Yt = J(pt.start, _.width, 4);
          ut.start <= zt + 1 &&
          Bt === Yt &&
          J(ut.start + ut.count - 1, _.width, 4) === Bt ?
          pt.count = Math.max(pt.count, ut.start + ut.count - pt.start) : (
          ++ct, at[ct] = ut);
        }
        at.length = ct + 1;
        let j = e.getParameter(i.UNPACK_ROW_LENGTH),
          tt = e.getParameter(i.UNPACK_SKIP_PIXELS),
          ht = e.getParameter(i.UNPACK_SKIP_ROWS);
        e.pixelStorei(i.UNPACK_ROW_LENGTH, _.width);
        for (let Nt = 0, pt = at.length; Nt < pt; Nt++) {
          let ut = at[Nt],
            zt = Math.floor(ut.start / 4),
            Bt = Math.ceil(ut.count / 4),
            Yt = zt % _.width,
            F = Math.floor(zt / _.width),
            dt = Bt,
            Q = 1;
          e.pixelStorei(i.UNPACK_SKIP_PIXELS, Yt),
          e.pixelStorei(i.UNPACK_SKIP_ROWS, F),
          e.texSubImage2D(i.TEXTURE_2D, 0, Yt, F, dt, Q, V, $, _.data);
        }
        C.clearUpdateRanges(),
        e.pixelStorei(i.UNPACK_ROW_LENGTH, j),
        e.pixelStorei(i.UNPACK_SKIP_PIXELS, tt),
        e.pixelStorei(i.UNPACK_SKIP_ROWS, ht);
      }
    }
    function Tt(C, _, V) {
      let $ = i.TEXTURE_2D;
      (_.isDataArrayTexture || _.isCompressedArrayTexture) && (
      $ = i.TEXTURE_2D_ARRAY),
      _.isData3DTexture && ($ = i.TEXTURE_3D);
      let Z = ue(C, _),
        at = _.source;
      e.bindTexture($, C.__webglTexture, i.TEXTURE0 + V);
      let ct = n.get(at);
      if (at.version !== ct.__version || Z === !0) {
        if (
        e.activeTexture(i.TEXTURE0 + V),
        (typeof ImageBitmap < "u" && _.image instanceof ImageBitmap) === !1)
        {
          let Q = ie.getPrimaries(ie.workingColorSpace),
            ft = _.colorSpace === Pi ? null : ie.getPrimaries(_.colorSpace),
            vt =
            _.colorSpace === Pi || Q === ft ?
            i.NONE :
            i.BROWSER_DEFAULT_WEBGL;
          e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
          e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
          e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, vt);
        }
        e.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment);
        let tt = g(_.image, !1, s.maxTextureSize);
        tt = hn(_, tt);
        let ht = r.convert(_.format, _.colorSpace),
          Nt = r.convert(_.type),
          pt = y(
            _.internalFormat,
            ht,
            Nt,
            _.normalized,
            _.colorSpace,
            _.isVideoTexture
          );
        oe($, _);
        let ut,
          zt = _.mipmaps,
          Bt = _.isVideoTexture !== !0,
          Yt = ct.__version === void 0 || Z === !0,
          F = at.dataReady,
          dt = M(_, tt);
        if (_.isDepthTexture)
        pt = S(_.format === os, _.type),
        Yt && (
        Bt ?
        e.texStorage2D(i.TEXTURE_2D, 1, pt, tt.width, tt.height) :
        e.texImage2D(
          i.TEXTURE_2D,
          0,
          pt,
          tt.width,
          tt.height,
          0,
          ht,
          Nt,
          null
        ));else
        if (_.isDataTexture) {
          if (zt.length > 0) {
            Bt &&
            Yt &&
            e.texStorage2D(i.TEXTURE_2D, dt, pt, zt[0].width, zt[0].height);
            for (let Q = 0, ft = zt.length; Q < ft; Q++)
            ut = zt[Q],
            Bt ?
            F &&
            e.texSubImage2D(
              i.TEXTURE_2D,
              Q,
              0,
              0,
              ut.width,
              ut.height,
              ht,
              Nt,
              ut.data
            ) :
            e.texImage2D(
              i.TEXTURE_2D,
              Q,
              pt,
              ut.width,
              ut.height,
              0,
              ht,
              Nt,
              ut.data
            );
            _.generateMipmaps = !1;
          } else
          Bt ? (
          Yt &&
          e.texStorage2D(i.TEXTURE_2D, dt, pt, tt.width, tt.height),
          F && it(_, tt, ht, Nt)) :
          e.texImage2D(
            i.TEXTURE_2D,
            0,
            pt,
            tt.width,
            tt.height,
            0,
            ht,
            Nt,
            tt.data
          );} else
        if (_.isCompressedTexture) {
          if (_.isCompressedArrayTexture) {
            Bt &&
            Yt &&
            e.texStorage3D(
              i.TEXTURE_2D_ARRAY,
              dt,
              pt,
              zt[0].width,
              zt[0].height,
              tt.depth
            );
            for (let Q = 0, ft = zt.length; Q < ft; Q++)
            if (ut = zt[Q], _.format !== On) {
              if (ht !== null) {
                if (Bt) {
                  if (F)
                  if (_.layerUpdates.size > 0) {
                    let vt = Nu(ut.width, ut.height, _.format, _.type);
                    for (let rt of _.layerUpdates) {
                      let Ut = ut.data.subarray(
                        rt * vt / ut.data.BYTES_PER_ELEMENT,
                        (rt + 1) * vt / ut.data.BYTES_PER_ELEMENT
                      );
                      e.compressedTexSubImage3D(
                        i.TEXTURE_2D_ARRAY,
                        Q,
                        0,
                        0,
                        rt,
                        ut.width,
                        ut.height,
                        1,
                        ht,
                        Ut
                      );
                    }
                  } else
                  e.compressedTexSubImage3D(
                    i.TEXTURE_2D_ARRAY,
                    Q,
                    0,
                    0,
                    0,
                    ut.width,
                    ut.height,
                    tt.depth,
                    ht,
                    ut.data
                  );
                } else
                e.compressedTexImage3D(
                  i.TEXTURE_2D_ARRAY,
                  Q,
                  pt,
                  ut.width,
                  ut.height,
                  tt.depth,
                  0,
                  ut.data,
                  0,
                  0
                );} else

              Ht(
                "WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
              );} else

            Bt ?
            F &&
            e.texSubImage3D(
              i.TEXTURE_2D_ARRAY,
              Q,
              0,
              0,
              0,
              ut.width,
              ut.height,
              tt.depth,
              ht,
              Nt,
              ut.data
            ) :
            e.texImage3D(
              i.TEXTURE_2D_ARRAY,
              Q,
              pt,
              ut.width,
              ut.height,
              tt.depth,
              0,
              ht,
              Nt,
              ut.data
            );
            _.layerUpdates.size > 0 && _.clearLayerUpdates();
          } else {
            Bt &&
            Yt &&
            e.texStorage2D(i.TEXTURE_2D, dt, pt, zt[0].width, zt[0].height);
            for (let Q = 0, ft = zt.length; Q < ft; Q++)
            ut = zt[Q],
            _.format !== On ?
            ht !== null ?
            Bt ?
            F &&
            e.compressedTexSubImage2D(
              i.TEXTURE_2D,
              Q,
              0,
              0,
              ut.width,
              ut.height,
              ht,
              ut.data
            ) :
            e.compressedTexImage2D(
              i.TEXTURE_2D,
              Q,
              pt,
              ut.width,
              ut.height,
              0,
              ut.data
            ) :
            Ht(
              "WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
            ) :
            Bt ?
            F &&
            e.texSubImage2D(
              i.TEXTURE_2D,
              Q,
              0,
              0,
              ut.width,
              ut.height,
              ht,
              Nt,
              ut.data
            ) :
            e.texImage2D(
              i.TEXTURE_2D,
              Q,
              pt,
              ut.width,
              ut.height,
              0,
              ht,
              Nt,
              ut.data
            );
          }} else
        if (_.isDataArrayTexture) {
          if (Bt) {
            if (
            Yt &&
            e.texStorage3D(
              i.TEXTURE_2D_ARRAY,
              dt,
              pt,
              tt.width,
              tt.height,
              tt.depth
            ),
            F)

            if (_.layerUpdates.size > 0) {
              let Q = Nu(tt.width, tt.height, _.format, _.type);
              for (let ft of _.layerUpdates) {
                let vt = tt.data.subarray(
                  ft * Q / tt.data.BYTES_PER_ELEMENT,
                  (ft + 1) * Q / tt.data.BYTES_PER_ELEMENT
                );
                e.texSubImage3D(
                  i.TEXTURE_2D_ARRAY,
                  0,
                  0,
                  0,
                  ft,
                  tt.width,
                  tt.height,
                  1,
                  ht,
                  Nt,
                  vt
                );
              }
              _.clearLayerUpdates();
            } else
            e.texSubImage3D(
              i.TEXTURE_2D_ARRAY,
              0,
              0,
              0,
              0,
              tt.width,
              tt.height,
              tt.depth,
              ht,
              Nt,
              tt.data
            );
          } else
          e.texImage3D(
            i.TEXTURE_2D_ARRAY,
            0,
            pt,
            tt.width,
            tt.height,
            tt.depth,
            0,
            ht,
            Nt,
            tt.data
          );} else
        if (_.isData3DTexture)
        Bt ? (
        Yt &&
        e.texStorage3D(
          i.TEXTURE_3D,
          dt,
          pt,
          tt.width,
          tt.height,
          tt.depth
        ),
        F &&
        e.texSubImage3D(
          i.TEXTURE_3D,
          0,
          0,
          0,
          0,
          tt.width,
          tt.height,
          tt.depth,
          ht,
          Nt,
          tt.data
        )) :
        e.texImage3D(
          i.TEXTURE_3D,
          0,
          pt,
          tt.width,
          tt.height,
          tt.depth,
          0,
          ht,
          Nt,
          tt.data
        );else
        if (_.isFramebufferTexture) {
          if (Yt)
          if (Bt) e.texStorage2D(i.TEXTURE_2D, dt, pt, tt.width, tt.height);else
          {
            let Q = tt.width,
              ft = tt.height;
            for (let vt = 0; vt < dt; vt++)
            e.texImage2D(i.TEXTURE_2D, vt, pt, Q, ft, 0, ht, Nt, null),
            Q >>= 1,
            ft >>= 1;
          }
        } else if (_.isHTMLTexture) {
          if ("texElementImage2D" in i) {
            let Q = i.canvas;
            if (
            Q.hasAttribute("layoutsubtree") ||
            Q.setAttribute("layoutsubtree", "true"),
            tt.parentNode !== Q)
            {
              Q.appendChild(tt),
              d.add(_),
              Q.onpaint = (ft) => {
                let vt = ft.changedElements;
                for (let rt of d)
                vt.includes(rt.image) && (rt.needsUpdate = !0);
              },
              Q.requestPaint();
              return;
            }
            if (i.texElementImage2D.length === 3)
            i.texElementImage2D(i.TEXTURE_2D, i.RGBA8, tt);else
            {
              let vt = i.RGBA,
                rt = i.RGBA,
                Ut = i.UNSIGNED_BYTE;
              i.texElementImage2D(i.TEXTURE_2D, 0, vt, rt, Ut, tt);
            }
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE);
          }
        } else if (zt.length > 0) {
          if (Bt && Yt) {
            let Q = ge(zt[0]);
            e.texStorage2D(i.TEXTURE_2D, dt, pt, Q.width, Q.height);
          }
          for (let Q = 0, ft = zt.length; Q < ft; Q++)
          ut = zt[Q],
          Bt ?
          F && e.texSubImage2D(i.TEXTURE_2D, Q, 0, 0, ht, Nt, ut) :
          e.texImage2D(i.TEXTURE_2D, Q, pt, ht, Nt, ut);
          _.generateMipmaps = !1;
        } else if (Bt) {
          if (Yt) {
            let Q = ge(tt);
            e.texStorage2D(i.TEXTURE_2D, dt, pt, Q.width, Q.height);
          }
          F && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, ht, Nt, tt);
        } else e.texImage2D(i.TEXTURE_2D, 0, pt, ht, Nt, tt);
        m(_) && b($), ct.__version = at.version, _.onUpdate && _.onUpdate(_);
      }
      C.__version = _.version;
    }
    function Xt(C, _, V) {
      if (_.image.length !== 6) return;
      let $ = ue(C, _),
        Z = _.source;
      e.bindTexture(i.TEXTURE_CUBE_MAP, C.__webglTexture, i.TEXTURE0 + V);
      let at = n.get(Z);
      if (Z.version !== at.__version || $ === !0) {
        e.activeTexture(i.TEXTURE0 + V);
        let ct = ie.getPrimaries(ie.workingColorSpace),
          j = _.colorSpace === Pi ? null : ie.getPrimaries(_.colorSpace),
          tt =
          _.colorSpace === Pi || ct === j ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
        e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
        e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
        e.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment),
        e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, tt);
        let ht = _.isCompressedTexture || _.image[0].isCompressedTexture,
          Nt = _.image[0] && _.image[0].isDataTexture,
          pt = [];
        for (let rt = 0; rt < 6; rt++)
        !ht && !Nt ?
        pt[rt] = g(_.image[rt], !0, s.maxCubemapSize) :
        pt[rt] = Nt ? _.image[rt].image : _.image[rt],
        pt[rt] = hn(_, pt[rt]);
        let ut = pt[0],
          zt = r.convert(_.format, _.colorSpace),
          Bt = r.convert(_.type),
          Yt = y(_.internalFormat, zt, Bt, _.normalized, _.colorSpace),
          F = _.isVideoTexture !== !0,
          dt = at.__version === void 0 || $ === !0,
          Q = Z.dataReady,
          ft = M(_, ut);
        oe(i.TEXTURE_CUBE_MAP, _);
        let vt;
        if (ht) {
          F &&
          dt &&
          e.texStorage2D(i.TEXTURE_CUBE_MAP, ft, Yt, ut.width, ut.height);
          for (let rt = 0; rt < 6; rt++) {
            vt = pt[rt].mipmaps;
            for (let Ut = 0; Ut < vt.length; Ut++) {
              let Ct = vt[Ut];
              _.format !== On ?
              zt !== null ?
              F ?
              Q &&
              e.compressedTexSubImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut,
                0,
                0,
                Ct.width,
                Ct.height,
                zt,
                Ct.data
              ) :
              e.compressedTexImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut,
                Yt,
                Ct.width,
                Ct.height,
                0,
                Ct.data
              ) :
              Ht(
                "WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"
              ) :
              F ?
              Q &&
              e.texSubImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut,
                0,
                0,
                Ct.width,
                Ct.height,
                zt,
                Bt,
                Ct.data
              ) :
              e.texImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut,
                Yt,
                Ct.width,
                Ct.height,
                0,
                zt,
                Bt,
                Ct.data
              );
            }
          }
        } else {
          if (vt = _.mipmaps, F && dt) {
            vt.length > 0 && ft++;
            let rt = ge(pt[0]);
            e.texStorage2D(i.TEXTURE_CUBE_MAP, ft, Yt, rt.width, rt.height);
          }
          for (let rt = 0; rt < 6; rt++)
          if (Nt) {
            F ?
            Q &&
            e.texSubImage2D(
              i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
              0,
              0,
              0,
              pt[rt].width,
              pt[rt].height,
              zt,
              Bt,
              pt[rt].data
            ) :
            e.texImage2D(
              i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
              0,
              Yt,
              pt[rt].width,
              pt[rt].height,
              0,
              zt,
              Bt,
              pt[rt].data
            );
            for (let Ut = 0; Ut < vt.length; Ut++) {
              let Ee = vt[Ut].image[rt].image;
              F ?
              Q &&
              e.texSubImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut + 1,
                0,
                0,
                Ee.width,
                Ee.height,
                zt,
                Bt,
                Ee.data
              ) :
              e.texImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut + 1,
                Yt,
                Ee.width,
                Ee.height,
                0,
                zt,
                Bt,
                Ee.data
              );
            }
          } else {
            F ?
            Q &&
            e.texSubImage2D(
              i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
              0,
              0,
              0,
              zt,
              Bt,
              pt[rt]
            ) :
            e.texImage2D(
              i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
              0,
              Yt,
              zt,
              Bt,
              pt[rt]
            );
            for (let Ut = 0; Ut < vt.length; Ut++) {
              let Ct = vt[Ut];
              F ?
              Q &&
              e.texSubImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut + 1,
                0,
                0,
                zt,
                Bt,
                Ct.image[rt]
              ) :
              e.texImage2D(
                i.TEXTURE_CUBE_MAP_POSITIVE_X + rt,
                Ut + 1,
                Yt,
                zt,
                Bt,
                Ct.image[rt]
              );
            }
          }
        }
        m(_) && b(i.TEXTURE_CUBE_MAP),
        at.__version = Z.version,
        _.onUpdate && _.onUpdate(_);
      }
      C.__version = _.version;
    }
    function bt(C, _, V, $, Z, at) {
      let ct = r.convert(V.format, V.colorSpace),
        j = r.convert(V.type),
        tt = y(V.internalFormat, ct, j, V.normalized, V.colorSpace),
        ht = n.get(_),
        Nt = n.get(V);
      if (Nt.__renderTarget = _, !ht.__hasExternalTextures) {
        let pt = Math.max(1, _.width >> at),
          ut = Math.max(1, _.height >> at);
        Z === i.TEXTURE_3D || Z === i.TEXTURE_2D_ARRAY ?
        e.texImage3D(Z, at, tt, pt, ut, _.depth, 0, ct, j, null) :
        e.texImage2D(Z, at, tt, pt, ut, 0, ct, j, null);
      }
      e.bindFramebuffer(i.FRAMEBUFFER, C),
      $e(_) ?
      a.framebufferTexture2DMultisampleEXT(
        i.FRAMEBUFFER,
        $,
        Z,
        Nt.__webglTexture,
        0,
        Ne(_)
      ) :
      (Z === i.TEXTURE_2D ||
      Z >= i.TEXTURE_CUBE_MAP_POSITIVE_X &&
      Z <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) &&
      i.framebufferTexture2D(i.FRAMEBUFFER, $, Z, Nt.__webglTexture, at),
      e.bindFramebuffer(i.FRAMEBUFFER, null);
    }
    function Qt(C, _, V) {
      if (i.bindRenderbuffer(i.RENDERBUFFER, C), _.depthBuffer) {
        let $ = _.depthTexture,
          Z = $ && $.isDepthTexture ? $.type : null,
          at = S(_.stencilBuffer, Z),
          ct = _.stencilBuffer ?
          i.DEPTH_STENCIL_ATTACHMENT :
          i.DEPTH_ATTACHMENT;
        $e(_) ?
        a.renderbufferStorageMultisampleEXT(
          i.RENDERBUFFER,
          Ne(_),
          at,
          _.width,
          _.height
        ) :
        V ?
        i.renderbufferStorageMultisample(
          i.RENDERBUFFER,
          Ne(_),
          at,
          _.width,
          _.height
        ) :
        i.renderbufferStorage(i.RENDERBUFFER, at, _.width, _.height),
        i.framebufferRenderbuffer(i.FRAMEBUFFER, ct, i.RENDERBUFFER, C);
      } else {
        let $ = _.textures;
        for (let Z = 0; Z < $.length; Z++) {
          let at = $[Z],
            ct = r.convert(at.format, at.colorSpace),
            j = r.convert(at.type),
            tt = y(at.internalFormat, ct, j, at.normalized, at.colorSpace);
          $e(_) ?
          a.renderbufferStorageMultisampleEXT(
            i.RENDERBUFFER,
            Ne(_),
            tt,
            _.width,
            _.height
          ) :
          V ?
          i.renderbufferStorageMultisample(
            i.RENDERBUFFER,
            Ne(_),
            tt,
            _.width,
            _.height
          ) :
          i.renderbufferStorage(i.RENDERBUFFER, tt, _.width, _.height);
        }
      }
      i.bindRenderbuffer(i.RENDERBUFFER, null);
    }
    function Ze(C, _, V) {
      let $ = _.isWebGLCubeRenderTarget === !0;
      if (
      e.bindFramebuffer(i.FRAMEBUFFER, C),
      !(_.depthTexture && _.depthTexture.isDepthTexture))

      throw new Error(
        "THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture."
      );
      let Z = n.get(_.depthTexture);
      if (
      Z.__renderTarget = _,
      (!Z.__webglTexture ||
      _.depthTexture.image.width !== _.width ||
      _.depthTexture.image.height !== _.height) && (
      _.depthTexture.image.width = _.width,
      _.depthTexture.image.height = _.height,
      _.depthTexture.needsUpdate = !0),
      $)
      {
        if (
        Z.__webglInit === void 0 && (
        Z.__webglInit = !0,
        _.depthTexture.addEventListener("dispose", A)),
        Z.__webglTexture === void 0)
        {
          Z.__webglTexture = i.createTexture(),
          e.bindTexture(i.TEXTURE_CUBE_MAP, Z.__webglTexture),
          oe(i.TEXTURE_CUBE_MAP, _.depthTexture);
          let ht = r.convert(_.depthTexture.format),
            Nt = r.convert(_.depthTexture.type),
            pt;
          _.depthTexture.format === ui ?
          pt = i.DEPTH_COMPONENT24 :
          _.depthTexture.format === os && (pt = i.DEPTH24_STENCIL8);
          for (let ut = 0; ut < 6; ut++)
          i.texImage2D(
            i.TEXTURE_CUBE_MAP_POSITIVE_X + ut,
            0,
            pt,
            _.width,
            _.height,
            0,
            ht,
            Nt,
            null
          );
        }
      } else nt(_.depthTexture, 0);
      let at = Z.__webglTexture,
        ct = Ne(_),
        j = $ ? i.TEXTURE_CUBE_MAP_POSITIVE_X + V : i.TEXTURE_2D,
        tt =
        _.depthTexture.format === os ?
        i.DEPTH_STENCIL_ATTACHMENT :
        i.DEPTH_ATTACHMENT;
      if (_.depthTexture.format === ui)
      $e(_) ?
      a.framebufferTexture2DMultisampleEXT(
        i.FRAMEBUFFER,
        tt,
        j,
        at,
        0,
        ct
      ) :
      i.framebufferTexture2D(i.FRAMEBUFFER, tt, j, at, 0);else
      if (_.depthTexture.format === os)
      $e(_) ?
      a.framebufferTexture2DMultisampleEXT(
        i.FRAMEBUFFER,
        tt,
        j,
        at,
        0,
        ct
      ) :
      i.framebufferTexture2D(i.FRAMEBUFFER, tt, j, at, 0);else
      throw new Error("THREE.WebGLTextures: Unknown depthTexture format.");
    }
    function te(C) {
      let _ = n.get(C),
        V = C.isWebGLCubeRenderTarget === !0;
      if (_.__boundDepthTexture !== C.depthTexture) {
        let $ = C.depthTexture;
        if (_.__depthDisposeCallback && _.__depthDisposeCallback(), $) {
          let Z = () => {
            delete _.__boundDepthTexture,
            delete _.__depthDisposeCallback,
            $.removeEventListener("dispose", Z);
          };
          $.addEventListener("dispose", Z), _.__depthDisposeCallback = Z;
        }
        _.__boundDepthTexture = $;
      }
      if (C.depthTexture && !_.__autoAllocateDepthBuffer) {
        if (V) for (let $ = 0; $ < 6; $++) Ze(_.__webglFramebuffer[$], C, $);else
        {
          let $ = C.texture.mipmaps;
          $ && $.length > 0 ?
          Ze(_.__webglFramebuffer[0], C, 0) :
          Ze(_.__webglFramebuffer, C, 0);
        }} else
      if (V) {
        _.__webglDepthbuffer = [];
        for (let $ = 0; $ < 6; $++)
        if (
        e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[$]),
        _.__webglDepthbuffer[$] === void 0)

        _.__webglDepthbuffer[$] = i.createRenderbuffer(),
        Qt(_.__webglDepthbuffer[$], C, !1);else
        {
          let Z = C.stencilBuffer ?
            i.DEPTH_STENCIL_ATTACHMENT :
            i.DEPTH_ATTACHMENT,
            at = _.__webglDepthbuffer[$];
          i.bindRenderbuffer(i.RENDERBUFFER, at),
          i.framebufferRenderbuffer(i.FRAMEBUFFER, Z, i.RENDERBUFFER, at);
        }
      } else {
        let $ = C.texture.mipmaps;
        if (
        $ && $.length > 0 ?
        e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[0]) :
        e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer),
        _.__webglDepthbuffer === void 0)

        _.__webglDepthbuffer = i.createRenderbuffer(),
        Qt(_.__webglDepthbuffer, C, !1);else
        {
          let Z = C.stencilBuffer ?
            i.DEPTH_STENCIL_ATTACHMENT :
            i.DEPTH_ATTACHMENT,
            at = _.__webglDepthbuffer;
          i.bindRenderbuffer(i.RENDERBUFFER, at),
          i.framebufferRenderbuffer(i.FRAMEBUFFER, Z, i.RENDERBUFFER, at);
        }
      }
      e.bindFramebuffer(i.FRAMEBUFFER, null);
    }
    function ce(C, _, V) {
      let $ = n.get(C);
      _ !== void 0 &&
      bt(
        $.__webglFramebuffer,
        C,
        C.texture,
        i.COLOR_ATTACHMENT0,
        i.TEXTURE_2D,
        0
      ),
      V !== void 0 && te(C);
    }
    function we(C) {
      let _ = C.texture,
        V = n.get(C),
        $ = n.get(_);
      C.addEventListener("dispose", v);
      let Z = C.textures,
        at = C.isWebGLCubeRenderTarget === !0,
        ct = Z.length > 1;
      if (
      ct || (
      $.__webglTexture === void 0 && (
      $.__webglTexture = i.createTexture()),
      $.__version = _.version,
      o.memory.textures++),
      at)
      {
        V.__webglFramebuffer = [];
        for (let j = 0; j < 6; j++)
        if (_.mipmaps && _.mipmaps.length > 0) {
          V.__webglFramebuffer[j] = [];
          for (let tt = 0; tt < _.mipmaps.length; tt++)
          V.__webglFramebuffer[j][tt] = i.createFramebuffer();
        } else V.__webglFramebuffer[j] = i.createFramebuffer();
      } else {
        if (_.mipmaps && _.mipmaps.length > 0) {
          V.__webglFramebuffer = [];
          for (let j = 0; j < _.mipmaps.length; j++)
          V.__webglFramebuffer[j] = i.createFramebuffer();
        } else V.__webglFramebuffer = i.createFramebuffer();
        if (ct)
        for (let j = 0, tt = Z.length; j < tt; j++) {
          let ht = n.get(Z[j]);
          ht.__webglTexture === void 0 && (
          ht.__webglTexture = i.createTexture(), o.memory.textures++);
        }
        if (C.samples > 0 && $e(C) === !1) {
          V.__webglMultisampledFramebuffer = i.createFramebuffer(),
          V.__webglColorRenderbuffer = [],
          e.bindFramebuffer(i.FRAMEBUFFER, V.__webglMultisampledFramebuffer);
          for (let j = 0; j < Z.length; j++) {
            let tt = Z[j];
            V.__webglColorRenderbuffer[j] = i.createRenderbuffer(),
            i.bindRenderbuffer(i.RENDERBUFFER, V.__webglColorRenderbuffer[j]);
            let ht = r.convert(tt.format, tt.colorSpace),
              Nt = r.convert(tt.type),
              pt = y(
                tt.internalFormat,
                ht,
                Nt,
                tt.normalized,
                tt.colorSpace,
                C.isXRRenderTarget === !0
              ),
              ut = Ne(C);
            i.renderbufferStorageMultisample(
              i.RENDERBUFFER,
              ut,
              pt,
              C.width,
              C.height
            ),
            i.framebufferRenderbuffer(
              i.FRAMEBUFFER,
              i.COLOR_ATTACHMENT0 + j,
              i.RENDERBUFFER,
              V.__webglColorRenderbuffer[j]
            );
          }
          i.bindRenderbuffer(i.RENDERBUFFER, null),
          C.depthBuffer && (
          V.__webglDepthRenderbuffer = i.createRenderbuffer(),
          Qt(V.__webglDepthRenderbuffer, C, !0)),
          e.bindFramebuffer(i.FRAMEBUFFER, null);
        }
      }
      if (at) {
        e.bindTexture(i.TEXTURE_CUBE_MAP, $.__webglTexture),
        oe(i.TEXTURE_CUBE_MAP, _);
        for (let j = 0; j < 6; j++)
        if (_.mipmaps && _.mipmaps.length > 0)
        for (let tt = 0; tt < _.mipmaps.length; tt++)
        bt(
          V.__webglFramebuffer[j][tt],
          C,
          _,
          i.COLOR_ATTACHMENT0,
          i.TEXTURE_CUBE_MAP_POSITIVE_X + j,
          tt
        );else

        bt(
          V.__webglFramebuffer[j],
          C,
          _,
          i.COLOR_ATTACHMENT0,
          i.TEXTURE_CUBE_MAP_POSITIVE_X + j,
          0
        );
        m(_) && b(i.TEXTURE_CUBE_MAP), e.unbindTexture();
      } else if (ct) {
        for (let j = 0, tt = Z.length; j < tt; j++) {
          let ht = Z[j],
            Nt = n.get(ht),
            pt = i.TEXTURE_2D;
          (C.isWebGL3DRenderTarget || C.isWebGLArrayRenderTarget) && (
          pt = C.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
          e.bindTexture(pt, Nt.__webglTexture),
          oe(pt, ht),
          bt(V.__webglFramebuffer, C, ht, i.COLOR_ATTACHMENT0 + j, pt, 0),
          m(ht) && b(pt);
        }
        e.unbindTexture();
      } else {
        let j = i.TEXTURE_2D;
        if (
        (C.isWebGL3DRenderTarget || C.isWebGLArrayRenderTarget) && (
        j = C.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
        e.bindTexture(j, $.__webglTexture),
        oe(j, _),
        _.mipmaps && _.mipmaps.length > 0)

        for (let tt = 0; tt < _.mipmaps.length; tt++)
        bt(V.__webglFramebuffer[tt], C, _, i.COLOR_ATTACHMENT0, j, tt);else
        bt(V.__webglFramebuffer, C, _, i.COLOR_ATTACHMENT0, j, 0);
        m(_) && b(j), e.unbindTexture();
      }
      C.depthBuffer && te(C);
    }
    function ne(C) {
      let _ = C.textures;
      for (let V = 0, $ = _.length; V < $; V++) {
        let Z = _[V];
        if (m(Z)) {
          let at = T(C),
            ct = n.get(Z).__webglTexture;
          e.bindTexture(at, ct), b(at), e.unbindTexture();
        }
      }
    }
    let Ie = [],
      nn = [];
    function Sn(C) {
      if (C.samples > 0) {
        if ($e(C) === !1) {
          let _ = C.textures,
            V = C.width,
            $ = C.height,
            Z = i.COLOR_BUFFER_BIT,
            at = C.stencilBuffer ?
            i.DEPTH_STENCIL_ATTACHMENT :
            i.DEPTH_ATTACHMENT,
            ct = n.get(C),
            j = _.length > 1;
          if (j)
          for (let ht = 0; ht < _.length; ht++)
          e.bindFramebuffer(
            i.FRAMEBUFFER,
            ct.__webglMultisampledFramebuffer
          ),
          i.framebufferRenderbuffer(
            i.FRAMEBUFFER,
            i.COLOR_ATTACHMENT0 + ht,
            i.RENDERBUFFER,
            null
          ),
          e.bindFramebuffer(i.FRAMEBUFFER, ct.__webglFramebuffer),
          i.framebufferTexture2D(
            i.DRAW_FRAMEBUFFER,
            i.COLOR_ATTACHMENT0 + ht,
            i.TEXTURE_2D,
            null,
            0
          );
          e.bindFramebuffer(
            i.READ_FRAMEBUFFER,
            ct.__webglMultisampledFramebuffer
          );
          let tt = C.texture.mipmaps;
          tt && tt.length > 0 ?
          e.bindFramebuffer(i.DRAW_FRAMEBUFFER, ct.__webglFramebuffer[0]) :
          e.bindFramebuffer(i.DRAW_FRAMEBUFFER, ct.__webglFramebuffer);
          for (let ht = 0; ht < _.length; ht++) {
            if (
            C.resolveDepthBuffer && (
            C.depthBuffer && (Z |= i.DEPTH_BUFFER_BIT),
            C.stencilBuffer &&
            C.resolveStencilBuffer && (
            Z |= i.STENCIL_BUFFER_BIT)),
            j)
            {
              i.framebufferRenderbuffer(
                i.READ_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0,
                i.RENDERBUFFER,
                ct.__webglColorRenderbuffer[ht]
              );
              let Nt = n.get(_[ht]).__webglTexture;
              i.framebufferTexture2D(
                i.DRAW_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0,
                i.TEXTURE_2D,
                Nt,
                0
              );
            }
            i.blitFramebuffer(0, 0, V, $, 0, 0, V, $, Z, i.NEAREST),
            l === !0 && (
            Ie.length = 0,
            nn.length = 0,
            Ie.push(i.COLOR_ATTACHMENT0 + ht),
            C.depthBuffer &&
            C.storeMultisampledDepthBuffer === !1 && (
            Ie.push(at),
            nn.push(at),
            i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, nn)),
            i.invalidateFramebuffer(i.READ_FRAMEBUFFER, Ie));
          }
          if (
          e.bindFramebuffer(i.READ_FRAMEBUFFER, null),
          e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
          j)

          for (let ht = 0; ht < _.length; ht++) {
            e.bindFramebuffer(
              i.FRAMEBUFFER,
              ct.__webglMultisampledFramebuffer
            ),
            i.framebufferRenderbuffer(
              i.FRAMEBUFFER,
              i.COLOR_ATTACHMENT0 + ht,
              i.RENDERBUFFER,
              ct.__webglColorRenderbuffer[ht]
            );
            let Nt = n.get(_[ht]).__webglTexture;
            e.bindFramebuffer(i.FRAMEBUFFER, ct.__webglFramebuffer),
            i.framebufferTexture2D(
              i.DRAW_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0 + ht,
              i.TEXTURE_2D,
              Nt,
              0
            );
          }
          e.bindFramebuffer(
            i.DRAW_FRAMEBUFFER,
            ct.__webglMultisampledFramebuffer
          );
        } else if (
        C.depthBuffer &&
        C.storeMultisampledDepthBuffer === !1 &&
        l)
        {
          let _ = C.stencilBuffer ?
          i.DEPTH_STENCIL_ATTACHMENT :
          i.DEPTH_ATTACHMENT;
          i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [_]);
        }
      }
    }
    function Ne(C) {
      return Math.min(s.maxSamples, C.samples);
    }
    function $e(C) {
      let _ = n.get(C);
      return (
        C.samples > 0 &&
        t.has("WEBGL_multisampled_render_to_texture") === !0 &&
        _.__useRenderToTexture !== !1);

    }
    function O(C) {
      let _ = o.render.frame;
      h.get(C) !== _ && (h.set(C, _), C.update());
    }
    function hn(C, _) {
      let V = C.colorSpace,
        $ = C.format,
        Z = C.type;
      return (
        C.isCompressedTexture === !0 ||
        C.isVideoTexture === !0 ||
        V !== vo &&
        V !== Pi && (
        ie.getTransfer(V) === me ?
        ($ !== On || Z !== Tn) &&
        Ht(
          "WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."
        ) :
        Gt("WebGLTextures: Unsupported texture color space:", V)),
        _);

    }
    function ge(C) {
      return (
        typeof HTMLImageElement < "u" && C instanceof HTMLImageElement ? (
        c.width = C.naturalWidth || C.width,
        c.height = C.naturalHeight || C.height) :
        typeof VideoFrame < "u" && C instanceof VideoFrame ? (
        c.width = C.displayWidth, c.height = C.displayHeight) : (
        c.width = C.width, c.height = C.height),
        c);

    }
    this.allocateTextureUnit = H,
    this.resetTextureUnits = B,
    this.getTextureUnits = D,
    this.setTextureUnits = I,
    this.setTexture2D = nt,
    this.setTexture2DArray = Y,
    this.setTexture3D = K,
    this.setTextureCube = et,
    this.rebindTextures = ce,
    this.setupRenderTarget = we,
    this.updateRenderTargetMipmap = ne,
    this.updateMultisampleRenderTarget = Sn,
    this.setupDepthRenderbuffer = te,
    this.setupFrameBufferTexture = bt,
    this.useMultisampledRTT = $e,
    this.isReversedDepthBuffer = function () {
      return e.buffers.depth.getReversed();
    };
  }
  function Bb(i, t) {
    function e(n, s = Pi) {
      let r,
        o = ie.getTransfer(s);
      if (n === Tn) return i.UNSIGNED_BYTE;
      if (n === Wl) return i.UNSIGNED_SHORT_4_4_4_4;
      if (n === Xl) return i.UNSIGNED_SHORT_5_5_5_1;
      if (n === Tu) return i.UNSIGNED_INT_5_9_9_9_REV;
      if (n === Au) return i.UNSIGNED_INT_10F_11F_11F_REV;
      if (n === wu) return i.BYTE;
      if (n === Eu) return i.SHORT;
      if (n === Ir) return i.UNSIGNED_SHORT;
      if (n === Gl) return i.INT;
      if (n === Ln) return i.UNSIGNED_INT;
      if (n === Fn) return i.FLOAT;
      if (n === Qn) return i.HALF_FLOAT;
      if (n === Ru) return i.ALPHA;
      if (n === ku) return i.RGB;
      if (n === On) return i.RGBA;
      if (n === ui) return i.DEPTH_COMPONENT;
      if (n === os) return i.DEPTH_STENCIL;
      if (n === $l) return i.RED;
      if (n === ql) return i.RED_INTEGER;
      if (n === as) return i.RG;
      if (n === Yl) return i.RG_INTEGER;
      if (n === Zl) return i.RGBA_INTEGER;
      if (n === Xo || n === $o || n === qo || n === Yo)
      if (o === me) {
        if (r = t.get("WEBGL_compressed_texture_s3tc_srgb"), r !== null) {
          if (n === Xo) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === $o) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === qo) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Yo) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else return null;} else
      if (r = t.get("WEBGL_compressed_texture_s3tc"), r !== null) {
        if (n === Xo) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === $o) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === qo) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Yo) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
      if (n === Jl || n === jl || n === Kl || n === Ql)
      if (r = t.get("WEBGL_compressed_texture_pvrtc"), r !== null) {
        if (n === Jl) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === jl) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === Kl) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Ql) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
      if (
      n === tc ||
      n === ec ||
      n === nc ||
      n === ic ||
      n === sc ||
      n === Zo ||
      n === rc)

      if (r = t.get("WEBGL_compressed_texture_etc"), r !== null) {
        if (n === tc || n === ec)
        return o === me ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === nc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC :
        r.COMPRESSED_RGBA8_ETC2_EAC;
        if (n === ic) return r.COMPRESSED_R11_EAC;
        if (n === sc) return r.COMPRESSED_SIGNED_R11_EAC;
        if (n === Zo) return r.COMPRESSED_RG11_EAC;
        if (n === rc) return r.COMPRESSED_SIGNED_RG11_EAC;
      } else return null;
      if (
      n === oc ||
      n === ac ||
      n === lc ||
      n === cc ||
      n === hc ||
      n === uc ||
      n === dc ||
      n === fc ||
      n === pc ||
      n === mc ||
      n === gc ||
      n === xc ||
      n === yc ||
      n === vc)

      if (r = t.get("WEBGL_compressed_texture_astc"), r !== null) {
        if (n === oc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR :
        r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === ac)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR :
        r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === lc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR :
        r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === cc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR :
        r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === hc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR :
        r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === uc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR :
        r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === dc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR :
        r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === fc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR :
        r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === pc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR :
        r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === mc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR :
        r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === gc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR :
        r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === xc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR :
        r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === yc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR :
        r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === vc)
        return o === me ?
        r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR :
        r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
      if (n === _c || n === bc || n === Mc)
      if (r = t.get("EXT_texture_compression_bptc"), r !== null) {
        if (n === _c)
        return o === me ?
        r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT :
        r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === bc) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === Mc) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
      if (n === Sc || n === wc || n === Jo || n === Ec)
      if (r = t.get("EXT_texture_compression_rgtc"), r !== null) {
        if (n === Sc) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === wc) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === Jo) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Ec) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
      return n === Pr ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
    }
    return { convert: e };
  }
  var Hb = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`,
    Vb = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,
    td = class {
      constructor() {
        this.texture = null,
        this.mesh = null,
        this.depthNear = 0,
        this.depthFar = 0;
      }
      init(t, e) {
        if (this.texture === null) {
          let n = new Po(t.texture);
          (t.depthNear !== e.depthNear || t.depthFar !== e.depthFar) && (
          this.depthNear = t.depthNear, this.depthFar = t.depthFar),
          this.texture = n;
        }
      }
      getMesh(t) {
        if (this.texture !== null && this.mesh === null) {
          let e = t.cameras[0].viewport,
            n = new Ke({
              vertexShader: Hb,
              fragmentShader: Vb,
              uniforms: {
                depthColor: { value: this.texture },
                depthWidth: { value: e.z },
                depthHeight: { value: e.w }
              }
            });
          this.mesh = new Et(new As(20, 20), n);
        }
        return this.mesh;
      }
      reset() {
        this.texture = null, this.mesh = null;
      }
      getDepthTexture() {
        return this.texture;
      }
    },
    ed = class extends di {
      constructor(t, e) {
        super();
        let n = this,
          s = null,
          r = 1,
          o = null,
          a = "local-floor",
          l = 1,
          c = null,
          h = null,
          d = null,
          u = null,
          f = null,
          p = null,
          x = typeof XRWebGLBinding < "u",
          g = new td(),
          m = {},
          b = e.getContextAttributes(),
          T = null,
          y = null,
          S = [],
          M = [],
          A = new Vt(),
          v = null,
          E = null,
          R = new ln();
        R.viewport = new De();
        let P = new ln();
        P.viewport = new De();
        let N = [R, P],
          B = new Ul(),
          D = null,
          I = null;
        this.cameraAutoUpdate = !0,
        this.enabled = !1,
        this.isPresenting = !1,
        this.getController = function (J) {
          let it = S[J];
          return (
            it === void 0 && (it = new vr(), S[J] = it),
            it.getTargetRaySpace());

        },
        this.getControllerGrip = function (J) {
          let it = S[J];
          return (
            it === void 0 && (it = new vr(), S[J] = it), it.getGripSpace());

        },
        this.getHand = function (J) {
          let it = S[J];
          return (
            it === void 0 && (it = new vr(), S[J] = it), it.getHandSpace());

        };
        function H(J) {
          let it = M.indexOf(J.inputSource);
          if (it === -1) return;
          let Tt = S[it];
          Tt !== void 0 && (
          Tt.update(J.inputSource, J.frame, c || o),
          Tt.dispatchEvent({ type: J.type, data: J.inputSource }));
        }
        function X() {
          s.removeEventListener("select", H),
          s.removeEventListener("selectstart", H),
          s.removeEventListener("selectend", H),
          s.removeEventListener("squeeze", H),
          s.removeEventListener("squeezestart", H),
          s.removeEventListener("squeezeend", H),
          s.removeEventListener("end", X),
          s.removeEventListener("inputsourceschange", nt);
          for (let J = 0; J < S.length; J++) {
            let it = M[J];
            it !== null && (M[J] = null, S[J].disconnect(it));
          }
          D = null, I = null, g.reset();
          for (let J in m) delete m[J];
          if (
          t.setRenderTarget(T),
          f = null,
          u = null,
          d = null,
          s = null,
          y = null,
          ue.stop(),
          n.isPresenting = !1,
          t.setPixelRatio(v),
          t.setSize(A.width, A.height, !1),
          E !== null)
          {
            let J = E.camera;
            J.fov = E.fov,
            J.zoom = E.zoom,
            J.updateProjectionMatrix(),
            E = null;
          }
          n.dispatchEvent({ type: "sessionend" });
        }
        this.setFramebufferScaleFactor = function (J) {
          r = J,
          n.isPresenting === !0 &&
          Ht(
            "WebXRManager: Cannot change framebuffer scale while presenting."
          );
        },
        this.setReferenceSpaceType = function (J) {
          a = J,
          n.isPresenting === !0 &&
          Ht(
            "WebXRManager: Cannot change reference space type while presenting."
          );
        },
        this.getReferenceSpace = function () {
          return c || o;
        },
        this.setReferenceSpace = function (J) {
          c = J;
        },
        this.getBaseLayer = function () {
          return u !== null ? u : f;
        },
        this.getBinding = function () {
          return d === null && x && (d = new XRWebGLBinding(s, e)), d;
        },
        this.getFrame = function () {
          return p;
        },
        this.getSession = function () {
          return s;
        },
        this.setSession = async function (J) {
          if (s = J, s !== null) {
            if (
            T = t.getRenderTarget(),
            s.addEventListener("select", H),
            s.addEventListener("selectstart", H),
            s.addEventListener("selectend", H),
            s.addEventListener("squeeze", H),
            s.addEventListener("squeezestart", H),
            s.addEventListener("squeezeend", H),
            s.addEventListener("end", X),
            s.addEventListener("inputsourceschange", nt),
            b.xrCompatible !== !0 && (await e.makeXRCompatible()),
            v = t.getPixelRatio(),
            t.getSize(A),
            x && "createProjectionLayer" in XRWebGLBinding.prototype)
            {
              let Tt = null,
                Xt = null,
                bt = null;
              b.depth && (
              bt = b.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24,
              Tt = b.stencil ? os : ui,
              Xt = b.stencil ? Pr : Ln);
              let Qt = {
                colorFormat: e.RGBA8,
                depthFormat: bt,
                scaleFactor: r
              };
              d = this.getBinding(),
              u = d.createProjectionLayer(Qt),
              s.updateRenderState({ layers: [u] }),
              t.setPixelRatio(1),
              t.setSize(u.textureWidth, u.textureHeight, !1),
              y = new gn(u.textureWidth, u.textureHeight, {
                format: On,
                type: Tn,
                depthTexture: new mi(
                  u.textureWidth,
                  u.textureHeight,
                  Xt,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  Tt
                ),
                stencilBuffer: b.stencil,
                colorSpace: t.outputColorSpace,
                samples: b.antialias ? 4 : 0,
                resolveDepthBuffer: u.ignoreDepthValues === !1,
                resolveStencilBuffer: u.ignoreDepthValues === !1,
                storeMultisampledDepthBuffer: u.ignoreDepthValues === !1,
                storeMultisampledStencilBuffer: u.ignoreDepthValues === !1
              });
            } else {
              let Tt = {
                antialias: b.antialias,
                alpha: !0,
                depth: b.depth,
                stencil: b.stencil,
                framebufferScaleFactor: r
              };
              f = new XRWebGLLayer(s, e, Tt),
              s.updateRenderState({ baseLayer: f }),
              t.setPixelRatio(1),
              t.setSize(f.framebufferWidth, f.framebufferHeight, !1),
              y = new gn(f.framebufferWidth, f.framebufferHeight, {
                format: On,
                type: Tn,
                colorSpace: t.outputColorSpace,
                stencilBuffer: b.stencil,
                resolveDepthBuffer: f.ignoreDepthValues === !1,
                resolveStencilBuffer: f.ignoreDepthValues === !1,
                storeMultisampledDepthBuffer: f.ignoreDepthValues === !1,
                storeMultisampledStencilBuffer: f.ignoreDepthValues === !1
              });
            }
            y.isXRRenderTarget = !0,
            this.setFoveation(l),
            c = null,
            o = await s.requestReferenceSpace(a),
            ue.setContext(s),
            ue.start(),
            n.isPresenting = !0,
            n.dispatchEvent({ type: "sessionstart" });
          }
        },
        this.getEnvironmentBlendMode = function () {
          if (s !== null) return s.environmentBlendMode;
        },
        this.getDepthTexture = function () {
          return g.getDepthTexture();
        };
        function nt(J) {
          for (let it = 0; it < J.removed.length; it++) {
            let Tt = J.removed[it],
              Xt = M.indexOf(Tt);
            Xt >= 0 && (M[Xt] = null, S[Xt].disconnect(Tt));
          }
          for (let it = 0; it < J.added.length; it++) {
            let Tt = J.added[it],
              Xt = M.indexOf(Tt);
            if (Xt === -1) {
              for (let Qt = 0; Qt < S.length; Qt++)
              if (Qt >= M.length) {
                M.push(Tt), Xt = Qt;
                break;
              } else if (M[Qt] === null) {
                M[Qt] = Tt, Xt = Qt;
                break;
              }
              if (Xt === -1) break;
            }
            let bt = S[Xt];
            bt && bt.connect(Tt);
          }
        }
        let Y = new z(),
          K = new z();
        function et(J, it, Tt) {
          Y.setFromMatrixPosition(it.matrixWorld),
          K.setFromMatrixPosition(Tt.matrixWorld);
          let Xt = Y.distanceTo(K),
            bt = it.projectionMatrix.elements,
            Qt = Tt.projectionMatrix.elements,
            Ze = bt[14] / (bt[10] - 1),
            te = bt[14] / (bt[10] + 1),
            ce = (bt[9] + 1) / bt[5],
            we = (bt[9] - 1) / bt[5],
            ne = (bt[8] - 1) / bt[0],
            Ie = (Qt[8] + 1) / Qt[0],
            nn = Ze * ne,
            Sn = Ze * Ie,
            Ne = Xt / (-ne + Ie),
            $e = Ne * -ne;
          if (
          it.matrixWorld.decompose(J.position, J.quaternion, J.scale),
          J.translateX($e),
          J.translateZ(Ne),
          J.matrixWorld.compose(J.position, J.quaternion, J.scale),
          J.matrixWorldInverse.copy(J.matrixWorld).invert(),
          bt[10] === -1)

          J.projectionMatrix.copy(it.projectionMatrix),
          J.projectionMatrixInverse.copy(it.projectionMatrixInverse);else
          {
            let O = Ze + Ne,
              hn = te + Ne,
              ge = nn - $e,
              C = Sn + (Xt - $e),
              _ = ce * te / hn * O,
              V = we * te / hn * O;
            J.projectionMatrix.makePerspective(ge, C, _, V, O, hn),
            J.projectionMatrixInverse.copy(J.projectionMatrix).invert();
          }
        }
        function Dt(J, it) {
          it === null ?
          J.matrixWorld.copy(J.matrix) :
          J.matrixWorld.multiplyMatrices(it.matrixWorld, J.matrix),
          J.matrixWorldInverse.copy(J.matrixWorld).invert();
        }
        this.updateCamera = function (J) {
          if (s === null) return;
          let it = J.near,
            Tt = J.far;
          g.texture !== null && (
          g.depthNear > 0 && (it = g.depthNear),
          g.depthFar > 0 && (Tt = g.depthFar)),
          B.near = P.near = R.near = it,
          B.far = P.far = R.far = Tt,
          (D !== B.near || I !== B.far) && (
          s.updateRenderState({ depthNear: B.near, depthFar: B.far }),
          D = B.near,
          I = B.far),
          B.layers.mask = J.layers.mask | 6,
          R.layers.mask = B.layers.mask & -5,
          P.layers.mask = B.layers.mask & -3;
          let Xt = J.parent,
            bt = B.cameras;
          Dt(B, Xt);
          for (let Qt = 0; Qt < bt.length; Qt++) Dt(bt[Qt], Xt);
          bt.length === 2 ?
          et(B, R, P) :
          B.projectionMatrix.copy(R.projectionMatrix),
          E === null &&
          J.isPerspectiveCamera && (
          E = { camera: J, fov: J.fov, zoom: J.zoom }),
          Lt(J, B, Xt);
        };
        function Lt(J, it, Tt) {
          Tt === null ?
          J.matrix.copy(it.matrixWorld) : (
          J.matrix.copy(Tt.matrixWorld),
          J.matrix.invert(),
          J.matrix.multiply(it.matrixWorld)),
          J.matrix.decompose(J.position, J.quaternion, J.scale),
          J.updateMatrixWorld(!0),
          J.projectionMatrix.copy(it.projectionMatrix),
          J.projectionMatrixInverse.copy(it.projectionMatrixInverse),
          J.isPerspectiveCamera && (
          J.fov = ml * 2 * Math.atan(1 / J.projectionMatrix.elements[5]),
          J.zoom = 1);
        }
        this.getCamera = function () {
          return B;
        },
        this.getFoveation = function () {
          if (!(u === null && f === null)) return l;
        },
        this.setFoveation = function (J) {
          l = J,
          u !== null && (u.fixedFoveation = J),
          f !== null &&
          f.fixedFoveation !== void 0 && (
          f.fixedFoveation = J);
        },
        this.hasDepthSensing = function () {
          return g.texture !== null;
        },
        this.getDepthSensingMesh = function () {
          return g.getMesh(B);
        },
        this.getCameraTexture = function (J) {
          return m[J];
        };
        let Se = null;
        function oe(J, it) {
          if (h = it.getViewerPose(c || o), p = it, h !== null) {
            let Tt = h.views;
            f !== null && (
            t.setRenderTargetFramebuffer(y, f.framebuffer),
            t.setRenderTarget(y));
            let Xt = !1;
            Tt.length !== B.cameras.length && (
            B.cameras.length = 0, Xt = !0);
            for (let te = 0; te < Tt.length; te++) {
              let ce = Tt[te],
                we = null;
              if (f !== null) we = f.getViewport(ce);else
              {
                let Ie = d.getViewSubImage(u, ce);
                we = Ie.viewport,
                te === 0 && (
                t.setRenderTargetTextures(
                  y,
                  Ie.colorTexture,
                  Ie.depthStencilTexture
                ),
                t.setRenderTarget(y));
              }
              let ne = N[te];
              ne === void 0 && (
              ne = new ln(),
              ne.layers.enable(te),
              ne.viewport = new De(),
              N[te] = ne),
              ne.matrix.fromArray(ce.transform.matrix),
              ne.matrix.decompose(ne.position, ne.quaternion, ne.scale),
              ne.projectionMatrix.fromArray(ce.projectionMatrix),
              ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),
              ne.viewport.set(we.x, we.y, we.width, we.height),
              te === 0 && (
              B.matrix.copy(ne.matrix),
              B.matrix.decompose(B.position, B.quaternion, B.scale)),
              Xt === !0 && B.cameras.push(ne);
            }
            let bt = s.enabledFeatures;
            if (
            bt &&
            bt.includes("depth-sensing") &&
            s.depthUsage == "gpu-optimized" &&
            x)
            {
              d = n.getBinding();
              let te = d.getDepthInformation(Tt[0]);
              te && te.isValid && te.texture && g.init(te, s.renderState);
            }
            if (bt && bt.includes("camera-access") && x) {
              t.state.unbindTexture(), d = n.getBinding();
              for (let te = 0; te < Tt.length; te++) {
                let ce = Tt[te].camera;
                if (ce) {
                  let we = m[ce];
                  we || (we = new Po(), m[ce] = we);
                  let ne = d.getCameraImage(ce);
                  we.sourceTexture = ne;
                }
              }
            }
          }
          for (let Tt = 0; Tt < S.length; Tt++) {
            let Xt = M[Tt],
              bt = S[Tt];
            Xt !== null && bt !== void 0 && bt.update(Xt, it, c || o);
          }
          Se && Se(J, it),
          it.detectedPlanes &&
          n.dispatchEvent({ type: "planesdetected", data: it }),
          p = null;
        }
        let ue = new lm();
        ue.setAnimationLoop(oe),
        this.setAnimationLoop = function (J) {
          Se = J;
        },
        this.dispose = function () {};
      }
    },
    Gb = new se(),
    pm = new Wt();
  pm.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
  function Wb(i, t) {
    function e(g, m) {
      g.matrixAutoUpdate === !0 && g.updateMatrix(), m.value.copy(g.matrix);
    }
    function n(g, m) {
      m.color.getRGB(g.fogColor.value, Pu(i)),
      m.isFog ? (
      g.fogNear.value = m.near, g.fogFar.value = m.far) :
      m.isFogExp2 && (g.fogDensity.value = m.density);
    }
    function s(g, m, b, T, y) {
      m.isNodeMaterial ?
      m.uniformsNeedUpdate = !1 :
      m.isMeshBasicMaterial ?
      r(g, m) :
      m.isMeshLambertMaterial ? (
      r(g, m),
      m.envMap && (g.envMapIntensity.value = m.envMapIntensity)) :
      m.isMeshToonMaterial ? (
      r(g, m), d(g, m)) :
      m.isMeshPhongMaterial ? (
      r(g, m),
      h(g, m),
      m.envMap && (g.envMapIntensity.value = m.envMapIntensity)) :
      m.isMeshStandardMaterial ? (
      r(g, m), u(g, m), m.isMeshPhysicalMaterial && f(g, m, y)) :
      m.isMeshMatcapMaterial ? (
      r(g, m), p(g, m)) :
      m.isMeshDepthMaterial ?
      r(g, m) :
      m.isMeshDistanceMaterial ? (
      r(g, m), x(g, m)) :
      m.isMeshNormalMaterial ?
      r(g, m) :
      m.isLineBasicMaterial ? (
      o(g, m), m.isLineDashedMaterial && a(g, m)) :
      m.isPointsMaterial ?
      l(g, m, b, T) :
      m.isSpriteMaterial ?
      c(g, m) :
      m.isShadowMaterial ? (
      g.color.value.copy(m.color),
      g.opacity.value = m.opacity) :
      m.isShaderMaterial && (
      m.uniformsNeedUpdate = !1);
    }
    function r(g, m) {
      g.opacity.value = m.opacity,
      m.color && g.diffuse.value.copy(m.color),
      m.emissive &&
      g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),
      m.map && (g.map.value = m.map, e(m.map, g.mapTransform)),
      m.alphaMap && (
      g.alphaMap.value = m.alphaMap, e(m.alphaMap, g.alphaMapTransform)),
      m.bumpMap && (
      g.bumpMap.value = m.bumpMap,
      e(m.bumpMap, g.bumpMapTransform),
      g.bumpScale.value = m.bumpScale,
      m.side === Mn && (g.bumpScale.value *= -1)),
      m.normalMap && (
      g.normalMap.value = m.normalMap,
      e(m.normalMap, g.normalMapTransform),
      g.normalScale.value.copy(m.normalScale),
      m.side === Mn && g.normalScale.value.negate()),
      m.displacementMap && (
      g.displacementMap.value = m.displacementMap,
      e(m.displacementMap, g.displacementMapTransform),
      g.displacementScale.value = m.displacementScale,
      g.displacementBias.value = m.displacementBias),
      m.emissiveMap && (
      g.emissiveMap.value = m.emissiveMap,
      e(m.emissiveMap, g.emissiveMapTransform)),
      m.specularMap && (
      g.specularMap.value = m.specularMap,
      e(m.specularMap, g.specularMapTransform)),
      m.alphaTest > 0 && (g.alphaTest.value = m.alphaTest);
      let b = t.get(m),
        T = b.envMap,
        y = b.envMapRotation;
      T && (
      g.envMap.value = T,
      g.envMapRotation.value.
      setFromMatrix4(Gb.makeRotationFromEuler(y)).
      transpose(),
      T.isCubeTexture &&
      T.isRenderTargetTexture === !1 &&
      g.envMapRotation.value.premultiply(pm),
      g.reflectivity.value = m.reflectivity,
      g.ior.value = m.ior,
      g.refractionRatio.value = m.refractionRatio),
      m.lightMap && (
      g.lightMap.value = m.lightMap,
      g.lightMapIntensity.value = m.lightMapIntensity,
      e(m.lightMap, g.lightMapTransform)),
      m.aoMap && (
      g.aoMap.value = m.aoMap,
      g.aoMapIntensity.value = m.aoMapIntensity,
      e(m.aoMap, g.aoMapTransform));
    }
    function o(g, m) {
      g.diffuse.value.copy(m.color),
      g.opacity.value = m.opacity,
      m.map && (g.map.value = m.map, e(m.map, g.mapTransform));
    }
    function a(g, m) {
      g.dashSize.value = m.dashSize,
      g.totalSize.value = m.dashSize + m.gapSize,
      g.scale.value = m.scale;
    }
    function l(g, m, b, T) {
      g.diffuse.value.copy(m.color),
      g.opacity.value = m.opacity,
      g.size.value = m.size * b,
      g.scale.value = T * 0.5,
      m.map && (g.map.value = m.map, e(m.map, g.uvTransform)),
      m.alphaMap && (
      g.alphaMap.value = m.alphaMap, e(m.alphaMap, g.alphaMapTransform)),
      m.alphaTest > 0 && (g.alphaTest.value = m.alphaTest);
    }
    function c(g, m) {
      g.diffuse.value.copy(m.color),
      g.opacity.value = m.opacity,
      g.rotation.value = m.rotation,
      m.map && (g.map.value = m.map, e(m.map, g.mapTransform)),
      m.alphaMap && (
      g.alphaMap.value = m.alphaMap, e(m.alphaMap, g.alphaMapTransform)),
      m.alphaTest > 0 && (g.alphaTest.value = m.alphaTest);
    }
    function h(g, m) {
      g.specular.value.copy(m.specular),
      g.shininess.value = Math.max(m.shininess, 1e-4);
    }
    function d(g, m) {
      m.gradientMap && (g.gradientMap.value = m.gradientMap);
    }
    function u(g, m) {
      g.metalness.value = m.metalness,
      m.metalnessMap && (
      g.metalnessMap.value = m.metalnessMap,
      e(m.metalnessMap, g.metalnessMapTransform)),
      g.roughness.value = m.roughness,
      m.roughnessMap && (
      g.roughnessMap.value = m.roughnessMap,
      e(m.roughnessMap, g.roughnessMapTransform)),
      m.envMap && (g.envMapIntensity.value = m.envMapIntensity);
    }
    function f(g, m, b) {
      g.ior.value = m.ior,
      m.sheen > 0 && (
      g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),
      g.sheenRoughness.value = m.sheenRoughness,
      m.sheenColorMap && (
      g.sheenColorMap.value = m.sheenColorMap,
      e(m.sheenColorMap, g.sheenColorMapTransform)),
      m.sheenRoughnessMap && (
      g.sheenRoughnessMap.value = m.sheenRoughnessMap,
      e(m.sheenRoughnessMap, g.sheenRoughnessMapTransform))),
      m.clearcoat > 0 && (
      g.clearcoat.value = m.clearcoat,
      g.clearcoatRoughness.value = m.clearcoatRoughness,
      m.clearcoatMap && (
      g.clearcoatMap.value = m.clearcoatMap,
      e(m.clearcoatMap, g.clearcoatMapTransform)),
      m.clearcoatRoughnessMap && (
      g.clearcoatRoughnessMap.value = m.clearcoatRoughnessMap,
      e(m.clearcoatRoughnessMap, g.clearcoatRoughnessMapTransform)),
      m.clearcoatNormalMap && (
      g.clearcoatNormalMap.value = m.clearcoatNormalMap,
      e(m.clearcoatNormalMap, g.clearcoatNormalMapTransform),
      g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),
      m.side === Mn && g.clearcoatNormalScale.value.negate())),
      m.dispersion > 0 && (g.dispersion.value = m.dispersion),
      m.retroreflectivity > 0 && (
      g.retroreflectivity.value = m.retroreflectivity),
      m.iridescence > 0 && (
      g.iridescence.value = m.iridescence,
      g.iridescenceIOR.value = m.iridescenceIOR,
      g.iridescenceThicknessMinimum.value =
      m.iridescenceThicknessRange[0],
      g.iridescenceThicknessMaximum.value =
      m.iridescenceThicknessRange[1],
      m.iridescenceMap && (
      g.iridescenceMap.value = m.iridescenceMap,
      e(m.iridescenceMap, g.iridescenceMapTransform)),
      m.iridescenceThicknessMap && (
      g.iridescenceThicknessMap.value = m.iridescenceThicknessMap,
      e(m.iridescenceThicknessMap, g.iridescenceThicknessMapTransform))),
      m.transmission > 0 && (
      g.transmission.value = m.transmission,
      g.transmissionSamplerMap.value = b.texture,
      g.transmissionSamplerSize.value.set(b.width, b.height),
      m.transmissionMap && (
      g.transmissionMap.value = m.transmissionMap,
      e(m.transmissionMap, g.transmissionMapTransform)),
      g.thickness.value = m.thickness,
      m.thicknessMap && (
      g.thicknessMap.value = m.thicknessMap,
      e(m.thicknessMap, g.thicknessMapTransform)),
      g.attenuationDistance.value = m.attenuationDistance,
      g.attenuationColor.value.copy(m.attenuationColor)),
      m.anisotropy > 0 && (
      g.anisotropyVector.value.set(
        m.anisotropy * Math.cos(m.anisotropyRotation),
        m.anisotropy * Math.sin(m.anisotropyRotation)
      ),
      m.anisotropyMap && (
      g.anisotropyMap.value = m.anisotropyMap,
      e(m.anisotropyMap, g.anisotropyMapTransform))),
      g.specularIntensity.value = m.specularIntensity,
      g.specularColor.value.copy(m.specularColor),
      m.specularColorMap && (
      g.specularColorMap.value = m.specularColorMap,
      e(m.specularColorMap, g.specularColorMapTransform)),
      m.specularIntensityMap && (
      g.specularIntensityMap.value = m.specularIntensityMap,
      e(m.specularIntensityMap, g.specularIntensityMapTransform));
    }
    function p(g, m) {
      m.matcap && (g.matcap.value = m.matcap);
    }
    function x(g, m) {
      let b = t.get(m).light;
      g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),
      g.nearDistance.value = b.shadow.camera.near,
      g.farDistance.value = b.shadow.camera.far;
    }
    return { refreshFogUniforms: n, refreshMaterialUniforms: s };
  }
  function Xb(i, t, e, n) {
    let s = {},
      r = {},
      o = [],
      a = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
    function l(y, S) {
      let M = S.program;
      n.uniformBlockBinding(y, M);
    }
    function c(y, S) {
      let M = s[y.id];
      M === void 0 && (
      g(y), M = h(y), s[y.id] = M, y.addEventListener("dispose", b));
      let A = S.program;
      n.updateUBOMapping(y, A);
      let v = t.render.frame;
      r[y.id] !== v && (u(y), r[y.id] = v);
    }
    function h(y) {
      let S = d();
      y.__bindingPointIndex = S;
      let M = i.createBuffer(),
        A = y.__size,
        v = y.usage;
      return (
        i.bindBuffer(i.UNIFORM_BUFFER, M),
        i.bufferData(i.UNIFORM_BUFFER, A, v),
        i.bindBuffer(i.UNIFORM_BUFFER, null),
        i.bindBufferBase(i.UNIFORM_BUFFER, S, M),
        M);

    }
    function d() {
      for (let y = 0; y < a; y++) if (o.indexOf(y) === -1) return o.push(y), y;
      return (
        Gt(
          "WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."
        ),
        0);

    }
    function u(y) {
      let S = s[y.id],
        M = y.uniforms,
        A = y.__cache;
      i.bindBuffer(i.UNIFORM_BUFFER, S);
      for (let v = 0, E = M.length; v < E; v++) {
        let R = M[v];
        if (Array.isArray(R))
        for (let P = 0, N = R.length; P < N; P++) f(R[P], v, P, A);else
        f(R, v, 0, A);
      }
      i.bindBuffer(i.UNIFORM_BUFFER, null);
    }
    function f(y, S, M, A) {
      if (x(y, S, M, A) === !0) {
        let v = y.__offset,
          E = y.value;
        if (Array.isArray(E)) {
          let R = 0;
          for (let P = 0; P < E.length; P++) {
            let N = E[P],
              B = m(N);
            p(N, y.__data, R),
            typeof N != "number" &&
            typeof N != "boolean" &&
            !N.isMatrix3 &&
            !ArrayBuffer.isView(N) && (
            R += B.storage / Float32Array.BYTES_PER_ELEMENT);
          }
        } else p(E, y.__data, 0);
        i.bufferSubData(i.UNIFORM_BUFFER, v, y.__data);
      }
    }
    function p(y, S, M) {
      typeof y == "number" || typeof y == "boolean" ?
      S[0] = y :
      y.isMatrix3 ? (
      S[0] = y.elements[0],
      S[1] = y.elements[1],
      S[2] = y.elements[2],
      S[3] = 0,
      S[4] = y.elements[3],
      S[5] = y.elements[4],
      S[6] = y.elements[5],
      S[7] = 0,
      S[8] = y.elements[6],
      S[9] = y.elements[7],
      S[10] = y.elements[8],
      S[11] = 0) :
      ArrayBuffer.isView(y) ?
      S.set(new y.constructor(y.buffer, y.byteOffset, S.length)) :
      y.toArray(S, M);
    }
    function x(y, S, M, A) {
      let v = y.value,
        E = S + "_" + M;
      if (A[E] === void 0)
      return (
        typeof v == "number" || typeof v == "boolean" ?
        A[E] = v :
        ArrayBuffer.isView(v) ?
        A[E] = v.slice() :
        A[E] = v.clone(),
        !0);

      {
        let R = A[E];
        if (typeof v == "number" || typeof v == "boolean") {
          if (R !== v) return A[E] = v, !0;
        } else {
          if (ArrayBuffer.isView(v)) return !0;
          if (R.equals(v) === !1) return R.copy(v), !0;
        }
      }
      return !1;
    }
    function g(y) {
      let S = y.uniforms,
        M = 0,
        A = 16;
      for (let E = 0, R = S.length; E < R; E++) {
        let P = Array.isArray(S[E]) ? S[E] : [S[E]];
        for (let N = 0, B = P.length; N < B; N++) {
          let D = P[N],
            I = Array.isArray(D.value) ? D.value : [D.value];
          for (let H = 0, X = I.length; H < X; H++) {
            let nt = I[H],
              Y = m(nt),
              K = M % A,
              et = K % Y.boundary,
              Dt = K + et;
            M += et,
            Dt !== 0 && A - Dt < Y.storage && (M += A - Dt),
            D.__data = new Float32Array(
              Y.storage / Float32Array.BYTES_PER_ELEMENT
            ),
            D.__offset = M,
            M += Y.storage;
          }
        }
      }
      let v = M % A;
      return v > 0 && (M += A - v), y.__size = M, y.__cache = {}, this;
    }
    function m(y) {
      let S = { boundary: 0, storage: 0 };
      return (
        typeof y == "number" || typeof y == "boolean" ? (
        S.boundary = 4, S.storage = 4) :
        y.isVector2 ? (
        S.boundary = 8, S.storage = 8) :
        y.isVector3 || y.isColor ? (
        S.boundary = 16, S.storage = 12) :
        y.isVector4 ? (
        S.boundary = 16, S.storage = 16) :
        y.isMatrix3 ? (
        S.boundary = 48, S.storage = 48) :
        y.isMatrix4 ? (
        S.boundary = 64, S.storage = 64) :
        y.isTexture ?
        Ht(
          "WebGLRenderer: Texture samplers can not be part of an uniforms group."
        ) :
        ArrayBuffer.isView(y) ? (
        S.boundary = 16, S.storage = y.byteLength) :
        Ht(
          "WebGLRenderer: Unsupported uniform value type.",
          y
        ),
        S);

    }
    function b(y) {
      let S = y.target;
      S.removeEventListener("dispose", b);
      let M = o.indexOf(S.__bindingPointIndex);
      o.splice(M, 1), i.deleteBuffer(s[S.id]), delete s[S.id], delete r[S.id];
    }
    function T() {
      for (let y in s) i.deleteBuffer(s[y]);
      o = [], s = {}, r = {};
    }
    return { bind: l, update: c, dispose: T };
  }
  var $b = new Uint16Array([
    12469, 15057, 12620, 14925, 13266, 14620, 13807, 14376, 14323, 13990,
    14545, 13625, 14713, 13328, 14840, 12882, 14931, 12528, 14996, 12233,
    15039, 11829, 15066, 11525, 15080, 11295, 15085, 10976, 15082, 10705,
    15073, 10495, 13880, 14564, 13898, 14542, 13977, 14430, 14158, 14124,
    14393, 13732, 14556, 13410, 14702, 12996, 14814, 12596, 14891, 12291,
    14937, 11834, 14957, 11489, 14958, 11194, 14943, 10803, 14921, 10506,
    14893, 10278, 14858, 9960, 14484, 14039, 14487, 14025, 14499, 13941,
    14524, 13740, 14574, 13468, 14654, 13106, 14743, 12678, 14818, 12344,
    14867, 11893, 14889, 11509, 14893, 11180, 14881, 10751, 14852, 10428,
    14812, 10128, 14765, 9754, 14712, 9466, 14764, 13480, 14764, 13475, 14766,
    13440, 14766, 13347, 14769, 13070, 14786, 12713, 14816, 12387, 14844,
    11957, 14860, 11549, 14868, 11215, 14855, 10751, 14825, 10403, 14782,
    10044, 14729, 9651, 14666, 9352, 14599, 9029, 14967, 12835, 14966, 12831,
    14963, 12804, 14954, 12723, 14936, 12564, 14917, 12347, 14900, 11958,
    14886, 11569, 14878, 11247, 14859, 10765, 14828, 10401, 14784, 10011,
    14727, 9600, 14660, 9289, 14586, 8893, 14508, 8533, 15111, 12234, 15110,
    12234, 15104, 12216, 15092, 12156, 15067, 12010, 15028, 11776, 14981,
    11500, 14942, 11205, 14902, 10752, 14861, 10393, 14812, 9991, 14752, 9570,
    14682, 9252, 14603, 8808, 14519, 8445, 14431, 8145, 15209, 11449, 15208,
    11451, 15202, 11451, 15190, 11438, 15163, 11384, 15117, 11274, 15055,
    10979, 14994, 10648, 14932, 10343, 14871, 9936, 14803, 9532, 14729, 9218,
    14645, 8742, 14556, 8381, 14461, 8020, 14365, 7603, 15273, 10603, 15272,
    10607, 15267, 10619, 15256, 10631, 15231, 10614, 15182, 10535, 15118,
    10389, 15042, 10167, 14963, 9787, 14883, 9447, 14800, 9115, 14710, 8665,
    14615, 8318, 14514, 7911, 14411, 7507, 14279, 7198, 15314, 9675, 15313,
    9683, 15309, 9712, 15298, 9759, 15277, 9797, 15229, 9773, 15166, 9668,
    15084, 9487, 14995, 9274, 14898, 8910, 14800, 8539, 14697, 8234, 14590,
    7790, 14479, 7409, 14367, 7067, 14178, 6621, 15337, 8619, 15337, 8631,
    15333, 8677, 15325, 8769, 15305, 8871, 15264, 8940, 15202, 8909, 15119,
    8775, 15022, 8565, 14916, 8328, 14804, 8009, 14688, 7614, 14569, 7287,
    14448, 6888, 14321, 6483, 14088, 6171, 15350, 7402, 15350, 7419, 15347,
    7480, 15340, 7613, 15322, 7804, 15287, 7973, 15229, 8057, 15148, 8012,
    15046, 7846, 14933, 7611, 14810, 7357, 14682, 7069, 14552, 6656, 14421,
    6316, 14251, 5948, 14007, 5528, 15356, 5942, 15356, 5977, 15353, 6119,
    15348, 6294, 15332, 6551, 15302, 6824, 15249, 7044, 15171, 7122, 15070,
    7050, 14949, 6861, 14818, 6611, 14679, 6349, 14538, 6067, 14398, 5651,
    14189, 5311, 13935, 4958, 15359, 4123, 15359, 4153, 15356, 4296, 15353,
    4646, 15338, 5160, 15311, 5508, 15263, 5829, 15188, 6042, 15088, 6094,
    14966, 6001, 14826, 5796, 14678, 5543, 14527, 5287, 14377, 4985, 14133,
    4586, 13869, 4257, 15360, 1563, 15360, 1642, 15358, 2076, 15354, 2636,
    15341, 3350, 15317, 4019, 15273, 4429, 15203, 4732, 15105, 4911, 14981,
    4932, 14836, 4818, 14679, 4621, 14517, 4386, 14359, 4156, 14083, 3795,
    13808, 3437, 15360, 122, 15360, 137, 15358, 285, 15355, 636, 15344, 1274,
    15322, 2177, 15281, 2765, 15215, 3223, 15120, 3451, 14995, 3569, 14846,
    3567, 14681, 3466, 14511, 3305, 14344, 3121, 14037, 2800, 13753, 2467,
    15360, 0, 15360, 1, 15359, 21, 15355, 89, 15346, 253, 15325, 479, 15287,
    796, 15225, 1148, 15133, 1492, 15008, 1749, 14856, 1882, 14685, 1886,
    14506, 1783, 14324, 1608, 13996, 1398, 13702, 1183]
    ),
    yi = null;
  function qb() {
    return (
      yi === null && (
      yi = new Ro($b, 16, 16, as, Qn),
      yi.name = "DFG_LUT",
      yi.minFilter = cn,
      yi.magFilter = cn,
      yi.wrapS = hi,
      yi.wrapT = hi,
      yi.generateMipmaps = !1,
      yi.needsUpdate = !0),
      yi);

  }
  var Lc = class {
    constructor(t = {}) {
      let {
        canvas: e = Pp(),
        context: n = null,
        depth: s = !0,
        stencil: r = !1,
        alpha: o = !1,
        antialias: a = !1,
        premultipliedAlpha: l = !0,
        preserveDrawingBuffer: c = !1,
        powerPreference: h = "default",
        failIfMajorPerformanceCaveat: d = !1,
        reversedDepthBuffer: u = !1,
        outputBufferType: f = Tn
      } = t;
      this.isWebGLRenderer = !0;
      let p;
      if (n !== null) {
        if (
        typeof WebGLRenderingContext < "u" &&
        n instanceof WebGLRenderingContext)

        throw new Error(
          "THREE.WebGLRenderer: WebGL 1 is not supported since r163."
        );
        p = n.getContextAttributes().alpha;
      } else p = o;
      let x = f,
        g = new Set([Zl, Yl, ql]),
        m = new Set([Tn, Ln, Ir, Pr, Wl, Xl]),
        b = new Uint32Array(4),
        T = new Int32Array(4),
        y = new z(),
        S = null,
        M = null,
        A = [],
        v = [],
        E = null;
      this.domElement = e,
      this.debug = {
        checkShaderErrors: !0,
        diagnostics: { keywords: !1 },
        onShaderError: null
      },
      this.autoClear = !0,
      this.autoClearColor = !0,
      this.autoClearDepth = !0,
      this.autoClearStencil = !0,
      this.sortObjects = !0,
      this.clippingPlanes = [],
      this.localClippingEnabled = !1,
      this.toneMapping = Kn,
      this.toneMappingExposure = 1,
      this.transmissionResolutionScale = 1;
      let R = this,
        P = !1,
        N = null,
        B = null,
        D = null,
        I = null;
      this._outputColorSpace = rn;
      let H = 0,
        X = 0,
        nt = null,
        Y = -1,
        K = null,
        et = new De(),
        Dt = new De(),
        Lt = null,
        Se = new wt(0),
        oe = 0,
        ue = e.width,
        J = e.height,
        it = 1,
        Tt = null,
        Xt = null,
        bt = new De(0, 0, ue, J),
        Qt = new De(0, 0, ue, J),
        Ze = !1,
        te = new Sr(),
        ce = !1,
        we = !1,
        ne = new se(),
        Ie = new z(),
        nn = new De(),
        Sn = {
          background: null,
          fog: null,
          environment: null,
          overrideMaterial: null,
          isScene: !0
        },
        Ne = !1;
      function $e() {
        return nt === null ? it : 1;
      }
      let O = n;
      function hn(w, U) {
        return e.getContext(w, U);
      }
      let ge,
        C,
        _,
        V,
        $,
        Z,
        at,
        ct,
        j,
        tt,
        ht,
        Nt,
        pt,
        ut,
        zt,
        Bt,
        Yt,
        F,
        dt,
        Q,
        ft,
        vt,
        rt;
      try {
        let w = {
          alpha: !0,
          depth: s,
          stencil: r,
          antialias: a,
          premultipliedAlpha: l,
          preserveDrawingBuffer: c,
          powerPreference: h,
          failIfMajorPerformanceCaveat: d
        };
        if (
        "setAttribute" in e &&
        e.setAttribute("data-engine", `three.js r${"186"}`),
        e.addEventListener("webglcontextlost", Ee, !1),
        e.addEventListener("webglcontextrestored", fe, !1),
        e.addEventListener("webglcontextcreationerror", Hn, !1),
        O === null)
        {
          let U = "webgl2";
          if (O = hn(U, w), O === null)
          throw hn(U) ?
          new Error(
            "THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."
          ) :
          new Error("THREE.WebGLRenderer: Error creating WebGL context.");
        }
        Ut();
      } catch (w) {
        throw (
          e.removeEventListener("webglcontextlost", Ee, !1),
          e.removeEventListener("webglcontextrestored", fe, !1),
          e.removeEventListener("webglcontextcreationerror", Hn, !1),
          Gt("WebGLRenderer: " + w.message),
          w);

      }
      function Ut() {
        ge = new t_(O),
        ge.init(),
        ft = new Bb(O, ge),
        C = new Wv(O, ge, t, ft),
        _ = new Fb(O, ge),
        C.reversedDepthBuffer && u && _.buffers.depth.setReversed(!0),
        B = O.createFramebuffer(),
        D = O.createFramebuffer(),
        I = O.createFramebuffer(),
        V = new i_(O),
        $ = new wb(),
        Z = new Ob(O, ge, _, $, C, ft, V),
        at = new Qv(R),
        ct = new rx(O),
        vt = new Vv(O, ct),
        j = new e_(O, ct, V, vt),
        tt = new r_(O, j, ct, vt, V),
        F = new s_(O, C, Z),
        zt = new Xv($),
        ht = new Sb(R, at, ge, C, vt, zt),
        Nt = new Wb(R, $),
        pt = new Tb(),
        ut = new Pb(ge),
        Yt = new Hv(R, at, _, tt, p, l),
        Bt = new Ub(R, tt, C),
        rt = new Xb(O, V, C, _),
        dt = new Gv(O, ge, V),
        Q = new n_(O, ge, V),
        V.programs = ht.programs,
        R.capabilities = C,
        R.extensions = ge,
        R.properties = $,
        R.renderLists = pt,
        R.shadowMap = Bt,
        R.state = _,
        R.info = V;
      }
      x !== Tn && (E = new a_(x, e.width, e.height, a, s, r));
      let Ct = new ed(R, O);
      this.xr = Ct,
      this.getContext = function () {
        return O;
      },
      this.getContextAttributes = function () {
        return O.getContextAttributes();
      },
      this.forceContextLoss = function () {
        let w = ge.get("WEBGL_lose_context");
        w && w.loseContext();
      },
      this.forceContextRestore = function () {
        let w = ge.get("WEBGL_lose_context");
        w && w.restoreContext();
      },
      this.getPixelRatio = function () {
        return it;
      },
      this.setPixelRatio = function (w) {
        w !== void 0 && (it = w, this.setSize(ue, J, !1));
      },
      this.getSize = function (w) {
        return w.set(ue, J);
      },
      this.setSize = function (w, U, q = !0) {
        if (Ct.isPresenting) {
          Ht(
            "WebGLRenderer: Can't change size while VR device is presenting."
          );
          return;
        }
        ue = w,
        J = U,
        e.width = Math.floor(w * it),
        e.height = Math.floor(U * it),
        q === !0 && (
        e.style.width = w + "px", e.style.height = U + "px"),
        E !== null && E.setSize(e.width, e.height),
        this.setViewport(0, 0, w, U);
      },
      this.getDrawingBufferSize = function (w) {
        return w.set(ue * it, J * it).floor();
      },
      this.setDrawingBufferSize = function (w, U, q) {
        ue = w,
        J = U,
        it = q,
        e.width = Math.floor(w * q),
        e.height = Math.floor(U * q),
        this.setViewport(0, 0, w, U);
      },
      this.setEffects = function (w) {
        if (x === Tn) {
          Gt(
            "WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType."
          );
          return;
        }
        if (w) {
          for (let U = 0; U < w.length; U++)
          if (w[U].isOutputPass === !0) {
            Ht(
              "WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically."
            );
            break;
          }
        }
        E.setEffects(w || []);
      },
      this.getCurrentViewport = function (w) {
        return w.copy(et);
      },
      this.getViewport = function (w) {
        return w.copy(bt);
      },
      this.setViewport = function (w, U, q, G) {
        w.isVector4 ? bt.set(w.x, w.y, w.z, w.w) : bt.set(w, U, q, G),
        _.viewport(et.copy(bt).multiplyScalar(it).round());
      },
      this.getScissor = function (w) {
        return w.copy(Qt);
      },
      this.setScissor = function (w, U, q, G) {
        w.isVector4 ? Qt.set(w.x, w.y, w.z, w.w) : Qt.set(w, U, q, G),
        _.scissor(Dt.copy(Qt).multiplyScalar(it).round());
      },
      this.getScissorTest = function () {
        return Ze;
      },
      this.setScissorTest = function (w) {
        _.setScissorTest(Ze = w);
      },
      this.setOpaqueSort = function (w) {
        Tt = w;
      },
      this.setTransparentSort = function (w) {
        Xt = w;
      },
      this.getClearColor = function (w) {
        return w.copy(Yt.getClearColor());
      },
      this.setClearColor = function () {
        Yt.setClearColor(...arguments);
      },
      this.getClearAlpha = function () {
        return Yt.getClearAlpha();
      },
      this.setClearAlpha = function () {
        Yt.setClearAlpha(...arguments);
      },
      this.clear = function (w = !0, U = !0, q = !0) {
        let G = 0;
        if (w) {
          let W = !1;
          if (nt !== null) {
            let xt = nt.texture.format;
            W = g.has(xt);
          }
          if (W) {
            let xt = nt.texture.type,
              Mt = m.has(xt),
              gt = Yt.getClearColor(),
              Rt = Yt.getClearAlpha(),
              Pt = gt.r,
              Jt = gt.g,
              ee = gt.b;
            Mt ? (
            b[0] = Pt,
            b[1] = Jt,
            b[2] = ee,
            b[3] = Rt,
            O.clearBufferuiv(O.COLOR, 0, b)) : (
            T[0] = Pt,
            T[1] = Jt,
            T[2] = ee,
            T[3] = Rt,
            O.clearBufferiv(O.COLOR, 0, T));
          } else G |= O.COLOR_BUFFER_BIT;
        }
        U && (
        G |= O.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)),
        q && (
        G |= O.STENCIL_BUFFER_BIT,
        this.state.buffers.stencil.setMask(4294967295)),
        G !== 0 && O.clear(G);
      },
      this.clearColor = function () {
        this.clear(!0, !1, !1);
      },
      this.clearDepth = function () {
        this.clear(!1, !0, !1);
      },
      this.clearStencil = function () {
        this.clear(!1, !1, !0);
      },
      this.setNodesHandler = function (w) {
        w.setRenderer(this), N = w;
      },
      this.dispose = function () {
        e.removeEventListener("webglcontextlost", Ee, !1),
        e.removeEventListener("webglcontextrestored", fe, !1),
        e.removeEventListener("webglcontextcreationerror", Hn, !1),
        Yt.dispose(),
        pt.dispose(),
        ut.dispose(),
        $.dispose(),
        at.dispose(),
        tt.dispose(),
        vt.dispose(),
        rt.dispose(),
        ht.dispose(),
        Ct.dispose(),
        Ct.removeEventListener("sessionstart", md),
        Ct.removeEventListener("sessionend", gd),
        hs.stop();
      };
      function Ee(w) {
        w.preventDefault(), Mo("WebGLRenderer: Context Lost."), P = !0;
      }
      function fe() {
        Mo("WebGLRenderer: Context Restored."), P = !1;
        let w = V.autoReset,
          U = Bt.enabled,
          q = Bt.autoUpdate,
          G = Bt.needsUpdate,
          W = Bt.type;
        Ut(),
        V.autoReset = w,
        Bt.enabled = U,
        Bt.autoUpdate = q,
        Bt.needsUpdate = G,
        Bt.type = W;
      }
      function Hn(w) {
        Gt(
          "WebGLRenderer: A WebGL context could not be created. Reason: ",
          w.statusMessage
        );
      }
      function ei(w) {
        let U = w.target;
        U.removeEventListener("dispose", ei), Um(U);
      }
      function Um(w) {
        Fm(w), $.remove(w);
      }
      function Fm(w) {
        let U = $.get(w).programs;
        U !== void 0 && (
        U.forEach(function (q) {
          ht.releaseProgram(q);
        }),
        w.isShaderMaterial && ht.releaseShaderCache(w));
      }
      this.renderBufferDirect = function (w, U, q, G, W, xt) {
        U === null && (U = Sn);
        let Mt = W.isMesh && W.matrixWorld.determinantAffine() < 0,
          gt = Hm(w, U, q, G, W);
        _.setMaterial(G, Mt);
        let Rt = q.index,
          Pt = 1;
        if (G.wireframe === !0) {
          if (Rt = j.getWireframeAttribute(q), Rt === void 0) return;
          Pt = 2;
        }
        let Jt = q.drawRange,
          ee = q.attributes.position,
          kt = Jt.start * Pt,
          pe = (Jt.start + Jt.count) * Pt;
        xt !== null && (
        kt = Math.max(kt, xt.start * Pt),
        pe = Math.min(pe, (xt.start + xt.count) * Pt)),
        Rt !== null ? (
        kt = Math.max(kt, 0), pe = Math.min(pe, Rt.count)) :
        ee != null && (
        kt = Math.max(kt, 0), pe = Math.min(pe, ee.count));
        let qe = pe - kt;
        if (qe < 0 || qe === 1 / 0) return;
        vt.setup(W, G, gt, q, Rt);
        let Re,
          be = dt;
        if (
        Rt !== null && (Re = ct.get(Rt), be = Q, be.setIndex(Re)),
        W.isMesh)

        G.wireframe === !0 ? (
        _.setLineWidth(G.wireframeLinewidth * $e()), be.setMode(O.LINES)) :
        be.setMode(O.TRIANGLES);else
        if (W.isLine) {
          let un = G.linewidth;
          un === void 0 && (un = 1),
          _.setLineWidth(un * $e()),
          W.isLineSegments ?
          be.setMode(O.LINES) :
          W.isLineLoop ?
          be.setMode(O.LINE_LOOP) :
          be.setMode(O.LINE_STRIP);
        } else
        W.isPoints ?
        be.setMode(O.POINTS) :
        W.isSprite && be.setMode(O.TRIANGLES);
        if (W.isBatchedMesh) {
          if (ge.get("WEBGL_multi_draw"))
          be.renderMultiDraw(
            W._multiDrawStarts,
            W._multiDrawCounts,
            W._multiDrawCount
          );else
          {
            let un = W._multiDrawStarts,
              _t = W._multiDrawCounts,
              yn = W._multiDrawCount,
              le = Rt ? ct.get(Rt).bytesPerElement : 1,
              Dn = $.get(G).currentProgram.getUniforms();
            for (let ni = 0; ni < yn; ni++)
            Dn.setValue(O, "_gl_DrawID", ni), be.render(un[ni] / le, _t[ni]);
          }} else
        if (W.isInstancedMesh) be.renderInstances(kt, qe, W.count);else
        if (q.isInstancedBufferGeometry) {
          let un = q._maxInstanceCount !== void 0 ? q._maxInstanceCount : 1 / 0,
            _t = Math.min(q.instanceCount, un);
          be.renderInstances(kt, qe, _t);
        } else be.render(kt, qe);
      };
      function pd(w, U, q, G) {
        N !== null && w.isNodeMaterial && N.setObject(G, w),
        ce === !0 && zt.setState(w, q, !1),
        w.transparent === !0 && w.side === gi && w.forceSinglePass === !1 ? (
        w.side = Mn,
        w.needsUpdate = !0,
        sa(w, U, G),
        w.side = is,
        w.needsUpdate = !0,
        sa(w, U, G),
        w.side = gi) :
        sa(w, U, G);
      }
      this.compile = function (w, U, q = null) {
        q === null && (q = w),
        N !== null && N.renderStart(w, U, q),
        M = ut.get(q),
        M.init(U),
        v.push(M),
        q.traverseVisible(function (W) {
          W.isLight &&
          W.layers.test(U.layers) && (
          M.pushLight(W), W.castShadow && M.pushShadow(W));
        }),
        w !== q &&
        w.traverseVisible(function (W) {
          W.isLight &&
          W.layers.test(U.layers) && (
          M.pushLight(W), W.castShadow && M.pushShadow(W));
        }),
        M.setupLights(),
        N !== null && N.updateLights(M.state.lightsArray),
        we = this.localClippingEnabled,
        ce = zt.init(this.clippingPlanes, we),
        ce === !0 && zt.setGlobalState(this.clippingPlanes, U),
        N !== null && Bt.render(M.state.shadowsArray, q, U);
        let G = new Set();
        return (
          w.traverse(function (W) {
            if (!(W.isMesh || W.isPoints || W.isLine || W.isSprite)) return;
            let xt = W.material;
            if (xt)
            if (Array.isArray(xt))
            for (let Mt = 0; Mt < xt.length; Mt++) {
              let gt = xt[Mt];
              pd(gt, q, U, W), G.add(gt);
            } else
            pd(xt, q, U, W), G.add(xt);
          }),
          M = v.pop(),
          N !== null && N.renderEnd(),
          G);

      },
      this.compileAsync = function (w, U, q = null) {
        let G = this.compile(w, U, q);
        return new Promise((W) => {
          function xt() {
            if (
            G.forEach(function (Mt) {
              let Rt = $.get(Mt).currentProgram;
              (Rt === void 0 || Rt.isReady()) && G.delete(Mt);
            }),
            G.size === 0)
            {
              W(w);
              return;
            }
            setTimeout(xt, 10);
          }
          ge.get("KHR_parallel_shader_compile") !== null ?
          xt() :
          setTimeout(xt, 10);
        });
      };
      let Jc = null;
      function Om(w) {
        Jc && Jc(w);
      }
      function md() {
        hs.stop();
      }
      function gd() {
        hs.start();
      }
      let hs = new lm();
      hs.setAnimationLoop(Om),
      typeof self < "u" && hs.setContext(self),
      this.setAnimationLoop = function (w) {
        Jc = w, Ct.setAnimationLoop(w), w === null ? hs.stop() : hs.start();
      },
      Ct.addEventListener("sessionstart", md),
      Ct.addEventListener("sessionend", gd),
      this.render = function (w, U) {
        if (U !== void 0 && U.isCamera !== !0) {
          Gt(
            "WebGLRenderer.render: camera is not an instance of THREE.Camera."
          );
          return;
        }
        if (P === !0) return;
        N !== null && N.renderStart(w, U);
        let q = Ct.enabled === !0 && Ct.isPresenting === !0,
          G = E !== null && (nt === null || q) && E.begin(R, nt);
        if (
        w.matrixWorldAutoUpdate === !0 && w.updateMatrixWorld(),
        U.parent === null &&
        U.matrixWorldAutoUpdate === !0 &&
        U.updateMatrixWorld(),
        Ct.enabled === !0 &&
        Ct.isPresenting === !0 && (
        E === null || E.isCompositing() === !1) && (
        Ct.cameraAutoUpdate === !0 && Ct.updateCamera(U),
        U = Ct.getCamera()),
        w.isScene === !0 && w.onBeforeRender(R, w, U, nt),
        M = ut.get(w, v.length),
        M.init(U),
        M.state.textureUnits = Z.getTextureUnits(),
        v.push(M),
        ne.multiplyMatrices(U.projectionMatrix, U.matrixWorldInverse),
        te.setFromProjectionMatrix(ne, Zn, U.reversedDepth),
        we = this.localClippingEnabled,
        ce = zt.init(this.clippingPlanes, we),
        S = pt.get(w, A.length),
        S.init(),
        A.push(S),
        Ct.enabled === !0 && Ct.isPresenting === !0)
        {
          let Mt = R.xr.getDepthSensingMesh();
          Mt !== null && jc(Mt, U, -1 / 0, R.sortObjects);
        }
        jc(w, U, 0, R.sortObjects),
        S.finish(),
        N !== null && N.updateLights(M.state.lightsArray),
        R.sortObjects === !0 && S.sort(Tt, Xt),
        Ne =
        Ct.enabled === !1 ||
        Ct.isPresenting === !1 ||
        Ct.hasDepthSensing() === !1,
        Ne && Yt.addToRenderList(S, w),
        this.info.render.frame++,
        this.info.autoReset === !0 && this.info.reset(),
        ce === !0 && zt.beginShadows();
        let W = M.state.shadowsArray;
        if (
        Bt.render(W, w, U),
        ce === !0 && zt.endShadows(),
        (G && E.hasRenderPass()) === !1)
        {
          let Mt = S.opaque,
            gt = S.transmissive;
          if (M.setupLights(), U.isArrayCamera) {
            let Rt = U.cameras;
            if (gt.length > 0)
            for (let Pt = 0, Jt = Rt.length; Pt < Jt; Pt++) {
              let ee = Rt[Pt];
              yd(Mt, gt, w, ee);
            }
            Ne && Yt.render(w);
            for (let Pt = 0, Jt = Rt.length; Pt < Jt; Pt++) {
              let ee = Rt[Pt];
              xd(S, w, ee, ee.viewport);
            }
          } else
          gt.length > 0 && yd(Mt, gt, w, U),
          Ne && Yt.render(w),
          xd(S, w, U);
        }
        nt !== null &&
        X === 0 && (
        Z.updateMultisampleRenderTarget(nt),
        Z.updateRenderTargetMipmap(nt)),
        G && E.end(R),
        w.isScene === !0 && w.onAfterRender(R, w, U),
        vt.resetDefaultState(),
        Y = -1,
        K = null,
        v.pop(),
        v.length > 0 ? (
        M = v[v.length - 1],
        Z.setTextureUnits(M.state.textureUnits),
        ce === !0 &&
        zt.setGlobalState(R.clippingPlanes, M.state.camera)) :
        M = null,
        A.pop(),
        A.length > 0 ? S = A[A.length - 1] : S = null,
        N !== null && N.renderEnd();
      };
      function jc(w, U, q, G) {
        if (w.visible === !1) return;
        if (w.layers.test(U.layers)) {
          if (w.isGroup) q = w.renderOrder;else
          if (w.isLOD) w.autoUpdate === !0 && w.update(U);else
          if (w.isLightProbeGrid) M.pushLightProbeGrid(w);else
          if (w.isLight) M.pushLight(w), w.castShadow && M.pushShadow(w);else
          if (w.isSprite) {
            if (!w.frustumCulled || w.intersectsFrustum(te)) {
              G && nn.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ne);
              let Mt = tt.update(w),
                gt = w.material;
              gt.visible && S.push(w, Mt, gt, q, nn.z, null, U);
            }
          } else if (
          (w.isMesh || w.isLine || w.isPoints) && (
          !w.frustumCulled || w.intersectsFrustum(te)))
          {
            let Mt = tt.update(w),
              gt = w.material;
            if (
            G && (
            w.boundingSphere !== void 0 ? (
            w.boundingSphere === null && w.computeBoundingSphere(),
            nn.copy(w.boundingSphere.center)) : (
            Mt.boundingSphere === null && Mt.computeBoundingSphere(),
            nn.copy(Mt.boundingSphere.center)),
            nn.applyMatrix4(w.matrixWorld).applyMatrix4(ne)),
            Array.isArray(gt))
            {
              let Rt = Mt.groups;
              for (let Pt = 0, Jt = Rt.length; Pt < Jt; Pt++) {
                let ee = Rt[Pt],
                  kt = gt[ee.materialIndex];
                kt && kt.visible && S.push(w, Mt, kt, q, nn.z, ee, U);
              }
            } else gt.visible && S.push(w, Mt, gt, q, nn.z, null, U);
          }
        }
        let xt = w.children;
        for (let Mt = 0, gt = xt.length; Mt < gt; Mt++) jc(xt[Mt], U, q, G);
      }
      function xd(w, U, q, G) {
        let { opaque: W, transmissive: xt, transparent: Mt } = w;
        M.setupLightsView(q),
        ce === !0 && zt.setGlobalState(R.clippingPlanes, q),
        G && _.viewport(et.copy(G)),
        W.length > 0 && ia(W, U, q),
        xt.length > 0 && ia(xt, U, q),
        Mt.length > 0 && ia(Mt, U, q),
        _.buffers.depth.setTest(!0),
        _.buffers.depth.setMask(!0),
        _.buffers.color.setMask(!0),
        _.setPolygonOffset(!1);
      }
      function yd(w, U, q, G) {
        if ((q.isScene === !0 ? q.overrideMaterial : null) !== null) return;
        if (M.state.transmissionRenderTarget[G.id] === void 0) {
          let kt =
          ge.has("EXT_color_buffer_half_float") ||
          ge.has("EXT_color_buffer_float");
          M.state.transmissionRenderTarget[G.id] = new gn(1, 1, {
            generateMipmaps: !0,
            type: kt ? Qn : Tn,
            minFilter: rs,
            samples: Math.max(4, C.samples),
            stencilBuffer: r,
            resolveDepthBuffer: !1,
            resolveStencilBuffer: !1,
            storeMultisampledDepthBuffer: !1,
            storeMultisampledStencilBuffer: !1,
            colorSpace: ie.workingColorSpace
          });
        }
        let xt = M.state.transmissionRenderTarget[G.id],
          Mt = G.viewport || et;
        xt.setSize(
          Mt.z * R.transmissionResolutionScale,
          Mt.w * R.transmissionResolutionScale
        );
        let gt = R.getRenderTarget(),
          Rt = R.getActiveCubeFace(),
          Pt = R.getActiveMipmapLevel();
        R.setRenderTarget(xt),
        R.getClearColor(Se),
        oe = R.getClearAlpha(),
        oe < 1 && R.setClearColor(16777215, 0.5),
        R.clear(),
        Ne && Yt.render(q);
        let Jt = R.toneMapping;
        R.toneMapping = Kn;
        let ee = G.viewport;
        if (
        G.viewport !== void 0 && (G.viewport = void 0),
        M.setupLightsView(G),
        ce === !0 && zt.setGlobalState(R.clippingPlanes, G),
        ia(w, q, G),
        Z.updateMultisampleRenderTarget(xt),
        Z.updateRenderTargetMipmap(xt),
        ge.has("WEBGL_multisampled_render_to_texture") === !1)
        {
          let kt = !1;
          for (let pe = 0, qe = U.length; pe < qe; pe++) {
            let Re = U[pe],
              { object: be, geometry: un, material: _t, group: yn } = Re;
            if (_t.side === gi && be.layers.test(G.layers)) {
              let le = _t.side;
              _t.side = Mn,
              _t.needsUpdate = !0,
              vd(be, q, G, un, _t, yn),
              _t.side = le,
              _t.needsUpdate = !0,
              kt = !0;
            }
          }
          kt === !0 && (
          Z.updateMultisampleRenderTarget(xt),
          Z.updateRenderTargetMipmap(xt));
        }
        R.setRenderTarget(gt, Rt, Pt),
        R.setClearColor(Se, oe),
        ee !== void 0 && (G.viewport = ee),
        R.toneMapping = Jt;
      }
      function ia(w, U, q) {
        let G = U.isScene === !0 ? U.overrideMaterial : null;
        for (let W = 0, xt = w.length; W < xt; W++) {
          let Mt = w[W],
            { object: gt, geometry: Rt, group: Pt } = Mt,
            Jt = Mt.material;
          Jt.allowOverride === !0 && G !== null && (Jt = G),
          gt.layers.test(q.layers) && vd(gt, U, q, Rt, Jt, Pt);
        }
      }
      function vd(w, U, q, G, W, xt) {
        N !== null && W.isNodeMaterial && N.setObject(w, W),
        w.onBeforeRender(R, U, q, G, W, xt),
        w.modelViewMatrix.multiplyMatrices(
          q.matrixWorldInverse,
          w.matrixWorld
        ),
        w.normalMatrix.getNormalMatrix(w.modelViewMatrix),
        W.onBeforeRender(R, U, q, G, w, xt),
        W.transparent === !0 && W.side === gi && W.forceSinglePass === !1 ? (
        W.side = Mn,
        W.needsUpdate = !0,
        R.renderBufferDirect(q, U, G, W, w, xt),
        W.side = is,
        W.needsUpdate = !0,
        R.renderBufferDirect(q, U, G, W, w, xt),
        W.side = gi) :
        R.renderBufferDirect(q, U, G, W, w, xt),
        w.onAfterRender(R, U, q, G, W, xt);
      }
      function sa(w, U, q) {
        U.isScene !== !0 && (U = Sn);
        let G = $.get(w),
          W = M.state.lights,
          xt = M.state.shadowsArray,
          Mt = W.state.version,
          gt = ht.getParameters(
            w,
            W.state,
            xt,
            U,
            q,
            M.state.lightProbeGridArray
          ),
          Rt = ht.getProgramCacheKey(gt),
          Pt = G.programs;
        G.environment =
        w.isMeshStandardMaterial ||
        w.isMeshLambertMaterial ||
        w.isMeshPhongMaterial ?
        U.environment :
        null,
        G.fog = U.fog;
        let Jt =
        w.isMeshStandardMaterial ||
        w.isMeshLambertMaterial && !w.envMap ||
        w.isMeshPhongMaterial && !w.envMap;
        G.envMap = at.get(w.envMap || G.environment, Jt),
        G.envMapRotation =
        G.environment !== null && w.envMap === null ?
        U.environmentRotation :
        w.envMapRotation,
        Pt === void 0 && (
        w.addEventListener("dispose", ei),
        Pt = new Map(),
        G.programs = Pt);
        let ee = Pt.get(Rt);
        if (ee !== void 0) {
          if (G.currentProgram === ee && G.lightsStateVersion === Mt)
          return bd(w, gt), ee;
        } else
        gt.uniforms = ht.getUniforms(w),
        N !== null && w.isNodeMaterial && N.build(w, q, gt),
        w.onBeforeCompile(gt, R),
        ee = ht.acquireProgram(gt, Rt),
        Pt.set(Rt, ee),
        G.uniforms = gt.uniforms;
        let kt = G.uniforms;
        return (
          (!w.isShaderMaterial && !w.isRawShaderMaterial ||
          w.clipping === !0) && (
          kt.clippingPlanes = zt.uniform),
          bd(w, gt),
          G.needsLights = Gm(w),
          G.lightsStateVersion = Mt,
          G.needsLights && (
          kt.ambientLightColor.value = W.state.ambient,
          kt.lightProbe.value = W.state.probe,
          kt.sunLights.value = W.state.sun,
          kt.sunLightShadows.value = W.state.sunShadow,
          kt.directionalLights.value = W.state.directional,
          kt.directionalLightShadows.value = W.state.directionalShadow,
          kt.spotLights.value = W.state.spot,
          kt.spotLightShadows.value = W.state.spotShadow,
          kt.rectAreaLights.value = W.state.rectArea,
          kt.ltc_1.value = W.state.rectAreaLTC1,
          kt.ltc_2.value = W.state.rectAreaLTC2,
          kt.pointLights.value = W.state.point,
          kt.pointLightShadows.value = W.state.pointShadow,
          kt.hemisphereLights.value = W.state.hemi,
          kt.sunShadowMatrix.value = W.state.sunShadowMatrix,
          kt.sunShadowCascade.value = W.state.sunShadowCascade,
          kt.directionalShadowMatrix.value =
          W.state.directionalShadowMatrix,
          kt.spotLightMatrix.value = W.state.spotLightMatrix,
          kt.spotLightMap.value = W.state.spotLightMap,
          kt.pointShadowMatrix.value = W.state.pointShadowMatrix),
          G.lightProbeGrid = M.state.lightProbeGridArray.length > 0,
          G.currentProgram = ee,
          G.uniformsList = null,
          ee);

      }
      function _d(w) {
        if (w.uniformsList === null) {
          let U = w.currentProgram.getUniforms();
          w.uniformsList = Nr.seqWithValue(U.seq, w.uniforms);
        }
        return w.uniformsList;
      }
      function bd(w, U) {
        let q = $.get(w);
        q.outputColorSpace = U.outputColorSpace,
        q.batching = U.batching,
        q.batchingColor = U.batchingColor,
        q.instancing = U.instancing,
        q.instancingColor = U.instancingColor,
        q.instancingMorph = U.instancingMorph,
        q.skinning = U.skinning,
        q.morphTargets = U.morphTargets,
        q.morphNormals = U.morphNormals,
        q.morphColors = U.morphColors,
        q.morphTargetsCount = U.morphTargetsCount,
        q.numClippingPlanes = U.numClippingPlanes,
        q.numIntersection = U.numClipIntersection,
        q.vertexAlphas = U.vertexAlphas,
        q.vertexTangents = U.vertexTangents,
        q.toneMapping = U.toneMapping;
      }
      function Bm(w, U) {
        if (w.length === 0) return null;
        if (w.length === 1) return w[0].texture !== null ? w[0] : null;
        y.setFromMatrixPosition(U.matrixWorld);
        for (let q = 0, G = w.length; q < G; q++) {
          let W = w[q];
          if (W.texture !== null && W.boundingBox.containsPoint(y)) return W;
        }
        return null;
      }
      function Hm(w, U, q, G, W) {
        U.isScene !== !0 && (U = Sn), Z.resetTextureUnits();
        let xt = U.fog,
          Mt =
          G.isMeshStandardMaterial ||
          G.isMeshLambertMaterial ||
          G.isMeshPhongMaterial ?
          U.environment :
          null,
          gt =
          nt === null ?
          R.outputColorSpace :
          nt.isXRRenderTarget === !0 ?
          nt.texture.colorSpace :
          ie.workingColorSpace,
          Rt =
          G.isMeshStandardMaterial ||
          G.isMeshLambertMaterial && !G.envMap ||
          G.isMeshPhongMaterial && !G.envMap,
          Pt = at.get(G.envMap || Mt, Rt),
          Jt =
          G.vertexColors === !0 &&
          !!q.attributes.color &&
          q.attributes.color.itemSize === 4,
          ee = !!q.attributes.tangent && (!!G.normalMap || G.anisotropy > 0),
          kt = !!q.morphAttributes.position,
          pe = !!q.morphAttributes.normal,
          qe = !!q.morphAttributes.color,
          Re = Kn;
        G.toneMapped && (
        nt === null || nt.isXRRenderTarget === !0) && (
        Re = R.toneMapping);
        let be =
          q.morphAttributes.position ||
          q.morphAttributes.normal ||
          q.morphAttributes.color,
          un = be !== void 0 ? be.length : 0,
          _t = $.get(G),
          yn = M.state.lights;
        if (ce === !0 && (we === !0 || w !== K)) {
          let Te = w === K && G.id === Y;
          zt.setState(G, w, Te);
        }
        let le = !1;
        G.version === _t.__version ?
        (_t.needsLights && _t.lightsStateVersion !== yn.state.version ||
        _t.outputColorSpace !== gt ||
        W.isBatchedMesh && _t.batching === !1 ||
        !W.isBatchedMesh && _t.batching === !0 ||
        W.isBatchedMesh &&
        _t.batchingColor === !0 &&
        W._colorsTexture === null ||
        W.isBatchedMesh &&
        _t.batchingColor === !1 &&
        W._colorsTexture !== null ||
        W.isInstancedMesh && _t.instancing === !1 ||
        !W.isInstancedMesh && _t.instancing === !0 ||
        W.isSkinnedMesh && _t.skinning === !1 ||
        !W.isSkinnedMesh && _t.skinning === !0 ||
        W.isInstancedMesh &&
        _t.instancingColor === !0 &&
        W.instanceColor === null ||
        W.isInstancedMesh &&
        _t.instancingColor === !1 &&
        W.instanceColor !== null ||
        W.isInstancedMesh &&
        _t.instancingMorph === !0 &&
        W.morphTexture === null ||
        W.isInstancedMesh &&
        _t.instancingMorph === !1 &&
        W.morphTexture !== null ||
        _t.envMap !== Pt ||
        G.fog === !0 && _t.fog !== xt ||
        _t.numClippingPlanes !== void 0 && (
        _t.numClippingPlanes !== zt.numPlanes ||
        _t.numIntersection !== zt.numIntersection) ||
        _t.vertexAlphas !== Jt ||
        _t.vertexTangents !== ee ||
        _t.morphTargets !== kt ||
        _t.morphNormals !== pe ||
        _t.morphColors !== qe ||
        _t.toneMapping !== Re ||
        _t.morphTargetsCount !== un ||
        !!_t.lightProbeGrid != M.state.lightProbeGridArray.length > 0) && (
        le = !0) : (
        le = !0, _t.__version = G.version);
        let Dn = _t.currentProgram;
        le === !0 && (
        Dn = sa(G, U, W),
        N && G.isNodeMaterial && N.onUpdateProgram(G, Dn, _t));
        let ni = !1,
          zi = !1,
          Fs = !1,
          ve = Dn.getUniforms(),
          He = _t.uniforms;
        if (
        _.useProgram(Dn.program) && (ni = !0, zi = !0, Fs = !0),
        G.id !== Y && (Y = G.id, zi = !0),
        _t.needsLights)
        {
          let Te = Bm(M.state.lightProbeGridArray, W);
          _t.lightProbeGrid !== Te && (_t.lightProbeGrid = Te, zi = !0);
        }
        if (ni || K !== w) {
          _.buffers.depth.getReversed() &&
          w.reversedDepth !== !0 && (
          w._reversedDepth = !0, w.updateProjectionMatrix()),
          ve.setValue(O, "projectionMatrix", w.projectionMatrix),
          ve.setValue(O, "viewMatrix", w.matrixWorldInverse);
          let Fi = ve.map.cameraPosition;
          Fi !== void 0 &&
          Fi.setValue(O, Ie.setFromMatrixPosition(w.matrixWorld)),
          C.logarithmicDepthBuffer &&
          ve.setValue(
            O,
            "logDepthBufFC",
            2 / (Math.log(w.far + 1) / Math.LN2)
          ),
          (G.isMeshPhongMaterial ||
          G.isMeshToonMaterial ||
          G.isMeshLambertMaterial ||
          G.isMeshBasicMaterial ||
          G.isMeshStandardMaterial ||
          G.isShaderMaterial) &&
          ve.setValue(O, "isOrthographic", w.isOrthographicCamera === !0),
          K !== w && (K = w, zi = !0, Fs = !0);
        }
        if (
        _t.needsLights && (
        yn.state.sunShadowMap.length > 0 &&
        ve.setValue(O, "sunShadowMap", yn.state.sunShadowMap, Z),
        yn.state.directionalShadowMap.length > 0 &&
        ve.setValue(
          O,
          "directionalShadowMap",
          yn.state.directionalShadowMap,
          Z
        ),
        yn.state.spotShadowMap.length > 0 &&
        ve.setValue(O, "spotShadowMap", yn.state.spotShadowMap, Z),
        yn.state.pointShadowMap.length > 0 &&
        ve.setValue(O, "pointShadowMap", yn.state.pointShadowMap, Z)),
        W.isSkinnedMesh)
        {
          ve.setOptional(O, W, "bindMatrix"),
          ve.setOptional(O, W, "bindMatrixInverse");
          let Te = W.skeleton;
          Te && (
          Te.boneTexture === null && Te.computeBoneTexture(),
          ve.setValue(O, "boneTexture", Te.boneTexture, Z));
        }
        W.isBatchedMesh && (
        ve.setOptional(O, W, "batchingTexture"),
        ve.setValue(O, "batchingTexture", W._matricesTexture, Z),
        ve.setOptional(O, W, "batchingIdTexture"),
        ve.setValue(O, "batchingIdTexture", W._indirectTexture, Z),
        ve.setOptional(O, W, "batchingColorTexture"),
        W._colorsTexture !== null &&
        ve.setValue(O, "batchingColorTexture", W._colorsTexture, Z));
        let Ui = q.morphAttributes;
        if (
        (Ui.position !== void 0 ||
        Ui.normal !== void 0 ||
        Ui.color !== void 0) &&
        F.update(W, q, Dn),
        (zi || _t.receiveShadow !== W.receiveShadow) && (
        _t.receiveShadow = W.receiveShadow,
        ve.setValue(O, "receiveShadow", W.receiveShadow)),
        (G.isMeshStandardMaterial ||
        G.isMeshLambertMaterial ||
        G.isMeshPhongMaterial) &&
        G.envMap === null &&
        U.environment !== null && (
        He.envMapIntensity.value = U.environmentIntensity),
        He.dfgLUT !== void 0 && (He.dfgLUT.value = qb()),
        zi)
        {
          if (
          ve.setValue(O, "toneMappingExposure", R.toneMappingExposure),
          _t.needsLights && Vm(He, Fs),
          xt && G.fog === !0 && Nt.refreshFogUniforms(He, xt),
          Nt.refreshMaterialUniforms(
            He,
            G,
            it,
            J,
            M.state.transmissionRenderTarget[w.id]
          ),
          _t.needsLights && _t.lightProbeGrid)
          {
            let Te = _t.lightProbeGrid;
            He.probesSH.value = Te.texture,
            He.probesMin.value.copy(Te.boundingBox.min),
            He.probesMax.value.copy(Te.boundingBox.max),
            He.probesResolution.value.copy(Te.resolution);
          }
          Nr.upload(O, _d(_t), He, Z);
        }
        if (
        G.isShaderMaterial &&
        G.uniformsNeedUpdate === !0 && (
        Nr.upload(O, _d(_t), He, Z), G.uniformsNeedUpdate = !1),
        G.isSpriteMaterial && ve.setValue(O, "center", W.center),
        ve.setValue(O, "modelViewMatrix", W.modelViewMatrix),
        ve.setValue(O, "normalMatrix", W.normalMatrix),
        ve.setValue(O, "modelMatrix", W.matrixWorld),
        G.uniformsGroups !== void 0)
        {
          let Te = G.uniformsGroups;
          for (let Fi = 0, Os = Te.length; Fi < Os; Fi++) {
            let Sd = Te[Fi];
            rt.update(Sd, Dn), rt.bind(Sd, Dn);
          }
        }
        return Dn;
      }
      function Vm(w, U) {
        w.ambientLightColor.needsUpdate = U,
        w.lightProbe.needsUpdate = U,
        w.sunLights.needsUpdate = U,
        w.sunLightShadows.needsUpdate = U,
        w.directionalLights.needsUpdate = U,
        w.directionalLightShadows.needsUpdate = U,
        w.pointLights.needsUpdate = U,
        w.pointLightShadows.needsUpdate = U,
        w.spotLights.needsUpdate = U,
        w.spotLightShadows.needsUpdate = U,
        w.rectAreaLights.needsUpdate = U,
        w.hemisphereLights.needsUpdate = U;
      }
      function Gm(w) {
        return (
          w.isMeshLambertMaterial ||
          w.isMeshToonMaterial ||
          w.isMeshPhongMaterial ||
          w.isMeshStandardMaterial ||
          w.isShadowMaterial ||
          w.isShaderMaterial && w.lights === !0);

      }
      this.getActiveCubeFace = function () {
        return H;
      },
      this.getActiveMipmapLevel = function () {
        return X;
      },
      this.getRenderTarget = function () {
        return nt;
      },
      this.setRenderTargetTextures = function (w, U, q) {
        let G = $.get(w);
        G.__autoAllocateDepthBuffer = w.resolveDepthBuffer === !1,
        G.__autoAllocateDepthBuffer === !1 && (G.__useRenderToTexture = !1),
        $.get(w.texture).__webglTexture = U,
        $.get(w.depthTexture).__webglTexture = G.__autoAllocateDepthBuffer ?
        void 0 :
        q,
        G.__hasExternalTextures = !0;
      },
      this.setRenderTargetFramebuffer = function (w, U) {
        let q = $.get(w);
        q.__webglFramebuffer = U,
        q.__useDefaultFramebuffer = U === void 0;
      },
      this.setRenderTarget = function (w, U = 0, q = 0) {
        nt = w, H = U, X = q;
        let G = null,
          W = !1,
          xt = !1;
        if (w) {
          let gt = $.get(w);
          if (gt.__useDefaultFramebuffer !== void 0) {
            _.bindFramebuffer(O.FRAMEBUFFER, gt.__webglFramebuffer),
            et.copy(w.viewport),
            Dt.copy(w.scissor),
            Lt = w.scissorTest,
            _.viewport(et),
            _.scissor(Dt),
            _.setScissorTest(Lt),
            Y = -1;
            return;
          } else if (gt.__webglFramebuffer === void 0) Z.setupRenderTarget(w);else
          if (gt.__hasExternalTextures)
          Z.rebindTextures(
            w,
            $.get(w.texture).__webglTexture,
            $.get(w.depthTexture).__webglTexture
          );else
          if (w.depthBuffer) {
            let Jt = w.depthTexture;
            if (gt.__boundDepthTexture !== Jt) {
              if (
              Jt !== null &&
              $.has(Jt) && (
              w.width !== Jt.image.width || w.height !== Jt.image.height))

              throw new Error(
                "THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size."
              );
              Z.setupDepthRenderbuffer(w);
            }
          }
          let Rt = w.texture;
          (Rt.isData3DTexture ||
          Rt.isDataArrayTexture ||
          Rt.isCompressedArrayTexture) && (
          xt = !0);
          let Pt = $.get(w).__webglFramebuffer;
          w.isWebGLCubeRenderTarget ? (
          Array.isArray(Pt[U]) ? G = Pt[U][q] : G = Pt[U], W = !0) :
          w.samples > 0 && Z.useMultisampledRTT(w) === !1 ?
          G = $.get(w).__webglMultisampledFramebuffer :
          Array.isArray(Pt) ?
          G = Pt[q] :
          G = Pt,
          et.copy(w.viewport),
          Dt.copy(w.scissor),
          Lt = w.scissorTest;
        } else
        et.copy(bt).multiplyScalar(it).floor(),
        Dt.copy(Qt).multiplyScalar(it).floor(),
        Lt = Ze;
        if (
        q !== 0 && (G = B),
        _.bindFramebuffer(O.FRAMEBUFFER, G) && _.drawBuffers(w, G),
        _.viewport(et),
        _.scissor(Dt),
        _.setScissorTest(Lt),
        W)
        {
          let gt = $.get(w.texture);
          O.framebufferTexture2D(
            O.FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            O.TEXTURE_CUBE_MAP_POSITIVE_X + U,
            gt.__webglTexture,
            q
          );
        } else if (xt) {
          let gt = U;
          for (let Rt = 0; Rt < w.textures.length; Rt++) {
            let Pt = $.get(w.textures[Rt]);
            O.framebufferTextureLayer(
              O.FRAMEBUFFER,
              O.COLOR_ATTACHMENT0 + Rt,
              Pt.__webglTexture,
              q,
              gt
            );
          }
        } else if (w !== null && q !== 0) {
          let gt = $.get(w.texture);
          O.framebufferTexture2D(
            O.FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            O.TEXTURE_2D,
            gt.__webglTexture,
            q
          );
        }
        Y = -1;
      };
      function Md(w) {
        let U = $.get(w);
        return (
          (U.__readFormat !== w.format || U.__readType !== w.type) && (
          U.__readFormat = w.format,
          U.__readType = w.type,
          U.__formatReadable = C.textureFormatReadable(w.format),
          U.__typeReadable = C.textureTypeReadable(w.type)),
          U);

      }
      this.readRenderTargetPixels = function (w, U, q, G, W, xt, Mt, gt = 0) {
        if (!(w && w.isWebGLRenderTarget)) {
          Gt(
            "WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
          );
          return;
        }
        let Rt = $.get(w).__webglFramebuffer;
        if (w.isWebGLCubeRenderTarget && Mt !== void 0 && (Rt = Rt[Mt]), Rt) {
          _.bindFramebuffer(O.FRAMEBUFFER, Rt);
          try {
            let Pt = w.textures[gt],
              Jt = Pt.format,
              ee = Pt.type;
            w.textures.length > 1 && O.readBuffer(O.COLOR_ATTACHMENT0 + gt);
            let kt = Md(Pt);
            if (kt.__formatReadable === !1) {
              Gt(
                "WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format."
              );
              return;
            }
            if (kt.__typeReadable === !1) {
              Gt(
                "WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type."
              );
              return;
            }
            U >= 0 &&
            U <= w.width - G &&
            q >= 0 &&
            q <= w.height - W &&
            O.readPixels(U, q, G, W, ft.convert(Jt), ft.convert(ee), xt);
          } finally {
            let Pt = nt !== null ? $.get(nt).__webglFramebuffer : null;
            _.bindFramebuffer(O.FRAMEBUFFER, Pt);
          }
        }
      },
      this.readRenderTargetPixelsAsync = async function (
      w,
      U,
      q,
      G,
      W,
      xt,
      Mt,
      gt = 0)
      {
        if (!(w && w.isWebGLRenderTarget))
        throw new Error(
          "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
        );
        let Rt = $.get(w).__webglFramebuffer;
        if (w.isWebGLCubeRenderTarget && Mt !== void 0 && (Rt = Rt[Mt]), Rt)
        if (U >= 0 && U <= w.width - G && q >= 0 && q <= w.height - W) {
          _.bindFramebuffer(O.FRAMEBUFFER, Rt);
          let Pt = w.textures[gt],
            Jt = Pt.format,
            ee = Pt.type;
          w.textures.length > 1 && O.readBuffer(O.COLOR_ATTACHMENT0 + gt);
          let kt = Md(Pt);
          if (kt.__formatReadable === !1)
          throw new Error(
            "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format."
          );
          if (kt.__typeReadable === !1)
          throw new Error(
            "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type."
          );
          let pe = O.createBuffer();
          O.bindBuffer(O.PIXEL_PACK_BUFFER, pe),
          O.bufferData(O.PIXEL_PACK_BUFFER, xt.byteLength, O.STREAM_READ),
          O.readPixels(U, q, G, W, ft.convert(Jt), ft.convert(ee), 0),
          O.bindBuffer(O.PIXEL_PACK_BUFFER, null);
          let qe = nt !== null ? $.get(nt).__webglFramebuffer : null;
          _.bindFramebuffer(O.FRAMEBUFFER, qe);
          let Re = O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return (
            O.flush(),
            await Dp(O, Re, 4),
            O.bindBuffer(O.PIXEL_PACK_BUFFER, pe),
            O.getBufferSubData(O.PIXEL_PACK_BUFFER, 0, xt),
            O.bindBuffer(O.PIXEL_PACK_BUFFER, null),
            O.deleteBuffer(pe),
            O.deleteSync(Re),
            xt);

        } else
        throw new Error(
          "THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range."
        );
      },
      this.copyFramebufferToTexture = function (w, U = null, q = 0) {
        let G = Math.pow(2, -q),
          W = Math.floor(w.image.width * G),
          xt = Math.floor(w.image.height * G),
          Mt = U !== null ? U.x : 0,
          gt = U !== null ? U.y : 0;
        Z.setTexture2D(w, 0),
        O.copyTexSubImage2D(O.TEXTURE_2D, q, 0, 0, Mt, gt, W, xt),
        _.unbindTexture();
      },
      this.copyTextureToTexture = function (
      w,
      U,
      q = null,
      G = null,
      W = 0,
      xt = 0)
      {
        let Mt,
          gt,
          Rt,
          Pt,
          Jt,
          ee,
          kt,
          pe,
          qe,
          Re = w.isCompressedTexture ? w.mipmaps[xt] : w.image;
        if (q !== null)
        Mt = q.max.x - q.min.x,
        gt = q.max.y - q.min.y,
        Rt = q.isBox3 ? q.max.z - q.min.z : 1,
        Pt = q.min.x,
        Jt = q.min.y,
        ee = q.isBox3 ? q.min.z : 0;else
        {
          let He = Math.pow(2, -W);
          Mt = Math.floor(Re.width * He),
          gt = Math.floor(Re.height * He),
          w.isDataArrayTexture ?
          Rt = Re.depth :
          w.isData3DTexture ?
          Rt = Math.floor(Re.depth * He) :
          Rt = 1,
          Pt = 0,
          Jt = 0,
          ee = 0;
        }
        G !== null ? (
        kt = G.x, pe = G.y, qe = G.z) : (
        kt = 0, pe = 0, qe = 0);
        let be = ft.convert(U.format),
          un = ft.convert(U.type),
          _t;
        U.isData3DTexture ? (
        Z.setTexture3D(U, 0), _t = O.TEXTURE_3D) :
        U.isDataArrayTexture || U.isCompressedArrayTexture ? (
        Z.setTexture2DArray(U, 0), _t = O.TEXTURE_2D_ARRAY) : (
        Z.setTexture2D(U, 0), _t = O.TEXTURE_2D),
        _.activeTexture(O.TEXTURE0),
        _.pixelStorei(O.UNPACK_FLIP_Y_WEBGL, U.flipY),
        _.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL, U.premultiplyAlpha),
        _.pixelStorei(O.UNPACK_ALIGNMENT, U.unpackAlignment);
        let yn = _.getParameter(O.UNPACK_ROW_LENGTH),
          le = _.getParameter(O.UNPACK_IMAGE_HEIGHT),
          Dn = _.getParameter(O.UNPACK_SKIP_PIXELS),
          ni = _.getParameter(O.UNPACK_SKIP_ROWS),
          zi = _.getParameter(O.UNPACK_SKIP_IMAGES);
        _.pixelStorei(O.UNPACK_ROW_LENGTH, Re.width),
        _.pixelStorei(O.UNPACK_IMAGE_HEIGHT, Re.height),
        _.pixelStorei(O.UNPACK_SKIP_PIXELS, Pt),
        _.pixelStorei(O.UNPACK_SKIP_ROWS, Jt),
        _.pixelStorei(O.UNPACK_SKIP_IMAGES, ee);
        let Fs = w.isDataArrayTexture || w.isData3DTexture,
          ve = U.isDataArrayTexture || U.isData3DTexture;
        if (w.isDepthTexture) {
          let He = $.get(w),
            Ui = $.get(U),
            Te = $.get(He.__renderTarget),
            Fi = $.get(Ui.__renderTarget);
          _.bindFramebuffer(O.READ_FRAMEBUFFER, Te.__webglFramebuffer),
          _.bindFramebuffer(O.DRAW_FRAMEBUFFER, Fi.__webglFramebuffer);
          for (let Os = 0; Os < Rt; Os++)
          Fs && (
          O.framebufferTextureLayer(
            O.READ_FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            $.get(w).__webglTexture,
            W,
            ee + Os
          ),
          O.framebufferTextureLayer(
            O.DRAW_FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            $.get(U).__webglTexture,
            xt,
            qe + Os
          )),
          O.blitFramebuffer(
            Pt,
            Jt,
            Mt,
            gt,
            kt,
            pe,
            Mt,
            gt,
            O.DEPTH_BUFFER_BIT,
            O.NEAREST
          );
          _.bindFramebuffer(O.READ_FRAMEBUFFER, null),
          _.bindFramebuffer(O.DRAW_FRAMEBUFFER, null);
        } else if (W !== 0 || w.isRenderTargetTexture || $.has(w)) {
          let He = $.get(w),
            Ui = $.get(U);
          _.bindFramebuffer(O.READ_FRAMEBUFFER, D),
          _.bindFramebuffer(O.DRAW_FRAMEBUFFER, I);
          for (let Te = 0; Te < Rt; Te++)
          Fs ?
          O.framebufferTextureLayer(
            O.READ_FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            He.__webglTexture,
            W,
            ee + Te
          ) :
          O.framebufferTexture2D(
            O.READ_FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            O.TEXTURE_2D,
            He.__webglTexture,
            W
          ),
          ve ?
          O.framebufferTextureLayer(
            O.DRAW_FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            Ui.__webglTexture,
            xt,
            qe + Te
          ) :
          O.framebufferTexture2D(
            O.DRAW_FRAMEBUFFER,
            O.COLOR_ATTACHMENT0,
            O.TEXTURE_2D,
            Ui.__webglTexture,
            xt
          ),
          W !== 0 ?
          O.blitFramebuffer(
            Pt,
            Jt,
            Mt,
            gt,
            kt,
            pe,
            Mt,
            gt,
            O.COLOR_BUFFER_BIT,
            O.NEAREST
          ) :
          ve ?
          O.copyTexSubImage3D(
            _t,
            xt,
            kt,
            pe,
            qe + Te,
            Pt,
            Jt,
            Mt,
            gt
          ) :
          O.copyTexSubImage2D(_t, xt, kt, pe, Pt, Jt, Mt, gt);
          _.bindFramebuffer(O.READ_FRAMEBUFFER, null),
          _.bindFramebuffer(O.DRAW_FRAMEBUFFER, null);
        } else
        ve ?
        w.isDataTexture || w.isData3DTexture ?
        O.texSubImage3D(
          _t,
          xt,
          kt,
          pe,
          qe,
          Mt,
          gt,
          Rt,
          be,
          un,
          Re.data
        ) :
        U.isCompressedArrayTexture ?
        O.compressedTexSubImage3D(
          _t,
          xt,
          kt,
          pe,
          qe,
          Mt,
          gt,
          Rt,
          be,
          Re.data
        ) :
        O.texSubImage3D(_t, xt, kt, pe, qe, Mt, gt, Rt, be, un, Re) :
        w.isDataTexture ?
        O.texSubImage2D(
          O.TEXTURE_2D,
          xt,
          kt,
          pe,
          Mt,
          gt,
          be,
          un,
          Re.data
        ) :
        w.isCompressedTexture ?
        O.compressedTexSubImage2D(
          O.TEXTURE_2D,
          xt,
          kt,
          pe,
          Re.width,
          Re.height,
          be,
          Re.data
        ) :
        O.texSubImage2D(
          O.TEXTURE_2D,
          xt,
          kt,
          pe,
          Mt,
          gt,
          be,
          un,
          Re
        );
        _.pixelStorei(O.UNPACK_ROW_LENGTH, yn),
        _.pixelStorei(O.UNPACK_IMAGE_HEIGHT, le),
        _.pixelStorei(O.UNPACK_SKIP_PIXELS, Dn),
        _.pixelStorei(O.UNPACK_SKIP_ROWS, ni),
        _.pixelStorei(O.UNPACK_SKIP_IMAGES, zi),
        xt === 0 && U.generateMipmaps && O.generateMipmap(_t),
        _.unbindTexture();
      },
      this.initRenderTarget = function (w) {
        $.get(w).__webglFramebuffer === void 0 && Z.setupRenderTarget(w);
      },
      this.initTexture = function (w) {
        w.isCubeTexture ?
        Z.setTextureCube(w, 0) :
        w.isData3DTexture ?
        Z.setTexture3D(w, 0) :
        w.isDataArrayTexture || w.isCompressedArrayTexture ?
        Z.setTexture2DArray(w, 0) :
        Z.setTexture2D(w, 0),
        _.unbindTexture();
      },
      this.resetState = function () {
        H = 0, X = 0, nt = null, _.reset(), vt.reset();
      },
      typeof __THREE_DEVTOOLS__ < "u" &&
      __THREE_DEVTOOLS__.dispatchEvent(
        new CustomEvent("observe", { detail: this })
      );
    }
    get coordinateSystem() {
      return Zn;
    }
    get outputColorSpace() {
      return this._outputColorSpace;
    }
    set outputColorSpace(t) {
      this._outputColorSpace = t;
      let e = this.getContext();
      e.drawingBufferColorSpace = ie._getDrawingBufferColorSpace(t),
      e.unpackColorSpace = ie._getUnpackColorSpace();
    }
  };
  function gm(i, t = !1) {
    let e = i[0].index !== null,
      n = new Set(Object.keys(i[0].attributes)),
      s = new Set(Object.keys(i[0].morphAttributes)),
      r = {},
      o = {},
      a = i[0].morphTargetsRelative,
      l = new ye(),
      c = 0;
    for (let h = 0; h < i.length; ++h) {
      let d = i[h],
        u = 0;
      if (e !== (d.index !== null))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
          h +
          ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."
        ),
        null);

      for (let f in d.attributes) {
        if (!n.has(f))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            '. All geometries must have compatible attributes; make sure "' +
            f +
            '" attribute exists among all geometries, or in none of them.'
          ),
          null);

        r[f] === void 0 && (r[f] = []), r[f].push(d.attributes[f]), u++;
      }
      if (u !== n.size)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
          h +
          ". Make sure all geometries have the same number of attributes."
        ),
        null);

      if (a !== d.morphTargetsRelative)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
          h +
          ". .morphTargetsRelative must be consistent throughout all geometries."
        ),
        null);

      for (let f in d.morphAttributes) {
        if (!s.has(f))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ".  .morphAttributes must be consistent throughout all geometries."
          ),
          null);

        o[f] === void 0 && (o[f] = []), o[f].push(d.morphAttributes[f]);
      }
      if (t) {
        let f;
        if (e) f = d.index.count;else
        if (d.attributes.position !== void 0)
        f = d.attributes.position.count;else

        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ". The geometry must have either an index or a position attribute"
          ),
          null);

        l.addGroup(c, f, h), c += f;
      }
    }
    if (e) {
      let h = 0,
        d = [];
      for (let u = 0; u < i.length; ++u) {
        let f = i[u].index;
        for (let p = 0; p < f.count; ++p) d.push(f.getX(p) + h);
        h += i[u].attributes.position.count;
      }
      l.setIndex(d);
    }
    for (let h in r) {
      let d = mm(r[h]);
      if (!d)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
          h +
          " attribute."
        ),
        null);

      l.setAttribute(h, d);
    }
    for (let h in o) {
      let d = o[h][0].length;
      if (d !== 0) {
        l.morphAttributes = l.morphAttributes || {},
        l.morphAttributes[h] = [];
        for (let u = 0; u < d; ++u) {
          let f = [];
          for (let x = 0; x < o[h].length; ++x) f.push(o[h][x][u]);
          let p = mm(f);
          if (!p)
          return (
            console.error(
              "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
              h +
              " morphAttribute."
            ),
            null);

          l.morphAttributes[h].push(p);
        }
      }
    }
    return l;
  }
  function mm(i) {
    let t,
      e,
      n,
      s = -1,
      r = 0;
    for (let c = 0; c < i.length; ++c) {
      let h = i[c];
      if (
      t === void 0 && (t = h.array.constructor), t !== h.array.constructor)

      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."
        ),
        null);

      if (e === void 0 && (e = h.itemSize), e !== h.itemSize)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."
        ),
        null);

      if (n === void 0 && (n = h.normalized), n !== h.normalized)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."
        ),
        null);

      if (s === -1 && (s = h.gpuType), s !== h.gpuType)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."
        ),
        null);

      r += h.count * e;
    }
    let o = new t(r),
      a = new Le(o, e, n),
      l = 0;
    for (let c = 0; c < i.length; ++c) {
      let h = i[c];
      if (h.isInterleavedBufferAttribute) {
        let d = l / e;
        for (let u = 0, f = h.count; u < f; u++)
        for (let p = 0; p < e; p++) {
          let x = h.getComponent(u, p);
          a.setComponent(u + d, p, x);
        }
      } else o.set(h.array, l);
      l += h.count * e;
    }
    return s !== void 0 && (a.gpuType = s), a;
  }
