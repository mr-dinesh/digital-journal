#!/usr/bin/env python3
"""
Step 2: Combine Claude.ai responses into a single CSV.

Usage:
    python combine_results.py

Reads all response_XX.txt files from C:\Users\Sushmita\eie_batches\
and writes C:\Users\Sushmita\eid_books.csv
"""

import csv
import os
import glob

RESPONSE_DIR = r"C:\Users\Sushmita\eie_batches"
OUTPUT_CSV = r"C:\Users\Sushmita\eid_books.csv"

def parse_response(text):
    """Parse BOOK|episode|title|author lines from a Claude response."""
    books = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("BOOK|"):
            continue
        parts = line.split("|")
        if len(parts) < 4:
            continue
        _, episode, title, author = parts[0], parts[1].strip(), parts[2].strip(), parts[3].strip()
        if title:
            books.append({
                "Episode Title": episode,
                "Book Title": title,
                "Author": author if author and author.lower() != "unknown" else "",
            })
    return books

def main():
    pattern = os.path.join(RESPONSE_DIR, "response_*.txt")
    files = sorted(glob.glob(pattern))

    if not files:
        print(f"No response_XX.txt files found in {RESPONSE_DIR}")
        print("Save Claude's responses as response_01.txt, response_02.txt, etc.")
        return

    all_books = []
    for path in files:
        fname = os.path.basename(path)
        with open(path, encoding="utf-8") as f:
            text = f.read()
        books = parse_response(text)
        print(f"  {fname}: {len(books)} books found")
        all_books.extend(books)

    all_books.sort(key=lambda r: r["Episode Title"])

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["Episode Title", "Book Title", "Author"])
        writer.writeheader()
        writer.writerows(all_books)

    print(f"\nDone! {len(all_books)} books written to {OUTPUT_CSV}")
    print("Import to Google Sheets: File \u2192 Import \u2192 Upload \u2192 select eid_books.csv")

if __name__ == "__main__":
    main()
