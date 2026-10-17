# 31: 5-Factor Room Impressiveness and Role Classification

**Status:** done
**Blocked by:** 30
**Priority:** High
**Owner:** Spark DRI (:8877) + RTX 5090 Blackwell (:8080)

## Context & Objectives
Implement 5-factor room impressiveness calculation (Space, Cleanliness, Beauty, Wealth, Luxury) and hierarchical role classification (Bedroom, Barracks, Dining Room, Recreation Room, Hospital, Laboratory, Workshop, Kitchen, Tomb) in ezEngine.

## Architectural Boundaries (ADR 0002)
- Implement in dedicated header `Code/EnginePlugins/ColonyPlugin/ColonyRoomRoleSystem.h` and `.cpp`.
- Integrate via `ezColonyWorldModule::GetRoomRoleSystem()`.
- Zero god-class pollution in `ColonyWorldModule.h`.

## Deterministic Verification Checkpoints
- `checkpoint: room 5-factor impressiveness calculation ok`
- `checkpoint: room role classification hierarchy ok`
- `checkpoint: dual rec and dining hall detection ok`

## Acceptance Gate
- Binary return code: `$LASTEXITCODE -eq 0`
- All sentinels verified in `ColonyPluginTest.exe`
- MSVC C++20 build clean
