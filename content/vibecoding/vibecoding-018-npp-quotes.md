---
title: "Vibecoding 018 — Rescuing 247 Notepad++ Quotes Before They Stay Hidden"
date: 2026-04-17
description: "Notepad++ has a hidden easter egg: type the word 'random', select it, press F1, and a random quote appears. I pulled out all 247 of them."
tags: ["vibecoding", "python", "notepad++", "quotes", "tools"]
aliases: ["/writing/vibecoding-018-npp-quotes/"]
---

![Notepad++ Quotes Extraction](/images/writing/vibecoding-018-npp-quotes.png)

## The itch

Notepad++ is a free text editor loved by programmers, and it has a hidden easter egg most people never find. Type the word `random`, select it, and press F1. A little window pops up with a quote picked at random from 247 tucked away inside the program. Sometimes it's programming wisdom. Sometimes it's dark humour. Sometimes it's completely unhinged.

> *"Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live."*
> — Martin Golding

I found this years ago and kept setting it off whenever I needed a laugh. Then one day I wanted a particular quote I remembered, and realised there was no way to find it. The window shows one quote and closes. No list, no search. The only option is to keep pressing F1 and hope. Not a great system.

That felt like a problem I could solve.

---

## The build

The program's code is public, and the quotes sit together in one file, each written as "author: quote". A small script read them all, tidied up the line breaks, and wrote them out as a plain list. That's it. Two hours, start to finish.

Out came 247 quotes:

- **Programming legends:** the people who invented the languages and tools everyone uses
- **Don Ho originals:** the author of Notepad++ added several of his own, from thoughtful to deliberately absurd
- **Anonymous gems:** the bulk of the list, the kind that did the rounds on programmer forums years ago
- **Oddballs:** a Space Invaders drawing made of keyboard characters, a Bruce Lee parody, and `Internet #404: Quote not Found`

A few favourites:

> *"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it."*
> — Brian Kernighan

> *"The plural of regex is regrets."*
> — Anonymous #202

> *"int getRandomNumber() { return 4; // chosen by fair dice roll, guaranteed to be random. }"*
> — xkcd.com

> *"Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25"*
> — Anonymous #195

> *"Artificial Intelligence is no match for natural stupidity."*
> — Terry Pratchett

> **Word of the Day: DEBUGGING** — *The classic mystery game where you are the detective, the victim and the murderer.*

That last one is my autobiography.

---

## What to do with 247 quotes

Getting them out was the easy part. The fun is what you can do with them:

- Show a random one every time you open a terminal window
- Turn them into a daily quote bot, like my [Kagga bot](/vibecoding/vibecoding-009-kaggabot-github-actions/). There are enough for eight months without repeats.
- Put a new one on your desktop wallpaper every morning
- Or just click through them below

Here are all 247. A random one loads each time; press the button for another.

<div id="npp-quote-widget" style="border-left:3px solid #888;padding:1rem 1.25rem;margin:1.5rem 0;background:rgba(128,128,128,0.07);border-radius:0 6px 6px 0;">
  <p id="npp-q" style="margin:0 0 0.5rem;font-style:italic;white-space:pre-wrap;line-height:1.6;">Loading...</p>
  <p id="npp-a" style="margin:0;font-size:0.85em;opacity:0.7;"></p>
  <button id="npp-next-btn" style="margin-top:0.75rem;padding:0.3rem 0.8rem;font-size:0.8em;cursor:pointer;border:1px solid #888;background:transparent;border-radius:4px;">another one &rarr;</button>
</div>
<script src="/js/npp-quote-widget.js" defer></script>

---

## What vibecoding this felt like

A tiny project: about two hours from "I wonder if I can get these out" to a tidy list. No server, no AI service, nothing fancy.

But a lot of useful work is this shape. The quotes already existed. They were just locked away, shown one at a time in a little box. Getting them out didn't create anything new. It made something that already existed findable.

The Kagga bot earlier in this series did the same for Kannada poetry. Same instinct: open the door to something good that's been sitting behind it.

---

**[github.com/mr-dinesh/npp-quotes](https://github.com/mr-dinesh/npp-quotes)**

*Part of the 100 Vibe Coding Projects series.*
