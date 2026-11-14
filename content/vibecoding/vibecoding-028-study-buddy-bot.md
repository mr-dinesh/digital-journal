---
title: "Vibecoding 028 — A study buddy on Telegram for AB"
date: 2026-11-07
description: "A Telegram bot that sends AB a short spoken lesson every morning, asks him a question, and checks his answer. Built on an old lab box that kept rebooting mid-install."
tags: ["vibecoding", "ai-agents", "telegram", "education", "accessibility"]
aliases: ["/writing/vibecoding-028-study-buddy-bot/"]
weight: -28
---

AB, a family member, started a Bachelor's in English with IGNOU this year. IGNOU is a distance university. You get the books, you get the exam dates, and the rest is up to you.

That's hard for anyone. AB has low vision, and he learns best by listening. A 380-page PDF is not a friendly thing to hand him. So I wanted something that would sit with him a little every day. Read him one small piece of the book. Ask him one question. Listen to his answer. Be patient about it. Every single day, without getting tired or irritated.

I am not that patient. A bot might be.

## What it does

He gets a voice note on Telegram at 8:30 every morning. It's a little under two minutes long and covers one section of one unit. The text sits underneath, in case he wants it. At the end there's one question.

He answers by holding down the mic button and talking. The bot listens and tells him what he got right first. Then it gives him one correction, never five. If he missed the idea, it asks again in simpler words.

At 7 in the evening it checks in again. It asks about the morning's topic, and maybe something he struggled with a few days earlier. Things he gets wrong come back after one day, then three, then seven. That's an old memory trick, and it works.

On Sunday evening I get a short email. What he covered, what went well, where he's stuck. No surveillance, just enough to know if I should sit with him on a weekend.

He can also just talk to it. "Repeat." "Slower." "Simpler." "Stop for today." It does what he says.

## How it's built

The bot is built on Hermes, a free, open-source AI assistant. It runs on an old computer at home and looks after the Telegram side, the voice and the timetable. An AI model does the thinking.

The voice is a free reading-aloud service with an Indian English accent. When AB speaks, a small program on my own computer turns his voice into text. I gave it a list of the hard names from his syllabus. Duryodhana. Mrichchhakatika. Cilappatikaram. Otherwise it hears "Dhuryo Donna" and the whole lesson goes sideways.

The course books are split into units. A small script decides what today's lesson is. It starts with the Mahabharata, because that has come up in every exam paper I could find. It moves forward one section a day. If my box is switched off on some day, he doesn't miss a lesson. It just picks up where it left off. The whole plan is 235 lessons long. We'll see.

I also told the bot a few things it must never do. It doesn't do his assignments. It never counts his mistakes back to him. And it never makes anything up. If something isn't in his book, it says "that's not in your book" and stops there.

## The bumps

Quite a few, honestly.

**The books weren't there.** IGNOU's own download site has been broken for over a year. I had to dig the books out of old copies saved on the Internet Archive. One course has no material anywhere. The bot knows that and says so.

**The computer kept dying.** My old computer reboots itself when it works too hard, and the installer made it work very hard. Second try, with the computer told to take it easy, it went through.

**I typed the password wrong.** Twice. It was 46 random characters long, and I typed it by hand. Then I copy-pasted it like a sensible person and it worked straight away.

**The bot believed me when I lied.** While testing, I messaged it from my own phone saying I was AB. It replied, "Hi AB, I'm here whenever you're ready." Very sweet. Also completely wrong. I fixed the rules.

**Telegram kept giving me the same account.** The plan was one account for him and one for me. Three tries later, all three were mine. In the end I gave up. The Telegram account is his, and I get my weekly update by email.

**The bot almost wrote to itself.** The weekly email goes to the same address the bot sends from. For a minute I pictured it reading its own report and politely replying to itself every fifteen seconds. Luckily, Hermes already ignores mail from itself. Someone had that bad day before me.

## How it felt

The first lesson went out this afternoon. A minute and forty seconds on the Mahabharata, in a calm Indian voice. It ended with: "What is the Mahabharata about, and which two groups are fighting over the kingdom?"

I listened to it twice. I'm not sure why it got to me. Maybe because I know how many times he's sat in front of a page that wouldn't talk back. This one does.

I don't know yet if it'll work. A bot can't replace a teacher who knows him. It can't tell when he's tired, or when he needs a break more than a lesson. But it can show up every morning at 8:30 without fail. Some days, that's most of the job.

Next is watching how he actually uses it, and fixing whatever annoys him. I'm sure he'll have notes.

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
