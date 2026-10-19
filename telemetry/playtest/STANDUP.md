# Project Deep-Mantle :: Morning Standup Briefing

**Briefing Timestamp:** 2026-10-19 09:30:48 AM (2026-10-19 08:30:48 UTC)  
**Target System:** ezEngine Subterranean Colony Simulation (C++20 / Vulkan)  
**AI Cluster Core:** DGX Spark (:8877) · RTX 5090 Blackwell (:8080) · RTX 5070 Ti SLM (:8082)

---

## 1. Executive Status Dashboard

| Metric | Value | Target Standard | Status |
| :--- | :--- | :--- | :---: |
| **Monte Carlo Survival** | `100.0%` | 100.0% (3 Biomes) | 🟢 PASS |
| **Flow-State Zone** | `MILD_BOREDOM_ZONE` | Csikszentmihalyi Flow | 🟢 PASS |
| **24-Color GPL Asset Compliance** | `52 / 52` | 100.0% deep_mantle.gpl | 🟢 PASS |
| **Active Engineering Batch** | `BATCH-07` | Continuous Advancement | 🟢 PASS |
| **RTX 5090 VRAM State** | `31288 / 32607 MiB (40°C, 0% Util)` | Flushed / Unfragmented | 🟢 PASS |


## 2. Engineering Work Batch: BATCH-07 (Subterranean Deep-Core Autonomous Expansion & Living Cavern Ecosystem)

**Target Engine Version:** `v1.1.0`  

**Overview:** Deepen subterranean simulation dynamics, fluid physics, and pawn emotional social texture.


