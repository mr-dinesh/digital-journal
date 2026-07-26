---
title: "Vibecoding 010 — The APK Analyzer That Runs on Your Machine and Tells No One"
date: 2026-03-31
tags: ["vibecoding", "security", "android", "flask", "python"]
aliases: ["/writing/vibecoding-day010-offline-apk-security-analyzer/", "/writing/vibecoding-010-apk-security-analyzer/"]
description: "A local Flask tool for APK security analysis — parses permissions, scans for secrets, fingerprints SDKs, and checks crypto usage. Nothing leaves your machine."
---
![image](/images/writing/vibecoding-010-apk-analyzer.png)

I've been doing APK security analysis manually for years — pulling the file, running jadx, grepping through decompiled source, eyeballing the manifest. It works, but it's slow and the output lives in a terminal window that disappears the moment you close it.

This week's project: wrap that entire methodology into a local web tool. Upload an APK, get a structured risk report in your browser. No internet required, nothing stored, APK deleted the moment analysis completes.

---

## Why offline?

The obvious question when you hear "web tool for APK analysis" is: why not just use MobSF or one of the online scanners?

Two reasons. First, the APKs worth analyzing carefully are often the ones you'd least want to upload to a third-party server — financial apps, enterprise apps, apps handling sensitive user data. Running analysis locally eliminates that question entirely.

Second, building it yourself means you control the logic. Every SDK detection rule, every secret pattern, every risk classification — you wrote it, you understand it, you can explain it. That matters when you're presenting findings to someone.

## The architecture

The tool is deliberately simple: a browser upload goes into Flask, which hands the APK to an Android analysis library and the standard ZIP reader, and the results are rendered as an HTML report. No database, no queue, no JavaScript framework.

Five analysis modules run sequentially on the uploaded APK:

1. **Manifest parser** — package metadata, permissions, exported components
2. **Secret scanner** — regex patterns over text resources
3. **SDK fingerprinter** — class namespace matching
4. **Crypto analyzer** — control and weakness detection
5. **Network security config parser** — pinning, cleartext, CA trust

## The interesting technical problem: DEX class extraction

The first version of the SDK fingerprinter searched the APK's ZIP contents for file paths like `smali/com/dynatrace/...`. That works if you have a smali-format APK, but standard Play Store APKs don't contain smali files — the code is compiled into a binary format called DEX.

The fix was directing androguard to parse that bytecode directly and pull out class names, each in the format `com/dynatrace/android/agent`, which can then be matched against a known SDK map. The extraction runs once and feeds both the SDK fingerprinter and the crypto analyzer, so the binary only gets parsed once.

## SDK detection: curating the map

The SDK map does most of the work. Each of the 30+ entries carries a name, category, risk level, and a specific security note. A hit on Dynatrace is rated HIGH, and the note says why: its default setting enables full session replay, so on a banking app account balances and transaction history may be recorded. It also tells you what to look for and verify.

Security controls get a GOOD classification. The tool distinguishes between "this SDK sends data to a third party" and "this SDK provides a security control that should be present."

## The network security config check

The most actionable finding the tool surfaces is expired certificate pinning. Android lets developers set an expiry date on certificate pinning. When that date passes, Android silently falls back to trusting all system certificates. Pinning stops working without a single log message or error.

This is a finding I've seen in real-world production apps. It's a five-minute fix once identified (remove the expiration date or update it), but it's completely invisible unless you're specifically looking for it.

## Secret scanning: text resources only

The secrets scanner searches all text-format files inside the APK ZIP — XML resources, JSON configs, JS bundles, properties files. It won't find secrets compiled into bytecode (you need JADX for that), but it catches a surprising amount:

- Firebase API keys in `google-services.json`
- Staging URLs left in `strings.xml`
- Internal IP addresses in config files
- Razorpay/Stripe live keys in resource files
- Dynatrace beacon URLs that reveal your monitoring infrastructure

The tool is honest about this limitation: the report says that bytecode requires JADX for full coverage.

## The Flask routing

The upload route saves the file to a temp location, runs analysis, then deletes it in a cleanup step that runs regardless of whether analysis succeeded or failed. The 150MB upload limit handles most APKs.

## Risk scoring

The report generates a letter grade (A–F) based on finding counts: start at 100, subtract 20 for every critical finding, 10 for every high, and 3 for every medium. An app with no critical or high findings gets an A regardless. The grade is a conversation starter, not a compliance verdict. The real value is in the specific findings.

## What broke

**androguard v4 broke every tutorial on the internet.** The first version of the DEX extractor was written against androguard v3, which is what every Stack Overflow answer references. In v4, the import paths moved and the class iteration API changed entirely. The code imported without errors but returned empty results — no SDKs detected, no crypto findings, nothing. Took a while to realise the library had changed underneath.

**The SDK fingerprinter silently returned zero results.** Early versions swallowed all exceptions quietly. If DEX parsing failed for any reason, the report would show zero SDKs — no error, no warning. A clean-looking report on a real banking app was the first sign something was wrong. Fix: explicit logging on every failure path.

**Binary AXML parsing failed on unsigned APKs.** The AndroidManifest.xml inside an APK is compiled binary XML, not plain text. The parser handled it correctly on properly signed APKs, but test APKs built locally without signing caused it to fall through to a regex fallback that only caught basic package names. The fix was a clear fallback path with a note in the report when full parsing wasn't available.

**Flask couldn't find its templates.** The template engine looks for its templates folder relative to where the script is *run from*, not where it *lives*. Running from a parent directory broke template discovery silently. Fix: set the template folder path explicitly in the app constructor.

**The APK deletion didn't always work.** The analysis library holds a file handle open while it works. On Windows, trying to delete a file while a handle is open throws an error. The fix was wrapping the cleanup in a try/except so it handles both platforms gracefully.

## What's next

The natural next step is JADX integration: run the decompiler automatically and search the output for high-value patterns. That would close the gap between what static resource scanning catches and what method-level analysis reveals.

A diff mode would also be useful. Upload two versions of the same APK and see what SDKs were added or removed between releases. That's how you catch a marketing team quietly adding a tracking SDK between app updates.

---

**[github.com/mr-dinesh/Offline-APK-Analyzer](https://github.com/mr-dinesh/Offline-APK-Analyzer)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
