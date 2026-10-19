# Project Deep-Mantle :: Engineering Work Batch: BATCH-60

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 17:57:32`

### Batch Overview
Following the successful completion of BATCH-59, the simulation has achieved stable high-depth operation. This batch focuses on the final optimization of the endgame state to ensure deterministic reproducibility and minimal memory footprint for long-running sessions. We are closing the gap between raw simulation data and efficient archival storage, while finalizing the psychological model for colonist adaptation to deep-mantle conditions.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Copy Deterministic State Hasher (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateHasher.h`
  - `src/engine/core/StateHasher.cpp`
- **Architectural Specification**:
  Create a constexpr-friendly struct `StateHasher` using `std::span<const uint8_t>` for input. Implement a custom FNV-1a variant optimized for 64-bit integers. Use `std::bit_cast` for type-punning. No dynamic allocation. The hasher must process the entire simulation state buffer in a single pass. Include a static assertion for endianness. Provide a `finalize()` method returning `uint64_t`. Ensure all operations are noexcept. Integrate with the existing `TickManager` to hash state every 100 ticks.
- **Acceptance Criteria**:
  ['Hasher produces identical `uint64_t` for identical state buffers across 1000 runs.', 'Zero heap allocations during hashing phase.', 'Compilation time < 50ms for the header.', 'Unit tests cover edge cases: empty buffer, single byte, max uint64.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Ensures save/load consistency and enables rapid state comparison for debugging and replay systems.

#### [TASK-802] Optimize Deep-Mantle Pressure Gradient Calculation (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/physics/PressureModel.h`
  - `src/simulation/physics/PressureModel.cpp`
- **Architectural Specification**:
  Refactor the pressure gradient calculation to use a precomputed lookup table for depth-to-pressure conversion. Define a `constexpr` array of 1024 entries mapping depth indices to pressure values. Implement a linear interpolation function `lerp` for intermediate depths. Use `std::array` for the lookup table. The main calculation function should take `uint16_t depth_index` and return `float pressure`. Remove all floating-point divisions in the hot path by using reciprocal constants. Ensure the table is generated at compile-time using `constexpr` loops.
- **Acceptance Criteria**:
  ['Lookup table generated at compile time.', 'Calculation time per tick reduced by >40% compared to BATCH-59.', 'No runtime initialization of the lookup table.', 'Accuracy within 1e-6 of reference values.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Smoother frame rates during deep exploration sequences, reducing stutter in high-depth zones.

#### [TASK-803] Compact Colonist Psychological State Bitfield (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/ai/colonist/PsychState.h`
- **Architectural Specification**:
  Define a `struct PsychState` using `uint32_t` bitfields for core attributes: `mood` (4 bits), `energy` (4 bits), `hunger` (4 bits), `thirst` (4 bits), `status_flags` (16 bits). Implement `constexpr` getters and setters using bitwise operations. Add a `to_string()` method that formats the state into a compact 16-character string for UI display. Ensure the struct is trivially copyable and fits within 4 bytes. Provide a `merge` function to combine two states using bitwise OR for flags and average for numeric values.
- **Acceptance Criteria**:
  ['Struct size is exactly 4 bytes.', 'All getters/setters are `constexpr` and `noexcept`.', 'UI display string is always 16 characters long.', 'No padding bytes in the struct.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster UI updates and clearer, more concise status indicators for colonists.

