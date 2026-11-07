---
title: "Vibecoding 029 — A Deepavali card that lights its own lamps"
date: 2026-11-07
description: "An animated greeting card in Kannada and English, shared as a link. Five diyas light up one by one, then the message appears. The final version is simpler than the one I asked for halfway through."
tags: ["vibecoding", "javascript", "svg", "cloudflare", "festival"]
aliases: ["/writing/vibecoding-029-deepavali-card/"]
weight: -29
---

Deepavali is tomorrow. I wanted to send friends and colleagues something better than a forwarded image with someone else's watermark on it.

So I made a card. It's a web page. You open the link, five diyas light up from left to right, and the greeting fades in underneath. It's signed by the five of us at home.

**Live:** [s.mrdee.in/diwali](https://s.mrdee.in/diwali)

![The Deepavali card: a rangoli, five lit diyas, the greeting in Kannada and English](/images/writing/vibecoding-029-deepavali-card.jpg)

## The first version

I gave Claude three choices to make. The format was an animated page shared as a link. The language was English with Kannada. The look was warm and classic.

It came back with deep maroon and gold, a slowly turning rangoli, a row of diyas with flickering flames and gold sparks drifting up the screen. The headline is ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು in Noto Serif Kannada. Everything is in one HTML file. The rangoli and diyas are hand-written SVG and the sparks are a small canvas loop. There's no framework and no build step.

It went up on Cloudflare Pages. The project name `diwali-2026` was already taken by someone else, so the address came out as `diwali-2026-a9m.pages.dev`. Nobody wants to type that. I already run a URL shortener at s.mrdee.in, so the card got `s.mrdee.in/diwali`. The shortener stores its links in Cloudflare KV, so adding one was a single `wrangler kv key put`.

## The part people actually see

Most people will never open the page. They'll see the preview WhatsApp draws under the link, and decide from that.

That preview comes from a few tags in the page head:

```html
<meta property="og:title" content="ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು · Happy Deepavali">
<meta property="og:description" content="With best wishes from ...">
<meta property="og:image" content="https://diwali-2026-a9m.pages.dev/og.jpg">
```

The image is a 1200×630 screenshot of the card. The page has an `?og` mode that lays the card out in landscape with all the lamps lit. Headless Chromium photographs it.

Two things I learned about WhatsApp here. It quietly drops or shrinks previews when the image is over about 300 KB. The first PNG was 282 KB, which was close. A later version came out at 377 KB, so it's a 70 KB JPEG now. WhatsApp also caches the preview per link. If you've pasted a link once, you keep seeing the old preview. Adding `?1` to the end makes it fetch again.

## Small wording, big difference

The first sign-off said "With love." That's fine for friends. It's a bit much for a colleague you've met twice. I asked about "With warm regards." Claude said that sounds like the end of a work email, and suggested "With warm wishes." I went with "With best wishes." It's the safest of the lot, and the card goes to both groups.

Later I changed "Happy Diwali" to "Happy Deepavali." That's what we say at home, and the Kannada line above it says ದೀಪಾವಳಿ.

## Then I asked for more

The card looked good. I said so. I also said it was predictable, and that I expected more creativity and more polish.

That was fair. Maroon, gold, rangoli, diyas: it's the first thing anyone would draw. Claude listed what was missing. The ideas were lamps you tap to light, a separate image sized for WhatsApp Status, a share button, a download button and a favicon.

I said yes to the lamps and the Status image. The new version started with five unlit diyas and a line saying "Tap each lamp to light it." Each tap lit one lamp and showed a name under it. When all five were lit, the message appeared.

Then I opened it in Chrome and tapped through it.

It was worse. Tapping five lamps is a small chore before you're allowed to read a greeting. The names under the lamps repeated the sign-off. The buttons made it look like an app, not a card.

So it came back out, one piece at a time. The lamps now light themselves, left to right, about three-quarters of a second apart. The names went back under the message. All the buttons went. The Status image stayed, because that one was useful. The only real addition was a little glitter: ten small gold stars that twinkle along the inside of the frame, two or three at a time.

The final card is much closer to the first version than to the "creative" one. What changed is the animation. The lamps lighting in order now carries the whole card.

## Things that went wrong

**The phone layout looked broken, but it wasn't.** One screenshot showed the card spilling off the screen. Headless Chromium had quietly made the viewport 500 pixels wide when I asked for 390. While chasing that, Claude found a real bug underneath. At a 390-pixel phone width, the five lamps needed 333 pixels and the card had 316. Both got fixed.

**The lamps lit themselves during the test.** I had set them to light on their own after seven seconds if nobody tapped. Claude loaded the page in Chrome, took a screenshot, thought for a few seconds and tapped two lamps. Three were lit. The timer had beaten it.

**The hint wouldn't leave.** After all five lamps were lit, "Tap each lamp to light it" was still on screen. A CSS fade-in animation was holding it visible, and that beat the rule meant to hide it. Making the lamps automatic removed the line, and the bug went with it.

**Wrangler's cache got committed.** `git add -A` picked up the `.wrangler/` folder, which has account details in it. It hadn't been pushed yet, so it came out of the commit and went into `.gitignore`.

## How it felt

Most of this project was taste, not code. The code for each version took minutes. Deciding what the card should be took the afternoon.

The useful step was opening it on a screen and using it, not reading about it. "Tap to light the lamps" sounded charming as a sentence. On the screen it was just one more thing to do.

Happy Deepavali.

*Source: [github.com/mr-dinesh/diwali-card](https://github.com/mr-dinesh/diwali-card)*

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
