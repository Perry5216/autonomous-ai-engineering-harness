# Project Deep-Mantle :: Engineering Work Batch: BATCH-46

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 15:52:51`

### Batch Overview
This batch focuses on finalizing the endgame state by implementing deterministic compression for long-running simulations and optimizing the Monte Carlo convergence logic. These steps ensure that the 5,500-tick campaign state remains stable, memory-efficient, and reproducible without cascading header dependencies.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Heap Deterministic State Hasher (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateHasher.h`
  - `src/engine/core/StateHasher.cpp`
- **Architectural Specification**:
  1. Define struct `StateSnapshot` with fixed-size arrays for tick, entity count, and checksum.
2. Implement `constexpr uint64_t ComputeHash(const StateSnapshot& s)` using FNV-1a variant.
3. Ensure no dynamic allocation; use `std::array` for all members.
4. Add static assertion for struct size <= 64 bytes.
5. Provide inline operator== for fast comparison.
6. Integrate with existing `TickManager` via template specialization.
7. Handle endianness explicitly using `std::endian::native`.
8. Return hash as `uint64_t` for direct comparison.
9. No virtual functions; use CRTP if needed for extension.
10. Validate against 5,500-tick reference data.
- **Acceptance Criteria**:
  1. Hash computation completes in < 10ns for 5,500-tick state.
2. Zero heap allocations during hashing.
3. Identical states produce identical hashes across platforms.
4. Unit tests cover edge cases (empty state, max entities).
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load times and reliable deterministic replays for competitive modes.

#### [TASK-802] Optimize Monte Carlo Convergence Check for 100% Survival (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/mc/ConvergenceChecker.h`
  - `src/simulation/mc/ConvergenceChecker.cpp`
- **Architectural Specification**:
  1. Create `struct MCResult` holding survival rate and variance.
2. Implement `bool IsConverged(const MCResult& r)` with epsilon 1e-6.
3. Use `std::span` for input data to avoid copies.
4. Precompute inverse variance for fast division.
5. Add `static_assert` for epsilon precision.
6. Cache last 10 results in fixed array for trend analysis.
7. Return `true` if variance < epsilon for 3 consecutive ticks.
8. No recursion; use iterative loop for stability.
9. Integrate with `PhysicsStep` via direct call.
10. Ensure thread-safe read-only access to cached results.
- **Acceptance Criteria**:
  1. Convergence detected within 3 ticks of stability.
2. No false positives in 10,000 test runs.
3. Memory footprint < 1KB per checker instance.
4. Compatible with existing `PhysicsStep` loop.
- **Player Fun & Anti-Spreadsheet Impact**:
  Immediate feedback on simulation stability, reducing perceived lag in endgame.

#### [TASK-803] Compact Footstep Log Serializer for 16,500 Entries (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/ai/storyteller/FootstepLog.h`
  - `src/ai/storyteller/FootstepLog.cpp`
- **Architectural Specification**:
  1. Define `struct Footstep` with `uint16_t tick`, `uint8_t x`, `uint8_t y`.
2. Implement `void Serialize(const std::span<const Footstep>& data, std::byte* buffer)`.
3. Use bit-packing: 16 bits tick, 8 bits x, 8 bits y = 32 bits per entry.
4. Total size for 16,500 entries = 66,000 bytes.
5. Add `constexpr size_t MaxEntries = 16500`.
6. Provide `Deserialize` function with bounds checking.
7. Use `std::memcpy` for bulk copy where possible.
8. No dynamic allocation; buffer provided by caller.
9. Validate checksum after deserialization.
10. Ensure little-endian compatibility.
- **Acceptance Criteria**:
  1. Serialization completes in < 50 microseconds.
2. Deserialized data matches original exactly.
3. Buffer size is exactly 66,000 bytes.
4. No out-of-bounds access in stress tests.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smaller save files and faster loading of long campaigns.

