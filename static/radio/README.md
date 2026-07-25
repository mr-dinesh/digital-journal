# RadioOS

A single-file retro tuner for internet radio — Kannada & Hindi (All India Radio),
Radio Paradise, and SomaFM — served as a static page at
[mrdee.in/radio](https://mrdee.in/radio).

No backend, no build step. All logic runs in the browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup + all CSS (the tuner UI) |
| `radio.js` | Station list, playback, metadata polling, HLS handling, spectrum |
| `fonts.css` + `fonts/` | Self-hosted fonts, mirrored from Google Fonts (`font-src 'self'`): Archivo, Chivo Mono, Noto Sans Kannada, Noto Sans Devanagari, plus Orbitron and Playfair Display for the station wordmarks |

Asset references are versioned (`radio.js?v=N`, `fonts.css?v=N`) so an update bypasses
the browser's asset cache — bump the number when you change the file.

## Stations

| Band | Stations | Stream type |
|---|---|---|
| ಕನ್ನಡ Kannada | Akashvani Bengaluru, Vividh Bharati BLR, Amruthavarshini | HLS (AIR) |
| | Kannada Hits, Suno FM | MP3/AAC |
| हिन्दी Hindi | Vividh Bharati (national), Raagam 24×7 | HLS (AIR) |
| | Radio Mirchi, Hindi Gold | MP3/AAC |
| Radio Paradise | Main, Mellow, Rock, Global | AAC |
| SomaFM | Groove Salad, Drone Zone, Secret Agent, DEF CON, Indie Pop | MP3 |

Stream URLs were sourced via [radio-browser.info](https://www.radio-browser.info/)
and verified reachable before inclusion. All India Radio (Prasar Bharati CDN) is the
stable core; the commercial stations are best-effort and their URLs may rotate. Streams
that redirect to plain `http://` are excluded (mixed content on an HTTPS page).

## How it works

- **Playback:** `<audio>` plays MP3/AAC natively. HLS (`.m3u8`) only works natively on
  Safari/iOS, so [hls.js](https://github.com/video-dev/hls.js) is lazy-loaded from
  jsDelivr only when an HLS station is tuned — zero cost for the MP3 stations. No
  `crossorigin` attribute: it forces a CORS check on every redirect hop and breaks the
  streams that 302 to CORS-less CDN nodes.
- **Now-playing + art:** each station declares a metadata provider; polling (15 s) runs
  only for stations that have one.

  | Provider | Stations | Song | Art |
  |---|---|---|---|
  | Radio Paradise API | RP ×4 | ✅ | ✅ |
  | SomaFM `/songs/<id>.json` | Soma ×5 | ✅ | — |
  | AzuraCast `/api/nowplaying/<id>` | Hindi Gold | ✅ | ✅ |
  | HLS in-stream ID3 (best-effort) | AIR ×5 | ⚠️ if present | — |
  | none (live-only) | Kannada Hits, Suno FM, Radio Mirchi | — | — |

  Stations with no metadata show the station name + a LIVE indicator — never fabricated
  track data.
- **Station wordmarks:** each station's name is its logo, in a font chosen for its
  language/genre — Kannada and Hindi in their native scripts, Orbitron for SomaFM,
  Playfair Display for Radio Paradise, tinted per band.
- **Spectrum:** a simulated Winamp-style bar spectrum animates in the now-playing panel
  while a station plays. It is not audio-reactive — reading the real audio needs a
  CORS-tainted media element, which these streams don't allow.
- **UI:** live search, filter chips (All / ★ Favorites / per-band), favorites and last
  station/volume persisted in `localStorage`, prev/next, a sticky mini-player on mobile,
  MediaSession lock-screen controls, and keyboard shortcuts
  (`space` play · `←/→` station · `↑/↓` volume).

## Content-Security-Policy

The streams, metadata APIs, hls.js CDN, and album-art hosts are all cross-origin, so the
site's CSP (in `static/_headers`) has to allow them. One gotcha: Cloudflare Pages
`_headers` **appends** a per-path CSP alongside the catch-all `/*` rather than overriding
it, and browsers enforce the intersection — a `/radio/*` rule can't loosen a strict
`/*`. So there is a single site-wide CSP that also covers RadioOS's needs (`media-src
blob: https:`, `worker-src blob:` for the hls.js worker, jsDelivr in `script-src`, the
metadata hosts in `connect-src`). It adds no new `script-src` origin beyond jsDelivr, so
the blog's XSS posture is unchanged. Note that `media-src` falls back to `default-src`
when unset — leave it out and every external stream is silently blocked.

## Local development

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```

The single-file source lives in a scratch folder and uses a Google Fonts `<link>`; the
deployed copy here splits out `radio.js` and self-hosts the fonts.

## Deploy

Part of the [digital-journal](https://github.com/mr-dinesh/digital-journal) Hugo site.
Files under `static/` are served as-is by Cloudflare Pages, so a `git push` to `main`
deploys this to `mrdee.in/radio/`.

Written up at [mrdee.in/vibecoding](https://mrdee.in/vibecoding/) (Vibecoding 026).
