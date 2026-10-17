# 32: Colonist Comfort Need and Dining Etiquette

**Status:** in-progress
**Blocked by:** 31
**Priority:** High
**Owner:** Spark DRI (:8877) + RTX 5090 Blackwell (:8080)

## Context & Objectives
Implement colonist comfort decay and table dining etiquette. Colonists eating without a table must receive a negative mood modifier, while dining at a table in an impressive dining room applies comfort and mood restoration based on the room's impressiveness factor.

## Architectural Boundaries (ADR 0002)
- Implement in dedicated header `Code/EnginePlugins/ColonyPlugin/ColonyComfortComponent.h` and `.cpp`.
- Must query `ColonyRoomRoleSystem` via public accessor on `ezColonyWorldModule`.

## Deterministic Verification Checkpoints
- `checkpoint: colonist comfort need decay and chair restoration ok`
- `checkpoint: eating without table negative thought applied ok`
- `checkpoint: dining in impressive hall mood buff applied ok`

## Acceptance Gate
- Binary return code: `$LASTEXITCODE -eq 0`
- All sentinels verified in `ColonyPluginTest.exe`
- MSVC C++20 build clean
