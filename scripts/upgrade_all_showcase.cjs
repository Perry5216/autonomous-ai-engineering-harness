const fs = require('fs');
const path = require('path');
const vm = require('vm');

const srcPath = 'C:/Users/5216p/ezEngine/Data/Samples/ColonyView/UI/Pawn_and_WorldMap_Showcase.html';
const dest1 = 'c:/Users/5216p/Projects/autonomous-ai-engineering-harness/docs/showcase/Pawn_and_WorldMap_Showcase.html';
const dest2 = 'c:/Users/5216p/Projects/autonomous-ai-engineering-harness/docs/showcase/index.html';

console.log('Reading base file from:', srcPath);
let content = fs.readFileSync(srcPath, 'utf8');
const hadCRLF = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

console.log('Base length:', content.length, 'Had CRLF:', hadCRLF);

// =========================================================================
// 1. INJECT GOOGLE FONTS IN <head>
// =========================================================================
const fontLinks = `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Rajdhani:wght@600;700;800&display=swap" rel="stylesheet">
`;

if (!content.includes('fonts.googleapis.com')) {
    content = content.replace('<head>\n', '<head>\n' + fontLinks);
    console.log('[Step 1] Injected Google Fonts');
}

// =========================================================================
// 2. UPDATE CSS: ADD FLEX-WRAP TO CARTO CONTROLS AND INJECT ALL NEW UI CSS
// =========================================================================
const oldCartoControlsCSS = `        /* Cartography Controls */
        .carto-controls-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            background: rgba(10, 16, 28, 0.8);
            border: 1px solid var(--panel-border);
            padding: 8px 12px;
        }`;

const newCartoControlsCSS = `        /* Cartography Controls */
        .carto-controls-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            background: rgba(10, 16, 28, 0.85);
            border: 1px solid var(--panel-border);
            border-radius: 4px;
            padding: 8px 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }`;

if (content.includes(oldCartoControlsCSS)) {
    content = content.replace(oldCartoControlsCSS, newCartoControlsCSS);
    console.log('[Step 2a] Updated .carto-controls-row CSS with flex-wrap');
}

const oldColonyLayoutCSS = `        /* LOCAL COLONY EMBARKATION VIEWPORT */
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

const newFullColonyCSS = `        /* =========================================================================
           COLONY TELEMETRY HUD BAR (GLASSMORPHIC SCI-FI HEADER)
           ========================================================================= */
        .colony-telemetry-hud-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 12px;
            width: 100%;
        }

        .hud-metric-card {
            background: linear-gradient(135deg, rgba(13, 22, 41, 0.75) 0%, rgba(6, 11, 20, 0.88) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-left: 3px solid var(--accent-cyan);
            border-radius: 4px;
            padding: 8px 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
            position: relative;
            overflow: hidden;
        }

        .hud-metric-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, rgba(255,255,255,0.15), transparent);
        }

        .hud-metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.75);
            border-color: rgba(56, 189, 248, 0.4);
        }

        .hud-metric-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #94a3b8;
            margin-bottom: 4px;
            text-transform: uppercase;
        }

        .hud-status-pulse {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: var(--accent-green);
            box-shadow: 0 0 8px var(--accent-green);
            display: inline-block;
            animation: pulse-glow 2s infinite ease-in-out;
        }

        @keyframes pulse-glow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }

        .hud-metric-val {
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #f8fafc;
            line-height: 1.2;
            font-family: 'Rajdhani', var(--font-mono);
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }

        .hud-metric-sub {
            font-size: 8.5px;
            color: #64748b;
            margin-top: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* =========================================================================
           FORTRESS EMBARK ARCHETYPE SELECTOR
           ========================================================================= */
        .embark-archetype-bar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            background: linear-gradient(90deg, rgba(10, 16, 28, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%);
            border: 1px solid var(--panel-border);
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 10px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }

        .archetype-group {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
        }

        .btn-archetype {
            padding: 5px 12px;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid var(--panel-border);
            color: #cbd5e1;
            font-family: var(--font-mono);
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: 3px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .btn-archetype:hover {
            border-color: var(--accent-cyan);
            color: #fff;
            transform: translateY(-1px);
            background: rgba(56, 189, 248, 0.12);
        }

        .btn-archetype.active {
            background: linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.15) 100%);
            border-color: var(--accent-cyan);
            color: #38bdf8;
            box-shadow: 0 0 14px rgba(56, 189, 248, 0.4), inset 0 0 8px rgba(56, 189, 248, 0.2);
            font-weight: 800;
        }

        .btn-reroll-embark {
            padding: 5px 14px;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(180, 83, 9, 0.3) 100%);
            border: 1px solid var(--accent-amber);
            color: #fef3c7;
            font-family: var(--font-mono);
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 1px;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.2s;
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.25);
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-reroll-embark:hover {
            background: rgba(245, 158, 11, 0.35);
            box-shadow: 0 0 16px rgba(245, 158, 11, 0.5);
            transform: translateY(-1px);
            color: #fff;
        }

        /* =========================================================================
           RIMWORLD / DWARF FORTRESS ROOM IMPRESSIVENESS & MOOD INSPECTOR
           ========================================================================= */
        .room-impress-card {
            background: linear-gradient(180deg, rgba(9, 15, 29, 0.85) 0%, rgba(4, 7, 14, 0.95) 100%);
            border: 1px solid var(--panel-border);
            border-left: 3px solid var(--accent-green);
            border-radius: 4px;
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 7px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(8px);
        }

        .impress-score-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2px;
        }

        .impress-meter-bg {
            width: 100%;
            height: 6px;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 3px;
            overflow: hidden;
        }

        .impress-meter-fill {
            height: 100%;
            background: linear-gradient(90deg, #22c55e 0%, #38bdf8 100%);
            border-radius: 2px;
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
        }

        .impress-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            background: rgba(4, 7, 14, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 3px;
            padding: 6px;
        }

        .impress-stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .impress-stat-label {
            font-size: 7.5px;
            font-weight: 700;
            color: #64748b;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .impress-stat-val {
            font-size: 10px;
            font-weight: 700;
            color: #f1f5f9;
            margin-top: 1px;
            font-family: var(--font-mono);
        }

        .mood-buff-tag {
            font-size: 8px;
            font-weight: 600;
            background: rgba(34, 197, 94, 0.12);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #86efac;
            padding: 2px 6px;
            border-radius: 3px;
            letter-spacing: 0.3px;
            display: inline-block;
        }

        /* =========================================================================
           COLONIST TACTICAL QUICK ORDERS PANEL
           ========================================================================= */
        .quick-orders-panel {
            background: linear-gradient(180deg, rgba(8, 13, 26, 0.85) 0%, rgba(4, 7, 14, 0.95) 100%);
            border: 1px solid var(--panel-border);
            border-left: 3px solid var(--accent-amber);
            border-radius: 4px;
            padding: 9px 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.65);
        }

        .quick-orders-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-top: 4px;
        }

        .btn-order {
            padding: 6px 4px;
            background: rgba(15, 23, 42, 0.7);
            border: 1px solid var(--panel-border);
            color: #cbd5e1;
            font-family: var(--font-mono);
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.5px;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.15s ease-in-out;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .btn-order:hover {
            border-color: var(--accent-amber);
            color: #fff;
            background: rgba(245, 158, 11, 0.15);
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
            transform: translateY(-1px);
        }

        .btn-order:active {
            transform: translateY(0);
        }

        /* LOCAL COLONY EMBARKATION VIEWPORT */
        .local-colony-layout {
            display: grid;
            grid-template-columns: 530px 1fr;
            gap: 16px;
            margin-top: 10px;
            align-items: start;
        }

        .local-canvas-container {
            position: relative;
            width: 520px;
            height: 520px;
            background: #020408;
            border: 2px solid rgba(56, 189, 248, 0.3);
            overflow: hidden;
            box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.95), 0 8px 32px rgba(0, 0, 0, 0.75);
            cursor: crosshair;
            margin: 0;
            border-radius: 6px;
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
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 9px;
            color: #cbd5e1;
            letter-spacing: 0.5px;
            pointer-events: none;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.85);
            max-width: 500px;
            backdrop-filter: blur(8px);
        }`;

if (content.includes(oldColonyLayoutCSS)) {
    content = content.replace(oldColonyLayoutCSS, newFullColonyCSS);
    console.log('[Step 2b] Replaced colony layout CSS and added HUD, Archetype, Room, Orders CSS');
}

// =========================================================================
// 3. INJECT HTML FOR HUD BAR, ARCHETYPE BAR, AND 64x64 SCALE BUTTON
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
                <div id="hud-power-sub" class="hud-metric-sub">Tokamak &amp; Turbines Online</div>
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
                <div id="hud-sec-sub" class="hud-metric-sub">Point-Defense &amp; Sentry Rover Active</div>
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
    console.log('[Step 3] Injected Colony HUD bar, Archetype bar, and 64x64 scale button');
}

// Update canvas width/height attribute to 520
content = content.replace(
    '<canvas id="local-colony-canvas" width="480" height="480"></canvas>',
    '<canvas id="local-colony-canvas" width="520" height="520"></canvas>'
);

// =========================================================================
// 4. INJECT ROOM IMPRESSIVENESS CARD AND QUICK ORDERS PANEL INTO .local-hud-panel
// =========================================================================
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
    console.log('[Step 4] Injected Room Inspector and Colonist Quick Orders into .local-hud-panel');
}

// =========================================================================
// 5. HOIST LOCAL SIMULATION STATE VARIABLES AT TOP OF LOCAL SCRIPT
// =========================================================================
const oldCollisionSystemStart = `        // =========================================================================
        // MODULAR ASSET COLLISION SYSTEM (MIRRORS C++ ezColonyCollisionModule)
        // =========================================================================`;

