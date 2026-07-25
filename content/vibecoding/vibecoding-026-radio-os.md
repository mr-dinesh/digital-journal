---
title: "Vibecoding 026 — RadioOS: Kannada & Hindi internet radio, and the CSP that fights audio"
date: 2026-07-25
description: "A single-file retro tuner for All India Radio (Kannada + Hindi), Radio Paradise, and SomaFM — with live now-playing art, lazy-loaded HLS, and the story of how a strict default-src 'self' Content-Security-Policy silently breaks a streaming app."
tags: ["vibecoding", "javascript", "radio", "hls", "csp", "cloudflare"]
aliases: ["/writing/vibecoding-026-radio-os/"]
weight: -26
---

I had a retro tuner UI sitting in a scratch folder — a nice amber-on-black hi-fi thing that played Radio Paradise and SomaFM. What it didn't play was the radio I actually grew up with: All India Radio, in Kannada and Hindi. So I extended it, then spent most of the time not on the UI but on two things nobody warns you about — where the *real* stream URLs live, and how a good Content-Security-Policy will silently strangle an audio app.

**Live:** [mrdee.in/radio](https://mrdee.in/radio)

## What it does

One HTML file. A tuner window shows now-playing (with album art where the station provides it), a transport row, live search, filter chips, favourites, and a sticky mini-player on mobile. Four bands:

| Band | Stations | Source |
|---|---|---|
| ಕನ್ನಡ Kannada | Akashvani Bengaluru, Vividh Bharati BLR, Amruthavarshini, Radio Girmit, Suno FM | All India Radio + commercial |
| हिन्दी Hindi | Vividh Bharati (national), Raagam 24×7, Radio Mirchi, Hindi Gold | All India Radio + commercial |
| Radio Paradise | Main, Mellow, Rock, Global | Radio Paradise |
| SomaFM | Groove Salad, Drone Zone, Secret Agent, DEF CON, Indie Pop | SomaFM |

Everything runs in the browser. No backend, no build step.

## Finding real streams

You cannot guess stream URLs. The reliable directory is [radio-browser.info](https://www.radio-browser.info/) — a community database with a JSON API you can filter by language and country. I queried it for Kannada and Hindi, then *probed* each candidate before trusting it, because a listing existing doesn't mean the stream answers:

```python
# probe a candidate: does it actually return audio bytes?
req = urllib.request.Request(url, headers={"Range": "bytes=0-2047"})
r = urllib.request.urlopen(req, timeout=10)
print(r.status, r.headers.get("Content-Type"), r.headers.get("icy-name"))
```

That immediately split the field. The stable core turned out to be **All India Radio**, whose streams are served over HTTPS from Prasar Bharati's CDN — official, and unlikely to vanish. The commercial stations (Mirchi, Suno, Girmit, Hindi Gold) work but are best-effort; their URLs rotate and some are geo-fenced.

## HLS vs. MP3

Here's the first fork. AIR's streams are **HLS** (`.m3u8` playlists chopped into segments), while SomaFM/Radio Paradise/most commercial stations are plain **MP3 or AAC** over Icecast.

A browser `<audio>` element plays MP3/AAC natively. It does *not* play HLS — except on Safari/iOS. Everywhere else you need [hls.js](https://github.com/video-dev/hls.js). But hls.js is ~700 KB, and most of my stations don't need it. So it loads only when you actually tune an HLS station:

```js
function ensureHls(){
  if(window.Hls) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = HLS_CDN; s.onload = res; s.onerror = () => rej(new Error("hls.js failed"));
    document.head.appendChild(s);
  });
}
// …then, only for type:"hls" on non-Safari:
if(!audio.canPlayType("application/vnd.apple.mpegurl")){
  await ensureHls();
  hls = new Hls({ liveDurationInfinity: true });
  hls.loadSource(station.url); hls.attachMedia(audio);
} else {
  audio.src = station.url;   // Safari plays HLS directly
}
```

Zero cost for the MP3 stations, full HLS support for AIR.

## The metadata hunt

I wanted album art and the current song, not just a station name. The problem: most Indian streams have no now-playing API. But a few do, and the trick is finding ones that send `Access-Control-Allow-Origin: *` so a browser `fetch` is even allowed:

- **Radio Paradise** — its own JSON API, with cover art.
- **SomaFM** — `/songs/<id>.json`, song only.
- **Hindi Gold** — runs on [AzuraCast](https://www.azuracast.com/), whose `/api/nowplaying/<station>` returns title, artist, *and* art, CORS-open.
- **Radio Girmit** — a radiojar station; `/api/stations/<id>/now_playing/` gives title, artist, album, and a thumbnail.

For AIR's HLS streams there's no JSON, but HLS can carry **timed ID3 metadata** inside the segments. hls.js surfaces it, so I parse it best-effort:

```js
hls.on(Hls.Events.FRAG_PARSING_METADATA, (_, data) => {
  for(const s of data.samples || []){
    const tag = parseID3(s.data);   // pull TIT2 / TPE1 text frames
    if(tag && (tag.title || tag.artist)){ setMeta(tag.title, tag.artist, ""); break; }
  }
});
```

The design rule I held to: **never fabricate track data.** If a station gives nothing, it shows the station name and a LIVE indicator — not a fake "now playing".

## The part that actually bit: CSP

This is the bit worth the post. mrdee.in ships a strict Content-Security-Policy — the good kind, `default-src 'self'`, everything locked down. I dropped the finished page onto the site and… nothing played. No obvious error, just silence and a console full of CSP violations.

The subtle killer is this: **`media-src` has no default of its own — it falls back to `default-src`.** So `default-src 'self'` means the browser will only load audio from my *own* origin. Every external stream is blocked, and because it's a passive media load, the failure is quiet.

The same policy also blocked the metadata `fetch` calls (`connect-src`), the hls.js CDN (`script-src`), and the album-art hosts (`img-src`). A CSP that's correct for a blog is exactly wrong for a streaming app.

The fix is *not* to loosen the whole site. Cloudflare Pages' `_headers` file supports **path-scoped rules**, so `/radio/*` gets its own CSP and the rest of mrdee.in stays as strict as before:

```
/radio/*
  Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net;
    worker-src blob:; media-src https://air.pc.cdn.bitgravity.com https://ice1.somafm.com
    https://*.streamtheworld.com …; connect-src 'self' https://api.radioparadise.com
    https://azuracast.vibesounds.in https://www.radiojar.com …; img-src 'self' data:
    https://img.radioparadise.com https://azuracast.vibesounds.in …
```

Three details that cost real time:

1. **HLS needs the segment host in *both* `connect-src` and `media-src`** — hls.js fetches the `.m3u8` and `.ts` files via XHR (connect), then feeds bytes to the audio element (media).
2. **Redirecting streams need wildcards.** `playerservices.streamtheworld.com` 302s to an edge node like `25353.live.streamtheworld.com`, and CSP re-checks the redirect target — so `https://*.streamtheworld.com`, not the bare host.
3. **hls.js spins up a blob Web Worker**, which needs `worker-src blob:` or it noisily falls back.

## Staying tracker-free

The tuner uses four fonts (Archivo, Chivo Mono, and Noto Sans for Kannada + Devanagari). The easy path is a `<link>` to Google Fonts — but that's a third-party call on every load, which cuts against how the rest of this site works ([GoatCounter, no beacons](https://mrdee.in/)). So I mirrored the fonts locally: fetch the exact CSS Google serves, download every `woff2` it references, rewrite the `@font-face` URLs to point at `/radio/fonts/`, and keep `font-src 'self'`. Pixel-identical, zero external font calls, ~420 KB self-hosted.

The Kannada and Devanagari names render in their own scripts via `:lang()`, with the Latin description as a fallback glyph on the album-art tile so a station always shows *something* even if a device lacks the script font.

## What vibecoding this felt like

The UI was an afternoon. The other 80% was the unglamorous reality of media on the web: which streams are real, which formats a browser will actually decode, which servers let you read their metadata — and a security header, correctly configured for a blog, quietly breaking an audio app until I understood that `media-src` inherits from `default-src`. That last one is the kind of thing you only learn by watching a page fail in exactly one way.

**Live:** [mrdee.in/radio](https://mrdee.in/radio)

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
