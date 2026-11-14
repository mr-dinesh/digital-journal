---
title: "Vibecoding 010 — The APK Analyzer That Runs on Your Machine and Tells No One"
date: 2026-03-31
tags: ["vibecoding", "security", "android", "flask", "python"]
aliases: ["/writing/vibecoding-day010-offline-apk-security-analyzer/", "/writing/vibecoding-010-apk-security-analyzer/"]
description: "A tool that checks Android apps for security and privacy problems, on your own computer. Nothing gets uploaded anywhere."
---
![image](/images/writing/vibecoding-010-apk-analyzer.png)

Part of my job is checking Android apps for security problems. For years I've done it by hand: unpack the app, read through its insides, take notes in a terminal window that vanishes the moment I close it. It works. It's also slow, and I keep losing my notes.

This week I turned that routine into a tool. You give it an app file and it gives you a tidy report in your browser. No internet needed. Nothing is kept: the app is deleted as soon as the check is done.

---

## Why offline?

There are online scanners that already do this. But the apps most worth checking carefully, like banking apps, company apps and anything holding personal data, are exactly the ones you shouldn't upload to a stranger's server. Doing it on your own machine settles that question.

And building it myself means I know every rule it uses. When I tell someone their app has a problem, I can explain exactly why I think so.

## What it checks

1. **The app's permissions**: what it asks to access, like your location, texts or contacts
2. **Leftover secrets**: passwords and keys developers forgot to remove
3. **Third-party add-ons**: which outside companies' code is built in, and what they collect
4. **Encryption**: whether the app protects data properly or uses weak, outdated methods
5. **Secure connections**: whether it insists on encrypted connections and checks it's talking to the right server

## The add-ons are the interesting part

Most apps include code from other companies, for analytics, crash reports, adverts and so on. The tool recognises more than 30 of them and explains each one. One popular monitoring add-on, for example, can record whole user sessions by default. In a banking app that could mean your balance and transactions end up on someone else's server. The report says so, and says what to check.

Add-ons that improve security get a thumbs-up instead.

## The finding I like best

Apps can be told to trust only their own server's certificate, which makes it much harder to snoop on them. Developers can also put an expiry date on that rule. When the date passes, the protection quietly switches off. No warning, no error, nothing.

I've seen this in real apps people use every day. It takes five minutes to fix once you spot it, and almost nobody does.

## Leftover secrets

The tool reads the app's settings files looking for things that shouldn't be there: payment keys, test website addresses, internal network addresses. It can't see everything; some secrets are buried deeper and need a heavier tool. The report says so plainly instead of pretending.

## A grade

Each report gets a letter from A to F. Serious problems knock off the most points. The grade is a way to start a conversation, not a verdict. The real value is in the specific findings.

## What broke

The main library I used had changed completely since the version every online example was written for. My code ran without errors and found nothing at all. A perfectly clean report on a real banking app should have made me suspicious sooner than it did. The tool now complains loudly when something fails, instead of quietly handing back a blank.

There were also a few small housekeeping problems: files not being cleaned up, and the program losing track of its own folder. All fixed.

## What's next

I'd like it to dig deeper automatically, into the parts it can't read yet. And I'd like a "compare two versions" mode, to catch the moment a marketing team quietly adds a new tracker in an update.

---

**[github.com/mr-dinesh/Offline-APK-Analyzer](https://github.com/mr-dinesh/Offline-APK-Analyzer)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