const hoistedStateVars = `        // =========================================================================
        // HOISTED COLONY STATE & TELEMETRY REGISTRY
        // =========================================================================
        var droneNetworkState = 'ALLIED'; // 'ALLIED', 'ROGUE', 'EMP_REBOOTING'
        var activeHazard = null; // null, 'aquifer_blowout', 'gas_pocket'
        var empShockwaveAlpha = 0;
        var empShockwaveRadius = 0;
        var activeTerrainBrush = null;
        var currentFortressArchetype = 'mountain';
        var selectedColonistIdx = null;

        // =========================================================================
        // MODULAR ASSET COLLISION SYSTEM (MIRRORS C++ ezColonyCollisionModule)
        // =========================================================================`;

if (!content.includes('var droneNetworkState = \'ALLIED\';')) {
    content = content.replace(oldCollisionSystemStart, hoistedStateVars);
    console.log('[Step 5] Hoisted simulation state variables at top of local script');
}

// Convert any lower let declarations of these to assignments
content = content.replace(/let droneNetworkState = 'ALLIED';[^\n]*\n/, '// droneNetworkState hoisted\n');
content = content.replace(/let activeHazard = null;[^\n]*\n/, '// activeHazard hoisted\n');
content = content.replace(/let empShockwaveAlpha = 0;\n/, '// empShockwaveAlpha hoisted\n');
content = content.replace(/let empShockwaveRadius = 0;\n/, '// empShockwaveRadius hoisted\n');
content = content.replace(/let activeTerrainBrush = null;\n/, '// activeTerrainBrush hoisted\n');

// =========================================================================
// 6. INJECT CONTINUOUS SWEPT COLLISION ENGINE
// =========================================================================
const oldBlockedFunc = `        // Airborne drone collision test: blocked by solid bedrock and plasteel blast walls,
        // but passes smoothly over low furniture (tables, chairs, desks, conveyors, crates)!
        function isDroneBlockedByWall(x, y, radius = 0.35) {
            if (x < 1.2 || x >= LOCAL_MAP_SIZE - 1.2 || y < 1.2 || y >= LOCAL_MAP_SIZE - 1.2) return true;
            if (!localColonyGrid || !localColonyGrid.length) return false;

            const minGX = Math.max(0, Math.floor(x - radius));
            const maxGX = Math.min(LOCAL_MAP_SIZE - 1, Math.floor(x + radius));
            const minGY = Math.max(0, Math.floor(y - radius));
            const maxGY = Math.min(LOCAL_MAP_SIZE - 1, Math.floor(y + radius));

            for (let gy = minGY; gy <= maxGY; gy++) {
                for (let gx = minGX; gx <= maxGX; gx++) {
                    const cell = localColonyGrid[gy][gx];
                    // Solid rock walls and plasteel blast walls block drones!
                    // Designated doorways (cell.isDoorway === true) allow drones to pass through!
                    if (cell.isWall && !cell.isDoorway) {
                        return true;
                    }
                }
            }
            return false;
        }`;

