const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../docs/showcase/index.html');
let content = fs.readFileSync(targetPath, 'utf8');

const hadCRLF = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

// 1. DATA-DRIVEN ROOM WALLS IN loadLocalColonySector
const oldHardcodedWalls = `            // Mess Hall perimeter walls
            for (let x = 8 + off.x; x <= 15 + off.x; x++) placeRoomWall(x, 7 + off.y);
            for (let y = 7 + off.y; y <= 12 + off.y; y++) placeRoomWall(8 + off.x, y);
            for (let y = 7 + off.y; y <= 12 + off.y; y++) placeRoomWall(15 + off.x, y);
            for (let x = 6 + off.x; x <= 15 + off.x; x++) placeRoomWall(x, 12 + off.y);

            // Hydroponics & Research Lab walls
            for (let y = 12 + off.y; y <= 17 + off.y; y++) placeRoomWall(6 + off.x, y);
            for (let x = 6 + off.x; x <= 10 + off.x; x++) placeRoomWall(x, 17 + off.y);
            for (let y = 12 + off.y; y <= 17 + off.y; y++) placeRoomWall(10 + off.x, y);

            // Tokamak Reactor Vault walls
            for (let x = 10 + off.x; x <= 15 + off.x; x++) placeRoomWall(x, 17 + off.y);
            for (let y = 12 + off.y; y <= 17 + off.y; y++) placeRoomWall(15 + off.x, y);

            // Logistics & Fabrication Yard perimeter
            for (let x = 15 + off.x; x <= 25 + off.x; x++) placeRoomWall(x, 7 + off.y);
            for (let y = 7 + off.y; y <= 16 + off.y; y++) placeRoomWall(25 + off.x, y);
            for (let x = 15 + off.x; x <= 25 + off.x; x++) placeRoomWall(x, 16 + off.y);`;

const newDynamicWalls = `            // Data-driven room perimeter blast walls for active Fortress Archetype
            COLONY_ROOM_DEFS.forEach(r => {
                const rx = r.x + off.x;
                const ry = r.y + off.y;
                for (let x = rx; x <= rx + r.w; x++) {
                    placeRoomWall(x, ry);
                    placeRoomWall(x, ry + r.h);
                }
                for (let y = ry; y <= ry + r.h; y++) {
                    placeRoomWall(rx, y);
                    placeRoomWall(rx + r.w, y);
                }
            });`;

if (content.includes(oldHardcodedWalls)) {
    content = content.replace(oldHardcodedWalls, newDynamicWalls);
    console.log('[1/4] Replaced hardcoded room walls with data-driven archetype wall generator');
}

// 2. DATA-DRIVEN ROOM FLOORING IN loadLocalColonySector
const oldHardcodedFloors = `            // 1. Assign room-specific flooring
            COLONY_ROOM_DEFS.forEach(room => {
                const rx = room.x + off.x;
                const ry = room.y + off.y;
                for (let y = ry; y < ry + room.h; y++) {
                    for (let x = rx; x < rx + room.w; x++) {
                        if (y < 0 || y >= LOCAL_MAP_SIZE || x < 0 || x >= LOCAL_MAP_SIZE) continue;
                        const cell = localColonyGrid[y][x];
                        if (cell.isWall) continue;
                        if (room.id === 'mess_hall') {
                            cell.terrain = "excavated_basalt";
                            cell.floorSpriteKey = \`floor_basalt_\${getFloorVariantIndex(x, y, currentSeed, 8)}\`;
                        } else if (room.id === 'hydro_lab') {
                            cell.terrain = "spore_humus";
                            cell.floorSpriteKey = \`floor_spore_\${getFloorVariantIndex(x, y, currentSeed, 4)}\`;
                        } else if (room.id === 'tokamak_vault') {
                            cell.terrain = "hazard_plating";
                            cell.floorSpriteKey = ((x + y) % 2 === 0) ? "floor_hazard_0" : "floor_grate";
                        } else if (room.id === 'logistics_yard') {
                            cell.terrain = "precursor_alloy_floor";
                            cell.floorSpriteKey = \`floor_plating_\${getFloorVariantIndex(x, y, currentSeed, 4)}\`;
                        }
                    }
                }
            });`;

