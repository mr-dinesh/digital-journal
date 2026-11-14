---
title: "Vibecoding 020 — JuiceSec: OWASP Vulnerability Lab with AI Tutor"
date: 2026-04-17
weight: -20
description: "A hands-on lab where you try ten of the most common website attacks yourself, with an AI tutor that nudges you along without giving away the answer."
tags: ["vibecoding", "security", "owasp", "cloudflare", "workers-ai", "javascript"]
aliases: ["/writing/vibecoding-020-juicesec/"]
---

OWASP Juice Shop is the classic way to learn how websites get hacked. It's a deliberately broken online shop you're allowed to attack. The catch is that you have to install it first, and that's where most beginners give up. I wanted the same idea with no setup at all: open a link and start breaking things.

That's JuiceSec. Ten hands-on challenges based on the ten most common kinds of website weakness (the "OWASP Top 10"), with an AI tutor that coaches you by asking questions instead of handing over answers.

## The challenges

Everything happens in your browser. Nothing real gets attacked, but the pretend versions behave closely enough to the real thing to teach you how the tricks work:

| # | Challenge | In plain words |
|---|---|---|
| 01 | SQL Injection | Typing something sneaky into a login box to fool the database |
| 02 | Reflected XSS | Getting a website to run your code by tucking it into a search |
| 03 | Broken Authentication | Guessing a weak password |
| 04 | IDOR | Changing a number in the address bar to see someone else's order |
| 05 | Security Misconfiguration | Finding a page that was meant to be hidden |
| 06 | Sensitive Data Exposure | A list of users left open for anyone |
| 07 | JWT None Algorithm | Forging your own "I'm the admin" pass |
| 08 | Command Injection | Tricking a server into running your commands |
| 09 | SSRF | Getting a server to fetch its own secrets for you |
| 10 | Stored XSS | Leaving booby-trapped code in a comment box |

Some of them show you what's happening behind the scenes as you type. In the login challenge, you can watch your input quietly rewrite the question the website asks its database. In the "fetch" challenge, point the server at the right address and it cheerfully hands over its cloud passwords.

Nothing is explained up front. You have to find the trick yourself.

## The AI tutor

On the right is a chat with an AI tutor. It works in two ways:

**Hint mode** never gives you the answer. It asks questions that steer your thinking: *"What do you think happens if your input contains a single quote?"* It's annoying in the best way, like every good teacher I had.

**Explain mode** kicks in once you've solved a challenge. It tells you why the weakness exists, gives a real-world example, and explains how to fix it. That's what makes it a lesson and not just a game.

The tutor is under strict orders not to reveal the answer before you solve it. I tried to wheedle it out of it. It wouldn't budge.

## How it's built

It's one small program on Cloudflare, with Cloudflare's own AI running the tutor. No keys, no database. The challenges are all pretend, run by your browser, but the patterns are real.

## What it looks like

{{< figure src="/images/vibecoding/juicesec.jpg" alt="JuiceSec showing the SQL Injection challenge with the live query display and AI tutor panel on the right" >}}

Challenges on the left, the playground in the middle, the tutor on the right. Dark screen, hacker-green highlights, and a score at the top so you can feel smug.

## Source

→ [Try it live](https://juicesec.mrdinesh.workers.dev/) · [github.com/mr-dinesh/juicesec](https://github.com/mr-dinesh/juicesec)

---

*Update, 8 November 2026: The AI model behind the tutor was retired, and the tutor stopped answering until I noticed. It now uses a newer model, with a backup, so the next retirement won't take it down.*
