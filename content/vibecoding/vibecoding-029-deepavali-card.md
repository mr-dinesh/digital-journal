---
title: "Vibecoding 029 — A Deepavali card that lights its own lamps"
date: 2026-11-07
description: "An animated greeting card in Kannada and English, shared as a link. Five diyas light up one by one, then the message appears. The final version is simpler than the one I asked for halfway through."
tags: ["vibecoding", "javascript", "svg", "cloudflare", "festival"]
aliases: ["/writing/vibecoding-029-deepavali-card/"]
weight: -29
---

Deepavali is tomorrow. Every year my phone fills up with forwarded greeting images, each with a stranger's watermark in the corner. This year I wanted to send something of our own.

So I made a card. It's a web page. You open the link, five diyas light up one by one, and the greeting fades in. It's signed by the five of us at home.

**Live:** [s.mrdee.in/diwali](https://s.mrdee.in/diwali)

![The Deepavali card: a rangoli, five lit diyas, the greeting in Kannada and English](/images/writing/vibecoding-029-deepavali-card.jpg)

## Version one

I picked three things: an animated page, English with Kannada, and a warm, classic look. Claude came back with maroon and gold, a slowly turning rangoli, flickering diyas and gold sparks drifting up the screen. It's one HTML file. No framework, no build step.

Cloudflare Pages was going to call it `diwali-2026`. Someone else had got there first, so it became `diwali-2026-a9m.pages.dev`. That's not an address you read out to an aunt over the phone. It's `s.mrdee.in/diwali` now.

## The preview is the card

Most people won't open the link. They'll see the little preview WhatsApp puts under it and decide from that. So the preview matters more than the page.

It comes from three tags in the page head:

```html
<meta property="og:title" content="ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು · Happy Deepavali">
<meta property="og:description" content="With best wishes from ...">
<meta property="og:image" content="https://diwali-2026-a9m.pages.dev/og.jpg">
```

The image is a screenshot of the card, taken by headless Chrome. Keep it under about 300 KB, or WhatsApp quietly shrinks it or drops it. Mine is a 70 KB JPEG. WhatsApp also caches previews per link, so a fix you made five minutes ago may not show up. Add `?1` to the end of the link and it looks again.

## Two words

The first sign-off said "With love." That's lovely for friends. It's slightly alarming for a colleague you've met twice. "With warm regards" sounded like the end of an invoice. It says "With best wishes" now.

"Happy Diwali" became "Happy Deepavali," because that's what we say at home.

## The creative detour

The card looked good, and I said so. I also said it was predictable. Maroon, gold, rangoli, diyas: it's the first thing anyone would draw.

So we added interaction. The lamps started unlit, with a polite line underneath: "Tap each lamp to light it." Each tap lit one lamp and showed a name. There was a share button and a download button.

Then I used it. Nobody wants five taps of homework before they're allowed to read "Happy Deepavali." The buttons made it look like a banking app.

Out it all went. The lamps light themselves now, left to right, about three-quarters of a second apart. The names went back under the message, and the buttons went in the bin. The one thing I added was a little glitter: a few gold stars that twinkle along the inside of the frame. Only a few. It's a greeting card, not a wedding baraat.

## One for the office

The family card says "one lamp for each of us" and lists five names. That's a bit much for someone in accounts. So there's a second version for colleagues and people I know less well: English only, signed "Dinesh & Family," and drawn in ASCII.

![ASCII version of the card: a text border, HAPPY DEEPAVALI in block letters, five ASCII diyas lighting one by one, and a short greeting](/images/writing/vibecoding-029-deepavali-ascii.gif)

It's a GIF, made by a Python script that draws each frame as a grid of coloured characters. The lamps are `\=====/` with a flickering `(*)` on top.

WhatsApp broke it twice. The first GIF saved space by redrawing only the part of each frame that changed. Browsers play that fine. WhatsApp's converter didn't. The fixed GIF still came out smeared, because WhatsApp turns every GIF into a small, heavily compressed video. Thin strokes blur, gold text on maroon bleeds, and the soft glow behind the lamps turns into blocky bands.

The version that works is an MP4 made for WhatsApp: bigger, bold text throughout, no glow, sent with the HD button on. Text that looks crisp on a monitor has to be drawn heavier to survive a phone.

I then asked for something "more modern, professional and geeky, but subtle." Three design directions later, I stopped. It was already good enough.

## What I took away

The code for each version took minutes. Deciding what the card should be took the afternoon.

"Tap to light the lamps" sounds charming in a sentence. On a phone, it's a chore. You only find that out by opening it and using it.

The final card is almost the first one, with better timing. I'm told that's called design.

Happy Deepavali.

*Source: [github.com/mr-dinesh/diwali-card](https://github.com/mr-dinesh/diwali-card)*

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
