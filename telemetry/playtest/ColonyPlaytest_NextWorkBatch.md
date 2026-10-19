# Project Deep-Mantle :: Engineering Work Batch: BATCH-77

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 21:19:15`

### Batch Overview
Finalize the simulation loop by implementing deterministic state hashing for rapid save/load verification and optimizing the Monte Carlo convergence check for the 5,500-tick milestone. This batch ensures the engine achieves 100% coverage with zero deadlocks and minimal memory overhead.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Save/Load Verification (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Runtime/Core/StateHash.h`
  - `Source/Runtime/Core/StateHash.cpp`
- **Architectural Specification**:
  1. Define struct StateHashContext with fixed-size arrays for tick, entity count, and checksum.
2. Implement constexpr hash function using FNV-1a algorithm for speed.
3. Integrate with ez::World::SaveState to append hash to binary stream.
4. Verify hash on load to detect corruption or non-deterministic drift.
5. Ensure zero heap allocations during hashing phase.
6. Use std::span for contiguous memory access.
7. Add static_assert for struct size alignment.
8. Provide inline comparison operator for fast equality checks.
- **Acceptance Criteria**:
  1. Hash generation completes in <1ms for 5,500 ticks.
2. Load verification fails gracefully on mismatch.
3. No heap allocations in hashing path.
4. Unit tests cover edge cases (empty state, max entities).
- **Player Fun & Anti-Spreadsheet Impact**:
  Instant save/load verification ensures no lost progress due to silent corruption.

#### [TASK-802] Optimize Monte Carlo Convergence Check for 5,500 Ticks (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Runtime/Simulation/MonteCarlo.h`
  - `Source/Runtime/Simulation/MonteCarlo.cpp`
- **Architectural Specification**:
  1. Refactor MonteCarloRunner to use fixed-size ring buffer for last 100 samples.
2. Implement incremental mean/variance calculation (Welford's algorithm).
3. Add early exit condition if variance < 1e-6 for 10 consecutive samples.
4. Remove dynamic vector resizing in hot loop.
5. Use std::array for sample storage.
6. Profile with 5,500 ticks to ensure <5ms total execution.
7. Ensure thread-safe atomic updates for shared counters.
8. Add debug output for convergence step count.
- **Acceptance Criteria**:
  1. Convergence detected within 100 samples for stable systems.
2. Execution time <5ms for 5,500 ticks.
3. No dynamic allocations in simulation loop.
4. Variance calculation matches reference implementation.
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster simulation steps lead to smoother gameplay and quicker load times.

#### [TASK-803] Add Tick-Count Metadata to Save Files (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Runtime/Core/SaveSystem.h`
  - `Source/Runtime/Core/SaveSystem.cpp`
- **Architectural Specification**:
  1. Extend SaveHeader struct with uint32_t tickCount field.
2. Populate tickCount from World::GetTick() during save.
3. Display tick count in UI debug overlay.
4. Ensure backward compatibility with old save formats (default 0).
5. Add version check for header size.
6. Use std::optional for optional fields.
7. Serialize as little-endian uint32.
8. Add unit test for header parsing.
- **Acceptance Criteria**:
  1. Tick count visible in debug overlay.
2. Old saves load without error (tick=0).
3. New saves include correct tick count.
4. No performance regression in save/load.
- **Player Fun & Anti-Spreadsheet Impact**:
  Helps players track progress and identify long-running sessions.

