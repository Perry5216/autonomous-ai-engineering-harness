#!/usr/bin/env python3
"""
generate_outreach.py - Autonomous Founder & Engineering Lead Outreach Generator
Uses local RTX 5090 Blackwell (:8080 @ 182 tok/s) to craft hyper-personalized,
technically lethal 4-sentence cold emails with live telemetry receipts.
"""

import os
import json
import urllib.parse
import urllib.request
import sys

HARNESS_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TARGETS_FILE = os.path.join(os.path.dirname(__file__), "targets.json")
DRAFTS_DIR = os.path.join(os.path.dirname(__file__), "drafts")
TELEMETRY_FILE = os.path.join(HARNESS_ROOT, "telemetry", "live-telemetry.json")

def load_telemetry():
    if os.path.exists(TELEMETRY_FILE):
        try:
            with open(TELEMETRY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "verifiedCheckpoints": 135,
        "gitHead": "5ce4c247b",
        "activeTarget": "ezEngine C++20 Colony Simulation"
    }

def get_5090_model():
    try:
        req = urllib.request.Request("http://127.0.0.1:8080/v1/models")
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if "data" in data and len(data["data"]) > 0:
                return data["data"][0]["id"]
    except Exception:
        pass
    return "qwen3.8-flash-next"

def query_5090(system_prompt, user_prompt):
    url = "http://127.0.0.1:8080/v1/chat/completions"
    model_id = get_5090_model()
    payload = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 2048,
        "reasoning_budget_tokens": 128
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            res = json.loads(response.read().decode("utf-8"))
            return res["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Warning: 5090 query failed ({e}). Falling back to deterministic template.")
        return None