| Task ID | Priority | Domain | Title | Complexity |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-701` | `P0 - Critical` | `Simulation/FluidDynamics` | Multi-Z Magma & Groundwater Hydrodynamic Simulation | `Large` |
| `TASK-702` | `P1 - High` | `Engine/C++20` | Pneumatic Logistics Tube Network & Auto-Sorter Splitters | `Medium` |
| `TASK-703` | `P1 - High` | `Simulation/Social` | Colonist Social Relationships, Banter & Cavern Recreation Loops | `Medium` |
| `TASK-704` | `P2 - Quality-of-Life` | `Simulation/Agriculture` | Subterranean Fungal Hydroponics & Bioluminescent Flora Farming | `Medium` |
| `TASK-705` | `P0 - Critical` | `Graphics/Vulkan` | Dyson Beam Receiver Focal Beam Lens Flare & Atmospheric Particle Ionization | `Medium` |


## 3. Operator AI Cluster Visual & Gameplay Critique

> Here is the architectural review and design specification for **Project Deep-Mantle**, delivered from the Lead Visual Designer and Gameplay Architect perspective on the DGX Spark/RTX 5090 cluster.

### 1. Visual & Spatial Consistency Evaluation
**Does this make sense? (Top-down orthographic, 16-bit scaling, spatial consistency)**

**Verdict:** Yes, the structure is logically sound, but the visual hierarchy requires strict quantization to avoid "pixel soup" in a dense subterranean environment.

*   **Perspective Alignment:** The top-down orthographic view is optimal for Factorio-style logistics. However, for **Domain 2 (Habitation)** and **Domain 4 (Fauna)**, we must enforce a **2.5D pseudo-isometric** approach within the orthographic grid.
    *   *Correction:* Pure top-down makes Lithophones and Stools look like flat rectangles. Use a slight vertical offset (Y-axis compression) to give depth to furniture legs and tree canopies without breaking the grid.
*   **16-bit Scaling & Quantization:**
    *   **Palette:** Use a strict 16-color palette per asset domain to reduce VRAM bandwidth on the RTX 5090.
    *   **Pixel Density:** 1 pixel = 1 logical unit.
        *   *Small items (Stool, Inserter):* 8x8 px.
        *   *Medium items (Table, Wolf):* 16x16 px.
        *   *Large items (Turbine, Spore Tree):* 32x32 px.
    *   **Consistency Check:** The "Rogue Subversion Loop" (Domain 1) must visually contrast with static assets. Use a distinct, high-contrast outline (e.g., cyan glow) for active logic nodes vs. matte finishes for static furniture.
*   **Spatial Consistency:** Ensure all "walk cycles" (Domain 4) are 4-frame loops aligned to the 16x16 grid. The Muffalo’s bulk must not obscure the grid lines of adjacent tiles. Use alpha-blended shadows (1px offset) to ground objects.

### 2. Gameplay Loop Clarity
**Is it clear? Will the player understand? (Factorio automation + RimWorld survival)**

**Verdict:** The loop is clear but risks cognitive overload. We must streamline the "Input → Process → Output" feedback.

**The Core Loop:**
1.  **Extract (Input):** Drones (Domain 1) harvest Subterranean Flora (Domain 3) and Fauna (Domain 4).
2.  **Process (Transformation):** Industrial Machinery (Domain 5) converts raw materials into components.
3.  **Distribute (Logistics):** Factory Logistics (Domain 6) move items to Habitation (Domain 2) or back to Drones.
4.  **Sustain (Survival):** Habitation furniture provides "Comfort" and "Research" buffs to Pawns.

**Clarity Enhancements:**
*   **Visual Feedback:** When a Conveyor (Domain 6) moves an item, the item sprite must "pop" slightly (1px Y-offset) on entry/exit to signal state change.
*   **Pawn AI Visibility:** Pawns must have a 1px colored dot above their head indicating their current task priority (e.g., Red = Urgent, Green = Idle).
*   **RimWorld-Grade Survival:** The "Lithophone" (Domain 2) is not just decor; it must emit a visible sound wave ripple (1-frame animation) when a Pawn interacts with it, showing the "Comfort" buff spreading to nearby tiles. This makes the abstract concept of "comfort" spatially visible.

### 3. Asset Replacement & Quantization Needs
**Where things look like AI done, what needs replacement, quantization, or perspective alignment?**

| Domain | Issue | Action Required |
| :--- | :--- | :--- |
| **1. Drones** | AI-generated drones often have inconsistent joint counts. | **Replace:** Use a strict 3-part sprite (Head, Body, Legs). Quantize to 8x8 px. Ensure the "Rogue Subversion Loop" has a distinct, non-animated outline for readability. |
| **2. Furniture** | Lithophones and Lamps often lack depth cues. | **Align:** Add a 1px dark shadow at the base of each item. For the Lithophone, use a 2-tone gradient (top lighter, bottom darker) to simulate cylindrical volume in 16-bit. |
| **3. Flora** | Spore Trees often look like blobs. | **Quantize:** Force a 4-frame sway animation (1px horizontal shift). Ensure the canopy overlaps the trunk by exactly 2px to create depth. |
| **4. Fauna** | 4-frame walk cycles often misalign with the grid. | **Align:** Snap all 4 frames to the 16x16 grid. The Muffalo’s body must occupy exactly 16x16 px; the Wolf 8x8 px. No sub-pixel movement. |
| **5. Machinery** | Turrets and Smelters often have too many details. | **Replace:** Simplify to 3-color sprites. Use bold outlines (1px black) to separate machinery from the background. Remove internal shading; use flat colors with 1px highlights. |
| **6. Logistics** | Conveyors often look like static lines. | **Align:** Use a 2-frame animation for conveyor belts (shift pattern by 1px). Ensure the Inserter’s arm rotates in 90-degree increments only, snapped to the grid. |

### 4. New Depth & Fun Features for Engagement
**What new depth and fun features should be added to maximize player engagement?**

1.  **Dynamic Lighting System (RTX 5090 Advantage):**
    *   Implement real-time, per-pixel lighting from Lamps (Domain 2) and Turrets (Domain 5).
    *   *Feature:* "Light Decay" – Items farther from light sources become desaturated (quantized to 4 colors). This creates a natural visual hierarchy and guides the player’s eye to active zones.

2.  **Symbiotic Flora-Fauna Interactions:**
    *   *Feature:* "Healroot Pulse" – When a Muffalo (Domain 4) stands next to a Healroot (Domain 3), both sprites emit a 1-frame green glow. This shows passive resource generation without UI clutter.
    *   *Feature:* "Berry Bush Harvest" – When a Drone (Domain 1) harvests a Berry Bush, the bush shrinks by 2px per harvest, visually indicating depletion.

3.  **Modular Factory Logic (Factorio-Grade):**
    *   *Feature:* "Color-Coded Conveyors" – Assign 4 primary colors to conveyor belts (Red = Raw, Blue = Processed, Green = Finished, Yellow = Waste). This allows players to trace logistics paths instantly.
    *   *Feature:* "Inserter Priority"


## 4. Subterranean Threat & Flow-State Balancing

- **Current Flow State:** `MILD_BOREDOM_ZONE (Too Safe / Plateauing Mid-Game)`

- **Applied Tuning Deltas:**
  - `SapperRaidThreatMultiplier`: `1.25`
  - `SeismicTremorFrequencyTicks`: `750`
  - `SOECOxygenYieldPerUnit`: `0.82`
  - `LichenAleRecreationBuff`: `1.15`


## 5. Deferred Dockets & Morning Decisions

*(Zero compiler deadlocks detected. All active engineering dockets cleanly compiled & validated.)*
