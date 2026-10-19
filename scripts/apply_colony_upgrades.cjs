const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../docs/showcase/index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log('Original character count:', content.length);

// =========================================================================
// 1. UPDATE CSS FOR 520px CANVAS AND HUD/INSPECTOR
// =========================================================================
const oldCSS = `        /* LOCAL COLONY EMBARKATION VIEWPORT */
        .local-colony-layout {
            display: grid;
            grid-template-columns: 500px 1fr;
            gap: 18px;
            margin-top: 10px;
        }

        .local-canvas-container {
            position: relative;
            width: 480px;
            height: 480px;
            background: #020408;
            border: 2px solid var(--panel-border);
            overflow: hidden;
            box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.95);
            cursor: crosshair;
            margin: 0 auto;
        }

        #local-colony-canvas {
            display: block;
            width: 480px;
            height: 480px;
            image-rendering: pixelated;
        }

        .local-cell-inspect-box {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: rgba(4, 7, 14, 0.9);
            border: 1px solid var(--accent-cyan);
            padding: 6px 10px;
            font-size: 9px;
            color: #cbd5e1;
            letter-spacing: 0.5px;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
            max-width: 450px;
        }`;

const newCSS = `        /* LOCAL COLONY EMBARKATION VIEWPORT */
        .local-colony-layout {
            display: grid;
            grid-template-columns: 540px 1fr;
            gap: 18px;
            margin-top: 10px;
        }

        .local-canvas-container {
            position: relative;
            width: 520px;
            height: 520px;
            background: #020408;
            border: 2px solid var(--panel-border);
            overflow: hidden;
            box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.95), 0 8px 32px rgba(0, 0, 0, 0.7);
            cursor: crosshair;
            margin: 0 auto;
            border-radius: 4px;
        }

        #local-colony-canvas {
            display: block;
            width: 520px;
            height: 520px;
            image-rendering: pixelated;
        }

        .local-cell-inspect-box {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: rgba(4, 7, 14, 0.92);
            border: 1px solid var(--accent-cyan);
            border-radius: 3px;
            padding: 6px 10px;
            font-size: 9px;
            color: #cbd5e1;
            letter-spacing: 0.5px;
            pointer-events: none;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.85);
            max-width: 500px;
            backdrop-filter: blur(8px);
        }`;

if (content.includes(oldCSS)) {
    content = content.replace(oldCSS, newCSS);
    console.log('[1/5] Updated colony layout CSS to 520px');
}

// Extra styles before </style>
const styleEndTarget = `    </style>`;
const extraStyles = `        /* =========================================================================
           COLONY TELEMETRY HUD BAR & EMBARK CONTROLS
           ========================================================================= */
        .colony-telemetry-hud-bar {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            margin: 10px 0 12px 0;
            background: linear-gradient(135deg, rgba(8, 14, 28, 0.94) 0%, rgba(4, 7, 16, 0.98) 100%);
            border: 1px solid rgba(56, 189, 248, 0.28);
            border-radius: 4px;
            padding: 10px 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
        }

        .hud-metric-card {
            display: flex;
            flex-direction: column;
            gap: 3px;
            padding: 4px 8px;
            border-left: 2px solid var(--accent-cyan);
            background: rgba(255, 255, 255, 0.02);
            border-radius: 0 4px 4px 0;
            transition: all 0.2s ease;
        }

        .hud-metric-card:hover {
            background: rgba(56, 189, 248, 0.08);
            border-left-color: var(--accent-amber);
            transform: translateY(-1px);
        }

        .hud-metric-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 8px;
            color: var(--text-muted);
            letter-spacing: 1px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .hud-metric-val {
            font-size: 13px;
            font-weight: bold;
            color: #f1f5f9;
            font-family: var(--font-mono);
            letter-spacing: 0.5px;
        }

        .hud-metric-sub {
            font-size: 7.5px;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .hud-status-pulse {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #22c55e;
            box-shadow: 0 0 8px #22c55e;
            animation: hudPulse 2s infinite ease-in-out;
        }

        @keyframes hudPulse {
            0%, 100% { opacity: 0.95; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(0.8); }
        }

        /* EMBARK & ARCHETYPE SELECTOR BAR */
        .embark-archetype-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 8px 12px;
            background: rgba(6, 10, 22, 0.92);
            border: 1px solid rgba(245, 158, 11, 0.35);
            border-radius: 4px;
            margin-bottom: 12px;
            backdrop-filter: blur(8px);
        }

        .archetype-group {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
        }

        .btn-archetype {
            padding: 6px 12px;
            background: #090f1e;
            border: 1px solid var(--panel-border);
            color: var(--text-muted);
            font-family: var(--font-mono);
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.15s ease;
            clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
        }

        .btn-archetype:hover {
            border-color: var(--accent-amber);
            color: #fff;
            background: rgba(245, 158, 11, 0.14);
        }

        .btn-archetype.active {
            border-color: var(--accent-amber);
            color: #fff;
            background: linear-gradient(180deg, rgba(245, 158, 11, 0.28) 0%, rgba(180, 83, 9, 0.4) 100%);
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }

        .btn-reroll-embark {
            padding: 7px 16px;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 70, 239, 0.35) 100%);
            border: 1px solid var(--accent-amber);
            color: #fff;
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
            clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
        }

        .btn-reroll-embark:hover {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.55) 0%, rgba(217, 70, 239, 0.55) 100%);
            box-shadow: 0 0 24px rgba(245, 158, 11, 0.65);
            transform: translateY(-1px);
        }

        /* COLONIST QUICK ORDERS BAR */
        .quick-orders-panel {
            background: #060a15;
            border: 1px solid var(--panel-border);
            border-left: 3px solid var(--accent-green);
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-radius: 2px;
        }

        .quick-orders-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
        }

        .btn-order {
            padding: 6px 8px;
            background: #0a1124;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #cbd5e1;
            font-family: var(--font-mono);
            font-size: 9px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.15s ease;
            text-align: center;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }

        .btn-order:hover {
            border-color: var(--accent-green);
            background: rgba(34, 197, 94, 0.18);
            color: #fff;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.35);
        }

        /* ROOM IMPRESSIVENESS & MOOD INSPECTOR */
        .room-impress-card {
            background: #060a15;
            border: 1px solid var(--panel-border);
            border-left: 3px solid var(--accent-amber);
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-radius: 2px;
        }

        .impress-score-row {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
        }

        .impress-meter-bg {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 3px;
            overflow: hidden;
            margin: 4px 0;
        }

        .impress-meter-fill {
            height: 100%;
            width: 72%;
            background: linear-gradient(90deg, #f59e0b, #22c55e);
            border-radius: 3px;
            transition: width 0.4s ease;
        }

        .impress-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            background: rgba(0, 0, 0, 0.3);
            padding: 6px 8px;
            border-radius: 3px;
            font-size: 8.5px;
        }

        .impress-stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .impress-stat-label {
            color: var(--text-muted);
            font-size: 7.5px;
        }

        .impress-stat-val {
            font-weight: bold;
            color: #f1f5f9;
        }

        .mood-buff-tag {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(34, 197, 94, 0.12);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #4ade80;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 8px;
            font-family: var(--font-mono);
        }
    </style>`;

