# Project Deep-Mantle :: Engineering Work Batch: BATCH-21

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 12:45:03`

### Batch Overview
This batch finalizes the simulation core by implementing deterministic state hashing for rapid save/load verification and introducing a lightweight, stack-based psychological state machine for colonist decision-making. These additions close the final gaps in simulation determinism and AI responsiveness without introducing heap fragmentation or cascading header dependencies.

---

### Prioritized Engineering Tasks

#### [TASK-801] Deterministic State Hashing for Save/Load Verification (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateHasher.h`
  - `Source/Engine/Core/StateHasher.cpp`
- **Architectural Specification**:
  Implement a constexpr-friendly, non-recursive hash function using FNV-1a 64-bit. The hasher must accept a contiguous span of POD structs representing the world state. Use std::span<const uint8_t> for input. No dynamic allocation. The hash must be stable across different compiler versions (C++20 standard). Include a static_assert for struct alignment. Provide a single inline function `ComputeStateHash` that iterates through the span, mixing bits using standard FNV constants. Ensure the function is `noexcept` and `constexpr` where possible. Handle endianness explicitly using `std::endian::native` checks. The output is a single `uint64_t`. This allows rapid comparison of simulation states for determinism checks in Monte Carlo runs.
- **Acceptance Criteria**:
  ['Hash function produces identical uint64_t for identical state spans across 1000 Monte Carlo runs.', 'Zero heap allocations during hashing.', 'Compilation time < 100ms for the header.', 'Static asserts pass for alignment and size.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Instant save/load verification, ensuring no desyncs in long-running simulations.

#### [TASK-802] Stack-Based Colonist Psychological State Machine (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/AI/ColonistPsych.h`
  - `Source/Simulation/AI/ColonistPsych.cpp`
- **Architectural Specification**:
  Define a fixed-size array of 16 `PsychState` structs. Each struct contains: `uint8_t id`, `float urgency`, `uint8_t priority`. Implement a linear scan update loop. No virtual functions. Use `std::array` for storage. The state machine transitions based on simple numeric thresholds (e.g., if hunger > 0.8, set state to EAT). All logic is inline in the header for cache locality. Provide a `Update(float dt)` method that iterates through the active states. Use `__builtin_expect` for branch prediction hints on common states. Ensure the struct is 16-byte aligned for SIMD-friendly processing. No pointers in the struct. This replaces the previous heap-allocated state list.
- **Acceptance Criteria**:
  ['State transitions occur within 1 tick.', 'Memory footprint per colonist < 64 bytes.', 'No virtual dispatch overhead.', '100% survival rate maintained in 5,500 tick test.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster AI decision-making, leading to more responsive colonist behavior in dense scenes.

#### [TASK-803] Compact Event Log Ring Buffer (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Storyteller/EventLog.h`
- **Architectural Specification**:
  Implement a circular buffer of 1024 `Event` structs. Each `Event` is 32 bytes: `uint64_t timestamp`, `uint32_t type_id`, `uint32_t payload`. Use `std::array<Event, 1024>`. Provide `Push` and `Pop` methods. `Push` overwrites the oldest entry if full. `Pop` returns the oldest entry. Use index arithmetic with modulo 1024 (power of two optimization). All methods are `inline`. No dynamic allocation. This log is used for the final ascension summary. Ensure thread-safety is not required as the simulation is single-threaded in this phase. Provide a `GetRecentEvents(int count)` method that returns a `std::span<const Event>`.
- **Acceptance Criteria**:
  ['Ring buffer wraps correctly after 1024 events.', 'Zero heap allocations.', 'Access time O(1) for push/pop.', 'Span return is valid for the lifetime of the buffer.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Quick review of key simulation events in the endgame summary screen.

