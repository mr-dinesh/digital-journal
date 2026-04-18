---
title: "First Steps: Static Analysis on the curl Repo"
date: 2026-03-01
description: "Running a static code analyser on the curl source — what came up, what was a false positive, and what to watch out for."
drafts: false
hidden: false
aliases: ["/curl-notes/first-steps-03-01-2026/"]
---

Took a first concrete step today — rather than just reading, I ran a static code analysis on the curl repository.

ChatGPT suggested SonarQube, so I went with that. Cloned the curl repo into my account, configured an authentication token, and let the analysis run.

### What came up

The findings were mostly manageable for a first pass:

- A flag about Python version — easily fixed by specifying `python3` explicitly.
- Several "passwords in plain text" warnings — these turned out to be false positives. The flagged strings were examples in documentation and test fixtures showing syntax like `uname` and `passwd`, not actual credentials.

Worth noting: the authentication token I set up is sitting in a config file. That needs to be obfuscated before anything gets pushed anywhere public.

### What's next

- Try cloning the repo on a different machine or OS — partly to reduce the friction of the current setup (VNC into one system, then into another VM adds up).
- Take another pass at the static analysis findings with fresh eyes.
