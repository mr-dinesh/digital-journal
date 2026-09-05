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

The generator has 19 motif types, 24 palettes, 9 colour harmony generators and 7 gradient modes. The drawing side has an inkwell of metallic, gradient and classic inks, and 7 nib styles. One HTML file plus one JS file. No backend, no build step, and nothing fetched from anywhere else.

## How it got there

Four passes. Each one started from something already on the screen.

The first pass was a working generator. It produced mandalas. They were fine.

Then I told it the patterns were repetitive. That was the whole instruction. It pushed the motif count from 5 to 19, and it introduced per-ring symmetry multipliers so the inner rings could run at a different fold count from the outer ones. The second change was the one that mattered. The repetition came from every ring marching in step.

The third pass was colour: fixed palettes, then harmony generation, then gradient modes that shift along a stroke.

The fourth was the drawing side. Nibs and inks, so a hand-drawn line has some weight to it.

Here's the part worth writing down. Every one of those four rounds was a critique of output. None of them was a specification.

"The patterns are repetitive" is not a feature request. It doesn't say what to build. Getting from that sentence to per-ring symmetry multipliers was the actual work, and the hard half of it was mine: looking at the thing, working out precisely what was wrong, and then saying it precisely.

That's a different skill from writing requirements in advance. You need the output in front of you first. Then you have to be exact about the failure. Vague dissatisfaction gets you vague changes.

## Using it

The generator is the loud half. The drawing side is the one I keep going back to.

I set a fixed symmetry, don't touch undo, and give it fifteen minutes. Then I delete the file. Not keeping it is the point. Nothing accumulates, so there's nothing to get better at and nothing to be precious about.

It's a quiet fifteen minutes. I'm not going to claim more for it than that.

**Live:** [mrdee.in/mandala](https://mrdee.in/mandala/)

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
