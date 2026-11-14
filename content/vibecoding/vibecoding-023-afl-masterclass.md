---
title: "Vibecoding 023 — AFL Masterclass: Coverage-Guided Fuzzing From First Principles"
date: 2026-04-25
description: "A self-paced course, with points and progress, on AFL: the tool that finds bugs by throwing millions of slightly-wrong inputs at a program and watching what breaks."
tags: ["vibecoding", "security", "fuzzing", "afl", "javascript", "cloudflare"]
aliases: ["/writing/vibecoding-023-afl-masterclass/"]
weight: -23
---

"Fuzzing" means finding bugs by throwing huge amounts of slightly broken input at a program and seeing what makes it fall over. Imagine a toddler hammering every button on a TV remote, millions of times a second, and writing down every combination that makes the TV crash. AFL is the best-known tool for doing this, and the gap between "I've heard of AFL" and "I understand what it's doing" is wider than it looks.

So I built a course to get across it.

**Live:** [afl-masterclass.pages.dev](https://afl-masterclass.pages.dev)

## What it covers

Ten sections, in order.

It starts with a question: why was AFL such a big leap? The answer isn't clever maths. Before AFL you had two choices. Throw pure random junk, which is fast and mostly useless. Or carefully describe what valid input looks like, which works but takes ages. AFL watches which parts of the program each input reaches and keeps the inputs that get somewhere new. It learns the shape of the input on its own. The toddler gets smarter.

From there it walks through how AFL keeps track of where it's been, how it mangles inputs, and some of the clever engineering choices behind it. Then comes the honest part: where AFL gets stuck. Some programs check for a secret password-like value, or a checksum, or need a long sequence of steps before anything interesting happens. AFL struggles with those without help, and knowing where it breaks matters as much as knowing where it works.

The last section busts seven common myths. The one I hear most: "We ran it for a day and found nothing, so the code is probably fine." That reasoning can go wrong in five separate ways, and the section walks through each.

## How it's meant to be used

It's for people who want to actually *do* this, not just know the words. Each section says how long it takes and how hard it is. There's a seven-day hands-on plan and a 30-day roadmap.

The roadmap has one rule: at the end of week one you should have a crash, not notes about crashes. Knowing about something and being able to do it are different things.

## Points and progress

To keep me going, it has a little game built in. You get points for finishing sections, for completing each practice day, and for each myth you understand. There's a progress bar at the top and three colour themes. It remembers where you got to. Yes, I gamified my own homework.

## What it can't teach

The hard part of fuzzing isn't the tool. It's working out where to aim it: which piece of a big program you can test on its own, and what it needs set up first. That only comes with practice. The seven-day plan pushes you into that practice early, but no document can do it for you.

## References

For the curious, the course links to the original AFL write-up by Michał Zalewski and the key research papers that improved on it. Those are the natural next reads.

---

**[Try it live](https://afl-masterclass.pages.dev/) · [github.com/mr-dinesh/afl-masterclass](https://github.com/mr-dinesh/afl-masterclass)**
