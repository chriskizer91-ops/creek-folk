import asyncio, sys
from playwright.async_api import async_playwright
async def run(path, q, easy, w=1920, h=1080):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={'width':w,'height':h}); pg.set_default_timeout(240000)
        await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        await pg.goto("file://"+path+"?fresh&q="+q+("#easy" if easy else ""))
        await pg.wait_for_function("window.WWB && WWB.ready")
        r = await pg.evaluate("""async () => { const W=WWB; W.start(); W.pause(true); W.setHour(10); W.teleport(-62,-1.5,3); W.step(2,20); W.snap();
          const gl=W.renderer.getContext(); const px=new Uint8Array(4);
          function t(n){ const a=performance.now(); for(let i=0;i<n;i++){ W.render(); } gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); return (performance.now()-a)/n; }
          t(3); const r=t(10); const a=performance.now(); W.tick(1,30); const u=(performance.now()-a)/30; return {renderMs:r.toFixed(1), updateMs:u.toFixed(2)}; }""")
        await b.close(); return r
async def main():
    for path in sys.argv[1:]:
        for q,e in [('medium',False),('low',False),('medium',True)]:
            print(path.split('/')[-1], q, 'easy' if e else '', await run(path,q,e))
asyncio.run(main())