if (!content.includes('.colony-telemetry-hud-bar')) {
    content = content.replace(styleEndTarget, extraStyles);
    console.log('[2/5] Added HUD & Room Inspector styles before </style>');
}

// =========================================================================
// 2. UPDATE HTML MARKUP IN #local-colony-section
// =========================================================================
const oldControlsRow = `        <!-- Controls Row for Local View -->
        <div class="carto-controls-row">
            <div class="control-group">
                <span class="control-label">TACTICAL ZOOM:</span>
                <button id="btn-zoom-1" class="btn-toggle active" onclick="setLocalZoom(1)">1x REGIONAL</button>
                <button id="btn-zoom-2" class="btn-toggle" onclick="setLocalZoom(2)">2x COLONY CLOSE-UP</button>
                <button id="btn-zoom-4" class="btn-toggle" onclick="setLocalZoom(4)">4x INSPECT PAWNS</button>
            </div>

            <div class="control-group">
                <span class="control-label">MAP SCALE:</span>
                <button id="btn-scale-32" class="btn-toggle active" onclick="setLocalMapScale(32)">32×32 OUTPOST</button>
                <button id="btn-scale-48" class="btn-toggle" onclick="setLocalMapScale(48)">48×48 EXPEDITION</button>
            </div>`;

const newControlsRow = `        <!-- Colony Status Telemetry HUD Bar (Glassmorphic) -->
        <div id="colony-telemetry-hud" class="colony-telemetry-hud-bar">
            <div class="hud-metric-card" style="border-left-color: var(--accent-cyan);">
                <div class="hud-metric-header">
                    <span>👥 COLONISTS</span>
                    <span class="hud-status-pulse"></span>
                </div>
                <div id="hud-pop-val" class="hud-metric-val">4 ACTIVE</div>
                <div id="hud-pop-sub" class="hud-metric-sub">Morale: 98% · 100% Health</div>
            </div>
            <div class="hud-metric-card" style="border-left-color: var(--accent-green);">
                <div class="hud-metric-header">
                    <span>⚡ POWER GRID</span>
                    <span style="color: var(--accent-green); font-size: 8px; font-weight: bold;">SURPLUS</span>
                </div>
                <div id="hud-power-val" class="hud-metric-val" style="color: var(--accent-green);">+680 kW</div>
                <div id="hud-power-sub" class="hud-metric-sub">Tokamak & Turbines Online</div>
            </div>
            <div class="hud-metric-card" style="border-left-color: var(--accent-amber);">
                <div class="hud-metric-header">
                    <span>🌾 FOOD RESERVES</span>
                    <span style="color: var(--accent-amber); font-size: 8px; font-weight: bold;">STABLE</span>
                </div>
                <div id="hud-food-val" class="hud-metric-val" style="color: var(--accent-amber);">48 DAYS</div>
                <div id="hud-food-sub" class="hud-metric-sub">Hydroponics: Biomass Optimal</div>
            </div>
            <div class="hud-metric-card" style="border-left-color: #c084fc;">
                <div class="hud-metric-header">
                    <span>💎 FORTRESS WEALTH</span>
                    <span style="color: #c084fc; font-size: 8px; font-weight: bold;">TIER 3</span>
                </div>
                <div id="hud-wealth-val" class="hud-metric-val" style="color: #c084fc;">58,400 Ag</div>
                <div id="hud-wealth-sub" class="hud-metric-sub">Structures + Plasteel Reserves</div>
            </div>
            <div class="hud-metric-card" style="border-left-color: #38bdf8;">
                <div class="hud-metric-header">
                    <span>🛡️ DEFENSE STATUS</span>
                    <span style="color: #38bdf8; font-size: 8px; font-weight: bold;">PATROL</span>
                </div>
                <div id="hud-sec-val" class="hud-metric-val" style="color: #38bdf8;">GREEN</div>
                <div id="hud-sec-sub" class="hud-metric-sub">Point-Defense & Sentry Rover Active</div>
            </div>
            <div class="hud-metric-card" style="border-left-color: var(--accent-amber);">
                <div class="hud-metric-header">
                    <span>🏛️ EMBARK ARCHETYPE</span>
                    <span style="color: var(--accent-amber); font-size: 8px; font-weight: bold;">SECTOR C05</span>
                </div>
                <div id="hud-arch-val" class="hud-metric-val" style="font-size: 10px; color: var(--accent-amber);">MOUNTAIN STRONGHOLD</div>
                <div id="hud-arch-sub" class="hud-metric-sub">32×32 · Seed #84920</div>
            </div>
        </div>

        <!-- Fortress Embark & Archetype Controls Bar -->
        <div class="embark-archetype-bar">
            <div class="archetype-group">
                <span class="control-label" style="margin-right: 4px;">FORTRESS EMBARK ARCHETYPE:</span>
                <button id="btn-arch-mountain" class="btn-archetype active" onclick="selectFortressArchetype('mountain')">⛰️ MOUNTAIN STRONGHOLD</button>
                <button id="btn-arch-aquifer" class="btn-archetype" onclick="selectFortressArchetype('aquifer')">🌊 AQUIFER OASIS</button>
                <button id="btn-arch-volcanic" class="btn-archetype" onclick="selectFortressArchetype('volcanic')">🌋 MAGMA CRUCIBLE</button>
                <button id="btn-arch-spore_warren" class="btn-archetype" onclick="selectFortressArchetype('spore_warren')">🍄 SPORE WARREN</button>
            </div>
            <button class="btn-reroll-embark" onclick="rerollEmbarkSeed()">
                <span>🎲 REROLL SEED &amp; EMBARK</span>
            </button>
        </div>

        <!-- Controls Row for Local View -->
        <div class="carto-controls-row">
            <div class="control-group">
                <span class="control-label">TACTICAL ZOOM:</span>
                <button id="btn-zoom-1" class="btn-toggle active" onclick="setLocalZoom(1)">1x REGIONAL</button>
                <button id="btn-zoom-2" class="btn-toggle" onclick="setLocalZoom(2)">2x COLONY CLOSE-UP</button>
                <button id="btn-zoom-4" class="btn-toggle" onclick="setLocalZoom(4)">4x INSPECT PAWNS</button>
            </div>

            <div class="control-group">
                <span class="control-label">MAP SCALE:</span>
                <button id="btn-scale-32" class="btn-toggle active" onclick="setLocalMapScale(32)">32×32 OUTPOST</button>
                <button id="btn-scale-48" class="btn-toggle" onclick="setLocalMapScale(48)">48×48 EXPEDITION</button>
                <button id="btn-scale-64" class="btn-toggle" onclick="setLocalMapScale(64)">64×64 GRAND FORTRESS</button>
            </div>`;

