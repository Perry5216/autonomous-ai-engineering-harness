const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../docs/showcase/index.html');
let content = fs.readFileSync(targetPath, 'utf8');

const hadCRLF = content.includes('\r\n');
content = content.replace(/\r\n/g, '\n');

// 1. INJECT ROOM OVERLAY BEFORE // 4. Draw Pawns Deployed on the Local Grid
const targetPawnsHeader = `            // 4. Draw Pawns Deployed on the Local Grid
            if (showLocalPawns) {`;

const newRoomsOverlayAndPawns = `            // 3.5 Draw Room Zoning Overlay & Impressiveness Badges (RimWorld / Dwarf Fortress style)
            if (showLocalRooms) {
                COLONY_ROOM_DEFS.forEach(r => {
                    const rx = (r.x + off.x) * cellSize - offsetX;
                    const ry = (r.y + off.y) * cellSize - offsetY;
                    const rw = r.w * cellSize;
                    const rh = r.h * cellSize;

                    if (rx + rw < 0 || rx > cw || ry + rh < 0 || ry > ch) return;

                    // Subtle room ambient tint
                    localCtx.fillStyle = r.color || "rgba(245, 158, 11, 0.05)";
                    localCtx.fillRect(rx, ry, rw, rh);

                    // Room boundary dashed outline
                    localCtx.strokeStyle = r.borderColor || "rgba(245, 158, 11, 0.4)";
                    localCtx.lineWidth = 1;
                    localCtx.setLineDash([4, 4]);
                    localCtx.strokeRect(rx + 1, ry + 1, rw - 2, rh - 2);
                    localCtx.setLineDash([]);

                    // Tactical Room Tag in top corner
                    localCtx.font = "bold 8px monospace";
                    const badgeText = \`[\${r.name.split(' ')[0].toUpperCase()} // \${r.tierName ? r.tierName.split(':')[0] : 'T1'}]\`;
                    const btw = localCtx.measureText(badgeText).width;
                    localCtx.fillStyle = "rgba(4, 7, 14, 0.88)";
                    localCtx.fillRect(rx + 3, ry + 3, btw + 6, 11);
                    localCtx.fillStyle = r.borderColor || "#f59e0b";
                    localCtx.fillText(badgeText, rx + 6, ry + 11);
                });
            }

            // 4. Draw Pawns Deployed on the Local Grid
            if (showLocalPawns) {`;

if (content.includes(targetPawnsHeader)) {
    content = content.replace(targetPawnsHeader, newRoomsOverlayAndPawns);
    console.log('[1/3] Injected Room Zoning Overlay into renderLocalColony');
}

// 2. INJECT COLONIST CLICK-TO-MOVE PATHING & SELECTION HALO IN showLocalPawns LOOP
const targetPawnLoopStart = `            if (showLocalPawns) {
                DEPLOYED_COLONISTS.forEach((pawn, pIdx) => {
                    const px = pawn.x * cellSize - offsetX;
                    const py = pawn.y * cellSize - offsetY;`;

const newPawnLoopStart = `            if (showLocalPawns) {
                DEPLOYED_COLONISTS.forEach((pawn, pIdx) => {
                    // Real-time colonist click-to-move pathing with obstacle sliding
                    if (pawn.isWalking && pawn.targetX !== undefined && pawn.targetY !== undefined) {
                        const cdx = pawn.targetX - pawn.x;
                        const cdy = pawn.targetY - pawn.y;
                        const cdist = Math.hypot(cdx, cdy);
                        if (cdist > 0.08) {
                            const speed = 0.038;
                            const cvx = (cdx / cdist) * speed;
                            const cvy = (cdy / cdist) * speed;
                            resolveContinuousMove(pawn, cvx, cvy, 0.32, false);
                        } else {
                            pawn.isWalking = false;
                            pawn.x = pawn.targetX;
                            pawn.y = pawn.targetY;
                            playTactileSound('click');
                        }
                    }

                    const px = pawn.x * cellSize - offsetX;
                    const py = pawn.y * cellSize - offsetY;`;

if (content.includes(targetPawnLoopStart)) {
    content = content.replace(targetPawnLoopStart, newPawnLoopStart);
    console.log('[2/3] Injected colonist click-to-move pathing in showLocalPawns');
}

// Add selection ring & path line right after pawn shadow
const targetPawnShadow = `                    // Tactical shadow beneath pawn
                    localCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    localCtx.beginPath();
                    localCtx.ellipse(px + cellSize * 0.5, py + cellSize * 0.88, cellSize * 0.45, cellSize * 0.2, 0, 0, Math.PI * 2);
                    localCtx.fill();

                    // Selected pawn aura
                    if (pawn.arch === currentArchetype) {`;

