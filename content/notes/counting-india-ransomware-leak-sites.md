---
title: "Counting India on Ransomware Leak Sites"
date: 2026-08-25
description: "Seventy-three Indian victims in twelve weeks of leak-site claims, none of them verified, and what the counting taught me about the vendor layer."
tags: ["security", "ransomware", "threat-intel", "duckdb", "python", "notes"]
---

Twelve weeks of ransomware leak-site claims name 73 Indian organisations. None of those claims is verified. Not by me, not by anyone.

That gap matters. The number is worth investigating. It isn't a breach count. A leak-site post is a criminal group's claim that it got access, published to pressure someone into paying. I can count the claims. I can't turn them into incidents.

I built a small pipeline for this. It pulls victim claims from two aggregators, ransomware.live and RansomLook, normalises them into DuckDB, and works out which ones are Indian. Metadata only. No archives, no onion sites, no magnet links. The repository stays private and no victim is named here.

## The counting problem comes first

The method matters more than the chart. A category breakdown is useless if you don't know how the rows got there.

The 90-day pull returned 5,238 records, covering 2026-05-30 to 2026-08-23. India attribution uses three signals:

1. A `.in` domain on the victim's listed website.
2. A country tag from the source feed.
3. A text signal: "India", "Bharat", "Pvt Ltd", or one of about forty Indian city names.

Each breaks differently.

The country tag is the strongest and the easiest to over-trust. It usually records where the parent is listed. That isn't always where the breached entity operates. A company with an Indian name, an Indian address and an Indian workforce can carry a Sri Lankan or Irish tag, because that's where the holding company sits. Trust the tag and you drop those. Ignore it and foreign companies get in.

The text signal fails the other way. "India" in a company name doesn't make a company Indian. One row I threw out was a US country club. Its address line contained "Indian Wells, California."

The subsidiary problem is invisible in both directions. A gang might name a group rather than the unit it actually breached. It might name a unit whose parent sits elsewhere. Nothing in the record tells you which.

The automation can't resolve those, so it flags them for review. I adjudicated 66 records by hand and marked 21 of them not Indian. Those verdicts live in a CSV that persists across runs and overrides the automation. They're the one thing here I can't regenerate.

Deduplication sets the number too. The same victim turns up in both feeds under different names, and collapsing those to one key is guesswork. One company appeared twice. One feed listed its trading name, the other listed its homepage URL. Stripping the scheme and the legal suffix still left two different keys. I merged the pair by hand. Without the merge the answer is 74. With it, 73. One judgment call, one entity. That's roughly how precise the headline number is.

Final counts: 73 entities, 113 records, 85 days, 29 gangs. Thirty-nine entities appear in both feeds. Thirty-four appear in only one. One was claimed by two gangs.

## What kind of businesses are these

The feeds ship a sector label. I couldn't use it. Every label is inferred rather than reported, and on the cases that mattered it was wrong the same way each time.

So I hand-classified all 73. The taxonomy turns on one question: does this organisation sell capacity to other businesses, or does it sell to end customers?

| Category | Entities | Share |
|---|---|---|
| Manufacturing / industrial | 26 | 36% |
| Other | 14 | 19% |
| IT services / BPO | 13 | 18% |
| Healthcare / life sciences | 10 | 14% |
| Financial services | 7 | 10% |
| Product software | 3 | 4% |

Manufacturing leads. IT services and BPO comes third at 18%. That bucket covers outsourced engineering, staffing, content and business-process vendors, the layer sitting underneath a great many other companies.

18% is not evidence that the vendor layer is disproportionately targeted. Disproportionate to what? To its share of Indian firms? Of Indian firms big enough to be worth extorting? I don't have that denominator. Without it, a share of a victim list is only a share of a victim list.

Two things the data does support.

First, the vendor bucket is the best evidenced in the set. Attribution quality varies row to row. Of 73 entities, 63 carry a hard signal, either a `.in` domain or a country tag. Eight rest on the weak name match alone. Those eight aren't spread evenly. Manufacturing has four. Every other category has one. IT services and BPO has none. All 13 of its rows carry a hard signal.

That check could have sunk the whole idea. If the bucket had been built out of "Pvt Ltd" name matches, the finding would have been my own regex looking back at me.

It isn't one gang's spree either. The 13 are spread across 9 gangs, at most 2 each. The busiest gang in the dataset, thegentlemen, accounts for 18 entities: 11 manufacturing, 5 other, 2 vendor-layer.

Second, the feeds mislabel this layer, and always in one direction. Four entities had an inferred sector that contradicted my reading. An engineering-services provider, whose business is supplying engineering capacity to vehicle manufacturers, was filed under Manufacturing. A healthcare revenue-cycle outsourcer, whose customers are hospitals, was filed under Healthcare. The label followed the customer's industry instead of the vendor's own business.

The consequence is practical. Filter these feeds by sector and the vendor layer doesn't appear. It dissolves into the industries it serves. A vendor-risk function watching for attacks on IT service providers wouldn't see these. The feed doesn't call them IT service providers.

## What this data can't tell you

It can't tell you whether the breaches happened. A listing is an assertion by a criminal. Some are recycled from older incidents.

It can't tell you whether anyone paid. Victims who pay before publication never get listed at all. So this is a sample of extortion attempts that failed at the quiet stage. The rest of the population is invisible.

It can't tell you dwell time, access vector, or what data was taken. Some listings claim a size. The claim is unverifiable.

It can't tell you about victims who were never listed, whether they paid or were hit by a group running no leak site.

It can't tell you severity. Being listed says nothing about whether the organisation recovered in a day or is still down.

What it supports is narrow. Over these twelve weeks, on these two feeds, this is the shape of what was claimed.

## Questions for vendor risk

The mislabelling has consequences, and they land on vendor risk rather than the SOC.

A capability centre in India sits on top of a layer of vendors: staffing firms, engineering-services providers, BPO operators, managed-service providers, outsourced finance and content shops. That layer holds real data. It often holds real access. This dataset says it's being claimed, and that the feeds describe it as something else.

Three questions, in this order.

**Which vendors hold our data, as opposed to touching it?** Two different lists, and the second is much longer. A staffing vendor holds employee records. A content vendor holds unreleased material. An outsourced finance vendor holds banking detail. "We have a DPA in place" answers a compliance question, not this one.

**If one were breached tomorrow, how would we find out?** If the answer is "the vendor would tell us", ask when that last happened and how long it took. If the honest answer is "we'd see it on a leak site", then leak-site monitoring isn't threat intelligence. It's your incident notification channel. Resource it as one.

**Has the notification window in the contract ever been tested?** Most contracts specify one. Few have been exercised. An untested clause is a document, not a control.

None of this depends on believing any single claim. The claims are unverified and will stay that way. The shape of what's being claimed is still worth knowing, especially the part where a whole category of supplier gets filed under someone else's industry.

---

*Figures from a 90-day pull covering 2026-05-30 to 2026-08-23, taken on 2026-08-25. Victim counts shift as feeds backfill and as normalisation choices change. Treat these as a snapshot of one method, not a measurement.*
