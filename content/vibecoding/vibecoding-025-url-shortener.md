---
title: "Vibecoding 025 — go.short: a custom URL shortener, admin UI, and linktree"
date: 2026-05-01
description: "My own link shortener, with a page to manage the links and a single page that lists them all. Plus the afternoon I accidentally took my own blog offline."
tags: ["vibecoding", "cloudflare", "workers", "kv", "dns", "javascript"]
aliases: ["/writing/vibecoding-025-url-shortener/"]
weight: -25
---

For months I'd been pasting long blog links into my Mastodon bio, my notes and my slides. They looked terrible. The obvious answer was a link shortener: turn a long address into something like `s.mrdee.in/blog`. The less obvious part was how much trouble I could get into setting one up.

**All my links:** [mr-dinesh-links.pages.dev](https://mr-dinesh-links.pages.dev) · **Short links:** [s.mrdee.in](https://s.mrdee.in) · **Admin:** [go-admin-76o.pages.dev](https://go-admin-76o.pages.dev)

## What it does

When you visit a short link like `s.mrdee.in/vc1`, a tiny program on Cloudflare looks up the long address and sends you there. That's all it does. Everything interesting is around it.

There's a private page, behind a password, where I can see all the short links, add new ones and delete old ones.

And there's one public page that lists all 37 links in three groups: live tools, blog and notes, and every vibecoding post. One link to share that leads to everything.

## What went wrong

Most of the time went on getting the short address to work at all. Cloudflare has several layers that decide what happens to a visitor, and they fought each other.

First, every visit just bounced back to itself, forever. The culprit was an old setting meant to push visitors onto secure connections. It was written in a way that redirected people to exactly where they already were. It also ran before my program got a look in. I deleted it and the loop stopped.

Then the address I'd picked, `go.mrdee.in`, turned out to be locked by an older project and impossible to edit. So I gave up and switched to `s.mrdee.in`. Sometimes the best fix is to just pick a different name.

And while tidying up, I briefly took my own blog offline. Its address settings went missing, and when I recreated them by hand, they lacked some hidden details Cloudflare needed. The fix was to remove my handmade version and let Cloudflare recreate it properly. It came back within thirty seconds. Those thirty seconds felt longer.

## Slugs

All 37 short links live at `s.mrdee.in/<name>`. The list page at `s.mrdee.in/links` has them all, grouped and labelled, and the admin page lets me add or remove links without touching any code.

The ones I use most: `s.mrdee.in/blog` for this series, `s.mrdee.in/argus` and `s.mrdee.in/juicesec` in talks, and `s.mrdee.in/now` in my Mastodon bio.