const newDynamicFloors = `            // 1. Assign room-specific flooring across all 4 progression tiers
            COLONY_ROOM_DEFS.forEach(room => {
                const rx = room.x + off.x;
                const ry = room.y + off.y;
                for (let y = ry + 1; y < ry + room.h; y++) {
                    for (let x = rx + 1; x < rx + room.w; x++) {
                        if (y < 0 || y >= LOCAL_MAP_SIZE || x < 0 || x >= LOCAL_MAP_SIZE) continue;
                        const cell = localColonyGrid[y][x];
                        if (cell.isWall) continue;
                        cell.room = room.id;
                        if (room.floorType === 'floor_plating') {
                            cell.terrain = "precursor_alloy_floor";
                            cell.floorSpriteKey = \`floor_plating_\${getFloorVariantIndex(x, y, currentSeed, 4)}\`;
                        } else if (room.floorType === 'floor_spore') {
                            cell.terrain = "spore_humus";
                            cell.floorSpriteKey = \`floor_spore_\${getFloorVariantIndex(x, y, currentSeed, 4)}\`;
                        } else if (room.floorType === 'floor_hazard') {
                            cell.terrain = "hazard_plating";
                            cell.floorSpriteKey = ((x + y) % 2 === 0) ? "floor_hazard_0" : "floor_grate";
                        } else if (room.floorType === 'floor_grate') {
                            cell.terrain = "catwalk_grate";
                            cell.floorSpriteKey = "floor_grate";
                        } else {
                            cell.terrain = "excavated_basalt";
                            cell.floorSpriteKey = \`floor_basalt_\${getFloorVariantIndex(x, y, currentSeed, 8)}\`;
                        }
                    }
                }
            });`;

if (content.includes(oldHardcodedFloors)) {
    content = content.replace(oldHardcodedFloors, newDynamicFloors);
    console.log('[2/4] Replaced hardcoded floors with data-driven 4-tier flooring assigner');
}

// 3. UPDATE renderLocalColony CANVAS SIZING TO 520px
const oldCanvasRenderSize = `                // Ensure square canvas rendering without resetting context every frame
                if (localCanvas.width !== 480) localCanvas.width = 480;
                if (localCanvas.height !== 480) localCanvas.height = 480;
                const cw = 480;
                const ch = 480;
                localCtx.clearRect(0, 0, cw, ch);

            const baseCellSize = 480 / LOCAL_MAP_SIZE; // 15px`;

const newCanvasRenderSize = `                // Ensure square canvas rendering without resetting context every frame
                if (localCanvas.width !== 520) localCanvas.width = 520;
                if (localCanvas.height !== 520) localCanvas.height = 520;
                const cw = 520;
                const ch = 520;
                localCtx.clearRect(0, 0, cw, ch);

            const baseCellSize = cw / LOCAL_MAP_SIZE;`;

if (content.includes(oldCanvasRenderSize)) {
    content = content.replace(oldCanvasRenderSize, newCanvasRenderSize);
    console.log('[3/4] Updated renderLocalColony canvas sizing to 520px');
}

// 4. UPDATE handleLocalCanvasClick & updateLocalInspectBox
const oldCanvasClick = `        function handleLocalCanvasClick(event) {
            handleLocalCanvasHover(event);
            const gx = localHoverCell.x;
            const gy = localHoverCell.y;
            if (activeTerrainBrush && localColonyGrid[gy] && localColonyGrid[gy][gx]) {
                paintCell(gx, gy, activeTerrainBrush);
                return;
            }
            const hitPawn = DEPLOYED_COLONISTS.find(p => Math.abs(p.x - gx) < 0.9 && Math.abs(p.y - gy) < 0.9);
            if (hitPawn) {
                selectArchetype(hitPawn.arch);
            }
        }`;

