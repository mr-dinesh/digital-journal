---
title: "Counting India on Ransomware Leak Sites"
date: 2026-08-25
description: "Seventy-three Indian victims in twelve weeks of leak-site claims, none of them verified — and what the counting exercise taught me about the vendor layer."
tags: ["security", "ransomware", "threat-intel", "duckdb", "python", "notes"]
---

Twelve weeks of ransomware leak-site claims name 73 Indian organisations, and not one of those claims has been verified by anyone, including me.

That distinction matters. The number is interesting enough to investigate, but it isn't a breach count. A leak-site post is a criminal group's claim that it got access, usually published as part of an extortion attempt. I can count those claims. I can't turn them into confirmed incidents just because they appear in a feed.

I built a small pipeline for this: it pulls victim claims from two aggregators, ransomware.live and RansomLook, normalises them into DuckDB, and tries to work out which ones are Indian. Metadata only — no archives, no onion sites, no magnet links. The repository stays private, and no victim is named here.

## The counting problem comes before the findings

I want to describe the method first, because the interesting failures are in the method. A category chart is not very useful if you don't know how the rows got there.

The 90-day pull returned 5,238 records. The period covered by the data runs from 2026-05-30 to 2026-08-23. India attribution uses three signals:

1. A `.in` domain on the victim's listed website.
2. A country tag from the source feed.
3. A text signal — "India", "Bharat", "Pvt Ltd", or one of about forty Indian city names in the victim's name.

Each one breaks in a different direction.

The country tag is the strongest signal, but it is also the easiest to over-trust. It usually records where the parent is listed, not necessarily where the breached entity operates. So a company with an Indian name, an Indian address and an Indian workforce can carry a Sri Lankan or Irish tag because that is where the holding company sits. Trusting the tag drops these; ignoring it lets genuinely foreign companies in.

The text signal fails the other way. "India" in a company name does not make a company Indian. One of the rows I threw out was a US country club whose address line contained "Indian Wells, California." Meanwhile, the subsidiary problem is invisible in both directions: when a gang names a group rather than the unit it actually breached, or names a unit whose parent is elsewhere, there is nothing in the record to tell you which happened.

The automation can't resolve those cases, so it flags them for review. I adjudicated 66 records by hand, of which 21 were ultimately marked as not Indian. Those verdicts live in a CSV that persists across runs and overrides the automation, because they're the one artifact here I can't regenerate.

Deduplication is the other place where judgment sets the number. The same victim turns up in both feeds under different names, and collapsing those to a single key is guesswork. One company appeared twice because one feed listed its trading name and the other listed its homepage URL; stripping the scheme and the legal suffix still left two different keys. I merged that pair by hand. Without the merge the answer is 74, with it 73. One judgment call, one entity. That's a reasonable measure of how precise the headline number really is.

After all of that: 73 entities, 113 records, 85 days, 29 distinct gangs. Thirty-nine entities appear in both feeds and 34 in only one. One entity was claimed by two different gangs.

## What kind of businesses are these

The feeds ship a sector label, and I couldn't use it. Every one of those labels is inferred rather than reported, and on the cases that mattered most it was wrong in a consistent way. So I hand-classified all 73 against a taxonomy built around one question: does this organisation sell capacity to other businesses, or does it sell to end customers?

| Category | Entities | Share |
|---|---|---|
| Manufacturing / industrial | 26 | 36% |
| Other | 14 | 19% |
| IT services / BPO | 13 | 18% |
| Healthcare / life sciences | 10 | 14% |
| Financial services | 7 | 10% |
| Product software | 3 | 4% |

Manufacturing leads. The IT services and BPO layer — the outsourced engineering, staffing, content and business-process vendors that sit underneath a great many other companies — is third at 18%.

I want to be careful about what that 18% is evidence of. It's tempting to read it as the vendor layer being disproportionately targeted, but this dataset can't support that. Disproportionate compared to what? To the vendor layer's share of Indian firms, or of Indian firms large enough to be worth extorting? I don't have that denominator, and without it a share of a victim list is just a share of a victim list.

