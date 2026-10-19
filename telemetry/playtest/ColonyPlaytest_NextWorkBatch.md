# Project Deep-Mantle :: Engineering Work Batch: BATCH-73

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 20:33:22`

### Batch Overview
This batch focuses on finalizing the endgame state machine and optimizing memory footprint for long-running simulations. By implementing deterministic state hashing and a compact tick-based history buffer, we ensure 100% reproducibility and minimal memory overhead for the 5,500+ tick campaign. These changes close the final gaps in simulation determinism and resource management.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Endgame Snapshots (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateHash.h`
  - `Source/Engine/Core/StateHash.cpp`
- **Architectural Specification**:
  Create a zero-heap, constexpr-friendly hash function for the core simulation state. Use a 64-bit FNV-1a variant. The struct `EndgameSnapshot` will hold the tick count, active colonist IDs (fixed array), and resource totals. The hash is computed incrementally per tick to avoid full re-scans. No dynamic allocations. All logic fits within 40 lines.
- **Acceptance Criteria**:
  ['Hash value is identical across 100 Monte Carlo runs for the same seed.', 'No heap allocations during hash computation.', 'Compilation time increases by < 1ms.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Ensures save/load consistency and enables fast, reliable replay verification.

#### [TASK-802] Compact Tick-Based History Buffer for Colonist Paths (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/Colonist/PathHistory.h`
  - `Source/Simulation/Colonist/PathHistory.cpp`
- **Architectural Specification**:
  Replace the std::deque path history with a circular buffer of fixed size (e.g., 64 entries). Each entry stores a packed 32-bit coordinate and a 16-bit timestamp. Use `std::array` for storage. Implement `push_back` and `get_at_offset` with O(1) complexity. Total logic under 50 lines. No virtual functions.
- **Acceptance Criteria**:
  ['Memory usage per colonist reduced by 40%.', 'Path reconstruction is accurate for the last 64 ticks.', 'No cache misses in tight simulation loops.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother frame rates during large-scale colony views due to reduced cache pressure.

#### [TASK-803] Static Event Queue for Endgame Ascension Triggers (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Storyteller/EndgameEvents.h`
- **Architectural Specification**:
  Define a static array of `Event` structs for the final 10 ticks. Each event contains a tick ID and a string ID (enum). Implement a simple linear search for the current tick. No dynamic memory. Logic is purely declarative and fits in 30 lines. Integrates with the existing `StateHash` system.
- **Acceptance Criteria**:
  ['Events trigger exactly at their defined tick.', 'Zero allocations during event processing.', 'Header-only implementation.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Provides clear, immediate feedback on ascension milestones without lag.

