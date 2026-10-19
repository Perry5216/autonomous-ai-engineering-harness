const fs = require('fs');
const vm = require('vm');

const srcPath = 'C:/Users/5216p/ezEngine/Data/Samples/ColonyView/UI/Pawn_and_WorldMap_Showcase.html';
const dest1 = 'c:/Users/5216p/Projects/autonomous-ai-engineering-harness/docs/showcase/Pawn_and_WorldMap_Showcase.html';
const dest2 = 'c:/Users/5216p/Projects/autonomous-ai-engineering-harness/docs/showcase/index.html';

console.log('Reading from:', srcPath);
let content = fs.readFileSync(srcPath, 'utf8');
const hadCRLF = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

// 1. Update Room Flooring & Dynamic Walls in loadLocalColonySector
const oldRoomBlock = `            // 1. Assign room-specific flooring
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
            });

            // 2. Identify designated blast hatch doorways
            const doorwaySet = new Set();
            COLONY_ROOM_DEFS.forEach(r => {
                r.doors.forEach(d => {
                    doorwaySet.add(\`\${d.x + off.x},\${d.y + off.y}\`);
                });
            });

            // Helper to place Plasteel Blast Walls
            function placeRoomWall(gx, gy) {
                if (gx < 2 || gx >= LOCAL_MAP_SIZE - 2 || gy < 2 || gy >= LOCAL_MAP_SIZE - 2) return;
                if (doorwaySet.has(\`\${gx},\${gy}\`)) {
                    const c = localColonyGrid[gy][gx];
                    c.isWall = false;
                    c.isDoorway = true;
                    c.walkSpeed = 100;
                    return;
                }
                const c = localColonyGrid[gy][gx];
                c.isWall = true;
                c.isAuto = true;
                c.autoPrefix = "wall_plasteel";
                c.terrain = "precursor_plasteel_wall";
                c.walkSpeed = 0;
            }

            // Mess Hall perimeter walls
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

const newRoomBlock = `            // 1. Assign room-specific flooring & metadata
            COLONY_ROOM_DEFS.forEach(room => {
                const rx = room.x + off.x;
                const ry = room.y + off.y;
                for (let y = ry; y < ry + room.h; y++) {
                    for (let x = rx; x < rx + room.w; x++) {
                        if (y < 0 || y >= LOCAL_MAP_SIZE || x < 0 || x >= LOCAL_MAP_SIZE) continue;
                        const cell = localColonyGrid[y][x];
                        if (cell.isWall) continue;
                        cell.roomId = room.id;
                        cell.roomDef = room;

                        const floorKey = room.floorType || 'floor_basalt';
                        if (floorKey === 'floor_plating') {
                            cell.terrain = "precursor_alloy_floor";
                            cell.floorSpriteKey = \`floor_plating_\${getFloorVariantIndex(x, y, currentSeed, 4)}\`;
                        } else if (floorKey === 'floor_spore') {
                            cell.terrain = "spore_humus";
                            cell.floorSpriteKey = \`floor_spore_\${getFloorVariantIndex(x, y, currentSeed, 4)}\`;
                        } else if (floorKey === 'floor_hazard') {
                            cell.terrain = "hazard_plating";
                            cell.floorSpriteKey = ((x + y) % 2 === 0) ? "floor_hazard_0" : "floor_grate";
                        } else if (floorKey === 'floor_grate') {
                            cell.terrain = "catwalk_grate";
                            cell.floorSpriteKey = "floor_grate";
                        } else {
                            cell.terrain = "excavated_basalt";
                            cell.floorSpriteKey = \`floor_basalt_\${getFloorVariantIndex(x, y, currentSeed, 8)}\`;
                        }
                    }
                }
            });

            // 2. Identify designated blast hatch doorways
            const doorwaySet = new Set();
            COLONY_ROOM_DEFS.forEach(r => {
                if (r.doors) {
                    r.doors.forEach(d => {
                        doorwaySet.add(\`\${d.x + off.x},\${d.y + off.y}\`);
                    });
                }
            });

            // Helper to place Plasteel Blast Walls
            function placeRoomWall(gx, gy) {
                if (gx < 2 || gx >= LOCAL_MAP_SIZE - 2 || gy < 2 || gy >= LOCAL_MAP_SIZE - 2) return;
                if (doorwaySet.has(\`\${gx},\${gy}\`)) {
                    const c = localColonyGrid[gy][gx];
                    c.isWall = false;
                    c.isDoorway = true;
                    c.walkSpeed = 100;
                    return;
                }
                const c = localColonyGrid[gy][gx];
                c.isWall = true;
                c.isAuto = true;
                c.autoPrefix = "wall_plasteel";
                c.terrain = "precursor_plasteel_wall";
                c.walkSpeed = 0;
            }

            // Data-driven perimeter blast walls for all registered rooms
            COLONY_ROOM_DEFS.forEach(room => {
                const rx = room.x + off.x;
                const ry = room.y + off.y;
                for (let x = rx; x <= rx + room.w; x++) {
                    placeRoomWall(x, ry);
                    placeRoomWall(x, ry + room.h);
                }
                for (let y = ry; y <= ry + room.h; y++) {
                    placeRoomWall(rx, y);
                    placeRoomWall(rx + room.w, y);
                }
            });`;

if (content.includes(oldRoomBlock)) {
    content = content.replace(oldRoomBlock, newRoomBlock);
    console.log('[Polish 1] Replaced hardcoded room walls with data-driven room perimeter walls and flooring');
}

// 2. Update Drone Physics in renderLocalColony
const oldDroneSection = `                // Physics update: only move if not disabled by EMP
                if (!isEmpActive && drone.state !== 'idle') {
                    const speedMultiplier = (drone.state === 'rogue' || droneNetworkState === 'ROGUE') ? 1.4 : 1.0;
                    const stepVx = drone.vx * speedMultiplier;
                    const stepVy = drone.vy * speedMultiplier;

                    if (drone.altitude > 0 && bounds) {
                        // AIRBORNE DRONES (Sanitation, Agronomy, Hauler):
                        // - Freely glide OVER tables, chairs, desks, conveyors, and floor crates
                        // - Strictly contained within room boundaries: IMPOSSIBLE to penetrate or pass through walls!
                        const nextX = drone.x + stepVx;
                        if (nextX <= bounds.minX) {
                            drone.x = bounds.minX;
                            drone.vx = Math.abs(drone.vx);
                        } else if (nextX >= bounds.maxX) {
                            drone.x = bounds.maxX;
                            drone.vx = -Math.abs(drone.vx);
                        } else {
                            drone.x = nextX;
                        }

                        const nextY = drone.y + stepVy;
                        if (nextY <= bounds.minY) {
                            drone.y = bounds.minY;
                            drone.vy = Math.abs(drone.vy);
                        } else if (nextY >= bounds.maxY) {
                            drone.y = bounds.maxY;
                            drone.vy = -Math.abs(drone.vy);
                        } else {
                            drone.y = nextY;
                        }
                    } else {
                        // GROUND VEHICLES (Tread-Warden Sentry Rover, altitude === 0):
                        // - Ground treads blocked by walls AND solid machinery/tables
                        const roverRad = 0.38;
                        const nextX = drone.x + stepVx;
                        const probeX = nextX + (stepVx > 0 ? roverRad : -roverRad);
                        if (bounds && (nextX <= bounds.minX || nextX >= bounds.maxX || isPositionBlocked(probeX, drone.y, 0.12))) {
                            drone.vx = (drone.vx > 0 ? -1 : 1) * Math.abs(drone.vx);
                        } else {
                            drone.x = nextX;
                        }

                        const nextY = drone.y + stepVy;
                        const probeY = nextY + (stepVy > 0 ? roverRad : -roverRad);
                        if (bounds && (nextY <= bounds.minY || nextY >= bounds.maxY || isPositionBlocked(drone.x, probeY, 0.12))) {
                            drone.vy = (drone.vy > 0 ? -1 : 1) * Math.abs(drone.vy);
                        } else {
                            drone.y = nextY;
                        }
                    }
                }`;

const newDroneSection = `                // Physics update: only move if not disabled by EMP
                if (!isEmpActive && drone.state !== 'idle') {
                    const speedMultiplier = (drone.state === 'rogue' || droneNetworkState === 'ROGUE') ? 1.4 : 1.0;
                    const stepVx = drone.vx * speedMultiplier;
                    const stepVy = drone.vy * speedMultiplier;

                    if (drone.altitude > 0) {
                        // AIRBORNE DRONES (Sanitation, Agronomy, Hauler):
                        // - Freely glide OVER tables, chairs, desks, conveyors, and floor crates
                        // - Strictly bounce off solid rock walls and blast walls using continuous swept collision
                        resolveContinuousMove(drone, stepVx, stepVy, 0.35, true);
                    } else {
                        // GROUND VEHICLES (Tread-Warden Sentry Rover, altitude === 0):
                        // - Blocked by walls AND solid machinery/tables
                        resolveContinuousMove(drone, stepVx, stepVy, 0.38, false);
                    }
                }`;

if (content.includes(oldDroneSection)) {
    content = content.replace(oldDroneSection, newDroneSection);
    console.log('[Polish 2] Updated drone physics to use resolveContinuousMove');
}

// 3. Update handleLocalCanvasClick
const oldClickFunc = `        function handleLocalCanvasClick(event) {
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

const newClickFunc = `        function handleLocalCanvasClick(event) {
            handleLocalCanvasHover(event);
            const gx = localHoverCell.x;
            const gy = localHoverCell.y;

            if (gx < 0 || gx >= LOCAL_MAP_SIZE || gy < 0 || gy >= LOCAL_MAP_SIZE) return;

            // Check if clicked directly on a colonist
            const hitPawnIdx = DEPLOYED_COLONISTS.findIndex(p => Math.abs(p.x - gx) < 0.9 && Math.abs(p.y - gy) < 0.9);
            if (hitPawnIdx !== -1) {
                selectColonist(hitPawnIdx);
                return;
            }

            // If a terrain brush is active, paint
            if (activeTerrainBrush && localColonyGrid[gy] && localColonyGrid[gy][gx]) {
                paintCell(gx, gy, activeTerrainBrush);
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

            updateLocalInspectBox(gx, gy);
        }`;

if (content.includes(oldClickFunc)) {
    content = content.replace(oldClickFunc, newClickFunc);
    console.log('[Polish 3] Updated handleLocalCanvasClick for colonist selection and pathing');
}

// 4. Update updateLocalInspectBox to also update Room Impressiveness Card
const oldInspectEnd = `            const inspectBox = document.getElementById('local-inspect-box');
            if (inspectBox) {
                inspectBox.innerHTML = statusStr;
            }
        }`;

const newInspectEnd = `            const inspectBox = document.getElementById('local-inspect-box');
            if (inspectBox) {
                inspectBox.innerHTML = statusStr;
            }

            // Update RimWorld / Dwarf Fortress Room Impressiveness Card
            const r = cell.roomDef || (cellRoom ? COLONY_ROOM_DEFS.find(rm => rm.id === cellRoom.id) : null);
            if (r) {
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
                if (rMeter) rMeter.style.width = \`\${Math.min(100, Math.max(10, Math.round(r.impressiveness / 2)))}%\`;
                if (rSpace) rSpace.innerText = \`\${r.space || (r.w * r.h)} m²\`;
                if (rBeauty) rBeauty.innerText = \`+\${r.beauty || 25}\`;
                if (rClean) rClean.innerText = \`\${r.cleanliness || 0.95} Clean\`;
                if (rTemp) rTemp.innerText = \`\${cell.temp || 22.4}°C\`;
                if (rBuffs && r.moodBuff) {
                    rBuffs.innerHTML = \`<span class="mood-buff-tag">\${r.moodBuff}</span><span class="mood-buff-tag" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #7dd3fc;">+5 Lithophone Joy</span><span class="mood-buff-tag" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); color: #fcd34d;">+4 Well-Lit</span>\`;
                }
            }
        }`;

if (content.includes(oldInspectEnd)) {
    content = content.replace(oldInspectEnd, newInspectEnd);
    console.log('[Polish 4] Injected live Room Impressiveness updates into updateLocalInspectBox');
}

// Convert line endings back if needed
if (hadCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

// Validate syntax
const scripts = content.match(/<script>([\s\S]*?)<\/script>/gi);
if (scripts) {
    scripts.forEach((s, idx) => {
        const code = s.replace(/<\/?script>/gi, '');
        new vm.Script(code);
        console.log('Script ' + idx + ' validated (' + code.length + ' chars)');
    });
}

// Write to all three locations
fs.writeFileSync(srcPath, content, 'utf8');
console.log('Successfully updated:', srcPath);

fs.writeFileSync(dest1, content, 'utf8');
console.log('Successfully updated:', dest1);

fs.writeFileSync(dest2, content, 'utf8');
console.log('Successfully updated:', dest2);

console.log('ALL THREE SHOWCASE FILES ARE FINALIZED AND SYNCHRONIZED!');
