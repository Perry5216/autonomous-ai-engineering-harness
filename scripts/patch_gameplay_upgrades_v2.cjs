const fs = require('fs');
const vm = require('vm');

const srcPath = 'C:/Users/5216p/ezEngine/Data/Samples/ColonyView/UI/Pawn_and_WorldMap_Showcase.html';
const dest1 = 'c:/Users/5216p/Projects/autonomous-ai-engineering-harness/docs/showcase/Pawn_and_WorldMap_Showcase.html';
const dest2 = 'c:/Users/5216p/Projects/autonomous-ai-engineering-harness/docs/showcase/index.html';

console.log('Reading from:', srcPath);
let content = fs.readFileSync(srcPath, 'utf8');
const hadCRLF = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

// =========================================================================
// 1. UPDATE loadLocalColonySector: ROOM CARVE WITH AUTHENTIC FLOORS
// =========================================================================
const oldCarve = `            // 2. Carve and Autotile Registered Rooms with Plasteel Walls
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

const newCarve = `            // 2. Carve and Autotile Registered Rooms with Plasteel Walls & Authentic Floors
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

if (content.includes(oldCarve)) {
    content = content.replace(oldCarve, newCarve);
    console.log('[v2 Step 1] Updated room carving with authentic floors and roomDef metadata');
}

// =========================================================================
// 2. INJECT ROOM ZONING OVERLAY AND COLONIST MOVEMENT IN renderLocalColony
// =========================================================================
const oldPrePawns = `            // 3. Tactical Grid Lines applied strictly to excavated floor cells in Pass 1 to preserve monolithic rock mass

            // 4. Draw Pawns Deployed on the Local Grid`;

const newPrePawns = `            // 3. Tactical Grid Lines applied strictly to excavated floor cells in Pass 1 to preserve monolithic rock mass

            // 3.2 Draw Room Zoning Overlays (RimWorld & Dwarf Fortress style)
            if (showLocalRooms && COLONY_ROOM_DEFS) {
                COLONY_ROOM_DEFS.forEach(room => {
                    const rx = room.x * cellSize - offsetX;
                    const ry = room.y * cellSize - offsetY;
                    const rw = room.w * cellSize;
                    const rh = room.h * cellSize;

                    if (rx + rw < 0 || rx > cw || ry + rh < 0 || ry > ch) return;

                    // Soft ambient room tint
                    localCtx.fillStyle = room.color || "rgba(56, 189, 248, 0.06)";
                    localCtx.fillRect(rx, ry, rw, rh);

                    // Dashed zoning perimeter border
                    localCtx.save();
                    localCtx.strokeStyle = room.borderColor || "rgba(56, 189, 248, 0.4)";
                    localCtx.lineWidth = 1;
                    localCtx.setLineDash([4, 4]);
                    localCtx.strokeRect(rx + 1, ry + 1, rw - 2, rh - 2);
                    localCtx.restore();

                    // Room designation badge
                    localCtx.font = "bold 8px monospace";
                    const bText = room.badge || room.name.toUpperCase();
                    const tw = localCtx.measureText(bText).width;
                    localCtx.fillStyle = "rgba(4, 7, 14, 0.85)";
                    localCtx.fillRect(rx + 4, ry + 4, tw + 8, 12);
                    localCtx.strokeStyle = room.borderColor || "rgba(56, 189, 248, 0.4)";
                    localCtx.lineWidth = 0.8;
                    localCtx.strokeRect(rx + 4, ry + 4, tw + 8, 12);
                    localCtx.fillStyle = room.borderColor || "#38bdf8";
                    localCtx.fillText(bText, rx + 8, ry + 13);
                });
            }

            // 3.5 Update Colonist Movement & Continuous Obstacle Sliding
            DEPLOYED_COLONISTS.forEach((colonist) => {
                if (colonist.isWalking && (colonist.targetX !== undefined) && (colonist.targetY !== undefined)) {
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
                        if (colonist.activeTask && colonist.activeTask !== 'idle' && colonist.activeTask !== 'move') {
                            showColonyToast(\`✅ \${colonist.name.split(' ')[0]} reached workstation for \${colonist.activeTask.toUpperCase()}!\`, 'var(--accent-green)');
                        }
                    }
                }
            });

            // 4. Draw Pawns Deployed on the Local Grid`;

if (content.includes(oldPrePawns)) {
    content = content.replace(oldPrePawns, newPrePawns);
    console.log('[v2 Step 2] Injected room overlays and colonist continuous movement updates');
}

