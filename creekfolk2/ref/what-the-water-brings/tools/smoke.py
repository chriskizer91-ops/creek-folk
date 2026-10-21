import asyncio, sys, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={'width':900,'height':560}); pg.set_default_timeout(300000)
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=='error' and 'ERR_FAILED' not in m.text else None)
        await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        await pg.goto("file:///home/claude/wwb/out/game.html?fresh&q=low")
        await pg.wait_for_function("window.WWB && WWB.ready")
        r = await pg.evaluate("""() => { const W=WWB; W.start(); W.pause(true); const out=[];
          for (const pm of W.poems) { const s=W.world.spots.poems[pm.id]; W.teleport(s.x + Math.sin(s.face)*0.3, s.z + Math.cos(s.face)*0.3, s.face); W.tick(0.5,20);
            W.act(); W.tick(0.3,20); const open=!document.getElementById('poemVeil').hidden; const t=document.getElementById('pTitle').textContent; const by=document.getElementById('pBy').textContent;
            out.push(pm.id+': open='+open+' read='+!!W.save.read[pm.id]+' | '+t+' | '+by+' | lines='+document.querySelectorAll('#pPage .ln').length);
            document.getElementById('poemDone').click(); W.tick(1.5,20); }
          out.push('nPoem='+document.getElementById('nPoem').textContent);
          return out; }""")
        print('\n'.join(r))
        print('errors:', errs[:8])
        await b.close()
asyncio.run(main())
