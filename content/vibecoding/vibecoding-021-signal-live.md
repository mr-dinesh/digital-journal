---
title: "Vibecoding 021 — SIGNAL/live: A Real-Time Infosec Feed"
date: 2026-04-23
description: "One search box, two social networks, and a live stream of what the security community is talking about right now."
tags: ["vibecoding", "security", "cloudflare", "javascript", "mastodon", "bluesky"]
aliases: ["/writing/vibecoding-021-signal-live/"]
weight: -21
---

I have a tab problem. Two social networks, Bluesky and Mastodon, have genuinely useful security conversations, and I kept flipping between them to keep up: new vulnerabilities, breaches, people arguing about whatever Crowdstrike did this week. Two feeds, two refresh buttons, one tired pair of eyes.

SIGNAL/live is the obvious fix: one search box that watches both.

## What it does

Type a word, like `ransomware` or `#threatintel`, and it pulls matching posts from both networks into a single feed, newest first. It checks again every 20 seconds by itself. There's an auto-scroll mode for leaving it running on a second screen, which is how I use it. It makes me look busy.

It's styled like a late-night control room: glowing green text on black, faint scan lines. It looks like it should be tracking satellites. It's tracking people complaining about passwords.

## The middleman

Both networks share their posts freely, but browsers have rules about one website reading another's data. Those rules are good for security and a nuisance when all you want is to read public posts.

So there's a small go-between program on Cloudflare that fetches the posts and hands them to the page. It will only talk to those two networks, so nobody can use it for anything else.

One detour: Bluesky's usual address turned away visitors from India. A different address had the same posts and no such problem. It took ten minutes to find, and rather longer to stop wondering what I'd done wrong.

## How it's built

Two free pieces on Cloudflare: the go-between and the page itself. If one network has a bad moment, the other keeps going, and a little light says `partial` instead of the whole feed going blank.

## What I'd change

The Mastodon side is a bit lopsided. The security-focused Mastodon server now wants a login for most searches, so plain words only search Bluesky. Hashtags still work on both.

Getting a Mastodon login is free and takes two minutes. But then the go-between has to look after a password, and the whole thing stops being "just put it online". So I've left it. It works, just not evenly.

## What it looks like

{{< figure src="/images/vibecoding/signal-live.png" alt="SIGNAL/live showing a live merged feed of infosec posts from Bluesky and Mastodon" >}}

## Source

→ [Try it live](https://signal-feed-8pl.pages.dev/) · [github.com/mr-dinesh/signal-live](https://github.com/mr-dinesh/signal-live)
