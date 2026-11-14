---
title: "Vibecoding 004 — Building My Own Interview Coach for a Security Role"
date: 2026-03-17
tags: ["vibecoding", "security", "career", "ai"]
aliases: ["/writing/vibecoding-004-interview_simulator_webapp/", "/writing/vibecoding-004-security-interview-simulator/"]
description: "A flashcard app with 80+ cards for senior cybersecurity interview prep, covering risk, governance, storytelling and leadership language."
---
### What I asked for
Build an interview simulator for an upcoming interview for a senior cybersecurity role. Make flashcards that give me the right vocabulary for risk, governance, leadership, team building, and telling stories in the STAR format.
The app should help me practise regularly by tracking my practice time, weak areas and strengths, and let me add my own sources and job descriptions.
Example role: Director SOC

Second round: some card text spills off the edge, so fix that. Also let me upload a spreadsheet of new cards instead of typing them one at a time.

### The tool: CyberPrep

A flashcard app for senior security interviews. No sign-up, nothing to install. It's a single web page that remembers your progress. Open it and start practising.

### Why I built this

Interviews for senior security jobs aren't about technical trivia. They want to know if you can talk about risk the way a business does, lead a team when things are on fire, and explain to a board why they should spend money. And they want you to tell your stories in a tidy shape: what happened, what you did, how it turned out.

Words matter here. "We had an incident" and "we had a serious breach that we had to report to the board and the regulator" describe the same bad day. They say very different things about how you think.

I needed something to drill that language until it came out naturally. Nothing I found was specific enough, so I built one. It was also a very productive way to avoid actually preparing.

### What the cards look like

There are 80-plus cards in seven groups. A few examples:

#### Risk & Governance
> Q: How do you communicate cyber risk to a non-technical board?
> A: Talk about business impact: money lost, fines, reputation, disruption. Use scenarios, not statistics. "An attack like this usually costs $X in downtime and $Y to recover" lands better than a technical severity score.

#### STAR framework
> Q: Describe a time you had to make a security decision with incomplete information.
> A: Situation: the context. Task: your responsibility. Action: what you did and why, including what you chose not to do. Result: what happened, ideally with a number or a timeframe. They're judging how you think, not only how it ended.

#### Leadership
> Q: How do you build a security culture in an organisation that sees security as friction?
> A: You don't order it. You make the safe way the easy way. Start with things that remove hassle, like single sign-on, password managers and automatic updates. Then build on the goodwill.

### How it decides what to show you

After each card you mark it easy, medium or hard. Easy ones come up less often; hard ones come back more. After three or four sessions the deck is mostly made of the questions you keep fumbling, which is humbling but useful.

### What broke

Long answers spilled off the card, which looked terrible. That took a second try to fix. Typing cards one by one was also too slow, so it now takes a spreadsheet.

### What I learned

Flashcard apps sound simple and turn out to be fiddly. The card-flip animation alone took two attempts, and it behaved differently in different browsers.

The bigger lesson: writing the cards was more useful than using the app. Making yourself put "how do you keep a stressed security team going?" into a few clear sentences *is* the preparation. The app just makes you do it again and again.

### Did it help?

Yes. The language started to feel normal instead of rehearsed, and telling stories in that tidy shape began to come naturally. Whether the interview goes well is still to be seen, but this is the best I've ever prepared.

### GitHub repo
[github.com/mr-dinesh/Vibecoding-004-Interview-Simulator-Webapp](https://github.com/mr-dinesh/Vibecoding-004-Interview-Simulator-Webapp/tree/main)
