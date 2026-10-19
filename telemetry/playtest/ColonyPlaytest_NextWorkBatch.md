# Project Deep-Mantle :: Engineering Work Batch: BATCH-24

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 13:06:29`

### Batch Overview
Finalize simulation coverage by implementing deterministic state compression for endgame snapshots and optimizing colonist psychology state machines for zero-latency transitions. These atomic tasks close the last gaps in memory efficiency and simulation determinism without introducing cascading dependencies.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Bit-Packed Deterministic State Serializer (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateSerializer.h`
  - `Source/Engine/Core/StateSerializer.cpp`
- **Architectural Specification**:
  1. Define struct `PackedState` using `std::array<uint64_t, 4>` for 256-bit fixed capacity.
2. Implement `serialize()` using `std::bit_cast` and manual bit-shifting for enum/bool/int packing.
3. Implement `deserialize()` with constexpr-friendly bit extraction.
4. Ensure zero heap allocations via `std::span` views.
5. Add static_assert for size <= 32 bytes.
6. No virtual functions; use CRTP for serializer interface if needed.
7. Handle endianness via `std::endian::native` checks.
8. Provide `operator==` for deterministic comparison.
9. Include `#pragma once` and minimal includes (<array>, <cstdint>, <bit>).
10. Test with 1000 random states for round-trip fidelity.
- **Acceptance Criteria**:
  1. Round-trip serialization/deserialization is bit-exact.
2. Memory footprint is exactly 32 bytes per state.
3. Zero heap allocations during serialization.
4. All unit tests pass with 100% coverage.
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load times and smaller save files, improving responsiveness in long campaigns.

#### [TASK-802] Optimize Footstep Logging with Ring Buffer (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/Physics/FootstepLogger.h`
  - `Source/Simulation/Physics/FootstepLogger.cpp`
- **Architectural Specification**:
  1. Define `struct Footstep` with `uint32_t tick`, `Vec2 pos`, `uint8_t type`.
2. Implement `class FootstepRingBuffer` with fixed capacity 16500.
3. Use `std::array<Footstep, 16500>` for storage.
4. Implement `push()` with modulo arithmetic for index wrapping.
5. Implement `get_last_n(n)` returning `std::span<const Footstep>`.
6. Ensure no dynamic resizing; capacity is compile-time constant.
7. Add `clear()` method resetting head index.
8. Use `alignas(8)` for cache-line alignment.
9. Provide `size()` and `capacity()` constexpr methods.
10. Validate against 16,500 tick limit in tests.
- **Acceptance Criteria**:
  1. Buffer holds exactly 16,500 entries without reallocation.
2. Access time for last N entries is O(1).
3. Memory usage is predictable and fixed.
4. No data loss in circular buffer logic.
- **Player Fun & Anti-Spreadsheet Impact**:
  Consistent performance during long simulations, preventing memory bloat in extended games.

#### [TASK-803] Cache Colonist Psychology State Transitions (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Storyteller/AI/PsychologyCache.h`
  - `Source/Storyteller/AI/PsychologyCache.cpp`
- **Architectural Specification**:
  1. Define enum `PsychState` with 8 values.
2. Create `struct TransitionTable` with `std::array<PsychState, 64>` for 8x8 matrix.
3. Implement `init_table()` with constexpr logic for deterministic transitions.
4. Provide `get_next(state, event)` returning `PsychState`.
5. Use `std::array` for zero-overhead storage.
6. Ensure all transitions are precomputed at compile time.
7. Add `is_terminal(state)` helper.
8. No dynamic memory; all data is static.
9. Include unit tests for all 64 transitions.
10. Validate against 5,500 tick simulation logs.
- **Acceptance Criteria**:
  1. All 64 state transitions are correct and deterministic.
2. Lookup time is O(1) with no branching overhead.
3. No heap allocations.
4. Matches existing simulation logs exactly.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother and more predictable colonist behavior, enhancing strategic planning.