if (content.includes(oldControlsRow)) {
    content = content.replace(oldControlsRow, newControlsRow);
    console.log('[3/5] Injected Colony HUD bar, Embark Archetype selector, and 64x64 scale button');
}

// Update canvas width/height attribute to 520
content = content.replace(
    '<canvas id="local-colony-canvas" width="480" height="480"></canvas>',
    '<canvas id="local-colony-canvas" width="520" height="520"></canvas>'
);

// Add Room Inspector and Colonist Quick Orders into .local-hud-panel
const oldSectorIntel = `            <!-- Right: Tactical Embarkation HUD & Colonist Manifest -->
            <div class="local-hud-panel">
                <!-- Sector Translation Telemetry -->`;

const newSectorIntel = `            <!-- Right: Tactical Embarkation HUD & Colonist Manifest -->
            <div class="local-hud-panel">
                <!-- RimWorld / Dwarf Fortress Room Impressiveness & Mood Inspector Card -->
                <div id="room-impress-panel" class="room-impress-card">
                    <div class="buildable-header-row" style="margin-bottom: 2px;">
                        <span id="room-name" class="buildable-name" style="color: var(--accent-amber);">GREAT BASALT FEASTING HALL</span>
                        <span id="room-tier-badge" class="buildable-category-tag" style="color: var(--accent-green); border-color: rgba(34, 197, 94, 0.4);">TIER 1 SUBSISTENCE</span>
                    </div>
                    <div class="impress-score-row">
                        <span style="font-size: 8px; color: var(--text-muted); font-weight: bold;">ROOM IMPRESSIVENESS INDEX:</span>
                        <span id="room-impress-val" style="font-size: 11px; font-weight: bold; color: var(--accent-green);">145 (Extravagantly Impressive)</span>
                    </div>
                    <div class="impress-meter-bg">
                        <div id="room-meter-fill" class="impress-meter-fill" style="width: 78%;"></div>
                    </div>
                    <div class="impress-stats-grid">
                        <div class="impress-stat-item">
                            <span class="impress-stat-label">SPACE</span>
                            <span id="room-space-val" class="impress-stat-val">48 m²</span>
                        </div>
                        <div class="impress-stat-item">
                            <span class="impress-stat-label">BEAUTY</span>
                            <span id="room-beauty-val" class="impress-stat-val" style="color: var(--accent-amber);">+42</span>
                        </div>
                        <div class="impress-stat-item">
                            <span class="impress-stat-label">CLEANLINESS</span>
                            <span id="room-clean-val" class="impress-stat-val" style="color: var(--accent-cyan);">0.95 Clean</span>
                        </div>
                        <div class="impress-stat-item">
                            <span class="impress-stat-label">TEMP</span>
                            <span id="room-temp-val" class="impress-stat-val">+22.4°C</span>
                        </div>
                    </div>
                    <div id="room-mood-buffs" style="display: flex; gap: 4px; flex-wrap: wrap;">
                        <span class="mood-buff-tag">+8 Extravagant Dining Room</span>
                        <span class="mood-buff-tag" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #7dd3fc;">+5 Lithophone Joy</span>
                        <span class="mood-buff-tag" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); color: #fcd34d;">+4 Well-Lit</span>
                    </div>
                </div>

                <!-- Colonist Tactical Orders Panel -->
                <div class="quick-orders-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="state-matrix-title" style="margin: 0; color: var(--accent-green); font-size: 9px;">// COLONIST TACTICAL ORDERS:</span>
                        <span id="active-selected-colonist-label" style="font-size: 8px; color: var(--accent-cyan); font-weight: bold;">[CLICK COLONIST OR ORDER]</span>
                    </div>
                    <div class="quick-orders-grid">
                        <button class="btn-order" onclick="orderColonistTask('mine')">⚒️ MINE ORE</button>
                        <button class="btn-order" onclick="orderColonistTask('smelt')">⚙️ SMELT STEEL</button>
                        <button class="btn-order" onclick="orderColonistTask('crops')">🌿 TEND CROPS</button>
                        <button class="btn-order" onclick="orderColonistTask('killbox')">🛡️ MAN KILLBOX</button>
                        <button class="btn-order" onclick="orderColonistTask('recreation')">🍺 RECREATION</button>
                        <button class="btn-order" style="border-color: rgba(239, 68, 68, 0.4); color: #fca5a5;" onclick="orderColonistTask('clear')">🚶 CLEAR ORDERS</button>
                    </div>
                </div>

                <!-- Sector Translation Telemetry -->`;

