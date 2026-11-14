---
title: "Vibecoding 014 — A P.G. Wodehouse Quote Bot for Bluesky"
date: 2026-04-11
description: "A bot that posts P.G. Wodehouse quotes to Bluesky twice a day, with a different kind of quote each day of the week, and costs nothing to run."
tags: ["vibecoding", "python", "bluesky", "bot", "atproto", "github-actions"]
aliases: ["/writing/vibecoding-014-wodehouse-bot/"]
---

![Wodehouse Bot on Bluesky](/images/writing/vibecoding-014-wodehouse-bot.jpg)

P.G. Wodehouse wrote 97 books. Sentence for sentence, he may be the funniest writer in English. Most people know Jeeves and Bertie Wooster. Fewer know the Blandings Castle stories, the Mulliner tales, or just how many comic comparisons he packed into every paragraph.

I wanted a bot to share them, but not by tossing out random quotes. I wanted some shape to it: a different kind of quote each day. Comparisons on Monday, because they're the most shareable, and they get Saturday too. Conversations on Wednesday, as a two-part thread. A character in the spotlight on Thursday. A wildcard on Sunday.

It posts as **[@pgwodehousebot.bsky.social](https://bsky.app/profile/pgwodehousebot.bsky.social)** twice a day, and it costs nothing to run.

→ **[github.com/mr-dinesh/wodehouse-bot](https://github.com/mr-dinesh/wodehouse-bot)**

---

## The week

A bot that only posts quotes gets dull fast. Part of what makes Wodehouse worth coming back to is the variety: a comparison lands differently from a bit of back-and-forth, which lands differently from the narrator's asides. So the week has a plan:

| Day | Format | What it is |
|-----|--------|------------|
| Monday | Simile | A pure comparison, Wodehouse's signature move |
| Tuesday | Setup + Quote | One line of context, then the killer line |
| Wednesday | Dialogue | A two-post thread: the line, then the comeback |
| Thursday | Character Spotlight | Who said it, and a bit about them |
| Friday | Situation | The scene, then the payoff |
| Saturday | Simile | Another one; they've earned it |
| Sunday | Wildcard | Anything that didn't fit elsewhere |

Wednesday is my favourite. A conversation between two characters fits a thread perfectly: the opening line first, then the reply underneath.

---

## How it runs

The quotes live in a simple list that I can add to by hand. Twice a day, GitHub's free scheduler wakes the bot up. It checks what day it is, picks a quote of the right kind, posts it and goes back to sleep. No server, no monthly bill.

The bot logs in with a special password that can only post. If it ever leaks, I can cancel it without touching my account.

---

## Bluesky only, for now

The bot started out posting to Mastodon as well. I took that out for now. It'll come back once the bot has its own Mastodon account.

---

## What vibecoding this felt like

It was built in one sitting. The interesting choices were about the shape of the thing, not the code.

The weekly plan came early. A bot that posts comparisons every day is a one-joke bot. One that does seven different things is something you might actually follow. Deciding which day gets what took longer than building it. Similes got two days. I stand by that.

The quote list was simplified once. The first version wanted too much detail for every quote. Now a simple quote needs four facts and a conversation needs a few more. Things are only as fiddly as they need to be.

And Claude knew how Bluesky threads work without being told. That used to mean an hour of reading documentation.

---

**[@pgwodehousebot.bsky.social](https://bsky.app/profile/pgwodehousebot.bsky.social)**  
Another bot of mine: the [HN Blackout bot](/vibecoding/vibecoding-031-hn-blackout-bot/) posts a blackout poem from the Hacker News front page every morning.  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
