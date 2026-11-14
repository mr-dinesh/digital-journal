---
title: "Vibecoding 007 — Putting 945 Verses of Kannada Philosophy on the Internet"
date: 2026-03-21
tags: ["vibecoding", "mastodon", "kannada", "poetry"]
aliases: ["/writing/vibecoding-007-bot-to-post-kannada-poetry-on-mastodon/", "/writing/vibecoding-007-kannada-poetry-bot/"]
description: "Built a Mastodon bot to post DVG's Mankutimmana Kagga — 945 verses of Kannada philosophy — twice daily with transliteration and English explanation."
---
![image](/images/writing/vibecoding-007-kaggabot-mastodon.png)


### A bot that posts Mankutimmana Kagga to Mastodon

**D.V. Gundappa's** *Mankutimmana Kagga* is 945 short verses of Kannada philosophy, written in the 1940s. More people should read it. So I built a bot that posts one verse at a time, twice a day, on Mastodon, with the Kannada, a version in English letters, and an English explanation.

### What I asked for

I started with one sentence to Claude: *"Create a Mastodon bot to post Kannada Mankutimmana Kagga verses with a short explanation, configurable on how often to post."* From that it built the whole thing, including a tool to collect all 945 verses from a public source.

### What it does

- All 945 verses, in Kannada, in English letters, and explained in English
- Posts as often as you like
- Goes in order or picks at random, and remembers where it got to
- If a verse is too long for one post, it shortens it or splits it into a thread
- Can stick to one theme: wisdom, death, love and so on
- A practice mode that doesn't actually post

### What broke

Mostly small things, each annoying in its own way. Verses that run over several lines confused the program at first. Kannada letters take more room than English ones, so verses that looked short were too long for Mastodon. And the Kannada hashtag `#ಕಗ್ಗ` got mangled, because Mastodon didn't understand the little mark that joins Kannada letters. The posts now carry `#Kagga` as well. Less poetic, but at least it works.

The free hosting service I first picked also refused to talk to the smaller Mastodon server I'd chosen. So the bot moved to mastodon.social, the big one.

### What I learned

Things going wrong is part of the process. Fixing them is where I actually learn something. At least that's what I tell myself at midnight.

The bot is live and posting. See it on [Mastodon](https://mastodon.social/@browncoolie).

### Bot source code on GitHub
[Repo link here](https://github.com/mr-dinesh/Kagga-Bot)
