# Project Deep-Mantle :: Engineering Work Batch: BATCH-15

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 12:00:49`

### Batch Overview
Finalize simulation coverage by implementing deterministic state compression for long-running campaigns and optimizing the Monte Carlo convergence logic for ultra-endgame scenarios. This batch focuses on reducing memory footprint and ensuring 100% reproducibility in 5,500+ tick simulations.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Heap Deterministic State Hasher (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateHasher.h`
  - `Source/Engine/Core/StateHasher.cpp`
- **Architectural Specification**:
  struct StateHasher {
  static constexpr uint64_t kPrime = 1099511628211ULL;
  uint64_t m_Hash = 14695981039346656037ULL;
  
  constexpr void Update(uint64_t value) noexcept {
    m_Hash ^= value;
    m_Hash *= kPrime;
  }
  
  constexpr uint64_t GetHash() const noexcept {
    return m_Hash;
  }
};
- **Acceptance Criteria**:
  ['Hasher produces identical uint64_t for identical input sequences across 10,000 Monte Carlo runs.', 'Zero dynamic allocations during hashing phase.', 'Compile-time evaluation supported for static initial states.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Ensures save/load consistency and enables rapid state comparison for debugging.

#### [TASK-802] Optimize Footstep Log Compression for 5k+ Ticks (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/Physics/FootstepLog.h`
  - `Source/Simulation/Physics/FootstepLog.cpp`
- **Architectural Specification**:
  struct FootstepEntry {
  uint16_t m_Tick;
  uint8_t m_X, m_Y;
  uint8_t m_Flags;
};

struct FootstepLog {
  static constexpr size_t kMaxEntries = 16500;
  FootstepEntry m_Entries[kMaxEntries];
  size_t m_Count = 0;

  void Push(uint16_t tick, uint8_t x, uint8_t y, uint8_t flags) noexcept {
    if (m_Count < kMaxEntries) {
      m_Entries[m_Count++] = {tick, x, y, flags};
    }
  }
};
- **Acceptance Criteria**:
  ['Memory footprint reduced by 60% compared to previous std::vector implementation.', 'No heap fragmentation after 5,500 ticks.', 'Linear access time O(1) for sequential playback.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save file loading and reduced memory usage for long campaigns.

#### [TASK-803] Cache Monte Carlo Convergence Results (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/AI/Storyteller/MonteCarloCache.h`
- **Architectural Specification**:
  struct MCResult {
  uint64_t m_Hash;
  uint32_t m_SurvivalRate;
};

struct MCCache {
  static constexpr size_t kCacheSize = 1024;
  MCResult m_Cache[kCacheSize];
  size_t m_Size = 0;

  bool Find(uint64_t hash, uint32_t& outRate) const noexcept {
    for (size_t i = 0; i < m_Size; ++i) {
      if (m_Cache[i].m_Hash == hash) {
        outRate = m_Cache[i].m_SurvivalRate;
        return true;
      }
    }
    return false;
  }
};
- **Acceptance Criteria**:
  ['Cache hit rate > 85% for repetitive endgame scenarios.', 'Lookup time < 1 microsecond.', 'No invalidation issues with deterministic hashing.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Instantaneous response for repeated simulation steps in endgame.

