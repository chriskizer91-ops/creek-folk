#!/usr/bin/env python3
"""Scripted screenshots of the game. usage: shots.py <html> <outdir> <scenario.json or name> [w h]
Each shot: {name, easy, hour, storm, at:[x,z] or spot, yaw, el, az, zoom, step, quality}"""
import sys, json, asyncio, os
from playwright.async_api import async_playwright
HTML, OUT = sys.argv[1], sys.argv[2]
SC = sys.argv[3]
W = int(sys.argv[4]) if len(sys.argv) > 4 else 1280
H = int(sys.argv[5]) if len(sys.argv) > 5 else 720
shots = json.load(open(SC)) if os.path.exists(SC) else json.loads(SC)
os.makedirs(OUT, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        groups = {}
        for s in shots: groups.setdefault((bool(s.get('easy')), s.get('quality', 'medium'), s.get('mobile', False)), []).append(s)
        for (easy, q, mobile), lst in groups.items():
            ctx = await b.new_context(viewport={"width": 390 if mobile else W, "height": 844 if mobile else H}, device_scale_factor=3 if mobile else 1, is_mobile=mobile, has_touch=mobile)
            pg = await ctx.new_page(); pg.set_default_timeout(180000)
            await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
            logs = []
            pg.on("console", lambda m: logs.append(m.type + ": " + m.text) if m.type in ('error', 'warning') else None)
            pg.on("pageerror", lambda e: logs.append("PAGEERROR: " + str(e)))
            url = "file://" + os.path.abspath(HTML) + "?fresh&q=" + q + ("#easy" if easy else "")
            await pg.goto(url)
            await pg.wait_for_function("window.WWB && WWB.ready", timeout=180000)
            await pg.evaluate("WWB.start()")
            await pg.wait_for_timeout(500)
            for s in lst:
                js = """(s) => {
                  const W = WWB; W.pause(true);
                  if (s.storm) W.startStorm(); else if (W.save.weather === 'storm') W.endStorm();
                  W.resetView && W.resetView();
                  if (s.hour != null) W.setHour(s.hour);
                  let at = s.at;
                  if (typeof at === 'string') { const sp = W.world.spots; const o = (sp.poems && sp.poems[at]) || sp[at]; at = o.seat ? [o.seat.x, o.seat.z] : (o.x != null ? [o.x, o.z] : [o[0], o[2] != null ? o[2] : o[1]]); }
                  if (at) W.teleport(at[0], at[1], s.yaw || 0);
                  if (s.az != null) { W.view.az = W.view.azGoal = s.az; }
                  if (s.el != null) { W.view.el = W.view.elGoal = s.el; }
                  if (s.zoom != null) { W.view.zoom = W.view.zoomGoal = s.zoom; }
                  if (s.eval) eval(s.eval);
                  W.step(s.step || 2.0, 20); W.snap(); W.render();
                  return { P: [W.P.x, W.P.z], hour: W.sky.hour };
                }"""
                info = await pg.evaluate(js, s)
                await pg.wait_for_timeout(200)
                path = os.path.join(OUT, s['name'] + '.png')
                await pg.screenshot(path=path)
                print(s['name'], info)
            for l in logs[:10]: print('   ', l)
            await ctx.close()
        await b.close()
asyncio.run(main())
