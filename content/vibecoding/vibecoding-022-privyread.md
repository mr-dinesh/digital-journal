---
title: "Vibecoding 022 — PrivyRead: Read Anything, Leave Nothing Behind"
date: 2026-04-23
description: "A private reader that strips out trackers and hands you just the article text, before any of the tracking junk reaches your phone."
tags: ["vibecoding", "privacy", "cloudflare", "javascript", "pwa", "readability"]
aliases: ["/writing/vibecoding-022-privyread/"]
weight: -22
---

Every time you click a link in a newsletter, three things happen before you read a word. The link notes that you clicked. Tags on the end of the link tell the website who sent you. And a tiny invisible image in the email has already told the sender you opened it. None of this is secret; it's just how email marketing works. But knowing it happens and having to take part are different things.

PrivyRead is my way of opting out.

## What it does

Paste a link, or share one straight from your phone, and PrivyRead gives you just the article. The tracking tags come off before anything is fetched. Any detours through link-shortening services happen on my little server, not your phone, so they see the server, not you. Then it pulls out the article itself, the same way Firefox's Reader View does: title, author, text and reading time. Pictures don't load at all, because pictures are where trackers like to hide.

On Android you can install it like an app, and it shows up when you press Share. From email, Substack, anywhere: long-press a link, tap Share, pick PrivyRead, and the article opens. The newsletter never finds out you read it. Sorry, newsletter.

## The fiddly bit

The tool that pulls out the article was built to run inside a browser. My server isn't a browser. A clever helper library pretends to be one, well enough that the article tool doesn't notice. It's not perfect, but for articles it works well, and quickly.

## Trackers removed

It strips about thirty kinds of tracking tag: the familiar Google and Facebook ones, plus a long tail from marketing companies, Twitter, LinkedIn, Pinterest, TikTok and Substack itself. If a link had any, a little badge says **TRACKERS STRIPPED**. If it didn't, it says nothing.

## How it's built

Two free pieces on Cloudflare: the server that does the fetching and cleaning (the only thing that ever touches the original website), and the page you read on.

The page counts how many articles you've read and how many trackers it removed, then forgets it all when you close the tab. I didn't want to keep anything.

## What I'd change

It can't get past paywalls, which is fair enough. More annoying are websites that build their text bit by bit inside your browser. My server only sees the empty shell. Fixing that means running a full browser on the server, which defeats the point of keeping it small.

And you have to install it from the website once before it shows up in the Share menu. Not hard, but not nothing.

## What it looks like

{{< figure src="/images/vibecoding/privyread.png" alt="PrivyRead — privacy-first article reader with tracker stripping and server-side redirect following" >}}

## Source

→ [Try it live](https://privyread.pages.dev/)
