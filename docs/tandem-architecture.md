# Asymmetric Tandem Architecture: Spark DRI + RTX 5090 Blackwell Reflex

## Executive Summary
Autonomous software development systems frequently break down when tasked with large, compiled native codebases (such as modern C++20 game engines or complex backend distributed systems). The root causes are well-understood:
1. **Model Drift & God-Class Proliferation**: Standard code generation models tend to modify familiar central headers (e.g. `World.h` or `Context.h`), causing compilation times to explode and violating separation of concerns.
2. **"Green When Untrue" Fallacy**: Weak test harnesses mark tests as passing based on regex matches in stderr or exit codes without deterministic sentinel verification.
3. **Compiler Error Paralysis**: Multi-node cluster inference models have significant turnaround times (10–30s per prompt). Using heavy models to diagnose small syntax issues, missing includes, or type mismatches wastes compute and causes token-exhaustion loops.

The **Asymmetric Tandem Architecture** eliminates these pathologies by separating **Deep Reasoning Implementation (DRI)** from **Ultra-Low-Latency Reflex Triage**.

---

## 1. The Two-Speed Inference Pipeline

```
+-----------------------------------------------------------------------------------+
|                            TANDEM CO-PROCESSOR MODEL                              |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ SPARK CLUSTER ]                                      [ RTX 5090 BLACKWELL ]    |
|  Endpoint: :8877                                        Endpoint: :8080           |
|  Role: Primary DRI                                      Role: Reflex & Triage     |
|  Model: qwen3.8-flash-next                              Model: qwen3.8-flash-next |
|  Throughput: Multi-file code generation                 Throughput: 182 tok/s     |
|  Context: Feature blueprints, DAG specs                 Latency: < 2,000 ms       |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### The Primary DRI (Spark Cluster)
- Handles broad implementation steps.
- Ingests full subsystem specs, module interfaces, and data-definition files.
- Generates new subsystem headers, `.cpp` implementations, and unit test suites.

### The Reflex Triage Engine (NVIDIA RTX 5090 Blackwell)
- Operates locally at ultra-high throughput (**198.8 tokens/sec**, latency **< 2,500 ms**).
- Dedicated exclusively to:
  - **Fowler Code Smell & Clean Code Linting**: Pre-commit diff inspection for Mysterious Name, Duplicated Code, and Spec Compliance.
  - **Compiler AST Triage**: Instantly parses MSVC/Clang/GCC compiler dumps, pinpoints missing `#include` directives or forward declaration cycles, and emits minimal surgical diffs.
  - **Zero Display Contention**: Hardware isolation guarantees compute runs without interfering with workstation desktop GPUs (e.g. 5070 Ti display card).

---

## 1.5 Two-Tier Asymmetric Token Budgets: Latency Discipline vs. Whole-Module Synthesis

A common trap in autonomous agent architecture is treating token generation limits as either an afterthought or a blunt global maximum. The harness implements a **strict two-tier budget model**:

```
+--------------------------------------------------------------------------------------------------+
|                                    TIERED TOKEN ALLOCATION MODEL                                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|  TIER 1: REFLEX TRIAGE & LINTING                   TIER 2: WHOLE-MODULE SYNTHESIS               |
|  Max Completion: 2,048 tokens                      Max Completion: 32,768 tokens                 |
|  Reasoning Budget: 512 tokens                      Reasoning Budget: 4,096 tokens                |
|  Target Latency: < 2,500 ms                        Target Latency: 20s - 2.5 min                 |
|  KV Footprint: Transient                           KV Footprint: 32,768 tokens resident in VRAM  |
|  Use Case: MSVC error repair, smell lint           Use Case: Whole translation units, SIMD BVH  |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### Why Not 32k Tokens for Every Request?
**Latency discipline**. When an autonomous loop hits an MSVC compiler error, the entire pipeline is blocked waiting for the diagnosis. At ~198.8 tok/s:
- Generating 2,048 tokens takes **~2.2 to 10 seconds**.
- Generating 32,768 tokens takes **~2.7 minutes**.

If an unconstrained agent starts drafting an unsolicited dissertation about a missing semicolon, it stalls the developer's feedback loop. Tier 1 caps output at 2,048 tokens with a strict 512-token reasoning budget, guaranteeing sub-3-second compiler repairs.

### When Is 32k Activated?
When synthesizing complete C++20 translation units (e.g. SIMD spatial partitioning, KD-Trees, full ECS components), partial or truncated outputs create incomplete types and broken syntax that break the compiler. The RTX 5090 Blackwell's **32,768-token INT8 KV cache** is kept resident directly in high-bandwidth GDDR7 VRAM within a **131,072-token total context window**, allowing the model to generate multi-thousand-line subsystems without spilling to PCIe or system RAM.

### The Reasoning Budget Invariant: Preventing `<think>` Starvation
Modern reasoning models (`Qwen3.8-Flash-Next`, DeepSeek-R1 class) generate chain-of-thought tokens inside `<think> ... </think>` tags before emitting their answer. Without explicit token budgeting:
1. A small `max_tokens` (e.g. 512) causes the model to consume all available tokens in thinking.
2. The model hits the token ceiling before emitting `</think>`.
3. The server aborts with: `[strata] the reply reached max tokens while still thinking, so it has no answer`.

The harness explicitly budgets reasoning tokens (`reasoning_budget_tokens: 512` for Tier 1, `4,096` for Tier 2). Once the thinking budget is reached, Strata injects the closing token and allows the model to utilize the remaining token envelope purely for executable code.

---

## 2. Hardened Verification Gates: Zero "Green When Untrue"

The harness enforces a zero-trust multi-gate verification pipeline:

```
[Spark Step Completed]
         │
         ▼
