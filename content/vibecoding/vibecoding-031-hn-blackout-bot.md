---
title: "Vibecoding 031 — A bot that posts a blackout poem from Hacker News every morning"
date: 2026-11-09
description: "Every day at 09:00 IST, a GitHub Action screenshots the Hacker News front page, has an AI black out all but a dozen words, and posts the result to Bluesky as three panels."
tags: ["vibecoding", "bluesky", "github-actions", "workers-ai", "poetry", "hacker-news"]
weight: -31
images: ["og/hn-blackout.png"]
---

[HN Blackout](/vibecoding/vibecoding-019-hn-blackout-poetry/) turns the Hacker News front page into a blackout poem. An AI picks ten to fifteen words from the headlines, and the page blacks out the rest. It was a page you had to visit. Now it also posts a poem to Bluesky every morning, the same way my [Kagga bot](https://mastodon.social/@browncoolie) posts a Kannada verse and my Wodehouse bot posts a quote.

**First post:** [bsky.app/profile/ishm0.bsky.social](https://bsky.app/profile/ishm0.bsky.social/post/3mztw724p4y2o)

![Three panels: a screenshot of the Hacker News front page, the same twenty headlines with most words blacked out, and the found poem "Midnight Silicon Mirrors"](/images/writing/vibecoding-031-hn-blackout-bot.jpg)

## Three panels

A blackout poem on its own is just a list of words. It means something when you can see what was erased. So each post is one image in three parts:

1. **The front page**, as a real screenshot of news.ycombinator.com, top twenty stories.
2. **Blacked out**: the same headlines, with every word struck through in black except the ones the poem uses.
3. **The found poem**, one word per line, with its title.

You can read it left to right: here's what the internet was talking about this morning, here's what got erased, here's what was left.

## How it works

It's a GitHub Action that runs at 09:00 IST, like my other two bots, [PGWodehouseBot](https://bsky.app/profile/pgwodehousebot.bsky.social) and the [Kagga bot](/vibecoding/vibecoding-009-kaggabot-github-actions/). It needs no server.

The script opens Hacker News in a headless Chrome browser and screenshots it down to the twentieth story. It reads the headlines from that same page, so the screenshot and the poem can't drift apart if the rankings shift between two requests.

The headlines go to the website's own poem endpoint. That's a Cloudflare Pages Function calling Llama 3.3 on Workers AI, so the bot needs no AI keys. The endpoint takes only a list of headlines and builds the prompt itself. That keeps it from turning into a free general-purpose chatbot on my Cloudflare account.

Pillow draws the other two panels in the site's newsprint colours and fonts, and the image goes to Bluesky with alt text. The alt text names the poem and lists every headline, so the post also works for people who can't see the image.

Last, the script commits a line to a history file. That does two jobs. A second run on the same day sees the entry and skips. And GitHub turns off scheduled workflows in repos with no commits for sixty days, so a daily commit keeps the bot alive.

## Things that went wrong

**Every poem was called "Echoes".** Llama returned the same title almost every time. I added a rule to the prompt: no stock one-word titles. It ignored the rule. Asking again didn't help either, because I'd told the model to answer in strict JSON, and in that mode it gives the same answer every time, whatever the temperature. The fix is a second, tiny request: if the title is "Echoes" or one of its cousins, ask for a title on its own, in plain text. That gets "Silicon Mirrors Fade" and "Midnight Silicon Mirrors".

**Bluesky said my username was a bad email address.** The error was `Invalid email address: Address local part cannot be empty`. I'd saved the handle as `@ishm0.bsky.social`. Bluesky treats any login name containing `@` as an email address, and with the `@` at the front, there was nothing before it. The bot now strips a leading `@`.

**An empty secret, again.** In [Vibecoding 030](/vibecoding/vibecoding-030-links-inbox/), a token saved as an empty string took a while to find. This time I ran `gh secret set` from inside Claude Code with the `!` prefix. That isn't a real terminal, so `gh` couldn't show its hidden password prompt and read an empty line instead. It saved the empty secret without complaint. Commands that prompt for a secret belong in a real terminal window.

**GitHub refused the push.** The repo pushes over HTTPS with the GitHub CLI's login token, and that token can't change files under `.github/workflows/` unless it has the extra `workflow` permission. GitHub makes you ask for that separately, because a workflow file runs code with the repo's secrets. My SSH key has no such limit, so the bot went up over SSH.

**The screenshot was too small to read.** At desktop width, twenty HN stories make a short, wide image, and shrunk into the panel the text was tiny. Below 750 pixels wide, HN switches to its phone layout: bigger text, titles that wrap. At 620 pixels, the screenshot comes out about the same shape as the panel, and it fills it.

## The site changed too

Visitors to the website used to need their own Groq or Gemini API key, which most people don't have. The site now uses the same Workers AI endpoint as the bot, so it works for anyone. [Update 3 on the original post](/vibecoding/vibecoding-019-hn-blackout-poetry/#update-3--november-2026) has the details.

## What I took away

The poem itself was the easy part; the site already did it. Most of the work was in making it readable as a single image in a feed. That meant the screenshot, the three panels, the alt text, and a title that isn't "Echoes".

Mastodon is next. The code is there and waiting for a token.

*Source: [github.com/mr-dinesh/hn-blackout](https://github.com/mr-dinesh/hn-blackout) · Live: [hn-blackout.pages.dev](https://hn-blackout.pages.dev/)*

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
