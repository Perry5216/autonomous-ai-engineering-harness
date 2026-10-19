# Project Deep-Mantle :: Engineering Work Batch: BATCH-37

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 14:43:38`

### Batch Overview
Finalize the simulation loop by implementing deterministic state hashing for rapid save/load verification and optimizing the tick-based event queue for zero-allocation processing. These steps ensure the 5,500-tick campaign state is reproducible and memory-efficient, closing the final gaps in system stability and performance.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Save Verification (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Runtime/Core/StateHash.h`
  - `Source/Runtime/Core/StateHash.cpp`
- **Architectural Specification**:
  1. Define `struct StateHash` with `uint64_t m_Hash`.
2. Implement `ComputeHash(const SimulationState& state)` using FNV-1a 64-bit algorithm.
3. Iterate through `state.m_Ticks`, `state.m_Colonists`, and `state.m_Resources`.
4. Use `std::span` for contiguous memory access to minimize cache misses.
5. Ensure no dynamic allocation during hash computation.
6. Return `StateHash` by value.
7. Add `operator==` for quick comparison.
8. Integrate into `SaveSystem::VerifyIntegrity`.
9. Handle null pointers in state structs gracefully.
10. Unit test with known 5,500-tick snapshot.
- **Acceptance Criteria**:
  Hash computation completes in <1ms for 5,500 ticks. Identical states produce identical hashes. No heap allocations during hashing.
- **Player Fun & Anti-Spreadsheet Impact**:
  Instant save/load verification, reducing perceived load times and ensuring save integrity.

#### [TASK-802] Zero-Allocation Tick Event Queue Optimization (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Runtime/Simulation/EventQueue.h`
  - `Source/Runtime/Simulation/EventQueue.cpp`
- **Architectural Specification**:
  1. Replace `std::vector<Event>` with `std::array<Event, 1024>`.
2. Implement circular buffer logic with `m_Head` and `m_Tail` indices.
3. Use `std::optional<Event>` for slot storage.
4. `PushEvent` uses modulo arithmetic for index wrapping.
5. `PopEvent` returns `std::optional<Event>`.
6. Pre-allocate all events in a static pool.
7. Remove `std::vector` dependencies from header.
8. Ensure `constexpr` support for array size.
9. Benchmark against previous vector implementation.
10. Verify no fragmentation in memory profiler.
- **Acceptance Criteria**:
  Memory footprint reduced by 40%. No heap allocations during tick processing. 100% deterministic order.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother frame rates during high-density simulation phases.

#### [TASK-803] Compact Colonist Psychology State Serialization (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Runtime/AI/ColonistState.h`
  - `Source/Runtime/AI/ColonistState.cpp`
- **Architectural Specification**:
  1. Pack `m_Hunger`, `m_Energy`, `m_Mood` into `uint8_t` fields.
2. Use bitfields for boolean flags (`m_IsWorking`, `m_IsIdle`).
3. Implement `SerializeToBuffer` using `memcpy` for struct.
4. Implement `DeserializeFromBuffer` with static_assert size checks.
5. Remove virtual functions from `ColonistState`.
6. Ensure alignment is 1 byte (`#pragma pack(1)`).
7. Add `static_assert(sizeof(ColonistState) == 8)`.
8. Update `SaveSystem` to use new struct.
9. Test with 16,500 footsteps log.
10. Verify backward compatibility with v1.1.0 saves.
- **Acceptance Criteria**:
  Struct size is exactly 8 bytes. Serialization is 2x faster. All 16,500 footsteps reconstruct correctly.
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save file loading and smaller save file sizes.

