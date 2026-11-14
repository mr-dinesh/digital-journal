---
title: "Vibecoding 001 — The URL Sanitizer That Strips Trackers Before You Click"
date: 2026-03-14
tags: ["vibecoding", "browser-extension", "privacy"]
aliases: ["/writing/vibe_coding_001/", "/writing/vibecoding-001-url-tracker-sanitizer/"]
description: "Built a browser extension with Gemini that strips tracking parameters from URLs before you open them. Day 1 of the 100 Vibe Coding Projects challenge."
---
![image](/images/writing/vibecoding-001-purelink.png)


### Two big ideas here
- Idea #1: Use an AI to make something, anything.
- Idea #2: Do it a hundred times.
- A third idea: write about each one. (Why that counts as a bigger idea I'll explain later, assuming I remember.)

### Today's idea: a browser add-on that cleans up links

You know those long links with `?utm_source=...` and a string of gibberish on the end? That gibberish mostly tells some company where you clicked from. PureLink chops it off before the page opens.

Tool of choice: Gemini. I got the idea from [S Anand's talk](https://www.youtube.com/watch?v=mCJLNML7FrE).

What surprised me was how easy it was, and how close the result came to what I'd pictured. What surprised me more was that it actually worked. I even got the AI to name it and draw an icon.

### Some caveats
- I'm not sure how well the cleaning really works.
- There are lots of add-ons that already do this, so why mine? Honestly, because it was day one and I wanted to see if I could.
- I need to spend more time checking the results and reading the code it wrote.

### What broke

The first version caught the obvious trackers and missed the sneakier ones that Facebook, Google and Microsoft add. The AI built the add-on itself perfectly well. It just didn't know the full list of things to remove, and nobody really does, because the advertising companies keep inventing new ones. The icon was also, let's say, a first draft.

### What I learned

The AI is great at the boring setup work. The actual judgement, deciding what counts as a tracker, still needs a human checking current sources. [ClearURLs](https://github.com/ClearURLs/Addon) has kept that list for years. PureLink should probably just borrow it.

### The security angle

In my day job those tracking tags can be useful. On a scam link, they can show investigators which campaign a click came from. Stripping them protects your privacy, and it also removes clues someone might want later. Fine at home; worth knowing at work.

### Further reading
- [ClearURLs](https://github.com/ClearURLs/Addon): the serious, maintained version of this idea
- [URL Cleaner by Jibin](https://chromewebstore.google.com/detail/url-cleaner/dffbjiomnajbmlhjelpipfldgkijdemn): a Chrome alternative
- [PureLink source](https://github.com/mr-dinesh/Vibecoding001-PureLink_browser_addon): the day-one version, warts and all
