# Project Deep-Mantle :: Engineering Work Batch: BATCH-41

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 15:13:36`

### Batch Overview
Finalize simulation coverage by implementing deterministic state hashing for save/load integrity, optimizing colonist psychology decay curves for long-term stability, and establishing a zero-allocation event bus for endgame ascension triggers.

---

### Prioritized Engineering Tasks

#### [TASK-801] Deterministic State Hashing for Save Integrity (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateHasher.h`
  - `src/engine/core/StateHasher.cpp`
- **Architectural Specification**:
  Implement a constexpr-friendly FNV-1a hash for struct-based state snapshots. Use std::array for fixed-size buffers. No dynamic allocation. Hash order must be stable across compiler versions. Integrate with existing I/O pipeline via template specialization for POD types.
- **Acceptance Criteria**:
  1. Hash output is identical across 1000 runs. 2. Zero heap allocations during hashing. 3. Compile time < 50ms for 100 structs.
- **Player Fun & Anti-Spreadsheet Impact**:
  Instant, reliable save/load cycles with no corruption warnings.

#### [TASK-802] Optimized Psychology Decay Curves (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/sim/psychology/DecayModel.h`
  - `src/sim/psychology/DecayModel.cpp`
- **Architectural Specification**:
  Replace iterative decay loops with closed-form exponential solutions using std::exp. Precompute lookup tables for common time steps (1, 5, 10 ticks). Use float precision for speed. Ensure monotonic convergence to baseline.
- **Acceptance Criteria**:
  1. Decay values match reference within 1e-6. 2. 10x faster than iterative method. 3. No NaN propagation.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother, more predictable colonist mood transitions in long sessions.

#### [TASK-803] Zero-Allocation Event Bus for Ascension (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/ai/EventBus.h`
  - `src/ai/EventBus.cpp`
- **Architectural Specification**:
  Implement a fixed-capacity ring buffer for event dispatch. Use std::variant for event types. Dispatch via function pointers stored in a static array. No std::function overhead. Support 16 concurrent listeners.
- **Acceptance Criteria**:
  1. Dispatch latency < 10ns. 2. No heap allocations. 3. Handles 10k events/sec without drop.
- **Player Fun & Anti-Spreadsheet Impact**:
  Responsive UI updates during complex endgame sequences.

