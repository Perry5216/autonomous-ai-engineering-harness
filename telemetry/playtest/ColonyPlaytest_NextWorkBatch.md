# Project Deep-Mantle :: Engineering Work Batch: BATCH-26

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 13:22:08`

### Batch Overview
Finalize the simulation loop by implementing deterministic state hashing for rapid save/load verification and optimizing the Monte Carlo convergence logic for the endgame phase. These tasks close the final gaps in state integrity and performance stability, ensuring the 5,500-tick campaign remains reproducible and efficient.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Save Verification (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateHash.h`
  - `src/engine/core/StateHash.cpp`
- **Architectural Specification**:
  1. Define struct `StateHash` with `uint64_t value`.
2. Implement `computeHash(const SimulationState& state)` using FNV-1a algorithm.
3. Iterate through all primitive members of `SimulationState`.
4. Combine hashes using bitwise XOR and multiplication.
5. Ensure no heap allocations during hash computation.
6. Return `StateHash` by value.
7. Add `operator==` for `StateHash`.
8. Add `operator!=` for `StateHash`.
9. Add `operator<<` for `StateHash`.
10. Mark functions as `constexpr` where possible.
11. Use `std::span` for member iteration.
12. Handle null pointers as 0.
13. Handle empty containers as 0.
14. Ensure deterministic order of iteration.
15. Validate against known test vectors.
16. Integrate into `SaveManager::verify()`.
17. Log hash mismatches as errors.
18. Return `std::optional<StateHash>`.
19. Use `std::monostate` for empty state.
20. Ensure C++20 compatibility.
21. No dynamic memory allocation.
22. Use `static_assert` for size checks.
23. Optimize for cache locality.
24. Minimize branch mispredictions.
25. Document all fields.
26. Add unit tests for edge cases.
27. Test with 5,500 tick state.
28. Verify reproducibility.
29. Check for overflow handling.
30. Finalize API.
- **Acceptance Criteria**:
  ['Hash computation is deterministic across runs.', 'No heap allocations during hashing.', 'Unit tests pass for known states.', 'Integration with SaveManager is seamless.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load verification and reliable state integrity checks.

#### [TASK-802] Optimize Monte Carlo Convergence for Endgame Phase (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/mc/ConvergenceOptimizer.h`
  - `src/simulation/mc/ConvergenceOptimizer.cpp`
- **Architectural Specification**:
  1. Define struct `MCResult` with `double mean`, `double variance`.
2. Implement `converge(const std::vector<double>& samples)`.
3. Use Welford's algorithm for online variance calculation.
4. Stop iteration when variance < epsilon (1e-6).
5. Return `MCResult` by value.
6. Handle empty vector as zero result.
7. Use `std::accumulate` for sum.
8. Precompute count for division.
9. Ensure no heap allocations in loop.
10. Use `constexpr` for epsilon.
11. Add `operator<<` for `MCResult`.
12. Validate input size.
13. Handle NaN inputs.
14. Integrate with `SimulationLoop`.
15. Log convergence step count.
16. Ensure thread safety.
17. Use `std::atomic` for counters.
18. Minimize cache misses.
19. Document algorithm steps.
20. Add unit tests for convergence.
21. Test with 16,500 samples.
22. Verify accuracy against reference.
23. Check performance gains.
24. Finalize API.
- **Acceptance Criteria**:
  ['Convergence achieved within 100 iterations for typical cases.', 'Variance calculation is numerically stable.', 'No heap allocations during convergence loop.', 'Integration with SimulationLoop is seamless.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster simulation ticks and more stable endgame results.