const newBlockedAndSwept = `        // Airborne drone collision test: blocked by solid bedrock and plasteel blast walls,
        // but passes smoothly over low furniture (tables, chairs, desks, conveyors, crates)!
        function isDroneBlockedByWall(x, y, radius = 0.35) {
            if (x < 1.2 || x >= LOCAL_MAP_SIZE - 1.2 || y < 1.2 || y >= LOCAL_MAP_SIZE - 1.2) return true;
            if (!localColonyGrid || !localColonyGrid.length) return false;

            const minGX = Math.max(0, Math.floor(x - radius));
            const maxGX = Math.min(LOCAL_MAP_SIZE - 1, Math.floor(x + radius));
            const minGY = Math.max(0, Math.floor(y - radius));
            const maxGY = Math.min(LOCAL_MAP_SIZE - 1, Math.floor(y + radius));

            for (let gy = minGY; gy <= maxGY; gy++) {
                for (let gx = minGX; gx <= maxGX; gx++) {
                    const cell = localColonyGrid[gy]?.[gx];
                    if (cell && cell.isWall && !cell.isDoorway) {
                        return true;
                    }
                }
            }
            return false;
        }

        // =========================================================================
        // CONTINUOUS SWEPT COLLISION ENGINE WITH EDGE CLAMPING & CORNER-CUT BLOCKING
        // =========================================================================
        function resolveContinuousMove(entity, vx, vy, radius = 0.32, isAirborne = false) {
            if (!localColonyGrid || !localColonyGrid.length) {
                entity.x += vx;
                entity.y += vy;
                return;
            }

            const stepLimit = 0.12; // Maximum sub-step size to prevent tunneling
            const totalDist = Math.hypot(vx, vy);
            const numSteps = Math.max(1, Math.ceil(totalDist / stepLimit));
            const stepVx = vx / numSteps;
            const stepVy = vy / numSteps;

            const checkBlocked = isAirborne ? isDroneBlockedByWall : isPositionBlocked;

            for (let s = 0; s < numSteps; s++) {
                const curX = entity.x;
                const curY = entity.y;

                // 1. Resolve X Axis
                let nextX = curX + stepVx;
                if (nextX - radius < 1.2) {
                    nextX = 1.2 + radius;
                    if (entity.vx !== undefined) entity.vx = Math.abs(entity.vx);
                } else if (nextX + radius > LOCAL_MAP_SIZE - 1.2) {
                    nextX = LOCAL_MAP_SIZE - 1.2 - radius;
                    if (entity.vx !== undefined) entity.vx = -Math.abs(entity.vx);
                } else if (checkBlocked(nextX, curY, radius)) {
                    if (entity.vx !== undefined) entity.vx = -entity.vx * (isAirborne ? 1.0 : 0.2);
                    const testCellX = stepVx > 0 ? Math.floor(nextX + radius) : Math.floor(nextX - radius);
                    if (stepVx > 0) {
                        nextX = Math.min(nextX, testCellX - radius - 0.02);
                    } else {
                        nextX = Math.max(nextX, testCellX + 1 + radius + 0.02);
                    }
                }
                entity.x = nextX;

                // 2. Resolve Y Axis
                let nextY = curY + stepVy;
                if (nextY - radius < 1.2) {
                    nextY = 1.2 + radius;
                    if (entity.vy !== undefined) entity.vy = Math.abs(entity.vy);
                } else if (nextY + radius > LOCAL_MAP_SIZE - 1.2) {
                    nextY = LOCAL_MAP_SIZE - 1.2 - radius;
                    if (entity.vy !== undefined) entity.vy = -Math.abs(entity.vy);
                } else if (checkBlocked(entity.x, nextY, radius)) {
                    if (entity.vy !== undefined) entity.vy = -entity.vy * (isAirborne ? 1.0 : 0.2);
                    const testCellY = stepVy > 0 ? Math.floor(nextY + radius) : Math.floor(nextY - radius);
                    if (stepVy > 0) {
                        nextY = Math.min(nextY, testCellY - radius - 0.02);
                    } else {
                        nextY = Math.max(nextY, testCellY + 1 + radius + 0.02);
                    }
                }
                entity.y = nextY;

                // 3. Diagonal Corner-Cutting Prevention (RimWorld / Dwarf Fortress Rule)
                const origCellX = Math.floor(curX);
                const origCellY = Math.floor(curY);
                const destCellX = Math.floor(entity.x);
                const destCellY = Math.floor(entity.y);

                if (destCellX !== origCellX && destCellY !== origCellY) {
                    const cornerBlocked1 = checkBlocked(destCellX + 0.5, origCellY + 0.5, 0.2);
                    const cornerBlocked2 = checkBlocked(origCellX + 0.5, destCellY + 0.5, 0.2);
                    if (cornerBlocked1 && cornerBlocked2) {
                        entity.x = curX;
                        entity.y = curY;
                        if (entity.vx !== undefined) entity.vx = -entity.vx;
                        if (entity.vy !== undefined) entity.vy = -entity.vy;
                        break;
                    }
                }
            }
        }`;

if (content.includes(oldBlockedFunc)) {
    content = content.replace(oldBlockedFunc, newBlockedAndSwept);
    console.log('[Step 6] Injected Continuous Swept Collision resolver with edge clamping');
}

