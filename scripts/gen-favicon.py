#!/usr/bin/env python3
"""Generate the mrdee.in icon set: ಎಂ.ಆರ್.ಡಿ. as a two-line lockup on a dark green tile.

    ಎಂ.ಆರ್.
    ಡಿ.

Off-white letters, the periods in brand yellow, on the same #0B2A20 green as
the social card. Both lines share one scale and a left edge, so it reads as a
typographic mark rather than text squeezed into a square. Kannada needs real
complex-script shaping (ಆರ್ is three codepoints that fuse into one cluster),
so the text goes through HarfBuzz once and the shaped outlines become paths;
nothing depends on a font at view time.

Dependencies:  pip install uharfbuzz fonttools cairosvg pillow
The font (Noto Sans Kannada, variable) is fetched from google/fonts into
scripts/.fonts/ on first run; that directory is gitignored.

Usage:  python3 scripts/gen-favicon.py
"""

import io
import subprocess
import sys
from pathlib import Path

import cairosvg
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
STATIC = ROOT / "static"
FONT_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskannada/"
    "NotoSansKannada%5Bwdth%2Cwght%5D.ttf"
)
FONT_FILE = ROOT / "scripts" / ".fonts" / "NotoSansKannada[wdth,wght].ttf"
# SemiBold: heavy enough to survive a 32px tab strip, light enough that the
# counters in ಎಂ and ಡಿ stay open.
WGHT = 600

LINES = ("ಎಂ.ಆರ್.", "ಡಿ.")
BG = "#0B2A20"      # tile, same green as static/og.png
FG = "#F6F1DC"      # letters
ACCENT = "#FFD400"  # the periods; brand yellow

SVG_SIZE = 700          # coordinate space shared with the previous icon
CORNER = 131            # rx of the previous icon, kept for continuity
PAD = 90                # left/right inset; the top line spans the rest
LINE_GAP = 0.10         # gap between lines as a fraction of the inner width
SUPERSAMPLE = 4

PNG_TARGETS = {
    16: "favicon-16x16.png",
    32: "favicon-32x32.png",
    180: "apple-touch-icon.png",
    192: "android-chrome-192x192.png",
    512: "android-chrome-512x512.png",
}


def ensure_font():
    if not FONT_FILE.exists():
        FONT_FILE.parent.mkdir(parents=True, exist_ok=True)
        print(f"fetching {FONT_URL}")
        subprocess.run(["curl", "-sSL", "-o", str(FONT_FILE), FONT_URL], check=True)
    tt = TTFont(FONT_FILE)
    if "fvar" in tt:
        tt = instancer.instantiateVariableFont(tt, {"wght": WGHT, "wdth": 100}, inplace=False)
    buf = io.BytesIO()
    tt.save(buf)
    return tt, buf.getvalue()


def shape(text, tt, data):
    """Shape `text` and return its glyphs as SVG paths in font units, y-down.

    Returns dict(glyphs=[(glyph_name, path_d)], x, y, w, h) with the ink box.
    """
    face = hb.Face(data)
    font = hb.Font(face)
    font.scale = (face.upem, face.upem)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": True})

    glyph_set = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    glyphs, x, y = [], 0, 0
    x0, y0, x1, y1 = 1e9, 1e9, -1e9, -1e9
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        if name == ".notdef":
            sys.exit(f"{text!r} did not shape — font missing Kannada coverage")
        gx, gy = x + pos.x_offset, y + pos.y_offset
        bounds = BoundsPen(glyph_set)
        glyph_set[name].draw(bounds)
        if bounds.bounds:
            bx0, by0, bx1, by1 = bounds.bounds
            x0, x1 = min(x0, gx + bx0), max(x1, gx + bx1)
            y0, y1 = min(y0, -(gy + by1)), max(y1, -(gy + by0))
        pen = SVGPathPen(glyph_set)
        glyph_set[name].draw(TransformPen(pen, (1, 0, 0, -1, gx, -gy)))
        d = pen.getCommands()
        if d:
            glyphs.append((name, d))
        x += pos.x_advance
        y += pos.y_advance
    if len(glyphs) != len(buf.glyph_infos):
        sys.exit(f"{text!r}: {len(buf.glyph_infos)} glyphs but {len(glyphs)} outlines — empty glyphs, check the font")
    return {"glyphs": glyphs, "x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0}


def paths(run, tx, ty, scale):
    parts = []
    for name, d in run["glyphs"]:
        fill = ACCENT if "period" in name.lower() else FG
        parts.append(f'<path fill="{fill}" d="{d}"/>')
    return f'<g transform="translate({tx:.2f},{ty:.2f}) scale({scale:.5f})">' + "".join(parts) + "</g>"


def compose(tt, data):
    top, bottom = (shape(line, tt, data) for line in LINES)
    inner = SVG_SIZE - 2 * PAD
    scale = inner / top["w"]
    line_h = max(top["h"], bottom["h"]) * scale
    gap = inner * LINE_GAP
    y = (SVG_SIZE - (2 * line_h + gap)) / 2

    def place(run, line_top):
        # left-align on the ink box; centre each run vertically within the line box
        return paths(
            run,
            PAD - run["x"] * scale,
            line_top - run["y"] * scale + (line_h - run["h"] * scale) / 2,
            scale,
        )

    return (
        f'<svg viewBox="0 0 {SVG_SIZE} {SVG_SIZE}" xmlns="http://www.w3.org/2000/svg">\n'
        f'<rect width="{SVG_SIZE}" height="{SVG_SIZE}" rx="{CORNER}" ry="{CORNER}" fill="{BG}"/>\n'
        f"{place(top, y)}\n{place(bottom, y + line_h + gap)}\n</svg>\n"
    )


def render_png(svg, size):
    big = size * SUPERSAMPLE
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=big, output_height=big)
    return Image.open(io.BytesIO(png)).convert("RGBA").resize((size, size), Image.LANCZOS)


def main():
    tt, data = ensure_font()
    svg = compose(tt, data)
    (STATIC / "favicon.svg").write_text(svg, encoding="utf-8")
    print(f"  favicon.svg  ({len(svg)} bytes)")
    for size, name in PNG_TARGETS.items():
        render_png(svg, size).save(STATIC / name, optimize=True)
        print(f"  {name}")
    render_png(svg, 48).save(STATIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  favicon.ico (16/32/48)")


if __name__ == "__main__":
    main()
