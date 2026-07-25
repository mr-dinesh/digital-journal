# RadioOS — as-built notes

Shipped and live at [mrdee.in/radio](https://mrdee.in/radio). Written up as Vibecoding 026.
Source: this folder's `radio-os-4.html` (single file). Deployed copy:
`digital-journal/static/radio/` (`index.html` + `radio.js` + self-hosted `fonts/`).

## Stations
- **Kannada:** Akashvani Bengaluru, Vividh Bharati, Amruthavarshini (AIR/HLS); Kannada Hits, Suno FM (MP3).
- **Hindi:** Vividh Bharati national, Raagam (AIR/HLS); Radio Mirchi, Hindi Gold (MP3).
- **Radio Paradise** ×4, **SomaFM** ×5.
- AIR (Prasar Bharati CDN) is the stable core; commercial streams rotate and get swapped when they die (Radio Girmit → Kannada Hits was the first such swap; Girmit redirected to plain `http://`, unusable on HTTPS).

## Now-playing + art
Polling (15 s) runs only for stations with a provider:
- Radio Paradise API — song + art.
- SomaFM `/songs/<id>.json` — song only.
- AzuraCast `/api/nowplaying/hindi_gold` — song + art (title/artist reversed at source; not our bug).
- AIR HLS in-stream ID3 — best-effort, if present.
- Everything else is live-only (station name + LIVE). Never fabricate a track title.

## Look
- Station names as wordmarks: Kannada/Devanagari native scripts, Orbitron for SomaFM, Playfair for Radio Paradise; per-band colours.
- Simulated Winamp spectrum in the now-playing panel (decorative — audio-reactive would need a CORS-tainted media element the streams don't allow).
- Fonts self-hosted (mirrored from Google Fonts) so the page makes no third-party call.

## Things that bit (keep in mind for future static apps here)
1. **`crossorigin="anonymous"` breaks these streams** — it forces a CORS check on every redirect hop, and CDN edge nodes don't send CORS headers. Don't add it.
2. **Cloudflare Pages `_headers` appends CSP across matching rules** — a `/radio/*` block does not override the `/*` CSP; browsers enforce the intersection, so `default-src 'self'` still wins and blocks media. Fix: one site-wide CSP that also covers radio (`media-src blob: https:`, `worker-src blob:`, jsDelivr in `script-src`, metadata hosts in `connect-src`). `media-src` falls back to `default-src` when unset.
3. **Assets are cached ~4 h** — version the refs (`radio.js?v=N`, `fonts.css?v=N`) and bump on change, or updates don't reach users.
4. When verifying CSP from a script, read **all** `Content-Security-Policy` headers (`get_all`), not just the first.

## Deploy
`git push` to `digital-journal` main → Cloudflare Pages auto-builds. Static files under
`static/` serve as-is. CSP lives in `static/_headers` (single site-wide rule).