if (content.includes(oldSectorIntel)) {
    content = content.replace(oldSectorIntel, newSectorIntel);
    console.log('[4/5] Injected Room Inspector card and Colonist Quick Orders panel');
}

// =========================================================================
// 3. JS ENGINE: COLLISION RESOLUTION, ARCHETYPES, AND INTERACTIVITY
// =========================================================================
// Target to replace: from COLONY_ROOM_DEFS up to rebuildColonyCompoundLayout
const oldRoomsAndLayoutTarget = `        // =========================================================================
        // COLONY ARCHITECTURAL ROOM REGISTRY & ZONING TELEMETRY
        // =========================================================================
        const COLONY_ROOM_DEFS = [
            {
                id: "mess_hall",
                name: "Mess Hall & Social Tavern",
                badge: "MESS HALL // EXTRAVAGANT",
                type: "Social & Dining",
                tier: "Extravagant (+8 Mood)",
                x: 8, y: 7, w: 7, h: 5,
                color: "rgba(245, 158, 11, 0.08)",
                borderColor: "#f59e0b",
                doors: [
                    { x: 11, y: 7, label: "Blast Hatch N" },
                    { x: 8, y: 10, label: "Turbine Access W" },
                    { x: 15, y: 10, label: "Airlock E" },
                    { x: 11, y: 12, label: "Vault Gate S" },
                    { x: 9, y: 12, label: "Bio Hatch SW" }
                ]
            },
            {
                id: "hydro_lab",
                name: "Research Lab & Hydroponics Wing",
                badge: "HYDRO-BIOME & RESEARCH",
                type: "Biomass & Agriculture",
                tier: "Standard (+2 Mood)",
                x: 6, y: 12, w: 4, h: 5,
                color: "rgba(34, 197, 94, 0.08)",
                borderColor: "#22c55e",
                doors: [
                    { x: 10, y: 14, label: "Bio-Seal E" },
                    { x: 9, y: 12, label: "Bio Hatch N" }
                ]
            },
            {
                id: "tokamak_vault",
                name: "Tokamak Power Reactor Vault",
                badge: "TOKAMAK REACTOR VAULT // HAZARD",
                type: "Power Generation & High Voltage",
                tier: "Industrial Radiation Shielded",
                x: 10, y: 12, w: 5, h: 5,
                color: "rgba(56, 189, 248, 0.09)",
                borderColor: "#38bdf8",
                doors: [
                    { x: 11, y: 12, label: "Vault Gate N" },
                    { x: 10, y: 14, label: "Bio-Seal W" },
                    { x: 15, y: 14, label: "Blast Door E" }
                ]
            },
            {
                id: "logistics_yard",
                name: "Fabrication & Logistics Yard",
                badge: "FABRICATION & LOGISTICS YARD",
                type: "Industrial Manufacturing",
                tier: "Automated Factory Tier 3",
                x: 15, y: 7, w: 10, h: 9,
                color: "rgba(168, 85, 247, 0.07)",
                borderColor: "#a855f7",
                doors: [
                    { x: 15, y: 10, label: "Airlock W" },
                    { x: 15, y: 14, label: "Blast Door W" },
                    { x: 19, y: 16, label: "Perimeter Gate S" }
                ]
            }
        ];`;

