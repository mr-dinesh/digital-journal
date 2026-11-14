---
title: "Vibecoding 027 — Mandala Studio: symmetry drawing and a generator"
date: 2026-09-05
description: "Draw with radial symmetry, or generate a mandala from 19 motif types, 24 palettes and 9 colour harmonies. Built in four rounds of feedback, none of which was a specification."
tags: ["vibecoding", "javascript", "canvas", "generative", "art"]
aliases: ["/writing/vibecoding-027-mandala-studio/"]
weight: -27
---

I built a mandala tool. It does two things.

You draw, and every stroke repeats around the centre at whatever fold count you set. Or you press generate and it draws one for you.

**Live:** [mrdee.in/mandala](https://mrdee.in/mandala/)

## What's in it

The generator has 19 kinds of shape, 24 colour palettes, 9 ways of picking colours that go together, and 7 kinds of colour blend. The drawing side has an inkwell of metallic, blended and classic inks, and 7 pen nibs. It's a single page, and it doesn't fetch anything from anywhere else.

## How it got there

Four rounds. Each one started from something already on the screen.

The first round was a working generator. It made mandalas. They were fine. Just fine.

Then I said the patterns were repetitive. That was the whole instruction. It went from 5 kinds of shape to 19, and it let each ring of the mandala repeat a different number of times, so the inner rings no longer had to march in step with the outer ones. The second change was the one that mattered. The sameness came from every ring moving in lockstep, like a school drill.

The third round was colour: fixed palettes, then colours worked out to go together, then colours that shift along a stroke.

The fourth was the drawing side. Nibs and inks, so a hand-drawn line has some weight to it.

Here's the part worth writing down. Every one of those four rounds was a critique of output. None of them was a specification.

"The patterns are repetitive" is not a feature request. It doesn't say what to build. Getting from that sentence to "let each ring repeat differently" was the actual work, and the hard half of it was mine: looking at the thing, working out precisely what was wrong, and then saying it precisely.

That's a different skill from writing requirements in advance. You need the output in front of you first. Then you have to be exact about the failure. Vague dissatisfaction gets you vague changes.

## Using it

The generator is the loud half. The drawing side is the one I keep going back to.

I set a fixed symmetry, don't touch undo, and give it fifteen minutes. Then I delete the file. Not keeping it is the point. Nothing accumulates, so there's nothing to get better at and nothing to be precious about.

It's a quiet fifteen minutes. I'm not going to claim more for it than that.

**Live:** [mrdee.in/mandala](https://mrdee.in/mandala/)

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
