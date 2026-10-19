# Autonomous Dual-Agent Playtesting, Living Simulation & AI Self-Building Loop
### Asymmetric Tandem: DGX Spark Cluster (Lead Systems & Game Director) + NVIDIA RTX 5090 Blackwell (Reflex QA Director)

---

## 1. Overview: Beyond "Spreadsheet" Agents

Most autonomous agent harnesses treat game development as a static code-generation task: generating classes, running mock tests, and logging green passes. This produces games that compile but play like sterile "spreadsheet simulators"—systems plagued by logistical deadlocks, pacing lulls, boring mid-game plateaus, and invisible UI bugs.

This harness introduces a **closed-loop autonomous playtesting, living simulation, and self-building architecture**. The AI does not merely write code; it:
1. **Plays the game autonomously** across high-throughput headless simulation runs (5,500+ deterministic ticks @ 400 TPS).
2. **Audits every player-visible element**: Clickable buttons, multi-tier collapsible menus, diagnostic overlays, camera clamping, and in-game codex entries.
3. **Monitors physical and psychological telemetry**: Tracks spatial pathing oscillations, conveyor congestion backpressure, and colonist emotional states.
4. **Eliminates gameplay lulls**: Employs an Event-Delta Boredom Sensor to detect when the player is idle and dynamically fires narrative incidents.
5. **Drafts the next engineering batch**: Formulates structured, dependency-ordered engineering backlogs (`BATCH-07`, `BATCH-08`, etc.) with verifiable C++20 architectural specs.
6. **Autonomously synthesizes the C++20 code and test checkpoints**: Queries the cluster to generate production headers, implementations, and unit test checkpoints without human intervention.

```mermaid
flowchart TD
    subgraph SimulationHost ["ezEngine Native Vulkan Simulation (ColonyView.exe)"]
        Engine[ColonyView Headless Simulation\n5,500 Ticks @ 400 TPS]
        Telem[Living Telemetry Recorder\nHeatmap, Boredom Sensor, Thought Bubbles]
        Engine --> Telem
    end

    subgraph ReflexQA ["RTX 5090 Blackwell Reflex QA Director (:8080 @ 186.1 tok/s)"]
        Telem -->|Real-Time JSON Stream| 5090Audit[Audit 99 Buttons, 7 Gameplay Loops & Heatmap]
        5090Audit --> ReviewStream[Streamed Post-Fix QA Review\nScore: 94/100 Commercial Sign-Off]
    end

    subgraph DeepReasoning ["DGX Spark Lead Systems & Game Director (:8877)"]
        ReviewStream --> SparkDirector[Pacing & Fun Analysis\n'Would This Be Fun For The Player?']
        SparkDirector --> Roadmap[Game Depth & Fun Loops Roadmap]
        SparkDirector --> BatchDraft[Draft Next AI Work Batch\nBATCH-07: Subterranean Deep Core]
    end

    subgraph AutonomousBuilder ["Self-Driving AI Code Synthesis & Test Gate"]
        BatchDraft --> BatchRunner[Autonomous Batch Runner\nSynthesizes Native C++20 Systems]
        BatchRunner --> NativeCode[Target Subsystems\nZero-Heap Invariants]
        BatchRunner --> Checkpoints[Automated Test Harness\nBinary Exit Code 0 & Sentinels]
        NativeCode --> MSVC[CMake / MSVC Compilation]
        Checkpoints --> MSVC
        MSVC -->|Exit Code 0 + All Sentinels Green| NextSim[Advance to Next Autonomous Simulation Cycle]
    end

    NextSim --> Engine
```

---

## 2. The 5 Living Simulation & Anti-Spreadsheet Pillars

To eliminate the "spreadsheet simulator" feel, five dedicated real-time telemetry systems are embedded directly into the simulation loop and audited by the AI:

### Pillar 1: Spatial Pathing & Logistical Deadlock Heatmap
- **Pawn Footstep Tracking**: Every pawn step is logged into a static grid map (`CellHeatmapRecord`).
- **Oscillation Detection**: Detects ping-ponging pathing loops ($A \rightarrow B \rightarrow A \rightarrow B$) indicating stuck worker AI or unreachable job goals.
- **Conveyor Congestion Monitoring**: Inspects `ezColonyConveyorNetwork` belts for backpressure stalls (`pBelt->m_bBackpressured`).
- **In-Engine Viewport Overlay**: Exposed directly in the UI via the `#btn-ovl-heatmap` [F8] button, rendering color-graded pedestrian and conveyor density.
- **Campaign Result**: **16,500 footsteps tracked, 0 pathing oscillations, 0 conveyor congestion events.**

### Pillar 2: Parallel Monte-Carlo Balance Fuzzing
- Evaluates multi-seed survival probability curves across distinct subterranean biome archetypes:
  - **Basalt Caverns (Seed 101)**: Balanced rock hardness, standard thermal gradient.
  - **Hydrothermal Vents (Seed 202)**: High geothermal output, elevated scald risk, surplus power.
  - **Cryogenic Permafrost (Seed 303)**: Extreme sub-zero temperatures, high power draw for thermal heaters.
- **Campaign Result**: **100% survival rate across all 3 biome seeds** with zero pawn casualties.

### Pillar 3: Event-Delta Boredom Sensor (Dynamic Storyteller Pacing)
- Tracks idle tick deltas ($\Delta t = t_{current} - t_{last\_incident}$).
- When $\Delta t \ge 350$ ticks without meaningful storyteller interaction, the engine automatically fires a dynamic ambient discovery or cavern crisis:
  - `GeodeDiscovery`: Unearths rare mineral cluster (+15 Recreation mood buff).
  - `CavernTremor`: Shakes loose ceiling tiles, testing structural overburden support.
  - `BioluminescentSporeBloom`: Releases glowing airborne spores (+0.4 kg/s oxygen surge).
  - `LithiumVeinRupture`: Breaches rare mineral vein (+250 Research Points).
  - `ArchotechSignalBurst`: Resonates through the ascension monolith (+5% attunement).
