# Project Deep-Mantle :: Engineering Work Batch: BATCH-75

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 20:56:18`

### Batch Overview
This batch finalizes the simulation loop by implementing deterministic state hashing for save/load integrity, optimizing the tick scheduler for zero-allocation execution, and compressing the colonist psychology state machine into a bit-packed structure. These changes ensure 100% coverage of the endgame phase with minimal memory footprint and maximum determinism.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Heap Deterministic State Hasher (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateHasher.h`
  - `src/engine/core/StateHasher.cpp`
- **Architectural Specification**:
  1. Define struct StateHasher with static constexpr uint64_t ComputeHash(const void* data, size_t size).
2. Use FNV-1a algorithm for speed and determinism.
3. No dynamic allocation; use stack-based iteration.
4. Integrate with ez::Engine::SaveLoadSystem.
5. Ensure endianness consistency (little-endian).
6. Add static_assert for struct sizes.
7. Provide inline implementations for header-only usage.
8. Handle null pointers gracefully.
9. Return 0 for empty data.
10. Verify against known test vectors.
- **Acceptance Criteria**:
  1. Hash output is identical across all platforms.
2. No heap allocations during hashing.
3. Unit tests pass for 1000 random states.
4. Integration with SaveLoadSystem is seamless.
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load times and guaranteed deterministic replay.

#### [TASK-802] Bit-Packed Colonist Psychology State Machine (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/psychology/ColonistState.h`
  - `src/simulation/psychology/ColonistState.cpp`
- **Architectural Specification**:
  1. Define enum class PsychState : uint8_t { Idle, Working, Resting, Panicked }.
2. Create struct ColonistPsychState with bit-fields for state, priority, and timer.
3. Use std::bit_cast for type punning if needed.
4. Implement update() method with no branching where possible.
5. Pack state into 32-bit integer for cache efficiency.
6. Provide getters/setters for individual bits.
7. Ensure alignment to 4 bytes.
8. Add static_assert(sizeof(ColonistPsychState) == 4).
9. Integrate with TickScheduler.
10. Validate against existing 16,500 footsteps log.
- **Acceptance Criteria**:
  1. Struct size is exactly 4 bytes.
2. Update logic executes in < 10ns.
3. No cache misses in tight loops.
4. All 16,500 footsteps reproduce identically.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother simulation performance and consistent AI behavior.

#### [TASK-803] Deterministic Event Queue Compression (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/storyteller/EventQueue.h`
  - `src/storyteller/EventQueue.cpp`
- **Architectural Specification**:
  1. Define struct EventEntry with uint32_t id, uint16_t tick, uint8_t type.
2. Use std::array<EventEntry, 1024> for fixed-size queue.
3. Implement circular buffer logic with modulo arithmetic.
4. Add push() and pop() methods with bounds checking.
5. Use std::span for iteration.
6. Ensure no virtual functions.
7. Add static_assert for array size.
8. Provide reset() method.
9. Integrate with MainLoop.
10. Validate against 5,500 ticks.
- **Acceptance Criteria**:
  1. Queue size is fixed at 1024.
2. No heap allocations.
3. Push/Pop operations are O(1).
4. All 5,500 ticks processed without overflow.
- **Player Fun & Anti-Spreadsheet Impact**:
  Reduced memory usage and faster event processing.

