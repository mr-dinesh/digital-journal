---
title: "Vibecoding 030 — A links page that fills itself from my phone"
date: 2026-11-08
description: "Share a link from any app on the phone, add a line about why, and it shows up on mrdee.in/links that night."
tags: ["vibecoding", "cloudflare", "pwa", "indieweb"]
weight: -30
images: ["og/links-inbox.png"]
---

I find a lot of good things on the web, and I lose most of them. They end up in a WhatsApp chat with myself, or in forty open tabs, or in a "read later" app I never open again. Read later, it turns out, means read never.

I wanted a public log instead. One page a day, a list of links, and a line on why each one is worth your time.

**Live:** [mrdee.in/links](https://mrdee.in/links/)

![The first day's links page on mrdee.in: two links, each with the site name and a short note](/images/writing/vibecoding-030-links-inbox.jpg)

## Where to put it

I started with a shortlist: Tumblr, TiddlyWiki, Bear Blog and write.as. Claude suggested one test for all of them. A daily habit lives or dies on how fast you can save a link from your phone. If it takes more than a tap and a sentence, I'll stop by Thursday. Claude knows me well.

Tumblr is quick, but the links would sit on someone else's site, among the ads. TiddlyWiki is a lovely notebook and awkward to publish from a phone. Bear Blog is clean, but has no share button, so every link means opening an editor. write.as is for essays.

So the links live here, on this blog, which already has a look, an RSS feed and visitor counts. The missing piece was getting a link from the phone onto the blog.

## How it works

It's a tiny app on my phone's home screen. Installing it puts "Links" in Android's Share menu, next to WhatsApp and Gmail.

When I share a page to it, I can type a note, and the link joins a queue. I can see the queue and delete anything I change my mind about. At 11:30 every night, the day's links get added to the blog as a single page, and the site updates itself.

I could have published each link the moment I shared it. But then there'd be no chance to take one back, and "one page a day" suits a nightly batch anyway. There's a **Publish now** button for when I can't wait.

## Cleaning up links

Shared links come with junk on the end. YouTube adds a tag that tells it who shared what with whom. Newsletters and Facebook add their own. The app strips 36 of these, so the link you see on my page doesn't report back to anyone.

If a link arrives without a title, the app looks up the page's title itself. And because those titles come from strangers' websites, it makes sure nothing in a title can sneak code onto my page.

## The password

My link shortener from an earlier project falls back to the password `changeme` if I forget to set a real one. Yes, really. This one refuses to do anything until a password is set. It's a one-line difference, and it's the line that matters if I'm ever in a hurry.

The key it uses to update the blog can do exactly one thing: change files on this blog. If it ever leaks, the damage stops there.

## The bug that wasn't in the code

The first time I pressed **Publish now**, it said the key wasn't set. I had set it. I could see it in the list.

It was set, to nothing. I'd pasted the key into a box that hides what you type, and on my computer the paste shortcut in that window is Ctrl+Shift+V, not Ctrl+V. So it saved an empty key and didn't say a word. Once I pasted it properly, the first two links went up a minute later.

## What I took away

The code took under an hour. Choosing where to publish took a conversation. The one bug was a keyboard shortcut.

A tool for a daily habit has to be quick to use, and this one is: share, type a line, done. Whether the habit lasts is up to me, and my track record with habits is mixed.

*Source: [github.com/mr-dinesh/links-inbox](https://github.com/mr-dinesh/links-inbox)*

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
