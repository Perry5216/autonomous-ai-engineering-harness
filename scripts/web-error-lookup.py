#!/usr/bin/env python3
"""
web-error-lookup.py - Autonomous Ground-Truth Failure Research with SSD Cache
Extracts error signatures from compiler / test outputs and fetches authoritative
ground-truth references (Microsoft Learn, StackOverflow, GitHub Issues) via ddgs.

Features:
- Fast Local SSD Cache (TTL + LRU eviction) to eliminate redundant 3-4s web roundtrips (<1ms hits).
- Automatic eviction of stale entries (default TTL: 7 days, max: 500 entries).
- Manual cache maintenance via --clean, --flush, and --stats.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
from pathlib import Path

DEFAULT_CACHE_PATH = Path(os.environ.get("DSH_WEB_CACHE", r"C:\Users\5216p\.dsh\cache\web-error-cache.json"))
DEFAULT_TTL_SECONDS = 7 * 24 * 3600  # 7 days
MAX_CACHE_ENTRIES = 500


def get_cache_file() -> Path:
    cache_path = DEFAULT_CACHE_PATH
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    return cache_path


def load_cache() -> dict:
    cache_file = get_cache_file()
    if not cache_file.exists():
        return {"version": 1, "entries": {}}
    try:
        with open(cache_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            if "entries" not in data:
                return {"version": 1, "entries": {}}
            return data
    except Exception:
        return {"version": 1, "entries": {}}


def save_cache(cache_data: dict) -> None:
    cache_file = get_cache_file()
    try:
        temp_file = cache_file.with_suffix(".tmp")
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, indent=2, ensure_ascii=False)
        temp_file.replace(cache_file)
    except Exception:
        pass


def prune_cache(cache_data: dict, ttl: int = DEFAULT_TTL_SECONDS, max_entries: int = MAX_CACHE_ENTRIES) -> int:
    """Prunes expired and excess entries. Returns count of removed entries."""
    now = time.time()
    entries = cache_data.get("entries", {})
    initial_count = len(entries)

    # 1. Remove expired
    valid = {
        k: v for k, v in entries.items()
        if (now - v.get("created_at", 0)) < ttl
    }

    # 2. LRU eviction if over max_entries
    if len(valid) > max_entries:
        sorted_keys = sorted(valid.keys(), key=lambda k: valid[k].get("last_accessed", 0), reverse=True)
        valid = {k: valid[k] for k in sorted_keys[:max_entries]}

    cache_data["entries"] = valid
    return initial_count - len(valid)


def query_hash(query: str) -> str:
    normalized = " ".join(query.strip().lower().split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()[:16]


def get_cached(query: str) -> str | None:
    h = query_hash(query)
    cache_data = load_cache()
    entry = cache_data.get("entries", {}).get(h)
    if not entry:
        return None

    now = time.time()
    if (now - entry.get("created_at", 0)) > DEFAULT_TTL_SECONDS:
        # Expired
        prune_cache(cache_data)
        save_cache(cache_data)
        return None

    # Update last accessed
    entry["last_accessed"] = now
    save_cache(cache_data)
    return entry.get("receipts")


def store_cached(query: str, signature: str, receipts: str) -> None:
    if not receipts.strip():
        return
    h = query_hash(query)
    cache_data = load_cache()
    now = time.time()
    cache_data["entries"][h] = {
        "query": query,
        "signature": signature,
        "receipts": receipts,
        "created_at": now,
        "last_accessed": now
    }
    prune_cache(cache_data)
    save_cache(cache_data)


def extract_error_signature(error_text: str) -> str:
    # 1. MSVC / C++ compiler errors
    msvc_match = re.search(r'(?:fatal error|error)\s+([A-Z]\d{4}):?\s*([^\r\n]+)', error_text, re.IGNORECASE)
    if msvc_match:
        return f"MSVC {msvc_match.group(1)} {msvc_match.group(2)[:60]}"

    # 2. Node.js / JS assertion or runtime errors
    node_err = re.search(r'((?:AssertionError|TypeError|ReferenceError|SyntaxError)(?: \[[A-Z_]+\])?:?\s*[^\r\n]+)', error_text)
    if node_err:
        return node_err.group(1)[:80]

    # 3. Ninja / CMake failure
    ninja_err = re.search(r'FAILED: [^\r\n]+[\r\n]+([^\r\n]+)', error_text)
    if ninja_err:
        return ninja_err.group(1)[:80]

    # 4. Fallback: first non-empty line with 'error' or 'fail'
    for line in error_text.splitlines():
        line_clean = line.strip()
        if re.search(r'\b(?:error|fail|exception|fatal)\b', line_clean, re.IGNORECASE):
            return line_clean[:80]

    return error_text.strip().splitlines()[0][:80] if error_text.strip() else ""


def lookup_error(error_text: str, context: str = "", use_cache: bool = True) -> str:
    signature = extract_error_signature(error_text)
    if not signature:
        return ""

    query = f"{context} {signature}".strip() if context else signature

    # 1. Fast SSD Cache Check
    if use_cache:
        cached = get_cached(query)
        if cached:
            return cached

    # 2. Live Web Ground-Truth Search
    try:
        from ddgs import DDGS
        results = list(DDGS().text(query, max_results=2))
        if not results:
            results = list(DDGS().text(signature, max_results=2))

        if not results:
            return ""

        output_lines = ["\n[AUTHORITATIVE WEB GROUND TRUTH]:"]
        for r in results:
            title = r.get("title", "Reference")
            url = r.get("href", "")
            snippet = r.get("body", "").replace("\n", " ").strip()
            output_lines.append(f"- [{title}]({url}): {snippet}")

        receipts = "\n".join(output_lines)

        # Store in SSD Cache
        if use_cache and receipts:
            store_cached(query, signature, receipts)

        return receipts
    except Exception:
        return ""


def main():
    parser = argparse.ArgumentParser(description="Autonomous Ground-Truth Failure Research with SSD Cache")
    parser.add_argument("error", nargs="?", default="", help="Error message / stack trace")
    parser.add_argument("context", nargs="?", default="", help="Optional task / language context")
    parser.add_argument("--clean", action="store_true", help="Prune expired and excess entries from cache")
    parser.add_argument("--flush", action="store_true", help="Completely clear the SSD cache")
    parser.add_argument("--stats", action="store_true", help="Display cache statistics")
    parser.add_argument("--no-cache", action="store_true", help="Bypass local SSD cache and force live search")

    args = parser.parse_args()

    cache_file = get_cache_file()

    if args.flush:
        if cache_file.exists():
            save_cache({"version": 1, "entries": {}})
            print(f"[SSD Cache] Flushed cache: {cache_file}")
        return

    if args.clean:
        cache_data = load_cache()
        removed = prune_cache(cache_data)
        save_cache(cache_data)
        print(f"[SSD Cache] Cleaned {removed} expired/excess entries. Active entries: {len(cache_data.get('entries', {}))}")
        return

    if args.stats:
        cache_data = load_cache()
        entries = cache_data.get("entries", {})
        size_kb = cache_file.stat().st_size / 1024 if cache_file.exists() else 0
        print(f"[SSD Cache Statistics]")
        print(f"  • Location:   {cache_file}")
        print(f"  • Entries:    {len(entries)} / {MAX_CACHE_ENTRIES}")
        print(f"  • File Size:  {size_kb:.1f} KB")
        print(f"  • TTL Policy: {DEFAULT_TTL_SECONDS // 86400} days auto-expire")
        return

    if not args.error:
        parser.print_help()
        return

    receipts = lookup_error(args.error, args.context, use_cache=not args.no_cache)
    if receipts:
        print(receipts)


if __name__ == "__main__":
    main()