[Gate 1: Modification Gate]
  Did the model touch real source/test files?
  ├── NO  ──► Instant Reject & Reprompt ("You did not modify source files.")
  └── YES ──► Proceed to Gate 1.5
         │
         ▼
[Gate 1.5: ADR 0002 Architectural Decoupling Linter]
  Did the model introduce a dedicated subsystem header?
  ├── NO (God-class modified) ──► Reject & Reprompt ("ADR 0002 Violation.")
  └── YES ──► Proceed to Gate 2
         │
         ▼
[Gate 2: Deterministic Native Build & Test Execution]
  - Execute CMake / MSVC build
  - Execute native test binary (ColonyPluginTest.exe)
  - Verify binary exit code ($LASTEXITCODE == 0)
  - Verify ALL stdout checkpoint sentinels ("checkpoint: ... ok")
  ├── FAILED ──► Pass dump to RTX 5090 Blackwell (<2s) ──► Reprompt with Surgical Fix
  └── PASSED ──► Proceed to Gate 3
         │
         ▼
[Gate 3: Standards & Fowler Smell Review]
  - Fast diff scan on 5090 Blackwell
  - Auto-commit to Git with formatted message
  - Auto-update public portfolio telemetry & push to GitHub
```

---

## 3. Real Production Incident: Circular Include Triage

In an overnight run on an ezEngine colony simulation plugin, Module 31 triggered an MSVC fatal compiler error:

```
C:\ezEngine\Code\EnginePlugins\ColonyPlugin\ColonyRoomComponent.h(12): 
fatal error C2061: syntax error: identifier 'ezColonyWorldModule'
```

### Traditional Agent Behavior:
A typical single-agent loop would rewrite both files from scratch, introducing new hallucinations, breaking unrelated room registration methods, or repeating the error 3 times before failing.

### Asymmetric Tandem Behavior:
1. **Detection**: `stage4-overnight.ps1` detected non-zero exit code on CMake build.
2. **Triage Dispatch**: The raw MSVC error text was piped to the RTX 5090 Blackwell endpoint (`:8080`).
3. **5090 Output (2,766ms)**:
   > "Root Cause: ColonyRoomComponent.h includes ColonyWorldModule.h while ColonyWorldModule.h includes ColonyRoomComponent.h.
   > Minimal Fix: Replace `#include <ColonyPlugin/ColonyWorldModule.h>` with forward declarations `class ezColonyWorldModule;` and `struct ezColonyCell;`."
4. **Resolution**: The repair prompt was fed to the next turn. The circular include was severed, compilation succeeded in 1.4s, and all 109 test checkpoints passed.

---

## 4. Portability & Generalization

While demonstrated on a massive C++20 game engine (`ezEngine`), the harness is completely agnostic and supports:
- **C++ / CMake / MSVC / Clang**: Automated binary execution and checkpoint verification.
- **Node.js / TypeScript / Jest / Vitest**: Automated `npm test` inspection and exit-code validation.
- **Rust / Cargo**: `cargo test` sentinel parsing and compiler linting.
- **Python / Pytest**: Strict assertion checking and syntax validation.
