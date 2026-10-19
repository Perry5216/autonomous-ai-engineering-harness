# Project Deep-Mantle :: Engineering Work Batch: BATCH-36

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 14:36:01`

### Batch Overview
This batch focuses on finalizing the simulation loop by implementing deterministic state hashing for save/load integrity, optimizing the tick-based physics solver for 100% Monte Carlo survival, and refining the storyteller AI's endgame narrative pacing. These atomic tasks ensure zero deadlocks and perfect reproducibility in the 5,500+ tick campaign.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Save/Load Integrity (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateHasher.h`
  - `Source/Engine/Core/StateHasher.cpp`
- **Architectural Specification**:
  1. Define `struct StateHash` with `uint64_t value`.
2. Implement `constexpr uint64_t FNV1aHash(const char* data, size_t len)`.
3. Create `class DeterministicState` with `std::array<uint64_t, 16> m_hashes`.
4. Add `void UpdateHash(const void* data, size_t len)` using FNV1a.
5. Ensure no heap allocations; use `std::span` for data access.
6. Provide `bool operator==(const DeterministicState&) const`.
7. Add `std::string_view ToString() const` for debug output.
8. Integrate into `TickSystem::Update()` post-physics.
9. Validate against 5,500 tick reference logs.
10. Zero cascading headers; include only `<cstdint>`, `<array>`, `<string_view>`.
- **Acceptance Criteria**:
  1. Hash value is identical across 100 Monte Carlo runs.
2. No heap allocations during hashing.
3. Compile time < 50ms for header inclusion.
4. Passes all 16,500 footstep log comparisons.
- **Player Fun & Anti-Spreadsheet Impact**:
  Guarantees perfect save/load reproducibility, eliminating 'ghost' desyncs in long campaigns.

#### [TASK-802] Optimize Tick-Based Physics Solver for Zero Deadlocks (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/Physics/TickSolver.h`
  - `Source/Simulation/Physics/TickSolver.cpp`
- **Architectural Specification**:
  1. Define `struct PhysicsState` with `float pos[3]`, `float vel[3]`.
2. Implement `void StepPhysics(PhysicsState& state, float dt)`.
3. Use `std::array<PhysicsState, 1024>` for static pool.
4. Add `bool IsStable(const PhysicsState& s)` with epsilon 1e-6.
5. Implement `void ResolveCollisions(std::span<PhysicsState>)`.
6. Ensure no recursion in collision resolution.
7. Add `uint32_t GetTickCount()` for debug.
8. Integrate with `StateHasher` from TASK-801.
9. Validate 100% survival rate in 5,500 ticks.
10. Zero heap allocations; use `std::span` for iteration.
- **Acceptance Criteria**:
  1. 0 deadlocks in 5,500 ticks.
2. 100% Monte Carlo survival rate.
3. Physics step time < 0.1ms per 1024 entities.
4. No floating-point drift beyond 1e-6.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smooth, predictable physics behavior with no stuttering or entity tunneling.

#### [TASK-803] Refine Endgame Narrative Pacing for 5,500+ Ticks (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Storyteller/EndgamePacer.h`
  - `Source/Storyteller/EndgamePacer.cpp`
- **Architectural Specification**:
  1. Define `enum class Phase { Early, Mid, Late, Ascension }`.
2. Implement `Phase GetPhase(uint32_t tick)` with thresholds 1000, 3000, 5000.
3. Create `struct NarrativeEvent` with `std::string_view text`.
4. Add `void EmitEvent(Phase p)` with static `std::array` of events.
5. Ensure no dynamic string allocation; use `std::string_view`.
6. Integrate with `TickSolver` tick count.
7. Add `bool IsAscensionComplete()` for final state.
8. Validate against 16,500 footstep logs.
9. Zero heap allocations; use `std::span` for event lists.
10. Include only `<cstdint>`, `<array>`, `<string_view>`.
- **Acceptance Criteria**:
  1. Correct phase transition at ticks 1000, 3000, 5000.
2. No heap allocations during event emission.
3. All 16,500 footstep logs match expected narrative beats.
4. Ascension phase triggers exactly at tick 5500.
- **Player Fun & Anti-Spreadsheet Impact**:
  Clear, timely narrative cues that enhance immersion without lag.

