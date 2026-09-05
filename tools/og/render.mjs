#!/usr/bin/env node
/**
 * Generate static/og.png -- the 1200x630 social card used for link previews.
 *
 * The og:image / twitter:image tags come from `images = ["og.png"]` in
 * hugo.toml; this script draws the file those tags point at. It composes an
 * SVG (also written to tools/og/og.svg for review) and rasterizes it with
 * sharp. The logo glyph is the ಡಿ mark from tools/og/glyph.svg (the site's
 * original favicon); the favicon itself is now the ಎಂ.ಆರ್.ಡಿ. lockup from
 * scripts/gen-favicon.py.
 *
 * Usage:
 *   cd tools/og && npm install --no-save sharp && node render.mjs [--2x]
 *
 * --2x additionally writes a 1600x840 og@2x.png next to the SVG (not into
 * static/ -- Hugo's opengraph/twitter partials only take one image, so nothing
 * on the site references it).
 *
 * Re-run whenever TAGLINE changes. It must match `description` in
 * content/_index.md, which is what the homepage og:description emits.
 */

import { readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const GLYPH_SRC = resolve(HERE, "glyph.svg");
const SVG_OUT = resolve(HERE, "og.svg");
const PNG_OUT = resolve(ROOT, "static", "og.png");
const PNG_2X_OUT = resolve(HERE, "og@2x.png");

const W = 1200;
const H = 630;
const MARGIN = 80;

// Brand yellow: the favicon / manifest / previous card all use #FFD400.
const YELLOW = "#FFD400";
// Dark green ground. The site itself is Congo "slate" (neutral greys); there
// is no green in its CSS to sample, so this is chosen to sit under #FFD400.
const GREEN = "#0B2A20";
// Warm off-white for the tagline, drawn at 70% opacity.
const PAPER = "#F6F1DC";

const TAGLINE = ["Cybersecurity.", "Small projects, shipped and written up honestly."];

// Same stack the site ships (Tailwind's ui-sans-serif, system-ui, sans-serif);
// on the render host fontconfig resolves it to DejaVu Sans, which is also what
// the previous card used.
const FONT = "'DejaVu Sans', system-ui, ui-sans-serif, sans-serif";
const SIZE_BUDGET = 300 * 1024;

function glyphPath() {
  const svg = readFileSync(GLYPH_SRC, "utf8");
  const m = svg.match(/<path[^>]*\sd="([^"]+)"/);
  if (!m) throw new Error(`no <path d> in ${GLYPH_SRC}`);
  return m[1];
}

function compose() {
  // The favicon path lives in a 0..~525 x 0..~530 box (before the favicon's
  // own translate). Scaled by 0.3 it lands at ~158px square at the top-left.
  const glyph = glyphPath();
  const ruleY = 380;
  const tickY = H - 26;
  const ticks = [0, 36, 72]
    .map((dx) => `<rect x="${MARGIN + dx}" y="${tickY}" width="4" height="26" fill="${YELLOW}"/>`)
    .join("\n    ");
  const tagline = TAGLINE.map(
    (line, i) =>
      `<text x="${MARGIN}" y="${446 + i * 52}" font-family="${FONT}" font-size="40" fill="${PAPER}" fill-opacity="0.7">${line}</text>`
  ).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${GREEN}"/>
  <!-- logo glyph: ಡಿ, from tools/og/glyph.svg -->
  <g transform="translate(${MARGIN} 62) scale(0.3)">
    <path fill="${YELLOW}" d="${glyph}"/>
  </g>
  <text x="${MARGIN}" y="350" font-family="${FONT}" font-size="110" font-weight="700" fill="${YELLOW}">mrdee.in</text>
  <!-- thin rule under the wordmark; the three ticks at the bottom edge repeat its 4px weight,
       one per section: Vibecoding / Notes / Reading -->
  <rect x="${MARGIN}" y="${ruleY}" width="260" height="4" fill="${YELLOW}"/>
  ${tagline}
  <g>
    ${ticks}
  </g>
</svg>
`;
}

async function render(svg, width, height, out) {
  const density = 72 * (width / W);
  await sharp(Buffer.from(svg), { density })
    .resize(width, height)
    .png({ compressionLevel: 9, palette: true, colours: 256 })
    .toFile(out);
  const size = statSync(out).size;
  console.log(`wrote ${out} (${(size / 1024).toFixed(1)} KB)`);
  return size;
}

const svg = compose();
writeFileSync(SVG_OUT, svg);
console.log(`wrote ${SVG_OUT}`);

const size = await render(svg, W, H, PNG_OUT);
// WhatsApp silently falls back to a small thumbnail if the banner is too heavy.
if (size > SIZE_BUDGET) {
  console.error(`og.png is ${size} bytes, over the ${SIZE_BUDGET} budget`);
  process.exit(1);
}
if (process.argv.includes("--2x")) {
  await render(svg, 1600, 840, PNG_2X_OUT);
}
