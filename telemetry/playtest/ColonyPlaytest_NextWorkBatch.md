# Project Deep-Mantle :: Engineering Work Batch: BATCH-69

## Ultra-Endgame Ascension & Deterministic State Compression (Target: `v1.2.0`)

- **Architect**: `DGX Spark Cluster Lead Systems Engineer`
- **QA Verifier**: `RTX 5090 Blackwell Reflex QA Director`
- **Date**: `2026-10-19 19:45:01`

### Batch Overview
This batch focuses on finalizing the ultra-endgame simulation loop by implementing deterministic state compression for long-running sessions and optimizing the Monte Carlo survival rate calculation. These atomic tasks ensure memory stability and precise statistical reporting for the 5,500+ tick campaign, closing the final gaps in simulation fidelity and resource management.

---

### Prioritized Engineering Tasks

#### [TASK-801] Implement Zero-Heap Deterministic State Compressor (`P0 - Critical`)

- **Domain**: `Engine/C++20`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/core/StateCompressor.h`
  - `src/engine/core/StateCompressor.cpp`
- **Architectural Specification**:
  struct StateCompressor {
    static constexpr size_t MAX_TICKS = 8192;
    uint64_t m_hashChain[MAX_TICKS];
    uint32_t m_currentIndex = 0;

    void PushState(const uint64_t hash) {
        m_hashChain[m_currentIndex] = hash;
        m_currentIndex = (m_currentIndex + 1) % MAX_TICKS;
    }

    uint64_t GetDeterministicHash() const {
        uint64_t h = 0;
        for (uint32_t i = 0; i < MAX_TICKS; ++i) {
            h ^= m_hashChain[i];
            h = (h << 1) | (h >> 63);
        }
        return h;
    }
};
- **Acceptance Criteria**:
  ['StateCompressor uses zero heap allocations.', 'Hash chain updates in O(1) time.', 'Deterministic hash remains stable across identical tick sequences.', 'Memory footprint is exactly 64KB (8192 * 8 bytes).']
- **Player Fun & Anti-Spreadsheet Impact**:
  Ensures save/load consistency and reduces memory fragmentation during long campaigns.

#### [TASK-802] Optimize Monte Carlo Survival Rate Calculator (`P1 - High`)

- **Domain**: `Simulation/Physics`
- **Estimated Complexity**: `Small`
- **Target Files**:
  - `src/simulation/MonteCarloCalculator.h`
  - `src/simulation/MonteCarloCalculator.cpp`
- **Architectural Specification**:
  struct MonteCarloCalculator {
    static constexpr uint32_t SAMPLE_COUNT = 1000;
    float m_survivalRates[SAMPLE_COUNT];
    uint32_t m_sampleIndex = 0;

    void RecordSurvival(const bool survived) {
        m_survivalRates[m_sampleIndex] = survived ? 1.0f : 0.0f;
        m_sampleIndex = (m_sampleIndex + 1) % SAMPLE_COUNT;
    }

    float GetAverageSurvivalRate() const {
        float sum = 0.0f;
        for (uint32_t i = 0; i < SAMPLE_COUNT; ++i) {
            sum += m_survivalRates[i];
        }
        return sum / static_cast<float>(SAMPLE_COUNT);
    }
};
- **Acceptance Criteria**:
  ['Calculator maintains a fixed-size circular buffer of 1000 samples.', 'Average survival rate is computed in O(N) with N=1000.', 'No dynamic memory allocation during calculation.', 'Accuracy within 0.1% of reference implementation.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Provides immediate, accurate feedback on colony viability without performance hitches.

#### [TASK-803] Add Tick-Count Metadata to Save Files (`P2 - Quality-of-Life`)

- **Domain**: `Storyteller/AI`
- **Estimated Complexity**: `Atomic`
- **Target Files**:
  - `src/engine/save/SaveSerializer.h`
  - `src/engine/save/SaveSerializer.cpp`
- **Architectural Specification**:
  struct SaveMetadata {
    uint64_t m_tickCount;
    uint64_t m_timestamp;
    uint32_t m_version;

    void Serialize(std::vector<uint8_t>& buffer) const {
        buffer.insert(buffer.end(), 
            reinterpret_cast<const uint8_t*>(&m_tickCount),
            reinterpret_cast<const uint8_t*>(&m_tickCount) + sizeof(m_tickCount));
        buffer.insert(buffer.end(), 
            reinterpret_cast<const uint8_t*>(&m_timestamp),
            reinterpret_cast<const uint8_t*>(&m_timestamp) + sizeof(m_timestamp));
        buffer.insert(buffer.end(), 
            reinterpret_cast<const uint8_t*>(&m_version),
            reinterpret_cast<const uint8_t*>(&m_version) + sizeof(m_version));
    }
};
- **Acceptance Criteria**:
  ['Metadata is serialized at the start of the save file.', 'Deserialization correctly restores tick count and timestamp.', 'Backward compatibility with v1.1.0 saves is maintained via version check.', 'Serialization overhead is < 1ms.']
- **Player Fun & Anti-Spreadsheet Impact**:
  Allows players to track precise campaign duration and compare runs efficiently.

