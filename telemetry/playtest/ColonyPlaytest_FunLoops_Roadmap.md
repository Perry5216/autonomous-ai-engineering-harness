# Project Deep-Mantle :: Game Depth & Fun Loops Roadmap

- **Author**: DGX Spark Lead Systems & Game Designer
- **Reviewed by**: RTX 5090 Blackwell Commercial QA Director
- **Date**: `2026-10-19 19:07:58`

---

# Project Deep-Mantle :: Game Depth, Eras, Map Gen & Fun Loops Blueprint

## 1. Executive Design Thesis: Depth vs. The Spreadsheet Trap

**The Core Conflict:** In subterranean simulation, "Depth" is often conflated with "Data Density." A spreadsheet has depth (rows/columns) but lacks *fun* (narrative tension). Project Deep-Mantle aims for **Systemic Emergence**: where simple rules create complex, readable outcomes.

**The Anti-Spreadsheet Check:**
*   **Spreadsheet:** "Steel count is 23,985." (Static, low dopamine).
*   **Deep-Mantle Fun:** "The aquifer burst! The steel supports groan as the water level rises 2 meters per second. The colonists are slipping on wet stone. The pressure gauge needle is trembling." (Dynamic, visceral, urgent).

**Thesis:** Depth is achieved not by adding more numbers, but by adding **causal chains**. A change in Era 0 lighting must visibly alter Era 4 energy efficiency. A fault line in Map Gen must dictate the layout of the Era 2 conveyor belt.

---

## 2. Systematic Era-by-Era Depth Evaluation

### Era 0: Primitive Cavern Dwellers
*Context: Flint tools, torchlight, spore forage, rough dugouts, rockfall fear.*

1.  **CAN I ADD MORE DEPTH?**
    *   **Yes.** Introduce **Acoustic Propagation** and **Light Decay**.
    *   *Mechanic:* Sound travels differently through basalt vs. sandstone. Light intensity drops non-linearly with distance.
2.  **IF SO, WHY?**
    *   **Causality:** In a cave, sight is limited. Sound becomes the primary navigation tool. A rockfall isn't just a number; it’s a *boom* that echoes, revealing the size of the chamber.
    *   **Emergence:** Players learn to "listen" to the map. A hollow echo means a large cavern (good for farming); a dead thud means solid rock (good for foundations).
3.  **IS IT FUN?**
    *   **Yes.** It creates a tactile, sensory loop. The "click" of flint and the "hiss" of torches provide immediate feedback. It feels like exploring, not calculating.

### Era 1: Medieval Strata Fortification
*Context: Stone masonry, gravity aqueducts, mushroom brewing taverns, structural arches.*

1.  **CAN I ADD MORE DEPTH?**
    *   **Yes.** Introduce **Load-Bearing Visualization** and **Hydrostatic Pressure Gradients**.
    *   *Mechanic:* Arches distribute weight visibly (color-coded stress). Water flows strictly by height difference, creating natural "rivers" in the cave.
2.  **IF SO, WHY?**
    *   **Causality:** Masonry is about geometry. If an arch is too flat, it collapses. If water is too high, it floods. This forces players to think in 3D space, not just grid slots.
    *   **Emergence:** A well-placed arch allows a taller ceiling, which allows more light, which boosts mushroom growth. One decision cascades.
3.  **IS IT FUN?**
    *   **Yes.** The "snap" of a completed arch and the "splash" of water filling a basin are satisfying. It’s like solving a physical puzzle.

### Era 2: Industrial Subterranean Mechanization
*Context: Steam boilers, conveyors, inserters, shockwave pistons, mining elevators.*

1.  **CAN I ADD MORE DEPTH?**
    *   **Yes.** Introduce **Vibration Resonance** and **Thermal Gradient Efficiency**.
    *   *Mechanic:* Conveyor belts vibrate. If frequency matches the rock’s natural frequency, the cave shakes (minor collapse risk). Steam pressure affects piston speed.
2.  **IF SO, WHY?**
    *   **Causality:** Factorio’s belts are static. Deep-Mantle’s belts are *physical*. Vibration causes noise, which disturbs fungal growth (Era 0 link). Heat from boilers warms nearby water, changing its viscosity.
    *   **Emergence:** Players must balance speed (throughput) with stability (vibration). Fast belts = shaky caves = more rockfalls.
3.  **IS IT FUN?**
    *   **Yes.** The rhythmic *chug-chug-chug* of pistons and the *whir* of belts create a hypnotic, industrial trance. Watching a complex chain of inserters work perfectly is deeply satisfying.

