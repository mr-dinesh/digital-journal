#!/usr/bin/env python3
"""Generate static/og.png -- the 1200x630 social card used for link previews.

WhatsApp, Slack, Mastodon and friends read og:image, never the favicon. The tag
itself comes from `images = ["og.png"]` in hugo.toml; this script draws the file
that tag points at. Re-run it whenever the tagline in content/_index.md changes.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
MARK = ROOT / "static" / "android-chrome-512x512.png"
OUT = ROOT / "static" / "og.png"

W, H = 1200, 630
MARGIN = 80
YELLOW = (255, 212, 0)
BLACK = (0, 0, 0)

# Must match the `description` in content/_index.md, which is what overrides the
# site description in the homepage og:description.
TAGLINE = "Security leader. Builder. Vibecoding."

FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")
SIZE_BUDGET = 300 * 1024


def load_font(name, size):
    path = FONT_DIR / name
    if not path.exists():
        sys.exit(f"missing font: {path} -- install fonts-dejavu-core")
    return ImageFont.truetype(str(path), size)


def wrap(draw, text, font, max_width):
    words, lines, line = text.split(), [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def main():
    card = Image.new("RGB", (W, H), YELLOW)
    draw = ImageDraw.Draw(card)

    # The mark is already black-on-#FFD400, so it composites onto the card with
    # no visible seam. Using it as its own mask keeps the rounded corners clean.
    mark = Image.open(MARK).convert("RGBA").resize((110, 110), Image.LANCZOS)
    card.paste(mark, (MARGIN, 108), mark)

    title_font = load_font("DejaVuSans-Bold.ttf", 104)
    tag_font = load_font("DejaVuSans.ttf", 44)

    y = 288
    draw.text((MARGIN, y), "mrdee.in", font=title_font, fill=BLACK)
    y += 130

    draw.rectangle([MARGIN, y, MARGIN + 260, y + 4], fill=BLACK)
    y += 46

    for line in wrap(draw, TAGLINE, tag_font, W - 2 * MARGIN):
        draw.text((MARGIN, y), line, font=tag_font, fill=(51, 43, 0))
        y += 58

    card.save(OUT, "PNG", optimize=True)

    # Flat-colour art quantises losslessly in practice, and WhatsApp silently
    # falls back to a small thumbnail if the banner is too heavy.
    if OUT.stat().st_size > SIZE_BUDGET:
        card.convert("P", palette=Image.ADAPTIVE, colors=64).save(
            OUT, "PNG", optimize=True
        )

    size = OUT.stat().st_size
    if size > SIZE_BUDGET:
        sys.exit(f"og.png is {size} bytes, over the {SIZE_BUDGET} budget")
    print(f"wrote {OUT} ({size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
