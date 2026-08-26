#!/usr/bin/env bash
set -euo pipefail

BLOG_DIR="/home/tester/Desktop/repos/digital-journal"
RCLONE="$HOME/.local/bin/rclone"
JQ="$HOME/.local/bin/jq"
REMOTE="gdrive:blog-backups"
BACKUP_NAME="blog-backup-$(date +%Y-%m-%d).tar.gz"
TMP_DIR=$(mktemp -d)
RETAIN_WEEKS=4

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

# Load GOOGLE_API_KEY from ~/.config/blog-backup.env if not already in environment
if [[ -z "${GOOGLE_API_KEY:-}" && -f "$HOME/.config/blog-backup.env" ]]; then
  # shellcheck source=/dev/null
  source "$HOME/.config/blog-backup.env"
fi

cd "$BLOG_DIR"

# Collect raw git log for the past week
RAW_LOG=$(git log --since="1 week ago" --pretty="format:%ad  %s%n%b" --date=short)

if [[ -z "$RAW_LOG" ]]; then
  echo "No commits this week." > "$TMP_DIR/changelog.txt"
elif [[ -z "${GOOGLE_API_KEY:-}" ]]; then
  # Fallback to plain log if no API key
  echo "=== Blog changelog — week of $(date +%Y-%m-%d) ===" > "$TMP_DIR/changelog.txt"
  echo "" >> "$TMP_DIR/changelog.txt"
  echo "$RAW_LOG" >> "$TMP_DIR/changelog.txt"
else
  # Ask Gemini to write an intelligent summary
  PROMPT="You are summarising a week of changes to a personal blog (Hugo static site, vibecoding series). Below is the raw git log. Write a short, plain-English changelog (3–6 bullet points) suitable for a human reading a backup archive. Group related changes. Skip housekeeping noise. Lead each bullet with the impact, not the mechanism.\n\nGit log:\n${RAW_LOG}"

  PAYLOAD=$("$JQ" -n --arg p "$PROMPT" \
    '{"contents":[{"parts":[{"text":$p}]}]}')

  RESPONSE=$(curl -fsSL \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")

  SUMMARY=$("$JQ" -r '.candidates[0].content.parts[0].text // empty' <<< "$RESPONSE")

  if [[ -z "$SUMMARY" ]]; then
    # Gemini failed — fall back to raw log
    SUMMARY="(AI summary unavailable)\n\n$RAW_LOG"
  fi

  {
    echo "=== Blog changelog — week of $(date +%Y-%m-%d) ==="
    echo ""
    echo "$SUMMARY"
  } > "$TMP_DIR/changelog.txt"
fi

# Archive: full content dir + changelog
tar -czf "$TMP_DIR/$BACKUP_NAME" \
    -C "$BLOG_DIR" content \
    -C "$TMP_DIR" changelog.txt

# Upload
"$RCLONE" copy "$TMP_DIR/$BACKUP_NAME" "$REMOTE"
echo "Uploaded $BACKUP_NAME to $REMOTE"

# Delete backups older than 4 weeks
"$RCLONE" delete "$REMOTE" \
    --min-age "${RETAIN_WEEKS}w" \
    --include "blog-backup-*.tar.gz"
echo "Pruned backups older than ${RETAIN_WEEKS} weeks"
