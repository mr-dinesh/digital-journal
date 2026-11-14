---
title: "Vibecoding 019 — HN Blackout Poetry: Found Poems from Tech Headlines"
date: 2026-04-18
description: "Blackout poetry from the Hacker News front page: an AI picks the words that survive, and the rest get inked out."
tags: ["vibecoding", "llm", "poetry", "javascript", "hacker-news"]
aliases: ["/writing/vibecoding-019-hn-blackout-poetry/"]
---

Austin Kleon takes a newspaper page and a black marker and turns the news into poetry by crossing out most of it. The words left standing become a poem. He's been doing it for years, and it's surprisingly moving.

I wanted to try it on Hacker News, the website where programmers share and argue about tech news.

## The idea

Hacker News headlines have their own flavour. They're stuffed with jargon, product names and squashed-up meaning: "Smol machines." "PanicLock." "Casus Belli." "Hyperscalers." Pull them out of context and they sometimes turn strange and lovely.

The page grabs today's top 20 headlines and asks an AI to play blackout poet: pick 10 to 15 words that make a poem. Everything else gets struck through, word by word, with an animated marker. The surviving words appear on the right as a poem with a title.

## The output

The first real run gave me this, titled **"Fevered Machines"**:

> lunar  
> hay  
> fever  
> gunpowder  
> Smol  
> machines  
> PanicLock  
> Slop  
> Hyperscalers  
> Troy  
> acceleration  
> Casus  
> Belli

That's from a real front page. "Hay fever" and "gunpowder" came from a history article, "Smol machines" from an AI story, "PanicLock" from a security story, "Casus Belli" from world politics. Side by side, they become something else entirely. I've written worse poems myself, with more effort.

## How it works

The AI is told to act like Austin Kleon, use the headline words exactly as written, and prefer surprising combinations over boring little joining words. The page then finds each chosen word in the headlines and inks out everything else, a stroke at a time, while the poem slides in on the right.

## The design

I wanted it to feel like an old newspaper meeting a dark screen. On the left, cream newsprint, an old-fashioned typeface, faint ruled lines and thick black marker strokes. On the right, a dark panel with the poem in elegant italics.

The masthead says: *Words found. Meaning made. The rest, erased.*

{{< figure src="/images/vibecoding/hn-blackout.jpg" alt="HN Blackout showing the newspaper panel with blacked-out headlines and the found poem 'Fevered Machines' on the right" >}}

## What surprised me

The AI is genuinely good at this. I expected it to play safe. Instead it goes for the odd ones: the product names and jargon that sound almost mythical on their own. "PanicLock" next to "Slop" next to "Hyperscalers" reads like a report from a dystopia we already live in.

Every run is different, even on the same headlines. Some poems are forgettable. The good ones feel like they found something real.

## Update — April 2026

**More pages.** Besides the top stories, you can now pick the best, newest, "Ask HN" or "Show HN" pages. Each has a mood. Ask HN gets philosophical. Show HN is full of product names that sound like spells. New is chaos.

**Five looks.** The newspaper look is still the default. There's also a stark black-and-white typewriter look, an orange retro computer screen straight out of 1983, a moody purple one for late nights, and a crisp broadsheet that looks like it belongs in a museum.

## Update 2 — April 2026

I added a short wait between poems and a limit of ten a day, so nobody (mainly me) burns through the free AI allowance by clicking too fast.

## Update 3 — November 2026

The page used to ask visitors for their own AI key. Most people don't have one, saw the box, and left. One of the two AI services was also about to shut down.

So now the page uses a free AI service from Cloudflare, the company that hosts it. No key, no box. Press the button and you get a poem. Behind the scenes the page only sends headlines, never free-form requests, so nobody can borrow it as a free chatbot on my account. And if the first AI model is unavailable, it quietly tries a second.

## Source

→ [Try it live](https://hn-blackout.pages.dev/) · [github.com/mr-dinesh/hn-blackout](https://github.com/mr-dinesh/hn-blackout)

Another bot of mine: [PGWodehouseBot](https://bsky.app/profile/pgwodehousebot.bsky.social) posts a P.G. Wodehouse quote to Bluesky twice a day ([write-up](/vibecoding/vibecoding-014-wodehouse-bot/)).
