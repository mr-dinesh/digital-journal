---
title: "Vibecoding 013 — Two Years of WhatsApp Links, Sorted and Searchable"
date: 2026-04-10
description: "I built a tool that pulls every link out of a WhatsApp group chat — 4,094 of them over two years — sorts them into categories, and lets you search them or download a spreadsheet."
tags: ["vibecoding", "python", "flask", "whatsapp", "data", "tools"]
aliases: ["/writing/vibecoding-013-link-archive/"]
---

![Link Archive](/images/writing/vibecoding-013-link-archive.png)

The Clear Writing Community WhatsApp group has been going for more than four years. Amit Varma started it, and it does what the name says: a few hundred people sharing things worth reading. Articles, podcast episodes, essays, the odd book. I've been in it for a little over two years.

The trouble is WhatsApp. Every link gets buried in the chat. The good ones scroll away, and the useful ones are impossible to find again. And there's no way to answer the obvious question: what does this group actually share?

This week I built something to find out.

→ **[github.com/mr-dinesh/link-archive](https://github.com/mr-dinesh/link-archive)**

---

## The build

My first question to Claude was vague: *how do I make an Excel sheet of all the links in a WhatsApp group chat?*

The chat export was in my Google Drive, so the AI started planning how to get permission to read my Drive, with keys and logins and settings. I went along with it for a while. Then I mentioned that the file was also sitting on my desktop.

That's my favourite vibecoding moment. All that setup disappeared in one message. The program now just opens the file on my desktop. Half an hour of fiddling with Google's settings never happened, because I finally said something obvious I should have said at the start.

---

## Reading WhatsApp's export

WhatsApp exports are messier than they look. Dates are written differently on Android and iPhone, in different countries, and with 12- or 24-hour clocks. And a long message spread over several lines has to be kept together, not chopped up. Once the program could tell where one message ends and the next begins, pulling out the links was easy. Duplicates are removed, so each link appears once.

---

## Sorting 4,094 links

The links fell into 22 groups by website: YouTube, Substack, Indian news, international news and so on, with a catch-all at the end for the rest.

Here's what two years of the Clear Writing Community shares:

| Category | Links |
|---|---|
| Substack | 1,469 |
| Blog / Personal / Miscellaneous | 983 |
| YouTube | 570 |
| Twitter / X | 214 |
| Instagram | 143 |
| International News | 113 |
| Indian News | 113 |
| Books / Amazon | 77 |
| Essays / Literary | 50 |
| Spotify | 49 |
| Medium | 45 |
| Cricket / Sports | 19 |

The Substack number surprised me. Nearly 1,500 newsletter links from a few hundred people. It's a writing group, so half the members probably have a Substack, but it says something about where independent writing lives now.

"Miscellaneous" is the honest category: 983 links that don't belong to any big platform. People's personal sites, websites I'd never heard of. One day I'll go through them by hand. One day.

---

## Giving it a proper face

The first version worked: run it, get a spreadsheet. But something this useful deserved a nicer face.

This is a writing community, so I wanted it to feel literary: dark background, elegant italic heading, no pastel dashboard look. You drop the WhatsApp file onto the page and get a results page with a count of links, a row of colourful category cards, a search box that searches everything at once, and a button to download the spreadsheet.

---

## What vibecoding this felt like

The direction was clear from the first message. Everything after that was polishing. The Google Drive detour was a real plan that got dropped when a simpler one turned up. The name of the catch-all category went through three versions, one message each. The design was a paragraph from me and one go from the AI.

What's different from coding the old way is that the AI keeps the whole conversation in mind. When I renamed a category, everything that used the old name changed too. When the Drive plan was dropped, all of it went. No leftover bits lying around.

Honestly, this is a simple tool: one small program, no accounts, no database. Other projects in this series are more ambitious. What this one shows is how short the gap has become between "I wish I could see all the links from my WhatsApp group" and "here are 4,094 of them, sorted, ready to download". It took an afternoon.

That gap used to be much bigger.

---

**[github.com/mr-dinesh/link-archive](https://github.com/mr-dinesh/link-archive)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in) series.*
