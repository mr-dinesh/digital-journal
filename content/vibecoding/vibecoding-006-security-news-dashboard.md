---
title: "Vibecoding 006 — One Page, Five Sources, Zero Noise"
date: 2026-03-20
tags: ["Security", "News", "Cloudflare", "VibeCoding"]
aliases: ["/writing/vibecoding-006-building-a-slashdot-style-cybersecurity-news-dashboard-with-groq/", "/writing/vibecoding-006-security-news-dashboard/"]
description: "SlashSec pulls live RSS from five trusted security sources and uses Cloudflare Workers AI to generate summaries, severity ratings, and Slashdot-style dept. lines — no API key required."
---
![image](/images/writing/vibecoding-006-slashsec.png)

**[Live: slashsec.mrdinesh.workers.dev](https://slashsec.mrdinesh.workers.dev)**

---

I wanted a single place to read cybersecurity news from the sources I already trust — SANS ISC, Bruce Schneier's blog, Brian Krebs, Bleeping Computer, and Zack Whittaker's This Week in Security. I wanted something purpose-built for security, with AI-generated summaries short enough to scan quickly.

The result is **SlashSec**: a Cloudflare Worker that serves the full UI and handles RSS fetching and AI inference server-side. Open it and click Fetch Stories — no API keys, no setup.

---

### The Prompt

The core instruction to the LLM was deliberately narrow:

> *"You are a cybersecurity editor writing for a Slashdot-style infosec magazine. Given a JSON array of articles, return a JSON array where each element has a 3–4 sentence summary, a severity rating (high / medium / low), 2–4 tags, and a witty Slashdot-style department line."*

That's it. The model receives article titles and excerpts pulled from real RSS feeds. It never generates URLs — all links come directly from the feeds. This keeps the output grounded and avoids hallucinated references.

The "dept." line — borrowed from Slashdot's classic format — turned out to be the most useful prompt element. It forces the model to distil the article's tone into 3–5 words, which ends up being a surprisingly good quick-glance signal. Examples the model produces: *yet-another-breach dept*, *patch-tuesday-forever dept*, *supply-chain-never-sleeps dept*.

---

### The Architecture

The app is a single Cloudflare Worker (`worker.js`) that does three things:

- `GET /` — serves the full HTML/CSS/JS UI inlined in the Worker
- `POST /fetch` — server-side RSS proxy with an allowlist of 7 domains; no browser CORS issues
- `POST /groq` — runs inference via **Cloudflare Workers AI** (`llama-3.1-8b-instruct`); no external API key

The AI runs through Cloudflare's `[ai]` binding — the same mechanism used in [JuiceSec](/vibecoding/vibecoding-005-owasp-juice-shop-training/). No account needed beyond the Cloudflare deployment itself.

---

### Features

- **5 live RSS feeds** fetched concurrently on every refresh via a Worker-side proxy (no CORS issues)
- **AI summaries** — 3–4 sentences per article: what happened, who is affected, what to do
- **Severity classification** — High, Medium, or Low per article, with one-click filtering
- **Slashdot layout** — masthead, sticky nav, two-column story feed with sidebar, bylines, and dept. lines
- **Source colour coding** — each of the five sources has a distinct accent colour across all UI elements
- **Dashboard view** — severity distribution, per-source article counts, top tag cloud, all clickable
- **Dark and bright themes** — toggled with a single button, saved between sessions
- **Verified links** — every "Read More" link is sourced directly from the RSS feed, marked with a ✓ badge

---

### What Broke

**CORS, twice.** RSS feeds don't serve with the headers browsers need for cross-origin fetches. The first version used a three-proxy fallback chain (`allorigins.win` → `corsproxy.io` → a third fallback). This worked for about a day before rate limits kicked in and feeds started silently failing.

The fix was moving RSS fetching into the Worker itself. The Worker fetches feeds server-side with a proper `User-Agent` and an allowlist of permitted domains, then returns the XML to the browser. The browser never touches the feed hosts directly. No third-party proxy, no rate limits, no CORS.

The other problem was JSON reliability. The LLM returns JSON most of the time. "Most of the time" is not good enough when your UI depends on parsing it. The fix was wrapping every parse in a try/catch with a fallback to a safe default object — so a malformed response shows a placeholder summary rather than crashing the whole refresh.

---

### What I Learned

The "dept." line was an afterthought in the prompt — added because Slashdot had it and it seemed fun. It turned out to be the most useful part of the output.

A 3–5 word distillation forces compression that a 3–4 sentence summary doesn't. *supply-chain-never-sleeps dept* tells you the story before you read the headline. *patch-tuesday-forever dept* sets the tone immediately. Good prompt design often comes from constraints you didn't plan for. The lesson: include something playful in your prompt. It surfaces structure you didn't know you needed.

Moving CORS handling server-side (into the Worker) also eliminated the entire class of "proxy is down / rate-limited / blocked" failures. A Worker that fetches its own data is more reliable than a browser that depends on third-party CORS proxies. When something needs a server, give it a server.

### Get The Code

**[github.com/mr-dinesh/SlashSec_style-Infosec-RSS-Dashboard](https://github.com/mr-dinesh/SlashSec_style-Infosec-RSS-Dashboard)**

Deploy with `wrangler deploy` — the `[ai]` binding is pre-configured in `wrangler.toml`. No secrets to set.

---

*Built iteratively with Claude Sonnet. The Worker is about 1,200 lines of vanilla HTML, CSS, and JavaScript embedded in a Cloudflare Worker.*
