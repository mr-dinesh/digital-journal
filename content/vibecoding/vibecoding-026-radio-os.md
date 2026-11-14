---
title: "Vibecoding 026 — RadioOS: the radio I grew up with, on a web page"
date: 2026-07-25
description: "A single web page that tunes All India Radio in Kannada and Hindi, plus Radio Paradise and SomaFM, with station names as little logos, cover art where stations share it, and a Winamp-style equalizer."
tags: ["vibecoding", "javascript", "radio", "music"]
aliases: ["/writing/vibecoding-026-radio-os/"]
weight: -26
---

I had a small web radio player sitting in a scratch folder: an amber-on-black thing styled like an old hi-fi tuner. It played Radio Paradise and SomaFM. What it didn't play was the radio I actually grew up with: All India Radio, in Kannada and Hindi. So I added those and turned it into something I'd keep open in a tab.

**Live:** [mrdee.in/radio](https://mrdee.in/radio)

## What it is

One web page. Nothing to install. It plays about eighteen stations in four groups:

| Group | Stations |
|---|---|
| Kannada | Akashvani Bengaluru, Vividh Bharati, Amruthavarshini, Kannada Hits, Suno FM |
| Hindi | Vividh Bharati, Raagam, Radio Mirchi, Hindi Gold |
| Radio Paradise | Main, Mellow, Rock, Global |
| SomaFM | Groove Salad, Drone Zone, Secret Agent, DEF CON, Indie Pop |

## Finding stations that actually work

You can't guess where a station broadcasts from online, and the addresses people post are often dead. The useful starting point is [radio-browser.info](https://www.radio-browser.info/), an open directory you can search by language and country. I pulled the Kannada and Hindi stations from it and tried each one before adding it.

All India Radio turned out to be the reliable core: official streams that have been around for decades and aren't going anywhere. The commercial stations are more of a gamble. Their addresses change, and a few only work inside India. When one dies I swap it out. Radio Girmit was an early loss; Kannada Hits took its place.

## Making it feel like radio

The look does most of the work. Instead of plain buttons, each station's name is its own little logo in a font that suits it. The Kannada and Hindi stations are written in their own scripts. SomaFM gets a boxy sci-fi font. Radio Paradise gets an elegant one. Each group has its own colour.

There's also a bouncing bar equalizer, the kind every music player had in the Winamp days. I'll come clean: the bars are fake. Making them follow the real music would break playback on most of these stations. So they dance on their own, like an uncle at a wedding. It looks right, and that was the point.

## What's playing, and not making things up

Some stations say what's on, so for those I show the song and, where they share it, the cover art. The rest just show the station name and a "live" light.

The one rule I stuck to: never invent a song title. If a station doesn't say what's playing, the page doesn't guess. A made-up song title looks fine, but it's a small lie, and I'd rather show less and have it be true.

## The bit that ate an afternoon

I put the finished page on my site and got silence. Every station failed, with nothing on screen to say why.

The cause was a security setting. My site is strict about where a page may load things from. That's good for a blog, where I never want it fetching from anywhere unexpected. But a radio has to pull audio from all over the place. The setting was quietly blocking every station, and broken audio makes no noise, literally. Loosening it just enough for the radio while keeping the rest of the site locked down was most of the real work.

That's the honest shape of a project like this. The fun part is a couple of evenings. The rest is the unglamorous job of getting stations, browsers and security settings to agree with each other.

**Live:** [mrdee.in/radio](https://mrdee.in/radio)

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
