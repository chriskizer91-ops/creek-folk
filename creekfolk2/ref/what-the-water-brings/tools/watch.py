import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={'width':640,'height':400}); pg.set_default_timeout(900000)
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        await pg.goto("file:///home/claude/wwb/out/game.html?fresh&q=low#watch")
        await pg.wait_for_function("window.WWB && WWB.ready")
        r = await pg.evaluate("""() => { const W=WWB, out=[]; W.pause(true); W.watch.start(); let last=-2;
          for (let s=0; s<2400; s++) { W.tick(1, 10); const st=W.watch.state; if (st.i!==last) { last=st.i; const step=W.watch.story[st.i]||{}; out.push(Math.round(s/60)+'m '+st.i+' '+(step.chapter||step.go||step.rest||'')+' '+(step.id||'')+' poems='+Object.keys(W.save.read).length); } if (!st.on) { out.push('ended at '+s+'s'); break; } }
          return out; }""")
        print('\n'.join(r)); print('errors', errs[:5])
        await b.close()
asyncio.run(main())
