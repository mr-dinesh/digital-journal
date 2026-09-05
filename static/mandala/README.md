# Mandala Studio

A single-page mandala tool served at [mrdee.in/mandala](https://mrdee.in/mandala/).
Draw with radial symmetry, or generate one procedurally.

No backend, no build step, no external requests. All logic runs in the browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup, all CSS, and the `<head>` metadata (OG/Twitter card, canonical, favicon) |
| `app.js` | Canvas setup, the generator, motif drawing, palettes and inks, pointer handling |

`app.js` is referenced as `app.js?v=1` so an update bypasses the browser's asset
cache — bump the number when you change the file. Same convention as `radio.js?v=N`.

## Why the JS is a separate file

The source was one self-contained HTML file with the script inline. The site's CSP
(`static/_headers`) sets `script-src 'self'` with no `'unsafe-inline'`, so an inline
`<script>` is blocked in production while still working from `file://` — it would have
failed silently once deployed. Splitting the script out is what makes it run under the
site's own policy, and it matches `kernel-plan/` and `radio/`, which do the same.

The Google Fonts `<link>` tags (Cormorant Garamond) were removed for the same reason:
`font-src 'self'` blocks them, and `default-src 'self'` blocks the stylesheet. The page
now uses `Georgia, serif`, which was already the declared fallback.

## Browser support

`ctx.createConicGradient()` (Chrome 108+, Safari 16+, Firefox 120+) is used for conic
inks and for the exported PNG background. Both call sites are feature-guarded and fall
back to a linear or radial gradient, so older browsers render slightly differently
rather than failing.

The on-screen canvas background is a **CSS** `conic-gradient` set from JS
(`canvas.style.background`). That one has no fallback: a browser without CSS
conic-gradient support (pre-2019) ignores the assignment and the canvas keeps the flat
`#121118` from the stylesheet. On Safari 12.1 to 15 the on-screen background can be
conic while the downloaded PNG falls back to radial, because the CSS feature shipped
years before the canvas one.
