# Project Deep-Mantle :: Engineering Work Batch: BATCH-17

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 12:14:45`

### Batch Overview
This batch finalizes the simulation core by implementing deterministic state serialization for ultra-endgame scenarios and optimizing the Monte Carlo convergence logic. The focus is on reducing memory footprint during long-running simulations (5,500+ ticks) and ensuring strict determinism in the final state snapshot, closing the last gaps in the 'Deep-Mantle' architecture.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Copy Deterministic State Snapshot (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateSnapshot.h`
  - `src/engine/core/StateSnapshot.cpp`
- **Architectural Specification**:
  1. Define struct `SnapshotHeader` with `uint64_t tick`, `uint32_t checksum`, `uint32_t version`.
2. Implement `class StateSnapshot` using `std::span<const uint8_t>` for zero-copy access.
3. Add `static_assert` for trivially copyable types in header.
4. Implement `Serialize()` returning `std::span<const uint8_t>`.
5. Implement `Deserialize()` using `memcpy` into pre-allocated buffers.
6. Ensure no dynamic allocation in hot path; use `std::array` for fixed-size fields.
7. Add `constexpr` constructors for header initialization.
8. Verify alignment with `alignas(8)`.
9. Include `#pragma once` and C++20 `import` compatible headers.
10. Ensure `noexcept` on all serialization methods.
- **Acceptance Criteria**:
  ['Snapshot serialization completes in < 100ns for 1KB data.', 'Zero heap allocations during snapshot creation.', 'Checksum matches FNV-1a 64-bit standard.', 'All tests pass with `-fsanitize=address` clean.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load times and reduced memory usage for long campaigns.

#### [TASK-802] Optimize Monte Carlo Convergence for 5k+ Ticks (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/mc/ConvergenceOptimizer.h`
  - `src/simulation/mc/ConvergenceOptimizer.cpp`
- **Architectural Specification**:
  1. Create `struct MCState` with `double mean`, `double variance`, `uint32_t count`.
2. Implement Welford's online algorithm for variance calculation.
3. Add `constexpr` update function `Update(MCState& state, double value)`.
4. Implement `IsConverged(const MCState& state, double epsilon)`.
5. Use `std::numbers::pi` for any geometric constants.
6. Ensure all operations are `noexcept`.
7. Add `static_assert` for epsilon precision (1e-9).
8. Implement batch update for vector inputs using `std::span`.
9. Cache last 10 states for trend analysis in `struct TrendCache`.
10. Ensure thread-safe read-only access via `const` methods.
- **Acceptance Criteria**:
  ['Convergence detected within 100 iterations for standard distributions.', 'Memory usage per MCState is exactly 24 bytes.', 'No floating-point drift after 10,000 updates.', 'Unit tests cover edge cases: NaN, Inf, zero variance.']
- **Player Fun & Anti-Spreadsheet Impact**:
  More accurate and faster simulation results for complex colony scenarios.

#### [TASK-803] Add Deterministic Event Log Compression (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/storyteller/EventLog.h`
  - `src/storyteller/EventLog.cpp`
- **Architectural Specification**:
  1. Define `enum class EventType : uint8_t` with 10 core types.
2. Create `struct Event` with `uint32_t tick`, `EventType type`, `uint16_t payload`.
3. Implement `class EventLog` with fixed-size `std::array<Event, 1024>`.
4. Add `Push(Event)` with circular buffer logic.
5. Implement `GetRecent(uint32_t count)` returning `std::span<const Event>`.
6. Add `Checksum()` using XOR of all fields.
7. Ensure `Event` is 8 bytes packed.
8. Implement `Clear()` resetting index to 0.
9. Add `constexpr` helpers for type-to-string mapping.
10. Verify no virtual functions in `Event` or `EventLog`.
- **Acceptance Criteria**:
  ['Event log fits in 8KB cache line aligned memory.', 'Push operation is O(1) with no allocations.', 'Checksum is stable across runs.', 'All 10 event types are correctly serialized.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Smaller save files and faster log retrieval for UI display.

