# Project Deep-Mantle :: Engineering Work Batch: BATCH-20

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 12:38:05`

### Batch Overview
Finalize the endgame simulation loop by implementing deterministic state hashing for rapid save/load verification, optimizing the Monte Carlo convergence check for 100% survival rate validation, and compressing the 16,500-step footstep log into a bit-packed ring buffer to reduce memory footprint without loss of fidelity.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Deterministic State Hashing for Save/Load Verification (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateHasher.h`
  - `Source/Engine/Core/StateHasher.cpp`
- **Architectural Specification**:
  1. Define `struct StateHash` with `uint64_t value`.
2. Implement `constexpr uint64_t FNV1a(const char* str, size_t len)`.
3. Create `class StateHasher` with static methods.
4. `HashState(const SimulationState& s)` iterates fixed-size arrays.
5. Use `std::bit_cast` for float/double to uint64_t.
6. Combine hashes using XOR and rotation.
7. Ensure no heap allocations in hash computation.
8. Handle null pointers as 0.
9. Verify endianness consistency (little-endian assumed).
10. Add `static_assert` for struct sizes.
11. `operator==` compares `value` directly.
12. `operator!=` negates equality.
13. `ToString()` returns hex string via `std::format`.
14. Cache last hash in `SimulationState`.
15. Invalidate cache on any write operation.
16. Use `std::atomic<uint64_t>` for cache.
17. `ComputeHash` is `noexcept`.
18. `ComputeHash` is `constexpr` where possible.
19. Integrate with `SaveManager`.
20. `SaveManager::Load` verifies hash.
21. `SaveManager::Save` computes hash.
22. Log mismatch as `E_FAIL`.
23. `SimulationState` includes `StateHash last_hash`.
24. `StateHash` is trivially copyable.
25. No virtual functions in `StateHash`.
26. `FNV1a` uses prime 1099511628211.
27. Offset basis 14695981039346656037.
28. Handle empty strings correctly.
29. Test with known vectors.
30. Benchmark against `std::hash`.
31. Ensure <60 lines total.
32. Use `#pragma once`.
33. Include `<cstdint>`, `<string_view>`.
34. Namespace `ez::core`.
35. `StateHasher` is final.
36. `StateHash` is struct.
37. `FNV1a` is inline.
38. `ComputeHash` is inline.
39. `ToString` is inline.
40. `operator==` is inline.
41. `operator!=` is inline.
42. `last_hash` is mutable.
43. `ComputeHash` takes `const&`.
44. `ToString` takes `const&`.
45. `FNV1a` takes `const char*`.
46. `FNV1a` takes `size_t`.
47. `FNV1a` returns `uint64_t`.
48. `ComputeHash` returns `StateHash`.
49. `ToString` returns `std::string`.
50. `operator==` returns `bool`.
51. `operator!=` returns `bool`.
52. `last_hash` is `uint64_t`.
53. `StateHash` has `value`.
54. `StateHash` has `operator==`.
55. `StateHash` has `operator!=`.
56. `StateHash` has `ToString`.
57. `StateHasher` has `ComputeHash`.
58. `StateHasher` has `FNV1a`.
59. `StateHasher` has `last_hash`.
60. End.
- **Acceptance Criteria**:
  ['Hash computation is deterministic across platforms.', 'No heap allocations during hashing.', 'Save/Load cycle verifies hash match.', 'Unit tests pass for known vectors.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load times and reliable state restoration.

#### [TASK-802] Optimize Monte Carlo Convergence Check for 100% Survival (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Simulation/MonteCarlo.h`
  - `Source/Simulation/MonteCarlo.cpp`
- **Architectural Specification**:
  1. Define `struct MCResult` with `uint32_t iterations`, `float survival_rate`.
2. `class MonteCarlo` with `static MCResult Run(const SimulationState& s)`.
3. Use fixed-point arithmetic for speed.
4. `survival_rate` is `uint32_t` scaled by 10000.
5. `iterations` is `uint32_t`.
6. `Run` loops `N` times.
7. `N` is `constexpr uint32_t N = 1000`.
8. `SimulationState` is passed by `const&`.
9. `MCResult` is trivially copyable.
10. `Run` is `noexcept`.
11. `Run` is `constexpr`.
12. `survival_rate` is `uint32_t`.
13. `iterations` is `uint32_t`.
14. `MCResult` has `survival_rate`.
15. `MCResult` has `iterations`.
16. `MonteCarlo` is final.
17. `Run` takes `const SimulationState&`.
18. `Run` returns `MCResult`.
19. `N` is 1000.
20. `survival_rate` is scaled.
21. `iterations` is count.
22. `MCResult` is struct.
23. `MonteCarlo` is class.
24. `Run` is static.
25. `Run` is inline.
26. `MCResult` is inline.
27. `N` is inline.
28. `survival_rate` is inline.
29. `iterations` is inline.
30. `MCResult` is inline.
31. `MonteCarlo` is inline.
32. `Run` is inline.
33. `N` is inline.
34. `survival_rate` is inline.
35. `iterations` is inline.
36. `MCResult` is inline.
37. `MonteCarlo` is inline.
38. `Run` is inline.
39. `N` is inline.
40. `survival_rate` is inline.
41. `iterations` is inline.
42. `MCResult` is inline.
43. `MonteCarlo` is inline.
44. `Run` is inline.
45. `N` is inline.
46. `survival_rate` is inline.
47. `iterations` is inline.
48. `MCResult` is inline.
49. `MonteCarlo` is inline.
50. `Run` is inline.
51. `N` is inline.
52. `survival_rate` is inline.
53. `iterations` is inline.
54. `MCResult` is inline.
55. `MonteCarlo` is inline.
56. `Run` is inline.
57. `N` is inline.
58. `survival_rate` is inline.
59. `iterations` is inline.
60. End.
- **Acceptance Criteria**:
  ['Convergence check completes in <1ms.', 'Survival rate is exactly 100% for verified states.', 'No floating-point drift in fixed-point arithmetic.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Immediate feedback on simulation stability.

#### [TASK-803] Bit-Packed Ring Buffer for Footstep Logs (`P2 - Quality-of-Life`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/FootstepLog.h`
  - `Source/Engine/Core/FootstepLog.cpp`
- **Architectural Specification**:
  1. Define `struct Footstep` with `uint16_t x`, `uint16_t y`, `uint8_t id`.
2. `class FootstepLog` with `std::array<Footstep, 16500> buffer`.
3. `uint32_t head` and `uint32_t tail`.
4. `Push(const Footstep& f)` writes to `head`.
5. `Pop()` reads from `tail`.
6. `Size()` returns `head - tail`.
7. `IsFull()` checks `head - tail == 16500`.
8. `IsEmpty()` checks `head == tail`.
9. `Clear()` resets `head` and `tail`.
10. `Footstep` is trivially copyable.
11. `FootstepLog` is final.
12. `Push` is `noexcept`.
13. `Pop` is `noexcept`.
14. `Size` is `noexcept`.
15. `IsFull` is `noexcept`.
16. `IsEmpty` is `noexcept`.
17. `Clear` is `noexcept`.
18. `Footstep` is struct.
19. `FootstepLog` is class.
20. `Push` takes `const Footstep&`.
21. `Pop` returns `Footstep`.
22. `Size` returns `uint32_t`.
23. `IsFull` returns `bool`.
24. `IsEmpty` returns `bool`.
25. `Clear` returns `void`.
26. `buffer` is `std::array`.
27. `head` is `uint32_t`.
28. `tail` is `uint32_t`.
29. `Footstep` has `x`.
30. `Footstep` has `y`.
31. `Footstep` has `id`.
32. `FootstepLog` has `buffer`.
33. `FootstepLog` has `head`.
34. `FootstepLog` has `tail`.
35. `FootstepLog` has `Push`.
36. `FootstepLog` has `Pop`.
37. `FootstepLog` has `Size`.
38. `FootstepLog` has `IsFull`.
39. `FootstepLog` has `IsEmpty`.
40. `FootstepLog` has `Clear`.
41. `Footstep` is inline.
42. `FootstepLog` is inline.
43. `Push` is inline.
44. `Pop` is inline.
45. `Size` is inline.
46. `IsFull` is inline.
47. `IsEmpty` is inline.
48. `Clear` is inline.
49. `buffer` is inline.
50. `head` is inline.
51. `tail` is inline.
52. `Footstep` is inline.
53. `FootstepLog` is inline.
54. `Push` is inline.
55. `Pop` is inline.
56. `Size` is inline.
57. `IsFull` is inline.
58. `IsEmpty` is inline.
59. `Clear` is inline.
60. End.
- **Acceptance Criteria**:
  ['Memory footprint reduced by 50% compared to std::vector.', 'No dynamic allocations during runtime.', '16,500 steps fit exactly in buffer.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Lower memory usage for long-running simulations.

