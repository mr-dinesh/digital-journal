#!/usr/bin/env python3
"""Generate the mrdee.in icon set: black Kannada ಡಿ on a gold rounded square.

Visual reference is sive.rs/favicon.svg — a flat coloured square with the
letter as an outlined path, no font dependency at view time.

ಡಿ is two codepoints (U+0CA1 consonant + U+0CBF vowel sign), so it needs real
complex-script shaping. Everything here goes through PangoCairo exactly once:
the shaped glyph becomes a cairo path, and that single path is used for both
the SVG "d" attribute and every raster size.

Deliberately NOT using PIL for text. Importing gi/PangoCairo pulls a second
HarfBuzz into the process, and PIL's shaping then disagrees with Pango's —
at large font sizes it reports garbage metrics (widths in the hundreds of
thousands) and blows up. PIL is used only for resizing and ICO packing, where
no font is involved.

Usage:  nice -n 19 python3 scripts/gen-favicon.py
"""

import io
import math
import subprocess
import sys
from pathlib import Path

import cairo
import gi

gi.require_version("Pango", "1.0")
gi.require_version("PangoCairo", "1.0")
from gi.repository import Pango, PangoCairo  # noqa: E402

from PIL import Image  # noqa: E402

GLYPH = "ಡಿ"  # U+0CA1 + U+0CBF; must stay two codepoints
BG = "#FFD400"
FG = "#000000"
FONT_QUERY = "Noto Sans Kannada:weight=bold"
# Bold rather than Black on purpose: ಡಿ has tight counters, and at 16px the
# Black weight floods them into a solid blob. Bold keeps the letter readable
# in a tab strip while staying heavy enough for the sive.rs look.
FONT_DESC = "Noto Sans Kannada Bold"

CORNER_RATIO = 6 / 32  # matches the rx=6 of the previous 32px icon
GLYPH_RATIO = 0.75  # glyph ink box as a fraction of the canvas
SVG_SIZE = 700  # same coordinate space as the sive.rs reference
SUPERSAMPLE = 4  # render large, downsample with LANCZOS
PANGO_SIZE = 512  # font size used to trace the outline

STATIC = Path(__file__).resolve().parent.parent / "static"

PNG_TARGETS = {
    16: "favicon-16x16.png",
    32: "favicon-32x32.png",
    180: "apple-touch-icon.png",
    192: "android-chrome-192x192.png",
    512: "android-chrome-512x512.png",
}


def hex_to_rgb01(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))


def check_font():
    out = subprocess.run(
        ["fc-match", "-f", "%{file}", FONT_QUERY],
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()
    if not out or "kannada" not in out.lower():
        sys.exit(f"No Kannada font matched {FONT_QUERY!r} (got {out!r})")
    return out


def trace_glyph():
    """Shape GLYPH and return (segments, ink_width, ink_height).

    Segments are ('M'|'L'|'Z', points) with the ink box origin at (0, 0).
    """
    ctx = cairo.Context(cairo.RecordingSurface(cairo.CONTENT_ALPHA, None))
    layout = PangoCairo.create_layout(ctx)
    layout.set_font_description(Pango.FontDescription(f"{FONT_DESC} {PANGO_SIZE}"))
    layout.set_text(GLYPH, -1)

    ink, _logical = layout.get_extents()
    w, h = ink.width / Pango.SCALE, ink.height / Pango.SCALE
    if w <= 0 or h <= 0:
        sys.exit("Shaped glyph has empty ink extents — font missing or unshaped")
    # A tofu box is a plain rectangle: 4 corners, one subpath. Real Kannada
    # outlines are far busier, so segment count is a usable smoke test.
    ctx.move_to(-ink.x / Pango.SCALE, -ink.y / Pango.SCALE)
    PangoCairo.layout_path(ctx, layout)

    segments = []
    for kind, pts in ctx.copy_path_flat():
        if kind == cairo.PATH_MOVE_TO:
            segments.append(("M", pts))
        elif kind == cairo.PATH_LINE_TO:
            segments.append(("L", pts))
        elif kind == cairo.PATH_CLOSE_PATH:
            segments.append(("Z", ()))

    if len(segments) < 20:
        sys.exit(f"Outline has only {len(segments)} segments — looks like tofu")
    return segments, w, h


def place(size):
    """Uniform scale + offset putting the ink box centred at GLYPH_RATIO."""
    _, w, h = GLYPH_CACHE
    scale = (size * GLYPH_RATIO) / max(w, h)
    return scale, (size - w * scale) / 2, (size - h * scale) / 2


def rounded_rect(ctx, size, radius):
    r = radius
    ctx.new_sub_path()
    ctx.arc(size - r, r, r, -math.pi / 2, 0)
    ctx.arc(size - r, size - r, r, 0, math.pi / 2)
    ctx.arc(r, size - r, r, math.pi / 2, math.pi)
    ctx.arc(r, r, r, math.pi, 3 * math.pi / 2)
    ctx.close_path()


def paint_icon(ctx, size):
    segments, _, _ = GLYPH_CACHE
    ctx.set_source_rgb(*hex_to_rgb01(BG))
    rounded_rect(ctx, size, size * CORNER_RATIO)
    ctx.fill()

    scale, tx, ty = place(size)
    ctx.save()
    ctx.translate(tx, ty)
    ctx.scale(scale, scale)
    ctx.new_path()
    for kind, pts in segments:
        if kind == "M":
            ctx.move_to(*pts)
        elif kind == "L":
            ctx.line_to(*pts)
        else:
            ctx.close_path()
    ctx.restore()
    ctx.set_source_rgb(*hex_to_rgb01(FG))
    ctx.fill()


def write_svg(dest):
    segments, w, h = GLYPH_CACHE
    scale, tx, ty = place(SVG_SIZE)
    radius = round(SVG_SIZE * CORNER_RATIO)

    d = []
    for kind, pts in segments:
        if kind == "Z":
            d.append("Z")
        else:
            d.append(f"{kind}{pts[0]:.2f},{pts[1]:.2f}")
    path_d = "".join(d)

    svg = f"""<svg viewBox="0 0 {SVG_SIZE} {SVG_SIZE}" xmlns="http://www.w3.org/2000/svg">
<rect x="0" y="0" width="{SVG_SIZE}" height="{SVG_SIZE}" rx="{radius}" ry="{radius}" fill="{BG}"/>
<g transform="translate({tx:.2f},{ty:.2f}) scale({scale:.5f})">
<path fill="{FG}" d="{path_d}"/>
</g>
</svg>
"""
    dest.write_text(svg, encoding="utf-8")
    print(f"  favicon.svg  ({len(svg)} bytes)")


def render_png(size):
    big = size * SUPERSAMPLE
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, big, big)
    paint_icon(cairo.Context(surface), big)

    buf = io.BytesIO()
    surface.write_to_png(buf)
    buf.seek(0)
    img = Image.open(buf).convert("RGBA")
    return img.resize((size, size), Image.LANCZOS)


def main():
    global GLYPH_CACHE
    print(f"font: {check_font()}")
    GLYPH_CACHE = trace_glyph()
    print(f"outline: {len(GLYPH_CACHE[0])} segments")

    STATIC.mkdir(parents=True, exist_ok=True)

    print("svg:")
    write_svg(STATIC / "favicon.svg")

    print("png:")
    for size, name in PNG_TARGETS.items():
        render_png(size).save(STATIC / name)
        print(f"  {name}")

    # Multi-size ICO, up from the previous 16x16-only file.
    render_png(48).save(STATIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("  favicon.ico (16/32/48)")


if __name__ == "__main__":
    main()