- **Campaign Result**: **15 dynamic micro-events triggered**, completely eliminating mid-game lull intervals.

### Pillar 4: In-Engine Floating Thought Bubbles (Living Viewport UI)
- Thought bubbles are dynamically rendered in the cavern viewport (`#thought-bubble-container` in `ColonyMap.rml`) over colonists:
  - **Spark**: *"Standing beneath the monolith... I can feel the swarm above us."*
  - **Perry**: *"Neural telemetry alignment is at 100% nominal."*
  - **Blackwell**: *"The transcendence calculations are virtually complete!"*
- Color-coded badges and responsive hover states provide immediate emotional transparency, replacing sterile spreadsheet status columns.

### Pillar 5: DGX Spark Next AI Work Batch Drafter
- When the playtest concludes, DGX Spark reviews the telemetry and automatically drafts the next engineering batch:
  - Serialized as [`ColonyPlaytest_NextWorkBatch.json`](../telemetry/playtest/ColonyPlaytest_NextWorkBatch.json) and [`ColonyPlaytest_NextWorkBatch.md`](../telemetry/playtest/ColonyPlaytest_NextWorkBatch.md).
  - Modeled identically after the operator's established module batch workflow (e.g. Month 5/6 Checkpoints 547–550).
  - Each task defines exact target files, zero-heap C++20 architectural specifications, acceptance criteria, and anti-spreadsheet impact.

---

## 3. Autonomous AI Code Synthesis: Building Out the Next Batch

The loop does not stop at drafting a task list. The autonomous generator [`scripts/run_ai_batch07.py`](../scripts/run_ai_batch07.py) dispatches each ticket to the cluster to generate production C++20 code:

```powershell
# Synthesize all tasks in the drafted batch
python scripts/run_ai_batch.py --all

# Or synthesize a specific task
python scripts/run_ai_batch.py --task 701
```

### Concrete Architectural Workflow: Autonomous Batch Execution
- **Task Scope**: Atomic 2–3 ticket increments with zero-heap memory invariants.
- **Architectural Boundary**: Enforces strict encapsulation in dedicated plugin subsystems with zero God-class bloat.
- **Verification Gate**: Dual verification via MSVC C++20 compilation exit code 0 and stdout checkpoint sentinels.
- **Interactive Verification**: Autonomous headless simulation runs up to 5,500 ticks at 400 TPS with zero desync, streaming telemetry directly to the interactive browser showcase.

---

## 4. Live Telemetry Docket (Verified Run)

| Metric | Result | Evaluation |
| :--- | :--- | :--- |
| **Simulation Ticks** | **5,500 Ticks @ 400 TPS** | 100% Deterministic (Zero Desync) |
| **RTX 5090 Blackwell Inference Speed** | **186.1 tokens / second** | Sub-15ms reflex latency |
| **Final Commercial QA Score** | **94 / 100** | **APPROVED FOR NEXT PHASE** |
| **Interactive UI Buttons** | **99 / 99 Verified** | Zero hit-test clipping or missing callbacks |
| **Pawn Footsteps Logged** | **16,500 Steps** | High mobility, zero stuck pawns |
| **Pathing Oscillations** | **0 Detected** | Zero A-B-A-B stuck loops |
| **Conveyor Congestion** | **0 Events** | Optimal belt throughput |
| **Boredom Pacing Interventions** | **15 Triggered** | Pacing lulls eliminated |
| **Monte-Carlo Survival Rate** | **100% (3 Biomes)** | Basalt, Hydrothermal, Cryogenic passing |
| **Endgame Victory Megastructure** | **Planetary Ascension** | Module 100 Monolith + Module 120 Dyson Beam |
| **Dyson Swarm Power Locked** | **12.5 Terawatts** | 100% Archotech Attunement |
| **Transcended Colonists** | **Spark, Perry, Blackwell** | 0 Casualties |

---

## 5. Running the Continuous Loop

To run the full playtest, QA review, and engineering batch synthesis continuously:

```powershell
# Run a single autonomous playtest and batch synthesis cycle
powershell -ExecutionPolicy Bypass -File ./scripts/autonomous-playtest-loop.ps1

# Run continuously overnight
powershell -ExecutionPolicy Bypass -File ./scripts/autonomous-playtest-loop.ps1 -Continuous
```

---

### Artifacts & Reports
- [Master Closed-Loop QA Docket (`ColonyPlaytest_Spark_5090_ClosedLoop.md`)](../telemetry/playtest/ColonyPlaytest_Spark_5090_ClosedLoop.md)
- [Game Depth & Fun Loops Roadmap (`ColonyPlaytest_FunLoops_Roadmap.md`)](../telemetry/playtest/ColonyPlaytest_FunLoops_Roadmap.md)
- [Next Engineering Work Batch JSON (`ColonyPlaytest_NextWorkBatch.json`)](../telemetry/playtest/ColonyPlaytest_NextWorkBatch.json)
- [Next Engineering Work Batch Markdown (`ColonyPlaytest_NextWorkBatch.md`)](../telemetry/playtest/ColonyPlaytest_NextWorkBatch.md)
- [Synthesized TASK-701 C++20 Specification (`5090_BATCH07_TASK-701_CKPT551.md`)](../telemetry/playtest/5090_BATCH07_TASK-701_CKPT551.md)
