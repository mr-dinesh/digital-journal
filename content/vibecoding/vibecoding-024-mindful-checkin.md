---
title: "Vibecoding 024 — Mindful Check-in: A Personal Practice Tracker"
date: 2026-04-26
description: "A tiny daily mindfulness check-in: how's your breath, how's your mind, and one small thing to shift. Now with anytime check-ins, shareable stats and a weekly Verbal Judo practice."
tags: ["vibecoding", "javascript", "cloudflare", "d1", "mindfulness", "workers"]
aliases: ["/writing/vibecoding-024-mindful-checkin/"]
weight: -24
---

I wanted a check-in tool that matches how I actually think about mindfulness: three simple questions at set times of day. Not a mood tracker with sliders, and not a journal app with a scary blank page.

**Live:** [mindful.mrdinesh.workers.dev](https://mindful.mrdinesh.workers.dev) · **Public stats:** [mindful.mrdinesh.workers.dev?public=1](https://mindful.mrdinesh.workers.dev?public=1)

## Three questions

- **Breath:** how's your breathing right now? Tap deep, shallow, held, irregular or easy, or type your own. I ask about breath instead of "rate your stress from 1 to 10" because the breath answer is instant and honest. Ask me to rate my stress and I'll say 4, every time, whatever the truth is.
- **Mind:** calm, focused, busy, scattered, anxious or foggy. Or your own word. The point is to notice patterns over time, not to write an essay.
- **Shift:** one tiny thing you can do right now. Not a goal or a task. One small change.

There are four times of day: morning, midday, evening and night. Each has its own bookmark, so it's one tap from your home screen.

## How it's built

It started as a single web page that saved everything on my phone. Then I wanted it on all my devices, plus some stats, so it now saves to a small database on Cloudflare too. It still saves on the phone first, so it's quick and works offline, then quietly syncs. A little note tells you which happened: "✓ synced" or "saved locally".

A PIN keeps it private, and the PIN lives with Cloudflare, not in the code.

## Stats

The stats page shows:

- **Your streak**, current and longest: days in a row with at least one check-in
- **A 30-day grid** of squares, darker on days you checked in more
- **Which time of day** you check in most
- **Your most common** breath and mind states

Numbers that tell you, gently, how mindful you've actually been, as opposed to how mindful you think you've been.

## The one annoying bug

The buttons stopped working because of a punctuation mix-up: apostrophes and quote marks getting confused somewhere between my code and your browser. The fix was to stop passing words around inside the button code at all. Fiddly, but done.

---

## Version 2: four additions

### Check in any time

The four fixed times left a gap. A moment of stress or clarity at 2pm on a Tuesday doesn't fit into "morning" or "evening". So there's now a fifth button, **Now ⏱**, that logs a check-in for that exact minute. In the stats, these all count together as "Anytime".

### Shareable stats

There's now a **share ↗** link that copies a read-only view of the stats: streaks, grid, patterns. Anyone with the link can see the numbers but not the check-ins themselves or anything else. It's switched off unless I turn it on.

### A daily Verbal Judo tip

I've been reading *Verbal Judo* by George Thompson, and I wanted a nudge to actually use it, not just nod along while reading. So a one-line tip now appears on the main screen each day. There are twenty, taking turns:

> *Paraphrase before you reply — prove you listened.*

> *Power is the ability to not respond when you want to.*

> *Always give people a way out that preserves their dignity.*

The same tip all day. Nothing to tap. Just a reminder, which I clearly need.

### A weekly practice

Tap **practice** at the bottom and you get this week's chapter of the book: one striking sentence from it, and one thing to try that week. Fifteen chapters, one a week.

```
Week 17 · Chapter 2 of 15
Words as Your Most Powerful Tools

"Your words can escalate or de-escalate before anyone moves."

┌─────────────────────────────────────────┐
│ this week's practice                    │
│                                         │
│ Spot one moment today where a different │
│ word would have changed the temperature.│
└─────────────────────────────────────────┘

Next chapter in 3 days
```

The idea is that it takes no effort: open it, see this week's focus, close it, try the one thing.
