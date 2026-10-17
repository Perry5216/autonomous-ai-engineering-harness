# Outreach Draft: Scott Wu (Cognition (Devin))

**To:** `scott@cognition.ai`  
**Role:** Co-founder & CEO  
**Domain Focus:** Autonomous software engineering sandboxes, multi-step debugging, and shell environments  

---

### Subject: `Devin + C++ circular include triage: 135 green checkpoints, zero mock passes`

```text
Anthony Perry here — I ran an autonomous overnight harness against ezEngine, a massive C++20 multi-million-line codebase, and verified 135+ test checkpoints green with zero mock passes using binary exit code 0 + stdout sentinels.  
- Flight recorder: https://github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json  
- Showcase repo: https://github.com/Perry5216/autonomous-ai-engineering-harness  

The harness includes an asymmetric co-processor, Spark DRI + local RTX 5090 Blackwell, delivering 205–303 tok/s on IQ2_XS with 99.5% cache hit and <2.5s compiler AST triage, plus ephemeral Git worktree sandboxing with zero-residue rollback on failed turns.  
It also enforces a double-blind clean-room audit, Fowler clean-code standards, deterministic test gates, ADR 0002 static architectural linting against God-class bloat, and a 2,766ms MSVC C2061 circular include triage dump.  

If Devin’s sandbox reliability is the bottleneck on compiled C++ codebases with circular dependencies, I can show you the exact telemetry, gates, and rollback path that make it deterministic.
```

---

👉 **[Open in Mail Client / Send via Gmail](mailto:scott@cognition.ai?subject=Devin%20%2B%20C%2B%2B%20circular%20include%20triage%3A%20135%20green%20checkpoints%2C%20zero%20mock%20passes&body=Anthony%20Perry%20here%20%E2%80%94%20I%20ran%20an%20autonomous%20overnight%20harness%20against%20ezEngine%2C%20a%20massive%20C%2B%2B20%20multi-million-line%20codebase%2C%20and%20verified%20135%2B%20test%20checkpoints%20green%20with%20zero%20mock%20passes%20using%20binary%20exit%20code%200%20%2B%20stdout%20sentinels.%20%20%0A-%20Flight%20recorder%3A%20https%3A//github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json%20%20%0A-%20Showcase%20repo%3A%20https%3A//github.com/Perry5216/autonomous-ai-engineering-harness%20%20%0A%0AThe%20harness%20includes%20an%20asymmetric%20co-processor%2C%20Spark%20DRI%20%2B%20local%20RTX%205090%20Blackwell%2C%20delivering%20205%E2%80%93303%20tok/s%20on%20IQ2_XS%20with%2099.5%25%20cache%20hit%20and%20%3C2.5s%20compiler%20AST%20triage%2C%20plus%20ephemeral%20Git%20worktree%20sandboxing%20with%20zero-residue%20rollback%20on%20failed%20turns.%20%20%0AIt%20also%20enforces%20a%20double-blind%20clean-room%20audit%2C%20Fowler%20clean-code%20standards%2C%20deterministic%20test%20gates%2C%20ADR%200002%20static%20architectural%20linting%20against%20God-class%20bloat%2C%20and%20a%202%2C766ms%20MSVC%20C2061%20circular%20include%20triage%20dump.%20%20%0A%0AIf%20Devin%E2%80%99s%20sandbox%20reliability%20is%20the%20bottleneck%20on%20compiled%20C%2B%2B%20codebases%20with%20circular%20dependencies%2C%20I%20can%20show%20you%20the%20exact%20telemetry%2C%20gates%2C%20and%20rollback%20path%20that%20make%20it%20deterministic.)**
