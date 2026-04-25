---
title: "Vibecoding 023 — AFL Masterclass: A Technical Deep Dive"
date: 2026-04-25
description: "A gamified self-paced learning module covering AFL/AFL++ from first principles — edge coverage, the bitmap, mutation stages, adversarial critique, and a 30-day practice roadmap."
tags: ["vibecoding", "security", "fuzzing", "afl", "javascript", "cloudflare"]
aliases: ["/writing/vibecoding-023-afl-masterclass/"]
weight: -23
---

This one started as personal study notes and became something more structured than expected.

I've been running fuzzing experiments against curl — building ASAN-instrumented binaries, writing harnesses, reproducing CVE-2023-38545, getting AFL++ instrumentation live. The curl work generated a lot of understanding fast. The natural output was to write it up properly.

**Live:** [afl-masterclass.pages.dev](https://afl-masterclass.pages.dev)

## What the document covers

Ten sections, built in a deliberate sequence:

The first section forces a specific mental model question: why did AFL represent a step-change rather than an incremental improvement? The answer is economic, not algorithmic. Before AFL, the two available approaches — blind random fuzzing and grammar-based generation — required you to choose between scale and domain knowledge. AFL removed the tradeoff. Coverage feedback lets the fuzzer learn the structure of the target without anyone specifying it.

From there, the document works through the instrumentation (edge coverage, the XOR bitmap, hit count buckets), the mutation pipeline (deterministic stages before havoc, splice as genetic crossover), the systems engineering decisions (why 64KB — it's an L2 cache sizing decision, not arbitrary), and the adversarial critique — the cases where AFL structurally cannot make progress without external help.

Section 4 (adversarial critique) is probably the most valuable for practitioners. Magic bytes, checksums, deep state machines, structured grammars — these aren't edge cases, they're the normal operating environment for anything interesting. Understanding where AFL breaks is just as important as understanding where it works.

Section 9 is myth cards — seven common misconceptions with explicit rebuttals. The one I see repeated most: "AFL found no crashes in 24 hours, so the code is probably clean." That reasoning has five independent failure modes built into it. The section makes each one concrete.

## The curl fuzzer context

The document was written alongside actual fuzzing work, not before it. That matters for how the content reads.

The curl fuzzer setup involved:
- Building curl 8.3.0 (the CVE-2023-38545-vulnerable version) with ASAN+UBSan
- Building an AFL++-instrumented version against the same source
- Writing three harnesses: `fuzz_url`, `fuzz_cookies`, `fuzz_socks5`
- Reproducing CVE-2023-38545 behaviourally — not a memory crash at 260 bytes (the `socksreq` buffer is 16KB), but the protocol confusion: the state machine re-enters `Curl_SOCKS5()` and resets `socks5_resolve_local` to FALSE, causing the hostname to be forwarded to the proxy instead of rejected

The fuzz_url harness was hitting ~105,000 exec/sec with 60 coverage edges on first seed, growing to 662 edges and 513 corpus entries in the first 15 minutes. The fuzz_socks5 harness peaked at 27 exec/sec — network syscalls on every input, which is the obvious next engineering problem (LD_PRELOAD network stubbing).

## Gamification

The document is a single HTML file with no build step. But it has a progress system that felt worth building properly:

- Sticky progress bar with live XP counter
- "Mark Complete" on every section (50 XP)
- "Done" on each of the 7 curriculum days (20 XP)
- "I understand this" on each of the 7 myth cards (10 XP)
- Three themes: Dark / Light / Sepia
- Everything persists to localStorage

The XP system is arbitrary but the tracking is real. The goal was to make the document feel like a module you move through rather than a wall of text you scroll past once and forget.

## One thing the document doesn't resolve

The harness is where most real fuzzing investment goes, and writing a good harness is not a fuzzer skill. It's a deep reading skill about the target — understanding which entry points are callable without the full application stack, what state needs to be initialised, what needs to be stubbed, how to avoid the OOM spiral from leaked allocations. That takes repetition, not documentation. The 7-day curriculum is designed to force that repetition early.

## Architecture

Single HTML file. Vanilla JavaScript for theme switching and progress state. No framework, no build pipeline. Deployed to Cloudflare Pages with `wrangler pages deploy`.

The references section links to the actual primary sources: Zalewski's `technical_details.txt`, the AFLFast Markov chain paper (Böhme et al., CCS 2016), the REDQUEEN paper (Aschermann et al., NDSS 2019) that underpins AFL++'s CMPLOG feature, and the AFL++ design paper (Fioraldi et al., WOOT 2020). If you're going to use this document as a starting point, those are the next things to read.
