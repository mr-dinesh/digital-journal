#!/usr/bin/env python3
"""
Step 1: Prepare batch prompt files to paste into Claude.ai (free).

Usage:
    python prepare_batches.py

This creates files like batch_01.txt, batch_02.txt, etc. in C:\Users\Sushmita\eie_batches\
Paste each file into Claude.ai and save the response as response_01.txt, response_02.txt, etc.
Then run: python combine_results.py
"""

import json
import os

INPUT_FILE = r"C:\Users\Sushmita\eie_with_desc.json"
OUTPUT_DIR = r"C:\Users\Sushmita\eie_batches"
BATCH_SIZE = 18
MAX_DESC_CHARS = 3000

PROMPT_HEADER = """\
Extract all books mentioned in these podcast episode show notes.

For each book found, return one line in this exact format:
BOOK|Episode Title Here|Book Title Here|Author Name Here

Rules:
- Only include actual books (novels, non-fiction, essays, memoirs, academic books)
- Exclude: articles, blog posts, papers, podcasts, websites, films, reports
- If no books in an episode, skip that episode entirely
- Author is "Unknown" if not mentioned
- No extra explanation, just the BOOK| lines

--- EPISODES ---

"""

def load_episodes(path):
    episodes = []
    with open(path, encoding="utf-8") as f:
        raw = f.read().strip()
    if raw.startswith("["):
        outer = json.loads(raw)
        entries = outer.get("entries", outer) if isinstance(outer, dict) else outer
        for ep in entries:
            if isinstance(ep, dict):
                episodes.append(ep)
    else:
        for line in raw.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                ep = json.loads(line)
                if isinstance(ep, dict):
                    episodes.append(ep)
            except json.JSONDecodeError:
                continue
    return episodes

def main():
    episodes = load_episodes(INPUT_FILE)
    print(f"Loaded {len(episodes)} episodes")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    batches = [episodes[i:i+BATCH_SIZE] for i in range(0, len(episodes), BATCH_SIZE)]
    print(f"Creating {len(batches)} batch files in {OUTPUT_DIR}")

    for b_idx, batch in enumerate(batches, 1):
        lines = [PROMPT_HEADER]
        for ep in batch:
            title = ep.get("title", "Unknown Episode")
            desc = (ep.get("description") or "").strip()[:MAX_DESC_CHARS]
            lines.append(f"=== {title} ===\n{desc}\n")

        out_path = os.path.join(OUTPUT_DIR, f"batch_{b_idx:02d}.txt")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
        print(f"  Written: batch_{b_idx:02d}.txt  ({len(batch)} episodes)")

    print(f"""
Done! {len(batches)} batch files created.

Next steps:
1. Open each batch_XX.txt file
2. Select all (Ctrl+A), copy, paste into Claude.ai
3. Copy Claude's response, paste into a new file named response_XX.txt in the same folder
4. Once all responses are saved, run: python combine_results.py

Folder: {OUTPUT_DIR}
""")

if __name__ == "__main__":
    main()