### Era 3: Spacer High-Tech Cybernetics
*Context: SOEC electrolysis, Tokamak fusion, bionics, cryogenic stasis, energy shielding.*

1.  **CAN I ADD MORE DEPTH?**
    *   **Yes.** Introduce **Quantum Tunneling Logistics** and **Stasis Time Dilation**.
    *   *Mechanic:* Energy shielding reduces heat loss. Cryogenic stasis pauses individual pawn timers but accelerates global research.
2.  **IF SO, WHY?**
    *   **Causality:** High-tech allows for "non-local" interactions. A shielded room maintains temperature without walls. Stasis allows for "batch processing" of research.
    *   **Emergence:** Players optimize for *time* rather than just *space*. A stasis pod allows a pawn to "skip" a slow growth phase, syncing them with a faster research cycle.
3.  **IS IT FUN?**
    *   **Yes.** The "whoosh" of teleportation and the "hum" of fusion reactors feel powerful. It’s like upgrading from a bicycle to a jet. The pace quickens, creating a "flow state."

### Era 4: Deep Mantle Archotech & Transcendence
*Context: Superconducting busbars, hydraulic core hydrofracturing, harmonic resonance miners, ascension monolith.*

1.  **CAN I ADD MORE DEPTH?**
    *   **Yes.** Introduce **Harmonic Convergence** and **Mantle Memory**.
    *   *Mechanic:* The Monolith "remembers" the cave’s shape. Resonance miners "sing" to the rock, splitting it along natural fault lines.
2.  **IF SO, WHY?**
    *   **Causality:** The cave is no longer a container; it’s a participant. The Monolith integrates the map’s geology into the colony’s logic.
    *   **Emergence:** The entire map becomes a single, living organism. A crack in one corner resonates through the whole system.
3.  **IS IT FUN?**
    *   **Yes.** It feels like "god mode" but earned. The visual spectacle of glowing busbars and singing rocks is awe-inspiring. The final "Ascension" is a crescendo of all previous systems.

---

## 3. Subterranean Map Generation & Geological Stratification Depth

### 3.1 Geological Crust Stratification & Mineral Seams
*   **Depth:** Layers are not just bands; they are *interlocking puzzles*. Basalt (hard) sits on Granite (medium) on Sandstone (soft).
*   **Why:** Drilling through Basalt is slow but stable. Sandstone is fast but prone to collapse. Players must choose: "Do I dig fast through sand, risking collapse, or slow through basalt, saving time later?"
*   **Fun:** The "crunch" of drilling through different layers provides auditory feedback. Finding a silver vein in granite feels like a treasure hunt.

### 3.2 Organic Cavern Contours, Cellular Autotiling & Voronoi Topography
*   **Depth:** Caves are not rectangular. They are Voronoi cells with organic, irregular walls.
*   **Why:** This forces 3D thinking. A "corner" in a Voronoi cell is not 90 degrees; it’s a curved alcove. This affects light reflection and sound echo.
*   **Fun:** Exploring a non-linear cave feels like a real adventure. The "reveal" of a hidden chamber behind a curved wall is a classic exploration reward.

### 3.3 Geotechnical Fault Lines, Subsidence & Overburden Stress Mechanics
*   **Depth:** Faults are *active*. They shift slightly over time. Subsidence creates "pools" of water.
*   **Why:** The map is dynamic. A fault line might open a new passage (good) or collapse a tunnel (bad). This creates urgency.
*   **Fun:** Watching a fault line "breathe" (expand/contract) is mesmerizing. The sudden "crack" of a subsidence event is a sharp, attention-grabbing cue.

### 3.4 Subterranean Biomes & Extreme Environments
*   **Depth:** Fungal forests glow. Hydrothermal geysers pulse. Cryogenic pockets freeze air.
*   **Why:** Each biome has a unique "rhythm." Fungi grow in pulses. Geysers erupt on a timer. This creates a "metronome" for the colony.
*   **Fun:** The visual contrast (glowing blue fungi vs. orange magma) is stunning. The rhythmic eruption of geysers is hypnotic.

### 3.5 Multi-Z Vertical Topography & Fluid Dynamics
*   **Depth:** Water flows *down*. Magma rises *up*. They interact at the interface.
*   **Why:** This creates natural "layers" of activity. Top: Light/Fungi. Middle: Water/Industry. Bottom: Magma/Heat.
*   **Fun:** The "steam" effect when water hits magma is visually rich. The "clink" of water droplets in a cold pocket is crisp.

---

