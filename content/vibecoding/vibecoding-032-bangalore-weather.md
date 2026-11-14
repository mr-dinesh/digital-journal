---
title: "Vibecoding 032 — Bangalore's weather, your way"
date: 2026-11-10
description: "A page that shows Bangalore's daily highs, lows and rain against every year since 1981. You pick the window, the day, the charts, and the years to compare."
tags: ["vibecoding", "weather", "bangalore", "dataviz", "cloudflare-pages", "cors"]
weight: -32
images: ["og/weather.png"]
---

Bangalore weather has been a good shorthand for things that were much desired in the past and are enshittified messes now.

What if one looked back at the numbers from the past and compared them with now, instead of going on vague notions of how things actually were? Numbers probably don't lie. But let's not delude ourselves by cherry-picking the best and the worst. What other interesting insights can I glean from them?

Open sesame: [mrdee.in/weather](https://mrdee.in/weather/)

![The weather page in its Almanac look: a temperature chart for the last 45 days with 2016 and 2005 overlaid, and a day card for 9 November](/images/writing/vibecoding-032-bangalore-weather.jpg)

## Where the numbers come from

Karthik S runs [weather.karthiks.co](https://weather.karthiks.co/). Every morning it collects Bangalore's weather going back to 1981 and draws one good chart of the year so far. It's a lovely chart. But it's one chart, and I kept wanting to ask it other things. How has this monsoon gone? Was last Tuesday odd? Is this October like 2005? The chart, reasonably, had no opinion.

Karthik also shares the raw numbers, free to use: one line per day, with the high, the low and the rain. That turned out to be all I needed to ask my own questions.

## What you can change

**The window.** The last week, month or three months. The year so far. Either monsoon. Or any stretch you like, up to three years.

**A single day.** Pick a date and see how it stacks up against the same date in every other year. 9 November this year hit 27.9°, the 11th warmest 9 November out of 46. A row of dots shows all the years at once, with this one picked out.

**The charts.** Temperature, rain, rain so far, how far from normal, and a few counts and streaks. Hide the ones you don't care about and shuffle the rest.

**Years to compare.** Lay up to three past years over this one.

Whatever you pick is saved in the link, so you can send someone exactly the view you're looking at.

## What the charts mean

"Normal" is the typical high or low for that date, taken across all 46 years. "Record" is the hottest or coldest that date has ever been. When a day beats the record, its bar turns red.

The last 45 days up to 9 November say it plainly. Days ran warmer than normal 38 times out of 45, and six of them set records. So the grumbling isn't all nostalgia.

## Two looks

I sketched two designs. One is a printed almanac: cream paper, old-fashioned type, brown ink. The other is a weather-station screen: dark, glowing amber. I asked which one to build and was told "both". That's a fair answer, and it's also how I ended up building two websites. There's a switch in the corner, and it starts on whichever matches your phone's light or dark setting.

The comparison lines needed three colours that people with colour blindness can tell apart. My first pick, pink and teal, looked great to me. To someone with the most common kind of colour blindness they were the same colour. I'm glad I checked with a tool instead of trusting my eyes. Blue, magenta and olive work for everyone.

## The bumps

The main snag was that Karthik's site doesn't let other websites read its files directly. Anyone can download them, but a web page can't fetch them on its own. So my site fetches the file itself and passes it along. It also keeps a copy for a few hours, so his server isn't hammered, and still has something to show if his server is down.

The rest were small and a bit silly. My page called one day both "rainy" and "dry", because of a twentieth of a millimetre of drizzle. Leap days were being compared with the wrong days. Both are fixed, and leap-day babies everywhere can rest easy.

## What I took away

Karthik did the hard part: collecting and cleaning 45 years of weather. I mostly asked questions and built a few charts to answer them. As side projects go, that's a good deal.

*Data: Oikolab, via [Karthik S](https://github.com/skthewimp/bangalore-weather) (MIT) · Live: [mrdee.in/weather](https://mrdee.in/weather/)*

*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
