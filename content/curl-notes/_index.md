---
title: "Curl Notes"
description: "Reading notes from studying the curl source code — one of the most widely deployed pieces of software ever written."
---

curl has been running on virtually every computer on the planet since 1998. Almost nobody who uses it daily has read a line of its source code.

These are my notes from trying to change that — working through the internals, one module at a time. DNS, TLS, cookies, redirects, the HTTP engine. Written as I go, so expect rough edges and open questions alongside the observations.