## 4. Cross-Examining the Titans: RimWorld, Dwarf Fortress & Factorio Loops

### 4.1 RimWorld Loops (Colonist Psychology, Room Impressiveness, Social Dynamics, Storyteller AI)
*   **Depth:** Add **Sensory Memory**. Pawns remember the *sound* of a room. A noisy room causes stress. A quiet, glowing room causes calm.
*   **Why:** This links Map Gen (Voronoi acoustics) to Pawn Psychology. A well-designed room is not just "pretty"; it’s *acoustically optimized*.
*   **Fun:** The "ding" of a satisfied pawn and the "sigh" of a stressed one are clear, immediate feedback. It feels like caring for pets.

### 4.2 Dwarf Fortress Loops (Pressurized Fluids, Overburden Cave-Ins, Strange Moods, Localized Trauma)
*   **Depth:** Add **Material Fatigue**. Steel gets tired. Stone cracks.
*   **Why:** This creates a "lifecycle" for structures. Players must "refresh" their colony by replacing old parts. It’s like a living organism.
*   **Fun:** The "snap" of a broken beam and the "splash" of a flooded room are dramatic. It’s like watching a domino chain.

### 4.3 Factorio Loops (High-Throughput Logistics, Power Cascades, Vibration-Driven Hive Aggression)
*   **Depth:** Add **Harmonic Interference**. Belts interfere with each other if too close.
*   **Why:** This forces spatial optimization. Players must "tune" their factory like an instrument.
*   **Fun:** The "whir" of a perfectly tuned factory is a symphony. The "click" of a completed circuit is a reward.

---

## 5. The 'Anti-Spreadsheet' Fun & Depth Scoring Matrix

| System | Depth /10 | Fun /10 | Cognitive Overhead /10 | Feedback Mechanism | Verdict |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Era 0: Acoustic Propagation** | 8 | 9 | 3 | Echoes reveal cave size. | **Keep.** High joy, low effort. |
| **Era 1: Load-Bearing Viz** | 9 | 8 | 5 | Color-coded stress lines. | **Keep.** Visual clarity is key. |
| **Era 2: Vibration Resonance** | 7 | 7 | 6 | Shaking screen, hum. | **Keep.** Adds tactile feel. |
| **Era 3: Stasis Time Dilation** | 8 | 6 | 7 | Progress bars speed up. | **Keep.** Good for pacing. |
| **Era 4: Harmonic Convergence** | 10 | 9 | 4 | Glowing monolith, song. | **Keep.** Awe-inspiring finale. |
| **Map Gen: Voronoi Topography** | 9 | 8 | 5 | Organic shapes, light play. | **Keep.** Beautiful and functional. |
| **Map Gen: Fluid Dynamics** | 8 | 9 | 4 | Water flows, steam rises. | **Keep.** Very satisfying. |
| **RimWorld: Sensory Memory** | 7 | 8 | 3 | Pawn mood icons change. | **Keep.** Simple, effective. |
| **DF: Material Fatigue** | 6 | 5 | 6 | Cracks appear, parts break. | **Simplify.** Too many numbers. |
| **Factorio: Harmonic Interference** | 8 | 7 | 5 | Belts slow down, hum changes. | **Keep.** Good puzzle element. |

---

## 6. Prioritized C++20 Module Backlog for Next Engineering Sprints

1.  **`Module: AcousticEngine`**
    *   Implement Voronoi-based sound propagation.
    *   *Task:* Calculate echo delay based on cell distance.
    *   *Output:* `std::vector<EchoEvent>` with intensity and delay.

2.  **`Module: FluidSim`**
    *   Implement hydrostatic pressure gradients.
    *   *Task:* Update water levels based on height difference.
    *   *Output:* `float` pressure per cell.

3.  **`Module: StructuralStress`**
    *   Implement load-bearing visualization.
    *   *Task:* Calculate stress on arches and walls.
    *   *Output:* `Color` gradient for UI overlay.

4.  **`Module: PawnSensory`**
    *   Implement sensory memory for pawns.
    *   *Task:* Store last 3 acoustic/visual inputs per pawn.
    *   *Output:* `MoodModifier` based on sensory history.

5.  **`Module: HarmonicTuning`**
    *   Implement vibration interference for belts.
    *   *Task:* Calculate frequency overlap between adjacent belts.
    *   *Output:* `float` efficiency multiplier.

**Final Note:** The goal is to make the *numbers* feel like *physics*. The telemetry snapshot shows a healthy, active colony. The next step is to make the *experience* of that colony feel like a living, breathing, singing cave.
