---
title: "Vibecoding 005 — Making a 30-Year-Old Codebase Approachable With AI"
date: 2026-03-19
tags: ["vibecoding", "open-source", "learning", "curl"]
aliases: ["/writing/vibecoding-005-curl_source_explorer/", "/writing/vibecoding-005-curl-source-explorer/"]
description: "A browser app that walks you through how curl works inside, with AI explanations pitched at your level and a way to track your progress."
---
![image](/images/writing/vibecoding-005-curl-explorer.png)


## A guided tour of a famous old program

curl is a small program that fetches things from the internet. It's been around since 1998, and it's on nearly every computer, phone, car and smart TV you own. You've almost certainly used it without knowing. Almost nobody has read how it works.

That's because it's a big pile of old, careful code with no tour guide. Your choices are to dig through 170,000 lines on your own or not bother. I'd always picked "not bother".

So I built a small app to make it less scary.

## How it works
You pick a part of curl: how it finds a website's address, how it sets up a secure connection, how it handles cookies, how it follows a link that's moved. Then you step through the important pieces one at a time. Each shows the real code next to an AI explanation pitched at your level. Beginners get everyday comparisons. Experienced programmers get the design choices and the edge cases.

It also keeps track of what you've learned. You can mark things as understood or "come back to this", jot notes, and quiz yourself. It all stays on your own computer.

There's nothing to install beyond a free AI key. And it's honest about its limits: every snippet links to the real, current file, because curl changes almost daily and my copy will go out of date.

The point isn't to replace reading the code. It's to make the code friendly enough that you actually open it.

### What I asked for

> *Build a browser-based learning app for the curl source code. The app should let a user select a module — DNS resolver, TLS handshake, cookie engine, HTTP redirect logic — and step through its key functions one by one. For each function, show the actual source code alongside an AI-generated explanation tuned to the user's experience level. Beginners should get plain-English analogies. Experienced C programmers should get architecture notes, edge cases, and implementation tradeoffs. The app should track progress: users mark concepts as understood or flagged for review, add notes, and quiz themselves. Everything should persist across sessions. Use React and the Groq API (Llama 3.3 70B). Every code snippet must link directly to the live file on GitHub, with a disclaimer that the embedded code is a snapshot.*

### GitHub repo

[github.com/mr-dinesh/Curl-Source-Code-Explorer](https://github.com/mr-dinesh/Curl-Source-Code-Explorer)
