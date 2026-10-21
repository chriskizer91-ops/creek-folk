#!/usr/bin/env python3
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3; scale = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
fs = sorted(glob.glob(os.path.join(d, '*.png')))
ims = [Image.open(f).convert('RGB') for f in fs]
w, h = int(ims[0].width * scale), int(ims[0].height * scale)
rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * (h + 18)), 'white'); D = ImageDraw.Draw(S)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * w, (i // cols) * (h + 18)
    S.paste(im.resize((w, h), Image.NEAREST), (x, y + 18)); D.text((x + 4, y + 3), os.path.basename(f), fill='black')
S.save(out); print(out, S.size)
