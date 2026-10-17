#!/usr/bin/env python3
"""
web-error-lookup.py - Autonomous Ground-Truth Failure Research
Extracts error signatures from compiler / test outputs and fetches authoritative
ground-truth references (Microsoft Learn, StackOverflow, GitHub Issues) via ddgs.
"""

import sys
import re
import json

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

def lookup_error(error_text: str, context: str = "") -> str:
    signature = extract_error_signature(error_text)
    if not signature:
        return ""

    query = f"{context} {signature}".strip() if context else signature

    try:
        from ddgs import DDGS
        results = list(DDGS().text(query, max_results=2))
        if not results:
            # Try simplified query
            results = list(DDGS().text(signature, max_results=2))

        if not results:
            return ""

        output_lines = ["\n[AUTHORITATIVE WEB GROUND TRUTH]:"]
        for r in results:
            title = r.get("title", "Reference")
            url = r.get("href", "")
            snippet = r.get("body", "").replace("\n", " ").strip()
            output_lines.append(f"- [{title}]({url}): {snippet}")

        return "\n".join(output_lines)
    except Exception as e:
        return ""

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(0)
    
    error_input = sys.argv[1]
    context_input = sys.argv[2] if len(sys.argv) > 2 else ""
    
    receipts = lookup_error(error_input, context_input)
    if receipts:
        print(receipts)
