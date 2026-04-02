#!/usr/bin/env python3
"""
Extract books from EiE episode descriptions by finding Amazon links.
Lines containing Amazon links = books.

Usage: python extract_amazon.py
Reads:  C:\Users\Sushmita\eie_with_desc.json
Writes: C:\Users\Sushmita\eid_books.csv
"""

import json
import csv
import re
import os

INPUT_FILE  = r"C:\Users\Sushmita\eie_with_desc.json"
OUTPUT_FILE = r"C:\Users\Sushmita\eid_books.csv"

# Matches any Amazon URL
AMAZON_RE = re.compile(r'https?://(?:www\.)?(?:amazon\.[a-z.]+|amzn\.to|amzn\.com)/\S+')

def parse_book_line(line):
    """
    Given a line like:
      'The Selfish Gene by Richard Dawkins - https://www.amazon.in/...'
      'In Service of the Republic (Vijay Kelkar & Ajay Shah): https://amzn.to/...'
      'The Blank Slate: https://www.amazon.com/...'
    Return (title, author) or (title, '') if no author found.
    """
    # Remove the Amazon URL(s) and trailing punctuation/whitespace
    text = AMAZON_RE.sub('', line).strip().rstrip('-:,').strip()

    # Remove markdown links [text](url) remnants
    text = re.sub(r'\[([^\]]+)\]\s*$', r'\1', text).strip()

    # Try to split on " by " (case-insensitive)
    m = re.split(r'\s+[Bb]y\s+', text, maxsplit=1)
    if len(m) == 2:
        return m[0].strip().rstrip('-:,').strip(), m[1].strip().rstrip('-:,').strip()

    # Try to split on " - " (last occurrence likely separates author)
    parts = text.rsplit(' - ', 1)
    if len(parts) == 2 and len(parts[1]) < 60:
        return parts[0].strip(), parts[1].strip()

    # Try parentheses: "Title (Author)"
    m = re.match(r'^(.+?)\s*\(([^)]+)\)\s*$', text)
    if m and len(m.group(2)) < 60:
        return m.group(1).strip(), m.group(2).strip()

    # Try colon split: "Title: Author"
    parts = text.split(':', 1)
    if len(parts) == 2 and len(parts[1].strip()) < 60 and len(parts[1].strip()) > 0:
        return parts[0].strip(), parts[1].strip()

    return text, ''

def extract_books(description, episode_title):
    books = []
    if not description:
        return books

    for line in description.splitlines():
        line = line.strip()
        if not line:
            continue
        if AMAZON_RE.search(line):
            title, author = parse_book_line(line)
            # Skip obvious non-books (very short, just a URL, etc.)
            if title and len(title) > 3 and not title.startswith('http'):
                books.append({
                    'Episode Title': episode_title,
                    'Book Title':    title,
                    'Author':        author,
                })
    return books

def main():
    print(f"Reading {INPUT_FILE} ...")
    with open(INPUT_FILE, encoding='utf-8') as f:
        data = json.load(f)

    # Handle both list and dict with 'episodes' key
    if isinstance(data, dict):
        episodes = data.get('episodes', data.get('entries', []))
    else:
        episodes = data

    print(f"Loaded {len(episodes)} episodes.")

    all_books = []
    for ep in episodes:
        title = ep.get('title') or ep.get('name') or 'Unknown Episode'
        desc  = ep.get('description') or ep.get('desc') or ''
        books = extract_books(desc, title)
        if books:
            print(f"  [{len(books)} books] {title[:70]}")
        all_books.extend(books)

    print(f"\nTotal books found: {len(all_books)}")

    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=['Episode Title', 'Book Title', 'Author'])
        writer.writeheader()
        writer.writerows(all_books)

    print(f"Saved to {OUTPUT_FILE}")
    print("Import to Google Sheets: File -> Import -> Upload -> select eid_books.csv")

    # Show first few rows as a sanity check
    print("\nFirst 5 rows:")
    for b in all_books[:5]:
        print(f"  {b['Book Title']} | {b['Author']} | {b['Episode Title'][:50]}")

if __name__ == '__main__':
    main()
