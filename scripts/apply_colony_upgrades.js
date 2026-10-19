const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../docs/showcase/index.html');
let content = fs.readFileSync(targetPath, 'utf8');

console.log('Original character count:', content.length);

// 1. UPDATE CSS FOR 520px CANVAS AND HUD/INSPECTOR
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
    console.log('Updated colony layout CSS to 520px');
} else {
    console.log('WARNING: oldCSS not found directly, checking variations...');
}

// 2. ADD HUD BAR & ROOM INSPECTOR STYLES BEFORE </style>
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
    console.log('Injected new HUD & Inspector styles');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully saved stage 1 of upgrade');
