---
title: "Everything is Everything: What 128 Episodes of Amit Varma's Podcast Recommend"
date: 2025-07-12
description: "I scraped all 128 episodes of the EiE podcast and built reference spreadsheets for every book, song, and article recommended. Here's how."
tags: ["podcast", "data", "books", "python", "amit varma", "eie"]
---

I've been listening to *Everything is Everything* — Amit Varma and Ajay Shah's podcast — for a while now. Every episode is dense. Books, papers, essays, songs — recommendations come fast, buried in show notes that you'd have to open episode by episode to find. I kept thinking: somebody should just compile all of this.

So I did.

This post explains how I built three reference spreadsheets — one each for books, music, and articles — covering all 128 episodes of the podcast. Everything is on GitHub if you want to poke around or build on it.

→ **[github.com/mr-dinesh/eie-recommendations](https://github.com/mr-dinesh/eie-recommendations)**

---

## The Source Data

Every EiE episode on YouTube has a description that looks roughly like this:

```
1. The Anarchy — William Dalrymple: https://amzn.in/...
2. Seeing Like a State — James C. Scott: https://amzn.in/...
3. Moondance — Van Morrison: https://open.spotify.com/...
```

A numbered list. Title, separator (`--` or `—`), author or artist, then a URL. Sometimes the URL comes right after a colon with no separator line. Sometimes it's a tinyurl. The format isn't perfectly consistent across 128 episodes, but it's consistent *enough* to parse with regex.

I used `yt-dlp` to pull all episode metadata into a JSON file — 128 objects, one per episode, each containing the full description text. That became my working dataset.

---

## Extracting Books

The primary pattern I was looking for:

```
N. Title -- Author: https://amzn.eu/...
```

A two-regex approach handled the variation: the first pattern matched entries with the `--` or `—` separator; the second caught entries where the title and author ran together with just a colon before the URL.

The tricky part wasn't extraction — it was filtering. Amazon links don't only point to books. Over 128 episodes I found:

- A Nannari Root (herbal drink)
- A FreeStyle Libre glucose monitoring sensor
- The standing promo for *In Service of the Republic*, which appears in literally every single episode description

That last one was the interesting problem. Rather than hardcode it, I counted how many episodes each item appeared in. "In Service of the Republic" hit 128/128 — an obvious outlier. Everything else was episode-specific. That threshold approach cleanly separated boilerplate from genuine recommendations.

**Final count: 563 book recommendations across 128 episodes, 407 unique titles.**

The most recommended book? *Seeing Like a State* by James C. Scott — mentioned 9 times. A reliable signal of what this podcast is about.

---

## Extracting Music

Music entries follow the same `Title -- Artist` format as books, but the URL points to Spotify or YouTube instead of Amazon. The harder problem: YouTube links appear for *both* songs and podcast episodes. "Seen and the Unseen Episode 247" and "Moondance" look identical in format.

My solution: classify each YouTube item by its artist field. If the "artist" was something like "Seen and the Unseen", "Jack of All Knowledge", or contained the word "episode" — it's a podcast, not music. If it matched a known artist name or followed the short-name pattern typical of musicians, it was classified as music.

Spotify links were easier — I only kept `album/`, `artist/`, `track/`, and `playlist/` paths, rejecting `episode/` paths which are podcast episodes.

**Final count: 65 music recommendations.**

Top artists: Van Morrison (5 appearances), Bob Dylan (4), U2 (4), Joni Mitchell (4). A very specific kind of taste.

---

## Extracting Articles and Essays

This was the hardest of the three. Articles point to every kind of URL — academic papers on JSTOR, blog posts on Substack, news pieces on The Hindu, essays on paulgraham.com, poetry on poetryfoundation.org. The format is the same but the content type varies enormously.

My approach was domain-based classification. I built a dictionary mapping ~50 known domains to content types:

| Domain | Category |
|---|---|
| `jstor.org`, `arxiv.org` | Academic Paper |
| `econlib.org`, `ideasforindia.in` | Policy / Commentary |
| `paulgraham.com`, `substack.com` | Essay / Blog Post |
| `bbc.com`, `thehindu.com` | News / Journalism |
| `poetryfoundation.org` | Poetry |
| `orwellfoundation.com` | Literary / Arts Essay |

The genuinely hard case was tinyurl — many links are shortened, making domain lookup impossible. For those I fell back to author-based inference: items by Ajay Shah or Renuka Sane skew Policy/Academic; items by Amit Varma skew Essay/Blog Post.

The articles spreadsheet also has a topic taxonomy — 14 topics, assigned by keyword matching on the title, author, and episode title. Topics include Economics & Markets, India & Policy, Philosophy & Ethics, Sports, Technology, and others. Every article gets a primary topic so the "By Topic" sheet groups them into colour-coded sections.

**Final count: 486 articles and essays.**

Top contributor by far: Amit Varma with 115 pieces. Ajay Shah follows with 48. The largest topic cluster is Economics & Markets with 180 items — unsurprising for a show that started as an economics podcast.

---

## The Spreadsheets

Three files, each with multiple sheets:

**EIE_Book_Recommendations_Complete.xlsx**
- All 563 recommendations with episode links and Amazon URLs
- Unique books A-Z (407 titles)
- Summary stats

**EIE_Music_Recommendations.xlsx**
- 65 items with platform-coloured listen links (Spotify green, YouTube red)
- Unique tracks A-Z
- Summary stats

**EIE_Articles_Essays_v2.xlsx**
- All 486 items with fine content-type classification
- By Topic — 14 colour-coded sections
- By Author, Unique A-Z, Summary

All three are on the GitHub repo linked above, along with the source JSON and extraction scripts.

---

## What I Found Interesting

A few things stood out while building this:

The book recommendations are remarkably consistent. *Seeing Like a State* nine times. Scott's other work appears repeatedly. James C. Scott is clearly canonical on this podcast.

The music selections are personal in a way the books aren't. Van Morrison, Joni Mitchell, Bob Dylan — there's a very specific sensibility here that feels like Amit Varma's personal listening rather than curation for the audience. Which makes it more interesting, not less.

The articles section reveals the actual intellectual substrate of the show. The Economics & Markets cluster dominates, but Philosophy and India & Policy are close behind. Amid all the policy papers there are poems, literary essays, and pieces on cricket. The show refuses to be one thing, and the article list reflects that.

---

If you're a regular EiE listener and want a reading list without opening 128 YouTube descriptions, these spreadsheets are for you.
