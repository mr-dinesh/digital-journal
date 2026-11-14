---
title: "Vibecoding 016 — Argus: Steelman Any Argument Before You Commit to It"
date: 2026-04-14
description: "A small web app that stress-tests any claim or article: the strongest case for it, the weakest version, and a balanced verdict."
tags: ["vibecoding", "cloudflare", "groq", "llm", "tools", "reasoning"]
aliases: ["/writing/vibecoding-016-argus/"]
---

I read a lot: newsletters, security warnings, policy papers, opinion pieces. And I noticed something about myself. If an article agreed with me, I'd nod and move on. If it disagreed, I'd wave it away without really thinking about it. Neither counts as thinking. It's just agreeing with myself with extra steps.

Argus is my attempt to fix that. Before you settle on an opinion, test it. Look at the strongest version of the argument you disagree with, and the weakest version of the one you're inclined to believe.

The name comes from Greek myth: Argus was the giant with a hundred eyes, who saw everything from every side.

→ **[github.com/mr-dinesh/argus](https://github.com/mr-dinesh/argus)**

![Argus](/images/writing/vibecoding-016-argus.jpg)

---

## What it does

Paste in a claim, a link or an article. Argus gives you three views.

**Steelman:** the strongest possible version of the argument, as its smartest, most serious defender would make it.

**Strawman:** the weakest version, the one critics love to knock down. What gets left out, blown up or quietly assumed.

**Synthesis:** what a fair, level-headed thinker would conclude. It includes the real sticking point (the one question that splits believers from sceptics), what evidence would change the verdict, and one practical takeaway.

---

## How it's built

It's one small program hosted on Cloudflare, with a free AI service doing the thinking. There's no database and nothing to look after. If you paste a link, the program fetches the article for you, because browsers won't let one website read another website's pages directly.

---

## The instructions are the product

The page took an afternoon. The AI is someone else's. The only thing that makes Argus different from a generic pros-and-cons list is the instructions I give the AI. Four of them matter most:

**Answer in a fixed format**, so the page can lay it out neatly.

**Don't agree with me.** Without this, AI flatters you every time. This one line changes everything.

**Make the steelman worthy of a real expert.** If it would embarrass a serious defender, rewrite it.

**Name the actual sticking point.** One question that could be settled. Not "it depends". This is the most honest part of the whole tool. In a client meeting, naming the sticking point can turn a 40-minute debate into a 4-minute one.

---

## What vibecoding this felt like

Finding a free AI that stays free is a game of musical chairs. One had no free option. Another dropped its free models. The first one I used quietly stopped answering one day and broke the site. The next turned out not to work from India at all. I landed on Groq, which is fast and generous and gives better answers than the original. Lesson: for a free hobby tool, your choice of AI isn't really a choice. And you'll be making it again.

Each of those four instructions was added after I saw the AI do something silly with a real article. You can't plan them ahead. You find them by trying real examples and noticing where it wobbles.

---

**[Try it live](https://argus-proxy.mrdinesh.workers.dev/)** · **[github.com/mr-dinesh/argus](https://github.com/mr-dinesh/argus)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
