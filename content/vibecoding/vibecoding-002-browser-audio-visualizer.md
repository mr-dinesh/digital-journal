---
title: "Vibecoding 002 — I Rebuilt Winamp's Visualizer in a Browser Tab"
date: 2026-03-15
tags: ["vibecoding", "audio", "webgl", "browser"]
aliases: ["/writing/vibecoding_day002/", "/writing/vibecoding-002-browser-audio-visualizer/"]
description: "Used Claude to build VIZMIX — a Winamp-inspired 3D audio visualizer in the browser with five visualization modes, live mic input, and trippy effects."
---
### VIZMIX: Winamp's dancing lights, in a browser tab

*Project #2 of the 100 Vibe Coding Projects challenge*

If you used a computer around 2000, you remember Winamp and the hypnotic patterns that danced along to your MP3s. I wanted that back, but in a browser tab and in 3D. Claude took the brief more seriously than I did.

The result is **VIZMIX**: five ways to watch music (bouncing bars, a wavy line, a waterfall, a ball that throbs with the bass, and an endless tunnel), six colour schemes, and a few knobs for extra trippiness. Drop in a song or let it listen through your microphone. Then watch it and feel about fifteen again.

[Source code on GitHub](https://github.com/mr-dinesh/Vibecoding_002_VIZMIX--Winamp-inspired-3D-audio-visualize/tree/main)

### What broke

The two fanciest modes, the ball and the tunnel, sulk on slower computers and phones. They assume a fast machine, and on a modest laptop they stutter. Fixing that is a job for version 2. If you're showing it off to someone, stick with the bars. They never let you down.

### What I learned

The AI writes for the best case: a good computer with a modern browser. If you want it to work on your aunt's old phone, you have to say so at the start, not after it breaks.

Also, a specific request makes for a better result. I asked for "up, across and into the screen" instead of flat bars, and that one line is why it looks interesting. The best part of the output came from the most specific part of my ask.

### The security angle

A web page can't start listening to your microphone until you click something. That felt like a nuisance while I was building this. It's actually the same rule that stops a dodgy site from quietly switching on your mic. A small bit of friction that earns its keep.

### Asides
- [Pixabay](https://pixabay.com/music/) has a good library of free music for testing.
- [Audio Coffee Background Visualization](https://pixabay.com/music/upbeat-melodic-background-visualization-120919/) looks great in the waterfall mode.
