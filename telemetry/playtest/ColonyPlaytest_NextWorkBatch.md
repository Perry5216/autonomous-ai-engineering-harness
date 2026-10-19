# Project Deep-Mantle :: Engineering Work Batch: BATCH-61

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 18:06:40`

### Batch Overview
Finalize the simulation loop by implementing deterministic state hashing for save/load integrity, optimizing the tick-based event queue for zero-allocation processing, and finalizing the colonist psychological state machine for endgame stability.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Heap Deterministic State Hashing (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateHash.h`
  - `src/engine/core/StateHash.cpp`
- **Architectural Specification**:
  1. Define struct StateHashContext with fixed-size arrays for stack-based hashing.
2. Implement FNV-1a 64-bit hash algorithm using constexpr where possible.
3. Provide inline functions for hashing primitive types (int, float, bool) and fixed-size strings.
4. Ensure no dynamic memory allocation (no std::vector, no new/delete).
5. Use std::span for contiguous memory access during hashing.
6. Add static_asserts for struct sizes to ensure cache-line alignment.
7. Implement a simple combine function for nested structures.
8. Ensure all functions are noexcept.
9. Provide a single entry point: ComputeStateHash(const void* data, size_t size).
10. Verify determinism across different compiler optimizations (O2, O3).
- **Acceptance Criteria**:
  ['Hash values are identical across 1000 runs with same input.', 'Zero heap allocations during hashing phase.', 'Compilation time < 100ms for header inclusion.', 'All unit tests pass with 100% coverage.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Ensures save/load consistency and prevents desyncs in multiplayer or replay modes.

#### [TASK-802] Optimize Tick-Based Event Queue with Ring Buffer (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/sim/core/EventQueue.h`
  - `src/sim/core/EventQueue.cpp`
- **Architectural Specification**:
  1. Define template class RingBuffer<T, N> with fixed capacity N.
2. Implement push_back and pop_front using index arithmetic (no modulo if possible, use bitmask for power-of-2 N).
3. Store events as packed structs (EventID, Tick, Data[16]).
4. Implement ProcessEvents(uint64_t currentTick) that processes all events <= currentTick.
5. Use std::array for storage to avoid heap fragmentation.
6. Add inline getters for size and capacity.
7. Ensure thread-safety via atomic indices if used in parallel contexts, otherwise single-threaded assumption.
8. Provide a Reset() method for quick state clearing.
9. Benchmark against std::deque for 10k events.
10. Ensure no virtual functions in the hot path.
- **Acceptance Criteria**:
  ['Processing 10,000 events takes < 1ms.', 'Memory footprint is exactly N * sizeof(Event) + overhead.', 'No memory leaks detected by Valgrind.', 'Correct ordering of events maintained.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Reduces frame time spikes during heavy simulation phases, improving smoothness.

#### [TASK-803] Finalize Colonist Psychological State Machine (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/ai/ColonistPsychology.h`
  - `src/ai/ColonistPsychology.cpp`
- **Architectural Specification**:
  1. Define enum class PsychState { Idle, Working, Resting, Panicked, Dead }.
2. Create struct PsychData with float values for Stress, Happiness, Energy.
3. Implement UpdatePsychology(PsychData& data, const Environment& env) as a pure function.
4. Use lookup tables for state transitions to avoid branching.
5. Clamp all float values to [0.0, 1.0] using std::clamp.
6. Ensure deterministic output for given inputs.
7. Add serialization support for PsychData.
8. Implement a simple decay function for Energy over ticks.
9. Provide a GetStateDescription() returning a const char*.
10. Ensure all functions are constexpr-friendly where possible.
- **Acceptance Criteria**:
  ['State transitions are deterministic and reproducible.', 'No floating-point drift after 10,000 ticks.', 'Serialization size is exactly 16 bytes per colonist.', 'Unit tests cover all state transitions.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Provides consistent and predictable colonist behavior, enhancing strategic planning.

