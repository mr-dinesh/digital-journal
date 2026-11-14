---
title: "Vibecoding 008 — I Asked AI to Help Me Build a Home Radio Server"
date: 2026-03-22
tags: ["vibecoding", "self-hosted", "media", "docker"]
aliases: ["/writing/vibecoding-008-building-a-home-media-streaming-and-player/", "/writing/vibecoding-008-home-radio-server/"]
description: "I wanted to play my old MP3s on my phone like a radio station. It took a few wrong turns, about fifteen tries, and it works."
---
![image](/images/writing/vibecoding-008-home-radio.png)


### I asked an AI to help me build a home radio station. Here's what happened.

I have a few hundred MP3s in a folder on my laptop: old Kannada film songs, some Tamil classics, a few English albums I copied off CDs years ago. I wanted to play them on my phone like a radio station, and maybe share it with family. Simple enough.

I knew the programs that do this exist. I had no intention of reading their manuals on a Sunday afternoon.

So I opened Claude and said: build me a radio station that plays from my Mega.nz cloud storage.

---

### The first pushback

The AI didn't just start building. It pointed out that Mega encrypts everything, so there's no simple link a radio program can play from. You'd have to download and unlock each song first. Fair point. I hadn't thought of that.

We dropped Mega and moved the songs somewhere more suitable. Then I said I wanted to run it on my own laptop at home so it would cost nothing. The AI walked me through the catches: my home internet address changes, my provider might block things, and my upload speed limits how many people can listen. Most guides skip that part.

---

### The build

It ended up as four small programs working together:

- one that broadcasts the stream
- one that picks songs, evens out the volume and feeds the broadcaster
- a small web page to manage playlists
- a music library app, added later, for picking songs yourself

The AI wrote all the settings files and the web page.

---

### What broke

A lot, one thing after another. The AI had learned from an older version of one of the programs, and some commands had been renamed since. Then the song locations in the playlist didn't match where the program was actually looking for them.

Each problem came with a clear error message, and each fix was small. It still took about fifteen rounds before music came out. Fifteen. For a radio. There's a reason people just buy one.

What impressed me was that the AI kept track of the whole project. When I said "no sound again" for the ninth time, it didn't start over. It asked for the error log and carried on.

---

### Picking your own songs

A radio station plays the same thing to everyone. You can't skip to the song you want. When I asked for that, the AI explained the difference and suggested adding a music library app, Navidrome, alongside the radio. Same folder of songs, different job. It was running in two minutes.

---

### Listening from anywhere

This was the nicest part. Tailscale gives your devices a private network of their own. One install, one login, and my phone could reach the laptop at home from anywhere, even on mobile data, without opening my home network to strangers.

I wish I'd done this years ago.

---

### What vibecoding means to me

People use the word to mean different things. Here it meant this: I described what I wanted in plain words, read what came back, corrected it when it was wrong, and kept going. I didn't write the settings myself. I also didn't paste things in without reading them.

The AI was wrong about the program's version. It was right about Mega's encryption. It found the mixed-up song locations faster than I would have.

It's like a colleague who knows a lot and gets things wrong sometimes. Like most colleagues. Like me, too.

---

### The code, if you want it

Everything is on GitHub, including scripts that make playlists and fetch album art automatically. It runs on any Linux machine. It costs nothing a month.

[Github Repo Link](https://github.com/mr-dinesh/home-media-player)
