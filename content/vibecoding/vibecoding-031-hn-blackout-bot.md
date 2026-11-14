---
title: "Vibecoding 031 — A bot that posts a blackout poem from Hacker News every morning"
date: 2026-11-09
description: "Every morning a bot takes the Hacker News front page, blacks out all but a dozen words, and posts the poem that's left to Bluesky and Mastodon."
tags: ["vibecoding", "bluesky", "mastodon", "github-actions", "workers-ai", "poetry", "hacker-news"]
weight: -31
images: ["og/hn-blackout.png"]
---

[HN Blackout](/vibecoding/vibecoding-019-hn-blackout-poetry/) turns the Hacker News front page into a blackout poem. You take a page of text, cross out nearly everything, and read what's left as a poem. An AI picks ten to fifteen words from the headlines and the page blacks out the rest.

Until now you had to go to the website to see it. Nobody goes to websites. So now it comes to you: a fresh poem every morning on Bluesky and Mastodon, next to my [Kagga bot](https://mastodon.social/@browncoolie) (a Kannada verse a day) and my Wodehouse bot (a quote a day). I seem to be building a small zoo of bots that post things so I don't have to.

**First post:** [bsky.app/profile/ishm0.bsky.social](https://bsky.app/profile/ishm0.bsky.social/post/3mztw724p4y2o)

![Three panels: a screenshot of the Hacker News front page, the same twenty headlines with most words blacked out, and the found poem "Midnight Silicon Mirrors"](/images/writing/vibecoding-031-hn-blackout-bot.jpg)

## Three panels

A blackout poem on its own is just a short list of words. It only works when you can see what was crossed out. So each post is one picture in three parts:

1. **The front page** as it looked that morning.
2. **The blackout**: the same headlines with every word inked over except the ones the poem uses.
3. **The poem**, one word per line, with a title.

Read it left to right: here's what the internet was arguing about today, here's what got erased, here's what survived.

## How it works

Every morning at nine, GitHub runs a small script for me for free. It opens Hacker News in a browser nobody is looking at, takes a screenshot, and copies the top twenty headlines.

The headlines go to the same AI that runs the website, which sends back a poem and a title. The script draws the other two panels in the site's old-newspaper colours and posts the picture. Each post includes a written description of the picture, so people using screen readers get the poem too.

Then the script writes "posted today" in a little diary file. If it runs again by mistake, it checks the diary and goes back to sleep.

## The bumps

The AI called every poem "Echoes". Every single one. I told it not to. It said "Echoes" again. It took a second, separate question ("just give me a title, please, not that one") to get "Midnight Silicon Mirrors". I'd like to say I've never been that stubborn.

The rest were the usual. Bluesky didn't like how I'd typed my own username. I saved a password as a blank and spent a while wondering why nothing worked. That's the second project in a row where I've done that, so the lesson is clearly not sinking in. And the first screenshots were so tiny you'd need a magnifying glass, until I tricked Hacker News into showing its bigger phone layout.

## The site changed too

The website used to ask visitors for their own AI key, which almost nobody has. It now uses the same free AI as the bot, so anyone can just press the button. [Update 3 on the original post](/vibecoding/vibecoding-019-hn-blackout-poetry/#update-3--november-2026) has more.

## What I took away

The poem was the easy part. The website already made poems. Nearly all the work went into making one picture that makes sense as you scroll past it in a feed. That, and talking a computer out of "Echoes".

## Update, 10 November

The poems now go to Mastodon too, as [@browncoolie](https://mastodon.social/@browncoolie), the account the Kagga bot uses. Each bot has its own key with permission to post and nothing more, so I can switch one off without touching the other.

On day two GitHub quietly skipped the nine o'clock run. Free scheduling turns out to mean "when we get round to it". There are now two backup runs later in the morning. Whichever one gets there first posts, and the others see the diary and stand down.

*Source: [github.com/mr-dinesh/hn-blackout](https://github.com/mr-dinesh/hn-blackout) · Live: [hn-blackout.pages.dev](https://hn-blackout.pages.dev/)*

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