// =========================================================================
// 7. INJECT FORTRESS ARCHETYPES AND 4-TIER ROOM PROGRESSION
// =========================================================================
const oldRoomsDefTarget = `        // =========================================================================
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

const newRoomsDef = `        // =========================================================================
        // FORTRESS EMBARK ARCHETYPES & 4-TIER ROOM PROGRESSION (RIMWORLD & DWARF FORTRESS)
        // =========================================================================
        const FORTRESS_ARCHETYPES = {
            mountain: {
                id: "mountain",
                name: "Mountain Stronghold",
                badge: "⛰️ MOUNTAIN STRONGHOLD",
                lore: "Dwarven excavation deep in basalt bedrock. Impenetrable granite ramparts, central feasting hall, deep magma foundry.",
                biomeHint: "Basalt Bedrock Caverns",
                rooms: [
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

if (content.includes(oldRoomsDefTarget)) {
    content = content.replace(oldRoomsDefTarget, newRoomsDef);
    console.log('[Step 7] Injected FORTRESS_ARCHETYPES with 4 archetypes and 4-tier progression');
}

// =========================================================================
// 8. UPDATE rebuildColonyCompoundLayout & setLocalMapScale
// =========================================================================
const oldRebuildAndScale = `        function rebuildColonyCompoundLayout() {
            const off = getCompoundOffset();
            DEPLOYED_COLONISTS = BASE_DEPLOYED_COLONISTS.map(c => ({ ...c, x: c.x + off.x, y: c.y + off.y }));
            DEPLOYED_BUILDINGS = BASE_DEPLOYED_BUILDINGS.map(b => ({ ...b, x: b.x + off.x, y: b.y + off.y }));
            DEPLOYED_FURNITURE = BASE_DEPLOYED_FURNITURE.map(f => ({ ...f, x: f.x + off.x, y: f.y + off.y }));
            DEPLOYED_CONVEYORS = BASE_DEPLOYED_CONVEYORS.map(cv => ({ ...cv, x: cv.x + off.x, y: cv.y + off.y }));
            DEPLOYED_DRONES = BASE_DEPLOYED_DRONES.map(d => ({
                ...d,
                x: d.x + off.x,
                y: d.y + off.y,
                baseX: d.baseX + off.x,
                baseY: d.baseY + off.y,
                vx: d.vx,
                vy: d.vy
            }));
        }
        rebuildColonyCompoundLayout();

        function setLocalMapScale(scale) {
            if (LOCAL_MAP_SIZE === scale) return;
            playTactileSound('click');
            LOCAL_MAP_SIZE = scale;
            const btn32 = document.getElementById("btn-scale-32");
            const btn48 = document.getElementById("btn-scale-48");
            if (btn32) btn32.classList.toggle("active", scale === 32);
            if (btn48) btn48.classList.toggle("active", scale === 48);
            const badge = document.getElementById("local-telemetry-badge");
            if (badge) {
                badge.innerText = \`TRANSLATION RATIO: 1 WORLD SECTOR -> \${scale}x\${scale} CELLS (\${scale * scale} TILES)\`;
            }
            rebuildColonyCompoundLayout();
            loadLocalColonySector(selectedSector.x, selectedSector.y);
        }`;

const newRebuildAndScale = `        function rebuildColonyCompoundLayout() {
            COLONY_ROOM_DEFS = FORTRESS_ARCHETYPES[currentFortressArchetype] 
                ? FORTRESS_ARCHETYPES[currentFortressArchetype].rooms 
                : FORTRESS_ARCHETYPES.mountain.rooms;
            const off = getCompoundOffset();
            DEPLOYED_COLONISTS = BASE_DEPLOYED_COLONISTS.map(c => ({
                ...c,
                x: c.x + off.x,
                y: c.y + off.y,
                targetX: c.x + off.x,
                targetY: c.y + off.y,
                isWalking: false,
                activeTask: 'idle'
            }));
            DEPLOYED_BUILDINGS = BASE_DEPLOYED_BUILDINGS.map(b => ({ ...b, x: b.x + off.x, y: b.y + off.y }));
            DEPLOYED_FURNITURE = BASE_DEPLOYED_FURNITURE.map(f => ({ ...f, x: f.x + off.x, y: f.y + off.y }));
            DEPLOYED_CONVEYORS = BASE_DEPLOYED_CONVEYORS.map(cv => ({ ...cv, x: cv.x + off.x, y: cv.y + off.y }));
            DEPLOYED_DRONES = BASE_DEPLOYED_DRONES.map(d => ({
                ...d,
                x: d.x + off.x,
                y: d.y + off.y,
                baseX: d.baseX + off.x,
                baseY: d.baseY + off.y,
                vx: d.vx,
                vy: d.vy
            }));
            updateColonyHUDTelemetry();
        }
        rebuildColonyCompoundLayout();

        function setLocalMapScale(scale) {
            if (LOCAL_MAP_SIZE === scale) return;
            playTactileSound('click');
            LOCAL_MAP_SIZE = scale;
            const btn32 = document.getElementById("btn-scale-32");
            const btn48 = document.getElementById("btn-scale-48");
            const btn64 = document.getElementById("btn-scale-64");
            if (btn32) btn32.classList.toggle("active", scale === 32);
            if (btn48) btn48.classList.toggle("active", scale === 48);
            if (btn64) btn64.classList.toggle("active", scale === 64);
            const badge = document.getElementById("local-telemetry-badge");
            if (badge) {
                badge.innerText = \`TRANSLATION RATIO: 1 WORLD SECTOR -> \${scale}x\${scale} CELLS (\${scale * scale} TILES)\`;
            }
            updateColonyHUDTelemetry();
            rebuildColonyCompoundLayout();
            loadLocalColonySector(selectedSector.x, selectedSector.y);
        }`;

if (content.includes(oldRebuildAndScale)) {
    content = content.replace(oldRebuildAndScale, newRebuildAndScale);
    console.log('[Step 8] Updated rebuildColonyCompoundLayout and setLocalMapScale for 64x64 scale');
}

// =========================================================================
// 9. FIX OPTIONAL CHAINING IN COLLISION HULL RENDERING
// =========================================================================
const oldHullRendering = `                        if (col.layer === CollisionLayer.Terrain) {
                            const gx = col.x;
                            const gy = col.y;
                            const hasN = (gy > 0 && localColonyGrid[gy-1][gx].isWall);
                            const hasE = (gx < LOCAL_MAP_SIZE - 1 && localColonyGrid[gy][gx+1].isWall);
                            const hasS = (gy < LOCAL_MAP_SIZE - 1 && localColonyGrid[gy+1][gx].isWall);
                            const hasW = (gx > 0 && localColonyGrid[gy][gx-1].isWall);`;

const newHullRendering = `                        if (col.layer === CollisionLayer.Terrain) {
                            const gx = col.x;
                            const gy = col.y;
                            const hasN = !!(localColonyGrid[gy - 1]?.[gx]?.isWall);
                            const hasE = !!(localColonyGrid[gy]?.[gx + 1]?.isWall);
                            const hasS = !!(localColonyGrid[gy + 1]?.[gx]?.isWall);
                            const hasW = !!(localColonyGrid[gy]?.[gx - 1]?.isWall);`;

if (content.includes(oldHullRendering)) {
    content = content.replace(oldHullRendering, newHullRendering);
    console.log('[Step 9] Fixed optional chaining in terrain collision hull rendering');
}

// =========================================================================
// 10. UPDATE loadLocalColonySector FOR TIERED ROOM PERIMETERS AND FLOORS
// =========================================================================
const oldRoomCarve = `            // 2. Carve and Autotile Registered Rooms with Plasteel Walls
            COLONY_ROOM_DEFS.forEach(room => {
                const floorKey = room.id === "hydro_lab" ? "floor_spore" :
                                 room.id === "tokamak_vault" ? "floor_hazard" :
                                 room.id === "logistics_yard" ? "floor_plating" : "floor_basalt";

                // Carve Floor
                for (let ry = room.y; ry < room.y + room.h; ry++) {
                    for (let rx = room.x; rx < room.x + room.w; rx++) {
                        if (rx >= 0 && rx < LOCAL_MAP_SIZE && ry >= 0 && ry < LOCAL_MAP_SIZE) {
                            const cell = localColonyGrid[ry][rx];
                            cell.terrain = floorKey;
                            cell.isWall = false;
                            cell.walkSpeed = 100;
                            cell.roomId = room.id;
                        }
                    }
                }

                // Place Perimeter Plasteel Walls
                const minX = room.x - 1;
                const maxX = room.x + room.w;
                const minY = room.y - 1;
                const maxY = room.y + room.h;

                for (let py = minY; py <= maxY; py++) {
                    for (let px = minX; px <= maxX; px++) {
                        if (px === minX || px === maxX || py === minY || py === maxY) {
                            if (px >= 0 && px < LOCAL_MAP_SIZE && py >= 0 && py < LOCAL_MAP_SIZE) {
                                const c = localColonyGrid[py][px];
                                const isDoor = room.doors && room.doors.some(d => d.x === px && d.y === py);
                                if (isDoor) {
                                    c.terrain = "door_blast";
                                    c.isWall = false;
                                    c.isDoorway = true;
                                    c.walkSpeed = 100;
                                } else if (!c.isDoorway) {
                                    c.terrain = "wall_blast_auto";
                                    c.isWall = true;
                                    c.isAuto = true;
                                    c.walkSpeed = 0;
                                }
                            }
                        }
                    }
                }
            });`;

const newRoomCarve = `            // 2. Carve and Autotile Registered Rooms with Plasteel Walls & Authentic Floors
            COLONY_ROOM_DEFS.forEach(room => {
                const floorKey = room.floorType || (
                    room.id === "hydro_lab" ? "floor_spore" :
                    room.id === "tokamak_vault" ? "floor_hazard" :
                    room.id === "logistics_yard" ? "floor_plating" :
                    room.id === "drone_hangar" ? "floor_plating" :
                    room.id === "killbox" ? "floor_grate" : "floor_basalt"
                );

                // Carve Floor & Assign Room Metadata
                for (let ry = room.y; ry < room.y + room.h; ry++) {
                    for (let rx = room.x; rx < room.x + room.w; rx++) {
                        if (rx >= 0 && rx < LOCAL_MAP_SIZE && ry >= 0 && ry < LOCAL_MAP_SIZE) {
                            const cell = localColonyGrid[ry][rx];
                            cell.terrain = floorKey;
                            cell.isWall = false;
                            cell.walkSpeed = 100;
                            cell.roomId = room.id;
                            cell.roomDef = room;
                        }
                    }
                }

                // Place Perimeter Plasteel Blast Walls with Open Blast Hatch Doorways
                const minX = room.x - 1;
                const maxX = room.x + room.w;
                const minY = room.y - 1;
                const maxY = room.y + room.h;

                for (let py = minY; py <= maxY; py++) {
                    for (let px = minX; px <= maxX; px++) {
                        if (px === minX || px === maxX || py === minY || py === maxY) {
                            if (px >= 0 && px < LOCAL_MAP_SIZE && py >= 0 && py < LOCAL_MAP_SIZE) {
                                const c = localColonyGrid[py][px];
                                const isDoor = room.doors && room.doors.some(d => d.x === px && d.y === py);
                                if (isDoor) {
                                    c.terrain = "door_blast";
                                    c.isWall = false;
                                    c.isDoorway = true;
                                    c.walkSpeed = 100;
                                } else if (!c.isDoorway) {
                                    c.terrain = "wall_blast_auto";
                                    c.isWall = true;
                                    c.isAuto = true;
                                    c.walkSpeed = 0;
                                }
                            }
                        }
                    }
                }
            });`;

if (content.includes(oldRoomCarve)) {
    content = content.replace(oldRoomCarve, newRoomCarve);
    console.log('[Step 10] Updated loadLocalColonySector for tiered room perimeters and floors');
}

// =========================================================================
// 11. UPDATE COLONIST MOVEMENT & ROOM OVERLAY IN renderLocalColony
// =========================================================================
const oldColonistAnim = `            // 2. Colonist Movement & Interpolation
            DEPLOYED_COLONISTS.forEach(colonist => {
                if (colonist.isWalking) {
                    const dx = colonist.targetX - colonist.x;
                    const dy = colonist.targetY - colonist.y;
                    const dist = Math.hypot(dx, dy);
                    const speed = 0.04;
                    if (dist > speed) {
                        colonist.x += (dx / dist) * speed;
                        colonist.y += (dy / dist) * speed;
                    } else {
                        colonist.x = colonist.targetX;
                        colonist.y = colonist.targetY;
                        colonist.isWalking = false;
                    }
                }
            });`;

const newColonistAnim = `            // 2. Colonist Movement & Swept Obstacle Resolution
            DEPLOYED_COLONISTS.forEach(colonist => {
                if (colonist.isWalking && (colonist.targetX !== undefined)) {
                    const dx = colonist.targetX - colonist.x;
                    const dy = colonist.targetY - colonist.y;
                    const dist = Math.hypot(dx, dy);
                    const speed = 0.055;
                    if (dist > speed) {
                        const vx = (dx / dist) * speed;
                        const vy = (dy / dist) * speed;
                        resolveContinuousMove(colonist, vx, vy, 0.28, false);
                    } else {
                        colonist.x = colonist.targetX;
                        colonist.y = colonist.targetY;
                        colonist.isWalking = false;
                        if (colonist.activeTask && colonist.activeTask !== 'idle') {
                            showColonyToast(\`✅ \${colonist.name.split(' ')[0]} reached workstation for \${colonist.activeTask.toUpperCase()}!\`, 'var(--accent-green)');
                        }
                    }
                }
            });`;

if (content.includes(oldColonistAnim)) {
    content = content.replace(oldColonistAnim, newColonistAnim);
    console.log('[Step 11] Updated colonist movement resolution with resolveContinuousMove');
}

// Update Drone physics to use resolveContinuousMove
const oldDronePhysics = `                // Continuous position update
                drone.x += drone.vx;
                drone.y += drone.vy;

                // Wall & sector boundary bouncing
                const dRadius = 0.35;
                if (isDroneBlockedByWall(drone.x + drone.vx, drone.y, dRadius)) {
                    drone.vx = -drone.vx;
                }
                if (isDroneBlockedByWall(drone.x, drone.y + drone.vy, dRadius)) {
                    drone.vy = -drone.vy;
                }`;

const newDronePhysics = `                // Continuous swept physics: flies over low furniture, strictly bounces off walls!
                const dRadius = 0.35;
                resolveContinuousMove(drone, drone.vx, drone.vy, dRadius, true);`;

if (content.includes(oldDronePhysics)) {
    content = content.replace(oldDronePhysics, newDronePhysics);
    console.log('[Step 12] Updated airborne drone physics to use resolveContinuousMove');
}

// =========================================================================
// 12. DRAW PATHING LINES AND HALO FOR SELECTED COLONIST IN renderLocalColony
// =========================================================================
const oldDrawColonist = `                // Colonist Avatar Thumbnail
                if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
                    localCtx.drawImage(avatarImg, px + 2, py + 2, cellSize - 4, cellSize - 4);
                } else {
                    localCtx.fillStyle = p.color;
                    localCtx.beginPath();
                    localCtx.arc(px + cellSize * 0.5, py + cellSize * 0.5, cellSize * 0.35, 0, Math.PI * 2);
                    localCtx.fill();
                }`;

const newDrawColonist = `                // Colonist Avatar Thumbnail & Selection Halo
                const isSelected = (selectedColonistIdx !== null && DEPLOYED_COLONISTS[selectedColonistIdx] === p);
                if (isSelected) {
                    localCtx.save();
                    localCtx.strokeStyle = "rgba(56, 189, 248, 0.95)";
                    localCtx.lineWidth = 2;
                    localCtx.beginPath();
                    localCtx.arc(px + cellSize * 0.5, py + cellSize * 0.5, cellSize * 0.48, 0, Math.PI * 2);
                    localCtx.stroke();
                    localCtx.restore();

                    // Draw destination line if walking
                    if (p.isWalking && p.targetX !== undefined) {
                        const targetPx = p.targetX * cellSize - offsetX + cellSize * 0.5;
                        const targetPy = p.targetY * cellSize - offsetY + cellSize * 0.5;
                        localCtx.save();
                        localCtx.strokeStyle = "rgba(56, 189, 248, 0.75)";
                        localCtx.setLineDash([4, 4]);
                        localCtx.lineWidth = 1.5;
                        localCtx.beginPath();
                        localCtx.moveTo(px + cellSize * 0.5, py + cellSize * 0.5);
                        localCtx.lineTo(targetPx, targetPy);
                        localCtx.stroke();
                        localCtx.setLineDash([]);

                        // Target crosshair
                        localCtx.strokeStyle = "#38bdf8";
                        localCtx.beginPath();
                        localCtx.arc(targetPx, targetPy, 5, 0, Math.PI * 2);
                        localCtx.moveTo(targetPx - 8, targetPy); localCtx.lineTo(targetPx + 8, targetPy);
                        localCtx.moveTo(targetPx, targetPy - 8); localCtx.lineTo(targetPx, targetPy + 8);
                        localCtx.stroke();
                        localCtx.restore();
                    }
                }

                if (avatarImg && avatarImg.complete && avatarImg.naturalWidth > 0) {
                    localCtx.drawImage(avatarImg, px + 2, py + 2, cellSize - 4, cellSize - 4);
                } else {
                    localCtx.fillStyle = p.color;
                    localCtx.beginPath();
                    localCtx.arc(px + cellSize * 0.5, py + cellSize * 0.5, cellSize * 0.35, 0, Math.PI * 2);
                    localCtx.fill();
                }`;

if (content.includes(oldDrawColonist)) {
    content = content.replace(oldDrawColonist, newDrawColonist);
    console.log('[Step 13] Injected colonist selection halo and path target crosshair');
}

// =========================================================================
// 13. UPDATE CANVAS CLICK HANDLER FOR COLONIST SELECTION & PATHING
// =========================================================================
const oldCanvasClick = `        function handleLocalCanvasClick(e) {
            const rect = e.target.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const cellSize = getLocalCellSize();
            const { offsetX, offsetY } = getLocalViewportOffsets(cellSize);

            const gx = Math.floor((clickX + offsetX) / cellSize);
            const gy = Math.floor((clickY + offsetY) / cellSize);

            if (gx >= 0 && gx < LOCAL_MAP_SIZE && gy >= 0 && gy < LOCAL_MAP_SIZE) {
                if (activeTerrainBrush && localColonyGrid[gy] && localColonyGrid[gy][gx]) {
                    paintCell(gx, gy, activeTerrainBrush);
                    playTactileSound('click');
                } else {
                    playTactileSound('click');
                    updateLocalInspectBox(gx, gy);
                }
            }
        }`;

const newCanvasClick = `        function handleLocalCanvasClick(e) {
            const rect = e.target.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const cellSize = getLocalCellSize();
            const { offsetX, offsetY } = getLocalViewportOffsets(cellSize);

            const gx = Math.floor((clickX + offsetX) / cellSize);
            const gy = Math.floor((clickY + offsetY) / cellSize);

            if (gx >= 0 && gx < LOCAL_MAP_SIZE && gy >= 0 && gy < LOCAL_MAP_SIZE) {
                // Check if clicked directly on a colonist
                const clickedPawnIdx = DEPLOYED_COLONISTS.findIndex(p => Math.floor(p.x) === gx && Math.floor(p.y) === gy);
                if (clickedPawnIdx !== -1) {
                    selectColonist(clickedPawnIdx);
                    return;
                }

                // If a terrain brush is active, paint
                if (activeTerrainBrush && localColonyGrid[gy]?.[gx]) {
                    paintCell(gx, gy, activeTerrainBrush);
                    playTactileSound('click');
                    return;
                }

                // If a colonist is selected and clicked an open cell, order move
                if (selectedColonistIdx !== null) {
                    const pawn = DEPLOYED_COLONISTS[selectedColonistIdx];
                    const targetCell = localColonyGrid[gy]?.[gx];
                    if (pawn && targetCell && !targetCell.isWall) {
                        pawn.targetX = gx + 0.5;
                        pawn.targetY = gy + 0.5;
                        pawn.isWalking = true;
                        pawn.activeTask = 'move';
                        playTactileSound('click');
                        showColonyToast(\`🚶 \${pawn.name.split(' ')[0]} ordered to move to [\${gx}, \${gy}]\`);
                        updateLocalInspectBox(gx, gy);
                        renderLocalColony();
                        return;
                    }
                }

                // Default: Inspect Cell
                playTactileSound('click');
                updateLocalInspectBox(gx, gy);
            }
        }`;

if (content.includes(oldCanvasClick)) {
    content = content.replace(oldCanvasClick, newCanvasClick);
    console.log('[Step 14] Injected interactive click-to-move colonist pathing in handleLocalCanvasClick');
}

// =========================================================================
// 14. UPDATE updateLocalInspectBox FOR ROOM IMPRESSIVENESS LIVE CARDS
// =========================================================================
const oldInspectBoxUpdate = `            // Update inspect box
            const inspectBox = document.getElementById("local-inspect-box");
            if (inspectBox) {
                let pawnText = pawn ? \` · COLONIST: \${pawn.name.toUpperCase()} (\${pawn.role.toUpperCase()})\` : "";
                let hazardText = cell.isLava ? " · [HAZARD: MOLTEN LAVA]" : (cell.isIce ? " · [SURFACE: CRYO PERMAFROST]" : "");
                let oreText = cell.oreType ? \` · [MINERAL VEIN: \${cell.oreType.toUpperCase()}]\` : "";
                let roomText = cell.roomId ? \` · [ZONE: \${cell.roomId.toUpperCase()}]\` : "";
                inspectBox.innerHTML = \`<strong>CELL [\${gx}, \${gy}]</strong> · \${tileDef.name.toUpperCase()} · TEMP: \${displayTemp}°C · WALK: \${tileDef.walkSpeed}%\${pawnText}\${hazardText}\${oreText}\${roomText}\`;
            }`;

const newInspectBoxUpdate = `            // Update inspect box
            const inspectBox = document.getElementById("local-inspect-box");
            if (inspectBox) {
                let pawnText = pawn ? \` · <span style="color:var(--accent-green);font-weight:bold;">COLONIST: \${pawn.name.toUpperCase()} (\${pawn.role.toUpperCase()})</span>\` : "";
                let hazardText = cell.isLava ? " · <span style=\"color:var(--accent-red);font-weight:bold;\">[HAZARD: MOLTEN LAVA]</span>" : (cell.isIce ? " · [SURFACE: CRYO PERMAFROST]" : "");
                let oreText = cell.oreType ? \` · <span style="color:var(--accent-amber);font-weight:bold;">[MINERAL: \${cell.oreType.toUpperCase()}]</span>\` : "";
                let roomText = cell.roomId ? \` · <span style="color:var(--accent-cyan);font-weight:bold;">[ZONE: \${cell.roomId.toUpperCase()}]</span>\` : "";
                inspectBox.innerHTML = \`<strong>CELL [\${gx}, \${gy}]</strong> · \${tileDef.name.toUpperCase()} · TEMP: \${displayTemp}°C · WALK: \${tileDef.walkSpeed}%\${pawnText}\${hazardText}\${oreText}\${roomText}\`;
            }

            // Update RimWorld / Dwarf Fortress Room Impressiveness Card
            if (cell.roomDef) {
                const r = cell.roomDef;
                const rName = document.getElementById("room-name");
                const rTier = document.getElementById("room-tier-badge");
                const rVal = document.getElementById("room-impress-val");
                const rMeter = document.getElementById("room-meter-fill");
                const rSpace = document.getElementById("room-space-val");
                const rBeauty = document.getElementById("room-beauty-val");
                const rClean = document.getElementById("room-clean-val");
                const rTemp = document.getElementById("room-temp-val");
                const rBuffs = document.getElementById("room-mood-buffs");

                if (rName) rName.innerText = r.name.toUpperCase();
                if (rTier) {
                    rTier.innerText = r.tierName || "TIER 1 SUBSISTENCE";
                    rTier.style.color = r.tierLevel === 4 ? "#38bdf8" : r.tierLevel === 3 ? "#ef4444" : r.tierLevel === 2 ? "#c084fc" : "#22c55e";
                }
                if (rVal) {
                    const quality = r.impressiveness > 170 ? "Wonder of the World" : r.impressiveness > 140 ? "Extravagantly Impressive" : r.impressiveness > 115 ? "Extremely Impressive" : "Decent";
                    rVal.innerText = \`\${r.impressiveness} (\${quality})\`;
                }
                if (rMeter) rMeter.style.width = \`\${Math.min(100, Math.max(10, Math.round(r.impressiveness / 2))) }%\`;
                if (rSpace) rSpace.innerText = \`\${r.space || (r.w * r.h)} m²\`;
                if (rBeauty) rBeauty.innerText = \`+\${r.beauty || 25}\`;
                if (rClean) rClean.innerText = \`\${r.cleanliness || 0.95} Clean\`;
                if (rTemp) rTemp.innerText = \`\${displayTemp}°C\`;
                if (rBuffs && r.moodBuff) {
                    rBuffs.innerHTML = \`<span class="mood-buff-tag">\${r.moodBuff}</span><span class="mood-buff-tag" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #7dd3fc;">+5 Lithophone Joy</span><span class="mood-buff-tag" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); color: #fcd34d;">+4 Well-Lit</span>\`;
                }
            }`;

if (content.includes(oldInspectBoxUpdate)) {
    content = content.replace(oldInspectBoxUpdate, newInspectBoxUpdate);
    console.log('[Step 15] Updated updateLocalInspectBox with live Room Impressiveness updates');
}

// =========================================================================
// 15. INJECT INTERACTION & TELEMETRY CONTROLLERS BEFORE window.addEventListener
// =========================================================================
const oldWindowLoad = `        // Initialize on page load
        window.addEventListener("load", () => {`;

const newControllersAndLoad = `        // =========================================================================
        // COLONY TELEMETRY, ORDERS, AND INTERACTIVE HUD HANDLERS
        // =========================================================================
        function updateColonyHUDTelemetry() {
            const popVal = document.getElementById("hud-pop-val");
            const powerVal = document.getElementById("hud-power-val");
            const foodVal = document.getElementById("hud-food-val");
            const wealthVal = document.getElementById("hud-wealth-val");
            const secVal = document.getElementById("hud-sec-val");
            const archVal = document.getElementById("hud-arch-val");
            const archSub = document.getElementById("hud-arch-sub");

            if (popVal) popVal.innerText = \`\${DEPLOYED_COLONISTS.length} ACTIVE\`;
            if (powerVal) {
                const pSurplus = Math.round(580 + (LOCAL_MAP_SIZE === 64 ? 360 : LOCAL_MAP_SIZE === 48 ? 160 : 0));
                powerVal.innerText = \`+\${pSurplus} kW\`;
            }
            if (foodVal) foodVal.innerText = \`\${36 + Math.floor(currentSeed % 20)} DAYS\`;
            if (wealthVal) {
                const totalWealth = (LOCAL_MAP_SIZE === 64 ? 86400 : LOCAL_MAP_SIZE === 48 ? 64200 : 48500) + Math.floor(currentSeed % 9000);
                wealthVal.innerText = \`\${totalWealth.toLocaleString()} Ag\`;
            }
            if (secVal) {
                secVal.innerText = (droneNetworkState === 'ROGUE') ? 'DEFCON 1' : 'GREEN';
                secVal.style.color = (droneNetworkState === 'ROGUE') ? 'var(--accent-red)' : 'var(--accent-green)';
            }
            if (archVal && FORTRESS_ARCHETYPES[currentFortressArchetype]) {
                archVal.innerText = FORTRESS_ARCHETYPES[currentFortressArchetype].name.toUpperCase();
            }
            if (archSub) {
                archSub.innerText = \`\${LOCAL_MAP_SIZE}×\${LOCAL_MAP_SIZE} · Seed #\${currentSeed}\`;
            }
        }

        function selectFortressArchetype(archKey) {
            if (!FORTRESS_ARCHETYPES[archKey]) return;
            playTactileSound('click');
            currentFortressArchetype = archKey;
            ['mountain', 'aquifer', 'volcanic', 'spore_warren'].forEach(k => {
                const btn = document.getElementById(\`btn-arch-\${k}\`);
                if (btn) btn.classList.toggle('active', k === archKey);
            });
            const arch = FORTRESS_ARCHETYPES[archKey];
            if (archKey === 'mountain') jumpToSector(2, 4);
            else if (archKey === 'aquifer') jumpToSector(4, 3);
            else if (archKey === 'volcanic') jumpToSector(1, 2);
            else if (archKey === 'spore_warren') jumpToSector(6, 1);
            showColonyToast(\`🏛️ EMBARK ARCHETYPE SET: \${arch.name.toUpperCase()}\`, 'var(--accent-amber)');
        }

        function rerollEmbarkSeed() {
            playTactileSound('click');
            currentSeed = Math.floor(Math.random() * 899999) + 100000;
            selectedSector.x = Math.floor(Math.random() * 8);
            selectedSector.y = Math.floor(Math.random() * 8);
            updateReticlePosition();
            updateSectorIntel();
            loadLocalColonySector(selectedSector.x, selectedSector.y);
            updateColonyHUDTelemetry();
            showColonyToast(\`🎲 EMBARKED ON NEW PROCEDURAL SEED #\${currentSeed}!\`, 'var(--accent-green)');
        }

        function selectColonist(idx) {
            selectedColonistIdx = idx;
            const pawn = DEPLOYED_COLONISTS[idx];
            if (pawn) {
                selectArchetype(pawn.arch);
                localHoverCell = { x: Math.floor(pawn.x), y: Math.floor(pawn.y) };
                updateLocalInspectBox(localHoverCell.x, localHoverCell.y);
                const label = document.getElementById('active-selected-colonist-label');
                if (label) label.innerText = \`[SELECTED: \${pawn.name.toUpperCase()}]\`;
                playTactileSound('click');
                renderLocalColony();
            }
        }

        function orderColonistTask(taskType) {
            playTactileSound('click');
            let pawn = (selectedColonistIdx !== null) ? DEPLOYED_COLONISTS[selectedColonistIdx] : null;

            if (taskType === 'mine') {
                if (!pawn || pawn.arch !== 'miner') {
                    selectColonist(0);
                    pawn = DEPLOYED_COLONISTS[0];
                }
                let targetCell = null;
                let minDist = Infinity;
                for (let y = 1; y < LOCAL_MAP_SIZE - 1; y++) {
                    for (let x = 1; x < LOCAL_MAP_SIZE - 1; x++) {
                        const c = localColonyGrid[y]?.[x];
                        if (c && c.oreType && c.isWall) {
                            const d = Math.hypot(x - pawn.x, y - pawn.y);
                            if (d < minDist) {
                                minDist = d;
                                targetCell = { x, y };
                            }
                        }
                    }
                }
                if (targetCell) {
                    const dirs = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}];
                    let standTile = targetCell;
                    for (const dir of dirs) {
                        const nx = targetCell.x + dir.x;
                        const ny = targetCell.y + dir.y;
                        if (localColonyGrid[ny]?.[nx] && !localColonyGrid[ny][nx].isWall) {
                            standTile = { x: nx + 0.5, y: ny + 0.5 };
                            break;
                        }
                    }
                    pawn.targetX = standTile.x;
                    pawn.targetY = standTile.y;
                    pawn.isWalking = true;
                    pawn.activeTask = 'mining';
                    showColonyToast(\`⚒️ \${pawn.name.split(' ')[0]} pathing to mine \${localColonyGrid[targetCell.y][targetCell.x].oreType.toUpperCase()}!\`);
                }
            } else if (taskType === 'smelt') {
                selectColonist(1);
                pawn = DEPLOYED_COLONISTS[1];
                const smelter = DEPLOYED_BUILDINGS.find(b => b.key === 'smelter');
                if (smelter) {
                    pawn.targetX = smelter.x + 1.0;
                    pawn.targetY = smelter.y + smelter.h + 0.5;
                    pawn.isWalking = true;
                    pawn.activeTask = 'smelting';
                    showColonyToast(\`⚙️ \${pawn.name.split(' ')[0]} manning Electric Arc Smelter!\`);
                }
            } else if (taskType === 'crops') {
                selectColonist(2);
                pawn = DEPLOYED_COLONISTS[2];
                const hydro = DEPLOYED_BUILDINGS.find(b => b.key === 'hydro');
                if (hydro) {
                    pawn.targetX = hydro.x + 1.0;
                    pawn.targetY = hydro.y + hydro.h + 0.5;
                    pawn.isWalking = true;
                    pawn.activeTask = 'farming';
                    showColonyToast(\`🌿 \${pawn.name.split(' ')[0]} tending Hydroponics crops!\`);
                }
            } else if (taskType === 'killbox') {
                selectColonist(3);
                pawn = DEPLOYED_COLONISTS[3];
                const turret = DEPLOYED_BUILDINGS.find(b => b.key === 'turret');
                const off = getCompoundOffset();
                pawn.targetX = turret ? (turret.x + 0.5) : (19 + off.x);
                pawn.targetY = turret ? (turret.y + 1.5) : (17 + off.y);
                pawn.isWalking = true;
                pawn.activeTask = 'defending';
                showColonyToast(\`🛡️ \${pawn.name.split(' ')[0]} fortifying Killbox chokepoint!\`);
            } else if (taskType === 'recreation') {
                if (!pawn) {
                    selectColonist(0);
                    pawn = DEPLOYED_COLONISTS[0];
                }
                const table = DEPLOYED_FURNITURE.find(f => f.key === 'furn_table');
                if (table) {
                    pawn.targetX = table.x + 1.0;
                    pawn.targetY = table.y + 1.8;
                    pawn.isWalking = true;
                    pawn.activeTask = 'dining';
                    showColonyToast(\`🍺 \${pawn.name.split(' ')[0]} taking recreation in Mess Hall (+8 Mood)!\`);
                }
            } else if (taskType === 'clear') {
                DEPLOYED_COLONISTS.forEach(p => {
                    p.isWalking = false;
                    p.activeTask = 'idle';
                });
                const label = document.getElementById('active-selected-colonist-label');
                if (label) label.innerText = '[ORDERS CLEARED]';
                showColonyToast('All colonist orders cleared.');
            }
        }

        function showColonyToast(msg, color = 'var(--accent-amber)') {
            const container = document.getElementById("local-canvas-container");
            if (!container) return;
            const toast = document.createElement("div");
            toast.style.position = "absolute";
            toast.style.top = "14px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.background = "rgba(10, 16, 32, 0.95)";
            toast.style.border = \`1px solid \${color}\`;
            toast.style.color = "#f1f5f9";
            toast.style.padding = "6px 14px";
            toast.style.fontWeight = "bold";
            toast.style.fontFamily = "var(--font-mono)";
            toast.style.fontSize = "10px";
            toast.style.letterSpacing = "0.5px";
            toast.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.85)";
            toast.style.zIndex = "120";
            toast.style.borderRadius = "3px";
            toast.style.pointerEvents = "none";
            toast.innerHTML = msg;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.transition = "opacity 0.4s";
                toast.style.opacity = "0";
                setTimeout(() => toast.remove(), 400);
            }, 2400);
        }

        // Initialize on page load
        window.addEventListener("load", () => {`;

if (content.includes(oldWindowLoad)) {
    content = content.replace(oldWindowLoad, newControllersAndLoad);
    console.log('[Step 16] Injected Interaction & Telemetry Controllers');
}

// Convert line endings back if needed
if (hadCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

// =========================================================================
// 16. VALIDATE SCRIPT SYNTAX BEFORE WRITING
// =========================================================================
const scripts = content.match(/<script>([\s\S]*?)<\/script>/gi);
if (scripts) {
    console.log('Validating', scripts.length, 'embedded script blocks...');
    scripts.forEach((s, idx) => {
        const code = s.replace(/<\/?script>/gi, '');
        new vm.Script(code);
        console.log('Script ' + idx + ' syntax valid (' + code.length + ' chars)');
    });
}

// Write to all three locations
fs.writeFileSync(srcPath, content, 'utf8');
console.log('Successfully wrote to:', srcPath);

fs.writeFileSync(dest1, content, 'utf8');
console.log('Successfully wrote to:', dest1);

fs.writeFileSync(dest2, content, 'utf8');
console.log('Successfully wrote to:', dest2);

console.log('ALL THREE SHOWCASE FILES ARE SYNCHRONIZED AND VALIDATED!');
