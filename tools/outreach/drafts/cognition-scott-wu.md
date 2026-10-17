# Outreach Draft: Scott Wu (Cognition (Devin))

**To:** `scott@cognition.ai`  
**Role:** Co-founder & CEO  
**Domain Focus:** Autonomous software engineering sandboxes, multi-step debugging, and shell environments  

---

### Subject: `Autonomous C++20 compiler triage & worktree sandboxing (109 verified checkpoints)`

```text
Hi Scott,

I've been following Cognition (Devin)'s work on Autonomous software engineering sandboxes, multi-step debugging, and shell environments. Most autonomous agent loops fail on massive compiled native codebases because models hallucinate test passes, bloat central headers, or choke on MSVC template recursion.

I engineered an autonomous harness running against ezEngine (C++20, multi-million LOC):
- Asymmetric co-processor: Spark DRI + RTX 5090 Blackwell running compiler AST triage in 2,766ms
- Ephemeral Git Worktree sandboxing with zero-residue rollback on failed turns
- 109 native test checkpoints verified green with zero mock passes

I know the AI space is saturated with chancers and wrapper builders. Don't take my word for anything: open my repository (github.com/Perry5216/autonomous-ai-engineering-harness) and watch the commits roll in live as my physical loops compile, verify, and push new C++20 subsystems throughout the night.

Raw incident flight recorder: https://github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json

Would love to jump on a quick 15-min call if you're exploring deterministic evaluation harnesses and compiler-in-the-loop loops for Cognition (Devin).

Best,
Anthony Perry
London, UK | linkedin.com/in/anthony-perry-33b7a01a0
```

---

👉 **[Open in Mail Client / Send via Gmail](mailto:scott@cognition.ai?subject=Autonomous%20C%2B%2B20%20compiler%20triage%20%26%20worktree%20sandboxing%20%28109%20verified%20checkpoints%29&body=Hi%20Scott%2C%0A%0AI%27ve%20been%20following%20Cognition%20%28Devin%29%27s%20work%20on%20Autonomous%20software%20engineering%20sandboxes%2C%20multi-step%20debugging%2C%20and%20shell%20environments.%20Most%20autonomous%20agent%20loops%20fail%20on%20massive%20compiled%20native%20codebases%20because%20models%20hallucinate%20test%20passes%2C%20bloat%20central%20headers%2C%20or%20choke%20on%20MSVC%20template%20recursion.%0A%0AI%20engineered%20an%20autonomous%20harness%20running%20against%20ezEngine%20%28C%2B%2B20%2C%20multi-million%20LOC%29%3A%0A-%20Asymmetric%20co-processor%3A%20Spark%20DRI%20%2B%20RTX%205090%20Blackwell%20running%20compiler%20AST%20triage%20in%202%2C766ms%0A-%20Ephemeral%20Git%20Worktree%20sandboxing%20with%20zero-residue%20rollback%20on%20failed%20turns%0A-%20109%20native%20test%20checkpoints%20verified%20green%20with%20zero%20mock%20passes%0A%0AI%20know%20the%20AI%20space%20is%20saturated%20with%20chancers%20and%20wrapper%20builders.%20Don%27t%20take%20my%20word%20for%20anything%3A%20open%20my%20repository%20%28github.com/Perry5216/autonomous-ai-engineering-harness%29%20and%20watch%20the%20commits%20roll%20in%20live%20as%20my%20physical%20loops%20compile%2C%20verify%2C%20and%20push%20new%20C%2B%2B20%20subsystems%20throughout%20the%20night.%0A%0ARaw%20incident%20flight%20recorder%3A%20https%3A//github.com/Perry5216/autonomous-ai-engineering-harness/blob/main/telemetry/incidents/incident-2026-10-17-msvc-circular-include.json%0A%0AWould%20love%20to%20jump%20on%20a%20quick%2015-min%20call%20if%20you%27re%20exploring%20deterministic%20evaluation%20harnesses%20and%20compiler-in-the-loop%20loops%20for%20Cognition%20%28Devin%29.%0A%0ABest%2C%0AAnthony%20Perry%0ALondon%2C%20UK%20%7C%20linkedin.com/in/anthony-perry-33b7a01a0)**
