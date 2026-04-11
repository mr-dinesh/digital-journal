---
title: "Vibecoding 002 — I Rebuilt Winamp's Visualizer in a Browser Tab"
date: 2026-03-15
tags: ["Audio", "WebGL", "Browser", "VibeCoding"]
aliases: ["/writing/vibecoding_day002/", "/writing/vibecoding-002-browser-audio-visualizer/"]
description: "Used Claude to build VIZMIX — a Winamp-inspired 3D audio visualizer in the browser with five visualization modes, live mic input, and trippy WebGL effects."
---
![image](/images/writing/vibecoding-002-vizmix.png)

### VIZMIX — A Winamp-Inspired 3D Audio Visualizer for the Browser

*Project #2 of the 100 Vibe Coding Projects challenge*

The prompt was simple: build something that visualises music the way Winamp used to — but in a browser tab, using X, Y and Z axes instead of a flat frequency bar. Claude took that constraint seriously.

The result is **VIZMIX**: five 3D visualisation modes (classic frequency bars, a dual waveform, a waterfall cascade, a particle sphere that deforms to the beat, and an infinite zooming tunnel), six colour palettes, and a handful of live effects — trippy hue shifts, bloom brightness, mirror symmetry, and auto-orbit. Drop in any audio file or switch to live mic input. Control sensitivity, speed, and camera angle in real time.

[Source code on GitHub](https://github.com/mr-dinesh/Vibecoding_002_VIZMIX--Winamp-inspired-3D-audio-visualize/tree/main)

### What Broke

SPHERE and TUNNEL — the two most ambitious modes — don't render correctly on all hardware. SPHERE loses its bass-deformation response on lower-end GPUs; TUNNEL stutters at high frame rates due to a depth buffer issue. Both have the same root cause: the WebGL implementation assumes consistent frame timing that mobile browsers and integrated graphics don't always deliver. The fix requires delta-time calculations. Version 2 problem.

BARS and WAVE work reliably. FALL is somewhere in between. If you're demoing this, stick to BARS.

### What I Learned

Claude generates functional WebGL code, but it codes to a happy path — a well-spec'd desktop browser on good hardware. Edge cases (mobile Safari, integrated graphics, high-DPI displays) aren't in scope unless you put them in scope explicitly. The lesson: be specific about the target environment in the initial prompt, not after something breaks.

Also: constraints drive creativity. "Use X, Y, Z axes" in the original prompt is what forced the 3D approach instead of the standard flat frequency bars you see everywhere. The best part of the output came directly from the most specific part of the prompt.

### The Security Angle

Building this was a reminder that the browser's permission model is doing real security work, even on something as harmless as a music visualiser. The Web Audio API and WebGL both require a user gesture to initialise — no page can start capturing audio or rendering 3D graphics without the user interacting first. Same reason autoplay video is blocked by default.

It's easy to dismiss these browser restrictions as friction. They're not. They're the same security boundary that stops a malicious page from silently activating your microphone. Worth appreciating.

### Interesting Asides
- [Pixabay](https://pixabay.com/music/) has a surprisingly good library of royalty-free music for testing.
- [Audio Coffee Background Visualization](https://pixabay.com/music/upbeat-melodic-background-visualization-120919/) — good test track for the waterfall mode.
