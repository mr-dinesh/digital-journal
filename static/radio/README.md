# RadioOS

A single-file retro tuner for internet radio — Kannada & Hindi (All India Radio),
Radio Paradise, and SomaFM — served as a static page at
[mrdee.in/radio](https://mrdee.in/radio).

No backend, no build step. All logic runs in the browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup + all CSS (the tuner UI) |
| `radio.js` | Station list, playback, metadata polling, HLS handling |
| `fonts.css` + `fonts/` | Self-hosted Archivo, Chivo Mono, Noto Sans Kannada & Devanagari (mirrored from Google Fonts, `font-src 'self'`) |

## Stations

| Band | Stations | Stream type |
|---|---|---|
| ಕನ್ನಡ Kannada | Akashvani Bengaluru, Vividh Bharati BLR, Amruthavarshini | HLS (AIR) |
| | Radio Girmit, Suno FM | MP3/AAC |
| हिन्दी Hindi | Vividh Bharati (national), Raagam 24×7 | HLS (AIR) |
| | Radio Mirchi, Hindi Gold | MP3/AAC |
| Radio Paradise | Main, Mellow, Rock, Global | AAC |
| SomaFM | Groove Salad, Drone Zone, Secret Agent, DEF CON, Indie Pop | MP3 |

Stream URLs were sourced via [radio-browser.info](https://www.radio-browser.info/)
and verified reachable before inclusion. All India Radio (Prasar Bharati CDN) is the
stable core; the commercial stations are best-effort and their URLs may rotate.

## How it works

- **Playback:** `<audio>` plays MP3/AAC natively. HLS (`.m3u8`) only works natively on
  Safari/iOS, so [hls.js](https://github.com/video-dev/hls.js) is **lazy-loaded from
  jsDelivr only when an HLS station is tuned** — zero cost for the MP3 stations.
- **Now-playing + art:** each station declares a metadata provider; polling (15 s) runs
  only for stations that have one.

  | Provider | Stations | Song | Art |
  |---|---|---|---|
  | Radio Paradise API | RP ×4 | ✅ | ✅ |
  | SomaFM `/songs/<id>.json` | Soma ×5 | ✅ | — |
  | AzuraCast `/api/nowplaying/<id>` | Hindi Gold | ✅ | ✅ |
  | radiojar `/api/stations/<id>/now_playing/` | Radio Girmit | ✅ | ✅ |
  | HLS in-stream ID3 (best-effort) | AIR ×5 | ⚠️ if present | — |
  | none (live-only) | Suno FM, Radio Mirchi | — | — |

  Stations with no metadata show the station name + a LIVE indicator — never fabricated
  track data.
- **UI:** live search, filter chips (All / ★ Favorites / per-band), favorites and last
  station/volume persisted in `localStorage`, prev/next, a sticky mini-player on mobile,
  MediaSession lock-screen controls, and keyboard shortcuts
  (`space` play · `←/→` station · `↑/↓` volume).
- **Bilingual type:** Kannada/Devanagari station names render via `:lang()`; the album-art
  tile falls back to a Latin initial so a glyph always shows.

## Content-Security-Policy

This page needs external stream/metadata/CDN access that mrdee.in's strict global CSP
(`default-src 'self'`) blocks — note `media-src` silently falls back to `default-src`, so
external audio fails quietly. The rest of the site stays locked down; `/radio/*` gets a
**path-scoped CSP** in the repo's `static/_headers`. Key points:

- HLS segment hosts appear in **both** `connect-src` (hls.js XHR) and `media-src` (audio).
- Redirecting streams use wildcards (e.g. `https://*.streamtheworld.com`).
- hls.js spins up a blob Web Worker → `worker-src blob:`.

## Local development

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```

A `file://` open works too; a local server just behaves better for the metadata `fetch`
calls.

## Deploy

Part of the [digital-journal](https://github.com/mr-dinesh/digital-journal) Hugo site.
Files under `static/` are served as-is by Cloudflare Pages, so a `git push` to `main`
deploys this to `mrdee.in/radio/`. See `static/_headers` for the scoped CSP.

Written up at [mrdee.in/vibecoding](https://mrdee.in/vibecoding/) (Vibecoding 026).
