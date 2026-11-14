---
title: "Hardening a Static Blog: Headers, CSP, and One Warning I Left Alone"
date: 2026-04-16
description: "How I took mrdee.in from a poor security score to a clean one in about 20 minutes, and the one warning I decided to ignore."
tags: ["security", "hugo", "cloudflare", "csp", "notes"]
---

I ran my own blog through [securityheaders.com](https://securityheaders.com), a free site that grades how well a website protects its visitors. The grade was not good. For someone who works in security, that's a bit like a dentist with bad teeth.

The fix took about 20 minutes. Here's what I did and why.

---

## The fix: one small file

Websites can send browsers a few extra instructions with every page: "only ever talk to me securely", "don't let other sites put me in a frame", and so on. My host, Cloudflare Pages, reads these from a single file called `_headers`. Drop it in, publish, done.

For anyone who wants to copy it, here's the file:

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' cloudflareinsights.com; font-src 'self'; frame-src https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'
```

In plain words, each line says:

- **Always use a secure connection**, for the next two years.
- **Don't guess what a file is.** Stops a harmless text file being run as a program.
- **Don't tell other sites too much** about which page a visitor came from.
- **No camera, microphone or location.** A blog needs none of those, so it's simplest to switch them off.
- **Only run code from approved places.** This is the big one, and the next section explains why.

---

## The warning I fixed

My first draft allowed little snippets of code written straight into the page. The scanner flagged it in amber: that's how a lot of attacks sneak in.

The usual advice is a fiddly workaround. Before going there, I checked whether my blog actually needed those snippets. I read through the blog theme's templates and found it didn't. All its code comes from separate files. The only snippets in the page are labels for search engines, which browsers never run.

So I simply switched it off. The best fix is sometimes noticing you never needed the risky thing in the first place.

---

## The warning I left alone

One amber warning remained. It says, roughly, "any website can read your pages".

That sounds alarming. On a banking site, it would be. On a public blog it's exactly right. There's nothing private here. Locking it down would break RSS readers and anything else that reads the blog legitimately, and protect nothing.

Not every warning matters equally. This one is amber because it *can* be dangerous in the wrong place. Here, it isn't.

---

The final scan came back clean on everything that matters. The whole job took less time than writing this post. The dentist has fixed his teeth.

![securityheaders.com A+ scorecard for mrdee.in](/images/notes/security-headers-scorecard.jpg)
