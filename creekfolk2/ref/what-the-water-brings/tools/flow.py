import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={'width':800,'height':500}); pg.set_default_timeout(600000)
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=='error' and 'ERR_FAILED' not in m.text else None)
        await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        await pg.goto("file:///home/claude/wwb/out/game.html?fresh&q=low")
        await pg.wait_for_function("window.WWB && WWB.ready")
        r = await pg.evaluate("""() => { const W=WWB, out=[]; W.start(); W.pause(true);
          W.startStorm(); W.tick(5,20); out.push('storm '+W.save.weather+' struck='+W.save.struck);
          W.endStorm(); W.setHour(7); W.tick(3,20); out.push('after wave='+W.save.wave+' day='+W.save.day);
          W.ponder(); W.tick(4,20); out.push('ponder ok');
          W.photo.open(); W.tick(1,20); W.photo.pose && W.photo.pose('icosa'); W.tick(1,20); W.photo.close(); out.push('photo ok');
          W.easy(true); W.tick(3,20); W.easy(false); W.tick(1,20); out.push('easy toggle ok');
          ['icosa','octa','cube','tetra','dodeca'].forEach(id=>{ W.save.found[id]=true; });
          const c=W.world.spots.cave; W.teleport(c.x, c.z+0.5, Math.PI); W.tick(0.5,20); out.push('cave ready='+W.ending.ready()+' in='+W.ending.inCave());
          W.ending.start(); W.tick(40,20); out.push('ending paged='+W.ending.state.paged+' endVeil='+!document.getElementById('endVeil').hidden+' title='+document.getElementById('eTitle').textContent);
          return out; }""")
        print('\n'.join(r)); print('errors:', errs[:8])
        await b.close()
asyncio.run(main())
