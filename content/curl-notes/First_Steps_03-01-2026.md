---
title: "First Steps"
date: 2026-03-01
drafts: false
hidden: false
---

### What I did Today

- Static code review.
- Initial impression of the curl git repo.


### How Things Went
Everything seemed so overwhelming and not knowing where to start and what next.

One thought was to use an automated static code analyzer. 
ChatGPT suggested SonarCube, and so I started down another rabbit-hole, hopefully not a disastrous decision.

I had to clone the curl public repo into my account, configure an authentication token and the analysis began.

There seemed to be some trivial findings to start with, like Python version 3.x to be specified, did that and the passwords in plain text, were false positives - these were examples of syntax usage with uname&passwd not actual creds.

The token is in the config file. I'll need to obfuscate it.
the situation in the M.E. and at home were becoming extrmely volatile and I had to switch tasks. 

### Next Actions

- Maybe I should take another stab at the code repo. 
- I'll try to clone it on another system / OS. 
- I should also find a way to reduce the friction of loggin in via VNC and then into another VM.