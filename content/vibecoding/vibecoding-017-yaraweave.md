---
title: "Vibecoding 017 — YaraWeave: From Threat Intel to YARA in One Click"
date: 2026-04-16
description: "A browser tool that looks up a piece of malware in several public databases, then has AI write a rule to detect it and explain that rule line by line."
tags: ["vibecoding", "security", "yara", "threat-intelligence", "gemini", "soc"]
aliases: ["/writing/vibecoding-017-yaraweave/"]
---

![YaraWeave — Threat Intel to YARA Rule Generator](/images/writing/vibecoding-017-yaraweave.jpg)

## The itch

Every security team I've worked with has the same gap.

They have plenty of information about the latest malware, often more than they can read. And they have YARA, a kind of "wanted poster" format that tells computers what a piece of malware looks like so they can spot it. Most teams have a few of these rules, usually inherited, rarely updated, author long forgotten.

What's missing is the step in between: someone who can read about a new strain of malware in the morning and have a working rule to catch it by lunch. That needs malware knowledge, detection skills and threat research all in one person. Those people are rare. It's the kind of gap AI might fill.

That's what YaraWeave is for.

→ **[github.com/mr-dinesh/yaraweave](https://github.com/mr-dinesh/yaraweave)**

---

## The idea

You give it either the unique fingerprint of a malware file or a malware family's name. It checks up to five free public databases at once, then asks an AI to write a rule from everything it found.

Not a toy rule that looks for the word "malware", but a real one, with the kind of patterns and conditions an expert would use, and a label saying when it was made and how serious the threat is.

Then it explains the rule, piece by piece, so a junior analyst who didn't write it can still understand it, adjust it and use it with confidence.

---

## Where the information comes from

| Source | What it adds | Key needed |
|---|---|---|
| MalwareBazaar | Family name, file type, when it was first seen | None |
| URLhaus | Where it's being spread from | None |
| OTX AlienVault | What the wider community has reported | Free |
| VirusTotal | How many antivirus programs catch it | Free |
| ThreatFox | Related clues and tags | None |

Several of these let a web page ask them directly, which is why the whole tool fits in one file with no server.

## Two questions to the AI

The first asks for the rule. I spelled out exactly what a good one looks like: a sensible name, several meaningful patterns, and conditions that aren't trivially dodged. The AI gets everything the databases returned.

The second asks for the explanation: what the threat is, how the rule works, why each pattern was chosen, how to deploy it, and how confident it is. That last part matters. A rule marked "low confidence" should be treated very differently from a "high confidence" one, and both are better than a rule that tells you nothing.

## Your keys stay with you

Any keys you add stay in your own browser. Nothing goes to a server of mine, because there isn't one. I wanted it to be something I could hand to a security person without them wondering where their keys were going. They would wonder. Security people always wonder.

---

## What vibecoding this felt like

Most of my builds are about getting the page to look and feel right. This one was about the instructions.

My first attempts got rules that looked fine and were useless: vague patterns, easy to dodge, labels full of placeholders. Basically a wanted poster that says "suspect has a face". The fix was to write the instructions like a proper specification. Once every requirement was spelled out, the AI stopped guessing and delivered.

The explanation step wasn't in the original plan. Once the rules were good, the obvious question was: who actually uses this? The analyst who made it might understand it. The person on the night shift who inherits it at 2am needs the explanation too.

---

## Try it

- **Claude Artifact:** [Run YaraWeave in your browser](https://claude.ai/public/artifacts/8c198f5f-e4db-4765-9ee2-b88ee0b35a1f)
- **GitHub:** [github.com/mr-dinesh/yaraweave](https://github.com/mr-dinesh/yaraweave)
- Open `yaraweave.html` in any browser
- Click **⚙ Configure** and add a free Gemini key (from [aistudio.google.com](https://aistudio.google.com))
- Try `Emotet` in family mode. No other keys needed.

The VirusTotal and OTX keys are optional, but they give the AI more to go on.

---

**[github.com/mr-dinesh/yaraweave](https://github.com/mr-dinesh/yaraweave)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series: turning 25 years of security work into things you can actually try.*
