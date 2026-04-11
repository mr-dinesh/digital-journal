---
title: "Vibecoding 003 — Extracting One Usable Idea From Every Podcast Episode"
date: 2026-03-16
tags: ["Automation", "Podcast", "Python", "VibeCoding"]
aliases: ["/writing/vibecoding-003-webscraping/", "/writing/vibecoding-003-podcast-idea-extractor/"]
description: "Scraped 165+ episodes of Think Fast, Talk Smart and used an LLM to distil each guest's core advice into 7 words or less, then assembled it into a video montage."
---
![image](/images/writing/vibecoding-003-podcast-montage.png)

### One Usable Idea From Every Episode

*Project #3 of the 100 Vibe Coding Projects challenge*

*Think Fast, Talk Smart* is Matt Abrahams' podcast on communication — 270+ episodes, each guest offering their best advice on how to speak, listen, and connect more effectively. The problem: that advice is scattered across hundreds of hours of audio. Nobody's reading the back catalogue.

The prompt was: extract the core advice from each episode, compress it to 7 words or less, and put it on a screen.

The result is a 6-minute video montage covering 165 episodes — each card showing the episode number, topic category, guest name, and their advice in large bold type, colour-coded by theme (teal for Communication, red for Conflict, purple for Mindset, gold for Feedback).

### Version 2

The first version worked but felt clinical. Version 2 rebuilt the music from scratch — warmer, more orchestral, something that suited a podcast about human connection rather than a product demo. The backgrounds became illustrative rather than blank: each category got its own abstract image (sound waves for listening episodes, mountain silhouettes for leadership, a neural-network pattern for mindset). Transitions slowed down and softened.

The honest verdict: technically better, emotionally closer. Still not perfect — a human voice reading the advice would transform it from a slideshow into something worth watching twice.

### Takeaways

Narrative needs to stitch together all of this advice. A string of bullet points across 165 slides is data, not a story. The raw material is good; the frame around it still needs work.

### The Security Angle

Extracting structured insight from unstructured text across 165 podcast episodes is, at its core, the same pipeline used in threat intelligence processing — taking raw text (blog posts, threat reports, OSINT feeds) and extracting specific signals from it. The difference is the signal type: guest advice instead of indicators of compromise.

The technique is identical. If you can prompt an LLM to extract "the advice each guest shares in 7 words or less," you can prompt it to extract "the malware family, affected platforms, and recommended mitigations" from a threat report. Same pattern, different domain. This project was a useful reminder that the automation skills transfer directly.

### Montage
[Version 1](https://github.com/mr-dinesh/Vibecoding_003_Webscraping-Podcast-/blob/main/ThinkFastTalkSmart_Montage.mp4) · [Version 2](https://github.com/mr-dinesh/Vibecoding_003_Webscraping-Podcast-/blob/main/ThinkFastTalkSmart_Montage_v2.mp4)
