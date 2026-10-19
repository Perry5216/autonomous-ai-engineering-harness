# Project Deep-Mantle :: Engineering Work Batch: BATCH-09

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 11:17:31`

### Batch Overview
Finalize simulation coverage by implementing deterministic state compression for endgame snapshots and optimizing Monte Carlo convergence logic. These atomic tasks close the last gaps in long-term stability and memory efficiency without introducing cascading dependencies.

---

### Prioritized Engineering Tasks

#### [TASK-901] Implement Zero-Heap Deterministic State Hasher (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateHasher.h`
  - `src/engine/core/StateHasher.cpp`
- **Architectural Specification**:
  1. Define struct `StateSnapshot` with fixed-size arrays for tick, entity count, and checksum.
2. Implement `constexpr uint64_t ComputeHash(const StateSnapshot& s)` using FNV-1a.
3. Ensure no dynamic allocation; use `std::array` for all members.
4. Add static_assert for struct size <= 64 bytes.
5. Provide `inline` operator== for fast comparison.
6. Include unit test macro `EZ_TEST_HASH_DETERMINISM`.
- **Acceptance Criteria**:
  ['Hash computation is constexpr and zero-heap.', 'Struct size is exactly 64 bytes or less.', 'Unit tests verify identical hashes for identical states across 1000 iterations.', 'No external dependencies beyond <cstdint> and <array>.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load times and reliable deterministic replay verification.

#### [TASK-902] Optimize Monte Carlo Convergence Check (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/physics/MonteCarlo.h`
  - `src/simulation/physics/MonteCarlo.cpp`
- **Architectural Specification**:
  1. Refactor `MonteCarloRunner` to use a fixed-size ring buffer for last 100 results.
2. Implement `bool IsConverged()` checking if std::deviation < 1e-6 over the buffer.
3. Use `std::accumulate` for mean calculation.
4. Remove all `new/delete` calls; use stack-allocated arrays.
5. Add `noexcept` to all methods.
6. Ensure thread-safe via atomic counters for tick index.
- **Acceptance Criteria**:
  ['Convergence detected within 100 ticks for stable systems.', 'Memory footprint reduced by 40% compared to previous batch.', 'No heap allocations during simulation loop.', 'Thread-safe execution verified with 4 concurrent threads.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother physics simulation with fewer frame drops during complex interactions.

#### [TASK-903] Cache Colonist Psychological State Transitions (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/ai/colonist/PsychologyCache.h`
  - `src/ai/colonist/PsychologyCache.cpp`
- **Architectural Specification**:
  1. Create `struct PsychState` with enum `Mood` and `int16_t` stress level.
2. Implement `static PsychState GetState(int tick)` using a precomputed lookup table of size 5500.
3. Initialize table at compile-time using `constexpr` array.
4. Provide `inline` accessors for O(1) lookup.
5. Add `static_assert` for table size match.
6. No dynamic initialization; all data embedded in binary.
- **Acceptance Criteria**:
  ['Lookup time is < 1ns per call.', 'Table size matches 5500 ticks exactly.', 'No runtime initialization overhead.', 'Memory usage is constant and predictable.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Instantaneous UI updates for colonist status, reducing perceived lag.

