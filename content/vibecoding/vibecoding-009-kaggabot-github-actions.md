---
title: "Vibecoding 009 — KaggaBot: Automating Daily Verse Posts With GitHub Actions"
date: 2026-03-25
tags: ["vibecoding", "github-actions", "mastodon", "automation"]
aliases: ["/writing/vibecoding-day009-bot-to-autopost-kannada-poetry-verses/", "/writing/vibecoding-009-kaggabot-github-actions/"]
description: "KaggaBot posts two Mankutimmana Kagga verses to Mastodon every day, using GitHub's free scheduler. No server, no cost, no babysitting."
---
![image](/images/writing/vibecoding-009-kaggabot-actions.png)



### What's Mankutimmana Kagga

Mankutimmana Kagga, often called the Kannada Gita, is 945 philosophical verses by D.V. Gundappa (DVG). Written in the 1940s, it takes on duty, death and doubt, and does it without preaching. It deserves a wider audience.

### KaggaBot

KaggaBot does one simple thing. It posts two verses from the Kagga every day to Mastodon (an ad-free social network), without anyone pressing a button.

### How it works

All 945 verses live in one file. A small program picks the next one and formats it for posting. GitHub, the site where programmers keep their code, offers a free scheduler that runs it morning and evening.

So there's no server, no bill and no babysitting. In theory.

### Why Mastodon?
Mastodon is open and ad-free. It suits a bot that exists to share literature, not to play the algorithm. Anyone can read the posts without an account.

### What broke

GitHub's scheduler means "around this time", not "at this time". A poem twenty minutes late is fine.

The program forgets everything between runs, so my first version posted the same verse every single time. It now writes down which verse it's up to after each post. Not a wise start for a bot about wisdom.

GitHub also quietly switches off the schedule if a project goes two months without changes. Writing down the verse number counts as a change, so that solves it.

And I misnamed a password once, so the bot silently posted nothing. You'd think I'd learn. (Spoiler: see posts 30 and 31.)

### Why this matters
At two a day, it takes more than a year to get through all 945 verses.

That feels like the right pace for philosophy. Slow enough to sit with, regular enough to become a habit.

The whole thing is open source. If you want to adapt it for another book, language or platform, the bones are there.

### Links
🐘 [Read the posts](https://mastodon.social/@browncoolie)
⎇ [View source code](https://github.com/mr-dinesh/KaggaBot_Automated)
