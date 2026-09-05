#!/usr/bin/env python3
"""Generate static/og/mandala.png -- the social card for /mandala/.

The other project cards come from tools/make_project_cards.py, which draws
text on a flat background with Pillow. That is the wrong shape for this one:
Mandala Studio's whole point is what it draws, so the card runs the actual
generator and photographs the result.

It does that by building a throwaway harness page that reuses the app's real
markup and CSS verbatim (extracted from static/mandala/index.html) and loads
the real static/mandala/app.js. app.js queries about two dozen element IDs and
calls generate() on load, so reusing the app's own body is what satisfies that
contract without maintaining a second copy of it here. The harness then hides
the header and controls, leaving only the canvas, and lays the title beside it.

Because the generator is random, every run produces a different mandala. That
is deliberate -- re-run until you get one you like. It also means the output is
not byte-reproducible, so the PNG is committed rather than built on deploy.

The card is quantized to 256 colours to stay under the 300 KB budget that
make_project_cards.py enforces; at card size the banding is not visible.

Dependencies:  pip install pillow  (plus a Chromium binary)
Usage:         python3 tools/og/mandala-card.py [--keep] [--out PATH]
               CHROMIUM=/path/to/chrome python3 tools/og/mandala-card.py
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
APP = ROOT / "static" / "mandala"
OUT = ROOT / "static" / "og" / "mandala.png"

W, H = 1200, 630
MARGIN = 80
COLORS = 256
SIZE_BUDGET = 300 * 1024

TITLE = "Mandala<br>Studio"
TAGLINE = ("Draw with radial symmetry, or generate one from 19 motifs, "
           "24 palettes and 9 colour harmonies.")
URL = "mrdee.in/mandala"

# Straight from the app's :root, so the card matches the page it links to.
INK, SAFFRON, TEXT, DIM = "#0e0d12", "#e0a63c", "#d8d3c8", "#8a8578"


def find_chromium():
    if os.environ.get("CHROMIUM"):
        return os.environ["CHROMIUM"]
    for name in ("chromium", "chromium-browser", "google-chrome", "chrome"):
        if (p := shutil.which(name)):
            return p
    for p in Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome"):
        return str(p)
    sys.exit("no Chromium found -- set CHROMIUM=/path/to/chrome")


def build_harness(dest: Path):
    src = (APP / "index.html").read_text(encoding="utf-8")
    style = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
    body = re.search(r"<body>(.*?)<script", src, re.S).group(1)
    body = body.replace('id="showGuides" checked', 'id="showGuides"')  # no guide lines

    (dest / "app.js").write_bytes((APP / "app.js").read_bytes())
    (dest / "card.html").write_text(f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<style>
{style}
html,body{{width:{W}px;height:{H}px;overflow:hidden}}
body{{display:block;padding:0;position:relative;background:{INK}}}
header,.controls,.caption,.guides{{display:none !important}}
.stage{{position:absolute;width:530px;top:50px;left:640px}}
canvas#board{{box-shadow:none;border-radius:50%}}
.glow{{position:absolute;width:900px;height:900px;left:460px;top:-135px;border-radius:50%;
  background:radial-gradient(circle,rgba(224,166,60,.10),transparent 62%)}}
.card-text{{position:absolute;left:{MARGIN}px;top:0;height:{H}px;width:520px;
  display:flex;flex-direction:column;justify-content:center;gap:20px}}
.card-text h1{{font-family:Georgia,'Liberation Serif',serif;font-weight:600;font-size:74px;
  line-height:1.02;color:{SAFFRON};letter-spacing:.01em}}
.card-text p{{font-family:Georgia,'Liberation Serif',serif;font-size:27px;line-height:1.45;color:{TEXT}}}
.card-text .url{{font-family:Georgia,'Liberation Serif',serif;font-size:23px;color:{DIM};letter-spacing:.06em}}
.rule{{width:64px;height:2px;background:{SAFFRON}}}
</style></head>
<body>
<div class="glow"></div>
{body}
<div class="card-text">
  <h1>{TITLE}</h1>
  <div class="rule"></div>
  <p>{TAGLINE}</p>
  <div class="url">{URL}</div>
</div>
<script src="app.js"></script>
</body></html>""", encoding="utf-8")
    return dest / "card.html"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, default=OUT)
    ap.add_argument("--keep", action="store_true", help="keep the harness for debugging")
    args = ap.parse_args()

    tmp = Path(tempfile.mkdtemp(prefix="mandala-card-"))
    card = build_harness(tmp)
    shot = tmp / "shot.png"

    subprocess.run([
        find_chromium(), "--headless=new", "--no-sandbox", "--disable-gpu",
        "--hide-scrollbars", "--force-device-scale-factor=1",
        "--virtual-time-budget=5000", f"--window-size={W},{H}",
        f"--screenshot={shot}", card.as_uri(),
    ], check=True, capture_output=True)

    img = Image.open(shot).convert("RGB")
    if img.size != (W, H):
        sys.exit(f"expected {W}x{H}, got {img.size}")
    img.quantize(colors=COLORS, method=Image.MEDIANCUT,
                 dither=Image.FLOYDSTEINBERG).save(args.out, optimize=True)

    size = args.out.stat().st_size
    try:
        shown = args.out.resolve().relative_to(ROOT)
    except ValueError:          # --out pointed outside the repo
        shown = args.out
    print(f"wrote {shown}  {W}x{H}  {size/1024:.0f} KB")
    if size > SIZE_BUDGET:
        print(f"WARNING: over the {SIZE_BUDGET//1024} KB budget", file=sys.stderr)

    if args.keep:
        print(f"harness kept at {tmp}")
    else:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
