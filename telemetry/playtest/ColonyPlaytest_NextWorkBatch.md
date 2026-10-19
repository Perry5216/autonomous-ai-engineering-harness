# Project Deep-Mantle :: Engineering Work Batch: BATCH-25

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 13:15:23`

### Batch Overview
This batch focuses on finalizing the simulation loop by implementing deterministic state serialization for save/load integrity and optimizing the tick-based physics integration for ultra-endgame stability. These tasks close the final gaps in simulation coverage by ensuring reproducible state transitions and minimizing memory fragmentation during long-running sessions.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Save/Load Integrity (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateSerializer.h`
  - `src/engine/core/StateSerializer.cpp`
- **Architectural Specification**:
  Implement a zero-heap, constexpr-friendly state hasher using FNV-1a 64-bit algorithm. The serializer must traverse the component array linearly. Use std::span for contiguous memory access. No dynamic allocations during hashing. The hash must be stable across different compilation units if the struct layout is identical. Include a static_assert for struct size alignment. The implementation should fit within 40 lines of logic, focusing on the hash accumulation loop and the finalization step.
- **Acceptance Criteria**:
  ['Hash value is identical for the same state across 1000 runs.', 'No heap allocations occur during hashing.', 'Compilation time increases by < 5ms.', 'Unit tests pass for edge cases (empty state, max capacity).']
- **Player Fun & Anti-Spreadsheet Impact**:
  Ensures 100% reliable save/load functionality, preventing progress loss in long campaigns.

#### [TASK-802] Optimize Fixed-Step Integration for Ultra-Endgame Stability (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/physics/Integrator.h`
  - `src/simulation/physics/Integrator.cpp`
- **Architectural Specification**:
  Refactor the semi-implicit Euler integrator to use a fixed timestep of 1/60s. Implement a 'catch-up' loop for variable frame times using a while loop with a max iteration count of 4 to prevent spiral of death. Use float32 for all calculations to maintain cache locality. Store position and velocity in a packed struct. The logic should handle the accumulation of delta time and the step execution in under 50 lines. Ensure no floating-point drift by resetting the accumulator modulo the fixed step.
- **Acceptance Criteria**:
  ['Physics simulation remains stable at 10,000+ ticks.', 'No visible jitter in object movement.', 'Frame time variance is < 1ms.', 'Memory usage for physics state remains constant.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Provides smooth, predictable motion for all entities, enhancing the visual clarity of the simulation.

#### [TASK-803] Compact Event Log Buffer for Long-Running Sessions (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/storyteller/EventLog.h`
  - `src/storyteller/EventLog.cpp`
- **Architectural Specification**:
  Implement a circular buffer for the event log with a fixed capacity of 1024 entries. Use a struct with a 32-bit timestamp and a 16-bit event ID. The push operation should overwrite the oldest entry when full. Provide a method to retrieve the last N events using a simple index calculation. The implementation should be header-only if possible, or split into a minimal .cpp file. Total logic lines should not exceed 30. Ensure thread-safety is not required as the simulation is single-threaded.
- **Acceptance Criteria**:
  ['Memory footprint of the event log is constant.', 'Retrieval of the last 10 events is O(1).', 'No memory leaks detected in Valgrind.', 'Log entries are correctly ordered by timestamp.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Reduces memory usage in long campaigns, allowing for more complex entity counts without performance degradation.

