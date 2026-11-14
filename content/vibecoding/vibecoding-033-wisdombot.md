---
title: "Vibecoding 033 — A Stoic in my pocket"
date: 2026-11-14
description: "A private Telegram bot. I tell it what's bothering me, and it answers with one line from Marcus Aurelius, Seneca or Epictetus and one thing to do."
tags: ["vibecoding", "telegram", "stoicism", "cloudflare-workers", "workers-ai", "vectorize"]
weight: -33
images: ["og/wisdombot.png"]
---

Some days go sideways. A meeting goes badly. Someone says something that stays with you all evening. A decision sits on your chest and won't move.

On those days I don't want a self-help article. I want one good sentence from someone who has been there. Marcus Aurelius ran an empire through a plague and a war. Seneca wrote letters to a friend about fear, anger, money and getting old. Epictetus was born a slave. Between them they covered most of what goes wrong in a day.

So I built a bot I can text when something is bothering me. It answers with one line from one of them, and one thing to do about it. It's cheaper than therapy and considerably more ancient.

## What it looks like

I type the problem the way I'd say it to a friend. One morning I asked it about distractions. This came back:

```
"Do the things external which fall upon thee distract thee? Give
thyself time to learn something new and good, and cease to be
whirled around."
— Marcus Aurelius, Meditations 2.7 (tr. Long)

Do: Set aside time to focus on a task, avoid distractions.
```

That's all. No preamble, no lecture, no menu of options. If I want another angle on the same problem, I send `/more`. If I want to read the whole passage the line came from, I send `/source`.

<img src="/images/writing/vibecoding-033-wisdombot.jpg" alt="The bot in Telegram: a quote from Meditations 2.7 with a Do line, then /more bringing Meditations 7.29, then /source showing the full passage" style="max-width:360px;width:100%;display:block;margin:1.5rem auto">

If I just say "thanks", it says one short line back and leaves it there. It only quotes when I ask it something.

## The quotes are real

This was the part I cared about most.

Search for "Marcus Aurelius quotes" and you'll find plenty he never said. Some are loose paraphrases. Some belong to other people. An AI model left to itself makes the same kind of mistake, only more smoothly. It will hand you a lovely sentence with a confident citation, and you'd have no way to tell it was made up.

So the bot never lets the model write a quote. It works like this:

1. I collected public-domain translations: George Long's Meditations and Epictetus, and Richard Gummere's translation of Seneca's letters.
2. A script cut them into short pieces of one or two sentences, between 12 and 40 words. It cuts only where a sentence ends, so every piece is the translator's exact words.
3. When I send a problem, the bot finds the 20 pieces closest in meaning to what I wrote. Not matching words, matching meaning, so "my boss ignored me" can find a line about being slighted.
4. The model reads those 20 and picks the number of the one that fits best. It also writes the "Do:" line.
5. The bot prints the stored text for that number, with its book and section.

The model chooses. It never types the quote. If it returns a number that wasn't on the list, the bot ignores it. Whatever lands on my phone is something Marcus, Seneca or Epictetus actually said, in a translation anyone can check.

## Short lines out of long letters

Seneca doesn't write in one-liners. A letter runs for pages, and a sentence pulled out of the middle can mean the opposite of what he meant.

So any piece that leans on the sentence before it never gets quoted on its own. If it starts with "For", "But", "Therefore" or "This", it's out. Questions are out too, because a question without its answer is just a question. That left about 7,000 lines that can stand alone.

Seneca still makes up three-quarters of them. He wrote a lot. To give Marcus and Epictetus a fair hearing, no author gets more than seven of the twenty candidates.

## Some passages are left out on purpose

The Stoics were calm about death, and a few passages go further. In places Seneca and Marcus treat ending your own life as an open door. That's history. It's also the last thing I'd want a bot to send someone on a bad night.

Those passages are removed before the bot ever sees them. They're listed by name in a file, each with a reason, so the list can be checked. And if a message sounds like a crisis, the bot doesn't quote anyone. It gives the number for Tele-MANAS, India's free 24-hour mental health line (14416), and asks you to talk to someone you trust.

## Just for me

The bot answers one Telegram account, mine. Anyone else who finds it gets silence. It doesn't keep what I tell it. It remembers my last question for an hour, so `/more` works, and then forgets it.

It runs on Cloudflare's free plan, with Cloudflare's own AI doing the matching and choosing. There's no server for me to look after, which is good, because I'd forget.

## What I took away

The best part of this bot is something you never see. The model's job is small: read twenty real sentences, pick one, suggest a next step. It can't decorate a quote or invent one. That limit is why I trust what comes back.

And it turns out one line is usually enough. Most of my problems aren't new. Someone wrote about them two thousand years ago, and wrote it better than I could.

*Code: [github.com/mr-dinesh/wisdombot](https://github.com/mr-dinesh/wisdombot) · Texts: Project Gutenberg and Wikisource (public domain)*

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