// =========================================================================
// 3. INJECT SELECTION HALO AND DESTINATION CROSSHAIRS IN PAWN DRAW LOOP
// =========================================================================
const oldPawnAura = `                    // Selected pawn aura
                    if (pawn.arch === currentArchetype) {
                        localCtx.strokeStyle = "var(--accent-amber)";
                        localCtx.lineWidth = 2;
                        localCtx.beginPath();
                        localCtx.ellipse(px + cellSize * 0.5, py + cellSize * 0.88, cellSize * 0.52, cellSize * 0.24, 0, 0, Math.PI * 2);
                        localCtx.stroke();
                    }`;

const newPawnAura = `                    // Selected pawn aura & Tactical Destination Line
                    const isSelected = (selectedColonistIdx !== null && DEPLOYED_COLONISTS[selectedColonistIdx] === pawn);
                    if (pawn.arch === currentArchetype || isSelected) {
                        localCtx.strokeStyle = isSelected ? "var(--accent-cyan)" : "var(--accent-amber)";
                        localCtx.lineWidth = 2;
                        localCtx.beginPath();
                        localCtx.ellipse(px + cellSize * 0.5, py + cellSize * 0.88, cellSize * 0.52, cellSize * 0.24, 0, 0, Math.PI * 2);
                        localCtx.stroke();

                        // Draw pathing destination line and target crosshair
                        if (pawn.isWalking && pawn.targetX !== undefined && pawn.targetY !== undefined) {
                            const targetPx = pawn.targetX * cellSize - offsetX;
                            const targetPy = pawn.targetY * cellSize - offsetY;
                            localCtx.save();
                            localCtx.strokeStyle = "rgba(56, 189, 248, 0.75)";
                            localCtx.setLineDash([4, 4]);
                            localCtx.lineWidth = 1.5;
                            localCtx.beginPath();
                            localCtx.moveTo(px + cellSize * 0.5, py + cellSize * 0.5);
                            localCtx.lineTo(targetPx, targetPy);
                            localCtx.stroke();
                            localCtx.setLineDash([]);

                            // Target Crosshair
                            localCtx.strokeStyle = "#38bdf8";
                            localCtx.beginPath();
                            localCtx.arc(targetPx, targetPy, 5, 0, Math.PI * 2);
                            localCtx.moveTo(targetPx - 8, targetPy); localCtx.lineTo(targetPx + 8, targetPy);
                            localCtx.moveTo(targetPx, targetPy - 8); localCtx.lineTo(targetPx, targetPy + 8);
                            localCtx.stroke();
                            localCtx.restore();
                        }
                    }`;

if (content.includes(oldPawnAura)) {
    content = content.replace(oldPawnAura, newPawnAura);
    console.log('[v2 Step 3] Injected colonist selection aura and pathing crosshairs');
}

// =========================================================================
// 4. UPDATE DRONE PHYSICS WITH resolveContinuousMove (SCALE-INDEPENDENT)
// =========================================================================
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
    console.log('[v2 Step 4] Updated drone physics to use scale-independent resolveContinuousMove');
}

// =========================================================================
// 5. UPDATE handleLocalCanvasClick
// =========================================================================
const oldClickFunc = `        function handleLocalCanvasClick(e) {
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

const newClickFunc = `        function handleLocalCanvasClick(e) {
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

if (content.includes(oldClickFunc)) {
    content = content.replace(oldClickFunc, newClickFunc);
    console.log('[v2 Step 5] Injected colonist selection & click-to-move in handleLocalCanvasClick');
}

// =========================================================================
// 6. UPDATE updateLocalInspectBox WITH LIVE ROOM IMPRESSIVENESS CARD
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
                let hazardText = cell.isLava ? " · <span style=\\"color:var(--accent-red);font-weight:bold;\\">[HAZARD: MOLTEN LAVA]</span>" : (cell.isIce ? " · [SURFACE: CRYO PERMAFROST]" : "");
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
                if (rMeter) rMeter.style.width = \`\${Math.min(100, Math.max(10, Math.round(r.impressiveness / 2)))}%\`;
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
    console.log('[v2 Step 6] Updated updateLocalInspectBox with live Room Impressiveness updates');
}

// Convert line endings back if needed
if (hadCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

// =========================================================================
// VALIDATE SYNTAX
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
console.log('Successfully updated:', srcPath);

fs.writeFileSync(dest1, content, 'utf8');
console.log('Successfully updated:', dest1);

fs.writeFileSync(dest2, content, 'utf8');
console.log('Successfully updated:', dest2);

console.log('ALL THREE SHOWCASE FILES ARE COMPLETELY UPGRADED AND VALIDATED!');
