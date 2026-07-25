---
title: "Vibecoding 026 — RadioOS: the radio I grew up with, on a web page"
date: 2026-07-25
description: "A single web page that tunes All India Radio in Kannada and Hindi, plus Radio Paradise and SomaFM — with station names as wordmarks, live cover art where stations provide it, and a Winamp-style equalizer."
tags: ["vibecoding", "javascript", "radio", "music"]
aliases: ["/writing/vibecoding-026-radio-os/"]
weight: -26
---

I had a small web radio player sitting in a scratch folder — an amber-on-black thing styled like an old hi-fi tuner. It played Radio Paradise and SomaFM. What it didn't play was the radio I actually grew up with: All India Radio, in Kannada and Hindi. So I added those, and turned it into something I'd keep open in a tab.

**Live:** [mrdee.in/radio](https://mrdee.in/radio)

## What it is

One web page. No app to install, nothing running on a server. It plays about eighteen stations across four groups:

| Group | Stations |
|---|---|
| Kannada | Akashvani Bengaluru, Vividh Bharati, Amruthavarshini, Kannada Hits, Suno FM |
| Hindi | Vividh Bharati, Raagam, Radio Mirchi, Hindi Gold |
| Radio Paradise | Main, Mellow, Rock, Global |
| SomaFM | Groove Salad, Drone Zone, Secret Agent, DEF CON, Indie Pop |

## Finding stations that actually work

You can't guess the addresses a radio station streams from, and the ones people paste online are often dead. The useful starting point is [radio-browser.info](https://www.radio-browser.info/), an open community directory you can search by language and country. I pulled the Kannada and Hindi listings from it, then checked each one to see whether it still answered before adding it.

All India Radio turned out to be the dependable core — official government streams, on for decades, unlikely to disappear. The commercial stations are more of a gamble: their addresses change, and a few only work inside India. When one dies I swap it out. Radio Girmit was an early casualty; Kannada Hits took its place.

## Making it feel like radio

The look does most of the work here. Instead of plain buttons, each station's name is its own little logo, set in a font that suits it. The Kannada and Hindi stations show their names in Kannada and Devanagari script. SomaFM gets a boxy sci-fi typeface. Radio Paradise gets an elegant serif. Each group has its own colour.

There's also a bouncing bar equalizer in the now-playing panel, the kind every music player had in the Winamp era. I'll be honest about it: the bars are decorative. Reading the actual sound to drive them would mean asking the browser for the raw audio, and the way that permission works, it would break playback on most of these stations. So the bars dance on their own. It looks right, which was the point.

## What's playing, and not making things up

Some stations tell you what's on — Radio Paradise, SomaFM, and a couple of the Indian ones — so I show the track and, where they offer it, the cover art. The rest don't publish that, so they just show the station name and a "live" light.

The one rule I stuck to: never invent a song title. If a station doesn't say what's playing, the app doesn't guess. A made-up now-playing line looks fine and is quietly a lie, and I'd rather show less and have it be true.

## The bit that ate an afternoon

I dropped the finished page onto my site and got silence. Every station failed, with no error a normal person would notice.

The cause was a security setting. My site has a strict policy about where a page is allowed to load things from — good for a blog, where I never want it fetching from anywhere unexpected. But a radio player has to pull audio from all over. The policy was quietly refusing every stream, and because audio fails silently, nothing on screen said so. Sorting that out — while keeping the rest of the site locked down — was most of the real work. I also kept all the fonts on my own server rather than calling Google for them, so opening the page doesn't quietly ping a third party.

That's the honest shape of a project like this: the fun part is a couple of evenings, and the rest is the unglamorous business of making streams, browsers, and security settings agree with each other.

**Live:** [mrdee.in/radio](https://mrdee.in/radio)

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