const newCanvasClick = `        function handleLocalCanvasClick(event) {
            handleLocalCanvasHover(event);
            const gx = localHoverCell.x;
            const gy = localHoverCell.y;
            if (activeTerrainBrush && localColonyGrid[gy] && localColonyGrid[gy][gx]) {
                paintCell(gx, gy, activeTerrainBrush);
                return;
            }
            const hitPawnIdx = DEPLOYED_COLONISTS.findIndex(p => Math.abs(p.x - (gx + 0.5)) < 0.9 && Math.abs(p.y - (gy + 0.5)) < 0.9);
            if (hitPawnIdx !== -1) {
                selectColonist(hitPawnIdx);
                return;
            }
            if (selectedColonistIdx !== null && DEPLOYED_COLONISTS[selectedColonistIdx]) {
                const cell = localColonyGrid[gy]?.[gx];
                if (cell && !cell.isWall && !cell.isLava) {
                    const pawn = DEPLOYED_COLONISTS[selectedColonistIdx];
                    pawn.targetX = gx + 0.5;
                    pawn.targetY = gy + 0.5;
                    pawn.isWalking = true;
                    pawn.activeTask = 'moving';
                    playTactileSound('click');
                    showColonyToast(\`🚶 \${pawn.name.split(' ')[0]} pathing to [\${gx}, \${gy}]\`, 'var(--accent-cyan)');
                    renderLocalColony();
                }
            }
        }`;

if (content.includes(oldCanvasClick)) {
    content = content.replace(oldCanvasClick, newCanvasClick);
    console.log('[4/4] Injected click-to-move colonist command handling');
}

// Update updateLocalInspectBox to populate #room-impress-panel
const oldInspectBoxCode = `            const cellRoom = getRoomAtCell(gx, gy);
            if (cellRoom) {
                statusStr += \` · <span style="color: \${cellRoom.borderColor}; font-weight: bold;">[ROOM: \${cellRoom.badge}]</span>\`;
            }`;

const newInspectBoxCode = `            const cellRoom = getRoomAtCell(gx, gy) || (COLONY_ROOM_DEFS.length ? COLONY_ROOM_DEFS[0] : null);
            if (cellRoom) {
                statusStr += \` · <span style="color: \${cellRoom.borderColor}; font-weight: bold;">[ROOM: \${cellRoom.badge}]</span>\`;
                const rNameEl = document.getElementById('room-name');
                const rBadgeEl = document.getElementById('room-tier-badge');
                const rValEl = document.getElementById('room-impress-val');
                const rFillEl = document.getElementById('room-meter-fill');
                const rSpaceEl = document.getElementById('room-space-val');
                const rBeautyEl = document.getElementById('room-beauty-val');
                const rCleanEl = document.getElementById('room-clean-val');
                const rTempEl = document.getElementById('room-temp-val');
                const rBuffsEl = document.getElementById('room-mood-buffs');

                if (rNameEl) rNameEl.innerText = cellRoom.name.toUpperCase();
                if (rBadgeEl) rBadgeEl.innerText = cellRoom.tierName || "TIER 1 SUBSISTENCE";
                if (rValEl) {
                    const imp = cellRoom.impressiveness || 120;
                    const ratingStr = imp >= 140 ? 'Extravagantly Impressive' : imp >= 110 ? 'Very Impressive' : 'Decent';
                    rValEl.innerText = \`\${imp} (\${ratingStr})\`;
                }
                if (rFillEl) {
                    rFillEl.style.width = \`\${Math.min(100, Math.round((cellRoom.impressiveness || 120) / 1.8))}%\`;
                }
                if (rSpaceEl) rSpaceEl.innerText = \`\${cellRoom.space || (cellRoom.w * cellRoom.h * 2)} m²\`;
                if (rBeautyEl) rBeautyEl.innerText = \`+\${cellRoom.beauty || 35}\`;
                if (rCleanEl) rCleanEl.innerText = \`\${(cellRoom.cleanliness || 0.92).toFixed(2)} Clean\`;
                if (rTempEl) rTempEl.innerText = \`\${cell.temp}°C\`;
                if (rBuffsEl && cellRoom.moodBuff) {
                    rBuffsEl.innerHTML = \`<span class="mood-buff-tag">\${cellRoom.moodBuff}</span><span class="mood-buff-tag" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #7dd3fc;">+4 Well-Lit</span><span class="mood-buff-tag" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); color: #fcd34d;">+3 Room Impressiveness</span>\`;
                }
            }`;

if (content.includes(oldInspectBoxCode)) {
    content = content.replace(oldInspectBoxCode, newInspectBoxCode);
    console.log('[Extra] Injected Room Inspector live telemetry update');
}

// Convert back to CRLF if originally present
if (hadCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully completed patch_gameplay_upgrades.cjs');
