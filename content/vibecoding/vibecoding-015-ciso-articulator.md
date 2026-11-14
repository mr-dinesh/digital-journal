---
title: "Vibecoding 015 — A Timed Communication Drill for Security Leaders"
date: 2026-04-12
description: "A timed speaking drill for security leaders: 26 tricky situations across three modes, with AI feedback on jargon, clarity and talking like a business person."
tags: ["vibecoding", "python", "flask", "security", "llm", "tools"]
aliases: ["/writing/vibecoding-015-ciso-articulator/"]
---

![CISO Articulator](/images/writing/vibecoding-015-ciso-articulator.jpg)

There's a particular way security chiefs fall flat, and I've been thinking about it for a while. Most of them are excellent at the job. They know the threats and how to build a security team, and could design the defences in their sleep. What they can't do, and were never taught to do, is explain any of it in under a minute to a board member who slept badly and has three more meetings after this one.

"The last security chief brought a 40-slide deck. The audit committee hated it."

That's the first scenario in this tool. I built CISO Articulator as the practice you do *before* you walk into that room. No finger-pointing. Most of us have felt the pull of slide 41.

→ **[github.com/mr-dinesh/ciso-articulator](https://github.com/mr-dinesh/ciso-articulator)**

---

## The three modes

**Daily Drill** covers everyday boardroom moments. Twelve of them: the finance chief asking why the budget is so big when nothing bad happened, the CEO asking what some buzzword actually means, the board member who just read about a competitor getting hacked and wants to know if you're next. They're meant to be uncomfortable. You get 60 seconds, about what you'd get in a corridor or a board Q&A.

**Interview Prep** is for the pressure of a job interview for the top security role. How do you tell the board about a major breach on the morning it happens? When do you call the police? What's your biggest failure? Eight situations, chosen to test your instincts, not your rehearsed answers.

**CV Interrogation** is the sharpest. It takes the kind of claims that show up on real CVs, like "reduced risk by 40%" or "built a security culture", and treats them as a dare. You claimed it. Now explain it out loud, with no slides, to someone who won't let you off easy.

---

## How it works

You see a situation, a timer starts, and you type your answer. A word counter keeps you between 60 and 120 words: short enough to force you to choose, long enough to make a real point. Then an AI coach reads your answer and replies in three parts:

- **What worked:** something specific that landed
- **What to fix:** the exact phrase or gap
- **A better opening:** a stronger first sentence

I told the coach to skip the flattery. Without that, AI is relentlessly nice: "Great answer! Maybe consider…" That's the coaching version of a 40-slide deck. With it, the feedback names actual phrases you should drop.

---

## The look

I wanted it to feel like a sparring partner, not an online course. Less e-learning, more boxing gym. Cream background, a big ticking timer, a black button, and the scenario text front and centre.

Most first attempts come in short. People write 30 words and stop, because they've said the "right" thing. The coach usually points out the same problem: you said what you'd do, but not how, and you never connected it to what the business cares about.

---

## What vibecoding this felt like

Writing the scenarios was the hardest part, and the part that mattered most. It's easy to write twelve versions of "explain X to a non-technical person", and they'd all get the same feedback. The good ones have office politics baked in. The finance chief is nodding along while the operations chief argues against the disaster drill. The new board chair asks what keeps you up at night, because she's heard it answered badly before.

I knew what the app should look like before it was built, and that left all the effort for the scenarios and the coaching, which is where the value is.

There are probably forty more scenarios worth writing. And every security CV, mine included, has at least three claims that deserve exactly this kind of grilling.

---

**[github.com/mr-dinesh/ciso-articulator](https://github.com/mr-dinesh/ciso-articulator)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
