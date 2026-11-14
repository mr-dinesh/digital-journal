---
title: "Vibecoding 012 — Reading The Wealth of Nations with a Paragraph-Level AI Tutor"
date: 2026-04-09
tags: ["vibecoding", "python", "flask", "gemini", "llm", "books"]
aliases: ["/writing/vibecoding-012-wealth-of-nations-reader/"]
description: "A reading app for Adam Smith's Wealth of Nations: click any paragraph and ask an AI about it, with the whole chapter in view. Built in one sitting with Claude Code."
---
![Wealth of Nations Reader](/images/writing/vibecoding-012-wealth-of-nations-reader.jpg)

### My own AI reading companion for The Wealth of Nations

*Project #12 of the 100 Vibe Coding Projects challenge*

---

I've been meaning to read Adam Smith's *The Wealth of Nations* for years. It hums in the background of every conversation about economics: the invisible hand, the division of labour, wages. But it's 900 dense pages, and I kept bouncing off it. Repeatedly.

Then I saw [Andrej Karpathy's tweet](https://x.com/karpathy/status/1886192184808149383) about building an AI tool just for reading. That clicked. What if I could ask questions as I read? Not "what does Adam Smith think about wages?", which any chatbot can waffle about, but "explain *this* paragraph, given the chapter I'm in".

That's the whole idea. A reader where every paragraph is a question waiting to be asked.

---

### How it works

Click a paragraph and a panel slides in where you can ask about it. The AI gets the whole chapter, the paragraph you picked, and your question. So it can see the argument around a sentence, not just the sentence on its own. There's also a button that summarises a whole chapter.

The book itself comes free from Project Gutenberg, split into its 33 chapters.

### How it looks

Three columns: the chapters down the left, the text in the middle on cream paper, and the question panel on the right. I wanted it to feel like reading a nicely printed book, not filling in a form. Old-style fonts, warm colours, and a little amber line beside the paragraph you're asking about.

### What happened when I actually read it

Adam Smith is subtler than his reputation. The famous "invisible hand" shows up exactly *once*, almost in passing. The good stuff is in his ideas about wages in Book I, and in Book V, which reads surprisingly modern on what governments should spend money on and how to tax.

Having the AI explain the background, like what people believed about trade back then and which laws he was arguing against, made chapters readable that would otherwise have sent me down hours of Wikipedia. I got further into this book in one week than in five years of good intentions. Which says more about my good intentions than about the book.

### The build

Claude Code built the whole thing in one sitting, from splitting up the book to putting it online. My only job was pasting in the AI key. I'm not sure that counts as a job.

**Source:** [github.com/mr-dinesh/Wealth_of_Nations_Reader_App](https://github.com/mr-dinesh/Wealth_of_Nations_Reader_App)