There are two things I can defend, because both are internal to the data.

The first is that the vendor bucket is the best-evidenced category in the set. Attribution quality isn't uniform across these rows. Of 73 entities, 63 carry a hard signal — a `.in` domain or a country tag — while 8 rest only on the weak name-based signal. Those weak rows aren't spread evenly. Manufacturing carries four of them, every other category carries one, and the IT services and BPO bucket carries none. All 13 are backed by a hard signal. Of every claim in this dataset, the vendor-layer ones are the least likely to be an artifact of loose matching.

That was the check most likely to sink the whole idea. If the vendor bucket had been built out of "Pvt Ltd" name matches, the finding would have been my own regex reflected back at me. It wasn't. It also isn't one gang's spree: the 13 are spread across 9 gangs, at most 2 each. The most active gang in the dataset, thegentlemen, accounts for 18 entities — 11 manufacturing, 5 other, 2 vendor-layer.

The second is that the feeds mislabel this layer, and they do it in one direction. Four entities had an inferred sector that contradicted my reading. An engineering-services provider, a company whose business is supplying engineering capacity to vehicle manufacturers, was filed under Manufacturing. A healthcare revenue-cycle outsourcer, whose customers are hospitals, was filed under Healthcare. In both cases the label followed the customer's industry instead of the vendor's own business.

That's the finding I trust most, and it's about the feeds rather than the attackers. If you consume this data and filter by sector, the vendor layer doesn't appear as a category. It dissolves into the industries it serves. A vendor-risk function watching for attacks on IT service providers wouldn't see these, because the feed doesn't call them IT service providers.

## What this data can't tell you

More than it can, and the list is worth stating plainly.

It can't tell you whether any of these breaches happened. A listing is an assertion by a criminal, and some are recycled from older incidents.

It can't tell you whether anyone paid. Victims who pay before publication never appear on a leak site at all, so this dataset is a sample of extortion attempts that failed at the quiet stage. The population it's drawn from is invisible.

It can't tell you dwell time, initial access vector, or what data was actually taken. Some listings claim a size, and the claim is unverifiable.

It can't tell you about victims who were never listed — those who paid, or who were hit by groups running no leak site at all.

It can't tell you severity. Being listed says nothing about whether the organisation recovered in a day or is still down.

What it supports is narrower: over these twelve weeks, on these two feeds, this is the shape of what was claimed.

## The questions that follow

The mislabelling is the part with practical consequences, and it lands on the vendor-risk function rather than the SOC.

A capability centre in India — the engineering, finance or operations arm of a multinational — sits on top of a layer of vendors: staffing firms, engineering-services providers, BPO operators, managed-service providers, outsourced finance and content shops. That layer holds real data and often holds real access. This dataset says it's being claimed, and that the feeds most people watch describe it as something else.

Three questions worth putting to a vendor-risk function, in this order.

**Which vendors hold our data, as opposed to touching it?** Two different lists, and the second is much longer. A staffing vendor holds employee records. A content vendor holds unreleased material. An outsourced finance vendor holds banking detail. "We have a DPA in place" answers a compliance question, not this one.

**If one of them were breached tomorrow, how would we find out?** If the answer is "the vendor would tell us," ask when that last happened and how long it took. If the honest answer is "we'd see it on a leak site," then leak-site monitoring isn't threat intelligence. It's the incident notification channel, and it should be resourced as one.

**Has the contractual notification window ever been tested?** Most contracts specify one. Few have been exercised. An untested clause is a document, not a control.

None of this depends on believing a single attacker's claim. The claims are unverified and will stay that way. But the shape of what's being claimed is worth knowing, particularly the part where a whole category of supplier gets filed under somebody else's industry.

---

*Figures from a 90-day pull covering 2026-05-30 to 2026-08-23, taken on 2026-08-25. Victim counts on leak-site aggregators shift as feeds backfill and as normalisation choices change. Treat the numbers as a snapshot of one method rather than a measurement.*
