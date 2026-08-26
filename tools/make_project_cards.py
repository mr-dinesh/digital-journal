#!/usr/bin/env python3
"""Generate static/og/<slug>.png -- social cards for the deployed side projects.

The projects live in the Vibecoding monorepo but their cards are hosted here,
because three of them (juicesec, argus, s.mrdee.in) are single-file Cloudflare
Workers that would need extra routing code just to serve a PNG. mrdee.in is
already a static origin, so every project's og:image points at
https://mrdee.in/og/<slug>.png instead.

Each card uses its own project's background and accent so the preview matches
the page it links to.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUTDIR = ROOT / "static" / "og"

W, H = 1200, 630
MARGIN = 80
SIZE_BUDGET = 300 * 1024
FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")

# slug, display name, tagline, background, accent
PROJECTS = [
    ("juicesec", "JuiceSec",
     "Ten OWASP Top 10 vulnerabilities, exploitable in the browser, with an AI tutor that nudges instead of telling.",
     "#080c14", "#00d68f"),
    ("argus", "Argus",
     "Paste an argument. Get its steelman, its strawman, and the crux that actually decides it.",
     "#0d0d0f", "#6c63ff"),
    ("signal", "SIGNAL",
     "A live infosec feed stitched from Bluesky and Mastodon, refreshed every twenty seconds.",
     "#0a0e0c", "#7fd4e2"),
    ("afl-masterclass", "AFL Masterclass",
     "Coverage-guided fuzzing with AFL++, from first principles to adversarial critique.",
     "#0f1117", "#e6873a"),
    ("privyread", "PrivyRead",
     "Privacy-first reader. Strips 29 tracking parameters, returns clean text, keeps no history.",
     "#0d0d0d", "#c8a96e"),
    ("links", "mr-dinesh",
     "Everything I publish, in one place.",
     "#0a0a0a", "#7c9eff"),
    ("hn-blackout", "HN Blackout",
     "Blackout poetry from the Hacker News front page. Words found. Meaning made. The rest, erased.",
     "#0a0a0a", "#d8cfc0"),
]


def load_font(name, size):
    path = FONT_DIR / name
    if not path.exists():
        sys.exit(f"missing font: {path} -- install fonts-dejavu-core")
    return ImageFont.truetype(str(path), size)


def wrap(draw, text, font, max_width):
    lines, line = [], ""
    for word in text.split():
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


def mix(fg, bg, amount):
    """Blend fg toward bg so muted text stays readable after chat-app recompression."""
    return tuple(round(f * amount + b * (1 - amount)) for f, b in zip(fg, bg))


def build(slug, name, tagline, bg_hex, accent_hex):
    bg = tuple(int(bg_hex[i:i + 2], 16) for i in (1, 3, 5))
    accent = tuple(int(accent_hex[i:i + 2], 16) for i in (1, 3, 5))

    card = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(card)

    name_font = load_font("DejaVuSans-Bold.ttf", 92)
    tag_font = load_font("DejaVuSans.ttf", 40)
    foot_font = load_font("DejaVuSans-Bold.ttf", 28)

    # Accent bar down the left edge, echoing each project's own palette.
    draw.rectangle([0, 0, 12, H], fill=accent)

    y = 150
    draw.text((MARGIN, y), name, font=name_font, fill=(255, 255, 255))
    y += 118

    draw.rectangle([MARGIN, y, MARGIN + 180, y + 4], fill=accent)
    y += 44

    body = mix((255, 255, 255), bg, 0.72)
    for line in wrap(draw, tagline, tag_font, W - 2 * MARGIN - 40):
        draw.text((MARGIN, y), line, font=tag_font, fill=body)
        y += 54

    draw.text((MARGIN, H - MARGIN - 28), "mrdee.in", font=foot_font, fill=accent)

    OUTDIR.mkdir(parents=True, exist_ok=True)
    out = OUTDIR / f"{slug}.png"
    card.save(out, "PNG", optimize=True)

    if out.stat().st_size > SIZE_BUDGET:
        card.convert("P", palette=Image.ADAPTIVE, colors=128).save(
            out, "PNG", optimize=True
        )

    size = out.stat().st_size
    if size > SIZE_BUDGET:
        sys.exit(f"{out} is {size} bytes, over the {SIZE_BUDGET} budget")
    return out, size


def main():
    for spec in PROJECTS:
        out, size = build(*spec)
        print(f"{out.relative_to(ROOT)}  {size / 1024:6.1f} KB")


if __name__ == "__main__":
    main()