const newRoomsAndLayout = `        // =========================================================================
        // FORTRESS EMBARK ARCHETYPES & 4-TIER ROOM PROGRESSION (RIMWORLD & DWARF FORTRESS)
        // =========================================================================
        let currentFortressArchetype = 'mountain';
        let selectedColonistIdx = null;

        const FORTRESS_ARCHETYPES = {
            mountain: {
                id: "mountain",
                name: "Mountain Stronghold",
                badge: "⛰️ MOUNTAIN STRONGHOLD",
                lore: "Dwarven excavation deep in basalt bedrock. Impenetrable granite ramparts, central feasting hall, deep magma foundry.",
                biomeHint: "Basalt Bedrock Caverns",
                rooms: [
                    // TIER 1: SUBSISTENCE & HABITATION
                    {
                        id: "mess_hall",
                        name: "Great Basalt Feasting Hall & Tavern",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "FEASTING HALL // EXTRAVAGANT",
                        type: "Social & Dining",
                        floorType: "floor_basalt",
                        impressiveness: 145,
                        beauty: 42, space: 48, cleanliness: 0.95,
                        moodBuff: "+8 Extravagant Dining Room",
                        x: 8, y: 7, w: 7, h: 5,
                        color: "rgba(245, 158, 11, 0.08)",
                        borderColor: "#f59e0b",
                        doors: [{ x: 11, y: 7 }, { x: 8, y: 10 }, { x: 15, y: 10 }, { x: 11, y: 12 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "barracks",
                        name: "Miners' Bunkhouse Quarters",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "CREW BARRACKS // DORMITORY",
                        type: "Habitation",
                        floorType: "floor_basalt",
                        impressiveness: 102,
                        beauty: 28, space: 32, cleanliness: 0.90,
                        moodBuff: "+5 Decent Barracks",
                        x: 3, y: 7, w: 5, h: 5,
                        color: "rgba(59, 130, 246, 0.08)",
                        borderColor: "#3b82f6",
                        doors: [{ x: 8, y: 9 }]
                    },
                    // TIER 2: INDUSTRIAL PRODUCTION & CRAFTING
                    {
                        id: "hydro_lab",
                        name: "Hydroponics Biomass Lab",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "HYDROPONICS BIOLAB",
                        type: "Biomass & Agriculture",
                        floorType: "floor_spore",
                        impressiveness: 112,
                        beauty: 30, space: 24, cleanliness: 0.88,
                        moodBuff: "+3 Fresh Rations",
                        x: 6, y: 12, w: 4, h: 5,
                        color: "rgba(34, 197, 94, 0.08)",
                        borderColor: "#22c55e",
                        doors: [{ x: 10, y: 14 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "logistics_yard",
                        name: "Smelting Foundry & Conveyor Yard",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "SMELTER & LOGISTICS YARD",
                        type: "Metallurgy & Automation",
                        floorType: "floor_plating",
                        impressiveness: 124,
                        beauty: 22, space: 80, cleanliness: 0.85,
                        moodBuff: "+4 Automated Factory",
                        x: 15, y: 7, w: 10, h: 9,
                        color: "rgba(168, 85, 247, 0.07)",
                        borderColor: "#a855f7",
                        doors: [{ x: 15, y: 10 }, { x: 15, y: 14 }, { x: 19, y: 16 }]
                    },
                    // TIER 3: FORTIFIED STRONGHOLD & POWER
                    {
                        id: "tokamak_vault",
                        name: "Tokamak Power Reactor Vault",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "TOKAMAK CORE // RADIATION SHIELDED",
                        type: "Power Generation",
                        floorType: "floor_hazard",
                        impressiveness: 138,
                        beauty: 32, space: 35, cleanliness: 0.98,
                        moodBuff: "+6 Reliable Power Grid",
                        x: 10, y: 12, w: 5, h: 5,
                        color: "rgba(56, 189, 248, 0.09)",
                        borderColor: "#38bdf8",
                        doors: [{ x: 11, y: 12 }, { x: 10, y: 14 }, { x: 15, y: 14 }]
                    },
                    {
                        id: "killbox",
                        name: "Frontier Gatehouse Killbox",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "DEFENSE BASTION // KILLBOX",
                        type: "Ballistic Defense",
                        floorType: "floor_grate",
                        impressiveness: 116,
                        beauty: 16, space: 40, cleanliness: 0.82,
                        moodBuff: "+6 Fortified Security",
                        x: 17, y: 16, w: 7, h: 4,
                        color: "rgba(239, 68, 68, 0.08)",
                        borderColor: "#ef4444",
                        doors: [{ x: 19, y: 16 }]
                    },
                    // TIER 4: PRECURSOR WONDER & DRONE FLEET
                    {
                        id: "drone_hangar",
                        name: "Autonomous Drone Hangar & Uplink",
                        tierLevel: 4,
                        tierName: "TIER 4 WONDER",
                        badge: "DRONE FLEET HANGAR // TIER 4",
                        type: "Robotics & AI Core",
                        floorType: "floor_plating",
                        impressiveness: 172,
                        beauty: 54, space: 42, cleanliness: 0.99,
                        moodBuff: "+10 Autonomous Drone Fleet",
                        x: 15, y: 2, w: 6, h: 5,
                        color: "rgba(14, 165, 233, 0.1)",
                        borderColor: "#0ea5e9",
                        doors: [{ x: 18, y: 7 }]
                    }
                ]
            },
            aquifer: {
                id: "aquifer",
                name: "Aquifer River Oasis",
                badge: "🌊 AQUIFER OASIS",
                lore: "Subterranean river ecosystem. Abundant fresh water, hydro turbines, expansive fungal crops, wooden boardwalks.",
                biomeHint: "Subterranean Aquifer Basin",
                rooms: [
                    {
                        id: "mess_hall",
                        name: "Riverside Mess Hall & Boardwalk",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "RIVERSIDE TAVERN // SCENIC",
                        type: "Social & Dining",
                        floorType: "floor_basalt",
                        impressiveness: 152,
                        beauty: 52, space: 48, cleanliness: 0.96,
                        moodBuff: "+9 Scenic River Dining",
                        x: 8, y: 7, w: 7, h: 5,
                        color: "rgba(245, 158, 11, 0.08)",
                        borderColor: "#f59e0b",
                        doors: [{ x: 11, y: 7 }, { x: 8, y: 10 }, { x: 15, y: 10 }, { x: 11, y: 12 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "barracks",
                        name: "Hydro-Habitation Dormitory",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "HYDRO BARRACKS",
                        type: "Habitation",
                        floorType: "floor_basalt",
                        impressiveness: 105,
                        beauty: 30, space: 32, cleanliness: 0.91,
                        moodBuff: "+5 Soothing River Water",
                        x: 3, y: 7, w: 5, h: 5,
                        color: "rgba(59, 130, 246, 0.08)",
                        borderColor: "#3b82f6",
                        doors: [{ x: 8, y: 9 }]
                    },
                    {
                        id: "hydro_lab",
                        name: "Giant Hydroponics Sanctuary",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "AQUIFER BIOMASS WING",
                        type: "Biomass & Agriculture",
                        floorType: "floor_spore",
                        impressiveness: 130,
                        beauty: 45, space: 30, cleanliness: 0.92,
                        moodBuff: "+6 Lush Hydroponics",
                        x: 6, y: 12, w: 5, h: 5,
                        color: "rgba(34, 197, 94, 0.08)",
                        borderColor: "#22c55e",
                        doors: [{ x: 11, y: 14 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "logistics_yard",
                        name: "Hydro-Turbine & Sorter Yard",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "HYDRO DYNAMO & LOGISTICS",
                        type: "Power & Freight",
                        floorType: "floor_plating",
                        impressiveness: 128,
                        beauty: 26, space: 80, cleanliness: 0.88,
                        moodBuff: "+5 Water Turbines",
                        x: 15, y: 7, w: 10, h: 9,
                        color: "rgba(168, 85, 247, 0.07)",
                        borderColor: "#a855f7",
                        doors: [{ x: 15, y: 10 }, { x: 15, y: 14 }, { x: 19, y: 16 }]
                    },
                    {
                        id: "tokamak_vault",
                        name: "Sterile Medpod Research Hospital",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "STERILE INFIRMARY // ADVANCED",
                        type: "Medical Science",
                        floorType: "floor_plating",
                        impressiveness: 155,
                        beauty: 48, space: 35, cleanliness: 0.99,
                        moodBuff: "+8 Sterile Care Facility",
                        x: 11, y: 12, w: 4, h: 5,
                        color: "rgba(56, 189, 248, 0.09)",
                        borderColor: "#38bdf8",
                        doors: [{ x: 11, y: 12 }, { x: 15, y: 14 }]
                    },
                    {
                        id: "killbox",
                        name: "Aquifer Sluice Defensive Chokepoint",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "SLUICE GATE DEFENSE",
                        type: "Defense",
                        floorType: "floor_grate",
                        impressiveness: 120,
                        beauty: 20, space: 40, cleanliness: 0.85,
                        moodBuff: "+6 Sluice Barrier",
                        x: 17, y: 16, w: 7, h: 4,
                        color: "rgba(239, 68, 68, 0.08)",
                        borderColor: "#ef4444",
                        doors: [{ x: 19, y: 16 }]
                    },
                    {
                        id: "drone_hangar",
                        name: "Precursor Sub-Strata Excavation Bay",
                        tierLevel: 4,
                        tierName: "TIER 4 WONDER",
                        badge: "ANCIENT EXCAVATION TRENCH",
                        type: "Archeotech",
                        floorType: "floor_plating",
                        impressiveness: 180,
                        beauty: 60, space: 42, cleanliness: 0.98,
                        moodBuff: "+12 Precursor Archeotech",
                        x: 15, y: 2, w: 6, h: 5,
                        color: "rgba(14, 165, 233, 0.1)",
                        borderColor: "#0ea5e9",
                        doors: [{ x: 18, y: 7 }]
                    }
                ]
            },
            volcanic: {
                id: "volcanic",
                name: "Magma Crucible Foundry",
                badge: "🌋 MAGMA CRUCIBLE",
                lore: "High-temperature volcanic redoubt. Obsidian battlements flanked by lava moats, superheated smelters, thermal reactors.",
                biomeHint: "Molten Magma Chasm",
                rooms: [
                    {
                        id: "mess_hall",
                        name: "Heat-Shielded Mess Hall & Hearth",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "CRUCIBLE HEARTH // TAVERN",
                        type: "Social & Dining",
                        floorType: "floor_basalt",
                        impressiveness: 140,
                        beauty: 38, space: 48, cleanliness: 0.93,
                        moodBuff: "+7 Cozy Basalt Hearth",
                        x: 8, y: 7, w: 7, h: 5,
                        color: "rgba(245, 158, 11, 0.08)",
                        borderColor: "#f59e0b",
                        doors: [{ x: 11, y: 7 }, { x: 8, y: 10 }, { x: 15, y: 10 }, { x: 11, y: 12 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "barracks",
                        name: "Obsidian Bunkhouse Barracks",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "HEAT-SHIELDED BARRACKS",
                        type: "Habitation",
                        floorType: "floor_basalt",
                        impressiveness: 100,
                        beauty: 26, space: 32, cleanliness: 0.89,
                        moodBuff: "+5 Thermal Insulation",
                        x: 3, y: 7, w: 5, h: 5,
                        color: "rgba(59, 130, 246, 0.08)",
                        borderColor: "#3b82f6",
                        doors: [{ x: 8, y: 9 }]
                    },
                    {
                        id: "hydro_lab",
                        name: "Sub-Basalt Crop Incubator",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "THERMAL INCUBATOR",
                        type: "Biomass",
                        floorType: "floor_spore",
                        impressiveness: 115,
                        beauty: 32, space: 24, cleanliness: 0.88,
                        moodBuff: "+4 Fast Thermal Crops",
                        x: 6, y: 12, w: 4, h: 5,
                        color: "rgba(34, 197, 94, 0.08)",
                        borderColor: "#22c55e",
                        doors: [{ x: 10, y: 14 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "logistics_yard",
                        name: "Heavy Magma Arc Smelting Bay",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "SUPERHEATED ARC FOUNDRY",
                        type: "Metallurgy",
                        floorType: "floor_plating",
                        impressiveness: 135,
                        beauty: 28, space: 80, cleanliness: 0.86,
                        moodBuff: "+5 High-Yield Smelting",
                        x: 15, y: 7, w: 10, h: 9,
                        color: "rgba(168, 85, 247, 0.07)",
                        borderColor: "#a855f7",
                        doors: [{ x: 15, y: 10 }, { x: 15, y: 14 }, { x: 19, y: 16 }]
                    },
                    {
                        id: "tokamak_vault",
                        name: "Geothermal Tokamak Super-Core",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "THERMAL SUPER-CORE // HAZARD",
                        type: "Power Generation",
                        floorType: "floor_hazard",
                        impressiveness: 148,
                        beauty: 35, space: 35, cleanliness: 0.97,
                        moodBuff: "+8 Gigawatt Output",
                        x: 10, y: 12, w: 5, h: 5,
                        color: "rgba(56, 189, 248, 0.09)",
                        borderColor: "#38bdf8",
                        doors: [{ x: 11, y: 12 }, { x: 10, y: 14 }, { x: 15, y: 14 }]
                    },
                    {
                        id: "killbox",
                        name: "Magma Moat Perimeter Bastion",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "LAVA MOAT BASTION",
                        type: "Defense",
                        floorType: "floor_grate",
                        impressiveness: 125,
                        beauty: 25, space: 40, cleanliness: 0.84,
                        moodBuff: "+7 Impassable Lava Moat",
                        x: 17, y: 16, w: 7, h: 4,
                        color: "rgba(239, 68, 68, 0.08)",
                        borderColor: "#ef4444",
                        doors: [{ x: 19, y: 16 }]
                    },
                    {
                        id: "drone_hangar",
                        name: "Autonomous Heavy Drone Bay",
                        tierLevel: 4,
                        tierName: "TIER 4 WONDER",
                        badge: "CRUCIBLE DRONE HIVE",
                        type: "Robotics",
                        floorType: "floor_plating",
                        impressiveness: 175,
                        beauty: 55, space: 42, cleanliness: 0.99,
                        moodBuff: "+10 Automated Logistics",
                        x: 15, y: 2, w: 6, h: 5,
                        color: "rgba(14, 165, 233, 0.1)",
                        borderColor: "#0ea5e9",
                        doors: [{ x: 18, y: 7 }]
                    }
                ]
            },
            spore_warren: {
                id: "spore_warren",
                name: "Bioluminescent Spore Warren",
                badge: "🍄 SPORE WARREN",
                lore: "Deep bioluminescent mycelium labyrinth. Giant spore trees, pharmaceutical extractors, organic living chambers.",
                biomeHint: "Bioluminescent Fungal Canopy",
                rooms: [
                    {
                        id: "mess_hall",
                        name: "Fungal Canopy Communal Tavern",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "CANOPY COMMONS // EXTRAVAGANT",
                        type: "Social & Dining",
                        floorType: "floor_spore",
                        impressiveness: 148,
                        beauty: 46, space: 48, cleanliness: 0.94,
                        moodBuff: "+8 Bioluminescent Dining",
                        x: 8, y: 7, w: 7, h: 5,
                        color: "rgba(245, 158, 11, 0.08)",
                        borderColor: "#f59e0b",
                        doors: [{ x: 11, y: 7 }, { x: 8, y: 10 }, { x: 15, y: 10 }, { x: 11, y: 12 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "barracks",
                        name: "Mycelium Sleeping Pods",
                        tierLevel: 1,
                        tierName: "TIER 1 SUBSISTENCE",
                        badge: "ORGANIC SLEEP PODS",
                        type: "Habitation",
                        floorType: "floor_spore",
                        impressiveness: 108,
                        beauty: 34, space: 32, cleanliness: 0.91,
                        moodBuff: "+6 Comforting Spore Bed",
                        x: 3, y: 7, w: 5, h: 5,
                        color: "rgba(59, 130, 246, 0.08)",
                        borderColor: "#3b82f6",
                        doors: [{ x: 8, y: 9 }]
                    },
                    {
                        id: "hydro_lab",
                        name: "Bioluminescent Mycelial Farm",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "PHARMACEUTICAL NURSERY",
                        type: "Biomass & Medicine",
                        floorType: "floor_spore",
                        impressiveness: 135,
                        beauty: 50, space: 30, cleanliness: 0.92,
                        moodBuff: "+7 Abundant Medicine",
                        x: 6, y: 12, w: 5, h: 5,
                        color: "rgba(34, 197, 94, 0.08)",
                        borderColor: "#22c55e",
                        doors: [{ x: 11, y: 14 }, { x: 9, y: 12 }]
                    },
                    {
                        id: "logistics_yard",
                        name: "Pharmaceutical Extraction Bay",
                        tierLevel: 2,
                        tierName: "TIER 2 PRODUCTION",
                        badge: "BIO-LOGISTICS FOUNDRY",
                        type: "Biotech & Sorting",
                        floorType: "floor_plating",
                        impressiveness: 130,
                        beauty: 30, space: 80, cleanliness: 0.89,
                        moodBuff: "+5 Automated Extraction",
                        x: 15, y: 7, w: 10, h: 9,
                        color: "rgba(168, 85, 247, 0.07)",
                        borderColor: "#a855f7",
                        doors: [{ x: 15, y: 10 }, { x: 15, y: 14 }, { x: 19, y: 16 }]
                    },
                    {
                        id: "tokamak_vault",
                        name: "Bio-Resin Tokamak Core",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "BIO-RESIN POWER CORE",
                        type: "Power Generation",
                        floorType: "floor_hazard",
                        impressiveness: 142,
                        beauty: 36, space: 35, cleanliness: 0.96,
                        moodBuff: "+7 Clean Bio-Fusion",
                        x: 11, y: 12, w: 4, h: 5,
                        color: "rgba(56, 189, 248, 0.09)",
                        borderColor: "#38bdf8",
                        doors: [{ x: 11, y: 12 }, { x: 15, y: 14 }]
                    },
                    {
                        id: "killbox",
                        name: "Spore Brier Defensive Chokepoint",
                        tierLevel: 3,
                        tierName: "TIER 3 FORTIFIED",
                        badge: "BRIER DEFENSE BASTION",
                        type: "Defense",
                        floorType: "floor_grate",
                        impressiveness: 118,
                        beauty: 22, space: 40, cleanliness: 0.83,
                        moodBuff: "+6 Natural Wall Traps",
                        x: 17, y: 16, w: 7, h: 4,
                        color: "rgba(239, 68, 68, 0.08)",
                        borderColor: "#ef4444",
                        doors: [{ x: 19, y: 16 }]
                    },
                    {
                        id: "drone_hangar",
                        name: "Spore-Drone Hive & Recharger",
                        tierLevel: 4,
                        tierName: "TIER 4 WONDER",
                        badge: "BIO-DRONE HIVE WONDER",
                        type: "Robotics",
                        floorType: "floor_plating",
                        impressiveness: 178,
                        beauty: 58, space: 42, cleanliness: 0.99,
                        moodBuff: "+11 Symbiotic Drone Swarm",
                        x: 15, y: 2, w: 6, h: 5,
                        color: "rgba(14, 165, 233, 0.1)",
                        borderColor: "#0ea5e9",
                        doors: [{ x: 18, y: 7 }]
                    }
                ]
            }
        };

        let COLONY_ROOM_DEFS = FORTRESS_ARCHETYPES.mountain.rooms;`;

if (content.includes(oldRoomsAndLayoutTarget)) {
    content = content.replace(oldRoomsAndLayoutTarget, newRoomsAndLayout);
    console.log('[5/5] Injected FORTRESS_ARCHETYPES with 4 full archetypes and 4-tier room roster');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully applied core structural replacements to docs/showcase/index.html');
