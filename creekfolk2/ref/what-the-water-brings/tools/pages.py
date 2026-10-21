import asyncio, sys
from playwright.async_api import async_playwright
SHOTS = [('desk', 1280, 720, False, False, ['bench', 'trestle', 'bridge']), ('tv-easy', 1920, 1080, True, False, ['crossing', 'pond']), ('phone', 390, 844, False, True, ['rock', 'bluehole'])]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        for name, w, h, easy, mob, ids in SHOTS:
            ctx = await b.new_context(viewport={'width':w,'height':h}, device_scale_factor=3 if mob else 1, is_mobile=mob, has_touch=mob)
            pg = await ctx.new_page(); pg.set_default_timeout(300000)
            await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
            await pg.goto("file:///home/claude/wwb/out/game.html?fresh&q=low" + ("#easy" if easy else ""))
            await pg.wait_for_function("window.WWB && WWB.ready")
            await pg.evaluate("WWB.start(); WWB.pause(true)")
            for pid in ids:
                await pg.evaluate("""(pid) => { const W=WWB, s=W.world.spots.poems[pid]; W.teleport(s.x + Math.sin(s.face)*0.3, s.z + Math.cos(s.face)*0.3, s.face); W.tick(0.5,20); W.act(); W.tick(0.5,20); W.render(); }""", pid)
                await pg.wait_for_timeout(300)
                await pg.screenshot(path=f'/home/claude/wwb/shots/page-{name}-{pid}.png')
                await pg.evaluate("document.getElementById('poemDone').click(); WWB.tick(0.5,20)")
            if name == 'desk':
                await pg.evaluate("WWB.ending && (()=>{ ['icosa','octa','cube','tetra','dodeca'].forEach(id=>WWB.save.found[id]=true); const c=WWB.world.spots.cave; WWB.teleport(c.x,c.z+0.5,Math.PI); WWB.ending.start(); WWB.tick(40,20); WWB.render(); })()")
                await pg.wait_for_timeout(300); await pg.screenshot(path=f'/home/claude/wwb/shots/page-{name}-ending.png')
            await ctx.close()
        await b.close()
asyncio.run(main())
