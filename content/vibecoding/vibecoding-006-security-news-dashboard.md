---
title: "Vibecoding 006 — One Page, Five Sources, Zero Noise"
date: 2026-03-20
tags: ["vibecoding", "security", "news", "cloudflare"]
aliases: ["/writing/vibecoding-006-building-a-slashdot-style-cybersecurity-news-dashboard-with-groq/", "/writing/vibecoding-006-security-news-dashboard/"]
description: "SlashSec pulls the latest stories from five trusted security news sources and uses AI to write short summaries, a severity rating and a cheeky one-liner for each."
---
![image](/images/writing/vibecoding-006-slashsec.png)

**[Live: slashsec.mrdinesh.workers.dev](https://slashsec.mrdinesh.workers.dev)**

---

I wanted one page with the security news I actually trust: SANS, Bruce Schneier, Brian Krebs, Risky.Biz, and Zack Whittaker's This Week in Security. Short summaries I could skim over coffee, instead of fourteen open tabs I'd never get to.

The result is **SlashSec**. It looks like Slashdot, the old "news for nerds" site, if you're old enough to remember it. Open it, press Fetch Stories, and it does the rest. No sign-up, no keys.

---

### What I asked the AI to do

The instruction was deliberately narrow:

> *"You are a cybersecurity editor writing for a Slashdot-style infosec magazine. Given a JSON array of articles, return a JSON array where each element has a 3–4 sentence summary, a severity rating (high / medium / low), 2–4 tags, and a witty Slashdot-style department line."*

The AI only summarises. It never makes up links: every "Read more" goes straight to the original article.

The best part turned out to be the "department" line, a Slashdot tradition: a jokey tag of a few words on every story. The AI comes up with gems like *yet-another-breach dept*, *patch-tuesday-forever dept* and *supply-chain-never-sleeps dept*. They tell you the mood of a story faster than the headline does.

---

### What it does

- Pulls the latest stories from all five sources every time you refresh
- Three or four sentences per story: what happened, who's affected, what to do
- Rates each story high, medium or low, so you can skip straight to the scary ones
- Gives each source its own colour
- A summary page with counts and popular topics
- Light and dark modes
- Every link checked against the original feed

---

### What broke

The news sites don't let other web pages read their feeds directly. My first fix was to borrow free middleman services that fetch the feeds for you. They worked for about a day, then got overwhelmed and quietly stopped. Free things are like that. Now my own little server fetches the feeds itself, and it's been reliable since.

The AI also sends back slightly garbled answers now and then. Instead of crashing the whole page, a garbled story now just shows a placeholder.

---

### What I learned

I added the "department" line on a whim, because Slashdot had one and it seemed fun. It turned out to be the most useful part. Squeezing a story into four words makes the AI find its point. So, lesson learned: put something playful in your request. It might end up doing the real work.

And when something needs a server, give it a server instead of borrowing someone else's for free.

### Get the code

**[github.com/mr-dinesh/SlashSec_style-Infosec-RSS-Dashboard](https://github.com/mr-dinesh/SlashSec_style-Infosec-RSS-Dashboard)**

---

*Built step by step with Claude.*

---

*Update, 8 November 2026: The AI model SlashSec used was retired, and the summaries stopped. It now uses a newer one. While fixing that I found the page was still using those old borrowed middlemen, which had since shut down, so every feed was failing. That's fixed too. Bleeping Computer was swapped for [Risky.Biz](https://news.risky.biz/), because Bleeping Computer blocks requests from the service I host on.*