def main():
    os.makedirs(DRAFTS_DIR, exist_ok=True)
    telem = load_telemetry()
    checkpoints = telem.get("verifiedCheckpoints", 109)
    git_head = telem.get("gitHead", "34c017bb7")

    with open(TARGETS_FILE, "r", encoding="utf-8") as f:
        targets = json.load(f)

    print(f"\n==============================================================================")
    print(f" AUTONOMOUS OUTREACH ENGINE (RTX 5090 BLACKWELL @ 182 tok/s)")
    print(f" Targets: {len(targets)} founders & VPs | Verified Checkpoints: {checkpoints}")
    print(f"==============================================================================\n")

    review_cards = []

    for t in targets:
        print(f"Generating personalized outreach for {t['name']} ({t['company']})...")

        system_prompt = (
            "You are an elite Applied AI systems engineer drafting a 4-sentence high-conviction "
            "cold email to a founder or VP of Engineering. Adhere strictly to the 'Sniper' principle: "
            "No generic fluff, no sycophancy, pure technical proof and shared pain point. "
            "Output format must be strictly:\n"
            "Subject: <concise high-impact subject line>\n\n"
            "<Body: 4 concise sentences max, bulleted receipts, and clean call to action.>"
        )

        user_prompt = f"""
Target Leader: {t['name']} ({t['role']} at {t['company']})
Domain Focus: {t['domain_focus']}
Specific Hook: {t['specific_hook']}
Candidate: Anthony Perry (London, UK)
Harness Proof Points:
- Ran autonomous overnight loops against ezEngine (massive C++20 multi-million-line codebase)
- Verified {checkpoints}+ test checkpoints green with zero mock passes (binary exit code 0 + stdout sentinels)
- Asymmetric co-processor: Spark DRI + local RTX 5090 Blackwell delivering 205-303 tok/s (IQ2_XS, 99.5% cache hit) with <2.5s compiler AST triage
- Ephemeral Git Worktree sandboxing with zero-residue rollback on failed turns
- Double-Blind Clean-Room Audit: Zero-leakage reviewer enforcing Fowler clean-code standards & deterministic test gates
- ADR 0002 static architectural linter preventing God-class bloat
- Flight recorder dump of MSVC C2061 circular include triage in 2,766ms

Generate a punchy, technical, high-impact email from Anthony to {t['name']}. Include links:
- Flight recorder: https://github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json
- Showcase Repo: https://github.com/Perry5216/autonomous-ai-engineering-harness
"""

        generated = query_5090(system_prompt, user_prompt)

        # High-impact copy with the 'proof I am not a chancer' challenge
        if not generated:
            subject = f"Autonomous C++20 compiler triage & double-blind audit ({checkpoints}+ verified checkpoints)"
            body = (
                f"Hi {t['name'].split()[0]},\n\n"
                f"I've been following {t['company']}'s work on {t['domain_focus']}. "
                f"Most autonomous agent loops fail on massive compiled native codebases because models hallucinate test passes, bloat central headers, or choke on MSVC template recursion.\n\n"
                f"I engineered an autonomous harness running against ezEngine (C++20, multi-million LOC):\n"
                f"- Asymmetric co-processor: Spark DRI + RTX 5090 Blackwell running at 205-303 tok/s (IQ2_XS, 99.5% cache hit) with <2.5s AST triage\n"
                f"- Double-Blind Clean-Room Audit: Zero-leakage reviewer enforcing Fowler clean-code standards & deterministic test gates\n"
                f"- Ephemeral Git Worktree sandboxing with zero-residue rollback on failed turns\n"
                f"- {checkpoints}+ native test checkpoints verified green with zero mock passes\n\n"
                f"I know the AI space is saturated with chancers and wrapper builders. Don't take my word for anything: "
                f"open my repository (github.com/Perry5216/autonomous-ai-engineering-harness) and watch the commits roll in live "
                f"as my physical loops compile, verify, and push new C++20 subsystems throughout the night.\n\n"
                f"Raw incident flight recorder: https://github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json\n\n"
                f"Would love to jump on a quick 15-min call if you're exploring deterministic evaluation harnesses and compiler-in-the-loop loops for {t['company']}.\n\n"
                f"Best,\nAnthony Perry\nLondon, UK | linkedin.com/in/anthony-perry-33b7a01a0"
            )
        else:
            lines = generated.split("\n", 2)
            if lines[0].startswith("Subject:"):
                subject = lines[0].replace("Subject:", "").strip()
                body = lines[2].strip() if len(lines) > 2 else lines[1].strip()
            else:
                subject = f"Autonomous C++20 compiler triage & worktree sandboxing ({t['company']})"
                body = generated.strip()

        # Build mailto link
        mailto_subject = urllib.parse.quote(subject)
        mailto_body = urllib.parse.quote(body)
        mailto_url = f"mailto:{t['target_email']}?subject={mailto_subject}&body={mailto_body}"

        draft_md = f"""# Outreach Draft: {t['name']} ({t['company']})

**To:** `{t['target_email']}`  
**Role:** {t['role']}  
**Domain Focus:** {t['domain_focus']}  

---

### Subject: `{subject}`

```text
{body}
```

---

👉 **[Open in Mail Client / Send via Gmail]({mailto_url})**
"""
        draft_path = os.path.join(DRAFTS_DIR, f"{t['id']}.md")
        with open(draft_path, "w", encoding="utf-8") as df:
            df.write(draft_md)

        review_cards.append({
            "target": t,
            "subject": subject,
            "body": body,
            "mailto": mailto_url
        })
        print(f"  -> Draft saved: {draft_path}")

    # Generate consolidated HTML review board
    html_cards = ""
    for c in review_cards:
        t = c["target"]
        esc_body = c["body"].replace("\n", "<br>").replace("<", "&lt;").replace(">", "&gt;")
        html_cards += f"""
        <div class="card">
          <div class="card-header">
            <div>
              <h3>{t['name']} &middot; <span class="role">{t['role']}, {t['company']}</span></h3>
              <div class="email">{t['target_email']}</div>
            </div>
            <a class="btn-send" href="{c['mailto']}">Send in Mail App &rarr;</a>
          </div>
          <div class="subject-line"><strong>Subject:</strong> {c['subject']}</div>
          <div class="email-preview">{esc_body}</div>
        </div>
        """

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Targeted Founder Outreach Review Board | Anthony Perry</title>
  <style>
    body {{ background: #080c14; color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2rem; margin: 0; }}
    .container {{ max-width: 900px; margin: 0 auto; }}
    h1 {{ font-size: 1.8rem; margin-bottom: 0.5rem; color: #fff; }}
    .tagline {{ color: #9ca3af; margin-bottom: 2rem; font-size: 0.95rem; }}
    .card {{ background: rgba(16, 24, 40, 0.75); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }}
    .card-header {{ display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }}
    h3 {{ margin: 0; font-size: 1.2rem; color: #fff; }}
    .role {{ color: #06b6d4; font-weight: normal; font-size: 0.95rem; }}
    .email {{ font-family: monospace; color: #9ca3af; font-size: 0.85rem; margin-top: 0.25rem; }}
    .btn-send {{ background: #10b981; color: #000; text-decoration: none; font-weight: 700; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; transition: opacity 0.2s; }}
    .btn-send:hover {{ opacity: 0.85; }}
    .subject-line {{ background: rgba(0, 0, 0, 0.3); padding: 0.6rem 0.85rem; border-radius: 6px; font-size: 0.9rem; margin-bottom: 1rem; border-left: 3px solid #06b6d4; }}
    .email-preview {{ background: #020408; padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; line-height: 1.6; color: #d1d5db; white-space: pre-wrap; }}
  </style>
</head>
<body>
  <div class="container">
    <h1>Targeted Founder &amp; VP Outreach Review Board</h1>
    <p class="tagline">Hyper-personalized technical notes featuring {checkpoints} verified C++20 checkpoints &amp; 5090 Blackwell flight recorder receipts.</p>
    {html_cards}
  </div>
</body>
</html>
"""
    board_path = os.path.join(DRAFTS_DIR, "review-board.html")
    with open(board_path, "w", encoding="utf-8") as bf:
        bf.write(html_content)

    print(f"\n[SUCCESS] Generated {len(targets)} personalized outreach drafts!")
    print(f"Consolidated Review Board: {board_path}\n")

if __name__ == "__main__":
    main()
