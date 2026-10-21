#!/usr/bin/env python3
"""Build What the Water Brings into one offline HTML file: out/game.html"""
import os,sys
here=os.path.dirname(os.path.abspath(__file__))
src=os.path.join(here,'src')
order=open(os.path.join(src,'ORDER')).read().split('\n')
game='\n'.join(open(os.path.join(src,n),encoding='utf8').read() for n in order)
tmpl=open(os.path.join(src,'template.html'),encoding='utf8').read()
three=open(os.path.join(here,'vendor','three.min.js'),encoding='utf8').read()
html=tmpl.replace('/*@@THREE@@*/',three,1).replace('/*@@GAME@@*/',game,1)
os.makedirs(os.path.join(here,'out'),exist_ok=True)
out=os.path.join(here,'out','game.html')
open(out,'w',encoding='utf8').write(html)
print(out,len(html.encode('utf8')),'bytes')
# the published version: the Artifact host wraps the page in its own doctype, head and body, so leave those out
head='<body>\n'; i=html.index(head)+len(head); j=html.rindex('</body></html>')
art=os.path.join(here,'out','what-the-water-brings.html')
open(art,'w',encoding='utf8').write(html[i:j])
print(art,len(html[i:j].encode('utf8')),'bytes')
