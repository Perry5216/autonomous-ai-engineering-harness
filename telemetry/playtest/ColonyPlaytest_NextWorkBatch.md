# Project Deep-Mantle :: Engineering Work Batch: BATCH-43

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 15:29:23`

### Batch Overview
Finalize simulation coverage by implementing deterministic state compression for endgame snapshots and optimizing Monte Carlo convergence logic. This batch closes the last gaps in long-term stability and memory efficiency for the 5,500+ tick campaign.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Heap Deterministic State Compressor (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Engine/Core/StateCompressor.h`
  - `Source/Engine/Core/StateCompressor.cpp`
- **Architectural Specification**:
  struct CompressedState { uint64_t hash; uint32_t tick; uint16_t entityCount; alignas(8) uint8_t payload[256]; };

namespace ez {
  class StateCompressor {
  public:
    static constexpr size_t MaxPayloadSize = 256;
    
    struct Result {
      CompressedState state;
      bool success;
    };

    // Compresses raw simulation state into fixed-size struct. No heap allocs.
    static Result Compress(const void* rawData, size_t rawSize, uint32_t tick) noexcept;
    
    // Decompresses back to raw buffer. Returns bytes written.
    static size_t Decompress(const CompressedState& compressed, void* rawData, size_t maxRawSize) noexcept;
  };
}
- **Acceptance Criteria**:
  ['Compress/Decompress round-trip is bit-exact for 5,500 ticks.', 'Zero dynamic memory allocations during compression.', 'Compression ratio > 40% for typical entity states.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Faster save/load times and reduced memory footprint for long campaigns.

#### [TASK-802] Optimize Monte Carlo Convergence Check (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `Source/Simulation/MonteCarlo.h`
  - `Source/Simulation/MonteCarlo.cpp`
- **Architectural Specification**:
  namespace ez {
  struct MCStats {
    double mean;
    double variance;
    uint32_t samples;
    bool converged;
  };

  class MonteCarloIntegrator {
  public:
    // Updates stats incrementally. O(1) per sample.
    void AddSample(double value) noexcept;
    
    // Checks if variance < epsilon for last N samples.
    bool IsConverged(double epsilon, uint32_t windowSize = 100) const noexcept;
    
    // Returns current stats.
    MCStats GetStats() const noexcept;

  private:
    double m_sum = 0.0;
    double m_sumSq = 0.0;
    uint32_t m_count = 0;
    double m_lastValues[100] = {0}; // Ring buffer for window check
    uint32_t m_ringIndex = 0;
  };
}
- **Acceptance Criteria**:
  ['Convergence detected within 100 samples for stable systems.', 'No floating-point drift over 10,000 samples.', 'Ring buffer implementation uses stack-only memory.']
- **Player Fun & Anti-Spreadsheet Impact**:
  More accurate physics predictions and faster simulation steps.

#### [TASK-803] Cache Last 10 Footstep Events for UI (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `Source/Storyteller/FootstepCache.h`
- **Architectural Specification**:
  namespace ez {
  struct FootstepEvent {
    uint32_t tick;
    uint16_t entityId;
    uint8_t type; // 0=Move, 1=Interact, 2=Combat
    float x, y;
  };

  class FootstepCache {
  public:
    static constexpr size_t CacheSize = 10;
    
    void Push(const FootstepEvent& event) noexcept;
    
    // Returns pointer to array of last N events. N <= CacheSize.
    const FootstepEvent* GetLast(size_t& count) const noexcept;

  private:
    FootstepEvent m_events[CacheSize];
    size_t m_index = 0;
    size_t m_count = 0;
  };
}
- **Acceptance Criteria**:
  ['Cache holds exactly last 10 events.', 'GetLast returns correct order (oldest to newest).', 'No heap allocations.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Instant access to recent activity log in UI.

