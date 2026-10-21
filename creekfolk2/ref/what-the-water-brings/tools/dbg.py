import asyncio, sys
from playwright.async_api import async_playwright
JS = sys.argv[1]; OUT = sys.argv[2]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={'width':960,'height':540}); pg.set_default_timeout(180000)
        logs=[]; pg.on("console", lambda m: logs.append(m.text)); pg.on("pageerror", lambda e: logs.append("ERR "+str(e)))
        await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        await pg.goto("file:///home/claude/wwb/out/game.html?fresh&q=medium")
        await pg.wait_for_function("window.WWB && WWB.ready")
        await pg.evaluate("WWB.start()")
        r = await pg.evaluate(JS)
        print(r)
        await pg.screenshot(path=OUT)
        for l in logs[-5:]: print(' ', l)
        await b.close()
asyncio.run(main())
