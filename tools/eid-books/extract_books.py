#!/usr/bin/env python3
"""
Extract books mentioned in "Everything is Everything" podcast show notes.

Workflow:
  1. Fetch all episode descriptions from YouTube via yt-dlp (no API key needed)
  2. Cache them locally so you can re-run without re-fetching
  3. Extract books using Groq API (free tier, no payment required)
  4. Write results to eid_books.csv — import into Google Sheets

Usage:
    pip install -r requirements.txt
    export GROQ_API_KEY=your_key   # free at console.groq.com
    python extract_books.py
"""

import json
import csv
import time
import sys
import os
from pathlib import Path
from urllib.request import urlopen, Request as URLRequest
from urllib.parse import urlencode
from urllib.error import HTTPError

PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLIG8a9wNRHVu-Aw2VgUJacXlpsJMbF5Y_"
CACHE_FILE = "episodes_cache.json"
OUTPUT_FILE = "eid_books.csv"
MAX_DESCRIPTION_CHARS = 4000

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"   # fast, free, good at extraction

EXTRACTION_PROMPT = """\
Extract all book titles and their authors mentioned in these podcast show notes.

Episode: {title}

Show Notes:
{description}

Return a JSON array. Each object must have:
  "title": the book title (string)
  "author": author name (string, or null if not mentioned)

Rules:
- Only include actual books (novels, non-fiction, essays, academic books)
- Exclude: articles, blog posts, papers, podcasts, websites, films, reports, speeches
- If no books are found, return []
- Return only valid JSON — no explanation, no markdown fences

Example: [{{"title": "Thinking, Fast and Slow", "author": "Daniel Kahneman"}}]\
"""


# ---------------------------------------------------------------------------
# Step 1: Fetch episodes via yt-dlp (no API key required)
# ---------------------------------------------------------------------------

def fetch_episodes_from_youtube() -> list[dict]:
    try:
        import yt_dlp
    except ImportError:
        print("Error: yt-dlp not installed. Run: pip install yt-dlp")
        sys.exit(1)

    print("Fetching episode data from YouTube (no API key needed)...")
    print("Expect 3-5 minutes for 128 episodes.\n")

    episodes = []
    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "ignoreerrors": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(PLAYLIST_URL, download=False)
        entries = info.get("entries", []) if info else []

        for i, entry in enumerate(entries, 1):
            if not entry:
                continue
            vid_id = entry.get("id", "")
            title = entry.get("title", "")
            print(f"  [{i}/{len(entries)}] {title[:70]}")
            episodes.append({
                "id": vid_id,
                "title": title,
                "url": entry.get("webpage_url") or f"https://youtube.com/watch?v={vid_id}",
                "description": entry.get("description", ""),
            })

    return episodes


def load_or_fetch_episodes() -> list[dict]:
    cache = Path(CACHE_FILE)
    if cache.exists():
        print(f"Loading episodes from cache ({CACHE_FILE})...")
        with open(cache, encoding="utf-8") as f:
            episodes = json.load(f)
        print(f"Loaded {len(episodes)} episodes.\n")
        return episodes

    episodes = fetch_episodes_from_youtube()

    with open(cache, "w", encoding="utf-8") as f:
        json.dump(episodes, f, indent=2, ensure_ascii=False)
    print(f"\nCached {len(episodes)} episodes to {CACHE_FILE}\n")
    return episodes


# ---------------------------------------------------------------------------
# Step 2: Extract books via Groq API (free tier)
# ---------------------------------------------------------------------------

def groq_extract(api_key: str, title: str, description: str) -> list[dict]:
    """Call Groq API to extract books from one episode description."""
    payload = json.dumps({
        "model": GROQ_MODEL,
        "messages": [
            {"role": "user", "content": EXTRACTION_PROMPT.format(
                title=title,
                description=description[:MAX_DESCRIPTION_CHARS],
            )}
        ],
        "temperature": 0,
        "max_tokens": 512,
    }).encode()

    req = URLRequest(
        GROQ_API_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
    except HTTPError as e:
        body = e.read().decode()
        if e.code == 429:
            # Rate limited — wait and retry once
            retry_after = int(e.headers.get("retry-after", "10"))
            print(f"    Rate limited, waiting {retry_after}s...")
            time.sleep(retry_after)
            with urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
        else:
            print(f"    Groq error {e.code}: {body[:200]}")
            return []

    text = data["choices"][0]["message"]["content"].strip()

    # Strip markdown fences if model added them
    if text.startswith("```"):
        lines = text.splitlines()
        inner = lines[1:-1] if lines[-1].strip() == "```" else lines[1:]
        text = "\n".join(inner).strip()

    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return parsed
    except json.JSONDecodeError:
        pass
    return []


def extract_all_books(api_key: str, episodes: list[dict]) -> list[dict]:
    rows = []
    total = len(episodes)

    for i, ep in enumerate(episodes, 1):
        description = (ep.get("description") or "").strip()
        if not description:
            print(f"  [{i}/{total}] SKIP (no description) — {ep['title'][:50]}")
            continue

        print(f"  [{i}/{total}] {ep['title'][:60]}")
        books = groq_extract(api_key, ep["title"], description)

        if books:
            print(f"          → {len(books)} book(s): {', '.join(b.get('title','?') for b in books[:3])}")
        for book in books:
            title = (book.get("title") or "").strip()
            if not title:
                continue
            rows.append({
                "Episode Title": ep["title"],
                "Episode URL": ep["url"],
                "Book Title": title,
                "Author": (book.get("author") or "").strip(),
            })

        # Groq free tier: ~30 req/min — small delay keeps us well within limits
        time.sleep(2)

    return rows


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        print("Error: GROQ_API_KEY not set.")
        print("Get a free key (no payment) at: https://console.groq.com")
        print("Then: export GROQ_API_KEY=gsk_...")
        sys.exit(1)

    # 1. Episodes
    episodes = load_or_fetch_episodes()
    print(f"Processing {len(episodes)} episodes...\n")

    # 2. Extract
    rows = extract_all_books(api_key, episodes)

    rows.sort(key=lambda r: r["Episode Title"])

    # 3. Write CSV
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["Episode Title", "Episode URL", "Book Title", "Author"]
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nDone! Found {len(rows)} book mentions across {len(episodes)} episodes.")
    print(f"Saved to: {OUTPUT_FILE}")
    print("\nTo import into Google Sheets:")
    print("  File → Import → Upload → select eid_books.csv → Replace spreadsheet")


if __name__ == "__main__":
    main()