const newPawnShadowAndHalo = `                    // Tactical shadow beneath pawn
                    localCtx.fillStyle = "rgba(0, 0, 0, 0.7)";
                    localCtx.beginPath();
                    localCtx.ellipse(px + cellSize * 0.5, py + cellSize * 0.88, cellSize * 0.45, cellSize * 0.2, 0, 0, Math.PI * 2);
                    localCtx.fill();

                    // Selected colonist tactical ring and path line
                    if (selectedColonistIdx === pIdx) {
                        localCtx.strokeStyle = "var(--accent-cyan)";
                        localCtx.lineWidth = 2;
                        localCtx.beginPath();
                        localCtx.arc(px + cellSize * 0.5, py + cellSize * 0.5, cellSize * 0.65, 0, Math.PI * 2);
                        localCtx.stroke();

                        if (pawn.isWalking && pawn.targetX !== undefined) {
                            const tpx = pawn.targetX * cellSize - offsetX;
                            const tpy = pawn.targetY * cellSize - offsetY;
                            localCtx.strokeStyle = "rgba(56, 189, 248, 0.75)";
                            localCtx.lineWidth = 1.5;
                            localCtx.setLineDash([3, 3]);
                            localCtx.beginPath();
                            localCtx.moveTo(px + cellSize * 0.5, py + cellSize * 0.5);
                            localCtx.lineTo(tpx, tpy);
                            localCtx.stroke();
                            localCtx.setLineDash([]);

                            localCtx.strokeStyle = "var(--accent-cyan)";
                            localCtx.strokeRect(tpx - 4, tpy - 4, 8, 8);
                        }
                    }

                    // Selected pawn aura
                    if (pawn.arch === currentArchetype) {`;

if (content.includes(targetPawnShadow)) {
    content = content.replace(targetPawnShadow, newPawnShadowAndHalo);
    console.log('[Extra] Injected tactical selection ring and path line for selected colonist');
}

// 3. REPLACE OLD DRONE BOUNDS LOOP WITH resolveContinuousMove
const oldDronePhysicsTarget = `            DEPLOYED_DRONES.forEach((drone) => {
                if (drone.x === undefined) drone.x = drone.baseX;
                if (drone.y === undefined) drone.y = drone.baseY;
                if (drone.vx === undefined) drone.vx = 0.018;
                if (drone.vy === undefined) drone.vy = 0.014;

                const bounds = DRONE_FACILITY_BOUNDS[drone.key];

                // If drone ever drifts or was initialized outside room airspace, clamp immediately inside
                if (bounds) {
                    if (drone.x < bounds.minX) { drone.x = bounds.minX; drone.vx = Math.abs(drone.vx || 0.018); }
                    if (drone.x > bounds.maxX) { drone.x = bounds.maxX; drone.vx = -Math.abs(drone.vx || 0.018); }
                    if (drone.y < bounds.minY) { drone.y = bounds.minY; drone.vy = Math.abs(drone.vy || 0.014); }
                    if (drone.y > bounds.maxY) { drone.y = bounds.maxY; drone.vy = -Math.abs(drone.vy || 0.014); }
                }

                const hoverBob = (drone.altitude > 0 && !isEmpActive) 
                    ? Math.sin((droneAnimTick * 3 + drone.x * 2)) * (cellSize * 0.08) 
                    : 0;

                // Physics update: only move if not disabled by EMP
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

const newDronePhysics = `            DEPLOYED_DRONES.forEach((drone) => {
                if (drone.x === undefined) drone.x = drone.baseX;
                if (drone.y === undefined) drone.y = drone.baseY;
                if (drone.vx === undefined) drone.vx = 0.018;
                if (drone.vy === undefined) drone.vy = 0.014;

                const hoverBob = (drone.altitude > 0 && !isEmpActive) 
                    ? Math.sin((droneAnimTick * 3 + drone.x * 2)) * (cellSize * 0.08) 
                    : 0;

                // Physics update with Continuous Swept Collision:
                // Airborne drones glide smoothly over tables and furniture, and bounce off walls!
                // Ground sentry rover collides with walls and ground obstacles!
                if (!isEmpActive && drone.state !== 'idle') {
                    const speedMultiplier = (drone.state === 'rogue' || droneNetworkState === 'ROGUE') ? 1.4 : 1.0;
                    const stepVx = drone.vx * speedMultiplier;
                    const stepVy = drone.vy * speedMultiplier;
                    const isAirborne = (drone.altitude > 0);
                    resolveContinuousMove(drone, stepVx, stepVy, isAirborne ? 0.28 : 0.38, isAirborne);
                }`;

if (content.includes(oldDronePhysicsTarget)) {
    content = content.replace(oldDronePhysicsTarget, newDronePhysics);
    console.log('[3/3] Upgraded drone physics to continuous swept collision engine');
}

// Convert back to CRLF if needed
if (hadCRLF) {
    content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully applied patch_render_and_movement.cjs');
