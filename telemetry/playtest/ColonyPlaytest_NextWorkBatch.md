# Project Deep-Mantle :: Engineering Work Batch: BATCH-76

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 21:08:38`

### Batch Overview
Finalize simulation coverage by implementing deterministic state hashing for rapid save/load verification, optimizing colonist psychology state machines for zero-allocation transitions, and integrating Vulkan compute shaders for parallel physics resolution. These tasks close the final gaps in performance and determinism.

---

### Prioritized Engineering Tasks

#### [TASK-801] Deterministic State Hashing for Save/Load Verification (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Runtime/Core/StateHash.h`
  - `Source/Runtime/Core/StateHash.cpp`
- **Architectural Specification**:
  Implement a 64-bit FNV-1a hash function for the core simulation state. Use constexpr where possible. The hash must be stable across compiler versions. Structure: struct StateHash { uint64_t value; }; Function: uint64_t ComputeStateHash(const SimulationState& state) noexcept. Iterate through all primitive members of SimulationState. No dynamic allocation. Use std::bit_cast for type punning if needed. Ensure endianness consistency by normalizing to little-endian before hashing.
- **Acceptance Criteria**:
  1. Hash is identical across 1000 runs of the same seed. 2. Zero heap allocations during hashing. 3. Compilation time < 100ms for the header.
- **Player Fun & Anti-Spreadsheet Impact**:
  Instant save/load verification, reducing perceived load times and ensuring deterministic replay reliability.

#### [TASK-802] Zero-Allocation Colonist Psychology State Machine (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Runtime/Simulation/ColonistPsychology.h`
  - `Source/Runtime/Simulation/ColonistPsychology.cpp`
- **Architectural Specification**:
  Refactor the psychology state machine to use a fixed-size array of state transitions. Define enum class PsychState : uint8_t. Use a static lookup table for transitions: static constexpr std::array<PsychState, 16> NextStateTable. Implement UpdatePsychology(Colonist& c) noexcept. No std::vector or std::string usage. Use std::span for input data. Ensure all state transitions are O(1). Handle overflow by clamping to max state index.
- **Acceptance Criteria**:
  1. 10,000 colonists updated in < 1ms. 2. No heap allocations in the update loop. 3. State transitions are deterministic and match previous batch results.
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother frame rates during large colony simulations, reducing stutter during peak activity.

#### [TASK-803] Vulkan Compute Shader for Parallel Physics Resolution (`P2 - Quality-of-Life`)

- **Domain**: `Graphics/Vulkan`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Runtime/Graphics/Vulkan/ComputePhysics.h`
  - `Source/Runtime/Graphics/Vulkan/ComputePhysics.cpp`
  - `Shaders/PhysicsResolve.comp`
- **Architectural Specification**:
  Implement a Vulkan compute shader to resolve collision constraints. Use a structured buffer for entity data. Shader: layout(local_size_x = 64) in; void main() { ... }. Host side: Create a 1D buffer for entity positions and velocities. Dispatch compute with group count = ceil(entityCount / 64). Use std::atomic for synchronization if needed, but prefer barrier() in shader. No CPU-side loop for collision resolution.
- **Acceptance Criteria**:
  1. Physics resolution 5x faster than CPU implementation for 1000 entities. 2. No synchronization stalls between compute and graphics queues. 3. Correct collision response verified against CPU reference.
- **Player Fun & Anti-Spreadsheet Impact**:
  Higher frame rates and more responsive physics interactions in complex scenes.

