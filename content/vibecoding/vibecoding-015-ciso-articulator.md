---
title: "Vibecoding 015 — CISO Articulator"
date: 2026-04-12
description: "I built a timed communication drill for security leaders — 26 scenarios across three modes, with LLM coaching on jargon, clarity, and business framing."
tags: ["vibecoding", "python", "flask", "security", "llm", "tools"]
aliases: ["/writing/vibecoding-015-ciso-articulator/"]
---

![CISO Articulator](/images/writing/vibecoding-015-ciso-articulator.jpg)

There's a specific failure mode for CISOs that I've been thinking about for a while. Most of them are technically excellent. They understand threat landscapes, they know how to build a security program, they can architect zero-trust in their sleep. What they can't do — what most of them have never been trained to do — is explain any of it in under sixty seconds to a board member who didn't sleep well and has three more meetings after this one.

The last CISO gave a 40-slide deck. The audit committee hated it.

That's the scenario that opens this tool. I built CISO Articulator to be the drill you run *before* you're in that room.

→ **[github.com/mr-dinesh/ciso-articulator](https://github.com/mr-dinesh/ciso-articulator)**

---

## The Three Modes

The app has three distinct problem spaces.

**Daily Drill** is for the ongoing boardroom situations. Twelve scenarios: the CFO questioning your budget after zero reported breaches, the CEO asking what zero-trust actually means, the board member who just read about a competitor's ransomware attack and wants to know if you're exposed. The scenarios are designed to be uncomfortable. The timer is 60 seconds because that's roughly what you get in a hallway conversation or a board Q&A.

**Interview Prep** is for the specific pressure of a CISO job interview — where you're being evaluated not just on what you know, but on whether you can communicate under scrutiny. How do you explain a major incident to a board on the morning it happens? When do you involve law enforcement? Tell me about your biggest security failure. Eight scenarios, each designed to surface communication instinct rather than prepared answers.

**CV Interrogation** is the most pointed mode. It takes claims that appear on real CISO CVs — "reduced the attack surface by 40%", "enterprise-wide zero-trust adoption", "built a security culture" — and treats them as the provocation they are. You claimed it. Now say it out loud, without a slide deck, to someone who is specifically not going to let you off easy.

---

## The Build

The stack is intentionally light. Flask backend, vanilla JS frontend, scenarios in a JSON file. No framework on the client side — the timer is a `setInterval`, the word count updates on every keystroke, the mode switch is a fetch call to `/api/scenarios/<mode>`. The entire UI lives in one HTML template.

The scenarios themselves took the longest. I wanted them to feel real — not "security trivia" prompts but the specific situations where CISO communication actually fails. That meant writing context for each one, not just the question. The scenario card shows two things: the scenario (italic serif — you're meant to read it slowly) and the context line in monospace (the situational pressure that makes the scenario real).

The coaching is `gemini-2.0-flash` with a structured prompt:

```
Evaluate on three dimensions.
What worked: [1-2 sentences. Be specific. Name what landed.]
What to fix: [1-2 sentences. Name the exact phrase or gap.]
Rewrite this opening: "[Show a stronger first sentence only.]"
Under 100 words. No encouragement filler. Be honest.
```

That last instruction matters more than it looks. Without it, the model defaults to diplomatic softening — the coaching equivalent of the 40-slide deck. The explicit "no flattery" instruction shifts the register. The feedback that comes back names specific phrases, not general weaknesses.

---

## The Design

The screenshot was the brief. I wanted something that felt like a sparring tool rather than a learning app — less e-learning, more fight gym. The cream background, the large monospaced timer, the black submit button. The HARD tag rendered solid black. No illustrations, no progress animations. Minimal enough that the scenario text dominates the page.

The word count range (60–120 words) is the interesting constraint. Short enough to force prioritisation, long enough to make a coherent point. When you're in range the target turns green. Most first attempts fall short — people write 30 words and stop because they've said the "right" thing. The coaching usually points to the same issue: they stated a position without a mechanism, or explained the control without connecting it to business outcome.

---

## What Vibecoding This Felt Like

The scenarios file was the hardest part to write, and the most important. The temptation was to write twelve variants of the same question — "explain X to a non-technical audience" — which would produce twelve almost-identical coaching responses. The interesting scenarios are the ones with political pressure built into the context: the CFO is nodding along while the COO argues against DR testing. The new board chair asking what keeps you up at night, specifically because she's heard that question answered badly before.

The thing I notice about this kind of build is how much the design brief narrows the scope in useful ways. I knew what the app looked like before I wrote a line of code. The screenshot was the spec. That means the decisions during the build were almost all about scenarios and prompt engineering rather than architecture — which is where the actual value is.

There are probably 40 more scenarios worth writing. The daily drill could run for a month without repeating. The CV interrogation mode barely scratches the surface — every CISO CV has at least three claims that deserve exactly this kind of pressure.

---

**[github.com/mr-dinesh/ciso-articulator](https://github.com/mr-dinesh/ciso-articulator)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
