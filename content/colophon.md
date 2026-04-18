---
title: "Colophon"
date: 2026-04-18
layout: "single"
---

*How this site is made.*

---

## The stack

**Hugo** — static site generator. Fast, no runtime, Markdown in, HTML out.

**Congo** — the theme. Clean, readable, sensible defaults. I've changed very little.

**Cloudflare Pages** — hosting and deployment. Connects to the GitHub repo; every push to `main` triggers a build and deploy automatically. No servers to manage.

**Cloudflare** (DNS + security headers) — the `static/_headers` file sets HSTS, CSP, and a handful of other security headers. Old habits.

## Writing

Everything is written in Markdown. Posts live in `content/` organised by section: `vibecoding/` for the project write-ups, `notes/` for shorter technical pieces, `reading/` for book notes, `journal/` for everything else.

Images go in `static/images/`.

## The process

Write locally → push to GitHub → Cloudflare Pages builds Hugo → site is live. Usually under a minute end to end.

No CMS. No editor beyond VS Code. No analytics, no tracking, no comment system.

## Typography & design

Whatever Congo ships with. The font is readable, the contrast is decent, and I have not spent an afternoon tweaking line heights. This feels like a victory.

## Source

The blog source is private, but most of what's linked to from here — all the vibe coding projects — is public on [GitHub](https://github.com/mr-dinesh).
