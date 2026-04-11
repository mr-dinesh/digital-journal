---
title: "Vibecoding 014 — A P.G. Wodehouse Quote Bot for Bluesky"
date: 2026-04-11
description: "I built a bot that posts P.G. Wodehouse quotes to Bluesky twice a day — similes on Mondays, dialogue threads on Wednesdays, character spotlights on Thursdays — rotating through seven formats across the week, with zero infrastructure."
tags: ["vibecoding", "python", "bluesky", "bot", "atproto", "github-actions"]
aliases: ["/writing/vibecoding-014-wodehouse-bot/"]
---

![Wodehouse Bot on Bluesky](/images/writing/vibecoding-014-wodehouse-bot.jpg)

P.G. Wodehouse wrote 97 books. He was also, sentence for sentence, one of the funniest writers in the English language. Most people know Jeeves and Bertie Wooster. Fewer know the Blandings Castle stories, the Mulliner tales, or the sheer density of comic simile he packed into every paragraph.

I wanted a bot that would surface this — not by dumping quotes randomly, but with structure. A different format each day of the week. The similes on Monday (they are the most shareable, and they earn a second slot on Saturday). Dialogue exchanges on Wednesday, posted as a thread. Character spotlights on Thursday. A wildcard on Sunday for whatever didn't fit anywhere else.

The result posts to **[@pgwodehousebot.bsky.social](https://bsky.app/profile/pgwodehousebot.bsky.social)** twice a day, runs entirely on GitHub Actions, and costs nothing to operate.

→ **[github.com/mr-dinesh/wodehouse-bot](https://github.com/mr-dinesh/wodehouse-bot)**

---

## The Format Rotation

A bot that just posts quotes gets boring quickly. What made Wodehouse worth returning to is variety — the way a simile lands differently from a dialogue exchange, which lands differently from a narrator's aside. So the week has a structure:

| Day | Format | What it is |
|-----|--------|------------|
| Monday | Simile | The pure comparison — Wodehouse's signature move |
| Tuesday | Setup + Quote | One line of context, then the killer one-liner |
| Wednesday | Dialogue | A two-post thread — the exchange, then the comeback |
| Thursday | Character Spotlight | Who said it, with context about the speaker |
| Friday | Situation | Scene-setting followed by the payoff |
| Saturday | Simile | Another one — they earn a second slot |
| Sunday | Wildcard | Anything that didn't fit elsewhere |

Wednesday's dialogue format is the most technically interesting. Bluesky threads work through reply references — you post the first toot, take its `uri` and `cid`, and pass those as the reply anchor for the second. The exchange between two characters maps naturally to this: the opening line first, the comeback in reply.

---

## The Code

Four files:

```
bot.py         # entry point — loads quotes, picks one, posts it
scheduler.py   # maps day-of-week → format type
templates.py   # one render function per format
poster.py      # Bluesky client (atproto)
```

`bot.py` is deliberately thin. It parses arguments, loads `data/quotes.json`, picks a quote matching today's format, and calls `publish()`. The format logic lives entirely in `templates.py`; adding a new format means adding one function and one entry in the scheduler's day-map. The quotes are plain JSON, easy to extend by hand.

The Bluesky posting client uses the `atproto` SDK:

```python
def post_bluesky(text: str, reply_ref=None) -> dict:
    client = BskyClient()
    client.login(os.environ["BSKY_HANDLE"], os.environ["BSKY_APP_PASSWORD"])
    kwargs = {"text": text}
    if reply_ref:
        kwargs["reply_to"] = reply_ref
    return client.send_post(**kwargs)
```

Credentials come from environment variables only — `BSKY_HANDLE` and `BSKY_APP_PASSWORD`. No config files, no hardcoded values. The app password is scoped to posting only; revoke it without touching the account if it ever leaks.

---

## Zero-Server Scheduling

GitHub Actions fires the script twice a day:

```yaml
on:
  schedule:
    - cron: '0 7 * * *'    # 07:00 UTC morning
    - cron: '0 17 * * *'   # 17:00 UTC evening
  workflow_dispatch:         # manual trigger for testing
```

No VPS, no always-on process, no bill at the end of the month. The runner spins up, posts, and exits. The only persistent state is the quotes JSON file in the repo.

`workflow_dispatch` lets you trigger a post manually from the GitHub Actions tab — useful for testing after a credential rotation or a quotes update without waiting for the next scheduled run.

---

## Bluesky Only

The bot started with both Mastodon and Bluesky wired up. Removing Mastodon was a clean three-file change: drop the `post_mastodon()` function and its import from `poster.py`, remove `Mastodon.py` from `requirements.txt`, and drop the two Mastodon secrets from the workflow env block. The `publish()` function went from twelve lines to five.

The Mastodon account will come back when a separate instance account is set up for the bot. For now, Bluesky only.

---

## What Vibecoding This Felt Like

The build was fast — a single session. The interesting decisions were about structure, not code.

The format rotation idea came early: a bot that posts similes every day is a one-joke bot. One that posts seven different things, each matched to a day, is something you might actually follow. The `scheduler.py` file is four lines of a dictionary. It took longer to decide the mapping than to write it.

The quotes JSON schema went through one revision. The first pass had too many required fields. The cleaner version has four required (`id`, `format`, `text`, `book`) and the rest nullable — `setup`, `dialogue_response`, `character`, `year`. A null field is just not rendered. This means adding a new simile quote is a four-field entry; adding a dialogue is ten fields. The schema earns its complexity only where it needs to.

Claude Code handled the `atproto` thread reply reference without prompting — it knew the AT Protocol reply format from context. That was the kind of thing that used to require a documentation detour.

---

**[@pgwodehousebot.bsky.social](https://bsky.app/profile/pgwodehousebot.bsky.social)**  
*Part of the [100 Vibe Coding Projects](https://mrdee.in/vibecoding/) series.*
