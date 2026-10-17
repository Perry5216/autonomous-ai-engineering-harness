# Outreach Draft: Aman Sanger (Cursor (Anysphere))

**To:** `aman@anysphere.co`  
**Role:** Co-founder  
**Domain Focus:** Model steering, low-latency speculative edits, and evaluation harnesses  

---

### Subject: `Sub-second AST triage for Cursor’s speculative edits`

```text
- I built an autonomous harness that runs overnight against a multi-million-line C++20 codebase, keeps 135+ test checkpoints green, and verifies results with binary exit code 0 plus stdout sentinels.
- It uses an asymmetric co-processor: Spark DRI + local RTX 5090 Blackwell at 205–303 tok/s, with sub-2.5s compiler AST triage for syntax, circular includes, and God-class bloat.
- It sandboxes every turn in ephemeral Git worktrees, rolls back failed turns with zero residue, and enforces clean-code gates through a double-blind clean-room audit.
- Flight recorder: https://github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json — Showcase repo: https://github.com/Perry5216/autonomous-ai-engineering-harness
```

---

👉 **[Open in Mail Client / Send via Gmail](mailto:aman@anysphere.co?subject=Sub-second%20AST%20triage%20for%20Cursor%E2%80%99s%20speculative%20edits&body=-%20I%20built%20an%20autonomous%20harness%20that%20runs%20overnight%20against%20a%20multi-million-line%20C%2B%2B20%20codebase%2C%20keeps%20135%2B%20test%20checkpoints%20green%2C%20and%20verifies%20results%20with%20binary%20exit%20code%200%20plus%20stdout%20sentinels.%0A-%20It%20uses%20an%20asymmetric%20co-processor%3A%20Spark%20DRI%20%2B%20local%20RTX%205090%20Blackwell%20at%20205%E2%80%93303%20tok/s%2C%20with%20sub-2.5s%20compiler%20AST%20triage%20for%20syntax%2C%20circular%20includes%2C%20and%20God-class%20bloat.%0A-%20It%20sandboxes%20every%20turn%20in%20ephemeral%20Git%20worktrees%2C%20rolls%20back%20failed%20turns%20with%20zero%20residue%2C%20and%20enforces%20clean-code%20gates%20through%20a%20double-blind%20clean-room%20audit.%0A-%20Flight%20recorder%3A%20https%3A//github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json%20%E2%80%94%20Showcase%20repo%3A%20https%3A//github.com/Perry5216/autonomous-ai-engineering-harness)**
