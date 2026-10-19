# Project Deep-Mantle :: Engineering Work Batch: BATCH-64

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 18:42:36`

### Batch Overview
This batch finalizes the simulation loop by implementing deterministic state serialization for save/load integrity, optimizing the tick-based physics solver for cache locality, and introducing a lightweight psychological state machine for colonist behavior. These changes ensure 100% coverage of the core simulation loop with minimal memory footprint and zero heap allocations.

---

### Prioritized Engineering Tasks

#### [TASK-801] Deterministic State Compression Serializer (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateSerializer.h`
  - `src/engine/core/StateSerializer.cpp`
- **Architectural Specification**:
  Implement a zero-heap, stack-based serializer using C++20 concepts. Use a fixed-size buffer (4KB) for state snapshots. Define a concept `Serializable` requiring `static constexpr size_t Size` and `void Serialize(char* buffer) const`. The serializer iterates through a static array of pointers to `Serializable` objects, writing binary data directly to the buffer. No dynamic allocation. Handle endianness explicitly using `std::endian::native`. Ensure deterministic output by sorting member fields by offset before serialization.
- **Acceptance Criteria**:
  ['Serializer produces identical byte streams for identical state inputs across 1000 runs.', 'Zero heap allocations during serialization/deserialization.', 'Deserialization restores state exactly, verified by checksum comparison.', 'Compilation time < 2 seconds for the header.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Instant save/load times with no stuttering, ensuring seamless progression in long sessions.

#### [TASK-802] Cache-Optimized Tick Solver for 5,500+ Entities (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/sim/physics/TickSolver.h`
  - `src/sim/physics/TickSolver.cpp`
- **Architectural Specification**:
  Refactor the physics tick loop to use Structure-of-Arrays (SoA) layout for position, velocity, and acceleration. Implement a single-pass integration step using `std::span` for contiguous memory access. Use `__builtin_expect` for branch prediction hints on collision checks. Limit the solver to 60 lines of logic by using a fixed-step Euler integration with a pre-computed inverse timestep. No virtual functions; use template specialization for 2D vs 3D vectors.
- **Acceptance Criteria**:
  ['Physics tick completes in < 1ms for 5,500 entities.', 'Memory access patterns show 100% L1 cache hit rate in profiler.', 'No deadlocks or race conditions in single-threaded execution.', 'Deterministic results match previous batch outputs.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Smooth, consistent frame rates even with maximum entity counts, preventing lag spikes.

#### [TASK-803] Lightweight Colonist Psychological State Machine (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/ai/ColonistPsychology.h`
  - `src/ai/ColonistPsychology.cpp`
- **Architectural Specification**:
  Implement a finite state machine (FSM) for colonist psychology using a `std::array` of state transitions. States: IDLE, WORKING, RESTING, PANIC. Transitions are triggered by integer flags (e.g., `energy < 20`). Use a `constexpr` lookup table for state transitions to avoid branching. Each colonist holds a `uint8_t` current state and a `uint8_t` previous state. Logic is contained within a single `update()` function that processes all colonists in a tight loop.
- **Acceptance Criteria**:
  ['State transitions occur within 1 tick of condition fulfillment.', 'No memory leaks or dangling pointers.', 'FSM handles 5,500 colonists in < 0.5ms.', 'Unit tests cover all 4 states and 8 possible transitions.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Colonists react quickly and predictably to environmental changes, enhancing immersion.

