# Project Deep-Mantle :: Engineering Work Batch: BATCH-50

## Ultra-Endgame Ascension & Deterministic State Finalization (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 16:23:39`

### Batch Overview
Finalize the simulation loop by implementing deterministic state hashing for save/load integrity, optimizing the tick-based physics solver for zero-allocation stability, and compressing the storyteller narrative log into a fixed-size ring buffer. These steps ensure 100% coverage of the endgame state machine with minimal memory footprint.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Save/Load Integrity (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateHasher.h`
  - `Source/Engine/Core/StateHasher.cpp`
- **Architectural Specification**:
  1. Define a struct `StateHash` using `std::array<uint64_t, 4>` for 256-bit output.
2. Implement `ComputeHash(const SimulationState& state)` using a custom FNV-1a variant optimized for C++20 constexpr evaluation.
3. Ensure all primitive types (int, float, bool) are hashed in a fixed order.
4. Use `std::bit_cast` for float-to-int conversion to ensure bitwise determinism.
5. No dynamic allocation; use stack-based arrays for intermediate values.
6. Provide `operator==` for fast comparison.
7. Include `static_assert` for struct size alignment.
8. Handle null pointers as 0x00.
9. Integrate with `SimulationState::Serialize`.
10. Return `StateHash` by value.
- **Acceptance Criteria**:
  1. Hash output is identical across 1000 runs for the same state.
2. Zero heap allocations during hashing.
3. Compilation time < 100ms for the header.
4. Unit tests cover edge cases (empty state, max int).
- **Player Fun & Anti-Spreadsheet Impact**:
  Guarantees save/load consistency, preventing 'corrupted save' errors in long campaigns.

#### [TASK-802] Zero-Allocation Fixed-Step Physics Solver Optimization (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/Physics/FixedStepSolver.h`
  - `Source/Simulation/Physics/FixedStepSolver.cpp`
- **Architectural Specification**:
  1. Replace `std::vector` with `std::span` for entity lists.
2. Implement `Step(float dt)` using a fixed 1/60s timestep accumulator.
3. Use `__builtin_expect` for branch prediction hints on collision checks.
4. Pre-allocate all physics bodies in a contiguous `std::array<Body, MAX_BODIES>`.
5. Implement a simple AABB broad-phase using 1D sort-and-sweep.
6. Narrow-phase uses sphere-sphere and sphere-plane tests only.
7. No virtual functions; use template specialization for body types.
8. Cache inverse masses in the body struct.
9. Ensure `dt` is clamped to [0.0, 0.1] to prevent spiral of death.
10. Return `void` from `Step`.
- **Acceptance Criteria**:
  1. 10,000 bodies updated in < 1ms on i7-12700.
2. No heap allocations in the hot loop.
3. Deterministic results for identical inputs.
4. Passes all existing physics regression tests.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother frame rates and consistent physics behavior in large colonies.

#### [TASK-803] Fixed-Size Ring Buffer for Narrative Event Log (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Storyteller/NarrativeLog.h`
  - `Source/Storyteller/NarrativeLog.cpp`
- **Architectural Specification**:
  1. Define `struct Event { uint32_t id; uint16_t type; uint8_t priority; }`.
2. Implement `class NarrativeLog` with a `std::array<Event, 256>`.
3. Use a `uint8_t` index for circular buffer management.
4. `Push(Event)` overwrites the oldest entry if full.
5. `GetRecent(int count)` returns a `std::span` of the last N events.
6. No dynamic resizing; fixed capacity 256.
7. Use `constexpr` for buffer size.
8. Provide `Clear()` method.
9. Ensure thread-safe writes via atomic index if multi-threaded.
10. Integrate with `Storyteller::Update`.
- **Acceptance Criteria**:
  1. Memory usage is exactly 256 * sizeof(Event).
2. No fragmentation.
3. Fast access to recent events (< 10ns per lookup).
4. Correctly handles wrap-around.
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster UI updates for the event log, reducing stutter in the HUD.

