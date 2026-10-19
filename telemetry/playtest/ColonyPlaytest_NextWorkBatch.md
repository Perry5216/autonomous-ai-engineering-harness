# Project Deep-Mantle :: Engineering Work Batch: BATCH-70

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 19:57:45`

### Batch Overview
This batch finalizes the simulation loop by implementing deterministic state hashing for save/load integrity, optimizing the tick-based physics solver for 100% Monte Carlo survival, and introducing a lightweight psychological state machine for colonist morale. These atomic tasks close the final coverage gaps in simulation determinism and entity behavior.

---

### Prioritized Engineering Tasks

#### [TASK-801] Deterministic State Hashing for Save/Load Integrity (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateHash.h`
  - `Source/Engine/Core/StateHash.cpp`
- **Architectural Specification**:
  Implement a zero-heap, constexpr-friendly FNV-1a hash for the core simulation state struct. Use std::array for fixed-size state buffers. Ensure no dynamic allocation during hash computation. The hash must be stable across compiler versions and optimization levels. Integrate into the main loop as a post-tick validation step.
- **Acceptance Criteria**:
  ['Hash computation completes in < 1 microsecond for 10,000 entities.', 'Identical simulation runs produce identical hash values.', 'No heap allocations occur during hashing.', 'Unit tests verify hash stability across 1000 random seeds.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Guarantees 100% reproducible saves, eliminating 'desync' errors in long campaigns.

#### [TASK-802] Optimized Tick-Based Collision Solver (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/Physics/CollisionSolver.h`
  - `Source/Simulation/Physics/CollisionSolver.cpp`
- **Architectural Specification**:
  Refactor the collision solver to use a flat array of AABBs with a sweep-and-prune algorithm. Limit to 60 lines of core logic. Use std::span for data access. Remove recursive calls in favor of iterative processing. Ensure cache-friendly memory layout for entity positions and velocities.
- **Acceptance Criteria**:
  ['Collision detection for 5,000 entities completes in < 2ms.', 'Zero deadlocks in 10,000 simulation ticks.', 'Memory footprint reduced by 40% compared to previous batch.', 'All 16,500 logged footsteps match expected trajectories.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother frame rates and more accurate physics interactions in dense scenes.

#### [TASK-803] Lightweight Colonist Morale State Machine (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/AI/Colonist/MoraleState.h`
  - `Source/AI/Colonist/MoraleState.cpp`
- **Architectural Specification**:
  Implement a 3-state finite state machine (Idle, Working, Panicked) for colonist morale. Use enum class for states. Transitions are driven by simple integer counters (e.g., food level, noise level). No dynamic memory allocation. State changes trigger immediate visual feedback via a callback interface.
- **Acceptance Criteria**:
  ['State transitions occur within 1 tick of condition change.', 'No memory leaks detected in 5,500 tick run.', 'Visual feedback matches internal state 100%.', 'Code size under 60 lines per file.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Clearer visual cues for colonist status, aiding strategic decision-making.

